import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'exp-remainder',
          statement: {
            ko: String.raw`\(e^x\)의 3차 테일러 다항식으로 \(e\)를 근사하고, 라그랑주 나머지로 오차를 평가하세요.`,
            en: String.raw`Approximate \(e\) with the degree-3 Taylor polynomial of \(e^x\), and bound the error with the Lagrange remainder.`,
          },
          display: [String.raw`T_3(1) = \frac{8}{3} \approx 2.6667, \quad |R_3(1)| \le \frac{e}{24} \approx 0.1133`],
          preset: { fn: 'exp', degree: 3 },
          presetCaption: {
            ko: String.raw`\(n = 3\): 실제 오차 \(\approx 0.0516\)이 상한 \(0.1133\) 안에 들어갑니다.`,
            en: String.raw`\(n = 3\): the actual error \(\approx 0.0516\) sits inside the bound \(0.1133\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(e^x\)의 모든 도함수는 \(e^x\)이므로 \(f^{(k)}(0) = 1\)입니다. 따라서 \(T_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}\)이고 \(T_3(1) = \frac{8}{3} \approx 2.6667\)입니다.`,
                en: String.raw`Every derivative of \(e^x\) is \(e^x\), so \(f^{(k)}(0) = 1\). Hence \(T_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}\) and \(T_3(1) = \frac{8}{3} \approx 2.6667\).`,
              },
            },
            {
              text: {
                ko: String.raw`테일러 정리(라그랑주 나머지)에 의해 어떤 \(c \in (0, 1)\)에 대해 \(R_3(1) = \frac{e^c}{4!} \cdot 1^4\)입니다. \(e^c < e < 2.72\)이므로 \(|R_3(1)| < \frac{2.72}{24} \approx 0.1133\)입니다.`,
                en: String.raw`By Taylor's theorem (Lagrange remainder), \(R_3(1) = \frac{e^c}{4!} \cdot 1^4\) for some \(c \in (0, 1)\). Since \(e^c < e < 2.72\), \(|R_3(1)| < \frac{2.72}{24} \approx 0.1133\).`,
              },
            },
            {
              text: {
                ko: String.raw`실제로 \(e - \frac{8}{3} \approx 0.0516\)으로, 상한 안에 들어갑니다.`,
                en: String.raw`Indeed \(e - \frac{8}{3} \approx 0.0516\), inside the bound.`,
              },
            },
          ],
        },
        {
          id: 'sin-even',
          statement: {
            ko: String.raw`\(\sin x\)의 매클로린 전개에 짝수 차수 항이 없는 이유를 0에서의 도함수로 증명하세요.`,
            en: String.raw`Prove from the derivatives at 0 why the Maclaurin series of \(\sin x\) has no even-degree terms.`,
          },
          display: [String.raw`\sin^{(2m)}(0) = 0 \;\Rightarrow\; T_{2m+1} = T_{2m}`],
          preset: { fn: 'sin', degree: 3 },
          presetCaption: {
            ko: String.raw`\(T_3(x) = x - x^3/6\) — \(x^2\) 항이 없습니다.`,
            en: String.raw`\(T_3(x) = x - x^3/6\) — no \(x^2\) term.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin' = \cos\), \(\sin'' = -\sin\), \(\sin''' = -\cos\), \(\sin^{(4)} = \sin\)이므로 0에서의 값은 \(0, 1, 0, -1\)을 4주기로 반복합니다.`,
                en: String.raw`\(\sin' = \cos\), \(\sin'' = -\sin\), \(\sin''' = -\cos\), \(\sin^{(4)} = \sin\), so the values at 0 repeat \(0, 1, 0, -1\) with period 4.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 짝수 차수 도함수는 0에서 모두 0이 되어, 계수 \(\frac{\sin^{(2m)}(0)}{(2m)!} = 0\)입니다.`,
                en: String.raw`Hence every even-order derivative vanishes at 0, and the coefficients \(\frac{\sin^{(2m)}(0)}{(2m)!} = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`즉 \(T_3(x) = x - \frac{x^3}{6}\)에 \(x^2\) 항이 없고, 일반적으로 \(T_{2m+1} = T_{2m}\)입니다 — \(\sin\)이 홀함수이기 때문입니다.`,
                en: String.raw`So \(T_3(x) = x - \frac{x^3}{6}\) has no \(x^2\) term, and in general \(T_{2m+1} = T_{2m}\) — because \(\sin\) is odd.`,
              },
            },
          ],
        },
        {
          id: 'remainder-idea',
          statement: {
            ko: String.raw`나머지 \(R_n(x) \to 0\)이 테일러 급수 수렴의 핵심인 이유를 설명하세요. (아이디어 수준)`,
            en: String.raw`Explain why \(R_n(x) \to 0\) is the heart of Taylor convergence. (Idea level)`,
          },
          display: [String.raw`f(x) = T_n(x) + R_n(x)`],
          preset: { fn: 'sin', degree: 9 },
          presetCaption: {
            ko: String.raw`\(n = 9\): 다항식이 \([-\pi, \pi]\)에서 곡선과 거의 겹칩니다.`,
            en: String.raw`\(n = 9\): the polynomial nearly overlaps the curve on \([-\pi, \pi]\).`,
          },
    isHint: true,
    proof: [
            {
              text: {
                ko: String.raw`테일러 정리는 \(f(x) = T_n(x) + R_n(x)\)로 분해합니다. 다항식 부분은 우리가 아는 것이고, 모르는 것은 나머지 전부입니다.`,
                en: String.raw`Taylor's theorem splits \(f(x) = T_n(x) + R_n(x)\). The polynomial part is what we know; the remainder is everything we don't.`,
              },
            },
            {
              text: {
                ko: String.raw`\(R_n(x) \to 0\)일 때 정확히 그때만 \(T_n(x) \to f(x)\)가 성립합니다. 즉 나머지의 소멸이 곧 급수의 수렴입니다.`,
                en: String.raw`Exactly when \(R_n(x) \to 0\) do we get \(T_n(x) \to f(x)\). The vanishing of the remainder IS the convergence of the series.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sin x\)처럼 나머지가 0으로 가는 함수는 전역적으로 테일러 급수와 일치하지만, 그렇지 않은 매끄러운 함수도 존재합니다 — 여기서는 아이디어 수준에서만 언급합니다.`,
                en: String.raw`Functions like \(\sin x\), whose remainder vanishes, match their Taylor series globally — but smooth functions exist where it doesn't. Mentioned at the idea level only.`,
              },
            },
          ],
        },
      ];
