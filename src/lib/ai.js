// Herramientas de IA: el texto se saca del PDF en el navegador y solo el texto
// (nunca el archivo) se envía a la IA de Cloudflare para procesarlo.
import { readBytes, baseName } from "./files";
import { openPdf, closePdf } from "./render";

const CHUNK = 12000;

async function callAI(payload) {
  let res;
  try {
    res = await fetch("/api/ia", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
  } catch {
    throw new Error("No hay conexión a internet. Las herramientas de IA necesitan internet.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.text) throw new Error(data.error || "La IA no pudo responder ahora. Intenta de nuevo.");
  return data.text;
}

/** Saca el texto de cada página. */
export async function readPdfText(file, maxPages) {
  const doc = await openPdf(await readBytes(file));
  if (doc.numPages > maxPages) {
    await closePdf(doc);
    throw new Error(`El plan gratis usa IA con hasta ${maxPages} páginas por archivo y este tiene ${doc.numPages}. Divide el PDF primero.`);
  }
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    pages.push(c.items.map((it) => it.str + (it.hasEOL ? "\n" : " ")).join("").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim());
  }
  await closePdf(doc);
  if (!pages.join("").trim()) throw new Error("Este PDF no tiene texto (parece escaneado). Pásalo primero por OCR.");
  return pages;
}

const chunks = (text, size = CHUNK) => {
  const out = [];
  let cur = "";
  for (const para of text.split(/\n{2,}|\n/)) {
    if ((cur + "\n" + para).length > size && cur) { out.push(cur); cur = para; } else cur = cur ? `${cur}\n${para}` : para;
    while (cur.length > size) { out.push(cur.slice(0, size)); cur = cur.slice(size); }
  }
  if (cur.trim()) out.push(cur);
  return out;
};

export async function summarize(file, { maxPages }, onProgress) {
  const pages = await readPdfText(file, maxPages);
  const text = pages.map((p, i) => `[Página ${i + 1}]\n${p}`).join("\n\n");
  const parts = chunks(text);
  let summary;
  if (parts.length === 1) {
    onProgress?.(0, 0, "La IA está leyendo el documento…");
    summary = await callAI({ task: "resumir", text: parts[0] });
  } else {
    const partial = [];
    for (let i = 0; i < parts.length; i++) {
      onProgress?.(i + 1, parts.length, `Leyendo parte ${i + 1} de ${parts.length}…`);
      partial.push(await callAI({ task: "resumir", text: parts[i] }));
    }
    onProgress?.(0, 0, "Uniendo el resumen…");
    summary = await callAI({ task: "resumir-partes", text: partial.join("\n\n---\n\n") });
  }
  return { text: summary, name: `${baseName(file.name)}_resumen` };
}

export async function translate(file, { lang, maxPages }, onProgress) {
  const pages = await readPdfText(file, maxPages);
  const out = [];
  let total = 0;
  const all = pages.map((p) => chunks(p, 3500));
  const count = all.reduce((a, c) => a + c.length, 0);
  for (let i = 0; i < pages.length; i++) {
    const translated = [];
    for (const part of all[i]) {
      total++;
      onProgress?.(total, count, `Traduciendo parte ${total} de ${count}…`);
      translated.push(await callAI({ task: "traducir", text: part, lang }));
    }
    out.push(translated.join("\n"));
  }
  return { pages: out, name: `${baseName(file.name)}_${lang}` };
}

/** Busca las partes del documento que más se parecen a la pregunta. */
export function relevantContext(pages, question, max = 9000) {
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const words = norm(question).split(/\W+/).filter((w) => w.length > 3);
  const pieces = [];
  pages.forEach((p, i) => chunks(p, 1500).forEach((c) => pieces.push({ page: i + 1, text: c })));
  const scored = pieces.map((x, k) => {
    const t = norm(x.text);
    const score = words.reduce((a, w) => a + (t.split(w).length - 1), 0) + (k === 0 ? 0.5 : 0);
    return { ...x, score, k };
  }).sort((a, b) => b.score - a.score);
  const chosen = [];
  let len = 0;
  for (const x of scored) {
    if (len + x.text.length > max) continue;
    chosen.push(x); len += x.text.length;
  }
  return chosen.sort((a, b) => a.k - b.k).map((x) => `[Página ${x.page}]\n${x.text}`).join("\n\n");
}

export const ask = (pages, question, history) => callAI({ task: "preguntar", text: relevantContext(pages, question), question, history });

export async function toDocx(title, paragraphs) {
  const docx = await import("docx");
  const children = [new docx.Paragraph({ heading: docx.HeadingLevel.HEADING_1, children: [new docx.TextRun(title)] })];
  paragraphs.forEach((p, i) => {
    if (i > 0) children.push(new docx.Paragraph({ children: [], pageBreakBefore: true }));
    p.split("\n").forEach((line) => children.push(new docx.Paragraph({ children: [new docx.TextRun(line)] })));
  });
  return docx.Packer.toBlob(new docx.Document({ sections: [{ children }] }));
}
