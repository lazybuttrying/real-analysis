import type { SceneModel } from '../../../contracts';

/**
 * A Peano curve, live: a continuous surjection [0, 1] -> [0, 1]^2 built by
 * the classic 9-subsquare recursion. The order-1 pattern snakes through the
 * 9 subsquares from the bottom-left corner (0, 0) to (1, 0); each subsquare
 * is traversed by a scaled dihedral copy of the same pattern, with entry
 * and exit corners matched so the whole polyline is continuous. The limit
 * is uniformly Cauchy (diameters shrink by 1/3 each level), hence
 * continuous, and it meets every subsquare, hence surjective.
 * Pure computation: no DOM, d3, or three.
 */

export const PEANO_ORDER_MIN = 1;
export const PEANO_ORDER_MAX = 4;
export const PEANO_ORDER_INIT = 2;

export const PEANO_T_MIN = 0;
export const PEANO_T_MAX = 1;
export const PEANO_T_INIT = 0.5;

export const PEANO_SHOW_GRID_INIT = true;

export type Pt2 = readonly [number, number];

interface SubsquareMap {
  /** Image of (0, 0): the entry corner. */
  readonly e: Pt2;
  /** Image of (1, 0): the exit corner (adjacent to e). */
  readonly x: Pt2;
  /** Image of (0, 1): fixes the orientation (a corner adjacent to e). */
  readonly f: Pt2;
}

/**
 * The 9 subsquares in snake order (up the left column, across the top,
 * down and back along the bottom), each with entry/exit corners chosen so
 * that exit(j) = entry(j + 1) and entry/exit are adjacent corners of the
 * subsquare. Entry of the whole curve is (0, 0); exit is (1, 0), so every
 * recursive copy runs from its entry corner to its exit corner and the
 * joints match exactly.
 */
const SUBSQUARES: readonly SubsquareMap[] = [
  { e: [0, 0], x: [0, 1 / 3], f: [1 / 3, 0] },
  { e: [0, 1 / 3], x: [0, 2 / 3], f: [1 / 3, 1 / 3] },
  { e: [0, 2 / 3], x: [1 / 3, 2 / 3], f: [0, 1] },
  { e: [1 / 3, 2 / 3], x: [2 / 3, 2 / 3], f: [1 / 3, 1] },
  { e: [2 / 3, 2 / 3], x: [1, 2 / 3], f: [2 / 3, 1] },
  { e: [1, 2 / 3], x: [2 / 3, 2 / 3], f: [1, 1 / 3] },
  { e: [2 / 3, 2 / 3], x: [2 / 3, 1 / 3], f: [1 / 3, 2 / 3] },
  { e: [2 / 3, 1 / 3], x: [2 / 3, 0], f: [1 / 3, 1 / 3] },
  { e: [2 / 3, 0], x: [1, 0], f: [2 / 3, 1 / 3] },
];

function transformPoint(m: SubsquareMap, p: Pt2): Pt2 {
  const u = p[0];
  const v = p[1];
  return [
    m.e[0] + u * (m.x[0] - m.e[0]) + v * (m.f[0] - m.e[0]),
    m.e[1] + u * (m.x[1] - m.e[1]) + v * (m.f[1] - m.e[1]),
  ];
}

function clampOrder(order: number): number {
  if (!Number.isFinite(order)) return PEANO_ORDER_INIT;
  return Math.max(PEANO_ORDER_MIN, Math.min(PEANO_ORDER_MAX, Math.round(order)));
}

function clampT(t: number): number {
  if (!Number.isFinite(t)) return PEANO_T_INIT;
  return Math.max(PEANO_T_MIN, Math.min(PEANO_T_MAX, t));
}

/**
 * The order-k approximating polyline: 9^k segments, 9^k + 1 points, from
 * (0, 0) to (1, 0). Consecutive points are at most 3^-k apart.
 */
export function peanoPolyline(order: number): Pt2[] {
  const k = clampOrder(order);
  let pts: Pt2[] = [
    [0, 0],
    [1, 0],
  ];
  for (let level = 1; level <= k; level++) {
    const next: Pt2[] = [];
    for (let j = 0; j < SUBSQUARES.length; j++) {
      const m = SUBSQUARES[j]!;
      for (let i = 0; i < pts.length; i++) {
        // Drop the duplicate joint point: transform_j((0,0)) = entry(j)
        // = exit(j-1) = the last point already pushed.
        if (j > 0 && i === 0) continue;
        next.push(transformPoint(m, pts[i]!));
      }
    }
    pts = next;
  }
  return pts;
}

/** Number of segments of the order-k polyline. */
export function peanoSegmentCount(order: number): number {
  return Math.pow(9, clampOrder(order));
}

/** The order-k curve is drawn over a 3^k x 3^k grid. */
export function peanoGridN(order: number): number {
  return Math.pow(3, clampOrder(order));
}

/** Largest distance between consecutive polyline points (<= 3^-k). */
export function peanoMaxStep(order: number): number {
  const pts = peanoPolyline(order);
  let m = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    m = Math.max(m, Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  return m;
}

/** The point of the order-k curve at parameter t in [0, 1]. */
export function peanoTracePoint(order: number, t: number): Pt2 {
  const pts = peanoPolyline(order);
  const segs = pts.length - 1;
  const tt = clampT(t);
  const pos = tt * segs;
  const i = Math.min(segs - 1, Math.floor(pos));
  const f = pos - i;
  const a = pts[i]!;
  const b = pts[i + 1]!;
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

export interface PeanoData {
  readonly order: number;
  readonly t: number;
  readonly showGrid: boolean;
  readonly points: Pt2[];
  readonly trace: Pt2;
  readonly segmentCount: number;
  readonly gridN: number;
  readonly maxStep: number;
}

function peanoCurveData(order: number, t: number, showGrid: boolean): PeanoData {
  const k = clampOrder(order);
  const tt = clampT(t);
  return {
    order: k,
    t: tt,
    showGrid,
    points: peanoPolyline(k),
    trace: peanoTracePoint(k, tt),
    segmentCount: peanoSegmentCount(k),
    gridN: peanoGridN(k),
    maxStep: peanoMaxStep(k),
  };
}

export const peanoCurveModel: SceneModel<PeanoData> = {
  compute(state) {
    const rawGrid = state['showGrid'];
    return peanoCurveData(
      Number(state['order']),
      Number(state['t']),
      typeof rawGrid === 'boolean' ? rawGrid : PEANO_SHOW_GRID_INIT,
    );
  },
};
