import type { SceneModel } from '../../../contracts';

/**
 * Natural numbers and mathematical induction, drawn as a row of falling
 * dominoes. P(1) is the first domino (the base case); the implication
 * P(k) => P(k+1) is the reach that lets each fallen domino knock the next
 * one over. Pure computation: no DOM, d3, or three.
 */

const MAX_DOMINOES = 10;
const MIN_DOMINOES = 1;
const DEFAULT_DOMINOES = 6;

export interface Domino {
  k: number;
  label: string;
}

interface DominoData {
  count: number;
  dominoes: Domino[];
}

/** A row of `count` dominoes (clamped into [1, 10]), the k-th labeled P(k). */
export function dominoData(n: number): DominoData {
  const raw = Number(n);
  const count = Number.isFinite(raw)
    ? Math.min(MAX_DOMINOES, Math.max(MIN_DOMINOES, Math.floor(raw)))
    : DEFAULT_DOMINOES;
  const dominoes: Domino[] = [];
  for (let k = 1; k <= count; k++) {
    dominoes.push({ k, label: `P(${k})` });
  }
  return { count, dominoes };
}

/** Sum 1 + 2 + ... + n by a plain loop (verified against the closed form in tests). */
export function sumToN(n: number): number {
  let total = 0;
  for (let k = 1; k <= n; k++) {
    total += k;
  }
  return total;
}

/** Checks Bernoulli's inequality (1+x)^n >= 1+nx for one (x, n) pair. */
export function bernoulli(x: number, n: number): boolean {
  return (1 + x) ** n >= 1 + n * x;
}

/** Checks 2^n > n for one natural number n. */
export function pow2gt(n: number): boolean {
  return 2 ** n > n;
}

export interface NaturalNumbersData {
  count: number;
  dominoes: Domino[];
}

export const naturalNumbersModel: SceneModel<NaturalNumbersData> = {
  compute(state) {
    const { count, dominoes } = dominoData(Number(state['n']));
    return { count, dominoes };
  },
};
