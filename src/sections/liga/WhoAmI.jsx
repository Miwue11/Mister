// Vincular este móvil con un miembro de la liga.
import { Card } from "../../components/Card.jsx";
import { MEMBERS } from "../../config/constants.js";
import { isAdmin } from "../../lib/clauses.js";
import { displayName } from "../../lib/format.js";
import { claimMember, unlinkMember } from "../../services/members.js";
import { useAction } from "../../hooks/useAction.js";
import { useLiga } from "../../state/LigaProvider.jsx";

function MemberRow({ name }) {
  const { members, uid, me, canWrite } = useLiga();
  const { run, busy } = useAction();
  const linkedUid = members[name]?.uid;
  const isMe = linkedUid && linkedUid === uid;
  const unlink = () => run(() => unlinkMember(name), `${displayName(name)} desvinculado`);

  let action;
  if (isMe) action = <><span className="tag v">eres tú</span> <button className="btn ghost" disabled={busy} onClick={unlink}>Desvincular</button></>;
  else if (linkedUid) action = canWrite && isAdmin(me) ? <button className="btn ghost" disabled={busy} onClick={unlink}>Desvincular</button> : <span className="sub">vinculado</span>;
  else if (canWrite && uid && !me) action = <button className="btn ok" disabled={busy} onClick={() => run(() => claimMember(name, uid), `Hecho, eres ${displayName(name)}`)}>Soy yo</button>;
  else action = <span className="sub">libre</span>;

  return (
    <div className="pl row">
      <div className="pn">{displayName(name)} {isAdmin(name) && <span className="tag a">admin</span>}</div>
      <div>{action}</div>
    </div>
  );
}

export function WhoAmI() {
  return (
    <Card title="¿Quién eres?">
      {MEMBERS.map(m => <MemberRow key={m} name={m} />)}
      <div className="note">Cada móvil se vincula a un mánager. Si cambias de móvil o navegador, pide a un admin que te desvincule y vuelve a pulsar «Soy yo».</div>
    </Card>
  );
}
