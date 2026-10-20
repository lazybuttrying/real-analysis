import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  contradictionModel,
  euclidData,
  primeFactors,
  smallestPrimeFactor,
  CONTRADICTION_K_INIT,
  CONTRADICTION_K_MAX,
  CONTRADICTION_K_MIN,
  FIRST_PRIMES,
  type EuclidData,
} from '../src/chapters/limits/models/contradiction';
import { contradictionProblems } from '../src/chapters/limits/problems/contradiction';

const compute = (state: ControlState): EuclidData => syncCompute(contradictionModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['k']);

describe('contradiction: known Euclid values', () => {
  it('k = 1: P = 2, N = 3, spf = 3', () => {
    const d = euclidData(1);
    expect(d.primes).toEqual([2]);
    expect(d.product).toBe(2);
    expect(d.n).toBe(3);
    expect(d.remainders).toEqual([1]);
    expect(d.spf).toBe(3);
    expect(d.factors).toEqual([3]);
    expect(d.spfIsNew).toBe(true);
  });

  it('k = 2: P = 6, N = 7', () => {
    const d = euclidData(2);
    expect(d.primes).toEqual([2, 3]);
    expect(d.product).toBe(6);
    expect(d.n).toBe(7);
    expect(d.remainders).toEqual([1, 1]);
    expect(d.spf).toBe(7);
    expect(d.factors).toEqual([7]);
  });

  it('k = 3: P = 30, N = 31 (prime)', () => {
    const d = euclidData(3);
    expect(d.product).toBe(30);
    expect(d.n).toBe(31);
    expect(d.spf).toBe(31);
    expect(d.factors).toEqual([31]);
  });

  it('k = 4: P = 210, N = 211 (prime)', () => {
    const d = euclidData(4);
    expect(d.product).toBe(210);
    expect(d.n).toBe(211);
    expect(d.spf).toBe(211);
    expect(d.factors).toEqual([211]);
  });

  it('k = 5: P = 2310, N = 2311 (prime)', () => {
    const d = euclidData(5);
    expect(d.product).toBe(2310);
    expect(d.n).toBe(2311);
    expect(d.spf).toBe(2311);
    expect(d.factors).toEqual([2311]);
  });

  it('k = 6: P = 30030, N = 30031 = 59 * 509 (N is NOT prime)', () => {
    const d = euclidData(6);
    expect(d.product).toBe(30030);
    expect(d.n).toBe(30031);
    expect(d.spf).toBe(59);
    expect(d.factors).toEqual([59, 509]);
    expect(59 * 509).toBe(30031);
    expect(d.spfIsNew).toBe(true);
  });

  it('k = 7: P = 510510, N = 510511 = 19 * 97 * 277', () => {
    const d = euclidData(7);
    expect(d.product).toBe(510510);
    expect(d.n).toBe(510511);
    expect(d.spf).toBe(19);
    expect(d.factors).toEqual([19, 97, 277]);
    expect(19 * 97 * 277).toBe(510511);
  });

  it('k = 8: P = 9699690, N = 9699691 = 347 * 27953', () => {
    const d = euclidData(8);
    expect(d.product).toBe(9699690);
    expect(d.n).toBe(9699691);
    expect(d.spf).toBe(347);
    expect(d.factors).toEqual([347, 27953]);
    expect(347 * 27953).toBe(9699691);
  });
});

describe('contradiction: the Euclid invariant for k = 1..8', () => {
  it('every remainder is 1 and the smallest prime factor is new', () => {
    for (let k = 1; k <= 8; k++) {
      const d = euclidData(k);
      expect(d.k).toBe(k);
      expect(d.remainders.every((r) => r === 1), `k=${k}: all remainders must be 1`).toBe(true);
      expect(d.spf, `k=${k}`).toBeGreaterThan(d.primes[d.primes.length - 1]!);
      expect(d.spfIsNew, `k=${k}`).toBe(true);
      expect(d.factors[0], `k=${k}`).toBe(d.spf);
      const rebuilt = d.factors.reduce((acc, f) => acc * f, 1);
      expect(rebuilt, `k=${k}: factors multiply back to N`).toBe(d.n);
      expect(d.product + 1, `k=${k}: N = P + 1`).toBe(d.n);
    }
  });

  it('the model compute agrees with euclidData', () => {
    const d = compute({ k: 4 });
    const e = euclidData(4);
    expect(d.k).toBe(e.k);
    expect(d.product).toBe(e.product);
    expect(d.n).toBe(e.n);
    expect(d.spf).toBe(e.spf);
    expect(d.factors).toEqual(e.factors);
  });
});

describe('contradiction: trial division helpers', () => {
  it('smallestPrimeFactor finds the right divisor', () => {
    expect(smallestPrimeFactor(2)).toBe(2);
    expect(smallestPrimeFactor(9)).toBe(3);
    expect(smallestPrimeFactor(59)).toBe(59);
    expect(smallestPrimeFactor(30031)).toBe(59);
    expect(smallestPrimeFactor(211)).toBe(211);
  });

  it('primeFactors lists factors with multiplicity in order', () => {
    expect(primeFactors(12)).toEqual([2, 2, 3]);
    expect(primeFactors(30031)).toEqual([59, 509]);
    expect(primeFactors(2)).toEqual([2]);
  });
});

describe('contradiction: control clamping and ranges', () => {
  it('out-of-range inputs are clamped to the slider range', () => {
    expect(compute({ k: 99 }).k).toBe(CONTRADICTION_K_MAX);
    expect(compute({ k: -3 }).k).toBe(CONTRADICTION_K_MIN);
    expect(compute({ k: 4.6 }).k).toBe(5);
  });

  it('non-finite inputs fall back to the slider init', () => {
    expect(compute({ k: NaN }).k).toBe(CONTRADICTION_K_INIT);
    expect(compute({ k: 'x' }).k).toBe(CONTRADICTION_K_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(CONTRADICTION_K_MIN).toBe(1);
    expect(CONTRADICTION_K_MAX).toBe(8);
    expect(CONTRADICTION_K_INIT).toBe(4);
    expect(FIRST_PRIMES.length).toBe(10);
  });
});

describe('contradiction: problem presets use only declared control keys', () => {
  it('every preset key is in {k} and every preset value is valid', () => {
    expect(contradictionProblems).toHaveLength(3);
    for (const problem of contradictionProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const k = Number(problem.preset['k']);
      expect(Number.isInteger(k), `${problem.id}: preset k must be an integer`).toBe(true);
      expect(k, `${problem.id}: preset k in range`).toBeGreaterThanOrEqual(CONTRADICTION_K_MIN);
      expect(k, `${problem.id}: preset k in range`).toBeLessThanOrEqual(CONTRADICTION_K_MAX);
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = contradictionProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('the headline preset is k = 6 (the composite-N subtlety)', () => {
    expect(contradictionProblems[0]!.preset['k']).toBe(6);
  });
});
