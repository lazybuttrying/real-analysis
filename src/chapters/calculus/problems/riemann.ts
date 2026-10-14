import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'third',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}\)을 이용해 \(\int_0^1 x^2\,dx = \frac13\)을 위합·아래합으로 증명하세요.`,
            en: String.raw`Use \(\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}\) to prove \(\int_0^1 x^2\,dx = \frac13\) from upper and lower sums.`,
          },
          display: [String.raw`L_n = \frac{(n-1)n(2n-1)}{6n^3} \to \frac13, \quad U_n = \frac{n(n+1)(2n+1)}{6n^3} \to \frac13`],
          preset: { n: 48 },
          presetCaption: {
            ko: String.raw`\(n = 48\): 틈 \(U - L = 1/48 \approx 0.0208\)이 \(\frac13\)을 조입니다.`,
            en: String.raw`\(n = 48\): the gap \(U - L = 1/48 \approx 0.0208\) squeezes \(\frac13\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`균등분할 \(P_n\)에서 \(x^2\)은 증가하므로, 아래합은 왼쪽 끝점, 위합은 오른쪽 끝점을 씁니다: \(L_n = \frac{1}{n^3}\sum_{k=0}^{n-1}k^2\), \(U_n = \frac{1}{n^3}\sum_{k=1}^{n}k^2\).`,
                en: String.raw`On the uniform partition \(P_n\), \(x^2\) is increasing, so the lower sum uses left endpoints and the upper sum right endpoints: \(L_n = \frac{1}{n^3}\sum_{k=0}^{n-1}k^2\), \(U_n = \frac{1}{n^3}\sum_{k=1}^{n}k^2\).`,
              },
            },
            {
              text: {
                ko: String.raw`제곱합 공식을 대입하면 \(L_n = \frac{(n-1)n(2n-1)}{6n^3}\), \(U_n = \frac{n(n+1)(2n+1)}{6n^3}\)입니다.`,
                en: String.raw`Substituting the sum-of-squares formula gives \(L_n = \frac{(n-1)n(2n-1)}{6n^3}\) and \(U_n = \frac{n(n+1)(2n+1)}{6n^3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n \to \infty\)일 때 둘 다 \(\frac{2n^3}{6n^3} = \frac13\)으로 가므로, 조임에 의해 적분값은 \(\frac13\)입니다.`,
                en: String.raw`Both tend to \(\frac{2n^3}{6n^3} = \frac13\) as \(n \to \infty\), so the integral is \(\frac13\) by squeezing.`,
              },
            },
          ],
        },
        {
          id: 'dirichlet-riemann',
          statement: {
            ko: String.raw`디리클레 함수는 리만 적분 불가능함을, 모든 분할에 대해 \(U - L = 1\)임을 보여 증명하세요.`,
            en: String.raw`Prove the Dirichlet function is not Riemann integrable by showing \(U - L = 1\) for every partition.`,
          },
          display: [String.raw`U(D,P) = 1, \quad L(D,P) = 0 \quad \text{for every } P`],
          preset: { n: 20 },
          presetCaption: {
            ko: String.raw`\(x^2\)의 위합·아래합과 대조해 보세요 — 디리클레 함수에서는 틈이 절대 좁혀지지 않습니다.`,
            en: String.raw`Contrast with the sums for \(x^2\) — for the Dirichlet function the gap never narrows.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`임의의 구간에는 유리수와 무리수가 모두 있으므로, 디리클레 함수 \(D\)에 대해 모든 소구간에서 \(\sup D = 1\), \(\inf D = 0\)입니다.`,
                en: String.raw`Every interval contains both rationals and irrationals, so on every subinterval \(\sup D = 1\) and \(\inf D = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 어떤 분할 \(P\)에 대해서도 \(U(D,P) = \sum 1\cdot\Delta x_k = 1\), \(L(D,P) = \sum 0\cdot\Delta x_k = 0\)입니다.`,
                en: String.raw`Hence for every partition \(P\), \(U(D,P) = \sum 1\cdot\Delta x_k = 1\) and \(L(D,P) = \sum 0\cdot\Delta x_k = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(U - L = 1 \not\to 0\)이므로 리만 적분 가능성의 필요충분조건을 만족하지 않습니다.`,
                en: String.raw`Since \(U - L = 1 \not\to 0\), the necessary and sufficient condition for Riemann integrability fails.`,
              },
            },
          ],
        },
        {
          id: 'refinement',
          statement: {
            ko: String.raw`분할을 세분하면 \(U - L\)이 절대 증가하지 않음을 증명하세요.`,
            en: String.raw`Prove that refining a partition never increases \(U - L\).`,
          },
          display: [String.raw`P' \supset P \;\Rightarrow\; U(f,P') \le U(f,P),\; L(f,P') \ge L(f,P)`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 분할을 잘게 쪼갤수록 틈이 단조롭게 줄어듭니다.`,
            en: String.raw`\(n = 10\): the gap shrinks monotonically as the partition refines.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`소구간 하나에 점을 추가해 둘로 나누면, 각 조각의 상한은 원래 구간의 상한 이하이므로 위합은 감소(또는 유지)합니다.`,
                en: String.raw`Splitting one subinterval in two: each piece's supremum is at most the original's, so the upper sum decreases (or stays).`,
              },
            },
            {
              text: {
                ko: String.raw`마찬가지로 하한은 증가(또는 유지)하므로 아래합은 증가합니다.`,
                en: String.raw`Likewise each piece's infimum is at least the original's, so the lower sum increases (or stays).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(U - L\)은 세분할수록 단조감소합니다 — 위합과 아래합이 서로를 향해 조여옵니다.`,
                en: String.raw`So \(U - L\) decreases monotonically under refinement — the sums squeeze toward each other.`,
              },
            },
          ],
        },
      ];
