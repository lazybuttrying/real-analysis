import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * 1/(n(n+1)) = 1/n - 1/(n+1), so neighboring pieces cancel and only
 * the very first 1 (minus a vanishing tail) survives: S_n = 1 - 1/(n+1).
 */

export const MAX_N = 24;

export const LIMIT = 1;

interface TermPair {
  i: number;
  /** +1/i piece */
  pos: number;
  /** 1/(i+1) piece (drawn below the axis as -1/(i+1)) */
  neg: number;
  /** The term itself, 1/(i(i+1)) */
  term: number;
}

export interface TelescopingData {
  n: number;
  pairs: TermPair[];
  /** S_n, which equals 1 - 1/(n+1) exactly */
  sum: number;
  limit: number;
  /** The surviving tail 1/(n+1) */
  tail: number;
  error: number;
}

export function telescopingPairs(n: number): TelescopingData {
  const pairs: TermPair[] = [];
  let s = 0;
  for (let i = 1; i <= n; i++) {
    const term = 1 / (i * (i + 1));
    s += term;
    pairs.push({ i, pos: 1 / i, neg: 1 / (i + 1), term });
  }
  return {
    n,
    pairs,
    sum: s,
    limit: LIMIT,
    tail: 1 / (n + 1),
    error: Math.abs(LIMIT - s),
  };
}

export const telescopingModel: SceneModel<TelescopingData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return telescopingPairs(n);
  },
};
