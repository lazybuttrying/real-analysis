import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Euclid's proof that there are infinitely many primes, by contradiction:
 * suppose p_1..p_k were ALL the primes; then N = p_1*...*p_k + 1 leaves
 * remainder 1 on division by every p_i, yet N >= 2 has a prime factor, which
 * cannot be on the list — a contradiction.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const CONTRADICTION_K_MIN = 1;
export const CONTRADICTION_K_MAX = 8;
export const CONTRADICTION_K_INIT = 4;

/** The first ten primes; the scene needs only the first eight. */
export const FIRST_PRIMES: readonly number[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export interface EuclidData {
  k: number;
  /** The first k primes — the hypothetically complete list. */
  primes: readonly number[];
  /** P = p_1 * ... * p_k. */
  product: number;
  /** N = P + 1. */
  n: number;
  /** N mod p_i for each of the first k primes (always 1). */
  remainders: readonly number[];
  /** The smallest prime factor of N, by trial division. */
  spf: number;
  /** Whether the smallest prime factor lies beyond the assumed-complete list. */
  spfIsNew: boolean;
  /** Prime factorization of N with multiplicity, in ascending order. */
  factors: readonly number[];
}

/** The smallest prime factor of n >= 2, by trial division up to sqrt(n). */
export function smallestPrimeFactor(n: number): number {
  if (n % 2 === 0) return 2;
  const limit = Math.floor(Math.sqrt(n));
  for (let d = 3; d <= limit; d += 2) {
    if (n % d === 0) return d;
  }
  return n;
}

/** Prime factorization of n >= 2 with multiplicity, in ascending order. */
export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let rest = n;
  while (rest > 1) {
    const p = smallestPrimeFactor(rest);
    factors.push(p);
    rest = Math.floor(rest / p);
  }
  return factors;
}

/**
 * The Euclid data for the first k primes (k rounded and clamped to [1, 8]).
 * Called by the scene model and directly by tests.
 */
export function euclidData(k: number): EuclidData {
  const kk = Math.round(
    clampNumber(k, CONTRADICTION_K_MIN, CONTRADICTION_K_MAX, CONTRADICTION_K_INIT),
  );
  const primes = FIRST_PRIMES.slice(0, kk);
  const product = primes.reduce((acc, p) => acc * p, 1);
  const n = product + 1;
  const remainders = primes.map((p) => n % p);
  const spf = smallestPrimeFactor(n);
  const factors = primeFactors(n);
  return {
    k: kk,
    primes,
    product,
    n,
    remainders,
    spf,
    spfIsNew: spf > primes[primes.length - 1]!,
    factors,
  };
}

export const contradictionModel: SceneModel<EuclidData> = {
  compute(state) {
    return euclidData(Number(state['k']));
  },
};
