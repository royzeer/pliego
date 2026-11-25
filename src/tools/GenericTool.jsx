import { useState } from "react";
import Dropzone from "../components/Dropzone";
import Icon from "../components/Icon";
import { FileList, Field, EngineNote, Result, Progress, ErrorBox } from "../components/Parts";
import { getLimits, isPro } from "../lib/pro";
import useTask from "./useTask";

/** Herramienta estándar: archivos a la izquierda, opciones a la derecha. */
export default function GenericTool({ tool, config }) {
  const [files, setFiles] = useState([]);
  const [opts, setOpts] = useState(config.defaults || {});
  const task = useTask(tool.id);
  const min = config.min || 1;

  const addFiles = (incoming) => {
    const { maxFilesPerTask } = getLimits();
    const next = config.multiple ? [...files, ...incoming].slice(0, maxFilesPerTask) : incoming;
    if (config.multiple && files.length + incoming.length > maxFilesPerTask) {
      task.setError(`Puedes subir hasta ${maxFilesPerTask} archivos por tarea${isPro() ? "" : " en el plan gratis. Con Pro, hasta 100"}.`);
    }
    setFiles(next);
    task.reset();
  };

  const fields = (config.fields || []).filter((f) => !f.when || f.when(opts));
  const ready = files.length >= min && !task.busy;

  return (
    <div className="tool-layout">
      <div className="stack">
        {(files.length === 0 || config.multiple) && (
          <Dropzone
            accept={config.accept}
            multiple={config.multiple}
            capture={config.capture}
            onFiles={addFiles}
            title={files.length && config.multiple ? "Agrega más archivos" : config.dropTitle}
            hint={config.dropHint}
          />
        )}
        {files.length > 0 && <FileList files={files} setFiles={setFiles} sortable={config.sortable && files.length > 1} />}
        {task.progress && <Progress text={task.progress} />}
        {task.error && <ErrorBox message={task.error} />}
        {task.result && <Result result={task.result} inBytes={task.inBytes} onDownload={task.download} onReset={() => { task.reset(); setFiles([]); }} />}
      </div>

      <aside className="panel">
        <h2 style={{ fontSize: 17 }}>Opciones</h2>
        {fields.length === 0 && <p className="small muted">Esta herramienta no necesita configuración.</p>}
        {fields.map((f, i) => (
          <Field key={`${f.key}-${i}`} field={f} value={opts[f.key] ?? ""} onChange={(v) => setOpts({ ...opts, [f.key]: v })} />
        ))}
        {config.note && <p className="small muted">{config.note}</p>}
        {files.length < min && <p className="small faint">{min > 1 ? `Sube al menos ${min} archivos.` : "Sube un archivo para empezar."}</p>}
        <button className="btn btn-primary btn-lg" disabled={!ready} onClick={() => task.run(files, (prog) => config.run(files, opts, prog))}>
          {task.busy ? "Procesando…" : config.action}
          {!task.busy && <Icon name="IconArrowUpRight" size={18} />}
        </button>
        <EngineNote engine={tool.engine} />
      </aside>
    </div>
  );
}
