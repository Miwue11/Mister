// Configuración pública del proyecto de Firebase (no es secreta).
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUQFeG2ntK8Y3vBbhMQkgNADXUS7W-fjI",
  authDomain: "clausulas-mister.firebaseapp.com",
  projectId: "clausulas-mister",
  storageBucket: "clausulas-mister.firebasestorage.app",
  messagingSenderId: "956715874775",
  appId: "1:956715874775:web:13a893dbca359db8cd3392"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
