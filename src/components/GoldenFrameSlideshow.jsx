import { useEffect, useState } from 'react';
import { GOLDEN_FRAME_PHOTOS as PHOTOS } from '../content';
import useReducedMotion from './useReducedMotion';

/**
 * "GOLDEN FRAME SLIDE" code component: a crossfading photo stack shown
 * through the golden frame cut-out on PAGE 5. Auto-advances every 3s.
 *
 * The photos themselves live in content.jsx alongside every other
 * user-facing asset, so swapping them needs no change here.
 */
export default function GoldenFrameSlideshow({ style }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Auto-advancing imagery that the guest cannot pause is the thing the
    // reduce-motion setting is asking us not to do, so the timer simply never
    // starts. Nothing is hidden — the other photos are still in the DOM.
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setIndex((a) => (a + 1) % PHOTOS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Derived rather than pushed through setState: if the guest turns on Reduce
  // Motion mid-visit the stack snaps back to the first photo on the next
  // render, with no extra render pass.
  const active = reducedMotion ? 0 : index;

  return (
    <div
      className="framer-67c80v-container"
      data-framer-name="GOLDEN FRAME SKIDE"
      style={style}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 6,
          touchAction: 'auto',
        }}
      >
        {PHOTOS.map((photo, i) => (
          <img
            key={photo.src}
            src={photo.src}
            /* Only the visible frame is described; the three underneath are
               hidden from assistive tech so the stack is announced as one
               image rather than four overlapping ones. */
            alt={i === active ? photo.alt : ''}
            aria-hidden={i === active ? undefined : 'true'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === active ? 1 : 0,
              transition: reducedMotion ? 'none' : 'opacity 0.8s ease',
              willChange: reducedMotion ? 'auto' : 'opacity',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
