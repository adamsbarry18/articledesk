import { AUTH_ENDPOINTS } from '@shared/constants/apiEndpoints.js';
import { apiClient } from '../apiClient.js';

/**
 * Service d'authentification — encapsule les appels vers ApiArticle.
 */
export const authService = {
  /**
   * @param {import('@shared/types').LoginCredentials} credentials
   * @returns {Promise<string>} JWT token
   */
  async login(credentials) {
    const response = await apiClient.request(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: credentials,
    });
    return /** @type {string} */ (response.data);
  },

  /**
   * @param {import('@shared/types').SignupPayload} payload
   * @returns {Promise<import('@shared/types').User>}
   */
  async signup(payload) {
    const response = await apiClient.request(AUTH_ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: payload,
    });
    return /** @type {import('@shared/types').User} */ (response.data);
  },

  /**
   * @param {string} email
   * @returns {Promise<string>} Nouveau mot de passe généré
   */
  async resetPassword(email) {
    const response = await apiClient.request(AUTH_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: { email },
    });
    return /** @type {string} */ (response.data);
  },

  /**
   * Vérifie la validité d'un token JWT.
   * @param {string} token
   * @returns {Promise<{ message: string }>}
   */
  async checkToken(token) {
    const url = `${apiClient.baseUrl}${AUTH_ENDPOINTS.CHECK}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
