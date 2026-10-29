import { describe, expect, it } from 'vitest';
import { checkProblemsShape, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  archimedeanData,
  archimedeanModel,
  leastMultiple,
  type ArchimedeanData,
} from '../src/chapters/limits/models/archimedean';
import { archimedeanProblems } from '../src/chapters/limits/problems/archimedean';

const compute = (state: ControlState): ArchimedeanData => syncCompute(archimedeanModel, state);

describe('archimedean: least multiple', () => {
  it('leastMultiple(0.5, 5) = 11 and leastMultiple(0.25, 1) = 5', () => {
    expect(leastMultiple(0.5, 5)).toBe(11);
    expect(leastMultiple(0.25, 1)).toBe(5);
    expect(leastMultiple(2, 0)).toBe(1);
  });

  it('n is least: (n-1)a <= b < na', () => {
    const d = compute({ a: 0.5, b: 5 });
    expect(d.n).toBe(11);
    expect(d.prevA).toBeLessThanOrEqual(d.b);
    expect(d.na).toBeGreaterThan(d.b);
    expect(d.multiples).toHaveLength(11);
  });

  it('archimedeanData clamps a into [0.1, 2]', () => {
    expect(archimedeanData(0.01, 5).a).toBe(0.1);
    expect(archimedeanData(9, 5).a).toBe(2);
  });
});

describe('archimedean: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(archimedeanProblems);
  });
});
