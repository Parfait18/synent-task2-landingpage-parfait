import { ZONES, findZoneById } from '../data/zones.js';
import { estimateDelivery, formatFcfa } from './pricing.js';

const ORIGIN_ZONE_ID = 'ganhi';

/**
 * Renders the "Prices from Ganhi" table from the same estimator as the hero
 * widget, so the two can never disagree.
 *
 * @param {HTMLTableSectionElement} tbody The `[data-pricing-rows]` element.
 */
export function renderPricingTable(tbody) {
  const origin = findZoneById(ORIGIN_ZONE_ID);

  const rows = ZONES.filter((zone) => zone.id !== ORIGIN_ZONE_ID)
    .map((zone) => ({ zone, quote: estimateDelivery(origin, zone, 'small') }))
    .sort((a, b) => a.quote.priceFcfa - b.quote.priceFcfa)
    .map(({ zone, quote }) => {
      const row = document.createElement('tr');
      row.append(
        cell('th', zone.name, { scope: 'row', className: 'font-medium' }),
        cell('td', formatFcfa(quote.priceFcfa), { className: 'text-right tabular-nums' }),
        cell('td', `${quote.minutes} min`, { className: 'text-right tabular-nums' }),
      );
      return row;
    });

  tbody.replaceChildren(...rows);
}

function cell(tag, text, { scope, className } = {}) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (scope) element.scope = scope;
  if (className) element.className = className;
  return element;
}
