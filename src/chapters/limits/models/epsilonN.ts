import type { SceneModel } from '../../../contracts';

/**
 * The epsilon-N definition made touchable: three demo sequences, an epsilon
 * band, and the first N after which the whole tail stays inside the band.
 * Pure computation. Does not import the DOM, d3, or three.
 */

export const MAX_K = 80;

export type SequenceKey = 'inv' | 'alt' | 'frac';

/** Maps the select-control option strings (shown verbatim in the UI) to sequence keys. */
export function sequenceKey(option: unknown): SequenceKey {
  switch (option) {
    case '(−1)^n / n':
      return 'alt';
    case 'n / (n+1)':
      return 'frac';
    default:
      return 'inv';
  }
}

export function sequenceTerm(id: SequenceKey, k: number): number {
  switch (id) {
    case 'inv':
      return 1 / k;
    case 'alt':
      return (k % 2 === 0 ? 1 : -1) / k;
    case 'frac':
      return k / (k + 1);
  }
}

export function sequenceLimit(id: SequenceKey): number {
  return id === 'frac' ? 1 : 0;
}

export interface SequenceTerm {
  k: number;
  value: number;
}

export interface EpsilonNData {
  id: SequenceKey;
  limit: number;
  epsilon: number;
  terms: SequenceTerm[];
  /** Smallest N with |a_k − L| < ε for every k > N, or null when MAX_K terms are not enough. */
  firstN: number | null;
}

export function epsilonNTail(id: SequenceKey, epsilon: number, maxK: number = MAX_K): EpsilonNData {
  const limit = sequenceLimit(id);
  const terms: SequenceTerm[] = [];
  for (let k = 1; k <= maxK; k++) terms.push({ k, value: sequenceTerm(id, k) });

  let firstN: number | null = null;
  outer: for (let n = 0; n < maxK; n++) {
    for (let k = n + 1; k <= maxK; k++) {
      const term = terms[k - 1];
      if (term === undefined || Math.abs(term.value - limit) >= epsilon) continue outer;
    }
    firstN = n;
    break;
  }
  return { id, limit, epsilon, terms, firstN };
}

export const epsilonNModel: SceneModel<EpsilonNData> = {
  compute(state) {
    const id = sequenceKey(state['seq']);
    const raw = Number(state['epsilon']);
    const epsilon = Number.isFinite(raw) ? Math.min(1, Math.max(0.005, raw)) : 0.1;
    return epsilonNTail(id, epsilon);
  },
};
