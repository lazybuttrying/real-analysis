import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Minkowski scene
 * (integral version ||f+g||_p <= ||f||_p + ||g||_p on [0,1],
 * f(t) = t^a, g(t) = (1-t)^b).
 *
 * Every number below was verified against the model
 * (tests/minkowski.test.ts): at (p, a, b) = (2, 1, 1),
 * ||f||_2 = ||g||_2 = 1/sqrt(3) ≈ 0.5773502692 and ||f+g||_2 = 1
 * (since f + g is identically 1); at (2, 0, 0) all norms are 1
 * and ||f+g||_2 = 2 (equality case); at (1/2, 1, 1),
 * ||f||_{1/2} = ||g||_{1/2} = 4/9 and ||f+g||_{1/2} = 1,
 * so the inequality reverses.
 */
export const minkowskiProblems: readonly ProblemMeta[] = [
  {
    id: 'minkowski-holder-proof',
    statement: {
      ko: String.raw`횔더 부등식으로부터 민코프스키 부등식을 유도하는 표준 증명을, 이 씬의 구체적인 함수 \(f(t) = t\), \(g(t) = 1-t\) (\(a = b = 1\))와 \(p = 2\)에 적용하여 완전히 증명하세요.

증명의 각 단계(횔더 적용, \((p-1)q = p\) 확인, 나누기)를 수치로도 검증하세요.`,
      en: String.raw`Apply the standard proof deriving Minkowski's inequality from Hölder's inequality to this scene's concrete functions \(f(t) = t\), \(g(t) = 1-t\) (\(a = b = 1\)) with \(p = 2\), proving it completely.

Verify each step of the proof (the Hölder application, \((p-1)q = p\), the division) numerically as well.`,
    },
    display: [
      String.raw`\|f+g\|_p^p = \int_0^1 (f+g)^p = \int_0^1 f(f+g)^{p-1} + \int_0^1 g(f+g)^{p-1}`,
      String.raw`\int_0^1 f(f+g)^{p-1} \le \|f\|_p\,\|(f+g)^{p-1}\|_q = \|f\|_p\,\|f+g\|_p^{p-1} \quad \big((p-1)q = p\big)`,
    ],
    preset: { p: 2, a: 1, b: 1 },
    presetCaption: {
      ko: String.raw`\(p = 2\), \(a = b = 1\): \(\|f\|_2 = \|g\|_2 = \frac{1}{\sqrt{3}} \approx 0.577350\), \(f+g \equiv 1\)이므로 \(\|f+g\|_2 = 1\). 횔더 단계: \(\int_0^1 f(f+g) = \frac12 \le \frac{1}{\sqrt{3}} \approx 0.577350\).`,
      en: String.raw`\(p = 2\), \(a = b = 1\): \(\|f\|_2 = \|g\|_2 = \frac{1}{\sqrt{3}} \approx 0.577350\), and \(f+g \equiv 1\) gives \(\|f+g\|_2 = 1\). The Hölder step: \(\int_0^1 f(f+g) = \frac12 \le \frac{1}{\sqrt{3}} \approx 0.577350\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(p = 2\)이므로 켤레지수 \(q = \frac{p}{p-1} = 2\)이고, \((p-1)q = 1 \cdot 2 = 2 = p\)가 성립합니다. 먼저 \(\|f+g\|_2^2 = \int_0^1 (f+g)^2\)를 두 항으로 쪼갭니다: \(\int_0^1 (f+g)^2 = \int_0^1 f(f+g) + \int_0^1 g(f+g)\).`,
          en: String.raw`With \(p = 2\) the conjugate exponent is \(q = \frac{p}{p-1} = 2\), and \((p-1)q = 1 \cdot 2 = 2 = p\). First split \(\|f+g\|_2^2 = \int_0^1 (f+g)^2\) into two terms: \(\int_0^1 (f+g)^2 = \int_0^1 f(f+g) + \int_0^1 g(f+g)\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 항에 횔더 부등식 \(\int |uv| \le \|u\|_p\|v\|_q\)를 \(u = f\), \(v = f+g\)로 적용합니다: \(\int_0^1 f(f+g) \le \|f\|_2\,\|f+g\|_2\).

여기서 절댓값 없는 형태가 정당합니다: 이 씬에서는 \(f(t) = t \ge 0\)이고 \(f+g \equiv 1 \ge 0\)이므로 \(|f| = f\), \(|f+g| = f+g\)이고 \(\int f(f+g) = \int |f(f+g)|\)입니다.

수치로 확인하면, \(\int_0^1 f(f+g) = \int_0^1 t \cdot 1\,dt = \frac12 = 0.5\)이고 \(\|f\|_2\,\|f+g\|_2 = \frac{1}{\sqrt{3}} \cdot 1 \approx 0.5773502692\)이므로 \(0.5 \le 0.5773502692\)가 성립합니다. \(g\) 항도 대칭성에 의해 똑같습니다 (\(\int_0^1 g(f+g) = \int_0^1 (1-t)\,dt = \frac12\)).`,
          en: String.raw`Apply Hölder's inequality \(\int |uv| \le \|u\|_p\|v\|_q\) to each term with \(u = f\), \(v = f+g\): \(\int_0^1 f(f+g) \le \|f\|_2\,\|f+g\|_2\).

The form without absolute values is valid here because in this scene \(f(t) = t \ge 0\) and \(f+g \equiv 1 \ge 0\), so \(|f| = f\), \(|f+g| = f+g\) and \(\int f(f+g) = \int |f(f+g)|\).

Numerically, \(\int_0^1 f(f+g) = \int_0^1 t \cdot 1\,dt = \frac12 = 0.5\) while \(\|f\|_2\,\|f+g\|_2 = \frac{1}{\sqrt{3}} \cdot 1 \approx 0.5773502692\), so \(0.5 \le 0.5773502692\). The \(g\) term is identical by symmetry (\(\int_0^1 g(f+g) = \int_0^1 (1-t)\,dt = \frac12\)).`,
        },
        display: [
          String.raw`\frac12 + \frac12 = 1 = \|f+g\|_2^2 \le \big(\|f\|_2 + \|g\|_2\big)\,\|f+g\|_2 = \frac{2}{\sqrt{3}} \approx 1.1547005384`,
        ],
      },
      {
        text: {
          ko: String.raw`두 항을 더하면 \(\|f+g\|_2^2 \le \big(\|f\|_2 + \|g\|_2\big)\,\|f+g\|_2^{2-1}\)을 얻습니다. 여기서 \(\|f+g\|_2 = 1 \ne 0\)이므로 양변을 \(\|f+g\|_2\)로 나누면 \(\|f+g\|_2 \le \|f\|_2 + \|g\|_2\) — 즉 \(1 \le \frac{2}{\sqrt{3}} \approx 1.1547005384\)가 됩니다.

틈새는 \(\frac{2}{\sqrt{3}} - 1 \approx 0.1547005384\)로, 씬의 수치와 일치합니다.

(일반적인 \(p\)에서는 같은 논증이 \((p-1)q = p\)를 이용해 \(\|f+g\|_p^p \le \big(\|f\|_p + \|g\|_p\big)\,\|f+g\|_p^{p-1}\)을 주고, \(\|f+g\|_p^{p-1}\)로 나누어 민코프스키 부등식을 얻습니다.)`,
          en: String.raw`Adding the two terms gives \(\|f+g\|_2^2 \le \big(\|f\|_2 + \|g\|_2\big)\,\|f+g\|_2^{2-1}\). Since \(\|f+g\|_2 = 1 \ne 0\), dividing by \(\|f+g\|_2\) yields \(\|f+g\|_2 \le \|f\|_2 + \|g\|_2\) — i.e. \(1 \le \frac{2}{\sqrt{3}} \approx 1.1547005384\).

The gap is \(\frac{2}{\sqrt{3}} - 1 \approx 0.1547005384\), matching the scene's number.

(For general \(p\) the same argument uses \((p-1)q = p\) to get \(\|f+g\|_p^p \le \big(\|f\|_p + \|g\|_p\big)\,\|f+g\|_p^{p-1}\), then divides by \(\|f+g\|_p^{p-1}\) for Minkowski's inequality.)`,
        },
      },
    ],
  },
  {
    id: 'minkowski-equality',
    statement: {
      ko: String.raw`\(g = c\,f\) (\(c \ge 0\)인 상수)일 때 민코프스키 부등식에서 등호가 성립함을, 노름의 동차성 \(\|cf\|_p = c\|f\|_p\)부터 완전히 증명하세요.

이 씬에서는 \(a = b = 0\) (\(f = g \equiv 1\), 즉 \(c = 1\))인 경우가 해당하며, 틈새가 0임을 수치로 확인하세요.`,
      en: String.raw`Prove completely, starting from homogeneity \(\|cf\|_p = c\|f\|_p\), that Minkowski's inequality is an equality when \(g = c\,f\) for a constant \(c \ge 0\).

In this scene that is the case \(a = b = 0\) (\(f = g \equiv 1\), i.e. \(c = 1\)); confirm numerically that the gap is 0.`,
    },
    display: [
      String.raw`g = cf\ (c \ge 0) \;\Rightarrow\; \|f+g\|_p = (1+c)\|f\|_p = \|f\|_p + \|g\|_p`,
      String.raw`a = b = 0:\quad \|f\|_p = \|g\|_p = 1,\quad \|f+g\|_p = 2`,
    ],
    preset: { p: 2, a: 0, b: 0 },
    presetCaption: {
      ko: String.raw`\(p = 2\), \(a = b = 0\): \(f = g \equiv 1\)이므로 \(g = 1 \cdot f\) — 비례 관계. \(\|f\|_2 = \|g\|_2 = 1\), \(\|f+g\|_2 = 2\), 틈새 \(= 0\).`,
      en: String.raw`\(p = 2\), \(a = b = 0\): \(f = g \equiv 1\), so \(g = 1 \cdot f\) — proportional. \(\|f\|_2 = \|g\|_2 = 1\), \(\|f+g\|_2 = 2\), gap \(= 0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 동차성을 증명합니다. \(c \ge 0\)에 대해 \(\|cf\|_p^p = \int_0^1 |cf|^p = \int_0^1 c^p |f|^p = c^p \|f\|_p^p\)이므로, \(p\)제곱근을 취하면 \(\|cf\|_p = c\|f\|_p\)입니다.`,
          en: String.raw`First prove homogeneity. For \(c \ge 0\), \(\|cf\|_p^p = \int_0^1 |cf|^p = \int_0^1 c^p |f|^p = c^p \|f\|_p^p\), so taking \(p\)-th roots gives \(\|cf\|_p = c\|f\|_p\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(g = cf\) (\(c \ge 0\))이면 \(f + g = (1+c)f\)이므로, 동차성에 의해 \(\|f+g\|_p = \|(1+c)f\|_p = (1+c)\|f\|_p = \|f\|_p + c\|f\|_p = \|f\|_p + \|cf\|_p = \|f\|_p + \|g\|_p\) — 등호가 성립합니다.`,
          en: String.raw`If \(g = cf\) with \(c \ge 0\), then \(f + g = (1+c)f\), so by homogeneity \(\|f+g\|_p = \|(1+c)f\|_p = (1+c)\|f\|_p = \|f\|_p + c\|f\|_p = \|f\|_p + \|cf\|_p = \|f\|_p + \|g\|_p\) — equality holds.`,
        },
      },
      {
        text: {
          ko: String.raw`씬의 경우: \(a = b = 0\)이면 \(f(t) = t^0 \equiv 1\), \(g(t) = (1-t)^0 \equiv 1\)이므로 \(g = 1 \cdot f\)입니다.

따라서 \(\|f\|_2 = \left(\int_0^1 1\,dt\right)^{1/2} = 1\), \(\|g\|_2 = 1\), \(\|f+g\|_2 = \|2\|_2 = 2\)이고, 우변 \(\|f\|_2 + \|g\|_2 = 2\)와 같아 틈새가 정확히 0입니다.

(참고: 여기서 등호는 \(g = cf\) (\(c \ge 0\), 같은 방향)라서 성립합니다 — \(p = 1\)에서 일반적으로 성립하는 것은 아닙니다: 부호가 바뀌는 경우, 예컨대 \(g = -f\)이면 \(\|f+g\|_1 = 0 < \|f\|_1 + \|g\|_1\)입니다. 더 깊은 등호 조건은 민코프스키 유도에 쓰인 횔더 쌍 \((f, |f+g|^{p-1})\)와 \((g, |f+g|^{p-1})\)에서 옵니다: 등호는 \(|f|^p\)가 \(|f+g|^p\)에 비례하고 \(|g|^p\)도 \(|f+g|^p\)에 비례할 때, 즉 \(|f|\)와 \(|g|\)가 모두 \(|f+g|\)에 비례할 때 성립하며, 이 비례 경우가 이에 포함됩니다.)`,
          en: String.raw`For the scene: \(a = b = 0\) gives \(f(t) = t^0 \equiv 1\) and \(g(t) = (1-t)^0 \equiv 1\), so \(g = 1 \cdot f\).

Hence \(\|f\|_2 = \left(\int_0^1 1\,dt\right)^{1/2} = 1\), \(\|g\|_2 = 1\), \(\|f+g\|_2 = \|2\|_2 = 2\), matching the right side \(\|f\|_2 + \|g\|_2 = 2\) — the gap is exactly 0.

(Note: equality here holds because \(g = cf\) with \(c \ge 0\) (same direction), not by a general \(p = 1\) linearity claim: for sign-changing functions, e.g. \(g = -f\), \(\|f+g\|_1 = 0 < \|f\|_1 + \|g\|_1\). The deeper equality condition comes from the Hölder pairs actually used in deriving Minkowski, \((f, |f+g|^{p-1})\) and \((g, |f+g|^{p-1})\): equality requires \(|f|^p\) proportional to \(|f+g|^p\) and \(|g|^p\) proportional to \(|f+g|^p\), i.e. \(|f|\) and \(|g|\) both proportional to \(|f+g|\), which includes this proportional case.)`,
        },
      },
    ],
  },
  {
    id: 'minkowski-below-one',
    statement: {
      ko: String.raw`\(0 < p < 1\)에서는 민코프스키 부등식이 성립하지 않음을 보이세요.

먼저 \(f, g \ge 0\)일 때 부등식이 뒤집혀 \(\|f+g\|_p \ge \|f\|_p + \|g\|_p\)가 됨을 증명한 뒤, 구체적인 반례 \(p = \frac12\), \(f(t) = t\), \(g(t) = 1-t\)를 직접 계산하여 \(\|f+g\|_{1/2} = 1 > \frac89 = \|f\|_{1/2} + \|g\|_{1/2}\)임을 수치까지 검증하세요.`,
      en: String.raw`Show that Minkowski's inequality fails for \(0 < p < 1\).

First prove that for \(f, g \ge 0\) the inequality reverses to \(\|f+g\|_p \ge \|f\|_p + \|g\|_p\), then compute the concrete counterexample \(p = \frac12\), \(f(t) = t\), \(g(t) = 1-t\) directly and verify numerically that \(\|f+g\|_{1/2} = 1 > \frac89 = \|f\|_{1/2} + \|g\|_{1/2}\).`,
    },
    display: [
      String.raw`0 < p < 1:\quad (f+g)^p \ge f^p + g^p \;\Rightarrow\; \|f+g\|_p \ge \|f\|_p + \|g\|_p`,
      String.raw`p = \tfrac12:\quad \|f\|_{1/2} = \|g\|_{1/2} = \tfrac49,\quad \|f+g\|_{1/2} = 1 > \tfrac89`,
    ],
    preset: { p: 2, a: 1, b: 1 },
    presetCaption: {
      ko: String.raw`이 문제는 씬의 슬라이더 범위(\(1 \le p \le 4\)) 밖에 있는 \(p = \frac12\)에서의 별도 계산에 대한 것입니다 — 프리셋은 씬 기본값 \(p = 2\), \(a = b = 1\).`,
      en: String.raw`This problem is about a separate computation at \(p = \frac12\), outside the scene's slider range (\(1 \le p \le 4\)) — the preset is the scene default \(p = 2\), \(a = b = 1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(0 < p < 1\)이고 \(f, g \ge 0\)이라 하세요. 각 점에서 \((f+g)^p \ge f^p + g^p\)임을 정규화로 증명합니다: \(f+g = 0\)인 점은 자명하므로 \(f+g > 0\)인 점에서 \((f+g)^p\)로 나누고 \(t = \frac{f}{f+g} \in [0,1]\)이라 두면, \(0 < p < 1\)일 때 \(t^p \ge t\)이고 \((1-t)^p \ge 1-t\)이므로 \(\frac{f^p + g^p}{(f+g)^p} = t^p + (1-t)^p \ge t + (1-t) = 1\)입니다. 따라서 \((f+g)^p \ge f^p + g^p\)이고, 적분하면 \(\|f+g\|_p^p \ge \|f\|_p^p + \|g\|_p^p\)입니다. 이제 \(r = \frac1p > 1\)이라 두면 \(A, B \ge 0\)에 대해 \((A+B)^r \ge A^r + B^r\)이므로 (예: \(t \ge 0\)에서 \((1+t)^r \ge 1 + t^r\)), \(\|f+g\|_p \ge \big(\|f\|_p^p + \|g\|_p^p\big)^{1/p} \ge \|f\|_p + \|g\|_p\) — 부등식이 뒤집힙니다.`,
          en: String.raw`Let \(0 < p < 1\) and \(f, g \ge 0\). Prove \((f+g)^p \ge f^p + g^p\) pointwise by normalization: at points with \(f+g = 0\) it is trivial, and at points with \(f+g > 0\) divide by \((f+g)^p\) and set \(t = \frac{f}{f+g} \in [0,1]\); since \(0 < p < 1\), \(t^p \ge t\) and \((1-t)^p \ge 1-t\), so \(\frac{f^p + g^p}{(f+g)^p} = t^p + (1-t)^p \ge t + (1-t) = 1\).

Hence \((f+g)^p \ge f^p + g^p\), and integrating gives \(\|f+g\|_p^p \ge \|f\|_p^p + \|g\|_p^p\).

With \(r = \frac1p > 1\) we have \((A+B)^r \ge A^r + B^r\) for \(A, B \ge 0\) (e.g. \((1+t)^r \ge 1 + t^r\) for \(t \ge 0\)), hence \(\|f+g\|_p \ge \big(\|f\|_p^p + \|g\|_p^p\big)^{1/p} \ge \|f\|_p + \|g\|_p\) — the inequality reverses.`,
        },
      },
      {
        text: {
          ko: String.raw`구체적으로 \(p = \frac12\), \(f(t) = t\), \(g(t) = 1-t\)로 계산합니다. \(\int_0^1 \sqrt{t}\,dt = \frac23\)이므로 \(\|f\|_{1/2} = \left(\frac23\right)^2 = \frac49 \approx 0.444444\)이고, 대칭성에 의해 \(\|g\|_{1/2} = \frac49\)도 같습니다.

따라서 우변은 \(\frac49 + \frac49 = \frac89 \approx 0.888889\)입니다. 반면 \(f + g \equiv 1\)이므로 \(\|f+g\|_{1/2} = \left(\int_0^1 1\,dt\right)^2 = 1\)입니다.

즉 \(1 > \frac89\) — 민코프스키 부등식이 깨지고, 틈새는 \(-\frac19 \approx -0.111111\)로 음수가 됩니다 (수치적분으로도 확인됨).`,
          en: String.raw`Concretely, take \(p = \frac12\), \(f(t) = t\), \(g(t) = 1-t\). Since \(\int_0^1 \sqrt{t}\,dt = \frac23\), we get \(\|f\|_{1/2} = \left(\frac23\right)^2 = \frac49 \approx 0.444444\), and by symmetry \(\|g\|_{1/2} = \frac49\).

So the right side is \(\frac49 + \frac49 = \frac89 \approx 0.888889\). But \(f + g \equiv 1\), so \(\|f+g\|_{1/2} = \left(\int_0^1 1\,dt\right)^2 = 1\).

Hence \(1 > \frac89\) — Minkowski's inequality breaks, and the gap is \(-\frac19 \approx -0.111111\), negative (also confirmed by numerical integration).`,
        },
      },
      {
        text: {
          ko: String.raw`표준 증명이 무너지는 지점도 명확합니다: 횔더 부등식은 켤레지수 \(q = \frac{p}{p-1} > 1\)을 필요로 하는데, \(p < 1\)에서는 \(q < 0\)이 되어 횔더 단계 자체가 성립하지 않습니다. 그래서 민코프스키 부등식은 \(p \ge 1\)이라는 조건이 필수적입니다.`,
          en: String.raw`The exact failure point of the standard proof is also clear: Hölder's inequality needs the conjugate exponent \(q = \frac{p}{p-1} > 1\), but for \(p < 1\) we get \(q < 0\), so the Hölder step itself is unavailable. That is why Minkowski's inequality essentially requires \(p \ge 1\).`,
        },
      },
    ],
  },
];
