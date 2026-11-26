import { PlayerPhoto } from "../../components/PlayerPhoto.jsx";
import { POSITIONS } from "../../config/constants.js";
import { hasVirtual } from "../../lib/clauses.js";
import { displayName } from "../../lib/format.js";

export function RankingRow({ index, player, value, detail }) {
  return (
    <div className="rk">
      <div className="n">{index + 1}</div>
      <div className="who">
        <PlayerPhoto player={player} />
        <div>
          <div className="pn">
            {player.nombre}
            {+player.blindaje > 0 && <> <span className="tag b">blindado</span></>}
            {hasVirtual(player) && <> <span className="tag v">virtual</span></>}
          </div>
          <div className="sub">{displayName(player.dueno)}{POSITIONS[player.posicion] ? ` · ${POSITIONS[player.posicion]}` : ""} · {detail}</div>
        </div>
      </div>
      <div className="big">{value}</div>
    </div>
  );
}
