import { isAdmin } from "../lib/clauses.js";
import { displayName } from "../lib/format.js";
import { useLiga } from "../state/LigaProvider.jsx";

function IdentityChip() {
  const { me, canWrite, uid } = useLiga();
  if (!uid) return <div className="chip">Conectando…</div>;
  if (!me) return <div className="chip">{canWrite ? "Elige quién eres en «Liga»" : "Modo lectura"}</div>;
  return <div className="chip">Eres <b>{displayName(me)}</b>{isAdmin(me) ? " · admin" : ""}</div>;
}

export function AppHeader() {
  const { status } = useLiga();
  return (
    <>
      <header className="app-header">
        <h1>Cláusulas virtuales<small>Liga Mister · Miguel, Agustín, Jaime, Carlos y David</small></h1>
        <IdentityChip />
      </header>
      {status && <div className="status">{status}</div>}
    </>
  );
}
