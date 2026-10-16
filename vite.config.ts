import { fileURLToPath } from 'node:url';
import { defineConfig, type Connect, type Plugin } from 'vite';
// Modules that Node reads directly (config, scripts, catalog, meta) are imported with extensions.
import { syncChapterEntries } from './scripts/gen-entries.ts';
import { catalog } from './src/catalog.ts';

/** Deployment base path. When moving to a custom domain, build with SITE_BASE=/ . */
function normalizeBase(raw: string): string {
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

const BASE = normalizeBase(process.env.SITE_BASE ?? '/real-analysis/');

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const fromRoot = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

/** The single source of truth for the chapter list is src/catalog.ts. It is only read here. */
const chapterIds = catalog.map((chapter) => chapter.id);

const LANG_SEGMENTS = new Set(['ko', 'en']);

/**
 * For the dev/preview server: rewrites page requests to the entry that boots them.
 * Language-prefixed paths (/<lang>/<chapter>/<scene>/, /<lang>/) and legacy
 * un-prefixed chapter paths are handled; the shell itself redirects legacy
 * paths to the preferred language once booted.
 * In static deployment, the prerender step creates an index.html per page and takes over this role.
 */
function chapterFallback(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const url = req.url ?? '';
    const queryAt = url.indexOf('?');
    const pathname = queryAt === -1 ? url : url.slice(0, queryAt);
    const query = queryAt === -1 ? '' : url.slice(queryAt);

    if (pathname.startsWith(BASE) && !/\.[a-z0-9]+$/i.test(pathname)) {
      const segments = pathname.slice(BASE.length).split('/').filter(Boolean);
      const [first, second] = segments;
      // The glossary page lives on the home entry.
      if (first === 'glossary' || (first !== undefined && LANG_SEGMENTS.has(first) && second === 'glossary')) {
        req.url = `${BASE}index.html${query}`;
      } else {
        const chapter = first !== undefined && LANG_SEGMENTS.has(first) ? second : first;
        if (chapter !== undefined && chapterIds.includes(chapter)) {
          req.url = `${BASE}${chapter}/index.html${query}`;
        } else if (first !== undefined && LANG_SEGMENTS.has(first) && second === undefined) {
          req.url = `${BASE}index.html${query}`;
        }
      }
    }
    next();
  };

  return {
    name: 'chapter-fallback',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

/**
 * Generates the <chapter>/index.html (Vite entry point) each chapter needs from the catalog.
 * It runs in the config phase, so it is created first no matter how Vite is started: dev, build, or preview.
 */
function chapterEntries(): Plugin {
  return {
    name: 'chapter-entries',
    config() {
      syncChapterEntries(ROOT, catalog);
    },
  };
}

const D3_PACKAGES =/node_modules\/(d3(-[^/]+)?|internmap|delaunator|robust-predicates)\//;

/** Heavy dependencies are split into shared, chapter-independent chunks so the cache is reused across chapters. */
function vendorChunk(id: string): string | undefined {
  if (id.includes('node_modules/three/')) return 'vendor-three';
  if (D3_PACKAGES.test(id)) return 'vendor-d3';
  if (id.includes('node_modules/katex/')) return 'vendor-katex';
  return undefined;
}

export default defineConfig({
  base: BASE,
  plugins: [chapterEntries(), chapterFallback()],
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        home: fromRoot('./index.html'),
        ...Object.fromEntries(chapterIds.map((id) => [id, fromRoot(`./${id}/index.html`)])),
      },
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
});
