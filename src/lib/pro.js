// Estado de Pliego Pro en este navegador.
// El código de activación lo firma el Worker; aquí solo se guarda y se vuelve a comprobar cada día.
import { useEffect, useState } from "react";
import { FREE_LIMITS, PRO_LIMITS } from "../data/tools";

const KEY = "pliego.pro";
const DAY = 24 * 60 * 60 * 1000;
const listeners = new Set();

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
}
function write(v) {
  try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch { /* sin almacenamiento */ }
  listeners.forEach((fn) => fn());
}

/** { codigo, plan, exp } si Pro está activo en este navegador; si no, null. */
export function getPro() {
  const p = read();
  return p && p.exp > Date.now() ? p : null;
}
export const isPro = () => !!getPro();
export const getLimits = () => (isPro() ? PRO_LIMITS : FREE_LIMITS);

export function usePro() {
  const [pro, setPro] = useState(getPro);
  useEffect(() => {
    const fn = () => setPro(getPro());
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return pro;
}

async function api(path, body) {
  const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No pudimos conectar con Pliego. Revisa tu internet e intenta de nuevo.");
  return data;
}

/** Abre Mercado Pago para pagar el plan. */
export async function startPayment(plan) {
  const { url } = await api("/api/pago/crear", { plan });
  window.location.href = url;
}

/** Confirma un pago con Mercado Pago (a través del Worker) y activa Pro. */
export async function activateFromPayment(pago) {
  const data = await api("/api/pago/verificar", { pago });
  if (data.estado === "aprobado") write({ codigo: data.codigo, plan: data.plan, exp: data.exp, checked: Date.now() });
  return data;
}

/** Activa Pro con un código que la persona ya tiene (por ejemplo, en otro dispositivo). */
export async function activateFromCode(codigo) {
  const clean = String(codigo || "").trim();
  const data = await api("/api/pro/verificar", { codigo: clean });
  write({ codigo: clean, plan: data.plan, exp: data.exp, checked: Date.now() });
  return data;
}

export const removePro = () => write(null);

/** Una vez al día comprueba que el código guardado siga siendo válido. */
export async function recheckPro() {
  const p = read();
  if (!p) return;
  if (p.exp <= Date.now()) return write(null);
  if (p.checked && Date.now() - p.checked < DAY) return;
  try {
    const res = await fetch("/api/pro/verificar", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ codigo: p.codigo }) });
    if (res.status === 400) return write(null);
    if (res.ok) write({ ...p, checked: Date.now() });
  } catch { /* sin internet: se vuelve a intentar después */ }
}

export const PLAN_NAMES = { mensual: "Pro mensual", anual: "Pro anual" };
export const formatDate = (ms) => new Date(ms).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

/** Mensaje de error cuando un archivo pasa el límite de páginas del plan. */
export function pagesError(what, max, total, proMax) {
  const base = `${what} hasta ${max} páginas por archivo y este tiene ${total}.`;
  if (isPro() || total > proMax) return `${base} Divide el PDF primero.`;
  return `${base} Divide el PDF o pásate a Pro, que permite hasta ${proMax}.`;
}
