import { useEffect } from "react";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";

const PLANS = [
  {
    name: "Gratis", price: "$0", period: "para siempre", cta: "Usar gratis", href: "/herramientas",
    items: ["Todas las herramientas, usos ilimitados", "Hasta 100 MB por archivo", "Hasta 20 archivos por tarea", "PDF a Markdown hasta 50 páginas", "Con anuncios"],
  },
  {
    name: "Pase de 1 día", price: "Pronto", period: "pago único", cta: "Avísame", invert: false,
    items: ["Todo lo de Pro por 24 horas", "Ideal para un trámite puntual", "Sin suscripción"],
  },
  {
    name: "Pro", price: "Pronto", period: "mensual o anual", cta: "Avísame", invert: true,
    items: ["Sin anuncios", "Hasta 1 GB por archivo", "Procesar en lote (50 PDF) y descargar en ZIP", "Conversiones y OCR de hasta 500 páginas", "IA: resumir y traducir hasta 300 páginas", "Plantillas y firma guardadas"],
  },
  {
    name: "Papelerías", price: "Pronto", period: "mensual", cta: "Avísame",
    items: ["Todo lo de Pro", "Tu logo en los documentos", "Pensado para atender clientes todo el día"],
  },
];

const ROWS = [
  ["Usos", "Ilimitados", "Ilimitados"],
  ["Peso por archivo", "100 MB", "1 GB"],
  ["Archivos por tarea", "20", "Ilimitados"],
  ["PDF a Markdown", "50 páginas", "1.000 páginas"],
  ["Word, Excel y PowerPoint (pronto)", "50 páginas", "500 páginas"],
  ["IA: resumir y traducir (pronto)", "20 páginas", "300 páginas"],
  ["Anuncios", "Sí", "No"],
];

export default function Planes() {
  useEffect(() => { document.title = "Planes — Pliego"; }, []);
  return (
    <>
      <TopBar title="Planes" subtitle="Usa Pliego gratis sin límite de usos. Pro es para archivos grandes y trabajo en lote." />
      <div className="plans">
        {PLANS.map((p) => (
          <section key={p.name} className={`card plan ${p.invert ? "card-invert" : ""}`}>
            <h2 style={{ fontSize: 18 }}>{p.name}</h2>
            <div><div className="price">{p.price}</div><div className="small" style={{ opacity: 0.6 }}>{p.period}</div></div>
            <ul>{p.items.map((i) => <li key={i}><Icon name="IconCheck" size={16} style={{ flexShrink: 0, marginTop: 3 }} />{i}</li>)}</ul>
            <a href={p.href || "mailto:hola@pliego.lat?subject=Quiero%20Pliego%20Pro"} className={`btn ${p.invert ? "" : "btn-primary"}`} style={{ marginTop: "auto", ...(p.invert ? { background: "var(--invert-text)", color: "var(--invert-bg)" } : {}) }}>{p.cta}</a>
          </section>
        ))}
      </div>
      <section className="card">
        <div className="card-head"><h2>Comparación</h2></div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead><tr><th>Función</th><th>Gratis</th><th>Pro</th></tr></thead>
            <tbody>{ROWS.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
