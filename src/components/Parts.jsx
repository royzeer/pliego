import { useState } from "react";
import Icon from "./Icon";
import { formatSize } from "../lib/files";
import { ENGINE_LABEL, FREE_LIMITS } from "../data/tools";

/** Lista de archivos que se puede reordenar arrastrando. */
export function FileList({ files, setFiles, sortable }) {
  const [dragIndex, setDragIndex] = useState(null);
  const move = (from, to) => {
    if (to < 0 || to >= files.length) return;
    const next = [...files];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setFiles(next);
  };
  return (
    <div className="files">
      {files.map((f, i) => (
        <div
          key={`${f.name}-${f.size}-${i}`}
          className="file-row"
          draggable={sortable}
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => { if (dragIndex !== null) move(dragIndex, i); setDragIndex(null); }}
        >
          {sortable && <Icon name="IconGripVertical" size={18} className="faint" />}
          <Icon name={f.type.startsWith("image/") ? "IconPhoto" : "IconFileTypePdf"} size={22} />
          <span className="name" title={f.name}>{f.name}</span>
          <span className="small muted">{formatSize(f.size)}</span>
          {sortable && (
            <>
              <button className="icon-btn" onClick={() => move(i, i - 1)} aria-label="Subir"><Icon name="IconChevronUp" size={16} /></button>
              <button className="icon-btn" onClick={() => move(i, i + 1)} aria-label="Bajar"><Icon name="IconChevronDown" size={16} /></button>
            </>
          )}
          <button className="icon-btn" onClick={() => setFiles(files.filter((_, k) => k !== i))} aria-label="Quitar archivo"><Icon name="IconX" size={16} /></button>
        </div>
      ))}
    </div>
  );
}

export function Field({ field, value, onChange }) {
  const { type, label, options, placeholder, min, max, step, help } = field;
  let control;
  if (type === "segment") {
    control = (
      <div className="segment" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" className={value === o.value ? "active" : ""} onClick={() => onChange(o.value)} role="radio" aria-checked={value === o.value}>
            {o.label}
          </button>
        ))}
      </div>
    );
  } else if (type === "select") {
    control = (
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (type === "check") {
    return (
      <label className="check"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{label}</label>
    );
  } else if (type === "range") {
    control = (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, accentColor: "var(--text)" }} />
        <span className="small" style={{ minWidth: 40, textAlign: "right" }}>{field.format ? field.format(value) : value}</span>
      </div>
    );
  } else {
    control = (
      <input
        className="input"
        type={type === "password" ? "password" : type === "number" ? "number" : "text"}
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        autoComplete={type === "password" ? "new-password" : "off"}
        onChange={(e) => onChange(type === "number" ? e.target.value : e.target.value)}
      />
    );
  }
  return (
    <div className="field">
      <label>{label}</label>
      {control}
      {help && <span className="small faint">{help}</span>}
    </div>
  );
}

export function EngineNote({ engine }) {
  return (
    <span className="privacy">
      <Icon name={engine === "navegador" ? "IconShieldLock" : "IconBolt"} size={14} /> {ENGINE_LABEL[engine]}
    </span>
  );
}

export function Result({ result, inBytes, onDownload, onReset }) {
  return (
    <div className="result">
      <Icon name="IconCircleCheck" size={30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>Listo: {result.name}</div>
        <div className="small" style={{ opacity: 0.7 }}>
          {inBytes ? `${formatSize(inBytes)} → ` : ""}{formatSize(result.blob.size)}
          {result.note ? ` · ${result.note}` : ""}
        </div>
      </div>
      <button className="btn" style={{ borderColor: "currentColor" }} onClick={onReset}>Hacer otro</button>
      <button className="btn btn-primary" onClick={onDownload}><Icon name="IconDownload" size={18} /> Descargar</button>
    </div>
  );
}

export function Progress({ text }) {
  return <div className="alert"><span className="muted">{text || "Procesando…"}</span></div>;
}

export function ErrorBox({ message }) {
  return (
    <div className="alert alert-error" role="alert" style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Icon name="IconAlertTriangle" size={18} /> {message}
    </div>
  );
}

/** Espacio para anuncios. Va lejos del área de trabajo y del botón de descarga (política de AdSense). */
export function AdSlot() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT;
  return (
    <aside className="ad-slot" aria-label="Publicidad">
      <span className="ad-label">Publicidad</span>
      {client ? (
        <ins className="adsbygoogle" style={{ display: "block", flex: 1 }} data-ad-client={client} data-ad-slot={import.meta.env.VITE_ADSENSE_SLOT} data-ad-format="auto" data-full-width-responsive="true" />
      ) : (
        <div className="faint small" style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center" }}>Espacio para anuncio</div>
      )}
    </aside>
  );
}

export function Guide({ tool }) {
  const limit = tool.limitFree || `${FREE_LIMITS.maxFileMB} MB por archivo`;
  return (
    <section className="guide">
      <div className="card">
        <h2>Cómo usar {tool.name}</h2>
        <ol>
          <li>Sube tu archivo arrastrándolo o haciendo clic en el recuadro.</li>
          <li>Ajusta las opciones del panel de la derecha.</li>
          <li>Haz clic en el botón principal y descarga el resultado.</li>
        </ol>
        <div className="faq" style={{ marginTop: 18 }}>
          <details>
            <summary>¿Es gratis y sin límite de usos?</summary>
            <p>Sí. Puedes usar {tool.name} las veces que quieras. En el plan gratis el límite es por archivo: {limit}.</p>
          </details>
          <details>
            <summary>¿Mis archivos se suben a internet?</summary>
            <p>{tool.engine === "navegador" ? "No. Esta herramienta trabaja dentro de tu navegador: el archivo nunca sale de tu dispositivo." : "Esta herramienta necesita el servidor de Pliego. El archivo se borra apenas termina el proceso."}</p>
          </details>
          <details>
            <summary>¿Funciona en el celular?</summary>
            <p>Sí. Pliego funciona en cualquier navegador moderno, en el celular o el computador.</p>
          </details>
        </div>
      </div>
      <AdSlot />
    </section>
  );
}
