import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Lemma 5.6.5: existence of n-th roots via the least upper
 * bound. For a > 0 and a natural n >= 1, the set E = { x >= 0 : x^n < a } is
 * nonempty (0 in E) and bounded above (a + 1 bounds it), so s = sup E exists;
 * trichotomy on s^n then forces s^n = a.
 *
 * The model approximates s by bisection on f(x) = x^n - a over [0, max(1,a)].
 *
 * Verified numbers (tests/nth-root.test.ts):
 *   bisectRoot(2, 2) = 1.414213562373095,
 *     |diff| vs Math.SQRT2 = 2.220446049250313e-16 (inside the 2/2^60
 *     bisection envelope);
 *   bisectRoot(8, 3) = 2 exactly;
 *   bisectRoot(0.5, 5) = Math.pow(0.5, 1/5) = 0.8705505632961241 exactly;
 *   bisectRoot(a, n)^n agrees with a to 1e-9 for the probed (a, n) grid;
 *   the root is strictly increasing in a (a = 0.5..8) for each n = 2..5;
 *   10 bisection steps on x^2 - 2 give x_10 = 1.416015625 with
 *     |x_10 - sqrt(2)| = 0.0018020626269048545 < 2/2^10 = 0.001953125.
 */

export const A_MIN = 0.5;
export const A_MAX = 8;
export const A_INIT = 2;
export const N_MIN = 2;
export const N_MAX = 5;
export const N_INIT = 2;
/** Bisection iterations; the interval halves each step. */
export const BISECT_STEPS = 60;
/** Curve sample count for y = x^n. */
export const CURVE_SAMPLES = 240;

/**
 * Bisection approximation of the n-th root of a: iterates on f(x) = x^n - a
 * over [0, max(1, a)] (a bracket, since 0^n - a < 0 and max(1,a)^n - a >= 0).
 */
export function bisectRoot(a: number, n: number): number {
  let lo = 0;
  let hi = Math.max(1, a);
  for (let k = 0; k < BISECT_STEPS; k++) {
    const mid = (lo + hi) / 2;
    if (Math.pow(mid, n) < a) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface NthRootSample {
  x: number;
  y: number;
}

export interface NthRootData {
  /** The radicand. */
  a: number;
  /** The root degree. */
  n: number;
  /** Bisection approximation of the n-th root of a. */
  root: number;
  /** Math.pow(a, 1/n), the floating-point reference. */
  mathRoot: number;
  /** Right end of the plotted x-range: max(2, root * 1.4). */
  xMax: number;
  /** y = x^n sampled on [0, xMax]. */
  curve: NthRootSample[];
  /** Curve samples with x < root: the set E = { x >= 0 : x^n < a }, shaded. */
  eCurve: NthRootSample[];
}

/** Pure: no DOM, no d3. */
export function nthRootData(a: number, n: number): NthRootData {
  const root = bisectRoot(a, n);
  const mathRoot = Math.pow(a, 1 / n);
  const xMax = Math.max(2, root * 1.4);
  const curve: NthRootSample[] = [];
  const eCurve: NthRootSample[] = [];
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const x = (xMax * i) / CURVE_SAMPLES;
    const y = Math.pow(x, n);
    curve.push({ x, y });
    if (x < root) eCurve.push({ x, y });
  }
  return { a, n, root, mathRoot, xMax, curve, eCurve };
}

export const nthRootModel: SceneModel<NthRootData> = {
  compute(state) {
    const rawA = Number(state['a']);
    const rawN = Number(state['n']);
    const a = Number.isFinite(rawA) ? Math.min(A_MAX, Math.max(A_MIN, rawA)) : A_INIT;
    const n = Number.isFinite(rawN)
      ? Math.round(Math.min(N_MAX, Math.max(N_MIN, rawN)))
      : N_INIT;
    return nthRootData(a, n);
  },
};
