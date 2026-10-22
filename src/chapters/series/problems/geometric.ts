import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'finite-formula',
          statement: {
            ko: String.raw`\(S_N = 1+r+\cdots+r^N = \frac{1-r^{N+1}}{1-r}\) (\(r \ne 1\))를 증명하고, \(|r| < 1\)일 때 \(\frac{1}{1-r}\)로 수렴함을 보이세요.`,
            en: String.raw`Prove \(S_N = 1+r+\cdots+r^N = \frac{1-r^{N+1}}{1-r}\) (\(r \ne 1\)), and convergence to \(\frac{1}{1-r}\) for \(|r| < 1\).`,
          },
          display: [String.raw`S_N - rS_N = 1 - r^{N+1}`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`\(r = \frac{1}{2}\): 빈틈 \((1/2)^{12}\)만 남습니다.`,
            en: String.raw`\(r = \frac{1}{2}\): only the gap \((1/2)^{12}\) remains.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S_N - rS_N = (1+r+\cdots+r^N) - (r+\cdots+r^{N+1}) = 1-r^{N+1}\)입니다. 중간 항이 모두 소거됩니다.`,
                en: String.raw`\(S_N - rS_N = (1+r+\cdots+r^N) - (r+\cdots+r^{N+1}) = 1-r^{N+1}\). Everything in the middle cancels.`,
              },
            },
            {
              text: {
                ko: String.raw`\(r \ne 1\)이면 \(S_N = \frac{1-r^{N+1}}{1-r}\)입니다.`,
                en: String.raw`If \(r \ne 1\), \(S_N = \frac{1-r^{N+1}}{1-r}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|r| < 1\)이면 \(r^{N+1} \to 0\)이므로 \(S_N \to \frac{1}{1-r}\)입니다.`,
                en: String.raw`If \(|r| < 1\), \(r^{N+1} \to 0\), so \(S_N \to \frac{1}{1-r}\).`,
              },
            },
          ],
        },
        {
          id: 'nine-nines',
          statement: {
            ko: String.raw`\(0.999\cdots = 1\)임을 기하급수로 증명하세요.`,
            en: String.raw`Prove \(0.999\ldots = 1\) via the geometric series.`,
          },
          display: [String.raw`0.999\cdots = 9\sum_{k=1}^{\infty}\left(\frac{1}{10}\right)^k = 9\cdot\frac{1/10}{1-1/10} = 1`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`같은 대수, \(r = \frac{1}{10}\) 버전입니다.`,
            en: String.raw`The same algebra with \(r = \frac{1}{10}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(0.999\cdots = \frac{9}{10}+\frac{9}{100}+\cdots = 9\sum_{k=1}^{\infty}\left(\frac{1}{10}\right)^k\)입니다.`,
                en: String.raw`\(0.999\cdots = \frac{9}{10}+\frac{9}{100}+\cdots = 9\sum_{k=1}^{\infty}\left(\frac{1}{10}\right)^k\).`,
              },
            },
            {
              text: {
                ko: String.raw`앞 문제의 공식 \(\sum_{k=0}^{\infty} r^k = \frac{1}{1-r}\)에서 \(k = 0\) 항 \(1\)을 빼면 \(\sum_{k=1}^{\infty} r^k = \frac{1}{1-r} - 1 = \frac{r}{1-r}\)입니다 (또는 \(r\)을 factor로 묶습니다). \(r = \frac{1}{10}\)을 대입하면 합 \(= 9\cdot\frac{1/10}{1-1/10} = 9\cdot\frac{1}{9} = 1\)입니다.`,
                en: String.raw`From the previous formula \(\sum_{k=0}^{\infty} r^k = \frac{1}{1-r}\), subtract the \(k = 0\) term \(1\) to get \(\sum_{k=1}^{\infty} r^k = \frac{1}{1-r} - 1 = \frac{r}{1-r}\) (equivalently, factor out \(r\)). With \(r = \frac{1}{10}\): the sum \(= 9\cdot\frac{1/10}{1-1/10} = 9\cdot\frac{1}{9} = 1\).`,
              },
            },
          ],
        },
        {
          id: 'n-over-2n',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\frac{n}{2^n} = 2\)를 \(S - \frac{S}{2}\) 트릭으로 증명하세요.`,
            en: String.raw`Prove \(\sum_{n=1}^{\infty}\frac{n}{2^n} = 2\) with the \(S - \frac{S}{2}\) trick.`,
          },
          display: [String.raw`S - \frac{S}{2} = \sum_{n=1}^{\infty}\frac{1}{2^n} = 1`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`가중치가 붙어도 같은 아이디어가 통합니다.`,
            en: String.raw`The same idea works with weights attached.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`먼저 급수가 절대수렴함을 보입니다: \(\frac{n}{2^n} \le \left(\frac{3}{4}\right)^n \iff n \le \left(\frac{3}{2}\right)^n\)입니다.

\(n = 4\)에서 \(4 \le \left(\frac{3}{2}\right)^4 = \frac{81}{16} = 5.0625\) ✓, 그리고 \(\left(\frac{3}{2}\right)^n \ge n\)이면 \(\left(\frac{3}{2}\right)^{n+1} = \frac{3}{2}\left(\frac{3}{2}\right)^n \ge \frac{3}{2}n = n + \frac{n}{2} \ge n+1\) (\(n \ge 2\))이므로, 귀납법으로 모든 \(n \ge 4\)에서 \(n \le \left(\frac{3}{2}\right)^n\)입니다.

따라서 \(n \ge 4\)에서 \(\frac{n}{2^n} \le \left(\frac{3}{4}\right)^n\)이고, \(\sum\left(\frac{3}{4}\right)^n\)은 공비 \(\frac34 < 1\)인 기하급수로 수렴하므로 비교판정법으로 \(\sum\frac{n}{2^n}\)은 절대수렴합니다.`,
                en: String.raw`First, absolute convergence: \(\frac{n}{2^n} \le \left(\frac{3}{4}\right)^n \iff n \le \left(\frac{3}{2}\right)^n\).

At \(n = 4\), \(4 \le \left(\frac{3}{2}\right)^4 = \frac{81}{16} = 5.0625\) ✓, and if \(\left(\frac{3}{2}\right)^n \ge n\) then \(\left(\frac{3}{2}\right)^{n+1} = \frac{3}{2}\left(\frac{3}{2}\right)^n \ge \frac{3}{2}n = n + \frac{n}{2} \ge n+1\) (\(n \ge 2\)), so by induction \(n \le \left(\frac{3}{2}\right)^n\) for all \(n \ge 4\).

Hence \(\frac{n}{2^n} \le \left(\frac{3}{4}\right)^n\) for \(n \ge 4\); since \(\sum\left(\frac{3}{4}\right)^n\) converges (geometric, ratio \(\frac34 < 1\)), the comparison test gives absolute convergence of \(\sum\frac{n}{2^n}\).`,
              },
              display: [String.raw`\frac{n}{2^n} \le \left(\frac{3}{4}\right)^n \quad (n \ge 4) \;\Longrightarrow\; \sum_{n=1}^{\infty}\frac{n}{2^n} \text{ converges absolutely}`],
            },
            {
              text: {
                ko: String.raw`\(S = \sum_{n=1}^{\infty}\frac{n}{2^n}\)라 두면, \(\frac{S}{2} = \sum_{n=1}^{\infty}\frac{n}{2^{n+1}} = \sum_{n=2}^{\infty}\frac{n-1}{2^n}\)입니다 (지표 이동).`,
                en: String.raw`Put \(S = \sum_{n=1}^{\infty}\frac{n}{2^n}\). Then \(\frac{S}{2} = \sum_{n=1}^{\infty}\frac{n}{2^{n+1}} = \sum_{n=2}^{\infty}\frac{n-1}{2^n}\) (reindexing).`,
              },
            },
            {
              text: {
                ko: String.raw`절대수렴하므로 항별 뺄셈이 정당합니다: \(S-\frac{S}{2} = \frac{1}{2}+\sum_{n=2}^{\infty}\frac{1}{2^n} = \sum_{n=1}^{\infty}\frac{1}{2^n} = 1\).`,
                en: String.raw`Absolute convergence justifies termwise subtraction: \(S-\frac{S}{2} = \frac{1}{2}+\sum_{n=2}^{\infty}\frac{1}{2^n} = \sum_{n=1}^{\infty}\frac{1}{2^n} = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\frac{S}{2} = 1\), 즉 \(S = 2\)입니다.`,
                en: String.raw`Hence \(\frac{S}{2} = 1\), i.e. \(S = 2\).`,
              },
            },
          ],
        },
      ];
