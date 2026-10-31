import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import { catalog } from '../src/catalog.ts';
import { buildConceptMap } from '../src/concept-map.ts';
import { LANGS, localize, splitInlineMath, stripInlineMath, type ChapterMeta, type ExerciseDifficulty, type ExerciseMeta, type Lang, type LocalizedText, type ProblemKind, type SceneMeta } from '../src/contracts.ts';
import { ERRATA_AS_OF, ERRATA_REPORT_URL, errata } from '../src/errata.ts';
import { glossary } from '../src/glossary.ts';
import { learningPaths, type LearningPath } from '../src/learning-paths.ts';
import { chapterUrl, errataUrl, exercisesUrl, glossaryUrl, homeUrl, legacyChapterOf, pathDetailUrl, pathsUrl, sceneUrl } from '../src/paths.ts';
import { buildSearchIndex } from '../src/search-index.ts';
import { sceneGroups } from '../src/sections.ts';
import { STRINGS } from '../src/shell/i18n.ts';
import { htmlKindFragments, paragraphs, problemCardBlocks, problemKind } from '../src/shell/kind-ui.ts';

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
 *
 * This module is the template-owned factory. The site-owned shim in
 * scripts/prerender.ts calls createPrerender with the site's config, its
 * chapter-exercises map, and its content expectations, and re-exports the
 * returned builders (pages, renderPage, buildLegacyPages, sitemapXml).
 */

/** Content expectations the prerender self-check enforces, supplied per site (src/site.config.ts). */
export interface PrerenderExpectations {
  totalExercises: number;
  /** Optional breakdown appended to the count in failure messages, e.g. '6+4+4+4+4+4'. */
  totalExercisesDetail?: string;
  /** The concept map must have more edges than this. */
  minConceptMapEdges: number;
  legacyPages: number;
  /** Optional breakdown appended to the count in failure messages. */
  legacyPagesDetail?: string;
}

/** Everything the prerender needs that differs per site. */
export interface PrerenderDeps {
  /** The site's config (src/site.config.ts): the English name is the prerender's SITE_NAME; base is the SITE_BASE default. */
  site: { name: LocalizedText; base: string };
  /** Chapter id -> that chapter's exercises (built by the site-owned shim). */
  chapterExercises: ReadonlyMap<string, readonly ExerciseMeta[]>;
  expectations: PrerenderExpectations;
}

export interface Page {
  /** Path segments below dist/, e.g. ['en', 'series', 'grandi'] */
  segments: (lang: Lang) => string[];
  /** Root-relative URL of the page (with base, no origin). */
  url: (lang: Lang) => string;
  /**
   * Overrides the <link rel="canonical"> target. Legacy scene pages serve
   * the full content at their retired URL but canonicalize to the scene's
   * new chapter URL.
   */
  canonicalUrl?: (lang: Lang) => string;
  title: (lang: Lang) => string;
  description: (lang: Lang) => string;
  body: (lang: Lang) => string;
  /** Which built entry HTML to use as the shell. */
  template: 'home' | string;
  formulas?: boolean;
}

/**
 * Builds the prerender for one site. Returns the page builders the tests
 * import (via the shim) plus main(), which the shim runs when the file is
 * executed directly.
 */
export function createPrerender(deps: PrerenderDeps) {
  const expectations = deps.expectations;
  const expectedDetail = (detail: string | undefined): string => (detail ? `: ${detail}` : '');

  const ROOT = fileURLToPath(new URL('..', import.meta.url));
  const DIST = join(ROOT, 'dist');
  const SITE_NAME = deps.site.name.en;
  const ORIGIN = (process.env.SITE_ORIGIN ?? 'https://sdykim.me').replace(/\/$/, '');

  function normalizeBase(raw: string): string {
    const withLead = raw.startsWith('/') ? raw : `/${raw}`;
    return withLead.endsWith('/') ? withLead : `${withLead}/`;
  }
  const BASE = normalizeBase(process.env.SITE_BASE ?? deps.site.base);

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

  /** Static body form of a prose field as one <p> per paragraph. */
  const renderParasHtml = (text: string, cls?: string): string =>
    paragraphs(text)
      .map((p) => (cls ? `<p class="${cls}">${renderSummaryHtml(p)}</p>` : `<p>${renderSummaryHtml(p)}</p>`))
      .join('\n');

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
  /** HTML fragments of the shared problem-card assembly (src/shell/kind-ui.ts). */
  const kindFragments = htmlKindFragments({ renderRich: renderSummaryHtml, renderDisplay: renderDisplayHtml, escapeText: escapeHtml });

  /** The type chip for non-proof kinds; empty for 'proof' so classic cards stay byte-identical. */
  const kindBadgeHtml = (kind: ProblemKind, lang: Lang): string => kindFragments.badge(kind, lang)[0] ?? '';

  const renderProblemsHtml = (scene: SceneMeta, lang: Lang): string => {
    const problems = scene.problems;
    if (!problems || problems.length === 0) return '';
    const cards = problems
      .map((problem) => {
        const kind = problemKind(problem);
        const lines = [`<article class="problem${kind !== 'proof' ? ` kind-${kind}` : ''}" id="problem-${scene.id}-${problem.id}">`];
        const figure = `<figure class="problem-viz"><figcaption>${renderSummaryHtml(localize(problem.presetCaption, lang))}</figcaption></figure>`;
        const blocks = problemCardBlocks(problem, problem.proof, lang, {
          statementClass: 'problem-statement',
          summaryLabel: localize(problem.isHint ? STRINGS.showHint : STRINGS.showProof, lang),
          middle: [figure],
          fragments: kindFragments,
        });
        for (const block of blocks) lines.push(`  ${block}`);
        lines.push('  </article>');
        return lines.join('\n');
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
  const exercisesByChapter = deps.chapterExercises;

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
            const topics = exercise.topics
              .map(
                (topicId) =>
                  `<li><a href="${sceneUrl(BASE, lang, chapter.id, topicId)}">${escapeHtml(sceneTitleOf.get(topicId) ?? topicId)}</a></li>`,
              )
              .join('\n');
            const viz = exercise.viz
              ? `<figure class="exercise-viz"><figcaption>${renderSummaryHtml(localize(exercise.viz.presetCaption, lang))}</figcaption></figure>`
              : '';
            const kind = problemKind(exercise);
            const lines = [
              `<article class="exercise problem${kind !== 'proof' ? ` kind-${kind}` : ''}" id="exercise-${exercise.id}">`,
              `  <div class="exercise-badges"><span class="exercise-number">${index + 1}</span><span class="difficulty-badge difficulty-${difficulty}">${difficultyHeading(difficulty, lang)}</span>${kindBadgeHtml(kind, lang)}</div>`,
            ];
            const blocks = problemCardBlocks(exercise, exercise.solution, lang, {
              includeBadge: false,
              statementClass: 'exercise-statement',
              summaryLabel: localize(STRINGS.showSolution, lang),
              middle: ['<ul class="exercise-topics">', topics, '</ul>', viz],
              fragments: kindFragments,
            });
            for (const block of blocks) lines.push(`  ${block}`);
            lines.push('  </article>');
            return lines.join('\n');
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
        ...(exercise.answer ? [localize(exercise.answer, lang)] : []),
        ...(exercise.verdict ? [localize(exercise.verdict, lang)] : []),
        ...(exercise.explanation ? [localize(exercise.explanation, lang)] : []),
        ...(exercise.choices ?? []).map((choice) => localize(choice, lang)),
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
  <h3>${escapeHtml(stripInlineMath(localize(entry.term, lang)))}<a class="anchor-btn" href="#term-${entry.id}" aria-label="${escapeHtml(localize({ ko: '이 용어의 바로가기 링크', en: 'Link to this term' }, lang))}">¶</a></h3>
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

  /** Static body of the errata page: the correction log, newest first, plus the report channel. */
  const renderErrataHtml = (lang: Lang): string => {
    const parts = [
      `<h1>${escapeHtml(localize(STRINGS.errata, lang))}</h1>`,
      `<p>${escapeHtml(localize(STRINGS.errataIntro, lang))}</p>`,
      `<p class="errata-asof">${escapeHtml(localize(STRINGS.errataAsOf, lang))}: ${ERRATA_AS_OF}</p>`,
    ];
    if (errata.length === 0) {
      parts.push(`<p>${escapeHtml(localize(STRINGS.errataEmpty, lang))}</p>`);
    } else {
      const entries = [...errata]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((entry) => {
          let place = escapeHtml(localize(STRINGS.errataSiteWide, lang));
          if (entry.chapterId && entry.sceneId) {
            const chapter = catalog.find((c) => c.id === entry.chapterId);
            const scene = chapter?.scenes.find((s) => s.id === entry.sceneId);
            if (chapter && scene) {
              place = `<a href="${sceneUrl(BASE, lang, chapter.id, scene.id)}">${escapeHtml(localize(chapter.title, lang))} — ${escapeHtml(localize(scene.title, lang))}</a>`;
            }
          }
          return `<article class="errata-entry" id="errata-${entry.id}">
  <p class="errata-meta"><time datetime="${entry.date}">${entry.date}</time> — ${place}</p>
  <h2>${escapeHtml(localize(entry.title, lang))}</h2>
  <p>${escapeHtml(localize(entry.detail, lang))}</p>
</article>`;
        })
        .join('\n');
      parts.push(`<div class="errata-list">\n${entries}\n</div>`);
    }
    parts.push(
      `<section class="errata-report">\n  <p>${escapeHtml(localize(STRINGS.errataReport, lang))}</p>\n  <p><a href="${ERRATA_REPORT_URL}">${escapeHtml(localize(STRINGS.errataReportLink, lang))}</a></p>\n</section>`,
    );
    return parts.join('\n');
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
          ...sceneGroups(chapter, [...chapter.scenes].sort((a, b) => a.order - b.order)).flatMap((group) => [
            ...(group.section ? [`<h2 class="hub-section-title">${escapeHtml(localize(group.section.title, lang))}</h2>`] : []),
            '<ul>',
            ...group.scenes.map(
              (scene) =>
                `<li><a href="${sceneUrl(BASE, lang, chapter.id, scene.id)}">${escapeHtml(localize(scene.title, lang))}</a> — ${renderSummaryHtml(localize(scene.summary, lang))}</li>`,
            ),
            '</ul>',
          ]),
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
      pages.push(makeScenePage(chapter, chapterNumber, scene));
    }
  }

  /**
   * One scene's static page. The optional override serves the same page at a
   * retired URL: identical body and template (the scene's new chapter entry),
   * only the path segments, the page URL, and the canonical target differ.
   */
  function makeScenePage(
    chapter: ChapterMeta,
    chapterNumber: number,
    scene: SceneMeta,
    override?: { segments: (lang: Lang) => string[]; url: (lang: Lang) => string; canonicalUrl: (lang: Lang) => string },
  ): Page {
    return {
      segments: override?.segments ?? ((lang) => [lang, chapter.id, scene.id]),
      url: override?.url ?? ((lang) => sceneUrl(BASE, lang, chapter.id, scene.id)),
      canonicalUrl: override?.canonicalUrl,
      title: (lang) => `${localize(scene.title, lang)} | ${SITE_NAME}`,
      description: (lang) => stripInlineMath(localize(scene.summary, lang)),
      template: chapter.id,
      formulas: (scene.tex?.length ?? 0) > 0 || hasInlineMath(scene.summary) || (scene.problems?.length ?? 0) > 0,
      body: (lang) =>
        [
          `<h1>${escapeHtml(localize(scene.title, lang))}</h1>`,
          renderParasHtml(localize(scene.summary, lang)),
          ...(scene.tex ?? []).map((formula) => renderDisplayHtml(formula)),
          renderPathChipsHtml(chapter.id, scene.id, lang),
          renderProblemsHtml(scene, lang),
          renderPagerHtml(chapter.id, scene.id, lang),
          `<p><a href="${chapterUrl(BASE, lang, chapter.id)}">${chapterNumber}. ${escapeHtml(localize(chapter.title, lang))}</a></p>`,
        ].join('\n'),
    };
  }

  /**
   * Legacy canonical pages for retired scene URLs (10-chapter split). Each
   * serves the scene's FULL content at its old URL (HTTP 200, no redirect)
   * with <link rel="canonical"> pointing at the new chapter URL — Google's
   * preferred consolidation signal on static hosting, where true 301s are
   * unavailable. Not in the sitemap.
   *
   * Covered: every scene whose pre-split chapter differs from its current one
   * (the expected count is pinned by the site's prerender expectations).
   * Retired hubs and exercises pages get nothing (they 404).
   */
  function buildLegacyPages(): Page[] {
    const legacy: Page[] = [];
    for (const [index, chapter] of catalog.entries()) {
      const chapterNumber = index + 1;
      for (const scene of [...chapter.scenes].sort((a, b) => a.order - b.order)) {
        const legacyChapterId = legacyChapterOf(scene.id, chapter.id);
        if (legacyChapterId === chapter.id) continue; // URL unchanged: no legacy page needed
        legacy.push(
          makeScenePage(chapter, chapterNumber, scene, {
            segments: (lang) => [lang, legacyChapterId, scene.id],
            url: (lang) => sceneUrl(BASE, lang, legacyChapterId, scene.id),
            canonicalUrl: (lang) => sceneUrl(BASE, lang, chapter.id, scene.id),
          }),
        );
      }
    }
    return legacy;
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

  pages.push({
    segments: (lang) => [lang, 'errata'],
    url: (lang) => errataUrl(BASE, lang),
    title: (lang) => `${localize(STRINGS.errata, lang)} | ${SITE_NAME}`,
    description: (lang) => localize(STRINGS.errataIntro, lang),
    template: 'home',
    formulas: errata.some((entry) => hasInlineMath(entry.detail)),
    body: renderErrataHtml,
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
    // redistributed the exercises by topic fit).
    const KEBAB_CASE = /^[a-z][a-z0-9-]*$/;
    /** The shared content-text checks: non-empty, no $ delimiters, balanced \(...\). */
    const checkTextValue = (tag: string, field: string, value: string, lang: Lang): void => {
      if (!value.trim()) problems.push(`${tag} has an empty ${field} (${lang})`);
      if (value.includes('$')) problems.push(`${tag} uses a $ delimiter in ${field} (${lang})`);
      const opens = (value.match(/\\\(/g) ?? []).length;
      const closes = (value.match(/\\\)/g) ?? []).length;
      if (opens !== closes) problems.push(`${tag} has unbalanced \\(...\\) in ${field} (${lang})`);
    };
    const checkExerciseText = (tag: string, field: string, text: { ko: string; en: string }): void => {
      for (const lang of LANGS) checkTextValue(tag, field, localize(text, lang), lang);
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
    if (totalExercises !== expectations.totalExercises)
      problems.push(
        `total exercises = ${totalExercises} (expected ${expectations.totalExercises}${expectedDetail(expectations.totalExercisesDetail)})`,
      );
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
          checkTextValue(`glossary term '${entry.id}'`, field, text, lang);
        }
      }
    }
    // Chapter sections: when declared, their sceneIds must partition the
    // chapter's scenes exactly, in scene order, with non-empty titles.
    for (const chapter of catalog) {
      if (!chapter.sections) continue;
      const orderedIds = [...chapter.scenes].sort((a, b) => a.order - b.order).map((s) => s.id);
      const grouped = chapter.sections.flatMap((section) => section.sceneIds);
      if (JSON.stringify(grouped) !== JSON.stringify(orderedIds)) {
        problems.push(`chapter '${chapter.id}' sections do not partition its scenes in order`);
      }
      const seenSectionIds = new Set<string>();
      for (const section of chapter.sections) {
        if (seenSectionIds.has(section.id)) problems.push(`chapter '${chapter.id}' has a duplicate section id '${section.id}'`);
        seenSectionIds.add(section.id);
        for (const lang of LANGS) checkTextValue(`chapter '${chapter.id}' section '${section.id}'`, 'title', localize(section.title, lang), lang);
      }
    }
    // Errata entries: unique ids, ISO dates, real chapter/scene links when
    // present, non-empty text in both languages.
    const seenErrataIds = new Set<string>();
    for (const entry of errata) {
      if (seenErrataIds.has(entry.id)) problems.push(`errata has a duplicate id '${entry.id}'`);
      seenErrataIds.add(entry.id);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) problems.push(`errata entry '${entry.id}' has a non-ISO date '${entry.date}'`);
      if ((entry.chapterId === undefined) !== (entry.sceneId === undefined)) {
        problems.push(`errata entry '${entry.id}' must set chapterId and sceneId together`);
      }
      if (entry.chapterId && entry.sceneId && !sceneOf.get(`${entry.chapterId}/${entry.sceneId}`)) {
        problems.push(`errata entry '${entry.id}' links to unknown scene '${entry.chapterId}/${entry.sceneId}'`);
      }
      for (const lang of LANGS) {
        checkTextValue(`errata entry '${entry.id}'`, 'title', localize(entry.title, lang), lang);
        checkTextValue(`errata entry '${entry.id}'`, 'detail', localize(entry.detail, lang), lang);
      }
    }
    // Learning paths: unique ids, real chapter/scene links, non-empty text in
    // both languages, well-formed math delimiters, no duplicate scenes in a path.
    const seenPathIds = new Set<string>();
    for (const path of learningPaths) {
      if (seenPathIds.has(path.id)) problems.push(`learning path has a duplicate id '${path.id}'`);
      seenPathIds.add(path.id);
      if (!KEBAB_CASE.test(path.id)) problems.push(`learning path id '${path.id}' is not kebab-case`);
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
          checkTextValue(`learning path '${path.id}'`, field, text, lang);
        }
      }
    }
    // Concept map: every edge endpoint is a real scene, no self-loops, no
    // duplicate edges, and the graph is dense enough to be useful.
    const conceptMap = buildConceptMap();
    if (conceptMap.edges.length <= expectations.minConceptMapEdges) {
      problems.push(
        `concept map has only ${conceptMap.edges.length} edges (expected > ${expectations.minConceptMapEdges})`,
      );
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
    // Legacy canonical pages: one per retired scene URL,
    // every canonical target is a real canonical page URL, and no legacy page
    // shadows a canonical URL.
    const legacyPages = buildLegacyPages();
    const canonicalUrls = new Set<string>();
    for (const page of pages) {
      for (const lang of LANGS) canonicalUrls.add(page.url(lang));
    }
    const legacyUrls = new Set<string>();
    for (const page of legacyPages) {
      for (const lang of LANGS) {
        const legacyUrl = page.url(lang);
        const target = page.canonicalUrl?.(lang) ?? '';
        if (!canonicalUrls.has(target)) problems.push(`legacy page '${legacyUrl}' canonicalizes to unknown page '${target}'`);
        if (canonicalUrls.has(legacyUrl)) problems.push(`legacy page '${legacyUrl}' shadows a canonical URL`);
        if (legacyUrls.has(legacyUrl)) problems.push(`duplicate legacy page '${legacyUrl}'`);
        legacyUrls.add(legacyUrl);
      }
    }
    if (legacyPages.length !== expectations.legacyPages) {
      problems.push(
        `legacy pages = ${legacyPages.length} (expected ${expectations.legacyPages}${expectedDetail(expectations.legacyPagesDetail)})`,
      );
    }
    return problems;
  }

  function renderPage(template: string, page: Page, lang: Lang, katexCss: string | undefined): string {
    const absolute = (l: Lang): string => `${ORIGIN}${page.url(l)}`;
    const canonical = (l: Lang): string => `${ORIGIN}${(page.canonicalUrl ?? page.url)(l)}`;
    const headExtras = [
      `<meta name="description" content="${escapeHtml(page.description(lang))}" />`,
      `<link rel="canonical" href="${canonical(lang)}" />`,
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

    // Legacy canonical pages for retired scene URLs (not in the sitemap):
    // full content served at the old URL, canonical pointing at the new one.
    const legacyPages = buildLegacyPages();
    for (const page of legacyPages) {
      const template = templates.get(page.template);
      if (!template) throw new Error(`[prerender] no template for ${page.template}`);
      for (const lang of LANGS) {
        const dir = join(DIST, ...page.segments(lang));
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), renderPage(template, page, lang, katexCss));
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
      `prerender: wrote ${written} pages (${LANGS.length} languages × ${pages.length} pages: home (with embedded concept map) + ${catalog.length} hub(s) + ${catalog.reduce((n, c) => n + c.scenes.length, 0)} scenes + ${catalog.length} exercises page(s) + 1 glossary + 1 errata + 1 paths index + ${learningPaths.length} path detail(s)), ${legacyPages.length} legacy canonical pages (not in sitemap), sitemap.xml (${written} URLs), 404.html, robots.txt, search-index JSON`,
    );
  }

  return { pages, renderPage, buildLegacyPages, sitemapXml, main };
}
