import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'remainder',
          statement: {
            ko: String.raw`\(S_N := \sum_{k=0}^{N} \frac{(-1)^k}{2k+1}\)로 정의할 때, 교대급수 오차 추정 \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+3}\)을 증명하세요.`,
            en: String.raw`With \(S_N := \sum_{k=0}^{N} \frac{(-1)^k}{2k+1}\), prove the alternating-series error bound \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+3}\).`,
          },
          display: [String.raw`|L - S_N| \le |S_{N+1} - S_N| = a_{N+1} = \frac{1}{2N+3}, \qquad S_N = \sum_{k=0}^{N} \frac{(-1)^k}{2k+1}`],
          preset: { n: 13 },
          presetCaption: {
            ko: String.raw`\(N = 12\) (항 13개): 오차 \(\le 1/27 \approx 0.037\) — 위아래에서 조여듭니다.`,
            en: String.raw`\(N = 12\) (13 terms): error \(\le 1/27 \approx 0.037\) — squeezed from both sides.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_k = \frac{1}{2k+1} \downarrow 0\)라 두고 \(S_N = \sum_{k=0}^{N} (-1)^k a_k\)로 정의합니다. 짝을 이룬 차이로 중첩 구조를 증명합니다: \(S_{2m+2} - S_{2m} = -a_{2m+1} + a_{2m+2} = -(a_{2m+1} - a_{2m+2}) \le 0\)이므로 짝수 부분합 \((S_{2m})\)은 감소하고, \(m \ge 1\)에서 \(S_{2m+1} - S_{2m-1} = a_{2m} - a_{2m+1} \ge 0\)이므로 홀수 부분합 \((S_{2m+1})\)은 증가합니다. 또 \(S_{2m} - S_{2m+1} = a_{2m+1} > 0\)입니다.`,
                en: String.raw`Put \(a_k = \frac{1}{2k+1} \downarrow 0\) and \(S_N = \sum_{k=0}^{N} (-1)^k a_k\). Prove the nesting by paired differences: \(S_{2m+2} - S_{2m} = -a_{2m+1} + a_{2m+2} = -(a_{2m+1} - a_{2m+2}) \le 0\), so the even partial sums \((S_{2m})\) decrease; and for \(m \ge 1\), \(S_{2m+1} - S_{2m-1} = a_{2m} - a_{2m+1} \ge 0\), so the odd partial sums \((S_{2m+1})\) increase. Also \(S_{2m} - S_{2m+1} = a_{2m+1} > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\((S_{2m})\)은 아래로 \((S_{2m+1})\)의 값들에 의해 유계이고 \((S_{2m+1})\)은 위로 유계이므로 둘 다 수렴합니다. 간격 \(S_{2m} - S_{2m+1} = a_{2m+1} \to 0\)이므로 두 극한은 같은 값 \(L\)이며, 모든 \(m\)에 대해 \(S_{2m+1} \le L \le S_{2m}\)입니다. 따라서 연속한 두 부분합 사이에 \(L\)이 항상 있고, \(|L - S_N| \le |S_{N+1} - S_N| = a_{N+1}\)입니다. 여기서 \(a_{N+1} = \frac{1}{2(N+1)+1} = \frac{1}{2N+3}\)입니다.`,
                en: String.raw`The sequence \((S_{2m})\) is decreasing and bounded below by the odd sums, and \((S_{2m+1})\) is increasing and bounded above, so both converge. The gap \(S_{2m} - S_{2m+1} = a_{2m+1} \to 0\), so both limits equal a common \(L\), with \(S_{2m+1} \le L \le S_{2m}\) for every \(m\). Hence \(L\) always lies between two consecutive partial sums, and \(|L - S_N| \le |S_{N+1} - S_N| = a_{N+1}\). Here \(a_{N+1} = \frac{1}{2(N+1)+1} = \frac{1}{2N+3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`극한을 동정합니다: 이 급수는 아래 arctan 문제의 급수에 \(x = 1\)을 대입한 것으로, Abel 연속성에 의해 그 합은 \(\arctan 1 = \frac{\pi}{4}\)입니다. 즉 \(L = \frac{\pi}{4}\)이므로 \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+3}\)입니다.`,
                en: String.raw`Identify the limit: this series is the arctan series of the problem below at \(x = 1\), so by Abel continuity its sum is \(\arctan 1 = \frac{\pi}{4}\). That is, \(L = \frac{\pi}{4}\), hence \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+3}\).`,
              },
            },
          ],
        },
        {
          id: 'three-decimals',
          statement: {
            ko: String.raw`소수점 아래 3자리까지 정확함을 보장하려면 몇 개의 항이면 충분한가요? 앞 문제의 \(S_N = \sum_{k=0}^{N} \frac{(-1)^k}{2k+1}\)와 오차 한계를 이용해 충분한 개수를 구하세요.`,
            en: String.raw`How many terms suffice to guarantee three correct decimal places? Use \(S_N = \sum_{k=0}^{N} \frac{(-1)^k}{2k+1}\) from the previous problem and its error bound to give a sufficient number.`,
          },
          display: [String.raw`\frac{1}{2N+3} < 0.0005 \iff N \ge 999 \quad \text{(1000 terms suffice)}`],
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`항 60개에서도 소수 둘째 자리 — 수렴이 매우 느립니다.`,
            en: String.raw`Even with 60 terms only two decimals — very slow convergence.`,
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
                ko: String.raw`오차 추정으로 충분조건은 \(\frac{1}{2N+3} < 0.0005\), 즉 \(2N + 3 > 2000\), \(N > 998.5\)입니다. 따라서 \(N \ge 999\)이면 충분합니다. 확인: \(N = 999\)이면 \(\frac{1}{2001} \approx 0.00049975 < 0.0005\)이고, \(N = 998\)이면 한계값 \(\frac{1}{1999} \approx 0.00050025 > 0.0005\)라 이 한계로는 보장되지 않습니다 (실제 오차가 더 클 것이라는 뜻은 아닙니다).`,
                en: String.raw`The error bound gives the sufficient condition \(\frac{1}{2N+3} < 0.0005\), i.e. \(2N + 3 > 2000\), \(N > 998.5\). So \(N \ge 999\) suffices. Check: at \(N = 999\), \(\frac{1}{2001} \approx 0.00049975 < 0.0005\); at \(N = 998\) the bound is \(\frac{1}{1999} \approx 0.00050025 > 0.0005\), so this bound does not guarantee the accuracy there (that does not mean the actual error is larger).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(N = 999\), 즉 항 1000개 (\(k = 0, \dots, 999\))이면 정확도가 보장됩니다 — 이는 충분조건이지 최소라는 주장이 아닙니다. 라이프니츠 급수의 악명 높은 느림입니다.`,
                en: String.raw`So \(N = 999\), i.e. 1000 terms (\(k = 0, \dots, 999\)), suffice to guarantee the accuracy — this is a sufficient guarantee, not a claim of minimality. The notorious slowness of the Leibniz series.`,
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
                ko: String.raw`고정된 \(|x| < 1\)에 대해, \(0\)과 \(x\) 사이 구간의 모든 \(t\)에서 \(\lvert (-t^2)^k \rvert = \lvert t \rvert^{2k} \le \lvert x \rvert^{2k}\)이고 \(\sum_k \lvert x \rvert^{2k}\)는 수렴하는 기하급수이므로, Weierstrass M-test로 그 구간에서 균등수렴합니다. 따라서 항별 적분이 정당합니다: 먼저 \(0 \le x < 1\)인 경우 \(\arctan x = \int_0^x \sum_{k=0}^{\infty}(-1)^k t^{2k}\,dt = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\)입니다. \(x < 0\)인 경우 구간이 뒤집힙니다: \([x, 0]\)에서 같은 bound가 성립하고 \(\int_0^x = -\int_x^0\)이며 양변이 odd function이므로 같은 식이 성립합니다.`,
                en: String.raw`For fixed \(|x| < 1\), every \(t\) between \(0\) and \(x\) satisfies \(\lvert (-t^2)^k \rvert = \lvert t \rvert^{2k} \le \lvert x \rvert^{2k}\), and \(\sum_k \lvert x \rvert^{2k}\) is a convergent geometric series, so the Weierstrass M-test gives uniform convergence on that interval. Hence termwise integration is legitimate: for \(0 \le x < 1\), \(\arctan x = \int_0^x \sum_{k=0}^{\infty}(-1)^k t^{2k}\,dt = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\). For \(x < 0\) the interval flips: the same bound holds on \([x, 0]\), \(\int_0^x = -\int_x^0\), and both sides are odd functions, so the same formula holds.`,
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
