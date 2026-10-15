import type { SceneModel } from '../../../contracts';

/**
 * Linear map T: R^2 -> R^2 for four preset 2x2 matrices, drawn as a grid
 * transformation. Pure computation: no DOM, d3, or three.
 */

export type DimensionRankPreset = 'identity' | 'rank1' | 'projection' | 'zero';

/** Preset key -> 2x2 matrix stored as rows [[a, b], [c, d]]. */
export const dimensionRankPresets: Record<DimensionRankPreset, [[number, number], [number, number]]> = {
  identity: [
    [1, 0],
    [0, 1],
  ],
  rank1: [
    [1, 2],
    [2, 4],
  ],
  projection: [
    [1, 0],
    [0, 0],
  ],
  zero: [
    [0, 0],
    [0, 0],
  ],
};

function isPresetKey(key: string): key is DimensionRankPreset {
  return key === 'identity' || key === 'rank1' || key === 'projection' || key === 'zero';
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface DimensionRankData {
  /** Resolved preset key (unknown keys fall back to 'identity'). */
  preset: DimensionRankPreset;
  /** Matrix rows [[a, b], [c, d]]. */
  matrix: [[number, number], [number, number]];
  rank: number;
  nullity: number;
  /** Normalized kernel direction for rank 1; null when rank is 2 or 0. */
  kernelDir: Vec2 | null;
  /** Normalized first nonzero column for rank 1; null otherwise. */
  imageDir: Vec2 | null;
  /** Integer lattice points in [-2, 2]^2 before the map. */
  originalGrid: Vec2[];
  /** Same points after applying the matrix. */
  transformedGrid: Vec2[];
  /** Transformed unit-square corners, for a closed outline. */
  transformedSquare: Vec2[];
}

function norm2(v: Vec2): Vec2 {
  const n = Math.hypot(v.x, v.y);
  return n === 0 ? { x: 0, y: 0 } : { x: v.x / n, y: v.y / n };
}

function apply(m: [[number, number], [number, number]], p: Vec2): Vec2 {
  const [[a, b], [c, d]] = m;
  return { x: a * p.x + b * p.y, y: c * p.x + d * p.y };
}

function computeRank(m: [[number, number], [number, number]]): number {
  const [[a, b], [c, d]] = m;
  if (a === 0 && b === 0 && c === 0 && d === 0) return 0;
  if (a * d - b * c !== 0) return 2;
  return 1;
}

export function dimensionRankData(preset: string): DimensionRankData {
  const key: DimensionRankPreset = isPresetKey(preset) ? preset : 'identity';
  const matrix = dimensionRankPresets[key];
  const [[a, b], [c, d]] = matrix;
  const rank = computeRank(matrix);
  const nullity = 2 - rank;

  // Kernel direction for rank 1: solve a*x + b*y = 0 via (-b, a), normalized.
  let kernelDir: Vec2 | null = null;
  if (rank === 1) {
    const dir = a !== 0 || b !== 0 ? { x: -b, y: a } : { x: -d, y: c };
    kernelDir = norm2(dir);
  }

  // Image direction for rank 1: first nonzero column, normalized.
  let imageDir: Vec2 | null = null;
  if (rank === 1) {
    const col1 = { x: a, y: c };
    const col2 = { x: b, y: d };
    const col = col1.x !== 0 || col1.y !== 0 ? col1 : col2;
    imageDir = norm2(col);
  }

  const originalGrid: Vec2[] = [];
  for (let ix = -2; ix <= 2; ix++) {
    for (let iy = -2; iy <= 2; iy++) {
      originalGrid.push({ x: ix, y: iy });
    }
  }
  const transformedGrid = originalGrid.map((p) => apply(matrix, p));
  const transformedSquare = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ].map((p) => apply(matrix, p));

  return { preset: key, matrix, rank, nullity, kernelDir, imageDir, originalGrid, transformedGrid, transformedSquare };
}

export const dimensionRankModel: SceneModel<DimensionRankData> = {
  compute(state) {
    return dimensionRankData(String(state['preset'] ?? 'identity'));
  },
};
