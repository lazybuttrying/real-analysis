import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  cosineCoefficient,
  DEFAULT_DEGREE,
  GRID_POINTS,
  MAX_DEGREE,
  MIN_DEGREE,
  stoneWeierstrassData,
  stoneWeierstrassModel,
  targetFn,
  trigPartialSum,
  type StoneWeierstrassData,
} from '../src/chapters/limits/models/stoneWeierstrass';
import { stoneWeierstrassProblems } from '../src/chapters/limits/problems/stone-weierstrass';

const compute = (state: ControlState): StoneWeierstrassData => syncCompute(stoneWeierstrassModel, state);

/** Numerical quadrature reference: (2/pi) * integral_0^pi x cos(kx) dx. */
function numericCoefficient(k: number): number {
  const N = 200000;
  const a = 0;
  const b = Math.PI;
  let s = 0;
  for (let i = 0; i <= N; i++) {
    const x = a + ((b - a) * i) / N;
    const w = i === 0 || i === N ? 0.5 : 1;
    s += w * x * Math.cos(k * x);
  }
  return (2 / Math.PI) * (s * (b - a)) / N;
}

describe('stone-weierstrass: the coefficient identity a_k = (2/pi)((-1)^k - 1)/k^2', () => {
  it('matches numerical quadrature of the defining integral for k = 1..6', () => {
    for (const k of [1, 2, 3, 4, 5, 6]) {
      const closed = (2 / Math.PI) * ((k % 2 === 1 ? -2 : 0) / (k * k));
      expectCloseTo(numericCoefficient(k), closed, 1e-7);
      expectCloseTo(cosineCoefficient(k), closed, 1e-15);
    }
  });

  it('even k vanish and odd k contribute -4/(pi k^2)', () => {
    for (const k of [2, 4, 10]) {
      expect(cosineCoefficient(k)).toBe(0);
    }
    for (const k of [1, 3, 5, 9]) {
      expect(cosineCoefficient(k)).toBeCloseTo(-4 / (Math.PI * k * k), 14);
    }
  });
});

describe('stone-weierstrass: S_n matches the cosineCoefficient-based sum', () => {
  it('trigPartialSum(x, n) equals pi/2 + sum_{k=1..n} a_k cos(kx)', () => {
    for (const n of [1, 8, 25]) {
      for (const x of [-Math.PI, -1.7, -0.05, 0.5, 2.3, Math.PI]) {
        let s = Math.PI / 2;
        for (let k = 1; k <= n; k++) s += cosineCoefficient(k) * Math.cos(k * x);
        expectCloseTo(trigPartialSum(x, n), s, 1e-12);
      }
    }
  });
});

describe('stone-weierstrass: the full series sums to the triangle wave at 0', () => {
  it('S_100(0) is within the tail bound of the identity sum_{odd k} 1/k^2 = pi^2/8', () => {
    // S(0) = pi/2 - (4/pi) sum_{odd k} 1/k^2 = pi/2 - (4/pi)(pi^2/8) = 0 = f(0).
    // Tail beyond n = 100: sum_{odd k > 100} 1/k^2 < sum_{k > 100} 1/k^2 < 1/100.
    const s0 = trigPartialSum(0, 100);
    expect(Math.abs(s0)).toBeLessThan((4 / Math.PI) * (1 / 100));
    expect(targetFn(0)).toBe(0);
  });
});

describe('stone-weierstrass: maxErr values quoted in the model and problems', () => {
  it('maxErr on the 400-point grid equals the documented numbers', () => {
    expectCloseTo(stoneWeierstrassData(1).maxErr, 0.2976, 1e-3);
    expectCloseTo(stoneWeierstrassData(8).maxErr, 0.0792, 1e-3);
    expectCloseTo(stoneWeierstrassData(25).maxErr, 0.0245, 1e-3);
    expectCloseTo(stoneWeierstrassData(40).maxErr, 0.0159, 1e-3);
  });

  it('maxErr shrinks (non-increasing) as the degree grows: uniform convergence', () => {
    const errs = [1, 2, 4, 8, 15, 25, 40].map((n) => stoneWeierstrassData(n).maxErr);
    for (let i = 1; i < errs.length; i++) {
      expect(errs[i] as number).toBeLessThanOrEqual(errs[i - 1] as number);
    }
    // Error more than halves between degree 8 and 40: genuinely shrinking.
    expect(errs[errs.length - 1] as number).toBeLessThan((errs[3] as number) / 2);
  });
});

describe('stone-weierstrass: model compute behavior', () => {
  it('defaults to degree 8, clamps outside [1, 40], floors fractional input', () => {
    expect(compute({}).degree).toBe(DEFAULT_DEGREE);
    expect(compute({}).degree).toBe(8);
    expect(compute({ degree: 0 }).degree).toBe(MIN_DEGREE);
    expect(compute({ degree: 100 }).degree).toBe(MAX_DEGREE);
    expect(compute({ degree: 8.9 }).degree).toBe(8);
  });

  it('produces a 400-point grid on [-pi, pi] with f(x) = |x|', () => {
    const data = compute({ degree: 8 });
    expect(data.samples).toHaveLength(GRID_POINTS);
    expect(data.samples[0]?.x).toBeCloseTo(-Math.PI, 14);
    expect(data.samples[GRID_POINTS - 1]?.x).toBeCloseTo(Math.PI, 14);
    for (const s of data.samples) {
      expect(s.y).toBeCloseTo(targetFn(s.x), 15);
    }
  });

  it('maxErr is the grid max of |f - S_n|', () => {
    const data = compute({ degree: 8 });
    let max = 0;
    for (const s of data.samples) {
      max = Math.max(max, Math.abs(s.y - s.p));
    }
    expect(data.maxErr).toBeCloseTo(max, 15);
  });
});

describe('stone-weierstrass: problem presets are valid for the scene controls', () => {
  it('exports exactly 3 problems with unique ids', () => {
    expect(stoneWeierstrassProblems).toHaveLength(3);
    const ids = stoneWeierstrassProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('every preset computes to the maxErr quoted in its caption', () => {
    const quoted: Record<string, number> = { 'trig-algebra': 0.0792, 'abs-lemma': 0.0792, 'lattice-density': 0.0245 };
    for (const problem of stoneWeierstrassProblems) {
      const degree = Number(problem.preset['degree']);
      expect(degree).toBeGreaterThanOrEqual(MIN_DEGREE);
      expect(degree).toBeLessThanOrEqual(MAX_DEGREE);
      const data = compute(problem.preset);
      expectCloseTo(data.maxErr, quoted[problem.id] as number, 1e-3);
      expect(problem.presetCaption.ko).toContain(`n = ${degree}`);
      expect(problem.proof.length).toBeGreaterThan(0);
    }
  });
});
