import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'mvt-is-special-case',
          statement: {
            ko: String.raw`보통의 평균값 정리가 \(g(x) = x\)인 경우의 코시 평균값 정리임을 증명하세요.`,
            en: String.raw`Prove the ordinary Mean Value Theorem is Cauchy's theorem with \(g(x) = x\).`,
          },
          display: [
            String.raw`\frac{f(b)-f(a)}{g(b)-g(a)} = \frac{f'(\xi)}{g'(\xi)} \xrightarrow{g(x)=x} f'(\xi) = \frac{f(b)-f(a)}{b-a}`,
          ],
          preset: { xi: 1.56 },
          presetCaption: {
            ko: String.raw`\(\xi = 14/9 \approx 1.56\): 접선 비율 \(2/(3\xi) = 3/7\)이 할선 기울기와 일치합니다.`,
            en: String.raw`\(\xi = 14/9 \approx 1.56\): the tangent ratio \(2/(3\xi) = 3/7\) matches the chord slope.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`코시 평균값 정리: \(f, g\)가 \([a, b]\)에서 연속, \((a, b)\)에서 미분가능하고 \(g' \neq 0\)이면, 어떤 \(\xi \in (a, b)\)에 대해 \(\frac{f(b)-f(a)}{g(b)-g(a)} = \frac{f'(\xi)}{g'(\xi)}\)입니다.`,
                en: String.raw`Cauchy's theorem: if \(f, g\) are continuous on \([a, b]\), differentiable on \((a, b)\) with \(g' \neq 0\), then some \(\xi \in (a, b)\) satisfies \(\frac{f(b)-f(a)}{g(b)-g(a)} = \frac{f'(\xi)}{g'(\xi)}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(g(x) = x\)를 대입하면 \(g(b) - g(a) = b - a\), \(g'(\xi) = 1\)이므로 식은 \(\frac{f(b)-f(a)}{b-a} = \frac{f'(\xi)}{1} = f'(\xi)\)이 됩니다.`,
                en: String.raw`Substituting \(g(x) = x\) gives \(g(b) - g(a) = b - a\) and \(g'(\xi) = 1\), so the formula becomes \(\frac{f(b)-f(a)}{b-a} = \frac{f'(\xi)}{1} = f'(\xi)\).`,
              },
            },
            {
              text: {
                ko: String.raw`이것이 바로 보통의 평균값 정리입니다 — 코시 형태에서 \(g(x) = x\)를 택한 특수 경우입니다.`,
                en: String.raw`That is exactly the ordinary Mean Value Theorem — the Cauchy form with the special choice \(g(x) = x\).`,
              },
            },
          ],
        },
        {
          id: 'sin-x-over-x',
          statement: {
            ko: String.raw`코시 평균값 정리로 \(\lim_{x \to 0}\frac{\sin x}{x} = 1\)을 증명하세요.`,
            en: String.raw`Prove \(\lim_{x \to 0}\frac{\sin x}{x} = 1\) with Cauchy's Mean Value Theorem.`,
          },
          display: [
            String.raw`\frac{\sin x - \sin 0}{x - 0} = \frac{\cos \xi_x}{1}, \quad 0 < \xi_x < x \;\Rightarrow\; \cos \xi_x \to 1`,
          ],
          preset: { xi: 1.56 },
          presetCaption: {
            ko: String.raw`\(\xi = 14/9 \approx 1.56\) — 비율이 할선 기울기 \(\frac37\)와 일치하는 정리점입니다.`,
            en: String.raw`\(\xi = 14/9 \approx 1.56\) — the theorem point where the ratio equals the chord slope \(\frac37\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x > 0\)일 때 \(\frac{\sin x}{x} = \frac{\sin x - \sin 0}{x - 0}\)입니다. \(f(t) = \sin t\), \(g(t) = t\)는 모두 \([0, x]\)에서 연속이고 \((0, x)\)에서 미분가능하므로 코시 평균값 정리의 가정이 성립합니다. 구간 \([0, x]\)에서 이 정리를 적용하면 (\(g' = 1 \neq 0\)) 어떤 \(\xi_x \in (0, x)\)에 대해 \(\frac{\sin x - \sin 0}{x - 0} = \frac{\cos \xi_x}{1} = \cos \xi_x\)입니다.`,
                en: String.raw`For \(x > 0\), \(\frac{\sin x}{x} = \frac{\sin x - \sin 0}{x - 0}\). Both \(f(t) = \sin t\) and \(g(t) = t\) are continuous on \([0, x]\) and differentiable on \((0, x)\), so Cauchy's hypotheses hold. Applying Cauchy's theorem to them on \([0, x]\) (with \(g' = 1 \neq 0\)), some \(\xi_x \in (0, x)\) gives \(\frac{\sin x - \sin 0}{x - 0} = \frac{\cos \xi_x}{1} = \cos \xi_x\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(0 < \xi_x < x\)이므로 \(x \to 0^+\)일 때 조임으로 \(\xi_x \to 0\)입니다. \(\cos\)는 연속이므로 (미분가능 ⇒ 연속) \(\cos \xi_x \to \cos 0 = 1\)입니다.`,
                en: String.raw`Since \(0 < \xi_x < x\), squeezing gives \(\xi_x \to 0\) as \(x \to 0^+\). Cosine is continuous (differentiable implies continuous), so \(\cos \xi_x \to \cos 0 = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x < 0\)일 때는 \([x, 0]\) 구간에 같은 정리를 적용하면 \(\xi_x \in (x, 0)\)을 얻고 마찬가지로 \(\cos \xi_x \to 1\)입니다. 따라서 \(\lim_{x \to 0}\frac{\sin x}{x} = 1\)입니다.`,
                en: String.raw`For \(x < 0\), the same theorem on \([x, 0]\) yields \(\xi_x \in (x, 0)\) and likewise \(\cos \xi_x \to 1\). Hence \(\lim_{x \to 0}\frac{\sin x}{x} = 1\).`,
              },
            },
          ],
        },
        {
          id: 'exp-squared-limit',
          statement: {
            ko: String.raw`\(\lim_{x \to 0}\frac{e^x - 1 - x}{x^2} = \frac12\)를 코시 평균값 정리를 두 번 써서 증명하세요. (\(0/0\) 가정을 명시하세요.)`,
            en: String.raw`Prove \(\lim_{x \to 0}\frac{e^x - 1 - x}{x^2} = \frac12\) by applying Cauchy's theorem twice. (State the \(0/0\) hypotheses.)`,
          },
          display: [
            String.raw`\frac{e^x-1-x}{x^2} = \frac{e^{\xi}-1}{2\xi} = \frac{e^{\xi_2}}{2} \xrightarrow{x \to 0^+} \frac12`,
          ],
          preset: { xi: 1.56 },
          presetCaption: {
            ko: String.raw`\(\xi = 14/9 \approx 1.56\) — 정리점이 하나뿐인 이유를 보세요: 비율 \(2/(3t)\)가 단조감소하기 때문입니다.`,
            en: String.raw`\(\xi = 14/9 \approx 1.56\) — note there is only one theorem point, because the ratio \(2/(3t)\) is strictly decreasing.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = e^x - 1 - x\), \(g(x) = x^2\)라 두면 \(f(0) = g(0) = 0\)이고, \([0, x]\)(\(x > 0\))에서 연속, \((0, x)\)에서 미분가능하며 \(g'(t) = 2t \neq 0\)입니다.`,
                en: String.raw`Put \(f(x) = e^x - 1 - x\) and \(g(x) = x^2\): then \(f(0) = g(0) = 0\), both are continuous on \([0, x]\) (for \(x > 0\)), differentiable on \((0, x)\), and \(g'(t) = 2t \neq 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`코시 평균값 정리에 의해 어떤 \(\xi \in (0, x)\)에 대해 \(\frac{f(x)}{g(x)} = \frac{f'(\xi)}{g'(\xi)} = \frac{e^{\xi}-1}{2\xi}\)입니다. 다시 \(f_1(t) = e^t - 1\), \(g_1(t) = 2t\)에 \([0, \xi]\)에서 적용하면 (\(f_1(0) = g_1(0) = 0\), \(g_1' = 2 \neq 0\)) 어떤 \(\xi_2 \in (0, \xi)\)에 대해 \(\frac{e^{\xi}-1}{2\xi} = \frac{e^{\xi_2}}{2}\)를 얻습니다.`,
                en: String.raw`Cauchy's theorem gives \(\frac{f(x)}{g(x)} = \frac{f'(\xi)}{g'(\xi)} = \frac{e^{\xi}-1}{2\xi}\) for some \(\xi \in (0, x)\). Applying it again to \(f_1(t) = e^t - 1\), \(g_1(t) = 2t\) on \([0, \xi]\) (with \(f_1(0) = g_1(0) = 0\) and \(g_1' = 2 \neq 0\)) yields \(\frac{e^{\xi}-1}{2\xi} = \frac{e^{\xi_2}}{2}\) for some \(\xi_2 \in (0, \xi)\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(0 < \xi_2 < \xi < x\)이므로 \(x \to 0^+\)일 때 \(\xi_2 \to 0\)이고, \(e^t\)의 연속성에 의해 \(e^{\xi_2} \to 1\)입니다. 따라서 비율은 \(\frac12\)로 수렴합니다. \(x < 0\)도 \([x, 0]\)에서 같은 논리로 성립하므로 \(\lim_{x \to 0}\frac{e^x-1-x}{x^2} = \frac12\)입니다.`,
                en: String.raw`Since \(0 < \xi_2 < \xi < x\), \(x \to 0^+\) forces \(\xi_2 \to 0\), and continuity of \(e^t\) gives \(e^{\xi_2} \to 1\). So the ratio tends to \(\frac12\). The same argument on \([x, 0]\) covers \(x < 0\), hence \(\lim_{x \to 0}\frac{e^x-1-x}{x^2} = \frac12\).`,
              },
            },
          ],
        },
      ];
