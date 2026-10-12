import { describe, expect, it } from 'vitest';
import { chapterUrl, fallbackLang, homeUrl, isLang, parsePath, sceneUrl, withLang } from '../src/paths';

const BASE = '/real-analysis/';

describe('URL builders', () => {
  it('prefix every page with the language segment', () => {
    expect(homeUrl(BASE, 'ko')).toBe('/real-analysis/ko/');
    expect(homeUrl(BASE, 'en')).toBe('/real-analysis/en/');
    expect(chapterUrl(BASE, 'en', 'series')).toBe('/real-analysis/en/series/');
    expect(sceneUrl(BASE, 'ko', 'series', 'grandi')).toBe('/real-analysis/ko/series/grandi/');
  });
});

describe('parsePath', () => {
  it('reads lang, chapter, and scene from a full path', () => {
    expect(parsePath(BASE, '/real-analysis/en/series/grandi/')).toEqual({
      lang: 'en',
      chapterId: 'series',
      sceneId: 'grandi',
    });
  });

  it('reads a language home and a chapter hub', () => {
    expect(parsePath(BASE, '/real-analysis/ko/')).toEqual({ lang: 'ko', chapterId: undefined, sceneId: undefined });
    expect(parsePath(BASE, '/real-analysis/en/series/')).toEqual({ lang: 'en', chapterId: 'series', sceneId: undefined });
  });

  it('reports un-prefixed legacy paths with lang undefined', () => {
    expect(parsePath(BASE, '/real-analysis/series/grandi/')).toEqual({
      lang: undefined,
      chapterId: 'series',
      sceneId: 'grandi',
    });
    expect(parsePath(BASE, '/real-analysis/')).toEqual({ lang: undefined, chapterId: undefined, sceneId: undefined });
  });
});

describe('build/parse round-trips', () => {
  it('scene and chapter URLs parse back to the same segments', () => {
    expect(parsePath(BASE, sceneUrl(BASE, 'en', 'series', 'basel'))).toEqual({
      lang: 'en',
      chapterId: 'series',
      sceneId: 'basel',
    });
    expect(parsePath(BASE, chapterUrl(BASE, 'ko', 'series'))).toEqual({
      lang: 'ko',
      chapterId: 'series',
      sceneId: undefined,
    });
    expect(parsePath(BASE, homeUrl(BASE, 'en'))).toEqual({ lang: 'en', chapterId: undefined, sceneId: undefined });
  });
});

describe('withLang', () => {
  it('changes only the language segment', () => {
    const parsed = parsePath(BASE, '/real-analysis/en/series/grandi/');
    expect(withLang(BASE, parsed, 'ko')).toBe('/real-analysis/ko/series/grandi/');
    expect(withLang(BASE, parsePath(BASE, '/real-analysis/en/'), 'ko')).toBe('/real-analysis/ko/');
    expect(withLang(BASE, parsePath(BASE, '/real-analysis/ko/series/'), 'en')).toBe('/real-analysis/en/series/');
  });
});

describe('language helpers', () => {
  it('isLang accepts exactly ko and en', () => {
    expect(isLang('ko')).toBe(true);
    expect(isLang('en')).toBe(true);
    expect(isLang('fr')).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });

  it('fallbackLang uses the stored choice when valid, else ko', () => {
    expect(fallbackLang('en')).toBe('en');
    expect(fallbackLang('ko')).toBe('ko');
    expect(fallbackLang('fr')).toBe('ko');
    expect(fallbackLang(null)).toBe('ko');
    expect(fallbackLang(undefined)).toBe('ko');
  });
});
