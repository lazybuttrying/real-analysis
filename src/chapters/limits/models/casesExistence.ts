import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Two proof techniques in one scene.
 * (A) Proof by cases: |xy| = |x||y| via the four sign cases (the zero case
 *     folded into case 1).
 * (B) Non-constructive existence: irrational a, b with a^b rational —
 *     either c = sqrt(2)^sqrt(2) is rational (done with a = b = sqrt(2)),
 *     or c is irrational and a = c, b = sqrt(2) gives a^b = 2.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const CASES_EXISTENCE_PART_OPTIONS = ['cases', 'existence'] as const;
type CasesExistencePart = (typeof CASES_EXISTENCE_PART_OPTIONS)[number];

export const CASES_X_MIN = -5;
export const CASES_X_MAX = 5;
export const CASES_X_INIT = -2;
export const CASES_Y_MIN = -5;
export const CASES_Y_MAX = 5;
export const CASES_Y_INIT = 3;

/** The four sign cases, plus 'zero' when x == 0 or y == 0. */
export type SignCaseId = 'pos-pos' | 'pos-neg' | 'neg-pos' | 'neg-neg' | 'zero';

export interface CasesExistenceData {
  part: CasesExistencePart;
  x: number;
  y: number;
  caseId: SignCaseId;
  absX: number;
  absY: number;
  xy: number;
  absXY: number;
  absXabsY: number;
  /** Whether |xy| equals |x||y| (always true). */
  equal: boolean;
}

/** sqrt(2)^sqrt(2) — the fork point of the non-constructive existence proof. */
export const SQRT2_POW: number = Math.pow(Math.SQRT2, Math.SQRT2);

/** (sqrt(2)^sqrt(2))^sqrt(2) = sqrt(2)^(sqrt(2)*sqrt(2)) = sqrt(2)^2 = 2. */
export const SQRT2_POW_IDENTITY: number = Math.pow(SQRT2_POW, Math.SQRT2);

/** Validate the 'part' select value; anything unknown falls back to 'cases'. */
export function casesPart(option: unknown): CasesExistencePart {
  return option === 'existence' ? 'existence' : 'cases';
}

/** The sign case containing (x, y); 'zero' when x == 0 or y == 0. */
export function signCase(x: number, y: number): SignCaseId {
  if (x === 0 || y === 0) return 'zero';
  const sx = x > 0 ? 'pos' : 'neg';
  const sy = y > 0 ? 'pos' : 'neg';
  return `${sx}-${sy}` as SignCaseId;
}

/**
 * The |xy| = |x||y| verification for arbitrary x, y (clamped to [-5, 5]).
 * Called by the scene model and directly by tests.
 */
export function casesData(x: number, y: number): CasesExistenceData {
  const xx = clampNumber(x, CASES_X_MIN, CASES_X_MAX, CASES_X_INIT);
  const yy = clampNumber(y, CASES_Y_MIN, CASES_Y_MAX, CASES_Y_INIT);
  const xy = xx * yy;
  const absX = Math.abs(xx);
  const absY = Math.abs(yy);
  const absXY = Math.abs(xy);
  const absXabsY = absX * absY;
  return {
    part: 'cases',
    x: xx,
    y: yy,
    caseId: signCase(xx, yy),
    absX,
    absY,
    xy,
    absXY,
    absXabsY,
    equal: Math.abs(absXY - absXabsY) <= 1e-12 * Math.max(1, absXabsY),
  };
}

export const casesExistenceModel: SceneModel<CasesExistenceData> = {
  compute(state) {
    const part = casesPart(state['part']);
    const data = casesData(Number(state['x']), Number(state['y']));
    return { ...data, part };
  },
};
