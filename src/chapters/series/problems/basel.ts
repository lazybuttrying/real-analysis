import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'tail-bound',
          statement: {
            ko: String.raw`꼬리합 \(R_N = \sum_{n>N}\frac{1}{n^2}\)에 대해 \(R_N < \frac{1}{N}\)을 증명하세요.`,
            en: String.raw`Prove the tail bound \(R_N = \sum_{n>N}\frac{1}{n^2} < \frac{1}{N}\).`,
          },
          display: [String.raw`R_N < \sum_{n>N}\left(\frac{1}{n-1}-\frac{1}{n}\right) = \frac{1}{N}`],
          preset: { n: 20 },
          presetCaption: {
            ko: String.raw`\(N = 20\): 실제 꼬리 \(\approx 0.0488 < 1/20 = 0.05\).`,
            en: String.raw`\(N = 20\): the actual tail \(\approx 0.0488 < 1/20 = 0.05\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(n \ge 2\)에서 \(\frac{1}{n^2} < \frac{1}{n(n-1)} = \frac{1}{n-1}-\frac{1}{n}\)입니다.`,
                en: String.raw`For \(n \ge 2\), \(\frac{1}{n^2} < \frac{1}{n(n-1)} = \frac{1}{n-1}-\frac{1}{n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`유한합은 망원합입니다: \(\sum_{n=N+1}^{M}\left(\frac{1}{n-1}-\frac{1}{n}\right) = \frac{1}{N}-\frac{1}{M} < \frac{1}{N}\). \(M \to \infty\)로만 보내면 \(R_N \le \frac{1}{N}\)까지만 얻어집니다. 엄격성을 되살리려면 차이를 보세요: \(\frac{1}{n(n-1)} - \frac{1}{n^2} = \frac{1}{n^2(n-1)} > 0\)이므로, 모든 \(M\)에 대해 차이의 합은 첫 항 이상입니다: \(\sum_{n=N+1}^{M}\left(\frac{1}{n(n-1)} - \frac{1}{n^2}\right) \ge \frac{1}{N(N+1)^2} > 0\). 따라서 \(\sum_{n=N+1}^{M}\frac{1}{n^2} \le \frac{1}{N} - \frac{1}{M} - \frac{1}{N(N+1)^2}\)이고, \(M \to \infty\)로 보내면 \(R_N \le \frac{1}{N} - \frac{1}{N(N+1)^2} < \frac{1}{N}\)입니다.`,
                en: String.raw`The finite sum telescopes: \(\sum_{n=N+1}^{M}\left(\frac{1}{n-1}-\frac{1}{n}\right) = \frac{1}{N}-\frac{1}{M} < \frac{1}{N}\). Letting \(M \to \infty\) alone gives only \(R_N \le \frac{1}{N}\). To restore strictness, note the difference: \(\frac{1}{n(n-1)} - \frac{1}{n^2} = \frac{1}{n^2(n-1)} > 0\), so for every \(M\) the difference sum is at least its first term: \(\sum_{n=N+1}^{M}\left(\frac{1}{n(n-1)} - \frac{1}{n^2}\right) \ge \frac{1}{N(N+1)^2} > 0\). Hence \(\sum_{n=N+1}^{M}\frac{1}{n^2} \le \frac{1}{N} - \frac{1}{M} - \frac{1}{N(N+1)^2}\), and letting \(M \to \infty\) gives \(R_N \le \frac{1}{N} - \frac{1}{N(N+1)^2} < \frac{1}{N}\).`,
              },
            },
            {
              text: {
                ko: String.raw`예를 들어 \(N = 20\)이면 꼬리가 \(0.05\) 미만 — 부분합 \(S_{20}\)은 이미 극한의 \(0.05\) 이내에 있습니다.`,
                en: String.raw`For example with \(N = 20\) the tail is below \(0.05\) — the partial sum \(S_{20}\) is already within \(0.05\) of the limit.`,
              },
            },
          ],
        },
        {
          id: 'even-terms',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{\pi^2}{24}\)임을 바젤 문제의 결과로부터 유도하세요.`,
            en: String.raw`Derive \(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{\pi^2}{24}\) from the Basel sum.`,
          },
          display: [String.raw`\sum_{n=1}^{\infty}\frac{1}{(2n)^2}=\frac{1}{4}\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{24}`],
          preset: { n: 40 },
          presetCaption: {
            ko: String.raw`짝수 항만 모아도 같은 모양으로 수렴합니다.`,
            en: String.raw`The even terms alone converge the same way.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\frac{1}{(2n)^2} = \frac{1}{4}\cdot\frac{1}{n^2}\)입니다.`,
                en: String.raw`\(\frac{1}{(2n)^2} = \frac{1}{4}\cdot\frac{1}{n^2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`양항급수이므로 상수를 밖으로 꺼낼 수 있어, \(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{1}{4}\sum_{n=1}^{\infty}\frac{1}{n^2} = \frac{1}{4}\cdot\frac{\pi^2}{6} = \frac{\pi^2}{24}\)입니다.`,
                en: String.raw`For a positive-term series constants factor out, so \(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{1}{4}\sum_{n=1}^{\infty}\frac{1}{n^2} = \frac{1}{4}\cdot\frac{\pi^2}{6} = \frac{\pi^2}{24}\).`,
              },
            },
          ],
        },
        {
          id: 'odd-terms',
          statement: {
            ko: String.raw`홀수 항의 합 \(\sum_{k=0}^{\infty}\frac{1}{(2k+1)^2} = \frac{\pi^2}{8}\)을 유도하세요.`,
            en: String.raw`Derive \(\sum_{k=0}^{\infty}\frac{1}{(2k+1)^2} = \frac{\pi^2}{8}\).`,
          },
          display: [String.raw`\sum_{\mathrm{odd}}\frac{1}{n^2}=\frac{\pi^2}{6}-\frac{\pi^2}{24}=\frac{\pi^2}{8}`],
          preset: { n: 40 },
          presetCaption: {
            ko: String.raw`전체에서 짝수 항을 빼면 홀수 항만 남습니다.`,
            en: String.raw`Subtracting the even terms leaves exactly the odd ones.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`양항급수는 (짝수 항의 합) + (홀수 항의 합)으로 나눌 수 있습니다.`,
                en: String.raw`A positive-term series splits into (even terms) + (odd terms).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 홀수 항의 합 \(= \frac{\pi^2}{6} - \frac{\pi^2}{24} = \frac{4\pi^2-\pi^2}{24} = \frac{3\pi^2}{24} = \frac{\pi^2}{8}\)입니다.`,
                en: String.raw`Hence the odd sum \(= \frac{\pi^2}{6} - \frac{\pi^2}{24} = \frac{4\pi^2-\pi^2}{24} = \frac{3\pi^2}{24} = \frac{\pi^2}{8}\).`,
              },
            },
          ],
        },
      ];
