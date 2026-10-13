import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import { catalog } from '../src/catalog.ts';
import { LANGS, localize, splitInlineMath, stripInlineMath, type Lang } from '../src/contracts.ts';
import { chapterUrl, homeUrl, sceneUrl } from '../src/paths.ts';
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
const ORIGIN = (process.env.SITE_ORIGIN ?? 'https://lazybuttrying.github.io').replace(/\/$/, '');

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
          (chapter) =>
            `<li><a href="${chapterUrl(BASE, lang, chapter.id)}">${escapeHtml(localize(chapter.title, lang))}</a> — ${renderSummaryHtml(localize(chapter.summary, lang))}</li>`,
        ),
        '</ul>',
      ].join('\n'),
  },
];

for (const chapter of catalog) {
  pages.push({
    segments: (lang) => [lang, chapter.id],
    url: (lang) => chapterUrl(BASE, lang, chapter.id),
    title: (lang) => `${localize(chapter.title, lang)} | ${SITE_NAME}`,
    description: (lang) => stripInlineMath(localize(chapter.summary, lang)),
    template: chapter.id,
    formulas: hasInlineMath(chapter.summary) || chapter.scenes.some((scene) => hasInlineMath(scene.summary)),
    body: (lang) =>
      [
        `<h1>${escapeHtml(localize(chapter.title, lang))}</h1>`,
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

  for (const scene of [...chapter.scenes].sort((a, b) => a.order - b.order)) {
    pages.push({
      segments: (lang) => [lang, chapter.id, scene.id],
      url: (lang) => sceneUrl(BASE, lang, chapter.id, scene.id),
      title: (lang) => `${localize(scene.title, lang)} | ${SITE_NAME}`,
      description: (lang) => stripInlineMath(localize(scene.summary, lang)),
      template: chapter.id,
      formulas: (scene.tex?.length ?? 0) > 0 || hasInlineMath(scene.summary),
      body: (lang) =>
        [
          `<h1>${escapeHtml(localize(scene.title, lang))}</h1>`,
          `<p>${renderSummaryHtml(localize(scene.summary, lang))}</p>`,
          ...(scene.tex ?? []).map(
            (formula) => `<div class="tex-block">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`,
          ),
          `<p><a href="${chapterUrl(BASE, lang, chapter.id)}">${escapeHtml(localize(chapter.title, lang))}</a></p>`,
        ].join('\n'),
    });
  }
}

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
    }
  }
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

  writeFileSync(join(DIST, 'index.html'), rootRedirectHtml());
  writeFileSync(join(DIST, '404.html'), notFoundHtml());
  writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml());
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}${BASE}sitemap.xml\n`);

  console.log(
    `prerender: wrote ${written} pages (${LANGS.length} languages × ${pages.length} pages: home + ${catalog.length} hub(s) + ${catalog.reduce((n, c) => n + c.scenes.length, 0)} scenes), sitemap.xml (${written} URLs), 404.html, robots.txt`,
  );
}

main();
