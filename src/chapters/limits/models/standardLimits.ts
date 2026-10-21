import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Tao, Analysis I, Props 6.5.2/6.5.3: behavior of x^n and x^{1/n}.
 *
 * For 'power', a_k = x^k (k = 1..n). The regime is decided by |x|:
 *   |x| < 1  -> x^n -> 0            (Bernoulli on 1/|x| = 1 + h),
 *   x = 1    -> x^n = 1 -> 1,
 *   x = -1   -> oscillates between -1 and 1 (no limit),
 *   |x| > 1  -> unbounded.
 * For 'root', b_k = x^{1/k} (k = 1..n) with x clamped to (0.05, 2]
 * (x > 0 is required for real n-th roots); b_k -> 1 from above if x > 1,
 * from below if x < 1.
 *
 * Verified numbers (tests/standard-limits.test.ts):
 *   0.5^60 = 8.673617379884035e-19 < 1e-18;
 *   2^(1/60) = 1.0116193982758447, within 0.02 of 1;
 *   sqrt bound for the eps-delta of root mode is not needed here.
 *
 * Pure: no DOM, no d3.
 */

const KIND_OPTIONS = ['power', 'root'] as const;
type LimitKind = (typeof KIND_OPTIONS)[number];

export const X_MIN = -2;
export const X_MAX = 2;
export const X_INIT = 0.5;
export const N_MIN = 1;
export const N_MAX = 60;
export const N_INIT = 20;
/** Root mode needs x > 0; the slider is clamped to this interval. */
export const ROOT_X_MIN = 0.05;
export const ROOT_X_MAX = 2;
/** Values with |v| > PLOT_CLIP are clipped in the scene (unbounded regime). */
export const PLOT_CLIP = 10;

export function limitKindOf(raw: unknown): LimitKind {
  return raw === 'root' ? 'root' : 'power';
}

/** The asymptotic regime of the plotted sequence. */
type Regime = 'converges-zero' | 'converges-one' | 'oscillates' | 'unbounded';

interface StandardLimitPoint {
  k: number;
  value: number;
}

export interface StandardLimitsData {
  kind: LimitKind;
  x: number;
  n: number;
  points: StandardLimitPoint[];
  regime: Regime;
  /** Theoretical limit; NaN when the regime has none (oscillates / unbounded). */
  limit: number;
}

export function standardLimitsData(kind: LimitKind, x: number, n: number): StandardLimitsData {
  const points: StandardLimitPoint[] = [];
  let regime: Regime;
  let limit = NaN;
  if (kind === 'power') {
    for (let k = 1; k <= n; k++) points.push({ k, value: Math.pow(x, k) });
    if (Math.abs(x) < 1) {
      regime = 'converges-zero';
      limit = 0;
    } else if (x === 1) {
      regime = 'converges-one';
      limit = 1;
    } else if (x === -1) {
      regime = 'oscillates';
    } else {
      regime = 'unbounded';
    }
  } else {
    for (let k = 1; k <= n; k++) points.push({ k, value: Math.pow(x, 1 / k) });
    regime = 'converges-one';
    limit = 1;
  }
  return { kind, x, n, points, regime, limit };
}

export const standardLimitsModel: SceneModel<StandardLimitsData> = {
  compute(state) {
    const kind = limitKindOf(state['kind']);
    let x = clampNumber(state['x'], X_MIN, X_MAX, X_INIT);
    if (kind === 'root') x = clampNumber(x, ROOT_X_MIN, ROOT_X_MAX, X_INIT);
    const n = clampNumber(state['n'], N_MIN, N_MAX, N_INIT, true);
    return standardLimitsData(kind, x, n);
  },
};
