import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * The Cauchy product of two series.
 *
 *   c_n = sum_{k=0}^{n} a_k b_{n-k},      C_N = sum_{n=0}^{N} c_n
 *
 * Two example pairs, both with a_k = b_k:
 *   'exp':        a_k = 1/k!      (sum e).  Mertens' theorem in action:
 *                 c_n = 2^n/n! and C_N -> e^2, exactly like A_N * B_N.
 *   'alternating': a_k = (-1)^k/sqrt(k+1)  (Leibniz-convergent).
 *                 |c_n| >= 2(n+1)/(n+2) >= 1 for all n (AM-GM), so the
 *                 Cauchy product diverges: absolute convergence of one
 *                 factor is genuinely needed in Mertens' theorem.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** The two example pairs. */
export type CauchyPair = 'exp' | 'alternating';

export const PAIR_OPTIONS: readonly CauchyPair[] = ['exp', 'alternating'];

/** Slider bounds for n: how many terms c_0..c_n are shown. */
export const N_MIN = 1;
export const N_MAX = 30;
export const N_INIT = 10;

export const PAIR_INIT: CauchyPair = 'exp';

export function clampN(raw: unknown): number {
  return clampNumber(raw, N_MIN, N_MAX, N_INIT, true);
}

export function parsePair(raw: unknown): CauchyPair {
  if (raw === 'exp' || raw === 'alternating') return raw;
  return PAIR_INIT;
}

/** The k-th coefficient a_k = b_k of the chosen pair. 30! fits in float64. */
export function pairTerm(pair: CauchyPair, k: number): number {
  if (pair === 'exp') {
    let f = 1;
    for (let i = 2; i <= k; i++) f *= i;
    return 1 / f;
  }
  return (k % 2 === 0 ? 1 : -1) / Math.sqrt(k + 1);
}

/** The n-th Cauchy-product term c_n = sum_{k=0}^{n} a_k b_{n-k}. */
export function cauchyTerm(pair: CauchyPair, n: number): number {
  let s = 0;
  for (let k = 0; k <= n; k++) s += pairTerm(pair, k) * pairTerm(pair, n - k);
  return s;
}

/** c_0..c_n. */
export function cauchyTerms(pair: CauchyPair, n: number): number[] {
  const nn = clampN(n);
  const out: number[] = new Array<number>(nn + 1);
  for (let i = 0; i <= nn; i++) out[i] = cauchyTerm(pair, i);
  return out;
}

/** Prefix sums of a term list. */
export function partialSums(terms: readonly number[]): number[] {
  const out: number[] = new Array<number>(terms.length);
  let s = 0;
  for (let i = 0; i < terms.length; i++) {
    s += terms[i] ?? 0;
    out[i] = s;
  }
  return out;
}

/**
 * A_N * B_N for the pair: the ordinary product of the two partial sums
 * sum_{k=0}^{N} a_k times sum_{k=0}^{N} b_k.
 */
export function productOfPartials(pair: CauchyPair, n: number): number {
  const nn = clampN(n);
  let a = 0;
  let b = 0;
  for (let k = 0; k <= nn; k++) {
    a += pairTerm(pair, k);
    b += pairTerm(pair, k);
  }
  return a * b;
}

/**
 * The AM-GM lower bound |c_n| >= 2(n+1)/(n+2) for the 'alternating' pair:
 * (k+1)(n-k+1) <= ((n+2)/2)^2, so each of the n+1 summands
 * 1/sqrt((k+1)(n-k+1)) >= 2/(n+2).
 */
export function alternatingAbsBound(n: number): number {
  return (2 * (n + 1)) / (n + 2);
}

/** The limit C_N -> e^2 for the 'exp' pair; null where there is no limit. */
export function pairLimit(pair: CauchyPair): number | null {
  return pair === 'exp' ? Math.E * Math.E : null;
}

/** One cell of the a_k * b_j lattice, k + j = d <= n (the c_d diagonal). */
export interface LatticeCell {
  k: number;
  j: number;
  d: number;
  value: number;
}

export interface CauchyProductData {
  pair: CauchyPair;
  n: number;
  /** c_0..c_n. */
  terms: number[];
  /** C_0..C_n, the Cauchy-product partial sums. */
  partials: number[];
  /** A_k * B_k for k = 0..n. */
  prodPartials: number[];
  /** e^2 for 'exp', null for 'alternating'. */
  limit: number | null;
  /** The a_k*b_j lattice, k + j <= n; c_d is the sum of the d-th diagonal. */
  lattice: LatticeCell[];
}

export function cauchyProductData(pairRaw: unknown, nRaw: unknown): CauchyProductData {
  const pair = parsePair(pairRaw);
  const n = clampN(nRaw);
  const terms = cauchyTerms(pair, n);
  const partials = partialSums(terms);
  const prodPartials: number[] = new Array<number>(n + 1);
  let a = 0;
  let b = 0;
  for (let k = 0; k <= n; k++) {
    a += pairTerm(pair, k);
    b += pairTerm(pair, k);
    prodPartials[k] = a * b;
  }
  const lattice: LatticeCell[] = [];
  for (let d = 0; d <= n; d++) {
    for (let k = 0; k <= d; k++) {
      const j = d - k;
      lattice.push({ k, j, d, value: pairTerm(pair, k) * pairTerm(pair, j) });
    }
  }
  return {
    pair,
    n,
    terms,
    partials,
    prodPartials,
    limit: pairLimit(pair),
    lattice,
  };
}

export const cauchyProductModel: SceneModel<CauchyProductData> = {
  compute(state) {
    return cauchyProductData(state['pair'], state['n']);
  },
};
