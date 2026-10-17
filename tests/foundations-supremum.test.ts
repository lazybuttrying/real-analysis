import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  supremumData,
  supremumModel,
  supremumPoints,
  BOUND_INIT,
  BOUND_MAX,
  BOUND_MIN,
  type SupremumData,
} from '../src/chapters/limits/models/supremum';

const compute = (state: ControlState): SupremumData => syncCompute(supremumModel, state);

describe('supremum: S = {1 - 1/n}', () => {
  it('has sup 1 and 40 points approaching from below', () => {
    const { sup, points } = supremumPoints('one-minus');
    expect(sup).toBe(1);
    expect(points).toHaveLength(40);
    const first = points[0] === undefined ? Number.NaN : points[0];
    const last = points[39] === undefined ? Number.NaN : points[39];
    // Last point: 1 - 1/40 = 0.975.
    expect(last).toBeCloseTo(0.975, 12);
    // Every point is below the supremum, and the sequence is strictly increasing.
    expect(points.every((p) => p < 1)).toBe(true);
    expect(points.every((p, i) => i === 0 || p > (points[i - 1] ?? Number.NaN))).toBe(true);
    // First point is 1 - 1 = 0.
    expect(first).toBe(0);
  });

  it('sup data: bound 1.2 gives gap 0.2 and is an upper bound', () => {
    const data = supremumData('one-minus', 1.2);
    expect(data.sup).toBe(1);
    expect(data.gap).toBeCloseTo(0.2, 12);
    expect(data.isUpper).toBe(true);
  });

  it('a bound below the sup is not an upper bound', () => {
    const data = supremumData('one-minus', 0.9);
    expect(data.isUpper).toBe(false);
    expect(data.gap).toBeCloseTo(-0.1, 12);
  });
});

describe('supremum: rational truncations of sqrt(2)', () => {
  it('has sup sqrt(2) and 7 truncations, all with x^2 < 2', () => {
    const { sup, points } = supremumPoints('sqrt2');
    expect(sup).toBe(Math.SQRT2);
    expect(points).toEqual([1, 1.4, 1.41, 1.414, 1.4142, 1.41421, 1.414213]);
    expect(points.every((p) => p * p < 2)).toBe(true);
    // The last truncation approaches sqrt(2).
    const last = points.at(-1) ?? Number.NaN;
    expectCloseTo(last, Math.SQRT2, 1e-6);
    // Every truncation is below the supremum.
    expect(points.every((p) => p < Math.SQRT2)).toBe(true);
  });

  it('the gap shrinks as truncations refine', () => {
    const { points } = supremumPoints('sqrt2');
    const gaps = points.map((p) => Math.SQRT2 - p);
    expect(gaps.every((g, i) => i === 0 || g < (gaps[i - 1] ?? Number.POSITIVE_INFINITY))).toBe(true);
  });
});

describe('supremum: compute() accepts every problem preset', () => {
  it('sup-one-minus preset {set: one-minus, bound: 1.2}', () => {
    const data = compute({ set: 'one-minus', bound: 1.2 });
    expect(data.set).toBe('one-minus');
    expect(data.sup).toBe(1);
    expect(data.bound).toBe(1.2);
    expect(data.gap).toBeCloseTo(0.2, 12);
    expect(data.isUpper).toBe(true);
    expect(data.points).toHaveLength(40);
  });

  it('sup-sum preset {set: one-minus, bound: 1.5}', () => {
    const data = compute({ set: 'one-minus', bound: 1.5 });
    expect(data.gap).toBeCloseTo(0.5, 12);
    expect(data.isUpper).toBe(true);
  });

  it('sqrt2-exists preset {set: sqrt2, bound: 1.5}', () => {
    const data = compute({ set: 'sqrt2', bound: 1.5 });
    expect(data.set).toBe('sqrt2');
    expect(data.sup).toBe(Math.SQRT2);
    expect(data.bound).toBe(1.5);
    expect(data.gap).toBeCloseTo(1.5 - Math.SQRT2, 12);
    expect(data.isUpper).toBe(true);
    expect(data.points).toHaveLength(7);
  });

  it('clamps the bound to [0.5, 2] and defaults sensibly', () => {
    expect(compute({ set: 'one-minus', bound: 5 }).bound).toBe(BOUND_MAX);
    expect(compute({ set: 'one-minus', bound: 0 }).bound).toBe(BOUND_MIN);
    expect(compute({ set: 'one-minus', bound: Number.NaN }).bound).toBe(BOUND_INIT);
  });

  it('unknown set falls back to one-minus', () => {
    const data = compute({ set: '??', bound: 1.4 });
    expect(data.set).toBe('one-minus');
    expect(data.sup).toBe(1);
  });

  it('exported raw data function matches compute()', () => {
    expect(supremumData('sqrt2', 1.5)).toEqual(compute({ set: 'sqrt2', bound: 1.5 }));
  });
});
