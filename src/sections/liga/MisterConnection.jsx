// Estado de la lectura automática de Mister y relación de mánagers.
import { Card } from "../../components/Card.jsx";
import { MEMBERS } from "../../config/constants.js";
import { isAdmin } from "../../lib/clauses.js";
import { displayName, formatMoney, formatWhen } from "../../lib/format.js";
import { saveManagerMap } from "../../services/settings.js";
import { useAction } from "../../hooks/useAction.js";
import { useLiga } from "../../state/LigaProvider.jsx";

function SyncStatus({ st }) {
  if (!st) return <div className="sub">Todavía no está conectada. Se configura una vez desde GitHub.</div>;
  if (st.ok) {
    return (
      <div className="sub">
        Última lectura: {formatWhen(st.fecha)} · {formatMoney(st.jugadores)} jugadores con dueño
        {st.sinDueno ? ` · ${formatMoney(st.sinDueno)} de mánagers sin asignar` : ""}.
        {st.caduca ? ` La sesión de Mister caduca el ${formatWhen(st.caduca)}.` : ""}
      </div>
    );
  }
  return (
    <div className="sub err">
      No se puede leer Mister desde {formatWhen(st.fecha)}: {st.error}.{" "}
      {/SESION/.test(st.error || "") && "Hay que renovar la cookie de Mister en GitHub. "}
      Última lectura buena: {st.ultimaOk ? formatWhen(st.ultimaOk) : "nunca"}.
    </div>
  );
}

function ManagerRow({ manager, editable }) {
  const { mapa } = useLiga();
  const { run } = useAction();
  const assigned = mapa[manager.id];
  const change = e => run(() => saveManagerMap(mapa, manager.id, e.target.value), "Guardado. Se aplica en la próxima lectura de Mister");
  return (
    <div className="pl row">
      <div>{manager.name}</div>
      {editable
        ? <select className="auto" value={assigned || ""} onChange={change}>
            <option value="">Sin asignar</option>
            {MEMBERS.map(n => <option key={n} value={n}>{displayName(n)}</option>)}
          </select>
        : <span className="sub">{assigned ? displayName(assigned) : "sin asignar"}</span>}
    </div>
  );
}

export function MisterConnection() {
  const { mister, me, canWrite } = useLiga();
  const managers = mister?.managers || [];
  const editable = canWrite && isAdmin(me);
  return (
    <Card title="Conexión con Mister">
      <SyncStatus st={mister} />
      {managers.length > 0 && <label>Quién es quién en Mister</label>}
      {managers.map(m => <ManagerRow key={m.id} manager={m} editable={editable} />)}
    </Card>
  );
}
