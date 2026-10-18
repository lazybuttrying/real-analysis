import type { LocalizedText } from './contracts.ts';

/**
 * Hand-authored learning paths: curated guided tours through the scenes,
 * grouped by theme. Pure data: no code, no DOM, no imports beyond types.
 * Read by the prerender script (Node) and the client-side paths pages.
 *
 * Conventions (same as meta.ts and glossary.ts): Korean lives only inside
 * `ko:` strings; inline math uses \(...\) delimiters (never $...$); every
 * step links to a real scene via chapterId + sceneId (verified by tests and
 * the prerender self-check). Steps are in the recommended reading order.
 */
export interface LearningPathStep {
  chapterId: string;
  sceneId: string;
}

export interface LearningPath {
  /** Stable kebab-case id, unique across paths. Used in /<lang>/paths/<id>/ URLs. */
  id: string;
  title: LocalizedText;
  /** One or two sentences. May embed \(...\) inline math. */
  description: LocalizedText;
  /** Ordered scenes of this path. */
  scenes: ReadonlyArray<LearningPathStep>;
}

export const learningPaths: readonly LearningPath[] = [
  {
    id: 'number-systems',
    title: { ko: '수 체계 완성하기', en: 'Building the Number Systems' },
    description: {
      ko: String.raw`자연수에서 칸토어 집합까지 — 수 체계를 하나씩 쌓아 올리는 여정. \(\mathbb{N} \to \mathbb{Z} \to \mathbb{Q} \to \mathbb{R}\)의 빈틈을 메우는 과정을 따라간다.`,
      en: String.raw`From natural numbers to the Cantor set — building the number systems one by one, filling the gaps from \(\mathbb{N}\) to \(\mathbb{R}\).`,
    },
    scenes: [
      { chapterId: 'limits', sceneId: 'natural-numbers' },
      { chapterId: 'limits', sceneId: 'binomial' },
      { chapterId: 'limits', sceneId: 'integers-rationals' },
      { chapterId: 'limits', sceneId: 'sets' },
      { chapterId: 'limits', sceneId: 'supremum' },
      { chapterId: 'limits', sceneId: 'countable' },
      { chapterId: 'limits', sceneId: 'holes' },
      { chapterId: 'limits', sceneId: 'construction' },
      { chapterId: 'limits', sceneId: 'cantor' },
    ],
  },
  {
    id: 'convergence-tests',
    title: { ko: '수렴 판정 정복', en: 'Mastering Convergence Tests' },
    description: {
      ko: '급수가 수렴하는지 판정하는 도구들을 순서대로 익힌다. 조화급수의 발산에서 시작해 정밀 판정법까지.',
      en: 'Master the convergence tests in order, from the divergence of the harmonic series to the delicate tests.',
    },
    scenes: [
      { chapterId: 'series', sceneId: 'harmonic' },
      { chapterId: 'series', sceneId: 'euler-mascheroni' },
      { chapterId: 'series', sceneId: 'tests' },
      { chapterId: 'series', sceneId: 'condensation' },
      { chapterId: 'series', sceneId: 'raabe-test' },
      { chapterId: 'series', sceneId: 'kummer-test' },
      { chapterId: 'series', sceneId: 'dirichlet-test' },
      { chapterId: 'series', sceneId: 'abel-test' },
      { chapterId: 'series', sceneId: 'm-test' },
      { chapterId: 'series', sceneId: 'dini' },
      { chapterId: 'series', sceneId: 'abel-theorem' },
      { chapterId: 'series', sceneId: 'riemann-rearrangement' },
    ],
  },
  {
    id: 'differentiation',
    title: { ko: '미분', en: 'Differentiation' },
    description: {
      ko: '엡실론-델타에서 시작해 미분의 핵심 정리들을 따라간다. 평균값 정리와 로피탈, 테일러까지.',
      en: "From epsilon-delta through the great theorems of differentiation: the mean value theorem, l'Hôpital, Taylor.",
    },
    scenes: [
      { chapterId: 'limits', sceneId: 'epsdelta' },
      { chapterId: 'limits', sceneId: 'continuity' },
      { chapterId: 'calculus', sceneId: 'diffcont' },
      { chapterId: 'calculus', sceneId: 'mvt' },
      { chapterId: 'calculus', sceneId: 'cauchy-mvt' },
      { chapterId: 'calculus', sceneId: 'darboux' },
      { chapterId: 'calculus', sceneId: 'lhopital' },
      { chapterId: 'calculus', sceneId: 'taylor-thm' },
      { chapterId: 'calculus', sceneId: 'convex' },
    ],
  },
  {
    id: 'integration',
    title: { ko: '적분', en: 'Integration' },
    description: {
      ko: '리만 적분에서 르베그 적분까지 — 적분의 개념이 어떻게 확장되는지 따라간다.',
      en: 'From the Riemann integral to the Lebesgue integral — how the idea of integration expands.',
    },
    scenes: [
      { chapterId: 'calculus', sceneId: 'riemann' },
      { chapterId: 'calculus', sceneId: 'ftc' },
      { chapterId: 'series', sceneId: 'improper' },
      { chapterId: 'series', sceneId: 'gamma' },
      { chapterId: 'series', sceneId: 'bohr-mollerup' },
      { chapterId: 'series', sceneId: 'beta-function' },
      { chapterId: 'calculus', sceneId: 'measure' },
      { chapterId: 'calculus', sceneId: 'lebesgue' },
      { chapterId: 'calculus', sceneId: 'absolute-continuity' },
    ],
  },
  {
    id: 'pathological',
    title: { ko: '병리적 함수들', en: 'Pathological Functions' },
    description: {
      ko: '직관을 깨뜨리는 함수들의 전시관. 연속이지만 미분 불가능하고, 기울기가 0인데 올라가는 함수들.',
      en: 'A gallery of intuition-breaking functions: continuous but nowhere differentiable, flat yet climbing.',
    },
    scenes: [
      { chapterId: 'limits', sceneId: 'cantor' },
      { chapterId: 'limits', sceneId: 'cantor-function' },
      { chapterId: 'calculus', sceneId: 'weierstrass-function' },
      { chapterId: 'calculus', sceneId: 'bounded-variation' },
      { chapterId: 'calculus', sceneId: 'darboux' },
      { chapterId: 'limits', sceneId: 'weierstrass-approx' },
      { chapterId: 'limits', sceneId: 'uniform' },
    ],
  },
  {
    id: 'completeness',
    title: { ko: '완비성과 컴팩트', en: 'Completeness and Compactness' },
    description: {
      ko: '완비성과 컴팩트성 — 해석학의 무대가 되는 공간들의 이야기. 축소사상부터 균등연속까지.',
      en: 'Completeness and compactness — the spaces where analysis happens, from contractions to uniform continuity.',
    },
    scenes: [
      { chapterId: 'limits', sceneId: 'metric-spaces' },
      { chapterId: 'limits', sceneId: 'contraction' },
      { chapterId: 'limits', sceneId: 'baire-category' },
      { chapterId: 'calculus', sceneId: 'banach' },
      { chapterId: 'limits', sceneId: 'compact' },
      { chapterId: 'limits', sceneId: 'bolzano-weierstrass' },
      { chapterId: 'limits', sceneId: 'evt' },
      { chapterId: 'limits', sceneId: 'uniform-continuity' },
    ],
  },
];
