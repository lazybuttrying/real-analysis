import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  convexData,
  convexFn,
  convexFnKey,
  convexModel,
  chordY,
  type ConvexData,
  type ConvexFnKey,
} from '../src/chapters/calculus/models/convex';

const compute = (state: ControlState): ConvexData => syncCompute(convexModel, state);

const KEYS: readonly ConvexFnKey[] = ['square', 'exp', 'abs'];
const INTERVALS: ReadonlyArray<readonly [number, number]> = [
  [-1, 1],
  [0, 2],
  [-2, -0.5],
  [-1.5, 0.7],
  [-0.3, 1.2],
  [0.4, 1.9],
  [-1.9, -1.8],
];

describe('convex: chord floats above the graph (maxGap >= 0)', () => {
  it('has nonnegative max chord-graph gap for every key and interval', () => {
    for (const key of KEYS) {
      for (const [a, b] of INTERVALS) {
        const data = convexData(key, a, b);
        expect(data.maxGap).toBeGreaterThanOrEqual(-1e-12);
      }
    }
  });

  it('chord passes exactly through the endpoints', () => {
    for (const key of KEYS) {
      for (const [a, b] of INTERVALS) {
        expect(chordY(key, a, b, a)).toBe(convexFn(key, a));
        expect(chordY(key, a, b, b)).toBeCloseTo(convexFn(key, b), 15);
      }
    }
  });

  it('maxGap recomputed from the chord points matches the model', () => {
    for (const key of KEYS) {
      for (const [a, b] of INTERVALS) {
        const data = convexData(key, a, b);
        let expected = 0;
        for (const p of data.chord) {
          const gap = chordY(key, data.a, data.b, p.x) - p.y;
          if (gap > expected) expected = gap;
        }
        expect(data.maxGap).toBeCloseTo(expected, 12);
      }
    }
  });
});

describe('convex: x^2 gap is exactly 1 on [-1, 1], attained at the midpoint', () => {
  it('maxGap is 1 to 1e-9', () => {
    expect(convexData('square', -1, 1).maxGap).toBeCloseTo(1, 9);
  });

  it('the midpoint x = 0 is sampled and attains the gap', () => {
    const data = convexData('square', -1, 1);
    const mid = data.chord.find((p) => p.x === 0);
    expect(mid).toBeDefined();
    expect(chordY('square', -1, 1, 0) - convexFn('square', 0)).toBeCloseTo(
      data.maxGap,
      12,
    );
  });

  it('compute({fn: square, a: -1, b: 1}).maxGap is 1', () => {
    expect(compute({ fn: 'square', a: -1, b: 1 }).maxGap).toBeCloseTo(1, 9);
  });

  it('abs on a same-sign interval has zero gap (chord lies on the graph)', () => {
    const data = convexData('abs', 0.5, 1.5);
    expect(data.maxGap).toBeLessThan(1e-12);
  });
});

describe('convex: model clamps, swaps, and widens degenerate intervals', () => {
  it('swaps a > b', () => {
    const d = compute({ fn: 'square', a: 1, b: -1 });
    expect(d.a).toBe(-1);
    expect(d.b).toBe(1);
    expect(d.maxGap).toBeCloseTo(1, 9);
  });

  it('clamps a and b into [-2, 2]', () => {
    const d = compute({ fn: 'square', a: -5, b: 5 });
    expect(d.a).toBe(-2);
    expect(d.b).toBe(2);
    expect(d.samples).toHaveLength(400);
  });

  it('widens a degenerate interval by 0.2', () => {
    const d = compute({ fn: 'square', a: 0.5, b: 0.5 });
    expect(d.a).toBe(0.5);
    expect(d.b).toBeCloseTo(0.7, 12);
    expect(d.maxGap).toBeGreaterThanOrEqual(-1e-12);
  });

  it('handles the a = b = 2 edge without collapsing', () => {
    const d = compute({ fn: 'square', a: 2, b: 2 });
    expect(d.b).toBeGreaterThan(d.a);
    expect(d.b - d.a).toBeCloseTo(0.2, 12);
    expect(d.maxGap).toBeGreaterThanOrEqual(-1e-12);
  });

  it('defaults fn to square and (a, b) to (-1, 1)', () => {
    expect(convexFnKey('exp')).toBe('exp');
    expect(convexFnKey('abs')).toBe('abs');
    expect(convexFnKey('square')).toBe('square');
    expect(convexFnKey('bogus')).toBe('square');
    expect(convexFnKey(undefined)).toBe('square');
    const d = compute({});
    expect(d.key).toBe('square');
    expect(d.a).toBe(-1);
    expect(d.b).toBe(1);
  });

  it('builds 400 samples on [-2.5, 2.5] and the chord on [a, b]', () => {
    const d = convexData('exp', 0, 2);
    expect(d.samples).toHaveLength(400);
    expect(d.samples[0]?.x).toBeCloseTo(-2.5, 12);
    expect(d.samples[399]?.x).toBeCloseTo(2.5, 12);
    expect(d.samples[0]?.y).toBeCloseTo(Math.exp(-2.5), 12);
    expect(d.samples[399]?.y).toBeCloseTo(Math.exp(2.5), 12);
    expect(d.chord.length).toBeGreaterThanOrEqual(200);
    expect(d.chord[0]?.x).toBe(0);
    expect(d.chord[d.chord.length - 1]?.x).toBe(2);
  });
});
