import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'abs-square',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{\infty}\frac{(-1)^k}{k^2}\)가 절대수렴함을 증명하세요.`,
            en: String.raw`Prove \(\sum_{k=1}^{\infty}\frac{(-1)^k}{k^2}\) converges absolutely.`,
          },
          display: [String.raw`\sum_{k=1}^{\infty}\left|\frac{(-1)^k}{k^2}\right|=\sum_{k=1}^{\infty}\frac{1}{k^2}=\frac{\pi^2}{6}<\infty`],
          preset: { series: 'abs', n: 60 },
          presetCaption: {
            ko: String.raw`\(n = 60\): \(S_{60} \approx -0.82233\), \(T_{60} \approx 1.62841\) — 절댓값 급수가 \(\pi^2/6 \approx 1.64493\) 아래에서 수렴합니다.`,
            en: String.raw`\(n = 60\): \(S_{60} \approx -0.82233\), \(T_{60} \approx 1.62841\) — the absolute series converges below \(\pi^2/6 \approx 1.64493\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\left|\frac{(-1)^k}{k^2}\right| = \frac{1}{k^2}\)입니다.`,
                en: String.raw`\(\left|\frac{(-1)^k}{k^2}\right| = \frac{1}{k^2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sum_{k=1}^{\infty}\frac{1}{k^2} = \frac{\pi^2}{6} \approx 1.64493\)은 수렴합니다 (바젤 장면의 결과).`,
                en: String.raw`\(\sum_{k=1}^{\infty}\frac{1}{k^2} = \frac{\pi^2}{6} \approx 1.64493\) converges (the Basel scene's result).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 원래 급수는 절대수렴합니다. 참고로 합은 \(-\frac{\pi^2}{12} \approx -0.822467\)이고, \(n = 60\)에서 \(S_{60} \approx -0.82233\)으로 소수 셋째 자리까지 맞습니다.`,
                en: String.raw`Hence the series converges absolutely. Its sum is \(-\frac{\pi^2}{12} \approx -0.822467\); at \(n = 60\), \(S_{60} \approx -0.82233\) already agrees to three decimals.`,
              },
            },
          ],
        },
        {
          id: 'abs-implies-conv',
          statement: {
            ko: String.raw`절대수렴하면 수렴함을 코시 판정법으로 증명하세요.`,
            en: String.raw`Prove via the Cauchy criterion that absolute convergence implies convergence.`,
          },
          display: [String.raw`\left|\sum_{k=n+1}^{m}a_k\right|\le\sum_{k=n+1}^{m}|a_k|<\varepsilon`],
          preset: { series: 'abs', n: 60 },
          presetCaption: {
            ko: String.raw`\(n = 60\): 절댓값 부분합 \(T_n\)이 코시 수열이므로 \(S_n\)도 코시 수열입니다.`,
            en: String.raw`\(n = 60\): since the absolute partial sums \(T_n\) are Cauchy, so are \(S_n\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sum |a_k|\)가 수렴한다고 가정합니다. 부분합 \(U_m = \sum_{k=1}^{m}|a_k|\)는 수렴하므로 코시 수열입니다: \(\varepsilon > 0\)마다 \(m > n \ge N\)이면 \(|U_m - U_n| = \sum_{k=n+1}^{m}|a_k| < \varepsilon\)인 \(N\)이 존재합니다.`,
                en: String.raw`Assume \(\sum |a_k|\) converges. Its partial sums \(U_m = \sum_{k=1}^{m}|a_k|\) converge, hence are Cauchy: for every \(\varepsilon > 0\) there is an \(N\) such that \(m > n \ge N\) implies \(|U_m - U_n| = \sum_{k=n+1}^{m}|a_k| < \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`원래 급수의 부분합 \(S_m\)에 대해, 삼각부등식으로 \(|S_m - S_n| = \left|\sum_{k=n+1}^{m}a_k\right| \le \sum_{k=n+1}^{m}|a_k| < \varepsilon\)입니다. 따라서 \((S_n)\)도 코시 수열입니다.`,
                en: String.raw`For the original partial sums \(S_m\), the triangle inequality gives \(|S_m - S_n| = \left|\sum_{k=n+1}^{m}a_k\right| \le \sum_{k=n+1}^{m}|a_k| < \varepsilon\). Hence \((S_n)\) is Cauchy too.`,
              },
            },
            {
              text: {
                ko: String.raw`실수는 완비적입니다 — 모든 코시 수열이 수렴합니다 (상한 장면의 완비성 공리, 극한 챕터). 따라서 \(\sum a_k\)는 수렴합니다.`,
                en: String.raw`\(\mathbb{R}\) is complete — every Cauchy sequence converges (the completeness axiom from the supremum scene, limits chapter). Hence \(\sum a_k\) converges.`,
              },
            },
          ],
        },
        {
          id: 'conditional',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{\infty}\frac{(-1)^k}{k}\)가 조건수렴함을 증명하세요.`,
            en: String.raw`Prove \(\sum_{k=1}^{\infty}\frac{(-1)^k}{k}\) converges conditionally.`,
          },
          display: [String.raw`\sum_{k=1}^{\infty}\left|\frac{(-1)^k}{k}\right|=\sum_{k=1}^{\infty}\frac{1}{k}=\infty,\quad\text{but}\ \sum_{k=1}^{\infty}\frac{(-1)^k}{k}\ \text{converges}`],
          preset: { series: 'cond', n: 60 },
          presetCaption: {
            ko: String.raw`\(n = 60\): \(S_{60} \approx -0.68488\)은 \(-\ln 2 \approx -0.69315\)로 가지만, \(T_{60} = H_{60} \approx 4.67987\)은 끝없이 자랍니다.`,
            en: String.raw`\(n = 60\): \(S_{60} \approx -0.68488\) heads to \(-\ln 2 \approx -0.69315\), while \(T_{60} = H_{60} \approx 4.67987\) grows without bound.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sum \left|\frac{(-1)^k}{k}\right| = \sum \frac{1}{k}\)는 조화급수이므로 발산합니다 (조화 장면의 오레스메 증명). \(n = 60\)에서 이미 \(T_{60} = H_{60} \approx 4.67987\)입니다.`,
                en: String.raw`\(\sum \left|\frac{(-1)^k}{k}\right| = \sum \frac{1}{k}\) is the harmonic series, hence diverges (the Oresme proof in the harmonic scene). At \(n = 60\) already \(T_{60} = H_{60} \approx 4.67987\).`,
              },
            },
            {
              text: {
                ko: String.raw`한편 \(b_k = \frac{1}{k} \downarrow 0\)이므로 교대급수 판정법으로 \(\sum \frac{(-1)^k}{k}\)는 수렴합니다 (라이프니츠 장면의 교대급수 추정). 합은 \(-\ln 2 \approx -0.693147\)이며, \(S_{60} \approx -0.68488\)입니다.`,
                en: String.raw`But \(b_k = \frac{1}{k} \downarrow 0\), so the alternating series test gives convergence of \(\sum \frac{(-1)^k}{k}\) (the alternating-series estimate from the Leibniz scene). The sum is \(-\ln 2 \approx -0.693147\), and \(S_{60} \approx -0.68488\).`,
              },
            },
            {
              text: {
                ko: String.raw`수렴하지만 절대수렴하지 않으므로 조건수렴입니다 — 이것이 바로 재배열이 합을 바꿀 수 있는 경우입니다.`,
                en: String.raw`It converges but not absolutely — conditional convergence, exactly the case where rearrangement can change the sum.`,
              },
            },
          ],
        },
      ];
