// Vincular cada móvil (id anónimo) con un miembro de la liga.
import { doc, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { displayName } from "../lib/format.js";
import { UserError } from "../lib/errors.js";

export async function claimMember(name, uid) {
  const ok = await runTransaction(db, async t => {
    const ref = doc(db, "miembros", name);
    const snap = await t.get(ref);
    if (snap.exists() && snap.data().uid) return false;
    t.set(ref, { uid, desde: Date.now() });
    return true;
  });
  if (!ok) throw new UserError(`${displayName(name)} ya está vinculado`);
}

export const unlinkMember = name => setDoc(doc(db, "miembros", name), { uid: null, desde: Date.now() });
