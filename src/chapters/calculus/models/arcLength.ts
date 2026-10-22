import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Arc length, live: a curve gamma is rectifiable when the supremum of its
 * polygonal lengths over all partitions is finite, and that supremum is
 * its length. Two C^1 examples on a parameter interval rescaled to [0, 1]:
 *   - 'circle': gamma(u) = (cos(pi u / 2), sin(pi u / 2)), the quarter
 *     circle of radius 1, with exact length pi / 2.
 *   - 'parabola': gamma(u) = (u, u^2), the graph of f(x) = x^2 on [0, 1],
 *     with exact length int_0^1 sqrt(1 + 4x^2) dx
 *       = sqrt(5) / 2 + asinh(2) / 4
 *       = sqrt(5) / 2 + ln(2 + sqrt(5)) / 4.
 * The model samples the uniform partition with n subintervals, sums the
 * Euclidean chord lengths, and also reports the dyadic refinement with
 * 2n subintervals, so the readout can show L_n <= L_{2n} <= L.
 * Pure computation: no DOM, d3, or three.
 */

export type ArcLengthCurve = 'circle' | 'parabola';

export const ARC_LENGTH_CURVES: readonly ArcLengthCurve[] = ['circle', 'parabola'];
export const DEFAULT_CURVE: ArcLengthCurve = 'circle';

export const MIN_N = 1;
export const MAX_N = 64;
export const DEFAULT_N = 8;

/** Dense samples used only to draw the smooth curve. */
export const CURVE_SAMPLES = 200;

export interface ArcLengthPoint {
  readonly x: number;
  readonly y: number;
}

export interface ArcLengthData {
  readonly curve: ArcLengthCurve;
  /** Partition count, clamped to [MIN_N, MAX_N]. */
  readonly n: number;
  /** The n + 1 partition points gamma at the uniform parameters i / n. */
  readonly points: readonly ArcLengthPoint[];
  /** segmentLengths[i] = |points[i + 1] - points[i]|, for i = 0..n - 1. */
  readonly segmentLengths: readonly number[];
  /** Polygonal length L_n: the sum of the segment lengths. */
  readonly length: number;
  /** Polygonal length L_{2n} for the dyadic refinement (2n subintervals). */
  readonly length2n: number;
  /** The exact length L of the selected curve. */
  readonly exact: number;
  /** exact - length, always >= 0 for these curves. */
  readonly error: number;
  /** Dense samples of the smooth curve, for drawing only. */
  readonly curvePoints: readonly ArcLengthPoint[];
}

/** Point of the selected curve at the rescaled parameter u in [0, 1]. */
export function arcLengthPoint(curve: ArcLengthCurve, u: number): ArcLengthPoint {
  if (curve === 'circle') {
    const t = (u * Math.PI) / 2;
    return { x: Math.cos(t), y: Math.sin(t) };
  }
  return { x: u, y: u * u };
}

/** Exact length of the selected curve. */
export function exactLength(curve: ArcLengthCurve): number {
  if (curve === 'circle') return Math.PI / 2;
  return Math.sqrt(5) / 2 + Math.asinh(2) / 4;
}

/**
 * Polygonal length over the uniform partition with n subintervals:
 * the sum of the Euclidean lengths of the n chords.
 */
export function polygonalLength(curve: ArcLengthCurve, n: number): number {
  const nn = Math.max(1, Math.floor(n));
  let sum = 0;
  let prev = arcLengthPoint(curve, 0);
  for (let i = 1; i <= nn; i++) {
    const pt = arcLengthPoint(curve, i / nn);
    sum += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    prev = pt;
  }
  return sum;
}

/** Pure: no DOM, no d3. */
export function arcLengthData(curve: ArcLengthCurve, n: number): ArcLengthData {
  const nn = Math.min(MAX_N, Math.max(MIN_N, Math.floor(n)));
  const points: ArcLengthPoint[] = [];
  const segmentLengths: number[] = [];
  let length = 0;
  for (let i = 0; i <= nn; i++) {
    const pt = arcLengthPoint(curve, i / nn);
    if (i > 0) {
      const prev = points[i - 1]!;
      const seg = Math.hypot(pt.x - prev.x, pt.y - prev.y);
      segmentLengths.push(seg);
      length += seg;
    }
    points.push(pt);
  }
  const exact = exactLength(curve);
  const curvePoints: ArcLengthPoint[] = [];
  for (let i = 0; i < CURVE_SAMPLES; i++) {
    curvePoints.push(arcLengthPoint(curve, i / (CURVE_SAMPLES - 1)));
  }
  return {
    curve,
    n: nn,
    points,
    segmentLengths,
    length,
    length2n: polygonalLength(curve, 2 * nn),
    exact,
    error: exact - length,
    curvePoints,
  };
}

export const arcLengthModel: SceneModel<ArcLengthData> = {
  compute(state) {
    const rawCurve = state['curve'];
    const curve: ArcLengthCurve = rawCurve === 'parabola' ? 'parabola' : DEFAULT_CURVE;
    const n = clampNumber(state['n'], MIN_N, MAX_N, DEFAULT_N, true);
    return arcLengthData(curve, n);
  },
};
