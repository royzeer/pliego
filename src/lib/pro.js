// Cuenta de Pliego y estado de Pro en el navegador.
// La sesión vive en una cookie segura que maneja el servidor; aquí se guarda una copia del
// usuario (correo y vencimiento de Pro) para mostrar la página rápido y funcionar sin internet.
import { useEffect, useState } from "react";
import { FREE_LIMITS, PRO_LIMITS } from "../data/tools";

const KEY = "pliego.cuenta";
const SIG_KEY = "pliego.firmas";
const CLIENT_KEY = "pliego.clientes";
const listeners = new Set();

const readJSON = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } };
const writeJSON = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

let user = readJSON(KEY, null);
let checked = false;

function setUser(u) {
  user = u ? { correo: u.correo, creado: u.creado, pro: u.pro } : null;
  writeJSON(KEY, user);
  // Al entrar con Pro, traer las firmas y clientes guardados en la cuenta
  if (u?.pro && u.datos) {
    if (Array.isArray(u.datos.firmas) && u.datos.firmas.length) writeJSON(SIG_KEY, u.datos.firmas);
    if (Array.isArray(u.datos.clientes) && u.datos.clientes.length) writeJSON(CLIENT_KEY, u.datos.clientes);
    window.dispatchEvent(new Event("pliego-firmas"));
  }
  listeners.forEach((fn) => fn());
}

// ------------------------------------------------------------ estado
export const getUser = () => user;
/** { plan, hasta } si la cuenta tiene Pro vigente; si no, null. */
export const getPro = () => (user?.pro && user.pro.hasta > Date.now() ? user.pro : null);
export const isPro = () => !!getPro();
export const getLimits = () => (isPro() ? PRO_LIMITS : FREE_LIMITS);

function useStore(select) {
  const [v, setV] = useState(select);
  useEffect(() => {
    const fn = () => setV(select());
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}
export const usePro = () => useStore(getPro);
export const useUser = () => useStore(getUser);

// ------------------------------------------------------------ API
async function api(path, body = {}) {
  let res;
  try {
    res = await fetch(path, { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new Error("No pudimos conectar con Pliego. Revisa tu internet e intenta de nuevo.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Algo salió mal. Intenta de nuevo.");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/**
 * La contraseña no viaja tal cual: el navegador la convierte en una clave con PBKDF2.
 * El servidor guarda solo un HMAC de esa clave con una sal propia de cada cuenta.
 */
async function deriveKey(correo, clave) {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey("raw", enc.encode(clave), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(`pliego.lat:${correo.trim().toLowerCase()}`), iterations: 200000 }, base, 256);
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function checkPassword(clave) {
  if (clave.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (clave.length > 200) return "La contraseña es demasiado larga.";
  return "";
}

/** Pregunta al servidor quién tiene la sesión abierta (una vez por visita). */
export async function refreshUser(force = false) {
  if (checked && !force) return user;
  try {
    const d = await api("/api/cuenta/yo");
    checked = true;
    setUser(d.usuario);
  } catch (e) {
    // Si las cuentas no están activas (503) o no hay internet, se conserva lo que había
    if (e.status && e.status < 500) setUser(null);
  }
  return user;
}

export async function register(correo, clave) {
  const d = await api("/api/cuenta/registro", { correo, clave: await deriveKey(correo, clave) });
  setUser(d.usuario);
  return d.usuario;
}

export async function login(correo, clave) {
  const d = await api("/api/cuenta/entrar", { correo, clave: await deriveKey(correo, clave) });
  setUser(d.usuario);
  return d.usuario;
}

export async function logout() {
  try { await api("/api/cuenta/salir"); } catch { /* igual se cierra aquí */ }
  writeJSON(SIG_KEY, null);
  writeJSON(CLIENT_KEY, null);
  setUser(null);
}

export const forgotPassword = (correo) => api("/api/cuenta/olvide", { correo });

export async function resetPassword(token, correo, clave) {
  const d = await api("/api/cuenta/restablecer", { token, correo, clave: await deriveKey(correo, clave) });
  setUser(d.usuario);
  return d.usuario;
}

export async function deleteAccount(clave) {
  await api("/api/cuenta/borrar", { clave: await deriveKey(user.correo, clave) });
  writeJSON(SIG_KEY, null);
  writeJSON(CLIENT_KEY, null);
  setUser(null);
}

// ------------------------------------------------------------ datos guardados (Pro)
let syncTimer;
/** Guarda firmas y clientes en este navegador y, si hay Pro, también en la cuenta. */
export function saveProData(key, value) {
  writeJSON(key, value);
  if (!isPro()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    api("/api/cuenta/datos", { firmas: readJSON(SIG_KEY, []), clientes: readJSON(CLIENT_KEY, []) }).catch(() => { /* se reintenta en el próximo cambio */ });
  }, 800);
}
export const readProData = (key) => readJSON(key, []);
export const KEYS = { firmas: SIG_KEY, clientes: CLIENT_KEY };

// ------------------------------------------------------------ pagos
/** Abre Mercado Pago para pagar el plan. Si no hay sesión, lanza un error con cuenta = true. */
export async function startPayment(plan) {
  const { url } = await api("/api/pago/crear", { plan });
  window.location.href = url;
}

/** Al volver de Mercado Pago: confirma el pago y actualiza la cuenta. */
export async function confirmPayment(pago) {
  const d = await api("/api/pago/verificar", { pago });
  if (d.usuario) setUser(d.usuario);
  else await refreshUser(true);
  return d;
}

// ------------------------------------------------------------ textos
export const PLAN_NAMES = { mensual: "Pro mensual", anual: "Pro anual" };
export const formatDate = (ms) => new Date(ms).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

/** Mensaje de error cuando un archivo pasa el límite de páginas del plan. */
export function pagesError(what, max, total, proMax) {
  const base = `${what} hasta ${max} páginas por archivo y este tiene ${total}.`;
  if (isPro() || total > proMax) return `${base} Divide el PDF primero.`;
  return `${base} Divide el PDF o pásate a Pro, que permite hasta ${proMax}.`;
}
