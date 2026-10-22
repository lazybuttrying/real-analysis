import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  arcLengthData,
  arcLengthModel,
  arcLengthPoint,
  CURVE_SAMPLES,
  DEFAULT_CURVE,
  DEFAULT_N,
  exactLength,
  MAX_N,
  MIN_N,
  polygonalLength,
  type ArcLengthData,
} from '../src/chapters/calculus/models/arcLength';
import { arcLengthProblems } from '../src/chapters/calculus/problems/arc-length';

const compute = (state: ControlState): ArcLengthData => syncCompute(arcLengthModel, state);

/** Composite Simpson on [a, b] with nn (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, nn: number): number {
  const h = (b - a) / nn;
  let s = f(a) + f(b);
  for (let i = 1; i < nn; i++) s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return (s * h) / 3;
}

const PARABOLA_EXACT = Math.sqrt(5) / 2 + Math.asinh(2) / 4;

describe('arc-length: exact lengths', () => {
  it('circle exact length is pi / 2', () => {
    expectCloseTo(exactLength('circle'), Math.PI / 2, 1e-15);
    expectCloseTo(exactLength('circle'), 1.5707963267948966, 1e-15);
  });

  it('parabola exact length is sqrt(5)/2 + asinh(2)/4 = sqrt(5)/2 + ln(2 + sqrt(5))/4', () => {
    expectCloseTo(PARABOLA_EXACT, Math.sqrt(5) / 2 + Math.log(2 + Math.sqrt(5)) / 4, 1e-15);
    expectCloseTo(exactLength('parabola'), PARABOLA_EXACT, 1e-15);
    expectCloseTo(exactLength('parabola'), 1.4789428575445974, 1e-12);
  });

  it('parabola exact value cross-checks against fine Simpson integration of sqrt(1 + 4x^2)', () => {
    const numeric = simpson((x) => Math.sqrt(1 + 4 * x * x), 0, 1, 10000);
    expectCloseTo(numeric, PARABOLA_EXACT, 1e-9);
    expectCloseTo(numeric, exactLength('parabola'), 1e-9);
  });
});

describe('arc-length: the circle', () => {
  it('L_8 equals the hand-verifiable chord formula 2n sin(pi / (4n)) at n = 8, to 1e-12', () => {
    const data = compute({ curve: 'circle', n: 8 });
    const formula = 2 * 8 * Math.sin(Math.PI / (4 * 8));
    expectCloseTo(data.length, formula, 1e-12);
    expectCloseTo(data.length, 16 * Math.sin(Math.PI / 32), 1e-12);
    expectCloseTo(data.length, 1.5682742452729697, 1e-12);
  });

  it('every circle segment at n = 8 is the same chord 2 sin(pi / 32)', () => {
    const data = compute({ curve: 'circle', n: 8 });
    expect(data.segmentLengths).toHaveLength(8);
    for (const seg of data.segmentLengths) {
      expectCloseTo(seg, 2 * Math.sin(Math.PI / 32), 1e-12);
    }
  });

  it('L_n increases in n = 4, 8, 16, 32 and stays at or below pi / 2', () => {
    const values = [4, 8, 16, 32].map((n) => compute({ curve: 'circle', n }).length);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]!).toBeGreaterThan(values[i - 1]!);
    }
    for (const v of values) expect(v).toBeLessThanOrEqual(Math.PI / 2);
  });

  it('partition points lie on the unit circle, from (1, 0) to (0, 1)', () => {
    const data = compute({ curve: 'circle', n: 8 });
    expect(data.points).toHaveLength(9);
    expectCloseTo(data.points[0]!.x, 1, 1e-15);
    expectCloseTo(data.points[0]!.y, 0, 1e-15);
    expectCloseTo(data.points[8]!.x, 0, 1e-12);
    expectCloseTo(data.points[8]!.y, 1, 1e-15);
    for (const pt of data.points) {
      expectCloseTo(pt.x * pt.x + pt.y * pt.y, 1, 1e-12);
    }
  });
});

describe('arc-length: the parabola', () => {
  it('L_n increases in n = 4, 8, 16, 32 and stays at or below the exact length', () => {
    const values = [4, 8, 16, 32].map((n) => compute({ curve: 'parabola', n }).length);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]!).toBeGreaterThan(values[i - 1]!);
    }
    for (const v of values) expect(v).toBeLessThanOrEqual(PARABOLA_EXACT);
  });

  it('L_4 and L_8 are the verified values cited in the refinement problem caption', () => {
    expectCloseTo(compute({ curve: 'parabola', n: 4 }).length, 1.4742804757093162, 1e-12);
    expectCloseTo(compute({ curve: 'parabola', n: 8 }).length, 1.4777779851313877, 1e-12);
    expect(compute({ curve: 'parabola', n: 4 }).length).toBeLessThan(
      compute({ curve: 'parabola', n: 8 }).length,
    );
  });

  it('partition points lie on y = x^2, from (0, 0) to (1, 1)', () => {
    const data = compute({ curve: 'parabola', n: 8 });
    expect(data.points).toHaveLength(9);
    expectCloseTo(data.points[0]!.x, 0, 1e-15);
    expectCloseTo(data.points[0]!.y, 0, 1e-15);
    expectCloseTo(data.points[8]!.x, 1, 1e-15);
    expectCloseTo(data.points[8]!.y, 1, 1e-15);
    for (const pt of data.points) {
      expectCloseTo(pt.y, pt.x * pt.x, 1e-15);
    }
  });
});

describe('arc-length: model structure', () => {
  it('segment lengths sum to L_n, error is exact - L_n >= 0, and L_n <= L_{2n} <= L', () => {
    for (const curve of ['circle', 'parabola'] as const) {
      for (const n of [1, 3, 8, 17, 64]) {
        const data = compute({ curve, n });
        const sum = data.segmentLengths.reduce((a, b) => a + b, 0);
        expect(data.segmentLengths).toHaveLength(n);
        expect(data.points).toHaveLength(n + 1);
        expectCloseTo(sum, data.length, 1e-12);
        expectCloseTo(data.length, polygonalLength(curve, n), 1e-12);
        expectCloseTo(data.length2n, polygonalLength(curve, 2 * n), 1e-12);
        expectCloseTo(data.error, data.exact - data.length, 1e-15);
        expect(data.error).toBeGreaterThanOrEqual(0);
        expect(data.length).toBeLessThanOrEqual(data.length2n + 1e-15);
        expect(data.length2n).toBeLessThanOrEqual(data.exact + 1e-15);
      }
    }
  });

  it('exposes 200 dense curve samples matching arcLengthPoint, endpoints included', () => {
    for (const curve of ['circle', 'parabola'] as const) {
      const data = compute({ curve, n: 8 });
      expect(data.curvePoints).toHaveLength(CURVE_SAMPLES);
      expect(CURVE_SAMPLES).toBe(200);
      const first = arcLengthPoint(curve, 0);
      const last = arcLengthPoint(curve, 1);
      expectCloseTo(data.curvePoints[0]!.x, first.x, 1e-15);
      expectCloseTo(data.curvePoints[0]!.y, first.y, 1e-15);
      expectCloseTo(data.curvePoints[CURVE_SAMPLES - 1]!.x, last.x, 1e-12);
      expectCloseTo(data.curvePoints[CURVE_SAMPLES - 1]!.y, last.y, 1e-12);
    }
  });

  it('exports the expected data keys', () => {
    const data = compute({ curve: 'circle', n: 8 });
    for (const key of [
      'curve', 'n', 'points', 'segmentLengths', 'length', 'length2n', 'exact', 'error', 'curvePoints',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });

  it('defaults to the circle with n = 8, and clamps n into [1, 64]', () => {
    expect(DEFAULT_CURVE).toBe('circle');
    expect(DEFAULT_N).toBe(8);
    expect(MIN_N).toBe(1);
    expect(MAX_N).toBe(64);
    const fallback = compute({});
    expect(fallback.curve).toBe('circle');
    expect(fallback.n).toBe(8);
    expect(compute({ curve: 'nope', n: 8 }).curve).toBe('circle');
    expect(compute({ curve: 'circle', n: 0 }).n).toBe(1);
    expect(compute({ curve: 'circle', n: 1000 }).n).toBe(64);
    expect(compute({ curve: 'circle', n: NaN }).n).toBe(8);
    expect(compute({ curve: 'circle', n: 8.9 }).n).toBe(8);
  });

  it('arcLengthData agrees with the model', () => {
    const viaModel = compute({ curve: 'parabola', n: 12 });
    const direct = arcLengthData('parabola', 12);
    expect(direct.n).toBe(viaModel.n);
    expectCloseTo(direct.length, viaModel.length, 1e-15);
    expectCloseTo(direct.exact, viaModel.exact, 1e-15);
  });
});

describe('arc-length: the non-rectifiable example behind problem 3', () => {
  it('at t_k = 2 / (pi (2k + 1)), f(t_k) = (-1)^k t_k for f(x) = x sin(1 / x)', () => {
    const f = (x: number): number => (x === 0 ? 0 : x * Math.sin(1 / x));
    for (let k = 0; k <= 20; k++) {
      const tk = 2 / (Math.PI * (2 * k + 1));
      expectCloseTo(f(tk), (k % 2 === 0 ? 1 : -1) * tk, 1e-12);
    }
  });

  it('the lower bound (1 / pi) H_K is valid: sum_k t_k >= (1 / pi) sum_k 1 / (k + 1)', () => {
    for (const K of [1, 5, 20, 100]) {
      let sumT = 0;
      let harmonic = 0;
      for (let k = 0; k < K; k++) {
        sumT += 2 / (Math.PI * (2 * k + 1));
        harmonic += 1 / (k + 1);
      }
      expect(sumT).toBeGreaterThanOrEqual(harmonic / Math.PI - 1e-15);
      // and the key step 2 / (2k + 1) >= 1 / (k + 1) holds termwise
      for (let k = 0; k < K; k++) {
        expect(2 / (2 * k + 1)).toBeGreaterThanOrEqual(1 / (k + 1));
      }
    }
  });
});

describe('arc-length: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(arcLengthProblems);
  });

  it('the three ids are circle-arc-via-formula, refinement-monotonicity, non-rectifiable-graph', () => {
    expect(arcLengthProblems.map((p) => p.id)).toEqual([
      'circle-arc-via-formula',
      'refinement-monotonicity',
      'non-rectifiable-graph',
    ]);
  });

  it('presets are valid for the scene controls and match their captions', () => {
    expect(arcLengthProblems[0]!.preset).toEqual({ curve: 'circle', n: 16 });
    expect(arcLengthProblems[1]!.preset).toEqual({ curve: 'parabola', n: 4 });
    expect(arcLengthProblems[2]!.preset).toEqual({ curve: 'circle', n: 64 });
    for (const p of arcLengthProblems) {
      const data = compute(p.preset);
      expect(['circle', 'parabola']).toContain(data.curve);
      expect(data.n).toBeGreaterThanOrEqual(MIN_N);
      expect(data.n).toBeLessThanOrEqual(MAX_N);
      // the preset, run through the model, yields the state it names
      expect(data.curve).toBe(String(p.preset['curve']));
      expect(data.n).toBe(Number(p.preset['n']));
    }
  });
});
