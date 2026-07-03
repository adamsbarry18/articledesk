import log from 'electron-log';
import { ApiError, NetworkError } from '@main/api/errors.js';

/**
 * @typedef {import('@shared/types/ipc.types').IpcResult} IpcResult
 */

/**
 * Enveloppe un handler IPC pour renvoyer un format uniforme { ok, data } | { ok, error }.
 * Les erreurs sérialisables traversent le pont preload/renderer sans perdre le code métier.
 *
 * @param {string} channel
 * @param {(...args: unknown[]) => Promise<*>} handler
 * @returns {(...args: unknown[]) => Promise<IpcResult>}
 */
export function wrapIpcHandler(channel, handler) {
  return async (...args) => {
    try {
      const data = await handler(...args);
      return { ok: true, data };
    } catch (error) {
      if (error instanceof ApiError) {
        log.warn(`[IPC] ${channel} — ${error.code}: ${error.message}`);
        return {
          ok: false,
          error: { code: error.code, message: error.message, data: error.data },
        };
      }

      if (error instanceof NetworkError) {
        log.error(`[IPC] ${channel} — réseau: ${error.message}`);
        return {
          ok: false,
          error: { code: 'NETWORK', message: error.message },
        };
      }

      const message =
        error instanceof Error ? error.message : 'Erreur inattendue';
      log.error(`[IPC] ${channel} — ${message}`, error);
      return {
        ok: false,
        error: { code: 'UNKNOWN', message },
      };
    }
  };
}
