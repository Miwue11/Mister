// Descripción en una frase de una subida o un clausulazo.
import { displayName, formatMoney } from "../../lib/format.js";

export function OperationText({ op }) {
  if (op.tipo === "subida") {
    return (
      <p>{displayName(op.solicitante)} sube a <b>{op.jugador}</b> de {formatMoney(op.desde)} a <b>{formatMoney(op.hasta)}</b>. Quitarle <b>{formatMoney(op.coste)}</b>.</p>
    );
  }
  return (
    <p>
      {displayName(op.solicitante)} paga la cláusula de <b>{op.jugador}</b> a {displayName(op.vendedor)}: {formatMoney(op.real)} en Mister
      {op.diferencia > 0 && <> + <b>{formatMoney(op.diferencia)}</b> que se le quitan a {displayName(op.solicitante)} y se le dan a {displayName(op.vendedor)}</>}.
    </p>
  );
}
