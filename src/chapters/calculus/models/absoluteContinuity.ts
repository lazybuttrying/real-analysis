import type { SceneModel } from '../../../contracts';

/**
 * Absolute continuity: the two canonical examples.
 *
 * F is absolutely continuous on [a, b] when, for every epsilon > 0, there is a
 * delta > 0 such that any finite family of disjoint subintervals with total
 * length < delta has sum of |Delta F| < epsilon. Absolutely continuous
 * functions are exactly the indefinite Lebesgue integrals of L^1 functions.
 *
 * 'square' (F(x) = x^2, absolutely continuous): pack the cover near x = 1,
 * where F' is largest. The n intervals sit inside [1 - delta, 1], so
 *   sum |Delta F| = F(1) - F(1 - delta) = 1 - (1 - delta)^2 = 2 delta - delta^2 -> 0.
 * 'cantor' (the Cantor function c, uniformly continuous but NOT absolutely
 * continuous): at stage n the 2^n stage-n Cantor intervals have total length
 * (2/3)^n -> 0, but c rises by exactly 2^{-n} on each, so
 *   sum |Delta c| = 2^n * 2^{-n} = 1 ALWAYS.
 *
 * Verified identities (tests/absolute-continuity.test.ts):
 *   'square': totalLen = delta = scale / 20; varSum = 2 delta - delta^2
 *             = 1 - (1 - delta)^2, for every scale in 1..10
 *   'cantor': totalLen = (2/3)^stage, varSum = 1, for every stage in 1..10
 *
 * Pure computation: no DOM, d3, or three.
 */

/** The two example functions, matching the 'func' select control. */
export type AcFunc = 'square' | 'cantor';
export const DEFAULT_FUNC: AcFunc = 'square';

/** Slider range for 'scale': delta knob for 'square', stage n for 'cantor'. */
export const MIN_SCALE = 1;
export const MAX_SCALE = 10;
export const DEFAULT_SCALE = 4;

export interface AbsoluteContinuityData {
  /** Example function selected by the 'func' control. */
  func: AcFunc;
  /** Slider value, clamped to [MIN_SCALE, MAX_SCALE]. */
  scale: number;
  /**
   * The knob the slider moves: delta = scale / 20 (0.05..0.5) for 'square',
   * stage = scale for 'cantor'.
   */
  detail: number;
  /** Total length of the covering intervals: delta for 'square', (2/3)^stage for 'cantor'. */
  totalLen: number;
  /** Sum of |Delta F| over the cover: 2 delta - delta^2 for 'square', 1 for 'cantor'. */
  varSum: number;
}

/** delta for 'square' (scale / 20), stage for 'cantor' (scale). */
export function acDetail(func: AcFunc, scale: number): number {
  return func === 'cantor' ? scale : scale / 20;
}

export function absoluteContinuityData(func: AcFunc, scale: number): AbsoluteContinuityData {
  const detail = acDetail(func, scale);
  const totalLen = func === 'cantor' ? Math.pow(2 / 3, scale) : detail;
  const varSum = func === 'cantor' ? 1 : 2 * detail - detail * detail;
  return { func, scale, detail, totalLen, varSum };
}

export const absoluteContinuityModel: SceneModel<AbsoluteContinuityData> = {
  compute(state) {
    const rawFunc = String(state['func'] ?? '');
    const func: AcFunc = rawFunc === 'cantor' ? 'cantor' : DEFAULT_FUNC;
    const scaleRaw = Number(state['scale']);
    const scale = Number.isFinite(scaleRaw)
      ? Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.floor(scaleRaw)))
      : DEFAULT_SCALE;
    return absoluteContinuityData(func, scale);
  },
};
