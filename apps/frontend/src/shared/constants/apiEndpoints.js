/** Routes d'authentification (racine de l'API). */
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  CHECK: '/check',
};

/** Routes de gestion des articles. */
export const ARTICLE_ENDPOINTS = {
  LIST: '/articles',
  BY_ID: (id) => `/articles/${id}`,
  SAVE: '/articles/save',
};
