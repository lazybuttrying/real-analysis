import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'mct-example',
          statement: {
            ko: String.raw`\(a_n = 1 - \frac{1}{n}\)이 증가수열이며 \(\sup = 1\)임을 보이고, 단조수렴 정리로부터 \(a_n \to 1\)을 결론지으세요.`,
            en: String.raw`Show \(a_n = 1 - \frac{1}{n}\) is increasing with \(\sup = 1\), and conclude \(a_n \to 1\) from the Monotone Convergence Theorem.`,
          },
          display: [String.raw`a_{n+1} - a_n = \frac{1}{n(n+1)} > 0, \qquad \sup a_n = 1`],
          preset: { n: 8, tailN: 4 },
          presetCaption: {
            ko: String.raw`\(n = 8\)항: 이 문제의 수열에서는 \(a_8 = 1 - \frac{1}{8} = 0.875\)입니다. 장면이 표시하는 수열은 \(1 - 2^{-n}\) (\(n = 8\)에서 \(0.99609375\))으로, 같은 방식으로 \(1\)에 다가갑니다.`,
            en: String.raw`\(n = 8\) terms: for this problem's sequence, \(a_8 = 1 - \frac{1}{8} = 0.875\). The scene displays \(1 - 2^{-n}\) (\(0.99609375\) at \(n = 8\)), which approaches \(1\) the same way.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`(단조성) \(a_{n+1} - a_n = \left(1 - \frac{1}{n+1}\right) - \left(1 - \frac{1}{n}\right) = \frac{1}{n} - \frac{1}{n+1} = \frac{1}{n(n+1)} > 0\)이므로 증가수열입니다.`,
                en: String.raw`(Monotone) \(a_{n+1} - a_n = \left(1 - \frac{1}{n+1}\right) - \left(1 - \frac{1}{n}\right) = \frac{1}{n} - \frac{1}{n+1} = \frac{1}{n(n+1)} > 0\), so the sequence increases.`,
              },
            },
            {
              text: {
                ko: String.raw`(유계) 모든 \(n\)에 대해 \(a_n = 1 - \frac{1}{n} < 1\)이므로 \(1\)은 상계입니다. \(u < 1\)인 임의의 실수에 대해 \(1 - \frac{1}{n} > u \iff n > \frac{1}{1-u}\)인데, 아르키메데스 성질에 의해 그런 \(n\)이 존재하므로 \(u\)는 상계가 아닙니다.

따라서 \(\sup a_n = 1\)입니다.`,
                en: String.raw`(Bounded) \(a_n = 1 - \frac{1}{n} < 1\) for every \(n\), so \(1\) is an upper bound. For any real \(u < 1\), \(1 - \frac{1}{n} > u \iff n > \frac{1}{1-u}\), and such an \(n\) exists by the Archimedean property, so \(u\) is not an upper bound.

Hence \(\sup a_n = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`단조수렴 정리(인용)에 의해 증가·위로 유계인 수열은 상한으로 수렴하므로, \(a_n \to 1\)입니다.`,
                en: String.raw`By the Monotone Convergence Theorem (cited), an increasing bounded-above sequence converges to its supremum, so \(a_n \to 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`수치 확인: \(n = 40\)이면 \(a_{40} = 1 - \frac{1}{40} = 0.975\)로, 이미 극한 \(1\)에서 \(0.025\) 안에 들어옵니다.`,
                en: String.raw`Numerically: at \(n = 40\), \(a_{40} = 1 - \frac{1}{40} = 0.975\), already within \(0.025\) of the limit \(1\).`,
              },
            },
          ],
        },
        {
          id: 'cauchy-bounded',
          statement: {
            ko: String.raw`모든 코시수열이 유계임을 증명하세요.`,
            en: String.raw`Prove that every Cauchy sequence is bounded.`,
          },
          display: [String.raw`m \geq N \Rightarrow \lvert a_m\rvert \leq \lvert a_N\rvert + 1`],
          preset: { n: 12, tailN: 6 },
          presetCaption: {
            ko: String.raw`꼬리 시작 \(6\) — \(N\) 이후의 꼬리는 반지름 \(1\)짜리 띠 안에 갇힙니다.`,
            en: String.raw`Tail start \(6\) — past \(N\) the tail is trapped in a band of radius \(1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((a_n)\)이 코시수열이라 하자. \(\varepsilon = 1\)에 대해 \(m, n \geq N\)이면 \(\lvert a_m - a_n\rvert < 1\)인 \(N\)이 존재합니다.

이 \(N\)을 고정합니다.`,
                en: String.raw`Let \((a_n)\) be Cauchy. For \(\varepsilon = 1\) there is \(N\) with \(\lvert a_m - a_n\rvert < 1\) whenever \(m, n \geq N\).

Fix this \(N\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(m \geq N\)이면 삼각부등식으로 \(\lvert a_m\rvert \leq \lvert a_N\rvert + \lvert a_m - a_N\rvert < \lvert a_N\rvert + 1\)입니다 — 꼬리 전체가 하나의 수로 묶입니다.`,
                en: String.raw`For \(m \geq N\), the triangle inequality gives \(\lvert a_m\rvert \leq \lvert a_N\rvert + \lvert a_m - a_N\rvert < \lvert a_N\rvert + 1\) — the whole tail is bound by one number.`,
              },
            },
            {
              text: {
                ko: String.raw`앞부분 \(a_1, \dots, a_{N-1}\)은 유한 개이므로, \(M = \max(\lvert a_1\rvert, \dots, \lvert a_{N-1}\rvert, \lvert a_N\rvert + 1)\)이라 두면 모든 \(n\)에 대해 \(\lvert a_n\rvert \leq M\)입니다. 따라서 \((a_n)\)은 유계입니다.`,
                en: String.raw`The head \(a_1, \dots, a_{N-1}\) has finitely many terms, so with \(M = \max(\lvert a_1\rvert, \dots, \lvert a_{N-1}\rvert, \lvert a_N\rvert + 1)\) we have \(\lvert a_n\rvert \leq M\) for every \(n\). Hence \((a_n)\) is bounded.`,
              },
            },
            {
              text: {
                ko: String.raw`수치 확인: 이 장면의 수열 \(a_n = 1 - 2^{-n}\)에서는 \(\varepsilon = 1\)에 대해 \(N = 1\)로 충분하고(\(\lvert a_m - a_1\rvert < \frac12 < 1\)), \(M = \lvert a_1\rvert + 1 = 1.5\)가 전체를 묶습니다.`,
                en: String.raw`Numerically: for this scene's \(a_n = 1 - 2^{-n}\), \(N = 1\) works for \(\varepsilon = 1\) (since \(\lvert a_m - a_1\rvert < \frac12 < 1\)), and \(M = \lvert a_1\rvert + 1 = 1.5\) bounds everything.`,
              },
            },
          ],
        },
        {
          id: 'partial-sums-cauchy',
          statement: {
            ko: String.raw`부분합 \(s_N = \sum_{k=1}^{N} 2^{-k}\)가 코시수열임을 증명하세요.`,
            en: String.raw`Prove that the partial sums \(s_N = \sum_{k=1}^{N} 2^{-k}\) form a Cauchy sequence.`,
          },
          display: [String.raw`s_N = 1 - 2^{-N}, \qquad \lvert s_m - s_n\rvert = 2^{-n} - 2^{-m} < 2^{-n}`],
          preset: { n: 8, tailN: 4 },
          presetCaption: {
            ko: String.raw`부분합이 바로 이 장면의 수열입니다: \(\sum_{k=1}^{n} 2^{-k} = 1 - 2^{-n}\).`,
            en: String.raw`The partial sums are exactly this scene's sequence: \(\sum_{k=1}^{n} 2^{-k} = 1 - 2^{-n}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`등비급수 합: \((1 - \frac12)\sum_{k=1}^{N} 2^{-k} = \sum_{k=1}^{N}(2^{-k} - 2^{-(k+1)}) = \frac12 - 2^{-(N+1)}\) (망원합)이므로, \(s_N = 1 - 2^{-N}\)입니다.`,
                en: String.raw`Geometric sum: \((1 - \frac12)\sum_{k=1}^{N} 2^{-k} = \sum_{k=1}^{N}(2^{-k} - 2^{-(k+1)}) = \frac12 - 2^{-(N+1)}\) (telescoping), so \(s_N = 1 - 2^{-N}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(m > n\)이면 같은 망원합으로 \(s_m - s_n = \sum_{k=n+1}^{m} 2^{-k} = 2^{-n} - 2^{-m}\)이므로, \(\lvert s_m - s_n\rvert = 2^{-n} - 2^{-m} < 2^{-n}\)입니다.`,
                en: String.raw`For \(m > n\), the same telescoping gives \(s_m - s_n = \sum_{k=n+1}^{m} 2^{-k} = 2^{-n} - 2^{-m}\), so \(\lvert s_m - s_n\rvert = 2^{-n} - 2^{-m} < 2^{-n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(2^{-N} < \varepsilon\)인 \(N\)을 잡습니다 (\(N > \log_2 \frac{1}{\varepsilon}\)). \(m, n \geq N\)이라 합시다.

\(m = n\)이면 \(\lvert s_m - s_n\rvert = 0 < \varepsilon\)입니다. 그 외의 경우 대칭성 \(\lvert s_m - s_n\rvert = \lvert s_n - s_m\rvert\)에 의해 일반성을 잃지 않고 \(m > n\)이라 둘 수 있고, 2단계에서 \(\lvert s_m - s_n\rvert < 2^{-n} \le 2^{-N} < \varepsilon\)를 얻습니다. 따라서 \((s_N)\)은 코시수열입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), choose \(N\) with \(2^{-N} < \varepsilon\) (\(N > \log_2 \frac{1}{\varepsilon}\)). Let \(m, n \geq N\).

If \(m = n\) then \(\lvert s_m - s_n\rvert = 0 < \varepsilon\). Otherwise, by symmetry \(\lvert s_m - s_n\rvert = \lvert s_n - s_m\rvert\), so assume without loss of generality \(m > n\); step 2 then gives \(\lvert s_m - s_n\rvert < 2^{-n} \le 2^{-N} < \varepsilon\). Hence \((s_N)\) is Cauchy.`,
              },
            },
            {
              text: {
                ko: String.raw`수치 확인: 꼬리 시작 \(4\), 인덱스 \(\leq 12\)에서 꼬리 지름은 \(2^{-4} - 2^{-12} = 0.0625 - 0.000244140625 = 0.062255859375\) — 장면의 판독값과 일치합니다.`,
                en: String.raw`Numerically: with tail start \(4\) and indices \(\leq 12\), the tail diameter is \(2^{-4} - 2^{-12} = 0.0625 - 0.000244140625 = 0.062255859375\) — matching the scene's readout.`,
              },
            },
          ],
        },
      ];
