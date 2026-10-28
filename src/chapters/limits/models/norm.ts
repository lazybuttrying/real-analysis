import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The norm on R^2, live: for a vector x = (x1, x2) and p in {1, 2, inf},
 *   ||x||_1 = |x1| + |x2|,
 *   ||x||_2 = (|x1|^2 + |x2|^2)^(1/2),
 *   ||x||_inf = max(|x1|, |x2|).
 * A norm is a length rule with three axioms: ||x|| >= 0 with equality
 * only at x = 0; ||a x|| = |a| ||x||; and the triangle inequality
 * ||x + y|| <= ||x|| + ||y||. Every norm induces a metric
 * d(x, y) = ||x - y||, which is how the norm scene connects back to the
 * metric-spaces scene. The unit-sphere samples use the same
 * parametrization as the parallelogram-law scene: their l^p norm is 1
 * because |cos t|^2 + |sin t|^2 = 1.
 * Pure computation: no DOM, d3, or three.
 */

/** A 2D vector. */
export interface Vec2 {
  x: number;
  y: number;
}

/** The l^p exponent choices offered by the scene controls. */
export type NormP = '1' | '2' | 'inf';

export const NORM_P_OPTIONS: readonly NormP[] = ['1', '2', 'inf'];
export const NORM_P_INIT: NormP = '2';

/** Number of sample points drawn on the l^p unit sphere. */
export const NORM_SAMPLE_COUNT = 128;

/** sign(t) * |t|^a, the signed power used by the unit-sphere parametrization. */
export function signedPow(t: number, a: number): number {
  if (t === 0) return 0;
  return Math.sign(t) * Math.pow(Math.abs(t), a);
}

/** The l^p norm on R^2. */
export function lpNorm(v: Vec2, p: NormP): number {
  if (p === '1') return Math.abs(v.x) + Math.abs(v.y);
  if (p === 'inf') return Math.max(Math.abs(v.x), Math.abs(v.y));
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * The point on the l^p unit sphere at angle theta:
 * (sign(cos) |cos|^(2/p), sign(sin) |sin|^(2/p)) for finite p, and for
 * p = inf the square's boundary point (sign(cos), sign(sin)) scaled so
 * the larger coordinate has absolute value 1.
 */
export function unitSpherePoint(theta: number, p: NormP): Vec2 {
  if (p === 'inf') {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const m = Math.max(Math.abs(c), Math.abs(s));
    return { x: c / m, y: s / m };
  }
  const q = p === '1' ? 1 : 2;
  return {
    x: signedPow(Math.cos(theta), 2 / q),
    y: signedPow(Math.sin(theta), 2 / q),
  };
}

/** Sample points on the l^p unit sphere, theta in [0, 2pi). */
export function unitSphereSamples(p: NormP, count: number = NORM_SAMPLE_COUNT): Vec2[] {
  const points: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    points.push(unitSpherePoint((i * 2 * Math.PI) / count, p));
  }
  return points;
}

export interface NormData {
  /** The l^p exponent, from the select control. */
  p: NormP;
  /** First vector, from the x sliders. */
  x: Vec2;
  /** Second vector, from the y sliders. */
  y: Vec2;
  /** x + y. */
  sum: Vec2;
  /** ||x||_p. */
  normX: number;
  /** ||y||_p. */
  normY: number;
  /** ||x + y||_p. */
  normSum: number;
  /** ||x||_p + ||y||_p, the triangle-inequality ceiling. */
  ceiling: number;
  /** ceiling - normSum, always >= 0 (up to rounding). */
  gap: number;
  /** ||x||_1, for the readout's comparison row. */
  normX1: number;
  /** ||x||_2, for the readout's comparison row. */
  normX2: number;
  /** ||x||_inf, for the readout's comparison row. */
  normXInf: number;
  /** Sample points on the l^p unit sphere. */
  samples: readonly Vec2[];
}

function clampCoord(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(-2, Math.min(2, v));
}

function parseP(raw: unknown): NormP {
  if (raw === '1' || raw === '2' || raw === 'inf') return raw;
  return NORM_P_INIT;
}

export function normData(x1: number, x2: number, y1: number, y2: number, p: NormP): NormData {
  const x: Vec2 = { x: clampCoord(x1), y: clampCoord(x2) };
  const y: Vec2 = { x: clampCoord(y1), y: clampCoord(y2) };
  const sum: Vec2 = { x: x.x + y.x, y: x.y + y.y };
  const normX = lpNorm(x, p);
  const normY = lpNorm(y, p);
  const normSum = lpNorm(sum, p);
  return {
    p,
    x,
    y,
    sum,
    normX,
    normY,
    normSum,
    ceiling: normX + normY,
    gap: normX + normY - normSum,
    normX1: lpNorm(x, '1'),
    normX2: lpNorm(x, '2'),
    normXInf: lpNorm(x, 'inf'),
    samples: unitSphereSamples(p),
  };
}

export const normModel: SceneModel<NormData> = {
  compute(state: ControlState): NormData {
    return normData(
      Number(state['x1']),
      Number(state['x2']),
      Number(state['y1']),
      Number(state['y2']),
      parseP(state['p']),
    );
  },
};
