import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  AMP_MAX,
  AMP_MIN,
  DEFAULT_AMP,
  DEFAULT_PROBE,
  GRID_PTS,
  N_PTS,
  PROBE_MAX,
  PROBE_MIN,
  X_MAX,
  X_MIN,
  bohrMollerupData,
  bohrMollerupModel,
  impostor,
  logImpostor,
  wobble,
  type BohrMollerupData,
} from '../src/chapters/series/models/bohrMollerup';
import { bohrMollerupProblems } from '../src/chapters/series/problems/bohr-mollerup';

const compute = (state: ControlState): BohrMollerupData => syncCompute(bohrMollerupModel, state);

const AMPS = [0, 0.15, 0.3, 0.5];

describe('bohr-mollerup: the impostor f_a(1) = 1', () => {
  it('f_a(1) = Gamma(1)(1 + a sin 2pi) = 1 within 1e-9', () => {
    for (const a of AMPS) {
      expectCloseTo(impostor(a, 1), 1, 1e-9);
    }
  });
});

describe('bohr-mollerup: the recurrence f_a(x+1) = x f_a(x)', () => {
  it('holds with relative error below 1e-12 on a grid over (0, 2]', () => {
    for (let i = 0; i < 200; i++) {
      const x = 0.05 + (i / 199) * 1.95;
      for (const a of [0.3, 0.5]) {
        const f = impostor(a, x);
        expect(f).toBeGreaterThan(0);
        expectCloseTo(impostor(a, x + 1), x * f, 1e-12 * x * f);
      }
    }
  });

  it('the wobble is 1-periodic up to floating-point noise', () => {
    for (let i = 0; i <= 40; i++) {
      const x = 0.05 + (i / 40) * 2.95;
      expectCloseTo(wobble(0.3, x + 1), wobble(0.3, x), 1e-13);
    }
  });
});

describe('bohr-mollerup: the impostor stays positive for |a| < 1', () => {
  it('f_a(x) > 0 on [0.05, 3] for a in {0, 0.3, 0.5}', () => {
    let minF = Infinity;
    for (let i = 0; i < 240; i++) {
      const x = 0.05 + (i / 239) * 2.95;
      for (const a of AMPS) {
        minF = Math.min(minF, impostor(a, x));
      }
    }
    expect(minF).toBeGreaterThan(0);
    // sanity: the minimum is well above 0 (measured ~0.46)
    expect(minF).toBeGreaterThan(0.4);
  });

  it('the wobble factor stays above 1 - |a| > 0', () => {
    for (let i = 0; i <= 100; i++) {
      const x = 0.05 + (i / 100) * 2.95;
      for (const a of [0.3, 0.5]) {
        expect(wobble(a, x)).toBeGreaterThanOrEqual(1 - a - 1e-15);
      }
    }
  });
});

describe('bohr-mollerup: the secant test detects the broken log-convexity', () => {
  it('violationF(0.3, 0.6) ~ 0.297, well above 0', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    expect(data.violationF).toBeGreaterThan(0.25);
    expect(data.violationF).toBeCloseTo(0.297, 3);
    expect(data.violationF).toBeCloseTo(0.29696, 4);
  });

  it('violationG is 0 up to 1e-9 noise: Gamma passes the secant test', () => {
    for (const probe of [0.2, 0.6, 1.0, 1.8]) {
      const data = compute({ amp: 0.3, probe });
      expect(data.violationG).toBeLessThan(1e-9);
    }
  });

  it('with amp = 0 the impostor IS Gamma: violationF equals violationG ~ 0', () => {
    const data = compute({ amp: 0, probe: 0.6 });
    expect(data.violationF).toBeLessThan(1e-9);
    for (let i = 0; i < N_PTS; i++) {
      expect(data.logF[i]).toBeCloseTo(data.logG[i] ?? 0, 14);
    }
  });

  it('the below-arrays mark exactly where the chord dips under the graph', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    expect(data.belowXs.length).toBeGreaterThan(0);
    expect(data.belowXs).toHaveLength(data.belowChord.length);
    expect(data.belowXs).toHaveLength(data.belowGraph.length);
    for (let i = 0; i < data.belowXs.length; i++) {
      expect(data.belowGraph[i] as number).toBeGreaterThan(data.belowChord[i] as number);
      const t = data.belowXs[i] as number;
      expect(t).toBeGreaterThanOrEqual(0.6);
      expect(t).toBeLessThanOrEqual(1.6);
    }
  });
});

describe('bohr-mollerup: secant-test geometry is consistent', () => {
  it('chord endpoints agree with the exact log values at x0 and x0 + 1', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    expect(data.chordF[0]).toBeCloseTo(logImpostor(0.3, 0.6), 12);
    expect(data.chordF[GRID_PTS - 1]).toBeCloseTo(logImpostor(0.3, 1.6), 12);
    // The reference curve is convex: the chord of log Gamma over [0.6, 1.6]
    // lies above the graph, so the violation is 0 (measured ~4e-17).
    expect(data.violationG).toBeLessThan(1e-9);
  });

  it('the fine grid spans exactly [probe, probe + 1]', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    expect(data.chordXs).toHaveLength(GRID_PTS);
    expect(data.chordXs[0]).toBe(0.6);
    expect(data.chordXs[GRID_PTS - 1]).toBe(1.6);
    expect(data.probeLeft).toBe(0.6);
    expect(data.probeRight).toBe(1.6);
  });

  it('the coarse plot grid is 240 points on [0.05, 3]', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    expect(data.xs).toHaveLength(N_PTS);
    expect(data.logG).toHaveLength(N_PTS);
    expect(data.logF).toHaveLength(N_PTS);
    expect(data.xs[0]).toBe(X_MIN);
    expect(data.xs[N_PTS - 1]).toBe(X_MAX);
  });

  it('logF = logG + ln(wobble) pointwise on the coarse grid', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    for (let i = 0; i < N_PTS; i += 7) {
      const x = data.xs[i] as number;
      expect(data.logF[i]).toBeCloseTo((data.logG[i] as number) + Math.log(wobble(0.3, x)), 12);
    }
  });
});

describe('bohr-mollerup: compute clamps and defaults', () => {
  it('clamps amp into [0, 0.5] and probe into [0.2, 1.8]', () => {
    expect(compute({ amp: -1, probe: 0.6 }).amp).toBe(AMP_MIN);
    expect(compute({ amp: 0.9, probe: 0.6 }).amp).toBe(AMP_MAX);
    expect(compute({ amp: 0.3, probe: 0 }).probe).toBe(PROBE_MIN);
    expect(compute({ amp: 0.3, probe: 5 }).probe).toBe(PROBE_MAX);
  });

  it('defaults to amp = 0.3, probe = 0.6 on missing/invalid input', () => {
    const data = compute({});
    expect(data.amp).toBe(DEFAULT_AMP);
    expect(data.probe).toBe(DEFAULT_PROBE);
    expect(compute({ amp: NaN, probe: NaN }).amp).toBe(DEFAULT_AMP);
  });

  it('bohrMollerupData agrees with compute for explicit arguments', () => {
    const viaModel = compute({ amp: 0.15, probe: 1.2 });
    const direct = bohrMollerupData(0.15, 1.2);
    expect(viaModel.violationF).toBe(direct.violationF);
    expect(viaModel.violationG).toBe(direct.violationG);
  });
});

describe('bohr-mollerup: problem presets use only the scene control keys', () => {
  it('has 3 problems with ids, bilingual text, and >= 3 proof steps', () => {
    expect(bohrMollerupProblems).toHaveLength(3);
    expect(bohrMollerupProblems.map((p) => p.id)).toEqual([
      'factorial',
      'gamma-log-convex',
      'squeeze',
    ]);
    for (const problem of bohrMollerupProblems) {
      expect(problem.statement.ko.length).toBeGreaterThan(0);
      expect(problem.statement.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of problem.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      expect(problem.presetCaption.ko.length).toBeGreaterThan(0);
      expect(problem.presetCaption.en.length).toBeGreaterThan(0);
    }
  });

  it("presets use only keys 'amp' and 'probe' with values in the valid ranges", () => {
    for (const problem of bohrMollerupProblems) {
      const keys = Object.keys(problem.preset);
      expect(keys.every((k) => k === 'amp' || k === 'probe')).toBe(true);
      const amp = Number(problem.preset['amp']);
      const probe = Number(problem.preset['probe']);
      expect(amp).toBeGreaterThanOrEqual(AMP_MIN);
      expect(amp).toBeLessThanOrEqual(AMP_MAX);
      expect(probe).toBeGreaterThanOrEqual(PROBE_MIN);
      expect(probe).toBeLessThanOrEqual(PROBE_MAX);
    }
  });
});

describe('bohr-mollerup: problem caption numbers check out', () => {
  it('preset { amp: 0.3, probe: 0.6 } gives violation ~0.297 for f and ~0 for Gamma', () => {
    const data = compute({ amp: 0.3, probe: 0.6 });
    expect(data.violationF).toBeCloseTo(0.297, 3);
    expect(data.violationG).toBeLessThan(1e-9);
  });

  it('every problem uses the same verified preset', () => {
    for (const problem of bohrMollerupProblems) {
      expect(problem.preset['amp']).toBe(0.3);
      expect(problem.preset['probe']).toBe(0.6);
    }
  });
});
