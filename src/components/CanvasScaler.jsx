import { useLayoutEffect, useRef } from 'react';

/**
 * Framer's hosted runtime keeps the design canvas
 * (`.framer-m7ulU.framer-72rtr7`, which breakpoints.css/framer-components.css
 * fix to a literal design pixel width — 390/810/1200/1440/1920px) exactly
 * matched to the real browser viewport by setting an inline `width` style
 * directly on that canvas element on load and on resize. Verified live
 * against `demo.html` at several widths: the canvas's computed `transform`
 * is always `none` and its computed `width` is always exactly
 * `window.innerWidth`px — there is no `scale()` transform involved. Once
 * that inline width is set, the rest of the page's `aspect-ratio`-based CSS
 * reflows correctly on its own.
 *
 * (An earlier version of this component wrapped the canvas in a div and
 * applied `transform: scale()` to it instead. That's a different mechanism
 * than the one the source site actually uses, and it produced two bugs: a
 * right-edge gutter from stale/rounded scale measurements, and a
 * blank-gray scroll region from `aspect-ratio`-driven heights not lining
 * up with the scaled visual height. Setting `width` directly avoids both.)
 *
 * Usage: pass a ref-forwarding render prop, or simply render this as a
 * wrapper and let it grab the canvas via `firstElementChild` — the canvas
 * div is expected to be this component's only child.
 */
export default function CanvasScaler({ children }) {
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = wrapperRef.current?.firstElementChild;
    if (!canvas) return;

    // MEASURE THE VIEWPORT, NEVER THE DOCUMENT. `documentElement.clientWidth`
    // looks like the obvious source, but it reports the document's own
    // scrollable width — which this canvas is the widest thing in. Once the
    // canvas is set too wide (say the viewport shrank from 1440 to 440) that
    // reading stays at 1440 because the canvas is holding it there, so the
    // canvas can never shrink back. The measurement has to come from
    // something the canvas cannot influence: `visualViewport.width` when the
    // browser provides it, `innerWidth` otherwise.
    const measure = () => {
      const vv = window.visualViewport;
      // visualViewport.width shrinks under pinch-zoom, which would wrongly
      // narrow the canvas, so divide the zoom back out. At zoom 1 (the normal
      // case) this is exactly the layout viewport width.
      if (vv && vv.width > 0) return Math.round(vv.width * (vv.scale || 1));
      return window.innerWidth;
    };

    const applyWidth = () => {
      const width = measure();

      // GUARD — never write a zero/negative width. Chrome DevTools device
      // mode fires `resize` mid-emulation with the viewport transiently at 0,
      // and Safari does the same on orientation change. Writing that 0px
      // collapses the canvas, and because every page below is sized from
      // `aspect-ratio` they all collapse to 0 height with it: the pages
      // vanish and the document loses nearly all of its scroll length. No
      // later event is guaranteed to undo it, so the page stays broken until
      // reload. Skipping the bad value keeps the last good width, and the
      // polling below re-syncs once the viewport settles.
      if (!(width > 0)) return;

      // Compare against what the DOM actually says, not a cached copy of the
      // last value written. A cached compare would short-circuit whenever the
      // measured width is unchanged — including the case where the canvas got
      // a bad width from somewhere else and the viewport never moved again,
      // which is exactly the state this loop exists to repair.
      const target = `${width}px`;
      if (canvas.style.width === target) return;

      canvas.style.width = target;
    };

    applyWidth();
    window.addEventListener('resize', applyWidth);
    window.addEventListener('orientationchange', applyWidth);
    window.visualViewport?.addEventListener('resize', applyWidth);

    // `resize` is not fully reliable here: DevTools device-mode switches and
    // the mobile URL bar can change the viewport without delivering an event
    // this component sees, and the guard above deliberately drops the bogus
    // 0-width events that DO arrive. A polled check is the backstop, so a
    // stuck canvas self-corrects even with no event.
    //
    // Polled on an interval rather than requestAnimationFrame. This component
    // wraps the whole app and never unmounts, so a rAF backstop would wake the
    // CPU 60x a second for the entire visit — most of this site's guests are
    // on phones, where that is a pointless battery cost. The events above
    // already handle every real resize within a frame; this only has to catch
    // the rare case where no event arrives at all, and 250ms is imperceptible
    // for that.
    const POLL_MS = 250;
    const poll = window.setInterval(applyWidth, POLL_MS);

    return () => {
      window.removeEventListener('resize', applyWidth);
      window.removeEventListener('orientationchange', applyWidth);
      window.visualViewport?.removeEventListener('resize', applyWidth);
      window.clearInterval(poll);
    };
  }, []);

  return <div ref={wrapperRef} style={{ display: 'contents' }}>{children}</div>;
}
