import {
  electronApi,
  IpcClientError,
} from '../renderer/api/electronApi.js';
import log from 'electron-log/renderer';

/**
 * @param {string} title
 * @returns {boolean}
 */
export function confirmDelete(title) {
  return window.confirm(
    `Supprimer l'article « ${title} » ?\n\nCette action est irréversible.`,
  );
}

/**
 * @param {string} id
 * @param {string} title
 * @returns {Promise<void>}
 */
export async function deleteArticle(id, title) {
  if (!confirmDelete(title)) {
    return;
  }

  try {
    await electronApi.articles.delete(id);
    log.info(`[Articles] Article ${id} supprimé`);
  } catch (err) {
    const message =
      err instanceof IpcClientError
        ? err.message
        : "Impossible de supprimer l'article";
    log.error(`[Articles] Échec suppression ${id}`, err);
    window.alert(message);
    throw err;
  }
}
