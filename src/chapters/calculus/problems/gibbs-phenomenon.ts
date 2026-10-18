import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Gibbs phenomenon scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/gibbs-phenomenon.test.ts):
 *   Si(pi) = 1.85193705182,
 *   (2/pi)*Si(pi) = 1.178979744472167 — matches fourier.ts GIBBS_PEAK (1e-9),
 *   overshoot fraction ((2/pi)*Si(pi) - 1)/2 = 0.08948987 (1e-8),
 *   N = 12: measured first peak 1.1795589021787798 (error 0.000579 vs theory),
 *   N = 50: measured first peak within 0.005 of theory,
 *   numeric derivative of S_N matches (2/pi)*sin(2Nx)/sin(x) at x = 0.1,
 *   N = 8 (1e-6).
 * The Fourier scene's 'gibbs-numeric' problem observes this constant
 * numerically; the proofs here derive it.
 */
export const gibbsPhenomenonProblems: readonly ProblemMeta[] = [
  {
    id: 'derivative-identity',
    statement: {
      ko: String.raw`\(S_N(x) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{\sin((2k-1)x)}{2k-1}\)을 미분하여 \(S_N'(x) = \frac{2}{\pi}\cdot\frac{\sin(2Nx)}{\sin x}\)임을 증명하세요. \((0, \pi)\)에서의 임계점이 \(x_m = \frac{m\pi}{2N}\)이며, 첫 번째 피크가 \(x_1 = \frac{\pi}{2N}\)에 있음을 보이세요. (완전 증명)`,
      en: String.raw`Differentiate \(S_N(x) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{\sin((2k-1)x)}{2k-1}\) to prove \(S_N'(x) = \frac{2}{\pi}\cdot\frac{\sin(2Nx)}{\sin x}\). Show the critical points in \((0, \pi)\) are \(x_m = \frac{m\pi}{2N}\), with the first peak at \(x_1 = \frac{\pi}{2N}\). (Complete proof)`,
    },
    display: [
      String.raw`\sum_{k=1}^{N}\cos((2k-1)x) = \Re\sum_{k=1}^{N}e^{i(2k-1)x} = \frac{\sin(2Nx)}{2\sin x}`,
      String.raw`S_N'(x) = \frac{4}{\pi}\cdot\frac{\sin(2Nx)}{2\sin x} = \frac{2}{\pi}\cdot\frac{\sin(2Nx)}{\sin x}`,
      String.raw`x_m = \frac{m\pi}{2N}\quad (m = 1, \dots, 2N-1)`,
    ],
    preset: { N: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\): 첫 피크는 \(x_1 = \frac{\pi}{24} \approx 0.1309\) — 미분 항등식의 영점이 피크 위치를 정확히 찍습니다.`,
      en: String.raw`\(N = 12\): the first peak sits at \(x_1 = \frac{\pi}{24} \approx 0.1309\) — the derivative identity's zeros pin down the peak positions.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`유한합이므로 항별 미분이 정당합니다: \(S_N'(x) = \frac{4}{\pi}\sum_{k=1}^{N}\cos((2k-1)x)\). 코사인 합을 복소지수로 봅니다: \(\sum_{k=1}^{N}\cos((2k-1)x) = \Re\sum_{k=1}^{N}e^{i(2k-1)x}\).`,
          en: String.raw`The sum is finite, so termwise differentiation is legitimate: \(S_N'(x) = \frac{4}{\pi}\sum_{k=1}^{N}\cos((2k-1)x)\). View the cosine sum through complex exponentials: \(\sum_{k=1}^{N}\cos((2k-1)x) = \Re\sum_{k=1}^{N}e^{i(2k-1)x}\).`,
        },
      },
      {
        text: {
          ko: String.raw`등비급수입니다: \(\sum_{k=1}^{N}e^{i(2k-1)x} = e^{ix}\frac{1 - e^{i2Nx}}{1 - e^{i2x}}\). 분자와 분모를 인수분해하면 \(1 - e^{i2Nx} = -2i\,e^{iNx}\sin(Nx)\), \(1 - e^{i2x} = -2i\,e^{ix}\sin x\)이므로, 비는 \(\frac{e^{iNx}\sin(Nx)}{e^{ix}\sin x} = e^{i(N-1)x}\frac{\sin(Nx)}{\sin x}\)가 됩니다. 앞에 \(e^{ix}\)를 곱하면 \(e^{iNx}\frac{\sin(Nx)}{\sin x}\)이고, 실수부는 \(\frac{\cos(Nx)\sin(Nx)}{\sin x} = \frac{\sin(2Nx)}{2\sin x}\)입니다.`,
          en: String.raw`It is a geometric series: \(\sum_{k=1}^{N}e^{i(2k-1)x} = e^{ix}\frac{1 - e^{i2Nx}}{1 - e^{i2x}}\). Factoring, \(1 - e^{i2Nx} = -2i\,e^{iNx}\sin(Nx)\) and \(1 - e^{i2x} = -2i\,e^{ix}\sin x\), so the ratio is \(\frac{e^{iNx}\sin(Nx)}{e^{ix}\sin x} = e^{i(N-1)x}\frac{\sin(Nx)}{\sin x}\). Multiplying by the leading \(e^{ix}\) gives \(e^{iNx}\frac{\sin(Nx)}{\sin x}\), whose real part is \(\frac{\cos(Nx)\sin(Nx)}{\sin x} = \frac{\sin(2Nx)}{2\sin x}\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(S_N'(x) = \frac{4}{\pi}\cdot\frac{\sin(2Nx)}{2\sin x} = \frac{2}{\pi}\cdot\frac{\sin(2Nx)}{\sin x}\)입니다 — 홀수 주파수에 대한 Dirichlet 핵의 닫힌 형태입니다.`,
          en: String.raw`Hence \(S_N'(x) = \frac{4}{\pi}\cdot\frac{\sin(2Nx)}{2\sin x} = \frac{2}{\pi}\cdot\frac{\sin(2Nx)}{\sin x}\) — the Dirichlet kernel in closed form for the odd frequencies.`,
        },
      },
      {
        text: {
          ko: String.raw`\((0, \pi)\)에서 \(\sin x \ne 0\)이므로, 임계점은 \(\sin(2Nx) = 0\)에서: \(2Nx = m\pi\), 즉 \(x_m = \frac{m\pi}{2N}\) (\(m = 1, \dots, 2N-1\)). 구간 \((0, \frac{\pi}{2N})\)에서는 \(\sin(2Nx) > 0\)이고 \(\sin x > 0\)이므로 \(S_N'(x) > 0\)이며, \(S_N(0) = 0\)에서 출발해 단조증가하다가 \(x_1 = \frac{\pi}{2N}\)에서 첫 번째 극대(피크)를 찍습니다.`,
          en: String.raw`On \((0, \pi)\) we have \(\sin x \ne 0\), so critical points come from \(\sin(2Nx) = 0\): \(2Nx = m\pi\), i.e. \(x_m = \frac{m\pi}{2N}\) for \(m = 1, \dots, 2N-1\). On \((0, \frac{\pi}{2N})\) both \(\sin(2Nx) > 0\) and \(\sin x > 0\), so \(S_N'(x) > 0\); starting from \(S_N(0) = 0\) the sum climbs monotonically to its first maximum (the peak) at \(x_1 = \frac{\pi}{2N}\).`,
        },
      },
    ],
  },
  {
    id: 'si-limit',
    statement: {
      ko: String.raw`첫 피크의 높이가 \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\)로 수렴함을 보이세요. 단, 적분 기호 아래로 \(N \to \infty\) 극한을 통과시키는 단계를 analysis step으로 명시하세요. 또한 \(\mathrm{Si}(t) = \int_0^t \frac{\sin u}{u}\,du\)가 \(t = \pi\)에서 전역 최댓값을 가짐을 증명하세요. (analysis step 표기를 제외하고 완전 증명)`,
      en: String.raw`Show the first peak's height tends to \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\), marking the step that passes the limit \(N \to \infty\) under the integral as the analysis step. Also prove \(\mathrm{Si}(t) = \int_0^t \frac{\sin u}{u}\,du\) attains its global maximum at \(t = \pi\). (Complete except for the honestly marked analysis step)`,
    },
    display: [
      String.raw`S_N(x) = \frac{2}{\pi}\int_0^{2Nx}\frac{\sin t}{2N\sin(t/2N)}\,dt`,
      String.raw`\xrightarrow{\text{analysis step}} \frac{2}{\pi}\int_0^{2Nx}\frac{\sin t}{t}\,dt`,
      String.raw`\mathrm{Si}'(t) = \frac{\sin t}{t} > 0 \quad \text{on } (0, \pi)`,
    ],
    preset: { N: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\): 측정 피크 \(\approx 1.17956\), 이론 한계 \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\) — 오차 \(0.0006\) 미만.`,
      en: String.raw`\(N = 12\): measured peak \(\approx 1.17956\) against the theoretical limit \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\) — error under \(0.0006\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(S_N(0) = 0\)이므로 \(S_N(x) = \int_0^x S_N'(u)\,du\)입니다. 앞 문제의 항등식을 대입하면 \(S_N(x) = \frac{2}{\pi}\int_0^x \frac{\sin(2Nu)}{\sin u}\,du\). 치환 \(t = 2Nu\) (\(dt = 2N\,du\))로 \(S_N(x) = \frac{2}{\pi}\int_0^{2Nx}\frac{\sin t}{2N\sin(t/2N)}\,dt\)를 얻습니다 — 여기까지는 순수한 대수입니다.`,
          en: String.raw`Since \(S_N(0) = 0\), we have \(S_N(x) = \int_0^x S_N'(u)\,du\). Substituting the previous problem's identity gives \(S_N(x) = \frac{2}{\pi}\int_0^x \frac{\sin(2Nu)}{\sin u}\,du\); the change of variables \(t = 2Nu\) (\(dt = 2N\,du\)) yields \(S_N(x) = \frac{2}{\pi}\int_0^{2Nx}\frac{\sin t}{2N\sin(t/2N)}\,dt\) — pure algebra so far.`,
        },
      },
      {
        text: {
          ko: String.raw`고정된 \(t\)마다 \(2N\sin(t/2N) \to t\)입니다 (\(\sin v \sim v\)). ★ 여기서 딱 한 번 analysis를 씁니다: \(x \le \frac{\pi}{2}\)일 때 (특히 피크 \(x_1 = \frac{\pi}{2N}\)에서) \(t \in (0, 2Nx]\)에 대해 \(v = \frac{t}{2N} \in [0, \frac{\pi}{2}]\)이고, \(\sin v \ge \frac{2v}{\pi}\)에서 \(2N\sin(t/2N) \ge \frac{2t}{\pi}\)를 얻습니다. 따라서 피적분함수는 \(\frac{\pi}{2}\cdot\frac{\lvert\sin t\rvert}{t} \le \frac{\pi}{2}\)로 지배되고, 지배수렴정리로 극한을 적분 안으로: \(S_N(x) \to \frac{2}{\pi}\int_0^{2Nx}\frac{\sin t}{t}\,dt = \frac{2}{\pi}\mathrm{Si}(2Nx)\).`,
          en: String.raw`For each fixed \(t\), \(2N\sin(t/2N) \to t\) (since \(\sin v \sim v\)). ★ Here — exactly once — we use analysis: for \(x \le \frac{\pi}{2}\) (in particular at the peak \(x_1 = \frac{\pi}{2N}\)), \(t \in (0, 2Nx]\) gives \(v = \frac{t}{2N} \in [0, \frac{\pi}{2}]\), and \(\sin v \ge \frac{2v}{\pi}\) yields \(2N\sin(t/2N) \ge \frac{2t}{\pi}\). So the integrand is dominated by \(\frac{\pi}{2}\cdot\frac{\lvert\sin t\rvert}{t} \le \frac{\pi}{2}\). Dominated convergence passes the limit inside: \(S_N(x) \to \frac{2}{\pi}\int_0^{2Nx}\frac{\sin t}{t}\,dt = \frac{2}{\pi}\mathrm{Si}(2Nx)\).`,
        },
      },
      {
        text: {
          ko: String.raw`첫 피크 \(x_1 = \frac{\pi}{2N}\)에서는 \(2Nx_1 = \pi\)이므로, 피크 높이는 \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\)로 수렴합니다. 수치 교차검증: 푸리에 씬이 관측한 \(\mathrm{GIBBS\_PEAK} = 1.178979744472167\)과 \(10^{-9}\) 이내로 일치합니다.`,
          en: String.raw`At the first peak \(x_1 = \frac{\pi}{2N}\) we have \(2Nx_1 = \pi\), so the peak height tends to \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\). Numerical cross-check: it agrees with the Fourier scene's observed \(\mathrm{GIBBS\_PEAK} = 1.178979744472167\) to within \(10^{-9}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\mathrm{Si}'(t) = \frac{\sin t}{t} > 0\)이므로 \(\mathrm{Si}\)는 \((0, \pi)\)에서 엄격히 증가합니다. \(t > \pi\)에서는 꼬리 \(\int_{\pi}^{t}\frac{\sin u}{u}\,du\)를 \(L_k = \int_{k\pi}^{(k+1)\pi}\frac{\sin u}{u}\,du\) (\(k \ge 1\)) 로브들의 합으로 봅니다: 부호가 교대하고, \(\lvert L_{k+1}\rvert = \int_{k\pi}^{(k+1)\pi}\frac{\lvert\sin v\rvert}{v+\pi}\,dv < \int_{k\pi}^{(k+1)\pi}\frac{\lvert\sin v\rvert}{v}\,dv = \lvert L_k\rvert\)이므로 크기가 감소하며, 첫 로브 \(L_1 < 0\)입니다. 교대급수의 부분합은 전부 음수이므로 (짝수 개는 음수 쌍들의 합, 홀수 개는 거기에 음수 로브 하나 추가), \(\mathrm{Si}(t) < \mathrm{Si}(\pi)\) (\(t > \pi\)). 따라서 \(\mathrm{Si}\)의 전역 최댓값은 \(t = \pi\)에서, 값은 \(\approx 1.85194\)입니다.`,
          en: String.raw`Since \(\mathrm{Si}'(t) = \frac{\sin t}{t} > 0\), \(\mathrm{Si}\) is strictly increasing on \((0, \pi)\). For \(t > \pi\), split the tail \(\int_{\pi}^{t}\frac{\sin u}{u}\,du\) into lobes \(L_k = \int_{k\pi}^{(k+1)\pi}\frac{\sin u}{u}\,du\) (\(k \ge 1\)): they alternate in sign, shrink because \(\lvert L_{k+1}\rvert = \int_{k\pi}^{(k+1)\pi}\frac{\lvert\sin v\rvert}{v+\pi}\,dv < \int_{k\pi}^{(k+1)\pi}\frac{\lvert\sin v\rvert}{v}\,dv = \lvert L_k\rvert\), and the first lobe \(L_1 < 0\). Every partial sum of this alternating series is negative (even counts are sums of negative pairs, odd counts add one more negative lobe), so \(\mathrm{Si}(t) < \mathrm{Si}(\pi)\) for \(t > \pi\). Hence \(\mathrm{Si}\) attains its global maximum at \(t = \pi\), with value \(\approx 1.85194\).`,
        },
      },
    ],
  },
  {
    id: 'overshoot-never-dies',
    statement: {
      ko: String.raw`울림이 점프(크기 2)의 약 \(8.949\%\)임을 계산하고, \(N \to \infty\)에서도 사라지지 않는 이유를 증명하세요. (완전 증명)`,
      en: String.raw`Compute that the overshoot is about \(8.949\%\) of the jump (size 2), and prove why it never disappears as \(N \to \infty\). (Complete proof)`,
    },
    display: [
      String.raw`\frac{\frac{2}{\pi}\mathrm{Si}(\pi) - 1}{2} \approx 0.08948987 \approx 8.949\%`,
      String.raw`S_N\!\left(\frac{t}{2N}\right) \;\xrightarrow[N\to\infty]{}\; \frac{2}{\pi}\mathrm{Si}(t) \quad \text{(N-independent limit)}`,
    ],
    preset: { N: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\)에서도 울림은 이미 점프의 \(8.949\%\) — \(N\)을 키워도 이 비율은 그대로입니다.`,
      en: String.raw`Even at \(N = 12\) the overshoot is already \(8.949\%\) of the jump — and growing \(N\) leaves this fraction untouched.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`피크 높이의 한계는 \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\)이고 정사각파의 값은 \(1\)이므로, 울림은 \(1.17898 - 1 = 0.17898\)입니다. 점프가 \(-1\)에서 \(1\)로 크기 \(2\)이니, 울림의 비율은 \(\frac{0.17898}{2} = 0.08948987 \approx 8.949\%\)입니다.`,
          en: String.raw`The peak height tends to \(\frac{2}{\pi}\mathrm{Si}(\pi) \approx 1.17898\) while the square wave sits at \(1\), so the overshoot is \(1.17898 - 1 = 0.17898\). The jump runs from \(-1\) to \(1\) (size \(2\)), hence the overshoot fraction is \(\frac{0.17898}{2} = 0.08948987 \approx 8.949\%\).`,
        },
      },
      {
        text: {
          ko: String.raw`사라지지 않는 이유: 재조정된 좌표 \(t = 2Nx\)에서는 곡선 전체가 \(N\)과 무관한 한계함수 \(\frac{2}{\pi}\mathrm{Si}(t)\)로 수렴합니다 (앞 문제). 첫 번째 혹(bump)은 \(t\) 좌표에서 고정된 모양·높이를 가집니다.`,
          en: String.raw`Why it never dies: in the rescaled coordinate \(t = 2Nx\) the whole curve converges to the \(N\)-independent limit function \(\frac{2}{\pi}\mathrm{Si}(t)\) (previous problem). The first bump has a fixed shape and height in \(t\)-coordinates.`,
        },
      },
      {
        text: {
          ko: String.raw`원래 \(x\) 좌표로 돌아오면 \(t\) 구간의 폭이 \(1/(2N)\)으로 압축됩니다: 혹의 너비는 \(\sim \pi/N \to 0\)으로 좁아지지만, 높이는 상수 \(\frac{2}{\pi}\mathrm{Si}(\pi) - 1 \approx 0.179\)로 수렴합니다. 한 문장으로: 혹(bump)은 \(1/N\)처럼 좁아지지만 절대 낮아지지 않는다.`,
          en: String.raw`Back in the original \(x\)-coordinate the \(t\)-interval is squeezed by \(1/(2N)\): the bump's width \(\sim \pi/N \to 0\) narrows, but its height tends to the constant \(\frac{2}{\pi}\mathrm{Si}(\pi) - 1 \approx 0.179\). In one sentence: the bump narrows like \(1/N\) but never shrinks.`,
        },
      },
      {
        text: {
          ko: String.raw`이것이 푸리에 씬의 수치 관찰이 정확히 \(\frac{2}{\pi}\mathrm{Si}(\pi)\)이어야 했던 이유입니다 — 수치로 먼저 본 상수를 해석학이 뒤늦게 증명한 셈입니다.`,
          en: String.raw`This is why the Fourier scene's numerical observation had to be exactly \(\frac{2}{\pi}\mathrm{Si}(\pi)\) — analysis catching up to prove the constant the numerics had already seen.`,
        },
      },
    ],
  },
];
