import { localize, type Lang, type LocalizedText } from '../contracts';
import { site } from '../site.config';
import { h } from './dom';

/**
 * Shell-owned strings (chrome, notices, errors) in every language.
 * Content strings live with the content, in meta.ts — this dictionary is only
 * for text the shell itself produces.
 */
export const STRINGS = {
  chapterMissing: {
    ko: '챕터 또는 #app 을 찾을 수 없습니다',
    en: 'Could not find the chapter or the #app element',
  },
  tocLabel: { ko: '목차', en: 'Contents' },
  loaderMissing: {
    ko: '씬의 로더가 등록되어 있지 않습니다',
    en: 'No loader is registered for this scene',
  },
  sceneNotFound: { ko: '씬을 찾을 수 없습니다', en: 'Scene not found' },
  sceneDisplayError: {
    ko: '이 씬을 표시하는 중 오류가 발생했습니다.',
    en: 'Something went wrong while displaying this scene.',
  },
  sceneLoadFailed: {
    ko: '씬을 불러오지 못했습니다. 새 버전이 배포되었을 수 있습니다.',
    en: 'The scene failed to load. A new version may have been deployed.',
  },
  reload: { ko: '새로고침', en: 'Reload' },
  homeIntro: site.homeIntro,
  problemsHeading: { ko: '예제', en: 'Examples & Exercises' },
  showProof: { ko: '증명 보기', en: 'Show proof' },
  showHint: { ko: '힌트 보기', en: 'Show hint' },
  showSolution: { ko: '풀이 보기', en: 'Show solution' },
  kindCompute: { ko: '계산형', en: 'Compute' },
  kindCounterexample: { ko: '반례형', en: 'Counterexample' },
  kindConcept: { ko: '개념 확인', en: 'Concept check' },
  answerLabel: { ko: '정답', en: 'Answer' },
  verdictLabel: { ko: '판정', en: 'Verdict' },
  constructionLabel: { ko: '반례 구성과 검증', en: 'Counterexample and verification' },
  chooseOne: { ko: '하나를 고르세요', en: 'Choose one' },
  correctFeedback: { ko: '정답입니다', en: 'Correct' },
  wrongFeedback: { ko: '오답입니다', en: 'Not quite' },
  showExplanation: { ko: '해설 보기', en: 'Show explanation' },
  exercises: { ko: '연습문제', en: 'Exercises' },
  exercisesIntro: {
    ko: '이 장의 내용을 확인하는 연습문제이다. 풀이는 접어서 두었으니 먼저 스스로 풀어 보자.',
    en: 'Problems to check your understanding of this chapter. The solutions are folded away — try them yourself first.',
  },
  exercisesLinkLabel: { ko: '연습문제 풀어보기', en: 'Work the exercises' },
  exercisesLoadFailed: {
    ko: '연습문제를 불러오지 못했습니다. 새 버전이 배포되었을 수 있습니다.',
    en: 'The exercises failed to load. A new version may have been deployed.',
  },
  difficultyEasy: { ko: '쉬움', en: 'Easy' },
  difficultyMedium: { ko: '보통', en: 'Medium' },
  difficultyHard: { ko: '어려움', en: 'Hard' },
  searchExerciseKind: { ko: '연습문제', en: 'Exercise' },
  prevScene: { ko: '이전', en: 'Previous' },
  nextScene: { ko: '다음', en: 'Next' },
  searchPlaceholder: { ko: '검색', en: 'Search' },
  searchLabel: { ko: '사이트 검색', en: 'Search the site' },
  searchNoResults: { ko: '검색 결과가 없습니다', en: 'No results' },
  searchClarifyLabel: { ko: '어느 쪽에 가까워?', en: 'Which is closer?' },
  searchSimilarity: { ko: '유사도', en: 'similarity' },
  searchSceneKind: { ko: '씬', en: 'Scene' },
  searchTermKind: { ko: '용어', en: 'Term' },
  glossary: { ko: '용어 사전', en: 'Glossary' },
  glossaryIntro: {
    ko: '씬에서 등장한 핵심 용어를 챕터별로 모았다. 각 용어는 처음 소개된 씬으로 연결된다.',
    en: 'Key terms from the scenes, grouped by chapter. Each term links to the scene where it is introduced.',
  },
  glossaryFilterPlaceholder: { ko: '용어 검색…', en: 'Filter terms…' },
  errata: { ko: '정오표', en: 'Errata' },
  errataIntro: {
    ko: '내용과 표기에서 발견된 오류와 그 수정 내역이다. 고친 날짜 순으로 쌓인다.',
    en: 'Errors found in the content and notation, and what was fixed. Listed newest first.',
  },
  errataAsOf: { ko: '현재 판 기준일', en: 'Current edition as of' },
  errataEmpty: { ko: '아직 등록된 정오가 없다.', en: 'No corrections recorded yet.' },
  errataSiteWide: { ko: '사이트 전체', en: 'Site-wide' },
  errataReport: {
    ko: '오류를 찾으면 GitHub 이슈로 알려 달라. 씬 주소와 잘못된 내용을 적어 주면 확인해서 이 표에 올린다.',
    en: 'Found an error? Report it as a GitHub issue with the scene URL and what looks wrong, and it will be checked and added to this list.',
  },
  errataReportLink: { ko: '오류 신고하기', en: 'Report an error' },
  paths: { ko: '학습 경로', en: 'Learning Paths' },
  pathsIntro: {
    ko: '주제별로 엮은 씬들의 guided tour. 순서대로 따라가면 개념이 자연스럽게 쌓인다.',
    en: 'Guided tours through the scenes, grouped by theme. Follow them in order and the ideas build up naturally.',
  },
  pathsSceneCount: { ko: '개의 씬', en: ' scenes' },
  partOfPaths: { ko: '이 씬이 포함된 학습 경로', en: 'Part of these learning paths' },
  pathNotFound: { ko: '학습 경로를 찾을 수 없습니다', en: 'Learning path not found' },
  map: { ko: '개념 지도', en: 'Concept Map' },
  mapIntro: site.mapIntro,
  mapPrereq: { ko: '선수 관계', en: 'Prerequisite' },
  mapPathOrder: { ko: '학습 경로 순서', en: 'Learning-path order' },
  mapResetView: { ko: '보기 초기화', en: 'Reset view' },
  playbackLabel: { ko: '자동 재생', en: 'Autoplay' },
  playbackPlay: { ko: '▶ 재생', en: '▶ Play' },
  playbackPause: { ko: '⏸ 정지', en: '⏸ Pause' },
  playbackInterval: { ko: '간격', en: 'Interval' },
  playbackLoop: { ko: '반복', en: 'Loop' },
  playbackTarget: { ko: '대상', en: 'Target' },
} satisfies Record<string, LocalizedText>;

type StringKey = keyof typeof STRINGS;

export function tr(lang: Lang, key: StringKey): string {
  return localize(STRINGS[key], lang);
}

const LANG_STORAGE_KEY = 'lang';

export function storedLang(): string | null {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function rememberLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage can be unavailable (private mode, file protocol); the URL still carries the language.
  }
}

/**
 * The KO | EN switcher. Switching is a plain navigation to the same page in the
 * other language (chapter, scene, and query string are preserved by the caller
 * in `urlFor`), because the language is part of the path.
 */
export function langSwitcher(lang: Lang, urlFor: (lang: Lang) => string): HTMLElement {
  const item = (target: Lang, label: string): HTMLElement =>
    target === lang
      ? h('span', { 'aria-current': 'true' }, label)
      : h('a', { href: urlFor(target), hrefLang: target }, label);
  return h('span', { class: 'lang-switch', role: 'group', 'aria-label': 'Language' }, item('ko', 'KO'), ' | ', item('en', 'EN'));
}
