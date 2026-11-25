// Todas las guías largas (una por herramienta). Se usan en /guias y al generar las páginas para Google.
import tramites from "./tramites.js";
import organizar from "./organizar.js";
import optimizarConvertir from "./optimizar-convertir.js";
import editarSeguridadIa from "./editar-seguridad-ia.js";

export const ARTICLES = [...tramites, ...organizar, ...optimizarConvertir, ...editarSeguridadIa];
export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug);
