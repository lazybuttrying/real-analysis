import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'decimal-truncations-cauchy',
          statement: {
            ko: String.raw`\(\sqrt{2}\)의 소수점 아래 \(n\)자리에서 자른 값 \(x_n = \frac{\lfloor \sqrt{2}\cdot 10^n \rfloor}{10^n}\)이라 하자. \((x_n)\)이 유리수 코시수열임을 증명하세요.`,
            en: String.raw`Let \(x_n = \frac{\lfloor \sqrt{2}\cdot 10^n \rfloor}{10^n}\) be \(\sqrt{2}\) cut off after \(n\) decimal places. Prove that \((x_n)\) is a Cauchy sequence of rationals.`,
          },
          display: [String.raw`|x_m - x_n| < 10^{-N} \quad (m, n \geq N)`],
          preset: { seq: 'decimal', n: 4 },
          presetCaption: {
            ko: String.raw`소수점 자르기, \(n = 4\) — 자릿수를 늘릴수록 항들이 구멍으로 모여든다.`,
            en: String.raw`Decimal truncations, \(n = 4\) — more digits pull the terms into the hole.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`각 \(x_n\)은 분모가 \(10^n\)인 분수이므로 유리수입니다. \(t_n = \lfloor \sqrt{2}\cdot 10^n \rfloor\)이라 두면, \(m \geq n\)일 때 \(t_m \geq 10^{m-n} t_n\)이므로 \(x_m \geq x_n\)입니다 — 자릿수를 늘리면 값은 커지거나 그대로입니다.`,
                en: String.raw`Each \(x_n\) is a fraction with denominator \(10^n\), hence rational. With \(t_n = \lfloor \sqrt{2}\cdot 10^n \rfloor\), for \(m \geq n\) we have \(t_m \geq 10^{m-n} t_n\), so \(x_m \geq x_n\) — adding digits never decreases the value.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\lfloor y \rfloor \leq y < \lfloor y \rfloor + 1\)에 \(y = \sqrt{2}\cdot 10^n\)을 대입하면 \(x_n \leq \sqrt{2} < x_n + 10^{-n}\)을 얻습니다. 즉 오차는 \(\lvert x_n - \sqrt{2}\rvert < 10^{-n}\)입니다.`,
                en: String.raw`Putting \(y = \sqrt{2}\cdot 10^n\) into \(\lfloor y \rfloor \leq y < \lfloor y \rfloor + 1\) gives \(x_n \leq \sqrt{2} < x_n + 10^{-n}\). So the error satisfies \(\lvert x_n - \sqrt{2}\rvert < 10^{-n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(m \geq n\)이면 \(0 \leq x_m - x_n < 10^{-n}\)입니다 (\(x_m \leq \sqrt{2}\)와 위 부등식을 함께 씁니다). 따라서 \(m, n \geq N\)일 때 \(\lvert x_m - x_n\rvert < 10^{-N} \to 0\) — \((x_n)\)은 유리수 코시수열입니다.`,
                en: String.raw`For \(m \geq n\) we get \(0 \leq x_m - x_n < 10^{-n}\) (combining \(x_m \leq \sqrt{2}\) with the bound above). Hence \(\lvert x_m - x_n\rvert < 10^{-N} \to 0\) whenever \(m, n \geq N\) — \((x_n)\) is a Cauchy sequence of rationals.`,
              },
            },
          ],
        },
        {
          id: 'same-class-different-sequence',
          statement: {
            ko: String.raw`\(a_n = 1 + \frac1n\)과 \(b_n = 1\)은 서로 다른 유리수 코시수열이지만 같은 실수를 정의함을 증명하세요.`,
            en: String.raw`Prove that \(a_n = 1 + \frac1n\) and \(b_n = 1\) are different rational Cauchy sequences defining the same real number.`,
          },
          display: [String.raw`a_n - b_n = \frac1n \to 0 \quad\Longrightarrow\quad [(a_n)] = [(b_n)] = 1`],
          preset: { seq: 'newton', n: 3 },
          presetCaption: {
            ko: String.raw`바빌로니아 수열 — 소수점 자르기와는 다른 수열이지만 같은 구멍 \(\sqrt{2}\)로 모인다.`,
            en: String.raw`The Babylonian sequence — a different sequence marching into the same hole \(\sqrt{2}\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\((a_n)\)과 \((b_n)\)은 모두 유리수 수열입니다. 차이는 \(a_n - b_n = \frac1n \to 0\)이므로, 동치 관계의 정의에 의해 \((a_n) \sim (b_n)\)입니다.`,
                en: String.raw`Both \((a_n)\) and \((b_n)\) are rational sequences. Their difference is \(a_n - b_n = \frac1n \to 0\), so \((a_n) \sim (b_n)\) by the definition of the equivalence relation.`,
              },
            },
            {
              text: {
                ko: String.raw`동치인 코시수열은 같은 동치류를 정의하므로 \([(a_n)] = [(b_n)]\)입니다. 겉모습은 다르지만 실수로는 하나입니다.`,
                en: String.raw`Equivalent Cauchy sequences define the same class, so \([(a_n)] = [(b_n)]\) — different on the surface, one real number underneath.`,
              },
            },
            {
              text: {
                ko: String.raw`상수수열 \((1, 1, 1, \dots)\)의 동치류는 유리수 \(1\) 자체가 실수로 들어간 모습입니다. 따라서 \([(a_n)] = 1\) — 수열 \((1+\frac1n)\)이 "수렴하는 대상"이 실수 \(1\)입니다.`,
                en: String.raw`The class of the constant sequence \((1, 1, 1, \dots)\) is the rational \(1\) sitting inside the reals. Hence \([(a_n)] = 1\) — the thing \((1+\frac1n)\) "converges to" is the real number \(1\).`,
              },
            },
          ],
        },
        {
          id: 'sum-of-cauchy',
          statement: {
            ko: String.raw`유리수 코시수열 \((x_n)\), \((y_n)\)에 대해 항별 합 \((x_n + y_n)\)도 코시수열임을 증명하세요.`,
            en: String.raw`Prove that the termwise sum \((x_n + y_n)\) of two rational Cauchy sequences is again Cauchy.`,
          },
          display: [String.raw`|(x_m+y_m)-(x_n+y_n)| \leq |x_m-x_n| + |y_m-y_n|`],
          preset: { seq: 'decimal', n: 5 },
          presetCaption: {
            ko: String.raw`소수점 자르기, \(n = 5\) — 코시수열끼리 더해도 코시수열이라 덧셈이 잘 정의된다.`,
            en: String.raw`Decimal truncations, \(n = 5\) — sums of Cauchy sequences stay Cauchy, so addition is well-defined.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이라 하자. \((x_n)\)이 코시수열이므로 \(m, n \geq N_1 \Rightarrow \lvert x_m - x_n\rvert < \frac{\varepsilon}{2}\)인 \(N_1\)이 있고, \((y_n)\)에 대해서도 마찬가지로 \(N_2\)가 있습니다.`,
                en: String.raw`Let \(\varepsilon > 0\). Since \((x_n)\) is Cauchy, there is \(N_1\) with \(\lvert x_m - x_n\rvert < \frac{\varepsilon}{2}\) for \(m, n \geq N_1\), and likewise \(N_2\) for \((y_n)\).`,
              },
            },
            {
              text: {
                ko: String.raw`삼각부등식으로 \(\lvert (x_m+y_m) - (x_n+y_n)\rvert \leq \lvert x_m - x_n\rvert + \lvert y_m - y_n\rvert\)입니다.`,
                en: String.raw`By the triangle inequality, \(\lvert (x_m+y_m) - (x_n+y_n)\rvert \leq \lvert x_m - x_n\rvert + \lvert y_m - y_n\rvert\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N = \max(N_1, N_2)\)라 두면 \(m, n \geq N\)일 때 우변은 \(\frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\)보다 작습니다. 따라서 \((x_n + y_n)\)은 코시수열입니다. 대표원을 \((x'_n) \sim (x_n)\)으로 바꿔도 \((x_n+y_n) - (x'_n+y_n) = (x_n - x'_n) \to 0\)이므로 같은 동치류 — 덧셈은 대표원 선택과 무관하게 잘 정의됩니다.`,
                en: String.raw`With \(N = \max(N_1, N_2)\), the right-hand side is below \(\frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\) for \(m, n \geq N\). So \((x_n + y_n)\) is Cauchy. Changing representatives to \((x'_n) \sim (x_n)\) still gives \((x_n+y_n) - (x'_n+y_n) = (x_n - x'_n) \to 0\), hence the same class — addition is well-defined, independent of the chosen representatives.`,
              },
            },
          ],
        },
      ];
