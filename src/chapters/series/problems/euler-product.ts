import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Euler product scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/euler-product.test.ts):
 *   P_1 = 4/3, P_2 = 3/2, P_3 = 25/16 = 1.5625
 *   P_6 = 1.6179176613136572, zeta(2) - P_6 = 0.0270164055
 *   P_15 = 1.6385679630962098, zeta(2) - P_15 = 0.0063661038
 *   ZETA2 = pi^2/6 = 1.6449340668482264
 */
export const eulerProductProblems: readonly ProblemMeta[] = [
  {
    id: 'euler-product-sieve',
    statement: {
      ko: String.raw`\(s > 1\)에 대해 오일러 곱셈식 \(\zeta(s) = \prod_{p\ \text{소수}} \frac{1}{1 - p^{-s}}\)를 체(sieve) 논증으로 증명하세요.

힌트: \(\zeta(s)(1 - 2^{-s})\)는 짝수 항을 모두 제거합니다.`,
      en: String.raw`Prove the Euler product \(\zeta(s) = \prod_{p\ \text{prime}} \frac{1}{1 - p^{-s}}\) for \(s > 1\) by a sieve argument.

Hint: \(\zeta(s)(1 - 2^{-s})\) removes all even terms.`,
    },
    display: [
      String.raw`\zeta(s)(1 - 2^{-s}) = \sum_{n \ge 1} \frac{1}{n^s} - \sum_{n \ge 1} \frac{1}{(2n)^s} = \sum_{2 \nmid n} \frac{1}{n^s}`,
      String.raw`\zeta(s)\prod_{i=1}^{k}(1 - p_i^{-s}) = 1 + \sum_{\substack{n > 1 \\ (n, P_k) = 1}} \frac{1}{n^s}, \qquad P_k := \prod_{i=1}^{k} p_i`,
    ],
    preset: { k: 6 },
    presetCaption: {
      ko: String.raw`\(k = 6\) (소수 \(13\)까지 체로 거름): \(P_6 \approx 1.6179177\), 오차 \(\zeta(2) - P_6 \approx 0.0270164\) — 체를 한 겹씩 더할 때마다 곱셈이 \(\zeta(2)\)에 다가갑니다.`,
      en: String.raw`\(k = 6\) (sieved through prime \(13\)): \(P_6 \approx 1.6179177\), error \(\zeta(2) - P_6 \approx 0.0270164\) — each extra sieve layer pushes the product closer to \(\zeta(2)\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\zeta(s) = \sum_{n\ge 1} n^{-s}\)는 \(s > 1\)에서 절대수렴하므로 항을 자유롭게 재배열·분할할 수 있습니다. \(\frac{1}{1 - 2^{-s}} = \sum_{j\ge 0} 2^{-js}\)이므로 (공비 \(2^{-s} < 1\)인 기하급수), \(\zeta(s)(1 - 2^{-s})\)를 곱하면 \(\sum_{n} n^{-s} - \sum_{n} (2n)^{-s}\)가 되어 모든 짝수 항이 상쇄되고 홀수 항만 남습니다: \(\zeta(s)(1 - 2^{-s}) = \sum_{2\nmid n} n^{-s}\).`,
          en: String.raw`\(\zeta(s) = \sum_{n\ge 1} n^{-s}\) converges absolutely for \(s > 1\), so its terms may be freely rearranged and regrouped. Since \(\frac{1}{1 - 2^{-s}} = \sum_{j\ge 0} 2^{-js}\) (a geometric series with ratio \(2^{-s} < 1\)), multiplying gives \(\sum_{n} n^{-s} - \sum_{n} (2n)^{-s}\): every even term cancels, leaving only the odd terms: \(\zeta(s)(1 - 2^{-s}) = \sum_{2\nmid n} n^{-s}\).`,
        },
      },
      {
        text: {
          ko: String.raw`다음 소수 \(3\)에 대해 같은 일을 합니다: \((1 - 3^{-s})\sum_{2\nmid n} n^{-s} = \sum_{2\nmid n} n^{-s} - \sum_{2\nmid n} (3n)^{-s}\)에서 \(3\)의 배수인 항이 모두 사라집니다.

같은 논증을 \(p_1 = 2, p_2 = 3, \dots, p_k\)에 반복하면 \(\zeta(s)\prod_{i=1}^{k}(1 - p_i^{-s}) = 1 + \sum_{n > 1,\ (n,P_k)=1} n^{-s}\)가 됩니다 (\(P_k = p_1 \cdots p_k\)).

즉 처음 \(k\)개 소수로 나누어지지 않는 \(n\)에 대한 합만 남습니다.`,
          en: String.raw`Do the same for the next prime \(3\): \((1 - 3^{-s})\sum_{2\nmid n} n^{-s} = \sum_{2\nmid n} n^{-s} - \sum_{2\nmid n} (3n)^{-s}\), killing every multiple of \(3\). Repeating for \(p_1 = 2, p_2 = 3, \dots, p_k\) gives \(\zeta(s)\prod_{i=1}^{k}(1 - p_i^{-s}) = 1 + \sum_{n > 1,\ (n,P_k)=1} n^{-s}\) (\(P_k = p_1 \cdots p_k\)): only the terms whose \(n\) shares no factor with the first \(k\) primes survive.`,
        },
      },
      {
        text: {
          ko: String.raw`남은 꼬리 합을 묶으면 \(0 \le \sum_{n > 1,\ (n,P_k)=1} n^{-s} \le \sum_{n > p_k} n^{-s} \xrightarrow[k\to\infty]{} 0\)입니다 — \((n,P_k)=1\)인 \(n > 1\)은 최소 소인수가 \(p_{k+1} > p_k\)보다 크거나 같아야 하므로, 실제로 \(n \ge p_{k+1} > p_k\)이기 때문입니다. 따라서 \(\zeta(s)\prod_{i=1}^{k}(1 - p_i^{-s}) \to 1\)이고, 양변을 뒤집으면 \(\zeta(s) = \prod_{p}\frac{1}{1 - p^{-s}}\) (\(s > 1\))를 얻습니다.`,
          en: String.raw`The leftover tail is squeezed to zero: \(0 \le \sum_{n > 1,\ (n,P_k)=1} n^{-s} \le \sum_{n > p_k} n^{-s} \xrightarrow[k\to\infty]{} 0\), because any \(n > 1\) coprime to \(P_k\) has all prime factors \(\ge p_{k+1} > p_k\), hence \(n \ge p_{k+1} > p_k\). So \(\zeta(s)\prod_{i=1}^{k}(1 - p_i^{-s}) \to 1\), and inverting gives \(\zeta(s) = \prod_{p}\frac{1}{1 - p^{-s}}\) for \(s > 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(s = 2\), \(k = 6\)): \(P_6 = \prod_{i=1}^{6}\frac{1}{1-p_i^{-2}} \approx 1.6179177\)이고 오차는 \(\zeta(2) - P_6 \approx 1.6449341 - 1.6179177 = 0.0270164\)로, 캡션과 일치합니다 — 체의 한 겹이 곧 꼬리 합의 한 겹을 걷어낸 것입니다.`,
          en: String.raw`Numerical check (\(s = 2\), \(k = 6\)): \(P_6 = \prod_{i=1}^{6}\frac{1}{1-p_i^{-2}} \approx 1.6179177\) with error \(\zeta(2) - P_6 \approx 1.6449341 - 1.6179177 = 0.0270164\), matching the caption — each sieve layer peels off one more layer of the tail sum.`,
        },
      },
    ],
  },
  {
    id: 'euler-product-basel',
    statement: {
      ko: String.raw`바젤 결과 \(\zeta(2) = \frac{\pi^2}{6}\)를 이용해 \(\prod_{p\ \text{소수}} \left(1 - \frac{1}{p^2}\right)^{-1} = \frac{\pi^2}{6}\)임을 보이세요.`,
      en: String.raw`Use the Basel result \(\zeta(2) = \frac{\pi^2}{6}\) to show \(\prod_{p\ \text{prime}} \left(1 - \frac{1}{p^2}\right)^{-1} = \frac{\pi^2}{6}\).`,
    },
    display: [
      String.raw`\prod_{p}\left(1 - \frac{1}{p^2}\right)^{-1} = \zeta(2) = \frac{\pi^2}{6}`,
      String.raw`P_3 = \frac{1}{1 - \frac14}\cdot\frac{1}{1 - \frac19}\cdot\frac{1}{1 - \frac{1}{25}} = \frac{4}{3}\cdot\frac{9}{8}\cdot\frac{25}{24} = \frac{25}{16} = 1.5625`,
    ],
    preset: { k: 3 },
    presetCaption: {
      ko: String.raw`\(k = 3\) (소수 \(2, 3, 5\)): \(P_3 = \frac{25}{16} = 1.5625\), 오차 \(\frac{\pi^2}{6} - P_3 \approx 0.0824341\) — 아직 \(5\%\) 정도 모자라지만 증가는 단조롭습니다.`,
      en: String.raw`\(k = 3\) (primes \(2, 3, 5\)): \(P_3 = \frac{25}{16} = 1.5625\), error \(\frac{\pi^2}{6} - P_3 \approx 0.0824341\) — still about \(5\%\) short, but the increase is monotone.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`예제 1의 오일러 곱셈식은 \(s > 1\)인 모든 \(s\)에 대해 성립하므로, \(s = 2\)를 대입하면 \(\zeta(2) = \prod_{p}\frac{1}{1 - p^{-2}} = \prod_{p}\left(1 - \frac{1}{p^2}\right)^{-1}\)을 바로 얻습니다. 급수 쪽과 곱셈 쪽이 같은 극한을 가리키는 셈입니다.`,
          en: String.raw`Problem 1's Euler product holds for every \(s > 1\), so substituting \(s = 2\) gives \(\zeta(2) = \prod_{p}\frac{1}{1 - p^{-2}} = \prod_{p}\left(1 - \frac{1}{p^2}\right)^{-1}\) directly: the sum side and the product side point at the same limit.`,
        },
      },
      {
        text: {
          ko: String.raw`바젤 결과(바젤 씬 참조)는 \(\zeta(2) = \sum_{n\ge 1} \frac{1}{n^2} = \frac{\pi^2}{6}\)입니다. 따라서 소수에 대한 곱 \(\prod_{p}\left(1 - \frac{1}{p^2}\right)^{-1}\)도 \(\frac{\pi^2}{6} \approx 1.6449341\)로 수렴합니다.`,
          en: String.raw`The Basel result (see the Basel scene) is \(\zeta(2) = \sum_{n\ge 1} \frac{1}{n^2} = \frac{\pi^2}{6}\). Hence the product over primes \(\prod_{p}\left(1 - \frac{1}{p^2}\right)^{-1}\) also converges to \(\frac{\pi^2}{6} \approx 1.6449341\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 인자 \(\frac{1}{1 - p^{-2}} > 1\)이므로 부분곱 \(P_k\)는 단조증가하고 위로 \(\zeta(2)\)에 의해 유계이므로 수렴합니다.

특히 뒤집으면 \(\prod_{p}\left(1 - \frac{1}{p^2}\right) = \frac{6}{\pi^2} \approx 0.6079271\)입니다.

이는 서로소인 정수 쌍의 natural density가 \(\frac{6}{\pi^2}\)라는 뜻으로 해석됩니다 — 정수 전체에 대한 uniform probability distribution은 없으므로, probability space 위의 확률이 아니라 density입니다.`,
          en: String.raw`Each factor \(\frac{1}{1 - p^{-2}} > 1\), so the partial products \(P_k\) increase monotonically and are bounded above by \(\zeta(2)\), hence converge.

Inverted, \(\prod_{p}\left(1 - \frac{1}{p^2}\right) = \frac{6}{\pi^2} \approx 0.6079271\).

This is interpreted as a natural density: the density of coprime pairs among integer pairs is \(\frac{6}{\pi^2}\) — a density, not a probability on a probability space, since there is no uniform probability distribution on the integers.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 확인 (\(k = 3\)): 처음 세 소수 \(2, 3, 5\)만으로 \(P_3 = \frac{4}{3}\cdot\frac{9}{8}\cdot\frac{25}{24} = \frac{25}{16} = 1.5625\)이고, 오차는 \(\frac{\pi^2}{6} - \frac{25}{16} \approx 1.6449341 - 1.5625 = 0.0824341\)로 캡션과 일치합니다.`,
          en: String.raw`Numerical check (\(k = 3\)): with just the first three primes \(2, 3, 5\), \(P_3 = \frac{4}{3}\cdot\frac{9}{8}\cdot\frac{25}{24} = \frac{25}{16} = 1.5625\), and the error is \(\frac{\pi^2}{6} - \frac{25}{16} \approx 1.6449341 - 1.5625 = 0.0824341\), matching the caption.`,
        },
      },
    ],
  },
  {
    id: 'euler-product-prime-reciprocals',
    statement: {
      ko: String.raw`소수의 역수 합 \(\sum_{p\ \text{소수}} \frac{1}{p}\)가 발산함을, \(s \to 1^+\)일 때의 오일러 곱셈식으로부터 증명하세요.`,
      en: String.raw`Prove that the sum of prime reciprocals \(\sum_{p\ \text{prime}} \frac{1}{p}\) diverges, starting from the Euler product as \(s \to 1^+\).`,
    },
    display: [
      String.raw`\log \zeta(s) = \sum_{p}\sum_{j\ge 1} \frac{1}{j\,p^{js}} = \sum_{p} \frac{1}{p^s} + O(1) \qquad (s > 1)`,
      String.raw`\zeta(s) \ge \int_1^{\infty} t^{-s}\,dt = \frac{1}{s - 1} \;\Rightarrow\; \log \zeta(s) \to +\infty \quad (s \to 1^+)`,
    ],
    preset: { k: 15 },
    presetCaption: {
      ko: String.raw`\(k = 15\) (소수 \(47\)까지): \(P_{15} \approx 1.6385679631\), 오차 \(\approx 0.0063661\) — 곱은 수렴하지만, \(s \to 1^+\)에서는 같은 곱의 로그가 발산하며 소수 역수 합을 끌어올립니다.`,
      en: String.raw`\(k = 15\) (through prime \(47\)): \(P_{15} \approx 1.6385679631\), error \(\approx 0.0063661\) — the product converges, but as \(s \to 1^+\) the log of the same product diverges, dragging the prime-reciprocal sum up with it.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(s > 1\)에서 로그를 취하는 것을 정당화합니다: 유한 부분곱에서는 \(\log\)가 곱을 합으로 바꾸고, 부분곱이 \(\zeta(s) > 0\)으로 수렴하므로 \(\log\)의 연속성으로 극한에서도 성립합니다.

\(-\log(1 - x) = \sum_{j\ge 1} \frac{x^j}{j}\) (테일러 급수, \(|x| < 1\))에 의해 \(\log \zeta(s) = \sum_{p}\sum_{j\ge 1} \frac{1}{j\,p^{js}}\)가 됩니다.

모든 항 \(\frac{1}{j\,p^{js}} > 0\)이므로 counting measure에 대한 Tonelli 정리로 이중합의 재배열이 허용되고, \(s > 1\)에서는 절대수렴합니다.

\(j = 1\) 항을 분리하면 \(\log \zeta(s) = \sum_{p} \frac{1}{p^s} + \sum_{p}\sum_{j\ge 2} \frac{1}{j\,p^{js}}\)입니다.`,
          en: String.raw`Justify taking logs for \(s > 1\): for a finite partial product, \(\log\) turns the product into a sum of logs; the partial products converge to \(\zeta(s) > 0\), so continuity of \(\log\) passes this to the limit.

Using \(-\log(1 - x) = \sum_{j\ge 1} \frac{x^j}{j}\) (Taylor series, \(|x| < 1\)) gives \(\log \zeta(s) = \sum_{p}\sum_{j\ge 1} \frac{1}{j\,p^{js}}\).

Every term \(\frac{1}{j\,p^{js}}\) is positive, so Tonelli's theorem for counting measure permits any rearrangement of the double sum, and the double sum converges absolutely for \(s > 1\).

Splitting off \(j = 1\) yields \(\log \zeta(s) = \sum_{p} \frac{1}{p^s} + \sum_{p}\sum_{j\ge 2} \frac{1}{j\,p^{js}}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(j \ge 2\)인 이중합은 \(s \ge 1\)에서 균일 유계입니다: \(\sum_{p}\sum_{j\ge 2} \frac{1}{j\,p^{js}} \le \sum_{p} \frac{1}{p^2}\sum_{j\ge 2} 2^{1-j} = \sum_{p} \frac{1}{p^2} < \sum_{n\ge 2} \frac{1}{n^2} = \zeta(2) - 1 = \frac{\pi^2}{6} - 1 \approx 0.6449341\)이므로, 이 부분은 \(O(1)\)입니다. 따라서 \(\log \zeta(s) = \sum_{p} \frac{1}{p^s} + O(1)\) (\(s > 1\))입니다.`,
          en: String.raw`The \(j \ge 2\) double sum is uniformly bounded for \(s \ge 1\): \(\sum_{p}\sum_{j\ge 2} \frac{1}{j\,p^{js}} \le \sum_{p} \frac{1}{p^2}\sum_{j\ge 2} 2^{1-j} = \sum_{p} \frac{1}{p^2} < \sum_{n\ge 2} \frac{1}{n^2} = \zeta(2) - 1 = \frac{\pi^2}{6} - 1 \approx 0.6449341\), so that part is \(O(1)\). Hence \(\log \zeta(s) = \sum_{p} \frac{1}{p^s} + O(1)\) for \(s > 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`한편 \(\zeta(s) \ge \int_1^{\infty} x^{-s}\,dx = \frac{1}{s-1}\)입니다 — 각 항 \(n^{-s} \ge \int_n^{n+1} x^{-s}\,dx\)를 더하면 됩니다. 따라서 \(\log \zeta(s) \ge -\log(s - 1) \to +\infty\) (\(s \to 1^+\))입니다.`,
          en: String.raw`Meanwhile \(\zeta(s) \ge \int_1^{\infty} x^{-s}\,dx = \frac{1}{s-1}\) — just sum \(n^{-s} \ge \int_n^{n+1} x^{-s}\,dx\) over \(n\). Hence \(\log \zeta(s) \ge -\log(s - 1) \to +\infty\) as \(s \to 1^+\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\log \zeta(s) = \sum_{p} p^{-s} + O(1)\)이 무한대로 가므로 \(\sum_{p} p^{-s} \to +\infty\) (\(s \to 1^+\))입니다.

단조수렴정리의 설정을 확인합니다: 각 소수 \(p\)마다 \(s \downarrow 1\)일 때 \(p^{-s}\)는 단조증가하며 \(p^{-1}\)로 수렴하고 모든 항은 \(0\) 이상이므로, counting measure에 대한 단조수렴정리로 \(\sum_{p} p^{-s} \uparrow \sum_{p} p^{-1}\) (\(s \to 1^+\), 극한값이 \(+\infty\)인 경우 포함)입니다.

따라서 \(s = 1\)에서 \(\sum_{p} \frac{1}{p}\)가 유한하게 수렴한다면 \(\sum_{p} p^{-s}\)는 그 합으로 수렴해야 하므로 모순입니다.

따라서 \(\sum_{p} \frac{1}{p} = +\infty\) — 소수의 역수 합은 발산합니다.`,
          en: String.raw`Since \(\log \zeta(s) = \sum_{p} p^{-s} + O(1) \to +\infty\), we get \(\sum_{p} p^{-s} \to +\infty\) as \(s \to 1^+\).

Set up the monotone convergence step: for each prime \(p\), \(p^{-s}\) increases to \(p^{-1}\) as \(s \downarrow 1\), and every term is nonnegative, so the monotone convergence theorem for counting measure gives \(\sum_{p} p^{-s} \uparrow \sum_{p} p^{-1}\) as \(s \to 1^+\) (the limit may be \(+\infty\)).

Hence if \(\sum_{p} \frac{1}{p}\) converged to a finite value at \(s = 1\), \(\sum_{p} p^{-s}\) would have to approach that sum as \(s \to 1^+\) — a contradiction.

Therefore \(\sum_{p} \frac{1}{p} = +\infty\): the sum of prime reciprocals diverges.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 감각: \(s = 2\)에서는 \(P_{15} \approx 1.6385679631\)로 \(\zeta(2) \approx 1.6449341\)에 거의 붙지만 (오차 \(\approx 0.0063661\), 캡션과 일치), \(s\)를 \(1\)에 가깝게 내리면 \(\log \zeta(s)\)가 무한대로 부풀어 오르며, 그 무한대의 몫을 \(O(1)\)을 제외하고는 오직 \(\sum_p p^{-s}\)만이 감당합니다.`,
          en: String.raw`Numerical feel: at \(s = 2\), \(P_{15} \approx 1.6385679631\) sits almost on \(\zeta(2) \approx 1.6449341\) (error \(\approx 0.0063661\), matching the caption), but as \(s\) slides toward \(1\), \(\log \zeta(s)\) blows up to infinity, and with the \(O(1)\) part accounted for, only \(\sum_p p^{-s}\) can supply that infinity.`,
        },
      },
    ],
  },
];
