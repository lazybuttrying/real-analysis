import './style.css';
import { catalog } from './catalog';
import { localize, stripInlineMath } from './contracts';
import { chapterUrl, fallbackLang, homeUrl, parsePath } from './paths';
import { h } from './shell/dom';
import { langSwitcher, rememberLang, storedLang, tr } from './shell/i18n';

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

  root.replaceChildren(
    h(
      'header',
      { class: 'home-header' },
      h('span', { class: 'site-title' }, 'Real Analysis'),
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
    ),
  );
}
