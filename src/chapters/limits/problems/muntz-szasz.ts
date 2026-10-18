import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Muntz-Szasz scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/muntz-szasz.test.ts):
 *   sum_{k=1}^{10000} 1/k^2 agrees with pi^2/6 ~ 1.64493406685 to < 1e-4
 *   (tail bound sum_{k>m} 1/k^2 < 1/m);
 *   H_1000 ~ 7.485470860550345 > ln(1001) ~ 6.908754779315220,
 *   witnessing sum 1/n = infty;
 *   grid sup errors of the discrete least-squares fits of sqrt(x):
 *     N = 4: dense 0.10033833319576063, sparse 0.17916559886882302;
 *     N = 6: dense 0.070824540264560365, sparse 0.16755551521891757;
 *     N = 8: dense 0.054448551618730398, sparse 0.16164464290774713;
 *   so the dense error shrinks 0.1003 -> 0.0708 -> 0.0544 while the sparse
 *   error barely moves 0.1792 -> 0.1676 -> 0.1616. The theorem then says
 *   the dense side must converge and the sparse side cannot: sum 1/n = infty
 *   but sum 1/n^2 = pi^2/6 < infty.
 */
export const muntzSzaszProblems: readonly ProblemMeta[] = [
  {
    id: 'muntz-squares',
    statement: {
      ko: String.raw`\(\sum_{n \ge 1} \frac{1}{n^2} = \frac{\pi^2}{6} < \infty\)임을 증명하고, Müntz–Szász 정리의 필요조건 방향을 인용하여 \(\operatorname{span}\{1, x, x^4, x^9, \ldots\}\)가 \(C[0,1]\)에서 조밀하지 않음을 결론지으세요. 필요조건 방향의 증명 자체는 아이디어 수준의 스케치로 표시되어 있습니다.`,
      en: String.raw`Prove \(\sum_{n \ge 1} \frac{1}{n^2} = \frac{\pi^2}{6} < \infty\), and deduce from the necessity direction of the Müntz–Szász theorem that \(\operatorname{span}\{1, x, x^4, x^9, \ldots\}\) is not dense in \(C[0,1]\). The proof of the necessity direction itself is marked as an idea-level sketch.`,
    },
    display: [
      String.raw`\frac{1}{\pi}\int_{-\pi}^{\pi} x^2\,dx = \sum_{k=1}^{\infty} \frac{b_k^2}{2}, \qquad b_k = \frac{2(-1)^{k+1}}{k}`,
      String.raw`\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6} < \infty \;\Rightarrow\; \operatorname{span}\{1, x^{n^2}\} \text{ not dense}`,
    ],
    preset: { N: 6 },
    presetCaption: {
      ko: String.raw`\(N = 6\): 희소 기저 오차 \(\approx 0.1676\)이 \(\approx 0.16\) 부근에 묶여 있습니다 — 아래 증명이 이 정체를 예고하는 이유입니다.`,
      en: String.raw`\(N = 6\): the sparse-basis error \(\approx 0.1676\) stays stuck near \(0.16\) — the proof below is why this stall was inevitable.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(\sum 1/n^2 = \pi^2/6\)을 계산합니다 (완전한 증명). \(f(x) = x\)를 \((-\pi, \pi)\) 위의 홀함수로 보고 사인 급수를 구하면, 부분적분으로 \(b_k = \frac{1}{\pi}\int_{-\pi}^{\pi} x \sin(kx)\,dx = \frac{2(-1)^{k+1}}{k}\)입니다. Parseval 항등식에 따르면 \(\frac{1}{\pi}\int_{-\pi}^{\pi} x^2\,dx = \sum_{k=1}^{\infty} \frac{b_k^2}{2}\)인데, 좌변은 \(\frac{2\pi^2}{3}\)이므로 \(\frac{2\pi^2}{3} = 2\sum_{k=1}^{\infty} \frac{1}{k^2}\), 즉 \(\sum_{k=1}^{\infty} \frac{1}{k^2} = \frac{\pi^2}{6} \approx 1.6449 < \infty\)입니다.`,
          en: String.raw`First compute \(\sum 1/n^2 = \pi^2/6\) (complete proof). Take \(f(x) = x\) as an odd function on \((-\pi, \pi)\); integration by parts gives its sine coefficients \(b_k = \frac{1}{\pi}\int_{-\pi}^{\pi} x \sin(kx)\,dx = \frac{2(-1)^{k+1}}{k}\). Parseval's identity says \(\frac{1}{\pi}\int_{-\pi}^{\pi} x^2\,dx = \sum_{k=1}^{\infty} \frac{b_k^2}{2}\); the left side is \(\frac{2\pi^2}{3}\), so \(\frac{2\pi^2}{3} = 2\sum_{k=1}^{\infty} \frac{1}{k^2}\), i.e. \(\sum_{k=1}^{\infty} \frac{1}{k^2} = \frac{\pi^2}{6} \approx 1.6449 < \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 Müntz–Szász 정리의 필요조건 방향을 인용합니다: \(\sum \frac{1}{\lambda_n} < \infty\)이면 \(\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\}\)는 \(C[0,1]\)에서 조밀하지 않습니다. [스케치 표시: 이 방향의 완전한 증명은 복소해석학을 필요로 합니다 — \(\sum 1/\lambda_n\)의 수렴이 Blaschke 곱 형태의 무한곱을 수렴시켜, 모든 \(x^{\lambda_n}\)과 (가중 \(L^2\) 내적에서) 직교하는 0이 아닌 해석함수를 만들고, Hahn–Banach 정리가 그 span에서 고정된 양의 거리만큼 떨어진 연속함수를 분리해냅니다. 여기서는 결론만 씁니다.] \(\lambda_n = n^2\)인 경우 \(\sum \frac{1}{\lambda_n} = \frac{\pi^2}{6} < \infty\)이므로, \(\operatorname{span}\{1, x, x^4, x^9, \ldots\}\)는 \(C[0,1]\)에서 조밀하지 않습니다 — 씬에서 희소 기저의 오차가 \(\approx 0.16\)에 묶이는 이유입니다.`,
          en: String.raw`Now quote the necessity direction of the Müntz–Szász theorem: if \(\sum \frac{1}{\lambda_n} < \infty\) then \(\operatorname{span}\{1, x^{\lambda_1}, x^{\lambda_2}, \ldots\}\) is not dense in \(C[0,1]\). [Sketch marker: the full proof of this direction needs complex analysis — convergence of \(\sum 1/\lambda_n\) makes a Blaschke-type infinite product converge, producing a nonzero analytic function orthogonal (in a weighted \(L^2\) inner product) to every \(x^{\lambda_n}\); Hahn–Banach then separates a continuous function at fixed positive distance from the span. We use only the conclusion here.] For \(\lambda_n = n^2\) we have \(\sum \frac{1}{\lambda_n} = \frac{\pi^2}{6} < \infty\), so \(\operatorname{span}\{1, x, x^4, x^9, \ldots\}\) is not dense in \(C[0,1]\) — which is why the sparse basis in the scene stays stuck at error \(\approx 0.16\).`,
        },
      },
    ],
  },
  {
    id: 'even-polynomials',
    statement: {
      ko: String.raw`\([-1, 1]\) 위의 짝다항식들의 균등 극한은 짝함수임을 증명하고 (완전한 증명), 이로부터 \(\operatorname{span}\{1, x^2, x^4, \ldots\}\)가 \(C[-1, 1]\)에서 조밀하지 않음을 결론지으세요 — Müntz–Szász의 필요조건을 쓰지 않고 직접 보이는 워밍업입니다.`,
      en: String.raw`Prove that every uniform limit of even polynomials on \([-1, 1]\) is an even function (complete proof), and conclude that \(\operatorname{span}\{1, x^2, x^4, \ldots\}\) is not dense in \(C[-1, 1]\) — a warm-up done directly, without quoting Müntz–Szász.`,
    },
    display: [
      String.raw`f(x) = \lim_{n \to \infty} p_n(x) = \lim_{n \to \infty} p_n(-x) = f(-x)`,
      String.raw`g(x) = x \in C[-1,1] \text{ is not even} \;\Rightarrow\; \operatorname{span}\{x^{2k}\} \text{ not dense}`,
    ],
    preset: { N: 6 },
    presetCaption: {
      ko: String.raw`\(N = 6\): 조밀 기저는 \(\sqrt{x}\)에 오차 \(\approx 0.0708\)까지 다가갑니다 — 다항식 전체가 있으면 (짝수 차수만 있는 경우와 달리) 어떤 연속함수도 잡을 수 있습니다.`,
      en: String.raw`\(N = 6\): the dense basis closes in on \(\sqrt{x}\) to error \(\approx 0.0708\) — with all polynomials available (unlike even degrees only), every continuous function is reachable.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(p_n\)이 짝다항식이고 \(p_n \to f\)가 \([-1, 1]\)에서 균등수렴한다고 하자. 균등수렴은 점별 수렴을 함의하므로 각 \(x \in [-1, 1]\)에 대해 \(f(x) = \lim_{n \to \infty} p_n(x)\)이다. 각 \(p_n\)이 짝함수이므로 \(p_n(x) = p_n(-x)\)이고, 따라서 \(f(x) = \lim_{n \to \infty} p_n(x) = \lim_{n \to \infty} p_n(-x) = f(-x)\)이다. 즉 \(f\)는 짝함수이다 — 짝다항식들의 균등 극한은 항상 짝이다. (증명 끝)`,
          en: String.raw`Let \(p_n\) be even polynomials with \(p_n \to f\) uniformly on \([-1, 1]\). Uniform convergence implies pointwise convergence, so \(f(x) = \lim_{n \to \infty} p_n(x)\) for each \(x \in [-1, 1]\). Each \(p_n\) is even, so \(p_n(x) = p_n(-x)\), and hence \(f(x) = \lim_{n \to \infty} p_n(x) = \lim_{n \to \infty} p_n(-x) = f(-x)\). So \(f\) is even — a uniform limit of even polynomials is always even. (End of proof.)`,
        },
      },
      {
        text: {
          ko: String.raw`\(g(x) = x\)는 \([-1, 1]\) 위의 연속함수이지만 짝함수가 아니다. 만약 \(\operatorname{span}\{1, x^2, x^4, \ldots\}\)가 \(C[-1, 1]\)에서 조밀했다면, \(g\)에 균등수렴하는 짝다항식 열이 존재하고, 방금 증명한 바에 의해 그 극한 \(g\)는 짝함수여야 한다 — 모순이다. 따라서 \(\operatorname{span}\{1, x^2, x^4, \ldots\}\)는 \(C[-1, 1]\)에서 조밀하지 않다. (참고: 이는 \(C[-1,1]\)에서의 이야기이며, 씬의 \(C[0,1]\) 위의 희소 기저 \(\{1, x, x^4, \ldots\}\)와는 구별된다 — 후자의 비조밀성은 첫 번째 문제의 Müntz–Szász 필요조건이 맡는다.)`,
          en: String.raw`\(g(x) = x\) is continuous on \([-1, 1]\) but not even. If \(\operatorname{span}\{1, x^2, x^4, \ldots\}\) were dense in \(C[-1, 1]\), some sequence of even polynomials would converge uniformly to \(g\), and by what we just proved the limit \(g\) would have to be even — a contradiction. Hence \(\operatorname{span}\{1, x^2, x^4, \ldots\}\) is not dense in \(C[-1, 1]\). (Note: this is a \(C[-1,1]\) statement, distinct from the scene's sparse basis \(\{1, x, x^4, \ldots\}\) on \(C[0,1]\) — the non-density of the latter is the job of the Müntz–Szász necessity direction in the first problem.)`,
        },
      },
    ],
  },
  {
    id: 'muntz-naturals',
    statement: {
      ko: String.raw`\(\lambda_n = n\)인 경우 \(\sum \frac{1}{n} = \infty\)임을 보이고, \(\operatorname{span}\{1, x, x^2, \ldots\}\)가 \(C[0,1]\)에서 조밀함을 (Müntz–Szász의 충분조건을 인용하지 않고) 바이어슈트라스 근사정리로 직접 증명하세요. 구체적으로 \(N \ge 2\)이면 \(x^2 \in \operatorname{span}\{1, x, \ldots, x^N\}\)임을 확인하고, 씬의 조밀 기저가 \(\sqrt{x}\)에 다가가는 숫자를 읽으세요.`,
      en: String.raw`For \(\lambda_n = n\), show \(\sum \frac{1}{n} = \infty\) and prove directly — via the Weierstrass approximation theorem, without quoting the sufficiency direction of Müntz–Szász — that \(\operatorname{span}\{1, x, x^2, \ldots\}\) is dense in \(C[0,1]\). Concretely, check \(x^2 \in \operatorname{span}\{1, x, \ldots, x^N\}\) for \(N \ge 2\), and read off the numbers with which the scene's dense basis closes in on \(\sqrt{x}\).`,
    },
    display: [
      String.raw`H_n = \sum_{k=1}^{n} \frac{1}{k} > \int_1^{n+1} \frac{dx}{x} = \ln(n+1) \to \infty`,
      String.raw`\operatorname{span}\{1, x, x^2, \ldots\} = \text{all polynomials}`,
      String.raw`\text{all polynomials} \xrightarrow{\text{Weierstrass}} \text{dense in } C[0,1]`,
    ],
    preset: { N: 8 },
    presetCaption: {
      ko: String.raw`\(N = 8\): 조밀 기저 오차 \(\approx 0.0544\) — \(N = 4\)의 \(0.1003\), \(N = 6\)의 \(0.0708\)에서 계속 줄어듭니다. \(\sum \frac{1}{n} = \infty\)인 기저는 멈추지 않습니다.`,
      en: String.raw`\(N = 8\): dense-basis error \(\approx 0.0544\) — down from \(0.1003\) at \(N = 4\) and \(0.0708\) at \(N = 6\). A basis with \(\sum \frac{1}{n} = \infty\) never stalls.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`조화급수는 발산한다: \(H_n = \sum_{k=1}^{n} \frac{1}{k}\)에 대해 각 항 \(\frac{1}{k} \ge \int_{k}^{k+1} \frac{dx}{x}\)이므로 \(H_n \ge \int_{1}^{n+1} \frac{dx}{x} = \ln(n+1) \to \infty\)이다. 따라서 \(\lambda_n = n\)인 경우 \(\sum \frac{1}{\lambda_n} = \infty\)이다. (수치 목격자: \(H_{1000} \approx 7.4855 > \ln(1001) \approx 6.9088\).)`,
          en: String.raw`The harmonic series diverges: for \(H_n = \sum_{k=1}^{n} \frac{1}{k}\), each term satisfies \(\frac{1}{k} \ge \int_{k}^{k+1} \frac{dx}{x}\), so \(H_n \ge \int_{1}^{n+1} \frac{dx}{x} = \ln(n+1) \to \infty\). Hence for \(\lambda_n = n\) we have \(\sum \frac{1}{\lambda_n} = \infty\). (Numerical witness: \(H_{1000} \approx 7.4855 > \ln(1001) \approx 6.9088\).)`,
        },
      },
      {
        text: {
          ko: String.raw`\(\lambda_n = n\)일 때 \(\operatorname{span}\{1, x, x^2, \ldots\}\)는 정확히 모든 (실수 계수) 다항식의 집합이다 — \(x^k\) 자체가 \(k\)번째 기저 원소이므로, 차수 \(d\) 이하의 모든 다항식은 처음 \(d+1\)개의 기저 원소의 선형결합이다. 바이어슈트라스 근사정리에 의해 다항식은 \(C[0,1]\)에서 균등하게 조밀하므로, 이 span도 조밀하다. Müntz–Szász의 충분조건 방향을 인용할 필요가 전혀 없다 — 이 경우는 바이어슈트라스가 직접 처리한다.`,
          en: String.raw`For \(\lambda_n = n\), \(\operatorname{span}\{1, x, x^2, \ldots\}\) is exactly the set of all (real-coefficient) polynomials — \(x^k\) is itself the \(k\)-th basis element, so every polynomial of degree at most \(d\) is a linear combination of the first \(d+1\) basis elements. By the Weierstrass approximation theorem, polynomials are uniformly dense in \(C[0,1]\), so this span is dense too. No need to quote the sufficiency direction of Müntz–Szász at all — Weierstrass handles this case directly.`,
        },
      },
      {
        text: {
          ko: String.raw`구체적인 확인: \(N \ge 2\)이면 \(x^2\)는 기저 원소 그 자체이므로 \(\operatorname{span}\{1, x, \ldots, x^N\}\)에 자명하게 속한다 — 근사가 아니라 정확한 소속이다. 씬은 이 조밀함이 \(\sqrt{x}\) 같은 특이점을 가진 함수에도 실제로 작동함을 보여준다: 조밀 기저의 최소제곱합 오차는 \(N = 4, 6, 8\)에서 \(0.1003 \to 0.0708 \to 0.0544\)로 줄어든다. (증명 끝)`,
          en: String.raw`Concrete check: for \(N \ge 2\), \(x^2\) is itself a basis element, so it trivially lies in \(\operatorname{span}\{1, x, \ldots, x^N\}\) — exact membership, not approximation. The scene shows this density working in practice even on a function with a cusp like \(\sqrt{x}\): the dense basis's least-squares error shrinks \(0.1003 \to 0.0708 \to 0.0544\) for \(N = 4, 6, 8\). (End of proof.)`,
        },
      },
    ],
  },
];
