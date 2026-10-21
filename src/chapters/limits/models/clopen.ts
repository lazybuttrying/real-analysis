import type { SceneModel } from '../../../contracts';

/**
 * Clopen sets, live: clopenness is relative to the ambient space. The same
 * set can be clopen in a subspace without being clopen in R. Four
 * ambient/set pairs are offered; a test point x and a radius eps probe
 * whether the eps-ball around x stays inside A relative to the ambient X,
 * i.e. whether (x - eps, x + eps) ∩ X ⊆ A.
 * Pure computation: no DOM, d3, or three.
 */

export interface Interval {
  readonly lo: number;
  readonly hi: number;
  readonly loOpen: boolean;
  readonly hiOpen: boolean;
}

interface ClopenCase {
  readonly id: string;
  readonly ambient: readonly Interval[];
  readonly setA: readonly Interval[];
  readonly openInX: boolean;
  readonly closedInX: boolean;
  readonly openInR: boolean;
  readonly closedInR: boolean;
  /** A point of A around which no eps-ball stays in A relative to X (when !openInX). */
  readonly witnessNotOpen?: number;
  /** A limit point of A that lies in X but outside A (when !closedInX). */
  readonly witnessNotClosed?: number;
  readonly domLo: number;
  readonly domHi: number;
  readonly xInit: number;
}

const R: Interval = {
  lo: Number.NEGATIVE_INFINITY,
  hi: Number.POSITIVE_INFINITY,
  loOpen: true,
  hiOpen: true,
};

export const CLOPEN_CASES: readonly ClopenCase[] = [
  {
    id: 'open-interval',
    ambient: [R],
    setA: [{ lo: 0, hi: 1, loOpen: true, hiOpen: true }],
    openInX: true,
    closedInX: false,
    openInR: true,
    closedInR: false,
    witnessNotClosed: 0,
    domLo: -0.6,
    domHi: 1.6,
    xInit: 0.5,
  },
  {
    id: 'closed-interval',
    ambient: [R],
    setA: [{ lo: 0, hi: 1, loOpen: false, hiOpen: false }],
    openInX: false,
    closedInX: true,
    openInR: false,
    closedInR: true,
    witnessNotOpen: 0,
    domLo: -0.6,
    domHi: 1.6,
    xInit: 0.5,
  },
  {
    id: 'clopen-pieces',
    ambient: [
      { lo: 0, hi: 1, loOpen: false, hiOpen: false },
      { lo: 2, hi: 3, loOpen: false, hiOpen: false },
    ],
    setA: [{ lo: 0, hi: 1, loOpen: false, hiOpen: false }],
    openInX: true,
    closedInX: true,
    openInR: false,
    closedInR: true,
    domLo: -0.6,
    domHi: 3.6,
    xInit: 0.5,
  },
  {
    id: 'clopen-gap',
    ambient: [
      { lo: 0, hi: 1, loOpen: true, hiOpen: true },
      { lo: 1, hi: 2, loOpen: true, hiOpen: true },
    ],
    setA: [{ lo: 0, hi: 1, loOpen: true, hiOpen: true }],
    openInX: true,
    closedInX: true,
    openInR: true,
    closedInR: false,
    domLo: -0.4,
    domHi: 2.4,
    xInit: 0.5,
  },
];

export const CLOPEN_CASE_INIT = 'clopen-pieces';

export const CLOPEN_X_MIN = -0.6;
export const CLOPEN_X_MAX = 3.6;
export const CLOPEN_X_INIT = 0.5;

export const CLOPEN_EPS_MIN = 0.01;
export const CLOPEN_EPS_MAX = 2;
export const CLOPEN_EPS_INIT = 0.2;

export function intervalContains(iv: Interval, t: number): boolean {
  const loOk = t > iv.lo || (!iv.loOpen && t === iv.lo);
  const hiOk = t < iv.hi || (!iv.hiOpen && t === iv.hi);
  return loOk && hiOk;
}

export function intervalIsEmpty(iv: Interval): boolean {
  return iv.lo > iv.hi || (iv.lo === iv.hi && (iv.loOpen || iv.hiOpen));
}

export function intervalIntersect(a: Interval, b: Interval): Interval {
  let lo: number;
  let loOpen: boolean;
  if (a.lo > b.lo) {
    lo = a.lo;
    loOpen = a.loOpen;
  } else if (a.lo < b.lo) {
    lo = b.lo;
    loOpen = b.loOpen;
  } else {
    lo = a.lo;
    loOpen = a.loOpen || b.loOpen;
  }
  let hi: number;
  let hiOpen: boolean;
  if (a.hi < b.hi) {
    hi = a.hi;
    hiOpen = a.hiOpen;
  } else if (a.hi > b.hi) {
    hi = b.hi;
    hiOpen = b.hiOpen;
  } else {
    hi = a.hi;
    hiOpen = a.hiOpen || b.hiOpen;
  }
  return { lo, hi, loOpen, hiOpen };
}

/**
 * a \ b as a list of 0, 1, or 2 intervals. The left piece keeps b.lo only
 * when a contains it and b does not; likewise on the right.
 */
export function intervalSubtract(a: Interval, b: Interval): Interval[] {
  const left = intervalIntersect(a, {
    lo: Number.NEGATIVE_INFINITY,
    hi: b.lo,
    loOpen: true,
    hiOpen: intervalContains(b, b.lo),
  });
  const right = intervalIntersect(a, {
    lo: b.hi,
    hi: Number.POSITIVE_INFINITY,
    loOpen: intervalContains(b, b.hi),
    hiOpen: true,
  });
  return [left, right].filter((iv) => !intervalIsEmpty(iv));
}

export function unionContains(intervals: readonly Interval[], t: number): boolean {
  return intervals.some((iv) => intervalContains(iv, t));
}

/**
 * (x - eps, x + eps) ∩ X with A removed, as intervals.
 * Empty if and only if the eps-ball around x stays inside A relative to X.
 */
export function ballRemainder(
  x: number,
  eps: number,
  ambient: readonly Interval[],
  setA: readonly Interval[],
): Interval[] {
  const ball: Interval = { lo: x - eps, hi: x + eps, loOpen: true, hiOpen: true };
  let parts: Interval[] = [];
  for (const j of ambient) {
    const k = intervalIntersect(ball, j);
    if (!intervalIsEmpty(k)) parts.push(k);
  }
  for (const b of setA) {
    const next: Interval[] = [];
    for (const p of parts) next.push(...intervalSubtract(p, b));
    parts = next;
  }
  return parts;
}

export function ballStaysInA(
  x: number,
  eps: number,
  ambient: readonly Interval[],
  setA: readonly Interval[],
): boolean {
  return ballRemainder(x, eps, ambient, setA).length === 0;
}

/**
 * Distance from t to the union, in the closed sense: 0 iff every ball
 * around t meets the union, i.e. t is in its closure. Exact for intervals.
 */
export function distanceToUnion(intervals: readonly Interval[], t: number): number {
  let d = Number.POSITIVE_INFINITY;
  for (const iv of intervals) {
    if (t < iv.lo) d = Math.min(d, iv.lo - t);
    else if (t > iv.hi) d = Math.min(d, t - iv.hi);
    else return 0;
  }
  return d;
}

export interface ClopenData {
  readonly caseId: string;
  readonly x: number;
  readonly eps: number;
  readonly inA: boolean;
  readonly ballStaysInA: boolean;
  readonly openInX: boolean;
  readonly closedInX: boolean;
  readonly clopenInX: boolean;
  readonly openInR: boolean;
  readonly closedInR: boolean;
  readonly ambient: readonly Interval[];
  readonly setA: readonly Interval[];
  readonly domLo: number;
  readonly domHi: number;
}

function clampX(x: number, c: ClopenCase): number {
  if (!Number.isFinite(x)) return c.xInit;
  return Math.max(c.domLo, Math.min(c.domHi, x));
}

function clampEps(eps: number): number {
  if (!Number.isFinite(eps)) return CLOPEN_EPS_INIT;
  return Math.max(CLOPEN_EPS_MIN, Math.min(CLOPEN_EPS_MAX, eps));
}

function clopenData(caseId: string, x: number, eps: number): ClopenData {
  const fallback = CLOPEN_CASES.find((k) => k.id === CLOPEN_CASE_INIT)!;
  const c = CLOPEN_CASES.find((k) => k.id === caseId) ?? fallback;
  const xx = clampX(x, c);
  const ee = clampEps(eps);
  return {
    caseId: c.id,
    x: xx,
    eps: ee,
    inA: unionContains(c.setA, xx),
    ballStaysInA: ballStaysInA(xx, ee, c.ambient, c.setA),
    openInX: c.openInX,
    closedInX: c.closedInX,
    clopenInX: c.openInX && c.closedInX,
    openInR: c.openInR,
    closedInR: c.closedInR,
    ambient: c.ambient,
    setA: c.setA,
    domLo: c.domLo,
    domHi: c.domHi,
  };
}

export const clopenModel: SceneModel<ClopenData> = {
  compute(state) {
    const raw = state['case'];
    const caseId = typeof raw === 'string' ? raw : CLOPEN_CASE_INIT;
    return clopenData(caseId, Number(state['x']), Number(state['eps']));
  },
};
