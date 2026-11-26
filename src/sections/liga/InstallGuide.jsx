import { Card } from "../../components/Card.jsx";

export const InstallGuide = () => (
  <Card title="Instálala en el móvil">
    <div className="sub">
      <b>iPhone (Safari):</b> botón Compartir → «Añadir a pantalla de inicio».<br />
      <b>Android (Chrome):</b> menú ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio».<br />
      Se abre a pantalla completa con su propio icono. En iPhone, la app instalada no comparte sesión con Safari:
      si ya te habías elegido en Safari, pide a un admin que te desvincule y pulsa «Soy yo» desde el icono.
    </div>
  </Card>
);
