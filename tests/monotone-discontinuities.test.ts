import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  exampleValue,
  jumpSize,
  monotoneDiscontinuitiesModel,
  rationals,
  DEFAULT_N,
  DEFAULT_TERMS,
  MAX_N,
  MAX_TERMS,
  MIN_N,
  MIN_TERMS,
  type MonotoneDiscontinuitiesData,
} from '../src/chapters/limits/models/monotoneDiscontinuities';
import { monotoneDiscontinuitiesProblems } from '../src/chapters/limits/problems/monotone-discontinuities';

const compute = (state: ControlState): MonotoneDiscontinuitiesData =>
  monotoneDiscontinuitiesModel.compute(state) as MonotoneDiscontinuitiesData;

/** Independent gcd for the independent enumeration. */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

/** Independent rationals enumeration: increasing denominator, then numerator, reduced only. */
function naiveRationals(count: number): number[] {
  const out: number[] = [];
  let d = 2;
  while (out.length < count) {
    for (let p = 1; p < d && out.length < count; p++) {
      if (gcd(p, d) === 1) out.push(p / d);
    }
    d++;
  }
  return out;
}

/** Independent f(x) = x + sum_{k: q_k < x} 2^{-k}; does not reuse exampleValue. */
function naiveF(x: number, qs: number[]): number {
  let s = x;
  for (let k = 0; k < qs.length; k++) {
    const q = qs[k];
    if (q !== undefined && q < x) s += 2 ** -(k + 1);
  }
  return s;
}

describe('monotone-discontinuities: the rationals enumeration', () => {
  it('rationals(9) = [1/2, 1/3, 2/3, 1/4, 3/4, 1/5, 2/5, 3/5, 4/5]', () => {
    const expected = [1 / 2, 1 / 3, 2 / 3, 1 / 4, 3 / 4, 1 / 5, 2 / 5, 3 / 5, 4 / 5];
    const got = rationals(9);
    expect(got).toHaveLength(9);
    for (let i = 0; i < 9; i++) {
      expect(got[i]).toBe(expected[i]);
    }
  });

  it('model matches the independent enumeration for every count 1..60', () => {
    for (let count = 1; count <= MAX_TERMS; count++) {
      expect(rationals(count)).toEqual(naiveRationals(count));
    }
  });

  it('skips non-reduced fractions (e.g. 2/4, 2/6 never appear)', () => {
    const got = new Set(rationals(60).map((x) => x.toPrecision(17)));
    expect(got.size).toBe(60);
    // 2/4 = 1/2 would duplicate q_1; every value is unique because reduced
  });
});

describe('monotone-discontinuities: jump sizes are 2^{-k}', () => {
  it('jumpSize(k) = 2^{-k} for k = 1..60', () => {
    for (let k = 1; k <= 60; k++) {
      expect(jumpSize(k)).toBe(2 ** -k);
    }
  });

  it('compute reports the rationals with their exact jump sizes', () => {
    const data = compute({ terms: 24, n: 4 });
    expect(data.rationals).toHaveLength(24);
    for (let i = 0; i < 24; i++) {
      expect(data.rationals[i]?.k).toBe(i + 1);
      expect(data.rationals[i]?.size).toBe(2 ** -(i + 1));
      expect(data.rationals[i]?.x).toBe(naiveRationals(24)[i]);
    }
  });
});

describe('monotone-discontinuities: the example function', () => {
  it('exampleValue matches the independent naive f on a grid', () => {
    const qs = rationals(24);
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      expect(exampleValue(x, qs)).toBeCloseTo(naiveF(x, qs), 15);
    }
  });

  it('f is nondecreasing on the samples for several term counts', () => {
    for (const terms of [1, 7, 24, 60]) {
      const data = compute({ terms, n: 4 });
      const { fSamples } = data;
      expect(fSamples.length).toBeGreaterThan(100);
      for (let i = 1; i < fSamples.length; i++) {
        expect(fSamples[i]?.f).toBeGreaterThanOrEqual((fSamples[i - 1]?.f ?? 0) - 1e-12);
      }
    }
  });

  it('f(1) - f(0) = 1 + sum_{k=1}^{terms} 2^{-k} < 2 (exact math; floats round at terms >= 53)', () => {
    for (const terms of [1, 24, 52]) {
      const data = compute({ terms, n: 4 });
      let expected = 1;
      for (let k = 1; k <= terms; k++) expected += 2 ** -k;
      expect(data.range).toBeCloseTo(expected, 14);
      expect(data.range).toBeLessThan(2);
    }
    // at terms = 60 the true value 2 - 2^{-60} rounds to exactly 2 in doubles
    expect(compute({ terms: 60, n: 4 }).range).toBeLessThanOrEqual(2);
    expect(compute({ terms: 24, n: 4 }).range).toBeCloseTo(1.999999940395355, 12);
  });

  it('f(0) = 0 and f(1) = 1 + sum of all jumps (all rationals are < 1)', () => {
    const data = compute({ terms: 24, n: 4 });
    expect(data.fSamples[0]?.x).toBe(0);
    expect(data.fSamples[0]?.f).toBe(0);
    const last = data.fSamples[data.fSamples.length - 1];
    expect(last?.x).toBe(1);
    expect(last?.f).toBeCloseTo(data.range, 15);
  });
});

describe('monotone-discontinuities: big jumps and the finite-set bound', () => {
  it('for n = 4 the only big jump is k = 1 (size 1/2 > 1/4; 2^{-2} = 1/4 is not >)', () => {
    const data = compute({ terms: 24, n: 4 });
    expect(data.bigCount).toBe(1);
    expect(data.bigJumps).toHaveLength(1);
    expect(data.bigJumps[0]?.k).toBe(1);
    expect(data.bigJumps[0]?.x).toBe(1 / 2);
    expect(data.bigJumps[0]?.size).toBe(1 / 2);
  });

  it('bigJumps are exactly the k with 2^{-k} > 1/n (independent filter)', () => {
    for (const n of [1, 2, 3, 4, 7, 16, 32]) {
      const data = compute({ terms: 60, n });
      const expected: number[] = [];
      for (let k = 1; k <= 60; k++) {
        if (2 ** -k > 1 / n) expected.push(k);
      }
      expect(data.bigJumps.map((r) => r.k)).toEqual(expected);
      expect(data.bigCount).toBe(expected.length);
    }
  });

  it('bigCount <= n * (f(1) - f(0)) always, for every n and term count', () => {
    for (const terms of [1, 10, 24, 60]) {
      for (let n = MIN_N; n <= MAX_N; n++) {
        const data = compute({ terms, n });
        expect(data.bound).toBeCloseTo(n * data.range, 12);
        expect(data.bigCount).toBeLessThanOrEqual(data.bound + 1e-9);
      }
    }
  });

  it('caption numbers: bound for terms = 24, n = 4', () => {
    const data = compute({ terms: 24, n: 4 });
    expect(data.bound).toBeCloseTo(7.999999761581421, 9);
    expect(data.bigCount).toBeLessThanOrEqual(data.bound);
  });

  it('caption numbers: jump at q_1 = 1/2 is 1/2, f(1/2) = 0.8373474478721619', () => {
    const qs = rationals(24);
    expect(exampleValue(0.5, qs)).toBeCloseTo(0.8373474478721619, 12);
    expect(exampleValue(0.5, qs) + jumpSize(1)).toBeCloseTo(1.337347447872162, 12);
    expect(jumpSize(1)).toBe(0.5);
  });

  it('caption numbers: g(2/3) = 0.841285169124603, jump 2^{-3} = 0.125', () => {
    // g is the scene's f minus the x term
    const qs = rationals(24);
    const g23 = exampleValue(2 / 3, qs) - 2 / 3;
    expect(g23).toBeCloseTo(0.841285169124603, 12);
    expect(jumpSize(3)).toBe(0.125);
    expect(g23 + jumpSize(3)).toBeCloseTo(0.966285169124603, 12);
    // f(2/3) for the scene's own f
    expect(exampleValue(2 / 3, qs)).toBeCloseTo(1.507951835791270, 12);
  });
});

describe('monotone-discontinuities: problem presets use the scene control keys', () => {
  it('has 3 problems with ids, bilingual text, and valid presets', () => {
    expect(monotoneDiscontinuitiesProblems).toHaveLength(3);
    expect(monotoneDiscontinuitiesProblems.map((p) => p.id)).toEqual([
      'monotone-one-sided-limits',
      'monotone-countable',
      'monotone-rational-jumps',
    ]);
    for (const problem of monotoneDiscontinuitiesProblems) {
      expect(problem.statement.ko.length).toBeGreaterThan(0);
      expect(problem.statement.en.length).toBeGreaterThan(0);
      expect(problem.presetCaption.ko.length).toBeGreaterThan(0);
      expect(problem.presetCaption.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of problem.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      // presets use ONLY the scene's control keys 'terms' and 'n', in range
      const keys = Object.keys(problem.preset).sort();
      expect(keys).toEqual(['n', 'terms']);
      const terms = Number(problem.preset['terms']);
      const n = Number(problem.preset['n']);
      expect(Number.isInteger(terms)).toBe(true);
      expect(Number.isInteger(n)).toBe(true);
      expect(terms).toBeGreaterThanOrEqual(MIN_TERMS);
      expect(terms).toBeLessThanOrEqual(MAX_TERMS);
      expect(n).toBeGreaterThanOrEqual(MIN_N);
      expect(n).toBeLessThanOrEqual(MAX_N);
      // the preset state is actually computable
      const data = compute(problem.preset);
      expect(data.terms).toBe(terms);
      expect(data.n).toBe(n);
    }
  });

  it('every problem has display formulas with \\(\\) inline math', () => {
    for (const problem of monotoneDiscontinuitiesProblems) {
      expect(problem.display).toBeDefined();
      expect((problem.display ?? []).length).toBeGreaterThanOrEqual(1);
      for (const tex of problem.display ?? []) {
        expect(tex.length).toBeGreaterThan(0);
        expect(tex).not.toContain('$');
      }
    }
  });

  it('no problem text uses $...$ math delimiters', () => {
    for (const problem of monotoneDiscontinuitiesProblems) {
      const texts = [
        problem.statement.ko,
        problem.statement.en,
        problem.presetCaption.ko,
        problem.presetCaption.en,
      ];
      for (const step of problem.proof) {
        texts.push(step.text.ko, step.text.en);
      }
      for (const text of texts) {
        expect(text).not.toContain('$');
      }
    }
  });
});

describe('monotone-discontinuities: model.compute reads and clamps the controls', () => {
  it('clamps terms below 1 to 1 and above 60 to 60', () => {
    expect(compute({ terms: -5, n: 4 }).terms).toBe(MIN_TERMS);
    expect(compute({ terms: 10000, n: 4 }).terms).toBe(MAX_TERMS);
  });

  it('clamps n below 1 to 1 and above 32 to 32', () => {
    expect(compute({ terms: 24, n: 0 }).n).toBe(MIN_N);
    expect(compute({ terms: 24, n: 1000 }).n).toBe(MAX_N);
  });

  it('floors fractional control values', () => {
    expect(compute({ terms: 24.9, n: 4.9 }).terms).toBe(24);
    expect(compute({ terms: 24.9, n: 4.9 }).n).toBe(4);
  });

  it('defaults to terms = 24, n = 4 on missing/invalid input', () => {
    expect(compute({}).terms).toBe(DEFAULT_TERMS);
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ terms: NaN, n: NaN }).terms).toBe(DEFAULT_TERMS);
    expect(compute({ terms: NaN, n: NaN }).n).toBe(DEFAULT_N);
  });

  it('control constants are the required ranges', () => {
    expect(MIN_TERMS).toBe(1);
    expect(MAX_TERMS).toBe(60);
    expect(DEFAULT_TERMS).toBe(24);
    expect(MIN_N).toBe(1);
    expect(MAX_N).toBe(32);
    expect(DEFAULT_N).toBe(4);
  });
});
