/**
 * SINGLE SOURCE OF TRUTH for every user-facing text string in the site.
 * Edit a value here and it updates everywhere it's used — pages/components
 * import from this file instead of hardcoding text inline.
 *
 * Plain strings are exported directly. Text blocks that contain embedded
 * markup (<strong>, <br/>, multi-span splits) are exported as JSX-returning
 * functions/elements instead, so the markup stays with its content.
 */

// ---------------------------------------------------------------------------
// Couple names
// ---------------------------------------------------------------------------
// Two casings are needed: literal caps for hero/heading treatments
// (SANTHIYA, KARTHIK), and title case for mid-sentence prose (Page 5 story,
// slideshow byline). The title-case spelling is the only literal — the caps
// version is derived from it, so changing a name is a true single-place edit.
//
// Spelling note: the source project's folder is named
// "karthik-sandhiya-invitation", but every rendered string in it — hero,
// closing, page metadata, README — spells the bride's name "Santhiya" with
// a "t". That spelling is used here.
export const BRIDE_NAME_TITLE = 'Santhiya';
export const GROOM_NAME_TITLE = 'Karthik';
export const BRIDE_NAME = BRIDE_NAME_TITLE.toUpperCase();
export const GROOM_NAME = GROOM_NAME_TITLE.toUpperCase();
export const COUPLE_AMPERSAND = '&';
// Groom first, matching the project name and the page title
// ("Karthik weds Santhiya") and the hero, which stacks KARTHIK above
// SANTHIYA. Used in the WhatsApp RSVP message and the photo alt text, so
// the order the guest reads is the same everywhere.
export const COUPLE_NAMES_AND_TITLE = `${GROOM_NAME_TITLE} & ${BRIDE_NAME_TITLE}`;

// Parents. Stored without the "Mr."/"Mrs." honorifics — those are part of the
// invitation's phrasing and live in the paragraph blocks below, so these stay
// reusable anywhere the bare name is wanted.
export const BRIDE_FATHER_NAME = 'K. Saminathan';
export const BRIDE_MOTHER_NAME = 'S. Thilagavathi';
export const GROOM_FATHER_NAME = 'K. Gopal';
export const GROOM_MOTHER_NAME = 'G. Ranjani Devi';

// ---------------------------------------------------------------------------
// PAGE 1 — hero
// ---------------------------------------------------------------------------
// Announced in place of the heart, which carries the "weds" meaning visually.
export const WEDS_MARK_A11Y = 'weds';

/**
 * The mark between the two names on PAGE 1 — a heart in place of "WEDS".
 *
 * An inline SVG path, not the ❤️ emoji character: an emoji is drawn from the
 * platform's colour-emoji font, so it renders differently on Apple, Windows
 * and Android and cannot be recoloured.
 *
 * Drawn DIRECTLY into the hero slot's own `0 0 89 38` viewBox, bypassing the
 * <foreignObject><p> wrapper the other marks use. That wrapper exists to lay
 * out text, and sizing a shape through it was the bug in the first attempt:
 * the slot is 48px wide because it was authored for the four wide letters of
 * "WEDS", so a square heart tied to the 32px font-size came out around 18px
 * and looked lost beside the 133px names. Here the geometry is explicit —
 * the heart is scaled to the slot's 38-unit height and centred on it.
 *
 * Red, not the hero's cream: cream on the blue sky was nearly invisible, and
 * a heart only reads as a heart when it is red.
 */
/**
 * Drawn as two mirrored halves rather than copied from an icon set, so the
 * shape is exactly symmetric about x=12: each half runs tip -> outer flank ->
 * around the lobe -> down into the centre cleft, and the left half is the
 * right half with every x mirrored to 24-x. Verified by sampling the outline
 * at 90 heights — the midpoint of every scanline lands on x=12.
 *
 * The earlier path was an off-the-shelf 24x24 icon whose lobes were shallow
 * and flat across the top and whose tip was blunt; at the hero's size that
 * read as a rounded blob rather than a heart.
 *
 * Geometry: the curves reach out to x≈1.6/22.4 for full round lobes, the
 * cleft dips to (12, 6.4), and the tip comes to a real point at (12, 21.8).
 * Rendered bounds are 20.79 x 19.20 — wider than tall, which is what keeps it
 * from looking stretched.
 */
const HEART_PATH =
  'M12 21.8C15.1 18.6 20.0 14.6 21.8 10.6C23.6 6.6 21.1 2.6 17.2 2.6C14.6 2.6 12.7 4.2 12 6.4C11.3 4.2 9.4 2.6 6.8 2.6C2.9 2.6 0.4 6.6 2.2 10.6C4.0 14.6 8.9 18.6 12 21.8Z';

export const WedsMark = () => (
  // Scaled to 32 of the slot's 38 units tall (34.6 wide), then translated so
  // the PATH'S OWN bounding box — not the 24x24 grid it is drawn on — is
  // centred on the slot's centre (44.5, 19). Centring the grid instead would
  // sit the heart low and left, because the outline is inset within it.
  <g
    role="img"
    aria-label={WEDS_MARK_A11Y}
    transform="translate(24.49, -1.33) scale(1.6667)"
  >
    <path d={HEART_PATH} fill="rgb(200, 30, 48)" />
  </g>
);
// The hero tag line ("two hearts entwined") was removed at the couple's
// request — see the note in pages/Page1.jsx where it used to render.

// ---------------------------------------------------------------------------
// PAGE 2 — invitation
// ---------------------------------------------------------------------------
export const INVITE_HEADING = 'Invite';
// Sits immediately above the large "Invite" heading, so the last words run
// straight into it: "...we cordially / Invite". The original opened with
// "With the blessings of God and our beloved parents," which now duplicates
// the blessings line in BlessingsParagraph above it, so it was dropped in
// favour of a shorter lead-in.
export const INVITE_TAGLINE = (
  <>
    With hearts full of joy and gratitude,
    <br />
    we cordially{' '}
  </>
);
// Opening invocation. The source invitation invokes Krishna in Tamil script
// (॥ ஸ்ரீ கிருஷ்ணாய நம ॥) rather than the Ganesha invocation the template
// shipped with, so the constant is named for its role, not a fixed deity.
export const INVOCATION = '॥ ஸ்ரீ கிருஷ்ணாய நம ॥';
// Deity illustration at the head of PAGE 2, matching the invocation above.
export const DEITY_ALT = 'Lord Krishna playing the flute';

/**
 * Lower invitation block — sits at 76% on PAGE 2, i.e. BELOW the couple's
 * names, so it reads as the line that follows them.
 *
 * Both sets of parents are now named together in `BlessingsParagraph` above
 * the names (the invitation is issued jointly by both families), so repeating
 * the bride's parents here would be redundant. This block carries the
 * closing sentiment instead.
 *
 * It previously read "together with our families", which duplicated the
 * identical byline that opened PAGE 3's event card. Both were removed; this
 * slot now carries a request-for-blessings line, which is the natural next
 * beat after the couple's names and doesn't repeat anything else on the page.
 *
 * LENGTH CONSTRAINT: this renders through `SvgText` into a FIXED viewBox
 * (477x61 on mobile, 480x61 scaled 0.52 on laptop) — the box does not grow to
 * fit. Two short lines is the ceiling; a third would overrun the box and
 * collide with the "Invite" heading below.
 */
export function FamilyParagraph() {
  return (
    <>
      <p style={{ margin: 0 }}>
        Do grace the occasion with your presence
        <br />
        and shower the couple with your blessings
      </p>
    </>
  );
}

/**
 * Upper invitation block — sits at 76% on PAGE 2, i.e. BELOW the couple's
 * names (the blessings block above them is `BlessingsParagraph`).
 *
 * Phrased as a joint invitation from both families rather than from the
 * groom's side alone: both sets of parents are named together and the
 * closing line reads "their beloved children", so neither family is cast as
 * host and neither of the couple is singled out as son or daughter.
 */
export function BlessingsParagraph() {
  return (
    <>
      <p style={{ margin: 0 }}>
        <br />
        With the blessings of the Almighty and our beloved elders,
      </p>
      <p style={{ margin: 0 }}>
        <strong>
          Mr. {GROOM_FATHER_NAME} &amp; Mrs. {GROOM_MOTHER_NAME}
        </strong>
        <br />
        along with
        <br />
        <strong>
          Mr. {BRIDE_FATHER_NAME} &amp; Mrs. {BRIDE_MOTHER_NAME}
        </strong>
      </p>
      <p style={{ margin: 0 }}>
        cordially invite you to grace the auspicious wedding ceremony of their beloved children
      </p>
    </>
  );
}

// Decorative flower rain that plays over PAGE 2. Purely ornamental, so it is
// aria-hidden and carries no text — this label exists only for the wrapper's
// accessible name in case a future change makes it focusable.
export const FLOWER_RAIN_A11Y = 'Decorative falling flowers';

// Kolam ornament on PAGE 2. Like the flower rain it renders aria-hidden by
// default, so this label is only used when a caller opts into exposing it.
export const KOLAM_A11Y = 'Decorative kolam, a traditional South Indian floor design';

// ---------------------------------------------------------------------------
// PAGE 5 — our story
// ---------------------------------------------------------------------------
export const OUR_STORY_HEADING = 'Our Story';
export const BRIDE_AND_GROOM_HEADING = 'Bride & Groom';
export const MEET_THE_HEADING = 'Meet The';
/**
 * NOTE FOR THE COUPLE: supplied by the couple — a four-line blessing.
 *
 * PAGE 5 has a hard vertical budget: the "Our Story" script heading sits
 * above this block and the golden photo frame sits below it, leaving only
 * ~240px of clear space at the desktop breakpoint. This text is four lines
 * rather than the single line it replaced, so the slot is widened and the
 * line-height tightened in styles/page5-story.css to keep all four lines
 * inside that gap at every breakpoint — measured, not assumed.
 *
 * The line breaks are explicit rather than left to wrapping: the four lines
 * are the couple's own phrasing and each is a complete clause, so they must
 * break in the same places on every screen instead of re-flowing to
 * whatever the slot width happens to allow.
 */
export const STORY_TEXT = (
  <>
    <p style={{ margin: 0 }}>
      With the blessings of our elders and the grace of the divine,
      <br />
      two hearts are coming together,
      <br />
      two families are becoming one,
      <br />
      and a beautiful new journey begins.
    </p>
  </>
);
export const GOLDEN_FRAME_ALT = 'Gold ornate location frame overlay';

/**
 * Photos that crossfade inside the golden frame on PAGE 5.
 *
 * Opens on the couple's portrait, then follows the celebration in order —
 * haldi, engagement, reception.
 *
 * All four are photographs. An earlier set mixed illustrations in; keeping
 * them uniform matters here because they crossfade into one another in the
 * same frame, where a change of medium mid-transition is jarring.
 *
 * Paths point at /public/images, so they are referenced as plain strings
 * rather than through imageMap (that file maps the original Framer export's
 * asset hashes, and these are the couple's own photos).
 */
export const GOLDEN_FRAME_PHOTOS = [
  {
    src: '/images/couple-portrait.webp',
    alt: `${GROOM_NAME_TITLE} and ${BRIDE_NAME_TITLE} seated on temple steps amid lamps and garlands`,
  },
  {
    src: '/images/couple-haldi.webp',
    alt: `${GROOM_NAME_TITLE} and ${BRIDE_NAME_TITLE} at their haldi ceremony, turmeric on their faces`,
  },
  {
    src: '/images/couple-engagement.webp',
    alt: `${GROOM_NAME_TITLE} and ${BRIDE_NAME_TITLE} at their engagement, before a floral backdrop`,
  },
  {
    src: '/images/couple-reception.webp',
    alt: `${GROOM_NAME_TITLE} and ${BRIDE_NAME_TITLE} at their reception, before a lit floral arch`,
  },
];

// ---------------------------------------------------------------------------
// PAGE 6 — RSVP
// ---------------------------------------------------------------------------
// An `RSVP_NOTE_TEXT` paragraph ("We would be truly honoured to celebrate
// this day with you…") sat between the closing blessing and the WhatsApp
// button. Removed at the couple's request; a kolam ornament now occupies that
// band — see Kolam in Page6.jsx and styles/page6-kolam.css.
export const TAP_HERE = 'TAP HERE';

/**
 * PAGE 6 closing blessing — replaced the decorative "Will You / Join Us?"
 * heading at the couple's request.
 *
 * Two blocks: the Tamil line first, then its English counterpart. They are
 * separate exports (not one pre-joined string) so each can carry its own
 * font and size — Tamil needs a Tamil-capable family (Catamaran, loaded in
 * index.html) while the English stays in the invitation's serif.
 *
 * The line breaks are deliberate, matching the couple's own phrasing, so
 * each is rendered as an explicit <br /> rather than left to wrap.
 */
export const CLOSING_BLESSING_TAMIL = [
  'தங்கள் வருகை எங்கள் வாழ்வின்',
  'இனிய தொடக்கத்திற்கு',
  'ஆசீர்வாதமாக அமையும்.',
];
export const CLOSING_BLESSING_ENGLISH = [
  'Your presence will be a blessing upon',
  'the beginning of our life together.',
];
export const WHATSAPP_RSVP_LABEL = 'RSVP on WhatsApp';

// RSVP WhatsApp number, in full international format WITHOUT "+", spaces or
// dashes — this is what wa.me requires (e.g. Indian mobile 98765 43210 is
// '919876543210'). Leave as an empty string to keep the button inert; the
// button only becomes a link once a number is set, so a missing number can
// never ship as a broken wa.me/ URL.
export const RSVP_WHATSAPP_NUMBER = '919159725273';

export const RSVP_WHATSAPP_MESSAGE = `Hello! We'd love to RSVP for ${COUPLE_NAMES_AND_TITLE}'s wedding.`;

/**
 * wa.me deep link with the RSVP message pre-filled, or null when no number
 * is configured. Callers must handle null by rendering a plain (inert)
 * button rather than a link.
 */
export const RSVP_WHATSAPP_URL = RSVP_WHATSAPP_NUMBER
  ? `https://wa.me/${RSVP_WHATSAPP_NUMBER}?text=${encodeURIComponent(RSVP_WHATSAPP_MESSAGE)}`
  : null;

// ---------------------------------------------------------------------------
// PAGE 7 — countdown
// ---------------------------------------------------------------------------
export const COUNTING_THE_DAYS = 'Counting the Days';

// ---------------------------------------------------------------------------
// Wedding date / venue — single source of truth for both the Countdown's
// target Date object and the slideshow's display strings, so they can never
// drift out of sync. Do NOT derive the display strings from the Date object
// via toLocaleDateString/toLocaleTimeString — locale/timezone differences
// would change the rendered bytes; keep both forms explicit here instead.
//
// The countdown targets the wedding itself (Muhurtham, the principal
// ceremony) on the
// morning of 25 October 2026. The "+05:30" offset is significant: without it
// the target would be read in the viewer's own timezone, so anyone outside
// India would see the countdown hit zero at the wrong moment.
export const WEDDING_DATE_ISO = '2026-10-25T10:30:00+05:30';
export const WEDDING_DATE_DISPLAY = '25 October 2026';
export const WEDDING_TIME_DISPLAY = '10:30 AM';

export const WEDDING_VENUE_ADDRESS = ['Thirukarakavur, Papanasam,', 'Tamil Nadu – 614302'];

// Drives the "View Location" link on the event card. Built from a plain
// search query so it resolves without a Places API key.
export const WEDDING_VENUE_MAPS_QUERY =
  'T.M.A Marriage Hall Thirukarakavur Papanasam Tamil Nadu 614302';
export const WEDDING_VENUE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  WEDDING_VENUE_MAPS_QUERY
)}`;

// ---------------------------------------------------------------------------
// Ceremonies — the full two-day schedule, grouped by day.
//
// Grouped rather than flat so the card can show one date rail per day
// (big numeral / month / weekday) with that day's ceremonies beside it,
// instead of repeating the same date on every row.
//
// `icon` selects a glyph from CEREMONY_ICONS in WeddingEventCard.
// `principal` marks the wedding itself so it can be emphasised.
// ---------------------------------------------------------------------------
export const CEREMONY_DAYS = [
  {
    day: '24',
    month: 'OCT',
    weekday: 'SATURDAY',
    events: [
      // The Tamil name for each ceremony is carried in the `tamil` field and
      // rendered beside the English one, so the romanised form (Nalangu /
      // Nichayathartham) is not repeated in brackets here.
      { name: 'Haldi', tamil: 'நலங்கு', time: '3:00 PM', icon: 'haldi' },
      { name: 'Engagement', tamil: 'நிச்சயதார்த்தம்', time: '5:30 PM', icon: 'ring' },
      { name: 'Reception', tamil: 'வரவேற்பு', time: '6:30 PM onwards', icon: 'reception' },
    ],
  },
  {
    day: '25',
    month: 'OCT',
    weekday: 'SUNDAY',
    events: [
      { name: 'Wedding', tamil: 'திருமணம்', time: '10:30 – 11:00 AM', icon: 'temple', principal: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Countdown
// ---------------------------------------------------------------------------
// Full words for the standalone countdown band; the inline PAGE 7 countdown
// uses the single-letter set.
export const COUNTDOWN_UNIT_LABELS = { days: 'D', hours: 'H', minutes: 'M', seconds: 'S' };
export const COUNTDOWN_UNIT_LABELS_LONG = {
  days: 'DAYS',
  hours: 'HOURS',
  minutes: 'MINUTES',
  seconds: 'SECONDS',
};
export const COUNTDOWN_SEPARATOR = ':';

// Standalone countdown band shown after the last page.
export const COUNTDOWN_EYEBROW = 'Every moment brings us closer';
export const COUNTDOWN_HEADING = 'Until we say “I do”';
export const COUNTDOWN_FOOTNOTE = `${WEDDING_DATE_DISPLAY} · ${WEDDING_TIME_DISPLAY} IST`;

// Closing monogram at the very foot of the page — the couple's initials with
// a heart between them, matching the browser-tab logo. Derived from the names
// above rather than written out, so it can never drift from them.
export const MONOGRAM_INITIALS = {
  groom: GROOM_NAME_TITLE.charAt(0),
  bride: BRIDE_NAME_TITLE.charAt(0),
};
// Read aloud in place of the decorative heart glyph, which a screen reader
// would otherwise announce as "black heart suit" or skip entirely.
export const MONOGRAM_A11Y = `${GROOM_NAME_TITLE} loves ${BRIDE_NAME_TITLE}`;

// ---------------------------------------------------------------------------
// WeddingEventCard (PAGE 3)
// ---------------------------------------------------------------------------
// A `SLIDESHOW_BYLINE` ("Together with our families") used to sit above the
// event heading. Removed at the couple's request — the card now opens on the
// "The Ceremonies" eyebrow below.

// Eyebrow + heading pair at the top of the card.
export const CEREMONIES_EYEBROW = 'The Ceremonies';
export const EVENT_NAME = 'Wedding';
// Describes only what the schedule states — an earlier wording mentioned
// lunch, which was an assumption and has been removed.
export const EVENT_DESCRIPTION =
  'The sacred hour our lives join, before God and everyone we love.';

// A save-the-date scratch card's strings lived here. The card was removed:
// it asked the guest to scratch away a foil to reveal a date that PAGE 3's
// schedule and the countdown band already print in full, so the interaction
// revealed nothing.

// Venue block at the foot of the card.
export const VENUE_EYEBROW = 'Wedding Venue';
export const VENUE_NAME_DISPLAY = 'T.M.A Marriage Hall';
export const VIEW_LOCATION_CTA = 'Get Directions';
// QR code beside the venue address. The image itself is generated from
// WEDDING_VENUE_MAPS_URL by scripts/generate-venue-qr.py — if you change the
// venue above, re-run that script (see its docstring).
export const VENUE_QR_CAPTION = 'Scan for directions';
export const VENUE_QR_ALT = 'QR code linking to T.M.A Marriage Hall on Google Maps';

// ---------------------------------------------------------------------------
// MusicPlayer
// ---------------------------------------------------------------------------
export const MUSIC_PLAYER_A11Y = {
  pause: 'Pause',
  play: 'Play',
  expand: 'Expand',
  collapse: 'Collapse',
  volume: 'Music volume',
};

/**
 * Background-music playlist. One track is picked at random on each page load
 * and loops until the visitor pauses it.
 *
 * To add a song, append `{ id: '<the bit after ?v= in the YouTube URL>' }`.
 *
 *   start — optional, seconds into the video to begin at. Omit for 0:00.
 *   end   — optional, seconds at which to loop back to `start`. Omit to play
 *           to the end of the video.
 *
 * Both are plain seconds, so 1:47 is 107. Keeping them as numbers rather than
 * "1:47" strings means the YouTube API can take them directly with no parsing
 * step that could silently fail on a typo.
 */
export const MUSIC_PLAYLIST = [
  { id: '26k4yFyVBtc' },
  { id: 'gf-EY9PqTvA' },
  { id: 'xhnD6t3uI2E', start: 7 },   // 0:07
  { id: 'izhbxgiE8ok', start: 10 },  // 0:10
  { id: 'Y0TFzpRodnw' },
  { id: 'xM8dvOloLAw', start: 107 }, // 1:47
  { id: 'R5Wa9J3Whis' },
  { id: '4r9r6Fhm9I0' },
  { id: 'LRHSq0tTLB0', start: 54, end: 215 }, // 0:54–3:35
];
