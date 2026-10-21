import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Fejer theorem scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/fejer-theorem.test.ts):
 *   triCoeff(k) = (1/pi) int_{-pi}^{pi} f(t) cos(kt) dt = 4/(pi^2 k^2) for
 *   odd k, 0 for even k (Simpson integration agrees to 1e-9, k = 1..10);
 *   int_{-pi}^{pi} K_N = 2pi to 4e-15 (N = 1, 8, 40);
 *   N = 8: sup|S_8 - f| = 0.0252011218, sup|sigma_8 - f| = 0.1101179234
 *   (honestly: S_N wins the sup-norm race on this smooth f);
 *   sup|sigma_N - f| decreases 0.1101179234 -> 0.0638615489 -> 0.0363232411
 *   for N = 8 -> 16 -> 32.
 */
export const fejerTheoremProblems: readonly ProblemMeta[] = [
  {
    id: 'fejer-kernel',
    statement: {
      ko: String.raw`Fejér 핵 \(K_N(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2\) (\(t \not\equiv 0 \pmod{2\pi}\), \(K_N(0) = N\))에 대해 \(K_N \ge 0\)이고 \(\frac{1}{2\pi}\int_{-\pi}^{\pi} K_N = 1\)임을 증명하세요.

또한 \(\sigma_N(f) = \frac{1}{2\pi}(f * K_N)\)임을 보이세요.`,
      en: String.raw`For the Fejér kernel \(K_N(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2\) (\(t \not\equiv 0 \pmod{2\pi}\), \(K_N(0) = N\)), prove \(K_N \ge 0\) and \(\frac{1}{2\pi}\int_{-\pi}^{\pi} K_N = 1\).

Also show \(\sigma_N(f) = \frac{1}{2\pi}(f * K_N)\).`,
    },
    display: [
      String.raw`K_N(t) = \frac{1}{N}\sum_{k=0}^{N-1} D_k(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2 \ge 0`,
      String.raw`\frac{1}{2\pi}\int_{-\pi}^{\pi} K_N = 1, \qquad \sigma_N(f) = \frac{1}{2\pi}(f * K_N)`,
    ],
    preset: { N: 8 },
    presetCaption: {
      ko: String.raw`\(N = 8\): 핵은 \(K_8(0) = 8\)인 뾰족한 봉우리이고, \(\sigma_8\)은 이미 매끈합니다 — 아래 증명이 이 봉우리가 질량 1인 이유입니다.`,
      en: String.raw`\(N = 8\): the kernel is a spike with \(K_8(0) = 8\), and \(\sigma_8\) is already smooth — the proof below is why this spike has mass 1.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`Dirichlet 핵 \(D_k(t) = \sum_{j=-k}^{k} e^{ijt}\)부터 시작합니다.

부분합은 합성곱입니다: \(S_k(f)(x) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)\,D_k(t)\,dt\) (지수함수들의 직교성).

이를 평균하면 \(\sigma_N(f) = \frac{1}{N}\sum_{k=0}^{N-1} S_k(f) = \frac{1}{2\pi}(f * K_N)\)이 되는데, 여기서 \(K_N = \frac{1}{N}\sum_{k=0}^{N-1} D_k\)입니다.`,
          en: String.raw`Start from the Dirichlet kernel \(D_k(t) = \sum_{j=-k}^{k} e^{ijt}\).

The partial sum is a convolution: \(S_k(f)(x) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)\,D_k(t)\,dt\) (orthogonality of the exponentials).

Averaging gives \(\sigma_N(f) = \frac{1}{N}\sum_{k=0}^{N-1} S_k(f) = \frac{1}{2\pi}(f * K_N)\) with \(K_N = \frac{1}{N}\sum_{k=0}^{N-1} D_k\).`,
        },
      },
      {
        text: {
          ko: String.raw`합을 뒤집으면 \(\sum_{k=0}^{N-1} D_k(t) = \sum_{k=0}^{N-1}\sum_{j=-k}^{k} e^{ijt}\)입니다. 주파수 \(j\) (\(|j| \le N-1\))는 \(k \ge |j|\)인 모든 \(k\)에 등장하므로, 정확히 \(N - |j|\)번 등장합니다: \(\sum_{k=0}^{N-1} D_k(t) = \sum_{|j| \le N-1} (N-|j|)\,e^{ijt}\).`,
          en: String.raw`Interchanging the sums, \(\sum_{k=0}^{N-1} D_k(t) = \sum_{k=0}^{N-1}\sum_{j=-k}^{k} e^{ijt}\). The frequency \(j\) (\(|j| \le N-1\)) appears in every \(k \ge |j|\), i.e. exactly \(N - |j|\) times: \(\sum_{k=0}^{N-1} D_k(t) = \sum_{|j| \le N-1} (N-|j|)\,e^{ijt}\).`,
        },
      },
      {
        text: {
          ko: String.raw`한편 \(\left|\sum_{j=0}^{N-1} e^{ijt}\right|^2 = \sum_{j,l} e^{i(j-l)t}\)를 전개하면, 차 \(m = j-l\)이 \(|m| \le N-1\)의 각 값을 정확히 \(N - |m|\)번 취하므로 같은 합이 나옵니다.

즉 \(\sum_{k=0}^{N-1} D_k(t) = \left|\sum_{j=0}^{N-1} e^{ijt}\right|^2 \ge 0\)입니다.

등비수열 합으로 \(\sum_{j=0}^{N-1} e^{ijt} = e^{i(N-1)t/2}\,\frac{\sin(Nt/2)}{\sin(t/2)}\)이므로 \(K_N(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2 \ge 0\)입니다 (\(t = 0\)에서는 극한값 \(N\)).`,
          en: String.raw`Meanwhile \(\left|\sum_{j=0}^{N-1} e^{ijt}\right|^2 = \sum_{j,l} e^{i(j-l)t}\) expands so that the difference \(m = j-l\) takes each value with \(|m| \le N-1\) exactly \(N - |m|\) times — the same sum.

Hence \(\sum_{k=0}^{N-1} D_k(t) = \left|\sum_{j=0}^{N-1} e^{ijt}\right|^2 \ge 0\).

The geometric sum gives \(\sum_{j=0}^{N-1} e^{ijt} = e^{i(N-1)t/2}\,\frac{\sin(Nt/2)}{\sin(t/2)}\), so \(K_N(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2 \ge 0\) (with the limit value \(N\) at \(t = 0\)).`,
        },
      },
      {
        text: {
          ko: String.raw`적분은 간단합니다: \(\int_{-\pi}^{\pi} e^{ijt}\,dt = 2\pi\) (\(j = 0\)일 때)이고 \(0\) (\(j \ne 0\)일 때)이므로, \(\int_{-\pi}^{\pi} K_N = \frac{1}{N}\sum_{k=0}^{N-1}\int_{-\pi}^{\pi} D_k = \frac{1}{N}\cdot N \cdot 2\pi = 2\pi\)입니다. 즉 \(\frac{1}{2\pi}\int K_N = 1\) — \(K_N\)은 질량 1인 음이 아닌 근사 항등원(approximate identity)입니다.`,
          en: String.raw`The integral is easy: \(\int_{-\pi}^{\pi} e^{ijt}\,dt\) is \(2\pi\) for \(j = 0\) and \(0\) otherwise, so \(\int_{-\pi}^{\pi} K_N = \frac{1}{N}\sum_{k=0}^{N-1}\int_{-\pi}^{\pi} D_k = \frac{1}{N}\cdot N \cdot 2\pi = 2\pi\). Thus \(\frac{1}{2\pi}\int K_N = 1\) — the Fejér kernel is a nonnegative approximate identity of mass 1.`,
        },
      },
    ],
  },
  {
    id: 'approximate-identity',
    statement: {
      ko: String.raw`연속인 \(2\pi\)-주기 함수 \(f\)에 대해 \(\sigma_N(f) \to f\)가 균등수렴함을 증명하세요.

적분을 \(|t| < \delta\) (균등연속성)와 \(\delta \le |t| \le \pi\) (핵의 꼬리 bound \(K_N(t) \le \frac{1}{N\sin^2(\delta/2)}\))로 나누는 approximate-identity 논증을 쓰세요.`,
      en: String.raw`Prove \(\sigma_N(f) \to f\) uniformly for every continuous \(2\pi\)-periodic \(f\).

Use the approximate-identity argument: split the integral at \(\delta\) — uniform continuity on \(|t| < \delta\), and the kernel tail bound \(K_N(t) \le \frac{1}{N\sin^2(\delta/2)}\) on \(\delta \le |t| \le \pi\).`,
    },
    display: [
      String.raw`\lvert\sigma_N(x) - f(x)\rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_N(t)\,\lvert f(x-t) - f(x)\rvert\,dt`,
      String.raw`K_N(t) \le \frac{1}{N\sin^2(\delta/2)} \quad (\delta \le \lvert t\rvert \le \pi)`,
    ],
    preset: { N: 8 },
    presetCaption: {
      ko: String.raw`\(N = 8\): \(\lVert \sigma_8 - f \rVert_\infty \approx 0.1101\), \(N = 16\)에서 \(\approx 0.0639\), \(N = 32\)에서 \(\approx 0.0363\)으로 감소 — 아래 증명이 이 균등수렴의 기계입니다.`,
      en: String.raw`\(N = 8\): \(\lVert \sigma_8 - f \rVert_\infty \approx 0.1101\), shrinking to \(\approx 0.0639\) at \(N = 16\) and \(\approx 0.0363\) at \(N = 32\) — the proof below is the machine behind this uniform convergence.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)를 \(2\pi\)-주기적으로 확장합니다 (여전히 연속이며, 주기성과 \([-\pi, 3\pi]\)에서의 균등연속성 덕분에 \(\mathbb{R}\) 전체에서 균등연속). 앞 문제에서 \(\sigma_N(f)(x) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)\,K_N(t)\,dt\)이고 \(\frac{1}{2\pi}\int K_N = 1\)이므로, \(f(x) = \frac{1}{2\pi}\int K_N(t)\,f(x)\,dt\)를 빼면 오차는 \(\frac{1}{2\pi}\int K_N(t)\,|f(x-t) - f(x)|\,dt\) 이하입니다 (\(K_N \ge 0\)).`,
          en: String.raw`Extend \(f\) \(2\pi\)-periodically (still continuous, hence uniformly continuous on all of \(\mathbb{R}\): periodicity plus uniform continuity on \([-\pi, 3\pi]\)). From the previous problem, \(\sigma_N(f)(x) = \frac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)\,K_N(t)\,dt\) and \(\frac{1}{2\pi}\int K_N = 1\), so subtracting \(f(x) = \frac{1}{2\pi}\int K_N(t)\,f(x)\,dt\) leaves an error of at most \(\frac{1}{2\pi}\int K_N(t)\,|f(x-t) - f(x)|\,dt\) (using \(K_N \ge 0\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면, 균등연속성에서 \(|s - t| < \delta\)일 때 \(|f(s) - f(t)| < \varepsilon/2\)인 \(\delta \in (0, \pi)\)를 잡습니다.

적분을 \(|t| < \delta\)와 \(\delta \le |t| \le \pi\)로 나눕니다.

앞부분은 \((\varepsilon/2)\cdot\frac{1}{2\pi}\int_{|t|<\delta} K_N \le \varepsilon/2\)입니다 (질량이 1 이하이므로).`,
          en: String.raw`Given \(\varepsilon > 0\), uniform continuity gives \(\delta \in (0, \pi)\) with \(|f(s) - f(t)| < \varepsilon/2\) whenever \(|s - t| < \delta\).

Split the integral into \(|t| < \delta\) and \(\delta \le |t| \le \pi\).

The near part is at most \((\varepsilon/2)\cdot\frac{1}{2\pi}\int_{|t|<\delta} K_N \le \varepsilon/2\) (the mass is at most 1).`,
        },
      },
      {
        text: {
          ko: String.raw`꼬리 부분: \(\delta \le |t| \le \pi\)에서는 \(|\sin(t/2)| \ge \sin(\delta/2) > 0\)이므로 (사인은 \([0, \pi/2]\)에서 증가), \(K_N(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2 \le \frac{1}{N\sin^2(\delta/2)}\)입니다. \(M = \|f\|_\infty\)라 두면 \(|f(x-t) - f(x)| \le 2M\)이므로, 꼬리는 \(\frac{1}{2\pi}\cdot 2M\cdot\frac{2(\pi-\delta)}{N\sin^2(\delta/2)} \le \frac{2M}{N\sin^2(\delta/2)}\) 이하입니다.`,
          en: String.raw`The tail: on \(\delta \le |t| \le \pi\) we have \(|\sin(t/2)| \ge \sin(\delta/2) > 0\) (sine increases on \([0, \pi/2]\)), so \(K_N(t) = \frac{1}{N}\left(\frac{\sin(Nt/2)}{\sin(t/2)}\right)^2 \le \frac{1}{N\sin^2(\delta/2)}\). With \(M = \|f\|_\infty\), \(|f(x-t) - f(x)| \le 2M\), so the tail is at most \(\frac{1}{2\pi}\cdot 2M\cdot\frac{2(\pi-\delta)}{N\sin^2(\delta/2)} \le \frac{2M}{N\sin^2(\delta/2)}\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(N > \frac{4M}{\varepsilon\sin^2(\delta/2)}\)이면 모든 \(x\)에 대해 \(|\sigma_N(x) - f(x)| < \varepsilon/2 + \varepsilon/2 = \varepsilon\)입니다.

\(N\)의 선택이 \(x\)에 무관하므로 수렴은 균등합니다.

이것이 Fejér 정리입니다 — \(S_N\) 자체의 거동에 대한 가정이 전혀 없다는 점이 핵심입니다.`,
          en: String.raw`Hence for \(N > \frac{4M}{\varepsilon\sin^2(\delta/2)}\) we get \(|\sigma_N(x) - f(x)| < \varepsilon/2 + \varepsilon/2 = \varepsilon\) for every \(x\).

The choice of \(N\) is independent of \(x\), so the convergence is uniform.

This is Fejér's theorem — and the punchline is that it assumes nothing about the behavior of the raw partial sums \(S_N\) themselves.`,
        },
      },
    ],
  },
  {
    id: 'cesaro-wins',
    statement: {
      ko: String.raw`정사각파 \(f\) (점프 불연속)를 생각하세요. 원시 부분합 \(S_N\)은 균등수렴하지 않음을 증명하세요 (Gibbs 울림 — 푸리에 씬에서 수치로 확인).

반면 \(\sigma_N\)은 점프에서 떨어진 compact 집합 위에서는 \(f\)로 균등수렴함을 (앞 문제의 논증을 국소화하여) 증명하세요.

점프점 자체에서의 거동은 아이디어 수준으로만 서술하세요.`,
      en: String.raw`Consider the square wave \(f\) (jump discontinuities). Prove the raw partial sums \(S_N\) do NOT converge uniformly (Gibbs ringing — shown numerically in the Fourier scene).

In contrast, prove \(\sigma_N \to f\) uniformly on every compact set bounded away from the jumps, by localizing the previous argument.

State the behavior at the jumps themselves at idea level only.`,
    },
    display: [
      String.raw`\text{Gibbs: }\sup_x \lvert S_N - f\rvert \gtrsim 0.17 \text{ for all } N`,
      String.raw`\Longrightarrow\ \text{no uniform convergence}`,
      String.raw`\sigma_N \to f \text{ uniformly on } K \Subset [-\pi,\pi] \setminus \{\text{jumps}\}`,
    ],
    preset: { N: 8 },
    presetCaption: {
      ko: String.raw`삼각파(연속)에서는 \(S_8\)의 sup 오차 \(\approx 0.0252\)가 \(\sigma_8\)의 \(\approx 0.1101\)보다 작습니다 — Cesàro의 진짜 승리는 점프가 있는 함수에서 드러납니다 (정사각파 씬 참조).`,
      en: String.raw`For the triangle wave (continuous), the sup error of \(S_8\) (\(\approx 0.0252\)) is smaller than that of \(\sigma_8\) (\(\approx 0.1101\)) — Cesàro's real victory shows up only where there are jumps (see the square-wave scene).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(S_N\)은 삼각함수들의 합이므로 연속입니다. 연속함수들의 균등수렴 극한은 연속이어야 합니다 — 그런데 정사각파 \(f\)는 점프점에서 불연속입니다.

따라서 \(S_N \to f\)는 점프를 포함하는 어떤 구간 위에서도 균등수렴할 수 없습니다.

푸리에 씬의 수치 실험이 보여주듯, 점프 옆의 overshoot \(\approx 0.1789\)는 \(N\)을 키워도 사라지지 않습니다 (Gibbs 현상).`,
          en: String.raw`Each \(S_N\) is a sum of trigonometric functions, hence continuous. A uniform limit of continuous functions must be continuous — but the square wave \(f\) is discontinuous at its jumps.

So \(S_N \to f\) cannot converge uniformly on any interval containing a jump.

As the Fourier scene shows numerically, the overshoot \(\approx 0.1789\) beside each jump never dies out, no matter how large \(N\) gets (the Gibbs phenomenon).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 점프 집합 \(J\)에서 거리 \(d > 0\) 이상 떨어진 compact 집합 \(K\)를 고정합니다.

앞 문제의 증명을 그대로 쓰되, \(\delta = \min(d/2, \delta_{\text{unif}})\)로 잡습니다 — 여기서 \(\delta_{\text{unif}}\)는 \(f\)가 \(J\)에서 \(d/2\) 이상 떨어진 compact 집합(여기서는 \(f\)가 연속이므로 균등연속) 위에서 \(\varepsilon/2\)-균등연속성을 주는 반경입니다.

\(x \in K\)이고 \(|t| < \delta\)이면 \(x - t\)는 여전히 \(J\)에서 \(d/2\) 이상 떨어져 있어 균등연속성이 적용되고, 꼬리 bound는 그대로입니다.`,
          en: String.raw`Now fix a compact \(K\) at distance \(d > 0\) from the jump set \(J\).

Reuse the previous proof with \(\delta = \min(d/2, \delta_{\text{unif}})\), where \(\delta_{\text{unif}}\) is the radius of \(\varepsilon/2\)-uniform continuity of \(f\) on the compact set at distance \(\ge d/2\) from \(J\) (where \(f\) is continuous, hence uniformly continuous).

For \(x \in K\) and \(|t| < \delta\), the point \(x - t\) stays at distance \(\ge d/2\) from \(J\), so uniform continuity applies; the tail bound is unchanged.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\sup_{x \in K} |\sigma_N(x) - f(x)| \to 0\) — Cesàro 평균은 점프를 피한 곳에서는 균등수렴을 회복합니다. 이것이 Fejér 정리가 \(S_N\)의 실패를 넘어서는 지점입니다: 평균을 취하면 울림이 평균화되어 사라집니다.`,
          en: String.raw`Hence \(\sup_{x \in K} |\sigma_N(x) - f(x)| \to 0\) — the Cesàro means recover uniform convergence away from the jumps. This is where Fejér's theorem goes beyond the failure of \(S_N\): averaging irons the ringing flat.`,
        },
      },
      {
        text: {
          ko: String.raw`아이디어 수준: 점프점 자체에서는 \(K_N\)이 대칭이므로 \(\sigma_N\)은 점프의 양쪽 값을 절반씩 받아, 정사각파의 경우 \(\sigma_N(0) = 0\) (중간값)으로 수렴합니다. 일반적으로는 한쪽 극한들의 평균 \((f(x^+) + f(x^-))/2\)로 수렴합니다 — 엄밀한 증명은 생략합니다.`,
          en: String.raw`Idea level: at a jump itself, the symmetry of \(K_N\) makes \(\sigma_N\) take half its mass from each side, so for the square wave \(\sigma_N(0) = 0\) (the midpoint). In general it converges to the average of the one-sided limits \((f(x^+) + f(x^-))/2\) — proof omitted.`,
        },
      },
    ],
  },
];
