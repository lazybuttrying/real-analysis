import type { SceneModel } from '../../../contracts';
import { KahanSum } from '../../../math/sum';

/** Pure computation. Does not import the DOM, d3, or three. */

export const MAX_N = 40;

/** The limit pi^2/6. Why pi appears at all is an idea-level story (Euler's sine product), not something the numbers below prove. */
export const LIMIT = (Math.PI * Math.PI) / 6;

export interface BaselData {
  n: number;
  /** Term heights 1/i^2 for i = 1..n */
  heights: number[];
  /** Partial sums S_i for i = 1..n */
  sums: number[];
  /** S_n */
  sum: number;
  limit: number;
  error: number;
  /** The last term added, 1/n^2 */
  lastTerm: number;
}

export function baselPartialSums(n: number): BaselData {
  const heights: number[] = [];
  const sums: number[] = [];
  const accumulator = new KahanSum();
  for (let i = 1; i <= n; i++) {
    const h = 1 / (i * i);
    heights.push(h);
    accumulator.add(h);
    sums.push(accumulator.value);
  }
  const sum = accumulator.value;
  return {
    n,
    heights,
    sums,
    sum,
    limit: LIMIT,
    error: Math.abs(LIMIT - sum),
    lastTerm: n >= 1 ? 1 / (n * n) : 0,
  };
}

export const baselModel: SceneModel<BaselData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return baselPartialSums(n);
  },
};
