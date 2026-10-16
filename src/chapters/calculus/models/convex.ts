import type { SceneModel } from '../../../contracts';

/**
 * Convex functions: f(tx + (1-t)y) <= t f(x) + (1-t) f(y).
 * The geometric reading is that the chord between any two graph points
 * floats on or above the graph. This module samples f on a fixed window,
 * samples the chord interval, and reports the max chord-minus-graph gap
 * (nonnegative exactly when f is convex there). Pure computation:
 * no DOM, d3, or three.
 */

export type ConvexFnKey = 'square' | 'exp' | 'abs';

export function convexFnKey(option: unknown): ConvexFnKey {
  return option === 'exp' ? 'exp' : option === 'abs' ? 'abs' : 'square';
}

export function convexFn(key: ConvexFnKey, x: number): number {
  if (key === 'exp') return Math.exp(x);
  if (key === 'abs') return Math.abs(x);
  return x * x;
}

/** Chord value at x between (a, f(a)) and (b, f(b)). */
export function chordY(key: ConvexFnKey, a: number, b: number, x: number): number {
  const fa = convexFn(key, a);
  const fb = convexFn(key, b);
  return fa + ((fb - fa) * (x - a)) / (b - a);
}

export interface ConvexData {
  key: ConvexFnKey;
  a: number;
  b: number;
  samples: Array<{ x: number; y: number }>;
  chord: Array<{ x: number; y: number }>;
  /** max(chordY - f(x)) over the chord points; >= 0 means convex on [a, b] */
  maxGap: number;
}

const SAMPLE_MIN = -2.5;
const SAMPLE_MAX = 2.5;
const SAMPLE_COUNT = 400;
/** 200 intervals (201 points) so the interval midpoint is always sampled. */
const CHORD_INTERVALS = 200;
const BOUND = 2;

export function convexData(key: ConvexFnKey, a: number, b: number): ConvexData {
  const clamp = (v: number): number => Math.min(BOUND, Math.max(-BOUND, v));
  let lo = clamp(a);
  let hi = clamp(b);
  if (lo > hi) {
    const t = lo;
    lo = hi;
    hi = t;
  }
  if (hi - lo < 1e-9) {
    hi = clamp(lo + 0.2);
    if (hi - lo < 1e-9) {
      // lo is pinned against the upper wall: widen downward instead.
      lo = clamp(hi - 0.2);
      hi = clamp(lo + 0.2);
    }
  }

  const samples: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const x = SAMPLE_MIN + ((SAMPLE_MAX - SAMPLE_MIN) * i) / (SAMPLE_COUNT - 1);
    samples.push({ x, y: convexFn(key, x) });
  }

  const chord: Array<{ x: number; y: number }> = [];
  let maxGap = 0;
  for (let i = 0; i <= CHORD_INTERVALS; i++) {
    const x = lo + ((hi - lo) * i) / CHORD_INTERVALS;
    const y = convexFn(key, x);
    chord.push({ x, y });
    const gap = chordY(key, lo, hi, x) - y;
    if (gap > maxGap) maxGap = gap;
  }

  return { key, a: lo, b: hi, samples, chord, maxGap };
}

export const convexModel: SceneModel<ConvexData> = {
  compute(state) {
    const key = convexFnKey(state['fn']);
    const rawA = Number(state['a']);
    const rawB = Number(state['b']);
    const a = Number.isFinite(rawA) ? rawA : -1;
    const b = Number.isFinite(rawB) ? rawB : 1;
    return convexData(key, a, b);
  },
};
