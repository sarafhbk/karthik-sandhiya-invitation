import BgImage from '../components/BgImage';
import BreakpointVariant from '../components/BreakpointVariant';
import Reveal from '../components/Reveal';
import Countdown from '../components/Countdown';
import { img } from '../imageMap';
import { COUNTING_THE_DAYS } from '../content';

const artfulDesignSrc = img('QUYudzcydz5OmxfmIxgjPrFyb6I');

/**
 * PAGE 7 — countdown timer.
 *
 * The Instagram callout (icon, "TAP HERE", "#Rahulkikiran", "Instagram"
 * label — all of the source's PAGE 7 first sub-section, `.framer-131l9v1`)
 * and the "Touch here for magic" / "@theartfulinvites" text (from the
 * second sub-section, `.framer-s1eh8d`) were removed at the user's request.
 * The countdown + its "Counting the Days" caption are the only content left,
 * moved to the top of the page — see styles/page7-trim.css for the layout
 * override that makes that possible (the source positioned everything
 * absolutely against a fixed section height tuned for the removed content).
 */
export default function Page7() {
  return (
    <div className="framer-s1eh8d" data-framer-name="ARTFUL INVITES DESIGN">
      <BgImage src={artfulDesignSrc} loading="lazy" />

      {/* Countdown timer */}
      <Reveal as="div" className="framer-uuu3on-container" base="" offset="translateY(40px)">
        <BreakpointVariant hide="hidden-1fqmtcv">
          <Countdown />
        </BreakpointVariant>
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Countdown compact />
        </BreakpointVariant>
      </Reveal>

      {/* Counting the Days — desktop/wide (72px) */}
      <Reveal
        as="div"
        className="framer-p0u4y1 hidden-1lmndnn hidden-1fqmtcv"
        data-framer-name="COUNTING THE DAYS"
        base="translate(-50%, -50%)"
        style={{ justifyContent: 'center' }}
      >
        <p
          dir="auto"
          className="framer-text"
          style={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 72,
            lineHeight: '60px',
            color: 'rgb(88, 11, 26)',
            margin: 0,
          }}
        >
          {COUNTING_THE_DAYS}
        </p>
      </Reveal>
      {/* Counting the Days — mobile (48px) */}
      <Reveal
        as="div"
        className="framer-kg5lgu hidden-72rtr7 hidden-8l4zif hidden-1fqmtcv hidden-ayqnlw"
        data-framer-name="COUNTING THE DAYS"
        base=""
        style={{ justifyContent: 'center' }}
      >
        <p
          dir="auto"
          className="framer-text"
          style={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 48,
            lineHeight: '60px',
            color: 'rgb(88, 11, 26)',
            margin: 0,
          }}
        >
          {COUNTING_THE_DAYS}
        </p>
      </Reveal>
      {/* Counting the Days — laptop (30px) */}
      <Reveal
        as="div"
        className="framer-i02xe6 hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw"
        data-framer-name="COUNTING THE DAYS"
        base=""
        style={{ justifyContent: 'center' }}
      >
        <p
          dir="auto"
          className="framer-text"
          style={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 30,
            lineHeight: '60px',
            color: 'rgb(88, 11, 26)',
            margin: 0,
          }}
        >
          {COUNTING_THE_DAYS}
        </p>
      </Reveal>
    </div>
  );
}
