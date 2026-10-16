import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  GRID_POINTS,
  MAX_TERMS,
  MIN_TERMS,
  mTestModel,
  tailBound,
  type MTestData,
} from '../src/chapters/series/models/mTest';

const compute = (state: ControlState): MTestData => mTestModel.compute(state) as MTestData;

const partial8 = (): MTestData => compute({ terms: 8 });

describe('m-test: tailBound is the verified majorant tail', () => {
  it('tailBound(8) is approximately 0.1175 (tol 1e-3)', () => {
    expect(tailBound(8)).toBeCloseTo(0.1175, 3);
  });

  it('tailBound is strictly decreasing in n', () => {
    for (let n = 1; n <= MAX_TERMS; n++) {
      expect(tailBound(n)).toBeGreaterThan(tailBound(n + 1));
    }
  });

  it('tailBound(n) equals the 2000-term proxy tail: sum_{k=n+1}^{2000} 1/k^2', () => {
    let sum8 = 0;
    for (let k = 1; k <= 8; k++) sum8 += 1 / (k * k);
    let sum2000 = 0;
    for (let k = 1; k <= 2000; k++) sum2000 += 1 / (k * k);
    expect(tailBound(8)).toBeCloseTo(sum2000 - sum8, 10);
    // The proxy tail sits ~0.0005 below the infinite tail pi^2/6 - H_8.
    expect(Math.PI ** 2 / 6 - sum8 - tailBound(8)).toBeCloseTo(0.0005, 3);
  });
});

describe('m-test: the uniform error bound holds on the grid', () => {
  it('max_x |limit - partial_8| <= tailBound(8)', () => {
    const data = partial8();
    expect(data.n).toBe(8);
    expect(data.xs.length).toBe(GRID_POINTS);
    expect(data.partial.length).toBe(GRID_POINTS);
    expect(data.limit.length).toBe(GRID_POINTS);
    let maxError = 0;
    for (let i = 0; i < GRID_POINTS; i++) {
      const err = Math.abs((data.limit[i] ?? 0) - (data.partial[i] ?? 0));
      maxError = Math.max(maxError, err);
    }
    expect(maxError).toBeLessThanOrEqual(tailBound(8));
  });
});

describe('m-test: model.compute clamps terms', () => {
  it('clamps below 1 to 1 and above 40 to 40', () => {
    expect(compute({ terms: 0 }).n).toBe(MIN_TERMS);
    expect(compute({ terms: -5 }).n).toBe(MIN_TERMS);
    expect(compute({ terms: 100 }).n).toBe(MAX_TERMS);
  });

  it('floors fractional terms and defaults on missing/invalid input', () => {
    expect(compute({ terms: 8.9 }).n).toBe(8);
    expect(compute({}).n).toBe(8);
    expect(compute({ terms: NaN }).n).toBe(8);
  });

  it('grid spans [0, 2pi] with 241 points', () => {
    const data = partial8();
    expect(data.xs[0]).toBeCloseTo(0, 12);
    expect(data.xs[GRID_POINTS - 1]).toBeCloseTo(2 * Math.PI, 12);
  });
});

describe('m-test: 2000-term proxy approximates pi^2/6', () => {
  it('sum_{k=1}^{2000} 1/k^2 is within 1e-3 of pi^2/6', () => {
    let sum = 0;
    for (let k = 1; k <= 2000; k++) sum += 1 / (k * k);
    expect(sum).toBeCloseTo(Math.PI ** 2 / 6, 3);
  });
});
