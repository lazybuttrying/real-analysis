import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  eulerFactor,
  eulerProduct,
  eulerProductModel,
  MAX_K,
  MIN_K,
  DEFAULT_K,
  PRIMES,
  ZETA2,
  type EulerProductData,
} from '../src/chapters/series/models/eulerProduct';
import { eulerProductProblems } from '../src/chapters/series/problems/euler-product';

const compute = (state: ControlState): EulerProductData =>
  eulerProductModel.compute(state) as EulerProductData;

/** Independent partial product: direct multiplication, no reuse of model internals. */
function naiveProduct(k: number): number {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  let product = 1;
  for (let i = 0; i < k; i++) {
    const p = primes[i] as number;
    product *= 1 / (1 - 1 / (p * p));
  }
  return product;
}

/** Independent zeta(2). */
function naiveZeta2(): number {
  return (Math.PI * Math.PI) / 6;
}

describe('euler-product: partial products are the intended values', () => {
  it('P_1 = 4/3', () => {
    expect(eulerProduct(1)).toBe(4 / 3);
  });

  it('P_2 = 3/2', () => {
    expect(eulerProduct(2)).toBe(3 / 2);
  });

  it('P_3 = 25/16 = 1.5625', () => {
    expect(eulerProduct(3)).toBe(25 / 16);
  });

  it('compute reports products 1..k', () => {
    const data = compute({ k: 6 });
    expect(data.k).toBe(6);
    expect(data.products).toHaveLength(6);
    expect(data.products[0]).toBe(4 / 3);
    expect(data.products[2]).toBe(25 / 16);
    expect(data.product).toBe(data.products[5]);
    expect(data.primes).toEqual([2, 3, 5, 7, 11, 13]);
    expect(data.terms).toHaveLength(6);
    expect(data.terms[5]?.prime).toBe(13);
  });

  it('model matches the independent naive multiplication for every k in 1..15', () => {
    for (let k = 1; k <= MAX_K; k++) {
      const data = compute({ k });
      expect(data.product).toBeCloseTo(naiveProduct(k), 14);
      for (let i = 0; i < k; i++) {
        expect(data.products[i]).toBeCloseTo(naiveProduct(i + 1), 14);
        expect(data.terms[i]?.product).toBeCloseTo(naiveProduct(i + 1), 14);
        expect(data.terms[i]?.error).toBeCloseTo(naiveZeta2() - naiveProduct(i + 1), 14);
      }
      expect(data.error).toBeCloseTo(data.zeta2 - data.product, 14);
    }
  });

  it('P_15 is within 0.01 of pi^2/6', () => {
    const p15 = compute({ k: 15 }).product;
    expect(p15).toBeCloseTo(1.6385679630962098, 12);
    expect(Math.abs(p15 - naiveZeta2())).toBeLessThan(0.01);
  });

  it('eulerFactor is 1/(1 - 1/p^2)', () => {
    expect(eulerFactor(2)).toBe(4 / 3);
    expect(eulerFactor(3)).toBe(9 / 8);
    expect(eulerFactor(5)).toBe(25 / 24);
  });
});

describe('euler-product: products increase monotonically toward ZETA2', () => {
  it('products are strictly increasing for k = 1..15', () => {
    let prev = -Infinity;
    for (let k = 1; k <= MAX_K; k++) {
      const p = naiveProduct(k);
      expect(p).toBeGreaterThan(prev);
      prev = p;
    }
  });

  it('error decreases to near zero and stays positive', () => {
    let prev = Infinity;
    for (let k = 1; k <= MAX_K; k++) {
      const err = naiveZeta2() - naiveProduct(k);
      expect(err).toBeGreaterThan(0);
      expect(err).toBeLessThan(prev);
      prev = err;
    }
    expect(naiveZeta2() - naiveProduct(15)).toBeLessThan(0.01);
  });

  it('ZETA2 is pi^2/6', () => {
    expect(ZETA2).toBe((Math.PI * Math.PI) / 6);
    expect(ZETA2).toBeCloseTo(1.6449340668482264, 15);
  });
});

describe('euler-product: problem caption numbers check out', () => {
  it('problem 1 preset k = 6: P_6 = 1.6179176613, error 0.0270164055', () => {
    const data = compute({ k: 6 });
    expect(data.product).toBeCloseTo(1.6179176613136572, 12);
    expect(data.error).toBeCloseTo(0.0270164055, 10);
  });

  it('problem 2 preset k = 3: P_3 = 25/16, error 0.0824340668', () => {
    const data = compute({ k: 3 });
    expect(data.product).toBe(25 / 16);
    expect(data.error).toBeCloseTo(0.0824340668, 10);
    expect(data.error).toBeCloseTo(Math.PI ** 2 / 6 - 25 / 16, 14);
  });

  it('problem 3 preset k = 15: P_15 = 1.6385679631, error 0.0063661038', () => {
    const data = compute({ k: 15 });
    expect(data.product).toBeCloseTo(1.6385679631, 10);
    expect(data.error).toBeCloseTo(0.0063661038, 10);
  });
});

describe('euler-product: problem presets use the scene control keys', () => {
  it('has 3 problems with ids, bilingual text, >= 3 proof steps, and valid presets', () => {
    expect(eulerProductProblems).toHaveLength(3);
    expect(eulerProductProblems.map((p) => p.id)).toEqual([
      'euler-product-sieve',
      'euler-product-basel',
      'euler-product-prime-reciprocals',
    ]);
    for (const problem of eulerProductProblems) {
      expect(problem.statement.ko.length).toBeGreaterThan(0);
      expect(problem.statement.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of problem.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      // preset uses the scene's real control key 'k', within slider range
      const k = Number(problem.preset['k']);
      expect(Number.isInteger(k)).toBe(true);
      expect(k).toBeGreaterThanOrEqual(MIN_K);
      expect(k).toBeLessThanOrEqual(MAX_K);
    }
  });
});

describe('euler-product: model.compute reads and clamps the controls', () => {
  it('returns k terms with consistent running values', () => {
    const data = compute({ k: 3 });
    expect(data.k).toBe(3);
    expect(data.terms).toHaveLength(3);
    expect(data.terms[0]?.k).toBe(1);
    expect(data.terms[0]?.prime).toBe(2);
    expect(data.terms[2]?.prime).toBe(5);
    expect(data.terms[2]?.factor).toBe(25 / 24);
    expect(data.products[2]).toBeCloseTo(data.product, 15);
  });

  it('clamps k below 1 to 1 and above 15 to 15', () => {
    expect(compute({ k: -5 }).k).toBe(MIN_K);
    expect(compute({ k: 10000 }).k).toBe(MAX_K);
    expect(compute({ k: 10000 }).primes).toHaveLength(15);
  });

  it('defaults to k = 6 on missing/invalid input', () => {
    expect(compute({}).k).toBe(DEFAULT_K);
    expect(compute({ k: NaN }).k).toBe(DEFAULT_K);
  });

  it('PRIMES holds the first 15 primes', () => {
    expect(PRIMES).toHaveLength(15);
    expect(PRIMES[0]).toBe(2);
    expect(PRIMES[14]).toBe(47);
  });
});
