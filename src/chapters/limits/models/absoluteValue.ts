import type { ControlState, SceneModel } from '../../../contracts';

/**
 * The absolute value, live: |x| is the distance from x to 0 on the
 * number line. The scene checks the triangle inequality
 * |x + y| <= |x| + |y| with two sliding points, and the product rule
 * |xy| = |x| |y|. Pure computation: no DOM, d3, or three.
 */

export interface AbsoluteValueData {
  x: number;
  y: number;
  sum: number;
  absX: number;
  absY: number;
  absSum: number;
  /** |x| + |y|, the triangle-inequality ceiling. */
  ceiling: number;
  /** ceiling - absSum, always >= 0. */
  gap: number;
  /** |xy|. */
  absProduct: number;
  /** |x| |y|, always equal to absProduct. */
  productOfAbs: number;
}

export function absVal(v: number): number {
  return Math.abs(v);
}

function clampCoord(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(-3, Math.min(3, v));
}

export function absoluteValueData(x: number, y: number): AbsoluteValueData {
  const xx = clampCoord(x);
  const yy = clampCoord(y);
  const sum = xx + yy;
  const absX = Math.abs(xx);
  const absY = Math.abs(yy);
  const absSum = Math.abs(sum);
  return {
    x: xx,
    y: yy,
    sum,
    absX,
    absY,
    absSum,
    ceiling: absX + absY,
    gap: absX + absY - absSum,
    absProduct: Math.abs(xx * yy),
    productOfAbs: absX * absY,
  };
}

export const absoluteValueModel: SceneModel<AbsoluteValueData> = {
  compute(state: ControlState): AbsoluteValueData {
    return absoluteValueData(Number(state['x']), Number(state['y']));
  },
};
