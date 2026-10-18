import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the inverse function theorem scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/inverse-function-theorem.test.ts):
 *   a = 1, 'x^3+x': b = 2, g(2) = 1 (bisection converges exactly),
 *     f'(1) = 4, g'(2) = 1/4, slopeProduct = 4 * 0.25 = 1 exactly;
 *   a = 1, 'e^x': b = e, g(e) = Math.log(Math.E) = 1 exactly,
 *     f'(1) = e, g'(e) = 1/e, slopeProduct = 1 exactly;
 *   a = -1, 'x^3+x': b = -2, f'(-1) = 4, |slopeProduct - 1| < 1e-12;
 *   gCurve is the pointwise reflection of fCurve across y = x.
 */
export const inverseFunctionTheoremProblems: readonly ProblemMeta[] = [
  {
    id: 'ift-1d',
    statement: {
      ko: String.raw`1차원 \(C^1\) 역함수 정리를 완전히 증명하세요: \(f\)가 \(x_0\) 근처에서 \(C^1\)이고 \(f'(x_0) \ne 0\)이면, \(f\)는 \(x_0\)의 어떤 근방에서 단조이므로 연속인 국소 역함수 \(g\)를 가지며, \(g'(f(x_0)) = \frac{1}{f'(x_0)}\)입니다.`,
      en: String.raw`Prove the 1D \(C^1\) inverse function theorem completely: if \(f\) is \(C^1\) near \(x_0\) and \(f'(x_0) \ne 0\), then \(f\) is strictly monotone on some neighborhood of \(x_0\), hence has a continuous local inverse \(g\), and \(g'(f(x_0)) = \frac{1}{f'(x_0)}\).`,
    },
    display: [
      String.raw`f \in C^1,\ f'(x_0) \ne 0 \ \Rightarrow\ g'(y_0) = \frac{1}{f'(x_0)}, \quad y_0 = f(x_0)`,
    ],
    preset: { fn: 'x^3+x', a: 1 },
    presetCaption: {
      ko: String.raw`\(f(x) = x^3+x\), \(a = 1\): \(f'(1) = 4\), \(g'(2) = \frac{1}{4}\), 곱이 정확히 1 — 정리가 약속한 대로입니다.`,
      en: String.raw`\(f(x) = x^3+x\), \(a = 1\): \(f'(1) = 4\), \(g'(2) = \frac{1}{4}\), product exactly 1 — as the theorem promises.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f'(x_0) > 0\)인 경우를 증명합니다 (음수인 경우는 \(-f\)에 적용). \(f'\)가 연속이고 \(f'(x_0) > 0\)이므로, \(f'(x) > 0\)인 \(x_0\)의 근방 \(I\)가 존재합니다 (부호 보존). 평균값 정리(MVT)에 의해 \(x_1 < x_2\) (\(x_1, x_2 \in I\))이면 \(f(x_2) - f(x_1) = f'(\xi)(x_2 - x_1) > 0\)이므로 \(f\)는 \(I\)에서 엄격히 증가합니다 — 따라서 단사이고, 연속이므로 \(J = f(I)\) 위에서 연속인 역함수 \(g: J \to I\)를 가집니다.`,
          en: String.raw`Prove the case \(f'(x_0) > 0\) (apply to \(-f\) for the negative case). Since \(f'\) is continuous and \(f'(x_0) > 0\), some neighborhood \(I\) of \(x_0\) has \(f'(x) > 0\) throughout (sign preservation). By the MVT, \(x_1 < x_2\) in \(I\) gives \(f(x_2) - f(x_1) = f'(\xi)(x_2 - x_1) > 0\), so \(f\) is strictly increasing on \(I\) — hence injective, and by continuity it has a continuous inverse \(g: J \to I\) on \(J = f(I)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(y_0 = f(x_0)\), \(y \in J\), \(x = g(y)\), \(x_0 = g(y_0)\)라 두면 차분몫은 \(\frac{g(y) - g(y_0)}{y - y_0} = \frac{x - x_0}{f(x) - f(x_0)}\)입니다 (\(x \ne x_0\)일 때; \(g\)가 단사라 \(y \ne y_0\)이면 \(x \ne x_0\)). MVT를 분모에 적용하면 \(f(x) - f(x_0) = f'(\xi)(x - x_0)\)인 \(\xi\) (\(x\)와 \(x_0\) 사이)가 있어 차분몫은 \(\frac{1}{f'(\xi)}\)가 됩니다.`,
          en: String.raw`Write \(y_0 = f(x_0)\), \(y \in J\), \(x = g(y)\), \(x_0 = g(y_0)\). The difference quotient is \(\frac{g(y) - g(y_0)}{y - y_0} = \frac{x - x_0}{f(x) - f(x_0)}\) (for \(x \ne x_0\); injectivity of \(g\) gives \(x \ne x_0\) when \(y \ne y_0\)). Applying the MVT to the denominator gives \(\xi\) between \(x\) and \(x_0\) with \(f(x) - f(x_0) = f'(\xi)(x - x_0)\), so the quotient equals \(\frac{1}{f'(\xi)}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(y \to y_0\)이면 \(g\)의 연속성에 의해 \(x = g(y) \to x_0\)이고, 따라서 그 사이에 낀 \(\xi \to x_0\)입니다. \(f'\)의 연속성에 의해 \(\frac{1}{f'(\xi)} \to \frac{1}{f'(x_0)}\) (분모가 0이 아님) — 즉 \(g'(y_0) = \frac{1}{f'(x_0)}\)입니다. 증명 완료. (참고: 일반적인 \(\mathbb{R}^n\) 버전의 증명은 여기서 다루지 않습니다 — 아이디어 수준으로만 언급합니다: 미분을 선형사상으로 보고 역행렬이 국소 역함수의 미분이 됩니다.)`,
          en: String.raw`As \(y \to y_0\), continuity of \(g\) gives \(x = g(y) \to x_0\), so the squeezed \(\xi \to x_0\). By continuity of \(f'\), \(\frac{1}{f'(\xi)} \to \frac{1}{f'(x_0)}\) (denominator nonzero) — i.e. \(g'(y_0) = \frac{1}{f'(x_0)}\). Complete. (Note: the general \(\mathbb{R}^n\) version is only sketched at idea level here, not proved: one views the derivative as a linear map, and the inverse matrix becomes the derivative of the local inverse.)`,
        },
      },
    ],
  },
  {
    id: 'ift-formula',
    statement: {
      ko: String.raw`\(f(x) = x^3+x\)에 대해 \(a = 1\)에서 정리의 공식을 수치로 검증하세요: \(f'(1) = 4\)임을 계산하고, 이분법으로 구한 역함수를 이용해 \(g'(2)\)를 수치 계산한 뒤 \(|4\,g'(2) - 1| < 10^{-9}\)임을 확인하세요.`,
      en: String.raw`Verify the theorem's formula numerically for \(f(x) = x^3+x\) at \(a = 1\): compute \(f'(1) = 4\), compute \(g'(2)\) numerically via the bisection inverse, and check \(|4\,g'(2) - 1| < 10^{-9}\).`,
    },
    display: [
      String.raw`f(1) = 2, \quad f'(1) = 4, \quad g'(2) = \frac{1}{f'(g(2))} = \frac{1}{4}, \quad \lvert 4\,g'(2) - 1\rvert = 0 < 10^{-9}`,
    ],
    preset: { fn: 'x^3+x', a: 1 },
    presetCaption: {
      ko: String.raw`\(a = 1\): \(b = f(1) = 2\), 이분법으로 \(g(2) = 1\)을 구하고 \(g'(2) = \frac{1}{f'(1)} = \frac{1}{4}\) — 곱 \(4 \cdot \frac{1}{4} = 1\)을 확인하세요.`,
      en: String.raw`\(a = 1\): \(b = f(1) = 2\); bisection gives \(g(2) = 1\), and \(g'(2) = \frac{1}{f'(1)} = \frac{1}{4}\) — check the product \(4 \cdot \frac{1}{4} = 1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f'(x) = 3x^2+1\)이므로 \(f'(1) = 4\)입니다. \(b = f(1) = 2\)이고, \([-2, 4]\)에서의 이분법은 \(f\)가 엄격히 증가하므로 (\(f' \ge 1\)) \(g(2) = 1\)로 수렴합니다 (200회 반복 후 오차는 \(6/2^{200}\) 이하로, 배정밀도에서는 정확히 1).`,
          en: String.raw`\(f'(x) = 3x^2+1\), so \(f'(1) = 4\). With \(b = f(1) = 2\), bisection on \([-2, 4]\) converges to \(g(2) = 1\) since \(f\) is strictly increasing (\(f' \ge 1\)); after 200 iterations the error is below \(6/2^{200}\), i.e. exactly 1 in double precision.`,
        },
      },
      {
        text: {
          ko: String.raw`공식 \(g'(y) = \frac{1}{f'(g(y))}\)에 \(y = 2\)를 대입하면 \(g'(2) = \frac{1}{f'(g(2))} = \frac{1}{f'(1)} = \frac{1}{3\cdot 1^2+1} = \frac{1}{4}\)입니다. 따라서 \(|4\,g'(2) - 1| = |4\cdot\frac{1}{4} - 1| = 0 < 10^{-9}\) — 수치 오차 없이 정리가 성립합니다.`,
          en: String.raw`The formula \(g'(y) = \frac{1}{f'(g(y))}\) at \(y = 2\) gives \(g'(2) = \frac{1}{f'(g(2))} = \frac{1}{f'(1)} = \frac{1}{3\cdot 1^2+1} = \frac{1}{4}\). Hence \(|4\,g'(2) - 1| = |4\cdot\frac{1}{4} - 1| = 0 < 10^{-9}\) — the theorem holds with no numerical error at all.`,
        },
      },
    ],
  },
  {
    id: 'ift-fails',
    statement: {
      ko: String.raw`\(f(x) = x^3\)은 \(0\)에서 왜 정리가 깨지는지 보이세요: \(f'(0) = 0\)이고, 역함수 \(\sqrt[3]{y}\)가 \(0\)에서 미분가능하지 않음을 차분몫이 \(\infty\)로 발산함을 이용해 증명하세요.`,
      en: String.raw`Show why the theorem breaks for \(f(x) = x^3\) at \(0\): \(f'(0) = 0\), and the inverse \(\sqrt[3]{y}\) is not differentiable at \(0\) — prove this via the difference quotient blowing up to \(\infty\).`,
    },
    display: [
      String.raw`f'(0) = 0, \qquad \frac{\sqrt[3]{h} - 0}{h - 0} = h^{-2/3} \xrightarrow[h \to 0]{} \infty`,
    ],
    preset: { fn: 'x^3+x', a: 0 },
    presetCaption: {
      ko: String.raw`씬의 \(f(x) = x^3+x\)는 \(a = 0\)에서도 \(f'(0) = 1 \ne 0\)이라 정리가 성립합니다 — 아래 문제는 도함수가 0이 되는 \(x^3\)의 경우로, 정리의 가설 \(f'(x_0) \ne 0\)이 왜 필요한지 보여줍니다.`,
      en: String.raw`The scene's \(f(x) = x^3+x\) satisfies the theorem even at \(a = 0\) since \(f'(0) = 1 \ne 0\) — the problem below studies \(x^3\), where the derivative vanishes, showing why the hypothesis \(f'(x_0) \ne 0\) is needed.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f(x) = x^3\)는 \(\mathbb{R}\) 전체에서 엄격히 증가하므로 전역 역함수 \(g(y) = \sqrt[3]{y}\)를 가집니다. 그러나 \(f'(x) = 3x^2\)이므로 \(f'(0) = 0\) — 정리의 가설이 깨집니다.`,
          en: String.raw`\(f(x) = x^3\) is strictly increasing on all of \(\mathbb{R}\), so it has the global inverse \(g(y) = \sqrt[3]{y}\). But \(f'(x) = 3x^2\) gives \(f'(0) = 0\) — the theorem's hypothesis fails.`,
        },
      },
      {
        text: {
          ko: String.raw`\(0\)에서의 차분몫: \(\frac{g(h) - g(0)}{h} = \frac{\sqrt[3]{h}}{h} = h^{-2/3} = \frac{1}{(\sqrt[3]{h})^2}\)입니다. \(h \to 0\)일 때 분모 \(\to 0^+\)이므로 몫은 \(+\infty\)로 발산합니다 — 극한이 존재하지 않으므로 \(g\)는 \(0\)에서 미분가능하지 않습니다. 정리의 공식 \(\frac{1}{f'(0)}\)도 \(\frac{1}{0}\)으로 무의미해집니다.`,
          en: String.raw`The difference quotient at \(0\): \(\frac{g(h) - g(0)}{h} = \frac{\sqrt[3]{h}}{h} = h^{-2/3} = \frac{1}{(\sqrt[3]{h})^2}\). As \(h \to 0\) the denominator \(\to 0^+\), so the quotient blows up to \(+\infty\) — no limit exists, hence \(g\) is not differentiable at \(0\). The theorem's formula \(\frac{1}{f'(0)}\) is likewise meaningless as \(\frac{1}{0}\).`,
        },
      },
      {
        text: {
          ko: String.raw`기하학적 의미: \(f\)의 그래프가 \((0,0)\)에서 수평 접선을 가지면, 대각선 대칭으로 얻는 \(g\)의 그래프는 \((0,0)\)에서 수직 접선을 가집니다 — 미분가능성이 깨지는 것이 그림으로도 자명합니다.`,
          en: String.raw`Geometric meaning: when the graph of \(f\) has a horizontal tangent at \((0,0)\), the reflected graph of \(g\) has a vertical tangent at \((0,0)\) — the failure of differentiability is visible in the picture too.`,
        },
      },
    ],
  },
];
