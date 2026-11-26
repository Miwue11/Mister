import { formatMoney } from "../../lib/format.js";

export function SubidaResult({ calc, budget, typed }) {
  let note = `Ahora: ${formatMoney(calc.from)}.`;
  if (typed && calc.to <= calc.from) note += " La cláusula final tiene que ser mayor que la actual.";
  if (budget != null) note += calc.affordable ? ` Tu puja máxima es ${formatMoney(budget)}: te llega.` : ` Tu puja máxima es ${formatMoney(budget)}: no te llega.`;
  return (
    <>
      <div className="res">
        <div><div className="k">Te quitan</div><div className="n cost">{formatMoney(calc.cost)}</div></div>
        <div><div className="k">Cláusula final</div><div className="n to">{calc.to > calc.from ? formatMoney(calc.to) : "—"}</div></div>
      </div>
      <div className={`note ${budget != null && !calc.affordable ? "err" : ""}`}>{note}</div>
    </>
  );
}
