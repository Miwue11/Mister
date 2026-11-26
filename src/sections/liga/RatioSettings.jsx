import { useState } from "react";
import { Card } from "../../components/Card.jsx";
import { isAdmin } from "../../lib/clauses.js";
import { formatRatio } from "../../lib/format.js";
import { saveRatio } from "../../services/settings.js";
import { useAction } from "../../hooks/useAction.js";
import { useLiga } from "../../state/LigaProvider.jsx";

export function RatioSettings() {
  const { ratio, me, canWrite } = useLiga();
  const [value, setValue] = useState(formatRatio(ratio));
  const { run, busy } = useAction();
  const editable = canWrite && isAdmin(me);
  return (
    <Card title="Regla de cálculo">
      <div className="sub">Cada 1 € pagado sube la cláusula {formatRatio(ratio)} €. Sale de Mister: pagar 133.333 sube 1.000.000 a 1.333.333.</div>
      {editable && (
        <>
          <label htmlFor="ratio">Euros de cláusula por euro pagado</label>
          <div className="grid2">
            <input id="ratio" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} />
            <button className="btn ghost" disabled={busy} onClick={() => run(() => saveRatio(parseFloat(value.replace(",", "."))), "Regla guardada")}>Guardar</button>
          </div>
        </>
      )}
    </Card>
  );
}
