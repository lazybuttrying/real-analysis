import type { SceneLoader } from '../../contracts';

/**
 * Scene id → dynamic import. Scene code (including d3 and three) is split
 * into separate chunks at this boundary. The scene modules live in
 * the legacy scene store (../limits/scenes/).
 */
export const loaders: Readonly<Record<string, SceneLoader>> = {
  'logic-propositions': () => import('../limits/scenes/LogicPropositions').then((module) => module.default),
  'quantifiers': () => import('../limits/scenes/Quantifiers').then((module) => module.default),
  'direct-proof': () => import('../limits/scenes/DirectProof').then((module) => module.default),
  'contrapositive': () => import('../limits/scenes/Contrapositive').then((module) => module.default),
  'contradiction': () => import('../limits/scenes/Contradiction').then((module) => module.default),
  'cases-existence': () => import('../limits/scenes/CasesExistence').then((module) => module.default),
  'disproof-iff': () => import('../limits/scenes/DisproofIff').then((module) => module.default),
  'strong-induction': () => import('../limits/scenes/StrongInduction').then((module) => module.default),
  'relations-equivalence': () => import('../limits/scenes/RelationsEquivalence').then((module) => module.default),
  'function-proofs': () => import('../limits/scenes/FunctionProofs').then((module) => module.default),
};
