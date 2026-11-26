import { streakColor, streakHeight } from "../../../lib/streak.js";

export function StreakBars({ streak }) {
  if (!streak?.length) return null;
  return (
    <span className="bars" aria-label="Puntos en las últimas jornadas">
      {streak.map((v, i) => (
        <i key={i} style={{ height: streakHeight(v), background: streakColor(v) }} />
      ))}
    </span>
  );
}
