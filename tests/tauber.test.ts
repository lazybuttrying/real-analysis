import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  ABEL_TERMS,
  abelD,
  abelGrandi,
  DEFAULT_R,
  dTerm,
  grandiPartial,
  grandiTermCheck,
  MAX_R,
  MIN_R,
  N_PROBES,
  nTimesDN,
  partialSumD,
  sumD,
  tauberData,
  tauberModel,
  type TauberData,
} from '../src/chapters/series/models/tauber';
import { tauberProblems } from '../src/chapters/series/problems/tauber';

const compute = (state: ControlState): TauberData => syncCompute(tauberModel, state);

describe('tauber: Grandi closed form', () => {
  it('A_G(0.9) = 1/1.9 = 0.5263157894736842, to 1e-12', () => {
    expectCloseTo(abelGrandi(0.9), 1 / 1.9, 1e-12);
    expectCloseTo(abelGrandi(0.9), 0.5263157894736842, 1e-12);
  });

  it('A_G(0.999) = 1/1.999 = 0.5002501250625312, to 1e-9', () => {
    expectCloseTo(abelGrandi(0.999), 1 / 1.999, 1e-9);
    expectCloseTo(abelGrandi(0.999), 0.5002501250625312, 1e-9);
  });

  it('the Abel curve on the grid matches the closed form pointwise', () => {
    const data = tauberData(DEFAULT_R);
    for (const s of data.grandiCurve) {
      expectCloseTo(s.y, 1 / (1 + s.r), 1e-15);
    }
  });
});

describe('tauber: Grandi fails the hypothesis and the conclusion', () => {
  it('partial sums alternate exactly 1, 0', () => {
    for (let n = 0; n < 20; n++) {
      expect(grandiPartial(n)).toBe(n % 2 === 0 ? 1 : 0);
    }
  });

  it('|n a_n| = n for Grandi: the o(1/n) check fails', () => {
    for (const n of N_PROBES) {
      expect(grandiTermCheck(n)).toBe(n);
    }
    const data = tauberData(DEFAULT_R);
    expect(data.grandiProbes.map((p) => p.value)).toEqual([100, 1000, 10000]);
  });
});

describe('tauber: series D satisfies the hypothesis', () => {
  it('|n d_n| = 0.21407671998787478, 0.1445783891669132, 0.1085604070758102', () => {
    const expected = [0.21407671998787478, 0.1445783891669132, 0.1085604070758102];
    N_PROBES.forEach((n, i) => {
      expectCloseTo(nTimesDN(n), expected[i] as number, 1e-12);
      expectCloseTo(Math.abs(n * dTerm(n)), expected[i] as number, 1e-12);
    });
  });

  it('|n d_n| is strictly decreasing and below 0.5 / 0.15 / 0.11', () => {
    const values = N_PROBES.map(nTimesDN);
    const bounds = [0.5, 0.15, 0.11];
    values.forEach((v, i) => {
      expect(v).toBeLessThan(bounds[i] as number);
      if (i > 0) expect(v).toBeLessThan(values[i - 1] as number);
    });
  });

  it('D is alternating with decreasing |d_n| -> 0 (Leibniz test applies)', () => {
    for (let n = 0; n < 500; n++) {
      expect(Math.abs(dTerm(n))).toBeGreaterThan(Math.abs(dTerm(n + 1)));
      expect(dTerm(n) * dTerm(n + 1)).toBeLessThan(0);
    }
    expect(Math.abs(dTerm(100000))).toBeLessThan(1e-6);
  });
});

describe('tauber: the numbers agree with the theorem', () => {
  it('D partial sums are Cauchy: |S_4000 - S_2000| = 1.78e-5 < 1e-3', () => {
    const s2000 = partialSumD(2000);
    const s4000 = partialSumD(ABEL_TERMS);
    expectCloseTo(s2000, 1.1364157756120048, 1e-9);
    expectCloseTo(s4000, 1.136433586496548, 1e-9);
    expect(Math.abs(s4000 - s2000)).toBeLessThan(1e-3);
  });

  it('|A_D(0.999) - S_4000| = 2.27e-4 < 5e-3', () => {
    const a = abelD(0.999);
    expectCloseTo(a, 1.1366605889895591, 1e-9);
    expect(Math.abs(a - partialSumD(ABEL_TERMS))).toBeLessThan(5e-3);
  });

  it('S_D (N=20000) = 1.1364461306959979 and A_D(0.999) agrees with it', () => {
    expectCloseTo(sumD(), 1.1364461306959979, 1e-9);
    expect(Math.abs(abelD(0.999) - sumD())).toBeLessThan(5e-3);
  });
});

describe('tauber: model compute', () => {
  it('reads R from the control state (init 90 -> r = 0.9) and clamps', () => {
    const data = compute({ R: DEFAULT_R });
    expect(data.r).toBe(0.9);
    expectCloseTo(data.abelGrandiAtR, 1 / 1.9, 1e-12);
    expectCloseTo(data.abelDAtR, 1.1582929967413107, 1e-9);
    expect(data.ndProbes).toHaveLength(3);
    expect(data.grandiProbes).toHaveLength(3);
    expect(compute({ R: MIN_R }).r).toBe(0.5);
    expect(compute({ R: MAX_R }).r).toBe(0.99);
    expect(compute({ R: 500 }).r).toBe(0.99);
    expect(compute({ R: -5 }).r).toBe(0.5);
    expect(compute({}).r).toBe(0.9);
  });

  it('exports the expected data keys', () => {
    const data = compute({ R: 90 });
    for (const key of [
      'r',
      'grandiCurve',
      'dCurve',
      'abelGrandiAtR',
      'abelDAtR',
      'sumD',
      'partialSumD4000',
      'ndProbes',
      'grandiProbes',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('tauber: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(tauberProblems);
    for (const p of tauberProblems) {
      expect(p.preset['R']).toBe(90);
    }
  });

  it('the three ids are tauber-proof, grandi-fails, series-d', () => {
    expect(tauberProblems.map((p) => p.id)).toEqual(['tauber-proof', 'grandi-fails', 'series-d']);
  });
});
