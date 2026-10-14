import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'stage-three',
          statement: {
            ko: String.raw`3단계 \(C_3\)의 구간 개수와 전체 길이를 구하세요.`,
            en: String.raw`Count the intervals of stage \(C_3\) and compute its total length.`,
          },
          display: [String.raw`2^3 = 8, \qquad \left(\tfrac{2}{3}\right)^3 = \tfrac{8}{27}`],
          preset: { stage: 3 },
          presetCaption: {
            ko: String.raw`3단계 — 8개의 조각, 전체 길이 \(8/27 \approx 0.296\).`,
            en: String.raw`Stage 3 — 8 pieces, total length \(8/27 \approx 0.296\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`각 단계에서 모든 구간이 두 개로 쪼개지므로, \(n\)단계의 구간 수는 \(2^n\)개입니다. 따라서 \(C_3\)은 \(2^3 = 8\)개의 구간으로 이루어져 있습니다.`,
                en: String.raw`Every interval splits into two at each stage, so stage \(n\) has \(2^n\) intervals. Hence \(C_3\) consists of \(2^3 = 8\) intervals.`,
              },
            },
            {
              text: {
                ko: String.raw`\(n\)단계의 각 구간 길이는 \(\left(\frac13\right)^n\)이므로, 전체 길이는 \(2^n \cdot \left(\frac13\right)^n = \left(\frac23\right)^n\)입니다.`,
                en: String.raw`Each interval at stage \(n\) has length \(\left(\frac13\right)^n\), so the total length is \(2^n \cdot \left(\frac13\right)^n = \left(\frac23\right)^n\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n = 3\)일 때 전체 길이는 \(\left(\frac23\right)^3 = \frac{8}{27} \approx 0.296\)입니다.`,
                en: String.raw`At \(n = 3\) the total length is \(\left(\frac23\right)^3 = \frac{8}{27} \approx 0.296\).`,
              },
            },
          ],
        },
        {
          id: 'quarter-in-cantor',
          statement: {
            ko: String.raw`\(\frac14\)이 칸토어 집합에 속함을 삼진법 전개를 이용해 판정하세요.`,
            en: String.raw`Decide whether \(\frac14\) belongs to the Cantor set using its ternary expansion.`,
          },
          display: [String.raw`\frac14 = 0.020202\ldots_3 \in C`],
          preset: { stage: 4 },
          presetCaption: {
            ko: String.raw`4단계 — \(\frac14\)는 매 단계 살아남는 구간 안에 있습니다.`,
            en: String.raw`Stage 4 — \(\frac14\) lies in a surviving interval at every stage.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`삼진법으로 \(0.020202\ldots_3 = \sum_{j=1}^{\infty} 2\cdot 3^{-2j}\)입니다. 등비급수 합 공식으로 \(\frac{2\cdot \frac19}{1-\frac19} = \frac{2/9}{8/9} = \frac14\)을 얻습니다.`,
                en: String.raw`In ternary, \(0.020202\ldots_3 = \sum_{j=1}^{\infty} 2\cdot 3^{-2j}\). The geometric series sums to \(\frac{2\cdot \frac19}{1-\frac19} = \frac{2/9}{8/9} = \frac14\).`,
              },
            },
            {
              text: {
                ko: String.raw`이 전개에는 숫자 \(1\)이 등장하지 않습니다. 삼진법 판정법(전개에 \(1\)이 없는 수가 정확히 살아남는 수 — 여기서는 증명 없이 사용합니다)에 의해, \(\frac14\)는 어떤 단계에서도 지워지는 가운데 구간에 들어가지 않습니다.`,
                en: String.raw`This expansion contains no digit \(1\). By the ternary characterization (numbers whose expansion avoids \(1\) are exactly the survivors — used here without proof), \(\frac14\) never falls into a deleted middle third at any stage.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\frac14\)는 모든 \(C_n\)에 속하고, \(C = \bigcap_n C_n\)에도 속합니다.`,
                en: String.raw`Hence \(\frac14\) belongs to every \(C_n\), and therefore to \(C = \bigcap_n C_n\).`,
              },
            },
          ],
        },
        {
          id: 'measure-zero',
          statement: {
            ko: String.raw`칸토어 집합 \(C\)의 '길이'(측도)가 \(0\)임을 덮개 논증으로 증명하세요.`,
            en: String.raw`Prove that the Cantor set \(C\) has measure zero, via a covering argument.`,
          },
          display: [String.raw`\forall\, \varepsilon > 0\ \ \exists\, n:\ \left(\tfrac23\right)^n < \varepsilon`],
          preset: { stage: 8 },
          presetCaption: {
            ko: String.raw`8단계 — 전체 길이 \((2/3)^8 \approx 0.039\). \(n\)을 키우면 임의로 작아집니다.`,
            en: String.raw`Stage 8 — total length \((2/3)^8 \approx 0.039\), made arbitrarily small by taking \(n\) larger.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(C \subseteq C_n\) (모든 \(n\)에 대해)이고, \(C_n\)은 전체 길이가 \(\left(\frac23\right)^n\)인 \(2^n\)개의 구간으로 이루어져 있습니다.`,
                en: String.raw`\(C \subseteq C_n\) for every \(n\), and \(C_n\) consists of \(2^n\) intervals of total length \(\left(\frac23\right)^n\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\left(\frac23\right)^n < \varepsilon\)인 \(n\)을 잡습니다 (\(\left(\frac23\right)^n \to 0\)이므로 가능합니다). 그러면 \(C\)는 전체 길이가 \(\varepsilon\)보다 작은 유한 개의 구간으로 덮입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), choose \(n\) with \(\left(\frac23\right)^n < \varepsilon\) (possible since \(\left(\frac23\right)^n \to 0\)). Then \(C\) is covered by finitely many intervals of total length below \(\varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`임의로 작은 전체 길이로 덮을 수 있는 집합의 측도는 \(0\)입니다(르벡 외측도의 정의). 참고로 \(C\)는 비가산집합이라는 사실도 알려져 있습니다 — 길이가 0인데 점은 셀 수 없이 많은 것입니다.`,
                en: String.raw`A set coverable by intervals of arbitrarily small total length has measure zero (this is the definition of Lebesgue outer measure zero). For the record, \(C\) is also uncountable — length zero, yet uncountably many points.`,
              },
            },
          ],
        },
      ];
