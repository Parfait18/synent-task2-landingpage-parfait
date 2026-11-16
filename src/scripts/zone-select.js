import { ZONES } from '../data/zones.js';

/**
 * Fills every `<select data-zone-select="…">` with the served neighbourhoods.
 *
 * The attribute value is the initially selected zone id. An empty value adds
 * a disabled placeholder so the visitor has to make an explicit choice
 * (used by the waitlist form, where a default would bias the answer).
 *
 * Options are built with the DOM API, never with innerHTML, so zone names can
 * never be interpreted as markup.
 *
 * @param {ParentNode} root
 */
export function populateZoneSelects(root = document) {
  for (const select of root.querySelectorAll('select[data-zone-select]')) {
    const selectedId = select.dataset.zoneSelect;

    if (!selectedId) {
      const placeholder = new Option('Choose a neighbourhood', '', true, true);
      placeholder.disabled = true;
      select.append(placeholder);
    }

    for (const zone of ZONES) {
      const isSelected = zone.id === selectedId;
      select.append(new Option(zone.name, zone.id, isSelected, isSelected));
    }
  }
}
