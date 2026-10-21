import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'affine',
          statement: {
            ko: String.raw`\(f(x) = \frac{x}{2} + 1\)이 \(q = \frac12\)인 수축사상임을 보이고, 고정점과 오차 상한을 구하세요.`,
            en: String.raw`Show \(f(x) = \frac{x}{2} + 1\) is a contraction with \(q = \frac12\); find the fixed point and the error bound.`,
          },
          display: [String.raw`x^* = 2, \quad |x_n - 2| \le \left(\tfrac12\right)^n |x_0 - 2|`],
          preset: { fn: 'x/2+1', x0: 0, n: 8 },
          presetCaption: {
            ko: String.raw`\(x_0 = 0\), \(n = 8\): 오차 \(= 0.0078\)이 상한과 정확히 일치합니다.`,
            en: String.raw`\(x_0 = 0\), \(n = 8\): the error \(= 0.0078\) matches the bound exactly.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(|f(x) - f(y)| = \left|\frac{x-y}{2}\right| = \frac12|x - y|\)이므로 \(q = \frac12\)인 수축사상입니다.`,
                en: String.raw`\(|f(x) - f(y)| = \left|\frac{x-y}{2}\right| = \frac12|x - y|\), so \(f\) is a contraction with \(q = \frac12\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = \frac{x}{2} + 1\)을 풀면 \(x^* = 2\)입니다.`,
                en: String.raw`Solving \(x = \frac{x}{2} + 1\) gives \(x^* = 2\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x_{n+1} - 2| = \frac12|x_n - 2|\)이므로 귀납법으로 \(|x_n - 2| = \left(\frac12\right)^n|x_0 - 2|\)입니다. \(x_0 = 0\), \(n = 8\)이면 오차는 \(\frac{2}{256} = 0.0078125\)입니다.`,
                en: String.raw`Since \(|x_{n+1} - 2| = \frac12|x_n - 2|\), induction gives \(|x_n - 2| = \left(\frac12\right)^n|x_0 - 2|\). For \(x_0 = 0\), \(n = 8\), the error is \(\frac{2}{256} = 0.0078125\).`,
              },
            },
          ],
        },
        {
          id: 'dottie',
          statement: {
            ko: String.raw`\(\cos x\)는 \([0,1]\)에서 수축사상임을 보이고, 도티 수 \(x^* \approx 0.739\)의 존재·유일성을 설명하세요.`,
            en: String.raw`Show \(\cos x\) is a contraction on \([0,1]\); explain the existence and uniqueness of the Dottie number \(x^* \approx 0.739\).`,
          },
          display: [String.raw`|\cos x - \cos y| \le \sin(1)\,|x - y|, \quad \sin(1) \approx 0.8415 < 1`],
          preset: { fn: 'cos', x0: 0.5, n: 20 },
          presetCaption: {
            ko: String.raw`\(n = 20\): 반복값이 도티 수 \(0.739085\)에 달라붙습니다.`,
            en: String.raw`\(n = 20\): the iterates cling to the Dottie number \(0.739085\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\cos\)는 \([0,1]\)에서 연속이고 \((0,1)\)에서 미분가능하므로 평균값 정리를 적용할 수 있습니다: 어떤 \(\xi\)가 \(x, y\) 사이에 있어 \(|\cos x - \cos y| = |-\sin\xi|\cdot|x - y|\)입니다. \(\xi \in [0,1] \subset [0, \frac{\pi}{2})\)이고 \(\sin\)은 \([0, \frac{\pi}{2})\)에서 증가하므로 \(|\sin\xi| \le \sin(1)\)이며, 따라서 \(|\cos x - \cos y| \le \sin(1)\,|x - y|\)이고, \(\sin(1) \approx 0.8415 < 1\)이므로 수축사상입니다. 또한 \(\cos\)는 \([0,1]\)에서 감소하므로 (\((\cos)' = -\sin < 0\)), \(\cos([0,1]) = [\cos 1, \cos 0] = [\cos 1, 1] \subset [0,1]\)입니다 (\(\cos 1 \approx 0.5403 > 0\)) — \([0,1]\)을 자기 자신 안으로 보내는 수축사상입니다.`,
                en: String.raw`\(\cos\) is continuous on \([0,1]\) and differentiable on \((0,1)\), so the Mean Value Theorem applies: some \(\xi\) between \(x\) and \(y\) gives \(|\cos x - \cos y| = |-\sin\xi|\cdot|x - y|\). Since \(\xi \in [0,1] \subset [0, \frac{\pi}{2})\) and \(\sin\) is increasing on \([0, \frac{\pi}{2})\), \(|\sin\xi| \le \sin(1)\), so \(|\cos x - \cos y| \le \sin(1)\,|x - y|\), and \(\sin(1) \approx 0.8415 < 1\), so \(\cos\) is a contraction. Also \(\cos\) is decreasing on \([0,1]\) (since \((\cos)' = -\sin < 0\)), so \(\cos([0,1]) = [\cos 1, \cos 0] = [\cos 1, 1] \subset [0,1]\) (with \(\cos 1 \approx 0.5403 > 0\)) — a contraction mapping \([0,1]\) into itself.`,
              },
            },
            {
              text: {
                ko: String.raw`\([0,1]\)은 \(\mathbb{R}\)에서 닫힌집합이므로 완비입니다 — 바나흐 정리의 완비성 가정이 성립합니다. 따라서 바나흐 정리에 의해 \([0,1]\) 안에 유일한 고정점이 존재합니다 — 도티 수 \(x^* \approx 0.739085\)입니다 (수치는 반복 계산값).`,
                en: String.raw`\([0,1]\) is closed in \(\mathbb{R}\), hence complete — the completeness hypothesis of Banach's theorem holds. Banach's theorem then gives a unique fixed point in \([0,1]\) — the Dottie number \(x^* \approx 0.739085\) (the value is from iteration).`,
              },
            },
          ],
        },
        {
          id: 'uniqueness',
          statement: {
            ko: String.raw`고정점이 최대 하나임을 세 줄로 증명하세요.`,
            en: String.raw`Prove in three lines that there is at most one fixed point.`,
          },
          display: [String.raw`|x^* - y^*| = |f(x^*) - f(y^*)| \le q|x^* - y^*|`],
          preset: { fn: 'x/2+1', x0: 0.3, n: 5 },
          presetCaption: {
            ko: String.raw`어디서 시작해도 같은 점 \(x^* = 2\)로 빨려듭니다.`,
            en: String.raw`Every start gets sucked into the same point \(x^* = 2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x^*\), \(y^*\)가 모두 고정점이라 가정합니다.`,
                en: String.raw`Suppose \(x^*\) and \(y^*\) are both fixed points.`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x^* - y^*| = |f(x^*) - f(y^*)| \le q|x^* - y^*|\)입니다.`,
                en: String.raw`Then \(|x^* - y^*| = |f(x^*) - f(y^*)| \le q|x^* - y^*|\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(q < 1\)이므로 이는 \(|x^* - y^*| = 0\), 즉 \(x^* = y^*\)를 강제합니다.`,
                en: String.raw`Since \(q < 1\), this forces \(|x^* - y^*| = 0\), i.e. \(x^* = y^*\).`,
              },
            },
          ],
        },
      ];
