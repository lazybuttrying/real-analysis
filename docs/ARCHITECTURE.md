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
| 씬 페이저 | 씬 하단 이전/다음 버튼 — 전체 47씬 읽기 순서대로, 챕터 경계를 넘어 이동(챕터 안은 SPA, 챕터 간은 풀 페이지 이동). 프리렌더 정적 HTML에도 포함 |
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
    ├── learning-paths.ts       학습 경로 데이터 (순수 데이터, glossary.ts와 같은 규칙)
    ├── concept-map.ts          개념 지도 그래프 — meta.ts의 prerequisites + 학습 경로 순서에서 유도한 노드/엣지 (순수 유도 데이터, 코드 없음). 노드에 isEntry(챕터 첫 씬) 표시 포함
    ├── paths.ts                URL 규칙 (순수)
    ├── state.ts                ControlState ↔ URL 쿼리 (순수)
    ├── shell/                  app.ts(챕터 라우팅), controls.ts, scene-host.ts, tex.ts, dom.ts
    ├── view/                   d3kit.ts(차트 뼈대 createChart + 씬 공용 마운트 셸 createSceneShell/SceneShell), threekit.ts, richtext.ts(씬용 KaTeX 리치텍스트 — shell import 금지 규칙 때문에 shell/tex.ts와 분리), richslot.ts(씬 공용 리치텍스트 슬롯: createRichSlot/setRichText, KaTeX는 dynamic import 유지)
    ├── math/                   순수 수치 함수 (Kahan 합산, 로그 간격 샘플링 등)
    └── chapters/series/
        ├── meta.ts             ChapterMeta + SceneMeta[] (타입 + ./problems/* 데이터 import만 허용)
        ├── problems/           씬별 예제/연습 데이터 모듈 (순수 데이터, 코드 없음) — meta.ts가 import
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
2. `meta.ts`는 `import type`과 같은 챕터의 `./problems/*` 순수 데이터 모듈 외에는 아무것도 import 하지 않는다. 모든 페이지의 내비게이션과 빌드 스크립트가 읽으므로 three 같은 코드가 딸려오면 모든 챕터 번들이 무거워진다. (배경: `meta.ts` 단일 파일이 GitHub push payload 한도(~128KB)를 넘겨서, 씬별 문제 데이터는 `src/chapters/<id>/problems/<scene-id>.ts`로 분리했다. 내용은 바이트 단위로 동일.)
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
- [x] **limits 챕터(극한과 연속) 씬 26개** (기존 23개 + 수 체계 3씬(자연수와 귀납법·이항정리·정수와 유리수)을 맨 앞에 추가 — \(\mathbb{N} \to \mathbb{Z} \to \mathbb{Q} \to \mathbb{R}\) 아크 완성). `catalog`에서 series보다 앞에 두어 1장으로 표시된다. (김성기·김도한·계승혁 『해석개론』 1–3장, Tao Analysis I/II 목차 참고)
- [x] **series 챕터 씬 16개** (기존 15개 + 감마함수(stirling 뒤) 추가)
- [x] **calculus 챕터(미분과 적분) 씬 13개** (기존 12개 + 볼록함수(taylor-thm 뒤) 추가). `catalog`에서 세 번째로 두어 3장으로 표시된다. (김김계 『해석개론』 4–5·8–10장, Tao Analysis I/II 목차 참고)
- [x] 모든 씬에 예제 3개씩(진술+미니 시각화+접기식 엄밀 증명, 한영). 총 88씬·264문제. 증명에 등장하는 수치는 전부 vitest로 검증
- [x] **사이트 검색**: 모든 페이지 헤더의 검색창. 빌드(prerender) 시 언어별 `search-index.<lang>.json`을 생성(52개 씬의 제목·요약 + 용어 사전 전체)하고, 셸이 첫 입력 때 lazy fetch로 가져와 부분문자열(대소문자 무시)로 매칭한다. 결과 드롭다운은 씬/용어를 구분해 링크하고, Enter(첫 결과 이동)·Escape(닫기)·방향키를 지원한다. 검색 인덱스는 번들에 포함되지 않아 페이지 무게가 늘지 않는다
- [x] **용어 사전**: `/ko/glossary/`·`/en/glossary/` 프리렌더 페이지(사이트맵 포함, 홈·헤더에서 링크). `src/glossary.ts`에 135개 용어를 직접 작성(88개 씬 전부 최소 1개 이상, 정의 1–2문장, 한영, `\(...\)` 수식 허용, chapterId+sceneId로 씬에 연결). 챕터별(번호 순) 그룹, 용어별 정의·씬 링크·`#term-<id>` 앵커, 인페이지 필터 제공. 클라이언트 렌더러는 홈 entry에서 동적 import되어 용어 사전 페이지에서만 로드된다
- [x] **학습 경로**: `/ko/paths/`·`/en/paths/` + `/ko/paths/<id>/`·`/en/paths/<id>/` 프리렌더 페이지(사이트맵 포함, 홈·헤더에서 링크). `src/learning-paths.ts`에 6개 경로를 직접 작성(수 체계 완성하기 10씬(팻 칸토어 집합 추가)·수렴 판정 정복 12씬·미분 9씬·적분 9씬·병리적 함수들 8씬(Volterra 함수 추가)·완비성과 컴팩트 9씬(아르첼라-아스콜리 정리 추가), 순서 고정, chapterId+sceneId로 씬에 연결, 용어 사전과 같은 데이터 규칙). 경로 상세 페이지는 번호 매긴 씬 목록, 각 씬 페이지에는 "이 씬이 포함된 학습 경로" 칩 섹션(해당 없으면 표시 안 함). 클라이언트 렌더러(`src/shell/paths-page.ts`)는 홈 entry에서 동적 import되어 경로 페이지에서만 로드된다. 진도 저장·localStorage 없음, 씬 페이저는 전역 읽기 순서를 그대로 쓴다
- [x] **개념 지도**: 홈 페이지 하단 내장 섹션(별도 `/ko/map/` 페이지 없음 — 2026-10-18에 독립 페이지에서 홈 내장으로 이동). `src/concept-map.ts`가 88개 씬의 `prerequisites`(전부 동일 챕터 내 해소)와 학습 경로의 연속 스텝(중복 제거)에서 방향 그래프를 유도 — 총 95개 엣지, self-loop·미해소 참조 0개. 클라이언트 렌더러(`src/shell/map-page.ts`)는 `mountConceptMap(container, lang)`을 export — 홈에서 IntersectionObserver로 섹션이 보일 때 지연 로드(d3 force-directed 그래프, 레이아웃은 동기 pre-tick으로 결정적, 챕터별 앵커 3개를 삼각 배치 + forceX/forceY로 챕터 로브 분리, 드래그·줌/팬·호버 툴팁·노드 클릭 시 씬 이동, 보기 초기화 버튼). 챕터 첫 씬 3개는 큰 노드+굵은 라벨+accent 링으로 강조. 호버 시 해당 노드의 이웃만 남기고 나머지는 15% opacity로 dim. 범례의 챕터 swatch는 필터 버튼(클릭 시 해당 챕터만 표시, 다시 클릭/보기 초기화로 해제, 필터 시 해당 로브에 맞춰 자동 fit). 노드는 챕터별 3색(라이트/다크 모두 대비 확보), 엣지는 선수 관계(실선+화살표)/학습 경로 순서(점선)로 구분. 정적 HTML에는 챕터별 씬 목록+선수 관계 링크 폴백을 넣어 zero-JS로도 읽히고, 클라이언트가 부팅 후 그래프로 교체한다. d3는 홈 entry가 아닌 map-page 청크에서만 import되어 vendor-d3 공유 청크를 쓴다
- [x] **챕터 자동 넘버링**: `catalog` 순서 = 표시 번호. `ChapterMeta`에 번호 필드 없음. 홈·허브·헤더·문서 제목·프리렌더 본문 모두 인덱스로 계산
- [x] 다국어(한국어·영어): URL 접두사, 헤더 전환, 언어별 메타 텍스트
- [x] vitest 추가, 모델·상태·경로·생성기 단위 테스트 (`npm test`)
- [x] 의존 방향 검사 (`scripts/check-deps.ts`: `models → view` 금지, `meta.ts` import 제한, three는 threekit만)
- [x] `scripts/prerender.ts`: 언어별 씬 HTML(title, description, canonical, 본문, KaTeX), 용어 사전 페이지, 학습 경로 목록·상세 페이지, 홈 하단 개념 지도 섹션(정적 폴백: 챕터별 씬 목록+선수 관계 링크 포함), 언어별 `search-index.<lang>.json`, `sitemap.xml`, `404.html`, `robots.txt`, title 중복·`summary` 비어 있음·용어 사전/학습 경로/개념 지도 무결성 검사
- [x] CI 검사와 챕터별 번들 예산(`size-limit`), `deploy.yml`에 test → check-deps → build → 프리렌더 검증 → size-limit 반영. PR은 검증만, 배포는 main push에서만

남음 (착수 순서)

- [ ] 씬별 `content/*.md` 본문, Search Console에 sitemap 제출 (도메인은 sdykim.me로 확정됨 — 2026-10-13)

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
