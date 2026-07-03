import { ARTICLE_ENDPOINTS } from '@shared/constants/apiEndpoints.js';
import { apiClient } from '../apiClient.js';

/**
 * Service articles — encapsule les opérations CRUD sur ApiArticle.
 */
export const articlesService = {
  /**
   * @returns {Promise<import('@shared/types').Article[]>}
   */
  async getAll() {
    const response = await apiClient.request(ARTICLE_ENDPOINTS.LIST);
    return /** @type {import('@shared/types').Article[]} */ (response.data);
  },

  /**
   * @param {string} id
   * @returns {Promise<import('@shared/types').Article>}
   */
  async getById(id) {
    const response = await apiClient.request(ARTICLE_ENDPOINTS.BY_ID(id));
    return /** @type {import('@shared/types').Article} */ (response.data);
  },

  /**
   * Crée ou met à jour un article (POST /articles/save).
   * @param {import('@shared/types').ArticleSavePayload} payload
   * @returns {Promise<import('@shared/types').Article>}
   */
  async save(payload) {
    const response = await apiClient.request(ARTICLE_ENDPOINTS.SAVE, {
      method: 'POST',
      body: payload,
    });
    return /** @type {import('@shared/types').Article} */ (response.data);
  },

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await apiClient.request(ARTICLE_ENDPOINTS.BY_ID(id), {
      method: 'DELETE',
    });
  },
};
