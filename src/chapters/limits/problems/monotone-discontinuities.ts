import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the monotone-discontinuities scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/monotone-discontinuities.test.ts):
 *   scene f(x) = x + sum_{k: q_k < x} 2^{-k}, terms = 24:
 *   f(1/2) = 0.8373474478721619, jump at q_1 = 1/2 is 2^{-1} = 1/2,
 *   f(1/2+) = 1.337347447872162
 *   f(1) - f(0) = 1.999999940395355; bound for n = 4 is 7.999999761581421
 *   big jumps for n = 4: exactly k = 1 (size 1/2 > 1/4); 2^{-2} = 1/4 is not > 1/4
 *   g(x) = sum_{k: q_k < x} 2^{-k}: g(2/3) = 0.841285169124603,
 *   jump at q_3 = 2/3 is 2^{-3} = 1/8 = 0.125, g(2/3+) = 0.966285169124603
 */
export const monotoneDiscontinuitiesProblems: readonly ProblemMeta[] = [
  {
    id: 'monotone-one-sided-limits',
    statement: {
      ko: String.raw`단조증가함수 \(f\)가 \([a, b]\)에서 정의될 때, 각 점 \(x \in (a, b]\)에서 왼쪽 극한 \(f(x-) = \sup\{f(t) : t < x\}\)가 존재하고, 각 점 \(x \in [a, b)\)에서 오른쪽 극한 \(f(x+) = \inf\{f(t) : t > x\}\)가 존재함을 보이세요.`,
      en: String.raw`Let \(f\) be increasing on \([a, b]\). Show that the left limit \(f(x-) = \sup\{f(t) : t < x\}\) exists at every \(x \in (a, b]\), and the right limit \(f(x+) = \inf\{f(t) : t > x\}\) exists at every \(x \in [a, b)\).`,
    },
    display: [
      String.raw`f(x-) = \sup\{f(t) : t < x\}, \qquad f(x+) = \inf\{f(t) : t > x\}`,
      String.raw`f(x-) \le f(x) \le f(x+) \quad \text{(left limit is left-continuous)}`,
    ],
    preset: { terms: 24, n: 4 },
    presetCaption: {
      ko: String.raw`\(x = q_1 = \frac{1}{2}\)에서 \(f(\frac{1}{2}-) = f(\frac{1}{2}) \approx 0.8373474478721619\), 점프 \(f(\frac{1}{2}+) - f(\frac{1}{2}) = 2^{-1} = \frac{1}{2}\) — 왼쪽 극한은 값과 일치하고 오른쪽에서만 올라갑니다.`,
      en: String.raw`At \(x = q_1 = \frac{1}{2}\): \(f(\frac{1}{2}-) = f(\frac{1}{2}) \approx 0.8373474478721619\), and the jump \(f(\frac{1}{2}+) - f(\frac{1}{2}) = 2^{-1} = \frac{1}{2}\) — the left limit equals the value; the rise is only from the right.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(t < x\)인 모든 \(t\)에 대해 단조성에 의해 \(f(t) \le f(x)\)입니다. 따라서 집합 \(\{f(t) : t < x\}\)는 \(f(x)\)를 상계로 갖는 공집합이 아닌 유계 집합이므로, 완비성에 의해 상한 \(f(x-) := \sup\{f(t) : t < x\}\)이 실수로서 존재합니다.`,
          en: String.raw`For every \(t < x\), monotonicity gives \(f(t) \le f(x)\). So \(\{f(t) : t < x\}\) is a nonempty bounded set with upper bound \(f(x)\), and by completeness its supremum \(f(x-) := \sup\{f(t) : t < x\}\) exists as a real number.`,
        },
      },
      {
        text: {
          ko: String.raw`이 상한이 실제로 왼쪽 극한임을 확인합니다. \(\varepsilon > 0\)에 대해 상한의 정의에 의해 \(f(t_0) > f(x-) - \varepsilon\)인 \(t_0 < x\)가 존재합니다. 단조성에 의해 \(t_0 < t < x\)이면 \(f(t_0) \le f(t) \le f(x-) < f(x-) + \varepsilon\)이므로 \(|f(t) - f(x-)| < \varepsilon\) — 즉 \(\lim_{t \uparrow x} f(t) = f(x-)\)입니다.`,
          en: String.raw`This supremum is indeed the left limit. Given \(\varepsilon > 0\), the definition of the supremum yields \(t_0 < x\) with \(f(t_0) > f(x-) - \varepsilon\). By monotonicity, \(t_0 < t < x\) implies \(f(t_0) \le f(t) \le f(x-) < f(x-) + \varepsilon\), so \(|f(t) - f(x-)| < \varepsilon\) — i.e. \(\lim_{t \uparrow x} f(t) = f(x-)\).`,
        },
      },
      {
        text: {
          ko: String.raw`오른쪽도 대칭적입니다: \(\{f(t) : t > x\}\)는 \(f(x)\)를 하계로 갖는 유계 집합이므로 하한 \(f(x+) := \inf\{f(t) : t > x\}\)이 존재하고, 같은 \(\varepsilon\) 논증으로 \(\lim_{t \downarrow x} f(t) = f(x+)\)입니다. 따라서 단조함수는 모든 점에서 양쪽 극한을 갖습니다.`,
          en: String.raw`The right side is symmetric: \(\{f(t) : t > x\}\) is bounded with lower bound \(f(x)\), so its infimum \(f(x+) := \inf\{f(t) : t > x\}\) exists, and the same \(\varepsilon\) argument gives \(\lim_{t \downarrow x} f(t) = f(x+)\). Hence a monotone function has both one-sided limits at every point.`,
        },
      },
      {
        text: {
          ko: String.raw`덧붙이면 \(f(x-) \le f(x) \le f(x+)\)이 항상 성립합니다: \(t < x\)인 모든 \(t\)에 대해 \(f(t) \le f(x)\)이므로 상한을 취하면 \(f(x-) \le f(x)\)이고, 오른쪽도 마찬가지입니다. 이 예에서는 \(x = q_1 = \frac{1}{2}\)에서 왼쪽 등호가 성립합니다 (\(f(\frac{1}{2}-) = f(\frac{1}{2}) \approx 0.8373474478721619\)), 오른쪽은 \(\frac{1}{2}\)만큼 점프합니다.`,
          en: String.raw`Moreover \(f(x-) \le f(x) \le f(x+)\) always holds: taking the supremum of \(f(t) \le f(x)\) over \(t < x\) gives \(f(x-) \le f(x)\), and similarly on the right. In the example, at \(x = q_1 = \frac{1}{2}\) the left equality holds (\(f(\frac{1}{2}-) = f(\frac{1}{2}) \approx 0.8373474478721619\)) while the right jumps by \(\frac{1}{2}\).`,
        },
      },
    ],
  },
  {
    id: 'monotone-countable',
    statement: {
      ko: String.raw`\([a, b]\)에서 단조인 \(f\)의 불연속점은 최대 가산개임을 보이세요. 힌트: 점프 \(j(x) = f(x+) - f(x-) \ge 0\)의 합이 \(f(b) - f(a)\)를 넘지 않음을 보이고, \(\{x : j(x) > 1/n\}\)이 최대 \(n(f(b) - f(a))\)개의 점을 갖는 유한집합임을 이용하세요.`,
      en: String.raw`Show that a monotone function \(f\) on \([a, b]\) has at most countably many discontinuities. Hint: show the jumps \(j(x) = f(x+) - f(x-) \ge 0\) sum to at most \(f(b) - f(a)\), and that \(\{x : j(x) > 1/n\}\) is finite with at most \(n(f(b) - f(a))\) points.`,
    },
    display: [
      String.raw`j(x) := f(x+) - f(x-) \ge 0, \qquad \sum_{x} j(x) \le f(b) - f(a)`,
      String.raw`D = \bigcup_{n=1}^{\infty} \left\{x : j(x) > \frac{1}{n}\right\} \quad \text{countable union of finite sets}`,
    ],
    preset: { terms: 24, n: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\) (임계값 \(\frac{1}{4}\)): 점프가 \(\frac{1}{4}\)을 초과하는 점은 \(k = 1\) (크기 \(\frac{1}{2}\)) 하나뿐 — 상한 \(4(f(1) - f(0)) \approx 7.999999761581421\) 이하입니다 (\(2^{-2} = \frac{1}{4}\)은 \(>\frac{1}{4}\)이 아닙니다).`,
      en: String.raw`\(n = 4\) (threshold \(\frac{1}{4}\)): exactly one jump exceeds \(\frac{1}{4}\) — \(k = 1\) (size \(\frac{1}{2}\)) — within the bound \(4(f(1) - f(0)) \approx 7.999999761581421\) (\(2^{-2} = \frac{1}{4}\) is not \(> \frac{1}{4}\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 불연속점은 점프에서만 생깁니다. 예제 1에서 \(f(x-)\)와 \(f(x+)\)가 항상 존재하므로, \(\lim_{t \to x} f(t) = f(x)\)가 실패하려면 \(f(x-) < f(x+)\)이어야 합니다 — 제거가능 불연속점도, 진동 불연속점도 불가능하고 오직 점프 \(j(x) = f(x+) - f(x-) > 0\)만 남습니다.`,
          en: String.raw`First, discontinuities can only be jumps. By problem 1, \(f(x-)\) and \(f(x+)\) always exist, so failure of \(\lim_{t \to x} f(t) = f(x)\) forces \(f(x-) < f(x+)\) — neither removable nor oscillatory discontinuities are possible; only a jump \(j(x) = f(x+) - f(x-) > 0\) remains.`,
        },
      },
      {
        text: {
          ko: String.raw`유한 개의 점 \(x_1 < \cdots < x_m\)을 봅니다. \(x_i < x_{i+1}\)이면 그 사이의 임의의 \(t\) (\(x_i < t < x_{i+1}\))에 대해 단조성으로 \(f(x_i+) = \inf_{s > x_i} f(s) \le f(t) \le \sup_{s < x_{i+1}} f(s) = f(x_{i+1}-)\)입니다. 따라서 \(f(x_i+) \le f(x_{i+1}-)\) — 점프 구간 \([f(x_i-), f(x_i+)]\)와 \([f(x_{i+1}-), f(x_{i+1}+)]\)의 내부는 서로 겹치지 않습니다 (끝점을 공유할 수는 있음). 모든 점프 구간은 \([f(a+), f(b-)] \subseteq [f(a), f(b)]\) 안에 들어 있으므로, \(\sum_{i=1}^{m} j(x_i) = \sum_{i=1}^{m} \big(f(x_i+) - f(x_i-)\big) \le f(b-) - f(a+) \le f(b) - f(a)\)입니다. \(m\)이 임의이므로 전체 점프의 합도 \(\sum_x j(x) \le f(b) - f(a)\)를 만족합니다.`,
          en: String.raw`Take finitely many points \(x_1 < \cdots < x_m\). If \(x_i < x_{i+1}\) then for any \(t\) with \(x_i < t < x_{i+1}\), monotonicity gives \(f(x_i+) = \inf_{s > x_i} f(s) \le f(t) \le \sup_{s < x_{i+1}} f(s) = f(x_{i+1}-)\). Hence \(f(x_i+) \le f(x_{i+1}-)\) — the interiors of the jump intervals \([f(x_i-), f(x_i+)]\) and \([f(x_{i+1}-), f(x_{i+1}+)]\) are pairwise disjoint (they may share an endpoint). Every jump interval lies in \([f(a+), f(b-)] \subseteq [f(a), f(b)]\), so \(\sum_{i=1}^{m} j(x_i) = \sum_{i=1}^{m} \big(f(x_i+) - f(x_i-)\big) \le f(b-) - f(a+) \le f(b) - f(a)\). Since \(m\) is arbitrary, the sum over all jumps satisfies \(\sum_x j(x) \le f(b) - f(a)\).`,
        },
      },
      {
        text: {
          ko: String.raw`고정된 \(n\)에 대해 \(j(x) > \frac{1}{n}\)인 점이 \(m_n\)개 있다면 \(\sum j(x) \ge m_n \cdot \frac{1}{n}\)이므로 \(m_n \le n(f(b) - f(a))\) — 유한집합입니다. 그런데 불연속점 집합 \(D = \{x : j(x) > 0\} = \bigcup_{n=1}^{\infty} \{x : j(x) > \frac{1}{n}\}\)은 유한집합들의 가산합집합이므로 최대 가산개입니다.`,
          en: String.raw`Fix \(n\): if \(j(x) > \frac{1}{n}\) at \(m_n\) points, then \(\sum j(x) \ge m_n \cdot \frac{1}{n}\), so \(m_n \le n(f(b) - f(a))\) — a finite set. But the discontinuity set \(D = \{x : j(x) > 0\} = \bigcup_{n=1}^{\infty} \{x : j(x) > \frac{1}{n}\}\) is a countable union of finite sets, hence at most countable.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(terms = 24\), \(n = 4\)): 점프는 \(2^{-k}\) (\(k = 1, \dots, 24\))이며, \(\frac{1}{4}\)을 초과하는 것은 \(2^{-1} = \frac{1}{2}\) 하나뿐입니다 (\(2^{-2} = \frac{1}{4}\)은 엄격한 초과가 아닙니다). 상한 \(4(f(1) - f(0)) \approx 7.999999761581421\)와 비교하면 \(1 \le 7.999\ldots\) — 정리가 예언한 대로입니다.`,
          en: String.raw`Numerical check (\(terms = 24\), \(n = 4\)): the jumps are \(2^{-k}\) (\(k = 1, \dots, 24\)), and the only one exceeding \(\frac{1}{4}\) is \(2^{-1} = \frac{1}{2}\) (\(2^{-2} = \frac{1}{4}\) is not a strict exceedance). Against the bound \(4(f(1) - f(0)) \approx 7.999999761581421\), we get \(1 \le 7.999\ldots\) — exactly as the theorem predicts.`,
        },
      },
    ],
  },
  {
    id: 'monotone-rational-jumps',
    statement: {
      ko: String.raw`\((q_k)\)가 \((0, 1)\)의 유리수 열거이고, \(g(x) = \sum_{k : q_k < x} 2^{-k}\)라 하자. \(g\)가 \([0, 1]\)에서 단조증가이며 유리수에서 정확히 불연속이고 무리수에서는 연속임을 보이세요.`,
      en: String.raw`Let \((q_k)\) enumerate the rationals of \((0, 1)\) and \(g(x) = \sum_{k : q_k < x} 2^{-k}\). Show that \(g\) is increasing on \([0, 1]\), discontinuous exactly at the rationals, and continuous at every irrational.`,
    },
    display: [
      String.raw`g(x) = \sum_{k : q_k < x} 2^{-k}, \qquad g(q_m+) - g(q_m) = 2^{-m}`,
      String.raw`\text{if } x \notin \mathbb{Q} \text{ and } N \text{ large, } \sum_{k > N} 2^{-k} < \varepsilon \text{ and } \delta = \operatorname{dist}(x, \{q_1, \dots, q_N\}) > 0`,
    ],
    preset: { terms: 24, n: 4 },
    presetCaption: {
      ko: String.raw`\(x = q_3 = \frac{2}{3}\)에서 \(g(\frac{2}{3}) \approx 0.841285169124603\), 점프 \(2^{-3} = \frac{1}{8} = 0.125\)만큼 위로 — \(g(\frac{2}{3}+) \approx 0.966285169124603\).`,
      en: String.raw`At \(x = q_3 = \frac{2}{3}\): \(g(\frac{2}{3}) \approx 0.841285169124603\), jumping up by \(2^{-3} = \frac{1}{8} = 0.125\) — \(g(\frac{2}{3}+) \approx 0.966285169124603\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`급수는 항상 수렴합니다: \(0 \le \sum_{k : q_k < x} 2^{-k} \le \sum_{k=1}^{\infty} 2^{-k} = 1\)이므로 \(g(x)\)가 잘 정의되고 \([0, 1]\)에 값을 갖습니다. \(x < y\)이면 \(\{k : q_k < x\} \subseteq \{k : q_k < y\}\)이므로 합의 항이 더 늘어나 \(g(x) \le g(y)\) — \(g\)는 단조증가입니다.`,
          en: String.raw`The series always converges: \(0 \le \sum_{k : q_k < x} 2^{-k} \le \sum_{k=1}^{\infty} 2^{-k} = 1\), so \(g(x)\) is well defined with values in \([0, 1]\). If \(x < y\) then \(\{k : q_k < x\} \subseteq \{k : q_k < y\}\), so the sum only gains terms and \(g(x) \le g(y)\) — \(g\) is increasing.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x = q_m\)이라 합시다. \(g(q_m)\)의 합에는 \(k = m\)이 들어가지 않지만 (조건 \(q_k < q_m\)은 \(q_m\) 자신을 제외), \(t \downarrow q_m\)이면 결국 모든 \(t > q_m\)에 대해 \(q_m < t\)가 되어 \(2^{-m}\)이 추가됩니다. 따라서 \(g(q_m+) = g(q_m) + 2^{-m}\) — \(g\)는 \(q_m\)에서 \(\frac{1}{2^m}\)만큼 점프하므로 불연속입니다.`,
          en: String.raw`Let \(x = q_m\). The sum defining \(g(q_m)\) excludes \(k = m\) (the condition \(q_k < q_m\) leaves out \(q_m\) itself), but as \(t \downarrow q_m\), eventually \(q_m < t\) for all \(t > q_m\), adding \(2^{-m}\). Hence \(g(q_m+) = g(q_m) + 2^{-m}\) — \(g\) jumps by \(\frac{1}{2^m}\) at \(q_m\), so it is discontinuous there.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(x\)가 무리수라 합시다. \(\varepsilon > 0\)에 대해 \(\sum_{k > N} 2^{-k} < \varepsilon\)인 \(N\)을 택합니다 (꼬리가 0으로 가므로 가능). \(x\)가 무리수이므로 \(\delta := \min_{1 \le k \le N} |x - q_k| > 0\)입니다. \(|t - x| < \delta\)이면 \(q_1, \dots, q_N\) 중 \(x\)와 \(t\) 사이에 끼는 것이 없어, \(g(t) - g(x)\)의 차이는 꼬리 \(\sum_{k > N} 2^{-k}\) 이하 — 즉 \(|g(t) - g(x)| < \varepsilon\)이므로 \(g\)는 \(x\)에서 연속입니다.`,
          en: String.raw`Now let \(x\) be irrational. Given \(\varepsilon > 0\), pick \(N\) with \(\sum_{k > N} 2^{-k} < \varepsilon\) (possible since the tail tends to 0). Since \(x\) is irrational, \(\delta := \min_{1 \le k \le N} |x - q_k| > 0\). If \(|t - x| < \delta\), none of \(q_1, \dots, q_N\) lies strictly between \(x\) and \(t\), so the difference \(g(t) - g(x)\) comes only from the tail: \(|g(t) - g(x)| < \varepsilon\). Hence \(g\) is continuous at \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(g\)는 모든 유리수에서 불연속이고 모든 무리수에서 연속입니다 — 단조함수가 조밀한 가산집합에서 불연속일 수 있는 (그리고 예제 2에 의해 조밀한 집합보다 더 많이는 안 되는) 구체적 예입니다. 수치적으로 \(q_3 = \frac{2}{3}\)에서 \(g(\frac{2}{3}) \approx 0.841285169124603\), \(g(\frac{2}{3}+) \approx 0.966285169124603\) — 차이 \(0.125 = 2^{-3}\)이 캡션의 점프와 일치합니다.`,
          en: String.raw`So \(g\) is discontinuous at every rational and continuous at every irrational — a concrete example of a monotone function discontinuous on a dense countable set (and, by problem 2, on no larger a set than dense). Numerically, at \(q_3 = \frac{2}{3}\): \(g(\frac{2}{3}) \approx 0.841285169124603\), \(g(\frac{2}{3}+) \approx 0.966285169124603\) — the gap \(0.125 = 2^{-3}\) matches the caption's jump.`,
        },
      },
    ],
  },
];
