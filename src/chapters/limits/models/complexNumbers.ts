import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Complex numbers, live: two points z and w in the complex plane, their
 * sum and difference drawn as a parallelogram, and the two identities
 * that turn the modulus into a norm: the triangle inequality
 * |z + w| <= |z| + |w| and the parallelogram identity
 * |z + w|^2 + |z - w|^2 = 2|z|^2 + 2|w|^2.
 * Pure computation: no DOM, d3, or three.
 */

export const COMPLEX_MIN = -2;
export const COMPLEX_MAX = 2;

export const COMPLEX_ZRE_INIT = 1.2;
export const COMPLEX_ZIM_INIT = 0.8;
export const COMPLEX_WRE_INIT = -0.6;
export const COMPLEX_WIM_INIT = 1.1;

/** Modulus |a + bi| = sqrt(a^2 + b^2). */
export function complexModulus(re: number, im: number): number {
  return Math.sqrt(re * re + im * im);
}

/** Squared modulus |a + bi|^2 = a^2 + b^2, computed without the square root. */
export function complexModulusSq(re: number, im: number): number {
  return re * re + im * im;
}

export interface ComplexNumbersData {
  readonly zre: number;
  readonly zim: number;
  readonly wre: number;
  readonly wim: number;
  /** z + w, componentwise. */
  readonly sumRe: number;
  readonly sumIm: number;
  /** z - w, componentwise. */
  readonly diffRe: number;
  readonly diffIm: number;
  /** zw = (zre*wre - zim*wim) + (zre*wim + zim*wre)i. */
  readonly prodRe: number;
  readonly prodIm: number;
  readonly zMod: number;
  readonly wMod: number;
  readonly sumMod: number;
  readonly diffMod: number;
  /** |zw|, computed from the product components. */
  readonly prodMod: number;
  readonly zModSq: number;
  readonly wModSq: number;
  readonly sumModSq: number;
  readonly diffModSq: number;
  /** Re(z * conj(w)) = zre*wre + zim*wim. */
  readonly reZConjW: number;
  /** |z| * |w|; equals prodMod by the product rule for moduli. */
  readonly modProduct: number;
  /** |z| + |w| - |z + w|; always >= 0 by the triangle inequality. */
  readonly triangleSlack: number;
  readonly triangleHolds: boolean;
  /** |z + w|^2 + |z - w|^2. */
  readonly parallelogramLhs: number;
  /** 2|z|^2 + 2|w|^2; equal to parallelogramLhs up to floating point. */
  readonly parallelogramRhs: number;
  /** Argument of z in radians, atan2(zim, zre), in (-pi, pi]. */
  readonly argZRad: number;
  /** Argument of z in degrees. */
  readonly argZDeg: number;
}

function clampComponent(raw: unknown, fallback: number): number {
  return clampNumber(raw, COMPLEX_MIN, COMPLEX_MAX, fallback);
}

export function complexNumbersData(
  zre: number,
  zim: number,
  wre: number,
  wim: number,
): ComplexNumbersData {
  const czre = clampComponent(zre, COMPLEX_ZRE_INIT);
  const czim = clampComponent(zim, COMPLEX_ZIM_INIT);
  const cwre = clampComponent(wre, COMPLEX_WRE_INIT);
  const cwim = clampComponent(wim, COMPLEX_WIM_INIT);

  const sumRe = czre + cwre;
  const sumIm = czim + cwim;
  const diffRe = czre - cwre;
  const diffIm = czim - cwim;
  const prodRe = czre * cwre - czim * cwim;
  const prodIm = czre * cwim + czim * cwre;

  const zModSq = complexModulusSq(czre, czim);
  const wModSq = complexModulusSq(cwre, cwim);
  const sumModSq = complexModulusSq(sumRe, sumIm);
  const diffModSq = complexModulusSq(diffRe, diffIm);

  const zMod = Math.sqrt(zModSq);
  const wMod = Math.sqrt(wModSq);
  const sumMod = Math.sqrt(sumModSq);
  const diffMod = Math.sqrt(diffModSq);
  const prodMod = complexModulus(prodRe, prodIm);

  const triangleSlack = zMod + wMod - sumMod;
  const argZRad = Math.atan2(czim, czre);

  return {
    zre: czre,
    zim: czim,
    wre: cwre,
    wim: cwim,
    sumRe,
    sumIm,
    diffRe,
    diffIm,
    prodRe,
    prodIm,
    zMod,
    wMod,
    sumMod,
    diffMod,
    prodMod,
    zModSq,
    wModSq,
    sumModSq,
    diffModSq,
    reZConjW: czre * cwre + czim * cwim,
    modProduct: zMod * wMod,
    triangleSlack,
    triangleHolds: triangleSlack >= 0,
    parallelogramLhs: sumModSq + diffModSq,
    parallelogramRhs: 2 * zModSq + 2 * wModSq,
    argZRad,
    argZDeg: (argZRad * 180) / Math.PI,
  };
}

export const complexNumbersModel: SceneModel<ComplexNumbersData> = {
  compute(state) {
    return complexNumbersData(
      state['zre'] as number,
      state['zim'] as number,
      state['wre'] as number,
      state['wim'] as number,
    );
  },
};
