import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DIRECT_PROOF_P1_INIT,
  DIRECT_PROOF_P1_MAX,
  DIRECT_PROOF_P1_MIN,
  DIRECT_PROOF_P2_INIT,
  DIRECT_PROOF_P2_MAX,
  DIRECT_PROOF_P2_MIN,
  DIRECT_PROOF_Q1_INIT,
  DIRECT_PROOF_Q1_MAX,
  DIRECT_PROOF_Q1_MIN,
  DIRECT_PROOF_Q2_INIT,
  DIRECT_PROOF_Q2_MAX,
  DIRECT_PROOF_Q2_MIN,
  directProofModel,
  intGcd,
  rationalSum,
  type RationalSumData,
} from '../src/chapters/limits/models/directProof';
import { directProofProblems } from '../src/chapters/limits/problems/direct-proof';

const compute = (state: ControlState): RationalSumData => syncCompute(directProofModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['p1', 'q1', 'p2', 'q2']);

describe('direct-proof: the headline case (3, 4, -5, 6)', () => {
  it('num = -2, den = 24, gcd 2, reduced -1/12', () => {
    const d = rationalSum(3, 4, -5, 6);
    expect(d.num).toBe(-2);
    expect(d.den).toBe(24);
    expect(d.gcd).toBe(2);
    expect(d.reducedNum).toBe(-1);
    expect(d.reducedDen).toBe(12);
    expectCloseTo(d.r1, 0.75, 1e-12);
    expectCloseTo(d.r2, -5 / 6, 1e-12);
    expectCloseTo(d.sum, -1 / 12, 1e-12);
    expectCloseTo(d.sum, -0.083333333333, 1e-9);
    expectCloseTo(d.reducedNum / d.reducedDen, d.sum, 1e-12);
  });

  it('the model compute agrees with rationalSum', () => {
    const d = compute({ p1: 3, q1: 4, p2: -5, q2: 6 });
    const e = rationalSum(3, 4, -5, 6);
    expect(d.num).toBe(e.num);
    expect(d.den).toBe(e.den);
    expectCloseTo(d.sum, e.sum, 1e-12);
  });
});

describe('direct-proof: the product case in problem 2', () => {
  it('(3/4) * (-5/6) = -15/24', () => {
    const d = rationalSum(3, 4, -5, 6);
    const num = 3 * -5;
    const den = 4 * 6;
    const g = intGcd(Math.abs(num), den);
    expect(num).toBe(-15);
    expect(den).toBe(24);
    expect(g).toBe(3);
    expectCloseTo(num / den, -5 / 8, 1e-12);
    expect(d.r1 * d.r2).toBeCloseTo(-5 / 8, 12);
  });
});

describe('direct-proof: reduction and gcd edge cases', () => {
  it('intGcd computes the gcd', () => {
    expect(intGcd(2, 24)).toBe(2);
    expect(intGcd(15, 24)).toBe(3);
    expect(intGcd(0, 5)).toBe(5);
    expect(intGcd(7, 13)).toBe(1);
  });

  it('zero numerator reduces to 0/1', () => {
    const d = rationalSum(1, 2, -1, 2);
    expect(d.num).toBe(0);
    expect(d.den).toBe(4);
    expect(d.gcd).toBe(4);
    expect(d.reducedNum).toBe(0);
    expect(d.reducedDen).toBe(1);
    expectCloseTo(d.sum, 0, 1e-12);
  });

  it('already-reduced fractions are unchanged', () => {
    const d = rationalSum(1, 3, 1, 5);
    expect(d.num).toBe(8);
    expect(d.den).toBe(15);
    expect(d.reducedNum).toBe(8);
    expect(d.reducedDen).toBe(15);
  });

  it('the denominator is never 0 within the control ranges', () => {
    for (const q1 of [1, 2, 9]) {
      for (const q2 of [1, 5, 9]) {
        const d = rationalSum(-9, q1, 9, q2);
        expect(d.den).not.toBe(0);
      }
    }
  });
});

describe('direct-proof: control clamping and ranges', () => {
  it('out-of-range inputs are clamped to the slider ranges', () => {
    const d = compute({ p1: 99, q1: 0, p2: -100, q2: 100 });
    expect(d.p1).toBe(DIRECT_PROOF_P1_MAX);
    expect(d.q1).toBe(DIRECT_PROOF_Q1_MIN);
    expect(d.p2).toBe(DIRECT_PROOF_P2_MIN);
    expect(d.q2).toBe(DIRECT_PROOF_Q2_MAX);
  });

  it('non-finite inputs fall back to the slider inits', () => {
    const d = compute({ p1: NaN, q1: Infinity, p2: 'x', q2: NaN });
    expect(d.p1).toBe(DIRECT_PROOF_P1_INIT);
    expect(d.q1).toBe(DIRECT_PROOF_Q1_INIT);
    expect(d.p2).toBe(DIRECT_PROOF_P2_INIT);
    expect(d.q2).toBe(DIRECT_PROOF_Q2_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(DIRECT_PROOF_P1_MIN).toBe(-9);
    expect(DIRECT_PROOF_P1_MAX).toBe(9);
    expect(DIRECT_PROOF_Q1_MIN).toBe(1);
    expect(DIRECT_PROOF_Q1_MAX).toBe(9);
    expect(DIRECT_PROOF_P2_MIN).toBe(-9);
    expect(DIRECT_PROOF_P2_MAX).toBe(9);
    expect(DIRECT_PROOF_Q2_MIN).toBe(1);
    expect(DIRECT_PROOF_Q2_MAX).toBe(9);
  });
});

describe('direct-proof: problem presets use only declared control keys', () => {
  it('every preset key is in {p1, q1, p2, q2} and in range', () => {
    expect(directProofProblems).toHaveLength(3);
    for (const problem of directProofProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const s = problem.preset;
      expect(s['p1']).toBeGreaterThanOrEqual(DIRECT_PROOF_P1_MIN);
      expect(s['p1']).toBeLessThanOrEqual(DIRECT_PROOF_P1_MAX);
      expect(s['q1']).toBeGreaterThanOrEqual(DIRECT_PROOF_Q1_MIN);
      expect(s['q1']).toBeLessThanOrEqual(DIRECT_PROOF_Q1_MAX);
      expect(s['p2']).toBeGreaterThanOrEqual(DIRECT_PROOF_P2_MIN);
      expect(s['p2']).toBeLessThanOrEqual(DIRECT_PROOF_P2_MAX);
      expect(s['q2']).toBeGreaterThanOrEqual(DIRECT_PROOF_Q2_MIN);
      expect(s['q2']).toBeLessThanOrEqual(DIRECT_PROOF_Q2_MAX);
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = directProofProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
