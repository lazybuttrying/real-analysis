import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the arc-length scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/arc-length.test.ts):
 *   circle, n = 8: L_8 = 2 * 8 * sin(pi / 32) = 1.5682742452729697,
 *     below the exact length pi / 2 = 1.5707963267948966;
 *   parabola: L_4 = 1.4742804757093162 and L_8 = 1.4777779851313877,
 *     below the exact length sqrt(5) / 2 + asinh(2) / 4
 *     = 1.4789428575445974, which Simpson integration of sqrt(1 + 4x^2)
 *     on [0, 1] confirms to 1e-9.
 */
export const arcLengthProblems: readonly ProblemMeta[] = [
  {
    id: 'circle-arc-via-formula',
    statement: {
      ko: String.raw`\(C^1\) 곡선에 대한 길이 공식 \(L = \int |\gamma'(t)|\,dt\)를 써서, \(\gamma(t) = (R\cos t, R\sin t)\) (\(t \in [\alpha, \beta]\))의 길이가 \(L = R(\beta - \alpha)\)임을 완전히 보이세요.

그런 다음 \(R = 1\), \([\alpha, \beta] = [0, \pi/2]\)인 경우와 온전한 원의 경우를 구하세요.`,
      en: String.raw`Using the length formula \(L = \int |\gamma'(t)|\,dt\) for \(C^1\) curves, show completely that \(\gamma(t) = (R\cos t, R\sin t)\) on \(t \in [\alpha, \beta]\) has length \(L = R(\beta - \alpha)\).

Then specialize to \(R = 1\) on \([0, \pi/2]\) and to the full circle.`,
    },
    display: [
      String.raw`\gamma'(t) = (-R\sin t, R\cos t), \qquad |\gamma'(t)| = R`,
      String.raw`L = \int_\alpha^\beta |\gamma'(t)|\,dt = R(\beta - \alpha)`,
    ],
    preset: { curve: 'circle', n: 16 },
    presetCaption: {
      ko: String.raw`사분원, \(n = 16\): 꺾은선 길이 \(L_{16} \approx 1.570166\)이 정확한 값 \(\pi/2 \approx 1.570796\) 아래에서 다가갑니다 — 아래 공식이 그 정확한 값을 줍니다.`,
      en: String.raw`The quarter circle at \(n = 16\): the polygonal length \(L_{16} \approx 1.570166\) approaches the exact value \(\pi/2 \approx 1.570796\) from below — the formula below gives that exact value.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`성분별로 미분합니다: \(\gamma(t) = (R\cos t, R\sin t)\)이므로 \(\gamma'(t) = (-R\sin t, R\cos t)\)입니다.

\(\gamma\)는 \(C^1\) 곡선이므로 길이 공식 \(L = \int_\alpha^\beta |\gamma'(t)|\,dt\)를 적용할 수 있습니다.`,
          en: String.raw`Differentiate componentwise: from \(\gamma(t) = (R\cos t, R\sin t)\) we get \(\gamma'(t) = (-R\sin t, R\cos t)\).

Since \(\gamma\) is a \(C^1\) curve, the length formula \(L = \int_\alpha^\beta |\gamma'(t)|\,dt\) applies.`,
        },
      },
      {
        text: {
          ko: String.raw`속력(speed)은 상수입니다: \(|\gamma'(t)| = \sqrt{(-R\sin t)^2 + (R\cos t)^2} = \sqrt{R^2\sin^2 t + R^2\cos^2 t} = R\sqrt{\sin^2 t + \cos^2 t} = R\) (단, \(R > 0\)).

피타고라스 항등식 \(\sin^2 t + \cos^2 t = 1\)이 각도 의존성을 정확히 지워 줍니다.`,
          en: String.raw`The speed is constant: \(|\gamma'(t)| = \sqrt{(-R\sin t)^2 + (R\cos t)^2} = \sqrt{R^2\sin^2 t + R^2\cos^2 t} = R\sqrt{\sin^2 t + \cos^2 t} = R\) (for \(R > 0\)).

The Pythagorean identity \(\sin^2 t + \cos^2 t = 1\) cancels the angle dependence exactly.`,
        },
      },
      {
        text: {
          ko: String.raw`적분하면 \(L = \int_\alpha^\beta |\gamma'(t)|\,dt = \int_\alpha^\beta R\,dt = R(\beta - \alpha)\)입니다.

즉 원호의 길이는 반지름에 중심각을 곱한 값입니다.`,
          en: String.raw`Integrating, \(L = \int_\alpha^\beta |\gamma'(t)|\,dt = \int_\alpha^\beta R\,dt = R(\beta - \alpha)\).

So the length of a circular arc is the radius times the subtended angle.`,
        },
      },
      {
        text: {
          ko: String.raw`특수화: \(R = 1\)이고 \([\alpha, \beta] = [0, \pi/2]\)이면 \(L = 1 \cdot (\pi/2 - 0) = \pi/2\) — 씬의 사분원과 일치합니다.

온전한 원 \([\alpha, \beta] = [0, 2\pi]\)이면 \(L = R \cdot 2\pi = 2\pi R\), 익숙한 둘레 공식입니다.`,
          en: String.raw`Specialize: with \(R = 1\) and \([\alpha, \beta] = [0, \pi/2]\), \(L = 1 \cdot (\pi/2 - 0) = \pi/2\) — exactly the quarter circle of the scene.

For the full circle, \([\alpha, \beta] = [0, 2\pi]\), \(L = R \cdot 2\pi = 2\pi R\), the familiar circumference.`,
        },
      },
    ],
  },
  {
    id: 'refinement-monotonicity',
    statement: {
      ko: String.raw`분할을 세분화하면 꺾은선 길이가 절대 줄어들지 않음을 완전히 증명하세요: \(P'\)이 \(P\)의 세분이면 \(L(P) \le L(P')\)입니다.

이로부터 모든 \(P\)에 대해 \(L(P) \le L := \sup_P L(P)\)이고, 이분 세분(dyadic refinement) 값들이 증가하면서 \(L\) 아래에 머묾을 보이세요.`,
      en: String.raw`Prove completely that refinement never shortens a polygonal length: if \(P'\) refines \(P\) then \(L(P) \le L(P')\).

Deduce that \(L(P) \le L := \sup_P L(P)\) for every \(P\), and that the values along dyadic refinements increase while staying below \(L\).`,
    },
    display: [
      String.raw`|\gamma(t_i) - \gamma(t_{i-1})| \le |\gamma(t_i) - \gamma(s)| + |\gamma(s) - \gamma(t_{i-1})|`,
      String.raw`P \subseteq P' \implies L(P) \le L(P') \le L = \sup_P L(P)`,
    ],
    preset: { curve: 'parabola', n: 4 },
    presetCaption: {
      ko: String.raw`포물선, \(n = 4\): 모델 값 \(L_4 \approx 1.474280\) \(< L_8 \approx 1.477778\) \(< L \approx 1.478943\) — 세분이 길이를 키우는 모습이 수치로도 보입니다.`,
      en: String.raw`The parabola at \(n = 4\): the model values \(L_4 \approx 1.474280\) \(< L_8 \approx 1.477778\) \(< L \approx 1.478943\) — refinement lengthening the path, visible numerically.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 점 하나만 삽입합니다. 구간 \([t_{i-1}, t_i]\) 안에 \(s\) (\(t_{i-1} < s < t_i\))를 넣으면, 그 구간의 기여도는 \(|\gamma(t_i) - \gamma(t_{i-1})|\)에서 \(|\gamma(t_i) - \gamma(s)| + |\gamma(s) - \gamma(t_{i-1})|\)로 바뀝니다. 다른 구간의 기여도는 그대로입니다.`,
          en: String.raw`First insert a single point. Putting \(s\) with \(t_{i-1} < s < t_i\) into the subinterval \([t_{i-1}, t_i]\) replaces that subinterval's contribution \(|\gamma(t_i) - \gamma(t_{i-1})|\) by \(|\gamma(t_i) - \gamma(s)| + |\gamma(s) - \gamma(t_{i-1})|\). Every other subinterval contributes exactly as before.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\mathbb{R}^2\)의 삼각부등식 \(|u + v| \le |u| + |v|\)를 \(u = \gamma(t_i) - \gamma(s)\), \(v = \gamma(s) - \gamma(t_{i-1})\)에 적용합니다. 그러면 \(u + v = \gamma(t_i) - \gamma(t_{i-1})\)이므로 \(|\gamma(t_i) - \gamma(t_{i-1})| \le |\gamma(t_i) - \gamma(s)| + |\gamma(s) - \gamma(t_{i-1})|\)입니다.

즉 새 기여도가 원래 기여도 이상이므로, 점 하나를 삽입해도 꺾은선 길이는 줄어들지 않습니다. 곧은 한 조각이 꺾인 두 조각보다 길 수 없기 때문입니다.`,
          en: String.raw`Apply the triangle inequality in \(\mathbb{R}^2\), \(|u + v| \le |u| + |v|\), with \(u = \gamma(t_i) - \gamma(s)\) and \(v = \gamma(s) - \gamma(t_{i-1})\). Then \(u + v = \gamma(t_i) - \gamma(t_{i-1})\), so \(|\gamma(t_i) - \gamma(t_{i-1})| \le |\gamma(t_i) - \gamma(s)| + |\gamma(s) - \gamma(t_{i-1})|\).

Hence the new contribution is at least the old one: inserting one point never shortens the polygonal length. A single straight piece cannot beat the two bent pieces replacing it.`,
        },
      },
      {
        text: {
          ko: String.raw`유한히 많은 점의 삽입에 대한 귀납법으로 일반화합니다. \(P'\)이 \(P\)의 세분이면 \(P' \setminus P\)의 점들을 하나씩 삽입해 \(P\)에서 \(P'\)에 도달할 수 있고, 각 단계마다 길이가 줄어들지 않으므로 \(L(P) \le L(P')\)입니다.`,
          en: String.raw`Induction on finitely many inserted points gives the general case. If \(P'\) refines \(P\), insert the points of \(P' \setminus P\) one at a time to pass from \(P\) to \(P'\); the length never decreases at any step, so \(L(P) \le L(P')\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 모든 분할 값은 상한 아래에 있습니다: 모든 \(P\)에 대해 \(L(P) \le L := \sup_P L(P)\)입니다 (상한의 정의 그 자체).

특히 균등 분할을 거듭 반으로 나누는 이분 세분에서는 삽입되는 점이 정확히 중간점들이므로 \(L_n \le L_{2n} \le L_{4n} \le \cdots \le L\)인 증가 수열이 됩니다. 씬의 \(L_4 \approx 1.474280 < L_8 \approx 1.477778\)이 이 단조성의 한 단면입니다.`,
          en: String.raw`Consequently every polygonal value lies below the supremum: \(L(P) \le L := \sup_P L(P)\) for all \(P\), by the very definition of a supremum.

In particular, along dyadic refinements of the uniform partition — each step inserting exactly the midpoints — the values increase: \(L_n \le L_{2n} \le L_{4n} \le \cdots \le L\). The scene's \(L_4 \approx 1.474280 < L_8 \approx 1.477778\) is one slice of this monotonicity.`,
        },
      },
    ],
  },
  {
    id: 'non-rectifiable-graph',
    statement: {
      ko: String.raw`\((0, 1]\)에서 \(f(x) = x\sin(1/x)\), \(f(0) = 0\)이라 두세요. \(f\)는 \([0, 1]\)에서 연속이지만, 그 그래프의 길이는 무한대임을 완전히 증명하세요 — 즉 이 그래프는 길이를 잴 수 없습니다 (not rectifiable).

점들 \(t_k = \frac{2}{\pi(2k+1)}\) (\(k = 0, 1, \dots, K\))를 쓰세요.`,
      en: String.raw`Let \(f(x) = x\sin(1/x)\) on \((0, 1]\) and \(f(0) = 0\). Prove completely that although \(f\) is continuous on \([0, 1]\), the length of its graph is infinite — the graph is not rectifiable.

Use the points \(t_k = \frac{2}{\pi(2k+1)}\) for \(k = 0, 1, \dots, K\).`,
    },
    display: [
      String.raw`t_k = \frac{2}{\pi(2k+1)}, \qquad f(t_k) = (-1)^k t_k`,
      String.raw`L \ge \sum_{k=0}^{K-1} (t_k + t_{k+1}) \ge \frac{1}{\pi}\sum_{k=0}^{K-1} \frac{1}{k+1} \to \infty`,
    ],
    preset: { curve: 'circle', n: 64 },
    presetCaption: {
      ko: String.raw`씬의 매끄러운 곡선들(원호와 포물선)은 모두 길이를 잴 수 있습니다 — 이 문제의 \(x\sin(1/x)\) 그래프와 대조해 보세요. 그 그래프는 연속인데도 길이가 무한대입니다.`,
      en: String.raw`The scene's smooth curves (the circular arc and the parabola) are all rectifiable — contrast them with the graph of \(x\sin(1/x)\) in this problem: continuous, yet of infinite length.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`점들을 계산합니다. \(t_k = \frac{2}{\pi(2k+1)}\)이면 \(1/t_k = \pi(2k+1)/2 = \pi k + \pi/2\)이므로 \(\sin(1/t_k) = \sin(\pi k + \pi/2) = (-1)^k\)이고, 따라서 \(f(t_k) = t_k \sin(1/t_k) = (-1)^k t_k\)입니다.

순서에 주의하세요: \(k\)가 커질수록 \(t_k\)는 작아지므로 \(t_K < t_{K-1} < \cdots < t_0 = 2/\pi < 1\)입니다. 분할에서는 이 점들을 증가하는 순서 \(t_K < \cdots < t_0\)로 넣고, 필요하면 \(0\)과 \(1\)도 더합니다 (점을 더하면 꺾은선 길이는 앞 문제에 의해 줄어들지 않습니다).`,
          en: String.raw`Evaluate at the points. With \(t_k = \frac{2}{\pi(2k+1)}\) we have \(1/t_k = \pi(2k+1)/2 = \pi k + \pi/2\), so \(\sin(1/t_k) = \sin(\pi k + \pi/2) = (-1)^k\), and hence \(f(t_k) = t_k \sin(1/t_k) = (-1)^k t_k\).

Mind the order: \(t_k\) decreases as \(k\) grows, so \(t_K < t_{K-1} < \cdots < t_0 = 2/\pi < 1\). In the partition, list these points in increasing order, \(t_K < \cdots < t_0\), adding \(0\) and \(1\) if needed (adding points never shortens a polygonal length, by the previous problem).`,
        },
      },
      {
        text: {
          ko: String.raw`연속된 두 값은 부호가 반대입니다: \(f(t_k) = (-1)^k t_k\)와 \(f(t_{k+1}) = (-1)^{k+1} t_{k+1}\)이므로 \(|f(t_k) - f(t_{k+1})| = t_k + t_{k+1} \ge t_k\)입니다.

\([t_{k+1}, t_k]\) 위의 꺾은선 조각의 길이는 \(\sqrt{(t_k - t_{k+1})^2 + (f(t_k) - f(t_{k+1}))^2} \ge |f(t_k) - f(t_{k+1})|\)입니다 — 수직 낙차가 그 조각 길이의 하한이기 때문입니다.`,
          en: String.raw`Consecutive values alternate in sign: \(f(t_k) = (-1)^k t_k\) and \(f(t_{k+1}) = (-1)^{k+1} t_{k+1}\), so \(|f(t_k) - f(t_{k+1})| = t_k + t_{k+1} \ge t_k\).

The polygonal segment over \([t_{k+1}, t_k]\) has length \(\sqrt{(t_k - t_{k+1})^2 + (f(t_k) - f(t_{k+1}))^2} \ge |f(t_k) - f(t_{k+1})|\) — the vertical drop alone is a lower bound for the segment.`,
        },
      },
      {
        text: {
          ko: String.raw`\(k = 0, \dots, K-1\)에 대해 합산하면 \(L \ge \sum_{k=0}^{K-1} (t_k + t_{k+1}) \ge \sum_{k=0}^{K-1} t_k = \sum_{k=0}^{K-1} \frac{2}{\pi(2k+1)}\)입니다.

여기서 \(\frac{2}{2k+1} \ge \frac{1}{k+1}\)입니다 — 양변을 비교하면 \(2k + 2 \ge 2k + 1\)이기 때문입니다. 따라서 \(L \ge \frac{1}{\pi}\sum_{k=0}^{K-1} \frac{1}{k+1} = \frac{1}{\pi} H_K\)입니다.`,
          en: String.raw`Summing over \(k = 0, \dots, K-1\) gives \(L \ge \sum_{k=0}^{K-1} (t_k + t_{k+1}) \ge \sum_{k=0}^{K-1} t_k = \sum_{k=0}^{K-1} \frac{2}{\pi(2k+1)}\).

Now \(\frac{2}{2k+1} \ge \frac{1}{k+1}\), because cross-multiplying gives \(2k + 2 \ge 2k + 1\). Hence \(L \ge \frac{1}{\pi}\sum_{k=0}^{K-1} \frac{1}{k+1} = \frac{1}{\pi} H_K\).`,
        },
      },
      {
        text: {
          ko: String.raw`조화합 \(H_K = \sum_{k=0}^{K-1} \frac{1}{k+1}\)은 \(K \to \infty\)일 때 발산합니다 (조화급수의 발산). \(K\)는 임의로 크게 잡을 수 있으므로, 어떤 유한한 수 \(M\)에 대해서도 \(L \ge \frac{1}{\pi} H_K > M\)인 분할이 존재합니다.

즉 \(L = \sup_P L(P) = +\infty\)입니다: 이 그래프는 길이를 잴 수 없습니다.

그런데 \(f\)는 \([0, 1]\)에서 연속입니다 — \((0, 1]\)에서는 연속함수들의 곱이고, \(0\)에서는 \(|f(x)| \le x \to 0 = f(0)\)이기 때문입니다. 연속성만으로는 유한한 길이가 보장되지 않습니다.`,
          en: String.raw`The harmonic sum \(H_K = \sum_{k=0}^{K-1} \frac{1}{k+1}\) diverges as \(K \to \infty\) (divergence of the harmonic series). Since \(K\) can be taken arbitrarily large, for every finite \(M\) there is a partition with \(L \ge \frac{1}{\pi} H_K > M\).

Thus \(L = \sup_P L(P) = +\infty\): the graph is not rectifiable.

Yet \(f\) is continuous on \([0, 1]\) — a product of continuous functions on \((0, 1]\), and at \(0\), \(|f(x)| \le x \to 0 = f(0)\). Continuity alone does not guarantee finite length.`,
        },
      },
    ],
  },
];
