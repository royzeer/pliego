import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import {
  useUser, usePro, login, register, logout, forgotPassword, resetPassword, deleteAccount,
  checkPassword, startPayment, confirmPayment, PLAN_NAMES, formatDate,
} from "../lib/pro";

const Msg = ({ text, ok }) => (text ? <div className={`alert ${ok ? "" : "alert-error"}`}>{text}</div> : null);

function PasswordInput({ value, onChange, autoComplete, label = "Contraseña" }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" style={{ flex: 1 }} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required />
        <button type="button" className="btn" onClick={() => setShow(!show)}>{show ? "Ocultar" : "Ver"}</button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ entrar o crear cuenta
function AuthForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState(params.get("modo") === "crear" ? "crear" : "entrar");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "" });
  const plan = params.get("plan");

  const after = async () => {
    if (plan === "mensual" || plan === "anual") {
      setMsg({ text: "Listo. Abriendo Mercado Pago…", ok: true });
      try { await startPayment(plan); } catch (e) { setMsg({ text: e.message }); setBusy(false); }
      return;
    }
    navigate(params.get("siguiente") || "/cuenta", { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (mode === "olvide") {
      setBusy(true); setMsg({ text: "" });
      try { const d = await forgotPassword(correo); setMsg({ text: d.mensaje, ok: true }); } catch (err) { setMsg({ text: err.message }); }
      setBusy(false);
      return;
    }
    if (mode === "crear") {
      const problem = checkPassword(clave);
      if (problem) return setMsg({ text: problem });
      if (!acepto) return setMsg({ text: "Para crear la cuenta acepta los términos y la política de privacidad." });
    }
    setBusy(true); setMsg({ text: "" });
    try {
      if (mode === "crear") await register(correo, clave);
      else await login(correo, clave);
      await after();
    } catch (err) {
      setMsg({ text: err.message });
      setBusy(false);
    }
  };

  return (
    <section className="card auth-card">
      {mode !== "olvide" && (
        <div className="chips" style={{ marginBottom: 16 }}>
          <button type="button" className={`chip ${mode === "entrar" ? "active" : ""}`} onClick={() => { setMode("entrar"); setMsg({ text: "" }); }}>Entrar</button>
          <button type="button" className={`chip ${mode === "crear" ? "active" : ""}`} onClick={() => { setMode("crear"); setMsg({ text: "" }); }}>Crear cuenta</button>
        </div>
      )}
      {plan && mode !== "olvide" && <p className="small muted" style={{ marginBottom: 12 }}>Para comprar {PLAN_NAMES[plan] || "Pro"} necesitas una cuenta. Así Pro queda contigo en cualquier celular o computador.</p>}
      {mode === "olvide" && <h2 style={{ fontSize: 18, marginBottom: 8 }}>Recupera tu contraseña</h2>}
      <form onSubmit={submit} className="stack" style={{ gap: 12 }}>
        <div className="field">
          <label>Correo</label>
          <input className="input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" required />
        </div>
        {mode !== "olvide" && (
          <PasswordInput value={clave} onChange={setClave} autoComplete={mode === "crear" ? "new-password" : "current-password"} label={mode === "crear" ? "Crea una contraseña (mínimo 8 caracteres)" : "Contraseña"} />
        )}
        {mode === "crear" && (
          <label className="small" style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} style={{ marginTop: 3 }} />
            <span>Acepto los <Link to="/terminos" style={{ textDecoration: "underline" }}>términos de uso</Link> y la <Link to="/privacidad" style={{ textDecoration: "underline" }}>política de privacidad</Link>.</span>
          </label>
        )}
        <Msg {...msg} />
        <button className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? "Un momento…" : mode === "crear" ? "Crear cuenta" : mode === "entrar" ? "Entrar" : "Enviar enlace"}
        </button>
      </form>
      <div style={{ marginTop: 14 }} className="small">
        {mode === "entrar" && <button type="button" className="link-btn" onClick={() => { setMode("olvide"); setMsg({ text: "" }); }}>¿Olvidaste tu contraseña?</button>}
        {mode === "olvide" && <button type="button" className="link-btn" onClick={() => { setMode("entrar"); setMsg({ text: "" }); }}>Volver a entrar</button>}
      </div>
      <p className="small faint" style={{ marginTop: 14 }}>No necesitas cuenta para usar las herramientas gratis. La cuenta es para Pliego Pro.</p>
    </section>
  );
}

// ------------------------------------------------------------ mi cuenta
function MyAccount({ user }) {
  const pro = usePro();
  const navigate = useNavigate();
  const [pago, setPago] = useState("");
  const [pagoMsg, setPagoMsg] = useState({ text: "" });
  const [borrar, setBorrar] = useState("");
  const [borrarMsg, setBorrarMsg] = useState({ text: "" });
  const [busy, setBusy] = useState(false);

  const checkPago = async (e) => {
    e.preventDefault();
    setBusy(true); setPagoMsg({ text: "" });
    try {
      const d = await confirmPayment(pago);
      setPagoMsg(d.estado === "aprobado" ? { text: d.otraCuenta ? "Ese pago ya está aplicado a otra cuenta." : "Listo, tu pago está aplicado.", ok: !d.otraCuenta } : { text: d.mensaje, ok: true });
    } catch (err) { setPagoMsg({ text: err.message }); }
    setBusy(false);
  };

  const remove = async (e) => {
    e.preventDefault();
    if (!confirm("¿Seguro? Se borra tu cuenta, tus firmas y tus clientes guardados. Si tienes Pro, lo pierdes.")) return;
    setBusy(true); setBorrarMsg({ text: "" });
    try { await deleteAccount(borrar); navigate("/", { replace: true }); } catch (err) { setBorrarMsg({ text: err.message }); setBusy(false); }
  };

  return (
    <>
      <section className={`card ${pro ? "card-invert" : ""} pro-status`}>
        <div className="card-head" style={{ marginBottom: 6 }}>
          <h2><Icon name={pro ? "IconCrown" : "IconUser"} size={18} /> {pro ? `Tienes ${PLAN_NAMES[pro.plan] || "Pro"}` : "Plan gratis"}</h2>
          <span className="small" style={{ opacity: 0.7 }}>{user.correo}</span>
        </div>
        {pro ? (
          <p className="small" style={{ opacity: 0.8 }}>Pro está activo hasta el {formatDate(pro.hasta)}. Entra con este correo en cualquier celular o computador y lo tienes. Si compras otro plan antes de que se venza, los días se suman.</p>
        ) : (
          <p className="small muted">Con Pro tienes archivos más grandes, documentos más largos, firmas y clientes guardados y sin anuncios.</p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <Link to="/planes" className="btn" style={pro ? { background: "var(--invert-text)", color: "var(--invert-bg)" } : undefined}>{pro ? "Sumar más tiempo" : "Ver Pliego Pro"}</Link>
          <button className="btn" style={pro ? { background: "transparent", color: "inherit", borderColor: "currentColor" } : undefined} onClick={async () => { await logout(); navigate("/", { replace: true }); }}><Icon name="IconLogout" size={16} /> Cerrar sesión</button>
        </div>
      </section>

      <section className="card">
        <form onSubmit={checkPago} className="field" style={{ gap: 8 }}>
          <label>¿Pagaste y Pro no se activó? Escribe el número de operación de Mercado Pago</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input className="input" style={{ flex: "1 1 220px" }} inputMode="numeric" value={pago} onChange={(e) => setPago(e.target.value)} placeholder="Ej.: 1234567890" />
            <button className="btn btn-primary" disabled={busy || !pago.trim()}>Revisar pago</button>
          </div>
          <span className="small faint">Lo encuentras en el comprobante que te llega de Mercado Pago.</span>
        </form>
        {pagoMsg.text && <div style={{ marginTop: 10 }}><Msg {...pagoMsg} /></div>}
      </section>

      <section className="card">
        <details>
          <summary className="small muted" style={{ cursor: "pointer" }}>Borrar mi cuenta</summary>
          <form onSubmit={remove} className="stack" style={{ gap: 10, marginTop: 12 }}>
            <p className="small muted">Se borran tu correo, tu contraseña, tus firmas y tus clientes guardados. El registro de tus pagos se conserva por obligaciones contables.</p>
            <PasswordInput value={borrar} onChange={setBorrar} autoComplete="current-password" label="Escribe tu contraseña para confirmar" />
            <Msg {...borrarMsg} />
            <button className="btn" disabled={busy || !borrar} style={{ color: "var(--error)", justifySelf: "start" }}>Borrar mi cuenta</button>
          </form>
        </details>
      </section>
    </>
  );
}

export function Cuenta() {
  const user = useUser();
  useEffect(() => { document.title = user ? "Mi cuenta — Pliego" : "Entrar o crear cuenta — Pliego"; }, [user]);
  return (
    <>
      <TopBar title={user ? "Mi cuenta" : "Tu cuenta de Pliego"} subtitle={user ? "Tu plan y tus datos" : "Entra o crea tu cuenta para usar Pliego Pro"} />
      {user ? <MyAccount user={user} /> : <AuthForm />}
    </>
  );
}

// ------------------------------------------------------------ restablecer contraseña
export function Restablecer() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("t") || "";
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "" });
  useEffect(() => { document.title = "Nueva contraseña — Pliego"; }, []);

  const submit = async (e) => {
    e.preventDefault();
    const problem = checkPassword(clave);
    if (problem) return setMsg({ text: problem });
    setBusy(true); setMsg({ text: "" });
    try { await resetPassword(token, correo, clave); navigate("/cuenta", { replace: true }); } catch (err) { setMsg({ text: err.message }); setBusy(false); }
  };

  return (
    <>
      <TopBar title="Crea una contraseña nueva" subtitle="Después de cambiarla, se cierra la sesión en tus otros dispositivos" />
      <section className="card auth-card">
        {!token ? (
          <p className="muted">Este enlace no está completo. Pide uno nuevo desde <Link to="/cuenta" style={{ textDecoration: "underline" }}>Entrar</Link> &gt; ¿Olvidaste tu contraseña?</p>
        ) : (
          <form onSubmit={submit} className="stack" style={{ gap: 12 }}>
            <div className="field">
              <label>Correo de tu cuenta</label>
              <input className="input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" required />
            </div>
            <PasswordInput value={clave} onChange={setClave} autoComplete="new-password" label="Contraseña nueva (mínimo 8 caracteres)" />
            <Msg {...msg} />
            <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? "Guardando…" : "Guardar contraseña"}</button>
          </form>
        )}
      </section>
    </>
  );
}
