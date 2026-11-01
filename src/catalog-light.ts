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
 * The client view of the catalog: the chapter metas exactly as the meta
 * files export them, with no problems data attached.
 *
 * This module is the only catalog aggregation client code may import.
 * The full view (catalog.ts) additionally imports every chapter's
 * problems map; if client code imported that module, the bundler would
 * place the whole problems corpus in a shared chunk and every page
 * would preload it, which is what this split exists to prevent. Node
 * consumers (prerender, search index, tests) use catalog.ts instead.
 *
 * Chapter order here IS the chapter numbering, exactly as in
 * catalog.ts; the two modules must list the chapters in the same order.
 */
export const catalogLight: readonly ChapterMeta[] = [
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
