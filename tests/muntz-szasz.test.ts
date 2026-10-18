import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_N,
  denseExponents,
  gaussSolve,
  harmonicNumber,
  leastSquaresCoeffs,
  MAX_N,
  MIN_N,
  muntzData,
  muntzSzaszModel,
  recipSquarePartialSum,
  sparseExponents,
  targetFn,
  type MuntzData,
} from '../src/chapters/limits/models/muntzSzasz';
import { muntzSzaszProblems } from '../src/chapters/limits/problems/muntz-szasz';

const compute = (state: ControlState): MuntzData => syncCompute(muntzSzaszModel, state);

describe('muntz-szasz: gaussian elimination', () => {
  it('gaussSolve solves a 3x3 system exactly', () => {
    const a = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2],
    ];
    const x = gaussSolve(a, [8, -11, -3]);
    expectCloseTo(x[0]!, 2, 1e-12);
    expectCloseTo(x[1]!, 3, 1e-12);
    expectCloseTo(x[2]!, -1, 1e-12);
    // Inputs are not mutated.
    expect(a[0]![0]).toBe(2);
  });
});

describe('muntz-szasz: reciprocal-sum witnesses', () => {
  it('sum_{k=1}^{10000} 1/k^2 agrees with pi^2/6 to < 1e-4', () => {
    expectCloseTo(recipSquarePartialSum(10000), (Math.PI * Math.PI) / 6, 1.5e-4);
  });

  it('H_1000 > ln(1001): the harmonic series diverges', () => {
    expect(harmonicNumber(1000)).toBeGreaterThan(Math.log(1001));
  });

  it('exponent helpers build the two bases', () => {
    expect(denseExponents(3)).toEqual([0, 1, 2, 3]);
    expect(sparseExponents(3)).toEqual([0, 1, 4, 9]);
  });

  it('constant fit recovers the mean of sqrt on the grid (~2/3)', () => {
    const xs: number[] = [];
    for (let i = 0; i < 2001; i++) xs.push(i / 2000);
    const c = leastSquaresCoeffs([0], xs, xs.map(targetFn));
    expectCloseTo(c[0]!, 2 / 3, 1e-3);
  });
});

describe('muntz-szasz: the theorem in numbers', () => {
  it('dense supErr < sparse supErr at N=6, with the documented values', () => {
    const data = compute({ N: 6 });
    expect(data.supErrDense).toBeLessThan(data.supErrSparse);
    expectCloseTo(data.supErrDense, 0.070824540264560365, 1e-4);
    expectCloseTo(data.supErrSparse, 0.16755551521891757, 1e-4);
  });

  it('dense error shrinks 4 -> 6 -> 8 with the documented values', () => {
    const e4 = compute({ N: 4 }).supErrDense;
    const e6 = compute({ N: 6 }).supErrDense;
    const e8 = compute({ N: 8 }).supErrDense;
    expect(e4).toBeGreaterThan(e6);
    expect(e6).toBeGreaterThan(e8);
    expectCloseTo(e4, 0.10033833319576063, 1e-4);
    expectCloseTo(e8, 0.054448551618730398, 1e-4);
  });

  it('sparse error stalls: barely moves 4 -> 8 while dense drops', () => {
    const s4 = compute({ N: 4 }).supErrSparse;
    const s8 = compute({ N: 8 }).supErrSparse;
    const d4 = compute({ N: 4 }).supErrDense;
    const d8 = compute({ N: 8 }).supErrDense;
    expect(Math.abs(s8 - s4)).toBeLessThan(0.03);
    expect(d4 - d8).toBeGreaterThan(0.04);
    expect(s8).toBeGreaterThan(d8);
  });

  it('clamps N into [MIN_N, MAX_N] and defaults when missing', () => {
    expect(compute({ N: 1 }).n).toBe(MIN_N);
    expect(compute({ N: 99 }).n).toBe(MAX_N);
    expect(compute({ N: 6.7 }).n).toBe(6);
    expect(compute({}).n).toBe(DEFAULT_N);
  });

  it('muntzData returns full grid series for the plot', () => {
    const data = muntzData(6);
    expect(data.n).toBe(6);
    expect(data.f.length).toBe(2001);
    expect(data.dense.length).toBe(2001);
    expect(data.sparse.length).toBe(2001);
    expectCloseTo(data.f[0]!.y, 0, 1e-15);
    expectCloseTo(data.f[2000]!.y, 1, 1e-15);
  });
});

describe('muntz-szasz: problems', () => {
  it('exports exactly 3 problems with non-empty ko/en statements', () => {
    expect(muntzSzaszProblems.length).toBe(3);
    const ids = muntzSzaszProblems.map((p) => p.id);
    expect(ids).toEqual(['muntz-squares', 'even-polynomials', 'muntz-naturals']);
    for (const p of muntzSzaszProblems) {
      expect(p.statement.ko.trim().length).toBeGreaterThan(0);
      expect(p.statement.en.trim().length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.trim().length).toBeGreaterThan(0);
        expect(step.text.en.trim().length).toBeGreaterThan(0);
      }
      expect(p.preset['N']).toBeDefined();
      expect(p.presetCaption.ko.trim().length).toBeGreaterThan(0);
      expect(p.presetCaption.en.trim().length).toBeGreaterThan(0);
    }
  });
});
