# Video notes — Crumb and Dough concept walkthrough

A one-minute screen recording of the concept site. Record at **1440 × 900**, browser zoom **100%**, no bookmarks bar, notifications off. Use a clean browser profile and start on the home page.

## The concept in two lines

> A warm, tactile shopfront for a Melbourne cookie business that only exists in DMs — rebuilt as a real ordering flow.
> Chunky type, gooey cookies, and a kitchen board that updates the moment a box is sent.

---

## 1. Before you record

- Start the site with `npm run dev` and open the URL it prints (or `npm run preview` after a build).
- Force the intro once with `http://localhost:5173/?intro=1`. It plays for about **2.8 seconds** and then wipes into the hero.
- `?intro=0` skips the intro. Without either flag it plays **once per browser session** on the home page only.
- If you need to retake the order section without re-filling, `/order?box=6` preselects the six-cookie box. For the final take, use the normal wipe from the home page instead.
- `?labels=1` shows the image-slot QA labels. **Do not record with labels on.**
- Use a fresh private window if you want the intro to replay without the query flag.
- Rehearse the scroll once. The pinned flavour section is scrubbed by scroll: slow, steady scrolling reads best. Fast flicks make it jump.
- Move the cursor deliberately and pause before clicks. The circular wipe starts from the exact click point.

---

## 2. Recording order — 60 seconds

| Time | On screen | Action | Voiceover |
| --- | --- | --- | --- |
| 0:00–0:03 | Preloader | Start on `/?intro=1`. Let the dough ball, chips, flatten and cookie circle play. | "Every box starts with dough." / "And a little chocolate." |
| 0:03–0:09 | Hero | Let the line-mask title and cookie settle. Small scroll to the price line. | "Chunky, gooey, homemade — your next cookie obsession." |
| 0:09–0:13 | Offers strip | Scroll once, slowly, past the six-for-$35 and four-for-$24 cards. | "Six for thirty-five every day. Four for twenty-four on Mondays and Tuesdays." |
| 0:13–0:23 | Flavour roll | Scroll steadily through all seven flavours. Let the rotation and cards do the work. | "Seven flavours. Mix and match, or commit to one." |
| 0:23–0:27 | Reviews | Pause on the review themes and the kitchen still. | "The kind of cookie people text you about." |
| 0:27–0:30 | Closing CTA | Land on "hungry yet?" | "Packed by hand, picked up or delivered across Melbourne." |
| 0:30–0:33 | Circular wipe | Click **build your box**. The circle opens from the cursor and closes on the order page. | "So let's build a box." |
| 0:33–0:40 | Order, size + flavours | Six is preselected. Add six cookies across two or three flavours; let the live platter fill. | "Pick a size, then fill it. The box fills as you tap." |
| 0:40–0:46 | Details | Type a first name. Switch to **delivery**, type an area only (e.g. Brunswick). Pick a day and a time. | "Pickup or Melbourne metro. Area only — no street address." |
| 0:46–0:49 | Place order | Click **place order**. Hold on the confirmation entrance. | "One tap, and the kitchen has it." |
| 0:49–0:53 | Confirmation | Let the cookie check, burst and summary settle. | "A proper confirmation. No payment, because this is a concept." |
| 0:53–1:00 | Kitchen board | Click **open the kitchen board**. Hold on the new order at the top, the "just in" tag, the stats and bake list. | "The order lands at the top of the queue, and the bake list counts itself." |

**If you need a calmer cut:** hold two extra seconds on the hero and two on the confirmation, and trim the reviews pause. The story still lands at about **68 seconds**.

### Preloader line — say it slowly

> "Every box starts with dough. And a little chocolate."

The visual is: dough ball → chips drop → flatten → cookie → a circle expands into the hero. Do not talk over the last half-second; let the wipe land.

### Transition line — say it as you click

> "So let's build a box."

The wipe is under **0.9 seconds**, from the click point. Do not add a cut; the transition is the edit.

---

## 3. Five talking points

Use these if you are narrating live or writing the post caption.

1. **It is built from the real business, not a generic bakery template.** The words are theirs — "chunky, gooey and homemade", "your next cookie obsession", "zero self-control" — and the two hero offers are the public ones: six for A$35 every day, four for A$24 on Mondays and Tuesdays. There was no official website to redesign, so this is a concept built from the Instagram presence, not a redesign claim.

2. **The flavour roll is the signature moment.** Seven flavours sit in a pinned horizontal roll, with the cards' rotation tied to scroll. It turns a menu into the reason to keep scrolling, and it is the one place where the site is allowed to be theatrical.

3. **Ordering feels like filling a box, not filling a form.** Choose four, six or twelve; tap flavours up and down; watch the circular platter fill. Pickup or delivery, area only, date and time, an optional kitchen note. No payment, no pretence.

4. **The kitchen board closes the loop.** Placing an order drops it at the top of the queue with a "just in" tag, then recalculates the stats and the per-flavour bake list. The seeded queue is fictional, but the behaviour is the real product idea.

5. **The polish is deliberately uneven.** The preloader, hero, order submit and first dashboard moment get the motion budget. Offers, reviews and footer stay quiet. That restraint is what makes the loud bits feel expensive.

---

## 4. What is fake

Be straightforward about this if anyone asks. The demo is honest in the UI, and the notes should be too.

- **Every order is fictional.** The four seeded orders (Mabel, Theo, Ari, Juno) and anything placed during the demo live in React state only. Refresh the page and the queue resets.
- **The dashboard is not connected to anything.** No database, no auth, no real-time sync, no printing, no notifications.
- **All prices are placeholders.** The A$35 six-box and A$24 four-box match public Instagram captions. The A$66 twelve-box and A$8 delivery fee are invented, and every price on screen is tagged "placeholder price" or "placeholder".
- **Dates and times are placeholders.** The next five days and the 10am–6pm windows are generated for the demo; they are not the kitchen's real hours.
- **Delivery is area-only by design.** Brunswick and Footscray are example suburbs, not a service map. There is no address lookup, minimum order or delivery-radius check.
- **There is no pickup address, phone number or email.** Pickup copy says the exact spot is confirmed after ordering, because the real address is not public.
- **The reviews are brand-voice themes, not real customer quotes.** No customer names, avatars or star ratings are invented. The real REVIEWS highlight sits behind an Instagram login wall.
- **All photography is a branded placeholder.** The `c+d` marks are intentional; no real Crumb and Dough photos, logos or packaging are used.
- **No payment, email, SMS or backend.** The confirmation says so explicitly.
- **The Instagram and TikTok links are real**, but this site is not affiliated with or endorsed by the business.

---

## 5. What a real version needs

**Content and trust**
- A real photo set for all fourteen slots, plus permission for any customer review that is quoted.
- Confirmed opening and ordering hours, pickup address, delivery suburbs, fee, minimum order and lead time.
- Ingredient and allergen information, storage and reheating notes, and a food-safety/licensing check.
- Real terms, privacy, refund and cancellation copy.

**Commerce**
- A backend with menu, stock, capacity and cutoff rules. The current box builder assumes every flavour is always available.
- Payments (Stripe, Square or similar), order confirmation by email/SMS, and a real order reference.
- Delivery-zone validation rather than a free-text area field.
- A kitchen dashboard with authentication, roles, status changes, print tickets, and a proper bake list export.
- Persistence and real-time updates. The concept deliberately holds orders in browser memory.

**Craft and operations**
- Domain, hosting, analytics with consent, error monitoring and backups.
- Remove `noindex`, add real metadata, Open Graph images, sitemap and robots.
- Accessibility audit with keyboard and screen-reader testing; the concept already respects reduced motion and has skip links.
- Performance pass on the real image set, plus a content workflow for specials and seasonal drops.
- A social plan that connects the site back to the DM ordering habit the business already has.

---

## 6. Research gaps

These were **not public** at the time of research (10 November 2026) and are represented as placeholders or omitted:

- Actual review text — the Instagram REVIEWS highlight is behind a login wall.
- The owner's first name — not in the bio, captions or metadata.
- Opening, baking and ordering hours.
- Delivery fee, suburb list, delivery minimum and cutoff.
- Pickup address.
- An official website — none was found. The only external link in the bio is TikTok.
- Baking days beyond the public Monday/Tuesday four-box offer.

Do not fill these gaps with confident-sounding invented facts in the voiceover. Say "placeholder" when you mean it.
