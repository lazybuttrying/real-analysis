import type { SceneModel } from '../../../contracts';

/**
 * Three concrete finite-function examples testing the composition laws:
 *   (1) g∘f injective  =>  f injective (g need not be);
 *   (2) g∘f surjective =>  g surjective (f need not be);
 *   (3) f, g bijective =>  g∘f bijective with (g∘f)^-1 = f^-1 ∘ g^-1.
 *
 * Every table is a lookup array: table[i] is the image of i. Composition
 * is compose(g, f)(i) = g(f(i)). All flags are computed by brute-force
 * checks in the model, so the scene's claims are verified by exhaustion.
 *
 * Pure computation: no DOM, d3, or three.
 */

export const FUNCTION_EXAMPLE_OPTIONS = ['injective-chain', 'surjective-chain', 'bijective'] as const;
export const FUNCTION_EXAMPLE_INIT = 'injective-chain';

export type FunctionExample = (typeof FUNCTION_EXAMPLE_OPTIONS)[number];

export interface FunctionExampleData {
  example: FunctionExample;
  /** Cardinalities of the three sets A, B, C. */
  sizes: { A: number; B: number; C: number };
  /** Lookup tables: f[i] = f(i), g[j] = g(j), gf[i] = g(f(i)). */
  f: number[];
  g: number[];
  gf: number[];
  /** Inverses as lookup tables (null unless the table is a permutation). */
  fInverse: number[] | null;
  gInverse: number[] | null;
  gfInverse: number[] | null;
  fInjective: boolean;
  gInjective: boolean;
  gfInjective: boolean;
  fSurjective: boolean;
  gSurjective: boolean;
  gfSurjective: boolean;
}

/**
 * compose(g, f): apply f first, then g. In table form: gf[i] = g[f[i]].
 */
export function compose(g: number[], f: number[]): number[] {
  return f.map((x) => g[x] as number);
}

/** Injective iff all images are distinct. */
export function isInjective(table: number[]): boolean {
  return new Set(table).size === table.length;
}

/** Surjective onto {0, ..., codomainSize - 1} iff every target is hit. */
export function isSurjective(table: number[], codomainSize: number): boolean {
  const seen = new Set(table);
  for (let y = 0; y < codomainSize; y++) {
    if (!seen.has(y)) return false;
  }
  return true;
}

/**
 * The inverse lookup table (null unless the table is a permutation of
 * {0, ..., n - 1}, i.e. bijective as a map of same-size sets).
 */
export function inverse(table: number[]): number[] | null {
  const n = table.length;
  if (new Set(table).size !== n) return null;
  for (const y of table) {
    if (y < 0 || y >= n) return null;
  }
  const inv = new Array<number>(n);
  table.forEach((y, x) => {
    inv[y] = x;
  });
  return inv;
}

const EXAMPLES: Record<FunctionExample, { A: number; B: number; C: number; f: number[]; g: number[] }> = {
  // g∘f = [0, 1] is injective; f is injective, but g(0) = g(2) = 0.
  'injective-chain': { A: 2, B: 3, C: 2, f: [0, 1], g: [0, 1, 0] },
  // g∘f = [0, 1] is surjective onto C; g is surjective, but f misses 2 in B.
  'surjective-chain': { A: 2, B: 3, C: 2, f: [0, 1], g: [0, 1, 0] },
  // f = [1, 2, 0], g = [2, 0, 1]; g∘f = [0, 1, 2] (identity).
  bijective: { A: 3, B: 3, C: 3, f: [1, 2, 0], g: [2, 0, 1] },
};

/**
 * The data for one example (no clamping needed beyond option validation):
 * used by the scene model and directly by tests.
 */
export function exampleData(example: FunctionExample): FunctionExampleData {
  const spec = EXAMPLES[example];
  const gf = compose(spec.g, spec.f);
  return {
    example,
    sizes: { A: spec.A, B: spec.B, C: spec.C },
    f: spec.f,
    g: spec.g,
    gf,
    fInverse: inverse(spec.f),
    gInverse: inverse(spec.g),
    gfInverse: inverse(gf),
    fInjective: isInjective(spec.f),
    gInjective: isInjective(spec.g),
    gfInjective: isInjective(gf),
    fSurjective: isSurjective(spec.f, spec.B),
    gSurjective: isSurjective(spec.g, spec.C),
    gfSurjective: isSurjective(gf, spec.C),
  };
}

export const functionProofsModel: SceneModel<FunctionExampleData> = {
  compute(state) {
    const rawExample = String(state['example'] ?? '');
    const example: FunctionExample = (FUNCTION_EXAMPLE_OPTIONS as readonly string[]).includes(rawExample)
      ? (rawExample as FunctionExample)
      : FUNCTION_EXAMPLE_INIT;
    return exampleData(example);
  },
};
