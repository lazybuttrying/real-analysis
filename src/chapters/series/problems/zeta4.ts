import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
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
      ];
