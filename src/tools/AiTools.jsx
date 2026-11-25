import { useRef, useState } from "react";
import Dropzone from "../components/Dropzone";
import Icon from "../components/Icon";
import { FileList, Field, EngineNote, Progress, ErrorBox } from "../components/Parts";
import { summarize, translate, readPdfText, ask, toDocx } from "../lib/ai";
import { downloadBlob } from "../lib/files";
import { recordTask } from "../lib/stats";
import { FREE_LIMITS, PRO_LIMITS } from "../data/tools";
import { getLimits } from "../lib/pro";

const AiNote = () => (
  <p className="small faint">Tu archivo no se sube: Pliego saca el texto en tu dispositivo y solo ese texto se envía a la IA de Cloudflare. La IA puede equivocarse; revisa la información importante.</p>
);

const Panel = ({ children, action, disabled, onRun, busy }) => (
  <aside className="panel">
    <h2 style={{ fontSize: 17 }}>Opciones</h2>
    {children}
    {action && (
      <button className="btn btn-primary btn-lg" disabled={disabled || busy} onClick={onRun}>
        {busy ? "Trabajando…" : action} {!busy && <Icon name="IconSparkles" size={18} />}
      </button>
    )}
    <AiNote />
    <EngineNote engine="ia" />
  </aside>
);

function useAiTask(toolId) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const run = async (fn) => {
    setBusy(true); setError("");
    try {
      const r = await fn((i, n, t) => setProgress(t || (n ? `Parte ${i} de ${n}…` : "Trabajando…")));
      recordTask({ toolId, files: 1, inBytes: 0, outBytes: 0 });
      return r;
    } catch (e) { setError(e.message || "Algo salió mal."); return null; }
    finally { setBusy(false); setProgress(""); }
  };
  return { busy, progress, error, run };
}

const copy = (t) => navigator.clipboard?.writeText(t).catch(() => {});

// ------------------------------------------------------------ Resumir
export function SummaryTool({ tool }) {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null);
  const task = useAiTask(tool.id);
  return (
    <div className="tool-layout">
      <div className="stack">
        {file ? <FileList files={[file]} setFiles={(l) => { setFile(l[0] || null); setRes(null); }} /> : <Dropzone accept="pdf" onFiles={([f]) => setFile(f)} />}
        {task.progress && <Progress text={task.progress} />}
        {task.error && <ErrorBox message={task.error} />}
        {res && (
          <section className="card">
            <div className="card-head">
              <h2>Resumen</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => copy(res.text)}><Icon name="IconCopy" size={16} /> Copiar</button>
                <button className="btn btn-primary" onClick={async () => downloadBlob(await toDocx("Resumen", [res.text]), `${res.name}.docx`)}><Icon name="IconDownload" size={16} /> Word</button>
              </div>
            </div>
            <div className="doc" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{res.text}</div>
          </section>
        )}
      </div>
      <Panel action="Resumir" disabled={!file} busy={task.busy} onRun={async () => setRes(await task.run((p) => summarize(file, { maxPages: getLimits().aiPages }, p)))}>
        <p className="small muted">Te da un resumen corto y los puntos clave del documento. Gratis: hasta {FREE_LIMITS.aiPages} páginas por archivo. Pro: hasta {PRO_LIMITS.aiPages}.</p>
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Traducir
const LANGS = [{ value: "es", label: "Español" }, { value: "en", label: "Inglés" }, { value: "pt", label: "Portugués" }, { value: "fr", label: "Francés" }, { value: "it", label: "Italiano" }, { value: "de", label: "Alemán" }];

export function TranslateTool({ tool }) {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState("es");
  const [res, setRes] = useState(null);
  const task = useAiTask(tool.id);
  const label = LANGS.find((l) => l.value === lang)?.label;
  return (
    <div className="tool-layout">
      <div className="stack">
        {file ? <FileList files={[file]} setFiles={(l) => { setFile(l[0] || null); setRes(null); }} /> : <Dropzone accept="pdf" onFiles={([f]) => setFile(f)} />}
        {task.progress && <Progress text={task.progress} />}
        {task.error && <ErrorBox message={task.error} />}
        {res && (
          <section className="card">
            <div className="card-head">
              <h2>Traducción al {label?.toLowerCase()}</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => copy(res.pages.join("\n\n"))}><Icon name="IconCopy" size={16} /> Copiar</button>
                <button className="btn btn-primary" onClick={async () => downloadBlob(await toDocx(`Traducción (${label})`, res.pages), `${res.name}.docx`)}><Icon name="IconDownload" size={16} /> Word</button>
              </div>
            </div>
            {res.pages.map((p, i) => (
              <div key={i} style={{ borderTop: i ? "1px solid var(--border)" : 0, paddingTop: i ? 12 : 0, marginTop: i ? 12 : 0 }}>
                <div className="small faint" style={{ marginBottom: 6 }}>Página {i + 1}</div>
                <div className="doc" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{p}</div>
              </div>
            ))}
          </section>
        )}
      </div>
      <Panel action="Traducir" disabled={!file} busy={task.busy} onRun={async () => setRes(await task.run((p) => translate(file, { lang, maxPages: getLimits().aiPages }, p)))}>
        <Field field={{ type: "select", label: "Traducir al", options: LANGS }} value={lang} onChange={setLang} />
        <p className="small muted">Traduce el texto página por página y te lo entrega en Word para que lo revises. Gratis: hasta {FREE_LIMITS.aiPages} páginas por archivo. Pro: hasta {PRO_LIMITS.aiPages}.</p>
      </Panel>
    </div>
  );
}

// ------------------------------------------------------------ Preguntar al PDF
export function ChatTool({ tool }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [q, setQ] = useState("");
  const task = useAiTask(tool.id);
  const end = useRef(null);

  const open = async ([f]) => {
    setFile(f); setMsgs([]);
    const p = await task.run(() => readPdfText(f, getLimits().aiPages));
    if (p) setPages(p); else setFile(null);
  };
  const send = async (text) => {
    const question = (text ?? q).trim();
    if (!question || task.busy) return;
    setQ("");
    const history = msgs;
    setMsgs((m) => [...m, { role: "user", content: question }]);
    const answer = await task.run(() => ask(pages, question, history));
    if (answer) setMsgs((m) => [...m, { role: "assistant", content: answer }]);
    setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  return (
    <div className="tool-layout">
      <div className="stack">
        {!file && <Dropzone accept="pdf" onFiles={open} />}
        {file && <FileList files={[file]} setFiles={() => { setFile(null); setPages(null); setMsgs([]); }} />}
        {pages && (
          <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card-head" style={{ marginBottom: 0 }}><h2>Pregúntale al documento</h2><span className="small muted">{pages.length} páginas leídas</span></div>
            {msgs.length === 0 && (
              <div className="chips">
                {["¿De qué trata este documento?", "¿Cuáles son las fechas importantes?", "¿Qué me piden hacer?"].map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            <div className="chat">
              {msgs.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.content}</div>)}
              {task.busy && <div className="bubble assistant muted">Pensando…</div>}
              <div ref={end} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input" placeholder="Escribe tu pregunta" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
              <button className="btn btn-primary" onClick={() => send()} disabled={task.busy || !q.trim()} aria-label="Enviar"><Icon name="IconArrowUpRight" size={18} /></button>
            </div>
          </section>
        )}
        {task.error && <ErrorBox message={task.error} />}
      </div>
      <Panel>
        <p className="small muted">Sube un PDF y hazle preguntas: fechas, valores, requisitos o un resumen de una parte. Gratis: documentos de hasta {FREE_LIMITS.aiPages} páginas. Pro: hasta {PRO_LIMITS.aiPages}.</p>
      </Panel>
    </div>
  );
}

export const AI_TOOLS = {
  "resumir-pdf": SummaryTool,
  "traducir-pdf": TranslateTool,
  "chat-pdf": ChatTool,
};
