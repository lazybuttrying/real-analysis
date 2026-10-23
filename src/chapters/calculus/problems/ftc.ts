import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'area-cubic',
          statement: {
            ko: String.raw`\(A(x) = \int_0^x t^2\,dt = \frac{x^3}{3}\)임을 보이고 \(A'(x) = x^2\)를 확인하세요.`,
            en: String.raw`Show \(A(x) = \int_0^x t^2\,dt = \frac{x^3}{3}\) and verify \(A'(x) = x^2\).`,
          },
          display: [String.raw`A(x) = \frac{x^3}{3}, \quad A'(x) = x^2`],
          preset: { fn: 'x^2', x: 75 },
          presetCaption: {
            ko: String.raw`\(x = 1.5\): 수치 미분값이 \(f(1.5) = 2.25\)와 일치합니다.`,
            en: String.raw`\(x = 1.5\): the numerical derivative matches \(f(1.5) = 2.25\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`멱함수 적분 공식에 의해 \(\int_0^x t^2\,dt = \left[\frac{t^3}{3}\right]_0^x = \frac{x^3}{3}\)입니다.`,
                en: String.raw`By the power rule, \(\int_0^x t^2\,dt = \left[\frac{t^3}{3}\right]_0^x = \frac{x^3}{3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`미분하면 \(A'(x) = x^2 = f(x)\)로, 미적분 기본정리 제1형태와 일치합니다.`,
                en: String.raw`Differentiating gives \(A'(x) = x^2 = f(x)\), matching the first form of the Fundamental Theorem.`,
              },
            },
          ],
        },
        {
          id: 'antiderivative',
          kind: 'compute',
          statement: {
            ko: String.raw`\(\int_0^1 2x\,dx\)를 역도함수로 계산하세요.`,
            en: String.raw`Compute \(\int_0^1 2x\,dx\) via an antiderivative.`,
          },
          display: [String.raw`\int_0^1 2x\,dx = \left[x^2\right]_0^1 = 1`],
          preset: { fn: 'x^2', x: 50 },
          presetCaption: {
            ko: String.raw`\(x = 1\)까지의 넓이는 1입니다.`,
            en: String.raw`The area up to \(x = 1\) is 1.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(2x\)의 역도함수는 \(x^2\)입니다 (\((x^2)' = 2x\)).`,
                en: String.raw`An antiderivative of \(2x\) is \(x^2\) (since \((x^2)' = 2x\)).`,
              },
            },
            {
              text: {
                ko: String.raw`기본정리 제2형태에 의해 \(\int_0^1 2x\,dx = 1^2 - 0^2 = 1\)입니다.`,
                en: String.raw`By the second form of the theorem, \(\int_0^1 2x\,dx = 1^2 - 0^2 = 1\).`,
              },
            },
          ],
          answer: { ko: String.raw`\(1\)`, en: String.raw`\(1\)` },
        },
        {
          id: 'chain',
          statement: {
            ko: String.raw`\(\frac{d}{dx}\int_x^{x^2} \sin t\,dt\)를 기본정리와 연쇄법칙으로 구하세요.`,
            en: String.raw`Find \(\frac{d}{dx}\int_x^{x^2} \sin t\,dt\) with the Fundamental Theorem and the chain rule.`,
          },
          display: [String.raw`\frac{d}{dx}\int_x^{x^2}\sin t\,dt = 2x\sin(x^2) - \sin x`],
          preset: { fn: 'sin', x: 32 },
          presetCaption: {
            ko: String.raw`\(\sin\)의 넓이함수 위에서 \(x \approx 1.01\) 지점을 봅니다.`,
            en: String.raw`On the area function of \(\sin\), at \(x \approx 1.01\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(F(u) = \int_0^u \sin t\,dt\)라 두면, 피적분함수 \(\sin\)이 연속이므로 기본정리 제1형태의 연속성 가정이 성립하고, 이에 의해 \(F'(u) = \sin u\)입니다.`,
                en: String.raw`Put \(F(u) = \int_0^u \sin t\,dt\); the integrand \(\sin\) is continuous, so the continuity hypothesis of the first form of the Fundamental Theorem holds, and it gives \(F'(u) = \sin u\).`,
              },
            },
            {
              text: {
                ko: String.raw`적분은 \(F(x^2) - F(x)\)이므로, 연쇄법칙으로 미분하면 \(2x\,F'(x^2) - F'(x) = 2x\sin(x^2) - \sin x\)입니다.`,
                en: String.raw`The integral is \(F(x^2) - F(x)\), so the chain rule gives \(2x\,F'(x^2) - F'(x) = 2x\sin(x^2) - \sin x\).`,
              },
            },
          ],
        },
      ];
