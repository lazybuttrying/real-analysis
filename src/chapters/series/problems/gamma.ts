import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'functional-equation',
    statement: {
      ko: String.raw`\(\Gamma(x+1) = x\Gamma(x)\)를 부분적분으로 증명하세요.`,
      en: String.raw`Prove \(\Gamma(x+1) = x\Gamma(x)\) by integration by parts.`,
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
          ko: String.raw`\(u = t^x\), \(dv = e^{-t}\,dt\)로 두면 \(du = x t^{x-1}\,dt\), \(v = -e^{-t}\)입니다. 부분적분을 하면 \(\Gamma(x+1) = \left[-t^x e^{-t}\right]_0^\infty + x \int_0^\infty t^{x-1} e^{-t}\,dt\)를 얻습니다.`,
          en: String.raw`Set \(u = t^x\), \(dv = e^{-t}\,dt\), so \(du = x t^{x-1}\,dt\) and \(v = -e^{-t}\). Integration by parts gives \(\Gamma(x+1) = \left[-t^x e^{-t}\right]_0^\infty + x \int_0^\infty t^{x-1} e^{-t}\,dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`경계항이 사라집니다: \(x > 0\)이므로 \(t \to 0^+\)에서 \(t^x \to 0\)이고, \(t \to \infty\)에서 \(t^x e^{-t} \to 0\)입니다 (지수함수가 다항식보다 빠르게 감소합니다). 따라서 \(\left[-t^x e^{-t}\right]_0^\infty = 0\)입니다.`,
          en: String.raw`The boundary term vanishes: since \(x > 0\), \(t^x \to 0\) as \(t \to 0^+\), and \(t^x e^{-t} \to 0\) as \(t \to \infty\) (the exponential beats the polynomial). So \(\left[-t^x e^{-t}\right]_0^\infty = 0\).`,
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
          ko: String.raw`앞 문제의 함수방정식으로 귀납법을 적용합니다. \(n = 0\)일 때 \(\Gamma(1) = 0!\)이 성립합니다.`,
          en: String.raw`Induction with the functional equation from the previous problem: \(\Gamma(1) = 0!\) holds for \(n = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\Gamma(n) = (n-1)!\)이라 가정하면 \(\Gamma(n+1) = n\,\Gamma(n) = n\,(n-1)! = n!\)입니다. 따라서 모든 자연수 \(n\)에 대해 \(\Gamma(n+1) = n!\)입니다.`,
          en: String.raw`Assuming \(\Gamma(n) = (n-1)!\), we get \(\Gamma(n+1) = n\,\Gamma(n) = n\,(n-1)! = n!\). Hence \(\Gamma(n+1) = n!\) for every natural number \(n\).`,
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
          ko: String.raw`적분을 \(t = 1\)에서 둘로 나눕니다. \((0, 1]\)에서는 \(e^{-t} \leq 1\)이므로 \(0 < t^{x-1}e^{-t} \leq t^{x-1}\)입니다. \(\int_0^1 t^{x-1}\,dt = \frac1x\)는 \(x > 0\)일 때 유한하므로, 비교판정법으로 \(\int_0^1 t^{x-1}e^{-t}\,dt\)가 수렴합니다.`,
          en: String.raw`Split the integral at \(t = 1\). On \((0, 1]\), \(e^{-t} \leq 1\) gives \(0 < t^{x-1}e^{-t} \leq t^{x-1}\). Since \(\int_0^1 t^{x-1}\,dt = \frac1x < \infty\) exactly when \(x > 0\), the comparison test gives convergence of \(\int_0^1 t^{x-1}e^{-t}\,dt\).`,
        },
      },
      {
        text: {
          ko: String.raw`\([1, \infty)\)에서는 \(t^{x-1}e^{-t} = \bigl(t^{x-1}e^{-t/2}\bigr)\,e^{-t/2}\)라 씁니다. \(M = \max_{t \geq 1} t^{x-1}e^{-t/2} < \infty\) (연속함수이며 \(t \to \infty\)에서 \(0\)으로 갑니다)이므로 \(t^{x-1}e^{-t} \leq M e^{-t/2}\)입니다.`,
          en: String.raw`On \([1, \infty)\), write \(t^{x-1}e^{-t} = \bigl(t^{x-1}e^{-t/2}\bigr)\,e^{-t/2}\). With \(M = \max_{t \geq 1} t^{x-1}e^{-t/2} < \infty\) (continuous and tending to \(0\) as \(t \to \infty\)), we get \(t^{x-1}e^{-t} \leq M e^{-t/2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\int_1^\infty e^{-t/2}\,dt = 2 < \infty\)이므로 비교판정법으로 \(\int_1^\infty t^{x-1}e^{-t}\,dt\)가 수렴합니다. 두 구간 모두 수렴하므로 \(\Gamma(x)\)는 모든 \(x > 0\)에서 잘 정의됩니다.`,
          en: String.raw`Since \(\int_1^\infty e^{-t/2}\,dt = 2 < \infty\), the comparison test gives convergence of \(\int_1^\infty t^{x-1}e^{-t}\,dt\). Both pieces converge, so \(\Gamma(x)\) is well-defined for every \(x > 0\).`,
        },
      },
    ],
  },
];
