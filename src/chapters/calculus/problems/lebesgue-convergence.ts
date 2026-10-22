import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Lebesgue convergence scene
 * (Tao, Analysis II: MCT, Fatou, DCT). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/lebesgue-convergence.test.ts): escape and spike have integral 1
 * for every n with limit-integral 0; monotone has integral 1 - 1/n rising
 * to the limit-integral 1.
 *
 * Honesty note, stated in each proof: these are proofs about the concrete
 * sequences in the scene, illustrating the general theorems on cases where
 * every quantity is explicit — not proofs of the general theorems.
 */
export const lebesgueConvergenceProblems: readonly ProblemMeta[] = [
  {
    id: 'lc-fatou',
    statement: {
      ko: String.raw`스파이크 수열 \(f_n = n\,\mathbf{1}_{[0,1/n]}\)에 대해 파투 보조정리의 양변 \(\int \liminf f_n\)과 \(\liminf \int f_n\)을 직접 계산하고, 부등식이 엄격함을 보이세요.`,
      en: String.raw`For the spike sequence \(f_n = n\,\mathbf{1}_{[0,1/n]}\), compute both sides of Fatou's lemma, \(\int \liminf f_n\) and \(\liminf \int f_n\), directly and show the inequality is strict.`,
    },
    display: [
      String.raw`\int f_n = n \cdot \frac{1}{n} = 1 \quad \forall n`,
      String.raw`\int \liminf_{n \to \infty} f_n = 0 < 1 = \liminf_{n \to \infty} \int f_n`,
    ],
    preset: { example: 'spike', n: 10 },
    presetCaption: {
      ko: String.raw`\(f_{10} = 10\,\mathbf{1}_{[0,1/10]}\): \(\int f_{10} = 1\)이지만 점별 극한은 \(0\)이므로 \(\int \liminf f_n = 0\) — 파투 부등식이 엄격합니다.`,
      en: String.raw`\(f_{10} = 10\,\mathbf{1}_{[0,1/10]}\): \(\int f_{10} = 1\) yet the pointwise limit is \(0\), so \(\int \liminf f_n = 0\) — Fatou's inequality is strict.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(f_n\)은 \([0, 1/n]\)에서 값이 \(n\)이고 나머지는 \(0\)인 계단함수이므로, \(\int f_n = n \cdot m([0, 1/n]) = n \cdot \frac{1}{n} = 1\)입니다 — 모든 \(n\)에 대해 같습니다. 따라서 \(\liminf_{n \to \infty} \int f_n = 1\)입니다.`,
          en: String.raw`Each \(f_n\) is a step function equal to \(n\) on \([0, 1/n]\) and \(0\) elsewhere, so \(\int f_n = n \cdot m([0, 1/n]) = n \cdot \frac{1}{n} = 1\) — the same for every \(n\). Hence \(\liminf_{n \to \infty} \int f_n = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`점별 \(\liminf\)를 봅니다. \(x > 0\)이면 \(n > 1/x\)부터 \(1/n < x\)이므로 \(f_n(x) = 0\) — 따라서 \(\liminf_n f_n(x) = 0\)입니다.

\(x = 0\)에서는 \(f_n(0) = n \to \infty\)이므로 \(\liminf\)가 \(\infty\)이지만, 한 점은 측도가 \(0\)인 집합이라 적분에 영향을 주지 않습니다.

즉 \(\liminf_n f_n = 0\) a.e.이고 \(\int \liminf_n f_n = 0\)입니다.`,
          en: String.raw`Now the pointwise \(\liminf\). For \(x > 0\), once \(n > 1/x\) we have \(1/n < x\) and \(f_n(x) = 0\) — so \(\liminf_n f_n(x) = 0\).

At \(x = 0\), \(f_n(0) = n \to \infty\), so the \(\liminf\) is \(\infty\) there, but a single point is a null set and does not affect the integral.

Thus \(\liminf_n f_n = 0\) a.e. and \(\int \liminf_n f_n = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(0 = \int \liminf f_n < \liminf \int f_n = 1\) — 파투 부등식 \(\int \liminf f_n \le \liminf \int f_n\)이 엄격한 부등식으로 성립합니다.

질량이 한 점으로 모였다가 극한에서 사라졌기 때문입니다.

이 증명은 이 구체적인 수열에 대한 것으로, 일반 파투 보조정리의 증명이 아니라 그 정리를 완전히 계산 가능한 경우에 확인한 것입니다.`,
          en: String.raw`Hence \(0 = \int \liminf f_n < \liminf \int f_n = 1\) — Fatou's inequality \(\int \liminf f_n \le \liminf \int f_n\) holds as a strict inequality.

The mass concentrated at a single point and vanished in the limit.

This proof is for this concrete sequence: it verifies the general Fatou lemma on a fully computable case rather than proving the general theorem.`,
        },
      },
    ],
  },
  {
    id: 'lc-mct',
    statement: {
      ko: String.raw`단조 수열 \(f_n = \mathbf{1}_{[0,1-1/n]}\)이 \(f = \mathbf{1}_{[0,1)}\)로 증가함을 보이고, \(\int f_n \uparrow \int f\)를 명시적인 수로 증명하세요.`,
      en: String.raw`Show the sequence \(f_n = \mathbf{1}_{[0,1-1/n]}\) increases to \(f = \mathbf{1}_{[0,1)}\), and prove \(\int f_n \uparrow \int f\) with explicit numbers.`,
    },
    display: [
      String.raw`0 \le f_n \le f_{n+1}, \quad f_n(x) \uparrow \mathbf{1}_{[0,1)}(x)`,
      String.raw`\int f_n = 1 - \frac{1}{n} \uparrow 1 = \int \lim f_n`,
    ],
    preset: { example: 'monotone', n: 10 },
    presetCaption: {
      ko: String.raw`\(n = 10\): \(\int f_{10} = 1 - \frac{1}{10} = 0.9\)가 \(1\)을 향해 증가하고, 점별 극한 \(\mathbf{1}_{[0,1)}\)의 적분은 \(1\)입니다.`,
      en: String.raw`\(n = 10\): \(\int f_{10} = 1 - \frac{1}{10} = 0.9\) increases toward \(1\), and the pointwise limit \(\mathbf{1}_{[0,1)}\) integrates to \(1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(1 - \frac{1}{n}\)이 증가하므로 \([0, 1-\frac{1}{n}] \subset [0, 1-\frac{1}{n+1}]\)이고, 따라서 \(0 \le f_n \le f_{n+1}\)입니다 — 단조 증가하는 음이 아닌 가측함수열입니다.`,
          en: String.raw`Since \(1 - \frac{1}{n}\) increases, \([0, 1-\frac{1}{n}] \subset [0, 1-\frac{1}{n+1}]\), hence \(0 \le f_n \le f_{n+1}\) — a monotone increasing sequence of nonnegative measurable functions.`,
        },
      },
      {
        text: {
          ko: String.raw`점별 극한: \(x < 1\)이면 언젠가 \(1 - \frac{1}{n} > x\)가 되어 \(f_n(x) = 1\)이므로 극한은 \(1\)입니다.

\(x \ge 1\)이면 모든 \(n\)에서 \(f_n(x) = 0\)이므로 극한은 \(0\)입니다.

즉 \(f_n \uparrow \mathbf{1}_{[0,1)}\) pointwise입니다.`,
          en: String.raw`Pointwise limit: if \(x < 1\), eventually \(1 - \frac{1}{n} > x\), so \(f_n(x) = 1\) and the limit is \(1\).

If \(x \ge 1\), \(f_n(x) = 0\) for all \(n\), so the limit is \(0\).

That is, \(f_n \uparrow \mathbf{1}_{[0,1)}\) pointwise.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\int f_n = m([0, 1-\frac{1}{n}]) = 1 - \frac{1}{n} \uparrow 1\)이고, \(\int \lim f_n = m([0, 1)) = 1\)이므로 \(\int f_n \uparrow \int f\)가 등식으로 성립합니다 — 단조수렴정리가 이 수열에서 그대로 확인됩니다.

질량이 도망가지도, 한 점으로 모이지도 않았기 때문입니다.

이 증명은 이 구체적인 수열에 대한 것으로, 일반 단조수렴정리의 증명이 아닙니다.`,
          en: String.raw`\(\int f_n = m([0, 1-\frac{1}{n}]) = 1 - \frac{1}{n} \uparrow 1\), and \(\int \lim f_n = m([0, 1)) = 1\), so \(\int f_n \uparrow \int f\) holds with equality — the monotone convergence theorem verified on this sequence.

No mass escaped and none concentrated at a point.

This proof is for this concrete sequence, not a proof of the general monotone convergence theorem.`,
        },
      },
    ],
  },
  {
    id: 'lc-dct',
    statement: {
      ko: String.raw`이탈 수열 \(f_n = \mathbf{1}_{[n,n+1]}\) (\([0, \infty)\) 위)에 대해, 모든 \(f_n\)을 지배하는 적분 가능한 함수 \(g\)가 존재하지 않음을 증명하고, 그래서 지배수렴정리를 적용할 수 없음을 보이세요.`,
      en: String.raw`For the escaping sequence \(f_n = \mathbf{1}_{[n,n+1]}\) (on \([0, \infty)\)), prove that no integrable function \(g\) dominating every \(f_n\) exists, and hence the dominated convergence theorem cannot be applied.`,
    },
    display: [
      String.raw`\int f_n = 1 \;\forall n, \quad \lim_{n \to \infty} f_n = 0 \text{ pointwise}, \quad \int \lim f_n = 0`,
      String.raw`g \ge f_n \;\forall n \;\Rightarrow\; g \ge 1 \text{ on } [1, \infty) \;\Rightarrow\; \int g = \infty`,
    ],
    preset: { example: 'escape', n: 3 },
    presetCaption: {
      ko: String.raw`\(n = 3\): 스파이크 \([3, 4]\)는 \([0, 2]\) 창 밖에 있습니다. \(\int f_3 = 1\)이지만 \(\int \lim f_n = 0\) — 질량은 이미 무한대를 향해 떠났습니다.`,
      en: String.raw`\(n = 3\): the spike \([3, 4]\) is outside the \([0, 2]\) window. \(\int f_3 = 1\) yet \(\int \lim f_n = 0\) — the mass has already left for infinity.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\int f_n = m([n, n+1]) = 1\) (모든 \(n\)). 고정된 \(x \ge 0\)에 대해 \(n > x\)이면 \(x \notin [n, n+1]\)이므로 \(f_n(x) = 0\) — 점별 극한은 \(0\)이고 \(\int \lim f_n = 0 \ne 1 = \lim \int f_n\)입니다.`,
          en: String.raw`\(\int f_n = m([n, n+1]) = 1\) for every \(n\). For fixed \(x \ge 0\), once \(n > x\) we have \(x \notin [n, n+1]\), so \(f_n(x) = 0\) — the pointwise limit is \(0\) and \(\int \lim f_n = 0 \ne 1 = \lim \int f_n\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(|f_n| \le g\) (모든 \(n\))인 적분 가능한 \(g \ge 0\)가 있다고 가정합니다. 각 \(n\)에 대해 \(g \ge f_n = \mathbf{1}_{[n,n+1]}\)이므로, \([n, n+1]\) 위에서 \(g \ge 1\)입니다.

모든 \(n \ge 1\)에 대해 합치면 \([1, \infty) = \bigcup_{n \ge 1} [n, n+1]\) 위에서 \(g \ge 1\) — 따라서 \(\int_0^\infty g \ge \int_1^\infty 1 = \infty\)로, \(g\)는 적분 가능하지 않습니다.

모순입니다.`,
          en: String.raw`Suppose, for contradiction, an integrable \(g \ge 0\) with \(|f_n| \le g\) for all \(n\).

For each \(n\), \(g \ge f_n = \mathbf{1}_{[n,n+1]}\), so \(g \ge 1\) on \([n, n+1]\).

Union over all \(n \ge 1\): \(g \ge 1\) on \([1, \infty) = \bigcup_{n \ge 1} [n, n+1]\) — hence \(\int_0^\infty g \ge \int_1^\infty 1 = \infty\), contradicting integrability.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 이 수열을 지배하는 적분 가능한 함수는 존재하지 않습니다 — 지배수렴정리의 핵심 가정이 깨진 것이고, 그래서 \(\lim \int f_n \ne \int \lim f_n\)이 가능한 것입니다.

질량이 무한대로 도망가면 적분은 극한과 "소통"하지 않습니다.

이 증명은 이 구체적인 수열에 대한 것으로, 일반 지배수렴정리의 증명이 아닙니다.`,
          en: String.raw`So no integrable dominating function for this sequence exists — the key hypothesis of the dominated convergence theorem fails, which is exactly why \(\lim \int f_n \ne \int \lim f_n\) is possible here.

When mass escapes to infinity, the integral does not "commute" with the limit.

This proof is for this concrete sequence, not a proof of the general dominated convergence theorem.`,
        },
      },
    ],
  },
];
