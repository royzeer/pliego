// Datos generales del sitio (se usan en la app y al generar las páginas para Google).
export const SITE = {
  name: "Pliego",
  url: "https://pliego.lat",
  email: "stebanc1703@gmail.com",
  owner: "Roycer Cervantes",
  city: "Santa Marta, Colombia",
  tagline: "Herramientas PDF gratis y sin límite de usos, pensadas para tus trámites",
  description:
    "Une, comprime, divide y convierte PDF gratis y sin límite de usos. Cédula por ambas caras, comprimir a peso exacto y más. Tus archivos se procesan en tu dispositivo.",
  updated: "25 de noviembre de 2026",
};

// Páginas fijas del sitio con su título y descripción para buscadores.
export const PAGES = [
  { path: "/", title: "Pliego — Herramientas PDF gratis para tus trámites", description: SITE.description, h1: "Tus documentos listos para cualquier trámite" },
  { path: "/herramientas", title: "Todas las herramientas PDF gratis — Pliego", description: "Más de 40 herramientas para unir, dividir, comprimir, convertir, rotar, numerar y proteger PDF. Gratis, sin registro y sin límite de usos.", h1: "Herramientas PDF" },
  { path: "/tramites", title: "Documentos listos para trámites en Colombia — Pliego", description: "Cédula por ambas caras, PDF de máximo 1 o 2 MB, paquete de hoja de vida y revisor antes de subir. Deja tus documentos como los piden las plataformas.", h1: "Trámites" },
  { path: "/planes", title: "Planes — Pliego", description: "Pliego es gratis y sin límite de usos. El plan Pro es para archivos grandes, trabajo en lote y sin anuncios.", h1: "Planes" },
  { path: "/instalar", title: "Instalar Pliego en Android, iPhone y computador", description: "Instala Pliego como app en tu celular o computador: se abre en pantalla completa, sin barra del navegador, y funciona sin internet. Gratis.", h1: "Instala Pliego en tu celular" },
  { path: "/acerca", title: "Acerca de Pliego", description: "Qué es Pliego, quién lo hace y por qué tus archivos se procesan en tu propio dispositivo.", h1: "Acerca de Pliego" },
  { path: "/contacto", title: "Contacto — Pliego", description: "Escríbenos para reportar un error, sugerir una herramienta o preguntar por los planes.", h1: "Contacto" },
  { path: "/privacidad", title: "Política de privacidad — Pliego", description: "Cómo Pliego trata tus archivos y datos: los PDF se procesan en tu dispositivo y no se suben a ningún servidor.", h1: "Política de privacidad" },
  { path: "/terminos", title: "Términos de uso — Pliego", description: "Condiciones para usar las herramientas de Pliego.", h1: "Términos de uso" },
];
