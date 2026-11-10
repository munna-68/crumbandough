# Image brief — Crumb and Dough concept

This is a self-contained brief for the fourteen photographs used by the concept site. It is written for a photographer, retoucher, or image generator. No real Crumb and Dough photograph is used or hotlinked: every slot currently draws a branded `c+d` placeholder, and dropping correctly named files into `public/images/` replaces them automatically.

The site is a concept for a Melbourne cookie business, not an official site. The photography should feel like the same small kitchen made it: warm, a little imperfect, and good enough to eat.

---

## 1. The look

**One sentence:** soft natural window light, cream and oat surfaces, a chunky homemade cookie with a gooey middle, styled with quiet pink and lavender props.

- **Mood:** warm, generous, homemade. Editorial but not sterile. Think a cookbook shot taken on a kitchen bench, not a supermarket packshot.
- **Light:** one large diffused window, upper left. Soft directional shadows, gentle falloff, no direct flash, no hard specular highlights.
- **Texture:** craggy cracked tops, slightly uneven rounds, visible chocolate chunks, a glossy centre where a cookie is broken. A few loose crumbs are good. Perfect symmetry is not.
- **Props:** unbranded kraft boxes, parchment, pink or lavender tissue, plain ceramic cups and plates, a little flour, dried flowers. Keep them sparse.
- **People:** none. No hands, faces, or reflections of a person.
- **Colour grade:** warm highlights, chocolate-brown shadows. Keep cream creamy, not yellow-grey. Keep pinks dusty, not neon. Do not over-saturate.
- **Composition:** centred with breathing room. For cutouts, leave 6–8% clear space around the subject so the site's rotation and scale animations never clip an edge.

### Palette

| Role | Hex | Use |
| --- | --- | --- |
| Deep chocolate | `#4a2b1e` | Main brand brown, chocolate, type |
| Darkest chocolate | `#382017` | Shadows, deep chocolate dough |
| Soft pink | `#f1c5d8` | Ribbon, tissue, props |
| Cream | `#f4e8d7` | Backgrounds, parchment, ceramics |
| Lavender | `#d8c6e6` | Tissue, dried flowers, secondary props |
| Butter | `#dca867` | Golden bake, caramel, Biscoff notes |

Supporting bake tones may sit around `#c58b52`, `#b3733b`, `#d9b95c`, `#a8464f`, and `#e7d5b9`; these are the flavour accents already used in the interface. Do not introduce a new strong colour.

### What "chunky" means

- Thick enough to see the side wall, roughly 2.5–3.5 cm.
- A cracked, domed top rather than a flat disc.
- Chocolate pieces large enough to read as chunks, not tiny dots.
- A centre that looks underbaked in the best way: glossy, dense, slightly sunken.
- If broken, the inside should pull a little. Avoid a dry, crumbly cross-section.

---

## 2. Technical spec

| Kind | Slots | Ratio | Export size | Background | Fit in UI |
| --- | --- | --- | --- | --- | --- |
| Cookie cutout | `hero-cookie`, `hero-crumb`, seven flavours, `cta-cookie` | 1:1 | 2000 × 2000 px | Transparent alpha | `contain` |
| Box scene | `box-4`, `box-6`, `box-12` | 4:3 | 1600 × 1200 px | Cream sweep, not transparent | `contain` |
| Lifestyle scene | `kitchen-still` | 4:5 | 1600 × 2000 px | Styled surface, full frame | `cover` |

- **Format:** WebP preferred, sRGB, 8-bit, quality 85–90. PNG is accepted as a fallback. Do not supply HDR/Display P3 files.
- **Transparent cutouts:** true alpha, no white matte, no halo, no baked-in drop shadow. The interface adds its own CSS shadow around the hero cookie.
- **Box scenes:** photograph on a seamless cream surface (`#f4e8d7` to `#fbf5ec`). The box may cast a soft natural shadow, but do not add a fake floating shadow.
- **Scene:** full-frame 4:5, composed so the important detail sits in the middle 70%; the UI crops with `object-fit: cover`.
- **Weight:** aim for under 350 KB per cookie, 500 KB per box, 600 KB for the scene. Keep the total folder under 5 MB.
- **Naming:** exactly the slot name, lowercase, hyphenated: `hero-cookie.webp`, `box-6.webp`, and so on. Do not add suffixes like `-final` or `@2x`.
- **No upscaling:** generate or shoot at the stated size or larger, then downscale.

### File resolution order

`BrandImage` tries `/images/<slot>.webp` first, then `/images/<slot>.png`. If neither exists, the branded placeholder stays visible. A missing file is never a broken-image icon, so the site is safe to demo before photography arrives.

---

## 3. Global prompt prefix

Prepend this to any generated image prompt, then add the slot prompt:

> Warm natural food photography for a Melbourne home bakery. Soft diffused window light from the upper left, gentle shadows, cream and oat surfaces, dusty pink and lavender props, chocolate-brown shadows, honest homemade texture, shallow depth of field, editorial cookbook mood. No people, no hands, no logos, no branded packaging, no text, no watermark.

For a transparent cutout, append:

> Isolated on a true transparent background, clean cutout, no white fringe, no baked shadow, centred with generous clear space around the subject.

---

## 4. The fourteen slots

The prompts below are the source of truth in `src/lib/images.ts`; keep prompts and files in sync.

| # | Slot / file | Where it appears | Ratio | Prompt |
| --- | --- | --- | --- | --- |
| 01 | `hero-cookie` | Home hero, large floating cookie | 1:1 | One very chunky chocolate chip cookie, slightly craggy, broken open to show a gooey chocolate centre. Three-quarter angle, soft morning window light, cut out on transparent, no props, no text. |
| 02 | `hero-crumb` | Home hero, small floating detail | 1:1 | A broken half of a chocolate chip cookie with a few loose crumbs, cut out on transparent. Same bake and light as the hero cookie, no wrapper, no text. |
| 03 | `classic-chocolate` | Flavour roll, order thumbnails | 1:1 | A thick homemade chocolate cookie loaded with white and dark chocolate chips, cracked top, gooey middle, cut out on transparent, soft studio light from the top left, no text. |
| 04 | `red-velvet` | Flavour roll, order thumbnails | 1:1 | A deep red velvet cookie, cracked top, one bite revealing a creamy white cheesecake centre, cut out on transparent, soft studio light, no icing, no text. |
| 05 | `lemon-cheesecake` | Flavour roll, order thumbnails | 1:1 | A pale golden lemon cookie with a smooth creamy cheesecake centre visible, a little crumb on top, cut out on transparent, bright but soft light, no text. |
| 06 | `biscoff` | Flavour roll, order thumbnails | 1:1 | A Biscoff-stuffed cookie with a glossy caramel spread centre, crunchy biscuit crumbs on top, a little drip at the edge, cut out on transparent, warm side light, no text. |
| 07 | `white-kitkat` | Flavour roll, order thumbnails | 1:1 | A pale cookie with a white chocolate centre, silky white glaze and a shard of crunchy wafer on top, cut out on transparent, soft light, no wrapper, no branding, no text. |
| 08 | `reese-s` | Flavour roll, order thumbnails | 1:1 | A dark chocolate cookie with a creamy peanut butter centre, one half broken to show the filling, cut out on transparent, warm studio light, no wrappers, no branding, no text. |
| 09 | `oreo` | Flavour roll, order thumbnails | 1:1 | A dark cocoa cookie with white frosting visible in the middle, chocolate chips, a glossy cookie glaze and crushed chocolate biscuit crumbs, cut out on transparent, no packaging, no logos, no text. |
| 10 | `box-4` | Offers strip, order size card | 4:3 | An open, unbranded kraft cookie box holding four chunky cookies, soft pink ribbon beside it, plain cream background, overhead-ish three-quarter view, no logos, no text. |
| 11 | `box-6` | Offers strip, order size card | 4:3 | An open unbranded kraft cookie box with six chunky mixed cookies nestled in pink tissue, soft cream background, warm daylight, no logos, no text. |
| 12 | `box-12` | Order size card | 4:3 | A large open unbranded kraft box filled with twelve cookies in a mix of flavours, pale lavender tissue, cream background, warm daylight, no logos, no text. |
| 13 | `kitchen-still` | Reviews section | 4:5 | A quiet overhead still life on a warm cream surface: three chunky cookies on baking paper, a plain ceramic cup, a little scattered flour and a sprig of dried flowers. Lavender and pink accents, soft natural light, no hands, no faces, no logos, no text. |
| 14 | `cta-cookie` | Home closing call to action | 1:1 | Two chunky cookies stacked, the top one with a clean bite taken out, gooey centre, cut out on transparent, warm soft light, playful, no wrapper, no text. |

### Flavour-specific checks

- **Classic chocolate:** white *and* dark/milk chips visible; this is the anchor bake and should look the most familiar.
- **Red velvet:** deep red-brown crumb, not bright food-colouring red; the cheesecake centre should read creamy and tangy.
- **Lemon cheesecake:** pale golden, not neon yellow; no icing, no lemon slice prop.
- **Biscoff:** glossy caramel, a restrained drip; use a plain biscuit crumb, not a branded biscuit.
- **White KitKat:** white chocolate glaze and a wafer shard; no red wrapper, no logo.
- **Reese's:** dark cocoa shell, creamy peanut butter; no orange packaging, no logo.
- **Oreo:** dark cocoa, white frosting, crushed chocolate biscuit; no blue packaging, no logo.

The flavour names are used descriptively by the business. The images must not show third-party logos, wrappers, or recognisable branded packaging.

---

## 5. What not to do

- **Do not use or edit any real Crumb and Dough photo** from Instagram or TikTok. This concept has no image rights.
- **No people.** No hands, faces, arms, or body parts entering frame.
- **No logos, labels, stickers, wrappers, or branded packaging.** This includes chocolate-bar wrappers and biscuit brands.
- **No text of any kind:** no captions, prices, menu cards, chalkboards, watermarks, or AI gibberish.
- **No white studio background** on a cutout. It must be transparent, not a white square pretending to be one.
- **No hard cutout edges, white halos, or double shadows.**
- **No plastic or fake food.** Avoid wax chocolate, foam crumbs, or resin props.
- **No perfect circles.** The cookies should look hand-scooped and slightly irregular.
- **No dry, pale, overbaked centres.** The whole concept rests on "gooey".
- **No seasonal styling** (Halloween, Christmas, hearts) unless a slot explicitly asks for it.
- **No extra props that fight the cookie:** no milk splash, no floating ingredients, no glitter.
- **Do not crop a cookie's edge** inside a transparent square; leave the clear margin.
- **Do not imply official affiliation.** No "Crumb and Dough" packaging, stamps, or signage.

---

## 6. Generation order

Work in this order so the set stays consistent:

1. **Anchor the bake:** `hero-cookie` and `hero-crumb`. Get the chocolate, crumb colour, and light right here.
2. **Build the box set:** `box-4`, `box-6`, `box-12` on the same cream sweep, same camera height, same light.
3. **Shoot the seven flavours** as one session against the same transparent setup, using the anchor cookie's light direction and grade. Keep the cookie size consistent across all seven.
4. **Finish the set:** `kitchen-still` (wider lifestyle scene) and `cta-cookie` (playful stack with a bite).

If time is short, ship the hero pair and three boxes first: those carry the first ten seconds of the demo.

---

## 7. Hook-up checklist

1. Save files to `public/images/` using the exact slot filename. WebP first; PNG is the fallback.
2. Start the site with `npm run dev`, then open a route with `?labels=1` appended:
   - `http://localhost:5173/?labels=1`
   - `http://localhost:5173/order?labels=1`
   - `http://localhost:5173/dashboard?labels=1`
   Each image slot shows its slot name and expected `/images/...` path. Reload the route directly; internal navigation drops the query string.
3. Hard-refresh after adding files. The browser caches `public/` aggressively during development.
4. Check the hero cookie at 1440 × 900: it sits on a pink/lavender blob, so any cream rectangle means the cutout is not transparent.
5. Check mobile at 390 × 844; the flavour thumbnails are small, so chips and fillings must still read.
6. Remove `?labels=1` before recording. The label is a QA aid, not part of the design.
7. Run `npm run build` once the final files are in place, then `npm run preview` to confirm the images are copied into `dist/images/`.
8. Do not rename slots or add new ones without updating `src/lib/images.ts`; the TypeScript type will catch an unknown slot name.

If a file is missing, the branded placeholder is the correct fallback. Never replace it with a stock photo or a hotlink.
