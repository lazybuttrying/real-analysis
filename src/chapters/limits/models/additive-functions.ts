import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Additive functions and the Hamel basis, live. An additive f obeys
 * f(x + y) = f(x) + f(y), which forces f(q) = q f(1) on the rationals.
 * Over Q, the reals 1 and sqrt(2) are independent, so f(sqrt(2)) is a
 * free choice t. On the span of {1, sqrt(2)} the function is then
 * f(a + b sqrt(2)) = a + b t for rational a, b. When t = sqrt(2) every
 * point lies on the line y = x; any other t scatters the points, and
 * the full graph of a nonlinear additive function is dense in the
 * plane. Pure computation: no DOM, d3, or three.
 */

export const SQRT2 = Math.SQRT2;

export interface AdditivePoint {
  x: number;
  y: number;
  /** True when b = 0, i.e. the point is (q, q) for a rational q. */
  rational: boolean;
}

export interface AdditiveData {
  t: number;
  points: readonly AdditivePoint[];
  /** t - sqrt(2): zero exactly when the restricted graph is the line. */
  deviation: number;
  /** |deviation| below the slider's visible tolerance. */
  onLine: boolean;
}

function clampT(v: number): number {
  if (!Number.isFinite(v)) return SQRT2;
  return Math.max(-2.5, Math.min(2.5, v));
}

export function additivePoints(t: number): AdditivePoint[] {
  const points: AdditivePoint[] = [];
  for (let ai = -8; ai <= 8; ai++) {
    const a = ai / 4;
    for (let bi = -4; bi <= 4; bi++) {
      const b = bi / 4;
      points.push({ x: a + b * SQRT2, y: a + b * t, rational: bi === 0 });
    }
  }
  return points;
}

export function additiveData(tRaw: number): AdditiveData {
  const t = clampT(tRaw);
  const deviation = t - SQRT2;
  return {
    t,
    points: additivePoints(t),
    deviation,
    onLine: Math.abs(deviation) < 0.01,
  };
}

export const additiveModel: SceneModel<AdditiveData> = {
  compute(state: ControlState): AdditiveData {
    return additiveData(Number(state['t']));
  },
};
