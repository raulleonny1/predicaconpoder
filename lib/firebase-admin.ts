import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null | undefined;

function parseServiceAccount(): Record<string, string> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as Record<string, string>;
  } catch {
    return null;
  }
}

/** App Admin de Firebase; `null` si falta `FIREBASE_SERVICE_ACCOUNT_JSON` o es inválido. */
export function getFirebaseAdminApp(): App | null {
  if (cachedApp !== undefined) return cachedApp;

  const credentials = parseServiceAccount();
  if (!credentials) {
    cachedApp = null;
    return null;
  }

  try {
    if (getApps().length > 0) {
      cachedApp = getApps()[0]!;
      return cachedApp;
    }
    cachedApp = initializeApp({ credential: cert(credentials) });
    return cachedApp;
  } catch {
    cachedApp = null;
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getFirestore(app);
}
