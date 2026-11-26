import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { UserError } from "../lib/errors.js";

export async function addPlayer({ nombre, dueno, real }) {
  if (!nombre || real <= 0) throw new UserError("Pon nombre y cláusula");
  await addDoc(collection(db, "jugadores"), { nombre: nombre.slice(0, 60), dueno, real, virtual: 0, act: Date.now() });
}

// Si la nueva cláusula de Mister supera la virtual, la virtual deja de contar.
export async function updateRealClause(player, real) {
  if (real <= 0) throw new UserError("Pon una cláusula válida");
  const virtual = (+player.virtual || 0) > real ? player.virtual : 0;
  await updateDoc(doc(db, "jugadores", player.id), { real, virtual, act: Date.now() });
}

export const removePlayer = id => deleteDoc(doc(db, "jugadores", id));
