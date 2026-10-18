import type { SceneModel } from '../../../contracts';

/**
 * Discontinuities of a monotone function, made concrete.
 *
 * The example is f(x) = x + sum_{k: q_k < x} 2^{-k} on [0, 1], where
 * (q_k) enumerates the rationals of (0, 1) by increasing denominator, then
 * numerator (skipping non-reduced fractions): q_1 = 1/2, q_2 = 1/3,
 * q_3 = 2/3, q_4 = 1/4, q_5 = 3/4, ...
 *
 * The function is strictly increasing, and at each rational q_k it jumps up
 * by 2^{-k}: the left limit f(q_k-) = f(q_k) but
 * f(q_k+) - f(q_k) = 2^{-k}. At irrationals it is continuous. The jumps are
 * the function's discontinuities, and their total
 * sum_{k} 2^{-k} = f(1) - f(0) - 1 < 1 mirrors the general theorem:
 * for monotone f on [a, b], the sum of all jumps is at most f(b) - f(a),
 * so {x : jump(x) > 1/n} has at most n * (f(b) - f(a)) points — a finite
 * set for each n, and a countable union over n.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Slider ranges for the controls; controls must match meta.ts. */
export const MIN_TERMS = 1;
export const MAX_TERMS = 60;
export const DEFAULT_TERMS = 24;

export const MIN_N = 1;
export const MAX_N = 32;
export const DEFAULT_N = 4;

/** Number of grid points used to render the staircase of f. */
export const SAMPLE_COUNT = 801;

/** One discontinuity of the example function. */
interface RationalJump {
  /** The rational q_k in (0, 1). */
  x: number;
  /** Jump size, exactly 2^{-k}. */
  size: number;
  /** 1-based index in the enumeration. */
  k: number;
}

interface FunctionSample {
  x: number;
  f: number;
}

export interface MonotoneDiscontinuitiesData {
  /** Number of rationals used, clamped to [MIN_TERMS, MAX_TERMS]. */
  terms: number;
  /** Jump threshold denominator, clamped to [MIN_N, MAX_N]; threshold is 1/n. */
  n: number;
  /** The rationals q_1..q_terms with their jump sizes. */
  rationals: RationalJump[];
  /** f sampled on a fine grid of [0, 1]; nondecreasing. */
  fSamples: FunctionSample[];
  /** Rationals whose jump size exceeds 1/n. */
  bigJumps: RationalJump[];
  /** Number of jumps exceeding 1/n. */
  bigCount: number;
  /** n * (f(1) - f(0)): the finite-set bound on bigCount. */
  bound: number;
  /** f(1) - f(0) = 1 + sum_{k=1}^{terms} 2^{-k} < 2. */
  range: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * The first `count` rationals of (0, 1), enumerated by increasing
 * denominator and then increasing numerator, skipping non-reduced
 * fractions: 1/2, 1/3, 2/3, 1/4, 3/4, 1/5, 2/5, 3/5, 4/5, ...
 */
export function rationals(count: number): number[] {
  const out: number[] = [];
  for (let d = 2; out.length < count; d++) {
    for (let p = 1; p < d; p++) {
      if (gcd(p, d) === 1) {
        out.push(p / d);
        if (out.length === count) return out;
      }
    }
  }
  return out;
}

/** Jump size of the k-th rational: 2^{-k}. */
export function jumpSize(k: number): number {
  return 2 ** -k;
}

/**
 * f(x) = x + sum_{k: q_k < x} 2^{-k}. The sum runs over every rational
 * strictly below x, so f(q_k) is the left limit and f(q_k+) adds 2^{-k}.
 */
export function exampleValue(x: number, qs: readonly number[]): number {
  let s = x;
  for (let k = 0; k < qs.length; k++) {
    const q = qs[k];
    if (q !== undefined && q < x) s += jumpSize(k + 1);
  }
  return s;
}

export const monotoneDiscontinuitiesModel: SceneModel<MonotoneDiscontinuitiesData> = {
  compute(state) {
    const rawTerms = Number(state['terms']);
    const terms = Number.isFinite(rawTerms)
      ? Math.min(MAX_TERMS, Math.max(MIN_TERMS, Math.floor(rawTerms)))
      : DEFAULT_TERMS;
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN)
      ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(rawN)))
      : DEFAULT_N;

    const qs = rationals(terms);
    const jumps: RationalJump[] = qs.map((x, i) => ({ x, size: jumpSize(i + 1), k: i + 1 }));

    const fSamples: FunctionSample[] = [];
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = i / (SAMPLE_COUNT - 1);
      fSamples.push({ x, f: exampleValue(x, qs) });
    }

    const threshold = 1 / n;
    const bigJumps = jumps.filter((r) => r.size > threshold);
    const first = fSamples[0];
    const lastSample = fSamples[fSamples.length - 1];
    const range = first !== undefined && lastSample !== undefined ? lastSample.f - first.f : 0;
    const bound = n * range;
    return { terms, n, rationals: jumps, fSamples, bigJumps, bigCount: bigJumps.length, bound, range };
  },
};
