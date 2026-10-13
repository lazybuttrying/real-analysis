import { describe, expect, it } from 'vitest';
import {
  countableData,
  countableModel,
  GRID_SIZE,
  MAX_N,
  type CountableData,
} from '../src/chapters/limits/models/countable';

describe('countable model', () => {
  it('enumerates the first 9 positive rationals in Cantor diagonal order', () => {
    const data = countableData('rationals', 9);
    expect(data.rationals.map((r) => r.value)).toEqual([1, 1 / 2, 2, 1 / 3, 3, 1 / 4, 2 / 3, 3 / 2, 4]);
    expect(data.rationals.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(data.rationals[0]).toMatchObject({ p: 1, q: 1, index: 1 });
    expect(data.rationals[6]).toMatchObject({ p: 2, q: 3, index: 7 });
    expect(data.rationals[7]).toMatchObject({ p: 3, q: 2, index: 8 });
  });

  it('marks duplicate cells in the 8x8 grid as skipped', () => {
    const data = countableData('rationals', MAX_N);
    const at = (p: number, q: number): number | null | undefined =>
      data.grid.find((c) => c.p === p && c.q === q)?.index;
    expect(at(1, 1)).toBe(1);
    expect(at(1, 2)).toBe(2);
    expect(at(2, 1)).toBe(3);
    expect(at(1, 3)).toBe(4);
    expect(at(3, 1)).toBe(5);
    expect(at(2, 2)).toBeNull();
    expect(at(2, 4)).toBeNull();
    expect(at(3, 3)).toBeNull();
    expect(data.grid).toHaveLength(GRID_SIZE * GRID_SIZE);
  });

  it('builds 8 binary sequences and a flipped diagonal differing at every diagonal position', () => {
    const data = countableData('diagonal', 8);
    expect(data.sequences).toHaveLength(8);
    for (const s of data.sequences) {
      expect(s).toHaveLength(8);
      expect(s).toMatch(/^[01]{8}$/);
    }
    expect(data.sequences[0]).toBe('01010101');
    expect(data.sequences[1]).toBe('11111111');
    expect(data.anti).toHaveLength(8);
    for (let i = 0; i < 8; i++) {
      expect(data.anti[i]).toBe(data.sequences[i]?.[i] === '0' ? '1' : '0');
      expect(data.anti[i]).not.toBe(data.sequences[i]?.[i]);
    }
  });

  it('compute() reads the control state and clamps n into range', async () => {
    const diag = (await countableModel.compute({ panel: 'diagonal', n: 8 })) as CountableData;
    expect(diag.panel).toBe('diagonal');
    expect(diag.n).toBe(8);
    const big = (await countableModel.compute({ panel: 'rationals', n: 1000 })) as CountableData;
    expect(big.n).toBe(MAX_N);
    expect(big.rationals).toHaveLength(MAX_N);
    const badPanel = (await countableModel.compute({ panel: 'nope', n: 20 })) as CountableData;
    expect(badPanel.panel).toBe('rationals');
    const missing = (await countableModel.compute({})) as CountableData;
    expect(missing.n).toBe(20);
    expect(missing.panel).toBe('rationals');
    expect(missing.rationals).toHaveLength(20);
  });

  it('the integer enumeration 0, 1, -1, 2, -2, ... lists every integer exactly once', () => {
    const a = (k: number): number => (k === 0 ? 0 : k % 2 === 1 ? (k + 1) / 2 : -k / 2);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8].map(a)).toEqual([0, 1, -1, 2, -2, 3, -3, 4, -4]);
    for (let m = -50; m <= 50; m++) {
      const k = m === 0 ? 0 : m > 0 ? 2 * m - 1 : -2 * m;
      expect(a(k)).toBe(m);
    }
  });
});
