import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  complexModulus,
  complexModulusSq,
  complexNumbersData,
  complexNumbersModel,
  COMPLEX_MAX,
  COMPLEX_MIN,
  COMPLEX_WIM_INIT,
  COMPLEX_WRE_INIT,
  COMPLEX_ZIM_INIT,
  COMPLEX_ZRE_INIT,
  type ComplexNumbersData,
} from '../src/chapters/limits/models/complexNumbers';
import { complexNumbersProblems } from '../src/chapters/limits/problems/complex-numbers';

const compute = (state: ControlState): ComplexNumbersData =>
  syncCompute(complexNumbersModel, state);

const TOL = 1e-9;

describe('complex-numbers: helpers', () => {
  it('modulus and squared modulus match sqrt(a^2 + b^2) and a^2 + b^2', () => {
    expectCloseTo(complexModulus(3, 4), 5, TOL);
    expectCloseTo(complexModulusSq(3, 4), 25, TOL);
    expectCloseTo(complexModulus(0, 0), 0, TOL);
    expectCloseTo(complexModulusSq(-1.5, 0.5), 2.5, TOL);
  });
});

describe('complex-numbers: init preset z = 1.2 + 0.8i, w = -0.6 + 1.1i', () => {
  const data = compute({ zre: 1.2, zim: 0.8, wre: -0.6, wim: 1.1 });

  it('sum is 0.6 + 1.9i and difference is 1.8 - 0.3i', () => {
    expectCloseTo(data.sumRe, 0.6, TOL);
    expectCloseTo(data.sumIm, 1.9, TOL);
    expectCloseTo(data.diffRe, 1.8, TOL);
    expectCloseTo(data.diffIm, -0.3, TOL);
  });

  it('squared moduli are the hand-computed 2.08, 1.57, 3.97, 3.33', () => {
    expectCloseTo(data.zModSq, 2.08, TOL);
    expectCloseTo(data.wModSq, 1.57, TOL);
    expectCloseTo(data.sumModSq, 3.97, TOL);
    expectCloseTo(data.diffModSq, 3.33, TOL);
    expectCloseTo(data.zMod, Math.sqrt(2.08), TOL);
    expectCloseTo(data.wMod, Math.sqrt(1.57), TOL);
    expectCloseTo(data.sumMod, Math.sqrt(3.97), TOL);
    expectCloseTo(data.diffMod, Math.sqrt(3.33), TOL);
  });

  it('parallelogram identity: 3.97 + 3.33 = 7.30 = 2 * (2.08 + 1.57)', () => {
    expectCloseTo(data.parallelogramLhs, 7.3, TOL);
    expectCloseTo(data.parallelogramRhs, 7.3, TOL);
    expectCloseTo(data.parallelogramLhs, data.parallelogramRhs, 1e-12);
  });

  it('product is -1.6 + 0.84i and |zw| = |z| * |w|', () => {
    // (1.2 + 0.8i)(-0.6 + 1.1i) = -0.72 - 0.88 + (1.32 - 0.48)i = -1.6 + 0.84i
    expectCloseTo(data.prodRe, -1.6, TOL);
    expectCloseTo(data.prodIm, 0.84, TOL);
    expectCloseTo(data.prodMod, Math.sqrt(2.08 * 1.57), TOL);
    expectCloseTo(data.prodMod, data.modProduct, 1e-12);
  });

  it('Re(z * conj(w)) = 1.2 * (-0.6) + 0.8 * 1.1 = 0.16', () => {
    expectCloseTo(data.reZConjW, 0.16, TOL);
  });

  it('triangle slack is sqrt(2.08) + sqrt(1.57) - sqrt(3.97) > 0', () => {
    expectCloseTo(
      data.triangleSlack,
      Math.sqrt(2.08) + Math.sqrt(1.57) - Math.sqrt(3.97),
      TOL,
    );
    expect(data.triangleSlack).toBeGreaterThan(0);
    expect(data.triangleHolds).toBe(true);
  });

  it('argument of z is atan2(0.8, 1.2)', () => {
    expectCloseTo(data.argZRad, Math.atan2(0.8, 1.2), 1e-12);
    expectCloseTo(data.argZDeg, (Math.atan2(0.8, 1.2) * 180) / Math.PI, TOL);
    expectCloseTo(data.argZDeg, 33.690067525979785, 1e-6);
  });
});

describe('complex-numbers: second point pair z = -1 + 2i, w = 2 - i', () => {
  const data = compute({ zre: -1, zim: 2, wre: 2, wim: -1 });

  it('sum 1 + i, difference -3 + 3i, squared moduli 5, 5, 2, 18', () => {
    expectCloseTo(data.sumRe, 1, TOL);
    expectCloseTo(data.sumIm, 1, TOL);
    expectCloseTo(data.diffRe, -3, TOL);
    expectCloseTo(data.diffIm, 3, TOL);
    expectCloseTo(data.zModSq, 5, TOL);
    expectCloseTo(data.wModSq, 5, TOL);
    expectCloseTo(data.sumModSq, 2, TOL);
    expectCloseTo(data.diffModSq, 18, TOL);
  });

  it('parallelogram identity: 2 + 18 = 20 = 2 * 5 + 2 * 5', () => {
    expectCloseTo(data.parallelogramLhs, 20, TOL);
    expectCloseTo(data.parallelogramRhs, 20, TOL);
  });

  it('product is 0 + 5i, so |zw| = 5 = sqrt(5) * sqrt(5)', () => {
    // (-1 + 2i)(2 - i) = -2 + 2 + (1 + 4)i = 5i
    expectCloseTo(data.prodRe, 0, TOL);
    expectCloseTo(data.prodIm, 5, TOL);
    expectCloseTo(data.prodMod, 5, TOL);
    expectCloseTo(data.modProduct, 5, TOL);
  });

  it('Re(z * conj(w)) = (-1)(2) + (2)(-1) = -4', () => {
    expectCloseTo(data.reZConjW, -4, TOL);
  });

  it('argument of z is atan2(2, -1), in the second quadrant', () => {
    expectCloseTo(data.argZRad, Math.atan2(2, -1), 1e-12);
    expect(data.argZDeg).toBeGreaterThan(90);
    expect(data.argZDeg).toBeLessThan(180);
    expectCloseTo(data.argZDeg, 116.56505117707799, 1e-6);
  });

  it('triangle inequality holds: |z + w| = sqrt(2) <= 2 * sqrt(5)', () => {
    expect(data.triangleHolds).toBe(true);
    expectCloseTo(data.triangleSlack, 2 * Math.sqrt(5) - Math.sqrt(2), TOL);
  });
});

describe('complex-numbers: zero-vector cases', () => {
  it('w = 0: |z + w| = |z|, slack is exactly 0, product is 0', () => {
    const data = compute({ zre: 1.2, zim: 0.8, wre: 0, wim: 0 });
    expectCloseTo(data.sumRe, 1.2, TOL);
    expectCloseTo(data.sumIm, 0.8, TOL);
    expectCloseTo(data.sumMod, data.zMod, 1e-12);
    expectCloseTo(data.diffMod, data.zMod, 1e-12);
    expectCloseTo(data.triangleSlack, 0, 1e-12);
    expect(data.triangleHolds).toBe(true);
    expectCloseTo(data.prodMod, 0, TOL);
    expectCloseTo(data.parallelogramLhs, 2 * 2.08, TOL);
    expectCloseTo(data.parallelogramRhs, 2 * 2.08, TOL);
  });

  it('z = w = 0: every modulus is 0 and the identities read 0 = 0', () => {
    const data = compute({ zre: 0, zim: 0, wre: 0, wim: 0 });
    expect(data.zMod).toBe(0);
    expect(data.wMod).toBe(0);
    expect(data.sumMod).toBe(0);
    expect(data.prodMod).toBe(0);
    expect(data.triangleSlack).toBe(0);
    expect(data.triangleHolds).toBe(true);
    expect(data.parallelogramLhs).toBe(0);
    expect(data.parallelogramRhs).toBe(0);
    expect(data.argZRad).toBe(0); // atan2(0, 0) === 0
  });
});

describe('complex-numbers: model compute plumbing', () => {
  it('defaults to the init preset', () => {
    const data = compute({});
    expect(data.zre).toBe(COMPLEX_ZRE_INIT);
    expect(data.zim).toBe(COMPLEX_ZIM_INIT);
    expect(data.wre).toBe(COMPLEX_WRE_INIT);
    expect(data.wim).toBe(COMPLEX_WIM_INIT);
  });

  it('clamps components into [-2, 2]; NaN gives the init values', () => {
    const clamped = compute({ zre: 99, zim: -99, wre: 2, wim: -2 });
    expect(clamped.zre).toBe(COMPLEX_MAX);
    expect(clamped.zim).toBe(COMPLEX_MIN);
    expect(clamped.wre).toBe(2);
    expect(clamped.wim).toBe(-2);
    const nan = compute({ zre: NaN, zim: NaN, wre: NaN, wim: NaN });
    expect(nan.zre).toBe(COMPLEX_ZRE_INIT);
    expect(nan.zim).toBe(COMPLEX_ZIM_INIT);
    expect(nan.wre).toBe(COMPLEX_WRE_INIT);
    expect(nan.wim).toBe(COMPLEX_WIM_INIT);
  });

  it('the direct data function agrees with the model', () => {
    const direct = complexNumbersData(1.2, 0.8, -0.6, 1.1);
    const viaModel = compute({ zre: 1.2, zim: 0.8, wre: -0.6, wim: 1.1 });
    expect(direct).toEqual(viaModel);
  });

  it('exports the expected data keys', () => {
    const data = compute({});
    for (const key of [
      'zre', 'zim', 'wre', 'wim', 'sumRe', 'sumIm', 'diffRe', 'diffIm',
      'prodRe', 'prodIm', 'zMod', 'wMod', 'sumMod', 'diffMod', 'prodMod',
      'zModSq', 'wModSq', 'sumModSq', 'diffModSq', 'reZConjW', 'modProduct',
      'triangleSlack', 'triangleHolds', 'parallelogramLhs',
      'parallelogramRhs', 'argZRad', 'argZDeg',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('complex-numbers: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(complexNumbersProblems);
  });

  it('the three ids are triangle-inequality, parallelogram-identity, modulus-product-conjugate', () => {
    expect(complexNumbersProblems.map((p) => p.id)).toEqual([
      'triangle-inequality',
      'parallelogram-identity',
      'modulus-product-conjugate',
    ]);
  });

  it('presets use valid slider values in [-2, 2]', () => {
    for (const p of complexNumbersProblems) {
      for (const key of ['zre', 'zim', 'wre', 'wim'] as const) {
        const v = Number(p.preset[key]);
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(COMPLEX_MIN);
        expect(v).toBeLessThanOrEqual(COMPLEX_MAX);
      }
    }
  });

  it('the triangle preset is the init preset and its slack matches the caption', () => {
    const p = complexNumbersProblems[0]!;
    const data = compute(p.preset);
    expectCloseTo(data.sumModSq, 3.97, TOL);
    expectCloseTo(data.triangleSlack, 0.7027310342826352, 1e-6);
    expect(data.triangleHolds).toBe(true);
  });

  it('the parallelogram preset satisfies 3.97 + 3.33 = 7.30 = 2 * (2.08 + 1.57)', () => {
    const p = complexNumbersProblems[1]!;
    const data = compute(p.preset);
    expectCloseTo(data.sumModSq, 3.97, TOL);
    expectCloseTo(data.diffModSq, 3.33, TOL);
    expectCloseTo(data.parallelogramLhs, 7.3, TOL);
    expectCloseTo(data.parallelogramRhs, 7.3, TOL);
  });

  it('the product preset z = 1 + i, w = 1 - 0.5i gives zw = 1.5 + 0.5i, |zw| = sqrt(2.5)', () => {
    const p = complexNumbersProblems[2]!;
    const data = compute(p.preset);
    expectCloseTo(data.prodRe, 1.5, TOL);
    expectCloseTo(data.prodIm, 0.5, TOL);
    expectCloseTo(data.prodMod, Math.sqrt(2.5), TOL);
    expectCloseTo(data.prodMod, data.modProduct, 1e-12);
  });
});
