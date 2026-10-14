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
                ko: String.raw`항등원은 \(0 \in \mathbb{Z}\)이며 \(a + 0 = a\)입니다. \(a\)의 역원은 \(-a \in \mathbb{Z}\)이며 \(a + (-a) = 0\)을 만족합니다.`,
                en: String.raw`The identity is \(0 \in \mathbb{Z}\) with \(a + 0 = a\). The inverse of \(a\) is \(-a \in \mathbb{Z}\), satisfying \(a + (-a) = 0\).`,
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
                ko: String.raw`\(2\)의 역원이 존재하려면 \(2x = 1\)인 \(x \in \mathbb{Z}\)가 있어야 하지만, \(x = \frac{1}{2} \notin \mathbb{Z}\)이므로 역원 공리가 깨집니다. 따라서 \((\mathbb{Z}, \times)\)는 군이 아닙니다.`,
                en: String.raw`An inverse of \(2\) would need \(x \in \mathbb{Z}\) with \(2x = 1\), but \(x = \frac{1}{2} \notin \mathbb{Z}\). So the inverse axiom fails, and \((\mathbb{Z}, \times)\) is not a group.`,
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
                ko: String.raw`양변에 \(-(a \cdot 0)\)을 더하면 (덧셈에 대한 역원이 존재하므로) \(0 = a \cdot 0\)을 얻습니다.`,
                en: String.raw`Adding \(-(a \cdot 0)\) to both sides (additive inverses exist) gives \(0 = a \cdot 0\).`,
              },
            },
          ],
        },
      ];
