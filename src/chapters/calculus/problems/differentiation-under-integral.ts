import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the differentiation-under-the-integral-sign
 * scene (F(x) = integral_0^1 t^x dt, x > 0). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/differentiation-under-integral.test.ts): F(1) = 1/2, F'(1) = -1/4,
 * F(2) = 1/3, F'(2) = -1/9; Simpson with n = 200 gives integral_0^1 t ln t dt
 * within 2e-6 of -1/4 and integral_0^1 t^2 ln t dt within 1e-8 of -1/9.
 * The bump counterexample (problem 3) uses exact values: integral_0^1 f(x,t) dt
 * = x on (0,1), right derivative 1 at 0, integral_0^1 f_x(0,t) dt = 0,
 * f(x,x/2) = 15/8, f_x(x,x/4) = -45/(32x).
 */
export const differentiationUnderIntegralProblems: readonly ProblemMeta[] = [
  {
    id: 'dui-direct',
    statement: {
      ko: String.raw`\(x > 0\)에 대해 \(F(x) = \int_0^1 t^x\,dt\)라 하세요. 직접 계산으로 \(F(x) = \frac{1}{x+1}\)이고 \(F'(x) = -\frac{1}{(x+1)^2}\)임을 보이고, 적분기호 아래에서 미분한 \(\int_0^1 t^x \ln t\,dt\)를 직접 계산(치환적분)하여 같은 값 \(-\frac{1}{(x+1)^2}\)이 됨을 완전히 증명하세요.`,
      en: String.raw`Let \(F(x) = \int_0^1 t^x\,dt\) for \(x > 0\). Show by direct computation that \(F(x) = \frac{1}{x+1}\) and \(F'(x) = -\frac{1}{(x+1)^2}\), and prove completely, by direct substitution, that differentiating under the integral sign gives the same value: \(\int_0^1 t^x \ln t\,dt = -\frac{1}{(x+1)^2}\).`,
    },
    display: [
      String.raw`F(x) = \frac{1}{x+1}, \qquad F'(x) = -\frac{1}{(x+1)^2} = \int_0^1 t^x \ln t\,dt`,
    ],
    preset: { x: 1, n: 200 },
    presetCaption: {
      ko: String.raw`\(x = 1\), \(n = 200\): 수치적분 \(\int_0^1 t\,dt = 0.5\) (해석값 \(\frac12\)과 일치), \(\int_0^1 t\ln t\,dt \approx -0.24999807\) — 해석값 \(-\frac14\)과의 오차 \(2 \times 10^{-6}\) 이내.`,
      en: String.raw`\(x = 1\), \(n = 200\): quadrature \(\int_0^1 t\,dt = 0.5\) (matches \(\frac12\)), \(\int_0^1 t\ln t\,dt \approx -0.24999807\) — within \(2 \times 10^{-6}\) of \(-\frac14\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x > 0\)을 고정합니다. \(t \in (0, 1]\)에서 \(t^x\)의 부정적분은 \(\frac{t^{x+1}}{x+1}\)이고, \(x + 1 > 0\)이므로 \(t \to 0^+\)에서 \(t^{x+1} \to 0\)입니다. 따라서 \(F(x) = \int_0^1 t^x\,dt = \left[\frac{t^{x+1}}{x+1}\right]_0^1 = \frac{1}{x+1}\)입니다. 이를 \(x\)로 미분하면 \(F'(x) = -\frac{1}{(x+1)^2}\)입니다.`,
          en: String.raw`Fix \(x > 0\). On \(t \in (0, 1]\) an antiderivative of \(t^x\) is \(\frac{t^{x+1}}{x+1}\), and \(t^{x+1} \to 0\) as \(t \to 0^+\) since \(x + 1 > 0\). Hence \(F(x) = \int_0^1 t^x\,dt = \left[\frac{t^{x+1}}{x+1}\right]_0^1 = \frac{1}{x+1}\). Differentiating in \(x\) gives \(F'(x) = -\frac{1}{(x+1)^2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 적분기호 아래에서 미분합니다. \(t \in (0, 1]\)에서 \(\frac{\partial}{\partial x} t^x = t^x \ln t\)입니다 (\(t^x = e^{x \ln t}\)를 미분). \(t = 0\)에서는 피적분함수를 \(0\)으로 정의합니다 — \(x > 0\)일 때 \(\lim_{t \to 0^+} t^x \ln t = 0\)이기 때문입니다.`,
          en: String.raw`Now differentiate under the integral sign. For \(t \in (0, 1]\), \(\frac{\partial}{\partial x} t^x = t^x \ln t\) (differentiate \(t^x = e^{x \ln t}\)). At \(t = 0\) define the integrand as \(0\) — because \(\lim_{t \to 0^+} t^x \ln t = 0\) for \(x > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\int_0^1 t^x \ln t\,dt\)를 치환 \(u = -(x+1)\ln t\)로 계산합니다. \(t \in (0, 1]\)일 때 \(u \in [0, \infty)\)이고, \(t = e^{-u/(x+1)}\), \(dt = -\frac{1}{x+1}e^{-u/(x+1)}\,du\)입니다. 따라서 \(t^x \ln t\,dt = \frac{u e^{-u}}{(x+1)^2}\,du\)이고, \(\int_0^1 t^x \ln t\,dt = -\frac{1}{(x+1)^2}\int_0^\infty u e^{-u}\,du\)입니다. 부분적분으로 \(\int_0^\infty u e^{-u}\,du = \left[-u e^{-u}\right]_0^\infty + \int_0^\infty e^{-u}\,du\)입니다. 경계항은 사라집니다: \(u = 0\)에서는 \(0\)이고, \(u \to \infty\)에서는 \(e^u \ge \frac{u^2}{2}\) (\(u \ge 0\))이므로 \(0 \le u e^{-u} \le \frac{2}{u} \to 0\)입니다. 따라서 적분값은 \(0 + 1 = 1\)이므로, 적분기호 아래 미분한 값은 \(-\frac{1}{(x+1)^2}\) — 직접 미분한 \(F'(x)\)와 정확히 일치합니다.`,
          en: String.raw`Compute \(\int_0^1 t^x \ln t\,dt\) with \(u = -(x+1)\ln t\). For \(t \in (0, 1]\), \(u \in [0, \infty)\), \(t = e^{-u/(x+1)}\), \(dt = -\frac{1}{x+1}e^{-u/(x+1)}\,du\). Then \(t^x \ln t\,dt = \frac{u e^{-u}}{(x+1)^2}\,du\), so \(\int_0^1 t^x \ln t\,dt = -\frac{1}{(x+1)^2}\int_0^\infty u e^{-u}\,du\). By parts, \(\int_0^\infty u e^{-u}\,du = \left[-u e^{-u}\right]_0^\infty + \int_0^\infty e^{-u}\,du\). The boundary term vanishes: it is \(0\) at \(u = 0\), and as \(u \to \infty\), \(e^u \ge \frac{u^2}{2}\) for \(u \ge 0\) gives \(0 \le u e^{-u} \le \frac{2}{u} \to 0\). Hence the integral is \(0 + 1 = 1\); the under-integral derivative equals \(-\frac{1}{(x+1)^2}\) — exactly the directly computed \(F'(x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`수치로 확인합니다: \(x = 1\)에서 해석값은 \(F(1) = \frac12\), \(F'(1) = -\frac14\)입니다. 씬에서 \(n = 200\)으로 심슨 공식을 돌리면 \(\int_0^1 t\,dt = 0.5\)가 정확히 나오고, \(\int_0^1 t\ln t\,dt\)는 \(-\frac14\)과의 오차가 \(2 \times 10^{-6}\) 이내입니다 — 세 추정값이 한 점으로 모입니다.`,
          en: String.raw`Numerically: at \(x = 1\) the analytic values are \(F(1) = \frac12\), \(F'(1) = -\frac14\). In the scene with \(n = 200\) Simpson panels, \(\int_0^1 t\,dt = 0.5\) exactly, and \(\int_0^1 t\ln t\,dt\) lands within \(2 \times 10^{-6}\) of \(-\frac14\) — all three estimates converge to one point.`,
        },
      },
    ],
  },
  {
    id: 'dui-justification',
    statement: {
      ko: String.raw`\(f(t, x) = t^x\), \(\frac{\partial f}{\partial x}(t, x) = t^x \ln t\) (\(t \in [0, 1]\), \(t = 0\)에서는 값을 \(0\)으로 정의)라 하세요. \(0 < \delta < A\)에 대해 \(f\)와 \(\frac{\partial f}{\partial x}\)가 직사각형 \([\delta, A] \times [0, 1]\) 위에서 연속임을 보이고, 이를 이용해 모든 \(x > 0\)에서 \(F'(x) = \int_0^1 t^x \ln t\,dt\)임을 엄밀히 증명하세요.`,
      en: String.raw`Let \(f(t, x) = t^x\), \(\frac{\partial f}{\partial x}(t, x) = t^x \ln t\) (\(t \in [0, 1]\), defined as \(0\) at \(t = 0\)). For \(0 < \delta < A\), show that \(f\) and \(\frac{\partial f}{\partial x}\) are continuous on the rectangle \([\delta, A] \times [0, 1]\), and use this to prove rigorously that \(F'(x) = \int_0^1 t^x \ln t\,dt\) for every \(x > 0\).`,
    },
    display: [
      String.raw`f, f_x \text{ continuous on } [\delta, A] \times [0, 1] \;\Rightarrow\; \frac{d}{dx}\int_0^1 f\,dt = \int_0^1 f_x\,dt`,
      String.raw`\left|t^x \ln t\right| \le t^{\delta}\,|\ln t| \xrightarrow[t \to 0^+]{} 0 \quad (x \ge \delta > 0)`,
    ],
    preset: { x: 2, n: 200 },
    presetCaption: {
      ko: String.raw`\(x = 2\), \(n = 200\): \(\int_0^1 t^2 \ln t\,dt\)의 수치값과 \(-\frac19\)의 오차가 \(10^{-8}\) 이내 — \([1, 4] \times [0, 1]\) 위의 연속성이 보장하는 일치입니다.`,
      en: String.raw`\(x = 2\), \(n = 200\): the quadrature of \(\int_0^1 t^2 \ln t\,dt\) is within \(10^{-8}\) of \(-\frac19\) — the agreement that continuity on \([1, 4] \times [0, 1]\) guarantees.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 연속성을 확인합니다. \(t > 0\)에서는 \(t^x = e^{x\ln t}\)가 \((t, x)\)의 연속함수이므로 \(f\)와 \(f_x\) 모두 연속입니다. \(t = 0\)에서는 값을 \(0\)으로 정의했는데, \(x \ge \delta > 0\)일 때 \(|t^x \ln t| = t^x |\ln t| \le t^{\delta}|\ln t|\)이고 \(t^{\delta}|\ln t| \to 0\) (\(t \to 0^+\))이므로, \(t = 0\)에서의 극한도 \(0\) — 그것도 \(x \in [\delta, A]\)에 대해 균등하게 성립합니다. 따라서 \(f\)와 \(f_x\)는 컴팩트 직사각형 \([\delta, A] \times [0, 1]\) 위에서 연속입니다.`,
          en: String.raw`First, continuity. For \(t > 0\), \(t^x = e^{x\ln t}\) is continuous in \((t, x)\), so both \(f\) and \(f_x\) are continuous there. At \(t = 0\) we defined the value as \(0\); for \(x \ge \delta > 0\), \(|t^x \ln t| = t^x |\ln t| \le t^{\delta}|\ln t| \to 0\) as \(t \to 0^+\), uniformly in \(x \in [\delta, A]\). Hence \(f\) and \(f_x\) are continuous on the compact rectangle \([\delta, A] \times [0, 1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 정리를 증명합니다: \(f\), \(f_x\)가 \([a, b] \times [c, d]\) 위에서 연속이면 \(F(x) = \int_c^d f(t, x)\,dt\)는 미분가능하고 \(F'(x_0) = \int_c^d f_x(t, x_0)\,dt\)입니다. 차분몫을 쓰면 \(\frac{F(x_0+h) - F(x_0)}{h} = \int_c^d \frac{f(t, x_0+h) - f(t, x_0)}{h}\,dt\)입니다. 평균값 정리의 중간점을 고르는 방식은 (\(t\)에 대한 가측성을 보장할 수 없습니다) 피하고 적분 형태를 씁니다: \(f_x\)가 \(x\)에 대해 연속이므로 \(f(t, x_0+h) - f(t, x_0) = \int_{x_0}^{x_0+h} f_x(t, u)\,du = h \int_0^1 f_x(t, x_0 + \theta h)\,d\theta\)이고, 따라서 \(\frac{f(t, x_0+h) - f(t, x_0)}{h} - f_x(t, x_0) = \int_0^1 \left(f_x(t, x_0 + \theta h) - f_x(t, x_0)\right)\,d\theta\)입니다. 절댓값을 취하면 \(\left|\frac{f(t, x_0+h) - f(t, x_0)}{h} - f_x(t, x_0)\right| \le \sup_{|u - x_0| \le |h|} |f_x(t, u) - f_x(t, x_0)|\)입니다. \(f_x\)가 컴팩트 직사각형 위에서 균등연속이므로 이 상한은 \(h \to 0\)일 때 \(t\)에 대해 균등하게 \(0\)으로 갑니다. 따라서 \(\left|\frac{F(x_0+h)-F(x_0)}{h} - \int_c^d f_x(t, x_0)\,dt\right| \le (d-c)\sup_t \sup_{|u - x_0| \le |h|} |f_x(t, u) - f_x(t, x_0)| \to 0\) — 적분과 극한의 교환이 정당화됩니다.`,
          en: String.raw`Now prove the theorem: if \(f\), \(f_x\) are continuous on \([a, b] \times [c, d]\), then \(F(x) = \int_c^d f(t, x)\,dt\) is differentiable with \(F'(x_0) = \int_c^d f_x(t, x_0)\,dt\). The difference quotient is \(\frac{F(x_0+h) - F(x_0)}{h} = \int_c^d \frac{f(t, x_0+h) - f(t, x_0)}{h}\,dt\). Avoid selecting a mean-value point (its measurability in \(t\) is not guaranteed) and use the integral form instead: since \(f_x\) is continuous in \(x\), \(f(t, x_0+h) - f(t, x_0) = \int_{x_0}^{x_0+h} f_x(t, u)\,du = h \int_0^1 f_x(t, x_0 + \theta h)\,d\theta\), so \(\frac{f(t, x_0+h) - f(t, x_0)}{h} - f_x(t, x_0) = \int_0^1 \left(f_x(t, x_0 + \theta h) - f_x(t, x_0)\right)\,d\theta\). Taking absolute values, \(\left|\frac{f(t, x_0+h) - f(t, x_0)}{h} - f_x(t, x_0)\right| \le \sup_{|u - x_0| \le |h|} |f_x(t, u) - f_x(t, x_0)|\). Since \(f_x\) is uniformly continuous on the compact rectangle, this bound tends to \(0\) uniformly in \(t\) as \(h \to 0\). Hence \(\left|\frac{F(x_0+h)-F(x_0)}{h} - \int_c^d f_x(t, x_0)\,dt\right| \le (d-c)\sup_t \sup_{|u - x_0| \le |h|} |f_x(t, u) - f_x(t, x_0)| \to 0\) — the limit-integral interchange is justified.`,
        },
      },
      {
        text: {
          ko: String.raw`임의의 \(x_0 > 0\)에 대해 \(\delta = x_0/2\), \(A = 2x_0\)으로 두면 \(x_0\)은 \([\delta, A]\)의 내점입니다. 1단계의 연속성과 2단계의 정리로부터 \(F'(x_0) = \int_0^1 t^{x_0}\ln t\,dt\)이고, 문제 1의 직접 계산으로 이 값은 \(-\frac{1}{(x_0+1)^2}\)입니다. 즉 씬에서 세 추정값이 모이는 것은 우연이 아니라, 컴팩트 직사각형 위의 균등연속성이 강제하는 필연입니다.`,
          en: String.raw`For any \(x_0 > 0\), put \(\delta = x_0/2\), \(A = 2x_0\), so \(x_0\) is interior to \([\delta, A]\). Continuity from step 1 plus the theorem from step 2 give \(F'(x_0) = \int_0^1 t^{x_0}\ln t\,dt\), which equals \(-\frac{1}{(x_0+1)^2}\) by the direct computation of problem 1. So the three estimates meeting in the scene is no accident — it is forced by uniform continuity on the compact rectangle.`,
        },
      },
      {
        text: {
          ko: String.raw`수치로 확인합니다: \(x = 2\)에서 해석값은 \(F(2) = \frac13\), \(F'(2) = -\frac19\)입니다. \(n = 200\)일 때 \(\int_0^1 t^2 \ln t\,dt\)의 심슨 근사 오차는 \(10^{-8}\) 이내입니다. \(t = 0\) 근처에서 \(\ln t\)가 발산해도 \(t^2\)이 눌러주어(\(t^2|\ln t| \to 0\)) 적분이 멀쩡히 수렴하는 모습이 수치에도 드러납니다.`,
          en: String.raw`Numerically: at \(x = 2\) the analytic values are \(F(2) = \frac13\), \(F'(2) = -\frac19\). With \(n = 200\) the Simpson approximation of \(\int_0^1 t^2 \ln t\,dt\) is within \(10^{-8}\). Even though \(\ln t\) blows up near \(t = 0\), the factor \(t^2\) tames it (\(t^2|\ln t| \to 0\)), and the numerics show the integral converging cleanly.`,
        },
      },
    ],
  },
  {
    id: 'dui-counterexample',
    statement: {
      ko: String.raw`\(\varphi(u) = 30u^2(1-u)^2\) (\(0 < u < 1\)), 그 외에서는 \(0\)이라 하고, \(f(x, t) = \varphi(t/x)\) (\(x > 0\), \(0 < t < x\)), 그 외에서는 \(0\)이라 하세요 (\(x, t \in [0, 1]\)). \(F(x) = \int_0^1 f(x, t)\,dt\)라 할 때, (가) \(0 < x < 1\)에서 \(F(x) = x\)이므로 \(0\)에서의 우미분계수는 \(1\)임, (나) 모든 \(t \in [0, 1]\)에 대해 \(\frac{\partial f}{\partial x}(0, t) = 0\)이므로 \(\int_0^1 \frac{\partial f}{\partial x}(0, t)\,dt = 0\)임, (다) 따라서 적분기호 아래 미분 공식이 \(x = 0\)에서 성립하지 않음을 보이세요. (라) 가정이 어디서 깨지는지도 밝히세요.`,
      en: String.raw`Let \(\varphi(u) = 30u^2(1-u)^2\) (\(0 < u < 1\)), \(0\) elsewhere, and \(f(x, t) = \varphi(t/x)\) (\(x > 0\), \(0 < t < x\)), \(0\) elsewhere (\(x, t \in [0, 1]\)). With \(F(x) = \int_0^1 f(x, t)\,dt\), show (a) \(F(x) = x\) for \(0 < x < 1\), so the right derivative at \(0\) is \(1\); (b) \(\frac{\partial f}{\partial x}(0, t) = 0\) for every \(t \in [0, 1]\), so \(\int_0^1 \frac{\partial f}{\partial x}(0, t)\,dt = 0\); (c) hence the under-integral differentiation formula fails at \(x = 0\). (d) Pinpoint where the hypotheses break.`,
    },
    display: [
      String.raw`F(x) = x\;(0 < x < 1), \quad F'_+(0) = 1 \ne 0 = \int_0^1 f_x(0, t)\,dt`,
      String.raw`f(x, x/2) = \tfrac{15}{8} \not\to 0 = f(0, 0), \qquad f_x(x, x/4) = -\tfrac{45}{32x} \to -\infty`,
    ],
    preset: { x: 1, n: 200 },
    presetCaption: {
      ko: String.raw`이 문제는 씬의 \(t^x\)가 아닌 "혹" 반례에 대한 것입니다 — 프리셋은 씬 기본값 \(x = 1\), \(n = 200\).`,
      en: String.raw`This problem is about the "bump" counterexample, not the scene's \(t^x\) — the preset is the scene default \(x = 1\), \(n = 200\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(\int_0^1 \varphi = 1\)임을 확인합니다: \(\int_0^1 30u^2(1-u)^2\,du = 30\int_0^1 (u^2 - 2u^3 + u^4)\,du = 30\left(\frac13 - \frac12 + \frac15\right) = 30 \cdot \frac{1}{30} = 1\)입니다. 이제 \(0 < x < 1\)일 때 \(F(x) = \int_0^1 f(x, t)\,dt = \int_0^x 30(t/x)^2(1-t/x)^2\,dt\)입니다 (\(0 < t < x\)에서만 \(0\)이 아니므로). 치환 \(u = t/x\)로 \(F(x) = x\int_0^1 30u^2(1-u)^2\,du = x \cdot 1 = x\)입니다. \(F(0) = 0\)이므로 \(0\)에서의 우미분계수는 \(\lim_{h \to 0^+} \frac{F(h) - F(0)}{h} = \lim_{h \to 0^+} \frac{h}{h} = 1\)입니다.`,
          en: String.raw`First check \(\int_0^1 \varphi = 1\): \(\int_0^1 30u^2(1-u)^2\,du = 30\int_0^1 (u^2 - 2u^3 + u^4)\,du = 30\left(\frac13 - \frac12 + \frac15\right) = 30 \cdot \frac{1}{30} = 1\). For \(0 < x < 1\), \(F(x) = \int_0^1 f(x, t)\,dt = \int_0^x 30(t/x)^2(1-t/x)^2\,dt\) (nonzero only for \(0 < t < x\)). With \(u = t/x\), \(F(x) = x\int_0^1 30u^2(1-u)^2\,du = x \cdot 1 = x\). Since \(F(0) = 0\), the right derivative at \(0\) is \(\lim_{h \to 0^+} \frac{F(h) - F(0)}{h} = \lim_{h \to 0^+} \frac{h}{h} = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`다음으로 \(\frac{\partial f}{\partial x}(0, t) = 0\)임을 보입니다. \(t > 0\)을 고정하면, \(0 < h < t\)일 때 \(t < h\)가 거짓이므로 \(f(h, t) = 0\)입니다 (\(f\)가 \(0\)이 아닌 조건은 \(0 < t < h\)). 따라서 차분몫 \(\frac{f(h, t) - f(0, t)}{h} = 0\)이 \(h < t\)인 모든 \(h\)에 대해 성립하고, 극한은 \(0\)입니다. \(t = 0\)에서도 \(f(h, 0) = 0\)이므로 차분몫은 \(0\)입니다. 즉 모든 \(t \in [0, 1]\)에 대해 \(\frac{\partial f}{\partial x}(0, t) = 0\)이고, \(\int_0^1 \frac{\partial f}{\partial x}(0, t)\,dt = 0 \ne 1\) — 우미분계수와 다릅니다. 적분기호 아래 미분 공식이 \(x = 0\)에서 깨집니다.`,
          en: String.raw`Next, \(\frac{\partial f}{\partial x}(0, t) = 0\). Fix \(t > 0\): for \(0 < h < t\) we have \(t < h\) false, so \(f(h, t) = 0\) (\(f\) is nonzero only when \(0 < t < h\)). Hence the difference quotient \(\frac{f(h, t) - f(0, t)}{h} = 0\) for every \(h < t\), and the limit is \(0\). At \(t = 0\), \(f(h, 0) = 0\) too. So \(\frac{\partial f}{\partial x}(0, t) = 0\) for every \(t \in [0, 1]\), and \(\int_0^1 \frac{\partial f}{\partial x}(0, t)\,dt = 0 \ne 1\) — different from the right derivative. The under-integral formula breaks at \(x = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`깨진 가정을 찾습니다. 직선 \(t = x/2\) 위에서 \(f(x, x/2) = 30\left(\frac12\right)^2\left(\frac12\right)^2 = \frac{15}{8} = 1.875\)로 \(x\)와 무관한 상수이므로, \((x, x/2) \to (0, 0)\)인데도 \(f \to 1.875 \ne 0 = f(0, 0)\) — \(f\) 자체가 \((0, 0)\)에서 불연속입니다. 편도함수는 더 심합니다: \(u = t/x\)라 두면 \(\frac{\partial f}{\partial x} = -\frac{60u^2(1-u)(1-2u)}{x}\) (\(0 < t < x\))이고, 직선 \(t = x/4\) (\(u = 1/4\)) 위에서 \(\frac{\partial f}{\partial x} = -\frac{45}{32x} \to -\infty\) (\(x \to 0^+\)). 즉 \(f_x\)는 \((0, 0)\)의 모든 근처에서 무계(unbounded)이므로 균등연속일 수 없고, 문제 2의 증명에서 "차분몫이 균등하게 수렴한다"는 핵심 단계가 무너집니다. 연속성 가정이 없으면 적분과 극한의 교환은 보장되지 않습니다 — 이것이 반례의 교훈입니다.`,
          en: String.raw`Now locate the broken hypothesis. On the line \(t = x/2\), \(f(x, x/2) = 30\left(\frac12\right)^2\left(\frac12\right)^2 = \frac{15}{8} = 1.875\), independent of \(x\); so \(f \to 1.875 \ne 0 = f(0, 0)\) along \((x, x/2) \to (0, 0)\) — \(f\) itself is discontinuous at \((0, 0)\). The partial derivative is worse: with \(u = t/x\), \(\frac{\partial f}{\partial x} = -\frac{60u^2(1-u)(1-2u)}{x}\) (\(0 < t < x\)), and on the line \(t = x/4\) (\(u = 1/4\)) this is \(-\frac{45}{32x} \to -\infty\) as \(x \to 0^+\). So \(f_x\) is unbounded in every neighborhood of \((0, 0)\), cannot be uniformly continuous, and the key step of problem 2's proof — uniform convergence of the difference quotients — collapses. Without the continuity hypotheses, the limit-integral interchange is not guaranteed — that is the moral of the counterexample.`,
        },
      },
    ],
  },
];
