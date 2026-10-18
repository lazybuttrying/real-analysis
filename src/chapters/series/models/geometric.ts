import type { SceneModel } from '../../../contracts';

/**
 * Pure computation. Does not import the DOM, d3, or three.
 * Geometric series as a subdivided unit square: 1/2 + 1/4 + 1/8 + ... = 1.
 * Each step fills half of whatever rectangle is still empty, alternating
 * the split direction, so the unfilled gap spirals into a corner and
 * its area is exactly (1/2)^steps.
 */

export const MAX_STEPS = 12;

export const LIMIT = 1;

interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface Piece extends Rect {
  step: number;
  value: number;
  label: string;
}

export interface GeometricData {
  steps: number;
  pieces: Piece[];
  /** The still-empty rectangle after all steps */
  gap: Rect;
  /** Gap area: exactly (1/2)^steps */
  gapValue: number;
  sum: number;
  limit: number;
  error: number;
}

export function geometricFill(steps: number): GeometricData {
  const pieces: Piece[] = [];
  let region: Rect = { x0: 0, y0: 0, x1: 1, y1: 1 };
  let sum = 0;
  for (let s = 0; s < steps; s++) {
    let piece: Piece;
    if (s % 2 === 0) {
      // Vertical split: fill the left half, keep the right half.
      const mid = (region.x0 + region.x1) / 2;
      piece = { x0: region.x0, y0: region.y0, x1: mid, y1: region.y1, step: s + 1, value: 0, label: '' };
      region = { x0: mid, y0: region.y0, x1: region.x1, y1: region.y1 };
    } else {
      // Horizontal split: fill the top half, keep the bottom half.
      const mid = (region.y0 + region.y1) / 2;
      piece = { x0: region.x0, y0: mid, x1: region.x1, y1: region.y1, step: s + 1, value: 0, label: '' };
      region = { x0: region.x0, y0: region.y0, x1: region.x1, y1: mid };
    }
    piece.value = Math.pow(2, -(s + 1));
    piece.label = '1/' + Math.pow(2, s + 1);
    pieces.push(piece);
    sum += piece.value;
  }
  const gapValue = Math.pow(2, -steps);
  return { steps, pieces, gap: region, gapValue, sum, limit: LIMIT, error: gapValue };
}

export const geometricModel: SceneModel<GeometricData> = {
  compute(state) {
    const raw = Number(state['n']);
    const steps = Number.isFinite(raw) ? Math.min(MAX_STEPS, Math.max(1, Math.floor(raw))) : 1;
    return geometricFill(steps);
  },
};
