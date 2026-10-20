import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  ALPHA_INIT,
  ALPHA_OPTIONS,
  exactIntegral,
  N_INIT,
  N_MAX,
  N_MIN,
  riemannStieltjesData,
  riemannStieltjesModel,
  STEP_POINT,
  type AlphaKind,
  type RiemannStieltjesData,
} from '../src/chapters/calculus/models/riemannStieltjes';
import { riemannStieltjesProblems } from '../src/chapters/calculus/problems/riemann-stieltjes';

const compute = (state: ControlState): RiemannStieltjesData => syncCompute(riemannStieltjesModel, state);

describe('riemann-stieltjes: identity alpha = ordinary Riemann sums', () => {
  it('U_n = (n+1)/(2n) and L_n = (n-1)/(2n) for f(x) = x', () => {
    for (const n of [1, 2, 6, 24]) {
      const data = riemannStieltjesData('identity', n);
      expectCloseTo(data.upper, (n + 1) / (2 * n), 1e-12);
      expectCloseTo(data.lower, (n - 1) / (2 * n), 1e-12);
      expectCloseTo(data.gap, 1 / n, 1e-12);
    }
  });

  it('U and L squeeze 1/2 as n grows', () => {
    const data = riemannStieltjesData('identity', N_MAX);
    expectCloseTo(data.upper, 0.5, 1 / N_MAX);
    expectCloseTo(data.lower, 0.5, 1 / N_MAX);
    expect(data.upper).toBeGreaterThan(0.5);
    expect(data.lower).toBeLessThan(0.5);
  });

  it('Delta alpha_i = Delta x_i on every interval', () => {
    const data = riemannStieltjesData('identity', 6);
    for (const seg of data.intervals) {
      expectCloseTo(seg.dAlpha, seg.x1 - seg.x0, 1e-15);
    }
  });
});

describe('riemann-stieltjes: step alpha', () => {
  it('the exact integral is exactly 0.5 for every n >= 1', () => {
    for (let n = N_MIN; n <= N_MAX; n++) {
      expect(riemannStieltjesData('step', n).exact).toBe(0.5);
    }
  });

  it('exactly one interval carries the jump; all others have dAlpha = 0', () => {
    for (let n = N_MIN; n <= N_MAX; n++) {
      const data = riemannStieltjesData('step', n);
      const jumped = data.intervals.filter((seg) => seg.dAlpha !== 0);
      expect(jumped).toHaveLength(1);
      expect(jumped[0]?.dAlpha).toBe(1);
      // The jump interval straddles the step point.
      expect(jumped[0]!.x0).toBeLessThanOrEqual(STEP_POINT);
      expect(jumped[0]!.x1).toBeGreaterThanOrEqual(STEP_POINT);
    }
  });

  it('U/L = sup/inf of f on the jump interval, squeezing 0.5', () => {
    for (let n = N_MIN; n <= N_MAX; n++) {
      const data = riemannStieltjesData('step', n);
      const jumped = data.intervals.find((seg) => seg.dAlpha !== 0)!;
      expectCloseTo(data.upper, jumped.hi, 1e-15);
      expectCloseTo(data.lower, jumped.lo, 1e-15);
      expectCloseTo(data.gap, 1 / n, 1e-12);
      expect(data.upper).toBeGreaterThanOrEqual(0.5);
      expect(data.lower).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('riemann-stieltjes: square alpha', () => {
  it('exact integral is 2/3', () => {
    expect(exactIntegral('square')).toBe(2 / 3);
  });

  it('Delta alpha_i sums to alpha(1) - alpha(0) = 1', () => {
    for (const alpha of ALPHA_OPTIONS as readonly AlphaKind[]) {
      const data = riemannStieltjesData(alpha, 7);
      const total = data.intervals.reduce((s, seg) => s + seg.dAlpha, 0);
      expectCloseTo(total, 1, 1e-12);
    }
  });

  it('U/L converge to 2/3 within tolerance', () => {
    const data = riemannStieltjesData('square', N_MAX);
    expectCloseTo(data.upper, 2 / 3, 1 / N_MAX);
    expectCloseTo(data.lower, 2 / 3, 1 / N_MAX);
    expect(data.upper).toBeGreaterThan(2 / 3);
    expect(data.lower).toBeLessThan(2 / 3);
  });

  it('square stretches early intervals and squeezes late ones', () => {
    const data = riemannStieltjesData('square', 6);
    const first = data.intervals[0]!;
    const last = data.intervals[data.intervals.length - 1]!;
    // dAlpha = x1^2 - x0^2 grows with the interval position.
    expect(first.dAlpha).toBeLessThan(last.dAlpha);
  });
});

describe('riemann-stieltjes: model compute', () => {
  it('reads alpha and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).alpha).toBe(ALPHA_INIT);
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ alpha: 'nope' }).alpha).toBe(ALPHA_INIT);
    expect(compute({ alpha: 'square' }).alpha).toBe('square');
    expect(compute({ alpha: 'step' }).alpha).toBe('step');
    expect(compute({ n: 100 }).n).toBe(N_MAX);
    expect(compute({ n: -3 }).n).toBe(N_MIN);
    expect(compute({ n: 2.4 }).n).toBe(2);
  });

  it('exports the expected data keys', () => {
    const data = compute({ alpha: 'identity', n: 6 });
    for (const key of ['alpha', 'n', 'intervals', 'upper', 'lower', 'gap', 'exact'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('riemann-stieltjes: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(riemannStieltjesProblems);
  });

  it('the three ids are rs-identity, rs-step, rs-c1', () => {
    expect(riemannStieltjesProblems.map((p) => p.id)).toEqual([
      'rs-identity',
      'rs-step',
      'rs-c1',
    ]);
  });

  it('presets use valid alpha options', () => {
    for (const p of riemannStieltjesProblems) {
      expect(ALPHA_OPTIONS as readonly string[]).toContain(String(p.preset['alpha']));
    }
  });
});
