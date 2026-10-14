import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'pointwise-limit',
          statement: {
            ko: String.raw`\(f_n(x) = x^n\) (\([0,1]\))의 점별 극한함수를 구하세요: \([0,1)\)에서는 \(0\), \(x = 1\)에서는 \(1\)임을 증명하세요.`,
            en: String.raw`Find the pointwise limit of \(f_n(x) = x^n\) on \([0,1]\): prove it equals \(0\) on \([0,1)\) and \(1\) at \(x = 1\).`,
          },
          display: [String.raw`f(x) = \begin{cases} 0 & 0 \leq x < 1 \\ 1 & x = 1 \end{cases}`],
          preset: { n: 8, eps: 0.2 },
          presetCaption: {
            ko: String.raw`\(n = 8\) — 곡선은 \(0\)에 달라붙다가 \(x = 1\)에서 솟구칩니다.`,
            en: String.raw`\(n = 8\) — the curve hugs \(0\), then shoots up at \(x = 1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x = 1\)에서는 모든 \(n\)에 대해 \(f_n(1) = 1^n = 1\)이므로 극한은 \(1\)입니다.`,
                en: String.raw`At \(x = 1\), \(f_n(1) = 1^n = 1\) for every \(n\), so the limit is \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = 0\)에서는 자명하게 \(0\)으로 수렴합니다. \(0 < x < 1\)인 경우, \(t = \frac1x > 1\)이라 두면 \(t = 1 + h\) (\(h > 0\))로 쓸 수 있고, 베르누이 부등식으로 \(t^n \geq 1 + nh\)입니다. 따라서 \(0 \leq x^n = \frac{1}{t^n} \leq \frac{1}{1+nh} \to 0\)이므로 조임 정리로 \(x^n \to 0\)입니다.`,
                en: String.raw`At \(x = 0\) the limit is trivially \(0\). For \(0 < x < 1\), write \(t = \frac1x > 1\) as \(t = 1 + h\) with \(h > 0\); Bernoulli's inequality gives \(t^n \geq 1 + nh\). Hence \(0 \leq x^n = \frac{1}{t^n} \leq \frac{1}{1+nh} \to 0\), so \(x^n \to 0\) by the squeeze theorem.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 점별 극한함수는 \([0,1)\)에서 \(0\), \(x = 1\)에서 \(1\)이며, \(x = 1\)에서 불연속입니다. 연속함수들의 점별 극한이 불연속일 수 있다는 첫 번째 경고입니다.`,
                en: String.raw`The pointwise limit is therefore \(0\) on \([0,1)\) and \(1\) at \(x = 1\) — discontinuous at \(x = 1\). A first warning that pointwise limits of continuous functions need not be continuous.`,
              },
            },
          ],
        },
        {
          id: 'not-uniform',
          statement: {
            ko: String.raw`모든 \(n\)에 대해 \(\sup_{[0,1]} |f_n - f| = 1\)임을 증명하고, 따라서 이 수렴이 균등하지 않음을 결론지으세요.`,
            en: String.raw`Prove \(\sup_{[0,1]} |f_n - f| = 1\) for every \(n\), and conclude the convergence is not uniform.`,
          },
          display: [String.raw`\sup_{[0,1]} |f_n - f| = 1 \not\to 0`],
          preset: { n: 8, eps: 0.2 },
          presetCaption: {
            ko: String.raw`\(n = 8\), \(\varepsilon = 0.2\) — 차트는 격자 위에서 최댓값 \(\approx 0.98\)을 읽지만, 정확한 상한은 \(1\)입니다 (달성되지는 않습니다).`,
            en: String.raw`\(n = 8\), \(\varepsilon = 0.2\) — the chart reads \(\approx 0.98\) on its grid; the exact supremum is \(1\) (never attained).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\([0,1)\)에서 \(|f_n - f| = x^n\)이고 \(x = 1\)에서는 \(0\)이므로, \(\sup_{[0,1]} |f_n - f| = \sup_{[0,1)} x^n\)입니다.`,
                en: String.raw`On \([0,1)\), \(|f_n - f| = x^n\), and it is \(0\) at \(x = 1\), so \(\sup_{[0,1]} |f_n - f| = \sup_{[0,1)} x^n\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x < 1\)이면 \(x^n < 1\)이므로 상한은 \(1\) 이하입니다. 한편 \(x \to 1^{-}\)일 때 \(x^n \to 1\)이므로 (거듭제곱함수의 연속성), \(1\)보다 작은 어떤 수도 상계가 될 수 없습니다. 따라서 상한은 정확히 \(1\)입니다.`,
                en: String.raw`Since \(x^n < 1\) for \(x < 1\), the supremum is at most \(1\). But \(x^n \to 1\) as \(x \to 1^{-}\) (continuity of the power function), so no number below \(1\) is an upper bound. The supremum is exactly \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`균등수렴은 \(\sup |f_n - f| \to 0\)을 요구하는데, 여기서는 모든 \(n\)에 대해 그 값이 \(1\)로 고정되어 있습니다. 따라서 \((x^n)\)은 균등수렴하지 않습니다.`,
                en: String.raw`Uniform convergence would require \(\sup |f_n - f| \to 0\), but here it equals \(1\) for every \(n\). Hence \((x^n)\) does not converge uniformly.`,
              },
            },
          ],
        },
        {
          id: 'uniform-limit-continuous',
          statement: {
            ko: String.raw`연속함수열이 균등수렴하면 그 극한함수도 연속임을 \(\varepsilon/3\) 논법으로 증명하세요.`,
            en: String.raw`Prove that a uniformly convergent sequence of continuous functions has a continuous limit — the \(\varepsilon/3\) argument.`,
          },
          display: [String.raw`|f(x) - f(x_0)| \leq \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} = \varepsilon`],
          preset: { n: 30, eps: 0.1 },
          presetCaption: {
            ko: String.raw`\(n = 30\) — \(x^n\)에서는 어떤 \(N\)도 모든 \(x\)에 동시에 통하지 않습니다. 균등수렴이란 바로 그 '동시성'입니다.`,
            en: String.raw`\(n = 30\) — for \(x^n\), no \(N\) works for all \(x\) at once. Uniform convergence is exactly that simultaneity.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`각 \(f_n\)이 연속이고 \(f_n \to f\)가 균등수렴한다고 하자. \(x_0\)와 \(\varepsilon > 0\)을 고정한다.`,
                en: String.raw`Let each \(f_n\) be continuous and \(f_n \to f\) uniformly. Fix \(x_0\) and \(\varepsilon > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`균등수렴에 의해 \(\sup |f_N - f| < \frac{\varepsilon}{3}\)인 \(N\)이 존재한다. 이 \(N\)을 고정한다.`,
                en: String.raw`By uniform convergence there is \(N\) with \(\sup |f_N - f| < \frac{\varepsilon}{3}\). Fix this \(N\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f_N\)은 \(x_0\)에서 연속이므로, \(|x - x_0| < \delta\)이면 \(|f_N(x) - f_N(x_0)| < \frac{\varepsilon}{3}\)인 \(\delta > 0\)이 존재한다.`,
                en: String.raw`Since \(f_N\) is continuous at \(x_0\), there is \(\delta > 0\) with \(|f_N(x) - f_N(x_0)| < \frac{\varepsilon}{3}\) whenever \(|x - x_0| < \delta\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x - x_0| < \delta\)일 때 삼각부등식으로 \(|f(x) - f(x_0)| \leq |f(x) - f_N(x)| + |f_N(x) - f_N(x_0)| + |f_N(x_0) - f(x_0)| < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\)이다. 따라서 \(f\)는 \(x_0\)에서 연속이다. \(x_0\)가 임의였으므로 \(f\)는 연속이다.`,
                en: String.raw`For \(|x - x_0| < \delta\), the triangle inequality gives \(|f(x) - f(x_0)| \leq |f(x) - f_N(x)| + |f_N(x) - f_N(x_0)| + |f_N(x_0) - f(x_0)| < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\). So \(f\) is continuous at \(x_0\), and \(x_0\) was arbitrary.`,
              },
            },
          ],
        },
      ];
