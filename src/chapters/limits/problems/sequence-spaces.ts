import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'harmonic-in-l2-not-l1',
          statement: {
            ko: String.raw`\((1, 1/2, 1/3, \dots)\)가 \(\ell^2\)에는 속하지만 \(\ell^1\)에는 속하지 않음을 증명하세요.`,
            en: String.raw`Prove \((1, 1/2, 1/3, \dots)\) belongs to \(\ell^2\) but not to \(\ell^1\).`,
          },
          display: [
            String.raw`\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} < \infty`,
            String.raw`\sum_{n=1}^{\infty} \frac{1}{n} = \infty`,
          ],
          preset: { view: 'sequence', p: '2', alpha: 1 },
          presetCaption: {
            ko: String.raw`\(\alpha = 1\) — \(\ell^2\)에는 들고 \(\ell^1\)에는 안 든다.`,
            en: String.raw`\(\alpha = 1\) — inside \(\ell^2\), outside \(\ell^1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x_n = 1/n\)이라 두자. \(\sum_{n=1}^{\infty} x_n^2 = \sum_{n=1}^{\infty} 1/n^2 = \pi^2/6 < \infty\)이므로, 제곱합이 유한 — 즉 \(x \in \ell^2\)이다. (값 \(\sum 1/n^2 = \pi^2/6\)은 muntz-szasz 씬에서 Parseval로 증명되며, 수렴 자체는 급수 단원의 적분판정법으로도 얻어진다.)`,
                en: String.raw`Put \(x_n = 1/n\). Then \(\sum_{n=1}^{\infty} x_n^2 = \sum_{n=1}^{\infty} 1/n^2 = \pi^2/6 < \infty\): the sum of squares is finite, so \(x \in \ell^2\). (The value \(\sum 1/n^2 = \pi^2/6\) is proved by Parseval in the muntz-szasz scene; convergence alone follows from the integral test in the series chapter.)`,
              },
            },
            {
              text: {
                ko: String.raw`반면 조화급수 \(\sum_{n=1}^{\infty} |x_n| = \sum_{n=1}^{\infty} 1/n = \infty\)는 발산하므로 \(x \notin \ell^1\)이다. (발산은 Oresme의 묶음 논증이다: 블록 \(1/(2^k+1) + \cdots + 1/2^{k+1}\)은 항이 \(2^k\)개이고 각 항이 \(\ge 1/2^{k+1}\)이라 합이 \(\ge 1/2\)이다; 급수 단원에서 증명된다.)`,
                en: String.raw`But the harmonic series \(\sum_{n=1}^{\infty} |x_n| = \sum_{n=1}^{\infty} 1/n = \infty\) diverges, so \(x \notin \ell^1\). (Divergence is Oresme's grouping argument: the block \(1/(2^k+1) + \cdots + 1/2^{k+1}\) has \(2^k\) terms each \(\ge 1/2^{k+1}\), hence sums to \(\ge 1/2\); proved in the series chapter.)`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \((1, 1/2, 1/3, \dots) \in \ell^2 \setminus \ell^1\) — 제곱하면 수렴하는데 절댓값으로는 안 모이는 수열이 존재한다. 이것이 \(\ell^1 \subsetneq \ell^2\)의 핵심 예시다.`,
                en: String.raw`Hence \((1, 1/2, 1/3, \dots) \in \ell^2 \setminus \ell^1\) — a sequence whose squares are summable but whose absolute values are not. This is the key example for \(\ell^1 \subsetneq \ell^2\).`,
              },
            },
          ],
        },
        {
          id: 'l1-subset-l2',
          statement: {
            ko: String.raw`\(\ell^1 \subset \ell^2\)임을 증명하세요.`,
            en: String.raw`Prove \(\ell^1 \subset \ell^2\).`,
          },
          display: [String.raw`\sum |x_n| < \infty \implies \sum x_n^2 < \infty`],
          preset: { view: 'sequence', p: '1', alpha: 1.5 },
          presetCaption: {
            ko: String.raw`\(\alpha = 1.5 > 1\) — \(\ell^1\)에 들면 자동으로 \(\ell^2\)에도 든다.`,
            en: String.raw`\(\alpha = 1.5 > 1\) — membership in \(\ell^1\) forces membership in \(\ell^2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x \in \ell^1\)이라 하자. \(\sum |x_n| < \infty\)이므로 \(|x_n| \to 0\) — 따라서 \(|x_n| < 1\)인 \(N\)이 존재한다 (\(n \geq N\)).`,
                en: String.raw`Let \(x \in \ell^1\). Since \(\sum |x_n| < \infty\) we have \(|x_n| \to 0\), so there is an \(N\) with \(|x_n| < 1\) for all \(n \geq N\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n \geq N\)에서 \(x_n^2 = |x_n| \cdot |x_n| \leq |x_n| \cdot 1 = |x_n|\)이다 — 작은 수의 제곱은 원래 수보다 작다.`,
                en: String.raw`For \(n \geq N\), \(x_n^2 = |x_n| \cdot |x_n| \leq |x_n| \cdot 1 = |x_n|\) — the square of a small number is smaller than the number itself.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\sum_{n \geq N} x_n^2 \leq \sum_{n \geq N} |x_n| \leq \sum |x_n| < \infty\)이다. 앞의 유한 개 항은 수렴성에 영향을 주지 않으므로 \(\sum x_n^2 < \infty\) — 즉 \(x \in \ell^2\)이다.`,
                en: String.raw`Hence \(\sum_{n \geq N} x_n^2 \leq \sum_{n \geq N} |x_n| \leq \sum |x_n| < \infty\). The finitely many initial terms do not affect convergence, so \(\sum x_n^2 < \infty\) — i.e. \(x \in \ell^2\).`,
              },
            },
          ],
        },
        {
          id: 'sup-metric',
          statement: {
            ko: String.raw`\(d_\infty(x, y) = \sup_n |x_n - y_n|\)이 \(\ell^\infty\) 위의 거리임을 증명하세요.`,
            en: String.raw`Prove \(d_\infty(x, y) = \sup_n |x_n - y_n|\) is a metric on \(\ell^\infty\).`,
          },
          display: [String.raw`d_\infty(x, y) = \sup_n |x_n - y_n|`],
          preset: { view: 'balls', p: 'inf', alpha: 1 },
          presetCaption: {
            ko: String.raw`\(p = \infty\) — 단위 공이 정사각형이 된다.`,
            en: String.raw`\(p = \infty\) — the unit ball becomes a square.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x, y \in \ell^\infty\)이면 모든 \(n\)에 대해 \(|x_n - y_n| \le |x_n| + |y_n| \le \|x\|_\infty + \|y\|_\infty < \infty\)이므로 \((|x_n - y_n|)\)은 \(\|x\|_\infty + \|y\|_\infty\)로 유계이고, 상한이 존재하고 유한하다 — \(d_\infty(x, y)\)는 잘 정의되고 \(d_\infty(x, y) \geq 0\)이다.`,
                en: String.raw`If \(x, y \in \ell^\infty\) then for every \(n\), \(|x_n - y_n| \le |x_n| + |y_n| \le \|x\|_\infty + \|y\|_\infty < \infty\), so \((|x_n - y_n|)\) is bounded by \(\|x\|_\infty + \|y\|_\infty\) and the supremum exists and is finite — \(d_\infty(x, y)\) is well defined and \(d_\infty(x, y) \geq 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(d_\infty(x, y) = 0\) ⟺ 모든 \(n\)에 대해 \(|x_n - y_n| = 0\) ⟺ \(x = y\)이다. 대칭성 \(d_\infty(x, y) = d_\infty(y, x)\)는 \(|x_n - y_n| = |y_n - x_n|\)에서 바로 나온다.`,
                en: String.raw`\(d_\infty(x, y) = 0\) iff \(|x_n - y_n| = 0\) for every \(n\), iff \(x = y\). Symmetry \(d_\infty(x, y) = d_\infty(y, x)\) follows from \(|x_n - y_n| = |y_n - x_n|\).`,
              },
            },
            {
              text: {
                ko: String.raw`삼각 부등식: 각 \(n\)에 대해 \(|x_n - z_n| \leq |x_n - y_n| + |y_n - z_n| \leq d_\infty(x, y) + d_\infty(y, z)\)이다. 우변이 \(n\)에 무관하므로 상한을 취하면 \(d_\infty(x, z) \leq d_\infty(x, y) + d_\infty(y, z)\)를 얻는다.`,
                en: String.raw`Triangle inequality: for each \(n\), \(|x_n - z_n| \leq |x_n - y_n| + |y_n - z_n| \leq d_\infty(x, y) + d_\infty(y, z)\). The right side does not depend on \(n\), so taking suprema gives \(d_\infty(x, z) \leq d_\infty(x, y) + d_\infty(y, z)\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(d_\infty\)는 거리 공리를 모두 만족한다 — \(\ell^\infty\)는 거리공간이며, 이는 노름 \(\|x\|_\infty = \sup_n |x_n|\)이 만든 거리 \(d(x, y) = \|x - y\|\)와 같다.`,
                en: String.raw`Thus \(d_\infty\) satisfies all the metric axioms — \(\ell^\infty\) is a metric space, and this is exactly the metric \(d(x, y) = \|x - y\|\) induced by the norm \(\|x\|_\infty = \sup_n |x_n|\).`,
              },
            },
          ],
        },
      ];
