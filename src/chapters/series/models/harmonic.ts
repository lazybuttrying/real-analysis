import type { SceneModel } from '../../../contracts';
import { EULER_GAMMA } from '../../../math/constants';
import { sampleIndices } from '../../../math/sample';
import { KahanSum } from '../../../math/sum';

/** Pure computation. Does not import the DOM, d3, or three. */

export const MAX_N = 1_000_000;
const MAX_POINTS = 400;

export interface HarmonicPoint {
  k: number;
  /** Partial sum S_k */
  sum: number;
  /** Asymptotic form ln k + γ */
  asymptotic: number;
}

export interface HarmonicData {
  n: number;
  /** Points thinned out for the graph (log-spaced when n is large) */
  points: HarmonicPoint[];
  /** Value at k = n */
  final: HarmonicPoint;
  /** Whether the x-axis uses a log scale (mirrors the scene's logX control) */
  logX: boolean;
}

export function harmonicPartialSums(n: number, maxPoints: number = MAX_POINTS): HarmonicData {
  const sampled = new Set(sampleIndices(n, maxPoints));
  const accumulator = new KahanSum();
  const points: HarmonicPoint[] = [];
  let final: HarmonicPoint = { k: 0, sum: 0, asymptotic: Number.NEGATIVE_INFINITY };

  for (let k = 1; k <= n; k++) {
    accumulator.add(1 / k);
    if (sampled.has(k)) {
      final = { k, sum: accumulator.value, asymptotic: Math.log(k) + EULER_GAMMA };
      points.push(final);
    }
  }
  return { n, points, final, logX: false };
}

export const harmonicModel: SceneModel<HarmonicData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return { ...harmonicPartialSums(n), logX: state['logX'] === true };
  },
};
