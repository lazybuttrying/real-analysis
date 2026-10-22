import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  cutoff,
  cutoffApprox,
  expDecay,
  FS_X_MAX,
  functionSpacesModel,
  FUNCTION_SPACES_K_INIT,
  FUNCTION_SPACES_K_MAX,
  FUNCTION_SPACES_K_MIN,
  FUNCTION_SPACES_MODE_INIT,
  FUNCTION_SPACES_MODES,
  oneFn,
  supErrorBound,
  supErrorExact,
  supErrorNumeric,
  tentBump,
  type FunctionSpacesData,
} from '../src/chapters/series/models/functionSpaces';
import { functionSpacesProblems } from '../src/chapters/series/problems/function-spaces';

const compute = (state: ControlState): FunctionSpacesData =>
  syncCompute(functionSpacesModel, state);

describe('function-spaces: the three representatives', () => {
  it('the tent bump is in Cc: peak 1, support exactly [-1, 1]', () => {
    expect(tentBump(0)).toBe(1);
    expect(tentBump(0.5)).toBe(0.5);
    expect(tentBump(-0.5)).toBe(0.5);
    expect(tentBump(1)).toBe(0);
    expect(tentBump(-1)).toBe(0);
    for (const x of [1.001, 2, 10, -3.5]) {
      expect(tentBump(x)).toBe(0);
    }
  });

  it('e^{-|x|} is in C0 but not Cc: positive everywhere, tails to 0', () => {
    expect(expDecay(0)).toBe(1);
    expectCloseTo(expDecay(1), Math.exp(-1), 1e-15);
    expectCloseTo(expDecay(-2), Math.exp(-2), 1e-15);
    // Positive at every sampled point, however far out.
    for (const x of [0.5, 3, 8, 20, 100]) {
      expect(expDecay(x)).toBeGreaterThan(0);
    }
    // Vanishing at infinity: beyond ln(1/eps) the value is below eps.
    expect(expDecay(10)).toBeLessThan(1e-4);
    expect(expDecay(Math.log(1 / 1e-6) + 1)).toBeLessThan(1e-6);
  });

  it('the constant 1 is in Cb but not C0: it never fades', () => {
    expect(oneFn(0)).toBe(1);
    expect(oneFn(12345)).toBe(1);
    expect(oneFn(-1e6)).toBe(1);
  });

  it('all three sup norms are 1; window-edge values are 0, e^{-4}, 1', () => {
    const data = compute({ mode: 'spaces', k: 1 });
    expect(data.tentSup).toBe(1);
    expect(data.expSup).toBe(1);
    expect(data.oneSup).toBe(1);
    expect(data.tentTail).toBe(0);
    expectCloseTo(data.expTail, Math.exp(-FS_X_MAX), 1e-15);
    expect(data.oneTail).toBe(1);
  });
});

describe('function-spaces: the cutoff and its error', () => {
  it('phi_k is 1 on [-k, k], 1/2 at +-(k + 1/2), 0 at and beyond +-(k+1)', () => {
    for (const k of [0.5, 1, 2]) {
      expect(cutoff(0, k)).toBe(1);
      expect(cutoff(k, k)).toBe(1);
      expect(cutoff(-k, k)).toBe(1);
      expectCloseTo(cutoff(k + 0.5, k), 0.5, 1e-15);
      expectCloseTo(cutoff(-(k + 0.5), k), 0.5, 1e-15);
      expect(cutoff(k + 1, k)).toBe(0);
      expect(cutoff(k + 5, k)).toBe(0);
    }
  });

  it('f_k agrees with f on [-k, k] and vanishes beyond +-(k+1)', () => {
    for (const k of [0.5, 1, 2.5]) {
      expect(cutoffApprox(0, k)).toBe(1);
      expectCloseTo(cutoffApprox(k / 2, k), expDecay(k / 2), 1e-15);
      expect(cutoffApprox(k + 1, k)).toBe(0);
      expect(cutoffApprox(k + 3, k)).toBe(0);
      expect(cutoffApprox(-(k + 3), k)).toBe(0);
    }
  });

  it('the exact sup error is e^{-(k+1)}, attained at |x| = k + 1 (Problem 3)', () => {
    for (const k of [0.5, 1, 1.5, 2, 3]) {
      expectCloseTo(supErrorExact(k), Math.exp(-(k + 1)), 1e-15);
      expectCloseTo(
        Math.abs(expDecay(k + 1) - cutoffApprox(k + 1, k)),
        supErrorExact(k),
        1e-15,
      );
    }
  });

  it('the numeric sup error matches e^{-(k+1)} and respects the looser bound e^{-k}', () => {
    for (const k of [0.5, 1, 1.25, 2, 3]) {
      const numeric = supErrorNumeric(k);
      expectCloseTo(numeric, supErrorExact(k), 1e-6);
      expect(numeric).toBeLessThan(supErrorBound(k));
      expectCloseTo(supErrorBound(k), Math.exp(-k), 1e-15);
    }
  });

  it('the middle-region estimate s e^{1-s} <= 1 holds on [0, 1] (Problem 3)', () => {
    for (let i = 0; i <= 100; i++) {
      const s = i / 100;
      expect(s * Math.exp(1 - s)).toBeLessThanOrEqual(1 + 1e-12);
    }
    expectCloseTo(1 * Math.exp(0), 1, 1e-15);
  });

  it('the error shrinks as k grows: cutoff approximants converge uniformly', () => {
    expect(supErrorNumeric(0.5)).toBeGreaterThan(supErrorNumeric(1.5));
    expect(supErrorNumeric(1.5)).toBeGreaterThan(supErrorNumeric(2.5));
    expect(supErrorExact(10)).toBeLessThan(1e-4);
  });

  it('(f_j) is uniformly Cauchy: ||f_i - f_j|| <= e^{-(i+1)} + e^{-(j+1)} (Problem 3)', () => {
    // Numeric sup of |f_i - f_j| on a fine grid over [0, 8] (even functions).
    const supDiff = (i: number, j: number): number => {
      let max = 0;
      for (let s = 0; s <= 8000; s++) {
        const x = (s / 8000) * 8;
        const d = Math.abs(cutoffApprox(x, i) - cutoffApprox(x, j));
        if (d > max) max = d;
      }
      return max;
    };
    for (const [i, j] of [[1, 2], [1, 3], [2, 3]] as const) {
      expect(supDiff(i, j)).toBeLessThanOrEqual(supErrorExact(i) + supErrorExact(j) + 1e-9);
    }
    // And the Cauchy gaps genuinely go to 0 along the sequence.
    expect(supDiff(2, 3)).toBeLessThan(supErrorExact(2) + supErrorExact(3) + 1e-9);
    expect(supErrorExact(2) + supErrorExact(3)).toBeLessThan(0.07);
  });
});

describe('function-spaces: model compute', () => {
  it('defaults to spaces mode with init k', () => {
    const data = compute({});
    expect(data.mode).toBe(FUNCTION_SPACES_MODE_INIT);
    expect(data.k).toBe(FUNCTION_SPACES_K_INIT);
  });

  it('an unknown mode id falls back to spaces', () => {
    expect(compute({ mode: 'nope', k: 1 }).mode).toBe('spaces');
    expect(compute({ mode: 42, k: 1 }).mode).toBe('spaces');
  });

  it('clamps k into range; NaN gives init', () => {
    expect(compute({ mode: 'cutoff', k: 100 }).k).toBe(FUNCTION_SPACES_K_MAX);
    expect(compute({ mode: 'cutoff', k: 0 }).k).toBe(FUNCTION_SPACES_K_MIN);
    expect(compute({ mode: 'cutoff', k: NaN }).k).toBe(FUNCTION_SPACES_K_INIT);
  });

  it('cutoff-mode data is consistent: support edge, exact and numeric errors', () => {
    const data = compute({ mode: 'cutoff', k: 2 });
    expect(data.supportHi).toBe(3);
    expectCloseTo(data.errorExact, Math.exp(-3), 1e-15);
    expectCloseTo(data.errorNumeric, data.errorExact, 1e-6);
    expect(data.errorNumeric).toBeLessThan(data.errorBound);
    const fkAt = (x: number) =>
      data.fkSamples.reduce(
        (best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best),
        data.fkSamples[0]!,
      ).y;
    expect(fkAt(3.5)).toBe(0);
    expect(fkAt(0)).toBe(1);
  });

  it('exports the expected data keys', () => {
    const data = compute({ mode: 'spaces', k: 1 });
    for (const key of [
      'mode', 'k', 'tentSamples', 'expSamples', 'oneSamples', 'phiSamples',
      'fkSamples', 'tentSup', 'expSup', 'oneSup', 'tentTail', 'expTail',
      'oneTail', 'errorExact', 'errorNumeric', 'errorBound', 'supportHi',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('function-spaces: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(functionSpacesProblems);
  });

  it('the three ids are c0-closed-in-cb, cc-dense-in-c0, cc-not-complete', () => {
    expect(functionSpacesProblems.map((p) => p.id)).toEqual([
      'c0-closed-in-cb',
      'cc-dense-in-c0',
      'cc-not-complete',
    ]);
  });

  it('presets use valid modes and k in range', () => {
    const modes = new Set<string>(FUNCTION_SPACES_MODES);
    for (const p of functionSpacesProblems) {
      expect(modes.has(String(p.preset['mode']))).toBe(true);
      const k = Number(p.preset['k']);
      expect(k).toBeGreaterThanOrEqual(FUNCTION_SPACES_K_MIN);
      expect(k).toBeLessThanOrEqual(FUNCTION_SPACES_K_MAX);
    }
  });

  it('preset captions match the model error values: e^{-2} at k = 1, e^{-3} at k = 2', () => {
    const byId = (id: string) => functionSpacesProblems.find((p) => p.id === id)!;
    const dense = compute(byId('cc-dense-in-c0').preset);
    expect(dense.mode).toBe('cutoff');
    expect(dense.k).toBe(1);
    expectCloseTo(dense.errorExact, Math.exp(-2), 1e-15);
    expectCloseTo(dense.errorExact, 0.1353, 5e-5);
    const notComplete = compute(byId('cc-not-complete').preset);
    expect(notComplete.k).toBe(2);
    expectCloseTo(notComplete.errorExact, Math.exp(-3), 1e-15);
    expectCloseTo(notComplete.errorExact, 0.0498, 5e-5);
    const closed = compute(byId('c0-closed-in-cb').preset);
    expect(closed.mode).toBe('spaces');
  });
});
