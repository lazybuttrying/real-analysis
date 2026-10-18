import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  DEFAULT_N,
  MAX_N,
  MIN_N,
  cantorTheoremData,
  cantorTheoremModel,
  diffColumn,
  tableCell,
  type CantorTheoremData,
} from '../src/chapters/limits/models/cantorTheorem';
import { cantorTheoremProblems } from '../src/chapters/limits/problems/cantor-theorem';

const compute = (state: ControlState): CantorTheoremData => syncCompute(cantorTheoremModel, state);

describe('cantor-theorem: the table', () => {
  it('table[i][j] = (i+j) % 2', () => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        expect(tableCell(i, j)).toBe((i + j) % 2);
      }
    }
  });

  it('n = 5: diagonal = [0,0,0,0,0], flipped = [1,1,1,1,1]', () => {
    const data = cantorTheoremData(DEFAULT_N);
    expect(data.n).toBe(5);
    expect(data.diagonal).toEqual([0, 0, 0, 0, 0]);
    expect(data.flipped).toEqual([1, 1, 1, 1, 1]);
    expect(data.table).toHaveLength(5);
    for (const row of data.table) expect(row).toHaveLength(5);
  });

  it('the diagonal is always all zeros (table[i][i] = (2i) % 2 = 0)', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      const data = cantorTheoremData(n);
      for (let i = 0; i < n; i++) {
        expect(data.diagonal[i] as number).toBe(0);
        expect(data.flipped[i] as number).toBe(1);
      }
    }
  });
});

describe('cantor-theorem: the diagonal argument', () => {
  it('diffColumn(n=5) = [0,1,0,1,0]', () => {
    const data = cantorTheoremData(5);
    const got = data.table.map((_, i) => diffColumn(data.table, data.flipped, i));
    expect(got).toEqual([0, 1, 0, 1, 0]);
  });

  it('a witness column always exists and the flipped row differs there', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      const data = cantorTheoremData(n);
      for (let i = 0; i < n; i++) {
        const j = diffColumn(data.table, data.flipped, i);
        expect(j).toBeGreaterThanOrEqual(0);
        expect(j).toBeLessThan(n);
        expect((data.flipped[j] as number)).not.toBe(((data.table[i] as number[])[j] as number));
      }
    }
  });

  it('column i itself always works: flipped[i] = 1 - table[i][i]', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      const data = cantorTheoremData(n);
      for (let i = 0; i < n; i++) {
        expect(data.flipped[i] as number).toBe(1 - ((data.table[i] as number[])[i] as number));
      }
    }
  });

  it('the flipped row is none of the listed rows', () => {
    for (let n = MIN_N; n <= MAX_N; n++) {
      const data = cantorTheoremData(n);
      for (const row of data.table) {
        expect(row).not.toEqual(data.flipped);
      }
    }
  });
});

describe('cantor-theorem: model compute', () => {
  it('reads n from the control state (init 5) and clamps', () => {
    expect(compute({ n: DEFAULT_N }).n).toBe(5);
    expect(compute({ n: MIN_N }).n).toBe(3);
    expect(compute({ n: MAX_N }).n).toBe(8);
    expect(compute({ n: 500 }).n).toBe(8);
    expect(compute({ n: -5 }).n).toBe(3);
    expect(compute({}).n).toBe(5);
  });

  it('exports the expected data keys', () => {
    const data = compute({ n: 5 });
    for (const key of ['n', 'table', 'diagonal', 'flipped'] as const) {
      expect(data).toHaveProperty(key);
    }
  });

  it('diagonal and flipped are consistent with the table', () => {
    const data = compute({ n: 7 });
    for (let i = 0; i < 7; i++) {
      expect(data.diagonal[i] as number).toBe((data.table[i] as number[])[i] as number);
      expect(data.flipped[i] as number).toBe(1 - ((data.table[i] as number[])[i] as number));
    }
  });
});

describe('cantor-theorem: problems export', () => {
  it('has exactly 3 entries with non-empty bilingual statements and proofs', () => {
    expect(cantorTheoremProblems).toHaveLength(3);
    for (const p of cantorTheoremProblems) {
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
      expect(p.preset['n']).toBe(5);
    }
  });

  it('the three ids are cantor-proof, cantor-uncountable, cantor-finite', () => {
    expect(cantorTheoremProblems.map((p) => p.id)).toEqual([
      'cantor-proof',
      'cantor-uncountable',
      'cantor-finite',
    ]);
  });
});
