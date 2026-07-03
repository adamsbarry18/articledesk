/**
 * @typedef {Object} IpcErrorPayload
 * @property {string} code - Code métier ou 'NETWORK' / 'UNKNOWN'
 * @property {string} message - Message lisible
 * @property {*} [data]
 */

/**
 * @typedef {Object} IpcSuccess
 * @property {true} ok
 * @property {*} data
 */

/**
 * @typedef {Object} IpcFailure
 * @property {false} ok
 * @property {IpcErrorPayload} error
 */

/**
 * @typedef {IpcSuccess | IpcFailure} IpcResult
 */

export {};
