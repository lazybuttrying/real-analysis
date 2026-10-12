import '../style.css';
import { catalog } from '../catalog';
import type { ChapterMeta, ControlState, SceneLoader, SceneMeta } from '../contracts';
import { chapterUrl, homeUrl, parsePath, sceneUrl } from '../paths';
import { parseState, serializeState } from '../state';
import { buildControls } from './controls';
import { h } from './dom';
import { SceneHost } from './scene-host';

const BASE = import.meta.env.BASE_URL;
const URL_SYNC_DELAY_MS = 200;

type Loaders = Readonly<Record<string, SceneLoader>>;

/** Called from a chapter entry. Wires up routing within the chapter (scene navigation), controls, and the scene lifecycle. */
export function startChapter(chapterId: string, loaders: Loaders): void {
  const chapter = catalog.find((candidate) => candidate.id === chapterId);
  const root = document.getElementById('app');
  if (!chapter || !root) throw new Error(`챕터 또는 #app 을 찾을 수 없습니다: ${chapterId}`);
  mountChapter(chapter, loaders, root);
}

function sceneLink(chapter: ChapterMeta, scene: SceneMeta): HTMLAnchorElement {
  return h('a', { href: sceneUrl(BASE, chapter.id, scene.id), 'data-spa': '', 'data-scene': scene.id }, scene.title);
}

function renderText(target: HTMLElement, scene: SceneMeta): void {
  target.replaceChildren(h('h1', {}, scene.title), h('p', {}, scene.summary));

  const tex = scene.tex;
  if (!tex || tex.length === 0) return;
  const formulas = h('div', { class: 'tex' });
  target.append(formulas);
  import('./tex')
    .then((module) => module.renderTex(formulas, tex))
    .catch((error: unknown) => console.error(error));
}

function mountChapter(chapter: ChapterMeta, loaders: Loaders, root: HTMLElement): void {
  const scenes = [...chapter.scenes].sort((a, b) => a.order - b.order);

  const nav = h(
    'nav',
    { 'aria-label': `${chapter.title} 목차` },
    h('ul', {}, ...scenes.map((scene) => h('li', {}, sceneLink(chapter, scene)))),
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
      h('a', { href: homeUrl(BASE), class: 'site-title' }, 'Real Analysis'),
      h('a', { href: chapterUrl(BASE, chapter.id), 'data-spa': '' }, chapter.title),
    ),
    nav,
    h('main', {}, hub, sceneView),
  );

  const sceneHost = new SceneHost(hostEl);
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
    document.title = `${chapter.title} | Real Analysis`;
    hub.replaceChildren(
      h('h1', {}, chapter.title),
      ...(notice ? [h('p', { role: 'alert' }, notice)] : []),
      h('p', {}, chapter.summary),
      h('ul', {}, ...scenes.map((scene) => h('li', {}, sceneLink(chapter, scene), ` — ${scene.summary}`))),
    );
    markActive(undefined);
  };

  const showScene = (scene: SceneMeta): void => {
    hub.hidden = true;
    sceneView.hidden = false;
    document.title = `${scene.title} | Real Analysis`;
    markActive(scene.id);
    renderText(textEl, scene);

    const state = parseState(scene.controls, location.search);
    buildControls(controlsEl, scene.controls, state, (next) => {
      sceneHost.setState(next);
      scheduleUrlSync(scene, next);
    });

    const loader = loaders[scene.id];
    if (!loader) {
      sceneHost.dispose();
      sceneHost.showError(`'${scene.id}' 씬의 로더가 등록되어 있지 않습니다.`);
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
      showHub(`'${sceneId}' 씬을 찾을 수 없습니다.`);
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
