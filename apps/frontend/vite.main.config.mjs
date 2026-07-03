import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@main': path.resolve(__dirname, 'src/main'),
    },
  },
  define: {
    MAIN_WINDOW_VITE_DEV_SERVER_URL: 'undefined',
    MAIN_WINDOW_VITE_NAME: JSON.stringify('main_window'),
  },
  build: {
    outDir: '.vite/build',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    // Ne pas externaliser electron-log / electron-squirrel-startup :
    // le paquet asar ne contient pas node_modules, ces deps doivent être bundlées.
    rollupOptions: {
      external: ['electron', 'electron/main'],
    },
  },
});
