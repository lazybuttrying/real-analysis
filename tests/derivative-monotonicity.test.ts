import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CURVE_SAMPLES,
  monotonicityData,
  monotonicityFunction,
  monotonicityFunctionKey,
  monotonicityModel,
  signOf,
  type MonotonicityData,
} from '../src/chapters/calculus/models/derivativeMonotonicity';
import { derivativeMonotonicityProblems } from '../src/chapters/calculus/problems/derivative-monotonicity';

const compute = (state: ControlState): MonotonicityData => syncCompute(monotonicityModel, state);

describe('derivative-monotonicity: analytic derivatives', () => {
  it('cubic f(x) = x^3 - 3x has f(0) = 0, f\'(0) = -3, f\'(2) = 9', () => {
    const { f, fp } = monotonicityFunction('cubic');
    expect(f(0)).toBe(0);
    expect(fp(0)).toBe(-3);
    expect(fp(2)).toBe(9);
    expect(fp(1)).toBe(0);
    expect(fp(-1)).toBe(0);
  });

  it('sine f\' = cos; exp f\' = exp', () => {
    const sine = monotonicityFunction('sine');
    expectCloseTo(sine.fp(0), 1, 1e-15);
    expectCloseTo(sine.fp(Math.PI / 2), 0, 1e-15);
    const exp = monotonicityFunction('exp');
    expectCloseTo(exp.fp(0), 1, 1e-15);
    expectCloseTo(exp.fp(1), Math.E, 1e-15);
  });
});

describe('derivative-monotonicity: sign classification', () => {
  it('cubic at x0 = 0 is decreasing (fpSign -1)', () => {
    // t = (0 - (-2.5)) / 5 = 0.5
    const data = monotonicityData('cubic', 0.5);
    expectCloseTo(data.x0, 0, 1e-12);
    expectCloseTo(data.fp0, -3, 1e-12);
    expect(data.fpSign).toBe(-1);
  });

  it('cubic at x0 = 2 is increasing (fpSign 1)', () => {
    // t = (2 - (-2.5)) / 5 = 0.9
    const data = monotonicityData('cubic', 0.9);
    expectCloseTo(data.x0, 2, 1e-12);
    expectCloseTo(data.fp0, 9, 1e-12);
    expect(data.fpSign).toBe(1);
  });

  it('cubic at the critical point x0 = 1 is flat (fpSign 0)', () => {
    // t = (1 - (-2.5)) / 5 = 0.7
    const data = monotonicityData('cubic', 0.7);
    expectCloseTo(data.x0, 1, 1e-12);
    expect(data.fpSign).toBe(0);
  });

  it('exp is increasing everywhere', () => {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      expect(monotonicityData('exp', t).fpSign).toBe(1);
    }
  });

  it('sine alternates: decreasing at 0, flat at -pi/2', () => {
    const at0 = monotonicityData('sine', 0.5);
    expectCloseTo(at0.x0, 0, 1e-12);
    expect(at0.fpSign).toBe(1);
    const atNeg = monotonicityData('sine', 0.25);
    expectCloseTo(atNeg.x0, -Math.PI / 2, 1e-12);
    expect(atNeg.fpSign).toBe(0);
  });

  it('signOf respects the zero tolerance', () => {
    expect(signOf(0)).toBe(0);
    expect(signOf(1e-10)).toBe(0);
    expect(signOf(-1e-10)).toBe(0);
    expect(signOf(1e-8)).toBe(1);
    expect(signOf(-1e-8)).toBe(-1);
  });
});

describe('derivative-monotonicity: secant check', () => {
  it('the secant sign agrees with the derivative sign on monotone pieces', () => {
    // cubic increasing region x = 2 (t = 0.9): secant slope > 0
    const up = monotonicityData('cubic', 0.9);
    expect(up.secantSign).toBe(1);
    expect(up.secantAgrees).toBe(true);
    // cubic decreasing region x = 0 (t = 0.5): secant slope < 0
    const down = monotonicityData('cubic', 0.5);
    expect(down.secantSign).toBe(-1);
    expect(down.secantAgrees).toBe(true);
    // exp everywhere
    const exp = monotonicityData('exp', 0.5);
    expect(exp.secantSign).toBe(1);
    expect(exp.secantAgrees).toBe(true);
  });

  it('at the cubic critical point the secant sees the f\'\'\' h^2/6 term, not zero', () => {
    // x0 = 1 is a local minimum: the central difference is
    // f'(1) + f'''(1) h^2/6 + ... = 0 + 6 h^2/6 > 0, so the secant slope
    // is positive even though the derivative sign is 0.
    const data = monotonicityData('cubic', 0.7);
    expect(data.fpSign).toBe(0);
    expect(data.secantSlope).toBeGreaterThan(0);
    expect(data.secantSign).toBe(1);
    expect(data.secantAgrees).toBe(false);
  });

  it('the secant window stays inside [a, b] at the boundary', () => {
    const data = monotonicityData('cubic', 0);
    expectCloseTo(data.x0, -2.5, 1e-12);
    expect(data.secantSlope).toBeGreaterThan(0);
    expect(data.secantAgrees).toBe(true);
  });
});

describe('derivative-monotonicity: bands and samples', () => {
  it('cubic bands are (+, 0-touch, -, 0-touch, +) over [-2.5, 2.5]', () => {
    const data = monotonicityData('cubic', 0);
    const signs = data.bands.map((b) => b.sign);
    expect(signs[0]).toBe(1);
    expect(signs[signs.length - 1]).toBe(1);
    expect(signs).toContain(-1);
    // Bands tile [a, b] without gaps.
    expectCloseTo(data.bands[0]?.x0 ?? -1, data.a, 1e-12);
    expectCloseTo(data.bands[data.bands.length - 1]?.x1 ?? -1, data.b, 1e-12);
    for (let i = 1; i < data.bands.length; i++) {
      expectCloseTo(data.bands[i]?.x0 ?? -1, data.bands[i - 1]?.x1 ?? -2, 1e-12);
    }
  });

  it('exp has a single positive band; sine has alternating bands', () => {
    const expBands = monotonicityData('exp', 0.5).bands;
    expect(expBands).toHaveLength(1);
    expect(expBands[0]?.sign).toBe(1);
    const sineSigns = monotonicityData('sine', 0.5).bands.map((b) => b.sign);
    expect(sineSigns).toContain(1);
    expect(sineSigns).toContain(-1);
  });

  it('critical points sit inside (a, b)', () => {
    expect(monotonicityData('cubic', 0).criticalPoints).toEqual([-1, 1]);
    expect(monotonicityData('exp', 0).criticalPoints).toEqual([]);
    const sineCp = monotonicityData('sine', 0).criticalPoints;
    expect(sineCp).toHaveLength(2);
    expectCloseTo(sineCp[0] ?? 0, -Math.PI / 2, 1e-15);
    expectCloseTo(sineCp[1] ?? 0, Math.PI / 2, 1e-15);
  });

  it('sample arrays have CURVE_SAMPLES + 1 entries spanning [a, b]', () => {
    const data = monotonicityData('cubic', 0.3);
    expect(data.fSamples).toHaveLength(CURVE_SAMPLES + 1);
    expect(data.fpSamples).toHaveLength(CURVE_SAMPLES + 1);
    expectCloseTo(data.fSamples[0]?.x ?? -1, data.a, 1e-12);
    expectCloseTo(data.fSamples[data.fSamples.length - 1]?.x ?? -1, data.b, 1e-12);
    const mid = data.fSamples[120];
    const mx = mid?.x ?? NaN;
    expectCloseTo(mid?.y ?? NaN, mx * mx * mx - 3 * mx, 1e-12);
    const midFp = data.fpSamples[120];
    expectCloseTo(midFp?.y ?? NaN, 3 * mx * mx - 3, 1e-12);
  });
});

describe('derivative-monotonicity: model compute', () => {
  it('reads fn and x from the control state, clamps, defaults', () => {
    expect(monotonicityFunctionKey('sine')).toBe('sine');
    expect(monotonicityFunctionKey('exp')).toBe('exp');
    expect(monotonicityFunctionKey('cubic')).toBe('cubic');
    expect(monotonicityFunctionKey('bogus')).toBe('cubic');
    expect(monotonicityFunctionKey(undefined)).toBe('cubic');

    // Defaults: cubic, x at the left end (init 0 -> t 0 -> x = a).
    const def = compute({});
    expect(def.key).toBe('cubic');
    expectCloseTo(def.x0, def.a, 1e-12);

    // Clamping of the slider percent.
    expectCloseTo(compute({ fn: 'sine', x: 150 }).x0, Math.PI, 1e-12);
    expectCloseTo(compute({ fn: 'sine', x: -20 }).x0, -Math.PI, 1e-12);
    expect(compute({ fn: 'exp', x: 50 }).key).toBe('exp');
  });

  it('exports the expected data keys', () => {
    const data = compute({ fn: 'cubic', x: 50 });
    for (const key of [
      'key', 'a', 'b', 'x0', 'fp0', 'fpSign', 'criticalPoints',
      'fSamples', 'fpSamples', 'bands', 'secantH', 'secantSlope',
      'secantSign', 'secantAgrees',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('derivative-monotonicity: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(derivativeMonotonicityProblems).toHaveLength(3);
    for (const p of derivativeMonotonicityProblems) {
      expect(p.id).toBeTruthy();
      expect(p.statement.ko).toBeTruthy();
      expect(p.statement.en).toBeTruthy();
      expect(p.presetCaption.ko).toBeTruthy();
      expect(p.presetCaption.en).toBeTruthy();
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko).toBeTruthy();
        expect(step.text.en).toBeTruthy();
      }
    }
  });

  it('the three ids are the MVT consequence, the strict version, and the partial converse', () => {
    expect(derivativeMonotonicityProblems.map((p) => p.id)).toEqual([
      'derivative-monotonicity-nonneg',
      'derivative-monotonicity-strict',
      'derivative-monotonicity-converse',
    ]);
  });

  it('preset captions match the model numbers', () => {
    // Problem 1: cubic at x: 70 -> x0 = 1, f'(1) = 0.
    const p1 = derivativeMonotonicityProblems[0];
    expect(p1?.preset['fn']).toBe('cubic');
    const d1 = compute({ fn: String(p1?.preset['fn']), x: Number(p1?.preset['x']) });
    expectCloseTo(d1.x0, 1, 1e-12);
    expect(d1.fpSign).toBe(0);
    // Problem 2: exp at x: 50 -> x0 = 0, f'(0) = 1 > 0.
    const p2 = derivativeMonotonicityProblems[1];
    const d2 = compute({ fn: String(p2?.preset['fn']), x: Number(p2?.preset['x']) });
    expectCloseTo(d2.x0, 0, 1e-12);
    expectCloseTo(d2.fp0, 1, 1e-12);
    expect(d2.fpSign).toBe(1);
    // Problem 3: cubic at x: 25 -> x0 = -1.25, f'(x0) = 1.6875 > 0.
    const p3 = derivativeMonotonicityProblems[2];
    const d3 = compute({ fn: String(p3?.preset['fn']), x: Number(p3?.preset['x']) });
    expectCloseTo(d3.x0, -1.25, 1e-12);
    expectCloseTo(d3.fp0, 1.6875, 1e-12);
    expect(d3.fpSign).toBe(1);
  });
});
