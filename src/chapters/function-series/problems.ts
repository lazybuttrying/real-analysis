import type { ProblemMeta } from '../../contracts.ts';
import { fejerTheoremProblems } from '../calculus/problems/fejer-theorem';
import { functionSpacesProblems } from '../series/problems/function-spaces';
import { gibbsPhenomenonProblems } from '../calculus/problems/gibbs-phenomenon';
import { problems as diniProblems } from '../series/problems/dini';
import { problems as fourierProblems } from '../calculus/problems/fourier';
import { problems as mTestProblems } from '../series/problems/m-test';
import { parsevalProblems } from '../series/problems/parseval';
import { riemannLebesgueProblems } from '../series/problems/riemann-lebesgue';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'm-test': mTestProblems,
  'dini': diniProblems,
  'fourier': fourierProblems,
  'riemann-lebesgue': riemannLebesgueProblems,
  'fejer-theorem': fejerTheoremProblems,
  'parseval': parsevalProblems,
  'gibbs-phenomenon': gibbsPhenomenonProblems,
  'function-spaces': functionSpacesProblems,
};
