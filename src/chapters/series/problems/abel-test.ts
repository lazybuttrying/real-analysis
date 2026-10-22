import type { ProblemMeta } from '../../../contracts.ts';

export const problems: readonly ProblemMeta[] = [
        {
          id: 'p1-abel-test-proof',
          statement: {
            ko: String.raw`\(\sum_{n=1}^{\infty} a_n\)이 수렴하고 \((b_n)\)이 단조이면서 유계이면 \(\sum_{n=1}^{\infty} a_n b_n\)도 수렴함을 보이세요 (아벨 판정법).`,
            en: String.raw`Show that if \(\sum_{n=1}^{\infty} a_n\) converges and \((b_n)\) is monotone and bounded, then \(\sum_{n=1}^{\infty} a_n b_n\) also converges (Abel's test).`,
          },
          display: [
            String.raw`A_n = \sum_{k=1}^{n} a_k, \qquad \sum_{k=m}^{n} a_k b_k = A_n b_{n+1} - A_{m-1} b_m + \sum_{k=m}^{n} A_k (b_k - b_{k+1})`,
            String.raw`\sum_{k=m}^{n} |b_k - b_{k+1}| = |b_m - b_{n+1}| \le 2M \quad \text{(monotone, } |b_k| \le M\text{)}`,
          ],
          preset: { example: 'shifted', n: 120 },
          presetCaption: {
            ko: String.raw`\(a_k = (-1)^k/k\), \(b_k = 2 + 1/k\): \(S_{120} \approx -2.2004\)가 \(-2\ln 2 - \pi^2/12 \approx -2.2088\)을 향해 안정됩니다.`,
            en: String.raw`\(a_k = (-1)^k/k\), \(b_k = 2 + 1/k\): \(S_{120} \approx -2.2004\) settles toward \(-2\ln 2 - \pi^2/12 \approx -2.2088\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(A_n = \sum_{k=1}^{n} a_k\)이라 두자.

가정에 의해 \(A_n \to A\)로 수렴한다.

\(A_0 := 0\)으로 두면 \(m = 1\)인 경우에도 아래 공식이 성립한다(\(A_{m-1} = A_0 = 0\)).

부분합에 의한 합산 변환(아벨 변환)을 쓰면 \(m \le n\)에 대해 \(\sum_{k=m}^{n} a_k b_k = A_n b_{n+1} - A_{m-1} b_m + \sum_{k=m}^{n} A_k (b_k - b_{k+1})\)이다.

이는 \(a_k = A_k - A_{k-1}\)을 대입하고 망원합으로 정리하면 직접 확인할 수 있다.`,
                en: String.raw`Put \(A_n = \sum_{k=1}^{n} a_k\).

By hypothesis \(A_n \to A\).

Set \(A_0 := 0\) so the formula below is also valid for \(m = 1\) (with \(A_{m-1} = A_0 = 0\)).

Summation by parts (Abel's transform) gives, for \(m \le n\), \(\sum_{k=m}^{n} a_k b_k = A_n b_{n+1} - A_{m-1} b_m + \sum_{k=m}^{n} A_k (b_k - b_{k+1})\), which is checked directly by substituting \(a_k = A_k - A_{k-1}\) and collecting the telescoping terms.`,
              },
            },
            {
              text: {
                ko: String.raw`이제 \(A_k = A + \varepsilon_k\)라 쓰면 \(\varepsilon_k \to 0\)이다.

합 \(\sum_{k=m}^{n} A_k (b_k - b_{k+1})\)은 \(A(b_m - b_{n+1}) + \sum_{k=m}^{n} \varepsilon_k (b_k - b_{k+1})\)로 나뉜다.

앞부분은 망원합이다.`,
                en: String.raw`Write \(A_k = A + \varepsilon_k\) with \(\varepsilon_k \to 0\). Then \(\sum_{k=m}^{n} A_k (b_k - b_{k+1})\) splits as \(A(b_m - b_{n+1}) + \sum_{k=m}^{n} \varepsilon_k (b_k - b_{k+1})\), the first part telescoping.`,
              },
            },
            {
              text: {
                ko: String.raw`핵심은 \((b_k)\)의 단조성이다.

단조수열의 차분은 부호가 일정하므로 \(\sum_{k=m}^{n} |b_k - b_{k+1}| = |b_m - b_{n+1}|\)이다.

유계성 \(|b_k| \le M\)에서 이는 \(2M\) 이하이다.

따라서 \(\left|\sum_{k=m}^{n} \varepsilon_k (b_k - b_{k+1})\right| \le \max_{m \le k \le n} |\varepsilon_k| \cdot 2M\)이다.

임의의 \(\eta > 0\)에 대해 \(m\)을 충분히 크게 잡으면 이 항은 \(\eta \cdot 2M\)보다 작아진다.`,
                en: String.raw`The key is the monotonicity of \((b_k)\): the differences have constant sign, so \(\sum_{k=m}^{n} |b_k - b_{k+1}| = |b_m - b_{n+1}|\).

Boundedness \(|b_k| \le M\) makes this at most \(2M\).

Hence \(\left|\sum_{k=m}^{n} \varepsilon_k (b_k - b_{k+1})\right| \le \max_{m \le k \le n} |\varepsilon_k| \cdot 2M\).

For any \(\eta > 0\), taking \(m\) large makes this smaller than \(\eta \cdot 2M\).`,
              },
            },
            {
              text: {
                ko: String.raw`한편 경계항 \(A_n b_{n+1} - A_{m-1} b_m\)을 보자.

\(b_k \to b\)로 수렴하므로(\(b\)는 단조·유계 수열의 극한) \(A_n b_{n+1} - A_{m-1} b_m \to A b - A b = 0\) — 코시 의미에서 \(m, n \to \infty\)일 때 \(0\)으로 간다.

남은 항 \(A(b_m - b_{n+1})\)도 추정해야 한다: \(|A(b_m - b_{n+1})| \le |A| \cdot |b_m - b_{n+1}|\)이고, \(b_k \to b\)이므로 \(m, n \to \infty\)일 때 \(|b_m - b_{n+1}| \to 0\)이다(대략적으로는 \(|b_m - b_{n+1}| \le 2M\)).

따라서 이 항도 \(0\)으로 간다.

분해의 모든 항이 추정되었으므로, 앞 항과 합치면 \(\sum_{k=m}^{n} a_k b_k\)의 꼬리가 임의로 작아지므로 \(\sum a_k b_k\)의 부분합은 코시 수열이다.

따라서 수렴한다.`,
                en: String.raw`Now the boundary term \(A_n b_{n+1} - A_{m-1} b_m\).

Since \(b_k \to b\) (a monotone bounded sequence converges), this tends to \(A b - A b = 0\) in the Cauchy sense as \(m, n \to \infty\).

The leftover term \(A(b_m - b_{n+1})\) must also be estimated: \(|A(b_m - b_{n+1})| \le |A| \cdot |b_m - b_{n+1}|\), and since \(b_k \to b\), \(|b_m - b_{n+1}| \to 0\) as \(m, n \to \infty\) (crudely \(|b_m - b_{n+1}| \le 2M\)).

Hence this term also tends to \(0\).

Every term in the decomposition is now estimated, so together with the previous estimate, the tails of \(\sum_{k=m}^{n} a_k b_k\) become arbitrarily small, so the partial sums of \(\sum a_k b_k\) form a Cauchy sequence.

Hence the series converges.`,
              },
            },
          ],
        },
        {
          id: 'p2-shifted-weight',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{\infty} \frac{(-1)^k}{k}\left(2 + \frac{1}{k}\right)\)이 수렴함을 보이세요.

디리클레 판정법이 직접 적용되지 않는 이유도 설명하세요.`,
            en: String.raw`Show that \(\sum_{k=1}^{\infty} \frac{(-1)^k}{k}\left(2 + \frac{1}{k}\right)\) converges.

Also explain why Dirichlet's test does not apply directly.`,
          },
          display: [
            String.raw`a_k = \frac{(-1)^k}{k}, \qquad b_k = 2 + \frac{1}{k} \downarrow 2 \ne 0`,
            String.raw`\sum_{k=1}^{\infty} \frac{(-1)^k}{k}\left(2 + \frac{1}{k}\right) = -2\ln 2 - \frac{\pi^2}{12} \approx -2.2088`,
          ],
          preset: { example: 'shifted', n: 120 },
          presetCaption: {
            ko: String.raw`\(b_k = 2 + 1/k\)는 감소하면서 \(2\)로 가서 \(0\)에 가지 않습니다 — 점선 가중치가 \(0\)이 아닌 높이에 머무는 것을 보세요.`,
            en: String.raw`\(b_k = 2 + 1/k\) decreases to \(2\), never to \(0\) — see the dashed weight hovering at a nonzero height.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_k = (-1)^k/k\)라 두면 \(\sum a_k\)는 교대급수(라이프니츠 판정법)로 수렴하고, 실제로 그 합은 \(-\ln 2\)이다. \(b_k = 2 + 1/k\)는 감소수열이고 \(2 \le b_k \le 3\)이므로 유계이다.`,
                en: String.raw`Set \(a_k = (-1)^k/k\).

Then \(\sum a_k\) converges by the alternating series (Leibniz) test, with sum \(-\ln 2\).

And \(b_k = 2 + 1/k\) is decreasing and satisfies \(2 \le b_k \le 3\), hence bounded.`,
              },
            },
            {
              text: {
                ko: String.raw`아벨 판정법의 조건이 그대로 성립하므로 \(\sum_{k=1}^{\infty} a_k b_k = \sum_{k=1}^{\infty} \frac{(-1)^k}{k}\left(2 + \frac{1}{k}\right)\)은 수렴한다.`,
                en: String.raw`The hypotheses of Abel's test are satisfied verbatim, so \(\sum_{k=1}^{\infty} a_k b_k = \sum_{k=1}^{\infty} \frac{(-1)^k}{k}\left(2 + \frac{1}{k}\right)\) converges.`,
              },
            },
            {
              text: {
                ko: String.raw`디리클레 판정법이 직접 적용되지 않는 이유: 그 가설은 \(b_k\)가 단조로 \(0\)으로 가야 한다고 요구하는데, 여기서는 \(b_k \to 2 \ne 0\)이다. 물론 급수를 \(2\sum_{k=1}^{\infty} \frac{(-1)^k}{k} + \sum_{k=1}^{\infty} \frac{(-1)^k}{k^2}\)로 쪼개서 각각 수렴을 보일 수도 있지만, 그것은 아벨 판정법의 한계에 디리클레 판정법을 우회 적용하는 별개의 논증이지, 디리클레 판정법의 직접 적용이 아니다.`,
                en: String.raw`Why Dirichlet's test does not apply directly: its hypothesis demands \(b_k \to 0\) monotonically, but here \(b_k \to 2 \ne 0\). One may of course split the series as \(2\sum_{k=1}^{\infty} \frac{(-1)^k}{k} + \sum_{k=1}^{\infty} \frac{(-1)^k}{k^2}\) and prove convergence of each, but that is a separate workaround argument — not a direct application of Dirichlet's test.`,
              },
            },
            {
              text: {
                ko: String.raw`정확값도 구할 수 있다: \(\sum_{k=1}^{\infty} \frac{(-1)^k}{k^2} = -\eta(2) = -\frac{\pi^2}{12}\)이므로 극한은 \(-2\ln 2 - \pi^2/12 \approx -2.2088\)이다 — 미니 비주얼에서 \(S_{500} \approx -2.2068\)로 수렴하는 모습과 일치한다.`,
                en: String.raw`The exact value is available too: \(\sum_{k=1}^{\infty} \frac{(-1)^k}{k^2} = -\eta(2) = -\frac{\pi^2}{12}\), so the limit is \(-2\ln 2 - \pi^2/12 \approx -2.2088\) — matching the mini-visual, where \(S_{500} \approx -2.2068\).`,
              },
            },
          ],
        },
        {
          id: 'p3-scaled-weight',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{\infty} \frac{(-1)^k}{\sqrt{k}} \cdot \frac{k}{k+1}\)이 수렴함을 보이세요.`,
            en: String.raw`Show that \(\sum_{k=1}^{\infty} \frac{(-1)^k}{\sqrt{k}} \cdot \frac{k}{k+1}\) converges.`,
          },
          display: [
            String.raw`b_k = \frac{k}{k+1}, \qquad \frac{k}{k+1} < \frac{k+1}{k+2} \iff k(k+2) < (k+1)^2 \iff 0 < 1`,
          ],
          preset: { example: 'scaled', n: 120 },
          presetCaption: {
            ko: String.raw`\(S_{120} \approx -0.2090\): 가중치 \(\frac{k}{k+1}\)이 \(0\)에서 \(1\)로 올라가도 부분합은 안정됩니다.`,
            en: String.raw`\(S_{120} \approx -0.2090\): the partial sums settle even as the weight \(\frac{k}{k+1}\) climbs from \(0\) toward \(1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(a_k = (-1)^k/\sqrt{k}\)라 두면 \(1/\sqrt{k} \downarrow 0\)이므로 라이프니츠 판정법으로 \(\sum a_k\)가 수렴한다(조건수렴). \(b_k = \frac{k}{k+1}\)에 대해 \(b_k < b_{k+1}\)은 통분하면 \(k(k+2) < (k+1)^2\), 즉 \(k^2 + 2k < k^2 + 2k + 1\)과 동치이므로 \(0 < 1\)이 성립 — 따라서 \((b_k)\)는 증가수열이다.`,
                en: String.raw`Set \(a_k = (-1)^k/\sqrt{k}\).

Since \(1/\sqrt{k} \downarrow 0\), \(\sum a_k\) converges by the Leibniz test (conditionally).

For \(b_k = \frac{k}{k+1}\), the inequality \(b_k < b_{k+1}\) cross-multiplies to \(k(k+2) < (k+1)^2\), i.e. \(k^2 + 2k < k^2 + 2k + 1\), i.e. \(0 < 1\) — so \((b_k)\) is increasing.`,
              },
            },
            {
              text: {
                ko: String.raw`\(b_k = \frac{k}{k+1} = 1 - \frac{1}{k+1}\)이므로 \(0 < b_k < 1\) — 유계이고 \(\lim b_k = 1 \ne 0\)이다. 디리클레 판정법의 “\(b_k \to 0\)” 가설은 또다시 실패한다.`,
                en: String.raw`Since \(b_k = \frac{k}{k+1} = 1 - \frac{1}{k+1}\), we have \(0 < b_k < 1\) — bounded, with \(\lim b_k = 1 \ne 0\). The "\(b_k \to 0\)" hypothesis of Dirichlet's test fails again.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sum a_k\)가 수렴하고 \((b_k)\)가 단조·유계이므로 아벨 판정법에 의해 \(\sum_{k=1}^{\infty} \frac{(-1)^k}{\sqrt{k}} \cdot \frac{k}{k+1}\)은 수렴한다. 수치로도 확인할 수 있다: \(S_{120} \approx -0.2090\), \(S_{400} \approx -0.2292\), \(S_{500} \approx -0.2318\)로 꼬리가 안정된다.`,
                en: String.raw`Since \(\sum a_k\) converges and \((b_k)\) is monotone and bounded, Abel's test gives convergence of \(\sum_{k=1}^{\infty} \frac{(-1)^k}{\sqrt{k}} \cdot \frac{k}{k+1}\). Numerically: \(S_{120} \approx -0.2090\), \(S_{400} \approx -0.2292\), \(S_{500} \approx -0.2318\) — the tail settles.`,
              },
            },
          ],
        },
      ];
