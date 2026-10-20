import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * The direct proof that the sum of two rational numbers is rational.
 * With r1 = p1 / q1 and r2 = p2 / q2 (integer numerators and nonzero
 * integer denominators), the common-denominator form gives
 *   r1 + r2 = (p1 * q2 + p2 * q1) / (q1 * q2),
 * a ratio of integers with a nonzero denominator — a rational number,
 * reduced here to lowest terms.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const DIRECT_PROOF_P1_MIN = -9;
export const DIRECT_PROOF_P1_MAX = 9;
export const DIRECT_PROOF_P1_INIT = 3;

export const DIRECT_PROOF_Q1_MIN = 1;
export const DIRECT_PROOF_Q1_MAX = 9;
export const DIRECT_PROOF_Q1_INIT = 4;

export const DIRECT_PROOF_P2_MIN = -9;
export const DIRECT_PROOF_P2_MAX = 9;
export const DIRECT_PROOF_P2_INIT = -5;

export const DIRECT_PROOF_Q2_MIN = 1;
export const DIRECT_PROOF_Q2_MAX = 9;
export const DIRECT_PROOF_Q2_INIT = 6;

export interface RationalSumData {
  p1: number;
  q1: number;
  p2: number;
  q2: number;
  r1: number;
  r2: number;
  /** Numerator of the common-denominator form: p1 * q2 + p2 * q1. */
  num: number;
  /** Denominator of the common-denominator form: q1 * q2 (!= 0). */
  den: number;
  gcd: number;
  reducedNum: number;
  reducedDen: number;
  /** The sum value, r1 + r2. */
  sum: number;
}

/** Greatest common divisor of two nonnegative integers (Euclid). */
export function intGcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x;
}

/** The rational sum data for arbitrary integer inputs (no clamping). */
export function rationalSum(p1: number, q1: number, p2: number, q2: number): RationalSumData {
  const r1 = p1 / q1;
  const r2 = p2 / q2;
  const num = p1 * q2 + p2 * q1;
  const den = q1 * q2;
  const gcd = num === 0 ? Math.abs(den) : intGcd(Math.abs(num), Math.abs(den));
  const reducedNum = num / gcd;
  const reducedDen = den / gcd;
  return { p1, q1, p2, q2, r1, r2, num, den, gcd, reducedNum, reducedDen, sum: r1 + r2 };
}

export const directProofModel: SceneModel<RationalSumData> = {
  compute(state) {
    const p1 = Math.round(
      clampNumber(Number(state['p1']), DIRECT_PROOF_P1_MIN, DIRECT_PROOF_P1_MAX, DIRECT_PROOF_P1_INIT),
    );
    const q1 = Math.round(
      clampNumber(Number(state['q1']), DIRECT_PROOF_Q1_MIN, DIRECT_PROOF_Q1_MAX, DIRECT_PROOF_Q1_INIT),
    );
    const p2 = Math.round(
      clampNumber(Number(state['p2']), DIRECT_PROOF_P2_MIN, DIRECT_PROOF_P2_MAX, DIRECT_PROOF_P2_INIT),
    );
    const q2 = Math.round(
      clampNumber(Number(state['q2']), DIRECT_PROOF_Q2_MIN, DIRECT_PROOF_Q2_MAX, DIRECT_PROOF_Q2_INIT),
    );
    return rationalSum(p1, q1, p2, q2);
  },
};
