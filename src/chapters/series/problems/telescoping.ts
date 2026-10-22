import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'partial-sums',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{N}\frac{1}{n(n+1)} = \frac{N}{N+1}\)임을 증명하고, 급수의 합이 \(1\)임을 보이세요.`,
            en: String.raw`Prove \(\sum_{n=1}^{N}\frac{1}{n(n+1)} = \frac{N}{N+1}\), so the series sums to \(1\).`,
          },
          display: [String.raw`S_N = \left(1-\frac{1}{2}\right)+\left(\frac{1}{2}-\frac{1}{3}\right)+\cdots+\left(\frac{1}{N}-\frac{1}{N+1}\right) = 1-\frac{1}{N+1}`],
          preset: { n: 24 },
          presetCaption: {
            ko: String.raw`\(N = 24\): \(S_{24} = 24/25 = 0.96\), 꼬리 \(1/25\)만 남습니다.`,
            en: String.raw`\(N = 24\): \(S_{24} = 24/25 = 0.96\), only the tail \(1/25\) remains.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\frac{1}{n(n+1)} = \frac{1}{n}-\frac{1}{n+1}\)입니다 (통분하면 확인됩니다).`,
                en: String.raw`\(\frac{1}{n(n+1)} = \frac{1}{n}-\frac{1}{n+1}\) (check by clearing denominators).`,
              },
            },
            {
              text: {
                ko: String.raw`합하면 이웃 항이 소거됩니다: \(S_N = 1 - \frac{1}{N+1} = \frac{N}{N+1}\).`,
                en: String.raw`Summing telescopes the neighbors away: \(S_N = 1 - \frac{1}{N+1} = \frac{N}{N+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N \to \infty\)에서 \(\frac{1}{N+1} \to 0\)이므로 급수의 합은 \(1\)입니다.`,
                en: String.raw`As \(N \to \infty\), \(\frac{1}{N+1} \to 0\), so the series sums to \(1\).`,
              },
            },
          ],
        },
        {
          id: 'shifted',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\frac{1}{n(n+2)} = \frac{3}{4}\)를 증명하세요.`,
            en: String.raw`Prove \(\sum_{n=1}^{\infty}\frac{1}{n(n+2)} = \frac{3}{4}\).`,
          },
          display: [String.raw`\frac{1}{n(n+2)}=\frac{1}{2}\left(\frac{1}{n}-\frac{1}{n+2}\right)`],
          preset: { n: 24 },
          presetCaption: {
            ko: String.raw`이웃이 아닌 두 칸 건너 항이 소거됩니다.`,
            en: String.raw`Cancellation skips one neighbor this time.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`부분분수: \(\frac{1}{n(n+2)} = \frac{1}{2}\left(\frac{1}{n}-\frac{1}{n+2}\right)\)입니다.`,
                en: String.raw`Partial fractions: \(\frac{1}{n(n+2)} = \frac{1}{2}\left(\frac{1}{n}-\frac{1}{n+2}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(S_N = \frac{1}{2}\left[\left(1+\frac{1}{2}+\cdots+\frac{1}{N}\right)-\left(\frac{1}{3}+\cdots+\frac{1}{N+2}\right)\right] = \frac{1}{2}\left(1+\frac{1}{2}-\frac{1}{N+1}-\frac{1}{N+2}\right)\)입니다.`,
                en: String.raw`\(S_N = \frac{1}{2}\left[\left(1+\frac{1}{2}+\cdots+\frac{1}{N}\right)-\left(\frac{1}{3}+\cdots+\frac{1}{N+2}\right)\right] = \frac{1}{2}\left(1+\frac{1}{2}-\frac{1}{N+1}-\frac{1}{N+2}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N \to \infty\)에서 꼬리가 사라져 \(\frac{1}{2}\cdot\frac{3}{2} = \frac{3}{4}\)가 됩니다.`,
                en: String.raw`As \(N \to \infty\) the tail vanishes, leaving \(\frac{1}{2}\cdot\frac{3}{2} = \frac{3}{4}\).`,
              },
            },
          ],
        },
        {
          id: 'sqrt-diverges',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\left(\sqrt{n+1}-\sqrt{n}\right)\)이 발산함을 보이세요.`,
            en: String.raw`Show \(\sum_{n=1}^{\infty}\left(\sqrt{n+1}-\sqrt{n}\right)\) diverges.`,
          },
          display: [String.raw`S_N = \sqrt{N+1}-1 \to \infty`],
          preset: { n: 24 },
          presetCaption: {
            ko: String.raw`망원합이지만, 소거 후 남는 것이 무한대로 갑니다.`,
            en: String.raw`Telescoping — but the survivor goes to infinity.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S_N = (\sqrt{2}-\sqrt{1})+(\sqrt{3}-\sqrt{2})+\cdots+(\sqrt{N+1}-\sqrt{N}) = \sqrt{N+1}-1\)입니다.`,
                en: String.raw`\(S_N = (\sqrt{2}-\sqrt{1})+(\sqrt{3}-\sqrt{2})+\cdots+(\sqrt{N+1}-\sqrt{N}) = \sqrt{N+1}-1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sqrt{N+1} \to \infty\)이므로 부분합은 유계가 아닙니다.`,
                en: String.raw`Since \(\sqrt{N+1} \to \infty\), the partial sums are unbounded.`,
              },
            },
            {
              text: {
                ko: String.raw`망원합이라고 항상 수렴하는 것은 아닙니다: 일반 망원합 \(S_N = b_{N+1} - b_1\)은 \((b_n)\)이 유한 극한으로 수렴할 때 그때만 수렴합니다.

여기서는 \(b_n = \sqrt{n} \to \infty\)이므로 발산합니다.

(앞 문제의 \(S_N = 1 - \frac{1}{N+1} \to 1 \ne 0\)이 수렴하는 예가 보여주듯, "남는 항이 \(0\)으로 간다"는 기준은 거짓입니다.)`,
                en: String.raw`Telescoping does not always converge: a general telescoping sum \(S_N = b_{N+1} - b_1\) converges if and only if \((b_n)\) converges to a finite limit.

Here \(b_n = \sqrt{n} \to \infty\), so it diverges.

(The criterion "the surviving term must tend to \(0\)" is false — the previous problem's \(S_N = 1 - \frac{1}{N+1} \to 1 \ne 0\) is a convergent counterexample.)`,
              },
            },
          ],
        },
      ];
