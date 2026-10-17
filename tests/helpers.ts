import { expect } from 'vitest';
import type { ControlState } from '../src/contracts';

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
