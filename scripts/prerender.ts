import type { ExerciseMeta } from '../src/contracts.ts';
import { site, prerenderExpectations } from '../src/site.config.ts';
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
import { createPrerender } from './prerender-factory.ts';

/**
 * Site-owned prerender entry. The prerender itself lives in the
 * template-owned factory (scripts/prerender-factory.ts); this shim supplies
 * the site-specific inputs — the site config, this site's chapter-exercises
 * map, and its content expectations — and re-exports the builders the tests
 * import.
 */
const chapterExercises = new Map<string, readonly ExerciseMeta[]>([
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

const prerender = createPrerender({ site, chapterExercises, expectations: prerenderExpectations });

export const pages = prerender.pages;
export const renderPage = prerender.renderPage;
export const buildLegacyPages = prerender.buildLegacyPages;
export const sitemapXml = prerender.sitemapXml;

// Guarded so vitest can import the builders (renderPage, buildLegacyPages,
// sitemapXml) without running the full prerender.
if (process.argv[1] !== undefined && /prerender\.ts$/.test(process.argv[1])) {
  prerender.main();
}
