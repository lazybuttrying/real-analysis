import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  bernoulli,
  dominoData,
  naturalNumbersModel,
  pow2gt,
  sumToN,
  type NaturalNumbersData,
} from '../src/chapters/limits/models/natural-numbers';

const compute = (state: ControlState): NaturalNumbersData => syncCompute(naturalNumbersModel, state);

describe('natural-numbers: sumToN matches the closed form', () => {
  it('sumToN(n) equals n(n+1)/2 for n = 1..20 (loop vs formula)', () => {
    for (let n = 1; n <= 20; n++) {
      expect(sumToN(n)).toBe((n * (n + 1)) / 2);
    }
  });

  it('gives the small values exactly', () => {
    expect(sumToN(1)).toBe(1);
    expect(sumToN(6)).toBe(21);
    expect(sumToN(10)).toBe(55);
  });
});

describe('natural-numbers: Bernoulli helper holds on sample points', () => {
  it('(1+x)^n >= 1+nx for x in [-0.9, -0.5, 0, 0.5, 2] x n = 1..12', () => {
    for (const x of [-0.9, -0.5, 0, 0.5, 2]) {
      for (let n = 1; n <= 12; n++) {
        expect(bernoulli(x, n)).toBe(true);
      }
    }
  });

  it('is tight at the base case n = 1', () => {
    expect((1 + 2) ** 1).toBe(1 + 2 * 1);
    expect((1 - 0.5) ** 1).toBe(1 - 0.5 * 1);
  });
});

describe('natural-numbers: powers of two dominate', () => {
  it('pow2gt(n) is true for n = 1..30', () => {
    for (let n = 1; n <= 30; n++) {
      expect(pow2gt(n)).toBe(true);
      expect(2 ** n).toBeGreaterThan(n);
    }
  });
});

describe('natural-numbers: domino data shape', () => {
  it('produces labels P(1)..P(n) with matching k values', () => {
    for (const n of [1, 4, 6, 10]) {
      const data = dominoData(n);
      expect(data.count).toBe(n);
      expect(data.dominoes).toHaveLength(n);
      data.dominoes.forEach((domino, i) => {
        expect(domino.k).toBe(i + 1);
        expect(domino.label).toBe(`P(${i + 1})`);
      });
    }
  });

  it('clamps out-of-range inputs into [1, 10]', () => {
    expect(dominoData(99).count).toBe(10);
    expect(dominoData(0).count).toBe(1);
    expect(dominoData(-5).count).toBe(1);
    expect(dominoData(NaN).count).toBe(6);
  });
});

describe('natural-numbers: model compute clamps state', () => {
  it('clamps n into [1, 10] and defaults to 6', () => {
    expect(compute({ n: 99 }).count).toBe(10);
    expect(compute({}).count).toBe(6);
    expect(compute({ n: 0 }).count).toBe(1);
    expect(compute({ n: -3 }).count).toBe(1);
    expect(compute({ n: 3.7 }).count).toBe(3);
  });

  it('returns one domino per k = 1..count', () => {
    const d = compute({ n: 6 });
    expect(d.dominoes).toHaveLength(6);
    expect(d.dominoes[0]?.label).toBe('P(1)');
    expect(d.dominoes[5]?.label).toBe('P(6)');
  });
});
