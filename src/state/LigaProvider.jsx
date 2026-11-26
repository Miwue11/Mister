// Estado compartido de la liga: se suscribe una vez a Firestore y lo reparte por contexto.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_RATIO, MEMBERS } from "../config/constants.js";
import { watchSession } from "../services/session.js";
import { watchCollection, watchDoc } from "../services/store.js";

const LigaContext = createContext(null);
const LOAD_TIMEOUT_MS = 10000;

function useSession() {
  const [uid, setUid] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => watchSession(setUid, setError), []);
  return { uid, error };
}

function useLigaData(uid) {
  const [data, setData] = useState({
    players: [], ops: [], members: {}, ratio: DEFAULT_RATIO, mister: null, mapa: {}
  });
  const [loaded, setLoaded] = useState({ players: false, ops: false, members: false });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!uid) return;
    const set = key => value => setData(d => ({ ...d, [key]: value }));
    const done = key => setLoaded(l => (l[key] ? l : { ...l, [key]: true }));
    const fail = e => setStatus(e?.code === "permission-denied"
      ? "Firestore rechaza la lectura: revisa las reglas."
      : "Se perdió la conexión con los datos. Recarga la página.");
    const timer = setTimeout(() => setStatus("Los datos tardan en llegar; puede que lo que ves no esté al día."), LOAD_TIMEOUT_MS);

    const subs = [
      watchCollection("jugadores", v => { set("players")(v); done("players"); }, fail),
      watchCollection("operaciones", v => { set("ops")(v); done("ops"); }, fail, { order: { field: "creado", dir: "desc" }, max: 400 }),
      watchCollection("miembros", v => { set("members")(Object.fromEntries(v.map(({ id, ...m }) => [id, m]))); done("members"); }, fail),
      watchDoc("liga/config", v => set("ratio")(+v?.ratio > 0 ? +v.ratio : DEFAULT_RATIO), () => {}),
      watchDoc("mister/estado", set("mister"), () => {}),
      watchDoc("mister/mapa", v => set("mapa")(v?.mapa || {}), () => {})
    ];
    return () => { clearTimeout(timer); subs.forEach(u => u()); };
  }, [uid]);

  const ready = loaded.players && loaded.ops && loaded.members;
  useEffect(() => { if (ready) setStatus(""); }, [ready]);
  return { ...data, ready, status };
}

export function LigaProvider({ children }) {
  const session = useSession();
  const data = useLigaData(session.uid);

  const value = useMemo(() => {
    const me = MEMBERS.find(m => session.uid && data.members[m]?.uid === session.uid) || null;
    const pending = data.ops.filter(o => o.estado === "pendiente");
    const status = session.error ? "No se pudo conectar con Firebase." : data.status;
    return { ...data, status, uid: session.uid, me, canWrite: !!session.uid, pending };
  }, [data, session]);

  return <LigaContext.Provider value={value}>{children}</LigaContext.Provider>;
}

export const useLiga = () => useContext(LigaContext);
