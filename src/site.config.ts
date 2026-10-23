import type { LocalizedText } from './contracts';

/**
 * Site identity for this app: the values the shared template engine
 * (src/shell/*, src/view/*, scripts/prerender-factory.ts) reads instead of
 * hardcoding a site name, base path, or storage key. Owned by the site —
 * the template sync never overwrites this file.
 */
export const site: {
  name: LocalizedText;
  /** Deployment base path; the prerender's SITE_BASE default. */
  base: string;
  /** sessionStorage key for the scene-host chunk-reload guard. */
  reloadFlag: string;
  /** Home-page intro line (shell string, kept per site). */
  homeIntro: LocalizedText;
  /** Concept-map intro line (shell string, kept per site). */
  mapIntro: LocalizedText;
} = {
  name: { ko: 'Real Analysis', en: 'Real Analysis' },
  base: '/lecture/real-analysis/',
  reloadFlag: 'real-analysis:chunk-reload',
  homeIntro: {
    ko: '해석학의 개념을 직접 움직여 보며 익히는 인터랙티브 시각화 모음입니다.',
    en: 'Interactive visualizations for learning the ideas of real analysis by moving them yourself.',
  },
  mapIntro: {
    ko: '102개 씬을 선수 관계로 엮은 지도. 노드를 드래그하고 확대해 보세요. 노드를 클릭하면 해당 씬으로 이동합니다.',
    en: 'All 102 scenes linked by prerequisite relations. Drag nodes, zoom in, and click a node to open its scene.',
  },
};

/** Content expectations the prerender self-check enforces (see scripts/prerender.ts). */
export const prerenderExpectations: {
  totalExercises: number;
  totalExercisesDetail?: string;
  minConceptMapEdges: number;
  legacyPages: number;
  legacyPagesDetail?: string;
} = {
  totalExercises: 36,
  minConceptMapEdges: 40,
  legacyPages: 79,
  legacyPagesDetail: 'limits 39 + calculus 24 + moved series 16',
};
