import { useLiga } from "../../state/LigaProvider.jsx";
import { BalanceTable } from "./BalanceTable.jsx";
import { MovementList } from "./MovementList.jsx";

export function HistorialSection() {
  const { ops } = useLiga();
  const done = ops.filter(o => o.estado !== "pendiente").sort((a, b) => (b.resuelto || 0) - (a.resuelto || 0));
  return (
    <>
      <BalanceTable validated={done.filter(o => o.estado === "validada")} />
      <MovementList done={done} />
    </>
  );
}
