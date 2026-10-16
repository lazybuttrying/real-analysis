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
    id: 'compact-closed-seq',
    statement: {
      ko: String.raw`\([0,1]\)이 순차 컴팩트임을 보이세요: \([0,1]\) 안의 모든 수열은 극한이 \([0,1]\) 안에 있는 수렴 부분수열을 갖습니다 (볼차노–바이어슈트라스).`,
      en: String.raw`Show that \([0,1]\) is sequentially compact: every sequence in \([0,1]\) has a convergent subsequence whose limit stays in \([0,1]\) (Bolzano–Weierstrass).`,
    },
    display: [
      String.raw`(a_n) \subset [0,1] \Rightarrow \exists\,(a_{n_k}) \to L \in [0,1]`,
      String.raw`K \text{ compact } \iff K \text{ closed and bounded} \quad \text{(Heine--Borel)}`,
    ],
    preset: { set: 'closed', step: 6 },
    presetCaption: {
      ko: String.raw`\(k = 6\): 처음 6개 열린구간의 합집합 \([-0.18, 1.18]\)이 \([0,1]\)을 덮습니다 — 유한 부분커버가 존재합니다.`,
      en: String.raw`\(k = 6\): the union \([-0.18, 1.18]\) of the first 6 open intervals covers \([0,1]\) — a finite subcover exists.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((a_n)\)을 \([0,1]\) 안의 임의의 수열이라 하자. 이 수열은 유계이므로 볼차노–바이어슈트라스 정리에 따라 수렴하는 부분수열 \((a_{n_k}) \to L\)이 존재한다.`,
          en: String.raw`Let \((a_n)\) be any sequence in \([0,1]\). It is bounded, so the Bolzano–Weierstrass theorem gives a convergent subsequence \((a_{n_k}) \to L\).`,
        },
      },
      {
        text: {
          ko: String.raw`모든 \(k\)에 대해 \(0 \le a_{n_k} \le 1\)이므로, 극한을 취하면 부등식이 보존되어 \(0 \le L \le 1\)이다. 즉 \(L \in [0,1]\) — 닫힌 구간은 극한점을 놓치지 않는다.`,
          en: String.raw`Since \(0 \le a_{n_k} \le 1\) for every \(k\), passing to the limit preserves the inequalities, giving \(0 \le L \le 1\). Hence \(L \in [0,1]\) — a closed interval never loses a limit point.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \([0,1]\) 안의 모든 수열은 극한이 \([0,1]\) 안에 있는 수렴 부분수열을 갖는다: \([0,1]\)은 순차 컴팩트이다.`,
          en: String.raw`Every sequence in \([0,1]\) therefore has a convergent subsequence with its limit in \([0,1]\): \([0,1]\) is sequentially compact.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\mathbb{R}\)에서는 순차 컴팩트 ⟺ 컴팩트 (하이네–보렐: 닫힘 + 유계)이다. 열린 커버 쪽 그림도 같은 이야기이다: 위 장면처럼 처음 6개 구간 \(U_1, \dots, U_6\)의 합집합 \([-0.18, 1.18]\)이 \([0,1]\) 전체를 덮는다 — 커버 전체를 다 쓸 필요가 없다. (열린 커버 정의의 동치성 증명은 아이디어 수준에서만 본다.)`,
          en: String.raw`In \(\mathbb{R}\), sequential compactness ⟺ compactness (Heine–Borel: closed + bounded). The open-cover picture tells the same story: the union \([-0.18, 1.18]\) of the first 6 intervals \(U_1, \dots, U_6\) already covers all of \([0,1]\) — the whole cover is never needed. (The proof that the open-cover definition is equivalent is shown at the idea level only.)`,
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
      String.raw`y_n = f(x_n), \quad x_{n_k} \to x \in K \Rightarrow f(x_{n_k}) \to f(x) \in f(K)`,
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
          ko: String.raw`\(y_n \in f(K)\)를 임의의 수열이라 하자. 각 \(y_n = f(x_n)\)인 \(x_n \in K\)를 택한다.`,
          en: String.raw`Let \(y_n \in f(K)\) be any sequence, and pick \(x_n \in K\) with \(y_n = f(x_n)\) for each \(n\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(K\)가 컴팩트이므로 \((x_n)\)은 \(x \in K\)로 수렴하는 부분수열 \((x_{n_k})\)를 갖는다 (순차 컴팩트).`,
          en: String.raw`Since \(K\) is compact, \((x_n)\) has a subsequence \((x_{n_k})\) converging to some \(x \in K\) (sequential compactness).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f\)는 \(x\)에서 연속이므로 \(f(x_{n_k}) \to f(x)\)이다. 즉 부분수열 \(y_{n_k} = f(x_{n_k})\)는 \(f(x) \in f(K)\)로 수렴한다.`,
          en: String.raw`Continuity of \(f\) at \(x\) gives \(f(x_{n_k}) \to f(x)\). So the subsequence \(y_{n_k} = f(x_{n_k})\) converges to \(f(x) \in f(K)\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(f(K)\) 안의 모든 수열은 \(f(K)\) 안의 점으로 수렴하는 부분수열을 갖는다: \(f(K)\)는 순차 컴팩트이며, 따라서 컴팩트이다. 이것이 최댓값 정리(evt 씬)의 엔진이다 — \([0,1]\) 위의 연속함수 \(f\)에 대해 \(f([0,1])\)이 컴팩트이므로 \(\mathbb{R}\)에서 닫혀 있고 유계이며, 상한·하한을 실제로 취한다.`,
          en: String.raw`Every sequence in \(f(K)\) therefore has a subsequence converging to a point of \(f(K)\): \(f(K)\) is sequentially compact, hence compact. This is the engine of the Extreme Value Theorem (the evt scene) — for continuous \(f\) on \([0,1]\), the set \(f([0,1])\) is compact, hence closed and bounded in \(\mathbb{R}\), so its supremum and infimum are actually attained.`,
        },
      },
    ],
  },
];
