// Formatos del convertidor universal y qué conversiones existen entre ellos.
// Se usa en la app y al generar las páginas para Google.

export const FORMATS = {
  pdf: { name: "PDF", exts: [".pdf"], icon: "IconFileTypePdf", hint: "PDF" },
  word: { name: "Word", exts: [".docx"], icon: "IconFileTypeDocx", hint: "Word (.docx)" },
  excel: { name: "Excel", exts: [".xlsx", ".xls", ".ods"], icon: "IconFileTypeXls", hint: "Excel (.xlsx, .xls)" },
  csv: { name: "CSV", exts: [".csv"], icon: "IconFileText", hint: "CSV" },
  powerpoint: { name: "PowerPoint", exts: [".pptx"], icon: "IconFileTypePpt", hint: "PowerPoint (.pptx)" },
  imagen: { name: "Imagen", exts: [".jpg", ".jpeg", ".png", ".webp"], icon: "IconPhoto", hint: "JPG, PNG o WEBP" },
  html: { name: "HTML", exts: [".html", ".htm"], icon: "IconWorldWww", hint: "HTML" },
  markdown: { name: "Markdown", exts: [".md", ".markdown"], icon: "IconMarkdown", hint: "Markdown (.md)" },
  texto: { name: "Texto", exts: [".txt"], icon: "IconFileText", hint: "Texto (.txt)" },
};

export const FORMAT_IDS = Object.keys(FORMATS);

// A qué formatos se puede convertir cada uno
export const TARGETS = {
  pdf: ["word", "excel", "powerpoint", "imagen", "html", "markdown", "texto", "csv"],
  word: ["pdf", "html", "markdown", "texto", "imagen", "excel", "csv"],
  excel: ["pdf", "csv", "html", "markdown", "texto", "word", "imagen"],
  csv: ["excel", "pdf", "html", "markdown", "texto", "word"],
  powerpoint: ["pdf", "imagen", "texto", "markdown", "html", "word"],
  imagen: ["pdf", "texto", "word", "markdown"],
  html: ["pdf", "markdown", "texto", "word", "imagen", "excel", "csv"],
  markdown: ["html", "pdf", "word", "texto", "excel", "csv"],
  texto: ["pdf", "word", "html", "markdown", "excel", "csv"],
};

export const canConvert = (from, to) => !!TARGETS[from]?.includes(to);

// Conversiones que ya tienen su propia herramienta con más opciones
export const DEDICATED = {
  "pdf-word": "pdf-a-word",
  "pdf-excel": "pdf-a-excel",
  "pdf-powerpoint": "pdf-a-powerpoint",
  "pdf-imagen": "pdf-a-jpg",
  "pdf-markdown": "pdf-a-markdown",
  "pdf-texto": "extraer-texto",
  "word-pdf": "word-a-pdf",
  "excel-pdf": "excel-a-pdf",
  "csv-pdf": "excel-a-pdf",
  "powerpoint-pdf": "powerpoint-a-pdf",
  "imagen-pdf": "jpg-a-pdf",
  "html-pdf": "html-a-pdf",
};

// Al revés: herramienta -> par de formatos (para mostrar la barra De / A en esas herramientas)
export const TOOL_PAIR = Object.fromEntries(
  Object.entries(DEDICATED).filter(([k]) => k !== "csv-pdf").map(([pair, tool]) => [tool, pair.split("-")]),
);

export const pairSlug = (from, to) => `${from}-a-${to}`;
export function parsePairSlug(slug) {
  const [from, to] = String(slug || "").split("-a-");
  return canConvert(from, to) ? [from, to] : null;
}

/** Ruta de la página que convierte de un formato a otro. */
export function pairPath(from, to) {
  const tool = DEDICATED[`${from}-${to}`];
  return tool ? `/herramientas/${tool}` : `/convertir/${pairSlug(from, to)}`;
}

/** Si el destino no se puede desde ese origen, elige el primero que sí. */
export function fixTarget(from, to) {
  return canConvert(from, to) ? to : TARGETS[from][0];
}

/** Todas las combinaciones que tienen página propia en /convertir. */
export const UNIVERSAL_PAIRS = FORMAT_IDS.flatMap((from) => TARGETS[from].filter((to) => !DEDICATED[`${from}-${to}`]).map((to) => [from, to]));

// Textos cortos para explicar cada destino
export const TARGET_NOTES = {
  word: "Obtienes un documento de Word (.docx) con títulos, párrafos, listas y tablas.",
  excel: "Pliego busca las tablas del documento y las pasa a una hoja de cálculo.",
  csv: "Obtienes un archivo CSV que abre Excel, Google Sheets o cualquier programa de datos.",
  powerpoint: "Cada página queda como una diapositiva de PowerPoint (.pptx).",
  imagen: "Cada página queda como una imagen JPG o PNG.",
  html: "Obtienes una página HTML limpia, lista para publicar o pegar en tu web.",
  markdown: "Obtienes texto Markdown con títulos, listas y tablas, ideal para notas, GitHub o IA.",
  texto: "Obtienes un archivo .txt solo con el texto.",
  pdf: "Obtienes un PDF listo para enviar o imprimir.",
};

// Textos de cada página /convertir/x-a-y (para la app y para Google)
const NOTES_FROM = {
  pdf: "Funciona con PDF que tienen texto; si tu PDF es escaneado, primero pásalo por OCR PDF.",
  word: "Acepta documentos de Word en formato .docx (Word 2007 o más reciente).",
  excel: "Si el libro tiene varias hojas, Pliego convierte todas.",
  csv: "Pliego detecta las columnas del CSV automáticamente.",
  powerpoint: "Acepta presentaciones .pptx; las animaciones no se convierten.",
  imagen: "Pliego lee el texto de la imagen con OCR, en español e inglés. Usa fotos nítidas de texto impreso.",
  html: "Por seguridad, Pliego no ejecuta los scripts del archivo HTML.",
  markdown: "Entiende Markdown con títulos, listas, negrillas, enlaces, código y tablas.",
  texto: "Cada párrafo del archivo de texto se conserva.",
};

export function pairCopy(from, to) {
  const A = FORMATS[from].name;
  const B = FORMATS[to].name;
  return {
    title: `Convertir ${A} a ${B} gratis y sin límite`,
    description: `Convierte ${A} a ${B} gratis, sin registro y sin límite de usos. El archivo se procesa en tu dispositivo y no se sube a internet.`,
    intro: `Sube tu archivo ${A} y descárgalo como ${B} en segundos. ${TARGET_NOTES[to]} ${NOTES_FROM[from]}`,
    steps: [
      `Sube tu archivo ${FORMATS[from].hint}.`,
      to === "imagen" ? "Elige si quieres las imágenes en JPG o en PNG." : `Revisa que arriba diga De ${A} a ${B}. Con el botón del medio puedes voltear la conversión.`,
      `Haz clic en Convertir a ${B} y descarga el resultado.`,
    ],
    faqs: [
      [`¿Es gratis convertir ${A} a ${B}?`, "Sí. Puedes convertir las veces que quieras, sin registrarte y sin marcas de agua."],
      ["¿Mi archivo se sube a internet?", "No. La conversión se hace dentro de tu navegador; el archivo nunca sale de tu dispositivo."],
      [`¿Puedo convertir de ${B} a ${A}?`, canConvert(to, from) ? `Sí. Usa el botón de voltear que está entre los dos formatos y la página cambia a ${B} a ${A}.` : `Por ahora no convertimos de ${B} a ${A}, pero puedes elegir otro formato de destino en la barra de arriba.`],
    ],
  };
}
