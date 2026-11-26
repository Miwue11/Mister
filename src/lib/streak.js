// Color y altura de cada barrita de racha (puntos por jornada).
export function streakColor(points) {
  if (points == null) return "#4a5070";
  if (points >= 10) return "#5ac8fa";
  if (points >= 6) return "#3fd2c7";
  if (points >= 2) return "#2fd39a";
  if (points >= 0) return "#f4c64a";
  return "#ff5b78";
}

export const streakHeight = points => (points == null ? 4 : Math.max(4, Math.min(24, Math.abs(points) * 2 + 4)));
