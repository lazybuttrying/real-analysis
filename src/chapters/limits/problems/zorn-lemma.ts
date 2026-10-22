import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Zorn's lemma scene
 * (Tao, Analysis I, Lemma 8.5.15), on the divisors-of-12 poset.
 * Imports nothing except types.
 * Every number below was verified against the model (tests/zorn-lemma.test.ts):
 *   upperBounds([1, 2, 4, 12]) = [12];
 *   upperBounds([1, 2]) = [2, 4, 6, 12];
 *   upperBounds([1, 3]) = [3, 6, 12];
 *   upperBounds([1]) = [1, 2, 3, 4, 6, 12];
 *   maximalElements() = [12].
 */
export const zornLemmaProblems: readonly ProblemMeta[] = [
  {
    id: 'zorn-finite',
    statement: {
      ko: String.raw`비어 있지 않은 유한 부분순서집합은 항상 극대원소를 가짐을 증명하세요 (Zorn의 보조정리의 유한 버전 — 선택 공리 불필요).`,
      en: String.raw`Prove that every nonempty finite poset has a maximal element (the finite version of Zorn's lemma — no choice axiom needed).`,
    },
    display: [
      String.raw`P \ne \varnothing\ \text{finite poset} \ \Rightarrow\ \exists\, m \in P\ \text{maximal}`,
    ],
    preset: { chain: 0 },
    presetCaption: {
      ko: String.raw`사슬 \(C_0 = \{1, 2, 4, 12\}\)가 강조 표시된 약수 poset: 이 유한 poset에서는 아래 증명의 "계속 올라가기"가 12에서 멈춥니다.`,
      en: String.raw`The divisor poset with the chain \(C_0 = \{1, 2, 4, 12\}\) highlighted: in this finite poset the proof's "keep climbing" stops at 12.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(P\)가 비어 있지 않은 유한 부분순서집합이라 하자. 임의의 \(x_0 \in P\)를 잡습니다. \(x_0\)가 극대원소이면 증명 끝입니다.

아니면 \(x_0 < x_1\)인 \(x_1 \in P\)가 존재합니다 (\(x_0\)가 극대가 아니라는 것은 정확히 이런 \(x_1\)이 존재한다는 뜻).`,
          en: String.raw`Let \(P\) be a nonempty finite poset. Pick any \(x_0 \in P\). If \(x_0\) is maximal, we are done.

Otherwise some \(x_1 \in P\) with \(x_0 < x_1\) exists (that is exactly what "\(x_0\) is not maximal" means).`,
        },
      },
      {
        text: {
          ko: String.raw`이 과정을 반복합니다: \(x_k\)가 극대원소가 아니면 \(x_k < x_{k+1}\)인 \(x_{k+1}\)을 잡습니다. 이렇게 얻는 수열 \(x_0 < x_1 < x_2 < \cdots\)의 항들은 모두 다릅니다 (순서 관계의 반대칭성·추이성에 의해 \(x_i < x_j\), \(i < j\)).

그런데 \(P\)는 유한하므로 서로 다른 원소를 무한히 뽑을 수 없습니다.`,
          en: String.raw`Repeat: if \(x_k\) is not maximal, pick \(x_{k+1}\) with \(x_k < x_{k+1}\). The terms of \(x_0 < x_1 < x_2 < \cdots\) are all distinct (antisymmetry and transitivity give \(x_i < x_j\) for \(i < j\)).

But \(P\) is finite, so infinitely many distinct elements cannot be drawn.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 이 과정은 반드시 멈춥니다 — 어떤 \(x_k\)가 극대원소입니다. 유한성 때문에 "무한히 올라가기"가 불가능하다는 것이 증명의 전부이며, 무한 poset에서는 이 논증이 깨지고 Zorn의 보조정리(와 선택 공리)가 필요해집니다.`,
          en: String.raw`Hence the process must stop — some \(x_k\) is maximal. Finiteness making "climbing forever" impossible is the entire proof; for infinite posets this argument breaks, and Zorn's lemma (with the axiom of choice) is needed.`,
        },
      },
    ],
  },
  {
    id: 'zorn-divisors12',
    statement: {
      ko: String.raw`약분가능성(divisibility)으로 순서가 정해진 \(P = \{1, 2, 3, 4, 6, 12\}\)에서, 모든 사슬이 \(P\) 안에 상한을 가짐을 직접 확인하고, 모든 극대원소를 찾으세요.`,
      en: String.raw`In \(P = \{1, 2, 3, 4, 6, 12\}\) ordered by divisibility, verify directly that every chain has an upper bound in \(P\), and find all maximal elements.`,
    },
    display: [
      String.raw`C\ \text{chain} \ \Rightarrow\ \max C\ \text{exists and bounds}\ C, \qquad \text{maximal}(P) = \{12\}`,
    ],
    preset: { chain: 1 },
    presetCaption: {
      ko: String.raw`사슬 \(C_1 = \{1, 2, 6, 12\}\)가 강조 표시됨: 이 사슬의 상한은 \(\{12\}\) 하나뿐이고, 12는 poset 전체의 유일한 극대원소입니다.`,
      en: String.raw`The chain \(C_1 = \{1, 2, 6, 12\}\) is highlighted: its only upper bound is \(\{12\}\), and 12 is the unique maximal element of the whole poset.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(C \subseteq P\)를 임의의 사슬이라 하자. 빈 사슬 경우: \(C = \varnothing\)이면 \(\max C\)가 존재하지 않지만, \(P\)의 임의의 원소 (예: \(1\))가 공허하게(vacuously) \(C\)의 상한이 됩니다 — 나눌 원소가 없기 때문입니다. 이하 \(C \ne \varnothing\)라 둡니다.

\(P\)는 원소가 6개뿐이므로 \(C\)도 유한하고, 비어 있지 않은 유한 사슬은 최대원소 \(\max C\)를 가집니다 (유한집합의 전순서 부분집합). \(c \in C\)인 모든 \(c\)에 대해 \(c \mid \max C\)이므로, \(\max C \in P\)는 \(C\)의 상한입니다. 즉 모든 사슬 (빈 사슬 포함)이 \(P\) 안에 상한을 가집니다.`,
          en: String.raw`Let \(C \subseteq P\) be any chain. Empty-chain case: if \(C = \varnothing\), \(\max C\) does not exist, but any element of \(P\) (e.g. \(1\)) is vacuously an upper bound of \(C\) — there is no element to divide. Assume henceforth \(C \ne \varnothing\).

Since \(P\) has only 6 elements, \(C\) is finite, and a nonempty finite chain has a greatest element \(\max C\) (a finite totally ordered subset). Every \(c \in C\) satisfies \(c \mid \max C\), so \(\max C \in P\) is an upper bound of \(C\). Every chain (including the empty one) has an upper bound in \(P\).`,
        },
      },
      {
        text: {
          ko: String.raw`구체적으로 세 극대사슬에 대해: \(C_0 = \{1,2,4,12\}\)의 상한은 \(\{12\}\), \(C_1 = \{1,2,6,12\}\)의 상한은 \(\{12\}\), \(C_2 = \{1,3,6,12\}\)의 상한은 \(\{12\}\)입니다 (12를 포함하는 사슬의 상한은 12의 배수여야 하고, \(P\) 안의 12의 배수는 12뿐). 짧은 사슬도 마찬가지입니다: 예를 들어 \(\{1, 2\}\)의 상한은 \(\{2, 4, 6, 12\}\), \(\{1, 3\}\)의 상한은 \(\{3, 6, 12\}\)입니다.`,
          en: String.raw`Concretely, for the three maximal chains: \(C_0 = \{1,2,4,12\}\) has upper bounds \(\{12\}\), \(C_1 = \{1,2,6,12\}\) has \(\{12\}\), \(C_2 = \{1,3,6,12\}\) has \(\{12\}\) (an upper bound of a chain containing 12 must be a multiple of 12, and the only multiple of 12 in \(P\) is 12). Shorter chains work the same way: e.g. \(\{1, 2\}\) has upper bounds \(\{2, 4, 6, 12\}\) and \(\{1, 3\}\) has \(\{3, 6, 12\}\).`,
        },
      },
      {
        text: {
          ko: String.raw`극대원소: \(x \in P\)가 극대원소이려면 \(x\)를 진짜로 나누는(약분가능성에서 \(x\)보다 큰) \(P\)의 원소가 없어야 합니다. \(1 \mid 2\), \(2 \mid 4\), \(3 \mid 6\), \(4 \mid 12\), \(6 \mid 12\)이므로 \(1, 2, 3, 4, 6\)은 극대원소가 아닙니다.

\(12\)의 배수 중 \(P\)에 속한 것은 \(12\)뿐이므로 \(12\)는 극대원소이고, 유일합니다. Zorn의 보조정리가 약속한 대로입니다.`,
          en: String.raw`Maximal elements: \(x \in P\) is maximal if no element of \(P\) is strictly above it (in divisibility). Since \(1 \mid 2\), \(2 \mid 4\), \(3 \mid 6\), \(4 \mid 12\), \(6 \mid 12\), none of \(1, 2, 3, 4, 6\) is maximal.

The only multiple of 12 in \(P\) is 12 itself, so 12 is maximal — and unique. Exactly as Zorn's lemma promises.`,
        },
      },
    ],
  },
  {
    id: 'zorn-implies-ac',
    statement: {
      ko: String.raw`Zorn의 보조정리가 선택 공리를 함의함을 증명하세요: 비어 있지 않은 집합족 \((X_i)_{i \in I}\)에 대해, 부분 선택함수들의 poset에 Zorn의 보조정리를 적용하세요. (역방향 AC \(\Rightarrow\) Zorn은 여기서 증명하지 않습니다 — 초한귀납법이 필요한 idea-level 논증입니다.)`,
      en: String.raw`Prove Zorn's lemma implies the axiom of choice: for a family \((X_i)_{i \in I}\) of nonempty sets, apply Zorn's lemma to the poset of partial choice functions. (The converse AC \(\Rightarrow\) Zorn is not proved here — it needs transfinite recursion, an idea-level argument.)`,
    },
    display: [
      String.raw`P = \{f : \operatorname{dom} f \subseteq I,\ f(i) \in X_i\}, \quad f \le g \iff g\ \text{extends}\ f`,
    ],
    preset: { chain: 2 },
    presetCaption: {
      ko: String.raw`사슬 \(C_2 = \{1, 3, 6, 12\}\)가 강조 표시됨: Zorn의 보조정리는 "모든 사슬이 상한을 가지면 극대원소가 존재한다"는 주장이고, 아래 증명은 이 주장을 선택함수 존재 문제에 그대로 적용합니다.`,
      en: String.raw`The chain \(C_2 = \{1, 3, 6, 12\}\) is highlighted: Zorn's lemma says "if every chain has an upper bound, a maximal element exists", and the proof below applies exactly this to the problem of finding a choice function.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`비어 있지 않은 집합족 \((X_i)_{i \in I}\)를 고정합니다. 부분 선택함수들의 집합 \(P = \{f : \operatorname{dom} f \subseteq I,\ f(i) \in X_i\}\)를 확장 순서로 정렬합니다: \(f \le g\)는 \(\operatorname{dom} f \subseteq \operatorname{dom} g\)이고 \(g\)가 \(\operatorname{dom} f\) 위에서 \(f\)와 일치한다는 뜻입니다.

\(P\)는 비어 있지 않습니다 (빈 함수가 원소).`,
          en: String.raw`Fix a family \((X_i)_{i \in I}\) of nonempty sets. Order the set \(P = \{f : \operatorname{dom} f \subseteq I,\ f(i) \in X_i\}\) of partial choice functions by extension: \(f \le g\) means \(\operatorname{dom} f \subseteq \operatorname{dom} g\) and \(g\) agrees with \(f\) on \(\operatorname{dom} f\).

\(P\) is nonempty (the empty function belongs to it).`,
        },
      },
      {
        text: {
          ko: String.raw`\(P\)의 임의의 사슬 \(\mathcal{C}\)에 대해 합집합 \(u = \bigcup \mathcal{C}\)를 둡니다. 사슬 조건 덕분에 \(u\)는 함수입니다: \(f, g \in \mathcal{C}\)가 \(i\)에서 모두 정의되면 둘 중 큰 쪽이 다른 쪽을 확장하므로 \(f(i) = g(i)\)입니다.

\(\operatorname{dom} u = \bigcup_{f \in \mathcal{C}} \operatorname{dom} f\)이고 \(u(i) \in X_i\)이므로 \(u \in P\)이며, 모든 \(f \in \mathcal{C}\)에 대해 \(f \le u\) — 즉 \(u\)는 사슬의 상한입니다.`,
          en: String.raw`For any chain \(\mathcal{C}\) in \(P\), let \(u = \bigcup \mathcal{C}\). The chain condition makes \(u\) a function: if \(f, g \in \mathcal{C}\) are both defined at \(i\), the larger extends the smaller, so \(f(i) = g(i)\).

With \(\operatorname{dom} u = \bigcup_{f \in \mathcal{C}} \operatorname{dom} f\) and \(u(i) \in X_i\), we get \(u \in P\) and \(f \le u\) for all \(f \in \mathcal{C}\) — \(u\) is an upper bound of the chain.`,
        },
      },
      {
        text: {
          ko: String.raw`Zorn의 보조정리에 의해 \(P\)는 극대원소 \(m\)을 가집니다. \(\operatorname{dom} m = I\)임을 보입니다: 아니라면 \(i_0 \in I \setminus \operatorname{dom} m\)이 존재하고, \(X_{i_0} \ne \varnothing\)이므로 \(x_0 \in X_{i_0}\)를 잡아 \(m\)을 \(i_0 \mapsto x_0\)으로 확장한 \(m'\)를 만들 수 있습니다.

\(m < m'\)이므로 \(m\)의 극대성에 모순입니다. 따라서 \(m\)은 모든 \(I\)에서 정의된 선택함수입니다 — 선택 공리가 성립합니다.`,
          en: String.raw`By Zorn's lemma, \(P\) has a maximal element \(m\). We show \(\operatorname{dom} m = I\): otherwise some \(i_0 \in I \setminus \operatorname{dom} m\) exists, and since \(X_{i_0} \ne \varnothing\), picking \(x_0 \in X_{i_0}\) extends \(m\) to \(m'\) with \(m'(i_0) = x_0\).

Then \(m < m'\), contradicting maximality. So \(m\) is a choice function defined on all of \(I\) — the axiom of choice holds.`,
        },
      },
      {
        text: {
          ko: String.raw`참고: 역방향 (AC \(\Rightarrow\) Zorn)은 순서수를 이용한 초한귀납법으로 사슬을 극대사슬까지 늘리는 논증이 필요하며, 여기서는 idea-level 진술로만 남깁니다 — 위의 Zorn \(\Rightarrow\) AC 방향은 완전히 증명되었습니다.`,
          en: String.raw`Note: the converse (AC \(\Rightarrow\) Zorn) needs transfinite recursion along ordinals to grow a chain into a maximal one; it stays an idea-level statement here — the Zorn \(\Rightarrow\) AC direction above is proved completely.`,
        },
      },
    ],
  },
];
