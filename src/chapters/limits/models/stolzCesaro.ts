import type { SceneModel } from '../../../contracts';

/**
 * Stolz-Cesaro example: a_n = 1^2 + 2^2 + ... + n^2, b_n = n^3.
 *
 * Closed forms keep every value exact in floating point for the ranges used:
 *   a_n = n(n+1)(2n+1)/6,  b_n = n^3
 *   r_n = (a_{n+1} - a_n) / (b_{n+1} - b_n) = (n+1)^2 / (3n^2 + 3n + 1) -> 1/3
 *   s_n = a_n / b_n = (n+1)(2n+1) / (6n^2) -> 1/3
 *
 * sumOdd and cesaroMeans support the scene's problems (problems 1 and 3):
 * the Cesaro mean is the b_n = n special case, and the odd-sum problem
 * rests on the exact identity sum_{k=1..n} (2k-1) = n^2.
 * Pure computation: no DOM, d3, or three.
 */

export const MIN_TERMS = 10;
export const MAX_TERMS = 300;
export const DEFAULT_TERMS = 60;

/** The shared limit L = 1/3 of both ratio sequences. */
export const LIMIT = 1 / 3;

/** Partial sum of squares a_n = n(n+1)(2n+1)/6. */
export function sumSquares(n: number): number {
  return (n * (n + 1) * (2 * n + 1)) / 6;
}

/** Cube b_n = n^3. */
export function cube(n: number): number {
  return n * n * n;
}

/** Difference ratio r_n = (a_{n+1}-a_n)/(b_{n+1}-b_n) = (n+1)^2/(3n^2+3n+1). */
export function diffRatio(n: number): number {
  const np1 = n + 1;
  return (np1 * np1) / (3 * n * n + 3 * n + 1);
}

/** Ratio s_n = a_n/b_n = (n+1)(2n+1)/(6n^2). */
export function ratio(n: number): number {
  return ((n + 1) * (2 * n + 1)) / (6 * n * n);
}

/** Sum of the first n odd numbers: 1 + 3 + ... + (2n-1) = n^2, exactly. */
export function sumOdd(n: number): number {
  return n * n;
}

/**
 * Cesaro means of a sequence: c_n = (t_1 + ... + t_n) / n.
 * This is the scene's machinery with b_n = n: the difference ratio of the
 * partial sums against n is just t_{n+1}.
 */
export function cesaroMeans(term: (n: number) => number, count: number): number[] {
  const means: number[] = [];
  let sum = 0;
  for (let n = 1; n <= count; n++) {
    sum += term(n);
    means.push(sum / n);
  }
  return means;
}

export interface StolzCesaroPoint {
  n: number;
  /** r_n: the difference ratio (a_{n+1}-a_n)/(b_{n+1}-b_n). */
  diffRatio: number;
  /** s_n: the plain ratio a_n/b_n. */
  ratio: number;
}

export interface StolzCesaroData {
  /** Number of terms shown. */
  count: number;
  /** The shared limit 1/3. */
  limit: number;
  /** r_n and s_n for n = 1 .. count. */
  points: StolzCesaroPoint[];
  /** s_count, the last plain ratio. */
  finalRatio: number;
  /** r_count, the last difference ratio. */
  finalDiffRatio: number;
}

export const stolzCesaroModel: SceneModel<StolzCesaroData> = {
  compute(state) {
    const raw = Number(state['n']);
    const count = Number.isFinite(raw)
      ? Math.min(MAX_TERMS, Math.max(MIN_TERMS, Math.floor(raw)))
      : DEFAULT_TERMS;
    const points: StolzCesaroPoint[] = [];
    for (let n = 1; n <= count; n++) {
      points.push({ n, diffRatio: diffRatio(n), ratio: ratio(n) });
    }
    return {
      count,
      limit: LIMIT,
      points,
      finalRatio: ratio(count),
      finalDiffRatio: diffRatio(count),
    };
  },
};
