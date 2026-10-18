import type { SceneModel } from '../../../contracts';

/**
 * The Euler product: for s > 1,
 *
 *   zeta(s) = sum_{n>=1} n^{-s} = prod_{p prime} 1 / (1 - p^{-s}).
 *
 * The sieve idea: zeta(s) * (1 - 2^{-s}) kills every even term, then
 * multiplying by (1 - 3^{-s}) kills every multiple of 3, and so on.
 * After sieving through the first k primes, only integers coprime to
 * p_1, ..., p_k survive; as k -> infinity the tail of the sum vanishes,
 * leaving the full product identity.
 *
 * This scene fixes s = 2 and tracks the partial products
 * P_k = prod_{i=1..k} 1 / (1 - p_i^{-2}), which increase toward
 * zeta(2) = pi^2 / 6 (the Basel value).
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Slider range for k; controls must match meta.ts. */
export const MIN_K = 1;
export const MAX_K = 15;
export const DEFAULT_K = 6;

/** The first 15 primes used by the sieve. */
export const PRIMES: readonly number[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

/** zeta(2) = pi^2 / 6, for the dashed asymptote line. */
export const ZETA2 = (Math.PI * Math.PI) / 6;

/** One Euler factor 1 / (1 - p^{-2}) for a prime p. */
export function eulerFactor(p: number): number {
  return 1 / (1 - 1 / (p * p));
}

/** P_k = prod_{i=1..k} 1 / (1 - p_i^{-2}), the k-th partial product. */
export function eulerProduct(k: number): number {
  let product = 1;
  for (let i = 0; i < k && i < PRIMES.length; i++) {
    product *= eulerFactor(PRIMES[i] as number);
  }
  return product;
}

interface EulerProductTerm {
  /** Index k, 1-based. */
  k: number;
  /** The k-th prime p_k. */
  prime: number;
  /** The Euler factor 1 / (1 - p_k^{-2}). */
  factor: number;
  /** P_k, the partial product up to p_k. */
  product: number;
  /** zeta(2) - P_k, the remaining error. */
  error: number;
}

export interface EulerProductData {
  /** Number of primes, clamped to [MIN_K, MAX_K]. */
  k: number;
  /** The primes used, p_1..p_k. */
  primes: readonly number[];
  /** Partial products P_1..P_k. */
  products: number[];
  /** Terms 1..k with per-prime detail. */
  terms: EulerProductTerm[];
  /** P_k, the partial product. */
  product: number;
  /** zeta(2) = pi^2/6. */
  zeta2: number;
  /** zeta(2) - P_k. */
  error: number;
}

export const eulerProductModel: SceneModel<EulerProductData> = {
  compute(state) {
    const raw = Number(state['k']);
    const k = Number.isFinite(raw)
      ? Math.min(MAX_K, Math.max(MIN_K, Math.floor(raw)))
      : DEFAULT_K;
    const primes = PRIMES.slice(0, k);
    const products: number[] = [];
    const terms: EulerProductTerm[] = [];
    let product = 1;
    for (let i = 0; i < k; i++) {
      const prime = PRIMES[i] as number;
      const factor = eulerFactor(prime);
      product *= factor;
      products.push(product);
      terms.push({ k: i + 1, prime, factor, product, error: ZETA2 - product });
    }
    return {
      k,
      primes,
      products,
      terms,
      product,
      zeta2: ZETA2,
      error: ZETA2 - product,
    };
  },
};
