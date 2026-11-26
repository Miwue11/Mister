// Plantilla de un miembro: cabecera con su dinero y sus fichas de jugador.
import { useState } from "react";
import { effectiveClause, isAdmin, maxBid } from "../../lib/clauses.js";
import { displayName, formatMoney, plural } from "../../lib/format.js";
import { useFinance } from "../../hooks/useFinance.js";
import { useLiga } from "../../state/LigaProvider.jsx";
import { EditRealClause } from "./EditRealClause.jsx";
import { PlayerCard } from "./player-card/PlayerCard.jsx";

function FinanceLine({ owner }) {
  const fin = useFinance(owner);
  if (!fin) return null;
  const parts = [];
  if (fin.valor != null) parts.push(`Valor del equipo ${formatMoney(fin.valor)}`);
  if (fin.saldo != null) {
    parts.push(`Saldo ${formatMoney(fin.saldo)}${fin.futuro != null ? ` (futuro ${formatMoney(fin.futuro)})` : ""}`);
    parts.push(`Puja máxima ${formatMoney(maxBid(fin.saldo, fin.valor))}`);
  }
  return parts.length ? <div className="sub squad-fin">{parts.join(" · ")}</div> : null;
}

export function OwnerSquad({ owner }) {
  const { players, me, canWrite } = useLiga();
  const [editing, setEditing] = useState(null);
  const squad = players.filter(p => p.dueno === owner).sort((a, b) => effectiveClause(b) - effectiveClause(a));
  const canEdit = canWrite && me && (me === owner || isAdmin(me));

  return (
    <section className="card">
      <div className="row">
        <h2>{displayName(owner)} {isAdmin(owner) && <span className="tag a">admin</span>}</h2>
        <span className="sub">{plural(squad.length, "jugador", "jugadores")}</span>
      </div>
      <FinanceLine owner={owner} />
      {!squad.length && <div className="sub">Sin jugadores registrados.</div>}
      {squad.map(p => {
        const manual = canEdit && !p.misterId;
        const actions = manual && editing !== p.id
          ? <div className="btns"><button className="btn ghost" onClick={() => setEditing(p.id)}>Actualizar Mister</button></div>
          : null;
        return (
          <div key={p.id}>
            <PlayerCard player={p} actions={actions} />
            {manual && editing === p.id && <EditRealClause player={p} onClose={() => setEditing(null)} />}
          </div>
        );
      })}
    </section>
  );
}
