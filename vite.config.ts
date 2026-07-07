import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer subpasta (ex.: GitHub Pages)
  base: "./",
  plugins: [react(), tailwindcss()],
  // Respeita a porta atribuída pelo ambiente (ex.: preview do Claude Code)
  server: { port: Number(process.env.PORT) || 5173 },
});
