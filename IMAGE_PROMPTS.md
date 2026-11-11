# Images to generate

The hero, journey and footer images are done (`hero-box.webp`, `hero-stack.webp`, `footer-pile.webp`, cut from your three photos). The story video is no longer needed; that section became "How it works".

**Needed now:** three images for the shop section (the big 4 / 6 / 12). They replace the flat cookie with a pink ball and plain squares next to it. Like the reference, each one is a single product standing with real props, not shapes.

## Specs at a glance

| # | File name | Folder | Aspect ratio | Resolution | Background | Needed? |
|---|---|---|---|---|---|---|
| 1 | `trio-4.png` | `public/images/` | 1:1 | 1600 × 1600 | Transparent (or pure white) | Yes |
| 2 | `trio-6.png` | `public/images/` | 1:1 | 1600 × 1600 | Transparent (or pure white) | Yes |
| 3 | `trio-12.png` | `public/images/` | 1:1 | 1600 × 1600 | Transparent (or pure white) | Yes |
| 4 | `<flavour-id>-lg.png` (×7) | `public/cookies/` | 1:1 | 1200 × 1200 | Transparent (or pure white) | Optional |

- Images only, no video. Use the nearest size with the same 1:1 ratio if your tool can't hit it exactly.
- Generate all three in one session if you can, so the camera angle and light match. The big numbers go behind them on the site, so keep the top right of each frame fairly clear.
- If transparency isn't supported, use pure white and I'll cut them out.

**Shared style line (add to the end of all three):**

> Product photo, eye level, camera slightly above, soft studio light from the upper left, soft contact shadow under the objects. Matte, natural, appetising. No text, no logo, no people, no plate, no table. Isolated on a transparent background (or plain pure white). Square 1600 × 1600; the group fills about 70% of the frame, sits slightly left of centre, nothing cropped.

## 1. `trio-4.png`: the little box (pink)

> One chunky red velvet cookie with a white cream cheese swirl and white chocolate chips, standing upright on its edge and leaning back about 20°, so you see the craggy top. It leans against a short tower of three stacked matte baby pink macaron-style meringue kisses (#F3C6DD). Two white chocolate chunks rest at its base.

## 2. `trio-6.png`: the everyday box (caramel)

> One chunky Biscoff cookie with a melted caramel centre and biscuit pieces, standing upright on its edge and leaning back about 20°. Beside it, a neat stack of five Lotus-style caramelised biscuits (no branding visible), and a small glossy cube of soft caramel in front. Warm caramel and cream tones.

## 3. `trio-12.png`: the party box (cocoa)

> One chunky double chocolate cookie with white and dark chocolate chunks, standing upright on its edge and leaning back about 20°. Behind it, a tall broken slab of dark chocolate (two thick squares stacked, with snapped edges), and two whole cookies lying flat and stacked at its base. Deep cocoa browns.

## 4. Real flavour cookies (optional)

Replaces the borrowed Bake House photos. One file per flavour: `public/cookies/<id>-lg.png`. I make the small versions.

> Top-down product photo of one chunky homemade stuffed cookie, about 10 cm wide, perfectly centred, seen from directly above. [FLAVOUR]. Craggy cracked top, slightly uneven round edge, soft even studio light. No plate, no crumbs, no text. Transparent background (or pure white). Square, 1200 × 1200, about 6% empty space around the cookie.

| File id | [FLAVOUR] |
|---|---|
| `classic-chocolate` | Golden dough, big melted dark and milk chocolate chunks, flaky salt |
| `red-velvet` | Deep red dough, white cream cheese swirl on top, white chocolate chips |
| `biscoff` | Caramel dough, a pool of melted Biscoff spread in the centre, Biscoff biscuit pieces |
| `white-kitkat` | Golden dough with white chocolate KitKat chunks and a white glaze |
| `reese-s` | Dark chocolate dough, halved peanut butter cups pressed into the top |
| `oreo` | Dark cocoa dough, big Oreo pieces, white cream frosting centre |
| `toasted-marshmallow` | Brown butter dough, torched marshmallow centre, caramel pockets, biscuit crumble |
