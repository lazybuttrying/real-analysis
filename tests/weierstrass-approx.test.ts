import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  bernstein,
  bernsteinBasis,
  bernsteinData,
  bernsteinFnKey,
  bernsteinModel,
  type BernsteinData,
} from '../src/chapters/limits/models/weierstrass-approx';

const compute = (state: ControlState): BernsteinData =>
  bernsteinModel.compute(state) as BernsteinData;

describe('weierstrass-approx: exact reproduction of degree <= 1', () => {
  it('B_8(1)(0.3) = 1 to machine precision', () => {
    expect(bernstein('one', 8, 0.3)).toBeCloseTo(1, 12);
  });

  it('B_8(id)(0.3) = 0.3 to machine precision', () => {
    expect(bernstein('id', 8, 0.3)).toBeCloseTo(0.3, 12);
  });

  it('basis sums to 1 at interior points', () => {
    let sum = 0;
    for (let k = 0; k <= 8; k++) sum += bernsteinBasis(k, 8, 0.37);
    expect(sum).toBeCloseTo(1, 12);
  });

  it('basis is exact at the endpoints', () => {
    for (let k = 0; k <= 8; k++) {
      expect(bernsteinBasis(k, 8, 0)).toBe(k === 0 ? 1 : 0);
      expect(bernsteinBasis(k, 8, 1)).toBe(k === 8 ? 1 : 0);
    }
  });

  it('B_1(abs)(0.5) = 0.5: b_0,1(0.5) = b_1,1(0.5) = 0.5 with f(0) = f(1) = 0.5', () => {
    expect(bernsteinBasis(0, 1, 0.5)).toBe(0.5);
    expect(bernsteinBasis(1, 1, 0.5)).toBe(0.5);
    expect(bernstein('abs', 1, 0.5)).toBeCloseTo(0.5, 12);
  });
});

describe('weierstrass-approx: uniform convergence on the kink', () => {
  it('max error for abs decreases: err(5) > err(30)', () => {
    const err5 = bernsteinData('abs', 5).maxErr;
    const err30 = bernsteinData('abs', 30).maxErr;
    expect(err5).toBe(0.1875);
    expect(err30).toBeCloseTo(0.072232, 6);
    expect(err5).toBeGreaterThan(err30);
  });

  it('samples span [0,1] with 401 points and match f/B_n pointwise', () => {
    const data = bernsteinData('square', 4);
    expect(data.samples).toHaveLength(401);
    expect(data.samples[0]?.x).toBe(0);
    expect(data.samples[400]?.x).toBe(1);
    for (const s of data.samples) {
      expect(s.y).toBeCloseTo(s.x * s.x, 12);
      expect(s.p).toBeCloseTo(bernstein('square', 4, s.x), 12);
    }
  });
});

describe('weierstrass-approx: model compute clamps state', () => {
  it('returns finite positive maxErr for abs at n = 10', () => {
    const data = compute({ fn: 'abs', n: 10 });
    expect(data.key).toBe('abs');
    expect(data.n).toBe(10);
    expect(Number.isFinite(data.maxErr)).toBe(true);
    expect(data.maxErr).toBeGreaterThan(0);
  });

  it('clamps n into [1, 60] and defaults fn to one', () => {
    expect(compute({ fn: 'abs', n: 99 }).n).toBe(60);
    expect(compute({ fn: 'abs', n: 0 }).n).toBe(1);
    expect(compute({ fn: 'abs', n: -3 }).n).toBe(1);
    expect(compute({ fn: 'abs', n: 10.7 }).n).toBe(11);
    expect(compute({}).n).toBe(10);
    expect(compute({}).key).toBe('one');
    expect(bernsteinFnKey('bogus')).toBe('one');
    expect(bernsteinFnKey('sin')).toBe('sin');
  });
});
