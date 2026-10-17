import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  alternatingAbsBound,
  cauchyProductData,
  cauchyProductModel,
  cauchyTerm,
  cauchyTerms,
  clampN,
  N_INIT,
  N_MAX,
  N_MIN,
  PAIR_INIT,
  pairLimit,
  pairTerm,
  parsePair,
  partialSums,
  productOfPartials,
  type CauchyProductData,
} from '../src/chapters/series/models/cauchyProduct';
import { problems } from '../src/chapters/series/problems/cauchy-product';

const compute = (state: ControlState): CauchyProductData => syncCompute(cauchyProductModel, state);

/** Independent factorial (test-side), not the model's pairTerm loop. */
function fact(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

describe('cauchy-product: the exp pair c_n = 2^n/n!', () => {
  it('c_n equals 2^n/n! for n = 0..6', () => {
    for (let n = 0; n <= 6; n++) {
      expect(cauchyTerm('exp', n)).toBeCloseTo(Math.pow(2, n) / fact(n), 12);
    }
  });

  it('c_0 = 1 and c_1 = 2', () => {
    expect(cauchyTerm('exp', 0)).toBe(1);
    expect(cauchyTerm('exp', 1)).toBe(2);
  });

  it('cauchyTerms returns c_0..c_n with the right length', () => {
    const ts = cauchyTerms('exp', 10);
    expect(ts).toHaveLength(11);
    for (let n = 0; n <= 10; n++) {
      expect(ts[n]).toBeCloseTo(Math.pow(2, n) / fact(n), 12);
    }
  });

  it('partial sums are exact prefix sums of the terms', () => {
    const ts = cauchyTerms('exp', 12);
    const ps = partialSums(ts);
    let running = 0;
    for (let i = 0; i < ts.length; i++) {
      running += ts[i] ?? 0;
      expect(ps[i]).toBeCloseTo(running, 14);
    }
  });

  it('C_10 matches the independent prefix sum (7.3889947...)', () => {
    const ts = cauchyTerms('exp', 10);
    const C10 = partialSums(ts)[10] ?? 0;
    let expected = 0;
    for (let n = 0; n <= 10; n++) expected += Math.pow(2, n) / fact(n);
    expect(C10).toBeCloseTo(expected, 14);
    expect(C10).toBeCloseTo(7.3889947, 6);
  });

  it('C_30 converges to e^2 within 1e-12 (note: C_10 is only within ~6.1e-5)', () => {
    const ts = cauchyTerms('exp', 30);
    const C30 = partialSums(ts)[30] ?? 0;
    expect(C30).toBeCloseTo(Math.E * Math.E, 12);
    // Documents the real rate: the tail past n=10 is ~6.1e-5, so a
    // "C_10 within 1e-6 of e^2" claim would be false.
    const C10 = partialSums(cauchyTerms('exp', 10))[10] ?? 0;
    expect(Math.abs(C10 - Math.E * Math.E)).toBeGreaterThan(1e-6);
    expectCloseTo(C10, Math.E * Math.E, 1e-4);
  });

  it('pairLimit is e^2 for exp and null for alternating', () => {
    expect(pairLimit('exp')).toBeCloseTo(Math.E * Math.E, 14);
    expect(pairLimit('alternating')).toBeNull();
  });
});

describe('cauchy-product: the alternating pair |c_n| >= 2(n+1)/(n+2) >= 1', () => {
  it('the bound holds for n = 0..25', () => {
    const ts = cauchyTerms('alternating', 25);
    for (let n = 0; n <= 25; n++) {
      const c = ts[n] ?? 0;
      const bound = alternatingAbsBound(n);
      expect(Math.abs(c)).toBeGreaterThanOrEqual(bound - 1e-12);
      expect(Math.abs(c)).toBeGreaterThanOrEqual(1 - 1e-12);
      expect(bound).toBeGreaterThanOrEqual(1);
    }
  });

  it('closed form of the bound: 2(n+1)/(n+2)', () => {
    expect(alternatingAbsBound(0)).toBe(1);
    expect(alternatingAbsBound(1)).toBeCloseTo(4 / 3, 14);
    expect(alternatingAbsBound(20)).toBeCloseTo(42 / 22, 14);
  });

  it('spot values: |c_0| = 1, |c_1| = sqrt(2), |c_20| ~= 2.516872', () => {
    expect(Math.abs(cauchyTerm('alternating', 0))).toBe(1);
    expect(Math.abs(cauchyTerm('alternating', 1))).toBeCloseTo(Math.SQRT2, 12);
    expect(Math.abs(cauchyTerm('alternating', 20))).toBeCloseTo(2.516872, 5);
  });

  it('c_n does not tend to 0, so the product series diverges', () => {
    const ts = cauchyTerms('alternating', 30);
    for (let n = 20; n <= 30; n++) {
      expect(Math.abs(ts[n] ?? 0)).toBeGreaterThanOrEqual(1 - 1e-12);
    }
  });
});

describe('cauchy-product: product of partials', () => {
  it('A_5 * B_5 = (163/60)^2 for the exp pair', () => {
    // A_5 = 1 + 1 + 1/2 + 1/6 + 1/24 + 1/120 = 163/60.
    expect(productOfPartials('exp', 5)).toBeCloseTo((163 / 60) ** 2, 12);
    expect(productOfPartials('exp', 5)).toBeCloseTo(7.3802778, 6);
  });

  it('productOfPartials agrees with the model data', () => {
    for (const pair of ['exp', 'alternating'] as const) {
      const d = cauchyProductData(pair, 15);
      expect(d.prodPartials[15]).toBeCloseTo(productOfPartials(pair, 15), 14);
      expect(d.prodPartials).toHaveLength(16);
    }
  });
});

describe('cauchy-product: parsing and clamping', () => {
  it('clamps and floors n', () => {
    expect(clampN(-5)).toBe(N_MIN);
    expect(clampN(99)).toBe(N_MAX);
    expect(clampN(10.9)).toBe(10);
    expect(clampN(NaN)).toBe(N_INIT);
    expect(clampN(undefined)).toBe(N_INIT);
  });

  it('parses the pair, defaulting to exp', () => {
    expect(parsePair('exp')).toBe('exp');
    expect(parsePair('alternating')).toBe('alternating');
    expect(parsePair('bogus')).toBe(PAIR_INIT);
    expect(parsePair(undefined)).toBe(PAIR_INIT);
  });

  it('pairTerm is 1/k! and (-1)^k/sqrt(k+1)', () => {
    expect(pairTerm('exp', 0)).toBe(1);
    expect(pairTerm('exp', 4)).toBeCloseTo(1 / 24, 14);
    expect(pairTerm('alternating', 0)).toBe(1);
    expect(pairTerm('alternating', 1)).toBeCloseTo(-1 / Math.SQRT2, 14);
    expect(pairTerm('alternating', 3)).toBeCloseTo(-1 / 2, 14);
  });
});

describe('cauchy-product: model.compute parses state', () => {
  it('defaults to pair exp, n 10 on empty state', () => {
    const d = compute({});
    expect(d.pair).toBe(PAIR_INIT);
    expect(d.n).toBe(N_INIT);
  });

  it('reads the real control keys', () => {
    const d = compute({ n: 12, pair: 'exp' });
    expect(d.n).toBe(12);
    expect(d.pair).toBe('exp');
    expect(d.terms).toHaveLength(13);
    expect(d.partials).toHaveLength(13);
  });

  it('every lattice diagonal sums to the matching c_d', () => {
    for (const pair of ['exp', 'alternating'] as const) {
      const d = compute({ n: 20, pair });
      for (let diag = 0; diag <= 20; diag++) {
        let s = 0;
        for (const cell of d.lattice) {
          if (cell.d === diag) s += cell.value;
        }
        expect(s).toBeCloseTo(d.terms[diag] ?? 0, 12);
      }
    }
  });

  it('lattice only contains k + j <= n cells', () => {
    const d = compute({ n: 10, pair: 'alternating' });
    expect(d.lattice.length).toBe((11 * 12) / 2);
    for (const cell of d.lattice) {
      expect(cell.k + cell.j).toBe(cell.d);
      expect(cell.d).toBeLessThanOrEqual(10);
      expect(cell.value).toBeCloseTo(
        pairTerm('alternating', cell.k) * pairTerm('alternating', cell.j),
        15,
      );
    }
  });
});

describe('cauchy-product: problems data is complete and captions match the model', () => {
  it('has the three required problems with bilingual text and full proofs', () => {
    expect(problems.length).toBe(3);
    for (const p of problems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.presetCaption.ko.length).toBeGreaterThan(0);
      expect(p.presetCaption.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      expect(p.display?.length).toBeGreaterThan(0);
    }
  });

  it('presets use the real control keys and valid values', () => {
    expect(problems[0]?.preset).toEqual({ n: 12, pair: 'exp' });
    expect(problems[1]?.preset).toEqual({ n: 10, pair: 'exp' });
    expect(problems[2]?.preset).toEqual({ n: 20, pair: 'alternating' });
    for (const p of problems) {
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
      expect(Number.isInteger(n)).toBe(true);
      expect(['exp', 'alternating']).toContain(p.preset['pair']);
    }
  });

  it('problem ids are the cauchy-product-* ids', () => {
    expect(problems.map((p) => p.id)).toEqual([
      'cauchy-product-mertens',
      'cauchy-product-exp',
      'cauchy-product-diverges',
    ]);
  });

  it('caption numbers match the model', () => {
    const [p1, p2, p3] = problems;
    const d1 = compute(p1?.preset ?? {});
    const d2 = compute(p2?.preset ?? {});
    const d3 = compute(p3?.preset ?? {});
    // Mertens preset: C_12 and A_12*B_12 near e^2, c_12 tiny.
    expect(p1?.presetCaption.ko).toContain('7.3890546');
    expect(p1?.presetCaption.en).toContain('7.3890561');
    expect((d1.partials[12] ?? 0).toFixed(7)).toBe('7.3890546');
    expect((d1.prodPartials[12] ?? 0).toFixed(7)).toBe('7.3890561');
    // Exp preset: C_10.
    expect(p2?.presetCaption.ko).toContain('7.3889947');
    expect((d2.partials[10] ?? 0).toFixed(7)).toBe('7.3889947');
    // Diverges preset: |c_20| above the bound.
    expect(p3?.presetCaption.ko).toContain('2.516872');
    expect(p3?.presetCaption.ko).toContain('1.909091');
    expect(Math.abs(d3.terms[20] ?? 0).toFixed(6)).toBe('2.516872');
    expect(Math.abs(d3.terms[20] ?? 0)).toBeGreaterThanOrEqual(alternatingAbsBound(20));
  });

  it('no Korean outside ko: strings, no $...$ TeX', () => {
    const korean = /[\u3131-\uD79D]/;
    for (const p of problems) {
      for (const s of [p.statement.en, p.presetCaption.en]) {
        expect(s).not.toMatch(korean);
      }
      for (const step of p.proof) {
        expect(step.text.en).not.toMatch(korean);
        for (const f of step.display ?? []) {
          expect(f).not.toMatch(korean);
        }
      }
      for (const f of p.display ?? []) {
        expect(f).not.toMatch(korean);
        expect(f).not.toMatch(/\$(?!\$)/);
      }
    }
  });
});
