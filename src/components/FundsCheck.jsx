// «¿Me llega?»: saldo + 25 % del valor del equipo. Se rellena solo si Mister lo da.
import { useEffect } from "react";
import { maxBid } from "../lib/clauses.js";
import { formatMoney, parseAmount } from "../lib/format.js";
import { useFinance } from "../hooks/useFinance.js";
import { MoneyInput } from "./MoneyInput.jsx";

export function useFundsState(member, funds, setFunds) {
  const fin = useFinance(member);
  useEffect(() => {
    if (!fin || funds.saldo !== "" || funds.valor !== "") return;
    setFunds({
      saldo: fin.saldo != null ? formatMoney(fin.saldo) : "",
      valor: fin.valor != null ? formatMoney(fin.valor) : ""
    });
  }, [fin?.saldo, fin?.valor]); // eslint-disable-line react-hooks/exhaustive-deps
  const filled = funds.saldo !== "" || funds.valor !== "";
  return filled ? maxBid(parseAmount(funds.saldo), parseAmount(funds.valor)) : null;
}

export function FundsCheck({ idPrefix, funds, setFunds }) {
  const set = key => v => setFunds({ ...funds, [key]: v });
  return (
    <details open={funds.saldo !== "" || funds.valor !== ""}>
      <summary>Comprobar si me llega (saldo + 25 % del equipo)</summary>
      <div className="grid2">
        <MoneyInput id={`${idPrefix}-saldo`} label="Saldo actual" value={funds.saldo} onChange={set("saldo")} />
        <MoneyInput id={`${idPrefix}-valor`} label="Valor total del equipo" value={funds.valor} onChange={set("valor")} />
      </div>
    </details>
  );
}
