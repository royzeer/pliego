import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { AdSlot } from "../components/Parts";
import { TRAMITES, TOOLS, getTool } from "../data/tools";
import { ToolTile } from "./Tools";

export default function Tramites() {
  useEffect(() => { document.title = "Documentos listos para trámites en Colombia — Pliego"; }, []);
  const exclusive = TOOLS.filter((t) => t.cat === "tramites");
  return (
    <>
      <TopBar title="Trámites" subtitle="Elige qué vas a hacer y Pliego deja tu documento como lo piden" />
      <section className="card card-invert">
        <div className="card-head"><h2>Rutas rápidas</h2></div>
        <div className="tiles">
          {TRAMITES.map((t) => {
            const tool = getTool(t.tool);
            return (
              <Link key={t.id} to={`/herramientas/${t.tool}`} className="tile" style={{ background: "#e4e3df", color: "#0e0e0f" }}>
                <div className="tile-top"><Icon name={tool.icon} size={22} /><span className="badge" style={{ borderColor: "#bdbdbd", color: "#5e5e62" }}>{t.tag}</span></div>
                <div>
                  <div className="tile-name">{t.name}</div>
                  <div className="tile-desc" style={{ color: "#5e5e62" }}>{t.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="card">
        <div className="card-head"><h2>Herramientas para trámites</h2></div>
        <div className="tiles">{exclusive.map((t) => <ToolTile key={t.id} tool={t} />)}</div>
      </section>
      <section className="guide">
        <div className="card">
          <h2>Antes de subir un documento a cualquier plataforma</h2>
          <ol>
            <li>Revisa el peso máximo que pide la plataforma (casi siempre aparece junto al botón de subir).</li>
            <li>Si te piden un solo archivo, une todo con el Paquete de documentos.</li>
            <li>Pásalo por el Revisor: detecta contraseñas, páginas giradas y páginas en blanco.</li>
            <li>Ponle un nombre claro, por ejemplo Apellido_Nombre_Documento.pdf.</li>
          </ol>
          <p className="small faint" style={{ marginTop: 14 }}>Pliego no es una página oficial ni está vinculada a ninguna entidad del Estado. Verifica siempre los requisitos en la página de cada entidad.</p>
        </div>
        <AdSlot />
      </section>
    </>
  );
}
