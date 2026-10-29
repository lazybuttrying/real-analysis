import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Bounded sequences, live: a sequence is bounded when some M has
 * |a_n| <= M for every n. Three examples:
 * - 'ratio': a_n = n / (n + 1), bounded by 1, sup 1 never attained.
 * - 'alt': a_n = (-1)^n, bounded by 1 but divergent.
 * - 'linear': a_n = n / 5, unbounded: no M works.
 * Pure computation: no DOM, d3, or three.
 */

export type BoundedKind = 'ratio' | 'alt' | 'linear';

export const BOUNDED_KIND_INIT: BoundedKind = 'ratio';

export interface BoundedData {
  kind: BoundedKind;
  terms: number;
  values: readonly number[];
  /** A bound M when bounded, null when unbounded. */
  bound: number | null;
  bounded: boolean;
  /** max |a_n| over the shown terms. */
  shownMax: number;
}

export function boundedValue(kind: BoundedKind, n: number): number {
  if (kind === 'ratio') return n / (n + 1);
  if (kind === 'alt') return n % 2 === 0 ? 1 : -1;
  return n / 5;
}

function parseKind(raw: unknown): BoundedKind {
  if (raw === 'ratio' || raw === 'alt' || raw === 'linear') return raw;
  return BOUNDED_KIND_INIT;
}

function clampTerms(v: number): number {
  if (!Number.isFinite(v)) return 20;
  return Math.max(5, Math.min(40, Math.round(v)));
}

export function boundedData(kind: BoundedKind, terms: number): BoundedData {
  const t = clampTerms(terms);
  const values: number[] = [];
  let shownMax = 0;
  for (let n = 1; n <= t; n++) {
    const v = boundedValue(kind, n);
    values.push(v);
    shownMax = Math.max(shownMax, Math.abs(v));
  }
  const bounded = kind !== 'linear';
  return {
    kind,
    terms: t,
    values,
    bound: bounded ? 1 : null,
    bounded,
    shownMax,
  };
}

export const boundedModel: SceneModel<BoundedData> = {
  compute(state: ControlState): BoundedData {
    return boundedData(parseKind(state['kind']), Number(state['n']));
  },
};
