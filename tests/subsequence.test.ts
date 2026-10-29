import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  subsequenceData,
  subsequenceModel,
  subseqValue,
  type SubsequenceData,
} from '../src/chapters/limits/models/subsequence';
import { subsequenceProblems } from '../src/chapters/limits/problems/subsequence';

const compute = (state: ControlState): SubsequenceData => syncCompute(subsequenceModel, state);

describe('subsequence: model', () => {
  it('even terms are 1 + 1/(2k) and odd terms -1 + 1/(2k-1)', () => {
    expectCloseTo(subseqValue(2), 1.5, 1e-12);
    expectCloseTo(subseqValue(4), 1.25, 1e-12);
    expectCloseTo(subseqValue(1), 0, 1e-12);
    expectCloseTo(subseqValue(3), -1 + 1 / 3, 1e-12);
  });

  it('even part limit is 1, odd part limit is -1, all has none', () => {
    expect(compute({ part: 'even', n: 24 }).partLimit).toBe(1);
    expect(compute({ part: 'odd', n: 24 }).partLimit).toBe(-1);
    expect(compute({ part: 'all', n: 24 }).partLimit).toBeNull();
  });

  it('selection flags match the part', () => {
    const d = subsequenceData('even', 6);
    expect(d.points.filter((p) => p.selected).map((p) => p.n)).toEqual([2, 4, 6]);
  });
});

describe('subsequence: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(subsequenceProblems);
  });
});
