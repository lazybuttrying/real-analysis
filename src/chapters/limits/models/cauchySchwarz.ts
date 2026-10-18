import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Cauchy-Schwarz inequality in R^2: |x . y| <= ||x|| ||y||.
 *
 * The vector x = (3, 0) is fixed; y = (cos theta, sin theta) is the unit
 * vector at the slider-controlled angle. The model computes the dot product,
 * both norms, the orthogonal projection of x onto y, the triangle-inequality
 * witnesses (x + y), and flags for the equality case (y parallel to x) and
 * the orthogonal case (dot product zero).
 * Pure computation: no DOM, d3, or three.
 */

/** A 2D vector. */
export interface Vec2 {
  x: number;
  y: number;
}

/** The fixed vector x = (3, 0): ||x|| = 3 exactly, and y at angle 0 is parallel to it. */
const FIXED_X: Vec2 = { x: 3, y: 0 };

const MIN_ANGLE = 0;
const MAX_ANGLE = 2 * Math.PI;
const DEFAULT_ANGLE = 0;

/** Tolerance for the parallel/orthogonal flags. */
export const EPS = 1e-9;

export interface CauchySchwarzData {
  /** Slider angle theta, clamped to [0, 2pi]. */
  theta: number;
  /** The fixed vector x = (3, 0). */
  x: Vec2;
  /** The rotating unit vector y = (cos theta, sin theta). */
  y: Vec2;
  /** x . y. */
  dot: number;
  /** |x . y|. */
  absDot: number;
  /** ||x|| = 3. */
  normX: number;
  /** ||y|| = 1. */
  normY: number;
  /** ||x|| ||y||. */
  product: number;
  /** The Cauchy-Schwarz slack: ||x|| ||y|| - |x . y| >= 0. */
  gap: number;
  /** The orthogonal projection of x onto y: (x . y) y. */
  projection: Vec2;
  /** ||proj_y x|| = |x . y| since y is a unit vector. */
  projectionLength: number;
  /** True when y is parallel to x (sin theta ~ 0): the equality case. */
  isParallel: boolean;
  /** True when x . y ~ 0. */
  isOrthogonal: boolean;
  /** x + y, for the triangle-inequality corollary. */
  sumVec: Vec2;
  /** ||x + y||, for the triangle-inequality corollary. */
  sumNorm: number;
  /** Whether to draw the projection (the `showProjection` toggle). */
  showProjection: boolean;
}

/** Dot product of two 2D vectors. */
export function dot(u: Vec2, v: Vec2): number {
  return u.x * v.x + u.y * v.y;
}

/** Euclidean norm of a 2D vector. */
export function norm(v: Vec2): number {
  return Math.hypot(v.x, v.y);
}

export const cauchySchwarzModel: SceneModel<CauchySchwarzData> = {
  compute(state: ControlState): CauchySchwarzData {
    const rawAngle = Number(state['angle']);
    const theta = Number.isFinite(rawAngle)
      ? Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, rawAngle))
      : DEFAULT_ANGLE;
    const rawShow = state['showProjection'];
    const showProjection = rawShow === undefined ? true : rawShow !== false && rawShow !== 'false';

    const x: Vec2 = { ...FIXED_X };
    const y: Vec2 = { x: Math.cos(theta), y: Math.sin(theta) };
    const dotValue = dot(x, y);
    const absDot = Math.abs(dotValue);
    const normX = norm(x);
    const normY = norm(y);
    const product = normX * normY;
    const gap = product - absDot;
    const projection: Vec2 = { x: dotValue * y.x, y: dotValue * y.y };
    const projectionLength = Math.abs(dotValue) * normY;
    const sumVec: Vec2 = { x: x.x + y.x, y: x.y + y.y };

    return {
      theta,
      x,
      y,
      dot: dotValue,
      absDot,
      normX,
      normY,
      product,
      gap,
      projection,
      projectionLength,
      isParallel: Math.abs(Math.sin(theta)) < EPS,
      isOrthogonal: Math.abs(dotValue) < EPS,
      sumVec,
      sumNorm: norm(sumVec),
      showProjection,
    };
  },
};
