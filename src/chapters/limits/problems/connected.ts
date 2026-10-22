import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the connected scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/connected.test.ts): [0, 1] admits no separating cut at any
 * sampled t, the two-piece space separates at t = 1.5 but not at
 * t = 0.5, and the rationals cut c = sqrt(2) / 2 satisfies c^2 = 1/2
 * with c not rational, so Q ∩ [0, 1] is covered by its two sides.
 */
export const connectedProblems: readonly ProblemMeta[] = [
  {
    id: 'interval-connected',
    statement: {
      ko: String.raw`구간 \([0,1]\)이 연결집합임을 완전히 증명하세요.

즉, \([0,1]\)에서 열려 있는 서로소인 두 집합 \(U, V\)가 \([0,1] = U \cup V\)를 만족하면, \(U\)와 \(V\) 중 적어도 하나는 비어 있음을 보이세요.`,
      en: String.raw`Prove completely that the interval \([0,1]\) is connected.

That is, show that if \(U, V\) are disjoint sets, both open in \([0,1]\), with \([0,1] = U \cup V\), then at least one of \(U, V\) is empty.`,
    },
    display: [
      String.raw`[0,1] = U \cup V,\ U \cap V = \emptyset,\ U, V \text{ open in } [0,1] \implies U = \emptyset \text{ or } V = \emptyset`,
    ],
    preset: { case: 'interval', t: 0.5 },
    presetCaption: {
      ko: String.raw`\(t = 0.5\): 절단점 \(0.5\) 자체가 어느 쪽에도 속하지 않아 덮지 못합니다 — \([0,1]\)에서는 어떤 절단도 이렇게 실패합니다.`,
      en: String.raw`\(t = 0.5\): the cut point \(0.5\) itself belongs to neither side, so the pair does not cover — every cut of \([0,1]\) fails this way.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\([0,1] = U \cup V\)가 분리라고 가정하고, \(U, V\)가 모두 비어 있지 않다고 가정합니다.

이름을 바꿔 \(0 \in U\)라 둡니다 (\(0\)은 \(U\)와 \(V\) 중 하나에 속하는데, \(1 - x\) 대칭으로 두 경우 모두 같은 논증이 됩니다).

집합 \(S = \{x \in [0,1] : [0,x] \subseteq U\}\)와 \(c = \sup S\)를 둡니다.

\(0 \in S\)이므로 \(S \ne \emptyset\)이고, \(1\)이 상계이므로 완비성 공리에 의해 \(c \in [0,1]\)이 존재합니다.`,
          en: String.raw`Suppose \([0,1] = U \cup V\) is a separation, with \(U, V\) both nonempty.

Renaming if needed, assume \(0 \in U\) (\(0\) lies in one of \(U, V\), and the symmetry \(x \mapsto 1 - x\) makes the two cases identical).

Put \(S = \{x \in [0,1] : [0,x] \subseteq U\}\) and \(c = \sup S\).

Since \(0 \in S\), \(S \ne \emptyset\); it is bounded above by \(1\), so \(c \in [0,1]\) exists by completeness.`,
        },
      },
      {
        text: {
          ko: String.raw`먼저 \(c \in U\)임을 보입니다.

\(V\)가 \([0,1]\)에서 열려 있으므로 그 여집합 \(U = [0,1] \setminus V\)는 \([0,1]\)에서 닫혀 있습니다 — 즉 \(U\)는 자기 폐포와 같습니다: \(\overline{U} \cap [0,1] = U\).

\(c = 0\)이면 \(c = 0 \in U\)입니다. \(c > 0\)이면, 모든 \(\varepsilon > 0\)에 대해 supremum의 정의로 \(x \in S\)이고 \(c - \varepsilon < x \le c\)인 \(x\)가 존재합니다.

이때 \(x \in [0,x] \subseteq U\)이므로 근방 \((c-\varepsilon, c+\varepsilon)\)가 \(U\)와 만나고, 따라서 \(c \in \overline{U}\)입니다.

결론적으로 \(c \in \overline{U} \cap [0,1] = U\)입니다.`,
          en: String.raw`First, \(c \in U\).

Since \(V\) is open in \([0,1]\), its complement \(U = [0,1] \setminus V\) is closed in \([0,1]\) — that is, \(U\) equals its own closure in the subspace: \(\overline{U} \cap [0,1] = U\).

If \(c = 0\) then \(c = 0 \in U\). If \(c > 0\), then for every \(\varepsilon > 0\) the definition of supremum gives \(x \in S\) with \(c - \varepsilon < x \le c\).

That \(x\) satisfies \(x \in [0,x] \subseteq U\), so the neighborhood \((c-\varepsilon, c+\varepsilon)\) meets \(U\), and hence \(c \in \overline{U}\).

Therefore \(c \in \overline{U} \cap [0,1] = U\).`,
        },
      },
      {
        text: {
          ko: String.raw`다음으로 \([0,c] \subseteq U\)임을 확인합니다: \(y < c\)이면 supremum의 정의로 \(y < x \le c\)인 \(x \in S\)가 있어 \(y \in [0,x] \subseteq U\)이고, 끝점 \(c\) 자체도 앞 단계에서 \(U\)에 속합니다.

이제 \(c = 1\)임을 보입니다. \(c < 1\)이라 가정해 보세요.

\(c \in U\)이고 \(U\)가 \([0,1]\)에서 열려 있으므로, 어떤 \(\delta > 0\)에 대해 \((c-\delta, c+\delta) \cap [0,1] \subseteq U\)입니다.

\(\delta' = \min(\delta/2, (1-c)/2) > 0\)으로 두면 (\(c < 1\)이므로) \([0, c+\delta'] = [0,c] \cup (c, c+\delta'] \subseteq U\)가 됩니다.

즉 \(c + \delta' \in S\)인데 \(c + \delta' > c = \sup S\)라 모순입니다. 따라서 \(c = 1\)입니다.`,
          en: String.raw`Next, \([0,c] \subseteq U\): if \(y < c\) then the definition of supremum gives \(x \in S\) with \(y < x \le c\), so \(y \in [0,x] \subseteq U\); and the endpoint \(c\) itself lies in \(U\) by the previous step.

Now \(c = 1\). Suppose instead \(c < 1\).

Since \(c \in U\) and \(U\) is open in \([0,1]\), there is \(\delta > 0\) with \((c-\delta, c+\delta) \cap [0,1] \subseteq U\).

Put \(\delta' = \min(\delta/2, (1-c)/2) > 0\) (positive since \(c < 1\)). Then \([0, c+\delta'] = [0,c] \cup (c, c+\delta'] \subseteq U\).

So \(c + \delta' \in S\), yet \(c + \delta' > c = \sup S\) — a contradiction. Hence \(c = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \([0,1] = [0,c] \subseteq U\)입니다.

그런데 분리는 \(V \ne \emptyset\)를 요구하므로 \(v \in V\)인 \(v\)가 존재합니다.

\(v \in [0,1] \subseteq U\)이면서 \(v \in V\)이면 \(U \cap V \ne \emptyset\)가 되어 서로소라는 가정에 모순됩니다.

결론적으로 \([0,1]\)의 분리는 존재하지 않으며, \([0,1]\)은 연결집합입니다.

씬에서 절단이 늘 실패하는 이유가 이것입니다 — 절단점 \(t \in [0,1]\)은 어느 열린 쪽에도 속할 수 없고, 이 증명은 그 현상이 모든 열린 쌍에서 일어난다고 말합니다.`,
          en: String.raw`Hence \([0,1] = [0,c] \subseteq U\).

But a separation requires \(V \ne \emptyset\), so some \(v \in V\) exists.

Then \(v \in [0,1] \subseteq U\) and \(v \in V\), giving \(U \cap V \ne \emptyset\) — contradicting disjointness.

Therefore no separation of \([0,1]\) exists, and \([0,1]\) is connected.

This is why every cut in the scene fails: a cut point \(t \in [0,1]\) can belong to neither open side, and this proof shows the same phenomenon defeats every open pair, not just interval cuts.`,
        },
      },
    ],
  },
  {
    id: 'path-connected-implies-connected',
    statement: {
      ko: String.raw`\(X\)가 path-연결집합이면 \(X\)가 연결집합임을 완전히 증명하세요.

path-연결이란 임의의 \(a, b \in X\)에 대해 연속함수 \(\gamma : [0,1] \to X\)이고 \(\gamma(0) = a\), \(\gamma(1) = b\)인 것이 존재한다는 뜻입니다.

문제 1 (\([0,1]\)의 연결성)을 사용해도 됩니다.`,
      en: String.raw`Prove completely that if \(X\) is path-connected then \(X\) is connected.

Path-connected means that for any \(a, b \in X\) there is a continuous \(\gamma : [0,1] \to X\) with \(\gamma(0) = a\) and \(\gamma(1) = b\).

You may use Problem 1 (connectedness of \([0,1]\)).`,
    },
    display: [
      String.raw`\gamma : [0,1] \to X \text{ continuous},\quad A = \gamma^{-1}(U),\quad B = \gamma^{-1}(V)`,
      String.raw`[0,1] = A \cup B,\quad A \cap B = \emptyset,\quad A, B \text{ open in } [0,1]`,
    ],
    preset: { case: 'two-pieces', t: 1.5 },
    presetCaption: {
      ko: String.raw`\(X = [0,1] \cup [2,3]\), \(t = 1.5\): 분리가 성공하는 공간 — 조각 사이에는 path가 있을 수 없습니다. path가 있으면 그 역상이 \([0,1]\)을 분리해 버리기 때문입니다.`,
      en: String.raw`\(X = [0,1] \cup [2,3]\), \(t = 1.5\): a space where a separation succeeds — no path can cross between the pieces, for its preimage would separate \([0,1]\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(X\)가 path-연결이고, 모순을 위해 \(X = U \cup V\)가 분리라고 가정합니다: \(U, V\)는 \(X\)에서 열려 있고, 서로소이며, 모두 비어 있지 않습니다.

\(a \in U\), \(b \in V\)를 잡습니다.

path-연결성에 의해 연속함수 \(\gamma : [0,1] \to X\)이고 \(\gamma(0) = a\), \(\gamma(1) = b\)인 것이 존재합니다.`,
          en: String.raw`Let \(X\) be path-connected, and suppose for a contradiction that \(X = U \cup V\) is a separation: \(U, V\) open in \(X\), disjoint, and both nonempty.

Pick \(a \in U\) and \(b \in V\).

By path-connectedness there is a continuous \(\gamma : [0,1] \to X\) with \(\gamma(0) = a\) and \(\gamma(1) = b\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(A = \gamma^{-1}(U)\), \(B = \gamma^{-1}(V)\)로 둡니다.

\(\gamma\)가 연속이고 \(U, V\)가 \(X\)에서 열려 있으므로, \(A\)와 \(B\)는 \([0,1]\)에서 열려 있습니다: \(t_0 \in A\)이면 \(\gamma(t_0) \in U\)이고, \(U\)가 열려 있어 어떤 \(\varepsilon > 0\)에 대해 \(U\)가 \(\gamma(t_0)\)의 \(\varepsilon\)-근방을 포함하며, 연속성에 의해 \(\gamma\)는 \(t_0\)의 어떤 \(\delta\)-근방 전체를 그 \(\varepsilon\)-근방 안으로 보내므로, 그 \(\delta\)-근방은 \(A\) 안에 들어갑니다. \(B\)도 마찬가지입니다.`,
          en: String.raw`Put \(A = \gamma^{-1}(U)\) and \(B = \gamma^{-1}(V)\).

Since \(\gamma\) is continuous and \(U, V\) are open in \(X\), both \(A\) and \(B\) are open in \([0,1]\): if \(t_0 \in A\) then \(\gamma(t_0) \in U\); openness of \(U\) gives \(\varepsilon > 0\) with \(U\) containing the \(\varepsilon\)-neighborhood of \(\gamma(t_0)\); continuity then sends a whole \(\delta\)-neighborhood of \(t_0\) into that \(\varepsilon\)-neighborhood, so the \(\delta\)-neighborhood lies in \(A\). The same argument works for \(B\).`,
        },
      },
      {
        text: {
          ko: String.raw`네 가지 분리 조건을 \([0,1]\)에서 확인합니다.

덮음: 모든 \(t \in [0,1]\)에 대해 \(\gamma(t) \in X = U \cup V\)이므로 \(t \in A \cup B\), 즉 \([0,1] = A \cup B\)입니다.

서로소: \(t \in A \cap B\)이면 \(\gamma(t) \in U \cap V = \emptyset\)가 되어 불가능하므로 \(A \cap B = \emptyset\)입니다.

비어 있지 않음: \(0 \in A\) (\(\gamma(0) = a \in U\))이고 \(1 \in B\) (\(\gamma(1) = b \in V\))입니다.

즉 \([0,1] = A \cup B\)는 \([0,1]\)의 분리입니다.`,
          en: String.raw`Check the four separation conditions in \([0,1]\).

Cover: for every \(t \in [0,1]\), \(\gamma(t) \in X = U \cup V\), so \(t \in A \cup B\); that is, \([0,1] = A \cup B\).

Disjoint: if \(t \in A \cap B\) then \(\gamma(t) \in U \cap V = \emptyset\), impossible; so \(A \cap B = \emptyset\).

Nonempty: \(0 \in A\) (since \(\gamma(0) = a \in U\)) and \(1 \in B\) (since \(\gamma(1) = b \in V\)).

Thus \([0,1] = A \cup B\) is a separation of \([0,1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`이는 문제 1 — \([0,1]\)은 연결집합이라 분리가 존재하지 않는다 — 에 모순됩니다.

따라서 \(X\)의 분리 \(X = U \cup V\)는 존재할 수 없고, \(X\)는 연결집합입니다.

역은 성립하지 않습니다: 위상수학자의 사인 곡선의 폐포는 연결집합이지만 path-연결집합은 아닙니다.`,
          en: String.raw`This contradicts Problem 1 — \([0,1]\) is connected, so it admits no separation.

Hence no separation \(X = U \cup V\) of \(X\) can exist, and \(X\) is connected.

The converse is false: the closure of the topologist's sine curve is connected but not path-connected.`,
        },
      },
    ],
  },
  {
    id: 'rationals-totally-disconnected',
    statement: {
      ko: String.raw`두 점 이상을 가진 \(\mathbb{Q}\)의 모든 부분집합 \(A\)는 연결집합이 아님을 완전히 증명하세요.

결론적으로 \(\mathbb{Q}\)는 완전 비연결(totally disconnected)입니다: 연결인 부분집합은 한 점 집합과 \(\emptyset\)뿐입니다.`,
      en: String.raw`Prove completely that every subset \(A \subseteq \mathbb{Q}\) with at least two points is disconnected.

Conclude that \(\mathbb{Q}\) is totally disconnected: its only connected subsets are singletons and \(\emptyset\).`,
    },
    display: [
      String.raw`\alpha = p + \frac{q - p}{\sqrt{2}}, \qquad \sqrt{2} = \frac{q - p}{\alpha - p} \notin \mathbb{Q}`,
      String.raw`A = \bigl(A \cap (-\infty, \alpha)\bigr) \cup \bigl(A \cap (\alpha, \infty)\bigr)`,
    ],
    preset: { case: 'rationals', t: 0.707 },
    presetCaption: {
      ko: String.raw`절단 \(c = \sqrt{2}/2 \approx 0.7071\): 무리수라서 유리수 점과 겹치지 않으므로 \(\mathbb{Q} \cap [0,1]\)을 덮으면서 갈라놓습니다.`,
      en: String.raw`The cut \(c = \sqrt{2}/2 \approx 0.7071\): being irrational, it hits no rational point, so it covers and splits \(\mathbb{Q} \cap [0,1]\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(A \subseteq \mathbb{Q}\)가 두 점 이상을 가진다고 하고, \(p, q \in A\)이며 \(p < q\)인 두 점을 잡습니다.

\(\alpha = p + \frac{q - p}{\sqrt{2}}\)로 둡니다.

\(0 < \frac{1}{\sqrt{2}} < 1\)이므로 (즉 \(1 < \sqrt{2} < 2\)이므로) \(\alpha\)는 \(p\)와 \(q\) 사이의 엄격한 볼록결합입니다:

\(p < \alpha < q\).`,
          en: String.raw`Let \(A \subseteq \mathbb{Q}\) have at least two points, and pick \(p, q \in A\) with \(p < q\).

Put \(\alpha = p + \frac{q - p}{\sqrt{2}}\).

Since \(0 < \frac{1}{\sqrt{2}} < 1\) (that is, \(1 < \sqrt{2} < 2\)), \(\alpha\) is a strict convex combination of \(p\) and \(q\):

\(p < \alpha < q\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\alpha\)는 무리수입니다. \(\alpha \in \mathbb{Q}\)라 가정해 보세요.

그러면 \(\alpha - p \in \mathbb{Q}\)이고 \(\alpha - p = \frac{q - p}{\sqrt{2}} > 0\)라서 0이 아니며, 식을 정리하면 \(\sqrt{2} = \frac{q - p}{\alpha - p}\)가 됩니다.

\(q - p \in \mathbb{Q}\)이고 0이 아니므로 이 비율은 유리수입니다 — \(\sqrt{2} \notin \mathbb{Q}\)라는 사실에 모순됩니다.

따라서 \(\alpha \notin \mathbb{Q}\)이고, 특히 \(\alpha\)는 \(A\)의 어떤 원소와도 같지 않습니다.`,
          en: String.raw`The number \(\alpha\) is irrational. Suppose \(\alpha \in \mathbb{Q}\).

Then \(\alpha - p \in \mathbb{Q}\), and \(\alpha - p = \frac{q - p}{\sqrt{2}} > 0\), so it is nonzero; rearranging gives \(\sqrt{2} = \frac{q - p}{\alpha - p}\).

Since \(q - p \in \mathbb{Q}\) is nonzero, this ratio is rational — contradicting the irrationality of \(\sqrt{2}\).

Hence \(\alpha \notin \mathbb{Q}\); in particular, \(\alpha\) equals no element of \(A\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(U = A \cap (-\infty, \alpha)\), \(V = A \cap (\alpha, \infty)\)로 둡니다.

열림: \((-\infty, \alpha)\)와 \((\alpha, \infty)\)는 \(\mathbb{R}\)에서 열린 구간이므로, \(U\)와 \(V\)는 부분공간 \(A\)에서 열려 있습니다.

서로소: \(x < \alpha\)와 \(x > \alpha\)는 양립할 수 없으므로 \(U \cap V = \emptyset\)입니다.

덮음: \(a \in A\)이면 \(a \in \mathbb{Q}\)라서 \(a \ne \alpha\)이고, 따라서 \(a < \alpha\) (즉 \(a \in U\))이거나 \(a > \alpha\) (즉 \(a \in V\))입니다. 즉 \(A = U \cup V\)입니다.

비어 있지 않음: \(p \in U\) (\(p < \alpha\))이고 \(q \in V\) (\(\alpha < q\))입니다.`,
          en: String.raw`Put \(U = A \cap (-\infty, \alpha)\) and \(V = A \cap (\alpha, \infty)\).

Open: \((-\infty, \alpha)\) and \((\alpha, \infty)\) are open rays in \(\mathbb{R}\), so \(U\) and \(V\) are open in the subspace \(A\).

Disjoint: \(x < \alpha\) and \(x > \alpha\) are incompatible, so \(U \cap V = \emptyset\).

Cover: if \(a \in A\) then \(a \in \mathbb{Q}\), so \(a \ne \alpha\), and therefore \(a < \alpha\) (so \(a \in U\)) or \(a > \alpha\) (so \(a \in V\)). That is, \(A = U \cup V\).

Nonempty: \(p \in U\) (as \(p < \alpha\)) and \(q \in V\) (as \(\alpha < q\)).`,
        },
      },
      {
        text: {
          ko: String.raw`즉 \(A = U \cup V\)는 \(A\)의 분리이므로 \(A\)는 연결집합이 아닙니다.

\(A\)는 두 점 이상을 가진 \(\mathbb{Q}\)의 임의의 부분집합이었으므로, \(\mathbb{Q}\)의 연결인 부분집합은 점이 최대 하나뿐입니다 — \(\mathbb{Q}\)는 완전 비연결입니다.

씬의 절단 \(\sqrt{2}/2\)가 바로 이 \(\alpha\)의 한 예입니다 (\(p = 0\), \(q = 1\)에서 \(\alpha = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}\)). 유리수 사이에는 늘 무리수가 끼어들어 집합을 갈라놓습니다.`,
          en: String.raw`Thus \(A = U \cup V\) is a separation of \(A\), so \(A\) is disconnected.

Since \(A\) was an arbitrary subset of \(\mathbb{Q}\) with at least two points, every connected subset of \(\mathbb{Q}\) has at most one point — \(\mathbb{Q}\) is totally disconnected.

The scene's cut \(\sqrt{2}/2\) is exactly this \(\alpha\) for \(p = 0\), \(q = 1\): \(\alpha = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}\). Between any two rationals an irrational slips in and splits the set.`,
        },
      },
    ],
  },
];
