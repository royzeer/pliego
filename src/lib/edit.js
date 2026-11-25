// Operaciones de edición: poner texto, imágenes, firmas y rectángulos sobre páginas,
// censurar de verdad, llenar formularios, encabezados y OCR.
import { PDFDocument, StandardFonts, rgb, degrees, PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup } from "@cantoo/pdf-lib";
import { readBytes, pdfBlob, baseName, canvasToBlob } from "./files";
import { openPdf, renderPage, closePdf } from "./render";

const hexToRgb = (hex = "#000000") => {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const dataUrlBytes = async (url) => new Uint8Array(await (await fetch(url)).arrayBuffer());

const load = async (file) => {
  try {
    return await PDFDocument.load(await readBytes(file), { updateMetadata: false });
  } catch (err) {
    if (/encrypt/i.test(String(err?.message))) throw new Error("Este PDF tiene contraseña. Primero quítala con Desbloquear PDF.");
    throw new Error("No pudimos leer este PDF. Prueba con Reparar PDF.");
  }
};

/** Carga las páginas para el editor: imagen de vista previa y tamaño en puntos. */
export async function loadPagesForEditor(file, width = 900, onProgress) {
  const doc = await openPdf(await readBytes(file));
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const { canvas } = await renderPage(doc, i, width / vp.width);
    pages.push({ url: canvas.toDataURL("image/jpeg", 0.82), wPt: vp.width, hPt: vp.height, rotate: page.rotate });
  }
  await closePdf(doc);
  return pages;
}

/**
 * Convierte coordenadas del editor (fracciones 0-1 desde arriba a la izquierda,
 * sobre la página tal como se ve) a coordenadas PDF, teniendo en cuenta la rotación.
 */
const mapper = (page) => {
  const box = page.getCropBox();
  const rot = ((page.getRotation().angle % 360) + 360) % 360;
  return (fx, fy) => {
    // Punto en la página "como se ve" (sin rotar visualmente): u a la derecha, v hacia abajo, 0..1
    let px, py; // fracciones en el espacio sin rotar del PDF, origen abajo-izquierda
    if (rot === 0) { px = fx; py = 1 - fy; }
    else if (rot === 90) { px = fy; py = fx; }
    else if (rot === 180) { px = 1 - fx; py = fy; }
    else { px = 1 - fy; py = 1 - fx; }
    return { x: box.x + px * box.width, y: box.y + py * box.height, rot };
  };
};

/** items: [{ type: 'text'|'image'|'rect', page, x, y, w, h, text, size, color, src, fill }] */
export async function applyOverlays(file, items, suffix = "editado") {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  for (const it of items) {
    const page = pages[it.page];
    if (!page) continue;
    const map = mapper(page);
    const box = page.getCropBox();
    const rot = ((page.getRotation().angle % 360) + 360) % 360;
    // Tamaño visible de la página (si está girada 90/270, ancho y alto se cruzan)
    const visW = rot % 180 === 0 ? box.width : box.height;
    const visH = rot % 180 === 0 ? box.height : box.width;
    const w = it.w * visW;
    const h = it.h * visH;
    // Esquina inferior izquierda del elemento tal como se ve
    const { x, y } = map(it.x, it.y + it.h);
    const opts = { x, y, rotate: degrees(rot) };
    if (it.type === "text") {
      const lines = String(it.text || "").split("\n");
      try { lines.forEach((l) => font.encodeText(l)); } catch {
        throw new Error("El texto tiene caracteres que no se pueden escribir en el PDF (por ejemplo emojis).");
      }
      const size = Number(it.size) || 14;
      lines.forEach((line, k) => {
        const off = (lines.length - 1 - k) * size * 1.2;
        const p = map(it.x, it.y + it.h - (off + size * 0.22) / visH);
        page.drawText(line, { x: p.x, y: p.y, size, font, color: hexToRgb(it.color), rotate: degrees(rot) });
      });
    } else if (it.type === "image") {
      const bytes = await dataUrlBytes(it.src);
      const img = it.src.startsWith("data:image/png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      page.drawImage(img, { ...opts, width: w, height: h });
    } else if (it.type === "rect") {
      page.drawRectangle({ ...opts, width: w, height: h, color: hexToRgb(it.fill || "#ffffff") });
    }
  }
  return { blob: pdfBlob(await doc.save()), name: `${baseName(file.name)}_${suffix}.pdf` };
}

/**
 * Censura real: las páginas con cuadros se convierten en imagen con los cuadros
 * "quemados", así el texto de debajo desaparece de verdad.
 */
export async function redact(file, boxes, onProgress) {
  const bytes = await readBytes(file);
  const src = await load(file);
  const pdfjsDoc = await openPdf(bytes);
  const out = await PDFDocument.create();
  const affected = new Set(boxes.map((b) => b.page));
  const n = src.getPageCount();
  for (let i = 0; i < n; i++) {
    onProgress?.(i + 1, n);
    if (!affected.has(i)) {
      const [p] = await out.copyPages(src, [i]);
      out.addPage(p);
      continue;
    }
    const { canvas, width, height } = await renderPage(pdfjsDoc, i + 1, 2.5);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    boxes.filter((b) => b.page === i).forEach((b) => ctx.fillRect(b.x * canvas.width, b.y * canvas.height, b.w * canvas.width, b.h * canvas.height));
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
    const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const page = out.addPage([width, height]);
    page.drawImage(jpg, { x: 0, y: 0, width, height });
  }
  await closePdf(pdfjsDoc);
  return { blob: pdfBlob(await out.save()), name: `${baseName(file.name)}_censurado.pdf` };
}

/** Busca un texto en el PDF y devuelve cuadros (en fracciones) para censurar. */
export async function findTextBoxes(file, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const doc = await openPdf(await readBytes(file));
  const boxes = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    for (const item of content.items) {
      if (!item.str) continue;
      const lower = item.str.toLowerCase();
      let idx = lower.indexOf(q);
      while (idx !== -1) {
        const [a, b, , d, e, f] = item.transform;
        const fontH = Math.hypot(b, d) || Math.abs(d) || 10;
        const charW = item.width / Math.max(1, item.str.length);
        const x0 = e + idx * charW * Math.sign(a || 1);
        const [vx, vy] = vp.convertToViewportPoint(x0, f);
        const [vx2, vy2] = vp.convertToViewportPoint(x0 + q.length * charW, f + fontH);
        const left = Math.min(vx, vx2), top = Math.min(vy, vy2);
        boxes.push({
          page: i - 1,
          x: Math.max(0, left / vp.width - 0.003),
          y: Math.max(0, top / vp.height - 0.004),
          w: Math.abs(vx2 - vx) / vp.width + 0.006,
          h: Math.abs(vy2 - vy) / vp.height + 0.008,
        });
        idx = lower.indexOf(q, idx + q.length);
      }
    }
  }
  await closePdf(doc);
  return boxes;
}

// ---------------------------------------------------------------- Formularios
// Se usa instanceof porque al compilar se acortan los nombres de las clases.
const fieldType = (f) =>
  f instanceof PDFTextField ? "PDFTextField"
    : f instanceof PDFCheckBox ? "PDFCheckBox"
      : f instanceof PDFDropdown ? "PDFDropdown"
        : f instanceof PDFOptionList ? "PDFOptionList"
          : f instanceof PDFRadioGroup ? "PDFRadioGroup" : "otro";

export async function readForm(file) {
  const doc = await load(file);
  const form = doc.getForm();
  return form.getFields().map((f) => {
    const type = fieldType(f);
    const name = f.getName();
    const base = { name, type };
    try {
      if (type === "PDFTextField") return { ...base, kind: "text", value: f.getText() || "", multiline: f.isMultiline() };
      if (type === "PDFCheckBox") return { ...base, kind: "check", value: f.isChecked() };
      if (type === "PDFDropdown") return { ...base, kind: "select", value: f.getSelected()[0] || "", options: f.getOptions() };
      if (type === "PDFOptionList") return { ...base, kind: "select", value: f.getSelected()[0] || "", options: f.getOptions() };
      if (type === "PDFRadioGroup") return { ...base, kind: "select", value: f.getSelected() || "", options: f.getOptions() };
    } catch { /* campo raro */ }
    return { ...base, kind: "unsupported" };
  });
}

export async function fillForm(file, values, { flatten }) {
  const doc = await load(file);
  const form = doc.getForm();
  for (const [name, value] of Object.entries(values)) {
    let f;
    try { f = form.getField(name); } catch { continue; }
    const type = fieldType(f);
    if (type === "PDFTextField") f.setText(String(value ?? ""));
    else if (type === "PDFCheckBox") (value ? f.check() : f.uncheck());
    else if ((type === "PDFDropdown" || type === "PDFOptionList") && value) f.select(value);
    else if (type === "PDFRadioGroup" && value) f.select(value);
  }
  try { form.updateFieldAppearances(await doc.embedFont(StandardFonts.Helvetica)); } catch { /* sin apariencias */ }
  if (flatten) form.flatten();
  return { blob: pdfBlob(await doc.save()), name: `${baseName(file.name)}_lleno.pdf` };
}

// ---------------------------------------------------------------- Encabezado y pie
export async function headerFooter(file, { header, footer, align, size }) {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;
  const date = new Date().toLocaleDateString("es-CO");
  const fill = (t, n) => String(t || "").replaceAll("{n}", String(n)).replaceAll("{total}", String(total)).replaceAll("{fecha}", date);
  const s = Number(size) || 10;
  for (const [t] of [[header], [footer]]) {
    try { font.encodeText(fill(t, 1)); } catch { throw new Error("El texto tiene caracteres no compatibles (por ejemplo emojis)."); }
  }
  pages.forEach((p, i) => {
    const { width, height } = p.getSize();
    const m = 30;
    for (const [text, y] of [[fill(header, i + 1), height - m], [fill(footer, i + 1), m - s / 2]]) {
      if (!text) continue;
      const tw = font.widthOfTextAtSize(text, s);
      const x = align === "izq" ? m : align === "der" ? width - m - tw : (width - tw) / 2;
      p.drawText(text, { x, y, size: s, font, color: rgb(0.25, 0.25, 0.25) });
    }
  });
  return { blob: pdfBlob(await doc.save()), name: `${baseName(file.name)}_encabezado.pdf` };
}

// ---------------------------------------------------------------- OCR
export async function ocr(file, { lang, maxPages, output }, onProgress) {
  const bytes = await readBytes(file);
  const pdfjsDoc = await openPdf(bytes);
  if (pdfjsDoc.numPages > maxPages) {
    await closePdf(pdfjsDoc);
    throw new Error(`El plan gratis hace OCR de hasta ${maxPages} páginas por archivo y este tiene ${pdfjsDoc.numPages}. Divide el PDF primero.`);
  }
  onProgress?.(0, 0, "Cargando el lector de texto (la primera vez tarda un poco)…");
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(lang);
  const src = await load(file);
  const out = await PDFDocument.create();
  let text = "";
  try {
    for (let i = 1; i <= pdfjsDoc.numPages; i++) {
      onProgress?.(i, pdfjsDoc.numPages, `Leyendo página ${i} de ${pdfjsDoc.numPages}…`);
      const { canvas } = await renderPage(pdfjsDoc, i, 300 / 72);
      const { data } = await worker.recognize(canvas, {}, { text: true, pdf: output === "pdf", pdfTextOnly: true });
      text += `--- Página ${i} ---\n${data.text}\n\n`;
      if (output === "pdf") {
        const [orig] = await out.copyPages(src, [i - 1]);
        const page = out.addPage(orig);
        if (data.pdf) {
          const layerDoc = await PDFDocument.load(new Uint8Array(data.pdf));
          const [layer] = await out.embedPdf(layerDoc, [0]);
          const { width, height } = page.getSize();
          page.drawPage(layer, { x: 0, y: 0, width, height });
        }
      }
    }
  } finally {
    await worker.terminate();
    await closePdf(pdfjsDoc);
  }
  if (output === "txt") return { blob: new Blob([text], { type: "text/plain;charset=utf-8" }), name: `${baseName(file.name)}_ocr.txt` };
  return { blob: pdfBlob(await out.save()), name: `${baseName(file.name)}_buscable.pdf` };
}

// ---------------------------------------------------------------- Comparar
export async function extractPagesText(file) {
  const doc = await openPdf(await readBytes(file));
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    pages.push(c.items.map((it) => it.str + (it.hasEOL ? "\n" : " ")).join("").replace(/[ \t]+/g, " ").trim());
  }
  await closePdf(doc);
  return pages;
}
