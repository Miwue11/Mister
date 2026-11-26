// Mapa pestaña → sección. Añadir una sección = crear su carpeta y registrarla aquí.
import { ClausulazoSection } from "./clausulazo/ClausulazoSection.jsx";
import { HistorialSection } from "./historial/HistorialSection.jsx";
import { LigaSection } from "./liga/LigaSection.jsx";
import { PendientesSection } from "./pendientes/PendientesSection.jsx";
import { PlantillasSection } from "./plantillas/PlantillasSection.jsx";
import { RankingsSection } from "./rankings/RankingsSection.jsx";
import { SubirSection } from "./subir/SubirSection.jsx";

export const SECTIONS = {
  plantillas: PlantillasSection,
  subir: SubirSection,
  clausulazo: ClausulazoSection,
  pendientes: PendientesSection,
  rankings: RankingsSection,
  historial: HistorialSection,
  liga: LigaSection
};
