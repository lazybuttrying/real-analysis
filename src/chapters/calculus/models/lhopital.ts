import type { SceneModel } from '../../../contracts';

/**
 * L'Hopital's rule: when f and g both tend to 0 (or |g| tends to infinity)
 * near a, g' != 0, and lim f'(x)/g'(x) exists, then
 *   lim f(x)/g(x) = lim f'(x)/g'(x).
 * The 0/0 case is Cauchy's mean value theorem on [a, x] (or [x, a]) in
 * disguise; the infinity case runs the same theorem on a fixed [A, x].
 *
 * Two demo pairs, each with its own limit point a:
 *   'sin x / x' : f(x) = sin x, g(x) = x, x -> 0+    (0/0 form, limit 1)
 *   'ln x / x'  : f(x) = ln x,  g(x) = x, x -> +inf  (inf/inf form, limit 0)
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Select-control option ids (also the labels shown in the UI). */
export const PAIR_SIN = 'sin x / x';
export const PAIR_LOG = 'ln x / x';

type LHopitalPair = 'sin' | 'log';

/** Slider range: 0 = far from the limit point, 100 = at the limit point. */
export const POS_MIN = 0;
export const POS_MAX = 100;
export const POS_INIT = 55;

/** Log-spaced sample points per curve. */
export const GRID_POINTS = 161;

/** f(x) = sin x, g(x) = x, x -> 0+. */
function sinF(x: number): number {
  return Math.sin(x);
}
function sinG(x: number): number {
  return x;
}
function sinFp(x: number): number {
  return Math.cos(x);
}
function sinGp(_x: number): number {
  return 1;
}

/** f(x) = ln x, g(x) = x, x -> +infinity. */
export function logF(x: number): number {
  return Math.log(x);
}
export function logG(x: number): number {
  return x;
}
function logFp(x: number): number {
  return 1 / x;
}
function logGp(_x: number): number {
  return 1;
}

/**
 * Problem 3: x ln x rewritten as (ln x)/(1/x) for x > 0.
 * With f(x) = ln x and g(x) = 1/x, f'(x)/g'(x) = (1/x)/(-1/x^2) = -x.
 */
export function xLogX(x: number): number {
  return x * Math.log(x);
}
export function xLogXDerivRatio(x: number): number {
  return -x;
}

interface PairDef {
  f: (x: number) => number;
  g: (x: number) => number;
  fp: (x: number) => number;
  gp: (x: number) => number;
  /** The shared limit of f/g and f'/g'. */
  limit: number;
  /** Domain endpoints (xLo < xHi) for the sample grid. */
  xLo: number;
  xHi: number;
  /** Slider travel: x = xFar at pos 0, x = xNear at pos 100 (toward the limit point). */
  xFar: number;
  xNear: number;
}

const PAIRS: Record<LHopitalPair, PairDef> = {
  sin: { f: sinF, g: sinG, fp: sinFp, gp: sinGp, limit: 1, xLo: 0.0015, xHi: 1.5, xFar: 1.5, xNear: 0.0015 },
  log: { f: logF, g: logG, fp: logFp, gp: logGp, limit: 0, xLo: 10, xHi: 1000, xFar: 10, xNear: 1000 },
};

export function parsePair(raw: unknown): LHopitalPair {
  return raw === PAIR_LOG ? 'log' : 'sin';
}

/**
 * Slider position -> x, log-uniform between the pair's far and near ends, so
 * equal slider travel means an equal relative approach to the limit point.
 * Dragging right (pos -> 100) drives x toward the limit point a:
 *   sin: x = 1.5 at pos 0, x = 0.0015 at pos 100 (a = 0);
 *   log: x = 10 at pos 0, x = 1000 at pos 100 (a = +infinity).
 */
export function sliderX(pair: LHopitalPair, pos: number): number {
  const t = Math.min(POS_MAX, Math.max(POS_MIN, pos)) / POS_MAX;
  const def = PAIRS[pair];
  return def.xFar * Math.pow(def.xNear / def.xFar, t);
}

export interface LHopitalData {
  pair: LHopitalPair;
  /** Slider position, clamped to [0, 100]. */
  pos: number;
  /** Current x (from the slider). */
  x: number;
  f: number;
  g: number;
  fp: number;
  gp: number;
  /** f(x)/g(x). */
  ratio: number;
  /** f'(x)/g'(x). */
  derivRatio: number;
  /** The limit both ratios approach. */
  limit: number;
  /** Log-spaced sample grid over the pair's domain. */
  xs: number[];
  fVals: number[];
  gVals: number[];
  ratioVals: number[];
  derivRatioVals: number[];
}

export function lhopitalData(pair: LHopitalPair, pos: number): LHopitalData {
  const def = PAIRS[pair];
  const clamped = Number.isFinite(pos)
    ? Math.min(POS_MAX, Math.max(POS_MIN, Math.floor(pos)))
    : POS_INIT;
  const x = sliderX(pair, clamped);
  const xs: number[] = new Array<number>(GRID_POINTS);
  const fVals: number[] = new Array<number>(GRID_POINTS);
  const gVals: number[] = new Array<number>(GRID_POINTS);
  const ratioVals: number[] = new Array<number>(GRID_POINTS);
  const derivRatioVals: number[] = new Array<number>(GRID_POINTS);
  for (let i = 0; i < GRID_POINTS; i++) {
    const xi = def.xLo * Math.pow(def.xHi / def.xLo, i / (GRID_POINTS - 1));
    const fi = def.f(xi);
    const gi = def.g(xi);
    xs[i] = xi;
    fVals[i] = fi;
    gVals[i] = gi;
    ratioVals[i] = fi / gi;
    derivRatioVals[i] = def.fp(xi) / def.gp(xi);
  }
  const f = def.f(x);
  const g = def.g(x);
  return {
    pair,
    pos: clamped,
    x,
    f,
    g,
    fp: def.fp(x),
    gp: def.gp(x),
    ratio: f / g,
    derivRatio: def.fp(x) / def.gp(x),
    limit: def.limit,
    xs,
    fVals,
    gVals,
    ratioVals,
    derivRatioVals,
  };
}

export const lhopitalModel: SceneModel<LHopitalData> = {
  compute(state) {
    return lhopitalData(parsePair(state['pair']), Number(state['pos']));
  },
};
