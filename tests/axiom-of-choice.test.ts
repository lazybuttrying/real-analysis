import { describe, expect, it } from 'vitest';
import { checkProblemsShape, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  axiomOfChoiceData,
  axiomOfChoiceModel,
  binSize,
  choiceIndex,
  M_INIT,
  M_MAX,
  M_MIN,
  SEED_INIT,
  SEED_MAX,
  SEED_MIN,
  type AxiomOfChoiceData,
} from '../src/chapters/limits/models/axiomOfChoice';
import { axiomOfChoiceProblems } from '../src/chapters/limits/problems/axiom-of-choice';

const compute = (state: ControlState): AxiomOfChoiceData => syncCompute(axiomOfChoiceModel, state);

describe('axiom-of-choice: the deterministic family', () => {
  it('every bin size is in [2, 5] for all m and seed', () => {
    for (let seed = SEED_MIN; seed <= SEED_MAX; seed++) {
      for (let m = M_MIN; m <= M_MAX; m++) {
        for (let i = 0; i < m; i++) {
          const k = binSize(i, seed);
          expect(k).toBeGreaterThanOrEqual(2);
          expect(k).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it('every choice index satisfies 0 <= c_i < k_i', () => {
    for (let seed = SEED_MIN; seed <= SEED_MAX; seed++) {
      for (let m = M_MIN; m <= M_MAX; m++) {
        for (let i = 0; i < m; i++) {
          const c = choiceIndex(i, seed);
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThan(binSize(i, seed));
        }
      }
    }
  });

  it('(m, seed) = (3, 1): bins [3, 4, 5], choices [2, 3, 4]', () => {
    const data = axiomOfChoiceData(3, 1);
    expect(data.bins).toEqual([3, 4, 5]);
    expect(data.choices).toEqual([2, 3, 4]);
  });

  it('(m, seed) = (4, 2): bins [3, 5, 3, 5], choices [1, 1, 2, 0]', () => {
    const data = axiomOfChoiceData(4, 2);
    expect(data.bins).toEqual([3, 5, 3, 5]);
    expect(data.choices).toEqual([1, 1, 2, 0]);
  });

  it('(m, seed) = (5, 5): bins [3, 4, 5, 2, 3], choices [1, 3, 0, 1, 0]', () => {
    const data = axiomOfChoiceData(5, 5);
    expect(data.bins).toEqual([3, 4, 5, 2, 3]);
    expect(data.choices).toEqual([1, 3, 0, 1, 0]);
  });
});

describe('axiom-of-choice: model compute', () => {
  it('reads m and seed from the control state, clamps, defaults to init', () => {
    expect(compute({}).m).toBe(M_INIT);
    expect(compute({}).seed).toBe(SEED_INIT);
    expect(compute({ m: 9 }).m).toBe(M_MAX);
    expect(compute({ m: 0 }).m).toBe(M_MIN);
    expect(compute({ seed: 99 }).seed).toBe(SEED_MAX);
    expect(compute({ seed: -2 }).seed).toBe(SEED_MIN);
    const data = compute({ m: 4, seed: 2 });
    expect(data.bins).toEqual([3, 5, 3, 5]);
    expect(data.choices).toEqual([1, 1, 2, 0]);
  });

  it('exports the expected data keys', () => {
    const data = compute({ m: 3, seed: 1 });
    for (const key of ['m', 'seed', 'bins', 'choices'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('axiom-of-choice: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(axiomOfChoiceProblems);
    for (const p of axiomOfChoiceProblems) {
      const m = Number(p.preset['m']);
      const seed = Number(p.preset['seed']);
      expect(m).toBeGreaterThanOrEqual(M_MIN);
      expect(m).toBeLessThanOrEqual(M_MAX);
      expect(seed).toBeGreaterThanOrEqual(SEED_MIN);
      expect(seed).toBeLessThanOrEqual(SEED_MAX);
    }
  });

  it('the three ids are ac-finite, ac-product, ac-right-inverse', () => {
    expect(axiomOfChoiceProblems.map((p) => p.id)).toEqual([
      'ac-finite',
      'ac-product',
      'ac-right-inverse',
    ]);
  });
});
