import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { App } from "./App.jsx";
import { LigaProvider } from "./state/LigaProvider.jsx";
import { ToastProvider } from "./state/ToastProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <LigaProvider>
        <App />
      </LigaProvider>
    </ToastProvider>
  </StrictMode>
);

// Permite instalar la app en el móvil.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
