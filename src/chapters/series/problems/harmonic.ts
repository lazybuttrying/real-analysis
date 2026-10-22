import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'oresme',
          statement: {
            ko: String.raw`\(2^m\)개의 항까지의 부분합이 \(1 + \frac{m}{2}\) 이상임을 오레스메 묶음으로 보이고, 조화급수가 발산함을 증명하세요.`,
            en: String.raw`Use Oresme's grouping to show \(S_{2^m} \ge 1 + \frac{m}{2}\), proving the harmonic series diverges.`,
          },
          display: [String.raw`S_{2^m} \ge 1 + \frac{m}{2} \to \infty`],
          preset: { n: 1024, logX: true },
          presetCaption: {
            ko: String.raw`\(n = 1024 = 2^{10}\) — 오레스메 하한 \(1 + 10/2 = 6\) 위에서 자랍니다.`,
            en: String.raw`\(n = 1024 = 2^{10}\) — growing above the Oresme bound \(1 + 10/2 = 6\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`항들을 묶습니다: \(\frac{1}{3}+\frac{1}{4} > \frac{1}{4}+\frac{1}{4} = \frac{1}{2}\), \(\frac{1}{5}+\cdots+\frac{1}{8} > 4\cdot\frac{1}{8} = \frac{1}{2}\). 일반적으로 \(m \ge 2\)에서 \(\frac{1}{2^{m-1}+1}+\cdots+\frac{1}{2^m} > 2^{m-1}\cdot\frac{1}{2^m} = \frac{1}{2}\)입니다 (\(m = 1\)인 block은 항 \(\frac{1}{2}\) 하나뿐이라 별도로 계산하며, strict inequality가 성립하지 않습니다).`,
                en: String.raw`Group the terms: \(\frac{1}{3}+\frac{1}{4} > \frac{1}{4}+\frac{1}{4} = \frac{1}{2}\), \(\frac{1}{5}+\cdots+\frac{1}{8} > 4\cdot\frac{1}{8} = \frac{1}{2}\). In general, for \(m \ge 2\), \(\frac{1}{2^{m-1}+1}+\cdots+\frac{1}{2^m} > 2^{m-1}\cdot\frac{1}{2^m} = \frac{1}{2}\) (the \(m = 1\) block is the single term \(\frac{1}{2}\), computed separately; the strict inequality does not hold there).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(S_{2^m} = 1 + \frac{1}{2} + \left(\frac{1}{3}+\frac{1}{4}\right) + \cdots \ge 1 + m\cdot\frac{1}{2} = 1 + \frac{m}{2}\)입니다.`,
                en: String.raw`Hence \(S_{2^m} = 1 + \frac{1}{2} + \left(\frac{1}{3}+\frac{1}{4}\right) + \cdots \ge 1 + m\cdot\frac{1}{2} = 1 + \frac{m}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(m \to \infty\)이면 우변이 무한대로 가므로 \((S_n)\)은 유계가 아닙니다. 단조증가 수열이 유계가 아니면 발산하므로, 조화급수는 발산합니다.`,
                en: String.raw`As \(m \to \infty\) the bound is unbounded, so \((S_n)\) is unbounded. An increasing unbounded sequence diverges, so the harmonic series diverges.`,
              },
            },
          ],
        },
        {
          id: 'alternating',
          statement: {
            ko: String.raw`교대조화급수 \(\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}\)가 수렴함을 교대급수 판정법으로 증명하세요.

(합이 \(\ln 2\)라는 것은 알려진 사실로 둡니다.)`,
            en: String.raw`Prove the alternating harmonic series \(\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}\) converges via the alternating series test.

(Its sum \(\ln 2\) is taken as known.)`,
          },
          display: [String.raw`\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n} = 1-\frac{1}{2}+\frac{1}{3}-\cdots`],
          preset: { n: 10000, logX: true },
          presetCaption: {
            ko: String.raw`대조용: 부호 없이 더하면 \(S_n\)은 끝없이 자라지만, 부호를 번갈면 수렴합니다.`,
            en: String.raw`For contrast: without alternating signs \(S_n\) grows without bound; with them it converges.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`교대급수 판정법: \(b_n \downarrow 0\)이면 \(\sum_{n=1}^{\infty}(-1)^{n+1}b_n\)이 수렴합니다. 여기서는 \(b_n = \frac{1}{n}\)이 감소하며 \(0\)으로 갑니다.`,
                en: String.raw`Alternating series test: if \(b_n \downarrow 0\) then \(\sum_{n=1}^{\infty}(-1)^{n+1}b_n\) converges. Here \(b_n = \frac{1}{n}\) decreases to \(0\).`,
              },
            },
            {
              text: {
                ko: String.raw`직접 보이면: 짝수 부분합 \(T_{2m} = \left(1-\frac{1}{2}\right)+\left(\frac{1}{3}-\frac{1}{4}\right)+\cdots\)는 각 괄호가 양수이므로 증가하고 \(T_{2m} < 1\)로 유계이니 수렴합니다. 홀수 부분합 \(T_{2m+1} = T_{2m}+\frac{1}{2m+1}\)은 같은 극한으로 갑니다.`,
                en: String.raw`Directly: the even partial sums \(T_{2m} = \left(1-\frac{1}{2}\right)+\left(\frac{1}{3}-\frac{1}{4}\right)+\cdots\) group into positive pairs, so they increase and are bounded by \(1\), hence converge. The odd partial sums \(T_{2m+1} = T_{2m}+\frac{1}{2m+1}\) tend to the same limit.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 교대조화급수는 수렴합니다. (합이 \(\ln 2\)라는 것은 여기서 증명하지 않습니다.)`,
                en: String.raw`Hence the alternating harmonic series converges. (That its sum is \(\ln 2\) is not proved here.)`,
              },
            },
          ],
        },
        {
          id: 'p-series',
          statement: {
            ko: String.raw`\(p\)-급수 \(\sum_{n=1}^{\infty}\frac{1}{n^p}\)가 \(p > 1\)일 때 수렴하고 \(p \le 1\)일 때 발산함을 적분 판정법으로 증명하세요.`,
            en: String.raw`Prove by the integral test that \(\sum_{n=1}^{\infty}\frac{1}{n^p}\) converges if and only if \(p > 1\).`,
          },
          display: [String.raw`\sum_{n=1}^{N}\frac{1}{n^p} \le 1 + \int_{1}^{N}\frac{dx}{x^p}`],
          preset: { n: 100000, logX: true },
          presetCaption: {
            ko: String.raw`\(p = 1\)인 경우: 적분 판정법의 발산 쪽을 보여줍니다.`,
            en: String.raw`The case \(p = 1\): the divergent side of the integral test.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`먼저 \(p \le 0\)인 경우를 분리합니다: 이때 \(\frac{1}{n^p} = n^{-p} \ge 1\)이라 일반항이 \(0\)으로 가지 않으므로 term test로 발산합니다 (이 범위에서는 \(f(x) = x^{-p}\)가 decreasing이 아니므로 아래 적분 비교를 적용하지 않습니다).

이제 \(p > 0\)인 경우만 다루면 \(f(x) = \frac{1}{x^p}\)는 양의 감소함수입니다.

\(n \ge 2\)에서 \(\frac{1}{n^p} \le \int_{n-1}^{n}\frac{dx}{x^p}\)이므로, \(S_N \le 1 + \int_{1}^{N}\frac{dx}{x^p}\)입니다.`,
                en: String.raw`Separate \(p \le 0\) first: then \(\frac{1}{n^p} = n^{-p} \ge 1\), so the general term does not tend to \(0\) and the series diverges by the term test (on this range \(f(x) = x^{-p}\) is not decreasing, so the integral comparison below is not applied there).

Now assume \(p > 0\); then \(f(x) = x^{-p}\) is positive and decreasing.

For \(n \ge 2\), \(\frac{1}{n^p} \le \int_{n-1}^{n}\frac{dx}{x^p}\), so \(S_N \le 1 + \int_{1}^{N}\frac{dx}{x^p}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(p > 1\)이면 \(\int_{1}^{N}\frac{dx}{x^p} = \frac{1 - N^{1-p}}{p-1} < \frac{1}{p-1}\)로 유계이므로, 단조증가하는 부분합이 유계 → 수렴합니다.`,
                en: String.raw`If \(p > 1\), \(\int_{1}^{N}\frac{dx}{x^p} = \frac{1 - N^{1-p}}{p-1} < \frac{1}{p-1}\) is bounded, so the increasing partial sums are bounded and converge.`,
              },
            },
            {
              text: {
                ko: String.raw`\(0 < p \le 1\)이면 \(\frac{1}{n^p} \ge \frac{1}{n}\)이므로 조화급수와의 비교로 발산합니다 (\(p \le 0\)인 경우는 1단계의 term test로 이미 처리했습니다).`,
                en: String.raw`If \(0 < p \le 1\), \(\frac{1}{n^p} \ge \frac{1}{n}\), so comparison with the harmonic series gives divergence (the case \(p \le 0\) was already handled by the term test in step 1).`,
              },
            },
          ],
        },
      ];
