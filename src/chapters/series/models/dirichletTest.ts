import type { SceneModel } from '../../../contracts';

/**
 * Dirichlet's test, applied to the sine series sum_{n>=1} sin(nx)/n.
 *
 * The key identity: for x not a multiple of 2*pi,
 *   sum_{k=1}^{N} sin(kx) = sin(Nx/2) * sin((N+1)x/2) / sin(x/2),
 * so the partial sums of (sin(kx)) stay bounded by B := 1/|sin(x/2)|.
 * The model computes those raw partial sums A_N = sum_{k<=N} sin(kx) and
 * the weighted partial sums T_N = sum_{k<=N} sin(kx)/k, which converge to
 * (pi - x)/2 for x in (0, 2*pi) - the Fourier series of the sawtooth.
 * Pure computation: no DOM, d3, or three.
 */

export const MIN_TERMS = 1;
export const MAX_TERMS = 80;
export const DEFAULT_TERMS = 30;
export const MIN_X = 0.2;
export const MAX_X = 3.0;
const DEFAULT_X = 1.0;

/** Uniform bound for the raw partial sums: 1/|sin(x/2)|. */
export function dirichletBound(x: number): number {
  return 1 / Math.abs(Math.sin(x / 2));
}

/** Raw partial sums A_N = sum_{k=1}^{N} sin(kx), for N = 1..n. */
export function rawPartialSums(x: number, n: number): number[] {
  const sums: number[] = [];
  let acc = 0;
  for (let k = 1; k <= n; k++) {
    acc += Math.sin(k * x);
    sums.push(acc);
  }
  return sums;
}

/** Weighted partial sums T_N = sum_{k=1}^{N} sin(kx)/k, for N = 1..n. */
export function weightedPartialSums(x: number, n: number): number[] {
  const sums: number[] = [];
  let acc = 0;
  for (let k = 1; k <= n; k++) {
    acc += Math.sin(k * x) / k;
    sums.push(acc);
  }
  return sums;
}

export interface DirichletTestData {
  /** Number of partial sums shown. */
  n: number;
  /** The x parameter. */
  x: number;
  /** Uniform bound 1/|sin(x/2)| for the raw partial sums. */
  bound: number;
  /** A_1..A_N of sin(kx). */
  partialSums: number[];
  /** T_1..T_N of sin(kx)/k. */
  weighted: number[];
}

export const dirichletTestModel: SceneModel<DirichletTestData> = {
  compute(state) {
    const rawN = Number(state['terms']);
    const n = Number.isFinite(rawN)
      ? Math.min(MAX_TERMS, Math.max(MIN_TERMS, Math.floor(rawN)))
      : DEFAULT_TERMS;
    const rawX = Number(state['x']);
    const x = Number.isFinite(rawX) ? Math.min(MAX_X, Math.max(MIN_X, rawX)) : DEFAULT_X;
    return {
      n,
      x,
      bound: dirichletBound(x),
      partialSums: rawPartialSums(x, n),
      weighted: weightedPartialSums(x, n),
    };
  },
};
