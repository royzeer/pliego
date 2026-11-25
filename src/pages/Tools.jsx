import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { CATEGORIES, TOOLS } from "../data/tools";

export function ToolTile({ tool, invert }) {
  return (
    <Link to={`/herramientas/${tool.id}`} className={`tile ${invert ? "invert" : ""}`}>
      <div className="tile-top">
        <Icon name={tool.icon} size={24} />
        {tool.status === "pronto" ? <span className="badge">Pronto</span> : tool.exclusive ? <span className="badge badge-new">Solo en Pliego</span> : <Icon name="IconArrowUpRight" size={18} />}
      </div>
      <div>
        <div className="tile-name">{tool.name}</div>
        <div className="tile-desc">{tool.desc}</div>
      </div>
    </Link>
  );
}

export default function Tools() {
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState(params.get("c") || "todas");
  useEffect(() => { document.title = "Todas las herramientas PDF — Pliego"; }, []);
  const choose = (c) => { setCat(c); setParams(c === "todas" ? {} : { c }); };
  const groups = CATEGORIES.filter((c) => c.id !== "todas" && (cat === "todas" || cat === c.id));

  return (
    <>
      <TopBar title="Herramientas" subtitle={`${TOOLS.length} herramientas, todas sin límite de usos`} />
      <div className="chips">
        {CATEGORIES.map((c) => <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => choose(c.id)}>{c.name}</button>)}
      </div>
      {groups.map((g) => (
        <section key={g.id} className="card">
          <div className="card-head"><h2>{g.name}</h2><span className="small muted">{TOOLS.filter((t) => t.cat === g.id).length} herramientas</span></div>
          <div className="tiles">
            {TOOLS.filter((t) => t.cat === g.id)
              .sort((a, b) => (a.status === b.status ? 0 : a.status === "listo" ? -1 : 1))
              .map((t) => <ToolTile key={t.id} tool={t} />)}
          </div>
        </section>
      ))}
    </>
  );
}
