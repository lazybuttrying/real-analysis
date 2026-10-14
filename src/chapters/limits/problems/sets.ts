import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'demorgan',
          statement: {
            ko: String.raw`\((A \cup B)^c = A^c \cap B^c\)임을 원소로 직접 증명하세요.`,
            en: String.raw`Prove \((A \cup B)^c = A^c \cap B^c\) element by element.`,
          },
          display: [String.raw`x \in (A \cup B)^c \iff x \notin A \cup B \iff x \notin A \text{ and } x \notin B \iff x \in A^c \cap B^c`],
          preset: { op: 'union', fnmode: 'bijective' },
          presetCaption: {
            ko: String.raw`합집합이 켜진 벤 다이어그램 — 여집합을 씌우면 바깥 영역만 남습니다.`,
            en: String.raw`Venn diagram with the union lit — complementing leaves only the outside region.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`원소 \(x\)를 잡습니다. 여집합의 정의에 의해 \(x \in (A \cup B)^c \iff x \notin A \cup B\)입니다.`,
                en: String.raw`Take an element \(x\). By the definition of complement, \(x \in (A \cup B)^c \iff x \notin A \cup B\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x \notin A \cup B \iff \lnot(x \in A \lor x \in B)\)입니다. 명제논리의 드모르간 법칙에 의해 이는 \(\lnot(x \in A) \land \lnot(x \in B)\), 즉 \((x \notin A) \land (x \notin B)\)와 동치입니다.`,
                en: String.raw`\(x \notin A \cup B \iff \lnot(x \in A \lor x \in B)\). By the propositional De Morgan's law this is \(\lnot(x \in A) \land \lnot(x \in B)\), i.e. \((x \notin A) \land (x \notin B)\).`,
              },
            },
            {
              text: {
                ko: String.raw`\((x \notin A) \land (x \notin B) \iff x \in A^c \land x \in B^c \iff x \in A^c \cap B^c\)입니다. \(x\)가 임의였으므로 \((A \cup B)^c = A^c \cap B^c\)입니다.`,
                en: String.raw`\((x \notin A) \land (x \notin B) \iff x \in A^c \land x \in B^c \iff x \in A^c \cap B^c\). Since \(x\) was arbitrary, \((A \cup B)^c = A^c \cap B^c\).`,
              },
            },
          ],
        },
        {
          id: 'bijective-inverse',
          statement: {
            ko: String.raw`\(f: A \to B\)가 전단사 \(\iff\) 양쪽 역함수 \(g: B \to A\) (\(g \circ f = \mathrm{id}_A\), \(f \circ g = \mathrm{id}_B\))가 존재함을 증명하세요.`,
            en: String.raw`Prove \(f: A \to B\) is bijective iff a two-sided inverse \(g: B \to A\) exists.`,
          },
          preset: { op: 'intersection', fnmode: 'bijective' },
          presetCaption: {
            ko: String.raw`전단사 모드 — 모든 점이 정확히 한 번씩 연결됩니다.`,
            en: String.raw`Bijective mode — every dot is hit exactly once.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`(⇒) \(b \in B\)마다 \(f(a) = b\)인 \(a\)가 존재합니다(전사). 단사이므로 그 \(a\)는 유일합니다. 이를 \(g(b)\)라 정의하면 \(g: B \to A\)입니다.`,
                en: String.raw`(⇒) For each \(b \in B\) there is an \(a\) with \(f(a) = b\) (surjective), and by injectivity that \(a\) is unique. Call it \(g(b)\); this defines \(g: B \to A\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(g(f(a)) = a\)인 이유는 \(f(a)\)에 대응하는 유일한 원소가 \(a\) 자신이므로, 그리고 \(f(g(b)) = b\)인 이유는 \(g(b)\)의 정의 그대로입니다.`,
                en: String.raw`\(g(f(a)) = a\) because the unique element mapping to \(f(a)\) is \(a\) itself; and \(f(g(b)) = b\) is exactly the definition of \(g(b)\).`,
              },
            },
            {
              text: {
                ko: String.raw`(⇐) 그런 \(g\)가 존재한다고 하자. \(f(a_1) = f(a_2)\)이면 양변에 \(g\)를 적용해 \(a_1 = g(f(a_1)) = g(f(a_2)) = a_2\) — 단사입니다. 한편 \(b \in B\)에 대해 \(a = g(b)\)라 두면 \(f(a) = f(g(b)) = b\) — 전사입니다. 따라서 \(f\)는 전단사입니다.`,
                en: String.raw`(⇐) Suppose such a \(g\) exists. If \(f(a_1) = f(a_2)\), applying \(g\) gives \(a_1 = g(f(a_1)) = g(f(a_2)) = a_2\) — injective. And for \(b \in B\), putting \(a = g(b)\) gives \(f(a) = f(g(b)) = b\) — surjective. Hence \(f\) is bijective.`,
              },
            },
          ],
        },
        {
          id: 'inclusion-exclusion',
          statement: {
            ko: String.raw`유한집합에 대해 \(\lvert A \cup B\rvert = \lvert A\rvert + \lvert B\rvert - \lvert A \cap B\rvert\)임을 증명하고, \(\lvert A\rvert=5\), \(\lvert B\rvert=4\), \(\lvert A\cap B\rvert=2\)일 때를 계산하세요.`,
            en: String.raw`Prove \(\lvert A \cup B\rvert = \lvert A\rvert + \lvert B\rvert - \lvert A \cap B\rvert\) for finite sets, and evaluate it for \(\lvert A\rvert=5\), \(\lvert B\rvert=4\), \(\lvert A\cap B\rvert=2\).`,
          },
          display: [String.raw`\lvert A \cup B\rvert = 5 + 4 - 2 = 7`],
          preset: { op: 'union', fnmode: 'injective' },
          presetCaption: {
            ko: String.raw`\(\lvert A\rvert=5\), \(\lvert B\rvert=4\), 겹치는 부분 \(2\) — 합집합은 \(7\).`,
            en: String.raw`\(\lvert A\rvert=5\), \(\lvert B\rvert=4\), overlap \(2\) — the union has \(7\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(A \cup B\)는 서로소인 세 조각 \(A \setminus B\), \(B \setminus A\), \(A \cap B\)의 분리합집합입니다.`,
                en: String.raw`\(A \cup B\) is the disjoint union of the three pairwise-disjoint pieces \(A \setminus B\), \(B \setminus A\), and \(A \cap B\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\lvert A \rvert = \lvert A \setminus B \rvert + \lvert A \cap B \rvert\), \(\lvert B \rvert = \lvert B \setminus A \rvert + \lvert A \cap B \rvert\)입니다 (둘 다 분리합집합).`,
                en: String.raw`\(\lvert A \rvert = \lvert A \setminus B \rvert + \lvert A \cap B \rvert\) and \(\lvert B \rvert = \lvert B \setminus A \rvert + \lvert A \cap B \rvert\) (both are disjoint unions).`,
              },
            },
            {
              text: {
                ko: String.raw`두 식을 더하면 \(\lvert A \rvert + \lvert B \rvert = \lvert A \cup B \rvert + \lvert A \cap B \rvert\) — 겹치는 부분이 두 번 세어졌습니다. 정리하면 \(\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert\)입니다.`,
                en: String.raw`Adding the two equations gives \(\lvert A \rvert + \lvert B \rvert = \lvert A \cup B \rvert + \lvert A \cap B \rvert\) — the overlap was counted twice. Rearranging yields \(\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\lvert A \rvert = 5\), \(\lvert B \rvert = 4\), \(\lvert A \cap B \rvert = 2\)를 대입하면 \(\lvert A \cup B \rvert = 5 + 4 - 2 = 7\)입니다.`,
                en: String.raw`Substituting \(\lvert A \rvert = 5\), \(\lvert B \rvert = 4\), \(\lvert A \cap B \rvert = 2\) gives \(\lvert A \cup B \rvert = 5 + 4 - 2 = 7\).`,
              },
            },
          ],
        },
      ];
