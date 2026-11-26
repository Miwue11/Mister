import { Card } from "../../components/Card.jsx";
import { RankingRow } from "./RankingRow.jsx";

const TOP = 10;

export function PlayerRanking({ title, players, sortBy, value, detail }) {
  const top = [...players].sort((a, b) => sortBy(b) - sortBy(a)).slice(0, TOP);
  return (
    <Card title={title}>
      {top.map((p, i) => <RankingRow key={p.id} index={i} player={p} value={value(p)} detail={detail(p)} />)}
    </Card>
  );
}
