import { describe, expect, it } from 'vitest';
import { checkProblemsShape, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CHAINS,
  CHAIN_INIT,
  CHAIN_MAX,
  CHAIN_MIN,
  COVERS,
  ELEMENTS,
  maximalElements,
  upperBounds,
  zornLemmaModel,
  type ZornLemmaData,
} from '../src/chapters/limits/models/zornLemma';
import { zornLemmaProblems } from '../src/chapters/limits/problems/zorn-lemma';

const compute = (state: ControlState): ZornLemmaData => syncCompute(zornLemmaModel, state);

describe('zorn-lemma: the divisors-of-12 poset', () => {
  it('has the expected elements and cover relations', () => {
    expect([...ELEMENTS]).toEqual([1, 2, 3, 4, 6, 12]);
    expect(COVERS).toHaveLength(7);
    for (const [a, b] of COVERS) {
      expect(b % (a as number)).toBe(0);
    }
  });

  it('each of the three chains is a genuine chain', () => {
    expect(CHAINS).toHaveLength(3);
    for (const chain of CHAINS) {
      for (let i = 0; i < chain.length - 1; i++) {
        const a = chain[i] as number;
        const b = chain[i + 1] as number;
        expect(b % a).toBe(0);
      }
    }
    expect([...(CHAINS[0] ?? [])]).toEqual([1, 2, 4, 12]);
    expect([...(CHAINS[1] ?? [])]).toEqual([1, 2, 6, 12]);
    expect([...(CHAINS[2] ?? [])]).toEqual([1, 3, 6, 12]);
  });
});

describe('zorn-lemma: upper bounds', () => {
  it('upperBounds([1, 2, 4, 12]) = [12]', () => {
    expect(upperBounds([1, 2, 4, 12])).toEqual([12]);
  });

  it('upperBounds([1, 2]) = [2, 4, 6, 12]', () => {
    expect(upperBounds([1, 2])).toEqual([2, 4, 6, 12]);
  });

  it('upperBounds([1, 3]) = [3, 6, 12]', () => {
    expect(upperBounds([1, 3])).toEqual([3, 6, 12]);
  });

  it('upperBounds([1]) is the whole poset', () => {
    expect(upperBounds([1])).toEqual([1, 2, 3, 4, 6, 12]);
  });

  it('every one of the three chains has exactly one upper bound, 12', () => {
    for (const chain of CHAINS) {
      expect(upperBounds(chain)).toEqual([12]);
    }
  });
});

describe('zorn-lemma: maximal elements', () => {
  it('maximalElements() = [12]', () => {
    expect(maximalElements()).toEqual([12]);
  });
});

describe('zorn-lemma: model compute', () => {
  it('reads chain from the control state, clamps, defaults to init', () => {
    expect(compute({}).selected).toBe(CHAIN_INIT);
    expect(compute({ chain: 5 }).selected).toBe(CHAIN_MAX);
    expect(compute({ chain: -1 }).selected).toBe(CHAIN_MIN);
    const data = compute({ chain: 1 });
    expect(data.selected).toBe(1);
    expect([...data.selectedChain]).toEqual([1, 2, 6, 12]);
    expect(data.upperBounds).toEqual([12]);
    expect(data.maximal).toEqual([12]);
  });

  it('exports the expected data keys', () => {
    const data = compute({ chain: 0 });
    for (const key of [
      'elements',
      'covers',
      'chains',
      'selected',
      'selectedChain',
      'upperBounds',
      'maximal',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('zorn-lemma: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(zornLemmaProblems);
    for (const p of zornLemmaProblems) {
      const chain = Number(p.preset['chain']);
      expect(chain).toBeGreaterThanOrEqual(CHAIN_MIN);
      expect(chain).toBeLessThanOrEqual(CHAIN_MAX);
    }
  });

  it('the three ids are zorn-finite, zorn-divisors12, zorn-implies-ac', () => {
    expect(zornLemmaProblems.map((p) => p.id)).toEqual([
      'zorn-finite',
      'zorn-divisors12',
      'zorn-implies-ac',
    ]);
  });
});
