import { describe, expect, it } from 'vitest';
import {
  dimensionRankData,
  dimensionRankModel,
  dimensionRankPresets,
} from '../src/chapters/limits/models/dimension-rank';

const SQRT5 = Math.sqrt(5);

describe('dimension-rank model', () => {
  it('identity: rank 2, nullity 0, trivial kernel', () => {
    const d = dimensionRankData('identity');
    expect(d.preset).toBe('identity');
    expect(d.rank).toBe(2);
    expect(d.nullity).toBe(0);
    expect(d.rank + d.nullity).toBe(2);
    expect(d.kernelDir).toBeNull();
    expect(d.imageDir).toBeNull();
  });

  it('identity transformed grid equals the original points', () => {
    const d = dimensionRankData('identity');
    expect(d.transformedGrid).toHaveLength(d.originalGrid.length);
    expect(d.transformedGrid).toEqual(d.originalGrid);
    expect(d.originalGrid).toHaveLength(25);
  });

  it('rank1: rank 1, nullity 1, kernel (-2, 1)/sqrt(5) satisfies M*k = 0', () => {
    const d = dimensionRankData('rank1');
    expect(d.rank).toBe(1);
    expect(d.nullity).toBe(1);
    const k = d.kernelDir;
    expect(k).not.toBeNull();
    // direction (-2, 1)/sqrt(5) up to sign: parallel to it, i.e. dot product = +/-1
    const dot = k!.x * (-2 / SQRT5) + k!.y * (1 / SQRT5);
    expect(Math.abs(dot)).toBeCloseTo(1, 12);
    expect(Math.hypot(k!.x, k!.y)).toBeCloseTo(1, 12);
    const [[a, b], [c, dd]] = d.matrix;
    expect(a * k!.x + b * k!.y).toBeCloseTo(0, 12);
    expect(c * k!.x + dd * k!.y).toBeCloseTo(0, 12);
    // image direction: first nonzero column (1, 2), normalized
    const img = d.imageDir;
    expect(img).not.toBeNull();
    expect(img!.x).toBeCloseTo(1 / SQRT5, 12);
    expect(img!.y).toBeCloseTo(2 / SQRT5, 12);
  });

  it('projection: rank 1, kernel direction (0, 1)', () => {
    const d = dimensionRankData('projection');
    expect(d.rank).toBe(1);
    expect(d.nullity).toBe(1);
    const k = d.kernelDir;
    expect(k).not.toBeNull();
    expect(k!.x).toBeCloseTo(0, 12);
    expect(Math.abs(k!.y)).toBeCloseTo(1, 12);
    const img = d.imageDir;
    expect(img).not.toBeNull();
    expect(img!.x).toBeCloseTo(1, 12);
    expect(img!.y).toBeCloseTo(0, 12);
  });

  it('zero: rank 0, nullity 2, everything maps to the origin', () => {
    const d = dimensionRankData('zero');
    expect(d.rank).toBe(0);
    expect(d.nullity).toBe(2);
    expect(d.kernelDir).toBeNull();
    expect(d.imageDir).toBeNull();
    expect(d.transformedGrid.every((p) => p.x === 0 && p.y === 0)).toBe(true);
  });

  it('unknown preset falls back to identity', () => {
    const d = dimensionRankData('nope');
    expect(d.preset).toBe('identity');
    expect(d.rank).toBe(2);
    expect(d.nullity).toBe(0);
  });

  it('model compute reads state[preset], defaulting to identity', async () => {
    const d1 = await dimensionRankModel.compute({});
    expect(d1.preset).toBe('identity');
    const d2 = await dimensionRankModel.compute({ preset: 'zero' });
    expect(d2.preset).toBe('zero');
    const d3 = await dimensionRankModel.compute({ preset: 'bogus' });
    expect(d3.preset).toBe('identity');
  });

  it('preset matrices match the specification', () => {
    expect(dimensionRankPresets.identity).toEqual([
      [1, 0],
      [0, 1],
    ]);
    expect(dimensionRankPresets.rank1).toEqual([
      [1, 2],
      [2, 4],
    ]);
    expect(dimensionRankPresets.projection).toEqual([
      [1, 0],
      [0, 0],
    ]);
    expect(dimensionRankPresets.zero).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });
});

describe('proof arithmetic for rank-nullity-3x2', () => {
  it('(-1, 2, -1) is in the kernel of [[1,2,3],[4,5,6]]', () => {
    const k = [-1, 2, -1] as const;
    const row1 = [1, 2, 3] as const;
    const row2 = [4, 5, 6] as const;
    const dot = (r: readonly number[], v: readonly number[]): number =>
      r[0]! * v[0]! + r[1]! * v[1]! + r[2]! * v[2]!;
    expect(dot(row1, k)).toBe(0);
    expect(dot(row2, k)).toBe(0);
  });

  it('rows (1,2,3) and (4,5,6) are linearly independent', () => {
    // 4*(1,2,3) - (4,5,6) = (0,-3,-6) != (0,0,0): neither row is a scalar multiple of the other
    const rest = [4 * 1 - 4, 4 * 2 - 5, 4 * 3 - 6];
    expect(rest.some((v) => v !== 0)).toBe(true);
  });
});
