import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import Dropzone from "../components/Dropzone";
import { TopBar } from "../components/Layout";
import { TOOLS, TRAMITES, getTool } from "../data/tools";
import { getStats, getRecent } from "../lib/stats";
import { formatSize, isPdf } from "../lib/files";

const SUGGEST_PDF = ["comprimir-a-peso", "unir-pdf", "ordenar-pdf", "revisor", "proteger-pdf", "pdf-a-jpg"];
const SUGGEST_IMG = ["jpg-a-pdf", "cedula-ambas-caras", "paquete-documentos"];

function Ring({ value }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${value}% menos peso`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
      {value > 0 && <circle cx="42" cy="42" r={r} fill="none" stroke="var(--text)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} transform="rotate(-90 42 42)" />}
      <text x="42" y="47" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--text)">{value}%</text>
    </svg>
  );
}

export default function Home() {
  const stats = useMemo(getStats, []);
  const recent = useMemo(() => getRecent().map(getTool).filter(Boolean), []);
  const [dropped, setDropped] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = stats.today === today ? stats.todayTasks : 0;
  const saved = stats.lastIn ? Math.round((1 - stats.lastOut / stats.lastIn) * 100) : 0;
  const suggestions = dropped ? (isPdf(dropped) ? SUGGEST_PDF : SUGGEST_IMG).map(getTool) : [];
  const tags = ["Todos", ...new Set(TRAMITES.map((t) => t.tag).filter((t) => t !== "Todos"))];
  const tramites = TRAMITES.filter((t) => filter === "Todos" || t.tag === filter || t.tag === "Todos").slice(0, 3);

  return (
    <>
      <TopBar title="Hola" subtitle="¿Qué documento arreglamos hoy?" />

      <div className="grid grid-hero">
        <section className="card">
          <div className="card-head"><h2>Tu actividad</h2><span className="small muted">En este dispositivo</span></div>
          <div className="stats">
            <div>
              <div className="muted small">Archivos procesados</div>
              <div className="stat-value">{stats.files}</div>
              <div className="stat-row"><span>Tareas hoy</span><span>{todayTasks}</span></div>
            </div>
            <div>
              <div className="muted small">Peso ahorrado</div>
              <div className="stat-value">{formatSize(stats.savedBytes)}</div>
              <div className="stat-row"><span>Total de tareas</span><span>{stats.tasks}</span></div>
            </div>
            <div>
              <div className="muted small">Herramientas listas</div>
              <div className="stat-value">{TOOLS.filter((t) => t.status === "listo").length}</div>
              <div className="stat-row"><span>En total</span><span>{TOOLS.length}</span></div>
            </div>
          </div>
          {recent.length > 0 && (
            <>
              <div className="section-title" style={{ marginTop: 20 }}>Usadas hace poco</div>
              <div className="chips">
                {recent.map((t) => <Link key={t.id} to={`/herramientas/${t.id}`} className="chip" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name={t.icon} size={15} />{t.name}</Link>)}
              </div>
            </>
          )}
        </section>

        <section className="card card-invert" style={{ padding: 14 }}>
          {!dropped ? (
            <Dropzone variant="invert" accept="any" onFiles={([f]) => setDropped(f)} title="Suelta tu archivo" hint="Pliego te sugiere qué hacer con él">
              <span className="privacy" style={{ color: "#5e5e62" }}><Icon name="IconShieldLock" size={14} /> Se procesa en tu dispositivo</span>
            </Dropzone>
          ) : (
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dropped.name}</strong>
                <button className="icon-btn" style={{ color: "inherit", borderColor: "#cfcfcf" }} onClick={() => setDropped(null)} aria-label="Quitar"><Icon name="IconX" size={16} /></button>
              </div>
              <span className="small" style={{ color: "#5e5e62" }}>{formatSize(dropped.size)} · ¿Qué quieres hacer?</span>
              {suggestions.map((t) => (
                <button key={t.id} className="btn" style={{ justifyContent: "flex-start", borderColor: "#cfcfcf" }} onClick={() => navigate(`/herramientas/${t.id}`)}>
                  <Icon name={t.icon} size={18} /> {t.name}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-row2">
        <div className="stack">
          <section className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 17 }}>Última compresión</h2>
              <p className="small muted">{stats.lastIn ? `${formatSize(stats.lastIn)} → ${formatSize(stats.lastOut)}` : "Aún no has comprimido nada"}</p>
            </div>
            <Ring value={Math.max(0, saved)} />
          </section>
          <section className="card">
            <div className="card-head" style={{ marginBottom: 10 }}><h2>Plan gratis</h2><span className="small muted">Usos ilimitados</span></div>
            <div className="bar"><div style={{ width: "100%" }} /></div>
            <p className="small muted" style={{ marginTop: 10 }}>Sin límite de usos. Solo hay límite por archivo. <Link to="/planes" style={{ textDecoration: "underline" }}>Ver planes</Link></p>
          </section>
        </div>

        <section className="card">
          <div className="card-head"><h2>Trámites rápidos</h2><Link to="/tramites" className="small muted">Ver todos</Link></div>
          <div className="chips" style={{ marginBottom: 14 }}>
            {tags.map((t) => <button key={t} className={`chip ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>)}
          </div>
          <div className="tiles" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
            {tramites.map((t, i) => {
              const tool = getTool(t.tool);
              return (
                <Link key={t.id} to={`/herramientas/${t.tool}`} className={`tile ${i === 0 ? "invert" : ""}`}>
                  <div className="tile-top"><Icon name={tool.icon} size={22} /><Icon name="IconArrowUpRight" size={18} /></div>
                  <div className="tile-name">{t.name}</div>
                </Link>
              );
            })}
            <Link to="/herramientas" className="tile dashed"><Icon name="IconPlus" size={22} /><span className="small">Todas las herramientas</span></Link>
          </div>
        </section>
      </div>
    </>
  );
}
