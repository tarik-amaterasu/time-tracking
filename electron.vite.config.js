import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  publicDir: true,
  main: {},
  preload: {},
  renderer: {
    plugins: [react()],
    pluginsOptions: {
      nodeIntegration: true,
    },
  },
});
