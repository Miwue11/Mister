// Franja inferior: estado de la cláusula del jugador.
import { LockIcon, ShieldIcon } from "../../../components/Icons.jsx";
import { hasVirtual } from "../../../lib/clauses.js";
import { formatMoney } from "../../../lib/format.js";

export function ClauseFooter({ player, children }) {
  let content;
  if (+player.blindaje > 0) content = <><LockIcon /><span>Blindado en Mister: ahora no se puede clausular</span></>;
  else if (hasVirtual(player)) content = <><ShieldIcon /><span>Cláusula virtual <b>{formatMoney(player.virtual)}</b> · en Mister {formatMoney(player.real)}</span></>;
  else content = <><ShieldIcon /><span>Cláusula de Mister, sin parte virtual</span></>;
  return <div className="pc-f">{content}{children}</div>;
}
