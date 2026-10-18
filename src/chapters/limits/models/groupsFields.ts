import type { SceneModel } from '../../../contracts';

/**
 * Multiplication tables of Z_6 and Z_5. Zero divisors, unit inverses, and the
 * field verdict are all computed from the table itself, never hardcoded.
 * Pure computation: no DOM, d3, or three.
 */

type MultTable = 'z6' | 'z5';

interface UnitInverse {
  a: number;
  inv: number;
}

export interface GroupsFieldsData {
  table: MultTable;
  size: number;
  /** rows[a][b] = (a * b) mod size. */
  rows: number[][];
  /** Pairs 2 <= a <= b with (a * b) mod size === 0. */
  zeroDivisors: Array<[number, number]>;
  /** Nonzero elements together with their multiplicative inverse. */
  inverses: UnitInverse[];
  /** True when every nonzero element has an inverse. */
  isField: boolean;
}

export function groupsFieldsData(table: MultTable): GroupsFieldsData {
  const size = table === 'z6' ? 6 : 5;
  const rows: number[][] = [];
  for (let a = 0; a < size; a++) {
    const row: number[] = [];
    for (let b = 0; b < size; b++) row.push((a * b) % size);
    rows.push(row);
  }
  const zeroDivisors: Array<[number, number]> = [];
  for (let a = 2; a < size; a++) {
    for (let b = a; b < size; b++) {
      if ((a * b) % size === 0) zeroDivisors.push([a, b]);
    }
  }
  const inverses: UnitInverse[] = [];
  for (let a = 1; a < size; a++) {
    for (let b = 1; b < size; b++) {
      if ((a * b) % size === 1) {
        inverses.push({ a, inv: b });
        break;
      }
    }
  }
  return { table, size, rows, zeroDivisors, inverses, isField: inverses.length === size - 1 };
}

export const groupsFieldsModel: SceneModel<GroupsFieldsData> = {
  compute(state) {
    const raw = String(state['table'] ?? '');
    return groupsFieldsData(raw === 'z5' ? 'z5' : 'z6');
  },
};
