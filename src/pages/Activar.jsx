import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { activateFromPayment, usePro } from "../lib/pro";
import { ProStatus } from "./Planes";

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
    activateFromPayment(pago)
      .then((d) => setState(d.estado === "aprobado" ? { step: "ok" } : { step: "pending", msg: d.mensaje }))
      .catch((e) => setState({ step: "error", msg: e.message }));
  }, [pago]);

  return (
    <>
      <TopBar title="Activar Pliego Pro" subtitle="Confirmamos tu pago con Mercado Pago" />
      {state.step === "checking" && <div className="card muted">Confirmando tu pago con Mercado Pago…</div>}
      {state.step === "ok" && pro && (
        <>
          <section className="card">
            <h2 style={{ fontSize: 20, marginBottom: 6 }}>Gracias por tu compra</h2>
            <p className="muted">Pliego Pro ya está activo en este dispositivo. Copia tu código de activación y guárdalo: con él activas Pro en tu otro celular o computador desde la página de Planes.</p>
          </section>
          <ProStatus pro={pro} />
          <Link to="/herramientas" className="btn btn-primary" style={{ justifySelf: "start" }}><Icon name="IconLayoutGrid" size={16} /> Ir a las herramientas</Link>
        </>
      )}
      {state.step === "pending" && (
        <section className="card">
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>Tu pago está en proceso</h2>
          <p className="muted">{state.msg} Guarda esta página o vuelve a abrir el enlace del correo de Mercado Pago cuando te confirmen el pago.</p>
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
          <p className="muted">Esta página se abre sola cuando terminas de pagar en Mercado Pago. Si ya tienes un código de activación, actívalo en <Link to="/planes" style={{ textDecoration: "underline" }}>Planes</Link>.</p>
        </section>
      )}
    </>
  );
}
