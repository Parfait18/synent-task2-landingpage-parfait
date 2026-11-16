# Zémi landing page: specification

| | |
|---|---|
| Project | Synent Technologies web development internship, Task 2 (Responsive Landing Page) |
| Author | Parfait Ahouanto |
| Version | 1.0.0 |
| Status | Delivered |

## 1. Context and objective

Task 2 asks for a responsive landing page for a product or service, built with HTML and CSS, with
at least a hero section, three to four features and a footer, and a correct layout on mobile and
desktop.

This project answers the brief with a landing page for **Zémi**, a fictional on-demand courier
service that uses moto-taxi riders (*zémidjans*) to carry parcels across Greater Cotonou, Benin.
Zémi is invented for this exercise. It does not exist and is not affiliated with any company.

## 2. Audience and primary job

- **Audience:** small merchants in Cotonou who sell through WhatsApp and Instagram and today
  deliver orders themselves or negotiate with a rider at a junction.
- **Primary job of the page:** show a merchant, in a few seconds, what a delivery costs and how
  long it takes, then get them to join the waitlist.

## 3. Functional requirements

| ID | Requirement | Where |
|---|---|---|
| F1 | A hero states the promise and leads to the waitlist. | `index.html`, hero section |
| F2 | The visitor can estimate a delivery by choosing pickup, drop-off and parcel size. Price, time and distance update immediately. | `quote-widget.js` |
| F3 | Four features explain the service. | `#features` |
| F4 | A three-step sequence explains how an order works. | `#how-it-works` |
| F5 | A price table lists every route from Ganhi, using the same estimator as F2 so the two never disagree. | `pricing-table.js` |
| F6 | The visitor can join a waitlist. Each field is validated, errors say how to fix them, and success is confirmed. | `waitlist-form.js`, `waitlist-validation.js` |
| F7 | Mobile navigation opens and closes with a hamburger button, Escape, or by following a link. | `nav.js` |
| F8 | The footer repeats the navigation and states that the product is fictional. | `<footer>` |

**Out of scope.** There is no backend: the waitlist confirmation is shown locally and nothing is
stored or sent. A real deployment would post to an API that validates the input again on the server
(see section 6).

## 4. Pricing model

The estimator lives in `src/scripts/pricing.js`. It is a set of pure functions covered by unit tests.

```
road distance (km) = haversine distance between zone centroids × 1.3
price (FCFA)       = 500 + 150 × road km + size surcharge (small 0, medium 300)
                     rounded up to the next 100, minimum 700
time (min)         = 15 (pickup) + 3 × road km, rounded up to the next 5
```

- **Why 1.3:** the factor turns a straight line into an approximate road distance in Cotonou's
  street grid.
- **Why 3 min/km:** a moto averages about 20 km/h in city traffic.
- **Guard:** a test checks that every route in the service area stays under 4 000 FCFA and 90
  minutes. If the constants change, that test catches it before the page breaks its own promise.

## 5. Design

### 5.1 Direction

The brand borrows from the street it serves. Cotonou's moto-taxi riders wear yellow jerseys printed
with a large registration number. The page uses that yellow as its one loud colour, and the jersey
number as its typographic signature: the live price in the hero is set in a heavily condensed,
black-weight face, like a number printed on a rider's back. Everything around it stays quiet.

### 5.2 Tokens

| Token | Value | Role |
|---|---|---|
| `jersey` | `#FFD21F` | Hero and header background, accent button |
| `jersey-deep` | `#F2BF00` | Step numbers, hover state |
| `lagoon` | `#0B3A4E` | Text, primary buttons, dark section |
| `palm` | `#17714B` | Confirmation only |
| `fog` | `#EDF1F3` | Alternate sections, price panel |
| `signal` | `#B42318` | Errors only |

Measured WCAG contrast ratios (all pass AA for body text, all but the last two pass AAA):

| Text | Background | Ratio |
|---|---|---|
| lagoon | white | 12.14:1 |
| lagoon | jersey yellow | 8.38:1 |
| muted text `#2C5A6E` | white | 7.51:1 |
| muted text `#2C5A6E` | fog | 6.61:1 |
| signal (errors) | white | 6.57:1 |

### 5.3 Typography

A single variable family, **Archivo**, self-hosted through Fontsource. Its width axis gives three
voices from one file:

| Class | Width | Weight | Use |
|---|---|---|---|
| `.type-display` | 118 % | 800 | Hero and waitlist headlines |
| `.type-heading` | 112 % | 750 | Section headings |
| `.type-jersey` | 62 % | 900 | Live price, step numbers |
| body | 100 % | 400 | Running text |

Body text is kept under about 75 characters per line.

### 5.4 Components

UI components come from **Basecoat**, a plain HTML and CSS port of shadcn/ui built on Tailwind CSS.
It reads the same CSS variables as shadcn/ui (`--primary`, `--radius`, …). The Zémi tokens are mapped
onto those variables in `src/styles/main.css`, so every component (button, card, select, radio,
table, alert, field) takes the brand without being restyled one by one.

### 5.5 Motion

There is one animation: the price "ticks" when the visitor changes a route. It answers the visitor's
own action. `prefers-reduced-motion` disables it, along with smooth scrolling.

## 6. Security

The site is static, but it is built as if it held real data.

| Measure | Implementation |
|---|---|
| No HTML injection | User input and data are written with `textContent` and DOM constructors (`new Option`, `createElement`), never with `innerHTML`. |
| Input validation | Allow-list patterns for the name, a strict format for Benin mobile numbers, the zone checked against the served list, and length limits enforced both in HTML (`maxlength`) and in JavaScript. |
| Content-Security-Policy | `default-src 'self'` with no `unsafe-inline` and no `unsafe-eval`. Fonts are self-hosted, so no third-party origin is allowed. |
| Clickjacking | `frame-ancestors 'none'` and `X-Frame-Options: DENY`. |
| Transport | HSTS for two years, `upgrade-insecure-requests`. |
| Privacy | `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` disabling camera, microphone, geolocation and payment, and no analytics or third-party requests. |
| Single source | Headers are declared once in `vercel.json` and reused by `vite preview`, so the production policy is tested locally. |

**Limit.** Client-side validation is for user feedback. It is not a security boundary. A future
waitlist endpoint must validate and rate-limit on the server.

## 7. Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link.
- Every section is labelled by its heading (`aria-labelledby`).
- The hamburger exposes `aria-expanded`, has a text label that changes between "Open menu" and
  "Close menu", closes with Escape and returns focus to the toggle.
- The live price sits in an `aria-live="polite"` region, so screen readers announce new quotes.
- Form errors are linked to their field with `aria-describedby`, fields are flagged with
  `aria-invalid`, and focus moves to the first invalid field.
- Focus is visible on every interactive element.

## 8. Responsive behaviour

The layout is mobile first and was checked at 390 px and 1440 px.

| Breakpoint | Changes |
|---|---|
| < 640 px | Single column, the selects and size options stack. |
| ≥ 640 px | Selects and size options sit side by side, features use two columns. |
| ≥ 768 px | Inline navigation replaces the hamburger, steps use three columns. |
| ≥ 1024 px | Hero, features, pricing and waitlist use two columns. |

## 9. Quality

- 28 unit tests (Vitest) cover the pricing model and the waitlist validation.
- The business logic (`pricing.js`, `waitlist-validation.js`) has no DOM dependency. The DOM
  modules only read the form, call that logic and render the result.
- Each interactive block is initialised only if its element is present, so a missing block never
  breaks the others.
