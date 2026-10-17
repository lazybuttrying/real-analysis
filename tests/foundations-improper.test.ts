import { describe, expect, it } from 'vitest';
import { expectCloseTo } from './helpers';
import { improperArea, improperData, improperModel } from '../src/chapters/series/models/improper';

function at<T>(xs: readonly T[], i: number): T {
  const v = xs[i];
  if (v === undefined) throw new Error(`index ${i} out of range`);
  return v;
}

describe('improper model', () => {
  it('p = 2, R = 20: area 1 - 1/20 = 0.95, limit 1', () => {
    const data = improperData('tail', 2, 20, 0.01);
    // Proof figure: integral_1^20 dx/x^2 = 0.95
    expect(data.area).toBeCloseTo(0.95, 12);
    expect(data.limit).toBeCloseTo(1, 12);
    expect(data.converges).toBe(true);
    expect(data.samples).toHaveLength(240);
    expect(at(data.samples, 0).x).toBe(1);
    expect(at(data.samples, 239).x).toBe(20);
  });

  it('p = 1, R = 50: area ln 50 ≈ 3.912, diverges', () => {
    const { area, limit, converges } = improperArea('tail', 1, 50, 0.01);
    // Proof figure: integral_1^50 dx/x = ln 50 ≈ 3.912
    expect(area).toBeCloseTo(Math.log(50), 12);
    expectCloseTo(area, 3.912, 5e-4);
    expect(converges).toBe(false);
    expect(limit).toBeNull();
  });

  it('p < 1 tail still diverges: (R^{1-p} - 1)/(1-p)', () => {
    const { area, limit, converges } = improperArea('tail', 0.5, 16, 0.01);
    expect(area).toBeCloseTo((Math.pow(16, 0.5) - 1) / 0.5, 12);
    expect(converges).toBe(false);
    expect(limit).toBeNull();
  });

  it('singular p = 1/2, eps = 0.01: area 2 - 2√0.01 = 1.8, limit 2', () => {
    const data = improperData('singular', 0.5, 10, 0.01);
    // Proof figure: integral_0.01^1 x^{-1/2} dx = 1.8
    expect(data.area).toBeCloseTo(1.8, 12);
    expect(data.limit).toBeCloseTo(2, 12);
    expect(data.converges).toBe(true);
    expect(data.samples).toHaveLength(240);
    expect(at(data.samples, 0).x).toBe(0.01);
    expect(at(data.samples, 239).x).toBe(1);
  });

  it('singular p >= 1 diverges', () => {
    const atOne = improperArea('singular', 1, 10, 0.01);
    expect(atOne.area).toBeCloseTo(-Math.log(0.01), 12);
    expect(atOne.converges).toBe(false);
    expect(atOne.limit).toBeNull();
    const aboveOne = improperArea('singular', 1.5, 10, 0.01);
    expect(aboveOne.converges).toBe(false);
    expect(aboveOne.limit).toBeNull();
  });

  it('compute() accepts every problem preset', () => {
    const p1 = improperModel.compute({ kind: 'tail', p: 2, R: 20, eps: 0.01 });
    const d1 = p1 as ReturnType<typeof improperData>;
    expect(d1.kind).toBe('tail');
    expect(d1.area).toBeCloseTo(0.95, 12);

    const p2 = improperModel.compute({ kind: 'tail', p: 1, R: 50, eps: 0.01 });
    const d2 = p2 as ReturnType<typeof improperData>;
    expect(d2.converges).toBe(false);
    expect(d2.area).toBeCloseTo(Math.log(50), 12);

    const p3 = improperModel.compute({ kind: 'singular', p: 0.5, R: 10, eps: 0.01 });
    const d3 = p3 as ReturnType<typeof improperData>;
    expect(d3.kind).toBe('singular');
    expect(d3.area).toBeCloseTo(1.8, 12);
    expect(d3.limit).toBeCloseTo(2, 12);
  });

  it('compute() clamps p, R, eps and defaults the kind', () => {
    const d = improperModel.compute({ kind: 'sideways', p: 99, R: 500, eps: -3 }) as ReturnType<
      typeof improperData
    >;
    expect(d.kind).toBe('tail');
    expect(d.p).toBe(2);
    expect(d.R).toBe(50);
    expect(d.eps).toBe(0.001);
    const dNaN = improperModel.compute({ p: NaN, R: NaN, eps: NaN }) as ReturnType<
      typeof improperData
    >;
    expect(dNaN.p).toBe(1);
    expect(dNaN.R).toBe(10);
    expect(dNaN.eps).toBe(0.01);
  });
});
