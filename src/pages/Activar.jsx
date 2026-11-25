import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { confirmPayment, usePro, PLAN_NAMES, formatDate } from "../lib/pro";

// Mercado Pago devuelve aquí a la persona después de pagar, con ?payment_id=...&status=...
export default function Activar() {
  const [params] = useSearchParams();
  const pago = params.get("payment_id") || params.get("collection_id") || "";
  const pro = usePro();
  const [state, setState] = useState({ step: pago ? "checking" : "none" });
  const started = useRef(false);

  useEffect(() => { document.title = "Activar Pliego Pro"; }, []);
  useEffect(() => {
    if (!pago || started.current) return;
    started.current = true;
    confirmPayment(pago)
      .then((d) => setState(d.estado === "aprobado" ? { step: d.otraCuenta ? "other" : "ok" } : { step: "pending", msg: d.mensaje }))
      .catch((e) => setState({ step: "error", msg: e.message }));
  }, [pago]);

  return (
    <>
      <TopBar title="Activar Pliego Pro" subtitle="Confirmamos tu pago con Mercado Pago" />
      {state.step === "checking" && <div className="card muted">Confirmando tu pago con Mercado Pago…</div>}
      {state.step === "ok" && (
        <section className={`card ${pro ? "card-invert" : ""} pro-status`}>
          <h2 style={{ marginBottom: 6 }}><Icon name="IconCrown" size={18} /> Gracias por tu compra</h2>
          <p className="small" style={{ opacity: 0.8 }}>
            {pro ? `Ya tienes ${PLAN_NAMES[pro.plan] || "Pro"} hasta el ${formatDate(pro.hasta)}. Entra con tu correo en cualquier celular o computador y lo tienes.` : "Tu pago quedó aplicado a tu cuenta. Entra con tu correo para usar Pro."}
          </p>
          <Link to="/herramientas" className="btn" style={{ marginTop: 12, background: "var(--invert-text)", color: "var(--invert-bg)" }}><Icon name="IconLayoutGrid" size={16} /> Ir a las herramientas</Link>
        </section>
      )}
      {state.step === "other" && (
        <section className="card">
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Pago aplicado a otra cuenta</h2>
          <p className="muted">El pago está aprobado, pero corresponde a otra cuenta de Pliego, no a la que tiene la sesión abierta en este navegador. Cierra sesión y entra con el correo con el que compraste.</p>
        </section>
      )}
      {state.step === "pending" && (
        <section className="card">
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Tu pago está en proceso</h2>
          <p className="muted">{state.msg}</p>
        </section>
      )}
      {state.step === "error" && (
        <section className="card">
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>No pudimos activar Pro</h2>
          <p className="muted">{state.msg}</p>
          <p className="muted small">Si Mercado Pago te cobró, escríbenos a <a href="mailto:hola@pliego.lat?subject=Problema%20con%20mi%20pago" style={{ textDecoration: "underline" }}>hola@pliego.lat</a> con el número de la operación {pago} y lo resolvemos.</p>
        </section>
      )}
      {state.step === "none" && (
        <section className="card">
          <p className="muted">Esta página se abre sola cuando terminas de pagar en Mercado Pago. Si pagaste y Pro no aparece, revisa el pago desde <Link to="/cuenta" style={{ textDecoration: "underline" }}>Mi cuenta</Link>.</p>
        </section>
      )}
    </>
  );
}
