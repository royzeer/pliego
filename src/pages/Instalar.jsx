import { useEffect, useState } from "react";
import { TopBar } from "../components/Layout";
import Icon from "../components/Icon";
import { PAGES } from "../data/site";
import { useInstall, detectPlatform, isStandalone } from "../components/Install";

const GUIDES = {
  android: {
    label: "Android",
    icon: "IconBrandAndroid",
    steps: [
      "Abre pliego.lat en Google Chrome.",
      "Toca el menú de tres puntos (⋮) arriba a la derecha.",
      "Toca Instalar aplicación o Agregar a la pantalla principal.",
      "Confirma con Instalar. Pliego aparece con su ícono junto a tus otras apps.",
    ],
    note: "En Samsung Internet: toca el menú (☰) y luego Agregar página a, Pantalla de inicio.",
  },
  ios: {
    label: "iPhone y iPad",
    icon: "IconBrandApple",
    steps: [
      "Abre pliego.lat en Safari.",
      "Toca el botón de tres puntos (…) junto a la barra de direcciones y luego Compartir. En versiones anteriores a iOS 26, toca directamente el botón Compartir (el cuadrado con la flecha hacia arriba).",
      "Baja en la lista y toca Agregar a pantalla de inicio. Si no aparece, toca Editar acciones y actívalo.",
      "Deja activado Abrir como app web y toca Agregar.",
    ],
    note: "En iPhone la instalación se hace desde Safari.",
  },
  desktop: {
    label: "Computador",
    icon: "IconDeviceDesktop",
    steps: [
      "Abre pliego.lat en Chrome o Edge.",
      "En la barra de direcciones, a la derecha, haz clic en el ícono de instalar (una pantalla con una flecha).",
      "Si no lo ves, abre el menú (⋮ o …) y busca Instalar Pliego o Aplicaciones, Instalar este sitio como aplicación.",
      "Confirma con Instalar. Pliego se abre en su propia ventana.",
    ],
  },
};

export default function Instalar() {
  const page = PAGES.find((p) => p.path === "/instalar");
  const { canPrompt, install } = useInstall();
  const [tab, setTab] = useState("android");
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    document.title = page.title;
    setTab(detectPlatform());
    setInstalled(isStandalone());
  }, [page]);
  const g = GUIDES[tab];

  return (
    <>
      <TopBar title={page.h1} subtitle="Se abre como app, en pantalla completa y funciona sin internet" />
      {installed && <div className="alert">Ya estás usando Pliego como app.</div>}
      {canPrompt && !installed && (
        <section className="card card-invert" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <img src="/icon-192.png" alt="" width="52" height="52" style={{ borderRadius: 14 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 18 }}>Tu navegador permite instalar Pliego con un clic</h2>
            <p className="small" style={{ opacity: 0.7 }}>No ocupa casi espacio y se actualiza solo.</p>
          </div>
          <button className="btn btn-lg" style={{ background: "var(--invert-text)", color: "var(--invert-bg)" }} onClick={install}>Instalar Pliego</button>
        </section>
      )}
      <div className="chips">
        {Object.entries(GUIDES).map(([id, x]) => (
          <button key={id} className={`chip ${tab === id ? "active" : ""}`} onClick={() => setTab(id)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name={x.icon} size={16} /> {x.label}
          </button>
        ))}
      </div>
      <section className="card doc" style={{ maxWidth: 860 }}>
        <h2>Instalar en {g.label}</h2>
        <ol className="install-steps">
          {g.steps.map((s, i) => <li key={i}><span className="step-n">{i + 1}</span><p>{s}</p></li>)}
        </ol>
        {g.note && <p className="small">{g.note}</p>}
      </section>
      <section className="card doc" style={{ maxWidth: 860 }}>
        <h2>¿Por qué instalarla?</h2>
        <p>Pliego queda con su ícono en tu pantalla de inicio, se abre sin la barra del navegador y las herramientas siguen funcionando aunque te quedes sin internet, porque tus archivos se procesan en tu propio dispositivo. No ocupa casi espacio, no pide permisos y se actualiza sola.</p>
        <p>Para quitarla, mantén presionado el ícono y elige Desinstalar o Eliminar, como cualquier otra app.</p>
      </section>
    </>
  );
}
