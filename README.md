# Zémi: responsive landing page

Landing page for **Zémi**, a fictional on-demand moto courier service in Cotonou, Benin.
Built for the **Synent Technologies web development internship, Task 2: Responsive Landing Page**.

> Zémi is invented for this exercise. Prices, coverage and dates are illustrative.

## Features

- **Live delivery estimator in the hero.** Pick a pickup, a drop-off and a parcel size, and the
  price, time and distance update immediately.
- **Four features, a three-step "how it works" and a price table.** The table is generated from
  the same estimator as the hero, so the two always agree.
- **Waitlist form** with Benin phone number validation and accessible error messages.
- **Responsive, mobile-first layout** with a hamburger menu below 768 px.
- **Strict security headers.** The Content-Security-Policy has no `unsafe-inline`, fonts are
  self-hosted and nothing is loaded from a third party.
- **Accessible:** skip link, labelled landmarks, live price announced to screen readers, keyboard
  support and support for reduced motion.

## Tech stack

| Tool | Role |
|---|---|
| HTML, CSS, JavaScript (ES modules) | The page itself, no framework |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility classes and design tokens |
| [Basecoat](https://basecoatui.com) | shadcn/ui components in plain HTML and CSS |
| [Archivo](https://fontsource.org/fonts/archivo) (Fontsource) | Self-hosted variable font |
| [Vite](https://vite.dev) | Dev server and production build |
| [Vitest](https://vitest.dev) | Unit tests |

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev       # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with hot reload |
| `npm test` | Runs the unit tests once |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves `dist/` with the production security headers |

## Project structure

```
.
├── index.html                    # The page: semantic sections, Basecoat markup
├── public/favicon.svg
├── src/
│   ├── data/zones.js             # Served neighbourhoods and their coordinates
│   ├── scripts/
│   │   ├── main.js               # Entry point: wires each block
│   │   ├── pricing.js            # Price and time model (pure, tested)
│   │   ├── waitlist-validation.js# Form validation (pure, tested)
│   │   ├── quote-widget.js       # Hero estimator (DOM)
│   │   ├── pricing-table.js      # Price table (DOM)
│   │   ├── waitlist-form.js      # Waitlist behaviour (DOM)
│   │   ├── zone-select.js        # Fills the neighbourhood selects
│   │   ├── nav.js                # Mobile navigation
│   │   └── *.test.js             # Unit tests
│   └── styles/main.css           # Tokens, Basecoat theme, page components
├── docs/SPECIFICATION.md         # Requirements, pricing model, design, security
├── vercel.json                   # Security headers for production
└── vite.config.js
```

## Documentation

The full specification is in [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md). It covers the
functional requirements, the pricing model, the design system, the security measures, accessibility
and responsive behaviour.

## Deployment

The project deploys as a static site. On Vercel, import the repository and keep the defaults:
build command `npm run build`, output directory `dist`. `vercel.json` adds the security headers.

## Author

**Parfait Ahouanto**, [github.com/Parfait18](https://github.com/Parfait18)

## License

[MIT](LICENSE)
