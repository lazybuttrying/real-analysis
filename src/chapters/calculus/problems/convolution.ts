import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the convolution scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/convolution.test.ts):
 *   tent mode at x = 0.7 gives 0.7 and at x = 1.4 gives 2 - 1.4 = 0.6
 *   (overlap length equals the tent formula to 1e-9);
 *   smooth mode at x = 0.05, eps = 0.1 gives the tent CDF at
 *   v = 0.5, namely 1 - (1 - 0.5)^2 / 2 = 0.875 (fine trapezoid agrees
 *   to 1e-3), at x = 0.5, eps = 0.3 gives 1 (v = 5/3 >= 1), and at
 *   x = -0.2, eps = 0.1 gives 0 (v = -2 <= -1);
 *   the tent kernel integrates to 1 (triangle of base 2, height 1).
 */
export const convolutionProblems: readonly ProblemMeta[] = [
  {
    id: 'commutativity',
    statement: {
      ko: String.raw`합성곱은 교환법칙을 만족함을 증명하세요: 적분 가능한 함수 \(f, g\)에 대해 모든 \(x\)에서 \((f * g)(x) = (g * f)(x)\)입니다.

치환 \(u = x - t\)를 쓰고, 적분 구간의 방향이 뒤집히는 단계와 부호가 상쇄되는 단계를 명시하세요.`,
      en: String.raw`Prove that convolution commutes: for integrable \(f, g\), \((f * g)(x) = (g * f)(x)\) for every \(x\).

Use the substitution \(u = x - t\), making the limit-flip step and the sign cancellation explicit.`,
    },
    display: [
      String.raw`(f * g)(x) = \int_{-\infty}^{\infty} f(t)\, g(x - t)\, dt`,
      String.raw`f, g \in L^1(\mathbb{R}), \qquad \int_{-\infty}^{\infty} |f(t)\, g(x - t)|\, dt < \infty`,
    ],
    preset: { mode: 'tent', x: 0.7, eps: 0.3 },
    presetCaption: {
      ko: String.raw`텐트 모드, \(x = 0.7\): \((f * g)(0.7) = 0.7\) -- 여기서 \(f = g\)라 교환이 자명해 보이지만, 아래 증명은 모든 적분 가능한 쌍에 대해 성립합니다.`,
      en: String.raw`Tent mode, \(x = 0.7\): \((f * g)(0.7) = 0.7\) -- here \(f = g\) makes commutativity look trivial, but the proof below works for every integrable pair.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`가정: \(f, g \in L^1(\mathbb{R})\)이고, 고정된 \(x\)에 대해 곱의 적분이 절대수렴합니다 (display 둘째 줄). 이 조건에서 아래 치환은 정당합니다. 정의에서 출발합니다: \((f * g)(x) = \int_{-\infty}^{\infty} f(t)\, g(x - t)\, dt\).`,
          en: String.raw`Hypothesis: \(f, g \in L^1(\mathbb{R})\), and for the fixed \(x\) the product integral converges absolutely (second display line). Under this condition the substitution below is legitimate. Start from the definition: \((f * g)(x) = \int_{-\infty}^{\infty} f(t)\, g(x - t)\, dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`치환 \(u = x - t\)를 적용합니다. 그러면 \(t = x - u\)이고 \(dt = -du\)입니다. 구간의 끝점은 \(t \to -\infty\)일 때 \(u \to +\infty\)이고, \(t \to +\infty\)일 때 \(u \to -\infty\)입니다 -- 즉 \(t: -\infty \to \infty\)는 \(u: \infty \to -\infty\)로 대응합니다. 대입하면 \((f * g)(x) = \int_{+\infty}^{-\infty} f(x - u)\, g(u)\, (-du)\)입니다.`,
          en: String.raw`Apply the substitution \(u = x - t\). Then \(t = x - u\) and \(dt = -du\). The endpoints map as \(u \to +\infty\) when \(t \to -\infty\) and \(u \to -\infty\) when \(t \to +\infty\) -- that is, \(t: -\infty \to \infty\) corresponds to \(u: \infty \to -\infty\). Substituting gives \((f * g)(x) = \int_{+\infty}^{-\infty} f(x - u)\, g(u)\, (-du)\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 두 가지 부호가 상쇄됩니다: \(du\) 앞의 \(-1\)은 적분 구간을 뒤집는 것 (\(\int_{+\infty}^{-\infty} = -\int_{-\infty}^{+\infty}\))과 정확히 하나씩 짝을 이룹니다. 따라서 \((f * g)(x) = \int_{-\infty}^{\infty} f(x - u)\, g(u)\, du\)입니다.`,
          en: String.raw`Now the two signs cancel: the factor \(-1\) in \(-du\) pairs exactly with flipping the limits (\(\int_{+\infty}^{-\infty} = -\int_{-\infty}^{+\infty}\)). Hence \((f * g)(x) = \int_{-\infty}^{\infty} f(x - u)\, g(u)\, du\).`,
        },
      },
      {
        text: {
          ko: String.raw`오른쪽은 정의 그대로 \((g * f)(x) = \int_{-\infty}^{\infty} g(u)\, f(x - u)\, du\)입니다 (더미 변수 이름만 \(u\)입니다). 따라서 \((f * g)(x) = (g * f)(x)\)이며, \(x\)는 임의였으므로 \(f * g = g * f\)입니다.`,
          en: String.raw`The right side is, by definition, \((g * f)(x) = \int_{-\infty}^{\infty} g(u)\, f(x - u)\, du\) (the dummy variable is just named \(u\)). Hence \((f * g)(x) = (g * f)(x)\), and \(x\) was arbitrary, so \(f * g = g * f\).`,
        },
      },
    ],
  },
  {
    id: 'indicator-tent',
    statement: {
      ko: String.raw`\(f = g = \mathbf{1}_{[0,1]}\)일 때 \((f * g)(x)\)를 모든 실수 \(x\)에 대해 구하세요.

답은 텐트 함수여야 합니다: \([0,1]\)에서 \(x\), \([1,2]\)에서 \(2 - x\), 그 밖에서는 \(0\) -- 씬의 흔적과 일치합니다.`,
      en: String.raw`For \(f = g = \mathbf{1}_{[0,1]}\), compute \((f * g)(x)\) for every real \(x\).

The answer must be the tent function: \(x\) on \([0,1]\), \(2 - x\) on \([1,2]\), and \(0\) elsewhere -- matching the trace in the scene.`,
    },
    display: [
      String.raw`(f * g)(x) = \int_{-\infty}^{\infty} \mathbf{1}_{[0,1]}(t)\, \mathbf{1}_{[0,1]}(x - t)\, dt = \text{length of } [0,1] \cap [x-1, x]`,
    ],
    preset: { mode: 'tent', x: 1.4, eps: 0.3 },
    presetCaption: {
      ko: String.raw`텐트 모드, \(x = 1.4\): 겹침은 \([0.4, 1]\)이고 \((f * g)(1.4) = 2 - 1.4 = 0.6\)입니다 -- 아래 경우 나누기의 내리막 구간입니다.`,
      en: String.raw`Tent mode, \(x = 1.4\): the overlap is \([0.4, 1]\) and \((f * g)(1.4) = 2 - 1.4 = 0.6\) -- the falling case of the case split below.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`곱 \(\mathbf{1}_{[0,1]}(t)\, \mathbf{1}_{[0,1]}(x - t)\)는 두 조건이 동시에 성립할 때만 \(1\)입니다: \(0 \le t \le 1\)이고 \(0 \le x - t \le 1\). 둘째 조건은 \(x - 1 \le t \le x\)와 동치입니다. 따라서 적분은 집합 \(\{t : 0 \le t \le 1,\ x - 1 \le t \le x\} = [0,1] \cap [x-1, x]\)의 길이와 같습니다.`,
          en: String.raw`The product \(\mathbf{1}_{[0,1]}(t)\, \mathbf{1}_{[0,1]}(x - t)\) equals \(1\) exactly when both conditions hold: \(0 \le t \le 1\) and \(0 \le x - t \le 1\). The second condition is equivalent to \(x - 1 \le t \le x\). Hence the integral is the length of \(\{t : 0 \le t \le 1,\ x - 1 \le t \le x\} = [0,1] \cap [x-1, x]\).`,
        },
      },
      {
        text: {
          ko: String.raw`교집합의 끝점은 \(\max(0, x-1)\)과 \(\min(1, x)\)입니다. 비교는 \(x - 1 \le 0 \iff x \le 1\)과 \(x \le 1\) 자체로 갈립니다: \(x \le 1\)이면 \(\max(0, x-1) = 0\)이고 \(\min(1, x) = x\) (단 \(x \ge 0\)일 때)이며, \(x \ge 1\)이면 \(\max(0, x-1) = x-1\)이고 \(\min(1, x) = 1\)입니다. 이 비교가 아래 경우 나누기를 정당화합니다.`,
          en: String.raw`The endpoints of the intersection are \(\max(0, x-1)\) and \(\min(1, x)\). The comparisons split at \(x - 1 \le 0 \iff x \le 1\) and at \(x \le 1\) itself: if \(x \le 1\) then \(\max(0, x-1) = 0\) and \(\min(1, x) = x\) (for \(x \ge 0\)), while if \(x \ge 1\) then \(\max(0, x-1) = x-1\) and \(\min(1, x) = 1\). These comparisons justify the case split below.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 1, \(x < 0\) 또는 \(x > 2\): \(x < 0\)이면 \(\min(1, x) = x < 0 \le \max(0, x-1)\)이라 교집합이 비어 있고, \(x > 2\)이면 \(\max(0, x-1) = x - 1 > 1 \ge \min(1, x)\)라 역시 비어 있습니다. 두 경우 모두 \((f * g)(x) = 0\)입니다. 경우 2, \(0 \le x \le 1\): 교집합은 \([0, x]\)이고 길이는 \(x\)입니다.`,
          en: String.raw`Case 1, \(x < 0\) or \(x > 2\): if \(x < 0\) then \(\min(1, x) = x < 0 \le \max(0, x-1)\), so the intersection is empty; if \(x > 2\) then \(\max(0, x-1) = x - 1 > 1 \ge \min(1, x)\), again empty. In both cases \((f * g)(x) = 0\). Case 2, \(0 \le x \le 1\): the intersection is \([0, x]\), of length \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`경우 3, \(1 \le x \le 2\): 교집합은 \([x-1, 1]\)이고 길이는 \(1 - (x - 1) = 2 - x\)입니다. 정리하면 \((f * g)(x)\)는 \(0\) (밖), \(x\) (\([0,1]\)), \(2 - x\) (\([1,2]\))인 텐트 함수이며, \(x = 1\)에서 꼭짓점 값 \(1\)을 갖습니다 -- 씬에 그려진 흔적과 정확히 같습니다.`,
          en: String.raw`Case 3, \(1 \le x \le 2\): the intersection is \([x-1, 1]\), of length \(1 - (x - 1) = 2 - x\). In summary \((f * g)(x)\) is the tent function \(0\) (outside), \(x\) (on \([0,1]\)), \(2 - x\) (on \([1,2]\)), with peak value \(1\) at \(x = 1\) -- exactly the trace drawn in the scene.`,
        },
      },
    ],
  },
  {
    id: 'approximate-identity',
    statement: {
      ko: String.raw`\(\varphi \ge 0\), \(\operatorname{supp} \varphi \subseteq [-1,1]\), \(\int \varphi = 1\)이고 \(\varphi_{\varepsilon}(t) = \frac{1}{\varepsilon} \varphi(t/\varepsilon)\)라 하세요. 유계 함수 \(f\) (\(\|f\|_{\infty} = M\))가 \(x_0\)에서 연속이면, \(\varepsilon \to 0^+\)일 때 \((f * \varphi_{\varepsilon})(x_0) \to f(x_0)\)임을 증명하세요.

씬의 텐트 핵 \(\varphi(t) = \max(0, 1 - |t|)\)이 가정을 만족함을 확인하는 것부터 시작하세요.`,
      en: String.raw`Let \(\varphi \ge 0\), \(\operatorname{supp} \varphi \subseteq [-1,1]\), \(\int \varphi = 1\), and \(\varphi_{\varepsilon}(t) = \frac{1}{\varepsilon} \varphi(t/\varepsilon)\). If \(f\) is bounded (\(\|f\|_{\infty} = M\)) and continuous at \(x_0\), prove \((f * \varphi_{\varepsilon})(x_0) \to f(x_0)\) as \(\varepsilon \to 0^+\).

Start by checking that the scene's tent kernel \(\varphi(t) = \max(0, 1 - |t|)\) meets the hypotheses.`,
    },
    display: [
      String.raw`\varphi_{\varepsilon}(t) = \frac{1}{\varepsilon} \varphi(t/\varepsilon), \qquad \int_{-\infty}^{\infty} \varphi_{\varepsilon} = 1, \qquad \operatorname{supp} \varphi_{\varepsilon} \subseteq [-\varepsilon, \varepsilon]`,
      String.raw`(f * \varphi_{\varepsilon})(x_0) - f(x_0) = \int_{-\infty}^{\infty} [f(x_0 - t) - f(x_0)]\, \varphi_{\varepsilon}(t)\, dt`,
    ],
    preset: { mode: 'smooth', x: 0.05, eps: 0.1 },
    presetCaption: {
      ko: String.raw`부드럽게 모드, \(x = 0.05\), \(\varepsilon = 0.1\): \(v = x/\varepsilon = 0.5\)라 \((f * \varphi_{\varepsilon})(0.05) = 1 - (1 - 0.5)^2/2 = 0.875\)입니다 -- \(\varepsilon \to 0\)이면 \(f(0.05) = 1\)로 다가갑니다.`,
      en: String.raw`Smooth mode, \(x = 0.05\), \(\varepsilon = 0.1\): \(v = x/\varepsilon = 0.5\), so \((f * \varphi_{\varepsilon})(0.05) = 1 - (1 - 0.5)^2/2 = 0.875\) -- approaching \(f(0.05) = 1\) as \(\varepsilon \to 0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`텐트 핵 확인: \(\varphi(t) = \max(0, 1 - |t|)\)는 음이 아니고, \([-1,1]\) 밖에서는 \(0\)이며, \(\int \varphi\)는 밑변 \(2\), 높이 \(1\)인 삼각형의 넓이 \(= \frac{1}{2} \cdot 2 \cdot 1 = 1\)입니다. 따라서 텐트 핵은 가정 \(\varphi \ge 0\), \(\operatorname{supp} \varphi \subseteq [-1,1]\), \(\int \varphi = 1\)을 모두 만족합니다.`,
          en: String.raw`Checking the tent kernel: \(\varphi(t) = \max(0, 1 - |t|)\) is nonnegative, vanishes outside \([-1,1]\), and \(\int \varphi\) is the area of a triangle of base \(2\) and height \(1\), namely \(\frac{1}{2} \cdot 2 \cdot 1 = 1\). So the tent kernel satisfies \(\varphi \ge 0\), \(\operatorname{supp} \varphi \subseteq [-1,1]\), and \(\int \varphi = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`스케일 불변성: \(\int \varphi_{\varepsilon} = 1\)입니다. 치환 \(s = t/\varepsilon\) (\(dt = \varepsilon\, ds\))를 쓰면 \(\int \frac{1}{\varepsilon} \varphi(t/\varepsilon)\, dt = \int \varphi(s)\, ds = 1\)입니다. 같은 치환으로 \(\operatorname{supp} \varphi_{\varepsilon} \subseteq [-\varepsilon, \varepsilon]\)도 얻습니다: \(\varphi_{\varepsilon}(t) \ne 0\)이려면 \(|t/\varepsilon| \le 1\), 즉 \(|t| \le \varepsilon\)이어야 합니다. 또 \(|f| \le M\)이고 \(\varphi_{\varepsilon} \in L^1\)이라 합성곱은 잘 정의됩니다.`,
          en: String.raw`Scaling keeps the mass: \(\int \varphi_{\varepsilon} = 1\). With the substitution \(s = t/\varepsilon\) (\(dt = \varepsilon\, ds\)), \(\int \frac{1}{\varepsilon} \varphi(t/\varepsilon)\, dt = \int \varphi(s)\, ds = 1\). The same substitution gives \(\operatorname{supp} \varphi_{\varepsilon} \subseteq [-\varepsilon, \varepsilon]\): \(\varphi_{\varepsilon}(t) \ne 0\) requires \(|t/\varepsilon| \le 1\), i.e. \(|t| \le \varepsilon\). Also \(|f| \le M\) with \(\varphi_{\varepsilon} \in L^1\) makes the convolution well defined.`,
        },
      },
      {
        text: {
          ko: String.raw`오차 항등식: \(f(x_0) = \int f(x_0)\, \varphi_{\varepsilon}(t)\, dt\) (질량이 \(1\)이라 \(f(x_0) \cdot 1\))이므로, 빼면 \((f * \varphi_{\varepsilon})(x_0) - f(x_0) = \int [f(x_0 - t) - f(x_0)]\, \varphi_{\varepsilon}(t)\, dt\)입니다. 절댓값을 안으로 넣고 \(\varphi_{\varepsilon} \ge 0\)을 쓰면 \(|(f * \varphi_{\varepsilon})(x_0) - f(x_0)| \le \int |f(x_0 - t) - f(x_0)|\, \varphi_{\varepsilon}(t)\, dt\)입니다.`,
          en: String.raw`The error identity: since \(f(x_0) = \int f(x_0)\, \varphi_{\varepsilon}(t)\, dt\) (the mass is \(1\), so this is \(f(x_0) \cdot 1\)), subtracting gives \((f * \varphi_{\varepsilon})(x_0) - f(x_0) = \int [f(x_0 - t) - f(x_0)]\, \varphi_{\varepsilon}(t)\, dt\). Moving the absolute value inside and using \(\varphi_{\varepsilon} \ge 0\) gives \(|(f * \varphi_{\varepsilon})(x_0) - f(x_0)| \le \int |f(x_0 - t) - f(x_0)|\, \varphi_{\varepsilon}(t)\, dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\eta > 0\)이 주어졌다고 하세요. \(f\)가 \(x_0\)에서 연속이므로, \(|t| < \delta\)일 때 \(|f(x_0 - t) - f(x_0)| < \eta/2\)인 \(\delta > 0\)이 있습니다. 이제 \(\varepsilon < \delta\)인 모든 \(\varepsilon\)를 잡으세요.`,
          en: String.raw`Let \(\eta > 0\) be given. By continuity of \(f\) at \(x_0\) there is \(\delta > 0\) with \(|f(x_0 - t) - f(x_0)| < \eta/2\) whenever \(|t| < \delta\). Now take any \(\varepsilon < \delta\).`,
        },
      },
      {
        text: {
          ko: String.raw`마무리: \(\operatorname{supp} \varphi_{\varepsilon} \subseteq [-\varepsilon, \varepsilon] \subseteq [-\delta, \delta]\)이므로 오차 적분 전체가 \(|t| < \delta\) 구간에서만 살아 있고, 거기서는 인자 \(|f(x_0 - t) - f(x_0)|\)가 \(\eta/2\)보다 작습니다. 따라서 오차는 \((\eta/2) \int \varphi_{\varepsilon} = \eta/2 < \eta\) 이하입니다. \(\eta\)는 임의였으므로 \((f * \varphi_{\varepsilon})(x_0) \to f(x_0)\) (\(\varepsilon \to 0^+\))입니다. 일반적인 근사 항등원과 달리 꼬리 항이 없는 이유는 지지집합이 \([-\varepsilon, \varepsilon]\)로 줄어들기 때문입니다.`,
          en: String.raw`Finish: since \(\operatorname{supp} \varphi_{\varepsilon} \subseteq [-\varepsilon, \varepsilon] \subseteq [-\delta, \delta]\), the whole error integral lives on \(|t| < \delta\), where the factor \(|f(x_0 - t) - f(x_0)|\) is below \(\eta/2\). Hence the error is at most \((\eta/2) \int \varphi_{\varepsilon} = \eta/2 < \eta\). As \(\eta\) was arbitrary, \((f * \varphi_{\varepsilon})(x_0) \to f(x_0)\) as \(\varepsilon \to 0^+\). Unlike a general approximate identity there is no tail term, because the support shrinks to \([-\varepsilon, \varepsilon]\).`,
        },
      },
    ],
  },
];
