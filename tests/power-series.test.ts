import { describe, expect, it } from 'vitest';
import {
  MAX_N,
  powerData,
  powerPartialSum,
  powerRadius,
  powerSeriesModel,
  powerTerm,
  type PowerSeriesKind,
} from '../src/chapters/series/models/power-series';

describe('powerRadius', () => {
  it('returns the radius of convergence for each series', () => {
    expect(powerRadius('exp')).toBe(Infinity);
    expect(powerRadius('factorial')).toBe(0);
    expect(powerRadius('geom')).toBe(1);
  });
});

describe('powerTerm ratios (ratio-test recurrence)', () => {
  it('exp at x=2: |t_6/t_5| = 2/6', () => {
    const ratio = Math.abs(powerTerm('exp', 2, 6) / powerTerm('exp', 2, 5));
    expect(ratio).toBeCloseTo(2 / 6, 12);
  });

  it('factorial at x=0.5: |t_6/t_5| = 6 * 0.5 = 3', () => {
    const ratio = Math.abs(powerTerm('factorial', 0.5, 6) / powerTerm('factorial', 0.5, 5));
    expect(ratio).toBeCloseTo(3, 12);
  });

  it('geom at x=0.5: |t_6/t_5| = 0.5', () => {
    const ratio = Math.abs(powerTerm('geom', 0.5, 6) / powerTerm('geom', 0.5, 5));
    expect(ratio).toBeCloseTo(0.5, 12);
  });

  it('has t_0 = 1 for every series', () => {
    const kinds: PowerSeriesKind[] = ['exp', 'factorial', 'geom'];
    for (const kind of kinds) expect(powerTerm(kind, 2.5, 0)).toBe(1);
  });
});

describe('powerPartialSum', () => {
  it("geom at x=0.5, N=30 matches 1/(1-0.5) = 2 within 1e-9", () => {
    expect(Math.abs(powerPartialSum('geom', 0.5, 30) - 2)).toBeLessThan(1e-9);
  });

  it('exp at x=1, N=30 matches e within 1e-9', () => {
    expect(Math.abs(powerPartialSum('exp', 1, 30) - Math.E)).toBeLessThan(1e-9);
  });

  it('exp at x=2, N=20 is near e^2', () => {
    expect(Math.abs(powerPartialSum('exp', 2, 20) - Math.E ** 2)).toBeLessThan(1e-9);
  });

  it('factorial at x=0.5, N=10 is finite and above 4000', () => {
    const s = powerPartialSum('factorial', 0.5, 10);
    expect(Number.isFinite(s)).toBe(true);
    expect(s).toBeGreaterThan(4000);
  });

  it('overflow safety: factorial at x=3, N=30 stays finite (no Infinity)', () => {
    const s = powerPartialSum('factorial', 3, 30);
    expect(Number.isFinite(s)).toBe(true);
    expect(s).toBeGreaterThan(1e15);
  });

  it('geom at x=1, N=20 sums to 21', () => {
    expect(powerPartialSum('geom', 1, 20)).toBeCloseTo(21, 12);
  });
});

describe('powerData verdicts', () => {
  it('exp at x=2 converges (|x| < R = infinity)', () => {
    const d = powerData('exp', 2, 20);
    expect(d.radius).toBe(Infinity);
    expect(d.verdict).toBe('converge');
    expect(d.overflow).toBe(false);
  });

  it('factorial at x=0.5 diverges (|x| > R = 0)', () => {
    const d = powerData('factorial', 0.5, 10);
    expect(d.radius).toBe(0);
    expect(d.verdict).toBe('diverge');
    expect(d.overflow).toBe(false);
  });

  it('factorial at x=3, N=30 diverges with the overflow flag', () => {
    const d = powerData('factorial', 3, 30);
    expect(d.verdict).toBe('diverge');
    expect(d.overflow).toBe(true);
    expect(Number.isFinite(d.partialSum)).toBe(true);
  });

  it('geom inside |x|=0.5 converges, outside |x|=2 diverges', () => {
    expect(powerData('geom', 0.5, 20).verdict).toBe('converge');
    expect(powerData('geom', 2, 20).verdict).toBe('diverge');
    expect(powerData('geom', -2, 20).verdict).toBe('diverge');
  });

  it('geom at both endpoints x=1 and x=-1 is boundary', () => {
    expect(powerData('geom', 1, 20).verdict).toBe('boundary');
    expect(powerData('geom', -1, 20).verdict).toBe('boundary');
  });

  it('factorial at x=0 is boundary (|x| = R = 0)', () => {
    const d = powerData('factorial', 0, 10);
    expect(d.verdict).toBe('boundary');
    expect(d.partialSum).toBeCloseTo(1, 12);
  });

  it('exp at the slider edges x=±3 converges', () => {
    expect(powerData('exp', 3, 15).verdict).toBe('converge');
    expect(powerData('exp', -3, 15).verdict).toBe('converge');
  });
});

describe('powerSeriesModel.compute', () => {
  it('sanitizes controls and returns the expected shape', async () => {
    const d = await powerSeriesModel.compute({ series: 'geom', x: 1, n: 20 });
    expect(d.series).toBe('geom');
    expect(d.x).toBe(1);
    expect(d.n).toBe(20);
    expect(d.radius).toBe(1);
    expect(d.verdict).toBe('boundary');
    expect(d.lastTermAbs).toBeCloseTo(1, 12);
    expect(d.partialSum).toBeCloseTo(21, 12);
  });

  it('defaults the series to exp for an unknown key', async () => {
    const d = await powerSeriesModel.compute({ series: 'bogus', x: 0, n: 5 });
    expect(d.series).toBe('exp');
    expect(d.radius).toBe(Infinity);
  });

  it('clamps n to the [1, MAX_N] range', async () => {
    const d = await powerSeriesModel.compute({ series: 'exp', x: 1, n: 999 });
    expect(d.n).toBe(MAX_N);
  });
});
