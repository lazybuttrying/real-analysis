import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  bump,
  bumpPrime,
  DEFAULT_STAGE,
  MAX_STAGE,
  MIN_STAGE,
  svcIntervals,
  volterraModel,
  type VolterraData,
} from '../src/chapters/calculus/models/volterraFunction';
import { volterraFunctionProblems } from '../src/chapters/calculus/problems/volterra-function';

const compute = (state: ControlState): VolterraData => syncCompute(volterraModel, state);

describe('volterra-function: construction of the Smith-Volterra-Cantor complement', () => {
  it('stage 1 removes exactly the middle open interval (3/8, 5/8) of length 1/4', () => {
    const ivs = svcIntervals(1);
    expect(ivs).toHaveLength(1);
    expectCloseTo(ivs[0]?.a ?? NaN, 3 / 8, 1e-15);
    expectCloseTo(ivs[0]?.b ?? NaN, 5 / 8, 1e-15);
    expect(ivs[0]?.stage).toBe(1);
  });

  it('stage 2 adds 2 intervals for 3 total; N stages give 2^N - 1 intervals', () => {
    expect(svcIntervals(2)).toHaveLength(3);
    for (let n = 1; n <= 7; n++) {
      expect(svcIntervals(n)).toHaveLength(Math.pow(2, n) - 1);
    }
  });

  it('intervals are ordered by (stage, left endpoint): the first is the stage-1 interval', () => {
    const ivs = svcIntervals(4);
    expect(ivs[0]?.stage).toBe(1);
    expectCloseTo(ivs[0]?.a ?? NaN, 0.375, 1e-15);
    for (let n = 1; n <= 4; n++) {
      const atStage = ivs.filter((iv) => iv.stage === n);
      expect(atStage).toHaveLength(Math.pow(2, n - 1));
      for (let k = 1; k < atStage.length; k++) {
        expect((atStage[k]?.a ?? 0) > (atStage[k - 1]?.a ?? 0)).toBe(true);
      }
    }
  });

  it('intervals are disjoint, inside [0, 1], and each stage-n interval has length 4^{-n}', () => {
    for (let n = 1; n <= 5; n++) {
      const ivs = svcIntervals(n).slice().sort((p, q) => p.a - q.a);
      for (let k = 0; k < ivs.length; k++) {
        const iv = ivs[k];
        expect(iv!.a).toBeGreaterThanOrEqual(0);
        expect(iv!.b).toBeLessThanOrEqual(1);
        expectCloseTo(iv!.b - iv!.a, Math.pow(4, -iv!.stage), 1e-15);
        if (k > 0) expect(iv!.a).toBeGreaterThanOrEqual(ivs[k - 1]!.b);
      }
    }
  });

  it('removed length after N stages is (1 - 2^{-N})/2 (tol 1e-12)', () => {
    for (let n = 1; n <= 7; n++) {
      const data = compute({ stage: n, interval: 0 });
      let removed = 0;
      for (const iv of data.intervals) removed += iv.b - iv.a;
      expectCloseTo(removed, (1 - Math.pow(2, -n)) / 2, 1e-12);
      expectCloseTo(data.removedLength, (1 - Math.pow(2, -n)) / 2, 1e-12);
      expectCloseTo(data.remainingLength, 1 - (1 - Math.pow(2, -n)) / 2, 1e-12);
    }
  });
});

describe('volterra-function: the bump and its derivative', () => {
  const a = 0.375;
  const b = 0.625;

  it('bump vanishes at and outside the endpoints', () => {
    expect(bump(a, a, b)).toBe(0);
    expect(bump(b, a, b)).toBe(0);
    expect(bump(a - 0.1, a, b)).toBe(0);
    expect(bump(b + 0.1, a, b)).toBe(0);
    expect(bumpPrime(a, a, b)).toBe(0);
    expect(bumpPrime(b, a, b)).toBe(0);
  });

  it('bumpPrime matches central finite differences at interior points (tol 1e-6)', () => {
    const h = 1e-7;
    for (const x of [0.4, 0.45, 0.5, 0.55, 0.6]) {
      const fd = (bump(x + h, a, b) - bump(x - h, a, b)) / (2 * h);
      expectCloseTo(bumpPrime(x, a, b), fd, 1e-6);
    }
  });

  it('the M-test bounds hold: |bump| <= 1/16 and |bumpPrime| <= 3/2', () => {
    for (let n = 1; n <= 4; n++) {
      for (const iv of svcIntervals(n)) {
        for (let j = 0; j <= 40; j++) {
          const x = iv.a + ((iv.b - iv.a) * j) / 40;
          expect(Math.abs(bump(x, iv.a, iv.b))).toBeLessThanOrEqual(1 / 16 + 1e-15);
          expect(Math.abs(bumpPrime(x, iv.a, iv.b))).toBeLessThanOrEqual(3 / 2 + 1e-12);
        }
      }
    }
  });

  it("the oscillation does not die near a: bumpPrime(a + 1/(2 pi m)) -> -(b-a)^2", () => {
    // sin(1/(x-a)) = 0 and cos(1/(x-a)) = 1 there, so the oscillatory term
    // shows its full amplitude while the smooth term vanishes.
    const m = 2000;
    const x = a + 1 / (2 * Math.PI * m);
    expectCloseTo(bumpPrime(x, a, b), -Math.pow(b - a, 2), 1e-3);
  });
});

describe('volterra-function: the model data', () => {
  it('f and f-prime vanish at 0 (a point of the Cantor set)', () => {
    const data = compute({ stage: 4, interval: 0 });
    const at0 = data.samples[0];
    expect(at0?.x).toBe(0);
    expect(at0?.f).toBe(0);
    expect(at0?.fp).toBe(0);
  });

  it('supFp is finite, positive, and inside the proved bound 3/2', () => {
    const data = compute({ stage: 4, interval: 0 });
    expect(Number.isFinite(data.supFp)).toBe(true);
    expect(data.supFp).toBeGreaterThan(0.01);
    expect(data.supFp).toBeLessThan(1.5);
    expectCloseTo(data.supFp, 0.03067569024678171, 1e-12);
  });

  it("f' oscillates on the first interval: max - min >= 0.5 (b-a)^2", () => {
    // The first interval is (3/8, 5/8) with weight 2^{-1}; dense sampling
    // near a resolves the cos(1/(x-a)) phases down to ~0.13 rad.
    const ivs = svcIntervals(4);
    const iv = ivs[0]!;
    const N = 200000;
    const hi = iv.a + 0.0025;
    let mn = Infinity;
    let mx = -Infinity;
    for (let j = 1; j <= N; j++) {
      const x = iv.a + ((hi - iv.a) * j) / N;
      const v = 0.5 * bumpPrime(x, iv.a, iv.b);
      if (v < mn) mn = v;
      if (v > mx) mx = v;
    }
    expect(mx - mn).toBeGreaterThanOrEqual(0.5 * Math.pow(iv.b - iv.a, 2));
  });

  it('zoomSamples cover exactly the selected interval with the right weight', () => {
    const data = compute({ stage: 4, interval: 0 });
    expect(data.zoomSamples.length).toBeGreaterThan(0);
    const iv = data.intervals[0]!;
    for (const s of data.zoomSamples) {
      expect(s.x).toBeGreaterThanOrEqual(iv.a);
      expect(s.x).toBeLessThanOrEqual(iv.b);
      // Weight 2^{-(0+1)} = 1/2 on the first interval.
      expectCloseTo(s.f, 0.5 * bump(s.x, iv.a, iv.b), 1e-15);
      expectCloseTo(s.fp, 0.5 * bumpPrime(s.x, iv.a, iv.b), 1e-15);
    }
  });

  it('samples are sorted by x and cover [0, 1] with at least 1500 points', () => {
    const data = compute({ stage: 4, interval: 0 });
    expect(data.samples.length).toBeGreaterThanOrEqual(1500);
    expect(data.samples[0]?.x).toBe(0);
    expect(data.samples[data.samples.length - 1]?.x).toBe(1);
    for (let k = 1; k < data.samples.length; k++) {
      expect(data.samples[k]!.x).toBeGreaterThanOrEqual(data.samples[k - 1]!.x);
    }
  });
});

describe('volterra-function: control clamping', () => {
  it('defaults and clamps match the documented control ranges', () => {
    expect(MIN_STAGE).toBe(1);
    expect(MAX_STAGE).toBe(7);
    expect(DEFAULT_STAGE).toBe(4);
  });

  it('missing controls fall back to stage 4, interval 0', () => {
    const data = compute({});
    expect(data.stage).toBe(4);
    expect(data.interval).toBe(0);
  });

  it('stage clamps to [1, 7] and interval clamps to the available range', () => {
    expect(compute({ stage: 0, interval: 0 }).stage).toBe(1);
    expect(compute({ stage: 99, interval: 0 }).stage).toBe(7);
    expect(compute({ stage: 4, interval: -5 }).interval).toBe(0);
    expect(compute({ stage: 4, interval: 999 }).interval).toBe(14);
    expect(compute({ stage: 1, interval: 5 }).interval).toBe(0);
  });
});

describe('volterra-function: problems data', () => {
  it('has exactly 3 problems with the required shape', () => {
    expect(volterraFunctionProblems).toHaveLength(3);
    const ids = volterraFunctionProblems.map((p) => p.id);
    expect(ids).toEqual(['bump-lemma', 'differentiable-bounded', 'discontinuous-derivative']);
    for (const p of volterraFunctionProblems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('every preset is valid for the scene controls and matches the quoted numbers', () => {
    for (const p of volterraFunctionProblems) {
      const data = compute(p.preset);
      expect(data.stage).toBe(4);
      expect(data.interval).toBe(0);
      expect(data.intervals).toHaveLength(15);
      expectCloseTo(data.removedLength, 15 / 32, 1e-12);
      expectCloseTo(data.remainingLength, 17 / 32, 1e-12);
      expectCloseTo(data.supFp, 0.03067569024678171, 1e-9);
      const iv = data.intervals[0]!;
      expectCloseTo(iv.a, 0.375, 1e-15);
      expectCloseTo(iv.b, 0.625, 1e-15);
    }
  });

  it('proofs keep Korean inside ko strings only, and use \\(...\\) math', () => {
    const hangul = (s: string): boolean => /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(s);
    for (const p of volterraFunctionProblems) {
      expect(hangul(p.statement.en)).toBe(false);
      expect(hangul(p.presetCaption.en)).toBe(false);
      for (const step of p.proof) {
        expect(hangul(step.text.en)).toBe(false);
        for (const d of step.display ?? []) {
          expect(hangul(d)).toBe(false);
          expect(d).not.toContain('$');
        }
      }
      for (const d of p.display ?? []) expect(d).not.toContain('$');
    }
  });
});
