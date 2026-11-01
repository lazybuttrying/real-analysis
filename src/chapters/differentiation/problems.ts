import type { ProblemMeta } from '../../contracts.ts';
import { problems as banachProblems } from '../calculus/problems/banach';
import { problems as cauchyMvtProblems } from '../calculus/problems/cauchy-mvt';
import { derivativeMonotonicityProblems } from '../calculus/problems/derivative-monotonicity';
import { inverseFunctionTheoremProblems } from '../calculus/problems/inverse-function-theorem';
import { problems as convexProblems } from '../calculus/problems/convex';
import { problems as darbouxProblems } from '../calculus/problems/darboux';
import { problems as diffcontProblems } from '../calculus/problems/diffcont';
import { problems as discontinuousDerivativeProblems } from '../calculus/problems/discontinuous-derivative';
import { problems as lhopitalProblems } from '../calculus/problems/lhopital';
import { problems as mvtProblems } from '../calculus/problems/mvt';
import { problems as newtonProblems } from '../calculus/problems/newton';
import { problems as taylorProblems } from '../calculus/problems/taylor';
import { problems as taylorThmProblems } from '../calculus/problems/taylor-thm';
import { problems as weierstrassFunctionProblems } from '../calculus/problems/weierstrass-function';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'diffcont': diffcontProblems,
  'discontinuous-derivative': discontinuousDerivativeProblems,
  'mvt': mvtProblems,
  'derivative-monotonicity': derivativeMonotonicityProblems,
  'inverse-function-theorem': inverseFunctionTheoremProblems,
  'cauchy-mvt': cauchyMvtProblems,
  'lhopital': lhopitalProblems,
  'darboux': darbouxProblems,
  'weierstrass-function': weierstrassFunctionProblems,
  'taylor': taylorProblems,
  'taylor-thm': taylorThmProblems,
  'convex': convexProblems,
  'newton': newtonProblems,
  'banach': banachProblems,
};
