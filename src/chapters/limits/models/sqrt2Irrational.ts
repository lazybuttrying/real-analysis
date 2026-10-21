import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Proposition 4.4.4: there is no rational number whose
 * square is 2. The model places every rational p/q with 1 <= q <= N and
 * 1 <= p/q <= 2 on the number line and measures how close the best one gets
 * to sqrt(2). The minimum distance is always positive — the hole never
 * closes — and it shrinks as N grows (the convergents 3/2, 7/5, 17/12, ...
 * approach sqrt(2) without ever landing on it).
 *
 * Verified numbers (tests/sqrt2-irrational.test.ts):
 *   min distance at N = 1: |1 - sqrt(2)| = 0.4142135623730951 (best 1/1);
 *   min distance at N = 2: |3/2 - sqrt(2)| = 0.08578643762690485;
 *   min distance at N = 5: |7/5 - sqrt(2)| = 0.014213562373095234;
 *   min distance at N = 12: |17/12 - sqrt(2)| = 0.0024531042935712446;
 *   the minimum is strictly decreasing in N at the convergent steps.
 */

export const SQRT2 = Math.SQRT2;
export const DENOM_MIN = 1;
export const DENOM_MAX = 12;
export const DENOM_INIT = 6;

interface Sqrt2RationalPoint {
  /** Numerator, in lowest terms (for display). */
  p: number;
  /** Denominator, in lowest terms, 1 <= q <= N (for display). */
  q: number;
  /** The numeric value p/q. */
  value: number;
}

export interface Sqrt2IrrationalData {
  /** Clamped denominator cap N from the 'denom' control. */
  denom: number;
  /** Distinct rationals p/q in [1, 2] with 1 <= q <= denom, sorted. */
  points: Sqrt2RationalPoint[];
  /** Closest rational to sqrt(2): numerator (lowest terms). */
  bestP: number;
  /** Closest rational to sqrt(2): denominator (lowest terms). */
  bestQ: number;
  /** Value of the closest rational, bestP / bestQ. */
  bestValue: number;
  /** |bestValue - sqrt(2)|: always > 0 (the gap never closes). */
  minDist: number;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

/**
 * All distinct rationals p/q in [1, 2] with 1 <= q <= n, plus the closest
 * one to sqrt(2). Pure: no DOM, no d3.
 */
export function sqrt2IrrationalData(n: number): Sqrt2IrrationalData {
  const seen = new Set<string>();
  const points: Sqrt2RationalPoint[] = [];
  let bestP = 1;
  let bestQ = 1;
  let bestValue = 1;
  let minDist = Infinity;
  for (let q = 1; q <= n; q++) {
    // p ranges over numerators with 1 <= p/q <= 2.
    for (let p = q; p <= 2 * q; p++) {
      const value = p / q;
      const dist = Math.abs(value - SQRT2);
      if (dist < minDist) {
        minDist = dist;
        bestP = p;
        bestQ = q;
        bestValue = value;
      }
      const g = gcd(p, q);
      const rp = p / g;
      const rq = q / g;
      const key = `${rp}/${rq}`;
      if (!seen.has(key)) {
        seen.add(key);
        points.push({ p: rp, q: rq, value });
      }
    }
  }
  points.sort((a, b) => a.value - b.value);
  // Store the best rational in lowest terms too.
  const g = gcd(bestP, bestQ);
  return {
    denom: n,
    points,
    bestP: bestP / g,
    bestQ: bestQ / g,
    bestValue,
    minDist,
  };
}

export const sqrt2IrrationalModel: SceneModel<Sqrt2IrrationalData> = {
  compute(state) {
    const raw = Number(state['denom']);
    const denom = Number.isFinite(raw)
      ? Math.round(Math.min(DENOM_MAX, Math.max(DENOM_MIN, raw)))
      : DENOM_INIT;
    return sqrt2IrrationalData(denom);
  },
};
