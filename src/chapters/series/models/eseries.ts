import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * Two roads to e: compound growth (1 + 1/n)^n crawls toward e, while the
 * series sum_{k>=0} 1/k! sprints - its terms die factorially fast.
 */

const MAX_N = 30;

export const LIMIT = Math.E;

export interface StepPoint {
  k: number;
  value: number;
}

export interface ESeriesData {
  n: number;
  /** (1 + 1/k)^k for k = 1..n */
  compound: StepPoint[];
  /** Partial sums of 1/k! for k = 0..n */
  series: StepPoint[];
  compoundValue: number;
  seriesValue: number;
  limit: number;
  compoundError: number;
  seriesError: number;
}

export function eSeriesRace(n: number): ESeriesData {
  const compound: StepPoint[] = [];
  const series: StepPoint[] = [];
  let fact = 1;
  let s = 0;
  for (let k = 0; k <= n; k++) {
    if (k > 0) fact *= k;
    s += 1 / fact;
    series.push({ k, value: s });
    if (k >= 1) compound.push({ k, value: Math.pow(1 + 1 / k, k) });
  }
  const compoundValue = Math.pow(1 + 1 / n, n);
  return {
    n,
    compound,
    series,
    compoundValue,
    seriesValue: s,
    limit: LIMIT,
    compoundError: Math.abs(LIMIT - compoundValue),
    seriesError: Math.abs(LIMIT - s),
  };
}

export const eseriesModel: SceneModel<ESeriesData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return eSeriesRace(n);
  },
};
