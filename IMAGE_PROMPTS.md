# Image and video prompts

The site works today with no generated images: the hero and footer still lifes are built in code from cookie cutouts. These prompts give you real photography to swap in. Generate them, drop the files where each section says, switch on the slot in `src/lib/photos.ts`, and they replace the drawn still life automatically.

**Only the two hero images matter for launch.** Everything else is optional.

---

## The look (paste this into every prompt if your generator supports a style or "reference" field)

> Minimal studio still life, set design photography. Flat seamless baby pink backdrop (#F3C6DD) and floor in the same pink. Geometric plinths: rectangular blocks and cylinders in matte rose pink (#E6A3C4), warm milk white (#FFFAF7), chocolate brown (#4A2B1E) and soft butter yellow (#F6E4BF). Small matte spheres in pink and chocolate brown. One large soft arch shape behind. Soft diffused light from the upper left, gentle long shadows, no harsh highlights. Chunky homemade stuffed cookies, about 10 cm wide and 3 cm tall, craggy tops, visible chocolate chunks, slightly gooey centres. Clean, playful, high-end, shot on a medium-format camera, 50 mm, f/8, everything sharp. No text, no logos, no packaging, no people, no hands.

Avoid: text, letters, logos, brand names, people, hands, packaging, plates, cutlery, crumbs scattered everywhere, glossy plastic, neon colours, grey or white backdrop, wood, marble, blur, vignette.

---

## 1. Hero, desktop (required)

**File:** `public/images/hero-desktop.webp`
**Size:** 16:9, 2400 × 1350 (or larger, export as WebP around 80% quality, under 400 KB)

> Wide minimal studio still life on a seamless baby pink (#F3C6DD) backdrop and floor. **The left 45% of the frame is empty pink space** for a headline. On the right half: a large soft pink arch in the background; in front of it a group of geometric plinths of different heights, a tall rose pink block, a wide milk-white block, a short chocolate brown cylinder and a butter yellow cube. Six chunky stuffed cookies stand upright and lie on the plinths at playful angles: a chocolate chunk cookie, a red velvet cookie with a white cream cheese swirl, an Oreo cookies and cream cookie, a Biscoff cookie with a caramel centre, a peanut butter cup cookie, and a white chocolate KitKat cookie. Two small matte spheres, one pink and one chocolate, sit on the floor. Soft light from the upper left, long gentle shadows falling to the right. Clean set design photography, medium format, everything in focus, warm and playful. No text, no logos, no people.

**Check before using:** nothing important in the left 45%, the horizon (where the floor meets the wall) sits about 75–80% down the frame, cookies are the hero not the blocks.

---

## 2. Hero, mobile (required)

**File:** `public/images/hero-mobile.webp`
**Size:** 9:16, 1080 × 1920 (WebP, under 300 KB)

> Tall vertical minimal studio still life on a seamless baby pink (#F3C6DD) backdrop and floor. **The top 45% of the frame is empty pink space** for a headline. In the lower 55%: a soft pink arch behind a stacked group of geometric plinths, a tall rose pink block in the centre, a milk-white block to the left and a short chocolate brown cylinder to the right. Four chunky stuffed cookies stand upright on the plinths: a red velvet cookie with a white cream cheese swirl on top of the tallest block, an Oreo cookies and cream cookie, a chocolate chunk cookie and a Biscoff cookie with a caramel centre. One small chocolate sphere and one pink sphere on the floor. Soft light from the upper left, gentle shadows. Clean set design photography, everything in focus. No text, no logos, no people.

**Check before using:** the subject sits in the bottom half, nothing is cut off at the sides (phones crop the edges a little).

---

## 3. Hero video loop (optional, instead of the still images)

Only worth it if the result is very clean. A short seamless loop, no camera cuts.

**Files:** `public/images/hero-desktop.mp4` (16:9, 1920 × 1080) and `public/images/hero-mobile.mp4` (9:16, 1080 × 1920), 6–8 seconds, H.264, no audio, under 4 MB each.

> Same set and composition as the hero still above (baby pink studio, empty left side, plinths and cookies on the right). Locked-off camera, no camera movement. Very slow, subtle motion only: one cookie on the top plinth slowly turns a quarter turn on its edge, a small pink sphere rolls a few centimetres and stops, a faint crumb falls. Soft light, no flicker. The last frame matches the first frame so it loops seamlessly. No text, no people.

The site doesn't play video yet. If you make one, tell me and I'll add a `<video>` slot with the still image as its poster.

---

## 4. Footer still life (optional)

**File:** `public/images/footer.webp`
**Size:** 3:2, 1800 × 1200, **transparent background** (PNG converted to WebP) or a pink (#FBE9F1) background

> Small minimal still life on a very light pink (#FBE9F1) ground: a wide milk-white block and a taller rose pink block side by side, a white chocolate KitKat cookie leaning on the white block, an Oreo cookie standing on top of the pink block, a red velvet cookie lying on the floor in front, one chocolate sphere and one small pink sphere. Soft light from the upper left. Subject anchored to the bottom right of the frame, empty space top left. No text, no people.

---

## 5. Real flavour cutouts (later, when you have the real cookies)

The cookies on the site are borrowed Bake House photos. When the real cookies can be shot (or generated to match them), replace them one for one. Each flavour needs two files with the same name:

| Flavour | Files in `public/cookies/` |
| --- | --- |
| Classic chocolate | `classic-chocolate.webp`, `classic-chocolate-lg.webp` |
| Red velvet | `red-velvet.webp`, `red-velvet-lg.webp` |
| Lemon cheesecake | `lemon-cheesecake.webp`, `lemon-cheesecake-lg.webp` |
| Biscoff | `biscoff.webp`, `biscoff-lg.webp` |
| White KitKat | `white-kitkat.webp`, `white-kitkat-lg.webp` |
| Reese's | `reese-s.webp`, `reese-s-lg.webp` |
| Oreo | `oreo.webp`, `oreo-lg.webp` |

**Format:** square, transparent background. `-lg` is 1200 × 1200, the small one 480 × 480. Leave about 6% clear space around the cookie so rotations never clip it.

**Prompt (change the flavour line each time):**

> Top-down product photo of one chunky homemade stuffed cookie, about 10 cm wide, perfectly centred, seen from directly above. **[Red velvet cookie, deep red dough, a swirl of white cream cheese filling showing on top, a few white chocolate chips.]** Craggy cracked top, slightly uneven round edge, soft even studio light, no harsh shadow. Isolated on a plain white background for cutting out. Sharp focus, high detail. No plate, no crumbs, no text.

Flavour lines to swap in:

- **Classic chocolate:** golden brown dough with big melted dark and milk chocolate chunks and a pinch of flaky salt.
- **Red velvet:** deep red dough, a swirl of white cream cheese filling showing on top, a few white chocolate chips.
- **Lemon cheesecake:** pale golden dough, a glossy lemon curd centre, crumbled biscuit and white chocolate on top.
- **Biscoff:** caramel-coloured dough with a pool of melted Biscoff spread in the centre and pieces of Biscoff biscuit on top.
- **White KitKat:** golden dough studded with chunks of white chocolate KitKat bar and white chocolate.
- **Reese's:** peanut butter dough with halved peanut butter cups pressed into the top and a drizzle of peanut butter.
- **Oreo:** dark cocoa dough with big pieces of Oreo cookie and a white cream filling centre.

If the generator can't do transparent backgrounds, generate on white and send them to me; I'll cut them out the same way as the current set.

---

## Switching the photos on

1. Put the files in `public/images/` with the exact names above.
2. Open `src/lib/photos.ts` and replace `null` with the path, for example:

   ```ts
   heroDesktop: '/images/hero-desktop.webp',
   heroMobile: '/images/hero-mobile.webp',
   ```

3. The hero and footer swap the drawn still life for your photo. If you'd rather I do it (and tune the crop and the headline position against the actual image), just drop the files in and tell me.
