import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

/**
 * Security headers are declared once, in vercel.json (production). They are
 * re-applied to `vite preview` so the Content-Security-Policy is exercised
 * locally against the production build before every deploy.
 * They are not applied to `vite dev`: its hot-reload client relies on inline
 * scripts and a WebSocket that a strict CSP would block.
 */
function readProductionHeaders() {
  const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'));
  const catchAll = config.headers.find((rule) => rule.source === '/(.*)');
  // HSTS and upgrade-insecure-requests only make sense over HTTPS.
  return Object.fromEntries(
    catchAll.headers
      .filter(({ key }) => key !== 'Strict-Transport-Security')
      .map(({ key, value }) => [key, value.replace('; upgrade-insecure-requests', '')]),
  );
}

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    // Keep every asset a separate file so the CSP never needs 'unsafe-inline'.
    assetsInlineLimit: 0,
  },
  preview: {
    headers: readProductionHeaders(),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
