/**
 * @typedef {import('@shared/types/ipc.types').IpcResult} IpcResult
 */

/**
 * Erreur levée côté renderer lorsqu'un appel IPC échoue.
 */
export class IpcClientError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {*} [data]
   */
  constructor(code, message, data = null) {
    super(message);
    this.name = 'IpcClientError';
    this.code = code;
    this.data = data;
  }
}

/**
 * @param {Promise<IpcResult>} promise
 * @returns {Promise<*>}
 */
async function unwrap(promise) {
  const result = await promise;

  if (!result.ok) {
    throw new IpcClientError(
      result.error.code,
      result.error.message,
      result.error.data ?? null,
    );
  }

  return result.data;
}

/**
 * Client API côté renderer — passe par le pont IPC (window.api).
 * À utiliser dans les composants Vue à la place de fetch direct.
 */
export const electronApi = {
  auth: {
    /** @param {import('@shared/types').LoginCredentials} credentials */
    login: (credentials) => unwrap(window.api.auth.login(credentials)),

    /** @param {import('@shared/types').SignupPayload} payload */
    signup: (payload) => unwrap(window.api.auth.signup(payload)),

    /** @param {string} email */
    resetPassword: (email) => unwrap(window.api.auth.resetPassword(email)),

    /** @param {string} token */
    checkToken: (token) => unwrap(window.api.auth.checkToken(token)),
  },

  articles: {
    /** @returns {Promise<import('@shared/types').Article[]>} */
    getAll: () => unwrap(window.api.articles.getAll()),

    /** @param {string} id @returns {Promise<import('@shared/types').Article>} */
    getById: (id) => unwrap(window.api.articles.getById(id)),

    /** @param {import('@shared/types').ArticleSavePayload} payload */
    save: (payload) => unwrap(window.api.articles.save(payload)),

    /** @param {string} id */
    delete: (id) => unwrap(window.api.articles.delete(id)),
  },

  /** @returns {Promise<boolean>} */
  healthCheck: () => unwrap(window.api.healthCheck()),
};
