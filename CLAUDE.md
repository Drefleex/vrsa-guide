# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Development server (Vite)
npm run build     # Production build → dist/
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite exists. There is no test command.

**Deployment:** drag-and-drop `dist/` folder to Netlify dashboard (no git repo — no CI/CD).

## Architecture Overview

**VRSA Guide** is a mobile-first PWA tourist guide for Vila Real de Santo António, Portugal. Max-width 430px, single-page app, 5-language UI.

### State management — App.jsx is the single hub

All global state lives in `App.jsx`:
- `pins` — 450+ location objects `{id, name, emoji, cat, color, lat, lng}`. Loaded from `DEFAULT_PINS` array at startup, then optionally overridden by Google Sheets CSV (`VITE_SHEET_URL`).
- `favs` — array of pin IDs, persisted to `localStorage('vrsa_favs')`.
- `lang` — one of `PT | EN | ES | FR | DE`.
- `theme` — `light | dark`, persisted to `localStorage('vrsa_theme')` and applied via `document.documentElement.setAttribute('data-theme', theme)`.
- `page` — current page name (string), drives which page component renders.

Props passed down to every page via the `cp` spread: `{ lang, favs, toggleFav, onNav }`. Pages needing pins also receive `pins`.

### Pages and routing

No router library. App.jsx renders pages conditionally: `{page === 'restaurants' && <Restaurants {...cp} pins={pins} />}`. Navigation is via `onNav(pageName)` calls. The 5 main tabs are in `BottomNav.jsx`; 10 more pages are in the "More" menu.

### Translations / i18n

No i18n library. Every component defines a local `const T = { PT: {...}, EN: {...}, ES: {...}, ... }` object and uses `T[lang].key`. Translations are inline throughout each file. FR and DE are only fully covered in BottomNav, GlobalSearch, and Info.

### Map component

`src/components/Map.jsx` uses `@vis.gl/react-google-maps` (AdvancedMarker). The Google Maps API key comes from `import.meta.env.VITE_GOOGLE_MAPS_KEY`. The component handles full CRUD on pins (add by clicking the map, drag to reposition, edit category, delete). Distance calculations use the Haversine formula in `calcDist()`.

The 20 valid pin categories are defined in the `CATS` array at the top of `Map.jsx`. When adding a new category, it must be added to `CATS` in `Map.jsx` and to `DEFAULT_PINS` entries that use it.

### CSS / design system

All design tokens are CSS custom properties in `App.css`. Dark mode works by switching the `[data-theme="dark"]` attribute on `<html>` — no separate stylesheet. Key variables: `--primary`, `--ink`, `--bg`, `--surface`, `--border`. Spacing uses `--r-*` radius variables and `--sh-*` shadow variables.

### Environment variables

```
VITE_GOOGLE_MAPS_KEY   # Google Maps JS API key (also set in netlify.toml [build.environment])
VITE_SHEET_URL         # Optional Google Sheets CSV URL for live pin updates
```

The `.env` file holds these locally. `netlify.toml` injects `VITE_GOOGLE_MAPS_KEY` at build time on Netlify — the key must be in both places.

### PWA / Service Worker

`public/sw.js` uses a network-first strategy for API calls and cache-first for static assets. Cache name is `vrsa-guide-v3` — bump this when deploying breaking cache changes. `public/offline.html` is served when both network and cache fail.

### Pin data

`DEFAULT_PINS` in `App.jsx` is the authoritative source for map locations. Each pin: `{id, name, emoji, cat, color, lat, lng}`. IDs are non-sequential integers. The `cat` field must match a key in `Map.jsx`'s `CATS` array. Colors follow category conventions (e.g. restaurants `#D32F2F`, hotels `#AD1457`, saude `#00838F`).

### Photos

`src/hooks/usePhotos.js` stores user-uploaded photos as base64 in localStorage, compressed to max 800px at 0.75 quality. Used by `Restaurants.jsx`.
