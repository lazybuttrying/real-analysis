import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import { limits } from '../src/chapters/limits/meta';
import {
  closureData,
  closureKindOf,
  closureModel,
  RECIPROCAL_TERMS,
  type ClosureData,
} from '../src/chapters/limits/models/closure';
import {
  openSetContains,
  openSetData,
  openSetFacts,
  openSetKindOf,
  openSetMaxSafeEps,
  opensetsModel,
  type OpenSetData,
} from '../src/chapters/limits/models/opensets';

const opensetsCompute = (state: ControlState): OpenSetData => opensetsModel.compute(state) as OpenSetData;
const closureCompute = (state: ControlState): ClosureData => closureModel.compute(state) as ClosureData;

describe('opensets: membership', () => {
  it('open (0,1) excludes its endpoints', () => {
    expect(openSetContains('open', 0.5)).toBe(true);
    expect(openSetContains('open', 0)).toBe(false);
    expect(openSetContains('open', 1)).toBe(false);
    expect(openSetContains('open', -0.1)).toBe(false);
  });

  it('closed [0,1] includes its endpoints', () => {
    expect(openSetContains('closed', 0)).toBe(true);
    expect(openSetContains('closed', 1)).toBe(true);
    expect(openSetContains('closed', 1.1)).toBe(false);
  });

  it('half-open [0,1) includes 0 but not 1', () => {
    expect(openSetContains('half', 0)).toBe(true);
    expect(openSetContains('half', 1)).toBe(false);
  });

  it('singleton {0} contains only 0', () => {
    expect(openSetContains('singleton', 0)).toBe(true);
    expect(openSetContains('singleton', 0.05)).toBe(false);
    expect(openSetContains('singleton', -0.05)).toBe(false);
  });
});

describe('opensets: largest safe radius and ball verdict', () => {
  it('gives min(x, 1-x) inside (0,1)', () => {
    expect(openSetMaxSafeEps('open', 0.5)).toBe(0.5);
    expect(openSetMaxSafeEps('open', 0.25)).toBe(0.25);
    expect(openSetMaxSafeEps('open', 0.9)).toBeCloseTo(0.1, 15);
  });

  it('gives 0 at boundary points of closed and half-open sets', () => {
    expect(openSetMaxSafeEps('closed', 0)).toBe(0);
    expect(openSetMaxSafeEps('closed', 1)).toBe(0);
    expect(openSetMaxSafeEps('half', 0)).toBe(0);
    expect(openSetMaxSafeEps('closed', 0.5)).toBe(0.5);
  });

  it('gives 0 for the singleton and for points outside the set', () => {
    expect(openSetMaxSafeEps('singleton', 0)).toBe(0);
    expect(openSetMaxSafeEps('open', 2)).toBe(0);
  });

  it('verdicts the ball correctly', () => {
    expect(openSetData('open', 0.5, 0.2).ballInside).toBe(true);
    expect(openSetData('open', 0.5, 0.6).ballInside).toBe(false);
    expect(openSetData('closed', 0, 0.2).ballInside).toBe(false);
    expect(openSetData('singleton', 0, 0.05).ballInside).toBe(false);
    expect(openSetData('open', 2, 0.2).ballInside).toBe(false);
  });

  it('knows the open/closed facts of each set', () => {
    expect(openSetFacts('open')).toEqual({ isOpen: true, isClosed: false });
    expect(openSetFacts('closed')).toEqual({ isOpen: false, isClosed: true });
    expect(openSetFacts('half')).toEqual({ isOpen: false, isClosed: false });
    expect(openSetFacts('singleton')).toEqual({ isOpen: false, isClosed: true });
  });

  it('falls back to the open interval for unknown kinds and clamps inputs', () => {
    expect(openSetKindOf('bogus')).toBe('open');
    expect(openSetKindOf('closed')).toBe('closed');
    const d = opensetsCompute({});
    expect(d.kind).toBe('open');
    expect(d.x).toBe(0.5);
    expect(d.eps).toBe(0.2);
    expect(opensetsCompute({ x: 99 }).x).toBe(1.3);
    expect(opensetsCompute({ eps: -1 }).eps).toBe(0.2);
  });
});

describe('opensets: the proof numbers', () => {
  it('(0,1) is open: eps = min(x, 1-x) always fits', () => {
    for (const x of [0.1, 0.25, 0.5, 0.75, 0.9]) {
      const eps = Math.min(x, 1 - x);
      expect(eps).toBeGreaterThan(0);
      expect(x - eps).toBeGreaterThanOrEqual(0);
      expect(x + eps).toBeLessThanOrEqual(1);
      expect(openSetData('open', x, eps).ballInside).toBe(true);
    }
  });

  it('the infinite intersection is {0}: every nonzero x misses some interval', () => {
    for (const x of [0.001, -0.5, 2, 0.1]) {
      const n = Math.floor(1 / Math.abs(x)) + 1;
      expect(Math.abs(x) >= 1 / n).toBe(true);
    }
    for (const n of [1, 10, 1000]) {
      expect(Math.abs(0) < 1 / n).toBe(true);
    }
  });

  it('{0} is not open: no ball fits inside a point', () => {
    for (const eps of [0.05, 0.1, 0.6]) {
      expect(openSetData('singleton', 0, eps).ballInside).toBe(false);
      // the witness from the proof: eps/2 is in the ball but outside {0}
      expect(Math.abs(eps / 2 - 0) < eps).toBe(true);
      expect(openSetContains('singleton', eps / 2)).toBe(false);
    }
  });

  it('[0,1] is not open: the witness -eps/2 escapes at x = 0', () => {
    for (const eps of [0.05, 0.2, 0.6]) {
      expect(openSetData('closed', 0, eps).ballInside).toBe(false);
      expect(Math.abs(-eps / 2 - 0) < eps).toBe(true);
      expect(openSetContains('closed', -eps / 2)).toBe(false);
    }
  });
});

describe('closure: extras, extent, and the bounding interval', () => {
  it('adds the missing endpoints for the interval kinds', () => {
    expect(closureData('open', 1.5).closureExtras).toEqual([0, 1]);
    expect(closureData('halfclosed', 1.5).closureExtras).toEqual([0]);
    expect(closureData('reciprocal', 1.5).closureExtras).toEqual([0]);
  });

  it('reports extent 1 and checks [-m, m]', () => {
    expect(closureData('open', 1.5).extent).toBe(1);
    expect(closureData('open', 1.5).boundedByM).toBe(true);
    expect(closureData('open', 0.5).boundedByM).toBe(false);
    expect(closureData('reciprocal', 1).boundedByM).toBe(true);
  });

  it('knows the closed/bounded facts', () => {
    for (const kind of ['open', 'halfclosed', 'reciprocal'] as const) {
      const d = closureData(kind, 1.5);
      expect(d.isClosed).toBe(false);
      expect(d.isBounded).toBe(true);
    }
  });

  it('draws the first reciprocal terms 1, 1/2, ..., 1/24', () => {
    const d = closureData('reciprocal', 1.5);
    expect(d.terms).toHaveLength(RECIPROCAL_TERMS);
    expect(d.terms[0]).toBe(1);
    expect(d.terms[RECIPROCAL_TERMS - 1]).toBeCloseTo(1 / RECIPROCAL_TERMS, 15);
    expect(closureData('open', 1.5).terms).toHaveLength(0);
  });

  it('falls back to the open interval for unknown kinds and clamps m', () => {
    expect(closureKindOf('bogus')).toBe('open');
    expect(closureKindOf('reciprocal')).toBe('reciprocal');
    expect(closureCompute({}).m).toBe(1.5);
    expect(closureCompute({ m: 99 }).m).toBe(2.5);
    expect(closureCompute({ m: -5 }).m).toBe(0.5);
  });
});

describe('closure: the proof numbers', () => {
  it('0 and 1 are limit points of (0,1): eps/2 and 1 - eps/2 always land inside', () => {
    for (const eps of [0.5, 0.1, 0.01]) {
      expect(Math.abs(eps / 2 - 0) < eps).toBe(true);
      expect(openSetContains('open', eps / 2)).toBe(true);
      expect(Math.abs(1 - eps / 2 - 1) < eps).toBe(true);
      expect(openSetContains('open', 1 - eps / 2)).toBe(true);
    }
  });

  it('nothing outside [0,1] is a limit point of (0,1)', () => {
    for (const x of [-2, -0.5, 1.5, 3]) {
      const r = x < 0 ? -x / 2 : (x - 1) / 2;
      expect(r).toBeGreaterThan(0);
      // the whole ball stays on one side of [0,1]
      expect(x + r <= 0 || x - r >= 1).toBe(true);
    }
  });

  it('{1/n} is bounded by M = 1', () => {
    const d = closureData('reciprocal', 1.5);
    expect(d.terms.every((t) => t > 0 && t <= 1)).toBe(true);
  });

  it('0 is a limit point of {1/n}: every ball holds some term', () => {
    for (const eps of [0.5, 0.1, 0.01]) {
      const n = Math.floor(1 / eps) + 1;
      expect(1 / n < eps).toBe(true);
    }
  });

  it('points outside {1/n} u {0} avoid A: gap witnesses', () => {
    const d = closureData('reciprocal', 1.5);
    // x = -1: radius 1/2 ball holds no term (all terms are positive)
    expect(d.terms.every((t) => Math.abs(t - -1) >= 0.5)).toBe(true);
    // x = 2: radius 1/2 ball holds no term (all terms are <= 1)
    expect(d.terms.every((t) => Math.abs(t - 2) >= 0.5)).toBe(true);
    // x = 0.75 strictly between 1 and 1/2: the nearer gap is 0.25
    expect(d.terms.every((t) => Math.abs(t - 0.75) >= 0.125)).toBe(true);
  });
});

describe('limits chapter meta: the two new scenes', () => {
  it('inserts opensets and closure right after continuity', () => {
    const ids = limits.scenes.map((s) => s.id);
    expect(ids).toEqual([
      'sets',
      'supremum',
      'countable',
      'groups-fields',
      'epsilon-n',
      'epsdelta',
      'continuity',
      'opensets',
      'closure',
      'holes',
      'bolzano-weierstrass',
      'monotone-cauchy',
      'cantor',
      'ivt',
      'evt',
      'uniform',
    ]);
    expect(limits.scenes.map((s) => s.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });

  it('chains the prerequisites', () => {
    const byId = Object.fromEntries(limits.scenes.map((s) => [s.id, s]));
    expect(byId['opensets']?.prerequisites).toEqual(['continuity']);
    expect(byId['closure']?.prerequisites).toEqual(['opensets']);
  });

  it('gives each new scene exactly 3 problems with non-empty proofs', () => {
    for (const id of ['opensets', 'closure']) {
      const scene = limits.scenes.find((s) => s.id === id);
      expect(scene?.problems).toHaveLength(3);
      for (const problem of scene?.problems ?? []) {
        expect(problem.proof.length).toBeGreaterThan(0);
        for (const step of problem.proof) {
          expect(step.text.ko.trim().length).toBeGreaterThan(0);
          expect(step.text.en.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('uses only declared control keys with valid values in every new problem preset', () => {
    for (const id of ['opensets', 'closure']) {
      const scene = limits.scenes.find((s) => s.id === id);
      expect(scene).toBeDefined();
      for (const problem of scene?.problems ?? []) {
        for (const [key, value] of Object.entries(problem.preset)) {
          const spec = scene?.controls.find((c) => c.key === key);
          expect(spec, `${id}/${problem.id}: control '${key}' must be declared`).toBeDefined();
          if (spec?.kind === 'slider') {
            expect(typeof value).toBe('number');
            expect(value as number).toBeGreaterThanOrEqual(spec.min);
            expect(value as number).toBeLessThanOrEqual(spec.max);
            const steps = ((value as number) - spec.min) / spec.step;
            expect(Math.abs(steps - Math.round(steps))).toBeLessThan(1e-9);
          } else if (spec?.kind === 'toggle') {
            expect(typeof value).toBe('boolean');
          } else if (spec?.kind === 'select') {
            expect(spec.options).toContain(value);
          }
        }
      }
    }
  });
});
