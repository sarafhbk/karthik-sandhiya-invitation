import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Reproduces the per-character reveal used for the hero names/tagline on
 * PAGE 1 (each letter starts blurred, translated down and near-transparent,
 * then settles in with a staggered delay). Source markup wraps every
 * character in its own <span style="opacity:0.001;filter:blur(4px)...">.
 */
export default function RevealLetters({
  text,
  blur = 4,
  translateY = 12,
  stagger = 30,
  duration = 700,
  wrapWords = false,
  single = false,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A staggered per-character blur-and-rise is the exact class of effect the
  // reduce-motion setting exists to suppress, so for those guests the text is
  // simply present from the first paint — same glyphs, same layout, no
  // filter, no transform, no stagger.
  const letterStyle = (i) =>
    reducedMotion
      ? { display: 'inline-block' }
      : {
          display: 'inline-block',
          opacity: visible ? 1 : 0.001,
          filter: visible ? 'blur(0px)' : `blur(${blur}px)`,
          transform: visible ? 'none' : `translateY(${translateY}px)`,
          transition: `opacity ${duration}ms ease, filter ${duration}ms ease, transform ${duration}ms ease`,
          transitionDelay: `${i * stagger}ms`,
        };

  // Source markup wraps some text (e.g. the hero bride/groom names) in a
  // single <span>, not one span per character — the blur/translateY
  // reveal still applies, just as one unit with no stagger.
  if (single) {
    return (
      <span ref={ref} style={letterStyle(0)}>
        {text}
      </span>
    );
  }

  if (!wrapWords) {
    return (
      <span ref={ref}>
        {text.split('').map((ch, i) => (
          <span key={i} style={letterStyle(i)}>
            {ch}
          </span>
        ))}
      </span>
    );
  }

  // Word-grouped mode: renders words separated by spaces, each word's
  // letters kept on one line (`white-space:nowrap`) as in the source.
  const words = text.split(' ');
  let globalIndex = 0;
  return (
    <span ref={ref}>
      {words.map((word, wi) => {
        const start = globalIndex;
        globalIndex += word.length;
        return (
          <span key={wi} style={{ whiteSpace: 'nowrap' }}>
            {word.split('').map((ch, ci) => (
              <span key={ci} style={letterStyle(start + ci)}>
                {ch}
              </span>
            ))}
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
