import type { ChapterMeta } from '../../contracts.ts';

/**
 * Pure data. Imports nothing except type imports.
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 */
export const series: ChapterMeta = {
  id: 'series',
  title: { ko: '급수', en: 'Series' },
  summary: {
    ko: '무한급수의 수렴과 발산을 부분합의 움직임으로 확인합니다.',
    en: 'See how infinite series converge or diverge by watching their partial sums move.',
  },
  scenes: [
    {
      id: 'harmonic',
      title: { ko: '조화급수의 발산', en: 'The Harmonic Series Diverges' },
      order: 1,
      summary: {
        ko: '부분합 S_n이 ln n + γ를 따라 아주 느리게, 그러나 끝없이 커지는 모습을 확인합니다.',
        en: 'The partial sums S_n follow ln n + γ upward — very slowly, but without end.',
      },
      tex: [String.raw`S_n=\sum_{k=1}^{n}\frac{1}{k}`, String.raw`S_n=\ln n+\gamma+o(1)`],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 100000, step: 1, init: 1000 },
        { kind: 'toggle', key: 'logX', label: { ko: 'x축 로그 눈금', en: 'Logarithmic x-axis' }, init: true },
      ],
    },
    {
      id: 'basel',
      title: { ko: '바젤 문제', en: 'The Basel Problem' },
      order: 2,
      summary: {
        ko: '항 1/n²을 3차원 막대로 쌓고 부분합의 계단이 π²/6 평면에 닿지 못한 채 다가가는 모습을 확인합니다. π가 왜 등장하는지는 아이디어 수준에서만 짚습니다.',
        en: 'Stack the terms 1/n² as 3D bars and watch the staircase of partial sums approach the plane at π²/6 without ever touching it. Why π appears at all is only sketched at the idea level.',
      },
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 14 }],
    },
    {
      id: 'leibniz',
      title: { ko: '라이프니츠 급수', en: 'Leibniz Series' },
      order: 3,
      summary: {
        ko: '부분합이 π/4를 번갈아 넘고 밑돌며 조여드는 모습을 확인합니다. 이웃한 두 부분합 사이의 간격이 곧 오차의 상한입니다.',
        en: 'The partial sums overshoot and undershoot π/4 in turn, closing in from both sides. The gap between two neighboring partial sums is exactly the error bound.',
      },
      tex: [
        String.raw`\frac{\pi}{4}=1-\frac{1}{3}+\frac{1}{5}-\frac{1}{7}+\cdots`,
        String.raw`\left|S_N-\frac{\pi}{4}\right|\le\frac{1}{2N+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 60, step: 1, init: 12 }],
    },
    {
      id: 'eseries',
      title: { ko: 'e로 가는 두 길', en: 'Two Roads to e' },
      order: 4,
      summary: {
        ko: '복리 (1+1/n)^n과 급수 Σ 1/k!가 e에 다가가는 속도를 견주어 확인합니다. 팩토리얼 급수가 압도적으로 빠릅니다.',
        en: 'Compare how fast compound growth (1+1/n)^n and the series Σ 1/k! approach e. The factorial series wins by a landslide.',
      },
      tex: [String.raw`e=\sum_{k=0}^{\infty}\frac{1}{k!}`, String.raw`e=\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '단계 수 n', en: 'Steps n' }, min: 1, max: 30, step: 1, init: 10 }],
    },
    {
      id: 'telescoping',
      title: { ko: '망원급수', en: 'Telescoping Series' },
      order: 5,
      summary: {
        ko: '각 항을 1/n − 1/(n+1)로 쪼개면 이웃끼리 서로 지워지고 처음의 1과 사라져 가는 꼬리만 남는 모습을 확인합니다.',
        en: 'Split each term into 1/n − 1/(n+1) and the neighbors cancel each other, leaving only the very first 1 and a vanishing tail.',
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=1`,
        String.raw`\frac{1}{n(n+1)}=\frac{1}{n}-\frac{1}{n+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 24, step: 1, init: 10 }],
    },
    {
      id: 'geometric',
      title: { ko: '기하급수: 정사각형 채우기', en: 'Geometric Series: Filling the Square' },
      order: 6,
      summary: {
        ko: '단위 정사각형을 남은 부분의 절반씩 채워 나가면 빈틈이 매 단계 절반으로 줄며 합이 1이 되는 모습을 확인합니다.',
        en: 'Fill a unit square by always taking half of what remains: the gap halves at every step and the total becomes 1.',
      },
      tex: [String.raw`\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots=1`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 단계 n', en: 'Subdivision steps n' }, min: 1, max: 12, step: 1, init: 6 }],
    },
    {
      id: 'wallis',
      title: { ko: '월리스 곱', en: 'Wallis Product' },
      order: 7,
      summary: {
        ko: '유리수 인수들을 하나씩 곱해 나갈수록 실행 곱이 π/2 위아래로 흔들리며 조여드는 모습을 확인합니다.',
        en: 'Multiply the rational factors in one at a time and watch the running product swing above and below π/2, closing in as the swings shrink.',
      },
      tex: [String.raw`\frac{\pi}{2}=\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '인수 쌍의 수 n', en: 'Factor pairs n' }, min: 1, max: 40, step: 1, init: 12 }],
    },
    {
      id: 'stirling',
      title: { ko: '스털링 근사', en: "Stirling's Approximation" },
      order: 8,
      summary: {
        ko: '로그 눈금에서 n!와 스털링 근사가 거의 겹쳐지고 상대오차가 대략 1/(12n)으로 줄어드는 모습을 확인합니다. π가 들어오는 경로는 아이디어 수준에서만 짚습니다.',
        en: 'On a log scale, n! and the Stirling approximation nearly coincide, and the relative error shrinks like 1/(12n). Where π enters is only sketched at the idea level.',
      },
      tex: [String.raw`n!\approx\sqrt{2\pi n}\left(\frac{n}{e}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 20 }],
    },
    {
      id: 'grandi',
      title: { ko: '그란디 급수', en: 'Grandi Series' },
      order: 9,
      summary: {
        ko: '부분합이 1과 0을 영원히 오가므로 이 급수에는 합이 없습니다. 1/2는 부분합들의 평균(체사로 평균)일 뿐, 급수의 합이 아닙니다.',
        en: 'The partial sums bounce between 1 and 0 forever, so this series has no sum. 1/2 is only the average of the partial sums (the Cesàro mean), not a sum of the series.',
      },
      tex: [String.raw`1-1+1-1+\cdots\quad\text{diverges}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 16 }],
    },
    {
      id: 'zeta4',
      title: { ko: 'ζ(4)와 짝수 거듭제곱', en: 'ζ(4) and Even Powers' },
      order: 10,
      summary: {
        ko: '1/n⁴의 부분합이 π⁴/90에 빠르게 닿는 모습과, 짝수 거듭제곱마다 ζ값이 π의 거듭제곱으로 닫히는 패턴을 확인합니다.',
        en: 'The partial sums of 1/n⁴ reach π⁴/90 quickly — and at every even power, the ζ value closes into a power of π.',
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n^4}=\frac{\pi^4}{90}`,
        String.raw`\zeta(2)=\frac{\pi^2}{6},\quad \zeta(6)=\frac{\pi^6}{945}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 20, step: 1, init: 8 }],
    },
  ],
};
