import type { SceneModel } from '../../../contracts';

/**
 * Minkowski's inequality (integral version) on [0,1]:
 *   ||f + g||_p <= ||f||_p + ||g||_p,  1 <= p < infinity,
 * with f(t) = t^a and g(t) = (1 - t)^b.
 *
 * All three norms are computed by numerical integration (Simpson's rule).
 * The integrands t^q with small q have an endpoint singularity at 0, so
 * each integral is first smoothed by a change of variables: t = u^8 for
 * the single-power integrals, and (after reflecting the [1/2, 1] half onto
 * [0, 1/2]) t = u^8 / 2 for the sum integral. The transformed integrands
 * are C^4 on [0,1], so plain Simpson converges at its full O(h^4) rate
 * (verified against closed forms: worst error ~2e-10 at 4096 subintervals).
 *
 * Pure computation: no DOM, d3, or three.
 */

export const MINKOWSKI_P_MIN = 1;
export const MINKOWSKI_P_MAX = 4;
export const MINKOWSKI_P_INIT = 2;

export const MINKOWSKI_A_MIN = 0;
export const MINKOWSKI_A_MAX = 3;
export const MINKOWSKI_A_INIT = 1;

export const MINKOWSKI_B_MIN = 0;
export const MINKOWSKI_B_MAX = 3;
export const MINKOWSKI_B_INIT = 1;

/** Subintervals for Simpson's rule (must be even). */
export const MINKOWSKI_GRID_N = 4096;

export interface MinkowskiData {
  p: number;
  a: number;
  b: number;
  /** ||f||_p with f(t) = t^a. */
  normF: number;
  /** ||g||_p with g(t) = (1 - t)^b. */
  normG: number;
  /** ||f + g||_p. */
  lhs: number;
  /** normF + normG. */
  rhs: number;
  /** rhs - lhs (>= 0 for p >= 1). */
  gap: number;
}

function clampFinite(value: number, lo: number, hi: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(lo, Math.min(hi, value));
}

function simpson(f: (x: number) => number, n: number): number {
  const h = 1 / n;
  let sum = f(0) + f(1);
  for (let i = 1; i < n; i++) {
    sum += f(i * h) * (i % 2 === 0 ? 2 : 4);
  }
  return (sum * h) / 3;
}

/**
 * Integral of t^q over [0,1], computed via the substitution t = u^8.
 * Exact value: 1 / (q + 1) for q > -1.
 */
export function integratePower(q: number): number {
  return simpson((u) => 8 * Math.pow(u, 8 * q + 7), MINKOWSKI_GRID_N);
}

/**
 * Integral of (t^a + (1 - t)^b)^p over [0,1]. The [1/2, 1] half is
 * reflected onto [0, 1/2] (s = 1 - t), then t = u^8 / 2 smooths the
 * endpoint singularities of t^a and t^b.
 */
export function integrateSumPower(p: number, a: number, b: number): number {
  return simpson((u) => {
    const t = Math.pow(u, 8) / 2;
    const s = 1 - t;
    const first = Math.pow(Math.pow(t, a) + Math.pow(s, b), p);
    const second = Math.pow(Math.pow(s, a) + Math.pow(t, b), p);
    return (first + second) * 4 * Math.pow(u, 7);
  }, MINKOWSKI_GRID_N);
}

/**
 * The Minkowski data for arbitrary p > 0 (no clamping): used by the
 * scene model (p in [1, 4]) and directly by tests, e.g. for the p < 1
 * counterexample where the inequality reverses.
 */
export function minkowskiValues(p: number, a: number, b: number): MinkowskiData {
  const normF = Math.pow(integratePower(a * p), 1 / p);
  const normG = Math.pow(integratePower(b * p), 1 / p);
  const lhs = Math.pow(integrateSumPower(p, a, b), 1 / p);
  const rhs = normF + normG;
  return { p, a, b, normF, normG, lhs, rhs, gap: rhs - lhs };
}

export const minkowskiModel: SceneModel<MinkowskiData> = {
  compute(state) {
    const p = clampFinite(Number(state['p']), MINKOWSKI_P_MIN, MINKOWSKI_P_MAX, MINKOWSKI_P_INIT);
    const a = clampFinite(Number(state['a']), MINKOWSKI_A_MIN, MINKOWSKI_A_MAX, MINKOWSKI_A_INIT);
    const b = clampFinite(Number(state['b']), MINKOWSKI_B_MIN, MINKOWSKI_B_MAX, MINKOWSKI_B_INIT);
    return minkowskiValues(p, a, b);
  },
};
