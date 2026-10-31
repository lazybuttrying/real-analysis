import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Ordered fields, live. An ordered field carries a positive cone P
 * closed under addition and multiplication, with trichotomy: for each
 * a, exactly one of a in P, a = 0, -a in P holds. Two modes:
 * - 'q': the rationals with the usual cone. Sliders p, q > 0 verify the
 *   closure rules and that squares are positive.
 * - 'z7': trying to order Z_7 fails. Adding the positive element 1 to
 *   itself walks 1, 2, ..., 6, 0 — a sum of positives reaching 0, which
 *   the cone axioms forbid.
 * Pure computation: no DOM, d3, or three.
 */

export type OrderedFieldMode = 'q' | 'z7';

export const ORDERED_FIELD_MODE_INIT: OrderedFieldMode = 'q';

export interface OrderedFieldData {
  mode: OrderedFieldMode;
  p: number;
  q: number;
  sum: number;
  product: number;
  pSquare: number;
  /** Partial sums of 1 in Z_7: [0, 1, 2, 3, 4, 5, 6, 0]. */
  walk: readonly number[];
}

const WALK: readonly number[] = [0, 1, 2, 3, 4, 5, 6, 0];

function parseMode(raw: unknown): OrderedFieldMode {
  if (raw === 'q' || raw === 'z7') return raw;
  return ORDERED_FIELD_MODE_INIT;
}

function clampPositive(v: number, fallback: number): number {
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0.25, Math.min(2.5, v));
}

export function orderedFieldData(
  mode: OrderedFieldMode,
  pRaw: number,
  qRaw: number,
): OrderedFieldData {
  const p = clampPositive(pRaw, 1.25);
  const q = clampPositive(qRaw, 0.75);
  return {
    mode,
    p,
    q,
    sum: p + q,
    product: p * q,
    pSquare: p * p,
    walk: WALK,
  };
}

export const orderedFieldModel: SceneModel<OrderedFieldData> = {
  compute(state: ControlState): OrderedFieldData {
    return orderedFieldData(parseMode(state['mode']), Number(state['p']), Number(state['q']));
  },
};
