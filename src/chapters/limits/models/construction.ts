import type { SceneModel } from '../../../contracts';

/**
 * Building the reals from the rationals: a real number is an equivalence
 * class of Cauchy sequences of rationals. The running example fills the
 * hole at sqrt(2) with its decimal truncations
 * x_n = floor(sqrt(2) * 10^n) / 10^n (all rational), alongside the
 * Babylonian iterates for the "different sequence, same number" view.
 * Exact fractions are tracked with BigInt. Pure computation: no DOM, d3, or three.
 */

const MAX_TERMS = 6;

interface ConstructionTerm {
  n: number;
  /** Exact numerator/denominator of the rational term */
  p: bigint;
  q: bigint;
  value: number;
  /** |x_n − √2| */
  error: number;
}

/** Decimal truncations of sqrt(2): x_n = floor(sqrt(2) * 10^n) / 10^n. */
export function decimalTruncations(count: number): ConstructionTerm[] {
  const terms: ConstructionTerm[] = [];
  for (let n = 0; n <= count; n++) {
    const q = 10n ** BigInt(n);
    const p = BigInt(Math.floor(Math.SQRT2 * 10 ** n));
    const value = Number(p) / Number(q);
    terms.push({ n, p, q, value, error: Math.abs(value - Math.SQRT2) });
  }
  return terms;
}

/** Babylonian (Heron) iteration for sqrt(2): x_{n+1} = (x_n + 2/x_n) / 2. */
export function newtonTerms(count: number): ConstructionTerm[] {
  const terms: ConstructionTerm[] = [];
  let p = 1n;
  let q = 1n;
  const push = (n: number): void => {
    const value = Number(p) / Number(q);
    terms.push({ n, p, q, value, error: Math.abs(value - Math.SQRT2) });
  };
  push(0);
  for (let n = 1; n <= count; n++) {
    // (p/q + 2q/p) / 2 = (p^2 + 2q^2) / (2pq)
    const nextP = p * p + 2n * q * q;
    const nextQ = 2n * p * q;
    p = nextP;
    q = nextQ;
    push(n);
  }
  return terms;
}

export interface ConstructionData {
  seq: 'decimal' | 'newton';
  n: number;
  terms: ConstructionTerm[];
}

export const constructionModel: SceneModel<ConstructionData> = {
  compute(state) {
    const seq = state['seq'] === 'newton' ? 'newton' : 'decimal';
    const raw = Number(state['n']);
    const n = Number.isFinite(raw) ? Math.min(MAX_TERMS, Math.max(1, Math.floor(raw))) : 4;
    const terms = seq === 'newton' ? newtonTerms(n) : decimalTruncations(n);
    return { seq, n, terms };
  },
};
