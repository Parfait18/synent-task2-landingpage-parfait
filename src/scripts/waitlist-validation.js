import { findZoneById } from '../data/zones.js';

/**
 * Waitlist input validation. Pure functions, unit-tested in
 * waitlist-validation.test.js.
 *
 * This is client-side validation for user feedback only. The form has no
 * backend in this project; any future endpoint must validate again on the
 * server (see docs/SPECIFICATION.md, section 6).
 */

export const NAME_MAX_LENGTH = 60;

// Letters from any script, spaces, and the punctuation found in shop names
// ("Chez Akouavi & Fils", "O'Neil-Store"). Rejects < > and other markup.
const NAME_PATTERN = /^[\p{L}\p{M}\p{N} .,'&-]+$/u;

// Since November 2024, Benin mobile numbers have 10 digits and start with 01.
const BENIN_MOBILE_PATTERN = /^01\d{8}$/;

/**
 * Normalises a phone number typed in any usual format to 10 digits.
 * "+229 01 97 00 00 00", "00229 0197000000" and "01-97-00-00-00" all
 * become "0197000000".
 *
 * @param {string} raw
 * @returns {string}
 */
export function normalizeBeninPhone(raw) {
  const digits = String(raw).replace(/[\s.()-]/g, '');
  return digits.replace(/^(\+|00)229/, '');
}

/**
 * Formats a normalised number for display: "01 97 00 00 00".
 *
 * @param {string} digits
 * @returns {string}
 */
export function formatBeninPhone(digits) {
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ');
}

/**
 * @typedef {Object} WaitlistInput
 * @property {string} name
 * @property {string} phone
 * @property {string} zone
 *
 * @typedef {Object} WaitlistResult
 * @property {boolean} isValid
 * @property {Partial<Record<keyof WaitlistInput, string>>} errors
 *   One message per invalid field, written to tell the visitor how to fix it.
 * @property {WaitlistInput | null} value  Cleaned values when valid.
 */

/**
 * @param {WaitlistInput} input
 * @returns {WaitlistResult}
 */
export function validateWaitlist(input) {
  const errors = {};

  const name = String(input.name ?? '').trim().replace(/\s+/g, ' ');
  if (name.length === 0) {
    errors.name = 'Enter your name or the name of your shop.';
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Use ${NAME_MAX_LENGTH} characters or fewer.`;
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = 'Use letters, numbers, spaces and . , \' & - only.';
  }

  const phone = normalizeBeninPhone(input.phone ?? '');
  if (phone.length === 0) {
    errors.phone = 'Enter the WhatsApp number we should text.';
  } else if (!BENIN_MOBILE_PATTERN.test(phone)) {
    errors.phone = 'Enter a 10-digit Benin number starting with 01, for example 01 97 00 00 00.';
  }

  const zone = String(input.zone ?? '');
  if (!findZoneById(zone)) {
    errors.zone = 'Choose the neighbourhood you ship from.';
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors, value: isValid ? { name, phone, zone } : null };
}
