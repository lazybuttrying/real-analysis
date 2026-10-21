import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Stone-Weierstrass scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/stone-weierstrass.test.ts):
 *   maxErr on the 400-point grid: n = 1: 0.2976, n = 8: 0.0792,
 *   n = 25: 0.0245, n = 40: 0.0159 (monotonically shrinking)
 *   cosine coefficients: a_k = (2/pi)((-1)^k - 1)/k^2;
 *   even k vanish, odd k give -4/(pi k^2)
 *   S_n(0) -> pi/2 - (4/pi)(pi^2/8) = 0 = f(0) via sum_{odd k} 1/k^2 = pi^2/8
 */
export const stoneWeierstrassProblems: readonly ProblemMeta[] = [
  {
    id: 'trig-algebra',
    statement: {
      ko: String.raw`원 \(S^1\) 위의 삼각다항식, 즉 \(T(\theta) = \sum_{k=-n}^{n} c_k e^{ik\theta}\) 꼴의 함수들의 집합이 Stone–Weierstrass 정리의 가정을 만족함을 보이세요: 곱셈에 닫혀 있는 부분대수이고, 상수를 포함하며, 점을 분리합니다.`,
      en: String.raw`Show that the trigonometric polynomials on the circle \(S^1\), i.e. functions of the form \(T(\theta) = \sum_{k=-n}^{n} c_k e^{ik\theta}\), satisfy the hypotheses of the Stone–Weierstrass theorem: they form a subalgebra closed under products, contain the constants, and separate points.`,
    },
    display: [
      String.raw`e^{ik\theta} e^{im\theta} = e^{i(k+m)\theta}, \qquad \cos A \cos B = \tfrac12(\cos(A-B) + \cos(A+B))`,
      String.raw`\theta_1 \ne \theta_2 \pmod{2\pi} \ \Longrightarrow \ \cos\theta_1 \ne \cos\theta_2 \ \text{or} \ \sin\theta_1 \ne \sin\theta_2`,
    ],
    preset: { degree: 8 },
    presetCaption: {
      ko: String.raw`차수 \(n = 8\): 균등오차 \(\lVert S_8 - f\rVert_\infty \approx 0.0792\) — 삼각다항식으로 삼각파 \(f(x) = |x|\)를 대수적 다항식 없이 근사합니다.`,
      en: String.raw`Degree \(n = 8\): uniform error \(\lVert S_8 - f\rVert_\infty \approx 0.0792\) — a trigonometric polynomial approximating the triangle wave \(f(x) = |x|\), with no algebraic polynomial in sight.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`부분대수: \(e^{ik\theta}\)들의 유한 선형결합들의 집합 \(\mathcal{T}\)는 선형공간이며, 두 원소의 곱은 \(e^{ik\theta} e^{im\theta} = e^{i(k+m)\theta}\)이므로 다시 \(\mathcal{T}\)에 속합니다. 실수 계수 형태 \(\sum_{k=0}^n (a_k \cos k\theta + b_k \sin k\theta)\)에서는 삼각함수 곱셈 공식(예: \(\cos A \cos B = \tfrac12(\cos(A-B) + \cos(A+B))\))이 같은 역할을 합니다.

따라서 \(\mathcal{T}\)는 곱셈에 닫힌 부분대수입니다.`,
          en: String.raw`Subalgebra: the set \(\mathcal{T}\) of finite linear combinations of the \(e^{ik\theta}\) is a linear space, and the product of two elements stays in \(\mathcal{T}\) because \(e^{ik\theta} e^{im\theta} = e^{i(k+m)\theta}\). In the real form \(\sum_{k=0}^n (a_k \cos k\theta + b_k \sin k\theta)\) the product-to-sum identities (e.g. \(\cos A \cos B = \tfrac12(\cos(A-B) + \cos(A+B))\)) play the same role.

Hence \(\mathcal{T}\) is a subalgebra closed under products.`,
        },
      },
      {
        text: {
          ko: String.raw`상수 포함: \(k = 0\) 항 \(c_0 e^{i0\theta} = c_0\)이 임의의 상수를 만들므로, \(\mathcal{T}\)는 모든 상수함수를 포함합니다.`,
          en: String.raw`Contains constants: the \(k = 0\) term \(c_0 e^{i0\theta} = c_0\) produces every constant, so \(\mathcal{T}\) contains all constant functions.`,
        },
      },
      {
        text: {
          ko: String.raw`켤레 닫힘 (복소 Stone–Weierstrass 가설): \(\overline{e^{ik\theta}} = e^{-ik\theta}\)이며, \(-k\)도 지수 범위에 들어 있으므로 켤레도 \(\mathcal{T}\)에 속합니다 — \(\mathcal{T}\)는 켤레 연산에 닫혀 있습니다. 또한 \(\cos\theta\)와 \(\sin\theta\)가 \(\mathcal{T}\)에 속함을 가정하지 않고 도출합니다: \(\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2} \in \mathcal{T}\)이고 \(\sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i} \in \mathcal{T}\)입니다 (둘 다 지수함수들의 선형결합).`,
          en: String.raw`Conjugate-closed (the complex Stone–Weierstrass hypothesis): \(\overline{e^{ik\theta}} = e^{-ik\theta}\), and \(-k\) is again an allowed exponent, so the conjugate lies in \(\mathcal{T}\) — \(\mathcal{T}\) is closed under conjugation. Also, membership of \(\cos\theta, \sin\theta\) in \(\mathcal{T}\) is derived, not assumed: \(\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2} \in \mathcal{T}\) and \(\sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i} \in \mathcal{T}\), both being linear combinations of the exponentials.`,
        },
      },
      {
        text: {
          ko: String.raw`점 분리: \(\theta_1 \ne \theta_2 \pmod{2\pi}\)이라 하자. \(\cos\)와 \(\sin\)이 모두 같은 값을 가지면 \(e^{i\theta_1} = \cos\theta_1 + i\sin\theta_1 = \cos\theta_2 + i\sin\theta_2 = e^{i\theta_2}\)가 되어 \(\theta_1 = \theta_2 \pmod{2\pi}\)가 되므로 모순입니다.

따라서 \(u(\theta) = \cos\theta \in \mathcal{T}\) 또는 \(u(\theta) = \sin\theta \in \mathcal{T}\) 중 적어도 하나가 \(\theta_1\)과 \(\theta_2\)에서 다른 값을 가지며, 이는 \(\mathcal{T}\)가 점을 분리한다는 뜻입니다.`,
          en: String.raw`Separates points: let \(\theta_1 \ne \theta_2 \pmod{2\pi}\). If both \(\cos\) and \(\sin\) agreed there, then \(e^{i\theta_1} = \cos\theta_1 + i\sin\theta_1 = \cos\theta_2 + i\sin\theta_2 = e^{i\theta_2}\), forcing \(\theta_1 = \theta_2 \pmod{2\pi}\) — a contradiction.

So at least one of \(u(\theta) = \cos\theta \in \mathcal{T}\), \(u(\theta) = \sin\theta \in \mathcal{T}\) takes different values at \(\theta_1\) and \(\theta_2\): \(\mathcal{T}\) separates points.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (차수 \(n = 8\)): 계수 항등식 \(a_k = \frac{2}{\pi}\frac{(-1)^k - 1}{k^2}\)에 의해 짝수 \(k\)는 사라지고 홀수 \(k\)만 \(-\frac{4}{\pi k^2}\)로 기여하므로, \(S_8(x) = \frac{\pi}{2} - \frac{4}{\pi}\sum_{\text{odd } k \le 8} \frac{\cos(kx)}{k^2}\)가 삼각다항식입니다. 400점 격자 위의 균등오차는 \(0.0792\)로 캡션과 일치하며, \(n = 40\)에서는 \(0.0159\)까지 떨어집니다.`,
          en: String.raw`Numerical check (degree \(n = 8\)): by the coefficient identity \(a_k = \frac{2}{\pi}\frac{(-1)^k - 1}{k^2}\), the even \(k\) vanish and only odd \(k\) contribute \(-\frac{4}{\pi k^2}\), so \(S_8(x) = \frac{\pi}{2} - \frac{4}{\pi}\sum_{\text{odd } k \le 8} \frac{\cos(kx)}{k^2}\) is a trigonometric polynomial. The uniform error on the 400-point grid is \(0.0792\), matching the caption, falling to \(0.0159\) at \(n = 40\).`,
        },
      },
    ],
  },
  {
    id: 'abs-lemma',
    statement: {
      ko: String.raw`균등 폐쇄(uniformly closed)인 대수 \(\mathcal{A} \subset C(K, \mathbb{R})\)에 대해 \(f \in \mathcal{A}\)이면 \(|f| \in \mathcal{A}\)임을 보이세요.

이로부터 \(\max(f, g)\)와 \(\min(f, g)\)도 (균등 폐쇄인) \(\mathcal{A}\)에 속한다는 결론을 도출하세요.`,
      en: String.raw`Let \(\mathcal{A} \subset C(K, \mathbb{R})\) be a uniformly closed algebra.

Show that \(f \in \mathcal{A}\) implies \(|f| \in \mathcal{A}\), and deduce that \(\max(f, g)\) and \(\min(f, g)\) also belong to the (uniformly closed) \(\mathcal{A}\).`,
    },
    display: [
      String.raw`|f| = p_k \circ f \ \text{의 극한}, \quad p_k \to |t| \ \text{on } [-M, M], \quad M = \|f\|_\infty`,
      String.raw`\max(f, g) = \frac{f + g + |f - g|}{2}, \qquad \min(f, g) = \frac{f + g - |f - g|}{2}`,
    ],
    preset: { degree: 8 },
    presetCaption: {
      ko: String.raw`차수 \(n = 8\): \(\lVert S_8 - f\rVert_\infty \approx 0.0792\) — 증명에서 쓰인 대로 다항식 극한이 연속함수의 절댓값을 균등하게 포착합니다.`,
      en: String.raw`Degree \(n = 8\): \(\lVert S_8 - f\rVert_\infty \approx 0.0792\) — polynomial limits capture the absolute value of a continuous function uniformly, as used in the proof.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`가설 확인: \(K\)는 콤팩트하다고 가정합니다 (Stone–Weierstrass 맥락) — 따라서 연속함수 \(f\)는 \(K\) 위에서 유계이고 \(M := \lVert f\rVert_\infty < \infty\)입니다. 절대값 함수 \(t \mapsto |t|\)는 \([-M, M]\) 위의 연속함수이므로, 바이어슈트라스 근사 정리(앞의 씬)에 의해 다항식 수열 \(q_k\)가 있어 \(q_k \to |t|\)로 \([-M, M]\) 위에서 균등수렴합니다.

이제 \(p_k(t) := q_k(t) - q_k(0)\)이라 둡니다. 그러면 \(p_k(0) = 0\)이고, \(q_k(0) \to |0| = 0\)이므로 \(\lVert p_k - |t|\rVert \le \lVert q_k - |t|\rVert + |q_k(0)| \to 0\)입니다 — 즉 \(p_k \to |t|\)도 \([-M, M]\) 위에서 균등수렴합니다.`,
          en: String.raw`Hypothesis check: \(K\) is assumed compact (the Stone–Weierstrass setting), so the continuous \(f\) is bounded on \(K\) and \(M := \lVert f\rVert_\infty < \infty\). The absolute-value function \(t \mapsto |t|\) is continuous on \([-M, M]\), so by the Weierstrass approximation theorem (the preceding scene) there are polynomials \(q_k\) with \(q_k \to |t|\) uniformly on \([-M, M]\).

Now set \(p_k(t) := q_k(t) - q_k(0)\). Then \(p_k(0) = 0\), and since \(q_k(0) \to |0| = 0\), we have \(\lVert p_k - |t|\rVert \le \lVert q_k - |t|\rVert + |q_k(0)| \to 0\) — so \(p_k \to |t|\) uniformly on \([-M, M]\) as well.`,
        },
      },
      {
        text: {
          ko: String.raw`\(p_k(0) = 0\)이므로 \(p_k\)는 상수항이 없는 다항식입니다: \(p_k(t) = \sum_{j \ge 1} a_{kj} t^j\). 따라서 합성 \(p_k \circ f = \sum_{j \ge 1} a_{kj} f^j\)는 \(\mathcal{A}\)에 속합니다 — \(\mathcal{A}\)가 대수(곱셈·합·스칼라곱에 닫힌 부분공간)라서 \(f\)의 거듭제곱과 그 선형결합이 모두 \(\mathcal{A}\)에 있기 때문입니다. (\(\mathcal{A}\)가 단위원 \(1\)을 포함한다고 가정하지 않았으므로 상수항을 제거하는 이 단계가 필수적입니다.)

\(f(K) \subset [-M, M]\)이므로, \(p_k \to |t|\)의 \([-M, M]\) 위 균등수렴은 \(p_k \circ f \to |f|\)의 \(K\) 위 균등수렴을 함의합니다.`,
          en: String.raw`Since \(p_k(0) = 0\), \(p_k\) is a polynomial with zero constant term: \(p_k(t) = \sum_{j \ge 1} a_{kj} t^j\). Hence the composition \(p_k \circ f = \sum_{j \ge 1} a_{kj} f^j\) lies in \(\mathcal{A}\) — \(\mathcal{A}\), being an algebra (a subspace closed under products), contains all powers of \(f\) and their linear combinations. (This removal of the constant term is essential: \(\mathcal{A}\) is not assumed to contain \(1\) or the constants.)

Because \(f(K) \subset [-M, M]\), uniform convergence of \(p_k \to |t|\) on \([-M, M]\) implies uniform convergence of \(p_k \circ f \to |f|\) on \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\mathcal{A}\)가 균등 폐쇄이므로 균등 극한 \(|f|\)도 \(\mathcal{A}\)에 속합니다. 이제 \(f - g \in \mathcal{A}\)이면 \(|f - g| \in \mathcal{A}\)이므로, 항등식 \(\max(f,g) = \frac{f+g+|f-g|}{2}\)와 \(\min(f,g) = \frac{f+g-|f-g|}{2}\)에 의해 \(\max(f,g), \min(f,g) \in \mathcal{A}\)입니다 — 균등 폐쇄 대수는 격자(lattice)입니다.`,
          en: String.raw`Since \(\mathcal{A}\) is uniformly closed, the uniform limit \(|f|\) lies in \(\mathcal{A}\). If \(f - g \in \mathcal{A}\) then \(|f - g| \in \mathcal{A}\), so the identities \(\max(f,g) = \frac{f+g+|f-g|}{2}\) and \(\min(f,g) = \frac{f+g-|f-g|}{2}\) give \(\max(f,g), \min(f,g) \in \mathcal{A}\) — a uniformly closed algebra is a lattice.`,
        },
      },
      {
        text: {
          ko: String.raw`해설: \(p_k \circ f\) 단계에서 \(\mathcal{A}\)가 대수라는 가정이 필수적입니다 — \(f\)의 거듭제곱을 만드는 데 쓰입니다. 격자 성질은 아래 조밀성 논증에서 \(\min\)과 \(\max\)으로 근사식을 다듬을 때 사용됩니다.`,
          en: String.raw`Note: the algebra hypothesis is essential for the \(p_k \circ f\) step — it is what makes powers of \(f\) available. The lattice property is what lets the density argument below carve approximants with \(\min\) and \(\max\).`,
        },
      },
    ],
  },
  {
    id: 'lattice-density',
    statement: {
      ko: String.raw`Stone–Weierstrass 정리의 조밀성 논증을 완성하세요: 점을 분리하고 상수를 포함하는 부분대수 \(\mathcal{A} \subset C(K, \mathbb{R})\) (\(K\) 콤팩트)에 대해 \(\overline{\mathcal{A}}\)는 \(C(K, \mathbb{R})\)에서 균등 조밀합니다.`,
      en: String.raw`Complete the density argument of the Stone–Weierstrass theorem: for a subalgebra \(\mathcal{A} \subset C(K, \mathbb{R})\) (\(K\) compact) that separates points and contains the constants, the uniform closure \(\overline{\mathcal{A}}\) is uniformly dense in \(C(K, \mathbb{R})\).`,
    },
    display: [
      String.raw`\begin{pmatrix} u(x) & 1 \\ u(y) & 1 \end{pmatrix}\begin{pmatrix} a \\ b \end{pmatrix} = \begin{pmatrix} f(x) \\ f(y) \end{pmatrix}, \quad \det = u(x) - u(y) \ne 0`,
      String.raw`g_x = \min_j g_{xy_j} \le f + \varepsilon, \quad h = \max_i g_{x_i}, \quad f - \varepsilon < h < f + \varepsilon`,
    ],
    preset: { degree: 25 },
    presetCaption: {
      ko: String.raw`차수 \(n = 25\): \(\lVert S_{25} - f\rVert_\infty \approx 0.0245\) — 격자 연산으로 다듬어진 근사식이 \(\varepsilon\) 안으로 들어오는 모습을 수치로 보여줍니다.`,
      en: String.raw`Degree \(n = 25\): \(\lVert S_{25} - f\rVert_\infty \approx 0.0245\) — the lattice-refined approximant lands inside \(\varepsilon\), shown numerically.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`균등 폐포 \(\overline{\mathcal{A}}\)는 균등 폐쇄인 대수이며, 점을 분리하고 상수를 포함합니다. 대수임의 확인: \(f_n \to f\), \(g_n \to g\)가 \(K\) 위에서 균등수렴하면 수렴수열은 균등 유계이므로 (\(\lVert f_n\rVert, \lVert g_n\rVert\)가 어떤 상수 이하), \(\lVert f_n g_n - fg\rVert \le \lVert f_n\rVert \lVert g_n - g\rVert + \lVert g\rVert \lVert f_n - f\rVert \to 0\)입니다 — 따라서 \(fg \in \overline{\mathcal{A}}\)입니다.

(\(C(K)\) 전체에서는 곱셈이 전역적으로 균등연속이 아니므로, 이 유계성 단계가 필요합니다.) 아래의 (b)–(c) 격자 단계는 \(\mathcal{A}\)가 아니라 \(\overline{\mathcal{A}}\) 안에서 수행합니다 (절댓값 보조정리를 균등 폐쇄 대수 \(\overline{\mathcal{A}}\)에 적용). \(\overline{\mathcal{A}}\)가 \(C(K, \mathbb{R})\)에서 조밀함을 보이면 \(\mathcal{A}\)의 조밀성이 따라옵니다.`,
          en: String.raw`The uniform closure \(\overline{\mathcal{A}}\) is a uniformly closed algebra, still separating points and containing constants. That it is an algebra: if \(f_n \to f\) and \(g_n \to g\) uniformly on \(K\), the convergent sequences are uniformly bounded (some constant bounds all \(\lVert f_n\rVert, \lVert g_n\rVert\)), and \(\lVert f_n g_n - fg\rVert \le \lVert f_n\rVert \lVert g_n - g\rVert + \lVert g\rVert \lVert f_n - f\rVert \to 0\) — hence \(fg \in \overline{\mathcal{A}}\). (This boundedness step is needed because multiplication on all of \(C(K)\) is not globally uniformly continuous.)

The lattice steps (b)–(c) below are carried out inside \(\overline{\mathcal{A}}\), not \(\mathcal{A}\) (the absolute-value lemma applied to the uniformly closed algebra \(\overline{\mathcal{A}}\)). Proving \(\overline{\mathcal{A}}\) dense in \(C(K, \mathbb{R})\) then gives density of \(\mathcal{A}\).`,
        },
      },
      {
        text: {
          ko: String.raw`(a) 두 점 보간: \(f \in C(K, \mathbb{R})\)와 \(\varepsilon > 0\)을 고정합니다. 서로 다른 \(x, y \in K\)에 대해, 점 분리 가정에 의해 \(u(x) \ne u(y)\)인 \(u \in \mathcal{A}\)가 존재합니다.

연립방정식 \(\begin{pmatrix} u(x) & 1 \\ u(y) & 1 \end{pmatrix}\begin{pmatrix} a \\ b \end{pmatrix} = \begin{pmatrix} f(x) \\ f(y) \end{pmatrix}\)의 행렬식은 \(u(x) - u(y) \ne 0\)이므로 유일한 해 \((a, b)\)가 존재하고, \(g_{xy} := au + b \in \mathcal{A}\)는 \(g_{xy}(x) = f(x)\), \(g_{xy}(y) = f(y)\)를 만족합니다 (\(b\) 항은 상수 포함 가정으로 \(\mathcal{A}\)에 있음). \(x = y\)일 때는 상수함수 \(f(x)\)를 취합니다.`,
          en: String.raw`(a) Two-point interpolation: fix \(f \in C(K, \mathbb{R})\) and \(\varepsilon > 0\). For distinct \(x, y \in K\), the separation hypothesis gives \(u \in \mathcal{A}\) with \(u(x) \ne u(y)\).

The system \(\begin{pmatrix} u(x) & 1 \\ u(y) & 1 \end{pmatrix}\begin{pmatrix} a \\ b \end{pmatrix} = \begin{pmatrix} f(x) \\ f(y) \end{pmatrix}\) has determinant \(u(x) - u(y) \ne 0\), so a unique solution \((a, b)\) exists, and \(g_{xy} := au + b \in \mathcal{A}\) satisfies \(g_{xy}(x) = f(x)\), \(g_{xy}(y) = f(y)\) (the \(b\) term lies in \(\mathcal{A}\) because \(\mathcal{A}\) contains the constants). For \(x = y\) take the constant function \(f(x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`(b) 위에서 누르기 (\(\varepsilon/2\) 여유 사용): \(x\)를 고정합니다. 각 \(y \in K\)에 대해 집합 \(U_y := \{z : g_{xy}(z) < f(z) + \varepsilon/2\}\)는 \(g_{xy}\)와 \(f\)의 연속성에 의해 열린집합이며, \(g_{xy}(y) = f(y)\)이므로 \(y \in U_y\)입니다. 따라서 \(\{U_y : y \in K\}\)는 콤팩트 집합 \(K\)의 열린 덮개이므로, 유한 부분덮개 \(U_{y_1}, \dots, U_{y_m}\)이 존재합니다.

양자화 주의: \(g_{xy_j} < f + \varepsilon/2\)는 \(K\) 전체가 아니라 \(U_{y_j}\) 위에서만 성립합니다. 그러나 각 \(z \in K\)마다 \(z \in U_{y_j}\)인 \(j\)가 존재하므로 그 \(j\)에서 \(g_{xy_j}(z) < f(z) + \varepsilon/2\)이고, 따라서 \(g_x(z) := \min_j g_{xy_j}(z) \le g_{xy_j}(z) < f(z) + \varepsilon/2\)가 모든 \(z\)에서 점별로 성립합니다. 앞 문제의 격자 성질을 \(\overline{\mathcal{A}}\)에 적용하면 \(g_x = \min_j g_{xy_j} \in \overline{\mathcal{A}}\)입니다. 또한 모든 \(j\)에서 \(g_{xy_j}(x) = f(x)\)이므로 \(g_x(x) = f(x)\)입니다.`,
          en: String.raw`(b) Pressing from above (run with \(\varepsilon/2\) slack): fix \(x\). For each \(y \in K\), the set \(U_y := \{z : g_{xy}(z) < f(z) + \varepsilon/2\}\) is open by continuity of \(g_{xy}\) and \(f\), and \(y \in U_y\) since \(g_{xy}(y) = f(y)\). So \(\{U_y : y \in K\}\) is an open cover of the compact \(K\), and a finite subcover \(U_{y_1}, \dots, U_{y_m}\) exists.

Quantifier care: \(g_{xy_j} < f + \varepsilon/2\) holds only on \(U_{y_j}\), not on all of \(K\). But for each \(z \in K\) there is some \(j\) with \(z \in U_{y_j}\), and for that \(j\), \(g_{xy_j}(z) < f(z) + \varepsilon/2\); hence \(g_x(z) := \min_j g_{xy_j}(z) \le g_{xy_j}(z) < f(z) + \varepsilon/2\) holds pointwise for every \(z\). By the lattice property applied to \(\overline{\mathcal{A}}\), \(g_x = \min_j g_{xy_j} \in \overline{\mathcal{A}}\). Also \(g_{xy_j}(x) = f(x)\) for every \(j\), so \(g_x(x) = f(x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`(c) 아래에서 올리기: 각 \(x \in K\)에 대해 \(V_x := \{z : g_x(z) > f(z) - \varepsilon\}\)는 열린집합이며, \(g_x(x) = f(x)\)이므로 \(x \in V_x\)입니다. \(\{V_x\}\)는 \(K\)의 열린 덮개이므로 유한 부분덮개 \(V_{x_1}, \dots, V_{x_l}\)이 존재합니다.

\(h := \max_i g_{x_i} \in \overline{\mathcal{A}}\) (\(\overline{\mathcal{A}}\)에서의 격자 성질)라 두면, 모든 \(z \in K\)에 대해 \(z \in V_{x_i}\)인 \(i\)가 있어 \(h(z) \ge g_{x_i}(z) > f(z) - \varepsilon\)이며, (b)의 \(\varepsilon/2\) 여유에서 \(g_{x_i} \le f + \varepsilon/2\)이므로 \(h \le f + \varepsilon/2 < f + \varepsilon\)입니다. 즉 \(f - \varepsilon < h < f + \varepsilon\)가 \(K\) 위에서 성립하며 \(h \in \overline{\mathcal{A}}\)입니다.`,
          en: String.raw`(c) Lifting from below: for each \(x \in K\), \(V_x := \{z : g_x(z) > f(z) - \varepsilon\}\) is open and \(x \in V_x\) since \(g_x(x) = f(x)\). The \(\{V_x\}\) form an open cover of \(K\), so a finite subcover \(V_{x_1}, \dots, V_{x_l}\) exists.

With \(h := \max_i g_{x_i} \in \overline{\mathcal{A}}\) (lattice property in \(\overline{\mathcal{A}}\)), every \(z \in K\) lies in some \(V_{x_i}\), giving \(h(z) \ge g_{x_i}(z) > f(z) - \varepsilon\), while the \(\varepsilon/2\) slack in (b) gives \(g_{x_i} \le f + \varepsilon/2\), so \(h \le f + \varepsilon/2 < f + \varepsilon\). Hence \(f - \varepsilon < h < f + \varepsilon\) on \(K\), with \(h \in \overline{\mathcal{A}}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 임의였으므로 \(f \in \overline{\mathcal{A}}\)입니다. \(f \in C(K, \mathbb{R})\)도 임의였으므로 \(\overline{\mathcal{A}} = C(K, \mathbb{R})\) — \(\mathcal{A}\)는 균등 조밀합니다.

수치 확인: \(f(x) = |x|\), 삼각다항식 \(\mathcal{T}\)에 대해 차수 \(n = 25\)에서 \(\lVert S_{25} - f\rVert_\infty \approx 0.0245\)로 캡션과 일치하며, 차수를 올리면 이 오차가 0으로 갑니다 (\(n = 40\)에서 \(0.0159\)).`,
          en: String.raw`Since \(\varepsilon > 0\) was arbitrary, \(f \in \overline{\mathcal{A}}\); since \(f \in C(K, \mathbb{R})\) was arbitrary, \(\overline{\mathcal{A}} = C(K, \mathbb{R})\) — \(\mathcal{A}\) is uniformly dense. Numerical check: for \(f(x) = |x|\) and the trigonometric-polynomial algebra \(\mathcal{T}\), at degree \(n = 25\) we get \(\lVert S_{25} - f\rVert_\infty \approx 0.0245\), matching the caption, and the error tends to zero as the degree grows (\(0.0159\) at \(n = 40\)).`,
        },
      },
    ],
  },
];
