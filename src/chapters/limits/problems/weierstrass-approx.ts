import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'constant-reproduced',
          statement: {
            ko: String.raw`\(B_n(1) = 1\)을 증명하세요 — 상수함수는 정확히 재현됩니다.`,
            en: String.raw`Prove that \(B_n(1) = 1\) — the constant function is reproduced exactly.`,
          },
          display: [String.raw`B_n(1)(x) = \sum_{k=0}^{n}\binom{n}{k}x^k(1-x)^{n-k} = (x+(1-x))^n = 1`],
          preset: { fn: 'one', n: 8 },
          presetCaption: {
            ko: String.raw`상수함수 1 — 근사가 원본과 완전히 겹친다.`,
            en: String.raw`The constant 1 — the approximant coincides exactly.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f \equiv 1\)이므로 \(f(k/n) = 1\)입니다. 따라서 \(B_n(1)(x) = \sum_{k=0}^{n}\binom{n}{k}x^k(1-x)^{n-k}\) — 기저들의 합 자체입니다.`,
                en: String.raw`Since \(f \equiv 1\), we have \(f(k/n) = 1\). Hence \(B_n(1)(x) = \sum_{k=0}^{n}\binom{n}{k}x^k(1-x)^{n-k}\) — just the sum of the basis functions.`,
              },
            },
            {
              text: {
                ko: String.raw`이항정리로 \(\sum_{k=0}^{n}\binom{n}{k}x^k(1-x)^{n-k} = (x + (1-x))^n = 1^n = 1\)입니다.`,
                en: String.raw`By the binomial theorem, \(\sum_{k=0}^{n}\binom{n}{k}x^k(1-x)^{n-k} = (x + (1-x))^n = 1^n = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 모든 \(x\)와 모든 \(n\)에 대해 \(B_n(1)(x) = 1\) — 오차가 0입니다. 상수함수는 "근사"되는 게 아니라 정확히 재현됩니다.`,
                en: String.raw`So \(B_n(1)(x) = 1\) for every \(x\) and every \(n\) — zero error. The constant is not approximated; it is reproduced.`,
              },
            },
          ],
        },
        {
          id: 'linear-reproduced',
          statement: {
            ko: String.raw`\(n \ge 1\)에 대해 \(B_n(x) = x\)를 증명하세요.`,
            en: String.raw`Prove that \(B_n(x) = x\) for \(n \ge 1\).`,
          },
          display: [String.raw`\sum_{k=0}^{n}\frac{k}{n}\binom{n}{k}x^k(1-x)^{n-k} = x`],
          preset: { fn: 'id', n: 8 },
          presetCaption: {
            ko: String.raw`항등함수 — 역시 정확히 재현.`,
            en: String.raw`The identity — reproduced exactly too.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`설정: 정수 \(n \ge 1\)을 고정합니다 (\(n = 0\)이면 \(f(k/n)\)의 나눗셈이 정의되지 않습니다). 목표 함수는 \(f(t) = t\)이므로 \(f(k/n) = k/n\)입니다. \(k \geq 1\)일 때 \(k\binom{n}{k} = n\binom{n-1}{k-1}\)입니다 (\(k = 0\)인 항은 \(\frac{k}{n} = 0\)이므로 사라집니다).`,
                en: String.raw`Setup: fix an integer \(n \ge 1\) (for \(n = 0\) the values \(f(k/n)\) involve division by zero). The target function is \(f(t) = t\), so \(f(k/n) = k/n\). For \(k \geq 1\), \(k\binom{n}{k} = n\binom{n-1}{k-1}\) (the \(k = 0\) term vanishes since \(\frac{k}{n} = 0\)).`,
              },
            },
            {
              text: {
                ko: String.raw`대입하면 \(B_n(x)(x) = \sum_{k=1}^{n}\frac{k}{n}\binom{n}{k}x^k(1-x)^{n-k} = x\sum_{j=0}^{n-1}\binom{n-1}{j}x^j(1-x)^{n-1-j}\)입니다 (\(j = k-1\)로 치환).`,
                en: String.raw`Substituting gives \(B_n(x)(x) = \sum_{k=1}^{n}\frac{k}{n}\binom{n}{k}x^k(1-x)^{n-k} = x\sum_{j=0}^{n-1}\binom{n-1}{j}x^j(1-x)^{n-1-j}\) (setting \(j = k-1\)).`,
              },
            },
            {
              text: {
                ko: String.raw`이항정리로 안쪽 합은 \((x+(1-x))^{n-1} = 1\)이므로 \(B_n(x)(x) = x\) — 항등함수도 모든 \(n \ge 1\)에서 정확히 재현됩니다.`,
                en: String.raw`By the binomial theorem the inner sum is \((x+(1-x))^{n-1} = 1\), so \(B_n(x)(x) = x\) — the identity is also reproduced exactly for every \(n \ge 1\).`,
              },
            },
          ],
        },
        {
          id: 'uniform-limit-continuous',
          statement: {
            ko: String.raw`연속함수들의 균등극한은 연속임을 증명하세요 (\(\varepsilon/3\) 논법).`,
            en: String.raw`Prove that the uniform limit of continuous functions is continuous (the \(\varepsilon/3\) argument).`,
          },
          display: [String.raw`|f(x)-f(x_0)| \le |f-f_N| + |f_N(x)-f_N(x_0)| + |f_N-f| < \varepsilon`],
          preset: { fn: 'abs', n: 40 },
          presetCaption: {
            ko: String.raw`\(n = 40\) — 꺾인 점도 거의 따라잡는다.`,
            en: String.raw`\(n = 40\) — even the kink is nearly matched.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x_0 \in [a,b]\)를 임의로 고정하고 \(\varepsilon > 0\)을 주어진 것으로 둡니다. \(f_N \to f\)가 균등수렴하므로, \(\lVert f_N - f\rVert_\infty < \frac{\varepsilon}{3}\)을 만족하는 \(N\)을 선택합니다.`,
                en: String.raw`Let \(x_0 \in [a,b]\) be arbitrary and let \(\varepsilon > 0\) be given. Since \(f_N \to f\) uniformly, pick \(N\) with \(\lVert f_N - f\rVert_\infty < \frac{\varepsilon}{3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f_N\)이 \(x_0\)에서 연속이므로, \(\lvert x - x_0\rvert < \delta\)이면 \(\lvert f_N(x) - f_N(x_0)\rvert < \frac{\varepsilon}{3}\)인 \(\delta > 0\)을 선택합니다.`,
                en: String.raw`Since \(f_N\) is continuous at \(x_0\), pick \(\delta > 0\) such that \(\lvert x - x_0\rvert < \delta\) implies \(\lvert f_N(x) - f_N(x_0)\rvert < \frac{\varepsilon}{3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`삼각부등식으로 \(\lvert f(x) - f(x_0)\rvert \leq \lvert f - f_N\rvert + \lvert f_N(x) - f_N(x_0)\rvert + \lvert f_N - f\rvert < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\) — 따라서 \(f\)는 \(x_0\)에서 연속입니다. \(x_0 \in [a,b]\)는 임의였으므로 \(f\)는 \([a,b]\) 전체에서 연속입니다. (이것이 균일 노름 \(\lVert\cdot\rVert_\infty\)이 \(C[0,1]\)을 닫힌 공간으로 만드는 이유이기도 합니다.)`,
                en: String.raw`By the triangle inequality, \(\lvert f(x) - f(x_0)\rvert \leq \lvert f - f_N\rvert + \lvert f_N(x) - f_N(x_0)\rvert + \lvert f_N - f\rvert < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\) — so \(f\) is continuous at \(x_0\). Since \(x_0 \in [a,b]\) was arbitrary, \(f\) is continuous on all of \([a,b]\). (This is also why the uniform norm \(\lVert\cdot\rVert_\infty\) makes \(C[0,1]\) a closed space.)`,
              },
            },
          ],
        },
      ];
