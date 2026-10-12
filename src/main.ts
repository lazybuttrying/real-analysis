import './style.css';
import { catalog } from './catalog';
import { localize } from './contracts';
import { chapterUrl, fallbackLang, homeUrl, parsePath } from './paths';
import { h } from './shell/dom';
import { langSwitcher, rememberLang, storedLang, tr } from './shell/i18n';

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
        ...catalog.map((chapter) =>
          h(
            'li',
            {},
            h('a', { href: chapterUrl(BASE, lang, chapter.id) }, localize(chapter.title, lang)),
            ` — ${localize(chapter.summary, lang)}`,
          ),
        ),
      ),
    ),
  );
}
