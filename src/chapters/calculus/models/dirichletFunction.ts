import type { SceneModel } from '../../../contracts';

/**
 * Tao, Analysis I, Section 11.7: the Dirichlet function f = 1_Q on [0,1]
 * is not Riemann integrable. Every subinterval of [0,1] contains a rational
 * (so sup f = 1) and an irrational (so inf f = 0); hence the upper sum
 * U(f, P) = 1 and the lower sum L(f, P) = 0 for every partition P, and no
 * refinement ever closes the gap. Pure computation: no DOM, d3, or three.
 */

export const N_MIN = 1;
export const N_MAX = 32;
export const N_INIT = 8;
/** Rationals p/q with 0 <= p <= q and q <= MAX_DENOM are exported as dots. */
export const MAX_DENOM = 12;

interface DirichletDot {
  x: number;
  p: number;
  q: number;
}

interface DirichletInterval {
  x0: number;
  x1: number;
}

export interface DirichletData {
  n: number;
  /** U(f, P_n) = sum 1 * (1/n) = 1: sup is 1 on every subinterval. */
  upper: number;
  /** L(f, P_n) = sum 0 * (1/n) = 0: inf is 0 on every subinterval. */
  lower: number;
  /** upper - lower = 1 for every n. */
  gap: number;
  /** The uniform partition P_n of [0,1]. */
  partition: DirichletInterval[];
  /** Reduced fractions p/q in [0,1] with q <= MAX_DENOM, sorted by x. */
  dots: DirichletDot[];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function rationalsInUnit(maxDenom: number): DirichletDot[] {
  const dots: DirichletDot[] = [];
  for (let q = 1; q <= maxDenom; q++) {
    for (let p = 0; p <= q; p++) {
      if (gcd(p, q) === 1) dots.push({ x: p / q, p, q });
    }
  }
  dots.sort((a, b) => a.x - b.x);
  return dots;
}

export function dirichletData(n: number): DirichletData {
  const nn = Math.max(N_MIN, Math.min(N_MAX, Math.round(n)));
  const partition: DirichletInterval[] = [];
  for (let k = 0; k < nn; k++) {
    partition.push({ x0: k / nn, x1: (k + 1) / nn });
  }
  return {
    n: nn,
    upper: 1,
    lower: 0,
    gap: 1,
    partition,
    dots: rationalsInUnit(MAX_DENOM),
  };
}

export const dirichletFunctionModel: SceneModel<DirichletData> = {
  compute(state) {
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? raw : N_INIT;
    return dirichletData(n);
  },
};
