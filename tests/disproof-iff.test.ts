import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  claimData,
  disproofIffModel,
  DISPROOF_CLAIM_INIT,
  DISPROOF_CLAIMS,
  DISPROOF_N_INIT,
  DISPROOF_N_MAX,
  DISPROOF_N_MIN,
  isPrime,
  type DisproofData,
} from '../src/chapters/limits/models/disproofIff';
import { disproofIffProblems } from '../src/chapters/limits/problems/disproof-iff';

const compute = (state: ControlState): DisproofData => syncCompute(disproofIffModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['claim', 'n']);

describe('disproof-iff: isPrime by trial division', () => {
  it('2 is the only even prime below 60', () => {
    const primes: number[] = [];
    for (let n = 2; n < 60; n++) {
      if (isPrime(n)) primes.push(n);
    }
    expect(primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]);
  });

  it('non-integers and values below 2 are not prime', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(-7)).toBe(false);
    expect(isPrime(2.5)).toBe(false);
  });
});

describe('disproof-iff: primes-odd fails first at 2', () => {
  it('2 is prime and even: the smallest counterexample', () => {
    const d = claimData('primes-odd', 2);
    expect(d.verdict).toBe(false);
    expect(d.nIsPrime).toBe(true);
    expect(d.nIsEven).toBe(true);
    expect(d.nIsPrimesOddCounterexample).toBe(true);
    expect(d.smallest.label).toBe('n = 2');
  });

  it('every odd prime below 60 is odd (the claim holds there)', () => {
    for (let n = 3; n < 60; n += 2) {
      if (!isPrime(n)) continue;
      const d = claimData('primes-odd', n);
      expect(d.nIsPrime).toBe(true);
      expect(d.nIsEven).toBe(false);
      expect(d.nIsPrimesOddCounterexample).toBe(false);
    }
  });
});

describe('disproof-iff: div4', () => {
  it('n = 2 is a counterexample and no n < 2 in range is', () => {
    const d = claimData('div4', 2);
    expect(d.n2).toBe(4);
    expect(d.div4Hypothesis).toBe(true); // 4 | 4
    expect(d.div4Conclusion).toBe(false); // 4 does not divide 2
    expect(d.div4IsCounterexample).toBe(true);
    expect(d.smallest.value).toContain('n^2 = 4');
  });

  it('n = 6 and n = 10 are also counterexamples', () => {
    for (const n of [6, 10]) {
      const d = claimData('div4', n);
      expect(d.div4Hypothesis, `n=${n}`).toBe(true);
      expect(d.div4Conclusion, `n=${n}`).toBe(false);
      expect(d.div4IsCounterexample, `n=${n}`).toBe(true);
    }
  });

  it('hypothesis false implies not a counterexample (n = 3)', () => {
    const d = claimData('div4', 3);
    expect(d.div4Hypothesis).toBe(false);
    expect(d.div4IsCounterexample).toBe(false);
  });

  it('hypothesis and conclusion both true implies not a counterexample (n = 4)', () => {
    const d = claimData('div4', 4);
    expect(d.div4Hypothesis).toBe(true);
    expect(d.div4Conclusion).toBe(true);
    expect(d.div4IsCounterexample).toBe(false);
  });
});

describe('disproof-iff: irrational-sum', () => {
  it('sqrt(2) + (-sqrt(2)) is exactly 0, rational', () => {
    const d = claimData('irrational-sum', 16);
    expect(d.irrA).toBe(Math.SQRT2);
    expect(d.irrB).toBe(-Math.SQRT2);
    expect(d.irrSum).toBe(Math.SQRT2 - Math.SQRT2);
    expect(d.irrSum).toBe(0);
    expect(d.irrIsCounterexample).toBe(true);
  });

  it('the slider value does not affect the verdict data', () => {
    const d1 = claimData('irrational-sum', 2);
    const d2 = claimData('irrational-sum', 60);
    expect(d1.irrSum).toBe(d2.irrSum);
    expect(d1.smallest.label).toBe(d2.smallest.label);
  });
});

describe('disproof-iff: abs-equal', () => {
  it('(n, -n) is a counterexample for every n in the slider range', () => {
    for (let n = DISPROOF_N_MIN; n <= DISPROOF_N_MAX; n++) {
      const d = claimData('abs-equal', n);
      expect(d.absXValue).toBe(n);
      expect(d.absYValue).toBe(n);
      expect(d.absX).not.toBe(d.absY);
      expect(d.absIsCounterexample, `n=${n}`).toBe(true);
    }
  });

  it('smallest counterexample is (1, -1)', () => {
    const d = claimData('abs-equal', 1);
    expect(d.smallest.label).toBe('(x, y) = (1, -1)');
    expect(d.absIsCounterexample).toBe(true);
  });
});

describe('disproof-iff: model clamping', () => {
  it('out-of-range n is clamped and rounded', () => {
    expect(compute({ claim: 'div4', n: 99 }).n).toBe(DISPROOF_N_MAX);
    expect(compute({ claim: 'div4', n: -5 }).n).toBe(DISPROOF_N_MIN);
    expect(compute({ claim: 'div4', n: 7.6 }).n).toBe(8);
  });

  it('non-finite n falls back to init', () => {
    expect(compute({ claim: 'div4', n: NaN }).n).toBe(DISPROOF_N_INIT);
  });

  it('unknown claim falls back to the init claim', () => {
    expect(compute({ claim: 'bogus', n: 2 }).claim).toBe(DISPROOF_CLAIM_INIT);
    expect(compute({ n: 2 }).claim).toBe(DISPROOF_CLAIM_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(DISPROOF_N_MIN).toBe(2);
    expect(DISPROOF_N_MAX).toBe(60);
    expect(DISPROOF_N_INIT).toBe(16);
    expect(DISPROOF_CLAIM_INIT).toBe('primes-odd');
    expect([...DISPROOF_CLAIMS]).toEqual(['primes-odd', 'div4', 'irrational-sum', 'abs-equal']);
  });
});

describe('disproof-iff: problem presets use only declared control keys', () => {
  it('every preset key is in {claim, n} and every value is valid', () => {
    expect(disproofIffProblems).toHaveLength(3);
    for (const problem of disproofIffProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const claim = String(problem.preset['claim']);
      const n = Number(problem.preset['n']);
      expect([...DISPROOF_CLAIMS]).toContain(claim);
      expect(Number.isInteger(n) && n >= DISPROOF_N_MIN && n <= DISPROOF_N_MAX).toBe(true);
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = disproofIffProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
