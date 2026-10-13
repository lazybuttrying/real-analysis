import type { SceneModel } from '../../../contracts';

/**
 * Bolzano–Weierstrass by interval bisection, at the idea level: a deterministic
 * pseudo-random sequence in [0,1] is halved again and again, always keeping the
 * half that holds at least as many surviving points. The survivors form the
 * convergent subsequence. Pure computation: no DOM, d3, or three.
 */

export const MAX_STEPS = 8;
export const POINT_COUNT = 400;

/** Deterministic PRNG so the same seed always draws the same sequence. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface BWInterval {
  a: number;
  b: number;
}

export interface BolzanoWeierstrassData {
  seed: number;
  steps: number;
  points: number[];
  /** Nested intervals: intervals[0] = [0,1]; each next one is the kept half. */
  intervals: BWInterval[];
  /** Points surviving inside the final interval, in original order (the subsequence). */
  subsequence: number[];
}

export function bolzanoWeierstrass(seed: number, steps: number, count: number = POINT_COUNT): BolzanoWeierstrassData {
  const rand = mulberry32(seed);
  const points: number[] = [];
  for (let i = 0; i < count; i++) points.push(rand());

  const intervals: BWInterval[] = [{ a: 0, b: 1 }];
  let alive = points;
  for (let s = 0; s < steps; s++) {
    const current = intervals[s];
    if (current === undefined) break;
    const mid = (current.a + current.b) / 2;
    const left = alive.filter((x) => x <= mid);
    const right = alive.filter((x) => x > mid);
    const keepLeft = left.length >= right.length;
    intervals.push(keepLeft ? { a: current.a, b: mid } : { a: mid, b: current.b });
    alive = keepLeft ? left : right;
  }
  return { seed, steps, points, intervals, subsequence: alive };
}

export const bolzanoWeierstrassModel: SceneModel<BolzanoWeierstrassData> = {
  compute(state) {
    const seedRaw = Number(state['seed']);
    const seed = Number.isFinite(seedRaw) ? Math.floor(seedRaw) : 7;
    const stepsRaw = Number(state['steps']);
    const steps = Number.isFinite(stepsRaw) ? Math.min(MAX_STEPS, Math.max(1, Math.floor(stepsRaw))) : 4;
    return bolzanoWeierstrass(seed, steps);
  },
};
