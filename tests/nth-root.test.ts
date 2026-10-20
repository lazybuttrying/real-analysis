import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  A_INIT,
  A_MAX,
  A_MIN,
  BISECT_STEPS,
  bisectRoot,
  CURVE_SAMPLES,
  N_INIT,
  N_MAX,
  N_MIN,
  nthRootData,
  nthRootModel,
  type NthRootData,
} from '../src/chapters/limits/models/nthRoot';
import { nthRootProblems } from '../src/chapters/limits/problems/nth-root';

const compute = (state: ControlState): NthRootData => syncCompute(nthRootModel, state);

describe('nth-root: bisection numerics', () => {
  it('bisectRoot(2, 2) agrees with sqrt(2) to 1e-12', () => {
    expectCloseTo(bisectRoot(2, 2), Math.SQRT2, 1e-12);
    expectCloseTo(bisectRoot(2, 2), 1.414213562373095, 1e-12);
  });

  it('bisectRoot(8, 3) = 2 exactly', () => {
    expect(bisectRoot(8, 3)).toBe(2);
  });

  it('bisectRoot(0.5, 5) = Math.pow(0.5, 1/5) exactly', () => {
    expect(bisectRoot(0.5, 5)).toBe(Math.pow(0.5, 1 / 5));
  });

  it('bisectRoot(a, n)^n recovers a to 1e-9 on the control grid', () => {
    for (let a = A_MIN; a <= A_MAX + 1e-9; a += 0.5) {
      for (let n = N_MIN; n <= N_MAX; n++) {
        expectCloseTo(Math.pow(bisectRoot(a, n), n), a, 1e-9);
      }
    }
  });

  it('the root is strictly increasing in a for each n', () => {
    for (let n = N_MIN; n <= N_MAX; n++) {
      let prev = -Infinity;
      for (let a = A_MIN; a <= A_MAX + 1e-9; a += 0.5) {
        const r = bisectRoot(a, n);
        expect(r).toBeGreaterThan(prev);
        prev = r;
      }
    }
  });

  it('60 bisection steps shrink the bracket far below 1e-12', () => {
    // After BISECT_STEPS halvings the bracket width is max(1,a)/2^60.
    expect(A_MAX / 2 ** BISECT_STEPS).toBeLessThan(1e-12);
  });
});

describe('nth-root: the 10-step error bound from problem 3', () => {
  it('x_10 = 1.416015625 and |x_10 - sqrt(2)| < 2/2^10', () => {
    let lo = 0;
    let hi = 2;
    let mid = 0;
    for (let k = 0; k < 10; k++) {
      mid = (lo + hi) / 2;
      if (mid * mid < 2) lo = mid;
      else hi = mid;
    }
    expect(mid).toBe(1.416015625);
    expect(Math.abs(mid - Math.SQRT2)).toBeLessThan(2 / 2 ** 10);
  });
});

describe('nth-root: nthRootData', () => {
  it('curve spans [0, xMax] and eCurve is exactly the set E', () => {
    const data = nthRootData(2, 2);
    expect(data.xMax).toBe(2);
    expect(data.curve).toHaveLength(CURVE_SAMPLES + 1);
    expect(data.curve[0]?.x).toBe(0);
    expectCloseTo(data.curve[data.curve.length - 1]?.x ?? -1, data.xMax, 1e-15);
    for (const s of data.eCurve) {
      expect(s.x).toBeLessThan(data.root);
      expect(Math.pow(s.x, data.n)).toBeLessThan(data.a);
    }
    // Every eCurve sample sits under the curve; eCurve stops at the root.
    const lastE = data.eCurve[data.eCurve.length - 1];
    expect(lastE?.x).toBeLessThan(data.root);
  });

  it('root and mathRoot agree to 1e-9', () => {
    const data = nthRootData(2, 2);
    expectCloseTo(data.root, data.mathRoot, 1e-9);
  });
});

describe('nth-root: model compute', () => {
  it('reads a and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).a).toBe(A_INIT);
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ a: 100 }).a).toBe(A_MAX);
    expect(compute({ a: -3 }).a).toBe(A_MIN);
    expect(compute({ n: 9 }).n).toBe(N_MAX);
    expect(compute({ n: 1 }).n).toBe(N_MIN);
    expect(compute({ a: 3, n: 4 }).a).toBe(3);
    expect(compute({ a: 3, n: 4 }).n).toBe(4);
  });

  it('exports the expected data keys', () => {
    const data = compute({ a: 2, n: 2 });
    for (const key of ['a', 'n', 'root', 'mathRoot', 'xMax', 'curve', 'eCurve'] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('nth-root: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(nthRootProblems);
    for (const p of nthRootProblems) {
      expect(p.preset['a']).toBe(2);
      expect(p.preset['n']).toBe(2);
    }
  });

  it('the three ids are nth-root-proof, nth-root-unique, nth-root-approx', () => {
    expect(nthRootProblems.map((p) => p.id)).toEqual([
      'nth-root-proof',
      'nth-root-unique',
      'nth-root-approx',
    ]);
  });
});
