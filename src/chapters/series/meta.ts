import type { ChapterMeta } from '../../contracts.ts';

/**
 * Pure data. Imports nothing except type imports.
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 * Summaries embed math as inline TeX between \( and \) (see splitInlineMath in contracts.ts).
 */
export const series: ChapterMeta = {
  id: 'series',
  title: { ko: '급수', en: 'Series' },
  summary: {
    ko: '무한급수의 수렴과 발산을 부분합의 움직임으로 확인합니다.',
    en: 'See how infinite series converge or diverge by watching their partial sums move.',
  },
  scenes: [
    {
      id: 'harmonic',
      title: { ko: '조화급수의 발산', en: 'The Harmonic Series Diverges' },
      order: 1,
      summary: {
        ko: String.raw`부분합 \(S_n\)이 \(\ln n + \gamma\)를 따라 아주 느리게, 그러나 끝없이 커지는 모습을 확인합니다.`,
        en: String.raw`The partial sums \(S_n\) follow \(\ln n + \gamma\) upward — very slowly, but without end.`,
      },
      tex: [String.raw`S_n=\sum_{k=1}^{n}\frac{1}{k}`, String.raw`S_n=\ln n+\gamma+o(1)`],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 100000, step: 1, init: 1000 },
        { kind: 'toggle', key: 'logX', label: { ko: 'x축 로그 눈금', en: 'Logarithmic x-axis' }, init: true },
      ],
      problems: [
        {
          id: 'oresme',
          statement: {
            ko: String.raw`\(2^m\)개의 항까지의 부분합이 \(1 + \frac{m}{2}\) 이상임을 오레스메 묶음으로 보이고, 조화급수가 발산함을 증명하세요.`,
            en: String.raw`Use Oresme's grouping to show \(S_{2^m} \ge 1 + \frac{m}{2}\), proving the harmonic series diverges.`,
          },
          display: [String.raw`S_{2^m} \ge 1 + \frac{m}{2} \to \infty`],
          preset: { n: 1024, logX: true },
          presetCaption: {
            ko: String.raw`\(n = 1024 = 2^{10}\) — 오레스메 하한 \(1 + 10/2 = 6\) 위에서 자랍니다.`,
            en: String.raw`\(n = 1024 = 2^{10}\) — growing above the Oresme bound \(1 + 10/2 = 6\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`항들을 묶습니다: \(\frac{1}{3}+\frac{1}{4} > \frac{1}{4}+\frac{1}{4} = \frac{1}{2}\), \(\frac{1}{5}+\cdots+\frac{1}{8} > 4\cdot\frac{1}{8} = \frac{1}{2}\). 일반적으로 \(\frac{1}{2^{m-1}+1}+\cdots+\frac{1}{2^m} > 2^{m-1}\cdot\frac{1}{2^m} = \frac{1}{2}\)입니다.`,
                en: String.raw`Group the terms: \(\frac{1}{3}+\frac{1}{4} > \frac{1}{4}+\frac{1}{4} = \frac{1}{2}\), \(\frac{1}{5}+\cdots+\frac{1}{8} > 4\cdot\frac{1}{8} = \frac{1}{2}\). In general \(\frac{1}{2^{m-1}+1}+\cdots+\frac{1}{2^m} > 2^{m-1}\cdot\frac{1}{2^m} = \frac{1}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(S_{2^m} = 1 + \frac{1}{2} + \left(\frac{1}{3}+\frac{1}{4}\right) + \cdots \ge 1 + m\cdot\frac{1}{2} = 1 + \frac{m}{2}\)입니다.`,
                en: String.raw`Hence \(S_{2^m} = 1 + \frac{1}{2} + \left(\frac{1}{3}+\frac{1}{4}\right) + \cdots \ge 1 + m\cdot\frac{1}{2} = 1 + \frac{m}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(m \to \infty\)이면 우변이 무한대로 가므로 \((S_n)\)은 유계가 아닙니다. 단조증가 수열이 유계가 아니면 발산하므로, 조화급수는 발산합니다.`,
                en: String.raw`As \(m \to \infty\) the bound is unbounded, so \((S_n)\) is unbounded. An increasing unbounded sequence diverges, so the harmonic series diverges.`,
              },
            },
          ],
        },
        {
          id: 'alternating',
          statement: {
            ko: String.raw`교대조화급수 \(\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}\)가 수렴함을 교대급수 판정법으로 증명하세요. (합이 \(\ln 2\)라는 것은 알려진 사실로 둡니다.)`,
            en: String.raw`Prove the alternating harmonic series \(\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}\) converges via the alternating series test. (Its sum \(\ln 2\) is taken as known.)`,
          },
          display: [String.raw`\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n} = 1-\frac{1}{2}+\frac{1}{3}-\cdots`],
          preset: { n: 10000, logX: true },
          presetCaption: {
            ko: String.raw`대조용: 부호 없이 더하면 \(S_n\)은 끝없이 자라지만, 부호를 번갈면 수렴합니다.`,
            en: String.raw`For contrast: without alternating signs \(S_n\) grows without bound; with them it converges.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`교대급수 판정법: \(b_n \downarrow 0\)이면 \(\sum_{n=1}^{\infty}(-1)^{n+1}b_n\)이 수렴합니다. 여기서는 \(b_n = \frac{1}{n}\)이 감소하며 \(0\)으로 갑니다.`,
                en: String.raw`Alternating series test: if \(b_n \downarrow 0\) then \(\sum_{n=1}^{\infty}(-1)^{n+1}b_n\) converges. Here \(b_n = \frac{1}{n}\) decreases to \(0\).`,
              },
            },
            {
              text: {
                ko: String.raw`직접 보이면: 짝수 부분합 \(T_{2m} = \left(1-\frac{1}{2}\right)+\left(\frac{1}{3}-\frac{1}{4}\right)+\cdots\)는 각 괄호가 양수이므로 증가하고 \(T_{2m} < 1\)로 유계이니 수렴합니다. 홀수 부분합 \(T_{2m+1} = T_{2m}+\frac{1}{2m+1}\)은 같은 극한으로 갑니다.`,
                en: String.raw`Directly: the even partial sums \(T_{2m} = \left(1-\frac{1}{2}\right)+\left(\frac{1}{3}-\frac{1}{4}\right)+\cdots\) group into positive pairs, so they increase and are bounded by \(1\), hence converge. The odd partial sums \(T_{2m+1} = T_{2m}+\frac{1}{2m+1}\) tend to the same limit.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 교대조화급수는 수렴합니다. (합이 \(\ln 2\)라는 것은 여기서 증명하지 않습니다.)`,
                en: String.raw`Hence the alternating harmonic series converges. (That its sum is \(\ln 2\) is not proved here.)`,
              },
            },
          ],
        },
        {
          id: 'p-series',
          statement: {
            ko: String.raw`\(p\)-급수 \(\sum_{n=1}^{\infty}\frac{1}{n^p}\)가 \(p > 1\)일 때 수렴하고 \(p \le 1\)일 때 발산함을 적분 판정법으로 증명하세요.`,
            en: String.raw`Prove by the integral test that \(\sum_{n=1}^{\infty}\frac{1}{n^p}\) converges if and only if \(p > 1\).`,
          },
          display: [String.raw`\sum_{n=1}^{N}\frac{1}{n^p} \le 1 + \int_{1}^{N}\frac{dx}{x^p}`],
          preset: { n: 100000, logX: true },
          presetCaption: {
            ko: String.raw`\(p = 1\)인 경우: 적분 판정법의 발산 쪽을 보여줍니다.`,
            en: String.raw`The case \(p = 1\): the divergent side of the integral test.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = \frac{1}{x^p}\)는 양의 감소함수입니다. \(n \ge 2\)에서 \(\frac{1}{n^p} \le \int_{n-1}^{n}\frac{dx}{x^p}\)이므로, \(S_N \le 1 + \int_{1}^{N}\frac{dx}{x^p}\)입니다.`,
                en: String.raw`\(f(x) = x^{-p}\) is positive and decreasing. For \(n \ge 2\), \(\frac{1}{n^p} \le \int_{n-1}^{n}\frac{dx}{x^p}\), so \(S_N \le 1 + \int_{1}^{N}\frac{dx}{x^p}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(p > 1\)이면 \(\int_{1}^{N}\frac{dx}{x^p} = \frac{1 - N^{1-p}}{p-1} < \frac{1}{p-1}\)로 유계이므로, 단조증가하는 부분합이 유계 → 수렴합니다.`,
                en: String.raw`If \(p > 1\), \(\int_{1}^{N}\frac{dx}{x^p} = \frac{1 - N^{1-p}}{p-1} < \frac{1}{p-1}\) is bounded, so the increasing partial sums are bounded and converge.`,
              },
            },
            {
              text: {
                ko: String.raw`\(p \le 1\)이면 \(\frac{1}{n^p} \ge \frac{1}{n}\)이므로 조화급수와의 비교로 발산합니다.`,
                en: String.raw`If \(p \le 1\), \(\frac{1}{n^p} \ge \frac{1}{n}\), so comparison with the harmonic series gives divergence.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'basel',
      title: { ko: '바젤 문제', en: 'The Basel Problem' },
      order: 2,
      summary: {
        ko: String.raw`항 \(\frac{1}{n^2}\)을 3차원 막대로 쌓고 부분합의 계단이 \(\frac{\pi^2}{6}\) 평면에 닿지 못한 채 다가가는 모습을 확인합니다. \(\pi\)가 왜 등장하는지는 아이디어 수준에서만 짚습니다.`,
        en: String.raw`Stack the terms \(\frac{1}{n^2}\) as 3D bars and watch the staircase of partial sums approach the plane at \(\frac{\pi^2}{6}\) without ever touching it. Why \(\pi\) appears at all is only sketched at the idea level.`,
      },
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 14 }],
      problems: [
        {
          id: 'tail-bound',
          statement: {
            ko: String.raw`꼬리합 \(R_N = \sum_{n>N}\frac{1}{n^2}\)에 대해 \(R_N < \frac{1}{N}\)을 증명하세요.`,
            en: String.raw`Prove the tail bound \(R_N = \sum_{n>N}\frac{1}{n^2} < \frac{1}{N}\).`,
          },
          display: [String.raw`R_N < \sum_{n>N}\left(\frac{1}{n-1}-\frac{1}{n}\right) = \frac{1}{N}`],
          preset: { n: 20 },
          presetCaption: {
            ko: String.raw`\(N = 20\): 실제 꼬리 \(\approx 0.0488 < 1/20 = 0.05\).`,
            en: String.raw`\(N = 20\): the actual tail \(\approx 0.0488 < 1/20 = 0.05\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(n \ge 2\)에서 \(\frac{1}{n^2} < \frac{1}{n(n-1)} = \frac{1}{n-1}-\frac{1}{n}\)입니다.`,
                en: String.raw`For \(n \ge 2\), \(\frac{1}{n^2} < \frac{1}{n(n-1)} = \frac{1}{n-1}-\frac{1}{n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`유한합은 망원합입니다: \(\sum_{n=N+1}^{M}\left(\frac{1}{n-1}-\frac{1}{n}\right) = \frac{1}{N}-\frac{1}{M} < \frac{1}{N}\). \(M \to \infty\)로 보내면 \(R_N \le \frac{1}{N}\)이고, 부등식이 엄격하므로 \(R_N < \frac{1}{N}\)입니다.`,
                en: String.raw`The finite sum telescopes: \(\sum_{n=N+1}^{M}\left(\frac{1}{n-1}-\frac{1}{n}\right) = \frac{1}{N}-\frac{1}{M} < \frac{1}{N}\). Letting \(M \to \infty\) gives \(R_N < \frac{1}{N}\) (strict, since each term comparison is strict).`,
              },
            },
            {
              text: {
                ko: String.raw`예를 들어 \(N = 20\)이면 꼬리가 \(0.05\) 미만 — 부분합 \(S_{20}\)은 이미 극한의 \(0.05\) 이내에 있습니다.`,
                en: String.raw`For example with \(N = 20\) the tail is below \(0.05\) — the partial sum \(S_{20}\) is already within \(0.05\) of the limit.`,
              },
            },
          ],
        },
        {
          id: 'even-terms',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{\pi^2}{24}\)임을 바젤 문제의 결과로부터 유도하세요.`,
            en: String.raw`Derive \(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{\pi^2}{24}\) from the Basel sum.`,
          },
          display: [String.raw`\sum_{n=1}^{\infty}\frac{1}{(2n)^2}=\frac{1}{4}\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{24}`],
          preset: { n: 40 },
          presetCaption: {
            ko: String.raw`짝수 항만 모아도 같은 모양으로 수렴합니다.`,
            en: String.raw`The even terms alone converge the same way.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\frac{1}{(2n)^2} = \frac{1}{4}\cdot\frac{1}{n^2}\)입니다.`,
                en: String.raw`\(\frac{1}{(2n)^2} = \frac{1}{4}\cdot\frac{1}{n^2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`양항급수이므로 상수를 밖으로 꺼낼 수 있어, \(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{1}{4}\sum_{n=1}^{\infty}\frac{1}{n^2} = \frac{1}{4}\cdot\frac{\pi^2}{6} = \frac{\pi^2}{24}\)입니다.`,
                en: String.raw`For a positive-term series constants factor out, so \(\sum_{n=1}^{\infty}\frac{1}{(2n)^2} = \frac{1}{4}\sum_{n=1}^{\infty}\frac{1}{n^2} = \frac{1}{4}\cdot\frac{\pi^2}{6} = \frac{\pi^2}{24}\).`,
              },
            },
          ],
        },
        {
          id: 'odd-terms',
          statement: {
            ko: String.raw`홀수 항의 합 \(\sum_{k=0}^{\infty}\frac{1}{(2k+1)^2} = \frac{\pi^2}{8}\)을 유도하세요.`,
            en: String.raw`Derive \(\sum_{k=0}^{\infty}\frac{1}{(2k+1)^2} = \frac{\pi^2}{8}\).`,
          },
          display: [String.raw`\sum_{\mathrm{odd}}\frac{1}{n^2}=\frac{\pi^2}{6}-\frac{\pi^2}{24}=\frac{\pi^2}{8}`],
          preset: { n: 40 },
          presetCaption: {
            ko: String.raw`전체에서 짝수 항을 빼면 홀수 항만 남습니다.`,
            en: String.raw`Subtracting the even terms leaves exactly the odd ones.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`양항급수는 (짝수 항의 합) + (홀수 항의 합)으로 나눌 수 있습니다.`,
                en: String.raw`A positive-term series splits into (even terms) + (odd terms).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 홀수 항의 합 \(= \frac{\pi^2}{6} - \frac{\pi^2}{24} = \frac{4\pi^2-\pi^2}{24} = \frac{3\pi^2}{24} = \frac{\pi^2}{8}\)입니다.`,
                en: String.raw`Hence the odd sum \(= \frac{\pi^2}{6} - \frac{\pi^2}{24} = \frac{4\pi^2-\pi^2}{24} = \frac{3\pi^2}{24} = \frac{\pi^2}{8}\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'leibniz',
      title: { ko: '라이프니츠 급수', en: 'Leibniz Series' },
      order: 3,
      summary: {
        ko: String.raw`부분합이 \(\frac{\pi}{4}\)를 번갈아 넘고 밑돌며 조여드는 모습을 확인합니다. 이웃한 두 부분합 사이의 간격이 곧 오차의 상한입니다.`,
        en: String.raw`The partial sums overshoot and undershoot \(\frac{\pi}{4}\) in turn, closing in from both sides. The gap between two neighboring partial sums is exactly the error bound.`,
      },
      tex: [
        String.raw`\frac{\pi}{4}=1-\frac{1}{3}+\frac{1}{5}-\frac{1}{7}+\cdots`,
        String.raw`\left|S_N-\frac{\pi}{4}\right|\le\frac{1}{2N+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 60, step: 1, init: 12 }],
      problems: [
        {
          id: 'remainder',
          statement: {
            ko: String.raw`교대급수 오차 추정 \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\)을 증명하세요.`,
            en: String.raw`Prove the alternating-series error bound \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\).`,
          },
          display: [String.raw`|L - S_N| \le |S_{N+1} - S_N| = \frac{1}{2N+1}`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`\(N = 12\): 오차 \(\le 1/25 = 0.04\) — 위아래에서 조여듭니다.`,
            en: String.raw`\(N = 12\): error \(\le 1/25 = 0.04\) — squeezed from both sides.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`교대급수 \(\sum_{k=0}^{\infty}(-1)^k a_k\) (\(a_k \downarrow 0\))의 부분합은 진동하며 조여듭니다: 짝수 부분합은 증가하고 홀수 부분합은 감소하며, 극한 \(L\)은 항상 연속한 두 부분합 사이에 있습니다.`,
                en: String.raw`For an alternating series \(\sum_{k=0}^{\infty}(-1)^k a_k\) with \(a_k \downarrow 0\), the partial sums oscillate inward: even ones increase, odd ones decrease, and the limit \(L\) always lies between two consecutive partial sums.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(|L - S_N| \le |S_{N+1} - S_N| = a_{N+1}\)입니다. 라이프니츠 급수에서는 \(a_{N+1} = \frac{1}{2N+1}\)이므로 \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\)입니다.`,
                en: String.raw`Hence \(|L - S_N| \le |S_{N+1} - S_N| = a_{N+1}\). For the Leibniz series \(a_{N+1} = \frac{1}{2N+1}\), so \(\left|S_N - \frac{\pi}{4}\right| \le \frac{1}{2N+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`(급수 자체의 수렴은 교대급수 판정법으로 따릅니다 — \(a_k = \frac{1}{2k+1} \downarrow 0\).)`,
                en: String.raw`(Convergence of the series itself follows from the alternating series test, since \(a_k = \frac{1}{2k+1} \downarrow 0\).)`,
              },
            },
          ],
        },
        {
          id: 'three-decimals',
          statement: {
            ko: String.raw`소수점 아래 3자리까지 정확하려면 몇 개의 항이 필요한가요? 오차 한계를 이용해 구하세요.`,
            en: String.raw`How many terms are needed for three correct decimal places? Use the error bound.`,
          },
          display: [String.raw`\frac{1}{2N+1} < 0.0005 \iff N \ge 1000`],
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`\(N = 60\)에서도 소수 둘째 자리 — 수렴이 매우 느립니다.`,
            en: String.raw`Even at \(N = 60\) only two decimals — very slow convergence.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`소수 3자리 정확도(반올림 기준)는 오차 \(< 0.0005\)를 요구합니다.`,
                en: String.raw`Three correct decimals (rounding) requires error \(< 0.0005\).`,
              },
            },
            {
              text: {
                ko: String.raw`오차 추정으로 \(\frac{1}{2N+1} < 0.0005\), 즉 \(2N + 1 > 2000\)이 필요합니다. \(N = 999\)이면 \(\frac{1}{1999} \approx 0.00050025 > 0.0005\)이므로, \(N \ge 1000\)이어야 합니다.`,
                en: String.raw`The error bound gives \(\frac{1}{2N+1} < 0.0005\), i.e. \(2N + 1 > 2000\). Since \(\frac{1}{1999} \approx 0.00050025 > 0.0005\) at \(N = 999\), we need \(N \ge 1000\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 1000개의 항이 필요합니다 — 라이프니츠 급수의 악명 높은 느림입니다.`,
                en: String.raw`So a thousand terms are needed — the notorious slowness of the Leibniz series.`,
              },
            },
          ],
        },
        {
          id: 'arctan',
          statement: {
            ko: String.raw`\(\arctan x = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\) (\(|x| < 1\))를 유도하고, \(x = 1\)에서 라이프니츠 급수가 됨을 설명하세요. (마지막 단계는 아벨 정리로 정당화되며, 여기서는 알려진 사실로 둡니다.)`,
            en: String.raw`Derive \(\arctan x = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\) for \(|x| < 1\), giving the Leibniz series at \(x = 1\). (The final step uses Abel's theorem, taken as known.)`,
          },
          display: [String.raw`\arctan x = \int_0^x \frac{dt}{1+t^2} = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}`],
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`이 급수의 출처: \(\arctan\)의 거듭제곱급수에 \(x = 1\) 대입.`,
            en: String.raw`Where the series comes from: the power series of \(\arctan\) at \(x = 1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(|t| < 1\)에서 \(\frac{1}{1+t^2} = \sum_{k=0}^{\infty}(-t^2)^k\)입니다 (기하급수).`,
                en: String.raw`For \(|t| < 1\), \(\frac{1}{1+t^2} = \sum_{k=0}^{\infty}(-t^2)^k\) (geometric series).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x| < 1\)인 구간 \([0, x]\)에서는 균등수렴하므로 항별 적분이 정당합니다: \(\arctan x = \int_0^x \sum_{k=0}^{\infty}(-1)^k t^{2k}\,dt = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\).`,
                en: String.raw`On \([0, x]\) with \(|x| < 1\) the convergence is uniform, so termwise integration is legitimate: \(\arctan x = \int_0^x \sum_{k=0}^{\infty}(-1)^k t^{2k}\,dt = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = 1\) 대입은 조건수렴 급수이므로 아벨 정리가 필요합니다 — 알려진 사실로 받아들이면 \(\arctan 1 = \frac{\pi}{4}\)가 라이프니츠 급수와 같습니다.`,
                en: String.raw`Substituting \(x = 1\) involves a conditionally convergent series, so Abel's theorem is needed — taken as known, it gives \(\arctan 1 = \frac{\pi}{4}\) as the Leibniz series.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'eseries',
      title: { ko: 'e로 가는 두 길', en: 'Two Roads to e' },
      order: 4,
      summary: {
        ko: String.raw`복리 \((1+\frac{1}{n})^n\)과 급수 \(\sum_{k=0}^{\infty} \frac{1}{k!}\)가 \(e\)에 다가가는 속도를 견주어 확인합니다. 팩토리얼 급수가 압도적으로 빠릅니다.`,
        en: String.raw`Compare how fast compound growth \((1+\frac{1}{n})^n\) and the series \(\sum_{k=0}^{\infty} \frac{1}{k!}\) approach \(e\). The factorial series wins by a landslide.`,
      },
      tex: [String.raw`e=\sum_{k=0}^{\infty}\frac{1}{k!}`, String.raw`e=\lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '단계 수 n', en: 'Steps n' }, min: 1, max: 30, step: 1, init: 10 }],
      problems: [
        {
          id: 'irrational',
          statement: {
            ko: String.raw`\(e\)가 무리수임을 증명하세요.`,
            en: String.raw`Prove that \(e\) is irrational.`,
          },
          display: [String.raw`0 < q!\left(e - \sum_{k=0}^{q}\frac{1}{k!}\right) < 1`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 급수는 이미 \(e\)에 \(3\times 10^{-8}\) 이내로 다가갑니다.`,
            en: String.raw`\(n = 10\): the series is already within \(3\times 10^{-8}\) of \(e\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`먼저 \(2 < e < 3\)입니다: \(e = \sum_{k=0}^{\infty}\frac{1}{k!} > 1+1 = 2\)이고, \(k \ge 1\)에서 \(k! \ge 2^{k-1}\)이므로 \(e < 1+1+\frac{1}{2}+\frac{1}{4}+\cdots = 3\)입니다. 따라서 \(e = \frac{p}{q}\)라면 \(q \ge 2\)입니다.`,
                en: String.raw`First, \(2 < e < 3\): \(e = \sum_{k=0}^{\infty}\frac{1}{k!} > 1+1 = 2\), and since \(k! \ge 2^{k-1}\) for \(k \ge 1\), \(e < 1+1+\frac{1}{2}+\frac{1}{4}+\cdots = 3\). So if \(e = \frac{p}{q}\) then \(q \ge 2\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(q!e = (q-1)!\,p\)는 정수이고, \(\sum_{k=0}^{q}\frac{q!}{k!}\)도 정수입니다. 꼬리를 \(T = q!\left(e - \sum_{k=0}^{q}\frac{1}{k!}\right)\)라 두면, \(T = \frac{1}{q+1}+\frac{1}{(q+1)(q+2)}+\cdots\)이므로 \(0 < T < \frac{1}{q+1}\left(1+\frac{1}{q+1}+\cdots\right) = \frac{1}{q} \le \frac{1}{2} < 1\)입니다.`,
                en: String.raw`\(q!e = (q-1)!\,p\) is an integer, and so is \(\sum_{k=0}^{q}\frac{q!}{k!}\). Put \(T = q!\left(e - \sum_{k=0}^{q}\frac{1}{k!}\right)\); then \(T = \frac{1}{q+1}+\frac{1}{(q+1)(q+2)}+\cdots\), so \(0 < T < \frac{1}{q+1}\left(1+\frac{1}{q+1}+\cdots\right) = \frac{1}{q} \le \frac{1}{2} < 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`그런데 \(q!e = \text{(정수)} + T\)이므로 \(q!e\)는 정수가 아닙니다 — 모순입니다. 따라서 \(e\)는 무리수입니다.`,
                en: String.raw`But \(q!e = \text{(integer)} + T\) with \(0 < T < 1\) is not an integer — a contradiction. Hence \(e\) is irrational.`,
              },
            },
          ],
        },
        {
          id: 'remainder',
          statement: {
            ko: String.raw`나머지 추정 \(R_n = \sum_{k>n}\frac{1}{k!} < \frac{1}{n\cdot n!}\)을 증명하세요.`,
            en: String.raw`Prove the remainder bound \(R_n = \sum_{k>n}\frac{1}{k!} < \frac{1}{n\cdot n!}\).`,
          },
          display: [String.raw`R_n < \frac{1}{(n+1)!}\left(1+\frac{1}{n+1}+\frac{1}{(n+1)^2}+\cdots\right)=\frac{1}{n\cdot n!}`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 실제 나머지 \(\approx 2.73\times 10^{-8}\), 한계 \(\approx 2.76\times 10^{-8}\).`,
            en: String.raw`\(n = 10\): actual remainder \(\approx 2.73\times 10^{-8}\), bound \(\approx 2.76\times 10^{-8}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(R_n = \frac{1}{(n+1)!}+\frac{1}{(n+2)!}+\cdots = \frac{1}{(n+1)!}\left(1+\frac{1}{n+2}+\frac{1}{(n+2)(n+3)}+\cdots\right)\)입니다.`,
                en: String.raw`\(R_n = \frac{1}{(n+1)!}+\frac{1}{(n+2)!}+\cdots = \frac{1}{(n+1)!}\left(1+\frac{1}{n+2}+\frac{1}{(n+2)(n+3)}+\cdots\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`괄호 안은 \(1+\frac{1}{n+1}+\frac{1}{(n+1)^2}+\cdots = \frac{n+1}{n}\)보다 작습니다 (기하급수).`,
                en: String.raw`The bracket is less than \(1+\frac{1}{n+1}+\frac{1}{(n+1)^2}+\cdots = \frac{n+1}{n}\) (geometric series).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(R_n < \frac{1}{(n+1)!}\cdot\frac{n+1}{n} = \frac{1}{n\cdot n!}\)입니다. 팩토리얼 급수가 압도적으로 빠른 이유가 바로 이 추정입니다.`,
                en: String.raw`Hence \(R_n < \frac{1}{(n+1)!}\cdot\frac{n+1}{n} = \frac{1}{n\cdot n!}\). This estimate is exactly why the factorial series wins by a landslide.`,
              },
            },
          ],
        },
        {
          id: 'compound',
          statement: {
            ko: String.raw`\(\left(1+\frac{1}{n}\right)^n\)이 \(e\) 아래에서 증가함을 보이세요. (단조성의 엄밀한 증명은 생략하고 아이디어 수준으로 짚습니다.)`,
            en: String.raw`Show \(\left(1+\frac{1}{n}\right)^n\) increases toward \(e\) from below. (Monotonicity is sketched at idea level.)`,
          },
          display: [String.raw`\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\frac{1}{k!}\prod_{j=0}^{k-1}\left(1-\frac{j}{n}\right) < e`],
          preset: { n: 30 },
          presetCaption: {
            ko: String.raw`\(n = 30\): 복리 길은 \(e\)에 한참 못 미칩니다.`,
            en: String.raw`\(n = 30\): the compounding road is still far below \(e\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`이항정리로 \(\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\binom{n}{k}\frac{1}{n^k} = \sum_{k=0}^{n}\frac{1}{k!}(1)\left(1-\frac{1}{n}\right)\cdots\left(1-\frac{k-1}{n}\right)\)입니다.`,
                en: String.raw`By the binomial theorem, \(\left(1+\frac{1}{n}\right)^n = \sum_{k=0}^{n}\binom{n}{k}\frac{1}{n^k} = \sum_{k=0}^{n}\frac{1}{k!}(1)\left(1-\frac{1}{n}\right)\cdots\left(1-\frac{k-1}{n}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`각 인자 \(\left(1-\frac{j}{n}\right) < 1\)이므로, \(\left(1+\frac{1}{n}\right)^n < \sum_{k=0}^{n}\frac{1}{k!} < e\)입니다.`,
                en: String.raw`Each factor \(\left(1-\frac{j}{n}\right) < 1\), so \(\left(1+\frac{1}{n}\right)^n < \sum_{k=0}^{n}\frac{1}{k!} < e\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n\)이 커지면 인자 \(\left(1-\frac{j}{n}\right)\)들이 \(1\)에 가까워지므로 수열은 증가합니다 (엄밀한 단조성 증명은 생략합니다 — 아이디어 수준).`,
                en: String.raw`As \(n\) grows, the factors \(\left(1-\frac{j}{n}\right)\) approach \(1\), so the sequence increases (the rigorous monotonicity proof is omitted — idea level).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'telescoping',
      title: { ko: '망원급수', en: 'Telescoping Series' },
      order: 5,
      summary: {
        ko: String.raw`각 항을 \(\frac{1}{n} - \frac{1}{n+1}\)로 쪼개면 이웃끼리 서로 지워지고 처음의 1과 사라져 가는 꼬리만 남는 모습을 확인합니다.`,
        en: String.raw`Split each term into \(\frac{1}{n} - \frac{1}{n+1}\) and the neighbors cancel each other, leaving only the very first 1 and a vanishing tail.`,
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=1`,
        String.raw`\frac{1}{n(n+1)}=\frac{1}{n}-\frac{1}{n+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 24, step: 1, init: 10 }],
      problems: [
        {
          id: 'partial-sums',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{N}\frac{1}{n(n+1)} = \frac{N}{N+1}\)임을 증명하고, 급수의 합이 \(1\)임을 보이세요.`,
            en: String.raw`Prove \(\sum_{n=1}^{N}\frac{1}{n(n+1)} = \frac{N}{N+1}\), so the series sums to \(1\).`,
          },
          display: [String.raw`S_N = \left(1-\frac{1}{2}\right)+\left(\frac{1}{2}-\frac{1}{3}\right)+\cdots+\left(\frac{1}{N}-\frac{1}{N+1}\right) = 1-\frac{1}{N+1}`],
          preset: { n: 24 },
          presetCaption: {
            ko: String.raw`\(N = 24\): \(S_{24} = 24/25 = 0.96\), 꼬리 \(1/25\)만 남습니다.`,
            en: String.raw`\(N = 24\): \(S_{24} = 24/25 = 0.96\), only the tail \(1/25\) remains.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\frac{1}{n(n+1)} = \frac{1}{n}-\frac{1}{n+1}\)입니다 (통분하면 확인됩니다).`,
                en: String.raw`\(\frac{1}{n(n+1)} = \frac{1}{n}-\frac{1}{n+1}\) (check by clearing denominators).`,
              },
            },
            {
              text: {
                ko: String.raw`합하면 이웃 항이 소거됩니다: \(S_N = 1 - \frac{1}{N+1} = \frac{N}{N+1}\).`,
                en: String.raw`Summing telescopes the neighbors away: \(S_N = 1 - \frac{1}{N+1} = \frac{N}{N+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N \to \infty\)에서 \(\frac{1}{N+1} \to 0\)이므로 급수의 합은 \(1\)입니다.`,
                en: String.raw`As \(N \to \infty\), \(\frac{1}{N+1} \to 0\), so the series sums to \(1\).`,
              },
            },
          ],
        },
        {
          id: 'shifted',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\frac{1}{n(n+2)} = \frac{3}{4}\)를 증명하세요.`,
            en: String.raw`Prove \(\sum_{n=1}^{\infty}\frac{1}{n(n+2)} = \frac{3}{4}\).`,
          },
          display: [String.raw`\frac{1}{n(n+2)}=\frac{1}{2}\left(\frac{1}{n}-\frac{1}{n+2}\right)`],
          preset: { n: 24 },
          presetCaption: {
            ko: String.raw`이웃이 아닌 두 칸 건너 항이 소거됩니다.`,
            en: String.raw`Cancellation skips one neighbor this time.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`부분분수: \(\frac{1}{n(n+2)} = \frac{1}{2}\left(\frac{1}{n}-\frac{1}{n+2}\right)\)입니다.`,
                en: String.raw`Partial fractions: \(\frac{1}{n(n+2)} = \frac{1}{2}\left(\frac{1}{n}-\frac{1}{n+2}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(S_N = \frac{1}{2}\left[\left(1+\frac{1}{2}+\cdots+\frac{1}{N}\right)-\left(\frac{1}{3}+\cdots+\frac{1}{N+2}\right)\right] = \frac{1}{2}\left(1+\frac{1}{2}-\frac{1}{N+1}-\frac{1}{N+2}\right)\)입니다.`,
                en: String.raw`\(S_N = \frac{1}{2}\left[\left(1+\frac{1}{2}+\cdots+\frac{1}{N}\right)-\left(\frac{1}{3}+\cdots+\frac{1}{N+2}\right)\right] = \frac{1}{2}\left(1+\frac{1}{2}-\frac{1}{N+1}-\frac{1}{N+2}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N \to \infty\)에서 꼬리가 사라져 \(\frac{1}{2}\cdot\frac{3}{2} = \frac{3}{4}\)가 됩니다.`,
                en: String.raw`As \(N \to \infty\) the tail vanishes, leaving \(\frac{1}{2}\cdot\frac{3}{2} = \frac{3}{4}\).`,
              },
            },
          ],
        },
        {
          id: 'sqrt-diverges',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\left(\sqrt{n+1}-\sqrt{n}\right)\)이 발산함을 보이세요.`,
            en: String.raw`Show \(\sum_{n=1}^{\infty}\left(\sqrt{n+1}-\sqrt{n}\right)\) diverges.`,
          },
          display: [String.raw`S_N = \sqrt{N+1}-1 \to \infty`],
          preset: { n: 24 },
          presetCaption: {
            ko: String.raw`망원합이지만, 소거 후 남는 것이 무한대로 갑니다.`,
            en: String.raw`Telescoping — but the survivor goes to infinity.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S_N = (\sqrt{2}-\sqrt{1})+(\sqrt{3}-\sqrt{2})+\cdots+(\sqrt{N+1}-\sqrt{N}) = \sqrt{N+1}-1\)입니다.`,
                en: String.raw`\(S_N = (\sqrt{2}-\sqrt{1})+(\sqrt{3}-\sqrt{2})+\cdots+(\sqrt{N+1}-\sqrt{N}) = \sqrt{N+1}-1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sqrt{N+1} \to \infty\)이므로 부분합은 유계가 아닙니다.`,
                en: String.raw`Since \(\sqrt{N+1} \to \infty\), the partial sums are unbounded.`,
              },
            },
            {
              text: {
                ko: String.raw`망원합이라고 항상 수렴하는 것은 아닙니다 — 소거 후 남는 항이 \(0\)으로 가야 수렴합니다.`,
                en: String.raw`Telescoping does not always converge — the surviving term must tend to \(0\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'geometric',
      title: { ko: '기하급수: 정사각형 채우기', en: 'Geometric Series: Filling the Square' },
      order: 6,
      summary: {
        ko: '단위 정사각형을 남은 부분의 절반씩 채워 나가면 빈틈이 매 단계 절반으로 줄며 합이 1이 되는 모습을 확인합니다.',
        en: 'Fill a unit square by always taking half of what remains: the gap halves at every step and the total becomes 1.',
      },
      tex: [String.raw`\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots=1`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 단계 n', en: 'Subdivision steps n' }, min: 1, max: 12, step: 1, init: 6 }],
      problems: [
        {
          id: 'finite-formula',
          statement: {
            ko: String.raw`\(S_N = 1+r+\cdots+r^N = \frac{1-r^{N+1}}{1-r}\) (\(r \ne 1\))를 증명하고, \(|r| < 1\)일 때 \(\frac{1}{1-r}\)로 수렴함을 보이세요.`,
            en: String.raw`Prove \(S_N = 1+r+\cdots+r^N = \frac{1-r^{N+1}}{1-r}\) (\(r \ne 1\)), and convergence to \(\frac{1}{1-r}\) for \(|r| < 1\).`,
          },
          display: [String.raw`S_N - rS_N = 1 - r^{N+1}`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`\(r = \frac{1}{2}\): 빈틈 \((1/2)^{12}\)만 남습니다.`,
            en: String.raw`\(r = \frac{1}{2}\): only the gap \((1/2)^{12}\) remains.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S_N - rS_N = (1+r+\cdots+r^N) - (r+\cdots+r^{N+1}) = 1-r^{N+1}\)입니다. 중간 항이 모두 소거됩니다.`,
                en: String.raw`\(S_N - rS_N = (1+r+\cdots+r^N) - (r+\cdots+r^{N+1}) = 1-r^{N+1}\). Everything in the middle cancels.`,
              },
            },
            {
              text: {
                ko: String.raw`\(r \ne 1\)이면 \(S_N = \frac{1-r^{N+1}}{1-r}\)입니다.`,
                en: String.raw`If \(r \ne 1\), \(S_N = \frac{1-r^{N+1}}{1-r}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|r| < 1\)이면 \(r^{N+1} \to 0\)이므로 \(S_N \to \frac{1}{1-r}\)입니다.`,
                en: String.raw`If \(|r| < 1\), \(r^{N+1} \to 0\), so \(S_N \to \frac{1}{1-r}\).`,
              },
            },
          ],
        },
        {
          id: 'nine-nines',
          statement: {
            ko: String.raw`\(0.999\cdots = 1\)임을 기하급수로 증명하세요.`,
            en: String.raw`Prove \(0.999\ldots = 1\) via the geometric series.`,
          },
          display: [String.raw`0.999\cdots = 9\sum_{k=1}^{\infty}\left(\frac{1}{10}\right)^k = 9\cdot\frac{1/10}{1-1/10} = 1`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`같은 대수, \(r = \frac{1}{10}\) 버전입니다.`,
            en: String.raw`The same algebra with \(r = \frac{1}{10}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(0.999\cdots = \frac{9}{10}+\frac{9}{100}+\cdots = 9\sum_{k=1}^{\infty}\left(\frac{1}{10}\right)^k\)입니다.`,
                en: String.raw`\(0.999\cdots = \frac{9}{10}+\frac{9}{100}+\cdots = 9\sum_{k=1}^{\infty}\left(\frac{1}{10}\right)^k\).`,
              },
            },
            {
              text: {
                ko: String.raw`앞 문제의 공식에 \(r = \frac{1}{10}\): 합 \(= 9\cdot\frac{1/10}{1-1/10} = 9\cdot\frac{1}{9} = 1\)입니다.`,
                en: String.raw`By the previous formula with \(r = \frac{1}{10}\): the sum \(= 9\cdot\frac{1/10}{1-1/10} = 9\cdot\frac{1}{9} = 1\).`,
              },
            },
          ],
        },
        {
          id: 'n-over-2n',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty}\frac{n}{2^n} = 2\)를 \(S - \frac{S}{2}\) 트릭으로 증명하세요.`,
            en: String.raw`Prove \(\sum_{n=1}^{\infty}\frac{n}{2^n} = 2\) with the \(S - \frac{S}{2}\) trick.`,
          },
          display: [String.raw`S - \frac{S}{2} = \sum_{n=1}^{\infty}\frac{1}{2^n} = 1`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`가중치가 붙어도 같은 아이디어가 통합니다.`,
            en: String.raw`The same idea works with weights attached.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(S = \sum_{n=1}^{\infty}\frac{n}{2^n}\)라 두면, \(\frac{S}{2} = \sum_{n=1}^{\infty}\frac{n}{2^{n+1}} = \sum_{n=2}^{\infty}\frac{n-1}{2^n}\)입니다 (지표 이동).`,
                en: String.raw`Put \(S = \sum_{n=1}^{\infty}\frac{n}{2^n}\). Then \(\frac{S}{2} = \sum_{n=1}^{\infty}\frac{n}{2^{n+1}} = \sum_{n=2}^{\infty}\frac{n-1}{2^n}\) (reindexing).`,
              },
            },
            {
              text: {
                ko: String.raw`절대수렴하므로 항별 뺄셈이 정당합니다: \(S-\frac{S}{2} = \frac{1}{2}+\sum_{n=2}^{\infty}\frac{1}{2^n} = \sum_{n=1}^{\infty}\frac{1}{2^n} = 1\).`,
                en: String.raw`Absolute convergence justifies termwise subtraction: \(S-\frac{S}{2} = \frac{1}{2}+\sum_{n=2}^{\infty}\frac{1}{2^n} = \sum_{n=1}^{\infty}\frac{1}{2^n} = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\frac{S}{2} = 1\), 즉 \(S = 2\)입니다.`,
                en: String.raw`Hence \(\frac{S}{2} = 1\), i.e. \(S = 2\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'wallis',
      title: { ko: '월리스 곱', en: 'Wallis Product' },
      order: 7,
      summary: {
        ko: String.raw`유리수 인수들을 하나씩 곱해 나갈수록 실행 곱이 \(\frac{\pi}{2}\) 위아래로 흔들리며 조여드는 모습을 확인합니다.`,
        en: String.raw`Multiply the rational factors in one at a time and watch the running product swing above and below \(\frac{\pi}{2}\), closing in as the swings shrink.`,
      },
      tex: [String.raw`\frac{\pi}{2}=\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '인수 쌍의 수 n', en: 'Factor pairs n' }, min: 1, max: 40, step: 1, init: 12 }],
      problems: [
        {
          id: 'reduction',
          statement: {
            ko: String.raw`\(I_n = \int_0^{\pi/2}\sin^n x\,dx\)가 점화식 \(I_n = \frac{n-1}{n}I_{n-2}\)를 만족함을 부분적분으로 증명하세요.`,
            en: String.raw`Prove \(I_n = \int_0^{\pi/2}\sin^n x\,dx\) satisfies \(I_n = \frac{n-1}{n}I_{n-2}\) by integration by parts.`,
          },
          display: [String.raw`I_n = \frac{n-1}{n}I_{n-2}, \qquad I_0=\frac{\pi}{2},\ I_1=1`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`이 점화식이 월리스 곱의 엔진입니다.`,
            en: String.raw`This recurrence is the engine of the Wallis product.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(I_n = \int_0^{\pi/2}\sin^{n-1}x\cdot\sin x\,dx\)에서 \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\)로 부분적분하면, \(I_n = \left[-\cos x\sin^{n-1}x\right]_0^{\pi/2} + (n-1)\int_0^{\pi/2}\cos^2x\sin^{n-2}x\,dx\)입니다.`,
                en: String.raw`Write \(I_n = \int_0^{\pi/2}\sin^{n-1}x\cdot\sin x\,dx\) and integrate by parts with \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\): \(I_n = \left[-\cos x\sin^{n-1}x\right]_0^{\pi/2} + (n-1)\int_0^{\pi/2}\cos^2x\sin^{n-2}x\,dx\).`,
              },
            },
            {
              text: {
                ko: String.raw`경계항은 \(n \ge 2\)에서 \(0\)입니다. \(\cos^2x = 1-\sin^2x\)이므로 \(I_n = (n-1)(I_{n-2}-I_n)\)입니다.`,
                en: String.raw`The boundary term vanishes for \(n \ge 2\). Since \(\cos^2x = 1-\sin^2x\), \(I_n = (n-1)(I_{n-2}-I_n)\).`,
              },
            },
            {
              text: {
                ko: String.raw`정리하면 \(nI_n = (n-1)I_{n-2}\), 즉 \(I_n = \frac{n-1}{n}I_{n-2}\)입니다. (\(I_0 = \frac{\pi}{2}\), \(I_1 = 1\).)`,
                en: String.raw`Rearranging, \(nI_n = (n-1)I_{n-2}\), i.e. \(I_n = \frac{n-1}{n}I_{n-2}\). (With \(I_0 = \frac{\pi}{2}\) and \(I_1 = 1\).)`,
              },
            },
          ],
        },
        {
          id: 'to-wallis',
          statement: {
            ko: String.raw`\(0 \le x \le \frac{\pi}{2}\)에서 \(\sin^{2n+1}x \le \sin^{2n}x \le \sin^{2n-1}x\)임을 이용해 \(\frac{I_{2n}}{I_{2n+1}} \to 1\)을 보이고, 월리스 곱을 유도하세요.`,
            en: String.raw`From \(\sin^{2n+1}x \le \sin^{2n}x \le \sin^{2n-1}x\) on \([0,\frac{\pi}{2}]\), show \(\frac{I_{2n}}{I_{2n+1}} \to 1\) and derive the Wallis product.`,
          },
          display: [String.raw`\frac{I_{2n}}{I_{2n+1}} = \frac{\pi}{2}\prod_{k=1}^{n}\frac{(2k-1)(2k+1)}{(2k)^2} = \frac{\pi/2}{W_n} \to 1`],
          preset: { n: 12 },
          presetCaption: {
            ko: String.raw`조임 정리 한 번으로 곱이 \(\pi/2\)로 갑니다.`,
            en: String.raw`One squeeze sends the product to \(\pi/2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`적분하면 \(I_{2n+1} \le I_{2n} \le I_{2n-1}\)이므로, \(1 \le \frac{I_{2n}}{I_{2n+1}} \le \frac{I_{2n-1}}{I_{2n+1}} = \frac{2n+1}{2n} \to 1\)입니다. 조임 정리로 \(\frac{I_{2n}}{I_{2n+1}} \to 1\)입니다.`,
                en: String.raw`Integrating gives \(I_{2n+1} \le I_{2n} \le I_{2n-1}\), so \(1 \le \frac{I_{2n}}{I_{2n+1}} \le \frac{I_{2n-1}}{I_{2n+1}} = \frac{2n+1}{2n} \to 1\). By the squeeze theorem, \(\frac{I_{2n}}{I_{2n+1}} \to 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`앞 문제의 점화식을 반복 적용하면 \(I_{2n} = \frac{\pi}{2}\prod_{k=1}^{n}\frac{2k-1}{2k}\), \(I_{2n+1} = \prod_{k=1}^{n}\frac{2k}{2k+1}\)입니다. 나누면 \(\frac{I_{2n}}{I_{2n+1}} = \frac{\pi}{2}\prod_{k=1}^{n}\frac{(2k-1)(2k+1)}{(2k)^2} = \frac{\pi/2}{W_n}\)입니다.`,
                en: String.raw`Iterating the recurrence, \(I_{2n} = \frac{\pi}{2}\prod_{k=1}^{n}\frac{2k-1}{2k}\) and \(I_{2n+1} = \prod_{k=1}^{n}\frac{2k}{2k+1}\). Dividing, \(\frac{I_{2n}}{I_{2n+1}} = \frac{\pi}{2}\prod_{k=1}^{n}\frac{(2k-1)(2k+1)}{(2k)^2} = \frac{\pi/2}{W_n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`좌변이 \(1\)로 가므로 \(W_n \to \frac{\pi}{2}\), 즉 \(\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)} = \frac{\pi}{2}\)입니다.`,
                en: String.raw`Since the left side tends to \(1\), \(W_n \to \frac{\pi}{2}\), i.e. \(\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)} = \frac{\pi}{2}\).`,
              },
            },
          ],
        },
        {
          id: 'numerics',
          statement: {
            ko: String.raw`\(P_5 = \prod_{n=1}^{5}\frac{(2n)^2}{(2n-1)(2n+1)}\)를 정확한 분수로 계산하고 \(\frac{\pi}{2}\)와 비교하세요.`,
            en: String.raw`Compute \(P_5 = \prod_{n=1}^{5}\frac{(2n)^2}{(2n-1)(2n+1)}\) exactly as a fraction and compare with \(\frac{\pi}{2}\).`,
          },
          display: [String.raw`P_5 = \frac{65536}{43659} \approx 1.50109`],
          preset: { n: 5 },
          presetCaption: {
            ko: String.raw`\(n = 5\): 아직 \(\pi/2 \approx 1.57080\)에 못 미칩니다.`,
            en: String.raw`\(n = 5\): still short of \(\pi/2 \approx 1.57080\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(P_5 = \frac{2^2}{1\cdot3}\cdot\frac{4^2}{3\cdot5}\cdot\frac{6^2}{5\cdot7}\cdot\frac{8^2}{7\cdot9}\cdot\frac{10^2}{9\cdot11} = \frac{65536}{43659} \approx 1.50109\)입니다.`,
                en: String.raw`\(P_5 = \frac{2^2}{1\cdot3}\cdot\frac{4^2}{3\cdot5}\cdot\frac{6^2}{5\cdot7}\cdot\frac{8^2}{7\cdot9}\cdot\frac{10^2}{9\cdot11} = \frac{65536}{43659} \approx 1.50109\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\frac{\pi}{2} \approx 1.57080\)이므로 오차는 약 \(0.0697\)입니다.`,
                en: String.raw`Since \(\frac{\pi}{2} \approx 1.57080\), the error is about \(0.0697\).`,
              },
            },
            {
              text: {
                ko: String.raw`수렴이 느립니다 — 다섯 개 항으로는 7% 오차입니다. (정확한 분수 계산은 테스트로 검증했습니다.)`,
                en: String.raw`Convergence is slow — five factors still leave a 7% error. (The exact fraction is verified by test.)`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'stirling',
      title: { ko: '스털링 근사', en: "Stirling's Approximation" },
      order: 8,
      summary: {
        ko: String.raw`로그 눈금에서 \(n!\)와 스털링 근사가 거의 겹쳐지고 상대오차가 대략 \(\frac{1}{12n}\)으로 줄어드는 모습을 확인합니다. \(\pi\)가 들어오는 경로는 아이디어 수준에서만 짚습니다.`,
        en: String.raw`On a log scale, \(n!\) and the Stirling approximation nearly coincide, and the relative error shrinks like \(\frac{1}{12n}\). Where \(\pi\) enters is only sketched at the idea level.`,
      },
      tex: [String.raw`n!\approx\sqrt{2\pi n}\left(\frac{n}{e}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 20 }],
      problems: [
        {
          id: 'check-10',
          statement: {
            ko: String.raw`\(n = 10\)에서 스털링 근사의 상대오차를 직접 계산하고 \(\frac{1}{120}\)과 비교하세요. (수치 확인이지 증명이 아닙니다.)`,
            en: String.raw`Compute the relative error of Stirling's formula at \(n = 10\) and compare with \(\frac{1}{120}\). (A numerical check, not a proof.)`,
          },
          display: [String.raw`\frac{|S(10)-10!|}{10!} \approx 0.008296 \approx \frac{1}{120}`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 로그 눈금에서 두 곡선이 겹칩니다.`,
            en: String.raw`\(n = 10\): the two curves overlap on the log scale.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(10! = 3628800\)입니다. \(S(10) = \sqrt{20\pi}\left(\frac{10}{e}\right)^{10} \approx 3598695.62\)입니다.`,
                en: String.raw`\(10! = 3628800\). \(S(10) = \sqrt{20\pi}\left(\frac{10}{e}\right)^{10} \approx 3598695.62\).`,
              },
            },
            {
              text: {
                ko: String.raw`상대오차 \(= \frac{3628800-3598695.62}{3628800} \approx 0.008296\)입니다.`,
                en: String.raw`The relative error \(= \frac{3628800-3598695.62}{3628800} \approx 0.008296\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\frac{1}{12\cdot 10} = \frac{1}{120} \approx 0.008333\) — 주장과 일치합니다. (수치 확인이며, 오차 공식 자체의 증명은 아닙니다.)`,
                en: String.raw`\(\frac{1}{12\cdot 10} = \frac{1}{120} \approx 0.008333\) — matching the claim. (This is a numerical check, not a proof of the error formula.)`,
              },
            },
          ],
        },
        {
          id: 'log-integral',
          statement: {
            ko: String.raw`\(\ln(n!) = \sum_{k=1}^{n}\ln k\)를 \(\int_1^n \ln x\,dx\)와 비교하는 그림을 설명하세요. (아이디어 수준.)`,
            en: String.raw`Explain the picture comparing \(\ln(n!) = \sum_{k=1}^{n}\ln k\) with \(\int_1^n \ln x\,dx\). (Idea level.)`,
          },
          display: [String.raw`\sum_{k=1}^{n}\ln k \approx \int_1^n \ln x\,dx = n\ln n - n + 1`],
          preset: { n: 30 },
          presetCaption: {
            ko: String.raw`막대들의 합과 곡선 아래 넓이는 어슷비슷합니다.`,
            en: String.raw`The sum of the bars and the area under the curve are close.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\ln(n!) = \sum_{k=1}^{n}\ln k\)는 \(y = \ln x\) 그래프 아래에 세운 막대들의 넓이 합입니다.`,
                en: String.raw`\(\ln(n!) = \sum_{k=1}^{n}\ln k\) is the total area of bars under the graph of \(y = \ln x\).`,
              },
            },
            {
              text: {
                ko: String.raw`적분 \(\int_1^n \ln x\,dx = n\ln n - n + 1\)은 곡선 아래 넓이 — 막대 합과 어슷비슷합니다.`,
                en: String.raw`The integral \(\int_1^n \ln x\,dx = n\ln n - n + 1\) is the area under the curve — close to the bar sum.`,
              },
            },
            {
              text: {
                ko: String.raw`둘의 차이가 \(\frac{1}{2}\ln(2\pi n)\) 정도로 벌어지는데, 그 보정에서 \(\sqrt{2\pi n}\)이 나옵니다. 엄밀한 유도는 생략합니다 — 아이디어 수준입니다.`,
                en: String.raw`The gap grows like \(\frac{1}{2}\ln(2\pi n)\), and that correction produces the \(\sqrt{2\pi n}\). The rigorous derivation is omitted — idea level.`,
              },
            },
          ],
        },
        {
          id: 'central-binomial',
          statement: {
            ko: String.raw`스털링 근사를 가정하고 \(\binom{2n}{n} \sim \frac{4^n}{\sqrt{\pi n}}\)을 유도하세요.`,
            en: String.raw`Assuming Stirling's formula, derive \(\binom{2n}{n} \sim \frac{4^n}{\sqrt{\pi n}}\).`,
          },
          display: [String.raw`\binom{2n}{n} = \frac{(2n)!}{(n!)^2} \sim \frac{\sqrt{4\pi n}\,(2n/e)^{2n}}{2\pi n\,(n/e)^{2n}} = \frac{4^n}{\sqrt{\pi n}}`],
          preset: { n: 20 },
          presetCaption: {
            ko: String.raw`가운데 이항계수는 \(4^n\)보다 \(\sqrt{\pi n}\)만큼 작습니다.`,
            en: String.raw`The central binomial coefficient is smaller than \(4^n\) by \(\sqrt{\pi n}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`분자에 스털링: \((2n)! \approx \sqrt{4\pi n}\left(\frac{2n}{e}\right)^{2n}\).`,
                en: String.raw`Stirling in the numerator: \((2n)! \approx \sqrt{4\pi n}\left(\frac{2n}{e}\right)^{2n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`분모: \((n!)^2 \approx 2\pi n\left(\frac{n}{e}\right)^{2n}\).`,
                en: String.raw`Denominator: \((n!)^2 \approx 2\pi n\left(\frac{n}{e}\right)^{2n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`나누면 \(\frac{\sqrt{4\pi n}}{2\pi n}\cdot\frac{(2n)^{2n}}{n^{2n}} = \frac{1}{\sqrt{\pi n}}\cdot 4^n\)입니다. (스털링 근사 자체는 가정했습니다.)`,
                en: String.raw`Dividing gives \(\frac{\sqrt{4\pi n}}{2\pi n}\cdot\frac{(2n)^{2n}}{n^{2n}} = \frac{1}{\sqrt{\pi n}}\cdot 4^n\). (Stirling's formula itself is assumed.)`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'grandi',
      title: { ko: '그란디 급수', en: 'Grandi Series' },
      order: 9,
      summary: {
        ko: String.raw`부분합이 1과 0을 영원히 오가므로 이 급수에는 합이 없습니다. \(\frac{1}{2}\)는 부분합들의 평균(체사로 평균)일 뿐, 급수의 합이 아닙니다.`,
        en: String.raw`The partial sums bounce between 1 and 0 forever, so this series has no sum. \(\frac{1}{2}\) is only the average of the partial sums (the Cesàro mean), not a sum of the series.`,
      },
      tex: [String.raw`1-1+1-1+\cdots\quad\text{diverges}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 16 }],
      problems: [
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
      ],
    },
    {
      id: 'zeta4',
      title: { ko: 'ζ(4)와 짝수 거듭제곱', en: 'ζ(4) and Even Powers' },
      order: 10,
      summary: {
        ko: String.raw`\(\frac{1}{n^4}\)의 부분합이 \(\frac{\pi^4}{90}\)에 빠르게 닿는 모습과, 짝수 거듭제곱마다 \(\zeta\)값이 \(\pi\)의 거듭제곱으로 닫히는 패턴을 확인합니다.`,
        en: String.raw`The partial sums of \(\frac{1}{n^4}\) reach \(\frac{\pi^4}{90}\) quickly — and at every even power, the \(\zeta\) value closes into a power of \(\pi\).`,
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n^4}=\frac{\pi^4}{90}`,
        String.raw`\zeta(2)=\frac{\pi^2}{6},\quad \zeta(6)=\frac{\pi^6}{945}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 20, step: 1, init: 8 }],
      problems: [
        {
          id: 'odd-terms',
          statement: {
            ko: String.raw`\(\sum_{k=0}^{\infty}\frac{1}{(2k+1)^4} = \frac{\pi^4}{96}\)을 \(\zeta(4)\)로부터 유도하세요.`,
            en: String.raw`Derive \(\sum_{k=0}^{\infty}\frac{1}{(2k+1)^4} = \frac{\pi^4}{96}\) from \(\zeta(4)\).`,
          },
          display: [String.raw`\sum_{\mathrm{odd}}\frac{1}{n^4}=\zeta(4)-\frac{1}{16}\zeta(4)=\frac{15}{16}\cdot\frac{\pi^4}{90}=\frac{\pi^4}{96}`],
          preset: { n: 8 },
          presetCaption: {
            ko: String.raw`짝수 항을 빼면 홀수 항만 남습니다.`,
            en: String.raw`Removing the even terms leaves exactly the odd ones.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`짝수 항: \(\sum_{n=1}^{\infty}\frac{1}{(2n)^4} = \frac{1}{16}\sum_{n=1}^{\infty}\frac{1}{n^4} = \frac{1}{16}\zeta(4)\)입니다.`,
                en: String.raw`Even terms: \(\sum_{n=1}^{\infty}\frac{1}{(2n)^4} = \frac{1}{16}\sum_{n=1}^{\infty}\frac{1}{n^4} = \frac{1}{16}\zeta(4)\).`,
              },
            },
            {
              text: {
                ko: String.raw`홀수 항 = 전체 − 짝수 항 \(= \zeta(4)-\frac{1}{16}\zeta(4) = \frac{15}{16}\zeta(4)\)입니다. (양항급수이므로 재배열이 정당합니다.)`,
                en: String.raw`Odd terms = whole − even \(= \zeta(4)-\frac{1}{16}\zeta(4) = \frac{15}{16}\zeta(4)\). (Rearranging a positive-term series is legitimate.)`,
              },
            },
            {
              text: {
                ko: String.raw`\(\frac{15}{16}\cdot\frac{\pi^4}{90} = \frac{\pi^4}{96}\)입니다.`,
                en: String.raw`\(\frac{15}{16}\cdot\frac{\pi^4}{90} = \frac{\pi^4}{96}\).`,
              },
            },
          ],
        },
        {
          id: 'tail-bound',
          statement: {
            ko: String.raw`꼬리 \(R_N = \sum_{n>N}\frac{1}{n^4}\)에 대해 \(R_N < \frac{1}{3N^3}\)을 적분 비교로 증명하세요.`,
            en: String.raw`Prove \(R_N = \sum_{n>N}\frac{1}{n^4} < \frac{1}{3N^3}\) by integral comparison.`,
          },
          display: [String.raw`R_N < \int_{N}^{\infty}\frac{dx}{x^4} = \frac{1}{3N^3}`],
          preset: { n: 8 },
          presetCaption: {
            ko: String.raw`\(N = 8\): 실제 꼬리 \(\approx 0.000539 < 1/1536 \approx 0.000651\).`,
            en: String.raw`\(N = 8\): actual tail \(\approx 0.000539 < 1/1536 \approx 0.000651\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = \frac{1}{x^4}\)는 감소함수이므로, \(n \ge 2\)에서 \(\frac{1}{n^4} \le \int_{n-1}^{n}\frac{dx}{x^4}\)입니다.`,
                en: String.raw`\(f(x) = x^{-4}\) is decreasing, so for \(n \ge 2\), \(\frac{1}{n^4} \le \int_{n-1}^{n}\frac{dx}{x^4}\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(R_N \le \sum_{n>N}\int_{n-1}^{n}\frac{dx}{x^4} = \int_{N}^{\infty}\frac{dx}{x^4} = \frac{1}{3N^3}\)입니다.`,
                en: String.raw`Hence \(R_N \le \sum_{n>N}\int_{n-1}^{n}\frac{dx}{x^4} = \int_{N}^{\infty}\frac{dx}{x^4} = \frac{1}{3N^3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N = 8\)이면 한계는 \(\frac{1}{1536} \approx 0.000651\) — 실제 꼬리 \(0.000539\)와 부합합니다.`,
                en: String.raw`For \(N = 8\) the bound is \(\frac{1}{1536} \approx 0.000651\) — consistent with the actual tail \(0.000539\).`,
              },
            },
          ],
        },
        {
          id: 'even-pattern',
          statement: {
            ko: String.raw`\(\zeta(2)=\frac{\pi^2}{6}\), \(\zeta(4)=\frac{\pi^4}{90}\), \(\zeta(6)=\frac{\pi^6}{945}\)를 베르누이 수 공식으로 확인하세요. (공식 자체는 알려진 결과로 둡니다.)`,
            en: String.raw`Check \(\zeta(2)=\frac{\pi^2}{6}\), \(\zeta(4)=\frac{\pi^4}{90}\), \(\zeta(6)=\frac{\pi^6}{945}\) against the Bernoulli-number formula. (The formula itself is taken as known.)`,
          },
          display: [String.raw`\zeta(2n) = \frac{(-1)^{n+1}B_{2n}(2\pi)^{2n}}{2(2n)!}`],
          preset: { n: 8 },
          presetCaption: {
            ko: String.raw`짝수 제타값은 모두 \(\pi\)의 거듭제곱 꼴입니다.`,
            en: String.raw`Every even zeta value is a power of \(\pi\) over an integer.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`베르누이 수 \(B_2 = \frac{1}{6}\), \(B_4 = -\frac{1}{30}\), \(B_6 = \frac{1}{42}\)를 공식에 대입하면 세 값이 정확히 나옵니다. 예를 들어 \(n = 2\): \(\frac{(-1)^3 B_4 (2\pi)^4}{2\cdot 4!} = \frac{(1/30)\cdot 16\pi^4}{48} = \frac{\pi^4}{90}\)입니다.`,
                en: String.raw`Substituting \(B_2 = \frac{1}{6}\), \(B_4 = -\frac{1}{30}\), \(B_6 = \frac{1}{42}\) into the formula gives all three values exactly. For \(n = 2\): \(\frac{(-1)^3 B_4 (2\pi)^4}{2\cdot 4!} = \frac{(1/30)\cdot 16\pi^4}{48} = \frac{\pi^4}{90}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\zeta(3)\) (아페리 상수)는 이런 꼴이 없습니다 — 짝수만의 패턴입니다.`,
                en: String.raw`\(\zeta(3)\) (Apéry's constant) has no such form — the pattern is for even arguments only.`,
              },
            },
            {
              text: {
                ko: String.raw`공식 자체의 증명은 여기서 다루지 않습니다 — 알려진 결과로 둡니다.`,
                en: String.raw`The proof of the formula is not covered here — it is taken as a known result.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'rearrangement',
      title: { ko: '재배열 정리', en: 'Rearranging Changes the Sum' },
      order: 11,
      summary: {
        ko: String.raw`조건수렴 급수는 순서를 바꾸면 합이 바뀝니다 — \(\ln 2 \approx 0.6931\)이 \(\frac{3}{2}\ln 2 \approx 1.0397\)로. 라이프니츠 장면의 짝꿍입니다.`,
        en: String.raw`Reordering a conditionally convergent series changes its sum — \(\ln 2 \approx 0.6931\) becomes \(\frac{3}{2}\ln 2 \approx 1.0397\). Twin of the Leibniz scene.`,
      },
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n} = \ln 2 \xrightarrow{(+,+,-)} \frac{3}{2}\ln 2`],
      prerequisites: ['leibniz'],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항 개수', en: 'Terms' }, min: 6, max: 300, step: 1, init: 60 }],
      problems: [
        {
          id: 'ppn-numerical',
          statement: {
            ko: String.raw`\((+,+,-)\) 재배열의 부분합이 \(\frac{3}{2}\ln 2 \approx 1.0397\)로 수렴함을 수치로 확인하세요. (수치 확인 — 엄밀한 증명은 생략합니다.)`,
            en: String.raw`Verify numerically that the \((+,+,-)\) rearrangement's partial sums tend to \(\frac{3}{2}\ln 2 \approx 1.0397\). (Numerical check; rigorous proof omitted.)`,
          },
          display: [String.raw`\frac{3}{2}\ln 2 \approx 1.03972`],
          preset: { n: 150 },
          presetCaption: {
            ko: String.raw`\(n=150\): 재배열 부분합이 \(1.0397\) 근처에 안착합니다.`,
            en: String.raw`\(n=150\): the rearranged partial sums settle near \(1.0397\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(n = 150\)에서 재배열 부분합 \(T_{150}\)을 직접 계산하면 목표값 \(\frac{3}{2}\ln 2 \approx 1.03972\)와 \(0.01\) 이내로 일치합니다 — \(|T_{150} - \frac{3}{2}\ln 2| \approx 0.0050\). (수치 확인)`,
                en: String.raw`Directly computing \(T_{150}\) gives \(|T_{150} - \frac{3}{2}\ln 2| \approx 0.0050 < 0.01\). (Numerical check)`,
              },
            },
            {
              text: {
                ko: String.raw`\(n = 300\)으로 늘리면 오차는 약 \(0.0025\)로 더 줄어듭니다 — 수렴 방향이 일관되므로 단순한 우연이 아닙니다.`,
                en: String.raw`Raising \(n\) to \(300\) shrinks the error to about \(0.0025\) — the direction of convergence is consistent, not a coincidence.`,
              },
            },
            {
              text: {
                ko: String.raw`일반 공식도 알려드립니다 (아이디어 수준): \(p\)개 양항과 \(q\)개 음항을 반복하는 재배열의 합은 \(\ln 2 + \frac{1}{2}\ln\frac{p}{q}\)입니다. \(p = 2, q = 1\)을 대입하면 \(\ln 2 + \frac{1}{2}\ln 2 = \frac{3}{2}\ln 2\)가 나옵니다. 이 공식의 증명은 여기서 다루지 않습니다.`,
                en: String.raw`The general formula is stated as known (idea level): a rearrangement repeating \(p\) positive and \(q\) negative terms sums to \(\ln 2 + \frac{1}{2}\ln\frac{p}{q}\). For \(p = 2, q = 1\) this gives \(\frac{3}{2}\ln 2\). Its proof is not covered here.`,
              },
            },
          ],
        },
        {
          id: 'absolute-invariant',
          statement: {
            ko: String.raw`절대수렴 급수는 재배열해도 합이 바뀌지 않음을 아이디어 수준으로 설명하세요. (엄밀한 증명은 생략합니다.)`,
            en: String.raw`Explain at idea level why rearranging an absolutely convergent series never changes its sum. (Idea level; proof omitted.)`,
          },
          preset: { n: 60 },
          presetCaption: {
            ko: String.raw`꼬리를 얼마든 작게 만들 수 있으면 순서는 중요하지 않습니다.`,
            en: String.raw`If tails can be made arbitrarily small, order stops mattering.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sum a_n\)이 절대수렴하면, \(\varepsilon > 0\)마다 꼬리 \(\sum_{n>N}|a_n| < \varepsilon\)을 만족하는 \(N\)이 존재합니다. (스케치 — 엄밀한 증명은 생략)`,
                en: String.raw`If \(\sum a_n\) converges absolutely, then for every \(\varepsilon > 0\) there is an \(N\) with tail \(\sum_{n>N}|a_n| < \varepsilon\). (Sketch only; rigorous proof omitted)`,
              },
            },
            {
              text: {
                ko: String.raw`재배열의 부분합도 충분히 멀리 가면 원래 급수의 처음 \(N\)개 항을 모두 포함하므로, 두 부분합의 차이는 꼬리 항들로만 이루어져 \(2\varepsilon\)보다 작아집니다.`,
                en: String.raw`A rearrangement's partial sums eventually contain the first \(N\) terms of the original, so the two partial sums differ only by tail terms — less than \(2\varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon\)은 임의이므로 두 합은 같습니다. 즉, 꼬리를 얼마든 작게 만들 수 있으면 순서를 바꿔도 합이 바뀌지 않습니다.`,
                en: String.raw`Since \(\varepsilon\) is arbitrary, the two sums agree: when tails can be made arbitrarily small, reordering cannot change the sum.`,
              },
            },
          ],
        },
        {
          id: 'alternating-remainder',
          statement: {
            ko: String.raw`교대조화급수의 부분합이 \(\lvert S_n - \ln 2\rvert \leq \frac{1}{n+1}\)을 만족함을 증명하세요.`,
            en: String.raw`Prove \(\lvert S_n - \ln 2\rvert \leq \frac{1}{n+1}\) for the alternating harmonic partial sums.`,
          },
          display: [String.raw`\lvert R_n\rvert \leq a_{n+1} = \frac{1}{n+1}`],
          preset: { n: 100 },
          presetCaption: {
            ko: String.raw`\(n=100\): 오차가 \(1/101 \approx 0.0099\) 안에 갇힙니다.`,
            en: String.raw`\(n=100\): the error is trapped inside \(1/101 \approx 0.0099\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_n = 1/n\)은 감소하면서 \(0\)으로 갑니다. 짝수 부분합은 증가하고 홀수 부분합은 감소합니다: \(S_{2m+2} - S_{2m} = a_{2m+1} - a_{2m+2} > 0\), \(S_{2m+3} - S_{2m+1} = -(a_{2m+2} - a_{2m+3}) < 0\).`,
                en: String.raw`\(a_n = 1/n\) decreases to \(0\). Even partial sums increase, odd ones decrease: \(S_{2m+2} - S_{2m} = a_{2m+1} - a_{2m+2} > 0\) and \(S_{2m+3} - S_{2m+1} = -(a_{2m+2} - a_{2m+3}) < 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`극한 \(S = \ln 2\)는 항상 연속한 두 부분합 \(S_n\)과 \(S_{n+1}\) 사이에 끼이므로, \(|S - S_n| \le |S_{n+1} - S_n| = a_{n+1} = \frac{1}{n+1}\)입니다.`,
                en: String.raw`The limit \(S = \ln 2\) always lies between two consecutive partial sums \(S_n\) and \(S_{n+1}\), so \(|S - S_n| \le |S_{n+1} - S_n| = a_{n+1} = \frac{1}{n+1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`예를 들어 \(n = 100\)이면 \(|S_{100} - \ln 2| \le \frac{1}{101} \approx 0.0099\)입니다 — 캡션의 수치와 일치합니다.`,
                en: String.raw`For \(n = 100\) this gives \(|S_{100} - \ln 2| \le \frac{1}{101} \approx 0.0099\) — matching the caption's figure.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'improper',
      title: { ko: '이상적분', en: 'Improper Integrals' },
      order: 12,
      summary: {
        ko: String.raw`\(\int_1^\infty \frac{dx}{x^p}\)는 \(p > 1\)일 때만 수렴하고, \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\)처럼 특이점 쪽도 다룹니다 — p급수와의 쌍대 장면.`,
        en: String.raw`\(\int_1^\infty \frac{dx}{x^p}\) converges only for \(p > 1\), plus the singular kind \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\) — the twin of the p-series scene.`,
      },
      tex: [
        String.raw`\int_1^{\infty}\frac{dx}{x^p} = \frac{1}{p-1}\ \ (p>1)`,
        String.raw`\int_0^1\frac{dx}{\sqrt{x}} = 2`,
      ],
      prerequisites: ['harmonic'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '적분 종류', en: 'Integral kind' }, options: ['tail', 'singular'], init: 'tail' },
        { kind: 'slider', key: 'p', label: { ko: '지수 p', en: 'Exponent p' }, min: 0.5, max: 2, step: 0.01, init: 1 },
        { kind: 'slider', key: 'R', label: { ko: '위끝 R', en: 'Upper limit R' }, min: 2, max: 50, step: 1, init: 10 },
        { kind: 'slider', key: 'eps', label: { ko: '아래끝 ε', en: 'Lower limit ε' }, min: 0.001, max: 0.5, step: 0.001, init: 0.01 },
      ],
      problems: [
        {
          id: 'p2-integral',
          statement: {
            ko: String.raw`\(\int_1^\infty \frac{dx}{x^2} = 1\)을 직접 계산하세요.`,
            en: String.raw`Compute \(\int_1^\infty \frac{dx}{x^2} = 1\) directly.`,
          },
          display: [String.raw`\int_1^R \frac{dx}{x^2} = 1 - \frac{1}{R} \to 1`],
          preset: { kind: 'tail', p: 2, R: 20, eps: 0.01 },
          presetCaption: {
            ko: String.raw`\(p=2, R=20\): 넓이 \(0.95\)가 \(1\)을 향해 다가갑니다.`,
            en: String.raw`\(p=2, R=20\): area \(0.95\) approaches \(1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\int_1^R x^{-2}\,dx = \left[-x^{-1}\right]_1^R = 1 - \frac{1}{R}\)입니다.`,
                en: String.raw`\(\int_1^R x^{-2}\,dx = \left[-x^{-1}\right]_1^R = 1 - \frac{1}{R}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(R \to \infty\)이면 \(\frac{1}{R} \to 0\)이므로 넓이는 \(1\)로 수렴합니다. \(R = 20\)에서 \(1 - \frac{1}{20} = 0.95\) — 캡션의 수치와 일치합니다.`,
                en: String.raw`As \(R \to \infty\), \(\frac{1}{R} \to 0\), so the area tends to \(1\). At \(R = 20\): \(1 - \frac{1}{20} = 0.95\) — matching the caption's figure.`,
              },
            },
          ],
        },
        {
          id: 'p-le-one-diverges',
          statement: {
            ko: String.raw`\(p \leq 1\)일 때 \(\int_1^\infty \frac{dx}{x^p}\)가 발산함을 증명하세요.`,
            en: String.raw`Prove \(\int_1^\infty \frac{dx}{x^p}\) diverges for \(p \leq 1\).`,
          },
          display: [String.raw`\int_1^R \frac{dx}{x} = \ln R \to \infty`],
          preset: { kind: 'tail', p: 1, R: 50, eps: 0.01 },
          presetCaption: {
            ko: String.raw`\(p=1\): 넓이가 \(\ln R\)처럼 끝없이 자랍니다.`,
            en: String.raw`\(p=1\): the area grows like \(\ln R\) without bound.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(p = 1\): \(\int_1^R \frac{dx}{x} = \ln R \to \infty\) (\(R \to \infty\)). \(R = 50\)에서 넓이는 \(\ln 50 \approx 3.912\)입니다.`,
                en: String.raw`\(p = 1\): \(\int_1^R \frac{dx}{x} = \ln R \to \infty\) as \(R \to \infty\). At \(R = 50\) the area is \(\ln 50 \approx 3.912\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(p < 1\): \(\int_1^R x^{-p}\,dx = \frac{R^{1-p}-1}{1-p}\)이고 \(1 - p > 0\)이므로 \(R \to \infty\)일 때 \(\infty\)로 발산합니다.`,
                en: String.raw`\(p < 1\): \(\int_1^R x^{-p}\,dx = \frac{R^{1-p}-1}{1-p}\), and since \(1 - p > 0\) this diverges to \(\infty\) as \(R \to \infty\).`,
              },
            },
          ],
        },
        {
          id: 'singular-half',
          statement: {
            ko: String.raw`\(\int_0^1 \frac{dx}{\sqrt{x}} = 2\)를 특이점에서의 극한으로 계산하세요.`,
            en: String.raw`Compute \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\) as a limit at the singularity.`,
          },
          display: [String.raw`\int_\varepsilon^1 x^{-1/2}\,dx = 2 - 2\sqrt{\varepsilon} \to 2`],
          preset: { kind: 'singular', p: 0.5, R: 10, eps: 0.01 },
          presetCaption: {
            ko: String.raw`\(p=1/2, \varepsilon=0.01\): 넓이 \(1.8\)이 \(2\)로 다가갑니다.`,
            en: String.raw`\(p=1/2, \varepsilon=0.01\): area \(1.8\) approaches \(2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\int_\varepsilon^1 x^{-1/2}\,dx = \left[2\sqrt{x}\right]_\varepsilon^1 = 2 - 2\sqrt{\varepsilon}\)입니다.`,
                en: String.raw`\(\int_\varepsilon^1 x^{-1/2}\,dx = \left[2\sqrt{x}\right]_\varepsilon^1 = 2 - 2\sqrt{\varepsilon}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon \to 0^+\)이면 \(\sqrt{\varepsilon} \to 0\)이므로 넓이는 \(2\)로 수렴합니다. \(\varepsilon = 0.01\)에서 \(2 - 2\sqrt{0.01} = 2 - 0.2 = 1.8\) — 캡션의 수치와 일치합니다.`,
                en: String.raw`As \(\varepsilon \to 0^+\), \(\sqrt{\varepsilon} \to 0\), so the area tends to \(2\). At \(\varepsilon = 0.01\): \(2 - 2\sqrt{0.01} = 2 - 0.2 = 1.8\) — matching the caption's figure.`,
              },
            },
          ],
        },
      ],
    }
  ],
};
