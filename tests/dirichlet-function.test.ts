import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  dirichletData,
  dirichletFunctionModel,
  MAX_DENOM,
  N_INIT,
  N_MAX,
  N_MIN,
  rationalsInUnit,
  type DirichletData,
} from '../src/chapters/calculus/models/dirichletFunction';
import { dirichletFunctionProblems } from '../src/chapters/calculus/problems/dirichlet-function';

const compute = (state: ControlState): DirichletData => syncCompute(dirichletFunctionModel, state);

describe('dirichlet-function: upper and lower sums for every partition', () => {
  it('U = 1 and L = 0 for every n in 1..32', () => {
    for (let n = N_MIN; n <= N_MAX; n++) {
      const data = dirichletData(n);
      expect(data.upper).toBe(1);
      expect(data.lower).toBe(0);
      expect(data.gap).toBe(1);
    }
  });

  it('the uniform partition has n subintervals covering [0,1]', () => {
    const data = dirichletData(8);
    expect(data.partition).toHaveLength(8);
    expect(data.partition[0]?.x0).toBe(0);
    expect(data.partition[7]?.x1).toBe(1);
    for (let k = 0; k < 8; k++) {
      expectCloseTo(data.partition[k]!.x1 - data.partition[k]!.x0, 1 / 8, 1e-15);
    }
  });

  it('rationalsInUnit exports reduced fractions p/q in [0,1] with q <= MAX_DENOM', () => {
    const dots = rationalsInUnit(MAX_DENOM);
    expect(dots.length).toBeGreaterThan(0);
    for (const d of dots) {
      expect(d.q).toBeLessThanOrEqual(MAX_DENOM);
      expect(d.q).toBeGreaterThanOrEqual(1);
      expect(d.p).toBeGreaterThanOrEqual(0);
      expect(d.p).toBeLessThanOrEqual(d.q);
      expectCloseTo(d.x, d.p / d.q, 1e-15);
    }
    // Sorted by x and endpoints present.
    for (let i = 1; i < dots.length; i++) {
      expect(dots[i]!.x).toBeGreaterThanOrEqual(dots[i - 1]!.x);
    }
    expect(dots[0]?.x).toBe(0);
    expect(dots[dots.length - 1]?.x).toBe(1);
    // Count check: 1 + sum_{q=2..12} phi(q) = 47 rationals.
    expect(dots).toHaveLength(47);
  });
});

describe('dirichlet-function: model compute', () => {
  it('reads n from the control state, clamps, defaults to init', () => {
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ n: 100 }).n).toBe(N_MAX);
    expect(compute({ n: -3 }).n).toBe(N_MIN);
    expect(compute({ n: 5.7 }).n).toBe(6);
    expect(compute({ n: 16 }).n).toBe(16);
  });

  it('exports the expected data keys', () => {
    const data = compute({ n: 8 });
    for (const key of ['n', 'upper', 'lower', 'gap', 'partition', 'dots'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('dirichlet-function: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(dirichletFunctionProblems);
    for (const p of dirichletFunctionProblems) {
      expect(p.preset['n']).toBe(8);
    }
  });

  it('the three ids are dirichlet-upper, dirichlet-lower, dirichlet-discontinuous', () => {
    expect(dirichletFunctionProblems.map((p) => p.id)).toEqual([
      'dirichlet-upper',
      'dirichlet-lower',
      'dirichlet-discontinuous',
    ]);
  });
});
