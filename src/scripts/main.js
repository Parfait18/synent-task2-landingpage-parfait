/**
 * Entry point: imports the styles and wires each interactive block.
 * Every block is optional, so a missing element never breaks the others.
 */
import '../styles/main.css';
import { initMobileNav } from './nav.js';
import { populateZoneSelects } from './zone-select.js';
import { initQuoteWidget } from './quote-widget.js';
import { renderPricingTable } from './pricing-table.js';
import { initWaitlistForm } from './waitlist-form.js';

const header = document.querySelector('header');
if (header) initMobileNav(header);

populateZoneSelects();

const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm) initQuoteWidget(quoteForm);

const pricingRows = document.querySelector('[data-pricing-rows]');
if (pricingRows) renderPricingTable(pricingRows);

const waitlist = document.querySelector('[data-waitlist]');
if (waitlist) initWaitlistForm(waitlist);

for (const element of document.querySelectorAll('[data-current-year]')) {
  element.textContent = String(new Date().getFullYear());
}
