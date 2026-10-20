import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  gabrielAreaLower,
  gabrielAreaNumeric,
  gabrielHornModel,
  gabrielVolume,
  GABRIEL_R_INIT,
  GABRIEL_R_MAX,
  GABRIEL_R_MIN,
  type GabrielHornData,
} from '../src/chapters/calculus/models/gabrielHorn';
import { gabrielHornProblems } from '../src/chapters/calculus/problems/gabriel-horn';

const compute = (state: ControlState): GabrielHornData => syncCompute(gabrielHornModel, state);

describe('gabriel-horn: exact volume', () => {
  it('V(R) = pi (1 - 1/R)', () => {
    expectCloseTo(gabrielVolume(1), 0, 1e-15);
    expectCloseTo(gabrielVolume(2), Math.PI / 2, 1e-15);
    expectCloseTo(gabrielVolume(5), Math.PI * 0.8, 1e-12);
    expectCloseTo(gabrielVolume(50), 3.0787608005, 1e-9);
  });

  it('volume is increasing and bounded by pi', () => {
    let prev = -1;
    for (const r of [1, 2, 5, 10, 20, 50]) {
      const v = gabrielVolume(r);
      expect(v).toBeGreaterThan(prev);
      expect(v).toBeLessThan(Math.PI);
      prev = v;
    }
  });
});

describe('gabriel-horn: surface area', () => {
  it('lower bound A(R) > 2 pi ln R', () => {
    expectCloseTo(gabrielAreaLower(1), 0, 1e-15);
    expectCloseTo(gabrielAreaLower(10), 14.4675688248, 1e-9);
    expectCloseTo(gabrielAreaLower(50), 24.5799654691, 1e-9);
  });

  it('quadrature stays above the lower bound and diverges', () => {
    expectCloseTo(gabrielAreaNumeric(1), 0, 1e-15);
    expectCloseTo(gabrielAreaNumeric(10), 15.1774498749, 1e-6);
    expectCloseTo(gabrielAreaNumeric(50), 25.2899249789, 1e-6);
    let prevLower = -1;
    for (const r of [1, 5, 10, 20, 50]) {
      const num = gabrielAreaNumeric(r);
      const lower = gabrielAreaLower(r);
      expect(num).toBeGreaterThanOrEqual(lower - 1e-9);
      expect(lower).toBeGreaterThanOrEqual(prevLower);
      prevLower = lower;
    }
  });

  it('area grows without bound while volume settles', () => {
    expect(gabrielAreaLower(50)).toBeGreaterThan(20);
    expect(Math.PI - gabrielVolume(50)).toBeLessThan(0.07);
  });
});

describe('gabriel-horn: profile and stations', () => {
  it('profile traces y = 1/x on [1, R]', () => {
    const data = compute({ r: 10 });
    expect(data.profile.length).toBeGreaterThan(100);
    expectCloseTo(data.profile[0]!.x, 1, 1e-12);
    expectCloseTo(data.profile[0]!.y, 1, 1e-12);
    const last = data.profile[data.profile.length - 1]!;
    expectCloseTo(last.x, 10, 1e-12);
    expectCloseTo(last.y, 0.1, 1e-12);
    for (const p of data.profile) {
      expectCloseTo(p.y, 1 / p.x, 1e-12);
    }
  });

  it('stations lie in [1, R] and start at 1', () => {
    const data = compute({ r: 20 });
    expect(data.stations.length).toBeGreaterThan(3);
    expect(data.stations[0]).toBe(1);
    for (const s of data.stations) {
      expect(s).toBeGreaterThanOrEqual(1);
      expect(s).toBeLessThanOrEqual(20);
    }
  });
});

describe('gabriel-horn: model compute', () => {
  it('reads r from the control state, clamps, defaults to init', () => {
    expect(compute({}).r).toBe(GABRIEL_R_INIT);
    expect(compute({ r: 100 }).r).toBe(GABRIEL_R_MAX);
    expect(compute({ r: 0.2 }).r).toBe(GABRIEL_R_MIN);
    expect(compute({ r: 7 }).r).toBe(7);
    expect(compute({ r: NaN }).r).toBe(GABRIEL_R_INIT);
  });

  it('volume limit is exactly pi', () => {
    expect(compute({ r: 5 }).volumeLimit).toBe(Math.PI);
  });

  it('exports the expected data keys', () => {
    const data = compute({ r: 5 });
    for (const key of [
      'r', 'volume', 'volumeLimit', 'areaLower', 'areaNumeric', 'profile', 'stations',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('gabriel-horn: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(gabrielHornProblems);
  });

  it('the three ids are gabriel-volume, gabriel-area, gabriel-painter', () => {
    expect(gabrielHornProblems.map((p) => p.id)).toEqual([
      'gabriel-volume',
      'gabriel-area',
      'gabriel-painter',
    ]);
  });

  it('presets use r in [1, 50]', () => {
    for (const p of gabrielHornProblems) {
      const r = Number(p.preset['r']);
      expect(r).toBeGreaterThanOrEqual(GABRIEL_R_MIN);
      expect(r).toBeLessThanOrEqual(GABRIEL_R_MAX);
    }
  });
});
