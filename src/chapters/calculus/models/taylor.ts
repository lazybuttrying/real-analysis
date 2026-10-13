import type { SceneModel } from '../../../contracts';

/**
 * Taylor (Maclaurin) polynomials: T_n(x) = sum_{k=0}^{n} f^{(k)}(0)/k! * x^k.
 * For sin the derivatives at 0 cycle 0, 1, 0, -1 (even-order terms vanish);
 * for exp every derivative at 0 is 1.
 * Pure computation: no DOM, d3, or three.
 */

export type TaylorFunctionKey = 'sin' | 'exp';

export function taylorFunctionKey(option: unknown): TaylorFunctionKey {
  return option === 'exp' ? 'exp' : 'sin';
}

function factorial(k: number): number {
  let r = 1;
  for (let i = 2; i <= k; i++) r *= i;
  return r;
}

/** The k-th derivative of the function at 0. */
export function taylorDerivativeAtZero(key: TaylorFunctionKey, k: number): number {
  if (key === 'exp') return 1;
  const r = k % 4;
  return r === 0 ? 0 : r === 1 ? 1 : r === 2 ? 0 : -1;
}

/** Coefficients c_k = f^{(k)}(0)/k! for k = 0..n. */
export function taylorCoefficients(key: TaylorFunctionKey, n: number): number[] {
  const coeffs: number[] = [];
  for (let k = 0; k <= n; k++) coeffs.push(taylorDerivativeAtZero(key, k) / factorial(k));
  return coeffs;
}

export function taylorPoly(coeffs: readonly number[], x: number): number {
  let sum = 0;
  let power = 1;
  for (const c of coeffs) {
    sum += c * power;
    power *= x;
  }
  return sum;
}

export interface TaylorSample {
  x: number;
  y: number;
  p: number;
}

export interface TaylorData {
  key: TaylorFunctionKey;
  n: number;
  coeffs: number[];
  /** Maximum |f - T_n| on [-pi, pi] (sampled). */
  maxErr: number;
  samples: TaylorSample[];
}

export function taylorData(key: TaylorFunctionKey, n: number): TaylorData {
  const coeffs = taylorCoefficients(key, n);
  const f = key === 'exp' ? Math.exp : Math.sin;
  const samples: TaylorSample[] = [];
  const m = 400;
  let maxErr = 0;
  for (let i = 0; i <= m; i++) {
    const x = -Math.PI + ((2 * Math.PI) * i) / m;
    const y = f(x);
    const p = taylorPoly(coeffs, x);
    const err = Math.abs(y - p);
    if (err > maxErr) maxErr = err;
    samples.push({ x, y, p });
  }
  return { key, n, coeffs, maxErr, samples };
}

export const taylorModel: SceneModel<TaylorData> = {
  compute(state) {
    const key = taylorFunctionKey(state['fn']);
    const raw = Number(state['degree']);
    const n = Number.isFinite(raw) ? Math.max(1, Math.min(9, Math.round(raw))) : 3;
    return taylorData(key, n);
  },
};
