// Catálogo de herramientas de Pliego.
// status: "listo" = funciona hoy en el navegador; "pronto" = planeada.
// engine: "navegador" (gratis, privado), "servidor" o "ia" (tienen costo, límite por archivo).

export const CATEGORIES = [
  { id: "todas", name: "Todas" },
  { id: "tramites", name: "Trámites" },
  { id: "organizar", name: "Organizar" },
  { id: "optimizar", name: "Optimizar" },
  { id: "convertir-a", name: "Convertir a PDF" },
  { id: "convertir-desde", name: "Convertir desde PDF" },
  { id: "editar", name: "Editar" },
  { id: "seguridad", name: "Seguridad" },
  { id: "ia", name: "Inteligencia" },
];

export const TOOLS = [
  // ---------- Trámites (exclusivas de Pliego) ----------
  { id: "cedula-ambas-caras", name: "Cédula ambas caras", desc: "Las dos caras en una hoja, a tamaño real.", cat: "tramites", icon: "IconId", status: "listo", engine: "navegador", exclusive: true },
  { id: "comprimir-a-peso", name: "Comprimir a peso exacto", desc: "Dile el máximo (1 MB, 2 MB…) y Pliego lo logra.", cat: "tramites", icon: "IconTargetArrow", status: "listo", engine: "navegador", exclusive: true },
  { id: "paquete-documentos", name: "Paquete de documentos", desc: "Hoja de vida, cédula y certificados en un solo PDF.", cat: "tramites", icon: "IconBriefcase", status: "listo", engine: "navegador", exclusive: true },
  { id: "revisor", name: "Revisor antes de subir", desc: "Detecta peso, contraseña, páginas giradas o en blanco.", cat: "tramites", icon: "IconChecklist", status: "listo", engine: "navegador", exclusive: true },
  { id: "cuenta-de-cobro", name: "Cuenta de cobro", desc: "Llena el formulario y descarga el PDF.", cat: "tramites", icon: "IconReceipt", status: "pronto", engine: "navegador", exclusive: true },
  { id: "derecho-de-peticion", name: "Derecho de petición", desc: "Plantilla lista para radicar.", cat: "tramites", icon: "IconGavel", status: "pronto", engine: "navegador", exclusive: true },
  { id: "liquidacion", name: "Calculadora de liquidación", desc: "Prima, cesantías y vacaciones en PDF.", cat: "tramites", icon: "IconCalculator", status: "pronto", engine: "navegador", exclusive: true },

  // ---------- Organizar ----------
  { id: "unir-pdf", name: "Unir PDF", desc: "Junta varios PDF en el orden que quieras.", cat: "organizar", icon: "IconFiles", status: "listo", engine: "navegador" },
  { id: "dividir-pdf", name: "Dividir PDF", desc: "Separa por rangos o página por página.", cat: "organizar", icon: "IconCut", status: "listo", engine: "navegador" },
  { id: "eliminar-paginas", name: "Eliminar páginas", desc: "Quita las páginas que sobran.", cat: "organizar", icon: "IconTrash", status: "listo", engine: "navegador" },
  { id: "extraer-paginas", name: "Extraer páginas", desc: "Saca solo las páginas que necesitas.", cat: "organizar", icon: "IconFileExport", status: "listo", engine: "navegador" },
  { id: "ordenar-pdf", name: "Ordenar PDF", desc: "Arrastra, gira y borra páginas viéndolas.", cat: "organizar", icon: "IconLayoutGrid", status: "listo", engine: "navegador" },
  { id: "intercalar-pdf", name: "Intercalar páginas", desc: "Une el escaneo de caras y reversos en orden.", cat: "organizar", icon: "IconArrowsShuffle", status: "listo", engine: "navegador", exclusive: true },
  { id: "varias-por-hoja", name: "Varias páginas por hoja", desc: "2 o 4 páginas por hoja para imprimir menos.", cat: "organizar", icon: "IconLayoutColumns", status: "listo", engine: "navegador", exclusive: true },
  { id: "escanear-pdf", name: "Escanear a PDF", desc: "Usa la cámara del celular.", cat: "organizar", icon: "IconScan", status: "listo", engine: "navegador" },

  // ---------- Optimizar ----------
  { id: "comprimir-pdf", name: "Comprimir PDF", desc: "Reduce el peso con la calidad que elijas.", cat: "optimizar", icon: "IconFileZip", status: "listo", engine: "navegador" },
  { id: "reparar-pdf", name: "Reparar PDF", desc: "Recupera PDF dañados.", cat: "optimizar", icon: "IconTool", status: "listo", engine: "navegador" },
  { id: "ocr-pdf", name: "OCR PDF", desc: "Vuelve buscable un PDF escaneado.", cat: "optimizar", icon: "IconTextRecognition", status: "listo", engine: "navegador", limitFree: "30 páginas por archivo" },
  { id: "quitar-metadatos", name: "Quitar metadatos", desc: "Borra autor, programa y fechas ocultas.", cat: "optimizar", icon: "IconEraser", status: "listo", engine: "navegador", exclusive: true },

  // ---------- Convertir a PDF ----------
  { id: "jpg-a-pdf", name: "Imagen a PDF", desc: "JPG, PNG o WEBP a PDF.", cat: "convertir-a", icon: "IconPhoto", status: "listo", engine: "navegador" },
  { id: "word-a-pdf", name: "Word a PDF", desc: "DOC y DOCX a PDF.", cat: "convertir-a", icon: "IconFileTypeDocx", status: "pronto", engine: "servidor", limitFree: "25 MB por archivo" },
  { id: "powerpoint-a-pdf", name: "PowerPoint a PDF", desc: "PPT y PPTX a PDF.", cat: "convertir-a", icon: "IconFileTypePpt", status: "pronto", engine: "servidor", limitFree: "25 MB por archivo" },
  { id: "excel-a-pdf", name: "Excel a PDF", desc: "XLS y XLSX a PDF.", cat: "convertir-a", icon: "IconFileTypeXls", status: "pronto", engine: "servidor", limitFree: "25 MB por archivo" },
  { id: "html-a-pdf", name: "HTML a PDF", desc: "Convierte una página web en PDF.", cat: "convertir-a", icon: "IconWorldWww", status: "pronto", engine: "servidor" },

  // ---------- Convertir desde PDF ----------
  { id: "pdf-a-jpg", name: "PDF a imagen", desc: "Cada página como JPG o PNG.", cat: "convertir-desde", icon: "IconFileTypeJpg", status: "listo", engine: "navegador" },
  { id: "pdf-a-word", name: "PDF a Word", desc: "Edita tu PDF en Word.", cat: "convertir-desde", icon: "IconFileTypeDocx", status: "pronto", engine: "servidor", limitFree: "50 páginas por archivo" },
  { id: "pdf-a-powerpoint", name: "PDF a PowerPoint", desc: "Cada página como diapositiva.", cat: "convertir-desde", icon: "IconFileTypePpt", status: "pronto", engine: "servidor", limitFree: "50 páginas por archivo" },
  { id: "pdf-a-excel", name: "PDF a Excel", desc: "Saca las tablas a una hoja de cálculo.", cat: "convertir-desde", icon: "IconFileTypeXls", status: "pronto", engine: "servidor", limitFree: "50 páginas por archivo" },
  { id: "pdf-a-pdfa", name: "PDF a PDF/A", desc: "Formato de archivo para entidades.", cat: "convertir-desde", icon: "IconArchive", status: "pronto", engine: "servidor" },
  { id: "pdf-a-markdown", name: "PDF a Markdown", desc: "Texto con títulos, listo para IA o notas.", cat: "convertir-desde", icon: "IconMarkdown", status: "listo", engine: "navegador", limitFree: "50 páginas por archivo" },
  { id: "extraer-texto", name: "Extraer texto", desc: "Todo el texto del PDF en un .txt.", cat: "convertir-desde", icon: "IconFileText", status: "listo", engine: "navegador", exclusive: true },

  // ---------- Editar ----------
  { id: "rotar-pdf", name: "Rotar PDF", desc: "Gira todas o algunas páginas.", cat: "editar", icon: "IconRotateClockwise", status: "listo", engine: "navegador" },
  { id: "numeros-de-pagina", name: "Números de página", desc: "Numera con la posición que quieras.", cat: "editar", icon: "IconNumbers", status: "listo", engine: "navegador" },
  { id: "marca-de-agua", name: "Marca de agua", desc: "Texto encima de cada página.", cat: "editar", icon: "IconDroplet", status: "listo", engine: "navegador" },
  { id: "recortar-pdf", name: "Recortar PDF", desc: "Quita márgenes de las páginas.", cat: "editar", icon: "IconCrop", status: "listo", engine: "navegador" },
  { id: "editar-pdf", name: "Editar PDF", desc: "Agrega texto e imágenes.", cat: "editar", icon: "IconPencil", status: "listo", engine: "navegador" },
  { id: "formularios-pdf", name: "Formularios PDF", desc: "Llena formularios PDF.", cat: "editar", icon: "IconForms", status: "listo", engine: "navegador" },
  { id: "encabezado-pie", name: "Encabezado y pie", desc: "Texto arriba o abajo de cada página.", cat: "editar", icon: "IconLayoutNavbar", status: "listo", engine: "navegador", exclusive: true },

  // ---------- Seguridad ----------
  { id: "proteger-pdf", name: "Proteger PDF", desc: "Ponle contraseña con AES-256.", cat: "seguridad", icon: "IconLock", status: "listo", engine: "navegador" },
  { id: "desbloquear-pdf", name: "Desbloquear PDF", desc: "Quita la contraseña si la conoces.", cat: "seguridad", icon: "IconLockOpen", status: "listo", engine: "navegador" },
  { id: "firmar-pdf", name: "Firmar PDF", desc: "Dibuja tu firma y ponla en el PDF.", cat: "seguridad", icon: "IconSignature", status: "listo", engine: "navegador" },
  { id: "censurar-pdf", name: "Censurar PDF", desc: "Tapa datos de verdad, no solo encima.", cat: "seguridad", icon: "IconEyeOff", status: "listo", engine: "navegador" },
  { id: "comparar-pdf", name: "Comparar PDF", desc: "Ve qué cambió entre dos versiones.", cat: "seguridad", icon: "IconGitCompare", status: "listo", engine: "navegador" },

  // ---------- IA ----------
  { id: "resumir-pdf", name: "Resumir con IA", desc: "Las ideas clave en segundos.", cat: "ia", icon: "IconSparkles", status: "pronto", engine: "ia", limitFree: "20 páginas por archivo" },
  { id: "traducir-pdf", name: "Traducir PDF", desc: "A inglés, español y más.", cat: "ia", icon: "IconLanguage", status: "pronto", engine: "ia", limitFree: "20 páginas por archivo" },
  { id: "chat-pdf", name: "Pregúntale al PDF", desc: "Haz preguntas sobre el documento.", cat: "ia", icon: "IconMessageQuestion", status: "pronto", engine: "ia", limitFree: "20 páginas por archivo" },
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);

export const ENGINE_LABEL = {
  navegador: "Se procesa en tu dispositivo",
  servidor: "Se procesa en el servidor de Pliego",
  ia: "Usa inteligencia artificial",
};

// Límites del plan gratis. El uso siempre es ilimitado; solo se limita el tamaño de cada archivo.
export const FREE_LIMITS = {
  maxFileMB: 100,
  maxFilesPerTask: 20,
  markdownPages: 50,
  ocrPages: 30,
};

export const TRAMITES = [
  { id: "empleo", name: "Hoja de vida para empleo", tag: "Empleo", tool: "paquete-documentos", desc: "Hoja de vida, cédula, diplomas y certificados en un PDF ordenado." },
  { id: "cedula", name: "Cédula por ambas caras", tag: "Gobierno", tool: "cedula-ambas-caras", desc: "La forma que piden bancos, EPS y universidades." },
  { id: "2mb", name: "PDF de máximo 2 MB", tag: "Estudio", tool: "comprimir-a-peso", desc: "El límite más común en plataformas de convocatorias e inscripciones." },
  { id: "1mb", name: "PDF de máximo 1 MB", tag: "Gobierno", tool: "comprimir-a-peso", desc: "Para plataformas más estrictas con el peso." },
  { id: "revisar", name: "Revisar antes de subir", tag: "Todos", tool: "revisor", desc: "Evita que una plataforma te rechace el archivo." },
  { id: "escaneo", name: "Unir escaneo doble cara", tag: "Estudio", tool: "intercalar-pdf", desc: "Escaneaste caras y reversos por separado: júntalos en orden." },
];
