// Bloquea una sección hasta que el usuario dice quién es.
import { useLiga } from "../state/LigaProvider.jsx";
import { Empty } from "./Card.jsx";

export function NeedIdentity({ children }) {
  const { me, canWrite } = useLiga();
  if (canWrite && me) return children;
  return <Empty>{canWrite ? "Primero dile a la app quién eres en la pestaña «Liga»." : "Conectando con la liga…"}</Empty>;
}
