import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  convolutionModel,
  CONVOLUTION_EPS_INIT,
  CONVOLUTION_EPS_MAX,
  CONVOLUTION_EPS_MIN,
  CONVOLUTION_GRID_STEP,
  CONVOLUTION_MODE_INIT,
  CONVOLUTION_MODES,
  CONVOLUTION_X_INIT,
  CONVOLUTION_X_MAX,
  CONVOLUTION_X_MIN,
  indicator01,
  overlapInterval,
  overlapLength,
  phiEps,
  smoothConvolutionClosed,
  smoothConvolutionNumeric,
  stepFunction,
  tentConvolution,
  tentCdf,
  tentKernel,
  tentKernelIntegralNumeric,
  type ConvolutionData,
} from '../src/chapters/calculus/models/convolution';
import { convolutionProblems } from '../src/chapters/calculus/problems/convolution';

const compute = (state: ControlState): ConvolutionData => syncCompute(convolutionModel, state);

/** Trapezoid rule on [a, b] with n intervals. */
function trapezoid(f: (t: number) => number, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let s = 0.5 * (f(a) + f(b));
  for (let i = 1; i < n; i++) s += f(a + i * h);
  return s * h;
}

describe('convolution: tent mode, formula vs numeric overlap', () => {
  it('exact formula and overlap length agree to 1e-9 at the probe points', () => {
    for (const x of [-0.5, 0, 0.7, 1, 1.4, 2, 2.5]) {
      expectCloseTo(overlapLength(x), tentConvolution(x), 1e-9);
      const data = compute({ mode: 'tent', x, eps: 0.3 });
      expectCloseTo(data.value, tentConvolution(x), 1e-9);
      expectCloseTo(data.numericValue, tentConvolution(x), 1e-9);
      expectCloseTo(data.exactValue, tentConvolution(x), 1e-9);
    }
  });

  it('the tent values at the probe points are the documented ones', () => {
    expect(tentConvolution(-0.5)).toBe(0);
    expect(tentConvolution(0)).toBe(0);
    expectCloseTo(tentConvolution(0.7), 0.7, 1e-15);
    expect(tentConvolution(1)).toBe(1);
    expectCloseTo(tentConvolution(1.4), 0.6, 1e-15);
    expect(tentConvolution(2)).toBe(0);
    expect(tentConvolution(2.5)).toBe(0);
  });

  it('overlap endpoints are max(0, x-1) and min(1, x)', () => {
    expect(overlapInterval(0.7)).toEqual([0, 0.7]);
    const iv14 = overlapInterval(1.4);
    expectCloseTo(iv14[0]!, 0.4, 1e-15);
    expect(iv14[1]).toBe(1);
    expect(overlapInterval(-0.5)).toEqual([0, -0.5]);
    expect(overlapLength(-0.5)).toBe(0);
    expect(overlapLength(2.5)).toBe(0);
  });

  it('an independent fine trapezoid of the indicator product matches the formula', () => {
    // The product is a step function, so a trapezoid on a grid that does
    // not align with the kinks is only accurate to O(h); with h = 1e-4
    // the error stays well under 1e-3.
    for (const x of [0.7, 1.4]) {
      const numeric = trapezoid((t) => indicator01(t) * indicator01(x - t), -0.5, 2.5, 30000);
      expectCloseTo(numeric, tentConvolution(x), 1e-3);
    }
  });

  it('the tent trace is the exact formula on a grid of step 0.005 over [-0.5, 2.5]', () => {
    const data = compute({ mode: 'tent', x: 0.7, eps: 0.3 });
    expect(data.tentTrace).toHaveLength(601);
    expect(CONVOLUTION_GRID_STEP).toBe(0.005);
    for (let i = 0; i < data.tentTrace.length; i += 29) {
      const pt = data.tentTrace[i]!;
      expectCloseTo(pt.x, -0.5 + i * 0.005, 1e-12);
      expectCloseTo(pt.y, tentConvolution(pt.x), 1e-12);
    }
  });
});

describe('convolution: the tent kernel and its mass', () => {
  it('phi is the tent on [-1, 1] and integrates to 1', () => {
    expect(tentKernel(0)).toBe(1);
    expect(tentKernel(0.5)).toBe(0.5);
    expect(tentKernel(-1)).toBe(0);
    expect(tentKernel(2)).toBe(0);
    expectCloseTo(tentKernelIntegralNumeric(), 1, 1e-12);
    expectCloseTo(trapezoid(tentKernel, -1, 1, 2000), 1, 1e-12);
  });

  it('phi_eps integrates to 1 for several eps and lives on [-eps, eps]', () => {
    for (const eps of [0.05, 0.1, 0.3, 1]) {
      expectCloseTo(trapezoid((t) => phiEps(t, eps), -eps, eps, 2000), 1, 1e-9);
      expect(phiEps(eps + 0.01, eps)).toBe(0);
      expect(phiEps(-eps - 0.01, eps)).toBe(0);
      expectCloseTo(phiEps(0, eps), 1 / eps, 1e-12);
    }
  });
});

describe('convolution: smooth mode, closed form vs numeric integration', () => {
  it('the closed form is the tent CDF at v = x / eps, piecewise', () => {
    expect(tentCdf(-2)).toBe(0);
    expect(tentCdf(-1)).toBe(0);
    expectCloseTo(tentCdf(-0.5), 0.125, 1e-15);
    expectCloseTo(tentCdf(0), 0.5, 1e-15);
    expectCloseTo(tentCdf(0.5), 0.875, 1e-15);
    expect(tentCdf(1)).toBe(1);
    expect(tentCdf(3)).toBe(1);
  });

  it('independent fine integration of f(t) phi_eps(x - t) confirms the closed form', () => {
    // Independent check of the derivation: integrate the product over t
    // directly (f is the step), on a grid of step 0.0005, and compare
    // with the CDF formula -- this is what fixed the closed form.
    for (const [x, eps] of [
      [0.05, 0.1],
      [0.5, 0.3],
      [-0.2, 0.1],
      [0, 0.3],
      [-0.15, 0.3],
      [0.2, 0.3],
    ] as const) {
      const lo = Math.max(0, x - eps);
      const hi = x + eps;
      const numeric =
        hi > lo ? trapezoid((t) => stepFunction(t) * phiEps(x - t, eps), lo, hi, 4000) : 0;
      expectCloseTo(numeric, smoothConvolutionClosed(x, eps), 1e-3);
      expectCloseTo(smoothConvolutionNumeric(x, eps), smoothConvolutionClosed(x, eps), 1e-3);
    }
  });

  it('the documented smooth values hold', () => {
    // x = 0.05, eps = 0.1: v = 0.5, CDF = 1 - (1 - 0.5)^2 / 2 = 0.875.
    expectCloseTo(smoothConvolutionClosed(0.05, 0.1), 0.875, 1e-15);
    expectCloseTo(smoothConvolutionNumeric(0.05, 0.1), 0.875, 1e-3);
    const data = compute({ mode: 'smooth', x: 0.05, eps: 0.1 });
    expectCloseTo(data.exactValue, 0.875, 1e-15);
    expectCloseTo(data.value, 0.875, 1e-3);
    // x = 0.5, eps = 0.3: v = 5/3 >= 1, so the value is 1.
    expect(smoothConvolutionClosed(0.5, 0.3)).toBe(1);
    expectCloseTo(smoothConvolutionNumeric(0.5, 0.3), 1, 1e-3);
    // x = -0.2, eps = 0.1: v = -2 <= -1, so the value is 0.
    expect(smoothConvolutionClosed(-0.2, 0.1)).toBe(0);
    expect(smoothConvolutionNumeric(-0.2, 0.1)).toBe(0);
  });

  it('as eps shrinks the smoothed value tends to f(x) at continuity points', () => {
    for (const eps of [0.3, 0.1, 0.05]) {
      expectCloseTo(smoothConvolutionClosed(0.5, eps), 1, 1e-12);
      expect(smoothConvolutionClosed(-0.5, eps)).toBe(0);
    }
    // At the jump x = 0 the symmetric bump gives 1/2 for every eps.
    for (const eps of [0.05, 0.3, 1]) {
      expectCloseTo(smoothConvolutionClosed(0, eps), 0.5, 1e-15);
    }
    // Near the jump the value moves toward f(x) = 1 as eps shrinks.
    expect(smoothConvolutionClosed(0.05, 0.3)).toBeLessThan(smoothConvolutionClosed(0.05, 0.1));
    expect(smoothConvolutionClosed(0.05, 0.1)).toBeLessThan(1);
  });

  it('the smooth trace is the closed form on [-1, 2] with step 0.005', () => {
    const data = compute({ mode: 'smooth', x: 0.05, eps: 0.1 });
    expect(data.smoothTrace).toHaveLength(601);
    for (let i = 0; i < data.smoothTrace.length; i += 31) {
      const pt = data.smoothTrace[i]!;
      expectCloseTo(pt.x, -1 + i * 0.005, 1e-12);
      expectCloseTo(pt.y, smoothConvolutionClosed(pt.x, 0.1), 1e-12);
    }
  });
});

describe('convolution: model compute', () => {
  it('defaults to tent mode with init x and eps', () => {
    const data = compute({});
    expect(data.mode).toBe(CONVOLUTION_MODE_INIT);
    expect(data.mode).toBe('tent');
    expect(data.x).toBe(CONVOLUTION_X_INIT);
    expect(data.eps).toBe(CONVOLUTION_EPS_INIT);
    expectCloseTo(data.value, 0.7, 1e-12);
  });

  it('an unknown mode falls back to tent; modes list is tent and smooth', () => {
    expect(CONVOLUTION_MODES).toEqual(['tent', 'smooth']);
    expect(compute({ mode: 'nope', x: 0.7, eps: 0.3 }).mode).toBe('tent');
    expect(compute({ mode: 42, x: 0.7, eps: 0.3 }).mode).toBe('tent');
    expect(compute({ mode: 'smooth', x: 0.7, eps: 0.3 }).mode).toBe('smooth');
  });

  it('clamps x and eps into range; NaN gives init', () => {
    expect(compute({ mode: 'tent', x: 100, eps: 0.3 }).x).toBe(CONVOLUTION_X_MAX);
    expect(compute({ mode: 'tent', x: -100, eps: 0.3 }).x).toBe(CONVOLUTION_X_MIN);
    expect(compute({ mode: 'tent', x: NaN, eps: 0.3 }).x).toBe(CONVOLUTION_X_INIT);
    expect(compute({ mode: 'tent', x: 0.7, eps: 100 }).eps).toBe(CONVOLUTION_EPS_MAX);
    expect(compute({ mode: 'tent', x: 0.7, eps: 0 }).eps).toBe(CONVOLUTION_EPS_MIN);
    expect(compute({ mode: 'tent', x: 0.7, eps: NaN }).eps).toBe(CONVOLUTION_EPS_INIT);
  });

  it('exports the expected data keys', () => {
    const data = compute({ mode: 'smooth', x: 0.05, eps: 0.1 });
    for (const key of [
      'mode', 'x', 'eps', 'value', 'exactValue', 'numericValue',
      'overlapLo', 'overlapHi', 'tentTrace', 'smoothTrace',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('convolution: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(convolutionProblems);
  });

  it('the three ids are commutativity, indicator-tent, approximate-identity', () => {
    expect(convolutionProblems.map((p) => p.id)).toEqual([
      'commutativity',
      'indicator-tent',
      'approximate-identity',
    ]);
  });

  it('presets are valid and their caption numbers match the model', () => {
    for (const p of convolutionProblems) {
      expect(CONVOLUTION_MODES.includes(String(p.preset['mode']))).toBe(true);
      const x = Number(p.preset['x']);
      const eps = Number(p.preset['eps']);
      expect(x).toBeGreaterThanOrEqual(CONVOLUTION_X_MIN);
      expect(x).toBeLessThanOrEqual(CONVOLUTION_X_MAX);
      expect(eps).toBeGreaterThanOrEqual(CONVOLUTION_EPS_MIN);
      expect(eps).toBeLessThanOrEqual(CONVOLUTION_EPS_MAX);
    }
    const [a, b, c] = convolutionProblems;
    expect(a!.preset).toEqual({ mode: 'tent', x: 0.7, eps: 0.3 });
    expectCloseTo(compute(a!.preset).value, 0.7, 1e-12);
    expect(b!.preset).toEqual({ mode: 'tent', x: 1.4, eps: 0.3 });
    expectCloseTo(compute(b!.preset).value, 0.6, 1e-12);
    expect(c!.preset).toEqual({ mode: 'smooth', x: 0.05, eps: 0.1 });
    expectCloseTo(compute(c!.preset).exactValue, 0.875, 1e-12);
    expectCloseTo(compute(c!.preset).value, 0.875, 1e-3);
  });
});
