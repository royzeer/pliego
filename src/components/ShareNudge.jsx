// Aviso discreto después de una descarga: "¿Te sirvió? Pásaselo a alguien".
// Así Pliego se recomienda solo, de usuario a usuario.
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Icon from "./Icon";
import { TOOLS } from "../data/tools";

const CLOSED_KEY = "pliego.compartir.cerrado";
const SHOWN_KEY = "pliego.compartir.visto";
const read = (k, store) => { try { return store.getItem(k); } catch { return null; } };
const write = (k, v, store) => { try { store.setItem(k, v); } catch { /* sin almacenamiento */ } };

/** Si lo cerró varias veces, no volver a insistir por 30 días. */
function muted() {
  const raw = read(CLOSED_KEY, localStorage);
  if (!raw) return false;
  try {
    const { n, t } = JSON.parse(raw);
    return n >= 3 && Date.now() - t < 30 * 864e5;
  } catch { return false; }
}

function noteClosed() {
  let n = 0;
  try { n = JSON.parse(read(CLOSED_KEY, localStorage) || "{}").n || 0; } catch { /* nada */ }
  write(CLOSED_KEY, JSON.stringify({ n: n >= 3 ? 1 : n + 1, t: Date.now() }), localStorage);
}

function shareInfo(pathname) {
  const m = pathname.match(/^\/herramientas\/([^/]+)/);
  const tool = m && TOOLS.find((t) => t.id === m[1]);
  const url = `https://pliego.lat${pathname === "/" ? "" : pathname}`;
  const text = tool
    ? `Te paso esto, a mí me sirvió: ${tool.name} gratis y sin instalar nada. ${url}`
    : `Te paso esto, a mí me sirvió: herramientas PDF y trámites gratis, sin instalar nada. ${url}`;
  return { url, text, title: tool ? `${tool.name} gratis | Pliego` : "Pliego" };
}

export default function ShareNudge() {
  const { pathname } = useLocation();
  const [openAt, setOpenAt] = useState(null); // ruta donde se abrió
  const open = openAt === pathname;
  const setOpen = (v) => setOpenAt(v ? window.location.pathname : null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const onDownload = () => {
      if (muted()) return;
      // Una sola vez por página en cada visita, para no molestar
      const seen = (read(SHOWN_KEY, sessionStorage) || "").split("|");
      if (seen.includes(window.location.pathname)) return;
      write(SHOWN_KEY, [...seen, window.location.pathname].join("|"), sessionStorage);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpenAt(window.location.pathname), 1200);
    };
    window.addEventListener("pliego-descarga", onDownload);
    return () => { window.removeEventListener("pliego-descarga", onDownload); clearTimeout(timer.current); };
  }, []);

  if (!open) return null;
  const info = shareInfo(pathname);
  const close = () => { noteClosed(); setOpen(false); };
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const share = async () => {
    try { await navigator.share({ title: info.title, text: info.text }); setOpen(false); } catch { /* lo canceló */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(info.url); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* sin portapapeles */ }
  };

  return (
    <div className="share-nudge" role="dialog" aria-label="Compartir Pliego">
      <button className="icon-btn share-close" onClick={close} aria-label="Cerrar"><Icon name="IconX" size={16} /></button>
      <div className="share-title">¿Te sirvió?</div>
      <p className="small muted" style={{ margin: "2px 0 12px" }}>Pásaselo a alguien que lo necesite. Así Pliego sigue siendo gratis.</p>
      <div className="share-actions">
        <a className="btn btn-primary" href={`https://wa.me/?text=${encodeURIComponent(info.text)}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          <Icon name="IconBrandWhatsapp" size={18} /> WhatsApp
        </a>
        {canShare ? (
          <button className="btn" onClick={share}><Icon name="IconShare" size={18} /> Compartir</button>
        ) : (
          <button className="btn" onClick={copy}><Icon name={copied ? "IconCheck" : "IconCopy"} size={18} /> {copied ? "Copiado" : "Copiar enlace"}</button>
        )}
      </div>
    </div>
  );
}
