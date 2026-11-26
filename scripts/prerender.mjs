// Genera una página HTML por cada ruta después de compilar (npm run build).
// Así Google y los demás buscadores reciben el título, la descripción y el texto
// de cada página sin tener que ejecutar JavaScript. Luego React toma el control.
import fs from "node:fs";
import path from "node:path";
import { TOOLS, CATEGORIES } from "../src/data/tools.js";
import { GUIDES } from "../src/data/guides.js";
import { SITE, PAGES, BRAND, SCREENSHOTS, SCREENSHOT_SIZE } from "../src/data/site.js";
import { ARTICLES } from "../src/data/articles/index.js";
import { GUIDE_SLUGS, EXTRA_GUIDES } from "../src/data/guideSlugs.js";
import { FORMATS, UNIVERSAL_PAIRS, pairCopy, pairSlug } from "../src/data/formats.js";

// Comprueba que el mapa herramienta -> guía esté al día.
for (const a of ARTICLES) {
  if (a.extra) {
    // guías extra: no son la guía principal, deben estar en EXTRA_GUIDES
    if (!(EXTRA_GUIDES[a.tool] || []).some((x) => x.slug === a.slug && x.title === a.title)) throw new Error(`EXTRA_GUIDES desactualizado para ${a.slug}`);
    continue;
  }
  if (GUIDE_SLUGS[a.tool] !== a.slug) throw new Error(`guideSlugs.js desactualizado para ${a.tool}`);
}

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
    `<meta property="og:image" content="${SITE.url}${BRAND.share.src}" />`,
    `<meta property="og:image:width" content="${BRAND.share.width}" />`,
    `<meta property="og:image:height" content="${BRAND.share.height}" />`,
    `<meta property="og:image:alt" content="${esc(BRAND.share.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${SITE.url}${BRAND.share.src}" />`,
    `<meta name="twitter:image:alt" content="${esc(BRAND.share.alt)}" />`,
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : "",
  ].join("\n    ");
}

function render(route, { title, description, body, jsonld }) {
  const url = SITE.url + (route === "/" ? "/" : route);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace(/\s*<meta (property="og:|name="twitter:)[^>]*>/g, "")
    .replace("</head>", `    ${head({ title, description, url, jsonld })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-static">${body}</div></div>`);
  const file = route === "/" ? path.join(DIST, "index.html") : path.join(DIST, `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return url;
}

const img = (s, w = SCREENSHOT_SIZE.width, h = SCREENSHOT_SIZE.height) => `<img src="${s.src}" alt="${esc(s.alt)}" title="${esc(s.title)}" width="${w}" height="${h}" loading="lazy" />`;
const gallery = (list) => `<h2>Así se ve Pliego</h2>${list.map((s) => `<figure>${img(s)}<figcaption>${esc(s.title)}</figcaption></figure>`).join("")}`;
const imgUrl = (s) => ({ loc: SITE.url + s.src, title: s.title, caption: s.alt });
const shareImg = { loc: SITE.url + BRAND.share.src, title: "Pliego herramientas PDF", caption: BRAND.share.alt };
const logoImg = { loc: SITE.url + BRAND.logo, title: "Logo de Pliego", caption: "Logo de Pliego, herramientas PDF gratis" };

// Datos de la marca para Google: nombre, logo, imágenes y redes.
const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": SITE.url + "/#organizacion",
  name: SITE.name,
  url: SITE.url + "/",
  logo: { "@type": "ImageObject", url: SITE.url + BRAND.logo, width: 1000, height: 446 },
  image: SITE.url + BRAND.share.src,
  email: SITE.email,
  description: SITE.description,
  sameAs: [BRAND.instagram],
};

const toolList = (tools) => `<ul>${tools.map((t) => `<li>${link(toolUrl(t), t.name)}: ${esc(t.desc)}</li>`).join("")}</ul>`;
const nav = `<p>${link("/", "Inicio")} · ${link("/herramientas", "Herramientas")} · ${link("/tramites", "Trámites")} · ${link("/guias", "Guías")} · ${link("/planes", "Planes")}</p>`;
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
  if (p.path === "/guias") {
    extra = CATEGORIES.filter((c) => c.id !== "todas")
      .map((c) => {
        const items = ARTICLES.filter((a) => TOOLS.find((t) => t.id === a.tool)?.cat === c.id);
        return items.length ? `<h2>${esc(c.name)}</h2><ul>${items.map((a) => `<li>${link(`/guias/${a.slug}`, a.title)}: ${esc(a.description)}</li>`).join("")}</ul>` : "";
      })
      .join("");
  }
  let images = [];
  if (p.path === "/") {
    extra = `<p>${img(BRAND.share, BRAND.share.width, BRAND.share.height)}</p>` + extra;
    images = [shareImg, logoImg, ...SCREENSHOTS.map(imgUrl)];
  }
  if (p.path === "/acerca") {
    extra = gallery(SCREENSHOTS);
    images = SCREENSHOTS.map(imgUrl);
  }
  const jsonld = p.path === "/"
    ? [
        ORG,
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, alternateName: "Pliego herramientas PDF", url: SITE.url + "/", description: SITE.description, inLanguage: "es", publisher: { "@id": ORG["@id"] } },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Pliego — Herramientas PDF",
          url: SITE.url + "/",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Android, iOS, Windows, macOS (navegador web)",
          inLanguage: "es",
          image: SITE.url + BRAND.share.src,
          screenshot: SCREENSHOTS.map((x) => ({ "@type": "ImageObject", url: SITE.url + x.src, caption: x.alt })),
          offers: { "@type": "Offer", price: "0", priceCurrency: "COP" },
          publisher: { "@id": ORG["@id"] },
          description: SITE.description,
        },
      ]
    : p.path === "/acerca"
      ? [ORG]
      : undefined;
  urls.push({ url: render(p.path, { title: p.title, description: p.description, jsonld, body: `${nav}<h1>${esc(p.h1)}</h1><p>${esc(p.description)}</p>${extra}${footer}` }), priority: p.path === "/" ? "1.0" : "0.6", images });
}

const pairLink = ([f, t]) => link(`/convertir/${pairSlug(f, t)}`, `${FORMATS[f].name} a ${FORMATS[t].name}`);

// Una página por herramienta
for (const t of TOOLS) {
  const g = GUIDES[t.id];
  const related = TOOLS.filter((x) => x.cat === t.cat && x.id !== t.id && x.status === "listo").slice(0, 6);
  const shot = SCREENSHOTS.find((x) => x.tool === t.id);
  const description = g?.intro ? g.intro.slice(0, 155).replace(/\s+\S*$/, "") + "…" : `${t.desc} Gratis, sin registro y sin límite de usos.`;
  const body = [
    nav,
    `<h1>${esc(t.name)} gratis y sin límite</h1>`,
    `<p>${esc(t.desc)}</p>`,
    shot ? `<p>${img(shot)}</p>` : "",
    t.status === "pronto" ? "<p>Esta herramienta llega pronto.</p>" : "",
    g?.intro ? `<p>${esc(g.intro)}</p>` : "",
    g?.steps ? `<h2>Cómo usar ${esc(t.name)}</h2><ol>${g.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : "",
    g?.faqs?.length ? `<h2>Preguntas frecuentes</h2>${g.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}` : "",
    GUIDE_SLUGS[t.id] ? `<p>${link(`/guias/${GUIDE_SLUGS[t.id]}`, "Leer la guía completa")}</p>` : "",
    EXTRA_GUIDES[t.id] ? `<h2>Más guías</h2><ul>${EXTRA_GUIDES[t.id].map((x) => `<li>${link(`/guias/${x.slug}`, x.title)}</li>`).join("")}</ul>` : "",
    t.id === "convertidor" ? `<h2>Conversiones disponibles</h2><ul>${UNIVERSAL_PAIRS.map((x) => `<li>${pairLink(x)}</li>`).join("")}</ul>` : "",
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
      ...(shot ? { screenshot: SITE.url + shot.src } : {}),
      publisher: { "@id": ORG["@id"] },
    },
  ];
  if (g?.faqs?.length) {
    jsonld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  urls.push({ url: render(toolUrl(t), { title: `${t.name} gratis y sin límite — ${SITE.name}`, description, body, jsonld }), priority: t.status === "listo" ? "0.8" : "0.3", images: shot ? [imgUrl(shot)] : [] });
}

// Una página por cada combinación del convertidor universal
for (const [from, to] of UNIVERSAL_PAIRS) {
  const c = pairCopy(from, to);
  const route = `/convertir/${pairSlug(from, to)}`;
  const others = UNIVERSAL_PAIRS.filter(([f, t]) => (f === from || t === to) && !(f === from && t === to)).slice(0, 10);
  const body = [
    nav,
    `<h1>${esc(c.title)}</h1>`,
    `<p>${esc(c.intro)}</p>`,
    `<h2>Cómo convertir ${esc(FORMATS[from].name)} a ${esc(FORMATS[to].name)}</h2><ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`,
    `<h2>Preguntas frecuentes</h2>${c.faqs.map(([q, r]) => `<h3>${esc(q)}</h3><p>${esc(r)}</p>`).join("")}`,
    `<h2>Otras conversiones</h2><ul>${others.map((x) => `<li>${pairLink(x)}</li>`).join("")}</ul>`,
    footer,
  ].join("");
  const jsonld = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: `${c.title} — ${SITE.name}`, url: `${SITE.url}${route}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Cualquiera (navegador web)", inLanguage: "es", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: c.description },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faqs.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: r } })) },
  ];
  urls.push({ url: render(route, { title: `${c.title} — ${SITE.name}`, description: c.description, body, jsonld }), priority: "0.6" });
}

// Una página por guía
const ul = (items, tag = "ul") => `<${tag}>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>`;
for (const a of ARTICLES) {
  const t = TOOLS.find((x) => x.id === a.tool);
  const route = `/guias/${a.slug}`;
  const url = `${SITE.url}${route}`;
  const body = [
    nav,
    `<p>${link("/guias", "Guías")} › ${esc(t.name)}</p>`,
    `<h1>${esc(a.title)}</h1>`,
    a.intro.map((p) => `<p>${esc(p)}</p>`).join(""),
    `<p>${link(toolUrl(t), `Abrir ${t.name}`)}</p>`,
    `<h2>Cuándo te sirve</h2>${ul(a.when)}`,
    `<h2>Paso a paso</h2>${ul(a.steps, "ol")}`,
    (a.sections || []).map((s) => `<h2>${esc(s.h)}</h2>${(s.p || []).map((p) => `<p>${esc(p)}</p>`).join("")}${s.list ? ul(s.list) : ""}`).join(""),
    `<h2>Consejos</h2>${ul(a.tips)}`,
    a.faqs?.length ? `<h2>Preguntas frecuentes</h2>${a.faqs.map(([q, r]) => `<h3>${esc(q)}</h3><p>${esc(r)}</p>`).join("")}` : "",
    footer,
  ].join("");
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      inLanguage: "es",
      url,
      mainEntityOfPage: url,
      dateModified: today,
      author: { "@type": "Person", name: SITE.owner },
      image: SITE.url + BRAND.share.src,
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url + "/", logo: { "@type": "ImageObject", url: SITE.url + BRAND.logo } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url + "/" },
        { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE.url}/guias` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];
  if (a.faqs?.length) {
    jsonld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.faqs.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: r } })),
    });
  }
  urls.push({ url: render(route, { title: `${a.title} — ${SITE.name}`, description: a.description, body, jsonld }), priority: "0.7" });
}

// Sitemap y robots
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url><loc>${u.url}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority>${(u.images || []).map((i) => `<image:image><image:loc>${i.loc}</image:loc></image:image>`).join("")}</url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /pro/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

console.log(`Páginas generadas: ${urls.length}. Sitemap: ${SITE.url}/sitemap.xml`);
