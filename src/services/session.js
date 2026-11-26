// Sesión anónima de Firebase: cada móvil/navegador tiene su propio id.
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../config/firebase.js";

export function watchSession(onUser, onError) {
  return onAuthStateChanged(auth, user => {
    if (user) onUser(user.uid);
    else signInAnonymously(auth).catch(onError);
  });
}
