import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Gabriel's horn scene
 * (improper integrals: finite volume, infinite surface area).
 * Imports nothing except types. Every number below was verified against the
 * model (tests/gabriel-horn.test.ts): V(R) = pi (1 - 1/R), the area lower
 * bound 2 pi ln R, and the Simpson quadrature value above that bound.
 */
export const gabrielHornProblems: readonly ProblemMeta[] = [
  {
    id: 'gabriel-volume',
    statement: {
      ko: String.raw`회전체 부피 공식(원판법)으로 가브리엘의 뿔 전체 부피가 \(\pi\)임을 완전히 증명하세요: \(V = \pi\int_1^{\infty} \frac{1}{x^2}\,dx = \pi\).`,
      en: String.raw`Prove completely, via the disk method for volumes of revolution, that the whole of Gabriel's horn has volume \(\pi\): \(V = \pi\int_1^{\infty} \frac{1}{x^2}\,dx = \pi\).`,
    },
    display: [
      String.raw`V(R) = \pi\int_1^R x^{-2}\,dx = \pi\left(1 - \frac{1}{R}\right) \xrightarrow[R\to\infty]{} \pi`,
    ],
    preset: { r: 50 },
    presetCaption: {
      ko: String.raw`\(R = 50\): \(V(50) = \pi(1 - 1/50) \approx 3.0788\) — 이미 \(\pi \approx 3.1416\)에 바짝 다가갔습니다.`,
      en: String.raw`\(R = 50\): \(V(50) = \pi(1 - 1/50) \approx 3.0788\) — already hugging \(\pi \approx 3.1416\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x\)에서의 단면은 반지름 \(1/x\)인 원판이므로, \(R\)에서 자른 뿔의 부피는 이상적분 \(V(R) = \int_1^R \pi\left(\frac{1}{x}\right)^2 dx = \pi\int_1^R x^{-2}\,dx\)입니다.`,
          en: String.raw`The cross-section at \(x\) is a disk of radius \(1/x\), so the volume of the horn truncated at \(R\) is the improper integral \(V(R) = \int_1^R \pi\left(\frac{1}{x}\right)^2 dx = \pi\int_1^R x^{-2}\,dx\).`,
        },
      },
      {
        text: {
          ko: String.raw`원시함수는 \(-1/x\)이므로 \(V(R) = \pi\left[-\frac{1}{x}\right]_1^R = \pi\left(1 - \frac{1}{R}\right)\)입니다. \(R \to \infty\)에서 \(1/R \to 0\)이므로 \(V(R) \to \pi\) — 뿔 전체의 부피는 유한하고 정확히 \(\pi\)입니다.`,
          en: String.raw`The antiderivative is \(-1/x\), so \(V(R) = \pi\left[-\frac{1}{x}\right]_1^R = \pi\left(1 - \frac{1}{R}\right)\). As \(R \to \infty\), \(1/R \to 0\), so \(V(R) \to \pi\) — the whole horn has finite volume, exactly \(\pi\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\int_1^{\infty} x^{-2}\,dx\)가 수렴하는 것은 \(p\)-적분 판정법 (\(p = 2 > 1\))의 전형적인 예입니다. 아래 패널의 파란 곡선이 \(\pi\) 점선에 달라붙는 모습이 바로 이 수렴입니다.`,
          en: String.raw`The convergence of \(\int_1^{\infty} x^{-2}\,dx\) is the textbook case of the \(p\)-integral test (\(p = 2 > 1\)). The blue curve in the lower panel clinging to the dashed \(\pi\) line is exactly this convergence.`,
        },
      },
    ],
  },
  {
    id: 'gabriel-area',
    statement: {
      ko: String.raw`회전체 겉넓이 공식으로 \(A(R) = 2\pi\int_1^R \frac{1}{x}\sqrt{1 + \frac{1}{x^4}}\,dx \ge 2\pi\ln R\)임을 보이고, 가브리엘의 뿔의 겉넓이가 무한대임을 완전히 증명하세요.`,
      en: String.raw`Using the surface-of-revolution formula, show \(A(R) = 2\pi\int_1^R \frac{1}{x}\sqrt{1 + \frac{1}{x^4}}\,dx \ge 2\pi\ln R\) and prove completely that Gabriel's horn has infinite surface area.`,
    },
    display: [
      String.raw`A(R) = 2\pi\int_1^R \frac{1}{x}\sqrt{1 + \frac{1}{x^4}}\,dx > 2\pi\int_1^R \frac{dx}{x} = 2\pi\ln R \to \infty`,
    ],
    preset: { r: 10 },
    presetCaption: {
      ko: String.raw`\(R = 10\): 하한 \(2\pi\ln 10 \approx 14.4676\), 수치적분값 \(\approx 15.1774\) — 하한 위에 있으며, \(R\)을 키우면 둘 다 끝없이 자랍니다.`,
      en: String.raw`\(R = 10\): lower bound \(2\pi\ln 10 \approx 14.4676\), quadrature \(\approx 15.1774\) — above the bound, and both grow without end as \(R\) increases.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`곡선 \(y = f(x) = 1/x\)를 \(x\)축 둘레로 회전시킨 겉넓이는 \(A(R) = 2\pi\int_1^R f(x)\sqrt{1 + f'(x)^2}\,dx\)입니다. \(f'(x) = -1/x^2\)이므로 \(A(R) = 2\pi\int_1^R \frac{1}{x}\sqrt{1 + \frac{1}{x^4}}\,dx\)입니다.`,
          en: String.raw`Rotating the curve \(y = f(x) = 1/x\) about the \(x\)-axis gives surface area \(A(R) = 2\pi\int_1^R f(x)\sqrt{1 + f'(x)^2}\,dx\). With \(f'(x) = -1/x^2\) this is \(A(R) = 2\pi\int_1^R \frac{1}{x}\sqrt{1 + \frac{1}{x^4}}\,dx\).`,
        },
      },
      {
        text: {
          ko: String.raw`모든 \(x \ge 1\)에서 \(\sqrt{1 + 1/x^4} > 1\)이므로 피적분함수는 \(\frac{2\pi}{x}\)보다 큽니다. 따라서 \(A(R) > 2\pi\int_1^R \frac{dx}{x} = 2\pi\ln R\)입니다.`,
          en: String.raw`Since \(\sqrt{1 + 1/x^4} > 1\) for every \(x \ge 1\), the integrand exceeds \(\frac{2\pi}{x}\). Hence \(A(R) > 2\pi\int_1^R \frac{dx}{x} = 2\pi\ln R\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(R \to \infty\)에서 \(2\pi\ln R \to \infty\)이므로 \(A(R) \to \infty\) — 겉넓이는 무한대입니다. 부피는 \(x^{-2}\) (\(p = 2 > 1\), 수렴)인데 겉넓이는 \(\frac{1}{x}\sqrt{1 + 1/x^4} \sim \frac{1}{x}\) (\(p = 1\), 발산) — 이 한 차수 차이가 역설의 전부입니다.`,
          en: String.raw`As \(R \to \infty\), \(2\pi\ln R \to \infty\), so \(A(R) \to \infty\) — the surface area is infinite. The volume decays like \(x^{-2}\) (\(p = 2 > 1\), convergent) while the area decays like \(\frac{1}{x}\sqrt{1 + 1/x^4} \sim \frac{1}{x}\) (\(p = 1\), divergent) — this one order of decay is the entire paradox.`,
        },
      },
    ],
  },
  {
    id: 'gabriel-painter',
    statement: {
      ko: String.raw`'페인트공 역설'을 해소하세요: 부피가 \(\pi\)로 유한하므로 뿔을 페인트 \(\pi\)만큼으로 채울 수는 있지만, 두께가 \(\delta > 0\)인 균일한 코팅으로 표면을 칠하려면 무한대의 페인트가 필요함을 증명하세요.`,
      en: String.raw`Resolve the 'painter's paradox': the horn can be filled with \(\pi\) of paint since its volume is \(\pi\), but prove that coating its surface with a uniform coat of thickness \(\delta > 0\) needs infinitely much paint.`,
    },
    display: [
      String.raw`\text{fill: } V = \pi < \infty, \qquad \text{coat: } V_{\text{coat}} \ge \delta \cdot A(R) \to \infty`,
    ],
    preset: { r: 5 },
    presetCaption: {
      ko: String.raw`\(R = 5\): 부피는 \(\pi(1 - 1/5) \approx 2.5133\)으로 \(\pi\)에 수렴 중이지만, 겉넓이는 이미 \(\ge 2\pi\ln 5 \approx 10.1124\)입니다.`,
      en: String.raw`\(R = 5\): the volume \(\pi(1 - 1/5) \approx 2.5133\) is settling toward \(\pi\), but the area already exceeds \(2\pi\ln 5 \approx 10.1124\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`채우기: 문제 1에서 뿔 전체의 부피가 \(\pi\)이므로, 페인트 \(\pi\)만큼을 부으면 뿔이 가득 찹니다 — 유한한 양으로 충분합니다.`,
          en: String.raw`Filling: by problem 1 the whole horn has volume \(\pi\), so pouring in \(\pi\) of paint fills it — a finite amount suffices.`,
        },
      },
      {
        text: {
          ko: String.raw`칠하기: 표면 위에 두께 \(\delta > 0\)인 균일 코팅을 입히면, 그 코팅이 차지하는 부피는 최소 \(\delta \cdot A(R)\)입니다 (각 표면 조각에 두께 \(\delta\)를 곱한 것의 합). 문제 2에서 \(A(R) \to \infty\)이므로, 어떤 \(\delta > 0\)에 대해서도 \(\delta \cdot A(R) \to \infty\) — 유한한 페인트로는 표면 전체를 칠할 수 없습니다.`,
          en: String.raw`Coating: a uniform coat of thickness \(\delta > 0\) over the surface occupies volume at least \(\delta \cdot A(R)\) (thickness \(\delta\) times each surface patch, summed). By problem 2, \(A(R) \to \infty\), so \(\delta \cdot A(R) \to \infty\) for every \(\delta > 0\) — no finite paint coats the whole surface.`,
        },
      },
      {
        text: {
          ko: String.raw`역설이 아닌 이유: '채우기'는 부피 \(\pi\)를 쓰는 일이고, '칠하기'는 표면에 두께를 곱한 부피를 쓰는 일입니다. 서로 다른 양을 재는 것이므로, 한쪽이 유한하고 다른 쪽이 무한대여도 모순이 아닙니다. 페인트에 두께가 있다는 물리적 직관이 무너지는 지점이 바로 여기입니다.`,
          en: String.raw`Why it is not a paradox: 'filling' spends the volume \(\pi\), while 'coating' spends thickness times area — two different quantities. One being finite and the other infinite is no contradiction. This is exactly where the physical intuition that paint has thickness breaks down.`,
        },
      },
    ],
  },
];
