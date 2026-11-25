import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/** Abre un PDF con pdf.js (para ver, renderizar y leer texto). */
export const openPdf = async (bytes, password) => {
  const task = pdfjs.getDocument({ data: bytes.slice(0), password });
  return task.promise;
};

/** Dibuja una página en un canvas. scale 1 = 72 ppp. */
export const renderPage = async (doc, pageNumber, scale = 1, extraRotation = 0) => {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale, rotation: (page.rotate + extraRotation) % 360 });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const base = page.getViewport({ scale: 1 });
  return { canvas, width: base.width, height: base.height };
};

/** Renderiza miniaturas de todas las páginas (ancho aprox. en px). */
export const renderThumbnails = async (bytes, targetWidth = 160, onPage) => {
  const doc = await openPdf(bytes);
  const thumbs = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const { canvas } = await renderPage(doc, i, targetWidth / vp.width);
    const url = canvas.toDataURL("image/jpeg", 0.7);
    thumbs.push(url);
    onPage?.(i, doc.numPages, url);
  }
  await closePdf(doc);
  return thumbs;
};

/** Libera la memoria de un PDF abierto con pdf.js (cambió de nombre entre versiones). */
export const closePdf = async (doc) => {
  try {
    if (typeof doc?.destroy === "function") await doc.destroy();
    else await doc?.loadingTask?.destroy?.();
  } catch { /* nada que liberar */ }
};
