import type { SceneModel } from '../../../contracts';

/**
 * Lim sup and lim inf of a_n = (-1)^n (1 + 1/n).
 *
 * The model computes the first `n` terms, the exact limit values
 * (limsup = 1, liminf = -1), and the tail sup/inf sequences:
 * tailSup[N-1] = sup of { a_k : N <= k <= count }, similarly for tailInf.
 * Pure computation: no DOM, d3, or three.
 */

const MIN_TERMS = 2;
const MAX_TERMS = 60;
const DEFAULT_TERMS = 24;

/** The sequence value a_n = (-1)^n (1 + 1/n) for n >= 1. */
export function term(n: number): number {
  const sign = n % 2 === 0 ? 1 : -1;
  return sign * (1 + 1 / n);
}

interface SequencePoint {
  n: number;
  value: number;
}

export interface LimsupLiminfData {
  /** Number of terms shown. */
  count: number;
  /** a_1 .. a_count. */
  points: SequencePoint[];
  /** limsup of the sequence, exactly 1. */
  limsup: number;
  /** liminf of the sequence, exactly -1. */
  liminf: number;
  /**
   * tailSup[i] = sup of { a_k : i+1 <= k <= count }, i.e. the sup of the
   * tail starting at n = i+1. Nonincreasing in i.
   */
  tailSup: number[];
  /** tailInf[i] = inf of { a_k : i+1 <= k <= count }. Nondecreasing in i. */
  tailInf: number[];
}

export const limsupLiminfModel: SceneModel<LimsupLiminfData> = {
  compute(state) {
    const raw = Number(state['n']);
    const count = Number.isFinite(raw)
      ? Math.min(MAX_TERMS, Math.max(MIN_TERMS, Math.floor(raw)))
      : DEFAULT_TERMS;
    const points: SequencePoint[] = [];
    for (let n = 1; n <= count; n++) {
      points.push({ n, value: term(n) });
    }
    const tailSup: number[] = [];
    const tailInf: number[] = [];
    for (let start = 1; start <= count; start++) {
      let sup = -Infinity;
      let inf = Infinity;
      for (let n = start; n <= count; n++) {
        const value = term(n);
        if (value > sup) sup = value;
        if (value < inf) inf = value;
      }
      tailSup.push(sup);
      tailInf.push(inf);
    }
    return { count, points, limsup: 1, liminf: -1, tailSup, tailInf };
  },
};
