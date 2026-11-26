// Pedir una subida virtual de la cláusula de un jugador propio.
import { useState } from "react";
import { Card, Empty } from "../../components/Card.jsx";
import { FundsCheck, useFundsState } from "../../components/FundsCheck.jsx";
import { MoneyInput } from "../../components/MoneyInput.jsx";
import { NeedIdentity } from "../../components/NeedIdentity.jsx";
import { Segmented } from "../../components/Segmented.jsx";
import { calcSubida, effectiveClause, validatorsFor } from "../../lib/clauses.js";
import { displayName, formatMoney, formatRatio, parseAmount } from "../../lib/format.js";
import { requestSubida } from "../../services/operations.js";
import { useAction } from "../../hooks/useAction.js";
import { useLiga } from "../../state/LigaProvider.jsx";
import { SubidaResult } from "./SubidaResult.jsx";

const MODES = [{ value: "objetivo", label: "Cláusula objetivo" }, { value: "pago", label: "Lo que pago" }];

function SubidaForm({ me, squad, onDone }) {
  const { ratio, pending } = useLiga();
  const [playerId, setPlayerId] = useState(squad[0].id);
  const [mode, setMode] = useState("objetivo");
  const [amount, setAmount] = useState("");
  const [funds, setFunds] = useState({ saldo: "", valor: "" });
  const budget = useFundsState(me, funds, setFunds);
  const { run, busy } = useAction();

  const player = squad.find(p => p.id === playerId) || squad[0];
  const calc = calcSubida({ player, mode, amount: parseAmount(amount), ratio, budget });
  const validators = validatorsFor({ solicitante: me }).map(displayName).join(" o ");

  const submit = async () => {
    const ok = await run(() => requestSubida({ player, me, calc, pending }), "Enviado. Falta que un admin lo valide");
    if (ok) { setAmount(""); onDone(); }
  };

  return (
    <Card title="Subir cláusula virtual">
      <label htmlFor="sb-player">Jugador</label>
      <select id="sb-player" value={player.id} onChange={e => { setPlayerId(e.target.value); setAmount(""); }}>
        {squad.map(p => <option key={p.id} value={p.id}>{p.nombre} · {formatMoney(effectiveClause(p))}</option>)}
      </select>
      <Segmented options={MODES} value={mode} onChange={m => { setMode(m); setAmount(""); }} />
      <MoneyInput
        id="sb-amount"
        label={mode === "pago" ? "Dinero que quiero invertir" : "Cláusula a la que quiero llegar"}
        value={amount}
        onChange={setAmount}
        placeholder={mode === "pago" ? "500.000" : "3.000.000"}
      />
      <SubidaResult calc={calc} budget={budget} typed={!!parseAmount(amount)} />
      <FundsCheck idPrefix="sb" funds={funds} setFunds={setFunds} />
      <div className="btns"><button className="btn ok" disabled={!calc.valid || busy} onClick={submit}>Pedir validación</button></div>
      <div className="note">Cada 1 € pagado sube {formatRatio(ratio)} € de cláusula, igual que en Mister. Lo valida {validators} después de quitarte el dinero en Mister.</div>
    </Card>
  );
}

export function SubirSection({ goTo }) {
  const { me, players } = useLiga();
  const squad = players.filter(p => p.dueno === me);
  return (
    <NeedIdentity>
      {squad.length
        ? <SubidaForm me={me} squad={squad} onDone={() => goTo("pendientes")} />
        : <Empty>No tienes jugadores registrados.</Empty>}
    </NeedIdentity>
  );
}
