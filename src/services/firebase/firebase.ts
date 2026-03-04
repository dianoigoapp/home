import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase config (MVP)
 * IMPORTANT: apiKey is not a secret in Firebase web apps.
 * Later: move to .env (VITE_FIREBASE_*) for easier environment switching.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDQIf0Y7Z9keG-ERkyPOl6EC3Yw5fnwyqY",
  authDomain: "discipular-7ee4c.firebaseapp.com",
  projectId: "discipular-7ee4c",
  storageBucket: "discipular-7ee4c.firebasestorage.app",
  messagingSenderId: "298542166105",
  appId: "1:298542166105:web:64c7e6a85e6c2ec4e7c148",
  measurementId: "G-YY5SFHML6X",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
