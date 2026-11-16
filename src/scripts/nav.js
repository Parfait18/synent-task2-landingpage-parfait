const DESKTOP_QUERY = '(min-width: 48rem)';

/**
 * Mobile navigation (hamburger) behaviour.
 *
 * Accessibility contract:
 * - the toggle exposes its state through aria-expanded and a text label;
 * - Escape closes the menu and returns focus to the toggle;
 * - following a link closes the menu so the target section is visible;
 * - resizing to desktop resets the state, the links are always shown there.
 *
 * @param {HTMLElement} header The site header containing the toggle.
 */
export function initMobileNav(header) {
  const toggle = header.querySelector('[data-nav-toggle]');
  const panel = header.querySelector('#site-nav-panel');
  if (!toggle || !panel) return;

  const label = toggle.querySelector('[data-nav-toggle-label]');
  const openIcon = toggle.querySelector('[data-nav-icon="open"]');
  const closeIcon = toggle.querySelector('[data-nav-icon="close"]');

  const setOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    panel.dataset.open = String(isOpen);
    label.textContent = isOpen ? 'Close menu' : 'Open menu';
    openIcon.toggleAttribute('hidden', isOpen);
    closeIcon.toggleAttribute('hidden', !isOpen);
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
