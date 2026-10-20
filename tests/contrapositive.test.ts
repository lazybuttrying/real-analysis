import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CONTRAPOSITIVE_N_INIT,
  CONTRAPOSITIVE_N_MAX,
  CONTRAPOSITIVE_N_MIN,
  contrapositiveData,
  contrapositiveModel,
  parityOf,
  type ContrapositiveData,
} from '../src/chapters/limits/models/contrapositive';
import { contrapositiveProblems } from '../src/chapters/limits/problems/contrapositive';

const compute = (state: ControlState): ContrapositiveData => syncCompute(contrapositiveModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['n', 'view']);
const VIEW_OPTIONS = new Set(['statement', 'contrapositive']);

describe('contrapositive: parity and the n = 7 worked case', () => {
  it('parityOf classifies correctly', () => {
    expect(parityOf(7)).toBe('odd');
    expect(parityOf(8)).toBe('even');
    expect(parityOf(49)).toBe('odd');
    expect(parityOf(81)).toBe('odd');
    expect(parityOf(64)).toBe('even');
  });

  it('n = 7: k = 3, odd expansion gives n^2', () => {
    const d = contrapositiveData(7);
    expect(d.n).toBe(7);
    expect(d.n2).toBe(49);
    expect(d.parityN).toBe('odd');
    expect(d.parityN2).toBe('odd');
    expect(d.k).toBe(3);
    // 4k^2 + 4k + 1 = 36 + 12 + 1
    expect(d.oddExpansion).toBe(49);
    // 2 * (2k^2 + 2k) + 1 = 2 * 24 + 1
    expect(d.oddInner).toBe(24);
    expect(d.oddFactored).toBe(49);
    expect(d.implicationCheck).toBe(true);
    expect(d.view).toBe('statement');
  });

  it('even n decomposes as 2k', () => {
    const d = contrapositiveData(8, 'contrapositive');
    expect(d.parityN).toBe('even');
    expect(d.parityN2).toBe('even');
    expect(d.k).toBe(4);
    expect(d.view).toBe('contrapositive');
    expect(d.implicationCheck).toBe(true);
  });
});

describe('contrapositive: n^2 even => n even, brute force to 200', () => {
  it('the implication check holds for every n in 1..200', () => {
    for (let n = 1; n <= 200; n++) {
      const d = contrapositiveData(n);
      expect(d.implicationCheck, `n=${n}`).toBe(true);
      // Independently: no n <= 200 has even square and odd root.
      expect(!(d.parityN2 === 'even' && d.parityN === 'odd'), `n=${n}`).toBe(true);
    }
  });

  it('the odd expansion identity n^2 = 2*(2k^2+2k)+1 holds for every odd n <= 199', () => {
    for (let k = 0; k <= 99; k++) {
      const n = 2 * k + 1;
      const d = contrapositiveData(n);
      expect(d.oddExpansion, `n=${n}`).toBe(n * n);
      expect(d.oddFactored, `n=${n}`).toBe(n * n);
      expect(d.oddInner, `n=${n}`).toBe(2 * k * k + 2 * k);
      expect(d.k).toBe(k);
    }
  });
});

describe('contrapositive: the n = 1..12 grid', () => {
  it('table has 12 correct rows', () => {
    const d = contrapositiveData(5);
    expect(d.table).toHaveLength(12);
    for (let m = 1; m <= 12; m++) {
      const row = d.table[m - 1]!;
      expect(row.n).toBe(m);
      expect(row.n2).toBe(m * m);
      expect(row.parityN).toBe(parityOf(m));
      expect(row.parityN2).toBe(parityOf(m * m));
    }
  });

  it('n^2-even rows are exactly the n-even rows', () => {
    const d = contrapositiveData(5);
    const evenSquares = d.table.filter((r) => r.parityN2 === 'even').map((r) => r.n);
    const evenNs = d.table.filter((r) => r.parityN === 'even').map((r) => r.n);
    expect(evenSquares).toEqual([2, 4, 6, 8, 10, 12]);
    expect(evenNs).toEqual([2, 4, 6, 8, 10, 12]);
  });
});

describe('contrapositive: problem 2 and 3 numbers', () => {
  it('n = 8: 3n+2 = 26 = 2*(3*4+1) even (contrapositive of problem 2)', () => {
    const n = 8;
    const k = n / 2;
    const value = 3 * n + 2;
    expect(parityOf(n)).toBe('even');
    expect(value).toBe(26);
    expect(value).toBe(2 * (3 * k + 1));
    expect(parityOf(value)).toBe('even');
  });

  it('n = 9: n^2 = 81 divisible by 3 and n divisible by 3', () => {
    const d = contrapositiveData(9);
    expect(d.n2).toBe(81);
    expect(d.n2 % 3).toBe(0);
    expect(d.n % 3).toBe(0);
  });

  it('problem 3 cases: n = 3k+1 and 3k+2 give n^2 = 3*(...) + 1', () => {
    for (const k of [0, 1, 2, 5, 10]) {
      const n1 = 3 * k + 1;
      const n2 = 3 * k + 2;
      expect(n1 * n1).toBe(3 * (3 * k * k + 2 * k) + 1);
      expect(n2 * n2).toBe(3 * (3 * k * k + 4 * k + 1) + 1);
      expect((n1 * n1) % 3).toBe(1);
      expect((n2 * n2) % 3).toBe(1);
    }
  });
});

describe('contrapositive: control clamping and ranges', () => {
  it('out-of-range n is clamped', () => {
    expect(compute({ n: 999 }).n).toBe(CONTRAPOSITIVE_N_MAX);
    expect(compute({ n: -5 }).n).toBe(CONTRAPOSITIVE_N_MIN);
  });

  it('non-finite n falls back to the init', () => {
    expect(compute({ n: NaN }).n).toBe(CONTRAPOSITIVE_N_INIT);
    expect(compute({ n: 'x' }).n).toBe(CONTRAPOSITIVE_N_INIT);
  });

  it('an unknown view value falls back to statement', () => {
    expect(compute({ n: 7, view: 'bogus' }).view).toBe('statement');
  });

  it('declared ranges match the task spec', () => {
    expect(CONTRAPOSITIVE_N_MIN).toBe(1);
    expect(CONTRAPOSITIVE_N_MAX).toBe(50);
    expect(CONTRAPOSITIVE_N_INIT).toBe(7);
  });
});

describe('contrapositive: problem presets use only declared control keys', () => {
  it('every preset key is in {n, view} with a valid value', () => {
    expect(contrapositiveProblems).toHaveLength(3);
    for (const problem of contrapositiveProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const s = problem.preset;
      expect(s['n']).toBeGreaterThanOrEqual(CONTRAPOSITIVE_N_MIN);
      expect(s['n']).toBeLessThanOrEqual(CONTRAPOSITIVE_N_MAX);
      expect(VIEW_OPTIONS.has(s['view'] as string), `${problem.id}: bad view '${s['view']}'`).toBe(true);
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = contrapositiveProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
