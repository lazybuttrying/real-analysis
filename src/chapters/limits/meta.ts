import type { ChapterMeta } from '../../contracts.ts';

/**
 * Pure data. Imports nothing except type imports.
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 * Summaries embed math as inline TeX between \( and \) (see splitInlineMath in contracts.ts).
 * NOTE: chapter numbering is never stored here — the shell derives it from the
 * catalog order in src/catalog.ts.
 */
export const limits: ChapterMeta = {
  id: 'limits',
  title: { ko: '극한과 연속', en: 'Limits and Continuity' },
  summary: {
    ko: '수열의 극한, 유리수의 빈틈, 연속의 의미를 눈으로 확인합니다.',
    en: 'See limits, the gaps in the rationals, and continuity with your own eyes.',
  },
  scenes: [
    {
      id: 'sets',
      title: { ko: '집합과 함수', en: 'Sets and Functions' },
      order: 1,
      summary: {
        ko: String.raw`집합의 연산 \(A \cup B\), \(A \cap B\), \(A^c\)와 드모르간 법칙, 그리고 단사·전사·전단사를 그림으로 확인합니다.`,
        en: String.raw`See set operations \(A \cup B\), \(A \cap B\), \(A^c\), De Morgan's laws, and injective / surjective / bijective maps as pictures.`,
      },
      tex: [
        String.raw`(A \cup B)^c = A^c \cap B^c`,
        String.raw`f \text{ bijective} \iff \exists g: g \circ f = \mathrm{id}`,
      ],
      controls: [
        {
          kind: 'select',
          key: 'op',
          label: { ko: '집합 연산', en: 'Set operation' },
          options: ['union', 'intersection', 'complement', 'difference', 'symdiff'],
          init: 'union',
        },
        {
          kind: 'select',
          key: 'fnmode',
          label: { ko: '함수 모양', en: 'Map shape' },
          options: ['injective', 'surjective', 'bijective', 'neither'],
          init: 'bijective',
        },
      ],
      problems: [
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
      ],
    },
    {
      id: 'supremum',
      title: { ko: '상한과 완비성', en: 'The Supremum Axiom' },
      order: 2,
      summary: {
        ko: String.raw`위로 유계인 집합은 가장 작은 상한 \(\sup S\)를 갖습니다 — 실수의 빈틈을 메우는 공리, 유리수의 구멍 장면의 짝꿍입니다.`,
        en: String.raw`Every bounded-above set has a least upper bound \(\sup S\) — the axiom filling the gaps in the rationals, twin of the rational-holes scene.`,
      },
      tex: [String.raw`\sup\left\{1-\frac{1}{n}\right\} = 1`, String.raw`S \ne \varnothing \text{ bounded above } \Rightarrow \sup S \text{ exists}`],
      controls: [
        {
          kind: 'select',
          key: 'set',
          label: { ko: '집합', en: 'Set' },
          options: ['one-minus', 'sqrt2'],
          init: 'one-minus',
        },
        {
          kind: 'slider',
          key: 'bound',
          label: { ko: '상한 후보', en: 'Upper-bound candidate' },
          min: 0.5,
          max: 2,
          step: 0.01,
          init: 1.4,
        },
      ],
      problems: [
        {
          id: 'sup-one-minus',
          statement: {
            ko: String.raw`\(S = \left\{1 - \frac{1}{n} : n \geq 1\right\}\)에 대해 \(\sup S = 1\)임을 증명하세요. (\(1 \notin S\)임에 유의하세요.)`,
            en: String.raw`Prove \(\sup S = 1\) for \(S = \left\{1 - \frac{1}{n} : n \geq 1\right\}\). (Note \(1 \notin S\).)`,
          },
          display: [String.raw`\sup\left\{1-\frac{1}{n}\right\} = 1 \notin S`],
          preset: { set: 'one-minus', bound: 1.2 },
          presetCaption: {
            ko: String.raw`상한 후보 \(1.2\) — 참 상한 \(1\)보다 \(0.2\) 큽니다.`,
            en: String.raw`Candidate \(1.2\) — \(0.2\) above the true supremum \(1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`모든 \(n\)에 대해 \(1 - \frac{1}{n} < 1\)이므로, \(1\)은 \(S\)의 상계입니다.`,
                en: String.raw`Since \(1 - \frac{1}{n} < 1\) for every \(n\), \(1\) is an upper bound of \(S\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(u < 1\)인 임의의 실수를 잡습니다. \(1 - \frac{1}{n} > u\)는 \(\frac{1}{n} < 1 - u\), 즉 \(n > \frac{1}{1-u}\)와 동치입니다. 아르키메데스 성질에 의해 그런 \(n\)이 존재하므로 \(u\)는 상계가 아닙니다.`,
                en: String.raw`Take any real \(u < 1\). The inequality \(1 - \frac{1}{n} > u\) is equivalent to \(\frac{1}{n} < 1 - u\), i.e. \(n > \frac{1}{1-u}\). By the Archimedean property such an \(n\) exists, so \(u\) is not an upper bound.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(1\)보다 작은 상계는 없고, \(1\)은 가장 작은 상계입니다: \(\sup S = 1\). 참고로 \(n = 1\)일 때 원소는 \(0\)이므로 \(1\) 자체는 \(S\)에 속하지 않습니다 — 상한은 집합의 원소일 필요가 없습니다.`,
                en: String.raw`So there is no upper bound below \(1\): \(1\) is the least upper bound, \(\sup S = 1\). For reference, the \(n = 1\) term is \(0\), so \(1 \notin S\) — a supremum need not belong to the set.`,
              },
            },
          ],
        },
        {
          id: 'sup-sum',
          statement: {
            ko: String.raw`위로 유계인 공집합이 아닌 \(A, B \subset \mathbb{R}\)에 대해 \(\sup(A+B) = \sup A + \sup B\)임을 증명하세요.`,
            en: String.raw`Prove \(\sup(A+B) = \sup A + \sup B\) for nonempty bounded-above \(A, B \subset \mathbb{R}\).`,
          },
          preset: { set: 'one-minus', bound: 1.5 },
          presetCaption: {
            ko: String.raw`상한 후보 \(1.5\)에서 참 상한으로 조여옵니다.`,
            en: String.raw`Tightening the candidate \(1.5\) down to the true supremum.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`(≤) 모든 \(a \in A\), \(b \in B\)에 대해 \(a + b \leq \sup A + \sup B\)이므로, \(\sup A + \sup B\)는 \(A + B\)의 상계입니다. 따라서 \(\sup(A+B) \leq \sup A + \sup B\)입니다.`,
                en: String.raw`(≤) For all \(a \in A\) and \(b \in B\), \(a + b \leq \sup A + \sup B\), so \(\sup A + \sup B\) is an upper bound of \(A + B\). Hence \(\sup(A+B) \leq \sup A + \sup B\).`,
              },
            },
            {
              text: {
                ko: String.raw`(≥) \(\varepsilon > 0\)을 잡습니다. \(a > \sup A - \frac{\varepsilon}{2}\)인 \(a \in A\)와 \(b > \sup B - \frac{\varepsilon}{2}\)인 \(b \in B\)를 고를 수 있습니다(상한의 정의). 그러면 \(a + b > \sup A + \sup B - \varepsilon\)이므로 \(\sup(A+B) \geq \sup A + \sup B - \varepsilon\)입니다.`,
                en: String.raw`(≥) Let \(\varepsilon > 0\). We can choose \(a \in A\) with \(a > \sup A - \frac{\varepsilon}{2}\) and \(b \in B\) with \(b > \sup B - \frac{\varepsilon}{2}\) (definition of supremum). Then \(a + b > \sup A + \sup B - \varepsilon\), so \(\sup(A+B) \geq \sup A + \sup B - \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon\)이 임의였으므로 \(\sup(A+B) \geq \sup A + \sup B\)입니다. 두 부등식을 합쳐 \(\sup(A+B) = \sup A + \sup B\)를 얻습니다.`,
                en: String.raw`Since \(\varepsilon\) was arbitrary, \(\sup(A+B) \geq \sup A + \sup B\). Combining the two inequalities gives \(\sup(A+B) = \sup A + \sup B\).`,
              },
            },
          ],
        },
        {
          id: 'sqrt2-exists',
          statement: {
            ko: String.raw`완비성 공리로 \(s = \sup\{x \in \mathbb{Q} : x \geq 0, x^2 < 2\}\)가 존재함을 받아들이고, \(s^2 = 2\)임을 검증하세요. (존재 자체의 증명은 아이디어 수준으로 둡니다.)`,
            en: String.raw`Accept from completeness that \(s = \sup\{x \in \mathbb{Q} : x \geq 0, x^2 < 2\}\) exists, and verify \(s^2 = 2\). (The existence step is idea-level.)`,
          },
          display: [String.raw`s^2 < 2 \Rightarrow \text{contradiction},\quad s^2 > 2 \Rightarrow \text{contradiction}`],
          preset: { set: 'sqrt2', bound: 1.5 },
          presetCaption: {
            ko: String.raw`\(\sqrt{2} \approx 1.4142\) — 유리수 절단값들이 구멍을 향해 다가갑니다.`,
            en: String.raw`\(\sqrt{2} \approx 1.4142\) — rational truncations approach the hole.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`(보조정리 — 인용) 유리수 \(\mathbb{Q}\)는 \(\mathbb{R}\)에서 조밀합니다: 실수의 모든 열린 구간 안에는 유리수가 존재합니다.`,
                en: String.raw`(Lemma — cited) The rationals \(\mathbb{Q}\) are dense in \(\mathbb{R}\): every open interval of reals contains a rational number.`,
              },
            },
            {
              text: {
                ko: String.raw`\(S = \{x \in \mathbb{Q} : x \geq 0, x^2 < 2\}\)는 공집합이 아니고(\(1 \in S\)), 위로 유계입니다(예: \(2\)가 상계). 완비성 공리에 의해 \(s = \sup S\)가 존재합니다.`,
                en: String.raw`\(S = \{x \in \mathbb{Q} : x \geq 0, x^2 < 2\}\) is nonempty (\(1 \in S\)) and bounded above (e.g. \(2\) is an upper bound). By the completeness axiom, \(s = \sup S\) exists.`,
              },
            },
            {
              text: {
                ko: String.raw`\(s^2 < 2\)라 가정합니다. \(\varepsilon = 2 - s^2 > 0\)이라 두면, 보조정리에 의해 \(s < q < s + \frac{\varepsilon}{2(s+1)}\)인 유리수 \(q\)가 있습니다. 그러면 \(q^2 - s^2 = (q-s)(q+s) < \varepsilon\)이므로 \(q^2 < s^2 + \varepsilon = 2\) — 즉 \(q \in S\)인데 \(q > s\)이므로 \(s\)가 상한이라는 데 모순입니다.`,
                en: String.raw`Suppose \(s^2 < 2\). Put \(\varepsilon = 2 - s^2 > 0\). By the lemma there is a rational \(q\) with \(s < q < s + \frac{\varepsilon}{2(s+1)}\). Then \(q^2 - s^2 = (q-s)(q+s) < \varepsilon\), so \(q^2 < s^2 + \varepsilon = 2\) — i.e. \(q \in S\) with \(q > s\), contradicting that \(s\) is an upper bound.`,
              },
            },
            {
              text: {
                ko: String.raw`\(s^2 > 2\)라 가정합니다. \(\delta = s^2 - 2 > 0\)이라 두면, 보조정리에 의해 \(s - \frac{\delta}{2s} < r < s\)인 유리수 \(r\)이 있습니다. 그러면 \(s^2 - r^2 = (s-r)(s+r) < \delta\)이므로 \(r^2 > s^2 - \delta = 2\) — 즉 \(r\)은 \(s\)보다 작은 \(S\)의 상계이므로 \(s\)가 가장 작은 상한이라는 데 모순입니다.`,
                en: String.raw`Suppose \(s^2 > 2\). Put \(\delta = s^2 - 2 > 0\). By the lemma there is a rational \(r\) with \(s - \frac{\delta}{2s} < r < s\). Then \(s^2 - r^2 = (s-r)(s+r) < \delta\), so \(r^2 > s^2 - \delta = 2\) — i.e. \(r\) is an upper bound of \(S\) smaller than \(s\), contradicting that \(s\) is the least upper bound.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(s^2 = 2\)입니다. 완비성 공리가 유리수의 '구멍'을 메워 \(\sqrt{2}\)에 해당하는 실수를 만들어냈습니다.`,
                en: String.raw`Hence \(s^2 = 2\). The completeness axiom fills the hole in the rationals, producing the real number that is \(\sqrt{2}\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'countable',
      title: { ko: '가산과 비가산', en: 'Countable vs Uncountable' },
      order: 3,
      summary: {
        ko: String.raw`유리수는 한 줄로 나열할 수 있지만 실수는 그럴 수 없습니다 — 칸토어의 대각선 논법으로 확인합니다.`,
        en: String.raw`The rationals fit into a single list; the reals do not — verified by Cantor's diagonal argument.`,
      },
      tex: [String.raw`\mathbb{Q} = \{q_1, q_2, \dots\}`, String.raw`(0,1) \text{ is uncountable}`],
      controls: [
        {
          kind: 'select',
          key: 'panel',
          label: { ko: '장면', en: 'Panel' },
          options: ['rationals', 'diagonal'],
          init: 'rationals',
        },
        { kind: 'slider', key: 'n', label: { ko: '나열 개수', en: 'Listed count' }, min: 1, max: 64, step: 1, init: 20 },
      ],
      problems: [
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
      ],
    },
    {
      id: 'groups-fields',
      title: { ko: '군과 체', en: 'Groups vs Fields' },
      order: 4,
      summary: {
        ko: String.raw`군은 되돌릴 수 있는 움직임(결합·항등원·역원), 체는 사칙연산이 되는 세계입니다. 부분군 판정법과 \((\mathbb{Z},+)\) vs \((\mathbb{Q},+,\times)\)의 차이를 봅니다.`,
        en: String.raw`A group is reversible moves (associativity, identity, inverses); a field is a world where all four operations work. Includes the subgroup test and \((\mathbb{Z},+)\) vs \((\mathbb{Q},+,\times)\).`,
      },
      tex: [
        String.raw`(a+b)+c = a+(b+c),\ \ \exists\,0,\ \ \forall a\,\exists(-a)`,
        String.raw`a(b+c) = ab+ac,\qquad 2\mathbb{Z} \le \mathbb{Z},\ \ \mathbb{Q} \le \mathbb{R}`,
      ],
      controls: [
        {
          kind: 'select',
          key: 'table',
          label: { ko: '곱셈표', en: 'Table' },
          options: ['z6', 'z5'],
          init: 'z6',
        },
      ],
      problems: [
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
      ],
    },
    {
      id: 'epsilon-n',
      title: { ko: 'ε-N 극한', en: 'The ε–N Definition' },
      order: 5,
      summary: {
        ko: String.raw`\(\varepsilon\) 띠를 좁혀도 수열의 꼬리가 전부 그 안에 들어가는 순간을 확인합니다. 그때의 \(N\)이 바로 \(\forall\varepsilon>0\ \exists N\)의 \(N\)입니다.`,
        en: String.raw`Watch the moment the whole tail of a sequence fits inside the \(\varepsilon\)-band. That \(N\) is exactly the \(N\) in \(\forall\varepsilon>0\ \exists N\).`,
      },
      tex: [String.raw`\forall\varepsilon>0\ \exists N\ \text{s.t.}\ n>N\Rightarrow|a_n-L|<\varepsilon`],
      controls: [
        {
          kind: 'select',
          key: 'seq',
          label: { ko: '수열', en: 'Sequence' },
          options: ['1/n', '1/n²', '(−1)^n / n', 'n / (n+1)'],
          init: '1/n',
        },
        { kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
      ],
      problems: [
        {
          id: 'inv-square',
          statement: {
            ko: String.raw`수열 \(a_n = \frac{1}{n^2}\)이 \(0\)으로 수렴함을 \(\varepsilon\)-\(N\) 논법으로 보이고, \(\varepsilon = 0.01\)일 때의 \(N\)을 구하세요.`,
            en: String.raw`Show that \(a_n = \frac{1}{n^2}\) converges to \(0\) from the \(\varepsilon\)-\(N\) definition, and find \(N\) for \(\varepsilon = 0.01\).`,
          },
          display: [String.raw`N(\varepsilon) = \left\lceil \frac{1}{\sqrt{\varepsilon}} \right\rceil`],
          preset: { seq: '1/n²', epsilon: 0.01 },
          presetCaption: {
            ko: String.raw`\(a_n = 1/n^2\), \(\varepsilon = 0.01\) — \(N = 10\)부터 꼬리가 띠 안에 들어갑니다.`,
            en: String.raw`\(a_n = 1/n^2\), \(\varepsilon = 0.01\) — the tail enters the band from \(N = 10\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\left|\frac{1}{n^2} - 0\right| = \frac{1}{n^2}\)이므로, 부등식 \(\frac{1}{n^2} < \varepsilon\)은 \(n^2 > \frac{1}{\varepsilon}\), 즉 \(n > \frac{1}{\sqrt{\varepsilon}}\)와 동치입니다.`,
                en: String.raw`Since \(\left|\frac{1}{n^2} - 0\right| = \frac{1}{n^2}\), the inequality \(\frac{1}{n^2} < \varepsilon\) is equivalent to \(n^2 > \frac{1}{\varepsilon}\), i.e. \(n > \frac{1}{\sqrt{\varepsilon}}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N = \left\lceil \frac{1}{\sqrt{\varepsilon}} \right\rceil\)이라 두면, \(n > N\)일 때 \(n > \frac{1}{\sqrt{\varepsilon}}\)이므로 \(\left|a_n - 0\right| < \varepsilon\)입니다. 따라서 \(\varepsilon\)-\(N\) 정의에 의해 \(a_n \to 0\)입니다.`,
                en: String.raw`Put \(N = \left\lceil \frac{1}{\sqrt{\varepsilon}} \right\rceil\). If \(n > N\) then \(n > \frac{1}{\sqrt{\varepsilon}}\), so \(\left|a_n - 0\right| < \varepsilon\). Hence \(a_n \to 0\) by the \(\varepsilon\)-\(N\) definition.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon = 0.01\)이면 \(\frac{1}{\sqrt{0.01}} = 10\)이므로 \(N = 10\)입니다. 실제로 \(n \geq 11\)일 때 \(\frac{1}{n^2} \leq \frac{1}{121} < 0.01\)입니다.`,
                en: String.raw`For \(\varepsilon = 0.01\), \(\frac{1}{\sqrt{0.01}} = 10\), so \(N = 10\). Indeed, for \(n \geq 11\) we have \(\frac{1}{n^2} \leq \frac{1}{121} < 0.01\).`,
              },
            },
          ],
        },
        {
          id: 'frac-one',
          statement: {
            ko: String.raw`\(a_n = \frac{n}{n+1}\)이 \(1\)로 수렴함을 보이고, \(\varepsilon = 0.05\)일 때의 \(N\)을 구하세요.`,
            en: String.raw`Show that \(a_n = \frac{n}{n+1}\) converges to \(1\), and find \(N\) for \(\varepsilon = 0.05\).`,
          },
          display: [String.raw`\left|\frac{n}{n+1} - 1\right| = \frac{1}{n+1}`],
          preset: { seq: 'n / (n+1)', epsilon: 0.05 },
          presetCaption: {
            ko: String.raw`\(a_n = n/(n+1)\), \(\varepsilon = 0.05\) — \(N = 19\)부터 꼬리가 띠 안에 들어갑니다.`,
            en: String.raw`\(a_n = n/(n+1)\), \(\varepsilon = 0.05\) — the tail enters the band from \(N = 19\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\left|\frac{n}{n+1} - 1\right| = \left|\frac{-1}{n+1}\right| = \frac{1}{n+1}\)입니다.`,
                en: String.raw`\(\left|\frac{n}{n+1} - 1\right| = \left|\frac{-1}{n+1}\right| = \frac{1}{n+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\frac{1}{n+1} < \varepsilon\)은 \(n + 1 > \frac{1}{\varepsilon}\), 즉 \(n > \frac{1}{\varepsilon} - 1\)과 동치입니다. \(N\)을 \(\frac{1}{\varepsilon} - 1\)보다 큰 정수로 잡으면 \(n > N\)일 때 \(\left|a_n - 1\right| < \varepsilon\)이므로 \(a_n \to 1\)입니다.`,
                en: String.raw`\(\frac{1}{n+1} < \varepsilon\) is equivalent to \(n + 1 > \frac{1}{\varepsilon}\), i.e. \(n > \frac{1}{\varepsilon} - 1\). Taking \(N\) to be any integer larger than \(\frac{1}{\varepsilon} - 1\) gives \(\left|a_n - 1\right| < \varepsilon\) for \(n > N\), so \(a_n \to 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon = 0.05\)이면 \(\frac{1}{0.05} - 1 = 19\)이므로 \(N = 19\)로 충분합니다. \(n \geq 20\)일 때 \(\frac{1}{n+1} \leq \frac{1}{21} < 0.05\)이기 때문입니다.`,
                en: String.raw`For \(\varepsilon = 0.05\), \(\frac{1}{0.05} - 1 = 19\), so \(N = 19\) works: for \(n \geq 20\), \(\frac{1}{n+1} \leq \frac{1}{21} < 0.05\).`,
              },
            },
          ],
        },
        {
          id: 'alt-zero',
          statement: {
            ko: String.raw`\(\left|\frac{(-1)^n}{n}\right| = \frac{1}{n}\)임을 이용해 \(a_n = \frac{(-1)^n}{n} \to 0\)을 증명하세요.`,
            en: String.raw`Use \(\left|\frac{(-1)^n}{n}\right| = \frac{1}{n}\) to prove \(a_n = \frac{(-1)^n}{n} \to 0\).`,
          },
          display: [String.raw`\left|\frac{(-1)^n}{n} - 0\right| = \frac{1}{n} < \varepsilon \iff n > \frac{1}{\varepsilon}`],
          preset: { seq: '(−1)^n / n', epsilon: 0.05 },
          presetCaption: {
            ko: String.raw`\(a_n = (-1)^n/n\), \(\varepsilon = 0.05\) — 부호가 바뀌어도 \(N = 20\)부터 꼬리가 띠 안에 들어갑니다.`,
            en: String.raw`\(a_n = (-1)^n/n\), \(\varepsilon = 0.05\) — despite the sign flips, the tail enters the band from \(N = 20\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\left|\frac{(-1)^n}{n} - 0\right| = \frac{|(-1)^n|}{n} = \frac{1}{n}\)입니다. 부호 \((-1)^n\)은 절댓값 안에서 사라집니다.`,
                en: String.raw`\(\left|\frac{(-1)^n}{n} - 0\right| = \frac{|(-1)^n|}{n} = \frac{1}{n}\). The sign \((-1)^n\) disappears inside the absolute value.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(N > \frac{1}{\varepsilon}\)인 정수 \(N\)을 잡습니다. 그러면 \(n > N\)일 때 \(\frac{1}{n} < \varepsilon\)이므로 \(\left|a_n - 0\right| < \varepsilon\)입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), take an integer \(N > \frac{1}{\varepsilon}\). Then \(n > N\) implies \(\frac{1}{n} < \varepsilon\), so \(\left|a_n - 0\right| < \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon = 0.05\)이면 \(\frac{1}{0.05} = 20\)이므로 \(N = 20\)입니다. \(n \geq 21\)일 때 \(\frac{1}{n} \leq \frac{1}{21} < 0.05\)입니다.`,
                en: String.raw`For \(\varepsilon = 0.05\), \(\frac{1}{0.05} = 20\), so \(N = 20\): for \(n \geq 21\), \(\frac{1}{n} \leq \frac{1}{21} < 0.05\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'holes',
      title: { ko: '유리수의 구멍', en: 'Why ℝ Has No Holes' },
      order: 6,
      summary: {
        ko: String.raw`\(x_{n+1}=\frac{x_n+2/x_n}{2}\)의 모든 항은 유리수지만, 극한 \(\sqrt{2}\)는 유리수가 아닙니다. 유리수 집합 \(\mathbb{Q}\)에는 구멍이 있다는 뜻입니다. 무리수임의 엄밀한 증명은 다루지 않고 아이디어 수준에서만 봅니다.`,
        en: String.raw`Every term of \(x_{n+1}=\frac{x_n+2/x_n}{2}\) is rational, yet the limit \(\sqrt{2}\) is not. The rationals \(\mathbb{Q}\) have a hole — shown at the idea level, without a full irrationality proof.`,
      },
      tex: [String.raw`x_{n+1}=\frac{x_n+2/x_n}{2}\to\sqrt{2}`, String.raw`\sqrt{2}\notin\mathbb{Q}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 8, step: 1, init: 4 }],
      problems: [
        {
          id: 'babylonian-x5',
          statement: {
            ko: String.raw`\(x_0 = 1\), \(x_{n+1} = \frac{x_n + 2/x_n}{2}\)이라 할 때 \(x_5\)를 정확한 분수로 구하고, \(|x_5 - \sqrt{2}| < 10^{-24}\)임을 증명하세요.`,
            en: String.raw`With \(x_0 = 1\) and \(x_{n+1} = \frac{x_n + 2/x_n}{2}\), write \(x_5\) as an exact fraction and prove \(|x_5 - \sqrt{2}| < 10^{-24}\).`,
          },
          display: [String.raw`x_5 = \frac{886731088897}{627013566048}`, String.raw`|x_5 - \sqrt{2}| < 10^{-24}`],
          preset: { n: 5 },
          presetCaption: {
            ko: String.raw`\(n = 5\) — 다섯 번 반복하면 소수점 아래 24자리가 맞습니다.`,
            en: String.raw`\(n = 5\) — five iterations get 24 decimal places right.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`분수 형태로 차례로 계산하면 \(x_1 = \frac{3}{2}\), \(x_2 = \frac{17}{12}\), \(x_3 = \frac{577}{408}\), \(x_4 = \frac{665857}{470832}\), \(x_5 = \frac{886731088897}{627013566048}\)입니다. 점화식 \(\frac{p}{q} \mapsto \frac{p^2+2q^2}{2pq}\)를 그대로 적용한 결과입니다.`,
                en: String.raw`Computing in fractions gives \(x_1 = \frac{3}{2}\), \(x_2 = \frac{17}{12}\), \(x_3 = \frac{577}{408}\), \(x_4 = \frac{665857}{470832}\), \(x_5 = \frac{886731088897}{627013566048}\), by applying \(\frac{p}{q} \mapsto \frac{p^2+2q^2}{2pq}\) at each step.`,
              },
            },
            {
              text: {
                ko: String.raw`또한 \(p_{n+1}^2 - 2q_{n+1}^2 = (p_n^2+2q_n^2)^2 - 8p_n^2q_n^2 = (p_n^2-2q_n^2)^2\)이고 \(p_1^2-2q_1^2 = 9-8 = 1\)이므로, 모든 \(n \geq 1\)에 대해 \(p_n^2-2q_n^2 = 1\)입니다. 따라서 \(\gcd(p_n,q_n)=1\) — 모두 기약분수입니다.`,
                en: String.raw`Moreover \(p_{n+1}^2 - 2q_{n+1}^2 = (p_n^2+2q_n^2)^2 - 8p_n^2q_n^2 = (p_n^2-2q_n^2)^2\), and \(p_1^2-2q_1^2 = 9-8 = 1\), so \(p_n^2-2q_n^2 = 1\) for all \(n \geq 1\). Hence \(\gcd(p_n,q_n)=1\) — every fraction is in lowest terms.`,
              },
            },
            {
              text: {
                ko: String.raw`\(e_n = x_n^2 - 2\)라 두면 직접 전개로 \(e_{n+1} = \frac{e_n^2}{4x_n^2}\)을 얻습니다. \(x_1 = \frac32 > \sqrt2\)이고 \(x_{n+1}-\sqrt2 = \frac{(x_n-\sqrt2)^2}{2x_n} \geq 0\)이므로 모든 \(n \geq 1\)에 대해 \(x_n \geq \sqrt2\)이고, 따라서 \(e_{n+1} \leq \frac{e_n^2}{8}\)입니다.`,
                en: String.raw`Put \(e_n = x_n^2 - 2\). Expanding gives \(e_{n+1} = \frac{e_n^2}{4x_n^2}\). Since \(x_1 = \frac32 > \sqrt2\) and \(x_{n+1}-\sqrt2 = \frac{(x_n-\sqrt2)^2}{2x_n} \geq 0\), we have \(x_n \geq \sqrt2\) for all \(n \geq 1\), hence \(e_{n+1} \leq \frac{e_n^2}{8}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(e_1 = \frac14\), \(e_2 = \frac{1}{144}\), \(e_3 = \frac{1}{166464}\), \(e_4 = \frac{1}{221682772224} < 4.6\times 10^{-12}\)입니다. 따라서 \(e_5 \leq \frac{e_4^2}{8} < 2.7\times 10^{-24}\)이고, \(|x_5-\sqrt2| = \frac{e_5}{x_5+\sqrt2} < \frac{2.7\times 10^{-24}}{2.8} < 10^{-24}\)입니다.`,
                en: String.raw`We get \(e_1 = \frac14\), \(e_2 = \frac{1}{144}\), \(e_3 = \frac{1}{166464}\), \(e_4 = \frac{1}{221682772224} < 4.6\times 10^{-12}\). Hence \(e_5 \leq \frac{e_4^2}{8} < 2.7\times 10^{-24}\), and \(|x_5-\sqrt2| = \frac{e_5}{x_5+\sqrt2} < \frac{2.7\times 10^{-24}}{2.8} < 10^{-24}\).`,
              },
            },
          ],
        },
        {
          id: 'rational-to-e',
          statement: {
            ko: String.raw`수열 \(b_n = \left(1+\frac1n\right)^n\)의 모든 항이 유리수임을 보이고, 그 극한인 무리수 \(e\)가 \(\mathbb{Q}\)의 또 다른 '구멍'임을 설명하세요.`,
            en: String.raw`Show that every term of \(b_n = \left(1+\frac1n\right)^n\) is rational, and explain why its irrational limit \(e\) is another "hole" in \(\mathbb{Q}\).`,
          },
          display: [String.raw`b_n = \left(\frac{n+1}{n}\right)^n \in \mathbb{Q}, \qquad \lim_{n\to\infty} b_n = e \notin \mathbb{Q}`],
          preset: { n: 5 },
          presetCaption: {
            ko: String.raw`바빌로니아법 \(n=5\) — 유리수 항이 무리수 극한으로 모이는 같은 현상입니다.`,
            en: String.raw`Babylonian iterates at \(n=5\) — the same phenomenon: rational terms homing in on an irrational limit.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(b_n = \left(\frac{n+1}{n}\right)^n\)이고 \(\frac{n+1}{n}\)은 유리수입니다. 유리수의 자연수 거듭제곱은 유리수이므로 모든 \(n\)에 대해 \(b_n \in \mathbb{Q}\)입니다.`,
                en: String.raw`\(b_n = \left(\frac{n+1}{n}\right)^n\) with \(\frac{n+1}{n}\) rational. A rational number raised to a positive integer power is rational, so \(b_n \in \mathbb{Q}\) for every \(n\).`,
              },
            },
            {
              text: {
                ko: String.raw`수열 \((b_n)\)은 증가하고 위로 유계이므로(표준적인 사실로 받아들입니다) 수렴합니다. 그 극한을 \(e\)라 부릅니다.`,
                en: String.raw`The sequence \((b_n)\) is increasing and bounded above (taken as known — it is standard), hence convergent. Its limit is called \(e\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(e \notin \mathbb{Q}\)는 정식 정리입니다(예: \(e = \sum_{k=0}^{\infty}\frac{1}{k!}\)의 나머지 항 평가로 증명됩니다). 따라서 유리수 수열 \((b_n)\)은 어떤 유리수에도 수렴하지 않습니다 — \(\sqrt2\)와는 다른, \(\mathbb{Q}\)의 또 하나의 구멍입니다.`,
                en: String.raw`That \(e \notin \mathbb{Q}\) is an established theorem (proved, for instance, by estimating the remainder of \(e = \sum_{k=0}^{\infty}\frac{1}{k!}\)). So the rational sequence \((b_n)\) converges to no rational number — another hole in \(\mathbb{Q}\), distinct from the one at \(\sqrt2\).`,
              },
            },
          ],
        },
        {
          id: 'cauchy-no-rational-limit',
          statement: {
            ko: String.raw`바빌로니아 수열 \((x_n)\)이 코시수열이지만 \(\mathbb{Q}\) 안에는 극한이 없음을 증명하세요. 이것이 '완비성'이 말하는 바입니다.`,
            en: String.raw`Prove that the Babylonian sequence \((x_n)\) is Cauchy but has no limit in \(\mathbb{Q}\) — this is what completeness is about.`,
          },
          display: [String.raw`|x_m - x_n| \to 0 \ \ (m,n \to \infty), \qquad \nexists\, r \in \mathbb{Q} : x_n \to r`],
          preset: { n: 8 },
          presetCaption: {
            ko: String.raw`\(n=8\) — 항들은 서로 끝없이 가까워지지만, 유리수 중에는 도착지가 없습니다.`,
            en: String.raw`\(n=8\) — the terms get arbitrarily close to each other, yet no rational number is their destination.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`문제 1의 오차 분석에서 \(e_{n+1} \leq \frac{e_n^2}{8}\), \(e_1 = \frac14\)을 얻었습니다. \(e_n \leq 2^{-n}\)임을 귀납법으로 보이면(\(n=1\)일 때 성립하고, \(e_{n+1} \leq \frac{2^{-2n}}{8} = 2^{-(2n+3)} \leq 2^{-(n+1)}\)), \(e_n \to 0\)입니다. \(|x_n-\sqrt2| = \frac{e_n}{x_n+\sqrt2} \leq \frac{e_n}{2}\)이므로, 실수로서 \(x_n \to \sqrt2\)입니다.`,
                en: String.raw`From the error analysis, \(e_{n+1} \leq \frac{e_n^2}{8}\) with \(e_1 = \frac14\). Since \(e_n \leq 2^{-n}\) by induction (true at \(n=1\), and \(e_{n+1} \leq \frac{2^{-2n}}{8} = 2^{-(2n+3)} \leq 2^{-(n+1)}\)), we get \(e_n \to 0\). With \(|x_n-\sqrt2| = \frac{e_n}{x_n+\sqrt2} \leq \frac{e_n}{2}\), we have \(x_n \to \sqrt2\) as real numbers.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(|x_m - x_n| \leq |x_m - \sqrt2| + |x_n - \sqrt2|\)는 \(m, n\)이 클 때 임의로 작아집니다. 즉 \((x_n)\)은 코시수열입니다.`,
                en: String.raw`Hence \(|x_m - x_n| \leq |x_m - \sqrt2| + |x_n - \sqrt2|\) becomes arbitrarily small for large \(m, n\): \((x_n)\) is a Cauchy sequence.`,
              },
            },
            {
              text: {
                ko: String.raw`만약 유리수 \(r\)에 대해 \(x_n \to r\)이라면 극한의 유일성에 의해 \(r = \sqrt2\)이어야 합니다. 그런데 \(\sqrt2 \notin \mathbb{Q}\)이므로 모순입니다. 따라서 \((x_n)\)은 \(\mathbb{Q}\) 안에서 극한을 갖지 않습니다.`,
                en: String.raw`If \(x_n \to r\) for some rational \(r\), uniqueness of limits forces \(r = \sqrt2\). But \(\sqrt2 \notin \mathbb{Q}\) — a contradiction. So \((x_n)\) has no limit inside \(\mathbb{Q}\).`,
              },
            },
            {
              text: {
                ko: String.raw`참고로 \(\sqrt2 \notin \mathbb{Q}\)의 고전적 증명: \(\sqrt2 = \frac pq\) (기약분수)라 가정하면 \(p^2 = 2q^2\)이므로 \(p\)는 짝수입니다. \(p = 2k\)라 두면 \(q^2 = 2k^2\)이므로 \(q\)도 짝수 — 기약성에 모순입니다.`,
                en: String.raw`For reference, the classical proof that \(\sqrt2 \notin \mathbb{Q}\): if \(\sqrt2 = \frac pq\) in lowest terms, then \(p^2 = 2q^2\), so \(p\) is even; writing \(p = 2k\) gives \(q^2 = 2k^2\), so \(q\) is even too — contradicting lowest terms.`,
              },
              display: [String.raw`\sqrt2 = \frac pq \ \Rightarrow\ p^2 = 2q^2 \ \Rightarrow\ p, q \text{ both even, contradiction}`],
            },
          ],
        },
      ],
    },
    {
      id: 'bolzano-weierstrass',
      title: { ko: '볼차노–바이어슈트라스', en: 'A Convergent Subsequence Always Hides Inside' },
      order: 7,
      summary: {
        ko: '유계수열 속에는 항상 수렴하는 부분수열이 숨어 있습니다. 구간을 반으로 접어 점이 무한히 모이는 쪽을 따라가면 됩니다.',
        en: 'Every bounded sequence hides a convergent subsequence. Halve the interval and follow the half holding infinitely many terms.',
      },
      tex: [String.raw`(a_n)\ \text{bounded}\Rightarrow\exists\ (a_{n_k})\ \text{convergent}`],
      controls: [
        { kind: 'slider', key: 'steps', label: { ko: '이분 단계', en: 'Bisection steps' }, min: 1, max: 8, step: 1, init: 4 },
        { kind: 'select', key: 'seed', label: { ko: '난수 시드', en: 'Random seed' }, options: ['7', '21', '99'], init: '7' },
      ],
      problems: [
        {
          id: 'alternating-subseq',
          statement: {
            ko: String.raw`수열 \(a_n = (-1)^n\)의 수렴하는 부분수열을 두 개 찾고, 각각의 극한을 구하세요.`,
            en: String.raw`Find two convergent subsequences of \(a_n = (-1)^n\) and compute their limits.`,
          },
          display: [String.raw`a_{2k} \to 1, \qquad a_{2k+1} \to -1`],
          preset: { steps: 4, seed: '7' },
          presetCaption: {
            ko: String.raw`데모 수열의 이분 과정 (4단계) — '반으로 접어 따라가기'라는 같은 아이디어입니다.`,
            en: String.raw`Bisection on the demo sequence (4 steps) — the same "halve and follow" idea.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`짝수 항만 취하면 \(a_{2k} = (-1)^{2k} = 1\) (모든 \(k\)에 대해)이므로, 부분수열 \((a_{2k})\)는 상수수열 \(1, 1, 1, \ldots\)이고 \(1\)로 수렴합니다.`,
                en: String.raw`Taking even indices, \(a_{2k} = (-1)^{2k} = 1\) for every \(k\), so \((a_{2k})\) is the constant sequence \(1, 1, 1, \ldots\), converging to \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`홀수 항만 취하면 \(a_{2k+1} = (-1)^{2k+1} = -1\) (모든 \(k\)에 대해)이므로, \((a_{2k+1})\)은 \(-1\)로 수렴합니다.`,
                en: String.raw`Taking odd indices, \(a_{2k+1} = (-1)^{2k+1} = -1\) for every \(k\), so \((a_{2k+1})\) converges to \(-1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\((2k)\)와 \((2k+1)\)은 모두 엄격히 증가하는 자연수열이므로, 이들은 진짜 부분수열입니다. 유계수열 \((-1)^n\) 안에는 서로 다른 극한을 갖는 수렴 부분수열이 둘 이상 숨어 있었던 것입니다.`,
                en: String.raw`Both \((2k)\) and \((2k+1)\) are strictly increasing index sequences, so these are genuine subsequences. The bounded sequence \((-1)^n\) was hiding more than one convergent subsequence, with different limits.`,
              },
            },
          ],
        },
        {
          id: 'sine-subseq',
          statement: {
            ko: String.raw`\((\sin n)\)이 유계수열임을 보이고, 볼차노–바이어슈트라스 정리로부터 수렴하는 부분수열이 존재함을 결론지으세요.`,
            en: String.raw`Show that \((\sin n)\) is bounded, and conclude via Bolzano–Weierstrass that a convergent subsequence exists.`,
          },
          display: [String.raw`|\sin n| \leq 1 \ \Longrightarrow\ \exists\, n_1 < n_2 < \cdots:\ \lim_{k \to \infty} \sin(n_k) \in [-1,1]`],
          preset: { steps: 6, seed: '21' },
          presetCaption: {
            ko: String.raw`데모 수열의 이분 과정 (6단계) — 유계성이 핵심 가설입니다.`,
            en: String.raw`Bisection on the demo sequence (6 steps) — boundedness is the key hypothesis.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`모든 정수 \(n\)에 대해 \(|\sin n| \leq 1\)이므로, 수열 \((\sin n)\)은 유계입니다.`,
                en: String.raw`\(|\sin n| \leq 1\) for every integer \(n\), so \((\sin n)\) is a bounded sequence.`,
              },
            },
            {
              text: {
                ko: String.raw`볼차노–바이어슈트라스 정리에 의해, 수렴하는 부분수열 \((\sin(n_k))\)가 존재합니다 (극한은 \([-1,1]\) 안의 어떤 값입니다).`,
                en: String.raw`By the Bolzano–Weierstrass theorem, a convergent subsequence \((\sin(n_k))\) exists (its limit is some value in \([-1,1]\)).`,
              },
            },
            {
              text: {
                ko: String.raw`정리는 존재만 보장할 뿐 어떤 부분수열인지는 알려주지 않습니다. 수치적인 예시로, \(\sin(35489) \approx 0.9999990\), \(\sin(36199) \approx 0.9999991\)처럼 \(1\) 근처에 항들이 모이는 모습을 볼 수 있습니다 — 이는 예시일 뿐 증명이 아닙니다.`,
                en: String.raw`The theorem only guarantees existence; it does not say which subsequence. As a numerical illustration (not a proof), terms pile up near \(1\): \(\sin(35489) \approx 0.9999990\) and \(\sin(36199) \approx 0.9999991\).`,
              },
            },
          ],
        },
        {
          id: 'unbounded-counterexample',
          statement: {
            ko: String.raw`\(a_n = n\)은 수렴하는 부분수열을 갖지 않음을 증명하세요. 유계성 가설이 왜 필요한지 보여줍니다.`,
            en: String.raw`Prove that \(a_n = n\) has no convergent subsequence — showing why the boundedness hypothesis is essential.`,
          },
          display: [String.raw`n_k \geq k \to \infty`],
          preset: { steps: 8, seed: '99' },
          presetCaption: {
            ko: String.raw`데모는 \([0,1]\) 안에 갇혀 있기에 이분이 통합니다. 유계성이 없으면 이 그림 자체가 그려지지 않습니다.`,
            en: String.raw`The demo stays trapped in \([0,1]\), which is why bisection works. Without boundedness this picture cannot even be drawn.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((n_k)\)를 \((n)\)의 임의의 부분수열이라 하자. 지표가 엄격히 증가하므로 귀납법으로 \(n_k \geq k\)를 얻는다: \(n_1 \geq 1\)이고, \(n_{k+1} > n_k \geq k\)이므로 \(n_{k+1} \geq k+1\)이다.`,
                en: String.raw`Let \((n_k)\) be any subsequence of \((n)\). Its indices are strictly increasing, so \(n_k \geq k\) by induction: \(n_1 \geq 1\), and \(n_{k+1} > n_k \geq k\) gives \(n_{k+1} \geq k+1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(n_k \geq k \to \infty\)이므로, 모든 부분수열은 위로 비유계이고 발산한다.`,
                en: String.raw`Hence \(n_k \geq k \to \infty\): every subsequence is unbounded above, hence divergent.`,
              },
            },
            {
              text: {
                ko: String.raw`수렴하는 수열은 유계이므로, 비유계인 \((n_k)\)는 수렴할 수 없다. 따라서 \((n)\)은 수렴하는 부분수열을 하나도 갖지 않는다 — 볼차노–바이어슈트라스의 유계성 가설을 빼면 정리가 거짓이 된다.`,
                en: String.raw`A convergent sequence is bounded, so the unbounded \((n_k)\) cannot converge. Thus \((n)\) has no convergent subsequence at all — dropping the boundedness hypothesis makes the theorem false.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'cantor',
      title: { ko: '칸토어 집합', en: 'Length Zero, Points Uncountable' },
      order: 8,
      summary: {
        ko: String.raw`가운데 3분의 1을 계속 지우면 전체 길이는 \(\left(\frac{2}{3}\right)^n\to 0\)이 되지만, 남는 점은 셀 수 없이 많습니다. 비가산성은 아이디어 수준에서만 언급합니다.`,
        en: String.raw`Deleting middle thirds drives the total length \(\left(\frac{2}{3}\right)^n\to 0\), yet uncountably many points remain. Uncountability is stated at the idea level only.`,
      },
      tex: [String.raw`|C_n|=\left(\frac{2}{3}\right)^n\to 0`, String.raw`|C|=|\mathbb{R}|`],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 8, step: 1, init: 4 }],
      problems: [
        {
          id: 'stage-three',
          statement: {
            ko: String.raw`3단계 \(C_3\)의 구간 개수와 전체 길이를 구하세요.`,
            en: String.raw`Count the intervals of stage \(C_3\) and compute its total length.`,
          },
          display: [String.raw`2^3 = 8, \qquad \left(\tfrac{2}{3}\right)^3 = \tfrac{8}{27}`],
          preset: { stage: 3 },
          presetCaption: {
            ko: String.raw`3단계 — 8개의 조각, 전체 길이 \(8/27 \approx 0.296\).`,
            en: String.raw`Stage 3 — 8 pieces, total length \(8/27 \approx 0.296\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`각 단계에서 모든 구간이 두 개로 쪼개지므로, \(n\)단계의 구간 수는 \(2^n\)개입니다. 따라서 \(C_3\)은 \(2^3 = 8\)개의 구간으로 이루어져 있습니다.`,
                en: String.raw`Every interval splits into two at each stage, so stage \(n\) has \(2^n\) intervals. Hence \(C_3\) consists of \(2^3 = 8\) intervals.`,
              },
            },
            {
              text: {
                ko: String.raw`\(n\)단계의 각 구간 길이는 \(\left(\frac13\right)^n\)이므로, 전체 길이는 \(2^n \cdot \left(\frac13\right)^n = \left(\frac23\right)^n\)입니다.`,
                en: String.raw`Each interval at stage \(n\) has length \(\left(\frac13\right)^n\), so the total length is \(2^n \cdot \left(\frac13\right)^n = \left(\frac23\right)^n\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n = 3\)일 때 전체 길이는 \(\left(\frac23\right)^3 = \frac{8}{27} \approx 0.296\)입니다.`,
                en: String.raw`At \(n = 3\) the total length is \(\left(\frac23\right)^3 = \frac{8}{27} \approx 0.296\).`,
              },
            },
          ],
        },
        {
          id: 'quarter-in-cantor',
          statement: {
            ko: String.raw`\(\frac14\)이 칸토어 집합에 속함을 삼진법 전개를 이용해 판정하세요.`,
            en: String.raw`Decide whether \(\frac14\) belongs to the Cantor set using its ternary expansion.`,
          },
          display: [String.raw`\frac14 = 0.020202\ldots_3 \in C`],
          preset: { stage: 4 },
          presetCaption: {
            ko: String.raw`4단계 — \(\frac14\)는 매 단계 살아남는 구간 안에 있습니다.`,
            en: String.raw`Stage 4 — \(\frac14\) lies in a surviving interval at every stage.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`삼진법으로 \(0.020202\ldots_3 = \sum_{j=1}^{\infty} 2\cdot 3^{-2j}\)입니다. 등비급수 합 공식으로 \(\frac{2\cdot \frac19}{1-\frac19} = \frac{2/9}{8/9} = \frac14\)을 얻습니다.`,
                en: String.raw`In ternary, \(0.020202\ldots_3 = \sum_{j=1}^{\infty} 2\cdot 3^{-2j}\). The geometric series sums to \(\frac{2\cdot \frac19}{1-\frac19} = \frac{2/9}{8/9} = \frac14\).`,
              },
            },
            {
              text: {
                ko: String.raw`이 전개에는 숫자 \(1\)이 등장하지 않습니다. 삼진법 판정법(전개에 \(1\)이 없는 수가 정확히 살아남는 수 — 여기서는 증명 없이 사용합니다)에 의해, \(\frac14\)는 어떤 단계에서도 지워지는 가운데 구간에 들어가지 않습니다.`,
                en: String.raw`This expansion contains no digit \(1\). By the ternary characterization (numbers whose expansion avoids \(1\) are exactly the survivors — used here without proof), \(\frac14\) never falls into a deleted middle third at any stage.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\frac14\)는 모든 \(C_n\)에 속하고, \(C = \bigcap_n C_n\)에도 속합니다.`,
                en: String.raw`Hence \(\frac14\) belongs to every \(C_n\), and therefore to \(C = \bigcap_n C_n\).`,
              },
            },
          ],
        },
        {
          id: 'measure-zero',
          statement: {
            ko: String.raw`칸토어 집합 \(C\)의 '길이'(측도)가 \(0\)임을 덮개 논증으로 증명하세요.`,
            en: String.raw`Prove that the Cantor set \(C\) has measure zero, via a covering argument.`,
          },
          display: [String.raw`\forall\, \varepsilon > 0\ \ \exists\, n:\ \left(\tfrac23\right)^n < \varepsilon`],
          preset: { stage: 8 },
          presetCaption: {
            ko: String.raw`8단계 — 전체 길이 \((2/3)^8 \approx 0.039\). \(n\)을 키우면 임의로 작아집니다.`,
            en: String.raw`Stage 8 — total length \((2/3)^8 \approx 0.039\), made arbitrarily small by taking \(n\) larger.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(C \subseteq C_n\) (모든 \(n\)에 대해)이고, \(C_n\)은 전체 길이가 \(\left(\frac23\right)^n\)인 \(2^n\)개의 구간으로 이루어져 있습니다.`,
                en: String.raw`\(C \subseteq C_n\) for every \(n\), and \(C_n\) consists of \(2^n\) intervals of total length \(\left(\frac23\right)^n\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(\left(\frac23\right)^n < \varepsilon\)인 \(n\)을 잡습니다 (\(\left(\frac23\right)^n \to 0\)이므로 가능합니다). 그러면 \(C\)는 전체 길이가 \(\varepsilon\)보다 작은 유한 개의 구간으로 덮입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), choose \(n\) with \(\left(\frac23\right)^n < \varepsilon\) (possible since \(\left(\frac23\right)^n \to 0\)). Then \(C\) is covered by finitely many intervals of total length below \(\varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`임의로 작은 전체 길이로 덮을 수 있는 집합의 측도는 \(0\)입니다(르벡 외측도의 정의). 참고로 \(C\)는 비가산집합이라는 사실도 알려져 있습니다 — 길이가 0인데 점은 셀 수 없이 많은 것입니다.`,
                en: String.raw`A set coverable by intervals of arbitrarily small total length has measure zero (this is the definition of Lebesgue outer measure zero). For the record, \(C\) is also uncountable — length zero, yet uncountably many points.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'ivt',
      title: { ko: '중간값 정리', en: "You Can't Climb Without Crossing Every Height" },
      order: 9,
      summary: {
        ko: String.raw`연속함수는 \([a,b]\)에서 \(f(a)\)와 \(f(b)\) 사이의 모든 값을 반드시 밟고 지나갑니다. 목표 높이 \(c\)를 움직이며 건너는 점 \(\xi\)를 찾아봅니다.`,
        en: String.raw`A continuous function on \([a,b]\) must step on every value between \(f(a)\) and \(f(b)\). Move the target level \(c\) and find the crossing \(\xi\).`,
      },
      tex: [String.raw`f(a)<c<f(b)\Rightarrow\exists\,\xi\in(a,b):f(\xi)=c`],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수', en: 'Function' }, options: ['cubic', 'sine'], init: 'cubic' },
        { kind: 'slider', key: 't', label: { ko: '목표 높이 (0–100%)', en: 'Target level (0–100%)' }, min: 0, max: 100, step: 1, init: 50 },
      ],
      problems: [
        {
          id: 'cubic-root',
          statement: {
            ko: String.raw`방정식 \(x^3 + x - 1 = 0\)이 구간 \((0,1)\) 안에 실근을 가짐을 중간값 정리로 보이세요.`,
            en: String.raw`Use the Intermediate Value Theorem to show that \(x^3 + x - 1 = 0\) has a real root in \((0,1)\).`,
          },
          display: [String.raw`f(0) = -1 < 0 < 1 = f(1) \ \Longrightarrow\ \exists\, \xi \in (0,1):\ f(\xi) = 0`],
          preset: { fn: 'cubic', t: 50 },
          presetCaption: {
            ko: String.raw`\(c = 0\) — 곡선이 높이 \(0\)을 밟는 점 \(\xi \approx 0.6823\).`,
            en: String.raw`\(c = 0\) — the point \(\xi \approx 0.6823\) where the curve steps on height \(0\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = x^3 + x - 1\)은 다항식이므로 \([0,1]\)에서 연속입니다.`,
                en: String.raw`\(f(x) = x^3 + x - 1\) is a polynomial, hence continuous on \([0,1]\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f(0) = -1 < 0\)이고 \(f(1) = 1 > 0\)입니다.`,
                en: String.raw`\(f(0) = -1 < 0\) and \(f(1) = 1 > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`중간값 정리에 의해 \(f(\xi) = 0\)인 \(\xi \in (0,1)\)이 존재합니다 (\(f(0), f(1) \neq 0\)이므로 \(\xi\)는 열린 구간 안에 있습니다). 수치적으로 \(\xi \approx 0.6823278038\)입니다.`,
                en: String.raw`By the Intermediate Value Theorem there is \(\xi \in (0,1)\) with \(f(\xi) = 0\) (strictly inside, since \(f(0), f(1) \neq 0\)). Numerically \(\xi \approx 0.6823278038\).`,
              },
            },
          ],
        },
        {
          id: 'sine-half',
          statement: {
            ko: String.raw`방정식 \(\sin x = \frac12\)이 구간 \((0, \frac{\pi}{2})\) 안에 해를 가짐을 보이세요.`,
            en: String.raw`Show that \(\sin x = \frac12\) has a solution in \((0, \frac{\pi}{2})\).`,
          },
          display: [String.raw`\sin 0 = 0 < \tfrac12 < 1 = \sin \tfrac{\pi}{2} \ \Longrightarrow\ \exists\, \xi:\ \sin \xi = \tfrac12`],
          preset: { fn: 'sine', t: 50 },
          presetCaption: {
            ko: String.raw`\(c = 0.5\) — 건너는 점은 \(\xi = \pi/6 \approx 0.5236\)입니다.`,
            en: String.raw`\(c = 0.5\) — the crossing is at \(\xi = \pi/6 \approx 0.5236\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin x\)는 \([0, \frac{\pi}{2}]\)에서 연속입니다.`,
                en: String.raw`\(\sin x\) is continuous on \([0, \frac{\pi}{2}]\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sin 0 = 0 < \frac12\)이고 \(\sin \frac{\pi}{2} = 1 > \frac12\)입니다.`,
                en: String.raw`\(\sin 0 = 0 < \frac12\) and \(\sin \frac{\pi}{2} = 1 > \frac12\).`,
              },
            },
            {
              text: {
                ko: String.raw`중간값 정리에 의해 \(\sin \xi = \frac12\)인 \(\xi \in (0, \frac{\pi}{2})\)가 존재합니다. 참고로 \(\sin \frac{\pi}{6} = \frac12\)이므로 실제로 \(\xi = \frac{\pi}{6}\)입니다 — 정리는 존재를 보장하고, 정확한 값은 별개의 계산입니다.`,
                en: String.raw`By the Intermediate Value Theorem there is \(\xi \in (0, \frac{\pi}{2})\) with \(\sin \xi = \frac12\). For reference, \(\sin \frac{\pi}{6} = \frac12\), so in fact \(\xi = \frac{\pi}{6}\) — the theorem guarantees existence; the exact value is a separate computation.`,
              },
            },
          ],
        },
        {
          id: 'jump-breaks-ivt',
          statement: {
            ko: String.raw`함수 \(f(x) = \begin{cases} 0 & x < \frac12 \\ 1 & x \geq \frac12 \end{cases}\) (\([0,1]\)에서 정의)이 값 \(c = \frac12\)를 취하지 않음을 직접 보이고, 중간값 정리의 어느 가설이 깨졌는지 말하세요.`,
            en: String.raw`Show directly that \(f(x) = \begin{cases} 0 & x < \frac12 \\ 1 & x \geq \frac12 \end{cases}\) on \([0,1]\) never takes the value \(c = \frac12\), and name the IVT hypothesis that fails.`,
          },
          display: [String.raw`f([0,1]) = \{0, 1\} \not\ni \tfrac12`],
          preset: { fn: 'cubic', t: 50 },
          presetCaption: {
            ko: String.raw`연속인 경우 (\(c = 0\)) — 이 가설이 빠지면 건너는 점이 없을 수 있습니다.`,
            en: String.raw`The continuous case (\(c = 0\)) — drop the hypothesis and the crossing may vanish.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x < \frac12\)이면 \(f(x) = 0 \neq \frac12\)이고, \(x \geq \frac12\)이면 \(f(x) = 1 \neq \frac12\)입니다. 따라서 어떤 \(x\)에 대해서도 \(f(x) = \frac12\)가 될 수 없습니다. 그런데도 \(f(0) = 0 < \frac12 < 1 = f(1)\)입니다.`,
                en: String.raw`For \(x < \frac12\), \(f(x) = 0 \neq \frac12\); for \(x \geq \frac12\), \(f(x) = 1 \neq \frac12\). So no \(x\) satisfies \(f(x) = \frac12\), even though \(f(0) = 0 < \frac12 < 1 = f(1)\).`,
              },
            },
            {
              text: {
                ko: String.raw`깨진 가설은 \(x = \frac12\)에서의 연속성입니다: 좌극한은 \(0\)이지만 \(f(\frac12) = 1\)이므로 불연속입니다. 중간값 정리의 결론이 가설 없이는 성립하지 않음을 보여주는 반례입니다.`,
                en: String.raw`The broken hypothesis is continuity at \(x = \frac12\): the left-hand limit is \(0\) while \(f(\frac12) = 1\). This counterexample shows the IVT conclusion need not hold without its hypothesis.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'uniform',
      title: { ko: '균등수렴 vs 점별수렴', en: 'When the Limit Breaks' },
      order: 10,
      summary: {
        ko: String.raw`\(f_n(x)=x^n\)은 \([0,1]\)의 각 점에서는 수렴하지만, \(\sup|f_n-f|=1\not\to 0\)이라 균등하게 수렴하지는 않습니다. 극한함수가 \(x=1\)에서 끊어지는 모습을 확인합니다.`,
        en: String.raw`\(f_n(x)=x^n\) converges at every point of \([0,1]\), yet \(\sup|f_n-f|=1\not\to 0\): not uniformly. Watch the limit break at \(x=1\).`,
      },
      tex: [
        String.raw`f_n(x)=x^n\to f(x)=\begin{cases}0&x<1\\1&x=1\end{cases}`,
        String.raw`\sup_{[0,1]}|f_n-f|=1\not\to 0`,
      ],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 8 },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.05, max: 0.5, step: 0.01, init: 0.2 },
      ],
      problems: [
        {
          id: 'pointwise-limit',
          statement: {
            ko: String.raw`\(f_n(x) = x^n\) (\([0,1]\))의 점별 극한함수를 구하세요: \([0,1)\)에서는 \(0\), \(x = 1\)에서는 \(1\)임을 증명하세요.`,
            en: String.raw`Find the pointwise limit of \(f_n(x) = x^n\) on \([0,1]\): prove it equals \(0\) on \([0,1)\) and \(1\) at \(x = 1\).`,
          },
          display: [String.raw`f(x) = \begin{cases} 0 & 0 \leq x < 1 \\ 1 & x = 1 \end{cases}`],
          preset: { n: 8, eps: 0.2 },
          presetCaption: {
            ko: String.raw`\(n = 8\) — 곡선은 \(0\)에 달라붙다가 \(x = 1\)에서 솟구칩니다.`,
            en: String.raw`\(n = 8\) — the curve hugs \(0\), then shoots up at \(x = 1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x = 1\)에서는 모든 \(n\)에 대해 \(f_n(1) = 1^n = 1\)이므로 극한은 \(1\)입니다.`,
                en: String.raw`At \(x = 1\), \(f_n(1) = 1^n = 1\) for every \(n\), so the limit is \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = 0\)에서는 자명하게 \(0\)으로 수렴합니다. \(0 < x < 1\)인 경우, \(t = \frac1x > 1\)이라 두면 \(t = 1 + h\) (\(h > 0\))로 쓸 수 있고, 베르누이 부등식으로 \(t^n \geq 1 + nh\)입니다. 따라서 \(0 \leq x^n = \frac{1}{t^n} \leq \frac{1}{1+nh} \to 0\)이므로 조임 정리로 \(x^n \to 0\)입니다.`,
                en: String.raw`At \(x = 0\) the limit is trivially \(0\). For \(0 < x < 1\), write \(t = \frac1x > 1\) as \(t = 1 + h\) with \(h > 0\); Bernoulli's inequality gives \(t^n \geq 1 + nh\). Hence \(0 \leq x^n = \frac{1}{t^n} \leq \frac{1}{1+nh} \to 0\), so \(x^n \to 0\) by the squeeze theorem.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 점별 극한함수는 \([0,1)\)에서 \(0\), \(x = 1\)에서 \(1\)이며, \(x = 1\)에서 불연속입니다. 연속함수들의 점별 극한이 불연속일 수 있다는 첫 번째 경고입니다.`,
                en: String.raw`The pointwise limit is therefore \(0\) on \([0,1)\) and \(1\) at \(x = 1\) — discontinuous at \(x = 1\). A first warning that pointwise limits of continuous functions need not be continuous.`,
              },
            },
          ],
        },
        {
          id: 'not-uniform',
          statement: {
            ko: String.raw`모든 \(n\)에 대해 \(\sup_{[0,1]} |f_n - f| = 1\)임을 증명하고, 따라서 이 수렴이 균등하지 않음을 결론지으세요.`,
            en: String.raw`Prove \(\sup_{[0,1]} |f_n - f| = 1\) for every \(n\), and conclude the convergence is not uniform.`,
          },
          display: [String.raw`\sup_{[0,1]} |f_n - f| = 1 \not\to 0`],
          preset: { n: 8, eps: 0.2 },
          presetCaption: {
            ko: String.raw`\(n = 8\), \(\varepsilon = 0.2\) — 차트는 격자 위에서 최댓값 \(\approx 0.98\)을 읽지만, 정확한 상한은 \(1\)입니다 (달성되지는 않습니다).`,
            en: String.raw`\(n = 8\), \(\varepsilon = 0.2\) — the chart reads \(\approx 0.98\) on its grid; the exact supremum is \(1\) (never attained).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\([0,1)\)에서 \(|f_n - f| = x^n\)이고 \(x = 1\)에서는 \(0\)이므로, \(\sup_{[0,1]} |f_n - f| = \sup_{[0,1)} x^n\)입니다.`,
                en: String.raw`On \([0,1)\), \(|f_n - f| = x^n\), and it is \(0\) at \(x = 1\), so \(\sup_{[0,1]} |f_n - f| = \sup_{[0,1)} x^n\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x < 1\)이면 \(x^n < 1\)이므로 상한은 \(1\) 이하입니다. 한편 \(x \to 1^{-}\)일 때 \(x^n \to 1\)이므로 (거듭제곱함수의 연속성), \(1\)보다 작은 어떤 수도 상계가 될 수 없습니다. 따라서 상한은 정확히 \(1\)입니다.`,
                en: String.raw`Since \(x^n < 1\) for \(x < 1\), the supremum is at most \(1\). But \(x^n \to 1\) as \(x \to 1^{-}\) (continuity of the power function), so no number below \(1\) is an upper bound. The supremum is exactly \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`균등수렴은 \(\sup |f_n - f| \to 0\)을 요구하는데, 여기서는 모든 \(n\)에 대해 그 값이 \(1\)로 고정되어 있습니다. 따라서 \((x^n)\)은 균등수렴하지 않습니다.`,
                en: String.raw`Uniform convergence would require \(\sup |f_n - f| \to 0\), but here it equals \(1\) for every \(n\). Hence \((x^n)\) does not converge uniformly.`,
              },
            },
          ],
        },
        {
          id: 'uniform-limit-continuous',
          statement: {
            ko: String.raw`연속함수열이 균등수렴하면 그 극한함수도 연속임을 \(\varepsilon/3\) 논법으로 증명하세요.`,
            en: String.raw`Prove that a uniformly convergent sequence of continuous functions has a continuous limit — the \(\varepsilon/3\) argument.`,
          },
          display: [String.raw`|f(x) - f(x_0)| \leq \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} = \varepsilon`],
          preset: { n: 30, eps: 0.1 },
          presetCaption: {
            ko: String.raw`\(n = 30\) — \(x^n\)에서는 어떤 \(N\)도 모든 \(x\)에 동시에 통하지 않습니다. 균등수렴이란 바로 그 '동시성'입니다.`,
            en: String.raw`\(n = 30\) — for \(x^n\), no \(N\) works for all \(x\) at once. Uniform convergence is exactly that simultaneity.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`각 \(f_n\)이 연속이고 \(f_n \to f\)가 균등수렴한다고 하자. \(x_0\)와 \(\varepsilon > 0\)을 고정한다.`,
                en: String.raw`Let each \(f_n\) be continuous and \(f_n \to f\) uniformly. Fix \(x_0\) and \(\varepsilon > 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`균등수렴에 의해 \(\sup |f_N - f| < \frac{\varepsilon}{3}\)인 \(N\)이 존재한다. 이 \(N\)을 고정한다.`,
                en: String.raw`By uniform convergence there is \(N\) with \(\sup |f_N - f| < \frac{\varepsilon}{3}\). Fix this \(N\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f_N\)은 \(x_0\)에서 연속이므로, \(|x - x_0| < \delta\)이면 \(|f_N(x) - f_N(x_0)| < \frac{\varepsilon}{3}\)인 \(\delta > 0\)이 존재한다.`,
                en: String.raw`Since \(f_N\) is continuous at \(x_0\), there is \(\delta > 0\) with \(|f_N(x) - f_N(x_0)| < \frac{\varepsilon}{3}\) whenever \(|x - x_0| < \delta\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x - x_0| < \delta\)일 때 삼각부등식으로 \(|f(x) - f(x_0)| \leq |f(x) - f_N(x)| + |f_N(x) - f_N(x_0)| + |f_N(x_0) - f(x_0)| < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\)이다. 따라서 \(f\)는 \(x_0\)에서 연속이다. \(x_0\)가 임의였으므로 \(f\)는 연속이다.`,
                en: String.raw`For \(|x - x_0| < \delta\), the triangle inequality gives \(|f(x) - f(x_0)| \leq |f(x) - f_N(x)| + |f_N(x) - f_N(x_0)| + |f_N(x_0) - f(x_0)| < \frac{\varepsilon}{3} + \frac{\varepsilon}{3} + \frac{\varepsilon}{3} = \varepsilon\). So \(f\) is continuous at \(x_0\), and \(x_0\) was arbitrary.`,
              },
            },
          ],
        },
      ],
    },
  ],
};
