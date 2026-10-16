import { describe, expect, it } from 'vitest';
import {
  dirichletBound,
  dirichletTestModel,
  MAX_TERMS,
  MAX_X,
  MIN_TERMS,
  MIN_X,
  rawPartialSums,
  weightedPartialSums,
  type DirichletTestData,
} from '../src/chapters/series/models/dirichletTest';

describe('dirichlet bound', () => {
  it('equals 1/sin(0.5) ~= 2.0858 at x = 1', () => {
    expect(dirichletBound(1)).toBeCloseTo(2.0858, 3);
    expect(dirichletBound(1)).toBeCloseTo(1 / Math.sin(0.5), 12);
  });
});

describe('Dirichlet identity spot-check', () => {
  it('direct sum of sin(k*1) matches the closed form at N = 17', () => {
    const x = 1;
    const N = 17;
    let direct = 0;
    for (let k = 1; k <= N; k++) direct += Math.sin(k * x);
    const closed = (Math.sin((N * x) / 2) * Math.sin(((N + 1) * x) / 2)) / Math.sin(x / 2);
    expect(direct).toBeCloseTo(closed, 9);
  });
});

describe('raw partial sums stay inside the bound', () => {
  for (const x of [1, 2.5]) {
    it(`max |A_N| <= bound for N <= 80 at x = ${x}`, () => {
      const bound = dirichletBound(x);
      const sums = rawPartialSums(x, 80);
      expect(sums).toHaveLength(80);
      const maxAbs = sums.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
      expect(maxAbs).toBeLessThanOrEqual(bound);
    });
  }
});

describe('weighted series limit', () => {
  it('T_200(1) ~= (pi - 1)/2 ~= 1.0708', () => {
    const sums = weightedPartialSums(1, 200);
    expect(sums[199]).toBeCloseTo(1.0708, 2);
    expect(sums[199]).toBeCloseTo((Math.PI - 1) / 2, 2);
  });
});

describe('dirichletTestModel.compute clamps', () => {
  it('clamps terms to [1, 80] and x to [0.2, 3.0]', () => {
    const low = dirichletTestModel.compute({ terms: 0, x: 0.01 }) as DirichletTestData;
    expect(low.n).toBe(MIN_TERMS);
    expect(low.x).toBeCloseTo(MIN_X, 12);
    expect(low.partialSums).toHaveLength(1);
    expect(low.weighted).toHaveLength(1);

    const high = dirichletTestModel.compute({ terms: 500, x: 99 }) as DirichletTestData;
    expect(high.n).toBe(MAX_TERMS);
    expect(high.x).toBeCloseTo(MAX_X, 12);
    expect(high.partialSums).toHaveLength(80);
    expect(high.weighted).toHaveLength(80);
  });

  it('returns the bound and the two series', () => {
    const data = dirichletTestModel.compute({ terms: 30, x: 1.0 }) as DirichletTestData;
    expect(data.n).toBe(30);
    expect(data.x).toBe(1.0);
    expect(data.bound).toBeCloseTo(dirichletBound(1), 12);
    expect(data.partialSums).toHaveLength(30);
    expect(data.weighted).toHaveLength(30);
    expect(data.weighted[0]).toBeCloseTo(Math.sin(1), 12);
  });
});
