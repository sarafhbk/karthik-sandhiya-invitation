import { KOLAM_A11Y } from '../content';

/**
 * Traditional South Indian kolam (புள்ளி கோலம்) drawn as inline SVG.
 *
 * WHY INLINE SVG, NOT AN IMAGE: the motif is a pure line drawing on the
 * invitation's own paper. As a raster it would need a transparent PNG per
 * breakpoint to stay crisp on retina, and its colour would be baked in. Drawn
 * here it inherits `currentColor`, so the caller tints it to match whichever
 * page it sits on, and it stays sharp at any size.
 *
 * DESIGN — the everyday interlaced doorstep kolam: a 1-3-5-7-5-3-1 diamond of
 * 25 pulli, the line weaving diagonally between them, and every terminal on
 * the perimeter turning back on itself in a round loop.
 *
 * It follows the real order of construction rather than imitating the result:
 *
 *   1. The pulli (dots) are laid out FIRST, on a regular diamond lattice —
 *      every point whose Manhattan distance from the centre is <= 3 steps.
 *   2. The line is then drawn AROUND the dots, never through them. Each dot
 *      is enclosed by its own 45-degree cell; because neighbouring cells
 *      share their edges, the cells read as one continuous woven lattice
 *      rather than 25 separate diamonds.
 *   3. Where the lattice reaches the boundary the line cannot simply stop —
 *      a kolam is an unbroken path — so it loops back. Those loops are the
 *      scalloped ring around the outside.
 *
 * ALL GEOMETRY IS GENERATED, NOT HAND-WRITTEN. The dots, the cell outlines
 * and the loop centres are all derived below from three numbers (grid radius,
 * dot spacing, loop radius). That is deliberate: an earlier version of this
 * file carried a hand-typed coordinate table, and a single transposed pair
 * put one loop out of place — the kind of error that is invisible in the
 * source and obvious on the page. Deriving them means the figure is exactly
 * symmetric under 90-degree rotation by construction, as a kolam must be, and
 * the whole motif can be resized or made denser by changing one constant.
 *
 * Strokes are round-capped and round-joined: a kolam is drawn by trickling
 * rice flour from the hand, so every line in the real thing has soft ends.
 * Mitred corners read as machine-made and break the effect immediately.
 *
 * Purely decorative, so the <svg> is aria-hidden by default. The wrapper still
 * carries a label (KOLAM_A11Y) for the case where a caller opts into exposing
 * it via `decorative={false}`.
 */

// --- Grid definition -------------------------------------------------------
// Everything below is derived from these three numbers.
const GRID_RADIUS = 3; // Manhattan radius -> rows of 1,3,5,7,5,3,1 = 25 pulli
const CENTRE = 60; // centre of the 120x120 viewBox
const SPACING = 11; // distance between orthogonally adjacent pulli
const HALF = SPACING / 2; // cell "radius": each cell tip meets its neighbour's
const LOOP_RADIUS = HALF * 0.95;

/** The pulli, as [x, y] in viewBox units. */
const DOTS = [];
for (let i = -GRID_RADIUS; i <= GRID_RADIUS; i += 1) {
  for (let j = -GRID_RADIUS; j <= GRID_RADIUS; j += 1) {
    if (Math.abs(i) + Math.abs(j) <= GRID_RADIUS) {
      DOTS.push([CENTRE + i * SPACING, CENTRE + j * SPACING]);
    }
  }
}

const isDot = (i, j) => Math.abs(i) + Math.abs(j) <= GRID_RADIUS;

/**
 * The woven lattice: one 45-degree cell per pulli. Adjacent cells share an
 * edge exactly (the tips meet at the midpoint between two dots), so the
 * overlapping outlines draw as a single continuous interlace.
 */
const LATTICE = DOTS.map(
  ([x, y]) =>
    `M${x} ${y - HALF}L${x + HALF} ${y}L${x} ${y + HALF}L${x - HALF} ${y}Z`
).join('');

/**
 * Terminal loops. A cell tip that points away from the centre with no
 * neighbouring dot beyond it is an open end of the path, so the line turns
 * back there.
 *
 * Two subtleties, both of which produced visible defects before being fixed:
 *
 * 1. DE-DUPLICATION. Two adjacent boundary cells can each nominate a loop at
 *    almost the same point. Drawing both stacks two circles, and that loop
 *    renders visibly heavier than its neighbours.
 *
 * 2. SYMMETRY. A naive "skip if near an existing centre" keeps whichever
 *    candidate the loop happens to reach first, so the survivor depends on
 *    iteration order — which is not rotationally symmetric. That is what put
 *    the four shoulder loops slightly out of place.
 *
 * Both are solved by collecting every candidate first, then merging each
 * cluster to its MIDPOINT: the midpoint of a symmetric pair is itself
 * symmetric, so the result cannot depend on visiting order.
 *
 * The threshold is not a guess. Measuring all pairwise distances between the
 * 20 raw candidates gives four pairs at 0.758 apart and every other pair at
 * 14.8 or more — so anything in that gap separates "same loop" from
 * "different loop" unambiguously.
 */
const MERGE_DISTANCE = 4; // well inside the measured 0.758 / 14.8 gap

const loopByKey = new Map();
for (let i = -GRID_RADIUS; i <= GRID_RADIUS; i += 1) {
  for (let j = -GRID_RADIUS; j <= GRID_RADIUS; j += 1) {
    // Only the outermost ring of pulli carries loops.
    if (!isDot(i, j) || Math.abs(i) + Math.abs(j) !== GRID_RADIUS) continue;

    const x = CENTRE + i * SPACING;
    const y = CENTRE + j * SPACING;
    const tips = [
      [[x, y - HALF], [0, -1]],
      [[x + HALF, y], [1, 0]],
      [[x, y + HALF], [0, 1]],
      [[x - HALF, y], [-1, 0]],
    ];

    for (const [[vx, vy], [di, dj]] of tips) {
      if (isDot(i + di, j + dj)) continue; // interior tip, part of the weave
      if (di * i + dj * j <= 0) continue; // faces inward, not a terminal

      const cx = vx + di * LOOP_RADIUS * 0.95;
      const cy = vy + dj * LOOP_RADIUS * 0.95;
      loopByKey.set(`${cx.toFixed(4)},${cy.toFixed(4)}`, [cx, cy]);
    }
  }
}

/** Merge each cluster of near-coincident candidates to its midpoint. */
const LOOPS = [];
for (const point of loopByKey.values()) {
  const cluster = LOOPS.find(
    ([px, py]) => Math.hypot(px - point[0], py - point[1]) < MERGE_DISTANCE
  );
  if (cluster) {
    // Average in place; for the pairs that occur here this is their midpoint,
    // which sits on the axis of symmetry between them.
    cluster[0] = (cluster[0] + point[0]) / 2;
    cluster[1] = (cluster[1] + point[1]) / 2;
  } else {
    LOOPS.push([point[0], point[1]]);
  }
}

export default function Kolam({
  className = '',
  size = 120,
  color = 'rgb(215, 162, 42)',
  strokeWidth = 1.3,
  // The pulli are the point of the motif, so they are sized independently of
  // the line: at small render sizes a dot tied to `strokeWidth` disappears
  // before the curves do, and the figure stops reading as a dot kolam.
  dotRadius = 1.05,
  opacity = 0.85,
  decorative = true,
  style,
}) {
  const a11y = decorative
    ? { 'aria-hidden': 'true' }
    : { role: 'img', 'aria-label': KOLAM_A11Y };

  return (
    <svg
      className={`kolam ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      style={{ color, opacity, ...style }}
      {...a11y}
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* The interlaced lattice, drawn around every pulli. */}
        <path d={LATTICE} />
        {/* Perimeter loops where the path turns back on itself. */}
        {LOOPS.map(([cx, cy]) => (
          <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={LOOP_RADIUS} />
        ))}
      </g>

      {/* The pulli themselves, laid down first in a real kolam and left
          visible here — that is what marks this out as a *dot* kolam rather
          than generic filigree. */}
      <g fill="currentColor">
        {DOTS.map(([cx, cy]) => (
          <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={dotRadius} />
        ))}
      </g>
    </svg>
  );
}
