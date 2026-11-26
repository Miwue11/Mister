import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { UserError } from "../lib/errors.js";

export async function saveRatio(ratio) {
  if (!(ratio > 0 && ratio < 100)) throw new UserError("Pon un número válido, por ejemplo 2,5");
  await setDoc(doc(db, "liga", "config"), { ratio });
}

// Relación «mánager de Mister → miembro de la app». value vacío = sin asignar.
export async function saveManagerMap(current, managerId, member) {
  const mapa = { ...current };
  if (member) mapa[managerId] = member;
  else delete mapa[managerId];
  await setDoc(doc(db, "mister", "mapa"), { mapa });
}
