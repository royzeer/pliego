import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: "center", padding: 60, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.04em" }}>404</div>
      <p className="muted">Esta página no existe o la movimos.</p>
      <Link to="/" className="btn btn-primary">Ir al inicio</Link>
    </div>
  );
}
