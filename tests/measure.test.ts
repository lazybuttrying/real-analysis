import { describe, expect, it } from 'vitest';
import {
  coverTotal,
  measureData,
  measureModel,
  rationalsUpTo,
  singletonCover,
} from '../src/chapters/calculus/models/measure';

describe('measure model', () => {
  it('rationalsUpTo(5) enumerates by denominator in lowest terms', () => {
    expect(rationalsUpTo(5)).toEqual([0, 1, 1 / 2, 1 / 3, 2 / 3]);
  });

  it('rationalsUpTo values are distinct and lie in [0,1]', () => {
    const rs = rationalsUpTo(64);
    expect(rs).toHaveLength(64);
    expect(new Set(rs).size).toBe(64);
    for (const r of rs) {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    }
  });

  it('coverTotal(0.1, 16) = 0.1 * (1 - 2^-16) < 0.1', () => {
    const total = coverTotal(0.1, 16);
    expect(total).toBeCloseTo(0.0999984741, 10);
    expect(total).toBeLessThan(0.1);
  });

  it('singletonCover(0.1) centers a width-0.1 interval at 0.5', () => {
    expect(singletonCover(0.1)).toEqual({ c: 0.5, w: 0.1 });
  });

  it('rationals: every cover interval contains its rational', () => {
    const data = measureData('rationals', 0.2, 32);
    const rs = rationalsUpTo(32);
    expect(data.covers).toHaveLength(32);
    data.covers.forEach((cover, i) => {
      const r = rs[i] as number;
      expect(Math.abs(cover.c - r)).toBeLessThanOrEqual(cover.w / 2);
      expect(cover.w).toBeCloseTo(0.2 / Math.pow(2, i + 1), 12);
    });
  });

  it('rationals: totals stay below eps', () => {
    for (const [eps, K] of [
      [0.01, 1],
      [0.1, 16],
      [0.5, 32],
    ] as const) {
      const data = measureData('rationals', eps, K);
      expect(data.totalLength).toBeLessThan(eps);
      expect(data.totalLength).toBeCloseTo(coverTotal(eps, K), 12);
      expect(data.outerBound).toBeCloseTo(data.totalLength, 12);
    }
  });

  it('rationals: at K=64 float64 rounds the total up to eps (never above)', () => {
    const data = measureData('rationals', 0.5, 64);
    expect(data.totalLength).toBeLessThanOrEqual(0.5);
    expect(data.outerBound).toBeLessThanOrEqual(0.5);
    expect(data.covers).toHaveLength(64);
  });

  it('singleton: total equals eps; interval: total 1 and outer bound 1', () => {
    const s = measureData('singleton', 0.1, 16);
    expect(s.totalLength).toBe(0.1);
    expect(s.outerBound).toBe(0.1);
    expect(s.covers).toHaveLength(1);
    const iv = measureData('interval', 0.1, 16);
    expect(iv.totalLength).toBe(1);
    expect(iv.outerBound).toBe(1);
  });

  it('model computes from control state with fallbacks', async () => {
    const data = await measureModel.compute({ target: 'rationals', eps: 0.1, K: 16 });
    expect(data.target).toBe('rationals');
    expect(data.eps).toBe(0.1);
    expect(data.K).toBe(16);
    expect(data.totalLength).toBeLessThan(0.1);
    const fallback = await measureModel.compute({});
    expect(fallback.target).toBe('singleton');
    expect(fallback.eps).toBe(0.1);
  });
});
