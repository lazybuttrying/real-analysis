import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  lpMembership,
  partialSumAbs,
  partialSumSq,
  pKindOf,
  sequenceSpacesModel,
  supDist,
  term,
  unitBallCurve,
  viewKindOf,
  TERMS,
  type SequenceSpacesData,
} from '../src/chapters/limits/models/sequence-spaces';

const compute = (state: ControlState): SequenceSpacesData => sequenceSpacesModel.compute(state) as SequenceSpacesData;

describe('sequence-spaces: control parsing', () => {
  it('recognizes the two views', () => {
    expect(viewKindOf('balls')).toBe('balls');
    expect(viewKindOf('sequence')).toBe('sequence');
    expect(viewKindOf('bogus')).toBe('balls');
    expect(viewKindOf(undefined)).toBe('balls');
  });

  it('recognizes the three norms', () => {
    expect(pKindOf('1')).toBe('1');
    expect(pKindOf('2')).toBe('2');
    expect(pKindOf('inf')).toBe('inf');
    expect(pKindOf('bogus')).toBe('2');
    expect(pKindOf(undefined)).toBe('2');
  });

  it('computes the exact presets from the problems file', () => {
    const p1 = compute({ view: 'sequence', p: '2', alpha: 1 });
    expect(p1.view).toBe('sequence');
    expect(p1.alpha).toBe(1);
    expect(p1.membership).toEqual({ inL1: false, inL2: true, inLInf: true });
    const p2 = compute({ view: 'sequence', p: '1', alpha: 1.5 });
    expect(p2.membership).toEqual({ inL1: true, inL2: true, inLInf: true });
    const p3 = compute({ view: 'balls', p: 'inf', alpha: 1 });
    expect(p3.view).toBe('balls');
    expect(p3.p).toBe('inf');
  });

  it('clamps alpha into [0.2, 2] and applies defaults', () => {
    expect(compute({ view: 'sequence', alpha: 5 }).alpha).toBe(2);
    expect(compute({ view: 'sequence', alpha: -1 }).alpha).toBe(0.2);
    expect(compute({ view: 'sequence', alpha: Number.NaN }).alpha).toBe(1);
    const d = compute({});
    expect(d.view).toBe('balls');
    expect(d.p).toBe('2');
    expect(d.alpha).toBe(1);
  });
});

describe('sequence-spaces: terms and membership', () => {
  it('term(alpha, n) = 1/n^alpha', () => {
    expect(term(1, 1)).toBe(1);
    expect(term(1, 2)).toBe(0.5);
    expect(term(2, 10)).toBeCloseTo(0.01, 12);
    expect(term(0.5, 4)).toBeCloseTo(0.5, 12);
  });

  it('applies the alpha thresholds for l^1 / l^2 / l^infinity', () => {
    // alpha = 1: harmonic sequence, the problem-1 example.
    expect(lpMembership(1)).toEqual({ inL1: false, inL2: true, inLInf: true });
    // alpha = 1.5: summable, the problem-2 preset.
    expect(lpMembership(1.5)).toEqual({ inL1: true, inL2: true, inLInf: true });
    // alpha = 0.3: bounded only.
    expect(lpMembership(0.3)).toEqual({ inL1: false, inL2: false, inLInf: true });
    // alpha = 0.6: square-summable only.
    expect(lpMembership(0.6)).toEqual({ inL1: false, inL2: true, inLInf: true });
    // alpha = 2: everything.
    expect(lpMembership(2)).toEqual({ inL1: true, inL2: true, inLInf: true });
  });
});

describe('sequence-spaces: partial sums (proof numbers)', () => {
  it('uses TERMS = 200 terms', () => {
    expect(TERMS).toBe(200);
  });

  it('partial sum of 1/n over 200 terms is the harmonic number H_200 ~ 5.878', () => {
    const s = partialSumAbs(1, 200);
    expect(s).toBeGreaterThan(5.87);
    expect(s).toBeLessThan(5.89);
  });

  it('partial sum of 1/n^2 over 200 terms approaches pi^2/6 ~ 1.6449', () => {
    const s = partialSumSq(1, 200);
    expect(s).toBeGreaterThan(1.63);
    expect(s).toBeLessThan(1.645);
    // Displayed value in the proof: pi^2/6.
    expect(Math.PI ** 2 / 6).toBeCloseTo(1.644934, 5);
  });

  it('partial sum of 1/n^1.5 converges (problem-2 preset, alpha = 1.5)', () => {
    const s = partialSumAbs(1.5, 200);
    // zeta(1.5) ~ 2.612; 200 terms reach 2.4711 (fat tail).
    expect(s).toBeGreaterThan(2.47);
    expect(s).toBeLessThan(2.48);
  });

  it('for alpha = 1.5 the squared partial sum is bounded by the absolute one', () => {
    // The problem-2 proof step: x_n^2 <= |x_n| once |x_n| < 1.
    for (let n = 2; n <= 200; n++) {
      const t = term(1.5, n);
      expect(t * t).toBeLessThanOrEqual(t);
    }
    expect(partialSumSq(1.5, 200)).toBeLessThanOrEqual(partialSumAbs(1.5, 200));
  });
});

describe('sequence-spaces: unit ball curves', () => {
  it('p = 2 traces the unit circle', () => {
    const pts = unitBallCurve('2', 64);
    expect(pts[0]?.[0]).toBeCloseTo(1, 12);
    expect(pts[0]?.[1]).toBeCloseTo(0, 12);
    for (const [x, y] of pts) {
      expect(x * x + y * y).toBeCloseTo(1, 10);
    }
  });

  it('p = 1 traces the diamond |x| + |y| = 1', () => {
    const pts = unitBallCurve('1', 64);
    for (const [x, y] of pts) {
      expect(Math.abs(x) + Math.abs(y)).toBeCloseTo(1, 10);
    }
    // Cardinal points are hit exactly.
    expect(pts[0]).toEqual([1, 0]);
  });

  it('p = inf traces the square max(|x|, |y|) = 1', () => {
    const pts = unitBallCurve('inf', 64);
    expect(pts.length).toBeGreaterThan(60);
    for (const [x, y] of pts) {
      expect(Math.max(Math.abs(x), Math.abs(y))).toBeCloseTo(1, 10);
    }
  });
});

describe('sequence-spaces: supDist (problem-3 metric checks)', () => {
  const a = [1, 0.5, 0.25];
  const b = [0, 0.5, 1];
  const c = [0.5, 0.25, 0.125];

  it('is 0 on identical sequences and symmetric', () => {
    expect(supDist(a, a)).toBe(0);
    expect(supDist(a, b)).toBeCloseTo(supDist(b, a), 12);
  });

  it('computes the sup of coordinate differences', () => {
    // |1-0|, |0.5-0.5|, |0.25-1| -> max 1.
    expect(supDist(a, b)).toBeCloseTo(1, 12);
    // |1-0.5|, |0.5-0.25|, |0.25-0.125| -> max 0.5.
    expect(supDist(a, c)).toBeCloseTo(0.5, 12);
  });

  it('satisfies the triangle inequality on the samples', () => {
    expect(supDist(a, c)).toBeLessThanOrEqual(supDist(a, b) + supDist(b, c) + 1e-12);
  });

  it('matches the sup(A_n + B_n) <= sup A_n + sup B_n step of the proof', () => {
    // Coordinate-wise: |a_n - c_n| <= |a_n - b_n| + |b_n - c_n|.
    for (let i = 0; i < 3; i++) {
      const left = Math.abs((a[i] ?? 0) - (c[i] ?? 0));
      const right = Math.abs((a[i] ?? 0) - (b[i] ?? 0)) + Math.abs((b[i] ?? 0) - (c[i] ?? 0));
      expect(left).toBeLessThanOrEqual(right + 1e-12);
    }
  });
});

describe('sequence-spaces: every number used in the proofs', () => {
  it('the harmonic sequence is the l^2-not-l^1 witness', () => {
    // Problem 1: x_n = 1/n, i.e. alpha = 1.
    expect(lpMembership(1).inL2).toBe(true);
    expect(lpMembership(1).inL1).toBe(false);
  });

  it('|x_n| -> 0 for x in l^1 (problem-2 first step)', () => {
    // For alpha = 1.5, terms fall below 1 from n = 2 on.
    expect(term(1.5, 1)).toBe(1);
    expect(term(1.5, 2)).toBeLessThan(1);
    for (let n = 2; n <= 50; n++) expect(term(1.5, n)).toBeLessThan(1);
  });

  it('d_infinity well-definedness: sup of a bounded difference sequence is finite', () => {
    const diffs = [0.1, 0.4, 0.25, 0.05];
    expect(supDist([1, 2, 3, 4], [0.9, 1.6, 2.75, 3.95])).toBeCloseTo(Math.max(...diffs), 12);
  });
});
