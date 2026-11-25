import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";

// Guarda el aviso de instalación que da Chrome/Edge en Android y computador.
let deferredPrompt = null;
const listeners = new Set();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    listeners.forEach((fn) => fn(true));
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    listeners.forEach((fn) => fn(false));
  });
}

export const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

export const detectPlatform = () => {
  const ua = navigator.userAgent || "";
  if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
};

/** Hook: indica si el navegador permite instalar con un botón, y la función para hacerlo. */
export function useInstall() {
  const [canPrompt, setCanPrompt] = useState(!!deferredPrompt);
  useEffect(() => {
    listeners.add(setCanPrompt);
    return () => listeners.delete(setCanPrompt);
  }, []);
  const install = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    setCanPrompt(false);
    return outcome === "accepted";
  };
  return { canPrompt, install };
}

const KEY = "pliego.install.dismissed";

/** Aviso pequeño para instalar Pliego. Se puede cerrar y no vuelve a salir. */
export function InstallBanner() {
  const { canPrompt, install } = useInstall();
  const [hidden, setHidden] = useState(true);
  const [platform, setPlatform] = useState("desktop");
  const { pathname } = useLocation();

  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem(KEY) === "1"; } catch { /* sin almacenamiento */ }
    setPlatform(detectPlatform());
    setHidden(dismissed || isStandalone());
  }, []);

  if (hidden || pathname === "/instalar") return null;
  const close = () => {
    setHidden(true);
    try { localStorage.setItem(KEY, "1"); } catch { /* sin almacenamiento */ }
  };
  const text = platform === "desktop" ? "Instala Pliego en tu celular o computador" : "Instala Pliego en tu celular";

  return (
    <div className="install-banner" role="region" aria-label="Instalar Pliego">
      <img src="/icon-192.png" alt="" width="40" height="40" />
      <div className="install-text">
        <strong>{text}</strong>
        <span>Se abre como app, en pantalla completa y funciona sin internet. Gratis.</span>
      </div>
      {canPrompt ? (
        <button className="btn btn-primary" onClick={async () => { if (await install()) close(); }}>Instalar</button>
      ) : (
        <Link to="/instalar" className="btn btn-primary">Cómo instalar</Link>
      )}
      <button className="icon-btn install-close" onClick={close} aria-label="Cerrar aviso"><Icon name="IconX" size={16} /></button>
    </div>
  );
}
