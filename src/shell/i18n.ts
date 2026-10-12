import { localize, type Lang, type LocalizedText } from '../contracts';
import { h } from './dom';

/**
 * Shell-owned strings (chrome, notices, errors) in every language.
 * Content strings live with the content, in meta.ts — this dictionary is only
 * for text the shell itself produces.
 */
export const STRINGS = {
  appMissing: { ko: '#app 을 찾을 수 없습니다', en: 'Could not find the #app element' },
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
  homeIntro: {
    ko: '해석학의 개념을 직접 움직여 보며 익히는 인터랙티브 시각화 모음입니다.',
    en: 'Interactive visualizations for learning the ideas of real analysis by moving them yourself.',
  },
} satisfies Record<string, LocalizedText>;

export type StringKey = keyof typeof STRINGS;

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
