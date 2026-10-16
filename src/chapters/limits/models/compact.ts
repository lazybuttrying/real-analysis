import type { SceneModel } from '../../../contracts';

/**
 * Compact sets, illustrated through finite subcovers of open covers.
 *
 * Three sets, one slider:
 *   closed    [0,1]   covered by 6 overlapping open intervals
 *             U_k = (k/5 - 0.18, k/5 + 0.18), k = 0..5
 *             -- the first 6 intervals already cover [0,1].
 *   halfopen  (0,1]   covered by the shrinking-from-the-left family
 *             V_k = (1/(k+1), 2), k = 0..7
 *             -- any finite subfamily leaves (0, 1/N] uncovered; the gap
 *             closes only at 0, which is missing from the set.
 *   unbounded [0,inf) covered by the growing family
 *             W_k = (-1, k+1), k = 0..7
 *             -- any finite subfamily leaves [N, inf) uncovered; the tail
 *             always escapes to infinity.
 *
 * The slider picks the first `shown` intervals of the cover, so the model
 * just reports the union of that initial segment and whether the set is
 * covered. The halfopen and unbounded families are nested increasing, so
 * their unions are the last interval; the closed family is a chain of
 * overlaps shifting rightward, so its union spans from the first interval's
 * left end to the last interval's right end.
 *
 * Pure computation: no DOM, d3, or three.
 */

export type CompactKind = 'closed' | 'halfopen' | 'unbounded';

export interface CoverInterval {
  readonly lo: number;
  readonly hi: number;
}

/** Half-width of each interval in the closed [0,1] cover. */
export const CLOSED_HALF_WIDTH = 0.18;
/** Number of intervals in the [0,1] cover. */
export const CLOSED_COVER_SIZE = 6;
/** Number of intervals in the (0,1] and [0,inf) covers. */
export const OPEN_COVER_SIZE = 8;
/** Slider range for the subcover size. */
export const MAX_STEP = 8;
export const DEFAULT_STEP = 6;

export function compactKindOf(raw: unknown): CompactKind {
  if (raw === 'halfopen') return 'halfopen';
  if (raw === 'unbounded') return 'unbounded';
  return 'closed';
}

function closedCover(): CoverInterval[] {
  const out: CoverInterval[] = [];
  for (let k = 0; k < CLOSED_COVER_SIZE; k++) {
    const c = k / 5;
    out.push({ lo: c - CLOSED_HALF_WIDTH, hi: c + CLOSED_HALF_WIDTH });
  }
  return out;
}

function halfopenCover(): CoverInterval[] {
  const out: CoverInterval[] = [];
  for (let k = 0; k < OPEN_COVER_SIZE; k++) {
    out.push({ lo: 1 / (k + 1), hi: 2 });
  }
  return out;
}

function unboundedCover(): CoverInterval[] {
  const out: CoverInterval[] = [];
  for (let k = 0; k < OPEN_COVER_SIZE; k++) {
    out.push({ lo: -1, hi: k + 1 });
  }
  return out;
}

/** The full displayed cover for each set. */
export const COVERS: Readonly<Record<CompactKind, readonly CoverInterval[]>> = {
  closed: closedCover(),
  halfopen: halfopenCover(),
  unbounded: unboundedCover(),
};

/**
 * The counterexample sequence for (0,1]: a_n = 1/n converges to 0, which
 * is not in the set, and every subsequence does the same.
 */
export function reciprocalTerm(n: number): number {
  return 1 / n;
}

export interface CompactData {
  kind: CompactKind;
  /** All cover intervals (selected + unselected). */
  intervals: readonly CoverInterval[];
  /** Slider value, clamped to [0, intervals.length]. */
  shown: number;
  /** Union of the first `shown` intervals; null when shown = 0. */
  union: { lo: number; hi: number } | null;
  /** Whether the first `shown` intervals already cover the whole set. */
  coversAll: boolean;
  /**
   * For (0,1] with shown >= 1: the uncovered gap is (0, 1/shown], so this
   * is the right endpoint of the gap. Null otherwise.
   */
  gapHi: number | null;
  /**
   * For [0,inf) with shown >= 1: the uncovered tail is [shown, inf), so
   * this is the left endpoint of the tail. Null otherwise.
   */
  tailLo: number | null;
  /** Axis window for the scene. */
  xLo: number;
  xHi: number;
  /** Finite drawn extent of the set itself. */
  setLo: number;
  setHi: number;
}

export function compactData(kind: CompactKind, step: number): CompactData {
  const intervals = COVERS[kind];
  const shown = Math.max(0, Math.min(intervals.length, Math.floor(step)));

  let union: { lo: number; hi: number } | null = null;
  let coversAll = false;
  let gapHi: number | null = null;
  let tailLo: number | null = null;
  let xLo = -0.4;
  let xHi = 1.4;
  let setLo = 0;
  let setHi = 1;

  if (shown > 0) {
    // The union of the first `shown` intervals. The halfopen and unbounded
    // families are nested increasing, so it is just the last interval; the
    // closed family is a rightward chain of overlaps, so take the extremes.
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i < shown; i++) {
      const iv = intervals[i] as CoverInterval;
      if (iv.lo < lo) lo = iv.lo;
      if (iv.hi > hi) hi = iv.hi;
    }
    union = { lo, hi };
  }

  if (kind === 'closed') {
    xLo = -0.4;
    xHi = 1.4;
    setLo = 0;
    setHi = 1;
    // union.hi = (shown-1)/5 + 0.18 >= 1 exactly when shown >= 6.
    coversAll = shown >= CLOSED_COVER_SIZE;
  } else if (kind === 'halfopen') {
    xLo = -0.25;
    xHi = 2.15;
    setLo = 0;
    setHi = 1;
    coversAll = false;
    if (shown > 0) gapHi = 1 / shown;
  } else {
    xLo = -1.6;
    xHi = 8.6;
    setLo = 0;
    setHi = xHi;
    coversAll = false;
    if (shown > 0) tailLo = shown;
  }

  return { kind, intervals, shown, union, coversAll, gapHi, tailLo, xLo, xHi, setLo, setHi };
}

export const compactModel: SceneModel<CompactData> = {
  compute(state) {
    const kind = compactKindOf(state['set']);
    const raw = Number(state['step']);
    const step = Number.isFinite(raw) ? raw : DEFAULT_STEP;
    return compactData(kind, step);
  },
};
