import { ref, computed } from 'vue';
import log from 'electron-log/renderer';
import {
  electronApi,
  IpcClientError,
} from '../renderer/api/electronApi.js';
import { AUTH_STORAGE_KEYS } from '@shared/constants/auth.js';

const token = ref(localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN) ?? '');
const email = ref(localStorage.getItem(AUTH_STORAGE_KEYS.EMAIL) ?? '');
const loading = ref(false);
let sessionValidated = false;

/**
 * Gestion centralisée de l'authentification (état singleton partagé).
 */
export function useAuth() {
  const isAuthenticated = computed(() => Boolean(token.value));

  /**
   * Valide le token stocké auprès de l'API.
   * @returns {Promise<boolean>}
   */
  async function initAuth() {
    if (!token.value) {
      sessionValidated = true;
      return false;
    }

    try {
      const result = await electronApi.auth.checkToken(token.value);
      if (!result?.message?.toLowerCase().includes('connecté')) {
        logout();
        return false;
      }
      sessionValidated = true;
      return true;
    } catch (err) {
      log.warn('[Auth] Session invalide, déconnexion', err);
      logout();
      sessionValidated = true;
      return false;
    }
  }

  /**
   * @param {import('@shared/types').LoginCredentials} credentials
   * @returns {Promise<string>} JWT token
   */
  async function login(credentials) {
    loading.value = true;
    try {
      const jwt = await electronApi.auth.login(credentials);
      token.value = jwt;
      email.value = credentials.email;
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, jwt);
      localStorage.setItem(AUTH_STORAGE_KEYS.EMAIL, credentials.email);
      sessionValidated = true;
      log.info('[Auth] Connexion réussie');
      return jwt;
    } catch (err) {
      if (err instanceof IpcClientError) {
        log.warn(`[Auth] Échec connexion — ${err.message}`);
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * @param {import('@shared/types').SignupPayload} payload
   * @returns {Promise<import('@shared/types').User>}
   */
  async function register(payload) {
    loading.value = true;
    try {
      const user = await electronApi.auth.signup(payload);
      log.info('[Auth] Inscription réussie');
      return user;
    } catch (err) {
      if (err instanceof IpcClientError) {
        log.warn(`[Auth] Échec inscription — ${err.message}`);
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = '';
    email.value = '';
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.EMAIL);
    sessionValidated = true;
    log.info('[Auth] Déconnexion');
  }

  /**
   * @returns {Promise<boolean>} true si la session a déjà été validée
   */
  async function ensureSessionChecked() {
    if (sessionValidated) {
      return isAuthenticated.value;
    }
    return initAuth();
  }

  return {
    token,
    email,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
    ensureSessionChecked,
  };
}
