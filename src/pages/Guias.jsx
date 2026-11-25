import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { CATEGORIES, getTool } from "../data/tools";
import { ARTICLES, getArticle } from "../data/articles";
import NotFound from "./NotFound";

const UPDATED = "noviembre de 2026";

function GuideCard({ a }) {
  const tool = getTool(a.tool);
  return (
    <Link to={`/guias/${a.slug}`} className="tile guide-tile">
      <div className="tile-top">
        <Icon name={tool?.icon || "IconBook"} size={22} />
        <Icon name="IconArrowUpRight" size={18} />
      </div>
      <div>
        <div className="tile-name">{a.title}</div>
        <div className="tile-desc">{a.description}</div>
      </div>
    </Link>
  );
}

export function GuiasIndex() {
  useEffect(() => { document.title = "Guías para tus documentos y trámites — Pliego"; }, []);
  const groups = CATEGORIES.filter((c) => c.id !== "todas")
    .map((c) => ({ ...c, items: ARTICLES.filter((a) => getTool(a.tool)?.cat === c.id) }))
    .filter((g) => g.items.length);
  return (
    <>
      <TopBar title="Guías" subtitle={`${ARTICLES.length} guías paso a paso para tus documentos y trámites`} />
      {groups.map((g) => (
        <section key={g.id} className="card">
          <div className="card-head"><h2>{g.name}</h2><span className="small muted">{g.items.length} guías</span></div>
          <div className="tiles guide-tiles">{g.items.map((a) => <GuideCard key={a.slug} a={a} />)}</div>
        </section>
      ))}
    </>
  );
}

const List = ({ items, ordered }) => {
  const Tag = ordered ? "ol" : "ul";
  return <Tag>{items.map((x) => <li key={x}>{x}</li>)}</Tag>;
};

export function GuiaPage() {
  const { slug } = useParams();
  const a = getArticle(slug);
  const tool = a && getTool(a.tool);
  useEffect(() => { if (a) document.title = `${a.title} — Pliego`; }, [a]);
  if (!a || !tool) return <NotFound />;
  const related = ARTICLES.filter((x) => x.slug !== a.slug && getTool(x.tool)?.cat === tool.cat).slice(0, 4);
  const cta = (
    <div className="guide-cta">
      <div>
        <strong>{tool.name}</strong>
        <span className="muted small"> · gratis, sin registro y sin límite de usos</span>
      </div>
      <Link to={`/herramientas/${tool.id}`} className="btn btn-primary"><Icon name={tool.icon} size={18} /> Abrir {tool.name}</Link>
    </div>
  );
  return (
    <>
      <div className="tool-header">
        <Link to="/guias" className="icon-btn" aria-label="Volver a guías"><Icon name="IconArrowLeft" size={18} /></Link>
        <TopBar title={a.title} subtitle={`Guía actualizada en ${UPDATED}`} />
      </div>
      <article className="card doc guide-article">
        {a.intro.map((p) => <p key={p}>{p}</p>)}
        {cta}
        <h2>Cuándo te sirve</h2>
        <List items={a.when} />
        <h2>Paso a paso</h2>
        <List items={a.steps} ordered />
        {(a.sections || []).map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {(s.p || []).map((p) => <p key={p}>{p}</p>)}
            {s.list && <List items={s.list} />}
          </section>
        ))}
        <h2>Consejos</h2>
        <List items={a.tips} />
        {a.faqs?.length > 0 && (
          <>
            <h2>Preguntas frecuentes</h2>
            <div className="faq">
              {a.faqs.map(([q, r]) => <details key={q}><summary>{q}</summary><p>{r}</p></details>)}
            </div>
          </>
        )}
        {cta}
      </article>
      {related.length > 0 && (
        <section className="card">
          <div className="card-head"><h2>Otras guías</h2><Link to="/guias" className="small muted">Ver todas</Link></div>
          <div className="tiles guide-tiles">{related.map((x) => <GuideCard key={x.slug} a={x} />)}</div>
        </section>
      )}
    </>
  );
}
