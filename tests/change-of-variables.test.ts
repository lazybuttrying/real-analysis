import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  changeOfVariablesData,
  changeOfVariablesModel,
  DEFAULT_N,
  DEFAULT_SUB,
  N_MAX,
  N_MIN,
  originalIntegrand,
  phi,
  phiTicks,
  simpson,
  xMax,
  type ChangeOfVariablesData,
} from '../src/chapters/calculus/models/changeOfVariables';
import { changeOfVariablesProblems } from '../src/chapters/calculus/problems/change-of-variables';

const compute = (state: ControlState): ChangeOfVariablesData =>
  syncCompute(changeOfVariablesModel, state);

describe('change-of-variables: the substitution maps', () => {
  it('phi is x^2 or sin x, mapping the x-domain onto [0, 1]', () => {
    expectCloseTo(phi('u=x^2', 0.5), 0.25, 1e-15);
    expectCloseTo(phi('u=x^2', 1), 1, 1e-15);
    expectCloseTo(phi('u=sin x', Math.PI / 2), 1, 1e-15);
    expectCloseTo(phi('u=sin x', 0), 0, 1e-15);
  });

  it('xMax is 1 for x^2 and pi/2 for sin x', () => {
    expect(xMax('u=x^2')).toBe(1);
    expectCloseTo(xMax('u=sin x'), Math.PI / 2, 1e-15);
  });

  it('phiTicks are monotone in u and span [0, 1]', () => {
    for (const sub of ['u=x^2', 'u=sin x']) {
      const ticks = phiTicks(sub);
      expect(ticks).toHaveLength(9);
      ticks.forEach((t, i) => {
        expect(t.u).toBeGreaterThanOrEqual(0);
        expect(t.u).toBeLessThanOrEqual(1);
        if (i > 0) expect(t.u).toBeGreaterThan((ticks[i - 1] as { u: number }).u);
      });
      expect(ticks[0]?.u).toBe(0);
      expectCloseTo(ticks[8]?.u ?? 0, 1, 1e-12);
    }
  });

  it('x^2 stretches the right end: mapped ticks cluster toward 1', () => {
    const ticks = phiTicks('u=x^2');
    // Last interval in u is wider than the first: the map stretches x.
    const first = (ticks[1]?.u ?? 0) - (ticks[0]?.u ?? 0);
    const last = (ticks[8]?.u ?? 0) - (ticks[7]?.u ?? 0);
    expect(last).toBeGreaterThan(first);
  });
});

describe('change-of-variables: both forms target e - 1', () => {
  it('u=x^2, N = 50: original and substituted agree within 1e-6', () => {
    const data = changeOfVariablesData('u=x^2', 50);
    expectCloseTo(data.original, 1.7182820012734081, 1e-9);
    expectCloseTo(data.substituted, 1.7182818299863347, 1e-9);
    expectCloseTo(data.closed, Math.E - 1, 1e-15);
    expect(data.diff).toBeLessThan(1e-6);
    expect(Math.abs(data.original - data.closed)).toBeLessThan(1e-6);
    expect(Math.abs(data.substituted - data.closed)).toBeLessThan(1e-6);
  });

  it('u=sin x, N = 50: original and substituted agree within 1e-6', () => {
    const data = changeOfVariablesData('u=sin x', 50);
    expectCloseTo(data.original, 1.7182819035868118, 1e-9);
    expectCloseTo(data.substituted, 1.7182818299863347, 1e-9);
    expect(data.diff).toBeLessThan(1e-6);
    expect(Math.abs(data.original - data.closed)).toBeLessThan(1e-6);
  });

  it('refining N shrinks the error (convergence, not luck)', () => {
    const coarse = changeOfVariablesData('u=x^2', 12);
    const fine = changeOfVariablesData('u=x^2', 200);
    expect(Math.abs(fine.original - (Math.E - 1))).toBeLessThan(
      Math.abs(coarse.original - (Math.E - 1)),
    );
    expect(Math.abs(fine.original - (Math.E - 1))).toBeLessThan(1e-9);
  });

  it('odd N is rounded up to even for Simpson', () => {
    expect(changeOfVariablesData('u=x^2', 51).N).toBe(52);
    expect(changeOfVariablesData('u=x^2', 50).N).toBe(50);
  });

  it('originalIntegrand is f(phi) phi prime: 2x e^{x^2} and cos x e^{sin x}', () => {
    expectCloseTo(originalIntegrand('u=x^2', 0.5), 2 * 0.5 * Math.exp(0.25), 1e-15);
    expectCloseTo(
      originalIntegrand('u=sin x', 0.5),
      Math.cos(0.5) * Math.exp(Math.sin(0.5)),
      1e-15,
    );
  });

  it('Simpson is exact on the substituted side already at N = 4', () => {
    // int_0^1 e^u du is smooth; even coarse Simpson is close.
    expect(Math.abs(simpson((u) => Math.exp(u), 0, 1, 4) - (Math.E - 1))).toBeLessThan(1e-4);
  });
});

describe('change-of-variables: model compute', () => {
  it('reads sub and N from the control state, clamps N', () => {
    const data = compute({ sub: 'u=sin x', N: 100 });
    expect(data.sub).toBe('u=sin x');
    expect(data.N).toBe(100);
    expect(compute({ sub: 'u=x^2', N: 10000 }).N).toBe(N_MAX);
    expect(compute({ sub: 'u=x^2', N: 0 }).N).toBe(N_MIN);
    expect(compute({}).sub).toBe(DEFAULT_SUB);
    expect(compute({}).N).toBe(DEFAULT_N);
    expect(compute({ sub: 'bogus', N: 50 }).sub).toBe(DEFAULT_SUB);
  });

  it('exports the expected data keys', () => {
    const data = compute({ sub: 'u=x^2', N: 50 });
    for (const key of [
      'sub',
      'N',
      'original',
      'substituted',
      'closed',
      'diff',
      'origCurve',
      'substCurve',
      'phiCurve',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });

  it('phiCurve samples the substitution map over the x-domain', () => {
    const data = compute({ sub: 'u=x^2', N: 50 });
    expect(data.phiCurve[0]?.x).toBe(0);
    expect(data.phiCurve[data.phiCurve.length - 1]?.x).toBe(1);
    for (const p of data.phiCurve) {
      expectCloseTo(p.y, phi('u=x^2', p.x), 1e-15);
    }
  });
});

describe('change-of-variables: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(changeOfVariablesProblems);
  });

  it('the three ids are cov-proof, cov-example, cov-orientation with valid presets', () => {
    expect(changeOfVariablesProblems.map((p) => p.id)).toEqual([
      'cov-proof',
      'cov-example',
      'cov-orientation',
    ]);
    for (const p of changeOfVariablesProblems) {
      expect(['u=x^2', 'u=sin x']).toContain(p.preset['sub']);
      const n = Number(p.preset['N']);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
    }
  });
});
