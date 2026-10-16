import type { SceneModel } from '../../../contracts';

/**
 * Cauchy condensation test, visualized with dyadic blocks.
 *
 * For decreasing a_n >= 0 the terms are grouped into dyadic blocks
 * [2^n, 2^{n+1}): block n holds 2^n terms, each one between a_{2^{n+1}}
 * and a_{2^n}. The block sum B_n = sum_{k=2^n}^{2^{n+1}-1} a_k is therefore
 * sandwiched between the condensed terms:
 *
 *     (1/2) * 2^{n+1} a_{2^{n+1}} <= B_n <= 2^n a_{2^n},
 *
 * i.e. C_{n+1}/2 <= B_n <= C_n with C_n = 2^n a_{2^n}. Summing the blocks
 * pins the partial sums of sum a_n between partial sums of the condensed
 * series, so one converges exactly when the other does.
 *
 * Sequences on offer: 1/n (diverges; the harmonic series), 1/n^2
 * (converges; the Basel problem), and 1/(n ln n) for n >= 2 (diverges,
 * while 1/(n (ln n)^2) would converge).
 *
 * Pure computation: no DOM, d3, or three.
 */

/** Selectable sequences. Option values must match the meta.ts control options. */
export type CondSeries = 'inv-n' | 'inv-n2' | 'inv-n-logn';

export const SERIES_OPTIONS: readonly CondSeries[] = ['inv-n', 'inv-n2', 'inv-n-logn'];
export const DEFAULT_SERIES: CondSeries = 'inv-n';

/** Highlighted dyadic block index; blocks 0..6 cover k = 1..127. */
export const MIN_BLOCK = 0;
export const MAX_BLOCK = 6;
export const DEFAULT_BLOCK = 2;

/**
 * The n-th term of the chosen sequence. For 1/(n ln n) the term is
 * undefined at n = 1 (ln 1 = 0), conventionally treated as 0 here;
 * the condensation argument applies from n >= 2 (block 1 onward).
 */
export function termValue(series: CondSeries, k: number): number {
  if (!Number.isInteger(k) || k < 1) return 0;
  switch (series) {
    case 'inv-n':
      return 1 / k;
    case 'inv-n2':
      return 1 / (k * k);
    case 'inv-n-logn':
      return k >= 2 ? 1 / (k * Math.log(k)) : 0;
  }
}

export interface BlockData {
  /** Block index: the block holds indices [2^n, 2^{n+1}). */
  index: number;
  /** First index of the block, 2^n. */
  start: number;
  /** Last index of the block, 2^{n+1} - 1. */
  end: number;
  /** The a_k values in the block, in order. */
  terms: number[];
  /** B_n = sum_{k=2^n}^{2^{n+1}-1} a_k. */
  blockSum: number;
  /** C_n = 2^n * a_{2^n}, the n-th condensed term. */
  condensed: number;
}

export function blockData(series: CondSeries, n: number): BlockData {
  const index = Math.min(MAX_BLOCK, Math.max(MIN_BLOCK, Math.floor(n)));
  const start = 2 ** index;
  const end = 2 ** (index + 1) - 1;
  const terms: number[] = [];
  let blockSum = 0;
  for (let k = start; k <= end; k++) {
    const t = termValue(series, k);
    terms.push(t);
    blockSum += t;
  }
  return { index, start, end, terms, blockSum, condensed: start * termValue(series, start) };
}

export interface CondensationData {
  series: CondSeries;
  /** Highlighted block index (clamped to [0, 6]). */
  blockIndex: number;
  /** All blocks 0..MAX_BLOCK, used for the bar chart. */
  blocks: BlockData[];
  /** The highlighted block. */
  highlight: BlockData;
  /** S_{2^{n+1}-1} = sum of block sums 0..n. */
  partialUpToBlock: number;
  /** T_n = sum_{j=0}^{n} C_j, the n-th condensed partial sum. */
  condensedPartial: number;
}

export const condensationModel: SceneModel<CondensationData> = {
  compute(state) {
    const rawSeries = String(state['series'] ?? '');
    const series: CondSeries =
      rawSeries === 'inv-n2' || rawSeries === 'inv-n-logn' ? rawSeries : DEFAULT_SERIES;
    const rawBlock = Number(state['block']);
    const blockIndex = Number.isFinite(rawBlock)
      ? Math.min(MAX_BLOCK, Math.max(MIN_BLOCK, Math.floor(rawBlock)))
      : DEFAULT_BLOCK;
    const blocks: BlockData[] = [];
    let partialUpToBlock = 0;
    let condensedPartial = 0;
    for (let n = 0; n <= MAX_BLOCK; n++) {
      const b = blockData(series, n);
      blocks.push(b);
      if (n <= blockIndex) {
        partialUpToBlock += b.blockSum;
        condensedPartial += b.condensed;
      }
    }
    return { series, blockIndex, blocks, highlight: blocks[blockIndex] ?? blockData(series, 0), partialUpToBlock, condensedPartial };
  },
};
