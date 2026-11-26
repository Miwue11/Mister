// Peticiones de subida y clausulazo, y su validación por los admins.
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { effectiveClause, validatorsFor } from "../lib/clauses.js";
import { UserError } from "../lib/errors.js";

const opRef = id => doc(db, "operaciones", id);
const playerRef = id => doc(db, "jugadores", id);

function assertNoPending(pending, playerId) {
  if (pending.some(o => o.jugadorId === playerId)) throw new UserError("Ese jugador ya tiene una operación pendiente");
}

export async function requestSubida({ player, me, calc, pending }) {
  assertNoPending(pending, player.id);
  await addDoc(collection(db, "operaciones"), {
    tipo: "subida", jugadorId: player.id, jugador: player.nombre, solicitante: me,
    desde: calc.from, hasta: calc.to, coste: calc.cost, estado: "pendiente", creado: Date.now()
  });
}

export async function requestClausulazo({ player, me, calc, pending }) {
  assertNoPending(pending, player.id);
  await addDoc(collection(db, "operaciones"), {
    tipo: "clausulazo", jugadorId: player.id, jugador: player.nombre, solicitante: me, vendedor: player.dueno,
    real: calc.real, virtual: calc.total, diferencia: calc.difference, estado: "pendiente", creado: Date.now()
  });
}

async function applySubida(op, player) {
  if (player.dueno !== op.solicitante || effectiveClause(player) !== op.desde)
    throw new UserError("La cláusula o el dueño han cambiado desde la petición: recházala y que la pidan otra vez");
  await updateDoc(playerRef(op.jugadorId), { virtual: op.hasta, act: Date.now() });
}

// La sincronización con Mister puede haber movido ya el jugador al comprador.
async function applyClausulazo(op, player, newReal) {
  const alreadyMoved = player.dueno === op.solicitante;
  if (player.dueno !== op.vendedor && !alreadyMoved)
    throw new UserError(`El jugador ya no es del vendedor: recházala`);
  const real = newReal || (alreadyMoved ? +player.real : op.real);
  await updateDoc(playerRef(op.jugadorId), { dueno: op.solicitante, real, virtual: 0, act: Date.now() });
}

export async function validateOperation(op, me, newReal = 0) {
  if (!validatorsFor(op).includes(me)) throw new UserError("No puedes validar esta operación");
  const snap = await getDoc(playerRef(op.jugadorId));
  if (!snap.exists()) throw new UserError("El jugador ya no está registrado: recházala");
  const player = { id: snap.id, ...snap.data() };
  if (op.tipo === "subida") await applySubida(op, player);
  else await applyClausulazo(op, player, newReal);
  await updateDoc(opRef(op.id), { estado: "validada", validador: me, resuelto: Date.now() });
}

export async function rejectOperation(op, me) {
  if (!validatorsFor(op).includes(me)) throw new UserError("No puedes rechazar esta operación");
  await updateDoc(opRef(op.id), { estado: "rechazada", validador: me, resuelto: Date.now() });
}

export async function cancelOperation(op, me) {
  if (op.solicitante !== me) throw new UserError("Solo puede cancelarla quien la pidió");
  await updateDoc(opRef(op.id), { estado: "cancelada", resuelto: Date.now() });
}
