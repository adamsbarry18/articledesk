/**
 * @typedef {import('./ipc.types.js').IpcResult} IpcResult
 */

export {};

declare global {
  interface Window {
    api: {
      auth: {
        login: (
          credentials: import('./index.js').LoginCredentials,
        ) => Promise<IpcResult>;
        signup: (
          payload: import('./index.js').SignupPayload,
        ) => Promise<IpcResult>;
        resetPassword: (email: string) => Promise<IpcResult>;
        checkToken: (token: string) => Promise<IpcResult>;
      };
      articles: {
        getAll: () => Promise<IpcResult>;
        getById: (id: string) => Promise<IpcResult>;
        save: (
          payload: import('./index.js').ArticleSavePayload,
        ) => Promise<IpcResult>;
        delete: (id: string) => Promise<IpcResult>;
      };
      healthCheck: () => Promise<IpcResult>;
    };
  }
}
