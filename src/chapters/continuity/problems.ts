import type { ProblemMeta } from '../../contracts.ts';
import { additiveFunctionsProblems } from '../limits/problems/additive-functions';
import { monotoneDiscontinuitiesProblems } from '../limits/problems/monotone-discontinuities';
import { problems as continuityProblems } from '../limits/problems/continuity';
import { problems as continuityEquivalencesProblems } from '../limits/problems/continuity-equivalences';
import { problems as epsdeltaProblems } from '../limits/problems/epsdelta';
import { problems as evtProblems } from '../limits/problems/evt';
import { problems as ivtProblems } from '../limits/problems/ivt';
import { problems as thomaeProblems } from '../limits/problems/thomae';
import { problems as uniformContinuityProblems } from '../limits/problems/uniform-continuity';
import { problems as uniformProblems } from '../limits/problems/uniform';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'epsdelta': epsdeltaProblems,
  'continuity': continuityProblems,
  'thomae': thomaeProblems,
  'continuity-equivalences': continuityEquivalencesProblems,
  'monotone-discontinuities': monotoneDiscontinuitiesProblems,
  'uniform-continuity': uniformContinuityProblems,
  'ivt': ivtProblems,
  'evt': evtProblems,
  'additive-functions': additiveFunctionsProblems,
  'uniform': uniformProblems,
};
