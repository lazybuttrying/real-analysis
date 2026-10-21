import { catalog } from '../catalog.ts';
import { localize, stripInlineMath, type Lang } from '../contracts.ts';
import { learningPaths, type LearningPath } from '../learning-paths.ts';
import { pathDetailUrl, pathsUrl, sceneUrl } from '../paths.ts';
import { site } from '../site.config.ts';
import { h } from './dom.ts';
import { tr } from './i18n.ts';
import { pageHeader } from './search.ts';

const BASE = import.meta.env.BASE_URL;

/**
 * A span holding a description: the delimiter-stripped text shows immediately,
 * and once the tex module arrives the \(...\) spans are replaced by inline KaTeX.
 * (Same pattern as the glossary page's definitionSpan.)
 */
function descriptionSpan(text: string): HTMLSpanElement {
  const span = h('span', {}, stripInlineMath(text));
  if (text.includes('\\(')) {
    import('./tex')
      .then((module) => module.renderRichText(span, text))
      .catch((error: unknown) => console.error(error));
  }
  return span;
}

/** chapterId/sceneId -> the scene's chapter number, chapter title, and scene title. */
const sceneOf = new Map<string, { number: number; chapterTitle: (lang: Lang) => string; title: (lang: Lang) => string }>();
for (const [chapterIndex, chapter] of catalog.entries()) {
  for (const scene of chapter.scenes) {
    sceneOf.set(`${chapter.id}/${scene.id}`, {
      number: chapterIndex + 1,
      chapterTitle: (lang: Lang) => localize(chapter.title, lang),
      title: (lang: Lang) => localize(scene.title, lang),
    });
  }
}

function sceneCountLabel(path: LearningPath, lang: Lang): string {
  return `${path.scenes.length}${tr(lang, 'pathsSceneCount')}`;
}

/**
 * Client-side render of /<lang>/paths/. The prerender step writes an
 * equivalent static page (same cards) so the content is readable with zero
 * JS; the SPA replaces it on boot.
 */
export function renderPathsIndexPage(root: HTMLElement, lang: Lang): void {
  document.title = `${tr(lang, 'paths')} | ${site.name.en}`;

  const main = h('main', { class: 'home paths' });
  main.append(h('h1', {}, tr(lang, 'paths')), h('p', {}, tr(lang, 'pathsIntro')));

  for (const path of learningPaths) {
    main.append(
      h(
        'article',
        { class: 'path-card' },
        h('h2', {}, h('a', { href: pathDetailUrl(BASE, lang, path.id) }, localize(path.title, lang))),
        h('p', {}, descriptionSpan(localize(path.description, lang))),
        h('p', { class: 'path-card-meta' }, sceneCountLabel(path, lang)),
      ),
    );
  }

  root.replaceChildren(pageHeader(lang), main);
}

/**
 * Client-side render of /<lang>/paths/<id>/. Unknown ids fall back to a
 * not-found notice linking back to the index.
 */
export function renderPathDetailPage(root: HTMLElement, lang: Lang, pathId: string): void {
  const path = learningPaths.find((candidate) => candidate.id === pathId);

  const main = h('main', { class: 'home paths' });
  if (!path) {
    document.title = `${tr(lang, 'pathNotFound')} | ${site.name.en}`;
    main.append(
      h('h1', {}, tr(lang, 'pathNotFound')),
      h('p', {}, h('a', { href: pathsUrl(BASE, lang) }, tr(lang, 'paths'))),
    );
    root.replaceChildren(pageHeader(lang), main);
    return;
  }

  document.title = `${localize(path.title, lang)} | ${site.name.en}`;
  main.append(
    h('p', { class: 'path-back' }, h('a', { href: pathsUrl(BASE, lang) }, `← ${tr(lang, 'paths')}`)),
    h('h1', {}, localize(path.title, lang)),
    h('p', {}, descriptionSpan(localize(path.description, lang))),
    h(
      'ol',
      { class: 'path-steps' },
      ...path.scenes.map((step, index) => {
        const scene = sceneOf.get(`${step.chapterId}/${step.sceneId}`);
        if (!scene) {
          return h('li', { value: String(index + 1) }, step.sceneId);
        }
        return h(
          'li',
          { value: String(index + 1) },
          h('a', { href: sceneUrl(BASE, lang, step.chapterId, step.sceneId) }, scene.title(lang)),
          h('span', { class: 'path-step-chapter' }, ` — ${scene.number}. ${scene.chapterTitle(lang)}`),
        );
      }),
    ),
  );

  root.replaceChildren(pageHeader(lang), main);
}
