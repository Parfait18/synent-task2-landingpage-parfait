import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    // Inline nothing: every asset stays a separate file so the strict
    // Content-Security-Policy in vercel.json never needs 'unsafe-inline'.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
