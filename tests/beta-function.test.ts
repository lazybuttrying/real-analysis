import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  beta,
  betaData,
  betaModel,
  integrand,
  SAMPLE_COUNT,
  type BetaData,
} from '../src/chapters/series/models/betaFunction';
import { problems } from '../src/chapters/series/problems/beta-function';

const compute = (state: ControlState): BetaData =>
  betaModel.compute(state) as BetaData;

describe('beta-function: exact values (tol 1e-9)', () => {
  it('gives B(1,1) = 1', () => {
    expect(beta(1, 1)).toBeCloseTo(1, 9);
  });

  it('gives B(2,3) = 1/12', () => {
    expect(Math.abs(beta(2, 3) - 1 / 12)).toBeLessThan(1e-9);
  });

  it('gives B(1,3) = 1/3', () => {
    expect(Math.abs(beta(1, 3) - 1 / 3)).toBeLessThan(1e-9);
  });
});

describe('beta-function: the half-integer value (tol 1e-6)', () => {
  it('gives B(1/2,1/2) = pi', () => {
    expect(Math.abs(beta(0.5, 0.5) - Math.PI)).toBeLessThan(1e-6);
  });
});

describe('beta-function: symmetry (tol 1e-12)', () => {
  it('gives B(3,2) = B(2,3)', () => {
    expect(beta(3, 2)).toBeCloseTo(beta(2, 3), 12);
  });
});

describe('beta-function: recurrence (tol 1e-9)', () => {
  it('satisfies B(2,3) = (1/4) * B(1,3)', () => {
    expect(Math.abs(beta(2, 3) - 0.25 * beta(1, 3))).toBeLessThan(1e-9);
  });
});

describe('beta-function: model compute', () => {
  it('matches 1/12 for {p:2, q:3} within 1e-9', () => {
    expect(Math.abs(compute({ p: 2, q: 3 }).value - 1 / 12)).toBeLessThan(1e-9);
  });

  it('echoes the p and q from state', () => {
    const d = compute({ p: 2.5, q: 1.5 });
    expect(d.p).toBeCloseTo(2.5, 12);
    expect(d.q).toBeCloseTo(1.5, 12);
    expect(d.value).toBeCloseTo(beta(2.5, 1.5), 15);
  });

  it('clamps p and q into [0.2, 5] and defaults to (2, 3)', () => {
    const hi = compute({ p: 99, q: 99 });
    expect(hi.p).toBe(5);
    expect(hi.q).toBe(5);
    const lo = compute({ p: -1, q: 0 });
    expect(lo.p).toBe(0.2);
    expect(lo.q).toBe(0.2);
    const def = compute({});
    expect(def.p).toBe(2);
    expect(def.q).toBe(3);
    const nan = compute({ p: Number.NaN, q: Number.NaN });
    expect(nan.p).toBe(2);
    expect(nan.q).toBe(3);
  });
});

describe('beta-function: integrand samples', () => {
  it('returns 121 samples spanning [0, 1]', () => {
    const d = betaData(2, 3);
    expect(d.samples).toHaveLength(SAMPLE_COUNT);
    expect(d.samples[0]?.t).toBe(0);
    expect(d.samples[SAMPLE_COUNT - 1]?.t).toBe(1);
  });

  it('gives f(0.5) = 0.25 for p = q = 2', () => {
    expect(integrand(2, 2, 0.5)).toBeCloseTo(0.25, 15);
    const d = betaData(2, 2);
    const mid = d.samples[60];
    expect(mid?.t).toBe(0.5);
    expect(mid?.y).toBeCloseTo(0.25, 15);
  });

  it('stays finite at the endpoints for p, q below 1', () => {
    expect(Number.isFinite(integrand(0.2, 0.2, 0))).toBe(true);
    expect(Number.isFinite(integrand(0.2, 0.2, 1))).toBe(true);
    for (const s of betaData(0.2, 0.2).samples) {
      expect(Number.isFinite(s.y)).toBe(true);
    }
  });
});

describe('beta-function: problems data is complete and captions match the model', () => {
  it('has exactly three problems with bilingual text and full proofs', () => {
    expect(problems.length).toBe(3);
    for (const p of problems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.presetCaption.ko.length).toBeGreaterThan(0);
      expect(p.presetCaption.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      expect(p.display?.length).toBeGreaterThan(0);
    }
  });

  it('uses the ids convergence, symmetry, recurrence with unique ids', () => {
    expect(problems.map((p) => p.id)).toEqual(['convergence', 'symmetry', 'recurrence']);
  });

  it('presets use the real control keys and valid values', () => {
    expect(problems[0]?.preset).toEqual({ p: 0.5, q: 2 });
    expect(problems[1]?.preset).toEqual({ p: 2, q: 3 });
    expect(problems[2]?.preset).toEqual({ p: 1, q: 3 });
    for (const p of problems) {
      expect(Object.keys(p.preset).sort()).toEqual(['p', 'q']);
      for (const key of ['p', 'q'] as const) {
        const v = Number(p.preset[key]);
        expect(v).toBeGreaterThanOrEqual(0.2);
        expect(v).toBeLessThanOrEqual(5);
      }
    }
  });
});
