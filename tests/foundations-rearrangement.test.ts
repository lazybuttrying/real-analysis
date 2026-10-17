import { describe, expect, it } from 'vitest';
import { expectCloseTo } from './helpers';
import {
  ORIG_LIMIT,
  REARR_LIMIT,
  rearrangementModel,
  rearrangementSums,
} from '../src/chapters/series/models/rearrangement';

function at<T>(xs: readonly T[], i: number): T {
  const v = xs[i];
  if (v === undefined) throw new Error(`index ${i} out of range`);
  return v;
}

describe('rearrangement model', () => {
  it('follows the (+,+,-) term order: 1, 1/3, -1/2, 1/5, 1/7, -1/4', () => {
    const data = rearrangementSums(6);
    const terms = data.rearranged.map((v, i) => (i === 0 ? v : v - at(data.rearranged, i - 1)));
    expect(terms[0]).toBeCloseTo(1, 12);
    expect(terms[1]).toBeCloseTo(1 / 3, 12);
    expect(terms[2]).toBeCloseTo(-1 / 2, 12);
    expect(terms[3]).toBeCloseTo(1 / 5, 12);
    expect(terms[4]).toBeCloseTo(1 / 7, 12);
    expect(terms[5]).toBeCloseTo(-1 / 4, 12);
  });

  it('original partial sums tend to ln 2, stated as 0.6931', () => {
    expect(ORIG_LIMIT).toBe(Math.LN2);
    expectCloseTo(Math.LN2, 0.6931, 5e-5);
    const data = rearrangementSums(150);
    expect(data.original).toHaveLength(150);
    // |S_150 - ln 2| < 0.01
    expectCloseTo(at(data.original, 149), Math.LN2, 0.01);
  });

  it('rearranged partial sums tend to (3/2) ln 2, stated as 1.03972', () => {
    expect(REARR_LIMIT).toBe(1.5 * Math.LN2);
    expectCloseTo(1.5 * Math.LN2, 1.03972, 5e-5);
    const data = rearrangementSums(150);
    expect(data.rearranged).toHaveLength(150);
    // Proof figure: |T_150 - (3/2) ln 2| ≈ 0.0050 < 0.01
    expectCloseTo(at(data.rearranged, 149), 1.5 * Math.LN2, 0.01);
  });

  it('the rearranged error shrinks from n = 150 to n = 300', () => {
    const data = rearrangementSums(300);
    const err150 = Math.abs(at(data.rearranged, 149) - 1.5 * Math.LN2);
    const err300 = Math.abs(at(data.rearranged, 299) - 1.5 * Math.LN2);
    expect(err300).toBeLessThan(err150);
  });

  it('alternating remainder bound |S_n - ln 2| <= 1/(n+1) holds', () => {
    const data = rearrangementSums(100);
    // 0-based index k holds S_{k+1}, so the bound is 1/(k+2).
    for (const k of [0, 1, 2, 3, 4, 5, 9, 49, 99]) {
      expect(Math.abs(at(data.original, k) - Math.LN2)).toBeLessThanOrEqual(1 / (k + 2) + 1e-12);
    }
    // Proof figure: n = 100 traps the error inside 1/101 ≈ 0.0099.
    expectCloseTo(1 / 101, 0.0099, 5e-5);
    expect(Math.abs(at(data.original, 99) - Math.LN2)).toBeLessThanOrEqual(1 / 101 + 1e-12);
  });

  it('compute() reads n from the state and clamps to [6, 300]', () => {
    const at150 = rearrangementModel.compute({ n: 150 });
    expect(at150).not.toBeInstanceOf(Promise);
    const d150 = at150 as ReturnType<typeof rearrangementSums>;
    expect(d150.n).toBe(150);
    expect(d150.original).toHaveLength(150);
    expect(d150.rearranged).toHaveLength(150);

    const dBig = rearrangementModel.compute({ n: 1000 }) as ReturnType<typeof rearrangementSums>;
    expect(dBig.n).toBe(300);
    const dSmall = rearrangementModel.compute({ n: 2 }) as ReturnType<typeof rearrangementSums>;
    expect(dSmall.n).toBe(6);
    const dNaN = rearrangementModel.compute({ n: NaN }) as ReturnType<typeof rearrangementSums>;
    expect(dNaN.n).toBe(60);
  });
});
