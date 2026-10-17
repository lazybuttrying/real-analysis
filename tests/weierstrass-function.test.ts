import { describe, expect, it } from 'vitest';
import type { ControlState } from '../src/contracts';
import {
  A,
  B,
  clampN,
  lastTermBound,
  N_INIT,
  N_MAX,
  N_MIN,
  N_POINTS,
  tailBound,
  weierstrassData,
  weierstrassModel,
  weierstrassPartial,
  type WeierstrassData,
} from '../src/chapters/calculus/models/weierstrassFunction';
import { problems } from '../src/chapters/calculus/problems/weierstrass-function';

const compute = (state: ControlState): WeierstrassData =>
  weierstrassModel.compute(state) as WeierstrassData;

// Hand-computed closed forms (independent of the model helpers):
//   weierstrassPartial(0, n) = sum_{k=0}^n (1/2)^k = 2 - (1/2)^n
//   weierstrassPartial(1, n) = -(2 - (1/2)^n)   (13^k odd => cos(13^k pi) = -1)
//   tailBound(n) = (1/2)^{n+1} / (1/2) = (1/2)^n
//   lastTermBound(n) = (1/2)^n
const partialAt0 = (n: number): number => 2 - Math.pow(0.5, n);

describe('weierstrass: parameters satisfy the classical nowhere-differentiability condition', () => {
  it('a = 1/2, b = 13, b odd', () => {
    expect(A).toBe(0.5);
    expect(B).toBe(13);
    expect(B % 2).toBe(1);
  });

  it('a*b = 6.5 > 1 + 3*pi/2', () => {
    expect(A * B).toBe(6.5);
    expect(A * B).toBeGreaterThan(1 + (3 * Math.PI) / 2);
    expect(1 + (3 * Math.PI) / 2).toBeCloseTo(5.7123889804, 8);
  });
});

describe('weierstrass: partial sums at hand-computable points', () => {
  it('W_N(0) = sum_{k=0}^N (1/2)^k = 2 - (1/2)^N', () => {
    // Hand-computed values, not via weierstrassPartial.
    const expected: Array<[number, number]> = [
      [0, 1],
      [2, 1.75],
      [4, 1.9375],
      [6, 1.984375],
      [8, 1.99609375],
    ];
    for (const [n, v] of expected) {
      expect(v).toBe(partialAt0(n));
      expect(weierstrassPartial(0, n)).toBe(v);
    }
  });

  it('W_0(1/2) = cos(pi/2) = 0', () => {
    expect(weierstrassPartial(0.5, 0)).toBeCloseTo(0, 15);
  });

  it('W_N(1) = -(2 - (1/2)^N) because 13^k is odd', () => {
    expect(weierstrassPartial(1, 4)).toBeCloseTo(-1.9375, 10);
    expect(weierstrassPartial(1, 8)).toBeCloseTo(-1.99609375, 10);
    for (const n of [0, 2, 6]) {
      expect(weierstrassPartial(1, n)).toBeCloseTo(-partialAt0(n), 10);
    }
  });

  it('the M-test majorants bound every term: |a^k cos| <= (1/2)^k', () => {
    for (const x of [0, 0.123, 0.5, 0.777, 1]) {
      for (let k = 0; k <= 8; k++) {
        const term = Math.pow(0.5, k) * Math.cos(Math.pow(13, k) * Math.PI * x);
        expect(Math.abs(term)).toBeLessThanOrEqual(Math.pow(0.5, k) + 1e-15);
      }
    }
  });
});

describe('weierstrass: tail bound and last-term bound', () => {
  it('tail(n) = (1/2)^{n+1}/(1/2) = (1/2)^n', () => {
    expect(tailBound(6)).toBe(0.015625);
    expect(tailBound(8)).toBe(0.00390625);
    expect(tailBound(2)).toBe(0.25);
    expect(tailBound(0)).toBe(1);
    expect(tailBound(4)).toBe(0.0625);
  });

  it('lastTermBound(n) = (1/2)^n', () => {
    expect(lastTermBound(6)).toBe(0.015625);
    expect(lastTermBound(8)).toBe(0.00390625);
    expect(lastTermBound(0)).toBe(1);
  });

  it('the sampled polyline respects the M-test: |W_N(x)| <= sum_{k=0}^N (1/2)^k', () => {
    for (const n of [0, 4, 8]) {
      const d = weierstrassData(n);
      const cap = partialAt0(n);
      for (let i = 0; i < d.vals.length; i += 97) {
        expect(Math.abs(d.vals[i] ?? 0)).toBeLessThanOrEqual(cap + 1e-12);
      }
    }
  });
});

describe('weierstrass: clampN', () => {
  it('clamps to [0, 8], floors, defaults to init on non-finite', () => {
    expect(clampN(-3)).toBe(N_MIN);
    expect(clampN(99)).toBe(N_MAX);
    expect(clampN(4.7)).toBe(4);
    expect(clampN(NaN)).toBe(N_INIT);
    expect(clampN(undefined)).toBe(N_INIT);
    expect(clampN('6')).toBe(6);
    expect(clampN(0)).toBe(0);
    expect(clampN(8)).toBe(8);
  });
});

describe('weierstrass: model.compute parses state', () => {
  it('defaults to n = 4 on empty state', () => {
    const d = compute({});
    expect(d.n).toBe(N_INIT);
    expect(d.tailBound).toBe(0.0625);
    expect(d.lastTermBound).toBe(0.0625);
  });

  it('reads the real control key n', () => {
    expect(compute({ n: 8 }).n).toBe(8);
    expect(compute({ n: 0 }).n).toBe(0);
  });

  it('grid spans [0, 1] with consistent sampled values', () => {
    const d = compute({ n: 6 });
    expect(d.xs.length).toBe(N_POINTS);
    expect(d.xs[0]).toBe(0);
    expect(d.xs[N_POINTS - 1]).toBe(1);
    for (let i = 0; i < N_POINTS; i += 211) {
      const x = d.xs[i] ?? 0;
      expect(d.vals[i]).toBeCloseTo(weierstrassPartial(x, 6), 14);
    }
    expect(d.tailBound).toBe(0.015625);
    expect(d.lastTermBound).toBe(0.015625);
  });

  it('yMin/yMax bracket the sampled range', () => {
    const d = compute({ n: 4 });
    expect(d.yMin).toBeLessThan(0);
    expect(d.yMax).toBeGreaterThan(0);
    expect(d.yMin).toBeCloseTo(-1.9375, 8);
    expect(d.yMax).toBeCloseTo(1.9375, 8);
  });
});

describe('weierstrass: problems data is complete and captions match the model', () => {
  it('has the three required problems with bilingual text and full proofs', () => {
    expect(problems.length).toBe(3);
    for (const p of problems) {
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.presetCaption.ko.length).toBeGreaterThan(0);
      expect(p.presetCaption.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThanOrEqual(3);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      expect(p.display?.length).toBeGreaterThan(0);
    }
  });

  it('presets use the real control key n with valid values', () => {
    expect(problems[0]?.preset).toEqual({ n: 6 });
    expect(problems[1]?.preset).toEqual({ n: 8 });
    expect(problems[2]?.preset).toEqual({ n: 2 });
    for (const p of problems) {
      const keys = Object.keys(p.preset);
      expect(keys).toEqual(['n']);
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
    }
  });

  it('problem ids are the weierstrass-* ids', () => {
    expect(problems.map((p) => p.id)).toEqual([
      'weierstrass-continuous',
      'weierstrass-nowhere-differentiable',
      'weierstrass-uniform-limit',
    ]);
  });

  it('caption numbers match the model', () => {
    const [p1, p2, p3] = problems;
    expect(p1?.presetCaption.ko).toContain('0.015625');
    expect(p1?.presetCaption.en).toContain('1.984375');
    expect(p2?.presetCaption.ko).toContain('0.00390625');
    expect(p2?.presetCaption.en).toContain('-1.99609375');
    expect(p3?.presetCaption.ko).toContain('0.25');
    expect(p3?.presetCaption.en).toContain('1.75');
    // The model agrees with the caption numbers.
    expect(compute({ n: 6 }).tailBound).toBe(0.015625);
    expect(compute({ n: 8 }).tailBound).toBe(0.00390625);
    expect(compute({ n: 2 }).tailBound).toBe(0.25);
    expect(weierstrassPartial(0, 6)).toBe(1.984375);
    expect(weierstrassPartial(0, 2)).toBe(1.75);
  });

  it('problem 2 is honestly framed as an idea-level sketch, not a complete proof', () => {
    const p2 = problems[1];
    const enTexts = (p2?.proof ?? []).map((s) => s.text.en).join(' ');
    const koTexts = (p2?.proof ?? []).map((s) => s.text.ko).join(' ');
    expect(enTexts).toContain('idea-level sketch');
    expect(enTexts).toContain('do not reproduce');
    expect(koTexts).toContain('아이디어 수준의 개요');
    expect(p2?.statement.en).toContain('idea-level sketch');
  });
});
