import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Darboux's theorem scene.
 * Imports nothing except types. Every number below was verified against the model:
 *   preset { zoom: 70, level: 0.4 }: halfWidth = 0.5 * 10^-2.1 ~= 0.00397, 704 crossings;
 *   preset { zoom: 100, level: 0 }:  halfWidth = 5e-4, 1579 crossings;
 *   preset { zoom: 0, level: 0.5 }:  halfWidth = 0.5, 46 crossings;
 *   f'(1/(2pi)) = 2(1/2pi) sin(2pi) - cos(2pi) = -1 exactly;
 *   f'(1/pi) = 2(1/pi) sin(pi) - cos(pi) = 1 exactly;
 *   f'(a_k) = -1 for a_k = 1/(2k pi), f'(b_k) = 1 for b_k = 1/((2k+1) pi) (k = 5, 10, 20);
 *   diffQuot(0.01) = 0.01 sin(100) ~= -0.00506, diffQuot(1e-6) ~= -3.5e-7.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'darboux-theorem-proof',
    statement: {
      ko: String.raw`다르부 정리를 증명하세요: \(f\)가 \([a,b]\)에서 미분가능하면 \(f'\)은 \(f'(a)\)와 \(f'(b)\) 사이의 모든 값을 취합니다. (힌트: 극값 정리 장면(최댓값 정리)과 페르마 내부 극값 보조정리를 사용하세요.)`,
      en: String.raw`Prove Darboux's theorem: if \(f\) is differentiable on \([a,b]\), then \(f'\) takes every value between \(f'(a)\) and \(f'(b)\). (Hint: use the Extreme Value Theorem scene and Fermat's interior-extremum lemma.)`,
    },
    display: [
      String.raw`g(x) = f(x) - cx,\qquad g'(a) < 0 < g'(b)\ \Longrightarrow\ \exists\, x_0 \in (a,b):\ g'(x_0) = 0`,
      String.raw`g'(x_0) = 0\ \Longrightarrow\ f'(x_0) = c`,
    ],
    preset: { zoom: 70, level: 0.4, showF: true },
    presetCaption: {
      ko: String.raw`줌 70 (창 \([\pm 0.004]\)), 테스트 높이 \(y = 0.4\): 불연속인 \(f'\)이 이 창에서 수평선을 704번 만난다 (그리드 기준) — 다르부 성질의 현장.`,
      en: String.raw`Zoom 70 (window \([\pm 0.004]\)), test level \(y = 0.4\): the discontinuous \(f'\) meets the horizontal line 704 times in this window (at grid resolution) — the Darboux property in action.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 페르마 보조정리: \(g\)가 내부 점 \(x_0 \in (a,b)\)에서 극댓값(또는 극솟값)을 갖고 \(g'(x_0)\)이 존재하면 \(g'(x_0) = 0\)이다. 극솟값인 경우, \(h > 0\)이 작을 때 \(\frac{g(x_0+h)-g(x_0)}{h} \geq 0\)이고 \(h < 0\)일 때는 \(\leq 0\)이므로, 양쪽 극한이 존재하는 도함수는 0일 수밖에 없다. 극댓값도 부호를 뒤집어 같다.`,
          en: String.raw`First Fermat's lemma: if \(g\) has a local max (or min) at an interior point \(x_0 \in (a,b)\) and \(g'(x_0)\) exists, then \(g'(x_0) = 0\). For a local min, \(\frac{g(x_0+h)-g(x_0)}{h} \geq 0\) for small \(h > 0\) and \(\leq 0\) for \(h < 0\); the two-sided limit defining the derivative is forced to 0. A local max is the same with signs flipped.`,
        },
      },
      {
        text: {
          ko: String.raw`\(f'(a) < f'(b)\)라 하자 (\(>\)인 경우는 \(-f\)에 적용하고, 같은 경우는 자명하다). \(f'(a)\)와 \(f'(b)\) 사이의 \(c\)를 고정하고 \(g(x) = f(x) - cx\)라 두면 \(g\)는 \([a,b]\)에서 미분가능하므로 연속이고, \(g'(x) = f'(x) - c\)라서 \(g'(a) < 0 < g'(b)\)이다. 극값 정리(최댓값 정리 장면)에 의해 \(g\)는 \([a,b]\)에서 최솟값을 어떤 \(x_0\)에서 취한다.`,
          en: String.raw`Assume \(f'(a) < f'(b)\) (apply the argument to \(-f\) if \(>\); the equal case is trivial). Fix \(c\) between them and put \(g(x) = f(x) - cx\): then \(g\) is differentiable, hence continuous, on \([a,b]\), and \(g'(x) = f'(x) - c\) gives \(g'(a) < 0 < g'(b)\). By the Extreme Value Theorem (the EVT scene), \(g\) attains its minimum at some \(x_0 \in [a,b]\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_0\)는 내부 점이다: \(g'(a) < 0\)이므로 \(\frac{g(a+h)-g(a)}{h} \to g'(a) < 0\)이라 작은 \(h > 0\)에 대해 \(g(a+h) < g(a)\)이다 — \(a\)는 최소점이 아니다. 마찬가지로 \(g'(b) > 0\)이라 작은 \(h > 0\)에 대해 \(g(b-h) < g(b)\)이다 — \(b\)도 최소점이 아니다. 따라서 \(x_0 \in (a,b)\)이다.`,
          en: String.raw`The point \(x_0\) is interior: since \(g'(a) < 0\), \(\frac{g(a+h)-g(a)}{h} \to g'(a) < 0\), so \(g(a+h) < g(a)\) for small \(h > 0\) — \(a\) is not the minimizer. Likewise \(g'(b) > 0\) gives \(g(b-h) < g(b)\) for small \(h > 0\) — \(b\) is not the minimizer either. Hence \(x_0 \in (a,b)\).`,
        },
      },
      {
        text: {
          ko: String.raw`페르마 보조정리를 내부 최소점 \(x_0\)에 적용하면 \(g'(x_0) = 0\)이고, 따라서 \(f'(x_0) = c\)이다. \(c\)는 \(f'(a)\)와 \(f'(b)\) 사이의 임의의 값이었으므로 \(f'\)은 중간값 성질을 갖는다 — 불연속일 수도 있는데도 말이다.`,
          en: String.raw`Applying Fermat's lemma at the interior minimizer \(x_0\) gives \(g'(x_0) = 0\), hence \(f'(x_0) = c\). Since \(c\) was arbitrary between \(f'(a)\) and \(f'(b)\), \(f'\) has the intermediate value property — even though it may be discontinuous.`,
        },
      },
    ],
  },
  {
    id: 'darboux-discontinuous-derivative',
    statement: {
      ko: String.raw`\(f(x) = x^2\sin(1/x)\) (\(x \neq 0\)), \(f(0) = 0\)이 모든 점에서 미분가능하지만, 도함수 \(f'\)은 \(0\)에서 불연속임을 증명하세요. (\(f'(0)\)은 정의로, \(x \neq 0\)에서의 \(f'(x)\)는 곱·합성 미분법으로 구하세요.)`,
      en: String.raw`Prove that \(f(x) = x^2\sin(1/x)\) (\(x \neq 0\)), \(f(0) = 0\) is differentiable everywhere, but its derivative \(f'\) is discontinuous at \(0\). (Get \(f'(0)\) from the definition and \(f'(x)\) for \(x \neq 0\) by the product and chain rules.)`,
    },
    display: [
      String.raw`f'(0) = \lim_{h \to 0} \frac{f(h)-f(0)}{h} = \lim_{h \to 0} h\sin(1/h) = 0`,
      String.raw`f'(x) = 2x\sin(1/x) - \cos(1/x) \quad (x \neq 0)`,
      String.raw`a_k = \frac{1}{2k\pi}:\ f'(a_k) = -1, \qquad b_k = \frac{1}{(2k+1)\pi}:\ f'(b_k) = 1 \quad (a_k, b_k \to 0)`,
    ],
    preset: { zoom: 100, level: 0, showF: true },
    presetCaption: {
      ko: String.raw`줌 100 (창 \([\pm 0.0005]\)), \(y = 0\): 원점을 아무리 확대해도 \(-\cos(1/x)\) 진동은 가라앉지 않는다 — 이 창에서 \(f'\)과 수평선의 교차가 1579번 (그리드 기준).`,
      en: String.raw`Zoom 100 (window \([\pm 0.0005]\)), \(y = 0\): no amount of zooming calms the \(-\cos(1/x)\) oscillation — 1579 crossings of \(f'\) with the level in this window (at grid resolution).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f'(0)\)을 정의로 구한다: \(\frac{f(h)-f(0)}{h} = \frac{h^2\sin(1/h)}{h} = h\sin(1/h)\)이고 \(|h\sin(1/h)| \leq |h|\)이므로 조임 정리로 극한은 \(0\)이다. 수치로도 확인된다: \(h = 0.01\)에서 \(\approx -0.00506\), \(h = 10^{-6}\)에서 \(\approx -3.5 \times 10^{-7}\)이다. 따라서 \(f'(0) = 0\)이다.`,
          en: String.raw`Get \(f'(0)\) from the definition: \(\frac{f(h)-f(0)}{h} = \frac{h^2\sin(1/h)}{h} = h\sin(1/h)\), and \(|h\sin(1/h)| \leq |h|\), so the squeeze theorem gives the limit \(0\). The numbers agree: \(\approx -0.00506\) at \(h = 0.01\) and \(\approx -3.5 \times 10^{-7}\) at \(h = 10^{-6}\). Hence \(f'(0) = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x \neq 0\)에서는 곱의 법칙과 합성함수 미분법으로 \(f'(x) = 2x\sin(1/x) + x^2\cos(1/x)\cdot(-1/x^2) = 2x\sin(1/x) - \cos(1/x)\)이다. 따라서 \(f\)는 \(0\)을 포함한 모든 점에서 미분가능하다.`,
          en: String.raw`For \(x \neq 0\), the product and chain rules give \(f'(x) = 2x\sin(1/x) + x^2\cos(1/x)\cdot(-1/x^2) = 2x\sin(1/x) - \cos(1/x)\). So \(f\) is differentiable at every point, including \(0\).`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(\lim_{x \to 0} f'(x)\)는 존재하지 않는다. \(a_k = \frac{1}{2k\pi} \to 0\)에서는 \(\sin(1/a_k) = 0\), \(\cos(1/a_k) = 1\)이므로 \(f'(a_k) = -1\)이고, \(b_k = \frac{1}{(2k+1)\pi} \to 0\)에서는 \(\sin(1/b_k) = 0\), \(\cos(1/b_k) = -1\)이므로 \(f'(b_k) = 1\)이다 (예: \(k = 5, 10, 20\)에서 정확히 \(-1.000000\)과 \(1.000000\)). 극한이 존재한다면 \(-1\)과 \(1\)을 동시에 가져야 하므로 모순이다.`,
          en: String.raw`But \(\lim_{x \to 0} f'(x)\) does not exist. On \(a_k = \frac{1}{2k\pi} \to 0\) we have \(\sin(1/a_k) = 0\) and \(\cos(1/a_k) = 1\), so \(f'(a_k) = -1\); on \(b_k = \frac{1}{(2k+1)\pi} \to 0\) we have \(\sin(1/b_k) = 0\) and \(\cos(1/b_k) = -1\), so \(f'(b_k) = 1\) (e.g. exactly \(-1.000000\) and \(1.000000\) for \(k = 5, 10, 20\)). If the limit existed it would have to be both \(-1\) and \(1\) — a contradiction.`,
        },
      },
      {
        text: {
          ko: String.raw`\(f'(0) = 0\)인데 \(\lim_{x \to 0} f'(x)\)가 존재하지 않으므로 \(f'\)은 \(0\)에서 불연속이다 — 미분가능한 함수의 도함수가 반드시 연속인 것은 아니다. 그런데도 문제 1의 다르부 정리에 의해 이 불연속인 \(f'\)은 여전히 중간값 성질을 갖는다.`,
          en: String.raw`Since \(f'(0) = 0\) but \(\lim_{x \to 0} f'(x)\) does not exist, \(f'\) is discontinuous at \(0\) — the derivative of a differentiable function need not be continuous. Yet by Darboux's theorem (problem 1), this discontinuous \(f'\) still has the intermediate value property.`,
        },
      },
    ],
  },
  {
    id: 'darboux-no-heaviside-derivative',
    statement: {
      ko: String.raw`다르부 정리의 따름정리로 증명하세요: 어떤 함수도 헤비사이드 계단함수 \(H\) (\(x < 0\)에서 \(0\), \(x \geq 0\)에서 \(1\))를 도함수로 가질 수 없습니다.`,
      en: String.raw`Prove as a corollary of Darboux's theorem: no function can have the Heaviside step function \(H\) (\(0\) for \(x < 0\), \(1\) for \(x \geq 0\)) as its derivative.`,
    },
    display: [
      String.raw`F' = H,\quad F'(-1) = 0 < \tfrac12 < 1 = F'(1)\ \xrightarrow{\text{Darboux}}\ \exists\, \xi \in (-1,1):\ F'(\xi) = \tfrac12 \notin \{0,1\}\ \Rightarrow\Leftarrow`,
    ],
    preset: { zoom: 0, level: 0.5, showF: true },
    presetCaption: {
      ko: String.raw`줌 0 (창 \([\pm 0.5]\)), \(y = 0.5\): 격렬히 진동하는 \(f'\)도 이 높이를 46번 지난다 (그리드 기준) — 도함수의 불연속은 점프가 아니라 진동뿐이다.`,
      en: String.raw`Zoom 0 (window \([\pm 0.5]\)), \(y = 0.5\): even the wildly oscillating \(f'\) passes this level 46 times (at grid resolution) — a derivative's discontinuity can only be oscillation, never a jump.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(H\)를 도함수로 갖는 함수 \(F\)가 \(\mathbb{R}\) 전체에서 미분가능하게 존재한다고 가정하자. \(a = -1\), \(b = 1\)을 잡으면 \(F'(-1) = H(-1) = 0\)이고 \(F'(1) = H(1) = 1\)이다. \(0 < \frac{1}{2} < 1\)이므로 다르부 정리(문제 1)에 의해 어떤 \(\xi \in (-1,1)\)에 대해 \(F'(\xi) = \frac{1}{2}\)이다.`,
          en: String.raw`Suppose some \(F\), differentiable on all of \(\mathbb{R}\), had \(H\) as its derivative. Take \(a = -1\), \(b = 1\): then \(F'(-1) = H(-1) = 0\) and \(F'(1) = H(1) = 1\). Since \(0 < \frac{1}{2} < 1\), Darboux's theorem (problem 1) gives some \(\xi \in (-1,1)\) with \(F'(\xi) = \frac{1}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(H\)는 값 \(0\)과 \(1\)만을 취하므로 \(F'(\xi) = H(\xi) = \frac{1}{2}\)일 수 없다 — 모순이다. 따라서 \(H\)를 도함수로 갖는 함수는 존재하지 않는다.`,
          en: String.raw`But \(H\) takes only the values \(0\) and \(1\), so \(F'(\xi) = H(\xi) = \frac{1}{2}\) is impossible — a contradiction. Hence no function has \(H\) as its derivative.`,
        },
      },
      {
        text: {
          ko: String.raw`일반적으로: 도함수는 점프 불연속을 가질 수 없다. 좌극한과 우극한이 존재하면서 서로 다른 불연속점에서는 그 사이의 값을 도함수가 취해야 하는데(다르부), 계단함수는 그 값을 취하지 않기 때문이다. 도함수의 불연속은 문제 2의 \(-\cos(1/x)\)처럼 essential discontinuity뿐이다.`,
          en: String.raw`In general: a derivative cannot have a jump discontinuity. At a point where the one-sided limits exist but differ, Darboux forces the derivative to take the values strictly between them — which a step function never does. A derivative's discontinuities can only be essential oscillation, like the \(-\cos(1/x)\) of problem 2.`,
        },
      },
    ],
  },
];
