# Five Frames — Next.js scroll-dive sequence

A pinned, scroll-driven 3D image sequence built with **GSAP ScrollTrigger** + **Lenis**, packaged as a drop-in App Router component.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build && npm start` for production.

## How it's wired

| Piece | File | Role |
|---|---|---|
| Smooth scroll | `components/SmoothScroll.tsx` | One Lenis instance, driven by GSAP's ticker, wired into `ScrollTrigger.update`. Wraps the whole app in `app/layout.tsx`. Auto-disables for reduced-motion. |
| The sequence | `components/ScrollDive.tsx` | Pins a full-viewport stage and scrubs a GSAP timeline. Each frame scales past the camera while the next rises from deep Z. Uses `useGSAP` so the timeline reverts cleanly on unmount (no duplicate ScrollTriggers under React StrictMode). |
| Styling | `components/ScrollDive.module.css` | Full-bleed cinematic look, scoped via CSS module. |
| Content | `lib/sequence.ts` | The only file you edit for images + captions. |
| Images | `public/frames/` | Served through `next/image` (AVIF/WebP, responsive sizes). |
| The structure | `components/Building.tsx` | A conceptual 2D **design board** — title block, an interactive SVG waving-volume elevation (click any level), facade callouts, floor schedule, detail panel, plan + massing insets, scale bar & north arrow. |
| Floor data | `lib/building.ts` | The only file you edit for the floor program (`2B + G + 5 + Rooftop`) and headline facts. |

The page opens **straight into the pinned sequence** (no intro fold), then resolves
into the building breakdown — `<ScrollDive />` followed by `<Building />` in
`app/page.tsx`.

## Customize

- **Swap images / captions** → edit `lib/sequence.ts`. Drop new files in `public/frames/`. Add or remove entries; the component adapts to the count.
- **Recolor the chrome** → change `--accent` at the top of `ScrollDive.module.css`.
- **Pacing** → in `ScrollDive.tsx`, the `end: () => "+=" + window.innerHeight * n` controls scroll distance per frame. Raise the multiplier for a slower dive.
- **The dive itself** → the `tl.to(...)` / `tl.fromTo(...)` pair in the loop. `z`, `scale`, and `rotateY` are the knobs.

## Drop into an existing app

It's just `<ScrollDive />` as one section. Move the component + its CSS module into your project, copy the images, and make sure `<SmoothScroll>` wraps your layout once (or reuse your app's existing Lenis setup and delete this one — don't run two).
