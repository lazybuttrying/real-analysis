import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  ddOscData,
  ddOscModel,
  diffQuotAtZero,
  oscF,
  oscFp,
  DD_LOGH_INIT,
  DD_LOGH_MAX,
  DD_LOGH_MIN,
  DD_LOGR_INIT,
  DD_LOGR_MAX,
  DD_LOGR_MIN,
  DD_SAMPLES_PER_SIDE,
  type DdOscData,
} from '../src/chapters/calculus/models/discontinuousDerivative';
import { problems } from '../src/chapters/calculus/problems/discontinuous-derivative';

const compute = (state: ControlState): DdOscData => syncCompute(ddOscModel, state);

describe('discontinuous-derivative: the model values', () => {
  it('f(0) = 0 and f\'(0) = 0 by definition', () => {
    expect(oscF(0)).toBe(0);
    expect(oscFp(0)).toBe(0);
  });

  it('f(0.5) = 0.25 sin 2 and f\'(0.5) = sin 2 - cos 2', () => {
    expectCloseTo(oscF(0.5), 0.25 * Math.sin(2), 1e-15);
    expectCloseTo(oscF(0.5), 0.2273243567, 1e-9);
    expectCloseTo(oscFp(0.5), Math.sin(2) - Math.cos(2), 1e-15);
    expectCloseTo(oscFp(0.5), 1.3254442634, 1e-9);
  });

  it('the difference quotient at 0 is h sin(1/h), squeezed by |h|', () => {
    expectCloseTo(diffQuotAtZero(0.01), 0.01 * Math.sin(100), 1e-15);
    expectCloseTo(diffQuotAtZero(0.01), -0.0050636564, 1e-9);
    for (const h of [0.1, 0.01, 0.001, 0.0001]) {
      expect(Math.abs(diffQuotAtZero(h))).toBeLessThanOrEqual(h);
    }
  });

  it('the difference quotient tends to 0 as h -> 0', () => {
    expect(Math.abs(compute({ logR: -1, logH: -4 }).diffQuot)).toBeLessThan(1e-4);
    expect(Math.abs(compute({ logR: -1, logH: -1 }).diffQuot)).toBeLessThan(0.1);
  });

  it('f\'(1/(2 pi n)) = -1 for n = 1..5: the discontinuity witness', () => {
    const data = compute({ logR: -1, logH: -2 });
    expect(data.seqPoints).toHaveLength(5);
    data.seqPoints.forEach((pt, i) => {
      const n = i + 1;
      expectCloseTo(pt.x, 1 / (2 * Math.PI * n), 1e-15);
      expectCloseTo(pt.y, -1, 1e-12);
    });
  });

  it('max |f\'| stays near 1 as the window shrinks to 0', () => {
    for (const logR of [-3, -2, -1]) {
      const data = compute({ logR, logH: -2 });
      expect(data.maxAbsFp).toBeGreaterThan(0.99);
      expect(data.maxAbsFp).toBeLessThan(1.1);
    }
  });

  it('samples cover [-r, r] with quadratic spacing, including 0', () => {
    const data = compute({ logR: -1, logH: -2 });
    expectCloseTo(data.r, 0.1, 1e-15);
    expectCloseTo(data.h, 0.01, 1e-15);
    expect(data.fPts).toHaveLength(2 * DD_SAMPLES_PER_SIDE + 1);
    expect(data.fpPts).toHaveLength(2 * DD_SAMPLES_PER_SIDE + 1);
    expectCloseTo(data.fPts[0]!.x, -0.1, 1e-15);
    expectCloseTo(data.fPts[data.fPts.length - 1]!.x, 0.1, 1e-15);
    const mid = data.fPts[DD_SAMPLES_PER_SIDE]!;
    expect(mid.x).toBe(0);
    expect(mid.y).toBe(0);
    expect(data.fpPts[DD_SAMPLES_PER_SIDE]!.y).toBe(0);
    // Samples agree with the closed forms.
    for (const i of [0, 1000, 3000, data.fPts.length - 1]) {
      expectCloseTo(data.fPts[i]!.y, oscF(data.fPts[i]!.x), 1e-15);
      expectCloseTo(data.fpPts[i]!.y, oscFp(data.fpPts[i]!.x), 1e-15);
    }
  });
});

describe('discontinuous-derivative: the oscillation never dies on a sweep', () => {
  it('|f\'| attains values near +-1 on every window down to r = 0.001', () => {
    for (const logR of [-3, -2, -1, 0]) {
      const data = ddOscData(logR, -2);
      const ys = data.fpPts.map((p) => p.y);
      expect(Math.max(...ys)).toBeGreaterThan(0.9);
      expect(Math.min(...ys)).toBeLessThan(-0.9);
    }
  });

  it('f stays within [-r^2, r^2] on every window', () => {
    for (const logR of [-3, -2, -1, 0]) {
      const data = ddOscData(logR, -2);
      const r2 = data.r * data.r;
      for (const p of data.fPts) {
        expect(Math.abs(p.y)).toBeLessThanOrEqual(r2 + 1e-12);
      }
    }
  });
});

describe('discontinuous-derivative: model compute', () => {
  it('reads logR and logH from the control state, clamps, defaults to init', () => {
    expect(compute({}).logR).toBe(DD_LOGR_INIT);
    expect(compute({}).logH).toBe(DD_LOGH_INIT);
    expect(compute({ logR: 5 }).logR).toBe(DD_LOGR_MAX);
    expect(compute({ logR: -10 }).logR).toBe(DD_LOGR_MIN);
    expect(compute({ logH: 0 }).logH).toBe(DD_LOGH_MAX);
    expect(compute({ logH: -10 }).logH).toBe(DD_LOGH_MIN);
    expect(compute({ logR: -2 }).r).toBeCloseTo(0.01, 15);
    expect(compute({ logH: -3 }).h).toBeCloseTo(0.001, 15);
  });

  it('exports the expected data keys', () => {
    const data = compute({});
    for (const key of [
      'r', 'h', 'logR', 'logH', 'fPts', 'fpPts', 'diffQuot', 'maxAbsFp', 'seqPoints',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });
});

describe('discontinuous-derivative: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(problems).toHaveLength(3);
    for (const p of problems) {
      expect(p.id).toBeTruthy();
      expect(p.statement.ko).toBeTruthy();
      expect(p.statement.en).toBeTruthy();
      expect(p.presetCaption.ko).toBeTruthy();
      expect(p.presetCaption.en).toBeTruthy();
      expect(p.proof.length).toBeGreaterThan(0);
      for (const step of p.proof) {
        expect(step.text.ko).toBeTruthy();
        expect(step.text.en).toBeTruthy();
      }
    }
  });

  it('the three ids are dd-derivative-at-zero, dd-derivative-formula, dd-discontinuous-at-zero', () => {
    expect(problems.map((p) => p.id)).toEqual([
      'dd-derivative-at-zero',
      'dd-derivative-formula',
      'dd-discontinuous-at-zero',
    ]);
  });

  it('presets use logR in [-3, 0] and logH in [-4, -1]', () => {
    for (const p of problems) {
      const logR = Number(p.preset['logR']);
      const logH = Number(p.preset['logH']);
      expect(logR).toBeGreaterThanOrEqual(DD_LOGR_MIN);
      expect(logR).toBeLessThanOrEqual(DD_LOGR_MAX);
      expect(logH).toBeGreaterThanOrEqual(DD_LOGH_MIN);
      expect(logH).toBeLessThanOrEqual(DD_LOGH_MAX);
    }
  });
});
