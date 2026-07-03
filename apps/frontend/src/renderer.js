/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// Inject a Content-Security-Policy meta tag as early as possible (before other imports)
(function injectCSP() {
  try {
    const isDev =
      typeof import.meta !== 'undefined' &&
      !!import.meta.env &&
      !!import.meta.env.DEV;
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    if (isDev) {
      // Dev: Vite needs 'unsafe-eval' for source maps — this will trigger Electron's warning in dev.
      meta.content =
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https:; connect-src *;";
    } else {
      // Prod: stricter CSP without 'unsafe-eval'
      meta.content =
        "default-src 'self'; script-src 'self'; object-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self';";
    }
    const head =
      document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(meta, head.firstChild);
  } catch (e) {
    // No-op si injection impossible
  }
})();

import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuth } from './composables/useAuth.js';

async function bootstrap() {
  const { initAuth } = useAuth();
  await initAuth();

  const app = createApp(App);
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

bootstrap();
