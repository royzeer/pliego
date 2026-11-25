// Configuración de las herramientas "simples" (un formulario + archivos).
// Las herramientas con pantalla especial están en src/tools/*.jsx
import * as P from "../lib/pdf";
import * as E from "../lib/edit";
import * as C from "../lib/convert";
import { FREE_LIMITS } from "../data/tools";

const pagesField = (label = "Páginas", placeholder = "1-3, 5, 8-10") => ({ key: "pages", type: "text", label, placeholder, help: "Separa con comas. Usa guion para rangos." });
const paperField = { key: "paper", type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }, { value: "oficio", label: "Oficio" }] };

export const REGISTRY = {
  "unir-pdf": {
    accept: "pdf", multiple: true, min: 2, sortable: true, action: "Unir PDF",
    run: (files) => P.merge(files),
  },
  "dividir-pdf": {
    accept: "pdf", action: "Dividir PDF",
    defaults: { mode: "rangos", ranges: "" },
    fields: [
      { key: "mode", type: "segment", label: "Cómo dividir", options: [{ value: "rangos", label: "Por rangos" }, { value: "cada", label: "Cada página" }] },
      { key: "ranges", type: "text", label: "Rangos (cada rango será un PDF)", placeholder: "1-3, 4-6, 7", when: (o) => o.mode === "rangos" },
    ],
    run: ([f], o) => P.split(f, o),
  },
  "eliminar-paginas": {
    accept: "pdf", action: "Eliminar páginas", defaults: { pages: "" },
    fields: [pagesField("Páginas que quieres quitar")],
    run: ([f], o) => P.removePages(f, o),
  },
  "extraer-paginas": {
    accept: "pdf", action: "Extraer páginas", defaults: { pages: "", separate: false },
    fields: [pagesField("Páginas que quieres sacar"), { key: "separate", type: "check", label: "Una página por archivo" }],
    run: ([f], o) => P.extractPages(f, o),
  },
  "varias-por-hoja": {
    accept: "pdf", action: "Crear hojas", defaults: { perSheet: 2, paper: "carta" },
    fields: [
      { key: "perSheet", type: "segment", label: "Páginas por hoja", options: [{ value: 2, label: "2" }, { value: 4, label: "4" }] },
      paperField,
    ],
    run: ([f], o) => P.nUp(f, o),
  },
  "comprimir-pdf": {
    accept: "pdf", action: "Comprimir PDF", defaults: { level: "media" }, progress: true,
    fields: [{ key: "level", type: "segment", label: "Calidad", options: [{ value: "baja", label: "Menor peso" }, { value: "media", label: "Equilibrado" }, { value: "alta", label: "Mejor calidad" }] }],
    note: "La compresión convierte cada página en imagen optimizada. Si necesitas copiar el texto después, usa la calidad alta.",
    run: ([f], o, prog) => P.compress(f, o, prog),
  },
  "comprimir-a-peso": {
    accept: "pdf", action: "Comprimir al peso", defaults: { targetMB: "2" }, progress: true,
    fields: [
      { key: "targetMB", type: "segment", label: "Peso máximo", options: [{ value: "0.5", label: "500 KB" }, { value: "1", label: "1 MB" }, { value: "2", label: "2 MB" }, { value: "5", label: "5 MB" }] },
      { key: "targetMB", type: "number", label: "O escribe el máximo en MB", min: 0.1, step: 0.1 },
    ],
    note: "Pliego prueba varias calidades y te entrega la mejor que quede por debajo del peso que elegiste.",
    run: ([f], o, prog) => P.compressToTarget(f, o, prog),
  },
  "reparar-pdf": {
    accept: "pdf", action: "Reparar PDF", progress: true,
    run: ([f], o, prog) => P.repair(f, o, prog),
  },
  "quitar-metadatos": {
    accept: "pdf", action: "Quitar metadatos",
    note: "Borra el autor, el programa con el que se hizo y las fechas guardadas dentro del archivo.",
    run: ([f]) => P.stripMetadata(f),
  },
  "jpg-a-pdf": {
    accept: "image", multiple: true, sortable: true, action: "Crear PDF", defaults: { paper: "carta", margin: true },
    fields: [
      { key: "paper", type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }, { value: "ajustar", label: "Igual a la foto" }] },
      { key: "margin", type: "check", label: "Dejar margen", when: (o) => o.paper !== "ajustar" },
    ],
    run: (files, o) => P.imagesToPdf(files, o),
  },
  "escanear-pdf": {
    accept: "image", multiple: true, sortable: true, capture: true, action: "Crear PDF", defaults: { paper: "carta", margin: false },
    dropTitle: "Toma fotos de tus hojas",
    dropHint: "En el celular se abre la cámara. Puedes agregar varias fotos.",
    fields: [{ key: "paper", type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }, { value: "ajustar", label: "Igual a la foto" }] }],
    run: (files, o) => P.imagesToPdf(files, o),
  },
  "pdf-a-jpg": {
    accept: "pdf", action: "Convertir a imagen", defaults: { format: "jpg", dpi: 150 }, progress: true,
    fields: [
      { key: "format", type: "segment", label: "Formato", options: [{ value: "jpg", label: "JPG" }, { value: "png", label: "PNG" }] },
      { key: "dpi", type: "segment", label: "Calidad", options: [{ value: 96, label: "Normal" }, { value: 150, label: "Alta" }, { value: 300, label: "Impresión" }] },
    ],
    run: ([f], o, prog) => P.pdfToImages(f, o, prog),
  },
  "pdf-a-markdown": {
    accept: "pdf", action: "Convertir a Markdown", progress: true,
    note: `Plan gratis: hasta ${FREE_LIMITS.markdownPages} páginas por archivo, sin límite de usos.`,
    run: ([f], o, prog) => P.toMarkdown(f, { maxPages: FREE_LIMITS.markdownPages }, prog),
  },
  "extraer-texto": {
    accept: "pdf", action: "Extraer texto", progress: true,
    run: ([f], o, prog) => P.extractText(f, o, prog),
  },
  "rotar-pdf": {
    accept: "pdf", action: "Rotar PDF", defaults: { angle: 90, pages: "" },
    fields: [
      { key: "angle", type: "segment", label: "Girar", options: [{ value: 90, label: "90° derecha" }, { value: 180, label: "180°" }, { value: 270, label: "90° izquierda" }] },
      { ...pagesField("Páginas (vacío = todas)"), help: "Déjalo vacío para girar todo el PDF." },
    ],
    run: ([f], o) => P.rotate(f, o),
  },
  "numeros-de-pagina": {
    accept: "pdf", action: "Numerar páginas", defaults: { position: "abajo-centro", start: 1, format: "n" },
    fields: [
      { key: "position", type: "select", label: "Posición", options: [
        { value: "abajo-centro", label: "Abajo al centro" }, { value: "abajo-der", label: "Abajo a la derecha" }, { value: "abajo-izq", label: "Abajo a la izquierda" },
        { value: "arriba-centro", label: "Arriba al centro" }, { value: "arriba-der", label: "Arriba a la derecha" }, { value: "arriba-izq", label: "Arriba a la izquierda" },
      ] },
      { key: "format", type: "segment", label: "Formato", options: [{ value: "n", label: "1, 2, 3" }, { value: "de", label: "1 de 10" }] },
      { key: "start", type: "number", label: "Empezar en", min: 1 },
    ],
    run: ([f], o) => P.pageNumbers(f, o),
  },
  "marca-de-agua": {
    accept: "pdf", action: "Poner marca de agua", defaults: { text: "COPIA", opacity: 0.2, size: 60 },
    fields: [
      { key: "text", type: "text", label: "Texto", placeholder: "SOLO PARA TRÁMITE" },
      { key: "opacity", type: "range", label: "Transparencia", min: 0.05, max: 0.8, step: 0.05, format: (v) => `${Math.round(v * 100)}%` },
      { key: "size", type: "range", label: "Tamaño", min: 20, max: 120, step: 2 },
    ],
    note: "Consejo: en copias de tu cédula pon para qué es (por ejemplo, SOLO PARA TRÁMITE EN BANCO).",
    run: ([f], o) => P.watermark(f, o),
  },
  "recortar-pdf": {
    accept: "pdf", action: "Recortar PDF", defaults: { top: 10, right: 10, bottom: 10, left: 10 },
    fields: [
      { key: "top", type: "number", label: "Arriba (mm)", min: 0 },
      { key: "bottom", type: "number", label: "Abajo (mm)", min: 0 },
      { key: "left", type: "number", label: "Izquierda (mm)", min: 0 },
      { key: "right", type: "number", label: "Derecha (mm)", min: 0 },
    ],
    run: ([f], o) => P.crop(f, { top: Number(o.top), right: Number(o.right), bottom: Number(o.bottom), left: Number(o.left) }),
  },
  "proteger-pdf": {
    accept: "pdf", action: "Proteger PDF", defaults: { password: "" },
    fields: [{ key: "password", type: "password", label: "Contraseña", placeholder: "Mínimo 4 caracteres", help: "Guárdala bien: si la olvidas no se puede recuperar." }],
    run: ([f], o) => P.protect(f, o),
  },
  "desbloquear-pdf": {
    accept: "pdf", action: "Desbloquear PDF", defaults: { password: "" },
    fields: [{ key: "password", type: "password", label: "Contraseña actual del PDF" }],
    note: "Solo desbloquea PDF de los que conoces la contraseña.",
    run: ([f], o) => P.unlock(f, o),
  },
  "encabezado-pie": {
    accept: "pdf", action: "Agregar encabezado y pie", defaults: { header: "", footer: "Página {n} de {total}", align: "centro", size: 10 },
    fields: [
      { key: "header", type: "text", label: "Encabezado (arriba)", placeholder: "Universidad del Magdalena · Informe final" },
      { key: "footer", type: "text", label: "Pie de página (abajo)", placeholder: "Página {n} de {total}" },
      { key: "align", type: "segment", label: "Alineación", options: [{ value: "izq", label: "Izquierda" }, { value: "centro", label: "Centro" }, { value: "der", label: "Derecha" }] },
      { key: "size", type: "range", label: "Tamaño de letra", min: 7, max: 16, step: 1 },
    ],
    note: "Puedes usar {n} para el número de página, {total} para el total y {fecha} para la fecha de hoy.",
    run: ([f], o) => E.headerFooter(f, o),
  },
  "ocr-pdf": {
    accept: "pdf", action: "Hacer OCR", defaults: { lang: "spa", output: "pdf" }, progress: true,
    fields: [
      { key: "lang", type: "segment", label: "Idioma del documento", options: [{ value: "spa", label: "Español" }, { value: "eng", label: "Inglés" }, { value: "spa+eng", label: "Ambos" }] },
      { key: "output", type: "segment", label: "Resultado", options: [{ value: "pdf", label: "PDF buscable" }, { value: "txt", label: "Solo texto (.txt)" }] },
    ],
    note: `Lee el texto de documentos escaneados o fotos. Plan gratis: hasta ${FREE_LIMITS.ocrPages} páginas por archivo, sin límite de usos. La primera vez descarga el lector de idioma (unos segundos).`,
    run: ([f], o, prog) => E.ocr(f, { ...o, maxPages: FREE_LIMITS.ocrPages }, prog),
  },
  "pdf-a-word": {
    accept: "pdf", action: "Convertir a Word", defaults: { mode: "texto" }, progress: true,
    fields: [{ key: "mode", type: "segment", label: "Tipo de Word", options: [{ value: "texto", label: "Editable" }, { value: "imagen", label: "Igual al original" }] }],
    note: `Editable: saca el texto con títulos y párrafos para que lo cambies. Igual al original: cada página como imagen exacta. Plan gratis: hasta ${FREE_LIMITS.convertPages} páginas por archivo.`,
    run: ([f], o, prog) => C.pdfToWord(f, { ...o, maxPages: FREE_LIMITS.convertPages }, prog),
  },
  "pdf-a-powerpoint": {
    accept: "pdf", action: "Convertir a PowerPoint", progress: true,
    note: `Cada página queda como una diapositiva. Plan gratis: hasta ${FREE_LIMITS.convertPages} páginas por archivo.`,
    run: ([f], o, prog) => C.pdfToPowerPoint(f, { maxPages: FREE_LIMITS.convertPages }, prog),
  },
  "pdf-a-excel": {
    accept: "pdf", action: "Convertir a Excel", progress: true,
    note: `Saca el texto y las tablas a una hoja por página, y convierte los números para que puedas sumar. Funciona mejor con tablas sencillas. Plan gratis: hasta ${FREE_LIMITS.convertPages} páginas.`,
    run: ([f], o, prog) => C.pdfToExcel(f, { maxPages: FREE_LIMITS.convertPages }, prog),
  },
  "pdf-a-pdfa": {
    accept: "pdf", action: "Convertir a PDF/A", defaults: { level: 2 }, progress: true,
    fields: [{ key: "level", type: "segment", label: "Versión", options: [{ value: 2, label: "PDF/A-2b (recomendado)" }, { value: 1, label: "PDF/A-1b" }] }],
    note: "PDF/A es el formato que piden algunas entidades y repositorios para guardar documentos a largo plazo. La primera vez se descarga el convertidor (unos 15 MB).",
    run: ([f], o, prog) => C.pdfToPdfA(f, o, prog),
  },
  "word-a-pdf": {
    accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document", action: "Convertir a PDF", defaults: { paper: "carta" }, progress: true,
    dropTitle: "Suelta tu documento de Word", dropHint: "Archivos .docx",
    fields: [{ key: "paper", type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }] }],
    note: "El PDF se ve igual a tu documento, pero sus páginas se guardan como imagen (el texto no se puede seleccionar). Para .doc antiguos, ábrelos en Word y guárdalos como .docx.",
    run: ([f], o, prog) => C.wordToPdf(f, o, prog),
  },
  "excel-a-pdf": {
    accept: ".xlsx,.xls,.csv,.ods", action: "Convertir a PDF", defaults: { paper: "carta", orientation: "horizontal" }, progress: true,
    dropTitle: "Suelta tu archivo de Excel", dropHint: "Archivos .xlsx, .xls o .csv",
    fields: [
      { key: "paper", type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }] },
      { key: "orientation", type: "segment", label: "Orientación", options: [{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }] },
    ],
    note: "Cada hoja del libro sale en el PDF con su nombre como título.",
    run: ([f], o, prog) => C.excelToPdf(f, o, prog),
  },
  "powerpoint-a-pdf": {
    accept: ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation", action: "Convertir a PDF", progress: true,
    dropTitle: "Suelta tu presentación", dropHint: "Archivos .pptx",
    note: "Cada diapositiva queda como una página con sus textos, imágenes y colores. Las animaciones, videos y efectos especiales no pasan al PDF.",
    run: ([f], o, prog) => C.powerpointToPdf(f, o, prog),
  },
  "html-a-pdf": {
    accept: ".html,.htm,text/html", min: 0, action: "Convertir a PDF", defaults: { html: "", paper: "carta" }, progress: true,
    dropTitle: "Suelta un archivo HTML", dropHint: "o pega el código en el panel",
    fields: [
      { key: "html", type: "area", label: "O pega aquí el código HTML", placeholder: "<h1>Hola</h1><p>Mi documento</p>" },
      { key: "paper", type: "segment", label: "Tamaño de hoja", options: [{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }] },
    ],
    note: "Para guardar una página web que estás viendo, también puedes usar Imprimir en tu navegador y elegir Guardar como PDF.",
    run: (files, o, prog) => C.htmlToPdf(files[0], o, prog),
  },
};
