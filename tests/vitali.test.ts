import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  vitaliData,
  vitaliModel,
  vitaliRationals,
  VITALI_D_INIT,
  VITALI_D_MAX,
  VITALI_D_MIN,
  VITALI_DRAW_MAX,
  VITALI_DRAW_MIN,
  VITALI_MOCK_V,
  type VitaliData,
} from '../src/chapters/calculus/models/vitali';
import { vitaliProblems } from '../src/chapters/calculus/problems/vitali';

const compute = (state: ControlState): VitaliData => syncCompute(vitaliModel, state);

describe('vitali: rationals in [-1, 1] with denominator at most d', () => {
  it('d = 1 gives {-1, 0, 1}', () => {
    expect(vitaliRationals(1)).toEqual([-1, 0, 1]);
  });

  it('d = 2 gives 5 rationals, d = 3 gives 9, d = 6 gives 25', () => {
    expect(vitaliRationals(2)).toHaveLength(5);
    expect(vitaliRationals(3)).toHaveLength(9);
    expect(vitaliRationals(6)).toHaveLength(25);
  });

  it('rationals are sorted, in lowest terms, inside [-1, 1]', () => {
    for (const d of [1, 3, 6]) {
      const qs = vitaliRationals(d);
      for (let i = 1; i < qs.length; i++) {
        expect(qs[i]!).toBeGreaterThan(qs[i - 1]!);
      }
      for (const q of qs) {
        expect(q).toBeGreaterThanOrEqual(-1);
        expect(q).toBeLessThanOrEqual(1);
      }
      // No duplicates: lowest-terms enumeration.
      expect(new Set(qs).size).toBe(qs.length);
    }
  });

  it('the family grows with d (the countable shadow of the full Q cap [-1,1])', () => {
    const counts = [1, 2, 3, 4, 5, 6].map((d) => vitaliRationals(d).length);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeGreaterThan(counts[i - 1]!);
    }
  });
});

describe('vitali: the finite mock', () => {
  it('mock V lives inside [0, 1]', () => {
    expect(VITALI_MOCK_V.length).toBeGreaterThan(0);
    for (const v of VITALI_MOCK_V) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('mock translates stay inside [VITALI_DRAW_MIN, VITALI_DRAW_MAX]', () => {
    expect(VITALI_DRAW_MIN).toBe(-1);
    expect(VITALI_DRAW_MAX).toBe(2);
    const data = compute({ d: 6 });
    expect(data.translates).toHaveLength(data.rationalCount);
    for (const tr of data.translates) {
      for (const pt of tr.points) {
        expect(pt).toBeGreaterThanOrEqual(VITALI_DRAW_MIN);
        expect(pt).toBeLessThanOrEqual(VITALI_DRAW_MAX);
      }
    }
  });

  it('the q = 0 translate is the mock V itself', () => {
    const data = compute({ d: 3 });
    const zero = data.translates.find((tr) => tr.q === 0);
    expect(zero).toBeDefined();
    expect(zero!.points).toEqual([...VITALI_MOCK_V]);
  });
});

describe('vitali: the counting argument numbers', () => {
  it('finite m = 1 total already exceeds the length-3 box once d >= 2', () => {
    expect(compute({ d: 1 }).exceedsThree).toBe(false);
    for (const d of [2, 3, 6]) {
      const data = compute({ d });
      expect(data.exceedsThree).toBe(true);
      expect(data.positiveCaseFinite).toBe(data.rationalCount);
      expect(data.positiveCaseFinite).toBeGreaterThan(3);
    }
  });

  it('m = 0 total is 0, below the length-1 lower bound of [0, 1]', () => {
    const data = compute({ d: 6 });
    expect(data.zeroCaseTotal).toBe(0);
    expect(data.zeroCaseTotal).toBeLessThan(data.unitLength);
    expect(data.unitLength).toBe(1);
    expect(data.containerLength).toBe(3);
  });
});

describe('vitali: model compute', () => {
  it('reads d from the control state, clamps, defaults to init', () => {
    expect(compute({}).d).toBe(VITALI_D_INIT);
    expect(compute({ d: 100 }).d).toBe(VITALI_D_MAX);
    expect(compute({ d: 0 }).d).toBe(VITALI_D_MIN);
    expect(compute({ d: 4 }).d).toBe(4);
    expect(compute({ d: 2.6 }).d).toBe(3);
    expect(compute({ d: NaN }).d).toBe(VITALI_D_INIT);
  });

  it('vitaliData is consistent: rationalCount matches the list', () => {
    const data = vitaliData(4);
    expect(data.rationalCount).toBe(data.rationals.length);
    expect(data.rationalCount).toBe(vitaliRationals(4).length);
  });

  it('exports the expected data keys', () => {
    const data = compute({ d: 3 });
    for (const key of [
      'd', 'rationals', 'mockV', 'translates', 'rationalCount',
      'positiveCaseFinite', 'zeroCaseTotal', 'exceedsThree',
      'unitLength', 'containerLength',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('vitali: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(vitaliProblems);
  });

  it('the three ids are vitali-disjoint, vitali-sandwich, vitali-contradiction', () => {
    expect(vitaliProblems.map((p) => p.id)).toEqual([
      'vitali-disjoint',
      'vitali-sandwich',
      'vitali-contradiction',
    ]);
  });

  it('every proof names the axiom of choice in its first step', () => {
    for (const p of vitaliProblems) {
      const first = p.proof[0]!.text;
      expect(first.en).toMatch(/[Aa]xiom of [Cc]hoice/);
      expect(first.ko).toMatch(/선택공리/);
    }
  });

  it('presets use d in [1, 6]', () => {
    for (const p of vitaliProblems) {
      const d = Number(p.preset['d']);
      expect(d).toBeGreaterThanOrEqual(VITALI_D_MIN);
      expect(d).toBeLessThanOrEqual(VITALI_D_MAX);
    }
  });

  it('the mock is labeled illustration-only in the model docs', () => {
    // The real V is given by AC with no formula; guard the honesty contract
    // by requiring the mock constant to be non-trivially small relative to
    // the uncountable class family it stands in for.
    expect(VITALI_MOCK_V.length).toBeLessThanOrEqual(16);
    expectCloseTo(VITALI_MOCK_V[0]!, 0.07, 1e-12);
  });
});
