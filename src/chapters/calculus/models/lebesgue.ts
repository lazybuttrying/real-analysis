import type { SceneModel } from '../../../contracts';

/**
 * Lebesgue's idea: measure a set by covering it, not by slicing the domain.
 * The rationals in [0,1] are enumerated (by denominator, then numerator,
 * skipping duplicates); the k-th rational gets an interval of length
 * eps/2^k. Total covered length = eps * (1 - 2^{-K}) < eps for every eps > 0,
 * so m(Q cap [0,1]) = 0 — while every Riemann upper sum of the Dirichlet
 * function is stuck at 1 and every lower sum at 0.
 * Pure computation: no DOM, d3, or three.
 */

export interface RationalCover {
  /** The rational number. */
  r: number;
  /** 1-based index in the enumeration. */
  k: number;
  x0: number;
  x1: number;
  length: number;
}

/** First K rationals in [0,1], enumerated by denominator then numerator. */
export function enumerateRationals(K: number): Array<{ r: number; k: number }> {
  const seen = new Set<string>();
  const out: Array<{ r: number; k: number }> = [];
  const count = Math.max(1, Math.min(256, Math.round(K)));
  for (let q = 1; out.length < count; q++) {
    for (let p = 0; p <= q && out.length < count; p++) {
      const r = p / q;
      const dup = `${Math.round(r * 1e12)}`;
      if (seen.has(dup)) continue;
      seen.add(dup);
      out.push({ r, k: out.length + 1 });
    }
  }
  return out;
}

export interface LebesgueData {
  epsilon: number;
  K: number;
  covers: RationalCover[];
  /** Sum of the cover lengths = eps * (1 - 2^{-K}). */
  totalLength: number;
  /** Riemann upper sum of the Dirichlet function on [0,1]: always 1. */
  riemannUpper: number;
  /** Riemann lower sum of the Dirichlet function on [0,1]: always 0. */
  riemannLower: number;
}

export function lebesgueData(epsilon: number, K: number): LebesgueData {
  const eps = Math.min(0.5, Math.max(0.001, epsilon));
  const rationals = enumerateRationals(K);
  const covers: RationalCover[] = rationals.map(({ r, k }) => {
    const length = eps / Math.pow(2, k);
    return { r, k, x0: r - length / 2, x1: r + length / 2, length };
  });
  const totalLength = covers.reduce((s, c) => s + c.length, 0);
  return {
    epsilon: eps,
    K: rationals.length,
    covers,
    totalLength,
    riemannUpper: 1,
    riemannLower: 0,
  };
}

export const lebesgueModel: SceneModel<LebesgueData> = {
  compute(state) {
    const rawE = Number(state['epsilon']);
    const epsilon = Number.isFinite(rawE) ? rawE : 0.1;
    const rawK = Number(state['K']);
    const K = Number.isFinite(rawK) ? rawK : 16;
    return lebesgueData(epsilon, K);
  },
};
