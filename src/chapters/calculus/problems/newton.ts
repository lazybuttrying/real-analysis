import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'babylonian',
          statement: {
            ko: String.raw`\(x^2 - 2 = 0\)에 대한 뉴턴법이 바빌로니아법과 같음을 대수적으로 증명하세요.`,
            en: String.raw`Prove algebraically that Newton's method for \(x^2 - 2 = 0\) is the Babylonian method.`,
          },
          display: [String.raw`x - \frac{x^2-2}{2x} = \frac{x + 2/x}{2}`],
          preset: { fn: 'x^2-2', x0: 1, n: 4 },
          presetCaption: {
            ko: String.raw`\(x_0 = 1\)에서 시작 — 4번이면 \(\sqrt{2}\)의 10자리 이상이 맞습니다.`,
            en: String.raw`Starting at \(x_0 = 1\) — 4 steps nail \(\sqrt{2}\) past 10 digits.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = x^2 - 2\), \(f'(x) = 2x\)이므로 뉴턴 점화식은 \(x_{n+1} = x_n - \frac{x_n^2 - 2}{2x_n}\)입니다.`,
                en: String.raw`With \(f(x) = x^2 - 2\) and \(f'(x) = 2x\), Newton's iteration is \(x_{n+1} = x_n - \frac{x_n^2 - 2}{2x_n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`통분하면 \(\frac{2x_n^2 - x_n^2 + 2}{2x_n} = \frac{x_n + 2/x_n}{2}\)로, 정확히 바빌로니아 점화식입니다.`,
                en: String.raw`Putting over a common denominator gives \(\frac{2x_n^2 - x_n^2 + 2}{2x_n} = \frac{x_n + 2/x_n}{2}\) — exactly the Babylonian iteration.`,
              },
            },
          ],
        },
        {
          id: 'quadratic-idea',
          statement: {
            ko: String.raw`오차가 \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)} e_n^2\)을 따르는 이유를 설명하세요. (아이디어 수준)`,
            en: String.raw`Explain why the error follows \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)} e_n^2\). (Idea level)`,
          },
          display: [String.raw`e_{n+1} \approx C\,e_n^2, \quad C = \frac{f''(x^*)}{2f'(x^*)}`],
          preset: { fn: 'x^2-2', x0: 1.5, n: 6 },
          presetCaption: {
            ko: String.raw`오차 비율 \(|e_{n+1}|/e_n^2 \approx 0.354 = 1/(2\sqrt{2})\)를 확인하세요.`,
            en: String.raw`Check the error ratio \(|e_{n+1}|/e_n^2 \approx 0.354 = 1/(2\sqrt{2})\).`,
          },
    isHint: true,
    proof: [
            {
              text: {
                ko: String.raw`가정: \(f\)는 \(x^*\) 근처에서 \(C^2\)이고 \(x^*\)는 단순근, 즉 \(f(x^*) = 0\)이고 \(f'(x^*) \ne 0\)입니다 (\(f'(x^*) = 0\)이면 아래 비율 \(\frac{f''(x^*)}{2f'(x^*)}\)는 무의미합니다). 이 가정 아래 \(f(x^*) = 0\)인 근 근처에서 \(f\)를 2차까지 테일러 전개하면 \(0 = f(x^*) \approx f(x_n) + f'(x_n)(x^* - x_n) + \frac{f''(x^*)}{2}e_n^2\)입니다 (\(e_n = x_n - x^*\)).`,
                en: String.raw`Hypotheses: \(f\) is \(C^2\) near \(x^*\) and \(x^*\) is a simple root, i.e. \(f(x^*) = 0\) with \(f'(x^*) \ne 0\) (if \(f'(x^*) = 0\) the ratio \(\frac{f''(x^*)}{2f'(x^*)}\) below is meaningless). Under these hypotheses, near a root \(f(x^*) = 0\), the second-order Taylor expansion gives \(0 = f(x^*) \approx f(x_n) + f'(x_n)(x^* - x_n) + \frac{f''(x^*)}{2}e_n^2\) (with \(e_n = x_n - x^*\)).`,
              },
            },
            {
              text: {
                ko: String.raw`뉴턴 단계 \(x_{n+1} = x_n - f(x_n)/f'(x_n)\)를 대입해 정리하면 \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)}e_n^2\)을 얻습니다.`,
                en: String.raw`Substituting the Newton step \(x_{n+1} = x_n - f(x_n)/f'(x_n)\) and rearranging gives \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)}e_n^2\).`,
              },
            },
            {
              text: {
                ko: String.raw`즉 오차가 제곱되므로 정확한 자릿수가 매 단계 두 배가 됩니다 — 2차 수렴입니다. 엄밀한 증명은 테일러 정리의 나머지 평가가 필요하므로 아이디어 수준에서만 봅니다.`,
                en: String.raw`So the error squares, doubling the correct digits each step — quadratic convergence. A rigorous proof needs the Taylor remainder estimate, so this stays at the idea level.`,
              },
            },
          ],
        },
        {
          id: 'cycle',
          statement: {
            ko: String.raw`\(f(x) = x^3 - 2x + 2\), \(x_0 = 0\)에서 뉴턴법이 \(0 \to 1 \to 0\)으로 영원히 순환함을 직접 계산으로 보이세요.`,
            en: String.raw`Show by direct computation that Newton's method for \(f(x) = x^3 - 2x + 2\) from \(x_0 = 0\) cycles \(0 \to 1 \to 0\) forever.`,
          },
          display: [String.raw`x_1 = 0 - \frac{2}{-2} = 1, \quad x_2 = 1 - \frac{1}{1} = 0`],
          preset: { fn: 'x^3-2x+2', x0: 0, n: 4 },
          presetCaption: {
            ko: String.raw`접선이 \(0\)과 \(1\) 사이를 영원히 왕복합니다 — 수렴하지 않습니다.`,
            en: String.raw`The tangent bounces between \(0\) and \(1\) forever — no convergence.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(0) = 2\), \(f'(0) = -2\)이므로 \(x_1 = 0 - \frac{2}{-2} = 1\)입니다.`,
                en: String.raw`\(f(0) = 2\) and \(f'(0) = -2\), so \(x_1 = 0 - \frac{2}{-2} = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f(1) = 1\), \(f'(1) = 1\)이므로 \(x_2 = 1 - \frac{1}{1} = 0\)입니다.`,
                en: String.raw`\(f(1) = 1\) and \(f'(1) = 1\), so \(x_2 = 1 - \frac{1}{1} = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x_2 = x_0\)이므로 이후 \(0, 1, 0, 1, \dots\)이 영원히 반복됩니다 — 뉴턴법은 항상 수렴하지 않습니다.`,
                en: String.raw`Since \(x_2 = x_0\), the sequence repeats \(0, 1, 0, 1, \dots\) forever — Newton's method does not always converge.`,
              },
            },
          ],
        },
      ];
