import type { SceneModel } from '../../../contracts';

/**
 * The Weierstrass M-test, visualized with S(x) = sum_{k>=1} sin(kx)/k^2.
 *
 * Each term satisfies |sin(kx)/k^2| <= 1/k^2 =: M_k, and the majorant series
 * sum M_k = pi^2/6 converges, so the M-test makes the series converge
 * uniformly on the whole real line. The partial sum S_N stays inside the
 * band L(x) +/- tailBound(N), where the bound does not depend on x --
 * that single bound working for every x is what uniform convergence means.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Grid points across [0, 2pi]. */
export const GRID_POINTS = 241;
/** Terms used to approximate the limit curve and the infinite tail. */
export const LIMIT_TERMS = 2000;
export const MIN_TERMS = 1;
export const MAX_TERMS = 40;
export const DEFAULT_TERMS = 8;

/**
 * tailBound(n) = sum_{k=n+1}^{2000} 1/k^2, a proxy for the infinite tail
 * sum_{k>n} 1/k^2. It bounds |S(x) - S_n(x)| uniformly in x:
 * every term of the remainder is dominated by 1/k^2, so the bound holds
 * simultaneously for all x on the grid.
 */
export function tailBound(n: number): number {
  const k0 = Math.max(0, Math.floor(n));
  let sum = 0;
  for (let k = k0 + 1; k <= LIMIT_TERMS; k++) {
    sum += 1 / (k * k);
  }
  return sum;
}

function termValue(k: number, x: number): number {
  return Math.sin(k * x) / (k * k);
}

function gridXs(): number[] {
  const xs: number[] = [];
  for (let i = 0; i < GRID_POINTS; i++) {
    xs.push((2 * Math.PI * i) / (GRID_POINTS - 1));
  }
  return xs;
}

export interface MTestData {
  /** Number of terms in the partial sum (clamped to [1, 40]). */
  n: number;
  /** Grid points x in [0, 2pi]. */
  xs: number[];
  /** S_n(x_i) = sum_{k=1}^{n} sin(k x_i)/k^2. */
  partial: number[];
  /** Limit curve L(x_i) = sum_{k=1}^{2000} sin(k x_i)/k^2. */
  limit: number[];
  /** Uniform tail bound sum_{k=n+1}^{2000} 1/k^2. */
  tailBound: number;
}

export const mTestModel: SceneModel<MTestData> = {
  compute(state) {
    const raw = Number(state['terms']);
    const n = Number.isFinite(raw)
      ? Math.min(MAX_TERMS, Math.max(MIN_TERMS, Math.floor(raw)))
      : DEFAULT_TERMS;
    const xs = gridXs();
    const partial: number[] = new Array<number>(GRID_POINTS);
    const limit: number[] = new Array<number>(GRID_POINTS);
    for (let i = 0; i < GRID_POINTS; i++) {
      const x = xs[i] ?? 0;
      let s = 0;
      let full = 0;
      for (let k = 1; k <= LIMIT_TERMS; k++) {
        const t = termValue(k, x);
        if (k <= n) s += t;
        full += t;
      }
      partial[i] = s;
      limit[i] = full;
    }
    return { n, xs, partial, limit, tailBound: tailBound(n) };
  },
};
