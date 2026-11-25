import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon";
import { Field, EngineNote, Result, ErrorBox } from "../components/Parts";
import { SignatureMaker } from "./EditTools";
import { cuentaDeCobro, derechoDePeticion, calcLiquidacion, liquidacionPdf, pesos, pesosEnLetras, SMLMV_2026, AUX_TRANSPORTE_2026 } from "../lib/docs";
import { downloadBlob } from "../lib/files";
import { recordTask } from "../lib/stats";

const today = () => new Date().toISOString().slice(0, 10);

/** Guarda los datos del formulario en este navegador para no volver a escribirlos. */
function useSaved(key, initial) {
  const [data, setData] = useState(() => {
    try { return { ...initial, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return initial; }
  });
  useEffect(() => {
    const { firma, ...rest } = data;
    void firma;
    try { localStorage.setItem(key, JSON.stringify(rest)); } catch { /* sin almacenamiento */ }
  }, [key, data]);
  return [data, setData];
}

const Input = ({ label, value, onChange, placeholder, type = "text", area, help }) => (
  <div className="field">
    <label>{label}</label>
    {area ? (
      <textarea className="input" style={{ height: 110, paddingTop: 10, resize: "vertical" }} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input className="input" type={type} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    )}
    {help && <span className="small faint">{help}</span>}
  </div>
);

function useDocTask(toolId) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const run = async (fn) => {
    setBusy(true); setError(""); setResult(null);
    try {
      const r = await fn();
      setResult(r);
      recordTask({ toolId, files: 1, inBytes: 0, outBytes: r.blob.size });
    } catch (e) { setError(e.message || "Algo salió mal."); }
    setBusy(false);
  };
  return { busy, result, error, run, reset: () => setResult(null) };
}

function Firma({ data, set }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="field">
      <label>Firma (opcional)</label>
      {data.firma ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <img src={data.firma} alt="Tu firma" style={{ height: 50, background: "#fff", borderRadius: 8, padding: 4 }} />
          <button className="btn" onClick={() => set({ ...data, firma: null })}>Quitar</button>
        </div>
      ) : open ? (
        <SignatureMaker onCreate={({ url }) => { set({ ...data, firma: url }); setOpen(false); }} />
      ) : (
        <button className="btn" onClick={() => setOpen(true)}><Icon name="IconSignature" size={16} /> Agregar firma</button>
      )}
    </div>
  );
}

const Out = ({ task, onReset }) => (
  <>
    {task.error && <ErrorBox message={task.error} />}
    {task.result && <Result result={task.result} onDownload={() => downloadBlob(task.result.blob, task.result.name)} onReset={onReset} />}
  </>
);

// ------------------------------------------------------------ Cuenta de cobro
export function CuentaCobroTool({ tool }) {
  const [d, setD] = useSaved("pliego.cuenta", { ciudad: "Santa Marta", fecha: today(), numero: "001", tipoCuenta: "cuenta de ahorros", noIva: true });
  const task = useDocTask(tool.id);
  const set = (k) => (v) => setD({ ...d, [k]: v });
  const valor = Number(String(d.valor || "").replace(/[^\d]/g, ""));
  return (
    <div className="tool-layout">
      <div className="stack">
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>Tus datos</h2><span className="small muted">Se guardan en este dispositivo</span></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <Input label="Tu nombre completo" value={d.nombre} onChange={set("nombre")} placeholder="Roycer Cervantes" />
            <Input label="Tu cédula" value={d.cedula} onChange={set("cedula")} placeholder="1.234.567.890" />
            <Input label="Teléfono" value={d.telefono} onChange={set("telefono")} />
            <Input label="Correo" value={d.correo} onChange={set("correo")} />
          </div>
        </section>
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>A quién le cobras</h2></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <Input label="Empresa o persona" value={d.cliente} onChange={set("cliente")} placeholder="Restaurante El Puerto S.A.S." />
            <Input label="NIT o cédula" value={d.clienteId} onChange={set("clienteId")} placeholder="900.123.456-7" />
          </div>
          <Input label="Concepto" area value={d.concepto} onChange={set("concepto")} placeholder="Diseño y desarrollo de la página web del restaurante, según lo acordado." />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <Input label="Valor (pesos)" value={d.valor} onChange={set("valor")} placeholder="1500000" help={valor ? `${pesos(valor)} · ${pesosEnLetras(valor)}` : ""} />
            <Input label="Número" value={d.numero} onChange={set("numero")} />
            <Input label="Ciudad" value={d.ciudad} onChange={set("ciudad")} />
            <Input label="Fecha" type="date" value={d.fecha} onChange={set("fecha")} />
          </div>
        </section>
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>Cómo te pagan (opcional)</h2></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <Input label="Banco" value={d.banco} onChange={set("banco")} placeholder="Bancolombia" />
            <Field field={{ type: "select", label: "Tipo de cuenta", options: [{ value: "cuenta de ahorros", label: "Ahorros" }, { value: "cuenta corriente", label: "Corriente" }, { value: "billetera digital", label: "Nequi o Daviplata" }] }} value={d.tipoCuenta} onChange={set("tipoCuenta")} />
            <Input label="Número de cuenta o celular" value={d.cuenta} onChange={set("cuenta")} />
          </div>
        </section>
        <Out task={task} onReset={task.reset} />
      </div>
      <aside className="panel">
        <h2 style={{ fontSize: 17 }}>Opciones</h2>
        <Field field={{ type: "check", label: "Incluir nota de no responsable de IVA" }} value={d.noIva} onChange={set("noIva")} />
        <Firma data={d} set={setD} />
        <button className="btn btn-primary btn-lg" disabled={task.busy} onClick={() => task.run(() => cuentaDeCobro(d))}>
          {task.busy ? "Creando…" : "Crear cuenta de cobro"} <Icon name="IconArrowUpRight" size={18} />
        </button>
        <p className="small faint">Revisa con tu contador si debes facturar electrónicamente según tus ingresos.</p>
        <EngineNote engine="navegador" />
      </aside>
    </div>
  );
}

// ------------------------------------------------------------ Derecho de petición
export function PeticionTool({ tool }) {
  const [d, setD] = useSaved("pliego.peticion", { ciudad: "Santa Marta", fecha: today() });
  const task = useDocTask(tool.id);
  const set = (k) => (v) => setD({ ...d, [k]: v });
  return (
    <div className="tool-layout">
      <div className="stack">
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>A quién va dirigido</h2></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <Input label="Entidad o empresa" value={d.entidad} onChange={set("entidad")} placeholder="EPS, alcaldía, universidad, empresa de servicios…" />
            <Input label="Dependencia (opcional)" value={d.dependencia} onChange={set("dependencia")} placeholder="Oficina de atención al usuario" />
            <Input label="Ciudad de la entidad" value={d.ciudadEntidad} onChange={set("ciudadEntidad")} />
            <Input label="Asunto corto" value={d.asunto} onChange={set("asunto")} placeholder="Solicitud de autorización de cita" />
          </div>
        </section>
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>Qué pasó y qué pides</h2></div>
          <Input label="Hechos (uno por línea)" area value={d.hechos} onChange={set("hechos")} placeholder={"El 3 de noviembre solicité…\nA la fecha no he recibido respuesta…"} />
          <Input label="Peticiones (una por línea)" area value={d.peticiones} onChange={set("peticiones")} placeholder={"Que se autorice…\nQue se me informe por escrito…"} />
        </section>
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>Tus datos</h2><span className="small muted">Se guardan en este dispositivo</span></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Input label="Nombre completo" value={d.nombre} onChange={set("nombre")} />
            <Input label="Cédula" value={d.cedula} onChange={set("cedula")} />
            <Input label="Dirección" value={d.direccion} onChange={set("direccion")} />
            <Input label="Correo" value={d.correo} onChange={set("correo")} />
            <Input label="Teléfono" value={d.telefono} onChange={set("telefono")} />
            <Input label="Ciudad" value={d.ciudad} onChange={set("ciudad")} />
            <Input label="Fecha" type="date" value={d.fecha} onChange={set("fecha")} />
          </div>
        </section>
        <Out task={task} onReset={task.reset} />
      </div>
      <aside className="panel">
        <h2 style={{ fontSize: 17 }}>Opciones</h2>
        <p className="small muted">El documento cita el artículo 23 de la Constitución y la Ley 1755 de 2015, que obligan a la entidad a responderte dentro de los plazos legales.</p>
        <Firma data={d} set={setD} />
        <button className="btn btn-primary btn-lg" disabled={task.busy} onClick={() => task.run(() => derechoDePeticion(d))}>
          {task.busy ? "Creando…" : "Crear derecho de petición"} <Icon name="IconArrowUpRight" size={18} />
        </button>
        <p className="small faint">Es una plantilla de referencia; no reemplaza la asesoría de un abogado.</p>
        <EngineNote engine="navegador" />
      </aside>
    </div>
  );
}

// ------------------------------------------------------------ Liquidación
export function LiquidacionTool({ tool }) {
  const year = new Date().getFullYear();
  const [d, setD] = useState({ salario: String(SMLMV_2026), inicio: `${year}-01-01`, fin: today(), vacTomadas: "0", diasSalarioPendiente: "0", ultimoCesantias: "", ultimaPrima: "", auxilioManual: null });
  const task = useDocTask(tool.id);
  const set = (k) => (v) => setD({ ...d, [k]: v });
  const salario = Number(String(d.salario).replace(/[^\d]/g, "")) || 0;
  const auxAuto = salario > 0 && salario <= 2 * SMLMV_2026;
  const auxilio = d.auxilioManual ?? auxAuto;
  const valid = salario > 0 && d.inicio && d.fin && d.fin >= d.inicio;
  const res = useMemo(() => (valid ? calcLiquidacion({ ...d, salario, auxilio }) : null), [d, salario, auxilio, valid]);

  return (
    <div className="tool-layout">
      <div className="stack">
        <section className="card form-fields">
          <div className="card-head" style={{ marginBottom: 0 }}><h2>Datos del contrato</h2></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Input label="Salario mensual (pesos)" value={d.salario} onChange={set("salario")} help={salario ? pesos(salario) : ""} />
            <Input label="Fecha de inicio" type="date" value={d.inicio} onChange={set("inicio")} />
            <Input label="Fecha de terminación" type="date" value={d.fin} onChange={set("fin")} />
            <Input label="Días de vacaciones ya disfrutados" type="number" value={d.vacTomadas} onChange={set("vacTomadas")} />
            <Input label="Días de salario sin pagar" type="number" value={d.diasSalarioPendiente} onChange={set("diasSalarioPendiente")} help="Días trabajados del último mes que aún no te pagan." />
          </div>
          <details>
            <summary className="small muted" style={{ cursor: "pointer" }}>Opciones avanzadas</summary>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 12 }}>
              <Input label="Cesantías pagadas hasta" type="date" value={d.ultimoCesantias} onChange={set("ultimoCesantias")} help="Si lo dejas vacío, se cuenta desde el 1 de enero." />
              <Input label="Prima pagada hasta" type="date" value={d.ultimaPrima} onChange={set("ultimaPrima")} help="Si lo dejas vacío, se cuenta desde el inicio del semestre." />
            </div>
          </details>
          <Field field={{ type: "check", label: `Incluir auxilio de transporte (${pesos(AUX_TRANSPORTE_2026)}) ${auxAuto ? "· aplica porque ganas hasta 2 mínimos" : "· no aplica porque ganas más de 2 mínimos"}` }} value={auxilio} onChange={(v) => setD({ ...d, auxilioManual: v })} />
        </section>
        {!valid && <div className="alert">Escribe el salario y revisa que la fecha de terminación sea después de la de inicio.</div>}
        {res && (
          <section className="card">
            <div className="card-head"><h2>Tu liquidación estimada</h2><span className="small muted">{res.diasTotal} días trabajados</span></div>
            <div className="files">
              {res.items.map((it) => (
                <div key={it.k} className="file-row" style={{ flexWrap: "wrap" }}>
                  <span className="name">{it.k}</span>
                  <strong>{pesos(it.v)}</strong>
                  <span className="small faint" style={{ flexBasis: "100%" }}>{it.f}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
              <span className="muted">Total estimado</span>
              <span className="stat-value">{pesos(res.total)}</span>
            </div>
          </section>
        )}
        <Out task={task} onReset={task.reset} />
      </div>
      <aside className="panel">
        <h2 style={{ fontSize: 17 }}>Cómo se calcula</h2>
        <p className="small muted">Se usan las fórmulas del Código Sustantivo del Trabajo con año de 360 días y los valores de 2026: salario mínimo {pesos(SMLMV_2026)} y auxilio de transporte {pesos(AUX_TRANSPORTE_2026)}.</p>
        <p className="small muted">El auxilio de transporte suma para cesantías y prima, pero no para vacaciones.</p>
        <button className="btn btn-primary btn-lg" disabled={!res || task.busy} onClick={() => task.run(() => liquidacionPdf({ ...d, salario }, res))}>
          Descargar en PDF <Icon name="IconDownload" size={18} />
        </button>
        <p className="small faint">Es un estimado de referencia. No incluye indemnizaciones ni deducciones y no reemplaza la asesoría de un abogado o contador.</p>
        <EngineNote engine="navegador" />
      </aside>
    </div>
  );
}

export const DOC_TOOLS = {
  "cuenta-de-cobro": CuentaCobroTool,
  "derecho-de-peticion": PeticionTool,
  liquidacion: LiquidacionTool,
};
