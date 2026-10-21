import type { SceneModel } from '../../../contracts';

/**
 * Absolute vs conditional convergence. Pure computation: no DOM, d3, or three.
 *
 *   abs:   a_k = (-1)^k / k^2  — |a_k| sums to pi^2/6, a_k sums to -pi^2/12
 *   cond:  a_k = (-1)^k / k    — |a_k| is the divergent harmonic series,
 *                                a_k sums to -ln 2 (alternating series test)
 */

type AbsSeries = 'abs' | 'cond';

const MAX_N = 200;

export interface AbsoluteData {
  series: AbsSeries;
  n: number;
  /** S_k: partial sums of sum a_j, k = 1..n */
  signed: number[];
  /** T_k: partial sums of sum |a_j|, k = 1..n */
  absolute: number[];
  /** Limit of S_n: -pi^2/12 for abs, -ln 2 for cond */
  signedLimit: number;
  /** Limit of T_n when it converges: pi^2/6 for abs, null for the divergent cond case */
  absoluteLimit: number | null;
}

export function absoluteData(series: AbsSeries, n: number): AbsoluteData {
  const signed: number[] = [];
  const absolute: number[] = [];
  let s = 0;
  let t = 0;
  for (let k = 1; k <= n; k++) {
    const a = (k % 2 === 0 ? 1 : -1) / (series === 'abs' ? k * k : k);
    s += a;
    t += Math.abs(a);
    signed.push(s);
    absolute.push(t);
  }
  return {
    series,
    n,
    signed,
    absolute,
    signedLimit: series === 'abs' ? (-Math.PI * Math.PI) / 12 : -Math.LN2,
    absoluteLimit: series === 'abs' ? (Math.PI * Math.PI) / 6 : null,
  };
}

export const absoluteModel: SceneModel<AbsoluteData> = {
  compute(state) {
    const raw = String(state['series'] ?? '');
    const series: AbsSeries = raw === 'cond' ? 'cond' : 'abs';
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? Math.min(MAX_N, Math.max(1, Math.floor(nRaw))) : 1;
    return absoluteData(series, n);
  },
};
