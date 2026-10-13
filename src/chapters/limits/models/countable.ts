import type { SceneModel } from '../../../contracts';

/**
 * Cantor's diagonal enumeration of the positive rationals, plus the data for
 * the diagonal argument: 8 fixed binary sequences and the flipped diagonal.
 * Pure computation: no DOM, d3, or three.
 */

export const MAX_N = 64;
export const GRID_SIZE = 8;
export const SEQ_COUNT = 8;

export interface RationalEntry {
  p: number;
  q: number;
  value: number;
  /** 1-based position in the enumeration. */
  index: number;
}

export interface GridCell {
  p: number;
  q: number;
  /** Enumeration index assigned when this cell was first visited, or null when skipped as a duplicate value. */
  index: number | null;
}

export interface CountableData {
  panel: string;
  n: number;
  /** First n positive rationals in Cantor diagonal enumeration order. */
  rationals: RationalEntry[];
  /** 8x8 grid of (p, q) cells with their enumeration indices. */
  grid: GridCell[];
  /** 8 binary sequences for the diagonal argument. */
  sequences: string[];
  /** The flipped diagonal: differs from every sequence at the diagonal position. */
  anti: string;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function countableData(panel: string, n: number): CountableData {
  const count = Number.isFinite(n) ? Math.min(MAX_N, Math.max(1, Math.floor(n))) : 20;
  const seen = new Set<string>();
  const rationals: RationalEntry[] = [];
  const visitIndex = new Map<string, number | null>();
  let index = 0;
  // Diagonal sums p + q = 2, 3, ...; s = 16 covers every cell of the 8x8 grid.
  for (let s = 2; ; s++) {
    for (let p = 1; p < s; p++) {
      const q = s - p;
      const g = gcd(p, q);
      const key = `${p / g}/${q / g}`;
      if (!seen.has(key)) {
        seen.add(key);
        index += 1;
        visitIndex.set(`${p}/${q}`, index);
        if (index <= count) rationals.push({ p, q, value: p / q, index });
      } else {
        visitIndex.set(`${p}/${q}`, null);
      }
    }
    if (s >= 2 * GRID_SIZE && index >= count) break;
  }
  const grid: GridCell[] = [];
  for (let p = 1; p <= GRID_SIZE; p++) {
    for (let q = 1; q <= GRID_SIZE; q++) {
      grid.push({ p, q, index: visitIndex.get(`${p}/${q}`) ?? null });
    }
  }
  const sequences: string[] = [];
  for (let i = 0; i < SEQ_COUNT; i++) {
    let row = '';
    for (let j = 0; j < SEQ_COUNT; j++) row += String((i * j + i + j) % 2);
    sequences.push(row);
  }
  let anti = '';
  for (let i = 0; i < SEQ_COUNT; i++) anti += sequences[i]?.[i] === '0' ? '1' : '0';
  return { panel, n: count, rationals, grid, sequences, anti };
}

export const countableModel: SceneModel<CountableData> = {
  compute(state) {
    const raw = String(state['panel'] ?? '');
    const panel = raw === 'diagonal' ? 'diagonal' : 'rationals';
    const nRaw = Number(state['n']);
    const n = Number.isFinite(nRaw) ? nRaw : 20;
    return countableData(panel, n);
  },
};
