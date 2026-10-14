import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'point',
          statement: {
            ko: String.raw`한 점 \(\{x_0\}\)의 측도가 0임을 덮개로 증명하세요.`,
            en: String.raw`Prove by covering that a single point \(\{x_0\}\) has measure 0.`,
          },
          display: [String.raw`m(\{x_0\}) \le \varepsilon \quad \forall\,\varepsilon > 0`],
          preset: { epsilon: 0.1, K: 1 },
          presetCaption: {
            ko: String.raw`\(K = 1\): 첫 유리수 \(0\)을 길이 \(0.05\) 덮개로 덮습니다.`,
            en: String.raw`\(K = 1\): the first rational \(0\) gets a cover of length \(0.05\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`임의의 \(\varepsilon > 0\)에 대해 구간 \((x_0 - \varepsilon/2,\, x_0 + \varepsilon/2)\)는 \(\{x_0\}\)를 덮고 길이는 \(\varepsilon\)입니다.`,
                en: String.raw`For any \(\varepsilon > 0\), the interval \((x_0 - \varepsilon/2,\, x_0 + \varepsilon/2)\) covers \(\{x_0\}\) and has length \(\varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 외측도는 \(\varepsilon\) 이하이고, \(\varepsilon\)이 임의이므로 측도는 \(0\)입니다.`,
                en: String.raw`So the outer measure is at most \(\varepsilon\), and since \(\varepsilon\) is arbitrary, the measure is \(0\).`,
              },
            },
          ],
        },
        {
          id: 'rationals',
          statement: {
            ko: String.raw`\(m(\mathbb{Q}\cap[0,1]) = 0\)을 \(\varepsilon/2^k\) 덮개로 증명하세요.`,
            en: String.raw`Prove \(m(\mathbb{Q}\cap[0,1]) = 0\) with the \(\varepsilon/2^k\) covering.`,
          },
          display: [String.raw`\sum_{k=1}^{\infty}\frac{\varepsilon}{2^k} = \varepsilon`],
          preset: { epsilon: 0.05, K: 32 },
          presetCaption: {
            ko: String.raw`\(\varepsilon = 0.05\), \(K = 32\): 총길이 \(\approx 0.05\)로 유리수 32개를 덮습니다.`,
            en: String.raw`\(\varepsilon = 0.05\), \(K = 32\): total length \(\approx 0.05\) covers 32 rationals.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`유리수는 가산집합이므로 \([0,1]\)의 유리수를 \(r_1, r_2, \dots\)로 나열합니다.`,
                en: String.raw`The rationals are countable, so enumerate those in \([0,1]\) as \(r_1, r_2, \dots\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(r_k\)를 길이 \(\varepsilon/2^k\)인 구간으로 덮으면 전체 덮개의 총길이는 \(\sum_{k=1}^{\infty}\varepsilon/2^k = \varepsilon\)입니다.`,
                en: String.raw`Covering \(r_k\) with an interval of length \(\varepsilon/2^k\) gives total cover length \(\sum_{k=1}^{\infty}\varepsilon/2^k = \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 임의이므로 외측도는 \(0\)이고, 따라서 측도도 \(0\)입니다.`,
                en: String.raw`Since \(\varepsilon > 0\) is arbitrary, the outer measure is \(0\), hence so is the measure.`,
              },
            },
          ],
        },
        {
          id: 'dirichlet-lebesgue',
          statement: {
            ko: String.raw`디리클레 함수의 르벡 적분은 0임을 (짧게) 증명하고, 리만 적분과 대비하세요.`,
            en: String.raw`Prove (briefly) that the Lebesgue integral of the Dirichlet function is 0, and contrast with Riemann.`,
          },
          display: [String.raw`\int_{[0,1]} D = 1\cdot m(\mathbb{Q}\cap[0,1]) + 0 = 0`],
          preset: { epsilon: 0.2, K: 16 },
          presetCaption: {
            ko: String.raw`\(D = 1\)인 집합(유리수)은 측도 0 — 나머지는 \(D = 0\)입니다.`,
            en: String.raw`The set where \(D = 1\) (the rationals) has measure 0 — elsewhere \(D = 0\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(D = 1\)인 집합은 \(\mathbb{Q}\cap[0,1]\)로 측도가 \(0\)이고, 나머지는 \(D = 0\)입니다.`,
                en: String.raw`The set where \(D = 1\) is \(\mathbb{Q}\cap[0,1]\), of measure \(0\); elsewhere \(D = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 르벡 적분은 \(1 \cdot 0 + 0 \cdot 1 = 0\)입니다.`,
                en: String.raw`So the Lebesgue integral is \(1 \cdot 0 + 0 \cdot 1 = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`반면 리만은 모든 분할에서 \(U = 1\), \(L = 0\)으로 꼼짝 못 합니다 — 르벡은 "값이 얼마나 자주 나오는지"를 셉니다.`,
                en: String.raw`Riemann, by contrast, is stuck at \(U = 1\), \(L = 0\) for every partition — Lebesgue counts "how often each value occurs".`,
              },
            },
          ],
        },
      ];
