import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  CONTRACTION_Q,
  applyMap,
  contractionModel,
  errorRadius,
  firstStep,
  fixedPoint,
  mapOf,
  picardIterates,
  type ContractionData,
} from '../src/chapters/limits/models/contraction';

const compute = (state: ControlState): ContractionData => contractionModel.compute(state) as ContractionData;

describe('contraction: both maps are contractions with q = 1/2', () => {
  it('contraction constant is 1/2', () => {
    expect(CONTRACTION_Q).toBe(0.5);
  });

  it('|T(x) - T(y)| = q|x - y| exactly for both maps', () => {
    for (const map of ['affine', 'half'] as const) {
      for (const [a, b] of [
        [0.3, 1.7],
        [1, 2.5],
        [0.1, 0.9],
      ] as const) {
        expect(Math.abs(applyMap(map, a) - applyMap(map, b))).toBeCloseTo(0.5 * Math.abs(a - b), 14);
      }
    }
  });

  it('unknown map key falls back to affine', () => {
    expect(mapOf('bogus')).toBe('affine');
    expect(mapOf('half')).toBe('half');
  });
});

describe('contraction: affine map iterates and error ball (x0 = 1)', () => {
  const data = compute({ map: 'affine', n: 8, x0: 1 });

  it('x_n = 2 - 2^{-n}: x_8 = 1.99609375', () => {
    expect(data.iterates).toHaveLength(9);
    expect(data.iterates[0]).toBe(1);
    expect(data.iterates[8]).toBeCloseTo(2 - 2 ** -8, 14);
    expect(data.iterates[8]).toBeCloseTo(1.99609375, 12);
  });

  it('radius at n = 8 is 2^{-8} = 0.00390625', () => {
    // q^n/(1-q) * |x_1 - x_0| = (1/2)^8/(1/2) * 1/2 = 1/256
    expect(data.radius).toBeCloseTo(2 ** -8, 14);
    expect(data.radius).toBeCloseTo(0.00390625, 12);
  });

  it('actual error |x_8 - 2| meets the bound exactly', () => {
    const err = Math.abs((data.iterates[8] ?? 0) - 2);
    expect(err).toBeCloseTo(data.radius, 14);
  });

  it('fixed point 2 lives in the space', () => {
    expect(data.fixedPoint).toBe(2);
    expect(data.q).toBe(0.5);
  });

  it('Cauchy bound: |x_8 - x_3| <= q^3/(1-q) * |x_1 - x_0| = 0.125', () => {
    const d = Math.abs((data.iterates[8] ?? 0) - (data.iterates[3] ?? 0));
    expect(d).toBeCloseTo(0.12109375, 12);
    expect(d).toBeLessThanOrEqual(0.125);
  });
});

describe('contraction: half map has no fixed point in (0, 1]', () => {
  const data = compute({ map: 'half', n: 8, x0: 1 });

  it('x_n = 2^{-n}: x_8 = 0.00390625', () => {
    expect(data.iterates[8]).toBeCloseTo(2 ** -8, 14);
    expect(data.iterates[8]).toBeCloseTo(0.00390625, 12);
  });

  it('radius at n = 8 is 2^{-8} = 0.00390625', () => {
    expect(data.radius).toBeCloseTo(2 ** -8, 14);
  });

  it('no fixed point in the space; the ambient limit 0 is outside', () => {
    expect(data.fixedPoint).toBeNull();
    expect(fixedPoint('half')).toBeNull();
  });

  it('iterates stay in (0, 1] and drain toward 0', () => {
    const full = compute({ map: 'half', n: 12, x0: 1 });
    for (const v of full.iterates) {
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(full.iterates[12]).toBeCloseTo(2 ** -12, 14);
  });
});

describe('contraction: clamping and helpers', () => {
  it('n is clamped to [0, 12]', () => {
    expect(compute({ map: 'affine', n: 99, x0: 1 }).iterates).toHaveLength(13);
    expect(compute({ map: 'affine', n: -5, x0: 1 }).iterates).toHaveLength(1);
  });

  it('x0 above 1 is clamped to 1 for the half map', () => {
    expect(compute({ map: 'half', n: 2, x0: 2.5 }).x0).toBe(1);
  });

  it('radius at n = 0 is 2 * |x_1 - x_0| = 1.0 for x0 = 1', () => {
    expect(compute({ map: 'affine', n: 0, x0: 1 }).radius).toBeCloseTo(1.0, 14);
    expect(compute({ map: 'half', n: 0, x0: 1 }).radius).toBeCloseTo(1.0, 14);
  });

  it('firstStep is |T(x0) - x0|', () => {
    expect(firstStep('affine', 1)).toBeCloseTo(0.5, 14);
    expect(firstStep('half', 1)).toBeCloseTo(0.5, 14);
    expect(firstStep('affine', 2)).toBeCloseTo(0, 14);
  });

  it('errorRadius matches the model radius', () => {
    expect(errorRadius('affine', 1, 8)).toBeCloseTo(compute({ map: 'affine', n: 8, x0: 1 }).radius, 14);
  });

  it('picardIterates follows x_{k+1} = T(x_k)', () => {
    const xs = picardIterates('affine', 1, 4);
    expect(xs).toHaveLength(5);
    for (let k = 0; k < 4; k++) {
      expect(xs[k + 1]).toBeCloseTo(applyMap('affine', xs[k] ?? 0), 14);
    }
  });
});
