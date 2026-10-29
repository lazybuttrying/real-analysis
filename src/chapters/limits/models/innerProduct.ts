import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The inner product on R^2, live: <x, y> = x1 y1 + x2 y2. It measures
 * how much two vectors overlap in direction: <x, y> = ||x|| ||y|| cos
 * theta. The model also computes the projection of x onto y,
 * proj = (<x, y> / <y, y>) y, and the angle between the vectors.
 * <x, x> = ||x||^2 is how a norm is born from an inner product.
 * Pure computation: no DOM, d3, or three.
 */

export interface Vec2 {
  x: number;
  y: number;
}

export interface InnerProductData {
  x: Vec2;
  y: Vec2;
  /** <x, y>. */
  dot: number;
  /** ||x||_2. */
  normX: number;
  /** ||y||_2. */
  normY: number;
  /** cos(theta) = <x, y> / (||x|| ||y||), or 0 when a vector is 0. */
  cosTheta: number;
  /** The angle in degrees, or NaN when a vector is 0. */
  angleDeg: number;
  /** The projection of x onto y; equals x's tip foot on the y line. */
  proj: Vec2;
  /** True when |dot| < 1e-9 and both vectors are non-zero. */
  orthogonal: boolean;
}

export function dotProduct(x: Vec2, y: Vec2): number {
  return x.x * y.x + x.y * y.y;
}

export function euclidNorm(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function clampCoord(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(-3, Math.min(3, v));
}

export function innerProductData(x1: number, x2: number, y1: number, y2: number): InnerProductData {
  const x: Vec2 = { x: clampCoord(x1), y: clampCoord(x2) };
  const y: Vec2 = { x: clampCoord(y1), y: clampCoord(y2) };
  const dot = dotProduct(x, y);
  const normX = euclidNorm(x);
  const normY = euclidNorm(y);
  const denom = normX * normY;
  const cosTheta = denom > 0 ? Math.max(-1, Math.min(1, dot / denom)) : 0;
  const angleDeg = denom > 0 ? (Math.acos(cosTheta) * 180) / Math.PI : Number.NaN;
  const yy = dotProduct(y, y);
  const t = yy > 0 ? dot / yy : 0;
  const proj: Vec2 = { x: t * y.x, y: t * y.y };
  return {
    x,
    y,
    dot,
    normX,
    normY,
    cosTheta,
    angleDeg,
    proj,
    orthogonal: denom > 0 && Math.abs(dot) < 1e-9,
  };
}

export const innerProductModel: SceneModel<InnerProductData> = {
  compute(state: ControlState): InnerProductData {
    return innerProductData(
      Number(state['x1']),
      Number(state['x2']),
      Number(state['y1']),
      Number(state['y2']),
    );
  },
};
