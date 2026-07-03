// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/constants/ipcChannels.js';

/**
 * Pont sécurisé main ↔ renderer.
 * Seules les méthodes exposées ici sont accessibles depuis Vue.
 */
const api = {
  auth: {
    login: (credentials) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGIN, credentials),
    signup: (payload) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH_SIGNUP, payload),
    resetPassword: (email) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH_RESET_PASSWORD, email),
    checkToken: (token) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH_CHECK_TOKEN, token),
  },
  articles: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.ARTICLES_LIST),
    getById: (id) => ipcRenderer.invoke(IPC_CHANNELS.ARTICLES_GET, id),
    save: (payload) => ipcRenderer.invoke(IPC_CHANNELS.ARTICLES_SAVE, payload),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.ARTICLES_DELETE, id),
  },
  healthCheck: () => ipcRenderer.invoke(IPC_CHANNELS.API_HEALTH_CHECK),
};

contextBridge.exposeInMainWorld('api', api);
