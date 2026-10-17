import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import { absoluteData, absoluteModel, type AbsoluteData } from '../src/chapters/series/models/absolute';
import { testsData, testsModel, type TestsData } from '../src/chapters/series/models/tests';

const computeTests = (state: ControlState): TestsData => syncCompute(testsModel, state);
const computeAbsolute = (state: ControlState): AbsoluteData => syncCompute(absoluteModel, state);

describe('tests: factorial ratio test', () => {
  it('r_1..r_5 = 1/2, 1/3, 1/4, 1/5, 1/6', () => {
    const ratios = testsData('factorial', 12).ratios ?? [];
    const expected = [1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6];
    expect(ratios).toHaveLength(12);
    expected.forEach((e, i) => expect(ratios[i]).toBeCloseTo(e, 12));
  });

  it('limit L = 0 and verdict ratio-converges', () => {
    const data = testsData('factorial', 12);
    expect(data.limit).toBe(0);
    expect(data.verdict).toBe('ratio-converges');
  });

  it('r_12 = 1/13 ~ 0.0769 (preset-caption figure)', () => {
    const ratios = testsData('factorial', 12).ratios ?? [];
    expect(ratios[11]).toBeCloseTo(1 / 13, 10);
    expect(ratios[11]).toBeCloseTo(0.0769, 4);
  });
});

describe('tests: n-over-2n ratio test', () => {
  it('r_1..r_5 = 1, 3/4, 2/3, 5/8, 3/5', () => {
    const ratios = testsData('n-over-2n', 12).ratios ?? [];
    expect(ratios.slice(0, 5)).toEqual([1, 3 / 4, 2 / 3, 5 / 8, 3 / 5]);
  });

  it('limit L = 1/2 and verdict ratio-converges', () => {
    const data = testsData('n-over-2n', 12);
    expect(data.limit).toBe(0.5);
    expect(data.verdict).toBe('ratio-converges');
  });

  it('r_12 = 13/24 ~ 0.5417 (preset-caption figure)', () => {
    const ratios = testsData('n-over-2n', 12).ratios ?? [];
    expect(ratios[11]).toBeCloseTo(13 / 24, 10);
    expect(ratios[11]).toBeCloseTo(0.5417, 4);
  });
});

describe('tests: comparison test', () => {
  it('1/(k^2+1) < 1/k^2 for k = 1..10 and majors are 1/k^2', () => {
    const data = testsData('inv-square-plus', 12);
    expect(data.majors).not.toBeNull();
    expect(data.verdict).toBe('comparison-converges');
    for (let k = 1; k <= 10; k++) {
      expect(data.terms[k - 1]).toBeLessThan(data.majors?.[k - 1] ?? 0);
      expect(data.majors?.[k - 1]).toBeCloseTo(1 / (k * k), 12);
      expect(data.terms[k - 1]).toBeCloseTo(1 / (k * k + 1), 12);
    }
  });

  it('ratio fields are null for the comparison series', () => {
    const data = testsData('inv-square-plus', 12);
    expect(data.ratios).toBeNull();
    expect(data.limit).toBeNull();
  });
});

describe('absolute: abs series converges absolutely', () => {
  it('S_60 ~ -0.82233 and the limit is -pi^2/12 ~ -0.822467 (three decimals agree)', () => {
    const data = absoluteData('abs', 60);
    expect(data.signed[59]).toBeCloseTo(-0.8223304587, 8);
    expect(data.signedLimit).toBeCloseTo((-Math.PI * Math.PI) / 12, 12);
    expect(data.signedLimit).toBeCloseTo(-0.822467, 6);
    expectCloseTo((data.signed[59] ?? 0), data.signedLimit, 0.001);
  });

  it('T_60 ~ 1.62841 below pi^2/6 ~ 1.64493', () => {
    const data = absoluteData('abs', 60);
    expect(data.absolute[59]).toBeCloseTo(1.6284055175, 8);
    expect(data.absoluteLimit).toBeCloseTo((Math.PI * Math.PI) / 6, 12);
    expect(data.absoluteLimit).toBeCloseTo(1.644934, 6);
    expect(data.absolute[59]).toBeLessThan(data.absoluteLimit ?? 0);
  });
});

describe('absolute: cond series converges conditionally', () => {
  it('S_60 ~ -0.68488 toward -ln 2 ~ -0.693147', () => {
    const data = absoluteData('cond', 60);
    expect(data.signed[59]).toBeCloseTo(-0.684883282, 7);
    expect(data.signedLimit).toBe(-Math.LN2);
    expect(data.signedLimit).toBeCloseTo(-0.693147, 6);
  });

  it('T_60 = H_60 ~ 4.67987 and the absolute series has no finite limit', () => {
    const data = absoluteData('cond', 60);
    expect(data.absolute[59]).toBeCloseTo(4.679870413, 7);
    expect(data.absoluteLimit).toBeNull();
  });
});

describe('models: compute() accepts every problem preset', () => {
  it('tests presets {series, n}', () => {
    for (const series of ['factorial', 'n-over-2n', 'inv-square-plus'] as const) {
      const data = computeTests({ series, n: 12 });
      expect(data.series).toBe(series);
      expect(data.n).toBe(12);
      expect(data.terms).toHaveLength(12);
    }
  });

  it('absolute presets {series, n}', () => {
    const abs = computeAbsolute({ series: 'abs', n: 60 });
    expect(abs.series).toBe('abs');
    expect(abs.n).toBe(60);
    expect(abs.signed).toHaveLength(60);
    expect(abs.absolute).toHaveLength(60);

    const cond = computeAbsolute({ series: 'cond', n: 60 });
    expect(cond.series).toBe('cond');
    expect(cond.absoluteLimit).toBeNull();
  });

  it('unknown series fall back to the init option', () => {
    expect(computeTests({ series: '??', n: 12 }).series).toBe('factorial');
    expect(computeAbsolute({ series: '??', n: 60 }).series).toBe('abs');
  });

  it('exported raw data functions match compute()', () => {
    expect(testsData('factorial', 12)).toEqual(computeTests({ series: 'factorial', n: 12 }));
    expect(absoluteData('cond', 60)).toEqual(computeAbsolute({ series: 'cond', n: 60 }));
  });
});

describe('proof figures: constants cited in the six proofs', () => {
  it('e - 1 ~ 1.71828 (factorial sum)', () => {
    expect(Math.E - 1).toBeCloseTo(1.71828, 5);
  });

  it('pi^2/6 ~ 1.644934 (basel result cited by tests and absolute)', () => {
    expect((Math.PI * Math.PI) / 6).toBeCloseTo(1.644934, 6);
  });

  it('-pi^2/12 ~ -0.822467 (alternating p=2 sum)', () => {
    expect((-Math.PI * Math.PI) / 12).toBeCloseTo(-0.822467, 6);
  });

  it('-ln 2 ~ -0.693147 (alternating harmonic sum)', () => {
    expect(-Math.LN2).toBeCloseTo(-0.693147, 6);
  });
});
