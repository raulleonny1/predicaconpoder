import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

function firebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function getFirebaseApp(): FirebaseApp {
  const existing = getApps()[0];
  if (existing) return existing;

  const config = firebaseConfig();
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error(
      "Faltan variables NEXT_PUBLIC_FIREBASE_* en .env.local. Copia .env.example y completa los valores.",
    );
  }

  return initializeApp(config);
}
