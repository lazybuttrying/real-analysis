import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the topologist's sine curve scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/topologist-sine.test.ts): the curve sampling, the
 * witness sequences x_n = 1/(pi/2 + 2 pi n), 1/(3 pi/2 + 2 pi n),
 * 1/(pi n), and the preset ranges.
 */
export const topologistSineProblems: readonly ProblemMeta[] = [
  {
    id: 'topologist-sine-connected',
    statement: {
      ko: String.raw`\(S = \{(x, \sin(1/x)) : x > 0\} \subseteq \mathbb{R}^2\)이 연결집합임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that \(S = \{(x, \sin(1/x)) : x > 0\} \subseteq \mathbb{R}^2\) is connected.`,
    },
    display: [
      String.raw`S = f((0,\infty)), \qquad f(x) = (x,\, \sin(1/x))`,
    ],
    preset: { xMin: 0.05, showSegment: true, showSeq: true },
    presetCaption: {
      ko: String.raw`\(x_{\min} = 0.05\): 곡선 \(S\) 하나만 봐도 0 근처에서 무한히 진동하지만, 끊어지지 않은 하나의 연속 곡선입니다.`,
      en: String.raw`\(x_{\min} = 0.05\): the curve \(S\) alone oscillates infinitely near 0, yet it is one unbroken continuous curve.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((0,\infty)\)는 연결집합입니다 (구간이므로 — \(\mathbb{R}\)의 연결성 증명과 같은 \(\sup\) 논증이 그대로 적용됩니다). 사상 \(f(x) = (x, \sin(1/x))\)는 두 좌표함수가 모두 연속이므로 연속이고, 그 상이 정확히 \(S\)입니다.`,
          en: String.raw`\((0,\infty)\) is connected (it is an interval — the same \(\sup\) argument as for \(\mathbb{R}\) applies verbatim). The map \(f(x) = (x, \sin(1/x))\) is continuous since both coordinate functions are, and its image is exactly \(S\).`,
        },
      },
      {
        text: {
          ko: String.raw`연속함수 아래에서 연결집합의 상은 연결집합입니다: \(f(X) = A \cup B\)가 서로소인 비어 있지 않은 (상대적으로) 열린 집합으로의 분해라면, \(X = f^{-1}(A) \cup f^{-1}(B)\)도 서로소인 비어 있지 않은 상대 열린 집합으로의 분해가 되어 \(X\)의 연결성에 모순되기 때문입니다 (\(A, B\)가 비어 있지 않으면 그 역상도 비어 있지 않습니다).`,
          en: String.raw`The continuous image of a connected set is connected: if \(f(X) = A \cup B\) were a separation into disjoint nonempty relatively open sets, then \(X = f^{-1}(A) \cup f^{-1}(B)\) would be a separation of \(X\) into disjoint nonempty relatively open sets (\(A, B\) nonempty implies their preimages are nonempty), contradicting the connectedness of \(X\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(S = f((0,\infty))\)는 연결집합입니다. 연결집합의 폐포도 연결집합이므로 \(T = \overline{S}\) 역시 연결집합입니다 — 아래 문제 2에서 이 폐포를 구합니다.`,
          en: String.raw`Hence \(S = f((0,\infty))\) is connected. The closure of a connected set is connected, so \(T = \overline{S}\) is connected as well — problem 2 below computes this closure.`,
        },
      },
    ],
  },
  {
    id: 'topologist-sine-closure',
    statement: {
      ko: String.raw`\(\overline{S} = S \cup \big(\{0\} \times [-1,1]\big)\)임을 완전히 증명하세요.

즉 \(S\)의 폐포는 \(S\)에 수직 선분 \(\{0\} \times [-1,1]\)을 더한 것과 같습니다.`,
      en: String.raw`Prove completely that \(\overline{S} = S \cup \big(\{0\} \times [-1,1]\big)\): the closure of \(S\) is \(S\) together with the vertical segment \(\{0\} \times [-1,1]\).`,
    },
    display: [
      String.raw`\overline{S} = S \cup \big(\{0\} \times [-1,1]\big)`,
    ],
    preset: { xMin: 0.01, showSegment: true, showSeq: true },
    presetCaption: {
      ko: String.raw`\(x_{\min} = 0.01\): 0에 더 가까이 다가가면 점열 \((x_n, 1)\), \((x_n, -1)\)이 빨간 선분의 양 끝점으로 수렴하는 것이 보입니다.`,
      en: String.raw`\(x_{\min} = 0.01\): zooming closer to 0 shows the sequences \((x_n, 1)\), \((x_n, -1)\) converging onto the endpoints of the red segment.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\supseteq\): \(S \subseteq \overline{S}\)는 자명합니다. \(|y| \le 1\)인 점 \((0,y)\)에 대해 \(x_n = \frac{1}{\arcsin y + 2\pi n}\) (\(n \ge 1\))이라 두면 \(x_n \to 0^+\)이고 \(\sin(1/x_n) = \sin(\arcsin y + 2\pi n) = y\)입니다.

따라서 \((x_n, y) \in S\)가 \((0,y)\)로 수렴하므로, \(\{0\} \times [-1,1]\)의 모든 점은 \(S\)의 극한점입니다.`,
          en: String.raw`\(\supseteq\): \(S \subseteq \overline{S}\) is trivial. For \((0,y)\) with \(|y| \le 1\), put \(x_n = \frac{1}{\arcsin y + 2\pi n}\) (\(n \ge 1\)); then \(x_n \to 0^+\) and \(\sin(1/x_n) = \sin(\arcsin y + 2\pi n) = y\).

Hence \((x_n, y) \in S\) converges to \((0,y)\), so every point of \(\{0\} \times [-1,1]\) is a limit point of \(S\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\subseteq\): \(p \in \overline{S}\)라 하세요. \(p = (x,y)\)에서 \(x < 0\)이면 공 \(B(p, |x|/2)\)는 \(S\)의 점(첫 좌표가 모두 양수)을 전혀 포함하지 않으므로 불가능합니다. \(x > 0\)이고 \(p \notin S\)라 가정하면, \(K = f([x/2,\, 3x/2])\) (\(f\)는 위 문제의 사상)는 컴팩트 집합의 연속상이므로 컴팩트, 따라서 닫혀 있습니다.

임의의 \(r > 0\)를 잡습니다: 공 \(B(p, \min(r, x/2))\)와 만나는 \(S\)의 점은 첫 좌표가 \((x/2,\, 3x/2)\) 안에 있으므로 \(K\)에 속합니다. \(p \in \overline{S}\)이므로 이 공은 \(S\)와 만나고, 따라서 \(K\)와도 만나므로 \(\operatorname{dist}(p, K) < r\)입니다. \(r > 0\)이 임의였으므로 \(p \in \overline{K} = K \subseteq S\) — 모순입니다. 그러므로 \(x > 0\)이면 \(p \in S\)입니다.`,
          en: String.raw`\(\subseteq\): let \(p \in \overline{S}\). If \(p = (x,y)\) with \(x < 0\), the ball \(B(p, |x|/2)\) contains no point of \(S\) (whose first coordinates are all positive) — impossible. If \(x > 0\) and \(p \notin S\), then \(K = f([x/2,\, 3x/2])\) (\(f\) from the problem above) is compact as a continuous image of a compact set, hence closed.

Now let \(r > 0\) be arbitrary: points of \(S\) meeting \(B(p, \min(r, x/2))\) have first coordinate in \((x/2,\, 3x/2)\), so they lie in \(K\). Since \(p \in \overline{S}\), this ball meets \(S\), hence meets \(K\), so \(\operatorname{dist}(p, K) < r\). As \(r > 0\) was arbitrary, \(p \in \overline{K} = K \subseteq S\) — a contradiction. Thus \(x > 0\) implies \(p \in S\).`,
        },
      },
      {
        text: {
          ko: String.raw`마지막으로 \(p = (0,y)\)인 경우: \((u,v) \in S\)에 대해 \(|p - (u,v)| \ge |y - v| \ge |y| - 1\)입니다 (\(|v| = |\sin| \le 1\)). \(|y| > 1\)이면 공 \(B(p, (|y|-1)/2)\)가 \(S\)와 만나지 않아 \(p \in \overline{S}\)에 모순됩니다.

따라서 \(|y| \le 1\), 즉 \(p \in \{0\} \times [-1,1]\)입니다. 세 경우를 합치면 \(\overline{S} = S \cup (\{0\} \times [-1,1])\)입니다.`,
          en: String.raw`Finally, if \(p = (0,y)\): for \((u,v) \in S\), \(|p - (u,v)| \ge |y - v| \ge |y| - 1\) (since \(|v| = |\sin| \le 1\)). If \(|y| > 1\), the ball \(B(p, (|y|-1)/2)\) misses \(S\), contradicting \(p \in \overline{S}\).

Hence \(|y| \le 1\), i.e. \(p \in \{0\} \times [-1,1]\). The three cases together give \(\overline{S} = S \cup (\{0\} \times [-1,1])\).`,
        },
      },
    ],
  },
  {
    id: 'topologist-sine-no-path',
    statement: {
      ko: String.raw`\(T = \overline{S}\)는 경로연결집합이 아님을 완전히 증명하세요: 선분 \(\{0\} \times [-1,1]\) 위의 점에서 \(S\)의 점으로 가는 \(T\) 안의 경로는 존재하지 않습니다.`,
      en: String.raw`Prove completely that \(T = \overline{S}\) is not path-connected: no path in \(T\) leads from a point of the segment \(\{0\} \times [-1,1]\) to a point of \(S\).`,
    },
    display: [
      String.raw`\gamma(0) \in \{0\} \times [-1,1],\ \gamma(1) \in S \implies \text{no continuous } \gamma: [0,1] \to T`,
    ],
    preset: { xMin: 0.05, showSegment: true, showSeq: true },
    presetCaption: {
      ko: String.raw`빨간 선분에서 곡선으로 "걸어가" 보세요 — 0 근처의 무한 진동이 어떤 경로도 막아섭니다. 증명은 이 장애물을 수열로 포착합니다.`,
      en: String.raw`Try "walking" from the red segment into the curve — the infinite oscillation near 0 blocks every path. The proof captures this obstruction with sequences.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\gamma: [0,1] \to T\)가 연속이고 \(\gamma(0) \in \{0\} \times [-1,1]\), \(\gamma(1) \in S\)라고 가정하고 모순을 이끌어냅니다. \(\gamma(t) = (x(t), y(t))\)라 쓰고, \(c = \sup\{t \in [0,1] : x(t) = 0\}\)이라 둡니다 (0을 포함하므로 비어 있지 않음). 연속성에 의해 \(x(c) = 0\)이고, \(x(1) > 0\)이므로 \(c < 1\)입니다.

또한 \(T \subseteq \{x \ge 0\}\)입니다 (\(T = \overline{S}\)의 정의에 의해: \(S\)의 점은 첫 좌표가 양수이고 극한점인 수직 선분은 첫 좌표가 \(0\)임), 따라서 모든 \(t\)에서 \(x(t) \ge 0\)입니다. \(t \in (c,1]\)에서는 \(x(t) \ne 0\)이므로 (그렇지 않으면 \(\sup\)이 더 커집니다) \(x(t) > 0\)입니다.`,
          en: String.raw`Assume a continuous \(\gamma: [0,1] \to T\) with \(\gamma(0) \in \{0\} \times [-1,1]\) and \(\gamma(1) \in S\), aiming for a contradiction. Write \(\gamma(t) = (x(t), y(t))\) and put \(c = \sup\{t \in [0,1] : x(t) = 0\}\) (nonempty, containing \(0\)). By continuity \(x(c) = 0\), and \(c < 1\) since \(x(1) > 0\).

Moreover \(T \subseteq \{x \ge 0\}\) by the definition of \(T = \overline{S}\) (points of \(S\) have positive first coordinate and the limit segment has first coordinate \(0\)), so \(x(t) \ge 0\) for all \(t\). For \(t \in (c,1]\) we also have \(x(t) \ne 0\) (otherwise the supremum would be larger), hence \(x(t) > 0\) on \((c,1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(t \in (c,1]\)에서 \(\gamma(t) \in T\)의 첫 좌표가 양수이므로 \(\gamma(t) \in S\), 즉 \(y(t) = \sin(1/x(t))\)입니다. \(v_n = \frac{1}{2\pi n + \pi/2} \to 0\)이므로 \(n\)이 크면 \(v_n < x(1)\)입니다. \([c,1]\)에서 \(x(c) = 0 < v_n < x(1)\)이므로 중간값 정리에 의해 \(x(t_n) = v_n\)인 \(t_n \in (c,1]\)이 존재합니다.

이때 \(y(t_n) = \sin(2\pi n + \pi/2) = 1\)입니다. \((t_n)\)의 모든 집적점 \(t^* \in [c,1]\)은 \(x(t^*) = \lim v_n = 0\)을 만족하므로 \((c,1]\)에서 \(x > 0\)인 데 의해 \(t^* = c\)입니다 — 따라서 \(t_n \to c\)이고, 연속성에 의해 \(y(c) = \lim y(t_n) = 1\)입니다.`,
          en: String.raw`For \(t \in (c,1]\), \(\gamma(t) \in T\) has positive first coordinate, so \(\gamma(t) \in S\) and \(y(t) = \sin(1/x(t))\). Since \(v_n = \frac{1}{2\pi n + \pi/2} \to 0\), we have \(v_n < x(1)\) for large \(n\). On \([c,1]\), \(x(c) = 0 < v_n < x(1)\), so the intermediate value theorem gives \(t_n \in (c,1]\) with \(x(t_n) = v_n\).

Then \(y(t_n) = \sin(2\pi n + \pi/2) = 1\). Every subsequential limit \(t^* \in [c,1]\) of \((t_n)\) satisfies \(x(t^*) = \lim v_n = 0\), forcing \(t^* = c\) (as \(x > 0\) on \((c,1]\)). Hence \(t_n \to c\), and by continuity \(y(c) = \lim y(t_n) = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`마찬가지로 \(w_n = \frac{1}{2\pi n + 3\pi/2}\)에 대해 \(x(s_n) = w_n\)인 \(s_n \in (c,1]\)을 잡으면 \(y(s_n) = \sin(2\pi n + 3\pi/2) = -1\)이고 같은 논증으로 \(s_n \to c\)이므로 \(y(c) = -1\)입니다. \(y(c) = 1\)과 모순되므로, 가정한 경로는 존재하지 않습니다.

\(T\)는 연결집합이지만 경로연결집합이 아닙니다.`,
          en: String.raw`Likewise, with \(w_n = \frac{1}{2\pi n + 3\pi/2}\), pick \(s_n \in (c,1]\) with \(x(s_n) = w_n\); then \(y(s_n) = \sin(2\pi n + 3\pi/2) = -1\), and the same argument gives \(s_n \to c\), so \(y(c) = -1\). This contradicts \(y(c) = 1\), so the assumed path cannot exist.

\(T\) is connected but not path-connected.`,
        },
      },
    ],
  },
];
