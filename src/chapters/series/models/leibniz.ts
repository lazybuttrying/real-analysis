import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * pi/4 = 1 - 1/3 + 1/5 - 1/7 + ...
 * Alternating series: the true value always lies between two consecutive
 * partial sums, and the error is at most the size of the next term.
 */

export const MAX_N = 60;

export const LIMIT = Math.PI / 4;

export interface LeibnizData {
  n: number;
  /** Partial sums S_k for k = 1..n */
  sums: number[];
  /** S_n */
  sum: number;
  /** S_{n+1}: the other side of the bracket around pi/4 */
  next: number;
  limit: number;
  error: number;
  /** Alternating-series error bound: the next term, 1/(2n+1) */
  bound: number;
}

export function leibnizPartialSums(n: number): LeibnizData {
  const sums: number[] = [];
  let s = 0;
  for (let k = 0; k < n; k++) {
    s += (k % 2 === 0 ? 1 : -1) / (2 * k + 1);
    sums.push(s);
  }
  // One more term gives the other side of the bracket.
  const next = s + (n % 2 === 0 ? 1 : -1) / (2 * n + 1);
  return {
    n,
    sums,
    sum: s,
    next,
    limit: LIMIT,
    error: Math.abs(s - LIMIT),
    bound: 1 / (2 * n + 1),
  };
}

export const leibnizModel: SceneModel<LeibnizData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return leibnizPartialSums(n);
  },
};
