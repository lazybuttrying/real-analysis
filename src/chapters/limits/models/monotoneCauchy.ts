import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The monotone sequence a_n = 1 - 2^(-n) rising to its supremum 1, together
 * with the Cauchy tail-diameter readout:
 * max_{m,k >= tailN, m,k <= 12} |a_m - a_k|.
 * Pure computation: no DOM, d3, or three.
 */

export const CAUCHY_MAX_INDEX = 12;

/** The scene's sequence (and, equivalently, the partial sums of 2^{-k}). */
export function cauchyTerm(k: number): number {
  return 1 - 2 ** -k;
}

/** Partial sum s_N = sum_{k=1..N} 2^{-k}. Equals 1 - 2^{-N}. */
export function geometricPartialSum(n: number): number {
  return 1 - 2 ** -n;
}

/** |s_m - s_n| = 2^{-n} - 2^{-m} for m > n, from the telescoping sum. */
export function partialSumDiff(m: number, n: number): number {
  return 2 ** -n - 2 ** -m;
}

export interface MonotoneCauchyTerm {
  k: number;
  value: number;
}

export interface MonotoneCauchyData {
  /** Terms shown (1..12). */
  n: number;
  /** Start of the Cauchy tail. */
  tailN: number;
  /** Largest index used for the tail diameter (always 12). */
  maxIndex: number;
  terms: MonotoneCauchyTerm[];
  /** Value a_n at the largest shown index. */
  aN: number;
  /** max_{m,k >= tailN, m,k <= 12} |a_m - a_k|; tends to 0 as tailN grows. */
  tailDiameter: number;
  /** The supremum (and limit) of the sequence. */
  sup: number;
}

export function monotoneCauchyData(nShown: number, tailStart: number): MonotoneCauchyData {
  const n = Number.isFinite(nShown) ? Math.min(12, Math.max(1, Math.round(nShown))) : 8;
  const tailN = Number.isFinite(tailStart) ? Math.min(10, Math.max(1, Math.round(tailStart))) : 4;
  const terms: MonotoneCauchyTerm[] = [];
  for (let k = 1; k <= n; k++) terms.push({ k, value: cauchyTerm(k) });
  let tailDiameter = 0;
  for (let m = tailN; m <= CAUCHY_MAX_INDEX; m++) {
    for (let k = tailN; k <= CAUCHY_MAX_INDEX; k++) {
      const d = Math.abs(cauchyTerm(m) - cauchyTerm(k));
      if (d > tailDiameter) tailDiameter = d;
    }
  }
  return { n, tailN, maxIndex: CAUCHY_MAX_INDEX, terms, aN: cauchyTerm(n), tailDiameter, sup: 1 };
}

export const monotoneCauchyModel: SceneModel<MonotoneCauchyData> = {
  compute(state: ControlState) {
    return monotoneCauchyData(Number(state['n'] ?? 8), Number(state['tailN'] ?? 4));
  },
};
