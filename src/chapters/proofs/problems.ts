import type { ProblemMeta } from '../../contracts.ts';
import { logicPropositionsProblems } from '../limits/problems/logic-propositions';
import { quantifiersProblems } from '../limits/problems/quantifiers';
import { directProofProblems } from '../limits/problems/direct-proof';
import { contrapositiveProblems } from '../limits/problems/contrapositive';
import { contradictionProblems } from '../limits/problems/contradiction';
import { casesExistenceProblems } from '../limits/problems/cases-existence';
import { disproofIffProblems } from '../limits/problems/disproof-iff';
import { strongInductionProblems } from '../limits/problems/strong-induction';
import { relationsEquivalenceProblems } from '../limits/problems/relations-equivalence';
import { functionProofsProblems } from '../limits/problems/function-proofs';

/**
 * Per-scene problems data for this chapter, as a scene id keyed map.
 * Kept out of meta.ts so the client shell can load it on demand:
 * the chapter entry passes a dynamic import of this module to
 * startChapter, and the full catalog (Node consumers, prerender,
 * tests) reattaches these lists to the scene metas in catalog.ts.
 */
export const problemsByScene: Readonly<Record<string, readonly ProblemMeta[]>> = {
  'logic-propositions': logicPropositionsProblems,
  'quantifiers': quantifiersProblems,
  'direct-proof': directProofProblems,
  'contrapositive': contrapositiveProblems,
  'contradiction': contradictionProblems,
  'cases-existence': casesExistenceProblems,
  'disproof-iff': disproofIffProblems,
  'strong-induction': strongInductionProblems,
  'relations-equivalence': relationsEquivalenceProblems,
  'function-proofs': functionProofsProblems,
};
