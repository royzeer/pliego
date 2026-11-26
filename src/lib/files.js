export const MB = 1024 * 1024;

export const readBytes = async (file) => new Uint8Array(await file.arrayBuffer());

export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / MB).toFixed(bytes < 10 * MB ? 2 : 1).replace(".", ",")} MB`;
};

export const baseName = (name) => name.replace(/\.[^.]+$/, "");

export const isPdf = (file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name);
export const isImage = (file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name);

export const pdfBlob = (bytes) => new Blob([bytes], { type: "application/pdf" });

export const downloadBlob = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  // Avisa a la página que hubo una descarga (para el aviso de compartir)
  try { window.dispatchEvent(new CustomEvent("pliego-descarga", { detail: { name } })); } catch { /* sin eventos */ }
};

export const zipBlob = async (entries) => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const { name, data } of entries) zip.file(name, data);
  return zip.generateAsync({ type: "blob" });
};

/**
 * Convierte "1-3, 5, 8-10" en una lista de grupos de índices (base 0).
 * Devuelve null si el texto no es válido.
 */
export const parseRanges = (text, total) => {
  const groups = [];
  const parts = String(text || "").split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return null;
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!m) return null;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b < 1 || a > total || b > total || a > b) return null;
    const g = [];
    for (let i = a; i <= b; i++) g.push(i - 1);
    groups.push(g);
  }
  return groups;
};

export const flatPages = (text, total) => {
  const g = parseRanges(text, total);
  if (!g) return null;
  return [...new Set(g.flat())].sort((x, y) => x - y);
};

export const canvasToBlob = (canvas, type = "image/jpeg", quality = 0.85) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/** Carga una imagen respetando la orientación EXIF del celular. */
export const loadImage = async (file) => {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  return bitmap;
};
