import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 근사 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'moments-zero',
    difficulty: 3,
    topics: ['weierstrass-approx'],
    statement: {
      ko: String.raw`\(f\)가 \([0, 1]\)에서 연속이고 모든 정수 \(n \ge 0\)에 대해 \(\int_0^1 x^n f(x)\,dx = 0\)이라 하자. 바이어슈트라스 근사정리를 이용해 \(f \equiv 0\)임을 증명하라.`,
      en: String.raw`Let \(f\) be continuous on \([0, 1]\) and suppose \(\int_0^1 x^n f(x)\,dx = 0\) for every integer \(n \ge 0\). Use the Weierstrass approximation theorem to prove \(f \equiv 0\).`,
    },
    display: [
      String.raw`\int_0^1 x^n f(x)\,dx = 0 \quad \forall n \ge 0 \quad \Longrightarrow \quad f \equiv 0`,
      String.raw`\int_0^1 f(x)^2\,dx = \lim_{k \to \infty} \int_0^1 p_k(x) f(x)\,dx = 0`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`먼저 가정을 다항식 전체로 확장한다. \(p(x) = \sum_{j=0}^m c_j x^j\)이면 적분의 선형성에 의해 \(\int_0^1 p(x) f(x)\,dx = \sum_{j=0}^m c_j \int_0^1 x^j f(x)\,dx = 0\)이다. 즉 모든 다항식 \(p\)에 대해 \(\int_0^1 pf = 0\)이다.`,
          en: String.raw`First extend the hypothesis to all polynomials. If \(p(x) = \sum_{j=0}^m c_j x^j\), linearity of the integral gives \(\int_0^1 p(x) f(x)\,dx = \sum_{j=0}^m c_j \int_0^1 x^j f(x)\,dx = 0\). So \(\int_0^1 pf = 0\) for every polynomial \(p\).`,
        },
      },
      {
        text: {
          ko: String.raw`바이어슈트라스 근사정리에 의해 다항식 수열 \((p_k)\)가 \(f\)에 \([0, 1]\)에서 균등수렴한다: \(\|p_k - f\|_\infty \to 0\). \(M = \max_{[0,1]} |f|\) (콤팩트 구간 위의 연속함수는 최댓값을 갖는다)이라 두면`,
          en: String.raw`By the Weierstrass approximation theorem, there are polynomials \((p_k)\) with \(p_k \to f\) uniformly on \([0, 1]\): \(\|p_k - f\|_\infty \to 0\). Put \(M = \max_{[0,1]} |f|\) (a continuous function on a compact interval attains its maximum). Then`,
        },
        display: [
          String.raw`\left|\int_0^1 p_k f - \int_0^1 f^2\right| = \left|\int_0^1 (p_k - f) f\right| \le \|p_k - f\|_\infty \cdot M \longrightarrow 0.`,
        ],
      },
      {
        text: {
          ko: String.raw`그런데 각 \(\int_0^1 p_k f = 0\)이므로 극한을 취하면 \(\int_0^1 f(x)^2\,dx = 0\)을 얻는다. \(f^2\)는 연속이고 \(0\) 이상이므로 \(f^2 \equiv 0\)이다: \(f(c)^2 = \eta > 0\)인 점 \(c\)가 있다면 연속성에 의해 어떤 구간에서 \(f^2 \ge \eta/2\)가 되어 적분이 양수가 되기 때문이다. 따라서 \(f \equiv 0\)이다.`,
          en: String.raw`Since each \(\int_0^1 p_k f = 0\), passing to the limit gives \(\int_0^1 f(x)^2\,dx = 0\). As \(f^2\) is continuous and nonnegative, \(f^2 \equiv 0\): if \(f(c)^2 = \eta > 0\) at some \(c\), continuity would force \(f^2 \ge \eta/2\) on an interval, making the integral positive. Hence \(f \equiv 0\).`,
        },
      },
    ],
  },
];
