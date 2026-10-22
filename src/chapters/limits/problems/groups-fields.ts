import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'z-additive-group',
          statement: {
            ko: String.raw`\((\mathbb{Z}, +)\)가 군임을 세 공리로 확인하세요.`,
            en: String.raw`Check that \((\mathbb{Z}, +)\) is a group from the three axioms.`,
          },
          display: [String.raw`0 \in \mathbb{Z},\qquad a + (-a) = 0`],
          preset: { table: 'z5' },
          presetCaption: {
            ko: String.raw`\((\mathbb{Z}_5, \times)\) 표 — 덧셈군 \((\mathbb{Z},+)\)도 같은 세 공리를 만족합니다.`,
            en: String.raw`The \((\mathbb{Z}_5, \times)\) table — the additive group \((\mathbb{Z},+)\) satisfies the same three axioms.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`닫힘: 두 정수의 합은 정수입니다. 결합법칙은 정수의 덧셈이 이미 만족하므로 그대로 이어받습니다.`,
                en: String.raw`Closure: the sum of two integers is an integer. Associativity is inherited from integer addition.`,
              },
            },
            {
              text: {
                ko: String.raw`항등원은 \(0 \in \mathbb{Z}\)이며 \(a + 0 = a\)입니다.

\(a\)의 역원은 \(-a \in \mathbb{Z}\)이며 \(a + (-a) = 0\)을 만족합니다.

여기서는 오른쪽 항등원·오른쪽 역원만 확인했지만, \(\mathbb{Z}\)에서 덧셈의 교환법칙이 성립하므로 왼쪽 버전 \(0 + a = a\)와 \((-a) + a = 0\)도 자동으로 따라옵니다.`,
                en: String.raw`The identity is \(0 \in \mathbb{Z}\) with \(a + 0 = a\).

The inverse of \(a\) is \(-a \in \mathbb{Z}\), satisfying \(a + (-a) = 0\).

Only the right identity and right inverse are checked here; since addition on \(\mathbb{Z}\) is commutative, the left versions \(0 + a = a\) and \((-a) + a = 0\) follow automatically.`,
              },
            },
          ],
        },
        {
          id: 'z-mult-not-group',
          statement: {
            ko: String.raw`\((\mathbb{Z}, \times)\)가 군이 아님을 증명하세요.`,
            en: String.raw`Prove \((\mathbb{Z}, \times)\) is not a group.`,
          },
          display: [String.raw`2x = 1 \Rightarrow x = \frac{1}{2} \notin \mathbb{Z}`],
          preset: { table: 'z6' },
          presetCaption: {
            ko: String.raw`\((\mathbb{Z}_6, \times)\) 표 — \(2\)의 역원이 없습니다.`,
            en: String.raw`The \((\mathbb{Z}_6, \times)\) table — 2 has no inverse.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`곱셈에 대한 항등원은 \(1\)이어야 합니다 (\(1 \cdot a = a\)이므로).`,
                en: String.raw`The multiplicative identity would have to be \(1\), since \(1 \cdot a = a\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(2\)의 역원이 존재하려면 \(2x = 1\)인 \(x \in \mathbb{Z}\)가 있어야 합니다.

그러나 \(\mathbb{Z}\) 내부의 논증으로 불가능합니다: 모든 정수 \(x\)에 대해 \(2x\)는 짝수인데 \(1\)은 홀수이므로 등식 \(2x = 1\)은 \(\mathbb{Z}\)에서 해를 가질 수 없습니다 (\mathbb{Q}\)에서 풀면 \(x = \frac{1}{2} \notin \mathbb{Z}\)인 것과 일치합니다).

따라서 역원 공리가 깨지고 \((\mathbb{Z}, \times)\)는 군이 아닙니다.`,
                en: String.raw`An inverse of \(2\) would need \(x \in \mathbb{Z}\) with \(2x = 1\).

This is impossible by an argument inside \(\mathbb{Z}\): for every integer \(x\), \(2x\) is even, whereas \(1\) is odd, so the equation \(2x = 1\) has no solution in \(\mathbb{Z}\) (consistently, solving in \(\mathbb{Q}\) gives \(x = \frac{1}{2} \notin \mathbb{Z}\)).

So the inverse axiom fails, and \((\mathbb{Z}, \times)\) is not a group.`,
              },
            },
          ],
        },
        {
          id: 'a-times-zero',
          statement: {
            ko: String.raw`모든 체에서 \(a \cdot 0 = 0\)임을 공리로부터 증명하세요.`,
            en: String.raw`Prove \(a \cdot 0 = 0\) in any field, from the axioms.`,
          },
          display: [String.raw`a \cdot 0 = a \cdot (0 + 0) = a \cdot 0 + a \cdot 0`],
          preset: { table: 'z6' },
          presetCaption: {
            ko: String.raw`덧셈군의 소거법칙이 핵심입니다.`,
            en: String.raw`Cancellation in the additive group is the key.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`분배법칙에 의해 \(a \cdot 0 = a \cdot (0 + 0) = a \cdot 0 + a \cdot 0\)입니다.`,
                en: String.raw`By distributivity, \(a \cdot 0 = a \cdot (0 + 0) = a \cdot 0 + a \cdot 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(b = a \cdot 0\)이라 두면 위 식은 \(b = b + b\)입니다.

양변에 \(-b\)를 더합니다 (덧셈 역원이 존재하므로): 왼쪽은 \(-b + b = 0\)입니다.

오른쪽은 결합법칙으로 괄호를 다시 묶어야 합니다: \(-b + (b + b) = (-b + b) + b = 0 + b = b\).

따라서 \(0 = b\), 즉 \(0 = a \cdot 0\)을 얻습니다.`,
                en: String.raw`Put \(b = a \cdot 0\), so the identity above reads \(b = b + b\).

Add \(-b\) to both sides (additive inverses exist): the left side becomes \(-b + b = 0\).

The right side needs associativity to rebracket: \(-b + (b + b) = (-b + b) + b = 0 + b = b\).

Hence \(0 = b\), i.e. \(0 = a \cdot 0\).`,
              },
            },
          ],
        },
      ];
