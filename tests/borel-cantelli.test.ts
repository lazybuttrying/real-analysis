import { describe, expect, it } from 'vitest';
import { expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  borelCantelliData,
  borelCantelliModel,
  completeLevels,
  intervalAt,
  MODE_INIT,
  MODE_OPTIONS,
  N_INIT,
  N_MAX,
  N_MIN,
  SAMPLE_COUNT,
  SUM_LIMIT,
  type BorelCantelliData,
} from '../src/chapters/calculus/models/borelCantelli';
import { borelCantelliProblems } from '../src/chapters/calculus/problems/borel-cantelli';

const compute = (state: ControlState): BorelCantelliData => syncCompute(borelCantelliModel, state);

describe('borel-cantelli: summable enumeration E_n = [0, 1/n^2]', () => {
  it('intervalAt returns [0, 1/k^2] with shrinking right endpoints', () => {
    for (const k of [1, 2, 5, 60]) {
      const iv = intervalAt('summable', k);
      expect(iv.l).toBe(0);
      expectCloseTo(iv.r, 1 / (k * k), 1e-15);
    }
    for (let k = 1; k < 60; k++) {
      expect(intervalAt('summable', k + 1).r).toBeLessThan(intervalAt('summable', k).r);
    }
  });

  it('partial sums converge to pi^2/6 with tail < 1/n', () => {
    expectCloseTo(SUM_LIMIT, (Math.PI * Math.PI) / 6, 1e-15);
    const data = borelCantelliData('summable', N_MAX);
    expect(data.partialSum).toBeLessThan(SUM_LIMIT);
    // Tail bound: sum_{k>n} 1/k^2 < sum_{k>n} (1/(k-1) - 1/k) = 1/n.
    expect(SUM_LIMIT - data.partialSum).toBeLessThan(1 / N_MAX);
    expectCloseTo(data.partialSum, 1.6284055175, 1e-9);
    expect(data.limitTotal).toBe(SUM_LIMIT);
  });

  it('limsup E_n = {0}: only x = 0 lies in every set', () => {
    const data = borelCantelliData('summable', 20);
    for (const iv of data.intervals) {
      expect(iv.l).toBeLessThanOrEqual(0);
      expect(iv.r).toBeGreaterThanOrEqual(0);
    }
    // Any x > 0 drops out once 1/k^2 < x.
    const x = 0.01;
    const lastCovering = Math.floor(1 / Math.sqrt(x));
    expect(intervalAt('summable', lastCovering).r).toBeGreaterThanOrEqual(x);
    expect(intervalAt('summable', lastCovering + 1).r).toBeLessThan(x);
  });
});

describe('borel-cantelli: nonsummable dyadic cycling', () => {
  it('enumerates dyadic intervals level by level', () => {
    const cases: Array<[number, number, number]> = [
      [1, 0, 1],
      [2, 0, 1 / 2],
      [3, 1 / 2, 1],
      [4, 0, 1 / 4],
      [5, 1 / 4, 1 / 2],
      [6, 1 / 2, 3 / 4],
      [7, 3 / 4, 1],
      [8, 0, 1 / 8],
      [15, 7 / 8, 1],
    ];
    for (const [k, l, r] of cases) {
      const iv = intervalAt('nonsummable', k);
      expectCloseTo(iv.l, l, 1e-15);
      expectCloseTo(iv.r, r, 1e-15);
    }
  });

  it('each complete dyadic level sums to length 1', () => {
    for (let m = 0; m <= 4; m++) {
      let total = 0;
      for (let k = 2 ** m; k < 2 ** (m + 1); k++) {
        const iv = intervalAt('nonsummable', k);
        total += iv.r - iv.l;
      }
      expectCloseTo(total, 1, 1e-12);
    }
  });

  it('partial sum counts complete levels: n = 31 gives 5', () => {
    expectCloseTo(borelCantelliData('nonsummable', 31).partialSum, 5, 1e-12);
    expectCloseTo(borelCantelliData('nonsummable', 7).partialSum, 3, 1e-12);
    expect(borelCantelliData('nonsummable', 60).limitTotal).toBe(Infinity);
  });

  it('completeLevels counts the finished dyadic levels', () => {
    expect(completeLevels(1)).toBe(1);
    expect(completeLevels(3)).toBe(2);
    expect(completeLevels(7)).toBe(3);
    expect(completeLevels(31)).toBe(5);
    expect(completeLevels(60)).toBe(5);
  });

  it('every point is covered at every complete level (limsup = [0,1])', () => {
    const data = borelCantelliData('nonsummable', 60);
    const minCoverage = Math.min(...data.coverage);
    expect(minCoverage).toBeGreaterThanOrEqual(completeLevels(60));
  });
});

describe('borel-cantelli: coverage and limsup approximation', () => {
  it('summable: x = 0 is in all n sets; x = 1 only in E_1', () => {
    const data = borelCantelliData('summable', 60);
    expect(data.coverage[0]).toBe(60);
    expect(data.coverage[SAMPLE_COUNT]).toBe(1);
  });

  it('summable threshold is ceil(n/2); limsup approx shrinks to {0}', () => {
    const data = borelCantelliData('summable', 60);
    expect(data.threshold).toBe(30);
    expect(data.limsupHit[0]).toBe(true);
    // Coverage >= 30 needs 1/sqrt(x) >= 30, i.e. x <= 1/900 < 1/200.
    expect(data.limsupHit[1]).toBe(false);
    expect(data.limsupMeasure).toBeLessThan(0.01);
  });

  it('nonsummable threshold is the complete-level count; approx is all of [0,1]', () => {
    const data = borelCantelliData('nonsummable', 60);
    expect(data.threshold).toBe(5);
    expect(data.limsupHit.every(Boolean)).toBe(true);
    expectCloseTo(data.limsupMeasure, 1, 1e-12);
  });

  it('sample grid covers [0,1] with SAMPLE_COUNT + 1 points', () => {
    const data = borelCantelliData('summable', 10);
    expect(data.sampleX).toHaveLength(SAMPLE_COUNT + 1);
    expect(data.sampleX[0]).toBe(0);
    expect(data.sampleX[SAMPLE_COUNT]).toBe(1);
    expect(data.coverage).toHaveLength(SAMPLE_COUNT + 1);
    expect(data.limsupHit).toHaveLength(SAMPLE_COUNT + 1);
  });
});

describe('borel-cantelli: model compute', () => {
  it('reads mode and n from the control state, clamps, defaults to init', () => {
    expect(compute({}).mode).toBe(MODE_INIT);
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ mode: 'nope' }).mode).toBe(MODE_INIT);
    expect(compute({ mode: 'nonsummable' }).mode).toBe('nonsummable');
    expect(compute({ mode: 'summable' }).mode).toBe('summable');
    expect(compute({ n: 100 }).n).toBe(N_MAX);
    expect(compute({ n: 0 }).n).toBe(N_MIN);
    expect(compute({ n: 2.4 }).n).toBe(2);
  });

  it('exports the expected data keys', () => {
    const data = compute({ mode: 'summable', n: 20 });
    for (const key of [
      'mode',
      'n',
      'intervals',
      'partialSum',
      'limitTotal',
      'sampleX',
      'coverage',
      'threshold',
      'limsupHit',
      'limsupMeasure',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });

  it('control constants match the specified ranges', () => {
    expect(N_MIN).toBe(1);
    expect(N_MAX).toBe(60);
    expect(MODE_OPTIONS as readonly string[]).toEqual(['summable', 'nonsummable']);
  });
});

describe('borel-cantelli: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(borelCantelliProblems).toHaveLength(3);
    for (const p of borelCantelliProblems) {
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

  it('the three ids are bc1-example, bc1-general, bc2-dice', () => {
    expect(borelCantelliProblems.map((p) => p.id)).toEqual([
      'bc1-example',
      'bc1-general',
      'bc2-dice',
    ]);
  });

  it('presets use valid control values (mode option, n in [1, 60])', () => {
    for (const p of borelCantelliProblems) {
      expect(MODE_OPTIONS as readonly string[]).toContain(String(p.preset['mode']));
      const n = Number(p.preset['n']);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
    }
  });

  it('preset caption numbers match the model', () => {
    // Problem 1: sum_{k<=20} 1/k^2.
    expectCloseTo(borelCantelliData('summable', 20).partialSum, 1.5961632439, 1e-9);
    // Problem 3: first 31 nonsummable sets = dyadic levels 0..4, length 5.
    expectCloseTo(borelCantelliData('nonsummable', 31).partialSum, 5, 1e-12);
    expect(borelCantelliData('nonsummable', 31).threshold).toBe(5);
  });
});
