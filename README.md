# Cláusulas virtuales · Liga Mister

App para gestionar las cláusulas virtuales de la liga. React + Vite, datos en Firebase y lectura automática de Mister.

Web: https://miwue11.github.io/Mister/

## Árbol del proyecto

```
├── index.html                  Entrada de Vite
├── public/                     Icono, manifest y service worker (instalar como app)
├── src/
│   ├── main.jsx                Monta la app y los proveedores
│   ├── App.jsx                 Cabecera, pestañas y sección activa
│   ├── config/                 constants.js (miembros, admins, reglas) · firebase.js
│   ├── lib/                    Funciones puras: formato, cláusulas, finanzas, fotos, racha, errores
│   ├── services/               Lectura y escritura en Firestore, un archivo por tipo de dato
│   ├── state/                  LigaProvider (datos compartidos) · ToastProvider (avisos)
│   ├── hooks/                  useAction (acciones con aviso) · useFinance
│   ├── components/             Piezas reutilizables (Card, Tabs, MoneyInput, FundsCheck…)
│   ├── styles/global.css       Estilos comunes
│   └── sections/               Una carpeta por pestaña
│       ├── index.js            Registro pestaña → sección
│       ├── plantillas/         Plantillas, alta manual y player-card/ (ficha estilo Mister)
│       ├── subir/              Pedir subida virtual
│       ├── clausulazo/         Avisar de un clausulazo
│       ├── pendientes/         Validar, rechazar o cancelar
│       ├── rankings/           Cláusulas, precios e inversión
│       ├── historial/          Balance y movimientos
│       └── liga/               Quién eres, conexión con Mister, instalación y regla
├── sync/                       Lectura de Mister (Node) que corre en GitHub Actions
└── .github/workflows/          deploy-app.yml (publica la web) · sync-mister.yml (cada 3 h)
```

## Cómo añadir cosas

- **Nueva pestaña:** crea `src/sections/<nombre>/<Nombre>Section.jsx`, regístrala en `sections/index.js` y añádela a `TABS` en `config/constants.js`.
- **Nueva regla de cálculo:** función pura en `src/lib/`.
- **Nuevo dato en Firestore:** funciones en `src/services/` y suscripción en `state/LigaProvider.jsx`.
- **Nuevo dato de Mister:** léelo en `sync/sync-mister.mjs` y guárdalo en el jugador.

## Desarrollo

```
npm install
npm run dev
```

Cada push a `main` compila y publica la web automáticamente.
