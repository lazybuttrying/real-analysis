import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  constructRational,
  DENOM_INIT,
  DENOM_MAX,
  DENOM_MIN,
  densityOfRationalsData,
  densityOfRationalsModel,
  PRESET_INIT,
  PRESET_INTERVALS,
  rationalsInInterval,
  type DensityOfRationalsData,
  type DensityPresetId,
} from '../src/chapters/limits/models/densityOfRationals';
import { densityOfRationalsProblems } from '../src/chapters/limits/problems/density-of-rationals';

const compute = (state: ControlState): DensityOfRationalsData =>
  syncCompute(densityOfRationalsModel, state);

describe('density-of-rationals: Tao construction on the three presets', () => {
  it('preset a (1, 2): n = 2, m = 3, q = 3/2', () => {
    const c = constructRational(1, 2);
    expect(c.n).toBe(2);
    expect(c.m).toBe(3);
    expect(c.value).toBe(1.5);
    expect(c.verified).toBe(true);
  });

  it('preset b (0, 0.1): n = 11, m = 1, q = 1/11', () => {
    const c = constructRational(0, 0.1);
    expect(c.n).toBe(11);
    expect(c.m).toBe(1);
    expectCloseTo(c.value, 1 / 11, 1e-15);
    expect(c.verified).toBe(true);
  });

  it('preset c (-3.5, -3.4): n = 11, m = -38, q = -38/11', () => {
    const c = constructRational(-3.5, -3.4);
    expect(c.n).toBe(11);
    expect(c.m).toBe(-38);
    expectCloseTo(c.value, -38 / 11, 1e-15);
    expect(c.verified).toBe(true);
  });

  it('x < m/n < y holds on a grid of intervals', () => {
    const widths = [0.1, 0.25, 0.5, 1, 2];
    for (let k = -10; k <= 10; k++) {
      const x = k * 0.5;
      for (const w of widths) {
        const y = x + w;
        const c = constructRational(x, y);
        // The Archimedean step: 1/n < y - x.
        expect(1 / c.n).toBeLessThan(y - x);
        // Prop 4.4.1 step: m - 1 <= n*x < m.
        expect(c.m - 1).toBeLessThanOrEqual(c.n * x);
        expect(c.n * x).toBeLessThan(c.m);
        expect(c.verified).toBe(true);
        expect(x).toBeLessThan(c.value);
        expect(c.value).toBeLessThan(y);
      }
    }
  });
});

describe('density-of-rationals: rationalsInInterval', () => {
  it('lists rationals strictly inside (x, y) with denominator <= denom', () => {
    for (const preset of ['a', 'b', 'c'] as const) {
      const { x, y } = PRESET_INTERVALS[preset];
      const grid = rationalsInInterval(x, y, 12);
      expect(grid.length).toBeGreaterThan(0);
      for (const t of grid) {
        expect(t.q).toBeGreaterThanOrEqual(1);
        expect(t.q).toBeLessThanOrEqual(12);
        expect(t.value).toBeGreaterThan(x);
        expect(t.value).toBeLessThan(y);
        expectCloseTo(t.p / t.q, t.value, 1e-15);
      }
    }
  });

  it('excludes endpoints even when a grid point lands exactly on one', () => {
    // -34/10 = -3.4 = y of preset c: must be excluded (open interval).
    const grid = rationalsInInterval(-3.5, -3.4, 10);
    for (const t of grid) {
      expect(t.value).toBeLessThan(-3.4);
      expect(t.value).toBeGreaterThan(-3.5);
    }
    expect(grid.some((t) => t.p === -34 && t.q === 10)).toBe(false);
  });

  it('the grid grows with the denominator cap', () => {
    const small = rationalsInInterval(1, 2, 6).length;
    const big = rationalsInInterval(1, 2, 60).length;
    expect(big).toBeGreaterThan(small);
  });

  it('the constructed rational is always among the listed ticks', () => {
    const data = densityOfRationalsData('a', 24);
    const { n, m } = data.constructed;
    expect(n).toBeLessThanOrEqual(24);
    expect(
      data.grid.some((t) => t.p === m && t.q === n),
    ).toBe(true);
  });
});

describe('density-of-rationals: model compute', () => {
  it('reads preset and denom from the control state, clamps, defaults', () => {
    expect(compute({}).preset).toBe(PRESET_INIT);
    expect(compute({}).denom).toBe(DENOM_INIT);
    expect(compute({ preset: 'b' }).preset).toBe('b' as DensityPresetId);
    expect(compute({ preset: 'bogus' }).preset).toBe(PRESET_INIT);
    expect(compute({ denom: 500 }).denom).toBe(DENOM_MAX);
    expect(compute({ denom: 0 }).denom).toBe(DENOM_MIN);
    expect(compute({ denom: 7.6 }).denom).toBe(8);
    expect(compute({ preset: 'c', denom: 30 }).x).toBe(-3.5);
    expect(compute({ preset: 'c', denom: 30 }).y).toBe(-3.4);
  });

  it('exports the expected data keys', () => {
    const data = compute({ preset: 'a', denom: 24 });
    for (const key of ['preset', 'x', 'y', 'denom', 'constructed', 'grid'] as const) {
      expect(data).toHaveProperty(key);
    }
    for (const key of ['n', 'm', 'value', 'verified'] as const) {
      expect(data.constructed).toHaveProperty(key);
    }
  });
});

describe('density-of-rationals: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(densityOfRationalsProblems);
    for (const p of densityOfRationalsProblems) {
      expect(p.preset['preset']).toBe('a');
    }
  });

  it('the three ids are density-integer-step, density-rationals-proof, density-irrationals', () => {
    expect(densityOfRationalsProblems.map((p) => p.id)).toEqual([
      'density-integer-step',
      'density-rationals-proof',
      'density-irrationals',
    ]);
  });
});
