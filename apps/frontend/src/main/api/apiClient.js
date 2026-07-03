import log from 'electron-log';
import { getEnv } from '@shared/config/env.js';
import { API_SUCCESS_CODE } from '@shared/constants/apiCodes.js';
import { ApiError, NetworkError } from './errors.js';

/**
 * Client HTTP centralisé pour le main process.
 * Tous les appels vers ApiArticle passent par cette couche.
 */
class ApiClient {
  constructor() {
    /** @type {string | null} */
    this._baseUrl = null;
  }

  /** @returns {string} */
  get baseUrl() {
    if (!this._baseUrl) {
      this._baseUrl = getEnv().apiBaseUrl;
    }
    return this._baseUrl;
  }

  /**
   * @param {string} path - Chemin relatif (ex. "/articles")
   * @param {import('@shared/types').RequestOptions & { method?: string }} [options]
   * @returns {Promise<import('@shared/types').ApiResponse>}
   */
  async request(path, options = {}) {
    const { method = 'GET', body, token, headers = {} } = options;
    const url = `${this.baseUrl}${path}`;

    /** @type {Record<string, string>} */
    const requestHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    };

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    log.debug(`[API] ${method} ${url}`);

    let response;
    try {
      response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      const message = `Impossible de joindre l'API (${url}). Vérifiez qu'ApiArticle est démarrée.`;
      log.error(`[API] ${message}`, error);
      throw new NetworkError(message, /** @type {Error} */ (error));
    }

    /** @type {import('@shared/types').ApiResponse} */
    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      const message = `Réponse JSON invalide depuis ${url} (HTTP ${response.status})`;
      log.error(`[API] ${message}`, error);
      throw new NetworkError(message, /** @type {Error} */ (error));
    }

    if (payload.code !== API_SUCCESS_CODE) {
      log.warn(`[API] Erreur métier ${payload.code}: ${payload.message}`);
      throw new ApiError(payload.code, payload.message, payload.data ?? null);
    }

    log.debug(`[API] Succès ${method} ${path} — ${payload.message}`);
    return payload;
  }

  /**
   * Vérifie que l'API est joignable (GET /articles).
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      await this.request('/articles');
      return true;
    } catch (error) {
      if (error instanceof NetworkError) {
        return false;
      }
      // L'API répond mais renvoie une erreur métier — elle est quand même joignable
      return true;
    }
  }
}

/** Instance singleton partagée par tous les services. */
export const apiClient = new ApiClient();
