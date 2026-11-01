import type { ProblemMeta } from '../../contracts.ts';
import { arzelaAscoliProblems } from '../limits/problems/arzela-ascoli';
import { muntzSzaszProblems } from '../limits/problems/muntz-szasz';
import { problems as weierstrassApproxProblems } from '../limits/problems/weierstrass-approx';
import { stoneWeierstrassProblems } from '../limits/problems/stone-weierstrass';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'arzela-ascoli': arzelaAscoliProblems,
  'weierstrass-approx': weierstrassApproxProblems,
  'stone-weierstrass': stoneWeierstrassProblems,
  'muntz-szasz': muntzSzaszProblems,
};
