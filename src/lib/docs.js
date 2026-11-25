// Generadores de documentos colombianos: cuenta de cobro, derecho de petición
// y reporte de liquidación. Todo se arma en el navegador con pdf-lib.
import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";
import { pdfBlob } from "./files.js";

// Valores 2026 verificados (Decretos 1469 y 1470 de 2025).
export const SMLMV_2026 = 1750905;
export const AUX_TRANSPORTE_2026 = 249095;

export const pesos = (n) => "$" + Math.round(n).toLocaleString("es-CO");

// ---------------------------------------------------------------- Número a letras
const U = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const D = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const C = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

const hundreds = (n) => {
  if (n === 0) return "";
  if (n === 100) return "cien";
  const c = Math.floor(n / 100), r = n % 100;
  let s = C[c];
  if (r) {
    const t = r < 30 ? U[r] : D[Math.floor(r / 10)] + (r % 10 ? " y " + U[r % 10] : "");
    s = (s ? s + " " : "") + t;
  }
  return s;
};

export function numberToWords(num) {
  let n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return "cero";
  const parts = [];
  const millions = Math.floor(n / 1e6);
  const thousands = Math.floor((n % 1e6) / 1000);
  const rest = n % 1000;
  if (millions) {
    if (millions === 1) parts.push("un millón");
    else parts.push(numberToWords(millions).replace(/veintiuno$/, "veintiún").replace(/uno$/, "un") + " millones");
  }
  if (thousands) parts.push(thousands === 1 ? "mil" : hundreds(thousands).replace(/veintiuno$/, "veintiún").replace(/uno$/, "un") + " mil");
  if (rest) parts.push(hundreds(rest));
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export const pesosEnLetras = (n) => {
  const w = numberToWords(n);
  const fixed = w.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");
  const de = /(millón|millones)$/.test(fixed) ? " de" : "";
  return `${fixed.charAt(0).toUpperCase()}${fixed.slice(1)}${de} pesos m/cte`;
};

// ---------------------------------------------------------------- Ayudas de dibujo
async function writer() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 612, H = 792, M = 64;
  let page = doc.addPage([W, H]);
  let y = H - M;
  const check = (t) => { try { font.encodeText(String(t)); } catch { throw new Error("Hay caracteres que no se pueden escribir en el PDF (por ejemplo emojis). Quítalos e intenta de nuevo."); } };
  const ensure = (h) => { if (y - h < M) { page = doc.addPage([W, H]); y = H - M; } };
  const wrap = (text, f, size, width) => {
    const out = [];
    for (const para of String(text ?? "").split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const t = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(t, size) > width && line) { out.push(line); line = word; } else line = t;
      }
      out.push(line);
    }
    return out;
  };
  const api = {
    doc, font, bold, W, M,
    get y() { return y; },
    space: (h) => { y -= h; },
    text: (t, { size = 11, b = false, align = "left", color = rgb(0.1, 0.1, 0.1), indent = 0, gap = 1.45 } = {}) => {
      check(t);
      const f = b ? bold : font;
      for (const line of wrap(t, f, size, W - 2 * M - indent)) {
        ensure(size * gap);
        const tw = f.widthOfTextAtSize(line, size);
        const x = align === "center" ? (W - tw) / 2 : align === "right" ? W - M - tw : M + indent;
        page.drawText(line, { x, y: y - size, size, font: f, color });
        y -= size * gap;
      }
    },
    row: (left, right, { size = 11, b = false } = {}) => {
      check(left); check(right);
      ensure(size * 1.7);
      const f = b ? bold : font;
      page.drawText(String(left), { x: M, y: y - size, size, font: f });
      const tw = f.widthOfTextAtSize(String(right), size);
      page.drawText(String(right), { x: W - M - tw, y: y - size, size, font: f });
      y -= size * 1.7;
    },
    line: (len) => { ensure(10); page.drawLine({ start: { x: M, y: y - 4 }, end: { x: len ? M + len : W - M, y: y - 4 }, thickness: 0.6, color: rgb(0.75, 0.75, 0.75) }); y -= 12; },
    image: async (dataUrl, maxW = 170, maxH = 60) => {
      const bytes = new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
      const img = dataUrl.startsWith("data:image/png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const s = Math.min(maxW / img.width, maxH / img.height);
      ensure(img.height * s + 6);
      page.drawImage(img, { x: M, y: y - img.height * s, width: img.width * s, height: img.height * s });
      y -= img.height * s + 4;
    },
    save: async (name) => ({ blob: pdfBlob(await doc.save()), name }),
  };
  return api;
}

const fechaLarga = (iso) => {
  const d = iso ? new Date(`${iso}T12:00:00`) : new Date();
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
};
const fileSafe = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w-]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");

// ---------------------------------------------------------------- Cuenta de cobro
export async function cuentaDeCobro(d) {
  const valor = Number(String(d.valor).replace(/[^\d]/g, ""));
  if (!d.nombre || !d.cliente || !valor) throw new Error("Llena al menos tu nombre, a quién le cobras y el valor.");
  const w = await writer();
  w.text(`${d.ciudad || ""}${d.ciudad ? ", " : ""}${fechaLarga(d.fecha)}`, { size: 11 });
  w.space(18);
  w.text(`CUENTA DE COBRO No. ${d.numero || "001"}`, { size: 16, b: true, align: "center" });
  w.space(18);
  w.text(d.cliente.toUpperCase(), { b: true });
  if (d.clienteId) w.text(`NIT / C.C. ${d.clienteId}`);
  w.space(16);
  w.text("DEBE A:", { align: "center", b: true });
  w.space(6);
  w.text(d.nombre.toUpperCase(), { align: "center", b: true, size: 13 });
  if (d.cedula) w.text(`C.C. ${d.cedula}`, { align: "center" });
  w.space(16);
  w.text("LA SUMA DE:", { align: "center", b: true });
  w.space(4);
  w.text(`${pesosEnLetras(valor)} (${pesos(valor)})`, { align: "center", size: 12 });
  w.space(16);
  w.text("Por concepto de:", { b: true });
  w.text(d.concepto || "Prestación de servicios.");
  w.space(14);
  if (d.banco || d.cuenta) {
    w.text("Forma de pago:", { b: true });
    w.text(`Transferencia a ${d.tipoCuenta || "cuenta"} ${d.banco ? `en ${d.banco}` : ""} No. ${d.cuenta || ""} a nombre de ${d.nombre}.`);
    w.space(10);
  }
  if (d.noIva) {
    w.text("Declaro que no soy responsable del impuesto sobre las ventas (IVA) y que no estoy obligado a expedir factura electrónica, de acuerdo con las condiciones del régimen correspondiente.", { size: 9.5, color: rgb(0.3, 0.3, 0.3) });
    w.space(8);
  }
  w.space(28);
  w.text("Atentamente,");
  w.space(8);
  if (d.firma) await w.image(d.firma);
  else w.space(36);
  w.line(230);
  w.text(d.nombre, { b: true });
  if (d.cedula) w.text(`C.C. ${d.cedula}`);
  if (d.telefono) w.text(`Tel. ${d.telefono}`);
  if (d.correo) w.text(d.correo);
  return w.save(`Cuenta_de_cobro_${d.numero || "001"}_${fileSafe(d.nombre)}.pdf`);
}

// ---------------------------------------------------------------- Derecho de petición
export async function derechoDePeticion(d) {
  if (!d.nombre || !d.entidad || !d.peticiones) throw new Error("Llena al menos tu nombre, la entidad y lo que pides.");
  const w = await writer();
  w.text(`${d.ciudad || ""}${d.ciudad ? ", " : ""}${fechaLarga(d.fecha)}`);
  w.space(18);
  w.text("Señores", {});
  w.text(d.entidad.toUpperCase(), { b: true });
  if (d.dependencia) w.text(d.dependencia);
  if (d.ciudadEntidad) w.text(d.ciudadEntidad);
  w.space(14);
  w.text(`Asunto: Derecho de petición${d.asunto ? ` – ${d.asunto}` : ""}`, { b: true });
  w.space(12);
  w.text(`Yo, ${d.nombre}, identificado(a) con cédula de ciudadanía No. ${d.cedula || "________"}, en ejercicio del derecho fundamental de petición consagrado en el artículo 23 de la Constitución Política de Colombia y regulado por la Ley 1755 de 2015, respetuosamente me dirijo a ustedes con fundamento en los siguientes:`);
  w.space(10);
  w.text("HECHOS", { b: true, align: "center" });
  w.space(4);
  String(d.hechos || "").split("\n").filter(Boolean).forEach((h, i) => w.text(`${i + 1}. ${h.trim()}`, { indent: 0 }));
  w.space(10);
  w.text("PETICIONES", { b: true, align: "center" });
  w.space(4);
  String(d.peticiones).split("\n").filter(Boolean).forEach((p, i) => w.text(`${i + 1}. ${p.trim()}`));
  w.space(10);
  w.text("Solicito que la respuesta se emita dentro de los términos legales establecidos en la Ley 1755 de 2015.");
  w.space(10);
  w.text("NOTIFICACIONES", { b: true, align: "center" });
  w.space(4);
  w.text(`Recibiré respuesta en: ${[d.direccion, d.correo, d.telefono ? `Tel. ${d.telefono}` : ""].filter(Boolean).join(" · ") || "________"}`);
  w.space(28);
  w.text("Atentamente,");
  w.space(8);
  if (d.firma) await w.image(d.firma);
  else w.space(36);
  w.line(230);
  w.text(d.nombre, { b: true });
  w.text(`C.C. ${d.cedula || "________"}`);
  return w.save(`Derecho_de_peticion_${fileSafe(d.entidad)}.pdf`);
}

// ---------------------------------------------------------------- Liquidación
/** Días entre dos fechas con año comercial de 360 días, contando ambos días. */
export function days360(a, b) {
  if (!a || !b) return 0;
  const [y1, m1, d1raw] = a.split("-").map(Number);
  const [y2, m2, d2raw] = b.split("-").map(Number);
  const d1 = Math.min(d1raw, 30);
  const lastFeb = (y, m, d) => m === 2 && d >= (new Date(y, 2, 0).getDate());
  const d2 = lastFeb(y2, m2, d2raw) ? 30 : Math.min(d2raw, 30);
  const n = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1) + 1;
  return Math.max(0, n);
}

const maxDate = (a, b) => (a > b ? a : b);

export function calcLiquidacion({ salario, inicio, fin, auxilio, ultimoCesantias, ultimaPrima, vacTomadas, diasSalarioPendiente }) {
  const s = Number(salario) || 0;
  const aux = auxilio ? AUX_TRANSPORTE_2026 : 0;
  const base = s + aux;
  const finYear = fin.slice(0, 4);
  const semStart = Number(fin.slice(5, 7)) <= 6 ? `${finYear}-01-01` : `${finYear}-07-01`;
  const desdeCes = maxDate(inicio, ultimoCesantias || `${finYear}-01-01`);
  const desdePrima = maxDate(inicio, ultimaPrima || semStart);
  const diasCes = days360(desdeCes, fin);
  const diasPrima = days360(desdePrima, fin);
  const diasTotal = days360(inicio, fin);
  const cesantias = (base * diasCes) / 360;
  const intereses = (cesantias * diasCes * 0.12) / 360;
  const prima = (base * diasPrima) / 360;
  const diasVacCausados = (diasTotal * 15) / 360;
  const diasVacPend = Math.max(0, diasVacCausados - (Number(vacTomadas) || 0));
  const vacaciones = (s / 30) * diasVacPend;
  const salarioPend = ((s + aux) / 30) * (Number(diasSalarioPendiente) || 0);
  const items = [
    { k: "Cesantías", f: `${pesos(base)} × ${diasCes} días ÷ 360`, v: cesantias },
    { k: "Intereses sobre cesantías", f: `${pesos(cesantias)} × ${diasCes} días × 12 % ÷ 360`, v: intereses },
    { k: "Prima de servicios", f: `${pesos(base)} × ${diasPrima} días ÷ 360`, v: prima },
    { k: "Vacaciones no disfrutadas", f: `${pesos(s)} ÷ 30 × ${diasVacPend.toFixed(2).replace(".", ",")} días`, v: vacaciones },
  ];
  if (salarioPend) items.push({ k: "Salario pendiente", f: `${pesos(s + aux)} ÷ 30 × ${diasSalarioPendiente} días`, v: salarioPend });
  return { items, total: items.reduce((a, x) => a + x.v, 0), diasTotal, base, aux };
}

export async function liquidacionPdf(input, res) {
  const w = await writer();
  w.text("Liquidación de prestaciones sociales (estimado)", { size: 15, b: true });
  w.text(`Generado en pliego.lat el ${fechaLarga()}`, { size: 9.5, color: rgb(0.4, 0.4, 0.4) });
  w.space(10);
  w.row("Salario mensual", pesos(input.salario));
  w.row("Auxilio de transporte", res.aux ? pesos(res.aux) : "No aplica");
  w.row("Fecha de inicio", fechaLarga(input.inicio));
  w.row("Fecha de terminación", fechaLarga(input.fin));
  w.row("Días trabajados (año de 360 días)", String(res.diasTotal));
  w.line();
  for (const it of res.items) {
    w.row(it.k, pesos(it.v), { b: true });
    w.text(it.f, { size: 9.5, color: rgb(0.4, 0.4, 0.4) });
    w.space(4);
  }
  w.line();
  w.row("TOTAL ESTIMADO", pesos(res.total), { b: true, size: 13 });
  w.space(14);
  w.text("Este cálculo es una guía de referencia con las fórmulas del Código Sustantivo del Trabajo y los valores de 2026 (salario mínimo $1.750.905 y auxilio de transporte $249.095). No incluye indemnizaciones, deducciones ni pagos variables, y no reemplaza la asesoría de un abogado o contador.", { size: 9, color: rgb(0.4, 0.4, 0.4) });
  return w.save("Liquidacion_estimada.pdf");
}
