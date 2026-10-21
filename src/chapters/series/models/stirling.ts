import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * n! ~ sqrt(2 pi n) (n/e)^n. On a log scale the two curves lie on top of
 * each other; the relative error decays like 1/(12n).
 * (Where the pi comes from is idea-level here: it enters through the
 * Wallis product when the estimate is made precise.)
 */

const MAX_N = 60;

function stirlingApprox(n: number): number {
  return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
}

interface StirlingPoint {
  k: number;
  lnFact: number;
  lnStir: number;
  relErr: number;
}

export interface StirlingData {
  n: number;
  points: StirlingPoint[];
  /** n! (recovered as exp(ln n!) to stay in double range) */
  fact: number;
  approx: number;
  relErr: number;
}

export function stirlingTable(n: number): StirlingData {
  const points: StirlingPoint[] = [];
  let lnFact = 0;
  for (let k = 1; k <= n; k++) {
    lnFact += Math.log(k);
    const lnStir = 0.5 * Math.log(2 * Math.PI * k) + k * Math.log(k) - k;
    points.push({
      k,
      lnFact,
      lnStir,
      relErr: Math.abs(Math.exp(lnStir - lnFact) - 1),
    });
  }
  const fact = Math.exp(lnFact);
  const approx = stirlingApprox(n);
  const relErr = Math.abs(approx - fact) / fact;
  return { n, points, fact, approx, relErr };
}

export const stirlingModel: SceneModel<StirlingData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return stirlingTable(n);
  },
};
