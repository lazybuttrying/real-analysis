import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  exactDoubleIntegral,
  fubiniTonelliData,
  fubiniTonelliModel,
  fValue,
  MODE_INIT,
  MODE_OPTIONS,
  N_INIT,
  N_MAX,
  N_MIN,
  type FubiniTonelliData,
  type ModeKind,
} from '../src/chapters/calculus/models/fubiniTonelli';
import { fubiniTonelliProblems } from '../src/chapters/calculus/problems/fubini-tonelli';

const compute = (state: ControlState): FubiniTonelliData =>
  syncCompute(fubiniTonelliModel, state);

describe('fubini-tonelli: separable f(x, y) = x * y', () => {
  it('exact double integral is 1/4', () => {
    expect(exactDoubleIntegral('separable')).toBe(1 / 4);
  });

  it('both iterated grid integrals are exactly 1/4 (midpoint is exact here)', () => {
    for (const n of [8, 32, 64]) {
      const data = fubiniTonelliData('separable', n);
      expectCloseTo(data.totalRows, 1 / 4, 1e-12);
      expectCloseTo(data.totalCols, 1 / 4, 1e-12);
      expectCloseTo(data.totalRows, data.totalCols, 1e-12);
    }
  });

  it('row sums follow R(y) = y/2 and column sums C(x) = x/2', () => {
    const n = 32;
    const data = fubiniTonelliData('separable', n);
    for (let j = 0; j < n; j++) {
      expectCloseTo(data.rowSums[j]!, data.ys[j]! / 2, 1e-12);
    }
    for (let i = 0; i < n; i++) {
      expectCloseTo(data.colSums[i]!, data.xs[i]! / 2, 1e-12);
    }
  });
});

describe('fubini-tonelli: tent f(x, y) = max(0, 1 - 3|x - y|)', () => {
  it('exact double integral is 8/27', () => {
    expectCloseTo(exactDoubleIntegral('tent'), 8 / 27, 1e-15);
  });

  it('both iterated grid integrals converge to 8/27 and agree', () => {
    const data = fubiniTonelliData('tent', N_MAX);
    expectCloseTo(data.totalRows, 8 / 27, 1e-3);
    expectCloseTo(data.totalCols, 8 / 27, 1e-3);
    expectCloseTo(data.totalRows, data.totalCols, 1e-12);
  });

  it('the tent is symmetric: f(x, y) = f(y, x), so rows and columns match', () => {
    const data = fubiniTonelliData('tent', 32);
    for (let j = 0; j < data.n; j++) {
      expectCloseTo(data.rowSums[j]!, data.colSums[j]!, 1e-12);
    }
  });

  it('fValue is nonnegative and peaks at 1 on the diagonal', () => {
    expect(fValue('tent', 0.5, 0.5)).toBe(1);
    expect(fValue('tent', 0, 1)).toBe(0);
    expect(fValue('tent', 0.1, 0.9)).toBe(0);
    expect(fValue('tent', 0.3, 0.5)).toBeCloseTo(1 - 3 * 0.2, 12);
  });
});

describe('fubini-tonelli: grid data shape', () => {
  it('cells, rowSums, colSums have the right lengths and midpoints', () => {
    for (const mode of MODE_OPTIONS as readonly ModeKind[]) {
      const n = 16;
      const data = fubiniTonelliData(mode, n);
      expect(data.n).toBe(n);
      expect(data.cells).toHaveLength(n * n);
      expect(data.rowSums).toHaveLength(n);
      expect(data.colSums).toHaveLength(n);
      expect(data.xs).toHaveLength(n);
      expectCloseTo(data.xs[0]!, 0.5 / n, 1e-15);
      expectCloseTo(data.xs[n - 1]!, 1 - 0.5 / n, 1e-15);
      // Row-major: cells[j * n + i] = f(x_i, y_j).
      expectCloseTo(data.cells[3 * n + 5]!, fValue(mode, data.xs[5]!, data.ys[3]!), 1e-15);
    }
  });
});

describe('fubini-tonelli: model compute', () => {
  it('reads mode and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).mode).toBe(MODE_INIT);
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ mode: 'nope' }).mode).toBe(MODE_INIT);
    for (const m of MODE_OPTIONS as readonly ModeKind[]) {
      expect(compute({ mode: m }).mode).toBe(m);
    }
    expect(compute({ n: 1000 }).n).toBe(N_MAX);
    expect(compute({ n: 1 }).n).toBe(N_MIN);
    expect(compute({ n: 33.7 }).n).toBe(34);
  });

  it('exports the expected data keys', () => {
    const data = compute({ mode: 'tent', n: 16 });
    for (const key of [
      'mode',
      'n',
      'xs',
      'ys',
      'cells',
      'rowSums',
      'colSums',
      'totalRows',
      'totalCols',
      'exact',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('fubini-tonelli: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(fubiniTonelliProblems);
  });

  it('the three ids are ft-tonelli-sep, ft-fubini-counter, ft-tonelli-simple', () => {
    expect(fubiniTonelliProblems.map((p) => p.id)).toEqual([
      'ft-tonelli-sep',
      'ft-fubini-counter',
      'ft-tonelli-simple',
    ]);
  });

  it('presets use valid mode options and in-range n', () => {
    for (const p of fubiniTonelliProblems) {
      expect(MODE_OPTIONS as readonly string[]).toContain(String(p.preset['mode']));
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
    }
  });
});
