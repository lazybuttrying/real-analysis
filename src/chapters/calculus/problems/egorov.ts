import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Egorov scene
 * (sliding bump f_n = 1_{[1/(n+1), 1/n]} on [0,1]). Imports nothing except
 * types. Every number below was verified against the model
 * (tests/egorov.test.ts): the bad set E_{n,delta} = (0, 1/n] has measure
 * 1/n for 0 < delta <= 1; on [1/n, 1], f_k is identically 0 for k >= n+1.
 */
export const egorovProblems: readonly ProblemMeta[] = [
  {
    id: 'egorov-concrete',
    statement: {
      ko: String.raw`\(f_n(x) = 1_{[1/(n+1),\,1/n]}(x)\) (\(0 \le x \le 1\))라 하세요.

\(0 < \delta \le 1\)에 대해 나쁜 집합 \(E_{n,\delta} = \{x : \text{어떤 } k \ge n\text{에 대해 } |f_k(x)| \ge \delta\}\)가 \((0, 1/n]\)과 같음을 보이고, \(\varepsilon > 0\)마다 \(n > 1/\varepsilon\)을 택하면 \(m(E_{n,\delta}) < \varepsilon\)이면서 \(f_k \to 0\)이 \([1/n, 1]\)에서 균등함을 완전히 증명하세요 — 이 수열에 대한 에고로프 정리입니다.`,
      en: String.raw`Let \(f_n(x) = 1_{[1/(n+1),\,1/n]}(x)\) (\(0 \le x \le 1\)).

For \(0 < \delta \le 1\), show that the bad set \(E_{n,\delta} = \{x : |f_k(x)| \ge \delta \text{ for some } k \ge n\}\) equals \((0, 1/n]\), and prove completely that for every \(\varepsilon > 0\), choosing \(n > 1/\varepsilon\) gives \(m(E_{n,\delta}) < \varepsilon\) while \(f_k \to 0\) uniformly on \([1/n, 1]\) — Egorov's theorem for this sequence.`,
    },
    display: [
      String.raw`E_{n,\delta} = \bigcup_{k \ge n}\left[\frac{1}{k+1}, \frac{1}{k}\right] = \left(0, \frac{1}{n}\right], \quad m(E_{n,\delta}) = \frac{1}{n}`,
      String.raw`\sup_{x \in [1/n,\,1]} |f_k(x)| = 0 \quad (k \ge n+1)`,
    ],
    preset: { delta: 0.5, n: 6 },
    presetCaption: {
      ko: String.raw`\(\delta = 0.5\), \(n = 6\): 나쁜 집합 \((0, \frac16]\)의 측도는 \(\frac16 \approx 0.1667\). 좋은 집합 \([\frac16, 1]\) 위에서는 \(k \ge 7\)일 때 \(f_k \equiv 0\) — 균등수렴이 눈에 보입니다.`,
      en: String.raw`\(\delta = 0.5\), \(n = 6\): the bad set \((0, \frac16]\) has measure \(\frac16 \approx 0.1667\). On the good set \([\frac16, 1]\), \(f_k \equiv 0\) for \(k \ge 7\) — uniform convergence you can see.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(0 < \delta \le 1\)이므로 \(|f_k(x)| \ge \delta\)는 \(f_k(x) = 1\)과 동치이고, 이는 \(x \in [\frac{1}{k+1}, \frac{1}{k}]\)와 동치입니다.

따라서 \(E_{n,\delta} = \bigcup_{k \ge n} [\frac{1}{k+1}, \frac{1}{k}]\)입니다.

\(x\)가 이 합집합에 속하면 어떤 \(k \ge n\)에 대해 \(0 < x \le \frac{1}{k} \le \frac{1}{n}\)이므로 \(x \in (0, \frac{1}{n}]\)입니다. 역으로 \(0 < x \le \frac{1}{n}\)이면 구간들 \((\frac{1}{k+1}, \frac{1}{k}]\)이 \((0, 1]\)을 분할하므로 \(x\)를 품은 \(k\)가 하나 있고, \(\frac{1}{k+1} < x \le \frac{1}{n}\)에서 \(k + 1 > n\), 즉 \(k \ge n\)입니다.

(\(x = 0\)에서는 모든 \(f_k\)가 0이므로 나쁜 집합에 들어가지 않습니다.) 따라서 \(E_{n,\delta} = (0, \frac{1}{n}]\)이고 측도는 \(\frac{1}{n}\)입니다.`,
          en: String.raw`Since \(0 < \delta \le 1\), \(|f_k(x)| \ge \delta\) is equivalent to \(f_k(x) = 1\), i.e. to \(x \in [\frac{1}{k+1}, \frac{1}{k}]\).

Hence \(E_{n,\delta} = \bigcup_{k \ge n} [\frac{1}{k+1}, \frac{1}{k}]\).

If \(x\) lies in this union, then for some \(k \ge n\), \(0 < x \le \frac{1}{k} \le \frac{1}{n}\), so \(x \in (0, \frac{1}{n}]\). Conversely, if \(0 < x \le \frac{1}{n}\), the intervals \((\frac{1}{k+1}, \frac{1}{k}]\) partition \((0, 1]\), so exactly one \(k\) contains \(x\); from \(\frac{1}{k+1} < x \le \frac{1}{n}\) we get \(k + 1 > n\), i.e. \(k \ge n\).

(At \(x = 0\) every \(f_k\) is 0, so 0 is not in the bad set.) Thus \(E_{n,\delta} = (0, \frac{1}{n}]\) with measure \(\frac{1}{n}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)가 주어지면 \(n > 1/\varepsilon\)인 \(n\)을 택합니다 (예: \(n = \lfloor 1/\varepsilon \rfloor + 1\)). 그러면 \(m(E_{n,\delta}) = 1/n < \varepsilon\)입니다 — 나쁜 집합을 임의로 작게 만들 수 있습니다.`,
          en: String.raw`Given \(\varepsilon > 0\), pick \(n > 1/\varepsilon\) (e.g. \(n = \lfloor 1/\varepsilon \rfloor + 1\)). Then \(m(E_{n,\delta}) = 1/n < \varepsilon\) — the bad set can be made arbitrarily small.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(F = [\frac{1}{n}, 1]\) 위에서 균등수렴을 확인합니다.

\(k \ge n+1\)이고 \(x \ge \frac{1}{n}\)이면 \(x \ge \frac{1}{n} > \frac{1}{n+1} \ge \frac{1}{k}\)이므로 \(x\)는 혹 \([\frac{1}{k+1}, \frac{1}{k}]\)의 오른쪽 끝점보다도 큽니다 — 즉 \(f_k(x) = 0\)입니다.

따라서 모든 \(k \ge n+1\)에 대해 \(\sup_{x \in F} |f_k(x)| = 0\)이고, \(f_k \to 0\)이 \(F\)에서 균등합니다 (단 하나의 항 \(f_n\)이 점 \(\frac{1}{n}\)에서 1이지만, 꼬리에는 영향을 주지 않습니다).`,
          en: String.raw`Now check uniform convergence on \(F = [\frac{1}{n}, 1]\).

If \(k \ge n+1\) and \(x \ge \frac{1}{n}\), then \(x \ge \frac{1}{n} > \frac{1}{n+1} \ge \frac{1}{k}\), so \(x\) lies strictly above the right endpoint of the bump \([\frac{1}{k+1}, \frac{1}{k}]\) — hence \(f_k(x) = 0\).

So \(\sup_{x \in F} |f_k(x)| = 0\) for every \(k \ge n+1\), and \(f_k \to 0\) uniformly on \(F\) (the single term \(f_n\) equals 1 at the point \(\frac{1}{n}\), but one term never affects the tail).`,
        },
      },
      {
        text: {
          ko: String.raw`정리하면: \(f_n \to 0\)은 \([0, 1]\) 전체에서 점별로 성립하지만 (\([0,1]\)에서 \(\sup f_n = 1\)이므로 균등하지는 않습니다), 측도가 \(\varepsilon\)보다 작은 나쁜 집합 \((0, \frac{1}{n}]\) 하나만 도려내면 나머지는 균등수렴이 됩니다. 이것이 바로 이 수열에 대한 에고로프 정리이며, 씬에서 \(n\)을 키우면 빨간 영역이 \(\frac{1}{n}\) 속도로 쪼그라드는 모습으로 확인됩니다.`,
          en: String.raw`In summary: \(f_n \to 0\) pointwise on all of \([0, 1]\) (but not uniformly, since \(\sup f_n = 1\) on \([0,1]\)), yet deleting the single bad set \((0, \frac{1}{n}]\) of measure below \(\varepsilon\) leaves uniform convergence. That is Egorov's theorem for this sequence, visible in the scene as the red region shrinking at rate \(\frac{1}{n}\).`,
        },
      },
    ],
  },
  {
    id: 'egorov-nested',
    statement: {
      ko: String.raw`\(\delta \le 1\)을 고정하고 나쁜 집합 \(B_n = E_{n,\delta}\)라 하세요.

\(B_{n+1} \subseteq B_n\)인 감소수열이며 \(m(B_n) = 1/n \to 0\)임을, 유한 측도에서의 "위에서의 측도 연속성" (\(m(A_n) \downarrow m(\bigcap_n A_n)\))을 직접 증명하여 보이세요.`,
      en: String.raw`Fix \(\delta \le 1\) and let \(B_n = E_{n,\delta}\) be the bad sets.

Show they form a decreasing sequence (\(B_{n+1} \subseteq B_n\)) with \(m(B_n) = 1/n \to 0\), by directly proving continuity of measure from above (\(m(A_n) \downarrow m(\bigcap_n A_n)\)) for finite measure.`,
    },
    display: [
      String.raw`B_{n+1} = \left(0, \frac{1}{n+1}\right] \subseteq \left(0, \frac{1}{n}\right] = B_n`,
      String.raw`m(A_1) = m\!\left(\bigcap_n A_n\right) + \sum_{k \ge 1}\big(m(A_k) - m(A_{k+1})\big)`,
    ],
    preset: { delta: 0.5, n: 12 },
    presetCaption: {
      ko: String.raw`\(\delta = 0.5\), \(n = 12\): \(B_{12} = (0, \frac{1}{12}]\), 측도 \(\frac{1}{12} \approx 0.0833\) — \(B_6 = (0, \frac16]\) 안에 완전히 들어갑니다.`,
      en: String.raw`\(\delta = 0.5\), \(n = 12\): \(B_{12} = (0, \frac{1}{12}]\), measure \(\frac{1}{12} \approx 0.0833\) — nested entirely inside \(B_6 = (0, \frac16]\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`문제 1에서 \(B_n = (0, \frac{1}{n}]\)이므로 \(B_{n+1} = (0, \frac{1}{n+1}] \subseteq (0, \frac{1}{n}] = B_n\)이 자명합니다 (정의에서 직접 봐도 됩니다: \(k \ge n+1\)에 대한 합집합은 \(k \ge n\)에 대한 합집합에 포함됩니다). 따라서 \(\{B_n\}\)은 감소수열이고 \(m(B_1) = 1 < \infty\)입니다.`,
          en: String.raw`From problem 1, \(B_n = (0, \frac{1}{n}]\), so \(B_{n+1} = (0, \frac{1}{n+1}] \subseteq (0, \frac{1}{n}] = B_n\) is immediate (it also follows from the definition: the union over \(k \ge n+1\) sits inside the union over \(k \ge n\)). Hence \(\{B_n\}\) is decreasing with \(m(B_1) = 1 < \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 위에서의 측도 연속성을 직접 증명합니다. \(A_n\)이 감소수열이고 \(m(A_1) < \infty\)이라 하세요. \(A_1\)을 서로 겹치지 않는 조각들로 분해합니다: \(A_1 = \left(\bigcap_n A_n\right) \sqcup \bigsqcup_{k \ge 1} (A_k \setminus A_{k+1})\).

가산 가법성에 의해 \(m(A_1) = m(\bigcap_n A_n) + \sum_{k \ge 1} \big(m(A_k) - m(A_{k+1})\big)\)입니다 (차집합의 측도가 뺄셈이 되려면 \(m(A_{k+1}) \le m(A_1) < \infty\)이 필요합니다). 부분합은 \(\sum_{k=1}^{N} \big(m(A_k) - m(A_{k+1})\big) = m(A_1) - m(A_{N+1})\)로 상쇄(telescoping)되고, \(m(A_1)\)을 상계로 가지므로 급수가 수렴합니다.

따라서 \(m(A_1) = m(\bigcap_n A_n) + m(A_1) - \lim_{N \to \infty} m(A_N)\), 즉 \(\lim_{N \to \infty} m(A_N) = m(\bigcap_n A_n)\)입니다 — 여기서 유한성 \(m(A_1) < \infty\)이 양변에서 \(m(A_1)\)을 빼는 데 쓰였습니다.`,
          en: String.raw`Now prove continuity from above directly. Let \(A_n\) be decreasing with \(m(A_1) < \infty\). Decompose \(A_1\) into disjoint pieces: \(A_1 = \left(\bigcap_n A_n\right) \sqcup \bigsqcup_{k \ge 1} (A_k \setminus A_{k+1})\).

By countable additivity, \(m(A_1) = m(\bigcap_n A_n) + \sum_{k \ge 1} \big(m(A_k) - m(A_{k+1})\big)\) (the difference of measures needs \(m(A_{k+1}) \le m(A_1) < \infty\)). The partial sums telescope: \(\sum_{k=1}^{N} \big(m(A_k) - m(A_{k+1})\big) = m(A_1) - m(A_{N+1})\), and bounded above by \(m(A_1)\) they converge.

Hence \(m(A_1) = m(\bigcap_n A_n) + m(A_1) - \lim_{N \to \infty} m(A_N)\), i.e. \(\lim_{N \to \infty} m(A_N) = m(\bigcap_n A_n)\) — finiteness \(m(A_1) < \infty\) is what lets us cancel \(m(A_1)\) from both sides.`,
        },
      },
      {
        text: {
          ko: String.raw`\(B_n\)에 적용합니다: \(\bigcap_n B_n = \varnothing\)입니다. 실제로 \(x\)가 모든 \(B_n\)에 속하면 \(0 < x \le \frac{1}{n}\)이 모든 \(n\)에 대해 성립하므로 \(x = 0\)이어야 하는데, 이는 \(x > 0\)과 모순입니다.

따라서 \(m(B_n) \to m(\varnothing) = 0\) — 직접 계산한 \(m(B_n) = 1/n\)과 일치합니다.

나쁜 집합들이 "교집합이 비게" 쪼그라들 수 있는 것은 전체 측도가 유한하기 때문이며, 이것이 에고로프 정리의 심장입니다.`,
          en: String.raw`Apply this to \(B_n\): \(\bigcap_n B_n = \varnothing\). Indeed, if \(x\) belonged to every \(B_n\), then \(0 < x \le \frac{1}{n}\) for all \(n\), forcing \(x = 0\) — contradicting \(x > 0\).

Hence \(m(B_n) \to m(\varnothing) = 0\), matching the direct computation \(m(B_n) = 1/n\).

The bad sets can shrink to empty intersection precisely because the total measure is finite — and that is the heart of Egorov's theorem.`,
        },
      },
    ],
  },
  {
    id: 'egorov-infinite-measure',
    statement: {
      ko: String.raw`\(f_n = 1_{[n,\,n+1]}\) (\(\mathbb{R}\) 위의 함수)라 하세요.

\(f_n \to 0\)이 균등한 모든 집합 \(F \subseteq \mathbb{R}\)에 대해 \(m(\mathbb{R} \setminus F) = \infty\)임을 증명하세요 — 유한 측도 조건이 왜 필수적인지 보여주는 반례입니다.`,
      en: String.raw`Let \(f_n = 1_{[n,\,n+1]}\) (functions on \(\mathbb{R}\)).

Prove that for every set \(F \subseteq \mathbb{R}\) on which \(f_n \to 0\) uniformly, \(m(\mathbb{R} \setminus F) = \infty\) — the counterexample showing why the finite-measure hypothesis is essential.`,
    },
    display: [
      String.raw`\sup_{x \in F}|f_n(x)| < \tfrac12 \;(n \ge N) \;\Rightarrow\; F \cap [n, n+1] = \varnothing`,
      String.raw`[N, \infty) \subseteq \mathbb{R}\setminus F \;\Rightarrow\; m(\mathbb{R}\setminus F) = \infty`,
    ],
    preset: { delta: 0.5, n: 6 },
    presetCaption: {
      ko: String.raw`이 문제는 씬의 수열이 아닌 \(\mathbb{R}\) 위의 "도망치는 혹" \(1_{[n,\,n+1]}\)에 대한 것입니다 — 프리셋은 씬 기본값 \(\delta = 0.5\), \(n = 6\).`,
      en: String.raw`This problem is about the "escaping spike" \(1_{[n,\,n+1]}\) on \(\mathbb{R}\), not the scene's sequence — the preset is the scene default \(\delta = 0.5\), \(n = 6\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 각 점 \(x\)를 고정하면 \(n > x\)일 때 \(f_n(x) = 0\)이므로 \(f_n \to 0\)이 \(\mathbb{R}\) 전체에서 점별로 성립합니다. 그러나 어떤 유한 측도 집합을 도려내도 균등수렴을 되찾을 수 없음을 보입니다.`,
          en: String.raw`First, fixing any point \(x\), \(f_n(x) = 0\) for \(n > x\), so \(f_n \to 0\) pointwise on all of \(\mathbb{R}\). But no finite-measure deletion can restore uniform convergence.`,
        },
      },
      {
        text: {
          ko: String.raw`\(f_n \to 0\)이 \(F \subseteq \mathbb{R}\)에서 균등하다고 가정하세요.

그러면 어떤 \(N\)이 있어 모든 \(n \ge N\)에 대해 \(\sup_{x \in F} |f_n(x)| < \frac{1}{2}\)입니다.

그런데 \(f_n\)은 값으로 \(0\)과 \(1\)만 가지므로, 상한이 \(\frac{1}{2}\)보다 작다는 것은 \(F\) 위에서 \(f_n \equiv 0\)이라는 뜻입니다 — 즉 모든 \(n \ge N\)에 대해 \(F \cap [n, n+1] = \varnothing\)입니다 (그렇지 않으면 그 점에서 \(f_n = 1\)이 되어 상한이 1이 됩니다).`,
          en: String.raw`Suppose \(f_n \to 0\) uniformly on \(F \subseteq \mathbb{R}\).

Then some \(N\) has \(\sup_{x \in F} |f_n(x)| < \frac{1}{2}\) for all \(n \ge N\).

But \(f_n\) takes only the values 0 and 1, so a supremum below \(\frac{1}{2}\) forces \(f_n \equiv 0\) on \(F\) — i.e. \(F \cap [n, n+1] = \varnothing\) for every \(n \ge N\) (otherwise \(f_n = 1\) at that point and the supremum would be 1).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \([N, \infty) = \bigcup_{n \ge N} [n, n+1] \subseteq \mathbb{R} \setminus F\)이고, \(m(\mathbb{R} \setminus F) \ge m([N, \infty)) = \infty\)입니다.

균등수렴하는 집합은 혹들을 유한 개를 제외하고 전부 놓쳐야 하므로, 버려야 하는 집합의 측도는 무조건 무한대입니다 — 에고로프 정리에서 \(m(X) < \infty\) 조건을 뺄 수 없는 이유입니다.

씬의 수열과 대조해 보세요: 거기서는 혹이 0 한 점으로 모여들어, 그 점 근처만 도려내면 되었습니다.`,
          en: String.raw`Hence \([N, \infty) = \bigcup_{n \ge N} [n, n+1] \subseteq \mathbb{R} \setminus F\), and \(m(\mathbb{R} \setminus F) \ge m([N, \infty)) = \infty\).

Any set with uniform convergence must miss all but finitely many spikes, so the discarded set always has infinite measure — which is why Egorov's theorem cannot drop the hypothesis \(m(X) < \infty\).

Contrast the scene's sequence: there the bumps pile up at the single point 0, so deleting a neighborhood of that point suffices.`,
        },
      },
    ],
  },
];
