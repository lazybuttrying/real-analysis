import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  analyticF,
  analyticFp,
  bumpF,
  bumpFx,
  bumpPhi,
  DIN_INIT,
  DIN_MAX,
  DIN_MIN,
  differentiationUnderIntegralData,
  differentiationUnderIntegralModel,
  DIX_INIT,
  DIX_MAX,
  DIX_MIN,
  simpson,
  type DifferentiationUnderIntegralData,
} from '../src/chapters/calculus/models/differentiationUnderIntegral';
import { differentiationUnderIntegralProblems } from '../src/chapters/calculus/problems/differentiation-under-integral';

/** Control keys declared in integration/meta.ts for this scene. */
const CONTROL_KEYS = ['x', 'n'];

const compute = (state: ControlState): DifferentiationUnderIntegralData =>
  syncCompute(differentiationUnderIntegralModel, state);

describe('differentiation-under-integral: F(x) = integral_0^1 t^x dt', () => {
  it('analytic values: F(1) = 1/2, F\'(1) = -1/4, F(2) = 1/3, F\'(2) = -1/9', () => {
    expect(analyticF(1)).toBe(0.5);
    expect(analyticFp(1)).toBe(-0.25);
    expectCloseTo(analyticF(2), 1 / 3, 1e-15);
    expectCloseTo(analyticFp(2), -1 / 9, 1e-15);
  });

  it('quadrature of t^x hits 1/(x+1): n = 200 at x = 1 is exact, x = 2 within 1e-12', () => {
    const d1 = compute({ x: 1, n: 200 });
    expectCloseTo(d1.numF, 0.5, 1e-12);
    expect(d1.errF).toBeLessThan(1e-12);
    const d2 = compute({ x: 2, n: 200 });
    expectCloseTo(d2.numF, 1 / 3, 1e-12);
  });

  it('under-integral derivative: Simpson of t^x ln t -> -1/(x+1)^2', () => {
    // x = 1, n = 200: within 2e-6 of -1/4 (the log singularity slows Simpson).
    const d1 = compute({ x: 1, n: 200 });
    expectCloseTo(d1.numG, -0.25, 2e-6);
    expect(d1.errG).toBeLessThan(2e-6);
    // x = 2, n = 200: within 1e-8 of -1/9.
    const d2 = compute({ x: 2, n: 200 });
    expectCloseTo(d2.numG, -1 / 9, 1e-8);
    // Finer mesh tightens it: x = 1, n = 2000 within 2e-7.
    const d3 = compute({ x: 1, n: 2000 });
    expect(d3.errG).toBeLessThan(2e-7);
  });

  it('numerical derivative of the quadrature agrees with the analytic F\'', () => {
    const d1 = compute({ x: 1, n: 200 });
    expectCloseTo(d1.numFp, -0.25, 2e-6);
    const d2 = compute({ x: 2, n: 200 });
    expectCloseTo(d2.numFp, -1 / 9, 1e-8);
  });

  it('errors shrink as n grows: the interchange holds numerically', () => {
    const coarse = compute({ x: 1.5, n: 50 });
    const fine = compute({ x: 1.5, n: 2000 });
    expect(fine.errF).toBeLessThan(coarse.errF);
    expect(fine.errG).toBeLessThan(coarse.errG);
    expect(fine.errFp).toBeLessThan(coarse.errFp);
  });

  it('clamps out-of-range controls: x into [0.2, 4], n into [8, 2000] and even', () => {
    const d = compute({ x: 100, n: 7 });
    expect(d.x).toBe(DIX_MAX);
    expect(d.n).toBe(DIN_MIN);
    expect(d.n % 2).toBe(0);
    const e = compute({ x: -3, n: 201 });
    expect(e.x).toBe(DIX_MIN);
    expect(e.n).toBe(202);
    const f = compute({ x: NaN, n: NaN });
    expect(f.x).toBe(DIX_INIT);
    expect(f.n).toBe(DIN_INIT);
    expect(DIN_MAX % 2).toBe(0);
  });

  it('curve samples F over the visible domain and the tangent passes through (x, F(x))', () => {
    const d = compute({ x: 1, n: 200 });
    expect(d.curve.length).toBeGreaterThan(100);
    for (const p of d.curve) expectCloseTo(p.y, analyticF(p.x), 1e-12);
    // Tangent: y = F(x) + F'(x)(X - x) at both segment ends.
    const { x1, y1, x2, y2 } = d.tangent;
    expectCloseTo(y1, d.analyticF + d.analyticFp * (x1 - d.x), 1e-12);
    expectCloseTo(y2, d.analyticF + d.analyticFp * (x2 - d.x), 1e-12);
  });

  it('differentiationUnderIntegralData matches the model compute', () => {
    const viaModel = compute({ x: 2.5, n: 120 });
    const direct = differentiationUnderIntegralData(2.5, 120);
    expect(direct).toEqual(viaModel);
  });
});

describe('bump counterexample (problem 3): f(x,t) = 30(t/x)^2(1-t/x)^2', () => {
  it('bumpPhi integrates to exactly 1 over [0,1]', () => {
    expectCloseTo(simpson(bumpPhi, 0, 1, 2000), 1, 1e-9);
  });

  it('integral_0^1 f(x,t) dt = x for 0 < x < 1', () => {
    for (const x of [0.25, 0.5]) {
      expectCloseTo(simpson((t: number) => bumpF(x, t), 0, 1, 4000), x, 1e-6);
    }
    expect(simpson((t: number) => bumpF(0, t), 0, 1, 100)).toBe(0);
  });

  it('right difference quotient of F at 0 is 1', () => {
    for (const h of [0.5, 0.25]) {
      const fh = simpson((t: number) => bumpF(h, t), 0, 1, 4000);
      expectCloseTo(fh / h, 1, 1e-6);
    }
  });

  it('f_x(0, t) = 0 for every t in [0,1], so its integral is 0 != 1', () => {
    for (const t of [0, 0.3, 0.7, 1]) {
      expect(bumpFx(0, t)).toBe(0);
    }
  });

  it('f is discontinuous at (0,0): f(x, x/2) = 15/8', () => {
    for (const x of [0.5, 0.1, 0.01]) {
      expectCloseTo(bumpF(x, x / 2), 15 / 8, 1e-12);
    }
  });

  it('f_x is unbounded near (0,0): f_x(x, x/4) = -45/(32x)', () => {
    for (const x of [0.5, 0.1, 0.01]) {
      expectCloseTo(bumpFx(x, x / 4), -45 / (32 * x), 1e-9 * Math.abs(-45 / (32 * x)));
    }
  });
});

describe('differentiation-under-integral problems', () => {
  it('has exactly 3 problems with unique ids', () => {
    expect(differentiationUnderIntegralProblems).toHaveLength(3);
    const ids = differentiationUnderIntegralProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('every preset key is a declared control key with in-range values', () => {
    for (const problem of differentiationUnderIntegralProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS, `${problem.id} preset key ${key}`).toContain(key);
      }
      const x = Number(problem.preset['x']);
      const n = Number(problem.preset['n']);
      expect(x, `${problem.id} preset x`).toBeGreaterThanOrEqual(DIX_MIN);
      expect(x, `${problem.id} preset x`).toBeLessThanOrEqual(DIX_MAX);
      expect(n, `${problem.id} preset n`).toBeGreaterThanOrEqual(DIN_MIN);
      expect(n, `${problem.id} preset n`).toBeLessThanOrEqual(DIN_MAX);
    }
  });

  it('presets reproduce the numbers cited in the proofs', () => {
    const p1 = differentiationUnderIntegralProblems[0];
    const p2 = differentiationUnderIntegralProblems[1];
    if (!p1 || !p2) throw new Error('expected 3 problems');
    // Problem 1: x = 1, n = 200 -> numF = 0.5, numG within 2e-6 of -1/4.
    const d1 = compute(p1.preset);
    expectCloseTo(d1.numF, 0.5, 1e-12);
    expect(d1.errG).toBeLessThan(2e-6);
    // Problem 2: x = 2, n = 200 -> errG within 1e-8 of -1/9.
    const d2 = compute(p2.preset);
    expect(d2.errG).toBeLessThan(1e-8);
  });
});
