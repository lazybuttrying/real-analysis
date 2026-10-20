import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  CONNECTIVE_INIT,
  CONTRAPOSITIVE_INIT,
  logicPropositionsModel,
  logicPropositionsValues,
  truthTable,
  type Connective,
  type LogicPropositionsData,
} from '../src/chapters/limits/models/logicPropositions';
import { logicPropositionsProblems } from '../src/chapters/limits/problems/logic-propositions';

const compute = (state: ControlState): LogicPropositionsData =>
  syncCompute(logicPropositionsModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['connective', 'contrapositive']);

const CONNECTIVES: readonly Connective[] = ['and', 'or', 'implies', 'iff'];

describe('logic-propositions: row order and basic fields', () => {
  it('rows are (T,T), (T,F), (F,T), (F,F) with correct p, q, notP, notQ', () => {
    const rows = truthTable('implies');
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => [r.p, r.q])).toEqual([
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ]);
    rows.forEach((r) => {
      expect(r.notP).toBe(!r.p);
      expect(r.notQ).toBe(!r.q);
    });
  });

  it('contrapositive column is (notQ) -> (notP) and converse is Q -> P', () => {
    for (const c of CONNECTIVES) {
      truthTable(c).forEach((r) => {
        // (notQ) -> (notP) = ¬(¬Q) ∨ (¬P); Q -> P = (¬Q) ∨ P.
        expect(r.contrapositive).toBe(r.q || r.notP);
        expect(r.converse).toBe(r.notQ || r.p);
      });
    }
  });
});

describe('logic-propositions: main columns against known truth tables', () => {
  it('and gives (T, F, F, F)', () => {
    expect(truthTable('and').map((r) => r.main)).toEqual([true, false, false, false]);
  });

  it('or gives (T, T, T, F)', () => {
    expect(truthTable('or').map((r) => r.main)).toEqual([true, true, true, false]);
  });

  it('implies gives (T, F, T, T)', () => {
    expect(truthTable('implies').map((r) => r.main)).toEqual([true, false, true, true]);
  });

  it('iff gives (T, F, F, T)', () => {
    expect(truthTable('iff').map((r) => r.main)).toEqual([true, false, false, true]);
  });
});

describe('logic-propositions: the headline facts (problems 1 and 3)', () => {
  it('P -> Q agrees with (notQ) -> (notP) in all 4 rows', () => {
    const d = logicPropositionsValues('implies', true);
    expect(d.allRowsMainEqualsContrapositive).toBe(true);
    expect(truthTable('implies').map((r) => r.contrapositive)).toEqual([true, false, true, true]);
  });

  it('P -> Q is NOT equivalent to its converse: the (T,F) row splits F vs T', () => {
    const d = logicPropositionsValues('implies', false);
    expect(d.mainEqualsConverseAllRows).toBe(false);
    const split = truthTable('implies')[1];
    if (!split) throw new Error('expected a (T,F) row');
    expect(split.main).toBe(false);
    expect(split.converse).toBe(true);
  });
});

describe('logic-propositions: the flags are computed honestly by brute force', () => {
  it('contrapositive agreement holds only for implies', () => {
    const expected: Record<Connective, boolean> = {
      implies: true,
      and: false,
      or: false,
      iff: false,
    };
    for (const c of CONNECTIVES) {
      const d = logicPropositionsValues(c, true);
      expect(d.allRowsMainEqualsContrapositive, `connective=${c}`).toBe(expected[c]);
    }
  });

  it('converse agreement holds for no connective (the converse uses implication)', () => {
    const expected: Record<Connective, boolean> = {
      implies: false,
      and: false,
      or: false,
      iff: false,
    };
    for (const c of CONNECTIVES) {
      const d = logicPropositionsValues(c, true);
      expect(d.mainEqualsConverseAllRows, `connective=${c}`).toBe(expected[c]);
    }
  });
});

describe('logic-propositions: model compute and control parsing', () => {
  it('defaults to implies / contrapositive shown', () => {
    const d = compute({});
    expect(d.connective).toBe(CONNECTIVE_INIT);
    expect(d.showContrapositive).toBe(CONTRAPOSITIVE_INIT);
  });

  it('reads the connective and toggle from state', () => {
    const d = compute({ connective: 'and', contrapositive: false });
    expect(d.connective).toBe('and');
    expect(d.showContrapositive).toBe(false);
  });

  it('falls back for invalid control values', () => {
    const d = compute({ connective: 'nand', contrapositive: 'yes' });
    expect(d.connective).toBe(CONNECTIVE_INIT);
    expect(d.showContrapositive).toBe(CONTRAPOSITIVE_INIT);
  });
});

describe('logic-propositions: problem presets use only declared control keys', () => {
  it('every preset key is in {connective, contrapositive} with valid values', () => {
    expect(logicPropositionsProblems).toHaveLength(3);
    for (const problem of logicPropositionsProblems) {
      for (const key of Object.keys(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
      }
      const connective = problem.preset['connective'];
      expect(['and', 'or', 'implies', 'iff']).toContain(connective);
      expect(typeof problem.preset['contrapositive']).toBe('boolean');
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = logicPropositionsProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
