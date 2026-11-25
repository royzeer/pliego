// Pagos de Pliego Pro con Mercado Pago (Checkout Pro).
// No hay base de datos de usuarios: cuando un pago se aprueba, el Worker lo confirma
// directamente con Mercado Pago y entrega un código de activación firmado con PRO_SECRET.
// Secretos que se configuran en Cloudflare: MP_ACCESS_TOKEN y PRO_SECRET.

export const PLANES = {
  mensual: { precio: 9900, dias: 30, titulo: "Pliego Pro - 1 mes" },
  anual: { precio: 99000, dias: 365, titulo: "Pliego Pro - 1 año" },
};

const SITE = "https://pliego.lat";
const MP_API = "https://api.mercadopago.com";
const enc = new TextEncoder();

const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64url(sig).slice(0, 32);
}

/** Crea el código de activación: datos + firma. */
export async function firmarCodigo(secret, { plan, exp, pago }) {
  const body = b64url(enc.encode(JSON.stringify({ p: plan, e: exp, i: String(pago) })));
  return `${body}.${await hmac(secret, body)}`;
}

/** Comprueba un código. Devuelve { plan, exp, pago } o null si es falso o está vencido. */
export async function leerCodigo(secret, codigo) {
  const [body, sig] = String(codigo || "").trim().split(".");
  if (!body || !sig) return null;
  const esperado = await hmac(secret, body);
  if (esperado.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ esperado.charCodeAt(i);
  if (diff) return null;
  try {
    const d = JSON.parse(new TextDecoder().decode(fromB64url(body)));
    if (!PLANES[d.p] || !(d.e > Date.now())) return null;
    return { plan: d.p, exp: d.e, pago: d.i };
  } catch {
    return null;
  }
}

async function mp(env, path, init = {}) {
  const res = await fetch(MP_API + path, {
    ...init,
    headers: { authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** POST /api/pago/crear { plan } -> { url } para mandar a la persona a pagar. */
export async function crearPago(env, body, json) {
  const plan = PLANES[body?.plan];
  if (!plan) return json({ error: "Plan no válido." }, 400);
  const referencia = `pliego:${body.plan}:${crypto.randomUUID()}`;
  const { ok, data } = await mp(env, "/checkout/preferences", {
    method: "POST",
    headers: { "x-idempotency-key": referencia },
    body: JSON.stringify({
      items: [{ id: `pro-${body.plan}`, title: plan.titulo, quantity: 1, unit_price: plan.precio, currency_id: "COP" }],
      external_reference: referencia,
      back_urls: { success: `${SITE}/pro/activar`, pending: `${SITE}/pro/activar`, failure: `${SITE}/planes?pago=rechazado` },
      auto_return: "approved",
      statement_descriptor: "PLIEGO",
      binary_mode: false,
    }),
  });
  if (!ok || !data.init_point) return json({ error: "No pudimos abrir el pago. Intenta de nuevo en un momento." }, 502);
  return json({ url: data.init_point });
}

/** POST /api/pago/verificar { pago } -> { codigo, plan, exp } si Mercado Pago confirma que se aprobó. */
export async function verificarPago(env, body, json) {
  const id = String(body?.pago || "").replace(/\D/g, "");
  if (!id) return json({ error: "Falta el número del pago." }, 400);
  const { ok, status, data } = await mp(env, `/v1/payments/${id}`);
  if (status === 404) return json({ error: "No encontramos ese pago en Mercado Pago." }, 404);
  if (!ok) return json({ error: "No pudimos consultar el pago. Intenta de nuevo en un momento." }, 502);

  const [marca, nombrePlan] = String(data.external_reference || "").split(":");
  const plan = PLANES[nombrePlan];
  if (marca !== "pliego" || !plan) return json({ error: "Ese pago no corresponde a Pliego Pro." }, 400);
  if (data.status === "pending" || data.status === "in_process") {
    return json({ estado: "pendiente", mensaje: "Tu pago está en proceso. Cuando Mercado Pago lo apruebe, vuelve a abrir el enlace de activación." });
  }
  if (data.status !== "approved") return json({ error: "Ese pago no fue aprobado." }, 402);
  if (data.currency_id !== "COP" || Number(data.transaction_amount) < plan.precio) return json({ error: "El valor del pago no coincide con el plan." }, 400);

  const aprobado = Date.parse(data.date_approved || data.date_created) || Date.now();
  const exp = aprobado + plan.dias * 24 * 60 * 60 * 1000;
  if (exp <= Date.now()) return json({ error: "Este pago ya venció. Puedes comprar un plan nuevo." }, 410);
  const codigo = await firmarCodigo(env.PRO_SECRET, { plan: nombrePlan, exp, pago: id });
  return json({ estado: "aprobado", codigo, plan: nombrePlan, exp });
}

/** POST /api/pro/verificar { codigo } -> { ok, plan, exp } */
export async function verificarCodigo(env, body, json) {
  const d = await leerCodigo(env.PRO_SECRET, body?.codigo);
  if (!d) return json({ ok: false, error: "El código no es válido o ya venció." }, 400);
  return json({ ok: true, plan: d.plan, exp: d.exp });
}
