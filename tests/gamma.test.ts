import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  gamma,
  gammaData,
  gammaModel,
  simpson,
  type GammaData,
} from '../src/chapters/series/models/gamma';

const compute = (state: ControlState): GammaData => syncCompute(gammaModel, state);

describe('gamma: Simpson helper is exact on low-degree polynomials', () => {
  it('integrates t^2 on [0, 1] exactly (Simpson is exact through cubics)', () => {
    expect(simpson((t) => t * t, 0, 1, 2)).toBeCloseTo(1 / 3, 15);
    expect(simpson(() => 1, 0, 40, 4000)).toBeCloseTo(40, 12);
  });
});

describe('gamma: matches the factorial at integers (tol 1e-6)', () => {
  it('gives Gamma(1)=1, Gamma(2)=1, Gamma(3)=2, Gamma(4)=6, Gamma(5)=24', () => {
    expect(gamma(1)).toBeCloseTo(1, 6);
    expect(gamma(2)).toBeCloseTo(1, 6);
    expect(gamma(3)).toBeCloseTo(2, 6);
    expect(gamma(4)).toBeCloseTo(6, 6);
    expect(gamma(5)).toBeCloseTo(24, 6);
  });
});

describe('gamma: the half-integer value (tol 1e-6)', () => {
  it('gives Gamma(1/2) = sqrt(pi)', () => {
    expect(gamma(0.5)).toBeCloseTo(Math.sqrt(Math.PI), 6);
  });

  it('gives Gamma(3/2) = sqrt(pi)/2 by the recurrence', () => {
    expect(gamma(1.5)).toBeCloseTo(Math.sqrt(Math.PI) / 2, 6);
  });
});

describe('gamma: the functional equation holds by construction (tol 1e-9)', () => {
  it('satisfies gamma(2.7) = 1.7 * gamma(1.7)', () => {
    expectCloseTo(gamma(2.7), 1.7 * gamma(1.7), 1e-9);
  });

  it('satisfies Gamma(3.5) = 2.5 * Gamma(2.5) through the model', () => {
    expect(compute({ x: 3.5 }).value).toBeCloseTo(2.5 * compute({ x: 2.5 }).value, 12);
  });
});

describe('gamma: sample grid and factorial dots', () => {
  it('returns 200 samples spanning [0.05, 4]', () => {
    const d = gammaData(2);
    expect(d.samples).toHaveLength(200);
    expect(d.samples[0]?.x).toBeCloseTo(0.05, 12);
    expect(d.samples[199]?.x).toBeCloseTo(4, 12);
  });

  it('marks the four factorial dots (n, (n-1)!)', () => {
    expect(gammaData(2).dots).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 6 },
    ]);
  });

  it('agrees with gamma() at the sample points', () => {
    const d = gammaData(1.7);
    expect(d.value).toBeCloseTo(gamma(1.7), 15);
    for (const s of d.samples) {
      expect(s.y).toBeCloseTo(gamma(s.x), 12);
    }
  });
});

describe('gamma: model compute clamps state', () => {
  it('clamps x into [0.1, 4] and defaults to 2', () => {
    expect(compute({ x: 99 }).x).toBe(4);
    expect(compute({ x: -5 }).x).toBe(0.1);
    expect(compute({}).x).toBe(2);
    expect(compute({ x: Number.NaN }).x).toBe(2);
    expect(compute({ x: 0.1 }).x).toBeCloseTo(0.1, 12);
  });

  it('echoes the clamped x and its value', () => {
    const d = compute({ x: 2.5 });
    expect(d.x).toBeCloseTo(2.5, 12);
    expect(d.value).toBeCloseTo(gamma(2.5), 15);
  });
});
