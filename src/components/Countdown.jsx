import { useEffect, useState } from 'react';
import { WEDDING_DATE_ISO, COUNTDOWN_UNIT_LABELS, COUNTDOWN_SEPARATOR } from '../content';

// The wedding date/time is defined once in content.jsx (WEDDING_DATE_ISO)
// and shared with WeddingEventCard's display strings, so they can't
// drift out of sync.
const TARGET_DATE = new Date(WEDDING_DATE_ISO);

/**
 * Time remaining until the wedding, clamped at zero.
 * Exported so CountdownBand shares this one implementation rather than
 * keeping a second copy that could drift.
 */
export function getTimeLeft() {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export const pad = (n) => String(n).padStart(2, '0');

/**
 * "Counting the Days" code component — a live D/H/M/S countdown to the
 * wedding date. SSR fallback rendered "Loading...", which the runtime
 * bundle then hydrated with the live values.
 */
export default function Countdown({ compact = false }) {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const unit = (value, label) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: compact ? 28 : 46 }}>
      <span
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: compact ? 20 : 32,
          lineHeight: 1,
          color: 'rgb(88, 11, 26)',
        }}
      >
        {pad(value)}
      </span>
      <span
        style={{
          fontFamily: '"Jost", sans-serif',
          fontSize: compact ? 9 : 11,
          letterSpacing: '0.1em',
          color: 'rgb(88, 11, 26)',
          opacity: 0.7,
        }}
      >
        {label}
      </span>
    </div>
  );

  const sep = (
    <span
      style={{
        fontFamily: '"Instrument Serif", serif',
        fontSize: compact ? 20 : 32,
        color: 'rgb(88, 11, 26)',
        opacity: 0.5,
        alignSelf: 'flex-start',
      }}
    >
      {COUNTDOWN_SEPARATOR}
    </span>
  );

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: compact ? 8 : 16,
        padding: compact ? 18 : 28,
        borderRadius: compact ? 37 : 18,
      }}
    >
      {unit(time.days, COUNTDOWN_UNIT_LABELS.days)}
      {sep}
      {unit(time.hours, COUNTDOWN_UNIT_LABELS.hours)}
      {sep}
      {unit(time.minutes, COUNTDOWN_UNIT_LABELS.minutes)}
      {sep}
      {unit(time.seconds, COUNTDOWN_UNIT_LABELS.seconds)}
    </div>
  );
}
