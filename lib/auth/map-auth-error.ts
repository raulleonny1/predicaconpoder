import { FirebaseError } from "firebase/app";

const CODE_MESSAGES: Record<string, string> = {
  "auth/unauthorized-domain":
    "Este dominio no está autorizado. En Firebase Console → Authentication → Configuración → Dominios autorizados, añade localhost y tu dominio de producción.",
  "auth/operation-not-allowed":
    "Google no está activado. En Firebase Console → Authentication → Método de acceso, habilita Google.",
  "auth/popup-blocked":
    "El navegador bloqueó la ventana emergente. Permite popups para este sitio o usa correo y contraseña.",
  "auth/cancelled-popup-request":
    "No se pudo abrir la ventana de Google. Intenta de nuevo o usa correo y contraseña.",
  "auth/popup-closed-by-user": "Inicio de sesión cancelado.",
  "auth/account-exists-with-different-credential":
    "Ya existe una cuenta con ese correo usando otro método. Entra con correo y contraseña.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/email-already-in-use": "Ese correo ya tiene una cuenta.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-email": "Correo electrónico no válido.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  "auth/network-request-failed": "Error de red. Revisa tu conexión.",
  "auth/invalid-api-key": "Configuración de Firebase incorrecta (API key). Revisa .env.local.",
};

function extractCode(error: unknown): string | null {
  if (error instanceof FirebaseError) return error.code;
  if (typeof error === "string") {
    const match = error.match(/auth\/[\w-]+/);
    return match?.[0] ?? null;
  }
  if (error instanceof Error) {
    const match = error.message.match(/auth\/[\w-]+/);
    return match?.[0] ?? null;
  }
  return null;
}

export function mapAuthError(error: unknown): string {
  const code = extractCode(error);
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const m = message.toLowerCase();

  if (m.includes("invalid-credential") || m.includes("wrong-password") || m.includes("invalid_login")) {
    return CODE_MESSAGES["auth/invalid-credential"];
  }
  if (m.includes("email-already-in-use")) return CODE_MESSAGES["auth/email-already-in-use"];
  if (m.includes("weak-password")) return CODE_MESSAGES["auth/weak-password"];
  if (m.includes("invalid-email")) return CODE_MESSAGES["auth/invalid-email"];
  if (m.includes("popup-closed") || m.includes("cancelled")) {
    return CODE_MESSAGES["auth/popup-closed-by-user"];
  }
  if (m.includes("network")) return CODE_MESSAGES["auth/network-request-failed"];
  if (m.includes("unauthorized-domain")) return CODE_MESSAGES["auth/unauthorized-domain"];
  if (m.includes("operation-not-allowed")) return CODE_MESSAGES["auth/operation-not-allowed"];

  return "No se pudo completar la operación. Intenta de nuevo.";
}
