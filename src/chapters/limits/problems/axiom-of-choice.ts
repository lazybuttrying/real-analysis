import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the axiom of choice scene
 * (Tao, Analysis I, Axiom 8.1). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/axiom-of-choice.test.ts):
 *   (m, seed) = (3, 1): bins [3, 4, 5], choices [2, 3, 4];
 *   (m, seed) = (4, 2): bins [3, 5, 3, 5], choices [1, 1, 2, 0];
 *   (m, seed) = (5, 5): bins [3, 4, 5, 2, 3], choices [1, 3, 0, 1, 0].
 */
export const axiomOfChoiceProblems: readonly ProblemMeta[] = [
  {
    id: 'ac-finite',
    statement: {
      ko: String.raw`유한한 집합족에 대해서는 선택 공리가 필요 없음을 증명하세요: \(X_1, \dots, X_m\)이 모두 비어 있지 않은 집합이면, 각 \(X_i\)에서 원소를 하나씩 뽑는 튜플 \((x_1, \dots, x_m)\)이 존재합니다 (\(m\)에 대한 귀납법).`,
      en: String.raw`Prove no axiom is needed for a finite family: if \(X_1, \dots, X_m\) are all nonempty sets, there exists a tuple \((x_1, \dots, x_m)\) picking one element from each \(X_i\) (induction on \(m\)).`,
    },
    display: [
      String.raw`X_1, \dots, X_m \ne \varnothing \ \Rightarrow\ \exists\,(x_1, \dots, x_m): x_i \in X_i`,
    ],
    preset: { m: 3, seed: 1 },
    presetCaption: {
      ko: String.raw`\(m = 3\), seed \(= 1\): 세 상자에 각각 \(3, 4, 5\)개의 공이 있고, 선택된 튜플은 \((2, 3, 4)\)입니다 (0부터 센 인덱스). 상자가 유한하므로 이런 선택을 손으로 직접 만들 수 있습니다.`,
      en: String.raw`\(m = 3\), seed \(= 1\): the three bins hold \(3, 4, 5\) balls, and the chosen tuple is \((2, 3, 4)\) (0-based indices). With finitely many bins, this choice can be made by hand.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(m = 1\)일 때: \(X_1 \ne \varnothing\)이므로 원소 \(x_1 \in X_1\)이 존재합니다 — 존재 명제의 인스턴스화일 뿐, 선택이 아닙니다. 튜플 \((x_1)\)이 구하는 것입니다.`,
          en: String.raw`For \(m = 1\): since \(X_1 \ne \varnothing\), some \(x_1 \in X_1\) exists — this is just existential instantiation, not a choice. The tuple \((x_1)\) is what we want.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(X_1, \dots, X_m\)에서 튜플 \((x_1, \dots, x_m)\)이 이미 뽑혔다고 가정합니다 (\(x_i \in X_i\)). \(X_{m+1} \ne \varnothing\)이므로 원소 \(x_{m+1} \in X_{m+1}\)이 존재하고, \((x_1, \dots, x_m, x_{m+1})\)이 \(m+1\)개의 집합에 대한 튜플이 됩니다.`,
          en: String.raw`Inductive step: suppose a tuple \((x_1, \dots, x_m)\) has already been picked from \(X_1, \dots, X_m\) (\(x_i \in X_i\)). Since \(X_{m+1} \ne \varnothing\), some \(x_{m+1} \in X_{m+1}\) exists, and \((x_1, \dots, x_m, x_{m+1})\) is a tuple for the \(m+1\) sets.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 모든 유한한 \(m\)에 대해 튜플이 존재합니다.

핵심은 매 단계마다 이름이 붙은 집합 하나에서만 원소를 고른다는 점입니다 — 무한히 많은 집합에서 "동시에" 고르는 일이 없어서 선택 공리가 필요 없습니다.

무한족에서는 이 귀납법이 끝나지 않으며, 바로 그 지점에서 공리가 등장합니다.`,
          en: String.raw`Hence a tuple exists for every finite \(m\).

The point: at each step we pick from a single named set — never "simultaneously" from infinitely many sets — so no choice axiom is needed.

For an infinite family this induction never finishes, and that is exactly where the axiom enters.`,
        },
      },
    ],
  },
  {
    id: 'ac-product',
    statement: {
      ko: String.raw`선택 공리는 "비어 있지 않은 집합들의 곱은 항상 비어 있지 않다"는 명제와 동치임을 양방향으로 증명하세요.`,
      en: String.raw`Prove in both directions that the axiom of choice is equivalent to "every product of nonempty sets is nonempty".`,
    },
    display: [
      String.raw`\mathrm{AC} \iff \left( X_i \ne \varnothing\ \forall i \ \Rightarrow\ \prod_{i \in I} X_i \ne \varnothing \right)`,
    ],
    preset: { m: 4, seed: 2 },
    presetCaption: {
      ko: String.raw`\(m = 4\), seed \(= 2\): 네 상자에 각각 \(3, 5, 3, 5\)개의 공이 있고, 선택된 튜플 \((1, 1, 2, 0)\)은 곱집합 \(X_1 \times X_2 \times X_3 \times X_4\)의 원소 그 자체입니다.`,
      en: String.raw`\(m = 4\), seed \(= 2\): the four bins hold \(3, 5, 3, 5\) balls, and the chosen tuple \((1, 1, 2, 0)\) is itself an element of the product \(X_1 \times X_2 \times X_3 \times X_4\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(\(\Rightarrow\)) 선택 공리를 가정하고, 비어 있지 않은 집합족 \((X_i)_{i \in I}\)를 잡습니다.

공리는 각 \(i\)에 대해 \(c(i) \in X_i\)인 선택함수 \(c\)를 줍니다.

튜플 \((c(i))_{i \in I}\)은 정의상 곱집합 \(\prod_{i \in I} X_i\)의 원소이므로, 곱집합은 비어 있지 않습니다.`,
          en: String.raw`(\(\Rightarrow\)) Assume AC, and take a family \((X_i)_{i \in I}\) of nonempty sets.

The axiom gives a choice function \(c\) with \(c(i) \in X_i\) for each \(i\).

The tuple \((c(i))_{i \in I}\) is by definition an element of the product \(\prod_{i \in I} X_i\), so the product is nonempty.`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Leftarrow\)) 반대로 모든 그런 곱집합이 비어 있지 않다고 가정합니다.

임의의 비어 있지 않은 집합족 \((X_i)_{i \in I}\)에 대해 곱집합 \(\prod_{i \in I} X_i\)는 비어 있지 않으므로 원소 \(t\)를 하나 가집니다.

이 \(t\)는 각 \(i\)에 \(t_i \in X_i\)를 대응시키는 튜플 — 즉 선택함수 그 자체입니다.

따라서 선택 공리가 성립합니다.`,
          en: String.raw`(\(\Leftarrow\)) Conversely, assume every such product is nonempty.

For any family \((X_i)_{i \in I}\) of nonempty sets, the product \(\prod_{i \in I} X_i\) is nonempty, so it has an element \(t\).

This \(t\) is a tuple assigning to each \(i\) some \(t_i \in X_i\) — that is, a choice function itself.

Hence the axiom of choice holds.`,
        },
      },
    ],
  },
  {
    id: 'ac-right-inverse',
    statement: {
      ko: String.raw`선택 공리는 "모든 전사함수는 우역원을 갖는다"는 명제와 동치임을 양방향으로 증명하세요.`,
      en: String.raw`Prove in both directions that the axiom of choice is equivalent to "every surjection has a right inverse".`,
    },
    display: [
      String.raw`\mathrm{AC} \iff \left( f: X \twoheadrightarrow Y \ \Rightarrow\ \exists\, g: Y \to X,\ f(g(y)) = y \right)`,
    ],
    preset: { m: 5, seed: 5 },
    presetCaption: {
      ko: String.raw`\(m = 5\), seed \(= 5\): 다섯 상자에 각각 \(3, 4, 5, 2, 3\)개의 공이 있고 선택된 튜플은 \((1, 3, 0, 1, 0)\)입니다. 아래 증명의 서로소 합집합을 이 다섯 상자에 적용하면, 사영의 우역원이 바로 이 튜플이 됩니다.`,
      en: String.raw`\(m = 5\), seed \(= 5\): the five bins hold \(3, 4, 5, 2, 3\) balls and the chosen tuple is \((1, 3, 0, 1, 0)\). Applying the proof's disjoint union to these five bins, a right inverse of the projection is exactly this tuple.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(\(\Rightarrow\)) 전사함수 \(f: X \to Y\)를 잡습니다.

각 \(y \in Y\)에 대해 fiber \(f^{-1}(\{y\}) = \{x : f(x) = y\}\)는 전사성에 의해 비어 있지 않습니다.

선택 공리를 집합족 \((f^{-1}(\{y\}))_{y \in Y}\)에 적용하면 각 \(y\)에 대해 \(g(y) \in f^{-1}(\{y\})\)인 함수 \(g: Y \to X\)를 얻고, 이는 \(f(g(y)) = y\)를 만족합니다 — \(g\)는 \(f\)의 우역원입니다.`,
          en: String.raw`(\(\Rightarrow\)) Take a surjection \(f: X \to Y\).

For each \(y \in Y\), the fiber \(f^{-1}(\{y\}) = \{x : f(x) = y\}\) is nonempty by surjectivity.

Applying AC to the family \((f^{-1}(\{y\}))_{y \in Y}\) gives \(g: Y \to X\) with \(g(y) \in f^{-1}(\{y\})\) for each \(y\), i.e. \(f(g(y)) = y\): \(g\) is a right inverse of \(f\).`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Leftarrow\)) 모든 전사함수가 우역원을 갖는다고 가정하고, 비어 있지 않은 집합족 \((X_i)_{i \in I}\)를 잡습니다 (\(I = \varnothing\)이면 빈 함수가 선택함수이므로 자명).

서로소 합집합 \(X = \{(i, x) : i \in I,\ x \in X_i\}\)와 사영 \(\pi: X \to I\), \(\pi(i, x) = i\)를 둡니다.

각 \(X_i\)가 비어 있지 않으므로 \(\pi\)는 전사입니다.`,
          en: String.raw`(\(\Leftarrow\)) Assume every surjection has a right inverse, and take a family \((X_i)_{i \in I}\) of nonempty sets (if \(I = \varnothing\) the empty function is a choice function, trivially).

Form the disjoint union \(X = \{(i, x) : i \in I,\ x \in X_i\}\) and the projection \(\pi: X \to I\), \(\pi(i, x) = i\).

Since each \(X_i\) is nonempty, \(\pi\) is surjective.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\pi\)의 우역원 \(s: I \to X\)는 \(\pi(s(i)) = i\)를 만족하므로, \(s(i) = (i, x_i)\) 꼴이며 \(x_i \in X_i\)가 유일하게 정해집니다.

대응 \(i \mapsto x_i\)가 구하는 선택함수입니다.

따라서 선택 공리가 성립합니다.`,
          en: String.raw`A right inverse \(s: I \to X\) of \(\pi\) satisfies \(\pi(s(i)) = i\), so \(s(i) = (i, x_i)\) for a uniquely determined \(x_i \in X_i\).

The assignment \(i \mapsto x_i\) is the desired choice function.

Hence the axiom of choice holds.`,
        },
      },
    ],
  },
];
