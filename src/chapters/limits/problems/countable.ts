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
                ko: String.raw`\(a_0 = 0\), \(k \geq 1\)에 대해 \(a_{2k-1} = k\), \(a_{2k} = -k\)라 두면 모든 정수가 정확히 한 번씩 등장합니다: \(m = 0\)은 \(a_0\)으로, \(m \geq 1\)은 \(a_{2m-1}\)로, \(m < 0\)은 \(a_{-2m}\)으로 나타납니다.`,
                en: String.raw`With \(a_0 = 0\), \(a_{2k-1} = k\) and \(a_{2k} = -k\) for \(k \geq 1\), every integer appears exactly once: \(m = 0\) as \(a_0\), \(m \geq 1\) as \(a_{2m-1}\), and \(m < 0\) as \(a_{-2m}\).`,
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
          display: [String.raw`x_n = \begin{cases} 5 & r_n\text{'s }n\text{th digit} \ne 5 \\ 6 & \text{otherwise} \end{cases}`],
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
                ko: String.raw`\(x\)의 \(n\)번째 자리수를 "\(r_n\)의 \(n\)번째 자리수가 \(5\)가 아니면 \(5\), 그렇지 않으면 \(6\)"으로 정합니다. 그러면 \(x \in (0,1)\)이지만, 모든 \(n\)에 대해 \(n\)번째 자리수가 다르므로 \(x \ne r_n\)입니다 — 모순입니다.`,
                en: String.raw`Define \(x\) digit by digit: its \(n\)-th digit is \(5\) when \(r_n\)'s \(n\)-th digit is not \(5\), and \(6\) otherwise. Then \(x \in (0,1)\), but \(x \ne r_n\) for every \(n\) since they differ at digit \(n\) — a contradiction.`,
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
                ko: String.raw`[스케치] \(A_1, A_2, \dots\)를 무한 격자의 행으로 배열합니다. 유리수를 나열할 때와 똑같이 대각선 순서로 훑으면, 각 원소는 언젠가 유한한 대각선 위치에서 등장합니다.`,
                en: String.raw`[Sketch] Arrange \(A_1, A_2, \dots\) as the rows of an infinite grid. Sweeping it in diagonal order — exactly as for the rationals — every element shows up at some finite diagonal position.`,
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
