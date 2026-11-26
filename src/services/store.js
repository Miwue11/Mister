// Suscripciones genéricas a Firestore.
import { collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase.js";

const rows = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));

export function watchCollection(path, onData, onError, { order, max } = {}) {
  let ref = collection(db, path);
  if (order) ref = query(ref, orderBy(order.field, order.dir || "asc"), ...(max ? [limit(max)] : []));
  return onSnapshot(ref, snap => onData(rows(snap)), onError);
}

export function watchDoc(path, onData, onError) {
  return onSnapshot(doc(db, path), snap => onData(snap.exists() ? snap.data() : null), onError);
}
