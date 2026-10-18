import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_N,
  GIBBS_PEAK_THEORY,
  MAX_N,
  MIN_N,
  OVERSHOOT_FRACTION,
  SI_PI,
  fourierPartialSum,
  gibbsData,
  gibbsModel,
  si,
  type GibbsData,
} from '../src/chapters/calculus/models/gibbsPhenomenon';
import { GIBBS_PEAK } from '../src/chapters/calculus/models/fourier';
import { gibbsPhenomenonProblems } from '../src/chapters/calculus/problems/gibbs-phenomenon';

const compute = (state: ControlState): GibbsData => syncCompute(gibbsModel, state);

describe('gibbs-phenomenon: the sine integral', () => {
  it('si(pi) = 1.85193705182 (1e-9)', () => {
    expectCloseTo(si(Math.PI), SI_PI, 1e-9);
    expectCloseTo(si(Math.PI), 1.85193705182, 1e-9);
  });

  it('si(0) = 0 and si is strictly increasing on (0, pi)', () => {
    expect(si(0)).toBe(0);
    expect(si(-1)).toBe(0);
    expect(si(Math.PI / 4)).toBeLessThan(si(Math.PI / 2));
    expect(si(Math.PI / 2)).toBeLessThan(si(Math.PI));
  });

  it('si(pi) is the global maximum on the rescaled axis [0, 4pi]', () => {
    const atPi = si(Math.PI);
    for (let i = 0; i <= 200; i++) {
      const t = ((4 * Math.PI) * i) / 200;
      expect(si(t)).toBeLessThanOrEqual(atPi + 1e-12);
    }
  });
});

describe('gibbs-phenomenon: the constant, derived', () => {
  it('(2/pi)*si(pi) equals fourier.ts GIBBS_PEAK (1e-9)', () => {
    expectCloseTo((2 / Math.PI) * si(Math.PI), GIBBS_PEAK, 1e-9);
  });

  it('GIBBS_PEAK_THEORY equals the fourier scene constant (1e-9)', () => {
    expectCloseTo(GIBBS_PEAK_THEORY, GIBBS_PEAK, 1e-9);
    expectCloseTo(GIBBS_PEAK_THEORY, 1.17897974447, 1e-9);
  });

  it('overshoot fraction = 0.08948987 (1e-8), i.e. 8.949% of the jump', () => {
    expectCloseTo(OVERSHOOT_FRACTION, 0.08948987, 1e-8);
    expectCloseTo(OVERSHOOT_FRACTION, (GIBBS_PEAK_THEORY - 1) / 2, 1e-15);
  });
});

describe('gibbs-phenomenon: the derivative identity', () => {
  it("numeric derivative of S_N matches (2/pi)*sin(2Nx)/sin(x) at x=0.1, N=8 (1e-6)", () => {
    const x = 0.1;
    const n = 8;
    const h = 3e-6;
    const numeric = (fourierPartialSum(x + h, n) - fourierPartialSum(x - h, n)) / (2 * h);
    const closed = ((2 / Math.PI) * Math.sin(2 * n * x)) / Math.sin(x);
    expectCloseTo(numeric, closed, 1e-6);
  });

  it('the first critical point x_1 = pi/(2N) is where the peak is measured', () => {
    for (const n of [12, 50]) {
      const data = gibbsData(n);
      // The measured peak sits at the rescaled peak position t = pi.
      expectCloseTo(data.measuredPeakT, Math.PI, 0.01);
    }
  });
});

describe('gibbs-phenomenon: measured peak converges to the theoretical peak', () => {
  it('measured peak at N=50 within 0.005 of theory', () => {
    const data = compute({ N: 50 });
    expect(data.n).toBe(50);
    expectCloseTo(data.measuredPeak, GIBBS_PEAK_THEORY, 0.005);
  });

  it('N=12: measured peak 1.1795589 (1e-3), error under 0.0006 vs theory', () => {
    const data = compute({ N: 12 });
    expectCloseTo(data.measuredPeak, 1.1795589, 1e-3);
    expect(Math.abs(data.measuredPeak - GIBBS_PEAK_THEORY)).toBeLessThan(0.0006);
  });

  it('the rescaled curve collapses onto the Si limit as N grows', () => {
    const supErr = (n: number): number => {
      const data = gibbsData(n);
      let worst = 0;
      for (const p of data.points) {
        worst = Math.max(worst, Math.abs(p.sN - p.siLimit));
      }
      return worst;
    };
    expect(supErr(60)).toBeLessThan(supErr(2));
    expect(supErr(60)).toBeLessThan(0.02);
  });
});

describe('gibbs-phenomenon: control clamping', () => {
  it('defaults and clamps match the documented control ranges', () => {
    expect(DEFAULT_N).toBe(12);
    expect(MIN_N).toBe(2);
    expect(MAX_N).toBe(60);
  });

  it('out-of-range N clamps to [2, 60]', () => {
    expect(compute({ N: 1 }).n).toBe(2);
    expect(compute({ N: 1000 }).n).toBe(60);
  });

  it('missing controls fall back to defaults', () => {
    expect(compute({}).n).toBe(12);
  });

  it('gibbsData agrees with the model on the raw computation', () => {
    const viaModel = compute({ N: 12 });
    const direct = gibbsData(12);
    expect(direct.measuredPeak).toBe(viaModel.measuredPeak);
    expect(direct.points).toHaveLength(viaModel.points.length);
  });
});

describe('gibbs-phenomenon: problems data', () => {
  it('has exactly 3 problems with the required shape', () => {
    expect(gibbsPhenomenonProblems).toHaveLength(3);
    const ids = gibbsPhenomenonProblems.map((p) => p.id);
    expect(ids).toEqual(['derivative-identity', 'si-limit', 'overshoot-never-dies']);
    for (const p of gibbsPhenomenonProblems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('every preset is valid for the scene controls and matches the quoted numbers', () => {
    for (const p of gibbsPhenomenonProblems) {
      const data = compute(p.preset);
      expect(data.n).toBe(12);
    }
    const data = compute({ N: 12 });
    expectCloseTo(data.measuredPeak, 1.1795589, 1e-3);
    expectCloseTo(data.measuredPeak, GIBBS_PEAK_THEORY, 0.0006);
  });

  it('proofs keep Korean inside ko strings only, and use \\(...\\) math', () => {
    const hangul = (s: string): boolean => /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(s);
    for (const p of gibbsPhenomenonProblems) {
      expect(hangul(p.statement.en)).toBe(false);
      expect(hangul(p.presetCaption.en)).toBe(false);
      for (const step of p.proof) {
        expect(hangul(step.text.en)).toBe(false);
        for (const d of step.display ?? []) {
          expect(hangul(d)).toBe(false);
          expect(d).not.toContain('$');
        }
      }
      for (const d of p.display ?? []) expect(d).not.toContain('$');
    }
  });
});
