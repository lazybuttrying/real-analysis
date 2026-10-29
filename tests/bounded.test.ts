import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  boundedData,
  boundedModel,
  boundedValue,
  type BoundedData,
} from '../src/chapters/limits/models/bounded';
import { boundedProblems } from '../src/chapters/limits/problems/bounded';

const compute = (state: ControlState): BoundedData => syncCompute(boundedModel, state);

describe('bounded: model', () => {
  it('ratio terms stay below 1 and approach it', () => {
    const d = compute({ kind: 'ratio', n: 20 });
    expect(d.bounded).toBe(true);
    expect(d.bound).toBe(1);
    for (const v of d.values) expect(v).toBeLessThan(1);
    expectCloseTo(d.values[19]!, 20 / 21, 1e-12);
  });

  it('alt terms are exactly +-1', () => {
    expect(boundedValue('alt', 3)).toBe(-1);
    expect(boundedValue('alt', 4)).toBe(1);
    const d = boundedData('alt', 10);
    expect(d.shownMax).toBe(1);
  });

  it('linear is flagged unbounded', () => {
    const d = boundedData('linear', 20);
    expect(d.bounded).toBe(false);
    expect(d.bound).toBeNull();
    expectCloseTo(d.shownMax, 4, 1e-12);
  });
});

describe('bounded: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(boundedProblems);
  });
});
