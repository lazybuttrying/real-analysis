import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  connectedModel,
  CONNECTED_CASE_INIT,
  CONNECTED_CASES,
  CONNECTED_T_INIT,
  CONNECTED_T_MAX,
  CONNECTED_T_MIN,
  intervalContains,
  intervalIntersect,
  intervalIsEmpty,
  intervalSubtract,
  piecesOverlap,
  RATIONAL_CUT,
  uncoveredPieces,
  unionContains,
  type ConnectedData,
  type Interval,
} from '../src/chapters/limits/models/connected';
import { connectedProblems } from '../src/chapters/limits/problems/connected';

const compute = (state: ControlState): ConnectedData => syncCompute(connectedModel, state);

describe('connected: interval arithmetic', () => {
  it('intervalContains respects open/closed endpoints', () => {
    const open: Interval = { lo: 0, hi: 1, loOpen: true, hiOpen: true };
    const closed: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    expect(intervalContains(open, 0)).toBe(false);
    expect(intervalContains(open, 0.5)).toBe(true);
    expect(intervalContains(closed, 0)).toBe(true);
    expect(intervalContains(closed, 1)).toBe(true);
  });

  it('the abutting open intervals U, V around a cut are disjoint but miss the cut', () => {
    const u: Interval = { lo: -0.2, hi: 0.5, loOpen: true, hiOpen: true };
    const v: Interval = { lo: 0.5, hi: 1.2, loOpen: true, hiOpen: true };
    expect(intervalIsEmpty(intervalIntersect(u, v))).toBe(true);
    expect(intervalContains(u, 0.5)).toBe(false);
    expect(intervalContains(v, 0.5)).toBe(false);
  });

  it('intervalSubtract leaves exactly the cut point of [0, 1] behind', () => {
    const x: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    const rest = uncoveredPieces(
      [x],
      { lo: -0.2, hi: 0.5, loOpen: true, hiOpen: true },
      { lo: 0.5, hi: 1.2, loOpen: true, hiOpen: true },
    );
    expect(rest).toHaveLength(1);
    expect(rest[0]!.lo).toBe(0.5);
    expect(rest[0]!.hi).toBe(0.5);
    // [0,2] \ [0,1] = (1,2]
    const wide: Interval = { lo: 0, hi: 2, loOpen: false, hiOpen: false };
    const unit: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    const r = intervalSubtract(wide, unit);
    expect(r).toHaveLength(1);
    expect(r[0]!.lo).toBe(1);
    expect(r[0]!.loOpen).toBe(true);
  });

  it('piecesOverlap detects a shared point and misses a mere abutment', () => {
    const a: Interval = { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    const b: Interval = { lo: 1, hi: 2, loOpen: true, hiOpen: false };
    const c: Interval = { lo: 0.5, hi: 2, loOpen: true, hiOpen: false };
    expect(piecesOverlap([a], [b])).toBe(false);
    expect(piecesOverlap([a], [c])).toBe(true);
  });
});

describe('connected: the interval case never separates', () => {
  it('a cut inside [0, 1] leaves the cut point uncovered (the Problem 1 preset)', () => {
    const data = compute({ case: 'interval', t: 0.5 });
    expect(data.uMeetsX).toBe(true);
    expect(data.vMeetsX).toBe(true);
    expect(data.disjointOnX).toBe(true);
    expect(data.covered).toBe(false);
    expect(data.uncovered).toBe(0.5);
    expect(data.failure).toBe('not-covered');
    expect(data.separated).toBe(false);
  });

  it('no sampled cut separates [0, 1]', () => {
    for (let i = 0; i <= 68; i++) {
      const t = CONNECTED_T_MIN + i * 0.05;
      const data = compute({ case: 'interval', t });
      expect(data.separated).toBe(false);
    }
  });

  it('a cut left of 0 covers but leaves U empty; a cut right of 1 leaves V empty', () => {
    const left = compute({ case: 'interval', t: -0.1 });
    expect(left.covered).toBe(true);
    expect(left.uMeetsX).toBe(false);
    expect(left.failure).toBe('u-empty');
    const right = compute({ case: 'interval', t: 1.1 });
    expect(right.covered).toBe(true);
    expect(right.vMeetsX).toBe(false);
    expect(right.failure).toBe('v-empty');
  });

  it('the endpoint cuts t = 0 and t = 1 fail as well', () => {
    expect(compute({ case: 'interval', t: 0 }).separated).toBe(false);
    expect(compute({ case: 'interval', t: 1 }).separated).toBe(false);
  });
});

describe('connected: the two-pieces case separates exactly in the gap', () => {
  it('t = 1.5 separates: U meets X in [0, 1], V in [2, 3] (the Problem 2 preset)', () => {
    const data = compute({ case: 'two-pieces', t: 1.5 });
    expect(data.separated).toBe(true);
    expect(data.failure).toBe('none');
    expect(data.covered).toBe(true);
    expect(data.disjointOnX).toBe(true);
    expect(data.uOnX).toHaveLength(1);
    expect(data.uOnX[0]!.lo).toBe(0);
    expect(data.uOnX[0]!.hi).toBe(1);
    expect(data.vOnX).toHaveLength(1);
    expect(data.vOnX[0]!.lo).toBe(2);
    expect(data.vOnX[0]!.hi).toBe(3);
  });

  it('t = 0.5 does not separate: the cut point 0.5 is uncovered', () => {
    const data = compute({ case: 'two-pieces', t: 0.5 });
    expect(data.separated).toBe(false);
    expect(data.covered).toBe(false);
    expect(data.uncovered).toBe(0.5);
    expect(data.failure).toBe('not-covered');
  });

  it('every cut strictly between the pieces separates, and no other sampled cut does', () => {
    for (let i = 0; i <= 68; i++) {
      const t = CONNECTED_T_MIN + i * 0.05;
      const data = compute({ case: 'two-pieces', t });
      // Sampled cuts are multiples of 0.05 offset from -0.2, so t = 1 and
      // t = 2 (multiples of 0.05 in range) are included and must fail:
      // the endpoint point itself belongs to neither open side.
      expect(data.separated).toBe(t > 1 && t < 2);
    }
  });

  it('the endpoint cuts t = 1 and t = 2 leave the endpoint uncovered', () => {
    const at1 = compute({ case: 'two-pieces', t: 1 });
    expect(at1.covered).toBe(false);
    expect(at1.uncovered).toBe(1);
    const at2 = compute({ case: 'two-pieces', t: 2 });
    expect(at2.covered).toBe(false);
    expect(at2.uncovered).toBe(2);
  });
});

describe('connected: the rationals case separates at the irrational cut', () => {
  it('the cut is sqrt(2) / 2, with c^2 = 1/2 (the Problem 3 alpha for p = 0, q = 1)', () => {
    expectCloseTo(RATIONAL_CUT, Math.sqrt(2) / 2, 1e-15);
    expectCloseTo(RATIONAL_CUT * RATIONAL_CUT, 0.5, 1e-15);
    expect(RATIONAL_CUT).toBeGreaterThan(0);
    expect(RATIONAL_CUT).toBeLessThan(1);
    // c is not a ratio of small integers: no p/q with q <= 1000 equals it.
    for (let q = 1; q <= 1000; q++) {
      expect(Number.isInteger(RATIONAL_CUT * q)).toBe(false);
    }
  });

  it('the alpha of Problem 3, p + (q - p) / sqrt(2), is strictly between p and q', () => {
    for (const [p, q] of [[0, 1], [1, 2], [-3, 5], [1, 1.5]] as const) {
      const alpha = p + (q - p) / Math.sqrt(2);
      expect(alpha).toBeGreaterThan(p);
      expect(alpha).toBeLessThan(q);
      // If alpha were rational, sqrt(2) = (q - p) / (alpha - p) would be too;
      // numerically the ratio is exactly sqrt(2), which is irrational.
      expectCloseTo((q - p) / (alpha - p), Math.sqrt(2), 1e-12);
    }
    expectCloseTo(0 + (1 - 0) / Math.sqrt(2), RATIONAL_CUT, 1e-15);
  });

  it('the rationals data is a separation, independent of the t slider', () => {
    for (const t of [-0.2, 0, 0.707, 1.5, 3.2]) {
      const data = compute({ case: 'rationals', t });
      expect(data.cut).toBe(RATIONAL_CUT);
      expect(data.covered).toBe(true);
      expect(data.disjointOnX).toBe(true);
      expect(data.uMeetsX).toBe(true);
      expect(data.vMeetsX).toBe(true);
      expect(data.separated).toBe(true);
      expect(data.failure).toBe('none');
      expect(data.uncovered).toBeNull();
    }
  });

  it('both sides meet X: 0 lies on the U side and 1 on the V side of the cut', () => {
    const data = compute({ case: 'rationals', t: 0.707 });
    expect(unionContains(data.uOnX, 0)).toBe(true);
    expect(unionContains(data.vOnX, 1)).toBe(true);
    expect(unionContains(data.uOnX, RATIONAL_CUT)).toBe(false);
    expect(unionContains(data.vOnX, RATIONAL_CUT)).toBe(false);
  });

  it('a rational cut would fail: at t = 1/2 the interval case leaves 1/2 uncovered', () => {
    const data = compute({ case: 'interval', t: 1 / 2 });
    expect(data.uncovered).toBe(0.5);
    expect(data.separated).toBe(false);
  });
});

describe('connected: model compute', () => {
  it('defaults to the init case with init t', () => {
    const data = compute({});
    expect(data.caseId).toBe(CONNECTED_CASE_INIT);
    expect(data.t).toBe(CONNECTED_T_INIT);
  });

  it('an unknown case id falls back to the interval case', () => {
    expect(compute({ case: 'nope' }).caseId).toBe('interval');
    expect(compute({ case: 42 }).caseId).toBe('interval');
  });

  it('clamps t into range; NaN gives init', () => {
    expect(compute({ case: 'interval', t: 100 }).t).toBe(CONNECTED_T_MAX);
    expect(compute({ case: 'interval', t: -100 }).t).toBe(CONNECTED_T_MIN);
    expect(compute({ case: 'interval', t: NaN }).t).toBe(CONNECTED_T_INIT);
  });

  it('separated is always the conjunction of the four conditions', () => {
    for (const caseId of CONNECTED_CASES) {
      for (const t of [-0.2, 0, 0.5, 1, 1.5, 2, 2.5, 3.2]) {
        const data = compute({ case: caseId, t });
        expect(data.separated).toBe(
          data.covered && data.disjointOnX && data.uMeetsX && data.vMeetsX,
        );
        expect(data.failure === 'none').toBe(data.separated);
      }
    }
  });

  it('exports the expected data keys', () => {
    const data = compute({ case: 'two-pieces', t: 1.5 });
    for (const key of [
      'caseId', 't', 'cut', 'xPieces', 'uInterval', 'vInterval', 'uOnX', 'vOnX',
      'covered', 'disjointOnX', 'uMeetsX', 'vMeetsX', 'separated', 'failure',
      'uncovered', 'domLo', 'domHi',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('connected: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(connectedProblems);
  });

  it('the three ids are interval-connected, path-connected-implies-connected, rationals-totally-disconnected', () => {
    expect(connectedProblems.map((p) => p.id)).toEqual([
      'interval-connected',
      'path-connected-implies-connected',
      'rationals-totally-disconnected',
    ]);
  });

  it('presets use valid case ids and t in range', () => {
    const ids = new Set<string>(CONNECTED_CASES);
    for (const p of connectedProblems) {
      expect(ids.has(String(p.preset['case']))).toBe(true);
      const t = Number(p.preset['t']);
      expect(t).toBeGreaterThanOrEqual(CONNECTED_T_MIN);
      expect(t).toBeLessThanOrEqual(CONNECTED_T_MAX);
    }
  });

  it('preset claims match the model: interval preset fails, two-pieces and rationals presets separate', () => {
    const byId = (id: string) => connectedProblems.find((p) => p.id === id)!;
    const interval = compute(byId('interval-connected').preset);
    expect(interval.caseId).toBe('interval');
    expect(interval.separated).toBe(false);
    expect(interval.uncovered).toBe(0.5);
    const path = compute(byId('path-connected-implies-connected').preset);
    expect(path.caseId).toBe('two-pieces');
    expect(path.separated).toBe(true);
    const rationals = compute(byId('rationals-totally-disconnected').preset);
    expect(rationals.caseId).toBe('rationals');
    expect(rationals.separated).toBe(true);
    expectCloseTo(rationals.cut, 0.7071, 5e-5);
  });
});
