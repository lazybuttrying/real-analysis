import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'coefficients',
          statement: {
            ko: String.raw`정사각파의 사인 급수 계수 \(b_{2k-1} = \frac{4}{\pi(2k-1)}\)을 적분으로 직접 구하세요.`,
            en: String.raw`Compute the sine-series coefficients \(b_{2k-1} = \frac{4}{\pi(2k-1)}\) of the square wave by direct integration.`,
          },
          display: [String.raw`b_n = \frac{2}{\pi}\int_0^{\pi} \sin(nx)\,dx = \frac{2(1-\cos n\pi)}{n\pi}`],
          preset: { N: 5 },
          presetCaption: {
            ko: String.raw`\(N = 5\): 처음 5개의 홀수 조화파가 계단을 흉내냅니다.`,
            en: String.raw`\(N = 5\): the first 5 odd harmonics mimic the step.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`정사각파는 \((-\pi, \pi)\)에서 홀함수이므로 코사인 계수는 0이고, \(b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx = \frac{2}{\pi}\int_0^{\pi}\sin(nx)\,dx\)입니다.`,
                en: String.raw`The square wave is odd on \((-\pi, \pi)\), so cosine coefficients vanish and \(b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx = \frac{2}{\pi}\int_0^{\pi}\sin(nx)\,dx\).`,
              },
            },
            {
              text: {
                ko: String.raw`적분하면 \(\frac{2}{n\pi}(1 - \cos n\pi)\)이고, \(n\)이 짝수면 \(0\), 홀수면 \(\frac{4}{n\pi}\)입니다.`,
                en: String.raw`Integrating gives \(\frac{2}{n\pi}(1 - \cos n\pi)\): \(0\) for even \(n\), \(\frac{4}{n\pi}\) for odd \(n\).`,
              },
            },
            {
              text: {
                ko: String.raw`즉 \(b_{2k-1} = \frac{4}{\pi(2k-1)}\), \(b_{2k} = 0\)입니다.`,
                en: String.raw`So \(b_{2k-1} = \frac{4}{\pi(2k-1)}\) and \(b_{2k} = 0\).`,
              },
            },
          ],
        },
        {
          id: 'gibbs-numeric',
          statement: {
            ko: String.raw`\(N\)이 클 때 점프 옆 최대값이 \(\approx 1.179\)로 수렴함을 수치로 확인하고, 울림이 점프의 약 9%임을 보이세요. (수치 확인)`,
            en: String.raw`Verify numerically that the peak near the jump tends to \(\approx 1.179\), i.e. about 9% of the jump.

(Numerical check)`,
          },
          display: [String.raw`\max S_N \to \frac{2\,\mathrm{Si}(\pi)}{\pi} \approx 1.17898`],
          preset: { N: 50 },
          presetCaption: {
            ko: String.raw`\(N = 50\): 최대값 \(\approx 1.179\) — 1을 \(0.179\)만큼 넘습니다.`,
            en: String.raw`\(N = 50\): peak \(\approx 1.179\) — overshooting 1 by \(0.179\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(N = 50\)에서 점프 바로 오른쪽의 최대값을 수치로 재면 \(\approx 1.179\)입니다 (이론값 \(\frac{2\,\mathrm{Si}(\pi)}{\pi} \approx 1.17898\)).`,
                en: String.raw`Measuring the peak just right of the jump at \(N = 50\) gives \(\approx 1.179\) (theory: \(\frac{2\,\mathrm{Si}(\pi)}{\pi} \approx 1.17898\)).`,
              },
            },
            {
              text: {
                ko: String.raw`정사각파의 점프 크기는 \(2\)이므로, \(1\) 위로의 초과분 \(0.179\)는 점프의 약 \(8.95\%\)입니다.`,
                en: String.raw`The jump size is \(2\), so the excess \(0.179\) above \(1\) is about \(8.95\%\) of the jump.`,
              },
            },
            {
              text: {
                ko: String.raw`\(N\)을 키워도 이 비율은 0으로 가지 않습니다 — 이것이 깁스 현상입니다. (엄밀한 증명은 생략하고 수치로 확인합니다.)`,
                en: String.raw`This fraction does not go to 0 as \(N\) grows — that is the Gibbs phenomenon. (Verified numerically; the rigorous proof is omitted.)`,
              },
            },
          ],
        },
        {
          id: 'leibniz-link',
          statement: {
            ko: String.raw`\(x = \pi/2\)에서 \(S_N\)이 라이프니츠 급수가 됨을 대수적으로 보이세요.`,
            en: String.raw`Show algebraically that \(S_N\) at \(x = \pi/2\) becomes the Leibniz series.`,
          },
          display: [String.raw`S_N\!\left(\tfrac{\pi}{2}\right) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{(-1)^{k+1}}{2k-1} \to 1`],
          preset: { N: 50 },
          presetCaption: {
            ko: String.raw`\(x = \pi/2\)에서 부분합은 라이프니츠 부분합의 \(\frac{4}{\pi}\)배입니다.`,
            en: String.raw`At \(x = \pi/2\) the partial sum is \(\frac{4}{\pi}\) times the Leibniz partial sum.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin\left((2k-1)\frac{\pi}{2}\right) = (-1)^{k+1}\)이므로 \(S_N(\pi/2) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{(-1)^{k+1}}{2k-1}\)입니다.`,
                en: String.raw`Since \(\sin\left((2k-1)\frac{\pi}{2}\right) = (-1)^{k+1}\), \(S_N(\pi/2) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{(-1)^{k+1}}{2k-1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N \to \infty\)일 때 괄호 안은 라이프니츠 급수 \(\frac{\pi}{4}\)로 수렴합니다 — 근거 (급수 챕터에서 검증): 항 \(\frac{1}{2k-1}\)이 감소하며 \(0\)으로 가므로 라이프니츠(교대급수) 판정법이 수렴을 주고, 값 \(\frac{\pi}{4}\)는 \(\arctan\) 급수를 \(x = 1\)에서 평가한 것입니다.`,
                en: String.raw`As \(N \to \infty\), the bracket tends to the Leibniz series \(\frac{\pi}{4}\) — grounded as follows (verified in the series chapter): the terms \(\frac{1}{2k-1}\) decrease to \(0\), so the Leibniz (alternating series) test gives convergence, and the value \(\frac{\pi}{4}\) is the \(\arctan\) series evaluated at \(x = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(S_N(\pi/2) \to \frac{4}{\pi}\cdot\frac{\pi}{4} = 1\)로, 정사각파의 값과 일치합니다.`,
                en: String.raw`Hence \(S_N(\pi/2) \to \frac{4}{\pi}\cdot\frac{\pi}{4} = 1\), matching the square wave's value.`,
              },
            },
          ],
        },
      ];
