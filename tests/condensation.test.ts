import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  blockData,
  condensationModel,
  DEFAULT_BLOCK,
  DEFAULT_SERIES,
  MAX_BLOCK,
  MIN_BLOCK,
  termValue,
  type CondensationData,
} from '../src/chapters/series/models/condensation';

const compute = (state: ControlState): CondensationData => condensationModel.compute(state) as CondensationData;

/** Independent block sum: sum_{k=2^n}^{2^{n+1}-1} a_k, no reuse of blockData internals. */
function naiveBlockSum(series: 'inv-n' | 'inv-n2' | 'inv-n-logn', n: number): number {
  let sum = 0;
  for (let k = 2 ** n; k <= 2 ** (n + 1) - 1; k++) {
    if (series === 'inv-n') sum += 1 / k;
    else if (series === 'inv-n2') sum += 1 / (k * k);
    else sum += k >= 2 ? 1 / (k * Math.log(k)) : 0;
  }
  return sum;
}

describe('condensation: termValue is the intended sequence', () => {
  it('returns 1/k, 1/k^2, 1/(k ln k)', () => {
    expect(termValue('inv-n', 4)).toBe(0.25);
    expect(termValue('inv-n2', 4)).toBe(1 / 16);
    expect(termValue('inv-n-logn', 4)).toBeCloseTo(1 / (4 * Math.log(4)), 15);
  });

  it('1/(k ln k) is 0 at k = 1 and for k < 1', () => {
    expect(termValue('inv-n-logn', 1)).toBe(0);
    expect(termValue('inv-n', 0)).toBe(0);
    expect(termValue('inv-n', -3)).toBe(0);
  });
});

describe('condensation: block sums and condensed terms are exact', () => {
  it('block 2 of 1/n: B_2 = 0.759524, C_2 = 1 exactly', () => {
    const b = blockData('inv-n', 2);
    expect(b.start).toBe(4);
    expect(b.end).toBe(7);
    expect(b.blockSum).toBeCloseTo(0.759524, 6);
    expect(b.condensed).toBe(1);
  });

  it('block 2 of 1/n^2: B_2 = 0.150686, C_2 = 0.25 exactly', () => {
    const b = blockData('inv-n2', 2);
    expect(b.blockSum).toBeCloseTo(0.150686, 6);
    expect(b.condensed).toBe(0.25);
  });

  it('block 2 of 1/(n ln n): B_2 = 0.471036, C_2 = 1/(2 ln 2) = 0.721348', () => {
    const b = blockData('inv-n-logn', 2);
    expect(b.blockSum).toBeCloseTo(0.471036, 6);
    expect(b.condensed).toBeCloseTo(1 / (2 * Math.log(2)), 12);
    expect(b.condensed).toBeCloseTo(0.721348, 6);
  });

  it('block sums match the independent naive summation', () => {
    for (const series of ['inv-n', 'inv-n2', 'inv-n-logn'] as const) {
      for (let n = 0; n <= MAX_BLOCK; n++) {
        expect(blockData(series, n).blockSum).toBeCloseTo(naiveBlockSum(series, n), 14);
      }
    }
  });
});

describe('condensation: the sandwich C_{n+1}/2 <= B_n <= C_n holds', () => {
  it('for every block 0..6 of 1/n and 1/n^2', () => {
    for (const series of ['inv-n', 'inv-n2'] as const) {
      for (let n = 0; n <= MAX_BLOCK; n++) {
        const b = blockData(series, n);
        const nextC = blockData(series, n + 1).condensed;
        expect(nextC / 2).toBeLessThanOrEqual(b.blockSum + 1e-15);
        expect(b.blockSum).toBeLessThanOrEqual(b.condensed + 1e-15);
      }
    }
  });

  it('for blocks 1..6 of 1/(n ln n) (block 0 is exempt: a_1 is undefined)', () => {
    for (let n = 1; n <= MAX_BLOCK; n++) {
      const b = blockData('inv-n-logn', n);
      const nextC = blockData('inv-n-logn', n + 1).condensed;
      expect(nextC / 2).toBeLessThanOrEqual(b.blockSum + 1e-15);
      expect(b.blockSum).toBeLessThanOrEqual(b.condensed + 1e-15);
    }
  });

  it('caption numbers: C_3/2 = 0.5, 0.0625, 0.240449 for the three sequences', () => {
    expect(blockData('inv-n', 3).condensed / 2).toBe(0.5);
    expect(blockData('inv-n2', 3).condensed / 2).toBe(0.0625);
    expect(blockData('inv-n-logn', 3).condensed / 2).toBeCloseTo(1 / (6 * Math.log(2)), 12);
    expect(blockData('inv-n-logn', 3).condensed / 2).toBeCloseTo(0.240449, 6);
  });
});

describe('condensation: partial sums stay inside the condensed bounds', () => {
  it('S_{2^{n+1}-1} <= T_n = sum_{j=0}^{n} C_j for every n', () => {
    for (const series of ['inv-n', 'inv-n2', 'inv-n-logn'] as const) {
      for (let n = 0; n <= MAX_BLOCK; n++) {
        const data = compute({ series, block: n });
        expect(data.partialUpToBlock).toBeLessThanOrEqual(data.condensedPartial + 1e-12);
      }
    }
  });

  it('condensed partials grow like the divergence/convergence says', () => {
    const invN = compute({ series: 'inv-n', block: 6 });
    expect(invN.condensedPartial).toBe(7); // C_n = 1 for every n
    const invN2 = compute({ series: 'inv-n2', block: 6 });
    expect(invN2.condensedPartial).toBeCloseTo(1.984375, 12); // sum_{j=0}^{6} 2^{-j}
    // inv-n-logn: C_n = 1/(n ln 2) from n=1, harmonic times 1/ln 2
    const log = compute({ series: 'inv-n-logn', block: 6 });
    let harmonic = 0;
    for (let n = 1; n <= 6; n++) harmonic += 1 / n;
    expect(log.condensedPartial).toBeCloseTo(harmonic / Math.log(2), 12);
  });

  it('problem-3 display identities hold numerically', () => {
    expect(1 / (Math.log(2) ** 2)).toBeCloseTo(2.081369, 6);
    expect((Math.PI ** 2 / 6) / (Math.log(2) ** 2)).toBeCloseTo(3.423715, 6);
  });
});

describe('condensation: model.compute reads and clamps the controls', () => {
  it('highlights the requested block and reports it', () => {
    const data = compute({ series: 'inv-n', block: 2 });
    expect(data.blockIndex).toBe(2);
    expect(data.highlight.start).toBe(4);
    expect(data.highlight.end).toBe(7);
    expect(data.blocks.length).toBe(MAX_BLOCK + 1);
  });

  it('clamps block below 0 to 0 and above 6 to 6', () => {
    expect(compute({ series: 'inv-n', block: -3 }).blockIndex).toBe(MIN_BLOCK);
    expect(compute({ series: 'inv-n', block: 100 }).blockIndex).toBe(MAX_BLOCK);
  });

  it('defaults to series inv-n and block 2 on missing/invalid input', () => {
    expect(compute({}).series).toBe(DEFAULT_SERIES);
    expect(compute({}).blockIndex).toBe(DEFAULT_BLOCK);
    expect(compute({ series: 'bogus', block: 2 }).series).toBe(DEFAULT_SERIES);
    expect(compute({ series: 'inv-n', block: NaN }).blockIndex).toBe(DEFAULT_BLOCK);
  });
});
