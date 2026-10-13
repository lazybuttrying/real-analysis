import type { ChapterMeta } from './contracts.ts';
import { limits } from './chapters/limits/meta.ts';
import { series } from './chapters/series/meta.ts';
import { calculus } from './chapters/calculus/meta.ts';

/**
 * The single source of truth that collects every chapter's meta. (Pure data — three, d3, and the DOM must not be pulled in)
 * To add a chapter, create src/chapters/<id>/ and add one line here.
 * The <id>/index.html entry point is generated automatically by scripts/gen-entries.ts.
 *
 * Chapter order here IS the chapter numbering. The shell derives "chapter 1, 2, ..."
 * from this array's index wherever a chapter title is displayed, so a number is
 * never stored in any meta file. (Limits comes first, matching the textbooks:
 * limits precede series in both Kim, Kim & Gye and Tao.)
 */
export const catalog: readonly ChapterMeta[] = [limits, series, calculus];
