import { Card } from "../../components/Card.jsx";
import { displayName, formatWhen } from "../../lib/format.js";
import { OperationText } from "../pendientes/OperationText.jsx";

const MAX_SHOWN = 80;

export function MovementList({ done }) {
  return (
    <Card title="Movimientos">
      {!done.length && <div className="sub">Aún no hay movimientos.</div>}
      {done.slice(0, MAX_SHOWN).map(o => (
        <div className="pl" key={o.id}>
          <div className="row">
            <span className={`tag ${o.estado === "validada" ? "v" : ""}`}>{o.estado}</span>
            <span className="sub">{formatWhen(o.resuelto)}{o.validador ? ` · ${displayName(o.validador)}` : ""}</span>
          </div>
          <OperationText op={o} />
        </div>
      ))}
    </Card>
  );
}
