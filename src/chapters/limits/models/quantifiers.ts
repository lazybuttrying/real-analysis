import type { SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Universal and existential quantifiers over the real numbers.
 *
 * Three statements:
 * - 'forall-exists': forall x exists y (y > x) — TRUE, witness y = x + 1.
 * - 'exists-forall': exists y forall x (y > x) — FALSE; the candidate y
 *   (the slider value) is refuted by the challenger playing x' = y + 1.
 * - 'eps-delta': forall eps>0 exists delta>0 forall t (|t| < delta -> |2t| < eps)
 *   (continuity of f(t) = 2t at 0) — TRUE with delta = eps/2. The slider
 *   plays the role of epsilon := |x| + 0.5 (always positive); the probe
 *   t = 0.9 * delta satisfies |2t| = 1.8 * delta = 0.9 * eps < eps.
 *
 * Each statement also carries the full negation chain (pushing the outer
 * negation inward, flipping every quantifier) in language-neutral notation.
 *
 * Pure computation: no DOM, d3, or three.
 */

export type QuantifierStatement = 'forall-exists' | 'exists-forall' | 'eps-delta';

export const QUANTIFIER_OPTIONS: readonly QuantifierStatement[] = [
  'forall-exists',
  'exists-forall',
  'eps-delta',
];
export const QUANTIFIER_STATEMENT_INIT: QuantifierStatement = 'forall-exists';
export const QUANTIFIERS_X_MIN = -5;
export const QUANTIFIERS_X_MAX = 5;
export const QUANTIFIERS_X_STEP = 0.5;
export const QUANTIFIERS_X_INIT = 2;
export const QUANTIFIERS_NEGATED_INIT = false;

export interface QuantifierData {
  statement: QuantifierStatement;
  truthValue: boolean;
  /** Slider value (the challenge x). */
  x: number;
  showNegation: boolean;
  /** 'forall-exists': the challenged x. */
  challengerX: number;
  /** 'forall-exists': the witness y = x + 1. */
  witness: number;
  /** 'exists-forall': the slider value as the proposed y. */
  candidateY: number;
  /** 'exists-forall': the refuting point x' = y + 1. */
  refutingX: number;
  /** 'eps-delta': epsilon := |x| + 0.5, always positive. */
  eps: number;
  /** 'eps-delta': delta = eps / 2. */
  delta: number;
  /** 'eps-delta': the probe point t = 0.9 * delta. */
  probeT: number;
  /** 'eps-delta': |2t| = 1.8 * delta < eps. */
  probeValue: number;
  /** The negation chain in language-neutral symbolic notation. */
  negationSteps: readonly string[];
}

const NEGATION_STEPS: Record<QuantifierStatement, readonly string[]> = {
  'forall-exists': [
    '¬(∀x ∃y (y > x))',
    '∃x ¬(∃y (y > x))',
    '∃x ∀y ¬(y > x)',
    '∃x ∀y (y ≤ x)',
  ],
  'exists-forall': [
    '¬(∃y ∀x (y > x))',
    '∀y ¬(∀x (y > x))',
    '∀y ∃x ¬(y > x)',
    '∀y ∃x (y ≤ x)',
  ],
  'eps-delta': [
    '¬(∀ε>0 ∃δ>0 ∀t (|t| < δ → |2t| < ε))',
    '∃ε>0 ¬(∃δ>0 ∀t (|t| < δ → |2t| < ε))',
    '∃ε>0 ∀δ>0 ¬(∀t (|t| < δ → |2t| < ε))',
    '∃ε>0 ∀δ>0 ∃t ¬(|t| < δ → |2t| < ε)',
    '∃ε>0 ∀δ>0 ∃t (|t| < δ ∧ |2t| ≥ ε)',
  ],
};

function isStatement(value: unknown): value is QuantifierStatement {
  return (
    value === 'forall-exists' || value === 'exists-forall' || value === 'eps-delta'
  );
}

/** The quantifier data for an arbitrary statement and slider value. Usable by tests without the model wrapper. */
export function quantifierData(statement: QuantifierStatement, x: number): QuantifierData {
  switch (statement) {
    case 'forall-exists':
      return {
        statement,
        truthValue: true,
        x,
        showNegation: false,
        challengerX: x,
        witness: x + 1,
        candidateY: NaN,
        refutingX: NaN,
        eps: NaN,
        delta: NaN,
        probeT: NaN,
        probeValue: NaN,
        negationSteps: NEGATION_STEPS[statement],
      };
    case 'exists-forall':
      return {
        statement,
        truthValue: false,
        x,
        showNegation: false,
        challengerX: NaN,
        witness: NaN,
        candidateY: x,
        refutingX: x + 1,
        eps: NaN,
        delta: NaN,
        probeT: NaN,
        probeValue: NaN,
        negationSteps: NEGATION_STEPS[statement],
      };
    case 'eps-delta': {
      const eps = Math.abs(x) + 0.5;
      const delta = eps / 2;
      const probeT = 0.9 * delta;
      return {
        statement,
        truthValue: true,
        x,
        showNegation: false,
        challengerX: NaN,
        witness: NaN,
        candidateY: NaN,
        refutingX: NaN,
        eps,
        delta,
        probeT,
        probeValue: 2 * probeT,
        negationSteps: NEGATION_STEPS[statement],
      };
    }
  }
}

export const quantifiersModel: SceneModel<QuantifierData> = {
  compute(state) {
    const statement = isStatement(state['statement'])
      ? state['statement']
      : QUANTIFIER_STATEMENT_INIT;
    const x = clampNumber(
      Number(state['x']),
      QUANTIFIERS_X_MIN,
      QUANTIFIERS_X_MAX,
      QUANTIFIERS_X_INIT,
    );
    const toggle = state['negated'];
    const showNegation = typeof toggle === 'boolean' ? toggle : QUANTIFIERS_NEGATED_INIT;
    const data = quantifierData(statement, x);
    data.showNegation = showNegation;
    return data;
  },
};
