import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  EXAMPLE_INIT,
  EXAMPLE_OPTIONS,
  fnIntegral,
  fnMaxHeight,
  fnRects,
  lebesgueConvergenceData,
  lebesgueConvergenceModel,
  limitIntegral,
  limitRects,
  N_INIT,
  N_MAX,
  N_MIN,
  type ExampleKind,
  type LebesgueConvergenceData,
} from '../src/chapters/calculus/models/lebesgueConvergence';
import { lebesgueConvergenceProblems } from '../src/chapters/calculus/problems/lebesgue-convergence';

const compute = (state: ControlState): LebesgueConvergenceData =>
  syncCompute(lebesgueConvergenceModel, state);

describe('lebesgue-convergence: escape f_n = 1_[n,n+1]', () => {
  it('integral is exactly 1 for every n, limit integral is 0', () => {
    for (const n of [1, 5, 40]) {
      expect(fnIntegral('escape', n)).toBe(1);
      const data = lebesgueConvergenceData('escape', n);
      expect(data.integral).toBe(1);
      expect(data.limitIntegral).toBe(0);
      expectCloseTo(data.gap, 1, 1e-15);
    }
    expect(limitIntegral('escape')).toBe(0);
  });

  it('the spike is drawn on [1,2] for n = 1 and leaves the window after', () => {
    const r1 = fnRects('escape', 1);
    expect(r1).toHaveLength(1);
    expect(r1[0]).toEqual({ x0: 1, x1: 2, height: 1 });
    // n = 2: [2,3] touches only the boundary point, so nothing is drawn.
    expect(fnRects('escape', 2)).toHaveLength(0);
    expect(fnRects('escape', 40)).toHaveLength(0);
  });

  it('no limit rects are drawn (limit is 0)', () => {
    expect(limitRects('escape')).toHaveLength(0);
  });
});

describe('lebesgue-convergence: spike f_n = n * 1_[0,1/n]', () => {
  it('integral is exactly 1 for every n, limit integral is 0 (a.e.)', () => {
    for (const n of [1, 10, 40]) {
      expect(fnIntegral('spike', n)).toBe(1);
      const data = lebesgueConvergenceData('spike', n);
      expect(data.integral).toBe(1);
      expect(data.limitIntegral).toBe(0);
      expectCloseTo(data.gap, 1, 1e-15);
    }
    expect(limitIntegral('spike')).toBe(0);
  });

  it('the rect gets taller and thinner: height n on [0, 1/n]', () => {
    for (const n of [1, 10, 40]) {
      const r = fnRects('spike', n);
      expect(r).toHaveLength(1);
      expect(r[0]?.x0).toBe(0);
      expectCloseTo(r[0]!.x1, 1 / n, 1e-15);
      expect(r[0]?.height).toBe(n);
      expect(fnMaxHeight('spike', n)).toBe(n);
    }
    expect(limitRects('spike')).toHaveLength(0);
  });
});

describe('lebesgue-convergence: monotone f_n = 1_[0,1-1/n]', () => {
  it('integral 1 - 1/n rises to the limit integral 1', () => {
    for (const n of [1, 2, 10, 40]) {
      expectCloseTo(fnIntegral('monotone', n), 1 - 1 / n, 1e-15);
      const data = lebesgueConvergenceData('monotone', n);
      expectCloseTo(data.integral, 1 - 1 / n, 1e-15);
      expect(data.limitIntegral).toBe(1);
      expectCloseTo(data.gap, -1 / n, 1e-15);
    }
    expect(limitIntegral('monotone')).toBe(1);
  });

  it('the limit rect is [0,1] at height 1', () => {
    expect(limitRects('monotone')).toEqual([{ x0: 0, x1: 1, height: 1 }]);
    const r = fnRects('monotone', 10);
    expect(r).toHaveLength(1);
    expectCloseTo(r[0]!.x1, 0.9, 1e-15);
    expect(r[0]?.height).toBe(1);
  });

  it('MCT equality is approached: gap shrinks to 0', () => {
    const small = lebesgueConvergenceData('monotone', N_MAX);
    expect(Math.abs(small.gap)).toBeLessThan(
      Math.abs(lebesgueConvergenceData('monotone', N_MIN).gap),
    );
    expectCloseTo(small.gap, -1 / N_MAX, 1e-15);
  });
});

describe('lebesgue-convergence: model compute', () => {
  it('reads example and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).example).toBe(EXAMPLE_INIT);
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ example: 'nope' }).example).toBe(EXAMPLE_INIT);
    for (const ex of EXAMPLE_OPTIONS as readonly ExampleKind[]) {
      expect(compute({ example: ex }).example).toBe(ex);
    }
    expect(compute({ n: 100 }).n).toBe(N_MAX);
    expect(compute({ n: -3 }).n).toBe(N_MIN);
    expect(compute({ n: 2.4 }).n).toBe(2);
  });

  it('exports the expected data keys', () => {
    const data = compute({ example: 'spike', n: 10 });
    for (const key of [
      'example',
      'n',
      'integral',
      'limitIntegral',
      'gap',
      'rects',
      'limitRects',
      'maxHeight',
      'verdict',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
    expect(data.verdict.ko).toBeTruthy();
    expect(data.verdict.en).toBeTruthy();
  });
});

describe('lebesgue-convergence: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(lebesgueConvergenceProblems).toHaveLength(3);
    for (const p of lebesgueConvergenceProblems) {
      expect(p.id).toBeTruthy();
      expect(p.statement.ko).toBeTruthy();
      expect(p.statement.en).toBeTruthy();
      expect(p.presetCaption.ko).toBeTruthy();
      expect(p.presetCaption.en).toBeTruthy();
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko).toBeTruthy();
        expect(step.text.en).toBeTruthy();
      }
    }
  });

  it('the three ids are lc-fatou, lc-mct, lc-dct', () => {
    expect(lebesgueConvergenceProblems.map((p) => p.id)).toEqual([
      'lc-fatou',
      'lc-mct',
      'lc-dct',
    ]);
  });

  it('presets use valid example options and in-range n', () => {
    for (const p of lebesgueConvergenceProblems) {
      expect(EXAMPLE_OPTIONS as readonly string[]).toContain(String(p.preset['example']));
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
    }
  });
});
