import { TABS } from "../config/constants.js";
import { useLiga } from "../state/LigaProvider.jsx";

export function Tabs({ current, onChange }) {
  const { pending } = useLiga();
  return (
    <nav className="tabs">
      {TABS.map(t => (
        <button key={t.id} className={current === t.id ? "on" : ""} onClick={() => onChange(t.id)}>
          {t.label}
          {t.id === "pendientes" && pending.length > 0 && <span className="badge">{pending.length}</span>}
        </button>
      ))}
    </nav>
  );
}
