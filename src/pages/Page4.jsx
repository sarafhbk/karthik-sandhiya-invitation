import { useEffect, useRef } from 'react';
import BgImage from '../components/BgImage';
import BreakpointVariant from '../components/BreakpointVariant';
import { img } from '../imageMap';

const skySrc = img('Rt8UBMylAa1Uf8GIPommwOJom8');
const cloudSrc = img('hV0sxZSugZ1H4ccFPtXXsbHVi54');
const templeSrc = img('CUxzxi5SNqNa0t77tmEkNmfHc');
const coupleSrc = img('sdAKyTg4o5WmZhgAcUR0DbKY');

// SKY here carries the same scroll-linked translateY(0.3 * scrollY) as PAGE
// 1's SKY (see useHeroParallax.js) — verified live against demo.html at
// 1440px: scrolling from scrollY 7473->8073 moved SKY's own inline transform
// by that same 0.3 coefficient. Kept as a local effect (not the PAGE-1 hook)
// because PAGE 4 only needs this one element, not the temple/name coupling.
// Total parallax travel, as a fraction of PAGE 4's own height, across the
// whole time the section is crossing the viewport. Expressed relatively (not
// in pixels, and not against document scrollY) so the framing is identical on
// a 694px-tall mobile section and a 2562px-tall desktop one — change this one
// number to make the drift stronger or weaker everywhere at once.
const SKY_PARALLAX_RANGE = 0.3;

// The three clouds are plain siblings of SKY (not nested under it), so they
// don't inherit any scroll parallax — confirmed live against demo.html:
// CLOUD3's bounding rect moved exactly -200px for every +200px of scrollY,
// i.e. pure 1:1 page scroll, zero extra parallax coefficient. (That's the
// "vertical movement" the user actually saw — it's SKY sliding independently
// of the stationary-relative-to-page clouds, not the clouds themselves.)
//
// Separately, each cloud plays a continuous horizontal drift: its own
// inline transform ping-pongs out to a peak translateX and back to 0 on a
// ~14s cycle (reversal around the ~7s mark), looping indefinitely for as
// long as the page stays mounted — it does not stop after one pass. All
// three clouds share one clock and differ only in amplitude (measured live
// from demo.html's actual inline transforms): CLOUD2 ~200px, CLOUD1/CLOUD3
// ~299px. Linear rate, no easing curve observed.
const DRIFT_CYCLE_MS = 14000;
const DRIFT_AMPLITUDES = {
  cloud3: 298.75,
  cloud2: 199.84,
  cloud1: 298.75,
};

function driftOffset(elapsed, amplitude) {
  const half = DRIFT_CYCLE_MS / 2;
  const t = elapsed % DRIFT_CYCLE_MS;
  const progress = t <= half ? t / half : (DRIFT_CYCLE_MS - t) / half;
  return amplitude * progress;
}

/** PAGE 4 — sky with drifting clouds, temple, couple cut-out. */
export default function Page4() {
  const sectionRef = useRef(null);
  const skyRef = useRef(null);
  const coupleRef = useRef(null);
  const cloud3Refs = useRef([]);
  const cloud2Refs = useRef([]);
  const cloud1Ref = useRef(null);

  // Reset each render so breakpoint variants that mount/unmount don't leave
  // stale nulls behind (same pattern as useHeroParallax's bride/groom refs).
  cloud3Refs.current = [];
  cloud2Refs.current = [];
  const registerCloud3 = (el) => {
    if (el && !cloud3Refs.current.includes(el)) cloud3Refs.current.push(el);
  };
  const registerCloud2 = (el) => {
    if (el && !cloud2Refs.current.includes(el)) cloud2Refs.current.push(el);
  };

  // SKY + COUPLE CUT OUT scroll parallax — same rAF-throttled scroll-listener
  // pattern as useHeroParallax.js, including the same compositing hint (this
  // SKY is a full-width 2216-2659px tall image, so re-rasterising it on the
  // main thread every scroll frame is what makes scrolling stutter).
  //
  // The cut-out MUST share SKY's transform. Its CSS `top: -23%` (-80% at the
  // 810-1199px breakpoint) is not a resting position — it is the start of a
  // scroll animation, so with no transform applied the element sits ~1205px
  // above PAGE 4's top edge and is clipped away entirely by the section's
  // `overflow: clip` (measured: only 26px of its 1231px height fell inside
  // the section, which is why the couple simply never appeared). Framer's
  // hosted runtime supplies the missing translateY; that script is absent
  // from the static export, so it is reproduced here.
  //
  // Verified live against demo.html at 1440px: across scrollY 4773->7973 the
  // cut-out's inline translateY and SKY's were EQUAL at every sample, both
  // advancing 120px per 400px of scroll — i.e. the identical 0.3 coefficient,
  // not merely a similar one. Hence one shared handler rather than two.
  useEffect(() => {
    let rafId = null;
    let lastKey = '';
    const sky = skyRef.current;
    const couple = coupleRef.current;
    [sky, couple].forEach((el) => {
      if (el) {
        el.style.willChange = 'transform';
        el.style.backfaceVisibility = 'hidden';
      }
    });

    const apply = () => {
      rafId = null;
      const section = sectionRef.current;
      if (!section) return;

      // SECTION-RELATIVE PROGRESS, NOT ABSOLUTE scrollY.
      //
      // The original coefficient was applied to raw `window.scrollY`, which
      // is a whole-document value. How far down the document PAGE 4 happens
      // to start changes enormously with width (measured section top: 2511px
      // at 390 wide, 6385px at 1440), so the same formula produced a wildly
      // different offset per breakpoint. At 1440 it happened to land right;
      // at 390 the cut-out was pushed ~725px above its own section and, since
      // the section is `overflow: clip`, most of it was sliced off — the
      // couple appeared early and never fully arrived.
      //
      // `progress` instead runs 0 -> 1 as the section travels through the
      // viewport, so it is identical at every width and the artwork is framed
      // the same way on a phone, a tablet and a laptop.
      const rect = section.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      const progress = travel > 0
        ? Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel))
        : 0;

      // Drift is expressed as a share of the SECTION's own height, so the
      // movement stays proportional to the artwork instead of being a fixed
      // pixel count that reads as huge on a short mobile section and tiny on
      // a tall desktop one. Centred on 0 (-0.5..+0.5) so the midpoint of the
      // scroll-through is the neutral, uncropped framing.
      const shiftPx = (progress - 0.5) * rect.height * SKY_PARALLAX_RANGE;

      const key = `${Math.round(shiftPx)}`;
      if (key === lastKey) return;
      lastKey = key;

      const shift = `translate(-50%, -50%) translateY(${shiftPx}px) translateZ(0)`;
      if (skyRef.current) skyRef.current.style.transform = shift;
      if (coupleRef.current) coupleRef.current.style.transform = shift;
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(apply);
    };
    apply(); // sync to current scroll position on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    // Width changes alter the section's height (every page is aspect-ratio
    // driven), so the offset has to be recomputed or the artwork stays framed
    // for the previous breakpoint.
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      [sky, couple].forEach((el) => {
        if (el) el.style.willChange = '';
      });
    };
  }, []);

  // Cloud drift — continuous loop on a shared clock, per-element amplitude.
  //
  // The loop only runs while PAGE 4 is actually on screen. Previously it ran
  // unconditionally for the life of the page, writing to five large cloud
  // elements every single frame even when this section was thousands of
  // pixels away — that competed with the scroll handlers for the frame
  // budget and was a major source of scroll stutter. An IntersectionObserver
  // starts/stops it instead.
  useEffect(() => {
    let rafId = null;
    const start = performance.now();

    const clouds = () => [
      ...cloud3Refs.current,
      ...cloud2Refs.current,
      cloud1Ref.current,
    ].filter(Boolean);

    clouds().forEach((el) => {
      el.style.willChange = 'transform';
      el.style.backfaceVisibility = 'hidden';
    });

    const apply = () => {
      const elapsed = performance.now() - start;
      const x3 = driftOffset(elapsed, DRIFT_AMPLITUDES.cloud3);
      const x2 = driftOffset(elapsed, DRIFT_AMPLITUDES.cloud2);
      const x1 = driftOffset(elapsed, DRIFT_AMPLITUDES.cloud1);

      // translateZ(0) keeps each cloud on its own compositor layer, matching
      // the parallax elements above.
      cloud3Refs.current.forEach((el) => {
        el.style.transform = `translateX(${x3}px) translateZ(0)`;
      });
      cloud2Refs.current.forEach((el) => {
        el.style.transform = `translateX(${x2}px) translateZ(0)`;
      });
      if (cloud1Ref.current) {
        cloud1Ref.current.style.transform = `translateX(${x1}px) translateZ(0)`;
      }

      rafId = requestAnimationFrame(apply);
    };

    const startLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(apply);
    };
    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const section = sectionRef.current;
    let observer = null;
    if (section && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) startLoop();
            else stopLoop();
          });
        },
        // Generous margin so the drift is already running by the time the
        // section scrolls into view — the clock is absolute (based on
        // `start`), so resuming never snaps the clouds to a new position.
        { rootMargin: '200px 0px' }
      );
      observer.observe(section);
    } else {
      startLoop();
    }

    return () => {
      if (observer) observer.disconnect();
      stopLoop();
      clouds().forEach((el) => {
        el.style.willChange = '';
      });
    };
  }, []);

  return (
    <div ref={sectionRef} className="framer-6k3h5w" data-framer-name="PAGE 4">
      <div
        ref={skyRef}
        className="framer-1i7f2x2"
        data-framer-name="SKY"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <BgImage src={skySrc} loading="lazy" />
      </div>

      {/* CLOUD3 — tablet/laptop/desktop/wide (hidden-1fqmtcv = hidden only
          on mobile, ≤809.98px, so this is the non-mobile variant) */}
      <div ref={registerCloud3} className="framer-uhifu hidden-1fqmtcv" data-framer-name="CLOUD3">
        <BgImage src={cloudSrc} />
      </div>
      {/* CLOUD3 — mobile (carries all 4 of the ≥810px hides, so it's
          visible only where framer-uhifu above is hidden) */}
      <BreakpointVariant hide="hidden-1fqmtcv">
        <div ref={registerCloud3} className="framer-j3lu80 hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw" data-framer-name="CLOUD3">
          <BgImage src={cloudSrc} />
        </div>
      </BreakpointVariant>
      <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
        <div ref={registerCloud3} className="framer-j3lu80 hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw" data-framer-name="CLOUD3">
          <BgImage src={cloudSrc} />
        </div>
      </BreakpointVariant>

      {/* CLOUD2 — tablet/laptop/desktop/wide (same hidden-1fqmtcv logic as CLOUD3) */}
      <div ref={registerCloud2} className="framer-3wh34t hidden-1fqmtcv" data-framer-name="CLOUD2">
        <BgImage src={cloudSrc} loading="lazy" />
      </div>
      {/* CLOUD2 — mobile */}
      <BreakpointVariant hide="hidden-1fqmtcv">
        <div ref={registerCloud2} className="framer-wtw5t7 hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw" data-framer-name="CLOUD2">
          <BgImage src={cloudSrc} />
        </div>
      </BreakpointVariant>
      <BreakpointVariant hide="hidden-1lmndnn hidden-ayqnlw hidden-8l4zif hidden-72rtr7">
        <div ref={registerCloud2} className="framer-wtw5t7 hidden-72rtr7 hidden-8l4zif hidden-1lmndnn hidden-ayqnlw" data-framer-name="CLOUD2">
          <BgImage src={cloudSrc} />
        </div>
      </BreakpointVariant>

      {/* CLOUD 1 — all breakpoints, no ssr-variant wrapper in source */}
      <div ref={cloud1Ref} className="framer-k8o81x" data-framer-name="CLOUD 1">
        <BgImage src={cloudSrc} loading="lazy" />
      </div>

      {/* TEMPLE */}
      <div className="framer-ql1ziz" data-framer-name="TEMPLE" style={{ transform: 'translate(-50%, -50%)' }}>
        <BgImage src={templeSrc} fit="contain" loading="lazy" />
      </div>

      {/* COUPLE CUT OUT — all breakpoints, no ssr-variant wrapper in source.
          Loaded eagerly, not lazily like the source markup: this element sits
          at a large negative `top` offset (-23% desktop, up to -80% on one
          breakpoint) inside PAGE 4's own `overflow: clip` container
          (.framer-6k3h5w). Verified live that combination makes the native
          `loading="lazy"` IntersectionObserver never fire even after the
          element is scrolled fully into the viewport (img.complete stayed
          false / naturalWidth stayed 0 indefinitely; forcing loading="eager"
          on the same element loaded it immediately) — i.e. the image
          silently never renders. Framer's own hosted runtime apparently
          works around this some other way; the simplest reliable fix here is
          to just not lazy-load this one image. */}
      <div
        ref={coupleRef}
        className="framer-yaux2a"
        data-framer-name="COUPLE CUT OUT"
        // Base transform only; the scroll effect above overwrites this with
        // the SKY-matched translateY on mount and on every scroll frame.
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <BgImage src={coupleSrc} />
      </div>
    </div>
  );
}
