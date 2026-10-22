import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the compact sets scene.
 * Imports nothing except types. Every number below was verified against
 * src/chapters/limits/models/compact.ts:
 *   closed cover, first 6 intervals: union = [-0.18, 1.18] which covers [0,1];
 *   halfopen, first 8 intervals: union = (1/8, 2), leaving (0, 1/8] uncovered;
 *   unbounded, first 8 intervals: union = (-1, 8), leaving [8, inf) uncovered;
 *   1/8 = 0.125 exactly; a_n = 1/n -> 0 and every subsequence does too.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'compact-sequential-equivalence',
    statement: {
      ko: String.raw`거리공간 \((X, d)\)와 \(K \subseteq X\)에 대해, \(K\)가 컴팩트인 것과 \(K\) 안의 모든 수열이 \(K\) 안의 점으로 수렴하는 부분수열을 갖는 것(순차 컴팩트)이 동치임을 증명하세요. 양방향을 모두 증명하세요.`,
      en: String.raw`For a metric space \((X, d)\) and \(K \subseteq X\), prove that \(K\) is compact if and only if every sequence in \(K\) has a subsequence converging to a point of \(K\) (sequentially compact). Prove both directions.`,
    },
    display: [
      String.raw`K \text{ compact} \iff \forall\,(x_n) \subset K\ \exists\,(x_{n_k}) \to x \in K`,
      String.raw`(\Rightarrow)\ \text{finite subcover of } B(x, r_x); \qquad (\Leftarrow)\ \text{Lebesgue number } \delta + \text{ finite } \delta\text{-net}`,
    ],
    preset: { set: 'closed', step: 6 },
    presetCaption: {
      ko: String.raw`\(k = 6\): 처음 6개 열린구간의 합집합 \([-0.18, 1.18]\)이 \([0,1]\)을 덮습니다 — \((\Rightarrow)\) 방향에서 뽑는 유한 부분커버의 그림입니다.`,
      en: String.raw`\(k = 6\): the union \([-0.18, 1.18]\) of the first 6 open intervals covers \([0,1]\) — the finite subcover extracted in the \((\Rightarrow)\) direction.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((\Rightarrow)\) \(K\)가 컴팩트라고 하고, \((x_n)\)은 \(K\) 안의 수열인데 \(K\) 안의 점으로 수렴하는 부분수열이 없다고 가정하자. 그러면 모든 \(x \in K\)에 대해 \(r_x > 0\)가 존재하여 열린공 \(B(x, r_x)\)가 \(x_n\)을 유한 개만 포함한다: 만약 어떤 \(x\)에서는 모든 \(r > 0\)에 대해 \(B(x, r)\)가 \(x_n\)을 무한히 많이 포함한다면, \(n_k\)를 증가하게 골라 \(d(x_{n_k}, x) < 1/k\)로 만들 수 있어 \((x_{n_k})\)가 \(x\)로 수렴하기 때문이다.`,
          en: String.raw`\((\Rightarrow)\) Suppose \(K\) is compact, and \((x_n)\) is a sequence in \(K\) with no subsequence converging to a point of \(K\). Then for every \(x \in K\) there is \(r_x > 0\) such that the open ball \(B(x, r_x)\) contains \(x_n\) for only finitely many \(n\): if instead some \(x\) had \(B(x, r)\) containing \(x_n\) for infinitely many \(n\) for every \(r > 0\), we could choose \(n_k\) increasing with \(d(x_{n_k}, x) < 1/k\), and then \((x_{n_k})\) would converge to \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Rightarrow)\) 공들 \(\{B(x, r_x)\}_{x \in K}\)는 \(K\)를 덮으므로, 컴팩트성에 의해 유한 부분커버 \(B(x_1, r_{x_1}), \dots, B(x_m, r_{x_m})\)가 존재한다. 각 공은 \(x_n\)을 유한 개만 포함하므로 그 유한 합집합도 첨수 \(n\)을 유한 개만 포함하는데, 이는 수열이 무한히 많은 첨수를 갖는다는 사실과 모순이다. 따라서 \(K\) 안의 모든 수열은 \(K\) 안의 점으로 수렴하는 부분수열을 갖는다.`,
          en: String.raw`\((\Rightarrow)\) The balls \(\{B(x, r_x)\}_{x \in K}\) cover \(K\), so compactness gives a finite subcover \(B(x_1, r_{x_1}), \dots, B(x_m, r_{x_m})\). Each ball contains \(x_n\) for only finitely many \(n\), so their finite union contains only finitely many indices \(n\) — a contradiction, since a sequence has infinitely many indices. Hence every sequence in \(K\) has a subsequence converging to a point of \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) \(K\)가 순차 컴팩트라고 하자 (\(K\)가 빈집합이면 양쪽 모두 자명하므로 비어 있지 않다고 둔다). 1단계 (르베그 수): \(K\)의 모든 열린 커버 \(\mathcal{U}\)에 대해 \(\delta > 0\)가 존재하여, 모든 \(x \in K\)에 대해 \(B(x, \delta)\)가 \(\mathcal{U}\)의 어느 한 원소 안에 들어간다. 모순으로 증명한다: 그렇지 않다면 각 \(n\)마다 \(B(x_n, 1/n)\)이 \(\mathcal{U}\)의 어떤 원소 안에도 들어가지 않는 \(x_n \in K\)를 고를 수 있다. 순차 컴팩트성으로 부분수열 \((x_{n_k})\)가 \(x \in K\)로 수렴한다. \(x \in U_0\)인 \(U_0 \in \mathcal{U}\)가 있고, \(U_0\)가 열려 있어 \(B(x, \rho) \subseteq U_0\)인 \(\rho > 0\)가 있다. \(k\)가 충분히 크면 \(d(x_{n_k}, x) < \rho/2\)이고 \(1/n_k < \rho/2\)이므로, 아래 삼각부등식 사슬이 \(B(x_{n_k}, 1/n_k) \subseteq U_0\)를 주어 \(x_{n_k}\)의 선택과 모순이다.`,
          en: String.raw`\((\Leftarrow)\) Suppose \(K\) is sequentially compact (if \(K\) is empty both sides are trivial, so assume \(K\) is nonempty). Step 1 (Lebesgue number): for every open cover \(\mathcal{U}\) of \(K\) there is \(\delta > 0\) such that every ball \(B(x, \delta)\), \(x \in K\), lies inside some member of \(\mathcal{U}\). Prove it by contradiction: otherwise, for each \(n\) pick \(x_n \in K\) with \(B(x_n, 1/n)\) inside no member of \(\mathcal{U}\). By sequential compactness a subsequence \((x_{n_k})\) converges to \(x \in K\). There is \(U_0 \in \mathcal{U}\) with \(x \in U_0\), and \(U_0\) open gives \(\rho > 0\) with \(B(x, \rho) \subseteq U_0\). For all large \(k\), \(d(x_{n_k}, x) < \rho/2\) and \(1/n_k < \rho/2\), so the triangle inequality chain below gives \(B(x_{n_k}, 1/n_k) \subseteq U_0\) — contradicting the choice of \(x_{n_k}\).`,
        },
        display: [
          String.raw`y \in B(x_{n_k}, 1/n_k) \Rightarrow d(y, x) \le d(y, x_{n_k}) + d(x_{n_k}, x) < \frac{1}{n_k} + \frac{\rho}{2} < \rho \Rightarrow B(x_{n_k}, 1/n_k) \subseteq B(x, \rho) \subseteq U_0`,
        ],
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) 2단계 (전유계성): \(\varepsilon > 0\)를 고정하자. 유한한 \(\varepsilon\)-그물이 존재하지 않는다고 가정하면, 귀납적으로 수열을 만들 수 있다: \(x_1 \in K\)를 고르고, \(x_{n+1} \in K\)를 모든 \(j \le n\)에 대해 \(d(x_{n+1}, x_j) \ge \varepsilon\)를 만족하게 고른다 — 유한 집합 \(\{x_1, \dots, x_n\}\)을 중심으로 한 \(\varepsilon\)-공들이 \(K\)를 덮지 못하므로 그 밖의 점을 고를 수 있기 때문이다. 이렇게 얻은 수열은 서로 다른 두 항 사이의 거리가 항상 \(\varepsilon\) 이상이라 코시 부분수열을 가질 수 없고, 따라서 수렴 부분수열도 가질 수 없어 순차 컴팩트성과 모순이다. 그러므로 유한히 많은 \(\varepsilon\)-공이 \(K\)를 덮는다.`,
          en: String.raw`\((\Leftarrow)\) Step 2 (total boundedness): fix \(\varepsilon > 0\). If no finite \(\varepsilon\)-net existed, we could pick a sequence inductively: pick \(x_1 \in K\), and pick \(x_{n+1} \in K\) with \(d(x_{n+1}, x_j) \ge \varepsilon\) for all \(j \le n\) — possible because the \(\varepsilon\)-balls around the finite set \(\{x_1, \dots, x_n\}\) do not cover \(K\), so a point outside them can be chosen. The resulting sequence has \(d(x_m, x_n) \ge \varepsilon\) for all \(m \ne n\), so it has no Cauchy subsequence, hence no convergent subsequence — contradicting sequential compactness. Therefore finitely many \(\varepsilon\)-balls cover \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) 3단계: 열린 커버 \(\mathcal{U}\)가 주어지면 1단계의 르베그 수 \(\delta > 0\)를 잡고, 2단계를 \(\varepsilon = \delta\)로 적용해 \(K\)를 유한히 많은 \(\delta\)-공으로 덮는다. 각 \(\delta\)-공은 1단계에 의해 \(\mathcal{U}\)의 어느 한 원소 안에 들어가므로, 그 유한히 많은 원소들이 \(K\)를 덮는다. 따라서 \(\mathcal{U}\)는 유한 부분커버를 가지며, \(\mathcal{U}\)가 임의였으므로 \(K\)는 컴팩트이다.`,
          en: String.raw`\((\Leftarrow)\) Step 3: given an open cover \(\mathcal{U}\), take its Lebesgue number \(\delta > 0\) from Step 1, and cover \(K\) by finitely many \(\delta\)-balls using Step 2 with \(\varepsilon = \delta\). By Step 1 each \(\delta\)-ball lies inside some member of \(\mathcal{U}\), so those finitely many members cover \(K\). Hence \(\mathcal{U}\) has a finite subcover, and since \(\mathcal{U}\) was arbitrary, \(K\) is compact.`,
        },
      },
    ],
  },
  {
    id: 'compact-halfopen-fails',
    statement: {
      ko: String.raw`\((0,1]\)이 컴팩트가 아님을 보이세요: 수열 \(a_n = 1/n\)은 \((0,1]\) 안에 극한점을 갖는 수렴 부분수열을 하나도 갖지 않습니다.`,
      en: String.raw`Show that \((0,1]\) is not compact: the sequence \(a_n = 1/n\) has no subsequence converging to a point of \((0,1]\).`,
    },
    display: [
      String.raw`a_n = \frac{1}{n} \to 0, \qquad 0 \notin (0,1]`,
      String.raw`\bigcup_{k=1}^{N} \left(\tfrac{1}{k}, 2\right) = \left(\tfrac{1}{N}, 2\right): \text{ the gap } \left(0, \tfrac{1}{N}\right] \text{ is never covered}`,
    ],
    preset: { set: 'halfopen', step: 8 },
    presetCaption: {
      ko: String.raw`\(k = 8\): 8개 구간을 모두 써도 \((0, 1/8]\)이 남습니다 — \(0\)이 빠져 있어 유한 부분커버가 없습니다.`,
      en: String.raw`\(k = 8\): even all 8 intervals leave \((0, 1/8]\) uncovered — with \(0\) missing, no finite subcover exists.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a_n = 1/n\)이라 하자. 모든 \(n\)에 대해 \(a_n \in (0,1]\)이고, \(a_n \to 0\)이다.`,
          en: String.raw`Put \(a_n = 1/n\). Then \(a_n \in (0,1]\) for every \(n\), and \(a_n \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`수렴수열의 부분수열은 같은 극한으로 수렴하므로, \((a_n)\)의 임의의 부분수열 \((a_{n_k})\)도 \(0\)으로 수렴한다.`,
          en: String.raw`A subsequence of a convergent sequence converges to the same limit, so every subsequence \((a_{n_k})\) of \((a_n)\) also converges to \(0\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(0 \notin (0,1]\)이므로, 어떤 부분수열도 \((0,1]\) 안의 점으로 수렴하지 않는다. 따라서 \((0,1]\)은 순차 컴팩트가 아니며, 컴팩트도 아니다.`,
          en: String.raw`But \(0 \notin (0,1]\), so no subsequence converges to a point of \((0,1]\). Hence \((0,1]\) is not sequentially compact, and not compact.`,
        },
      },
      {
        text: {
          ko: String.raw`열린 커버 그림도 같은 실패를 보여준다: 커버의 구간 \(U_k = \left(\frac{1}{k}, 2\right)\) (\(k = 1, \dots, 8\)) 중에서 처음 \(N\)개를 골라도 그 합집합은 \(\left(\frac{1}{N}, 2\right)\) 꼴이라 틈 \(\left(0, \frac{1}{N}\right]\)이 남는다 — \(k = 8\)에서는 \((0, 1/8]\)이다. 틈이 메워지려면 \(0\)이 있어야 하는데, \(0\)은 집합에 없다.`,
          en: String.raw`The open-cover picture shows the same failure: however many intervals we take from the cover — the first \(N\) of \(U_k = \left(\frac{1}{k}, 2\right)\) (\(k = 1, \dots, 8\)) — their union is always of the form \(\left(\frac{1}{N}, 2\right)\), leaving the gap \(\left(0, \frac{1}{N}\right]\) — at \(k = 8\) that gap is \((0, 1/8]\). Closing the gap would require the point \(0\), which is not in the set.`,
        },
      },
    ],
  },
  {
    id: 'compact-continuous-image',
    statement: {
      ko: String.raw`\(K\)가 컴팩트이고 \(f\)가 \(K\) 위에서 연속이면, 상 \(f(K)\)도 컴팩트임을 보이세요.`,
      en: String.raw`Prove that if \(K\) is compact and \(f\) is continuous on \(K\), then the image \(f(K)\) is compact.`,
    },
    display: [
      String.raw`f^{-1}(V_i) \text{ open in } K,\quad K \subseteq \bigcup_{j=1}^{n} f^{-1}(V_{i_j}) \ \Longrightarrow\ f(K) \subseteq \bigcup_{j=1}^{n} V_{i_j}`,
      String.raw`K = [0,1] \text{ compact} \Rightarrow f(K) \text{ compact } \Rightarrow \max f, \min f \text{ exist (EVT)}`,
    ],
    preset: { set: 'closed', step: 6 },
    presetCaption: {
      ko: String.raw`최댓값 정리의 엔진: \([0,1]\)이 컴팩트이므로 연속상 \(f([0,1])\)도 컴팩트 — 최댓값·최솟값이 존재합니다.`,
      en: String.raw`The engine of the Extreme Value Theorem: \([0,1]\) is compact, so the continuous image \(f([0,1])\) is compact — max and min exist.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`열린 덮개 정의를 씁니다 — 이 논증은 \(K\)가 거리공간이라는 가정이 필요 없어 일반적인 컴팩트 \(K\)에서 성립합니다. \(\{V_i\}_{i \in I}\)를 \(f(K)\)의 임의의 열린 덮개라 하자.`,
          en: String.raw`Use the open-cover definition — this argument needs no assumption that \(K\) is metric, so it works for a general compact \(K\). Let \(\{V_i\}_{i \in I}\) be an arbitrary open cover of \(f(K)\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(i\)에 대해 \(U_i = f^{-1}(V_i)\)는 \(f\)의 연속성에 의해 \(K\)에서 열려 있습니다. 또 \(x \in K\)이면 \(f(x) \in f(K)\)이므로 \(f(x) \in V_i\)인 \(i\)가 있어 \(x \in U_i\)입니다 — 즉 \(\{U_i\}\)는 \(K\)의 열린 덮개입니다.`,
          en: String.raw`For each \(i\), \(U_i = f^{-1}(V_i)\) is open in \(K\) by continuity of \(f\). And if \(x \in K\) then \(f(x) \in f(K)\), so \(f(x) \in V_i\) for some \(i\), i.e. \(x \in U_i\) — hence \(\{U_i\}\) is an open cover of \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(K\)가 컴팩트이므로 유한 부분덮개가 있습니다: \(K \subseteq U_{i_1} \cup \cdots \cup U_{i_n}\). 그러면 대응하는 \(V_{i_1}, \dots, V_{i_n}\)이 \(f(K)\)를 덮습니다 — \(y = f(x) \in f(K)\)이면 \(x \in U_{i_j}\)인 \(j\)가 있어 \(y = f(x) \in V_{i_j}\)이기 때문입니다.`,
          en: String.raw`Since \(K\) is compact, there is a finite subcover: \(K \subseteq U_{i_1} \cup \cdots \cup U_{i_n}\). Then the corresponding \(V_{i_1}, \dots, V_{i_n}\) cover \(f(K)\): if \(y = f(x) \in f(K)\), then \(x \in U_{i_j}\) for some \(j\), so \(y = f(x) \in V_{i_j}\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(f(K)\)의 모든 열린 덮개는 유한 부분덮개를 가지므로 \(f(K)\)는 컴팩트입니다. 이것이 최댓값 정리(evt 씬)의 엔진이다 — \([0,1]\) 위의 연속함수 \(f\)에 대해 \(f([0,1])\)이 컴팩트이므로 \(\mathbb{R}\)에서 닫혀 있고 유계이며, 상한·하한을 실제로 취한다.`,
          en: String.raw`Hence every open cover of \(f(K)\) has a finite subcover, so \(f(K)\) is compact. This is the engine of the Extreme Value Theorem (the evt scene) — for continuous \(f\) on \([0,1]\), the set \(f([0,1])\) is compact, hence closed and bounded in \(\mathbb{R}\), so its supremum and infimum are actually attained.`,
        },
      },
    ],
  },
];
