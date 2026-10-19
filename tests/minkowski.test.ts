import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  integratePower,
  integrateSumPower,
  minkowskiModel,
  minkowskiValues,
  MINKOWSKI_A_INIT,
  MINKOWSKI_A_MAX,
  MINKOWSKI_A_MIN,
  MINKOWSKI_B_INIT,
  MINKOWSKI_B_MAX,
  MINKOWSKI_B_MIN,
  MINKOWSKI_P_INIT,
  MINKOWSKI_P_MAX,
  MINKOWSKI_P_MIN,
  type MinkowskiData,
} from '../src/chapters/calculus/models/minkowski';
import { minkowskiProblems } from '../src/chapters/calculus/problems/minkowski';

const compute = (state: ControlState): MinkowskiData => syncCompute(minkowskiModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['p', 'a', 'b']);

describe('minkowski: numerical integration against closed forms', () => {
  it('integratePower(q) = 1/(q+1)', () => {
    for (const q of [0, 0.1, 0.5, 1, 2, 4, 6, 12]) {
      expectCloseTo(integratePower(q), 1 / (q + 1), 1e-9);
    }
  });

  it('integrateSumPower(2, 1, 1) = 1 (f + g is identically 1)', () => {
    expectCloseTo(integrateSumPower(2, 1, 1), 1, 1e-9);
  });

  it('integrateSumPower(1, a, b) = 1/(a+1) + 1/(b+1)', () => {
    for (const [a, b] of [[0.1, 0.1], [1, 2], [3, 0.5], [0, 2.5]] as const) {
      expectCloseTo(integrateSumPower(1, a, b), 1 / (a + 1) + 1 / (b + 1), 1e-9);
    }
  });
});

describe('minkowski: the headline case (p, a, b) = (2, 1, 1)', () => {
  it('||f||_2 = ||g||_2 = 1/sqrt(3), ||f+g||_2 = 1', () => {
    const d = minkowskiValues(2, 1, 1);
    expectCloseTo(d.normF, 1 / Math.sqrt(3), 1e-9);
    expectCloseTo(d.normG, 1 / Math.sqrt(3), 1e-9);
    expectCloseTo(d.lhs, 1, 1e-9);
    expectCloseTo(d.rhs, 2 / Math.sqrt(3), 1e-9);
    expectCloseTo(d.gap, 2 / Math.sqrt(3) - 1, 1e-9);
    expectCloseTo(d.gap, 0.15470053837925168, 1e-9);
  });

  it('the model compute agrees with minkowskiValues', () => {
    const d = compute({ p: 2, a: 1, b: 1 });
    const e = minkowskiValues(2, 1, 1);
    expectCloseTo(d.lhs, e.lhs, 1e-12);
    expectCloseTo(d.rhs, e.rhs, 1e-12);
    expectCloseTo(d.gap, e.gap, 1e-12);
    expect(d.p).toBe(2);
    expect(d.a).toBe(1);
    expect(d.b).toBe(1);
  });
});

describe('minkowski: equality case (2, 0, 0)', () => {
  it('f = g = 1 gives gap exactly 0', () => {
    const d = minkowskiValues(2, 0, 0);
    expectCloseTo(d.normF, 1, 1e-9);
    expectCloseTo(d.normG, 1, 1e-9);
    expectCloseTo(d.lhs, 2, 1e-9);
    expectCloseTo(d.rhs, 2, 1e-9);
    expectCloseTo(d.gap, 0, 1e-9);
  });
});

describe('minkowski: gap >= 0 over the parameter grid', () => {
  it('gap is never negative for p in [1, 4]', () => {
    for (const p of [1, 1.25, 1.5, 2, 3, 4]) {
      for (const a of [0, 0.5, 1, 2, 3]) {
        for (const b of [0, 0.5, 1, 2, 3]) {
          const d = minkowskiValues(p, a, b);
          expect(d.gap, `p=${p} a=${a} b=${b}`).toBeGreaterThan(-1e-9);
        }
      }
    }
  });

  it('p = 1 closes the gap for every a, b (linearity of the integral)', () => {
    for (const [a, b] of [[0, 0], [1, 1], [2, 3], [0.5, 2.5]] as const) {
      const d = minkowskiValues(1, a, b);
      expectCloseTo(d.lhs, 1 / (a + 1) + 1 / (b + 1), 1e-9);
      expectCloseTo(d.rhs, 1 / (a + 1) + 1 / (b + 1), 1e-9);
      expectCloseTo(d.gap, 0, 1e-6);
    }
  });
});

describe('minkowski: the p < 1 counterexample (problem 3)', () => {
  it('(1/2, 1, 1): ||f|| = ||g|| = 4/9, ||f+g|| = 1, gap = -1/9', () => {
    const d = minkowskiValues(0.5, 1, 1);
    expectCloseTo(d.normF, 4 / 9, 1e-9);
    expectCloseTo(d.normG, 4 / 9, 1e-9);
    expectCloseTo(d.lhs, 1, 1e-9);
    expectCloseTo(d.rhs, 8 / 9, 1e-9);
    expectCloseTo(d.gap, -1 / 9, 1e-9);
    expect(d.gap).toBeLessThan(0);
  });
});

describe('minkowski: control clamping and ranges', () => {
  it('out-of-range inputs are clamped to the slider ranges', () => {
    const d = compute({ p: 99, a: -5, b: 100 });
    expect(d.p).toBe(MINKOWSKI_P_MAX);
    expect(d.a).toBe(MINKOWSKI_A_MIN);
    expect(d.b).toBe(MINKOWSKI_B_MAX);
  });

  it('non-finite inputs fall back to the slider inits', () => {
    const d = compute({ p: NaN, a: Infinity, b: 'x' });
    expect(d.p).toBe(MINKOWSKI_P_INIT);
    expect(d.a).toBe(MINKOWSKI_A_INIT);
    expect(d.b).toBe(MINKOWSKI_B_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(MINKOWSKI_P_MIN).toBe(1);
    expect(MINKOWSKI_P_MAX).toBe(4);
    expect(MINKOWSKI_A_MIN).toBe(0);
    expect(MINKOWSKI_A_MAX).toBe(3);
    expect(MINKOWSKI_B_MIN).toBe(0);
    expect(MINKOWSKI_B_MAX).toBe(3);
  });
});

describe('minkowski: problem presets use only declared control keys', () => {
  it('every preset key is in {p, a, b}', () => {
    expect(minkowskiProblems).toHaveLength(3);
    for (const problem of minkowskiProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = minkowskiProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
