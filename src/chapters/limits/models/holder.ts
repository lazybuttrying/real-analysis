import type { SceneModel } from '../../../contracts';

/**
 * Holder's inequality, live: for conjugate exponents 1/p + 1/q = 1,
 *   sum |a_k b_k| <= (sum |a_k|^p)^{1/p} (sum |b_k|^q)^{1/q}.
 * The vectors are a = (1, 1/2, ..., 1/n) and b = (1, 1, ..., 1).
 * p = 2 (q = 2) is the Cauchy-Schwarz special case. As p -> 1+ the right
 * side collapses to (sum |a_k|) max |b_k| and the gap closes.
 * Pure computation: no DOM, d3, or three.
 */

export const HOLDER_P_MIN = 1.1;
export const HOLDER_P_MAX = 8;
export const HOLDER_P_INIT = 2;

export const HOLDER_N_MIN = 2;
export const HOLDER_N_MAX = 30;
export const HOLDER_N_INIT = 8;

export function conjugateExponent(p: number): number {
  return p / (p - 1);
}

export interface HolderData {
  p: number;
  q: number;
  n: number;
  a: number[];
  b: number[];
  /** sum |a_k b_k|: the harmonic number H_n here. */
  lhs: number;
  /** (sum |a_k|^p)^{1/p}. */
  rhsA: number;
  /** (sum |b_k|^q)^{1/q} = n^{1/q} here. */
  rhsB: number;
  /** rhsA * rhsB. */
  rhs: number;
  /** rhs - lhs >= 0. */
  gap: number;
  /** True when p = 2: the Cauchy-Schwarz case. */
  isCauchySchwarz: boolean;
}

function clampP(p: number): number {
  if (!Number.isFinite(p)) return HOLDER_P_INIT;
  return Math.max(HOLDER_P_MIN, Math.min(HOLDER_P_MAX, p));
}

function clampN(n: number): number {
  if (!Number.isFinite(n)) return HOLDER_N_INIT;
  return Math.max(HOLDER_N_MIN, Math.min(HOLDER_N_MAX, Math.round(n)));
}

function holderData(p: number, n: number): HolderData {
  const pp = clampP(p);
  const nn = clampN(n);
  const q = conjugateExponent(pp);
  const a: number[] = new Array(nn);
  const b: number[] = new Array(nn);
  let lhs = 0;
  let sumAp = 0;
  for (let k = 1; k <= nn; k++) {
    const ak = 1 / k;
    a[k - 1] = ak;
    b[k - 1] = 1;
    lhs += ak;
    sumAp += Math.pow(ak, pp);
  }
  const rhsA = Math.pow(sumAp, 1 / pp);
  const rhsB = Math.pow(nn, 1 / q);
  const rhs = rhsA * rhsB;
  return {
    p: pp,
    q,
    n: nn,
    a,
    b,
    lhs,
    rhsA,
    rhsB,
    rhs,
    gap: rhs - lhs,
    isCauchySchwarz: Math.abs(pp - 2) < 1e-9,
  };
}

export const holderModel: SceneModel<HolderData> = {
  compute(state) {
    const rawP = Number(state['p']);
    const rawN = Number(state['n']);
    return holderData(rawP, rawN);
  },
};
