import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 연속함수 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'open-interval-image',
    difficulty: 1,
    topics: ['continuity'],
    statement: {
      ko: String.raw`참·거짓을 판정하고 증명하라: 열린 구간의 연속함수에 의한 상은 항상 열린 집합이다.`,
      en: String.raw`True or false, with proof: the continuous image of an open interval is always an open set.`,
    },
    display: [String.raw`f(x) = x^2, \qquad I = (-1, 1), \qquad f(I) = [0, 1)`],
    solution: [
      {
        text: {
          ko: String.raw`거짓이다. \(f(x) = x^2\) (\(x \in \mathbb{R}\))는 연속이고 \(I = (-1, 1)\)은 열린 구간이다. \(f(I) = [0, 1)\)임을 주장한다.

\(0 \le y < 1\)이면 \(x = \sqrt{y} \in [0, 1) \subset I\)이고 \(f(x) = y\)이므로 \(y \in f(I)\)이다. \(y < 0\)이면 \(x^2 \ge 0\)이므로 도달 불가능하고, \(y \ge 1\)이면 \(|x| < 1\)에서 \(x^2 < 1\)이므로 도달 불가능하다.`,
          en: String.raw`False. \(f(x) = x^2\) on \(\mathbb{R}\) is continuous and \(I = (-1, 1)\) is an open interval. We claim \(f(I) = [0, 1)\).

If \(0 \le y < 1\) then \(x = \sqrt{y} \in [0, 1) \subset I\) and \(f(x) = y\), so \(y \in f(I)\). If \(y < 0\) it is unreachable since \(x^2 \ge 0\); if \(y \ge 1\) it is unreachable since \(|x| < 1\) implies \(x^2 < 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\([0, 1)\)은 \(\mathbb{R}\)에서 열린 집합이 아니다: \(0 \in [0, 1)\)이지만, 모든 \(\varepsilon > 0\)에 대해 \(-\varepsilon/2 \in (-\varepsilon, \varepsilon)\)이면서 \(-\varepsilon/2 \notin [0, 1)\)이다.

따라서 열린 구간의 연속상 \([0, 1)\)은 열려 있지 않다. 연속성은 열린성을 보존하지 않는다 (닫힌성은 보존한다: 콤팩트 집합의 연속상은 콤팩트).`,
          en: String.raw`\([0, 1)\) is not open in \(\mathbb{R}\): \(0 \in [0, 1)\) but for every \(\varepsilon > 0\), \(-\varepsilon/2 \in (-\varepsilon, \varepsilon)\) while \(-\varepsilon/2 \notin [0, 1)\).

So the continuous image \([0, 1)\) of the open interval is not open. Continuity does not preserve openness (it does preserve closedness via compactness: the continuous image of a compact set is compact).`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'uniform-vanishing-bump',
    difficulty: 2,
    topics: ['uniform'],
    statement: {
      ko: String.raw`\(\mathbb{R}\) 위에서 \(f_n(x) = \frac{x}{1 + n x^2}\)이라 하자.

각 점별 극한 \(\lim_{n \to \infty} f_n(x)\)를 구하고, 수렴이 \(\mathbb{R}\) 위에서 균등함을 증명하라. \(\sup_{x \in \mathbb{R}} |f_n(x)|\)의 정확한 값을 구하라.`,
      en: String.raw`On \(\mathbb{R}\) let \(f_n(x) = \frac{x}{1 + n x^2}\).

Find the pointwise limit \(\lim_{n \to \infty} f_n(x)\) at each \(x\), prove the convergence is uniform on \(\mathbb{R}\), and compute the exact value of \(\sup_{x \in \mathbb{R}} |f_n(x)|\).`,
    },
    display: [
      String.raw`f_n(x) \to 0 \quad (n \to \infty) \text{ for every } x`,
      String.raw`\sup_{\mathbb{R}} |f_n| = \frac{1}{2\sqrt{n}} \to 0`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`먼저 점별 극한을 구한다. \(x = 0\)이면 \(f_n(0) = 0\)이다.

\(x \ne 0\)이면 \(1 + nx^2 \ge nx^2\)이므로 \(|f_n(x)| \le \frac{|x|}{nx^2} = \frac{1}{n|x|} \to 0\)이다. 따라서 점별 극한함수는 \(f \equiv 0\)이다.`,
          en: String.raw`First the pointwise limit. If \(x = 0\) then \(f_n(0) = 0\).

If \(x \ne 0\) then \(1 + nx^2 \ge nx^2\), so \(|f_n(x)| \le \frac{|x|}{nx^2} = \frac{1}{n|x|} \to 0\). Hence the pointwise limit is \(f \equiv 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`균등수렴은 상한 노름으로 판정한다: \(f_n \to f\)가 균등할 필요충분조건은 \(\sup |f_n - f| \to 0\)이다. \(f_n\)은 기함수이므로 \(|f_n|\)의 상한은 \(x \ge 0\)에서 찾으면 된다.

\(x \ge 0\)에서 미분하면 \(g_n'(x) = \frac{1 - nx^2}{(1 + nx^2)^2}\)이므로 유일한 임계점은 \(x = 1/\sqrt{n}\)이고, 그 값은 \(g_n(1/\sqrt{n}) = \frac{1/\sqrt{n}}{2} = \frac{1}{2\sqrt{n}}\)이다. 경계(\(x = 0\) 또는 \(x \to \infty\))에서는 값이 \(0\)이므로 이것이 전역 최댓값이다.`,
          en: String.raw`Uniform convergence is decided by the sup norm: \(f_n \to f\) uniformly iff \(\sup |f_n - f| \to 0\). Since \(f_n\) is odd, the supremum of \(|f_n|\) is found on \(x \ge 0\).

Differentiating there, \(g_n'(x) = \frac{1 - nx^2}{(1 + nx^2)^2}\), so the unique critical point is \(x = 1/\sqrt{n}\) with value \(g_n(1/\sqrt{n}) = \frac{1/\sqrt{n}}{2} = \frac{1}{2\sqrt{n}}\). The boundary values (\(x = 0\) and \(x \to \infty\)) are \(0\), so this is the global maximum.`,
        },
      },
      {
        text: {
          ko: String.raw`기함수 대칭성에 의해 \(\sup_{x \in \mathbb{R}} |f_n(x)| = \frac{1}{2\sqrt{n}} \to 0\)이다. 따라서 \(f_n \to 0\)은 \(\mathbb{R}\) 위에서 균등수렴한다.

봉우리의 위치 \(1/\sqrt{n}\)은 \(0\)으로 이동하지만 높이가 \(1/(2\sqrt{n})\)으로 함께 꺼지므로 균등수렴이 성립한다.`,
          en: String.raw`By odd symmetry, \(\sup_{x \in \mathbb{R}} |f_n(x)| = \frac{1}{2\sqrt{n}} \to 0\). Hence \(f_n \to 0\) uniformly on \(\mathbb{R}\).

The bump's location \(1/\sqrt{n}\) drifts toward \(0\), but its height \(1/(2\sqrt{n})\) collapses too, which is exactly why the convergence is uniform.`,
        },
      },
    ],
  },
];
