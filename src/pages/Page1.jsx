import BgImage from '../components/BgImage';
import BreakpointVariant from '../components/BreakpointVariant';
import Reveal from '../components/Reveal';
import RevealLetters from '../components/RevealLetters';
import useHeroParallax from '../components/useHeroParallax';
import { img } from '../imageMap';
import { WedsMark, BRIDE_NAME, GROOM_NAME } from '../content';

const skySrc = img('xZKlIX9XaacbmAvyKmu8rqVXE');
const templeSrc = img('J6YiMAQTDPTAlfG2On7An1Q5lB4');
const treeSrc = img('VrdsdVM2OwyjQkw6YWOB0OowTQ');

/** PAGE 1 — hero: sky, WEDS mark, bride/groom names, tagline, temple, tree. */
export default function Page1() {
  const { skyRef, templeRef, registerBride, registerGroom, registerWeds } = useHeroParallax();

  return (
    <div className="framer-1v6qekl" data-framer-name="PAGE 1">
      <div
        ref={skyRef}
        className="framer-k9a895"
        data-framer-name="SKY"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <BgImage src={skySrc} />

        {/* WEDS mark — desktop/tablet/laptop.
            `base` must match .framer-1pwvksq's own CSS transform
            (translate(-50%,-50%)) so the reveal never drops the centering,
            and `externallyTransformed` hands `transform` over to
            useHeroParallax once the reveal has played. */}
        <BreakpointVariant hide="hidden-1fqmtcv">
          <Reveal
            ref={registerWeds}
            externallyTransformed
            base="translate(-50%, -50%)"
            as="svg"
            className="framer-1pwvksq"
            data-framer-name="WEDS"
            viewBox="0 0 89 38"
          >
            {/* Drawn straight into the slot's viewBox — see WedsMark. */}
            <WedsMark />
          </Reveal>
        </BreakpointVariant>
        {/* WEDS mark — mobile */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            ref={registerWeds}
            externallyTransformed
            base="translate(-50%, -50%)"
            as="svg"
            className="framer-1pwvksq"
            data-framer-name="WEDS"
            viewBox="0 0 89 38"
          >
            {/* Drawn straight into the slot's viewBox — see WedsMark. The
                <foreignObject><p> wrapper the other marks use cannot carry
                this one: WedsMark is an SVG <g>, which has no meaning in the
                HTML context inside a foreignObject, so its transform was
                dropped and the heart collapsed to a few pixels. */}
            <WedsMark />
          </Reveal>
        </BreakpointVariant>

        {/* BRIDE NAME — desktop/wide/laptop/1200-1439 (133px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <div
            ref={registerBride}
            className="framer-1jgx9kw"
            data-framer-name="BRIDE NAME"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <p
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: '"Asul", serif',
                fontSize: 133,
                lineHeight: '129px',
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              <RevealLetters text={BRIDE_NAME} single />
            </p>
          </div>
        </BreakpointVariant>
        {/* BRIDE NAME — tablet (45px) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <div
            ref={registerBride}
            className="framer-1jgx9kw"
            data-framer-name="BRIDE NAME"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <p
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: '"Asul", serif',
                fontSize: 45,
                lineHeight: '129px',
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              <RevealLetters text={BRIDE_NAME} single />
            </p>
          </div>
        </BreakpointVariant>
        {/* BRIDE NAME — mobile (100px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <div
            ref={registerBride}
            className="framer-1jgx9kw"
            data-framer-name="BRIDE NAME"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <p
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: '"Asul", serif',
                fontSize: 100,
                lineHeight: '129px',
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              <RevealLetters text={BRIDE_NAME} single />
            </p>
          </div>
        </BreakpointVariant>

        {/* The "two hearts entwined" tag line that sat here (two breakpoint
            variants in the .framer-64h8lc slot, 18px on desktop and 5px on
            mobile) was removed at the couple's request. The names and the
            heart mark between them carry the hero on their own. */}

        {/* GROOM NAME — desktop/wide/laptop (133px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <div
            ref={registerGroom}
            className="framer-qqlkw5"
            data-framer-name="GROOM NAME"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <p
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: '"Asul", serif',
                fontSize: 133,
                lineHeight: '129px',
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              <RevealLetters text={GROOM_NAME} single />
            </p>
          </div>
        </BreakpointVariant>
        {/* GROOM NAME — tablet (45px) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <div
            ref={registerGroom}
            className="framer-qqlkw5"
            data-framer-name="GROOM NAME"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <p
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: '"Asul", serif',
                fontSize: 45,
                lineHeight: '129px',
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              <RevealLetters text={GROOM_NAME} single />
            </p>
          </div>
        </BreakpointVariant>
        {/* GROOM NAME — mobile (100px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <div
            ref={registerGroom}
            className="framer-qqlkw5"
            data-framer-name="GROOM NAME"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <p
              dir="auto"
              className="framer-text"
              style={{
                fontFamily: '"Asul", serif',
                fontSize: 100,
                lineHeight: '129px',
                textAlign: 'center',
                color: 'rgb(255, 255, 255)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              <RevealLetters text={GROOM_NAME} single />
            </p>
          </div>
        </BreakpointVariant>

        {/* TEMPLE overlay — source has no ssr-variant wrapper here (renders at all breakpoints) */}
        <div
          ref={templeRef}
          className="framer-zrqetc"
          data-framer-name="TEMPLE"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <BgImage src={templeSrc} />
        </div>
      </div>

      {/* Tree — mobile/tablet */}
      <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
        <div className="framer-1bt2sc7" data-framer-name="Tree">
          <BgImage src={treeSrc} />
        </div>
      </BreakpointVariant>
      {/* Tree — laptop/desktop/wide */}
      <BreakpointVariant hide="hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
        <div
          className="framer-1bt2sc7"
          data-framer-name="Tree"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <BgImage src={treeSrc} />
        </div>
      </BreakpointVariant>
    </div>
  );
}
