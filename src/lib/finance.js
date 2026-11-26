// Valor de equipo y saldo de un miembro según lo último leído de Mister.
export function memberFinance(member, mister, managerMap) {
  if (!mister?.managers) return null;
  const managerId = Object.keys(managerMap || {}).find(id => managerMap[id] === member);
  if (!managerId) return null;
  const manager = mister.managers.find(m => m.id === managerId);
  const own = mister.saldo && mister.saldo.id === managerId ? mister.saldo : null;
  return {
    valor: manager?.valor != null ? +manager.valor : null,
    saldo: own ? own.actual : null,
    futuro: own ? own.futuro : null
  };
}
