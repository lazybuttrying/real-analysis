
import { describe, expect, it } from 'vitest';
import { findMVTPoints, mvtData, mvtFunction, mvtFunctionKey } from '../src/chapters/calculus/models/mvt';
import { taylorCoefficients, taylorData, taylorFunctionKey, taylorPoly } from '../src/chapters/calculus/models/taylor';
import { riemannSums } from '../src/chapters/calculus/models/riemann';
import { ftcData, ftcFunctionKey } from '../src/chapters/calculus/models/ftc';
import { newtonFunctionKey, newtonIterate } from '../src/chapters/calculus/models/newton';
import { banachData, banachFunction, banachFunctionKey, dottieNumber } from '../src/chapters/calculus/models/banach';
import { fourierData, fourierPartialSum, GIBBS_PEAK } from '../src/chapters/calculus/models/fourier';
import { enumerateRationals, lebesgueData } from '../src/chapters/calculus/models/lebesgue';

describe('calculus problems', () => {
  it('key mappers accept the meta.ts select option values', () => {
    expect(mvtFunctionKey('x^3')).toBe('cubic');
    expect(mvtFunctionKey('x^2')).toBe('square');
    expect(mvtFunctionKey('x^3-3x')).toBe('rolle');
    expect(mvtFunctionKey('const')).toBe('constant');
    expect(taylorFunctionKey('sin')).toBe('sin');
    expect(taylorFunctionKey('exp')).toBe('exp');
    expect(ftcFunctionKey('x^2')).toBe('square');
    expect(ftcFunctionKey('sin')).toBe('sin');
    expect(newtonFunctionKey('x^2-2')).toBe('sqrt2');
    expect(newtonFunctionKey('x^3-2x+2')).toBe('bad');
    expect(banachFunctionKey('x/2+1')).toBe('affine');
    expect(banachFunctionKey('cos')).toBe('cos');
  });

  it('mvt: secant slopes and closed-form MVT points for every demo function', () => {
    const cubic = mvtData('cubic', 0.4);
    expect(cubic.secantSlope).toBe(4);
    const cubicPts = findMVTPoints('cubic');
    expect(cubicPts).toHaveLength(1);
    expect(cubicPts[0]).toBeCloseTo(2 / Math.sqrt(3), 6);
    // Tangent slope at the MVT point equals the secant slope.
    const atPoint = mvtData('cubic', cubicPts[0] === undefined ? 0 : cubicPts[0] / 2);
    expect(atPoint.tangentSlope).toBeCloseTo(4, 6);

    const square = mvtData('square', 0.5);
    expect(square.secantSlope).toBe(2);
    const squarePts = findMVTPoints('square');
    expect(squarePts).toHaveLength(1);
    expect(squarePts[0]).toBeCloseTo(1, 9);

    const rolle = mvtData('rolle', 0.5);
    expect(rolle.secantSlope).toBe(0);
    const rollePts = findMVTPoints('rolle');
    expect(rollePts).toHaveLength(1);
    expect(rollePts[0]).toBeCloseTo(1, 9);

    const constant = mvtData('constant', 0.5);
    expect(constant.secantSlope).toBe(0);
    expect(constant.tangentSlope).toBe(0);
    expect(findMVTPoints('constant')).toHaveLength(0);
    expect(mvtFunction('rolle').f(-1)).toBe(mvtFunction('rolle').f(2));
  });

  it('taylor: sin coefficients, exp T_3(1) and the Lagrange bound', () => {
    const sinC = taylorCoefficients('sin', 3);
    expect(sinC).toHaveLength(4);
    expect(sinC[0]).toBe(0);
    expect(sinC[1]).toBe(1);
    expect(sinC[2]).toBe(0);
    expect(sinC[3]).toBeCloseTo(-1 / 6, 15);
    expect(taylorPoly(sinC, 1)).toBeCloseTo(5 / 6, 12);

    const expC = taylorCoefficients('exp', 3);
    expect(taylorPoly(expC, 1)).toBeCloseTo(8 / 3, 12);
    const actualErr = Math.E - 8 / 3;
    expect(actualErr).toBeGreaterThan(0);
    expect(actualErr).toBeCloseTo(0.0516, 3);
    expect(actualErr).toBeLessThan(Math.E / 24);

    // Higher degree hugs tighter.
    const e1 = taylorData('sin', 1).maxErr;
    const e3 = taylorData('sin', 3).maxErr;
    const e9 = taylorData('sin', 9).maxErr;
    expect(e1).toBeGreaterThan(e3);
    expect(e3).toBeGreaterThan(e9);
  });

  it('riemann: closed-form lower/upper sums squeeze 1/3', () => {
    const s10 = riemannSums(10);
    expect(s10.lower).toBeCloseTo(0.285, 12);
    expect(s10.upper).toBeCloseTo(0.385, 12);
    expect(s10.upper - s10.lower).toBeCloseTo(0.1, 12);
    const s48 = riemannSums(48);
    expect(s48.upper - s48.lower).toBeCloseTo(1 / 48, 12);
    expect(s48.lower).toBeLessThan(1 / 3);
    expect(s48.upper).toBeGreaterThan(1 / 3);
    expect(1 / 3 - s48.lower).toBeLessThan(0.02);
  });

  it('ftc: the area derivative lands on f', () => {
    const sq = ftcData('square', 1);
    expect(sq.x).toBe(2);
    expect(sq.area).toBeCloseTo(8 / 3, 12);
    const mid = ftcData('square', 0.5);
    expect(mid.x).toBe(1);
    expect(mid.fAtX).toBe(1);
    expect(Math.abs(mid.numericDerivative - 1)).toBeLessThan(1e-6);
    const sin = ftcData('sin', 1);
    expect(sin.area).toBeCloseTo(2, 9);
    expect(Math.abs(sin.numericDerivative - sin.fAtX)).toBeLessThan(1e-6);
  });

  it('newton: Babylonian iterates and the 0-1 cycle', () => {
    const data = newtonIterate('sqrt2', 1.5, 4);
    expect(data.steps[0]?.next).toBeCloseTo(17 / 12, 15);
    expect(data.steps[1]?.x).toBeCloseTo(17 / 12, 15);
    // Quadratic convergence: error ratio tends to 1/(2 sqrt(2)).
    const e1 = data.errors[1] ?? NaN;
    const e2 = data.errors[2] ?? NaN;
    expect(e2).toBeLessThan(e1);
    expect(e2 / (e1 * e1)).toBeCloseTo(1 / (2 * Math.SQRT2), 1);
    expect(data.errors[4] ?? 1).toBeLessThan(1e-12);

    const bad = newtonIterate('bad', 0, 4);
    expect(bad.steps[0]?.next).toBe(1);
    expect(bad.steps[1]?.next).toBe(0);
    expect(bad.steps[2]?.next).toBe(1);
    expect(bad.steps[3]?.next).toBe(0);
  });

  it('banach: exact affine bound and the Dottie number', () => {
    const data = banachData('affine', 0, 8);
    expect(data.xs[8]).toBeCloseTo(1.9921875, 12);
    expect(data.errors[8]).toBeCloseTo(0.0078125, 12);
    expect(data.bounds[8]).toBeCloseTo(0.0078125, 12);
    expect(data.q).toBe(0.5);
    expect(data.fixed).toBe(2);

    const cos = banachFunction('cos');
    expect(cos.q).toBeCloseTo(Math.sin(1), 15);
    expect(cos.q).toBeLessThan(1);
    expect(dottieNumber()).toBeCloseTo(0.7390851332, 8);
    expect(Math.abs(Math.cos(dottieNumber()) - dottieNumber())).toBeLessThan(1e-11);
    const cosData = banachData('cos', 0.5, 20);
    // The a-priori bound holds, and 20 iterations already pin the Dottie number.
    expect(cosData.errors[20] ?? 1).toBeLessThan(cosData.bounds[20] ?? 0);
    expect(cosData.errors[20] ?? 1).toBeLessThan(1e-3);
    expect(Math.abs((cosData.xs[20] ?? 0) - 0.739085)).toBeLessThan(1e-4);
  });

  it('fourier: Leibniz link at pi/2 and the Gibbs peak', () => {
    expect(fourierPartialSum(Math.PI / 2, 50)).toBeCloseTo(1, 1);
    const data = fourierData(200);
    expect(data.gibbsMax).toBeCloseTo(GIBBS_PEAK, 2);
    expect(data.overshootFraction).toBeCloseTo(0.0895, 2);
    expect(data.overshootFraction).toBeGreaterThan(0);
    expect(data.overshootFraction).toBeLessThan(0.1);
  });

  it('lebesgue: rational enumeration and the epsilon cover', () => {
    const first = enumerateRationals(5).map((q) => q.r);
    expect(first).toEqual([0, 1, 1 / 2, 1 / 3, 2 / 3]);
    const data = lebesgueData(0.1, 10);
    expect(data.totalLength).toBeCloseTo(0.1 * (1 - 2 ** -10), 12);
    expect(data.totalLength).toBeLessThan(0.1);
    expect(data.riemannUpper).toBe(1);
    expect(data.riemannLower).toBe(0);
    // Cover lengths are exactly eps/2^k.
    expect(data.covers[0]?.length).toBeCloseTo(0.05, 15);
    expect(data.covers[1]?.length).toBeCloseTo(0.025, 15);
  });
});
