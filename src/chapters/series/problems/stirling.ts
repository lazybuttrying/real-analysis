import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'check-10',
          statement: {
            ko: String.raw`\(n = 10\)에서 스털링 근사의 상대오차를 직접 계산하고 \(\frac{1}{120}\)과 비교하세요. (수치 확인이지 증명이 아닙니다.)`,
            en: String.raw`Compute the relative error of Stirling's formula at \(n = 10\) and compare with \(\frac{1}{120}\). (A numerical check, not a proof.)`,
          },
          display: [String.raw`\frac{|S(10)-10!|}{10!} \approx 0.008296 \approx \frac{1}{120}`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 로그 눈금에서 두 곡선이 겹칩니다.`,
            en: String.raw`\(n = 10\): the two curves overlap on the log scale.`,
          },
    isHint: true,
    proof: [
            {
              text: {
                ko: String.raw`\(10! = 3628800\)입니다. \(S(10) = \sqrt{20\pi}\left(\frac{10}{e}\right)^{10} \approx 3598695.62\)입니다.`,
                en: String.raw`\(10! = 3628800\). \(S(10) = \sqrt{20\pi}\left(\frac{10}{e}\right)^{10} \approx 3598695.62\).`,
              },
            },
            {
              text: {
                ko: String.raw`상대오차 \(= \frac{3628800-3598695.62}{3628800} \approx 0.008296\)입니다.`,
                en: String.raw`The relative error \(= \frac{3628800-3598695.62}{3628800} \approx 0.008296\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\frac{1}{12\cdot 10} = \frac{1}{120} \approx 0.008333\) — 주장과 일치합니다. (수치 확인이며, 오차 공식 자체의 증명은 아닙니다.)`,
                en: String.raw`\(\frac{1}{12\cdot 10} = \frac{1}{120} \approx 0.008333\) — matching the claim. (This is a numerical check, not a proof of the error formula.)`,
              },
            },
          ],
        },
        {
          id: 'log-integral',
          statement: {
            ko: String.raw`\(\ln(n!) = \sum_{k=1}^{n}\ln k\)를 \(\int_1^n \ln x\,dx\)와 비교하는 그림을 설명하세요. (아이디어 수준.)`,
            en: String.raw`Explain the picture comparing \(\ln(n!) = \sum_{k=1}^{n}\ln k\) with \(\int_1^n \ln x\,dx\). (Idea level.)`,
          },
          display: [String.raw`\sum_{k=1}^{n}\ln k \approx \int_1^n \ln x\,dx = n\ln n - n + 1`],
          preset: { n: 30 },
          presetCaption: {
            ko: String.raw`막대들의 합과 곡선 아래 넓이는 어슷비슷합니다.`,
            en: String.raw`The sum of the bars and the area under the curve are close.`,
          },
    isHint: true,
    proof: [
            {
              text: {
                ko: String.raw`\(\ln(n!) = \sum_{k=1}^{n}\ln k\)는 \(y = \ln x\) 그래프 아래에 세운 막대들의 넓이 합입니다.`,
                en: String.raw`\(\ln(n!) = \sum_{k=1}^{n}\ln k\) is the total area of bars under the graph of \(y = \ln x\).`,
              },
            },
            {
              text: {
                ko: String.raw`적분 \(\int_1^n \ln x\,dx = n\ln n - n + 1\)은 곡선 아래 넓이 — 막대 합과 어슷비슷합니다.`,
                en: String.raw`The integral \(\int_1^n \ln x\,dx = n\ln n - n + 1\) is the area under the curve — close to the bar sum.`,
              },
            },
            {
              text: {
                ko: String.raw`둘의 차이가 \(\frac{1}{2}\ln(2\pi n)\) 정도로 벌어지는데, 그 보정에서 \(\sqrt{2\pi n}\)이 나옵니다. 엄밀한 유도는 생략합니다 — 아이디어 수준입니다.`,
                en: String.raw`The gap grows like \(\frac{1}{2}\ln(2\pi n)\), and that correction produces the \(\sqrt{2\pi n}\). The rigorous derivation is omitted — idea level.`,
              },
            },
          ],
        },
        {
          id: 'central-binomial',
          statement: {
            ko: String.raw`스털링 근사를 가정하고 \(\binom{2n}{n} \sim \frac{4^n}{\sqrt{\pi n}}\)을 유도하세요.`,
            en: String.raw`Assuming Stirling's formula, derive \(\binom{2n}{n} \sim \frac{4^n}{\sqrt{\pi n}}\).`,
          },
          display: [String.raw`\binom{2n}{n} = \frac{(2n)!}{(n!)^2} \sim \frac{\sqrt{4\pi n}\,(2n/e)^{2n}}{2\pi n\,(n/e)^{2n}} = \frac{4^n}{\sqrt{\pi n}}`],
          preset: { n: 20 },
          presetCaption: {
            ko: String.raw`가운데 이항계수는 \(4^n\)보다 \(\sqrt{\pi n}\)만큼 작습니다.`,
            en: String.raw`The central binomial coefficient is smaller than \(4^n\) by \(\sqrt{\pi n}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`분자에 스털링: \((2n)! \approx \sqrt{4\pi n}\left(\frac{2n}{e}\right)^{2n}\).`,
                en: String.raw`Stirling in the numerator: \((2n)! \approx \sqrt{4\pi n}\left(\frac{2n}{e}\right)^{2n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`분모: \((n!)^2 \approx 2\pi n\left(\frac{n}{e}\right)^{2n}\).`,
                en: String.raw`Denominator: \((n!)^2 \approx 2\pi n\left(\frac{n}{e}\right)^{2n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`점근 동등이 제곱과 나눗셈 아래에서 유지됨을 먼저 확인합니다: 양의 수열에 대해 \(A_n \sim B_n\), \(C_n \sim D_n\)이면 \(A_n = B_n(1 + o(1))\), \(C_n = D_n(1 + o(1))\)로 쓸 수 있어 상대오차가 \(0\)으로 가므로, \(A_n^2 \sim B_n^2\)이고 \(\frac{A_n}{C_n} \sim \frac{B_n}{D_n}\)입니다. 따라서 위의 \(\approx\)들을 \(\sim\)로 읽어도 정당합니다.`,
                en: String.raw`First note asymptotic equivalence is preserved under squaring and division: for positive sequences, if \(A_n \sim B_n\) and \(C_n \sim D_n\), write \(A_n = B_n(1 + o(1))\) and \(C_n = D_n(1 + o(1))\); since the relative errors tend to \(0\), \(A_n^2 \sim B_n^2\) and \(\frac{A_n}{C_n} \sim \frac{B_n}{D_n}\). So reading the \(\approx\)'s above as \(\sim\) is legitimate.`,
              },
            },
            {
              text: {
                ko: String.raw`나누면 \(\frac{\sqrt{4\pi n}}{2\pi n}\cdot\frac{(2n)^{2n}}{n^{2n}} = \frac{1}{\sqrt{\pi n}}\cdot 4^n\)입니다. (스털링 근사 자체는 가정했습니다.)`,
                en: String.raw`Dividing gives \(\frac{\sqrt{4\pi n}}{2\pi n}\cdot\frac{(2n)^{2n}}{n^{2n}} = \frac{1}{\sqrt{\pi n}}\cdot 4^n\). (Stirling's formula itself is assumed.)`,
              },
            },
          ],
        },
      ];
