import { ipcMain } from 'electron';
import log from 'electron-log';
import {
  apiClient,
  authService,
  articlesService,
} from '@main/api/index.js';
import { IPC_CHANNELS } from '@shared/constants/ipcChannels.js';
import { wrapIpcHandler } from './ipcUtils.js';

/**
 * Enregistre tous les handlers IPC du main process.
 * À appeler une seule fois au démarrage de l'application.
 */
export function registerIpcHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.AUTH_LOGIN,
    wrapIpcHandler(IPC_CHANNELS.AUTH_LOGIN, (_event, credentials) =>
      authService.login(credentials),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.AUTH_SIGNUP,
    wrapIpcHandler(IPC_CHANNELS.AUTH_SIGNUP, (_event, payload) =>
      authService.signup(payload),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.AUTH_RESET_PASSWORD,
    wrapIpcHandler(IPC_CHANNELS.AUTH_RESET_PASSWORD, (_event, email) =>
      authService.resetPassword(email),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.AUTH_CHECK_TOKEN,
    wrapIpcHandler(IPC_CHANNELS.AUTH_CHECK_TOKEN, (_event, token) =>
      authService.checkToken(token),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.ARTICLES_LIST,
    wrapIpcHandler(IPC_CHANNELS.ARTICLES_LIST, () =>
      articlesService.getAll(),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.ARTICLES_GET,
    wrapIpcHandler(IPC_CHANNELS.ARTICLES_GET, (_event, id) =>
      articlesService.getById(id),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.ARTICLES_SAVE,
    wrapIpcHandler(IPC_CHANNELS.ARTICLES_SAVE, (_event, payload) =>
      articlesService.save(payload),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.ARTICLES_DELETE,
    wrapIpcHandler(IPC_CHANNELS.ARTICLES_DELETE, (_event, id) =>
      articlesService.delete(id),
    ),
  );

  ipcMain.handle(
    IPC_CHANNELS.API_HEALTH_CHECK,
    wrapIpcHandler(IPC_CHANNELS.API_HEALTH_CHECK, () =>
      apiClient.healthCheck(),
    ),
  );

  log.info('[IPC] Handlers enregistrés');
}
