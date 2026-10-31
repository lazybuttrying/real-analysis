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
import { chapterUrl, sceneUrl } from '../paths.ts';
import { groupExercisesBySection } from '../sections.ts';
import { site } from '../site.config.ts';
import { h } from './dom.ts';
import { tr } from './i18n.ts';
import { domKindFragments, kindBadgeEl, problemCardBlocks, problemKind } from './kind-ui.ts';
import { mountMiniViz } from './scene-host.ts';
import { pageHeader } from './search.ts';

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
  return `${tr(lang, 'exercises')} · ${chapterNumber}. ${localize(chapter.title, lang)} | ${site.name.en}`;
}

const difficultyKey = (difficulty: ExerciseDifficulty): 'difficultyEasy' | 'difficultyMedium' | 'difficultyHard' =>
  difficulty === 1 ? 'difficultyEasy' : difficulty === 2 ? 'difficultyMedium' : 'difficultyHard';

/**
 * Client-side render of /<lang>/<chapter id>/exercises/. The prerender step
 * writes an equivalent static page (same cards) so the content is readable
 * with zero JS; the SPA replaces it on boot.
 *
 * Cards are numbered 1..N in file order (easy first), whichever grouping
 * the page uses: by chapter section when the chapter declares sections,
 * else by difficulty. Mini visualizations reuse the chapter's own scene
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
  const fragments = domKindFragments((target) => richTargets.push(target));

  const buildCard = (exercise: ExerciseMeta, index: number): HTMLElement => {
    const kind = problemKind(exercise);
    const card = h('article', { class: 'exercise problem', id: `exercise-${exercise.id}` });
    if (kind !== 'proof') card.classList.add(`kind-${kind}`);
    const badgeChildren: HTMLElement[] = [
      h('span', { class: 'exercise-number' }, String(index + 1)),
      h('span', { class: `difficulty-badge difficulty-${exercise.difficulty}` }, tr(lang, difficultyKey(exercise.difficulty))),
    ];
    const kindBadge = kindBadgeEl(kind, lang);
    if (kindBadge) badgeChildren.push(kindBadge);
    card.append(h('div', { class: 'exercise-badges' }, ...badgeChildren));

    const middle: HTMLElement[] = [];
    if (exercise.topics.length > 0) {
      middle.push(
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
      middle.push(h('figure', { class: 'exercise-viz' }, vizHost, caption));
      richTargets.push({ el: caption, text: localize(exercise.viz.presetCaption, lang) });
      vizJobs.push({ host: vizHost, sceneId: exercise.viz.sceneId, preset: exercise.viz.preset });
    }

    card.append(
      ...problemCardBlocks(exercise, exercise.solution, lang, {
        includeBadge: false,
        statementClass: 'exercise-statement',
        summaryLabel: tr(lang, 'showSolution'),
        middle,
        fragments,
      }),
    );
    return card;
  };

  const indexOf = new Map(exercises.map((exercise, index) => [exercise, index] as const));
  const groupSection = (heading: string | undefined, items: readonly ExerciseMeta[]): HTMLElement | null => {
    if (items.length === 0) return null;
    const section = h('section', { class: 'exercise-group' });
    if (heading !== undefined) section.append(h('h2', {}, heading));
    section.append(...items.map((exercise) => buildCard(exercise, indexOf.get(exercise) ?? 0)));
    return section;
  };

  // Chapters with sub-units group their exercises by section (an exercise
  // belongs to the section of its first topic scene); the rest group by
  // difficulty, as before. Card numbering is file order either way.
  const sectionGroups = groupExercisesBySection(chapter, exercises);
  const groups = (
    sectionGroups
      ? sectionGroups.map((group) => groupSection(group.section ? localize(group.section.title, lang) : undefined, group.exercises))
      : ([1, 2, 3] as const).map((difficulty) =>
          groupSection(
            tr(lang, difficultyKey(difficulty)),
            exercises.filter((exercise) => exercise.difficulty === difficulty),
          ),
        )
  ).filter((section): section is HTMLElement => section !== null);

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
        mountMiniViz(module, job.host, lang, job.preset, (dispose) => {
          disposers.push(dispose);
        });
      })
      .catch((error: unknown) => console.error(error));
  }
  if (disposers.length > 0 || vizJobs.length > 0) disposersByContainer.set(container, disposers);
}
