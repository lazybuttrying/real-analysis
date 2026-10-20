import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_N,
  DEFAULT_P,
  MAX_N,
  MAX_P,
  MIN_N,
  MIN_P,
  fPow,
  integralPow,
  integralTestData,
  integralTestModel,
  leftSumPow,
  rightSumPow,
  type IntegralTestData,
} from '../src/chapters/series/models/integralTest';
import { integralTestProblems } from '../src/chapters/series/problems/integral-test';

const compute = (state: ControlState): IntegralTestData => syncCompute(integralTestModel, state);

describe('integral-test: the closed form', () => {
  it('p = 2, N = 12: integral = 12/13 = 0.9230769230769231', () => {
    expectCloseTo(integralPow(2, 12), 12 / 13, 1e-12);
    expectCloseTo(integralPow(2, 12), 0.9230769230769231, 1e-12);
  });

  it('p = 1 gives ln(N+1): integral(1, 12) = ln 13', () => {
    expectCloseTo(integralPow(1, 12), Math.log(13), 1e-15);
    expectCloseTo(integralPow(1, 12), 2.5649493574615367, 1e-12);
  });

  it('p = 2: integral = 1 - 1/(N+1), checked over the slider range', () => {
    for (let N = MIN_N; N <= MAX_N; N++) {
      expectCloseTo(integralPow(2, N), 1 - 1 / (N + 1), 1e-12);
    }
  });

  it('the integral is decreasing in p', () => {
    for (const N of [5, 12, 40]) {
      expect(integralPow(3, N)).toBeLessThan(integralPow(2, N));
      expect(integralPow(2, N)).toBeLessThan(integralPow(1, N));
    }
  });
});

describe('integral-test: the sandwich', () => {
  it('p = 2, N = 12: leftSum = 1.5649766384209025, rightSum = 0.5708937981842162', () => {
    expectCloseTo(leftSumPow(2, 12), 1.5649766384209025, 1e-9);
    expectCloseTo(rightSumPow(2, 12), 0.5708937981842162, 1e-9);
  });

  it('p = 1, N = 12: leftSum = H_12 = 3.103210678210678', () => {
    expectCloseTo(leftSumPow(1, 12), 3.103210678210678, 1e-9);
    expectCloseTo(rightSumPow(1, 12), 2.1801337551337556, 1e-9);
  });

  it('rightSum <= integral <= leftSum over the whole control grid', () => {
    for (const p of [1, 1.5, 2, 2.5, 3]) {
      for (const N of [5, 12, 40]) {
        const integral = integralPow(p, N);
        expect(rightSumPow(p, N)).toBeLessThanOrEqual(integral + 1e-12);
        expect(integral).toBeLessThanOrEqual(leftSumPow(p, N) + 1e-12);
      }
    }
  });

  it('the sandwich flags hold: integral <= leftSum <= 1 + integral', () => {
    for (const p of [1, 1.3, 2, 3]) {
      for (const N of [5, 12, 40]) {
        const data = integralTestData(p, N);
        expect(data.lowerOK).toBe(true);
        expect(data.upperOK).toBe(true);
      }
    }
  });

  it('leftSum - rightSum = f(1) - f(N+1): the two sums differ by one term each end', () => {
    for (const p of [1, 2, 3]) {
      for (const N of [5, 12, 40]) {
        expectCloseTo(leftSumPow(p, N) - rightSumPow(p, N), fPow(1, p) - fPow(N + 1, p), 1e-12);
      }
    }
  });
});

describe('integral-test: the verdict', () => {
  it("p > 1 converges, p <= 1 diverges", () => {
    expect(integralTestData(2, 12).verdict).toBe('converges');
    expect(integralTestData(1.1, 12).verdict).toBe('converges');
    expect(integralTestData(1, 12).verdict).toBe('diverges');
  });

  it('the p = 2 partial sums stay below the integral-test bound 1 + 1/(p-1)', () => {
    // sum_{k>=1} k^{-2} <= 1 + integral_1^infty x^{-2} dx = 2.
    expect(leftSumPow(2, 40)).toBeLessThan(2);
    expect(leftSumPow(2, 40)).toBeGreaterThan(1.6);
  });
});

describe('integral-test: model compute', () => {
  it('reads p and N from the control state (init p=2, N=12) and clamps', () => {
    const data = compute({ p: DEFAULT_P, N: DEFAULT_N });
    expect(data.p).toBe(2);
    expect(data.N).toBe(12);
    expectCloseTo(data.leftSum, 1.5649766384209025, 1e-9);
    expect(compute({ p: MIN_P, N: MIN_N }).p).toBe(1);
    expect(compute({ p: MAX_P, N: MAX_N }).p).toBe(3);
    expect(compute({ p: 99, N: 99 }).p).toBe(3);
    expect(compute({ p: 99, N: 99 }).N).toBe(40);
    expect(compute({ p: -1, N: 0 }).p).toBe(1);
    expect(compute({ p: -1, N: 0 }).N).toBe(5);
    expect(compute({}).p).toBe(2);
    expect(compute({}).N).toBe(12);
  });

  it('exports the expected data keys', () => {
    const data = compute({ p: 2, N: 12 });
    for (const key of ['p', 'N', 'leftSum', 'rightSum', 'integral', 'verdict'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('integral-test: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(integralTestProblems);
    expect(integralTestProblems[0]?.preset['p']).toBe(2);
    expect(integralTestProblems[0]?.preset['N']).toBe(12);
    expect(integralTestProblems[2]?.preset['N']).toBe(10);
  });

  it('the three ids are integral-test-proof, p-series, integral-test-estimate', () => {
    expect(integralTestProblems.map((p) => p.id)).toEqual([
      'integral-test-proof',
      'p-series',
      'integral-test-estimate',
    ]);
  });

  it('the tail estimate bounds the true R_10 of sum 1/n^2', () => {
    // R_10 = pi^2/6 - sum_{k=1}^{10} 1/k^2, must lie in [1/11, 1/10].
    const r10 = (Math.PI * Math.PI) / 6 - leftSumPow(2, 10);
    expectCloseTo(r10, 0.0951663356816856, 1e-9);
    expect(r10).toBeGreaterThanOrEqual(1 / 11);
    expect(r10).toBeLessThanOrEqual(1 / 10);
  });
});
