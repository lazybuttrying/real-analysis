import { describe, expect, it } from 'vitest';
import { checkProblemsShape, expectCloseTo, syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DELTA_INIT,
  DELTA_MAX,
  DELTA_MIN,
  egorovData,
  egorovModel,
  fnAt,
  N_INIT,
  N_MAX,
  N_MIN,
  type EgorovData,
} from '../src/chapters/calculus/models/egorov';
import { egorovProblems } from '../src/chapters/calculus/problems/egorov';

const compute = (state: ControlState): EgorovData => syncCompute(egorovModel, state);

describe('egorov: the sliding bump f_n = 1_{[1/(n+1), 1/n]}', () => {
  it('fnAt is 1 exactly on the bump interval, 0 elsewhere', () => {
    for (const n of [1, 2, 6, 40]) {
      const a = 1 / (n + 1);
      const b = 1 / n;
      expect(fnAt(n, a)).toBe(1);
      expect(fnAt(n, b)).toBe(1);
      expect(fnAt(n, (a + b) / 2)).toBe(1);
      expect(fnAt(n, 0)).toBe(0);
      expect(fnAt(n, a / 2)).toBe(0);
      // A point strictly right of the bump (except the n=1 edge case b=1).
      if (n > 1) expect(fnAt(n, 1)).toBe(0);
    }
  });

  it('f_n(x) -> 0 pointwise: for fixed x > 0 the bumps eventually pass by', () => {
    for (const x of [0.3, 0.05, 0.9]) {
      for (let k = Math.ceil(1 / x) + 1; k <= Math.ceil(1 / x) + 5; k++) {
        expect(fnAt(k, x)).toBe(0);
      }
    }
    // At x = 0 every f_n is 0.
    for (let n = 1; n <= 10; n++) expect(fnAt(n, 0)).toBe(0);
  });

  it('convergence is not uniform on [0,1]: sup |f_n| = 1 for every n', () => {
    for (const n of [1, 6, 40]) {
      expect(fnAt(n, 1 / (n + 1))).toBe(1);
    }
  });
});

describe('egorov: the bad set E_{n,delta} = (0, 1/n]', () => {
  it('has measure exactly 1/n for 0 < delta <= 1', () => {
    for (const n of [1, 2, 6, 40]) {
      for (const delta of [0.1, 0.5, 1]) {
        const data = egorovData(delta, n);
        expect(data.badLeft).toBe(0);
        expectCloseTo(data.badRight, 1 / n, 1e-15);
        expectCloseTo(data.badMeasure, 1 / n, 1e-15);
      }
    }
  });

  it('is empty for delta > 1 (|f_k| <= 1 < delta never holds)', () => {
    expect(egorovData(2, 6).badMeasure).toBe(0);
  });

  it('the bad sets are nested decreasing: B_{n+1} subset B_n', () => {
    for (let n = N_MIN; n < N_MAX; n++) {
      expect(egorovData(0.5, n + 1).badRight).toBeLessThan(egorovData(0.5, n).badRight);
    }
  });

  it('bump endpoints are 1/(n+1) and 1/n', () => {
    const data = egorovData(0.5, 6);
    expectCloseTo(data.bumpA, 1 / 7, 1e-15);
    expectCloseTo(data.bumpB, 1 / 6, 1e-15);
  });
});

describe('egorov: uniform convergence on the good set [1/n, 1]', () => {
  it('f_k vanishes identically on [1/n, 1] for every k >= n+1', () => {
    for (const n of [1, 2, 6, 20]) {
      const data = egorovData(0.5, n);
      expect(data.tailStart).toBe(n + 1);
      // Sample the good set, including the left endpoint 1/n.
      for (let i = 0; i <= 50; i++) {
        const x = data.goodLeft + (i / 50) * (1 - data.goodLeft);
        for (let k = n + 1; k <= n + 4; k++) {
          expect(fnAt(k, x)).toBe(0);
        }
      }
    }
  });

  it('the good set starts exactly where the bad set ends', () => {
    const data = egorovData(0.5, 9);
    expect(data.goodLeft).toBe(data.badRight);
    expect(data.goodRight).toBe(1);
  });
});

describe('egorov: model compute', () => {
  it('reads delta and n from the control state, clamps n, defaults to init', () => {
    expect(compute({}).delta).toBe(DELTA_INIT);
    expect(compute({}).n).toBe(N_INIT);
    expect(compute({ delta: 0.3 }).delta).toBeCloseTo(0.3, 12);
    expect(compute({ n: 100 }).n).toBe(N_MAX);
    expect(compute({ n: -3 }).n).toBe(N_MIN);
    expect(compute({ n: 2.4 }).n).toBe(2);
    expect(compute({ delta: NaN }).delta).toBe(DELTA_INIT);
    expect(compute({ n: NaN }).n).toBe(N_INIT);
  });

  it('delta beyond 1 empties the bad set through the model too', () => {
    expect(compute({ delta: 1.5, n: 6 }).badMeasure).toBe(0);
  });

  it('exports the expected data keys', () => {
    const data = compute({ delta: 0.5, n: 6 });
    for (const key of [
      'delta',
      'n',
      'bumpA',
      'bumpB',
      'badLeft',
      'badRight',
      'badMeasure',
      'goodLeft',
      'goodRight',
      'tailStart',
    ] as const) {
      expect(data).toHaveProperty(key);
    }
  });

  it('control constants match the specified slider ranges', () => {
    expect(N_MIN).toBe(1);
    expect(N_MAX).toBe(40);
    expect(DELTA_MIN).toBe(0.1);
    expect(DELTA_MAX).toBe(1);
  });
});

describe('egorov: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    checkProblemsShape(egorovProblems);
  });

  it('the three ids are egorov-concrete, egorov-nested, egorov-infinite-measure', () => {
    expect(egorovProblems.map((p) => p.id)).toEqual([
      'egorov-concrete',
      'egorov-nested',
      'egorov-infinite-measure',
    ]);
  });

  it('presets use valid control values (delta in [0.1, 1], n in [1, 40])', () => {
    for (const p of egorovProblems) {
      const delta = Number(p.preset['delta']);
      const n = Number(p.preset['n']);
      expect(delta).toBeGreaterThanOrEqual(DELTA_MIN);
      expect(delta).toBeLessThanOrEqual(DELTA_MAX);
      expect(n).toBeGreaterThanOrEqual(N_MIN);
      expect(n).toBeLessThanOrEqual(N_MAX);
    }
  });

  it('preset caption numbers match the model (n = 6: bad measure 1/6)', () => {
    const data = egorovData(0.5, 6);
    expectCloseTo(data.badMeasure, 1 / 6, 1e-15);
    expect(data.tailStart).toBe(7);
  });
});
