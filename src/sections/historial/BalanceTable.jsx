// Totales virtuales por miembro: invertido en subidas, pagado y cobrado en clausulazos.
import { Card } from "../../components/Card.jsx";
import { MEMBERS } from "../../config/constants.js";
import { displayName, formatMoney } from "../../lib/format.js";

const sum = (list, field) => list.reduce((s, o) => s + (+o[field] || 0), 0);

export function BalanceTable({ validated }) {
  const rows = MEMBERS.map(m => ({
    m,
    invertido: sum(validated.filter(o => o.tipo === "subida" && o.solicitante === m), "coste"),
    pagado: sum(validated.filter(o => o.tipo === "clausulazo" && o.solicitante === m), "diferencia"),
    cobrado: sum(validated.filter(o => o.tipo === "clausulazo" && o.vendedor === m), "diferencia")
  }));
  return (
    <Card title="Balance virtual">
      <table className="stack">
        <thead><tr><th>Mánager</th><th className="r">Invertido en subidas</th><th className="r">Pagado en clausulazos</th><th className="r">Cobrado</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.m}>
              <td data-l="Mánager">{displayName(r.m)}</td>
              <td className="r" data-l="Invertido en subidas">{formatMoney(r.invertido)}</td>
              <td className="r" data-l="Pagado en clausulazos">{formatMoney(r.pagado)}</td>
              <td className="r" data-l="Cobrado">{formatMoney(r.cobrado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note">Solo cuenta la parte virtual validada por los admins.</div>
    </Card>
  );
}
