import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the measure scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'singleton-measure-zero',
    statement: {
      ko: String.raw`외측도 \(m^*(\{x\}) = 0\)임을 증명하세요.`,
      en: String.raw`Prove the outer measure \(m^*(\{x\}) = 0\).`,
    },
    display: [String.raw`m^*(\{x\}) \leq \varepsilon`],
    preset: { target: 'singleton', eps: 0.1, K: 16 },
    presetCaption: {
      ko: String.raw`\(\{0.5\}\) — 길이 \(\varepsilon = 0.1\)인 구간 하나로 덮습니다.`,
      en: String.raw`\(\{0.5\}\) — covered by a single interval of length \(\varepsilon = 0.1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`임의의 \(\varepsilon > 0\)에 대해 구간 \((x - \varepsilon/2,\, x + \varepsilon/2)\)는 \(\{x\}\)의 가산 구간 덮개이며 총길이는 \(\varepsilon\)이다.`,
          en: String.raw`For any \(\varepsilon > 0\), the interval \((x - \varepsilon/2,\, x + \varepsilon/2)\) is a countable interval cover of \(\{x\}\) with total length \(\varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(m^*\)는 모든 덮개의 총길이에 대한 하한(infimum)이므로 \(m^*(\{x\}) \le \varepsilon\)이다.`,
          en: String.raw`Since \(m^*\) is the infimum of the total lengths over all covers, \(m^*(\{x\}) \le \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 임의였으므로 \(m^*(\{x\}) = 0\)이다. 한 점은 외측도가 0이다.`,
          en: String.raw`Since \(\varepsilon > 0\) was arbitrary, \(m^*(\{x\}) = 0\). A single point has outer measure zero.`,
        },
      },
    ],
  },
  {
    id: 'rationals-measure-zero',
    statement: {
      ko: String.raw`\(m^*(\mathbb{Q}\cap[0,1]) = 0\)임을 증명하세요.`,
      en: String.raw`Prove \(m^*(\mathbb{Q}\cap[0,1]) = 0\).`,
    },
    display: [String.raw`\sum_{n=1}^{\infty} \frac{\varepsilon}{2^n} = \varepsilon`],
    preset: { target: 'rationals', eps: 0.1, K: 16 },
    presetCaption: {
      ko: String.raw`\(\mathbb{Q}\cap[0,1]\) — \(k\)번째 유리수를 길이 \(\varepsilon/2^{k+1}\)인 구간으로 덮습니다 (총길이 \(<\varepsilon\)).`,
      en: String.raw`\(\mathbb{Q}\cap[0,1]\) — the \(k\)-th rational gets an interval of length \(\varepsilon/2^{k+1}\) (total \(<\varepsilon\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\mathbb{Q}\cap[0,1]\)은 가산집합이므로 \(\{q_1, q_2, \dots\}\)로 열거할 수 있다. 임의의 \(\varepsilon > 0\)을 잡자.`,
          en: String.raw`\(\mathbb{Q}\cap[0,1]\) is countable, so enumerate it as \(\{q_1, q_2, \dots\}\). Let \(\varepsilon > 0\) be arbitrary.`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(q_n\)을 중심으로 길이가 \(\varepsilon/2^n\)인 구간 \(I_n\)으로 덮자. \(\{I_n\}\)은 \(\mathbb{Q}\cap[0,1]\)의 가산 구간 덮개이며, 총길이는 \(\sum_{n=1}^{\infty} \varepsilon/2^n = \varepsilon\)이다.`,
          en: String.raw`Cover each \(q_n\) by an interval \(I_n\) of length \(\varepsilon/2^n\) centered at \(q_n\). Then \(\{I_n\}\) is a countable interval cover of \(\mathbb{Q}\cap[0,1]\) with total length \(\sum_{n=1}^{\infty} \varepsilon/2^n = \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(m^*(\mathbb{Q}\cap[0,1]) \le \varepsilon\)이고, \(\varepsilon\)이 임의이므로 \(m^*(\mathbb{Q}\cap[0,1]) = 0\)이다. 가산집합은 외측도가 0이다.`,
          en: String.raw`Hence \(m^*(\mathbb{Q}\cap[0,1]) \le \varepsilon\), and since \(\varepsilon\) is arbitrary, \(m^*(\mathbb{Q}\cap[0,1]) = 0\). Every countable set has outer measure zero.`,
        },
      },
    ],
  },
  {
    id: 'monotone',
    statement: {
      ko: String.raw`\(A \subseteq B \implies m^*(A) \leq m^*(B)\)임을 증명하세요.`,
      en: String.raw`Prove \(A \subseteq B \implies m^*(A) \leq m^*(B)\).`,
    },
    preset: { target: 'rationals', eps: 0.05, K: 32 },
    presetCaption: {
      ko: String.raw`\(\mathbb{Q}\cap[0,1] \subseteq [0,1]\) — 작은 집합의 덮개 총길이는 \(\varepsilon = 0.05\) 아래로 떨어집니다.`,
      en: String.raw`\(\mathbb{Q}\cap[0,1] \subseteq [0,1]\) — the smaller set's cover total drops below \(\varepsilon = 0.05\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(A \subseteq B\)라 하자. \(B\)의 가산 구간 덮개 \(\{I_n\}\)는 \(A\)도 덮는다: 각 \(I_n\)은 구간이므로 합집합 \(\bigcup_n I_n\)은 \(B\)를 포함하고, 따라서 \(A\)도 포함한다.`,
          en: String.raw`Let \(A \subseteq B\). Any countable interval cover \(\{I_n\}\) of \(B\) also covers \(A\): each \(I_n\) is an interval, so \(\bigcup_n I_n \supseteq B \supseteq A\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(B\)의 덮개들의 모임은 \(A\)의 덮개들의 모임에 포함된다. 하한(infimum)은 더 큰 모임에서 더 작아지므로 \(m^*(A) \le m^*(B)\)이다.`,
          en: String.raw`Hence the family of covers of \(B\) is contained in the family of covers of \(A\). The infimum over the larger family is smaller, so \(m^*(A) \le m^*(B)\).`,
        },
      },
      {
        text: {
          ko: String.raw`특히 \(\mathbb{Q}\cap[0,1] \subseteq [0,1]\)이므로 \(m^*(\mathbb{Q}\cap[0,1]) = 0 \le 1 = m^*([0,1])\)이다. 외측도는 단조적이다.`,
          en: String.raw`In particular \(\mathbb{Q}\cap[0,1] \subseteq [0,1]\) gives \(m^*(\mathbb{Q}\cap[0,1]) = 0 \le 1 = m^*([0,1])\). Outer measure is monotone.`,
        },
      },
    ],
  },
];
