import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the discontinuous-derivative scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/discontinuous-derivative.test.ts): f(0.5),
 * f'(0.5), the difference quotient h sin(1/h) at h = 0.01, the sequence
 * values f'(1/(2 pi n)) = -1, and max |f'| staying near 1 as the window
 * shrinks.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'dd-derivative-at-zero',
    statement: {
      ko: String.raw`\(f(x) = x^2\sin(1/x)\) (\(x \ne 0\)), \(f(0) = 0\)에 대해 조임 정리(squeeze theorem)로 \(f'(0) = 0\)임을 완전히 증명하세요.`,
      en: String.raw`For \(f(x) = x^2\sin(1/x)\) (\(x \ne 0\)), \(f(0) = 0\), prove completely by the squeeze theorem that \(f'(0) = 0\).`,
    },
    display: [
      String.raw`\frac{f(h) - f(0)}{h} = h\sin\frac{1}{h}, \qquad \left|h\sin\frac{1}{h}\right| \le |h| \to 0`,
    ],
    preset: { logR: -1, logH: -2 },
    presetCaption: {
      ko: String.raw`\(r = 0.1\), \(h = 0.01\): 차분몫 \(\approx -0.0051\)로 0에 가깝고, 왼쪽 패널의 할선 기울기가 0인 접선(점선)으로 수렴하는 모습이 보입니다.`,
      en: String.raw`\(r = 0.1\), \(h = 0.01\): the difference quotient \(\approx -0.0051\) is near 0, and the left panel shows the secant slope collapsing onto the horizontal (dashed) tangent.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`도함수의 정의에 따라 \(f'(0) = \lim_{h \to 0} \frac{f(h) - f(0)}{h}\)입니다 (\(h \ne 0\)). \(f(0) = 0\)이고 \(h \ne 0\)에서 \(f(h) = h^2\sin(1/h)\)이므로, 차분몫은 \(\frac{h^2\sin(1/h) - 0}{h} = h\sin(1/h)\)로 간단해집니다.`,
          en: String.raw`By the definition of the derivative, \(f'(0) = \lim_{h \to 0} \frac{f(h) - f(0)}{h}\) (\(h \ne 0\)). Since \(f(0) = 0\) and \(f(h) = h^2\sin(1/h)\) for \(h \ne 0\), the difference quotient simplifies to \(\frac{h^2\sin(1/h) - 0}{h} = h\sin(1/h)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|\sin(1/h)| \le 1\)이므로 \(|h\sin(1/h)| \le |h|\)입니다. \(|h| \to 0\) (\(h \to 0\))이므로 조임 정리에 의해 \(h\sin(1/h) \to 0\) — 즉 차분몫의 극한이 존재하고 \(f'(0) = 0\)입니다. 진동하는 \(\sin(1/h)\) 인자는 \(h\)라는 감쇠 인자에 완전히 눌립니다.`,
          en: String.raw`Since \(|\sin(1/h)| \le 1\), we have \(|h\sin(1/h)| \le |h|\). As \(|h| \to 0\) (\(h \to 0\)), the squeeze theorem gives \(h\sin(1/h) \to 0\) — the limit of the difference quotient exists and \(f'(0) = 0\). The oscillating factor \(\sin(1/h)\) is completely damped by the factor \(h\).`,
        },
      },
      {
        text: {
          ko: String.raw`씬에서 \(h\)를 \(0.0001\)까지 줄이면 차분몫이 0으로 수렴하는 것을 수치로 확인할 수 있습니다 (\(|h\sin(1/h)| \le |h|\) bound와 함께).`,
          en: String.raw`In the scene, shrinking \(h\) down to \(0.0001\) shows the difference quotient converging to 0 numerically (alongside the bound \(|h\sin(1/h)| \le |h|\)).`,
        },
      },
    ],
  },
  {
    id: 'dd-derivative-formula',
    statement: {
      ko: String.raw`\(x \ne 0\)에서 곱의 법칙과 연쇄 법칙으로 \(f'(x) = 2x\sin(1/x) - \cos(1/x)\)임을 완전히 증명하세요.`,
      en: String.raw`Prove completely, via the product and chain rules, that \(f'(x) = 2x\sin(1/x) - \cos(1/x)\) for \(x \ne 0\).`,
    },
    display: [
      String.raw`f'(x) = \frac{d}{dx}\left[x^2\sin\frac{1}{x}\right] = 2x\sin\frac{1}{x} - \cos\frac{1}{x} \qquad (x \ne 0)`,
    ],
    preset: { logR: -1, logH: -2 },
    presetCaption: {
      ko: String.raw`\(r = 0.1\): 오른쪽 패널이 바로 이 공식의 그래프 — \(2x\sin(1/x)\) 항은 0으로 감쇠하지만 \(-\cos(1/x)\) 항은 진폭 1로 계속 진동합니다.`,
      en: String.raw`\(r = 0.1\): the right panel plots exactly this formula — the \(2x\sin(1/x)\) term decays to 0 while the \(-\cos(1/x)\) term keeps oscillating with amplitude 1.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x \ne 0\)을 고정합니다. \(f(x) = x^2 \cdot \sin(1/x)\)는 두 미분가능 함수의 곱이므로 곱의 법칙을 적용합니다: \(f'(x) = 2x \cdot \sin(1/x) + x^2 \cdot \frac{d}{dx}\sin(1/x)\).`,
          en: String.raw`Fix \(x \ne 0\). Since \(f(x) = x^2 \cdot \sin(1/x)\) is a product of differentiable functions, apply the product rule: \(f'(x) = 2x \cdot \sin(1/x) + x^2 \cdot \frac{d}{dx}\sin(1/x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`연쇄 법칙으로 \(\frac{d}{dx}\sin(1/x) = \cos(1/x) \cdot \frac{d}{dx}(1/x) = \cos(1/x) \cdot (-1/x^2)\)입니다 (\(x \ne 0\)에서 \(1/x\)가 미분가능하므로). 대입하면 \(f'(x) = 2x\sin(1/x) + x^2 \cdot \cos(1/x) \cdot (-1/x^2) = 2x\sin(1/x) - \cos(1/x)\) — 증명 완료.`,
          en: String.raw`By the chain rule, \(\frac{d}{dx}\sin(1/x) = \cos(1/x) \cdot \frac{d}{dx}(1/x) = \cos(1/x) \cdot (-1/x^2)\) (since \(1/x\) is differentiable at \(x \ne 0\)). Substituting, \(f'(x) = 2x\sin(1/x) + x^2 \cdot \cos(1/x) \cdot (-1/x^2) = 2x\sin(1/x) - \cos(1/x)\) — proved.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인: \(f'(0.5) = 2(0.5)\sin 2 - \cos 2 \approx 1.3254\)로 모델 값과 일치합니다. 이 공식은 \(x = 0\)에서는 정의되지 않습니다 — 문제 1에서 본 것처럼 \(f'(0)\)은 차분몫의 극한으로 따로 구해야 합니다.`,
          en: String.raw`Numerical check: \(f'(0.5) = 2(0.5)\sin 2 - \cos 2 \approx 1.3254\), matching the model. This formula is not defined at \(x = 0\) — \(f'(0)\) must be computed separately as the limit of the difference quotient, as in problem 1.`,
        },
      },
    ],
  },
  {
    id: 'dd-discontinuous-at-zero',
    statement: {
      ko: String.raw`\(f'\)가 \(x = 0\)에서 불연속임을 수열 \(x_n = 1/(2\pi n)\)을 이용해 완전히 증명하세요.`,
      en: String.raw`Prove completely, using the sequence \(x_n = 1/(2\pi n)\), that \(f'\) is discontinuous at \(x = 0\).`,
    },
    display: [
      String.raw`x_n = \frac{1}{2\pi n} \to 0, \qquad f'(x_n) = 2x_n\sin(2\pi n) - \cos(2\pi n) = -1 \ne 0 = f'(0)`,
    ],
    preset: { logR: -2, logH: -3 },
    presetCaption: {
      ko: String.raw`\(r = 0.01\), \(h = 0.001\): 0에 더 가까이 확대해도 오른쪽 패널의 진동은 멈추지 않고, 강조된 점 \(x_n = 1/(2\pi n)\)들은 계속 \(y = -1\) (점선) 위에 찍힙니다.`,
      en: String.raw`\(r = 0.01\), \(h = 0.001\): zooming closer to 0, the right panel never stops oscillating, and the highlighted points \(x_n = 1/(2\pi n)\) keep landing on the dashed line \(y = -1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x_n = 1/(2\pi n)\)이라 두면 \(x_n \ne 0\)이고 \(x_n \to 0\)입니다. 문제 2의 공식에 대입하면 \(f'(x_n) = 2x_n\sin(1/x_n) - \cos(1/x_n) = 2x_n\sin(2\pi n) - \cos(2\pi n)\)입니다. \(\sin(2\pi n) = 0\), \(\cos(2\pi n) = 1\)이므로 \(f'(x_n) = 0 - 1 = -1\) — 모든 \(n\)에 대해 상수입니다.`,
          en: String.raw`Set \(x_n = 1/(2\pi n)\); then \(x_n \ne 0\) and \(x_n \to 0\). Plugging into problem 2's formula, \(f'(x_n) = 2x_n\sin(1/x_n) - \cos(1/x_n) = 2x_n\sin(2\pi n) - \cos(2\pi n)\). Since \(\sin(2\pi n) = 0\) and \(\cos(2\pi n) = 1\), we get \(f'(x_n) = 0 - 1 = -1\) — constant for every \(n\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(f'(x_n) \to -1\)이지만 문제 1에서 \(f'(0) = 0\)이므로, \(x_n \to 0\)임에도 \(f'(x_n) \not\to f'(0)\)입니다. 수열 판정법(sequential criterion)에 의해 \(f'\)는 \(0\)에서 연속이 아닙니다 — \(\lim_{x \to 0} f'(x)\) 자체가 존재하지 않습니다 (오른쪽 패널의 멈추지 않는 진동).`,
          en: String.raw`Hence \(f'(x_n) \to -1\), but \(f'(0) = 0\) by problem 1, so \(f'(x_n) \not\to f'(0)\) even though \(x_n \to 0\). By the sequential criterion, \(f'\) is not continuous at \(0\) — \(\lim_{x \to 0} f'(x)\) does not even exist (the never-ending oscillation in the right panel).`,
        },
      },
      {
        text: {
          ko: String.raw`덧붙임: 도함수가 불연속이어도 중간값 성질은 잃지 않습니다 — 다르부 정리(Darboux's theorem)에 의해 \(f'\)는 구간 위에서 IVP를 만족합니다. 미분가능성은 도함수의 연속성보다 약한 조건입니다.`,
          en: String.raw`Remark: a discontinuous derivative still has the intermediate value property — by Darboux's theorem, \(f'\) satisfies the IVP on intervals. Differentiability is strictly weaker than continuity of the derivative.`,
        },
      },
    ],
  },
];
