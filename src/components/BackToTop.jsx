/**
 * "Back to top" control, rendered inline at the very end of the page.
 *
 * Deliberately NOT a floating/fixed button: it sits in normal document flow
 * after the countdown band, so it only comes into view once the reader has
 * actually reached the bottom of the invitation. That removes the whole class
 * of problems a fixed control brings with it — hovering over the artwork,
 * colliding with the music player in the opposite corner, and covering content
 * on short screens.
 *
 * Because it is only reachable by scrolling to the end, there is no
 * scroll-position logic here at all: no scroll listener, no visibility state,
 * no `tabIndex`/`aria-hidden` juggling. It is always visible and always
 * focusable, which is also the simpler thing for assistive tech.
 */
export default function BackToTop() {
  const toTop = () => {
    // Respect a reader who has asked the OS to reduce motion — smooth-
    // scrolling the whole invitation past them is exactly the kind of
    // large-area movement that setting exists to prevent.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="btt-bar">
      <button type="button" className="btt" onClick={toTop}>
        <span aria-hidden="true" className="btt-arrow">&uarr;</span>
        Back to top
      </button>
    </div>
  );
}
