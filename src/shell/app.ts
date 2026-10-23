import '../style.css';
import { catalog } from '../catalog';
import { site } from '../site.config';
import { localize, stripInlineMath, type AnySceneModule, type ChapterMeta, type ControlState, type ExerciseMeta, type Lang, type SceneLoader, type SceneMeta } from '../contracts';
import { learningPaths } from '../learning-paths';
import { chapterUrl, exercisesUrl, fallbackLang, glossaryUrl, homeUrl, parsePath, pathDetailUrl, pathsUrl, sceneUrl, withLang } from '../paths';
import { parseState, serializeState } from '../state';
import { buildControls } from './controls';
import { h } from './dom';
import { langSwitcher, rememberLang, storedLang, tr } from './i18n';
import { domKindFragments, problemCardBlocks, problemKind } from './kind-ui';
import { disposeExercisesPage, exercisesPageTitle, renderExercisesPage } from './exercises-page';
import { mountMiniViz, SceneHost } from './scene-host';
import { mountSearch } from './search';

const BASE = import.meta.env.BASE_URL;
const URL_SYNC_DELAY_MS = 200;

type Loaders = Readonly<Record<string, SceneLoader>>;

/** Loads the chapter's exercise data on demand (dynamic import keeps the text out of the chapter entry bundle). */
type ExercisesLoader = () => Promise<readonly ExerciseMeta[]>;

/** Called from a chapter entry. Wires up routing within the chapter (scene navigation), controls, and the scene lifecycle. */
export function startChapter(chapterId: string, loaders: Loaders, exercisesLoader: ExercisesLoader): void {
  const root = document.getElementById('app');
  const parsed = parsePath(BASE, location.pathname);

  // Legacy un-prefixed path (/series/..., /series/harmonic/): move to the
  // language-prefixed path, keeping chapter, scene, and query.
  if (parsed.lang === undefined) {
    const lang = fallbackLang(storedLang());
    location.replace(`${withLang(BASE, { ...parsed, chapterId }, lang)}${location.search}`);
    return;
  }
  const lang = parsed.lang;
  rememberLang(lang);
  document.documentElement.lang = lang;

  // Retired chapter URLs (10-chapter split) serve the scene's full content
  // directly: the prerendered page boots this chapter's entry and the router
  // below renders the scene in place. The <link rel="canonical"> in the
  // static HTML points at the scene's new chapter URL, so search engines
  // consolidate the duplicate without any redirect.
  const chapter = catalog.find((candidate) => candidate.id === chapterId);
  if (!chapter || !root) throw new Error(`${tr(lang, 'chapterMissing')}: ${chapterId}`);
  mountChapter(chapter, loaders, exercisesLoader, root, lang);
}

function sceneLink(lang: Lang, chapter: ChapterMeta, scene: SceneMeta): HTMLAnchorElement {
  return h('a', { href: sceneUrl(BASE, lang, chapter.id, scene.id), 'data-spa': '', 'data-scene': scene.id }, localize(scene.title, lang));
}

interface ReadingEntry {
  chapter: ChapterMeta;
  scene: SceneMeta;
}

/** Every scene in reading order, across chapters. The pager walks this list. */
const readingOrder: readonly ReadingEntry[] = catalog.flatMap((chapter) =>
  [...chapter.scenes].sort((a, b) => a.order - b.order).map((scene) => ({ chapter, scene })),
);

function pagerLink(lang: Lang, currentChapterId: string, entry: ReadingEntry, rel: 'prev' | 'next'): HTMLAnchorElement {
  const label = tr(lang, rel === 'prev' ? 'prevScene' : 'nextScene');
  const title = localize(entry.scene.title, lang);
  const arrow = rel === 'prev' ? '←' : '→';
  const text = rel === 'prev' ? `${arrow} ${label}: ${title}` : `${label}: ${title} ${arrow}`;
  // Same-chapter links stay in the SPA; cross-chapter links are plain
  // navigations (the SPA router only knows the current chapter).
  const attrs: Record<string, string> = {
    href: sceneUrl(BASE, lang, entry.chapter.id, entry.scene.id),
    rel,
    'aria-label': text,
  };
  if (entry.chapter.id === currentChapterId) attrs['data-spa'] = '';
  return h('a', attrs, text);
}

/**
 * A span holding a summary: the delimiter-stripped text shows immediately, and
 * once the tex module arrives the \(...\) spans are replaced by inline KaTeX.
 */
function summarySpan(text: string): HTMLSpanElement {
  const span = h('span', {}, stripInlineMath(text));
  if (text.includes('\\(')) {
    import('./tex')
      .then((module) => module.renderRichText(span, text))
      .catch((error: unknown) => console.error(error));
  }
  return span;
}

function renderText(target: HTMLElement, scene: SceneMeta, lang: Lang): void {
  const summary = localize(scene.summary, lang);
  const paragraphs = summary.split('\n\n').map((p) => p.trim()).filter((p) => p.length > 0);
  target.replaceChildren(
    h('h1', {}, localize(scene.title, lang)),
    ...paragraphs.map((p) => h('p', {}, summarySpan(p))),
  );

  const tex = scene.tex;
  if (!tex || tex.length === 0) return;
  const formulas = h('div', { class: 'tex' });
  target.append(formulas);
  import('./tex')
    .then((module) => module.renderTex(formulas, tex))
    .catch((error: unknown) => console.error(error));
}

/**
 * Renders the problems section (examples/exercises) below the scene text.
 * Each problem reuses the scene's own module with a fixed preset for a compact,
 * non-interactive mini visualization; proofs live in <details> so they work
 * with zero JS. Text shows delimiter-stripped immediately and is upgraded to
 * KaTeX once the tex module arrives (same pattern as summarySpan).
 */
function renderProblems(
  host: HTMLElement,
  scene: SceneMeta,
  lang: Lang,
  loader: SceneLoader,
  track: (dispose: () => void) => void,
): void {
  const problems = scene.problems;
  if (!problems || problems.length === 0) return;

  const section = h('section', { class: 'problems' });
  section.append(h('h2', {}, tr(lang, 'problemsHeading')));
  host.append(section);

  interface RichTarget {
    el: HTMLElement;
    text: string;
    display?: readonly string[];
  }
  const richTargets: RichTarget[] = [];
  const vizJobs: Array<{ host: HTMLElement; preset: ControlState }> = [];
  const fragments = domKindFragments((target) => richTargets.push(target));

  for (const problem of problems) {
    const kind = problemKind(problem);
    const card = h('article', { class: 'problem', id: `problem-${scene.id}-${problem.id}` });
    if (kind !== 'proof') card.classList.add(`kind-${kind}`);

    const vizHost = h('div', { class: 'problem-viz-host' });
    const caption = h('figcaption', {}, stripInlineMath(localize(problem.presetCaption, lang)));
    const figure = h('figure', { class: 'problem-viz' }, vizHost, caption);
    richTargets.push({ el: caption, text: localize(problem.presetCaption, lang) });
    vizJobs.push({ host: vizHost, preset: problem.preset });

    card.append(
      ...problemCardBlocks(problem, problem.proof, lang, {
        statementClass: 'problem-statement',
        summaryLabel: tr(lang, problem.isHint ? 'showHint' : 'showProof'),
        middle: [figure],
        fragments,
      }),
    );
    section.append(card);
  }

  import('./tex')
    .then((tex) => {
      for (const { el, text, display } of richTargets) {
        if (!el.isConnected) continue;
        if (display !== undefined && display.length > 0) {
          el.replaceChildren();
          const textSpan = document.createElement('span');
          tex.renderRichText(textSpan, text);
          el.append(textSpan);
          const formulas = document.createElement('div');
          formulas.className = 'tex';
          tex.renderTex(formulas, display);
          el.append(formulas);
        } else {
          tex.renderRichText(el, text);
        }
      }
    })
    .catch((error: unknown) => console.error(error));

  // Mini visualizations reuse the scene module (already loading for the main
  // viz) with fixed presets. Each renders once and never listens to controls.
  loader()
    .then((module: AnySceneModule) => {
      for (const job of vizJobs) {
        if (!job.host.isConnected) continue;
        mountMiniViz(module, job.host, lang, job.preset, track);
      }
    })
    .catch((error: unknown) => console.error(error));
}

function mountChapter(chapter: ChapterMeta, loaders: Loaders, exercisesLoader: ExercisesLoader, root: HTMLElement, lang: Lang): void {
  const scenes = [...chapter.scenes].sort((a, b) => a.order - b.order);
  // Chapter numbers are automatic: the catalog order is the numbering, never stored in meta files.
  const chapterNumber = catalog.indexOf(chapter) + 1;
  const chapterTitle = `${chapterNumber}. ${localize(chapter.title, lang)}`;

  const nav = h(
    'nav',
    { 'aria-label': `${chapterTitle} ${tr(lang, 'tocLabel')}` },
    h(
      'ul',
      {},
      ...scenes.map((scene) => h('li', {}, sceneLink(lang, chapter, scene))),
      h(
        'li',
        {},
        h('a', { href: exercisesUrl(BASE, lang, chapter.id), 'data-spa': '', 'data-scene': 'exercises' }, tr(lang, 'exercises')),
      ),
    ),
  );
  const hub = h('section', { class: 'hub' });
  const exercisesView = h('section', { class: 'exercises-view' });
  const hostEl = h('div', { class: 'scene-host' });
  const controlsEl = h('div', { class: 'controls' });
  const textEl = h('article', { class: 'scene-text' });
  const pagerEl = h('nav', { class: 'scene-pager', 'aria-label': tr(lang, 'tocLabel') });
  const sceneView = h('section', { class: 'scene-view' }, hostEl, controlsEl, textEl, pagerEl);

  root.classList.add('chapter');
  const headerSearch = h('span', { class: 'header-search' });
  root.replaceChildren(
    h(
      'header',
      {},
      h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, site.name.en),
      h('a', { href: chapterUrl(BASE, lang, chapter.id), 'data-spa': '' }, chapterTitle),
      h('a', { href: pathsUrl(BASE, lang), class: 'paths-link' }, tr(lang, 'paths')),
      h('a', { href: glossaryUrl(BASE, lang), class: 'glossary-link' }, tr(lang, 'glossary')),
      headerSearch,
      langSwitcher(lang, (target) => `${withLang(BASE, parsePath(BASE, location.pathname), target)}${location.search}`),
    ),
    nav,
    h('main', {}, hub, exercisesView, sceneView),
  );
  mountSearch(headerSearch, lang);

  const sceneHost = new SceneHost(hostEl, lang);
  let urlSyncTimer: number | undefined;
  /** Guards the async exercises load against a route change while it is in flight. */
  let exercisesToken = 0;

  /** Disposers for the problem mini-visualizations of the current scene. */
  let problemDisposers: Array<() => void> = [];
  const disposeProblems = (): void => {
    const disposers = problemDisposers;
    problemDisposers = [];
    for (const dispose of disposers) {
      try {
        dispose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const markActive = (sceneId: string | undefined): void => {
    nav.querySelectorAll<HTMLAnchorElement>('a[data-scene]').forEach((anchor) => {
      if (anchor.dataset['scene'] === sceneId) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    });
  };

  /** Debounced so replaceState is not spammed while a slider is dragged. (Some browsers rate-limit the calls) */
  const scheduleUrlSync = (scene: SceneMeta, state: ControlState): void => {
    window.clearTimeout(urlSyncTimer);
    urlSyncTimer = window.setTimeout(() => {
      history.replaceState(null, '', `${location.pathname}${serializeState(scene.controls, state)}`);
    }, URL_SYNC_DELAY_MS);
  };

  const showHub = (notice?: string): void => {
    exercisesToken++;
    sceneHost.dispose();
    disposeProblems();
    disposeExercisesPage(exercisesView);
    sceneView.hidden = true;
    exercisesView.hidden = true;
    pagerEl.hidden = true;
    hub.hidden = false;
    document.title = `${chapterTitle} | ${site.name.en}`;
    hub.replaceChildren(
      h('h1', {}, chapterTitle),
      ...(notice ? [h('p', { role: 'alert' }, notice)] : []),
      h('p', {}, summarySpan(localize(chapter.summary, lang))),
      h(
        'p',
        { class: 'hub-exercises' },
        h('a', { href: exercisesUrl(BASE, lang, chapter.id), 'data-spa': '' }, tr(lang, 'exercisesLinkLabel')),
        ' — ',
        tr(lang, 'exercisesIntro'),
      ),
      h('ul', {}, ...scenes.map((scene) => h('li', {}, sceneLink(lang, chapter, scene), ' — ', summarySpan(localize(scene.summary, lang))))),
    );
    markActive(undefined);
  };

  const showScene = (scene: SceneMeta): void => {
    exercisesToken++;
    hub.hidden = true;
    exercisesView.hidden = true;
    disposeExercisesPage(exercisesView);
    sceneView.hidden = false;
    disposeProblems();
    document.title = `${localize(scene.title, lang)} | ${site.name.en}`;
    markActive(scene.id);
    renderText(textEl, scene, lang);

    // "Part of these learning paths" chips, derived from the paths catalog.
    // Scenes that belong to no path show nothing.
    const containing = learningPaths.filter((path) =>
      path.scenes.some((step) => step.chapterId === chapter.id && step.sceneId === scene.id),
    );
    if (containing.length > 0) {
      textEl.append(
        h(
          'section',
          { class: 'path-chips' },
          h('h2', {}, tr(lang, 'partOfPaths')),
          h(
            'ul',
            {},
            ...containing.map((path) =>
              h('li', {}, h('a', { href: pathDetailUrl(BASE, lang, path.id) }, localize(path.title, lang))),
            ),
          ),
        ),
      );
    }

    const state = parseState(scene.controls, location.search);
    buildControls(controlsEl, scene.controls, state, lang, (next) => {
      sceneHost.setState(next);
      scheduleUrlSync(scene, next);
    });

    const loader = loaders[scene.id];
    if (!loader) {
      sceneHost.dispose();
      sceneHost.showError(`${tr(lang, 'loaderMissing')}: ${scene.id}`);
      return;
    }
    void sceneHost.show(loader, state);
    renderProblems(textEl, scene, lang, loader, (dispose) => {
      problemDisposers.push(dispose);
    });

    // Previous/next scene footer: walks the whole reading order, across chapters.
    const position = readingOrder.findIndex((entry) => entry.chapter.id === chapter.id && entry.scene.id === scene.id);
    pagerEl.replaceChildren();
    if (position > 0) {
      const prev = readingOrder[position - 1];
      if (prev) pagerEl.append(pagerLink(lang, chapter.id, prev, 'prev'));
    }
    if (position >= 0 && position < readingOrder.length - 1) {
      const next = readingOrder[position + 1];
      if (next) pagerEl.append(pagerLink(lang, chapter.id, next, 'next'));
    }
    pagerEl.hidden = false;
  };

  const showExercises = (): void => {
    hub.hidden = true;
    sceneView.hidden = true;
    disposeProblems();
    sceneHost.dispose();
    disposeExercisesPage(exercisesView);
    exercisesView.hidden = false;
    markActive('exercises');
    document.title = exercisesPageTitle(lang, chapter);
    const ticket = ++exercisesToken;
    void exercisesLoader().then(
      (exercises) => {
        if (ticket !== exercisesToken) return;
        renderExercisesPage(exercisesView, chapter, lang, loaders, exercises);
      },
      (error: unknown) => {
        console.error(error);
        if (ticket !== exercisesToken) return;
        exercisesView.replaceChildren(h('p', { role: 'alert' }, tr(lang, 'exercisesLoadFailed')));
      },
    );
  };

  const route = (): void => {
    // Prevents the previous scene's URL sync from overwriting the new path.
    window.clearTimeout(urlSyncTimer);

    const { sceneId } = parsePath(BASE, location.pathname);
    if (!sceneId) {
      showHub();
      return;
    }
    if (sceneId === 'exercises') {
      showExercises();
      return;
    }
    const scene = scenes.find((candidate) => candidate.id === sceneId);
    if (!scene) {
      showHub(`${tr(lang, 'sceneNotFound')}: ${sceneId}`);
      return;
    }
    showScene(scene);
  };

  // Intercepts only links within the same chapter. The rest (home, other chapters) are plain page navigations.
  root.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-spa]');
    if (!anchor) return;
    event.preventDefault();
    history.pushState(null, '', anchor.href);
    route();
  });
  window.addEventListener('popstate', route);

  route();
}
