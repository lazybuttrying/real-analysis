import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'polynomial-continuous',
          statement: {
            ko: String.raw`연속함수들의 합과 곱이 연속임을 증명하고, 이로부터 모든 다항식이 연속임을 보이세요.`,
            en: String.raw`Prove that sums and products of continuous functions are continuous, and deduce that every polynomial is continuous.`,
          },
          display: [
            String.raw`\lvert f(x)g(x) - f(a)g(a)\rvert \leq \lvert f(x)\rvert\cdot\lvert g(x) - g(a)\rvert + \lvert g(a)\rvert\cdot\lvert f(x) - f(a)\rvert`,
          ],
          preset: { a: 1, broken: false },
          presetCaption: {
            ko: String.raw`\(a = 1\), 온전한 포물선 — 다항식은 모든 점에서 연속입니다.`,
            en: String.raw`\(a = 1\), the intact parabola — polynomials are continuous everywhere.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`상수함수 \(c\): \(\lvert c - c\rvert = 0 < \varepsilon\)이므로 연속입니다. 항등함수 \(x \mapsto x\): \(\lvert x - a\rvert < \delta\)에서 \(\lvert x - a\rvert < \varepsilon\)이 되도록 \(\delta = \varepsilon\)을 잡으면 됩니다.`,
                en: String.raw`Constants \(c\): \(\lvert c - c\rvert = 0 < \varepsilon\), so continuous. The identity \(x \mapsto x\): \(\delta = \varepsilon\) works, since \(\lvert x - a\rvert < \delta\) gives \(\lvert x - a\rvert < \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`(합) \(f, g\)가 \(a\)에서 연속이라 하자. \(\varepsilon > 0\)에 대해 \(\lvert f(x) - f(a)\rvert < \frac{\varepsilon}{2}\)인 \(\delta_1\)과 \(\lvert g(x) - g(a)\rvert < \frac{\varepsilon}{2}\)인 \(\delta_2\)를 잡고 \(\delta = \min(\delta_1, \delta_2)\)라 두면, \(\lvert (f+g)(x) - (f+g)(a)\rvert \leq \lvert f(x) - f(a)\rvert + \lvert g(x) - g(a)\rvert < \varepsilon\)입니다.`,
                en: String.raw`(Sum) Let \(f, g\) be continuous at \(a\). Given \(\varepsilon > 0\), take \(\delta_1\) with \(\lvert f(x) - f(a)\rvert < \frac{\varepsilon}{2}\) and \(\delta_2\) with \(\lvert g(x) - g(a)\rvert < \frac{\varepsilon}{2}\); with \(\delta = \min(\delta_1, \delta_2)\), \(\lvert (f+g)(x) - (f+g)(a)\rvert \leq \lvert f(x) - f(a)\rvert + \lvert g(x) - g(a)\rvert < \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`(곱) 항등식 \(\lvert f(x)g(x) - f(a)g(a)\rvert \leq \lvert f(x)\rvert\cdot\lvert g(x) - g(a)\rvert + \lvert g(a)\rvert\cdot\lvert f(x) - f(a)\rvert\)를 씁니다.

먼저 \(f\)를 \(a\) 근처에서 가둡니다: \(f\)의 연속성에 의해 \(\lvert x - a\rvert < \delta_0\)이면 \(\lvert f(x) - f(a)\rvert < 1\)인 \(\delta_0\)가 존재하고, 그 안에서는 \(\lvert f(x)\rvert \leq \lvert f(a)\rvert + 1 =: M\)입니다(국소 유계성).

이제 \(\lvert g(x) - g(a)\rvert < \frac{\varepsilon}{2M}\)인 \(\delta_1\)과 \(\lvert f(x) - f(a)\rvert < \frac{\varepsilon}{2(\lvert g(a)\rvert + 1)}\)인 \(\delta_2\)를 잡고 \(\delta = \min(\delta_0, \delta_1, \delta_2)\)라 두면, \(\lvert f(x)g(x) - f(a)g(a)\rvert < M \cdot \frac{\varepsilon}{2M} + \lvert g(a)\rvert \cdot \frac{\varepsilon}{2(\lvert g(a)\rvert+1)} < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\)입니다.`,
                en: String.raw`(Product) Use the identity \(\lvert f(x)g(x) - f(a)g(a)\rvert \leq \lvert f(x)\rvert\cdot\lvert g(x) - g(a)\rvert + \lvert g(a)\rvert\cdot\lvert f(x) - f(a)\rvert\).

First bound \(f\) near \(a\): by continuity of \(f\) there is \(\delta_0\) with \(\lvert f(x) - f(a)\rvert < 1\) for \(\lvert x - a\rvert < \delta_0\), hence \(\lvert f(x)\rvert \leq \lvert f(a)\rvert + 1 =: M\) there (local boundedness).

Now take \(\delta_1\) with \(\lvert g(x) - g(a)\rvert < \frac{\varepsilon}{2M}\) and \(\delta_2\) with \(\lvert f(x) - f(a)\rvert < \frac{\varepsilon}{2(\lvert g(a)\rvert + 1)}\); with \(\delta = \min(\delta_0, \delta_1, \delta_2)\) we get \(\lvert f(x)g(x) - f(a)g(a)\rvert < M \cdot \frac{\varepsilon}{2M} + \lvert g(a)\rvert \cdot \frac{\varepsilon}{2(\lvert g(a)\rvert+1)} < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`귀납법으로 \(x^n\)이 연속임을 보입니다.

Base case: \(n = 0\)이면 \(x^0 = 1\)은 위에서 보인 상수함수라 연속이고, \(n = 1\)이면 \(x^1 = x\)는 위에서 보인 항등함수라 연속입니다.

Inductive step: \(x^n\)이 연속이라 가정하면 \(x^{n+1} = x^n \cdot x\)는 연속함수들의 곱이라 곱 규칙으로 연속입니다.

따라서 모든 \(n \ge 0\)에 대해 \(x^n\)이 연속입니다.

이어서 \(c x^n\)도 연속이며(상수 \(\times\) 연속, 곱 규칙), 유한개의 항 \(c_k x^k\)들의 합인 임의의 다항식도 연속입니다(합 규칙을 유한 번 반복).`,
                en: String.raw`We show \(x^n\) is continuous by induction.

Base cases: for \(n = 0\), \(x^0 = 1\) is the constant function proved continuous above; for \(n = 1\), \(x^1 = x\) is the identity proved continuous above.

Inductive step: if \(x^n\) is continuous, then \(x^{n+1} = x^n \cdot x\) is a product of continuous functions, hence continuous by the product rule.

So \(x^n\) is continuous for every \(n \ge 0\).

Then \(c x^n\) is continuous (constant times continuous, by the product rule), and any polynomial — a finite sum of such terms \(c_k x^k\) — is continuous (the sum rule, applied finitely many times).`,
              },
            },
          ],
        },
        {
          id: 'abs-continuous',
          statement: {
            ko: String.raw`\(\lvert x\rvert\)가 \(0\)에서 연속임을 \(\delta = \varepsilon\)으로 증명하세요.`,
            en: String.raw`Prove \(\lvert x\rvert\) is continuous at \(0\) with \(\delta = \varepsilon\).`,
          },
          display: [String.raw`\left\lvert \lvert x\rvert - 0 \right\rvert = \lvert x\rvert < \varepsilon`],
          preset: { a: 0, broken: false },
          presetCaption: {
            ko: String.raw`\(a = 0\) — 뾰족점에서도 연속성은 살아 있습니다 (미분가능성과는 다른 이야기입니다).`,
            en: String.raw`\(a = 0\) — continuity survives the cusp (differentiability is another story).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`보일 것은 \(\lvert x - 0\rvert < \delta \Rightarrow \lvert \lvert x\rvert - \lvert 0\rvert \rvert < \varepsilon\)입니다. 그런데 \(\lvert \lvert x\rvert - 0\rvert = \lvert x\rvert\)이므로, 문제는 \(\lvert x\rvert < \varepsilon\)을 얻는 것으로 줄어듭니다.`,
                en: String.raw`We need \(\lvert x - 0\rvert < \delta \Rightarrow \lvert \lvert x\rvert - \lvert 0\rvert \rvert < \varepsilon\). But \(\lvert \lvert x\rvert - 0\rvert = \lvert x\rvert\), so it suffices to get \(\lvert x\rvert < \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\delta = \varepsilon\)이라 두면 \(\lvert x - 0\rvert = \lvert x\rvert < \delta = \varepsilon\)이 바로 원하는 부등식입니다. 따라서 \(\lvert x\rvert\)는 \(0\)에서 연속입니다.`,
                en: String.raw`Put \(\delta = \varepsilon\): then \(\lvert x - 0\rvert = \lvert x\rvert < \delta = \varepsilon\) is exactly the desired inequality. Hence \(\lvert x\rvert\) is continuous at \(0\).`,
              },
            },
            {
              text: {
                ko: String.raw`[관점] 연속이 미분을 보장하지는 않습니다: \(\lvert x\rvert\)는 \(0\)에서 미분가능하지 않습니다. 연속은 "끊어지지 않음"일 뿐, "매끄러움"이 아닙니다.`,
                en: String.raw`[framing] Continuity does not imply differentiability: \(\lvert x\rvert\) is not differentiable at \(0\). Continuity is "no breaks", not "smoothness".`,
              },
            },
          ],
        },
        {
          id: 'composition-continuous',
          statement: {
            ko: String.raw`\(f\)가 \(a\)에서 연속이고 \(g\)가 \(f(a)\)에서 연속이면, 합성함수 \(h = g \circ f\)가 \(a\)에서 연속임을 증명하세요.`,
            en: String.raw`If \(f\) is continuous at \(a\) and \(g\) is continuous at \(f(a)\), prove \(h = g \circ f\) is continuous at \(a\).`,
          },
          display: [String.raw`\lvert x - a\rvert < \delta \Rightarrow \lvert f(x) - f(a)\rvert < \eta \Rightarrow \lvert g(f(x)) - g(f(a))\rvert < \varepsilon`],
          preset: { a: -1, broken: false },
          presetCaption: {
            ko: String.raw`\(a = -1\) — 연속성은 합성을 타고 전해집니다: \(\varepsilon \leftarrow \eta \leftarrow \delta\) 사슬.`,
            en: String.raw`\(a = -1\) — continuity travels through composition: the chain \(\varepsilon \leftarrow \eta \leftarrow \delta\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 주어졌습니다. \(g\)가 \(b = f(a)\)에서 연속이므로, \(\lvert y - b\rvert < \eta\)이면 \(\lvert g(y) - g(b)\rvert < \varepsilon\)인 \(\eta > 0\)이 존재합니다.`,
                en: String.raw`Let \(\varepsilon > 0\). Since \(g\) is continuous at \(b = f(a)\), there is \(\eta > 0\) with \(\lvert g(y) - g(b)\rvert < \varepsilon\) whenever \(\lvert y - b\rvert < \eta\).`,
              },
            },
            {
              text: {
                ko: String.raw`이제 \(f\)의 연속성을 \(\eta\)에 적용합니다: \(\lvert x - a\rvert < \delta\)이면 \(\lvert f(x) - f(a)\rvert < \eta\)인 \(\delta > 0\)이 존재합니다.`,
                en: String.raw`Now apply the continuity of \(f\) to \(\eta\): there is \(\delta > 0\) with \(\lvert f(x) - f(a)\rvert < \eta\) whenever \(\lvert x - a\rvert < \delta\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\lvert x - a\rvert < \delta\)이면 \(\lvert f(x) - b\rvert < \eta\)이므로 \(\lvert g(f(x)) - g(b)\rvert < \varepsilon\), 즉 \(\lvert h(x) - h(a)\rvert < \varepsilon\)입니다. 따라서 \(h\)는 \(a\)에서 연속입니다.`,
                en: String.raw`If \(\lvert x - a\rvert < \delta\) then \(\lvert f(x) - b\rvert < \eta\), so \(\lvert g(f(x)) - g(b)\rvert < \varepsilon\), i.e. \(\lvert h(x) - h(a)\rvert < \varepsilon\). Hence \(h\) is continuous at \(a\).`,
              },
            },
            {
              text: {
                ko: String.raw`수치 예시: \(g\)가 \(\eta = \frac{\varepsilon}{2}\)를 요구하고 \(f\)가 그 \(\eta\)에 대해 \(\delta = \frac{\eta}{2}\)를 내놓으면, 합성은 \(\delta = \frac{\varepsilon}{4}\)로 동작합니다 — 허용 오차가 사슬을 따라 합성됩니다.`,
                en: String.raw`Numerically: if \(g\) demands \(\eta = \frac{\varepsilon}{2}\) and \(f\) answers that \(\eta\) with \(\delta = \frac{\eta}{2}\), the composition runs on \(\delta = \frac{\varepsilon}{4}\) — the allowances compose along the chain.`,
              },
            },
          ],
        },
      ];
