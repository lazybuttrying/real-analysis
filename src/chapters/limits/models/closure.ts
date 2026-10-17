import type { ControlState, SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Closure and boundedness on the number line. For A in {(0,1), (0,1], {1/n}},
 * it lists the limit points the closure adds, and checks a bounding interval
 * [-m, m]. The "round-song": closed <=> contains its limit points <=>
 * equals its closure; closed + bounded <=> compact in R (Heine-Borel).
 * Pure computation: no DOM, d3, or three.
 */

export const CLOSURE_KINDS = ['open', 'halfclosed', 'reciprocal'] as const;
export type ClosureKind = (typeof CLOSURE_KINDS)[number];

export interface ClosureData {
  kind: ClosureKind;
  m: number;
  /** Limit points added by the closure (drawn red). */
  closureExtras: number[];
  /** sup |x| over A. */
  extent: number;
  /** Is [-m, m] wide enough to contain A? */
  boundedByM: boolean;
  /** Mathematical facts about A. */
  isClosed: boolean;
  isBounded: boolean;
  /** First terms of {1/n} for drawing (empty for the interval kinds). */
  terms: number[];
}

/** How many reciprocal terms the scene draws. */
export const RECIPROCAL_TERMS = 24;

export function closureKindOf(raw: unknown): ClosureKind {
  return raw === 'halfclosed' || raw === 'reciprocal' ? raw : 'open';
}

export function closureData(kind: ClosureKind, m: number): ClosureData {
  const terms =
    kind === 'reciprocal' ? Array.from({ length: RECIPROCAL_TERMS }, (_, i) => 1 / (i + 1)) : [];
  switch (kind) {
    case 'open':
      return { kind, m, closureExtras: [0, 1], extent: 1, boundedByM: m >= 1, isClosed: false, isBounded: true, terms };
    case 'halfclosed':
      return { kind, m, closureExtras: [0], extent: 1, boundedByM: m >= 1, isClosed: false, isBounded: true, terms };
    case 'reciprocal':
      return { kind, m, closureExtras: [0], extent: 1, boundedByM: m >= 1, isClosed: false, isBounded: true, terms };
  }
}

function clampM(raw: number): number {
  return clampNumber(raw, 0.5, 2.5, 1.5);
}

export const closureModel: SceneModel<ClosureData> = {
  compute(state: ControlState) {
    return closureData(closureKindOf(state['kind']), clampM(Number(state['m'] ?? 1.5)));
  },
};
