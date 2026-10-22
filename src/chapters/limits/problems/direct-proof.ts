import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the direct-proof scene
 * (the direct method: assume the hypothesis, compute, arrive at the
 * conclusion; worked example r1 = p1/q1, r2 = p2/q2).
 *
 * Every number below was verified against the model
 * (tests/direct-proof.test.ts): at (p1, q1, p2, q2) = (3, 4, -5, 6),
 * num = 18 - 20 = -2, den = 24, gcd 2, reduced -1/12; the product is
 * -15/24 = -5/8.
 */
export const directProofProblems: readonly ProblemMeta[] = [
  {
    id: 'direct-proof-rational-sum',
    statement: {
      ko: String.raw`두 유리수의 합이 유리수임을 직접증명으로 증명하고, 이 씬의 기본 수 \(r_1 = \frac34\), \(r_2 = -\frac56\)에 각 단계를 그대로 대입하여 합이 \(-\frac{1}{12}\)임을 단계별로 검증하세요.`,
      en: String.raw`Prove by a direct proof that the sum of two rational numbers is rational, and verify each step on this scene's default numbers \(r_1 = \frac34\), \(r_2 = -\frac56\), confirming the sum is \(-\frac{1}{12}\) step by step.`,
    },
    display: [
      String.raw`r_1 = \frac{p_1}{q_1},\ r_2 = \frac{p_2}{q_2} \;\Rightarrow\; r_1 + r_2 = \frac{p_1 q_2 + p_2 q_1}{q_1 q_2}`,
    ],
    preset: { p1: 3, q1: 4, p2: -5, q2: 6 },
    presetCaption: {
      ko: String.raw`\(p_1 = 3\), \(q_1 = 4\), \(p_2 = -5\), \(q_2 = 6\): 분자 \(18 - 20 = -2\), 분모 \(24\), \(\gcd(2, 24) = 2\), 약분하면 \(-\frac{1}{12} \approx -0.083333\).`,
      en: String.raw`\(p_1 = 3\), \(q_1 = 4\), \(p_2 = -5\), \(q_2 = 6\): numerator \(18 - 20 = -2\), denominator \(24\), \(\gcd(2, 24) = 2\), reduced \(-\frac{1}{12} \approx -0.083333\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`가정을 받아들입니다: \(r_1, r_2\)가 유리수이므로 정수 \(p_1, q_1, p_2, q_2\) (\(q_1 \ne 0\), \(q_2 \ne 0\))가 존재하여 \(r_1 = \frac{p_1}{q_1}\), \(r_2 = \frac{p_2}{q_2}\)입니다. 직접증명은 이 가정을 곧바로 계산으로 연결합니다.`,
          en: String.raw`Take the hypothesis: since \(r_1, r_2\) are rational, there exist integers \(p_1, q_1, p_2, q_2\) with \(q_1 \ne 0\), \(q_2 \ne 0\) such that \(r_1 = \frac{p_1}{q_1}\) and \(r_2 = \frac{p_2}{q_2}\). A direct proof feeds this assumption straight into a computation.`,
        },
      },
      {
        text: {
          ko: String.raw`통분합니다: \(r_1 + r_2 = \frac{p_1 q_2}{q_1 q_2} + \frac{p_2 q_1}{q_1 q_2} = \frac{p_1 q_2 + p_2 q_1}{q_1 q_2}\).

분자 \(p_1 q_2 + p_2 q_1\)은 정수들의 곱과 합의 합이므로 정수이고, 분모 \(q_1 q_2\)는 0이 아닌 정수들의 곱이므로 0이 아닌 정수입니다.

따라서 \(r_1 + r_2\)는 정수의 비 — 즉 유리수입니다.

이것이 결론에 대한 직접증명입니다.

씬의 수로 확인하면: \(\frac{3 \cdot 6 + (-5) \cdot 4}{4 \cdot 6} = \frac{18 - 20}{24} = \frac{-2}{24} = -\frac{1}{12} \approx -0.083333\).`,
          en: String.raw`Use a common denominator: \(r_1 + r_2 = \frac{p_1 q_2}{q_1 q_2} + \frac{p_2 q_1}{q_1 q_2} = \frac{p_1 q_2 + p_2 q_1}{q_1 q_2}\).

The numerator \(p_1 q_2 + p_2 q_1\) is a sum of products of integers, hence an integer; the denominator \(q_1 q_2\) is a product of nonzero integers, hence a nonzero integer.

So \(r_1 + r_2\) is a ratio of integers — rational.

That completes the direct proof.

On the scene's numbers: \(\frac{3 \cdot 6 + (-5) \cdot 4}{4 \cdot 6} = \frac{18 - 20}{24} = \frac{-2}{24} = -\frac{1}{12} \approx -0.083333\).`,
        },
        display: [String.raw`\frac{3}{4} + \frac{-5}{6} = \frac{-2}{24} = -\frac{1}{12}`],
      },
    ],
  },
  {
    id: 'direct-proof-rational-product-square',
    statement: {
      ko: String.raw`두 유리수의 곱이 유리수임을 직접증명으로 증명하세요.

이어서 유리수의 제곱이 유리수임을 증명하고, 씬의 수 \(r_1 = \frac34\), \(r_2 = -\frac56\)에 대해 곱이 \(-\frac58\)임을 검증하세요.`,
      en: String.raw`Prove by a direct proof that the product of two rational numbers is rational.

Then prove that the square of a rational number is rational, and verify on the scene's numbers \(r_1 = \frac34\), \(r_2 = -\frac56\) that the product is \(-\frac58\).`,
    },
    display: [String.raw`r_1 r_2 = \frac{p_1 p_2}{q_1 q_2}, \qquad r_1^2 = \frac{p_1^2}{q_1^2}`],
    preset: { p1: 3, q1: 4, p2: -5, q2: 6 },
    presetCaption: {
      ko: String.raw`\(p_1 = 3\), \(q_1 = 4\), \(p_2 = -5\), \(q_2 = 6\): 곱 \(-\frac{15}{24} = -\frac58 = -0.625\).`,
      en: String.raw`\(p_1 = 3\), \(q_1 = 4\), \(p_2 = -5\), \(q_2 = 6\): product \(-\frac{15}{24} = -\frac58 = -0.625\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`가정: \(r_1 = \frac{p_1}{q_1}\), \(r_2 = \frac{p_2}{q_2}\) (정수, \(q_1, q_2 \ne 0\)).

곱셈하면 \(r_1 r_2 = \frac{p_1 p_2}{q_1 q_2}\).

분자 \(p_1 p_2\)는 정수이고 분모 \(q_1 q_2\)는 0이 아닌 정수이므로 곱은 유리수입니다.

씬의 수: \(\frac{3 \cdot (-5)}{4 \cdot 6} = \frac{-15}{24} = -\frac58 = -0.625\) (분자·분모를 3으로 약분).`,
          en: String.raw`Assume \(r_1 = \frac{p_1}{q_1}\), \(r_2 = \frac{p_2}{q_2}\) (integers, \(q_1, q_2 \ne 0\)).

Multiplying gives \(r_1 r_2 = \frac{p_1 p_2}{q_1 q_2}\).

The numerator \(p_1 p_2\) is an integer and the denominator \(q_1 q_2\) is a nonzero integer, so the product is rational.

On the scene's numbers: \(\frac{3 \cdot (-5)}{4 \cdot 6} = \frac{-15}{24} = -\frac58 = -0.625\) (dividing numerator and denominator by 3).`,
        },
      },
      {
        text: {
          ko: String.raw`제곱은 곱의 특수한 경우: \(r = \frac{p}{q}\) (\(q \ne 0\))이면 \(r^2 = \frac{p^2}{q^2}\)이고, \(p^2\)는 정수, \(q^2\)는 양의 정수(따라서 \(\ne 0\))이므로 \(r^2\)는 유리수입니다.

예: \(r_1^2 = \left(\frac34\right)^2 = \frac{9}{16}\).

두 명제 모두 가정에서 결론으로 곧장 가는 한 번의 계산으로 증명됩니다 — 직접증명의 전형적인 형태입니다.`,
          en: String.raw`The square is a special case of the product: if \(r = \frac{p}{q}\) with \(q \ne 0\), then \(r^2 = \frac{p^2}{q^2}\), and \(p^2\) is an integer while \(q^2\) is a positive integer (hence \(\ne 0\)), so \(r^2\) is rational.

Example: \(r_1^2 = \left(\frac34\right)^2 = \frac{9}{16}\).

Both claims are proved by a single computation running straight from hypothesis to conclusion — the typical shape of a direct proof.`,
        },
      },
    ],
  },
  {
    id: 'direct-proof-odd-square',
    statement: {
      ko: String.raw`정수 \(n\)이 홀수이면 \(n^2\)도 홀수임을 직접증명으로 증명하세요: \(n = 2k + 1\)로 쓰고 전개하여 \((2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\)을 보이세요.`,
      en: String.raw`Prove by a direct proof that if an integer \(n\) is odd then \(n^2\) is odd: write \(n = 2k + 1\) and expand to show \((2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\).`,
    },
    display: [String.raw`n = 2k + 1 \;\Rightarrow\; n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1`],
    preset: { p1: 1, q1: 2, p2: 1, q2: 2 },
    presetCaption: {
      ko: String.raw`이 문제는 홀수 \(n\)에 대한 대수 증명에 대한 것입니다 — 프리셋은 씬의 유효한 기본 조합 \(r_1 = r_2 = \frac12\).`,
      en: String.raw`This problem is about an algebraic proof for odd \(n\) — the preset is a valid scene combination, \(r_1 = r_2 = \frac12\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`가정: \(n\)은 홀수입니다.

홀수의 정의에 의해, 어떤 정수 \(k\)가 존재하여 \(n = 2k + 1\)입니다.

이제 계산합니다: \(n^2 = (2k+1)^2 = 4k^2 + 4k + 1\).`,
          en: String.raw`Assume \(n\) is odd.

By the definition of odd, there is an integer \(k\) with \(n = 2k + 1\).

Now compute: \(n^2 = (2k+1)^2 = 4k^2 + 4k + 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`짝수 부분을 묶습니다: \(4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\).

여기서 \(2k^2 + 2k\)는 정수이므로, \(n^2\)는 "2 곱하기 정수, 더하기 1" — 즉 홀수입니다.

가정에서 결론까지 한 번의 전개로 도달했으므로 이것은 직접증명입니다.

(주목: 이 보조정리는 다음 씬인 대우법 씬이 정확히 소비하는 것입니다 — "\(n^2\)이 짝수 \(\Rightarrow\) \(n\)이 짝수"의 증명은 대우인 "\(n\)이 홀수 \(\Rightarrow\) \(n^2\)이 홀수"로 귀결되며, 그 대우의 증명이 바로 이 직접증명입니다.)`,
          en: String.raw`Group the even part: \(4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\).

Since \(2k^2 + 2k\) is an integer, \(n^2\) is "twice an integer, plus one" — odd.

One expansion carried us from hypothesis to conclusion, so this is a direct proof.

(Note: this lemma is exactly what the next scene, contrapositive, consumes — the proof of "\(n^2\) even \(\Rightarrow\) \(n\) even" reduces to its contrapositive "\(n\) odd \(\Rightarrow\) \(n^2\) odd", whose proof is precisely this direct proof.)`,
        },
      },
    ],
  },
];
