import { useEffect, useMemo, useRef, useState } from 'react';
import { FLOWER_RAIN_A11Y } from '../content';

/**
 * One-shot flower rain over PAGE 2.
 *
 * Behaviour asked for:
 *   - starts when PAGE 2 scrolls into view
 *   - stops when the reader reaches PAGE 3
 *   - plays only ONCE, but a reload replays it
 *
 * That last pair is why the "already played" flag is component state rather
 * than sessionStorage: it must survive scrolling back up to PAGE 2 (so the
 * rain does not restart) but must NOT survive a reload. In-memory state is
 * exactly that lifetime.
 *
 * Animation is pure CSS keyframes, not requestAnimationFrame. Each petal gets
 * its own duration/delay/drift via CSS custom properties, so the compositor
 * runs the whole effect off the main thread — important because PAGE 1 and
 * PAGE 4 already drive scroll-linked transforms, and a JS-per-frame effect
 * here would compete with them for the frame budget and reintroduce the
 * scroll stutter fixed earlier.
 *
 * Petals are removed from the DOM once the fall finishes, so nothing is left
 * animating (or compositing) behind PAGE 2 for the rest of the visit.
 */

// How many petals fall. Enough to read as rain over a ~2135px-tall page
// without turning into confetti.
const PETAL_COUNT = 30;

// Fall duration range, seconds. The spread keeps petals from moving as a
// single sheet.
const MIN_FALL = 6.5;
const MAX_FALL = 11;

// Stagger across which petals begin, seconds.
//
// Kept SHORT deliberately: this used to be 5.5s, which meant the rain took
// several seconds to become visible after PAGE 2 came into view — it read as
// a broken effect rather than a gentle build-up. A fraction of the field now
// starts at 0s (see the delay calculation below) so petals are on screen
// immediately, and the rest follow within ~1.6s.
const MAX_START_DELAY = 1.6;

// Fraction of petals that start with zero delay, so the rain is dense from
// the very first frame instead of ramping up.
const INSTANT_SHARE = 0.4;

// Petal size range in px. Raised from 12-28: at the old size the petals were
// nearly invisible against PAGE 2's busy artwork.
const MIN_SIZE = 20;
const MAX_SIZE = 46;

// Longest a petal can still be on screen: slowest fall plus latest start,
// plus a small margin for the fade. Used to unmount the layer.
const TOTAL_LIFETIME_MS = (MAX_FALL + MAX_START_DELAY + 1) * 1000;

// How far through PAGE 2 the rain begins fading out. 0.8 = the last fifth of
// the section, so it has thinned to nothing by the time PAGE 3 arrives.
const FADE_START_PROGRESS = 0.8;

/**
 * Deterministic pseudo-random in [0,1) from an integer seed.
 *
 * A seeded generator rather than Math.random so the petal field is identical
 * on the server pass and the first client render. With Math.random the two
 * would disagree and React would discard the markup as a hydration mismatch.
 */
function rand(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Five petal shapes, so the field doesn't read as one repeated sprite. */
const PETAL_SHAPES = [
  // Five-petal blossom.
  <path d="M12 2.6c1.9 0 3 1.6 2.7 3.3 1.5-.9 3.4-.3 4.1 1.3.7 1.6-.2 3.4-1.9 3.9 1.6.7 2.2 2.6 1.3 4-1 1.4-3 1.6-4.2.4.3 1.7-.9 3.3-2.6 3.4-1.7 0-3-1.5-2.8-3.2-1.3 1.1-3.3.8-4.2-.7-.9-1.4-.3-3.3 1.3-3.9-1.7-.6-2.5-2.4-1.7-4 .8-1.5 2.7-2 4.1-1-.3-1.7.8-3.3 2.6-3.5Z" />,
  // Simple four-petal flower.
  <path d="M12 3c2 1.6 3 3.2 3 4.8 1.6-1.2 3.3-1.6 5-1.1-.5 1.7-1.7 3.1-3.5 4 1.8.9 3 2.3 3.5 4-1.7.5-3.4.1-5-1.1 0 1.6-1 3.2-3 4.8-2-1.6-3-3.2-3-4.8-1.7 1.2-3.4 1.6-5 1.1.5-1.7 1.7-3.1 3.5-4C6.7 10.9 5.5 9.5 5 7.8c1.6-.5 3.3-.1 5 1.1C10 7.3 11 5.7 12 3Z" />,
  // Single teardrop petal.
  <path d="M12 2.5c3.6 3.4 5.6 6.7 5.6 9.6 0 3.3-2.5 5.9-5.6 5.9s-5.6-2.6-5.6-5.9c0-2.9 2-6.2 5.6-9.6Z" />,
  // Small round bloom with a heart.
  <path d="M12 4.2c1.7-1.6 4.3-1.5 5.8.2 1.5 1.7 1.4 4.3-.2 5.8L12 15.6l-5.6-5.4c-1.6-1.5-1.7-4.1-.2-5.8 1.5-1.7 4.1-1.8 5.8-.2Z" />,
  // Six-petal marigold.
  <path d="M12 2.8c1.4 0 2.4 1.2 2.3 2.5 1.2-.7 2.7-.3 3.4 1 .7 1.2.2 2.8-1 3.4 1.2.6 1.7 2.1 1 3.4-.7 1.2-2.2 1.6-3.4.9.1 1.4-.9 2.6-2.3 2.6-1.4 0-2.4-1.2-2.3-2.6-1.2.7-2.7.3-3.4-.9-.7-1.3-.2-2.8 1-3.4-1.2-.6-1.7-2.2-1-3.4.7-1.3 2.2-1.7 3.4-1C9.6 4 10.6 2.8 12 2.8Z" />,
];

// Petal palette — the invitation's existing golds, blues and pinks (sampled
// from PAGE 2's own type colours) so the rain belongs to this design.
const PETAL_COLORS = [
  'rgb(233, 190, 116)', // gold, from the bride/groom names
  'rgb(215, 162, 42)', // deeper gold, the card's accent
  'rgb(211, 127, 165)', // pink, from the invocation line
  'rgb(42, 134, 196)', // blue, from PAGE 2's headings
  'rgb(240, 214, 170)', // pale gold
  'rgb(232, 168, 190)', // pale pink
];

export default function FlowerRain({ targetRef, stopRef }) {
  // 'idle' -> 'falling' -> 'done'. 'done' is terminal for this page load,
  // which is what makes the effect one-shot.
  const [phase, setPhase] = useState('idle');
  const unmountTimer = useRef(null);
  // The layer's opacity is driven directly on the node during the scroll
  // fade — going through React state would re-render 30 petals per frame.
  const layerRef = useRef(null);

  // Built once. Each petal's look and timing is fixed for the whole fall, so
  // recomputing on re-render would visibly re-randomise mid-animation.
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => {
        // Separate seeds per property; reusing one seed correlates them
        // (e.g. every left-side petal also being the slowest).
        const leftPct = rand(i + 1) * 100;
        const fall = MIN_FALL + rand(i + 2.3) * (MAX_FALL - MIN_FALL);
        // The first slice of the field starts immediately; the rest stagger.
        // Without this the whole field shared one random spread and the rain
        // visibly ramped in over several seconds.
        const delay =
          i < Math.round(PETAL_COUNT * INSTANT_SHARE)
            ? 0
            : rand(i + 5.7) * MAX_START_DELAY;
        const drift = (rand(i + 9.1) * 2 - 1) * 120; // px, left or right
        const spin = (rand(i + 13.3) * 2 - 1) * 720; // deg over the fall
        const size = MIN_SIZE + rand(i + 17.9) * (MAX_SIZE - MIN_SIZE); // px
        const shape = Math.floor(rand(i + 23.5) * PETAL_SHAPES.length);
        const color = PETAL_COLORS[Math.floor(rand(i + 29.7) * PETAL_COLORS.length)];
        const opacity = 0.55 + rand(i + 31.1) * 0.4;
        // Sway period distinct from the fall duration, so the horizontal
        // wobble doesn't stay in lockstep with the descent.
        const sway = 2.4 + rand(i + 37.3) * 2.6;
        return { i, leftPct, fall, delay, drift, spin, size, shape, color, opacity, sway };
      }),
    []
  );

  // Start when PAGE 2 is in view; stop for good once PAGE 3 is reached.
  useEffect(() => {
    // Respect reduced motion by never starting: a full-screen shower of
    // moving elements is exactly what that preference is asking us to skip.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setPhase('done');
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') return undefined;

    const target = targetRef?.current;
    if (!target) return undefined;

    let startObserver = null;
    // rAF handle for the scroll-driven fade, so we coalesce to one write per
    // frame instead of one per scroll event.
    let scrollFrame = null;

    // Reading state inside the callbacks would capture the value from the
    // render that created them; this ref always holds the current phase.
    const phaseAtCallback = { current: phase };

    const finish = () => {
      phaseAtCallback.current = 'done';
      setPhase('done');
      if (scrollFrame !== null) {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = null;
      }
      window.removeEventListener('scroll', onScroll);
      startObserver?.disconnect();
      if (unmountTimer.current) {
        clearTimeout(unmountTimer.current);
        unmountTimer.current = null;
      }
    };

    startObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (phaseAtCallback.current !== 'idle') return;
          // Don't start if the reader is already at PAGE 3 — on a restored
          // scroll position both sections can be partly visible at once, and
          // the rain is meant to be over by the time PAGE 3 is reached.
          const stopNode = stopRef?.current;
          if (stopNode) {
            const r = stopNode.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
              finish();
              return;
            }
          }
          phaseAtCallback.current = 'falling';
          setPhase('falling');
          // Once started we no longer care about PAGE 2's visibility —
          // scrolling away and back must not restart the rain.
          startObserver.disconnect();
          // Self-terminate when the last petal lands, so the layer is gone
          // even if the reader never scrolls as far as PAGE 3.
          unmountTimer.current = setTimeout(finish, TOTAL_LIFETIME_MS);
        });
      },
      // Fire the moment any part of PAGE 2 enters the viewport.
      //
      // This previously used `rootMargin: '0px 0px -15% 0px'`, which SHRINKS
      // the observation box by 15% of the viewport height — so PAGE 2 had to
      // be well into view before the rain started. The positive margin below
      // grows the box instead, arming the effect just before PAGE 2 arrives.
      { rootMargin: '10% 0px 0px 0px', threshold: 0 }
    );
    startObserver.observe(target);

    // Fade the rain out over the last stretch of PAGE 2, rather than cutting
    // it off abruptly when PAGE 3 appears.
    //
    // Progress is measured as how far the reader has scrolled through PAGE 2
    // itself: 0 when its top reaches the viewport top, 1 at its bottom. From
    // FADE_START_PROGRESS onward the layer's opacity ramps to 0, so the rain
    // has visibly thinned out by the time PAGE 3 arrives.
    // A function declaration, not a const arrow: `finish` above needs to
    // remove this listener, and it can be called from the start observer
    // before this point in the effect body is reached. A const would still be
    // in its temporal dead zone there and throw.
    function onScroll() {
      if (phaseAtCallback.current === 'done') return;
      if (scrollFrame !== null) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        const el = targetRef?.current;
        const layer = layerRef.current;
        if (!el || !layer) return;
        const r = el.getBoundingClientRect();
        // Guard against a zero height (can happen mid-layout).
        if (r.height <= 0) return;
        const progress = Math.min(1, Math.max(0, -r.top / r.height));
        if (progress <= FADE_START_PROGRESS) {
          layer.style.opacity = '1';
          return;
        }
        const t = (progress - FADE_START_PROGRESS) / (1 - FADE_START_PROGRESS);
        layer.style.opacity = String(Math.max(0, 1 - t));
        // Fully faded — tear the layer down so nothing keeps compositing.
        if (t >= 1) finish();
      });
    }

    // No initial onScroll() call here: at mount the phase is still 'idle', so
    // the layer isn't rendered and layerRef is null. The separate effect below
    // syncs opacity once the petals actually mount.
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', onScroll);
      startObserver?.disconnect();
      if (unmountTimer.current) clearTimeout(unmountTimer.current);
    };
    // Deliberately mount-only: re-running would rebuild the observers and
    // could restart the rain. `phase` is seeded above and tracked via the
    // local ref instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set the layer's starting opacity from the current scroll position the
  // moment the petals mount. Without this, starting the rain when PAGE 2 is
  // already past the 80% mark would show it at full strength for one frame
  // before the next scroll event corrected it.
  useEffect(() => {
    if (phase !== 'falling') return;
    const el = targetRef?.current;
    const layer = layerRef.current;
    if (!el || !layer) return;
    const r = el.getBoundingClientRect();
    if (r.height <= 0) return;
    const progress = Math.min(1, Math.max(0, -r.top / r.height));
    const t = Math.max(0, (progress - FADE_START_PROGRESS) / (1 - FADE_START_PROGRESS));
    layer.style.opacity = String(Math.max(0, 1 - t));
  }, [phase, targetRef]);

  if (phase !== 'falling') return null;

  return (
    <div
      ref={layerRef}
      className="fr-layer"
      aria-hidden="true"
      role="presentation"
      aria-label={FLOWER_RAIN_A11Y}
    >
      {petals.map((p) => (
        <span
          key={p.i}
          className="fr-petal"
          style={{
            left: `${p.leftPct}%`,
            // Custom properties feed the keyframes, so every petal animates
            // differently from one shared pair of @keyframes rules.
            '--fr-fall': `${p.fall}s`,
            '--fr-delay': `${p.delay}s`,
            '--fr-drift': `${p.drift}px`,
            '--fr-spin': `${p.spin}deg`,
            '--fr-sway': `${p.sway}s`,
            '--fr-size': `${p.size}px`,
            '--fr-opacity': p.opacity,
          }}
        >
          {/* Sway on the wrapper, spin on the svg — one transform animation
              per element, so neither overwrites the other. */}
          <span className="fr-sway">
            <svg viewBox="0 0 24 24" fill={p.color} width={p.size} height={p.size}>
              {PETAL_SHAPES[p.shape]}
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
