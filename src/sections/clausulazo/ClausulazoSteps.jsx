import { displayName, formatMoney } from "../../lib/format.js";

export function ClausulazoSteps({ player, calc, validators }) {
  return (
    <ol className="steps">
      <li>Haz la oferta de <b>{formatMoney(calc.real)}</b> en Mister por {player.nombre}: {displayName(player.dueno)} no puede rechazarla.</li>
      {calc.difference > 0
        ? <li>{validators} te quita <b>{formatMoney(calc.difference)}</b> y se lo da a {displayName(player.dueno)}.</li>
        : <li>No tiene parte virtual: no hay diferencia que mover.</li>}
      <li>En total pagas <b>{formatMoney(calc.total)}</b>, su cláusula virtual.</li>
    </ol>
  );
}
