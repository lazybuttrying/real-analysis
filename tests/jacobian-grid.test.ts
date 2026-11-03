import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  GRID_N,
  JACOBIAN_MAPS,
  jacobianGridData,
  jacobianGridModel,
  type JacobianGridData,
} from '../src/chapters/calculus/models/jacobianGrid';
import { jacobianGridProblems } from '../src/chapters/calculus/problems/jacobian-grid';

const compute = (state: ControlState): JacobianGridData => syncCompute(jacobianGridModel, state);

describe('jacobian grid: the three maps and their determinants', () => {
  it('polar det is r, stretch det is 2u, square det is 4(u^2 + v^2)', () => {
    expectCloseTo(JACOBIAN_MAPS['polar']?.det(2.1, 0.7) ?? 0, 2.1, 1e-15);
    expectCloseTo(JACOBIAN_MAPS['stretch']?.det(1.3, 0.2) ?? 0, 2.6, 1e-15);
    expectCloseTo(JACOBIAN_MAPS['square']?.det(0.6, 0.8) ?? 0, 4, 1e-12);
  });

  it('polar maps (3, 0) to (3, 0) and (1, pi/2) to (0, 1)', () => {
    const p = JACOBIAN_MAPS['polar']?.apply(3, 0) ?? { x: 0, y: 0 };
    expectCloseTo(p.x, 3, 1e-15);
    expectCloseTo(p.y, 0, 1e-15);
    const q = JACOBIAN_MAPS['polar']?.apply(1, Math.PI / 2) ?? { x: 0, y: 0 };
    expectCloseTo(q.x, 0, 1e-15);
    expectCloseTo(q.y, 1, 1e-15);
  });
});

describe('jacobian grid: measured area ratio against the determinant', () => {
  it('polar cell (3, 1) ratio is exactly the center radius 2.1', () => {
    const data = compute({ map: 'polar', cellI: 3, cellJ: 1 });
    expect(data.detAtCenter).toBeCloseTo(2.1, 12);
    // The sampled polygon approximates the annular sector; with 10 samples
    // per edge the measured ratio sits well within half a percent.
    expect(Math.abs(data.areaRatio - 2.1) / 2.1).toBeLessThan(0.005);
  });

  it('stretch cell ratio is exactly 2 times the center u', () => {
    const data = jacobianGridData('stretch', 2, 0);
    expectCloseTo(data.center.x, 1.0, 1e-15);
    expect(Math.abs(data.areaRatio - 2) / 2).toBeLessThan(0.005);
  });

  it('square map ratio is near but not equal to the center determinant', () => {
    const data = jacobianGridData('square', 3, 2);
    const rel = Math.abs(data.areaRatio - data.detAtCenter) / data.detAtCenter;
    expect(rel).toBeGreaterThan(0.001);
    expect(rel).toBeLessThan(0.35);
  });

  it('origin cell of polar has ratio near the center radius too', () => {
    const data = jacobianGridData('polar', 0, 2);
    expect(Math.abs(data.areaRatio - data.detAtCenter) / data.detAtCenter).toBeLessThan(0.01);
  });
});

describe('jacobian grid: structure', () => {
  it('emits both grid families and clamps cell indices', () => {
    const data = compute({ map: 'polar', cellI: 99, cellJ: -3 });
    expect(data.cellI).toBe(GRID_N - 1);
    expect(data.cellJ).toBe(0);
    expect(data.imageLines).toHaveLength(2 * (GRID_N + 1));
    expect(data.cellImage.length).toBe(40);
    expect(data.cellDomainArea).toBeGreaterThan(0);
    expect(data.cellImageArea).toBeGreaterThan(0);
  });

  it('unknown map falls back to polar', () => {
    expect(compute({ map: 'nope', cellI: 0, cellJ: 0 }).map).toBe('polar');
  });
});

describe('jacobian grid: problems', () => {
  it('has exactly 3 well-formed problems', () => {
    checkProblemsShape(jacobianGridProblems);
  });
});
