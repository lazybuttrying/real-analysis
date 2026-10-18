import type { SceneModel } from '../../../contracts';

/**
 * Integers from naturals, rationals from integers — both as equivalence
 * classes of pairs. Z: (a,b) ~ (c,d) iff a+d = b+c (the integer "a-b").
 * Q: (a,b) ~ (c,d) iff a*d = b*c (the rational "a/b", with b,d != 0).
 * The same "a number is an equivalence class" technique builds the reals
 * from the rationals in the construction scene. Pure computation: no DOM,
 * d3, or three.
 */

export function intRepr(a: number, b: number): number {
  return a - b;
}

export function intEquiv(a: number, b: number, c: number, d: number): boolean {
  return a + d === b + c;
}

export function ratValue(p: number, q: number): number {
  return p / q;
}

export function ratEquiv(p: number, q: number, r: number, s: number): boolean {
  return p * s === r * q;
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

interface ReducedFraction {
  p: number;
  q: number;
  value: number;
}

/** Unique reduced fractions p/q with 1 <= q <= denom and -2 <= p/q <= 2. */
export function reducedFractions(denom: number): ReducedFraction[] {
  const cap = Math.min(8, Math.max(1, Math.floor(denom)));
  const out: ReducedFraction[] = [];
  for (let q = 1; q <= cap; q++) {
    for (let p = -2 * q; p <= 2 * q; p++) {
      if (gcd(p, q) !== 1) continue;
      out.push({ p, q, value: p / q });
    }
  }
  out.sort((a, b) => a.value - b.value || a.q - b.q);
  return out;
}

/** All integer pairs (r, s) with 1 <= s <= denom equivalent to (p, q). */
export function equivClass(p: number, q: number, denom: number): Array<{ r: number; s: number }> {
  const cap = Math.min(8, Math.max(1, Math.floor(denom)));
  const out: Array<{ r: number; s: number }> = [];
  for (let s = 1; s <= cap; s++) {
    if ((p * s) % q !== 0) continue;
    const r = (p * s) / q;
    if (Number.isInteger(r)) out.push({ r, s });
  }
  return out;
}

/** Reduced midpoint of p1/q1 and p2/q2: (p1*q2 + p2*q1) / (2*q1*q2), reduced. */
export function midpoint(p1: number, q1: number, p2: number, q2: number): { p: number; q: number } {
  const num = p1 * q2 + p2 * q1;
  const den = 2 * q1 * q2;
  const g = gcd(num, den);
  return { p: num / g, q: den / g };
}

export interface IntegersRationalsData {
  set: 'naturals' | 'integers' | 'rationals';
  denom: number;
  fractions: ReducedFraction[];
  /** All (r, s) with 1 <= s <= denom equivalent to (1, 2): 1/2 = 2/4 = 3/6 = ... */
  class12: Array<{ r: number; s: number }>;
}

export const integersRationalsModel: SceneModel<IntegersRationalsData> = {
  compute(state) {
    const rawSet = state['set'];
    const set: IntegersRationalsData['set'] =
      rawSet === 'naturals' || rawSet === 'integers' ? rawSet : 'rationals';
    const rawDenom = Number(state['denom']);
    const denom = Number.isFinite(rawDenom) ? Math.min(8, Math.max(1, Math.floor(rawDenom))) : 4;
    return {
      set,
      denom,
      fractions: set === 'rationals' ? reducedFractions(denom) : [],
      class12: set === 'rationals' ? equivClass(1, 2, denom) : [],
    };
  },
};
