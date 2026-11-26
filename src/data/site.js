// Datos generales del sitio (se usan en la app y al generar las páginas para Google).
export const SITE = {
  name: "Pliego",
  url: "https://pliego.lat",
  email: "hola@pliego.lat",
  owner: "Roycer Cervantes",
  city: "Santa Marta, Colombia",
  tagline: "Herramientas PDF gratis y sin límite de usos, pensadas para tus trámites",
  description:
    "Une, comprime, divide y convierte PDF gratis y sin límite de usos. Cédula por ambas caras, comprimir a peso exacto y más. Tus archivos se procesan en tu dispositivo.",
  updated: "25 de noviembre de 2026",
};

// Imágenes propias de Pliego (carpeta public/imagenes). Sirven para Google Imágenes,
// para la vista previa al compartir un enlace y para la galería de "Acerca de".
export const BRAND = {
  logo: "/imagenes/pliego-logo.png",
  icon: "/imagenes/pliego-icono.png",
  share: { src: "/imagenes/pliego-herramientas-pdf-gratis.jpg", width: 1200, height: 630, alt: "Pliego, herramientas PDF gratis para tus trámites en Colombia" },
  instagram: "https://www.instagram.com/pliego.lat/",
};

export const SCREENSHOTS = [
  { src: "/imagenes/pliego-herramientas-pdf-inicio.jpg", title: "Inicio de Pliego", alt: "Pliego herramientas PDF: pantalla de inicio de la app en el celular", tool: null },
  { src: "/imagenes/pliego-herramientas-pdf-lista.jpg", title: "Las 47 herramientas PDF", alt: "Pliego herramientas PDF: lista de herramientas para trámites, unir, comprimir y convertir", tool: null },
  { src: "/imagenes/pliego-unir-pdf.jpg", title: "Unir PDF", alt: "Pliego herramientas PDF: unir varios PDF en uno gratis", tool: "unir-pdf" },
  { src: "/imagenes/pliego-comprimir-pdf-peso-exacto.jpg", title: "Comprimir PDF a peso exacto", alt: "Pliego herramientas PDF: comprimir un PDF a 1 MB o 2 MB exactos", tool: "comprimir-a-peso" },
  { src: "/imagenes/pliego-cedula-ambas-caras-pdf.jpg", title: "Cédula por ambas caras", alt: "Pliego herramientas PDF: cédula por ambas caras en una sola hoja", tool: "cedula-ambas-caras" },
];
export const SCREENSHOT_SIZE = { width: 780, height: 1688 };

// Google AdSense. El ID de editor (ca-pub) no es secreto. El bloque (slot) se crea en AdSense cuando aprueben el sitio.
// Si cambias el ID, cámbialo también en index.html y en public/ads.txt.
export const ADSENSE = {
  client: "ca-pub-4199707439078963",
  slot: "",
};

// Páginas fijas del sitio con su título y descripción para buscadores.
export const PAGES = [
  { path: "/", title: "Pliego — Herramientas PDF gratis para tus trámites", description: SITE.description, h1: "Tus documentos listos para cualquier trámite" },
  { path: "/herramientas", title: "Todas las herramientas PDF gratis — Pliego", description: "Más de 40 herramientas para unir, dividir, comprimir, convertir, rotar, numerar y proteger PDF. Gratis, sin registro y sin límite de usos.", h1: "Herramientas PDF" },
  { path: "/guias", title: "Guías paso a paso para tus PDF y trámites — Pliego", description: "Guías para unir, comprimir, convertir, firmar y proteger PDF, y para trámites en Colombia: cuenta de cobro, derecho de petición, liquidación y más.", h1: "Guías" },
  { path: "/tramites", title: "Documentos listos para trámites en Colombia — Pliego", description: "Cédula por ambas caras, PDF de máximo 1 o 2 MB, paquete de hoja de vida y revisor antes de subir. Deja tus documentos como los piden las plataformas.", h1: "Trámites" },
  { path: "/planes", title: "Planes — Pliego", description: "Pliego es gratis y sin límite de usos. Pliego Pro cuesta $9.900 por 30 días o $99.000 por un año: archivos más grandes, documentos más largos, sin anuncios.", h1: "Planes" },
  { path: "/instalar", title: "Instalar Pliego en Android, iPhone y computador", description: "Instala Pliego como app en tu celular o computador: se abre en pantalla completa, sin barra del navegador, y funciona sin internet. Gratis.", h1: "Instala Pliego en tu celular" },
  { path: "/acerca", title: "Acerca de Pliego", description: "Qué es Pliego, quién lo hace y por qué tus archivos se procesan en tu propio dispositivo.", h1: "Acerca de Pliego" },
  { path: "/contacto", title: "Contacto — Pliego", description: "Escríbenos para reportar un error, sugerir una herramienta o preguntar por los planes.", h1: "Contacto" },
  { path: "/privacidad", title: "Política de privacidad — Pliego", description: "Cómo Pliego trata tus archivos y datos: los PDF se procesan en tu dispositivo y no se suben a ningún servidor.", h1: "Política de privacidad" },
  { path: "/terminos", title: "Términos de uso — Pliego", description: "Condiciones para usar las herramientas de Pliego.", h1: "Términos de uso" },
];
