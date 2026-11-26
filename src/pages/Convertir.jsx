import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { AdSlot } from "../components/Parts";
import { pairCopy, parsePairSlug, pairPath, DEDICATED } from "../data/formats";
import { FormatBar, UniversalTool } from "../tools/Universal";
import NotFound from "./NotFound";

export default function Convertir() {
  const { par } = useParams();
  const pair = parsePairSlug(par);
  const copy = pair && pairCopy(...pair);
  useEffect(() => { if (copy) document.title = `${copy.title} — Pliego`; }, [copy]);
  if (!pair) return <NotFound />;
  const [from, to] = pair;
  // Si la combinación tiene su propia herramienta, se usa esa
  if (DEDICATED[`${from}-${to}`]) return <Navigate to={pairPath(from, to)} replace />;
  return (
    <>
      <div className="tool-header">
        <Link to="/herramientas/convertidor" className="icon-btn" aria-label="Volver al convertidor"><Icon name="IconArrowLeft" size={18} /></Link>
        <TopBar title={copy.title.replace(" gratis y sin límite", "")} subtitle="Gratis, sin registro y sin límite de usos" />
      </div>
      <FormatBar from={from} to={to} />
      <UniversalTool key={par} from={from} to={to} />
      <section className="guide">
        <div className="card">
          <h2>Cómo convertir</h2>
          <p className="muted" style={{ marginBottom: 14 }}>{copy.intro}</p>
          <ol>{copy.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <div className="faq" style={{ marginTop: 18 }}>
            {copy.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
        <AdSlot />
      </section>
    </>
  );
}
