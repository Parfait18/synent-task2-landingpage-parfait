import { describe, expect, it } from 'vitest';
import {
  PRICING,
  PricingError,
  estimateDelivery,
  formatFcfa,
  straightLineKm,
} from './pricing.js';
import { ZONES, findZoneById } from '../data/zones.js';

const zone = (id) => findZoneById(id);

describe('straightLineKm', () => {
  it('should return 0 when both points are identical', () => {
    expect(straightLineKm(zone('ganhi'), zone('ganhi'))).toBe(0);
  });

  it('should be symmetric when pickup and drop-off are swapped', () => {
    const there = straightLineKm(zone('ganhi'), zone('calavi'));
    const back = straightLineKm(zone('calavi'), zone('ganhi'));
    expect(there).toBeCloseTo(back, 10);
  });

  it('should return about 111.19 km when the points are one degree of latitude apart', () => {
    // One degree of latitude on a 6371 km sphere is 2πR / 360 ≈ 111.19 km.
    expect(straightLineKm({ lat: 6, lng: 2 }, { lat: 7, lng: 2 })).toBeCloseTo(111.19, 1);
  });
});

describe('estimateDelivery', () => {
  it('should charge the minimum price when pickup and drop-off are the same zone', () => {
    const quote = estimateDelivery(zone('akpakpa'), zone('akpakpa'));
    expect(quote.priceFcfa).toBe(PRICING.MIN_PRICE);
    expect(quote.roadKm).toBe(0);
    expect(quote.minutes).toBe(PRICING.PICKUP_MINUTES);
  });

  it('should round the price up to the next 100 FCFA when the raw price is not round', () => {
    const { priceFcfa } = estimateDelivery(zone('ganhi'), zone('calavi'));
    expect(priceFcfa % PRICING.ROUNDING_STEP).toBe(0);
  });

  it('should add the medium surcharge when the parcel is medium', () => {
    const small = estimateDelivery(zone('ganhi'), zone('calavi'), 'small');
    const medium = estimateDelivery(zone('ganhi'), zone('calavi'), 'medium');
    expect(medium.priceFcfa - small.priceFcfa).toBe(PRICING.SIZE_SURCHARGE.medium);
  });

  it('should cost more when the drop-off is further away', () => {
    const near = estimateDelivery(zone('ganhi'), zone('dantokpa'));
    const far = estimateDelivery(zone('ganhi'), zone('calavi'));
    expect(far.priceFcfa).toBeGreaterThan(near.priceFcfa);
    expect(far.minutes).toBeGreaterThan(near.minutes);
  });

  it('should keep every route of the service area under 4 000 FCFA and 90 minutes', () => {
    // Guards the promise made on the page: "under an hour" for most routes,
    // and no route priced out of reach for a small merchant.
    for (const from of ZONES) {
      for (const to of ZONES) {
        const quote = estimateDelivery(from, to, 'medium');
        expect(quote.priceFcfa).toBeLessThan(4000);
        expect(quote.minutes).toBeLessThanOrEqual(90);
      }
    }
  });

  it('should throw UNKNOWN_SIZE when the parcel size is not supported', () => {
    expect(() => estimateDelivery(zone('ganhi'), zone('akpakpa'), 'huge')).toThrowError(
      expect.objectContaining({ name: 'PricingError', code: 'UNKNOWN_SIZE' }),
    );
  });

  it('should throw INVALID_ZONE when a zone is missing', () => {
    expect(() => estimateDelivery(undefined, zone('akpakpa'))).toThrow(PricingError);
    expect(() => estimateDelivery(zone('ganhi'), { lat: Number.NaN, lng: 2 })).toThrow(
      PricingError,
    );
  });
});

describe('formatFcfa', () => {
  it('should group thousands and append the currency when the amount is above 999', () => {
    // Intl uses a narrow no-break space (U+202F) as the group separator.
    expect(formatFcfa(1400)).toBe('1 400 FCFA');
  });

  it('should not add a separator when the amount is below 1000', () => {
    expect(formatFcfa(700)).toBe('700 FCFA');
  });
});
