import { forwardRef, useCallback, useRef } from 'react';
import BgImage from '../components/BgImage';
import BreakpointVariant from '../components/BreakpointVariant';
import FlowerRain from '../components/FlowerRain';
import Kolam from '../components/Kolam';
import Reveal from '../components/Reveal';
import SvgText from '../components/SvgText';
import { img } from '../imageMap';
import {
  BRIDE_NAME,
  GROOM_NAME,
  COUPLE_AMPERSAND,
  INVITE_HEADING,
  INVITE_TAGLINE,
  INVOCATION,
  DEITY_ALT,
  FamilyParagraph,
  BlessingsParagraph,
} from '../content';

const designSrc = img('iciTJeQ6Cx2u0gNdZeuKHPf1I');
// The invocation at the head of PAGE 2 is to Krishna (see INVOCATION in
// content.jsx), so the deity image matches it. Sourced from the couple's
// artwork, background removed so it sits on the paper like the original.
const deitySrc = '/images/krishna.webp';

const abhayaLibre = '"Abhaya Libre", serif';
const junge = '"Junge", serif';
const amethysta = '"Amethysta", serif';
const luxuriousScript = '"Luxurious Script", sans-serif';
const philosopher = '"Philosopher", sans-serif';

/**
 * PAGE 2 — invitation: Ganesh ji, family names, bride & groom names, Invite heading.
 *
 * `page3Ref` is the stop signal for the one-shot flower rain: the rain ends
 * as soon as PAGE 3 comes into view. Forwards its own ref so App can hand the
 * same node to FlowerRain as the start trigger.
 */
const Page2 = forwardRef(function Page2({ page3Ref }, forwardedRef) {
  // Own the node locally and mirror it to any forwarded ref. FlowerRain needs
  // this node to observe, and a locally-created ref is guaranteed populated
  // before this component's children run their effects — whereas a ref
  // forwarded down from App is not, so passing that straight through risked
  // the rain never starting.
  const rootRef = useRef(null);
  const setRoot = useCallback(
    (node) => {
      rootRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  return (
    <div ref={setRoot} className="framer-djxj6a" data-framer-name="PAGE 2">
      {/* Sibling of DESIGN, not a child: DESIGN is translate(-50%,-50%)
          centred, so nesting the rain inside it would inherit that offset and
          shift the whole field half a page up and left. This root is
          position:relative with overflow:clip, which is exactly the box the
          petals should fall through. */}
      <FlowerRain targetRef={rootRef} stopRef={page3Ref} />

      <div
        className="framer-gj6wzl"
        data-framer-name="DESIGN"
        id="gj6wzl"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <BgImage src={designSrc} loading="lazy" />

        <Reveal
          as="div"
          className="framer-uf450a framer-deity"
          data-framer-name="Krishna"
          base="translate(-50%, -50%)"
        >
          {/* `contain`, not the default `cover`: this is a tall portrait in a
              slot the template authored as square, and cover would crop the
              head or the robe. */}
          <BgImage src={deitySrc} fit="contain" alt={DEITY_ALT} />
        </Reveal>

        {/* "On the following events" used to sit here at 83%; removed at the
            couple's request. The band is now empty. */}

        {/* GROOM FAMILY paragraph — mobile only */}
        <SvgText
          className="framer-1jawtcx hidden-1fqmtcv"
          viewBox="0 0 477 61"
          textStyle={{
            fontFamily: abhayaLibre,
            fontSize: 16.94137178673437,
            textAlign: 'center',
            color: 'rgb(94, 94, 92)',
          }}
        >
          <FamilyParagraph />
        </SvgText>

        {/* BRIDE NAME — desktop/wide/laptop (133px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <Reveal
            as="div"
            className="framer-wuej87"
            data-framer-name="KIRAN"
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: junge,
                fontSize: 133,
                letterSpacing: '-0.16em',
                textAlign: 'center',
                color: 'rgb(233, 190, 116)',
                margin: 0,
              }}
            >
              {BRIDE_NAME}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* BRIDE NAME — tablet (45px) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-wuej87"
            data-framer-name="KIRAN"
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: junge,
                fontSize: 45,
                letterSpacing: '-0.16em',
                textAlign: 'center',
                color: 'rgb(233, 190, 116)',
                margin: 0,
              }}
            >
              {BRIDE_NAME}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* BRIDE NAME — mobile (97px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-wuej87"
            data-framer-name="KIRAN"
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: junge,
                fontSize: 97,
                letterSpacing: '-0.16em',
                textAlign: 'center',
                color: 'rgb(233, 190, 116)',
                margin: 0,
              }}
            >
              {BRIDE_NAME}
            </h1>
          </Reveal>
        </BreakpointVariant>

        {/* & — desktop/wide/laptop (63px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <Reveal as="div" className="framer-f0n6ls" data-framer-name="&" base="translate(-50%, -50%)">
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: amethysta,
                fontSize: 63,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                color: 'rgb(42, 134, 196)',
                margin: 0,
              }}
            >
              {COUPLE_AMPERSAND}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* & — tablet (20px) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal as="div" className="framer-f0n6ls" data-framer-name="&" base="translate(-50%, -50%)">
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: amethysta,
                fontSize: 20,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                color: 'rgb(42, 134, 196)',
                margin: 0,
              }}
            >
              {COUPLE_AMPERSAND}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* & — mobile (49px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal as="div" className="framer-f0n6ls" data-framer-name="&" base="translate(-50%, -50%)">
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: amethysta,
                fontSize: 49,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                color: 'rgb(42, 134, 196)',
                margin: 0,
              }}
            >
              {COUPLE_AMPERSAND}
            </h1>
          </Reveal>
        </BreakpointVariant>

        {/* GROOM NAME — desktop/wide/laptop (133px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <Reveal
            as="div"
            className="framer-kjvwux"
            data-framer-name="GROOM NAME "
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: junge,
                fontSize: 133,
                letterSpacing: '-0.16em',
                textAlign: 'center',
                color: 'rgb(232, 190, 116)',
                margin: 0,
              }}
            >
              {GROOM_NAME}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* GROOM NAME — tablet (45px) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-kjvwux"
            data-framer-name="GROOM NAME "
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: junge,
                fontSize: 45,
                letterSpacing: '-0.16em',
                textAlign: 'center',
                color: 'rgb(232, 190, 116)',
                margin: 0,
              }}
            >
              {GROOM_NAME}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* GROOM NAME — mobile (97px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-kjvwux"
            data-framer-name="GROOM NAME "
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: junge,
                fontSize: 97,
                letterSpacing: '-0.16em',
                textAlign: 'center',
                color: 'rgb(232, 190, 116)',
                margin: 0,
              }}
            >
              {GROOM_NAME}
            </h1>
          </Reveal>
        </BreakpointVariant>

        {/* GROOM FAMILY paragraph — desktop/wide (full size) */}
        <SvgText
          className="framer-qq17fj hidden-1fqmtcv"
          viewBox="0 0 608 152"
          textStyle={{
            fontFamily: abhayaLibre,
            fontSize: 18.131763489141875,
            lineHeight: '1.4em',
            textAlign: 'center',
            color: 'rgb(94, 94, 92)',
          }}
        >
          <BlessingsParagraph />
        </SvgText>
        {/* GROOM FAMILY paragraph — laptop/1200-1439 (scaled 0.52, 16.9px) */}
        <SvgText
          className="framer-19me4mh hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw"
          viewBox="0 0 480 61"
          scale={0.52}
          textStyle={{
            fontFamily: abhayaLibre,
            fontSize: 16.94137178673437,
            fontWeight: 700,
            textAlign: 'center',
            color: 'rgb(94, 94, 92)',
          }}
        >
          <FamilyParagraph />
        </SvgText>
        {/* GROOM FAMILY blessings — laptop/1200-1439 (scaled 0.52, 14px) */}
        <SvgText
          className="framer-o31tru hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw"
          viewBox="0 0 477 118"
          scale={0.52}
          textStyle={{
            fontFamily: abhayaLibre,
            fontSize: 14.030424892015615,
            fontWeight: 700,
            lineHeight: '1.4em',
            textAlign: 'center',
            color: 'rgb(94, 94, 92)',
          }}
        >
          <BlessingsParagraph />
        </SvgText>

        {/* Invite heading — desktop/wide/laptop (185px) */}
        <BreakpointVariant hide="hidden-1lmndnn">
          <Reveal
            as="div"
            className="framer-z74mwu hidden-1fqmtcv"
            data-framer-name="INVITE"
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: luxuriousScript,
                fontSize: 185,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                color: 'rgb(41, 134, 196)',
                margin: 0,
              }}
            >
              {INVITE_HEADING}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* Invite heading — tablet (153px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-z74mwu hidden-1fqmtcv"
            data-framer-name="INVITE"
            base="translate(-50%, -50%)"
          >
            <h1
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: luxuriousScript,
                fontSize: 153,
                letterSpacing: '-0.04em',
                textAlign: 'center',
                color: 'rgb(41, 134, 196)',
                margin: 0,
              }}
            >
              {INVITE_HEADING}
            </h1>
          </Reveal>
        </BreakpointVariant>
        {/* Invite heading — laptop/1200-1439 (70px) */}
        <Reveal
          as="div"
          className="framer-iyex8o hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw"
          data-framer-name="INVITE"
          base="translate(-50%, -50%)"
        >
          <h1
            dir="auto"
            className="framer-text"
            style={{
              fontFamily: luxuriousScript,
              fontSize: 70,
              letterSpacing: '-0.04em',
              textAlign: 'center',
              color: 'rgb(41, 134, 196)',
              margin: 0,
            }}
          >
            {INVITE_HEADING}
          </h1>
        </Reveal>

        {/* Invite tagline — laptop/1200-1439 */}
        <SvgText
          className="framer-1k8xm2k hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw"
          viewBox="0 0 575.5 67"
          scale={0.4}
          textStyle={{
            fontFamily: abhayaLibre,
            fontSize: 27.92720970537262,
            textAlign: 'center',
            color: 'rgb(99, 99, 97)',
          }}
        >
          <p style={{ margin: 0 }}>{INVITE_TAGLINE}</p>
        </SvgText>
        {/* Invite tagline — laptop/desktop/wide (full, scale 1) */}
        <BreakpointVariant hide="hidden-1lmndnn">
          <SvgText
            className="framer-1byyuno hidden-1fqmtcv"
            viewBox="0 0 577 67"
            textStyle={{
              fontFamily: abhayaLibre,
              fontSize: 28,
              textAlign: 'center',
              color: 'rgb(99, 99, 97)',
            }}
          >
            <p style={{ margin: 0 }}>{INVITE_TAGLINE}</p>
          </SvgText>
        </BreakpointVariant>
        {/* Invite tagline — tablet (scale 0.62) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <SvgText
            className="framer-1byyuno hidden-1fqmtcv"
            viewBox="0 0 577 67"
            scale={0.62}
            textStyle={{
              fontFamily: abhayaLibre,
              fontSize: 28,
              textAlign: 'center',
              color: 'rgb(99, 99, 97)',
            }}
          >
            <p style={{ margin: 0 }}>{INVITE_TAGLINE}</p>
          </SvgText>
        </BreakpointVariant>

        {/* A save-the-date scratch card sat here. It was removed because the
            date it revealed is already printed on PAGE 3's schedule and in
            the countdown band, so the "reveal" gave nothing away. */}

        {/* Invocation to Krishna, beneath the deity.
            The viewBox is wider than the template's original 125.44: that
            width was authored for a shorter string and clipped the closing
            "॥" off the end of this one. The slot's own width cap is widened
            to match in styles/page2-invocation.css. */}
        <SvgText
          className="framer-101gh07 page2-invocation"
          viewBox="0 0 168 14"
          textStyle={{
            fontFamily: philosopher,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.13em',
            textAlign: 'center',
            color: 'rgb(211, 127, 165)',
          }}
        >
          {INVOCATION}
        </SvgText>

        {/* Kolam at the foot of the page — see styles/page2-kolam.css for the
            placement. Gold, picked to sit with the cream names above
            (rgb(233, 190, 116)) rather than compete with the blue "Invite"
            script between them. Last in source order but positioned at 95%
            by CSS, the same pattern the invocation above uses.
            The centring transform is handed to Reveal as `base` rather than
            left in the stylesheet: Reveal writes `transform` inline every
            render, which would otherwise win over the CSS rule and drop the
            kolam half its own width to the right. */}
        <Reveal
          as="div"
          className="page2-kolam"
          base="translate(-50%, -50%)"
          offset="translateY(24px)"
          duration={900}
        >
          <Kolam color="rgb(215, 162, 42)" opacity={0.8} />
        </Reveal>
      </div>
    </div>
  );
});

export default Page2;
