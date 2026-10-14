import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'closure-open-interval',
          statement: {
            ko: String.raw`\((0,1)\)의 폐포가 \([0,1]\)임을 증명하세요.`,
            en: String.raw`Prove the closure of \((0,1)\) is \([0,1]\).`,
          },
          display: [String.raw`\overline{(0,1)} = [0,1]`],
          preset: { kind: 'open', m: 1.5 },
          presetCaption: {
            ko: String.raw`빨간 점 \(0, 1\) — 폐포가 추가한 극한점.`,
            en: String.raw`The red dots \(0, 1\) — limit points added by the closure.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((0,1)\)의 점은 자명히 폐포에 속한다. \(x = 0\)이라 하자: 임의의 \(\varepsilon > 0\)에 대해 \(\varepsilon/2 \in (0,\varepsilon) \cap (0,1)\)이므로, \(0\)의 모든 근방이 \((0,1)\)과 만난다. 즉 \(0 \in \overline{(0,1)}\)이다.`,
                en: String.raw`Points of \((0,1)\) are trivially in the closure. Let \(x = 0\): for every \(\varepsilon > 0\), \(\varepsilon/2 \in (0,\varepsilon) \cap (0,1)\), so every neighborhood of \(0\) meets \((0,1)\); i.e. \(0 \in \overline{(0,1)}\).`,
              },
            },
            {
              text: {
                ko: String.raw`마찬가지로 \(x = 1\)의 모든 \(\varepsilon\)-근방은 \(1 - \varepsilon/2 \in (0,1)\)을 포함하므로 \(1 \in \overline{(0,1)}\)이다.`,
                en: String.raw`Likewise every \(\varepsilon\)-ball at \(1\) contains \(1 - \varepsilon/2 \in (0,1)\), so \(1 \in \overline{(0,1)}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x < 0\)이면 반지름 \(-x/2\)인 공이 \((-\infty, 0)\) 안에 있어 \((0,1)\)과 만나지 않고, \(x > 1\)도 마찬가지다. 따라서 폐포는 정확히 \([0,1]\)이다.`,
                en: String.raw`If \(x < 0\), the ball of radius \(-x/2\) around \(x\) lies in \((-\infty, 0)\), disjoint from \((0,1)\); similarly for \(x > 1\). Hence the closure is exactly \([0,1]\).`,
              },
            },
          ],
        },
        {
          id: 'open-not-closed',
          statement: {
            ko: String.raw`\((0,1)\)이 닫힌집합이 아님을 폐포를 이용해 증명하세요.`,
            en: String.raw`Prove \((0,1)\) is not closed, using the closure.`,
          },
          display: [String.raw`0 \in \overline{(0,1)} \setminus (0,1)`],
          preset: { kind: 'open', m: 2 },
          presetCaption: {
            ko: String.raw`\(M = 2\) — 담는 구간을 넓혀도 닫힘은 생기지 않는다.`,
            en: String.raw`\(M = 2\) — widening the bound does not make it closed.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`닫힌집합은 폐포와 같아야 한다: \(A\)가 닫힘 ⟺ \(\overline{A} = A\).`,
                en: String.raw`A closed set equals its closure: \(A\) is closed ⟺ \(\overline{A} = A\).`,
              },
            },
            {
              text: {
                ko: String.raw`예제 1에서 \(\overline{(0,1)} = [0,1]\)이다. 그런데 \(0 \in [0,1]\)이지만 \(0 \notin (0,1)\)이므로, 폐포가 집합보다 크다.`,
                en: String.raw`By problem 1, \(\overline{(0,1)} = [0,1]\). But \(0 \in [0,1]\) while \(0 \notin (0,1)\), so the closure is strictly larger.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \((0,1) \neq \overline{(0,1)}\)이므로 \((0,1)\)은 닫힌집합이 아니다.`,
                en: String.raw`Hence \((0,1) \neq \overline{(0,1)}\), so \((0,1)\) is not closed.`,
              },
            },
          ],
        },
        {
          id: 'reciprocal-closure',
          statement: {
            ko: String.raw`\(A = \{1/n : n \geq 1\}\)이 유계임을 보이고, 그 폐포가 \(A \cup \{0\}\)임을 증명하세요.`,
            en: String.raw`Show \(A = \{1/n : n \geq 1\}\) is bounded and prove its closure is \(A \cup \{0\}\).`,
          },
          display: [String.raw`\overline{\{1/n : n \geq 1\}} = \{1/n : n \geq 1\} \cup \{0\}`],
          preset: { kind: 'reciprocal', m: 1.5 },
          presetCaption: {
            ko: String.raw`빨간 점 \(0\) — 수열이 다가가지만 닿지 않는 극한점.`,
            en: String.raw`The red dot \(0\) — the limit point the sequence approaches but never touches.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`모든 \(n\)에 대해 \(0 < 1/n \leq 1\)이므로, \(M = 1\)에 대해 \(x \in A\)이면 \(\lvert x\rvert \leq M\) — \(A\)는 유계다.`,
                en: String.raw`For all \(n\), \(0 < 1/n \leq 1\), so with \(M = 1\) we have \(\lvert x\rvert \leq M\) for \(x \in A\) — \(A\) is bounded.`,
              },
            },
            {
              text: {
                ko: String.raw`\(0\)의 임의의 \(\varepsilon\)-근방은 \(1/N < \varepsilon\)인 \(N\)에 대해 \(1/N \in A\)를 포함하므로, \(0\)은 \(A\)의 극한점이다. 즉 \(0 \in \overline{A}\)이다.`,
                en: String.raw`Every \(\varepsilon\)-ball at \(0\) contains \(1/N \in A\) for \(1/N < \varepsilon\), so \(0\) is a limit point of \(A\): \(0 \in \overline{A}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(A \cup \{0\}\) 밖의 점은 \(A\)를 피한다: \(x < 0\)이면 반지름 \(\lvert x\rvert/2\)인 공이 \(A\)와 만나지 않고, \(x > 1\)도 마찬가지이며, \((0,1]\)에서 \(A\)에 속하지 않은 점은 이웃한 두 항 \(1/(n+1) < x < 1/n\) 사이에 있어 양쪽까지의 거리만큼의 공이 \(A\)를 피한다. 따라서 폐포는 정확히 \(A \cup \{0\}\)이다.`,
                en: String.raw`Points outside \(A \cup \{0\}\) miss \(A\): for \(x < 0\) the ball of radius \(\lvert x\rvert/2\) avoids \(A\), similarly for \(x > 1\); a point of \((0,1] \setminus A\) lies strictly between consecutive terms \(1/(n+1) < x < 1/n\), so a ball of the nearer gap radius avoids \(A\). Hence the closure is exactly \(A \cup \{0\}\).`,
              },
            },
          ],
        },
      ];
