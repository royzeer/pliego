// Configuración de las herramientas "simples" (un formulario + archivos).
// Las herramientas con pantalla especial están en src/tools/*.jsx
import * as P from "../lib/pdf";
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
};
