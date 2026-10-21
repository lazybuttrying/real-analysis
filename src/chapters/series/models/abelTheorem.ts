import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Abel's theorem, visualized through Abel summation:
 * if sum a_n converges to S, then lim_{x -> 1-} sum a_n x^n = S.
 *
 * Two canonical power series share the model:
 * - 'grandi': sum_{n>=0} (-1)^n x^n = 1/(1+x) for |x| < 1, Abel sum 1/2.
 *   HONEST FRAMING: the series sum_{n>=0} (-1)^n itself DIVERGES (its partial
 *   sums at x = 1 bounce 1, 0, 1, 0, ... forever). The number 1/2 is only the
 *   value the power series takes in the limit x -> 1- -- the Abel sum -- just
 *   as the Cesaro mean 1/2 is only an average of partial sums, never a sum.
 * - 'alt-harmonic': sum_{n>=0} (-1)^n x^{n+1}/(n+1) = ln(1+x) for |x| < 1,
 *   Abel sum ln 2. Here the ordinary series converges to ln 2, so Abel's
 *   theorem is consistent with the usual sum: it never contradicts
 *   convergence, it only extends the notion of "sum".
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Slider never reaches 1: the Abel sum is a one-sided limit. */
export const X_MAX = 0.99;
/** Grid points across [0, X_MAX]. */
export const GRID_POINTS = 241;
/** Partial-sum terms range. */
export const MIN_TERMS = 1;
export const MAX_TERMS = 200;
const DEFAULT_TERMS = 40;
/** Partial sums shown at x = 1 in the contrast panel (k = 0..SIDE_K). */
export const SIDE_K = 20;

type AbelSeriesKey = 'grandi' | 'alt-harmonic';

const ABEL_LIMITS: Readonly<Record<AbelSeriesKey, number>> = {
  grandi: 0.5,
  'alt-harmonic': Math.LN2,
};

/**
 * The Abel sum function for Grandi: sum_{n=0}^{infty} (-1)^n x^n = 1/(1+x)
 * for |x| < 1.
 */
export function abelSumGrandi(x: number): number {
  return 1 / (1 + x);
}

/**
 * The closed-form sum for the alternating-harmonic power series:
 * sum_{n=0}^{infty} (-1)^n x^{n+1}/(n+1) = ln(1+x) for |x| < 1
 * (integrate the geometric series term by term).
 */
export function closedFormAltHarmonic(x: number): number {
  return Math.log(1 + x);
}

/** Direct summation of S_N(x) = sum_{n=0}^{N} (-1)^n x^n. */
export function grandiPartialSumDirect(x: number, n: number): number {
  let s = 0;
  for (let k = 0; k <= n; k++) {
    s += k % 2 === 0 ? Math.pow(x, k) : -Math.pow(x, k);
  }
  return s;
}

/**
 * Closed form of the same partial sum: (1 - (-x)^{N+1})/(1+x).
 * The tests assert this matches direct summation to machine precision.
 */
export function grandiPartialSumClosed(x: number, n: number): number {
  return (1 - Math.pow(-x, n + 1)) / (1 + x);
}

/**
 * Exact error |S_N(x) - 1/(1+x)| = |(-x)^{N+1}|/(1+x):
 * the gap between the partial sum and the closed-form curve.
 */
export function grandiTailBound(x: number, n: number): number {
  return Math.pow(Math.abs(x), n + 1) / (1 + x);
}

/** Direct summation S_N(x) = sum_{n=0}^{N} (-1)^n x^{n+1}/(n+1). */
export function altHarmonicPartialSum(x: number, n: number): number {
  let s = 0;
  for (let k = 0; k <= n; k++) {
    const term = Math.pow(x, k + 1) / (k + 1);
    s += k % 2 === 0 ? term : -term;
  }
  return s;
}

/**
 * The ordinary partial sum sum_{n=0}^{N} (-1)^n/(n+1) -> ln 2
 * (the alternating harmonic series at x = 1).
 */
export function altHarmonicPartial(n: number): number {
  return altHarmonicPartialSum(1, n);
}

/**
 * Leibniz remainder bound for the alternating-harmonic power series:
 * for 0 <= x <= 1 the remainder is bounded by the first omitted term,
 * |R_N(x)| <= x^{N+2}/(N+2).
 */
export function altHarmonicTailBound(x: number, n: number): number {
  return Math.pow(Math.abs(x), n + 2) / (n + 2);
}

export interface AbelData {
  series: AbelSeriesKey;
  /** Slider x, clamped to [0, 0.99]. */
  x: number;
  /** Partial-sum terms, clamped to [1, 200]. */
  n: number;
  /** Grid points across [0, 0.99]. */
  xs: number[];
  /** S_N(x_i): exact partial sum on the grid. */
  partial: number[];
  /** The closed-form infinite sum on the grid: 1/(1+x) or ln(1+x). */
  limit: number[];
  /** The Abel sum: limit as x -> 1- (0.5 or ln 2). */
  abelLimit: number;
  /** Closed-form value at the slider x. */
  atX: number;
  /** Partial sum at the slider x. */
  partialAtX: number;
  /** |S_N(x) - closed(x)| bound at the slider x. */
  tailBound: number;
  /** k = 0..SIDE_K for the contrast panel at x = 1. */
  sideK: number[];
  /** Partial sums at x = 1 (grandi: 1,0,1,0,...; alt-harmonic: -> ln 2). */
  sideSums: number[];
}

function parseSeries(raw: unknown): AbelSeriesKey {
  return raw === 'alt-harmonic' ? 'alt-harmonic' : 'grandi';
}

function clampX(raw: unknown): number {
  return clampNumber(raw, 0, X_MAX, 0.8);
}

function clampN(raw: unknown): number {
  return clampNumber(raw, MIN_TERMS, MAX_TERMS, DEFAULT_TERMS, true);
}

export const abelTheoremModel: SceneModel<AbelData> = {
  compute(state) {
    const series = parseSeries(state['series']);
    const x = clampX(state['x']);
    const n = clampN(state['n']);

    const xs: number[] = new Array<number>(GRID_POINTS);
    const partial: number[] = new Array<number>(GRID_POINTS);
    const limit: number[] = new Array<number>(GRID_POINTS);
    for (let i = 0; i < GRID_POINTS; i++) {
      const xi = (X_MAX * i) / (GRID_POINTS - 1);
      xs[i] = xi;
      if (series === 'grandi') {
        partial[i] = grandiPartialSumClosed(xi, n);
        limit[i] = abelSumGrandi(xi);
      } else {
        partial[i] = altHarmonicPartialSum(xi, n);
        limit[i] = closedFormAltHarmonic(xi);
      }
    }

    const sideK: number[] = new Array<number>(SIDE_K + 1);
    const sideSums: number[] = new Array<number>(SIDE_K + 1);
    for (let k = 0; k <= SIDE_K; k++) {
      sideK[k] = k;
      sideSums[k] = series === 'grandi' ? (k % 2 === 0 ? 1 : 0) : altHarmonicPartial(k);
    }

    return {
      series,
      x,
      n,
      xs,
      partial,
      limit,
      abelLimit: ABEL_LIMITS[series],
      atX: series === 'grandi' ? abelSumGrandi(x) : closedFormAltHarmonic(x),
      partialAtX: series === 'grandi' ? grandiPartialSumClosed(x, n) : altHarmonicPartialSum(x, n),
      tailBound:
        series === 'grandi' ? grandiTailBound(x, n) : altHarmonicTailBound(x, n),
      sideK,
      sideSums,
    };
  },
};
