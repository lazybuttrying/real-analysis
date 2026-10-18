import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_N,
  DEFAULT_SERIES,
  MAX_N,
  MIN_N,
  SERIES_ALTERNATING,
  SERIES_OPTIONS,
  SERIES_PRODUCT,
  doubleSeriesData,
  doubleSeriesModel,
  seriesLimit,
  term,
  type DoubleSeriesData,
} from '../src/chapters/series/models/doubleSeries';
import { doubleSeriesProblems } from '../src/chapters/series/problems/double-series';

const compute = (state: ControlState): DoubleSeriesData => syncCompute(doubleSeriesModel, state);
const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);

describe('double-series: terms', () => {
  it('term(m, n) = 1/(m^2 n^2) for the product series', () => {
    expect(term(1, 1, SERIES_PRODUCT)).toBe(1);
    expectCloseTo(term(2, 3, SERIES_PRODUCT), 1 / (4 * 9), 1e-15);
    expectCloseTo(term(8, 8, SERIES_PRODUCT), 1 / 4096, 1e-15);
  });

  it('term(m, n) = (-1)^{m+n}/(m^2 n^2) for the alternating series', () => {
    expect(term(1, 1, SERIES_ALTERNATING)).toBe(1);
    expect(term(1, 2, SERIES_ALTERNATING)).toBe(-1 / 4);
    expect(term(2, 2, SERIES_ALTERNATING)).toBe(1 / 16);
    expect(term(2, 3, SERIES_ALTERNATING)).toBe(-1 / 36);
  });

  it('the limits are pi^4/36 and pi^4/144', () => {
    expectCloseTo(seriesLimit(SERIES_PRODUCT), (Math.PI ** 4) / 36, 1e-12);
    expectCloseTo(seriesLimit(SERIES_PRODUCT), 2.705808084277845, 1e-9);
    expectCloseTo(seriesLimit(SERIES_ALTERNATING), (Math.PI ** 4) / 144, 1e-12);
    expectCloseTo(seriesLimit(SERIES_ALTERNATING), 0.6764520210694612, 1e-9);
  });
});

describe('double-series: N = 5 totals', () => {
  it('product total = 2.1421574845679006', () => {
    const data = doubleSeriesData(5, SERIES_PRODUCT);
    expectCloseTo(data.total, 2.1421574845679006, 1e-9);
  });

  it('alternating total = 0.7032685956790126', () => {
    const data = doubleSeriesData(5, SERIES_ALTERNATING);
    expectCloseTo(data.total, 0.7032685956790126, 1e-9);
  });

  it('the totals are climbing toward their limits', () => {
    const p5 = doubleSeriesData(5, SERIES_PRODUCT);
    const p8 = doubleSeriesData(8, SERIES_PRODUCT);
    expect(p5.total).toBeLessThan(p8.total);
    expect(p8.total).toBeLessThan(seriesLimit(SERIES_PRODUCT));
    const a8 = doubleSeriesData(8, SERIES_ALTERNATING);
    expect(Math.abs(a8.total - seriesLimit(SERIES_ALTERNATING))).toBeLessThan(
      Math.abs(doubleSeriesData(2, SERIES_ALTERNATING).total - seriesLimit(SERIES_ALTERNATING)),
    );
  });
});

describe('double-series: rows vs columns agree', () => {
  it('sum of row sums = sum of column sums = total, both series, all N', () => {
    for (const series of SERIES_OPTIONS) {
      for (let N = MIN_N; N <= MAX_N; N++) {
        const data = doubleSeriesData(N, series);
        expectCloseTo(sum(data.rowSums), data.total, 1e-12);
        expectCloseTo(sum(data.colSums), data.total, 1e-12);
      }
    }
  });

  it('the product series is symmetric: row sums = column sums', () => {
    for (let N = MIN_N; N <= MAX_N; N++) {
      const data = doubleSeriesData(N, SERIES_PRODUCT);
      for (let i = 0; i < N; i++) {
        expectCloseTo(data.rowSums[i] as number, data.colSums[i] as number, 1e-15);
      }
    }
  });

  it('the grid matches the terms, 1-indexed', () => {
    for (const series of SERIES_OPTIONS) {
      const data = doubleSeriesData(4, series);
      for (let m = 0; m < 4; m++) {
        for (let n = 0; n < 4; n++) {
          expect((data.grid[m] as number[])[n] as number).toBe(term(m + 1, n + 1, series));
        }
      }
    }
  });
});

describe('double-series: model compute', () => {
  it('reads N and series from the control state (init N=5, product) and clamps', () => {
    const data = compute({ N: DEFAULT_N, series: DEFAULT_SERIES });
    expect(data.N).toBe(5);
    expect(data.series).toBe(SERIES_PRODUCT);
    expectCloseTo(data.total, 2.1421574845679006, 1e-9);
    expect(compute({ N: MIN_N, series: SERIES_PRODUCT }).N).toBe(2);
    expect(compute({ N: MAX_N, series: SERIES_PRODUCT }).N).toBe(8);
    expect(compute({ N: 500, series: SERIES_PRODUCT }).N).toBe(8);
    expect(compute({ N: 0, series: SERIES_PRODUCT }).N).toBe(2);
    expect(compute({}).N).toBe(5);
    expect(compute({}).series).toBe(SERIES_PRODUCT);
  });

  it('accepts the alternating series and falls back on unknown values', () => {
    expect(compute({ N: 5, series: SERIES_ALTERNATING }).series).toBe(SERIES_ALTERNATING);
    expect(compute({ N: 5, series: 'nope' }).series).toBe(SERIES_PRODUCT);
    expect(compute({ N: 5, series: 42 }).series).toBe(SERIES_PRODUCT);
  });

  it('exports the expected data keys', () => {
    const data = compute({ N: 5, series: SERIES_PRODUCT });
    for (const key of ['N', 'series', 'grid', 'rowSums', 'colSums', 'total', 'limit'] as const) {
      expect(data).toHaveProperty(key);
    }
    expect(data.limit).toBe(seriesLimit(SERIES_PRODUCT));
  });
});

describe('double-series: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(doubleSeriesProblems).toHaveLength(3);
    for (const p of doubleSeriesProblems) {
      expect(p.id).toBeTruthy();
      expect(p.statement.ko).toBeTruthy();
      expect(p.statement.en).toBeTruthy();
      expect(p.presetCaption.ko).toBeTruthy();
      expect(p.presetCaption.en).toBeTruthy();
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko).toBeTruthy();
        expect(step.text.en).toBeTruthy();
      }
      expect(p.preset['N']).toBe(5);
    }
    expect(doubleSeriesProblems[0]?.preset['series']).toBe(SERIES_PRODUCT);
    expect(doubleSeriesProblems[1]?.preset['series']).toBe(SERIES_ALTERNATING);
  });

  it('the three ids are double-series-proof, double-series-absolute, fubini-fails', () => {
    expect(doubleSeriesProblems.map((p) => p.id)).toEqual([
      'double-series-proof',
      'double-series-absolute',
      'fubini-fails',
    ]);
  });
});
