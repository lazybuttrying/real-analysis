import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'open-interval-open',
          statement: {
            ko: String.raw`\((0,1)\)이 열린집합임을 정의로 직접 증명하세요.`,
            en: String.raw`Prove directly from the definition that \((0,1)\) is open.`,
          },
          display: [String.raw`\varepsilon = \min(x, 1-x) > 0`],
          preset: { set: 'open', x: 0.5, eps: 0.2 },
          presetCaption: {
            ko: String.raw`\(x = 0.5\), \(\varepsilon = 0.2\) — 공이 \((0,1)\) 안에 들어갑니다.`,
            en: String.raw`\(x = 0.5\), \(\varepsilon = 0.2\) — the ball stays inside \((0,1)\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x \in (0,1)\)이라 하자. \(x > 0\)이고 \(1 - x > 0\)이므로 \(\varepsilon = \min(x, 1-x) > 0\)이라 둘 수 있다.`,
                en: String.raw`Let \(x \in (0,1)\). Since \(x > 0\) and \(1 - x > 0\), we may put \(\varepsilon = \min(x, 1-x) > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(y \in (x-\varepsilon, x+\varepsilon)\)이라 하자. \(\lvert y - x\rvert < \varepsilon \leq x\)이므로 \(y > x - \varepsilon \geq 0\)이고, \(\lvert y - x\rvert < \varepsilon \leq 1 - x\)이므로 \(y < x + \varepsilon \leq 1\)이다.`,
                en: String.raw`Let \(y \in (x-\varepsilon, x+\varepsilon)\). From \(\lvert y - x\rvert < \varepsilon \leq x\) we get \(y > x - \varepsilon \geq 0\), and from \(\lvert y - x\rvert < \varepsilon \leq 1 - x\) we get \(y < x + \varepsilon \leq 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \((x-\varepsilon, x+\varepsilon) \subseteq (0,1)\)이다. \(x\)가 임의였으므로 \((0,1)\)은 열린집합이다.`,
                en: String.raw`Hence \((x-\varepsilon, x+\varepsilon) \subseteq (0,1)\). Since \(x\) was arbitrary, \((0,1)\) is open.`,
              },
            },
          ],
        },
        {
          id: 'infinite-intersection',
          statement: {
            ko: String.raw`\(\bigcap_{n=1}^{\infty} (-1/n, 1/n) = \{0\}\)임을 보이고, 이것이 열린집합이 아님을 증명하세요.`,
            en: String.raw`Show \(\bigcap_{n=1}^{\infty} (-1/n, 1/n) = \{0\}\), and prove it is not open.`,
          },
          display: [String.raw`\bigcap_{n=1}^{\infty} \left(-\frac{1}{n}, \frac{1}{n}\right) = \{0\}`],
          preset: { set: 'singleton', x: 0, eps: 0.1 },
          presetCaption: {
            ko: String.raw`\(\{0\}\) — 어떤 \(\varepsilon\)-공도 한 점 안에 들어가지 않는다.`,
            en: String.raw`\(\{0\}\) — no \(\varepsilon\)-ball fits inside a single point.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x \in \bigcap_{n} (-1/n, 1/n)\)이라 하자. 모든 \(n\)에 대해 \(\lvert x\rvert < 1/n\)이다. 만약 \(\lvert x\rvert > 0\)이면 아르키메데스 성질에 의해 \(1/n < \lvert x\rvert\)인 \(n\)이 존재해 \(\lvert x\rvert < 1/n\)에 모순이다. 따라서 \(\lvert x\rvert = 0\), 즉 \(x = 0\)이다.`,
                en: String.raw`Let \(x \in \bigcap_n (-1/n, 1/n)\). Then \(\lvert x\rvert < 1/n\) for every \(n\). If \(\lvert x\rvert > 0\), the Archimedean property gives an \(n\) with \(1/n < \lvert x\rvert\), contradicting \(\lvert x\rvert < 1/n\). Hence \(\lvert x\rvert = 0\), i.e. \(x = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`역으로 \(0\)은 모든 \((-1/n, 1/n)\)에 속하므로 교집합은 정확히 \(\{0\}\)이다.`,
                en: String.raw`Conversely \(0\) lies in every \((-1/n, 1/n)\), so the intersection is exactly \(\{0\}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\{0\}\)은 열린집합이 아니다: 점 \(0\)에서 어떤 \(\varepsilon > 0\)을 잡아도 \(\varepsilon/2 \in (-\varepsilon, \varepsilon)\)이지만 \(\varepsilon/2 \notin \{0\}\)이므로, \(\varepsilon\)-공이 \(\{0\}\) 안에 들어가지 않는다. — 열린집합들의 무한 교집합은 열려 있지 않을 수 있다.`,
                en: String.raw`\(\{0\}\) is not open: at \(0\), for any \(\varepsilon > 0\) we have \(\varepsilon/2 \in (-\varepsilon, \varepsilon)\) but \(\varepsilon/2 \notin \{0\}\), so no \(\varepsilon\)-ball fits inside \(\{0\}\). — infinite intersections of open sets need not be open.`,
              },
            },
          ],
        },
        {
          id: 'closed-not-open',
          statement: {
            ko: String.raw`\([0,1]\)이 열린집합이 아님을 증명하세요.`,
            en: String.raw`Prove \([0,1]\) is not open.`,
          },
          display: [String.raw`-\frac{\varepsilon}{2} \in (-\varepsilon, \varepsilon), \quad -\frac{\varepsilon}{2} \notin [0,1]`],
          preset: { set: 'closed', x: 0, eps: 0.2 },
          presetCaption: {
            ko: String.raw`\(x = 0\) — 경계점에서는 어떤 \(\varepsilon\)-공도 밖으로 샌다.`,
            en: String.raw`\(x = 0\) — at a boundary point every \(\varepsilon\)-ball leaks out.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(0 \in [0,1]\)이다. \(\varepsilon > 0\)을 임의로 잡자.`,
                en: String.raw`\(0 \in [0,1]\). Let \(\varepsilon > 0\) be arbitrary.`,
              },
            },
            {
              text: {
                ko: String.raw`\(-\varepsilon/2 \in (-\varepsilon, \varepsilon)\)이지만 \(-\varepsilon/2 < 0\)이므로 \(-\varepsilon/2 \notin [0,1]\)이다.`,
                en: String.raw`\(-\varepsilon/2 \in (-\varepsilon, \varepsilon)\) but \(-\varepsilon/2 < 0\), so \(-\varepsilon/2 \notin [0,1]\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(0\)의 어떤 \(\varepsilon\)-근방도 \([0,1]\) 안에 들어가지 않으므로, \([0,1]\)은 열린집합이 아니다.`,
                en: String.raw`Hence no \(\varepsilon\)-ball at \(0\) stays inside \([0,1]\); \([0,1]\) is not open.`,
              },
            },
          ],
        },
      ];
