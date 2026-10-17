import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_N,
  GRID_POINTS,
  MAX_N,
  MIN_N,
  compactLimit,
  compactMaxGap,
  compactTerm,
  diniModel,
  noncompactLimit,
  noncompactSupGap,
  noncompactTerm,
  type DiniData,
} from '../src/chapters/series/models/dini';

const compute = (state: ControlState): DiniData => diniModel.compute(state) as DiniData;

const compact8 = (): DiniData => compute({ n: 8, domain: 'compact' });
const noncompact20 = (): DiniData => compute({ n: 20, domain: 'noncompact' });

describe('dini: compact domain max gap is exactly 1/(n+1)', () => {
  it('compactMaxGap(8) = 1/9 ~= 0.1111', () => {
    expect(compactMaxGap(8)).toBeCloseTo(1 / 9, 12);
    expect(compactMaxGap(8)).toBeCloseTo(0.111111, 6);
  });

  it('compute reports maxGap = 1/(n+1)', () => {
    expect(compact8().maxGap).toBeCloseTo(1 / 9, 12);
    expect(compute({ n: 12, domain: 'compact' }).maxGap).toBeCloseTo(1 / 13, 12);
    expect(compute({ n: 20, domain: 'compact' }).maxGap).toBeCloseTo(1 / 21, 12);
  });

  it('grid worst gap attains 1/9 exactly at x = 1 (grid endpoint)', () => {
    const data = compact8();
    expect(data.xs[0]).toBeCloseTo(0, 12);
    expect(data.xs[GRID_POINTS - 1]).toBeCloseTo(1, 12);
    expect(data.curves.length).toBe(8);
    const last = data.curves[7] ?? [];
    expect(last[GRID_POINTS - 1]).toBeCloseTo(8 / 9, 12);
    let maxError = 0;
    for (let i = 0; i < GRID_POINTS; i++) {
      const err = Math.abs((data.limit[i] ?? 0) - (last[i] ?? 0));
      maxError = Math.max(maxError, err);
    }
    expect(maxError).toBeCloseTo(1 / 9, 12);
  });

  it('f_n(x) values match hand computation: f_8(0.5) = 4/9, f_8(1) = 8/9, f(0.5) = 0.5', () => {
    expect(compactTerm(8, 0.5)).toBeCloseTo(4 / 9, 12);
    expect(compactTerm(8, 1)).toBeCloseTo(8 / 9, 12);
    expect(compactLimit(0.5)).toBe(0.5);
    expect(compactLimit(1)).toBe(1);
  });

  it('compact curves are monotone increasing in n on the grid', () => {
    const data = compact8();
    for (let k = 0; k < data.curves.length - 1; k++) {
      const a = data.curves[k] ?? [];
      const b = data.curves[k + 1] ?? [];
      for (let i = 0; i < GRID_POINTS; i++) {
        expect((a[i] ?? 0) - (b[i] ?? 0)).toBeLessThanOrEqual(0);
      }
    }
  });
});

describe('dini: noncompact domain sup gap stays stuck at 1', () => {
  it('noncompactSupGap() = 1', () => {
    expect(noncompactSupGap()).toBe(1);
    expect(noncompact20().maxGap).toBe(1);
  });

  it('g_n(x) values match hand computation: g_20(0.5) = 2^-20, g_20(1) = 1, g = 0', () => {
    expect(noncompactTerm(20, 0.5)).toBeCloseTo(2 ** -20, 15);
    expect(noncompactTerm(20, 0.5)).toBeCloseTo(0.0000009536743, 12);
    expect(noncompactTerm(20, 1)).toBe(1);
    expect(noncompactLimit()).toBe(0);
  });

  it('noncompact grid is (0,1]: excludes 0, includes 1', () => {
    const data = noncompact20();
    expect(data.xs[0]).toBeCloseTo(1 / GRID_POINTS, 12);
    expect(data.xs[GRID_POINTS - 1]).toBe(1);
    expect(data.curves.length).toBe(20);
    const last = data.curves[19] ?? [];
    expect(last[GRID_POINTS - 1]).toBe(1);
    expect(last[0]).toBeCloseTo((1 / GRID_POINTS) ** 20, 15);
  });

  it('noncompact curves are monotone decreasing in n on the grid', () => {
    const data = noncompact20();
    for (let k = 0; k < data.curves.length - 1; k++) {
      const a = data.curves[k] ?? [];
      const b = data.curves[k + 1] ?? [];
      for (let i = 0; i < GRID_POINTS; i++) {
        expect((a[i] ?? 0) - (b[i] ?? 0)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe('dini: model.compute clamps n and parses domain', () => {
  it('clamps below 1 to 1 and above 60 to 60', () => {
    expect(compute({ n: 0, domain: 'compact' }).n).toBe(MIN_N);
    expect(compute({ n: -5, domain: 'compact' }).n).toBe(MIN_N);
    expect(compute({ n: 100, domain: 'compact' }).n).toBe(MAX_N);
  });

  it('floors fractional n and defaults on missing/invalid input', () => {
    expect(compute({ n: 8.9, domain: 'compact' }).n).toBe(8);
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ n: NaN }).n).toBe(DEFAULT_N);
  });

  it('defaults to the compact domain on missing/unknown values', () => {
    expect(compute({}).domain).toBe('compact');
    expect(compute({ domain: 'weird' }).domain).toBe('compact');
    expect(compute({ domain: 'noncompact' }).domain).toBe('noncompact');
  });
});
