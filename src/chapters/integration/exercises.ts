import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 적분 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'riemann-point-mass',
    difficulty: 1,
    topics: ['riemann'],
    statement: {
      ko: String.raw`\([0,1]\) 위의 함수 \(f\)를 \(f(1/2) = 1\)이고 \(x \ne 1/2\)에서는 \(f(x) = 0\)이라 정의하자.

\(f\)가 리만 적분가능하고 \(\int_0^1 f = 0\)임을, 상합·하합을 직접 평가하여 증명하세요.`,
      en: String.raw`Define \(f\) on \([0,1]\) by \(f(1/2) = 1\) and \(f(x) = 0\) for \(x \ne 1/2\).

Prove directly from upper and lower sums that \(f\) is Riemann integrable with \(\int_0^1 f = 0\).`,
    },
    solution: [
      {
        text: {
          ko: String.raw`\(f\)는 유계이다 (\(0 \le f \le 1\)). \(0 < \delta < 1/2\)에 대해 분할 \(P_\delta = \{0,\ 1/2 - \delta,\ 1/2 + \delta,\ 1\}\)을 잡자.

양쪽 바깥 구간에서는 \(f \equiv 0\)이므로 상한·하한이 모두 \(0\)이고, 가운데 구간 \([1/2-\delta,\ 1/2+\delta]\)에서는 하한이 \(0\) (1/2가 아닌 점이 존재)이고 상한이 \(1\) (\(f(1/2) = 1\))이다.`,
          en: String.raw`The function \(f\) is bounded (\(0 \le f \le 1\)). For \(0 < \delta < 1/2\) take the partition \(P_\delta = \{0,\ 1/2 - \delta,\ 1/2 + \delta,\ 1\}\).

On the two outer intervals \(f \equiv 0\), so both the infimum and supremum are \(0\); on the middle interval \([1/2-\delta,\ 1/2+\delta]\) the infimum is \(0\) (points other than \(1/2\) exist) and the supremum is \(1\) (since \(f(1/2) = 1\)).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 하합은 \(L(P_\delta, f) = 0\)이고 상합은 \(U(P_\delta, f) = 1 \cdot 2\delta = 2\delta\)이다. \(U - L = 2\delta \to 0\) (\(\delta \to 0^+\))이므로 리만 판정법에 의해 \(f\)는 적분가능하다.

적분값은 \(0 = L(P_\delta, f) \le \int_0^1 f \le U(P_\delta, f) = 2\delta\)를 모든 \(\delta > 0\)에 대해 만족하므로 \(0\)이다 — 한 점에서의 값은 리만 적분에 영향을 주지 않는다.`,
          en: String.raw`Hence the lower sum is \(L(P_\delta, f) = 0\) and the upper sum is \(U(P_\delta, f) = 1 \cdot 2\delta = 2\delta\). Since \(U - L = 2\delta \to 0\) as \(\delta \to 0^+\), the Riemann criterion gives integrability.

The integral satisfies \(0 = L(P_\delta, f) \le \int_0^1 f \le U(P_\delta, f) = 2\delta\) for every \(\delta > 0\), so it equals \(0\) — the value at a single point does not affect the Riemann integral.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'ftc-unbounded-derivative',
    difficulty: 2,
    topics: ['ftc'],
    statement: {
      ko: String.raw`\(F(x) = x^2\sin(1/x^2)\) (\(x \ne 0\)), \(F(0) = 0\)이라 하자.

\(F\)가 \([-1,1]\)의 모든 점에서 미분가능함을 보이고, 도함수 \(F'\)이 \(0\)의 모든 근방에서 무계임을 보이세요. \(F'\)이 \([-1,1]\)에서 리만 적분가능하지 않음을 결론짓고, 이것이 미적분학 기본정리 제2형태의 가설 "도함수가 리만 적분가능하다"가 왜 필요한지 설명하세요.`,
      en: String.raw`Let \(F(x) = x^2\sin(1/x^2)\) for \(x \ne 0\) and \(F(0) = 0\).

Show \(F\) is differentiable at every point of \([-1,1]\), but that \(F'\) is unbounded on every neighborhood of \(0\). Conclude \(F'\) is not Riemann integrable on \([-1,1]\), and explain why this shows the hypothesis "the derivative is Riemann integrable" in FTC-II cannot be dropped.`,
    },
    display: [
      String.raw`F'(0) = \lim_{h \to 0} h\sin(1/h^2) = 0`,
      String.raw`F'(x) = 2x\sin(1/x^2) - \frac{2}{x}\cos(1/x^2) \quad (x \ne 0)`,
      String.raw`x_k = \frac{1}{\sqrt{2\pi k}}:\quad F'(x_k) = -2\sqrt{2\pi k} \to -\infty`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`\(F'(0)\)을 정의로 구한다: \(\dfrac{F(h) - F(0)}{h} = h\sin(1/h^2)\)이고 \(\lvert h\sin(1/h^2) \rvert \le \lvert h \rvert\)이므로 조임 정리로 극한은 \(0\)이다.

\(x \ne 0\)에서는 곱·합성 미분법으로 \(F'(x) = 2x\sin(1/x^2) + x^2\cos(1/x^2)\cdot(-2/x^3) = 2x\sin(1/x^2) - \dfrac{2}{x}\cos(1/x^2)\)이다. 따라서 \(F\)는 \([-1,1]\)의 모든 점에서 미분가능하다.`,
          en: String.raw`Get \(F'(0)\) from the definition: \(\dfrac{F(h) - F(0)}{h} = h\sin(1/h^2)\), and \(\lvert h\sin(1/h^2) \rvert \le \lvert h \rvert\), so the squeeze theorem gives the limit \(0\).

For \(x \ne 0\), the product and chain rules give \(F'(x) = 2x\sin(1/x^2) + x^2\cos(1/x^2)\cdot(-2/x^3) = 2x\sin(1/x^2) - \dfrac{2}{x}\cos(1/x^2)\). Hence \(F\) is differentiable at every point of \([-1,1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(F'\)은 \(0\) 근처에서 무계이다.

\(x_k = \dfrac{1}{\sqrt{2\pi k}} \to 0^+\) (\(k = 1, 2, \dots\))라 두면 \(\sin(1/x_k^2) = \sin(2\pi k) = 0\), \(\cos(1/x_k^2) = \cos(2\pi k) = 1\)이므로 \(F'(x_k) = -\dfrac{2}{x_k} = -2\sqrt{2\pi k} \to -\infty\)이다. \(0\)의 모든 근방은 \(k\)가 큰 \(x_k\)를 포함하므로, \(F'\)은 그 위에서 무계이다.`,
          en: String.raw`But \(F'\) is unbounded near \(0\).

Put \(x_k = \dfrac{1}{\sqrt{2\pi k}} \to 0^+\) (\(k = 1, 2, \dots\)): then \(\sin(1/x_k^2) = \sin(2\pi k) = 0\) and \(\cos(1/x_k^2) = \cos(2\pi k) = 1\), so \(F'(x_k) = -\dfrac{2}{x_k} = -2\sqrt{2\pi k} \to -\infty\). Every neighborhood of \(0\) contains \(x_k\) for large \(k\), so \(F'\) is unbounded there.`,
        },
      },
      {
        text: {
          ko: String.raw`리만 적분가능한 함수는 유계이어야 하므로 (상합이 유한하려면 필요), \(F'\)은 \([-1,1]\)에서 리만 적분가능하지 않다.

미적분학 기본정리 제2형태는 "\(\int_a^b F' = F(b) - F(a)\)"를 주장하지만, 그 전제로 \(F'\)의 리만 적분가능성을 요구한다 — 이 예는 그 전제가 없으면 적분 \(\int_{-1}^{1} F'\) 자체가 존재하지 않으므로 정리를 적용할 수 없음을 보여준다. 미분가능성만으로는 부족하다.`,
          en: String.raw`A Riemann integrable function must be bounded (needed for finite upper sums), so \(F'\) is not Riemann integrable on \([-1,1]\).

FTC-II asserts "\(\int_a^b F' = F(b) - F(a)\)" but requires \(F'\) to be Riemann integrable as a hypothesis — this example shows that without it the integral \(\int_{-1}^{1} F'\) does not even exist, so the theorem cannot be applied. Differentiability alone is not enough.`,
        },
      },
    ],
  },
  {
    id: 'bv-product',
    difficulty: 2,
    topics: ['bounded-variation'],
    statement: {
      ko: String.raw`\(f\)와 \(g\)가 \([a,b]\)에서 유계변동이라고 하자.

먼저 유계변동 함수가 유계임을 보이고 (힌트: \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\)), 그 다음 곱 \(fg\)도 \([a,b]\)에서 유계변동임을 증명하세요. 전변동에 대한 상한을 구하세요.`,
      en: String.raw`Let \(f\) and \(g\) be of bounded variation on \([a,b]\).

First show a BV function is bounded (hint: \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\)), then prove the product \(fg\) is also of bounded variation on \([a,b]\). Find an upper bound for its total variation.`,
    },
    display: [String.raw`V_a^b(fg) \le M_f\,V_a^b(g) + M_g\,V_a^b(f), \qquad M_f = \sup_{[a,b]}\lvert f \rvert,\ M_g = \sup_{[a,b]}\lvert g \rvert`],
    solution: [
      {
        text: {
          ko: String.raw`\(x \in [a,b]\)에 대해 분할 \(\{a, x, b\}\)를 생각하면 \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\)이므로, 삼각부등식으로 \(\lvert f(x) \rvert \le \lvert f(a) \rvert + V_a^b(f) < \infty\)이다. 따라서 \(f\)는 유계이고 \(M_f = \sup_{[a,b]}\lvert f \rvert < \infty\)이며, \(g\)도 마찬가지이다.`,
          en: String.raw`For \(x \in [a,b]\), the partition \(\{a, x, b\}\) gives \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\), so by the triangle inequality \(\lvert f(x) \rvert \le \lvert f(a) \rvert + V_a^b(f) < \infty\). Hence \(f\) is bounded with \(M_f = \sup_{[a,b]}\lvert f \rvert < \infty\), and likewise for \(g\).`,
        },
      },
      {
        text: {
          ko: String.raw`임의의 분할 \(P = \{x_0, \dots, x_n\}\)에 대해 항등식 \(f(x_i)g(x_i) - f(x_{i-1})g(x_{i-1}) = f(x_i)\bigl(g(x_i) - g(x_{i-1})\bigr) + g(x_{i-1})\bigl(f(x_i) - f(x_{i-1})\bigr)\)을 쓰자.

절댓값을 취하고 합하면
          \[\sum_{i=1}^{n}\lvert (fg)(x_i) - (fg)(x_{i-1}) \rvert \le M_f \sum_{i=1}^{n}\lvert g(x_i) - g(x_{i-1}) \rvert + M_g \sum_{i=1}^{n}\lvert f(x_i) - f(x_{i-1}) \rvert \le M_f V_a^b(g) + M_g V_a^b(f).\]
          우변은 \(P\)와 무관하므로, 상한을 취해 \(V_a^b(fg) \le M_f V_a^b(g) + M_g V_a^b(f) < \infty\)를 얻는다. 즉 \(fg\)는 유계변동이다.`,
          en: String.raw`For any partition \(P = \{x_0, \dots, x_n\}\), use the identity \(f(x_i)g(x_i) - f(x_{i-1})g(x_{i-1}) = f(x_i)\bigl(g(x_i) - g(x_{i-1})\bigr) + g(x_{i-1})\bigl(f(x_i) - f(x_{i-1})\bigr)\).

Taking absolute values and summing,
          \[\sum_{i=1}^{n}\lvert (fg)(x_i) - (fg)(x_{i-1}) \rvert \le M_f \sum_{i=1}^{n}\lvert g(x_i) - g(x_{i-1}) \rvert + M_g \sum_{i=1}^{n}\lvert f(x_i) - f(x_{i-1}) \rvert \le M_f V_a^b(g) + M_g V_a^b(f).\]
          The right side is independent of \(P\), so taking the supremum gives \(V_a^b(fg) \le M_f V_a^b(g) + M_g V_a^b(f) < \infty\): \(fg\) is of bounded variation.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'bv-uniform-limit-fails',
    difficulty: 3,
    topics: ['bounded-variation'],
    statement: {
      ko: String.raw`연속함수의 균일극한은 연속이다 (바이어슈트라스 장면).

유계변동에 대해서는 이것이 성립하지 않음을 보이세요: \(g(x) = x^2\sin(1/x^2)\) (\(x > 0\)), \(g(0) = 0\)이라 하고,
      \[g_n(x) = \begin{cases} g(1/n) & 0 \le x \le 1/n \\ g(x) & 1/n \le x \le 1 \end{cases}\]
      라 하자.

(a) \(g\)가 \([0,1]\)에서 유계변동이 아님을, 점 \(x_k = \sqrt{2/((2k+1)\pi)}\)에서의 진동을 이용해 보이세요. (b) 각 \(g_n\)은 \([0,1]\)에서 유계변동이고 \(g_n \to g\) 균일수렴임을 보이세요.`,
      en: String.raw`The uniform limit of continuous functions is continuous (the Weierstrass scene).

Show this fails for bounded variation: with \(g(x) = x^2\sin(1/x^2)\) for \(x > 0\) and \(g(0) = 0\), put
      \[g_n(x) = \begin{cases} g(1/n) & 0 \le x \le 1/n \\ g(x) & 1/n \le x \le 1 \end{cases}.\]

      (a) Show \(g\) is NOT of bounded variation on \([0,1]\), using the oscillation at the points \(x_k = \sqrt{2/((2k+1)\pi)}\). (b) Show each \(g_n\) is of bounded variation on \([0,1]\) and \(g_n \to g\) uniformly.`,
    },
    display: [
      String.raw`x_k = \frac{1}{\sqrt{\pi/2 + k\pi}},\qquad g(x_k) = (-1)^k\,\frac{2}{(2k+1)\pi}`,
      String.raw`\sum_{k=1}^{N}\lvert g(x_{k-1}) - g(x_k) \rvert = \frac{2}{\pi}\sum_{k=1}^{N}\left(\frac{1}{2k-1} + \frac{1}{2k+1}\right) \to \infty`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(x_k = \dfrac{1}{\sqrt{\pi/2 + k\pi}}\)라 두면 \(x_k \downarrow 0\)이고 \(\sin(1/x_k^2) = \sin(\pi/2 + k\pi) = (-1)^k\)이므로 \(g(x_k) = (-1)^k x_k^2 = (-1)^k\,\dfrac{2}{(2k+1)\pi}\)이다. 또한 \(x_0 = \sqrt{2/\pi} \approx 0.798 < 1\)이다.

분할 \(0 < x_N < x_{N-1} < \cdots < x_1 < x_0 < 1\)에 대해, 이웃한 두 점의 함수값은 부호가 반대이므로
          \[\lvert g(x_{k-1}) - g(x_k) \rvert = \frac{2}{\pi}\left(\frac{1}{2k-1} + \frac{1}{2k+1}\right) \qquad (k = 1, \dots, N).\]
          따라서 이 분할 위의 변동합은 \(\dfrac{2}{\pi}\sum_{k=1}^{N}\left(\dfrac{1}{2k-1} + \dfrac{1}{2k+1}\right) \ge \dfrac{2}{\pi}\sum_{k=1}^{N}\dfrac{1}{2k+1} \ge \dfrac{1}{\pi}\sum_{k=1}^{N}\dfrac{1}{k+1} \to \infty\) (\(N \to \infty\), 조화급수)이다. 전변동이 무한하므로 \(g\)는 유계변동이 아니다.`,
          en: String.raw`(a) Put \(x_k = \dfrac{1}{\sqrt{\pi/2 + k\pi}}\); then \(x_k \downarrow 0\) and \(\sin(1/x_k^2) = \sin(\pi/2 + k\pi) = (-1)^k\), so \(g(x_k) = (-1)^k x_k^2 = (-1)^k\,\dfrac{2}{(2k+1)\pi}\). Also \(x_0 = \sqrt{2/\pi} \approx 0.798 < 1\).

On the partition \(0 < x_N < x_{N-1} < \cdots < x_1 < x_0 < 1\), consecutive values have opposite signs, so
          \[\lvert g(x_{k-1}) - g(x_k) \rvert = \frac{2}{\pi}\left(\frac{1}{2k-1} + \frac{1}{2k+1}\right) \qquad (k = 1, \dots, N).\]
          Hence the variation sum over this partition is \(\dfrac{2}{\pi}\sum_{k=1}^{N}\left(\dfrac{1}{2k-1} + \dfrac{1}{2k+1}\right) \ge \dfrac{2}{\pi}\sum_{k=1}^{N}\dfrac{1}{2k+1} \ge \dfrac{1}{\pi}\sum_{k=1}^{N}\dfrac{1}{k+1} \to \infty\) as \(N \to \infty\) (harmonic series). The total variation is infinite, so \(g\) is not of bounded variation.`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \(g_n\)은 \(x = 1/n\)에서 연속이다 (양쪽 값이 모두 \(g(1/n)\)). \([0, 1/n]\)에서는 상수이므로 유계변동이고, \([1/n, 1]\)에서는 \(g\)가 \(C^1\)이므로 유계변동이다 (\(V_{1/n}^1(g) \le \int_{1/n}^1 \lvert g' \rvert < \infty\) — \(g'\)은 콤팩트 구간에서 연속). 따라서 \(g_n\)은 \([0,1]\)에서 유계변동이다.

균일수렴: \([1/n, 1]\)에서는 \(g_n = g\)이므로 차이가 \(0\)이고, \([0, 1/n]\)에서는 \(\lvert g_n(x) - g(x) \rvert = \lvert g(1/n) - g(x) \rvert \le \lvert g(1/n) \rvert + \lvert g(x) \rvert \le \dfrac{1}{n^2} + \dfrac{1}{n^2} = \dfrac{2}{n^2} \to 0\)이다 (\(\lvert g(t) \rvert \le t^2\) 이용). 즉 \(\lVert g_n - g \rVert_\infty \to 0\)이다.`,
          en: String.raw`(b) \(g_n\) is continuous at \(x = 1/n\) (both sides equal \(g(1/n)\)). It is constant, hence BV, on \([0, 1/n]\), and \(g\) is \(C^1\), hence BV, on \([1/n, 1]\) (\(V_{1/n}^1(g) \le \int_{1/n}^1 \lvert g' \rvert < \infty\) since \(g'\) is continuous on a compact interval). So each \(g_n\) is of bounded variation on \([0,1]\).

For uniform convergence: on \([1/n, 1]\), \(g_n = g\), so the difference is \(0\); on \([0, 1/n]\), \(\lvert g_n(x) - g(x) \rvert = \lvert g(1/n) - g(x) \rvert \le \lvert g(1/n) \rvert + \lvert g(x) \rvert \le \dfrac{1}{n^2} + \dfrac{1}{n^2} = \dfrac{2}{n^2} \to 0\) (using \(\lvert g(t) \rvert \le t^2\)). Thus \(\lVert g_n - g \rVert_\infty \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`결론: 각 \(g_n\)은 유계변동이고 \(g_n \to g\) 균일수렴이지만, 극한 \(g\)는 유계변동이 아니다. 균일극한은 연속성은 보존하지만 유계변동성은 보존하지 않는다 — 변동이 극한 과정에서 "새어 나갈" 수 있다.`,
          en: String.raw`Conclusion: each \(g_n\) is of bounded variation and \(g_n \to g\) uniformly, but the limit \(g\) is not of bounded variation. Uniform limits preserve continuity but not bounded variation — variation can "leak out" in the limit.`,
        },
      },
    ],
  },
];
