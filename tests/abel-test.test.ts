import { describe, expect, it } from 'vitest';
import { expectCloseTo } from './helpers';
import {
  abelTestModel,
  aTerm,
  bTerm,
  exactLimit,
  LIMIT_TERMS,
  MAX_N,
  MIN_N,
  rawPartialSums,
  weightedPartialSums,
  weightSequence,
  type AbelTestData,
} from '../src/chapters/series/models/abelTest';

function tail(example: 'shifted' | 'scaled', n: number): number {
  return weightedPartialSums(example, n)[n - 1] ?? NaN;
}

describe('weight sequence b_k', () => {
  it('shifted: b_k = 2 + 1/k strictly decreasing, 2 <= b_k <= 3', () => {
    const weights = weightSequence('shifted', 500);
    expect(weights).toHaveLength(500);
    for (let i = 0; i < 499; i++) {
      expect(weights[i]).toBeGreaterThan(weights[i + 1] ?? 0);
    }
    expect(weights[0]).toBeCloseTo(3, 12);
    expect(weights[499]).toBeCloseTo(2.002, 12);
    for (const w of weights) expect(Math.abs(w)).toBeLessThanOrEqual(3);
  });

  it('scaled: b_k = k/(k+1) strictly increasing, 0 < b_k <= 1', () => {
    const weights = weightSequence('scaled', 500);
    expect(weights).toHaveLength(500);
    for (let i = 0; i < 499; i++) {
      expect(weights[i]).toBeLessThan(weights[i + 1] ?? 0);
    }
    expect(weights[0]).toBeCloseTo(0.5, 12);
    for (const w of weights) {
      expect(w).toBeGreaterThan(0);
      expect(w).toBeLessThanOrEqual(1);
      expect(Math.abs(w)).toBeLessThanOrEqual(3);
    }
  });

  it('b_k does not tend to 0 in either example', () => {
    expect(bTerm('shifted', 10_000)).toBeCloseTo(2, 3);
    expect(bTerm('scaled', 10_000)).toBeCloseTo(1, 3);
  });
});

describe('weighted partial sums settle', () => {
  it('shifted: |S_400 - S_500| is small, S_500 ~= -2.2068', () => {
    expect(tail('shifted', 500)).toBeCloseTo(-2.2068, 3);
    expectCloseTo(tail('shifted', 400), tail('shifted', 500), 0.005);
  });

  it('scaled: |S_400 - S_500| is small, S_500 ~= -0.2318', () => {
    expect(tail('scaled', 500)).toBeCloseTo(-0.2318, 3);
    expectCloseTo(tail('scaled', 400), tail('scaled', 500), 0.01);
  });

  it('matches the exact limit -2 ln 2 - pi^2/12 ~= -2.20876 for shifted', () => {
    expect(exactLimit('shifted')).toBeCloseTo(-2.2088, 3);
    expect(exactLimit('shifted')).toBeCloseTo(-2 * Math.log(2) - (Math.PI * Math.PI) / 12, 12);
    expect(exactLimit('scaled')).toBeNull();
  });
});

describe('the a_k factor series converges (Leibniz)', () => {
  it('shifted: A_200 of (-1)^k/k ~= -ln 2', () => {
    const sums = rawPartialSums('shifted', 200);
    const a200 = sums[199] ?? NaN;
    expect(a200).toBeCloseTo(-Math.log(2), 2);
    expect(Math.abs(a200 + Math.log(2))).toBeLessThan(0.01);
  });

  it('scaled: partial sums of (-1)^k/sqrt(k) settle', () => {
    const sums = rawPartialSums('scaled', 500);
    const mid = sums[399] ?? NaN;
    const last = sums[499] ?? NaN;
    expectCloseTo(mid, last, 0.02);
  });
});

describe('abelTestModel.compute', () => {
  it('returns correct lengths and S_1 = a_1 * b_1', () => {
    const shifted = abelTestModel.compute({ example: 'shifted', n: 500 }) as AbelTestData;
    expect(shifted.n).toBe(500);
    expect(shifted.partialSums).toHaveLength(500);
    expect(shifted.aSums).toHaveLength(500);
    expect(shifted.weights).toHaveLength(500);
    expect(shifted.partialSums[0]).toBeCloseTo(aTerm('shifted', 1) * bTerm('shifted', 1), 12);
    expect(shifted.partialSums[0]).toBeCloseTo(-3, 12);

    const scaled = abelTestModel.compute({ example: 'scaled', n: 120 }) as AbelTestData;
    expect(scaled.n).toBe(120);
    expect(scaled.partialSums[0]).toBeCloseTo(-0.5, 12);
    expect(scaled.bLimit).toBeCloseTo(1, 12);
    expect(shifted.bLimit).toBeCloseTo(2, 12);
  });

  it('limit line: exact for shifted, numerical estimate for scaled', () => {
    const shifted = abelTestModel.compute({ example: 'shifted', n: 120 }) as AbelTestData;
    expect(shifted.limitExact).toBe(true);
    expect(shifted.limit).toBeCloseTo(exactLimit('shifted') ?? NaN, 12);

    const scaled = abelTestModel.compute({ example: 'scaled', n: 120 }) as AbelTestData;
    expect(scaled.limitExact).toBe(false);
    expect(scaled.limit).toBeCloseTo(tail('scaled', LIMIT_TERMS), 12);
  });

  it('clamps n to [10, 500] and falls back to the default example', () => {
    const low = abelTestModel.compute({ example: 'bogus', n: 3 }) as AbelTestData;
    expect(low.n).toBe(MIN_N);
    expect(low.example).toBe('shifted');
    expect(low.partialSums).toHaveLength(MIN_N);

    const high = abelTestModel.compute({ example: 'scaled', n: 5000 }) as AbelTestData;
    expect(high.n).toBe(MAX_N);
    expect(high.partialSums).toHaveLength(MAX_N);
  });
});
