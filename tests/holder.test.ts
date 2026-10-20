import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  conjugateExponent,
  holderModel,
  HOLDER_N_INIT,
  HOLDER_N_MAX,
  HOLDER_N_MIN,
  HOLDER_P_INIT,
  HOLDER_P_MAX,
  HOLDER_P_MIN,
  type HolderData,
} from '../src/chapters/limits/models/holder';
import { holderProblems } from '../src/chapters/limits/problems/holder';

const compute = (state: ControlState): HolderData => syncCompute(holderModel, state);

describe('holder: conjugate exponents', () => {
  it('q = p/(p-1): 2 <-> 2, 3 <-> 1.5', () => {
    expectCloseTo(conjugateExponent(2), 2, 1e-15);
    expectCloseTo(conjugateExponent(3), 1.5, 1e-15);
    expectCloseTo(conjugateExponent(1.1), 11, 1e-9);
  });
});

describe('holder: the model values', () => {
  it('a = (1, 1/2, ..., 1/n), b = (1, ..., 1)', () => {
    const data = compute({ p: 2, n: 8 });
    expect(data.a).toHaveLength(8);
    expect(data.b).toHaveLength(8);
    expect(data.a[0]).toBe(1);
    expectCloseTo(data.a[7]!, 1 / 8, 1e-15);
    expect(data.b.every((v) => v === 1)).toBe(true);
  });

  it('LHS is the harmonic number H_n', () => {
    for (const n of [2, 8, 30]) {
      const data = compute({ p: 2, n });
      let h = 0;
      for (let k = 1; k <= n; k++) h += 1 / k;
      expectCloseTo(data.lhs, h, 1e-12);
    }
    expectCloseTo(compute({ p: 2, n: 8 }).lhs, 2.7178571428571425, 1e-12);
  });

  it('p = 3, n = 8: RHS ~ 4.245, gap positive', () => {
    const data = compute({ p: 3, n: 8 });
    expectCloseTo(data.q, 1.5, 1e-12);
    expectCloseTo(data.rhs, 4.245, 1e-3);
    expect(data.gap).toBeGreaterThan(0);
    expectCloseTo(data.rhs, data.rhsA * data.rhsB, 1e-12);
    expectCloseTo(data.gap, data.rhs - data.lhs, 1e-12);
  });

  it('p = 2 marks the Cauchy-Schwarz case', () => {
    expect(compute({ p: 2, n: 8 }).isCauchySchwarz).toBe(true);
    expect(compute({ p: 2.1, n: 8 }).isCauchySchwarz).toBe(false);
    expect(compute({ p: 1.1, n: 8 }).isCauchySchwarz).toBe(false);
  });

  it('rhsB = n^{1/q} for the all-ones vector', () => {
    const data = compute({ p: 3, n: 8 });
    expectCloseTo(data.rhsB, Math.pow(8, 1 / 1.5), 1e-12);
  });
});

describe('holder: the inequality holds on a full sweep', () => {
  it('gap >= 0 for p in {1.1, 1.5, 2, 3, 5, 8} and n in {2, 8, 30}', () => {
    for (const p of [1.1, 1.5, 2, 3, 5, 8]) {
      for (const n of [2, 8, 30]) {
        const data = compute({ p, n });
        expect(data.gap).toBeGreaterThanOrEqual(-1e-9);
        expect(data.lhs).toBeLessThanOrEqual(data.rhs + 1e-9);
      }
    }
  });

  it('the gap closes as p -> 1+', () => {
    const nearOne = compute({ p: 1.1, n: 8 }).gap;
    const atTwo = compute({ p: 2, n: 8 }).gap;
    expect(nearOne).toBeGreaterThanOrEqual(0);
    expect(nearOne).toBeLessThan(atTwo);
    expect(nearOne).toBeLessThan(0.1);
  });

  it('strict inequality here: a_k = 1/k is not proportional to b_k = 1', () => {
    expect(compute({ p: 2, n: 8 }).gap).toBeGreaterThan(0.5);
  });
});

describe('holder: model compute', () => {
  it('reads p and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).p).toBe(HOLDER_P_INIT);
    expect(compute({}).n).toBe(HOLDER_N_INIT);
    expect(compute({ p: 100 }).p).toBe(HOLDER_P_MAX);
    expect(compute({ p: 0.5 }).p).toBe(HOLDER_P_MIN);
    expect(compute({ p: 3 }).p).toBe(3);
    expect(compute({ n: 100 }).n).toBe(HOLDER_N_MAX);
    expect(compute({ n: 0 }).n).toBe(HOLDER_N_MIN);
    expect(compute({ n: 2.4 }).n).toBe(2);
  });

  it('exports the expected data keys', () => {
    const data = compute({ p: 2, n: 8 });
    for (const key of [
      'p', 'q', 'n', 'a', 'b', 'lhs', 'rhsA', 'rhsB', 'rhs', 'gap', 'isCauchySchwarz',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('holder: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(holderProblems);
  });

  it('the three ids are holder-young, holder-from-young, holder-equality', () => {
    expect(holderProblems.map((p) => p.id)).toEqual([
      'holder-young',
      'holder-from-young',
      'holder-equality',
    ]);
  });

  it('presets use p in [1.1, 8] and n in [2, 30]', () => {
    for (const p of holderProblems) {
      const pp = Number(p.preset['p']);
      const nn = Number(p.preset['n']);
      expect(pp).toBeGreaterThanOrEqual(HOLDER_P_MIN);
      expect(pp).toBeLessThanOrEqual(HOLDER_P_MAX);
      expect(nn).toBeGreaterThanOrEqual(HOLDER_N_MIN);
      expect(nn).toBeLessThanOrEqual(HOLDER_N_MAX);
    }
  });
});
