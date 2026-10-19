import type { SceneModel } from '../../../contracts';

/**
 * Egorov's theorem on the concrete sliding-bump sequence
 * f_n(x) = 1_{[1/(n+1), 1/n]}(x) on [0,1].
 *
 * Each f_n is a bump of height 1 sliding toward 0: f_n(x) -> 0 for every
 * x in [0,1] (at x = 0 every f_n is 0; at x > 0 the bumps eventually slide
 * below x), but the convergence is not uniform on [0,1] because
 * sup |f_n| = 1 for all n.
 *
 * The "bad set" E_{n,delta} = { x : |f_k(x)| >= delta for some k >= n } is
 * explicit here: for 0 < delta <= 1, f_k(x) >= delta iff x lies in the k-th
 * bump, and the union of the bumps from k = n onward is the interval
 * (0, 1/n], of measure 1/n. On the complementary good set [1/n, 1],
 * f_k is identically 0 for every k >= n+1, so f_k -> 0 uniformly there.
 * Given eps > 0, choosing n > 1/eps is exactly Egorov's theorem for this
 * sequence: uniform convergence after deleting a set of measure < eps.
 * Pure computation: no DOM, d3, or three.
 */

export const N_MIN = 1;
export const N_MAX = 40;
export const N_INIT = 6;

export const DELTA_MIN = 0.1;
export const DELTA_MAX = 1;
export const DELTA_STEP = 0.05;
export const DELTA_INIT = 0.5;

/** The n-th bump: f_n(x) = 1 on [1/(n+1), 1/n], 0 elsewhere. */
export function fnAt(n: number, x: number): number {
  return x >= 1 / (n + 1) && x <= 1 / n ? 1 : 0;
}

export interface EgorovData {
  delta: number;
  n: number;
  /** Left/right endpoints of the n-th bump [1/(n+1), 1/n]. */
  bumpA: number;
  bumpB: number;
  /** The bad set (0, 1/n]: open at 0, closed at 1/n (for 0 < delta <= 1). */
  badLeft: number;
  badRight: number;
  /**
   * Measure of the bad set: 1/n for 0 < delta <= 1; 0 for delta > 1
   * (|f_k| <= 1 < delta never holds); 1 for delta <= 0 (|f_k| >= delta
   * holds everywhere).
   */
  badMeasure: number;
  /** On [1/n, 1] the convergence f_k -> 0 is uniform. */
  goodLeft: number;
  goodRight: number;
  /** From this index on, f_k vanishes identically on the good set. */
  tailStart: number;
}

export function egorovData(delta: number, n: number): EgorovData {
  const dd = Number.isFinite(delta) ? delta : DELTA_INIT;
  const nn = Number.isFinite(n) ? Math.max(N_MIN, Math.min(N_MAX, Math.round(n))) : N_INIT;
  const bumpA = 1 / (nn + 1);
  const bumpB = 1 / nn;
  return {
    delta: dd,
    n: nn,
    bumpA,
    bumpB,
    badLeft: 0,
    badRight: bumpB,
    badMeasure: dd > 1 ? 0 : dd <= 0 ? 1 : 1 / nn,
    goodLeft: bumpB,
    goodRight: 1,
    tailStart: nn + 1,
  };
}

export const egorovModel: SceneModel<EgorovData> = {
  compute(state) {
    const rawDelta = Number(state['delta']);
    const rawN = Number(state['n']);
    return egorovData(rawDelta, rawN);
  },
};
