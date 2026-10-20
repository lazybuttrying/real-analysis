import { catalog } from '../catalog.ts';
import { glossary } from '../glossary.ts';
import { localize, stripInlineMath, type Lang } from '../contracts.ts';
import { chapterUrl, homeUrl, parsePath, sceneUrl, withLang } from '../paths.ts';
import { site } from '../site.config.ts';
import { h } from './dom.ts';
import { langSwitcher, tr } from './i18n.ts';
import { mountSearch } from './search.ts';

const BASE = import.meta.env.BASE_URL;

/**
 * A span holding a definition: the delimiter-stripped text shows immediately,
 * and once the tex module arrives the \(...\) spans are replaced by inline KaTeX.
 */
function definitionSpan(text: string): HTMLSpanElement {
  const span = h('span', {}, stripInlineMath(text));
  if (text.includes('\\(')) {
    import('./tex')
      .then((module) => module.renderRichText(span, text))
      .catch((error: unknown) => console.error(error));
  }
  return span;
}

/**
 * Client-side render of /<lang>/glossary/. The prerender step writes an
 * equivalent static page (same grouping, same anchors) so the content is
 * readable with zero JS; the SPA replaces it on boot and adds the live filter.
 */
export function renderGlossaryPage(root: HTMLElement, lang: Lang): void {
  document.title = `${tr(lang, 'glossary')} | ${site.name.en}`;

  const headerSearch = h('span', { class: 'header-search' });
  const header = h(
    'header',
    { class: 'home-header' },
    h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, site.name.en),
    headerSearch,
    langSwitcher(lang, (target) => withLang(BASE, parsePath(BASE, location.pathname), target)),
  );
  mountSearch(headerSearch, lang);

  const main = h('main', { class: 'home glossary' });
  main.append(h('h1', {}, tr(lang, 'glossary')), h('p', {}, tr(lang, 'glossaryIntro')));

  const filter = h('input', {
    type: 'search',
    class: 'glossary-filter',
    placeholder: tr(lang, 'glossaryFilterPlaceholder'),
    'aria-label': tr(lang, 'glossaryFilterPlaceholder'),
  });
  main.append(filter);

  const articles: Array<{ article: HTMLElement; haystack: string }> = [];
  for (const [chapterIndex, chapter] of catalog.entries()) {
    const terms = glossary.filter((entry) => entry.chapterId === chapter.id);
    if (terms.length === 0) continue;
    const chapterNumber = chapterIndex + 1;
    const section = h('section', { class: 'glossary-chapter' });
    section.append(
      h(
        'h2',
        {},
        h('a', { href: chapterUrl(BASE, lang, chapter.id) }, `${chapterNumber}. ${localize(chapter.title, lang)}`),
      ),
    );
    for (const entry of terms) {
      const termText = localize(entry.term, lang);
      const definitionText = localize(entry.definition, lang);
      const sceneTitle = chapter.scenes.find((scene) => scene.id === entry.sceneId);
      const article = h(
        'article',
        { class: 'glossary-term', id: `term-${entry.id}` },
        h('h3', {}, stripInlineMath(termText)),
        h('p', {}, definitionSpan(definitionText)),
        h(
          'p',
          { class: 'glossary-scene-link' },
          h(
            'a',
            { href: sceneUrl(BASE, lang, entry.chapterId, entry.sceneId) },
            sceneTitle ? localize(sceneTitle.title, lang) : entry.sceneId,
          ),
        ),
      );
      section.append(article);
      articles.push({
        article,
        haystack: `${stripInlineMath(termText)}\n${stripInlineMath(definitionText)}`.toLowerCase(),
      });
    }
    main.append(section);
  }

  filter.addEventListener('input', () => {
    const query = filter.value.trim().toLowerCase();
    for (const { article, haystack } of articles) {
      article.hidden = query.length > 0 && !haystack.includes(query);
    }
    for (const section of main.querySelectorAll<HTMLElement>('section.glossary-chapter')) {
      const visible = [...section.querySelectorAll<HTMLElement>('article.glossary-term')].some((a) => !a.hidden);
      section.hidden = !visible;
    }
  });

  root.replaceChildren(header, main);

  // Deep link from search results (#term-<id>): scroll once the page is up.
  if (location.hash.startsWith('#term-')) {
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView();
  }
}
