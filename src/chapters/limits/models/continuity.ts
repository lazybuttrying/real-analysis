import type { ControlState, SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Continuity of x^2 at a movable point a, with a toggleable removable
 * discontinuity: g(x) = x^2 for x != a, g(a) = a^2 + 1.
 * The limit of the curve at a is a^2 in both modes; the verdict compares it
 * with the actual function value at a.
 * Pure computation: no DOM, d3, or three.
 */

export interface ContinuitySample {
  x: number;
  y: number;
}

export interface ContinuityData {
  a: number;
  broken: boolean;
  /** Limit of the curve x^2 at a (the curve is x^2 except possibly at a). */
  limitV: number;
  /** Actual function value at a: a^2, or a^2 + 1 in broken mode. */
  funcV: number;
  /** Half-width of the band around the limit that the scene draws. */
  eps: number;
  curve: ContinuitySample[];
  /** True exactly when limit and value agree. */
  continuous: boolean;
}

export function continuityLimit(a: number): number {
  return a * a;
}

export function continuityValue(a: number, broken: boolean): number {
  return broken ? a * a + 1 : a * a;
}

export function continuityData(a: number, broken: boolean): ContinuityData {
  const limitV = continuityLimit(a);
  const funcV = continuityValue(a, broken);
  const eps = 0.5;
  const curve: ContinuitySample[] = [];
  const lo = -2.4;
  const hi = 2.4;
  const count = 241;
  for (let i = 0; i < count; i++) {
    const x = lo + (((hi - lo) * i) / (count - 1));
    curve.push({ x, y: x * x });
  }
  return { a, broken, limitV, funcV, eps, curve, continuous: limitV === funcV };
}

function clampA(raw: number): number {
  return clampNumber(raw, -2, 2, 1);
}

export const continuityModel: SceneModel<ContinuityData> = {
  compute(state: ControlState) {
    return continuityData(clampA(Number(state['a'] ?? 1)), Boolean(state['broken'] ?? false));
  },
};
