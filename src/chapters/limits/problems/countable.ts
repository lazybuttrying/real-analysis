import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'integers-countable',
          statement: {
            ko: String.raw`\(\mathbb{Z}\)가 가산임을 명시적 나열 \(0, 1, -1, 2, -2, \dots\)로 증명하세요.`,
            en: String.raw`Prove \(\mathbb{Z}\) is countable via the explicit enumeration \(0, 1, -1, 2, -2, \dots\).`,
          },
          display: [String.raw`a_0 = 0,\quad a_{2k-1} = k,\quad a_{2k} = -k\ \ (k \geq 1)`],
          preset: { panel: 'rationals', n: 20 },
          presetCaption: {
            ko: String.raw`유리수 나열과 같은 대각선 아이디어 — 정수부터 시작합니다.`,
            en: String.raw`The same diagonal idea as the rationals — starting with the integers.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_0 = 0\), \(k \geq 1\)에 대해 \(a_{2k-1} = k\), \(a_{2k} = -k\)라 두면 모든 정수가 등장합니다(전사성): \(m = 0\)은 \(a_0\)으로, \(m \geq 1\)은 \(a_{2m-1}\)로, \(m < 0\)은 \(a_{-2m}\)으로 나타납니다. 단사성(정확히 한 번)도 필요합니다: 인덱스 집합 \(\{0\}\), \(\{2k-1 : k \geq 1\}\) (홀수), \(\{2k : k \geq 1\}\) (짝수 양의 정수)는 서로소이고 그 합집합이 전체 인덱스입니다. 값의 범위도 \(\{0\}\), 양의 정수, 음의 정수로 서로소하게 갈리고, 각 부류 안에서는 \(k\)가 값에서 유일하게 복원됩니다 (\(k = m\) 또는 \(k = -m\)). 따라서 서로 다른 인덱스는 서로 다른 값을 줍니다.`,
                en: String.raw`With \(a_0 = 0\), \(a_{2k-1} = k\) and \(a_{2k} = -k\) for \(k \geq 1\), every integer appears (surjectivity): \(m = 0\) as \(a_0\), \(m \geq 1\) as \(a_{2m-1}\), and \(m < 0\) as \(a_{-2m}\). Injectivity (exactly once) also needs an argument: the index classes \(\{0\}\), \(\{2k-1 : k \geq 1\}\) (odd indices), and \(\{2k : k \geq 1\}\) (even positive indices) are pairwise disjoint and cover all indices. Their value ranges \(\{0\}\), the positive integers, and the negative integers are likewise disjoint, and within each class \(k\) is uniquely recovered from the value (\(k = m\) or \(k = -m\)). Hence distinct indices give distinct values.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(n \mapsto a_n\)은 \(\mathbb{N} \to \mathbb{Z}\)의 전단사이며, \(\mathbb{Z}\)는 가산입니다.`,
                en: String.raw`Hence \(n \mapsto a_n\) is a bijection \(\mathbb{N} \to \mathbb{Z}\), so \(\mathbb{Z}\) is countable.`,
              },
            },
          ],
        },
        {
          id: 'interval-uncountable',
          statement: {
            ko: String.raw`\((0,1)\)이 비가산임을 칸토어의 대각선 논법으로 증명하세요.`,
            en: String.raw`Prove \((0,1)\) is uncountable by Cantor's diagonal argument.`,
          },
          display: [String.raw`d_n = \begin{cases} 5 & r_n\text{'s }n\text{th digit} \ne 5 \\ 6 & \text{otherwise} \end{cases} \qquad (d_n \text{ is the } n\text{th digit of } x)`],
          preset: { panel: 'diagonal', n: 8 },
          presetCaption: {
            ko: String.raw`대각선을 뒤집어 만든 수열은 목록에 있을 수 없습니다.`,
            en: String.raw`The flipped diagonal cannot be anywhere in the list.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((0,1)\)의 원소를 \(r_1, r_2, \dots\)로 빠짐없이 나열할 수 있다고 가정합니다. 각 \(r_n\)은 무한한 \(9\)로 끝나지 않는 소수 전개를 유일하게 가지므로, 그 \(n\)번째 자리수가 잘 정의됩니다.`,
                en: String.raw`Suppose the elements of \((0,1)\) could be fully enumerated as \(r_1, r_2, \dots\). Each \(r_n\) has a unique decimal expansion not ending in infinite \(9\)s, so its \(n\)-th digit is well defined.`,
              },
            },
            {
              text: {
                ko: String.raw`\(x\)의 \(n\)번째 자리수 \(d_n\)을 "\(r_n\)의 \(n\)번째 자리수가 \(5\)가 아니면 \(5\), 그렇지 않으면 \(6\)"으로 정합니다. 그러면 \(x \in (0,1)\)입니다. 자리수 차이에서 \(x \ne r_n\)을 끌어내려면 이중 전개 문제를 처리해야 합니다: \(x\)의 전개는 \(5\)와 \(6\)만으로 이루어지므로 \(0\)의 꼬리도 \(9\)의 꼬리도 없습니다. 그런데 어떤 수의 두 소수 전개는 한쪽이 \(0\)의 꼬리로, 다른 쪽이 \(9\)의 꼬리로 끝날 때만 가능하므로, \(5, 6\)만 쓰는 전개는 \(x\)의 유일한 전개 — 즉 표준 전개 — 입니다. \(r_n\)의 표준 전개와 \(n\)번째 자리에서 다르므로 \(x \ne r_n\)입니다 (모든 \(n\)) — 모순입니다.`,
                en: String.raw`Define the \(n\)-th digit \(d_n\) of \(x\) to be \(5\) when \(r_n\)'s \(n\)-th digit is not \(5\), and \(6\) otherwise. Then \(x \in (0,1)\). To pass from a digit difference to \(x \ne r_n\) the dual-expansion issue must be addressed: the expansion of \(x\) uses only the digits \(5\) and \(6\), so it has no tail of \(0\)s and no tail of \(9\)s. But two decimal expansions of the same number are possible only when one ends in a tail of \(0\)s and the other in a tail of \(9\)s, so an expansion using only \(5, 6\) is the unique — canonical — expansion of \(x\). It differs from the canonical expansion of \(r_n\) at digit \(n\), hence \(x \ne r_n\) for every \(n\) — a contradiction.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \((0,1)\)의 나열은 존재하지 않습니다: \((0,1)\)은 비가산입니다.`,
                en: String.raw`Hence no enumeration of \((0,1)\) exists: \((0,1)\) is uncountable.`,
              },
            },
          ],
        },
        {
          id: 'countable-union',
          statement: {
            ko: String.raw`가산 집합들의 가산 합집합이 가산임을 대각선 나열의 아이디어로 설명하세요. (엄밀한 증명은 생략하고 아이디어 수준으로 둡니다.)`,
            en: String.raw`Explain at idea level why a countable union of countable sets is countable, via diagonal enumeration. (Idea level; full proof omitted.)`,
          },
          preset: { panel: 'rationals', n: 64 },
          presetCaption: {
            ko: String.raw`\(n=64\): 격자를 대각선으로 훑는 바로 그 방법입니다.`,
            en: String.raw`\(n=64\): the same diagonal sweep of the grid.`,
          },
    isHint: true,
    proof: [
            {
              text: {
                ko: String.raw`[스케치] \(A_1, A_2, \dots\)를 격자의 행으로 배열합니다. 각 \(A_i\)의 나열은 미리 선택해 둡니다(선택공리의 가산 선택): 빈집합인 행은 건너뜁니다. 유한한 \(A_i\)는 원소 하나를 고정해 반복해서 채워 무한 행으로 만듭니다(padding — 중복은 나중에 제거하거나 전사가 아닌 단사 구성으로 넘깁니다). 이렇게 모든 행이 무한해진 격자를 유리수를 나열할 때와 똑같이 대각선 순서로 훑으면, 각 원소는 언젠가 유한한 대각선 위치에서 등장합니다.`,
                en: String.raw`[Sketch] Arrange \(A_1, A_2, \dots\) as the rows of a grid. Choose an enumeration of each \(A_i\) in advance (countable choice): skip rows with \(A_i\) empty. Pad each finite \(A_i\) to an infinite row by repeating one fixed element (padding — duplicates are removed afterwards, or the construction is read as a surjection from \(\mathbb{N} \times \mathbb{N}\) rather than an injection). With every row now infinite, sweeping the grid in diagonal order — exactly as for the rationals — every element shows up at some finite diagonal position.`,
              },
            },
            {
              text: {
                ko: String.raw`[스케치] 이는 아이디어 수준의 설명입니다: 엄밀한 증명에는 중복 원소를 다루는 주의가 필요합니다.`,
                en: String.raw`[Sketch] This is an idea-level explanation; the full proof needs care with duplicate elements.`,
              },
            },
          ],
        },
      ];
