# Pliego

Sitio: https://pliego.lat

Herramientas PDF gratis y sin límite de usos, pensadas para los trámites en Colombia.
Casi todo se procesa dentro del navegador: los archivos nunca salen del dispositivo del usuario.

## Qué tiene

**Para trámites (solo en Pliego)**
- Cédula ambas caras: las dos caras en una hoja, a tamaño real (85,6 x 54 mm).
- Comprimir a peso exacto: el usuario elige el máximo (500 KB, 1 MB, 2 MB...) y Pliego busca la mejor calidad que quepa.
- Paquete de documentos: hoja de vida, cédula, diplomas y certificados en un solo PDF, numerado y con un nombre claro.
- Revisor antes de subir: revisa peso, contraseña, tamaño de hoja, páginas giradas y páginas en blanco.

**Organizar:** unir, dividir, eliminar páginas, extraer páginas, ordenar con miniaturas, intercalar páginas, varias páginas por hoja, escanear con la cámara.

**Optimizar:** comprimir, reparar, quitar metadatos.

**Convertir:** imagen a PDF, PDF a imagen, PDF a Markdown, extraer texto.

**Editar:** rotar, números de página, marca de agua, recortar.

**Seguridad:** proteger con contraseña (AES-256), desbloquear.

**Próximamente:** OCR, Word/Excel/PowerPoint a PDF y viceversa, PDF/A, editar, formularios, firmar, censurar, comparar, IA (resumir, traducir, preguntar), cuenta de cobro, derecho de petición y calculadora de liquidación.

## Modelo de negocio

- **Gratis:** usos ilimitados. El límite es por archivo (100 MB, 20 archivos por tarea, 50 páginas en PDF a Markdown). Con anuncios.
- **Pro, pase de 1 día y plan para papelerías:** archivos más grandes, trabajo en lote, sin anuncios.
- **Anuncios (AdSense):** solo en la guía y las preguntas frecuentes de cada herramienta, lejos del área de trabajo y del botón de descarga, como lo exigen las políticas de Google.

## Tecnología

- React 19 + Vite
- [@cantoo/pdf-lib](https://github.com/cantoo-scribe/pdf-lib) para crear y modificar PDF (incluye cifrado)
- [pdf.js](https://mozilla.github.io/pdf.js/) para ver páginas, renderizar y leer texto
- JSZip para descargar varios archivos en un ZIP
- Tabler Icons
- Tipografía Urbanist

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173

Para generar la versión final:

```bash
npm run build
```

## Publicarlo en Cloudflare (gratis)

Se usa Cloudflare porque su plan gratis permite uso comercial (anuncios y planes de pago) y las visitas a archivos estáticos son gratis e ilimitadas. Cloudflare recomienda Workers para proyectos nuevos; el archivo `wrangler.jsonc` ya trae la configuración.

1. Entra a dash.cloudflare.com y crea una cuenta.
2. Ve a Workers y Pages, luego Crear aplicación, y elige Importar un repositorio (Conectar con GitHub).
3. Autoriza GitHub y elige el repositorio `pliego`.
4. Configuración:
   - Comando de compilación: `npm run build`
   - Comando de despliegue: `npx wrangler deploy`
5. Guarda y publica. Cada vez que subas cambios a GitHub, el sitio se actualiza solo.

Cuando AdSense apruebe el sitio, agrega las variables `VITE_ADSENSE_CLIENT` y `VITE_ADSENSE_SLOT` en la configuración del proyecto en Cloudflare (o en un archivo `.env` a partir de `.env.example`).

## Preparado para Google

Al compilar (`npm run build`), el script `scripts/prerender.mjs` genera una página HTML por cada ruta (54 en total) con su título, descripción, dirección canónica, datos estructurados (schema.org) y el texto de la guía. También crea `sitemap.xml` y `robots.txt`. Así los buscadores leen cada página sin ejecutar JavaScript.

Las guías de cada herramienta están en `src/data/guides.js` y los datos del sitio en `src/data/site.js`.

## Estructura

```
src/
  data/tools.js          Catálogo de herramientas, categorías y límites del plan gratis
  lib/pdf.js             Todas las operaciones con PDF
  lib/render.js          Renderizado de páginas con pdf.js
  lib/files.js           Utilidades de archivos, rangos de páginas y descargas
  lib/stats.js           Estadísticas guardadas solo en el navegador
  tools/registry.js      Herramientas de formulario simple
  tools/CustomTools.jsx  Herramientas con pantalla propia (ordenar, cédula, paquete, revisor...)
  pages/                 Inicio, Herramientas, Herramienta, Trámites, Planes
  components/            Barra lateral, zona para soltar archivos, piezas de la interfaz
```

## Aviso

Pliego no es una página oficial ni está vinculada a ninguna entidad del Estado.

---

Hecho por Roycer Cervantes.
