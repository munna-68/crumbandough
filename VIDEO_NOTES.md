# Video notes: crumb and dough, the unasked-for website

Notes for the episode "building small businesses a website without being asked". This is the second version of the concept: a full redesign in a flat-colour, studio still-life style, with chocolate brown and baby pink taken from the shop's Instagram badge, and the cookie picker ported from the Bake House build.

Record at **1440 × 900**, browser zoom **100%**, no bookmarks bar, notifications off. For the phone segment use a **375 × 812** viewport (Chrome device toolbar, iPhone 12/13 mini size is fine).

---

## 1. The idea in two lines

> A Melbourne cookie shop that only takes orders in DMs, given a shopfront that feels like their Instagram: pink, brown, chunky and a bit cheeky.
> You build a box like you'd fill a real one, and the order lands on a kitchen board the moment you send it.

---

## 2. Before you record

- `npm run dev` serves the site at **http://127.0.0.1:5188**.
- **`/?intro=1`** forces the preloader. **`/?intro=0`** skips it. Without a flag it plays once per browser tab session.
- **`/shop?size=4`**, **`?size=6`**, **`?size=12`** preselect a box size.
- **`/shop?add=red-velvet`** drops one cookie into the box (any flavour id works: `classic-chocolate`, `red-velvet`, `lemon-cheesecake`, `biscoff`, `white-kitkat`, `reese-s`, `oreo`).
- The box you are building is saved in localStorage. For a clean take, empty it first (or run `localStorage.clear()` in the console).
- Placed orders live in memory only. Refresh and the kitchen board goes back to the four seeded orders.
- **Scroll slowly through the flavour section.** It is pinned and scrubbed by scroll; a steady scroll reads best, a fast flick jumps two flavours at once.
- Move the cursor deliberately and pause before clicks. Every page change runs the chocolate drip transition, so you never need a hard cut between pages.

---

## 3. The features, one by one

### 3.1 The bite preloader (about 4 seconds)

The screen is baby pink. The brand badge (cocoa circle, pink "crumb AND dough" wordmark) plops in, and a counter ticks from 00 to 100 under phrases that rotate: *preheating the oven, folding in the chunks, underbaking, on purpose, boxing it up*.

As the counter climbs, **three bites get taken out of the badge's edge**. Each bite is a scalloped hole made of three circles, with a little wobble and a burst of crumbs that fall with gravity. At 100 a cocoa circle floods the screen, then **three giant chomps eat through it** (from the right, from the bottom left, then the rest) and the hero is underneath.

How it is built: one SVG with masks. The bites and chomps are black circles inside the mask growing their radius with GSAP; the crumbs are small HTML spans thrown with random velocity. The hero entrance starts on the first chomp, so it is already moving as the screen opens.

> Line to say: "Most loaders are a spinner. This one eats the screen."

### 3.2 The chocolate drip page transition (about 2 seconds)

Click any internal link: a cocoa sheet falls from the top with a **dripping, melted edge**. The destination name rises in the middle ("build a box", "the kitchen", "home") with a spinning cookie. The route changes behind it, then the sheet lifts away while the drips stretch long, like chocolate pulled off a spoon.

> Line: "Even the page change is on brand. It's melted chocolate."

### 3.3 The hero still life

The reference had studio product shots on coloured plinths. Without real photos, the site **builds that still life in code**: an arch, five plinths (rose, milk, pink, cocoa, butter), spheres and six real cookie cutouts standing on top.

- On entry the plinths grow up from the floor, the cookies drop in with a spin, the spheres bounce, and the headline "Chunky, gooey, homemade." rises letter by letter out of a mask.
- Scroll moves each object at its own depth (parallax), and moving the mouse shifts them sideways a little.
- When the generated hero photos arrive (see IMAGE_PROMPTS.md) they swap in automatically, desktop and mobile separately.

### 3.4 SHOP: 4 / 6 / 12

Straight from the reference layout: a centred coloured title and three products, each with a **giant numeral behind it**. Here the numbers are the real box sizes: 4 (Mondays and Tuesdays, A$24), 6 (every day, A$35) and 12. As you scroll the numerals swell and the cookies roll in. Each one opens the builder with that size already picked.

### 3.5 The story sentence

A cocoa section with one big pink sentence that **lights up word by word as you scroll**, with little cookie "pills" set inline in the text, then three short facts.

### 3.6 The flavour roll (the theatrical bit)

The section pins for seven screens. Each scroll step **rolls the current cookie off to the left and the next one in from the right**, the whole wall repaints in that flavour's colour, the name swaps line by line, and a counter and dots track where you are. Each flavour has an "Add to a box" button that opens the builder with that cookie already in.

> Line: "Seven flavours, one scroll each. The wall changes colour to match the cookie."

### 3.7 INSTAGRAM and CONTACT

Five post tiles in a row, like the reference, designed in CSS from the shop's real offers (red velvet, 4 for $24, 6 for $35, Biscoff, "DM us"). They reveal with a clip-path wipe. On a phone they scroll sideways. Then a butter-coloured contact band: DM on Instagram, TikTok, Melbourne pick up or delivery.

### 3.8 Footer

A light pink footer with a small still life of its own, the concept disclaimer, and a giant "crumb and dough" wordmark that rises as you reach the bottom.

### 3.9 The box builder (ported from Bake House)

The best part of the earlier Bake House build, moved over and restyled. **It is a different layout on desktop and phone, on purpose.**

**Desktop**
- A sticky cocoa panel on the left: pick 4, 6 or 12, see the round slots of your box, a running total, and the checkout button.
- The flavour grid on the right. Tap **Add** and the cookie **flies from the card into the next empty slot** in the box, then pops in.
- Changing the box size keeps the cookies that still fit.
- "Add another box" for up to four boxes, each with its own tab.
- The checkout button tells you when there is still room: "Check out with 4", "2 more fit at no extra cost".

**Phone**
- The box becomes a **sticky strip** under the page header (it slides up when the nav hides), so the slots stay in view while you scroll the flavours.
- A **bottom bar** with the count, total and "Review order".
- "Review order" opens a **bottom sheet** listing every box with steppers, so you can edit without leaving the page.
- A toast tells you when a box is full.

> Line: "On a laptop you get a panel. On a phone the box follows you down the page. Same order, two different layouts."

### 3.10 Checkout in three steps

1. **How do you want it?** Pick up (free) or delivery (suburb only, no street address), a day from the next five, and a two-hour window.
2. **Who's it for?** A name, an Instagram handle or mobile number, and an optional note for the kitchen.
3. **Check it.** Every box and cookie, the total, and a plain note that payment happens over DM, like the shop does today. Then **Send to the kitchen**.

The confirmation stamps in with a reference number (CD-1xxx) and a button to see it on the kitchen board.

### 3.11 The kitchen board

`/kitchen` is the back of house. Your order arrives **at the top with a "Just in" banner**, alongside four seeded orders. It shows:
- open orders, cookies to bake, deliveries, and the total on the board
- the queue, where tapping moves an order New → Baking → Ready
- a **bake list** that adds up every open order per flavour, with bars that grow in

> Line: "The customer taps a button, and the baker gets a bake list. That's the whole pitch."

### 3.12 The details nobody sees

- **Reduced motion is respected.** With "reduce motion" on, the preloader is skipped, the flavour roll becomes a plain grid, and all text simply appears.
- Smooth scrolling (Lenis) with the page locked while dialogs are open.
- The nav hides when you scroll down and comes back when you scroll up; the phone strip moves up to fill the gap.
- Two quick taps can't overfill a box (the store updates synchronously).
- Keyboard: dialogs trap focus, Escape closes them, a screen-reader live region announces toasts.

---

## 4. Suggested shot list, about 75 seconds

| Time | On screen | Action | Voiceover |
| --- | --- | --- | --- |
| 0:00–0:05 | Preloader | Open `/?intro=1`. Hands off. | "Most loaders are a spinner. This one eats the screen." |
| 0:05–0:10 | Hero | Let the still life build. Wiggle the mouse a little. | "Chunky, gooey, homemade. Their words, not mine." |
| 0:10–0:15 | SHOP trio | Scroll slowly. | "Three boxes: four, six and twelve. The four is their Monday deal." |
| 0:15–0:20 | Story | Scroll through the sentence. | "Every word lights up as you read it." |
| 0:20–0:32 | Flavour roll | Steady scroll through all seven. | "Seven flavours, one scroll each." |
| 0:32–0:36 | Instagram, contact, footer | One smooth scroll to the bottom. | "Their Instagram, rebuilt as a shopfront." |
| 0:36–0:39 | Drip transition | Scroll back up, click **Build your box**. | "Even the page change is melted chocolate." |
| 0:39–0:48 | Builder (desktop) | Pick 6. Add three or four flavours, watch them fly in. | "Tap a cookie, it flies into the box." |
| 0:48–0:56 | Checkout | Delivery, a suburb, a day, a window; a name; send. | "Three steps. No account, no card. Payment stays in the DMs." |
| 0:56–1:02 | Kitchen | Click **See it on the kitchen board**. Hold on "Just in" and the bake list. | "And the baker gets a bake list." |
| 1:02–1:15 | Phone | Switch to the 375 px view. `/shop`: add a few, show the sticky strip, bottom bar and review sheet. | "On a phone it's a different layout. The box follows you down the page." |

---

## 5. Five talking points

1. **It's their brand, not a template.** The colours come straight off their Instagram badge: chocolate brown and baby pink. The words are theirs ("chunky, gooey and homemade"). The two real offers (6 for A$35 every day, 4 for A$24 on Mondays and Tuesdays) are the hero products.
2. **The design came from one reference image.** Flat colour fields, still life on plinths, centred coloured section titles, giant numerals behind products, a row of Instagram tiles, a butter contact band. I copied the design language, not the content.
3. **The loud bits are on purpose.** The preloader, the drip transition and the flavour roll get the motion. The rest stays calm, which is what makes those three moments land.
4. **The ordering flow was reused, not rebuilt.** The Bake House box builder already worked well, so it was ported and restyled. That is the real lesson for small-business sites: a good flow is reusable.
5. **The kitchen board is the pitch.** The customer doesn't care about the back end, but the owner does. Showing their DMs turning into a bake list is what sells it.

---

## 6. What's fake

Say this plainly if anyone asks.

- **The cookie photos are borrowed** from the Bake House concept and mapped onto crumb and dough's real flavour names. They are stand-ins until real photos are shot. None are the shop's own photos.
- **Every order is fictional.** The seeded orders (Mabel, Theo, Ari, Juno) and anything you place live in memory only. Refresh and the board resets.
- **No back end.** No database, payments, login, email, SMS or real-time sync.
- **Some prices are made up.** A$35 for six and A$24 for four match their public posts. A$66 for twelve and the A$8 delivery fee are placeholders, and the footer says so.
- **Days and time windows are generated** (the next five days, 10am to 6pm). They are not the shop's real hours.
- **Delivery is suburb only** with no zone check.
- **The Instagram tiles are designed, not real posts.**
- **The Instagram and TikTok links are real**, but the site is not affiliated with or endorsed by the business, and the page is set to `noindex`.

---

## 7. What a real version needs

- Real photos: hero (desktop and mobile), footer still life, and one transparent cutout per flavour (prompts in IMAGE_PROMPTS.md).
- Confirmed prices, hours, pick-up spot, delivery suburbs, fee, minimum order and lead time.
- Allergen and ingredient info per flavour.
- A back end for stock and daily capacity, real payments, order emails or texts, and a logged-in kitchen board.
- Hosting, a domain, analytics with consent, and removing `noindex`.

---

## 8. Where things live in the code

| Feature | File |
| --- | --- |
| Bite preloader | `src/components/Preloader.tsx` |
| Drip transition | `src/components/Transition.tsx` |
| Nav, phone menu, toasts, bottom bar | `src/components/Chrome.tsx` |
| Hero and still-life kit | `src/components/home/Hero.tsx`, `src/components/home/Scene.tsx` |
| SHOP trio, story, flavour roll, Instagram, contact | `src/components/home/*` |
| Box builder, flavour grid, review sheet, checkout | `src/components/shop/*` |
| Kitchen board | `src/pages/Kitchen.tsx` |
| Store (boxes, orders, checkout state) | `src/lib/store.tsx` |
| Flavours, prices, seeded orders | `src/lib/data.ts` |
| Photo slots for generated images | `src/lib/photos.ts` |
