import { catalog } from '../catalog.ts';
import {
  localize,
  stripInlineMath,
  type AnySceneModule,
  type ChapterMeta,
  type ControlState,
  type ExerciseDifficulty,
  type ExerciseMeta,
  type Lang,
} from '../contracts.ts';
import { chapterUrl, homeUrl, parsePath, sceneUrl, withLang } from '../paths.ts';
import { h } from './dom.ts';
import { langSwitcher, tr } from './i18n.ts';
import { mountSearch } from './search.ts';

const BASE = import.meta.env.BASE_URL;

/** Scene loaders, passed in from the chapter entry (the same Loaders shape app.ts uses). */
type Loaders = Readonly<Record<string, () => Promise<AnySceneModule>>>;

/** Disposers for the mini visualizations mounted by the last render, keyed by container. */
const disposersByContainer = new WeakMap<HTMLElement, Array<() => void>>();

/** Runs (and forgets) the mini-visualization disposers registered for the container. */
export function disposeExercisesPage(container: HTMLElement): void {
  const disposers = disposersByContainer.get(container);
  if (!disposers) return;
  disposersByContainer.delete(container);
  for (const dispose of disposers) {
    try {
      dispose();
    } catch (error) {
      console.error(error);
    }
  }
}

/** The document title of a chapter's exercises page (mirrored by scripts/prerender.ts). */
export function exercisesPageTitle(lang: Lang, chapter: ChapterMeta): string {
  // Chapter numbers are automatic: the catalog order is the numbering, never stored in meta files.
  const chapterNumber = catalog.indexOf(chapter) + 1;
  return `${tr(lang, 'exercises')} · ${chapterNumber}. ${localize(chapter.title, lang)} | Real Analysis`;
}

function pageHeader(lang: Lang): HTMLElement {
  const headerSearch = h('span', { class: 'header-search' });
  const header = h(
    'header',
    { class: 'home-header' },
    h('a', { href: homeUrl(BASE, lang), class: 'site-title' }, 'Real Analysis'),
    headerSearch,
    // withLang routes { chapterId, sceneId: 'exercises' } through sceneUrl,
    // which produces exactly exercisesUrl(base, lang, chapterId).
    langSwitcher(lang, (target) => withLang(BASE, parsePath(BASE, location.pathname), target)),
  );
  mountSearch(headerSearch, lang);
  return header;
}

const difficultyKey = (difficulty: ExerciseDifficulty): 'difficultyEasy' | 'difficultyMedium' | 'difficultyHard' =>
  difficulty === 1 ? 'difficultyEasy' : difficulty === 2 ? 'difficultyMedium' : 'difficultyHard';

/**
 * Client-side render of /<lang>/<chapter id>/exercises/. The prerender step
 * writes an equivalent static page (same cards) so the content is readable
 * with zero JS; the SPA replaces it on boot.
 *
 * Cards are numbered 1..N in file order (easy first, so numbering aligns with
 * the difficulty groups). Mini visualizations reuse the chapter's own scene
 * modules with fixed presets, exactly like the scene problems in app.ts.
 */
export function renderExercisesPage(
  container: HTMLElement,
  chapter: ChapterMeta,
  lang: Lang,
  loaders: Loaders,
  exercises: readonly ExerciseMeta[],
): void {
  disposeExercisesPage(container);
  document.title = exercisesPageTitle(lang, chapter);

  const chapterNumber = catalog.indexOf(chapter) + 1;
  const chapterTitle = `${chapterNumber}. ${localize(chapter.title, lang)}`;
  const sceneTitleOf = new Map(chapter.scenes.map((scene) => [scene.id, localize(scene.title, lang)]));

  interface RichTarget {
    el: HTMLElement;
    text: string;
    display?: readonly string[];
  }
  const richTargets: RichTarget[] = [];
  const vizJobs: Array<{ host: HTMLElement; sceneId: string; preset: ControlState }> = [];
  const disposers: Array<() => void> = [];

  const groups = ([1, 2, 3] as const)
    .map((difficulty) => {
      const cards = exercises
        .map((exercise, index) => ({ exercise, index }))
        .filter(({ exercise }) => exercise.difficulty === difficulty)
        .map(({ exercise, index }) => {
          const card = h('article', { class: 'exercise problem', id: `exercise-${exercise.id}` });
          card.append(
            h(
              'div',
              { class: 'exercise-badges' },
              h('span', { class: 'exercise-number' }, String(index + 1)),
              h('span', { class: `difficulty-badge difficulty-${difficulty}` }, tr(lang, difficultyKey(difficulty))),
            ),
          );

          const statement = h('p', { class: 'exercise-statement' }, stripInlineMath(localize(exercise.statement, lang)));
          card.append(statement);
          richTargets.push({ el: statement, text: localize(exercise.statement, lang), display: exercise.display });

          if (exercise.topics.length > 0) {
            card.append(
              h(
                'ul',
                { class: 'exercise-topics' },
                ...exercise.topics.map((topicId) =>
                  h(
                    'li',
                    {},
                    h(
                      'a',
                      { href: sceneUrl(BASE, lang, chapter.id, topicId), 'data-spa': '' },
                      sceneTitleOf.get(topicId) ?? topicId,
                    ),
                  ),
                ),
              ),
            );
          }

          if (exercise.viz) {
            const vizHost = h('div', { class: 'exercise-viz-host' });
            const caption = h('figcaption', {}, stripInlineMath(localize(exercise.viz.presetCaption, lang)));
            card.append(h('figure', { class: 'exercise-viz' }, vizHost, caption));
            richTargets.push({ el: caption, text: localize(exercise.viz.presetCaption, lang) });
            vizJobs.push({ host: vizHost, sceneId: exercise.viz.sceneId, preset: exercise.viz.preset });
          }

          const details = h('details', { class: 'problem-proof' });
          details.append(h('summary', {}, tr(lang, 'showSolution')));
          const list = h('ol', {});
          for (const step of exercise.solution) {
            const item = h('li', {}, stripInlineMath(localize(step.text, lang)));
            list.append(item);
            richTargets.push({ el: item, text: localize(step.text, lang), display: step.display });
          }
          details.append(list);
          card.append(details);
          return card;
        });
      if (cards.length === 0) return null;
      const section = h('section', { class: 'exercise-group' });
      section.append(h('h2', {}, tr(lang, difficultyKey(difficulty))), ...cards);
      return section;
    })
    .filter((section): section is HTMLElement => section !== null);

  const main = h('main', { class: 'home exercises' });
  main.append(
    h('p', { class: 'exercises-back' }, h('a', { href: chapterUrl(BASE, lang, chapter.id) }, `← ${chapterTitle}`)),
    h('h1', {}, tr(lang, 'exercises')),
    h('p', {}, tr(lang, 'exercisesIntro')),
    ...groups,
  );

  container.replaceChildren(pageHeader(lang), main);

  // KaTeX upgrade: delimiter-stripped text shows immediately; once the tex
  // module arrives the \(...\) spans and display formulas are rendered.
  // (Same pattern as renderProblems in app.ts.)
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

  // Mini visualizations reuse the chapter's scene modules with fixed presets.
  // Each renders once and never listens to controls.
  for (const job of vizJobs) {
    const loader = loaders[job.sceneId];
    if (!loader) {
      console.error(`exercises: no loader for scene '${job.sceneId}'`);
      continue;
    }
    loader()
      .then((module: AnySceneModule) => {
        if (!job.host.isConnected) return;
        const mini = module.createScene();
        try {
          mini.mount(job.host, lang);
        } catch (error) {
          console.error(error);
          return;
        }
        disposers.push(() => mini.dispose());
        Promise.resolve()
          .then(() => module.model.compute(job.preset))
          .then(
            (data: unknown) => {
              if (job.host.isConnected) mini.render(data, job.preset);
            },
            (error: unknown) => console.error(error),
          );
      })
      .catch((error: unknown) => console.error(error));
  }
  if (disposers.length > 0 || vizJobs.length > 0) disposersByContainer.set(container, disposers);
}
