import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'ratio-factorial',
          statement: {
            ko: String.raw`비율 판정법을 진술하고, \(\sum_{k=1}^{\infty}\frac{1}{k!}\)가 수렴함을 증명하세요.`,
            en: String.raw`State the ratio test and prove \(\sum_{k=1}^{\infty}\frac{1}{k!}\) converges.`,
          },
          display: [String.raw`r_k=\frac{a_{k+1}}{a_k}=\frac{1}{k+1}\to 0<1`],
          preset: { series: 'factorial', n: 12 },
          presetCaption: {
            ko: String.raw`\(n = 12\): \(r_{12} = 1/13 \approx 0.0769\) — 0을 향해 빠르게 떨어집니다.`,
            en: String.raw`\(n = 12\): \(r_{12} = 1/13 \approx 0.0769\) — diving toward 0.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`비율 판정법: \(a_k > 0\)이고 \(r_k = \frac{a_{k+1}}{a_k} \to L < 1\)이면 \(\sum a_k\)는 수렴합니다. 실제로 \(L < \rho < 1\)인 \(\rho\)를 잡으면 어떤 \(K\)가 있어 \(k \ge K\)에서 \(r_k \le \rho\)이므로 \(a_{k+1} \le \rho a_k\)입니다. 귀납법으로 \(a_{K+j} \le \rho^j a_K\) (\(j \ge 0\))를 얻으므로, 꼬리는 \(a_{K+j} \le a_K\rho^{-K}\rho^{K+j}\)로서 수렴하는 기하급수 \(\sum \rho^k\)의 상수배 아래에 깔립니다.`,
                en: String.raw`Ratio test: if \(a_k > 0\) and \(r_k = \frac{a_{k+1}}{a_k} \to L < 1\), then \(\sum a_k\) converges. Indeed, picking \(\rho\) with \(L < \rho < 1\), there is \(K\) with \(r_k \le \rho\) for \(k \ge K\), so \(a_{k+1} \le \rho a_k\). Induction gives \(a_{K+j} \le \rho^j a_K\) for \(j \ge 0\), hence \(a_{K+j} \le a_K\rho^{-K}\rho^{K+j}\): the tail sits under a constant multiple of the convergent geometric series \(\sum \rho^k\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(a_k = \frac{1}{k!}\)이면 \(r_k = \frac{k!}{(k+1)!} = \frac{1}{k+1} \to 0\)입니다: \(r_1 = \frac{1}{2}, r_2 = \frac{1}{3}, r_3 = \frac{1}{4}, r_4 = \frac{1}{5}, r_5 = \frac{1}{6}\).`,
                en: String.raw`For \(a_k = \frac{1}{k!}\), \(r_k = \frac{k!}{(k+1)!} = \frac{1}{k+1} \to 0\): \(r_1 = \frac{1}{2}, r_2 = \frac{1}{3}, r_3 = \frac{1}{4}, r_4 = \frac{1}{5}, r_5 = \frac{1}{6}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(L = 0 < 1\)이므로 비율 판정법으로 수렴합니다. (합은 \(e - 1 \approx 1.71828\)입니다 — \(k = 0\)인 항이 \(1\)이므로.)`,
                en: String.raw`Since \(L = 0 < 1\), the ratio test gives convergence. (The sum is \(e - 1 \approx 1.71828\) — the \(k = 0\) term is \(1\).)`,
              },
            },
          ],
        },
        {
          id: 'ratio-n-over-2n',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{\infty}\frac{k}{2^k}\)가 비율 판정법으로 수렴함을 증명하세요.`,
            en: String.raw`Prove \(\sum_{k=1}^{\infty}\frac{k}{2^k}\) converges via the ratio test.`,
          },
          display: [String.raw`r_k=\frac{k+1}{2k}\to\frac{1}{2}<1`],
          preset: { series: 'n-over-2n', n: 12 },
          presetCaption: {
            ko: String.raw`\(n = 12\): \(r_{12} = 13/24 \approx 0.5417\) — \(\frac{1}{2}\)를 향해 내려갑니다.`,
            en: String.raw`\(n = 12\): \(r_{12} = 13/24 \approx 0.5417\) — descending toward \(\frac{1}{2}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_k = \frac{k}{2^k} > 0\)입니다. \(r_k = \frac{a_{k+1}}{a_k} = \frac{k+1}{2^{k+1}}\cdot\frac{2^k}{k} = \frac{k+1}{2k}\)입니다.`,
                en: String.raw`\(a_k = \frac{k}{2^k} > 0\). \(r_k = \frac{a_{k+1}}{a_k} = \frac{k+1}{2^{k+1}}\cdot\frac{2^k}{k} = \frac{k+1}{2k}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\frac{k+1}{2k} = \frac{1}{2}+\frac{1}{2k} \to \frac{1}{2}\)입니다: \(r_1 = 1, r_2 = \frac{3}{4}, r_3 = \frac{2}{3}, r_4 = \frac{5}{8}, r_5 = \frac{3}{5}\)에서 시작해 \(\frac{1}{2}\)로 내려갑니다.`,
                en: String.raw`\(\frac{k+1}{2k} = \frac{1}{2}+\frac{1}{2k} \to \frac{1}{2}\): starting from \(r_1 = 1, r_2 = \frac{3}{4}, r_3 = \frac{2}{3}, r_4 = \frac{5}{8}, r_5 = \frac{3}{5}\) and descending toward \(\frac{1}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(L = \frac{1}{2} < 1\)이므로 비율 판정법으로 수렴합니다. (합이 \(2\)라는 것은 기하급수 장면에서 보였습니다.)`,
                en: String.raw`Since \(L = \frac{1}{2} < 1\), the ratio test gives convergence. (That the sum is \(2\) was shown in the geometric scene.)`,
              },
            },
          ],
        },
        {
          id: 'comparison',
          statement: {
            ko: String.raw`비교 판정법을 진술하고, \(\sum_{k=1}^{\infty}\frac{1}{k^2+1}\)의 수렴을 증명하세요.`,
            en: String.raw`State the comparison test and prove \(\sum_{k=1}^{\infty}\frac{1}{k^2+1}\) converges.`,
          },
          display: [String.raw`\frac{1}{k^2+1}<\frac{1}{k^2},\qquad\sum_{k=1}^{\infty}\frac{1}{k^2}=\frac{\pi^2}{6}`],
          preset: { series: 'inv-square-plus', n: 12 },
          presetCaption: {
            ko: String.raw`\(n = 12\): 모든 막대에서 \(\frac{1}{k^2+1} < \frac{1}{k^2}\) — 수렴하는 급수 아래에 깔리므로 수렴합니다.`,
            en: String.raw`\(n = 12\): \(\frac{1}{k^2+1} < \frac{1}{k^2}\) at every bar — tucked under a convergent series, so it converges.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`비교 판정법: \(0 \le a_k \le b_k\)이고 \(\sum b_k\)가 수렴하면 \(\sum a_k\)도 수렴합니다 — 부분합이 단조증가하면서 \(\sum b_k\)의 합으로 유계이기 때문입니다.`,
                en: String.raw`Comparison test: if \(0 \le a_k \le b_k\) and \(\sum b_k\) converges, then \(\sum a_k\) converges — its partial sums increase and are bounded by the sum of \(\sum b_k\).`,
              },
            },
            {
              text: {
                ko: String.raw`모든 \(k \ge 1\)에서 분모가 더 크므로 \(\frac{1}{k^2+1} < \frac{1}{k^2}\)입니다.`,
                en: String.raw`Since the denominator is larger, \(\frac{1}{k^2+1} < \frac{1}{k^2}\) for every \(k \ge 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sum_{k=1}^{\infty}\frac{1}{k^2} = \frac{\pi^2}{6}\)은 수렴합니다 (바젤 장면의 결과). 따라서 비교 판정법으로 \(\sum_{k=1}^{\infty}\frac{1}{k^2+1}\)도 수렴합니다.`,
                en: String.raw`\(\sum_{k=1}^{\infty}\frac{1}{k^2} = \frac{\pi^2}{6}\) converges (the Basel scene's result). Hence \(\sum_{k=1}^{\infty}\frac{1}{k^2+1}\) converges by comparison.`,
              },
            },
          ],
        },
      ];
