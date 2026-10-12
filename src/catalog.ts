import type { ChapterMeta } from './contracts.ts';
import { series } from './chapters/series/meta.ts';

/**
 * The single source of truth that collects every chapter's meta. (Pure data — three, d3, and the DOM must not be pulled in)
 * To add a chapter, create src/chapters/<id>/ and add one line here.
 * The <id>/index.html entry point is generated automatically by scripts/gen-entries.ts.
 */
export const catalog: readonly ChapterMeta[] = [series];
