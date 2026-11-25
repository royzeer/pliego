// Conversiones entre PDF y Office/HTML, todas dentro del navegador.
// Las librerías pesadas se cargan solo cuando se usa la herramienta.
import { PDFDocument } from "@cantoo/pdf-lib";
import { readBytes, pdfBlob, baseName, canvasToBlob } from "./files";
import { openPdf, renderPage, closePdf } from "./render";
import { PAPER } from "./pdf";

const limitPages = async (doc, max) => {
  if (doc.numPages > max) {
    await closePdf(doc);
    throw new Error(`El plan gratis convierte hasta ${max} páginas por archivo y este tiene ${doc.numPages}. Divide el PDF primero.`);
  }
};

// ---------------------------------------------------------------- Texto con posiciones
async function pageItems(doc, i) {
  const page = await doc.getPage(i);
  const vp = page.getViewport({ scale: 1 });
  const content = await page.getTextContent();
  const items = content.items
    .filter((it) => "str" in it && it.str.trim())
    .map((it) => {
      const [x, y] = vp.convertToViewportPoint(it.transform[4], it.transform[5]);
      return { str: it.str, x, y, w: it.width, size: Math.round(Math.hypot(it.transform[2], it.transform[3])) || 10 };
    });
  return { items, vp };
}

const groupLines = (items, tol = 3) => {
  const lines = [];
  for (const it of [...items].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const line = lines.find((l) => Math.abs(l.y - it.y) <= tol);
    if (line) line.items.push(it); else lines.push({ y: it.y, items: [it] });
  }
  lines.forEach((l) => l.items.sort((a, b) => a.x - b.x));
  return lines.sort((a, b) => a.y - b.y);
};

// ---------------------------------------------------------------- PDF a Word
export async function pdfToWord(file, { mode, maxPages }, onProgress) {
  const docx = await import("docx");
  const doc = await openPdf(await readBytes(file));
  await limitPages(doc, maxPages);
  const children = [];
  let pageW = 612, pageH = 792;
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    if (mode === "imagen") {
      const { canvas, width, height } = await renderPage(doc, i, 2);
      if (i === 1) { pageW = width; pageH = height; }
      const data = new Uint8Array(await (await canvasToBlob(canvas, "image/jpeg", 0.85)).arrayBuffer());
      children.push(new docx.Paragraph({
        pageBreakBefore: i > 1,
        children: [new docx.ImageRun({ type: "jpg", data, transformation: { width: Math.round((width * 96) / 72 * 0.86), height: Math.round((height * 96) / 72 * 0.86) } })],
      }));
      continue;
    }
    const { items, vp } = await pageItems(doc, i);
    if (i === 1) { pageW = vp.width; pageH = vp.height; }
    const lines = groupLines(items);
    const sizes = items.map((x) => x.size).sort((a, b) => a - b);
    const body = sizes[Math.floor(sizes.length / 2)] || 11;
    let para = [];
    let lastY = null;
    let pageStart = true;
    const flush = () => {
      if (!para.length) return;
      const size = Math.max(...para.map((l) => l.size));
      const text = para.map((l) => l.text).join(" ");
      const heading = size >= body * 1.5 ? docx.HeadingLevel.HEADING_1 : size >= body * 1.2 ? docx.HeadingLevel.HEADING_2 : undefined;
      children.push(new docx.Paragraph({
        heading,
        pageBreakBefore: pageStart && i > 1,
        spacing: { after: 120 },
        children: [new docx.TextRun({ text, size: Math.round(size * 2), font: "Calibri", bold: !!heading })],
      }));
      pageStart = false;
      para = [];
    };
    for (const l of lines) {
      const text = l.items.map((x) => x.str).join(" ").replace(/\s+/g, " ").trim();
      const size = Math.max(...l.items.map((x) => x.size));
      const gap = lastY == null ? 0 : l.y - lastY;
      if (lastY != null && (gap > size * 1.8 || Math.abs(size - (para[0]?.size || size)) > 1.5)) flush();
      para.push({ text, size });
      lastY = l.y;
    }
    flush();
    if (!items.length) children.push(new docx.Paragraph({ pageBreakBefore: i > 1, children: [] }));
  }
  await closePdf(doc);
  if (mode !== "imagen" && !children.length) throw new Error("Este PDF no tiene texto (parece escaneado). Usa el modo Igual al original o pásalo primero por OCR.");
  const twip = (pt) => Math.round(pt * 20);
  const document = new docx.Document({
    sections: [{
      properties: { page: { size: { width: twip(pageW), height: twip(pageH) }, margin: mode === "imagen" ? { top: 360, bottom: 360, left: 360, right: 360 } : undefined } },
      children,
    }],
  });
  const blob = await docx.Packer.toBlob(document);
  return { blob, name: `${baseName(file.name)}.docx` };
}

// ---------------------------------------------------------------- PDF a PowerPoint
export async function pdfToPowerPoint(file, { maxPages }, onProgress) {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const doc = await openPdf(await readBytes(file));
  await limitPages(doc, maxPages);
  const pptx = new PptxGenJS();
  const first = (await doc.getPage(1)).getViewport({ scale: 1 });
  pptx.defineLayout({ name: "PDF", width: first.width / 72, height: first.height / 72 });
  pptx.layout = "PDF";
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const { canvas } = await renderPage(doc, i, 2);
    const slide = pptx.addSlide();
    slide.addImage({ data: canvas.toDataURL("image/jpeg", 0.88), x: 0, y: 0, w: first.width / 72, h: first.height / 72 });
  }
  await closePdf(doc);
  const blob = await pptx.write({ outputType: "blob" });
  return { blob, name: `${baseName(file.name)}.pptx` };
}

// ---------------------------------------------------------------- PDF a Excel
export async function pdfToExcel(file, { maxPages }, onProgress) {
  const XLSX = await import("xlsx");
  const doc = await openPdf(await readBytes(file));
  await limitPages(doc, maxPages);
  const wb = XLSX.utils.book_new();
  let any = false;
  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const { items } = await pageItems(doc, i);
    if (!items.length) continue;
    any = true;
    // Columnas: agrupamos las posiciones x de inicio cercanas
    const xs = [...items.map((x) => x.x)].sort((a, b) => a - b);
    const cols = [];
    for (const x of xs) { if (!cols.length || x - cols[cols.length - 1] > 14) cols.push(x); }
    const colOf = (x) => cols.reduce((best, c, k) => (Math.abs(c - x) < Math.abs(cols[best] - x) ? k : best), 0);
    const rows = groupLines(items).map((l) => {
      const row = [];
      for (const it of l.items) {
        const c = colOf(it.x);
        row[c] = row[c] ? `${row[c]} ${it.str}` : it.str;
      }
      return Array.from(row, (v) => {
        if (v == null) return "";
        const t = v.trim();
        const num = t.replace(/\$|\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
        return /^-?\d+(\.\d+)?$/.test(num) && t.length < 18 ? Number(num) : t;
      });
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = cols.map(() => ({ wch: 18 }));
    XLSX.utils.book_append_sheet(wb, ws, `Página ${i}`);
  }
  await closePdf(doc);
  if (!any) throw new Error("Este PDF no tiene texto (parece escaneado). Pásalo primero por OCR.");
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return { blob: new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), name: `${baseName(file.name)}.xlsx` };
}

// ---------------------------------------------------------------- PDF a PDF/A
const PDFA_DEF = `%!
/ICCProfile (%rom%iccprofiles/default_rgb.icc) def
[/_objdef {icc_PDFA} /type /stream /OBJ pdfmark
[{icc_PDFA} <</N 3>> /PUT pdfmark
[{icc_PDFA} ICCProfile (r) file /PUT pdfmark
[/_objdef {OutputIntent_PDFA} /type /dict /OBJ pdfmark
[{OutputIntent_PDFA} << /Type /OutputIntent /S /GTS_PDFA1 /DestOutputProfile {icc_PDFA} /OutputConditionIdentifier (sRGB) /Info (sRGB IEC61966-2.1) >> /PUT pdfmark
[{Catalog} <</OutputIntents [ {OutputIntent_PDFA} ]>> /PUT pdfmark
`;

let gsPromise = null;
const loadGs = () => {
  gsPromise ||= import("@okathira/ghostpdl-wasm").then(async (m) => {
    const wasmUrl = (await import("@okathira/ghostpdl-wasm/gs.wasm?url")).default;
    return m.default({ locateFile: () => wasmUrl, print: () => {}, printErr: () => {} });
  });
  return gsPromise;
};

export async function pdfToPdfA(file, { level }, onProgress) {
  onProgress?.(0, 0, "Cargando el convertidor (la primera vez tarda unos segundos)…");
  const gs = await loadGs();
  onProgress?.(0, 0, "Convirtiendo a PDF/A…");
  const id = Date.now();
  const inName = `in${id}.pdf`, outName = `out${id}.pdf`;
  gs.FS.writeFile(inName, await readBytes(file));
  gs.FS.writeFile("PDFA_def.ps", PDFA_DEF);
  const code = gs.callMain([
    `-dPDFA=${level || 2}`, "-dBATCH", "-dNOPAUSE", "-dNOSAFER", "-sColorConversionStrategy=RGB",
    "-dPDFACompatibilityPolicy=1", "-sDEVICE=pdfwrite", `-sOutputFile=${outName}`, "PDFA_def.ps", inName,
  ]);
  let out;
  try { out = gs.FS.readFile(outName); } catch { out = null; }
  try { gs.FS.unlink(inName); gs.FS.unlink(outName); } catch { /* limpio */ }
  if (code !== 0 || !out?.length) throw new Error("No pudimos convertir este PDF a PDF/A. Si tiene contraseña, quítala primero.");
  return { blob: pdfBlob(out), name: `${baseName(file.name)}_PDFA.pdf` };
}

// ---------------------------------------------------------------- HTML/Office a PDF
/** Parte un canvas alto en páginas y arma un PDF. */
async function canvasesToPdf(canvases, paper, orientation) {
  const out = await PDFDocument.create();
  let [W, H] = PAPER[paper] || PAPER.carta;
  if (orientation === "horizontal") [W, H] = [H, W];
  const margin = 24;
  for (const c of canvases) {
    const scale = (W - 2 * margin) / c.width;
    const sliceH = Math.floor((H - 2 * margin) / scale);
    for (let y = 0; y < c.height; y += sliceH) {
      const h = Math.min(sliceH, c.height - y);
      const part = document.createElement("canvas");
      part.width = c.width; part.height = h;
      const ctx = part.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, part.width, part.height);
      ctx.drawImage(c, 0, y, c.width, h, 0, 0, c.width, h);
      const jpg = await out.embedJpg(new Uint8Array(await (await canvasToBlob(part, "image/jpeg", 0.9)).arrayBuffer()));
      const page = out.addPage([W, H]);
      page.drawImage(jpg, { x: margin, y: H - margin - h * scale, width: c.width * scale, height: h * scale });
    }
  }
  return out.save();
}

const offscreen = (width) => {
  const box = document.createElement("div");
  box.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;background:#fff;color:#000;font-family:Calibri,Carlito,Arial,sans-serif;`;
  document.body.appendChild(box);
  return box;
};

const snap = async (el) => {
  const { default: html2canvas } = await import("html2canvas-pro");
  return html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
};

export async function wordToPdf(file, { paper }, onProgress) {
  const { renderAsync } = await import("docx-preview");
  onProgress?.(0, 0, "Leyendo el documento…");
  const box = offscreen(820);
  try {
    await renderAsync(await file.arrayBuffer(), box, undefined, { inWrapper: false, breakPages: true, ignoreLastRenderedPageBreak: false, experimental: true });
    const sections = [...box.querySelectorAll("section.docx")];
    if (!sections.length) throw new Error("No pudimos leer este documento. Revisa que sea un archivo .docx.");
    const canvases = [];
    for (let i = 0; i < sections.length; i++) {
      onProgress?.(i + 1, sections.length, `Convirtiendo parte ${i + 1} de ${sections.length}…`);
      canvases.push(await snap(sections[i]));
    }
    const bytes = await canvasesToPdf(canvases, paper);
    return { blob: pdfBlob(bytes), name: `${baseName(file.name)}.pdf` };
  } finally { box.remove(); }
}

export async function excelToPdf(file, { paper, orientation }, onProgress) {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const canvases = [];
  for (let i = 0; i < wb.SheetNames.length; i++) {
    const name = wb.SheetNames[i];
    onProgress?.(i + 1, wb.SheetNames.length, `Convirtiendo la hoja ${name}…`);
    const html = XLSX.utils.sheet_to_html(wb.Sheets[name], { header: "", footer: "" });
    const box = offscreen(orientation === "horizontal" ? 1400 : 1000);
    box.innerHTML = `<style>
      .xl{font-family:Calibri,Arial,sans-serif;font-size:13px;padding:8px}
      .xl h3{font-size:15px;margin:0 0 8px}
      .xl table{border-collapse:collapse;width:100%}
      .xl td{border:1px solid #c9c9c9;padding:4px 6px;vertical-align:top}
      .xl tr:first-child td{background:#f1f1f1;font-weight:600}
    </style><div class="xl"><h3>${name.replace(/</g, "&lt;")}</h3>${html}</div>`;
    try { canvases.push(await snap(box.firstElementChild.nextElementSibling)); } finally { box.remove(); }
  }
  const bytes = await canvasesToPdf(canvases, paper, orientation);
  return { blob: pdfBlob(bytes), name: `${baseName(file.name)}.pdf` };
}

// PowerPoint a PDF: lee el .pptx (que es un ZIP con XML) y dibuja cada diapositiva
// con sus fondos, rectángulos de color, textos e imágenes.
const EMU = 12700; // unidades de PowerPoint por punto
const NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main";
const NS_P = "http://schemas.openxmlformats.org/presentationml/2006/main";
const NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

const kids = (el, ns, name) => (el ? [...el.children].filter((c) => c.localName === name && (!ns || c.namespaceURI === ns)) : []);
const kid = (el, ns, name) => kids(el, ns, name)[0];
const deep = (el, name) => (el ? el.getElementsByTagNameNS("*", name)[0] : undefined);

const parseXml = async (zip, path) => {
  const f = zip.file(path);
  return f ? new DOMParser().parseFromString(await f.async("string"), "application/xml") : null;
};
const relsOf = async (zip, path) => {
  const dir = path.slice(0, path.lastIndexOf("/"));
  const name = path.slice(path.lastIndexOf("/") + 1);
  const doc = await parseXml(zip, `${dir}/_rels/${name}.rels`);
  const map = {};
  if (!doc) return map;
  for (const r of doc.getElementsByTagName("Relationship")) {
    const target = r.getAttribute("Target");
    const full = target.startsWith("/") ? target.slice(1) : new URL(target, `http://x/${dir}/`).pathname.slice(1);
    map[r.getAttribute("Id")] = { target: full, type: r.getAttribute("Type") };
  }
  return map;
};

const colorOf = (el) => {
  const solid = el && (kid(el, NS_A, "solidFill") || (el.localName === "solidFill" ? el : null));
  const srgb = solid && kid(solid, NS_A, "srgbClr");
  if (srgb) return srgb.getAttribute("val");
  const sys = solid && kid(solid, NS_A, "sysClr");
  if (sys) return sys.getAttribute("lastClr") || "000000";
  return null;
};
const hex = (h) => {
  const n = parseInt(h, 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};

export async function powerpointToPdf(file, _opts, onProgress) {
  const { default: JSZip } = await import("jszip");
  const { rgb, StandardFonts } = await import("@cantoo/pdf-lib");
  onProgress?.(0, 0, "Leyendo la presentación…");
  let zip;
  try { zip = await JSZip.loadAsync(await file.arrayBuffer()); } catch { throw new Error("No pudimos leer esta presentación. Revisa que sea un archivo .pptx."); }
  const pres = await parseXml(zip, "ppt/presentation.xml");
  if (!pres) throw new Error("No pudimos leer esta presentación. Revisa que sea un archivo .pptx.");
  const sz = deep(pres, "sldSz");
  const W = Number(sz?.getAttribute("cx") || 12192000) / EMU;
  const H = Number(sz?.getAttribute("cy") || 6858000) / EMU;
  const presRels = await relsOf(zip, "ppt/presentation.xml");
  const slidePaths = [...pres.getElementsByTagNameNS(NS_P, "sldId")].map((s) => presRels[s.getAttributeNS(NS_R, "id")]?.target).filter(Boolean);

  const out = await PDFDocument.create();
  const fonts = { r: await out.embedFont(StandardFonts.Helvetica), b: await out.embedFont(StandardFonts.HelveticaBold) };
  const clean = (font, t) => [...t].filter((ch) => { try { font.encodeText(ch); return true; } catch { return false; } }).join("");

  // Posición de un marcador de posición heredado del diseño o del patrón
  const placeholderXfrm = async (layoutPath, ph) => {
    for (const path of [layoutPath, (await relsOf(zip, layoutPath)) && Object.values(await relsOf(zip, layoutPath)).find((r) => /slideMaster/.test(r.type))?.target]) {
      if (!path) continue;
      const doc = await parseXml(zip, path);
      if (!doc) continue;
      for (const sp of doc.getElementsByTagNameNS(NS_P, "sp")) {
        const p2 = deep(sp, "ph");
        if (!p2) continue;
        const sameType = (p2.getAttribute("type") || "body") === (ph.getAttribute("type") || "body");
        const sameIdx = ph.getAttribute("idx") && p2.getAttribute("idx") === ph.getAttribute("idx");
        if (sameIdx || sameType) {
          const x = deep(sp, "xfrm");
          if (x) return x;
        }
      }
    }
    return null;
  };

  for (let s = 0; s < slidePaths.length; s++) {
    onProgress?.(s + 1, slidePaths.length, `Convirtiendo diapositiva ${s + 1} de ${slidePaths.length}…`);
    const path = slidePaths[s];
    const doc = await parseXml(zip, path);
    const rels = await relsOf(zip, path);
    const layoutPath = Object.values(rels).find((r) => /slideLayout/.test(r.type))?.target;
    const page = out.addPage([W, H]);
    const bgColor = colorOf(deep(doc, "bgPr")) || "FFFFFF";
    const c = hex(bgColor);
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(c.r, c.g, c.b) });

    const drawTree = async (container, tf) => {
      for (const el of container.children) {
        const name = el.localName;
        if (name === "grpSp") {
          const x = deep(kid(el, NS_P, "grpSpPr"), "xfrm");
          let t2 = tf;
          if (x) {
            const off = kid(x, NS_A, "off"), ext = kid(x, NS_A, "ext"), chOff = kid(x, NS_A, "chOff"), chExt = kid(x, NS_A, "chExt");
            const sx = Number(ext.getAttribute("cx")) / (Number(chExt.getAttribute("cx")) || 1);
            const sy = Number(ext.getAttribute("cy")) / (Number(chExt.getAttribute("cy")) || 1);
            const ox = Number(off.getAttribute("x")) - Number(chOff.getAttribute("x")) * sx;
            const oy = Number(off.getAttribute("y")) - Number(chOff.getAttribute("y")) * sy;
            t2 = { sx: tf.sx * sx, sy: tf.sy * sy, ox: tf.ox + ox * tf.sx, oy: tf.oy + oy * tf.sy };
          }
          await drawTree(el, t2);
          continue;
        }
        if (name !== "sp" && name !== "pic") continue;
        const spPr = kid(el, NS_P, "spPr");
        let xfrm = deep(spPr, "xfrm");
        if (!xfrm) {
          const ph = deep(el, "ph");
          if (ph && layoutPath) xfrm = await placeholderXfrm(layoutPath, ph);
        }
        if (!xfrm) continue;
        const off = kid(xfrm, NS_A, "off"), ext = kid(xfrm, NS_A, "ext");
        if (!off || !ext) continue;
        const bx = (tf.ox + Number(off.getAttribute("x")) * tf.sx) / EMU;
        const by = (tf.oy + Number(off.getAttribute("y")) * tf.sy) / EMU;
        const bw = (Number(ext.getAttribute("cx")) * tf.sx) / EMU;
        const bh = (Number(ext.getAttribute("cy")) * tf.sy) / EMU;

        if (name === "pic") {
          const blip = deep(el, "blip");
          const rel = blip && rels[blip.getAttributeNS(NS_R, "embed")];
          const media = rel && zip.file(rel.target);
          if (media) {
            const bytes = await media.async("uint8array");
            try {
              const img = /\.png$/i.test(rel.target) ? await out.embedPng(bytes) : /\.jpe?g$/i.test(rel.target) ? await out.embedJpg(bytes) : null;
              if (img) page.drawImage(img, { x: bx, y: H - by - bh, width: bw, height: bh });
            } catch { /* formato de imagen no compatible */ }
          }
          continue;
        }

        const fill = colorOf(spPr);
        if (fill) { const f = hex(fill); page.drawRectangle({ x: bx, y: H - by - bh, width: bw, height: bh, color: rgb(f.r, f.g, f.b) }); }

        const body = kid(el, NS_P, "txBody");
        if (!body) continue;
        const ph = deep(el, "ph");
        const isTitle = ph && /title/i.test(ph.getAttribute("type") || "");
        const pad = 7;
        const anchor = kid(body, NS_A, "bodyPr")?.getAttribute("anchor") || (isTitle ? "ctr" : "t");
        // Primero armamos todas las líneas para saber cuánto miden
        const lines = [];
        for (const para of kids(body, NS_A, "p")) {
          const runs = [...kids(para, NS_A, "r"), ...kids(para, NS_A, "fld")];
          const pPr = kid(para, NS_A, "pPr");
          const algn = pPr?.getAttribute("algn") || (isTitle ? "ctr" : "l");
          const first = runs[0] && kid(runs[0], NS_A, "rPr");
          const end = kid(para, NS_A, "endParaRPr");
          const size = Number((first || end)?.getAttribute("sz") || (isTitle ? 3600 : 1800)) / 100;
          const bold = (first?.getAttribute("b") || "0") === "1" || isTitle;
          const font = bold ? fonts.b : fonts.r;
          const col = hex(colorOf(first) || "222222");
          const text = clean(font, runs.map((r) => kid(r, NS_A, "t")?.textContent || "").join(""));
          const bullet = kid(pPr, NS_A, "buChar") ? "• " : "";
          if (!text.trim()) { lines.push({ gap: size * 1.2 }); continue; }
          let line = "";
          const maxW = Math.max(40, bw - 2 * pad);
          for (const w of (bullet + text).split(/\s+/)) {
            const t = line ? `${line} ${w}` : w;
            if (font.widthOfTextAtSize(t, size) > maxW && line) { lines.push({ text: line, size, font, col, algn }); line = w; } else line = t;
          }
          lines.push({ text: line, size, font, col, algn });
          lines.push({ gap: size * 0.25 });
        }
        const total = lines.reduce((a, l) => a + (l.gap ?? l.size * 1.15), 0);
        let cy = H - by - pad;
        if (bh > total + 2 * pad) {
          if (anchor === "ctr") cy = H - by - (bh - total) / 2;
          else if (anchor === "b") cy = H - by - bh + total + pad;
        }
        for (const l of lines) {
          if (l.gap) { cy -= l.gap; continue; }
          cy -= l.size * 1.15;
          const tw = l.font.widthOfTextAtSize(l.text, l.size);
          const x = l.algn === "ctr" ? bx + (bw - tw) / 2 : l.algn === "r" ? bx + bw - pad - tw : bx + pad;
          page.drawText(l.text, { x, y: cy + l.size * 0.22, size: l.size, font: l.font, color: rgb(l.col.r, l.col.g, l.col.b) });
        }
      }
    };
    const tree = deep(doc, "spTree");
    if (tree) await drawTree(tree, { sx: 1, sy: 1, ox: 0, oy: 0 });
  }
  if (!slidePaths.length) throw new Error("Esta presentación no tiene diapositivas.");
  return { blob: pdfBlob(await out.save()), name: `${baseName(file.name)}.pdf` };
}

export async function htmlToPdf(file, { html, paper }, onProgress) {
  const source = file ? await file.text() : html;
  if (!source?.trim()) throw new Error("Sube un archivo .html o pega el código HTML.");
  onProgress?.(0, 0, "Dibujando la página…");
  const frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-same-origin");
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:1024px;height:1400px;border:0;background:#fff";
  document.body.appendChild(frame);
  try {
    await new Promise((resolve) => { frame.onload = resolve; frame.srcdoc = source; });
    await new Promise((r) => setTimeout(r, 500));
    const doc = frame.contentDocument;
    frame.style.height = "50px";
    frame.style.height = `${Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0, 50)}px`;
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(doc.documentElement, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false, windowWidth: 1024 });
    const bytes = await canvasesToPdf([canvas], paper);
    return { blob: pdfBlob(bytes), name: `${file ? baseName(file.name) : "pagina"}.pdf` };
  } finally { frame.remove(); }
}
