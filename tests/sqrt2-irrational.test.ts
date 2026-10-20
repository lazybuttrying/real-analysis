import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DENOM_INIT,
  DENOM_MAX,
  DENOM_MIN,
  SQRT2,
  sqrt2IrrationalData,
  sqrt2IrrationalModel,
  type Sqrt2IrrationalData,
} from '../src/chapters/limits/models/sqrt2Irrational';
import { sqrt2IrrationalProblems } from '../src/chapters/limits/problems/sqrt2-irrational';

const compute = (state: ControlState): Sqrt2IrrationalData => syncCompute(sqrt2IrrationalModel, state);

describe('sqrt2-irrational: min distance numerics', () => {
  it('the gap never closes: min distance is > 0 for every N = 1..12', () => {
    for (let n = DENOM_MIN; n <= DENOM_MAX; n++) {
      const data = sqrt2IrrationalData(n);
      expect(data.minDist).toBeGreaterThan(0);
      expectCloseTo(data.bestValue - data.bestP / data.bestQ, 0, 1e-15);
    }
  });

  it('closest rational at N = 5 is 7/5', () => {
    const data = sqrt2IrrationalData(5);
    expect(data.bestP).toBe(7);
    expect(data.bestQ).toBe(5);
    expectCloseTo(data.minDist, 0.014213562373095234, 1e-15);
  });

  it('closest rational at N = 12 is 17/12', () => {
    const data = sqrt2IrrationalData(12);
    expect(data.bestP).toBe(17);
    expect(data.bestQ).toBe(12);
    expectCloseTo(data.minDist, 0.0024531042935712446, 1e-15);
  });

  it('min distance shrinks as the denominator cap grows', () => {
    let prev = Infinity;
    for (let n = DENOM_MIN; n <= DENOM_MAX; n++) {
      const d = sqrt2IrrationalData(n).minDist;
      expect(d).toBeLessThanOrEqual(prev);
      prev = d;
    }
    expect(sqrt2IrrationalData(DENOM_MAX).minDist).toBeLessThan(
      sqrt2IrrationalData(DENOM_MIN).minDist,
    );
  });

  it('points are distinct rationals p/q in [1, 2] with q <= N, sorted', () => {
    const data = sqrt2IrrationalData(6);
    const keys = new Set<string>();
    let prevValue = -Infinity;
    for (const pt of data.points) {
      expect(pt.q).toBeGreaterThanOrEqual(1);
      expect(pt.q).toBeLessThanOrEqual(6);
      expect(pt.value).toBeGreaterThanOrEqual(1);
      expect(pt.value).toBeLessThanOrEqual(2);
      expectCloseTo(pt.p / pt.q, pt.value, 1e-15);
      expect(pt.value).toBeGreaterThan(prevValue);
      prevValue = pt.value;
      const key = `${pt.p}/${pt.q}`;
      expect(keys.has(key)).toBe(false);
      keys.add(key);
    }
    // 1 = 1/1 and 2 = 2/1 are always included; sqrt(2) never is.
    expect(keys.has('1/1')).toBe(true);
    expect(keys.has('2/1')).toBe(true);
    for (const pt of data.points) {
      expect(pt.value).not.toBe(SQRT2);
    }
  });
});

describe('sqrt2-irrational: the convergents from problem 3', () => {
  it('(7/5)^2 = 49/25 < 2 < 289/144 = (17/12)^2', () => {
    expectCloseTo((7 / 5) ** 2, 49 / 25, 1e-15);
    expectCloseTo((17 / 12) ** 2, 289 / 144, 1e-15);
    expect(49 / 25).toBeLessThan(2);
    expect(289 / 144).toBeGreaterThan(2);
  });

  it('17/12 - 7/5 = 1/60 < 0.06', () => {
    expectCloseTo(17 / 12 - 7 / 5, 1 / 60, 1e-15);
    expect(17 / 12 - 7 / 5).toBeLessThan(0.06);
  });
});

describe('sqrt2-irrational: model compute', () => {
  it('reads denom from the control state, clamps, defaults to init', () => {
    expect(compute({}).denom).toBe(DENOM_INIT);
    expect(compute({ denom: 100 }).denom).toBe(DENOM_MAX);
    expect(compute({ denom: 0 }).denom).toBe(DENOM_MIN);
    expect(compute({ denom: 4.7 }).denom).toBe(5);
    expect(compute({ denom: 'junk' }).denom).toBe(DENOM_INIT);
    expect(compute({ denom: 3 }).denom).toBe(3);
  });

  it('exports the expected data keys', () => {
    const data = compute({ denom: 6 });
    for (const key of ['denom', 'points', 'bestP', 'bestQ', 'bestValue', 'minDist'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('sqrt2-irrational: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(sqrt2IrrationalProblems);
  });

  it('the three ids are sqrt2-irrational-proof, sqrt2-irrational-lowest-terms, sqrt2-irrational-convergents', () => {
    expect(sqrt2IrrationalProblems.map((p) => p.id)).toEqual([
      'sqrt2-irrational-proof',
      'sqrt2-irrational-lowest-terms',
      'sqrt2-irrational-convergents',
    ]);
  });
});
