import { MEMBERS } from "../../config/constants.js";
import { formatWhen } from "../../lib/format.js";
import { useLiga } from "../../state/LigaProvider.jsx";
import { AddPlayerForm } from "./AddPlayerForm.jsx";
import { OwnerSquad } from "./OwnerSquad.jsx";

export function PlantillasSection() {
  const { mister, me, canWrite } = useLiga();
  const synced = mister?.ultimaOk;
  return (
    <>
      {synced
        ? <div className="card sub">Los jugadores, dueños y cláusulas se cargan solos desde Mister cada 3 horas. Última lectura: {formatWhen(mister.ultimaOk)}.</div>
        : canWrite && me && <AddPlayerForm me={me} />}
      {MEMBERS.map(m => <OwnerSquad key={m} owner={m} />)}
    </>
  );
}
