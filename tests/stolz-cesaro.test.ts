import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  cesaroMeans,
  cube,
  DEFAULT_TERMS,
  diffRatio,
  LIMIT,
  MAX_TERMS,
  MIN_TERMS,
  ratio,
  stolzCesaroModel,
  sumOdd,
  sumSquares,
  type StolzCesaroData,
} from '../src/chapters/limits/models/stolzCesaro';

const compute = (state: ControlState): StolzCesaroData =>
  stolzCesaroModel.compute(state) as StolzCesaroData;

describe('stolz-cesaro: closed forms', () => {
  it('sumSquares(3) = 14 and sumSquares(100) = 338350', () => {
    expect(sumSquares(1)).toBe(1);
    expect(sumSquares(3)).toBe(14);
    expect(sumSquares(100)).toBe(338350);
  });

  it('cube(5) = 125', () => {
    expect(cube(5)).toBe(125);
  });

  it('diffRatio(1) = 4/7', () => {
    // (a_2 - a_1)/(b_2 - b_1) = 4/(8 - 1).
    expect(diffRatio(1)).toBeCloseTo(4 / 7, 12);
  });

  it('ratio(1) = 1 exactly', () => {
    expect(ratio(1)).toBe(1);
  });
});

describe('stolz-cesaro: model compute', () => {
  it('clamps n to [10, 300] and defaults to 60', () => {
    expect(compute({ n: 100 }).count).toBe(100);
    expect(compute({ n: 1 }).count).toBe(MIN_TERMS);
    expect(compute({ n: 1000 }).count).toBe(MAX_TERMS);
    expect(compute({ n: 59.9 }).count).toBe(59);
    expect(compute({}).count).toBe(DEFAULT_TERMS);
    expect(compute({ n: NaN }).count).toBe(DEFAULT_TERMS);
  });

  it('reports the shared limit 1/3', () => {
    expect(compute({ n: 60 }).limit).toBe(LIMIT);
    expect(LIMIT).toBe(1 / 3);
  });

  it('emits one point per term starting at n = 1', () => {
    const data = compute({ n: 60 });
    expect(data.points).toHaveLength(60);
    expect(data.points[0]).toEqual({ n: 1, diffRatio: diffRatio(1), ratio: ratio(1) });
    expect(data.points[59]).toEqual({ n: 60, diffRatio: diffRatio(60), ratio: ratio(60) });
  });

  it('final values match the closed forms at the end index', () => {
    const data = compute({ n: 200 });
    expect(data.finalRatio).toBe(ratio(200));
    expect(data.finalDiffRatio).toBe(diffRatio(200));
  });

  it('s_1000 is within 0.001 of 1/3', () => {
    // s_1000 = 1001*2001/(6*10^6) = 1/3 + 0.0005001..., so the
    // difference stays inside the tolerance with room to spare.
    expect(Math.abs(ratio(1000) - 1 / 3)).toBeLessThan(0.001);
  });

  it('r_1000 is within 0.001 of 1/3', () => {
    expect(Math.abs(diffRatio(1000) - 1 / 3)).toBeLessThan(0.001);
  });

  it('both ratios approach 1/3 monotonically from above', () => {
    for (let n = 10; n < 200; n++) {
      const errR = diffRatio(n) - 1 / 3;
      const errRNext = diffRatio(n + 1) - 1 / 3;
      const errS = ratio(n) - 1 / 3;
      const errSNext = ratio(n + 1) - 1 / 3;
      expect(errR).toBeGreaterThan(0);
      expect(errS).toBeGreaterThan(0);
      expect(errRNext).toBeLessThan(errR);
      expect(errSNext).toBeLessThan(errS);
    }
  });
});

describe('stolz-cesaro: Cesaro mean corollary', () => {
  it('means of a_n -> 2 settle at 2', () => {
    const means = cesaroMeans((n) => 2 + (n % 2 === 0 ? 1 : -1) / n, 1000);
    expect(means).toHaveLength(1000);
    expect(Math.abs(means[999] as number - 2)).toBeLessThan(0.01);
  });

  it('means of a constant sequence are exactly that constant', () => {
    const means = cesaroMeans(() => 5, 50);
    for (const mean of means) {
      expect(mean).toBe(5);
    }
  });

  it('returns no means for an empty range', () => {
    expect(cesaroMeans(() => 1, 0)).toEqual([]);
  });
});

describe('stolz-cesaro: odd-sum problem', () => {
  it('brute-force odd sums equal n^2 in exact arithmetic', () => {
    for (const n of [1, 7, 100, 1000]) {
      let brute = 0;
      for (let k = 1; k <= n; k++) brute += 2 * k - 1;
      expect(brute).toBe(sumOdd(n));
    }
  });

  it('the odd-sum ratio is exactly 1', () => {
    for (const n of [1, 7, 100, 1000]) {
      expect(sumOdd(n) / (n * n)).toBe(1);
    }
  });

  it('the odd-sum difference ratio is exactly 1', () => {
    for (const n of [1, 7, 100, 1000]) {
      const diffA = sumOdd(n + 1) - sumOdd(n);
      const diffB = (n + 1) * (n + 1) - n * n;
      expect(diffA / diffB).toBe(1);
    }
  });
});
