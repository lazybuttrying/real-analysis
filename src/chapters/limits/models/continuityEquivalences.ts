import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Tao, Analysis I, Prop 9.4.7: three equivalent formulations of continuity
 * at the point x0 = 0:
 *   (epsdelta)   forall eps > 0 exists delta > 0:
 *                  |x - x0| < delta ==> |f(x) - f(x0)| < eps,
 *   (sequential) x_n -> x0 ==> f(x_n) -> f(x0),
 *   (preimage)   f^{-1}(V) is a neighborhood of x0 for every open
 *                set V containing f(x0).
 *
 * Two functions: 'square' f(x) = x^2 (continuous at 0) and 'jump'
 * f(x) = x^2 for x < 0, x^2 + 1 for x >= 0 (jump discontinuity at 0).
 * The eps-delta verdict is sampled: maxDelta is the largest delta on a grid
 * for which every sampled x in (-delta, delta) lands inside the eps-band.
 * The sequential verdict checks the tail of x_n = (-1)^n / n against a
 * fixed tolerance; the preimage verdict checks whether a sampled open
 * interval around x0 fits inside f^{-1}(V) for V = (f(x0)-eps, f(x0)+eps).
 *
 * Verified numbers (tests/continuity-equivalences.test.ts):
 *   square, eps = 0.3: maxDelta = 0.54 (analytic sqrt(0.3) = 0.5477);
 *   jump, eps = 0.3: maxDelta = 0 (no delta works);
 *   square, eps = 0.3: preimage radius ~= 0.5 (analytic sqrt(0.3) = 0.5477);
 *   jump, eps = 0.3: preimage radius = 0.
 *
 * Pure: no DOM, no d3.
 */

const FN_OPTIONS = ['square', 'jump'] as const;
type ContFn = (typeof FN_OPTIONS)[number];

const VIEW_OPTIONS = ['epsdelta', 'sequential', 'preimage'] as const;
export type ContView = (typeof VIEW_OPTIONS)[number];

const X0 = 0;
export const EPS_MIN = 0.05;
export const EPS_MAX = 1;
export const EPS_INIT = 0.3;
/** Curve samples per branch. */
const CURVE_SAMPLES = 160;
/** Plot half-width: the x-range is [-XRANGE, XRANGE]. */
export const XRANGE = 1.2;
/** Sequential view: x_n = X0 + (-1)^n / n for n = 1..SEQ_TERMS. */
export const SEQ_TERMS = 40;
/** Tolerance deciding whether f(x_n) has reached f(x0). */
const SEQ_TOL = 0.05;
/** Delta grid for the sampled maximal working delta. */
const DELTA_MAX = 1;
const DELTA_STEP = 0.01;
/** Preimage x-samples on [-XRANGE, XRANGE]. */
const PREIMAGE_SAMPLES = 480;
/** Radius grid for the sampled preimage neighborhood. */
const PREIMAGE_R_MAX = 0.5;
const PREIMAGE_R_STEP = 0.05;

export function contFnOf(raw: unknown): ContFn {
  return raw === 'jump' ? 'jump' : 'square';
}

export function contViewOf(raw: unknown): ContView {
  if (raw === 'sequential') return 'sequential';
  if (raw === 'preimage') return 'preimage';
  return 'epsdelta';
}

export function evaluateContFn(fn: ContFn, x: number): number {
  if (fn === 'square') return x * x;
  return x < X0 ? x * x : x * x + 1;
}

interface SeqTerm {
  n: number;
  xn: number;
  fxn: number;
}

interface Interval {
  lo: number;
  hi: number;
}

export interface CurvePoint {
  x: number;
  y: number;
}

export interface ContinuityEquivalencesData {
  fn: ContFn;
  view: ContView;
  eps: number;
  x0: number;
  fx0: number;
  /** Theoretical verdict: square is continuous at 0, jump is not. */
  continuous: boolean;
  // eps-delta view
  /** Largest sampled delta with the whole (-delta, delta) inside the eps-band. */
  maxDelta: number;
  deltaWorks: boolean;
  // sequential view
  terms: SeqTerm[];
  seqMatches: boolean;
  // preimage view
  vLo: number;
  vHi: number;
  preimageIntervals: Interval[];
  /** Largest sampled r with (-r, r) inside f^{-1}(V); 0 if none. */
  preimageRadius: number;
  preimageHolds: boolean;
  // shared curve, split at x0 so the jump renders without a connecting line
  curveLeft: CurvePoint[];
  curveRight: CurvePoint[];
  yMax: number;
}

/** True when every sampled x in [-radius, radius] lands inside the eps-band. */
function bandWorks(fn: ContFn, fx0: number, eps: number, radius: number): boolean {
  const M = 60;
  for (let i = 0; i <= M; i++) {
    const x = -radius + (2 * radius * i) / M;
    if (Math.abs(evaluateContFn(fn, x) - fx0) >= eps) return false;
  }
  return true;
}

/**
 * Sampled maximal working delta. Monotone in the grid: if delta works, every
 * smaller delta works ((-delta', delta') is a subset), so the first failure
 * stops the search.
 */
export function maxWorkingDelta(fn: ContFn, fx0: number, eps: number): number {
  let best = 0;
  for (let d = DELTA_STEP; d <= DELTA_MAX + 1e-12; d += DELTA_STEP) {
    if (bandWorks(fn, fx0, eps, d)) best = d;
    else break;
  }
  return best;
}

export function seqTerms(fn: ContFn): SeqTerm[] {
  const terms: SeqTerm[] = [];
  for (let n = 1; n <= SEQ_TERMS; n++) {
    const xn = X0 + (n % 2 === 0 ? 1 : -1) / n;
    terms.push({ n, xn, fxn: evaluateContFn(fn, xn) });
  }
  return terms;
}

/** True when the second half of the sequence terms sits within SEQ_TOL of f(x0). */
export function seqMatchesLimit(fn: ContFn, fx0: number): boolean {
  return seqTerms(fn)
    .filter((t) => t.n > SEQ_TERMS / 2)
    .every((t) => Math.abs(t.fxn - fx0) < SEQ_TOL);
}

function preimageInside(fn: ContFn, vLo: number, vHi: number, x: number): boolean {
  const y = evaluateContFn(fn, x);
  return y > vLo && y < vHi;
}

/**
 * Sampled preimage of (vLo, vHi): maximal intervals on [-XRANGE, XRANGE],
 * plus the largest r with (-r, r) inside the preimage (sampled).
 */
export function preimageData(
  fn: ContFn,
  vLo: number,
  vHi: number,
): { intervals: Interval[]; radius: number } {
  const intervals: Interval[] = [];
  let start: number | undefined;
  for (let i = 0; i <= PREIMAGE_SAMPLES; i++) {
    const x = -XRANGE + (2 * XRANGE * i) / PREIMAGE_SAMPLES;
    if (preimageInside(fn, vLo, vHi, x)) {
      if (start === undefined) start = x;
    } else if (start !== undefined) {
      intervals.push({ lo: start, hi: x });
      start = undefined;
    }
  }
  if (start !== undefined) intervals.push({ lo: start, hi: XRANGE });

  let radius = 0;
  for (let r = PREIMAGE_R_STEP; r <= PREIMAGE_R_MAX + 1e-12; r += PREIMAGE_R_STEP) {
    const K = 40;
    let ok = true;
    for (let i = 0; i <= K; i++) {
      const x = -r + (2 * r * i) / K;
      if (!preimageInside(fn, vLo, vHi, x)) {
        ok = false;
        break;
      }
    }
    if (ok) radius = r;
    else break;
  }
  return { intervals, radius };
}

function continuityEquivalencesData(
  fn: ContFn,
  view: ContView,
  eps: number,
): ContinuityEquivalencesData {
  const x0 = X0;
  const fx0 = evaluateContFn(fn, x0);
  const continuous = fn === 'square';

  const maxDelta = maxWorkingDelta(fn, fx0, eps);
  const deltaWorks = maxDelta > 0;

  const terms = seqTerms(fn);
  const seqMatches = seqMatchesLimit(fn, fx0);

  const vLo = fx0 - eps;
  const vHi = fx0 + eps;
  const { intervals: preimageIntervals, radius: preimageRadius } = preimageData(fn, vLo, vHi);
  const preimageHolds = preimageRadius > 0;

  const curveLeft: CurvePoint[] = [];
  const curveRight: CurvePoint[] = [];
  let yMax = 0.5;
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const t = i / CURVE_SAMPLES;
    const xl = -XRANGE + XRANGE * t;
    const yl = xl * xl;
    curveLeft.push({ x: xl, y: yl });
    const xr = XRANGE * t;
    const yr = fn === 'square' ? xr * xr : xr * xr + 1;
    curveRight.push({ x: xr, y: yr });
    yMax = Math.max(yMax, yl, yr);
  }
  yMax *= 1.08;

  return {
    fn,
    view,
    eps,
    x0,
    fx0,
    continuous,
    maxDelta,
    deltaWorks,
    terms,
    seqMatches,
    vLo,
    vHi,
    preimageIntervals,
    preimageRadius,
    preimageHolds,
    curveLeft,
    curveRight,
    yMax,
  };
}

export const continuityEquivalencesModel: SceneModel<ContinuityEquivalencesData> = {
  compute(state) {
    const fn = contFnOf(state['fn']);
    const view = contViewOf(state['view']);
    const eps = clampNumber(state['eps'], EPS_MIN, EPS_MAX, EPS_INIT);
    return continuityEquivalencesData(fn, view, eps);
  },
};
