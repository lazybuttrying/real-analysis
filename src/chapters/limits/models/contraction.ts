import type { ControlState, SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * The contraction mapping principle (Banach fixed-point theorem) in the
 * abstract metric-space setting: a contraction
 *   d(Tx, Ty) <= q d(x, y),  q < 1
 * on a nonempty complete metric space has a unique fixed point, and the
 * Picard iterates x_{n+1} = T(x_n) satisfy the a-priori error bound
 *   d(x_n, x*) <= q^n / (1 - q) * d(x_1, x_0).
 *
 * Two maps on the line carry the story. T(x) = x/2 + 1 on R is a contraction
 * with q = 1/2 whose fixed point x* = 2 lies in the space. T(x) = x/2 on the
 * incomplete space (0, 1] is also a contraction with q = 1/2, but its only
 * would-be fixed point 0 lies outside the space: the Picard iterates
 * 1, 1/2, 1/4, ... are Cauchy yet converge to a point that is missing, so no
 * fixed point exists in (0, 1]. Completeness is essential.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Contraction constant shared by both maps. */
export const CONTRACTION_Q = 0.5;

const MIN_ITERATES = 0;
const MAX_ITERATES = 12;
const DEFAULT_ITERATES = 5;
const DEFAULT_X0 = 1;

const MAP_KEYS = ['affine', 'half'] as const;
type ContractionMap = (typeof MAP_KEYS)[number];

export function mapOf(raw: unknown): ContractionMap {
  return raw === 'half' ? 'half' : 'affine';
}

/** T(x) = x/2 + 1 on R, or T(x) = x/2 on (0, 1]. */
export function applyMap(map: ContractionMap, x: number): number {
  return map === 'affine' ? x / 2 + 1 : x / 2;
}

/**
 * Limit of the Picard iterates in the ambient space: 2 for the affine map,
 * 0 for the half map. For 'half' this point is not in (0, 1].
 */
function ambientLimit(map: ContractionMap): number {
  return map === 'affine' ? 2 : 0;
}

/** The fixed point inside the space, or null when the space lacks it. */
export function fixedPoint(map: ContractionMap): number | null {
  return map === 'affine' ? 2 : null;
}

/** d(x_1, x_0) = |T(x_0) - x_0|, the first Picard step. */
export function firstStep(map: ContractionMap, x0: number): number {
  return Math.abs(applyMap(map, x0) - x0);
}

/**
 * A-priori error bound q^n / (1 - q) * d(x_1, x_0), centered at the
 * (ambient) limit of the iterates.
 */
export function errorRadius(map: ContractionMap, x0: number, n: number): number {
  const q = CONTRACTION_Q;
  return (Math.pow(q, n) / (1 - q)) * firstStep(map, x0);
}

/** Picard iterates x_0, x_1 = T(x_0), ..., x_n = T(x_{n-1}). */
export function picardIterates(map: ContractionMap, x0: number, n: number): number[] {
  const xs: number[] = [x0];
  for (let k = 1; k <= n; k++) {
    xs.push(applyMap(map, xs[k - 1] ?? x0));
  }
  return xs;
}

function clampX0(map: ContractionMap, raw: unknown): number {
  // The half map only lives on (0, 1]: a start above 1 would leave the space.
  return clampNumber(raw, 0.1, map === 'half' ? 1 : 3, DEFAULT_X0);
}

function clampN(raw: unknown): number {
  return clampNumber(raw, MIN_ITERATES, MAX_ITERATES, DEFAULT_ITERATES, true);
}

export interface ContractionData {
  map: ContractionMap;
  x0: number;
  /** Number of Picard steps shown (iterates array has n + 1 entries). */
  n: number;
  /** Contraction constant q = 1/2. */
  q: number;
  /** x_0, ..., x_n. */
  iterates: number[];
  /** Fixed point inside the space, or null when the space lacks it. */
  fixedPoint: number | null;
  /** Limit of the iterates in the ambient space (missing for 'half'). */
  ambientLimit: number;
  /** A-priori error bound q^n / (1 - q) * |x_1 - x_0|. */
  radius: number;
}

export const contractionModel: SceneModel<ContractionData> = {
  compute(state: ControlState) {
    const map = mapOf(state['map']);
    const x0 = clampX0(map, state['x0']);
    const n = clampN(state['n']);
    return {
      map,
      x0,
      n,
      q: CONTRACTION_Q,
      iterates: picardIterates(map, x0, n),
      fixedPoint: fixedPoint(map),
      ambientLimit: ambientLimit(map),
      radius: errorRadius(map, x0, n),
    };
  },
};
