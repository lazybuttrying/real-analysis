import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  additiveData,
  additiveModel,
  additivePoints,
  SQRT2,
  type AdditiveData,
} from '../src/chapters/limits/models/additive-functions';
import { additiveFunctionsProblems } from '../src/chapters/limits/problems/additive-functions';

const compute = (state: ControlState): AdditiveData => syncCompute(additiveModel, state);

describe('additive-functions: model', () => {
  it('at t = sqrt(2) every point lies on y = x', () => {
    const d = compute({ t: SQRT2 });
    expect(d.onLine).toBe(true);
    expectCloseTo(d.deviation, 0, 1e-12);
    for (const p of d.points) expectCloseTo(p.y, p.x, 1e-9);
  });

  it('rational points stay on the line for any t', () => {
    for (const p of additivePoints(0.5)) {
      if (p.rational) expectCloseTo(p.y, p.x, 1e-12);
    }
    const d = additiveData(0.5);
    expect(d.onLine).toBe(false);
    expectCloseTo(d.deviation, 0.5 - SQRT2, 1e-12);
  });

  it('additivity spot check on the span', () => {
    const t = 2;
    const pts = additivePoints(t);
    const find = (a: number, b: number) => pts.find((p) => Math.abs(p.x - (a + b * SQRT2)) < 1e-9)!;
    const p1 = find(0.5, 0.25);
    const p2 = find(0.25, 0.5);
    expectCloseTo(p1.y + p2.y, 0.75 + 0.75 * t, 1e-12);
  });
});

describe('additive-functions: problems shape', () => {
  it('has 3 well-formed problems', () => {
    checkProblemsShape(additiveFunctionsProblems);
  });
});
