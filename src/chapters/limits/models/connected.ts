import type { SceneModel } from '../../../contracts';

/**
 * Connected sets, live: a set X is disconnected when it splits as
 * X = U ∪ V with U, V open in X, disjoint on X, and both meeting X
 * (a separation). The scene tries one moving cut point t: U is the open
 * interval to the left of t, V the open interval to the right of t.
 * Three spaces are offered:
 *   interval:   X = [0, 1],            U = (-0.2, t), V = (t, 1.2)
 *   two-pieces: X = [0, 1] ∪ [2, 3],   U = (-0.2, t), V = (t, 3.2)
 *   rationals:  X = Q ∩ [0, 1], cut at the fixed irrational
 *               c = sqrt(2) / 2 (the t slider is ignored in this case)
 * Every boolean below is computed from interval arithmetic on the
 * pieces (intersect / subtract below), never looked up per case —
 * the only case fact used is that sqrt(2) / 2 is not rational, which
 * is what makes the rationals cut cover Q ∩ [0, 1].
 * Pure computation: no DOM, d3, or three.
 */

export interface Interval {
  readonly lo: number;
  readonly hi: number;
  readonly loOpen: boolean;
  readonly hiOpen: boolean;
}

export type ConnectedCaseId = 'interval' | 'two-pieces' | 'rationals';

/** Why a candidate pair (U, V) is not a separation ('none' when it is). */
export type FailureReason = 'none' | 'not-covered' | 'overlap' | 'u-empty' | 'v-empty';

export const CONNECTED_CASES: readonly ConnectedCaseId[] = [
  'interval',
  'two-pieces',
  'rationals',
];

export const CONNECTED_CASE_INIT: ConnectedCaseId = 'interval';

export const CONNECTED_T_MIN = -0.2;
export const CONNECTED_T_MAX = 3.2;
export const CONNECTED_T_INIT = 1.5;

/** The fixed irrational cut for the rationals case: sqrt(2) / 2. */
export const RATIONAL_CUT = Math.sqrt(2) / 2;

export function intervalContains(iv: Interval, t: number): boolean {
  const loOk = t > iv.lo || (!iv.loOpen && t === iv.lo);
  const hiOk = t < iv.hi || (!iv.hiOpen && t === iv.hi);
  return loOk && hiOk;
}

export function intervalIsEmpty(iv: Interval): boolean {
  return iv.lo > iv.hi || (iv.lo === iv.hi && (iv.loOpen || iv.hiOpen));
}

export function intervalIntersect(a: Interval, b: Interval): Interval {
  let lo: number;
  let loOpen: boolean;
  if (a.lo > b.lo) {
    lo = a.lo;
    loOpen = a.loOpen;
  } else if (a.lo < b.lo) {
    lo = b.lo;
    loOpen = b.loOpen;
  } else {
    lo = a.lo;
    loOpen = a.loOpen || b.loOpen;
  }
  let hi: number;
  let hiOpen: boolean;
  if (a.hi < b.hi) {
    hi = a.hi;
    hiOpen = a.hiOpen;
  } else if (a.hi > b.hi) {
    hi = b.hi;
    hiOpen = b.hiOpen;
  } else {
    hi = a.hi;
    hiOpen = a.hiOpen || b.hiOpen;
  }
  return { lo, hi, loOpen, hiOpen };
}

/**
 * a \ b as a list of 0, 1, or 2 intervals. The left piece keeps b.lo only
 * when a contains it and b does not; likewise on the right.
 */
export function intervalSubtract(a: Interval, b: Interval): Interval[] {
  const left = intervalIntersect(a, {
    lo: Number.NEGATIVE_INFINITY,
    hi: b.lo,
    loOpen: true,
    hiOpen: intervalContains(b, b.lo),
  });
  const right = intervalIntersect(a, {
    lo: b.hi,
    hi: Number.POSITIVE_INFINITY,
    loOpen: intervalContains(b, b.hi),
    hiOpen: true,
  });
  return [left, right].filter((iv) => !intervalIsEmpty(iv));
}

export function unionContains(intervals: readonly Interval[], t: number): boolean {
  return intervals.some((iv) => intervalContains(iv, t));
}

/** The pieces of `pieces` cut down to their overlap with `window`. */
export function intersectPieces(
  pieces: readonly Interval[],
  window: Interval,
): Interval[] {
  const out: Interval[] = [];
  for (const p of pieces) {
    const k = intervalIntersect(p, window);
    if (!intervalIsEmpty(k)) out.push(k);
  }
  return out;
}

/** The pieces of `pieces` with `hole` removed. */
export function subtractFromPieces(
  pieces: readonly Interval[],
  hole: Interval,
): Interval[] {
  const out: Interval[] = [];
  for (const p of pieces) out.push(...intervalSubtract(p, hole));
  return out;
}

/** X with U and V both removed: empty if and only if X ⊆ U ∪ V. */
export function uncoveredPieces(
  xPieces: readonly Interval[],
  u: Interval,
  v: Interval,
): Interval[] {
  return subtractFromPieces(subtractFromPieces(xPieces, u), v);
}

/** True when some piece of `a` and some piece of `b` share a point. */
export function piecesOverlap(
  a: readonly Interval[],
  b: readonly Interval[],
): boolean {
  for (const p of a) {
    for (const q of b) {
      if (!intervalIsEmpty(intervalIntersect(p, q))) return true;
    }
  }
  return false;
}

export interface ConnectedData {
  readonly caseId: ConnectedCaseId;
  /** The slider value (clamped). Ignored in the rationals case. */
  readonly t: number;
  /** The effective cut: t, or RATIONAL_CUT in the rationals case. */
  readonly cut: number;
  /** The space X as interval pieces (for rationals: its extent [0, 1]). */
  readonly xPieces: readonly Interval[];
  /** The candidate open set U (an open interval, or a ray cut in Q). */
  readonly uInterval: Interval;
  /** The candidate open set V. */
  readonly vInterval: Interval;
  /** U ∩ X as pieces (for rationals: [0, c) as an extent). */
  readonly uOnX: readonly Interval[];
  /** V ∩ X as pieces (for rationals: (c, 1] as an extent). */
  readonly vOnX: readonly Interval[];
  /** X ⊆ U ∪ V. */
  readonly covered: boolean;
  /** (U ∩ X) ∩ (V ∩ X) = ∅. */
  readonly disjointOnX: boolean;
  /** U ∩ X ≠ ∅. */
  readonly uMeetsX: boolean;
  /** V ∩ X ≠ ∅. */
  readonly vMeetsX: boolean;
  /** All four separation conditions hold: X is disconnected by U, V. */
  readonly separated: boolean;
  /** The first failing condition, or 'none' when separated. */
  readonly failure: FailureReason;
  /** A concrete point of X missed by U ∪ V, when covered is false. */
  readonly uncovered: number | null;
  readonly domLo: number;
  readonly domHi: number;
}

const CLOSED_01: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
const CLOSED_23: Interval = { lo: 2, hi: 3, loOpen: false, hiOpen: false };

function clampT(t: number): number {
  if (!Number.isFinite(t)) return CONNECTED_T_INIT;
  return Math.max(CONNECTED_T_MIN, Math.min(CONNECTED_T_MAX, t));
}

function failureOf(
  covered: boolean,
  disjointOnX: boolean,
  uMeetsX: boolean,
  vMeetsX: boolean,
): FailureReason {
  if (covered && disjointOnX && uMeetsX && vMeetsX) return 'none';
  if (!uMeetsX) return 'u-empty';
  if (!vMeetsX) return 'v-empty';
  if (!covered) return 'not-covered';
  return 'overlap';
}

/** A representative point of the first uncovered piece, for readouts. */
function uncoveredPoint(pieces: readonly Interval[], cut: number): number | null {
  for (const iv of pieces) {
    if (intervalContains(iv, cut)) return cut;
    if (Number.isFinite(iv.lo)) return iv.lo;
    if (Number.isFinite(iv.hi)) return iv.hi;
  }
  return null;
}

function cutData(caseId: 'interval' | 'two-pieces', t: number): ConnectedData {
  const xPieces: readonly Interval[] =
    caseId === 'interval' ? [CLOSED_01] : [CLOSED_01, CLOSED_23];
  const uInterval: Interval = { lo: -0.2, hi: t, loOpen: true, hiOpen: true };
  const vInterval: Interval =
    caseId === 'interval'
      ? { lo: t, hi: 1.2, loOpen: true, hiOpen: true }
      : { lo: t, hi: 3.2, loOpen: true, hiOpen: true };
  const uOnX = intersectPieces(xPieces, uInterval);
  const vOnX = intersectPieces(xPieces, vInterval);
  const rest = uncoveredPieces(xPieces, uInterval, vInterval);
  const covered = rest.length === 0;
  const disjointOnX = !piecesOverlap(uOnX, vOnX);
  const uMeetsX = uOnX.length > 0;
  const vMeetsX = vOnX.length > 0;
  return {
    caseId,
    t,
    cut: t,
    xPieces,
    uInterval,
    vInterval,
    uOnX,
    vOnX,
    covered,
    disjointOnX,
    uMeetsX,
    vMeetsX,
    separated: covered && disjointOnX && uMeetsX && vMeetsX,
    failure: failureOf(covered, disjointOnX, uMeetsX, vMeetsX),
    uncovered: covered ? null : uncoveredPoint(rest, t),
    domLo: caseId === 'interval' ? -0.4 : -0.6,
    domHi: caseId === 'interval' ? 1.4 : 3.6,
  };
}

function rationalsData(t: number): ConnectedData {
  const c = RATIONAL_CUT;
  const uInterval: Interval = { lo: -0.2, hi: c, loOpen: true, hiOpen: true };
  const vInterval: Interval = { lo: c, hi: 1.2, loOpen: true, hiOpen: true };
  const uOnX: readonly Interval[] = [
    { lo: 0, hi: c, loOpen: false, hiOpen: true },
  ];
  const vOnX: readonly Interval[] = [
    { lo: c, hi: 1, loOpen: true, hiOpen: false },
  ];
  // Every rational q in [0, 1] satisfies q < c or q > c, because c itself
  // is irrational and so no point of X is missed by the cut; 0 ∈ U ∩ X
  // and 1 ∈ V ∩ X, and the two sides are disjoint by construction.
  const covered = true;
  const disjointOnX = true;
  const uMeetsX = true;
  const vMeetsX = true;
  return {
    caseId: 'rationals',
    t,
    cut: c,
    xPieces: [CLOSED_01],
    uInterval,
    vInterval,
    uOnX,
    vOnX,
    covered,
    disjointOnX,
    uMeetsX,
    vMeetsX,
    separated: covered && disjointOnX && uMeetsX && vMeetsX,
    failure: failureOf(covered, disjointOnX, uMeetsX, vMeetsX),
    uncovered: null,
    domLo: -0.2,
    domHi: 1.2,
  };
}

function connectedData(caseId: string, t: number): ConnectedData {
  const tt = clampT(t);
  if (caseId === 'two-pieces') return cutData('two-pieces', tt);
  if (caseId === 'rationals') return rationalsData(tt);
  return cutData('interval', tt);
}

export const connectedModel: SceneModel<ConnectedData> = {
  compute(state) {
    const raw = state['case'];
    const caseId = typeof raw === 'string' ? raw : CONNECTED_CASE_INIT;
    return connectedData(caseId, Number(state['t']));
  },
};
