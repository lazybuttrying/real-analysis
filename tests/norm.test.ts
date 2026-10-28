import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  lpNorm,
  normData,
  normModel,
  unitSpherePoint,
  type NormData,
} from '../src/chapters/limits/models/norm';
import { normProblems } from '../src/chapters/limits/problems/norm';

const compute = (state: ControlState): NormData => syncCompute(normModel, state);

describe('norm: lpNorm', () => {
  it('lpNorm((3, 4)) is 7, 5, 4 for p = 1, 2, inf', () => {
    expectCloseTo(lpNorm({ x: 3, y: 4 }, '1'), 7, 1e-12);
    expectCloseTo(lpNorm({ x: 3, y: 4 }, '2'), 5, 1e-12);
    expectCloseTo(lpNorm({ x: 3, y: 4 }, 'inf'), 4, 1e-12);
  });

  it('lpNorm is homogeneous and positive definite', () => {
    expectCloseTo(lpNorm({ x: 0, y: 0 }, '2'), 0, 1e-12);
    expectCloseTo(lpNorm({ x: -2, y: 1 }, '1'), 3, 1e-12);
    expectCloseTo(lpNorm({ x: -2, y: 1 }, '2'), Math.sqrt(5), 1e-12);
    expectCloseTo(lpNorm({ x: 2, y: -2 }, 'inf'), 2, 1e-12);
  });

  it('unit sphere points have norm 1', () => {
    for (const p of ['1', '2', 'inf'] as const) {
      for (const theta of [0, 0.7, 1.9, 3.4, 5.1]) {
        expectCloseTo(lpNorm(unitSpherePoint(theta, p), p), 1, 1e-9);
      }
    }
  });
});

describe('norm: triangle inequality', () => {
  it('normSum <= ceiling with a positive gap for non-parallel vectors', () => {
    const data = compute({ x1: 1.2, x2: 0.8, y1: -0.6, y2: 1.4, p: '2' });
    expect(data.normSum).toBeLessThanOrEqual(data.ceiling + 1e-12);
    expect(data.gap).toBeGreaterThan(0);
    expectCloseTo(data.gap, data.ceiling - data.normSum, 1e-12);
  });

  it('gap is 0 when y = 0', () => {
    const data = compute({ x1: 1.5, x2: 2, y1: 0, y2: 0, p: '2' });
    expectCloseTo(data.normSum, 2.5, 1e-12);
    expectCloseTo(data.gap, 0, 1e-12);
  });

  it('normData clamps coordinates to [-2, 2]', () => {
    const data = normData(9, -9, 0, 0, '2');
    expect(data.x.x).toBe(2);
    expect(data.x.y).toBe(-2);
  });
});

describe('norm: problems shape', () => {
  it('problem presets are valid for the scene controls', () => {
    checkProblemsShape(normProblems);
  });
});
