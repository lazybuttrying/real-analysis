import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Subsequences, live: a_n = (-1)^n + 1/n oscillates between two
 * gathering clouds. The even subsequence tends to 1 and the odd
 * subsequence tends to -1, which is exactly why a_n itself diverges.
 * A subsequence picks terms at strictly increasing indices n_k.
 * Pure computation: no DOM, d3, or three.
 */

export type SubseqPart = 'all' | 'even' | 'odd';

export const SUBSEQ_PART_INIT: SubseqPart = 'all';

export interface SubseqPoint {
  n: number;
  value: number;
  /** True when this term belongs to the selected part. */
  selected: boolean;
}

export interface SubsequenceData {
  part: SubseqPart;
  terms: number;
  points: readonly SubseqPoint[];
  /** Limit of the selected part: 1 (even), -1 (odd), null (all: none). */
  partLimit: number | null;
}

export function subseqValue(n: number): number {
  return (n % 2 === 0 ? 1 : -1) + 1 / n;
}

function parsePart(raw: unknown): SubseqPart {
  if (raw === 'all' || raw === 'even' || raw === 'odd') return raw;
  return SUBSEQ_PART_INIT;
}

function clampTerms(v: number): number {
  if (!Number.isFinite(v)) return 24;
  return Math.max(6, Math.min(48, Math.round(v)));
}

export function subsequenceData(part: SubseqPart, terms: number): SubsequenceData {
  const t = clampTerms(terms);
  const points: SubseqPoint[] = [];
  for (let n = 1; n <= t; n++) {
    const selected =
      part === 'all' ? true : part === 'even' ? n % 2 === 0 : n % 2 === 1;
    points.push({ n, value: subseqValue(n), selected });
  }
  return {
    part,
    terms: t,
    points,
    partLimit: part === 'even' ? 1 : part === 'odd' ? -1 : null,
  };
}

export const subsequenceModel: SceneModel<SubsequenceData> = {
  compute(state: ControlState): SubsequenceData {
    return subsequenceData(parsePart(state['part']), Number(state['n']));
  },
};
