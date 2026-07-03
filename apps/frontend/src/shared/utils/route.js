/**
 * Normalise un paramètre de route Vue Router en string.
 * `route.params` peut être `string | string[]` selon la config du routeur.
 *
 * @param {import('vue-router').RouteLocationNormalizedLoaded} route
 * @param {string} key
 * @returns {string}
 */
export function getRouteParam(route, key) {
  const value = route.params[key];
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}
