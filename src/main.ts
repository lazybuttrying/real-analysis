import './style.css';
import { catalog } from './catalog';
import { localize, stripInlineMath } from './contracts';
import { chapterUrl, fallbackLang, glossaryUrl, homeUrl, parsePath, pathsUrl } from './paths';
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

  if (parsed.chapterId === 'glossary') {
    // The glossary page lives on the home entry; its renderer (and the
    // glossary data) loads as a separate chunk only for this route.
    import('./shell/glossary-page')
      .then((module) => module.renderGlossaryPage(root, lang))
      .catch((error: unknown) => console.error(error));
  } else if (parsed.chapterId === 'paths') {
    // Same treatment as the glossary: the paths pages live on the home
    // entry, and their renderer (plus the paths data) loads as a separate
    // chunk only for these routes. parsed.sceneId is the path id, if any.
    import('./shell/paths-page')
      .then((module) => {
        if (parsed.sceneId) module.renderPathDetailPage(root, lang, parsed.sceneId);
        else module.renderPathsIndexPage(root, lang);
      })
      .catch((error: unknown) => console.error(error));
  } else {
    const headerSearch = h('span', { class: 'header-search' });
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
        headerSearch,
        langSwitcher(lang, (target) => homeUrl(BASE, target)),
      ),
      h(
        'main',
        { class: 'home' },
        h('h1', {}, 'Real Analysis'),
        h('p', {}, tr(lang, 'homeIntro')),
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
