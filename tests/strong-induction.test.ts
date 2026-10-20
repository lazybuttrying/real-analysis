import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  factorize,
  factorTree,
  isPrime,
  smallestPrimeFactor,
  strongInductionModel,
  strongInductionValues,
  treeLeaves,
  STRONG_N_INIT,
  STRONG_N_MAX,
  STRONG_N_MIN,
  type StrongInductionData,
} from '../src/chapters/limits/models/strongInduction';
import { strongInductionProblems } from '../src/chapters/limits/problems/strong-induction';

const compute = (state: ControlState): StrongInductionData => syncCompute(strongInductionModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['n']);

describe('strong-induction: isPrime and smallestPrimeFactor', () => {
  it('primes below 60', () => {
    const primes: number[] = [];
    for (let n = 2; n < 60; n++) if (isPrime(n)) primes.push(n);
    expect(primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]);
  });

  it('smallestPrimeFactor returns the number itself for primes', () => {
    expect(smallestPrimeFactor(2)).toBe(2);
    expect(smallestPrimeFactor(29)).toBe(29);
    expect(smallestPrimeFactor(36)).toBe(2);
    expect(smallestPrimeFactor(49)).toBe(7);
    expect(smallestPrimeFactor(35)).toBe(5);
  });
});

describe('strong-induction: factorize', () => {
  it('factorize(30) = [2, 3, 5] and factorize(36) = [2, 2, 3, 3]', () => {
    expect(factorize(30)).toEqual([2, 3, 5]);
    expect(factorize(36)).toEqual([2, 2, 3, 3]);
    expect(factorize(2)).toEqual([2]);
    expect(factorize(60)).toEqual([2, 2, 3, 5]);
  });

  it('for all n in 2..60: product is n, all factors prime, nondecreasing', () => {
    for (let n = STRONG_N_MIN; n <= STRONG_N_MAX; n++) {
      const f = factorize(n);
      expect(f.reduce((acc, x) => acc * x, 1), `n=${n}`).toBe(n);
      for (const x of f) expect(isPrime(x), `n=${n} factor=${x}`).toBe(true);
      for (let i = 1; i < f.length; i++) expect(f[i]).toBeGreaterThanOrEqual(f[i - 1] as number);
    }
  });
});

describe('strong-induction: factorTree(30)', () => {
  it('30 -> [2, 15] -> 15 -> [3, 5], leaves [2, 3, 5]', () => {
    const tree = factorTree(30);
    expect(tree.value).toBe(30);
    expect(tree.isPrime).toBe(false);
    expect(tree.children).toHaveLength(2);
    const [c0, c1] = tree.children as [typeof tree, typeof tree];
    expect(c0.value).toBe(2);
    expect(c0.isPrime).toBe(true);
    expect(c1.value).toBe(15);
    expect(c1.isPrime).toBe(false);
    const [g0, g1] = c1.children as [typeof tree, typeof tree];
    expect(g0.value).toBe(3);
    expect(g1.value).toBe(5);
    expect(g0.isPrime).toBe(true);
    expect(g1.isPrime).toBe(true);
    expect(treeLeaves(tree)).toEqual([2, 3, 5]);
  });
});

describe('strong-induction: factorTree(36)', () => {
  it('36 -> [2, 18] -> 18 -> [2, 9] -> 9 -> [3, 3], leaves [2, 2, 3, 3]', () => {
    const tree = factorTree(36);
    expect(tree.value).toBe(36);
    expect(tree.children.map((c) => c.value)).toEqual([2, 18]);
    const node18 = tree.children[1];
    expect(node18?.value).toBe(18);
    expect(node18?.children.map((c) => c.value)).toEqual([2, 9]);
    const node9 = node18?.children[1];
    expect(node9?.value).toBe(9);
    expect(node9?.children.map((c) => c.value)).toEqual([3, 3]);
    expect(treeLeaves(tree)).toEqual([2, 2, 3, 3]);
    expect(treeLeaves(tree).reduce((acc, x) => acc * x, 1)).toBe(36);
  });
});

describe('strong-induction: tree invariants for all n in 2..60', () => {
  it('leaves equal factorize(n) and multiply back to n', () => {
    for (let n = STRONG_N_MIN; n <= STRONG_N_MAX; n++) {
      const d = strongInductionValues(n);
      expect(d.leaves, `n=${n}`).toEqual(factorize(n));
      expect(d.leavesProduct, `n=${n}`).toBe(n);
      expect(d.factorsProduct, `n=${n}`).toBe(n);
      if (d.nIsPrime) {
        expect(d.split, `n=${n}`).toBeNull();
        expect(d.tree.children, `n=${n}`).toHaveLength(0);
      } else {
        expect(d.split, `n=${n}`).not.toBeNull();
        const s = d.split as { a: number; b: number };
        expect(s.a * s.b, `n=${n}`).toBe(n);
        expect(s.a, `n=${n}`).toBeLessThan(n);
        expect(s.b, `n=${n}`).toBeLessThan(n);
        expect(s.a, `n=${n}`).toBeGreaterThan(1);
      }
    }
  });
});

describe('strong-induction: model clamping', () => {
  it('out-of-range n is clamped and rounded', () => {
    expect(compute({ n: 99 }).n).toBe(STRONG_N_MAX);
    expect(compute({ n: -5 }).n).toBe(STRONG_N_MIN);
    expect(compute({ n: 7.4 }).n).toBe(7);
  });

  it('non-finite n falls back to init', () => {
    expect(compute({ n: NaN }).n).toBe(STRONG_N_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(STRONG_N_MIN).toBe(2);
    expect(STRONG_N_MAX).toBe(60);
    expect(STRONG_N_INIT).toBe(30);
  });
});

describe('strong-induction: problem presets use only declared control keys', () => {
  it('every preset key is n, and preset values are in range', () => {
    expect(strongInductionProblems).toHaveLength(3);
    for (const problem of strongInductionProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const n = Number(problem.preset['n']);
      expect(Number.isInteger(n) && n >= STRONG_N_MIN && n <= STRONG_N_MAX).toBe(true);
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = strongInductionProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('strong-induction: problems match the model numbers', () => {
  it('problem 2 numbers: 12 = 3·4, 13 = 2·4 + 5, 14 = 4 + 2·5, 15 = 3·5, 30 = 5·4 + 2·5', () => {
    expect(3 * 4).toBe(12);
    expect(2 * 4 + 5).toBe(13);
    expect(4 + 2 * 5).toBe(14);
    expect(3 * 5).toBe(15);
    expect(5 * 4 + 2 * 5).toBe(30);
    expect(30 - 4 * 4).toBe(14);
  });

  it('problem 3: 36 prime divisors are 2 and 3', () => {
    const d = strongInductionValues(36);
    expect(new Set(d.factors)).toEqual(new Set([2, 3]));
  });
});
