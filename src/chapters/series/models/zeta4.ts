import type { SceneModel } from '../../../contracts';
import { KahanSum } from '../../../math/sum';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * sum_{n>=1} 1/n^4 = pi^4/90. Even arguments of the zeta function are
 * all pi powers over striking denominators; odd arguments (like
 * zeta(3), Apery's constant) show no such pattern.
 */

export const MAX_N = 20;

export const LIMIT = Math.pow(Math.PI, 4) / 90;

const EVEN_DENOMINATORS: Record<number, number> = { 2: 6, 4: 90, 6: 945 };

export interface ZetaPatternEntry {
  p: number;
  /** Denominator in pi^p / denom for even p; absent for the odd entry */
  denom?: number;
  odd?: boolean;
  value: number;
}

export function zetaEven(p: number): ZetaPatternEntry {
  const denom = EVEN_DENOMINATORS[p] ?? 0;
  return { p, denom, value: Math.pow(Math.PI, p) / denom };
}

// zeta(3) has no closed pi form; estimate it by direct summation with
// an integral tail correction, computed live like everything else.
export function zeta3Approx(): number {
  const N = 4000;
  const accumulator = new KahanSum();
  for (let i = 1; i <= N; i++) accumulator.add(1 / (i * i * i));
  return accumulator.value + 1 / (2 * N * N);
}

export interface Zeta4Data {
  n: number;
  /** Term heights 1/i^4 for i = 1..n */
  heights: number[];
  /** Partial sums S_i for i = 1..n */
  sums: number[];
  sum: number;
  limit: number;
  error: number;
  /** The even-zeta pattern strip, plus the odd zeta(3) counterexample */
  pattern: ZetaPatternEntry[];
}

export function zeta4PartialSums(n: number): Zeta4Data {
  const heights: number[] = [];
  const sums: number[] = [];
  const accumulator = new KahanSum();
  for (let i = 1; i <= n; i++) {
    const h = 1 / Math.pow(i, 4);
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
    pattern: [zetaEven(2), zetaEven(4), zetaEven(6), { p: 3, odd: true, value: zeta3Approx() }],
  };
}

export const zeta4Model: SceneModel<Zeta4Data> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return zeta4PartialSums(n);
  },
};
