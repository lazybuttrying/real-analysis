import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'babylonian-x5',
          statement: {
            ko: String.raw`\(x_0 = 1\), \(x_{n+1} = \frac{x_n + 2/x_n}{2}\)이라 할 때 \(x_5\)를 정확한 분수로 구하고, \(|x_5 - \sqrt{2}| < 10^{-24}\)임을 증명하세요.`,
            en: String.raw`With \(x_0 = 1\) and \(x_{n+1} = \frac{x_n + 2/x_n}{2}\), write \(x_5\) as an exact fraction and prove \(|x_5 - \sqrt{2}| < 10^{-24}\).`,
          },
          display: [String.raw`x_5 = \frac{886731088897}{627013566048}`, String.raw`|x_5 - \sqrt{2}| < 10^{-24}`],
          preset: { n: 5 },
          presetCaption: {
            ko: String.raw`\(n = 5\) — 다섯 번 반복하면 소수점 아래 24자리가 맞습니다.`,
            en: String.raw`\(n = 5\) — five iterations get 24 decimal places right.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`분수 형태로 차례로 계산하면 \(x_1 = \frac{3}{2}\), \(x_2 = \frac{17}{12}\), \(x_3 = \frac{577}{408}\), \(x_4 = \frac{665857}{470832}\), \(x_5 = \frac{886731088897}{627013566048}\)입니다. 점화식 \(\frac{p}{q} \mapsto \frac{p^2+2q^2}{2pq}\)를 그대로 적용한 결과입니다.`,
                en: String.raw`Computing in fractions gives \(x_1 = \frac{3}{2}\), \(x_2 = \frac{17}{12}\), \(x_3 = \frac{577}{408}\), \(x_4 = \frac{665857}{470832}\), \(x_5 = \frac{886731088897}{627013566048}\), by applying \(\frac{p}{q} \mapsto \frac{p^2+2q^2}{2pq}\) at each step.`,
              },
            },
            {
              text: {
                ko: String.raw`또한 \(p_{n+1}^2 - 2q_{n+1}^2 = (p_n^2+2q_n^2)^2 - 8p_n^2q_n^2 = (p_n^2-2q_n^2)^2\)이고 \(p_1^2-2q_1^2 = 9-8 = 1\)이므로, 모든 \(n \geq 1\)에 대해 \(p_n^2-2q_n^2 = 1\)입니다. 따라서 \(\gcd(p_n,q_n)=1\) — 모두 기약분수입니다.`,
                en: String.raw`Moreover \(p_{n+1}^2 - 2q_{n+1}^2 = (p_n^2+2q_n^2)^2 - 8p_n^2q_n^2 = (p_n^2-2q_n^2)^2\), and \(p_1^2-2q_1^2 = 9-8 = 1\), so \(p_n^2-2q_n^2 = 1\) for all \(n \geq 1\). Hence \(\gcd(p_n,q_n)=1\) — every fraction is in lowest terms.`,
              },
            },
            {
              text: {
                ko: String.raw`\(e_n = x_n^2 - 2\)라 두면 직접 전개로 \(e_{n+1} = \frac{e_n^2}{4x_n^2}\)을 얻습니다. \(x_1 = \frac32 > \sqrt2\)이고 \(x_{n+1}-\sqrt2 = \frac{(x_n-\sqrt2)^2}{2x_n} \geq 0\)이므로 모든 \(n \geq 1\)에 대해 \(x_n \geq \sqrt2\)이고, 따라서 \(e_{n+1} \leq \frac{e_n^2}{8}\)입니다.`,
                en: String.raw`Put \(e_n = x_n^2 - 2\). Expanding gives \(e_{n+1} = \frac{e_n^2}{4x_n^2}\). Since \(x_1 = \frac32 > \sqrt2\) and \(x_{n+1}-\sqrt2 = \frac{(x_n-\sqrt2)^2}{2x_n} \geq 0\), we have \(x_n \geq \sqrt2\) for all \(n \geq 1\), hence \(e_{n+1} \leq \frac{e_n^2}{8}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(e_1 = \frac14\), \(e_2 = \frac{1}{144}\), \(e_3 = \frac{1}{166464}\), \(e_4 = \frac{1}{221682772224} < 4.6\times 10^{-12}\)입니다. 따라서 \(e_5 \leq \frac{e_4^2}{8} < 2.7\times 10^{-24}\)이고, \(|x_5-\sqrt2| = \frac{e_5}{x_5+\sqrt2} < \frac{2.7\times 10^{-24}}{2.8} < 10^{-24}\)입니다.`,
                en: String.raw`We get \(e_1 = \frac14\), \(e_2 = \frac{1}{144}\), \(e_3 = \frac{1}{166464}\), \(e_4 = \frac{1}{221682772224} < 4.6\times 10^{-12}\). Hence \(e_5 \leq \frac{e_4^2}{8} < 2.7\times 10^{-24}\), and \(|x_5-\sqrt2| = \frac{e_5}{x_5+\sqrt2} < \frac{2.7\times 10^{-24}}{2.8} < 10^{-24}\).`,
              },
            },
          ],
        },
        {
          id: 'rational-to-e',
          statement: {
            ko: String.raw`수열 \(b_n = \left(1+\frac1n\right)^n\)의 모든 항이 유리수임을 보이고, 그 극한인 무리수 \(e\)가 \(\mathbb{Q}\)의 또 다른 '구멍'임을 설명하세요.`,
            en: String.raw`Show that every term of \(b_n = \left(1+\frac1n\right)^n\) is rational, and explain why its irrational limit \(e\) is another "hole" in \(\mathbb{Q}\).`,
          },
          display: [String.raw`b_n = \left(\frac{n+1}{n}\right)^n \in \mathbb{Q}, \qquad \lim_{n\to\infty} b_n = e \notin \mathbb{Q}`],
          preset: { n: 5 },
          presetCaption: {
            ko: String.raw`바빌로니아법 \(n=5\) — 유리수 항이 무리수 극한으로 모이는 같은 현상입니다.`,
            en: String.raw`Babylonian iterates at \(n=5\) — the same phenomenon: rational terms homing in on an irrational limit.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(b_n = \left(\frac{n+1}{n}\right)^n\)이고 \(\frac{n+1}{n}\)은 유리수입니다. 유리수의 자연수 거듭제곱은 유리수이므로 모든 \(n\)에 대해 \(b_n \in \mathbb{Q}\)입니다.`,
                en: String.raw`\(b_n = \left(\frac{n+1}{n}\right)^n\) with \(\frac{n+1}{n}\) rational. A rational number raised to a positive integer power is rational, so \(b_n \in \mathbb{Q}\) for every \(n\).`,
              },
            },
            {
              text: {
                ko: String.raw`수열 \((b_n)\)은 증가하고 위로 유계이므로(표준적인 사실로 받아들입니다) 수렴합니다. 그 극한을 \(e\)라 부릅니다.`,
                en: String.raw`The sequence \((b_n)\) is increasing and bounded above (taken as known — it is standard), hence convergent. Its limit is called \(e\).`,
              },
            },
            {
              text: {
                ko: String.raw`먼저 두 \(e\)가 같은 수임을 확인합니다. \(S = \sum_{k=0}^{\infty} \frac{1}{k!}\)라 두고, eseries 씬(compound 문제)에서처럼 이항정리로 전개하면 \(b_n = \sum_{k=0}^{n} a_{n,k}\) (단 \(a_{n,k} = \frac{1}{k!}\prod_{j=0}^{k-1}(1 - \frac{j}{n}) \le \frac{1}{k!}\))입니다. \(K \le n\)을 고정하면 \(b_n \ge \sum_{k=0}^{K} a_{n,k}\)이고, 고정된 \(k\)에 대해 \(n \to \infty\)일 때 \(a_{n,k} \to \frac{1}{k!}\)이므로 \(\liminf b_n \ge \sum_{k=0}^{K} \frac{1}{k!}\)입니다. 또한 \(b_n \le \sum_{k=0}^{n} \frac{1}{k!} \le S\)이므로 \(\limsup b_n \le S\)입니다. \(K \to \infty\)로 보내면 \(\lim b_n = S\) — 여기서 \(\lim b_n\)으로 정의한 \(e\)는 급수 \(S\)와 같은 수입니다. 두 정의가 일치하므로 \(e \notin \mathbb{Q}\)는 정식 정리입니다(예: \(e = \sum_{k=0}^{\infty}\frac{1}{k!}\)의 나머지 항 평가로 증명됩니다). 따라서 유리수 수열 \((b_n)\)은 어떤 유리수에도 수렴하지 않습니다 — \(\sqrt2\)와는 다른, \(\mathbb{Q}\)의 또 하나의 구멍입니다.`,
                en: String.raw`Identification of the two \(e\)'s first. Write \(S = \sum_{k=0}^{\infty} \frac{1}{k!}\) and expand \(b_n\) by the binomial theorem as in the eseries scene (compound problem): \(b_n = \sum_{k=0}^{n} a_{n,k}\) with \(a_{n,k} = \frac{1}{k!}\prod_{j=0}^{k-1}(1 - \frac{j}{n}) \le \frac{1}{k!}\). Fix \(K \le n\): then \(b_n \ge \sum_{k=0}^{K} a_{n,k}\), and \(a_{n,k} \to \frac{1}{k!}\) as \(n \to \infty\) for each fixed \(k\), so \(\liminf b_n \ge \sum_{k=0}^{K} \frac{1}{k!}\). Also \(b_n \le \sum_{k=0}^{n} \frac{1}{k!} \le S\), so \(\limsup b_n \le S\). Letting \(K \to \infty\) forces \(\lim b_n = S\): the \(e\) defined here as \(\lim b_n\) is the series number \(S\). With the two definitions identified, that \(e \notin \mathbb{Q}\) is an established theorem (proved, for instance, by estimating the remainder of \(e = \sum_{k=0}^{\infty}\frac{1}{k!}\)). So the rational sequence \((b_n)\) converges to no rational number — another hole in \(\mathbb{Q}\), distinct from the one at \(\sqrt2\).`,
              },
            },
          ],
        },
        {
          id: 'cauchy-no-rational-limit',
          statement: {
            ko: String.raw`바빌로니아 수열 \((x_n)\)이 코시수열이지만 \(\mathbb{Q}\) 안에는 극한이 없음을 증명하세요. 이것이 '완비성'이 말하는 바입니다.`,
            en: String.raw`Prove that the Babylonian sequence \((x_n)\) is Cauchy but has no limit in \(\mathbb{Q}\) — this is what completeness is about.`,
          },
          display: [String.raw`|x_m - x_n| \to 0 \ \ (m,n \to \infty), \qquad \nexists\, r \in \mathbb{Q} : x_n \to r`],
          preset: { n: 8 },
          presetCaption: {
            ko: String.raw`\(n=8\) — 항들은 서로 끝없이 가까워지지만, 유리수 중에는 도착지가 없습니다.`,
            en: String.raw`\(n=8\) — the terms get arbitrarily close to each other, yet no rational number is their destination.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`문제 1의 오차 분석에서 \(e_{n+1} \leq \frac{e_n^2}{8}\), \(e_1 = \frac14\)을 얻었습니다. \(e_n \leq 2^{-n}\)임을 귀납법으로 보이면(\(n=1\)일 때 성립하고, \(e_{n+1} \leq \frac{2^{-2n}}{8} = 2^{-(2n+3)} \leq 2^{-(n+1)}\)), \(e_n \to 0\)입니다. \(|x_n-\sqrt2| = \frac{e_n}{x_n+\sqrt2} \leq \frac{e_n}{2}\)이므로, 실수로서 \(x_n \to \sqrt2\)입니다.`,
                en: String.raw`From the error analysis, \(e_{n+1} \leq \frac{e_n^2}{8}\) with \(e_1 = \frac14\). Since \(e_n \leq 2^{-n}\) by induction (true at \(n=1\), and \(e_{n+1} \leq \frac{2^{-2n}}{8} = 2^{-(2n+3)} \leq 2^{-(n+1)}\)), we get \(e_n \to 0\). With \(|x_n-\sqrt2| = \frac{e_n}{x_n+\sqrt2} \leq \frac{e_n}{2}\), we have \(x_n \to \sqrt2\) as real numbers.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이라 합시다. \(x_n \to \sqrt2\)이므로 \(n \ge N\)일 때 \(|x_n - \sqrt2| < \varepsilon/2\)인 \(N\)을 잡을 수 있습니다. 그러면 \(m, n \ge N\)일 때 \(|x_m - x_n| \leq |x_m - \sqrt2| + |x_n - \sqrt2| < \varepsilon/2 + \varepsilon/2 = \varepsilon\)입니다. 즉 \((x_n)\)은 코시수열입니다.`,
                en: String.raw`Let \(\varepsilon > 0\). Since \(x_n \to \sqrt2\), choose \(N\) with \(|x_n - \sqrt2| < \varepsilon/2\) for all \(n \ge N\). Then for all \(m, n \ge N\), \(|x_m - x_n| \leq |x_m - \sqrt2| + |x_n - \sqrt2| < \varepsilon/2 + \varepsilon/2 = \varepsilon\). Hence \((x_n)\) is a Cauchy sequence.`,
              },
            },
            {
              text: {
                ko: String.raw`만약 유리수 \(r\)에 대해 \(x_n \to r\)이라면 극한의 유일성에 의해 \(r = \sqrt2\)이어야 합니다. 그런데 \(\sqrt2 \notin \mathbb{Q}\)이므로 모순입니다. 따라서 \((x_n)\)은 \(\mathbb{Q}\) 안에서 극한을 갖지 않습니다.`,
                en: String.raw`If \(x_n \to r\) for some rational \(r\), uniqueness of limits forces \(r = \sqrt2\). But \(\sqrt2 \notin \mathbb{Q}\) — a contradiction. So \((x_n)\) has no limit inside \(\mathbb{Q}\).`,
              },
            },
            {
              text: {
                ko: String.raw`참고로 \(\sqrt2 \notin \mathbb{Q}\)의 고전적 증명: \(\sqrt2 = \frac pq\) (기약분수)라 가정하면 \(p^2 = 2q^2\)이므로 \(p\)는 짝수입니다. \(p = 2k\)라 두면 \(q^2 = 2k^2\)이므로 \(q\)도 짝수 — 기약성에 모순입니다.`,
                en: String.raw`For reference, the classical proof that \(\sqrt2 \notin \mathbb{Q}\): if \(\sqrt2 = \frac pq\) in lowest terms, then \(p^2 = 2q^2\), so \(p\) is even; writing \(p = 2k\) gives \(q^2 = 2k^2\), so \(q\) is even too — contradicting lowest terms.`,
              },
              display: [String.raw`\sqrt2 = \frac pq \ \Rightarrow\ p^2 = 2q^2 \ \Rightarrow\ p, q \text{ both even, contradiction}`],
            },
          ],
        },
      ];
