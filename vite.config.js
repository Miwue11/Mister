import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona en miwue11.github.io/Mister/ y en cualquier otra ruta.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "dist", emptyOutDir: true }
});
