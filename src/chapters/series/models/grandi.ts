import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * Grandi's series 1 - 1 + 1 - 1 + ...
 * HONEST FRAMING: this series DIVERGES. Its partial sums bounce
 * 1, 0, 1, 0, ... forever and never settle, so it has no sum.
 * The number 1/2 is only the Cesaro mean - the limit of the running
 * averages of the partial sums - a smoothing device, not the
 * value of the series.
 */

export const MAX_N = 40;

export interface GrandiData {
  n: number;
  /** Partial sums S_k for k = 1..n: always 1 or 0 */
  sums: number[];
  /** Cesaro means: running averages of the partial sums */
  cesaro: number[];
  /** S_n (1 for odd n, 0 for even n) - it never settles */
  sum: number;
  /** The Cesaro mean at n; tends to 1/2, which is NOT a sum */
  cesaroMean: number;
  cesaroLimit: number;
}

export function grandiSums(n: number): GrandiData {
  const sums: number[] = [];
  const cesaro: number[] = [];
  let s = 0;
  let runningTotal = 0;
  for (let k = 1; k <= n; k++) {
    s += k % 2 === 1 ? 1 : -1;
    sums.push(s);
    runningTotal += s;
    cesaro.push(runningTotal / k);
  }
  return {
    n,
    sums,
    cesaro,
    sum: s,
    cesaroMean: n > 0 ? runningTotal / n : 0,
    cesaroLimit: 0.5,
  };
}

export const grandiModel: SceneModel<GrandiData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return grandiSums(n);
  },
};
