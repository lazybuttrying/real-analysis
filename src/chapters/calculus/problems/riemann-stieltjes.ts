import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Riemann-Stieltjes scene
 * (Tao, Analysis I, Section 11.8). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/riemann-stieltjes.test.ts): identity gives U_n = (n+1)/(2n),
 * L_n = (n-1)/(2n) (exact integral 1/2); step gives the exact integral
 * 1/2 for every n; square converges to 2/3.
 */
export const riemannStieltjesProblems: readonly ProblemMeta[] = [
  {
    id: 'rs-identity',
    statement: {
      ko: String.raw`\(\alpha(x) = x\)일 때 리만-스틸체스 상합·하합이 리만 상합·하합과 완전히 일치함을 보이고, 따라서 한쪽 적분이 존재하면 다른 쪽도 존재하며 두 값이 같음을 증명하세요.`,
      en: String.raw`Show that when \(\alpha(x) = x\), the Riemann–Stieltjes upper/lower sums coincide exactly with the Riemann upper/lower sums, and prove that if one integral exists then so does the other, with the same value.`,
    },
    display: [
      String.raw`\Delta\alpha_i = x_i - x_{i-1} = \Delta x_i \;\Rightarrow\; U(f, P, \alpha) = U(f, P)`,
      String.raw`\int_a^b f\,d\alpha = \int_a^b f\,dx \quad (\alpha(x) = x)`,
    ],
    preset: { alpha: 'identity', n: 6 },
    presetCaption: {
      ko: String.raw`\(\alpha(x) = x\), \(n = 6\): 위쪽과 아래쪽 패널이 똑같이 그려집니다 — \(U = \frac{7}{12} \approx 0.5833\), \(L = \frac{5}{12} \approx 0.4167\), 엄밀값 \(\frac12\).`,
      en: String.raw`\(\alpha(x) = x\), \(n = 6\): the top and bottom panels draw identically — \(U = \frac{7}{12} \approx 0.5833\), \(L = \frac{5}{12} \approx 0.4167\), exact \(\frac12\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\alpha(x) = x\)이면 \(\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1}) = x_i - x_{i-1} = \Delta x_i\)입니다. 따라서 RS 상합 \(U(f, P, \alpha) = \sum M_i\,\Delta\alpha_i\)는 \(\sum M_i\,\Delta x_i = U(f, P)\)와 항별로 일치하고, 하합도 마찬가지입니다.`,
          en: String.raw`When \(\alpha(x) = x\), \(\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1}) = x_i - x_{i-1} = \Delta x_i\). Hence the RS upper sum \(U(f, P, \alpha) = \sum M_i\,\Delta\alpha_i\) matches \(\sum M_i\,\Delta x_i = U(f, P)\) term by term, and likewise for the lower sums.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 RS 상적분 \(\overline{\int_a^b} f\,d\alpha = \inf_P U(f, P, \alpha)\)는 리만 상적분 \(\inf_P U(f, P)\)와 같고, 하적분도 같습니다. \(f\)가 리만 적분 가능하면 상적분과 하적분이 일치하므로 RS 적분도 존재하고 \(\int_a^b f\,d\alpha = \int_a^b f\,dx\)입니다 — 역도 마찬가지입니다.`,
          en: String.raw`So the RS upper integral \(\overline{\int_a^b} f\,d\alpha = \inf_P U(f, P, \alpha)\) equals the Riemann upper integral \(\inf_P U(f, P)\), and likewise below. If \(f\) is Riemann integrable, the upper and lower integrals agree, hence the RS integral exists with \(\int_a^b f\,d\alpha = \int_a^b f\,dx\) — and conversely.`,
        },
      },
      {
        text: {
          ko: String.raw`즉 \(\alpha(x) = x\)는 "무게를 재는 자"를 바꾸지 않는 선택입니다 — 씬에서 \(\alpha\)를 identity로 두면 아래쪽 \(\alpha\)-패널이 위쪽 리만 패널과 완전히 겹치는 이유입니다.`,
          en: String.raw`In other words, \(\alpha(x) = x\) is the choice that does not change the "measuring stick" — which is why, in the scene with \(\alpha\) set to identity, the lower \(\alpha\)-panel overlaps the upper Riemann panel exactly.`,
        },
      },
    ],
  },
  {
    id: 'rs-step',
    statement: {
      ko: String.raw`\(\alpha\)가 \(c\)에서 크기 \(J\)의 점프 하나만 있고 그 외에는 상수이며, \(f\)가 \(c\)에서 연속이라고 하세요. 점프를 품은 구간을 조이는(squeeze) 논증으로 \(\int_a^b f\,d\alpha = f(c)\,J\)임을 완전히 증명하세요.`,
      en: String.raw`Let \(\alpha\) have a single jump of size \(J\) at \(c\) and be constant elsewhere, and let \(f\) be continuous at \(c\). Prove completely, by a squeezing argument on the interval straddling the jump, that \(\int_a^b f\,d\alpha = f(c)\,J\).`,
    },
    display: [
      String.raw`U(f, P, \alpha) = M_I J, \quad L(f, P, \alpha) = m_I J \;\Rightarrow\; \int_a^b f\,d\alpha = f(c)\,J`,
    ],
    preset: { alpha: 'step', n: 6 },
    presetCaption: {
      ko: String.raw`계단 \(\alpha\) (\(c = \frac12\), \(J = 1\)), \(n = 6\): 0 너비 막대가 전부 사라지고 점프를 품은 \([\frac26, \frac36]\) 하나만 남습니다 — \(U = \frac12\), \(L = \frac13\), 엄밀값 \(f(\frac12) \cdot 1 = \frac12\).`,
      en: String.raw`Step \(\alpha\) (\(c = \frac12\), \(J = 1\)), \(n = 6\): all zero-width bars vanish, leaving only \([\frac26, \frac36]\) straddling the jump — \(U = \frac12\), \(L = \frac13\), exact \(f(\frac12) \cdot 1 = \frac12\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`임의의 분할 \(P\)에 대해, \(\Delta\alpha_i = 0\)인 구간은 RS 합에 기여하지 않습니다. \(c\)가 분할점 \(x_k\)와 일치하든 구간 내부에 있든, \(\Delta\alpha_i = J\)인 구간은 정확히 하나 — \(c\)를 품은 \(I = [x_{k-1}, x_k]\)뿐입니다 (한쪽 끝에서만 \(\alpha\) 값이 바뀌므로). 따라서 \(U(f, P, \alpha) = M_I\,J\), \(L(f, P, \alpha) = m_I\,J\)입니다. 여기서 \(M_I, m_I\)는 \(I\) 위에서 \(f\)의 상한·하한입니다.`,
          en: String.raw`For any partition \(P\), intervals with \(\Delta\alpha_i = 0\) contribute nothing to the RS sums. Whether \(c\) is a partition point \(x_k\) or lies inside an interval, exactly one interval has \(\Delta\alpha_i = J\) — the interval \(I = [x_{k-1}, x_k]\) straddling \(c\) (the value of \(\alpha\) changes at only one endpoint). Hence \(U(f, P, \alpha) = M_I\,J\) and \(L(f, P, \alpha) = m_I\,J\), where \(M_I, m_I\) are the sup/inf of \(f\) on \(I\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f\)가 \(c\)에서 연속이므로, \(\varepsilon > 0\)마다 \(\delta > 0\)가 있어 \(|x - c| < \delta\)이면 \(|f(x) - f(c)| < \varepsilon/J\)입니다. 분할의 그물(mesh)이 \(\delta\)보다 작으면 \(I \subset (c - \delta, c + \delta)\)이므로 \(|M_I - f(c)| \le \varepsilon/J\)이고 \(|m_I - f(c)| \le \varepsilon/J\)입니다. 따라서 \(|U(f, P, \alpha) - f(c)J| \le \varepsilon\)이고 \(U - L = (M_I - m_I)J \le 2\varepsilon\)입니다.`,
          en: String.raw`Since \(f\) is continuous at \(c\), for every \(\varepsilon > 0\) there is \(\delta > 0\) with \(|x - c| < \delta \Rightarrow |f(x) - f(c)| < \varepsilon/J\). If the partition mesh is below \(\delta\), then \(I \subset (c - \delta, c + \delta)\), so \(|M_I - f(c)| \le \varepsilon/J\) and \(|m_I - f(c)| \le \varepsilon/J\). Hence \(|U(f, P, \alpha) - f(c)J| \le \varepsilon\) and \(U - L = (M_I - m_I)J \le 2\varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon\)이 임의이므로 RS 상적분과 하적분이 모두 \(f(c)J\)로 수렴 — 적분이 존재하고 \(\int_a^b f\,d\alpha = f(c)\,J\)입니다. 점프는 적분을 "그 점에서의 함숫값 × 점프 크기"로 붕괴시킵니다: 씬의 계단 \(\alpha\)에서 \(f(\frac12)\cdot 1 = \frac12\)인 이유입니다.`,
          en: String.raw`Since \(\varepsilon\) is arbitrary, both the RS upper and lower integrals converge to \(f(c)J\) — the integral exists and \(\int_a^b f\,d\alpha = f(c)\,J\). A jump collapses the integral to "function value at the point × jump size": why the scene's step \(\alpha\) gives \(f(\frac12)\cdot 1 = \frac12\).`,
        },
      },
    ],
  },
  {
    id: 'rs-c1',
    statement: {
      ko: String.raw`\(\alpha\)가 \([a, b]\)에서 \(C^1\)급이고 증가하며, \(f\)가 연속이라고 하세요. 평균값 정리를 이용해 \(\Delta\alpha_i = \alpha'(\xi_i)\,\Delta x_i\)라 쓰고, 균등연속성으로 \(\xi_i\)를 표본점으로 바꾸는 표준 논증을 완성하여 \(\int_a^b f\,d\alpha = \int_a^b f(x)\,\alpha'(x)\,dx\)임을 증명하세요.`,
      en: String.raw`Let \(\alpha\) be \(C^1\) and increasing on \([a, b]\) and \(f\) continuous. Write \(\Delta\alpha_i = \alpha'(\xi_i)\,\Delta x_i\) by the mean value theorem, and complete the standard argument — using uniform continuity to trade the \(\xi_i\) for sample points — proving \(\int_a^b f\,d\alpha = \int_a^b f(x)\,\alpha'(x)\,dx\).`,
    },
    display: [
      String.raw`U(f, P, \alpha) = \sum M_i\,\alpha'(\xi_i)\,\Delta x_i \;\xrightarrow[\text{mesh} \to 0]{}\; \int_a^b f(x)\,\alpha'(x)\,dx`,
    ],
    preset: { alpha: 'square', n: 12 },
    presetCaption: {
      ko: String.raw`\(\alpha(x) = x^2\), \(n = 12\): \(U\)와 \(L\)이 엄밀값 \(\int_0^1 x \cdot 2x\,dx = \frac23 \approx 0.6667\)로 모입니다 — \(\alpha' = 2x\)가 무게로 들어간 리만 적분과 같습니다.`,
      en: String.raw`\(\alpha(x) = x^2\), \(n = 12\): \(U\) and \(L\) converge to the exact \(\int_0^1 x \cdot 2x\,dx = \frac23 \approx 0.6667\) — the Riemann integral weighted by \(\alpha' = 2x\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`평균값 정리에 의해 각 구간 \([x_{i-1}, x_i]\)마다 \(\xi_i \in (x_{i-1}, x_i)\)가 있어 \(\Delta\alpha_i = \alpha'(\xi_i)\,\Delta x_i\)입니다 (\(\alpha\)가 \(C^1\)이므로 \(\alpha'\)는 연속). 따라서 \(U(f, P, \alpha) = \sum M_i\,\alpha'(\xi_i)\,\Delta x_i\)이고, \(\alpha\)가 증가하므로 \(\alpha' \ge 0\)이며 \(A = \max_{[a,b]} \alpha' < \infty\)입니다.`,
          en: String.raw`By the mean value theorem, each \([x_{i-1}, x_i]\) holds \(\xi_i \in (x_{i-1}, x_i)\) with \(\Delta\alpha_i = \alpha'(\xi_i)\,\Delta x_i\) (\(\alpha'\) is continuous since \(\alpha\) is \(C^1\)). Hence \(U(f, P, \alpha) = \sum M_i\,\alpha'(\xi_i)\,\Delta x_i\); \(\alpha\) increasing gives \(\alpha' \ge 0\) and \(A = \max_{[a,b]} \alpha' < \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`적분 가능성을 먼저 확인합니다: \(U - L = \sum (M_i - m_i)\,\alpha'(\xi_i)\,\Delta x_i \le A\sum (M_i - m_i)\,\Delta x_i = A\,(U(f, P) - L(f, P))\)입니다. \(f\)가 연속이므로 리만 적분 가능하고, 그물 \(\to 0\)에서 \(U(f, P) - L(f, P) \to 0\) — 따라서 \(U(f, P, \alpha) - L(f, P, \alpha) \to 0\)이므로 RS 적분 \(\int_a^b f\,d\alpha\)가 존재합니다.`,
          en: String.raw`First, integrability: \(U - L = \sum (M_i - m_i)\,\alpha'(\xi_i)\,\Delta x_i \le A\sum (M_i - m_i)\,\Delta x_i = A\,(U(f, P) - L(f, P))\). Since \(f\) is continuous it is Riemann integrable, and \(U(f, P) - L(f, P) \to 0\) as the mesh \(\to 0\) — so \(U(f, P, \alpha) - L(f, P, \alpha) \to 0\), and the RS integral \(\int_a^b f\,d\alpha\) exists.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(U(f, P, \alpha)\)를 리만합 \(S(P) = \sum f(t_i)\,\alpha'(t_i)\,\Delta x_i\) (표본점 \(t_i \in [x_{i-1}, x_i]\), 예컨대 \(t_i = x_{i-1}\))와 비교합니다. \(\lvert M_i\,\alpha'(\xi_i) - f(t_i)\,\alpha'(t_i)\rvert \le \lvert M_i - f(t_i)\rvert\,\alpha'(\xi_i) + \lvert f(t_i)\rvert\,\lvert\alpha'(\xi_i) - \alpha'(t_i)\rvert\)이므로, \(F = \max_{[a,b]} |f|\)라 두면 \(\lvert U(f, P, \alpha) - S(P)\rvert \le A\,\omega_f(\delta)\,(b-a) + F\,\omega_{\alpha'}(\delta)\,(b-a)\)입니다. 여기서 \(\omega_f, \omega_{\alpha'}\)는 균등연속성에 의한 연속 모듈러스이고 \(\delta\)는 그물입니다.`,
          en: String.raw`Now compare \(U(f, P, \alpha)\) with the Riemann sum \(S(P) = \sum f(t_i)\,\alpha'(t_i)\,\Delta x_i\) (sample points \(t_i \in [x_{i-1}, x_i]\), e.g. \(t_i = x_{i-1}\)). From \(\lvert M_i\,\alpha'(\xi_i) - f(t_i)\,\alpha'(t_i)\rvert \le \lvert M_i - f(t_i)\rvert\,\alpha'(\xi_i) + \lvert f(t_i)\rvert\,\lvert\alpha'(\xi_i) - \alpha'(t_i)\rvert\), with \(F = \max_{[a,b]} |f|\), we get \(\lvert U(f, P, \alpha) - S(P)\rvert \le A\,\omega_f(\delta)\,(b-a) + F\,\omega_{\alpha'}(\delta)\,(b-a)\), where \(\omega_f, \omega_{\alpha'}\) are the moduli of continuity from uniform continuity and \(\delta\) is the mesh.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\delta \to 0\)에서 \(\omega_f(\delta), \omega_{\alpha'}(\delta) \to 0\)이므로 \(|U(f, P, \alpha) - S(P)| \to 0\)입니다. \(f\,\alpha'\)가 연속이므로 \(S(P) \to \int_a^b f(x)\,\alpha'(x)\,dx\)이고, \(U(f, P, \alpha) \to \int_a^b f\,d\alpha\)이므로 (RS 적분 가능성은 위에서 확인), 두 극한이 같아야 합니다: \(\int_a^b f\,d\alpha = \int_a^b f(x)\,\alpha'(x)\,dx\). 모든 단계가 완성되었습니다 — 아이디어 수준 표기는 없습니다.`,
          en: String.raw`As \(\delta \to 0\), \(\omega_f(\delta), \omega_{\alpha'}(\delta) \to 0\), so \(|U(f, P, \alpha) - S(P)| \to 0\). Since \(f\,\alpha'\) is continuous, \(S(P) \to \int_a^b f(x)\,\alpha'(x)\,dx\), and \(U(f, P, \alpha) \to \int_a^b f\,d\alpha\) (RS integrability shown above); the two limits must agree: \(\int_a^b f\,d\alpha = \int_a^b f(x)\,\alpha'(x)\,dx\). Every step is complete — nothing is left at idea level.`,
        },
      },
    ],
  },
];
