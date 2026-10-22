import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  colLimit,
  diagonalLimit,
  doubleLimit,
  doubleSequencesModel,
  doubleValue,
  DOUBLE_EXAMPLE_INIT,
  DOUBLE_EXAMPLES,
  DOUBLE_K_INIT,
  DOUBLE_K_MAX,
  DOUBLE_K_MIN,
  iteratedMFirst,
  iteratedNFirst,
  rowLimit,
  type DoubleSequencesData,
} from '../src/chapters/limits/models/doubleSequences';
import { doubleSequencesProblems } from '../src/chapters/limits/problems/double-sequences';

const compute = (state: ControlState): DoubleSequencesData =>
  syncCompute(doubleSequencesModel, state);

describe('double-sequences: the ratio example m/(m+n)', () => {
  it('has the stated values, with constant diagonal 1/2 (Problem 1)', () => {
    expectCloseTo(doubleValue('ratio', 3, 9), 0.25, 1e-15);
    for (const k of [1, 2, 7, 50, 1000]) {
      expectCloseTo(doubleValue('ratio', k, k), 1 / 2, 1e-15);
    }
    expect(diagonalLimit('ratio')).toBe(1 / 2);
  });

  it('row limits are 0: for fixed m, a(m, n) < m/n (Problem 1 (i))', () => {
    for (const m of [1, 3, 10]) {
      expect(rowLimit('ratio', m)).toBe(0);
      // a(m, n) < m/n, and at n = 100000 * m the bound m/n is 1e-5.
      expect(doubleValue('ratio', m, 100000 * m)).toBeLessThan(m / (100000 * m) + 1e-12);
      expect(doubleValue('ratio', m, 100000 * m)).toBeLessThan(1.1e-5);
      expect(doubleValue('ratio', m, 100000 * m)).toBeGreaterThan(0);
    }
    expect(iteratedNFirst('ratio')).toBe(0);
  });

  it('column limits are 1: for fixed n, |a(m, n) - 1| < n/m (Problem 1 (ii))', () => {
    for (const n of [1, 4, 10]) {
      expect(colLimit('ratio', n)).toBe(1);
      const v = doubleValue('ratio', 100000 * n, n);
      expect(Math.abs(v - 1)).toBeLessThan(n / (100000 * n) + 1e-12);
      expect(Math.abs(v - 1)).toBeLessThan(1.1e-5);
    }
    expect(iteratedMFirst('ratio')).toBe(1);
  });

  it('has no double limit: the path a(k, k^2) = 1/(1+k) -> 0 vs diagonal 1/2 (Problem 1 (iii))', () => {
    expect(doubleLimit('ratio')).toBeNull();
    for (const k of [9, 99, 999]) {
      expectCloseTo(doubleValue('ratio', k, k * k), 1 / (1 + k), 1e-15);
    }
    // The two paths stay ~1/2 apart arbitrarily far out.
    const gap = Math.abs(doubleValue('ratio', 999, 999) - doubleValue('ratio', 999, 999 * 999));
    expectCloseTo(gap, 1 / 2 - 1 / 1000, 1e-12);
  });
});

describe('double-sequences: the difference example (m-n)/(m+n)', () => {
  it('row limits -1, column limits 1, diagonal constantly 0', () => {
    expectCloseTo(doubleValue('difference', 3, 1), 1 / 2, 1e-15);
    expectCloseTo(doubleValue('difference', 1, 3), -1 / 2, 1e-15);
    for (const k of [1, 5, 100]) {
      expectCloseTo(doubleValue('difference', k, k), 0, 1e-15);
    }
    expect(diagonalLimit('difference')).toBe(0);
    expect(rowLimit('difference', 5)).toBe(-1);
    expect(colLimit('difference', 5)).toBe(1);
    expect(Math.abs(doubleValue('difference', 5, 100000) - -1)).toBeLessThan(1.1e-4);
    expect(Math.abs(doubleValue('difference', 100000, 5) - 1)).toBeLessThan(1.1e-4);
    expect(iteratedNFirst('difference')).toBe(-1);
    expect(iteratedMFirst('difference')).toBe(1);
    expect(doubleLimit('difference')).toBeNull();
  });
});

describe('double-sequences: the product example mn/(m^2+n^2)', () => {
  it('both iterated limits are 0 but the diagonal is constantly 1/2', () => {
    expect(rowLimit('product', 7)).toBe(0);
    expect(colLimit('product', 7)).toBe(0);
    expect(iteratedNFirst('product')).toBe(0);
    expect(iteratedMFirst('product')).toBe(0);
    for (const k of [1, 3, 40, 1000]) {
      expectCloseTo(doubleValue('product', k, k), 1 / 2, 1e-15);
    }
    expect(diagonalLimit('product')).toBe(1 / 2);
    expect(doubleLimit('product')).toBeNull();
    // Inner limits numerically: a(5, n) ~ 5/n -> 0.
    expect(doubleValue('product', 5, 100000)).toBeLessThan(1e-4);
    expect(doubleValue('product', 100000, 5)).toBeLessThan(1e-4);
    // Far out, the grid still contains the value 1/2 on the diagonal:
    // no candidate L can be within 1/8 of both 0-ish rows and 1/2.
    expect(Math.abs(doubleValue('product', 500, 500) - 0)).toBeGreaterThan(1 / 4);
  });
});

describe('double-sequences: the vanishing example (-1)^n / m', () => {
  it('has |a(m, n)| = 1/m for all n, so the double limit is 0 (Problem 3 (i))', () => {
    expect(doubleLimit('vanishing')).toBe(0);
    for (const m of [1, 2, 13]) {
      for (const n of [1, 2, 3, 100, 101]) {
        expectCloseTo(Math.abs(doubleValue('vanishing', m, n)), 1 / m, 1e-15);
      }
    }
    // eps = 1e-3 is met by every entry with m > 1000, uniformly in n.
    for (let n = 1; n <= 64; n++) {
      expect(Math.abs(doubleValue('vanishing', 1001, n))).toBeLessThan(1e-3);
    }
  });

  it('rows oscillate between -1/m and 1/m: no row limit exists (Problem 3 (ii))', () => {
    for (const m of [1, 2, 7]) {
      expect(rowLimit('vanishing', m)).toBeNull();
      expectCloseTo(doubleValue('vanishing', m, 200), 1 / m, 1e-15);
      expectCloseTo(doubleValue('vanishing', m, 201), -1 / m, 1e-15);
      // The two subsequential values are 2/m apart, exceeding 2 * (1/(2m)).
      const spread = Math.abs(doubleValue('vanishing', m, 200) - doubleValue('vanishing', m, 201));
      expectCloseTo(spread, 2 / m, 1e-15);
    }
    expect(iteratedNFirst('vanishing')).toBeNull();
  });

  it('column limits are all 0, so the other iterated limit is 0 (Problem 3 (iii))', () => {
    for (const n of [1, 2, 99]) {
      expect(colLimit('vanishing', n)).toBe(0);
      expect(Math.abs(doubleValue('vanishing', 100000, n))).toBeLessThan(1.1e-5);
    }
    expect(iteratedMFirst('vanishing')).toBe(0);
    expect(diagonalLimit('vanishing')).toBe(0);
    expect(Math.abs(doubleValue('vanishing', 999, 999))).toBeLessThan(0.002);
  });
});

describe('double-sequences: model compute', () => {
  it('defaults to the ratio example with init k', () => {
    const data = compute({});
    expect(data.example).toBe(DOUBLE_EXAMPLE_INIT);
    expect(data.k).toBe(DOUBLE_K_INIT);
  });

  it('an unknown example id falls back to the init example', () => {
    expect(compute({ example: 'nope', k: 6 }).example).toBe('ratio');
    expect(compute({ example: 42, k: 6 }).example).toBe('ratio');
  });

  it('clamps k into range; NaN gives init', () => {
    expect(compute({ example: 'ratio', k: 1000 }).k).toBe(DOUBLE_K_MAX);
    expect(compute({ example: 'ratio', k: 0 }).k).toBe(DOUBLE_K_MIN);
    expect(compute({ example: 'ratio', k: NaN }).k).toBe(DOUBLE_K_INIT);
  });

  it('the grid and limit strips agree with the analytic functions', () => {
    for (const example of DOUBLE_EXAMPLES) {
      const data = compute({ example, k: 9 });
      expect(data.grid).toHaveLength(9);
      expect(data.rowLimits).toHaveLength(9);
      expect(data.colLimits).toHaveLength(9);
      for (let m = 1; m <= 9; m++) {
        for (let n = 1; n <= 9; n++) {
          expect((data.grid[m - 1] as number[])[n - 1]).toBe(doubleValue(example, m, n));
        }
        expect(data.rowLimits[m - 1]).toBe(rowLimit(example, m));
        expect(data.colLimits[m - 1]).toBe(colLimit(example, m));
      }
      expect(data.diagonal).toBe(doubleValue(example, 9, 9));
      expect(data.iteratedNFirst).toBe(iteratedNFirst(example));
      expect(data.iteratedMFirst).toBe(iteratedMFirst(example));
      expect(data.doubleLimit).toBe(doubleLimit(example));
      expect(data.diagonalLimit).toBe(diagonalLimit(example));
    }
  });

  it('exports the expected data keys', () => {
    const data = compute({ example: 'product', k: 6 });
    for (const key of [
      'example', 'k', 'grid', 'rowLimits', 'colLimits', 'iteratedNFirst',
      'iteratedMFirst', 'doubleLimit', 'diagonal', 'diagonalLimit',
      'colorLo', 'colorHi',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('double-sequences: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(doubleSequencesProblems);
  });

  it('the three ids are ratio-iterated-limits-differ, iterated-limits-theorem, double-limit-without-iterated', () => {
    expect(doubleSequencesProblems.map((p) => p.id)).toEqual([
      'ratio-iterated-limits-differ',
      'iterated-limits-theorem',
      'double-limit-without-iterated',
    ]);
  });

  it('presets use valid example ids and k in range', () => {
    const ids = new Set<string>(DOUBLE_EXAMPLES);
    for (const p of doubleSequencesProblems) {
      expect(ids.has(String(p.preset['example']))).toBe(true);
      const k = Number(p.preset['k']);
      expect(k).toBeGreaterThanOrEqual(DOUBLE_K_MIN);
      expect(k).toBeLessThanOrEqual(DOUBLE_K_MAX);
    }
  });

  it('preset claims match the model: ratio has split iterated limits, vanishing has double limit 0', () => {
    const byId = (id: string) => doubleSequencesProblems.find((p) => p.id === id)!;
    const ratio = compute(byId('ratio-iterated-limits-differ').preset);
    expect(ratio.example).toBe('ratio');
    expect(ratio.iteratedNFirst).toBe(0);
    expect(ratio.iteratedMFirst).toBe(1);
    expect(ratio.doubleLimit).toBeNull();
    const theorem = compute(byId('iterated-limits-theorem').preset);
    expect(theorem.example).toBe('vanishing');
    expect(theorem.doubleLimit).toBe(0);
    expect(theorem.iteratedMFirst).toBe(0);
    const without = compute(byId('double-limit-without-iterated').preset);
    expect(without.example).toBe('vanishing');
    expect(without.doubleLimit).toBe(0);
    expect(without.iteratedNFirst).toBeNull();
  });
});
