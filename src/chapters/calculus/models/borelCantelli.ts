import type { SceneModel } from '../../../contracts';

/**
 * The Borel-Cantelli lemmas on two explicit interval sequences in [0,1].
 *
 * Summable mode: E_n = [0, 1/n^2], nested shrinking. The total length is
 * sum 1/n^2 = pi^2/6 < infinity, and limsup E_n = {0}, of measure 0 —
 * Borel-Cantelli I in action.
 *
 * Nonsummable mode: the dyadic intervals cycling level by level,
 * F_1 = [0,1], F_2 = [0,1/2], F_3 = [1/2,1], F_4 = [0,1/4], ... Each full
 * dyadic level sums to length 1, so the total length diverges; every
 * x in [0,1] is covered once per level, hence infinitely often, so
 * limsup F_n = [0,1].
 *
 * The limsup approximation marks the sample points covered by at least t
 * of the first n sets: t = ceil(n/2) in summable mode (this is the set
 * (0, 4/n^2], shrinking to {0}), and t = the number of complete dyadic
 * levels in nonsummable mode (every point is covered at each complete
 * level, so the approximation is all of [0,1]).
 * Pure computation: no DOM, d3, or three.
 */

export const N_MIN = 1;
export const N_MAX = 60;
export const N_INIT = 20;

export const MODE_OPTIONS = ['summable', 'nonsummable'] as const;
export type BorelCantelliMode = (typeof MODE_OPTIONS)[number];
export const MODE_INIT: BorelCantelliMode = 'summable';

/** sum_{n>=1} 1/n^2: the total length in summable mode. */
export const SUM_LIMIT = (Math.PI * Math.PI) / 6;

/** Samples of [0,1] used for the coverage heatmap and limsup approximation. */
export const SAMPLE_COUNT = 200;

export interface BorelCantelliInterval {
  l: number;
  r: number;
}

/**
 * The k-th set (1-based). Summable: [0, 1/k^2]. Nonsummable: the dyadic
 * intervals enumerated level by level: level m holds the 2^m intervals
 * [j/2^m, (j+1)/2^m], j = 0..2^m - 1.
 */
export function intervalAt(mode: BorelCantelliMode, k: number): BorelCantelliInterval {
  if (mode === 'summable') {
    return { l: 0, r: 1 / (k * k) };
  }
  const m = Math.floor(Math.log2(k));
  const j = k - 2 ** m;
  return { l: j / 2 ** m, r: (j + 1) / 2 ** m };
}

/** Number of complete dyadic levels among the first n nonsummable sets. */
export function completeLevels(n: number): number {
  return Math.floor(Math.log2(n + 1));
}

export interface BorelCantelliData {
  mode: BorelCantelliMode;
  n: number;
  intervals: BorelCantelliInterval[];
  /** sum_{k<=n} m(E_k). */
  partialSum: number;
  /** pi^2/6 in summable mode, Infinity in nonsummable mode. */
  limitTotal: number;
  /** The x-grid: i/SAMPLE_COUNT for i = 0..SAMPLE_COUNT. */
  sampleX: number[];
  /** coverage[i]: how many of the first n sets contain sampleX[i]. */
  coverage: number[];
  /** A sample point counts toward the limsup approximation iff coverage >= threshold. */
  threshold: number;
  limsupHit: boolean[];
  /** Fraction of sample points with coverage >= threshold. */
  limsupMeasure: number;
}

export function borelCantelliData(mode: BorelCantelliMode, n: number): BorelCantelliData {
  const nn = Number.isFinite(n) ? Math.max(N_MIN, Math.min(N_MAX, Math.round(n))) : N_INIT;
  const intervals: BorelCantelliInterval[] = [];
  let partialSum = 0;
  for (let k = 1; k <= nn; k++) {
    const iv = intervalAt(mode, k);
    intervals.push(iv);
    partialSum += iv.r - iv.l;
  }
  const sampleX: number[] = [];
  const coverage: number[] = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const x = i / SAMPLE_COUNT;
    sampleX.push(x);
    let c = 0;
    for (const iv of intervals) {
      if (x >= iv.l && x <= iv.r) c++;
    }
    coverage.push(c);
  }
  const threshold = mode === 'summable' ? Math.ceil(nn / 2) : completeLevels(nn);
  const limsupHit = coverage.map((c) => c >= threshold);
  const limsupMeasure = limsupHit.filter(Boolean).length / (SAMPLE_COUNT + 1);
  return {
    mode,
    n: nn,
    intervals,
    partialSum,
    limitTotal: mode === 'summable' ? SUM_LIMIT : Infinity,
    sampleX,
    coverage,
    threshold,
    limsupHit,
    limsupMeasure,
  };
}

export const borelCantelliModel: SceneModel<BorelCantelliData> = {
  compute(state) {
    const rawMode = String(state['mode'] ?? '');
    const mode: BorelCantelliMode = (MODE_OPTIONS as readonly string[]).includes(rawMode)
      ? (rawMode as BorelCantelliMode)
      : MODE_INIT;
    const rawN = Number(state['n']);
    return borelCantelliData(mode, Number.isFinite(rawN) ? rawN : N_INIT);
  },
};
