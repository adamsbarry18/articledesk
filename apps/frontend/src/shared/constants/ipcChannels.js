/** Canaux IPC — convention domaine:action */
export const IPC_CHANNELS = {
  AUTH_LOGIN: 'auth:login',
  AUTH_SIGNUP: 'auth:signup',
  AUTH_RESET_PASSWORD: 'auth:reset-password',
  AUTH_CHECK_TOKEN: 'auth:check-token',
  ARTICLES_LIST: 'articles:list',
  ARTICLES_GET: 'articles:get',
  ARTICLES_SAVE: 'articles:save',
  ARTICLES_DELETE: 'articles:delete',
  API_HEALTH_CHECK: 'api:health-check',
};
