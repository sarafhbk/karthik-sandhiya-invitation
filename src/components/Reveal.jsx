import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Replicates Framer's scroll-triggered "appear" animations.
 *
 * The exported site's runtime bundle (script_main.*.mjs) is what actually
 * drove these reveals in the original page; it is not present in the static
 * HTML export. Elements were authored with an inline *hidden* state, e.g.
 *   opacity:0; transform:translate(-50%,-50%) translateY(40px)
 * and the bundle animated them to
 *   opacity:1; transform:translate(-50%,-50%)
 * on scroll-into-view. This component reproduces that with an
 * IntersectionObserver + CSS transition, so the base layout transform
 * (translate(-50%,-50%) etc.) is always preserved and only the appear
 * offset/opacity is animated away — never `transform: none`, which would
 * shift centered elements off-position.
 *
 * Usage:
 *   <Reveal base="translate(-50%, -50%)" offset="translateY(40px)">
 *     ...content with the same visual layout as the source...
 *   </Reveal>
 */
const Reveal = forwardRef(function Reveal(
  {
    as: Tag = 'div',
    base = '',
    offset = 'translateY(40px)',
    duration = 600,
    delay = 0,
    className,
    style,
    children,
    once = true,
    externallyTransformed = false,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  // Only true once the appear animation has actually finished playing. Used
  // to defer handing `transform` over to an external owner — yielding the
  // moment `visible` flips would cancel the reveal's own transform animation
  // mid-flight and make the element snap into place instead of easing in.
  const [revealDone, setRevealDone] = useState(false);

  // Expose the real DOM node to callers (e.g. useHeroParallax needs to drive
  // a scroll-linked transform on the WEDS mark) while still using `ref`
  // internally for the IntersectionObserver.
  useImperativeHandle(forwardedRef, () => ref.current, []);

  useEffect(() => {
    if (!externallyTransformed || !visible) return;
    // Wait out the reveal (duration + its stagger delay) before releasing
    // `transform`. A timer rather than a transitionend listener because the
    // element also transitions `opacity`, which would fire the event early.
    const id = setTimeout(() => setRevealDone(true), duration + delay);
    return () => clearTimeout(id);
  }, [externallyTransformed, visible, duration, delay]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const hiddenTransform = [base, offset].filter(Boolean).join(' ');
  const shownTransform = base || 'none';

  // When `externallyTransformed` is set, another owner (useHeroParallax)
  // writes `transform` directly on this node every scroll frame. Once the
  // reveal has played we must stop emitting `transform` from React, or each
  // re-render would clobber that scroll-linked value and the element would
  // snap back to its base position.
  // Under reduced motion there is no reveal to wait out, so `transform` is
  // handed to the external owner immediately rather than after `duration`.
  const yieldTransform = externallyTransformed && (reducedMotion || (visible && revealDone));

  // Critically, we must also drop `transform` from the transition at the same
  // time. A scroll-linked transform has to apply on the frame it's written;
  // leaving a `transform 600ms ease` transition on the element makes the
  // browser ease toward each new scroll value instead, so the element visibly
  // lags ~600ms behind the scroll position while every untransitioned
  // element (e.g. the plain bride/groom name divs) tracks it exactly.
  // `transitionDelay` goes too — otherwise it would stall the opacity fade.
  // A reduced-motion guest gets the finished state on the first paint: fully
  // opaque, at the base transform, with no transition and no stagger delay.
  // The content itself is untouched — only the movement is dropped.
  const transition = reducedMotion
    ? 'none'
    : yieldTransform
      ? `opacity ${duration}ms ease`
      : `opacity ${duration}ms ease, transform ${duration}ms ease`;

  const shown = visible || reducedMotion;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        ...(yieldTransform ? null : { transform: shown ? shownTransform : hiddenTransform }),
        transition,
        ...(yieldTransform || reducedMotion ? null : { transitionDelay: `${delay}ms` }),
        // Only worth promoting a layer while something actually animates.
        willChange: reducedMotion ? 'auto' : 'transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Reveal;
