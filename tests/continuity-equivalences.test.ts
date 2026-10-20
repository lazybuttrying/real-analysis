import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  continuityEquivalencesModel,
  contFnOf,
  contViewOf,
  EPS_INIT,
  EPS_MAX,
  EPS_MIN,
  evaluateContFn,
  maxWorkingDelta,
  preimageData,
  SEQ_TERMS,
  seqMatchesLimit,
  seqTerms,
  type ContinuityEquivalencesData,
} from '../src/chapters/limits/models/continuityEquivalences';
import { problems as continuityEquivalencesProblems } from '../src/chapters/limits/problems/continuity-equivalences';

const compute = (state: ControlState): ContinuityEquivalencesData =>
  syncCompute(continuityEquivalencesModel, state);

describe('continuity-equivalences: the two functions', () => {
  it('square is x^2; jump is x^2 for x < 0 and x^2 + 1 for x >= 0', () => {
    expect(evaluateContFn('square', 2)).toBe(4);
    expect(evaluateContFn('square', -1.5)).toBe(2.25);
    expect(evaluateContFn('jump', -1)).toBe(1);
    expect(evaluateContFn('jump', 0)).toBe(1);
    expect(evaluateContFn('jump', 1)).toBe(2);
  });
});

describe('continuity-equivalences: eps-delta verdicts', () => {
  it('square, eps = 0.3: maxDelta ~= 0.54 (analytic sqrt(0.3))', () => {
    const delta = maxWorkingDelta('square', 0, 0.3);
    expectCloseTo(delta, 0.54, 1e-9);
    expectCloseTo(delta, Math.sqrt(0.3), 0.02);
  });

  it('jump, eps = 0.3: no delta works', () => {
    expect(maxWorkingDelta('jump', 1, 0.3)).toBe(0);
  });

  it('square, eps = 1: the exact bound sqrt(eps) = 1 is nearly recovered', () => {
    const delta = maxWorkingDelta('square', 0, 1);
    expect(delta).toBeGreaterThan(0.9);
    expect(delta).toBeLessThanOrEqual(1);
  });
});

describe('continuity-equivalences: sequential verdicts', () => {
  it('x_n = (-1)^n / n converges to 0', () => {
    const terms = seqTerms('square');
    expect(terms).toHaveLength(SEQ_TERMS);
    expect(terms[0]).toEqual({ n: 1, xn: -1, fxn: 1 });
    expect(terms[1]).toEqual({ n: 2, xn: 0.5, fxn: 0.25 });
    expect(Math.abs(terms[SEQ_TERMS - 1]?.xn ?? 1)).toBeLessThan(0.03);
  });

  it('square: f(x_n) -> f(0); jump: it does not', () => {
    expect(seqMatchesLimit('square', 0)).toBe(true);
    expect(seqMatchesLimit('jump', 1)).toBe(false);
  });

  it('jump terms alternate near 0 and 1, never settling at f(0) = 1', () => {
    const terms = seqTerms('jump');
    const tail = terms.filter((t) => t.n > SEQ_TERMS / 2);
    const nearZero = tail.filter((t) => Math.abs(t.fxn) < 0.05);
    const nearOne = tail.filter((t) => Math.abs(t.fxn - 1) < 0.05);
    expect(nearZero.length).toBeGreaterThan(0);
    expect(nearOne.length).toBeGreaterThan(0);
  });
});

describe('continuity-equivalences: preimage verdicts', () => {
  it('square, eps = 0.3: the preimage contains (-0.5, 0.5)', () => {
    const { intervals, radius } = preimageData('square', -0.3, 0.3);
    expectCloseTo(radius, 0.5, 1e-9);
    expect(intervals).toHaveLength(1);
    expect(intervals[0]?.lo).toBeLessThan(0);
    expect(intervals[0]?.hi).toBeGreaterThan(0);
  });

  it('jump, eps = 0.3: no interval around 0 in the preimage of (0.7, 1.3)', () => {
    const { intervals, radius } = preimageData('jump', 0.7, 1.3);
    expect(radius).toBe(0);
    // The left branch contributes (-1.14.., -0.83..), the right [0, 0.54..);
    // neither contains an interval around 0.
    for (const iv of intervals) {
      expect(iv.lo >= 0 || iv.hi <= 0).toBe(true);
    }
  });
});

describe('continuity-equivalences: model compute', () => {
  it('defaults to square / epsdelta / eps = 0.3', () => {
    const data = compute({});
    expect(data.fn).toBe('square');
    expect(data.view).toBe('epsdelta');
    expect(data.eps).toBe(EPS_INIT);
    expect(data.x0).toBe(0);
    expect(data.fx0).toBe(0);
    expect(data.continuous).toBe(true);
    expect(data.deltaWorks).toBe(true);
    expectCloseTo(data.maxDelta, 0.54, 1e-9);
  });

  it('jump is marked discontinuous with failing verdicts', () => {
    const data = compute({ fn: 'jump', view: 'preimage', eps: 0.3 });
    expect(data.continuous).toBe(false);
    expect(data.fx0).toBe(1);
    expect(data.deltaWorks).toBe(false);
    expect(data.seqMatches).toBe(false);
    expect(data.preimageHolds).toBe(false);
    expect(data.vLo).toBeCloseTo(0.7, 12);
    expect(data.vHi).toBeCloseTo(1.3, 12);
  });

  it('clamps eps and falls back on unknown fn/view', () => {
    expect(compute({ eps: 5 }).eps).toBe(EPS_MAX);
    expect(compute({ eps: -1 }).eps).toBe(EPS_MIN);
    expect(contFnOf('weird')).toBe('square');
    expect(contViewOf('weird')).toBe('epsdelta');
    expect(compute({ fn: 'weird', view: 'weird' }).fn).toBe('square');
    expect(compute({ fn: 'weird', view: 'weird' }).view).toBe('epsdelta');
  });

  it('exports the expected data keys', () => {
    const data = compute({ fn: 'square', view: 'sequential', eps: 0.3 });
    for (const key of [
      'fn',
      'view',
      'eps',
      'x0',
      'fx0',
      'continuous',
      'maxDelta',
      'deltaWorks',
      'terms',
      'seqMatches',
      'vLo',
      'vHi',
      'preimageIntervals',
      'preimageRadius',
      'preimageHolds',
      'curveLeft',
      'curveRight',
      'yMax',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('continuity-equivalences: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(continuityEquivalencesProblems);
  });

  it('the three ids are epsdelta-implies-sequential, sequential-implies-epsdelta, preimage-open-sets', () => {
    expect(continuityEquivalencesProblems.map((p) => p.id)).toEqual([
      'epsdelta-implies-sequential',
      'sequential-implies-epsdelta',
      'preimage-open-sets',
    ]);
  });

  it('presets use declared controls with valid values', () => {
    const presets = continuityEquivalencesProblems.map((p) => p.preset);
    expect(presets).toEqual([
      { fn: 'square', view: 'epsdelta', eps: 0.3 },
      { fn: 'jump', view: 'sequential', eps: 0.3 },
      { fn: 'jump', view: 'preimage', eps: 0.3 },
    ]);
    for (const preset of presets) {
      expect(['square', 'jump']).toContain(preset['fn']);
      expect(['epsdelta', 'sequential', 'preimage']).toContain(preset['view']);
      expect(preset['eps']).toBeGreaterThanOrEqual(EPS_MIN);
      expect(preset['eps']).toBeLessThanOrEqual(EPS_MAX);
    }
  });
});
