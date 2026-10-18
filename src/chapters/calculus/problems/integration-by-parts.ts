import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the integration by parts scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/integration-by-parts.test.ts):
 *   'x*e^x', b = 2: lhs = 8.389056098930839, rhs = 8.389056098930617,
 *     closed = (b-1)e^b + 1 = 8.38905609893065, maxErr < 1e-12;
 *   'x*sin x', b = 2: lhs = 1.7415910999199549, rhs = 1.7415910999199686,
 *     closed = sin b - b cos b = 1.7415910999199666, maxErr < 1e-12;
 *   Simpson with 2000 panels is exact for polynomials of degree <= 3.
 */
export const integrationByPartsProblems: readonly ProblemMeta[] = [
  {
    id: 'ibp-proof',
    statement: {
      ko: String.raw`부분적분을 완전히 증명하세요: \(u, v\)가 \([a,b]\)에서 \(C^1\)이면 \(\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du\)입니다. 곱의 미분법칙 \((uv)' = u'v + uv'\)를 적분하고 미적분학 기본정리를 적용하세요.`,
      en: String.raw`Prove integration by parts completely: if \(u, v\) are \(C^1\) on \([a,b]\), then \(\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du\). Integrate the product rule \((uv)' = u'v + uv'\) and apply the fundamental theorem of calculus.`,
    },
    display: [
      String.raw`\int_a^b u(x)\,v'(x)\,dx = \bigl[u(x)\,v(x)\bigr]_a^b - \int_a^b v(x)\,u'(x)\,dx`,
    ],
    preset: { pair: 'x·e^x', b: 2 },
    presetCaption: {
      ko: String.raw`\(u = x\), \(dv = e^x\,dx\): LHS \(\approx 8.389056099\), \([uv]_0^2 - \int_0^2 v\,du \approx 2e^2 - (e^2 - 1)\)도 같은 값 — 그림의 윗넓이가 \([uv]_0^b\)에서 아랫넓이를 뺀 것과 같습니다.`,
      en: String.raw`\(u = x\), \(dv = e^x\,dx\): LHS \(\approx 8.389056099\), and \([uv]_0^2 - \int_0^2 v\,du \approx 2e^2 - (e^2 - 1)\) matches — the top area equals \([uv]_0^b\) minus the bottom area.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(u, v\)가 \(C^1\)이므로 \(u', v'\)는 연속이고, 곱 \(uv\)도 \(C^1\)이며 \((uv)' = u'v + uv'\)입니다 (곱의 미분법칙). 우변의 각 항 \(u'v\)와 \(uv'\)는 연속함수의 곱이므로 연속 — 따라서 \([a,b]\)에서 적분가능합니다.`,
          en: String.raw`Since \(u, v\) are \(C^1\), \(u', v'\) are continuous, the product \(uv\) is \(C^1\), and \((uv)' = u'v + uv'\) (the product rule). Each term \(u'v\), \(uv'\) is a product of continuous functions, hence continuous — so both are integrable on \([a,b]\).`,
        },
      },
      {
        text: {
          ko: String.raw`등식 \((uv)' = u'v + uv'\)의 양변을 \([a,b]\)에서 적분합니다: \(\int_a^b (uv)'\,dx = \int_a^b u'v\,dx + \int_a^b uv'\,dx\). 좌변에 미적분학 기본정리(FTC)를 적용하면 \(\int_a^b (uv)'\,dx = [uv]_a^b\)입니다.`,
          en: String.raw`Integrate \((uv)' = u'v + uv'\) over \([a,b]\): \(\int_a^b (uv)'\,dx = \int_a^b u'v\,dx + \int_a^b uv'\,dx\). The FTC turns the left side into \(\int_a^b (uv)'\,dx = [uv]_a^b\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \([uv]_a^b = \int_a^b u'v\,dx + \int_a^b uv'\,dx\)이고, \(\int_a^b u'v\,dx\)를 이항하면 \(\int_a^b uv'\,dx = [uv]_a^b - \int_a^b u'v\,dx\) — 즉 \(\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du\)입니다. 증명 완료. (Tao 명제 11.10.1.)`,
          en: String.raw`Hence \([uv]_a^b = \int_a^b u'v\,dx + \int_a^b uv'\,dx\), and moving \(\int_a^b u'v\,dx\) across gives \(\int_a^b uv'\,dx = [uv]_a^b - \int_a^b u'v\,dx\) — i.e. \(\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du\). Complete. (Tao Proposition 11.10.1.)`,
        },
      },
    ],
  },
  {
    id: 'ibp-xex',
    statement: {
      ko: String.raw`\(\int x e^x\,dx = (x-1)e^x + C\)를 부분적분으로 완전히 계산하고, 답을 다시 미분해서 검증하세요.`,
      en: String.raw`Compute \(\int x e^x\,dx = (x-1)e^x + C\) completely via integration by parts, then differentiate the answer to verify.`,
    },
    display: [
      String.raw`\int x e^x\,dx = (x-1)e^x + C, \qquad \frac{d}{dx}\bigl[(x-1)e^x\bigr] = x e^x`,
    ],
    preset: { pair: 'x·e^x', b: 2 },
    presetCaption: {
      ko: String.raw`\(b = 2\): \(\int_0^2 x e^x\,dx = (2-1)e^2 + 1 = e^2 + 1 \approx 8.389056099\) — 씬의 닫힌 꼴과 일치합니다.`,
      en: String.raw`\(b = 2\): \(\int_0^2 x e^x\,dx = (2-1)e^2 + 1 = e^2 + 1 \approx 8.389056099\) — matches the scene's closed form.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(u = x\), \(dv = e^x\,dx\)라 두면 \(du = dx\), \(v = e^x\)입니다. 부분적분 공식에 대입하면 \(\int x e^x\,dx = x e^x - \int e^x\,dx = x e^x - e^x + C = (x-1)e^x + C\)입니다.`,
          en: String.raw`Set \(u = x\), \(dv = e^x\,dx\); then \(du = dx\), \(v = e^x\). The formula gives \(\int x e^x\,dx = x e^x - \int e^x\,dx = x e^x - e^x + C = (x-1)e^x + C\).`,
        },
      },
      {
        text: {
          ko: String.raw`검증 (역미분): \(\frac{d}{dx}[(x-1)e^x] = 1\cdot e^x + (x-1)e^x = x e^x\) (곱의 미분법칙) — 원래 피적분함수와 일치하므로 부정적분이 맞습니다. 정적분으로는 \(\int_0^2 x e^x\,dx = [(x-1)e^x]_0^2 = e^2 - (-1) = e^2 + 1 \approx 8.389056099\)입니다.`,
          en: String.raw`Verification (differentiate back): \(\frac{d}{dx}[(x-1)e^x] = 1\cdot e^x + (x-1)e^x = x e^x\) (product rule) — matches the original integrand, so the antiderivative is correct. As a definite integral, \(\int_0^2 x e^x\,dx = [(x-1)e^x]_0^2 = e^2 - (-1) = e^2 + 1 \approx 8.389056099\).`,
        },
      },
    ],
  },
  {
    id: 'ibp-reduction',
    statement: {
      ko: String.raw`\(I_n = \int_0^{\pi/2} \sin^n x\,dx\)가 점화식 \(I_n = \frac{n-1}{n}\,I_{n-2}\)를 만족함을 부분적분으로 완전히 유도하세요 (\(u = \sin^{n-1}x\), \(dv = \sin x\,dx\)). 그리고 \(I_0 = \frac{\pi}{2}\), \(I_1 = 1\)을 계산하세요.`,
      en: String.raw`Derive completely via integration by parts that \(I_n = \int_0^{\pi/2} \sin^n x\,dx\) satisfies \(I_n = \frac{n-1}{n}\,I_{n-2}\) (use \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\)). Then compute \(I_0 = \frac{\pi}{2}\) and \(I_1 = 1\).`,
    },
    display: [
      String.raw`I_n = \frac{n-1}{n}\,I_{n-2}, \qquad I_0 = \frac{\pi}{2}, \quad I_1 = 1`,
      String.raw`I_2 = \frac{\pi}{4}, \quad I_3 = \frac{2}{3}, \quad I_4 = \frac{3\pi}{16}`,
    ],
    preset: { pair: 'x·sin x', b: 2 },
    presetCaption: {
      ko: String.raw`삼각함수 쌍 예시: \(u = x\), \(dv = \sin x\,dx\)이면 \(v = -\cos x\)이고 \(\int_0^b x\sin x\,dx = -b\cos b + \sin b\) — 같은 부분적분 구조가 점화식을 낳습니다.`,
      en: String.raw`The trigonometric pair: \(u = x\), \(dv = \sin x\,dx\) gives \(v = -\cos x\) and \(\int_0^b x\sin x\,dx = -b\cos b + \sin b\) — the same parts structure produces the reduction formula.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(n \ge 2\)에 대해 \(I_n = \int_0^{\pi/2} \sin^{n-1}x \cdot \sin x\,dx\)에 \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\)를 적용합니다: \(du = (n-1)\sin^{n-2}x\cos x\,dx\), \(v = -\cos x\). 부분적분하면 \(I_n = [-\cos x\,\sin^{n-1}x]_0^{\pi/2} + (n-1)\int_0^{\pi/2} \sin^{n-2}x\,\cos^2 x\,dx\)입니다.`,
          en: String.raw`For \(n \ge 2\), write \(I_n = \int_0^{\pi/2} \sin^{n-1}x \cdot \sin x\,dx\) and set \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\): then \(du = (n-1)\sin^{n-2}x\cos x\,dx\), \(v = -\cos x\). Parts gives \(I_n = [-\cos x\,\sin^{n-1}x]_0^{\pi/2} + (n-1)\int_0^{\pi/2} \sin^{n-2}x\,\cos^2 x\,dx\).`,
        },
      },
      {
        text: {
          ko: String.raw`경계항: \(x = \pi/2\)에서 \(\cos = 0\), \(x = 0\)에서 \(\sin = 0\) (단 \(n - 1 \ge 1\))이므로 0입니다. \(\cos^2 x = 1 - \sin^2 x\)를 대입하면 \(I_n = (n-1)\int_0^{\pi/2} (\sin^{n-2}x - \sin^n x)\,dx = (n-1)(I_{n-2} - I_n)\)입니다. 정리하면 \(n\,I_n = (n-1)\,I_{n-2}\), 즉 \(I_n = \frac{n-1}{n}\,I_{n-2}\)입니다.`,
          en: String.raw`The boundary term vanishes: \(\cos = 0\) at \(x = \pi/2\) and \(\sin = 0\) at \(x = 0\) (since \(n - 1 \ge 1\)). With \(\cos^2 x = 1 - \sin^2 x\) this becomes \(I_n = (n-1)\int_0^{\pi/2} (\sin^{n-2}x - \sin^n x)\,dx = (n-1)(I_{n-2} - I_n)\). Rearranging, \(n\,I_n = (n-1)\,I_{n-2}\), i.e. \(I_n = \frac{n-1}{n}\,I_{n-2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`기저: \(I_0 = \int_0^{\pi/2} 1\,dx = \frac{\pi}{2}\), \(I_1 = \int_0^{\pi/2} \sin x\,dx = [-\cos x]_0^{\pi/2} = 1\)입니다. 점화식으로 \(I_2 = \frac{1}{2}\cdot\frac{\pi}{2} = \frac{\pi}{4}\), \(I_3 = \frac{2}{3}\cdot 1 = \frac{2}{3}\), \(I_4 = \frac{3}{4}\cdot\frac{\pi}{4} = \frac{3\pi}{16}\) — Wallis 적분의 출발점입니다.`,
          en: String.raw`Base cases: \(I_0 = \int_0^{\pi/2} 1\,dx = \frac{\pi}{2}\), \(I_1 = \int_0^{\pi/2} \sin x\,dx = [-\cos x]_0^{\pi/2} = 1\). The recurrence gives \(I_2 = \frac{1}{2}\cdot\frac{\pi}{2} = \frac{\pi}{4}\), \(I_3 = \frac{2}{3}\cdot 1 = \frac{2}{3}\), \(I_4 = \frac{3}{4}\cdot\frac{\pi}{4} = \frac{3\pi}{16}\) — the starting point of the Wallis integrals.`,
        },
      },
    ],
  },
];
