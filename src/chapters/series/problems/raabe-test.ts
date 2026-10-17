import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'raabe-test-proof',
          statement: {
            ko: String.raw`라베 판정법을 진술하고, \(p\)-급수와의 비교를 이용해 증명하세요.`,
            en: String.raw`State Raabe's test and prove it by comparison with the \(p\)-series.`,
          },
          display: [String.raw`L=\lim_{k\to\infty}k\left(\frac{a_k}{a_{k+1}}-1\right),\qquad L>1\Rightarrow\sum a_k\ \text{converges},\quad L<1\Rightarrow\sum a_k\ \text{diverges}`],
          preset: { example: 'central', n: 100 },
          presetCaption: {
            ko: String.raw`\(n = 100\): \(R_{100} \approx 1.4975\) — 경계 \(1\) 위에 안착하며 \(\frac{3}{2}\)를 향해 올라갑니다.`,
            en: String.raw`\(n = 100\): \(R_{100} \approx 1.4975\) — settling above the boundary \(1\), climbing toward \(\frac{3}{2}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`라베 판정법: \(a_k > 0\)이고 \(L = \lim_{k\to\infty} k\left(\frac{a_k}{a_{k+1}} - 1\right)\)가 존재하면, \(L > 1\)일 때 \(\sum a_k\)는 수렴하고, \(L < 1\)일 때 \(\sum a_k\)는 발산합니다. (이하 모든 부등식은 충분히 큰 \(k\)에서 성립한다고 읽으세요.)`,
                en: String.raw`Raabe's test: if \(a_k > 0\) and \(L = \lim_{k\to\infty} k\left(\frac{a_k}{a_{k+1}} - 1\right)\) exists, then \(\sum a_k\) converges when \(L > 1\) and diverges when \(L < 1\). (Read every inequality below as holding for all large \(k\).)`,
              },
            },
            {
              text: {
                ko: String.raw`기준으로 쓸 비교 급수는 \(p\)-급수 \(b_k = \frac{1}{k^r}\)입니다. \(\frac{b_k}{b_{k+1}} = \left(\frac{k+1}{k}\right)^r = \left(1+\frac{1}{k}\right)^r\)이고, \(\left(1+\frac{1}{k}\right)^r = 1+\frac{r}{k}+o\left(\frac{1}{k}\right)\)이므로 \(k\left(\frac{b_k}{b_{k+1}}-1\right) \to r\)입니다 — 즉 \(b_k\)는 라베 값이 정확히 \(r\)인 급수입니다.`,
                en: String.raw`The comparison benchmark is the \(p\)-series \(b_k = \frac{1}{k^r}\). Since \(\frac{b_k}{b_{k+1}} = \left(\frac{k+1}{k}\right)^r = \left(1+\frac{1}{k}\right)^r\) and \(\left(1+\frac{1}{k}\right)^r = 1+\frac{r}{k}+o\left(\frac{1}{k}\right)\), we get \(k\left(\frac{b_k}{b_{k+1}}-1\right) \to r\) — so \(b_k\) is a series whose Raabe value is exactly \(r\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(L > 1\)인 경우: \(1 < r < L\)인 \(r\)을 잡습니다. \(k\left(\frac{a_k}{a_{k+1}}-1\right)\)는 \(L\)로, \(k\left(\frac{b_k}{b_{k+1}}-1\right)\)는 \(r\)로 수렴하므로, 결국 \(\frac{a_k}{a_{k+1}}-1 > \frac{b_k}{b_{k+1}}-1\), 즉 \(\frac{a_{k+1}}{a_k} < \frac{b_{k+1}}{b_k}\)가 성립합니다. \(a_{k+1}b_k < a_k b_{k+1}\), 즉 \(\frac{a_{k+1}}{b_{k+1}} < \frac{a_k}{b_k}\)이므로 \(\frac{a_k}{b_k}\)는 단조감소하고 \(a_k \le Cb_k\)가 되어, 수렴하는 \(\sum b_k\) (\(\(r > 1\))와 비교 판정법으로 \(\sum a_k\)가 수렴합니다.`,
                en: String.raw`If \(L > 1\): pick \(r\) with \(1 < r < L\). Since \(k\left(\frac{a_k}{a_{k+1}}-1\right) \to L\) and \(k\left(\frac{b_k}{b_{k+1}}-1\right) \to r\), eventually \(\frac{a_k}{a_{k+1}}-1 > \frac{b_k}{b_{k+1}}-1\), i.e. \(\frac{a_{k+1}}{a_k} < \frac{b_{k+1}}{b_k}\). Then \(a_{k+1}b_k < a_k b_{k+1}\), i.e. \(\frac{a_{k+1}}{b_{k+1}} < \frac{a_k}{b_k}\), so \(\frac{a_k}{b_k}\) decreases and \(a_k \le Cb_k\); comparing with the convergent \(\sum b_k\) (\(r > 1\)), \(\sum a_k\) converges.`,
              },
            },
            {
              text: {
                ko: String.raw`\(L < 1\)인 경우: \(L < r < 1\)인 \(r\)을 잡으면 부등식이 뒤집혀 \(\frac{a_{k+1}}{a_k} > \frac{b_{k+1}}{b_k}\)가 되고, \(\frac{a_k}{b_k}\)는 단조증가하여 \(a_k \ge cb_k\) (\(c > 0\))를 얻습니다. 발산하는 \(\sum b_k\) (\(\(r < 1\))와의 비교 판정법으로 \(\sum a_k\)가 발산합니다.`,
                en: String.raw`If \(L < 1\): picking \(r\) with \(L < r < 1\) reverses the inequalities to \(\frac{a_{k+1}}{a_k} > \frac{b_{k+1}}{b_k}\); then \(\frac{a_k}{b_k}\) increases, so \(a_k \ge cb_k\) (\(c > 0\)), and comparing with the divergent \(\sum b_k\) (\(r < 1\)) gives divergence of \(\sum a_k\).`,
              },
            },
          ],
        },
        {
          id: 'raabe-central-binomial',
          statement: {
            ko: String.raw`\(u_k = \frac{\binom{2k}{k}}{4^k}\)에 대해 \(a_k = \frac{u_k}{2k+1}\)이라 둘 때, \(\sum_{k=1}^{\infty} a_k\)가 수렴함을 라베 판정법으로 증명하세요. 비율 판정법이 왜 침묵하는지도 보이세요.`,
            en: String.raw`With \(u_k = \frac{\binom{2k}{k}}{4^k}\) and \(a_k = \frac{u_k}{2k+1}\), prove \(\sum_{k=1}^{\infty} a_k\) converges via Raabe's test, and show why the ratio test stays silent.`,
          },
          display: [String.raw`\frac{a_k}{a_{k+1}}=\frac{2(k+1)(2k+3)}{(2k+1)^2},\qquad R_k=k\left(\frac{a_k}{a_{k+1}}-1\right)=\frac{k(6k+5)}{4k^2+4k+1}\to\frac{3}{2}>1`],
          preset: { example: 'central', n: 30 },
          presetCaption: {
            ko: String.raw`\(n = 30\): \(R_{30} \approx 1.4915\) (경계 \(1\) 위), \(r_{30} \approx 0.9526\) — \(r_k\)는 1에 달라붙지만 \(R_k\)는 1 위에 안착합니다.`,
            en: String.raw`\(n = 30\): \(R_{30} \approx 1.4915\) (above the boundary \(1\)), \(r_{30} \approx 0.9526\) — \(r_k\) clings to 1 while \(R_k\) settles above 1.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`먼저 비율부터 계산합니다. \(\frac{u_{k+1}}{u_k} = \frac{(2k+2)(2k+1)}{(k+1)^2}\cdot\frac{1}{4} = \frac{2k+1}{2k+2}\)이므로, \(\frac{a_k}{a_{k+1}} = \frac{u_k}{u_{k+1}}\cdot\frac{2k+3}{2k+1} = \frac{2k+2}{2k+1}\cdot\frac{2k+3}{2k+1} = \frac{2(k+1)(2k+3)}{(2k+1)^2}\)입니다.`,
                en: String.raw`First the ratio: \(\frac{u_{k+1}}{u_k} = \frac{(2k+2)(2k+1)}{(k+1)^2}\cdot\frac{1}{4} = \frac{2k+1}{2k+2}\), so \(\frac{a_k}{a_{k+1}} = \frac{u_k}{u_{k+1}}\cdot\frac{2k+3}{2k+1} = \frac{2k+2}{2k+1}\cdot\frac{2k+3}{2k+1} = \frac{2(k+1)(2k+3)}{(2k+1)^2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`분자를 전개하면 \(2(k+1)(2k+3) = 4k^2+10k+6\)이고 분모는 \((2k+1)^2 = 4k^2+4k+1\)이므로, \(\frac{a_k}{a_{k+1}}-1 = \frac{6k+5}{4k^2+4k+1}\)입니다. 따라서 \(R_k = k\frac{6k+5}{4k^2+4k+1} \to \frac{6}{4} = \frac{3}{2} > 1\)이며, 라베 판정법으로 \(\sum a_k\)는 수렴합니다.`,
                en: String.raw`Expanding, the numerator is \(2(k+1)(2k+3) = 4k^2+10k+6\) and the denominator is \((2k+1)^2 = 4k^2+4k+1\), so \(\frac{a_k}{a_{k+1}}-1 = \frac{6k+5}{4k^2+4k+1}\). Hence \(R_k = k\frac{6k+5}{4k^2+4k+1} \to \frac{6}{4} = \frac{3}{2} > 1\), and \(\sum a_k\) converges by Raabe's test.`,
              },
            },
            {
              text: {
                ko: String.raw`한편 \(\frac{a_{k+1}}{a_k} = \frac{4k^2+4k+1}{4k^2+10k+6} \to 1\)이므로 비율 판정법은 극한이 \(1\)이라 아무 결론도 내지 못합니다: \(r_1 = \frac{9}{20}, r_2 = \frac{25}{42}, r_3 = \frac{49}{72}\)에서 시작해 위로 기어오릅니다. 라베의 \(R_k\)가 비율보다 한 단계 더 깊이 들여다본 것입니다.`,
                en: String.raw`Meanwhile \(\frac{a_{k+1}}{a_k} = \frac{4k^2+4k+1}{4k^2+10k+6} \to 1\), so the ratio test is inconclusive — the limit is \(1\): starting from \(r_1 = \frac{9}{20}, r_2 = \frac{25}{42}, r_3 = \frac{49}{72}\) it crawls upward toward \(1\). Raabe's \(R_k\) looks one order deeper than the ratio.`,
              },
            },
          ],
        },
        {
          id: 'raabe-boundary-inconclusive',
          statement: {
            ko: String.raw`\(k \ge 2\)에서 \(a_k = \frac{1}{k(\ln k)^p}\)라 둘 때, 모든 \(p\)에 대해 라베 극한이 \(1\)임을 보이고, 이 경계가 진짜로 결론을 내지 못함을 — \(\sum_{k\ge 2}\frac{1}{k(\ln k)^2}\)는 수렴하고 \(\sum_{k\ge 2}\frac{1}{k\ln k}\)는 발산하므로 — 적분 판정법으로 증명하세요.`,
            en: String.raw`For \(a_k = \frac{1}{k(\ln k)^p}\) (\(k \ge 2\)), show the Raabe limit is \(1\) for every \(p\), and prove the boundary \(L = 1\) is genuinely inconclusive — \(\sum_{k\ge 2}\frac{1}{k(\ln k)^2}\) converges while \(\sum_{k\ge 2}\frac{1}{k\ln k}\) diverges — via the integral test.`,
          },
          display: [String.raw`k\left(\frac{a_k}{a_{k+1}}-1\right)=1+\frac{p}{\ln k}+o(1)\to 1\qquad(\text{for every }p)`],
          preset: { example: 'log', n: 200 },
          presetCaption: {
            ko: String.raw`\(n = 200\): \(p = 2\)는 \(R_{200} \approx 1.3786\), \(p = 1\)은 \(R_{200} \approx 1.1892\) — 둘 다 \(1\)로 기어내려갑니다.`,
            en: String.raw`\(n = 200\): \(R_{200} \approx 1.3786\) for \(p = 2\), \(R_{200} \approx 1.1892\) for \(p = 1\) — both crawling down to \(1\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\frac{a_k}{a_{k+1}} = \frac{k+1}{k}\left(\frac{\ln(k+1)}{\ln k}\right)^p = \left(1+\frac{1}{k}\right)\left(1+\frac{\ln(1+1/k)}{\ln k}\right)^p\)입니다. \(\ln\left(1+\frac{1}{k}\right) = \frac{1}{k}+O\left(\frac{1}{k^2}\right)\)이고 \((1+x)^p = 1+px+o(x)\)이므로, 괄호 안은 \(1+\frac{p}{k\ln k}+o\left(\frac{1}{k}\right)\)가 됩니다.`,
                en: String.raw`\(\frac{a_k}{a_{k+1}} = \frac{k+1}{k}\left(\frac{\ln(k+1)}{\ln k}\right)^p = \left(1+\frac{1}{k}\right)\left(1+\frac{\ln(1+1/k)}{\ln k}\right)^p\). With \(\ln\left(1+\frac{1}{k}\right) = \frac{1}{k}+O\left(\frac{1}{k^2}\right)\) and \((1+x)^p = 1+px+o(x)\), the parenthesis is \(1+\frac{p}{k\ln k}+o\left(\frac{1}{k}\right)\).`,
              },
            },
            {
              text: {
                ko: String.raw`곱하면 \(\frac{a_k}{a_{k+1}} = 1+\frac{1}{k}+\frac{p}{k\ln k}+o\left(\frac{1}{k}\right)\)이므로, \(k\left(\frac{a_k}{a_{k+1}}-1\right) = 1+\frac{p}{\ln k}+o(1) \to 1\)입니다 — \(p\)가 무엇이든 라베 극한은 \(1\)로 같습니다.`,
                en: String.raw`Multiplying out, \(\frac{a_k}{a_{k+1}} = 1+\frac{1}{k}+\frac{p}{k\ln k}+o\left(\frac{1}{k}\right)\), so \(k\left(\frac{a_k}{a_{k+1}}-1\right) = 1+\frac{p}{\ln k}+o(1) \to 1\) — the Raabe limit is \(1\) for every \(p\).`,
              },
            },
            {
              text: {
                ko: String.raw`그러나 두 급수의 운명은 다릅니다. \(t = \ln x\)로 치환하면 \(\int_2^{\infty}\frac{dx}{x(\ln x)^p} = \int_{\ln 2}^{\infty}\frac{dt}{t^p}\)이므로, 적분 판정법으로 \(\sum_{k\ge 2}\frac{1}{k(\ln k)^2}\)는 \(\int_{\ln 2}^{\infty}t^{-2}\,dt = \frac{1}{\ln 2}\)로 수렴하고, \(\sum_{k\ge 2}\frac{1}{k\ln k}\)는 \(\int_{\ln 2}^{\infty}t^{-1}\,dt = \infty\)로 발산합니다. \(L = 1\)에서는 라베 판정법이 진짜로 침묵합니다.`,
                en: String.raw`Yet the two series have opposite fates. Substituting \(t = \ln x\), \(\int_2^{\infty}\frac{dx}{x(\ln x)^p} = \int_{\ln 2}^{\infty}\frac{dt}{t^p}\); by the integral test \(\sum_{k\ge 2}\frac{1}{k(\ln k)^2}\) converges (\(\int_{\ln 2}^{\infty}t^{-2}\,dt = \frac{1}{\ln 2}\)) while \(\sum_{k\ge 2}\frac{1}{k\ln k}\) diverges (\(\int_{\ln 2}^{\infty}t^{-1}\,dt = \infty\)). At \(L = 1\) Raabe's test is genuinely silent.`,
              },
            },
          ],
        },
      ];
