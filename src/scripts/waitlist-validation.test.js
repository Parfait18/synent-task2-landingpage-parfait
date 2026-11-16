import { describe, expect, it } from 'vitest';
import {
  NAME_MAX_LENGTH,
  formatBeninPhone,
  normalizeBeninPhone,
  validateWaitlist,
} from './waitlist-validation.js';

const valid = { name: 'Boutique Akouavi', phone: '01 97 00 00 00', zone: 'akpakpa' };

describe('normalizeBeninPhone', () => {
  it.each([
    ['01 97 00 00 00'],
    ['+229 01 97 00 00 00'],
    ['00229 0197000000'],
    ['01-97-00-00-00'],
    ['(01) 97.00.00.00'],
  ])('should return 10 digits when the input is "%s"', (raw) => {
    expect(normalizeBeninPhone(raw)).toBe('0197000000');
  });
});

describe('formatBeninPhone', () => {
  it('should group digits by two when given a normalised number', () => {
    expect(formatBeninPhone('0197000000')).toBe('01 97 00 00 00');
  });
});

describe('validateWaitlist', () => {
  it('should accept the input and return cleaned values when every field is valid', () => {
    const result = validateWaitlist({ ...valid, name: '  Boutique   Akouavi ' });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.value).toEqual({ name: 'Boutique Akouavi', phone: '0197000000', zone: 'akpakpa' });
  });

  it('should accept accented names and shop punctuation when present', () => {
    expect(validateWaitlist({ ...valid, name: "Chez Sèna & Fils O'Neil-Store" }).isValid).toBe(true);
  });

  it('should report every invalid field at once when the form is empty', () => {
    const result = validateWaitlist({ name: '', phone: '', zone: '' });
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['name', 'phone', 'zone']);
    expect(result.value).toBeNull();
  });

  it('should reject the name when it contains markup characters', () => {
    const result = validateWaitlist({ ...valid, name: '<img src=x onerror=alert(1)>' });
    expect(result.errors.name).toBeDefined();
  });

  it('should reject the name when it is longer than the limit', () => {
    const result = validateWaitlist({ ...valid, name: 'a'.repeat(NAME_MAX_LENGTH + 1) });
    expect(result.errors.name).toMatch(/characters or fewer/);
  });

  it.each([['97000000'], ['0297000000'], ['01970000000'], ['01abc00000']])(
    'should reject the phone when it is "%s"',
    (phone) => {
      expect(validateWaitlist({ ...valid, phone }).errors.phone).toBeDefined();
    },
  );

  it('should reject the zone when it is not a served neighbourhood', () => {
    expect(validateWaitlist({ ...valid, zone: 'lagos' }).errors.zone).toBeDefined();
  });
});
