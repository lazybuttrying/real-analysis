import { catalog } from '../catalog.ts';
import { localize, type Lang } from '../contracts.ts';
import { ERRATA_AS_OF, ERRATA_REPORT_URL, errata } from '../errata.ts';
import { sceneUrl } from '../paths.ts';
import { site } from '../site.config.ts';
import { h } from './dom.ts';
import { tr } from './i18n.ts';
import { pageHeader } from './search.ts';

const BASE = import.meta.env.BASE_URL;

/**
 * Client-side render of /<lang>/errata/. The prerender step writes an
 * equivalent static page so the log is readable with zero JS.
 */
export function renderErrataPage(root: HTMLElement, lang: Lang): void {
  document.title = `${tr(lang, 'errata')} | ${site.name.en}`;

  const header = pageHeader(lang);
  const main = h('main', { class: 'home errata' });
  main.append(
    h('h1', {}, tr(lang, 'errata')),
    h('p', {}, tr(lang, 'errataIntro')),
    h('p', { class: 'errata-asof' }, `${tr(lang, 'errataAsOf')}: ${ERRATA_AS_OF}`),
  );

  if (errata.length === 0) {
    main.append(h('p', {}, tr(lang, 'errataEmpty')));
  } else {
    const entries = [...errata].sort((a, b) => (a.date < b.date ? 1 : -1));
    const list = h('div', { class: 'errata-list' });
    for (const entry of entries) {
      const article = h('article', { class: 'errata-entry', id: `errata-${entry.id}` });
      const meta = h('p', { class: 'errata-meta' }, h('time', { datetime: entry.date }, entry.date));
      if (entry.chapterId && entry.sceneId) {
        const chapter = catalog.find((c) => c.id === entry.chapterId);
        const scene = chapter?.scenes.find((s) => s.id === entry.sceneId);
        if (chapter && scene) {
          meta.append(
            ' — ',
            h('a', { href: sceneUrl(BASE, lang, chapter.id, scene.id) }, `${localize(chapter.title, lang)} — ${localize(scene.title, lang)}`),
          );
        }
      } else {
        meta.append(' — ', tr(lang, 'errataSiteWide'));
      }
      article.append(meta, h('h2', {}, localize(entry.title, lang)), h('p', {}, localize(entry.detail, lang)));
      list.append(article);
    }
    main.append(list);
  }

  main.append(
    h(
      'section',
      { class: 'errata-report' },
      h('p', {}, tr(lang, 'errataReport')),
      h('p', {}, h('a', { href: ERRATA_REPORT_URL, target: '_blank', rel: 'noreferrer' }, tr(lang, 'errataReportLink'))),
    ),
  );

  root.replaceChildren(header, main);
}
