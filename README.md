# Karthik weds Santhiya — wedding invitation

A single-page wedding invitation microsite: React + Vite, no backend.

The layout began life as a Framer export and the extracted Framer stylesheet
still drives the responsive geometry, but the content, the ceremony schedule,
the artwork and several sections are this couple's own.

- **Wedding:** 25 October 2026, 10:30 AM IST (Muhurtham)
- **Also:** Haldi, Engagement and Reception on 24 October 2026
- **Venue:** T.M.A Marriage Hall, Thirukarakavur, Papanasam, Tamil Nadu

## Running locally

Requires Node 18+.

```bash
npm install
npm run dev      # dev server, prints a local URL
npm run build    # static production bundle into dist/
npm run preview  # serve the built bundle
npm run lint     # oxlint
```

`npm run build` emits a fully static `dist/` — it can be served from any
static host with no server-side component.

## Where to edit things

**All user-facing text lives in `src/content.jsx`.** Names, dates, the
ceremony schedule, the venue, the RSVP number, every caption and label are
exported from that one file, so changing wording never means hunting through
components. Strings with embedded markup are exported as small JSX components
from the same place.

A few specifics worth knowing before editing:

- `WEDDING_DATE_ISO` carries the `+05:30` offset deliberately. Without it the
  countdown would be read in each viewer's own timezone and hit zero at the
  wrong moment outside India.
- `WEDDING_DATE_DISPLAY` / `WEDDING_TIME_DISPLAY` are written out by hand
  rather than derived from the Date. Deriving them via `toLocaleDateString`
  would render differently per locale and timezone.
- `CEREMONY_DAYS` drives the PAGE 3 schedule. Each entry's `icon` key selects
  a glyph from `CEREMONY_ICONS` in `WeddingEventCard.jsx`.
- The venue QR in `src/assets/venue-qr.svg` is **generated**, not hand-made.
  If the venue URL changes, regenerate it (see *Scripts* below).

## Project structure

```
src/
  main.jsx              React entry point
  App.jsx               Root shell and page order
  content.jsx           Single source of truth for all copy
  imageMap.js           Resolves the source's image hashes to public/images/
  index.css             Global reset

  pages/
    Page1.jsx           Hero — sky, heart mark, names, tagline, temple, tree
    Page2.jsx           Invitation — Krishna, invocation, blessings, names,
                         kolam, "Invite"
    Page3.jsx           Ceremony schedule + venue card
    Page4.jsx           Sky with drifting clouds, temple, couple cut-out
    Page5.jsx           "Our Story" + golden-frame photo slideshow
    Page6.jsx           RSVP — WhatsApp CTA and the closing blessing
    Page7.jsx           Countdown page — NOT currently rendered (see below)

  components/
    Reveal.jsx          Scroll-triggered fade/slide-in (IntersectionObserver)
    RevealLetters.jsx   Per-character reveal (hero names and tagline)
    SvgText.jsx         Framer's svg > foreignObject > p "fit text" wrapper
    BgImage.jsx         Full-bleed background-image wrapper
    BreakpointVariant.jsx  Wraps one per-breakpoint markup copy
    CanvasScaler.jsx    Keeps the fixed-width design canvas matched to the
                         viewport (reproduces Framer's runtime behaviour)
    useHeroParallax.js  Scroll-driven transforms for PAGE 1's sky/temple/names
    FlowerRain.jsx      One-shot petal fall over PAGE 2
    Kolam.jsx           Inline-SVG pulli kolam ornament (PAGE 2)
    WeddingEventCard.jsx   PAGE 3 schedule + venue card
    GoldenFrameSlideshow.jsx  Crossfading photo stack (PAGE 5)
    WhatsAppButton.jsx  RSVP CTA (PAGE 6)
    Countdown.jsx       Live D:H:M:S countdown; also exports the shared
                         getTimeLeft/pad helpers used by CountdownBand
    CountdownBand.jsx   Full-width countdown band after the last page
    MusicPlayer.jsx     Background music, backed by a hidden YouTube player
    BackToTop.jsx       "Back to top" strip at the end of the page

  styles/
    framer-components.css   The extracted Framer stylesheet, kept verbatim
    breakpoints.css         The five `hidden-*` responsive utility classes
    wedding-slideshow.css   PAGE 3 event card
    flower-rain.css         PAGE 2 petal fall
    page2-kolam.css         PAGE 2 kolam placement
    page2-invocation.css    PAGE 2 invocation width/position overrides
    page4-sky.css           PAGE 4 sky and clouds
    page6-blessing.css      PAGE 6 closing blessing
    page7-trim.css          PAGE 7 layout (unused while PAGE 7 is hidden)
    countdown-band.css      Countdown band
    music-player.css        Music player
    back-to-top.css         Back-to-top strip
```

## Conventions

**`framer-components.css` is kept byte-for-byte as exported.** It is the file
that actually drives responsive layout across the five Framer breakpoints
(≤809px, 810–1199px, 1200–1439px, 1440–1919px, ≥1920px). Rather than editing
it, per-page override files (`page2-kolam.css`, `page4-sky.css`,
`page7-trim.css`, …) are imported *after* it in `App.jsx` so they win on the
cascade without `!important`. Keep that pattern for new overrides — it makes
every intentional deviation from the export greppable in one place.

**Scroll animations are re-implemented, not copied.** The original animations
came from Framer's runtime bundle, which is not part of a static export.
`Reveal.jsx` and `RevealLetters.jsx` reproduce them with `IntersectionObserver`
plus CSS transitions, preserving each element's base layout transform (for
example `translate(-50%, -50%)`) so nothing shifts position when it reveals.

One consequence is worth remembering: **`Reveal` writes `transform` inline on
every render.** A `transform` rule in a stylesheet for a `Reveal`-wrapped
element will be silently overridden. Pass the base transform via its `base`
prop instead — `page2-kolam.css` documents a case where this matters.

**Fonts** load from Google Fonts in `index.html`. Catamaran is included for
Tamil glyph coverage, which none of the Latin display families provide.

## Scripts

`scripts/` holds the venue-QR toolchain. Run these whenever the venue URL in
`content.jsx` changes:

```bash
python3 scripts/generate-venue-qr.py > src/assets/venue-qr.svg
python3 scripts/verify-venue-qr.py    # must print ROUND-TRIP OK
```

The verifier is an independent decoder — it re-derives the mask and re-reads
the QR from the spec rather than reusing the generator's helpers, so agreement
is real evidence rather than a tautology. Note that the URL is duplicated in
the generator: `verify-venue-qr.py` checks the SVG against what the generator
was told, not against `content.jsx`, so update both.

## PAGE 7 is currently hidden

`Page7.jsx` (the standalone countdown page) is intact but not rendered — its
import and element in `App.jsx` are commented out. Re-enabling it is a
two-line uncomment. `page7-trim.css` and its background asset are kept for the
same reason.

The countdown itself is still on the site: `CountdownBand.jsx` renders a
full-width band after the last page, sharing `Countdown.jsx`'s `getTimeLeft`
helper so the two can never drift apart.
