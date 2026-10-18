import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the absolute continuity scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/absolute-continuity.test.ts):
 *   func = 'square', scale = 4: delta = 0.2, totalLen = 0.2,
 *     varSum = 1 - (1 - 0.2)^2 = 1 - 0.64 = 0.36
 *   func = 'cantor', scale = 4: totalLen = (2/3)^4 = 16/81 ~= 0.1975, varSum = 1
 */
export const absoluteContinuityProblems: readonly ProblemMeta[] = [
  {
    id: 'integral-ac',
    statement: {
      ko: String.raw`\(f \in L^1[a, b]\)이고 \(F(x) = F(a) + \int_a^x f\)라 하자. \(F\)가 절대연속임을 증명하세요. 먼저 다음 보조정리를 증명하세요: 모든 \(\varepsilon > 0\)에 대해, \(m(E) < \delta\)이면 \(\int_E |f| < \varepsilon\)이 되는 \(\delta > 0\)이 존재합니다.`,
      en: String.raw`Let \(f \in L^1[a, b]\) and \(F(x) = F(a) + \int_a^x f\). Prove \(F\) is absolutely continuous. First prove the lemma: for every \(\varepsilon > 0\) there is \(\delta > 0\) such that \(m(E) < \delta\) implies \(\int_E |f| < \varepsilon\).`,
    },
    display: [
      String.raw`\int_E |f| \le \frac{\varepsilon}{2} + M \cdot m(E) < \varepsilon, \qquad \sum_{i} |F(b_i) - F(a_i)| \le \int_{\bigcup_i [a_i,b_i]} |f| < \varepsilon`,
    ],
    preset: { func: 'square', scale: 4 },
    presetCaption: {
      ko: String.raw`\(F(x) = x^2\), \(\delta = 0.2\): \(\sum |\Delta F| = 1 - (1 - 0.2)^2 = 0.36\) — 구간들의 총 길이 \(0.2\)가 작아지면 \(\sum |\Delta F|\)도 0으로 갑니다 (절대연속 ✓).`,
      en: String.raw`\(F(x) = x^2\), \(\delta = 0.2\): \(\sum |\Delta F| = 1 - (1 - 0.2)^2 = 0.36\) — as the intervals' total length \(0.2\) shrinks, so does \(\sum |\Delta F|\) (AC ✓).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`보조정리 (절대연속적분): \(|f|\)의 꼬리가 사라진다는 사실을 이용합니다. Lebesgue 씬에서 본 지배수렴정리에 의해 \(\int_{|f| > M} |f| < \frac{\varepsilon}{2}\)가 되는 \(M\)을 고를 수 있습니다.`,
          en: String.raw`Lemma (absolutely continuous integral): use that the tails of \(|f|\) vanish. By dominated convergence (from the Lebesgue scene), choose \(M\) with \(\int_{|f| > M} |f| < \frac{\varepsilon}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`임의의 가측집합 \(E\)에 대해 \(|f| = |f| \cdot \mathbf{1}_{\{|f| > M\}} + |f| \cdot \mathbf{1}_{\{|f| \le M\}}\)로 나누면 \(\int_E |f| \le \int_{|f| > M} |f| + M \cdot m(E) < \frac{\varepsilon}{2} + M \cdot m(E)\)가 됩니다. 따라서 \(m(E) < \delta := \frac{\varepsilon}{2M}\)이면 \(\int_E |f| < \varepsilon\)입니다.`,
          en: String.raw`For any measurable \(E\), splitting \(|f| = |f| \cdot \mathbf{1}_{\{|f| > M\}} + |f| \cdot \mathbf{1}_{\{|f| \le M\}}\) gives \(\int_E |f| \le \int_{|f| > M} |f| + M \cdot m(E) < \frac{\varepsilon}{2} + M \cdot m(E)\). So \(\int_E |f| < \varepsilon\) whenever \(m(E) < \delta := \frac{\varepsilon}{2M}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \([a_i, b_i]\)들이 서로 겹치지 않고 총 길이가 \(\delta\)보다 작다고 하자. 각 구간에 대해 \(|F(b_i) - F(a_i)| = \left|\int_{a_i}^{b_i} f\right| \le \int_{a_i}^{b_i} |f|\)이므로, 이들을 합하면 \(\sum_i |F(b_i) - F(a_i)| \le \sum_i \int_{a_i}^{b_i} |f| = \int_{\bigcup_i [a_i,b_i]} |f| < \varepsilon\) (보조정리를 \(E = \bigcup_i [a_i,b_i]\)에 적용) — 즉 \(F\)는 절대연속입니다.`,
          en: String.raw`Now let the disjoint \([a_i, b_i]\) have total length below \(\delta\). On each interval \(|F(b_i) - F(a_i)| = \left|\int_{a_i}^{b_i} f\right| \le \int_{a_i}^{b_i} |f|\), so summing gives \(\sum_i |F(b_i) - F(a_i)| \le \sum_i \int_{a_i}^{b_i} |f| = \int_{\bigcup_i [a_i,b_i]} |f| < \varepsilon\) (applying the lemma to \(E = \bigcup_i [a_i,b_i]\)) — i.e. \(F\) is absolutely continuous.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(F(x) = x^2\), \(\delta = 0.2\)): 구간들을 \([1 - \delta, 1]\)에 압축하면 \(\sum |\Delta F| = 1 - (1 - 0.2)^2 = 0.36\) — 캡션과 일치하며, \(\delta \to 0\)일 때 \(2\delta - \delta^2 \to 0\)이므로 "절대적" 조건이 성립합니다.`,
          en: String.raw`Numerical check (\(F(x) = x^2\), \(\delta = 0.2\)): packing the intervals at \([1 - \delta, 1]\) gives \(\sum |\Delta F| = 1 - (1 - 0.2)^2 = 0.36\) — matching the caption, and \(2\delta - \delta^2 \to 0\) as \(\delta \to 0\) verifies the "absolute" condition.`,
        },
      },
    ],
  },
  {
    id: 'cantor-not-ac',
    statement: {
      ko: String.raw`칸토어 함수 \(c\)가 절대연속이 아님을 증명하세요: \(n\)단계 칸토어 구간 \(2^n\)개는 총 길이 \(\left(\frac23\right)^n\)를 가지지만 \(\sum |\Delta c| = 1\)입니다.`,
      en: String.raw`Prove the Cantor function \(c\) is not absolutely continuous: the \(2^n\) stage-\(n\) Cantor intervals have total length \(\left(\frac23\right)^n\) but \(\sum |\Delta c| = 1\).`,
    },
    display: [
      String.raw`\text{total length} = 2^n \cdot 3^{-n} = \left(\tfrac23\right)^n \to 0, \qquad \sum |\Delta c| = 2^n \cdot 2^{-n} = 1 \not< \tfrac12`,
    ],
    preset: { func: 'cantor', scale: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\): \(2^4\)개의 구간, 총 길이 \(\left(\frac23\right)^4 = \frac{16}{81} \approx 0.1975 \to 0\)이지만 \(\sum |\Delta c| = 1\) — 항상 1이므로 절대연속 ✗.`,
      en: String.raw`\(n = 4\): \(2^4\) intervals, total length \(\left(\frac23\right)^4 = \frac{16}{81} \approx 0.1975 \to 0\), yet \(\sum |\Delta c| = 1\) — always 1, so not AC ✗.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`절대연속성을 부정합니다: \(\varepsilon = \frac12\)에 대해 어떤 \(\delta > 0\)도 조건을 만족하지 않음을 보이겠습니다. \(n\)단계의 칸토어 집합은 길이 \(3^{-n}\)인 닫힌 구간 \(2^n\)개로 이루어집니다 (각 단계마다 구간이 3등분되어 가운데가 제거됨).`,
          en: String.raw`Negate absolute continuity: we show that for \(\varepsilon = \frac12\), no \(\delta > 0\) can satisfy the condition. The stage-\(n\) Cantor set consists of \(2^n\) closed intervals of length \(3^{-n}\) (each interval is trisected and its middle removed).`,
        },
      },
      {
        text: {
          ko: String.raw`이들 구간들의 총 길이는 \(2^n \cdot 3^{-n} = \left(\frac23\right)^n \to 0\)이므로, 충분히 큰 \(n\)에 대해 총 길이 \(< \delta\)가 됩니다. 그런데 칸토어 함수 \(c\)는 각 \(n\)단계 구간에서 정확히 \(2^{-n}\)만큼 상승합니다 (이진 전개의 다음 자릿수가 결정됨).`,
          en: String.raw`Their total length is \(2^n \cdot 3^{-n} = \left(\frac23\right)^n \to 0\), so for large \(n\) the total length is below \(\delta\). But the Cantor function \(c\) rises by exactly \(2^{-n}\) on each stage-\(n\) interval (fixing the next binary digit of its base-2 expansion).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\sum |\Delta c| = 2^n \cdot 2^{-n} = 1 \not< \frac12 = \varepsilon\) — 총 길이가 임의로 작아져도 \(\sum |\Delta c|\)는 1에 고정됩니다. 이는 절대연속성 정의에 정면으로 위배되므로 \(c\)는 절대연속이 아닙니다. 한편 \(c\)는 균등연속이므로, 균등연속은 절대연속을 함의하지 않습니다.`,
          en: String.raw`Hence \(\sum |\Delta c| = 2^n \cdot 2^{-n} = 1 \not< \frac12 = \varepsilon\) — the sum stays frozen at 1 no matter how small the total length gets. This directly violates the definition of absolute continuity, so \(c\) is not absolutely continuous. Since \(c\) is uniformly continuous, uniform continuity does not imply absolute continuity.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(n = 4\)): 총 길이 \(\left(\frac23\right)^4 = \frac{16}{81} \approx 0.1975\), \(\sum |\Delta c| = 1\) — 캡션과 일치합니다. \(n = 10\)에서도 총 길이는 \(\approx 0.0173\)로 줄지만 \(\sum |\Delta c|\)는 여전히 1입니다.`,
          en: String.raw`Numerical check (\(n = 4\)): total length \(\left(\frac23\right)^4 = \frac{16}{81} \approx 0.1975\), \(\sum |\Delta c| = 1\) — matching the caption. Even at \(n = 10\) the total length shrinks to \(\approx 0.0173\) while \(\sum |\Delta c|\) stays 1.`,
        },
      },
    ],
  },
  {
    id: 'lipschitz-ac',
    statement: {
      ko: String.raw`Lipschitz 상수 \(L\)을 가진 함수 \(F:[a, b] \to \mathbb{R}\)가 절대연속임을 증명하세요 (\(\delta = \frac{\varepsilon}{L}\)을 쓰세요).`,
      en: String.raw`Prove that \(F:[a, b] \to \mathbb{R}\) with Lipschitz constant \(L\) is absolutely continuous (use \(\delta = \frac{\varepsilon}{L}\)).`,
    },
    display: [
      String.raw`\sum_i |F(b_i) - F(a_i)| \le L \sum_i (b_i - a_i) < L \cdot \frac{\varepsilon}{L} = \varepsilon`,
    ],
    preset: { func: 'square', scale: 4 },
    presetCaption: {
      ko: String.raw`\(F(x) = x^2\)는 \([0, 1]\)에서 \(L = 2\)인 Lipschitz 함수: \(\delta = 0.2\)일 때 \(\sum |\Delta F| = 0.36 < L\delta = 0.4\) — Lipschitz 조건 \(|F(b) - F(a)| \le L(b - a)\)가 절대연속성을 직접 줍니다.`,
      en: String.raw`\(F(x) = x^2\) is \(L = 2\)-Lipschitz on \([0, 1]\): at \(\delta = 0.2\), \(\sum |\Delta F| = 0.36 < L\delta = 0.4\) — the Lipschitz bound \(|F(b) - F(a)| \le L(b - a)\) directly yields absolute continuity.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)에 대해 \(\delta = \frac{\varepsilon}{L}\)로 둡니다 (\(L = 0\)인 경우 \(F\)는 상수함수이므로 자명). 총 길이가 \(\delta\)보다 작은 서로 겹치지 않는 구간 \([a_i, b_i]\)들을 취합니다.`,
          en: String.raw`Given \(\varepsilon > 0\), set \(\delta = \frac{\varepsilon}{L}\) (if \(L = 0\) then \(F\) is constant and there is nothing to prove). Take disjoint \([a_i, b_i]\) with total length below \(\delta\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 구간에서 \(|F(b_i) - F(a_i)| \le L(b_i - a_i)\)이므로, 합하면 \(\sum_i |F(b_i) - F(a_i)| \le L \sum_i (b_i - a_i) < L\delta = \varepsilon\) — 절대연속성 정의가 정확히 성립합니다.`,
          en: String.raw`On each interval \(|F(b_i) - F(a_i)| \le L(b_i - a_i)\), so summing gives \(\sum_i |F(b_i) - F(a_i)| \le L \sum_i (b_i - a_i) < L\delta = \varepsilon\) — exactly the definition of absolute continuity.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(F(x) = x^2\), \([0, 1]\)에서 \(L = 2\)): \(\delta = 0.2\)일 때 \(\sum |\Delta F| = 1 - (1 - 0.2)^2 = 0.36 < L\delta = 0.4\) — 캡션과 일치하며, Lipschitz 상수가 절대연속성의 \(\delta\)를 직접 제공합니다.`,
          en: String.raw`Numerical check (\(F(x) = x^2\), \(L = 2\) on \([0, 1]\)): at \(\delta = 0.2\), \(\sum |\Delta F| = 1 - (1 - 0.2)^2 = 0.36 < L\delta = 0.4\) — matching the caption; the Lipschitz constant directly supplies the \(\delta\) of absolute continuity.`,
        },
      },
    ],
  },
];
