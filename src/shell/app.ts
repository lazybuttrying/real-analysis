import '../style.css';
import { catalog } from '../catalog';
import { localize, type ChapterMeta, type ControlState, type Lang, type SceneLoader, type SceneMeta } from '../contracts';
import { chapterUrl, fallbackLang, homeUrl, parsePath, sceneUrl, withLang } from '../paths';
import { parseState, serializeState } from '../state';
import { buildControls } from './controls';
import { h } from './dom';
import { langSwitcher, rememberLang, storedLang, tr } from './i18n';
import { SceneHost } from './scene-host';

const BASE = import.meta.env.BASE_URL;
const URL_SYNC_DELAY_MS = 200;

type Loaders = Readonly<Record<string, SceneLoader>>;

/** Called from a chapter entry. Wires up routing within the chapter (scene navigation), controls, and the scene lifecycle. */
export function startChapter(chapterId: string, loaders: Loaders): void {
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

  const chapter = catalog.find((candidate) => candidate.id === chapterId);
  if (!chapter || !root) throw new Error(`${tr(lang, 'chapterMissing')}: ${chapterId}`);
  mountChapter(chapter, loaders, root, lang);
}

function sceneLink(lang: Lang, chapter: ChapterMeta, scene: SceneMeta): HTMLAnchorElement {
  return h('a', { href: sceneUrl(BASE, lang, chapter.id, scene.id), 'data-spa': '', 'data-scene': scene.id }, localize(scene.title, lang));
}

function renderText(target: HTMLElement, scene: SceneMeta, lang: Lang): void {
  target.replaceChildren(h('h1', {}, localize(scene.title, lang)), h('p', {}, localize(scene.summary, lang)));

  const tex = scene.tex;
  if (!tex || tex.length === 0) return;
  const formulas = h('div', { class: 'tex' });
  target.append(formulas);
  import('./tex')
    .then((module) => module.renderTex(formulas, tex))
    .catch((error: unknown) => console.error(error));
}

function mountChapter(chapter: ChapterMeta, loaders: Loaders, root: HTMLElement, lang: Lang): void {
  const scenes = [...chapter.scenes].sort((a, b) => a.order - b.order);
  const chapterTitle = localize(chapter.title, lang);

  const nav = h(
    'nav',
    { 'aria-label': `${chapterTitle} ${tr(lang, 'tocLabel')}` },
    h('ul', {}, ...scenes.map((scene) => h('li', {}, sceneLink(lang, chapter, scene)))),
  );
  const hub = h('section', { class: 'hub' });
  const hostEl = h('div', { class: 'scene-host' });
  const controlsEl = h('div', { class: 'controls' });
  const textEl = h('article', { class: 'scene-text' });
  const sceneView = h('section', { class: 'scene-view' }, hostEl, controlsEl, textEl);

  root.classList.add('chapter');
  root.replaceChildren(
    h(
      'header',
      {},
      h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, 'Real Analysis'),
      h('a', { href: chapterUrl(BASE, lang, chapter.id), 'data-spa': '' }, chapterTitle),
      langSwitcher(lang, (target) => `${withLang(BASE, parsePath(BASE, location.pathname), target)}${location.search}`),
    ),
    nav,
    h('main', {}, hub, sceneView),
  );

  const sceneHost = new SceneHost(hostEl, lang);
  let urlSyncTimer: number | undefined;

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
    sceneHost.dispose();
    sceneView.hidden = true;
    hub.hidden = false;
    document.title = `${chapterTitle} | Real Analysis`;
    hub.replaceChildren(
      h('h1', {}, chapterTitle),
      ...(notice ? [h('p', { role: 'alert' }, notice)] : []),
      h('p', {}, localize(chapter.summary, lang)),
      h('ul', {}, ...scenes.map((scene) => h('li', {}, sceneLink(lang, chapter, scene), ` — ${localize(scene.summary, lang)}`))),
    );
    markActive(undefined);
  };

  const showScene = (scene: SceneMeta): void => {
    hub.hidden = true;
    sceneView.hidden = false;
    document.title = `${localize(scene.title, lang)} | Real Analysis`;
    markActive(scene.id);
    renderText(textEl, scene, lang);

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
  };

  const route = (): void => {
    // Prevents the previous scene's URL sync from overwriting the new path.
    window.clearTimeout(urlSyncTimer);

    const { sceneId } = parsePath(BASE, location.pathname);
    if (!sceneId) {
      showHub();
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
