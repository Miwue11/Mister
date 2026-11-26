import { Empty } from "../../components/Card.jsx";
import { useLiga } from "../../state/LigaProvider.jsx";
import { OperationCard } from "./OperationCard.jsx";

export function PendientesSection() {
  const { pending } = useLiga();
  if (!pending.length) return <Empty>Nada pendiente de validar.</Empty>;
  return [...pending].sort((a, b) => a.creado - b.creado).map(op => <OperationCard key={op.id} op={op} />);
}
