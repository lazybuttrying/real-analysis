import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Uniform vs pointwise continuity. For f(t) = t^2 the largest admissible
 * delta at a point x shrinks as |x| grows (so no single delta works on all
 * of R), while for f(t) = 2t one delta = eps/2 works everywhere.
 * Pure computation: no DOM, d3, or three.
 */

export const FUNCTION_KINDS = ['square', 'linear'] as const;
export type FunctionKind = (typeof FUNCTION_KINDS)[number];

export function functionKindOf(raw: unknown): FunctionKind {
  return raw === 'linear' ? 'linear' : 'square';
}

export function evaluateFn(kind: FunctionKind, x: number): number {
  return kind === 'square' ? x * x : 2 * x;
}

/**
 * Exact maximal delta at x for f(t) = t^2: the largest delta with
 * |y - x| < delta ==> |y^2 - x^2| < eps.
 * Since |y^2 - x^2| = |y - x| |y + x| <= delta (2|x| + delta), the boundary
 * equation delta (2|x| + delta) = eps solves to delta = sqrt(x^2 + eps) - |x|.
 */
export function maxDeltaSquare(x: number, eps: number): number {
  return Math.sqrt(x * x + eps) - Math.abs(x);
}

/**
 * For f(t) = 2t, |f(y) - f(x)| = 2 |y - x|, so delta = eps / 2 works at
 * every x: delta depends on eps alone, never on x.
 */
export function maxDeltaLinear(eps: number): number {
  return eps / 2;
}

export function maxDelta(kind: FunctionKind, x: number, eps: number): number {
  return kind === 'square' ? maxDeltaSquare(x, eps) : maxDeltaLinear(eps);
}

export interface UniformContinuityData {
  fn: FunctionKind;
  x: number;
  eps: number;
  /** The required (maximal) delta at x for this eps. */
  delta: number;
  /** f(x). */
  fx: number;
}

export function uniformContinuityData(kind: FunctionKind, x: number, eps: number): UniformContinuityData {
  return { fn: kind, x, eps, delta: maxDelta(kind, x, eps), fx: evaluateFn(kind, x) };
}

function clampX(raw: number): number {
  if (!Number.isFinite(raw)) return 2;
  return Math.min(4, Math.max(0, raw));
}

function clampEps(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 0.5;
  return Math.min(2, Math.max(0.1, raw));
}

export const uniformContinuityModel: SceneModel<UniformContinuityData> = {
  compute(state: ControlState) {
    const kind = functionKindOf(state['fn']);
    return uniformContinuityData(
      kind,
      clampX(Number(state['x'] ?? 2)),
      clampEps(Number(state['eps'] ?? 0.5)),
    );
  },
};
