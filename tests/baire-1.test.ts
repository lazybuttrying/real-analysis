import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  activeBumpCount,
  baireOneData,
  baireOneModel,
  DEFAULT_N,
  gcd,
  GRID_POINTS,
  MAX_N,
  MIN_N,
  reducedRationals,
  thomaeApprox,
  tri,
  type BaireOneData,
} from '../src/chapters/limits/models/baireOne';
import { baireOneProblems } from '../src/chapters/limits/problems/baire-1';

const compute = (state: ControlState): BaireOneData => syncCompute(baireOneModel, state);

describe('baire-1: tent helpers', () => {
  it('tri is the tent: tri(0) = 1, tri(+-1) = 0, tri(+-2) = 0', () => {
    expect(tri(0)).toBe(1);
    expect(tri(1)).toBe(0);
    expect(tri(-1)).toBe(0);
    expect(tri(2)).toBe(0);
    expect(tri(-2)).toBe(0);
    expectCloseTo(tri(0.25), 0.75, 1e-15);
  });

  it('gcd is correct on small values', () => {
    expect(gcd(6, 4)).toBe(2);
    expect(gcd(7, 5)).toBe(1);
    expect(gcd(0, 1)).toBe(1);
    expect(gcd(12, 12)).toBe(12);
  });

  it('reducedRationals(n) is the Farey set: reduced, denominators <= n, in [0,1]', () => {
    for (const n of [2, 5, 12]) {
      const rats = reducedRationals(n);
      expect(rats.length).toBeGreaterThan(0);
      for (const { p, q } of rats) {
        expect(q).toBeGreaterThanOrEqual(1);
        expect(q).toBeLessThanOrEqual(n);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(q);
        expect(gcd(p, q)).toBe(1);
      }
      // 0/1 and 1/1 present (Thomae gives 1 there).
      expect(rats.some(({ p, q }) => p === 0 && q === 1)).toBe(true);
      expect(rats.some(({ p, q }) => p === 1 && q === 1)).toBe(true);
      // 1/2 present exactly once (reduced-only sum: no double counting).
      expect(rats.filter(({ p, q }) => p / q === 0.5).length).toBe(1);
    }
    expect(reducedRationals(5).length).toBe(11);
    expect(reducedRationals(12).length).toBe(47);
  });
});

describe('baire-1: tents are pairwise disjoint', () => {
  it('at most one tent nonzero per x for n = 2..12 (8001-point grid)', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      let maxActive = 0;
      for (let i = 0; i <= 8000; i++) {
        const c = activeBumpCount(i / 8000, n);
        if (c > maxActive) maxActive = c;
      }
      expect(maxActive).toBeLessThanOrEqual(1);
    }
  });

  it('min Farey spacing is 1/(n(n-1)), strictly larger than tent width 2/n^3', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      const xs = reducedRationals(n)
        .map(({ p, q }) => p / q)
        .sort((a, b) => a - b);
      let minGap = Infinity;
      for (let i = 1; i < xs.length; i++) minGap = Math.min(minGap, (xs[i] ?? 0) - (xs[i - 1] ?? 0));
      expectCloseTo(minGap, 1 / (n * (n - 1)), 1e-12);
      expect(2 / (n * n * n)).toBeLessThan(minGap);
    }
  });
});

describe('baire-1: pointwise values against Thomae', () => {
  it('f_n(1/2) = 0.5 exactly for n >= 2', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      expect(thomaeApprox(0.5, n)).toBe(0.5);
    }
  });

  it('f_n(1/3) = 1/3 exactly for n >= 3; f_2(1/3) = 0', () => {
    expect(thomaeApprox(1 / 3, 2)).toBe(0);
    for (let n = 3; n <= MAX_N; n++) {
      expect(thomaeApprox(1 / 3, n)).toBe(1 / 3);
    }
  });

  it('f_12(sqrt(2)/2) = 0 and f_12(pi/4) = 0 (both < 0.05)', () => {
    expect(thomaeApprox(Math.SQRT2 / 2, 12)).toBe(0);
    expect(thomaeApprox(Math.PI / 4, 12)).toBe(0);
  });

  it('f_n >= 0 everywhere on the model grid', () => {
    for (const n of [MIN_N, DEFAULT_N, MAX_N]) {
      const data = baireOneData(n);
      expect(data.curve.length).toBe(GRID_POINTS);
      for (const s of data.curve) expect(s.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('peak is 1 (attained at x = 0 and x = 1)', () => {
    for (const n of [MIN_N, DEFAULT_N, MAX_N]) {
      const data = baireOneData(n);
      expect(data.peak).toBe(1);
      expect(data.curve[0]?.y).toBe(1);
      expect(data.curve[data.curve.length - 1]?.y).toBe(1);
    }
  });
});

describe('baire-1: model compute', () => {
  it('reads N from state, clamps to [MIN_N, MAX_N], defaults to DEFAULT_N', () => {
    expect(compute({ N: 7 }).n).toBe(7);
    expect(compute({ N: 99 }).n).toBe(MAX_N);
    expect(compute({ N: -3 }).n).toBe(MIN_N);
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ N: NaN }).n).toBe(DEFAULT_N);
  });

  it('probes carry exact Thomae values and honest approximants', () => {
    const data = compute({ N: 12 });
    expect(data.probes).toHaveLength(3);
    const byLabel = new Map(data.probes.map((p) => [p.label, p]));
    expect(byLabel.get('1/2')?.exact).toBe(0.5);
    expect(byLabel.get('1/2')?.approx).toBe(0.5);
    expect(byLabel.get('√2/2')?.exact).toBe(0);
    expect(byLabel.get('√2/2')?.approx).toBe(0);
    expect(byLabel.get('1/3')?.exact).toBe(1 / 3);
    expect(byLabel.get('1/3')?.approx).toBe(1 / 3);
    expect(data.bumpCount).toBe(47);
  });
});

describe('baire-1: problems export', () => {
  it('has exactly 3 entries with non-empty ko/en statements and valid presets', () => {
    expect(baireOneProblems).toHaveLength(3);
    const ids = new Set<string>();
    for (const p of baireOneProblems) {
      expect(p.id.length).toBeGreaterThan(0);
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      const presetN = Number(p.preset['N']);
      expect(Number.isFinite(presetN)).toBe(true);
      expect(presetN).toBeGreaterThanOrEqual(MIN_N);
      expect(presetN).toBeLessThanOrEqual(MAX_N);
    }
  });
});
