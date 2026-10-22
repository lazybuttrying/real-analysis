import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The parallelogram law and the l^p norms on R^2, live: for
 * e1 = (1, 0) and e2 = (0, 1),
 *   ||e1 + e2||_p^2 + ||e1 - e2||_p^2 = 2 * 2^(2/p),
 *   2||e1||_p^2 + 2||e2||_p^2 = 4.
 * The two sides agree only at p = 2. By the Jordan-von Neumann theorem a
 * norm comes from an inner product if and only if it satisfies the
 * parallelogram law, so l^p for p != 2 is not an inner-product norm.
 * The unit-sphere samples use (sign(cos t) |cos t|^(2/p),
 * sign(sin t) |sin t|^(2/p)): their l^p norm is 1 because
 * |cos t|^2 + |sin t|^2 = 1.
 * Pure computation: no DOM, d3, or three.
 */

/** A 2D vector. */
export interface Vec2 {
  x: number;
  y: number;
}

export const PARALLELOGRAM_P_MIN = 1.1;
export const PARALLELOGRAM_P_MAX = 8;
export const PARALLELOGRAM_P_INIT = 2;

export const PARALLELOGRAM_SHOW_CIRCLE_INIT = true;

/** Number of sample points drawn on the l^p unit sphere. */
export const PARALLELOGRAM_SAMPLE_COUNT = 128;

/** Tolerance for the holds flag: |gap| < 1e-9. */
export const PARALLELOGRAM_TOL = 1e-9;

/** Drawing domain for the scene. */
export const PARALLELOGRAM_X_MIN = -0.3;
export const PARALLELOGRAM_X_MAX = 2.3;
export const PARALLELOGRAM_Y_MIN = -1.3;
export const PARALLELOGRAM_Y_MAX = 1.3;

/** The standard basis vectors. */
export const E1: Vec2 = { x: 1, y: 0 };
export const E2: Vec2 = { x: 0, y: 1 };

/** The l^p norm on R^2: (|x|^p + |y|^p)^(1/p). */
export function lpNorm(v: Vec2, p: number): number {
  return Math.pow(Math.pow(Math.abs(v.x), p) + Math.pow(Math.abs(v.y), p), 1 / p);
}

/** sign(t) * |t|^a, the signed power used by the unit-sphere parametrization. */
export function signedPow(t: number, a: number): number {
  if (t === 0) return 0;
  return Math.sign(t) * Math.pow(Math.abs(t), a);
}

/**
 * The point on the l^p unit sphere at angle theta:
 * (sign(cos) |cos|^(2/p), sign(sin) |sin|^(2/p)).
 * Its l^p norm is 1, since |x|^p + |y|^p = |cos|^2 + |sin|^2 = 1.
 */
export function unitSpherePoint(theta: number, p: number): Vec2 {
  return {
    x: signedPow(Math.cos(theta), 2 / p),
    y: signedPow(Math.sin(theta), 2 / p),
  };
}

/** Sample points on the l^p unit sphere, theta in [0, 2pi). */
export function unitSphereSamples(p: number, count: number = PARALLELOGRAM_SAMPLE_COUNT): Vec2[] {
  const points: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    points.push(unitSpherePoint((i * 2 * Math.PI) / count, p));
  }
  return points;
}

export interface ParallelogramLawData {
  /** The l^p exponent, clamped to [1.1, 8]. */
  p: number;
  /** Whether to draw the l^p unit sphere (the showCircle toggle). */
  showCircle: boolean;
  /** e1 = (1, 0). */
  e1: Vec2;
  /** e2 = (0, 1). */
  e2: Vec2;
  /** e1 + e2 = (1, 1). */
  sum: Vec2;
  /** e1 - e2 = (1, -1). */
  diff: Vec2;
  /** ||e1||_p = 1. */
  normE1: number;
  /** ||e2||_p = 1. */
  normE2: number;
  /** ||e1 + e2||_p = 2^(1/p). */
  normPlus: number;
  /** ||e1 - e2||_p = 2^(1/p). */
  normMinus: number;
  /** normPlus^2 + normMinus^2 = 2 * 2^(2/p). */
  lhs: number;
  /** 2||e1||_p^2 + 2||e2||_p^2 = 4. */
  rhs: number;
  /** lhs - rhs. */
  gap: number;
  /** True only when |gap| < 1e-9, i.e. at p = 2 in range. */
  holds: boolean;
  /** Sample points on the l^p unit sphere. */
  samples: readonly Vec2[];
}

function clampP(p: number): number {
  if (!Number.isFinite(p)) return PARALLELOGRAM_P_INIT;
  return Math.max(PARALLELOGRAM_P_MIN, Math.min(PARALLELOGRAM_P_MAX, p));
}

function parallelogramLawData(p: number, showCircle: boolean): ParallelogramLawData {
  const pp = clampP(p);
  const e1: Vec2 = { ...E1 };
  const e2: Vec2 = { ...E2 };
  const sum: Vec2 = { x: e1.x + e2.x, y: e1.y + e2.y };
  const diff: Vec2 = { x: e1.x - e2.x, y: e1.y - e2.y };
  const normE1 = lpNorm(e1, pp);
  const normE2 = lpNorm(e2, pp);
  const normPlus = lpNorm(sum, pp);
  const normMinus = lpNorm(diff, pp);
  const lhs = normPlus * normPlus + normMinus * normMinus;
  const rhs = 2 * normE1 * normE1 + 2 * normE2 * normE2;
  const gap = lhs - rhs;
  return {
    p: pp,
    showCircle,
    e1,
    e2,
    sum,
    diff,
    normE1,
    normE2,
    normPlus,
    normMinus,
    lhs,
    rhs,
    gap,
    holds: Math.abs(gap) < PARALLELOGRAM_TOL,
    samples: unitSphereSamples(pp),
  };
}

export const parallelogramLawModel: SceneModel<ParallelogramLawData> = {
  compute(state: ControlState): ParallelogramLawData {
    const rawShow = state['showCircle'];
    const showCircle =
      rawShow === undefined ? PARALLELOGRAM_SHOW_CIRCLE_INIT : rawShow !== false && rawShow !== 'false';
    return parallelogramLawData(Number(state['p']), showCircle);
  },
};
