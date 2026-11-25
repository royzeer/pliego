// Cuentas de Pliego: correo y contraseña, sesiones con cookie y datos de Pro.
// Base de datos: Cloudflare D1 (binding DB). Las tablas se crean solas la primera vez.
//
// La contraseña nunca llega al servidor tal cual: el navegador la convierte primero en una
// clave con PBKDF2 (200.000 vueltas, trabajo pesado que hace el dispositivo de la persona).
// El servidor solo aplica un HMAC con un secreto (PRO_SECRET) y una sal aleatoria por usuario,
// que es rápido y cabe en el límite de CPU del plan gratis de Workers.

export const SITE = "https://pliego.lat";
const enc = new TextEncoder();
const SESSION_DAYS = 60;
const COOKIE = "pliego_s";
const MAX_DATOS = 900_000; // bytes de firmas y clientes guardados

// ------------------------------------------------------------ utilidades
const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const randomToken = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async (s) => b64url(await crypto.subtle.digest("SHA-256", enc.encode(s)));

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function sameString(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const normEmail = (s) => String(s || "").trim().toLowerCase();
const validEmail = (s) => s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const validClientKey = (k) => typeof k === "string" && /^[0-9a-f]{64}$/.test(k);
const passHash = (env, sal, clientKey) => hmac(env.PRO_SECRET, `clave:${sal}:${clientKey}`);

// ------------------------------------------------------------ tablas
let ready = false;
export async function ensureTables(env) {
  if (ready) return;
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS usuarios (id TEXT PRIMARY KEY, correo TEXT UNIQUE NOT NULL, sal TEXT NOT NULL, clave TEXT NOT NULL, creado INTEGER NOT NULL, pro_plan TEXT, pro_hasta INTEGER, datos TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS sesiones (token TEXT PRIMARY KEY, usuario TEXT NOT NULL, vence INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS pagos (id TEXT PRIMARY KEY, usuario TEXT NOT NULL, plan TEXT NOT NULL, valor INTEGER, aprobado INTEGER NOT NULL)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS restablecer (token TEXT PRIMARY KEY, usuario TEXT NOT NULL, vence INTEGER NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS sesiones_usuario ON sesiones (usuario)"),
  ]);
  ready = true;
}

// ------------------------------------------------------------ sesiones
function readCookie(request) {
  const raw = request.headers.get("cookie") || "";
  const m = raw.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : "";
}
const cookieHeader = (token, maxAge) => `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

async function createSession(env, userId) {
  const token = randomToken();
  const vence = Date.now() + SESSION_DAYS * 86400_000;
  await env.DB.prepare("INSERT INTO sesiones (token, usuario, vence) VALUES (?, ?, ?)").bind(await sha256(token), userId, vence).run();
  return cookieHeader(token, SESSION_DAYS * 86400);
}

/** Usuario de la sesión actual, o null. */
export async function currentUser(env, request) {
  const token = readCookie(request);
  if (!token) return null;
  const row = await env.DB.prepare("SELECT u.* FROM sesiones s JOIN usuarios u ON u.id = s.usuario WHERE s.token = ? AND s.vence > ?")
    .bind(await sha256(token), Date.now()).first();
  return row || null;
}

/** Lo que el navegador puede saber del usuario. */
export function publicUser(u) {
  if (!u) return null;
  const pro = u.pro_hasta && u.pro_hasta > Date.now() ? { plan: u.pro_plan, hasta: u.pro_hasta } : null;
  let datos = {};
  try { datos = pro && u.datos ? JSON.parse(u.datos) : {}; } catch { datos = {}; }
  return { correo: u.correo, creado: u.creado, pro, datos };
}

// ------------------------------------------------------------ correo (Resend)
async function sendResetEmail(env, to, link) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "Pliego <hola@pliego.lat>",
      to: [to],
      subject: "Restablece tu contraseña de Pliego",
      text: `Hola. Pediste restablecer tu contraseña de Pliego.\n\nAbre este enlace para crear una nueva (vence en 30 minutos):\n${link}\n\nSi no fuiste tú, ignora este correo: tu contraseña sigue igual.`,
      html: `<p>Hola. Pediste restablecer tu contraseña de Pliego.</p><p><a href="${link}">Crear una contraseña nueva</a> (el enlace vence en 30 minutos).</p><p>Si no fuiste tú, ignora este correo: tu contraseña sigue igual.</p>`,
    }),
  });
  return res.ok;
}

// ------------------------------------------------------------ rutas
const bad = (json, msg, status = 400) => json({ error: msg }, status);

export async function handleCuenta(path, env, request, body, json) {
  const withCookie = (data, cookie, status = 200) => {
    const res = json(data, status);
    res.headers.append("set-cookie", cookie);
    return res;
  };

  if (path === "/api/cuenta/yo") {
    return json({ usuario: publicUser(await currentUser(env, request)) });
  }

  if (path === "/api/cuenta/registro") {
    const correo = normEmail(body.correo);
    if (!validEmail(correo)) return bad(json, "Escribe un correo válido.");
    if (!validClientKey(body.clave)) return bad(json, "La contraseña no es válida.");
    const existe = await env.DB.prepare("SELECT id FROM usuarios WHERE correo = ?").bind(correo).first();
    if (existe) return bad(json, "Ya existe una cuenta con ese correo. Inicia sesión.", 409);
    const id = crypto.randomUUID();
    const sal = randomToken(16);
    await env.DB.prepare("INSERT INTO usuarios (id, correo, sal, clave, creado) VALUES (?, ?, ?, ?, ?)")
      .bind(id, correo, sal, await passHash(env, sal, body.clave), Date.now()).run();
    const u = await env.DB.prepare("SELECT * FROM usuarios WHERE id = ?").bind(id).first();
    return withCookie({ usuario: publicUser(u) }, await createSession(env, id));
  }

  if (path === "/api/cuenta/entrar") {
    const correo = normEmail(body.correo);
    if (!validEmail(correo) || !validClientKey(body.clave)) return bad(json, "Correo o contraseña incorrectos.", 401);
    const u = await env.DB.prepare("SELECT * FROM usuarios WHERE correo = ?").bind(correo).first();
    if (!u || !sameString(await passHash(env, u.sal, body.clave), u.clave)) return bad(json, "Correo o contraseña incorrectos.", 401);
    await env.DB.prepare("DELETE FROM sesiones WHERE vence < ?").bind(Date.now()).run();
    return withCookie({ usuario: publicUser(u) }, await createSession(env, u.id));
  }

  if (path === "/api/cuenta/salir") {
    const token = readCookie(request);
    if (token) await env.DB.prepare("DELETE FROM sesiones WHERE token = ?").bind(await sha256(token)).run();
    return withCookie({ ok: true }, cookieHeader("", 0));
  }

  if (path === "/api/cuenta/datos") {
    const u = await currentUser(env, request);
    if (!u) return bad(json, "Inicia sesión para guardar tus datos.", 401);
    if (!(u.pro_hasta > Date.now())) return bad(json, "Guardar firmas y clientes en tu cuenta es parte de Pliego Pro.", 403);
    const datos = JSON.stringify({ firmas: Array.isArray(body.firmas) ? body.firmas.slice(0, 5) : [], clientes: Array.isArray(body.clientes) ? body.clientes.slice(0, 30) : [] });
    if (datos.length > MAX_DATOS) return bad(json, "Tus firmas guardadas pesan demasiado. Borra alguna e intenta de nuevo.", 413);
    await env.DB.prepare("UPDATE usuarios SET datos = ? WHERE id = ?").bind(datos, u.id).run();
    return json({ ok: true });
  }

  if (path === "/api/cuenta/olvide") {
    if (!env.RESEND_API_KEY) return bad(json, "Por ahora no podemos enviar el correo automático. Escríbenos a hola@pliego.lat desde el correo de tu cuenta y te ayudamos.", 503);
    const correo = normEmail(body.correo);
    const mensaje = { ok: true, mensaje: "Si hay una cuenta con ese correo, te enviamos un enlace para crear una contraseña nueva. Revisa también la carpeta de spam." };
    if (!validEmail(correo)) return json(mensaje);
    const u = await env.DB.prepare("SELECT id FROM usuarios WHERE correo = ?").bind(correo).first();
    if (!u) return json(mensaje);
    const token = randomToken();
    await env.DB.prepare("DELETE FROM restablecer WHERE usuario = ? OR vence < ?").bind(u.id, Date.now()).run();
    await env.DB.prepare("INSERT INTO restablecer (token, usuario, vence) VALUES (?, ?, ?)").bind(await sha256(token), u.id, Date.now() + 30 * 60_000).run();
    const ok = await sendResetEmail(env, correo, `${SITE}/cuenta/restablecer?t=${token}`);
    if (!ok) return bad(json, "No pudimos enviar el correo. Intenta de nuevo en unos minutos.", 502);
    return json(mensaje);
  }

  if (path === "/api/cuenta/restablecer") {
    if (!validClientKey(body.clave)) return bad(json, "La contraseña no es válida.");
    const row = await env.DB.prepare("SELECT r.usuario, u.correo FROM restablecer r JOIN usuarios u ON u.id = r.usuario WHERE r.token = ? AND r.vence > ?")
      .bind(await sha256(String(body.token || "")), Date.now()).first();
    if (!row) return bad(json, "El enlace no es válido o ya venció. Pide uno nuevo.", 400);
    if (normEmail(body.correo) !== row.correo) return bad(json, "El enlace no corresponde a ese correo.", 400);
    const sal = randomToken(16);
    await env.DB.batch([
      env.DB.prepare("UPDATE usuarios SET sal = ?, clave = ? WHERE id = ?").bind(sal, await passHash(env, sal, body.clave), row.usuario),
      env.DB.prepare("DELETE FROM restablecer WHERE usuario = ?").bind(row.usuario),
      env.DB.prepare("DELETE FROM sesiones WHERE usuario = ?").bind(row.usuario),
    ]);
    const u = await env.DB.prepare("SELECT * FROM usuarios WHERE id = ?").bind(row.usuario).first();
    return withCookie({ usuario: publicUser(u) }, await createSession(env, row.usuario));
  }

  if (path === "/api/cuenta/borrar") {
    const u = await currentUser(env, request);
    if (!u) return bad(json, "Inicia sesión primero.", 401);
    if (!validClientKey(body.clave) || !sameString(await passHash(env, u.sal, body.clave), u.clave)) return bad(json, "La contraseña no es correcta.", 401);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sesiones WHERE usuario = ?").bind(u.id),
      env.DB.prepare("DELETE FROM restablecer WHERE usuario = ?").bind(u.id),
      env.DB.prepare("DELETE FROM usuarios WHERE id = ?").bind(u.id),
    ]);
    return withCookie({ ok: true }, cookieHeader("", 0));
  }

  return bad(json, "No encontrado.", 404);
}
