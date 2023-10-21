// Electron-vite configuration
import { defineConfig } from 'electron-vite'

export default defineConfig({
    main: {
      build: {
        outDir: 'dist/main',
        lib: {
            entry: "./src/main.js"
        }
      }
    },
    preload: {
      build: {
        outDir: 'dist/preload',
        lib: {
            entry: "./src/renderer/js/script.js"
        }
      }
    },
    renderer: {
      build: {
        outDir: 'dist/renderer'
      }
    }
  })
  