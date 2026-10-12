import type { ChapterMeta } from '../../contracts.ts';

/**
 * 순수 데이터. 타입 import 외에는 아무것도 가져오지 않는다.
 * (Node의 빌드 스크립트와 모든 챕터의 내비게이션이 이 파일을 읽는다)
 */
export const series: ChapterMeta = {
  id: 'series',
  title: '급수',
  summary: '무한급수의 수렴과 발산을 부분합의 움직임으로 확인합니다.',
  scenes: [
    {
      id: 'harmonic',
      title: '조화급수의 발산',
      order: 1,
      summary: '부분합 S_n이 ln n + γ를 따라 아주 느리게, 그러나 끝없이 커지는 모습을 확인합니다.',
      tex: [String.raw`S_n=\sum_{k=1}^{n}\frac{1}{k}`, String.raw`S_n=\ln n+\gamma+o(1)`],
      controls: [
        { kind: 'slider', key: 'n', label: '항의 수 n', min: 1, max: 100000, step: 1, init: 1000 },
        { kind: 'toggle', key: 'logX', label: 'x축 로그 눈금', init: true },
      ],
    },
  ],
};
