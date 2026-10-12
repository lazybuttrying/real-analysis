import type { ChapterMeta } from '../../contracts.ts';

/**
 * Pure data. Imports nothing except type imports.
 * (Node build scripts and every chapter's navigation read this file)
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
    {
      id: 'basel',
      title: '바젤 문제',
      order: 2,
      summary:
        '항 1/n²을 3차원 막대로 쌓고 부분합의 계단이 π²/6 평면에 닿지 못한 채 다가가는 모습을 확인합니다. π가 왜 등장하는지는 아이디어 수준에서만 짚습니다.',
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}`],
      controls: [{ kind: 'slider', key: 'n', label: '항의 수 n', min: 1, max: 40, step: 1, init: 14 }],
    },
    {
      id: 'leibniz',
      title: '라이프니츠 급수',
      order: 3,
      summary:
        '부분합이 π/4를 번갈아 넘고 밑돌며 조여드는 모습을 확인합니다. 이웃한 두 부분합 사이의 간격이 곧 오차의 상한입니다.',
      tex: [
        String.raw`\frac{\pi}{4}=1-\frac{1}{3}+\frac{1}{5}-\frac{1}{7}+\cdots`,
        String.raw`\left|S_N-\frac{\pi}{4}\right|\le\frac{1}{2N+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: '항의 수 n', min: 1, max: 60, step: 1, init: 12 }],
    },
    {
      id: 'eseries',
      title: 'e로 가는 두 길',
      order: 4,
      summary: '복리 (1+1/n)^n과 급수 Σ 1/k!가 e에 다가가는 속도를 견주어 확인합니다. 팩토리얼 급수가 압도적으로 빠릅니다.',
      tex: [String.raw`e=\sum_{k=0}^{\infty}\frac{1}{k!}`, String.raw`e=\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: '단계 수 n', min: 1, max: 30, step: 1, init: 10 }],
    },
    {
      id: 'telescoping',
      title: '망원급수',
      order: 5,
      summary: '각 항을 1/n − 1/(n+1)로 쪼개면 이웃끼리 서로 지워지고 처음의 1과 사라져 가는 꼬리만 남는 모습을 확인합니다.',
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=1`,
        String.raw`\frac{1}{n(n+1)}=\frac{1}{n}-\frac{1}{n+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: '항의 수 n', min: 1, max: 24, step: 1, init: 10 }],
    },
    {
      id: 'geometric',
      title: '기하급수: 정사각형 채우기',
      order: 6,
      summary: '단위 정사각형을 남은 부분의 절반씩 채워 나가면 빈틈이 매 단계 절반으로 줄며 합이 1이 되는 모습을 확인합니다.',
      tex: [String.raw`\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots=1`],
      controls: [{ kind: 'slider', key: 'n', label: '분할 단계 n', min: 1, max: 12, step: 1, init: 6 }],
    },
    {
      id: 'wallis',
      title: '월리스 곱',
      order: 7,
      summary: '유리수 인수들을 하나씩 곱해 나갈수록 실행 곱이 π/2 위아래로 흔들리며 조여드는 모습을 확인합니다.',
      tex: [String.raw`\frac{\pi}{2}=\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)}`],
      controls: [{ kind: 'slider', key: 'n', label: '인수 쌍의 수 n', min: 1, max: 40, step: 1, init: 12 }],
    },
    {
      id: 'stirling',
      title: '스털링 근사',
      order: 8,
      summary:
        '로그 눈금에서 n!와 스털링 근사가 거의 겹쳐지고 상대오차가 대략 1/(12n)으로 줄어드는 모습을 확인합니다. π가 들어오는 경로는 아이디어 수준에서만 짚습니다.',
      tex: [String.raw`n!\approx\sqrt{2\pi n}\left(\frac{n}{e}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: 'n', min: 1, max: 60, step: 1, init: 20 }],
    },
    {
      id: 'grandi',
      title: '그란디 급수',
      order: 9,
      summary:
        '부분합이 1과 0을 영원히 오가므로 이 급수에는 합이 없습니다. 1/2는 부분합들의 평균(체사로 평균)일 뿐, 급수의 합이 아닙니다.',
      tex: [String.raw`1-1+1-1+\cdots\quad\text{diverges}`],
      controls: [{ kind: 'slider', key: 'n', label: '항의 수 n', min: 1, max: 40, step: 1, init: 16 }],
    },
    {
      id: 'zeta4',
      title: 'ζ(4)와 짝수 거듭제곱',
      order: 10,
      summary:
        '1/n⁴의 부분합이 π⁴/90에 빠르게 닿는 모습과, 짝수 거듭제곱마다 ζ값이 π의 거듭제곱으로 닫히는 패턴을 확인합니다.',
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n^4}=\frac{\pi^4}{90}`,
        String.raw`\zeta(2)=\frac{\pi^2}{6},\quad \zeta(6)=\frac{\pi^6}{945}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: '항의 수 n', min: 1, max: 20, step: 1, init: 8 }],
    },
  ],
};
