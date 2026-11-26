// Ficha de jugador con el estilo de Mister.
import "./PlayerCard.css";
import { PlayerPhoto } from "../../../components/PlayerPhoto.jsx";
import { effectiveClause } from "../../../lib/clauses.js";
import { formatDecimal, formatMoney } from "../../../lib/format.js";
import { ClauseFooter } from "./ClauseFooter.jsx";
import { PositionBadge } from "./PositionBadge.jsx";
import { StreakBars } from "./StreakBars.jsx";
import { TeamBadge } from "./TeamBadge.jsx";

const valueChange = p => (p.valorPrev ? (+p.valor || 0) - +p.valorPrev : 0);

function Trend({ delta }) {
  if (delta > 0) return <span className="up">↑</span>;
  if (delta < 0) return <span className="dn">↓</span>;
  return null;
}

function Side({ player }) {
  return (
    <div className="pc-l">
      <TeamBadge player={player} />
      <PositionBadge position={player.posicion} />
      {player.misterId && <span className="pts">{formatMoney(player.puntos)}</span>}
    </div>
  );
}

function Main({ player, delta }) {
  return (
    <div>
      <div className="pc-n">{player.nombre}</div>
      {!!player.valor && <div className="pc-v">€ {formatMoney(player.valor)} <Trend delta={delta} /></div>}
      {player.misterId && (
        <span className="pc-a"><b>{formatDecimal(player.media)}</b><StreakBars streak={player.racha} /></span>
      )}
    </div>
  );
}

function Figures({ player, delta }) {
  return (
    <div className="pc-r">
      <div className="box"><small>Cláusula</small><b>{formatMoney(effectiveClause(player))}</b></div>
      {delta !== 0 && (
        <div className="box"><small>Hoy</small><b className={delta > 0 ? "up" : "dn"}>{delta > 0 ? "+" : ""}{formatMoney(delta)}</b></div>
      )}
    </div>
  );
}

export function PlayerCard({ player, actions }) {
  const delta = valueChange(player);
  return (
    <div className="pc">
      <Side player={player} />
      <PlayerPhoto player={player} className="pc-ph" />
      <Main player={player} delta={delta} />
      <Figures player={player} delta={delta} />
      <ClauseFooter player={player}>{actions}</ClauseFooter>
    </div>
  );
}
