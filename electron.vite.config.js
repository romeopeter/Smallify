// Electron-vite configuration
import { defineConfig } from "electron-vite";

export default defineConfig({
  main: {
    build: {
      outDir: "dist/main",
      lib: {
        entry: "./src/main.js",
      },
    },
  },
  preload: {
    build: {
      outDir: "dist/preload",
      lib: {
        entry: "./src/script/preload.js",
      },
    },
  },
  renderer: {
    root: "./src/renderer",
    build: {
      outDir: "dist/renderer",
      // rollupOptions: { input: "./src/renderer/index.html" },
      minify: true,
    },
  },
});
