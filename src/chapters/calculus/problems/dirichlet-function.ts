import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Dirichlet function scene
 * (Tao, Analysis I, Section 11.7). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/dirichlet-function.test.ts): U(f, P_n) = 1 and L(f, P_n) = 0
 * for every n, and the exported dots are the reduced fractions p/q in
 * [0, 1] with q <= 12.
 */
export const dirichletFunctionProblems: readonly ProblemMeta[] = [
  {
    id: 'dirichlet-upper',
    statement: {
      ko: String.raw`\(f = \mathbf{1}_{\mathbb{Q}}\)를 \([0, 1]\) 위의 디리클레 함수라 하세요.

\([0, 1]\)의 모든 부분구간이 유리수를 포함함을 이용해, 임의의 분할 \(P\)에 대해 \(U(f, P) = 1\)임을 완전히 증명하세요.`,
      en: String.raw`Let \(f = \mathbf{1}_{\mathbb{Q}}\) be the Dirichlet function on \([0, 1]\).

Using that every subinterval of \([0, 1]\) contains a rational, prove completely that \(U(f, P) = 1\) for every partition \(P\).`,
    },
    display: [
      String.raw`U(f, P) = \sum_{i=1}^{n} M_i\,\Delta x_i = 1 \quad \forall P`,
    ],
    preset: { n: 8 },
    presetCaption: {
      ko: String.raw`\(n = 8\): 8개의 부분구간 모두에 위쪽 직사각형(연한 빨강, 높이 1)이 그려집니다 — \(U(f, P_8) = 8 \cdot \frac18 = 1\).`,
      en: String.raw`\(n = 8\): all 8 subintervals carry an upper rectangle (light red, height 1) — \(U(f, P_8) = 8 \cdot \frac18 = 1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 유리수의 조밀성을 보입니다: \(u < v\)이면 \((u, v)\) 안에 유리수가 있습니다. \(N \in \mathbb{N}\)을 \(\frac1N < v - u\)가 되게 잡고 (아르키메데스 성질), \(m = \lfloor Nu \rfloor + 1\)이라 두면, \(\frac{m}{N} - u = \frac{\lfloor Nu \rfloor + 1 - Nu}{N} \le \frac1N < v - u\)이므로 \(u < \frac{m}{N} < v\)입니다.`,
          en: String.raw`First, density of \(\mathbb{Q}\): if \(u < v\) then \((u, v)\) contains a rational. Pick \(N \in \mathbb{N}\) with \(\frac1N < v - u\) (Archimedean property) and set \(m = \lfloor Nu \rfloor + 1\); then \(\frac{m}{N} - u = \frac{\lfloor Nu \rfloor + 1 - Nu}{N} \le \frac1N < v - u\), so \(u < \frac{m}{N} < v\).`,
        },
      },
      {
        text: {
          ko: String.raw`분할 \(P = \{x_0 < x_1 < \cdots < x_n\}\)를 잡습니다.

각 부분구간 \([x_{i-1}, x_i]\)는 위에서 유리수 \(r_i\)를 포함하므로, \(M_i = \sup_{[x_{i-1}, x_i]} f \ge f(r_i) = 1\)입니다.

그런데 \(f \le 1\)이 항상 성립하므로 \(M_i = 1\)입니다.`,
          en: String.raw`Take a partition \(P = \{x_0 < x_1 < \cdots < x_n\}\).

Each subinterval \([x_{i-1}, x_i]\) contains a rational \(r_i\) by the above, so \(M_i = \sup_{[x_{i-1}, x_i]} f \ge f(r_i) = 1\).

But \(f \le 1\) always, so \(M_i = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(U(f, P) = \sum_{i=1}^{n} M_i\,\Delta x_i = \sum_{i=1}^{n} 1 \cdot (x_i - x_{i-1}) = x_n - x_0 = 1\)입니다. 분할을 어떻게 잡아도 위합은 항상 \(1\) — 빨간 점(유리수)이 모든 구간에 박혀 있기 때문입니다.`,
          en: String.raw`Hence \(U(f, P) = \sum_{i=1}^{n} M_i\,\Delta x_i = \sum_{i=1}^{n} 1 \cdot (x_i - x_{i-1}) = x_n - x_0 = 1\). However the partition is chosen, the upper sum is always \(1\) — the red dots (rationals) sit in every interval.`,
        },
      },
    ],
  },
  {
    id: 'dirichlet-lower',
    statement: {
      ko: String.raw`\([0, 1]\)의 모든 부분구간이 무리수를 포함함을 이용해, 임의의 분할 \(P\)에 대해 \(L(f, P) = 0\)임을 완전히 증명하세요.`,
      en: String.raw`Using that every subinterval of \([0, 1]\) contains an irrational, prove completely that \(L(f, P) = 0\) for every partition \(P\).`,
    },
    display: [
      String.raw`L(f, P) = \sum_{i=1}^{n} m_i\,\Delta x_i = 0 \quad \forall P`,
    ],
    preset: { n: 8 },
    presetCaption: {
      ko: String.raw`\(n = 8\): 아래쪽 막대(파랑)는 높이 0의 얇은 선으로만 그려집니다 — \(L(f, P_8) = 8 \cdot 0 = 0\).`,
      en: String.raw`\(n = 8\): the lower bars (blue) draw as thin zero-height lines — \(L(f, P_8) = 8 \cdot 0 = 0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`무리수도 조밀합니다: \(u < v\)이면 \((u, v)\) 안에 무리수가 있습니다. 유리수의 조밀성에 의해 \((u - \sqrt{2},\, v - \sqrt{2})\) 안에 유리수 \(q\)가 있고, 그러면 \(q + \sqrt{2}\)는 \((u, v)\) 안의 무리수입니다 (\(\sqrt{2}\)가 무리수이므로, 유리수 \(+\) 무리수는 무리수).`,
          en: String.raw`Irrationals are dense too: if \(u < v\) then \((u, v)\) contains an irrational. Density of \(\mathbb{Q}\) gives a rational \(q\) in \((u - \sqrt{2},\, v - \sqrt{2})\), and then \(q + \sqrt{2}\) is an irrational in \((u, v)\) (since \(\sqrt{2}\) is irrational, rational \(+\) irrational is irrational).`,
        },
      },
      {
        text: {
          ko: String.raw`분할 \(P = \{x_0 < \cdots < x_n\}\)에 대해, 각 부분구간 \([x_{i-1}, x_i]\)는 무리수 \(s_i\)를 포함하므로 \(m_i = \inf_{[x_{i-1}, x_i]} f \le f(s_i) = 0\)입니다. \(f \ge 0\)이므로 \(m_i = 0\)입니다.`,
          en: String.raw`For a partition \(P = \{x_0 < \cdots < x_n\}\), each subinterval \([x_{i-1}, x_i]\) contains an irrational \(s_i\), so \(m_i = \inf_{[x_{i-1}, x_i]} f \le f(s_i) = 0\). Since \(f \ge 0\), \(m_i = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(L(f, P) = \sum_{i=1}^{n} 0 \cdot \Delta x_i = 0\)입니다. 위 문제와 합치면 \(U(f, P) - L(f, P) = 1\)이 모든 분할에서 성립 — 틈이 절대 닫히지 않으므로 \(f\)는 리만 적분 불가능합니다.`,
          en: String.raw`Hence \(L(f, P) = \sum_{i=1}^{n} 0 \cdot \Delta x_i = 0\). Together with the previous problem, \(U(f, P) - L(f, P) = 1\) for every partition — the gap never closes, so \(f\) is not Riemann integrable.`,
        },
      },
    ],
  },
  {
    id: 'dirichlet-discontinuous',
    statement: {
      ko: String.raw`디리클레 함수 \(f = \mathbf{1}_{\mathbb{Q}}\)가 \([0, 1]\)의 모든 점에서 불연속임을 수열을 이용해 완전히 증명하세요.`,
      en: String.raw`Prove completely, using sequences, that the Dirichlet function \(f = \mathbf{1}_{\mathbb{Q}}\) is discontinuous at every point of \([0, 1]\).`,
    },
    display: [
      String.raw`r_k \to x,\ f(r_k) = 1 \qquad s_k \to x,\ f(s_k) = 0`,
    ],
    preset: { n: 8 },
    presetCaption: {
      ko: String.raw`\(n = 8\): 빨간 점(유리수, \(f = 1\))과 그 사이의 빈틈(무리수, \(f = 0\))이 모든 구간에 번갈아 나타납니다 — 어느 점에서도 "가까운 점들의 함숫값"이 하나로 모이지 않습니다.`,
      en: String.raw`\(n = 8\): red dots (rationals, \(f = 1\)) alternate with the gaps between them (irrationals, \(f = 0\)) in every interval — at no point do the nearby function values settle on one number.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`임의의 \(x \in [0, 1]\)을 잡습니다.

유리수와 무리수의 조밀성에 의해, 각 \(k \ge 1\)마다 구간 \((x - \tfrac1k,\, x + \tfrac1k) \cap [0, 1]\)에서 유리수 \(r_k\)와 무리수 \(s_k\)를 고를 수 있습니다.

\(|r_k - x| < \frac1k\), \(|s_k - x| < \frac1k\)이므로 \(r_k \to x\)이고 \(s_k \to x\)입니다.`,
          en: String.raw`Fix any \(x \in [0, 1]\).

By density of rationals and irrationals, for each \(k \ge 1\) we can pick a rational \(r_k\) and an irrational \(s_k\) in \((x - \tfrac1k,\, x + \tfrac1k) \cap [0, 1]\).

Since \(|r_k - x| < \frac1k\) and \(|s_k - x| < \frac1k\), we have \(r_k \to x\) and \(s_k \to x\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(f(r_k) = 1\)이므로 \(f(r_k) \to 1\)이고, \(f(s_k) = 0\)이므로 \(f(s_k) \to 0\)입니다. \(f\)가 \(x\)에서 연속이라면 수열 연속성에 의해 두 극한이 모두 \(f(x)\)와 같아야 하는데, \(1 \ne 0\)이므로 모순입니다.`,
          en: String.raw`But \(f(r_k) = 1\), so \(f(r_k) \to 1\), and \(f(s_k) = 0\), so \(f(s_k) \to 0\). If \(f\) were continuous at \(x\), sequential continuity would force both limits to equal \(f(x)\) — impossible since \(1 \ne 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(f\)는 \([0, 1]\)의 모든 점에서 불연속입니다. "너무 불연속이라" 리만 적분이 안 되는 셈입니다 — 르베그 적분은 유리수 집합의 측도가 \(0\)임을 이용해 \(\int f = 0\)을 구합니다 (르베그 장면 참조).`,
          en: String.raw`Hence \(f\) is discontinuous at every point of \([0, 1]\) — "too discontinuous" for the Riemann integral. The Lebesgue integral instead uses that the rationals have measure \(0\) to get \(\int f = 0\) (see the Lebesgue scene).`,
        },
      },
    ],
  },
];
