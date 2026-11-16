/**
 * Neighbourhoods served by Zémi in Greater Cotonou.
 *
 * Coordinates are approximate neighbourhood centroids (WGS84). They only feed
 * the price estimator, so a precision of about 300 m is more than enough.
 *
 * @typedef {Object} Zone
 * @property {string} id    Stable identifier used in form values.
 * @property {string} name  Display name.
 * @property {number} lat   Latitude in decimal degrees.
 * @property {number} lng   Longitude in decimal degrees.
 */

/** @type {ReadonlyArray<Zone>} */
export const ZONES = Object.freeze([
  { id: 'ganhi', name: 'Ganhi', lat: 6.357, lng: 2.433 },
  { id: 'dantokpa', name: 'Dantokpa', lat: 6.368, lng: 2.438 },
  { id: 'akpakpa', name: 'Akpakpa', lat: 6.36, lng: 2.458 },
  { id: 'gbegamey', name: 'Gbégamey', lat: 6.373, lng: 2.406 },
  { id: 'cadjehoun', name: 'Cadjèhoun', lat: 6.364, lng: 2.387 },
  { id: 'fidjrosse', name: 'Fidjrossè', lat: 6.369, lng: 2.346 },
  { id: 'godomey', name: 'Godomey', lat: 6.404, lng: 2.342 },
  { id: 'calavi', name: 'Abomey-Calavi', lat: 6.448, lng: 2.356 },
]);

/**
 * @param {string} id
 * @returns {Zone | undefined}
 */
export function findZoneById(id) {
  return ZONES.find((zone) => zone.id === id);
}
