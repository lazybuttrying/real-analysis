import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Bounded variation: V_a^b(f) = sup over partitions P of sum_P |f(x_i) - f(x_{i-1})|.
 *
 * Two examples on [0, 1] with the uniform partition of n points:
 *   - 'sine': f(x) = sin(2 pi x), of bounded variation with V_0^1(f) = 4.
 *   - 'wild': f(x) = x * sin(1/x), f(0) = 0, NOT of bounded variation:
 *     with u_k = 1/(2 pi k + pi/2) (sin = 1, f(u_k) = u_k) and
 *     v_k = 1/(2 pi k + 3 pi/2) (sin = -1, f(v_k) = -v_k),
 *     the partition {0, v_N, u_N, ..., v_1, u_1, 1} gives
 *     V(f) >= sum_{k=1}^{N} (u_k + v_k) >= H_N / (2 pi) -> infinity.
 *
 * NOTE: x^2 * sin(1/x) is of bounded variation (V <= 3); only the
 * x * sin(1/x) case breaks bounded variation.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** The two example functions, matching the 'fn' select control in meta.ts. */
export type BoundedVariationFn = 'sine' | 'wild';
export const DEFAULT_FN: BoundedVariationFn = 'sine';

/** Slider range for n (partition points); controls must match meta.ts. */
export const MIN_N = 2;
export const MAX_N = 200;
export const DEFAULT_N = 40;

/** True variation of the sine example: V_0^1(sin 2 pi x) = int_0^1 2 pi |cos 2 pi x| dx = 4. */
export const SINE_VARIATION_TRUE = 4;

export interface BoundedVariationData {
  /** Example function selected by the 'fn' control. */
  fn: BoundedVariationFn;
  /** Partition point count, clamped to [MIN_N, MAX_N]. */
  n: number;
  /** Partition points x_i = i / (n - 1), i = 0..n-1. */
  xs: number[];
  /** f(x_i) at the partition points. */
  ys: number[];
  /** Running variation: cumulative[i] = sum_{j=1}^{i} |f(x_j) - f(x_{j-1})|, cumulative[0] = 0. */
  cumulative: number[];
  /** V_n = cumulative[n - 1], the variation over the uniform n-point partition. */
  variation: number;
}

/** Value of the example function at x. */
export function boundedVariationFnValue(fn: BoundedVariationFn, x: number): number {
  if (fn === 'wild') return x === 0 ? 0 : x * Math.sin(1 / x);
  return Math.sin(2 * Math.PI * x);
}

/**
 * The extremum points of the wild example: u_k with sin(1/u_k) = 1 and
 * v_k with sin(1/v_k) = -1, so f(u_k) = u_k and f(v_k) = -v_k.
 * Satisfies 0 < v_k < u_k < 1 and u_k + v_k >= 1 / (2 pi k) for k >= 1.
 */
export function wildExtrema(k: number): { u: number; v: number } {
  const u = 1 / (2 * Math.PI * k + Math.PI / 2);
  const v = 1 / (2 * Math.PI * k + (3 * Math.PI) / 2);
  return { u, v };
}

/** Lower bound for the wild example: sum_{k=1}^{N} (u_k + v_k) >= H_N / (2 pi). */
export function wildVariationLowerBound(N: number): number {
  let sum = 0;
  for (let k = 1; k <= N; k++) {
    const { u, v } = wildExtrema(k);
    sum += u + v;
  }
  return sum;
}

export const boundedVariationModel: SceneModel<BoundedVariationData> = {
  compute(state) {
    const rawFn = String(state['fn']);
    const fn: BoundedVariationFn = rawFn === 'wild' ? 'wild' : DEFAULT_FN;
    const raw = Number(state['n']);
    const n = clampNumber(raw, MIN_N, MAX_N, DEFAULT_N, true);
    const xs: number[] = [];
    const ys: number[] = [];
    const cumulative: number[] = [];
    let prev = boundedVariationFnValue(fn, 0);
    xs.push(0);
    ys.push(prev);
    cumulative.push(0);
    let variation = 0;
    for (let i = 1; i < n; i++) {
      const x = i / (n - 1);
      const y = boundedVariationFnValue(fn, x);
      variation += Math.abs(y - prev);
      prev = y;
      xs.push(x);
      ys.push(y);
      cumulative.push(variation);
    }
    return { fn, n, xs, ys, cumulative, variation };
  },
};
