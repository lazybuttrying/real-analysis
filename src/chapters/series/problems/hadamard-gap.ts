import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Hadamard gap theorem scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/hadamard-gap.test.ts):
 *   gapRatio(k) = 2 exactly for k = 0..11 (n_k = 2^k by construction).
 *   lacunaryReal(0.5, 5) = 0.81642150902189314; the repeated-squaring
 *   evaluator agrees with direct summation sum_{k=0}^{N} 0.5^{2^k} to
 *   1e-15 for N = 0..12, and with direct complex powers to 1e-12.
 *   On the 720-point theta grid at r = 0.99, max_theta |S_N| (attained at
 *   theta = 0) for N = 1..12:
 *     1.970100000, 2.930696010, 3.853440704, 4.704898476, 5.429878811,
 *     5.955475299, 6.231726967, 6.308041951, 6.313865927, 6.313899846,
 *     6.313899847, 6.313899847
 *   (grows with N, then levels off as the tail r^{2^k} -> 0).
 *   Spike (local-maximum) counts on the r = 0.99 curve, N = 1..12:
 *     1, 3, 7, 14, 28, 60, 88, 108, 106, 106, 106, 106.
 *   Contrast: max_theta |T_200(0.99 e^{i theta})| = 1.604490074
 *   (< 1.65, and below pi^2/6 = 1.644934067); max|T_12| = 1.555125142.
 *
 * Rigor note: problems 1 and 2 are complete proofs. Problem 3 is the key
 * idea of the Hadamard gap theorem, honestly marked as a sketch -- the
 * overconvergence step is stated, not proved.
 */
export const hadamardGapProblems: readonly ProblemMeta[] = [
  {
    id: 'hadamard-gap-radius',
    statement: {
      ko: String.raw`\(f(z) = \sum_{k=0}^{\infty} z^{2^k}\)의 수렴반경이 정확히 1임을 Cauchy-Hadamard 근 판정법으로 증명하세요.`,
      en: String.raw`Prove by the Cauchy-Hadamard root test that \(f(z) = \sum_{k=0}^{\infty} z^{2^k}\) has radius of convergence exactly 1.`,
    },
    display: [
      String.raw`f(z) = \sum_{n=0}^{\infty} a_n z^n, \qquad a_n = 1\ (n = 2^k),\; a_n = 0\ \text{otherwise}`,
      String.raw`\frac{1}{R} = \limsup_{n\to\infty} \lvert a_n \rvert^{1/n} = 1 \;\Rightarrow\; R = 1`,
    ],
    preset: { N: 5 },
    presetCaption: {
      ko: String.raw`\(N = 5\): 원판 안쪽 \(z = 0.5\)에서는 \(S_5(0.5) \approx 0.81642150902\)로 빠르게 수렴 — 수렴반경이 정확히 1이라는 아래 증명과 일치합니다.`,
      en: String.raw`\(N = 5\): inside the disc, \(S_5(0.5) \approx 0.81642150902\) converges fast — consistent with the radius-1 proof below.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f(z)\)를 보통의 멱급수 \(\sum_{n=0}^{\infty} a_n z^n\)으로 씁니다: \(n = 2^k\)인 경우 \(a_n = 1\), 그 외에는 \(a_n = 0\)입니다. Cauchy-Hadamard 공식에 따르면 \(\frac{1}{R} = \limsup_{n\to\infty} \lvert a_n \rvert^{1/n}\)입니다 (약속: \(1/0 = \infty\), \(1/\infty = 0\)).`,
          en: String.raw`Write \(f(z)\) as an ordinary power series \(\sum_{n=0}^{\infty} a_n z^n\): \(a_n = 1\) when \(n = 2^k\) and \(a_n = 0\) otherwise. The Cauchy-Hadamard formula gives \(\frac{1}{R} = \limsup_{n\to\infty} \lvert a_n \rvert^{1/n}\) (with the conventions \(1/0 = \infty\), \(1/\infty = 0\)).`,
        },
      },
      {
        text: {
          ko: String.raw`모든 \(n \ge 1\)에 대해 \(\lvert a_n \rvert^{1/n} \le 1\)이므로 (\(n = 0\)에서는 \(1/n\)이 정의되지 않아 limsup 논의에서 제외합니다) \(\limsup \le 1\)입니다.

반대로 부분수열 \(n = 2^k\) (\(k \ge 1\))에서는 \(\lvert a_{2^k} \rvert^{1/2^k} = 1^{1/2^k} = 1\)이므로 \(\limsup \ge 1\)입니다.

따라서 \(\limsup = 1\)이고 \(R = 1\) — 정확히 1입니다.`,
          en: String.raw`Since \(\lvert a_n \rvert^{1/n} \le 1\) for every \(n \ge 1\) (at \(n = 0\), \(1/n\) is undefined, so \(n = 0\) is excluded from the limsup argument), the limsup is at most 1.

But along the subsequence \(n = 2^k\) (\(k \ge 1\)) we have \(\lvert a_{2^k} \rvert^{1/2^k} = 1^{1/2^k} = 1\), so the limsup is at least 1.

Hence the limsup equals 1 and \(R = 1\) — exactly 1.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\lvert z \rvert < 1\)에서는 절대 수렴하고, \(\lvert z \rvert > 1\)에서는 일반항 \(z^{2^k}\)이 \(\lvert z \rvert^{2^k} \to \infty\)라 0으로 가지 않으므로 발산합니다. 경계 \(\lvert z \rvert = 1\)는 판정법이 침묵하는 곳 — 바로 간극 정리가 말하는 곳입니다.`,
          en: String.raw`So the series converges absolutely for \(\lvert z \rvert < 1\), and diverges for \(\lvert z \rvert > 1\) since the general term \(z^{2^k}\) does not tend to 0 (\(\lvert z \rvert^{2^k} \to \infty\)). The boundary \(\lvert z \rvert = 1\) is where the test goes silent — exactly where the gap theorem speaks.`,
        },
      },
    ],
  },
  {
    id: 'gap-free-contrast',
    statement: {
      ko: String.raw`\(T(z) = \sum_{k=0}^{\infty} \frac{z^k}{(k+1)^2}\)가 닫힌 단위원판 \(\lvert z \rvert \le 1\) 위에서 균등수렴함을 Weierstrass M-판정법으로 증명하고, 그 합이 경계까지 연속으로 확장됨을 보이세요.

간극 급수와 달리 이 합은 닫힌 원판에서 연속이므로 \(\lvert z \rvert = 1\)은 continuous extension에 대한 natural boundary가 아닙니다 (analytic singularity가 없다는 주장은 이 증명의 범위를 넘습니다).`,
      en: String.raw`Prove by the Weierstrass M-test that \(T(z) = \sum_{k=0}^{\infty} \frac{z^k}{(k+1)^2}\) converges uniformly on the closed unit disc \(\lvert z \rvert \le 1\), so its sum extends continuously to the boundary.

Unlike the gap series, this sum is continuous on the closed disc, so \(\lvert z \rvert = 1\) is not a natural boundary for the continuous extension (claiming no analytic singularity would go beyond this proof).`,
    },
    display: [
      String.raw`\left\lvert \frac{z^k}{(k+1)^2} \right\rvert \le \frac{1}{(k+1)^2} = M_k, \quad \sum_{k=0}^{\infty} M_k = \frac{\pi^2}{6} < \infty`,
      String.raw`\max_\theta \lvert T_{200}(0.99\,e^{i\theta}) \rvert \approx 1.6045 < 1.65 < \frac{\pi^2}{6}`,
    ],
    preset: { N: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\): 회색 점선 \(T_{12}\)는 \(\max_\theta \lvert T_{12} \rvert \approx 1.5551\)로 얌전합니다 — 간극이 없으면 경계에서 폭발이 없습니다.`,
      en: String.raw`\(N = 12\): the dashed gray \(T_{12}\) stays calm at \(\max_\theta \lvert T_{12} \rvert \approx 1.5551\) — without gaps there is no blow-up at the boundary.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\lvert z \rvert \le 1\)에서 \(\left\lvert z^k/(k+1)^2 \right\rvert \le 1/(k+1)^2 =: M_k\)이고, \(\sum M_k = \sum_{k=1}^{\infty} 1/k^2 = \pi^2/6 < \infty\) (Basel 문제)입니다. Weierstrass M-판정법에 따라 \(\sum z^k/(k+1)^2\)는 닫힌 원판 \(\lvert z \rvert \le 1\) 위에서 균등수렴합니다.`,
          en: String.raw`On \(\lvert z \rvert \le 1\), \(\left\lvert z^k/(k+1)^2 \right\rvert \le 1/(k+1)^2 =: M_k\), and \(\sum M_k = \sum_{k=1}^{\infty} 1/k^2 = \pi^2/6 < \infty\) (the Basel problem). By the Weierstrass M-test, \(\sum z^k/(k+1)^2\) converges uniformly on the closed disc \(\lvert z \rvert \le 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 부분합은 다항식이므로 연속이고, 연속함수들의 균등극한은 연속이므로, 합 \(T(z)\)는 닫힌 원판 전체에서 연속입니다.

즉 \(T\)는 경계 \(\lvert z \rvert = 1\)까지 연속으로 확장됩니다 — 경계 위의 모든 점이 continuous extension의 연속점입니다.

이것이 이 증명이 보이는 전부입니다: continuity만으로 analytic extension이나 analytic singularity의 부재가 따라오지는 않습니다 (예: \(T(z) = \mathrm{Li}_2(z)/z\)는 연속으로 확장되지만 \(z = 1\)은 \(\mathrm{Li}_2\)의 singularity입니다).`,
          en: String.raw`Each partial sum is a polynomial, hence continuous, and a uniform limit of continuous functions is continuous — so the sum \(T(z)\) is continuous on the whole closed disc.

That is, \(T\) extends continuously to the boundary \(\lvert z \rvert = 1\): every boundary point is a point of continuity for the continuous extension.

That is exactly what this proof shows: continuity alone does not imply analytic extension or absence of an analytic singularity (for example \(T(z) = \mathrm{Li}_2(z)/z\) extends continuously, yet \(z = 1\) is a singularity of \(\mathrm{Li}_2\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(T(z)\)와 \(\sum z^{2^k}\)는 수렴반경이 둘 다 정확히 1이지만 운명이 정반대입니다 — 차이를 만드는 것은 간극입니다. 측정값도 일치합니다: \(\max_\theta \lvert T_{200}(0.99\,e^{i\theta}) \rvert \approx 1.6045 < \pi^2/6 \approx 1.6449\)로, 경계 근처에서도 폭발의 기미가 없습니다.`,
          en: String.raw`\(T(z)\) and \(\sum z^{2^k}\) both have radius exactly 1 yet opposite fates — the gaps make the difference. The measurements agree: \(\max_\theta \lvert T_{200}(0.99\,e^{i\theta}) \rvert \approx 1.6045 < \pi^2/6 \approx 1.6449\), with no hint of blow-up near the boundary.`,
        },
      },
    ],
  },
  {
    id: 'gap-theorem-idea',
    statement: {
      ko: String.raw`Hadamard 간극 정리의 핵심 아이디어를 2–3단계로 스케치하세요: 경계 너머로 정칙 확장된다고 가정하면 간극이 어떻게 모순을 강제하는지 설명하세요.

이것은 완전한 증명이 아니라 아이디어의 스케치임을 답안에 명시하세요.`,
      en: String.raw`Sketch the key idea of the Hadamard gap theorem in 2–3 steps: assuming a holomorphic extension past the boundary, explain the mechanism by which the gaps force a contradiction.

State explicitly in your answer that this is a sketch of the idea, not the complete proof.`,
    },
    display: [
      String.raw`s_k(z) = \sum_{j=0}^{k} z^{2^j}, \qquad s_{k+1}(z) - s_k(z) = z^{2^{k+1}}`,
      String.raw`\lvert z_0 \rvert > 1 \;\Rightarrow\; \lvert z_0 \rvert^{2^{k+1}} \to \infty`,
    ],
    preset: { N: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\): 봉우리 106개가 경계에 빽빽합니다 — 아래는 이 그림이 암시하는 것의 증명 아이디어입니다 (스케치이지 완전한 증명이 아닙니다).`,
      en: String.raw`\(N = 12\): 106 spikes crowd the boundary — below is the proof idea behind what this picture suggests (a sketch, not the complete proof).`,
    },
    isHint: true,
    proof: [
      {
        text: {
          ko: String.raw`귀류법을 시작합니다: \(f(z) = \sum_{k\ge 0} z^{2^k}\)가 경계 위의 어떤 점 \(\zeta\) (\(\lvert \zeta \rvert = 1\)) 너머로 정칙 확장된다고 가정합니다. 그러면 \(\zeta\)의 작은 원판 \(D\)가 있어 \(f\)가 \(D\) 전체에서 정칙인 함수와 \(\lvert z \rvert < 1\) 안에서 일치합니다 — 즉 \(D\)는 단위원 바깥으로 삐져나옵니다.`,
          en: String.raw`Start with contradiction: suppose \(f(z) = \sum_{k\ge 0} z^{2^k}\) extended holomorphically past some boundary point \(\zeta\) (\(\lvert \zeta \rvert = 1\)). Then there is a small disc \(D\) around \(\zeta\) on which a holomorphic function agrees with \(f\) inside \(\lvert z \rvert < 1\) — so \(D\) pokes outside the unit circle.`,
        },
      },
      {
        text: {
          ko: String.raw`[아이디어 — 여기서 증명하지 않는 단계] 간극이 강제하는 overconvergence: 부분합 \(s_k(z) = \sum_{j=0}^{k} z^{2^j}\)는 \(\lvert z \rvert < 1\)에서 \(f\)로, 따라서 \(D \cap \{\lvert z \rvert < 1\}\)에서 그 확장함수로 수렴합니다.

새 부분합은 항을 하나만 더하면서 차수는 두 배 (\(2^{k+1} = 2\cdot 2^k\))로 뜁니다 — 사이에 낄 중간 항이 하나도 없으므로, 고전적인 overconvergence 보조정리가 수열 \(s_k\)를 \(D\) 전체 (즉 \(\lvert z \rvert > 1\)인 점들까지) 에서까지 균등수렴시킵니다.

이 보조정리가 기술적 핵심이며, 여기서는 증명하지 않습니다.`,
          en: String.raw`[IDEA — the step not proved here] Gap-forced overconvergence: the partial sums \(s_k(z) = \sum_{j=0}^{k} z^{2^j}\) converge to \(f\) on \(\lvert z \rvert < 1\), hence to the extension on \(D \cap \{\lvert z \rvert < 1\}\).

Each new partial sum adds just one term yet leaps twice as far in degree (\(2^{k+1} = 2\cdot 2^k\)) — with no intermediate terms to interfere, a classical overconvergence lemma forces the sequence \(s_k\) to keep converging uniformly on all of \(D\), including points with \(\lvert z \rvert > 1\).

That lemma is the technical heart; it is stated here, not proved.`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(\lvert z_0 \rvert > 1\)인 점에서는 \(s_{k+1}(z_0) - s_k(z_0) = z_0^{2^{k+1}}\)이고 \(\lvert z_0^{2^{k+1}} \rvert = \lvert z_0 \rvert^{2^{k+1}} \to \infty\)이므로, \(s_k(z_0)\)는 수렴할 수 없습니다 — 모순입니다.

따라서 어떤 경계점에서도 정칙 확장은 불가능하고, 단위원 위의 모든 점이 특이점입니다.

다시 강조합니다: 이것은 증명의 아이디어(골격)이지 완전한 증명이 아닙니다.`,
          en: String.raw`But at any point with \(\lvert z_0 \rvert > 1\), \(s_{k+1}(z_0) - s_k(z_0) = z_0^{2^{k+1}}\) and \(\lvert z_0^{2^{k+1}} \rvert = \lvert z_0 \rvert^{2^{k+1}} \to \infty\), so \(s_k(z_0)\) cannot converge — a contradiction.

Hence no holomorphic extension past any boundary point exists, and every point of the unit circle is singular.

To stress again: this is the idea (the skeleton) of the proof, not the complete proof.`,
        },
      },
    ],
  },
];
