import { useState } from "react";
import { MoneyInput } from "../../components/MoneyInput.jsx";
import { validatorsFor } from "../../lib/clauses.js";
import { displayName, formatWhen, parseAmount } from "../../lib/format.js";
import { cancelOperation, rejectOperation, validateOperation } from "../../services/operations.js";
import { useAction } from "../../hooks/useAction.js";
import { useLiga } from "../../state/LigaProvider.jsx";
import { OperationText } from "./OperationText.jsx";

export function OperationCard({ op }) {
  const { me, canWrite, mister } = useLiga();
  const [newReal, setNewReal] = useState("");
  const { run, busy } = useAction();
  const validators = validatorsFor(op);
  const canValidate = canWrite && me && validators.includes(me);
  const isMine = canWrite && me === op.solicitante;
  const isSubida = op.tipo === "subida";

  return (
    <section className="card">
      <div className="row">
        <span className={`tag ${isSubida ? "v" : "a"}`}>{isSubida ? "Subida" : "Clausulazo"}</span>
        <span className="sub">{formatWhen(op.creado)}</span>
      </div>
      <OperationText op={op} />
      <div className="sub">Valida: {validators.map(displayName).join(" o ")}</div>
      {canValidate && !isSubida && (
        <MoneyInput
          id={`nr-${op.id}`}
          label={`Nueva cláusula en Mister tras el traspaso${mister?.ultimaOk ? " (opcional: se actualiza sola)" : ""}`}
          value={newReal}
          onChange={setNewReal}
          placeholder="La que marque Mister"
        />
      )}
      <div className="btns">
        {canValidate && (
          <>
            <button className="btn ok" disabled={busy} onClick={() => run(() => validateOperation(op, me, parseAmount(newReal)), "Validado")}>
              {isSubida ? "Dinero quitado · Validar" : "Hecho · Validar"}
            </button>
            <button className="btn bad" disabled={busy} onClick={() => run(() => rejectOperation(op, me), "Rechazado")}>Rechazar</button>
          </>
        )}
        {isMine && <button className="btn ghost" disabled={busy} onClick={() => run(() => cancelOperation(op, me), "Cancelado")}>Cancelar</button>}
      </div>
    </section>
  );
}
