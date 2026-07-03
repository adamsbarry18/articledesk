/**
 * @typedef {Object} ApiResponse
 * @property {string} code - Code métier de la réponse (ex. "200", "768")
 * @property {string} message - Message lisible pour l'utilisateur ou les logs
 * @property {*} [data] - Payload optionnel selon le contexte
 */

/**
 * @typedef {Object} Article
 * @property {string} id - Identifiant unique (UUID pour les articles créés)
 * @property {string} title - Titre de l'article
 * @property {string} desc - Description / contenu
 * @property {string} author - Auteur de l'article
 * @property {string} [imgPath] - URL de l'image illustrant l'article
 */

/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} password
 * @property {string} pseudo
 * @property {string} cityCode
 * @property {string} city
 * @property {string} phone
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} SignupPayload
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} pseudo
 * @property {string} cityCode
 * @property {string} city
 * @property {string} phone
 */

/**
 * @typedef {Object} ArticleSavePayload
 * @property {string} [id] - Présent pour une mise à jour, absent pour une création
 * @property {string} title
 * @property {string} desc
 * @property {string} author
 * @property {string} [imgPath]
 */

/**
 * @typedef {Object} RequestOptions
 * @property {Record<string, string>} [headers]
 * @property {*} [body]
 * @property {string} [token] - JWT Bearer token
 */

export {};
