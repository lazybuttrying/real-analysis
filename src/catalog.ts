import type { ChapterMeta } from './contracts.ts';
import { proofs } from './chapters/proofs/meta.ts';
import { numbers } from './chapters/numbers/meta.ts';
import { sequences } from './chapters/sequences/meta.ts';
import { continuity } from './chapters/continuity/meta.ts';
import { topology } from './chapters/topology/meta.ts';
import { approximation } from './chapters/approximation/meta.ts';
import { series } from './chapters/series/meta.ts';
import { powerSeries } from './chapters/power-series/meta.ts';
import { functionSeries } from './chapters/function-series/meta.ts';
import { differentiation } from './chapters/differentiation/meta.ts';
import { integration } from './chapters/integration/meta.ts';

/**
 * The single source of truth that collects every chapter's meta. (Pure data — three, d3, and the DOM must not be pulled in)
 * To add a chapter, create src/chapters/<id>/ and add one line here.
 * The <id>/index.html entry point is generated automatically by scripts/gen-entries.ts.
 *
 * Chapter order here IS the chapter numbering. The shell derives "chapter 1, 2, ..."
 * from this array's index wherever a chapter title is displayed, so a number is
 * never stored in any meta file.
 *
 * NOTE (10-chapter split, 2026-10-18): the chapters are LOGICAL groupings.
 * The scene files (models/, scenes/, problems/) live in the legacy scene
 * stores src/chapters/{limits,series,calculus}/; each chapter's meta.ts,
 * loaders.ts, entry.ts, and exercises.ts reference them via relative paths.
 * See docs/ARCHITECTURE.md ("Physical vs logical chapters").
 */
export const catalog: readonly ChapterMeta[] = [
  proofs,
  numbers,
  sequences,
  continuity,
  topology,
  approximation,
  series,
  powerSeries,
  functionSeries,
  differentiation,
  integration,
];
