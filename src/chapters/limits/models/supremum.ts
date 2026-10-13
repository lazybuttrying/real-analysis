import type { SceneModel } from '../../../contracts';

/**
 * The supremum axiom: bounded-above sets of reals have a least upper bound.
 * Two demo sets: S = {1 - 1/n} with sup 1, and decimal truncations of sqrt(2).
 * Pure computation: no DOM, d3, or three.
 */

export const SUPREMUM_SETS = ['one-minus', 'sqrt2'] as const;
export type SupremumSet = (typeof SUPREMUM_SETS)[number];

export const BOUND_MIN = 0.5;
export const BOUND_MAX = 2;
export const BOUND_INIT = 1.4;

export interface SupremumPoints {
  sup: number;
  points: number[];
}

export function supremumPoints(set: string): SupremumPoints {
  if (set === 'sqrt2') {
    return { sup: Math.SQRT2, points: [1, 1.4, 1.41, 1.414, 1.4142, 1.41421, 1.414213] };
  }
  const points: number[] = [];
  for (let n = 1; n <= 40; n++) points.push(1 - 1 / n);
  return { sup: 1, points };
}

export interface SupremumData {
  set: string;
  sup: number;
  bound: number;
  gap: number;
  isUpper: boolean;
  points: number[];
}

export function supremumData(set: string, bound: number): SupremumData {
  const valid = (SUPREMUM_SETS as readonly string[]).includes(set) ? set : 'one-minus';
  const { sup, points } = supremumPoints(valid);
  return {
    set: valid,
    sup,
    bound,
    gap: bound - sup,
    isUpper: bound >= sup - 1e-9,
    points,
  };
}

export const supremumModel: SceneModel<SupremumData> = {
  compute(state) {
    const set = String(state['set']);
    const bRaw = Number(state['bound']);
    const bound = Number.isFinite(bRaw) ? Math.min(BOUND_MAX, Math.max(BOUND_MIN, bRaw)) : BOUND_INIT;
    return supremumData(set, bound);
  },
};
