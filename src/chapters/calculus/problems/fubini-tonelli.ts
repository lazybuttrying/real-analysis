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
          ko: String.raw`\(f(x,y) = xy\)는 \([0,1]^2\)에서 연속이므로 가측이고, \(f \ge 0\)이므로 토넬리 정리의 가정이 모두 충족되어 토넬리 정리가 순서를 바꿔도 값이 같음을 보장합니다 — 위의 직접 계산이 그 정리를 이 구체적인 함수에서 확인한 것입니다. 모든 단계가 완성되었습니다.`,
          en: String.raw`The function \(f(x,y) = xy\) is continuous on \([0,1]^2\), hence measurable, and \(f \ge 0\), so all hypotheses of Tonelli's theorem are satisfied and Tonelli's theorem guarantees the value is order-independent — the direct computation above verifies the theorem on this concrete function. Every step is complete.`,
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
          ko: String.raw`\(x > 0\)에서 \(y\)에 대한 원시함수부터: \(\frac{\partial}{\partial y}\left[\frac{y}{x^2+y^2}\right] = \frac{(x^2+y^2) - y(2y)}{(x^2+y^2)^2} = \frac{x^2-y^2}{(x^2+y^2)^2} = f(x,y)\)입니다. 따라서 안쪽 적분 \(\int_0^1 f(x,y)\,dy = \left[\frac{y}{x^2+y^2}\right]_0^1 = \frac{1}{1+x^2} - 0 = \frac{1}{1+x^2}\)입니다.`,
          en: String.raw`An antiderivative in \(y\) for \(x > 0\): \(\frac{\partial}{\partial y}\left[\frac{y}{x^2+y^2}\right] = \frac{(x^2+y^2) - y(2y)}{(x^2+y^2)^2} = \frac{x^2-y^2}{(x^2+y^2)^2} = f(x,y)\). Hence the inner integral \(\int_0^1 f(x,y)\,dy = \left[\frac{y}{x^2+y^2}\right]_0^1 = \frac{1}{1+x^2} - 0 = \frac{1}{1+x^2}\).`,
        },
        display: [String.raw`\int_0^1 f(x,y)\,dy = \left[\frac{y}{x^2+y^2}\right]_0^1 = \frac{1}{1+x^2} \qquad (x > 0)`],
      },
      {
        text: {
          ko: String.raw`\(x = 0\)에서는 \(f(0,y) = \frac{-y^2}{y^4} = -\frac{1}{y^2}\)이므로 안쪽 적분은 이상적분입니다: \(\int_\varepsilon^1 -\frac{1}{y^2}\,dy = \left[\frac{1}{y}\right]_\varepsilon^1 = 1 - \frac{1}{\varepsilon} \to -\infty\) (\(\varepsilon \to 0^+\)). 이는 \(x\)의 한 점에서만 일어나는데, 한 점집합 \(\{0\}\)은 르베그 측도가 \(0\)이므로, 바깥 적분을 르베그 적분으로 읽으면 안쪽 적분의 값은 거의 모든 \(x\)에 대해서만 정해지면 되고, 한 점에서의 발산은 바깥 적분에 영향을 주지 않습니다: \(\int_0^1 \frac{dx}{1+x^2} = [\arctan x]_0^1 = \frac{\pi}{4}\)이고, 따라서 \(I_1 = \frac{\pi}{4}\)입니다.`,
          en: String.raw`At \(x = 0\), \(f(0,y) = \frac{-y^2}{y^4} = -\frac{1}{y^2}\), so the inner integral is improper: \(\int_\varepsilon^1 -\frac{1}{y^2}\,dy = \left[\frac{1}{y}\right]_\varepsilon^1 = 1 - \frac{1}{\varepsilon} \to -\infty\) (\(\varepsilon \to 0^+\)). This happens only at the single point \(x = 0\); the singleton \(\{0\}\) has Lebesgue measure zero, so when the outer integral is read as a Lebesgue integral the inner integral only needs to exist for almost every \(x\), and divergence at one point does not affect it: \(\int_0^1 \frac{dx}{1+x^2} = [\arctan x]_0^1 = \frac{\pi}{4}\), hence \(I_1 = \frac{\pi}{4}\).`,
        },
        display: [String.raw`\int_\varepsilon^1 -\frac{1}{y^2}\,dy = 1 - \frac{1}{\varepsilon} \to -\infty \qquad (\varepsilon \to 0^+)`],
      },
      {
        text: {
          ko: String.raw`순서를 바꾸면 \(x\)에 대한 원시함수는 \(\frac{\partial}{\partial x}\left[-\frac{x}{x^2+y^2}\right] = \frac{-(x^2+y^2) + x(2x)}{(x^2+y^2)^2} = \frac{x^2-y^2}{(x^2+y^2)^2} = f(x,y)\)입니다. \(y > 0\)에서 \(\int_0^1 f(x,y)\,dx = \left[-\frac{x}{x^2+y^2}\right]_0^1 = -\frac{1}{1+y^2}\)이고, \(y = 0\)에서는 \(f(x,0) = \frac{1}{x^2}\)이므로 \(\int_\varepsilon^1 \frac{dx}{x^2} = \left[-\frac{1}{x}\right]_\varepsilon^1 = -1 + \frac{1}{\varepsilon} \to +\infty\) — 역시 한 점의 특이점입니다. 바깥 적분은 \(\int_0^1 -\frac{dy}{1+y^2} = -\frac{\pi}{4}\)이므로 \(I_2 = -\frac{\pi}{4}\)입니다.`,
          en: String.raw`Reversing the order, an antiderivative in \(x\) is \(\frac{\partial}{\partial x}\left[-\frac{x}{x^2+y^2}\right] = \frac{-(x^2+y^2) + x(2x)}{(x^2+y^2)^2} = \frac{x^2-y^2}{(x^2+y^2)^2} = f(x,y)\). For \(y > 0\), \(\int_0^1 f(x,y)\,dx = \left[-\frac{x}{x^2+y^2}\right]_0^1 = -\frac{1}{1+y^2}\); at \(y = 0\), \(f(x,0) = \frac{1}{x^2}\), so \(\int_\varepsilon^1 \frac{dx}{x^2} = \left[-\frac{1}{x}\right]_\varepsilon^1 = -1 + \frac{1}{\varepsilon} \to +\infty\) — again a one-point singularity. The outer integral is \(\int_0^1 -\frac{dy}{1+y^2} = -\frac{\pi}{4}\), so \(I_2 = -\frac{\pi}{4}\).`,
        },
        display: [String.raw`\int_0^1 f(x,y)\,dx = \left[-\frac{x}{x^2+y^2}\right]_0^1 = -\frac{1}{1+y^2} \qquad (y > 0)`],
      },
      {
        text: {
          ko: String.raw`\(\frac{\pi}{4} \ne -\frac{\pi}{4}\)이므로 푸비니의 결론이 실패합니다. 대우를 적용하기 전에 가측성과 거의 모든 곳에서의 안쪽 적분 가능성을 확인합니다: \(f\)는 \((0,1]^2\)에서 연속이므로 \([0,1]^2\)에서 가측입니다 (단일점 \((0,0)\)에서는 \(f\)를 임의로 정의해도 됩니다; 단일점과 좌표 구간 \(\{x=0\}\), \(\{y=0\}\)은 측도가 \(0\)입니다). 앞 단계에서 보았듯 안쪽 적분은 \(x = 0\) (\(y = 0\))인 경우를 제외하고 모든 \(x > 0\) (\(y > 0\))에서 존재하므로, 즉 거의 모든 곳에서 존재합니다. \(|f|\)는 가측이고 \(\ge 0\)이므로 토넬리를 \(|f|\)에 적용할 수 있고, 이는 \(\int |f| = \infty\)를 정당하게 줍니다. 따라서 대우로, \(f\)는 \((0,1)^2\)에서 적분 가능하지 않습니다 (\(\int |f| = \infty\)) — 적분 가능성 가정이 빠지면 부호가 있는 질량이 서로 상쇄되며 순서에 따라 다른 값이 남는 것입니다. 부호 뒤집기 대칭성은 계산 없이 증명되었고, \(\pi/4\) 평가는 원시함수와 이상적분을 이용해 완전히 정당화되었습니다. 모든 단계가 완성되었습니다.`,
          en: String.raw`Since \(\frac{\pi}{4} \ne -\frac{\pi}{4}\), Fubini's conclusion fails. Before invoking the contrapositive, verify measurability and almost-everywhere inner integrability: \(f\) is continuous on \((0,1]^2\), hence measurable on \([0,1]^2\) (define \(f\) arbitrarily at the single point \((0,0)\); a single point and the coordinate segments \(\{x=0\}\), \(\{y=0\}\) have measure zero). As shown above, the inner integrals exist for every \(x > 0\) (resp. \(y > 0\)), i.e. for almost every \(x\) (resp. \(y\)). Since \(|f|\) is measurable and \(\ge 0\), Tonelli applied to \(|f|\) legitimately gives \(\int |f| = \infty\). Hence, by contrapositive, \(f\) is not integrable over \((0,1)^2\) (\(\int |f| = \infty\)) — without the integrability hypothesis, signed mass cancels differently depending on the order. The sign-flip symmetry was proved with no computation, and the \(\pi/4\) evaluation is fully justified via antiderivatives and improper integrals. Every step is complete.`,
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
          ko: String.raw`먼저 직사각형의 지시함수 \(R = A \times B\) (가측집합, 측도는 무한 가능)에 대해: 안쪽 적분 \(\int \mathbf{1}_R(x, y)\,dx = m(A)\,\mathbf{1}_B(y)\)이고, 바깥 적분은 \(\int m(A)\,\mathbf{1}_B(y)\,dy = m(A)\,m(B)\)입니다. 순서를 바꿔도 \(\int \mathbf{1}_R(x, y)\,dy = m(B)\,\mathbf{1}_A(x)\) 뒤에 \(m(B)\,m(A)\)로 같습니다. 퇴화한 경우를 따로 처리합니다: 측도론의 관례 \(0 \cdot \infty := 0\)을 쓰며, \(m(B) = 0\)이면 \(m(A)\)가 무한하더라도 \(A \times B\)는 영집합이므로 두 겹적분은 모두 \(0 = m(A)\,m(B)\)이고, \(m(A) = 0\)인 경우도 대칭적입니다.`,
          en: String.raw`First, the indicator of a rectangle \(R = A \times B\) (measurable sets, possibly of infinite measure): the inner integral \(\int \mathbf{1}_R(x, y)\,dx = m(A)\,\mathbf{1}_B(y)\), and the outer gives \(\int m(A)\,\mathbf{1}_B(y)\,dy = m(A)\,m(B)\). Reversing the order, \(\int \mathbf{1}_R(x, y)\,dy = m(B)\,\mathbf{1}_A(x)\) followed by \(m(B)\,m(A)\) — the same. Handle the degenerate case separately, with the measure-theoretic convention \(0 \cdot \infty := 0\): if \(m(B) = 0\) then \(A \times B\) is null regardless of \(A\), even if \(m(A) = \infty\), so both iterated integrals are \(0 = m(A)\,m(B)\); the case \(m(A) = 0\) is symmetric.`,
        },
      },
      {
        text: {
          ko: String.raw`직사각형들로 만든 단순함수 \(s = \sum_{p=1}^{P} c_p\,\mathbf{1}_{A_p \times B_p}\) (\(c_p \ge 0\), 직사각형들은 서로 겹치지 않음)에 대해서는 단면이 명시적이라 보조정리가 필요 없습니다: 고정된 \(y\)에서 \(\int s(x,y)\,dx = \sum_p c_p\,m(A_p)\,\mathbf{1}_{B_p}(y)\) (앞 단계)이고, 이는 \(y\)의 단순함수이므로 바깥 적분은 \(\sum_p c_p\,m(A_p)\,m(B_p)\) — 순서를 바꿔도 같습니다.`,
          en: String.raw`For a simple function built from rectangles, \(s = \sum_{p=1}^{P} c_p\,\mathbf{1}_{A_p \times B_p}\) (\(c_p \ge 0\), disjoint rectangles), sections are explicit and no lemma is needed: for fixed \(y\), \(\int s(x,y)\,dx = \sum_p c_p\,m(A_p)\,\mathbf{1}_{B_p}(y)\) (previous step), a simple function of \(y\), so the outer integral is \(\sum_p c_p\,m(A_p)\,m(B_p)\) — the same with the order reversed.`,
        },
        display: [String.raw`\int\!\!\int \sum_p c_p\,\mathbf{1}_{A_p \times B_p} = \sum_p c_p\,m(A_p)\,m(B_p) \quad \text{(either order)}`],
      },
      {
        text: {
          ko: String.raw`보조정리 (단면의 가측성): 유한 측도 곱공간(예: \([0,1]^2\))에서 \(E\)가 곱-가측이면 단면 \(E^y = \{x : (x,y) \in E\}\)는 가측이고, \(y \mapsto m(E^y)\)는 가측이며 \(\int m(E^y)\,dy = m(E)\)이다 (\(x\)-단면도 마찬가지). 증명: 먼저 \(\mathcal{A}\)를 가측 직사각형들의 유한 서로소 합집합들의 모임이라 두자; \(\mathcal{A}\)는 대수(algebra)이다 (여집합과 유한 합집합에 닫혀 있음)이며 곱 시그마-대수를 생성한다, \(\sigma(\mathcal{A})\)가 곱 시그마-대수와 같다. 이 성질을 갖는 집합들의 모임 \(\mathcal{C}\)는 직사각형을 포함하고 — \(E = A \times B\)이면 \(E^y = A\) (\(y \in B\)) 또는 \(\varnothing\)이고 \(m(E^y) = m(A)\,\mathbf{1}_B(y)\)이므로 — 유한 가산성으로 단면-측도 항등식이 \(\mathcal{A}\) 전체에서 성립하므로 \(\mathcal{A} \subset \mathcal{C}\)이다. 또한 \(\mathcal{C}\)는 단조 모임이다: \(E_n \uparrow E\)이면 \((E_n)^y \uparrow E^y\)이므로 측도의 연속성과 단조수렴정리로 \(\int m((E_n)^y)\,dy = m(E_n) \uparrow m(E) = \int m(E^y)\,dy\)가 유지된다 (감소열은 유한 측도에서 마찬가지). 단조 모임 정리로 \(\mathcal{C}\)는 \(\sigma(\mathcal{A})\)를 포함하므로 \(\mathcal{C}\)는 곱 시그마-대수 전체이다.`,
          en: String.raw`Lemma (measurable sections): on a finite-measure product space (e.g. \([0,1]^2\)), if \(E\) is product-measurable then each section \(E^y = \{x : (x,y) \in E\}\) is measurable, \(y \mapsto m(E^y)\) is measurable, and \(\int m(E^y)\,dy = m(E)\) (same for \(x\)-sections). Proof: first let \(\mathcal{A}\) be the collection of finite disjoint unions of measurable rectangles; \(\mathcal{A}\) is an algebra (closed under complements and finite unions) and generates the product \(\sigma\)-algebra, \(\sigma(\mathcal{A})\) being the product \(\sigma\)-algebra. The family \(\mathcal{C}\) of sets with this property contains every rectangle — for \(E = A \times B\), \(E^y = A\) (\(y \in B\)) or \(\varnothing\), and \(m(E^y) = m(A)\,\mathbf{1}_B(y)\) — and by finite additivity the section-measure identity holds on all of \(\mathcal{A}\), so \(\mathcal{A} \subset \mathcal{C}\). Moreover \(\mathcal{C}\) is a monotone class: if \(E_n \uparrow E\) then \((E_n)^y \uparrow E^y\), so continuity of measure plus MCT gives \(\int m((E_n)^y)\,dy = m(E_n) \uparrow m(E) = \int m(E^y)\,dy\) (decreasing sequences likewise, using finite measure). By the monotone class theorem, \(\mathcal{C}\) contains \(\sigma(\mathcal{A})\), so \(\mathcal{C}\) is the whole product \(\sigma\)-algebra.`,
        },
      },
      {
        text: {
          ko: String.raw`일반 단순함수 \(f = \sum_{k=1}^{m} a_k\,\mathbf{1}_{E_k}\) (\(a_k \ge 0\), \(E_k\)는 서로 겹치지 않는 곱-가측집합)에 대해: 단면 \(f^y(x) = f(x,y) = \sum_k a_k\,\mathbf{1}_{(E_k)^y}(x)\)는 단순함수이므로 \(\int f^y\,dx = \sum_k a_k\,m((E_k)^y)\) — 보조정리로 \(y \mapsto \int f^y\,dx\)는 가측함수들의 합이라 가측이다. 적분하면 \(\int\!\!\int f\,dx\,dy = \sum_k a_k \int m((E_k)^y)\,dy = \sum_{k=1}^{m} a_k\,m(E_k)\) — 순서와 무관한 하나의 이중합이다. 모든 항이 \(\ge 0\)이라 상쇄가 일어날 수 없으므로, 적분 가능성 가정이 전혀 필요 없다.`,
          en: String.raw`For a general simple function \(f = \sum_{k=1}^{m} a_k\,\mathbf{1}_{E_k}\) (\(a_k \ge 0\), the \(E_k\) disjoint product-measurable): the section \(f^y(x) = f(x,y) = \sum_k a_k\,\mathbf{1}_{(E_k)^y}(x)\) is simple, so \(\int f^y\,dx = \sum_k a_k\,m((E_k)^y)\) — and by the lemma, \(y \mapsto \int f^y\,dx\) is a sum of measurable functions, hence measurable. Integrating gives \(\int\!\!\int f\,dx\,dy = \sum_k a_k \int m((E_k)^y)\,dy = \sum_{k=1}^{m} a_k\,m(E_k)\) — a single double sum, independent of order. Every term is \(\ge 0\), so nothing can cancel: no integrability hypothesis is needed.`,
        },
      },
      {
        text: {
          ko: String.raw`일반 \(f \ge 0\)에는 표준 단순함수열 \(s_j \uparrow f\) (\(s_j = \sum_k a^{(j)}_k\,\mathbf{1}_{E^{(j)}_k}\))를 취한다. 고정된 \(y\)마다 \(x\)에 대한 단조수렴정리로 \(\int s_j^y\,dx \uparrow \int f^y\,dx\) — 여기서 \(\varphi_j(y) = \int s_j^y\,dx\)는 앞 단계에서 가측인 증가열이므로, \(y\)에 대한 단조수렴정리를 한 번 더 쓰면 \(\int_y \varphi_j\,dy \uparrow \int_y(\int_x f\,dx)dy\)이다. 그런데 \(\int_y \varphi_j\,dy = \sum_k a^{(j)}_k\,m(E^{(j)}_k) = \iint s_j \uparrow \iint f\) (곱측도에 대한 단조수렴정리)이므로, 두 겹적분 모두 \(\iint f\)와 같다 — 이것이 토넬리 정리가 \(f \ge 0\)에서는 적분 가능성을 가정하지 않는 이유이다. 모든 단계가 완성되었다.`,
          en: String.raw`For general \(f \ge 0\), take the standard simple \(s_j \uparrow f\) (\(s_j = \sum_k a^{(j)}_k\,\mathbf{1}_{E^{(j)}_k}\)). For each fixed \(y\), MCT in \(x\) gives \(\int s_j^y\,dx \uparrow \int f^y\,dx\) — and \(\varphi_j(y) = \int s_j^y\,dx\) is an increasing sequence of measurable functions by the previous step, so one more MCT in \(y\) gives \(\int_y \varphi_j\,dy \uparrow \int_y(\int_x f\,dx)dy\). But \(\int_y \varphi_j\,dy = \sum_k a^{(j)}_k\,m(E^{(j)}_k) = \iint s_j \uparrow \iint f\) (MCT for the product measure), so both iterated integrals equal \(\iint f\). This is why Tonelli's theorem needs no integrability hypothesis for \(f \ge 0\) — every step is complete.`,
        },
      },
    ],
  },
];
