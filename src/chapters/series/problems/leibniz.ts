import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'remainder',
          statement: {
            ko: String.raw`교대급수 오차 추정 \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\)을 증명하세요.`,
            en: String.raw`Prove the alternating-series error bound \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\).`,
          },
          display: [String.raw`|L - S_N| \le |S_{N+1} - S_N| = \frac{1}{2N+1}`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`\(N = 12\): 오차 \(\le 1/25 = 0.04\) — 위아래에서 조여듭니다.`,
            en: String.raw`\(N = 12\): error \(\le 1/25 = 0.04\) — squeezed from both sides.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`교대급수 \(\sum_{k=0}^{\infty}(-1)^k a_k\) (\(a_k \downarrow 0\))의 부분합은 진동하며 조여듭니다: 짝수 부분합은 증가하고 홀수 부분합은 감소하며, 극한 \(L\)은 항상 연속한 두 부분합 사이에 있습니다.`,
                en: String.raw`For an alternating series \(\sum_{k=0}^{\infty}(-1)^k a_k\) with \(a_k \downarrow 0\), the partial sums oscillate inward: even ones increase, odd ones decrease, and the limit \(L\) always lies between two consecutive partial sums.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(|L - S_N| \le |S_{N+1} - S_N| = a_{N+1}\)입니다. 라이프니츠 급수에서는 \(a_{N+1} = \frac{1}{2N+1}\)이므로 \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\)입니다.`,
                en: String.raw`Hence \(|L - S_N| \le |S_{N+1} - S_N| = a_{N+1}\). For the Leibniz series \(a_{N+1} = \frac{1}{2N+1}\), so \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`(급수 자체의 수렴은 교대급수 판정법으로 따릅니다 — \(a_k = \frac{1}{2k+1} \downarrow 0\).)`,
                en: String.raw`(Convergence of the series itself follows from the alternating series test, since \(a_k = \frac{1}{2k+1} \downarrow 0\).)`,
              },
            },
          ],
        },
        {
          id: 'three-decimals',
          statement: {
            ko: String.raw`소수점 아래 3자리까지 정확하려면 몇 개의 항이 필요한가요? 오차 한계를 이용해 구하세요.`,
            en: String.raw`How many terms are needed for three correct decimal places? Use the error bound.`,
          },
          display: [String.raw`\frac{1}{2N+1} < 0.0005 \iff N \ge 1000`],
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`\(N = 60\)에서도 소수 둘째 자리 — 수렴이 매우 느립니다.`,
            en: String.raw`Even at \(N = 60\) only two decimals — very slow convergence.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`소수 3자리 정확도(반올림 기준)는 오차 \(< 0.0005\)를 요구합니다.`,
                en: String.raw`Three correct decimals (rounding) requires error \(< 0.0005\).`,
              },
            },
            {
              text: {
                ko: String.raw`오차 추정으로 \(\frac{1}{2N+1} < 0.0005\), 즉 \(2N + 1 > 2000\)이 필요합니다. \(N = 999\)이면 \(\frac{1}{1999} \approx 0.00050025 > 0.0005\)이므로, \(N \ge 1000\)이어야 합니다.`,
                en: String.raw`The error bound gives \(\frac{1}{2N+1} < 0.0005\), i.e. \(2N + 1 > 2000\). Since \(\frac{1}{1999} \approx 0.00050025 > 0.0005\) at \(N = 999\), we need \(N \ge 1000\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 1000개의 항이 필요합니다 — 라이프니츠 급수의 악명 높은 느림입니다.`,
                en: String.raw`So a thousand terms are needed — the notorious slowness of the Leibniz series.`,
              },
            },
          ],
        },
        {
          id: 'arctan',
          statement: {
            ko: String.raw`\(\arctan x = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\) (\(|x| < 1\))를 유도하고, \(x = 1\)에서 라이프니츠 급수가 됨을 설명하세요. (마지막 단계는 아벨 정리로 정당화되며, 여기서는 알려진 사실로 둡니다.)`,
            en: String.raw`Derive \(\arctan x = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\) for \(|x| < 1\), giving the Leibniz series at \(x = 1\). (The final step uses Abel's theorem, taken as known.)`,
          },
          display: [String.raw`\arctan x = \int_0^x \frac{dt}{1+t^2} = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}`],
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`이 급수의 출처: \(\arctan\)의 거듭제곱급수에 \(x = 1\) 대입.`,
            en: String.raw`Where the series comes from: the power series of \(\arctan\) at \(x = 1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(|t| < 1\)에서 \(\frac{1}{1+t^2} = \sum_{k=0}^{\infty}(-t^2)^k\)입니다 (기하급수).`,
                en: String.raw`For \(|t| < 1\), \(\frac{1}{1+t^2} = \sum_{k=0}^{\infty}(-t^2)^k\) (geometric series).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x| < 1\)인 구간 \([0, x]\)에서는 균등수렴하므로 항별 적분이 정당합니다: \(\arctan x = \int_0^x \sum_{k=0}^{\infty}(-1)^k t^{2k}\,dt = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\).`,
                en: String.raw`On \([0, x]\) with \(|x| < 1\) the convergence is uniform, so termwise integration is legitimate: \(\arctan x = \int_0^x \sum_{k=0}^{\infty}(-1)^k t^{2k}\,dt = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = 1\) 대입은 조건수렴 급수이므로 아벨 정리가 필요합니다 — 알려진 사실로 받아들이면 \(\arctan 1 = \frac{\pi}{4}\)가 라이프니츠 급수와 같습니다.`,
                en: String.raw`Substituting \(x = 1\) involves a conditionally convergent series, so Abel's theorem is needed — taken as known, it gives \(\arctan 1 = \frac{\pi}{4}\) as the Leibniz series.`,
              },
            },
          ],
        },
      ];
