import type { SceneModel } from '../../../contracts';
import { EULER_GAMMA } from '../../../math/constants';
import { sampleIndices } from '../../../math/sample';
import { KahanSum } from '../../../math/sum';

/** 순수 계산. DOM, d3, three를 import 하지 않는다. */

export const MAX_N = 1_000_000;
export const MAX_POINTS = 400;

export interface HarmonicPoint {
  k: number;
  /** 부분합 S_k */
  sum: number;
  /** 점근식 ln k + γ */
  asymptotic: number;
}

export interface HarmonicData {
  n: number;
  /** 그래프용으로 솎아 낸 점 (n이 크면 로그 간격) */
  points: HarmonicPoint[];
  /** k = n 에서의 값 */
  final: HarmonicPoint;
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
  return { n, points, final };
}

export const harmonicModel: SceneModel<HarmonicData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_N, Math.max(1, Math.floor(raw))) : 1;
    return harmonicPartialSums(n);
  },
};
