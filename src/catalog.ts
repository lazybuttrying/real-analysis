import type { ChapterMeta } from './contracts.ts';
import { series } from './chapters/series/meta.ts';

/**
 * 전 챕터의 메타를 모으는 단일 원천. (순수 데이터 — three, d3, DOM이 딸려오면 안 된다)
 * 새 챕터는 src/chapters/<id>/ 를 만들고 여기에 한 줄을 추가한다.
 * <id>/index.html 진입점은 scripts/gen-entries.ts 가 자동으로 생성한다.
 */
export const catalog: readonly ChapterMeta[] = [series];
