import type { ProblemMeta } from '../../contracts.ts';
import { doubleSequencesProblems } from '../limits/problems/double-sequences';
import { problems as bolzanoWeierstrassProblems } from '../limits/problems/bolzano-weierstrass';
import { problems as cauchySchwarzProblems } from '../limits/problems/cauchy-schwarz';
import { problems as constructionProblems } from '../limits/problems/construction';
import { problems as epsilonNProblems } from '../limits/problems/epsilon-n';
import { problems as holesProblems } from '../limits/problems/holes';
import { holderProblems } from '../limits/problems/holder';
import { problems as limsupLiminfProblems } from '../limits/problems/limsup-liminf';
import { problems as monotoneCauchyProblems } from '../limits/problems/monotone-cauchy';
import { boundedProblems } from '../limits/problems/bounded';
import { innerProductProblems } from '../limits/problems/inner-product';
import { normProblems } from '../limits/problems/norm';
import { squeezeProblems } from '../limits/problems/squeeze';
import { subsequenceProblems } from '../limits/problems/subsequence';
import { parallelogramLawProblems } from '../limits/problems/parallelogram-law';
import { problems as sequenceSpacesProblems } from '../limits/problems/sequence-spaces';
import { problems as standardLimitsProblems } from '../limits/problems/standard-limits';
import { problems as stolzCesaroProblems } from '../limits/problems/stolz-cesaro';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'epsilon-n': epsilonNProblems,
  'squeeze': squeezeProblems,
  'standard-limits': standardLimitsProblems,
  'norm': normProblems,
  'inner-product': innerProductProblems,
  'sequence-spaces': sequenceSpacesProblems,
  'cauchy-schwarz': cauchySchwarzProblems,
  'holder': holderProblems,
  'parallelogram-law': parallelogramLawProblems,
  'holes': holesProblems,
  'construction': constructionProblems,
  'bounded': boundedProblems,
  'subsequence': subsequenceProblems,
  'bolzano-weierstrass': bolzanoWeierstrassProblems,
  'monotone-cauchy': monotoneCauchyProblems,
  'limsup-liminf': limsupLiminfProblems,
  'stolz-cesaro': stolzCesaroProblems,
  'double-sequences': doubleSequencesProblems,
};
