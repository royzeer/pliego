// Genera una página HTML por cada ruta después de compilar (npm run build).
// Así Google y los demás buscadores reciben el título, la descripción y el texto
// de cada página sin tener que ejecutar JavaScript. Luego React toma el control.
import fs from "node:fs";
import path from "node:path";
import { TOOLS, CATEGORIES } from "../src/data/tools.js";
import { GUIDES } from "../src/data/guides.js";
import { SITE, PAGES } from "../src/data/site.js";

const DIST = path.resolve("dist");
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const link = (href, text) => `<a href="${href}">${esc(text)}</a>`;
const toolUrl = (t) => `/herramientas/${t.id}`;

function head({ title, description, url, jsonld }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : "",
  ].join("\n    ");
}

function render(route, { title, description, body, jsonld }) {
  const url = SITE.url + (route === "/" ? "/" : route);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace("</head>", `    ${head({ title, description, url, jsonld })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-static">${body}</div></div>`);
  const file = route === "/" ? path.join(DIST, "index.html") : path.join(DIST, `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return url;
}

const toolList = (tools) => `<ul>${tools.map((t) => `<li>${link(toolUrl(t), t.name)}: ${esc(t.desc)}</li>`).join("")}</ul>`;
const nav = `<p>${link("/", "Inicio")} · ${link("/herramientas", "Herramientas")} · ${link("/tramites", "Trámites")} · ${link("/planes", "Planes")}</p>`;
const footer = `<p>${link("/acerca", "Acerca de")} · ${link("/contacto", "Contacto")} · ${link("/privacidad", "Privacidad")} · ${link("/terminos", "Términos")}</p>`;

const urls = [];

// Páginas fijas
for (const p of PAGES) {
  let extra = "";
  if (p.path === "/" || p.path === "/herramientas") {
    extra = CATEGORIES.filter((c) => c.id !== "todas")
      .map((c) => `<h2>${esc(c.name)}</h2>${toolList(TOOLS.filter((t) => t.cat === c.id))}`)
      .join("");
  }
  if (p.path === "/tramites") extra = toolList(TOOLS.filter((t) => t.cat === "tramites"));
  const jsonld = p.path === "/"
    ? { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url + "/", description: SITE.description, inLanguage: "es" }
    : undefined;
  urls.push({ url: render(p.path, { title: p.title, description: p.description, jsonld, body: `${nav}<h1>${esc(p.h1)}</h1><p>${esc(p.description)}</p>${extra}${footer}` }), priority: p.path === "/" ? "1.0" : "0.6" });
}

// Una página por herramienta
for (const t of TOOLS) {
  const g = GUIDES[t.id];
  const related = TOOLS.filter((x) => x.cat === t.cat && x.id !== t.id && x.status === "listo").slice(0, 6);
  const description = g?.intro ? g.intro.slice(0, 155).replace(/\s+\S*$/, "") + "…" : `${t.desc} Gratis, sin registro y sin límite de usos.`;
  const body = [
    nav,
    `<h1>${esc(t.name)} gratis y sin límite</h1>`,
    `<p>${esc(t.desc)}</p>`,
    t.status === "pronto" ? "<p>Esta herramienta llega pronto.</p>" : "",
    g?.intro ? `<p>${esc(g.intro)}</p>` : "",
    g?.steps ? `<h2>Cómo usar ${esc(t.name)}</h2><ol>${g.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : "",
    g?.faqs?.length ? `<h2>Preguntas frecuentes</h2>${g.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}` : "",
    related.length ? `<h2>Herramientas relacionadas</h2>${toolList(related)}` : "",
    footer,
  ].join("");
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${t.name} — ${SITE.name}`,
      url: `${SITE.url}${toolUrl(t)}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Cualquiera (navegador web)",
      inLanguage: "es",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: t.desc,
    },
  ];
  if (g?.faqs?.length) {
    jsonld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  urls.push({ url: render(toolUrl(t), { title: `${t.name} gratis y sin límite — ${SITE.name}`, description, body, jsonld }), priority: t.status === "listo" ? "0.8" : "0.3" });
}

// Sitemap y robots
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.url}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

console.log(`Páginas generadas: ${urls.length}. Sitemap: ${SITE.url}/sitemap.xml`);
