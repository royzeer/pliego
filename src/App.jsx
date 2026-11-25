import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Tramites from "./pages/Tramites";
import Planes from "./pages/Planes";
import NotFound from "./pages/NotFound";

// Las herramientas cargan las librerías de PDF solo cuando se abren.
const ToolPage = lazy(() => import("./pages/ToolPage"));
const Loading = () => <div className="card muted">Cargando herramienta…</div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/herramientas" element={<Tools />} />
          <Route path="/herramientas/:id" element={<Suspense fallback={<Loading />}><ToolPage /></Suspense>} />
          <Route path="/tramites" element={<Tramites />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
