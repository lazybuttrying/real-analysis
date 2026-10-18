import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  crossings,
  DEFAULT_TARGET,
  DEFAULT_TERMS,
  greedyWalk,
  MAX_TARGET,
  MAX_TERMS,
  MIN_TARGET,
  MIN_TERMS,
  negTerm,
  posTerm,
  riemannModel,
  type RiemannData,
} from '../src/chapters/series/models/riemannRearrangement';
import { riemannRearrangementProblems } from '../src/chapters/series/problems/riemann-rearrangement';

const compute = (state: ControlState): RiemannData => syncCompute(riemannModel, state);

describe('riemann-rearrangement: term formulas', () => {
  it('p_k = 1/(2k-1) and q_k = 1/(2k)', () => {
    expect(posTerm(1)).toBe(1);
    expect(posTerm(2)).toBeCloseTo(1 / 3, 15);
    expect(negTerm(1)).toBe(0.5);
    expect(negTerm(2)).toBe(0.25);
    for (let k = 1; k <= 50; k++) {
      expect(posTerm(k)).toBeCloseTo(1 / (2 * k - 1), 15);
      expect(negTerm(k)).toBeCloseTo(1 / (2 * k), 15);
    }
  });
});

describe('riemann-rearrangement: greedy walk at target 1 (the documented numbers)', () => {
  const data = compute({ target: 1.0, terms: 120 });

  it('uses exactly 120 terms: 78 positive, 42 negative', () => {
    expect(data.steps).toHaveLength(120);
    expect(data.posUsed).toBe(78);
    expect(data.negUsed).toBe(42);
    expect(data.posUsed + data.negUsed).toBe(120);
  });

  it('final sum 0.9967414472151209, error 0.0032585527848790763', () => {
    expectCloseTo(data.finalSum, 0.9967414472151209, 1e-12);
    expectCloseTo(data.error, 0.0032585527848790763, 1e-12);
    expect(data.error).toBeCloseTo(Math.abs(data.finalSum - 1), 15);
  });

  it('the first eight partial sums are the exact documented rationals', () => {
    const sums = data.steps.map((st) => st.sum);
    const expected = [1, 4 / 3, 5 / 6, 31 / 30, 47 / 60, 389 / 420, 1307 / 1260, 1097 / 1260];
    for (let k = 0; k < expected.length; k++) {
      expectCloseTo(sums[k] ?? NaN, expected[k] ?? NaN, 1e-12);
    }
  });

  it('crossing gaps are 0, 1/3, 1/6, 1/30, 13/60, 47/1260, 163/1260', () => {
    const cs = crossings(data).slice(0, 7);
    const expectedGaps = [0, 1 / 3, 1 / 6, 1 / 30, 13 / 60, 47 / 1260, 163 / 1260];
    expect(cs).toHaveLength(7);
    for (let k = 0; k < expectedGaps.length; k++) {
      expectCloseTo(cs[k]?.gap ?? NaN, expectedGaps[k] ?? NaN, 1e-12);
    }
  });
});

describe('riemann-rearrangement: the walk is a genuine rearrangement', () => {
  it('each step adds dir*mag to the running sum, starting from 0', () => {
    const data = compute({ target: 1.0, terms: 120 });
    let prev = 0;
    for (const st of data.steps) {
      expect(st.sum).toBeCloseTo(prev + st.dir * st.mag, 14);
      prev = st.sum;
    }
  });

  it('positive mags are exactly p_1..p_78 and negative mags exactly q_1..q_42, each once', () => {
    const data = compute({ target: 1.0, terms: 120 });
    const pos = data.steps.filter((st) => st.dir === 1).map((st) => st.mag);
    const neg = data.steps.filter((st) => st.dir === -1).map((st) => st.mag);
    expect(pos).toHaveLength(78);
    expect(neg).toHaveLength(42);
    for (let k = 1; k <= 78; k++) expect(pos[k - 1]).toBeCloseTo(posTerm(k), 15);
    for (let k = 1; k <= 42; k++) expect(neg[k - 1]).toBeCloseTo(negTerm(k), 15);
  });

  it('every complete block contributes exactly one crossing; every crossing is a block end or an exact landing', () => {
    for (const target of [1, -1.5, 0, 2.7]) {
      const data = compute({ target, terms: 200 });
      const crossSteps = new Set(crossings(data).map((c) => c.step));
      const blockEnds: number[] = [];
      for (let k = 1; k <= data.steps.length; k++) {
        const dir = data.steps[k - 1]?.dir;
        const nextDir = data.steps[k]?.dir;
        if (k === data.steps.length || dir !== nextDir) blockEnds.push(k);
      }
      // Every complete (non-final) block crossed s, hence ends in a crossing.
      for (const b of blockEnds) {
        if (b < data.steps.length) expect(crossSteps.has(b)).toBe(true);
      }
      // Every crossing is a block end or a step that landed exactly on target.
      for (const c of crossings(data)) {
        expect(blockEnds.includes(c.step) || c.sum === target).toBe(true);
      }
    }
  });
});

describe('riemann-rearrangement: the overshoot lemma (gap <= crossing term)', () => {
  it('every crossing gap is at most the crossing term magnitude', () => {
    for (const target of [-2, -1.5, -0.5, 0, 0.7, 1, 2.7, 3]) {
      const data = compute({ target, terms: 400 });
      for (const c of crossings(data)) {
        expect(c.gap).toBeLessThanOrEqual(c.mag + 1e-12);
      }
    }
  });

  it('gap == crossing term happens exactly when the walk stood on s before the crossing step', () => {
    const data = compute({ target: 1.0, terms: 120 });
    for (const c of crossings(data)) {
      if (Math.abs(c.gap - c.mag) < 1e-12) {
        // Upward crossing from t <= s: gap = mag - (s - t), so equality iff t = s.
        // Downward crossings are always strict (t > s strictly).
        const before = c.step === 1 ? 0 : (data.steps[c.step - 2]?.sum ?? NaN);
        expect(Math.abs(before - data.target)).toBeLessThan(1e-12);
      }
    }
    // The documented instance: S_2 = 4/3, gap 1/3 = p_2, because S_1 = 1 = s.
    const second = crossings(data)[1];
    expectCloseTo(second?.gap ?? NaN, 1 / 3, 1e-12);
    expectCloseTo(second?.mag ?? NaN, 1 / 3, 1e-12);
  });
});

describe('riemann-rearrangement: convergence toward the target', () => {
  it('error shrinks as more terms are used (target 1)', () => {
    const e20 = compute({ target: 1.0, terms: 20 }).error;
    const e120 = compute({ target: 1.0, terms: 120 }).error;
    const e400 = compute({ target: 1.0, terms: 400 }).error;
    expect(e120).toBeLessThan(e20);
    expect(e400).toBeLessThan(e120);
    expect(e400).toBeLessThan(0.01);
  });

  it('a negative target starts with negative takes and converges', () => {
    const data = compute({ target: -1.5, terms: 400 });
    expect(data.steps[0]?.dir).toBe(-1);
    expect(data.finalSum).toBeLessThan(0);
    expect(data.error).toBeLessThan(0.05);
  });

  it('the walk tracks the target across the whole control range', () => {
    for (const target of [-2, -1, 0, 1, 2, 3]) {
      const data = compute({ target, terms: 400 });
      // Extreme targets converge slowly (the minority-sign terms run thin),
      // but the error stays small and keeps shrinking with more terms.
      expect(data.error).toBeLessThan(0.08);
      // The error oscillates (each crossing overshoots), so compare against
      // the short walk rather than the previous length.
      expect(data.error).toBeLessThan(compute({ target, terms: 20 }).error);
    }
  });
});

describe('riemann-rearrangement: control clamping', () => {
  it('defaults and clamps match the documented control ranges', () => {
    expect(DEFAULT_TARGET).toBe(1);
    expect(DEFAULT_TERMS).toBe(120);
    expect(MIN_TARGET).toBe(-2);
    expect(MAX_TARGET).toBe(3);
    expect(MIN_TERMS).toBe(20);
    expect(MAX_TERMS).toBe(400);
  });

  it('out-of-range terms clamp to [20, 400] and target to [-2, 3]', () => {
    expect(compute({ target: 1, terms: 5 }).terms).toBe(20);
    expect(compute({ target: 1, terms: 1000 }).terms).toBe(400);
    expect(compute({ target: -10, terms: 120 }).target).toBe(-2);
    expect(compute({ target: 10, terms: 120 }).target).toBe(3);
  });

  it('missing controls fall back to defaults', () => {
    const data = compute({});
    expect(data.target).toBe(1);
    expect(data.terms).toBe(120);
  });

  it('greedyWalk agrees with the model on the raw computation', () => {
    const viaModel = compute({ target: 1.0, terms: 120 });
    const direct = greedyWalk(1.0, 120);
    expect(direct.finalSum).toBe(viaModel.finalSum);
    expect(direct.steps).toHaveLength(viaModel.steps.length);
  });
});

describe('riemann-rearrangement: problems data', () => {
  it('has exactly 3 problems with the required shape', () => {
    expect(riemannRearrangementProblems).toHaveLength(3);
    const ids = riemannRearrangementProblems.map((p) => p.id);
    expect(ids).toEqual(['both-diverge', 'target-bracket', 'amplitude-vanishes']);
    for (const p of riemannRearrangementProblems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('every preset is valid for the scene controls and matches the quoted numbers', () => {
    for (const p of riemannRearrangementProblems) {
      const data = compute(p.preset);
      expect(data.target).toBe(1.0);
      expect(data.terms).toBe(120);
      expectCloseTo(data.finalSum, 0.9967414472151209, 1e-9);
      expectCloseTo(data.error, 0.0032585527848790763, 1e-9);
    }
  });

  it('proofs keep Korean inside ko strings only, and use \\(...\\) math', () => {
    // The repo convention: Korean ONLY inside ko: strings; en strings may
    // still use Latin-1 punctuation such as em dashes (as other scenes do).
    const hangul = (s: string): boolean => /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(s);
    for (const p of riemannRearrangementProblems) {
      expect(hangul(p.statement.en)).toBe(false);
      expect(hangul(p.presetCaption.en)).toBe(false);
      for (const step of p.proof) {
        expect(hangul(step.text.en)).toBe(false);
        for (const d of step.display ?? []) {
          expect(hangul(d)).toBe(false);
          expect(d).not.toContain('$');
        }
      }
      for (const d of p.display ?? []) expect(d).not.toContain('$');
    }
  });
});
