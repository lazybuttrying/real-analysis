import type { SceneModel } from '../../../contracts';

/**
 * Volterra's function: differentiable everywhere, derivative bounded, yet
 * the derivative is not Riemann integrable.
 *
 * The Smith-Volterra-Cantor set C: start with [0,1]; at stage n = 1, 2, ...
 * remove from each remaining closed interval its middle OPEN interval of
 * absolute length 4^{-n}. The removed complementary intervals are
 * enumerated (a_k, b_k). Total removed after N stages:
 *   sum_{n=1}^{N} 2^{n-1} 4^{-n} = (1 - 2^{-N}) / 2,
 * so C has measure 1/2 (empty interior, nowhere dense, uncountable).
 *
 * On each (a_k, b_k) sits the bump
 *   phi(x) = (x-a)^2 (b-x)^2 sin(1/(x-a)),  a < x < b,
 * phi = 0 at the endpoints, and
 *   phi'(x) = 2(x-a)(b-x)((b-x)-(x-a)) sin(1/(x-a)) - (b-x)^2 cos(1/(x-a)).
 * The oscillatory term -(b-x)^2 cos(1/(x-a)) does NOT die as x -> a+:
 * its amplitude tends to (b-a)^2. Hence phi is differentiable at a with
 * phi'(a) = 0 (difference quotient, squeeze), but phi' is discontinuous
 * at a: phi'(a + 1/(2 pi m)) = -(b - a - 1/(2 pi m))^2 -> -(b-a)^2 != 0.
 * At b everything is tame (the (b-x)^2 factor kills the oscillation), so
 * phi'(b) = 0 with phi' continuous there. In particular each bump is
 * differentiable everywhere with phi = phi' = 0 at the endpoints, but it
 * is NOT C^1 -- and that failure is the engine of the whole example.
 *
 *   f(x) = sum_k 2^{-k} phi_k(x).
 * M-test: |phi_k| <= ((b_k - a_k)/2)^4 <= 1/16, so the sum converges
 * uniformly; |phi'_k| <= 3/2 uniformly in k (see below), so the termwise
 * derivative series converges uniformly too. Hence f is differentiable
 * everywhere with the bounded derivative f' = sum_k 2^{-k} phi'_k.
 * At every c in C, f'(c) = 0; but every neighborhood of c contains a
 * whole complementary interval (a, b) (C has empty interior), and on it
 * f' oscillates with amplitude ~ 2^{-k} (b-a)^2 near a. So f' is
 * discontinuous at every point of C, a set of measure 1/2. Lebesgue's
 * criterion (bounded + discontinuous on a set of positive measure =>
 * not Riemann integrable) then says f' is not Riemann integrable.
 *
 * Verified identities (tests/volterra-function.test.ts):
 *   N = 1: one interval (3/8, 5/8); removed length 1/4 = (1 - 2^{-1})/2.
 *   N stages: 2^N - 1 complementary intervals;
 *   removed length = (1 - 2^{-N}) / 2 (tol 1e-12).
 *   N = 4: 15 intervals, removed 15/32 = 0.46875, remaining 17/32 = 0.53125.
 *   bumpPrime matches central finite differences (tol 1e-6) at interior
 *   points; |bump| <= 1/16 and |bumpPrime| <= 3/2 on spot checks.
 *   On the first interval (a, b) = (3/8, 5/8), dense sampling near a gives
 *   max f' - min f' >= 0.5 (b-a)^2 (the oscillation does not die).
 */

export interface VolterraSample {
  x: number;
  f: number;
  fp: number;
}

interface VolterraInterval {
  a: number;
  b: number;
  /** The stage at which this complementary interval was removed. */
  stage: number;
}

export interface VolterraData {
  /** Number of construction stages used. */
  stage: number;
  /** Index into intervals: the complementary interval under the zoom. */
  interval: number;
  /** Samples of f and f' on a grid over [0, 1], sorted by x. */
  samples: VolterraSample[];
  /** Dense samples of f and f' on the zoomed interval, sorted by x. */
  zoomSamples: VolterraSample[];
  /** All complementary intervals after `stage` stages, ordered by (stage, a). */
  intervals: VolterraInterval[];
  /** Total length removed after `stage` stages. */
  removedLength: number;
  /** 1 - removedLength: total length of what remains (C's outer measure). */
  remainingLength: number;
  /** Numerical max |f'| over the sample grid. */
  supFp: number;
}

export const MIN_STAGE = 1;
export const MAX_STAGE = 7;
export const DEFAULT_STAGE = 4;

/** Number of grid points for the full [0, 1] sampling (before endpoint clusters). */
const GRID_POINTS = 1600;
/** Geometric endpoint-cluster depths added per complementary interval. */
const CLUSTER_DEPTH = 10;
/** Dense zoom samples on the selected interval. */
const ZOOM_POINTS = 800;

/**
 * The complementary intervals removed through stage N (N >= 1), ordered by
 * (stage, left endpoint). Stage n removes from each surviving closed
 * interval its middle open interval of absolute length 4^{-n}.
 * Pure: no DOM, no d3.
 */
export function svcIntervals(stages: number): VolterraInterval[] {
  const out: VolterraInterval[] = [];
  let remaining: Array<[number, number]> = [[0, 1]];
  for (let n = 1; n <= stages; n++) {
    const half = Math.pow(4, -n) / 2;
    const next: Array<[number, number]> = [];
    for (const [l, r] of remaining) {
      const mid = (l + r) / 2;
      const a = mid - half;
      const b = mid + half;
      out.push({ a, b, stage: n });
      next.push([l, a], [b, r]);
    }
    remaining = next;
  }
  return out;
}

/**
 * The bump phi(x) on (a, b): (x-a)^2 (b-x)^2 sin(1/(x-a)); 0 at and
 * outside the endpoints.
 */
export function bump(x: number, a: number, b: number): number {
  if (x <= a || x >= b) return 0;
  const u = x - a;
  const v = b - x;
  return u * u * v * v * Math.sin(1 / u);
}

/**
 * phi'(x) on (a, b): d/dx[(x-a)^2 (b-x)^2] sin(1/(x-a))
 *   - (b-x)^2 cos(1/(x-a)); 0 at and outside the endpoints
 * (the endpoint values are the true derivatives, via the difference
 * quotient -- not limits of this formula, which oscillates near a).
 */
export function bumpPrime(x: number, a: number, b: number): number {
  if (x <= a || x >= b) return 0;
  const u = x - a;
  const v = b - x;
  const d = 2 * u * v * (v - u);
  return d * Math.sin(1 / u) - v * v * Math.cos(1 / u);
}

/**
 * f and f' at x: the weighted sums over the complementary intervals
 * (at most one bump is nonzero at any x; the loop is the definition).
 */
function evalPair(x: number, intervals: VolterraInterval[]): { f: number; fp: number } {
  let f = 0;
  let fp = 0;
  for (let i = 0; i < intervals.length; i++) {
    const iv = intervals[i];
    if (!iv) continue;
    const w = Math.pow(2, -(i + 1));
    f += w * bump(x, iv.a, iv.b);
    fp += w * bumpPrime(x, iv.a, iv.b);
  }
  return { f, fp };
}

function buildSamples(intervals: VolterraInterval[]): VolterraSample[] {
  const xs: number[] = [];
  for (let i = 0; i < GRID_POINTS; i++) {
    xs.push(i / (GRID_POINTS - 1));
  }
  // Geometric clusters near each complementary interval's endpoints, so the
  // oscillation of f' near a is represented in the grid.
  for (const iv of intervals) {
    const len = iv.b - iv.a;
    for (let m = 1; m <= CLUSTER_DEPTH; m++) {
      const t = Math.pow(2, -m) * len;
      xs.push(iv.a + t, iv.b - t);
    }
  }
  xs.sort((p, q) => p - q);
  return xs.map((x) => {
    const { f, fp } = evalPair(x, intervals);
    return { x, f, fp };
  });
}

function buildZoomSamples(iv: VolterraInterval, index: number): VolterraSample[] {
  const w = Math.pow(2, -(index + 1));
  const xs: number[] = [];
  for (let i = 0; i < ZOOM_POINTS; i++) {
    xs.push(iv.a + ((iv.b - iv.a) * i) / (ZOOM_POINTS - 1));
  }
  // Geometric clusters hugging the endpoints: phases 2^m/(b-a) of the
  // cos(1/(x-a)) term, so the plotted zoom shows the non-decaying zigzag.
  for (let m = 1; m <= 40; m++) {
    const t = Math.pow(2, -m) * (iv.b - iv.a);
    xs.push(iv.a + t, iv.b - t);
  }
  xs.sort((p, q) => p - q);
  return xs.map((x) => ({ x, f: w * bump(x, iv.a, iv.b), fp: w * bumpPrime(x, iv.a, iv.b) }));
}

export const volterraModel: SceneModel<VolterraData> = {
  compute(state) {
    const stageRaw = Number(state['stage']);
    const stage = Number.isFinite(stageRaw)
      ? Math.min(MAX_STAGE, Math.max(MIN_STAGE, Math.floor(stageRaw)))
      : DEFAULT_STAGE;
    const intervals = svcIntervals(stage);
    const intervalRaw = Number(state['interval']);
    const interval = Number.isFinite(intervalRaw)
      ? Math.min(intervals.length - 1, Math.max(0, Math.floor(intervalRaw)))
      : 0;
    const samples = buildSamples(intervals);
    const zoomIv = intervals[interval];
    const zoomSamples = zoomIv ? buildZoomSamples(zoomIv, interval) : [];
    let removedLength = 0;
    for (const iv of intervals) removedLength += iv.b - iv.a;
    let supFp = 0;
    for (const s of samples) {
      const m = Math.abs(s.fp);
      if (m > supFp) supFp = m;
    }
    return {
      stage,
      interval,
      samples,
      zoomSamples,
      intervals,
      removedLength,
      remainingLength: 1 - removedLength,
      supFp,
    };
  },
};
