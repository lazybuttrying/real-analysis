import { describe, expect, it } from 'vitest';
import {
  evaluateFn,
  functionKindOf,
  maxDelta,
  maxDeltaLinear,
  maxDeltaSquare,
  uniformContinuityData,
  uniformContinuityModel,
} from '../src/chapters/limits/models/uniform-continuity';

describe('uniform continuity model', () => {
  it('maxDeltaSquare(2, 0.5) = sqrt(4.5) - 2', () => {
    const d = maxDeltaSquare(2, 0.5);
    expect(d).toBeCloseTo(Math.sqrt(4.5) - 2, 12);
    expect(d).toBeCloseTo(0.12132, 5);
  });

  it('maxDeltaSquare(0, eps) = sqrt(eps)', () => {
    expect(maxDeltaSquare(0, 0.5)).toBeCloseTo(Math.sqrt(0.5), 12);
    expect(maxDeltaSquare(0, 2)).toBeCloseTo(Math.sqrt(2), 12);
  });

  it('maxDeltaLinear(0.5) = 0.25, constant in x', () => {
    expect(maxDeltaLinear(0.5)).toBe(0.25);
    expect(maxDeltaLinear(2)).toBe(1);
  });

  it('the delta-boundary identity delta (2|x| + delta) = eps holds at the computed delta', () => {
    const cases: ReadonlyArray<readonly [number, number]> = [
      [0, 0.5],
      [0.5, 0.5],
      [1, 0.2],
      [2, 0.5],
      [3, 1],
      [4, 2],
      [0, 2],
    ];
    for (const [x, eps] of cases) {
      const d = maxDeltaSquare(x, eps);
      expect(d * (2 * Math.abs(x) + d)).toBeCloseTo(eps, 10);
    }
  });

  it('the textbook counterexample numbers check out (n = 3, delta = 0.5)', () => {
    const n = 3;
    const delta = 0.5;
    const x = n;
    const y = n + delta / 2;
    expect(Math.abs(x - y)).toBeCloseTo(0.25, 12);
    expect(Math.abs(x * x - y * y)).toBeCloseTo(1.5625, 12);
    expect(Math.abs(x * x - y * y)).toBeGreaterThan(1);
  });

  it('delta shrinks monotonically as |x| grows for the square', () => {
    const eps = 0.5;
    let prev = Infinity;
    for (let x = 0; x <= 4.001; x += 0.25) {
      const d = maxDeltaSquare(x, eps);
      expect(d).toBeLessThanOrEqual(prev);
      prev = d;
    }
    expect(maxDeltaSquare(0, eps)).toBeGreaterThan(maxDeltaSquare(4, eps));
    expect(maxDeltaSquare(4, eps)).toBeCloseTo(Math.sqrt(16.5) - 4, 12);
  });

  it('key mappers accept the meta.ts select option values', () => {
    expect(functionKindOf('square')).toBe('square');
    expect(functionKindOf('linear')).toBe('linear');
    expect(functionKindOf('unknown')).toBe('square');
    expect(evaluateFn('square', 2)).toBe(4);
    expect(evaluateFn('linear', 2)).toBe(4);
    expect(maxDelta('square', 2, 0.5)).toBeCloseTo(0.12132, 5);
    expect(maxDelta('linear', 2, 0.5)).toBe(0.25);
  });

  it('the model computes delta and f(x) from the control state', async () => {
    const data = await uniformContinuityModel.compute({ fn: 'square', x: 2, eps: 0.5 });
    expect(data.fn).toBe('square');
    expect(data.delta).toBeCloseTo(0.12132, 5);
    expect(data.fx).toBe(4);
    const linear = await uniformContinuityModel.compute({ fn: 'linear', x: 2, eps: 0.5 });
    expect(linear.fn).toBe('linear');
    expect(linear.delta).toBe(0.25);
    expect(linear.fx).toBe(4);
  });

  it('uniformContinuityData packages kind, x, eps, delta, fx', () => {
    const data = uniformContinuityData('square', 0.5, 0.5);
    expect(data).toEqual({
      fn: 'square',
      x: 0.5,
      eps: 0.5,
      delta: maxDeltaSquare(0.5, 0.5),
      fx: 0.25,
    });
  });
});
