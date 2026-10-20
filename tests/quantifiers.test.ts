import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  QUANTIFIER_STATEMENT_INIT,
  QUANTIFIERS_NEGATED_INIT,
  QUANTIFIERS_X_INIT,
  QUANTIFIERS_X_MAX,
  QUANTIFIERS_X_MIN,
  quantifierData,
  quantifiersModel,
  type QuantifierData,
  type QuantifierStatement,
} from '../src/chapters/limits/models/quantifiers';
import { quantifiersProblems } from '../src/chapters/limits/problems/quantifiers';

const compute = (state: ControlState): QuantifierData => syncCompute(quantifiersModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['statement', 'x', 'negated']);

const STATEMENTS: readonly QuantifierStatement[] = ['forall-exists', 'exists-forall', 'eps-delta'];

describe('quantifiers: forall-exists is true with witness y = x + 1', () => {
  it('truth value is true and the witness beats the challenge', () => {
    for (const x of [-5, -2.5, 0, 2, 5]) {
      const d = quantifierData('forall-exists', x);
      expect(d.truthValue).toBe(true);
      expect(d.challengerX).toBe(x);
      expectCloseTo(d.witness, x + 1, 1e-12);
      expect(d.witness).toBeGreaterThan(d.challengerX);
    }
  });

  it('negation chain pushes ¬ inward and flips ∀↔∃', () => {
    const steps = quantifierData('forall-exists', 2).negationSteps;
    expect(steps[0]).toBe('¬(∀x ∃y (y > x))');
    expect(steps[steps.length - 1]).toBe('∃x ∀y (y ≤ x)');
    expect(steps).toHaveLength(4);
  });
});

describe('quantifiers: exists-forall is false; the refutation x\' = y + 1', () => {
  it('truth value is false and the refuting point defeats the candidate', () => {
    for (const x of [-5, -2.5, 0, 2, 5]) {
      const d = quantifierData('exists-forall', x);
      expect(d.truthValue).toBe(false);
      expect(d.candidateY).toBe(x);
      expectCloseTo(d.refutingX, x + 1, 1e-12);
      // The candidate fails: y > x' is false.
      expect(d.candidateY > d.refutingX).toBe(false);
    }
  });

  it('negation chain ends in ∀y ∃x (y ≤ x)', () => {
    const steps = quantifierData('exists-forall', 2).negationSteps;
    expect(steps[0]).toBe('¬(∃y ∀x (y > x))');
    expect(steps[steps.length - 1]).toBe('∀y ∃x (y ≤ x)');
    expect(steps).toHaveLength(4);
  });
});

describe('quantifiers: eps-delta is true with delta = eps/2', () => {
  it('eps = |x| + 0.5, delta = eps/2, probe satisfies the implication', () => {
    for (const x of [-5, -2.5, 0, 2, 5]) {
      const d = quantifierData('eps-delta', x);
      expect(d.truthValue).toBe(true);
      expectCloseTo(d.eps, Math.abs(x) + 0.5, 1e-12);
      expect(d.eps).toBeGreaterThan(0);
      expectCloseTo(d.delta, d.eps / 2, 1e-12);
      expectCloseTo(d.probeT, 0.9 * d.delta, 1e-12);
      expectCloseTo(d.probeValue, 1.8 * d.delta, 1e-12);
      // |t| < delta and |2t| < eps.
      expect(Math.abs(d.probeT)).toBeLessThan(d.delta);
      expect(d.probeValue).toBeLessThan(d.eps);
    }
  });

  it('the headline numbers at x = 2 (used by the problems)', () => {
    const d = quantifierData('eps-delta', 2);
    expectCloseTo(d.eps, 2.5, 1e-12);
    expectCloseTo(d.delta, 1.25, 1e-12);
    expectCloseTo(d.probeT, 1.125, 1e-12);
    expectCloseTo(d.probeValue, 2.25, 1e-12);
  });

  it('negation chain ends in ∃ε>0 ∀δ>0 ∃t (|t| < δ ∧ |2t| ≥ ε)', () => {
    const steps = quantifierData('eps-delta', 2).negationSteps;
    expect(steps[0]).toBe('¬(∀ε>0 ∃δ>0 ∀t (|t| < δ → |2t| < ε))');
    expect(steps[steps.length - 1]).toBe('∃ε>0 ∀δ>0 ∃t (|t| < δ ∧ |2t| ≥ ε)');
  });
});

describe('quantifiers: model compute and control parsing', () => {
  it('defaults to forall-exists / x init / negation off', () => {
    const d = compute({});
    expect(d.statement).toBe(QUANTIFIER_STATEMENT_INIT);
    expect(d.x).toBe(QUANTIFIERS_X_INIT);
    expect(d.showNegation).toBe(QUANTIFIERS_NEGATED_INIT);
  });

  it('reads statement, x, negated from state', () => {
    const d = compute({ statement: 'eps-delta', x: -3.5, negated: true });
    expect(d.statement).toBe('eps-delta');
    expect(d.x).toBe(-3.5);
    expect(d.showNegation).toBe(true);
    expectCloseTo(d.eps, 4.0, 1e-12);
  });

  it('clamps x to the slider range and falls back on bad input', () => {
    const hi = compute({ x: 99 });
    expect(hi.x).toBe(QUANTIFIERS_X_MAX);
    const lo = compute({ x: -99 });
    expect(lo.x).toBe(QUANTIFIERS_X_MIN);
    const bad = compute({ x: NaN, statement: 'nope', negated: 'yes' });
    expect(bad.x).toBe(QUANTIFIERS_X_INIT);
    expect(bad.statement).toBe(QUANTIFIER_STATEMENT_INIT);
    expect(bad.showNegation).toBe(QUANTIFIERS_NEGATED_INIT);
  });

  it('declared slider range matches the task spec', () => {
    expect(QUANTIFIERS_X_MIN).toBe(-5);
    expect(QUANTIFIERS_X_MAX).toBe(5);
  });
});

describe('quantifiers: problem presets use only declared control keys', () => {
  it('every preset key is in {statement, x, negated} with valid values', () => {
    expect(quantifiersProblems).toHaveLength(3);
    for (const problem of quantifiersProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const statement = problem.preset['statement'];
      expect(STATEMENTS).toContain(statement);
      const x = problem.preset['x'];
      expect(typeof x).toBe('number');
      expect(x as number).toBeGreaterThanOrEqual(QUANTIFIERS_X_MIN);
      expect(x as number).toBeLessThanOrEqual(QUANTIFIERS_X_MAX);
      expect(typeof problem.preset['negated']).toBe('boolean');
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = quantifiersProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
