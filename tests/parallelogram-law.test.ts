import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  lpNorm,
  parallelogramLawModel,
  signedPow,
  unitSpherePoint,
  PARALLELOGRAM_P_INIT,
  PARALLELOGRAM_P_MAX,
  PARALLELOGRAM_P_MIN,
  PARALLELOGRAM_SAMPLE_COUNT,
  PARALLELOGRAM_SHOW_CIRCLE_INIT,
  type ParallelogramLawData,
} from '../src/chapters/limits/models/parallelogramLaw';
import { parallelogramLawProblems } from '../src/chapters/limits/problems/parallelogram-law';

const compute = (state: ControlState): ParallelogramLawData => syncCompute(parallelogramLawModel, state);

describe('parallelogram-law: lpNorm', () => {
  it('lpNorm((1, 0), p) = lpNorm((0, 1), p) = 1 for every p', () => {
    for (const p of [1.1, 1.5, 2, 3, 8]) {
      expectCloseTo(lpNorm({ x: 1, y: 0 }, p), 1, 1e-12);
      expectCloseTo(lpNorm({ x: 0, y: 1 }, p), 1, 1e-12);
    }
  });

  it('lpNorm((1, 1), p) = 2^(1/p) and lpNorm((3, 4), 2) = 5', () => {
    for (const p of [1.1, 1.5, 2, 3, 8]) {
      expectCloseTo(lpNorm({ x: 1, y: 1 }, p), Math.pow(2, 1 / p), 1e-12);
      expectCloseTo(lpNorm({ x: 1, y: -1 }, p), Math.pow(2, 1 / p), 1e-12);
    }
    expectCloseTo(lpNorm({ x: 3, y: 4 }, 2), 5, 1e-12);
  });

  it('signedPow keeps the sign and handles 0', () => {
    expect(signedPow(0, 2)).toBe(0);
    expectCloseTo(signedPow(-0.5, 2), -0.25, 1e-15);
    expectCloseTo(signedPow(0.5, 2), 0.25, 1e-15);
  });
});

describe('parallelogram-law: the identity at p = 2', () => {
  const data = compute({ p: 2, showCircle: true });

  it('LHS = RHS = 4 and holds is true', () => {
    expectCloseTo(data.lhs, 4, 1e-12);
    expectCloseTo(data.rhs, 4, 1e-12);
    expectCloseTo(data.gap, 0, 1e-12);
    expect(data.holds).toBe(true);
  });

  it('normPlus = normMinus = sqrt(2)', () => {
    expectCloseTo(data.normPlus, Math.SQRT2, 1e-12);
    expectCloseTo(data.normMinus, Math.SQRT2, 1e-12);
    expectCloseTo(data.normE1, 1, 1e-12);
    expectCloseTo(data.normE2, 1, 1e-12);
  });

  it('the vertices are 0, e1, e1 + e2, e2', () => {
    expect(data.e1).toEqual({ x: 1, y: 0 });
    expect(data.e2).toEqual({ x: 0, y: 1 });
    expect(data.sum).toEqual({ x: 1, y: 1 });
    expect(data.diff).toEqual({ x: 1, y: -1 });
  });
});

describe('parallelogram-law: failure away from p = 2', () => {
  it('p = 3: LHS = 2^(5/3), approximately 3.1748, holds is false', () => {
    const data = compute({ p: 3, showCircle: true });
    expectCloseTo(data.lhs, Math.pow(2, 5 / 3), 1e-12);
    expectCloseTo(data.lhs, 3.1748021039363987, 1e-12);
    expectCloseTo(data.rhs, 4, 1e-12);
    expectCloseTo(data.gap, Math.pow(2, 5 / 3) - 4, 1e-12);
    expect(data.gap).toBeLessThan(0);
    expect(data.holds).toBe(false);
  });

  it('p = 1.5: LHS = 2^(7/3), holds is false, gap is positive', () => {
    const data = compute({ p: 1.5, showCircle: true });
    // 1 + 2/p = 1 + 4/3 = 7/3.
    expectCloseTo(data.lhs, Math.pow(2, 7 / 3), 1e-12);
    expectCloseTo(data.lhs, 2 * Math.pow(2, 2 / 1.5), 1e-12);
    expectCloseTo(data.rhs, 4, 1e-12);
    expect(data.gap).toBeGreaterThan(0);
    expect(data.holds).toBe(false);
  });

  it('the closed form LHS = 2 * 2^(2/p), RHS = 4 holds on a sweep', () => {
    for (const p of [1.1, 1.5, 2, 2.5, 3, 5, 8]) {
      const data = compute({ p, showCircle: true });
      expectCloseTo(data.lhs, 2 * Math.pow(2, 2 / p), 1e-9);
      expectCloseTo(data.rhs, 4, 1e-12);
      expectCloseTo(data.gap, data.lhs - data.rhs, 1e-12);
      expect(data.holds).toBe(Math.abs(p - 2) < 1e-12);
    }
  });

  it('normPlus = normMinus = 2^(1/p) on a sweep', () => {
    for (const p of [1.1, 2, 3, 8]) {
      const data = compute({ p });
      expectCloseTo(data.normPlus, Math.pow(2, 1 / p), 1e-12);
      expectCloseTo(data.normMinus, Math.pow(2, 1 / p), 1e-12);
    }
  });
});

describe('parallelogram-law: the unit sphere samples', () => {
  it('exposes 128 samples', () => {
    const data = compute({ p: 2 });
    expect(data.samples).toHaveLength(PARALLELOGRAM_SAMPLE_COUNT);
    expect(PARALLELOGRAM_SAMPLE_COUNT).toBe(128);
  });

  it('every sample has l^p norm 1 within 1e-9', () => {
    for (const p of [1.1, 1.5, 2, 3, 5, 8]) {
      const data = compute({ p });
      for (const pt of data.samples) {
        expectCloseTo(lpNorm(pt, p), 1, 1e-9);
      }
    }
  });

  it('unitSpherePoint has l^p norm 1 at sampled angles', () => {
    for (const p of [1.5, 2, 3]) {
      for (let k = 0; k < 32; k++) {
        const pt = unitSpherePoint((k * 2 * Math.PI) / 32, p);
        expectCloseTo(lpNorm(pt, p), 1, 1e-9);
      }
    }
  });

  it('at p = 2 the samples lie on the ordinary unit circle', () => {
    const data = compute({ p: 2 });
    for (const pt of data.samples) {
      expectCloseTo(pt.x * pt.x + pt.y * pt.y, 1, 1e-9);
    }
  });
});

describe('parallelogram-law: model compute', () => {
  it('defaults to p = 2 with the circle shown', () => {
    const data = compute({});
    expect(data.p).toBe(PARALLELOGRAM_P_INIT);
    expect(PARALLELOGRAM_P_INIT).toBe(2);
    expect(data.showCircle).toBe(PARALLELOGRAM_SHOW_CIRCLE_INIT);
    expect(data.showCircle).toBe(true);
    expect(data.holds).toBe(true);
  });

  it('clamps p into [1.1, 8]; NaN gives the init', () => {
    expect(compute({ p: 100 }).p).toBe(PARALLELOGRAM_P_MAX);
    expect(compute({ p: 0.5 }).p).toBe(PARALLELOGRAM_P_MIN);
    expect(compute({ p: NaN }).p).toBe(PARALLELOGRAM_P_INIT);
    expect(compute({ p: 3 }).p).toBe(3);
  });

  it('showCircle obeys an explicit false', () => {
    expect(compute({ p: 2, showCircle: false }).showCircle).toBe(false);
    expect(compute({ p: 2, showCircle: true }).showCircle).toBe(true);
  });

  it('exports the expected data keys', () => {
    const data = compute({ p: 2, showCircle: true });
    for (const key of [
      'p', 'showCircle', 'e1', 'e2', 'sum', 'diff', 'normE1', 'normE2',
      'normPlus', 'normMinus', 'lhs', 'rhs', 'gap', 'holds', 'samples',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('parallelogram-law: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(parallelogramLawProblems);
  });

  it('the three ids are as specified', () => {
    expect(parallelogramLawProblems.map((p) => p.id)).toEqual([
      'inner-product-implies-parallelogram',
      'lp-counterexample',
      'polarization-identity',
    ]);
  });

  it('presets are p = 2, p = 3, p = 2 with p in range', () => {
    expect(parallelogramLawProblems.map((p) => Number(p.preset['p']))).toEqual([2, 3, 2]);
    for (const p of parallelogramLawProblems) {
      const pp = Number(p.preset['p']);
      expect(pp).toBeGreaterThanOrEqual(PARALLELOGRAM_P_MIN);
      expect(pp).toBeLessThanOrEqual(PARALLELOGRAM_P_MAX);
    }
  });

  it('the p = 3 preset really fails: LHS = 2^(5/3) against RHS = 4', () => {
    const preset = parallelogramLawProblems[1]!;
    const data = compute(preset.preset);
    expect(data.p).toBe(3);
    expectCloseTo(data.lhs, Math.pow(2, 5 / 3), 1e-12);
    expectCloseTo(data.rhs, 4, 1e-12);
    expect(data.holds).toBe(false);
  });

  it('the p = 2 presets really satisfy the identity', () => {
    for (const idx of [0, 2]) {
      const data = compute(parallelogramLawProblems[idx]!.preset);
      expect(data.holds).toBe(true);
      expectCloseTo(data.lhs, 4, 1e-12);
      expectCloseTo(data.rhs, 4, 1e-12);
    }
  });

  it('the lp-counterexample proof separates the two directions', () => {
    const problem = parallelogramLawProblems[1]!;
    const texts = problem.proof.map((step) => step.text.en);
    const forward = texts.findIndex((t) => t.includes('(\\Rightarrow)'));
    const backward = texts.findIndex((t) => t.includes('(\\Leftarrow)'));
    expect(forward).toBeGreaterThanOrEqual(0);
    expect(backward).toBeGreaterThan(forward);
  });
});
