import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  aValue,
  DEFAULT_ASEL,
  DEFAULT_N,
  DEFAULT_P,
  gaussRatio,
  gaussTerms,
  kummerData,
  kummerFormulaPN,
  kummerModel,
  MAX_N,
  MIN_N,
  pTerm,
  type ASel,
  type KummerData,
  type PKind,
} from '../src/chapters/series/models/kummerTest';
import { kummerTestProblems } from '../src/chapters/series/problems/kummer-test';

const compute = (state: ControlState): KummerData =>
  kummerModel.compute(state) as KummerData;

const PKINDS: PKind[] = ['p1', 'pn', 'pnlogn'];
const ASELS: ASel[] = ['a2', 'ahalf'];

describe('kummer-test: the Gauss example closed form a_n = 2/((n+1)(n+2)) for a = 2', () => {
  it('gaussTerms(2, n+1) matches the closed form for n = 1..50', () => {
    const terms = gaussTerms(2, 51);
    for (let n = 1; n <= 50; n++) {
      expect(terms[n - 1]).toBeCloseTo(2 / ((n + 1) * (n + 2)), 14);
    }
  });

  it('the closed form telescopes to sum 1', () => {
    let sum = 0;
    for (let n = 1; n <= 100000; n++) sum += 2 / ((n + 1) * (n + 2));
    expect(sum).toBeCloseTo(1 - 2 / 100002, 12);
  });

  it('the recurrence builds a_1 = 1/(a+1) correctly for both a values', () => {
    expect(gaussTerms(2, 1)[0]).toBe(1 / 3);
    expect(gaussTerms(0.5, 1)[0]).toBe(1 / 1.5);
  });
});

describe('kummer-test: closed-form K_n = (n-1)/(n+1) for a = 2, p_n = n', () => {
  it('K_1 = 0, K_2 = 1/3, K_100 = 99/101', () => {
    const data = compute({ pKind: 'pn', aSel: 'a2', n: 100 });
    expect(data.kummer[0]).toBe(0);
    expect(data.kummer[1]).toBeCloseTo(1 / 3, 14);
    expect(data.kummer[99]).toBeCloseTo(99 / 101, 13);
    expect(data.kummer[99]).toBeCloseTo(0.9801980198, 10);
  });

  it('the identity K_n = n(n+a+1)/(n+1) - (n+1) equals (n-1)/(n+1) by direct algebra', () => {
    for (const k of [1, 2, 3, 100, 500]) {
      const viaFormula = kummerFormulaPN(2, k);
      const viaAlgebra = (k * (k + 2 + 1)) / (k + 1) - (k + 1);
      expect(viaFormula).toBeCloseTo(viaAlgebra, 12);
      expect(viaFormula).toBeCloseTo((k - 1) / (k + 1), 12);
    }
  });

  it('K_n >= 1/2 for n >= 3 and K_3 = 1/2 exactly', () => {
    const data = compute({ pKind: 'pn', aSel: 'a2', n: 10 });
    expect(data.kummer[2]).toBe(0.5);
    for (let k = 3; k <= 10; k++) {
      expect(data.kummer[k - 1] as number).toBeGreaterThanOrEqual(0.5);
    }
  });
});

describe('kummer-test: a = 1/2, p_n = n gives K_n = (-0.5n-1)/(n+1)', () => {
  it('K_1 = -0.75 and K_100 = -51/101 ~= -0.505', () => {
    const data = compute({ pKind: 'pn', aSel: 'ahalf', n: 100 });
    expect(data.kummer[0]).toBe(-0.75);
    expect(data.kummer[99]).toBeCloseTo(-51 / 101, 13);
    expect(data.kummer[99]).toBeCloseTo(-0.504950495, 9);
    expect(data.kummer[99]).toBeLessThan(0);
  });

  it('kummerFormulaPN(0.5, k) matches the algebra', () => {
    for (const k of [1, 2, 100, 500]) {
      expect(kummerFormulaPN(0.5, k)).toBeCloseTo((-0.5 * k - 1) / (k + 1), 12);
    }
  });
});

describe('kummer-test: the ratio test is inconclusive (ratio -> 1)', () => {
  it('|a_n/a_{n+1} - 1| = a/(n+1) < 0.02 at n = 500 for both a values', () => {
    for (const sel of ASELS) {
      const a = aValue(sel);
      expect(gaussRatio(a, 500)).toBeCloseTo(1 + a / 501, 14);
      expect(Math.abs(gaussRatio(a, 500) - 1)).toBeLessThan(0.02);
    }
  });

  it('the naive term recurrence agrees with the closed-form ratio', () => {
    for (const sel of ASELS) {
      const a = aValue(sel);
      const terms = gaussTerms(a, 501);
      const naiveRatio = (terms[499] ?? 0) / (terms[500] ?? 1);
      expect(naiveRatio).toBeCloseTo(gaussRatio(a, 500), 14);
    }
  });

  it('p_n = 1 gives K_n = a/(n+1) -> 0 (inconclusive by itself)', () => {
    for (const sel of ASELS) {
      const a = aValue(sel);
      const data = compute({ pKind: 'p1', aSel: sel, n: 100 });
      expect(data.kummer[0]).toBeCloseTo(a / 2, 14); // K_1 = a/2
      expect(data.kummer[99]).toBeCloseTo(a / 101, 14);
      expect(data.limit).toBe(0);
    }
  });
});

describe('kummer-test: kummer values match the direct p_n * ratio - p_{n+1} computation', () => {
  it('model agrees with the closed-form ratio for every pKind and aSel', () => {
    for (const pKind of PKINDS) {
      for (const sel of ASELS) {
        const a = aValue(sel);
        const data = kummerData(pKind, sel, 100);
        for (let k = 1; k <= 100; k++) {
          const expected = pTerm(pKind, k) * gaussRatio(a, k) - pTerm(pKind, k + 1);
          expect(data.kummer[k - 1]).toBeCloseTo(expected, 12);
        }
      }
    }
  });
});

describe('kummer-test: p_n = n ln(n+1) empirical sign pattern', () => {
  it('for a = 2 the K_n are eventually positive and growing', () => {
    const data = compute({ pKind: 'pnlogn', aSel: 'a2', n: 500 });
    for (let k = 50; k <= 500; k++) {
      expect(data.kummer[k - 1] as number).toBeGreaterThan(0);
    }
    const k100 = data.kummer[99] as number;
    const k500 = data.kummer[499] as number;
    expect(k100).toBeCloseTo(3.528650051, 6);
    expect(k500).toBeCloseTo(5.1927859882, 6);
    expect(k500).toBeGreaterThan(k100); // growing trend
    expect(data.limit).toBe(Infinity);
  });

  it('for a = 1/2 the K_n are eventually negative', () => {
    const data = compute({ pKind: 'pnlogn', aSel: 'ahalf', n: 500 });
    for (let k = 50; k <= 500; k++) {
      expect(data.kummer[k - 1] as number).toBeLessThan(0);
    }
    expect(data.kummer[99]).toBeCloseTo(-3.3254893304, 6);
    expect(data.limit).toBe(-Infinity);
  });
});

describe('kummer-test: the limit field', () => {
  it('p_n = n gives limit a - 1', () => {
    expect(compute({ pKind: 'pn', aSel: 'a2', n: 100 }).limit).toBe(1);
    expect(compute({ pKind: 'pn', aSel: 'ahalf', n: 100 }).limit).toBe(-0.5);
  });
});

describe('kummer-test: compute clamps and defaults', () => {
  it('clamps n into [10, 500]', () => {
    expect(compute({ n: -5 }).n).toBe(MIN_N);
    expect(compute({ n: 0 }).n).toBe(MIN_N);
    expect(compute({ n: 10000 }).n).toBe(MAX_N);
    expect(compute({ n: 9 }).n).toBe(MIN_N);
    expect(compute({ n: 501 }).n).toBe(MAX_N);
  });

  it('defaults to n = 100 on missing/invalid input', () => {
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ n: NaN }).n).toBe(DEFAULT_N);
  });

  it('defaults invalid selects to pn / a2', () => {
    const data = compute({ pKind: 'nope', aSel: 'nope', n: 50 });
    expect(data.pKind).toBe(DEFAULT_P);
    expect(data.aSel).toBe(DEFAULT_ASEL);
  });

  it('returns ks = 1..n with matching kummer array', () => {
    const data = compute({ n: 42 });
    expect(data.ks).toHaveLength(42);
    expect(data.kummer).toHaveLength(42);
    expect(data.ks[0]).toBe(1);
    expect(data.ks[41]).toBe(42);
  });
});

describe('kummer-test: problem presets use only the scene control keys', () => {
  it('has 3 problems with ids, bilingual text, and >= 3 proof steps', () => {
    expect(kummerTestProblems).toHaveLength(3);
    expect(kummerTestProblems.map((p) => p.id)).toEqual([
      'kummer-proof',
      'kummer-raabe',
      'kummer-gauss-example',
    ]);
    for (const problem of kummerTestProblems) {
      expect(problem.statement.ko.length).toBeGreaterThan(0);
      expect(problem.statement.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of problem.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
    }
  });

  it("presets use only keys 'pKind', 'aSel', 'n' with values in the valid ranges", () => {
    for (const problem of kummerTestProblems) {
      const keys = Object.keys(problem.preset);
      expect(keys.every((k) => k === 'pKind' || k === 'aSel' || k === 'n')).toBe(true);
      const pKind = String(problem.preset['pKind'] ?? '');
      const aSel = String(problem.preset['aSel'] ?? '');
      const n = Number(problem.preset['n']);
      expect(['p1', 'pn', 'pnlogn']).toContain(pKind);
      expect(['a2', 'ahalf']).toContain(aSel);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(MIN_N);
      expect(n).toBeLessThanOrEqual(MAX_N);
    }
  });
});

describe('kummer-test: problem caption numbers check out', () => {
  it('problems 1 and 2 (p_n = n, a = 2, n = 100): K_1 = 0, K_2 = 1/3, K_100 = 99/101', () => {
    const data = compute({ pKind: 'pn', aSel: 'a2', n: 100 });
    expect(data.kummer[0]).toBe(0);
    expect(data.kummer[1]).toBeCloseTo(1 / 3, 12);
    expect(data.kummer[99]).toBeCloseTo(0.9802, 4);
    // Raabe limit check: n(a_n/a_{n+1} - 1) = 2n/(n+1) -> 2 = L
    expect(100 * (gaussRatio(2, 100) - 1)).toBeCloseTo(200 / 101, 12);
  });

  it('problem 3 (p_n = n, a = 1/2, n = 100): K_1 = -0.75, K_100 ~= -0.505', () => {
    const data = compute({ pKind: 'pn', aSel: 'ahalf', n: 100 });
    expect(data.kummer[0]).toBe(-0.75);
    expect(data.kummer[99]).toBeCloseTo(-0.505, 3);
    // and the a = 2 caption value at the same n
    const data2 = compute({ pKind: 'pn', aSel: 'a2', n: 100 });
    expect(data2.kummer[99]).toBeCloseTo(0.9802, 4);
  });
});
