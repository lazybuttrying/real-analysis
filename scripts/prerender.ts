import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import { catalog } from '../src/catalog.ts';
import { exercises as numbersExercises } from '../src/chapters/numbers/exercises.ts';
import { exercises as sequencesExercises } from '../src/chapters/sequences/exercises.ts';
import { exercises as continuityExercises } from '../src/chapters/continuity/exercises.ts';
import { exercises as topologyExercises } from '../src/chapters/topology/exercises.ts';
import { exercises as approximationExercises } from '../src/chapters/approximation/exercises.ts';
import { exercises as seriesExercises } from '../src/chapters/series/exercises.ts';
import { exercises as powerSeriesExercises } from '../src/chapters/power-series/exercises.ts';
import { exercises as functionSeriesExercises } from '../src/chapters/function-series/exercises.ts';
import { exercises as differentiationExercises } from '../src/chapters/differentiation/exercises.ts';
import { exercises as integrationExercises } from '../src/chapters/integration/exercises.ts';
import { buildConceptMap } from '../src/concept-map.ts';
import { LANGS, localize, splitInlineMath, stripInlineMath, type ChapterMeta, type ExerciseDifficulty, type ExerciseMeta, type Lang, type SceneMeta } from '../src/contracts.ts';
import { glossary } from '../src/glossary.ts';
import { learningPaths, type LearningPath } from '../src/learning-paths.ts';
import { chapterUrl, exercisesUrl, glossaryUrl, homeUrl, pathDetailUrl, pathsUrl, sceneUrl, FULLY_RETIRED_CHAPTER_IDS, LEGACY_CHAPTER_IDS, LEGACY_SCENE_CHAPTER } from '../src/paths.ts';
import { buildSearchIndex } from '../src/search-index.ts';
import { STRINGS } from '../src/shell/i18n.ts';

/**
 * Prerender step, run after `vite build` as part of `npm run build`.
 *
 * For every language it writes a static page per home/hub/scene under
 * dist/<lang>/... by reusing the built entry HTML (so the pages reference the
 * same hashed scripts/styles and still boot the SPA, which then takes over
 * #app), and adds sitemap.xml, 404.html, and robots.txt.
 * Summaries in the static body are rendered with inline KaTeX for their
 * \(...\) spans; meta descriptions carry the delimiter-stripped plain text.
 *
 * Self-checks fail the build when a scene lacks a title or summary in either
 * language, or when two pages would share a <title> within one language.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE_NAME = 'Real Analysis';
const ORIGIN = (process.env.SITE_ORIGIN ?? 'https://sdykim.me').replace(/\/$/, '');

function normalizeBase(raw: string): string {
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}
const BASE = normalizeBase(process.env.SITE_BASE ?? '/real-analysis/');

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Static body form of a summary: text segments are HTML-escaped, and each
 * \(...\) span is rendered with KaTeX (inline mode), mirroring the client's
 * renderRichText. Meta descriptions use stripInlineMath instead.
 */
const renderSummaryHtml = (text: string): string =>
  splitInlineMath(text)
    .map((segment) =>
      segment.kind === 'math' ? katex.renderToString(segment.tex, { displayMode: false, throwOnError: false }) : escapeHtml(segment.text),
    )
    .join('');

/** True when any language's form of the text embeds inline math (the page then needs the KaTeX stylesheet). */
const hasInlineMath = (text: { ko: string; en: string }): boolean => LANGS.some((lang) => localize(text, lang).includes('\\('));

/** Static body form of one display formula. */
const renderDisplayHtml = (formula: string): string =>
  `<div class="tex-block">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;

/**
 * Static body form of a scene's problems section: statements, preset captions,
 * and proofs (in <details>, so they work with zero JS). The mini visualizations
 * are client-only; static HTML carries a figure with the caption.
 */
const renderProblemsHtml = (scene: SceneMeta, lang: Lang): string => {
  const problems = scene.problems;
  if (!problems || problems.length === 0) return '';
  const cards = problems
    .map((problem) => {
      const steps = problem.proof
        .map((step) => `<li>${renderSummaryHtml(localize(step.text, lang))}${(step.display ?? []).map(renderDisplayHtml).join('\n')}</li>`)
        .join('\n');
      return `<article class="problem" id="problem-${scene.id}-${problem.id}">
<p class="problem-statement">${renderSummaryHtml(localize(problem.statement, lang))}</p>
${(problem.display ?? []).map(renderDisplayHtml).join('\n')}
<figure class="problem-viz"><figcaption>${renderSummaryHtml(localize(problem.presetCaption, lang))}</figcaption></figure>
<details class="problem-proof"><summary>${escapeHtml(localize(STRINGS.showProof, lang))}</summary>
<ol>${steps}</ol>
</details>
</article>`;
    })
    .join('\n');
  return `<section class="problems"><h2>${escapeHtml(localize(STRINGS.problemsHeading, lang))}</h2>\n${cards}\n</section>`;
};

/**
 * Static body form of a chapter's exercises page: difficulty-grouped cards with
 * statements, display formulas, topic links, viz figure+caption placeholders
 * (the mini visualizations are client-only), and solutions in <details> so
 * they work with zero JS. Mirrors the client renderer in
 * src/shell/exercises-page.ts.
 */
const exercisesByChapter = new Map<string, readonly ExerciseMeta[]>([
  ['numbers', numbersExercises],
  ['sequences', sequencesExercises],
  ['continuity', continuityExercises],
  ['topology', topologyExercises],
  ['approximation', approximationExercises],
  ['series', seriesExercises],
  ['power-series', powerSeriesExercises],
  ['function-series', functionSeriesExercises],
  ['differentiation', differentiationExercises],
  ['integration', integrationExercises],
]);

const difficultyHeading = (difficulty: ExerciseDifficulty, lang: Lang): string =>
  escapeHtml(
    localize(
      difficulty === 1 ? STRINGS.difficultyEasy : difficulty === 2 ? STRINGS.difficultyMedium : STRINGS.difficultyHard,
      lang,
    ),
  );

const renderExercisesHtml = (chapter: ChapterMeta, lang: Lang): string => {
  const exercises = exercisesByChapter.get(chapter.id) ?? [];
  const sceneTitleOf = new Map(chapter.scenes.map((scene) => [scene.id, localize(scene.title, lang)]));
  const groups = ([1, 2, 3] as const)
    .map((difficulty) => {
      const cards = exercises
        .map((exercise, index) => ({ exercise, index }))
        .filter(({ exercise }) => exercise.difficulty === difficulty)
        .map(({ exercise, index }) => {
          const steps = exercise.solution
            .map(
              (step) =>
                `<li>${renderSummaryHtml(localize(step.text, lang))}${(step.display ?? []).map(renderDisplayHtml).join('\n')}</li>`,
            )
            .join('\n');
          const topics = exercise.topics
            .map(
              (topicId) =>
                `<li><a href="${sceneUrl(BASE, lang, chapter.id, topicId)}">${escapeHtml(sceneTitleOf.get(topicId) ?? topicId)}</a></li>`,
            )
            .join('\n');
          const viz = exercise.viz
            ? `<figure class="exercise-viz"><figcaption>${renderSummaryHtml(localize(exercise.viz.presetCaption, lang))}</figcaption></figure>`
            : '';
          return `<article class="exercise problem" id="exercise-${exercise.id}">
<div class="exercise-badges"><span class="exercise-number">${index + 1}</span><span class="difficulty-badge difficulty-${difficulty}">${difficultyHeading(difficulty, lang)}</span></div>
<p class="exercise-statement">${renderSummaryHtml(localize(exercise.statement, lang))}</p>
${(exercise.display ?? []).map(renderDisplayHtml).join('\n')}
<ul class="exercise-topics">
${topics}
</ul>
${viz}
<details class="problem-proof"><summary>${escapeHtml(localize(STRINGS.showSolution, lang))}</summary>
<ol>${steps}</ol>
</details>
</article>`;
        })
        .join('\n');
      return cards ? `<section class="exercise-group"><h2>${difficultyHeading(difficulty, lang)}</h2>\n${cards}\n</section>` : '';
    })
    .join('\n');
  return groups;
};

/** True when any language's form of the exercise data embeds inline math (the page then needs the KaTeX stylesheet). */
const exerciseHasInlineMath = (exercise: ExerciseMeta): boolean =>
  LANGS.some((lang) =>
    [
      localize(exercise.statement, lang),
      ...(exercise.viz ? [localize(exercise.viz.presetCaption, lang)] : []),
      ...exercise.solution.map((step) => localize(step.text, lang)),
    ].some((text) => text.includes('\\(')),
  );

/** Every scene in reading order, across chapters — the static pager walks this list. */
const readingOrder: ReadonlyArray<{ chapter: ChapterMeta; scene: SceneMeta }> = catalog.flatMap((chapter) =>
  [...chapter.scenes].sort((a, b) => a.order - b.order).map((scene) => ({ chapter, scene })),
);

/** Static previous/next scene footer for a scene page (works with zero JS). */
const renderPagerHtml = (chapterId: string, sceneId: string, lang: Lang): string => {
  const position = readingOrder.findIndex((entry) => entry.chapter.id === chapterId && entry.scene.id === sceneId);
  const link = (entry: { chapter: ChapterMeta; scene: SceneMeta }, rel: 'prev' | 'next'): string => {
    const label = escapeHtml(localize(rel === 'prev' ? STRINGS.prevScene : STRINGS.nextScene, lang));
    const title = escapeHtml(localize(entry.scene.title, lang));
    const text = rel === 'prev' ? `&larr; ${label}: ${title}` : `${label}: ${title} &rarr;`;
    return `<a href="${sceneUrl(BASE, lang, entry.chapter.id, entry.scene.id)}" rel="${rel}" aria-label="${text}">${text}</a>`;
  };
  const parts: string[] = [];
  const prev = position > 0 ? readingOrder[position - 1] : undefined;
  const next = position >= 0 && position < readingOrder.length - 1 ? readingOrder[position + 1] : undefined;
  if (prev) parts.push(link(prev, 'prev'));
  if (next) parts.push(link(next, 'next'));
  return parts.length > 0 ? `<nav class="scene-pager">${parts.join('')}</nav>` : '';
};

interface Page {
  /** Path segments below dist/, e.g. ['en', 'series', 'grandi'] */
  segments: (lang: Lang) => string[];
  /** Root-relative URL of the page (with base, no origin). */
  url: (lang: Lang) => string;
  title: (lang: Lang) => string;
  description: (lang: Lang) => string;
  body: (lang: Lang) => string;
  /** Which built entry HTML to use as the shell. */
  template: 'home' | string;
  formulas?: boolean;
}

/** chapterId/sceneId -> the scene, for glossary scene-link labels. */
const sceneOf = new Map<string, SceneMeta>();
for (const chapter of catalog) {
  for (const scene of chapter.scenes) sceneOf.set(`${chapter.id}/${scene.id}`, scene);
}

/** Static body of the glossary page: terms grouped by chapter in catalog order. */
const renderGlossaryHtml = (lang: Lang): string => {
  const sections = catalog
    .map((chapter, chapterIndex) => {
      const terms = glossary.filter((entry) => entry.chapterId === chapter.id);
      if (terms.length === 0) return '';
      const items = terms
        .map((entry) => {
          const scene = sceneOf.get(`${entry.chapterId}/${entry.sceneId}`);
          const sceneLabel = scene ? localize(scene.title, lang) : entry.sceneId;
          return `<article class="glossary-term" id="term-${entry.id}">
<h3>${escapeHtml(stripInlineMath(localize(entry.term, lang)))}</h3>
<p>${renderSummaryHtml(localize(entry.definition, lang))}</p>
<p class="glossary-scene-link"><a href="${sceneUrl(BASE, lang, entry.chapterId, entry.sceneId)}">${escapeHtml(sceneLabel)}</a></p>
</article>`;
        })
        .join('\n');
      return `<section class="glossary-chapter">
<h2>${chapterIndex + 1}. ${escapeHtml(localize(chapter.title, lang))}</h2>
${items}
</section>`;
    })
    .join('\n');
  return [
    `<h1>${escapeHtml(localize(STRINGS.glossary, lang))}</h1>`,
    `<p>${escapeHtml(localize(STRINGS.glossaryIntro, lang))}</p>`,
    sections,
  ].join('\n');
};

/** Static body of the learning paths index: one card per path. */
const renderPathsIndexHtml = (lang: Lang): string => {
  const cards = learningPaths
    .map((path) => {
      const count = `${path.scenes.length}${localize(STRINGS.pathsSceneCount, lang)}`;
      return `<article class="path-card">
<h2><a href="${pathDetailUrl(BASE, lang, path.id)}">${escapeHtml(localize(path.title, lang))}</a></h2>
<p>${renderSummaryHtml(localize(path.description, lang))}</p>
<p class="path-card-meta">${escapeHtml(count)}</p>
</article>`;
    })
    .join('\n');
  return [`<h1>${escapeHtml(localize(STRINGS.paths, lang))}</h1>`, `<p>${escapeHtml(localize(STRINGS.pathsIntro, lang))}</p>`, cards].join('\n');
};

/** Static body of one learning path: numbered ordered scene list. */
const renderPathDetailHtml = (path: LearningPath, lang: Lang): string => {
  const steps = path.scenes
    .map((step, index) => {
      const scene = sceneOf.get(`${step.chapterId}/${step.sceneId}`);
      const chapterIndex = catalog.findIndex((chapter) => chapter.id === step.chapterId);
      const chapterLabel =
        scene && chapterIndex >= 0
          ? ` — ${chapterIndex + 1}. ${escapeHtml(localize(catalog[chapterIndex]?.title ?? { ko: '', en: '' }, lang))}`
          : '';
      const sceneLabel = scene ? escapeHtml(localize(scene.title, lang)) : escapeHtml(step.sceneId);
      return `<li value="${index + 1}"><a href="${sceneUrl(BASE, lang, step.chapterId, step.sceneId)}">${sceneLabel}</a><span class="path-step-chapter">${chapterLabel}</span></li>`;
    })
    .join('\n');
  return [
    `<p class="path-back"><a href="${pathsUrl(BASE, lang)}">← ${escapeHtml(localize(STRINGS.paths, lang))}</a></p>`,
    `<h1>${escapeHtml(localize(path.title, lang))}</h1>`,
    `<p>${renderSummaryHtml(localize(path.description, lang))}</p>`,
    `<ol class="path-steps">\n${steps}\n</ol>`,
  ].join('\n');
};

/** Static "part of these learning paths" chips for a scene page (empty when the scene is in no path). */
const renderPathChipsHtml = (chapterId: string, sceneId: string, lang: Lang): string => {
  const containing = learningPaths.filter((path) => path.scenes.some((step) => step.chapterId === chapterId && step.sceneId === sceneId));
  if (containing.length === 0) return '';
  const chips = containing
    .map((path) => `<li><a href="${pathDetailUrl(BASE, lang, path.id)}">${escapeHtml(localize(path.title, lang))}</a></li>`)
    .join('\n');
  return `<section class="path-chips"><h2>${escapeHtml(localize(STRINGS.partOfPaths, lang))}</h2>\n<ul>\n${chips}\n</ul></section>`;
};

const pages: Page[] = [
  {
    segments: (lang) => [lang],
    url: (lang) => homeUrl(BASE, lang),
    title: () => SITE_NAME,
    description: (lang) => localize(STRINGS.homeIntro, lang),
    template: 'home',
    formulas: catalog.some((chapter) => hasInlineMath(chapter.summary)),
    body: (lang) =>
      [
        `<h1>${SITE_NAME}</h1>`,
        `<p>${escapeHtml(localize(STRINGS.homeIntro, lang))}</p>`,
        '<ul>',
        ...catalog.map(
          // Chapter numbers are automatic: the catalog order is the numbering.
          (chapter, index) =>
            `<li><a href="${chapterUrl(BASE, lang, chapter.id)}">${index + 1}. ${escapeHtml(localize(chapter.title, lang))}</a> — ${renderSummaryHtml(localize(chapter.summary, lang))}</li>`,
        ),
        '</ul>',
        `<p><a href="${glossaryUrl(BASE, lang)}">${escapeHtml(localize(STRINGS.glossary, lang))}</a></p>`,
        `<section class="home-map">`,
        `<h2>${escapeHtml(localize(STRINGS.map, lang))}</h2>`,
        `<p>${escapeHtml(localize(STRINGS.mapIntro, lang))}</p>`,
        `<div class="map-mount">`,
        renderMapFallbackHtml(lang),
        `</div>`,
        `</section>`,
      ].join('\n'),
  },
];

for (const [index, chapter] of catalog.entries()) {
  // Chapter numbers are automatic: the catalog order is the numbering.
  const chapterNumber = index + 1;
  pages.push({
    segments: (lang) => [lang, chapter.id],
    url: (lang) => chapterUrl(BASE, lang, chapter.id),
    title: (lang) => `${chapterNumber}. ${localize(chapter.title, lang)} | ${SITE_NAME}`,
    description: (lang) => stripInlineMath(localize(chapter.summary, lang)),
    template: chapter.id,
    formulas: hasInlineMath(chapter.summary) || chapter.scenes.some((scene) => hasInlineMath(scene.summary)),
    body: (lang) =>
      [
        `<h1>${chapterNumber}. ${escapeHtml(localize(chapter.title, lang))}</h1>`,
        `<p>${renderSummaryHtml(localize(chapter.summary, lang))}</p>`,
        '<ul>',
        ...[...chapter.scenes]
          .sort((a, b) => a.order - b.order)
          .map(
            (scene) =>
              `<li><a href="${sceneUrl(BASE, lang, chapter.id, scene.id)}">${escapeHtml(localize(scene.title, lang))}</a> — ${renderSummaryHtml(localize(scene.summary, lang))}</li>`,
          ),
        '</ul>',
      ].join('\n'),
  });

  // Chapter exercises page: /<lang>/<chapter id>/exercises/
  const chapterExercises = exercisesByChapter.get(chapter.id) ?? [];
  pages.push({
    segments: (lang) => [lang, chapter.id, 'exercises'],
    url: (lang) => exercisesUrl(BASE, lang, chapter.id),
    // Mirrors exercisesPageTitle in src/shell/exercises-page.ts; unique per
    // language because the chapter differs.
    title: (lang) => `${localize(STRINGS.exercises, lang)} · ${chapterNumber}. ${localize(chapter.title, lang)} | ${SITE_NAME}`,
    description: (lang) => localize(STRINGS.exercisesIntro, lang),
    template: chapter.id,
    formulas: chapterExercises.some(
      (exercise) =>
        (exercise.display?.length ?? 0) > 0 ||
        exercise.solution.some((step) => (step.display?.length ?? 0) > 0) ||
        exerciseHasInlineMath(exercise),
    ),
    body: (lang) =>
      [
        `<p class="exercises-back"><a href="${chapterUrl(BASE, lang, chapter.id)}">← ${chapterNumber}. ${escapeHtml(localize(chapter.title, lang))}</a></p>`,
        `<h1>${escapeHtml(localize(STRINGS.exercises, lang))}</h1>`,
        `<p>${escapeHtml(localize(STRINGS.exercisesIntro, lang))}</p>`,
        renderExercisesHtml(chapter, lang),
      ].join('\n'),
  });

  for (const scene of [...chapter.scenes].sort((a, b) => a.order - b.order)) {
    pages.push({
      segments: (lang) => [lang, chapter.id, scene.id],
      url: (lang) => sceneUrl(BASE, lang, chapter.id, scene.id),
      title: (lang) => `${localize(scene.title, lang)} | ${SITE_NAME}`,
      description: (lang) => stripInlineMath(localize(scene.summary, lang)),
      template: chapter.id,
      formulas: (scene.tex?.length ?? 0) > 0 || hasInlineMath(scene.summary) || (scene.problems?.length ?? 0) > 0,
      body: (lang) =>
        [
          `<h1>${escapeHtml(localize(scene.title, lang))}</h1>`,
          `<p>${renderSummaryHtml(localize(scene.summary, lang))}</p>`,
          ...(scene.tex ?? []).map((formula) => renderDisplayHtml(formula)),
          renderPathChipsHtml(chapter.id, scene.id, lang),
          renderProblemsHtml(scene, lang),
          renderPagerHtml(chapter.id, scene.id, lang),
          `<p><a href="${chapterUrl(BASE, lang, chapter.id)}">${chapterNumber}. ${escapeHtml(localize(chapter.title, lang))}</a></p>`,
        ].join('\n'),
    });
  }
}

pages.push({
  segments: (lang) => [lang, 'glossary'],
  url: (lang) => glossaryUrl(BASE, lang),
  title: (lang) => `${localize(STRINGS.glossary, lang)} | ${SITE_NAME}`,
  description: (lang) => localize(STRINGS.glossaryIntro, lang),
  template: 'home',
  formulas: glossary.some((entry) => hasInlineMath(entry.definition) || hasInlineMath(entry.term)),
  body: renderGlossaryHtml,
});

pages.push({
  segments: (lang) => [lang, 'paths'],
  url: (lang) => pathsUrl(BASE, lang),
  title: (lang) => `${localize(STRINGS.paths, lang)} | ${SITE_NAME}`,
  description: (lang) => localize(STRINGS.pathsIntro, lang),
  template: 'home',
  formulas: learningPaths.some((path) => hasInlineMath(path.description)),
  body: renderPathsIndexHtml,
});

for (const path of learningPaths) {
  pages.push({
    segments: (lang) => [lang, 'paths', path.id],
    url: (lang) => pathDetailUrl(BASE, lang, path.id),
    title: (lang) => `${localize(path.title, lang)} | ${SITE_NAME}`,
    description: (lang) => stripInlineMath(localize(path.description, lang)),
    template: 'home',
    formulas: hasInlineMath(path.description),
    body: (lang) => renderPathDetailHtml(path, lang),
  });
}

/** Static fallback for the home page's concept map section: chapter-grouped scene lists with prerequisite links (zero-JS readable). The client replaces it with the interactive d3 graph on load. */
const renderMapFallbackHtml = (lang: Lang): string => {
  const { edges } = buildConceptMap();
  const prereqsOf = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.kind !== 'prereq') continue;
    const targetKey = `${edge.target.chapterId}/${edge.target.sceneId}`;
    const list = prereqsOf.get(targetKey) ?? [];
    list.push(`${edge.source.chapterId}/${edge.source.sceneId}`);
    prereqsOf.set(targetKey, list);
  }
  const sections = catalog
    .map((chapter, chapterIndex) => {
      const items = [...chapter.scenes]
        .sort((a, b) => a.order - b.order)
        .map((scene) => {
          const key = `${chapter.id}/${scene.id}`;
          const prereqs = (prereqsOf.get(key) ?? [])
            .map((sourceKey) => {
              const source = sceneOf.get(sourceKey);
              const label = source ? localize(source.title, lang) : sourceKey;
              const [sourceChapter, sourceScene] = sourceKey.split('/');
              return `<a href="${sceneUrl(BASE, lang, sourceChapter ?? '', sourceScene ?? '')}">${escapeHtml(label)}</a>`;
            })
            .join(', ');
          const prereqNote = prereqs ? ` <span class="path-step-chapter">← ${prereqs}</span>` : '';
          return `<li><a href="${sceneUrl(BASE, lang, chapter.id, scene.id)}">${escapeHtml(localize(scene.title, lang))}</a>${prereqNote}</li>`;
        })
        .join('\n');
      return `<section>\n<h2>${chapterIndex + 1}. ${escapeHtml(localize(chapter.title, lang))}</h2>\n<ul>\n${items}\n</ul>\n</section>`;
    })
    .join('\n');
  return sections;
};

function selfCheck(): string[] {
  const problems: string[] = [];
  for (const chapter of catalog) {
    for (const lang of LANGS) {
      if (!localize(chapter.title, lang).trim()) problems.push(`chapter '${chapter.id}' has an empty title (${lang})`);
      if (!localize(chapter.summary, lang).trim()) problems.push(`chapter '${chapter.id}' has an empty summary (${lang})`);
    }
    for (const scene of chapter.scenes) {
      for (const lang of LANGS) {
        if (!localize(scene.title, lang).trim()) problems.push(`scene '${chapter.id}/${scene.id}' has an empty title (${lang})`);
        if (!localize(scene.summary, lang).trim()) problems.push(`scene '${chapter.id}/${scene.id}' has an empty summary (${lang})`);
      }
      const seenProblemIds = new Set<string>();
      for (const problem of scene.problems ?? []) {
        if (seenProblemIds.has(problem.id)) problems.push(`scene '${chapter.id}/${scene.id}' has a duplicate problem id '${problem.id}'`);
        seenProblemIds.add(problem.id);
        for (const lang of LANGS) {
          if (!localize(problem.statement, lang).trim())
            problems.push(`problem '${chapter.id}/${scene.id}/${problem.id}' has an empty statement (${lang})`);
          if (!localize(problem.presetCaption, lang).trim())
            problems.push(`problem '${chapter.id}/${scene.id}/${problem.id}' has an empty preset caption (${lang})`);
        }
        if (problem.proof.length === 0) problems.push(`problem '${chapter.id}/${scene.id}/${problem.id}' has an empty proof`);
        problem.proof.forEach((step, index) => {
          for (const lang of LANGS) {
            if (!localize(step.text, lang).trim())
              problems.push(`problem '${chapter.id}/${scene.id}/${problem.id}' has an empty proof step ${index} (${lang})`);
          }
        });
      }
    }
  }
  // Chapter exercises: unique kebab-case ids across all chapters, difficulties
  // grouped easy -> hard in file order, non-empty bilingual
  // statement/solution, topics and viz presets referencing real scenes of the
  // same chapter, and well-formed math delimiters (\(...\) only, never $...$).
  // Exercise counts per chapter are uneven by design (the 10-chapter split
  // redistributed the 36 exercises by topic fit).
  const KEBAB_CASE = /^[a-z][a-z0-9-]*$/;
  const checkExerciseText = (tag: string, field: string, text: { ko: string; en: string }): void => {
    for (const lang of LANGS) {
      const value = localize(text, lang);
      if (!value.trim()) problems.push(`${tag} has an empty ${field} (${lang})`);
      if (value.includes('$')) problems.push(`${tag} uses a $ delimiter in ${field} (${lang})`);
      const opens = (value.match(/\\\(/g) ?? []).length;
      const closes = (value.match(/\\\)/g) ?? []).length;
      if (opens !== closes) problems.push(`${tag} has unbalanced \\(...\\) in ${field} (${lang})`);
    }
  };
  const checkNoDollar = (tag: string, field: string, formula: string): void => {
    if (formula.includes('$')) problems.push(`${tag} uses a $ delimiter in ${field}`);
  };
  const seenExerciseIds = new Set<string>();
  let totalExercises = 0;
  for (const chapter of catalog) {
    const exercises = exercisesByChapter.get(chapter.id) ?? [];
    totalExercises += exercises.length;
    const sceneIds = new Set(chapter.scenes.map((scene) => scene.id));
    const controlsOf = new Map(chapter.scenes.map((scene) => [scene.id, new Set(scene.controls.map((control) => control.key))]));
    let lastDifficulty: ExerciseDifficulty = 1;
    exercises.forEach((exercise, index) => {
      const tag = `exercise '${chapter.id}/${exercise.id}'`;
      if (seenExerciseIds.has(exercise.id)) problems.push(`duplicate exercise id '${exercise.id}' across chapters`);
      seenExerciseIds.add(exercise.id);
      if (!KEBAB_CASE.test(exercise.id)) problems.push(`${tag} id is not kebab-case`);
      if (exercise.difficulty < lastDifficulty) {
        problems.push(`${tag} has difficulty ${exercise.difficulty} at position ${index + 1} after difficulty ${lastDifficulty} (exercises must be grouped easy -> hard)`);
      }
      lastDifficulty = exercise.difficulty;
      checkExerciseText(tag, 'statement', exercise.statement);
      for (const formula of exercise.display ?? []) checkNoDollar(tag, 'display', formula);
      if (exercise.solution.length === 0) problems.push(`${tag} has an empty solution`);
      exercise.solution.forEach((step, stepIndex) => {
        checkExerciseText(tag, `solution step ${stepIndex}`, step.text);
        for (const formula of step.display ?? []) checkNoDollar(tag, `solution step ${stepIndex} display`, formula);
      });
      if (exercise.topics.length === 0) problems.push(`${tag} has no topics`);
      for (const topicId of exercise.topics) {
        if (!sceneIds.has(topicId)) problems.push(`${tag} links to unknown scene '${chapter.id}/${topicId}'`);
      }
      if (exercise.viz) {
        checkExerciseText(tag, 'presetCaption', exercise.viz.presetCaption);
        const controlKeys = controlsOf.get(exercise.viz.sceneId);
        if (!controlKeys) {
          problems.push(`${tag} viz references unknown scene '${chapter.id}/${exercise.viz.sceneId}'`);
        } else {
          for (const key of Object.keys(exercise.viz.preset)) {
            if (!controlKeys.has(key)) problems.push(`${tag} viz preset has unknown control key '${key}' for scene '${exercise.viz.sceneId}'`);
          }
        }
      }
    });
  }
  if (totalExercises !== 36) problems.push(`total exercises = ${totalExercises} (expected 36)`);
  for (const lang of LANGS) {
    const seen = new Map<string, number>();
    for (const page of pages) {
      const title = page.title(lang);
      seen.set(title, (seen.get(title) ?? 0) + 1);
    }
    for (const [title, count] of seen) {
      if (count > 1) problems.push(`duplicate <title> in ${lang}: "${title}" (${count} pages)`);
    }
  }
  // Glossary entries: unique ids, real chapter/scene links, non-empty text in
  // both languages, and well-formed math delimiters (\(...\) only, never $...$).
  const seenTermIds = new Set<string>();
  for (const entry of glossary) {
    if (seenTermIds.has(entry.id)) problems.push(`glossary has a duplicate term id '${entry.id}'`);
    seenTermIds.add(entry.id);
    const scene = sceneOf.get(`${entry.chapterId}/${entry.sceneId}`);
    if (!scene) problems.push(`glossary term '${entry.id}' links to unknown scene '${entry.chapterId}/${entry.sceneId}'`);
    for (const lang of LANGS) {
      for (const [field, text] of [
        ['term', localize(entry.term, lang)],
        ['definition', localize(entry.definition, lang)],
      ] as const) {
        if (!text.trim()) problems.push(`glossary term '${entry.id}' has an empty ${field} (${lang})`);
        if (text.includes('$')) problems.push(`glossary term '${entry.id}' uses a $ delimiter in ${field} (${lang})`);
        const opens = (text.match(/\\\(/g) ?? []).length;
        const closes = (text.match(/\\\)/g) ?? []).length;
        if (opens !== closes) problems.push(`glossary term '${entry.id}' has unbalanced \\(...\\) in ${field} (${lang})`);
      }
    }
  }
  // Learning paths: unique ids, real chapter/scene links, non-empty text in
  // both languages, well-formed math delimiters, no duplicate scenes in a path.
  const seenPathIds = new Set<string>();
  for (const path of learningPaths) {
    if (seenPathIds.has(path.id)) problems.push(`learning path has a duplicate id '${path.id}'`);
    seenPathIds.add(path.id);
    if (!/^[a-z][a-z0-9-]*$/.test(path.id)) problems.push(`learning path id '${path.id}' is not kebab-case`);
    if (path.scenes.length === 0) problems.push(`learning path '${path.id}' has no scenes`);
    const seenSteps = new Set<string>();
    for (const step of path.scenes) {
      const key = `${step.chapterId}/${step.sceneId}`;
      if (seenSteps.has(key)) problems.push(`learning path '${path.id}' lists scene '${key}' twice`);
      seenSteps.add(key);
      if (!sceneOf.has(key)) problems.push(`learning path '${path.id}' links to unknown scene '${key}'`);
    }
    for (const lang of LANGS) {
      for (const [field, text] of [
        ['title', localize(path.title, lang)],
        ['description', localize(path.description, lang)],
      ] as const) {
        if (!text.trim()) problems.push(`learning path '${path.id}' has an empty ${field} (${lang})`);
        if (text.includes('$')) problems.push(`learning path '${path.id}' uses a $ delimiter in ${field} (${lang})`);
        const opens = (text.match(/\\\(/g) ?? []).length;
        const closes = (text.match(/\\\)/g) ?? []).length;
        if (opens !== closes) problems.push(`learning path '${path.id}' has unbalanced \\(...\\) in ${field} (${lang})`);
      }
    }
  }
  // Concept map: every edge endpoint is a real scene, no self-loops, no
  // duplicate edges, and the graph is dense enough to be useful.
  const conceptMap = buildConceptMap();
  if (conceptMap.edges.length <= 40) {
    problems.push(`concept map has only ${conceptMap.edges.length} edges (expected > 40)`);
  }
  const seenEdges = new Set<string>();
  for (const edge of conceptMap.edges) {
    const from = `${edge.source.chapterId}/${edge.source.sceneId}`;
    const to = `${edge.target.chapterId}/${edge.target.sceneId}`;
    if (!sceneOf.has(from)) problems.push(`concept map edge starts at unknown scene '${from}'`);
    if (!sceneOf.has(to)) problems.push(`concept map edge ends at unknown scene '${to}'`);
    if (from === to) problems.push(`concept map has a self-loop on '${from}'`);
    const dedup = `${from}>${to}`;
    if (seenEdges.has(dedup)) problems.push(`concept map has a duplicate edge '${dedup}'`);
    seenEdges.add(dedup);
  }
  return problems;
}

function renderPage(template: string, page: Page, lang: Lang, katexCss: string | undefined): string {
  const absolute = (l: Lang): string => `${ORIGIN}${page.url(l)}`;
  const headExtras = [
    `<meta name="description" content="${escapeHtml(page.description(lang))}" />`,
    `<link rel="canonical" href="${absolute(lang)}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${absolute(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${absolute('ko')}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title(lang))}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description(lang))}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${absolute(lang)}" />`,
    ...(page.formulas && katexCss ? [`<link rel="stylesheet" crossorigin href="${BASE}assets/${katexCss}" />`] : []),
  ].join('\n    ');

  let html = template;
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title(lang))}</title>`);
  html = html.replace('</head>', `    ${headExtras}\n  </head>`);
  if (!html.includes('<div id="app"></div>')) {
    throw new Error(`[prerender] built entry has no empty #app element to inject into (${page.url(lang)})`);
  }
  html = html.replace('<div id="app"></div>', `<div id="app">${page.body(lang)}</div>`);
  return html;
}

/**
 * Static redirect pages for retired chapter URLs (10-chapter split). These
 * are NOT in the sitemap: they exist so old links keep working.
 *
 * - 'limits'/'calculus' are fully retired: hub -> home, exercises -> home,
 *   every scene -> its new chapter.
 * - 'series' is partially retired (the id is reused by the new Series
 *   chapter): only the scenes that moved away get redirect pages. The hub,
 *   the exercises page, and the scenes that stayed keep their URLs, so they
 *   must NOT redirect (a self-redirect would loop).
 */
interface Redirect {
  /** Path segments below dist/, e.g. ['ko', 'limits', 'epsilon-n'] */
  segments: (lang: Lang) => string[];
  /** Root-relative URL of the redirect target (with base). */
  target: (lang: Lang) => string;
  title: (lang: Lang) => string;
}

const redirects: Redirect[] = [];
{
  const newChapterOf = new Map<string, string>();
  const sceneTitleOf = new Map<string, { ko: string; en: string }>();
  for (const chapter of catalog) {
    for (const scene of chapter.scenes) {
      newChapterOf.set(scene.id, chapter.id);
      sceneTitleOf.set(scene.id, scene.title);
    }
  }
  for (const legacyId of LEGACY_CHAPTER_IDS) {
    if ((FULLY_RETIRED_CHAPTER_IDS as readonly string[]).includes(legacyId)) {
      redirects.push({
        segments: (lang) => [lang, legacyId],
        target: (lang) => homeUrl(BASE, lang),
        title: () => SITE_NAME,
      });
      redirects.push({
        segments: (lang) => [lang, legacyId, 'exercises'],
        target: (lang) => homeUrl(BASE, lang),
        title: () => SITE_NAME,
      });
    }
  }
  // Each scene's pre-split chapter, recovered from the split assignment:
  // limits scenes are those now in numbers/sequences/continuity/topology/
  // approximation; series scenes those now in series/power-series plus the
  // series-owned scenes that moved to function-series (m-test, dini) and
  // integration (gamma, beta-function, bohr-mollerup, improper); the rest
  // were calculus scenes.
  const SERIES_MOVED = new Set(['m-test', 'dini', 'gamma', 'beta-function', 'bohr-mollerup', 'improper']);
  const preSplitHome = (sceneId: string): 'limits' | 'series' | 'calculus' => {
    const now = newChapterOf.get(sceneId);
    if (now === 'numbers' || now === 'sequences' || now === 'continuity' || now === 'topology' || now === 'approximation') {
      return 'limits';
    }
    if (now === 'series' || now === 'power-series' || SERIES_MOVED.has(sceneId)) return 'series';
    return 'calculus';
  };
  for (const sceneId of Object.keys(LEGACY_SCENE_CHAPTER)) {
    const legacyId = preSplitHome(sceneId);
    const newChapterId = LEGACY_SCENE_CHAPTER[sceneId];
    if (newChapterId === undefined) continue;
    if (legacyId === 'series' && newChapterId === 'series') continue; // stayed: no redirect
    const title = sceneTitleOf.get(sceneId);
    redirects.push({
      segments: (lang) => [lang, legacyId, sceneId],
      target: (lang) => sceneUrl(BASE, lang, newChapterId, sceneId),
      title: (lang) => `${title ? localize(title, lang) : sceneId} | ${SITE_NAME}`,
    });
  }
}

/** Minimal redirect page: meta refresh + canonical + JS replace. */
function redirectHtml(target: string, title: string): string {
  const absolute = `${ORIGIN}${target}`;
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${escapeHtml(absolute)}" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <script>location.replace(${JSON.stringify(target)} + location.search);</script>
  </head>
  <body>
    <p>Moved to <a href="${escapeHtml(target)}">${escapeHtml(absolute)}</a></p>
  </body>
</html>
`;
}

function rootRedirectHtml(): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>${SITE_NAME}</title>
    <meta http-equiv="refresh" content="0; url=${BASE}ko/" />
    <script>
      try {
        var stored = localStorage.getItem('lang');
        var lang = stored === 'en' || stored === 'ko' ? stored : 'ko';
        location.replace('${BASE}' + lang + '/' + location.search);
      } catch (e) {
        location.replace('${BASE}ko/');
      }
    </script>
  </head>
  <body>
    <p><a href="${BASE}ko/">한국어</a> · <a href="${BASE}en/">English</a></p>
  </body>
</html>
`;
}

function notFoundHtml(): string {
  const ids = JSON.stringify(catalog.map((chapter) => chapter.id));
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>${SITE_NAME}</title>
    <script>
      (function () {
        var BASE = '${BASE}';
        var CHAPTERS = ${ids};
        var stored = null;
        try { stored = localStorage.getItem('lang'); } catch (e) {}
        var lang = stored === 'en' || stored === 'ko' ? stored : 'ko';
        var rel = location.pathname.indexOf(BASE) === 0
          ? location.pathname.slice(BASE.length)
          : location.pathname.replace(/^\\//, '');
        var segments = rel.split('/').filter(Boolean);
        var first = segments[0] || '';
        var target;
        if (first === 'ko' || first === 'en') {
          target = BASE + first + '/';
        } else if (CHAPTERS.indexOf(first) !== -1) {
          target = BASE + lang + '/' + segments.join('/') + '/' + location.search;
        } else {
          target = BASE + lang + '/';
        }
        location.replace(target);
      })();
    </script>
  </head>
  <body>
    <p>Page not found. <a href="${BASE}ko/">한국어 홈</a> · <a href="${BASE}en/">English home</a></p>
  </body>
</html>
`;
}

function sitemapXml(): string {
  const urls = pages
    .map((page) => {
      const alternates = [
        ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${page.url(l)}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${page.url('ko')}" />`,
      ].join('\n');
      return LANGS.map((l) => `  <url>\n    <loc>${ORIGIN}${page.url(l)}</loc>\n${alternates}\n  </url>`).join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

function main(): void {
  const problems = selfCheck();
  if (problems.length > 0) {
    console.error(`prerender: ${problems.length} content problem(s):`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }

  const homeTemplatePath = join(DIST, 'index.html');
  if (!existsSync(homeTemplatePath)) throw new Error('[prerender] dist/index.html not found — run vite build first');
  const templates = new Map<string, string>([['home', readFileSync(homeTemplatePath, 'utf8')]]);
  for (const chapter of catalog) {
    const path = join(DIST, chapter.id, 'index.html');
    if (!existsSync(path)) throw new Error(`[prerender] built chapter entry missing: dist/${chapter.id}/index.html`);
    templates.set(chapter.id, readFileSync(path, 'utf8'));
  }

  const assets = readdirSync(join(DIST, 'assets'));
  const katexCss = assets.find((name) => name.endsWith('.css') && name.toLowerCase().includes('katex'));

  let written = 0;
  for (const page of pages) {
    const template = templates.get(page.template);
    if (!template) throw new Error(`[prerender] no template for ${page.template}`);
    for (const lang of LANGS) {
      const dir = join(DIST, ...page.segments(lang));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), renderPage(template, page, lang, katexCss));
      written++;
    }
  }

  // Static redirect pages for retired chapter URLs (not in the sitemap).
  let redirectCount = 0;
  for (const redirect of redirects) {
    for (const lang of LANGS) {
      const dir = join(DIST, ...redirect.segments(lang));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), redirectHtml(redirect.target(lang), redirect.title(lang)));
      redirectCount++;
    }
  }

  writeFileSync(join(DIST, 'index.html'), rootRedirectHtml());
  writeFileSync(join(DIST, '404.html'), notFoundHtml());
  writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml());
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}${BASE}sitemap.xml\n`);

  // Client-side search index, one JSON file per language. The shell fetches it
  // lazily on first search input, so no page bundle pays for it up front.
  for (const lang of LANGS) {
    writeFileSync(join(DIST, `search-index.${lang}.json`), JSON.stringify(buildSearchIndex(lang)));
  }

  console.log(
    `prerender: wrote ${written} pages (${LANGS.length} languages × ${pages.length} pages: home (with embedded concept map) + ${catalog.length} hub(s) + ${catalog.reduce((n, c) => n + c.scenes.length, 0)} scenes + ${catalog.length} exercises page(s) + 1 glossary + 1 paths index + ${learningPaths.length} path detail(s)), ${redirectCount} redirect pages (not in sitemap), sitemap.xml (${written} URLs), 404.html, robots.txt, search-index JSON`,
  );
}

main();
