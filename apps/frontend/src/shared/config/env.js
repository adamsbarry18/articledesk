import 'dotenv/config';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

/**
 * Retourne la configuration d'environnement validée pour le main process.
 * @returns {{ apiBaseUrl: string, nodeEnv: string, isDev: boolean }}
 */
export function getEnv() {
  const apiBaseUrl = (process.env.API_BASE_URL || DEFAULT_API_BASE_URL).replace(
    /\/$/,
    '',
  );

  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    apiBaseUrl,
    nodeEnv,
    isDev: nodeEnv !== 'production',
  };
}

/**
 * Valide les variables critiques au démarrage de l'application.
 * @returns {ReturnType<typeof getEnv>}
 */
export function validateEnv() {
  const env = getEnv();

  try {
    new URL(env.apiBaseUrl);
  } catch {
    throw new Error(
      `API_BASE_URL invalide : "${env.apiBaseUrl}". Exemple : http://localhost:3000`,
    );
  }

  return env;
}
