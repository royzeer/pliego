// Pagos de Pliego Pro con Mercado Pago (Checkout Pro), ligados a la cuenta.
// Cada pago lleva en external_reference el id de la cuenta. Cuando Mercado Pago lo aprueba,
// el Worker lo confirma directamente con la API de Mercado Pago, lo registra una sola vez
// en la tabla pagos y extiende el Pro de esa cuenta.
// Secretos en Cloudflare: MP_ACCESS_TOKEN y PRO_SECRET. Base de datos: DB (D1).
import { SITE, currentUser, publicUser } from "./cuentas.js";

export const PLANES = {
  mensual: { precio: 9900, dias: 30, titulo: "Pliego Pro - 1 mes" },
  anual: { precio: 99000, dias: 365, titulo: "Pliego Pro - 1 año" },
};

const MP_API = "https://api.mercadopago.com";
const DAY = 86400_000;

async function mp(env, path, init = {}) {
  const res = await fetch(MP_API + path, {
    ...init,
    headers: { authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** POST /api/pago/crear { plan } -> { url } para mandar a la persona a pagar. Necesita sesión. */
export async function crearPago(env, request, body, json) {
  const plan = PLANES[body?.plan];
  if (!plan) return json({ error: "Plan no válido." }, 400);
  const u = await currentUser(env, request);
  if (!u) return json({ error: "Inicia sesión o crea tu cuenta para comprar Pro.", cuenta: true }, 401);
  const idem = crypto.randomUUID();
  const { ok, data } = await mp(env, "/checkout/preferences", {
    method: "POST",
    headers: { "x-idempotency-key": idem },
    body: JSON.stringify({
      items: [{ id: `pro-${body.plan}`, title: plan.titulo, quantity: 1, unit_price: plan.precio, currency_id: "COP" }],
      payer: { email: u.correo },
      external_reference: `pliego:${body.plan}:${u.id}`,
      back_urls: { success: `${SITE}/pro/activar`, pending: `${SITE}/pro/activar`, failure: `${SITE}/planes?pago=rechazado` },
      auto_return: "approved",
      notification_url: `${SITE}/api/pago/aviso`,
      statement_descriptor: "PLIEGO",
    }),
  });
  if (!ok || !data.init_point) return json({ error: "No pudimos abrir el pago. Intenta de nuevo en un momento." }, 502);
  return json({ url: data.init_point });
}

/**
 * Consulta un pago en Mercado Pago y, si está aprobado y es de Pliego, lo aplica a la cuenta.
 * Es idempotente: el mismo pago nunca suma días dos veces.
 */
export async function aplicarPago(env, pagoId) {
  const id = String(pagoId || "").replace(/\D/g, "");
  if (!id) return { status: 400, error: "Falta el número del pago." };
  const { ok, status, data } = await mp(env, `/v1/payments/${id}`);
  if (status === 404) return { status: 404, error: "No encontramos ese pago en Mercado Pago." };
  if (!ok) return { status: 502, error: "No pudimos consultar el pago. Intenta de nuevo en un momento." };

  const [marca, nombrePlan, usuarioId] = String(data.external_reference || "").split(":");
  const plan = PLANES[nombrePlan];
  if (marca !== "pliego" || !plan || !usuarioId) return { status: 400, error: "Ese pago no corresponde a Pliego Pro." };
  if (data.status === "pending" || data.status === "in_process" || data.status === "authorized") {
    return { status: 200, estado: "pendiente", mensaje: "Tu pago está en proceso. Cuando Mercado Pago lo apruebe, Pro se activa solo en tu cuenta." };
  }
  if (data.status !== "approved") return { status: 402, error: "Ese pago no fue aprobado." };
  if (data.currency_id !== "COP" || Number(data.transaction_amount) < plan.precio) return { status: 400, error: "El valor del pago no coincide con el plan." };

  const ya = await env.DB.prepare("SELECT usuario FROM pagos WHERE id = ?").bind(id).first();
  if (!ya) {
    const u = await env.DB.prepare("SELECT id, pro_hasta FROM usuarios WHERE id = ?").bind(usuarioId).first();
    if (!u) return { status: 404, error: "La cuenta de ese pago ya no existe. Escríbenos a hola@pliego.lat." };
    const aprobado = Date.parse(data.date_approved || data.date_created) || Date.now();
    const desde = Math.max(aprobado, u.pro_hasta || 0);
    const hasta = desde + plan.dias * DAY;
    // INSERT OR IGNORE + condición: si dos avisos llegan a la vez, solo uno suma los días.
    const ins = await env.DB.prepare("INSERT OR IGNORE INTO pagos (id, usuario, plan, valor, aprobado) VALUES (?, ?, ?, ?, ?)")
      .bind(id, usuarioId, nombrePlan, Math.round(Number(data.transaction_amount)), aprobado).run();
    if (ins.meta?.changes) {
      await env.DB.prepare("UPDATE usuarios SET pro_plan = ?, pro_hasta = ? WHERE id = ?").bind(nombrePlan, hasta, usuarioId).run();
    }
  }
  return { status: 200, estado: "aprobado", usuarioId };
}

/** POST /api/pago/verificar { pago } -> al volver de Mercado Pago. */
export async function verificarPago(env, request, body, json) {
  const r = await aplicarPago(env, body?.pago);
  if (r.error) return json({ error: r.error }, r.status);
  const u = await currentUser(env, request);
  const mismo = u && u.id === r.usuarioId;
  return json({ estado: r.estado, mensaje: r.mensaje, usuario: mismo ? publicUser(u) : undefined, otraCuenta: !!u && !mismo });
}

/** POST /api/pago/aviso: notificación automática de Mercado Pago (webhook). */
export async function avisoPago(env, request) {
  const url = new URL(request.url);
  let body = {};
  try { body = await request.json(); } catch { /* algunos avisos vienen solo en la URL */ }
  const tipo = body.type || body.topic || url.searchParams.get("type") || url.searchParams.get("topic");
  const id = body.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id");
  if (tipo !== "payment" || !id) return new Response("ok");
  const r = await aplicarPago(env, id);
  // 5xx hace que Mercado Pago reintente más tarde
  return new Response(r.error && r.status >= 500 ? "retry" : "ok", { status: r.error && r.status >= 500 ? 503 : 200 });
}
