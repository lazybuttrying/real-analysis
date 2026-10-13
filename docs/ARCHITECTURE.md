# real-analysis 아키텍처

해석학 개념을 직접 움직여 보며 익히는 인터랙티브 시각화 사이트. 서버 없이 GitHub Pages에 정적 배포한다.
이 문서는 ADR-001(Scene/Model 계약)과 system-design 논의를 하나로 합친 최종본이며, 해시 라우팅과 단일 `registry.ts` 결정은 아래 내용으로 대체된다.

## 확정한 결정

| 영역 | 결정 |
|---|---|
| 스택 | Vanilla TS(strict) + Vite, d3(2D), three(3D), KaTeX |
| 계약 | Model은 순수 함수(`compute`, 반환 `D \| Promise<D>`), Scene은 `mount/render/resize/dispose`, 컨트롤은 선언형 `ControlSpec`, 데이터는 단방향 |
| 번들 | 챕터별 entry, 공유 vendor 청크(d3, three, katex), 씬은 동적 import |
| 챕터 entry | 챕터가 5개 이상이므로 `<챕터>/index.html`은 `catalog`에서 생성(`scripts/gen-entries.ts`), 생성물은 `.gitignore` |
| 라우팅 | 경로 URL(`/<언어>/<챕터>/<씬>/`), 챕터 간은 풀 페이지 이동, 챕터 안은 `pushState` |
| 언어 | 한국어·영어 둘 다, URL 접두사(`/ko/`·`/en/`), 헤더 KO \| EN 전환, 프리렌더 hreflang |
| 상태 | `ControlSpec`이 컨트롤 상태와 URL 쿼리(`?n=500&logX=0`)의 단일 원천. 기본값은 URL에서 생략 |
| SEO | 씬별 프리렌더(제목, 요약, 본문, KaTeX), sitemap, canonical, 챕터 허브 페이지 |
| 배포 | GitHub Pages, 공식 Pages 액션, PR에서는 검증만 하고 배포는 main push에서만 |
| 품질 | vitest(모델), `tsc --noEmit && vite build`, 챕터별 `size-limit`, 의존 방향 lint, 프리렌더 CI 검사 |

## 구조

```
real-analysis/
├── index.html                  홈 entry (손으로 관리)
├── <챕터 id>/index.html        챕터 entry — 자동 생성, git 제외
├── scripts/gen-entries.ts      catalog → 챕터 entry HTML + .gitignore 관리 블록
├── vite.config.ts              멀티 entry, vendor 청크, dev/preview 라우팅 fallback
├── docs/ARCHITECTURE.md
└── src/
    ├── main.ts                 홈 부트스트랩
    ├── contracts.ts            ControlSpec, SceneModel, Scene, SceneMeta, ChapterMeta, defineScene
    ├── catalog.ts              전 챕터 meta 취합 (순수 데이터)
    ├── paths.ts                URL 규칙 (순수)
    ├── state.ts                ControlState ↔ URL 쿼리 (순수)
    ├── shell/                  app.ts(챕터 라우팅), controls.ts, scene-host.ts, tex.ts, dom.ts
    ├── view/                   d3kit.ts, threekit.ts
    ├── math/                   순수 수치 함수 (Kahan 합산, 로그 간격 샘플링 등)
    └── chapters/series/
        ├── meta.ts             ChapterMeta + SceneMeta[] (타입 외 import 금지)
        ├── loaders.ts          씬 id → () => import('./scenes/…')
        ├── entry.ts            shell과 loaders 연결
        ├── models/             순수 계산
        └── scenes/             렌더링
```

## 데이터 흐름

```
사용자 입력 ─► ControlState ─► URL(replaceState, 200ms 지연)
                   │
                   ▼
            model.compute(state) ─► 파생 데이터 D ─► (rAF 1회/프레임) scene.render(D, state)
```

- 계산은 입력과 같으면 건너뛰고, 이전 계산의 늦은 결과는 순번(`computeSeq`)으로 버린다.
- 씬 로딩 중 다른 씬으로 이동하면 먼저 시작한 로드 결과는 `loadToken`으로 버린다.
- dispose 순서: rAF 취소 → ResizeObserver 해제 → `scene.dispose()`(WebGL 포함) → DOM 제거.
- 재배포 직후 구버전 탭에서 청크 404가 나면 한 번만 자동 새로고침하고, 그래도 실패하면 안내 메시지와 버튼을 보여준다.

## 규칙

1. `models/`는 d3, three, DOM을 import 하지 않는다. (Worker로 옮기거나 Node에서 테스트하기 위해)
2. `meta.ts`는 `import type` 외에는 아무것도 import 하지 않는다. 모든 페이지의 내비게이션과 빌드 스크립트가 읽으므로 three가 딸려오면 모든 챕터 번들이 무거워진다.
3. Node가 직접 읽는 모듈(`vite.config.ts`, `scripts/`, `catalog.ts`, `meta.ts`, `contracts.ts`, `paths.ts`, `state.ts`)은 상대 import에 `.ts` 확장자를 붙인다. (Vite의 `configLoader: 'native'` 대비, 이후 프리렌더 스크립트도 같은 모듈을 읽는다)
4. three는 3D 씬 파일에서만 import 한다. 그래야 `vendor-three`가 3D 씬에 들어갈 때만 로드된다.
5. 챕터 id는 소문자, 숫자, 하이픈만 쓰고 `src`, `docs`, `assets` 같은 예약어는 쓸 수 없다. (`.gitignore`에 `/<id>/`가 등록되므로 생성기가 검증한다)

## 새 챕터 추가

1. `src/chapters/<id>/`에 `meta.ts`, `loaders.ts`, `entry.ts`, `models/`, `scenes/`를 만든다. (`series`를 복사)
2. `src/catalog.ts`에 챕터를 한 줄 추가한다. **배열 순서가 곧 챕터 번호**다. 셸(홈 목록, 챕터 헤더·허브·문서 제목)과 프리렌더는 `catalog`에서의 인덱스로 "1장, 2장…"을 계산해서 표시하므로, 번호를 meta 파일에 저장하지 않는다.
3. 끝. `<id>/index.html`은 Vite가 시작할 때 생성기가 만든다. 직접 작성한 파일이나 다른 파일이 있는 폴더는 덮어쓰지 않고 오류를 낸다.

## 구현 상태

완료

- [x] 계약(`contracts.ts`)과 `catalog` / `meta` / `loaders` 분리
- [x] 챕터 entry 자동 생성, 멀티 entry 빌드, vendor 청크 분리 (d3, KaTeX는 첫 로드에 들어가지 않음)
- [x] dev/preview에서 `/<챕터>/<씬>/` 직접 접근
- [x] 컨트롤 ↔ URL 상태, 씬 수명주기, 오류 처리
- [x] series 챕터 씬 10개 전부 (harmonic 외 basel·leibniz·eseries·telescoping·geometric·wallis·stirling·grandi·zeta4)
- [x] **limits 챕터(극한과 연속) 씬 6개** (epsilon-n·holes·bolzano-weierstrass·cantor·ivt·uniform). `catalog`에서 series보다 앞에 두어 1장으로 표시된다. (김성기·김도한·계승혁 『해석개론』 1–3장, Tao Analysis I/II 목차 참고)
- [x] **챕터 자동 넘버링**: `catalog` 순서 = 표시 번호. `ChapterMeta`에 번호 필드 없음. 홈·허브·헤더·문서 제목·프리렌더 본문 모두 인덱스로 계산
- [x] 다국어(한국어·영어): URL 접두사, 헤더 전환, 언어별 메타 텍스트
- [x] vitest 추가, 모델·상태·경로·생성기 단위 테스트 (`npm test`)
- [x] 의존 방향 검사 (`scripts/check-deps.ts`: `models → view` 금지, `meta.ts` import 제한, three는 threekit만)
- [x] `scripts/prerender.ts`: 언어별 씬 HTML(title, description, canonical, 본문, KaTeX), `sitemap.xml`, `404.html`, `robots.txt`, title 중복·`summary` 비어 있음 검사
- [x] CI 검사와 챕터별 번들 예산(`size-limit`), `deploy.yml`에 test → check-deps → build → 프리렌더 검증 → size-limit 반영. PR은 검증만, 배포는 main push에서만

남음 (착수 순서)

- [ ] 나머지 챕터(8~10장), 씬별 `content/*.md` 본문, Search Console에 sitemap 제출

## 아직 정해지지 않은 것

1. **도메인(github.io 하위 경로 vs 커스텀):** 색인을 제출하기 전에 정한다. 지금은 `SITE_BASE` 환경변수(기본 `/real-analysis/`)로 바꿀 수 있다.

## 결정됨

1. **언어: 한국어·영어 둘 다 (2026-10-12 결정).** 모든 경로는 언어 접두사 `/ko/`·`/en/`를 앞에 붙인다. 접두사가 없는 경로는 저장된 선호 언어(localStorage `lang` 키, 기본값 ko)로 리다이렉트한다. 헤더의 KO | EN 전환은 챕터·씬·쿼리를 유지한 채 언어 구간만 바꾼다. `SceneMeta`·`ChapterMeta` 텍스트와 컨트롤 라벨은 언어별 레코드(`{ ko, en }`)로 저장하고, 셸 문자열은 셸 사전으로 관리한다. 프리렌더는 언어별 페이지를 만들고 hreflang(ko, en, x-default)을 넣는다.

## 규모가 커지면 다시 볼 것

1. `compute`가 16ms를 넘는다고 측정되면 Web Worker로 옮긴다. (계약이 이미 `Promise<D>` 반환을 허용한다)
2. 설명 글이 씬만큼 늘어나면 Markdown/MDX 파이프라인을 둔다.
3. 북마크나 진도 저장이 필요하면 localStorage부터 시작한다. 계정은 서버가 생기는 구조 변경이므로 그다음이다.
4. 슬라이더에 로그 눈금(`scale: 'log'`)이 필요해질 수 있다. (조화급수처럼 n이 넓은 범위를 훑는 씬)

## 알아둘 점

- `npm install` 시점의 최신 버전이 설치된다(작성 시점 Vite 8, TypeScript 7). `package-lock.json`이 버전을 고정하므로 CI에서는 `npm ci`를 쓴다.
- `.nvmrc`는 `22`이고 Vite 8은 Node 20.19 이상을 요구한다(`engines`에는 22 이상으로 명시). size-limit가 Node 22부터 제공되는 `fs/promises.glob`을 사용해서 CI 기준 버전을 22로 올렸다(2026-10-12). CI에서 `node-version-file`이 이보다 낮게 해석되면 size 단계가 실패한다.
- 3D 씬은 basel 하나이며, `view/threekit.ts`가 실제로 그린다. three import는 threekit 안에만 둔다(`check-deps`가 검사).
