import type { SceneModel } from '../../../contracts';

/**
 * Abel's test: if sum a_k converges and (b_k) is monotone and bounded,
 * then sum a_k b_k converges. Pure computation: no DOM, d3, or three.
 *
 * Two examples, chosen so that Dirichlet's test does NOT apply directly
 * (b_k does not tend to 0) but Abel's test does:
 *
 *  - 'shifted': a_k = (-1)^k/k (converges by Leibniz), b_k = 2 + 1/k
 *    decreasing, bounded, b_k -> 2 != 0. Exact limit: 2*sum(-1)^k/k +
 *    sum(-1)^k/k^2 = -2*ln(2) - pi^2/12 ~= -2.20876.
 *  - 'scaled':  a_k = (-1)^k/sqrt(k) (converges conditionally),
 *    b_k = k/(k+1) increasing, bounded, b_k -> 1 != 0.
 */

type AbelExample = 'shifted' | 'scaled';

export const MIN_N = 10;
export const MAX_N = 500;
export const DEFAULT_N = 120;
export const DEFAULT_EXAMPLE: AbelExample = 'shifted';

/** Terms used to estimate the limit line drawn in the scene. */
export const LIMIT_TERMS = 600;

export function aTerm(example: AbelExample, k: number): number {
  const sign = k % 2 === 0 ? 1 : -1;
  return example === 'shifted' ? sign / k : sign / Math.sqrt(k);
}

export function bTerm(example: AbelExample, k: number): number {
  return example === 'shifted' ? 2 + 1 / k : k / (k + 1);
}

/** Exact limit of the weighted series when a closed form is known. */
export function exactLimit(example: AbelExample): number | null {
  if (example === 'shifted') {
    // sum (-1)^k/k * (2 + 1/k) = 2*(-ln 2) + (-eta(2)) = -2 ln 2 - pi^2/12
    return -2 * Math.log(2) - (Math.PI * Math.PI) / 12;
  }
  return null;
}

/** b_k -> b ( != 0 ), the nonzero monotone limit that defeats Dirichlet. */
function weightLimit(example: AbelExample): number {
  return example === 'shifted' ? 2 : 1;
}

/** Partial sums S_N = sum_{k=1}^{N} a_k b_k, for N = 1..n. */
export function weightedPartialSums(example: AbelExample, n: number): number[] {
  const sums: number[] = [];
  let acc = 0;
  for (let k = 1; k <= n; k++) {
    acc += aTerm(example, k) * bTerm(example, k);
    sums.push(acc);
  }
  return sums;
}

/** Raw partial sums A_N = sum_{k=1}^{N} a_k of the converging factor series. */
export function rawPartialSums(example: AbelExample, n: number): number[] {
  const sums: number[] = [];
  let acc = 0;
  for (let k = 1; k <= n; k++) {
    acc += aTerm(example, k);
    sums.push(acc);
  }
  return sums;
}

/** The monotone bounded weight sequence b_1..b_n. */
export function weightSequence(example: AbelExample, n: number): number[] {
  const weights: number[] = [];
  for (let k = 1; k <= n; k++) weights.push(bTerm(example, k));
  return weights;
}

export interface AbelTestData {
  /** Number of partial sums shown. */
  n: number;
  example: AbelExample;
  /** S_1..S_n of a_k b_k. */
  partialSums: number[];
  /** A_1..A_n of a_k. */
  aSums: number[];
  /** b_1..b_n. */
  weights: number[];
  /** Nonzero limit of (b_k): the reason Dirichlet does not apply. */
  bLimit: number;
  /** Value of the dashed limit line: exact when known, else S_LIMIT_TERMS. */
  limit: number;
  /** Whether the drawn limit line is an exact closed form. */
  limitExact: boolean;
}

export const abelTestModel: SceneModel<AbelTestData> = {
  compute(state) {
    const rawN = Number(state['n']);
    const n = Number.isFinite(rawN)
      ? Math.min(MAX_N, Math.max(MIN_N, Math.floor(rawN)))
      : DEFAULT_N;
    const rawExample = state['example'];
    const example: AbelExample =
      rawExample === 'scaled' || rawExample === 'shifted' ? rawExample : DEFAULT_EXAMPLE;
    const exact = exactLimit(example);
    const limitTerms = Math.max(LIMIT_TERMS, n);
    const longSums = weightedPartialSums(example, limitTerms);
    return {
      n,
      example,
      partialSums: longSums.slice(0, n),
      aSums: rawPartialSums(example, n),
      weights: weightSequence(example, n),
      bLimit: weightLimit(example),
      limit: exact ?? longSums[limitTerms - 1] ?? 0,
      limitExact: exact !== null,
    };
  },
};
