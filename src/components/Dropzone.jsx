import { useRef, useState } from "react";
import Icon from "./Icon";

const ACCEPT = {
  pdf: "application/pdf,.pdf",
  image: "image/*",
  any: "application/pdf,.pdf,image/*",
};

export default function Dropzone({ accept = "pdf", multiple = false, onFiles, title, hint, capture, variant = "plain", children }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(false);

  const handle = (list) => {
    const files = [...list];
    if (files.length) onFiles(multiple ? files : [files[0]]);
  };

  return (
    <div
      className={`dropzone ${variant === "plain" ? "dropzone-plain" : ""} ${drag ? "drag" : ""}`}
      onClick={() => input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") input.current?.click(); }}
    >
      <div className="drop-icon"><Icon name={capture ? "IconCamera" : "IconUpload"} size={26} /></div>
      <div style={{ fontWeight: 600, fontSize: 17 }}>{title || (multiple ? "Suelta tus archivos aquí" : "Suelta tu archivo aquí")}</div>
      <div className="small muted">{hint || "o haz clic para elegirlos"}</div>
      {children}
      <input
        ref={input}
        type="file"
        hidden
        accept={ACCEPT[accept] || accept}
        multiple={multiple}
        capture={capture ? "environment" : undefined}
        onChange={(e) => { handle(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
