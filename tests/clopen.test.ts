import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  ballRemainder,
  ballStaysInA,
  clopenModel,
  CLOPEN_CASE_INIT,
  CLOPEN_CASES,
  CLOPEN_EPS_INIT,
  CLOPEN_EPS_MAX,
  CLOPEN_EPS_MIN,
  CLOPEN_X_INIT,
  CLOPEN_X_MAX,
  CLOPEN_X_MIN,
  distanceToUnion,
  intervalContains,
  intervalIntersect,
  intervalIsEmpty,
  intervalSubtract,
  unionContains,
  type ClopenData,
  type Interval,
} from '../src/chapters/limits/models/clopen';
import { clopenProblems } from '../src/chapters/limits/problems/clopen';

const compute = (state: ControlState): ClopenData => syncCompute(clopenModel, state);

const caseById = (id: string) => CLOPEN_CASES.find((c) => c.id === id)!;

describe('clopen: interval arithmetic', () => {
  it('intervalContains respects open/closed endpoints', () => {
    const open: Interval = { lo: 0, hi: 1, loOpen: true, hiOpen: true };
    const closed: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    expect(intervalContains(open, 0)).toBe(false);
    expect(intervalContains(open, 0.5)).toBe(true);
    expect(intervalContains(closed, 0)).toBe(true);
    expect(intervalContains(closed, 1)).toBe(true);
    expect(intervalContains(closed, 1.5)).toBe(false);
  });

  it('intervalIntersect takes the tighter end with OR-ed openness on ties', () => {
    const a: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    const b: Interval = { lo: 0, hi: 2, loOpen: true, hiOpen: true };
    const k = intervalIntersect(a, b);
    expect(k.lo).toBe(0);
    expect(k.loOpen).toBe(true); // tie: open wins
    expect(k.hi).toBe(1);
    expect(k.hiOpen).toBe(false);
    expect(intervalIsEmpty(intervalIntersect(a, { lo: 2, hi: 3, loOpen: true, hiOpen: true }))).toBe(true);
  });

  it('intervalSubtract removes exactly the overlap', () => {
    const closed: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    const open: Interval = { lo: 0, hi: 1, loOpen: true, hiOpen: true };
    // [0,1] \ (0,1) = {0} ∪ {1}
    const r1 = intervalSubtract(closed, open);
    expect(r1).toHaveLength(2);
    expect(r1.every((iv) => iv.lo === iv.hi && !iv.loOpen && !iv.hiOpen)).toBe(true);
    // (0,1) \ [0,1] = empty
    expect(intervalSubtract(open, closed)).toHaveLength(0);
    // (0.5,1] \ [0,1] = empty (the shared endpoint 1 is in [0,1])
    const half: Interval = { lo: 0.5, hi: 1, loOpen: true, hiOpen: false };
    expect(intervalSubtract(half, closed)).toHaveLength(0);
    // [0,2] \ [0,1] = (1,2]
    const wide: Interval = { lo: 0, hi: 2, loOpen: false, hiOpen: false };
    const r2 = intervalSubtract(wide, closed);
    expect(r2).toHaveLength(1);
    expect(r2[0]!.lo).toBe(1);
    expect(r2[0]!.loOpen).toBe(true);
    expect(r2[0]!.hi).toBe(2);
  });
});

describe('clopen: the four cases', () => {
  it('open/closed verdicts match the mathematics', () => {
    expect(caseById('open-interval').openInX).toBe(true);
    expect(caseById('open-interval').closedInX).toBe(false);
    expect(caseById('closed-interval').openInX).toBe(false);
    expect(caseById('closed-interval').closedInX).toBe(true);
    expect(caseById('clopen-pieces').openInX).toBe(true);
    expect(caseById('clopen-pieces').closedInX).toBe(true);
    expect(caseById('clopen-gap').openInX).toBe(true);
    expect(caseById('clopen-gap').closedInX).toBe(true);
  });

  it('data.clopenInX is the conjunction', () => {
    for (const c of CLOPEN_CASES) {
      const data = compute({ case: c.id, x: c.xInit, eps: 0.2 });
      expect(data.clopenInX).toBe(data.openInX && data.closedInX);
      expect(data.caseId).toBe(c.id);
    }
  });

  it('R-comparison verdicts: clopen is relative', () => {
    // [0,1] is clopen in [0,1]∪[2,3] but only closed (not open) in R.
    const pieces = compute({ case: 'clopen-pieces', x: 0.5, eps: 0.2 });
    expect(pieces.clopenInX).toBe(true);
    expect(pieces.openInR).toBe(false);
    expect(pieces.closedInR).toBe(true);
    // (0,1) is clopen in (0,1)∪(1,2) but only open (not closed) in R.
    const gap = compute({ case: 'clopen-gap', x: 0.5, eps: 0.2 });
    expect(gap.clopenInX).toBe(true);
    expect(gap.openInR).toBe(true);
    expect(gap.closedInR).toBe(false);
  });
});

describe('clopen: the eps-ball test', () => {
  it('at x = 1, eps = 0.5 the ball stays in [0,1] relative to X = [0,1]∪[2,3]', () => {
    const data = compute({ case: 'clopen-pieces', x: 1, eps: 0.5 });
    expect(data.inA).toBe(true);
    expect(data.ballStaysInA).toBe(true);
    expect(ballRemainder(1, 0.5, data.ambient, data.setA)).toHaveLength(0);
  });

  it('a wide ball at x = 1 escapes: (1-1.5, 1+1.5) ∩ X = [0,1]∪[2,2.5) ⊄ [0,1]', () => {
    const data = compute({ case: 'clopen-pieces', x: 1, eps: 1.5 });
    expect(data.eps).toBe(1.5);
    expect(data.inA).toBe(true);
    expect(data.ballStaysInA).toBe(false);
  });

  it('closed interval in R: the ball around the boundary point 0 always escapes', () => {
    const c = caseById('closed-interval');
    for (const eps of [0.01, 0.1, 0.5, 1]) {
      expect(ballStaysInA(0, eps, c.ambient, c.setA)).toBe(false);
    }
    // but deep inside it stays
    expect(ballStaysInA(0.5, 0.4, c.ambient, c.setA)).toBe(true);
  });

  it('open interval in R: every point of A has some ball staying in A', () => {
    const c = caseById('open-interval');
    for (let i = 0; i < 20; i++) {
      const x = 0.05 * i + 0.025; // stays inside (0, 1)
      expect(unionContains(c.setA, x)).toBe(true);
      const ok = [0.01, 0.05, 0.1].some((eps) => ballStaysInA(x, eps, c.ambient, c.setA));
      expect(ok).toBe(true);
    }
  });

  it('witnessNotOpen points admit no staying ball', () => {
    for (const c of CLOPEN_CASES) {
      if (c.witnessNotOpen === undefined) continue;
      expect(unionContains(c.setA, c.witnessNotOpen)).toBe(true);
      for (const eps of [0.01, 0.05, 0.1, 0.5, 1]) {
        expect(ballStaysInA(c.witnessNotOpen, eps, c.ambient, c.setA)).toBe(false);
      }
    }
  });

  it('witnessNotClosed points are limit points of A in X but outside A', () => {
    for (const c of CLOPEN_CASES) {
      if (c.witnessNotClosed === undefined) continue;
      expect(unionContains(c.setA, c.witnessNotClosed)).toBe(false);
      expect(unionContains(c.ambient, c.witnessNotClosed)).toBe(true);
      expectCloseTo(distanceToUnion(c.setA, c.witnessNotClosed), 0, 1e-15);
    }
  });

  it('clopen cases: every point of A has some small ball staying in A relative to X', () => {
    for (const c of CLOPEN_CASES) {
      if (!c.openInX) continue;
      for (const x of [0.05, 0.25, 0.5, 0.75, 0.95]) {
        if (!unionContains(c.setA, x)) continue;
        const ok = [0.01, 0.05].some((eps) => ballStaysInA(x, eps, c.ambient, c.setA));
        expect(ok).toBe(true);
      }
    }
  });
});

describe('clopen: model compute', () => {
  it('defaults to the init case with init x/eps', () => {
    const data = compute({});
    expect(data.caseId).toBe(CLOPEN_CASE_INIT);
    expect(data.x).toBe(CLOPEN_X_INIT);
    expect(data.eps).toBe(CLOPEN_EPS_INIT);
  });

  it('an unknown case id falls back to the init case', () => {
    expect(compute({ case: 'nope' }).caseId).toBe(CLOPEN_CASE_INIT);
    expect(compute({ case: 42 }).caseId).toBe(CLOPEN_CASE_INIT);
  });

  it('clamps x into the case domain and eps into range; NaN gives init', () => {
    const c = caseById('open-interval');
    expect(compute({ case: 'open-interval', x: 100, eps: 0.2 }).x).toBe(c.domHi);
    expect(compute({ case: 'open-interval', x: -100, eps: 0.2 }).x).toBe(c.domLo);
    expect(compute({ case: 'open-interval', x: NaN, eps: 0.2 }).x).toBe(c.xInit);
    expect(compute({ case: 'open-interval', x: 0.5, eps: 100 }).eps).toBe(CLOPEN_EPS_MAX);
    expect(compute({ case: 'open-interval', x: 0.5, eps: 0 }).eps).toBe(CLOPEN_EPS_MIN);
    expect(compute({ case: 'open-interval', x: 0.5, eps: NaN }).eps).toBe(CLOPEN_EPS_INIT);
  });

  it('exports the expected data keys', () => {
    const data = compute({ case: 'clopen-pieces', x: 1, eps: 0.5 });
    for (const key of [
      'caseId', 'x', 'eps', 'inA', 'ballStaysInA', 'openInX', 'closedInX',
      'clopenInX', 'openInR', 'closedInR', 'ambient', 'setA', 'domLo', 'domHi',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('clopen: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(clopenProblems);
  });

  it('the three ids are clopen-r-trivial, clopen-subspace-pieces, clopen-separation', () => {
    expect(clopenProblems.map((p) => p.id)).toEqual([
      'clopen-r-trivial',
      'clopen-subspace-pieces',
      'clopen-separation',
    ]);
  });

  it('presets use valid case ids, x in range, eps in range', () => {
    const ids = new Set(CLOPEN_CASES.map((c) => c.id));
    for (const p of clopenProblems) {
      expect(ids.has(String(p.preset['case']))).toBe(true);
      const x = Number(p.preset['x']);
      const eps = Number(p.preset['eps']);
      expect(x).toBeGreaterThanOrEqual(CLOPEN_X_MIN);
      expect(x).toBeLessThanOrEqual(CLOPEN_X_MAX);
      expect(eps).toBeGreaterThanOrEqual(CLOPEN_EPS_MIN);
      expect(eps).toBeLessThanOrEqual(CLOPEN_EPS_MAX);
    }
  });
});
