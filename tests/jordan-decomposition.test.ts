import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_X0,
  GRID_POINTS,
  jordanData,
  jordanDecompositionModel,
  jordanF,
  type JordanData,
} from '../src/chapters/calculus/models/jordanDecomposition';
import { jordanDecompositionProblems } from '../src/chapters/calculus/problems/jordan-decomposition';

const compute = (state: ControlState): JordanData => syncCompute(jordanDecompositionModel, state);

describe('jordan-decomposition: closed-form and documented numbers', () => {
  it('f(0) = 0 and f(1) = sin(1) = 0.8414709848078965 (closed form)', () => {
    expect(jordanF(0)).toBe(0);
    expectCloseTo(jordanF(1), Math.sin(1), 1e-15);
    expectCloseTo(jordanF(1), 0.8414709848078965, 1e-15);
  });

  it('grid arrays have 2001 points covering [0, 1]', () => {
    const data = compute({});
    expect(data.f.length).toBe(GRID_POINTS);
    expect(data.g.length).toBe(GRID_POINTS);
    expect(data.h.length).toBe(GRID_POINTS);
    expect(data.f[0]?.x).toBe(0);
    expect(data.f[GRID_POINTS - 1]?.x).toBe(1);
  });

  it('grid g(1) = V = 1.0340625694793135 (documented exact number)', () => {
    const data = compute({});
    expectCloseTo(data.V, 1.0340625694793135, 1e-12);
    expect(data.g[GRID_POINTS - 1]?.y).toBe(data.V);
  });

  it('V = g(1) >= |f(1) - f(0)| (total variation dominates endpoint change)', () => {
    const data = compute({});
    expect(data.V).toBeGreaterThanOrEqual(Math.abs(jordanF(1) - jordanF(0)));
  });

  it('model defaults X0 to 0.7 and clamps it to [0, 1]', () => {
    expect(compute({}).x0).toBe(DEFAULT_X0);
    expect(compute({ X0: 0.25 }).x0).toBe(0.25);
    expect(compute({ X0: -3 }).x0).toBe(0);
    expect(compute({ X0: 42 }).x0).toBe(1);
  });
});

describe('jordan-decomposition: the Jordan identity holds exactly on the grid', () => {
  const data = jordanData(DEFAULT_X0);

  it('g is nondecreasing on the grid (tol 1e-12)', () => {
    for (let i = 1; i < data.g.length; i++) {
      const cur = data.g[i]?.y ?? NaN;
      const prev = data.g[i - 1]?.y ?? NaN;
      expect(cur).toBeGreaterThanOrEqual(prev - 1e-12);
    }
  });

  it('h = g - f is nondecreasing on the grid (tol 1e-12)', () => {
    for (let i = 1; i < data.h.length; i++) {
      const cur = data.h[i]?.y ?? NaN;
      const prev = data.h[i - 1]?.y ?? NaN;
      expect(cur).toBeGreaterThanOrEqual(prev - 1e-12);
    }
  });

  it('f = g - h pointwise to 1e-12 on the grid', () => {
    for (let i = 0; i < data.f.length; i++) {
      const fv = data.f[i]?.y ?? NaN;
      const gv = data.g[i]?.y ?? NaN;
      const hv = data.h[i]?.y ?? NaN;
      expectCloseTo(fv, gv - hv, 1e-12);
    }
  });

  it('g and h both start at 0 (h(0) = g(0) - f(0) = 0)', () => {
    expect(data.g[0]?.y).toBe(0);
    expect(data.h[0]?.y).toBe(0);
  });
});

describe('jordan-decomposition: problems export', () => {
  it('has exactly 3 entries with non-empty ko/en text', () => {
    expect(jordanDecompositionProblems.length).toBe(3);
    for (const p of jordanDecompositionProblems) {
      expect(p.id.length).toBeGreaterThan(0);
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.presetCaption.ko.length).toBeGreaterThan(0);
      expect(p.presetCaption.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('preset keys match the scene controls (only X0)', () => {
    for (const p of jordanDecompositionProblems) {
      expect(Object.keys(p.preset)).toEqual(['X0']);
      expect(p.preset['X0']).toBe(0.7);
    }
  });
});
