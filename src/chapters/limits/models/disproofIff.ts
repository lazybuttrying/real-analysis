import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Disproof by counterexample, tested on four false universal claims.
 *
 * A universal claim forall x P(x) is refuted by ONE witness: an x with
 * not P(x) (since not(forall x P(x)) = exists x not P(x)). Each claim below
 * is false, and each comes with a smallest counterexample:
 *
 *   primes-odd:     "every prime is odd" — 2 is prime and even.
 *   div4:           "4 | n^2 implies 4 | n" — n = 2: 4 | 4 but 4 does not divide 2.
 *   irrational-sum: "the sum of two irrationals is irrational" —
 *                   sqrt(2) + (-sqrt(2)) = 0, rational.
 *   abs-equal:      "|x| = |y| implies x = y" — x = 1, y = -1.
 *
 * The slider value n is the test value for primes-odd (primality/parity of
 * n), div4 (hypothesis/conclusion at n) and abs-equal (the pair (n, -n)).
 * irrational-sum uses a fixed pair, so the slider does not affect it.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const DISPROOF_CLAIMS = ['primes-odd', 'div4', 'irrational-sum', 'abs-equal'] as const;
export type DisproofClaim = (typeof DISPROOF_CLAIMS)[number];

export const DISPROOF_CLAIM_INIT: DisproofClaim = 'primes-odd';

export const DISPROOF_N_MIN = 2;
export const DISPROOF_N_MAX = 60;
export const DISPROOF_N_INIT = 16;

/** True iff m is prime (trial division up to sqrt(m)). */
export function isPrime(m: number): boolean {
  if (!Number.isInteger(m) || m < 2) return false;
  for (let d = 2; d * d <= m; d++) {
    if (m % d === 0) return false;
  }
  return true;
}

export interface DisproofData {
  claim: DisproofClaim;
  /** The slider test value (for irrational-sum it is reported but unused). */
  n: number;
  /** Every claim in this scene is false. */
  verdict: false;

  // primes-odd test at n.
  nIsPrime: boolean;
  nIsEven: boolean;
  /** n is itself a counterexample to primes-odd (prime and even). */
  nIsPrimesOddCounterexample: boolean;

  // div4 test at n.
  n2: number;
  /** Hypothesis: 4 divides n^2. */
  div4Hypothesis: boolean;
  /** Conclusion: 4 divides n. */
  div4Conclusion: boolean;
  /** Hypothesis holds and conclusion fails: n is a counterexample. */
  div4IsCounterexample: boolean;

  // abs-equal test with the pair (x, y) = (n, -n).
  absX: number;
  absY: number;
  absXValue: number;
  absYValue: number;
  /** |x| = |y| but x != y: the pair is a counterexample (for every n >= 1). */
  absIsCounterexample: boolean;

  // irrational-sum fixed pair.
  irrA: number;
  irrB: number;
  irrSum: number;
  /** The sum of the pair is 0, a rational number. */
  irrIsCounterexample: boolean;

  /** Human-readable values of the smallest counterexample, per claim. */
  smallest: { label: string; value: string };
}

const SMALLEST: Record<DisproofClaim, { label: string; value: string }> = {
  'primes-odd': { label: 'n = 2', value: '2 is prime and even' },
  div4: { label: 'n = 2', value: 'n^2 = 4, 4 | 4, but 4 does not divide 2' },
  'irrational-sum': { label: '(sqrt(2), -sqrt(2))', value: 'sum = 0, rational' },
  'abs-equal': { label: '(x, y) = (1, -1)', value: '|1| = |-1| = 1, but 1 != -1' },
};

/** The claim data for arbitrary inputs (no clamping): used by tests. */
export function claimData(claim: DisproofClaim, n: number): DisproofData {
  const nIsPrime = isPrime(n);
  const nIsEven = n % 2 === 0;
  const n2 = n * n;
  const div4Hypothesis = n2 % 4 === 0;
  const div4Conclusion = n % 4 === 0;
  const irrA = Math.SQRT2;
  const irrB = -Math.SQRT2;
  const irrSum = irrA + irrB;
  return {
    claim,
    n,
    verdict: false,
    nIsPrime,
    nIsEven,
    nIsPrimesOddCounterexample: nIsPrime && nIsEven,
    n2,
    div4Hypothesis,
    div4Conclusion,
    div4IsCounterexample: div4Hypothesis && !div4Conclusion,
    absX: n,
    absY: -n,
    absXValue: Math.abs(n),
    absYValue: Math.abs(-n),
    absIsCounterexample: Math.abs(n) === Math.abs(-n) && n !== -n,
    irrA,
    irrB,
    irrSum,
    irrIsCounterexample: irrSum === 0,
    smallest: SMALLEST[claim],
  };
}

export const disproofIffModel: SceneModel<DisproofData> = {
  compute(state) {
    const rawClaim = String(state['claim']);
    const claim = (DISPROOF_CLAIMS as readonly string[]).includes(rawClaim)
      ? (rawClaim as DisproofClaim)
      : DISPROOF_CLAIM_INIT;
    const n = Math.round(
      clampNumber(Number(state['n']), DISPROOF_N_MIN, DISPROOF_N_MAX, DISPROOF_N_INIT),
    );
    return claimData(claim, n);
  },
};
