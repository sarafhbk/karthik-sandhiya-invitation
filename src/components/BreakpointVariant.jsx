/**
 * Wraps a set of breakpoint-specific markup variants exactly like the
 * source Framer export does: each variant is a literal DOM copy hidden at
 * all breakpoints except the one it was authored for, via the `hidden-*`
 * classes defined in styles/breakpoints.css:
 *   hidden-1fqmtcv  -> hidden at   max-width: 809.98px   (mobile)
 *   hidden-1lmndnn  -> hidden at   810px – 1199.98px     (tablet)
 *   hidden-72rtr7   -> hidden at   1200px – 1439.98px    (laptop)
 *   hidden-8l4zif   -> hidden at   1440px – 1919.98px    (desktop)
 *   hidden-ayqnlw   -> hidden at   min-width: 1920px     (wide)
 *
 * `hide` is the space-separated class list to hide this variant at the
 * breakpoints it does NOT apply to (copied verbatim from the source for
 * each element).
 */
export default function BreakpointVariant({ hide = '', children }) {
  const className = ['ssr-variant', hide].filter(Boolean).join(' ');
  return <div className={className}>{children}</div>;
}
