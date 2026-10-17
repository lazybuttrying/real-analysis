import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * The Cantor function (Devil's staircase) on [0, 1].
 *
 * Definition via ternary expansion. Write x = 0.c_1 c_2 ..._3 with
 * c_k in {0, 1, 2} and let N be the first index with c_k = 1
 * (N = infinity when the expansion contains no 1). Then
 *   b_k = c_k / 2        for k < N,
 *   b_N = 1              when N is finite,
 *   b_k = 0              for k > N (N finite),
 * and b_k = c_k / 2 for all k when N = infinity. Finally
 *   f(x) = sum_k b_k 2^{-k}.
 * Both ternary expansions of a ternary-rational point give the same value,
 * e.g. 0.0222..._3 and 0.1_3 both yield f = 1/2, so f is well-defined.
 *
 * The implementation extracts ternary digits greedily (multiply by 3, take
 * the floor), which always lands on the terminating expansion when one
 * exists. x = 1 is read as 0.222..._3, giving f(1) = 1.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Ternary digits extracted; each digit costs one bit of output precision. */
export const TERNARY_DIGITS = 40;

/** Control range of the Cantor-set construction stage slider. */
export const STAGE_MIN = 0;
export const STAGE_MAX = 7;
export const STAGE_INIT = 4;

/** Sampled polyline resolution for the drawn staircase. */
export const SAMPLE_POINTS = 2001;

export interface CantorSetInterval {
  l: number;
  r: number;
}

/**
 * The Cantor function f(x), continuous, nondecreasing, constant on every
 * open interval complementary to the Cantor set, with f(0) = 0, f(1) = 1.
 */
export function cantorFunction(x: number): number {
  if (!Number.isFinite(x)) return 0;
  let t = Math.min(1, Math.max(0, x));
  let sum = 0;
  let scale = 0.5; // 2^{-k}
  for (let k = 1; k <= TERNARY_DIGITS; k++) {
    t *= 3;
    let d = Math.floor(t);
    t -= d;
    if (d === 3) {
      // x hit 1 exactly: read it as 0.222..._3, i.e. every remaining
      // digit is 2, so every remaining b_k = 1.
      return sum + 2 * scale;
    }
    if (d === 1) {
      // First 1 at position k: b_k = 1, all later b_j = 0.
      sum += scale;
      return sum;
    }
    if (d === 2) sum += scale; // b_k = c_k / 2 = 1
    scale *= 0.5;
    if (t === 0) break; // terminating expansion: remaining digits are 0
  }
  return sum;
}

export function clampStage(raw: unknown): number {
  return clampNumber(raw, STAGE_MIN, STAGE_MAX, STAGE_INIT, true);
}

/**
 * The 2^stage closed intervals of C_stage (the Cantor set after `stage`
 * rounds of middle-third deletion), in increasing order.
 */
export function cantorIntervals(stage: number): CantorSetInterval[] {
  const s = clampStage(stage);
  let intervals: CantorSetInterval[] = [{ l: 0, r: 1 }];
  for (let n = 1; n <= s; n++) {
    const next: CantorSetInterval[] = [];
    for (const { l, r } of intervals) {
      const third = (r - l) / 3;
      next.push({ l, r: l + third }, { l: r - third, r });
    }
    intervals = next;
  }
  return intervals;
}

/** Total length of C_stage: (2/3)^stage. */
export function cantorTotalLength(stage: number): number {
  return Math.pow(2 / 3, clampStage(stage));
}

export interface CantorFunctionData {
  stage: number;
  /** The 2^stage closed intervals of C_stage. */
  intervals: CantorSetInterval[];
  /** Total length of C_stage: (2/3)^stage. */
  totalLength: number;
  /** Sampled staircase: xs[i] in [0, 1], fVals[i] = cantorFunction(xs[i]). */
  xs: number[];
  fVals: number[];
}

export function cantorFunctionData(stage: number): CantorFunctionData {
  const s = clampStage(stage);
  const intervals = cantorIntervals(s);
  const xs: number[] = new Array<number>(SAMPLE_POINTS);
  const fVals: number[] = new Array<number>(SAMPLE_POINTS);
  for (let i = 0; i < SAMPLE_POINTS; i++) {
    const x = i / (SAMPLE_POINTS - 1);
    xs[i] = x;
    fVals[i] = cantorFunction(x);
  }
  return {
    stage: s,
    intervals,
    totalLength: cantorTotalLength(s),
    xs,
    fVals,
  };
}

export const cantorFunctionModel: SceneModel<CantorFunctionData> = {
  compute(state) {
    return cantorFunctionData(Number(state['stage']));
  },
};
