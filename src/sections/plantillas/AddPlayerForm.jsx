import { useState } from "react";
import { MEMBERS } from "../../config/constants.js";
import { Card } from "../../components/Card.jsx";
import { MoneyInput } from "../../components/MoneyInput.jsx";
import { isAdmin } from "../../lib/clauses.js";
import { displayName, parseAmount } from "../../lib/format.js";
import { addPlayer } from "../../services/players.js";
import { useAction } from "../../hooks/useAction.js";

export function AddPlayerForm({ me }) {
  const [nombre, setNombre] = useState("");
  const [dueno, setDueno] = useState(me);
  const [real, setReal] = useState("");
  const { run, busy } = useAction();
  const owners = isAdmin(me) ? MEMBERS : [me];

  const submit = async e => {
    e.preventDefault();
    const ok = await run(() => addPlayer({ nombre: nombre.trim(), dueno, real: parseAmount(real) }), `${nombre.trim()} añadido`);
    if (ok) { setNombre(""); setReal(""); }
  };

  return (
    <Card title="Añadir jugador">
      <form onSubmit={submit}>
        <div className="grid2">
          <div>
            <label htmlFor="ap-nombre">Jugador</label>
            <input id="ap-nombre" required autoComplete="off" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ap-dueno">Dueño</label>
            <select id="ap-dueno" value={dueno} onChange={e => setDueno(e.target.value)}>
              {owners.map(m => <option key={m} value={m}>{displayName(m)}</option>)}
            </select>
          </div>
        </div>
        <MoneyInput id="ap-real" label="Cláusula actual en Mister" value={real} onChange={setReal} placeholder="1.000.000" />
        <div className="btns"><button className="btn ok" disabled={busy}>Añadir</button></div>
      </form>
    </Card>
  );
}
