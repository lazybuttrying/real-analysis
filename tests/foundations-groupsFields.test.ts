import { describe, expect, it } from 'vitest';
import {
  groupsFieldsData,
  groupsFieldsModel,
  type GroupsFieldsData,
} from '../src/chapters/limits/models/groupsFields';

describe('groups-fields model', () => {
  it('builds the mod-6 multiplication table', () => {
    const d = groupsFieldsData('z6');
    expect(d.size).toBe(6);
    expect(d.rows).toHaveLength(6);
    expect(d.rows[2]?.[3]).toBe(0);
    expect(d.rows[3]?.[4]).toBe(0);
    expect(d.rows[5]?.[5]).toBe(1);
    expect(d.rows[0]?.[4]).toBe(0);
  });

  it('z6 is not a field: 2 has no inverse, zero divisors are [[2,3],[3,4]]', () => {
    const d = groupsFieldsData('z6');
    expect(d.zeroDivisors).toEqual([
      [2, 3],
      [3, 4],
    ]);
    expect(d.inverses).toEqual([
      { a: 1, inv: 1 },
      { a: 5, inv: 5 },
    ]);
    expect(d.inverses.find((e) => e.a === 2)).toBeUndefined();
    expect(d.isField).toBe(false);
  });

  it('z5 is a field: every nonzero element has an inverse', () => {
    const d = groupsFieldsData('z5');
    expect(d.size).toBe(5);
    expect(d.zeroDivisors).toEqual([]);
    expect(d.inverses).toEqual([
      { a: 1, inv: 1 },
      { a: 2, inv: 3 },
      { a: 3, inv: 2 },
      { a: 4, inv: 4 },
    ]);
    for (const { a, inv } of d.inverses) expect((a * inv) % 5).toBe(1);
    expect(d.isField).toBe(true);
  });

  it('a * 0 = 0 holds in both tables', () => {
    for (const table of ['z6', 'z5'] as const) {
      const d = groupsFieldsData(table);
      for (let a = 0; a < d.size; a++) expect(d.rows[a]?.[0]).toBe(0);
    }
  });

  it('compute() reads the table select and defaults to z6', async () => {
    const z5 = (await groupsFieldsModel.compute({ table: 'z5' })) as GroupsFieldsData;
    expect(z5.table).toBe('z5');
    expect(z5.isField).toBe(true);
    const dflt = (await groupsFieldsModel.compute({})) as GroupsFieldsData;
    expect(dflt.table).toBe('z6');
    expect(dflt.isField).toBe(false);
  });
});
