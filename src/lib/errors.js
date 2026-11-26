// Traduce errores de Firebase a mensajes para el usuario.
export class UserError extends Error {}

export function friendlyError(e) {
  if (e instanceof UserError) return e.message;
  if (e?.code === "permission-denied") return "Sin permiso para guardar: revisa las reglas de Firestore.";
  if (e?.code === "resource-exhausted") return "Se ha superado el límite gratuito de Firebase por hoy.";
  if (e?.code === "unavailable") return "Sin conexión. Inténtalo de nuevo en un momento.";
  return "No se pudo guardar. Inténtalo de nuevo.";
}
