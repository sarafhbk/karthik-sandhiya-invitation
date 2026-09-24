import { useEffect, useRef } from 'react';

// Coefficients measured live against demo.html (getComputedStyle inline
// transform vs window.scrollY, sampled every 100px from 0-2100px, at every
// Framer breakpoint width: 390/810/1200/1440/1920). Each element keeps its
// own translateY(coefficient * scrollY) layered on top of its base
// translate(-50%, -50%) centering transform — nothing else about the
// element's layout changes.
//
// Net on-screen speed = -1 (page scroll) + SKY's own 0.3 + the element's own
// coefficient below:
//   SKY samples the exact same coefficient at every breakpoint (0.3).
//   BRIDE/GROOM NAME and the WEDS mark all get their own 0.65 on top -> net
//     -0.05, i.e. the three of them stay nearly fixed in place together while
//     SKY drifts past underneath. (WEDS uses the same NAME_COEFFICIENT and
//     the same base transform as the names, so it tracks them exactly
//     instead of sliding with SKY.)
//   TEMPLE is -0.1 at 810px and up, but flips to +0.1 at the mobile (<=809px)
//     breakpoint -> net -0.8 desktop / -0.6 mobile, i.e. the temple always
//     rises noticeably faster than the page (and faster than the names),
//     so it physically slides upward over them. Because TEMPLE is the last
//     child of SKY in DOM order (matching the source) and neither element
//     sets a z-index, TEMPLE already paints on top wherever the two overlap
//     — the coefficient difference is what makes that overlap happen while
//     scrolling instead of always/never.
const SKY_COEFFICIENT = 0.3;
const NAME_COEFFICIENT = 0.65;
const TEMPLE_COEFFICIENT_DESKTOP = -0.1;
const TEMPLE_COEFFICIENT_MOBILE = 0.1;
const MOBILE_MAX_WIDTH = 809;

/**
 * Wires PAGE 1's SKY/TEMPLE/BRIDE NAME/GROOM NAME elements to the same
 * scroll-position-driven translateY effect the source site uses, so the
 * temple gopuram physically scrolls up over the bride/groom names instead of
 * everything scrolling together at the same rate.
 *
 * Returns refs to attach to the corresponding elements. Call this once per
 * PAGE 1 instance.
 */
export default function useHeroParallax() {
  const skyRef = useRef(null);
  const templeRef = useRef(null);
  const brideRefs = useRef([]);
  const groomRefs = useRef([]);
  const wedsRefs = useRef([]);

  // Reset the ref-collection arrays each render so breakpoint variants that
  // mount/unmount don't leave stale nulls behind.
  brideRefs.current = [];
  groomRefs.current = [];
  wedsRefs.current = [];

  const registerBride = (el) => {
    if (el && !brideRefs.current.includes(el)) brideRefs.current.push(el);
  };
  const registerGroom = (el) => {
    if (el && !groomRefs.current.includes(el)) groomRefs.current.push(el);
  };
  const registerWeds = (el) => {
    if (el && !wedsRefs.current.includes(el)) wedsRefs.current.push(el);
  };

  useEffect(() => {
    // Scroll-linked parallax is the textbook case the reduce-motion setting
    // is meant to cover (WCAG 2.3.3), so for those guests the hook does
    // nothing at all: no listeners, no compositor layers, and every element
    // stays exactly where the stylesheet puts it. Read directly rather than
    // via the hook because this effect intentionally runs once.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let rafId = null;
    let lastY = -1;
    let templeCoefficient = window.innerWidth <= MOBILE_MAX_WIDTH ? TEMPLE_COEFFICIENT_MOBILE : TEMPLE_COEFFICIENT_DESKTOP;

    // These elements are huge (SKY is a full-width 2082-2498px tall image,
    // TEMPLE 1667-2000px) and get a fresh transform on every scroll frame.
    // Without a compositing hint the browser re-rasterises those large layers
    // on the main thread each frame, which is what makes scrolling stutter.
    // Promoting them once up front lets the compositor just re-position an
    // already-painted layer instead.
    //
    // `will-change` is set a single time here rather than in CSS so only the
    // handful of elements actually driven by this hook get their own layer —
    // applying it broadly would waste GPU memory and can itself hurt
    // performance.
    const allEls = () => [
      skyRef.current,
      templeRef.current,
      ...brideRefs.current,
      ...groomRefs.current,
      ...wedsRefs.current,
    ].filter(Boolean);

    allEls().forEach((el) => {
      el.style.willChange = 'transform';
      // Force each element onto its own compositor layer. translateZ(0) is
      // the widely-supported way to do this; the parallax transforms below
      // preserve it so the layer is never torn down mid-scroll.
      el.style.backfaceVisibility = 'hidden';
    });

    const apply = () => {
      rafId = null;
      const y = window.scrollY;
      // Scroll events can fire without the position actually changing
      // (e.g. horizontal scroll, rubber-banding at the edges). Skipping the
      // write avoids pointless style invalidation on those frames.
      if (y === lastY) return;
      lastY = y;

      if (skyRef.current) {
        skyRef.current.style.transform = `translate(-50%, -50%) translateY(${y * SKY_COEFFICIENT}px) translateZ(0)`;
      }
      if (templeRef.current) {
        templeRef.current.style.transform = `translate(-50%, -50%) translateY(${y * templeCoefficient}px) translateZ(0)`;
      }
      const nameOffset = y * NAME_COEFFICIENT;
      const nameTransform = `translate(-50%, -50%) translateY(${nameOffset}px) translateZ(0)`;
      brideRefs.current.forEach((el) => {
        el.style.transform = nameTransform;
      });
      groomRefs.current.forEach((el) => {
        el.style.transform = nameTransform;
      });
      // The WEDS mark carries the same translate(-50%, -50%) centering in CSS
      // (.framer-1pwvksq) as the name blocks, so it gets the identical
      // transform — dropping the centering here would shift it off-position
      // by half its own size and effectively hide it.
      wedsRefs.current.forEach((el) => {
        el.style.transform = nameTransform;
      });
    };

    const onScroll = () => {
      // Coalesce bursts of scroll events into one update per frame. If a
      // frame is ever dropped/never fires, rafId must still be cleared so
      // the next scroll event schedules a fresh one instead of permanently
      // no-op'ing.
      if (rafId === null) {
        rafId = requestAnimationFrame(apply);
      }
    };

    const onResize = () => {
      templeCoefficient = window.innerWidth <= MOBILE_MAX_WIDTH ? TEMPLE_COEFFICIENT_MOBILE : TEMPLE_COEFFICIENT_DESKTOP;
      lastY = -1; // force a re-apply even if scrollY is unchanged
      apply();
    };

    apply(); // sync to current scroll position on mount (e.g. reload mid-page)
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      // Release the compositor layers when the hook unmounts so we don't
      // leave GPU memory pinned for elements that are no longer animating.
      allEls().forEach((el) => {
        el.style.willChange = '';
      });
    };
  }, []);

  return { skyRef, templeRef, registerBride, registerGroom, registerWeds };
}
