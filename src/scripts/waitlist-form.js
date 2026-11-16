import { findZoneById } from '../data/zones.js';
import { formatBeninPhone, validateWaitlist } from './waitlist-validation.js';

/**
 * Waitlist form behaviour: validates on submit, shows one message per field,
 * then replaces the form with a confirmation.
 *
 * There is no backend in this project: the confirmation is shown locally and
 * nothing is stored or sent. Messages are written with textContent only, so
 * the visitor's input can never be interpreted as HTML.
 *
 * @param {HTMLElement} container The `[data-waitlist]` element.
 */
export function initWaitlistForm(container) {
  const form = container.querySelector('[data-waitlist-form]');
  const success = container.querySelector('[data-waitlist-success]');
  const successMessage = container.querySelector('[data-waitlist-success-message]');

  // Once a field has been flagged, re-check it as the visitor corrects it.
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field.getAttribute('aria-invalid') !== 'true') return;
    const { errors } = validateWaitlist(readForm(form));
    showFieldError(form, field.name, errors[field.name]);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { isValid, errors, value } = validateWaitlist(readForm(form));

    for (const name of ['name', 'phone', 'zone']) {
      showFieldError(form, name, errors[name]);
    }

    if (!isValid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    successMessage.textContent =
      `Thanks, ${value.name}. We will text ${formatBeninPhone(value.phone)} on WhatsApp ` +
      `as soon as Zémi opens in ${findZoneById(value.zone).name}.`;
    form.hidden = true;
    success.hidden = false;
  });
}

function readForm(form) {
  const data = new FormData(form);
  return {
    name: String(data.get('name') ?? ''),
    phone: String(data.get('phone') ?? ''),
    zone: String(data.get('zone') ?? ''),
  };
}

function showFieldError(form, name, message) {
  const field = form.elements.namedItem(name);
  const errorEl = form.querySelector(`[data-error-for="${name}"]`);
  const hasError = Boolean(message);

  field.setAttribute('aria-invalid', String(hasError));
  errorEl.textContent = message ?? '';
  errorEl.hidden = !hasError;
}
