import { useState } from "react";
import { downloadBlob, MB } from "../lib/files";
import { recordTask } from "../lib/stats";
import { PRO_LIMITS } from "../data/tools";
import { getLimits, isPro } from "../lib/pro";

/** Maneja el ciclo de una tarea: validar, procesar, mostrar progreso y resultado. */
export default function useTask(toolId) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [inBytes, setInBytes] = useState(0);

  const run = async (files, fn) => {
    setError("");
    setResult(null);
    const { maxFileMB } = getLimits();
    const tooBig = files.find((f) => f.size > maxFileMB * MB);
    if (tooBig) {
      setError(isPro()
        ? `"${tooBig.name}" pesa más de ${maxFileMB} MB, el máximo por archivo.`
        : `"${tooBig.name}" pesa más de ${maxFileMB} MB, el máximo por archivo del plan gratis. Con Pro puedes subir archivos de hasta ${PRO_LIMITS.maxFileMB} MB.`);
      return;
    }
    const total = files.reduce((a, f) => a + f.size, 0);
    setInBytes(total);
    setBusy(true);
    setProgress("Procesando…");
    try {
      const onProgress = (i, n, text) => setProgress(text || (n ? `Página ${i} de ${n}…` : "Procesando…"));
      const res = await fn(onProgress);
      setResult(res);
      recordTask({ toolId, files: files.length, inBytes: total, outBytes: res?.blob?.size });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Algo salió mal. Intenta de nuevo.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  };

  const download = () => result && downloadBlob(result.blob, result.name);
  const reset = () => { setResult(null); setError(""); };

  return { busy, progress, result, error, setError, inBytes, run, download, reset };
}
