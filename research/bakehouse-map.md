# Bake House repo map (read-only reference)

Source: `/Users/munna8/repos/bake-house` (never modified). Copy target: `/Users/munna8/repos/crumbandough`.

## Stack
- Vite 6 + React 18 + TypeScript 5.7 + React Router 6 + Tailwind CSS 4 (`@tailwindcss/vite`).
- `lucide-react` icons. No GSAP, no Lenis, no Next.js in the repo.
- Scripts: `dev` (Vite), `build` (`tsc -b && vite build`), `preview`.
- Vite base is `/bake-house/`, dev port 5188. A middleware rewrites `/cookies/*` to the base path.
- `index.html` loads Google Fonts (Anton + Archivo), base theme cream `#F7F1E7`.

## Routes
- `src/App.tsx`: `/` → `pages/Shop`, `/dashboard/*` → `dashboard/Dashboard`, `*` → redirect `/`.
- `src/main.tsx`: BrowserRouter with basename detection for `/bake-house` / `/bakehouse`, wrapped in `ShopProvider`.

## Data layer
- `src/lib/types.ts`
  - `BoxSize = 4 | 6 | 12`; `BOX_PRICES = {4:22, 6:30, 12:54}`; `DELIVERY_FEE = 6`.
  - `Flavour { id, name, desc, allergens, stock, art: CookieArt, photo? }`.
  - `Box { id, size, items: Record<flavourId, qty> }`.
  - `Fulfilment { mode:'pickup'|'delivery', day, window, zip, address, note }`.
  - `Customer { name, mobile, email, kitchenNote }`; `PlacedOrder`; `DashboardOrder` with stage/payment.
- `src/lib/data.ts`: `BRAND` (name, address, phone, hours), `DEMO_BANNER`, `TICKER`, `FLAVOURS` (9 flavours with drawn cookie `art` palettes), `DASHBOARD_ORDERS`, review/testimonial data. `resolveCookiePhoto()` prefixes BASE for `/cookies/` paths.
- `src/lib/store.tsx`: large context (`ShopProvider`) with localStorage persistence under `bakehouse.v1`. Handles boxes, active box, capacity, stock, quantity, fulfilment, customer, payment, toasts, checkout modal, order placement, menu editing. `commit()` writes state + ref synchronously to avoid double-add bugs.
- `src/lib/format.ts`: `money`, `isoDate`, `dayOptions`, `longDate`, `dayLabel`, `makeRef`, `initials`, `trays`, `copyText`.
- `src/lib/useScrollReveal.ts`: IntersectionObserver reveal helper. `usePresence`, `useDialog`.
- `src/dashboard`: `Dashboard.tsx` + tabs (`tabs.tsx`) + `KitchenMode`, `MenuTab`, `OrderDetailModal`, `AddFlavourModal`, `RestockModal`, `ConfirmDeleteFlavourModal`. Dashboard state is local `useState(DASHBOARD_ORDERS)` — new shop orders do **not** reach it in the original.
- Duplicate stale `.js` copies of most `.tsx` files exist; only `.tsx` is imported. Safe to discard all `.js` duplicates when re-concepting.

## Box / order flow (original)
- `BoxBuilder.tsx` + `Checkout.tsx` + `Chrome.tsx`; multiple boxes, max 4.
- Adding: `canAdd` checks box capacity and stock; `add` increments `items[flavourId]`; `remove` decrements; full box triggers toast.
- Checkout: multi-step (box → details → payment → confirmation), payment methods card/cashapp/venmo/bank. Uses address, ZIP, phone/email — all must be removed for Crumb and Dough.
- `placeOrder`: builds `PlacedOrder`, decrements stock, resets boxes, stores `lastOrder`; no dashboard integration.

## Dashboard (original)
- Multi-tab ops app: Today, Orders, Bake sheet, Menu, Insights, Customers, Money.
- Today: open order count, kitchen mode card, stats, order list. `tabs.tsx` has bake sheet tally logic (flavour quantities across orders) and order actions.
- Seeded orders in `data.ts`; no animation beyond CSS. Re-concept to three panels only.

## Visual / animation utilities
- `src/components/Hero.tsx` (hero carousel), `Chrome.tsx` (nav/footer), `Sections.tsx` (explainer, FAQ, reviews), `Cookie.tsx` (SVG/drawn cookie + photo), `Batch.tsx`, `ReviewSheet.tsx`.
- `src/index.css`: Tailwind 4 `@theme` tokens; utilities `label-caps`, `heading-*`, `container-page`, `panel-scroll`; keyframes `ticker`, `toast-in`, `sheet-up`, `fade-in`, `count-pop`, `pulse-once`, `shake`; `prefers-reduced-motion` block. No GSAP/Lenis.
- Cookie art: `Cookie.tsx` draws an SVG cookie from `art` colours, uses `photo` if present.

## Images (original)
- `/public/cookies/*.webp` (9 files), `/public/og-image.jpg`, `/public/bake-house-og.jpg`, `/public/bake-house-preview.jpg`.
- `src/imgs/` duplicates for the hero/carousel.
- `resolveCookiePhoto` handles base path.

## Brand content to replace
- Name, address “88 Kiln Street”, phone, hours “7am–8pm Tue–Sun”, `sitekeep.studio/bake-house` OG URLs, all flavour names/descriptions, ticker, reviews, copy, palette, fonts (Anton/Archivo), logo, `LocalStorage` key, `BH-` order refs, currency `$` (US-style).

## Gotchas
- `tsconfig.app.json` is strict + `noUnusedLocals` + `noUnusedParameters`; build will fail on unused imports.
- Vite `base: '/bake-house/'` and the `/cookies/` middleware must be removed for root hosting.
- StrictMode is on; effects run twice in dev — GSAP cleanup must be idempotent.
- No error boundary; a missing price key would crash a render.
- Original `Dashboard` is independent of shop state; for the demo both must share one provider so submitted orders appear immediately.
