import type { SceneModel } from '../../../contracts';

/**
 * Integral test (Tao, Prop 11.6.4): for decreasing positive f,
 *   integral_1^{N+1} f <= sum_{k=1}^{N} f(k) <= f(1) + integral_1^{N+1} f,
 * so sum f(k) converges iff the improper integral converges.
 *
 * Model: f(x) = x^{-p}; leftSum = sum_{k=1}^{N} f(k) (left-endpoint,
 * circumscribed), rightSum = sum_{k=2}^{N+1} f(k) (right-endpoint,
 * inscribed), integral = closed-form integral_1^{N+1} x^{-p} dx
 * (p = 1 gives ln(N+1)).
 *
 * Verified numbers (tests/integral-test.test.ts):
 *   p = 2, N = 12: leftSum = 1.5649766384209025,
 *     rightSum = 0.5708937981842162,
 *     integral = integral_1^{13} x^{-2} dx = 12/13 = 0.9230769230769231,
 *     lowerOK = upperOK = true, verdict = 'converges';
 *   p = 1, N = 12: leftSum = H_12 = 3.103210678210678,
 *     rightSum = 2.1801337551337556, integral = ln 13 = 2.5649493574615367,
 *     lowerOK = upperOK = true, verdict = 'diverges'.
 */

export const MIN_P = 1;
export const MAX_P = 3;
export const DEFAULT_P = 2;
export const MIN_N = 5;
export const MAX_N = 40;
export const DEFAULT_N = 12;

/** f(x) = x^{-p}. */
export function fPow(x: number, p: number): number {
  return Math.pow(x, -p);
}

/** Closed form of integral_1^{N+1} x^{-p} dx; the p = 1 case is ln(N+1). */
export function integralPow(p: number, N: number): number {
  if (p === 1) return Math.log(N + 1);
  return (Math.pow(N + 1, 1 - p) - 1) / (1 - p);
}

/** Left-endpoint sum sum_{k=1}^{N} f(k): overestimates the integral. */
export function leftSumPow(p: number, N: number): number {
  let s = 0;
  for (let k = 1; k <= N; k++) s += fPow(k, p);
  return s;
}

/** Right-endpoint sum sum_{k=2}^{N+1} f(k): underestimates the integral. */
export function rightSumPow(p: number, N: number): number {
  let s = 0;
  for (let k = 2; k <= N + 1; k++) s += fPow(k, p);
  return s;
}

export type IntegralVerdict = 'converges' | 'diverges';

export interface IntegralTestData {
  p: number;
  N: number;
  leftSum: number;
  rightSum: number;
  integral: number;
  /** integral <= leftSum (the inscribed side of the sandwich). */
  lowerOK: boolean;
  /** leftSum <= f(1) + integral (the circumscribed side). */
  upperOK: boolean;
  verdict: IntegralVerdict;
}

/** Pure: no DOM, no d3. */
export function integralTestData(pRaw: number, nRaw: number): IntegralTestData {
  const p = Number.isFinite(pRaw) ? Math.min(MAX_P, Math.max(MIN_P, pRaw)) : DEFAULT_P;
  const N = Number.isFinite(nRaw)
    ? Math.min(MAX_N, Math.max(MIN_N, Math.round(nRaw)))
    : DEFAULT_N;
  const leftSum = leftSumPow(p, N);
  const rightSum = rightSumPow(p, N);
  const integral = integralPow(p, N);
  return {
    p,
    N,
    leftSum,
    rightSum,
    integral,
    lowerOK: integral <= leftSum,
    upperOK: leftSum <= fPow(1, p) + integral,
    verdict: p > 1 ? 'converges' : 'diverges',
  };
}

export const integralTestModel: SceneModel<IntegralTestData> = {
  compute(state) {
    return integralTestData(Number(state['p']), Number(state['N']));
  },
};
