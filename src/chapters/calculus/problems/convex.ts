import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'square-convex',
    statement: {
      ko: String.raw`\(f(x) = x^2\)이 볼록함임을 직접 증명하세요.`,
      en: String.raw`Prove directly that \(f(x) = x^2\) is convex.`,
    },
    display: [String.raw`(tx+(1-t)y)^2 \le tx^2+(1-t)y^2 \iff t(1-t)(x-y)^2 \ge 0`],
    preset: { fn: 'square', a: -1, b: 1 },
    presetCaption: {
      ko: String.raw`\(a=-1, b=1\) — 현이 포물선 위에 뜬다`,
      en: String.raw`\(a=-1, b=1\) — the chord floats above the parabola`,
    },
    proof: [
      {
        text: {
          ko: String.raw`차이를 전개하면 \(tx^2+(1-t)y^2-(tx+(1-t)y)^2 = t(1-t)(x-y)^2\)입니다. (\((tx+(1-t)y)\)를 제곱해 정리하면 \(x^2\)과 \(y^2\)의 계수가 \(t(1-t)\)로 묶입니다.)`,
          en: String.raw`Expanding the difference gives \(tx^2+(1-t)y^2-(tx+(1-t)y)^2 = t(1-t)(x-y)^2\). (Squaring \((tx+(1-t)y)\) and collecting terms factors \(t(1-t)\) out of the \(x^2\) and \(y^2\) coefficients.)`,
        },
      },
      {
        text: {
          ko: String.raw`\(t \in [0,1]\)이므로 \(t(1-t) \ge 0\)이고, 제곱이므로 \((x-y)^2 \ge 0\)입니다. 따라서 우변은 \(0\) 이상입니다.`,
          en: String.raw`Since \(t \in [0,1]\), we have \(t(1-t) \ge 0\), and \((x-y)^2 \ge 0\) as a square. So the right-hand side is nonnegative.`,
        },
      },
      {
        text: {
          ko: String.raw`즉 \((tx+(1-t)y)^2 \le tx^2+(1-t)y^2\) — 볼록성의 정의가 성립하므로 \(x^2\)은 볼록합니다. 위 화면에서 \(a=-1, b=1\)일 때 최대 간격이 \(1\)인 이유이기도 합니다.`,
          en: String.raw`That is, \((tx+(1-t)y)^2 \le tx^2+(1-t)y^2\) — the definition of convexity holds, so \(x^2\) is convex. This is also why the max gap is \(1\) for \(a=-1, b=1\) in the picture above.`,
        },
      },
    ],
  },
  {
    id: 'increasing-derivative',
    statement: {
      ko: String.raw`\(f\)가 미분 가능하고 \(f'\)이 증가하면 \(f\)는 볼록함을 증명하세요.`,
      en: String.raw`Prove that if \(f\) is differentiable and \(f'\) is increasing, then \(f\) is convex.`,
    },
    display: [String.raw`\frac{f(x_2)-f(x_1)}{x_2-x_1} = f'(c_1) \le f'(c_2) = \frac{f(x_3)-f(x_2)}{x_3-x_2}`],
    preset: { fn: 'exp', a: 0, b: 2 },
    presetCaption: {
      ko: String.raw`\(e^x\) — \(f'' > 0\)인 예`,
      en: String.raw`\(e^x\) — an example with \(f'' > 0\)`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x_1 < x_2 < x_3\)이라 두면, \([x_1, x_2]\)와 \([x_2, x_3]\)에 평균값정리를 적용해 \(f'(c_1) = \frac{f(x_2)-f(x_1)}{x_2-x_1}\), \(f'(c_2) = \frac{f(x_3)-f(x_2)}{x_3-x_2}\)인 \(c_1 \in (x_1, x_2)\), \(c_2 \in (x_2, x_3)\)이 존재합니다. \(c_1 < c_2\)이고 \(f'\)이 증가하므로 \(f'(c_1) \le f'(c_2)\)입니다.`,
          en: String.raw`Take \(x_1 < x_2 < x_3\). The mean value theorem on \([x_1, x_2]\) and \([x_2, x_3]\) gives \(c_1 \in (x_1, x_2)\) and \(c_2 \in (x_2, x_3)\) with \(f'(c_1) = \frac{f(x_2)-f(x_1)}{x_2-x_1}\) and \(f'(c_2) = \frac{f(x_3)-f(x_2)}{x_3-x_2}\). Since \(c_1 < c_2\) and \(f'\) is increasing, \(f'(c_1) \le f'(c_2)\).`,
        },
      },
      {
        text: {
          ko: String.raw`기울기 부등식 \(\frac{f(x_2)-f(x_1)}{x_2-x_1} \le \frac{f(x_3)-f(x_2)}{x_3-x_2}\)를 정리하면 \(f(x_2) \le \frac{(x_3-x_2)f(x_1)+(x_2-x_1)f(x_3)}{x_3-x_1}\)을 얻습니다 — 중간점의 함숫값이 양 끝점을 잇는 현 아래에 있습니다.`,
          en: String.raw`Rearranging the slope inequality \(\frac{f(x_2)-f(x_1)}{x_2-x_1} \le \frac{f(x_3)-f(x_2)}{x_3-x_2}\) gives \(f(x_2) \le \frac{(x_3-x_2)f(x_1)+(x_2-x_1)f(x_3)}{x_3-x_1}\) — the middle value lies below the chord joining the endpoints.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_2 = tx_1+(1-t)x_3\)이라 두면 \(\frac{x_3-x_2}{x_3-x_1} = t\), \(\frac{x_2-x_1}{x_3-x_1} = 1-t\)이므로 부등식은 \(f(tx_1+(1-t)x_3) \le tf(x_1)+(1-t)f(x_3)\) — 볼록성의 정의입니다. 참고로 \(f'' \ge 0\)이면 \(f'\)에 평균값정리를 적용해 \(f'\)이 증가합니다.`,
          en: String.raw`With \(x_2 = tx_1+(1-t)x_3\) we have \(\frac{x_3-x_2}{x_3-x_1} = t\) and \(\frac{x_2-x_1}{x_3-x_1} = 1-t\), so the inequality becomes \(f(tx_1+(1-t)x_3) \le tf(x_1)+(1-t)f(x_3)\) — the definition of convexity. Note that \(f'' \ge 0\) makes \(f'\) increasing by applying the mean value theorem to \(f'\).`,
        },
      },
    ],
  },
  {
    id: 'am-gm',
    statement: {
      ko: String.raw`log의 오목성으로부터 두 수의 AM–GM 부등식을 유도하세요.`,
      en: String.raw`Derive the AM–GM inequality for two numbers from the concavity of log.`,
    },
    display: [String.raw`\log\frac{a+b}{2} \ge \frac{\log a + \log b}{2} = \log\sqrt{ab}`],
    preset: { fn: 'square', a: 1, b: 2 },
    presetCaption: {
      ko: String.raw`현 그림은 log에도 똑같이 적용된다`,
      en: String.raw`the chord picture applies to log just the same`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((\log)''(x) = -\frac{1}{x^2} < 0\)이므로, 이차도함수 판정의 오목 버전(문제 2의 부등호 반전)에 의해 \(\log\)는 오목함수입니다 — 현이 그래프 아래에 놓입니다.`,
          en: String.raw`Since \((\log)''(x) = -\frac{1}{x^2} < 0\), the concave version of the second-derivative test (the reverse of the inequality in problem 2) makes \(\log\) concave — the chord lies below the graph.`,
        },
      },
      {
        text: {
          ko: String.raw`\(t = \frac12\)인 옌센 부등식(오목 버전)을 적용하면 \(\log\frac{a+b}{2} \ge \frac{\log a + \log b}{2}\)입니다.`,
          en: String.raw`Jensen's inequality (concave version) with \(t = \frac12\) gives \(\log\frac{a+b}{2} \ge \frac{\log a + \log b}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`우변은 \(\frac12(\log a + \log b) = \log\sqrt{ab}\)이므로, 양변에 지수함수를 취하면 \(\frac{a+b}{2} \ge \sqrt{ab}\) — AM–GM 부등식입니다. (지수는 증가함수라 부등호가 유지됩니다.)`,
          en: String.raw`The right-hand side is \(\frac12(\log a + \log b) = \log\sqrt{ab}\), so exponentiating gives \(\frac{a+b}{2} \ge \sqrt{ab}\) — the AM–GM inequality. (Exponentiation is increasing, so the inequality is preserved.)`,
        },
      },
    ],
  },
];
