import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'ppn-numerical',
          statement: {
            ko: String.raw`\((+,+,-)\) 재배열의 부분합이 \(\frac{3}{2}\ln 2 \approx 1.0397\)로 수렴함을 수치로 확인하세요. (수치 확인 — 엄밀한 증명은 생략합니다.)`,
            en: String.raw`Verify numerically that the \((+,+,-)\) rearrangement's partial sums tend to \(\frac{3}{2}\ln 2 \approx 1.0397\). (Numerical check; rigorous proof omitted.)`,
          },
          display: [String.raw`\frac{3}{2}\ln 2 \approx 1.03972`],
          preset: { n: 150 },
          presetCaption: {
            ko: String.raw`\(n=150\): 재배열 부분합이 \(1.0397\) 근처에 안착합니다.`,
            en: String.raw`\(n=150\): the rearranged partial sums settle near \(1.0397\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(n = 150\)에서 재배열 부분합 \(T_{150}\)을 직접 계산하면 목표값 \(\frac{3}{2}\ln 2 \approx 1.03972\)와 \(0.01\) 이내로 일치합니다 — \(|T_{150} - \frac{3}{2}\ln 2| \approx 0.0050\). (수치 확인)`,
                en: String.raw`Directly computing \(T_{150}\) gives \(|T_{150} - \frac{3}{2}\ln 2| \approx 0.0050 < 0.01\). (Numerical check)`,
              },
            },
            {
              text: {
                ko: String.raw`\(n = 300\)으로 늘리면 오차는 약 \(0.0025\)로 더 줄어듭니다 — 수렴 방향이 일관되므로 단순한 우연이 아닙니다.`,
                en: String.raw`Raising \(n\) to \(300\) shrinks the error to about \(0.0025\) — the direction of convergence is consistent, not a coincidence.`,
              },
            },
            {
              text: {
                ko: String.raw`일반 공식도 알려드립니다 (아이디어 수준): \(p\)개 양항과 \(q\)개 음항을 반복하는 재배열의 합은 \(\ln 2 + \frac{1}{2}\ln\frac{p}{q}\)입니다. \(p = 2, q = 1\)을 대입하면 \(\ln 2 + \frac{1}{2}\ln 2 = \frac{3}{2}\ln 2\)가 나옵니다. 이 공식의 증명은 여기서 다루지 않습니다.`,
                en: String.raw`The general formula is stated as known (idea level): a rearrangement repeating \(p\) positive and \(q\) negative terms sums to \(\ln 2 + \frac{1}{2}\ln\frac{p}{q}\). For \(p = 2, q = 1\) this gives \(\frac{3}{2}\ln 2\). Its proof is not covered here.`,
              },
            },
          ],
        },
        {
          id: 'absolute-invariant',
          statement: {
            ko: String.raw`절대수렴 급수는 재배열해도 합이 바뀌지 않음을 아이디어 수준으로 설명하세요. (엄밀한 증명은 생략합니다.)`,
            en: String.raw`Explain at idea level why rearranging an absolutely convergent series never changes its sum. (Idea level; proof omitted.)`,
          },
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`꼬리를 얼마든 작게 만들 수 있으면 순서는 중요하지 않습니다.`,
            en: String.raw`If tails can be made arbitrarily small, order stops mattering.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sum a_n\)이 절대수렴하면, \(\varepsilon > 0\)마다 꼬리 \(\sum_{n>N}|a_n| < \varepsilon\)을 만족하는 \(N\)이 존재합니다. (스케치 — 엄밀한 증명은 생략)`,
                en: String.raw`If \(\sum a_n\) converges absolutely, then for every \(\varepsilon > 0\) there is an \(N\) with tail \(\sum_{n>N}|a_n| < \varepsilon\). (Sketch only; rigorous proof omitted)`,
              },
            },
            {
              text: {
                ko: String.raw`재배열의 부분합도 충분히 멀리 가면 원래 급수의 처음 \(N\)개 항을 모두 포함하므로, 두 부분합의 차이는 꼬리 항들로만 이루어져 \(2\varepsilon\)보다 작아집니다.`,
                en: String.raw`A rearrangement's partial sums eventually contain the first \(N\) terms of the original, so the two partial sums differ only by tail terms — less than \(2\varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon\)은 임의이므로 두 합은 같습니다. 즉, 꼬리를 얼마든 작게 만들 수 있으면 순서를 바꿔도 합이 바뀌지 않습니다.`,
                en: String.raw`Since \(\varepsilon\) is arbitrary, the two sums agree: when tails can be made arbitrarily small, reordering cannot change the sum.`,
              },
            },
          ],
        },
        {
          id: 'alternating-remainder',
          statement: {
            ko: String.raw`교대조화급수의 부분합이 \(\lvert S_n - \ln 2\rvert \leq \frac{1}{n+1}\)을 만족함을 증명하세요.`,
            en: String.raw`Prove \(\lvert S_n - \ln 2\rvert \leq \frac{1}{n+1}\) for the alternating harmonic partial sums.`,
          },
          display: [String.raw`\lvert R_n\rvert \leq a_{n+1} = \frac{1}{n+1}`],
          preset: { n: 100 },
          presetCaption: {
            ko: String.raw`\(n=100\): 오차가 \(1/101 \approx 0.0099\) 안에 갇힙니다.`,
            en: String.raw`\(n=100\): the error is trapped inside \(1/101 \approx 0.0099\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_n = 1/n\)은 감소하면서 \(0\)으로 갑니다. 짝수 부분합은 증가하고 홀수 부분합은 감소합니다: \(S_{2m+2} - S_{2m} = a_{2m+1} - a_{2m+2} > 0\), \(S_{2m+3} - S_{2m+1} = -(a_{2m+2} - a_{2m+3}) < 0\).`,
                en: String.raw`\(a_n = 1/n\) decreases to \(0\). Even partial sums increase, odd ones decrease: \(S_{2m+2} - S_{2m} = a_{2m+1} - a_{2m+2} > 0\) and \(S_{2m+3} - S_{2m+1} = -(a_{2m+2} - a_{2m+3}) < 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`극한 \(S = \ln 2\)는 항상 연속한 두 부분합 \(S_n\)과 \(S_{n+1}\) 사이에 끼이므로, \(|S - S_n| \le |S_{n+1} - S_n| = a_{n+1} = \frac{1}{n+1}\)입니다.`,
                en: String.raw`The limit \(S = \ln 2\) always lies between two consecutive partial sums \(S_n\) and \(S_{n+1}\), so \(|S - S_n| \le |S_{n+1} - S_n| = a_{n+1} = \frac{1}{n+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`예를 들어 \(n = 100\)이면 \(|S_{100} - \ln 2| \le \frac{1}{101} \approx 0.0099\)입니다 — 캡션의 수치와 일치합니다.`,
                en: String.raw`For \(n = 100\) this gives \(|S_{100} - \ln 2| \le \frac{1}{101} \approx 0.0099\) — matching the caption's figure.`,
              },
            },
          ],
        },
      ];
