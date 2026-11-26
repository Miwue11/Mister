// Reglas de cláusulas, subidas y clausulazos. Funciones puras, sin red.
import { ADMINS, DEBT_FRACTION } from "../config/constants.js";

export const realClause = p => +p.real || 0;
export const virtualClause = p => +p.virtual || 0;
export const effectiveClause = p => Math.max(realClause(p), virtualClause(p));
export const hasVirtual = p => virtualClause(p) > realClause(p);
export const isAdmin = name => ADMINS.includes(name);

export const maxBid = (saldo, valorEquipo) => Math.round((+saldo || 0) + (+valorEquipo || 0) * DEBT_FRACTION);

// Admins que pueden validar: nunca quien la pide; en clausulazos, tampoco el vendedor si hay otro.
export function validatorsFor(op) {
  const strict = ADMINS.filter(a => a !== op.solicitante && a !== op.vendedor);
  return strict.length ? strict : ADMINS.filter(a => a !== op.solicitante);
}

// mode "objetivo": amount = cláusula final; mode "pago": amount = dinero a invertir.
export function calcSubida({ player, mode, amount, ratio, budget = null }) {
  const from = effectiveClause(player);
  let cost, to;
  if (mode === "pago") {
    cost = amount;
    to = from + Math.round(amount * ratio);
  } else {
    to = amount;
    cost = Math.max(0, Math.round((amount - from) / ratio));
  }
  const affordable = budget == null || cost <= budget;
  return { from, to, cost, affordable, valid: to > from && cost > 0 && affordable };
}

export function calcClausulazo(player, budget = null) {
  const real = realClause(player);
  const total = effectiveClause(player);
  return { real, total, difference: total - real, affordable: budget == null || total <= budget };
}
