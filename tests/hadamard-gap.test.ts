import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CONTRAST_R,
  DEFAULT_N,
  GRID_POINTS,
  RADII,
  contrastPartialModulus,
  gapExponent,
  gapRatio,
  hadamardGapModel,
  lacunaryPartialModulus,
  lacunaryReal,
  MAX_N,
  MIN_N,
  type HadamardData,
} from '../src/chapters/series/models/hadamardGap';
import { hadamardGapProblems } from '../src/chapters/series/problems/hadamard-gap';

const compute = (state: ControlState): HadamardData => syncCompute(hadamardGapModel, state);

/** Direct complex-power evaluation of |S_N(r e^{i theta})|, no squaring. */
function directLacunary(r: number, theta: number, n: number): number {
  let sr = 0;
  let si = 0;
  for (let k = 0; k <= n; k++) {
    const p = 2 ** k;
    const m = Math.pow(r, p);
    sr += m * Math.cos(p * theta);
    si += m * Math.sin(p * theta);
  }
  return Math.hypot(sr, si);
}

function maxOnGrid(f: (theta: number) => number): number {
  let m = 0;
  for (let i = 0; i < GRID_POINTS; i++) {
    const v = f((2 * Math.PI * i) / GRID_POINTS);
    if (v > m) m = v;
  }
  return m;
}

describe('hadamard-gap: gap exponents', () => {
  it('n_k = 2^k for k = 0..12', () => {
    for (let k = 0; k <= 12; k++) {
      expect(gapExponent(k)).toBe(2 ** k);
    }
  });

  it('gap ratio n_{k+1}/n_k = 2 exactly for k = 0..11', () => {
    for (let k = 0; k <= 11; k++) {
      expect(gapRatio(k)).toBe(2);
    }
  });
});

describe('hadamard-gap: repeated-squaring evaluator', () => {
  it('lacunaryReal(0.5, N) = sum 0.5^{2^k} to 1e-15 for N = 0..12', () => {
    for (let n = 0; n <= 12; n++) {
      let direct = 0;
      for (let k = 0; k <= n; k++) direct += Math.pow(0.5, 2 ** k);
      expectCloseTo(lacunaryReal(0.5, n), direct, 1e-15);
    }
  });

  it('S_5(0.5) = 0.81642150902189314 (documented)', () => {
    expectCloseTo(lacunaryReal(0.5, 5), 0.81642150902189314, 1e-12);
  });

  it('lacunaryPartialModulus matches direct complex powers to 1e-12', () => {
    const spots: Array<[number, number, number]> = [
      [0.99, 0.3, 12],
      [0.95, 2.1, 8],
      [0.9, Math.PI, 5],
      [0.99, 0, 12],
    ];
    for (const [r, theta, n] of spots) {
      expectCloseTo(lacunaryPartialModulus(r, theta, n), directLacunary(r, theta, n), 1e-12);
    }
  });
});

describe('hadamard-gap: spikes grow with N', () => {
  it('max|S_12(0.99 e^{i theta})| = 6.31389984724 on the 720-grid (documented)', () => {
    const data = compute({ N: 12 });
    expectCloseTo(data.maxS, 6.31389984724, 1e-9);
  });

  it('max|S_N| grows monotonically for N = 1..8', () => {
    let prev = 0;
    for (let n = 1; n <= 8; n++) {
      const m = compute({ N: n }).maxS;
      expect(m).toBeGreaterThan(prev);
      prev = m;
    }
  });

  it('spike counts: 3 at N=2, 60 at N=6, 106 at N=12 (documented)', () => {
    expect(compute({ N: 2 }).spikeCount).toBe(3);
    expect(compute({ N: 6 }).spikeCount).toBe(60);
    expect(compute({ N: 12 }).spikeCount).toBe(106);
  });

  it('spike counts multiply as N grows: 1,3,7,14,28,60,88,108 (N=1..8)', () => {
    const expected = [1, 3, 7, 14, 28, 60, 88, 108];
    for (let n = 1; n <= 8; n++) {
      expect(compute({ N: n }).spikeCount).toBe(expected[n - 1]);
    }
  });
});

describe('hadamard-gap: gap-free contrast stays calm', () => {
  it('max|T_200(0.99 e^{i theta})| = 1.604490074 < 1.65 (documented)', () => {
    const m = maxOnGrid((theta) => contrastPartialModulus(CONTRAST_R, theta, 200));
    expectCloseTo(m, 1.604490074, 1e-9);
    expect(m).toBeLessThan(1.65);
  });

  it('contrast stays below pi^2/6 (M-test bound)', () => {
    const m = maxOnGrid((theta) => contrastPartialModulus(CONTRAST_R, theta, 200));
    expect(m).toBeLessThan((Math.PI * Math.PI) / 6);
  });

  it('model maxT matches the grid computation', () => {
    const data = compute({ N: 12 });
    expectCloseTo(data.maxT, 1.555125142, 1e-9);
  });
});

describe('hadamard-gap: model plumbing', () => {
  it('reads N from state, clamps and floors', () => {
    expect(compute({ N: 6 }).n).toBe(6);
    expect(compute({}).n).toBe(DEFAULT_N);
    expect(compute({ N: 100 }).n).toBe(MAX_N);
    expect(compute({ N: 0 }).n).toBe(MIN_N);
    expect(compute({ N: 6.7 }).n).toBe(6);
  });

  it('emits three radius curves on the 720-point grid plus the contrast curve', () => {
    const data = compute({ N: 6 });
    expect(data.curves).toHaveLength(3);
    expect(data.curves.map((c) => c.r)).toEqual([...RADII]);
    for (const curve of data.curves) {
      expect(curve.points).toHaveLength(GRID_POINTS);
    }
    expect(data.contrast).toHaveLength(GRID_POINTS);
    expect(GRID_POINTS).toBe(720);
    expect(MIN_N).toBe(1);
    expect(MAX_N).toBe(12);
    expect(DEFAULT_N).toBe(6);
  });

  it('theta grid covers [0, 2 pi)', () => {
    const data = compute({ N: 6 });
    const first = data.curves[0]?.points[0]?.theta ?? -1;
    const lastTheta = data.curves[0]?.points[GRID_POINTS - 1]?.theta ?? -1;
    expect(first).toBe(0);
    expectCloseTo(lastTheta, (2 * Math.PI * (GRID_POINTS - 1)) / GRID_POINTS, 1e-15);
    expect(lastTheta).toBeLessThan(2 * Math.PI);
  });
});

describe('hadamard-gap: problems export', () => {
  it('exports exactly 3 problems with non-empty ko/en', () => {
    expect(hadamardGapProblems).toHaveLength(3);
    for (const p of hadamardGapProblems) {
      expect(p.id.length).toBeGreaterThan(0);
      expect(p.statement.ko.length).toBeGreaterThan(0);
      expect(p.statement.en.length).toBeGreaterThan(0);
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko.length).toBeGreaterThan(0);
        expect(step.text.en.length).toBeGreaterThan(0);
      }
      expect(p.display === undefined || p.display.length <= 2).toBe(true);
    }
  });

  it('problem ids are as documented', () => {
    expect(hadamardGapProblems.map((p) => p.id)).toEqual([
      'hadamard-gap-radius',
      'gap-free-contrast',
      'gap-theorem-idea',
    ]);
  });
});
