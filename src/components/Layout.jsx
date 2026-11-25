import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { TOOLS } from "../data/tools";
import { getTheme, setTheme } from "../lib/stats";
import { InstallBanner } from "./Install";

const NAV = [
  { to: "/", icon: "IconHome", label: "Inicio", end: true },
  { to: "/herramientas", icon: "IconLayoutGrid", label: "Herramientas" },
  { to: "/tramites", icon: "IconId", label: "Trámites" },
  { to: "/guias", icon: "IconBook", label: "Guías" },
  { to: "/planes", icon: "IconCrown", label: "Planes" },
];

const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function Search() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const results = useMemo(() => {
    const n = normalize(q.trim());
    if (!n) return [];
    return TOOLS.filter((t) => normalize(`${t.name} ${t.desc}`).includes(n)).slice(0, 6);
  }, [q]);

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="search" ref={ref}>
      <Icon name="IconSearch" size={18} />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) { navigate(`/herramientas/${results[0].id}`); setOpen(false); setQ(""); }
        }}
        placeholder="Unir, comprimir, cédula…"
        aria-label="Buscar herramienta"
      />
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((t) => (
            <Link key={t.id} to={`/herramientas/${t.id}`} onClick={() => { setOpen(false); setQ(""); }}>
              <Icon name={t.icon} size={18} /> {t.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopBar({ title, subtitle }) {
  const [theme, setT] = useState(getTheme());
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setTheme(theme);
  }, [theme]);
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <Search />
      <button className="icon-btn" onClick={() => setT(theme === "dark" ? "light" : "dark")} aria-label="Cambiar tema">
        <Icon name={theme === "dark" ? "IconSun" : "IconMoon"} size={18} />
      </button>
      <Link to="/planes" className="btn btn-primary">Pro</Link>
    </header>
  );
}

export default function Layout() {
  useEffect(() => { document.documentElement.dataset.theme = getTheme(); }, []);
  return (
    <div className="shell">
      <div className="app">
        <nav className="rail" aria-label="Navegación principal">
          <Link to="/" className="rail-logo" aria-label="Pliego, inicio">
            <img src="/favicon.svg" width="40" height="40" alt="" />
          </Link>
          <div className="rail-group">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `icon-btn${isActive ? " active" : ""}`} aria-label={n.label} title={n.label}>
                <Icon name={n.icon} size={20} />
              </NavLink>
            ))}
          </div>
          <div className="rail-spacer" />
          <div className="rail-group rail-bottom">
            <span className="icon-btn" title="Tus archivos nunca salen de tu dispositivo" aria-label="Privacidad">
              <Icon name="IconShieldLock" size={20} />
            </span>
          </div>
        </nav>
        <main className="main">
          <InstallBanner />
          <Outlet />
          <footer className="footer">
            <span>© {new Date().getFullYear()} Pliego · Tus archivos se procesan en tu dispositivo</span>
            <nav>
              <Link to="/herramientas">Herramientas</Link>
              <Link to="/guias">Guías</Link>
              <Link to="/instalar">Instalar app</Link>
              <Link to="/acerca">Acerca de</Link>
              <Link to="/contacto">Contacto</Link>
              <Link to="/privacidad">Privacidad</Link>
              <Link to="/terminos">Términos</Link>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  );
}
