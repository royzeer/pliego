// Convertidor universal: de cualquier formato a cualquier otro.
// Usa representaciones intermedias (HTML, texto, tablas o PDF) y reutiliza los convertidores
// que ya existen. Todo corre en el navegador.
import { FORMATS, canConvert } from "../data/formats";
import { baseName, zipBlob } from "./files";
import { getLimits } from "./pro";
import * as P from "./pdf";
import * as C from "./convert";
import * as E from "./edit";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const textBlob = (s, type = "text/plain") => new Blob([s], { type: `${type};charset=utf-8` });
const asFile = (blob, name, type) => new File([blob], name, { type: type || blob.type });
const stripPageMarks = (s) => s.replace(/^--- Página \d+ ---\n?/gm, "").trim();

/** Revisa que el archivo coincida con el formato elegido. */
export function checkFile(file, from) {
  const name = file.name.toLowerCase();
  if (!FORMATS[from].exts.some((e) => name.endsWith(e))) {
    throw new Error(`Este archivo no parece ${FORMATS[from].name}. Sube un archivo ${FORMATS[from].hint} o cambia el formato de origen.`);
  }
}

// ------------------------------------------------------------ lectores
async function mammoth() {
  const m = await import("mammoth");
  return m.default || m;
}

async function pptxSlides(file) {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  if (!names.length) throw new Error("Esta presentación no tiene diapositivas.");
  const slides = [];
  for (const n of names) {
    const xml = new DOMParser().parseFromString(await zip.file(n).async("string"), "application/xml");
    const paras = [...xml.getElementsByTagName("a:p")]
      .map((p) => [...p.getElementsByTagName("a:t")].map((t) => t.textContent).join(""))
      .filter((t) => t.trim());
    slides.push(paras);
  }
  return slides;
}

async function ocrImage(file, onProgress) {
  const { blob } = await P.imagesToPdf([file], { paper: "ajustar", margin: false });
  const res = await E.ocr(asFile(blob, "imagen.pdf", "application/pdf"), { lang: "spa+eng", maxPages: getLimits().ocrPages, output: "txt" }, onProgress);
  return stripPageMarks(await res.blob.text());
}

async function workbook(file, from, onProgress) {
  const XLSX = await import("xlsx");
  // El CSV se lee como texto UTF-8 para que las tildes y la ñ salgan bien
  if (from === "csv") return XLSX.read((await file.text()).replace(/^\ufeff/, ""), { type: "string", cellDates: true });
  if (from === "excel") return XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
  if (from === "pdf") {
    const res = await C.pdfToExcel(file, { maxPages: getLimits().convertPages }, onProgress);
    return XLSX.read(await res.blob.arrayBuffer(), { type: "array" });
  }
  if (from === "texto") {
    const lines = (await file.text()).split(/\r?\n/).filter((l) => l.trim());
    const sep = lines.some((l) => l.includes("\t")) ? "\t" : lines.some((l) => l.includes(";")) ? ";" : ",";
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(lines.map((l) => l.split(sep))), "Hoja1");
    return wb;
  }
  // Word, HTML o Markdown: se toman las tablas del documento
  const box = document.createElement("div");
  box.innerHTML = await htmlBody(file, from, onProgress);
  const tables = [...box.querySelectorAll("table")];
  if (!tables.length) throw new Error("No encontramos tablas en este documento. Para pasarlo a Excel o CSV, el documento debe tener al menos una tabla.");
  const wb = XLSX.utils.book_new();
  tables.forEach((t, i) => XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(t), `Tabla ${i + 1}`));
  return wb;
}

/** Contenido HTML (solo el cuerpo) de cualquier formato. */
async function htmlBody(file, from, onProgress) {
  if (from === "html") {
    const doc = new DOMParser().parseFromString(await file.text(), "text/html");
    doc.querySelectorAll("script, style, link, meta, iframe, object, embed").forEach((n) => n.remove());
    return doc.body.innerHTML;
  }
  if (from === "markdown") {
    const { marked } = await import("marked");
    return marked.parse(await file.text(), { gfm: true });
  }
  if (from === "word") {
    onProgress?.(0, 0, "Leyendo el documento de Word…");
    const m = await mammoth();
    return (await m.convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value;
  }
  if (from === "excel" || from === "csv") {
    const XLSX = await import("xlsx");
    const wb = await workbook(file, from);
    return wb.SheetNames.map((n) => {
      const table = XLSX.utils.sheet_to_html(wb.Sheets[n], { header: "", footer: "" }).match(/<table[\s\S]*<\/table>/i)?.[0] || "";
      return `${wb.SheetNames.length > 1 ? `<h2>${esc(n)}</h2>` : ""}${table}`;
    }).join("\n");
  }
  if (from === "pdf") {
    const { marked } = await import("marked");
    return marked.parse(await markdown(file, from, onProgress), { gfm: true });
  }
  if (from === "powerpoint") {
    const slides = await pptxSlides(file);
    return slides.map((ps, i) => `<h2>Diapositiva ${i + 1}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("\n");
  }
  // texto o imagen
  const text = from === "imagen" ? await ocrImage(file, onProgress) : await file.text();
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("\n");
}

function mdTable(rows) {
  const clean = rows.filter((r) => r.some((c) => String(c ?? "").trim()));
  if (!clean.length) return "";
  const w = Math.max(...clean.map((r) => r.length));
  const cell = (c) => String(c ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
  const line = (r) => `| ${Array.from({ length: w }, (_, i) => cell(r[i])).join(" | ")} |`;
  return [line(clean[0]), `| ${Array(w).fill("---").join(" | ")} |`, ...clean.slice(1).map(line)].join("\n");
}

async function turndown() {
  const { default: TurndownService } = await import("turndown");
  const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
  td.addRule("tablas", {
    filter: "table",
    replacement: (_c, node) => `\n\n${mdTable([...node.querySelectorAll("tr")].map((tr) => [...tr.children].map((td2) => td2.textContent)))}\n\n`,
  });
  td.remove(["script", "style"]);
  return td;
}

/** Texto Markdown de cualquier formato. */
async function markdown(file, from, onProgress) {
  if (from === "markdown") return file.text();
  if (from === "pdf") {
    const res = await P.toMarkdown(file, { maxPages: getLimits().markdownPages }, onProgress);
    return res.blob.text();
  }
  if (from === "excel" || from === "csv") {
    const XLSX = await import("xlsx");
    const wb = await workbook(file, from);
    return wb.SheetNames.map((n) => {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: false });
      return `${wb.SheetNames.length > 1 ? `## ${n}\n\n` : ""}${mdTable(rows)}`;
    }).join("\n\n");
  }
  if (from === "texto") return file.text();
  const td = await turndown();
  return td.turndown(await htmlBody(file, from, onProgress));
}

/** Texto plano de cualquier formato. */
async function plainText(file, from, onProgress) {
  if (from === "texto") return file.text();
  if (from === "pdf") return (await P.extractText(file, {}, onProgress)).blob.text();
  if (from === "word") return (await (await mammoth()).extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  if (from === "imagen") return ocrImage(file, onProgress);
  if (from === "powerpoint") return (await pptxSlides(file)).map((ps, i) => `Diapositiva ${i + 1}\n${ps.join("\n")}`).join("\n\n");
  if (from === "excel" || from === "csv") {
    const XLSX = await import("xlsx");
    const wb = await workbook(file, from);
    return wb.SheetNames.map((n) => `${wb.SheetNames.length > 1 ? `${n}\n` : ""}${XLSX.utils.sheet_to_csv(wb.Sheets[n], { FS: "\t" })}`).join("\n\n");
  }
  // HTML o Markdown: el texto visible, con saltos de línea
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;white-space:normal";
  box.innerHTML = await htmlBody(file, from, onProgress);
  document.body.appendChild(box);
  try { return box.innerText.replace(/\n{3,}/g, "\n\n").trim(); } finally { box.remove(); }
}

const DOC_CSS = `body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:820px;margin:32px auto;padding:0 24px;line-height:1.6;font-size:15px}
h1,h2,h3{line-height:1.25}table{border-collapse:collapse;margin:12px 0;width:100%}td,th{border:1px solid #bbb;padding:6px 8px;text-align:left;vertical-align:top}
th{background:#f2f2f2}pre,code{font-family:Consolas,monospace;background:#f5f5f5}pre{padding:12px;overflow:auto;white-space:pre-wrap}img{max-width:100%}blockquote{border-left:3px solid #ccc;margin:0;padding-left:12px;color:#444}`;

const fullHtml = (title, body) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${DOC_CSS}</style>
</head>
<body>
${body}
</body>
</html>
`;

/** PDF de cualquier formato. */
async function toPdf(file, from, onProgress) {
  if (from === "pdf") return file;
  let res;
  if (from === "word") res = await C.wordToPdf(file, { paper: "carta" }, onProgress);
  else if (from === "excel" || from === "csv") res = await C.excelToPdf(file, { paper: "carta", orientation: "horizontal" }, onProgress);
  else if (from === "powerpoint") res = await C.powerpointToPdf(file, {}, onProgress);
  else if (from === "imagen") res = await P.imagesToPdf([file], { paper: "carta", margin: true });
  else if (from === "html") res = await C.htmlToPdf(file, { paper: "carta" }, onProgress);
  else res = await C.htmlToPdf(null, { html: fullHtml(baseName(file.name), await htmlBody(file, from, onProgress)), paper: "carta" }, onProgress);
  return asFile(res.blob, `${baseName(file.name)}.pdf`, "application/pdf");
}

/** Word (.docx) a partir de HTML: títulos, párrafos, listas, tablas, negrillas y cursivas. */
async function htmlToDocx(html, title) {
  const d = await import("docx");
  const box = document.createElement("div");
  box.innerHTML = html;
  const HEAD = { H1: d.HeadingLevel.HEADING_1, H2: d.HeadingLevel.HEADING_2, H3: d.HeadingLevel.HEADING_3, H4: d.HeadingLevel.HEADING_4, H5: d.HeadingLevel.HEADING_5, H6: d.HeadingLevel.HEADING_6 };

  const runs = (node, style = {}) => {
    const out = [];
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s+/g, " ");
        if (t) out.push(new d.TextRun({ text: t, ...style }));
      } else if (n.nodeType === 1) {
        if (n.tagName === "BR") out.push(new d.TextRun({ text: "", break: 1 }));
        else {
          const s = { ...style };
          if (/^(STRONG|B)$/.test(n.tagName)) s.bold = true;
          if (/^(EM|I)$/.test(n.tagName)) s.italics = true;
          if (n.tagName === "CODE") s.font = "Consolas";
          if (n.tagName === "U") s.underline = {};
          out.push(...runs(n, s));
        }
      }
    });
    return out;
  };

  const blocks = [];
  const walk = (node, listLevel = -1) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        if (n.textContent.trim()) blocks.push(new d.Paragraph({ children: [new d.TextRun(n.textContent.trim())] }));
        return;
      }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (HEAD[tag]) blocks.push(new d.Paragraph({ heading: HEAD[tag], children: runs(n) }));
      else if (tag === "P") blocks.push(new d.Paragraph({ children: runs(n), spacing: { after: 120 } }));
      else if (tag === "UL" || tag === "OL") walk(n, listLevel + 1);
      else if (tag === "LI") {
        const inline = document.createElement("span");
        [...n.childNodes].filter((c) => !(c.nodeType === 1 && /^(UL|OL)$/.test(c.tagName))).forEach((c) => inline.appendChild(c.cloneNode(true)));
        const ordered = n.parentElement?.tagName === "OL";
        blocks.push(new d.Paragraph({ children: ordered ? [new d.TextRun(`${[...n.parentElement.children].indexOf(n) + 1}. `), ...runs(inline)] : runs(inline), bullet: ordered ? undefined : { level: Math.max(0, listLevel) }, indent: ordered ? { left: 360 * (listLevel + 1) } : undefined }));
        [...n.children].filter((c) => /^(UL|OL)$/.test(c.tagName)).forEach((c) => walk(c, listLevel + 1));
      } else if (tag === "TABLE") {
        const rows = [...n.querySelectorAll("tr")].map((tr) => new d.TableRow({
          children: [...tr.children].map((c) => new d.TableCell({ children: [new d.Paragraph({ children: runs(c, c.tagName === "TH" ? { bold: true } : {}) })] })),
        })).filter((r) => r);
        if (rows.length) blocks.push(new d.Table({ rows, width: { size: 100, type: d.WidthType.PERCENTAGE } }), new d.Paragraph(""));
      } else if (tag === "PRE") {
        n.textContent.split("\n").forEach((l) => blocks.push(new d.Paragraph({ children: [new d.TextRun({ text: l, font: "Consolas", size: 20 })] })));
      } else if (tag === "BLOCKQUOTE") {
        blocks.push(new d.Paragraph({ children: runs(n, { italics: true }), indent: { left: 480 } }));
      } else if (tag === "HR") {
        blocks.push(new d.Paragraph(""));
      } else if (/^(DIV|SECTION|ARTICLE|MAIN|HEADER|FOOTER|BODY|TBODY|SPAN|A)$/.test(tag)) {
        walk(n, listLevel);
      } else if (tag !== "IMG" && n.textContent.trim()) {
        blocks.push(new d.Paragraph({ children: runs(n) }));
      }
    });
  };
  walk(box);
  if (!blocks.length) throw new Error("Este documento no tiene texto para pasar a Word.");
  const doc = new d.Document({ creator: "Pliego", title, sections: [{ children: blocks }] });
  return d.Packer.toBlob(doc);
}

// ------------------------------------------------------------ conversión principal
/**
 * Convierte un archivo de un formato a otro.
 * opts.imageFormat: "jpg" o "png" cuando el destino es imagen.
 */
export async function convertAny(file, from, to, opts = {}, onProgress) {
  if (!canConvert(from, to)) throw new Error(`Por ahora no convertimos de ${FORMATS[from].name} a ${FORMATS[to].name}.`);
  checkFile(file, from);
  const name = baseName(file.name);

  if (to === "pdf") return { blob: await toPdf(file, from, onProgress), name: `${name}.pdf` };

  if (to === "word") {
    if (from === "pdf") return C.pdfToWord(file, { mode: "texto", maxPages: getLimits().convertPages }, onProgress);
    const html = await htmlBody(file, from, onProgress);
    return { blob: await htmlToDocx(html, name), name: `${name}.docx` };
  }

  if (to === "excel" || to === "csv") {
    if (to === "excel" && from === "pdf") return C.pdfToExcel(file, { maxPages: getLimits().convertPages }, onProgress);
    const XLSX = await import("xlsx");
    const wb = await workbook(file, from, onProgress);
    if (to === "excel") {
      const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      return { blob: new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), name: `${name}.xlsx` };
    }
    const csvs = wb.SheetNames.map((n) => ({ name: `${wb.SheetNames.length > 1 ? `${name}_${n}` : name}.csv`, data: textBlob("\ufeff" + XLSX.utils.sheet_to_csv(wb.Sheets[n]), "text/csv") }));
    if (csvs.length === 1) return { blob: csvs[0].data, name: csvs[0].name };
    return { blob: await zipBlob(csvs), name: `${name}_csv.zip`, note: `Tu archivo tiene ${csvs.length} hojas: cada una quedó en su propio CSV dentro del ZIP.` };
  }

  if (to === "powerpoint") {
    const pdf = await toPdf(file, from, onProgress);
    const res = await C.pdfToPowerPoint(pdf, { maxPages: getLimits().convertPages }, onProgress);
    return { ...res, name: `${name}.pptx` };
  }

  if (to === "imagen") {
    const pdf = await toPdf(file, from, onProgress);
    return P.pdfToImages(pdf, { format: opts.imageFormat || "jpg", dpi: 150 }, onProgress);
  }

  if (to === "html") {
    const body = await htmlBody(file, from, onProgress);
    return { blob: textBlob(fullHtml(name, body), "text/html"), name: `${name}.html` };
  }

  if (to === "markdown") return { blob: textBlob(await markdown(file, from, onProgress), "text/markdown"), name: `${name}.md` };

  if (to === "texto") return { blob: textBlob(await plainText(file, from, onProgress)), name: `${name}.txt` };

  throw new Error("Conversión no disponible.");
}
