import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  riemannLebesgueData,
  riemannLebesgueModel,
  RL_KIND_INIT,
  RL_KINDS,
  RL_MODE_INIT,
  RL_MODES,
  RL_N_INIT,
  RL_N_MAX,
  RL_N_MIN,
  rlExactA,
  rlExactB,
  type CoeffKind,
  type RiemannLebesgueData,
  type RlMode,
} from '../src/chapters/series/models/riemannLebesgue';
import { riemannLebesgueProblems } from '../src/chapters/series/problems/riemann-lebesgue';

const compute = (state: ControlState): RiemannLebesgueData => syncCompute(riemannLebesgueModel, state);

describe('riemann-lebesgue: step mode quadrature matches the closed form', () => {
  it('numeric b_n matches (1 - (-1)^n)/(n pi) within quadrature tolerance', () => {
    const data = riemannLebesgueData('step', RL_N_MAX, 'b');
    for (const c of data.coeffs) {
      expectCloseTo(c.b, rlExactB('step', c.n), 1e-3);
    }
  });

  it('a_n = 0 for every n >= 1 (up to quadrature error)', () => {
    const data = riemannLebesgueData('step', RL_N_MAX, 'a');
    for (const c of data.coeffs) {
      expectCloseTo(c.a, 0, 1e-3);
    }
  });

  it('odd n gives 2/(n pi), even n gives 0', () => {
    expectCloseTo(rlExactB('step', 1), 2 / Math.PI, 1e-15);
    expectCloseTo(rlExactB('step', 11), 2 / (11 * Math.PI), 1e-15);
    expect(rlExactB('step', 2)).toBe(0);
    expect(rlExactB('step', 40)).toBe(0);
  });

  it('|b_n| decays: the tail is small', () => {
    const data = riemannLebesgueData('step', RL_N_MAX, 'b');
    const tail = data.shown.slice(19);
    expect(Math.max(...tail)).toBeLessThan(0.04);
    expect(data.shown[RL_N_MAX - 1]).toBeLessThan(0.01);
  });
});

describe('riemann-lebesgue: tent mode', () => {
  it('numeric a_n matches -4/(pi^2 n^2) for odd n, 0 for even n', () => {
    const data = riemannLebesgueData('tent', RL_N_MAX, 'a');
    for (const c of data.coeffs) {
      expectCloseTo(c.a, rlExactA('tent', c.n), 1e-3);
    }
  });

  it('the closed form has the right sign and values', () => {
    expectCloseTo(rlExactA('tent', 1), -4 / (Math.PI * Math.PI), 1e-15);
    expect(rlExactA('tent', 2)).toBe(0);
    expectCloseTo(rlExactA('tent', 3), -4 / (9 * Math.PI * Math.PI), 1e-15);
  });

  it('b_n = 0 by symmetry about x = pi', () => {
    const data = riemannLebesgueData('tent', RL_N_MAX, 'b');
    for (const c of data.coeffs) {
      expectCloseTo(c.b, 0, 1e-9);
    }
  });

  it('decay is 1/n^2: the tail is far smaller than the step mode tail', () => {
    const tent = riemannLebesgueData('tent', RL_N_MAX, 'a');
    const step = riemannLebesgueData('step', RL_N_MAX, 'b');
    const tentTail = Math.max(...tent.shown.slice(10));
    const stepTail = Math.max(...step.shown.slice(10));
    expect(tentTail).toBeLessThan(stepTail / 5);
  });
});

describe('riemann-lebesgue: smooth mode', () => {
  it('only a_2 = -1/2 survives; everything else is ~0', () => {
    const data = riemannLebesgueData('smooth', RL_N_MAX, 'a');
    for (const c of data.coeffs) {
      expectCloseTo(c.a, rlExactA('smooth', c.n), 1e-9);
      expectCloseTo(c.b, 0, 1e-9);
    }
    expectCloseTo(data.coeffs[1]!.a, -0.5, 1e-9);
  });
});

describe('riemann-lebesgue: the probe integrand cancels', () => {
  it('signed integral ~ 0 while the lobes are large', () => {
    const data = riemannLebesgueData('step', 40, 'b');
    expectCloseTo(data.probeIntegral, 0, 1e-3);
    expect(data.positiveArea).toBeGreaterThan(0.5);
    expect(data.negativeArea).toBeLessThan(-0.5);
    expectCloseTo(data.positiveArea + data.negativeArea, data.probeIntegral, 1e-12);
  });

  it('probeN tracks N and the probe grid is dense', () => {
    const data = compute({ mode: 'smooth', n: 17, kind: 'a' });
    expect(data.probeN).toBe(17);
    expect(data.probeXs).toHaveLength(data.probeYs.length);
    expect(data.probeXs.length).toBeGreaterThan(48 * 17);
  });
});

describe('riemann-lebesgue: model compute', () => {
  it('reads mode, n, kind from the control state, clamps, defaults to init', () => {
    expect(compute({}).mode).toBe(RL_MODE_INIT);
    expect(compute({}).nMax).toBe(RL_N_INIT);
    expect(compute({}).kind).toBe(RL_KIND_INIT);
    expect(compute({ mode: 'nope' }).mode).toBe(RL_MODE_INIT);
    expect(compute({ mode: 'tent' }).mode).toBe('tent');
    expect(compute({ kind: 'nope' }).kind).toBe(RL_KIND_INIT);
    expect(compute({ kind: 'a' }).kind).toBe('a');
    expect(compute({ n: 100 }).nMax).toBe(RL_N_MAX);
    expect(compute({ n: -3 }).nMax).toBe(RL_N_MIN);
    expect(compute({ n: 2.4 }).nMax).toBe(2);
  });

  it('coeffs has one entry per n = 1..nMax', () => {
    const data = compute({ mode: 'step', n: 7, kind: 'b' });
    expect(data.coeffs).toHaveLength(7);
    expect(data.coeffs.map((c) => c.n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(data.shown).toHaveLength(7);
  });

  it('exports the expected data keys', () => {
    const data = compute({ mode: 'step', n: 6, kind: 'b' });
    for (const key of [
      'mode', 'kind', 'nMax', 'probeN', 'coeffs', 'shown', 'maxShown',
      'probeXs', 'probeYs', 'probeIntegral', 'positiveArea', 'negativeArea',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('riemann-lebesgue: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(riemannLebesgueProblems);
  });

  it('the three ids are rl-step-direct, rl-step-general, rl-density', () => {
    expect(riemannLebesgueProblems.map((p) => p.id)).toEqual([
      'rl-step-direct',
      'rl-step-general',
      'rl-density',
    ]);
  });

  it('presets use valid mode and kind options', () => {
    for (const p of riemannLebesgueProblems) {
      expect(RL_MODES as readonly string[]).toContain(String(p.preset['mode']));
      expect(RL_KINDS as readonly string[]).toContain(String(p.preset['kind']));
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(RL_N_MIN);
      expect(n).toBeLessThanOrEqual(RL_N_MAX);
    }
  });

  it('the exact helpers are consistent with the option lists', () => {
    for (const mode of RL_MODES as readonly RlMode[]) {
      for (let n = 1; n <= 5; n++) {
        expect(Number.isFinite(rlExactA(mode, n))).toBe(true);
        expect(Number.isFinite(rlExactB(mode, n))).toBe(true);
      }
    }
    for (const kind of RL_KINDS as readonly CoeffKind[]) {
      expect(typeof kind).toBe('string');
    }
  });
});
