import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  cantorFunction,
  cantorFunctionModel,
  cantorIntervals,
  cantorTotalLength,
  clampStage,
  SAMPLE_POINTS,
  STAGE_INIT,
  STAGE_MAX,
  STAGE_MIN,
  type CantorFunctionData,
} from '../src/chapters/limits/models/cantorFunction';

/**
 * Independent checks for the Cantor function scene.
 *
 * Analytic reference values (derived from the ternary-expansion definition,
 * not from the implementation):
 *   f(0) = 0, f(1) = 1 (1 = 0.222..._3);
 *   f(1/3) = f(2/3) = 1/2 (first ternary digit 1, resp. digits 2,0,0,...);
 *   f(1/4) = 1/3 because 1/4 = 0.020202..._3 has no digit 1, so
 *     f(1/4) = 0.010101..._2 = (1/4) / (1 - 1/4) = 1/3;
 *   f == 1/2 on (1/3, 2/3), f == 1/4 on (1/9, 2/9);
 *   C_3 has 8 intervals of length 1/27, total (2/3)^3 = 8/27.
 */

/** Deterministic PRNG so the random-grid monotonicity test is reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('cantorFunction', () => {
  it('f(0) = 0 and f(1) = 1', () => {
    expect(cantorFunction(0)).toBe(0);
    expect(cantorFunction(1)).toBe(1);
  });

  it('f(1/3) = f(2/3) = 1/2', () => {
    expect(cantorFunction(1 / 3)).toBeCloseTo(0.5, 12);
    expect(cantorFunction(2 / 3)).toBeCloseTo(0.5, 12);
  });

  it('f(1/4) = 1/3 (ternary 0.0202... has no 1, so binary 0.0101... = 1/3)', () => {
    expect(cantorFunction(1 / 4)).toBeCloseTo(1 / 3, 9);
  });

  it('is constant 1/2 on the removed middle third (1/3, 2/3)', () => {
    for (let i = 0; i <= 10; i++) {
      const x = 0.34 + (0.32 * i) / 10;
      expect(cantorFunction(x)).toBeCloseTo(0.5, 12);
    }
  });

  it('is constant 1/4 on the removed interval (1/9, 2/9)', () => {
    for (let i = 0; i <= 8; i++) {
      const x = 1 / 9 + (1 / 9) * (0.1 + (0.8 * i) / 8);
      expect(cantorFunction(x)).toBeCloseTo(0.25, 12);
    }
  });

  it('stays inside [0, 1] and is nondecreasing on a random grid', () => {
    const rand = mulberry32(12345);
    const xs: number[] = [];
    for (let i = 0; i < 500; i++) xs.push(rand());
    xs.sort((a, b) => a - b);
    let prev = -1;
    for (const x of xs) {
      const fx = cantorFunction(x);
      expect(fx).toBeGreaterThanOrEqual(0);
      expect(fx).toBeLessThanOrEqual(1);
      expect(fx).toBeGreaterThanOrEqual(prev - 1e-12);
      prev = fx;
    }
    // Pairwise check as well: x < y implies f(x) <= f(y).
    const r2 = mulberry32(999);
    for (let i = 0; i < 500; i++) {
      const a = r2();
      const b = r2();
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      expect(cantorFunction(hi)).toBeGreaterThanOrEqual(cantorFunction(lo) - 1e-12);
    }
  });

  it('handles out-of-range and non-finite input by clamping', () => {
    expect(cantorFunction(-0.5)).toBe(0);
    expect(cantorFunction(1.5)).toBe(1);
    expect(cantorFunction(NaN)).toBe(0);
    expect(cantorFunction(Infinity)).toBe(0);
  });
});

describe('clampStage', () => {
  it('clamps to [0, 7], floors, and defaults to init on garbage', () => {
    expect(clampStage(STAGE_MIN)).toBe(0);
    expect(clampStage(STAGE_MAX)).toBe(7);
    expect(clampStage(-5)).toBe(0);
    expect(clampStage(100)).toBe(7);
    expect(clampStage(2.9)).toBe(2);
    expect(clampStage(NaN)).toBe(STAGE_INIT);
    expect(clampStage(undefined)).toBe(STAGE_INIT);
    expect(STAGE_INIT).toBe(4);
  });
});

describe('cantorIntervals', () => {
  it('stage 0 is the single interval [0, 1]', () => {
    const iv = cantorIntervals(0);
    expect(iv).toHaveLength(1);
    expect(iv[0]).toEqual({ l: 0, r: 1 });
  });

  it('stage 3 has 8 intervals of length 1/27, total (2/3)^3 = 8/27', () => {
    const iv = cantorIntervals(3);
    expect(iv).toHaveLength(8);
    const third = 1 / 27;
    let total = 0;
    let prevR = -1;
    for (const { l, r } of iv) {
      expect(r - l).toBeCloseTo(third, 12);
      expect(l).toBeGreaterThanOrEqual(prevR); // sorted, non-overlapping
      total += r - l;
      prevR = r;
    }
    expect(total).toBeCloseTo(8 / 27, 12);
    expect(iv[0]).toEqual({ l: 0, r: third });
    expect(iv[7]?.l).toBeCloseTo(26 / 27, 12);
    expect(iv[7]?.r).toBeCloseTo(1, 12);
  });

  it('clamps out-of-range stages', () => {
    expect(cantorIntervals(-2)).toHaveLength(1);
    expect(cantorIntervals(100)).toHaveLength(128); // 2^7
  });

  it('total length is (2/3)^stage', () => {
    expect(cantorTotalLength(0)).toBe(1);
    expect(cantorTotalLength(3)).toBeCloseTo(8 / 27, 12);
    expect(cantorTotalLength(7)).toBeCloseTo(Math.pow(2 / 3, 7), 12);
  });
});

describe('cantorFunctionModel', () => {
  it('computes the staircase samples consistently with cantorFunction', () => {
    const data: CantorFunctionData = cantorFunctionModel.compute({ stage: 3 } as ControlState) as CantorFunctionData;
    expect(data.stage).toBe(3);
    expect(data.intervals).toHaveLength(8);
    expect(data.totalLength).toBeCloseTo(8 / 27, 12);
    expect(data.xs).toHaveLength(SAMPLE_POINTS);
    expect(data.fVals).toHaveLength(SAMPLE_POINTS);
    expect(data.xs[0]).toBe(0);
    expect(data.xs[SAMPLE_POINTS - 1]).toBe(1);
    expect(data.fVals[0]).toBe(0);
    expect(data.fVals[SAMPLE_POINTS - 1]).toBe(1);
    for (let i = 0; i < SAMPLE_POINTS; i += 97) {
      expect(data.fVals[i]).toBe(cantorFunction(data.xs[i] ?? 0));
    }
  });

  it('defaults to the init stage on missing state', () => {
    const data = cantorFunctionModel.compute({} as ControlState) as CantorFunctionData;
    expect(data.stage).toBe(STAGE_INIT);
    expect(data.intervals).toHaveLength(16);
  });

  it('stage 7 yields 128 intervals', () => {
    const data = cantorFunctionModel.compute({ stage: 7 } as ControlState) as CantorFunctionData;
    expect(data.intervals).toHaveLength(128);
    expect(data.totalLength).toBeCloseTo(Math.pow(2 / 3, 7), 12);
  });
});
