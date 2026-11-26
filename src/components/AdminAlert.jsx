// Aviso para Agustín y David cuando tienen operaciones que validar.
import { isAdmin, validatorsFor } from "../lib/clauses.js";
import { useLiga } from "../state/LigaProvider.jsx";

export function AdminAlert({ onGo }) {
  const { me, canWrite, pending } = useLiga();
  if (!me || !isAdmin(me) || !canWrite) return null;
  const mine = pending.filter(o => validatorsFor(o).includes(me)).length;
  if (!mine) return null;
  return (
    <div className="alert">
      <span><b>{mine}</b> {mine === 1 ? "operación espera" : "operaciones esperan"} tu validación.</span>
      <button className="btn ok" onClick={onGo}>Validar ahora</button>
    </div>
  );
}
