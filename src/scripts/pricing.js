/**
 * Delivery price and time estimator.
 *
 * Pure functions only: no DOM access, so the whole pricing model is covered
 * by unit tests (see pricing.test.js) and can be reused server-side later.
 *
 * Model (documented in docs/SPECIFICATION.md, section 4):
 *   road distance = straight-line distance × ROAD_FACTOR
 *   price         = BASE_FEE + road km × PER_KM_FEE + size surcharge,
 *                   rounded up to the next 100 FCFA, never below MIN_PRICE
 *   duration      = PICKUP_MINUTES + road km × MINUTES_PER_KM, rounded up to 5 min
 */

export const PRICING = Object.freeze({
  BASE_FEE: 500,
  PER_KM_FEE: 150,
  MIN_PRICE: 700,
  ROUNDING_STEP: 100,
  // Cotonou streets are far from straight lines; 1.3 matches observed rides.
  ROAD_FACTOR: 1.3,
  PICKUP_MINUTES: 15,
  // A moto averages about 20 km/h in city traffic.
  MINUTES_PER_KM: 3,
  SIZE_SURCHARGE: Object.freeze({ small: 0, medium: 300 }),
});

const EARTH_RADIUS_KM = 6371;

export class PricingError extends Error {
  /**
   * @param {'UNKNOWN_SIZE' | 'INVALID_ZONE'} code
   * @param {string} message
   */
  constructor(code, message) {
    super(message);
    this.name = 'PricingError';
    this.code = code;
  }
}

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const roundUpTo = (value, step) => Math.ceil(value / step) * step;

/**
 * Great-circle distance between two points (haversine formula).
 *
 * @param {{lat: number, lng: number}} from
 * @param {{lat: number, lng: number}} to
 * @returns {number} Distance in kilometres.
 */
export function straightLineKm(from, to) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

function assertZone(zone, label) {
  const isValid =
    zone && Number.isFinite(zone.lat) && Number.isFinite(zone.lng);
  if (!isValid) {
    throw new PricingError('INVALID_ZONE', `${label} zone is missing or has no coordinates.`);
  }
}

/**
 * Estimates a delivery between two zones.
 *
 * @param {{lat: number, lng: number}} pickup
 * @param {{lat: number, lng: number}} dropoff
 * @param {'small' | 'medium'} [size='small']
 * @returns {{priceFcfa: number, minutes: number, roadKm: number}}
 * @throws {PricingError} When a zone is invalid or the size is unknown.
 */
export function estimateDelivery(pickup, dropoff, size = 'small') {
  assertZone(pickup, 'Pickup');
  assertZone(dropoff, 'Drop-off');

  const surcharge = PRICING.SIZE_SURCHARGE[size];
  if (surcharge === undefined) {
    throw new PricingError('UNKNOWN_SIZE', `Unknown parcel size "${size}".`);
  }

  const roadKm = straightLineKm(pickup, dropoff) * PRICING.ROAD_FACTOR;
  const rawPrice = PRICING.BASE_FEE + roadKm * PRICING.PER_KM_FEE + surcharge;
  const priceFcfa = Math.max(
    PRICING.MIN_PRICE,
    roundUpTo(rawPrice, PRICING.ROUNDING_STEP),
  );
  const minutes = roundUpTo(PRICING.PICKUP_MINUTES + roadKm * PRICING.MINUTES_PER_KM, 5);

  return { priceFcfa, minutes, roadKm: Math.round(roadKm * 10) / 10 };
}

const fcfaFormatter = new Intl.NumberFormat('fr-FR');

/**
 * Formats an amount the way prices are written in Benin: "1 400 FCFA".
 * Intl uses a narrow no-break space as group separator, which keeps the
 * number on one line.
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatFcfa(amount) {
  return `${fcfaFormatter.format(amount)} FCFA`;
}
