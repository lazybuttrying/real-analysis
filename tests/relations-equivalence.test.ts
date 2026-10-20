import { describe, expect, it } from 'vitest';
import { syncCompute } from './helpers';
import type { ControlState } from '../src/contracts';
import {
  congruenceData,
  relatedMod,
  relationsEquivalenceModel,
  EQUIVALENCE_N_INIT,
  EQUIVALENCE_N_MAX,
  EQUIVALENCE_N_MIN,
  type CongruenceData,
} from '../src/chapters/limits/models/relationsEquivalence';
import { relationsEquivalenceProblems } from '../src/chapters/limits/problems/relations-equivalence';

const compute = (state: ControlState): CongruenceData => syncCompute(relationsEquivalenceModel, state);

/** The control keys the scene declares (mirrors the meta.ts entry). */
const CONTROL_KEYS = new Set(['n']);

describe('relations-equivalence: the three axioms by brute force', () => {
  it('reflexive, symmetric, transitive hold for every n in 2..8', () => {
    for (let n = 2; n <= 8; n++) {
      const d = congruenceData(n);
      expect(d.reflexive, `n=${n} reflexive`).toBe(true);
      expect(d.symmetric, `n=${n} symmetric`).toBe(true);
      expect(d.transitive, `n=${n} transitive`).toBe(true);
      expect(d.reflexiveCount).toBe(3 * n);
      expect(d.symmetricPairs).toBe(9 * n * n);
      expect(d.transitiveTriples).toBe(27 * n * n * n);
    }
  });

  it('relatedMod matches the difference rule', () => {
    expect(relatedMod(7, 3, 4)).toBe(true); // 7 - 3 = 4
    expect(relatedMod(7, 4, 4)).toBe(false); // 7 - 4 = 3
    expect(relatedMod(3, 11, 4)).toBe(true); // negative difference still works (3 - 11 = -8)
    expect(relatedMod(11, 3, 4)).toBe(true);
  });
});

describe('relations-equivalence: the classes partition U', () => {
  it('classes are pairwise disjoint and cover U, sizes all 3, for n in 2..8', () => {
    for (let n = 2; n <= 8; n++) {
      const d = congruenceData(n);
      expect(d.disjoint, `n=${n} disjoint`).toBe(true);
      expect(d.coversAll, `n=${n} coversAll`).toBe(true);
      expect(d.classSizes).toEqual(Array.from({ length: n }, () => 3));
      expect(d.classes).toHaveLength(n);
      for (let r = 0; r < n; r++) {
        expect(d.classes[r]).toEqual([r, r + n, r + 2 * n]);
      }
    }
  });

  it('the model agrees with congruenceData at the init n = 4', () => {
    const d = compute({ n: 4 });
    const e = congruenceData(4);
    expect(d.classes).toEqual(e.classes);
    expect(d.reflexiveCount).toBe(12);
    expect(d.symmetricPairs).toBe(144);
    expect(d.transitiveTriples).toBe(1728);
  });
});

describe('relations-equivalence: control clamping and ranges', () => {
  it('out-of-range inputs are clamped to the slider range', () => {
    expect(compute({ n: 99 }).n).toBe(EQUIVALENCE_N_MAX);
    expect(compute({ n: 1 }).n).toBe(EQUIVALENCE_N_MIN);
  });

  it('non-finite inputs fall back to the slider init', () => {
    expect(compute({ n: NaN }).n).toBe(EQUIVALENCE_N_INIT);
    expect(compute({ n: 'x' }).n).toBe(EQUIVALENCE_N_INIT);
  });

  it('declared ranges match the task spec', () => {
    expect(EQUIVALENCE_N_MIN).toBe(2);
    expect(EQUIVALENCE_N_MAX).toBe(8);
    expect(EQUIVALENCE_N_INIT).toBe(4);
  });
});

describe('relations-equivalence: problem presets use only declared control keys', () => {
  it('every preset key is in {n} and the value is in range', () => {
    expect(relationsEquivalenceProblems).toHaveLength(3);
    for (const problem of relationsEquivalenceProblems) {
      for (const [key, value] of Object.entries(problem.preset)) {
        expect(CONTROL_KEYS.has(key), `${problem.id}: unexpected preset key '${key}'`).toBe(true);
        expect(typeof value).toBe('number');
        expect(value as number).toBeGreaterThanOrEqual(EQUIVALENCE_N_MIN);
        expect(value as number).toBeLessThanOrEqual(EQUIVALENCE_N_MAX);
      }
      expect(problem.presetCaption.ko).toBeTruthy();
      expect(problem.presetCaption.en).toBeTruthy();
    }
  });

  it('preset ids are unique', () => {
    const ids = relationsEquivalenceProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
