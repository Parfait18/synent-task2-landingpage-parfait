import { findZoneById } from '../data/zones.js';
import { estimateDelivery, formatAmount } from './pricing.js';

/**
 * Wires the hero estimator: every change of pickup, drop-off or size
 * recomputes the quote and updates the price, time and distance.
 *
 * @param {HTMLFormElement} form The `[data-quote-form]` element.
 */
export function initQuoteWidget(form) {
  const priceEl = form.querySelector('[data-quote-price]');
  const amountEl = form.querySelector('[data-quote-amount]');
  const minutesEl = form.querySelector('[data-quote-minutes]');
  const distanceEl = form.querySelector('[data-quote-distance]');

  const render = ({ animate }) => {
    const data = new FormData(form);
    const pickup = findZoneById(String(data.get('pickup')));
    const dropoff = findZoneById(String(data.get('dropoff')));
    const quote = estimateDelivery(pickup, dropoff, String(data.get('size')));

    amountEl.textContent = formatAmount(quote.priceFcfa);
    minutesEl.textContent = `about ${quote.minutes} min`;
    distanceEl.textContent = quote.roadKm === 0 ? 'same area' : `${quote.roadKm} km`;

    if (animate) replayTick(priceEl);
  };

  // The form never submits: everything happens live on change.
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('change', () => render({ animate: true }));
  render({ animate: false });
}

/** Restarts the CSS "tick" animation on the price. */
function replayTick(element) {
  element.dataset.changed = 'false';
  // Reading offsetWidth forces a reflow, which lets the animation restart.
  void element.offsetWidth;
  element.dataset.changed = 'true';
}
