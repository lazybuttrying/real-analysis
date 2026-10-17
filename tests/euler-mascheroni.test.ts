import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  deltaTerm,
  eulerMascheroniModel,
  GAMMA_TRUE,
  harmonicNumber,
  MAX_N,
  MIN_N,
  DEFAULT_N,
  type EulerMascheroniData,
} from '../src/chapters/series/models/eulerMascheroni';
import { eulerMascheroniProblems } from '../src/chapters/series/problems/euler-mascheroni';

const compute = (state: ControlState): EulerMascheroniData =>
  eulerMascheroniModel.compute(state) as EulerMascheroniData;

/** Independent harmonic numbers: direct summation, no reuse of model internals. */
function naiveHarmonic(n: number): number {
  let sum = 0;
  for (let k = 1; k <= n; k++) sum += 1 / k;
  return sum;
}

/** Independent gamma_n = H_n - ln n. */
function naiveGamma(n: number): number {
  return naiveHarmonic(n) - Math.log(n);
}

/** Independent telescoping partial sum S_n = H_n - ln(n+1). */
function naiveDeltaPartial(n: number): number {
  return naiveHarmonic(n) - Math.log(n + 1);
}

describe('euler-mascheroni: harmonic numbers and gamma_n are the intended values', () => {
  it('H_10 = 2.9289682539682538 exactly', () => {
    expect(harmonicNumber(10)).toBe(2.9289682539682538);
  });

  it('compute reports H_10, ln 10, gamma_10', () => {
    const data = compute({ n: 10 });
    expect(data.hN).toBe(2.9289682539682538);
    expect(data.lnN).toBeCloseTo(2.302585093, 9);
    expect(data.gammaN).toBeCloseTo(0.626383161, 9);
  });

  it('gamma_100 ~= 0.5822', () => {
    expect(compute({ n: 100 }).gammaN).toBeCloseTo(0.5822073317, 8);
  });

  it('model matches the independent naive summation for every n in 1..200', () => {
    for (let n = 1; n <= MAX_N; n++) {
      const data = compute({ n });
      expect(data.hN).toBeCloseTo(naiveHarmonic(n), 14);
      expect(data.gammaN).toBeCloseTo(naiveGamma(n), 14);
      expect(data.deltaPartial).toBeCloseTo(naiveDeltaPartial(n), 14);
    }
  });

  it('deltaPartial telescopes: sum of d_k equals H_n - ln(n+1)', () => {
    for (const n of [1, 10, 50, 100, 200]) {
      const data = compute({ n });
      let sum = 0;
      for (let k = 1; k <= n; k++) sum += deltaTerm(k);
      expect(data.deltaPartial).toBeCloseTo(sum, 12);
      expect(data.deltaPartial).toBeCloseTo(data.hN - Math.log(n + 1), 12);
    }
  });

  it('d_k is positive and decreasing for k = 1..200', () => {
    let prev = Infinity;
    for (let k = 1; k <= 200; k++) {
      const d = deltaTerm(k);
      expect(d).toBeGreaterThan(0);
      expect(d).toBeLessThan(prev);
      prev = d;
    }
  });
});

describe('euler-mascheroni: gamma_n decreases monotonically and stays in (0.5, 0.6)', () => {
  it('gamma_n is strictly decreasing for n = 1..200', () => {
    let prev = Infinity;
    for (let n = 1; n <= MAX_N; n++) {
      const g = naiveGamma(n);
      expect(g).toBeLessThan(prev);
      prev = g;
    }
  });

  it('0.5 < gamma_200 < 0.6', () => {
    const g200 = compute({ n: 200 }).gammaN;
    expect(g200).toBeGreaterThan(0.5);
    expect(g200).toBeLessThan(0.6);
  });

  it('the hint inequality 1/(n+1) < ln(n+1) - ln n < 1/n holds for n = 1..200', () => {
    for (let n = 1; n <= 200; n++) {
      const gap = Math.log(n + 1) - Math.log(n);
      expect(1 / (n + 1)).toBeLessThan(gap);
      expect(gap).toBeLessThan(1 / n);
    }
  });
});

describe('euler-mascheroni: the asymptote constant', () => {
  it('GAMMA_TRUE is the literature value 0.5772156649015329', () => {
    expect(GAMMA_TRUE).toBe(0.5772156649015329);
  });

  it('gamma_n approaches GAMMA_TRUE from above', () => {
    const g200 = compute({ n: 200 }).gammaN;
    expect(g200).toBeGreaterThan(GAMMA_TRUE);
    expect(g200 - GAMMA_TRUE).toBeLessThan(0.003);
  });
});

describe('euler-mascheroni: problem caption numbers check out', () => {
  it('problem 1 preset n = 50: H_50, ln 50, gamma_50', () => {
    const data = compute({ n: 50 });
    expect(data.hN).toBeCloseTo(4.499205338, 9);
    expect(data.lnN).toBeCloseTo(3.912023005, 9);
    expect(data.gammaN).toBeCloseTo(0.5871823329, 10);
    // the one-step drop gamma_50 - gamma_51 = ln(51/50) - 1/51
    expect(data.gammaN - compute({ n: 51 }).gammaN).toBeCloseTo(Math.log(51 / 50) - 1 / 51, 12);
    expect(Math.log(51 / 50) - 1 / 51).toBeCloseTo(0.0001947842, 10);
  });

  it('problem 2 preset n = 100: H_100 - ln 101 = 0.5722570008', () => {
    const data = compute({ n: 100 });
    expect(data.hN).toBeCloseTo(5.187377518, 9);
    expect(data.deltaPartial).toBeCloseTo(0.5722570008, 10);
    expect(data.deltaPartial).toBeCloseTo(data.hN - Math.log(101), 12);
    // the caption identity: deltaPartial = gamma_n - ln(1 + 1/n)
    expect(data.deltaPartial).toBeCloseTo(data.gammaN - Math.log(1 + 1 / 100), 12);
  });

  it('problem 3 preset n = 10: partial sum 0.5310729812, tail bound 0.05', () => {
    const data = compute({ n: 10 });
    expect(data.deltaPartial).toBeCloseTo(0.5310729812, 10);
    expect(data.deltaPartial).toBeGreaterThan(0.5); // lower bound for gamma
    // convexity tail bound: sum_{k>=11} 1/(k(2k+1)) < 1/20
    let tail = 0;
    for (let k = 11; k <= 200000; k++) tail += 1 / (k * (2 * k + 1));
    expect(tail).toBeLessThan(0.05);
    // proof interval (0.5311, 0.5811) lies inside (0.5, 0.6)
    expect(0.5310729812 + 0.05).toBeLessThan(0.6);
  });
});

describe('euler-mascheroni: problem presets use the scene control keys', () => {
  it('has 3 problems with ids, bilingual text, and valid presets', () => {
    expect(eulerMascheroniProblems).toHaveLength(3);
    expect(eulerMascheroniProblems.map((p) => p.id)).toEqual([
      'euler-mascheroni-decreasing',
      'euler-mascheroni-series',
      'euler-mascheroni-bounds',
    ]);
    for (const problem of eulerMascheroniProblems) {
      expect(problem.statement.ko.length).toBeGreaterThan(0);
      expect(problem.statement.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of problem.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      // preset uses the scene's real control key 'n', within slider range
      const n = Number(problem.preset['n']);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(MIN_N);
      expect(n).toBeLessThanOrEqual(MAX_N);
    }
  });
});

describe('euler-mascheroni: model.compute reads and clamps the controls', () => {
  it('returns n terms with consistent running values', () => {
    const data = compute({ n: 10 });
    expect(data.n).toBe(10);
    expect(data.terms).toHaveLength(10);
    expect(data.terms[9]?.k).toBe(10);
    expect(data.terms[9]?.h).toBeCloseTo(data.hN, 15);
    expect(data.terms[9]?.gamma).toBeCloseTo(data.gammaN, 15);
    expect(data.terms[0]?.ln).toBe(0); // ln 1
    expect(data.terms[0]?.gamma).toBe(1); // H_1 - ln 1
  });

  it('clamps n below 1 to 1 and above 200 to 200', () => {
    expect(compute({ n: -5 }).n).toBe(MIN_N);
    expect(compute({ n: 10000 }).n).toBe(MAX_N);
  });

  it('defaults to n = 50 on missing/invalid input', () => {
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ n: NaN }).n).toBe(DEFAULT_N);
  });
});
