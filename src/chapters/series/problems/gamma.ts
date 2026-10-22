import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'functional-equation',
    statement: {
      ko: String.raw`\(x > 0\)에 대해 \(\Gamma(x+1) = x\Gamma(x)\)를 부분적분으로 증명하세요.`,
      en: String.raw`Prove \(\Gamma(x+1) = x\Gamma(x)\) for \(x > 0\) by integration by parts.`,
    },
    display: [String.raw`\Gamma(x+1) = \int_0^\infty t^x e^{-t}\,dt = x\,\Gamma(x)`],
    preset: { x: 2.5 },
    presetCaption: {
      ko: String.raw`\(x = 2.5\) — \(\Gamma(3.5) = 2.5\,\Gamma(2.5)\).`,
      en: String.raw`\(x = 2.5\) — \(\Gamma(3.5) = 2.5\,\Gamma(2.5)\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`이상적분이므로 먼저 \(0 < \varepsilon < R < \infty\)인 구간 \([\varepsilon, R]\)에서 부분적분합니다. \(u = t^x\), \(dv = e^{-t}\,dt\)로 두면 \(du = x t^{x-1}\,dt\), \(v = -e^{-t}\)이므로 \(\int_{\varepsilon}^{R} t^x e^{-t}\,dt = \left[-t^x e^{-t}\right]_{\varepsilon}^{R} + x \int_{\varepsilon}^{R} t^{x-1} e^{-t}\,dt\)를 얻습니다.`,
          en: String.raw`The integral is improper, so integrate by parts first on \([\varepsilon, R]\) with \(0 < \varepsilon < R < \infty\).

Set \(u = t^x\), \(dv = e^{-t}\,dt\), so \(du = x t^{x-1}\,dt\) and \(v = -e^{-t}\).

Then \(\int_{\varepsilon}^{R} t^x e^{-t}\,dt = \left[-t^x e^{-t}\right]_{\varepsilon}^{R} + x \int_{\varepsilon}^{R} t^{x-1} e^{-t}\,dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon \to 0^+\), \(R \to \infty\) 극한에서 경계항이 사라집니다: \(x > 0\)이므로 \(\varepsilon^x e^{-\varepsilon} \to 0\)이고, \(R^x e^{-R} \to 0\)입니다 (지수함수가 다항식보다 빠르게 감소합니다). 따라서 \(\left[-t^x e^{-t}\right]_{\varepsilon}^{R} \to 0\)이고, 양쪽 적분도 이상적분으로 수렴합니다.`,
          en: String.raw`In the limits \(\varepsilon \to 0^+\) and \(R \to \infty\) the boundary term vanishes: since \(x > 0\), \(\varepsilon^x e^{-\varepsilon} \to 0\), and \(R^x e^{-R} \to 0\) (the exponential beats the polynomial). So \(\left[-t^x e^{-t}\right]_{\varepsilon}^{R} \to 0\), and both integrals converge to the improper integrals.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\Gamma(x+1) = x \int_0^\infty t^{x-1} e^{-t}\,dt = x\,\Gamma(x)\)입니다.`,
          en: String.raw`Hence \(\Gamma(x+1) = x \int_0^\infty t^{x-1} e^{-t}\,dt = x\,\Gamma(x)\).`,
        },
      },
    ],
  },
  {
    id: 'factorial',
    statement: {
      ko: String.raw`\(\Gamma(1) = 1\)임을 보이고, 이로부터 \(\Gamma(n+1) = n!\)을 증명하세요.`,
      en: String.raw`Show that \(\Gamma(1) = 1\), and from it prove \(\Gamma(n+1) = n!\).`,
    },
    display: [String.raw`\Gamma(1) = \int_0^\infty e^{-t}\,dt = 1, \quad \Gamma(n+1) = n!`],
    preset: { x: 1 },
    presetCaption: {
      ko: String.raw`\(x = 1\) — \(\Gamma(1) = 1\).`,
      en: String.raw`\(x = 1\) — \(\Gamma(1) = 1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\Gamma(1) = \int_0^\infty e^{-t}\,dt = \left[-e^{-t}\right]_0^\infty = 0 - (-1) = 1\)입니다.`,
          en: String.raw`\(\Gamma(1) = \int_0^\infty e^{-t}\,dt = \left[-e^{-t}\right]_0^\infty = 0 - (-1) = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`앞 문제의 함수방정식으로 귀납법을 적용합니다.

Base case는 \(n = 0\)일 때 \(\Gamma(1) = 1 = 0!\)이며, 동등하게 \(\Gamma(1) = 0!\)로 base를 잡을 수도 있습니다.

귀납 단계는 \(n \ge 1\)에서만 적용합니다.`,
          en: String.raw`Induction with the functional equation from the previous problem.

The base case is \(\Gamma(1) = 1 = 0!\) at \(n = 0\); equivalently the induction for \(\Gamma(n) = (n-1)!\) starts at \(n = 1\) with \(\Gamma(1) = 0! = 1\).

The induction step below is only for \(n \ge 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n \ge 1\)에서 \(\Gamma(n) = (n-1)!\)이라 가정하면, 함수방정식을 \(x = n \ge 1 > 0\)에 적용할 수 있으므로 \(\Gamma(n+1) = n\,\Gamma(n) = n\,(n-1)! = n!\)입니다 (\(x = 0\)에서는 함수방정식도 \((-1)!\)도 정의되지 않으므로 이 단계를 \(n = 0\)에 적용하지 않습니다). 따라서 모든 \(n \ge 0\)에 대해 \(\Gamma(n+1) = n!\)입니다.`,
          en: String.raw`For \(n \ge 1\), assuming \(\Gamma(n) = (n-1)!\), the functional equation applies at \(x = n \ge 1 > 0\), so \(\Gamma(n+1) = n\,\Gamma(n) = n\,(n-1)! = n!\) (the step is not applied at \(n = 0\), where neither the functional equation at \(x = 0\) nor \((-1)!\) is defined). Hence \(\Gamma(n+1) = n!\) for every \(n \ge 0\).`,
        },
      },
    ],
  },
  {
    id: 'convergence',
    statement: {
      ko: String.raw`\(\Gamma(x)\)를 정의하는 이상적분이 모든 \(x > 0\)에서 수렴함을 증명하세요.`,
      en: String.raw`Prove that the improper integral defining \(\Gamma(x)\) converges for every \(x > 0\).`,
    },
    display: [String.raw`\int_0^1 t^{x-1}e^{-t}\,dt \le \int_0^1 t^{x-1}\,dt = \frac1x`],
    preset: { x: 0.5 },
    presetCaption: {
      ko: String.raw`\(x = 0.5\) — 0 근처에서도 수렴.`,
      en: String.raw`\(x = 0.5\) — converges near 0 too.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`적분을 \(t = 1\)에서 둘로 나눕니다.

\((0, 1]\)에서는 \(e^{-t} \leq 1\)이므로 \(0 < t^{x-1}e^{-t} \leq t^{x-1}\)입니다.

\(\int_0^1 t^{x-1}\,dt = \frac1x\)는 \(x > 0\)일 때 유한하므로, 비교판정법으로 \(\int_0^1 t^{x-1}e^{-t}\,dt\)가 수렴합니다.`,
          en: String.raw`Split the integral at \(t = 1\).

On \((0, 1]\), \(e^{-t} \leq 1\) gives \(0 < t^{x-1}e^{-t} \leq t^{x-1}\).

Since \(\int_0^1 t^{x-1}\,dt = \frac1x < \infty\) exactly when \(x > 0\), the comparison test gives convergence of \(\int_0^1 t^{x-1}e^{-t}\,dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`\([1, \infty)\)에서는 \(t^{x-1}e^{-t} = \bigl(t^{x-1}e^{-t/2}\bigr)\,e^{-t/2}\)라 씁니다.

\(g(t) = t^{x-1}e^{-t/2}\)는 \([1, \infty)\)에서 연속이고 \(t \to \infty\)에서 \(0\)으로 가므로 유계입니다: \(g(t) < 1\)이 되는 \(R\)을 잡으면 \([1, R]\)에서는 extreme value theorem으로 maximum을 갖고, \([R, \infty)\)에서는 \(1\) 이하입니다.

\(g\)가 양의 값을 가지므로 이 maximum은 실제로 attained maximum이며, \(M = \max_{t \geq 1} t^{x-1}e^{-t/2} < \infty\)라 두면 \(t^{x-1}e^{-t} \leq M e^{-t/2}\)입니다.`,
          en: String.raw`On \([1, \infty)\), write \(t^{x-1}e^{-t} = \bigl(t^{x-1}e^{-t/2}\bigr)\,e^{-t/2}\).

The function \(g(t) = t^{x-1}e^{-t/2}\) is continuous on \([1, \infty)\) and tends to \(0\) as \(t \to \infty\), hence is bounded: choose \(R\) with \(g(t) < 1\) for \(t > R\); on \([1, R]\) it attains a maximum by the extreme value theorem, and beyond \(R\) it is below \(1\).

Since \(g\) takes positive values, this maximum is attained, so with \(M = \max_{t \geq 1} t^{x-1}e^{-t/2} < \infty\) we get \(t^{x-1}e^{-t} \leq M e^{-t/2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\int_1^\infty e^{-t/2}\,dt = 2e^{-1/2} \approx 1.213 < \infty\)이므로 비교판정법으로 \(\int_1^\infty t^{x-1}e^{-t}\,dt\)가 수렴합니다. 두 구간 모두 수렴하므로 \(\Gamma(x)\)는 모든 \(x > 0\)에서 잘 정의됩니다.`,
          en: String.raw`Since \(\int_1^\infty e^{-t/2}\,dt = 2e^{-1/2} \approx 1.213 < \infty\), the comparison test gives convergence of \(\int_1^\infty t^{x-1}e^{-t}\,dt\). Both pieces converge, so \(\Gamma(x)\) is well-defined for every \(x > 0\).`,
        },
      },
    ],
  },
];
