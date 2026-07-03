/**
 * Erreur métier levée lorsque l'API renvoie un code différent de "200".
 */
export class ApiError extends Error {
  /**
   * @param {string} code - Code métier de l'API
   * @param {string} message - Message d'erreur
   * @param {*} [data] - Données optionnelles associées à l'erreur
   */
  constructor(code, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

/**
 * Erreur réseau ou de parsing JSON.
 */
export class NetworkError extends Error {
  /**
   * @param {string} message
   * @param {Error} [cause]
   */
  constructor(message, cause) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}
