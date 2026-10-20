import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  limitKindOf,
  N_INIT,
  N_MAX,
  N_MIN,
  PLOT_CLIP,
  ROOT_X_MAX,
  ROOT_X_MIN,
  standardLimitsData,
  standardLimitsModel,
  X_INIT,
  X_MAX,
  X_MIN,
  type StandardLimitsData,
} from '../src/chapters/limits/models/standardLimits';
import { problems as standardLimitsProblems } from '../src/chapters/limits/problems/standard-limits';

const compute = (state: ControlState): StandardLimitsData => syncCompute(standardLimitsModel, state);

describe('standard-limits: power-mode numerics', () => {
  it('0.5^60 < 1e-18 (problem 1 preset scale)', () => {
    const data = standardLimitsData('power', 0.5, 60);
    expect(data.regime).toBe('converges-zero');
    expect(data.limit).toBe(0);
    expect(data.points).toHaveLength(60);
    expect(data.points[59]?.value).toBeLessThan(1e-18);
    expectCloseTo(data.points[19]?.value ?? -1, Math.pow(0.5, 20), 1e-15);
  });

  it('x = 1 converges to 1', () => {
    const data = standardLimitsData('power', 1, 10);
    expect(data.regime).toBe('converges-one');
    expect(data.limit).toBe(1);
    for (const p of data.points) expect(p.value).toBe(1);
  });

  it('x = -1 oscillates with no limit', () => {
    const data = standardLimitsData('power', -1, 10);
    expect(data.regime).toBe('oscillates');
    expect(data.limit).toBeNaN();
    expect(data.points.map((p) => p.value)).toEqual(
      Array.from({ length: 10 }, (_, k) => (k % 2 === 0 ? -1 : 1)),
    );
  });

  it('|x| > 1 is unbounded with no limit', () => {
    const data = standardLimitsData('power', 1.5, 10);
    expect(data.regime).toBe('unbounded');
    expect(data.limit).toBeNaN();
    expectCloseTo(data.points[9]?.value ?? -1, Math.pow(1.5, 10), 1e-9);
  });

  it('negative |x| > 1 alternates sign while growing', () => {
    const data = standardLimitsData('power', -2, 6);
    expect(data.regime).toBe('unbounded');
    expect(data.points[4]?.value).toBe(-32); // k = 5: (-2)^5
    expect(data.points[5]?.value).toBe(64); // k = 6: (-2)^6
    expect(data.points[4]?.value).toBeLessThan(-PLOT_CLIP);
    expect(data.points[5]?.value).toBeGreaterThan(PLOT_CLIP);
  });
});

describe('standard-limits: root-mode numerics', () => {
  it('2^(1/60) is within 0.02 of 1', () => {
    const data = standardLimitsData('root', 2, 60);
    expect(data.regime).toBe('converges-one');
    expect(data.limit).toBe(1);
    expect(data.points).toHaveLength(60);
    expectCloseTo(data.points[59]?.value ?? -1, 1, 0.02);
    expectCloseTo(data.points[59]?.value ?? -1, Math.pow(2, 1 / 60), 1e-12);
  });

  it('x < 1 converges to 1 from below', () => {
    const data = standardLimitsData('root', 0.5, 30);
    expect(data.limit).toBe(1);
    for (const p of data.points) expect(p.value).toBeLessThan(1);
    for (let i = 1; i < data.points.length; i++) {
      expect(data.points[i]?.value).toBeGreaterThan(data.points[i - 1]?.value ?? 0);
    }
  });

  it('the problem-3 bound holds numerically: n^(1/n) - 1 <= sqrt(2/(n-1))', () => {
    for (const n of [10, 30, 60, 200]) {
      const t = Math.pow(n, 1 / n) - 1;
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(Math.sqrt(2 / (n - 1)));
    }
    expectCloseTo(Math.pow(60, 1 / 60) - 1, 0.0706, 0.001);
  });
});

describe('standard-limits: model compute', () => {
  it('defaults to power, x = 0.5, n = 20', () => {
    const data = compute({});
    expect(data.kind).toBe('power');
    expect(data.x).toBe(X_INIT);
    expect(data.n).toBe(N_INIT);
  });

  it('clamps x and n, and clamps x to (0.05, 2] in root mode', () => {
    expect(compute({ x: 5 }).x).toBe(X_MAX);
    expect(compute({ x: -5 }).x).toBe(X_MIN);
    expect(compute({ n: 100 }).n).toBe(N_MAX);
    expect(compute({ n: 0 }).n).toBe(N_MIN);
    expect(compute({ kind: 'root', x: -1 }).x).toBe(ROOT_X_MIN);
    expect(compute({ kind: 'root', x: 7 }).x).toBe(ROOT_X_MAX);
    expect(compute({ kind: 'root', x: 2 }).x).toBe(2);
  });

  it('falls back to power for an unknown kind', () => {
    expect(limitKindOf('weird')).toBe('power');
    expect(compute({ kind: 'weird' }).kind).toBe('power');
  });

  it('exports the expected data keys', () => {
    const data = compute({ kind: 'power', x: 0.5, n: 20 });
    for (const key of ['kind', 'x', 'n', 'points', 'regime', 'limit'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('standard-limits: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(standardLimitsProblems);
  });

  it('the three ids are power-to-zero, root-to-one, nth-root-of-n', () => {
    expect(standardLimitsProblems.map((p) => p.id)).toEqual([
      'power-to-zero',
      'root-to-one',
      'nth-root-of-n',
    ]);
  });

  it('presets use declared controls with valid values', () => {
    const presets = standardLimitsProblems.map((p) => p.preset);
    expect(presets).toEqual([
      { kind: 'power', x: 0.5, n: 20 },
      { kind: 'root', x: 2, n: 20 },
      { kind: 'root', x: 2, n: 60 },
    ]);
    for (const preset of presets) {
      expect(['power', 'root']).toContain(preset['kind']);
      expect(preset['x']).toBeGreaterThanOrEqual(X_MIN);
      expect(preset['x']).toBeLessThanOrEqual(X_MAX);
      expect(preset['n']).toBeGreaterThanOrEqual(N_MIN);
      expect(preset['n']).toBeLessThanOrEqual(N_MAX);
    }
  });
});
