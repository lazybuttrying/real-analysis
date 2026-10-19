import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Riemann-Lebesgue scene
 * (Fourier coefficients tend to 0). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/riemann-lebesgue.test.ts): the step function's b_n matches
 * (1 - (-1)^n)/(n pi) exactly, the tent's a_n matches 4/(pi^2 n^2) for odd
 * n, and sin^2 x has only a_2 = -1/2 nonzero.
 */
export const riemannLebesgueProblems: readonly ProblemMeta[] = [
  {
    id: 'rl-step-direct',
    statement: {
      ko: String.raw`\(f = 1_{[0, \pi]}\) (\([0, 2\pi]\) 위)의 푸리에 계수 \(b_n = \frac{1}{\pi}\int_0^{2\pi} f(x)\sin(nx)\,dx\)를 직접 계산하고, \(a_n\)도 구한 뒤, \(a_n, b_n \to 0\)임을 완전히 증명하세요.`,
      en: String.raw`Compute directly the Fourier coefficients \(b_n = \frac{1}{\pi}\int_0^{2\pi} f(x)\sin(nx)\,dx\) of \(f = 1_{[0, \pi]}\) (on \([0, 2\pi]\)), find \(a_n\) as well, and prove completely that \(a_n, b_n \to 0\).`,
    },
    display: [
      String.raw`b_n = \frac{1 - (-1)^n}{n\pi} \;\xrightarrow[n \to \infty]{}\; 0, \qquad a_n = 0`,
    ],
    preset: { mode: 'step', n: 12, kind: 'b' },
    presetCaption: {
      ko: String.raw`계단 모드, \(n = 12\), \(|b|\) 줄기: 홀수 항은 \(|b_n| = \frac{2}{n\pi}\)로 가라앉고 짝수 항은 정확히 0입니다 — \(|b_{11}| = \frac{2}{11\pi} \approx 0.0579\).`,
      en: String.raw`Step mode, \(n = 12\), \(|b|\) stems: odd terms sink as \(|b_n| = \frac{2}{n\pi}\) and even terms are exactly 0 — \(|b_{11}| = \frac{2}{11\pi} \approx 0.0579\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 \([0, \pi]\)에서 1, \((\pi, 2\pi]\)에서 0이므로 \(b_n = \frac{1}{\pi}\int_0^{\pi} \sin(nx)\,dx\)입니다. \(\int \sin(nx)\,dx = -\cos(nx)/n\)이므로 \(b_n = \frac{1}{\pi}\left[-\frac{\cos(nx)}{n}\right]_0^{\pi} = \frac{1 - \cos(n\pi)}{n\pi}\)이고, \(\cos(n\pi) = (-1)^n\)이므로 \(b_n = \frac{1 - (-1)^n}{n\pi}\)입니다.`,
          en: String.raw`Since \(f\) is 1 on \([0, \pi]\) and 0 on \((\pi, 2\pi]\), \(b_n = \frac{1}{\pi}\int_0^{\pi} \sin(nx)\,dx\). With \(\int \sin(nx)\,dx = -\cos(nx)/n\), we get \(b_n = \frac{1}{\pi}\left[-\frac{\cos(nx)}{n}\right]_0^{\pi} = \frac{1 - \cos(n\pi)}{n\pi}\), and \(\cos(n\pi) = (-1)^n\) gives \(b_n = \frac{1 - (-1)^n}{n\pi}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|1 - (-1)^n| \le 2\)이므로 \(|b_n| \le \frac{2}{n\pi} \to 0\) (\(n \to \infty\))입니다. 한편 \(a_n = \frac{1}{\pi}\int_0^{\pi} \cos(nx)\,dx = \frac{\sin(n\pi)}{n\pi} = 0\) — 모든 \(n \ge 1\)에서 정확히 0입니다. 따라서 \(a_n \to 0\), \(b_n \to 0\)이 모두 증명되었습니다.`,
          en: String.raw`Since \(|1 - (-1)^n| \le 2\), \(|b_n| \le \frac{2}{n\pi} \to 0\) as \(n \to \infty\). Meanwhile \(a_n = \frac{1}{\pi}\int_0^{\pi} \cos(nx)\,dx = \frac{\sin(n\pi)}{n\pi} = 0\) — exactly 0 for every \(n \ge 1\). Hence \(a_n \to 0\) and \(b_n \to 0\) are both proved.`,
        },
      },
      {
        text: {
          ko: String.raw`씬의 계단 모드는 이 공식을 수치 적분으로 재현합니다: 줄기 그림의 홀수 줄기는 \(2/(n\pi)\) 곡선을 타고 내려가고, 짝수 줄기는 수치 오차 수준에서 0입니다. 불연속 함수의 계수는 \(1/n\) 속도로 갑니다 — 매끄러운 함수보다 느립니다 (텐트 모드와 비교해 보세요).`,
          en: String.raw`The scene's step mode reproduces this formula by numerical quadrature: the odd stems ride the \(2/(n\pi)\) curve downward while the even stems sit at 0 up to quadrature error. A discontinuous function's coefficients go at rate \(1/n\) — slower than for smooth functions (compare the tent mode).`,
        },
      },
    ],
  },
  {
    id: 'rl-step-general',
    statement: {
      ko: String.raw`계단함수 \(s = \sum_{k=1}^{m} c_k\,1_{[x_{k-1}, x_k)}\) (\([0, 2\pi]\)의 분할 위)의 푸리에 계수에 대해 리만-르베그 보조정리를 증명하세요: \(a_n(s), b_n(s) \to 0\).`,
      en: String.raw`Prove the Riemann–Lebesgue lemma for a step function \(s = \sum_{k=1}^{m} c_k\,1_{[x_{k-1}, x_k)}\) (on a partition of \([0, 2\pi]\)): \(a_n(s), b_n(s) \to 0\).`,
    },
    display: [
      String.raw`\left|\frac{1}{\pi}\int_{x_{k-1}}^{x_k} \sin(nx)\,dx\right| \le \frac{2}{n\pi} \;\xrightarrow[n \to \infty]{}\; 0`,
    ],
    preset: { mode: 'step', n: 24, kind: 'b' },
    presetCaption: {
      ko: String.raw`계단 모드, \(n = 24\): 유한 개의 구간 각각이 \(\le 2/(n\pi)\) 기여를 하므로 전체 \(|b_n|\)도 0으로 갑니다 — 일반 계단함수 증명의 수치 버전입니다.`,
      en: String.raw`Step mode, \(n = 24\): each of the finitely many intervals contributes at most \(2/(n\pi)\), so the total \(|b_n|\) goes to 0 — the numerical version of the general step-function proof.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`적분의 선형성에 의해 \(b_n(s) = \sum_{k=1}^{m} c_k\,b_n(1_{[x_{k-1}, x_k)})\)입니다. 각 구간 지시함수의 계수는 \(b_n(1_{[x_{k-1}, x_k)}) = \frac{1}{\pi}\int_{x_{k-1}}^{x_k} \sin(nx)\,dx = \frac{\cos(nx_{k-1}) - \cos(nx_k)}{n\pi}\)입니다.`,
          en: String.raw`By linearity of the integral, \(b_n(s) = \sum_{k=1}^{m} c_k\,b_n(1_{[x_{k-1}, x_k)})\). Each interval indicator contributes \(b_n(1_{[x_{k-1}, x_k)}) = \frac{1}{\pi}\int_{x_{k-1}}^{x_k} \sin(nx)\,dx = \frac{\cos(nx_{k-1}) - \cos(nx_k)}{n\pi}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|\cos(nx_{k-1}) - \cos(nx_k)| \le 2\)이므로 \(\left|b_n(1_{[x_{k-1}, x_k)})\right| \le \frac{2}{n\pi}\) — 구간 위치와 무관한 uniform bound입니다. 따라서 \(|b_n(s)| \le \sum_{k=1}^{m} |c_k|\,\frac{2}{n\pi} = \frac{C}{n}\) (여기서 \(C = \frac{2}{\pi}\sum |c_k|\)는 \(n\)과 무관한 상수)이고, \(n \to \infty\)에서 0으로 갑니다. \(a_n(s)\)도 \(\cos\)를 \(\sin\)으로 바꾼 똑같은 계산으로 0으로 갑니다.`,
          en: String.raw`Since \(|\cos(nx_{k-1}) - \cos(nx_k)| \le 2\), \(\left|b_n(1_{[x_{k-1}, x_k)})\right| \le \frac{2}{n\pi}\) — a uniform bound independent of the interval's position. Hence \(|b_n(s)| \le \sum_{k=1}^{m} |c_k|\,\frac{2}{n\pi} = \frac{C}{n}\) (with \(C = \frac{2}{\pi}\sum |c_k|\) independent of \(n\)), which goes to 0 as \(n \to \infty\). The same computation with \(\cos\) in place of \(\sin\) sends \(a_n(s) \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`핵심은 유한성입니다: 구간의 개수가 유한하므로 각 구간의 \(O(1/n)\) 기여를 그냥 더해도 여전히 \(O(1/n)\)입니다. 이것이 연속 함수로의 밀도 논증(아래 문제 3)이 올라서는 발판입니다.`,
          en: String.raw`The point is finiteness: with only finitely many intervals, adding up the \(O(1/n)\) contributions still gives \(O(1/n)\). This is the platform the density argument to continuous functions (problem 3 below) stands on.`,
        },
      },
    ],
  },
  {
    id: 'rl-density',
    statement: {
      ko: String.raw`\([0, 2\pi]\) 위의 연속 함수 \(f\)를 계단함수로 균등 근사할 수 있음(균등연속성으로 증명)을 먼저 보이고, 이를 이용해 \(\varepsilon/3\) 논증으로 \(b_n(f) \to 0\) (및 \(a_n(f) \to 0\))을 완전히 증명하세요.`,
      en: String.raw`First prove that a continuous \(f\) on \([0, 2\pi]\) can be uniformly approximated by step functions (via uniform continuity), then use it to prove \(b_n(f) \to 0\) (and \(a_n(f) \to 0\)) completely by an \(\varepsilon/3\) argument.`,
    },
    display: [
      String.raw`|b_n(f)| \le |b_n(f - s)| + |b_n(s)| \le 2\varepsilon + |b_n(s)| \;\xrightarrow[n \to \infty]{}\; 2\varepsilon`,
    ],
    preset: { mode: 'tent', n: 24, kind: 'a' },
    presetCaption: {
      ko: String.raw`텐트 모드, \(n = 24\): 연속 함수는 계단함수로 균등 근사되므로 \(|a_n|\)도 0으로 갑니다 — 여기서 \(|a_n| = 4/(\pi^2 n^2)\) (홀수 \(n\))로 더 빨리 가라앉습니다.`,
      en: String.raw`Tent mode, \(n = 24\): continuous functions are uniformly approximable by step functions, so \(|a_n| \to 0\) too — here sinking even faster as \(|a_n| = 4/(\pi^2 n^2)\) (odd \(n\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`보조정리 (계단함수 균등 근사): \(f\)가 \([0, 2\pi]\)에서 연속이면 균등연속이므로, \(\varepsilon > 0\)마다 \(\delta > 0\)가 있어 \(|x - y| < \delta\)이면 \(|f(x) - f(y)| < \varepsilon\)입니다. \([0, 2\pi]\)를 너비 \({} < \delta\)인 구간 \(I_1, \dots, I_m\)으로 나누고, 각 \(I_k\)에서 상수값 \(f(x_{k-1})\) (왼쪽 끝점 값)을 취하는 계단함수 \(s\)를 정의합니다. \(x \in I_k\)이면 \(|x - x_{k-1}| < \delta\)이므로 \(|f(x) - s(x)| < \varepsilon\) — 즉 \(\|f - s\|_\infty < \varepsilon\)입니다. 보조정리 증명 완료.`,
          en: String.raw`Lemma (uniform approximation by step functions): if \(f\) is continuous on \([0, 2\pi]\) it is uniformly continuous, so for every \(\varepsilon > 0\) there is \(\delta > 0\) with \(|x - y| < \delta \Rightarrow |f(x) - f(y)| < \varepsilon\). Split \([0, 2\pi]\) into intervals \(I_1, \dots, I_m\) of width \({} < \delta\) and define the step function \(s\) taking the constant value \(f(x_{k-1})\) (left endpoint) on each \(I_k\). For \(x \in I_k\), \(|x - x_{k-1}| < \delta\), so \(|f(x) - s(x)| < \varepsilon\) — i.e. \(\|f - s\|_\infty < \varepsilon\). Lemma proved.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(\varepsilon > 0\)을 고정하고, 위 보조정리로 \(\|f - s\|_\infty < \varepsilon\)인 계단함수 \(s\)를 택합니다. 삼각부등식으로 \(|b_n(f)| \le |b_n(f - s)| + |b_n(s)|\)입니다. 첫 항은 \(|b_n(f - s)| \le \frac{1}{\pi}\int_0^{2\pi} |f - s|\,|\sin(nx)|\,dx \le \frac{1}{\pi}\,\varepsilon \cdot 2\pi = 2\varepsilon\) — \(n\)과 무관합니다.`,
          en: String.raw`Fix \(\varepsilon > 0\) and pick a step function \(s\) with \(\|f - s\|_\infty < \varepsilon\) by the lemma. By the triangle inequality \(|b_n(f)| \le |b_n(f - s)| + |b_n(s)|\). The first term satisfies \(|b_n(f - s)| \le \frac{1}{\pi}\int_0^{2\pi} |f - s|\,|\sin(nx)|\,dx \le \frac{1}{\pi}\,\varepsilon \cdot 2\pi = 2\varepsilon\) — independent of \(n\).`,
        },
      },
      {
        text: {
          ko: String.raw`둘째 항 \(|b_n(s)|\)는 문제 2에서 \(n \to \infty\)일 때 0으로 갑니다. 따라서 \(N\)을 크게 잡아 \(n \ge N\)이면 \(|b_n(s)| < \varepsilon\)이 되게 할 수 있고, 그 \(n\)들에 대해 \(|b_n(f)| < 2\varepsilon + \varepsilon = 3\varepsilon\)입니다. \(\varepsilon\)이 임의이므로 \(b_n(f) \to 0\)입니다. \(a_n(f)\)도 \(|\cos(nx)| \le 1\)을 이용한 동일한 논증으로 0으로 갑니다. 모든 단계가 완성되었습니다 — 아이디어 수준 표기는 없습니다.`,
          en: String.raw`The second term \(|b_n(s)| \to 0\) as \(n \to \infty\) by problem 2. So choose \(N\) large enough that \(|b_n(s)| < \varepsilon\) for \(n \ge N\); for those \(n\), \(|b_n(f)| < 2\varepsilon + \varepsilon = 3\varepsilon\). Since \(\varepsilon\) is arbitrary, \(b_n(f) \to 0\). The same argument with \(|\cos(nx)| \le 1\) gives \(a_n(f) \to 0\). Every step is complete — nothing is left at idea level.`,
        },
      },
    ],
  },
];
