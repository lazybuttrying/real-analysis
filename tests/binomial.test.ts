import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  binom,
  binomialModel,
  expandCheck,
  pascalRow,
  rowSum,
  type BinomialData,
} from '../src/chapters/limits/models/binomial';

const compute = (state: ControlState): BinomialData => binomialModel.compute(state) as BinomialData;

describe('binomial: binom is the exact multiplicative coefficient', () => {
  it('binom(5,2)=10 and binom(8,4)=70', () => {
    expect(binom(5, 2)).toBe(10);
    expect(binom(8, 4)).toBe(70);
  });

  it('binom(n,0)=binom(n,n)=1 for n 0..8', () => {
    for (let n = 0; n <= 8; n++) {
      expect(binom(n, 0)).toBe(1);
      expect(binom(n, n)).toBe(1);
    }
  });

  it('returns 0 outside the triangle', () => {
    expect(binom(5, 9)).toBe(0);
    expect(binom(5, -1)).toBe(0);
    expect(binom(-2, 0)).toBe(0);
  });

  it('matches the factorial definition on the full grid', () => {
    const fact = (m: number): number => (m <= 1 ? 1 : m * fact(m - 1));
    for (let n = 0; n <= 8; n++) {
      for (let k = 0; k <= n; k++) {
        expect(binom(n, k)).toBe(fact(n) / (fact(k) * fact(n - k)));
      }
    }
  });

  it('pascalRow gives the expected rows', () => {
    expect(pascalRow(0)).toEqual([1]);
    expect(pascalRow(4)).toEqual([1, 4, 6, 4, 1]);
    expect(pascalRow(8)).toEqual([1, 8, 28, 56, 70, 56, 28, 8, 1]);
  });
});

describe('binomial: row sums are powers of two', () => {
  it('rowSum(n) = 2^n for n 0..8', () => {
    for (let n = 0; n <= 8; n++) {
      expect(rowSum(n)).toBe(2 ** n);
    }
  });

  it('Pascal identity: binom(n,k) + binom(n,k-1) = binom(n+1,k)', () => {
    for (let n = 1; n <= 7; n++) {
      for (let k = 1; k <= n; k++) {
        expect(binom(n, k) + binom(n, k - 1)).toBe(binom(n + 1, k));
      }
    }
  });
});

describe('binomial: expandCheck verifies the theorem numerically', () => {
  it('rhs matches (x+y)^n for x, y in {0.5, 1, 2, -1} and n 0..6', () => {
    const values = [0.5, 1, 2, -1];
    for (const x of values) {
      for (const y of values) {
        for (let n = 0; n <= 6; n++) {
          const { lhs, rhs } = expandCheck(x, y, n);
          expect(rhs).toBeCloseTo(lhs, 10);
        }
      }
    }
  });

  it('alternating sum = 0 for n 1..8 (x=1, y=-1)', () => {
    for (let n = 1; n <= 8; n++) {
      expect(expandCheck(1, -1, n).rhs).toBeCloseTo(0, 12);
    }
  });
});

describe('binomial: model compute clamps state', () => {
  it('clamps n into [0, 8] and defaults to 4', () => {
    expect(compute({ n: 99 }).n).toBe(8);
    expect(compute({ n: -3 }).n).toBe(0);
    expect(compute({}).n).toBe(4);
  });

  it('returns rows 0..n, highlight n, and rowSum = 2^n', () => {
    const d = compute({ n: 4 });
    expect(d.rows).toHaveLength(5);
    expect(d.rows[4]).toEqual([1, 4, 6, 4, 1]);
    expect(d.highlight).toBe(4);
    expect(d.rowSum).toBe(16);
  });
});
