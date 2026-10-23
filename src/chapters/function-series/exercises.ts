import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 함수급수와 푸리에 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'm-test-rational',
    kind: 'concept',
    difficulty: 2,
    topics: ['m-test'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\)가 실수 전체 \(\mathbb{R}\)에서 균등수렴함을 M-판정법으로 보이고, 그 합함수가 \(\mathbb{R}\)에서 연속임을 증명하세요.`,
      en: String.raw`Show that \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\) converges uniformly on all of \(\mathbb{R}\) by the M-test, and prove its sum is continuous on \(\mathbb{R}\).`,
    },
    display: [String.raw`\left|\frac{1}{n^2+x^2}\right| \le \frac{1}{n^2} =: M_n, \qquad \sum_{n=1}^{\infty} M_n < \infty`],
    choices: [
      { ko: String.raw`\(M_n = \frac{1}{n^2}\): \(x\)와 무관한 상수이고 \(\sum M_n\)이 수렴한다`, en: String.raw`\(M_n = \frac{1}{n^2}\): constants independent of \(x\), and \(\sum M_n\) converges` },
      { ko: String.raw`\(M_n = \frac{1}{n^2+x^2}\): 부등식이 등식으로 성립한다`, en: String.raw`\(M_n = \frac{1}{n^2+x^2}\): the bound holds with equality` },
      { ko: String.raw`\(M_n = \frac{1}{n}\): 모든 \(x\)에 대해 부등식이 성립한다`, en: String.raw`\(M_n = \frac{1}{n}\): the bound holds for every \(x\)` },
      { ko: String.raw`\(M_n = \frac{1}{x^2}\): 분모의 \(x^2\) 부분만으로 bound한다`, en: String.raw`\(M_n = \frac{1}{x^2}\): bound by the \(x^2\) part of the denominator alone` },
    ],
    correctIndex: 0,
    explanation: {
      ko: String.raw`M-판정법은 \(x\)와 무관한 수 \(M_n\)에 대해 모든 \(x\)에서 \(|f_n(x)| \le M_n\)이고 \(\sum M_n < \infty\)일 것을 요구합니다. \(n^2 + x^2 \ge n^2\)이므로 \(M_n = \frac{1}{n^2}\)이 작동하고 \(\sum \frac{1}{n^2}\)는 수렴합니다 (\(p\)-급수, \(p = 2\)). 두 번째와 네 번째 선택지의 \(M_n\)은 \(x\)에 의존하므로 허용되지 않고 (네 번째는 \(x = 0\)에서 정의조차 되지 않습니다), 세 번째는 부등식은 성립하지만 \(\sum \frac{1}{n}\)이 발산해 판정법이 결론을 주지 못합니다. 균등수렴하므로 연속항들의 합함수도 연속입니다.`,
      en: String.raw`The M-test requires numbers \(M_n\) independent of \(x\) with \(|f_n(x)| \le M_n\) for all \(x\) and \(\sum M_n < \infty\). Since \(n^2 + x^2 \ge n^2\), \(M_n = \frac{1}{n^2}\) works, and \(\sum \frac{1}{n^2}\) converges (a \(p\)-series with \(p = 2\)). The second and fourth options depend on \(x\), so they are not admissible \(M_n\) (the fourth is not even defined at \(x = 0\)); the third bound does hold, but \(\sum \frac{1}{n}\) diverges, so the test gives no conclusion. Uniform convergence then makes the sum of the continuous terms continuous.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`모든 실수 \(x\)에 대해 \(n^2+x^2 \ge n^2\)이므로 \(\left|\frac{1}{n^2+x^2}\right| \le \frac{1}{n^2} =: M_n\)입니다. \(\sum M_n = \sum \frac{1}{n^2}\)은 수렴하므로(\(p\)-급수, \(p = 2\)), 바이어슈트라스 M-판정법으로 \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\)는 \(\mathbb{R}\)에서 균등수렴합니다.`,
          en: String.raw`For every real \(x\), \(n^2+x^2 \ge n^2\), so \(\left|\frac{1}{n^2+x^2}\right| \le \frac{1}{n^2} =: M_n\). Since \(\sum M_n = \sum \frac{1}{n^2}\) converges (a \(p\)-series with \(p = 2\)), the Weierstrass M-test gives uniform convergence of \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\) on \(\mathbb{R}\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 항 \(f_n(x) = \frac{1}{n^2+x^2}\)은 \(\mathbb{R}\)에서 연속입니다 (분모가 \(0\)이 되지 않음). 연속함수들의 균등수렴 극한은 연속이므로, 합함수 \(S(x) = \sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\)는 \(\mathbb{R}\) 전체에서 연속입니다.`,
          en: String.raw`Each term \(f_n(x) = \frac{1}{n^2+x^2}\) is continuous on \(\mathbb{R}\) (the denominator never vanishes). A uniform limit of continuous functions is continuous, so the sum \(S(x) = \sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\) is continuous on all of \(\mathbb{R}\).`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'dini-series',
    difficulty: 3,
    topics: ['dini'],
    statement: {
      ko: String.raw`\(N \ge 1\)에 대해 \(s_N(x) = \sum_{n=1}^{N}(1-x)x^n\)이라 둡니다.

(a) \(s_N\)이 \([0,a]\) (\(0 < a < 1\))에서 디니 정리로 균등수렴함을 보이세요. (b) \([0,1]\)에서는 균등수렴하지 않음을 증명하세요.`,
      en: String.raw`Let \(s_N(x) = \sum_{n=1}^{N}(1-x)x^n\) for \(N \ge 1\).

(a) Show \(s_N\) converges uniformly on \([0,a]\) (\(0 < a < 1\)) via Dini's theorem. (b) Prove it does not converge uniformly on \([0,1]\).`,
    },
    display: [String.raw`s_N(x) = x(1-x^N) \uparrow x \quad (0 \le x < 1), \qquad s_N(1) = 0`],
    solution: [
      {
        text: {
          ko: String.raw`\(x \ne 1\)에서 \(\sum_{n=1}^{N}x^n = \frac{x(1-x^N)}{1-x}\)이므로 \(s_N(x) = x(1-x^N)\)입니다 (\(x = 1\)에서도 각 항이 \(0\)이므로 같은 식이 성립). 각 \(s_N\)은 다항식이므로 연속이고, \(s_{N+1}(x)-s_N(x) = (1-x)x^{N+1} \ge 0\) (\(0 \le x \le 1\))이므로 \(s_N\)은 단조증가합니다.`,
          en: String.raw`For \(x \ne 1\), \(\sum_{n=1}^{N}x^n = \frac{x(1-x^N)}{1-x}\), so \(s_N(x) = x(1-x^N)\) (the same formula holds at \(x = 1\), where every term is \(0\)). Each \(s_N\) is a polynomial, hence continuous, and \(s_{N+1}(x)-s_N(x) = (1-x)x^{N+1} \ge 0\) (\(0 \le x \le 1\)), so \(s_N\) is monotone increasing.`,
        },
      },
      {
        text: {
          ko: String.raw`(a) \(0 \le x \le a < 1\)에서 \(x^N \to 0\)이므로 \(s_N(x) \to x\)입니다. 극한함수 \(s(x) = x\)는 \([0,a]\)에서 연속이고, 연속함수들의 단조증가 수열이 연속 극한으로 각 점 수렴하므로, 디니 정리에 의해 수렴은 균등합니다.`,
          en: String.raw`(a) For \(0 \le x \le a < 1\), \(x^N \to 0\), so \(s_N(x) \to x\). The limit \(s(x) = x\) is continuous on \([0,a]\); a monotone increasing sequence of continuous functions converging pointwise to a continuous limit converges uniformly by Dini's theorem.`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \([0,1]\)에서의 각 점별 극한은 \(s(x) = x\) (\(x < 1\)), \(s(1) = 0\)으로, \(x = 1\)에서 불연속입니다 (\(\lim_{x\to 1^{-}}s(x) = 1 \ne 0 = s(1)\)). 연속함수들의 균등수렴 극한은 연속이어야 하므로, \([0,1]\)에서의 수렴은 균등할 수 없습니다.`,
          en: String.raw`(b) The pointwise limit on \([0,1]\) is \(s(x) = x\) (\(x < 1\)), \(s(1) = 0\), which is discontinuous at \(x = 1\) (\(\lim_{x\to 1^{-}}s(x) = 1 \ne 0 = s(1)\)). A uniform limit of continuous functions must be continuous, so convergence on \([0,1]\) cannot be uniform.`,
        },
      },
    ],
  },
  {
    id: 'approximate-identity-general',
    difficulty: 3,
    topics: ['fejer-theorem', 'fourier'],
    statement: {
      ko: String.raw`연속인 \(2\pi\)-주기 핵 \(K_n \ge 0\)이 다음을 만족한다고 하자: (i) \(\dfrac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,dt = 1\); (ii) 질량 집중: 모든 \(\delta > 0\)에 대해 \(\dfrac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\) (\(n \to \infty\)).

연속인 \(2\pi\)-주기 함수 \(f\)에 대해 합성곱 \((f \ast K_n)(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)K_n(t)\,dt\)이 \(f\)로 균일수렴함을 증명하세요.

(페이예르 핵은 이 가설들을 만족하므로 — 페이예르 장면 참조 — 이는 페이예르 정리를 일반화합니다.)`,
      en: String.raw`Let \(K_n \ge 0\) be continuous \(2\pi\)-periodic kernels satisfying: (i) \(\dfrac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,dt = 1\); (ii) mass concentration: for every \(\delta > 0\), \(\dfrac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\) as \(n \to \infty\).

For \(f\) continuous and \(2\pi\)-periodic, prove the convolution \((f \ast K_n)(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)K_n(t)\,dt\) converges to \(f\) uniformly.

(The Fejér kernel satisfies these hypotheses — see the Fejér scene — so this generalizes Fejér's theorem.)`,
    },
    display: [
      String.raw`\lvert (f \ast K_n)(x) - f(x) \rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt`,
      String.raw`= \underbrace{\frac{1}{2\pi}\int_{\lvert t \rvert < \delta} \cdots}_{\text{uniform continuity}} + \underbrace{\frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} \cdots}_{\text{tail } \to 0}`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`질량이 \(1\)이므로 \(f(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x)K_n(t)\,dt\)라 쓸 수 있다 (\(f\)는 \(2\pi\)-주기이므로 \(f(x-t)\)는 \(t \in [-\pi,\pi]\)에서 문제없이 정의된다).

빼고 절댓값을 취하면 모든 \(x\)에 대해
          \[\lvert (f \ast K_n)(x) - f(x) \rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt\]
          를 얻는다. 적분을 \(\lvert t \rvert < \delta\)와 \(\delta \le \lvert t \rvert \le \pi\)로 나눈다.`,
          en: String.raw`Since the mass is \(1\), write \(f(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x)K_n(t)\,dt\) (\(f(x-t)\) is well defined for \(t \in [-\pi,\pi]\) because \(f\) is \(2\pi\)-periodic).

Subtracting and taking absolute values gives, for every \(x\),
          \[\lvert (f \ast K_n)(x) - f(x) \rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt.\]
          Split the integral into \(\lvert t \rvert < \delta\) and \(\delta \le \lvert t \rvert \le \pi\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어졌다고 하자. \(f\)는 콤팩트 집합 \(\mathbb{R}\) 위에서 연속인 주기함수이므로 균일연속이다: \(\lvert t \rvert < \delta\)이면 모든 \(x\)에 대해 \(\lvert f(x-t) - f(x) \rvert < \varepsilon/2\)인 \(\delta > 0\)이 존재한다.

\(K_n \ge 0\)이고 질량이 \(1\)이므로 첫 번째 적분은 \(\le \varepsilon/2\)이다 (\(x\)와 무관하게).`,
          en: String.raw`Let \(\varepsilon > 0\). As a continuous periodic function, \(f\) is uniformly continuous on \(\mathbb{R}\): there is \(\delta > 0\) such that \(\lvert t \rvert < \delta\) implies \(\lvert f(x-t) - f(x) \rvert < \varepsilon/2\) for all \(x\).

Since \(K_n \ge 0\) with mass \(1\), the first integral is \(\le \varepsilon/2\), independently of \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`꼬리 적분은 \(\lvert f(x-t) - f(x) \rvert \le 2\lVert f \rVert_\infty\)로 상한이 잡히므로
          \[\frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt \le 2\lVert f \rVert_\infty \cdot \frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\]
          이다 (\(n \to \infty\), 가설 (ii)). 따라서 \(n\)이 충분히 크면 꼬리도 \(x\)와 무관하게 \(<\varepsilon/2\)이다. 합하면 \(\lVert f \ast K_n - f \rVert_\infty < \varepsilon\) — 균일수렴이다.

페이예르 핵 \(K_N\)은 \(K_N \ge 0\), 질량 \(1\), 그리고 꼬리 상한 \(K_N(t) \le \dfrac{1}{N\sin^2(\delta/2)}\) (\(\delta \le \lvert t \rvert \le \pi\))을 만족하므로 (페이예르 장면의 문제들), 페이예르 정리는 이 일반 정리의 따름정리이다.`,
          en: String.raw`The tail integral is bounded via \(\lvert f(x-t) - f(x) \rvert \le 2\lVert f \rVert_\infty\):
          \[\frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt \le 2\lVert f \rVert_\infty \cdot \frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\]
          as \(n \to \infty\), by hypothesis (ii). So for large \(n\) the tail is \(<\varepsilon/2\) independently of \(x\). Together, \(\lVert f \ast K_n - f \rVert_\infty < \varepsilon\) — uniform convergence.

The Fejér kernel \(K_N\) satisfies \(K_N \ge 0\), mass \(1\), and the tail bound \(K_N(t) \le \dfrac{1}{N\sin^2(\delta/2)}\) on \(\delta \le \lvert t \rvert \le \pi\) (the Fejér scene's problems), so Fejér's theorem is a corollary of this general result.`,
        },
      },
    ],
  },
];
