import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether the visitor has asked their OS to reduce motion.
 *
 * This site is heavily animated — scroll reveals, per-letter blur-ins, hero
 * parallax, a falling-petal layer and an auto-advancing slideshow. For a
 * guest with vestibular sensitivity that combination is genuinely unpleasant,
 * and on iOS/Android the "Reduce Motion" switch is the only way they have to
 * say so. Components consume this to render the SAME final layout with the
 * movement skipped, never to hide content.
 *
 * Subscribed rather than read once, so toggling the setting mid-visit takes
 * effect without a reload. The initial value is read during the first render
 * (not in an effect) so a reduced-motion guest never sees a frame of the
 * animated state before it is switched off.
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return undefined;
    const onChange = (e) => setReduced(e.matches);
    // `addEventListener` on a MediaQueryList is unsupported on older Safari,
    // which only has the deprecated `addListener`. Both are handled so the
    // hook does not throw on those devices.
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return reduced;
}
