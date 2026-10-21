import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Parseval scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/parseval.test.ts): square wave b_n = 4/(pi n) (odd n), sawtooth
 * b_n = 2(-1)^{n+1}/n, parabola a_0 = 2 pi^2/3, a_n = 4(-1)^n/n^2, and the
 * partial energies rise to (1/pi) int f^2 (2, 2 pi^2/3, 2 pi^4/5).
 */
export const parsevalProblems: readonly ProblemMeta[] = [
  {
    id: 'parseval-square',
    statement: {
      ko: String.raw`구형파 \(f(x) = \operatorname{sgn}(x)\) (\([-\pi, \pi]\))에 대해 파스발 항등식을 검증하세요: 먼저 씬에서 \(S_N\)이 2에 접근함을 수치로 확인한 뒤, \(\sum_{\text{홀수 } n} \frac{16}{\pi^2 n^2} = 2\)를 바젤 문제 \(\sum_{n\ge 1} \frac{1}{n^2} = \frac{\pi^2}{6}\)으로부터 엄밀히 증명하세요.`,
      en: String.raw`Verify Parseval's identity for the square wave \(f(x) = \operatorname{sgn}(x)\) (on \([-\pi, \pi]\)): first check numerically in the scene that \(S_N\) approaches 2, then prove rigorously from the Basel problem \(\sum_{n\ge 1} \frac{1}{n^2} = \frac{\pi^2}{6}\) that \(\sum_{\text{odd } n} \frac{16}{\pi^2 n^2} = 2\).`,
    },
    display: [
      String.raw`\frac{1}{\pi}\int_{-\pi}^{\pi} f^2 = 2 = \sum_{\text{odd } n} \frac{16}{\pi^2 n^2}, \qquad \sum_{\text{odd } n} \frac{1}{n^2} = \frac{\pi^2}{8}`,
    ],
    preset: { mode: 'square', n: 40 },
    presetCaption: {
      ko: String.raw`구형파, \(N = 40\): \(S_{40} = \sum_{\text{홀수 } n \le 40} \frac{16}{\pi^2 n^2} \approx 1.9798\) — 목표 2의 약 99%에 도달했습니다.`,
      en: String.raw`Square wave, \(N = 40\): \(S_{40} = \sum_{\text{odd } n \le 40} \frac{16}{\pi^2 n^2} \approx 1.9798\) — about 99% of the target 2.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f^2 = 1\)이므로 \(L^2\) 노름은 \(\frac{1}{\pi}\int_{-\pi}^{\pi} f^2\,dx = \frac{2\pi}{\pi} = 2\)입니다. \(f\)가 기함수이므로 \(a_n = 0\)이고, \(b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx = \frac{2}{\pi}\int_0^{\pi} \sin(nx)\,dx = \frac{2(1 - (-1)^n)}{n\pi}\) — 홀수 \(n\)에서 \(\frac{4}{n\pi}\), 짝수 \(n\)에서 0입니다.`,
          en: String.raw`Since \(f^2 = 1\), the \(L^2\) norm is \(\frac{1}{\pi}\int_{-\pi}^{\pi} f^2\,dx = \frac{2\pi}{\pi} = 2\). As \(f\) is odd, \(a_n = 0\), and \(b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx = \frac{2}{\pi}\int_0^{\pi} \sin(nx)\,dx = \frac{2(1 - (-1)^n)}{n\pi}\) — \(\frac{4}{n\pi}\) for odd \(n\), 0 for even \(n\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 파스발의 우변은 \(\frac{a_0^2}{2} + \sum_{n\ge 1} b_n^2 = \sum_{\text{홀수 } n} \frac{16}{\pi^2 n^2} = \frac{16}{\pi^2}\sum_{\text{홀수 } n} \frac{1}{n^2}\)입니다. 바젤 문제에서 \(\sum_{n\ge 1} \frac{1}{n^2} = \frac{\pi^2}{6}\)이고, 짝수 항만 모으면 \(\sum_{k\ge 1} \frac{1}{(2k)^2} = \frac{1}{4}\cdot\frac{\pi^2}{6} = \frac{\pi^2}{24}\)이므로, 홀수 항의 합은 \(\frac{\pi^2}{6} - \frac{\pi^2}{24} = \frac{\pi^2}{8}\)입니다.`,
          en: String.raw`Hence Parseval's right side is \(\frac{a_0^2}{2} + \sum_{n\ge 1} b_n^2 = \sum_{\text{odd } n} \frac{16}{\pi^2 n^2} = \frac{16}{\pi^2}\sum_{\text{odd } n} \frac{1}{n^2}\). From the Basel problem \(\sum_{n\ge 1} \frac{1}{n^2} = \frac{\pi^2}{6}\); the even terms alone give \(\sum_{k\ge 1} \frac{1}{(2k)^2} = \frac{1}{4}\cdot\frac{\pi^2}{6} = \frac{\pi^2}{24}\), so the odd terms sum to \(\frac{\pi^2}{6} - \frac{\pi^2}{24} = \frac{\pi^2}{8}\).`,
        },
      },
      {
        text: {
          ko: String.raw`대입하면 \(\frac{16}{\pi^2}\cdot\frac{\pi^2}{8} = 2\) — 좌변의 \(L^2\) 노름 2와 정확히 일치합니다. 파스발 항등식이 이 예에서 성립함이 증명되었습니다. 씬의 막대가 \(N = 40\)에서 2에 바짝 붙는 것은 이 무한합의 부분합을 보는 것입니다.`,
          en: String.raw`Substituting gives \(\frac{16}{\pi^2}\cdot\frac{\pi^2}{8} = 2\) — exactly the \(L^2\) norm 2 on the left. Parseval's identity is proved in this example. The scene's bars pressing against 2 at \(N = 40\) are the partial sums of this infinite series.`,
        },
      },
    ],
  },
  {
    id: 'parseval-bessel',
    statement: {
      ko: String.raw`\([-\pi, \pi]\)에서 Riemann integrable한 \(f\)에 대해, 삼각 함수계의 직교성을 이용해 \(\|f - S_N\|_2^2 \ge 0\)을 전개함으로써 베셀 부등식 \(\frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2) \le \frac{1}{\pi}\int_{-\pi}^{\pi} f^2\)를 완전히 증명하세요 (파스발의 유한 핵심).`,
      en: String.raw`For \(f\) Riemann integrable on \([-\pi, \pi]\), using the orthogonality of the trigonometric system, expand \(\|f - S_N\|_2^2 \ge 0\) to prove completely Bessel's inequality \(\frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2) \le \frac{1}{\pi}\int_{-\pi}^{\pi} f^2\) (the finite core of Parseval).`,
    },
    display: [
      String.raw`0 \le \|f - S_N\|_2^2 = \|f\|_2^2 - \left(\frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\right)`,
    ],
    preset: { mode: 'sawtooth', n: 20 },
    presetCaption: {
      ko: String.raw`톱니파, \(N = 20\): \(S_{20} = \sum_{n\le 20} \frac{4}{n^2} \approx 6.38\)이 \(L^2\) 노름 \(\frac{2\pi^2}{3} \approx 6.5797\) 아래에 있습니다 — 베셀 부등식 그 자체입니다.`,
      en: String.raw`Sawtooth, \(N = 20\): \(S_{20} = \sum_{n\le 20} \frac{4}{n^2} \approx 6.38\) sits below the \(L^2\) norm \(\frac{2\pi^2}{3} \approx 6.5797\) — Bessel's inequality itself.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`가설을 명시합니다: \(f\)는 \([-\pi, \pi]\)에서 Riemann integrable하다고 가정합니다. 그러면 \(f^2\)도 integrable하고, 푸리에 계수 \(a_n, b_n\)과 \(\int_{-\pi}^{\pi} f^2\)가 모두 잘 정의됩니다. 내적을 \(\langle g, h\rangle = \frac{1}{\pi}\int_{-\pi}^{\pi} g(x)h(x)\,dx\)로 두면 삼각 함수계 \(\{1/\sqrt{2}, \cos(nx), \sin(nx)\}\)는 정규직교계입니다. 푸리에 부분합을 \(S_N = \frac{a_0}{2} + \sum_{n=1}^{N}(a_n\cos(nx) + b_n\sin(nx))\)라 쓰면, \(\|f - S_N\|_2^2 = \langle f - S_N, f - S_N\rangle = \|f\|_2^2 - 2\langle f, S_N\rangle + \|S_N\|_2^2\)입니다 — 항상 0 이상입니다.`,
          en: String.raw`State the hypotheses: assume \(f\) is Riemann integrable on \([-\pi, \pi]\). Then \(f^2\) is integrable as well, and the Fourier coefficients \(a_n, b_n\) and \(\int_{-\pi}^{\pi} f^2\) are all well-defined. With the inner product \(\langle g, h\rangle = \frac{1}{\pi}\int_{-\pi}^{\pi} g(x)h(x)\,dx\), the trigonometric system \(\{1/\sqrt{2}, \cos(nx), \sin(nx)\}\) is orthonormal. Writing the Fourier partial sum as \(S_N = \frac{a_0}{2} + \sum_{n=1}^{N}(a_n\cos(nx) + b_n\sin(nx))\), we get \(\|f - S_N\|_2^2 = \langle f - S_N, f - S_N\rangle = \|f\|_2^2 - 2\langle f, S_N\rangle + \|S_N\|_2^2\) — always nonnegative.`,
        },
      },
      {
        text: {
          ko: String.raw`계수의 정의가 곧 \(\langle f, \cos(nx)\rangle = a_n\), \(\langle f, \sin(nx)\rangle = b_n\), \(\langle f, 1\rangle = a_0\)이므로, \(\langle f, S_N\rangle = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\)입니다. 직교성에 의해 \(\|S_N\|_2^2 = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\)도 같습니다 (교차항이 전부 0).`,
          en: String.raw`The coefficient definitions are exactly \(\langle f, \cos(nx)\rangle = a_n\), \(\langle f, \sin(nx)\rangle = b_n\), \(\langle f, 1\rangle = a_0\), so \(\langle f, S_N\rangle = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\). By orthogonality, \(\|S_N\|_2^2 = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\) as well (every cross term is 0).`,
        },
      },
      {
        text: {
          ko: String.raw`대입하면 \(0 \le \|f - S_N\|_2^2 = \|f\|_2^2 - 2E_N + E_N = \|f\|_2^2 - E_N\) (여기서 \(E_N = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\)) — 즉 \(E_N \le \|f\|_2^2\)입니다. 이것이 베셀 부등식이며, 씬에서 막대가 점선을 절대 넘지 않는 이유입니다. \(N \to \infty\) 극한이 파스발 항등식이 됩니다 (아래 문제 3).`,
          en: String.raw`Substituting gives \(0 \le \|f - S_N\|_2^2 = \|f\|_2^2 - 2E_N + E_N = \|f\|_2^2 - E_N\) (with \(E_N = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\)) — i.e. \(E_N \le \|f\|_2^2\). That is Bessel's inequality, and why the scene's bars never cross the dashed line. The \(N \to \infty\) limit is Parseval's identity (problem 3 below).`,
        },
      },
    ],
  },
  {
    id: 'parseval-l2-convergence',
    statement: {
      ko: String.raw`파스발 항등식 \(\frac{a_0^2}{2} + \sum_{n\ge 1}(a_n^2 + b_n^2) = \|f\|_2^2\)가 성립하면 푸리에 부분합 \(S_N\)이 \(L^2\)에서 \(f\)로 수렴함을 증명하세요. 삼각다항식이 조밀하다는 완비성은 다리로만 언급하세요 (이 단계는 아이디어 수준).`,
      en: String.raw`Prove that if Parseval's identity \(\frac{a_0^2}{2} + \sum_{n\ge 1}(a_n^2 + b_n^2) = \|f\|_2^2\) holds, then the Fourier partial sums \(S_N\) converge to \(f\) in \(L^2\). Mention the completeness (density of trigonometric polynomials) only as the bridge — that step is idea-level.`,
    },
    display: [
      String.raw`\|f - S_N\|_2^2 = \|f\|_2^2 - \left(\frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\right) \;\xrightarrow[N \to \infty]{}\; 0`,
    ],
    preset: { mode: 'parabola', n: 12 },
    presetCaption: {
      ko: String.raw`포물선, \(N = 12\): 에너지가 \(1/n^4\)으로 들어가 \(S_{12}\)가 이미 \(L^2\) 노름 \(\frac{2\pi^4}{5} \approx 38.96\)의 99.99% 이상을 포착합니다 — \(L^2\) 수렴이 눈앞에서 일어납니다.`,
      en: String.raw`Parabola, \(N = 12\): the energy enters as \(1/n^4\), so \(S_{12}\) already captures over 99.99% of the \(L^2\) norm \(\frac{2\pi^4}{5} \approx 38.96\) — \(L^2\) convergence happening before your eyes.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`문제 2의 전개는 부등식이 아니라 항등식입니다: \(0\)이 아닌 \(\|f - S_N\|_2^2\)를 그대로 두면 \(\|f - S_N\|_2^2 = \|f\|_2^2 - E_N\) (여기서 \(E_N = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\))을 얻습니다 — 직교성 덕분에 교차항이 사라지고 이 식이 정확히 성립합니다.`,
          en: String.raw`Problem 2's expansion is an identity, not just an inequality: keeping \(\|f - S_N\|_2^2\) instead of replacing it by \(0\) gives \(\|f - S_N\|_2^2 = \|f\|_2^2 - E_N\) (with \(E_N = \frac{a_0^2}{2} + \sum_{n=1}^{N}(a_n^2 + b_n^2)\)) — the cross terms vanish by orthogonality, so this holds exactly.`,
        },
      },
      {
        text: {
          ko: String.raw`파스발 항등식은 \(E_N \to \|f\|_2^2\) (\(N \to \infty\))라고 말합니다. 따라서 \(\|f - S_N\|_2^2 = \|f\|_2^2 - E_N \to 0\) — 즉 \(S_N \to f\) in \(L^2\)입니다. 부등식에서 등식으로 넘어가는 이 한 걸음이 전부입니다: 함의 자체는 완전히 증명되었습니다.`,
          en: String.raw`Parseval's identity says \(E_N \to \|f\|_2^2\) as \(N \to \infty\). Hence \(\|f - S_N\|_2^2 = \|f\|_2^2 - E_N \to 0\) — i.e. \(S_N \to f\) in \(L^2\). That one step, from inequality to equality, is the whole argument: the implication itself is completely proved.`,
        },
      },
      {
        text: {
          ko: String.raw`다리 (아이디어 수준): 파스발 항등식 자체가 성립하려면 삼각 함수계가 "완비"해야 합니다 — 유한 삼각다항식으로 \(f\)를 \(L^2\)에서 원하는 만큼 가깝게 근사할 수 있다는 뜻입니다. 주의: 모든 trigonometric polynomial은 \(T(-\pi) = T(\pi)\)를 만족하므로, 연속함수 \(f\)의 uniform approximation에는 가설 \(f(-\pi) = f(\pi)\)가 필요합니다 (이 경우 Stone-Weierstrass theorem for trigonometric polynomials를 적용합니다). 일반적인 \(f\)에 대해서는 endpoint가 \(L^2\)에서 measure zero이므로 이 조건이 \(L^2\) 근사를 막지 않습니다: 먼저 \(f\)를 \(L^2\)에서 연속함수로 근사하고, endpoint 값을 맞춰 조정한 뒤 위 근사를 적용합니다. 그 증명은 여기서 생략합니다. 일단 다리가 놓이면 위의 함의가 \(L^2\) 수렴을 완성합니다.`,
          en: String.raw`The bridge (idea level): Parseval's identity itself needs the trigonometric system to be "complete" — finite trigonometric polynomials must approximate \(f\) in \(L^2\) to any accuracy. Caution: every trigonometric polynomial satisfies \(T(-\pi) = T(\pi)\), so uniform approximation of a continuous \(f\) needs the hypothesis \(f(-\pi) = f(\pi)\) (in that case the Stone-Weierstrass theorem for trigonometric polynomials applies). For a general \(f\) the endpoints are measure zero in \(L^2\), so this condition does not block \(L^2\) approximation: first approximate \(f\) in \(L^2\) by continuous functions, adjust the endpoint values to match, then apply the approximation above. The proof is omitted here. Once the bridge stands, the implication above completes the \(L^2\) convergence.`,
        },
      },
    ],
  },
];
