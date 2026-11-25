var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.js
var MODELS = [
  "@cf/meta/llama-3.1-8b-instruct-fp8",
  "@cf/meta/llama-3.2-3b-instruct",
  "@cf/mistralai/mistral-small-3.1-24b-instruct"
];
var MAX_CHARS = 16e3;
var ALLOWED = [/^https:\/\/(www\.)?pliego\.lat$/, /^https:\/\/[\w-]+\.[\w-]+\.workers\.dev$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];
var hits = /* @__PURE__ */ new Map();
var tooMany = /* @__PURE__ */ __name((ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1e3);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5e3) hits.clear();
  return list.length > 60;
}, "tooMany");
var json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } }), "json");
var LANGS = { es: "espa\xF1ol", en: "ingl\xE9s", pt: "portugu\xE9s", fr: "franc\xE9s", it: "italiano", de: "alem\xE1n" };
function buildMessages({ task, text, lang, question, history }) {
  const doc = String(text || "").slice(0, MAX_CHARS);
  if (task === "resumir") {
    return [
      { role: "system", content: "Eres un asistente que resume documentos en espa\xF1ol claro y sencillo. No inventes datos que no est\xE9n en el texto." },
      { role: "user", content: `Resume el siguiente documento. Primero escribe un resumen de 3 a 5 oraciones. Luego una lista de 5 a 8 puntos clave que empiecen con "- ". Si hay fechas, valores o nombres importantes, incl\xFAyelos.

DOCUMENTO:
${doc}` }
    ];
  }
  if (task === "resumir-partes") {
    return [
      { role: "system", content: "Eres un asistente que une res\xFAmenes parciales en uno solo, en espa\xF1ol claro. No inventes datos." },
      { role: "user", content: `Estos son res\xFAmenes de partes de un mismo documento. Escribe un resumen final de 3 a 5 oraciones y luego de 5 a 8 puntos clave que empiecen con "- ".

${doc}` }
    ];
  }
  if (task === "traducir") {
    const to = LANGS[lang] || "espa\xF1ol";
    return [
      { role: "system", content: `Eres un traductor profesional. Traduces al ${to} de forma fiel y natural. Respondes solo con la traducci\xF3n, sin comentarios ni explicaciones, conservando los saltos de l\xEDnea.` },
      { role: "user", content: doc }
    ];
  }
  if (task === "preguntar") {
    const prev = Array.isArray(history) ? history.slice(-6).filter((m) => m && (m.role === "user" || m.role === "assistant")).map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) })) : [];
    return [
      { role: "system", content: "Respondes preguntas sobre un documento, en espa\xF1ol, de forma breve y clara. Usa solo la informaci\xF3n del documento. Si la respuesta no est\xE1 en el documento, dilo con honestidad. Cuando sea \xFAtil, menciona la p\xE1gina." },
      { role: "user", content: `Partes relevantes del documento:
${doc}` },
      { role: "assistant", content: "Entendido. \xBFQu\xE9 quieres saber del documento?" },
      ...prev,
      { role: "user", content: String(question || "").slice(0, 800) }
    ];
  }
  return null;
}
__name(buildMessages, "buildMessages");
async function handleApi(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/ia") return json({ error: "No encontrado." }, 404);
  if (request.method !== "POST") return json({ error: "M\xE9todo no permitido." }, 405);
  const origin = request.headers.get("origin") || "";
  if (!ALLOWED.some((r) => r.test(origin))) return json({ error: "Origen no permitido." }, 403);
  const ip = request.headers.get("cf-connecting-ip") || "local";
  if (tooMany(ip)) return json({ error: "Hiciste muchas solicitudes seguidas. Espera unos minutos e intenta de nuevo." }, 429);
  if (!env.AI) return json({ error: "La IA no est\xE1 disponible en este momento." }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Solicitud inv\xE1lida." }, 400);
  }
  const messages = buildMessages(body || {});
  if (!messages) return json({ error: "Tarea no v\xE1lida." }, 400);
  if (!String(body.text || "").trim()) return json({ error: "El documento no tiene texto." }, 400);
  const maxTokens = body.task === "traducir" ? 2500 : body.task === "preguntar" ? 600 : 900;
  let lastError = "";
  for (const model of MODELS) {
    try {
      const res = await env.AI.run(model, { messages, max_tokens: maxTokens, temperature: body.task === "traducir" ? 0.2 : 0.3 });
      const text = typeof res === "string" ? res : res?.response ?? res?.choices?.[0]?.message?.content ?? "";
      if (String(text).trim()) return json({ text: String(text).trim(), model });
    } catch (err) {
      lastError = String(err?.message || err);
      if (/neuron|quota|limit|4006|exceeded/i.test(lastError)) {
        return json({ error: "Por hoy se agot\xF3 la IA gratis de Pliego. Vuelve a intentarlo ma\xF1ana." }, 429);
      }
    }
  }
  return json({ error: "La IA no pudo responder ahora. Intenta de nuevo en un momento.", detail: lastError.slice(0, 200) }, 502);
}
__name(handleApi, "handleApi");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);
    return env.ASSETS.fetch(request);
  }
};

// ../.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-bRbCX2/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-bRbCX2/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
