import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CLOSED_COVER_SIZE,
  CLOSED_HALF_WIDTH,
  compactData,
  compactKindOf,
  compactModel,
  COVERS,
  OPEN_COVER_SIZE,
  reciprocalTerm,
  type CompactData,
} from '../src/chapters/limits/models/compact';
import { problems } from '../src/chapters/limits/problems/compact';

const compactCompute = (state: ControlState): CompactData => syncCompute(compactModel, state);

/**
 * The control spec this scene will be registered with in meta.ts
 * (mirrored here because meta.ts is edited separately):
 *   select set: ['closed', 'halfopen', 'unbounded'], init 'closed'
 *   slider step: min 0, max 8, step 1, init 6
 */
const CONTROL_KEYS = { set: ['closed', 'halfopen', 'unbounded'], step: { min: 0, max: 8, step: 1 } };

describe('compact: kind parsing', () => {
  it('recognizes the three kinds and falls back to closed', () => {
    expect(compactKindOf('closed')).toBe('closed');
    expect(compactKindOf('halfopen')).toBe('halfopen');
    expect(compactKindOf('unbounded')).toBe('unbounded');
    expect(compactKindOf('bogus')).toBe('closed');
    expect(compactKindOf(undefined)).toBe('closed');
  });

  it('falls back to the closed defaults for empty or out-of-range state', () => {
    const d = compactCompute({});
    expect(d.kind).toBe('closed');
    expect(d.shown).toBe(6);
    expect(compactCompute({ step: 99 }).shown).toBe(6);
    expect(compactCompute({ step: 8 }).shown).toBe(6);
    expect(compactCompute({ step: -3 }).shown).toBe(0);
    expect(compactCompute({ step: 2.7 }).shown).toBe(2);
  });
});

describe('compact: the [0,1] cover endpoints', () => {
  it('has 6 intervals U_k = (k/5 - 0.18, k/5 + 0.18)', () => {
    expect(COVERS.closed).toHaveLength(CLOSED_COVER_SIZE);
    expect(CLOSED_HALF_WIDTH).toBe(0.18);
    expect(COVERS.closed[0]).toEqual({ lo: -0.18, hi: 0.18 });
    expect(COVERS.closed[5]?.lo).toBeCloseTo(0.82, 12);
    expect(COVERS.closed[5]?.hi).toBeCloseTo(1.18, 12);
    // consecutive intervals overlap, so the union of the first m is one piece
    for (let k = 0; k < CLOSED_COVER_SIZE - 1; k++) {
      const a = COVERS.closed[k];
      const b = COVERS.closed[k + 1];
      expect(a?.hi).toBeGreaterThan(b?.lo ?? Infinity);
    }
  });

  it('reports the union of the first `shown` intervals', () => {
    const d3 = compactData('closed', 3);
    expect(d3.shown).toBe(3);
    expect(d3.union?.lo).toBe(-0.18);
    expect(d3.union?.hi).toBeCloseTo(0.58, 12);
    const d6 = compactData('closed', 6);
    expect(d6.union?.lo).toBe(-0.18);
    expect(d6.union?.hi).toBeCloseTo(1.18, 12);
    expect(compactData('closed', 0).union).toBeNull();
  });

  it('covers [0,1] exactly at shown = 6, not before', () => {
    expect(compactData('closed', 5).coversAll).toBe(false);
    expect(compactData('closed', 6).coversAll).toBe(true);
    // caption numbers: the union renders as [-0.18, 1.18]
    const d = compactData('closed', 6);
    expect(d.union?.lo.toFixed(2)).toBe('-0.18');
    expect(d.union?.hi.toFixed(2)).toBe('1.18');
    expect(Number(d.union?.hi.toFixed(2))).toBeGreaterThanOrEqual(1);
  });
});

describe('compact: the (0,1] cover and its permanent gap', () => {
  it('has 8 intervals (1/(k+1), 2)', () => {
    expect(COVERS.halfopen).toHaveLength(OPEN_COVER_SIZE);
    expect(COVERS.halfopen[0]).toEqual({ lo: 1, hi: 2 });
    expect(COVERS.halfopen[7]?.lo).toBe(0.125);
    expect(COVERS.halfopen[7]?.hi).toBe(2);
  });

  it('leaves the gap (0, 1/shown] at every sample slider value', () => {
    for (const shown of [1, 2, 4, 8]) {
      const d = compactData('halfopen', shown);
      expect(d.shown).toBe(shown);
      expect(d.union).toEqual({ lo: 1 / shown, hi: 2 });
      expect(d.gapHi).toBe(1 / shown);
      expect(d.coversAll).toBe(false);
    }
    const d8 = compactData('halfopen', 8);
    expect(d8.gapHi).toBe(0.125);
    expect(`1/${d8.shown}`).toBe('1/8');
    expect(compactData('halfopen', 0).gapHi).toBeNull();
  });
});

describe('compact: the [0,inf) cover and its permanent tail', () => {
  it('has 8 intervals (-1, k+1)', () => {
    expect(COVERS.unbounded).toHaveLength(OPEN_COVER_SIZE);
    expect(COVERS.unbounded[0]).toEqual({ lo: -1, hi: 1 });
    expect(COVERS.unbounded[7]).toEqual({ lo: -1, hi: 8 });
  });

  it('leaves the tail [shown, inf) at every sample slider value', () => {
    for (const shown of [1, 3, 8]) {
      const d = compactData('unbounded', shown);
      expect(d.shown).toBe(shown);
      expect(d.union).toEqual({ lo: -1, hi: shown });
      expect(d.tailLo).toBe(shown);
      expect(d.coversAll).toBe(false);
    }
    expect(compactData('unbounded', 0).tailLo).toBeNull();
  });
});

describe('compact: the counterexample sequence values', () => {
  it('gives 1/n with 1/8 = 0.125 exactly', () => {
    expect(reciprocalTerm(8)).toBe(0.125);
    expect(reciprocalTerm(1)).toBe(1);
    expect(reciprocalTerm(1000)).toBe(0.001);
  });

  it('stays inside (0,1] and tends to the missing point 0', () => {
    for (const n of [1, 2, 8, 9, 100]) {
      const t = reciprocalTerm(n);
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThanOrEqual(1);
    }
    // every term past n = 8 lands inside the gap (0, 1/8] left by the full cover
    for (const n of [9, 10, 50, 1000]) {
      expect(reciprocalTerm(n)).toBeLessThan(0.125);
    }
  });
});

describe('compact: problems data', () => {
  it('has exactly 3 problems with non-empty bilingual proofs', () => {
    expect(problems).toHaveLength(3);
    expect(problems.map((p) => p.id)).toEqual([
      'compact-closed-seq',
      'compact-halfopen-fails',
      'compact-continuous-image',
    ]);
    for (const problem of problems) {
      expect(problem.proof.length).toBeGreaterThan(0);
      for (const step of problem.proof) {
        expect(step.text.ko.trim().length).toBeGreaterThan(0);
        expect(step.text.en.trim().length).toBeGreaterThan(0);
      }
      expect(problem.statement.ko.trim().length).toBeGreaterThan(0);
      expect(problem.statement.en.trim().length).toBeGreaterThan(0);
      expect(problem.presetCaption.ko.trim().length).toBeGreaterThan(0);
      expect(problem.presetCaption.en.trim().length).toBeGreaterThan(0);
    }
  });

  it('uses only declared control keys with valid values in every preset', () => {
    for (const problem of problems) {
      for (const [key, value] of Object.entries(problem.preset)) {
        if (key === 'set') {
          expect(CONTROL_KEYS.set).toContain(value);
        } else if (key === 'step') {
          expect(typeof value).toBe('number');
          const spec = CONTROL_KEYS.step;
          expect(value as number).toBeGreaterThanOrEqual(spec.min);
          expect(value as number).toBeLessThanOrEqual(spec.max);
          const steps = ((value as number) - spec.min) / spec.step;
          expectCloseTo(steps, Math.round(steps), 1e-9);
        } else {
          throw new Error(`${problem.id}: undeclared control key '${key}'`);
        }
      }
    }
  });

  it('agrees with the model on every number in the captions', () => {
    const closed = compactCompute({ set: 'closed', step: 6 });
    expect(closed.coversAll).toBe(true);
    expect(problems[0]?.presetCaption.ko).toContain('[-0.18, 1.18]');
    expect(problems[0]?.presetCaption.en).toContain('[-0.18, 1.18]');
    const halfopen = compactCompute({ set: 'halfopen', step: 8 });
    expect(halfopen.coversAll).toBe(false);
    expect(halfopen.gapHi).toBe(0.125);
    expect(problems[1]?.presetCaption.ko).toContain('(0, 1/8]');
    expect(problems[1]?.presetCaption.en).toContain('(0, 1/8]');
    const cont = compactCompute({ set: 'closed', step: 6 });
    expect(cont.coversAll).toBe(true);
  });

  it('matches each preset against the model end to end', () => {
    const expected: Record<string, { kind: string; shown: number }> = {
      'compact-closed-seq': { kind: 'closed', shown: 6 },
      'compact-halfopen-fails': { kind: 'halfopen', shown: 8 },
      'compact-continuous-image': { kind: 'closed', shown: 6 },
    };
    for (const problem of problems) {
      const d = compactCompute(problem.preset);
      const exp = expected[problem.id];
      expect(d.kind).toBe(exp?.kind);
      expect(d.shown).toBe(exp?.shown);
    }
  });
});
