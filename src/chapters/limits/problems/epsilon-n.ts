import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
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
                en: String.raw`Put \(N = \left\lceil \frac{1}{\sqrt{\varepsilon}} \right\rceil\).

If \(n > N\) then \(n > \frac{1}{\sqrt{\varepsilon}}\), so \(\left|a_n - 0\right| < \varepsilon\).

Hence \(a_n \to 0\) by the \(\varepsilon\)-\(N\) definition.`,
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
                ko: String.raw`\(\frac{1}{n+1} < \varepsilon\)은 \(n + 1 > \frac{1}{\varepsilon}\), 즉 \(n > \frac{1}{\varepsilon} - 1\)과 동치입니다.

\(\mathbb{R}\)의 아르키메데스 성질에 의해 \(\frac{1}{\varepsilon} - 1\)보다 큰 정수 \(N\)이 존재합니다.

그런 \(N\)을 잡으면 \(n > N\)일 때 \(\left|a_n - 1\right| < \varepsilon\)이므로 \(a_n \to 1\)입니다.`,
                en: String.raw`\(\frac{1}{n+1} < \varepsilon\) is equivalent to \(n + 1 > \frac{1}{\varepsilon}\), i.e. \(n > \frac{1}{\varepsilon} - 1\).

By the Archimedean property of \(\mathbb{R}\) there exists an integer \(N\) larger than \(\frac{1}{\varepsilon} - 1\).

Taking any such \(N\) gives \(\left|a_n - 1\right| < \varepsilon\) for \(n > N\), so \(a_n \to 1\).`,
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
                ko: String.raw`\(\varepsilon > 0\)이 주어지면, \(\mathbb{R}\)의 아르키메데스 성질에 의해 \(N > \frac{1}{\varepsilon}\)인 정수 \(N\)이 존재하므로 그런 \(N\)을 잡습니다. 그러면 \(n > N\)일 때 \(\frac{1}{n} < \varepsilon\)이므로 \(\left|a_n - 0\right| < \varepsilon\)입니다.`,
                en: String.raw`Given \(\varepsilon > 0\), by the Archimedean property of \(\mathbb{R}\) there exists an integer \(N > \frac{1}{\varepsilon}\); take any such \(N\). Then \(n > N\) implies \(\frac{1}{n} < \varepsilon\), so \(\left|a_n - 0\right| < \varepsilon\).`,
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
      ];
