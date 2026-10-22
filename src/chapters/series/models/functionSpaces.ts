import type { SceneModel } from '../../../contracts';

/**
 * Function spaces, live: the chain C_c(R) subsetneq C_0(R) subsetneq
 * C_b(R) under the sup norm, on the window [-4, 4]. Three
 * representatives, one per gap:
 *   tentBump(x) = max(0, 1 - |x|): in C_c (support [-1, 1]), hence in
 *     C_0 and C_b.
 *   expDecay(x) = e^{-|x|}: in C_0 (tails tend to 0) but not in C_c
 *     (strictly positive everywhere, so its support is all of R).
 *   oneFn(x) = 1: in C_b but not in C_0 (the value at infinity is 1).
 * The cutoff mode multiplies expDecay by the tent cutoff
 *   phi_k(x) = 1 for |x| <= k, k + 1 - |x| for k <= |x| <= k + 1,
 *   0 beyond,
 * so f_k = phi_k * f lies in C_c (support inside [-(k+1), k+1]) and
 * approximates f in sup norm. The exact sup error is e^{-(k+1)}:
 * on |x| <= k the error is 0; on k <= |x| <= k + 1 it is
 * (|x| - k) e^{-|x|} = e^{-(k+1)} * s e^{1-s} with s = |x| - k in
 * [0, 1], and s e^{1-s} <= 1 because e^{s-1} >= s; on |x| >= k + 1 it
 * is e^{-|x|} <= e^{-(k+1)}. The value e^{-(k+1)} is attained at
 * |x| = k + 1. The looser bound e^{-k} also holds. supErrorNumeric
 * recomputes the error on a fine grid; the tests check the two agree.
 * Pure computation: no DOM, d3, or three.
 */

export type FunctionSpacesMode = 'spaces' | 'cutoff';

export const FUNCTION_SPACES_MODES: readonly FunctionSpacesMode[] = ['spaces', 'cutoff'];

export const FUNCTION_SPACES_MODE_INIT: FunctionSpacesMode = 'spaces';

export const FUNCTION_SPACES_K_MIN = 0.5;
export const FUNCTION_SPACES_K_MAX = 3;
export const FUNCTION_SPACES_K_INIT = 1;

/** Drawing window: x in [-FS_X_MAX, FS_X_MAX]. */
export const FS_X_MAX = 4;

/** Sample step for the drawn curves. */
export const FS_SAMPLE_STEP = 0.02;

export interface FsPoint {
  readonly x: number;
  readonly y: number;
}

/** The tent bump: in C_c, support [-1, 1], peak value 1 at 0. */
export function tentBump(x: number): number {
  return Math.max(0, 1 - Math.abs(x));
}

/** e^{-|x|}: in C_0 but not in C_c (positive everywhere). */
export function expDecay(x: number): number {
  return Math.exp(-Math.abs(x));
}

/** The constant function 1: in C_b but not in C_0. */
export function oneFn(_x: number): number {
  return 1;
}

/** The cutoff phi_k: 1 on [-k, k], linear down to 0 at +-(k + 1). */
export function cutoff(x: number, k: number): number {
  const a = Math.abs(x);
  if (a <= k) return 1;
  if (a >= k + 1) return 0;
  return k + 1 - a;
}

/** f_k = phi_k * e^{-|x|}: in C_c, support inside [-(k+1), k+1]. */
export function cutoffApprox(x: number, k: number): number {
  return cutoff(x, k) * expDecay(x);
}

/** The exact sup-norm error ||f - f_k||_infinity = e^{-(k+1)}. */
export function supErrorExact(k: number): number {
  return Math.exp(-(k + 1));
}

/** A looser valid bound on the sup error: e^{-k}. */
export function supErrorBound(k: number): number {
  return Math.exp(-k);
}

/**
 * The sup error recomputed on a grid of step 0.001 over [0, 8] (the
 * functions are even, and beyond 8 the error is below e^{-8}, smaller
 * than e^{-(k+1)} for every k in range).
 */
export function supErrorNumeric(k: number): number {
  let max = 0;
  const steps = 8000;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 8;
    const err = Math.abs(expDecay(x) - cutoffApprox(x, k));
    if (err > max) max = err;
  }
  return max;
}

function sample(fn: (x: number) => number): FsPoint[] {
  const points: FsPoint[] = [];
  const steps = Math.round((2 * FS_X_MAX) / FS_SAMPLE_STEP);
  for (let i = 0; i <= steps; i++) {
    const x = -FS_X_MAX + i * FS_SAMPLE_STEP;
    points.push({ x, y: fn(x) });
  }
  return points;
}

export interface FunctionSpacesData {
  readonly mode: FunctionSpacesMode;
  /** The cutoff position (used in cutoff mode). */
  readonly k: number;
  /** The three representatives, sampled on the window. */
  readonly tentSamples: readonly FsPoint[];
  readonly expSamples: readonly FsPoint[];
  readonly oneSamples: readonly FsPoint[];
  /** phi_k and f_k = phi_k * f, sampled on the window. */
  readonly phiSamples: readonly FsPoint[];
  readonly fkSamples: readonly FsPoint[];
  /** Sup norms of the representatives (all exactly 1). */
  readonly tentSup: number;
  readonly expSup: number;
  readonly oneSup: number;
  /** Values at the window edge x = 4: the tails made visible. */
  readonly tentTail: number;
  readonly expTail: number;
  readonly oneTail: number;
  /** ||f - f_k||_infinity: exact value e^{-(k+1)}. */
  readonly errorExact: number;
  /** The same error recomputed numerically. */
  readonly errorNumeric: number;
  /** The looser bound e^{-k}. */
  readonly errorBound: number;
  /** f_k vanishes outside [-(k+1), k+1]. */
  readonly supportHi: number;
}

function clampK(k: number): number {
  if (!Number.isFinite(k)) return FUNCTION_SPACES_K_INIT;
  return Math.max(FUNCTION_SPACES_K_MIN, Math.min(FUNCTION_SPACES_K_MAX, k));
}

function functionSpacesData(modeRaw: string, kRaw: number): FunctionSpacesData {
  const mode: FunctionSpacesMode = (FUNCTION_SPACES_MODES as readonly string[]).includes(modeRaw)
    ? (modeRaw as FunctionSpacesMode)
    : FUNCTION_SPACES_MODE_INIT;
  const k = clampK(kRaw);
  return {
    mode,
    k,
    tentSamples: sample(tentBump),
    expSamples: sample(expDecay),
    oneSamples: sample(oneFn),
    phiSamples: sample((x) => cutoff(x, k)),
    fkSamples: sample((x) => cutoffApprox(x, k)),
    tentSup: 1,
    expSup: 1,
    oneSup: 1,
    tentTail: tentBump(FS_X_MAX),
    expTail: expDecay(FS_X_MAX),
    oneTail: 1,
    errorExact: supErrorExact(k),
    errorNumeric: supErrorNumeric(k),
    errorBound: supErrorBound(k),
    supportHi: k + 1,
  };
}

export const functionSpacesModel: SceneModel<FunctionSpacesData> = {
  compute(state) {
    const raw = state['mode'];
    const mode = typeof raw === 'string' ? raw : FUNCTION_SPACES_MODE_INIT;
    return functionSpacesData(mode, Number(state['k']));
  },
};
