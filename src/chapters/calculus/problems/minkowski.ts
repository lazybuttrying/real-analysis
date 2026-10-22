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
 * and ||f+g||_2 = 2 (equality case). The third problem
 * (Riesz-Fischer completeness of L^p) has no scene numbers of
 * its own; it reuses the default preset (p, a, b) = (2, 1, 1).
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
    id: 'riesz-fischer',
    statement: {
      ko: String.raw`\(1 \le p < \infty\)일 때 \(L^p[a,b]\)가 완전함을 증명하세요: \(L^p[a,b]\) 안의 모든 코시수열은 \(L^p[a,b]\) 안에서 수렴합니다 (리스–피셔 정리). 절대수렴 급수를 이용한 완전한 증명을 쓰세요.`,
      en: String.raw`Prove that \(L^p[a,b]\) is complete for \(1 \le p < \infty\): every Cauchy sequence in \(L^p[a,b]\) converges in \(L^p[a,b]\) (the Riesz–Fischer theorem). Give the full proof via absolutely convergent series.`,
    },
    display: [
      String.raw`(h_k) \text{ Cauchy in } L^p[a,b] \Rightarrow \exists\, h \in L^p[a,b]:\ \|h_k - h\|_p \to 0 \quad (1 \le p < \infty)`,
      String.raw`\sum_{n=1}^{\infty} \|f_n\|_p < \infty \ \Rightarrow\ \sum_{n=1}^{\infty} f_n \text{ converges in } L^p[a,b]`,
    ],
    preset: { p: 2, a: 1, b: 1 },
    presetCaption: {
      ko: String.raw`완전성은 모든 \(L^p\) (\(1 \le p < \infty\))에 대한 정리입니다 — 프리셋은 씬 기본값 \(p = 2\), \(a = b = 1\)이며, 증명의 엔진인 민코프스키 노름 \(\|f+g\|_p \le \|f\|_p + \|g\|_p\)의 그림입니다.`,
      en: String.raw`Completeness is a theorem about every \(L^p\) (\(1 \le p < \infty\)) — the preset is the scene default \(p = 2\), \(a = b = 1\), picturing the Minkowski norm \(\|f+g\|_p \le \|f\|_p + \|g\|_p\) that drives the proof.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`1단계 (축소): \(\sum_n \|f_n\|_p < \infty\)이면 \(\sum_n f_n\)이 \(L^p\)에서 수렴함을 보이는 것으로 충분하다. 그 이유는 이렇다: 극한 \(h\)로 수렴하는 부분수열을 가진 코시수열은 \(h\) 자체로 수렴하며 (4단계 끝의 \(\varepsilon/2\) 추정으로 보인다), 4단계에서는 임의의 코시수열에서 정확히 \(\sum_k \|d_k\|_p < \infty\)를 만족하는 차이들 \(d_k\)의 합으로 이루어진 부분수열을 만든다. 따라서 2–3단계에서 이 급수 주장을 증명하고, 4단계에서 이를 적용한다.`,
          en: String.raw`Step 1 (reduction): it suffices to show that if \(\sum_n \|f_n\|_p < \infty\) then \(\sum_n f_n\) converges in \(L^p\). The reason: a Cauchy sequence with a subsequence converging to \(h\) converges to \(h\) itself (shown by the \(\varepsilon/2\) estimate at the end of Step 4), and Step 4 builds a subsequence of an arbitrary Cauchy sequence exactly as a sum of differences \(d_k\) with \(\sum_k \|d_k\|_p < \infty\). So Steps 2–3 prove the series claim, and Step 4 applies it.`,
        },
      },
      {
        text: {
          ko: String.raw`2단계: \(M = \sum_n \|f_n\|_p < \infty\)라 두고, \(S_N = \sum_{n \le N} |f_n|\), \(F_N = \sum_{n \le N} f_n\)이라 두자. \(S_N\)에 민코프스키 부등식 (이 씬의 1번 문제, 유한 귀납으로 적용)을 적용하면 \(\|S_N\|_p \le \sum_{n \le N} \|f_n\|_p \le M\)이다. \(S_N\)은 점별로 \(g := \sum_n |f_n| \in [0, \infty]\)로 증가하므로, 단조수렴정리에 의해 \(\int g^p = \lim_N \int S_N^p = \lim_N \|S_N\|_p^p \le M^p\)이다. 따라서 \(g \in L^p\)이고 \(g < \infty\)가 거의 모든 점에서 성립하므로, \(\sum_n f_n(x)\)는 거의 모든 \(x\)에서 절대수렴한다. 그 합을 \(f(x)\)라 부르자 (예외인 영집합 위에서는 \(f(x) = 0\)으로 둔다). 그러면 \(|f| \le g\)이므로 \(f \in L^p\)이다.`,
          en: String.raw`Step 2: let \(M = \sum_n \|f_n\|_p < \infty\), \(S_N = \sum_{n \le N} |f_n|\), and \(F_N = \sum_{n \le N} f_n\). Applying Minkowski's inequality (problem 1 of this scene, by finite induction) to \(S_N\) gives \(\|S_N\|_p \le \sum_{n \le N} \|f_n\|_p \le M\). The sequence \(S_N\) increases pointwise to \(g := \sum_n |f_n| \in [0, \infty]\), so by the monotone convergence theorem \(\int g^p = \lim_N \int S_N^p = \lim_N \|S_N\|_p^p \le M^p\). Hence \(g \in L^p\) and \(g < \infty\) almost everywhere, so \(\sum_n f_n(x)\) converges absolutely for almost every \(x\). Call its sum \(f(x)\) (and set \(f(x) = 0\) on the exceptional null set). Then \(|f| \le g\), so \(f \in L^p\).`,
        },
        display: [
          String.raw`\|S_N\|_p \le \sum_{n \le N} \|f_n\|_p \le M, \qquad \int g^p = \lim_N \|S_N\|_p^p \le M^p, \qquad |f| \le g`,
        ],
      },
      {
        text: {
          ko: String.raw`3단계 (꼬리 추정): 꼬리 급수 \(\sum_{n > N} |f_n|\)에 같은 논증을 적용한다: 그 점별 합 \(g_N := \sum_{n > N} |f_n|\)은, 유한 꼬리합에 민코프스키를 적용한 뒤 2단계처럼 단조수렴정리로 극한을 취하면, \(\|g_N\|_p \le \sum_{n > N} \|f_n\|_p\)를 만족한다. 거의 모든 점에서 \(|f - F_N| = \left|\sum_{n > N} f_n\right| \le g_N\)이므로, \(\|f - F_N\|_p \le \|g_N\|_p \le \sum_{n > N} \|f_n\|_p \to 0\) (\(N \to \infty\)) — 오른쪽은 수렴 급수 \(\sum_n \|f_n\|_p\)의 꼬리이기 때문이다. 따라서 \(\sum_n f_n \to f\)가 \(L^p\)에서 성립한다.`,
          en: String.raw`Step 3 (tail estimate): apply the same argument to the tail series \(\sum_{n > N} |f_n|\): its pointwise sum \(g_N := \sum_{n > N} |f_n|\) satisfies \(\|g_N\|_p \le \sum_{n > N} \|f_n\|_p\), by applying Minkowski to finite tail sums and passing to the limit with the monotone convergence theorem as in Step 2. Pointwise almost everywhere, \(|f - F_N| = \left|\sum_{n > N} f_n\right| \le g_N\). Therefore \(\|f - F_N\|_p \le \|g_N\|_p \le \sum_{n > N} \|f_n\|_p \to 0\) as \(N \to \infty\), since this is the tail of the convergent series \(\sum_n \|f_n\|_p\). Hence \(\sum_n f_n \to f\) in \(L^p\).`,
        },
      },
      {
        text: {
          ko: String.raw`4단계 (부분수열): \((h_k)\)가 \(L^p\)에서 코시수열이라 하자. 모든 \(k\)에 대해 \(\|h_{n_{k+1}} - h_{n_k}\|_p < 2^{-k}\)를 만족하는 첨수 \(n_1 < n_2 < \cdots\)를 고를 수 있다: \((h_k)\)가 코시수열이므로 귀납적으로 고르면 된다. \(d_k = h_{n_{k+1}} - h_{n_k}\)라 두면 \(\sum_k \|d_k\|_p < \sum_k 2^{-k} < \infty\)이고, 망원 항등식 \(h_{n_1} + \sum_{k=1}^{K} d_k = h_{n_{K+1}}\)가 성립한다. 따라서 첫째 항이 \(h_{n_1}\)이고 뒤에 \(d_k\)들이 이어지는 급수에 1–3단계를 적용하면, 어떤 \(h \in L^p\)에 대해 \(h_{n_k} \to h\)가 \(L^p\)에서 성립한다.`,
          en: String.raw`Step 4 (subsequence): let \((h_k)\) be Cauchy in \(L^p\). Choose indices \(n_1 < n_2 < \cdots\) with \(\|h_{n_{k+1}} - h_{n_k}\|_p < 2^{-k}\) for every \(k\): this is possible inductively because \((h_k)\) is Cauchy. Put \(d_k = h_{n_{k+1}} - h_{n_k}\). Then \(\sum_k \|d_k\|_p < \sum_k 2^{-k} < \infty\), and the telescoping identity \(h_{n_1} + \sum_{k=1}^{K} d_k = h_{n_{K+1}}\) holds. So Steps 1–3, applied to the series with first term \(h_{n_1}\) followed by the \(d_k\), give \(h_{n_k} \to h\) in \(L^p\) for some \(h \in L^p\).`,
        },
        display: [
          String.raw`h_{n_1} + \sum_{k=1}^{K} d_k = h_{n_{K+1}}, \qquad \sum_{k=1}^{\infty} \|d_k\|_p < \sum_{k=1}^{\infty} 2^{-k} = 1 < \infty`,
        ],
      },
      {
        text: {
          ko: String.raw`4단계 (결론): 마지막으로 \(\varepsilon > 0\)이라 하자. \(N_0\)를 \(k, l \ge N_0\)이면 \(\|h_k - h_l\|_p < \varepsilon/2\)가 되도록 잡고 (코시 조건), \(j\)를 \(n_j \ge N_0\)이고 \(\|h_{n_j} - h\|_p < \varepsilon/2\)가 되도록 잡는다. 그러면 \(k \ge N_0\)인 모든 \(k\)에 대해 \(\|h_k - h\|_p \le \|h_k - h_{n_j}\|_p + \|h_{n_j} - h\|_p < \varepsilon/2 + \varepsilon/2 = \varepsilon\)이다. 따라서 \(h_k \to h\)가 \(L^p\)에서 성립한다. 그러므로 \(L^p[a,b]\)는 완전하다. ∎`,
          en: String.raw`Step 4 (conclusion): finally, let \(\varepsilon > 0\). Choose \(N_0\) so that \(k, l \ge N_0\) implies \(\|h_k - h_l\|_p < \varepsilon/2\) (the Cauchy condition), and choose \(j\) with \(n_j \ge N_0\) and \(\|h_{n_j} - h\|_p < \varepsilon/2\). Then for every \(k \ge N_0\), \(\|h_k - h\|_p \le \|h_k - h_{n_j}\|_p + \|h_{n_j} - h\|_p < \varepsilon/2 + \varepsilon/2 = \varepsilon\). Hence \(h_k \to h\) in \(L^p\). Therefore \(L^p[a,b]\) is complete. ∎`,
        },
      },
    ],
  }
];
