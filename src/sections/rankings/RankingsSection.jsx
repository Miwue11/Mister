import { Empty } from "../../components/Card.jsx";
import { effectiveClause } from "../../lib/clauses.js";
import { formatMoney } from "../../lib/format.js";
import { useLiga } from "../../state/LigaProvider.jsx";
import { InvestmentRanking } from "./InvestmentRanking.jsx";
import { PlayerRanking } from "./PlayerRanking.jsx";

export function RankingsSection() {
  const { players, ops } = useLiga();
  if (!players.length) return <Empty>Aún no hay jugadores cargados.</Empty>;
  return (
    <>
      <PlayerRanking
        title="Cláusulas más altas"
        players={players}
        sortBy={effectiveClause}
        value={p => formatMoney(effectiveClause(p))}
        detail={p => `valor ${formatMoney(p.valor)}`}
      />
      <PlayerRanking
        title="Jugadores más caros"
        players={players}
        sortBy={p => +p.valor || 0}
        value={p => formatMoney(p.valor)}
        detail={p => `cláusula ${formatMoney(effectiveClause(p))}`}
      />
      <InvestmentRanking ops={ops} players={players} />
    </>
  );
}
