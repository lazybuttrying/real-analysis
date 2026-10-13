import type { ChapterMeta } from '../../contracts.ts';

/**
 * Pure data. Imports nothing except type imports.
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 * Summaries embed math as inline TeX between \( and \) (see splitInlineMath in contracts.ts).
 * NOTE: chapter numbering is never stored here — the shell derives it from the
 * catalog order in src/catalog.ts.
 */
export const limits: ChapterMeta = {
  id: 'limits',
  title: { ko: '극한과 연속', en: 'Limits and Continuity' },
  summary: {
    ko: '수열의 극한, 유리수의 빈틈, 연속의 의미를 눈으로 확인합니다.',
    en: 'See limits, the gaps in the rationals, and continuity with your own eyes.',
  },
  scenes: [
    {
      id: 'epsilon-n',
      title: { ko: 'ε-N 극한', en: 'The ε–N Definition' },
      order: 1,
      summary: {
        ko: String.raw`\(\varepsilon\) 띠를 좁혀도 수열의 꼬리가 전부 그 안에 들어가는 순간을 확인합니다. 그때의 \(N\)이 바로 \(\forall\varepsilon>0\ \exists N\)의 \(N\)입니다.`,
        en: String.raw`Watch the moment the whole tail of a sequence fits inside the \(\varepsilon\)-band. That \(N\) is exactly the \(N\) in \(\forall\varepsilon>0\ \exists N\).`,
      },
      tex: [String.raw`\forall\varepsilon>0\ \exists N\ \text{s.t.}\ n>N\Rightarrow|a_n-L|<\varepsilon`],
      controls: [
        {
          kind: 'select',
          key: 'seq',
          label: { ko: '수열', en: 'Sequence' },
          options: ['1/n', '(−1)^n / n', 'n / (n+1)'],
          init: '1/n',
        },
        { kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
      ],
    },
    {
      id: 'holes',
      title: { ko: '유리수의 구멍', en: 'Why ℝ Has No Holes' },
      order: 2,
      summary: {
        ko: String.raw`\(x_{n+1}=\frac{x_n+2/x_n}{2}\)의 모든 항은 유리수지만, 극한 \(\sqrt{2}\)는 유리수가 아닙니다. 유리수 집합 \(\mathbb{Q}\)에는 구멍이 있다는 뜻입니다. 무리수임의 엄밀한 증명은 다루지 않고 아이디어 수준에서만 봅니다.`,
        en: String.raw`Every term of \(x_{n+1}=\frac{x_n+2/x_n}{2}\) is rational, yet the limit \(\sqrt{2}\) is not. The rationals \(\mathbb{Q}\) have a hole — shown at the idea level, without a full irrationality proof.`,
      },
      tex: [String.raw`x_{n+1}=\frac{x_n+2/x_n}{2}\to\sqrt{2}`, String.raw`\sqrt{2}\notin\mathbb{Q}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 8, step: 1, init: 4 }],
    },
    {
      id: 'bolzano-weierstrass',
      title: { ko: '볼차노–바이어슈트라스', en: 'A Convergent Subsequence Always Hides Inside' },
      order: 3,
      summary: {
        ko: '유계수열 속에는 항상 수렴하는 부분수열이 숨어 있습니다. 구간을 반으로 접어 점이 무한히 모이는 쪽을 따라가면 됩니다.',
        en: 'Every bounded sequence hides a convergent subsequence. Halve the interval and follow the half holding infinitely many terms.',
      },
      tex: [String.raw`(a_n)\ \text{bounded}\Rightarrow\exists\ (a_{n_k})\ \text{convergent}`],
      controls: [
        { kind: 'slider', key: 'steps', label: { ko: '이분 단계', en: 'Bisection steps' }, min: 1, max: 8, step: 1, init: 4 },
        { kind: 'select', key: 'seed', label: { ko: '난수 시드', en: 'Random seed' }, options: ['7', '21', '99'], init: '7' },
      ],
    },
    {
      id: 'cantor',
      title: { ko: '칸토어 집합', en: 'Length Zero, Points Uncountable' },
      order: 4,
      summary: {
        ko: String.raw`가운데 3분의 1을 계속 지우면 전체 길이는 \(\left(\frac{2}{3}\right)^n\to 0\)이 되지만, 남는 점은 셀 수 없이 많습니다. 비가산성은 아이디어 수준에서만 언급합니다.`,
        en: String.raw`Deleting middle thirds drives the total length \(\left(\frac{2}{3}\right)^n\to 0\), yet uncountably many points remain. Uncountability is stated at the idea level only.`,
      },
      tex: [String.raw`|C_n|=\left(\frac{2}{3}\right)^n\to 0`, String.raw`|C|=|\mathbb{R}|`],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 8, step: 1, init: 4 }],
    },
    {
      id: 'ivt',
      title: { ko: '중간값 정리', en: "You Can't Climb Without Crossing Every Height" },
      order: 5,
      summary: {
        ko: String.raw`연속함수는 \([a,b]\)에서 \(f(a)\)와 \(f(b)\) 사이의 모든 값을 반드시 밟고 지나갑니다. 목표 높이 \(c\)를 움직이며 건너는 점 \(\xi\)를 찾아봅니다.`,
        en: String.raw`A continuous function on \([a,b]\) must step on every value between \(f(a)\) and \(f(b)\). Move the target level \(c\) and find the crossing \(\xi\).`,
      },
      tex: [String.raw`f(a)<c<f(b)\Rightarrow\exists\,\xi\in(a,b):f(\xi)=c`],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수', en: 'Function' }, options: ['cubic', 'sine'], init: 'cubic' },
        { kind: 'slider', key: 't', label: { ko: '목표 높이 (0–100%)', en: 'Target level (0–100%)' }, min: 0, max: 100, step: 1, init: 50 },
      ],
    },
    {
      id: 'uniform',
      title: { ko: '균등수렴 vs 점별수렴', en: 'When the Limit Breaks' },
      order: 6,
      summary: {
        ko: String.raw`\(f_n(x)=x^n\)은 \([0,1]\)의 각 점에서는 수렴하지만, \(\sup|f_n-f|=1\not\to 0\)이라 균등하게 수렴하지는 않습니다. 극한함수가 \(x=1\)에서 끊어지는 모습을 확인합니다.`,
        en: String.raw`\(f_n(x)=x^n\) converges at every point of \([0,1]\), yet \(\sup|f_n-f|=1\not\to 0\): not uniformly. Watch the limit break at \(x=1\).`,
      },
      tex: [
        String.raw`f_n(x)=x^n\to f(x)=\begin{cases}0&x<1\\1&x=1\end{cases}`,
        String.raw`\sup_{[0,1]}|f_n-f|=1\not\to 0`,
      ],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 8 },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.05, max: 0.5, step: 0.01, init: 0.2 },
      ],
    },
  ],
};
