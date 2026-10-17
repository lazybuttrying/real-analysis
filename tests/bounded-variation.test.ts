import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  boundedVariationFnValue,
  boundedVariationModel,
  DEFAULT_FN,
  DEFAULT_N,
  MAX_N,
  MIN_N,
  SINE_VARIATION_TRUE,
  wildExtrema,
  wildVariationLowerBound,
  type BoundedVariationData,
} from '../src/chapters/calculus/models/boundedVariation';
import { boundedVariationProblems } from '../src/chapters/calculus/problems/bounded-variation';

const compute = (state: ControlState): BoundedVariationData =>
  boundedVariationModel.compute(state) as BoundedVariationData;

/** Independent variation: fresh uniform-partition walk, no reuse of model internals. */
function naiveVariation(fn: 'sine' | 'wild', n: number): number {
  const f = (x: number): number => (fn === 'wild' ? (x === 0 ? 0 : x * Math.sin(1 / x)) : Math.sin(2 * Math.PI * x));
  let sum = 0;
  for (let i = 1; i < n; i++) sum += Math.abs(f(i / (n - 1)) - f((i - 1) / (n - 1)));
  return sum;
}

describe('bounded-variation: the sine example converges to V = 4', () => {
  it('V_200 is within 0.05 of 4', () => {
    const data = compute({ fn: 'sine', n: 200 });
    expect(data.variation).toBeCloseTo(4, 1);
    expect(data.variation).toBeCloseTo(naiveVariation('sine', 200), 12);
  });

  it('SINE_VARIATION_TRUE is 4', () => {
    expect(SINE_VARIATION_TRUE).toBe(4);
  });

  it('V_n increases toward 4 as n grows', () => {
    const vals = [10, 20, 40, 80, 160].map((n) => compute({ fn: 'sine', n }).variation);
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i]).toBeGreaterThan(vals[i - 1] ?? 0);
    }
    expect(vals[vals.length - 1]).toBeLessThan(4);
  });

  it('model matches the independent naive walk for every n in 2..200', () => {
    for (const n of [2, 3, 10, 40, 100, 200]) {
      const data = compute({ fn: 'sine', n });
      expect(data.variation).toBeCloseTo(naiveVariation('sine', n), 12);
      expect(data.cumulative[data.cumulative.length - 1]).toBeCloseTo(data.variation, 15);
      expect(data.xs).toHaveLength(n);
      expect(data.ys).toHaveLength(n);
      expect(data.cumulative).toHaveLength(n);
    }
  });
});

describe('bounded-variation: the wild example is not of bounded variation', () => {
  it('V_n grows: monotone on the grid [40, 60, 80, 100] and V_200 > V_40', () => {
    const grid = [40, 60, 80, 100];
    const vals = grid.map((n) => compute({ fn: 'wild', n }).variation);
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i]).toBeGreaterThan(vals[i - 1] ?? 0);
    }
    expect(compute({ fn: 'wild', n: 200 }).variation).toBeGreaterThan(compute({ fn: 'wild', n: 40 }).variation);
  });

  it('V_200 exceeds the proof lower bound sum_{k=1}^{200}(u_k + v_k)', () => {
    expect(wildVariationLowerBound(200)).toBeGreaterThan(1);
    expect(wildVariationLowerBound(200)).toBeCloseTo(1.684908, 6);
  });

  it('u_1 = 1/(2.5 pi) ~= 0.12732 and v_1 = 1/(3.5 pi) ~= 0.09095', () => {
    const { u, v } = wildExtrema(1);
    expect(u).toBeCloseTo(1 / (2.5 * Math.PI), 15);
    expect(u).toBeCloseTo(0.12732, 5);
    expect(v).toBeCloseTo(1 / (3.5 * Math.PI), 15);
    expect(v).toBeCloseTo(0.09095, 5);
  });

  it('the extremum algebra holds: 0 < v_k < u_k and u_k + v_k >= 1/(2 pi k)', () => {
    for (let k = 1; k <= 200; k++) {
      const { u, v } = wildExtrema(k);
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThan(u);
      expect(u).toBeLessThan(1);
      // u_k + v_k >= 2 v_k >= 1/(2 pi k)
      expect(u + v).toBeGreaterThanOrEqual(2 * v - 1e-15);
      expect(2 * v).toBeGreaterThanOrEqual(1 / (2 * Math.PI * k) - 1e-15);
    }
  });

  it('the lower bound dominates H_N/(2 pi) and both diverge with N', () => {
    let h = 0;
    for (let k = 1; k <= 200; k++) h += 1 / k;
    expect(wildVariationLowerBound(200)).toBeGreaterThanOrEqual(h / (2 * Math.PI) - 1e-12);
    expect(h / (2 * Math.PI)).toBeCloseTo(0.93551768, 8);
    // bound strictly grows with N
    expect(wildVariationLowerBound(200)).toBeGreaterThan(wildVariationLowerBound(100));
  });

  it('fn value helper: f(0) = 0 and sign oscillation at the extrema', () => {
    expect(boundedVariationFnValue('wild', 0)).toBe(0);
    for (const k of [1, 5, 50]) {
      const { u, v } = wildExtrema(k);
      expect(boundedVariationFnValue('wild', u)).toBeCloseTo(u, 14);
      expect(boundedVariationFnValue('wild', v)).toBeCloseTo(-v, 14);
    }
  });
});

describe('bounded-variation: problem caption numbers check out', () => {
  it('problem 1 preset fn = sine, n = 40: V_40 ~= 3.9968', () => {
    const data = compute({ fn: 'sine', n: 40 });
    expect(data.variation).toBeCloseTo(3.996756, 6);
  });

  it('problem 2 preset fn = sine, n = 80: V_80 ~= 3.9992', () => {
    const data = compute({ fn: 'sine', n: 80 });
    expect(data.variation).toBeCloseTo(3.999209, 6);
  });

  it('problem 3 preset fn = wild, n = 200: V_200 ~= 2.1388 past the 1.6849 bound', () => {
    const data = compute({ fn: 'wild', n: 200 });
    expect(data.variation).toBeCloseTo(2.138768, 6);
    expect(data.variation).toBeGreaterThan(wildVariationLowerBound(200));
    expect(wildVariationLowerBound(200)).toBeCloseTo(1.684908, 6);
  });
});

describe('bounded-variation: problem presets use the scene control keys', () => {
  it('has 3 problems with ids, bilingual text, and valid presets', () => {
    expect(boundedVariationProblems).toHaveLength(3);
    expect(boundedVariationProblems.map((p) => p.id)).toEqual(['bv-monotone', 'bv-jordan', 'bv-wild']);
    for (const problem of boundedVariationProblems) {
      expect(problem.statement.ko.length).toBeGreaterThan(0);
      expect(problem.statement.en.length).toBeGreaterThan(0);
      expect(problem.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of problem.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      // preset uses only the scene's real control keys 'fn' and 'n'
      const keys = Object.keys(problem.preset).sort();
      expect(keys).toEqual(['fn', 'n']);
      const fn = String(problem.preset['fn']);
      expect(['sine', 'wild']).toContain(fn);
      const n = Number(problem.preset['n']);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(MIN_N);
      expect(n).toBeLessThanOrEqual(MAX_N);
    }
  });
});

describe('bounded-variation: model.compute reads and clamps the controls', () => {
  it('clamps n below 2 to 2 and above 200 to 200', () => {
    expect(compute({ fn: 'sine', n: -5 }).n).toBe(MIN_N);
    expect(compute({ fn: 'sine', n: 10000 }).n).toBe(MAX_N);
  });

  it('defaults to fn = sine and n = 40 on missing/invalid input', () => {
    expect(compute({}).fn).toBe(DEFAULT_FN);
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ fn: 'sine', n: NaN }).n).toBe(DEFAULT_N);
  });

  it('falls back to the default function on an unknown fn value', () => {
    expect(compute({ fn: 'cosine', n: 40 }).fn).toBe(DEFAULT_FN);
    expect(compute({ fn: 'wild', n: 40 }).fn).toBe('wild');
  });

  it('returns n points with a consistent running variation', () => {
    const data = compute({ fn: 'sine', n: 10 });
    expect(data.n).toBe(10);
    expect(data.xs[0]).toBe(0);
    expect(data.xs[9]).toBe(1);
    expect(data.cumulative[0]).toBe(0);
    for (let i = 1; i < 10; i++) {
      const step = Math.abs((data.ys[i] ?? 0) - (data.ys[i - 1] ?? 0));
      expect(data.cumulative[i]).toBeCloseTo((data.cumulative[i - 1] ?? 0) + step, 15);
    }
    expect(data.variation).toBeCloseTo(data.cumulative[9] ?? 0, 15);
  });
});
