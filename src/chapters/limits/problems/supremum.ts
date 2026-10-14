import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
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
      ];
