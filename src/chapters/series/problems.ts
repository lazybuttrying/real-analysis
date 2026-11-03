import type { ProblemMeta } from '../../contracts.ts';
import { condensationProblems } from './problems/condensation';
import { eulerMascheroniProblems } from './problems/euler-mascheroni';
import { eulerProductProblems } from './problems/euler-product';
import { kummerTestProblems } from './problems/kummer-test';
import { problems as abelTestProblems } from './problems/abel-test';
import { problems as baselProblems } from './problems/basel';
import { problems as dirichletTestProblems } from './problems/dirichlet-test';
import { doubleSeriesProblems } from './problems/double-series';
import { convergenceAtlasProblems } from './problems/convergence-atlas';
import { problems as geometricProblems } from './problems/geometric';
import { problems as grandiProblems } from './problems/grandi';
import { problems as harmonicProblems } from './problems/harmonic';
import { integralTestProblems } from './problems/integral-test';
import { problems as leibnizProblems } from './problems/leibniz';
import { problems as raabeTestProblems } from './problems/raabe-test';
import { problems as stirlingProblems } from './problems/stirling';
import { problems as telescopingProblems } from './problems/telescoping';
import { problems as testsProblems } from './problems/tests';
import { problems as wallisProblems } from './problems/wallis';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'harmonic': harmonicProblems,
  'euler-mascheroni': eulerMascheroniProblems,
  'basel': baselProblems,
  'euler-product': eulerProductProblems,
  'leibniz': leibnizProblems,
  'tests': testsProblems,
  'integral-test': integralTestProblems,
  'raabe-test': raabeTestProblems,
  'kummer-test': kummerTestProblems,
  'condensation': condensationProblems,
  'telescoping': telescopingProblems,
  'geometric': geometricProblems,
  'wallis': wallisProblems,
  'stirling': stirlingProblems,
  'grandi': grandiProblems,
  'dirichlet-test': dirichletTestProblems,
  'abel-test': abelTestProblems,
  'double-series': doubleSeriesProblems,
  'convergence-atlas': convergenceAtlasProblems,
};
