// Solo para jugadores metidos a mano (los de Mister se actualizan solos).
import { useState } from "react";
import { MoneyInput } from "../../components/MoneyInput.jsx";
import { formatMoney, parseAmount } from "../../lib/format.js";
import { removePlayer, updateRealClause } from "../../services/players.js";
import { useAction } from "../../hooks/useAction.js";

export function EditRealClause({ player, onClose }) {
  const [value, setValue] = useState(formatMoney(player.real));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { run, busy } = useAction();
  const save = async () => (await run(() => updateRealClause(player, parseAmount(value)), "Cláusula de Mister actualizada")) && onClose();
  const remove = async () => {
    if (!confirmDelete) return setConfirmDelete(true);
    (await run(() => removePlayer(player.id), "Jugador quitado")) && onClose();
  };
  return (
    <div className="edit-real">
      <div className="grid2">
        <MoneyInput id={`er-${player.id}`} label="Nueva cláusula en Mister" value={value} onChange={setValue} />
        <div className="btns end">
          <button className="btn ok" disabled={busy} onClick={save}>Guardar</button>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
      <div className="note">Si la de Mister supera la virtual, manda la de Mister.</div>
      <div className="btns">
        <button className="btn bad" disabled={busy} onClick={remove}>{confirmDelete ? "Pulsa otra vez para quitarlo" : "Quitar jugador"}</button>
      </div>
    </div>
  );
}
