import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Bohr-Mollerup scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/bohr-mollerup.test.ts):
 *   preset { amp: 0.3, probe: 0.6 }: secant violation of ln f_a ~ 0.297 (> 0),
 *   secant violation of ln Gamma < 1e-9 (measured ~4e-17): convexity holds.
 *   f_a(1) = 1 within 1e-9; f_a(x+1) = x f_a(x) with relative error < 1e-12;
 *   f_a(x) > 0 on [0.05, 3] for a in {0, 0.3, 0.5} (measured minimum ~0.46).
 */
export const bohrMollerupProblems: readonly ProblemMeta[] = [
  {
    id: 'factorial',
    statement: {
      ko: String.raw`\(f: (0,\infty) \to (0,\infty)\)가 \(f(1) = 1\)과 \(f(x+1) = x\,f(x)\) (\(x > 0\))를 만족한다고 하자. 모든 양의 정수 \(n\)에 대해 \(f(n) = (n-1)!\)임을 증명하세요.`,
      en: String.raw`Let \(f: (0,\infty) \to (0,\infty)\) satisfy \(f(1) = 1\) and \(f(x+1) = x\,f(x)\) for all \(x > 0\). Prove that \(f(n) = (n-1)!\) for every positive integer \(n\).`,
    },
    display: [String.raw`f(1) = 1, \qquad f(x+1) = x\,f(x) \quad \Longrightarrow \quad f(n) = (n-1)!`],
    preset: { amp: 0.3, probe: 0.6 },
    presetCaption: {
      ko: String.raw`\(a = 0.3\), \(x_0 = 0.6\)에서 impostor \(\ln f_a\)의 secant 위반량 \(\approx 0.297 > 0\) (볼록성 깨짐), \(\ln\Gamma\)의 위반량은 \(10^{-9}\) 미만 (볼록성 유지).`,
      en: String.raw`At \(a = 0.3\), \(x_0 = 0.6\): the impostor \(\ln f_a\) has secant violation \(\approx 0.297 > 0\) (convexity broken), while \(\ln\Gamma\) has violation below \(10^{-9}\) (convexity holds).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`밑 단계: \(f(1) = 1 = 0!\) — 가정에 의해 주어집니다.`,
          en: String.raw`Base case: \(f(1) = 1 = 0!\) — given by hypothesis.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(f(k) = (k-1)!\)이라 가정합니다. 점화식을 \(x = k\)에 적용하면 \(f(k+1) = k \cdot f(k) = k \cdot (k-1)! = k!\)이 됩니다.`,
          en: String.raw`Inductive step: assume \(f(k) = (k-1)!\). Applying the recurrence at \(x = k\) gives \(f(k+1) = k \cdot f(k) = k \cdot (k-1)! = k!\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 수학적 귀납법으로 모든 양의 정수 \(n\)에 대해 \(f(n) = (n-1)!\)입니다.`,
          en: String.raw`By mathematical induction, \(f(n) = (n-1)!\) for every positive integer \(n\).`,
        },
      },
      {
        text: {
          ko: String.raw`교훈: 이 증명은 처음 두 조건만 사용합니다 — 정수 사이에서는 \(f\)가 전혀 결정되지 않습니다. 실제로 impostor \(f_a(x) = \Gamma(x)(1 + a\sin 2\pi x)\)는 \(\sin 2\pi n = 0\)이므로 모든 정수 \(n\)에서 \(\Gamma\)와 완전히 일치하면서도, 정수 사이에서는 전혀 다른 함수입니다. 세 번째 조건(로그볼록성)이 바로 이 틈을 메웁니다.`,
          en: String.raw`The lesson: this proof uses only the first two conditions — \(f\) is not determined at all between the integers. Indeed the impostor \(f_a(x) = \Gamma(x)(1 + a\sin 2\pi x)\) matches \(\Gamma\) exactly at every integer \(n\) (since \(\sin 2\pi n = 0\)) while differing wildly between them. The third condition (log-convexity) is what closes this gap.`,
        },
      },
    ],
  },
  {
    id: 'gamma-log-convex',
    statement: {
      ko: String.raw`Hölder 부등식을 이용해 \(\Gamma\)가 로그볼록함을 증명하세요: \(\varphi(x) = \ln\Gamma(x)\)가 \((0,\infty)\)에서 볼록함수임을 보이세요.`,
      en: String.raw`Use Hölder's inequality to prove that \(\Gamma\) is log-convex: show \(\varphi(x) = \ln\Gamma(x)\) is convex on \((0,\infty)\).`,
    },
    display: [
      String.raw`\Gamma(tx + (1-t)y) \le \Gamma(x)^t\,\Gamma(y)^{1-t} \qquad (0 < t < 1,\; x, y > 0)`,
      String.raw`\text{H\"older: } \int FG \le \left(\int F^p\right)^{1/p}\left(\int G^q\right)^{1/q}, \quad \frac1p + \frac1q = 1`,
    ],
    preset: { amp: 0.3, probe: 0.6 },
    presetCaption: {
      ko: String.raw`\(a = 0.3\), \(x_0 = 0.6\)에서 impostor \(\ln f_a\)의 secant 위반량 \(\approx 0.297 > 0\) (볼록성 깨짐), \(\ln\Gamma\)의 위반량은 \(10^{-9}\) 미만 (볼록성 유지).`,
      en: String.raw`At \(a = 0.3\), \(x_0 = 0.6\): the impostor \(\ln f_a\) has secant violation \(\approx 0.297 > 0\) (convexity broken), while \(\ln\Gamma\) has violation below \(10^{-9}\) (convexity holds).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(0 < t < 1\), \(x, y > 0\)이라 하고 \(z = tx + (1-t)y\)라 둡니다. \(\Gamma(z) = \int_0^\infty s^{z-1} e^{-s}\,ds\)의 피적분함수를 쪼갭니다: \(s^{z-1} e^{-s} = \left(s^{x-1} e^{-s}\right)^t \cdot \left(s^{y-1} e^{-s}\right)^{1-t}\) — 지수를 확인하면 \(t(x-1) + (1-t)(y-1) = z - 1\)이고 \(e^{-s}\)의 지수는 \(t + (1-t) = 1\)입니다.`,
          en: String.raw`Let \(0 < t < 1\), \(x, y > 0\), and \(z = tx + (1-t)y\). Split the integrand of \(\Gamma(z) = \int_0^\infty s^{z-1} e^{-s}\,ds\): \(s^{z-1} e^{-s} = \left(s^{x-1} e^{-s}\right)^t \cdot \left(s^{y-1} e^{-s}\right)^{1-t}\) — checking exponents, \(t(x-1) + (1-t)(y-1) = z - 1\) and the exponent of \(e^{-s}\) is \(t + (1-t) = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(F = \left(s^{x-1} e^{-s}\right)^t\), \(G = \left(s^{y-1} e^{-s}\right)^{1-t}\)라 두고 지수 \(p = \frac1t\), \(q = \frac{1}{1-t}\) (\(\frac1p + \frac1q = 1\))로 Hölder 부등식을 적용하면 \(\int_0^\infty FG \le \left(\int_0^\infty F^p\right)^{1/p} \left(\int_0^\infty G^q\right)^{1/q}\)을 얻습니다.`,
          en: String.raw`Set \(F = \left(s^{x-1} e^{-s}\right)^t\), \(G = \left(s^{y-1} e^{-s}\right)^{1-t}\) and apply Hölder with exponents \(p = \frac1t\), \(q = \frac{1}{1-t}\) (so \(\frac1p + \frac1q = 1\)): \(\int_0^\infty FG \le \left(\int_0^\infty F^p\right)^{1/p} \left(\int_0^\infty G^q\right)^{1/q}\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(F^p = s^{x-1} e^{-s}\), \(G^q = s^{y-1} e^{-s}\)이므로 우변은 \(\Gamma(x)^t\,\Gamma(y)^{1-t}\)가 됩니다. 즉 \(\Gamma(tx + (1-t)y) \le \Gamma(x)^t\,\Gamma(y)^{1-t}\) — 양변에 로그를 취하면 \(\varphi(tx + (1-t)y) \le t\,\varphi(x) + (1-t)\,\varphi(y)\)가 되어 \(\varphi = \ln\Gamma\)는 볼록합니다.`,
          en: String.raw`But \(F^p = s^{x-1} e^{-s}\) and \(G^q = s^{y-1} e^{-s}\), so the right side is \(\Gamma(x)^t\,\Gamma(y)^{1-t}\). Hence \(\Gamma(tx + (1-t)y) \le \Gamma(x)^t\,\Gamma(y)^{1-t}\); taking logs gives \(\varphi(tx + (1-t)y) \le t\,\varphi(x) + (1-t)\,\varphi(y)\), so \(\varphi = \ln\Gamma\) is convex.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인: 위의 secant 테스트는 볼록성의 정의(현이 그래프 위에 있음)를 직접 검사합니다. \(\ln\Gamma\)에 대한 위반량은 \(10^{-9}\) 미만으로 0 — 증명과 일치합니다.`,
          en: String.raw`Numerical check: the secant test above checks the very definition of convexity (the chord lies above the graph). The violation for \(\ln\Gamma\) is below \(10^{-9}\) — zero, agreeing with the proof.`,
        },
      },
    ],
  },
  {
    id: 'squeeze',
    statement: {
      ko: String.raw`Bohr–Mollerup 정리를 증명하세요: \(f: (0,\infty) \to (0,\infty)\)가 (i) \(f(1) = 1\), (ii) \(f(x+1) = x\,f(x)\), (iii) \(\ln f\)가 볼록을 만족하면 \(f = \Gamma\)입니다.`,
      en: String.raw`Prove the Bohr–Mollerup theorem: if \(f: (0,\infty) \to (0,\infty)\) satisfies (i) \(f(1) = 1\), (ii) \(f(x+1) = x\,f(x)\), and (iii) \(\ln f\) is convex, then \(f = \Gamma\).`,
    },
    display: [
      String.raw`x\ln(n-1) \le \varphi(n+x) - \varphi(n) \le x\ln n \qquad (0 < x < 1,\ n \ge 2)`,
      String.raw`\frac{(n-1)^x (n-1)!}{\prod_{k=0}^{n-1}(x+k)} \le f(x) \le \frac{n^x (n-1)!}{\prod_{k=0}^{n-1}(x+k)}`,
    ],
    preset: { amp: 0.3, probe: 0.6 },
    presetCaption: {
      ko: String.raw`\(a = 0.3\), \(x_0 = 0.6\)에서 impostor \(\ln f_a\)의 secant 위반량 \(\approx 0.297 > 0\) (볼록성 깨짐), \(\ln\Gamma\)의 위반량은 \(10^{-9}\) 미만 (볼록성 유지).`,
      en: String.raw`At \(a = 0.3\), \(x_0 = 0.6\): the impostor \(\ln f_a\) has secant violation \(\approx 0.297 > 0\) (convexity broken), while \(\ln\Gamma\) has violation below \(10^{-9}\) (convexity holds).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varphi = \ln f\)라 둡니다. 볼록함수의 기울기 단조성을 이용합니다: \(a < b < c\)이면 \(\frac{\varphi(b) - \varphi(a)}{b-a} \le \frac{\varphi(c) - \varphi(b)}{c-b}\)입니다. \(0 < x < 1\), 정수 \(n \ge 2\)에 대해 세 점 \(n-1 < n < n+x\)와 \(n < n+x < n+1\)에 적용하면 \(\varphi(n) - \varphi(n-1) \le \frac{\varphi(n+x) - \varphi(n)}{x} \le \varphi(n+1) - \varphi(n)\)을 얻습니다.`,
          en: String.raw`Set \(\varphi = \ln f\). We use slope monotonicity of convex functions: for \(a < b < c\), \(\frac{\varphi(b) - \varphi(a)}{b-a} \le \frac{\varphi(c) - \varphi(b)}{c-b}\). For \(0 < x < 1\) and integer \(n \ge 2\), applying this to \(n-1 < n < n+x\) and \(n < n+x < n+1\) gives \(\varphi(n) - \varphi(n-1) \le \frac{\varphi(n+x) - \varphi(n)}{x} \le \varphi(n+1) - \varphi(n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`조건 (i), (ii)로부터 (문제 1) \(f(n) = (n-1)!\)이므로 \(\varphi(n) - \varphi(n-1) = \ln(n-1)\), \(\varphi(n+1) - \varphi(n) = \ln n\)입니다. \(x\)를 곱하면 핵심 부등식 \(x\ln(n-1) \le \varphi(n+x) - \varphi(n) \le x\ln n\)을 얻습니다.`,
          en: String.raw`From (i) and (ii) (problem 1), \(f(n) = (n-1)!\), so \(\varphi(n) - \varphi(n-1) = \ln(n-1)\) and \(\varphi(n+1) - \varphi(n) = \ln n\). Multiplying by \(x\) gives the key inequality \(x\ln(n-1) \le \varphi(n+x) - \varphi(n) \le x\ln n\).`,
        },
      },
      {
        text: {
          ko: String.raw`지수화하면 \((n-1)^x \le \frac{f(n+x)}{f(n)} \le n^x\), 즉 \((n-1)^x (n-1)! \le f(n+x) \le n^x (n-1)!\)입니다. 한편 (ii)를 \(n\)번 반복하면 \(f(n+x) = x(x+1)\cdots(x+n-1)\,f(x) = f(x)\prod_{k=0}^{n-1}(x+k)\)이므로, 나누어 \(\frac{(n-1)^x (n-1)!}{\prod_{k=0}^{n-1}(x+k)} \le f(x) \le \frac{n^x (n-1)!}{\prod_{k=0}^{n-1}(x+k)}\)을 얻습니다.`,
          en: String.raw`Exponentiating gives \((n-1)^x \le \frac{f(n+x)}{f(n)} \le n^x\), i.e. \((n-1)^x (n-1)! \le f(n+x) \le n^x (n-1)!\). Iterating (ii) \(n\) times gives \(f(n+x) = x(x+1)\cdots(x+n-1)\,f(x) = f(x)\prod_{k=0}^{n-1}(x+k)\); dividing through yields \(\frac{(n-1)^x (n-1)!}{\prod_{k=0}^{n-1}(x+k)} \le f(x) \le \frac{n^x (n-1)!}{\prod_{k=0}^{n-1}(x+k)}\).`,
        },
      },
      {
        text: {
          ko: String.raw`위쪽 bound와 아래쪽 bound의 비는 \(\left(\frac{n}{n-1}\right)^x \to 1\) (\(n \to \infty\))입니다. 아래쪽 bound를 \(L_n\), 위쪽을 \(U_n\)이라 하면 \(L_n \le f(x) \le U_n\)이고 \(U_n - L_n = L_n\left(\left(\frac{n}{n-1}\right)^x - 1\right) \le f(x)\left(\left(\frac{n}{n-1}\right)^x - 1\right) \to 0\)이므로, 조임 정리로 두 bound는 같은 극한 \(G(x)\)로 수렴하고 \(f(x) = G(x)\)입니다 (\(0 < x < 1\)).`,
          en: String.raw`The ratio of the upper to the lower bound is \(\left(\frac{n}{n-1}\right)^x \to 1\) as \(n \to \infty\). Writing \(L_n\) and \(U_n\) for the bounds, \(L_n \le f(x) \le U_n\) and \(U_n - L_n = L_n\left(\left(\frac{n}{n-1}\right)^x - 1\right) \le f(x)\left(\left(\frac{n}{n-1}\right)^x - 1\right) \to 0\); by the squeeze theorem both bounds converge to the same limit \(G(x)\), and \(f(x) = G(x)\) for \(0 < x < 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`Gauss 극한과 Euler 적분을 연결합니다. 절단 적분 \(I_n(x) = \int_0^n t^{x-1}\left(1-\frac{t}{n}\right)^n\,dt\)에 \(s = \frac{t}{n}\)을 대입하면 \(I_n(x) = n^x\int_0^1 s^{x-1}(1-s)^n\,ds\)입니다. 부분적분을 반복하면 \(\int_0^1 s^{x-1}(1-s)^k\,ds = \frac{k}{x}\int_0^1 s^{x}(1-s)^{k-1}\,ds\)이므로 (경계항은 \(x > 0\)에서 0), \(\int_0^1 s^{x-1}(1-s)^n\,ds = \frac{n!}{x(x+1)\cdots(x+n)}\) — 따라서 \(I_n(x) = \frac{n^x n!}{x(x+1)\cdots(x+n)} = \frac{n}{n+x}\,U_n\)입니다 (\(U_n\)은 위의 위쪽 조임 bound).`,
          en: String.raw`Connecting the Gauss limit to Euler's integral. In the truncated integral \(I_n(x) = \int_0^n t^{x-1}\left(1-\frac{t}{n}\right)^n\,dt\), substitute \(s = \frac{t}{n}\) to get \(I_n(x) = n^x\int_0^1 s^{x-1}(1-s)^n\,ds\). Repeated integration by parts gives \(\int_0^1 s^{x-1}(1-s)^k\,ds = \frac{k}{x}\int_0^1 s^{x}(1-s)^{k-1}\,ds\) (boundary terms vanish for \(x > 0\)), so \(\int_0^1 s^{x-1}(1-s)^n\,ds = \frac{n!}{x(x+1)\cdots(x+n)}\) — hence \(I_n(x) = \frac{n^x n!}{x(x+1)\cdots(x+n)} = \frac{n}{n+x}\,U_n\), where \(U_n\) is the upper squeeze bound above.`,
        },
        display: [String.raw`I_n(x) = \int_0^n t^{x-1}\left(1-\frac{t}{n}\right)^n\,dt = \frac{n^x n!}{x(x+1)\cdots(x+n)} = \frac{n}{n+x}\,U_n`],
      },
      {
        text: {
          ko: String.raw`이제 \(n \to \infty\): 각 \(t\)에서 \(\left(1-\frac{t}{n}\right)^n \to e^{-t}\)이므로 피적분함수는 \(t^{x-1}e^{-t}\)로 점별 수렴합니다. 지배는 \(\ln(1-u) \le -u\)에서 나옵니다: \(0 \le t \le n\)일 때 \(\left(1-\frac{t}{n}\right)^n = e^{n\ln(1-t/n)} \le e^{-t}\)이므로 지배함수 \(t^{x-1}e^{-t}\) (\(x > 0\)에서 \((0,\infty)\) 위 적분 가능)를 얻습니다. 지배수렴정리로 \(I_n(x) \to \int_0^\infty t^{x-1}e^{-t}\,dt = \Gamma(x)\)입니다.`,
          en: String.raw`Now \(n \to \infty\): for each \(t\), \(\left(1-\frac{t}{n}\right)^n \to e^{-t}\), so the integrand converges pointwise to \(t^{x-1}e^{-t}\). Domination comes from \(\ln(1-u) \le -u\): for \(0 \le t \le n\), \(\left(1-\frac{t}{n}\right)^n = e^{n\ln(1-t/n)} \le e^{-t}\), giving the integrable dominating function \(t^{x-1}e^{-t}\) on \((0,\infty)\) (for \(x > 0\)). By dominated convergence, \(I_n(x) \to \int_0^\infty t^{x-1}e^{-t}\,dt = \Gamma(x)\).`,
        },
        display: [String.raw`I_n(x) \longrightarrow \int_0^\infty t^{x-1}e^{-t}\,dt = \Gamma(x) \qquad (n \to \infty)`],
      },
      {
        text: {
          ko: String.raw`두 극한이 일치합니다: \(I_n(x) = \frac{n}{n+x}\,U_n\)에서 \(\frac{n}{n+x} \to 1\)이고 \(U_n \to G(x)\) (조임)이므로 \(I_n(x) \to G(x)\)인데, 동시에 \(I_n(x) \to \Gamma(x)\)이므로 \(G(x) = \Gamma(x)\) (\(0 < x < 1\)) — Gauss 곱 공식이 Euler 적분과 같음이 완전히 증명되었습니다.`,
          en: String.raw`The two limits agree: from \(I_n(x) = \frac{n}{n+x}\,U_n\), since \(\frac{n}{n+x} \to 1\) and \(U_n \to G(x)\) (squeeze), \(I_n(x) \to G(x)\); but also \(I_n(x) \to \Gamma(x)\). Hence \(G(x) = \Gamma(x)\) for \(0 < x < 1\) — Gauss's product formula equals Euler's integral, fully proved.`,
        },
      },
      {
        text: {
          ko: String.raw`마지막으로 (ii)로 확장합니다: \(x > 0\)을 \(x = y + m\) (\(0 < y \le 1\), 정수 \(m \ge 0\))이라 쓰면 \(f(x) = y(y+1)\cdots(y+m-1)\,f(y)\)이고 \(\Gamma\)도 같은 점화식을 만족하므로, \((0,1]\)에서의 일치가 모든 \(x > 0\)으로 확장되어 \(f = \Gamma\)입니다.`,
          en: String.raw`Finally extend by (ii): writing \(x > 0\) as \(x = y + m\) with \(0 < y \le 1\) and integer \(m \ge 0\), \(f(x) = y(y+1)\cdots(y+m-1)\,f(y)\), and since \(\Gamma\) satisfies the same recurrence, the agreement on \((0,1]\) extends to all \(x > 0\): \(f = \Gamma\).`,
        },
      },
    ],
  },
];

