import { useEffect, useState } from 'react';
import { getTimeLeft, pad } from './Countdown';
import {
  COUNTDOWN_EYEBROW,
  COUNTDOWN_HEADING,
  COUNTDOWN_FOOTNOTE,
  COUNTDOWN_UNIT_LABELS_LONG,
  MONOGRAM_INITIALS,
  MONOGRAM_A11Y,
} from '../content';

/**
 * Full-width countdown band shown after the last page.
 *
 * A deep maroon field with the four units laid out in a row, separated by
 * hairline rules — per the couple's reference design. Distinct from the
 * inline PAGE 7 `Countdown`, which is small, sits on the page artwork and
 * uses single-letter unit labels; this one is a standalone closing section.
 *
 * Shares `getTimeLeft`/`pad` with that component so there is only one
 * implementation of the target date and tick logic.
 */
export default function CountdownBand() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    [time.days, COUNTDOWN_UNIT_LABELS_LONG.days],
    [time.hours, COUNTDOWN_UNIT_LABELS_LONG.hours],
    [time.minutes, COUNTDOWN_UNIT_LABELS_LONG.minutes],
    [time.seconds, COUNTDOWN_UNIT_LABELS_LONG.seconds],
  ];

  return (
    <section className="cdb" aria-label="Time remaining until the wedding">
      <p className="cdb-eyebrow">{COUNTDOWN_EYEBROW}</p>
      <h2 className="cdb-heading">{COUNTDOWN_HEADING}</h2>

      {/* role=timer + aria-live=off: the values update every second, which
          would otherwise flood a screen reader with announcements. The
          section label above already conveys the purpose. */}
      <div className="cdb-units" role="timer" aria-live="off">
        {units.map(([value, label]) => (
          <div className="cdb-unit" key={label}>
            <span className="cdb-value">{pad(value)}</span>
            <span className="cdb-label">{label}</span>
          </div>
        ))}
      </div>

      <p className="cdb-footnote">{COUNTDOWN_FOOTNOTE}</p>

      {/* Closing monogram — the last thing on the page, echoing the browser
          tab icon. The heart is a drawn path rather than the "♥" character:
          that glyph is missing from a good number of system fonts and would
          render as a tofu box on those devices.
          The whole group is one labelled image so a screen reader says
          "Karthik loves Santhiya" instead of spelling out "K", "S". */}
      <div className="cdb-monogram" role="img" aria-label={MONOGRAM_A11Y}>
        <span className="cdb-monogram-letter" aria-hidden="true">
          {MONOGRAM_INITIALS.groom}
        </span>
        <svg
          className="cdb-monogram-heart"
          viewBox="0 0 24 22"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 21C5.7 16.6 1.5 12.9 1.5 8.2 1.5 4.6 4.3 2 7.6 2c2 0 3.5 1 4.4 2.3C12.9 3 14.4 2 16.4 2c3.3 0 6.1 2.6 6.1 6.2 0 4.7-4.2 8.4-10.5 12.8Z"
            fill="currentColor"
          />
        </svg>
        <span className="cdb-monogram-letter" aria-hidden="true">
          {MONOGRAM_INITIALS.bride}
        </span>
      </div>
    </section>
  );
}
