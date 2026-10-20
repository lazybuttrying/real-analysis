import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the equivalence-relations scene
 * (congruence modulo n on {0, ..., 3n - 1}, verified by brute force).
 *
 * Every number below was verified against the model
 * (tests/relations-equivalence.test.ts): at n = 4, U has 12 elements,
 * the classes are [0] = {0, 4, 8}, [1] = {1, 5, 9}, [2] = {2, 6, 10},
 * [3] = {3, 7, 11}, the axiom check counts are 12 (elements),
 * 144 (pairs) and 1728 (triples), and 7 ~ 3 (7 - 3 = 4) while 7 is not
 * related to 4 (7 - 4 = 3 is not divisible by 4).
 */
export const relationsEquivalenceProblems: readonly ProblemMeta[] = [
  {
    id: 'relations-equivalence-modular-proof',
    statement: {
      ko: String.raw`정수의 집합 \(\mathbb{Z}\) 위에서 합동식 \(a \sim b \iff n \mid (a - b)\)로 정의된 관계가 동치관계임을 완전히 증명하세요 — 반사·대칭·추이 세 조건을 각각 나눗셈의 산술로 끌어내리세요.`,
      en: String.raw`Prove completely that the relation \(a \sim b \iff n \mid (a - b)\) on the integers \(\mathbb{Z}\) is an equivalence relation — pull each of the three conditions, reflexive, symmetric, transitive, down to the arithmetic of divisibility.`,
    },
    display: [
      String.raw`a \sim b \;\iff\; a \equiv b \pmod n`,
      String.raw`n \mid (a-b),\; n \mid (b-c) \;\Rightarrow\; n \mid (a-c) = (a-b) + (b-c)`,
    ],
    preset: { n: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\): \(U\)는 \(0\)부터 \(11\)까지의 \(12\)개 수, 동치류는 \([0] = \{0, 4, 8\}\), \([1] = \{1, 5, 9\}\), \([2] = \{2, 6, 10\}\), \([3] = \{3, 7, 11\}\). 예: \(7 \sim 3\) (\(7 - 3 = 4\)), \(7 \sim 4\)는 거짓 (\(7 - 4 = 3\)은 \(4\)로 나누어지지 않음).`,
      en: String.raw`\(n = 4\): \(U\) is the \(12\) numbers \(0\) through \(11\), and the classes are \([0] = \{0, 4, 8\}\), \([1] = \{1, 5, 9\}\), \([2] = \{2, 6, 10\}\), \([3] = \{3, 7, 11\}\). Examples: \(7 \sim 3\) (\(7 - 3 = 4\)), but \(7 \sim 4\) is false (\(7 - 4 = 3\) is not divisible by \(4\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`반사(reflexive): 모든 정수 \(a\)에 대해 \(a - a = 0\)이고 \(n \mid 0\)이므로 \(a \sim a\). 씬의 수치로는 \(n = 4\)일 때 \(U\)의 \(12\)개 원소가 모두 자기자신과 관련됩니다.`,
          en: String.raw`Reflexive: for every integer \(a\), \(a - a = 0\) and \(n \mid 0\), so \(a \sim a\). In the scene at \(n = 4\), all \(12\) elements of \(U\) are related to themselves.`,
        },
      },
      {
        text: {
          ko: String.raw`대칭(symmetric): \(a \sim b\)라 하세요. 그러면 \(n \mid (a - b)\)라서 \(a - b = nk\)인 정수 \(k\)가 존재하고, 이로부터 \(b - a = -nk = n(-k)\)이므로 \(n \mid (b - a)\), 즉 \(b \sim a\). 씬에서는 \(U\)의 모든 \(12^2 = 144\)개 순서쌍에 대해 확인됩니다.`,
          en: String.raw`Symmetric: suppose \(a \sim b\). Then \(n \mid (a - b)\), so \(a - b = nk\) for some integer \(k\), and therefore \(b - a = -nk = n(-k)\), giving \(n \mid (b - a)\), i.e. \(b \sim a\). In the scene this is checked for all \(12^2 = 144\) ordered pairs of \(U\).`,
        },
      },
      {
        text: {
          ko: String.raw`추이(transitive): \(a \sim b\)이고 \(b \sim c\)라 하세요. \(a - b = nk\), \(b - c = nm\)인 정수 \(k, m\)이 존재하고, 두 식을 더하면 \(a - c = (a - b) + (b - c) = nk + nm = n(k + m)\)이므로 \(n \mid (a - c)\), 즉 \(a \sim c\). 씬에서는 \(12^3 = 1728\)개 삼중항이 모두 확인됩니다. 세 조건이 성립하므로 합동식은 동치관계입니다.`,
          en: String.raw`Transitive: suppose \(a \sim b\) and \(b \sim c\). There are integers \(k, m\) with \(a - b = nk\) and \(b - c = nm\); adding gives \(a - c = (a - b) + (b - c) = nk + nm = n(k + m)\), so \(n \mid (a - c)\), i.e. \(a \sim c\). In the scene all \(12^3 = 1728\) triples check out. The three conditions hold, so congruence is an equivalence relation.`,
        },
      },
    ],
  },
  {
    id: 'relations-equivalence-partition-theorem',
    statement: {
      ko: String.raw`분할 정리(partition theorem)를 완전히 증명하세요: 집합 \(S\) 위의 동치관계 \(\sim\)에 대해 (i) 모든 \(x\)는 그 동치류 \([x]\)에 속하고, (ii) \([x]\)와 \([y]\)가 원소를 하나라도 공유하면 \([x] = [y]\)입니다. 이로부터 서로 다른 동치류는 겹치지 않고 동치류 전체가 \(S\)를 덮음을 도출하세요.`,
      en: String.raw`Prove the partition theorem completely: for an equivalence relation \(\sim\) on a set \(S\), (i) every \(x\) belongs to its own equivalence class \([x]\), and (ii) if \([x]\) and \([y]\) share even one element then \([x] = [y]\). Deduce that distinct classes are disjoint and that the classes together cover \(S\).`,
    },
    display: [
      String.raw`[x] = \{y \in S : y \sim x\}`,
      String.raw`z \in [x] \cap [y] \;\Rightarrow\; [x] = [y]`,
    ],
    preset: { n: 4 },
    presetCaption: {
      ko: String.raw`\(n = 4\): 네 동치류 \([0] = \{0, 4, 8\}\), \([1] = \{1, 5, 9\}\), \([2] = \{2, 6, 10\}\), \([3] = \{3, 7, 11\}\)은 서로 겹치지 않고 합집합이 \(U\) 전체입니다 — 분할 정리의 유한 구체예.`,
      en: String.raw`\(n = 4\): the four classes \([0] = \{0, 4, 8\}\), \([1] = \{1, 5, 9\}\), \([2] = \{2, 6, 10\}\), \([3] = \{3, 7, 11\}\) are pairwise disjoint and their union is all of \(U\) — the partition theorem in a finite example.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(i) 반사성(reflexivity)에 의해 \(x \sim x\)이므로 \(x \in [x]\)입니다. 따라서 어떤 동치류도 비어 있지 않고, 모든 원소가 최소 하나의 동치류에 들어갑니다 — 동치류들의 합집합이 \(S\) 전체입니다.`,
          en: String.raw`(i) By reflexivity \(x \sim x\), hence \(x \in [x]\). So no class is empty, and every element lies in at least one class — the classes cover \(S\).`,
        },
      },
      {
        text: {
          ko: String.raw`(ii)의 준비: 원소 \(z \in [x] \cap [y]\)가 존재한다고 하세요. 정의에 의해 \(z \sim x\)이고 \(z \sim y\)입니다. 대칭성에 의해 \(z \sim x\)에서 \(x \sim z\)를 얻고, 여기에 \(z \sim y\)와 추이성을 적용하면 \(x \sim y\)를 얻습니다.`,
          en: String.raw`Setup for (ii): suppose some \(z \in [x] \cap [y]\) exists. By definition \(z \sim x\) and \(z \sim y\). Symmetry turns \(z \sim x\) into \(x \sim z\), and transitivity with \(z \sim y\) then gives \(x \sim y\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \([x] \subseteq [y]\)를 보입니다. \(w \in [x]\)라 하면 \(w \sim x\)이고, 위의 준비에서 \(x \sim y\)이므로 대칭성으로 \(y \sim x\)를 얻고, \(w \sim x\)에 추이성을 적용하면 \(w \sim y\), 즉 \(w \in [y]\)입니다. 역할을 바꾸면 \([y] \subseteq [x]\)도 얻어지므로 \([x] = [y]\)입니다.`,
          en: String.raw`Now show \([x] \subseteq [y]\). If \(w \in [x]\) then \(w \sim x\); from the setup, \(x \sim y\), so symmetry gives \(y \sim x\) and transitivity from \(w \sim x\) yields \(w \sim y\), i.e. \(w \in [y]\). Swapping the roles gives \([y] \subseteq [x]\), hence \([x] = [y]\).`,
        },
      },
      {
        text: {
          ko: String.raw`결론: 두 동치류가 조금이라도 겹치면 둘은 같습니다. 따라서 서로 다른 동치류는 서로소이고, (i)에 의해 그 합집합은 \(S\)입니다 — 동치관계는 집합을 동치류들로 분할(partition)합니다. \(n = 4\)인 씬에서는 네 동치류가 \(U\)의 \(12\)개 원소를 \(3\)개씩 정확히 나눠 가집니다.`,
          en: String.raw`Conclusion: if two classes overlap at all, they are equal. Hence distinct classes are disjoint, and by (i) their union is \(S\) — an equivalence relation partitions its set into equivalence classes. In the scene at \(n = 4\), the four classes split the \(12\) elements of \(U\) into exactly \(3\) each.`,
        },
      },
    ],
  },
  {
    id: 'relations-equivalence-vitali-cosets',
    statement: {
      ko: String.raw`실수 집합 \(\mathbb{R}\) 위에서 \(x \sim y \iff x - y \in \mathbb{Q}\)로 관계를 정의합니다. (a) 이 관계가 동치관계임을 증명하고, (b) 동치류의 모양을 규명하세요(\([x] = x + \mathbb{Q}\)), (c) 이 분할에서 각 동치류마다 대표원소 하나를 골라 모은 집합이 비탈리 집합(Vitali set)의 구성과 정확히 같음을 설명하세요.`,
      en: String.raw`Define a relation on \(\mathbb{R}\) by \(x \sim y \iff x - y \in \mathbb{Q}\). (a) Prove it is an equivalence relation, (b) determine the shape of its equivalence classes (\([x] = x + \mathbb{Q}\)), and (c) explain why collecting one representative from each class of this partition is exactly the Vitali-set construction.`,
    },
    display: [
      String.raw`x \sim y \iff x - y \in \mathbb{Q}`,
      String.raw`[x] = x + \mathbb{Q} = \{x + q : q \in \mathbb{Q}\}`,
    ],
    preset: { n: 2 },
    presetCaption: {
      ko: String.raw`\(n = 2\): 유한 원형 — 두 동치류 \([0] = \{0, 2, 4\}\)와 \([1] = \{1, 3, 5\}\)가 \(U = \{0, \dots, 5\}\)를 분할합니다. 나머지 대신 “같은 유리수 차이”를 쓰는 것이 이 문제의 관계입니다.`,
      en: String.raw`\(n = 2\): the finite prototype — the two classes \([0] = \{0, 2, 4\}\) and \([1] = \{1, 3, 5\}\) partition \(U = \{0, \dots, 5\}\). This problem's relation swaps "same remainder" for "same rational difference".`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(a) 반사: \(x - x = 0 \in \mathbb{Q}\)이므로 \(x \sim x\). 대칭: \(x - y \in \mathbb{Q}\)이면 \(y - x = -(x - y) \in \mathbb{Q}\)이므로 \(y \sim x\) (유리수는 부호를 바꿔도 유리수). 추이: \(x - y \in \mathbb{Q}\)이고 \(y - z \in \mathbb{Q}\)이면 \(x - z = (x - y) + (y - z) \in \mathbb{Q}\)이므로 \(x \sim z\) (유리수의 합은 유리수). 앞선 문제 1의 합동식 증명과 정확히 같은 골격이며, “나눗셈”이 “\(\mathbb{Q}\)의 원소”로 대체됐을 뿐입니다.`,
          en: String.raw`(a) Reflexive: \(x - x = 0 \in \mathbb{Q}\), so \(x \sim x\). Symmetric: if \(x - y \in \mathbb{Q}\) then \(y - x = -(x - y) \in \mathbb{Q}\), so \(y \sim x\) (rationals stay rational under negation). Transitive: if \(x - y \in \mathbb{Q}\) and \(y - z \in \mathbb{Q}\) then \(x - z = (x - y) + (y - z) \in \mathbb{Q}\), so \(x \sim z\) (sums of rationals are rational). This is the same skeleton as the congruence proof in problem 1, with "divisibility" replaced by "membership in \(\mathbb{Q}\)".`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \([x] = \{y \in \mathbb{R} : y - x \in \mathbb{Q}\}\)이고 \(y = x + (y - x)\)라 두면 이 집합은 정확히 \(x + \mathbb{Q} = \{x + q : q \in \mathbb{Q}\}\) — 유리수 집합을 \(x\)만큼 통째로 평행이동한 복사본입니다. 유리수 차이만큼 떨어진 실수들은 서로 동일시되고, 분할 정리(문제 2)에 의해 이 이동된 복사본들이 \(\mathbb{R}\)을 겹침 없이 덮습니다.`,
          en: String.raw`(b) \([x] = \{y \in \mathbb{R} : y - x \in \mathbb{Q}\}\); writing \(y = x + (y - x)\) shows this set is exactly \(x + \mathbb{Q} = \{x + q : q \in \mathbb{Q}\}\) — a shifted copy of the rationals, translated by \(x\). Reals a rational distance apart are identified, and by the partition theorem (problem 2) these shifted copies tile \(\mathbb{R}\) without overlap.`,
        },
      },
      {
        text: {
          ko: String.raw`(c) 각 동치류 \(x + \mathbb{Q}\)에서 대표원소 딱 하나를 골라 모은 집합이 비탈리 집합입니다. 그런데 동치류가 비가산히 많고 어느 하나도 “자연스러운” 대표원소가 없기 때문에, 이 선택은 선택 공리(the axiom of choice)를 필요로 합니다 — 규칙으로는 고를 수 없고, 공리가 존재만을 보장합니다. 적분 단원의 비탈리(vitali) 씬에서는 바로 이 집합이 르베그 가측(measure)이 아님을 보입니다: 측정 가능한 유리수 이동들의 합집합이 유계 구간 전체를 덮을 수 없기 때문입니다.`,
          en: String.raw`(c) Choosing exactly one representative from each class \(x + \mathbb{Q}\) and collecting them produces a Vitali set. But there are uncountably many classes and none has a "natural" representative, so this choice requires the axiom of choice — no rule can make the picks; the axiom only guarantees existence. In the integration chapter's vitali scene, this very set is shown not to be Lebesgue measurable: countably many measurable rational translates cannot reassemble into a bounded interval.`,
        },
      },
    ],
  },
];
