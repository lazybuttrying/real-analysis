import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the stolz-cesaro scene.
 * Imports nothing except types. Imported by the chapter's meta.ts.
 *
 * The mini visualizations reuse the scene's own example (a_n = sum of
 * squares, b_n = n^3); the captions tie the visible mechanism (the
 * difference ratio settling before the full ratio) to each problem.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'p1-cesaro-mean',
    statement: {
      ko: String.raw`수열 \((a_n)\)이 \(a_n \to L\)로 수렴하면, 그 체자로 평균 \(\frac{a_1+\cdots+a_n}{n}\)도 \(L\)로 수렴함을 체자로 정리를 써서 증명하세요 (\(b_n = n\)으로 두세요).`,
      en: String.raw`If \(a_n \to L\), prove with the Stolz–Cesàro theorem that the Cesàro mean \(\frac{a_1+\cdots+a_n}{n}\) also converges to \(L\) (take \(b_n = n\)).`,
    },
    display: [String.raw`\lim_{n\to\infty}\frac{a_1+\cdots+a_n}{n} = L`],
    preset: { n: 100 },
    presetCaption: {
      ko: String.raw`\(n=100\): 이 장면의 예시에서 차분 비율 \(r_{100} \approx 0.3367\)이 먼저 \(\frac{1}{3}\)에 다가가고 전체 비율 \(s_{100} \approx 0.3384\)가 뒤따릅니다. 체자로 평균은 \(b_n = n\)인 특별 경우로, 차분 비율이 \(a_{n+1}\) 자체가 됩니다.`,
      en: String.raw`\(n=100\): in this scene's example the difference ratio \(r_{100} \approx 0.3367\) settles at \(\frac{1}{3}\) first and the full ratio \(s_{100} \approx 0.3384\) follows. The Cesàro mean is the special case \(b_n = n\), where the difference ratio is \(a_{n+1}\) itself.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`부분합 \(c_n = a_1+\cdots+a_n\)과 \(b_n = n\)을 둡시다. \((b_n)\)은 엄격히 증가하고 무한대로 발산하므로 체자로 정리의 가정을 만족합니다.`,
          en: String.raw`Let \(c_n = a_1+\cdots+a_n\) and \(b_n = n\). The sequence \((b_n)\) is strictly increasing and unbounded, so it satisfies the hypotheses of the Stolz–Cesàro theorem.`,
        },
      },
      {
        text: {
          ko: String.raw`차분 비율은 \(\frac{c_{n+1}-c_n}{b_{n+1}-b_n} = \frac{a_{n+1}}{1} = a_{n+1} \to L\)입니다. 따라서 체자로 정리에서 \(\frac{c_n}{b_n} = \frac{a_1+\cdots+a_n}{n} \to L\)을 얻습니다.`,
          en: String.raw`The difference ratio is \(\frac{c_{n+1}-c_n}{b_{n+1}-b_n} = \frac{a_{n+1}}{1} = a_{n+1} \to L\). Hence the Stolz–Cesàro theorem gives \(\frac{c_n}{b_n} = \frac{a_1+\cdots+a_n}{n} \to L\).`,
        },
      },
    ],
  },
  {
    id: 'p2-sum-squares',
    statement: {
      ko: String.raw`체자로 정리를 써서 \(\displaystyle \lim_{n\to\infty}\frac{1^2+2^2+\cdots+n^2}{n^3} = \frac{1}{3}\)임을 증명하세요.`,
      en: String.raw`Use the Stolz–Cesàro theorem to prove \(\displaystyle \lim_{n\to\infty}\frac{1^2+2^2+\cdots+n^2}{n^3} = \frac{1}{3}\).`,
    },
    display: [String.raw`\lim_{n\to\infty}\frac{1^2+2^2+\cdots+n^2}{n^3} = \frac{1}{3}`],
    preset: { n: 200 },
    presetCaption: {
      ko: String.raw`\(n=200\): \(r_{200} \approx 0.3350\), \(s_{200} \approx 0.3358\) — 두 비율이 모두 \(\frac{1}{3}\)에 거의 닿았습니다.`,
      en: String.raw`\(n=200\): \(r_{200} \approx 0.3350\), \(s_{200} \approx 0.3358\) — both ratios have nearly reached \(\frac{1}{3}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a_n = 1^2+\cdots+n^2\), \(b_n = n^3\)이라 둡니다. \((b_n)\)은 \(n \ge 1\)에서 엄격히 증가하고 무한대로 발산합니다.`,
          en: String.raw`Let \(a_n = 1^2+\cdots+n^2\) and \(b_n = n^3\). The sequence \((b_n)\) is strictly increasing for \(n \ge 1\) and unbounded.`,
        },
      },
      {
        text: {
          ko: String.raw`\(a_{n+1}-a_n = (n+1)^2\), \(b_{n+1}-b_n = (n+1)^3-n^3 = 3n^2+3n+1\)이므로 차분 비율은 \(\frac{(n+1)^2}{3n^2+3n+1} = \frac{1+2/n+1/n^2}{3+3/n+1/n^2} \to \frac{1}{3}\)입니다.`,
          en: String.raw`Since \(a_{n+1}-a_n = (n+1)^2\) and \(b_{n+1}-b_n = (n+1)^3-n^3 = 3n^2+3n+1\), the difference ratio is \(\frac{(n+1)^2}{3n^2+3n+1} = \frac{1+2/n+1/n^2}{3+3/n+1/n^2} \to \frac{1}{3}\).`,
        },
      },
      {
        text: {
          ko: String.raw`체자로 정리에 의해 \(\frac{a_n}{b_n} = \frac{1^2+\cdots+n^2}{n^3} \to \frac{1}{3}\)입니다.`,
          en: String.raw`By the Stolz–Cesàro theorem, \(\frac{a_n}{b_n} = \frac{1^2+\cdots+n^2}{n^3} \to \frac{1}{3}\).`,
        },
      },
    ],
  },
  {
    id: 'p3-odd-sum',
    statement: {
      ko: String.raw`\(1+3+5+\cdots+(2n-1)\)은 처음 \(n\)개 홀수의 합입니다. 체자로 정리를 써서 \(\displaystyle \lim_{n\to\infty}\frac{1+3+\cdots+(2n-1)}{n^2} = 1\)임을 증명하세요.`,
      en: String.raw`\(1+3+5+\cdots+(2n-1)\) is the sum of the first \(n\) odd numbers. Use the Stolz–Cesàro theorem to prove \(\displaystyle \lim_{n\to\infty}\frac{1+3+\cdots+(2n-1)}{n^2} = 1\).`,
    },
    display: [String.raw`\sum_{k=1}^{n}(2k-1) = n^2, \qquad \lim_{n\to\infty}\frac{1+3+\cdots+(2n-1)}{n^2} = 1`],
    preset: { n: 60 },
    presetCaption: {
      ko: String.raw`\(n=60\): 이 장면의 예시에서 \(r_{60} \approx 0.3389\), \(s_{60} \approx 0.3417\) — 홀수합 문제도 같은 기계장치로 풀립니다 (\(b_n = n^2\), 차분 비율이 정확히 \(1\)).`,
      en: String.raw`\(n=60\): in this scene's example \(r_{60} \approx 0.3389\), \(s_{60} \approx 0.3417\) — the odd-sum problem runs on the same machinery (\(b_n = n^2\), difference ratio exactly \(1\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a_n = 1+3+\cdots+(2n-1)\)이라 두면 수학적 귀납법으로 \(a_n = n^2\)입니다: \(n=1\)일 때 \(1 = 1^2\)이고, \(a_n = n^2\)이면 \(a_{n+1} = n^2+(2n+1) = (n+1)^2\)입니다. \(b_n = n^2\)은 엄격히 증가하고 무한대로 발산합니다.`,
          en: String.raw`Let \(a_n = 1+3+\cdots+(2n-1)\); by induction \(a_n = n^2\): for \(n=1\), \(1 = 1^2\), and if \(a_n = n^2\) then \(a_{n+1} = n^2+(2n+1) = (n+1)^2\). The sequence \(b_n = n^2\) is strictly increasing and unbounded.`,
        },
      },
      {
        text: {
          ko: String.raw`\(a_{n+1}-a_n = 2n+1\), \(b_{n+1}-b_n = (n+1)^2-n^2 = 2n+1\)이므로 차분 비율은 모든 \(n\)에서 \(\frac{2n+1}{2n+1} = 1\)로, 극한도 \(1\)입니다.`,
          en: String.raw`Since \(a_{n+1}-a_n = 2n+1\) and \(b_{n+1}-b_n = (n+1)^2-n^2 = 2n+1\), the difference ratio is \(\frac{2n+1}{2n+1} = 1\) for every \(n\), hence its limit is \(1\).`,
        },
      },
      {
        text: {
          ko: String.raw`체자로 정리에 의해 \(\frac{a_n}{b_n} \to 1\) — 사실 \(a_n = b_n\)이므로 모든 \(n\)에서 비율이 정확히 \(1\)입니다.`,
          en: String.raw`By the Stolz–Cesàro theorem, \(\frac{a_n}{b_n} \to 1\) — in fact \(a_n = b_n\), so the ratio is exactly \(1\) for every \(n\).`,
        },
      },
    ],
  },
];
