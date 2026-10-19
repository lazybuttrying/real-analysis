import { describe, expect, it } from 'vitest';
import { buildLegacyPages, pages, renderPage, sitemapXml } from '../scripts/prerender.ts';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize } from '../src/contracts.ts';
import {
  FULLY_RETIRED_CHAPTER_IDS,
  LEGACY_CHAPTER_IDS,
  legacyChapterOf,
} from '../src/paths.ts';

/**
 * Integrity of the 10-chapter split:
 * - the catalog lists exactly the 10 logical chapters in order,
 * - no scene is lost or duplicated (109 unique),
 * - every chapter's scenes are ordered 1..N with 3 proven problems each.
 */

const EXPECTED_CHAPTERS = [
  'numbers',
  'sequences',
  'continuity',
  'topology',
  'approximation',
  'series',
  'power-series',
  'function-series',
  'differentiation',
  'integration',
] as const;

describe('catalog: the 10 chapters', () => {
  it('lists the 10 logical chapters in order', () => {
    expect(catalog.map((chapter) => chapter.id)).toEqual([...EXPECTED_CHAPTERS]);
  });

  it('has non-empty bilingual titles and summaries', () => {
    for (const chapter of catalog) {
      for (const lang of LANGS) {
        expect(localize(chapter.title, lang).trim().length, `${chapter.id} title (${lang})`).toBeGreaterThan(0);
        expect(localize(chapter.summary, lang).trim().length, `${chapter.id} summary (${lang})`).toBeGreaterThan(0);
      }
    }
  });

  it('covers 102 scenes with no loss or duplication', () => {
    const ids = catalog.flatMap((chapter) => chapter.scenes.map((scene) => scene.id));
    expect(ids).toHaveLength(109);
    expect(new Set(ids).size).toBe(109);
  });

  it('orders every chapter\'s scenes 1..N', () => {
    for (const chapter of catalog) {
      const orders = [...chapter.scenes].sort((a, b) => a.order - b.order).map((scene) => scene.order);
      expect(orders, chapter.id).toEqual(chapter.scenes.map((_, index) => index + 1));
    }
  });

  it('gives every scene a non-empty bilingual title and summary', () => {
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        for (const lang of LANGS) {
          expect(localize(scene.title, lang).trim().length, `${chapter.id}/${scene.id} title (${lang})`).toBeGreaterThan(0);
          expect(localize(scene.summary, lang).trim().length, `${chapter.id}/${scene.id} summary (${lang})`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('gives every scene exactly 3 problems with non-empty bilingual proofs', () => {
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        const problems = scene.problems ?? [];
        expect(problems).toHaveLength(3);
        const ids = problems.map((problem) => problem.id);
        expect(new Set(ids).size).toBe(3);
        for (const problem of problems) {
          expect(problem.proof.length, `${scene.id}/${problem.id}`).toBeGreaterThan(0);
          for (const step of problem.proof) {
            for (const lang of LANGS) {
              expect(localize(step.text, lang).trim().length, `${scene.id}/${problem.id} (${lang})`).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });

  it('uses only declared control keys in every problem preset', () => {
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        for (const problem of scene.problems ?? []) {
          for (const [key, value] of Object.entries(problem.preset)) {
            const spec = scene.controls.find((control) => control.key === key);
            expect(spec, `${scene.id}/${problem.id}: control '${key}' must be declared`).toBeDefined();
            if (spec?.kind === 'slider') {
              expect(typeof value).toBe('number');
            } else if (spec?.kind === 'toggle') {
              expect(typeof value).toBe('boolean');
            } else if (spec?.kind === 'select') {
              expect(spec.options).toContain(value);
            }
          }
        }
      }
    }
  });

  it('resolves every prerequisite to a real scene', () => {
    const sceneIds = new Set(catalog.flatMap((chapter) => chapter.scenes.map((scene) => scene.id)));
    for (const chapter of catalog) {
      for (const scene of chapter.scenes) {
        for (const prereq of scene.prerequisites ?? []) {
          expect(sceneIds.has(prereq), `${chapter.id}/${scene.id} prereq '${prereq}'`).toBe(true);
        }
      }
    }
  });
});

describe('legacy canonical pages', () => {
  it('retires limits and calculus fully; series keeps its id', () => {
    expect([...LEGACY_CHAPTER_IDS].sort()).toEqual(['calculus', 'limits', 'series']);
    expect([...FULLY_RETIRED_CHAPTER_IDS].sort()).toEqual(['calculus', 'limits']);
    expect(catalog.some((chapter) => chapter.id === 'series')).toBe(true);
  });

  it('maps every catalog scene to its chapter exactly once', () => {
    const catalogScenes = catalog.flatMap((chapter) =>
      chapter.scenes.map((scene) => [scene.id, chapter.id] as const),
    );
    expect(catalogScenes).toHaveLength(109);
    expect(new Set(catalogScenes.map(([sceneId]) => sceneId)).size).toBe(109);
  });

  it('assigns every scene its pre-split chapter (39 limits + 22 calculus + 16 moved series)', () => {
    const moved = catalog.flatMap((chapter) =>
      chapter.scenes
        .map((scene) => ({ sceneId: scene.id, chapterId: chapter.id, legacy: legacyChapterOf(scene.id, chapter.id) }))
        .filter(({ legacy, chapterId }) => legacy !== chapterId),
    );
    expect(moved).toHaveLength(77);
    const counts = new Map<string, number>();
    for (const { legacy } of moved) counts.set(legacy, (counts.get(legacy) ?? 0) + 1);
    expect(counts.get('limits')).toBe(39);
    expect(counts.get('calculus')).toBe(22);
    expect(counts.get('series')).toBe(16);
    // The scenes that stayed in the (reused) series chapter need no legacy page:
    // 16 pre-split + 2 post-split additions (integral-test, double-series).
    const stayed = catalog
      .find((chapter) => chapter.id === 'series')!
      .scenes.filter((scene) => legacyChapterOf(scene.id, 'series') === 'series');
    expect(stayed).toHaveLength(18);
  });

  it('emits one legacy page per retired scene URL, canonicalizing to the new URL', () => {
    const legacyPages = buildLegacyPages();
    expect(legacyPages).toHaveLength(77);
    const chapterOf = new Map(
      catalog.flatMap((chapter) => chapter.scenes.map((scene) => [scene.id, chapter.id] as const)),
    );
    const seen = new Set<string>();
    for (const page of legacyPages) {
      for (const lang of LANGS) {
        const segments = page.segments(lang);
        expect(segments).toHaveLength(3);
        const [l, legacyId, sceneId] = segments;
        expect(l).toBe(lang);
        // Never a hub or an exercises page: retired hubs/exercises emit nothing.
        expect(sceneId).not.toBe('exercises');
        expect(sceneId).not.toBe(legacyId);
        expect(page.url(lang)).toBe(`/real-analysis/${lang}/${legacyId}/${sceneId}/`);
        const canonical = page.canonicalUrl?.(lang);
        expect(canonical, `${legacyId}/${sceneId}`).toBeDefined();
        expect(canonical).toBe(`/real-analysis/${lang}/${chapterOf.get(sceneId!)}/${sceneId}/`);
        expect(canonical).not.toBe(page.url(lang));
        const key = `${lang}/${legacyId}/${sceneId}`;
        expect(seen.has(key), `duplicate legacy page ${key}`).toBe(false);
        seen.add(key);
      }
    }
  });

  it('serves full content with canonical (no redirect) at retired scene URLs', () => {
    const template =
      '<!doctype html><html lang="ko"><head><title>x</title></head><body><div id="app"></div></body></html>';
    const legacyPages = buildLegacyPages();
    // One sample per retired origin: limits -> sequences, calculus ->
    // integration, moved series scene -> power-series.
    for (const sceneId of ['epsilon-n', 'riemann', 'power-series']) {
      const page = legacyPages.find((candidate) => candidate.segments('ko')[2] === sceneId);
      expect(page, `legacy page for ${sceneId}`).toBeDefined();
      for (const lang of LANGS) {
        const html = renderPage(template, page!, lang, undefined);
        expect(html).toContain(`<link rel="canonical" href="https://sdykim.me${page!.canonicalUrl!(lang)}" />`);
        expect(html, 'no meta refresh').not.toContain('http-equiv="refresh"');
        expect(html, 'no JS redirect').not.toContain('location.replace');
        // Full content, not a stub: the scene heading and its problems render.
        expect(html).toContain('<div id="app"><h1>');
        expect(html).toContain('class="problems"');
      }
    }
  });

  it('gives legacy pages byte-identical bodies to their canonical pages', () => {
    const chapterIds = new Set(catalog.map((chapter) => chapter.id));
    const canonicalByScene = new Map<string, (typeof pages)[number]>();
    for (const page of pages) {
      const segments = page.segments('ko');
      if (segments.length === 3 && chapterIds.has(segments[1]!) && segments[2] !== 'exercises') {
        canonicalByScene.set(segments[2]!, page);
      }
    }
    expect(canonicalByScene.size).toBe(109);
    for (const page of buildLegacyPages()) {
      const sceneId = page.segments('ko')[2]!;
      const canonical = canonicalByScene.get(sceneId);
      expect(canonical, `canonical page for ${sceneId}`).toBeDefined();
      for (const lang of LANGS) {
        expect(page.body(lang), `${sceneId} body (${lang})`).toBe(canonical!.body(lang));
      }
    }
  });

  it('lists only canonical URLs in the sitemap', () => {
    const xml = sitemapXml();
    const legacyUrls = buildLegacyPages().flatMap((page) => LANGS.map((lang) => `https://sdykim.me${page.url(lang)}`));
    expect(legacyUrls).toHaveLength(154);
    for (const legacyUrl of legacyUrls) {
      expect(xml, `sitemap must not list ${legacyUrl}`).not.toContain(`<loc>${legacyUrl}</loc>`);
    }
    expect(xml).toContain('<loc>https://sdykim.me/real-analysis/ko/sequences/epsilon-n/</loc>');
    expect(xml).toContain('<loc>https://sdykim.me/real-analysis/en/integration/riemann/</loc>');
    expect((xml.match(/<loc>/g) ?? []).length).toBe(pages.length * LANGS.length);
  });
});
