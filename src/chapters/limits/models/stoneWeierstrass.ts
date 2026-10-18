import type { SceneModel } from '../../../contracts';

/**
 * Stone-Weierstrass in action: trigonometric polynomials are dense in
 * C(S^1), a density that algebraic polynomials alone do not give on the
 * circle. The target is the triangle wave f(x) = |x| on [-pi, pi], which
 * is continuous on the circle (identifying -pi with pi) but not itself a
 * trigonometric polynomial.
 *
 * Fourier cosine partial sums:
 *   S_n(x) = pi/2 - (4/pi) * sum_{odd k <= n} cos(kx) / k^2
 * The coefficients are verified identities (tests/stone-weierstrass.test.ts):
 *   a_k = (2/pi) * integral_0^pi x cos(kx) dx = (2/pi) * ((-1)^k - 1) / k^2
 * so even k vanish and odd k contribute -4/(pi k^2).
 *
 * Measured max error on the 400-point grid (see tests):
 *   n =  8: maxErr ~= 0.0792
 *   n = 25: maxErr ~= 0.0245
 *   n = 40: maxErr ~= 0.0159
 * maxErr shrinks monotonically with n: uniform convergence, exactly what
 * the Stone-Weierstrass theorem promises.
 */

export interface StoneWeierstrassSample {
  x: number;
  /** Target triangle wave f(x) = |x|. */
  y: number;
  /** Trigonometric polynomial partial sum S_n(x). */
  p: number;
}

export interface StoneWeierstrassData {
  /** Degree of the trigonometric polynomial (largest frequency kept). */
  degree: number;
  /** Grid points on [-pi, pi]. */
  samples: StoneWeierstrassSample[];
  /** max |f - S_n| over the grid: the uniform error, shrinking with n. */
  maxErr: number;
}

export const MIN_DEGREE = 1;
export const MAX_DEGREE = 40;
export const DEFAULT_DEGREE = 8;
export const GRID_POINTS = 400;

/** Target: triangle wave on [-pi, pi]; continuous on the circle since |-pi| = |pi|. */
export function targetFn(x: number): number {
  return Math.abs(x);
}

/**
 * Cosine partial sum of the Fourier series of |x|.
 * The k-th cosine coefficient is (2/pi)((-1)^k - 1)/k^2: it vanishes for
 * even k and equals -4/(pi k^2) for odd k, hence the odd-only sum.
 */
export function trigPartialSum(x: number, degree: number): number {
  let s = Math.PI / 2;
  for (let k = 1; k <= degree; k += 2) {
    s -= (4 / Math.PI) * (Math.cos(k * x) / (k * k));
  }
  return s;
}

/**
 * Closed-form cosine coefficient a_k of |x| on [-pi, pi].
 * a_k = (2/pi) * ((-1)^k - 1) / k^2 (a_0 = pi/2 handled separately).
 */
export function cosineCoefficient(k: number): number {
  return (2 / Math.PI) * ((k % 2 === 1 ? -1 : 1) - 1) / (k * k);
}

export function stoneWeierstrassData(degree: number): StoneWeierstrassData {
  const samples: StoneWeierstrassSample[] = [];
  let maxErr = 0;
  for (let i = 0; i < GRID_POINTS; i++) {
    const x = -Math.PI + (2 * Math.PI * i) / (GRID_POINTS - 1);
    const y = targetFn(x);
    const p = trigPartialSum(x, degree);
    samples.push({ x, y, p });
    const err = Math.abs(y - p);
    if (err > maxErr) maxErr = err;
  }
  return { degree, samples, maxErr };
}

export const stoneWeierstrassModel: SceneModel<StoneWeierstrassData> = {
  compute(state) {
    const raw = Number(state['degree']);
    const degree = Number.isFinite(raw)
      ? Math.min(MAX_DEGREE, Math.max(MIN_DEGREE, Math.floor(raw)))
      : DEFAULT_DEGREE;
    return stoneWeierstrassData(degree);
  },
};
