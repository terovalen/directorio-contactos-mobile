import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Único punto de inicialización. El resto de la app importa `db` desde aquí.
// Los valores salen de variables de entorno (archivo .env, no versionado).
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export function firebaseConfigurado() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

function obtenerApp() {
  if (!firebaseConfigurado()) {
    return null;
  }

  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

const app = obtenerApp();
export const db = app ? getFirestore(app) : null;
export const COLECCION_CONTACTOS = 'contactos';
