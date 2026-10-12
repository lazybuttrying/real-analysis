import { fileURLToPath } from 'node:url';
import { defineConfig, type Connect, type Plugin } from 'vite';
// Node가 직접 읽는 모듈(설정, 스크립트, catalog, meta)은 확장자를 붙여 import 한다.
import { syncChapterEntries } from './scripts/gen-entries.ts';
import { catalog } from './src/catalog.ts';

/** 배포 base 경로. 커스텀 도메인으로 옮기면 SITE_BASE=/ 로 빌드한다. */
function normalizeBase(raw: string): string {
  const withLead = raw.startsWith('/') ? raw : `/${raw}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

const BASE = normalizeBase(process.env.SITE_BASE ?? '/real-analysis/');

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const fromRoot = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

/** 챕터 목록의 단일 원천은 src/catalog.ts. 여기서는 읽기만 한다. */
const chapterIds = catalog.map((chapter) => chapter.id);

/**
 * dev/preview 서버용: /<base><챕터>/<씬>/ 요청을 해당 챕터의 index.html로 되돌린다.
 * 정적 배포에서는 prerender가 씬마다 index.html을 만들어 이 역할을 대신한다.
 */
function chapterFallback(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const url = req.url ?? '';
    const queryAt = url.indexOf('?');
    const pathname = queryAt === -1 ? url : url.slice(0, queryAt);
    const query = queryAt === -1 ? '' : url.slice(queryAt);

    if (pathname.startsWith(BASE)) {
      const chapter = pathname.slice(BASE.length).split('/')[0] ?? '';
      const hasExtension = /\.[a-z0-9]+$/i.test(pathname);
      if (chapterIds.includes(chapter) && !hasExtension) {
        req.url = `${BASE}${chapter}/index.html${query}`;
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
 * 챕터마다 필요한 <챕터>/index.html(Vite 진입점)을 catalog에서 생성한다.
 * config 단계에서 실행되므로 dev, build, preview 어느 쪽으로 시작해도 먼저 만들어진다.
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

/** 무거운 의존성은 챕터와 무관한 공유 청크로 분리해 챕터 사이에서 캐시를 재사용한다. */
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
