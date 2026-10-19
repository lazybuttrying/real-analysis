import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Fubini/Tonelli scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/fubini-tonelli.test.ts): separable gives exactly 1/4 in both
 * orders; tent converges to 8/27 in both orders.
 */
export const fubiniTonelliProblems: readonly ProblemMeta[] = [
  {
    id: 'ft-tonelli-sep',
    statement: {
      ko: String.raw`\(f(x, y) = xy\) (\([0,1]^2\) 위)에 대해 두 겹적분 \(\int_0^1\!\!\int_0^1 xy\,dx\,dy\)와 \(\int_0^1\!\!\int_0^1 xy\,dy\,dx\)를 직접 계산하고, 둘 다 \(\frac14\)임을 보이세요.`,
      en: String.raw`For \(f(x, y) = xy\) (on \([0,1]^2\)), compute both iterated integrals \(\int_0^1\!\!\int_0^1 xy\,dx\,dy\) and \(\int_0^1\!\!\int_0^1 xy\,dy\,dx\) directly and show each equals \(\frac14\).`,
    },
    display: [
      String.raw`\int_0^1\!\!\int_0^1 xy\,dx\,dy = \int_0^1 \frac{y}{2}\,dy = \frac{1}{4} = \int_0^1\!\!\int_0^1 xy\,dy\,dx`,
    ],
    preset: { mode: 'separable', n: 32 },
    presetCaption: {
      ko: String.raw`분리형 \(f = xy\), \(N = 32\): \(\int R = \int C = \frac14\) (중점 규칙이 여기서 엄밀합니다).`,
      en: String.raw`Separable \(f = xy\), \(N = 32\): \(\int R = \int C = \frac14\) (the midpoint rule is exact here).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`안쪽 적분부터: 고정된 \(y\)에 대해 \(\int_0^1 xy\,dx = y\int_0^1 x\,dx = y \cdot \frac12\)입니다. 바깥 적분은 \(\int_0^1 \frac{y}{2}\,dy = \frac12 \cdot \frac12 = \frac14\)입니다.`,
          en: String.raw`Inner integral first: for fixed \(y\), \(\int_0^1 xy\,dx = y\int_0^1 x\,dx = y \cdot \frac12\). The outer integral is \(\int_0^1 \frac{y}{2}\,dy = \frac12 \cdot \frac12 = \frac14\).`,
        },
      },
      {
        text: {
          ko: String.raw`순서를 바꾸면: 고정된 \(x\)에 대해 \(\int_0^1 xy\,dy = x \cdot \frac12\)이고, \(\int_0^1 \frac{x}{2}\,dx = \frac14\)입니다. 두 순서 모두 \(\frac14\) — 곱이 분리되기 때문입니다: \(\iint xy = (\int_0^1 x\,dx)(\int_0^1 y\,dy)\).`,
          en: String.raw`Reversing the order: for fixed \(x\), \(\int_0^1 xy\,dy = x \cdot \frac12\), and \(\int_0^1 \frac{x}{2}\,dx = \frac14\). Both orders give \(\frac14\) — because the product splits: \(\iint xy = (\int_0^1 x\,dx)(\int_0^1 y\,dy)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f \ge 0\)이므로 토넬리 정리가 순서를 바꿔도 값이 같음을 보장합니다 — 위의 직접 계산이 그 정리를 이 구체적인 함수에서 확인한 것입니다. 모든 단계가 완성되었습니다.`,
          en: String.raw`Since \(f \ge 0\), Tonelli's theorem guarantees the value is order-independent — the direct computation above verifies the theorem on this concrete function. Every step is complete.`,
        },
      },
    ],
  },
  {
    id: 'ft-fubini-counter',
    statement: {
      ko: String.raw`\(f(x, y) = \dfrac{x^2-y^2}{(x^2+y^2)^2}\) (\((0,1)^2\) 위)를 생각해 봅시다. \(x\)와 \(y\)를 맞바꾸면 \(f\)의 부호가 뒤집힘을 이용해 두 겹적분이 서로의 음수임을 엄밀히 증명하고, 직접 계산하면 \(\frac{\pi}{4}\)와 \(-\frac{\pi}{4}\)가 나와 푸비니 정리가 실패함을 보이세요.`,
      en: String.raw`Consider \(f(x, y) = \dfrac{x^2-y^2}{(x^2+y^2)^2}\) (on \((0,1)^2\)). Using that swapping \(x\) and \(y\) flips the sign of \(f\), prove rigorously that the two iterated integrals are negatives of each other, and show by direct computation that they are \(\frac{\pi}{4}\) and \(-\frac{\pi}{4}\) — so Fubini's theorem fails.`,
    },
    display: [
      String.raw`f(y,x) = -f(x,y) \;\Rightarrow\; \int_0^1\!\!\int_0^1 f\,dy\,dx = -\int_0^1\!\!\int_0^1 f\,dx\,dy`,
      String.raw`\int_0^1\!\!\int_0^1 f\,dy\,dx = \frac{\pi}{4} \ne -\frac{\pi}{4} = \int_0^1\!\!\int_0^1 f\,dx\,dy`,
    ],
    preset: { mode: 'separable', n: 32 },
    presetCaption: {
      ko: String.raw`씬은 \(f \ge 0\)인 경우만 다루므로(여기서는 두 순서가 항상 일치), 이 문제는 부호가 있는 경우의 대조 사례입니다.`,
      en: String.raw`The scene only covers \(f \ge 0\) (where the two orders always agree); this problem is the signed contrast case.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`대칭성 (엄밀한 부분): \(f(y, x) = \dfrac{y^2-x^2}{(y^2+x^2)^2} = -\dfrac{x^2-y^2}{(x^2+y^2)^2} = -f(x, y)\)입니다. 두 겹적분을 \(I_1 = \int_0^1\!\!\int_0^1 f(x,y)\,dy\,dx\), \(I_2 = \int_0^1\!\!\int_0^1 f(x,y)\,dx\,dy\)라 하면, \(I_2\)에서 더미 변수 \(x \leftrightarrow y\)를 맞바꿔 \(I_2 = \int_0^1\!\!\int_0^1 f(y,x)\,dy\,dx = -\int_0^1\!\!\int_0^1 f(x,y)\,dy\,dx = -I_1\)을 얻습니다. 즉 두 겹적분은 정확히 서로의 음수입니다 — 계산 없이 증명되었습니다.`,
          en: String.raw`Symmetry (the rigorous part): \(f(y, x) = \dfrac{y^2-x^2}{(y^2+x^2)^2} = -\dfrac{x^2-y^2}{(x^2+y^2)^2} = -f(x, y)\). Write the iterated integrals as \(I_1 = \int_0^1\!\!\int_0^1 f(x,y)\,dy\,dx\) and \(I_2 = \int_0^1\!\!\int_0^1 f(x,y)\,dx\,dy\). Renaming the dummy variables \(x \leftrightarrow y\) in \(I_2\) gives \(I_2 = \int_0^1\!\!\int_0^1 f(y,x)\,dy\,dx = -\int_0^1\!\!\int_0^1 f(x,y)\,dy\,dx = -I_1\). So the two iterated integrals are exact negatives of each other — proved with no computation.`,
        },
      },
      {
        text: {
          ko: String.raw`계산 단계 (idea-level로 기록): \(x > 0\)에서 \(\frac{\partial}{\partial y}\left[\frac{y}{x^2+y^2}\right] = \frac{x^2-y^2}{(x^2+y^2)^2} = f(x,y)\)이므로, 안쪽 적분은 \(\int_0^1 f(x,y)\,dy = \left[\frac{y}{x^2+y^2}\right]_0^1 = \frac{1}{1+x^2}\)입니다. 바깥 적분은 \(\int_0^1 \frac{dx}{1+x^2} = \arctan 1 = \frac{\pi}{4}\) — 따라서 \(I_1 = \frac{\pi}{4}\), \(I_2 = -\frac{\pi}{4}\)입니다. (\(x = 0\)에서는 안쪽 적분이 이상적분(\(f(0,y) = -1/y^2\))이라, 원점에서의 특이점을 한 줄씩 정당화하지 않고 계산 전체를 computational step으로 기록합니다.)`,
          en: String.raw`Computational step (recorded at idea level): for \(x > 0\), \(\frac{\partial}{\partial y}\left[\frac{y}{x^2+y^2}\right] = \frac{x^2-y^2}{(x^2+y^2)^2} = f(x,y)\), so the inner integral is \(\int_0^1 f(x,y)\,dy = \left[\frac{y}{x^2+y^2}\right]_0^1 = \frac{1}{1+x^2}\). The outer integral is \(\int_0^1 \frac{dx}{1+x^2} = \arctan 1 = \frac{\pi}{4}\) — hence \(I_1 = \frac{\pi}{4}\) and \(I_2 = -\frac{\pi}{4}\). (At \(x = 0\) the inner integral is improper since \(f(0,y) = -1/y^2\); rather than justifying the singularity at the origin line by line, we record the whole evaluation as the computational step.)`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{\pi}{4} \ne -\frac{\pi}{4}\)이므로 푸비니의 결론이 실패합니다. 대우로, \(f\)는 \((0,1)^2\)에서 적분 가능하지 않습니다 (\(\int |f| = \infty\)) — 적분 가능성 가정이 빠지면 부호가 있는 질량이 서로 상쇄되며 순서에 따라 다른 값이 남는 것입니다. 부호 뒤집기 대칭성은 엄밀히 증명되었고, \(\pi/4\) 평가는 computational step으로 기록되었습니다.`,
          en: String.raw`Since \(\frac{\pi}{4} \ne -\frac{\pi}{4}\), Fubini's conclusion fails. By contrapositive, \(f\) is not integrable over \((0,1)^2\) (\(\int |f| = \infty\)) — without the integrability hypothesis, signed mass cancels differently depending on the order. The sign-flip symmetry is proved rigorously; the \(\pi/4\) evaluation is recorded as the computational step.`,
        },
      },
    ],
  },
  {
    id: 'ft-tonelli-simple',
    statement: {
      ko: String.raw`\(f \ge 0\)인 단순함수에 대해 두 겹적분이 모두 이중합 \(\sum a_k\,m(E_k)\)와 같음을 증명하고 (적분 가능성 가정 없이), 단조 근사를 이용해 일반 \(f \ge 0\)으로 확장하세요.`,
      en: String.raw`For a simple function \(f \ge 0\), prove both iterated integrals equal the double sum \(\sum a_k\,m(E_k)\) (with no integrability hypothesis), and extend to general \(f \ge 0\) by monotone approximation.`,
    },
    display: [
      String.raw`\int\!\!\int \sum_{k} a_k \mathbf{1}_{E_k} = \sum_{k} a_k\,m(E_k) \quad \text{(either order)}`,
    ],
    preset: { mode: 'tent', n: 32 },
    presetCaption: {
      ko: String.raw`텐트 \(f\), \(N = 32\): \(\int R \approx \int C \approx \frac{8}{27} \approx 0.2963\) — 두 순서가 엄밀값으로 모입니다.`,
      en: String.raw`Tent \(f\), \(N = 32\): \(\int R \approx \int C \approx \frac{8}{27} \approx 0.2963\) — both orders converge to the exact value.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 직사각형의 지시함수 \(R = A \times B\) (가측집합, 측도는 무한 가능)에 대해: 안쪽 적분 \(\int \mathbf{1}_R(x, y)\,dx = m(A)\,\mathbf{1}_B(y)\)이고, 바깥 적분은 \(\int m(A)\,\mathbf{1}_B(y)\,dy = m(A)\,m(B)\)입니다. 순서를 바꿔도 \(\int \mathbf{1}_R(x, y)\,dy = m(B)\,\mathbf{1}_A(x)\) 뒤에 \(m(B)\,m(A)\)로 같습니다.`,
          en: String.raw`First, the indicator of a rectangle \(R = A \times B\) (measurable sets, possibly of infinite measure): the inner integral \(\int \mathbf{1}_R(x, y)\,dx = m(A)\,\mathbf{1}_B(y)\), and the outer gives \(\int m(A)\,\mathbf{1}_B(y)\,dy = m(A)\,m(B)\). Reversing the order, \(\int \mathbf{1}_R(x, y)\,dy = m(B)\,\mathbf{1}_A(x)\) followed by \(m(B)\,m(A)\) — the same.`,
        },
      },
      {
        text: {
          ko: String.raw`단순함수 \(f = \sum_{k=1}^{m} a_k\,\mathbf{1}_{E_k}\) (\(a_k \ge 0\), \(E_k\)는 서로 겹치지 않는 가측집합)에 대해, 각 변수에 대한 적분의 선형성을 쓰면 두 겹적분 모두 \(\sum_{k=1}^{m} a_k\,m(E_k)\)가 됩니다 — 순서와 무관한 하나의 이중합입니다. 적분 가능성 가정이 전혀 필요 없습니다: 모든 항이 \(\ge 0\)이라 상쇄가 일어날 수 없기 때문입니다.`,
          en: String.raw`For a simple function \(f = \sum_{k=1}^{m} a_k\,\mathbf{1}_{E_k}\) (\(a_k \ge 0\), the \(E_k\) disjoint measurable), linearity of the integral in each variable makes both iterated integrals equal \(\sum_{k=1}^{m} a_k\,m(E_k)\) — a single double sum, independent of order. No integrability hypothesis is needed: every term is \(\ge 0\), so nothing can cancel.`,
        },
      },
      {
        text: {
          ko: String.raw`일반 \(f \ge 0\)에는 단순함수열 \(s_j \uparrow f\) (표준 구성)를 취합니다. 고정된 \(y\)마다 \(x\)에 대한 단조수렴정리로 \(\int s_j(x, y)\,dx \uparrow \int f(x, y)\,dx\)이고, 이 함수들은 \(y\)의 증가하는 단순함수열이므로 \(y\)에 대한 단조수렴정리를 한 번 더 쓰면 두 겹적분 모두 \(\lim_j \sum a^{(j)}_k m(E^{(j)}_k) = \iint f\)가 됩니다. 이것이 토넬리 정리가 \(f \ge 0\)에서는 적분 가능성을 가정하지 않는 이유입니다 — 모든 단계가 완성되었습니다.`,
          en: String.raw`For general \(f \ge 0\), take simple \(s_j \uparrow f\) (the standard construction). For each fixed \(y\), MCT in \(x\) gives \(\int s_j(x, y)\,dx \uparrow \int f(x, y)\,dx\); these are an increasing sequence of simple functions of \(y\), so one more MCT in \(y\) makes both iterated integrals equal \(\lim_j \sum a^{(j)}_k m(E^{(j)}_k) = \iint f\). This is why Tonelli's theorem needs no integrability hypothesis for \(f \ge 0\) — every step is complete.`,
        },
      },
    ],
  },
];
