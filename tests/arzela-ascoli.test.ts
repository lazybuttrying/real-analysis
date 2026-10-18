import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  arzelaAscoliModel,
  buildArzela,
  CONTRAST_NS,
  DEFAULT_MEMBERS,
  FAMILY_B,
  GRID_N,
  LIMIT_A,
  LIP_UNIFORM,
  MAX_MEMBERS,
  MIN_MEMBERS,
  familyF,
  lipBound,
  seqA,
  supError,
  type ArzelaData,
} from '../src/chapters/limits/models/arzelaAscoli';
import { arzelaAscoliProblems } from '../src/chapters/limits/problems/arzela-ascoli';

const compute = (state: ControlState): ArzelaData => syncCompute(arzelaAscoliModel, state);

describe('arzela-ascoli: the demo subsequence amplitudes', () => {
  it('seqA(k) = 1/2 + (-1)^k/(k+2)', () => {
    for (let k = 1; k <= 12; k++) {
      const expected = 0.5 + (k % 2 === 0 ? 1 : -1) / (k + 2);
      expect(seqA(k)).toBeCloseTo(expected, 15);
    }
  });

  it('the documented values: a_1 = 1/6, a_2 = 3/4, a_12 = 1/2 + 1/14', () => {
    expectCloseTo(seqA(1), 1 / 6, 1e-15);
    expectCloseTo(seqA(2), 3 / 4, 1e-15);
    expectCloseTo(seqA(12), 0.5 + 1 / 14, 1e-15);
  });

  it('every member lies in the family |a| <= 3/4 and converges to 1/2', () => {
    for (let k = 1; k <= 12; k++) {
      expect(Math.abs(seqA(k))).toBeLessThanOrEqual(FAMILY_B);
      expect(Math.abs(seqA(k) - LIMIT_A)).toBeCloseTo(1 / (k + 2), 15);
    }
  });
});

describe('arzela-ascoli: Lipschitz bounds (equicontinuity)', () => {
  it('lipBound(a) = 2|a|, at most 3/2 on the family', () => {
    for (let k = 1; k <= 12; k++) {
      expectCloseTo(lipBound(seqA(k)), 2 * Math.abs(seqA(k)), 1e-15);
      expect(lipBound(seqA(k))).toBeLessThanOrEqual(LIP_UNIFORM);
    }
    expect(lipBound(FAMILY_B)).toBe(LIP_UNIFORM);
  });

  it('the largest Lipschitz constant over k = 1..12 is 1.5, at k = 2', () => {
    let max = 0;
    let argmax = 0;
    for (let k = 1; k <= 12; k++) {
      const l = lipBound(seqA(k));
      if (l > max) {
        max = l;
        argmax = k;
      }
    }
    expectCloseTo(max, 1.5, 1e-15);
    expect(argmax).toBe(2);
  });

  it('sampled secant slopes respect the analytic bound', () => {
    const data = compute({ members: 12 });
    for (const c of data.curves) {
      for (let j = 1; j < data.xs.length; j++) {
        const dx = (data.xs[j] ?? 0) - (data.xs[j - 1] ?? 0);
        const slope = Math.abs((c.samples[j] ?? 0) - (c.samples[j - 1] ?? 0)) / dx;
        expect(slope).toBeLessThanOrEqual(LIP_UNIFORM + 1e-9);
      }
    }
  });
});

describe('arzela-ascoli: sup-norm errors shrink to zero', () => {
  it('supError(k) = 1/(k+2) exactly', () => {
    for (let k = 1; k <= 12; k++) {
      expectCloseTo(supError(k), 1 / (k + 2), 1e-15);
    }
  });

  it('model supErrors are strictly decreasing and < 0.08 at k = 12', () => {
    const data = compute({ members: 12 });
    expect(data.supErrors).toHaveLength(12);
    for (let k = 0; k < 12; k++) {
      expectCloseTo(data.supErrors[k] ?? NaN, 1 / (k + 3), 1e-15);
    }
    for (let k = 1; k < 12; k++) {
      expect(data.supErrors[k] ?? NaN).toBeLessThan(data.supErrors[k - 1] ?? NaN);
    }
    expectCloseTo(data.supErrors[11] ?? NaN, 1 / 14, 1e-15);
    expect(data.supErrors[11] ?? NaN).toBeLessThan(0.08);
  });

  it('curve samples equal a*sin(2x) on the grid, limit equals (1/2)sin(2x)', () => {
    const data = compute({ members: 6 });
    expect(data.limitA).toBe(LIMIT_A);
    for (const c of data.curves) {
      expectCloseTo(c.a, seqA(c.k), 1e-15);
      expectCloseTo(c.lip, lipBound(c.a), 1e-15);
      for (let j = 0; j < data.xs.length; j++) {
        expectCloseTo(c.samples[j] ?? NaN, familyF(c.a, data.xs[j] ?? NaN), 1e-12);
        expectCloseTo(data.limit[j] ?? NaN, familyF(LIMIT_A, data.xs[j] ?? NaN), 1e-12);
      }
    }
  });
});

describe('arzela-ascoli: the x^n contrast', () => {
  it('contrast exponents are 2, 8, 32 with x^n samples on the grid', () => {
    expect([...CONTRAST_NS]).toEqual([2, 8, 32]);
    const data = compute({ members: 6 });
    expect(data.contrast).toHaveLength(3);
    for (let i = 0; i < 3; i++) {
      const n = CONTRAST_NS[i] ?? 0;
      const samples = data.contrast[i] ?? [];
      expect(samples).toHaveLength(GRID_N);
      for (let j = 0; j < data.xs.length; j++) {
        expectCloseTo(samples[j] ?? NaN, Math.pow(data.xs[j] ?? NaN, n), 1e-12);
      }
    }
  });

  it('pairwise sup distances stay large: 0.47247... >= 0.2', () => {
    const data = compute({ members: 6 });
    expectCloseTo(data.contrastPairDist, 0.47247, 1e-3);
    expect(data.contrastPairDist).toBeGreaterThanOrEqual(0.2);
  });

  it('the pointwise limit of x^n jumps: 0 on [0,1), 1 at 1', () => {
    const data = compute({ members: 6 });
    const n = CONTRAST_NS[2] ?? 32;
    const samples = data.contrast[2] ?? [];
    // x = 0.99: x^32 is tiny; x = 1: exactly 1.
    const j99 = Math.round(0.99 * (GRID_N - 1));
    expect(samples[j99] ?? NaN).toBeLessThan(0.75);
    expect(samples[samples.length - 1]).toBe(1);
    expect(n).toBe(32);
  });
});

describe('arzela-ascoli: control clamping', () => {
  it('defaults and clamps match the documented control ranges', () => {
    expect(DEFAULT_MEMBERS).toBe(6);
    expect(MIN_MEMBERS).toBe(2);
    expect(MAX_MEMBERS).toBe(12);
  });

  it('out-of-range members clamp to [2, 12]', () => {
    expect(compute({ members: 1 }).members).toBe(2);
    expect(compute({ members: 100 }).members).toBe(12);
    expect(compute({ members: 12 }).curves).toHaveLength(12);
    expect(compute({ members: 2 }).curves).toHaveLength(2);
  });

  it('missing controls fall back to defaults', () => {
    const data = compute({});
    expect(data.members).toBe(6);
    expect(data.curves).toHaveLength(6);
    expect(data.supErrors).toHaveLength(6);
  });

  it('buildArzela agrees with the model on the raw computation', () => {
    const viaModel = compute({ members: 12 });
    const direct = buildArzela(12);
    expect(direct.members).toBe(viaModel.members);
    expect(direct.supErrors).toEqual(viaModel.supErrors);
    expect(direct.contrastPairDist).toBe(viaModel.contrastPairDist);
  });
});

describe('arzela-ascoli: problems data', () => {
  it('has exactly 3 problems with the required shape', () => {
    expect(arzelaAscoliProblems).toHaveLength(3);
    const ids = arzelaAscoliProblems.map((p) => p.id);
    expect(ids).toEqual(['rel-compact-equicont', 'diagonal-extraction', 'uniform-upgrade']);
    for (const p of arzelaAscoliProblems) {
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
    for (const p of arzelaAscoliProblems) {
      const data = compute(p.preset);
      expect(data.members).toBe(6);
      expectCloseTo(data.supErrors[5] ?? NaN, 1 / 8, 1e-15);
      expectCloseTo(data.contrastPairDist, 0.47247, 1e-3);
    }
  });

  it('proofs keep Korean inside ko strings only, and use \\(...\\) math', () => {
    // The repo convention: Korean ONLY inside ko: strings; en strings may
    // still use Latin-1 punctuation such as em dashes (as other scenes do).
    const hangul = (s: string): boolean => /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(s);
    for (const p of arzelaAscoliProblems) {
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
