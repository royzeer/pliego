import { useEffect, useRef, useState } from "react";
import Dropzone from "../components/Dropzone";
import Icon from "../components/Icon";
import PageEditor, { newId, textBox } from "../components/PageEditor";
import { FileList, Field, EngineNote, Result, Progress, ErrorBox } from "../components/Parts";
import { loadPagesForEditor, applyOverlays, redact, findTextBoxes, readForm, fillForm, extractPagesText } from "../lib/edit";
import useTask from "./useTask";
import { usePro } from "../lib/pro";
import { Link } from "react-router-dom";

const Panel = ({ title = "Opciones", children, action, disabled, onRun, busy }) => (
  <aside className="panel">
    <h2 style={{ fontSize: 17 }}>{title}</h2>
    {children}
    {action && (
      <button className="btn btn-primary btn-lg" disabled={disabled || busy} onClick={onRun}>
        {busy ? "Procesando…" : action} {!busy && <Icon name="IconArrowUpRight" size={18} />}
      </button>
    )}
    <EngineNote engine="navegador" />
  </aside>
);

const Feedback = ({ task, onReset }) => (
  <>
    {task.progress && <Progress text={task.progress} />}
    {task.error && <ErrorBox message={task.error} />}
    {task.result && <Result result={task.result} inBytes={task.inBytes} onDownload={task.download} onReset={onReset} />}
  </>
);

/** Carga un PDF y sus páginas para el editor visual. */
function useEditorDoc(task) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState("");
  const open = async ([f]) => {
    setFile(f); setPages([]); task.reset();
    try {
      setPages(await loadPagesForEditor(f, 900, (i, n) => setLoading(`Cargando página ${i} de ${n}…`)));
    } catch {
      task.setError("No pudimos abrir este PDF. Si tiene contraseña, quítala primero.");
      setFile(null);
    }
    setLoading("");
  };
  const reset = () => { setFile(null); setPages([]); };
  return { file, pages, loading, open, reset };
}

// Recorta los bordes transparentes de un canvas y devuelve PNG
const trimCanvas = (c) => {
  const ctx = c.getContext("2d");
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  }
  if (x1 <= x0 || y1 <= y0) return null;
  const out = document.createElement("canvas");
  out.width = x1 - x0 + 8; out.height = y1 - y0 + 8;
  out.getContext("2d").drawImage(c, x0 - 4, y0 - 4, out.width, out.height, 0, 0, out.width, out.height);
  return { url: out.toDataURL("image/png"), ratio: out.height / out.width };
};

// Convierte una foto de firma (fondo blanco) en PNG con fondo transparente
const photoToSignature = async (file) => {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const s = Math.min(1, 1400 / bmp.width);
  const c = document.createElement("canvas");
  c.width = bmp.width * s; c.height = bmp.height * s;
  const ctx = c.getContext("2d");
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const lum = 0.3 * img.data[i] + 0.59 * img.data[i + 1] + 0.11 * img.data[i + 2];
    if (lum > 170) img.data[i + 3] = 0;
    else { img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.min(lum, 40); }
  }
  ctx.putImageData(img, 0, 0);
  return trimCanvas(c);
};

// Firmas guardadas (Pro): se quedan en este navegador para reusarlas.
const SIG_KEY = "pliego.firmas";
const readSigs = () => { try { return JSON.parse(localStorage.getItem(SIG_KEY)) || []; } catch { return []; } };
const writeSigs = (l) => { try { localStorage.setItem(SIG_KEY, JSON.stringify(l)); } catch { /* sin espacio */ } };

function SavedSignatures({ onUse }) {
  const pro = usePro();
  const [list, setList] = useState(readSigs);
  useEffect(() => {
    const fn = () => setList(readSigs());
    window.addEventListener("pliego-firmas", fn);
    return () => window.removeEventListener("pliego-firmas", fn);
  }, []);
  if (!pro) {
    return <p className="small muted">Con <Link to="/planes" style={{ textDecoration: "underline" }}>Pliego Pro</Link> tus firmas quedan guardadas para usarlas con un toque.</p>;
  }
  if (!list.length) return <p className="small muted">Las firmas que crees quedan guardadas aquí (hasta 5).</p>;
  const remove = (i) => { const l = list.filter((_, k) => k !== i); writeSigs(l); setList(l); };
  return (
    <div className="field">
      <label>Tus firmas guardadas</label>
      <div className="saved-sigs">
        {list.map((sig, i) => (
          <div key={i} className="saved-sig">
            <button type="button" onClick={() => onUse(sig)} aria-label="Usar esta firma"><img src={sig.url} alt="Firma guardada" /></button>
            <button type="button" className="icon-btn" onClick={() => remove(i)} aria-label="Borrar firma"><Icon name="IconTrash" size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SignatureMaker({ onCreate: onCreateRaw }) {
  const pro = usePro();
  const onCreate = (sig) => {
    if (pro) {
      const l = readSigs().filter((x) => x.url !== sig.url);
      writeSigs([sig, ...l].slice(0, 5));
      window.dispatchEvent(new Event("pliego-firmas"));
    }
    onCreateRaw(sig);
  };
  const [mode, setMode] = useState("dibujar");
  const [name, setName] = useState("");
  const [color, setColor] = useState("#111827");
  const canvas = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (mode !== "dibujar" || !canvas.current) return;
    const c = canvas.current;
    const r = c.getBoundingClientRect();
    c.width = r.width * 2; c.height = r.height * 2;
  }, [mode]);

  const pos = (e) => {
    const r = canvas.current.getBoundingClientRect();
    return [(e.clientX - r.left) * 2, (e.clientY - r.top) * 2];
  };
  const down = (e) => {
    drawing.current = true;
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = color;
    ctx.beginPath(); ctx.moveTo(...pos(e));
  };
  const move = (e) => { if (!drawing.current) return; const ctx = canvas.current.getContext("2d"); ctx.lineTo(...pos(e)); ctx.stroke(); };
  const up = () => { drawing.current = false; };
  const clear = () => { const c = canvas.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); };

  const create = async () => {
    if (mode === "dibujar") {
      const t = trimCanvas(canvas.current);
      if (t) onCreate(t);
    } else if (mode === "escribir" && name.trim()) {
      await document.fonts.load('120px "Dancing Script"');
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      ctx.font = '120px "Dancing Script", cursive';
      c.width = ctx.measureText(name).width + 40; c.height = 180;
      ctx.font = '120px "Dancing Script", cursive'; ctx.fillStyle = color; ctx.textBaseline = "middle";
      ctx.fillText(name, 20, 90);
      const t = trimCanvas(c);
      if (t) onCreate(t);
    }
  };

  return (
    <div className="stack" style={{ gap: 12 }}>
      <SavedSignatures onUse={onCreateRaw} />
      <Field field={{ type: "segment", label: "Tu firma", options: [{ value: "dibujar", label: "Dibujar" }, { value: "escribir", label: "Escribir" }, { value: "foto", label: "Foto" }] }} value={mode} onChange={setMode} />
      {mode === "dibujar" && (
        <>
          <canvas ref={canvas} className="sig-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} />
          <button className="btn" onClick={clear}>Borrar</button>
        </>
      )}
      {mode === "escribir" && (
        <>
          <input className="input" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
          {name && <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: 38, color, background: "#fff", borderRadius: 12, padding: "6px 14px" }}>{name}</div>}
        </>
      )}
      {mode === "foto" && (
        <Dropzone accept="image" capture onFiles={async ([f]) => { const t = await photoToSignature(f); if (t) onCreate(t); }} title="Foto de tu firma" hint="Firma en una hoja blanca y tómale foto" />
      )}
      {mode !== "foto" && (
        <>
          <Field field={{ type: "segment", label: "Color", options: [{ value: "#111827", label: "Negro" }, { value: "#1d3f9e", label: "Azul" }] }} value={color} onChange={setColor} />
          <button className="btn btn-primary" onClick={create}><Icon name="IconPlus" size={16} /> Poner firma en la página</button>
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------ Firmar PDF
export function SignTool({ tool }) {
  const task = useTask(tool.id);
  const doc = useEditorDoc(task);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(0);

  const addSignature = ({ url, ratio }) => {
    const pg = doc.pages[active];
    const w = 0.28;
    const h = (w * ratio * pg.wPt) / pg.hPt;
    const it = { id: newId(), type: "image", page: active, src: url, x: 0.6, y: 0.78, w, h };
    setItems((l) => [...l, it]); setSelected(it.id);
  };
  const addDate = () => {
    const pg = doc.pages[active];
    const text = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
    const it = { id: newId(), type: "text", page: active, text, size: 11, color: "#111111", x: 0.6, y: 0.9, ...textBox(text, 11, pg) };
    setItems((l) => [...l, it]); setSelected(it.id);
  };

  return (
    <div className="tool-layout">
      <div className="stack">
        {!doc.file && <Dropzone accept="pdf" onFiles={doc.open} />}
        {doc.loading && <Progress text={doc.loading} />}
        {doc.pages.length > 0 && !task.result && (
          <PageEditor pages={doc.pages} items={items} setItems={setItems} selected={selected} setSelected={setSelected} activePage={active} setActivePage={setActive} />
        )}
        <Feedback task={task} onReset={() => { task.reset(); doc.reset(); setItems([]); }} />
      </div>
      <Panel action="Guardar PDF firmado" disabled={!items.length} busy={task.busy} onRun={() => task.run([doc.file], () => applyOverlays(doc.file, items, "firmado"))}>
        {doc.pages.length > 0 ? (
          <>
            <p className="small muted">Se agrega en la página {active + 1}. Haz clic en otra página para cambiarla. Arrastra la firma para moverla y usa el punto azul para cambiar el tamaño.</p>
            <SignatureMaker onCreate={addSignature} />
            <button className="btn" onClick={addDate}><Icon name="IconCalendar" size={16} /> Agregar fecha de hoy</button>
          </>
        ) : <p className="small muted">Sube el PDF que quieres firmar.</p>}
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Editar PDF
export function EditTool({ tool }) {
  const task = useTask(tool.id);
  const doc = useEditorDoc(task);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(0);
  const sel = items.find((x) => x.id === selected);
  const update = (patch) => setItems((l) => l.map((x) => {
    if (x.id !== selected) return x;
    const n = { ...x, ...patch };
    return n.type === "text" ? { ...n, ...textBox(n.text, n.size, doc.pages[n.page]) } : n;
  }));
  const add = (it) => { const full = { id: newId(), page: active, x: 0.1, y: 0.1, ...it }; setItems((l) => [...l, full]); setSelected(full.id); };

  const addImage = async ([f]) => {
    const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
    const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = bmp.width * s; c.height = bmp.height * s;
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const pg = doc.pages[active];
    const w = 0.35;
    add({ type: "image", src: c.toDataURL("image/png"), w, h: (w * (c.height / c.width) * pg.wPt) / pg.hPt });
  };

  return (
    <div className="tool-layout">
      <div className="stack">
        {!doc.file && <Dropzone accept="pdf" onFiles={doc.open} />}
        {doc.loading && <Progress text={doc.loading} />}
        {doc.pages.length > 0 && !task.result && (
          <PageEditor pages={doc.pages} items={items} setItems={setItems} selected={selected} setSelected={setSelected} activePage={active} setActivePage={setActive} />
        )}
        <Feedback task={task} onReset={() => { task.reset(); doc.reset(); setItems([]); }} />
      </div>
      <Panel action="Guardar PDF" disabled={!items.length} busy={task.busy} onRun={() => task.run([doc.file], () => applyOverlays(doc.file, items))}>
        {doc.pages.length > 0 ? (
          <>
            <p className="small muted">Agregar en la página {active + 1}:</p>
            <div className="chips">
              <button className="chip" onClick={() => add({ type: "text", text: "Escribe aquí", size: 14, color: "#111111", ...textBox("Escribe aquí", 14, doc.pages[active]) })}><Icon name="IconPlus" size={14} /> Texto</button>
              <label className="chip" style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                <Icon name="IconPhoto" size={14} /> Imagen
                <input type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files[0]) addImage([e.target.files[0]]); e.target.value = ""; }} />
              </label>
              <button className="chip" onClick={() => add({ type: "rect", fill: "#ffffff", w: 0.25, h: 0.04 })}>Tapar (blanco)</button>
            </div>
            {sel?.type === "text" && (
              <>
                <div className="field"><label>Texto</label><textarea className="input" style={{ height: 90, paddingTop: 10 }} value={sel.text} onChange={(e) => update({ text: e.target.value })} /></div>
                <Field field={{ type: "range", label: "Tamaño", min: 6, max: 72, step: 1 }} value={sel.size} onChange={(v) => update({ size: v })} />
                <div className="field"><label>Color</label><input type="color" value={sel.color} onChange={(e) => update({ color: e.target.value })} style={{ width: 60, height: 36, border: 0, background: "none" }} /></div>
              </>
            )}
            {sel?.type === "rect" && (
              <div className="field"><label>Color del recuadro</label><input type="color" value={sel.fill} onChange={(e) => update({ fill: e.target.value })} style={{ width: 60, height: 36, border: 0, background: "none" }} /></div>
            )}
            <p className="small faint">"Tapar" pone un recuadro encima, pero el texto de abajo sigue en el archivo. Para borrar datos de verdad usa Censurar PDF.</p>
          </>
        ) : <p className="small muted">Sube el PDF que quieres editar.</p>}
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Censurar PDF
export function RedactTool({ tool }) {
  const task = useTask(tool.id);
  const doc = useEditorDoc(task);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState("");

  const search = async () => {
    const boxes = await findTextBoxes(doc.file, query);
    setItems((l) => [...l, ...boxes.map((b) => ({ ...b, id: newId(), type: "rect", fill: "#000000" }))]);
    setFound(boxes.length ? `Se taparon ${boxes.length} coincidencias.` : "No encontramos ese texto (si el PDF es escaneado, tápalo a mano).");
  };

  return (
    <div className="tool-layout">
      <div className="stack">
        {!doc.file && <Dropzone accept="pdf" onFiles={doc.open} />}
        {doc.loading && <Progress text={doc.loading} />}
        {doc.pages.length > 0 && !task.result && (
          <PageEditor pages={doc.pages} items={items} setItems={setItems} selected={selected} setSelected={setSelected} drawRects rectFill="#000000" />
        )}
        <Feedback task={task} onReset={() => { task.reset(); doc.reset(); setItems([]); }} />
      </div>
      <Panel action="Censurar y guardar" disabled={!items.length} busy={task.busy}
        onRun={() => task.run([doc.file], (prog) => redact(doc.file, items, prog))}>
        {doc.pages.length > 0 ? (
          <>
            <p className="small muted">Arrastra sobre la página para tapar lo que quieras ocultar: números de cédula, cuentas, firmas, direcciones.</p>
            <div className="field">
              <label>O busca un texto y lo tapamos en todo el documento</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="1.234.567.890" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
                <button className="btn" onClick={search}>Buscar</button>
              </div>
              {found && <span className="small faint">{found}</span>}
            </div>
            <p className="small faint">Las páginas censuradas se guardan como imagen, así lo que tapaste desaparece de verdad y no se puede copiar ni recuperar.</p>
          </>
        ) : <p className="small muted">Sube el PDF que quieres censurar.</p>}
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Formularios
export function FormTool({ tool }) {
  const task = useTask(tool.id);
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState(null);
  const [values, setValues] = useState({});
  const [flatten, setFlatten] = useState(false);

  const open = async ([f]) => {
    setFile(f); task.reset();
    try {
      const list = await readForm(f);
      setFields(list);
      setValues(Object.fromEntries(list.map((x) => [x.name, x.value])));
    } catch (e) { task.setError(e.message); setFile(null); }
  };
  const usable = (fields || []).filter((f) => f.kind !== "unsupported");

  return (
    <div className="tool-layout">
      <div className="stack">
        {!file && <Dropzone accept="pdf" onFiles={open} />}
        {file && <FileList files={[file]} setFiles={() => { setFile(null); setFields(null); }} />}
        {fields && usable.length === 0 && (
          <div className="alert">Este PDF no tiene campos para llenar. Usa <a href="/herramientas/editar-pdf" style={{ textDecoration: "underline" }}>Editar PDF</a> para escribir encima.</div>
        )}
        {usable.length > 0 && !task.result && (
          <section className="card">
            <div className="card-head"><h2>Campos del formulario</h2><span className="small muted">{usable.length} campos</span></div>
            <div className="form-fields">
              {usable.map((f) => {
                const set = (v) => setValues({ ...values, [f.name]: v });
                if (f.kind === "check") return <Field key={f.name} field={{ type: "check", label: f.name }} value={values[f.name]} onChange={set} />;
                if (f.kind === "select") return <Field key={f.name} field={{ type: "select", label: f.name, options: [{ value: "", label: "Elegir…" }, ...f.options.map((o) => ({ value: o, label: o }))] }} value={values[f.name] || ""} onChange={set} />;
                return <Field key={f.name} field={{ type: "text", label: f.name }} value={values[f.name] || ""} onChange={set} />;
              })}
            </div>
          </section>
        )}
        <Feedback task={task} onReset={() => { task.reset(); setFile(null); setFields(null); }} />
      </div>
      <Panel action="Guardar formulario" disabled={!usable.length} busy={task.busy} onRun={() => task.run([file], () => fillForm(file, values, { flatten }))}>
        <p className="small muted">Pliego detecta los campos del PDF (casillas, listas y cuadros de texto) para que los llenes aquí.</p>
        <Field field={{ type: "check", label: "Aplanar (que ya no se pueda editar)" }} value={flatten} onChange={setFlatten} />
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Comparar
export function CompareTool({ tool }) {
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true); setError(""); setReport(null);
    try {
      const { diffWords } = await import("diff");
      const [pa, pb] = await Promise.all([extractPagesText(a), extractPagesText(b)]);
      const n = Math.max(pa.length, pb.length);
      const pages = [];
      let changes = 0;
      for (let i = 0; i < n; i++) {
        const parts = diffWords(pa[i] || "", pb[i] || "");
        const changed = parts.filter((p) => p.added || p.removed);
        changes += changed.length;
        pages.push({ n: i + 1, parts, changed: changed.length > 0 });
      }
      if (!pa.join("").trim() && !pb.join("").trim()) throw new Error("Estos PDF no tienen texto (parecen escaneados), así que no se pueden comparar.");
      setReport({ pages, changes, pagesA: pa.length, pagesB: pb.length });
    } catch (e) { setError(e.message || "No pudimos comparar los archivos."); }
    setBusy(false);
  };

  const slot = (label, file, set) => (
    <div className="card">
      <div className="card-head"><h2>{label}</h2></div>
      {file ? <FileList files={[file]} setFiles={(l) => { set(l[0] || null); setReport(null); }} /> : <Dropzone accept="pdf" onFiles={([f]) => set(f)} />}
    </div>
  );

  return (
    <div className="tool-layout">
      <div className="stack">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {slot("Versión original", a, setA)}
          {slot("Versión nueva", b, setB)}
        </div>
        {busy && <Progress text="Comparando…" />}
        {error && <ErrorBox message={error} />}
        {report && (
          <section className="card">
            <div className="card-head">
              <h2>{report.changes ? `${report.changes} cambios encontrados` : "Los textos son iguales"}</h2>
              <span className="small muted">{report.pagesA} vs {report.pagesB} páginas</span>
            </div>
            <p className="small muted" style={{ marginBottom: 12 }}><ins style={{ background: "rgba(143,191,154,.28)", textDecoration: "none", padding: "0 4px" }}>Verde</ins> = agregado en la nueva · <del style={{ background: "rgba(224,138,138,.3)", padding: "0 4px" }}>Rojo</del> = quitado</p>
            {report.pages.filter((p) => p.changed).map((p) => (
              <div key={p.n} style={{ borderTop: "1px solid var(--border)", padding: "12px 0" }}>
                <div className="small muted" style={{ marginBottom: 6 }}>Página {p.n}</div>
                <div className="diff-view">
                  {p.parts.map((part, i) => part.added ? <ins key={i}>{part.value}</ins> : part.removed ? <del key={i}>{part.value}</del> : <span key={i}>{part.value.length > 400 ? `${part.value.slice(0, 180)} … ${part.value.slice(-180)}` : part.value}</span>)}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
      <Panel action="Comparar" disabled={!a || !b} busy={busy} onRun={run}>
        <p className="small muted">Compara el texto de dos versiones de un documento (por ejemplo, un contrato antes y después de los cambios) y te muestra qué se agregó y qué se quitó.</p>
      </Panel>
    </div>
  );
}

export const EDIT_TOOLS = {
  "firmar-pdf": SignTool,
  "editar-pdf": EditTool,
  "censurar-pdf": RedactTool,
  "formularios-pdf": FormTool,
  "comparar-pdf": CompareTool,
};
