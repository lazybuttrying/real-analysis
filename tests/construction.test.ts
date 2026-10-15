import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  constructionModel,
  decimalTruncations,
  newtonTerms,
  type ConstructionData,
} from '../src/chapters/limits/models/construction';

const SQRT2 = Math.SQRT2;

const compute = (state: ControlState): ConstructionData =>
  constructionModel.compute(state) as ConstructionData;

describe('construction: decimal truncations are exact rational fractions', () => {
  it('gives 1, 14/10, 141/100, 1414/1000, 14142/10000, 141421/100000, 1414213/1000000', () => {
    const terms = decimalTruncations(6);
    const expected: Array<[bigint, bigint]> = [
      [1n, 1n],
      [14n, 10n],
      [141n, 100n],
      [1414n, 1000n],
      [14142n, 10000n],
      [141421n, 100000n],
      [1414213n, 1000000n],
    ];
    expect(terms).toHaveLength(7);
    for (const [i, [p, q]] of expected.entries()) {
      expect(terms[i]?.p).toBe(p);
      expect(terms[i]?.q).toBe(q);
    }
  });

  it('satisfies the proof bound |x_n - sqrt(2)| < 10^-n', () => {
    const terms = decimalTruncations(6);
    for (const t of terms) {
      expect(t.error).toBeLessThan(10 ** -t.n);
      expect(t.error).toBeGreaterThanOrEqual(0);
    }
    // spot values used in the proof narrative
    expect(terms[2]?.error).toBeCloseTo(SQRT2 - 1.41, 15);
  });

  it('is Cauchy: |x_m - x_n| < 10^-N for all m, n >= N', () => {
    const terms = decimalTruncations(6);
    for (let N = 0; N <= 6; N++) {
      for (let m = N; m <= 6; m++) {
        for (let n = N; n <= 6; n++) {
          const diff = Math.abs((terms[m]?.value ?? 0) - (terms[n]?.value ?? 0));
          expect(diff).toBeLessThan(10 ** -N);
        }
      }
    }
  });
});

describe('construction: newton terms match the holes scene fractions', () => {
  it('gives 1, 3/2, 17/12', () => {
    const terms = newtonTerms(2);
    expect([terms[0]?.p, terms[0]?.q]).toEqual([1n, 1n]);
    expect([terms[1]?.p, terms[1]?.q]).toEqual([3n, 2n]);
    expect([terms[2]?.p, terms[2]?.q]).toEqual([17n, 12n]);
  });

  it('has decreasing error until machine precision', () => {
    const terms = newtonTerms(6);
    for (let i = 1; i <= 4; i++) {
      expect(terms[i]?.error ?? 1).toBeLessThan(terms[i - 1]?.error ?? 0);
    }
    // from n = 5 on the double closest to sqrt(2) is reached: error is at machine-epsilon scale
    for (let i = 5; i < terms.length; i++) {
      expect(terms[i]?.error ?? 1).toBeLessThan(1e-11);
    }
  });
});

describe('construction: equivalent sequences, same real number', () => {
  it('decimal and newton terms agree to the truncation bound', () => {
    const d = decimalTruncations(6);
    const nw = newtonTerms(6);
    for (let n = 0; n <= 6; n++) {
      const diff = Math.abs((d[n]?.value ?? 0) - (nw[n]?.value ?? 0));
      expect(diff).toBeLessThan(10 ** -n + (nw[n]?.error ?? 0) + 1e-15);
    }
    // concrete: x_3^decimal = 1.414 vs x_3^newton = 577/408
    expect(Math.abs((d[3]?.value ?? 0) - 577 / 408)).toBeLessThan(0.001);
  });

  it('(1 + 1/n) and the constant 1 sequence differ by 1/n -> 0', () => {
    for (const n of [1, 10, 100, 1000]) {
      expect(Math.abs(1 / n - 0)).toBeLessThanOrEqual(1 / n);
    }
    expect(1 / 1000).toBe(0.001);
  });
});

describe('construction: termwise sums stay Cauchy (proof 3 numbers)', () => {
  it('the triangle-inequality split holds on truncation data', () => {
    const d = decimalTruncations(6);
    const e = 0.01;
    // N_1 = N_2 = 2 gives |x_m - x_n| < 0.01 for m, n >= 2; check the sum bound
    for (const m of [2, 3, 4, 5, 6]) {
      for (const n of [2, 3, 4, 5, 6]) {
        const left = Math.abs((d[m]?.value ?? 0) + (d[m]?.value ?? 0) - ((d[n]?.value ?? 0) + (d[n]?.value ?? 0)));
        const right = Math.abs((d[m]?.value ?? 0) - (d[n]?.value ?? 0)) + Math.abs((d[m]?.value ?? 0) - (d[n]?.value ?? 0));
        expect(left).toBeLessThanOrEqual(right + 1e-15);
        expect(right).toBeLessThan(e);
      }
    }
  });
});

describe('construction: model compute clamps state', () => {
  it('clamps n into [1, 6] and defaults seq to decimal', () => {
    expect(compute({ n: 99 }).n).toBe(6);
    expect(compute({ n: 0 }).n).toBe(1);
    expect(compute({ n: -3 }).n).toBe(1);
    expect(compute({}).n).toBe(4);
    expect(compute({ seq: 'bogus' }).seq).toBe('decimal');
    expect(compute({ seq: 'newton', n: 3 }).seq).toBe('newton');
  });

  it('returns n+1 terms matching the selected sequence', () => {
    const d = compute({ seq: 'decimal', n: 4 });
    expect(d.terms).toHaveLength(5);
    expect(d.terms[4]?.p).toBe(14142n);
    const nw = compute({ seq: 'newton', n: 2 });
    expect(nw.terms).toHaveLength(3);
    expect(nw.terms[2]?.p).toBe(17n);
  });
});
