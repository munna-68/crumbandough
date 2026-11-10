export type SlotKind = 'cookie' | 'box' | 'scene'

export interface ImageSlotDefinition {
  name: string
  label: string
  kind: SlotKind
  /** Where the image is used in the site. */
  use: string
  alt: string
  accent: string
  ratio: string
  fit: 'contain' | 'cover'
  prompt: string
}

/**
 * The fourteen image slots for the concept site.
 *
 * Files live in /public/images/<slot>.webp (or .png). Nothing is hotlinked.
 * If a file is missing, BrandImage draws a branded placeholder in its place.
 */
export const IMAGE_SLOTS = [
  {
    name: 'hero-cookie',
    label: 'hero cookie',
    kind: 'cookie',
    use: 'Home hero',
    alt: 'A single chunky chocolate chip cookie with a gooey centre.',
    accent: '#c58b52',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'One very chunky chocolate chip cookie, slightly craggy, broken open to show a gooey chocolate centre. Three-quarter angle, soft morning window light, cut out on transparent, no props, no text.',
  },
  {
    name: 'hero-crumb',
    label: 'hero crumb',
    kind: 'cookie',
    use: 'Home hero, small floating detail',
    alt: 'A broken half cookie with loose crumbs.',
    accent: '#b3733b',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A broken half of a chocolate chip cookie with a few loose crumbs, cut out on transparent. Same bake and light as the hero cookie, no wrapper, no text.',
  },
  {
    name: 'classic-chocolate',
    label: 'classic chocolate',
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'Classic chocolate cookie with white and dark chocolate chips.',
    accent: '#c58b52',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A thick homemade chocolate cookie loaded with white and dark chocolate chips, cracked top, gooey middle, cut out on transparent, soft studio light from the top left, no text.',
  },
  {
    name: 'red-velvet',
    label: 'red velvet',
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'Red velvet cookie with a creamy cheesecake centre.',
    accent: '#a8464f',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A deep red velvet cookie, cracked top, one bite revealing a creamy white cheesecake centre, cut out on transparent, soft studio light, no icing, no text.',
  },
  {
    name: 'lemon-cheesecake',
    label: 'lemon cheesecake',
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'Lemon cheesecake cookie with a creamy centre.',
    accent: '#d9b95c',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A pale golden lemon cookie with a smooth creamy cheesecake centre visible, a little crumb on top, cut out on transparent, bright but soft light, no text.',
  },
  {
    name: 'biscoff',
    label: 'biscoff',
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'Biscoff cookie topped with crumbs and a glossy spread.',
    accent: '#b3733b',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A Biscoff-stuffed cookie with a glossy caramel spread centre, crunchy biscuit crumbs on top, a little drip at the edge, cut out on transparent, warm side light, no text.',
  },
  {
    name: 'white-kitkat',
    label: 'white kitkat',
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'White chocolate cookie with silky glaze and crunchy wafer.',
    accent: '#e7d5b9',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A pale cookie with a white chocolate centre, silky white glaze and a shard of crunchy wafer on top, cut out on transparent, soft light, no wrapper, no branding, no text.',
  },
  {
    name: 'reese-s',
    label: "reese's",
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'Dark chocolate cookie with a peanut butter centre.',
    accent: '#8d5637',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A dark chocolate cookie with a creamy peanut butter centre, one half broken to show the filling, cut out on transparent, warm studio light, no wrappers, no branding, no text.',
  },
  {
    name: 'oreo',
    label: 'oreo',
    kind: 'cookie',
    use: 'Flavour roll, order thumbnails',
    alt: 'Dark Oreo cookie with chocolate chips and a glossy glaze.',
    accent: '#4a372e',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'A dark cocoa cookie with white frosting visible in the middle, chocolate chips, a glossy cookie glaze and crushed chocolate biscuit crumbs, cut out on transparent, no packaging, no logos, no text.',
  },
  {
    name: 'box-4',
    label: 'box of four',
    kind: 'box',
    use: 'Offers strip, order size card',
    alt: 'An open kraft box of four cookies tied with pink ribbon.',
    accent: '#f1c5d8',
    ratio: '4 / 3',
    fit: 'contain',
    prompt:
      'An open, unbranded kraft cookie box holding four chunky cookies, soft pink ribbon beside it, plain cream background, overhead-ish three-quarter view, no logos, no text.',
  },
  {
    name: 'box-6',
    label: 'box of six',
    kind: 'box',
    use: 'Offers strip, order size card',
    alt: 'An open kraft box of six cookies with pink tissue.',
    accent: '#f1c5d8',
    ratio: '4 / 3',
    fit: 'contain',
    prompt:
      'An open unbranded kraft cookie box with six chunky mixed cookies nestled in pink tissue, soft cream background, warm daylight, no logos, no text.',
  },
  {
    name: 'box-12',
    label: 'box of twelve',
    kind: 'box',
    use: 'Order size card',
    alt: 'A fuller kraft box of twelve cookies.',
    accent: '#d8c6e6',
    ratio: '4 / 3',
    fit: 'contain',
    prompt:
      'A large open unbranded kraft box filled with twelve cookies in a mix of flavours, pale lavender tissue, cream background, warm daylight, no logos, no text.',
  },
  {
    name: 'kitchen-still',
    label: 'kitchen still',
    kind: 'scene',
    use: 'Reviews section',
    alt: 'A quiet overhead still life of cookies, a cup and baking paper.',
    accent: '#d8c6e6',
    ratio: '4 / 5',
    fit: 'cover',
    prompt:
      'A quiet overhead still life on a warm cream surface: three chunky cookies on baking paper, a plain ceramic cup, a little scattered flour and a sprig of dried flowers. Lavender and pink accents, soft natural light, no hands, no faces, no logos, no text.',
  },
  {
    name: 'cta-cookie',
    label: 'cta cookie',
    kind: 'cookie',
    use: 'Home closing call to action',
    alt: 'A stack of two chunky cookies with a bite taken from the top one.',
    accent: '#c58b52',
    ratio: '1 / 1',
    fit: 'contain',
    prompt:
      'Two chunky cookies stacked, the top one with a clean bite taken out, gooey centre, cut out on transparent, warm soft light, playful, no wrapper, no text.',
  },
] as const satisfies readonly ImageSlotDefinition[]

export type ImageSlotName = (typeof IMAGE_SLOTS)[number]['name']

export const IMAGE_SLOTS_BY_NAME = Object.fromEntries(
  IMAGE_SLOTS.map((slot) => [slot.name, slot]),
) as Record<ImageSlotName, ImageSlotDefinition>

/** Slot labels only appear when the URL asks for them: ?labels=1 */
export function labelsRequested(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('labels') === '1'
}
