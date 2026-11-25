import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { FREE_LIMITS, PRO_LIMITS } from "../data/tools";
import { usePro, startPayment, activateFromCode, removePro, PLAN_NAMES, formatDate } from "../lib/pro";

const n = (x) => x.toLocaleString("es-CO");

const PRO_ITEMS = [
  "Sin anuncios",
  `Archivos de hasta ${PRO_LIMITS.maxFileMB} MB`,
  `Hasta ${PRO_LIMITS.maxFilesPerTask} archivos por tarea`,
  `OCR de hasta ${PRO_LIMITS.ocrPages} páginas`,
  `PDF a Word, Excel y PowerPoint de hasta ${PRO_LIMITS.convertPages} páginas`,
  `IA con documentos de hasta ${PRO_LIMITS.aiPages} páginas`,
  "Firmas y clientes guardados",
];

const ROWS = [
  ["Usos", "Ilimitados", "Ilimitados"],
  ["Peso por archivo", `${FREE_LIMITS.maxFileMB} MB`, `${PRO_LIMITS.maxFileMB} MB`],
  ["Archivos por tarea", FREE_LIMITS.maxFilesPerTask, PRO_LIMITS.maxFilesPerTask],
  ["OCR", `${FREE_LIMITS.ocrPages} páginas`, `${PRO_LIMITS.ocrPages} páginas`],
  ["PDF a Word, Excel y PowerPoint", `${FREE_LIMITS.convertPages} páginas`, `${PRO_LIMITS.convertPages} páginas`],
  ["PDF a Markdown", `${FREE_LIMITS.markdownPages} páginas`, `${n(PRO_LIMITS.markdownPages)} páginas`],
  ["IA: resumir, traducir y preguntar", `${FREE_LIMITS.aiPages} páginas`, `${PRO_LIMITS.aiPages} páginas`],
  ["Firmas y clientes guardados", "No", "Sí"],
  ["Anuncios", "Sí", "No"],
];

function BuyButton({ plan, invert, children }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const buy = async () => {
    setBusy(true); setError("");
    try { await startPayment(plan); } catch (e) { setError(e.message); setBusy(false); }
  };
  return (
    <div style={{ marginTop: "auto", display: "grid", gap: 8 }}>
      <button className={`btn ${invert ? "" : "btn-primary"}`} disabled={busy} onClick={buy} style={invert ? { background: "var(--invert-text)", color: "var(--invert-bg)" } : undefined}>
        {busy ? "Abriendo Mercado Pago…" : children}
      </button>
      {error && <span className="small" style={{ color: invert ? "#b3261e" : "var(--error)" }}>{error}</span>}
    </div>
  );
}

function CodeForm() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true); setMsg("");
    try { await activateFromCode(code); setCode(""); } catch (err) { setMsg(err.message); }
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="field" style={{ gap: 8 }}>
      <label>¿Ya pagaste? Activa Pro en este dispositivo con tu código</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input className="input" style={{ flex: "1 1 260px" }} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Pega aquí tu código de activación" />
        <button className="btn btn-primary" disabled={busy || !code.trim()}>{busy ? "Activando…" : "Activar"}</button>
      </div>
      {msg && <span className="small" style={{ color: "var(--error)" }}>{msg}</span>}
    </form>
  );
}

export function ProStatus({ pro }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(pro.codigo); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin portapapeles */ }
  };
  return (
    <section className="card card-invert pro-status">
      <div className="card-head" style={{ marginBottom: 6 }}>
        <h2><Icon name="IconCrown" size={18} /> Tienes {PLAN_NAMES[pro.plan] || "Pro"}</h2>
        <span className="small" style={{ opacity: 0.7 }}>Activo hasta el {formatDate(pro.exp)}</span>
      </div>
      <p className="small" style={{ opacity: 0.75 }}>Tu código de activación sirve para activar Pro en tu otro celular o computador. Guárdalo en un lugar seguro y no lo compartas.</p>
      <div className="pro-code">{pro.codigo}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn" style={{ background: "var(--invert-text)", color: "var(--invert-bg)" }} onClick={copy}><Icon name="IconCopy" size={16} /> {copied ? "Copiado" : "Copiar código"}</button>
        <button className="btn" style={{ background: "transparent", color: "inherit", borderColor: "currentColor" }} onClick={() => { if (confirm("¿Quitar Pro de este dispositivo? Puedes volver a activarlo con tu código.")) removePro(); }}>Quitar de este dispositivo</button>
      </div>
    </section>
  );
}

export default function Planes() {
  const pro = usePro();
  const [params] = useSearchParams();
  useEffect(() => { document.title = "Planes — Pliego"; }, []);
  const rejected = params.get("pago") === "rechazado";

  return (
    <>
      <TopBar title="Planes" subtitle="Usa Pliego gratis sin límite de usos. Pro es para archivos grandes, documentos largos y sin anuncios." />
      {rejected && <div className="alert alert-error">El pago no se completó y no se te cobró nada. Puedes intentarlo de nuevo con otro medio de pago.</div>}
      {pro && <ProStatus pro={pro} />}
      <div className="plans">
        <section className="card plan">
          <h2 style={{ fontSize: 18 }}>Gratis</h2>
          <div><div className="price">$0</div><div className="small" style={{ opacity: 0.6 }}>para siempre</div></div>
          <ul>
            {["Todas las herramientas, usos ilimitados", `Archivos de hasta ${FREE_LIMITS.maxFileMB} MB`, `Hasta ${FREE_LIMITS.maxFilesPerTask} archivos por tarea`, `IA con documentos de hasta ${FREE_LIMITS.aiPages} páginas`, "Con anuncios"].map((i) => (
              <li key={i}><Icon name="IconCheck" size={16} style={{ flexShrink: 0, marginTop: 3 }} />{i}</li>
            ))}
          </ul>
          <Link to="/herramientas" className="btn btn-primary" style={{ marginTop: "auto" }}>Usar gratis</Link>
        </section>

        <section className="card plan">
          <h2 style={{ fontSize: 18 }}>Pro mensual</h2>
          <div><div className="price">$9.900</div><div className="small" style={{ opacity: 0.6 }}>pago único por 30 días</div></div>
          <ul>{PRO_ITEMS.map((i) => <li key={i}><Icon name="IconCheck" size={16} style={{ flexShrink: 0, marginTop: 3 }} />{i}</li>)}</ul>
          <BuyButton plan="mensual">Pagar $9.900</BuyButton>
        </section>

        <section className="card plan card-invert">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18 }}>Pro anual</h2>
            <span className="badge" style={{ borderColor: "#bdbdbd", color: "#5e5e62" }}>2 meses gratis</span>
          </div>
          <div><div className="price">$99.000</div><div className="small" style={{ opacity: 0.6 }}>pago único por 365 días · $8.250 al mes</div></div>
          <ul>{PRO_ITEMS.map((i) => <li key={i}><Icon name="IconCheck" size={16} style={{ flexShrink: 0, marginTop: 3 }} />{i}</li>)}</ul>
          <BuyButton plan="anual" invert>Pagar $99.000</BuyButton>
        </section>

        <section className="card plan">
          <h2 style={{ fontSize: 18 }}>Papelerías</h2>
          <div><div className="price">Pronto</div><div className="small" style={{ opacity: 0.6 }}>mensual</div></div>
          <ul>
            {["Todo lo de Pro", "Tu logo en los documentos", "Pensado para atender clientes todo el día"].map((i) => (
              <li key={i}><Icon name="IconCheck" size={16} style={{ flexShrink: 0, marginTop: 3 }} />{i}</li>
            ))}
          </ul>
          <a href="mailto:hola@pliego.lat?subject=Pliego%20para%20papeler%C3%ADas" className="btn btn-primary" style={{ marginTop: "auto" }}>Avísame</a>
        </section>
      </div>

      <section className="card">
        <div className="stack" style={{ gap: 14 }}>
          <p className="small muted">
            Pagas una sola vez con Mercado Pago: tarjeta, PSE y los demás medios que Mercado Pago tenga disponibles. No es una suscripción y no se renueva sola. Al terminar el pago recibes un código de activación para usar Pro también en tu otro celular o computador.
          </p>
          {!pro && <CodeForm />}
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Comparación</h2></div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead><tr><th>Función</th><th>Gratis</th><th>Pro</th></tr></thead>
            <tbody>{ROWS.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginTop: 12 }}>¿Dudas o un problema con tu pago? Escríbenos a <a href="mailto:hola@pliego.lat" style={{ textDecoration: "underline" }}>hola@pliego.lat</a>.</p>
      </section>
    </>
  );
}
