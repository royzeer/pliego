import { useRef, useState } from "react";
import Icon from "./Icon";

let uid = 0;
export const newId = () => `it${Date.now().toString(36)}${uid++}`;

const measureCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;

/** Calcula ancho y alto (en fracciones de la página) de un texto. */
export function textBox(text, size, page) {
  const ctx = measureCanvas.getContext("2d");
  ctx.font = `${size}px Helvetica, Arial, sans-serif`;
  const lines = String(text || " ").split("\n");
  const wPt = Math.max(...lines.map((l) => ctx.measureText(l || " ").width));
  return { w: Math.min(1, (wPt + 2) / page.wPt), h: Math.min(1, (lines.length * size * 1.2) / page.hPt) };
}

/**
 * Editor visual de páginas. Muestra cada página como imagen y encima los elementos
 * (texto, imágenes, rectángulos) que se pueden mover y cambiar de tamaño.
 * Con drawRects=true, arrastrar sobre la página dibuja un rectángulo nuevo.
 */
export default function PageEditor({ pages, items, setItems, selected, setSelected, activePage, setActivePage, drawRects, rectFill = "#000000" }) {
  const refs = useRef([]);
  const [drawing, setDrawing] = useState(null);

  const frac = (e, i) => {
    const r = refs.current[i].getBoundingClientRect();
    return { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height, r };
  };

  const startMove = (e, it, mode) => {
    e.stopPropagation();
    e.preventDefault();
    setSelected(it.id);
    setActivePage?.(it.page);
    const start = frac(e, it.page);
    const orig = { ...it };
    const move = (ev) => {
      const r = refs.current[it.page].getBoundingClientRect();
      const dx = (ev.clientX - (start.r.left + start.fx * start.r.width)) / r.width;
      const dy = (ev.clientY - (start.r.top + start.fy * start.r.height)) / r.height;
      setItems((list) => list.map((x) => {
        if (x.id !== it.id) return x;
        if (mode === "move") {
          return { ...x, x: Math.min(1 - x.w, Math.max(0, orig.x + dx)), y: Math.min(1 - x.h, Math.max(0, orig.y + dy)) };
        }
        // Cambiar tamaño
        if (x.type === "text") {
          const factor = Math.max(0.3, (orig.w + dx) / orig.w);
          const size = Math.max(6, Math.round(orig.size * factor));
          return { ...x, size, ...textBox(x.text, size, pages[x.page]) };
        }
        if (x.type === "image") {
          const w = Math.max(0.03, Math.min(1 - orig.x, orig.w + dx));
          return { ...x, w, h: w * (orig.h / orig.w) };
        }
        return { ...x, w: Math.max(0.01, Math.min(1 - orig.x, orig.w + dx)), h: Math.max(0.005, Math.min(1 - orig.y, orig.h + dy)) };
      }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const pageDown = (e, i) => {
    setActivePage?.(i);
    setSelected(null);
    if (!drawRects) return;
    e.preventDefault();
    const s = frac(e, i);
    setDrawing({ page: i, x0: s.fx, y0: s.fy, x1: s.fx, y1: s.fy });
    const move = (ev) => {
      const p = frac(ev, i);
      setDrawing((d) => d && { ...d, x1: Math.min(1, Math.max(0, p.fx)), y1: Math.min(1, Math.max(0, p.fy)) });
    };
    const up = (ev) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const p = frac(ev, i);
      const x = Math.min(s.fx, p.fx), y = Math.min(s.fy, p.fy);
      const w = Math.abs(p.fx - s.fx), h = Math.abs(p.fy - s.fy);
      setDrawing(null);
      if (w > 0.005 && h > 0.003) {
        const it = { id: newId(), type: "rect", page: i, x, y, w, h, fill: rectFill };
        setItems((list) => [...list, it]);
        setSelected(it.id);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="editor-pages">
      {pages.map((pg, i) => (
        <div key={i} className={`editor-page-wrap ${activePage === i ? "active" : ""}`}>
          <div className="small muted" style={{ marginBottom: 6 }}>Página {i + 1}</div>
          <div
            ref={(el) => (refs.current[i] = el)}
            className={`editor-page ${drawRects ? "drawing" : ""}`}
            style={{ aspectRatio: `${pg.wPt} / ${pg.hPt}` }}
            onPointerDown={(e) => pageDown(e, i)}
          >
            <img src={pg.url} alt={`Página ${i + 1}`} draggable={false} />
            {items.filter((it) => it.page === i).map((it) => (
              <div
                key={it.id}
                className={`editor-item ${selected === it.id ? "selected" : ""}`}
                style={{ left: `${it.x * 100}%`, top: `${it.y * 100}%`, width: `${it.w * 100}%`, height: `${it.h * 100}%` }}
                onPointerDown={(e) => startMove(e, it, "move")}
              >
                {it.type === "text" && (
                  <div className="editor-text" style={{ color: it.color, fontSize: `${(it.size / pg.wPt) * 100}cqw` }}>
                    {it.text}
                  </div>
                )}
                {it.type === "image" && <img src={it.src} alt="" draggable={false} />}
                {it.type === "rect" && <div style={{ width: "100%", height: "100%", background: it.fill }} />}
                {selected === it.id && (
                  <>
                    <button className="editor-del" onPointerDown={(e) => { e.stopPropagation(); setItems((l) => l.filter((x) => x.id !== it.id)); setSelected(null); }} aria-label="Quitar">
                      <Icon name="IconX" size={14} />
                    </button>
                    <span className="editor-handle" onPointerDown={(e) => startMove(e, it, "resize")} />
                  </>
                )}
              </div>
            ))}
            {drawing?.page === i && (
              <div className="editor-item" style={{
                left: `${Math.min(drawing.x0, drawing.x1) * 100}%`, top: `${Math.min(drawing.y0, drawing.y1) * 100}%`,
                width: `${Math.abs(drawing.x1 - drawing.x0) * 100}%`, height: `${Math.abs(drawing.y1 - drawing.y0) * 100}%`,
                background: rectFill, opacity: 0.6,
              }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
