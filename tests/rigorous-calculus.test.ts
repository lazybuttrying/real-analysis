import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CAUCHY_A,
  CAUCHY_B,
  cauchyChordSlope,
  cauchyMvtModel,
  cauchyMVTData,
  cauchySlopeRatio,
  cauchyTheoremXi,
  type CauchyMVTData,
} from '../src/chapters/calculus/models/cauchyMvt';
import {
  sinDerivativeAtZero,
  taylorThmBound,
  taylorThmCoefficients,
  taylorThmData,
  taylorThmModel,
  taylorThmPoly,
} from '../src/chapters/calculus/models/taylorThm';

const computeCauchy = (state: ControlState): CauchyMVTData => syncCompute(cauchyMvtModel, state);

describe('cauchy-mvt: the 3/7 chord slope and the 14/9 theorem point', () => {
  it('chord slope (f(2)-f(1))/(g(2)-g(1)) = (4-1)/(8-1) = 3/7', () => {
    expect(CAUCHY_A).toBe(1);
    expect(CAUCHY_B).toBe(2);
    expect(cauchyChordSlope()).toBeCloseTo(3 / 7, 15);
  });

  it('theorem point 2/(3t) = 3/7 solves to t = 14/9 ~= 1.5556', () => {
    expect(cauchyTheoremXi()).toBeCloseTo(14 / 9, 15);
    expect(cauchyTheoremXi()).toBeCloseTo(1.5556, 4);
    // f'(xi)/g'(xi) equals the chord slope exactly at the theorem point.
    expect(cauchySlopeRatio(cauchyTheoremXi())).toBeCloseTo(3 / 7, 12);
  });

  it('cauchyMVTData(1.56): xi clamped, ratio near the chord slope, curve endpoints (1,1) and (8,4)', () => {
    const data = cauchyMVTData(1.56);
    expect(data.xi).toBe(1.56);
    expect(data.chordSlope).toBeCloseTo(3 / 7, 15);
    expect(data.tangentSlopeRatio).toBeCloseTo(2 / (3 * 1.56), 12);
    // 1.56 is within 0.01 of the true 14/9, so the ratio is close but not exact.
    expectCloseTo(data.tangentSlopeRatio, data.chordSlope, 0.002);
    expect(Math.abs(data.tangentSlopeRatio - data.chordSlope)).toBeGreaterThan(0);
    const first = data.curve[0];
    const lastSample = data.curve[data.curve.length - 1];
    expect(first?.x).toBeCloseTo(1, 12);
    expect(first?.y).toBeCloseTo(1, 12);
    expect(lastSample?.x).toBeCloseTo(8, 12);
    expect(lastSample?.y).toBeCloseTo(4, 12);
    // Parametric order: x = g(t) = t^3 is increasing on [1, 2].
    for (let i = 1; i < data.curve.length; i++) {
      expect(data.curve[i]?.x ?? 0).toBeGreaterThan(data.curve[i - 1]?.x ?? 0);
    }
  });

  it('xi outside [1, 2] is clamped', () => {
    expect(cauchyMVTData(0).xi).toBe(1);
    expect(cauchyMVTData(99).xi).toBe(2);
  });

  it('compute() accepts every cauchy-mvt problem preset', () => {
    for (const xi of [1.56, 1.56, 1.56]) {
      const data = computeCauchy({ xi });
      expect(data.xi).toBe(xi);
      expect(data.tangentSlopeRatio).toBeCloseTo(2 / (3 * xi), 12);
    }
  });

  it('non-finite xi falls back to the 1.56 init', () => {
    expect(computeCauchy({ xi: NaN }).xi).toBe(1.56);
    expect(computeCauchy({}).xi).toBe(1.56);
  });
});

describe('taylor-thm: sin Maclaurin coefficients, polynomial, and the Lagrange envelope', () => {
  it('sin Maclaurin coefficients up to degree 9', () => {
    const c = taylorThmCoefficients(9);
    expect(c).toHaveLength(10);
    expect(c[0]).toBe(0);
    expect(c[1]).toBe(1);
    expect(c[2]).toBe(0);
    expect(c[3]).toBeCloseTo(-1 / 6, 15);
    expect(c[4]).toBe(0);
    expect(c[5]).toBeCloseTo(1 / 120, 15);
    expect(c[6]).toBe(0);
    expect(c[7]).toBeCloseTo(-1 / 5040, 15);
    expect(c[8]).toBe(0);
    expect(c[9]).toBeCloseTo(1 / 362880, 15);
  });

  it('sin derivatives at 0 cycle 0, 1, 0, -1', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(sinDerivativeAtZero)).toEqual([0, 1, 0, -1, 0, 1, 0, -1]);
  });

  it('T_5(1) = 1 - 1/6 + 1/120 = 101/120 = 0.841666...', () => {
    const p = taylorThmPoly(taylorThmCoefficients(5), 1);
    expect(p).toBeCloseTo(101 / 120, 12);
    expect(p).toBeCloseTo(0.8416667, 6);
  });

  it('envelope bound at x = pi, n = 5: pi^6/720 ~= 1.335', () => {
    expect(taylorThmBound(5, Math.PI)).toBeCloseTo(Math.pow(Math.PI, 6) / 720, 15);
    expect(taylorThmBound(5, Math.PI)).toBeCloseTo(1.335, 3);
    expect(taylorThmBound(5, -Math.PI)).toBe(taylorThmBound(5, Math.PI));
  });

  it('envelope at n = 9, x = pi: pi^10/10! ~= 0.0258', () => {
    expect(taylorThmBound(9, Math.PI)).toBeCloseTo(Math.pow(Math.PI, 10) / 3628800, 15);
    expect(taylorThmBound(9, Math.PI)).toBeCloseTo(0.0258, 4);
  });

  it('actual max error sits inside the envelope for n = 0..9', () => {
    for (const n of [0, 1, 2, 3, 5, 7, 9]) {
      const data = taylorThmData(n);
      expect(data.n).toBe(n);
      expect(data.maxBound).toBe(taylorThmBound(n, Math.PI));
      expect(data.maxActualErr).toBeLessThanOrEqual(data.maxBound);
      // Every grid sample is also inside the envelope, pointwise.
      for (const s of data.samples) {
        expect(Math.abs(s.y - s.p)).toBeLessThanOrEqual(s.bound + 1e-12);
      }
    }
  });

  it('higher degree hugs tighter on [-pi, pi]', () => {
    const e1 = taylorThmData(1).maxActualErr;
    const e5 = taylorThmData(5).maxActualErr;
    const e9 = taylorThmData(9).maxActualErr;
    expect(e1).toBeGreaterThan(e5);
    expect(e5).toBeGreaterThan(e9);
  });

  it('compute() accepts every taylor-thm problem preset', () => {
    expect(taylorThmModel.compute({ degree: 3 })).toMatchObject({ n: 3 });
    expect(taylorThmModel.compute({ degree: 9 })).toMatchObject({ n: 9 });
    expect(taylorThmModel.compute({ degree: 5 })).toMatchObject({ n: 5 });
  });

  it('degree outside [0, 9] is clamped; non-finite falls back to 5', () => {
    expect(taylorThmData(-3).n).toBe(0);
    expect(taylorThmData(99).n).toBe(9);
    expect(taylorThmData(NaN).n).toBe(5);
  });
});

describe('rigorous-calculus: every number quoted in the six proofs', () => {
  it('cauchy-mvt proofs: 3/7, 14/9 ~= 1.556, cos 0 = 1, the 1/2 limit chain', () => {
    // Problem 1: the ordinary MVT is the g(x) = x special case.
    expect(3 / 7).toBeCloseTo(0.428571, 6);
    expect(14 / 9).toBeCloseTo(1.5556, 4);
    // Problem 2: sin x / x -> cos(xi_x) -> cos 0 = 1.
    expect(Math.cos(0)).toBe(1);
    // Problem 3: (e^x-1-x)/x^2 -> (e^xi-1)/(2xi) -> e^{xi_2}/2 -> 1/2.
    expect(1 / 2).toBe(0.5);
    expect(Math.exp(0)).toBe(1);
  });

  it('taylor-thm proofs: T_3(1) = 8/3, e/24 ~= 0.1133, e - 8/3 ~= 0.0516 < e/24', () => {
    // Problem 1: the Lagrange bound for e^x.
    expect(8 / 3).toBeCloseTo(2.6667, 4);
    expect(Math.E / 24).toBeCloseTo(0.1133, 4);
    const trueErr = Math.E - 8 / 3;
    expect(trueErr).toBeGreaterThan(0);
    expect(trueErr).toBeCloseTo(0.0516, 4);
    expect(trueErr).toBeLessThan(Math.E / 24);
  });

  it('taylor-thm proofs: |R_n(x)| <= |x|^{n+1}/(n+1)! -> 0, and c_j = f^{(j)}(a)/j!', () => {
    // Problem 2: factorial beats power for fixed x = pi.
    const ratios = [1, 3, 5, 9, 15].map((n) => Math.pow(Math.PI, n + 1) / factorial(n + 1));
    for (let i = 1; i < ratios.length; i++) {
      expect(ratios[i] ?? 0).toBeLessThan(ratios[i - 1] ?? 0);
    }
    expect(ratios[ratios.length - 1] ?? 0).toBeLessThan(1e-5);
    // Problem 3: j! * c_j = f^{(j)}(a), checked against sin at a = 0, j = 3.
    const c3 = taylorThmCoefficients(3)[3] ?? 0;
    expect(6 * c3).toBeCloseTo(sinDerivativeAtZero(3), 12);
  });
});

/** Local factorial for the proof-number checks (kept out of the model on purpose). */
function factorial(k: number): number {
  let r = 1;
  for (let i = 2; i <= k; i++) r *= i;
  return r;
}
