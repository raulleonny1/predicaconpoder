export function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid-credential") || m.includes("wrong-password") || m.includes("invalid_login")) {
    return "Correo o contraseña incorrectos.";
  }
  if (m.includes("email-already-in-use")) return "Ese correo ya tiene una cuenta.";
  if (m.includes("weak-password")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("invalid-email")) return "Correo electrónico no válido.";
  if (m.includes("popup-closed") || m.includes("cancelled")) return "Inicio de sesión cancelado.";
  if (m.includes("network")) return "Error de red. Revisa tu conexión.";
  return "No se pudo completar la operación. Intenta de nuevo.";
}
