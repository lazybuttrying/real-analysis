import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'reduction',
          statement: {
            ko: String.raw`\(n \ge 2\)일 때 \(I_n = \int_0^{\pi/2}\sin^n x\,dx\)가 점화식 \(I_n = \frac{n-1}{n}I_{n-2}\)를 만족함을 부분적분으로 증명하세요.`,
            en: String.raw`For \(n \ge 2\), prove \(I_n = \int_0^{\pi/2}\sin^n x\,dx\) satisfies \(I_n = \frac{n-1}{n}I_{n-2}\) by integration by parts.`,
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
                ko: String.raw`\(n \ge 2\)라고 둡니다 — 그래야 \(\sin^{n-2}x\)와 \(I_{n-2}\)가 정의되고 아래 경계항 논증이 성립합니다. \(I_n = \int_0^{\pi/2}\sin^{n-1}x\cdot\sin x\,dx\)에서 \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\)로 부분적분하면, \(I_n = \left[-\cos x\sin^{n-1}x\right]_0^{\pi/2} + (n-1)\int_0^{\pi/2}\cos^2x\sin^{n-2}x\,dx\)입니다.`,
                en: String.raw`Assume \(n \ge 2\) — this is what makes \(\sin^{n-2}x\) and \(I_{n-2}\) defined and the boundary-term argument below valid. Write \(I_n = \int_0^{\pi/2}\sin^{n-1}x\cdot\sin x\,dx\) and integrate by parts with \(u = \sin^{n-1}x\), \(dv = \sin x\,dx\): \(I_n = \left[-\cos x\sin^{n-1}x\right]_0^{\pi/2} + (n-1)\int_0^{\pi/2}\cos^2x\sin^{n-2}x\,dx\).`,
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
            ko: String.raw`\(n \ge 1\)일 때, \(0 \le x \le \frac{\pi}{2}\)에서 \(\sin^{2n+1}x \le \sin^{2n}x \le \sin^{2n-1}x\)임을 이용해 \(\frac{I_{2n}}{I_{2n+1}} \to 1\)을 보이고, 월리스 곱을 유도하세요.`,
            en: String.raw`For \(n \ge 1\), from \(\sin^{2n+1}x \le \sin^{2n}x \le \sin^{2n-1}x\) on \([0,\frac{\pi}{2}]\), show \(\frac{I_{2n}}{I_{2n+1}} \to 1\) and derive the Wallis product.`,
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
                ko: String.raw`\(n \ge 1\)이라 둡니다(\(n = 0\)이면 \(I_{-1}\)이 필요해 성립하지 않습니다).

적분하면 \(I_{2n+1} \le I_{2n} \le I_{2n-1}\)이므로, \(1 \le \frac{I_{2n}}{I_{2n+1}} \le \frac{I_{2n-1}}{I_{2n+1}} = \frac{2n+1}{2n} \to 1\)입니다.

조임 정리로 \(\frac{I_{2n}}{I_{2n+1}} \to 1\)입니다.`,
                en: String.raw`Take \(n \ge 1\) (\(n = 0\) would require \(I_{-1}\)).

Integrating gives \(I_{2n+1} \le I_{2n} \le I_{2n-1}\), so \(1 \le \frac{I_{2n}}{I_{2n+1}} \le \frac{I_{2n-1}}{I_{2n+1}} = \frac{2n+1}{2n} \to 1\).

By the squeeze theorem, \(\frac{I_{2n}}{I_{2n+1}} \to 1\).`,
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
                ko: String.raw`\(\frac{\pi}{2} \approx 1.57080\)이므로 절대 오차는 약 \(0.0697\)이고, 상대 오차는 \(\frac{0.0697}{1.57080} \approx 4.4\%\)입니다.`,
                en: String.raw`Since \(\frac{\pi}{2} \approx 1.57080\), the absolute error is about \(0.0697\), and the relative error is \(\frac{0.0697}{1.57080} \approx 4.4\%\).`,
              },
            },
            {
              text: {
                ko: String.raw`수렴이 느립니다 — 다섯 개 항으로는 약 \(4.4\%\)의 상대 오차(절대 오차 \(0.0697\))가 남습니다. (정확한 분수 계산은 테스트로 검증했습니다.)`,
                en: String.raw`Convergence is slow — five factors still leave about \(4.4\%\) relative error (absolute error \(0.0697\)). (The exact fraction is verified by test.)`,
              },
            },
          ],
        },
      ];
