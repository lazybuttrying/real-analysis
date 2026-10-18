import type { SceneModel } from '../../../contracts';

/**
 * Riemann's rearrangement theorem, live: the greedy block rearrangement of
 * the alternating harmonic series steered onto an arbitrary target.
 *
 * Alternating harmonic series split into positives p_k = 1/(2k-1) and
 * negative magnitudes q_k = 1/(2k). The greedy rule with running sum t
 * and target s:
 *   if t <= s: take the next positive p_{++i}; else take the next negative -q_{++j}.
 * Both subsequences are infinite (their sums diverge), so both blocks recur
 * forever. Each crossing overshoots by at most the crossing term, and the
 * term magnitudes tend to 0, hence the walk converges to s.
 *
 * Verified identities (tests/riemann-rearrangement.test.ts):
 *   target s = 1, greedy walk: S_2 = 4/3 (first positive block, overshoot 1/3),
 *   S_3 = 5/6 (first negative block, undershoot 1/6),
 *   S_4 = 31/30 (overshoot 1/30), S_5 = 47/60 (undershoot 13/60),
 *   S_7 = 1307/1260 (overshoot 47/1260), S_8 = 1097/1260 (undershoot 163/1260).
 *   Every crossing overshoot/undershoot is <= the crossing term's magnitude
 *   (equal only when the walk lands exactly on s, as at S_1 = 1).
 */

interface RiemannStep {
  /** 1-based step index. */
  step: number;
  /** +1 when a positive term was taken, -1 when a negative term was taken. */
  dir: 1 | -1;
  /** Magnitude of the taken term (p_i or q_j). */
  mag: number;
  /** Partial sum after this step. */
  sum: number;
}

export interface RiemannData {
  target: number;
  terms: number;
  /** One entry per taken term, in walk order. */
  steps: RiemannStep[];
  /** Partial sum after all terms. */
  finalSum: number;
  /** |finalSum - target|. */
  error: number;
  /** Number of positive terms used. */
  posUsed: number;
  /** Number of negative terms used. */
  negUsed: number;
  /** y-domain padding: extremes of the walk and the target line. */
  lo: number;
  hi: number;
}

export const MIN_TARGET = -2;
export const MAX_TARGET = 3;
export const DEFAULT_TARGET = 1;
export const MIN_TERMS = 20;
export const MAX_TERMS = 400;
export const DEFAULT_TERMS = 120;

/** Positive term p_k = 1/(2k-1), k >= 1. */
export function posTerm(k: number): number {
  return 1 / (2 * k - 1);
}

/** Negative-term magnitude q_k = 1/(2k), k >= 1. */
export function negTerm(k: number): number {
  return 1 / (2 * k);
}

/**
 * The greedy rearrangement walk for target s with at most n terms.
 * Pure: no DOM, no d3.
 */
export function greedyWalk(s: number, n: number): RiemannData {
  const steps: RiemannStep[] = [];
  let t = 0;
  let i = 0;
  let j = 0;
  let lo = Math.min(0, s);
  let hi = Math.max(0, s);
  for (let k = 1; k <= n; k++) {
    let dir: 1 | -1;
    let mag: number;
    if (t <= s) {
      i += 1;
      dir = 1;
      mag = posTerm(i);
      t += mag;
    } else {
      j += 1;
      dir = -1;
      mag = negTerm(j);
      t -= mag;
    }
    steps.push({ step: k, dir, mag, sum: t });
    if (t < lo) lo = t;
    if (t > hi) hi = t;
  }
  return {
    target: s,
    terms: n,
    steps,
    finalSum: t,
    error: Math.abs(t - s),
    posUsed: i,
    negUsed: j,
    lo,
    hi,
  };
}

/**
 * Crossing points: the step that ends each block (the overshoot /
 * undershoot point that brackets the target ever more tightly), plus any
 * step that lands exactly on the target. Every complete block crosses s
 * exactly once; the walk's final partial block is included only if it
 * reached s. Returns { step, sum, gap, mag } per crossing, in walk order.
 */
export interface Crossing {
  step: number;
  sum: number;
  /** |sum - target| at the crossing (the overshoot / undershoot). */
  gap: number;
  /** Magnitude of the term that caused the crossing. */
  mag: number;
}

export function crossings(data: RiemannData): Crossing[] {
  const out: Crossing[] = [];
  const s = data.target;
  const steps = data.steps;
  // Sum just before the current block: 0, or steps[blockStart - 1].sum.
  let blockStart = 0;
  for (let k = 0; k < steps.length; k++) {
    const st = steps[k];
    if (!st) continue;
    const next = steps[k + 1];
    const isBlockEnd = !next || next.dir !== st.dir;
    if (st.sum === s) {
      // Exact landing (gap 0); may sit mid-block, as S_1 = 1 does for s = 1.
      out.push({ step: st.step, sum: st.sum, gap: 0, mag: st.mag });
    } else if (isBlockEnd) {
      // The block crossed s iff it started on the opposite side (or on s:
      // a block starting exactly on s takes one step and leaves it).
      const before = blockStart === 0 ? 0 : (steps[blockStart - 1]?.sum ?? 0);
      if ((before - s) * (st.sum - s) <= 0) {
        out.push({ step: st.step, sum: st.sum, gap: Math.abs(st.sum - s), mag: st.mag });
      }
    }
    if (isBlockEnd) blockStart = k + 1;
  }
  return out;
}

export const riemannModel: SceneModel<RiemannData> = {
  compute(state) {
    const targetRaw = Number(state['target']);
    const target = Number.isFinite(targetRaw)
      ? Math.min(MAX_TARGET, Math.max(MIN_TARGET, targetRaw))
      : DEFAULT_TARGET;
    const termsRaw = Number(state['terms']);
    const terms = Number.isFinite(termsRaw)
      ? Math.min(MAX_TERMS, Math.max(MIN_TERMS, Math.floor(termsRaw)))
      : DEFAULT_TERMS;
    return greedyWalk(target, terms);
  },
};
