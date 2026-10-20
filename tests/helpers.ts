import { expect } from 'vitest';
import type { ControlState, ProblemMeta } from '../src/contracts';

/**
 * Shared test helpers, factored out of the per-scene test files.
 */

/**
 * Call a scene model's compute synchronously.
 *
 * The SceneModel contract allows `compute` to return `D | Promise<D>`, but
 * every model in this repo is synchronous. If a model ever goes async this
 * throws loudly instead of letting a test silently compare a Promise.
 */
export function syncCompute<D>(
  model: { compute(state: ControlState): D | Promise<D> },
  state: ControlState,
): D {
  const result = model.compute(state);
  if (result instanceof Promise) {
    throw new Error('syncCompute: model.compute returned a Promise; tests assume sync models');
  }
  return result;
}

/**
 * `expect(Math.abs(received - expected)).toBeLessThan(tol)`, factored out
 * from the dozens of call sites that repeated the inline form.
 */
export function expectCloseTo(received: number, expected: number, tol: number): void {
  expect(Math.abs(received - expected)).toBeLessThan(tol);
}

/**
 * Shared integrity check for a scene's problems export, factored out of the
 * per-scene test files that repeated this block verbatim (31 copies).
 */
export function checkProblemsShape(problems: readonly ProblemMeta[]): void {
  expect(problems).toHaveLength(3);
  for (const p of problems) {
    expect(p.id).toBeTruthy();
    expect(p.statement.ko).toBeTruthy();
    expect(p.statement.en).toBeTruthy();
    expect(p.presetCaption.ko).toBeTruthy();
    expect(p.presetCaption.en).toBeTruthy();
    expect(p.proof.length).toBeGreaterThan(0);
    for (const step of p.proof) {
      expect(step.text.ko).toBeTruthy();
      expect(step.text.en).toBeTruthy();
    }
  }
}
