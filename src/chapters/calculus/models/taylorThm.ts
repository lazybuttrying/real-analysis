import type { SceneModel } from '../../../contracts';

/**
 * Taylor's theorem with the Lagrange remainder, demoed on sin (Maclaurin).
 *   T_n(x) = sum_{k=0}^{n} sin^{(k)}(0)/k! * x^k   (odd terms only)
 *   |R_n(x)| <= |x|^{n+1} / (n+1)!                (every derivative of sin is bounded by 1)
 * The envelope T_n(x) +/- bound is shaded on [-pi, pi]; the bound there is
 * largest at x = +/-pi. The true error always sits inside the envelope.
 * Pure computation: no DOM, d3, or three.
 */

function factorial(k: number): number {
  let r = 1;
  for (let i = 2; i <= k; i++) r *= i;
  return r;
}

/** sin^{(k)}(0): the values cycle 0, 1, 0, -1 with period 4. */
export function sinDerivativeAtZero(k: number): number {
  const r = ((k % 4) + 4) % 4;
  return r === 0 ? 0 : r === 1 ? 1 : r === 2 ? 0 : -1;
}

/** Maclaurin coefficients c_k = sin^{(k)}(0)/k! for k = 0..n. */
export function taylorThmCoefficients(n: number): number[] {
  const coeffs: number[] = [];
  for (let k = 0; k <= n; k++) coeffs.push(sinDerivativeAtZero(k) / factorial(k));
  return coeffs;
}

export function taylorThmPoly(coeffs: readonly number[], x: number): number {
  let sum = 0;
  let power = 1;
  for (const c of coeffs) {
    sum += c * power;
    power *= x;
  }
  return sum;
}

/** The Lagrange envelope |x|^{n+1}/(n+1)! for sin (all derivatives bounded by 1). */
export function taylorThmBound(n: number, x: number): number {
  return Math.pow(Math.abs(x), n + 1) / factorial(n + 1);
}

export interface TaylorThmSample {
  x: number;
  /** sin x. */
  y: number;
  /** T_n(x). */
  p: number;
  /** |x|^{n+1}/(n+1)!. */
  bound: number;
}

export interface TaylorThmData {
  n: number;
  coeffs: number[];
  /** The envelope at x = pi: its maximum on [-pi, pi]. */
  maxBound: number;
  /** Maximum actual |sin x - T_n(x)| on [-pi, pi], sampled on a grid. */
  maxActualErr: number;
  samples: TaylorThmSample[];
}

export function taylorThmData(n: number): TaylorThmData {
  const degree = Number.isFinite(n) ? Math.max(0, Math.min(9, Math.round(n))) : 5;
  const coeffs = taylorThmCoefficients(degree);
  const samples: TaylorThmSample[] = [];
  const m = 400;
  let maxActualErr = 0;
  for (let i = 0; i <= m; i++) {
    const x = -Math.PI + ((2 * Math.PI) * i) / m;
    const y = Math.sin(x);
    const p = taylorThmPoly(coeffs, x);
    const bound = taylorThmBound(degree, x);
    const err = Math.abs(y - p);
    if (err > maxActualErr) maxActualErr = err;
    samples.push({ x, y, p, bound });
  }
  return { n: degree, coeffs, maxBound: taylorThmBound(degree, Math.PI), maxActualErr, samples };
}

export const taylorThmModel: SceneModel<TaylorThmData> = {
  compute(state) {
    const raw = Number(state['degree']);
    return taylorThmData(raw);
  },
};
