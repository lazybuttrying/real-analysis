import type { SceneModel } from '../../../contracts';

/**
 * The fat Cantor set (Smith-Volterra-Cantor construction), contrasted with
 * the standard middle-thirds Cantor set.
 *
 * Construction: start with F_0 = [0, 1]. At stage n (n = 1, 2, ...), from
 * each remaining closed interval remove the middle OPEN interval of ABSOLUTE
 * length 4^{-n}. The fat Cantor set is C = intersection_{n >= 0} F_n.
 *
 * Stage n removes 2^{n-1} intervals of length 4^{-n}, so the total removed
 * length is
 *   sum_{n>=1} 2^{n-1} * 4^{-n} = sum_{n>=1} 2^{-n-1} = 1/2,
 * and after N stages the remaining length is 1 - (1/2)(1 - 2^{-N})
 * = (1 + 2^{-N})/2, tending to 1/2 > 0.
 *
 * Verified identities (tests/fat-cantor.test.ts):
 *   stage-1 fat intervals: [0, 3/8] and [5/8, 1] (middle (3/8, 5/8) of
 *   length 1/4 removed); interval counts are 2^stage for stages 0..7;
 *   fatLength(stage) = (1 + 2^{-stage})/2 and stdLength(stage) = (2/3)^stage
 *   verified to 1e-12, and both agree with the summed interval lengths;
 *   stage 4: fatLength = 17/32 = 0.53125, stdLength = 16/81.
 */

export type Interval = readonly [number, number];

export interface FatCantorData {
  /** Construction stage, clamped to [MIN_STAGE, MAX_STAGE]. */
  stage: number;
  /** The 2^stage surviving closed intervals of the fat construction. */
  fat: Interval[];
  /** Total length of fat intervals: (1 + 2^{-stage}) / 2. */
  fatLength: number;
  /** The 2^stage surviving closed intervals of the standard construction. */
  std: Interval[];
  /** Total length of standard intervals: (2/3)^stage. */
  stdLength: number;
}

export const MIN_STAGE = 0;
export const MAX_STAGE = 7;
export const DEFAULT_STAGE = 4;

/**
 * Stage-n intervals of the fat Cantor construction.
 * Stage 0 is [0, 1]; each later stage removes the middle open interval of
 * absolute length 4^{-n} from every stage-(n-1) interval.
 * Pure: no DOM, no d3.
 */
export function fatIntervals(stage: number): Interval[] {
  let current: Interval[] = [[0, 1]];
  for (let n = 1; n <= stage; n++) {
    const gap = Math.pow(4, -n);
    const next: Interval[] = [];
    for (const [a, b] of current) {
      const mid = (a + b) / 2;
      const half = gap / 2;
      next.push([a, mid - half]);
      next.push([mid + half, b]);
    }
    current = next;
  }
  return current;
}

/**
 * Stage-n intervals of the standard middle-thirds Cantor construction.
 * Pure: no DOM, no d3.
 */
export function stdIntervals(stage: number): Interval[] {
  let current: Interval[] = [[0, 1]];
  for (let n = 1; n <= stage; n++) {
    const next: Interval[] = [];
    for (const [a, b] of current) {
      const third = (b - a) / 3;
      next.push([a, a + third]);
      next.push([b - third, b]);
    }
    current = next;
  }
  return current;
}

/**
 * Remaining length after `stage` fat-construction stages: (1 + 2^{-stage})/2,
 * tending to 1/2 as stage -> infinity.
 */
export function fatLength(stage: number): number {
  return (1 + Math.pow(2, -stage)) / 2;
}

/**
 * Remaining length after `stage` standard-construction stages: (2/3)^stage,
 * tending to 0 as stage -> infinity.
 */
export function stdLength(stage: number): number {
  return Math.pow(2 / 3, stage);
}

export const fatCantorModel: SceneModel<FatCantorData> = {
  compute(state) {
    const raw = Number(state['stage']);
    const stage = Number.isFinite(raw)
      ? Math.min(MAX_STAGE, Math.max(MIN_STAGE, Math.floor(raw)))
      : DEFAULT_STAGE;
    const fat = fatIntervals(stage);
    const std = stdIntervals(stage);
    return {
      stage,
      fat,
      fatLength: fatLength(stage),
      std,
      stdLength: stdLength(stage),
    };
  },
};
