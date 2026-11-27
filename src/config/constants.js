// Datos fijos de la liga. Cambiar aquí si entra o sale alguien.
export const MEMBERS = ["Miguel", "Agustin", "Jaime", "Carlos", "David"];
export const ADMINS = ["Agustin", "David"];
// Admins que pueden validar sus propias operaciones.
export const SELF_VALIDATORS = [];

// Mister: cada 1 € pagado sube la cláusula 2,5 € (sale de las capturas del juego).
export const DEFAULT_RATIO = 2.5;
// Puja máxima = saldo + 25 % del valor del equipo.
export const DEBT_FRACTION = 0.25;

export const POSITIONS = { 1: "PT", 2: "DF", 3: "MC", 4: "DL" };
export const MISTER_CDN = "https://cdn-mister.mundodeportivo.com/";

export const TABS = [
  { id: "plantillas", label: "Plantillas" },
  { id: "subir", label: "Subir cláusula" },
  { id: "clausulazo", label: "Clausulazo" },
  { id: "pendientes", label: "Pendientes" },
  { id: "rankings", label: "Rankings" },
  { id: "historial", label: "Historial" },
  { id: "liga", label: "Liga" }
];
