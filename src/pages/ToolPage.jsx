import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { TopBar } from "../components/Layout";
import { Guide, EngineNote } from "../components/Parts";
import { getTool } from "../data/tools";
import { REGISTRY } from "../tools/registry";
import { CUSTOM as BASE_CUSTOM } from "../tools/CustomTools";
import { EDIT_TOOLS } from "../tools/EditTools";
import { DOC_TOOLS } from "../tools/DocTools";
import { AI_TOOLS } from "../tools/AiTools";

const CUSTOM = { ...BASE_CUSTOM, ...EDIT_TOOLS, ...DOC_TOOLS, ...AI_TOOLS };
import GenericTool from "../tools/GenericTool";
import NotFound from "./NotFound";

function ComingSoon({ tool }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, padding: 48 }}>
      <div className="drop-icon" style={{ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--surface-2)" }}>
        <Icon name={tool.icon} size={28} />
      </div>
      <h2 style={{ fontSize: 22 }}>{tool.name} llega pronto</h2>
      <p className="muted" style={{ maxWidth: 460 }}>
        Estamos terminando esta herramienta. {tool.limitFree ? `Cuando salga, el plan gratis permitirá ${tool.limitFree}, sin límite de usos.` : "Será gratis y sin límite de usos."}
      </p>
      <EngineNote engine={tool.engine} />
      <Link to="/herramientas" className="btn btn-primary" style={{ marginTop: 8 }}>Ver herramientas disponibles</Link>
    </div>
  );
}

export default function ToolPage() {
  const { id } = useParams();
  const tool = getTool(id);
  useEffect(() => {
    if (tool) document.title = `${tool.name} gratis y sin límite — Pliego`;
  }, [tool]);
  if (!tool) return <NotFound />;
  const Custom = CUSTOM[id];
  const config = REGISTRY[id];
  const ready = tool.status === "listo" && (Custom || config);

  return (
    <>
      <div className="tool-header">
        <Link to="/herramientas" className="icon-btn" aria-label="Volver a herramientas"><Icon name="IconArrowLeft" size={18} /></Link>
        <TopBar title={tool.name} subtitle={tool.desc} />
      </div>
      {ready ? (Custom ? <Custom tool={tool} /> : <GenericTool key={id} tool={tool} config={config} />) : <ComingSoon tool={tool} />}
      <Guide tool={tool} />
    </>
  );
}
