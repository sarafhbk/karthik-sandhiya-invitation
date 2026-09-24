import BgImage from '../components/BgImage';
import BreakpointVariant from '../components/BreakpointVariant';
import Kolam from '../components/Kolam';
import Reveal from '../components/Reveal';
import WhatsAppButton from '../components/WhatsAppButton';
import { img } from '../imageMap';
import {
  TAP_HERE,
  CLOSING_BLESSING_TAMIL,
  CLOSING_BLESSING_ENGLISH,
} from '../content';

const bgSrc = img('6f9AxarIs54UBYT1Lrm4ws9V764');

/**
 * Closing blessing — Tamil block above its English counterpart.
 *
 * Replaces the old "Will You / Join Us?" heading, which was two short words
 * in a 164px slot with a decorative script capital. This text is far longer,
 * so that treatment doesn't survive: the slot is widened in
 * styles/page6-blessing.css and the type is sized down per breakpoint here.
 *
 * Tamil is set in Catamaran because none of the invitation's other families
 * carry Tamil glyphs; leaving it to the system fallback meant a different
 * typeface on every device.
 */
function ClosingBlessing({ tamilSize, englishSize, lineHeight, gap }) {
  return (
    <>
      <p
        lang="ta"
        className="framer-text"
        style={{
          fontFamily: '"Catamaran", sans-serif',
          fontSize: tamilSize,
          lineHeight,
          textAlign: 'center',
          color: 'rgb(88, 11, 26)',
          margin: 0,
        }}
      >
        {CLOSING_BLESSING_TAMIL.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
      <p
        lang="en"
        className="framer-text"
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: englishSize,
          lineHeight,
          textAlign: 'center',
          color: 'rgb(88, 11, 26)',
          margin: `${gap}px 0 0`,
        }}
      >
        {CLOSING_BLESSING_ENGLISH.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    </>
  );
}

/** PAGE 6 — RSVP call to action: WhatsApp button, note, closing blessing. */
export default function Page6() {
  return (
    <div className="framer-iobn9w" data-framer-name="PAGE 6">
      <div className="framer-2ws2lg" data-framer-name="DESIGN " style={{ transform: 'translate(-50%, -50%)' }}>
        <BgImage src={bgSrc} loading="lazy" />

        <div className="framer-1i3op6x-container">
          <BreakpointVariant hide="hidden-1fqmtcv">
            <WhatsAppButton />
          </BreakpointVariant>
          <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
            <WhatsAppButton compact />
          </BreakpointVariant>
        </div>

        {/* The RSVP note paragraph that sat here (three breakpoint variants in
            the .framer-1r8y992 slot, at 46–48%) was removed at the couple's
            request. A kolam now stands in that band instead — one ornament at
            every breakpoint rather than three type variants, since it scales
            rather than re-wrapping. See styles/page6-kolam.css.
            Maroon, not PAGE 2's gold: everything on this page (blessing, TAP
            HERE, the WhatsApp button) is rgb(88, 11, 26), and gold read as a
            foreign element against the pale background here. */}
        <Reveal
          as="div"
          className="page6-kolam"
          base="translate(-50%, -50%)"
          offset="translateY(24px)"
          duration={900}
        >
          <Kolam color="rgb(88, 11, 26)" opacity={0.55} />
        </Reveal>

        {/* TAP HERE label — desktop/wide (17px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <Reveal as="div" className="framer-5l908n" data-framer-name="RSVP Note" base="translateX(-50%)">
            <p className="framer-text" style={{ fontSize: 17, textAlign: 'center', color: 'rgb(88, 11, 26)', margin: 0 }}>
              {TAP_HERE}
            </p>
          </Reveal>
        </BreakpointVariant>
        {/* TAP HERE label — tablet (7px) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal as="div" className="framer-5l908n" data-framer-name="RSVP Note" base="translateX(-50%)">
            <p className="framer-text" style={{ fontSize: 7, textAlign: 'center', color: 'rgb(88, 11, 26)', margin: 0 }}>
              {TAP_HERE}
            </p>
          </Reveal>
        </BreakpointVariant>
        {/* TAP HERE label — mobile/laptop (12px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal as="div" className="framer-5l908n" data-framer-name="RSVP Note" base="translateX(-50%)">
            <p className="framer-text" style={{ fontSize: 12, textAlign: 'center', color: 'rgb(88, 11, 26)', margin: 0 }}>
              {TAP_HERE}
            </p>
          </Reveal>
        </BreakpointVariant>

        {/* CLOSING BLESSING — mobile/laptop/desktop/wide */}
        <BreakpointVariant hide="hidden-1lmndnn">
          <Reveal
            as="div"
            className="framer-ubkreq framer-blessing hidden-1fqmtcv"
            data-framer-name="CLOSING BLESSING"
            base="translate(-50%, -50%)"
            style={{ justifyContent: 'center' }}
          >
            <ClosingBlessing tamilSize={21} englishSize={20} lineHeight={1.5} gap={16} />
          </Reveal>
        </BreakpointVariant>
        {/* CLOSING BLESSING — tablet */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-ubkreq framer-blessing hidden-1fqmtcv"
            data-framer-name="CLOSING BLESSING"
            base="translate(-50%, -50%)"
            style={{ justifyContent: 'center' }}
          >
            <ClosingBlessing tamilSize={13} englishSize={12} lineHeight={1.5} gap={9} />
          </Reveal>
        </BreakpointVariant>
        {/* CLOSING BLESSING — smallest breakpoint */}
        <Reveal
          as="div"
          className="framer-1vzggph framer-blessing hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw"
          data-framer-name="CLOSING BLESSING"
          base="translateX(-50%)"
          style={{ justifyContent: 'center' }}
        >
          <ClosingBlessing tamilSize={7} englishSize={6.5} lineHeight={1.5} gap={5} />
        </Reveal>

        {/* The small "RSVP" label that sat here (top-right, .framer-18d2840)
            was removed at the couple's request — the WhatsApp button and the
            "Will You Join Us?" heading already say it. */}
      </div>
    </div>
  );
}
