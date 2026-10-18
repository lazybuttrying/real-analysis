import type { SceneModel } from '../../../contracts';

/**
 * Sets and functions: Venn-region highlighting for set operations, and arrow
 * diagrams for injective / surjective / bijective maps.
 * Pure computation: no DOM, d3, or three.
 */

const SET_OPERATIONS = ['union', 'intersection', 'complement', 'difference', 'symdiff'] as const;

const MAP_SHAPES = ['injective', 'surjective', 'bijective', 'neither'] as const;

/**
 * Venn regions: 'aOnly' = A\B, 'bOnly' = B\A, 'both' = A cap B,
 * 'neither' = (A cup B)^c. The 'complement' operation means A^c.
 */
export function setsActiveRegions(op: string): string[] {
  switch (op) {
    case 'union':
      return ['aOnly', 'both', 'bOnly'];
    case 'intersection':
      return ['both'];
    case 'complement':
      return ['bOnly', 'neither'];
    case 'difference':
      return ['aOnly'];
    case 'symdiff':
      return ['aOnly', 'bOnly'];
    default:
      return ['aOnly', 'both', 'bOnly'];
  }
}

interface ArrowMap {
  domain: string[];
  codomain: string[];
  arrows: Array<[number, number]>;
}

export function setsArrowMap(fnmode: string): ArrowMap {
  switch (fnmode) {
    case 'injective':
      return {
        domain: ['1', '2', '3'],
        codomain: ['a', 'b', 'c', 'd'],
        arrows: [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      };
    case 'surjective':
      return {
        domain: ['1', '2', '3', '4'],
        codomain: ['a', 'b', 'c'],
        arrows: [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 2],
        ],
      };
    case 'bijective':
      return {
        domain: ['1', '2', '3'],
        codomain: ['a', 'b', 'c'],
        arrows: [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      };
    case 'neither':
    default:
      return {
        domain: ['1', '2', '3'],
        codomain: ['a', 'b', 'c'],
        arrows: [
          [0, 0],
          [1, 0],
          [2, 1],
        ],
      };
  }
}

/** Injective: distinct domain dots never share a codomain dot. */
export function isInjectiveMap(arrows: ReadonlyArray<readonly [number, number]>): boolean {
  const targets = arrows.map((a) => a[1]);
  return new Set(targets).size === targets.length;
}

/** Surjective: every codomain dot is hit at least once. */
export function isSurjectiveMap(arrows: ReadonlyArray<readonly [number, number]>, codomainSize: number): boolean {
  const hit = new Set(arrows.map((a) => a[1]));
  for (let j = 0; j < codomainSize; j++) {
    if (!hit.has(j)) return false;
  }
  return true;
}

/** Inclusion-exclusion: |A cup B| = |A| + |B| - |A cap B|. */
export function inclusionExclusion(aSize: number, bSize: number, interSize: number): number {
  return aSize + bSize - interSize;
}

export interface SetsData {
  op: string;
  activeRegions: string[];
  fnmode: string;
  domain: string[];
  codomain: string[];
  arrows: Array<[number, number]>;
  isInjective: boolean;
  isSurjective: boolean;
}

export function setsData(op: string, fnmode: string): SetsData {
  const validOp = (SET_OPERATIONS as readonly string[]).includes(op) ? op : 'union';
  const validMode = (MAP_SHAPES as readonly string[]).includes(fnmode) ? fnmode : 'bijective';
  const { domain, codomain, arrows } = setsArrowMap(validMode);
  return {
    op: validOp,
    activeRegions: setsActiveRegions(validOp),
    fnmode: validMode,
    domain,
    codomain,
    arrows,
    isInjective: isInjectiveMap(arrows),
    isSurjective: isSurjectiveMap(arrows, codomain.length),
  };
}

export const setsModel: SceneModel<SetsData> = {
  compute(state) {
    const op = String(state['op']);
    const fnmode = String(state['fnmode']);
    return setsData(op, fnmode);
  },
};
