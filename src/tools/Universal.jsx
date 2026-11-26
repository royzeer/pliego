import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from "../components/Dropzone";
import Icon from "../components/Icon";
import { FileList, Field, EngineNote, Result, Progress, ErrorBox } from "../components/Parts";
import { FORMATS, FORMAT_IDS, TARGETS, TARGET_NOTES, canConvert, fixTarget, pairPath } from "../data/formats";
import { convertAny } from "../lib/universal";
import useTask from "./useTask";

/** Barra "De / A" con botón para voltear. Cambia de página según la combinación elegida. */
export function FormatBar({ from, to }) {
  const navigate = useNavigate();
  const go = (f, t) => navigate(pairPath(f, fixTarget(f, t)));
  const canSwap = canConvert(to, from);
  return (
    <section className="card format-bar" aria-label="Elegir formatos">
      <div className="field">
        <label>De</label>
        <select className="select" value={from} onChange={(e) => go(e.target.value, to)}>
          {FORMAT_IDS.map((id) => <option key={id} value={id}>{FORMATS[id].name}</option>)}
        </select>
      </div>
      <button
        type="button"
        className="icon-btn swap-btn"
        disabled={!canSwap}
        onClick={() => go(to, from)}
        aria-label={canSwap ? `Voltear: convertir de ${FORMATS[to].name} a ${FORMATS[from].name}` : "No se puede voltear esta conversión"}
        title={canSwap ? `Voltear: ${FORMATS[to].name} a ${FORMATS[from].name}` : `Todavía no convertimos de ${FORMATS[to].name} a ${FORMATS[from].name}`}
      >
        <Icon name="IconArrowsLeftRight" size={20} />
      </button>
      <div className="field">
        <label>A</label>
        <select className="select" value={to} onChange={(e) => go(from, e.target.value)}>
          {TARGETS[from].map((id) => <option key={id} value={id}>{FORMATS[id].name}</option>)}
        </select>
      </div>
    </section>
  );
}

/** Convertidor universal para cualquier combinación de formatos. */
export function UniversalTool({ from, to, tool }) {
  const [file, setFile] = useState(null);
  const [imageFormat, setImageFormat] = useState("jpg");
  const task = useTask(tool?.id || `convertir-${from}-${to}`);
  const accept = FORMATS[from].exts.join(",");
  const ocr = from === "imagen";

  return (
    <div className="tool-layout">
      <div className="stack">
        {!file && (
          <Dropzone
            accept={accept}
            onFiles={([f]) => { setFile(f); task.reset(); }}
            title={`Sube tu archivo ${FORMATS[from].name}`}
            hint={`${FORMATS[from].hint} · o haz clic para elegirlo`}
          />
        )}
        {file && <FileList files={[file]} setFiles={(l) => { setFile(l[0] || null); task.reset(); }} />}
        {task.progress && <Progress text={task.progress} />}
        {task.error && <ErrorBox message={task.error} />}
        {task.result && <Result result={task.result} inBytes={task.inBytes} onDownload={task.download} onReset={() => { task.reset(); setFile(null); }} />}
      </div>

      <aside className="panel">
        <h2 style={{ fontSize: 17 }}>Opciones</h2>
        <p className="small muted">{TARGET_NOTES[to]}</p>
        {to === "imagen" && (
          <Field field={{ type: "segment", label: "Formato de imagen", options: [{ value: "jpg", label: "JPG" }, { value: "png", label: "PNG" }] }} value={imageFormat} onChange={setImageFormat} />
        )}
        {ocr && <p className="small muted">Pliego lee el texto de la imagen (OCR) en español e inglés. Funciona mejor con fotos nítidas de texto impreso.</p>}
        {!file && <p className="small faint">Sube un archivo para empezar.</p>}
        <button className="btn btn-primary btn-lg" disabled={!file || task.busy} onClick={() => task.run([file], (prog) => convertAny(file, from, to, { imageFormat }, prog))}>
          {task.busy ? "Convirtiendo…" : `Convertir a ${FORMATS[to].name}`}
          {!task.busy && <Icon name="IconArrowUpRight" size={18} />}
        </button>
        <EngineNote engine="navegador" />
      </aside>
    </div>
  );
}

/** Versión para el catálogo de herramientas (/herramientas/convertidor): empieza en Excel a Markdown. */
export function UniversalCatalogTool({ tool }) {
  return (
    <>
      <FormatBar from="excel" to="markdown" />
      <UniversalTool from="excel" to="markdown" tool={tool} />
    </>
  );
}
