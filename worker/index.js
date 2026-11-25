// Worker de Pliego: sirve la página y una pequeña API de IA con Workers AI.
// Las herramientas de PDF no pasan por aquí: corren en el navegador.

const MODELS = [
  "@cf/meta/llama-3.2-3b-instruct",
  "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "@cf/meta/llama-3.1-8b-instruct-fp8",
];
const MAX_CHARS = 16000; // por petición
const ALLOWED = [/^https:\/\/(www\.)?pliego\.lat$/, /^https:\/\/[\w-]+\.[\w-]+\.workers\.dev$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];

// Límite simple por IP (por instancia) para que un bot no gaste la cuota de todos.
const hits = new Map();
const tooMany = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 60;
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const LANGS = { es: "español", en: "inglés", pt: "portugués", fr: "francés", it: "italiano", de: "alemán" };

function buildMessages({ task, text, lang, question, history }) {
  const doc = String(text || "").slice(0, MAX_CHARS);
  if (task === "resumir") {
    return [
      { role: "system", content: "Eres un asistente que resume documentos en español claro y sencillo. No inventes datos que no estén en el texto. Escribe texto plano: sin asteriscos, sin negritas y sin títulos con #." },
      { role: "user", content: `Resume el siguiente documento. Primero escribe un resumen de 3 a 5 oraciones. Luego una lista de 5 a 8 puntos clave que empiecen con "- ". Si hay fechas, valores o nombres importantes, inclúyelos.\n\nDOCUMENTO:\n${doc}` },
    ];
  }
  if (task === "resumir-partes") {
    return [
      { role: "system", content: "Eres un asistente que une resúmenes parciales en uno solo, en español claro. No inventes datos. Escribe texto plano: sin asteriscos, sin negritas y sin títulos con #." },
      { role: "user", content: `Estos son resúmenes de partes de un mismo documento. Escribe un resumen final de 3 a 5 oraciones y luego de 5 a 8 puntos clave que empiecen con "- ".\n\n${doc}` },
    ];
  }
  if (task === "traducir") {
    const to = LANGS[lang] || "español";
    return [
      { role: "system", content: `Eres un traductor profesional. Traduces al ${to} de forma fiel y natural. Respondes solo con la traducción, sin comentarios ni explicaciones, conservando los saltos de línea.` },
      { role: "user", content: doc },
    ];
  }
  if (task === "preguntar") {
    const prev = Array.isArray(history) ? history.slice(-6).filter((m) => m && (m.role === "user" || m.role === "assistant")).map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) })) : [];
    return [
      { role: "system", content: "Respondes preguntas sobre un documento, en español, de forma breve y clara. Usa solo la información del documento. Si la respuesta no está en el documento, dilo con honestidad. Cuando sea útil, menciona la página. Escribe texto plano, sin asteriscos ni markdown." },
      { role: "user", content: `Partes relevantes del documento:\n${doc}` },
      { role: "assistant", content: "Entendido. ¿Qué quieres saber del documento?" },
      ...prev,
      { role: "user", content: String(question || "").slice(0, 800) },
    ];
  }
  return null;
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/ia") return json({ error: "No encontrado." }, 404);
  if (request.method !== "POST") return json({ error: "Método no permitido." }, 405);
  const origin = request.headers.get("origin") || "";
  if (!ALLOWED.some((r) => r.test(origin))) return json({ error: "Origen no permitido." }, 403);
  const ip = request.headers.get("cf-connecting-ip") || "local";
  if (tooMany(ip)) return json({ error: "Hiciste muchas solicitudes seguidas. Espera unos minutos e intenta de nuevo." }, 429);
  if (!env.AI) return json({ error: "La IA no está disponible en este momento." }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Solicitud inválida." }, 400); }
  const messages = buildMessages(body || {});
  if (!messages) return json({ error: "Tarea no válida." }, 400);
  if (!String(body.text || "").trim()) return json({ error: "El documento no tiene texto." }, 400);

  const maxTokens = body.task === "traducir" ? 2500 : body.task === "preguntar" ? 600 : 900;
  let lastError = "";
  for (const model of MODELS) {
    try {
      const res = await env.AI.run(model, { messages, max_tokens: maxTokens, temperature: body.task === "traducir" ? 0.2 : 0.3 });
      const raw = typeof res === "string" ? res : res?.response ?? res?.choices?.[0]?.message?.content ?? "";
      const text = String(raw)
        .replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1")
        .replace(/^#{1,6}\s*/gm, "").replace(/^(\s*[-*•]\s*)+/gm, "- ").trim();
      if (text) return json({ text, model });
    } catch (err) {
      lastError = String(err?.message || err);
      // Si se acabó la cuota gratis del día, no tiene sentido probar otro modelo
      if (/neuron|quota|limit|4006|exceeded/i.test(lastError)) {
        return json({ error: "Por hoy se agotó la IA gratis de Pliego. Vuelve a intentarlo mañana." }, 429);
      }
    }
  }
  return json({ error: "La IA no pudo responder ahora. Intenta de nuevo en un momento.", detail: lastError.slice(0, 200) }, 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);
    return env.ASSETS.fetch(request);
  },
};
