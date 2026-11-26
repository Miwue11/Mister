// Formato de números, fechas y nombres. Funciones puras.
export const displayName = name => (name === "Agustin" ? "Agustín" : name || "?");

export const formatMoney = n => Math.round(+n || 0).toLocaleString("es-ES");

export const formatDecimal = (n, digits = 1) =>
  (Math.round((+n || 0) * 10 ** digits) / 10 ** digits).toLocaleString("es-ES");

export const formatRatio = n => String(n).replace(".", ",");

// "1.000.000" → 1000000 ; "-5.000" → -5000 ; "" → 0
export function parseAmount(text) {
  const t = String(text ?? "").trim();
  const digits = t.replace(/\D/g, "");
  if (!digits) return 0;
  return t.startsWith("-") ? -Number(digits) : Number(digits);
}

export const formatWhen = ts =>
  ts ? new Date(ts).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
