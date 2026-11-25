// Estadísticas guardadas solo en este navegador (no salen del dispositivo).
const KEY = "pliego.stats.v1";
const RECENT = "pliego.recent.v1";

const read = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
};
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* modo privado */ } };

export const getStats = () => read(KEY, { files: 0, savedBytes: 0, tasks: 0, lastIn: 0, lastOut: 0, today: "", todayTasks: 0 });

export function recordTask({ toolId, files, inBytes, outBytes }) {
  const s = getStats();
  const today = new Date().toISOString().slice(0, 10);
  s.files += files;
  s.tasks += 1;
  s.todayTasks = s.today === today ? s.todayTasks + 1 : 1;
  s.today = today;
  if (outBytes && inBytes && outBytes < inBytes) s.savedBytes += inBytes - outBytes;
  if (/comprimir/.test(toolId)) { s.lastIn = inBytes; s.lastOut = outBytes; }
  write(KEY, s);
  const recent = read(RECENT, []).filter((r) => r !== toolId);
  write(RECENT, [toolId, ...recent].slice(0, 6));
}

export const getRecent = () => read(RECENT, []);

export const getTheme = () => read("pliego.theme", "dark");
export const setTheme = (t) => write("pliego.theme", t);
