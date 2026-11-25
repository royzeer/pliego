import { PDFDocument, StandardFonts, rgb, degrees } from "@cantoo/pdf-lib";
import { readBytes, formatSize, parseRanges, flatPages, zipBlob, pdfBlob, baseName, canvasToBlob, loadImage } from "./files";
import { openPdf, renderPage, closePdf } from "./render";

// Tamaños de hoja en puntos (1 pt = 1/72 pulgada)
export const PAPER = {
  carta: [612, 792],
  a4: [595.28, 841.89],
  oficio: [612, 1008],
};
const MM = 72 / 25.4;

const load = async (file, opts = {}) => {
  const bytes = await readBytes(file);
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false, ...opts });
  } catch (err) {
    if (/encrypt/i.test(String(err?.message))) {
      throw new Error("Este PDF tiene contraseña. Primero quítala con la herramienta Desbloquear PDF.");
    }
    throw new Error("No pudimos leer este PDF. Prueba con la herramienta Reparar PDF.");
  }
};

const result = async (doc, name) => ({ blob: pdfBlob(await doc.save()), name });

const copyPages = async (src, indices) => {
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out;
};

const badRanges = () => new Error("Revisa las páginas. Usa el formato 1-3, 5, 8-10.");

// ---------------------------------------------------------------- Organizar
export async function merge(files) {
  const out = await PDFDocument.create();
  for (const f of files) {
    const src = await load(f);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return result(out, "pliego-unido.pdf");
}

export async function split(file, { mode, ranges }) {
  const src = await load(file);
  const total = src.getPageCount();
  const groups = mode === "cada" ? src.getPageIndices().map((i) => [i]) : parseRanges(ranges, total);
  if (!groups) throw badRanges();
  const base = baseName(file.name);
  const entries = [];
  for (const g of groups) {
    const doc = await copyPages(src, g);
    const label = g.length === 1 ? `${g[0] + 1}` : `${g[0] + 1}-${g[g.length - 1] + 1}`;
    entries.push({ name: `${base}_pag-${label}.pdf`, data: await doc.save() });
  }
  if (entries.length === 1) return { blob: pdfBlob(entries[0].data), name: entries[0].name };
  return { blob: await zipBlob(entries), name: `${base}_dividido.zip` };
}

export async function removePages(file, { pages }) {
  const src = await load(file);
  const total = src.getPageCount();
  const remove = flatPages(pages, total);
  if (!remove) throw badRanges();
  const keep = src.getPageIndices().filter((i) => !remove.includes(i));
  if (!keep.length) throw new Error("No puedes eliminar todas las páginas.");
  return result(await copyPages(src, keep), `${baseName(file.name)}_editado.pdf`);
}

export async function extractPages(file, { pages, separate }) {
  const src = await load(file);
  const list = flatPages(pages, src.getPageCount());
  if (!list) throw badRanges();
  if (separate) return split(file, { mode: "rangos", ranges: list.map((i) => i + 1).join(",") });
  return result(await copyPages(src, list), `${baseName(file.name)}_extraido.pdf`);
}

/** order: [{ index, rotation }] en el orden final. */
export async function organize(file, { order }) {
  const src = await load(file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, order.map((o) => o.index));
  pages.forEach((p, i) => {
    const extra = order[i].rotation || 0;
    if (extra) p.setRotation(degrees((p.getRotation().angle + extra) % 360));
    out.addPage(p);
  });
  return result(out, `${baseName(file.name)}_ordenado.pdf`);
}

export async function interleave(fileA, fileB, { reverseB }) {
  const a = await load(fileA);
  const b = await load(fileB);
  const out = await PDFDocument.create();
  const pa = await out.copyPages(a, a.getPageIndices());
  let pb = await out.copyPages(b, b.getPageIndices());
  if (reverseB) pb = pb.reverse();
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    if (pa[i]) out.addPage(pa[i]);
    if (pb[i]) out.addPage(pb[i]);
  }
  return result(out, `${baseName(fileA.name)}_intercalado.pdf`);
}

export async function nUp(file, { perSheet, paper }) {
  const src = await load(file);
  const out = await PDFDocument.create();
  let [W, H] = PAPER[paper] || PAPER.carta;
  const cols = 2;
  const rows = perSheet === 4 ? 2 : 1;
  if (perSheet === 2) [W, H] = [H, W]; // horizontal para 2 por hoja
  const margin = 18;
  const cellW = (W - margin * 2) / cols;
  const cellH = (H - margin * 2) / rows;
  // Las páginas vacías (sin contenido) no se pueden incrustar: dejamos su espacio en blanco.
  const embedded = [];
  for (const pg of src.getPages()) {
    if (!pg.node.Contents()) { embedded.push(null); continue; }
    try { embedded.push(await out.embedPage(pg)); } catch { embedded.push(null); }
  }
  for (let i = 0; i < embedded.length; i += perSheet) {
    const sheet = out.addPage([W, H]);
    for (let k = 0; k < perSheet && i + k < embedded.length; k++) {
      const ep = embedded[i + k];
      if (!ep) continue;
      const s = Math.min((cellW - 12) / ep.width, (cellH - 12) / ep.height);
      const w = ep.width * s;
      const h = ep.height * s;
      const col = k % cols;
      const row = Math.floor(k / cols);
      const x = margin + col * cellW + (cellW - w) / 2;
      const y = H - margin - (row + 1) * cellH + (cellH - h) / 2;
      sheet.drawPage(ep, { x, y, width: w, height: h });
    }
  }
  return result(out, `${baseName(file.name)}_${perSheet}-por-hoja.pdf`);
}

// ---------------------------------------------------------------- Editar
export async function rotate(file, { angle, pages }) {
  const doc = await load(file);
  const total = doc.getPageCount();
  const list = pages?.trim() ? flatPages(pages, total) : doc.getPageIndices();
  if (!list) throw badRanges();
  list.forEach((i) => {
    const p = doc.getPage(i);
    p.setRotation(degrees((p.getRotation().angle + angle) % 360));
  });
  return result(doc, `${baseName(file.name)}_rotado.pdf`);
}

const textFits = (font, text) => {
  try { font.encodeText(text); return true; } catch { return false; }
};

export async function pageNumbers(file, { position, start, format }) {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;
  const size = 10;
  pages.forEach((p, i) => {
    const n = i + Number(start || 1);
    const text = format === "de" ? `${n} de ${total + Number(start || 1) - 1}` : `${n}`;
    const { width, height } = p.getSize();
    const tw = font.widthOfTextAtSize(text, size);
    const m = 28;
    const x = position.endsWith("izq") ? m : position.endsWith("der") ? width - m - tw : (width - tw) / 2;
    const y = position.startsWith("arriba") ? height - m : m - size / 2;
    p.drawText(text, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
  });
  return result(doc, `${baseName(file.name)}_numerado.pdf`);
}

export async function watermark(file, { text, opacity, size }) {
  const doc = await load(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  if (!textFits(font, text)) throw new Error("La marca de agua tiene caracteres no compatibles (por ejemplo emojis).");
  doc.getPages().forEach((p) => {
    const { width, height } = p.getSize();
    const s = Number(size);
    const tw = font.widthOfTextAtSize(text, s);
    const ang = 35 * (Math.PI / 180);
    const x = width / 2 - (tw / 2) * Math.cos(ang) + (s / 2) * Math.sin(ang);
    const y = height / 2 - (tw / 2) * Math.sin(ang) - (s / 2) * Math.cos(ang);
    p.drawText(text, { x, y, size: s, font, color: rgb(0.45, 0.45, 0.45), opacity: Number(opacity), rotate: degrees(35) });
  });
  return result(doc, `${baseName(file.name)}_marca-de-agua.pdf`);
}

export async function crop(file, { top, right, bottom, left }) {
  const doc = await load(file);
  doc.getPages().forEach((p) => {
    const { x, y, width, height } = p.getMediaBox();
    const t = top * MM, r = right * MM, b = bottom * MM, l = left * MM;
    if (l + r >= width || t + b >= height) throw new Error("Los márgenes son más grandes que la página.");
    p.setCropBox(x + l, y + b, width - l - r, height - t - b);
  });
  return result(doc, `${baseName(file.name)}_recortado.pdf`);
}

// ---------------------------------------------------------------- Imágenes
const imageToJpegBytes = async (source, maxSide = 2400, quality = 0.88) => {
  const bmp = source instanceof ImageBitmap ? source : await loadImage(source);
  const s = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await canvasToBlob(c, "image/jpeg", quality);
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: c.width, height: c.height };
};

export async function imagesToPdf(files, { paper, margin }) {
  const out = await PDFDocument.create();
  for (const f of files) {
    const img = await imageToJpegBytes(f);
    const jpg = await out.embedJpg(img.bytes);
    if (paper === "ajustar") {
      const page = out.addPage([img.width * 0.75, img.height * 0.75]);
      page.drawImage(jpg, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      continue;
    }
    let [W, H] = PAPER[paper];
    if (img.width > img.height) [W, H] = [H, W];
    const m = margin ? 28 : 0;
    const s = Math.min((W - 2 * m) / img.width, (H - 2 * m) / img.height);
    const w = img.width * s, h = img.height * s;
    const page = out.addPage([W, H]);
    page.drawImage(jpg, { x: (W - w) / 2, y: (H - h) / 2, width: w, height: h });
  }
  return result(out, files.length === 1 ? `${baseName(files[0].name)}.pdf` : "pliego-imagenes.pdf");
}

export async function pdfToImages(file, { format, dpi }, onProgress) {
  const doc = await openPdf(await readBytes(file));
  const scale = Number(dpi) / 72;
  const type = format === "png" ? "image/png" : "image/jpeg";
  const ext = format === "png" ? "png" : "jpg";
  const base = baseName(file.name);
  const entries = [];
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const { canvas } = await renderPage(doc, i, scale);
    const blob = await canvasToBlob(canvas, type, 0.9);
    entries.push({ name: `${base}_pag-${i}.${ext}`, data: blob });
  }
  await closePdf(doc);
  if (entries.length === 1) return { blob: entries[0].data, name: entries[0].name };
  return { blob: await zipBlob(entries), name: `${base}_imagenes.zip` };
}

/** Cédula: las dos caras en una hoja, cada una a 85,6 × 54 mm (tamaño real). */
export async function idCard(front, back, { paper, rotations = [0, 0] }) {
  const out = await PDFDocument.create();
  const [W, H] = PAPER[paper] || PAPER.carta;
  const page = out.addPage([W, H]);
  const cardW = 85.6 * MM;
  const cardH = 54 * MM;
  const gap = 14 * MM;
  const sides = [front, back];
  for (let k = 0; k < 2; k++) {
    const bmp = await loadImage(sides[k]);
    let rot = rotations[k] || 0;
    if (bmp.height > bmp.width && rot === 0) rot = 90; // foto vertical: la acostamos
    const swap = rot % 180 !== 0;
    const iw = swap ? bmp.height : bmp.width;
    const ih = swap ? bmp.width : bmp.height;
    // Lienzo con la proporción exacta de la cédula (1712 x 1080 px aprox. 500 ppp)
    const c = document.createElement("canvas");
    c.width = 1712;
    c.height = 1080;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    const s = Math.max(c.width / iw, c.height / ih); // recorte tipo "cover"
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(bmp, (-bmp.width * s) / 2, (-bmp.height * s) / 2, bmp.width * s, bmp.height * s);
    const blob = await canvasToBlob(c, "image/jpeg", 0.9);
    const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const x = (W - cardW) / 2;
    const y = H - 30 * MM - cardH - k * (cardH + gap);
    page.drawImage(jpg, { x, y, width: cardW, height: cardH });
    page.drawRectangle({ x, y, width: cardW, height: cardH, borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.5 });
  }
  return result(out, "cedula-ambas-caras.pdf");
}

// ---------------------------------------------------------------- Optimizar
const PRESETS = {
  baja: { scale: 1.2, quality: 0.5 },
  media: { scale: 1.6, quality: 0.65 },
  alta: { scale: 2, quality: 0.8 },
};

const rasterize = async (pageCanvases, quality) => {
  const out = await PDFDocument.create();
  for (const { canvas, width, height } of pageCanvases) {
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const page = out.addPage([width, height]);
    page.drawImage(jpg, { x: 0, y: 0, width, height });
  }
  return out.save({ useObjectStreams: true });
};

const renderAll = async (doc, scale, onProgress) => {
  const list = [];
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1 });
    const { canvas } = await renderPage(doc, i, scale);
    list.push({ canvas, width: vp.width, height: vp.height });
  }
  return list;
};

export async function compress(file, { level }, onProgress) {
  const bytes = await readBytes(file);
  const preset = PRESETS[level] || PRESETS.media;
  const doc = await openPdf(bytes);
  const canvases = await renderAll(doc, preset.scale, onProgress);
  const outBytes = await rasterize(canvases, preset.quality);
  await closePdf(doc);
  if (outBytes.length >= bytes.length) {
    return { blob: pdfBlob(bytes), name: file.name, note: "Tu PDF ya estaba muy optimizado; te devolvemos el original." };
  }
  return { blob: pdfBlob(outBytes), name: `${baseName(file.name)}_comprimido.pdf` };
}

/** Busca la mejor calidad que quede por debajo del peso objetivo. */
export async function compressToTarget(file, { targetMB }, onProgress) {
  const bytes = await readBytes(file);
  const target = Number(targetMB) * 1024 * 1024;
  if (bytes.length <= target) {
    return { blob: pdfBlob(bytes), name: file.name, note: "Tu archivo ya pesa menos del objetivo; no hubo que cambiar nada." };
  }
  const doc = await openPdf(bytes);
  const scales = [2, 1.6, 1.3, 1.1, 0.9, 0.75, 0.6];
  let best = null;
  for (const scale of scales) {
    onProgress?.(0, 0, `Probando resolución ${Math.round(scale * 72)} ppp…`);
    const canvases = await renderAll(doc, scale);
    let lo = 0.25, hi = 0.9;
    // Prueba rápida con la calidad más baja: si no cabe, bajamos la resolución
    const low = await rasterize(canvases, lo);
    if (low.length > target) continue;
    best = low;
    for (let k = 0; k < 5; k++) {
      const mid = (lo + hi) / 2;
      const out = await rasterize(canvases, mid);
      if (out.length <= target) { best = out; lo = mid; } else { hi = mid; }
    }
    break;
  }
  await closePdf(doc);
  if (!best) throw new Error("No logramos llegar a ese peso sin dañar la lectura. Prueba con un objetivo más alto o divide el PDF.");
  return { blob: pdfBlob(best), name: `${baseName(file.name)}_max-${String(targetMB).replace(".", ",")}MB.pdf` };
}

export async function stripMetadata(file) {
  const doc = await load(file);
  doc.setTitle(""); doc.setAuthor(""); doc.setSubject(""); doc.setKeywords([]);
  doc.setCreator(""); doc.setProducer("");
  const epoch = new Date(0);
  doc.setCreationDate(epoch); doc.setModificationDate(epoch);
  return result(doc, `${baseName(file.name)}_limpio.pdf`);
}

export async function repair(file, _opts, onProgress) {
  const bytes = await readBytes(file);
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false, updateMetadata: false });
    const out = await copyPages(doc, doc.getPageIndices());
    return { blob: pdfBlob(await out.save()), name: `${baseName(file.name)}_reparado.pdf` };
  } catch {
    // Plan B: pdf.js es más tolerante. Reconstruimos el PDF como imágenes.
    const doc = await openPdf(bytes);
    const canvases = await renderAll(doc, 2, onProgress);
    const out = await rasterize(canvases, 0.85);
    await closePdf(doc);
    return { blob: pdfBlob(out), name: `${baseName(file.name)}_reparado.pdf`, note: "Reconstruimos el PDF como imágenes; el texto ya no se podrá seleccionar." };
  }
}

// ---------------------------------------------------------------- Seguridad
export async function protect(file, { password }) {
  if (!password || password.length < 4) throw new Error("La contraseña debe tener al menos 4 caracteres.");
  const doc = await load(file);
  doc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: { printing: "highResolution", modifying: false, copying: false, annotating: false },
  });
  return result(doc, `${baseName(file.name)}_protegido.pdf`);
}

export async function unlock(file, { password }) {
  const bytes = await readBytes(file);
  let doc;
  try {
    doc = await PDFDocument.load(bytes, { password, updateMetadata: false });
  } catch {
    throw new Error("La contraseña no es correcta o el PDF usa un cifrado no compatible.");
  }
  const out = await copyPages(doc, doc.getPageIndices());
  return { blob: pdfBlob(await out.save()), name: `${baseName(file.name)}_desbloqueado.pdf` };
}

// ---------------------------------------------------------------- Texto
const pageLines = async (doc, i) => {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const lines = [];
  let current = null;
  for (const item of content.items) {
    if (!("str" in item)) continue;
    const y = Math.round(item.transform[5]);
    const size = Math.round(Math.hypot(item.transform[0], item.transform[1]));
    if (!current || Math.abs(current.y - y) > 2) {
      current = { y, size, text: item.str };
      lines.push(current);
    } else {
      current.text += item.str;
      current.size = Math.max(current.size, size);
    }
    if (item.hasEOL) current = null;
  }
  return lines.map((l) => ({ ...l, text: l.text.replace(/\s+/g, " ").trim() })).filter((l) => l.text);
};

export async function extractText(file, _opts, onProgress) {
  const doc = await openPdf(await readBytes(file));
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const lines = await pageLines(doc, i);
    out += `--- Página ${i} ---\n${lines.map((l) => l.text).join("\n")}\n\n`;
  }
  await closePdf(doc);
  if (!out.replace(/--- Página \d+ ---/g, "").trim()) {
    throw new Error("Este PDF no tiene texto (parece escaneado). Pronto podrás usar OCR para leerlo.");
  }
  return { blob: new Blob([out], { type: "text/plain;charset=utf-8" }), name: `${baseName(file.name)}.txt` };
}

export async function toMarkdown(file, { maxPages }, onProgress) {
  const doc = await openPdf(await readBytes(file));
  if (doc.numPages > maxPages) {
    await closePdf(doc);
    throw new Error(`El plan gratis convierte hasta ${maxPages} páginas por archivo y este tiene ${doc.numPages}. Divide el PDF o pásate a Pro.`);
  }
  const all = [];
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    all.push(await pageLines(doc, i));
  }
  await closePdf(doc);
  const sizes = all.flat().map((l) => l.size).sort((a, b) => a - b);
  if (!sizes.length) throw new Error("Este PDF no tiene texto (parece escaneado).");
  const body = sizes[Math.floor(sizes.length / 2)];
  let md = "";
  for (const lines of all) {
    for (const l of lines) {
      let t = l.text;
      if (l.size >= body * 1.6) t = `# ${t}`;
      else if (l.size >= body * 1.3) t = `## ${t}`;
      else if (l.size >= body * 1.12 && t.length < 90) t = `### ${t}`;
      else if (/^[•●▪◦‣\-–]\s*/.test(t)) t = `- ${t.replace(/^[•●▪◦‣\-–]\s*/, "")}`;
      md += `${t}\n\n`;
    }
  }
  return { blob: new Blob([md], { type: "text/markdown;charset=utf-8" }), name: `${baseName(file.name)}.md` };
}

// ---------------------------------------------------------------- Revisor
export async function analyze(file, { maxMB }) {
  const bytes = await readBytes(file);
  const checks = [];
  const sizeMB = bytes.length / (1024 * 1024);
  checks.push({
    ok: !maxMB || sizeMB <= maxMB,
    label: "Peso",
    detail: `${formatSize(bytes.length)}${maxMB ? ` (máximo ${maxMB} MB)` : ""}`,
    fix: maxMB && sizeMB > maxMB ? "comprimir-a-peso" : null,
  });
  let doc;
  try {
    doc = await PDFDocument.load(bytes, { updateMetadata: false });
    checks.push({ ok: true, label: "Contraseña", detail: "No tiene contraseña" });
  } catch (err) {
    const enc = /encrypt/i.test(String(err?.message));
    checks.push({ ok: false, label: enc ? "Contraseña" : "Archivo", detail: enc ? "Tiene contraseña; muchas plataformas lo rechazan" : "El archivo parece dañado", fix: enc ? "desbloquear-pdf" : "reparar-pdf" });
    return checks;
  }
  const pages = doc.getPages();
  checks.push({ ok: true, label: "Páginas", detail: `${pages.length} página${pages.length === 1 ? "" : "s"}` });
  const kinds = new Set(pages.map((p) => {
    const { width, height } = p.getSize();
    const [w, h] = [Math.min(width, height), Math.max(width, height)];
    if (Math.abs(w - 612) < 6 && Math.abs(h - 792) < 6) return "Carta";
    if (Math.abs(w - 595) < 6 && Math.abs(h - 842) < 6) return "A4";
    if (Math.abs(w - 612) < 6 && Math.abs(h - 1008) < 6) return "Oficio";
    return "Otro";
  }));
  checks.push({ ok: kinds.size === 1, label: "Tamaño de hoja", detail: [...kinds].join(", ") + (kinds.size > 1 ? " (mezclados)" : "") });
  const rotated = pages.map((p, i) => (p.getRotation().angle % 360 !== 0 ? i + 1 : null)).filter(Boolean);
  checks.push({ ok: !rotated.length, label: "Orientación", detail: rotated.length ? `Páginas giradas: ${rotated.join(", ")}` : "Todas derechas", fix: rotated.length ? "ordenar-pdf" : null });

  // Páginas en blanco: renderizamos pequeño y medimos cuánta tinta hay
  const pdfjsDoc = await openPdf(bytes);
  const blanks = [];
  for (let i = 1; i <= Math.min(pdfjsDoc.numPages, 200); i++) {
    const { canvas } = await renderPage(pdfjsDoc, i, 0.25);
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let ink = 0;
    for (let k = 0; k < data.length; k += 4) if (data[k] < 235 || data[k + 1] < 235 || data[k + 2] < 235) ink++;
    if (ink / (data.length / 4) < 0.002) blanks.push(i);
  }
  await closePdf(pdfjsDoc);
  checks.push({ ok: !blanks.length, label: "Páginas en blanco", detail: blanks.length ? `En blanco: ${blanks.join(", ")}` : "Ninguna", fix: blanks.length ? "eliminar-paginas" : null });
  return checks;
}
