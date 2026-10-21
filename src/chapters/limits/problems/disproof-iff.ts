import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the disproof-iff scene.
 *
 * Every number below was verified against the model
 * (tests/disproof-iff.test.ts): n = 2 is a counterexample to the div4 claim
 * (2^2 = 4, 4 | 4, but 4 does not divide 2); the biconditional
 * "n even iff n^2 even" is proved in two directions; x^2 = y^2 iff x = +-y.
 */
export const disproofIffProblems: readonly ProblemMeta[] = [
  {
    id: 'disproof-div4',
    statement: {
      ko: String.raw`“\(n^2\)이 4로 나누어떨어지면 \(n\)도 4로 나누어떨어진다”는 주장을 반례 \(n = 2\)로 반박하세요. 주장의 논리형 \(\forall n \in \mathbb{Z}\,(4 \mid n^2 \Rightarrow 4 \mid n)\)과 그 부정 \(\exists n \in \mathbb{Z}\,(4 \mid n^2 \text{ and } 4 \nmid n)\)을 명시적으로 쓰고, 왜 단 하나의 증인으로 증명이 끝나는지 설명하세요.`,
      en: String.raw`Disprove the claim "if \(n^2\) is divisible by 4 then \(n\) is divisible by 4" using the counterexample \(n = 2\). Write out the claim's logical form \(\forall n \in \mathbb{Z}\,(4 \mid n^2 \Rightarrow 4 \mid n)\) and its negation \(\exists n \in \mathbb{Z}\,(4 \mid n^2 \text{ and } 4 \nmid n)\) explicitly, and explain why a single witness settles the matter.`,
    },
    display: [
      String.raw`\forall n \in \mathbb{Z}\,(4 \mid n^2 \Rightarrow 4 \mid n),\qquad \lnot\Big(\forall n \in \mathbb{Z}\,P(n)\Big) = \exists n \in \mathbb{Z}\,\lnot P(n)`,
      String.raw`n = 2:\quad n^2 = 4,\; 4 \mid 4,\; \text{but } 4 \nmid 2`,
    ],
    preset: { claim: 'div4', n: 2 },
    presetCaption: {
      ko: String.raw`주장 \(4 \mid n^2 \Rightarrow 4 \mid n\), 테스트 \(n = 2\): \(n^2 = 4\)이므로 가정이 참, 결론 \(4 \mid 2\)는 거짓 — 반례 확정.`,
      en: String.raw`claim \(4 \mid n^2 \Rightarrow 4 \mid n\), test \(n = 2\): \(n^2 = 4\) makes the hypothesis true, the conclusion \(4 \mid 2\) is false — counterexample confirmed.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`주장은 전칭 명제입니다: \(\forall n \in \mathbb{Z}\,(4 \mid n^2 \Rightarrow 4 \mid n)\) — 정의역은 \(n \in \mathbb{Z}\)입니다.

논리학의 기본 규칙에 따라 그 부정은 존재 명제 \(\exists n \in \mathbb{Z}\,\lnot(4 \mid n^2 \Rightarrow 4 \mid n)\)이고, 함축의 부정 \(\lnot(P \Rightarrow Q) = P \wedge \lnot Q\)에 의해 \(\exists n \in \mathbb{Z}\,(4 \mid n^2 \wedge 4 \nmid n)\)이 됩니다.

즉 “가정은 참인데 결론은 거짓인 \(n \in \mathbb{Z}\)가 하나라도 존재한다”를 보이면 충분하고, 그 역도 마찬가지입니다.`,
          en: String.raw`The claim is a universal statement: \(\forall n \in \mathbb{Z}\,(4 \mid n^2 \Rightarrow 4 \mid n)\) — the domain is \(n \in \mathbb{Z}\).

By the basic rules of logic its negation is the existential statement \(\exists n \in \mathbb{Z}\,\lnot(4 \mid n^2 \Rightarrow 4 \mid n)\), which by \(\lnot(P \Rightarrow Q) = P \wedge \lnot Q\) equals \(\exists n \in \mathbb{Z}\,(4 \mid n^2 \wedge 4 \nmid n)\).

So it suffices to exhibit one \(n \in \mathbb{Z}\) for which the hypothesis is true and the conclusion false — and conversely, one such \(n\) is all it takes.`,
        },
      },
      {
        text: {
          ko: String.raw`\(n = 2\)를 취합니다.

\(n^2 = 4\)이고 \(4 \mid 4\)이므로 가정은 참입니다.

그런데 \(n = 2\)는 4로 나누어떨어지지 않으므로 결론 \(4 \mid n\)은 거짓입니다.

따라서 \(n = 2\)는 부정 명제 \(\exists n\,(4 \mid n^2 \wedge 4 \nmid n)\)의 증인이고, 원래 전칭 주장은 거짓입니다.`,
          en: String.raw`Take \(n = 2\).

Then \(n^2 = 4\) and \(4 \mid 4\), so the hypothesis is true.

But \(n = 2\) is not divisible by 4, so the conclusion \(4 \mid n\) is false.

Hence \(n = 2\) is a witness to \(\exists n\,(4 \mid n^2 \wedge 4 \nmid n)\), and the original universal claim is false.`,
        },
        display: [
          String.raw`n = 2:\quad 4 \mid n^2 = 4\ \text{true},\qquad 4 \mid 2\ \text{false (i.e. } 4 \nmid 2\ \text{true)} \Rightarrow\ \text{counterexample}`,
        ],
      },
      {
        text: {
          ko: String.raw`주석: 백 개의 \(n\)에서 가정이 결론을 따라다니는 것을 확인해도 — 예를 들어 \(n = 4, 8, 12\)에서는 모두 참입니다 — 전칭 주장은 증명되지 않습니다.

반례 하나가 무한한 지지 예보다 강합니다.

(이 주장의 ‘고친 버전’ — \(n\)이 짝수 \(\iff\) \(n^2\)이 짝수 — 은 아래 문제 2에서 양방향으로 증명합니다.)`,
          en: String.raw`Remark: checking a hundred values of \(n\) where the hypothesis trails the conclusion — e.g. \(n = 4, 8, 12\) all work — never proves a universal claim.

One counterexample outweighs infinitely many supporting cases.

(The "fixed version" of this claim — \(n\) is even \(\iff\) \(n^2\) is even — is proved in both directions in problem 2 below.)`,
        },
      },
    ],
  },
  {
    id: 'iff-even-squares',
    statement: {
      ko: String.raw`\(n\)이 짝수인 것과 \(n^2\)이 짝수인 것이 동치임을 양방향으로 완전히 증명하세요. \(\Rightarrow\) 방향은 직접 증명 (\(n = 2k\)에서 \(n^2 = 2(2k^2)\)), \(\Leftarrow\) 방향은 대우 (홀수 \(n = 2k+1\)에서 \(n^2 = 2(2k^2+2k)+1\)은 홀수)를 사용하고, 두 방향이 왜 서로 다른 증명인지 명시하세요.`,
      en: String.raw`Prove completely, in both directions, that \(n\) is even if and only if \(n^2\) is even. Use a direct proof for the \(\Rightarrow\) direction (\(n = 2k\) gives \(n^2 = 2(2k^2)\)) and the contrapositive for the \(\Leftarrow\) direction (odd \(n = 2k+1\) gives odd \(n^2 = 2(2k^2+2k)+1\)), and state explicitly why the two directions are different proofs.`,
    },
    display: [
      String.raw`n\ \text{even} \iff n^2\ \text{even}`,
      String.raw`\Rightarrow:\ n = 2k \;\Rightarrow\; n^2 = 2(2k^2),\qquad \Leftarrow:\ \lnot(n\ \text{even}) \Rightarrow \lnot(n^2\ \text{even})`,
    ],
    preset: { claim: 'primes-odd', n: 2 },
    presetCaption: {
      ko: String.raw`씐에 이 양방향 주장을 직접 시험하는 프리셋은 없으므로(반례 장면의 주장만 있음), 가장 작은 반례 \(n = 2\) 위치의 프리셋 — 이 문제는 증명 연습입니다.`,
      en: String.raw`The scene has no preset directly testing this biconditional (only the counterexample claims), so this preset marks the smallest-counterexample position \(n = 2\) — this problem is proof practice.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(\(\Rightarrow\)) \(n\)이 짝수라 하세요.

그러면 어떤 정수 \(k\)에 대해 \(n = 2k\)입니다.

제곱하면 \(n^2 = 4k^2 = 2(2k^2)\)이고, \(2k^2\)가 정수이므로 \(n^2\)은 짝수입니다.

이것은 직접 증명 — 가정에서 출발해 정의를 풀고 결론에 도달했습니다.`,
          en: String.raw`(\(\Rightarrow\)) Suppose \(n\) is even.

Then \(n = 2k\) for some integer \(k\).

Squaring gives \(n^2 = 4k^2 = 2(2k^2)\), and since \(2k^2\) is an integer, \(n^2\) is even.

This is a direct proof — it starts from the assumption, unfolds the definition, and reaches the conclusion.`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Leftarrow\)) 역방향은 직접 증명이 막힙니다: “\(n^2\)이 짝수”라는 가정에서 \(n\)을 꺼내 쓸 방법이 없기 때문입니다.

대신 대우를 증명합니다: \(n\)이 홀수이면 \(n^2\)도 홀수이다.

\(n = 2k+1\)이라 두면 \(n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\)이고, \(2k^2 + 2k\)가 정수이므로 \(n^2\)은 홀수입니다.

대우가 참이므로 원래 함축 \(n^2\) 짝수 \(\Rightarrow\) \(n\) 짝수도 참입니다.`,
          en: String.raw`(\(\Leftarrow\)) The reverse direction resists a direct proof: from the assumption "\(n^2\) is even" there is no way to extract \(n\).

Prove the contrapositive instead: if \(n\) is odd then \(n^2\) is odd.

Write \(n = 2k+1\); then \(n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\), and since \(2k^2 + 2k\) is an integer, \(n^2\) is odd.

The contrapositive holds, so the original implication "\(n^2\) even \(\Rightarrow\) \(n\) even" holds.`,
        },
        display: [
          String.raw`(2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1\ \text{odd}`,
        ],
      },
      {
        text: {
          ko: String.raw`두 방향은 서로 다른 증명입니다: \(\Rightarrow\)는 짝수의 정의 \(n = 2k\)를 직접 풀어 썼고, \(\Leftarrow\)는 정의가 아닌 대우 명제로 우회했습니다.

둘 중 하나만 증명하면 동치가 아니라 함축 하나만 얻습니다.

“\(P \iff Q\)”를 주장하려면 두 화살표가 모두 필요하고, 보통은 이렇게 서로 다른 논증이 필요합니다.`,
          en: String.raw`The two directions are genuinely different proofs: \(\Rightarrow\) unfolds the definition of even, \(n = 2k\), directly, while \(\Leftarrow\) goes around it via the contrapositive.

Proving only one direction establishes an implication, not an equivalence.

To claim "\(P \iff Q\)" both arrows are needed, and they usually require different arguments like this.`,
        },
      },
    ],
  },
  {
    id: 'iff-square-equality',
    statement: {
      ko: String.raw`실수 \(x, y\)에 대해 \(x^2 = y^2\)인 것과 \(x = y\) 또는 \(x = -y\)인 것이 동치임을 증명하세요. \(\Rightarrow\) 방향은 \(x^2 - y^2 = (x-y)(x+y) = 0\)과 곱이 0이면 인자가 0이라는 성질을, \(\Leftarrow\) 방향은 각 경우에 대한 직접 대입을 사용하세요.`,
      en: String.raw`Prove that for real \(x, y\), \(x^2 = y^2\) holds if and only if \(x = y\) or \(x = -y\). For the \(\Rightarrow\) direction use the factorization \(x^2 - y^2 = (x-y)(x+y) = 0\) together with the zero-product property; for the \(\Leftarrow\) direction substitute directly in each case.`,
    },
    display: [
      String.raw`x^2 = y^2 \iff (x = y\ \text{or}\ x = -y)`,
      String.raw`\Rightarrow:\ x^2 - y^2 = (x-y)(x+y) = 0,\qquad \Leftarrow:\ (-y)^2 = y^2`,
    ],
    preset: { claim: 'abs-equal', n: 3 },
    presetCaption: {
      ko: String.raw`주장 \(|x| = |y| \Rightarrow x = y\), 테스트 쌍 \((3, -3)\): \(|3| = |-3| = 3\)이지만 \(3 \ne -3\) — 이 문제의 양방향 버전에 대한 반례입니다.`,
      en: String.raw`claim \(|x| = |y| \Rightarrow x = y\), test pair \((3, -3)\): \(|3| = |-3| = 3\) but \(3 \ne -3\) — a counterexample to the one-directional version this problem repairs both ways.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`(\(\Rightarrow\)) \(x^2 = y^2\)이라 가정합니다.

양변에서 \(y^2\)을 빼면 \(x^2 - y^2 = 0\)이고, 인수분해하면 \((x-y)(x+y) = 0\)입니다.

실수에서는 두 수의 곱이 0이면 둘 중 하나가 0이므로 (0이 아닌 수로 나누면 되기 때문입니다), \(x - y = 0\) 또는 \(x + y = 0\) — 즉 \(x = y\) 또는 \(x = -y\)입니다.`,
          en: String.raw`(\(\Rightarrow\)) Suppose \(x^2 = y^2\).

Subtracting \(y^2\) from both sides gives \(x^2 - y^2 = 0\), and factoring yields \((x-y)(x+y) = 0\).

For real numbers, a product of two numbers is 0 only if one of them is 0 (divide by whichever factor is nonzero), so \(x - y = 0\) or \(x + y = 0\) — i.e. \(x = y\) or \(x = -y\).`,
        },
      },
      {
        text: {
          ko: String.raw`(\(\Leftarrow\)) 역방향은 두 경우를 각각 직접 확인합니다.

\(x = y\)이면 \(x^2 = y^2\)는 자명하고, \(x = -y\)이면 \(x^2 = (-y)^2 = y^2\)입니다.

두 경우 모두 \(x^2 = y^2\)이 성립합니다.`,
          en: String.raw`(\(\Leftarrow\)) The reverse direction is checked directly in each case.

If \(x = y\) then \(x^2 = y^2\) is immediate, and if \(x = -y\) then \(x^2 = (-y)^2 = y^2\).

In both cases \(x^2 = y^2\) holds.`,
        },
      },
      {
        text: {
          ko: String.raw`주석: 이 양방향 정리는 씬의 반례를 설명합니다 — 먼저 \(|x| = |y| \iff x^2 = y^2\) 자체를 양방향으로 증명합니다.

\((\Rightarrow)\) \(|x| = |y|\)이면 양변을 제곱해 \(x^2 = |x|^2 = |y|^2 = y^2\)입니다 (\(|t|^2 = t^2\) 사용).

\((\Leftarrow)\) \(x^2 = y^2\)이면 \(|x|^2 = |y|^2\)이고, \(|x|, |y| \ge 0\)이며 제곱은 \([0, \infty)\)에서 단사(엄격히 증가)이므로 \(|x| = |y|\)입니다.

따라서 \(|x| = |y|\)는 \(x^2 = y^2\)와 동치이고, 실제로 강제되는 것은 “\(x = y\)”가 아니라 “\(x = y\) 또는 \(x = -y\)”입니다.

씬의 쌍 \((n, -n)\)은 바로 두 번째 경우의 증인입니다.

반례를 만난 뒤 주장을 어떻게 고쳐야 하는지 보여 주는 전형적인 예입니다.`,
          en: String.raw`Remark: this biconditional explains the scene's counterexample — first prove \(|x| = |y| \iff x^2 = y^2\) itself, in both directions.

\((\Rightarrow)\) If \(|x| = |y|\), squaring gives \(x^2 = |x|^2 = |y|^2 = y^2\) (using \(|t|^2 = t^2\)).

\((\Leftarrow)\) If \(x^2 = y^2\) then \(|x|^2 = |y|^2\); since \(|x|, |y| \ge 0\) and squaring is injective (strictly increasing) on \([0, \infty)\), it follows that \(|x| = |y|\).

Hence \(|x| = |y|\) is equivalent to \(x^2 = y^2\), so what is actually forced is not "\(x = y\)" but "\(x = y\) or \(x = -y\)".

The scene's pairs \((n, -n)\) are witnesses to the second alternative.

This is the classic pattern: a counterexample shows how the claim must be repaired.`,
        },
      },
    ],
  },
];
