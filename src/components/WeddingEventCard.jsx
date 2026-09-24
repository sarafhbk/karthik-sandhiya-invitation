import venueQr from '../assets/venue-qr.svg';
import {
  CEREMONIES_EYEBROW,
  EVENT_NAME,
  EVENT_DESCRIPTION,
  VENUE_EYEBROW,
  VENUE_NAME_DISPLAY,
  VIEW_LOCATION_CTA,
  VENUE_QR_CAPTION,
  VENUE_QR_ALT,
  WEDDING_VENUE_ADDRESS,
  WEDDING_VENUE_MAPS_URL,
  CEREMONY_DAYS,
} from '../content';

/**
 * PAGE 3 event card — the two-day ceremony schedule and the venue.
 *
 * Replaces the earlier photo-slideshow card. The layout follows the couple's
 * reference design: a centred eyebrow/heading pair, a date-grouped schedule
 * where each day shows one large date rail beside its ceremonies, then a
 * venue block with a directions CTA.
 *
 * Colours are the site's existing navy/gold on warm paper rather than the
 * reference's maroon, so PAGE 3 still reads as part of this invitation.
 *
 * Layout is driven by classes in styles/wedding-slideshow.css (container
 * queries + media fallbacks) rather than JS, so it reflows without a resize
 * listener.
 */

// The card's navy and ink tones live in styles/wedding-slideshow.css as the
// --wec-navy / --wec-ink custom properties. Only the gold is needed here, to
// stroke the inline SVG flourish below.
const GOLD = 'rgb(215, 162, 42)';

/**
 * Ceremony glyphs, keyed by the `icon` field on each CEREMONY_DAYS entry.
 *
 * DESIGN CONSTRAINT: these render at roughly 18px. The earlier set carried
 * facet lines, tier outlines and stems that all collapsed into grey mush at
 * that size. This set is deliberately coarser — each glyph is built from
 * 3–5 large shapes with a 1.7 stroke, and solid fills carry the silhouette
 * instead of outlines wherever a shape would otherwise read as a thin ring.
 * Prefer deleting a detail over shrinking it.
 *
 * All four share the 24x24 grid, the same stroke weight, and the same
 * optical mass so they read as one family down the schedule.
 */
const CEREMONY_ICONS = {
  // Haldi / Nalangu — turmeric. A broad shallow bowl, heaped paste, and a
  // single dab above it. Loses the earlier footed stand and two-finger
  // detail, which merged into a blob at render size.
  haldi: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Heaped paste, filled so it reads even when tiny */}
      <path d="M8 11.4c.7-1.5 2.1-2.4 4-2.4s3.3.9 4 2.4H8Z" fill="currentColor" />
      {/* Bowl: one wide sweep */}
      <path d="M3.8 11.4h16.4c0 4.2-3.7 7-8.2 7s-8.2-2.8-8.2-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      {/* A single dab lifted from the bowl */}
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    </svg>
  ),

  // Engagement / Nichayathartham — a solitaire. The band is a bold circle
  // and the stone a filled diamond; the earlier crown-facet lines and
  // claw setting are gone, they only added noise.
  ring: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Band */}
      <circle cx="12" cy="15.8" r="5" stroke="currentColor" strokeWidth="1.8" />
      {/* Stone, filled: a clean kite that stays legible at 18px. Kept a
          clear gap above the band — when the two touched they merged into
          a single blob at render size. */}
      <path d="M12 2.6l3.1 3.4L12 9.4 8.9 6 12 2.6Z" fill="currentColor" />
    </svg>
  ),

  // Reception — a toast. Two filled bowls on plain stems, tilted toward
  // each other. Filling the bowls is what stops this reading as cutlery.
  reception: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Left glass: filled bowl, stem, foot */}
      <path d="M3.6 4.2h6.2l-1.5 4.3a1.7 1.7 0 0 1-3.2 0L3.6 4.2Z" fill="currentColor" />
      <path d="M6.7 9.6v8.2M4.4 18.4h4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      {/* Right glass, mirrored */}
      <path d="M14.2 4.2h6.2l-1.5 4.3a1.7 1.7 0 0 1-3.2 0l-1.5-4.3Z" fill="currentColor" />
      <path d="M17.3 9.6v8.2M15 18.4h4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),

  // Wedding (Muhurtham) — a gopuram reduced to its silhouette: one filled
  // tapering tower over a plain base, with the doorway knocked out. The
  // earlier version drew every tier edge separately and turned into a
  // scribble; the shape alone carries the meaning.
  temple: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Kalasam finial — a small separate dot rather than a stub line,
          which merged into the tower's apex at render size. */}
      <circle cx="12" cy="2.6" r="1.2" fill="currentColor" />
      {/* Tower silhouette, filled and tapering */}
      <path d="M12 5l4.4 8.4H7.6L12 5Z" fill="currentColor" />
      {/* Base with the doorway cut out of it via fill-rule */}
      <path
        d="M5.8 13.4h12.4V21H5.8v-7.6Zm4.3 7.6v-3.3a1.9 1.9 0 0 1 3.8 0V21h-3.8Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
};

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 7.2V12l3.4 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M12 21.2c0-.1-6.9-6.5-6.9-11.3a6.9 6.9 0 0 1 13.8 0c0 4.8-6.9 11.2-6.9 11.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="9.8" r="2.4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/**
 * Small ornamental rule: hairline — lotus — hairline.
 *
 * The lotus is the recurring motif of this card's icon set (it's the flower
 * associated with the rituals themselves), drawn as a seated bloom with side
 * petals rather than the earlier single-petal mark.
 */
const Flourish = () => (
  <div className="wec-flourish" aria-hidden="true">
    <span />
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {/* Centre petal */}
      <path d="M12 4.2c1.9 2.7 2.8 4.9 2.8 6.7A2.8 2.8 0 0 1 12 13.6a2.8 2.8 0 0 1-2.8-2.7c0-1.8.9-4 2.8-6.7Z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Outer petals, sweeping down and away */}
      <path d="M9.4 12.4c-1.9-1.4-3.7-1.9-5.4-1.6.3 2.4 1.6 4 3.9 4.7M14.6 12.4c1.9-1.4 3.7-1.9 5.4-1.6-.3 2.4-1.6 4-3.9 4.7" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Water line beneath */}
      <path d="M6.4 18.2h11.2" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" opacity=".75" />
    </svg>
    <span />
  </div>
);

export default function WeddingEventCard() {
  return (
    <div className="wec-card">
      <div className="wec-inner">
        {/* ---- Heading ------------------------------------------------ */}
        {/* A "Together with our families" byline used to open this block;
            removed at the couple's request. */}
        <p className="wec-eyebrow">{CEREMONIES_EYEBROW}</p>
        <h2 className="wec-title">{EVENT_NAME}</h2>
        <p className="wec-lede">{EVENT_DESCRIPTION}</p>

        <Flourish />

        {/* A save-the-date scratch card used to sit here. Removed: the
            schedule directly below already prints both dates, so there was
            nothing left for it to reveal. */}

        {/* ---- Schedule ----------------------------------------------- */}
        <div className="wec-schedule">
          {CEREMONY_DAYS.map((day) => (
            <div className="wec-day" key={day.day}>
              <div className="wec-date">
                <span className="wec-date-num">{day.day}</span>
                <span className="wec-date-month">{day.month}</span>
                <span className="wec-date-rule" aria-hidden="true" />
                <span className="wec-date-weekday">{day.weekday}</span>
              </div>

              <ul className="wec-events">
                {day.events.map((ev) => (
                  <li
                    className={`wec-event${ev.principal ? ' wec-event-principal' : ''}`}
                    key={ev.name}
                  >
                    <span className="wec-event-icon" aria-hidden="true">
                      {CEREMONY_ICONS[ev.icon]}
                    </span>
                    <div className="wec-event-body">
                      <h3 className="wec-event-name">
                        {ev.name}
                        <span className="wec-event-tamil" lang="ta">
                          {ev.tamil}
                        </span>
                      </h3>
                      <p className="wec-event-time">
                        <ClockIcon />
                        {ev.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- Venue -------------------------------------------------- */}
        <div className="wec-venue">
          <p className="wec-eyebrow">{VENUE_EYEBROW}</p>
          <h3 className="wec-venue-name">{VENUE_NAME_DISPLAY}</h3>
          <p className="wec-venue-address">
            <PinIcon />
            <span>{WEDDING_VENUE_ADDRESS.join(' ')}</span>
          </p>

          {/* Two routes to the same place: tap the button on the device you're
              reading on, or scan the QR from a printed copy / another phone. */}
          <div className="wec-venue-actions">
            <a
              className="wec-cta"
              href={WEDDING_VENUE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
              {VIEW_LOCATION_CTA}
            </a>

            {/* Also a link, so the QR is useful on the reading device too —
                and so keyboard users aren't shown a dead image. */}
            <a
              className="wec-qr"
              href={WEDDING_VENUE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              <img className="wec-qr-img" src={venueQr} alt={VENUE_QR_ALT} width="96" height="96" />
              <span className="wec-qr-caption">{VENUE_QR_CAPTION}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
