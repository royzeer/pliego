import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropzone from "../components/Dropzone";
import Icon from "../components/Icon";
import { FileList, Field, EngineNote, Result, Progress, ErrorBox } from "../components/Parts";
import { readBytes, isPdf } from "../lib/files";
import { renderThumbnails } from "../lib/render";
import * as P from "../lib/pdf";
import useTask from "./useTask";

const Panel = ({ title = "Opciones", children, action, disabled, onRun, busy, engine = "navegador" }) => (
  <aside className="panel">
    <h2 style={{ fontSize: 17 }}>{title}</h2>
    {children}
    <button className="btn btn-primary btn-lg" disabled={disabled || busy} onClick={onRun}>
      {busy ? "Procesando…" : action} {!busy && <Icon name="IconArrowUpRight" size={18} />}
    </button>
    <EngineNote engine={engine} />
  </aside>
);

const Feedback = ({ task, onReset }) => (
  <>
    {task.progress && <Progress text={task.progress} />}
    {task.error && <ErrorBox message={task.error} />}
    {task.result && <Result result={task.result} inBytes={task.inBytes} onDownload={task.download} onReset={onReset} />}
  </>
);

// ------------------------------------------------------------ Ordenar PDF
export function OrganizeTool({ tool }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // { index, rotation, thumb }
  const [loading, setLoading] = useState("");
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const task = useTask(tool.id);

  const open = async ([f]) => {
    setFile(f);
    task.reset();
    setPages([]);
    try {
      const thumbs = await renderThumbnails(await readBytes(f), 150, (i, n) => setLoading(`Cargando página ${i} de ${n}…`));
      setPages(thumbs.map((thumb, index) => ({ index, rotation: 0, thumb })));
    } catch {
      task.setError("No pudimos abrir este PDF. Si tiene contraseña, quítala primero.");
    }
    setLoading("");
  };

  const move = (from, to) => {
    const next = [...pages];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setPages(next);
  };
  const turn = (i) => setPages(pages.map((p, k) => (k === i ? { ...p, rotation: (p.rotation + 90) % 360 } : p)));
  const remove = (i) => setPages(pages.filter((_, k) => k !== i));

  return (
    <div className="tool-layout">
      <div className="stack">
        {!file && <Dropzone accept="pdf" onFiles={open} />}
        {loading && <Progress text={loading} />}
        {pages.length > 0 && (
          <div className="card">
            <div className="card-head"><h2>{file.name}</h2><span className="small muted">Arrastra para ordenar</span></div>
            <div className="pages">
              {pages.map((p, i) => (
                <div
                  key={`${p.index}-${i}`}
                  className={`page-thumb ${drag === i ? "dragging" : ""} ${over === i ? "over" : ""}`}
                  draggable
                  onDragStart={() => setDrag(i)}
                  onDragOver={(e) => { e.preventDefault(); setOver(i); }}
                  onDragLeave={() => setOver(null)}
                  onDrop={() => { if (drag !== null && drag !== i) move(drag, i); setDrag(null); setOver(null); }}
                  onDragEnd={() => { setDrag(null); setOver(null); }}
                >
                  <img src={p.thumb} alt={`Página ${p.index + 1}`} style={{ transform: `rotate(${p.rotation}deg)`, transition: "transform .2s" }} />
                  <span className="page-num">Pág. {p.index + 1}</span>
                  <div className="page-actions">
                    <button className="icon-btn" onClick={() => turn(i)} aria-label="Girar página"><Icon name="IconRotateClockwise" size={15} /></button>
                    <button className="icon-btn" onClick={() => remove(i)} aria-label="Quitar página"><Icon name="IconTrash" size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Feedback task={task} onReset={() => { task.reset(); setFile(null); setPages([]); }} />
      </div>
      <Panel action="Guardar PDF" disabled={!pages.length} busy={task.busy} onRun={() => task.run([file], () => P.organize(file, { order: pages }))}>
        <p className="small muted">Arrastra las miniaturas para cambiar el orden. Usa los botones para girar o quitar páginas.</p>
        {file && <button className="btn" onClick={() => { setFile(null); setPages([]); task.reset(); }}>Cambiar archivo</button>}
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Cédula
function SideSlot({ label, file, setFile, rotation, setRotation }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!file) return setUrl("");
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="card-head" style={{ marginBottom: 0 }}><h2>{label}</h2>
        {file && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="icon-btn" onClick={() => setRotation((rotation + 90) % 360)} aria-label="Girar"><Icon name="IconRotateClockwise" size={16} /></button>
            <button className="icon-btn" onClick={() => setFile(null)} aria-label="Quitar"><Icon name="IconX" size={16} /></button>
          </div>
        )}
      </div>
      {file ? (
        <div style={{ aspectRatio: "85.6 / 54", borderRadius: 12, overflow: "hidden", background: "#fff", display: "grid", placeItems: "center" }}>
          <img src={url} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `rotate(${rotation}deg)` }} />
        </div>
      ) : (
        <Dropzone accept="image" capture onFiles={([f]) => setFile(f)} title={`Foto ${label.toLowerCase()}`} hint="Toma la foto sobre una mesa oscura, sin flash" />
      )}
    </div>
  );
}

export function IdCardTool({ tool }) {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [rot, setRot] = useState([0, 0]);
  const [paper, setPaper] = useState("carta");
  const task = useTask(tool.id);
  return (
    <div className="tool-layout">
      <div className="stack">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <SideSlot label="Frente" file={front} setFile={setFront} rotation={rot[0]} setRotation={(r) => setRot([r, rot[1]])} />
          <SideSlot label="Reverso" file={back} setFile={setBack} rotation={rot[1]} setRotation={(r) => setRot([rot[0], r])} />
        </div>
        <Feedback task={task} onReset={() => { task.reset(); setFront(null); setBack(null); setRot([0, 0]); }} />
      </div>
      <Panel action="Crear PDF" disabled={!front || !back} busy={task.busy} onRun={() => task.run([front, back], () => P.idCard(front, back, { paper, rotations: rot }))}>
        <Field field={{ type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }] }} value={paper} onChange={setPaper} />
        <p className="small muted">Las dos caras quedan en una sola hoja a tamaño real (85,6 × 54 mm), listas para imprimir o enviar.</p>
        <p className="small muted">Consejo: después ponle una marca de agua que diga para qué trámite es.</p>
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Intercalar
export function InterleaveTool({ tool }) {
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [reverseB, setReverseB] = useState(true);
  const task = useTask(tool.id);
  const slot = (label, file, set) => (
    <div className="card">
      <div className="card-head"><h2>{label}</h2></div>
      {file ? <FileList files={[file]} setFiles={(l) => set(l[0] || null)} /> : <Dropzone accept="pdf" onFiles={([f]) => set(f)} />}
    </div>
  );
  return (
    <div className="tool-layout">
      <div className="stack">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {slot("Caras (1, 3, 5…)", a, setA)}
          {slot("Reversos (2, 4, 6…)", b, setB)}
        </div>
        <Feedback task={task} onReset={() => { task.reset(); setA(null); setB(null); }} />
      </div>
      <Panel action="Intercalar" disabled={!a || !b} busy={task.busy} onRun={() => task.run([a, b], () => P.interleave(a, b, { reverseB }))}>
        <Field field={{ type: "check", label: "Los reversos están en orden inverso" }} value={reverseB} onChange={setReverseB} />
        <p className="small muted">Pasa cuando escaneas todas las caras, volteas el paquete y escaneas los reversos: la última página sale primero.</p>
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Paquete de documentos
const DEFAULT_SLOTS = ["Hoja de vida", "Cédula", "Diploma o acta de grado", "Certificados laborales", "Otros soportes"];

export function PackageTool({ tool }) {
  const [slots, setSlots] = useState(DEFAULT_SLOTS.map((name) => ({ name, files: [] })));
  const [name, setName] = useState("");
  const [numbers, setNumbers] = useState(true);
  const task = useTask(tool.id);
  const all = slots.flatMap((s) => s.files);

  const run = () => task.run(all, async () => {
    const pdfs = [];
    for (const f of all) {
      if (isPdf(f)) pdfs.push(f);
      else {
        const { blob } = await P.imagesToPdf([f], { paper: "carta", margin: true });
        pdfs.push(new File([blob], `${f.name}.pdf`, { type: "application/pdf" }));
      }
    }
    let res = await P.merge(pdfs);
    if (numbers) {
      res = await P.pageNumbers(new File([res.blob], "p.pdf", { type: "application/pdf" }), { position: "abajo-der", start: 1, format: "de" });
    }
    const clean = (name.trim() || "Documentos").replace(/[^\p{L}\p{N}_-]+/gu, "_");
    return { ...res, name: `${clean}.pdf` };
  });

  return (
    <div className="tool-layout">
      <div className="stack">
        {slots.map((s, i) => (
          <div className="card" key={s.name}>
            <div className="card-head">
              <h2>{i + 1}. {s.name}</h2>
              <span className="small muted">{s.files.length ? `${s.files.length} archivo${s.files.length > 1 ? "s" : ""}` : "Opcional"}</span>
            </div>
            {s.files.length > 0 && <FileList files={s.files} setFiles={(files) => setSlots(slots.map((x, k) => (k === i ? { ...x, files } : x)))} sortable={s.files.length > 1} />}
            <div style={{ marginTop: s.files.length ? 12 : 0 }}>
              <Dropzone accept="any" multiple onFiles={(files) => setSlots(slots.map((x, k) => (k === i ? { ...x, files: [...x.files, ...files] } : x)))} title="Agregar PDF o fotos" hint="Se ordenan como aparecen aquí" />
            </div>
          </div>
        ))}
        <Feedback task={task} onReset={() => { task.reset(); setSlots(DEFAULT_SLOTS.map((n) => ({ name: n, files: [] }))); }} />
      </div>
      <Panel action="Crear paquete" disabled={!all.length} busy={task.busy} onRun={run}>
        <Field field={{ type: "text", label: "Nombre del archivo", placeholder: "Cervantes_Roycer_HojaDeVida" }} value={name} onChange={setName} />
        <Field field={{ type: "check", label: "Numerar páginas (1 de 10)" }} value={numbers} onChange={setNumbers} />
        <p className="small muted">Las fotos se convierten a PDF automáticamente y todo queda en un solo archivo, en este orden.</p>
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Revisor
export function CheckerTool({ tool }) {
  const [file, setFile] = useState(null);
  const [maxMB, setMaxMB] = useState("2");
  const [checks, setChecks] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async () => {
    setBusy(true); setError(""); setChecks(null);
    try { setChecks(await P.analyze(file, { maxMB: Number(maxMB) || 0 })); }
    catch (e) { setError(e?.message || "No pudimos revisar el archivo."); }
    setBusy(false);
  };
  const passed = checks?.every((c) => c.ok);
  return (
    <div className="tool-layout">
      <div className="stack">
        {file ? <FileList files={[file]} setFiles={(l) => { setFile(l[0] || null); setChecks(null); }} /> : <Dropzone accept="pdf" onFiles={([f]) => setFile(f)} />}
        {busy && <Progress text="Revisando…" />}
        {error && <ErrorBox message={error} />}
        {checks && (
          <div className={`card ${passed ? "card-invert" : ""}`}>
            <div className="card-head"><h2>{passed ? "Tu PDF está listo para subir" : "Encontramos cosas por corregir"}</h2></div>
            <div className="files">
              {checks.map((c) => (
                <div key={c.label} className="file-row" style={passed ? { background: "transparent", border: "1px solid #cfcfcf" } : undefined}>
                  <Icon name={c.ok ? "IconCircleCheck" : "IconAlertTriangle"} size={20} style={{ color: c.ok ? "var(--ok)" : "var(--error)" }} />
                  <span className="name">{c.label}</span>
                  <span className="small" style={{ opacity: 0.75 }}>{c.detail}</span>
                  {c.fix && <Link className="btn" style={{ height: 34 }} to={`/herramientas/${c.fix}`}>Corregir</Link>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Panel title="¿A dónde lo vas a subir?" action="Revisar PDF" disabled={!file} busy={busy} onRun={run}>
        <Field field={{ type: "segment", label: "Peso máximo que pide la plataforma", options: [{ value: "1", label: "1 MB" }, { value: "2", label: "2 MB" }, { value: "5", label: "5 MB" }, { value: "0", label: "No sé" }] }} value={maxMB} onChange={setMaxMB} />
        <p className="small muted">Revisamos peso, contraseña, tamaño de hoja, páginas giradas y páginas en blanco.</p>
      </Panel>
    </div>
  );
}

export const CUSTOM = {
  "ordenar-pdf": OrganizeTool,
  "cedula-ambas-caras": IdCardTool,
  "intercalar-pdf": InterleaveTool,
  "paquete-documentos": PackageTool,
  revisor: CheckerTool,
};
