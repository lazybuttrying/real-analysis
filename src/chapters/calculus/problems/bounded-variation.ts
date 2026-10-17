import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the bounded-variation scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/bounded-variation.test.ts):
 *   sine: V_40 = 3.996756..., V_80 = 3.999209..., V_200 = 3.999875... -> 4
 *   wild: V_40 = 1.656467..., V_200 = 2.138768...
 *   u_1 = 1/(2.5 pi) = 0.1273239545, v_1 = 1/(3.5 pi) = 0.0909456818
 *   sum_{k=1}^{200} (u_k + v_k) = 1.684908... > 1, and >= H_200/(2 pi) = 0.9355...
 */
export const boundedVariationProblems: readonly ProblemMeta[] = [
  {
    id: 'bv-monotone',
    statement: {
      ko: String.raw`구간 \([a, b]\)에서 단조인 모든 함수 \(f\)가 유계변분이며 \(V_a^b(f) = |f(b) - f(a)|\)임을 보이세요.`,
      en: String.raw`Show that every monotone function \(f\) on \([a, b]\) is of bounded variation with \(V_a^b(f) = |f(b) - f(a)|\).`,
    },
    display: [
      String.raw`V_a^b(f) := \sup_P \sum_{i=1}^{m} \bigl|f(x_i) - f(x_{i-1})\bigr|`,
      String.raw`\sum_{i=1}^{m} \bigl|f(x_i) - f(x_{i-1})\bigr| = \sum_{i=1}^{m} \bigl(f(x_i) - f(x_{i-1})\bigr) = f(b) - f(a) \quad (f \text{ increasing})`,
    ],
    preset: { fn: 'sine', n: 40 },
    presetCaption: {
      ko: String.raw`\(n = 40\): \(f(x) = \sin(2\pi x)\)는 단조가 아니지만 \(V_{40} \approx 3.9968\) — 단조인 경우는 분할마다 망원경 합이 되어 변분이 \(|f(b) - f(a)|\) 하나로 고정됩니다.`,
      en: String.raw`\(n = 40\): \(f(x) = \sin(2\pi x)\) is not monotone, yet \(V_{40} \approx 3.9968\) — when \(f\) is monotone, the sum telescopes on every partition, fixing the variation at \(|f(b) - f(a)|\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 \([a, b]\)에서 증가한다고 하고, 임의의 분할 \(P = \{x_0 < x_1 < \dots < x_m\}\) (\([x_0, x_m] = [a, b]\))를 잡습니다. 단조증가이므로 각 구간에서 \(f(x_i) - f(x_{i-1}) \ge 0\)이고, 절댓값이 풀려 \(\sum_{i=1}^{m}|f(x_i) - f(x_{i-1})| = \sum_{i=1}^{m}(f(x_i) - f(x_{i-1}))\)가 됩니다. 이는 망원경 합이므로 \(f(b) - f(a)\)와 같습니다.`,
          en: String.raw`Let \(f\) be increasing on \([a, b]\) and take any partition \(P = \{x_0 < x_1 < \dots < x_m\}\) (\([x_0, x_m] = [a, b]\)). Monotonicity gives \(f(x_i) - f(x_{i-1}) \ge 0\) on each subinterval, so the absolute values unwrap: \(\sum_{i=1}^{m}|f(x_i) - f(x_{i-1})| = \sum_{i=1}^{m}(f(x_i) - f(x_{i-1}))\), which telescopes to \(f(b) - f(a)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f\)가 감소인 경우에도 마찬가지입니다: \(f(x_i) - f(x_{i-1}) \le 0\)이므로 \(|f(x_i) - f(x_{i-1})| = f(x_{i-1}) - f(x_i)\)가 되어 합은 \(f(a) - f(b) = |f(b) - f(a)|\)가 됩니다. 즉 단조함수에 대해서는 모든 분할이 똑같은 변분 \(|f(b) - f(a)|\)를 줍니다.`,
          en: String.raw`The decreasing case is the same: \(f(x_i) - f(x_{i-1}) \le 0\), so \(|f(x_i) - f(x_{i-1})| = f(x_{i-1}) - f(x_i)\) and the sum is \(f(a) - f(b) = |f(b) - f(a)|\). Every partition of a monotone \(f\) gives the same variation \(|f(b) - f(a)|\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 분할에 대한 상한(supremum)은 \(|f(b) - f(a)| < \infty\)이며, 이는 바로 \(V_a^b(f) = |f(b) - f(a)|\)를 뜻합니다 — 유계변분입니다. 칸토어 함수(극한과 연속 편의 씬)는 \([0, 1]\)에서 증가하고 \(c(0) = 0\), \(c(1) = 1\)이므로 \(V_0^1(c) = 1\)입니다.`,
          en: String.raw`Hence the supremum over partitions is \(|f(b) - f(a)| < \infty\), i.e. \(V_a^b(f) = |f(b) - f(a)|\): monotone functions are of bounded variation. The Cantor function (see the limits chapter) is increasing on \([0, 1]\) with \(c(0) = 0\), \(c(1) = 1\), so \(V_0^1(c) = 1\).`,
        },
      },
    ],
  },
  {
    id: 'bv-jordan',
    statement: {
      ko: String.raw`조던 분해 정리: \(f\)가 \([a, b]\)에서 유계변분이기 위한 필요충분조건은 \(f = g - h\) (단, \(g, h\)는 \([a, b]\)에서 증가하는 함수)로 쓸 수 있는 것입니다. 힌트: \(v(x) := V_a^x(f)\)라 두세요.`,
      en: String.raw`Jordan decomposition: \(f\) is of bounded variation on \([a, b]\) if and only if \(f = g - h\) with \(g, h\) increasing on \([a, b]\). Hint: set \(v(x) := V_a^x(f)\).`,
    },
    display: [
      String.raw`v(x) := V_a^x(f), \qquad f = \frac{v + f}{2} - \frac{v - f}{2}`,
      String.raw`V_x^y(f) \ge \pm\bigl(f(y) - f(x)\bigr) \quad (a \le x < y \le b)`,
    ],
    preset: { fn: 'sine', n: 80 },
    presetCaption: {
      ko: String.raw`\(n = 80\): \(V_{80} \approx 3.9992\) — 누적 변분 \(v(x) = V_0^x(\sin 2\pi\,\cdot)\) 자체가 단조증가하므로, \(f = \frac{v+f}{2} - \frac{v-f}{2}\)가 두 증가함수의 차가 됩니다.`,
      en: String.raw`\(n = 80\): \(V_{80} \approx 3.9992\) — the cumulative variation \(v(x) = V_0^x(\sin 2\pi\,\cdot)\) is itself increasing, so \(f = \frac{v+f}{2} - \frac{v-f}{2}\) splits \(f\) into a difference of two increasing functions.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 \([a, b]\)에서 유계변분이라 하고 \(v(x) := V_a^x(f)\) (\(a \le x \le b\))라 둡니다. 변분은 구간 덧셈성 \(V_a^y(f) = V_a^x(f) + V_x^y(f)\)를 가지므로 (\(a \le x < y \le b\)), \(v(y) - v(x) = V_x^y(f) \ge 0\) — 즉 \(v\)는 증가함수입니다.`,
          en: String.raw`Assume \(f\) is of bounded variation on \([a, b]\) and set \(v(x) := V_a^x(f)\) for \(a \le x \le b\). Variation is additive over adjacent intervals, \(V_a^y(f) = V_a^x(f) + V_x^y(f)\) for \(a \le x < y \le b\), so \(v(y) - v(x) = V_x^y(f) \ge 0\): \(v\) is increasing.`,
        },
      },
      {
        text: {
          ko: String.raw`핵심 부등식: 구간 \([x, y]\)의 자명 분할 \(\{x, y\}\)는 상한을 잡는 분할들의 하나이므로, \(V_x^y(f) \ge |f(y) - f(x)| \ge \pm(f(y) - f(x))\)입니다. 따라서 \(v(y) - v(x) \ge f(y) - f(x)\)이면서 동시에 \(v(y) - v(x) \ge -(f(y) - f(x))\)입니다.`,
          en: String.raw`The key inequality: the trivial partition \(\{x, y\}\) of \([x, y]\) is one of the partitions in the supremum, so \(V_x^y(f) \ge |f(y) - f(x)| \ge \pm(f(y) - f(x))\). Hence \(v(y) - v(x) \ge f(y) - f(x)\) and also \(v(y) - v(x) \ge -(f(y) - f(x))\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(g := \frac{v + f}{2}\), \(h := \frac{v - f}{2}\)라 둡니다. 그러면 \(g(y) - g(x) = \frac{1}{2}\bigl((v(y) - v(x)) + (f(y) - f(x))\bigr) \ge 0\), \(h(y) - h(x) = \frac{1}{2}\bigl((v(y) - v(x)) - (f(y) - f(x))\bigr) \ge 0\)이므로 \(g, h\)는 모두 증가함수이고, \(g - h = f\)입니다.`,
          en: String.raw`Set \(g := \frac{v + f}{2}\) and \(h := \frac{v - f}{2}\). Then \(g(y) - g(x) = \frac{1}{2}\bigl((v(y) - v(x)) + (f(y) - f(x))\bigr) \ge 0\) and \(h(y) - h(x) = \frac{1}{2}\bigl((v(y) - v(x)) - (f(y) - f(x))\bigr) \ge 0\), so \(g\) and \(h\) are both increasing, and \(g - h = f\).`,
        },
      },
      {
        text: {
          ko: String.raw`역방향: \(f = g - h\) (\(g, h\) 증가)라면 문제 1에 의해 \(g, h\)는 유계변분이고, 삼각부등식으로 \(|f(x_i) - f(x_{i-1})| \le |g\)의 차\(| + |h\)의 차\(|\)이므로 \(V_P(f) \le V_P(g) + V_P(h) = (g(b) - g(a)) + (h(b) - h(a)) < \infty\) — 따라서 \(f\)는 유계변분입니다. 즉 \(f\) 유계변분 \(\iff\) \(f = g - h\) (가법 상수까지 유일).`,
          en: String.raw`Conversely, if \(f = g - h\) with \(g, h\) increasing, then by problem 1 both are of bounded variation, and the triangle inequality gives \(|f(x_i) - f(x_{i-1})| \le |g\text{-diff}| + |h\text{-diff}|\), so \(V_P(f) \le V_P(g) + V_P(h) = (g(b) - g(a)) + (h(b) - h(a)) < \infty\): \(f\) is of bounded variation. So \(f\) is BV \(\iff\) \(f = g - h\) (unique up to an additive constant).`,
        },
      },
    ],
  },
  {
    id: 'bv-wild',
    statement: {
      ko: String.raw`\(f(0) = 0\), \(x > 0\)에서 \(f(x) = x\sin(1/x)\)인 \(f\)가 \([0, 1]\)에서 유계변분이 아님을 보이세요.`,
      en: String.raw`Show that \(f\) with \(f(0) = 0\) and \(f(x) = x\sin(1/x)\) for \(x > 0\) is NOT of bounded variation on \([0, 1]\).`,
    },
    display: [
      String.raw`u_k = \frac{1}{2\pi k + \pi/2},\; f(u_k) = u_k, \qquad v_k = \frac{1}{2\pi k + 3\pi/2},\; f(v_k) = -v_k`,
      String.raw`V(f) \ge \sum_{k=1}^{N}(u_k + v_k) \ge \sum_{k=1}^{N}\frac{1}{2\pi k} = \frac{H_N}{2\pi} \longrightarrow \infty`,
    ],
    preset: { fn: 'wild', n: 200 },
    presetCaption: {
      ko: String.raw`\(n = 200\): \(V_{200} \approx 2.1388\) — 증명의 하한 \(\sum_{k=1}^{200}(u_k + v_k) \approx 1.6849 > 1\)을 이미 넘어섰고, \(H_N/(2\pi) \to \infty\)이므로 변분은 어떤 상한 아래도 들어가지 않습니다.`,
      en: String.raw`\(n = 200\): \(V_{200} \approx 2.1388\) — already past the proof's lower bound \(\sum_{k=1}^{200}(u_k + v_k) \approx 1.6849 > 1\), and since \(H_N/(2\pi) \to \infty\) the variation admits no finite upper bound.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\sin(1/x) = 1\)인 점 \(u_k = \frac{1}{2\pi k + \pi/2}\) (\(f(u_k) = u_k\))와 \(\sin(1/x) = -1\)인 점 \(v_k = \frac{1}{2\pi k + 3\pi/2}\) (\(f(v_k) = -v_k\))를 잡습니다. 분모를 비교하면 \(0 < v_k < u_k < 1\)이고, \(u_{k+1} = \frac{1}{2\pi k + 5\pi/2} < v_k\)이므로 점들은 \(0 < v_N < u_N < \dots < v_1 < u_1 < 1\) 순으로 늘어섭니다.`,
          en: String.raw`Take \(u_k = \frac{1}{2\pi k + \pi/2}\) where \(\sin(1/x) = 1\) (so \(f(u_k) = u_k\)) and \(v_k = \frac{1}{2\pi k + 3\pi/2}\) where \(\sin(1/x) = -1\) (so \(f(v_k) = -v_k\)). Comparing denominators, \(0 < v_k < u_k < 1\), and \(u_{k+1} = \frac{1}{2\pi k + 5\pi/2} < v_k\), so the points line up as \(0 < v_N < u_N < \dots < v_1 < u_1 < 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`분할 \(P_N = \{0, v_N, u_N, \dots, v_1, u_1, 1\}\)을 잡습니다. 구간 \([0, v_N]\)과 \([u_1, 1]\)의 기여는 음이 아니므로 버려도 되고, 각 쌍 \((v_k, u_k)\)에서 \(|f(u_k) - f(v_k)| = |u_k - (-v_k)| = u_k + v_k\)이므로 \(V_{P_N}(f) \ge \sum_{k=1}^{N}(u_k + v_k)\)입니다.`,
          en: String.raw`Take the partition \(P_N = \{0, v_N, u_N, \dots, v_1, u_1, 1\}\). The contributions from \([0, v_N]\) and \([u_1, 1]\) are nonnegative, so dropping them only lowers the sum; on each pair \((v_k, u_k)\) we get \(|f(u_k) - f(v_k)| = |u_k - (-v_k)| = u_k + v_k\). Hence \(V_{P_N}(f) \ge \sum_{k=1}^{N}(u_k + v_k)\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(u_k + v_k \ge 2v_k = \frac{2}{2\pi k + 3\pi/2} \ge \frac{1}{2\pi k}\)를 확인합니다: 마지막 부등식은 \(4\pi k \ge 2\pi k + 3\pi/2\), 즉 \(4k \ge 3\) (\(k \ge 1\))과 동치입니다. 따라서 \(V_{P_N}(f) \ge \sum_{k=1}^{N} \frac{1}{2\pi k} = \frac{H_N}{2\pi} \to \infty\) (\(N \to \infty\)).`,
          en: String.raw`Now \(u_k + v_k \ge 2v_k = \frac{2}{2\pi k + 3\pi/2} \ge \frac{1}{2\pi k}\): the last inequality is equivalent to \(4\pi k \ge 2\pi k + 3\pi/2\), i.e. \(4k \ge 3\) for \(k \ge 1\). Therefore \(V_{P_N}(f) \ge \sum_{k=1}^{N} \frac{1}{2\pi k} = \frac{H_N}{2\pi} \to \infty\) as \(N \to \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`분할 변분이 발산하므로 \(\sup_P V_P(f) = \infty\): \(f\)는 \([0, 1]\)에서 유계변분이 아닙니다. 수치 확인: \(u_1 = \frac{1}{2.5\pi} \approx 0.12732\), \(v_1 = \frac{1}{3.5\pi} \approx 0.09095\), \(\sum_{k=1}^{200}(u_k + v_k) \approx 1.6849 > 1\) — 화면의 \(V_{200} \approx 2.1388\)이 이 하한을 이미 넘었습니다. (참고: \(x^2\sin(1/x)\)는 유계변분입니다 — \(V \le 3\)인 이유는 \(\int_0^1 |f'| \le 2\) 때문입니다.)`,
          en: String.raw`Since the partition variations diverge, \(\sup_P V_P(f) = \infty\): \(f\) is not of bounded variation on \([0, 1]\). Numerical check: \(u_1 = \frac{1}{2.5\pi} \approx 0.12732\), \(v_1 = \frac{1}{3.5\pi} \approx 0.09095\), \(\sum_{k=1}^{200}(u_k + v_k) \approx 1.6849 > 1\) — the scene's \(V_{200} \approx 2.1388\) already exceeds this lower bound. (Contrast: \(x^2\sin(1/x)\) IS of bounded variation, with \(V \le 3\), since \(\int_0^1 |f'| \le 2\).)`,
        },
      },
    ],
  },
];
