import './style.css';
import { catalog } from './catalog';
import { localize, stripInlineMath, type Lang } from './contracts';
import { chapterUrl, errataUrl, fallbackLang, glossaryUrl, homeUrl, parsePath, pathsUrl } from './paths';
import { h } from './shell/dom';
import { langSwitcher, rememberLang, storedLang, tr } from './shell/i18n';
import { mountSearch } from './shell/search';

/**
 * A span holding a summary: the delimiter-stripped text shows immediately, and
 * once the tex module arrives the \(...\) spans are replaced by inline KaTeX.
 */
function summarySpan(text: string): HTMLSpanElement {
  const span = h('span', {}, stripInlineMath(text));
  if (text.includes('\\(')) {
    import('./shell/tex')
      .then((module) => module.renderRichText(span, text))
      .catch((error: unknown) => console.error(error));
  }
  return span;
}

/** Example questions under the home hero search: phrased as questions, since the semantic search answers those best. */
const SEARCH_EXAMPLES: Record<Lang, string[]> = {
  ko: ['급수가 수렴하는지 판정하는 방법', '가장 작은 상계', '울타리처럼 가두는 수열'],
  en: ['how to test whether a series converges', 'the smallest upper bound', 'a sequence fenced in on both sides'],
};

const BASE = import.meta.env.BASE_URL;
const root = document.getElementById('app');
if (!root) throw new Error('Could not find the #app element');

const parsed = parsePath(BASE, location.pathname);

// The bare home path (/) sends the visitor to their language's home.
if (parsed.lang === undefined) {
  location.replace(`${homeUrl(BASE, fallbackLang(storedLang()))}${location.search}`);
} else {
  const lang = parsed.lang;
  rememberLang(lang);
  document.documentElement.lang = lang;

  // The standalone pages (errata, glossary, paths) live on the home entry;
  // each renderer (and its data) loads as a separate chunk only for its route.
  const lazyPage = <T,>(load: () => Promise<T>, run: (module: T) => void): void => {
    load().then(run).catch((error: unknown) => console.error(error));
  };
  if (parsed.chapterId === 'errata') {
    lazyPage(() => import('./shell/errata-page'), (module) => module.renderErrataPage(root, lang));
  } else if (parsed.chapterId === 'glossary') {
    lazyPage(() => import('./shell/glossary-page'), (module) => module.renderGlossaryPage(root, lang));
  } else if (parsed.chapterId === 'paths') {
    // parsed.sceneId is the path id, if any.
    lazyPage(() => import('./shell/paths-page'), (module) => {
      if (parsed.sceneId) module.renderPathDetailPage(root, lang, parsed.sceneId);
      else module.renderPathsIndexPage(root, lang);
    });
  } else {
    const headerSearch = h('span', { class: 'header-search' });
    // Google-style hero search for the home page: a long, centered box
    // with three example questions as bubbles under it. The header keeps
    // its own compact search; both mount the same search behavior.
    const heroSearch = h('div', { class: 'hero-search-mount' });
    const exampleButtons = SEARCH_EXAMPLES[lang].map((question) =>
      h('button', { type: 'button', class: 'search-example' }, question),
    );
    const heroSection = h(
      'section',
      { class: 'home-search-hero' },
      heroSearch,
      h('div', { class: 'search-examples' }, ...exampleButtons),
    );
    const mapMount = h('div', { class: 'map-mount' });
    const mapSection = h(
      'section',
      { class: 'home-map' },
      h('h2', {}, tr(lang, 'map')),
      h('p', {}, tr(lang, 'mapIntro')),
      mapMount,
    );
    root.replaceChildren(
      h(
        'header',
        { class: 'home-header' },
        h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, 'Real Analysis'),
        h('a', { href: pathsUrl(BASE, lang), class: 'paths-link' }, tr(lang, 'paths')),
        h('a', { href: glossaryUrl(BASE, lang), class: 'glossary-link' }, tr(lang, 'glossary')),
        h('a', { href: errataUrl(BASE, lang), class: 'errata-link' }, tr(lang, 'errata')),
        headerSearch,
        langSwitcher(lang, (target) => homeUrl(BASE, target)),
      ),
      h(
        'main',
        { class: 'home' },
        h('h1', {}, 'Real Analysis'),
        h('p', {}, tr(lang, 'homeIntro')),
        heroSection,
        h(
          'ul',
          {},
          ...catalog.map((chapter, index) =>
            h(
              'li',
              {},
              // Chapter numbers are automatic: the catalog order is the numbering.
              h('a', { href: chapterUrl(BASE, lang, chapter.id) }, `${index + 1}. ${localize(chapter.title, lang)}`),
              ' — ',
              summarySpan(localize(chapter.summary, lang)),
            ),
          ),
        ),
        h('p', {}, h('a', { href: pathsUrl(BASE, lang) }, tr(lang, 'paths')), ' · ', h('a', { href: glossaryUrl(BASE, lang) }, tr(lang, 'glossary'))),
        mapSection,
      ),
    );
    mountSearch(headerSearch, lang);
    mountSearch(heroSearch, lang);
    const heroInput = heroSearch.querySelector('input');
    for (const button of exampleButtons) {
      button.addEventListener('click', () => {
        if (!heroInput) return;
        heroInput.value = button.textContent ?? '';
        heroInput.focus();
        heroInput.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
    // The concept map graph (and d3) stays out of the home entry chunk: it
    // loads only when the section scrolls into view.
    const bootMap = (): void => {
      import('./shell/map-page')
        .then((module) => module.mountConceptMap(mapMount, lang))
        .catch((error: unknown) => console.error(error));
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            bootMap();
          }
        },
        { rootMargin: '400px' },
      );
      observer.observe(mapSection);
    } else {
      bootMap();
    }
  }
}
