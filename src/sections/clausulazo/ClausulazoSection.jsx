// Avisar a los admins de un clausulazo sobre un jugador con cláusula virtual.
import { useState } from "react";
import { Card, Empty } from "../../components/Card.jsx";
import { FundsCheck, useFundsState } from "../../components/FundsCheck.jsx";
import { NeedIdentity } from "../../components/NeedIdentity.jsx";
import { calcClausulazo, effectiveClause, validatorsFor } from "../../lib/clauses.js";
import { displayName, formatMoney } from "../../lib/format.js";
import { requestClausulazo } from "../../services/operations.js";
import { useAction } from "../../hooks/useAction.js";
import { useLiga } from "../../state/LigaProvider.jsx";
import { ClausulazoSteps } from "./ClausulazoSteps.jsx";

const byOwnerThenName = (a, b) => a.dueno.localeCompare(b.dueno) || a.nombre.localeCompare(b.nombre);

function ClausulazoForm({ me, rivals, onDone }) {
  const { pending } = useLiga();
  const [playerId, setPlayerId] = useState(rivals[0].id);
  const [funds, setFunds] = useState({ saldo: "", valor: "" });
  const budget = useFundsState(me, funds, setFunds);
  const { run, busy } = useAction();

  const player = rivals.find(p => p.id === playerId) || rivals[0];
  const calc = calcClausulazo(player, budget);
  const validators = validatorsFor({ solicitante: me, vendedor: player.dueno }).map(displayName).join(" o ");
  const blocked = +player.blindaje > 0;

  const submit = async () => {
    if (await run(() => requestClausulazo({ player, me, calc, pending }), "Aviso enviado a los admins")) onDone();
  };

  return (
    <Card title="Pagar un clausulazo">
      <label htmlFor="cl-player">Jugador rival</label>
      <select id="cl-player" value={player.id} onChange={e => setPlayerId(e.target.value)}>
        {rivals.map(p => <option key={p.id} value={p.id}>{p.nombre} ({displayName(p.dueno)}) · {formatMoney(effectiveClause(p))}</option>)}
      </select>
      <div className="res">
        <div><div className="k">Pagas en Mister</div><div className="n">{formatMoney(calc.real)}</div></div>
        <div><div className="k">Diferencia virtual</div><div className={`n ${calc.difference > 0 ? "cost" : ""}`}>{formatMoney(calc.difference)}</div></div>
      </div>
      {blocked && <div className="note err">Está blindado en Mister: ahora no se puede clausular.</div>}
      <ClausulazoSteps player={player} calc={calc} validators={validators} />
      <FundsCheck idPrefix="cl" funds={funds} setFunds={setFunds} />
      {budget != null && (
        <div className={`note ${calc.affordable ? "" : "err"}`}>Tu puja máxima es {formatMoney(budget)}: {calc.affordable ? "te llega" : "no te llega"}.</div>
      )}
      <div className="btns"><button className="btn ok" disabled={!calc.affordable || blocked || busy} onClick={submit}>Avisar a los admins</button></div>
    </Card>
  );
}

export function ClausulazoSection({ goTo }) {
  const { me, players } = useLiga();
  const rivals = players.filter(p => p.dueno !== me).sort(byOwnerThenName);
  return (
    <NeedIdentity>
      {rivals.length
        ? <ClausulazoForm me={me} rivals={rivals} onDone={() => goTo("pendientes")} />
        : <Empty>No hay jugadores de rivales registrados.</Empty>}
    </NeedIdentity>
  );
}
