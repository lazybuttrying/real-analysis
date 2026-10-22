import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the change of variables scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/change-of-variables.test.ts):
 *   N = 50, 'u=x^2': original = 1.7182820012734081,
 *     substituted = 1.7182818299863347, closed = e - 1 = 1.718281828459045,
 *     diff = 1.7128707341385052e-7 < 1e-6;
 *   N = 50, 'u=sin x': original = 1.7182819035868118,
 *     substituted = 1.7182818299863347, diff = 7.360047704629835e-8 < 1e-6;
 *   Simpson panel count is forced even (N from the slider already is).
 */
export const changeOfVariablesProblems: readonly ProblemMeta[] = [
  {
    id: 'cov-proof',
    statement: {
      ko: String.raw`치환 법칙을 완전히 증명하세요: \(\varphi\)가 \([a,b]\)에서 \(C^1\) 단조이고 \(f\)가 연속이면 \(\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(a)}^{\varphi(b)} f(u)\,du\)입니다.

\(F' = f\)인 원시함수 \(F\)를 잡고 합성함수 \((F \circ \varphi)\)에 연쇄법칙과 미적분학 기본정리를 적용하세요.`,
      en: String.raw`Prove the substitution rule completely: if \(\varphi\) is \(C^1\) and monotone on \([a,b]\) and \(f\) is continuous, then \(\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(a)}^{\varphi(b)} f(u)\,du\).

Take an antiderivative \(F\) with \(F' = f\) and apply the chain rule plus the fundamental theorem to \(F \circ \varphi\).`,
    },
    display: [
      String.raw`\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(a)}^{\varphi(b)} f(u)\,du`,
      String.raw`\frac{d}{dx}\bigl[F(\varphi(x))\bigr] = F'(\varphi(x))\,\varphi'(x) = f(\varphi(x))\,\varphi'(x)`,
    ],
    preset: { sub: 'u=x^2', N: 50 },
    presetCaption: {
      ko: String.raw`\(u = x^2\) (\(N = 50\)): 원래 적분 \(\approx 1.7182820013\), 치환 후 \(\approx 1.7182818300\) — 둘 다 \(e - 1\)입니다. 아래 증명이 이 일치를 보장합니다.`,
      en: String.raw`\(u = x^2\) (\(N = 50\)): original \(\approx 1.7182820013\), substituted \(\approx 1.7182818300\) — both are \(e - 1\). The proof below is what guarantees this match.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 \(\varphi([a,b])\)를 포함하는 구간에서 연속이므로, 원시함수 \(F\) (\(F' = f\))가 존재합니다 (연속함수는 적분으로 원시함수를 가집니다). 합성함수 \(H(x) = F(\varphi(x))\)는 \(C^1\)이고, 연쇄법칙에 의해 \(H'(x) = F'(\varphi(x))\,\varphi'(x) = f(\varphi(x))\,\varphi'(x)\)입니다 — 정확히 치환 전 피적분함수입니다.`,
          en: String.raw`Since \(f\) is continuous on an interval containing \(\varphi([a,b])\), an antiderivative \(F\) with \(F' = f\) exists (a continuous function has one via integration). The composition \(H(x) = F(\varphi(x))\) is \(C^1\), and the chain rule gives \(H'(x) = F'(\varphi(x))\,\varphi'(x) = f(\varphi(x))\,\varphi'(x)\) — exactly the pre-substitution integrand.`,
        },
      },
      {
        text: {
          ko: String.raw`\(H'\)는 연속이므로 \([a,b]\)에서 적분가능하고, FTC에 의해 \(\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_a^b H'(x)\,dx = H(b) - H(a) = F(\varphi(b)) - F(\varphi(a))\)입니다.`,
          en: String.raw`\(H'\) is continuous, hence integrable on \([a,b]\), and the FTC gives \(\int_a^b f(\varphi(x))\,\varphi'(x)\,dx = \int_a^b H'(x)\,dx = H(b) - H(a) = F(\varphi(b)) - F(\varphi(a))\).`,
        },
      },
      {
        text: {
          ko: String.raw`한편 같은 FTC를 \(f\)에 직접 적용하면 \(\int_{\varphi(a)}^{\varphi(b)} f(u)\,du = F(\varphi(b)) - F(\varphi(a))\)입니다 (\(\varphi\)의 단조성은 \(\varphi(a) \le \varphi(b)\) 또는 그 역을 보장해 적분 구간이 정상적으로 정의됩니다).

양변이 같으므로 치환 법칙이 성립합니다.

증명 완료. (Tao 11.10.5–11.10.7.)`,
          en: String.raw`Meanwhile the same FTC applied directly to \(f\) gives \(\int_{\varphi(a)}^{\varphi(b)} f(u)\,du = F(\varphi(b)) - F(\varphi(a))\) (monotonicity of \(\varphi\) guarantees \(\varphi(a) \le \varphi(b)\) or the reverse, so the interval is well-defined).

Both sides agree, proving the substitution rule.

Complete. (Tao 11.10.5–11.10.7.)`,
        },
      },
    ],
  },
  {
    id: 'cov-example',
    statement: {
      ko: String.raw`\(\int_0^1 2x\,e^{x^2}\,dx = e - 1\)을 \(u = x^2\) 치환으로 완전히 계산하세요: \(du\)의 결정, 적분 구간의 변환, 그리고 원시함수까지 빠짐없이 쓰세요.`,
      en: String.raw`Compute \(\int_0^1 2x\,e^{x^2}\,dx = e - 1\) completely via the substitution \(u = x^2\): determine \(du\), transform the limits, and write out the antiderivative — no skipped steps.`,
    },
    display: [
      String.raw`\int_0^1 2x\,e^{x^2}\,dx = \int_0^1 e^u\,du = \bigl[e^u\bigr]_0^1 = e - 1`,
    ],
    preset: { sub: 'u=x^2', N: 50 },
    presetCaption: {
      ko: String.raw`\(N = 50\): Simpson으로 구한 원래 적분 \(\approx 1.7182820013\)이 \(e - 1 \approx 1.7182818285\)와 \(1.8 \times 10^{-7}\) 이내로 일치합니다.`,
      en: String.raw`\(N = 50\): Simpson's original integral \(\approx 1.7182820013\) matches \(e - 1 \approx 1.7182818285\) within \(1.8 \times 10^{-7}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varphi(x) = x^2\)는 \([0,1]\)에서 \(C^1\) 단조증가이고 \(\varphi'(x) = 2x\)입니다. 피적분함수 \(2x\,e^{x^2} = e^{\varphi(x)}\,\varphi'(x)\)는 정확히 치환 법칙의 꼴입니다 (\(f(u) = e^u\)).`,
          en: String.raw`\(\varphi(x) = x^2\) is \(C^1\) and increasing on \([0,1]\), with \(\varphi'(x) = 2x\). The integrand \(2x\,e^{x^2} = e^{\varphi(x)}\,\varphi'(x)\) is exactly in substitution form (with \(f(u) = e^u\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(u = x^2\)라 두면 \(du = 2x\,dx\)이고, 구간은 \(x = 0 \mapsto u = 0\), \(x = 1 \mapsto u = 1\)로 변환됩니다. 따라서 \(\int_0^1 2x\,e^{x^2}\,dx = \int_0^1 e^u\,du\)입니다.`,
          en: String.raw`With \(u = x^2\) we get \(du = 2x\,dx\), and the limits transform as \(x = 0 \mapsto u = 0\), \(x = 1 \mapsto u = 1\). Hence \(\int_0^1 2x\,e^{x^2}\,dx = \int_0^1 e^u\,du\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(e^u\)의 원시함수는 \(e^u\) 자신이므로 \(\int_0^1 e^u\,du = [e^u]_0^1 = e - 1 \approx 1.7182818285\)입니다. 수치 확인: \(N = 50\) Simpson으로 원래 적분은 \(1.7182820013\), 치환 후 적분은 \(1.7182818300\) — 둘 다 \(e - 1\)에 수렴합니다.`,
          en: String.raw`Since \(e^u\) is its own antiderivative, \(\int_0^1 e^u\,du = [e^u]_0^1 = e - 1 \approx 1.7182818285\). Numerical check: with \(N = 50\) Simpson panels the original integral is \(1.7182820013\) and the substituted one is \(1.7182818300\) — both converge to \(e - 1\).`,
        },
      },
    ],
  },
  {
    id: 'cov-orientation',
    statement: {
      ko: String.raw`\(\varphi\)가 감소함수일 때 적분 구간의 방향이 뒤집힘을 명시적으로 검증하세요: \(\varphi(x) = -x\)를 \([-1, 0]\)에 적용해 \(\int_{-1}^{0} e^{-x}\cdot(-1)\,dx = \int_{1}^{0} e^u\,du = -\int_0^1 e^u\,du = 1 - e\)임을 직접 계산으로 확인하세요.`,
      en: String.raw`Verify explicitly how a decreasing \(\varphi\) flips the limits: apply \(\varphi(x) = -x\) on \([-1, 0]\) and check by direct computation that \(\int_{-1}^{0} e^{-x}\cdot(-1)\,dx = \int_{1}^{0} e^u\,du = -\int_0^1 e^u\,du = 1 - e\).`,
    },
    display: [
      String.raw`\int_{-1}^{0} e^{-x}\cdot(-1)\,dx = \int_{1}^{0} e^u\,du = -\int_0^1 e^u\,du = 1 - e`,
      String.raw`\bigl[e^{-x}\bigr]_{-1}^{0} = e^0 - e^1 = 1 - e`,
    ],
    preset: { sub: 'u=sin x', N: 50 },
    presetCaption: {
      ko: String.raw`증가 치환 \(u = \sin x\) (\(N = 50\)): 구간 \([0, \pi/2] \mapsto [0, 1]\)이 순서대로 대응됩니다. 아래 문제는 순서가 뒤집히는 감소 치환의 경우입니다.`,
      en: String.raw`The increasing substitution \(u = \sin x\) (\(N = 50\)): \([0, \pi/2] \mapsto [0, 1]\) in order. The problem below is the decreasing case, where the order flips.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varphi(x) = -x\)는 \([-1, 0]\)에서 \(C^1\) 단조감소이고 \(\varphi'(x) = -1\)입니다.

치환 법칙의 다른 가정도 확인합니다: \(f(u) = e^u\)는 모든 구간에서 연속입니다.

치환 법칙에 의해 \(\int_{-1}^{0} f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(-1)}^{\varphi(0)} f(u)\,du\)이며, \(\varphi(-1) = 1\), \(\varphi(0) = 0\)이므로 우변은 \(\int_{1}^{0} e^u\,du = -\int_0^1 e^u\,du = -(e - 1) = 1 - e\)입니다 — 구간 방향이 뒤집혔습니다.`,
          en: String.raw`\(\varphi(x) = -x\) is \(C^1\) and decreasing on \([-1, 0]\) with \(\varphi'(x) = -1\).

Check the substitution rule's other hypothesis as well: \(f(u) = e^u\) is continuous on every interval.

The substitution rule gives \(\int_{-1}^{0} f(\varphi(x))\,\varphi'(x)\,dx = \int_{\varphi(-1)}^{\varphi(0)} f(u)\,du\); with \(\varphi(-1) = 1\) and \(\varphi(0) = 0\) the right side is \(\int_{1}^{0} e^u\,du = -\int_0^1 e^u\,du = -(e - 1) = 1 - e\) — the orientation flipped.`,
        },
      },
      {
        text: {
          ko: String.raw`직접 계산으로 검증: \(\int_{-1}^{0} e^{-x}\cdot(-1)\,dx\)에서 \(-e^{-x}\)의 원시함수는 \(e^{-x}\)이므로 (\(\frac{d}{dx}e^{-x} = -e^{-x}\)), 적분값은 \([e^{-x}]_{-1}^{0} = e^0 - e^1 = 1 - e\)입니다. 치환 법칙의 예측과 정확히 일치합니다.`,
          en: String.raw`Verify by direct computation: in \(\int_{-1}^{0} e^{-x}\cdot(-1)\,dx\), \(-e^{-x}\) has antiderivative \(e^{-x}\) (since \(\frac{d}{dx}e^{-x} = -e^{-x}\)), so the integral is \([e^{-x}]_{-1}^{0} = e^0 - e^1 = 1 - e\). Exactly what the substitution rule predicted.`,
        },
      },
    ],
  },
];
