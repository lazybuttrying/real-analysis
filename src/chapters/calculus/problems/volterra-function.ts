import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Volterra function scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/volterra-function.test.ts):
 *   N = 4: 15 complementary intervals (2^4 - 1), first interval
 *   (a, b) = (0.375, 0.625) removed at stage 1;
 *   removed length 15/32 = 0.46875 = (1 - 2^{-4})/2,
 *   remaining length 17/32 = 0.53125;
 *   sup|f'| over the sample grid approx 0.0306757 (proved bound 3/2);
 *   on the first interval, dense sampling near a gives
 *   max f' - min f' approx 0.0624950 >= 0.5 (b-a)^2 = 0.03125
 *   (the oscillation does not die);
 *   f(0) = f'(0) = 0; N = 7: 127 intervals, removed 127/256 = 0.49609375.
 *
 * Rigor note (see the proofs): the bump phi is differentiable everywhere
 * with phi = phi' = 0 at the endpoints, but it is NOT C^1 -- phi' is
 * discontinuous at each left endpoint a, since -(b-x)^2 cos(1/(x-a))
 * keeps amplitude (b-a)^2 as x -> a+. Problem 1 proves exactly this
 * (the task's "C^1" claim is corrected here); that failure is what makes
 * f' discontinuous on the Cantor set in Problem 3.
 */
export const volterraFunctionProblems: readonly ProblemMeta[] = [
  {
    id: 'bump-lemma',
    statement: {
      ko: String.raw`여집합 구간 \((a, b)\) 위의 범프 \(\varphi(x) = (x-a)^2(b-x)^2\sin\frac{1}{x-a}\) (\(a < x < b\), 끝점에서는 \(0\))가 모든 점에서 미분가능하고 \(\varphi(a) = \varphi(b) = \varphi'(a) = \varphi'(b) = 0\)임을 증명하세요.

내부에서의 도함수를 직접 계산하고, 끝점에서는 차분몫(difference quotient)으로 구하세요.

(주의: \(\varphi'\)은 왼쪽 끝점 \(a\)에서 불연속입니다 — 증명 과정에서 그 이유가 드러납니다.)`,
      en: String.raw`On a complementary interval \((a, b)\), let \(\varphi(x) = (x-a)^2(b-x)^2\sin\frac{1}{x-a}\) for \(a < x < b\) and \(\varphi = 0\) at the endpoints.

Prove \(\varphi\) is differentiable everywhere with \(\varphi(a) = \varphi(b) = \varphi'(a) = \varphi'(b) = 0\): compute the derivative directly inside \((a, b)\), and use the difference quotient at the endpoints.

(Warning: \(\varphi'\) is discontinuous at the left endpoint \(a\) — the proof reveals why.)`,
    },
    display: [
      String.raw`\varphi(x) = (x-a)^2(b-x)^2 \sin\frac{1}{x-a}`,
      String.raw`\varphi'(x) = 2(x-a)(b-x)\big((b-x)-(x-a)\big)\sin\frac{1}{x-a} - (b-x)^2\cos\frac{1}{x-a} \quad (a < x < b)`,
    ],
    preset: { stage: 4, interval: 0 },
    presetCaption: {
      ko: String.raw`단계 \(N = 4\), 첫 번째 여집합 구간 \((0.375, 0.625)\) 확대: \(\varphi_1\)은 매끈해 보이지만, 그 도함수의 진동항 \(-(b-x)^2\cos\frac{1}{x-a}\)는 \(x \to 0.375^+\)에서도 진폭 \((b-a)^2 = 0.0625\)를 유지하며 죽지 않습니다.`,
      en: String.raw`Stage \(N = 4\), zoomed on the first complementary interval \((0.375, 0.625)\): \(\varphi_1\) looks smooth, but the oscillatory term \(-(b-x)^2\cos\frac{1}{x-a}\) of its derivative keeps amplitude \((b-a)^2 = 0.0625\) as \(x \to 0.375^+\), refusing to die.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(u = x - a\), \(v = b - x\)라 두면 (\(u + v = b - a\), \(u, v > 0\)), 내부에서는 \(\varphi = u^2 v^2 \sin\frac{1}{u}\)입니다.

끝점 값은 조임 정리로: \(\lvert u^2 v^2 \sin\frac{1}{u} \rvert \le u^2 v^2 \to 0\) (\(x \to a^+\) 또는 \(x \to b^-\)).

구간 밖에서는 \(\varphi \equiv 0\)이므로, \(\varphi\)는 \([0,1]\)에서 연속이고 \(\varphi(a) = \varphi(b) = 0\)입니다.`,
          en: String.raw`Write \(u = x - a\), \(v = b - x\) (so \(u + v = b - a\) and \(u, v > 0\)); inside, \(\varphi = u^2 v^2 \sin\frac{1}{u}\).

The endpoint values follow by squeeze: \(\lvert u^2 v^2 \sin\frac{1}{u} \rvert \le u^2 v^2 \to 0\) as \(x \to a^+\) or \(x \to b^-\).

Outside the interval \(\varphi \equiv 0\), so \(\varphi\) is continuous on \([0,1]\) with \(\varphi(a) = \varphi(b) = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`내부 도함수는 곱미분·연쇄법칙으로 직접 계산합니다: \(\frac{d}{dx}[u^2 v^2] = 2uv^2 - 2u^2v = 2uv(v-u)\) (여기서 \(\frac{dv}{dx} = -1\)), \(\frac{d}{dx}\sin\frac{1}{u} = -\frac{1}{u^2}\cos\frac{1}{u}\)이므로 \(\varphi'(x) = 2uv(v-u)\sin\frac{1}{u} - v^2\cos\frac{1}{u}\)입니다 (위의 display 식).`,
          en: String.raw`Inside, differentiate directly with the product and chain rules: \(\frac{d}{dx}[u^2 v^2] = 2uv^2 - 2u^2v = 2uv(v-u)\) (using \(\frac{dv}{dx} = -1\)), and \(\frac{d}{dx}\sin\frac{1}{u} = -\frac{1}{u^2}\cos\frac{1}{u}\), giving \(\varphi'(x) = 2uv(v-u)\sin\frac{1}{u} - v^2\cos\frac{1}{u}\) (the display formula above).`,
        },
      },
      {
        text: {
          ko: String.raw`끝점에서는 위 공식의 극한이 아니라 차분몫을 씁니다.

\(h > 0\)에 대해 \(\varphi(a+h) = h^2(b-a-h)^2\sin\frac{1}{h}\)이므로 \(\frac{\varphi(a+h) - \varphi(a)}{h} = h(b-a-h)^2\sin\frac{1}{h}\)이고, 절댓값이 \(h(b-a)^2 \to 0\)으로 조여져 \(\varphi'(a) = 0\)입니다.

마찬가지로 \(\frac{\varphi(b-h) - \varphi(b)}{-h} = -h(b-h-a)^2\sin\frac{1}{\,b-h-a\,} \to 0\)이므로 \(\varphi'(b) = 0\)입니다.`,
          en: String.raw`At the endpoints use the difference quotient, not the limit of the formula above.

For \(h > 0\), \(\varphi(a+h) = h^2(b-a-h)^2\sin\frac{1}{h}\), so \(\frac{\varphi(a+h) - \varphi(a)}{h} = h(b-a-h)^2\sin\frac{1}{h}\), squeezed to \(0\) by \(h(b-a)^2\), so \(\varphi'(a) = 0\).

Likewise \(\frac{\varphi(b-h) - \varphi(b)}{-h} = -h(b-h-a)^2\sin\frac{1}{\,b-h-a\,} \to 0\), so \(\varphi'(b) = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(\varphi'\)은 \(a\)에서 연속이 아닙니다: \(x_m = a + \frac{1}{2\pi m}\)에서는 \(\sin\frac{1}{x_m - a} = 0\), \(\cos\frac{1}{x_m - a} = 1\)이므로 \(\varphi'(x_m) = -(b - x_m)^2 \to -(b-a)^2 \ne 0 = \varphi'(a)\)입니다.

즉 진동항 \(-(b-x)^2\cos\frac{1}{x-a}\)는 \(x \to a^+\)에서 진폭 \((b-a)^2\)를 유지하며 죽지 않습니다. (오른쪽 끝점 \(b\)에서는 \((b-x)^2 \to 0\)이 진동을 죽이므로 \(\varphi'\)이 연속입니다.)

따라서 범프는 모든 점에서 미분가능하고 끝점에서 함수값·도함수가 모두 \(0\)이지만, \(C^1\)은 아닙니다 — 그리고 바로 이 실패가 문제 3에서 \(f'\)을 칸토어 집합 위에서 불연속으로 만듭니다.`,
          en: String.raw`But \(\varphi'\) is not continuous at \(a\): at \(x_m = a + \frac{1}{2\pi m}\) we have \(\sin\frac{1}{x_m - a} = 0\) and \(\cos\frac{1}{x_m - a} = 1\), so \(\varphi'(x_m) = -(b - x_m)^2 \to -(b-a)^2 \ne 0 = \varphi'(a)\).

The oscillatory term \(-(b-x)^2\cos\frac{1}{x-a}\) keeps amplitude \((b-a)^2\) as \(x \to a^+\) and never dies. (At the right endpoint \(b\), the factor \((b-x)^2 \to 0\) kills the oscillation, so \(\varphi'\) is continuous there.)

Hence each bump is differentiable everywhere with value and derivative \(0\) at the endpoints, but not \(C^1\) — and exactly this failure is what makes \(f'\) discontinuous on the Cantor set in Problem 3.`,
        },
      },
    ],
  },
  {
    id: 'differentiable-bounded',
    statement: {
      ko: String.raw`\(f(x) = \sum_k 2^{-k}\varphi_k(x)\)라 하자 (합은 모든 여집합 구간에 대한 것).

\(\sum_k 2^{-k}\varphi_k\)와 \(\sum_k 2^{-k}\varphi'_k\)에 Weierstrass M-판정법을 적용하여 \(f\)가 \([0,1]\)의 모든 점에서 미분가능하고 \(f'\)이 유계임을 증명하세요.

핵심은 \(k\)에 대해 균일한 상한 \(\lvert\varphi_k\rvert \le \frac{1}{16}\), \(\lvert\varphi'_k\rvert \le \frac{3}{2}\)입니다 (\((b_k - a_k) \le 1\)을 이용).`,
      en: String.raw`Let \(f(x) = \sum_k 2^{-k}\varphi_k(x)\), summed over all complementary intervals.

Apply the Weierstrass M-test to \(\sum_k 2^{-k}\varphi_k\) and \(\sum_k 2^{-k}\varphi'_k\) to prove \(f\) is differentiable at every point of \([0,1]\) with bounded \(f'\).

The key is the \(k\)-uniform bounds \(\lvert\varphi_k\rvert \le \frac{1}{16}\) and \(\lvert\varphi'_k\rvert \le \frac{3}{2}\) (using \((b_k - a_k) \le 1\)).`,
    },
    display: [
      String.raw`\lvert\varphi_k(x)\rvert \le \left(\tfrac{b_k-a_k}{2}\right)^4 \le \tfrac{1}{16}, \qquad \lvert\varphi'_k(x)\rvert \le 2uv\lvert v-u\rvert + v^2 \le \tfrac12 + 1 = \tfrac32`,
      String.raw`f' = \sum_k 2^{-k}\varphi'_k \quad\text{everywhere}, \qquad \lvert f' \rvert \le \sum_k 2^{-k}\cdot\tfrac32 = \tfrac32`,
    ],
    preset: { stage: 4, interval: 0 },
    presetCaption: {
      ko: String.raw`단계 \(N = 4\): 여집합 구간 15개, 제거된 길이 \(\frac{15}{32} = 0.46875\), 남은 길이 \(\frac{17}{32} = 0.53125\). 격자 위에서 \(\sup\lvert f' \rvert \approx 0.0307\) — 증명의 상한 \(3/2\) 안에 여유롭게 들어갑니다.`,
      en: String.raw`Stage \(N = 4\): 15 complementary intervals, removed length \(\frac{15}{32} = 0.46875\), remaining length \(\frac{17}{32} = 0.53125\). On the sample grid \(\sup\lvert f' \rvert \approx 0.0307\) — comfortably inside the proved bound \(3/2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(g_k = 2^{-k}\varphi_k\)는 문제 1에 의해 \([0,1]\)에서 미분가능합니다 (끝점 포함, 도함수 \(0\)).

\(u, v \ge 0\), \(u + v = b_k - a_k \le 1\)이므로 \(u^2 v^2 \le \left(\frac{u+v}{2}\right)^4 \le \frac{1}{16}\) (산술-기하 평균), 즉 \(\lvert g_k \rvert \le 2^{-k}/16\)입니다.

\(\sum 2^{-k}/16 < \infty\)이므로 M-판정법으로 \(\sum g_k\)는 \([0,1]\)에서 균일수렴합니다 — 극한 \(f\)는 연속입니다.`,
          en: String.raw`Each \(g_k = 2^{-k}\varphi_k\) is differentiable on \([0,1]\) by Problem 1 (endpoints included, derivative \(0\)).

With \(u, v \ge 0\) and \(u + v = b_k - a_k \le 1\), AM-GM gives \(u^2 v^2 \le \left(\frac{u+v}{2}\right)^4 \le \frac{1}{16}\), so \(\lvert g_k \rvert \le 2^{-k}/16\).

Since \(\sum 2^{-k}/16 < \infty\), the M-test makes \(\sum g_k\) converge uniformly on \([0,1]\) — the limit \(f\) is continuous.`,
        },
      },
      {
        text: {
          ko: String.raw`도함수 쪽도 마찬가지입니다: \(\lvert\varphi'_k\rvert \le 2uv\lvert v-u\rvert + v^2\)에서 \(uv \le \left(\frac{u+v}{2}\right)^2 \le \frac{1}{4}\), \(\lvert v - u \rvert \le u + v \le 1\), \(v^2 \le 1\)이므로 \(\lvert\varphi'_k(x)\rvert \le \frac{1}{2} + 1 = \frac{3}{2}\) — \(k\)와 \(x\)에 대해 균일합니다. 따라서 \(\lvert g'_k \rvert \le 2^{-k}\cdot\frac{3}{2}\)이고, M-판정법으로 \(\sum g'_k = \sum 2^{-k}\varphi'_k\)도 균일수렴합니다.`,
          en: String.raw`The derivatives obey the same treatment: from \(\lvert\varphi'_k\rvert \le 2uv\lvert v-u\rvert + v^2\), using \(uv \le \left(\frac{u+v}{2}\right)^2 \le \frac{1}{4}\), \(\lvert v - u \rvert \le u + v \le 1\), and \(v^2 \le 1\), we get \(\lvert\varphi'_k(x)\rvert \le \frac{1}{2} + 1 = \frac{3}{2}\) — uniform in \(k\) and \(x\). Hence \(\lvert g'_k \rvert \le 2^{-k}\cdot\frac{3}{2}\), and the M-test makes \(\sum g'_k = \sum 2^{-k}\varphi'_k\) converge uniformly as well.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 표준 정리를 씁니다: 미분가능한 함수들의 급수가 한 점에서 수렴하고 도함수들의 급수가 균일수렴하면, 합은 미분가능하고 그 도함수는 도함수들의 합과 같습니다. 여기서 1단계의 M-판정법 균일수렴이 그 '한 점 수렴' 가정을 충족합니다 — \(\sum g_k\)가 \([0,1]\) 전체에서 균일수렴하므로 특히 한 점(예: \(0\))에서도 수렴합니다.

내부 점에 대해서는 정리를 \((0,1)\)의 모든 닫힌 부분구간 \([0, 1-\delta]\)와 \([\delta, 1]\)에 적용합니다. 끝점 \(0, 1\)에서는 같은 M-판정법 상한을 차분몫에 직접 적용합니다: 꼬리 \(\sum_{k>K} 2^{-k}\varphi'_k\)의 균일 상한이 차분몫의 꼬리도 지배하므로, 끝점에서의 한쪽 도함수도 \(f'(0) = \sum_k 2^{-k}\varphi'_k(0)\), \(f'(1) = \sum_k 2^{-k}\varphi'_k(1)\)를 줍니다.

따라서 \(f\)는 \([0,1]\)의 모든 점(끝점에서는 한쪽 도함수)에서 미분가능하고 \(f'(x) = \sum_k 2^{-k}\varphi'_k(x)\)이며, \(\lvert f'(x) \rvert \le \sum_k 2^{-k}\cdot\frac{3}{2} = \frac{3}{2}\)로 유계입니다. 수치 확인: 단계 4 격자에서 \(\sup\lvert f' \rvert \approx 0.0307\).`,
          en: String.raw`Now the standard theorem: if a series of differentiable functions converges at one point and the series of derivatives converges uniformly, the sum is differentiable and its derivative is the sum of the derivatives. Here the M-test uniform convergence in step 1 satisfies the 'one point convergence' hypothesis — \(\sum g_k\) converges uniformly on all of \([0,1]\), hence in particular at a point (e.g. \(0\)).

For interior points, apply the theorem on every closed subinterval \([0, 1-\delta]\) and \([\delta, 1]\) inside \((0,1)\). For the endpoints \(0, 1\), apply the same M-test bound directly to difference quotients: the uniform bound on the tail \(\sum_{k>K} 2^{-k}\varphi'_k\) also dominates the tail of the difference quotients, so the one-sided derivatives at the endpoints are \(f'(0) = \sum_k 2^{-k}\varphi'_k(0)\) and \(f'(1) = \sum_k 2^{-k}\varphi'_k(1)\).

Hence \(f\) is differentiable at every point of \([0,1]\) (one-sided at the endpoints) with \(f'(x) = \sum_k 2^{-k}\varphi'_k(x)\), bounded by \(\lvert f'(x) \rvert \le \sum_k 2^{-k}\cdot\frac{3}{2} = \frac{3}{2}\). Numerically: \(\sup\lvert f' \rvert \approx 0.0307\) on the stage-4 grid.`,
        },
      },
      {
        text: {
          ko: String.raw`따름정리: 칸토어 집합 \(C\) 위의 점 \(c\)에서는 모든 \(\varphi_k\)와 \(\varphi'_k\)가 \(0\)이므로 (여집합 구간 밖에 있음) \(f(c) = 0\)이고 \(f'(c) = 0\)입니다. 즉 \(f'\)은 \(C\) 위에서는 항등적으로 \(0\)이지만, 문제 3에서 보듯 \(C\)의 모든 점에서 불연속입니다.`,
          en: String.raw`Corollary: at any \(c\) in the Cantor set \(C\), every \(\varphi_k\) and \(\varphi'_k\) vanishes (as \(c\) lies outside all complementary intervals), so \(f(c) = 0\) and \(f'(c) = 0\). That is, \(f'\) is identically \(0\) on \(C\) — yet, as Problem 3 shows, discontinuous at every point of \(C\).`,
        },
      },
    ],
  },
  {
    id: 'discontinuous-derivative',
    statement: {
      ko: String.raw`칸토어 집합 \(C\)의 모든 점 \(c\)에서 \(f'\)이 불연속임을 증명하세요: \(c\)의 모든 근방은 여집합 구간 \((a_k, b_k)\)를 통째로 포함하고 (\(C\)는 내점이 없음), 그 위에서 \(f' = 2^{-k}\varphi'_k\)는 \(a_k\) 근처에서 진폭 \(\approx 2^{-k}(b_k-a_k)^2\)로 진동하는 반면 \(f'(c) = 0\)입니다.

그 다음 르베그 판정법(아래에서는 정리로 인용 — 증명은 아이디어 수준, measure/lebesgue 씬 참조)을 써서 \(f'\)이 리만 적분가능하지 않음을 결론지으세요.`,
      en: String.raw`Prove \(f'\) is discontinuous at every \(c\) in the Cantor set \(C\): each neighborhood of \(c\) contains a whole complementary interval \((a_k, b_k)\) (\(C\) has empty interior), on which \(f' = 2^{-k}\varphi'_k\) oscillates near \(a_k\) with amplitude \(\approx 2^{-k}(b_k-a_k)^2\), while \(f'(c) = 0\).

Then conclude via Lebesgue's criterion (cited as a theorem below — proof at idea level; see the measure/lebesgue scenes) that \(f'\) is not Riemann integrable.`,
    },
    display: [
      String.raw`\text{(Lebesgue, cited): } g \text{ bounded on } [a,b]`,
      String.raw`g \in \mathcal{R}[a,b] \iff g \text{ is continuous a.e.}`,
      String.raw`x_m = a_k + \tfrac{1}{\pi m}`,
      String.raw`f'(x_m) = 2^{-k}(b_k-x_m)^2(-1)^{m+1} \to \pm 2^{-k}(b_k-a_k)^2`,
    ],
    preset: { stage: 4, interval: 0 },
    presetCaption: {
      ko: String.raw`단계 \(N = 4\), 첫 구간 \((0.375, 0.625)\) 확대: \(x \to 0.375^+\)에서 \(f'\)의 진동 폭(peak-to-peak)은 \(\approx 0.0625\)로 죽지 않는데, 칸토어 집합 위의 모든 점에서는 \(f'(c) = 0\)입니다 — 그래서 \(f'\)은 \(C\)의 모든 점에서 불연속입니다.`,
      en: String.raw`Stage \(N = 4\), zoomed on the first interval \((0.375, 0.625)\): as \(x \to 0.375^+\), the peak-to-peak swing of \(f'\) stays \(\approx 0.0625\) while \(f'(c) = 0\) at every point of the Cantor set — so \(f'\) is discontinuous at every point of \(C\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`보조정리: \(c \in C\)의 모든 근방은 여집합 구간을 통째로 포함합니다. \(c\)를 포함하는 단계별 잔여 닫힌구간을 \(I_n\)이라 하면 \(\lvert I_n \rvert \to 0\)이고, 단계 \(n\)에서 \(I_{n-1}\)의 한가운데가 제거되어 여집합 구간 \(J_n = (a_k, b_k)\) (\( \lvert J_n \rvert = 4^{-n}\))이 생깁니다.

\(\lvert I_{n-1} \rvert < \delta\)인 \(n\)을 택하면 \(J_n \subset I_{n-1}\) 전체가 \(c\)에서 \(\delta\) 안에 들어갑니다.

즉 \(C\)는 내점이 없습니다 (어느 열린구간을 잡아도 언젠가 그 안에서 한가운데가 제거됨).`,
          en: String.raw`Lemma: every neighborhood of \(c \in C\) contains a whole complementary interval. Let \(I_n\) be the stage-\(n\) surviving closed interval containing \(c\); then \(\lvert I_n \rvert \to 0\), and at stage \(n\) the middle chunk removed from \(I_{n-1}\) is a complementary interval \(J_n = (a_k, b_k)\) of length \(4^{-n}\).

For \(n\) with \(\lvert I_{n-1} \rvert < \delta\), all of \(J_n \subset I_{n-1}\) lies within \(\delta\) of \(c\).

So \(C\) has empty interior (every open interval eventually has its middle removed).`,
        },
      },
      {
        text: {
          ko: String.raw`그런 구간 \((a, b) = (a_k, b_k)\) 위에서는 \(f' = 2^{-k}\varphi'_k\)입니다 (다른 모든 항은 \(0\)). \(x_m = a + \frac{1}{\pi m}\)이라 두면 \(\sin\frac{1}{x_m - a} = \sin(\pi m) = 0\), \(\cos\frac{1}{x_m - a} = (-1)^m\)이므로 \(\varphi'_k(x_m) = -(b-x_m)^2(-1)^m\)이고, \(f'(x_m) = 2^{-k}(b-x_m)^2(-1)^{m+1} \to \pm 2^{-k}(b-a)^2\)입니다 (짝수/홀수 \(m\)에 따라 부호가 갈림).`,
          en: String.raw`On such an interval \((a, b) = (a_k, b_k)\), \(f' = 2^{-k}\varphi'_k\) (every other term is \(0\)). With \(x_m = a + \frac{1}{\pi m}\), we have \(\sin\frac{1}{x_m - a} = \sin(\pi m) = 0\) and \(\cos\frac{1}{x_m - a} = (-1)^m\), so \(\varphi'_k(x_m) = -(b-x_m)^2(-1)^m\) and \(f'(x_m) = 2^{-k}(b-x_m)^2(-1)^{m+1} \to \pm 2^{-k}(b-a)^2\) (sign alternating with the parity of \(m\)).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 문제 2의 따름정리로 \(f'(c) = 0\)입니다. \(x_m \to a\)이고 \(a\)는 \(c\)에 임의로 가까우므로, \(c\)에 임의로 가까운 점들에서 \(f'\)은 \(+2^{-k}(b-a)^2/2\) 이상과 \(-2^{-k}(b-a)^2/2\) 이하의 값을 모두 취합니다 — \(f'(c) = 0\)에 수렴할 수 없습니다.

따라서 \(f'\)은 \(c\)에서 불연속이고, \(c \in C\)는 임의였으므로 \(C\)의 모든 점에서 불연속입니다.

수치로: 첫 구간 \((0.375, 0.625)\)에서 \(x \to 0.375^+\) 근처 촘촘한 격자는 \(\max f' - \min f' \approx 0.0625 = 2\cdot\frac12\cdot(0.25)^2\)를 보여줍니다.`,
          en: String.raw`But Problem 2's corollary gives \(f'(c) = 0\). Since \(x_m \to a\) and \(a\) is arbitrarily close to \(c\), there are points arbitrarily close to \(c\) where \(f'\) takes values both above \(+2^{-k}(b-a)^2/2\) and below \(-2^{-k}(b-a)^2/2\) — it cannot converge to \(f'(c) = 0\).

Hence \(f'\) is discontinuous at \(c\), and \(c \in C\) was arbitrary: \(f'\) is discontinuous at every point of \(C\).

Numerically: on the first interval \((0.375, 0.625)\), a dense grid near \(x \to 0.375^+\) shows \(\max f' - \min f' \approx 0.0625 = 2\cdot\frac12\cdot(0.25)^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 르베그 판정법을 정리로 인용합니다 (증명은 측도론이므로 아이디어 수준으로 둡니다 — measure/lebesgue 씬 참조): \([a,b]\) 위의 유계 함수가 리만 적분가능할 필요충분조건은 거의 모든 점에서 연속인 것, 즉 불연속점들의 집합의 르베그 측도가 \(0\)인 것입니다.

\(f'\)은 문제 2에서 유계이고, 불연속점 집합은 \(C\)를 포함하며, \(C\)는 닫힌집합으로서 측도가 \(1/2\)입니다 (여집합의 전체 길이가 \(\lim_{N\to\infty}\frac{1-2^{-N}}{2} = \frac12\)). 불연속점 집합의 측도가 양수이므로 \(f'\)은 리만 적분가능하지 않습니다.

결론: 모든 점에서 미분가능하고 도함수가 유계인 함수가 존재하지만, 그 도함수는 리만 적분가능하지 않을 수 있습니다 — 이것이 볼테라 함수의 펀치라인입니다.`,
          en: String.raw`Finally we cite Lebesgue's criterion as a theorem (its proof is measure theory, so we keep it at idea level — see the measure/lebesgue scenes): a bounded function on \([a,b]\) is Riemann integrable iff it is continuous almost everywhere, i.e. its discontinuity set has Lebesgue measure \(0\).

Here \(f'\) is bounded (Problem 2), its discontinuity set contains \(C\), and \(C\) is closed with measure \(1/2\) (the complement's total length is \(\lim_{N\to\infty}\frac{1-2^{-N}}{2} = \frac12\)). A discontinuity set of positive measure means \(f'\) is not Riemann integrable.

The punchline: a function can be differentiable everywhere with bounded derivative, yet its derivative need not be Riemann integrable.`,
        },
      },
    ],
  },
];
