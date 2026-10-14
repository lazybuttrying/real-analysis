import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'diverges',
          statement: {
            ko: String.raw`그란디 급수가 발산함을 부분합으로 직접 증명하세요.`,
            en: String.raw`Prove directly from the partial sums that Grandi's series diverges.`,
          },
          display: [String.raw`S_n = \begin{cases}1 & n\ \mathrm{odd}\\0 & n\ \mathrm{even}\end{cases}`],
          preset: { n: 16 },
          presetCaption: {
            ko: String.raw`부분합이 \(1, 0\)을 영원히 오갑니다.`,
            en: String.raw`The partial sums bounce between \(1\) and \(0\) forever.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S_n = 1-1+\cdots\pm 1\): \(n\)이 홀수이면 \(1\), 짝수이면 \(0\)입니다.`,
                en: String.raw`\(S_n = 1-1+\cdots\pm 1\): it equals \(1\) for odd \(n\) and \(0\) for even \(n\).`,
              },
            },
            {
              text: {
                ko: String.raw`수열이 두 값만 무한히 오가므로 극한이 없습니다.`,
                en: String.raw`The sequence takes only two values, alternating forever, so it has no limit.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 급수는 발산합니다 — "합"이 존재하지 않습니다.`,
                en: String.raw`Hence the series diverges — no sum exists.`,
              },
            },
          ],
        },
        {
          id: 'cesaro',
          statement: {
            ko: String.raw`체사로 평균 \(\sigma_N = \frac{S_1+\cdots+S_N}{N}\)이 \(\frac{1}{2}\)로 수렴함을 증명하세요.`,
            en: String.raw`Prove the Cesàro means \(\sigma_N = \frac{S_1+\cdots+S_N}{N}\) converge to \(\frac{1}{2}\).`,
          },
          display: [String.raw`\sigma_N = \frac{\lceil N/2\rceil}{N} \to \frac{1}{2}`],
          preset: { n: 16 },
          presetCaption: {
            ko: String.raw`평균을 내면 진동이 가라앉아 \(1/2\)로 갑니다.`,
            en: String.raw`Averaging settles the oscillation toward \(1/2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S_k\)는 홀수 \(k\)에서 \(1\), 짝수 \(k\)에서 \(0\)이므로, \(S_1+\cdots+S_N = \lceil N/2\rceil\)입니다.`,
                en: String.raw`Since \(S_k = 1\) for odd \(k\) and \(0\) for even \(k\), \(S_1+\cdots+S_N = \lceil N/2\rceil\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sigma_N = \frac{\lceil N/2\rceil}{N}\): \(N = 2m\)이면 \(\frac{m}{2m} = \frac{1}{2}\)이고, \(N = 2m+1\)이면 \(\frac{m+1}{2m+1} \to \frac{1}{2}\)입니다.`,
                en: String.raw`\(\sigma_N = \frac{\lceil N/2\rceil}{N}\): for \(N = 2m\) this is \(\frac{m}{2m} = \frac{1}{2}\), and for \(N = 2m+1\) it is \(\frac{m+1}{2m+1} \to \frac{1}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\sigma_N \to \frac{1}{2}\)입니다. 이는 부분합의 "평균"이지, 급수의 합이 아닙니다.`,
                en: String.raw`Hence \(\sigma_N \to \frac{1}{2}\). This is a mean of the partial sums — not a sum of the series.`,
              },
            },
          ],
        },
        {
          id: 'grouping-fallacy',
          statement: {
            ko: String.raw`발산급수를 멋대로 묶으면 \(0\)도 \(1\)도 "증명"됨을 보이고, 왜 틀렸는지 설명하세요.`,
            en: String.raw`Show that naive grouping "proves" both \(0\) and \(1\), and explain the fallacy.`,
          },
          display: [String.raw`(1-1)+(1-1)+\cdots = 0 \qquad\text{vs}\qquad 1+(-1+1)+(-1+1)+\cdots = 1`],
          preset: { n: 16 },
          presetCaption: {
            ko: String.raw`묶는 위치에 따라 답이 바뀝니다 — 둘 다 틀렸습니다.`,
            en: String.raw`The "answer" changes with the grouping — both are wrong.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((1-1)+(1-1)+\cdots = 0+0+\cdots = 0\)입니다.`,
                en: String.raw`\((1-1)+(1-1)+\cdots = 0+0+\cdots = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`한편 \(1+(-1+1)+(-1+1)+\cdots = 1+0+0+\cdots = 1\)입니다.`,
                en: String.raw`But \(1+(-1+1)+(-1+1)+\cdots = 1+0+0+\cdots = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`같은 급수에서 \(0\)과 \(1\)이 둘 다 "나오므로" 멋대로 묶기는 정당하지 않습니다. 묶기(결합법칙)는 수렴이 보장된 뒤에야 쓸 수 있습니다.`,
                en: String.raw`Since both \(0\) and \(1\) "come out" of the same series, arbitrary grouping is illegitimate. Regrouping is only valid once convergence is established.`,
              },
            },
          ],
        },
      ];
