import BgImage from '../components/BgImage';
import BreakpointVariant from '../components/BreakpointVariant';
import Reveal from '../components/Reveal';
import SvgText from '../components/SvgText';
import GoldenFrameSlideshow from '../components/GoldenFrameSlideshow';
import { img } from '../imageMap';
import {
  STORY_TEXT,
  OUR_STORY_HEADING,
  BRIDE_AND_GROOM_HEADING,
  MEET_THE_HEADING,
  GOLDEN_FRAME_ALT,
} from '../content';

const designSrc = img('sc2GPAV2jTrdKAHcfHti42Mz5YE');
const goldenFrameSrc = img('a6l8leK3Q1bKzvdCCwf3nSzy7E');

/** PAGE 5 — our story paragraph, section titles, golden frame photo slideshow. */
export default function Page5() {
  return (
    <div className="framer-jc4od1" data-framer-name="PAGE 5">
      <div className="framer-11jwzi" data-framer-name="DESIGN" style={{ transform: 'translate(-50%, -50%)' }}>
        <BgImage src={designSrc} loading="lazy" />

        {/* PARAGRAPH STORY — desktop/wide (19px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <Reveal
            as="div"
            className="framer-1ffsb99"
            data-framer-name="PARAGRAPH STORY"
            base="translate(-50%, -50%)"
          >
            <div
              className="framer-text"
              style={{ fontSize: 19, textAlign: 'center', color: 'rgb(70, 1, 1)' }}
            >
              {STORY_TEXT}
            </div>
          </Reveal>
        </BreakpointVariant>
        {/* PARAGRAPH STORY — tablet (6px, bold) */}
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-1ffsb99"
            data-framer-name="PARAGRAPH STORY"
            base="translate(-50%, -50%)"
          >
            <div
              className="framer-text"
              style={{ fontSize: 6, fontWeight: 700, textAlign: 'center', color: 'rgb(70, 1, 1)' }}
            >
              {STORY_TEXT}
            </div>
          </Reveal>
        </BreakpointVariant>
        {/* PARAGRAPH STORY — mobile/laptop (14px) */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <Reveal
            as="div"
            className="framer-1ffsb99"
            data-framer-name="PARAGRAPH STORY"
            base="translate(-50%, -50%)"
          >
            <div
              className="framer-text"
              style={{ fontSize: 14, textAlign: 'center', color: 'rgb(70, 1, 1)' }}
            >
              {STORY_TEXT}
            </div>
          </Reveal>
        </BreakpointVariant>

        {/* OUR STORY heading — appears at every breakpoint with its own scale */}
        <SvgText
          className="framer-1uflneh hidden-1fqmtcv hidden-1lmndnn hidden-ayqnlw hidden-8l4zif"
          viewBox="0 0 423 187"
          scale={0.45}
          textStyle={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 155.61046262696865,
            textAlign: 'center',
            color: 'rgb(209, 177, 122)',
          }}
        >
          {OUR_STORY_HEADING}
        </SvgText>
        <SvgText
          className="framer-1uflneh hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7"
          viewBox="0 0 423 187"
          scale={0.16}
          textStyle={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 155.61046262696865,
            textAlign: 'center',
            color: 'rgb(209, 177, 122)',
          }}
        >
          {OUR_STORY_HEADING}
        </SvgText>
        <SvgText
          className="framer-1uflneh hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7"
          viewBox="0 0 423 187"
          scale={0.34}
          textStyle={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 155.61046262696865,
            textAlign: 'center',
            color: 'rgb(209, 177, 122)',
          }}
        >
          {OUR_STORY_HEADING}
        </SvgText>
        <SvgText
          className="framer-1uflneh hidden-1fqmtcv hidden-1lmndnn hidden-72rtr7"
          viewBox="0 0 423 187"
          scale={0.45}
          base="translateX(-50%)"
          textStyle={{
            fontFamily: '"Luxurious Script", sans-serif',
            fontSize: 155.61046262696865,
            textAlign: 'center',
            color: 'rgb(209, 177, 122)',
          }}
        >
          {OUR_STORY_HEADING}
        </SvgText>

        {/* BRIDE & GROOM heading */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <SvgText
            className="framer-1tpyrcx"
            viewBox="0 0 123 34"
            scale={1}
            textStyle={{
              fontFamily: '"Luxurious Script", sans-serif',
              fontSize: 28.120044006358565,
              textAlign: 'center',
              color: 'rgb(215, 180, 128)',
            }}
          >
            {BRIDE_AND_GROOM_HEADING}
          </SvgText>
        </BreakpointVariant>
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <SvgText
            className="framer-1tpyrcx"
            viewBox="0 0 123 34"
            scale={0.4}
            textStyle={{
              fontFamily: '"Luxurious Script", sans-serif',
              fontSize: 28.120044006358565,
              textAlign: 'center',
              color: 'rgb(215, 180, 128)',
            }}
          >
            {BRIDE_AND_GROOM_HEADING}
          </SvgText>
        </BreakpointVariant>
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <SvgText
            className="framer-1tpyrcx"
            viewBox="0 0 123 34"
            scale={0.65}
            textStyle={{
              fontFamily: '"Luxurious Script", sans-serif',
              fontSize: 28.120044006358565,
              textAlign: 'center',
              color: 'rgb(215, 180, 128)',
            }}
          >
            {BRIDE_AND_GROOM_HEADING}
          </SvgText>
        </BreakpointVariant>

        {/* MEET THE heading */}
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn">
          <SvgText
            className="framer-rldvoq"
            viewBox="0 0 314 91"
            scale={0.83}
            textStyle={{
              fontFamily: '"Elsie Swash Caps", sans-serif',
              fontSize: 75.46071875681922,
              textAlign: 'center',
              color: 'rgb(234, 215, 189)',
            }}
          >
            {MEET_THE_HEADING}
          </SvgText>
        </BreakpointVariant>
        <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <SvgText
            className="framer-rldvoq"
            viewBox="0 0 314 91"
            scale={0.4}
            textStyle={{
              fontFamily: '"Elsie Swash Caps", sans-serif',
              fontSize: 75.46071875681922,
              textAlign: 'center',
              color: 'rgb(234, 215, 189)',
            }}
          >
            {MEET_THE_HEADING}
          </SvgText>
        </BreakpointVariant>
        <BreakpointVariant hide="hidden-1fqmtcv hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
          <SvgText
            className="framer-rldvoq"
            viewBox="0 0 314 91"
            scale={0.66}
            textStyle={{
              fontFamily: '"Elsie Swash Caps", sans-serif',
              fontSize: 75.46071875681922,
              textAlign: 'center',
              color: 'rgb(234, 215, 189)',
            }}
          >
            {MEET_THE_HEADING}
          </SvgText>
        </BreakpointVariant>
      </div>

      {/* GOLDEN FRAME with rotating photo slideshow inset */}
      <Reveal
        as="div"
        className="framer-17p32mh"
        data-framer-name="GOLDEN FRAME"
        base="translate(-50%, -50%) rotate(-90deg)"
      >
        {/* GOLDEN FRAME PNG — all breakpoints, no ssr-variant wrapper in source */}
        <div
          className="framer-y9it6r"
          data-framer-name="GOLDEN FRAME PNG"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <BgImage src={goldenFrameSrc} alt={GOLDEN_FRAME_ALT} fit="contain" loading="lazy" />
        </div>

        <BreakpointVariant hide="hidden-ayqnlw hidden-8l4zif">
          <GoldenFrameSlideshow style={{ transform: 'translate(-50%, -50%) rotate(90deg)' }} />
        </BreakpointVariant>
        <BreakpointVariant hide="hidden-1fqmtcv hidden-1lmndnn hidden-72rtr7">
          <GoldenFrameSlideshow style={{ transform: 'translateY(-50%) rotate(90deg)' }} />
        </BreakpointVariant>
      </Reveal>
    </div>
  );
}
