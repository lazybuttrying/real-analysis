import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the clopen scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/clopen.test.ts): the four ambient/set pairs, the interval
 * arithmetic behind the eps-ball test, and the preset claims
 * (e.g. at x = 1, eps = 0.5 the ball stays in [0, 1] relative to
 * X = [0, 1] ∪ [2, 3]).
 */
export const clopenProblems: readonly ProblemMeta[] = [
  {
    id: 'clopen-r-trivial',
    statement: {
      ko: String.raw`\(\mathbb{R}\)의 부분집합 \(A\)가 열린 집합이자 닫힌 집합(clopen)이고 \(\emptyset \ne A \ne \mathbb{R}\)이라고 가정하세요.

모순을 이끌어내어, \(\mathbb{R}\)의 clopen 집합은 \(\emptyset\)와 \(\mathbb{R}\)뿐임을 완전히 증명하세요.`,
      en: String.raw`Let \(A \subseteq \mathbb{R}\) be both open and closed (clopen), with \(\emptyset \ne A \ne \mathbb{R}\).

Derive a contradiction, proving completely that the only clopen subsets of \(\mathbb{R}\) are \(\emptyset\) and \(\mathbb{R}\) itself.`,
    },
    display: [
      String.raw`\text{clopen in } \mathbb{R} \implies A = \emptyset \text{ or } A = \mathbb{R}`,
    ],
    preset: { case: 'open-interval', x: 0.5, eps: 0.2 },
    presetCaption: {
      ko: String.raw`\(X = \mathbb{R}\), \(A = (0,1)\): 열려 있지만 닫혀 있지 않습니다 — \(\mathbb{R}\)에서는 nontrivial clopen이 존재하지 않습니다.`,
      en: String.raw`\(X = \mathbb{R}\), \(A = (0,1)\): open but not closed — no nontrivial clopen set exists in \(\mathbb{R}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(A\)가 clopen이면 여집합 \(A^c\)도 clopen입니다: \(A\)가 열려 있으면 \(A^c\)는 닫혀 있고, \(A\)가 닫혀 있으면 \(A^c\)는 열려 있기 때문입니다. \(A \ne \emptyset\)이므로 \(A^c \ne \mathbb{R}\)… 정확히는 \(A \ne \mathbb{R}\)이므로 \(A^c \ne \emptyset\)이고, \(A \ne \emptyset\)이므로 \(A\) 자체도 비어 있지 않습니다.`,
          en: String.raw`If \(A\) is clopen then so is its complement \(A^c\): \(A\) open makes \(A^c\) closed, and \(A\) closed makes \(A^c\) open. Since \(A \ne \mathbb{R}\) we have \(A^c \ne \emptyset\), and since \(A \ne \emptyset\), \(A\) itself is nonempty.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\mathbb{R} = A \cup A^c\)는 서로소인 두 비어 있지 않은 열린 집합으로의 분해 — 즉 \(\mathbb{R}\)의 분리(separation)입니다.

이제 \(\mathbb{R}\)이 연결집합임을 보입니다.

\(\mathbb{R} = U \cup V\)가 서로소인 비어 있지 않은 열린 집합으로의 분해라고 가정하고, \(a \in U\), \(b \in V\)를 잡습니다 (필요하면 이름을 바꿔 \(a < b\)).`,
          en: String.raw`Hence \(\mathbb{R} = A \cup A^c\) is a decomposition into two disjoint nonempty open sets — a separation of \(\mathbb{R}\).

Now we show \(\mathbb{R}\) is connected.

Suppose \(\mathbb{R} = U \cup V\) with \(U, V\) disjoint nonempty open; pick \(a \in U\), \(b \in V\) (renaming so \(a < b\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(c = \sup(U \cap [a,b])\)라 둡니다 (\(a\)를 포함하므로 비어 있지 않고, \(b\)가 상계).

\(U\)는 열려 있을 뿐 아니라 \(U = \mathbb{R} \setminus V\)이므로 닫혀 있기도 합니다.

\(c\)는 \(U \cap [a,b]\)의 폐포에 속하므로 \(c \in \overline{U} = U\)입니다.

\(c \le b\)이고, \(b \in V\)이며 서로소이므로 \(c \ne b\), 즉 \(c < b\)입니다.

\(U\)가 열려 있으므로 어떤 \(\varepsilon > 0\)에 대해 \((c-\varepsilon, c+\varepsilon) \subseteq U\)입니다.

여기서 \(\delta = \min(\varepsilon/2, (b-c)/2) > 0\)으로 줄이면 (\(c < b\)이므로), \(c + \delta \in [a,b]\)이면서 \(c\)보다 크고 \(c + \delta \in U\)이므로 \(U \cap [a,b]\)에 속해야 합니다 — \(c = \sup\)에 모순됩니다.

따라서 \(\mathbb{R}\)의 분리는 존재하지 않습니다.`,
          en: String.raw`Put \(c = \sup(U \cap [a,b])\) (nonempty, containing \(a\); bounded above by \(b\)).

\(U\) is not only open but also closed, since \(U = \mathbb{R} \setminus V\).

Now \(c\) lies in the closure of \(U \cap [a,b]\), so \(c \in \overline{U} = U\).

We have \(c \le b\), and \(c \ne b\) (as \(b \in V\) and the sets are disjoint), so \(c < b\).

Since \(U\) is open, \((c-\varepsilon, c+\varepsilon) \subseteq U\) for some \(\varepsilon > 0\).

Now shrink to \(\delta = \min(\varepsilon/2, (b-c)/2) > 0\) (positive since \(c < b\)): then \(c + \delta \in [a,b]\), exceeds \(c\), and lies in \(U\), so it belongs to \(U \cap [a,b]\) — contradicting \(c = \sup\).

Hence no separation of \(\mathbb{R}\) exists.`,
        },
      },
      {
        text: {
          ko: String.raw`이는 2단계의 분리와 모순되므로, 가정한 nontrivial clopen 집합 \(A\)는 존재하지 않습니다.

즉 \(\mathbb{R}\)의 clopen 집합은 \(\emptyset\)와 \(\mathbb{R}\)뿐입니다.

씬의 \(A = (0,1)\)은 열려 있지만 닫혀 있지 않아서 이 정리를 피합니다 — 닫혀 있게 하려면 빠진 극한점 \(0, 1\)을 넣어야 하고, 그러면 열린 쪽이 깨집니다.`,
          en: String.raw`This contradicts the separation from the second step, so the assumed nontrivial clopen set \(A\) cannot exist: the only clopen subsets of \(\mathbb{R}\) are \(\emptyset\) and \(\mathbb{R}\). The scene's \(A = (0,1)\) is open but not closed, dodging this theorem — closing it would require adding the missing limit points \(0, 1\), which would break openness.`,
        },
      },
    ],
  },
  {
    id: 'clopen-subspace-pieces',
    statement: {
      ko: String.raw`부분공간 \(X = [0,1] \cup [2,3] \subseteq \mathbb{R}\)와 \(A = [0,1]\)에 대해, \(A\)가 \(X\)에서는 clopen이지만 \(\mathbb{R}\)에서는 열려 있지 않음을 완전히 증명하세요.`,
      en: String.raw`For the subspace \(X = [0,1] \cup [2,3] \subseteq \mathbb{R}\) and \(A = [0,1]\), prove completely that \(A\) is clopen in \(X\) but not open in \(\mathbb{R}\).`,
    },
    display: [
      String.raw`[0,1] = X \cap (-1/2,\, 3/2) = X \cap [-1/2,\, 3/2]`,
    ],
    preset: { case: 'clopen-pieces', x: 1, eps: 0.5 },
    presetCaption: {
      ko: String.raw`\(x = 1\), \(\varepsilon = 0.5\): 경계점 \(1\)에서도 \((1-0.5, 1+0.5) \cap X = (0.5, 1] \subseteq A\)이므로 \(X\) 기준으로 공이 \(A\) 안에 머뭅니다 — \(X\)에서의 열림이 보입니다.`,
      en: String.raw`\(x = 1\), \(\varepsilon = 0.5\): even at the boundary point \(1\), \((1-0.5, 1+0.5) \cap X = (0.5, 1] \subseteq A\), so the ball stays in \(A\) relative to \(X\) — openness in \(X\) made visible.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(X\)에서 열림: \([0,1] = X \cap (-1/2,\, 3/2)\)임을 확인합니다.

\(\subseteq\)는 자명하고, 역으로 \(X \cap (-1/2,\, 3/2)\)의 점은 \([0,1]\)에 있거나 \([2,3] \cap (-1/2,\, 3/2)\)에 있어야 하는데 후자는 비어 있으므로 \([0,1]\)에 속합니다.

\((-1/2,\, 3/2)\)는 \(\mathbb{R}\)에서 열려 있으므로, \([0,1]\)은 \(X\)에서 열려 있습니다.`,
          en: String.raw`Openness in \(X\): check \([0,1] = X \cap (-1/2,\, 3/2)\).

The inclusion \(\subseteq\) is clear; conversely a point of \(X \cap (-1/2,\, 3/2)\) lies in \([0,1]\) or in \([2,3] \cap (-1/2,\, 3/2)\), and the latter is empty, so it lies in \([0,1]\).

Since \((-1/2,\, 3/2)\) is open in \(\mathbb{R}\), \([0,1]\) is open in \(X\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(X\)에서 닫힘: 같은 논증으로 \([0,1] = X \cap [-1/2,\, 3/2]\)입니다 (\([2,3] \cap [-1/2,\, 3/2] = \emptyset\)).

\([-1/2,\, 3/2]\)는 \(\mathbb{R}\)에서 닫혀 있으므로 \([0,1]\)은 \(X\)에서 닫혀 있습니다.

따라서 \([0,1]\)은 \(X\)의 clopen 집합입니다.`,
          en: String.raw`Closedness in \(X\): the same argument gives \([0,1] = X \cap [-1/2,\, 3/2]\) (since \([2,3] \cap [-1/2,\, 3/2] = \emptyset\)).

As \([-1/2,\, 3/2]\) is closed in \(\mathbb{R}\), \([0,1]\) is closed in \(X\).

Hence \([0,1]\) is clopen in \(X\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\mathbb{R}\)에서는 열려 있지 않음: \(1 \in [0,1]\)이지만, 모든 \(\varepsilon > 0\)에 대해 공 \((1-\varepsilon, 1+\varepsilon)\)은 \(1 + \varepsilon/2 \notin [0,1]\)을 포함합니다. 따라서 같은 집합 \([0,1]\)이 \(X\)에서는 clopen이면서 \(\mathbb{R}\)에서는 (닫혀 있기만 하고) 열려 있지 않습니다 — clopen은 ambient에 상대적인 개념입니다.`,
          en: String.raw`Not open in \(\mathbb{R}\): \(1 \in [0,1]\), yet every ball \((1-\varepsilon, 1+\varepsilon)\) contains \(1 + \varepsilon/2 \notin [0,1]\). So the same set \([0,1]\) is clopen in \(X\) while in \(\mathbb{R}\) it is merely closed, not open — clopenness is relative to the ambient space.`,
        },
      },
    ],
  },
  {
    id: 'clopen-separation',
    statement: {
      ko: String.raw`\(X\)를 위상공간, \(A \subseteq X\)를 clopen 집합이라 하세요.

\(\emptyset \ne A \ne X\)이면 \(X\)는 연결집합이 아님을 완전히 증명하세요.`,
      en: String.raw`Let \(X\) be a topological space and \(A \subseteq X\) clopen.

Prove completely that if \(\emptyset \ne A \ne X\) then \(X\) is disconnected.`,
    },
    display: [
      String.raw`X = A \cup A^c, \qquad A \cap A^c = \emptyset, \qquad A,\, A^c \ne \emptyset \text{ open in } X`,
    ],
    preset: { case: 'clopen-gap', x: 0.5, eps: 0.3 },
    presetCaption: {
      ko: String.raw`\(X = (0,1) \cup (1,2)\), \(A = (0,1)\): \(X = A \cup A^c\)는 서로소인 비어 있지 않은 열린 집합으로의 분해 — \(X\)가 연결집합이 아님을 보여줍니다.`,
      en: String.raw`\(X = (0,1) \cup (1,2)\), \(A = (0,1)\): \(X = A \cup A^c\) is a separation into disjoint nonempty opens — showing \(X\) is disconnected.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(A\)가 clopen이면 여집합 \(A^c = X \setminus A\)도 clopen입니다: 여집합을 취하면 열림과 닫힘이 뒤바뀌기 때문입니다 (\(A\)가 열려 있으면 \(A^c\)는 닫혀 있고, \(A\)가 닫혀 있으면 \(A^c\)는 열려 있습니다).`,
          en: String.raw`If \(A\) is clopen then so is its complement \(A^c = X \setminus A\): complementation swaps openness and closedness (\(A\) open makes \(A^c\) closed; \(A\) closed makes \(A^c\) open).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\emptyset \ne A \ne X\)이므로 \(A\)와 \(A^c\)는 모두 비어 있지 않습니다.

또한 \(X = A \cup A^c\), \(A \cap A^c = \emptyset\)이며, 둘 다 \(X\)에서 열려 있습니다 — 즉 \(X\)의 분리(separation)입니다.

따라서 \(X\)는 연결집합이 아닙니다.`,
          en: String.raw`Since \(\emptyset \ne A \ne X\), both \(A\) and \(A^c\) are nonempty.

Moreover \(X = A \cup A^c\), \(A \cap A^c = \emptyset\), and both are open in \(X\) — a separation of \(X\).

Hence \(X\) is disconnected.`,
        },
      },
      {
        text: {
          ko: String.raw`역도 성립합니다: \(X = U \cup V\)가 분리이면 \(U = X \setminus V\)는 닫혀 있기도 하므로 clopen입니다.

즉 "nontrivial clopen 집합이 존재한다"는 "연결집합이 아니다"와 동치입니다.

위 문제 1은 \(X = \mathbb{R}\)인 특별한 경우입니다 — \(\mathbb{R}\)이 연결집합이므로 nontrivial clopen이 있을 수 없습니다.`,
          en: String.raw`The converse holds too: if \(X = U \cup V\) is a separation then \(U = X \setminus V\) is also closed, hence clopen.

So "a nontrivial clopen set exists" is equivalent to "disconnected".

Problem 1 above is the special case \(X = \mathbb{R}\) — since \(\mathbb{R}\) is connected, no nontrivial clopen set can exist there.`,
        },
      },
    ],
  },
];
