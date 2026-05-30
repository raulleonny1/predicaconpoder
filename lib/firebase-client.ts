import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "@/firebase";
import type { FirebaseApp } from "firebase/app";

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}

export function getFirebaseAppSafe(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  try {
    return getFirebaseApp();
  } catch {
    return null;
  }
}

export function getClientAuth(): Auth | null {
  const app = getFirebaseAppSafe();
  if (!app) return null;
  return getAuth(app);
}

export function getClientFirestore(): Firestore | null {
  const app = getFirebaseAppSafe();
  if (!app) return null;
  return getFirestore(app);
}
