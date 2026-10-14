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
                ko: String.raw`앞 문제의 공식에 \(r = \frac{1}{10}\): 합 \(= 9\cdot\frac{1/10}{1-1/10} = 9\cdot\frac{1}{9} = 1\)입니다.`,
                en: String.raw`By the previous formula with \(r = \frac{1}{10}\): the sum \(= 9\cdot\frac{1/10}{1-1/10} = 9\cdot\frac{1}{9} = 1\).`,
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
