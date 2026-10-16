import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  abelSumGrandi,
  abelTheoremModel,
  altHarmonicPartial,
  altHarmonicPartialSum,
  altHarmonicTailBound,
  closedFormAltHarmonic,
  grandiPartialSumClosed,
  grandiPartialSumDirect,
  grandiTailBound,
  GRID_POINTS,
  MAX_TERMS,
  MIN_TERMS,
  SIDE_K,
  X_MAX,
  type AbelData,
} from '../src/chapters/series/models/abelTheorem';

const compute = (state: ControlState): AbelData => abelTheoremModel.compute(state) as AbelData;

describe('abel-theorem: abelSumGrandi(x) = 1/(1+x)', () => {
  it('at x=0.9 gives 1/1.9 ~ 0.5263', () => {
    expect(abelSumGrandi(0.9)).toBeCloseTo(1 / 1.9, 12);
    expect(abelSumGrandi(0.9)).toBeCloseTo(0.5263, 4);
  });

  it('homes to 1/2 as x -> 1-', () => {
    expect(abelSumGrandi(0.99)).toBeCloseTo(0.5025, 4);
    expect(abelSumGrandi(0.999)).toBeCloseTo(0.5, 3);
  });
});

describe('abel-theorem: closed partial-sum formula matches direct summation', () => {
  it('(1-(-x)^{N+1})/(1+x) == sum_{n=0}^{N} (-1)^n x^n for sample x, N', () => {
    const samples: Array<[number, number]> = [
      [0.9, 20],
      [0.5, 10],
      [0.99, 50],
      [0.1, 5],
      [0.75, 100],
    ];
    for (const [x, n] of samples) {
      expect(grandiPartialSumClosed(x, n)).toBeCloseTo(grandiPartialSumDirect(x, n), 10);
    }
  });
});

describe('abel-theorem: alternating harmonic partial sums -> ln 2', () => {
  it('altHarmonicPartial(100000) is within 1e-4 of ln 2 ~ 0.6931', () => {
    const s = altHarmonicPartial(100000);
    expect(s).toBeCloseTo(Math.LN2, 4);
    expect(Math.abs(s - Math.LN2)).toBeLessThan(1e-4);
    expect(Math.abs(s - 0.6931)).toBeLessThan(1e-4);
  });

  it('the closed form ln(1+x) is the limit of the power-series partial sums', () => {
    // At x = 0.9 the Leibniz bound is tight enough for a direct check.
    const x = 0.9;
    const n = 200;
    expect(altHarmonicPartialSum(x, n)).toBeCloseTo(closedFormAltHarmonic(x), 6);
  });
});

describe('abel-theorem: geometric tail |(-x)^{N+1}|/(1+x) < epsilon checks', () => {
  it('grandiTailBound(0.9, 100) < 1e-4', () => {
    expect(grandiTailBound(0.9, 100)).toBeLessThan(1e-4);
    expect(grandiTailBound(0.9, 100)).toBeCloseTo(0.9 ** 101 / 1.9, 12);
  });

  it('the tail bound is exactly the gap between partial sum and closed form', () => {
    for (const [x, n] of [
      [0.9, 20],
      [0.99, 50],
    ] as Array<[number, number]>) {
      const gap = Math.abs(grandiPartialSumClosed(x, n) - abelSumGrandi(x));
      expect(grandiTailBound(x, n)).toBeCloseTo(gap, 12);
    }
  });

  it('verified caption figure: tail(0.9, 20) ~ 0.0576, S_20(0.9) ~ 0.5839', () => {
    expect(grandiTailBound(0.9, 20)).toBeCloseTo(0.0576, 4);
    expect(grandiPartialSumClosed(0.9, 20)).toBeCloseTo(0.5839, 4);
  });
});

describe('abel-theorem: model.compute clamps and shapes data', () => {
  it('clamps x to [0, 0.99] and n to [1, 200]', () => {
    expect(compute({ x: 1.5 }).x).toBe(X_MAX);
    expect(compute({ x: -2 }).x).toBe(0);
    expect(compute({ n: 0 }).n).toBe(MIN_TERMS);
    expect(compute({ n: 500 }).n).toBe(MAX_TERMS);
    expect(compute({ n: 8.9 }).n).toBe(8);
  });

  it('defaults on missing/invalid input', () => {
    expect(compute({}).n).toBe(40);
    expect(compute({ n: NaN }).n).toBe(40);
    expect(compute({ series: 'bogus' }).series).toBe('grandi');
  });

  it('grid spans [0, 0.99] with 241 points', () => {
    const data = compute({ x: 0.8, n: 40 });
    expect(data.xs).toHaveLength(GRID_POINTS);
    expect(data.xs[0]).toBeCloseTo(0, 12);
    expect(data.xs[GRID_POINTS - 1]).toBeCloseTo(0.99, 12);
    expect(data.partial).toHaveLength(GRID_POINTS);
    expect(data.limit).toHaveLength(GRID_POINTS);
  });

  it('partial curve hugs the closed-form curve within the pointwise tail bound', () => {
    const data = compute({ series: 'grandi', x: 0.9, n: 40 });
    for (let i = 0; i < GRID_POINTS; i++) {
      const xi = data.xs[i] ?? 0;
      const gap = Math.abs((data.partial[i] ?? 0) - (data.limit[i] ?? 0));
      expect(gap).toBeLessThanOrEqual(grandiTailBound(xi, 40) + 1e-12);
    }
  });

  it('abelLimit is 0.5 for grandi and ln 2 for alt-harmonic', () => {
    expect(compute({ series: 'grandi' }).abelLimit).toBe(0.5);
    expect(compute({ series: 'alt-harmonic' }).abelLimit).toBeCloseTo(Math.LN2, 15);
  });
});

describe('abel-theorem: contrast panel at x = 1', () => {
  it('grandi side sums oscillate 1, 0, 1, 0, ... (divergence)', () => {
    const data = compute({ series: 'grandi' });
    expect(data.sideSums).toHaveLength(SIDE_K + 1);
    for (let k = 0; k <= SIDE_K; k++) {
      expect(data.sideSums[k]).toBe(k % 2 === 0 ? 1 : 0);
    }
  });

  it('alt-harmonic side sums settle toward ln 2', () => {
    const data = compute({ series: 'alt-harmonic' });
    const last = data.sideSums[SIDE_K] ?? 0;
    expect(Math.abs(last - Math.LN2)).toBeLessThan(0.05);
    // Alternation brackets the limit: consecutive sums straddle ln 2.
    const prev = data.sideSums[SIDE_K - 1] ?? 0;
    expect(Math.sign(last - Math.LN2)).toBe(-Math.sign(prev - Math.LN2));
  });
});

describe('abel-theorem: alt-harmonic tail bound', () => {
  it('the Leibniz bound dominates the actual remainder', () => {
    const x = 0.9;
    const n = 40;
    const actual = Math.abs(altHarmonicPartialSum(x, 2000) - altHarmonicPartialSum(x, n));
    expect(actual).toBeLessThanOrEqual(altHarmonicTailBound(x, n));
  });

  it('verified preset figures', () => {
    // Problem 1 preset: x=0.9, N=40.
    expect(altHarmonicPartialSum(0.9, 40)).toBeCloseTo(0.642, 3);
    expect(closedFormAltHarmonic(0.9)).toBeCloseTo(0.6419, 4);
    // Problem 3 preset: x=0.99, N=100.
    expect(altHarmonicPartialSum(0.99, 100)).toBeCloseTo(0.6899, 4);
    expect(closedFormAltHarmonic(0.99)).toBeCloseTo(0.6881, 4);
    // Problem 2 preset: x=0.99, N=100.
    expect(grandiPartialSumClosed(0.99, 100)).toBeCloseTo(0.6846, 4);
  });
});
