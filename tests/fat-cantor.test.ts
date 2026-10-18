import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_STAGE,
  fatCantorModel,
  fatIntervals,
  fatLength,
  MAX_STAGE,
  MIN_STAGE,
  stdIntervals,
  stdLength,
  type FatCantorData,
} from '../src/chapters/limits/models/fatCantor';
import { fatCantorProblems } from '../src/chapters/limits/problems/fat-cantor';

const compute = (state: ControlState): FatCantorData => syncCompute(fatCantorModel, state);

const sumLengths = (ivs: readonly (readonly [number, number])[]): number =>
  ivs.reduce((acc, [a, b]) => acc + (b - a), 0);

describe('fat-cantor: interval counts are 2^stage', () => {
  it('fat and standard both have 2^stage intervals, stages 0..7', () => {
    for (let n = 0; n <= 7; n++) {
      expect(fatIntervals(n)).toHaveLength(2 ** n);
      expect(stdIntervals(n)).toHaveLength(2 ** n);
    }
  });

  it('stage-1 fat intervals are [0, 3/8] and [5/8, 1]', () => {
    const ivs = fatIntervals(1);
    expect(ivs).toHaveLength(2);
    expectCloseTo(ivs[0]?.[0] ?? NaN, 0, 1e-15);
    expectCloseTo(ivs[0]?.[1] ?? NaN, 3 / 8, 1e-15);
    expectCloseTo(ivs[1]?.[0] ?? NaN, 5 / 8, 1e-15);
    expectCloseTo(ivs[1]?.[1] ?? NaN, 1, 1e-15);
    // The removed middle (3/8, 5/8) has length 1/4 = 4^{-1}.
    expect(ivs[1]?.[0] ?? NaN).toBeCloseTo((ivs[0]?.[1] ?? NaN) + 1 / 4, 14);
  });

  it('stage-1 standard intervals are [0, 1/3] and [2/3, 1]', () => {
    const ivs = stdIntervals(1);
    expect(ivs).toHaveLength(2);
    expectCloseTo(ivs[0]?.[0] ?? NaN, 0, 1e-15);
    expectCloseTo(ivs[0]?.[1] ?? NaN, 1 / 3, 1e-15);
    expectCloseTo(ivs[1]?.[0] ?? NaN, 2 / 3, 1e-15);
    expectCloseTo(ivs[1]?.[1] ?? NaN, 1, 1e-15);
  });

  it('intervals are sorted and pairwise disjoint, stages 0..7', () => {
    for (let n = 0; n <= 7; n++) {
      for (const ivs of [fatIntervals(n), stdIntervals(n)]) {
        for (let k = 0; k < ivs.length; k++) {
          const [a, b] = ivs[k] ?? [NaN, NaN];
          expect(a).toBeLessThan(b); // positive length
          if (k > 0) {
            const prevB = ivs[k - 1]?.[1] ?? NaN;
            expect(a).toBeGreaterThan(prevB); // sorted, disjoint (strict gap)
          }
        }
        expect((ivs[0]?.[0] ?? NaN)).toBeGreaterThanOrEqual(0);
        expect((ivs[ivs.length - 1]?.[1] ?? NaN)).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('fat-cantor: length identities', () => {
  it('fatLength(stage) = (1 + 2^{-stage}) / 2 to 1e-12, stages 0..7', () => {
    for (let n = 0; n <= 7; n++) {
      expectCloseTo(fatLength(n), (1 + Math.pow(2, -n)) / 2, 1e-12);
      expectCloseTo(sumLengths(fatIntervals(n)), (1 + Math.pow(2, -n)) / 2, 1e-12);
    }
  });

  it('stdLength(stage) = (2/3)^stage, stages 0..7', () => {
    for (let n = 0; n <= 7; n++) {
      expectCloseTo(stdLength(n), Math.pow(2 / 3, n), 1e-12);
      expectCloseTo(sumLengths(stdIntervals(n)), Math.pow(2 / 3, n), 1e-12);
    }
  });

  it('the limit identity: fatLength(stage) -> 1/2, stdLength(stage) -> 0', () => {
    expectCloseTo(fatLength(7), 1 / 2, 0.01);
    expect(fatLength(7)).toBeGreaterThan(1 / 2);
    expect(fatLength(50)).toBeCloseTo(1 / 2, 14);
    expect(stdLength(7)).toBeLessThan(0.06);
    expect(stdLength(50)).toBeLessThan(1e-8);
  });

  it('total removed through N stages is (1/2)(1 - 2^{-N})', () => {
    for (let n = 0; n <= 7; n++) {
      expectCloseTo(1 - fatLength(n), 0.5 * (1 - Math.pow(2, -n)), 1e-12);
    }
    // The stage-1 check: removing (3/8, 5/8) leaves 3/4.
    expectCloseTo(1 - fatLength(1), 1 / 4, 1e-15);
  });

  it('stage 4: fatLength = 17/32, stdLength = 16/81', () => {
    expectCloseTo(fatLength(4), 17 / 32, 1e-15);
    expectCloseTo(stdLength(4), 16 / 81, 1e-15);
  });
});

describe('fat-cantor: control clamping', () => {
  it('defaults and clamps match the documented control ranges', () => {
    expect(MIN_STAGE).toBe(0);
    expect(MAX_STAGE).toBe(7);
    expect(DEFAULT_STAGE).toBe(4);
  });

  it('out-of-range stages clamp to [0, 7]', () => {
    expect(compute({ stage: -3 }).stage).toBe(0);
    expect(compute({ stage: 100 }).stage).toBe(7);
    expect(compute({ stage: 3.7 }).stage).toBe(3);
  });

  it('missing controls fall back to defaults', () => {
    const data = compute({});
    expect(data.stage).toBe(4);
    expectCloseTo(data.fatLength, 17 / 32, 1e-12);
    expectCloseTo(data.stdLength, 16 / 81, 1e-12);
    expect(data.fat).toHaveLength(16);
    expect(data.std).toHaveLength(16);
  });
});

describe('fat-cantor: problems data', () => {
  it('has exactly 3 problems with the required shape', () => {
    expect(fatCantorProblems).toHaveLength(3);
    const ids = fatCantorProblems.map((p) => p.id);
    expect(ids).toEqual(['total-removed-half', 'nowhere-dense-perfect', 'open-dense-complement']);
    for (const p of fatCantorProblems) {
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
    for (const p of fatCantorProblems) {
      const data = compute(p.preset);
      expect(data.stage).toBe(4);
      expectCloseTo(data.fatLength, 17 / 32, 1e-12);
      expectCloseTo(data.stdLength, 16 / 81, 1e-12);
    }
  });

  it('proofs keep Korean inside ko strings only, and use \\(...\\) math', () => {
    const hangul = (s: string): boolean => /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(s);
    for (const p of fatCantorProblems) {
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
