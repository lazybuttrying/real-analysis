import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  cesaroMean,
  DEFAULT_N,
  fejerData,
  fejerKernel,
  fejerModel,
  fourierPartialSum,
  MAX_N,
  MIN_N,
  triCoeff,
  triWave,
  type FejerData,
} from '../src/chapters/calculus/models/fejerTheorem';
import { fejerTheoremProblems } from '../src/chapters/calculus/problems/fejer-theorem';

const compute = (state: ControlState): FejerData => syncCompute(fejerModel, state);

/** Composite Simpson on [a, b] with nn (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, nn: number): number {
  const h = (b - a) / nn;
  let s = f(a) + f(b);
  for (let i = 1; i < nn; i++) s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return (s * h) / 3;
}

describe('fejer-theorem: triangle-wave Fourier coefficients', () => {
  it('triCoeff(k) = (1/pi) int f(t) cos(kt) dt, to 1e-9, for k = 1..10', () => {
    for (let k = 1; k <= 10; k++) {
      const numeric = simpson((t) => triWave(t) * Math.cos(k * t), -Math.PI, Math.PI, 4000) / Math.PI;
      expectCloseTo(triCoeff(k), numeric, 1e-9);
    }
  });

  it('triCoeff(k) = 0 for even k, 4/(pi^2 k^2) for odd k', () => {
    for (let k = 1; k <= 40; k++) {
      if (k % 2 === 0) {
        expect(triCoeff(k)).toBe(0);
      } else {
        expectCloseTo(triCoeff(k), 4 / (Math.PI * Math.PI * k * k), 1e-15);
      }
    }
  });

  it('the analytic value at k=1 is 4/pi^2 = 0.405284734569351...', () => {
    expectCloseTo(triCoeff(1), 4 / (Math.PI * Math.PI), 1e-15);
    expect(triCoeff(1)).toBeGreaterThan(0.405);
    expect(triCoeff(1)).toBeLessThan(0.406);
  });
});

describe('fejer-theorem: the Fejer kernel', () => {
  it('K_N(t) >= 0 on a fine grid, including t = 0', () => {
    for (const n of [1, 8, 40]) {
      expect(fejerKernel(n, 0)).toBe(n);
      for (let i = 0; i <= 1000; i++) {
        const t = -Math.PI + ((2 * Math.PI) * i) / 1000;
        expect(fejerKernel(n, t)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('int_{-pi}^{pi} K_N = 2pi to 1e-6 (mass 1)', () => {
    for (const n of [1, 8, 40]) {
      const integral = simpson((t) => fejerKernel(n, t), -Math.PI, Math.PI, 2000);
      expectCloseTo(integral, 2 * Math.PI, 1e-6);
    }
  });

  it('K_N(0) = N: the spike grows with N while the mass stays 1', () => {
    expect(fejerKernel(1, 0)).toBe(1);
    expect(fejerKernel(8, 0)).toBe(8);
    expect(fejerKernel(40, 0)).toBe(40);
  });
});

describe('fejer-theorem: the model at N = 8 (the documented numbers)', () => {
  const data = compute({ N: 8 });

  it('samples f, S_N, sigma_N, and the kernel on a 1441-point grid over [-pi, pi]', () => {
    for (const key of ['f', 'sN', 'sigmaN', 'kernel'] as const) {
      expect(data[key]).toHaveLength(1441);
      expect(data[key][0]?.x).toBeCloseTo(-Math.PI, 14);
      expect(data[key][1440]?.x).toBeCloseTo(Math.PI, 14);
    }
    expect(data.n).toBe(8);
  });

  it('f samples are the triangle wave, kernel samples match fejerKernel', () => {
    for (let i = 0; i <= 1440; i += 37) {
      const pt = data.f[i];
      expectCloseTo(pt?.y ?? NaN, 1 - Math.abs(pt?.x ?? NaN) / Math.PI, 1e-14);
      expectCloseTo(data.kernel[i]?.y ?? NaN, fejerKernel(8, data.kernel[i]?.x ?? NaN), 1e-14);
    }
  });

  it('S_N and sigma_N samples match the exported pointwise functions', () => {
    for (let i = 0; i <= 1440; i += 53) {
      const x = data.sN[i]?.x ?? NaN;
      expectCloseTo(data.sN[i]?.y ?? NaN, fourierPartialSum(x, 8), 1e-14);
      expectCloseTo(data.sigmaN[i]?.y ?? NaN, cesaroMean(x, 8), 1e-14);
    }
  });

  it('the damped-coefficient sigma_N equals the literal Cesaro average (S_0+...+S_7)/8', () => {
    // The definition from the spec: sigma_N = (S_0 + ... + S_{N-1}) / N.
    for (let i = 0; i <= 1440; i += 61) {
      const x = data.sigmaN[i]?.x ?? NaN;
      let avg = 0;
      for (let j = 0; j < 8; j++) avg += fourierPartialSum(x, j);
      avg /= 8;
      expectCloseTo(data.sigmaN[i]?.y ?? NaN, avg, 1e-12);
    }
  });

  it('sup|S_8 - f| = 0.0252011218 and sup|sigma_8 - f| = 0.1101179234', () => {
    // Honest direction (verified numerically): on this smooth f the raw
    // partial sums WIN the sup-norm race — Fejer's virtue here is smoothness,
    // not a smaller sup error. The spec's "sigma below 0.01" claim is false
    // for the triangle wave; these are the real numbers.
    expectCloseTo(data.supErrS, 0.0252011218, 1e-9);
    expectCloseTo(data.supErrSigma, 0.1101179234, 1e-9);
    expect(data.supErrS).toBeLessThan(data.supErrSigma);
  });
});

describe('fejer-theorem: sigma_N sup error decreases with N', () => {
  it('sup|sigma_N - f| decreases 8 -> 16 -> 32 (uniform convergence in action)', () => {
    const e8 = compute({ N: 8 }).supErrSigma;
    const e16 = compute({ N: 16 }).supErrSigma;
    const e32 = compute({ N: 32 }).supErrSigma;
    expectCloseTo(e8, 0.1101179234, 1e-9);
    expectCloseTo(e16, 0.0638615489, 1e-9);
    expectCloseTo(e32, 0.0363232411, 1e-9);
    expect(e16).toBeLessThan(e8);
    expect(e32).toBeLessThan(e16);
  });

  it('sup|S_N - f| also shrinks with N (the triangle wave is smooth)', () => {
    const s8 = compute({ N: 8 }).supErrS;
    const s40 = compute({ N: 40 }).supErrS;
    expect(s40).toBeLessThan(s8);
    expect(s40).toBeLessThan(0.006);
  });
});

describe('fejer-theorem: control clamping', () => {
  it('defaults and clamps match the documented control ranges', () => {
    expect(MIN_N).toBe(1);
    expect(MAX_N).toBe(40);
    expect(DEFAULT_N).toBe(8);
  });

  it('out-of-range N clamps to [1, 40]', () => {
    expect(compute({ N: 0 }).n).toBe(1);
    expect(compute({ N: 100 }).n).toBe(40);
    expect(compute({ N: 8.7 }).n).toBe(8);
  });

  it('missing N falls back to the default 8', () => {
    expect(compute({}).n).toBe(8);
  });

  it('fejerData agrees with the model on the raw computation', () => {
    const viaModel = compute({ N: 8 });
    const direct = fejerData(8);
    expect(direct.n).toBe(viaModel.n);
    expectCloseTo(direct.supErrS, viaModel.supErrS, 1e-15);
    expectCloseTo(direct.supErrSigma, viaModel.supErrSigma, 1e-15);
  });
});

describe('fejer-theorem: problems data', () => {
  it('has exactly 3 problems with the required shape', () => {
    expect(fejerTheoremProblems).toHaveLength(3);
    const ids = fejerTheoremProblems.map((p) => p.id);
    expect(ids).toEqual(['fejer-kernel', 'approximate-identity', 'cesaro-wins']);
    for (const p of fejerTheoremProblems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('every preset is valid for the scene controls', () => {
    for (const p of fejerTheoremProblems) {
      const data = compute(p.preset);
      expect(data.n).toBe(8);
    }
  });

  it('proofs keep Korean inside ko strings only, and use \\(...\\) math', () => {
    const hangul = (s: string): boolean => /[가-힣]/.test(s);
    for (const p of fejerTheoremProblems) {
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
