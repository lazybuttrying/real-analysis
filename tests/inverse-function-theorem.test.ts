import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  A_MAX,
  A_MIN,
  DEFAULT_A,
  DEFAULT_FN,
  fEval,
  fpEval,
  gpEval,
  inverseEval,
  inverseFunctionTheoremData,
  inverseFunctionTheoremModel,
  type InverseFunctionTheoremData,
} from '../src/chapters/calculus/models/inverseFunctionTheorem';
import { inverseFunctionTheoremProblems } from '../src/chapters/calculus/problems/inverse-function-theorem';

const compute = (state: ControlState): InverseFunctionTheoremData =>
  syncCompute(inverseFunctionTheoremModel, state);

describe('inverse-function-theorem: f and f prime', () => {
  it('f(x) = x^3 + x and f prime (x) = 3x^2 + 1 at sample points', () => {
    expectCloseTo(fEval('x^3+x', 1), 2, 1e-15);
    expectCloseTo(fEval('x^3+x', -1), -2, 1e-15);
    expectCloseTo(fpEval('x^3+x', 1), 4, 1e-15);
    expectCloseTo(fpEval('x^3+x', 0), 1, 1e-15);
  });

  it('f(x) = e^x and f prime (x) = e^x at sample points', () => {
    expectCloseTo(fEval('e^x', 0), 1, 1e-15);
    expectCloseTo(fEval('e^x', 1), Math.E, 1e-15);
    expectCloseTo(fpEval('e^x', 1), Math.E, 1e-15);
  });
});

describe('inverse-function-theorem: numerical inverse', () => {
  it('bisection inverts x^3+x: g(2) = 1, g(-2) = -1', () => {
    expectCloseTo(inverseEval('x^3+x', 2), 1, 1e-12);
    expectCloseTo(inverseEval('x^3+x', -2), -1, 1e-12);
  });

  it('round trip: f(g(y)) = y on the bisection range', () => {
    for (const y of [-9, -2, 0, 0.5, 2, 10, 60]) {
      expectCloseTo(fEval('x^3+x', inverseEval('x^3+x', y)), y, 1e-9);
    }
  });

  it('log inverts e^x: g(e) = 1', () => {
    expectCloseTo(inverseEval('e^x', Math.E), 1, 1e-12);
    expectCloseTo(inverseEval('e^x', 1), 0, 1e-12);
  });
});

describe('inverse-function-theorem: the slope product is 1', () => {
  it('a = 1, x^3+x: f prime (1) = 4, g prime (2) = 1/4, product exactly 1', () => {
    const data = inverseFunctionTheoremData('x^3+x', 1);
    expectCloseTo(data.b, 2, 1e-15);
    expectCloseTo(data.fpA, 4, 1e-15);
    expectCloseTo(data.gpB, 0.25, 1e-15);
    expectCloseTo(data.slopeProduct, 1, 1e-15);
    expectCloseTo(Math.abs(4 * data.gpB - 1), 0, 1e-15);
  });

  it('a = 1, e^x: f prime (1) = e, g prime (e) = 1/e, product 1', () => {
    const data = inverseFunctionTheoremData('e^x', 1);
    expectCloseTo(data.b, Math.E, 1e-15);
    expectCloseTo(data.fpA, Math.E, 1e-15);
    expectCloseTo(data.gpB, 1 / Math.E, 1e-12);
    expectCloseTo(data.slopeProduct, 1, 1e-12);
  });

  it('product stays 1 across the slider range for both functions', () => {
    for (const fn of ['x^3+x', 'e^x']) {
      for (const a of [A_MIN, -0.5, 0, 0.7, 1.3, A_MAX]) {
        const data = inverseFunctionTheoremData(fn, a);
        expect(Math.abs(data.slopeProduct - 1)).toBeLessThan(1e-9);
        // g prime via the formula agrees with 1 / f prime (a).
        expectCloseTo(data.gpB, 1 / data.fpA, 1e-9);
      }
    }
  });

  it('gCurve is the pointwise reflection of fCurve across y = x', () => {
    const data = inverseFunctionTheoremData('x^3+x', 1);
    expect(data.gCurve).toHaveLength(data.fCurve.length);
    data.fCurve.forEach((p, i) => {
      const q = data.gCurve[i];
      expect(q?.x).toBe(p.y);
      expect(q?.y).toBe(p.x);
    });
  });

  it('tangent lines pass through the probed points with the right slopes', () => {
    const data = inverseFunctionTheoremData('x^3+x', 1);
    const mid = data.fTangent[Math.floor(data.fTangent.length / 2)];
    expectCloseTo(mid?.x ?? 0, data.a, 1e-12);
    expectCloseTo(mid?.y ?? 0, data.b, 1e-9);
    const gMid = data.gTangent[Math.floor(data.gTangent.length / 2)];
    expectCloseTo(gMid?.x ?? 0, data.b, 1e-12);
    expectCloseTo(gMid?.y ?? 0, data.a, 1e-9);
    // Slope check on the tangent samples.
    const t0 = data.fTangent[0];
    const t1 = data.fTangent[data.fTangent.length - 1];
    expectCloseTo(
      ((t1?.y ?? 0) - (t0?.y ?? 0)) / ((t1?.x ?? 0) - (t0?.x ?? 0)),
      data.fpA,
      1e-9,
    );
  });
});

describe('inverse-function-theorem: model compute', () => {
  it('reads fn and a from the control state, clamps a', () => {
    const data = compute({ fn: 'e^x', a: 0.5 });
    expect(data.fn).toBe('e^x');
    expect(data.a).toBe(0.5);
    expect(compute({ fn: 'x^3+x', a: 500 }).a).toBe(A_MAX);
    expect(compute({ fn: 'x^3+x', a: -500 }).a).toBe(A_MIN);
    expect(compute({}).fn).toBe(DEFAULT_FN);
    expect(compute({}).a).toBe(DEFAULT_A);
    expect(compute({ fn: 'bogus', a: 1 }).fn).toBe(DEFAULT_FN);
  });

  it('exports the expected data keys', () => {
    const data = compute({ fn: 'x^3+x', a: 1 });
    for (const key of [
      'fn',
      'a',
      'b',
      'fpA',
      'gpB',
      'slopeProduct',
      'fCurve',
      'gCurve',
      'fTangent',
      'gTangent',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });

  it('gpEval agrees with the model gpB', () => {
    expectCloseTo(gpEval('x^3+x', 2), 0.25, 1e-12);
    expectCloseTo(gpEval('e^x', Math.E), 1 / Math.E, 1e-12);
  });
});

describe('inverse-function-theorem: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(inverseFunctionTheoremProblems);
  });

  it('the three ids are ift-1d, ift-formula, ift-fails with valid presets', () => {
    expect(inverseFunctionTheoremProblems.map((p) => p.id)).toEqual([
      'ift-1d',
      'ift-formula',
      'ift-fails',
    ]);
    for (const p of inverseFunctionTheoremProblems) {
      expect(['x^3+x', 'e^x']).toContain(p.preset['fn']);
      const a = Number(p.preset['a']);
      expect(a).toBeGreaterThanOrEqual(A_MIN);
      expect(a).toBeLessThanOrEqual(A_MAX);
    }
  });
});
