// Quién ha gastado más en subidas virtuales validadas.
import { Card } from "../../components/Card.jsx";
import { MEMBERS } from "../../config/constants.js";
import { realClause, virtualClause } from "../../lib/clauses.js";
import { displayName, formatMoney, plural } from "../../lib/format.js";

function investments(ops, players) {
  const done = ops.filter(o => o.estado === "validada" && o.tipo === "subida");
  return MEMBERS.map(member => {
    const mine = done.filter(o => o.solicitante === member);
    return {
      member,
      total: mine.reduce((s, o) => s + (+o.coste || 0), 0),
      count: mine.length,
      virtualNow: players.filter(p => p.dueno === member).reduce((s, p) => s + Math.max(0, virtualClause(p) - realClause(p)), 0)
    };
  }).sort((a, b) => b.total - a.total);
}

export function InvestmentRanking({ ops, players }) {
  const rows = investments(ops, players);
  const max = Math.max(1, ...rows.map(r => r.total));
  return (
    <Card title="Quién ha invertido más en blindar">
      {rows.map((r, i) => (
        <div className="rk" key={r.member}>
          <div className="n">{i + 1}</div>
          <div>
            <div className="pn">{displayName(r.member)}</div>
            <div className="sub">{plural(r.count, "subida", "subidas")} · {formatMoney(r.virtualNow)} de cláusula virtual ahora</div>
            <div className="meter"><div style={{ width: `${(r.total / max) * 100}%` }} /></div>
          </div>
          <div className="big">{formatMoney(r.total)}</div>
        </div>
      ))}
      <div className="note">Dinero pagado en subidas virtuales validadas.</div>
    </Card>
  );
}
