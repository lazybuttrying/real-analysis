import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the function-spaces scene. Imports
 * nothing except types. The numbers below were verified against the
 * model (tests/function-spaces.test.ts): for f(x) = e^{-|x|} and the
 * cutoff approximants f_k = phi_k f, the sup error ||f - f_k||_infinity
 * recomputed on a fine grid equals e^{-(k+1)} to grid accuracy and is
 * bounded by e^{-k}; the three representatives all have sup norm 1,
 * with window-edge values 0, e^{-4}, and 1 respectively.
 */
export const functionSpacesProblems: readonly ProblemMeta[] = [
  {
    id: 'c0-closed-in-cb',
    statement: {
      ko: String.raw`\(C_0(\mathbb{R})\)가 sup 노름에 대해 \(C_b(\mathbb{R})\)의 닫힌 부분공간임을 완전히 증명하세요.

즉, \(f_n \in C_0(\mathbb{R})\)이고 \(f \in C_b(\mathbb{R})\)이며 \(\|f_n - f\|_\infty \to 0\)이면 \(f \in C_0(\mathbb{R})\)임을 보이세요.

(균등수렴하는 연속함수열의 극한은 연속이라는 사실은 사용해도 됩니다.)`,
      en: String.raw`Prove completely that \(C_0(\mathbb{R})\) is a closed subspace of \(C_b(\mathbb{R})\) in the sup norm.

That is, show that if \(f_n \in C_0(\mathbb{R})\), \(f \in C_b(\mathbb{R})\), and \(\|f_n - f\|_\infty \to 0\), then \(f \in C_0(\mathbb{R})\).

(You may use the fact that a uniform limit of continuous functions is continuous.)`,
    },
    display: [
      String.raw`|f(x)| \le |f_n(x)| + \|f - f_n\|_\infty < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon \quad (|x| > M)`,
    ],
    preset: { mode: 'spaces', k: 1 },
    presetCaption: {
      ko: String.raw`세 대표원소: 텐트 함수(\(C_c\)), \(e^{-|x|}\)(\(C_0\)), 상수 \(1\)(\(C_b\)) — \(C_0\)가 닫혀 있다는 것은 이 가운데 층이 균등극한에 닫혀 있다는 뜻입니다.`,
      en: String.raw`The three representatives: the tent (\(C_c\)), \(e^{-|x|}\) (\(C_0\)), and the constant \(1\) (\(C_b\)) — closedness says the middle layer is sealed under uniform limits.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)을 고정합니다. \(\|f_n - f\|_\infty \to 0\)이므로, 어떤 \(n\)이 존재해서 \(\|f - f_n\|_\infty < \frac{\varepsilon}{2}\)를 만족합니다. 이 \(n\)을 고정합니다.`,
          en: String.raw`Fix \(\varepsilon > 0\). Since \(\|f_n - f\|_\infty \to 0\), there is an \(n\) with \(\|f - f_n\|_\infty < \frac{\varepsilon}{2}\). Fix this \(n\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f_n \in C_0(\mathbb{R})\)이므로 \(f_n\)은 무한원에서 사라집니다: 어떤 \(M\)이 존재해서 \(|x| > M\)이면 \(|f_n(x)| < \frac{\varepsilon}{2}\)입니다.`,
          en: String.raw`Since \(f_n \in C_0(\mathbb{R})\), it vanishes at infinity: there is \(M\) such that \(|x| > M\) implies \(|f_n(x)| < \frac{\varepsilon}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|x| > M\)인 \(x\)에 대해 삼각부등식을 적용합니다:

\(|f(x)| \le |f_n(x)| + |f(x) - f_n(x)| \le |f_n(x)| + \|f - f_n\|_\infty < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\).

즉 \(|x| > M\)이면 \(|f(x)| < \varepsilon\)이며, 이는 \(f\)가 무한원에서 사라진다는 뜻입니다. 따라서 \(f \in C_0(\mathbb{R})\)입니다.`,
          en: String.raw`For \(|x| > M\), the triangle inequality gives

\(|f(x)| \le |f_n(x)| + |f(x) - f_n(x)| \le |f_n(x)| + \|f - f_n\|_\infty < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\).

So \(|x| > M\) implies \(|f(x)| < \varepsilon\): \(f\) vanishes at infinity, hence \(f \in C_0(\mathbb{R})\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(C_0(\mathbb{R})\)는 \(C_b(\mathbb{R})\) 안의 수열 극한을 모두 포함하므로 닫혀 있습니다.

\(C_b(\mathbb{R})\)가 sup 노름에 대해 완비하므로 (균등 Cauchy 수열은 유계 연속함수로 균등수렴합니다), 닫힌 부분공간 \(C_0(\mathbb{R})\)도 완비합니다.`,
          en: String.raw`Hence \(C_0(\mathbb{R})\) contains all its sequential limits inside \(C_b(\mathbb{R})\): it is closed.

Since \(C_b(\mathbb{R})\) is complete in the sup norm (uniformly Cauchy sequences converge uniformly to bounded continuous limits), the closed subspace \(C_0(\mathbb{R})\) is complete as well.`,
        },
      },
    ],
  },
  {
    id: 'cc-dense-in-c0',
    statement: {
      ko: String.raw`절단 함수 \(\varphi_k(x) = 1\) (\(|x| \le k\)), \(\varphi_k(x) = k + 1 - |x|\) (\(k \le |x| \le k+1\)), \(\varphi_k(x) = 0\) (\(|x| \ge k+1\))를 이용해, \(C_c(\mathbb{R})\)가 \(C_0(\mathbb{R})\) 안에서 sup 노름으로 dense임을 완전히 증명하세요.

즉, 모든 \(f \in C_0(\mathbb{R})\)와 모든 \(\varepsilon > 0\)에 대해 \(\|f - \varphi_k f\|_\infty < \varepsilon\)인 \(k\)가 존재함을 보이세요.`,
      en: String.raw`Using the cutoff functions \(\varphi_k(x) = 1\) for \(|x| \le k\), \(\varphi_k(x) = k + 1 - |x|\) for \(k \le |x| \le k+1\), and \(\varphi_k(x) = 0\) for \(|x| \ge k+1\), prove completely that \(C_c(\mathbb{R})\) is dense in \(C_0(\mathbb{R})\) in the sup norm.

That is, show that for every \(f \in C_0(\mathbb{R})\) and every \(\varepsilon > 0\) there is a \(k\) with \(\|f - \varphi_k f\|_\infty < \varepsilon\).`,
    },
    display: [
      String.raw`|f(x) - \varphi_k(x) f(x)| = (1 - \varphi_k(x))\,|f(x)| \le \sup_{|t| \ge k} |f(t)|`,
    ],
    preset: { mode: 'cutoff', k: 1 },
    presetCaption: {
      ko: String.raw`\(k = 1\): \(f_1 = \varphi_1 f\)는 \([-(k+1), k+1] = [-2, 2]\) 밖에서 사라지는 \(C_c\) 함수이고, sup 오차는 \(e^{-2} \approx 0.1353\)입니다.`,
      en: String.raw`\(k = 1\): \(f_1 = \varphi_1 f\) is a \(C_c\) function vanishing outside \([-(k+1), k+1] = [-2, 2]\), with sup error \(e^{-2} \approx 0.1353\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f \in C_0(\mathbb{R})\)와 \(\varepsilon > 0\)을 고정합니다. 먼저 \(f_k = \varphi_k f\)가 \(C_c(\mathbb{R})\)에 속함을 확인합니다.

\(\varphi_k\)는 조각별 선형이라 연속이고, \(f\)도 연속이므로 곱 \(f_k\)는 연속입니다. \(|x| \ge k+1\)이면 \(\varphi_k(x) = 0\)이라 \(f_k(x) = 0\)입니다. 따라서 \(\operatorname{supp} f_k \subseteq [-(k+1), k+1]\)이며, 이 지지집합은 compact이므로 \(f_k \in C_c(\mathbb{R})\)입니다.`,
          en: String.raw`Fix \(f \in C_0(\mathbb{R})\) and \(\varepsilon > 0\). First, \(f_k = \varphi_k f\) lies in \(C_c(\mathbb{R})\): \(\varphi_k\) is piecewise linear, hence continuous, and \(f\) is continuous, so the product \(f_k\) is continuous. For \(|x| \ge k+1\), \(\varphi_k(x) = 0\), so \(f_k(x) = 0\). Hence \(\operatorname{supp} f_k \subseteq [-(k+1), k+1]\), a compact set, and \(f_k \in C_c(\mathbb{R})\).`,
        },
      },
      {
        text: {
          ko: String.raw`오차를 잽니다. \(|x| \le k\)이면 \(\varphi_k(x) = 1\)이라 \(f_k(x) = f(x)\)이고 오차는 \(0\)입니다.

\(|x| > k\)이면 \(0 \le 1 - \varphi_k(x) \le 1\)이므로

\(|f(x) - f_k(x)| = (1 - \varphi_k(x))\,|f(x)| \le |f(x)| \le \sup_{|t| \ge k} |f(t)|\).

결론적으로 모든 \(x\)에 대해 \(|f(x) - f_k(x)| \le \sup_{|t| \ge k} |f(t)|\)이며, 따라서 \(\|f - f_k\|_\infty \le \sup_{|t| \ge k} |f(t)|\)입니다.`,
          en: String.raw`Estimate the error. If \(|x| \le k\) then \(\varphi_k(x) = 1\), so \(f_k(x) = f(x)\) and the error is \(0\).

If \(|x| > k\) then \(0 \le 1 - \varphi_k(x) \le 1\), so

\(|f(x) - f_k(x)| = (1 - \varphi_k(x))\,|f(x)| \le |f(x)| \le \sup_{|t| \ge k} |f(t)|\).

Hence \(|f(x) - f_k(x)| \le \sup_{|t| \ge k} |f(t)|\) for every \(x\), and \(\|f - f_k\|_\infty \le \sup_{|t| \ge k} |f(t)|\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f \in C_0(\mathbb{R})\)이므로 \(f\)는 무한원에서 사라집니다. 이를 \(\frac{\varepsilon}{2}\)에 적용하면, 어떤 \(k\)가 존재해서 \(|t| \ge k\)이면 \(|f(t)| < \frac{\varepsilon}{2}\)입니다.

이 \(k\)에 대해 \(\sup_{|t| \ge k} |f(t)| \le \frac{\varepsilon}{2}\)이고, 앞 단계에서 \(\|f - f_k\|_\infty \le \frac{\varepsilon}{2} < \varepsilon\)를 얻습니다.

즉 \(f\)의 모든 \(\varepsilon\)-근방에 \(C_c(\mathbb{R})\)의 원소 \(f_k\)가 들어 있습니다.`,
          en: String.raw`Since \(f \in C_0(\mathbb{R})\), it vanishes at infinity. Applying this with \(\frac{\varepsilon}{2}\) gives a \(k\) with \(|f(t)| < \frac{\varepsilon}{2}\) for all \(|t| \ge k\).

For this \(k\), \(\sup_{|t| \ge k} |f(t)| \le \frac{\varepsilon}{2}\), and the previous step gives \(\|f - f_k\|_\infty \le \frac{\varepsilon}{2} < \varepsilon\).

So every \(\varepsilon\)-neighborhood of \(f\) contains the element \(f_k\) of \(C_c(\mathbb{R})\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(C_0(\mathbb{R}) \subseteq \overline{C_c(\mathbb{R})}\)입니다.

반대로 \(C_c(\mathbb{R}) \subseteq C_0(\mathbb{R})\)이고 문제 1에 의해 \(C_0(\mathbb{R})\)는 닫혀 있으므로 \(\overline{C_c(\mathbb{R})} \subseteq C_0(\mathbb{R})\)입니다.

결론적으로 \(\overline{C_c(\mathbb{R})} = C_0(\mathbb{R})\): \(C_c(\mathbb{R})\)는 \(C_0(\mathbb{R})\) 안에서 dense입니다.`,
          en: String.raw`Therefore \(C_0(\mathbb{R}) \subseteq \overline{C_c(\mathbb{R})}\).

Conversely, \(C_c(\mathbb{R}) \subseteq C_0(\mathbb{R})\), and \(C_0(\mathbb{R})\) is closed by Problem 1, so \(\overline{C_c(\mathbb{R})} \subseteq C_0(\mathbb{R})\).

Hence \(\overline{C_c(\mathbb{R})} = C_0(\mathbb{R})\): \(C_c(\mathbb{R})\) is dense in \(C_0(\mathbb{R})\).`,
        },
      },
    ],
  },
  {
    id: 'cc-not-complete',
    statement: {
      ko: String.raw`\(f(x) = e^{-|x|}\)와 \(f_j = \varphi_j f\) (\(j = 1, 2, 3, \dots\), \(\varphi_j\)는 문제 2의 절단 함수)를 이용해, \(C_c(\mathbb{R})\)가 sup 노름에 대해 완비가 아님을 완전히 증명하세요.

즉, \((f_j)\)는 \(C_c(\mathbb{R})\) 안의 균등 Cauchy 수열이지만, sup 노름 극한인 \(f\)는 \(C_c(\mathbb{R})\)에 속하지 않음을 보이세요.`,
      en: String.raw`Using \(f(x) = e^{-|x|}\) and \(f_j = \varphi_j f\) for \(j = 1, 2, 3, \dots\), where \(\varphi_j\) is the cutoff of Problem 2, prove completely that \(C_c(\mathbb{R})\) is not complete in the sup norm.

That is, show that \((f_j)\) is a uniformly Cauchy sequence in \(C_c(\mathbb{R})\) whose sup-norm limit \(f\) does not belong to \(C_c(\mathbb{R})\).`,
    },
    display: [
      String.raw`\|f - f_j\|_\infty = e^{-(j+1)}, \qquad \|f_i - f_j\|_\infty \le e^{-(i+1)} + e^{-(j+1)}`,
    ],
    preset: { mode: 'cutoff', k: 2 },
    presetCaption: {
      ko: String.raw`\(k = 2\): 절단이 넓어질수록 sup 오차 \(e^{-(k+1)}\)는 \(e^{-3} \approx 0.0498\)까지 줄지만, 극한 함수 \(e^{-|x|}\) 자체는 어디에서도 \(0\)이 되지 않습니다.`,
      en: String.raw`\(k = 2\): widening the cutoff shrinks the sup error \(e^{-(k+1)}\) to \(e^{-3} \approx 0.0498\), but the limit \(e^{-|x|}\) itself is zero nowhere.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(f_j = \varphi_j f\)는 문제 2의 첫 단계에 의해 \(C_c(\mathbb{R})\)에 속합니다: 연속이고, \(\operatorname{supp} f_j \subseteq [-(j+1), j+1]\)입니다.

핵심 등식은 \(\|f - f_j\|_\infty = e^{-(j+1)}\)입니다. 구간별로 확인합니다.

\(|x| \le j\): \(\varphi_j(x) = 1\)이라 오차는 \(0\)입니다.

\(j \le |x| \le j+1\): \(s = |x| - j \in [0, 1]\)로 두면 오차는 \(s\, e^{-|x|} = e^{-(j+1)} \cdot s e^{1-s}\)입니다. \(e^{s-1} \ge 1 + (s - 1) = s\) (지수함수의 볼록성)이므로 \(s e^{1-s} \le 1\)이고, 오차는 \(e^{-(j+1)}\) 이하입니다.

\(|x| \ge j+1\): \(\varphi_j(x) = 0\)이라 오차는 \(e^{-|x|} \le e^{-(j+1)}\)입니다.

그리고 \(|x| = j+1\)에서는 오차가 정확히 \(e^{-(j+1)}\)이므로, 상한은 이 값과 같습니다.`,
          en: String.raw`Each \(f_j = \varphi_j f\) lies in \(C_c(\mathbb{R})\) by the first step of Problem 2: it is continuous, with \(\operatorname{supp} f_j \subseteq [-(j+1), j+1]\).

The key identity is \(\|f - f_j\|_\infty = e^{-(j+1)}\), checked region by region.

For \(|x| \le j\): \(\varphi_j(x) = 1\), so the error is \(0\).

For \(j \le |x| \le j+1\): with \(s = |x| - j \in [0, 1]\), the error is \(s\, e^{-|x|} = e^{-(j+1)} \cdot s e^{1-s}\). Since \(e^{s-1} \ge 1 + (s - 1) = s\) (convexity of the exponential), \(s e^{1-s} \le 1\), so the error is at most \(e^{-(j+1)}\).

For \(|x| \ge j+1\): \(\varphi_j(x) = 0\), so the error is \(e^{-|x|} \le e^{-(j+1)}\).

At \(|x| = j+1\) the error equals \(e^{-(j+1)}\) exactly, so the supremum is that value.`,
        },
      },
      {
        text: {
          ko: String.raw`\((f_j)\)가 균등 Cauchy임을 보입니다. 모든 \(i, j\)에 대해 삼각부등식으로

\(\|f_i - f_j\|_\infty \le \|f_i - f\|_\infty + \|f - f_j\|_\infty = e^{-(i+1)} + e^{-(j+1)}\).

\(i, j \to \infty\)이면 오른쪽이 \(0\)으로 가므로, 모든 \(\varepsilon > 0\)에 대해 \(i, j\)가 충분히 크면 \(\|f_i - f_j\|_\infty < \varepsilon\)입니다: \((f_j)\)는 sup 노름 Cauchy 수열입니다.

또한 \(\|f_j - f\|_\infty = e^{-(j+1)} \to 0\)이므로, \((f_j)\)의 sup 노름 극한 (즉 \(C_b(\mathbb{R})\) 안에서의 극한)은 \(f\)입니다.`,
          en: String.raw`The sequence \((f_j)\) is uniformly Cauchy: for all \(i, j\), the triangle inequality gives

\(\|f_i - f_j\|_\infty \le \|f_i - f\|_\infty + \|f - f_j\|_\infty = e^{-(i+1)} + e^{-(j+1)}\).

The right side tends to \(0\) as \(i, j \to \infty\), so for every \(\varepsilon > 0\), \(\|f_i - f_j\|_\infty < \varepsilon\) once \(i, j\) are large: \((f_j)\) is Cauchy in the sup norm.

Also \(\|f_j - f\|_\infty = e^{-(j+1)} \to 0\), so the sup-norm limit of \((f_j)\) (its limit inside \(C_b(\mathbb{R})\)) is \(f\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f \in C_0(\mathbb{R})\)입니다: \(\varepsilon > 0\)에 대해 \(|x| > \ln\frac{1}{\varepsilon}\)이면 \(|f(x)| = e^{-|x|} < \varepsilon\)이기 때문입니다.

그러나 \(f \notin C_c(\mathbb{R})\)입니다: 모든 \(x\)에 대해 \(f(x) = e^{-|x|} > 0\)이라 \(\{x : f(x) \ne 0\} = \mathbb{R}\)이고, \(\operatorname{supp} f = \mathbb{R}\)는 compact이 아닙니다.`,
          en: String.raw`We have \(f \in C_0(\mathbb{R})\): for \(\varepsilon > 0\), \(|x| > \ln\frac{1}{\varepsilon}\) implies \(|f(x)| = e^{-|x|} < \varepsilon\).

But \(f \notin C_c(\mathbb{R})\): \(f(x) = e^{-|x|} > 0\) for every \(x\), so \(\{x : f(x) \ne 0\} = \mathbb{R}\) and \(\operatorname{supp} f = \mathbb{R}\) is not compact.`,
        },
      },
      {
        text: {
          ko: String.raw`\(C_c(\mathbb{R})\)가 완비했다고 가정해 보세요. 그러면 Cauchy 수열 \((f_j)\)는 어떤 \(g \in C_c(\mathbb{R})\)로 sup 노름 수렴해야 합니다.

그러나 sup 노름 극한은 \(C_b(\mathbb{R})\) 안에서 유일합니다: \(\|f_j - g\|_\infty \to 0\)이고 \(\|f_j - f\|_\infty \to 0\)이면 \(\|f - g\|_\infty \le \|f - f_j\|_\infty + \|f_j - g\|_\infty \to 0\)이라 \(f = g\)입니다.

그런데 \(f \notin C_c(\mathbb{R})\)이므로 모순입니다. 따라서 \(C_c(\mathbb{R})\)는 완비가 아니며, \(C_0(\mathbb{R})\) 안에서도 \(C_b(\mathbb{R})\) 안에서도 닫혀 있지 않습니다 (문제 2의 density와 함께 읽으면 \(\overline{C_c(\mathbb{R})} = C_0(\mathbb{R})\)가 됩니다).`,
          en: String.raw`Suppose \(C_c(\mathbb{R})\) were complete. Then the Cauchy sequence \((f_j)\) would converge in sup norm to some \(g \in C_c(\mathbb{R})\).

But sup-norm limits are unique inside \(C_b(\mathbb{R})\): if \(\|f_j - g\|_\infty \to 0\) and \(\|f_j - f\|_\infty \to 0\), then \(\|f - g\|_\infty \le \|f - f_j\|_\infty + \|f_j - g\|_\infty \to 0\), so \(f = g\).

Since \(f \notin C_c(\mathbb{R})\), this is a contradiction. Hence \(C_c(\mathbb{R})\) is not complete, and it is closed neither in \(C_0(\mathbb{R})\) nor in \(C_b(\mathbb{R})\) (together with the density of Problem 2, \(\overline{C_c(\mathbb{R})} = C_0(\mathbb{R})\)).`,
        },
      },
    ],
  },
];
