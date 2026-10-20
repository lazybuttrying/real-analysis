import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  compose,
  exampleData,
  functionProofsModel,
  FUNCTION_EXAMPLE_INIT,
  FUNCTION_EXAMPLE_OPTIONS,
  inverse,
  isInjective,
  isSurjective,
  type FunctionExample,
  type FunctionExampleData,
} from '../src/chapters/limits/models/functionProofs';
import { functionProofsProblems } from '../src/chapters/limits/problems/function-proofs';

const compute = (state: ControlState): FunctionExampleData => syncCompute(functionProofsModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['example']);

describe('function-proofs: injective-chain', () => {
  it('g∘f injective forces f injective, g not injective', () => {
    const d = exampleData('injective-chain');
    expect(d.f).toEqual([0, 1]);
    expect(d.g).toEqual([0, 1, 0]);
    expect(d.gf).toEqual([0, 1]); // compose(g, f) = [g(0), g(1)]
    expect(d.gfInjective).toBe(true);
    expect(d.fInjective).toBe(true);
    expect(d.gInjective).toBe(false); // g(0) = g(2) = 0
  });

  it('g∘f is computed by compose(g, f)', () => {
    const d = exampleData('injective-chain');
    expect(compose(d.g, d.f)).toEqual(d.gf);
  });
});

describe('function-proofs: surjective-chain', () => {
  it('g∘f surjective forces g surjective, f not surjective', () => {
    const d = exampleData('surjective-chain');
    expect(d.gf).toEqual([0, 1]);
    expect(d.gfSurjective).toBe(true); // onto C = [0, 1]
    expect(d.gSurjective).toBe(true);
    expect(d.fSurjective).toBe(false); // f misses 2 in B = [0, 1, 2]
  });

  it('the sizes are A = 2, B = 3, C = 2', () => {
    const d = exampleData('surjective-chain');
    expect(d.sizes).toEqual({ A: 2, B: 3, C: 2 });
  });
});

describe('function-proofs: bijective', () => {
  it('f, g bijective, g∘f is the identity', () => {
    const d = exampleData('bijective');
    expect(d.f).toEqual([1, 2, 0]);
    expect(d.g).toEqual([2, 0, 1]);
    expect(d.gf).toEqual([0, 1, 2]); // [g(1), g(2), g(0)]
    expect(d.fInverse).toEqual([2, 0, 1]);
    expect(d.gInverse).toEqual([1, 2, 0]);
    expect(isInjective(d.gf)).toBe(true);
    expect(isSurjective(d.gf, 3)).toBe(true);
  });

  it('(g∘f)^-1 = f^-1 ∘ g^-1 by brute force', () => {
    const d = exampleData('bijective');
    const lhs = inverse(d.gf);
    expect(lhs).toEqual([0, 1, 2]);
    const rhs = compose(d.fInverse as number[], d.gInverse as number[]);
    expect(rhs).toEqual([0, 1, 2]);
    expect(lhs).toEqual(rhs);
  });
});

describe('function-proofs: pure helpers', () => {
  it('inverse returns null for non-permutations', () => {
    expect(inverse([0, 1, 0])).toBeNull(); // not injective
    expect(inverse([0, 1, 1])).toBeNull();
    expect(inverse([1, 2, 0])).toEqual([2, 0, 1]);
  });

  it('isSurjective checks every codomain element', () => {
    expect(isSurjective([0, 1], 2)).toBe(true);
    expect(isSurjective([0, 1], 3)).toBe(false);
  });
});

describe('function-proofs: model select control', () => {
  it('unknown and missing values fall back to the init option', () => {
    expect(compute({}).example).toBe(FUNCTION_EXAMPLE_INIT);
    expect(compute({ example: 'nope' }).example).toBe(FUNCTION_EXAMPLE_INIT);
    expect(compute({ example: 'bijective' }).example).toBe('bijective');
  });

  it('declared options match the task spec', () => {
    expect([...FUNCTION_EXAMPLE_OPTIONS]).toEqual(['injective-chain', 'surjective-chain', 'bijective']);
    expect(FUNCTION_EXAMPLE_INIT).toBe('injective-chain');
  });

  it('every declared option has valid example data', () => {
    for (const option of FUNCTION_EXAMPLE_OPTIONS as readonly FunctionExample[]) {
      const d = compute({ example: option });
      expect(d.example).toBe(option);
      expect(d.gf).toEqual(compose(d.g, d.f));
    }
  });
});

describe('function-proofs: problem presets use only declared control keys', () => {
  it("every preset key is 'example' with a valid option value", () => {
    expect(functionProofsProblems).toHaveLength(3);
    for (const problem of functionProofsProblems) {
      for (const [key, value] of Object.entries(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
        expect(FUNCTION_EXAMPLE_OPTIONS).toContain(value);
      }
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = functionProofsProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
