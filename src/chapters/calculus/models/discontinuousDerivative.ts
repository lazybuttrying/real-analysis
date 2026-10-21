import type { SceneModel } from '../../../contracts';

/**
 * f(x) = x^2 sin(1/x) for x != 0, f(0) = 0: differentiable everywhere
 * (f'(0) = 0 by the squeeze theorem, since the difference quotient at 0
 * is h sin(1/h)), but f'(x) = 2x sin(1/x) - cos(1/x) for x != 0 keeps
 * oscillating with amplitude ~1 as x -> 0, so f' is discontinuous at 0.
 * (Derivatives still have the intermediate value property even when
 * discontinuous: Darboux's theorem.) Pure computation: no DOM, d3, or
 * three.
 */

export const DD_LOGR_MIN = -3;
export const DD_LOGR_MAX = 0;
export const DD_LOGR_INIT = -1;

export const DD_LOGH_MIN = -4;
export const DD_LOGH_MAX = -1;
export const DD_LOGH_INIT = -2;

/** Sample points per side of 0 (quadratic spacing, denser near 0). */
export const DD_SAMPLES_PER_SIDE = 2000;

export function oscF(x: number): number {
  return x === 0 ? 0 : x * x * Math.sin(1 / x);
}

export function oscFp(x: number): number {
  return x === 0 ? 0 : 2 * x * Math.sin(1 / x) - Math.cos(1 / x);
}

/**
 * The difference quotient of f at 0: (f(h) - f(0)) / h = h sin(1/h),
 * which is squeezed to 0 as h -> 0.
 */
export function diffQuotAtZero(h: number): number {
  return h * Math.sin(1 / h);
}

interface DdPoint {
  x: number;
  y: number;
}

export interface DdOscData {
  /** Half-width of the viewing window: r = 10^logR. */
  r: number;
  /** Difference-quotient step at 0: h = 10^logH. */
  h: number;
  logR: number;
  logH: number;
  /** Samples of f on [-r, r] (includes x = 0). */
  fPts: DdPoint[];
  /** Samples of f' on [-r, r] (includes f'(0) = 0). */
  fpPts: DdPoint[];
  /** (f(h) - f(0)) / h: tends to 0 as h -> 0. */
  diffQuot: number;
  /** max |f'| over the samples: stays near 1 even as r shrinks. */
  maxAbsFp: number;
  /**
   * (1/(2 pi n), f'(1/(2 pi n))) = (1/(2 pi n), -1) for n = 1..5:
   * the sequence proving f' is discontinuous at 0, since
   * f'(1/(2 pi n)) -> -1 != 0 = f'(0).
   */
  seqPoints: DdPoint[];
}

function clampLogR(v: number): number {
  if (!Number.isFinite(v)) return DD_LOGR_INIT;
  return Math.max(DD_LOGR_MIN, Math.min(DD_LOGR_MAX, v));
}

function clampLogH(v: number): number {
  if (!Number.isFinite(v)) return DD_LOGH_INIT;
  return Math.max(DD_LOGH_MIN, Math.min(DD_LOGH_MAX, v));
}

export function ddOscData(logR: number, logH: number): DdOscData {
  const lr = clampLogR(logR);
  const lh = clampLogH(logH);
  const r = Math.pow(10, lr);
  const h = Math.pow(10, lh);
  const n = DD_SAMPLES_PER_SIDE;
  const fPts: DdPoint[] = new Array(2 * n + 1);
  const fpPts: DdPoint[] = new Array(2 * n + 1);
  let maxAbsFp = 0;
  for (let k = -n; k <= n; k++) {
    const t = r * Math.pow(Math.abs(k) / n, 2);
    const x = k < 0 ? -t : t;
    const y = oscF(x);
    const yp = oscFp(x);
    const idx = k + n;
    fPts[idx] = { x, y };
    fpPts[idx] = { x, y: yp };
    const a = Math.abs(yp);
    if (a > maxAbsFp) maxAbsFp = a;
  }
  const seqPoints: DdPoint[] = [];
  for (let m = 1; m <= 5; m++) {
    const x = 1 / (2 * Math.PI * m);
    seqPoints.push({ x, y: oscFp(x) });
  }
  return {
    r,
    h,
    logR: lr,
    logH: lh,
    fPts,
    fpPts,
    diffQuot: diffQuotAtZero(h),
    maxAbsFp,
    seqPoints,
  };
}

export const ddOscModel: SceneModel<DdOscData> = {
  compute(state) {
    return ddOscData(Number(state['logR']), Number(state['logH']));
  },
};
