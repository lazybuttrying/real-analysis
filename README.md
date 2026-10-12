# real-analysis

해석학 개념을 직접 움직여 보며 익히는 인터랙티브 시각화 사이트. (Vite + TypeScript, d3, three, KaTeX)

설계 문서는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)를 보세요.

## 명령

```
npm install
npm run dev        # 개발 서버 (http://localhost:5173/real-analysis/)
npm run typecheck  # tsc --noEmit
npm run build      # 타입체크 + 프로덕션 빌드 (dist/)
npm run preview    # dist/ 를 로컬에서 확인
```

배포 경로는 기본이 `/real-analysis/` 입니다. 커스텀 도메인으로 옮기면 `SITE_BASE=/ npm run build`.

## 새 챕터 추가

1. `src/chapters/<id>/` 에 `meta.ts`, `loaders.ts`, `entry.ts`, `models/`, `scenes/` 를 만든다. (`series` 를 복사해 시작)
2. `src/catalog.ts` 에 챕터를 한 줄 추가한다.
3. 끝. `<id>/index.html` 진입점은 Vite가 시작할 때 `scripts/gen-entries.ts` 가 만들고 `.gitignore` 에 등록한다.

챕터 id는 소문자, 숫자, 하이픈만 쓸 수 있고 `src`, `docs`, `assets` 같은 예약어는 쓸 수 없습니다.
