import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Darboux's theorem: derivatives have the intermediate value property, even
 * when they are discontinuous. The classic witness is
 *   f(x) = x^2 sin(1/x)   (x != 0),   f(0) = 0,
 * differentiable everywhere, whose derivative
 *   f'(x) = 2x sin(1/x) - cos(1/x)   (x != 0),   f'(0) = 0
 * oscillates between the +/-1 bands without ever settling down, yet crosses
 * every horizontal test line y = c with |c| < 1: the IVP for a function that
 * is not continuous at 0.
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Zoom slider: 0 = window [-0.5, 0.5], 100 = window [-5e-4, 5e-4] (log zoom). */
export const ZOOM_MIN = 0;
export const ZOOM_MAX = 100;
export const ZOOM_INIT = 40;

/** Test level y = c. The IVP content lives inside |c| < 1; a little extra room is allowed. */
export const LEVEL_MIN = -1.2;
export const LEVEL_MAX = 1.2;
export const LEVEL_INIT = 0.4;

export const SHOWF_INIT = true;

/** Grid resolution grows with zoom so the oscillation stays resolved near the window edge. */
export function gridPoints(zoom: number): number {
  const t = clampZoom(zoom) / ZOOM_MAX;
  return Math.round(801 + 2000 * t);
}

export function clampZoom(raw: unknown): number {
  return clampNumber(raw, ZOOM_MIN, ZOOM_MAX, ZOOM_INIT, true);
}

export function clampLevel(raw: unknown): number {
  return clampNumber(raw, LEVEL_MIN, LEVEL_MAX, LEVEL_INIT);
}

export function parseShowF(raw: unknown): boolean {
  if (raw === undefined) return SHOWF_INIT;
  return raw === true;
}

/**
 * Half-width h of the view window [-h, h]: 0.5 at zoom 0, 5e-4 at zoom 100.
 * Log scale: equal slider travel means an equal relative zoom-in on x = 0.
 */
export function halfWidth(zoom: number): number {
  return 0.5 * Math.pow(10, -(clampZoom(zoom) / ZOOM_MAX) * 3);
}

/** The witness function: f(x) = x^2 sin(1/x), f(0) = 0. */
export function darbouxF(x: number): number {
  return x === 0 ? 0 : x * x * Math.sin(1 / x);
}

/**
 * Its derivative: f'(x) = 2x sin(1/x) - cos(1/x) for x != 0 (product and
 * chain rules), and f'(0) = 0 by the definition of the derivative:
 * (f(h) - f(0))/h = h sin(1/h) -> 0 by the squeeze theorem.
 */
export function darbouxFp(x: number): number {
  return x === 0 ? 0 : 2 * x * Math.sin(1 / x) - Math.cos(1 / x);
}

/**
 * The difference quotient (f(h) - f(0)) / h = h sin(1/h): the squeeze behind
 * f'(0) = 0, since |h sin(1/h)| <= |h|.
 */
export function diffQuot(h: number): number {
  return h === 0 ? 0 : darbouxF(h) / h;
}

export interface DarbouxData {
  zoom: number;
  level: number;
  showF: boolean;
  halfWidth: number;
  xs: number[];
  fVals: number[];
  fpVals: number[];
  /** The squeeze envelope +/-x^2 (top panel). */
  envPos: number[];
  envNeg: number[];
  /** Approximate crossing x positions where f' meets y = level (linear interpolation). */
  crossings: number[];
  fpMin: number;
  fpMax: number;
}

/** Upper bound on drawn crossing markers; the true count can be far larger near 0. */
export const MAX_DRAWN_CROSSINGS = 400;

export function darbouxData(zoom: number, level: number, showF: boolean): DarbouxData {
  const z = clampZoom(zoom);
  const c = clampLevel(level);
  const h = halfWidth(z);
  const n = gridPoints(z);
  const xs: number[] = new Array<number>(n);
  const fVals: number[] = new Array<number>(n);
  const fpVals: number[] = new Array<number>(n);
  const envPos: number[] = new Array<number>(n);
  const envNeg: number[] = new Array<number>(n);
  let fpMin = Infinity;
  let fpMax = -Infinity;
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : -h + (2 * h * i) / (n - 1);
    const fv = darbouxF(x);
    const fp = darbouxFp(x);
    xs[i] = x;
    fVals[i] = fv;
    fpVals[i] = fp;
    envPos[i] = x * x;
    envNeg[i] = -x * x;
    if (fp < fpMin) fpMin = fp;
    if (fp > fpMax) fpMax = fp;
  }
  // Crossings of f' with y = c: linear interpolation at grid sign changes.
  const crossings: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = (fpVals[i] ?? 0) - c;
    const b = (fpVals[i + 1] ?? 0) - c;
    if (a === 0) {
      crossings.push(xs[i] ?? 0);
    } else if (a * b < 0) {
      const t = a / (a - b);
      crossings.push((xs[i] ?? 0) + t * ((xs[i + 1] ?? 0) - (xs[i] ?? 0)));
    }
  }
  return {
    zoom: z,
    level: c,
    showF,
    halfWidth: h,
    xs,
    fVals,
    fpVals,
    envPos,
    envNeg,
    crossings,
    fpMin,
    fpMax,
  };
}

export const darbouxModel: SceneModel<DarbouxData> = {
  compute(state) {
    return darbouxData(Number(state['zoom']), Number(state['level']), parseShowF(state['showF']));
  },
};
