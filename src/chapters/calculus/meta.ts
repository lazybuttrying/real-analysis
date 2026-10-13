import type { ChapterMeta } from '../../contracts.ts';

/**
 * Pure data. Imports nothing except type imports.
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 * Summaries embed math as inline TeX between \( and \) (see splitInlineMath in contracts.ts).
 * NOTE: chapter numbering is never stored here — the shell derives it from the
 * catalog order in src/catalog.ts.
 */
export const calculus: ChapterMeta = {
  id: 'calculus',
  title: { ko: '미분과 적분', en: 'Differentiation and Integration' },
  summary: {
    ko: '미분과 적분의 핵심 장면들을 눈으로 확인합니다.',
    en: 'Watch the key moments of differentiation and integration.',
  },
  scenes: [
    {
      id: 'diffcont',
      title: { ko: '미분가능 ⇒ 연속', en: 'Differentiable Implies Continuous' },
      order: 1,
      summary: {
        ko: String.raw`미분가능하면 연속이지만, 역은 성립하지 않습니다 — \(|x|\)의 모서리를 확대해도 펴지지 않는 것을 보세요. 미분 장면들의 첫걸음입니다.`,
        en: String.raw`Differentiable implies continuous, but not conversely — zoom into the corner of \(|x|\) and it never flattens. The first step of the differentiation scenes.`,
      },
      tex: [
        String.raw`f'(a) = \lim_{h \to 0}\frac{f(a+h)-f(a)}{h}`,
        String.raw`\lim_{h \to 0} f(a+h) = f(a)`,
      ],
      controls: [
        { kind: 'slider', key: 'zoom', label: { ko: '확대', en: 'Zoom' }, min: 1, max: 8, step: 1, init: 1 },
      ],
      problems: [
        {
          id: 'three-line-proof',
          statement: {
            ko: String.raw`\(f\)가 \(a\)에서 미분가능하면 \(a\)에서 연속임을 세 줄로 증명하세요.`,
            en: String.raw`Prove in three lines: if \(f\) is differentiable at \(a\), it is continuous at \(a\).`,
          },
          display: [
            String.raw`f(a+h) - f(a) = \frac{f(a+h)-f(a)}{h} \cdot h \to f'(a) \cdot 0 = 0`,
          ],
          preset: { zoom: 1 },
          presetCaption: {
            ko: String.raw`\(|x|\) 전체 모습 — 증명의 핵심은 차분 몫에 \(h\)를 곱하는 트릭입니다.`,
            en: String.raw`The full \(|x|\) — the proof's trick is multiplying the difference quotient by \(h\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(h \neq 0\)일 때 \(f(a+h) - f(a) = \frac{f(a+h)-f(a)}{h} \cdot h\)입니다 — 0이 아닌 수로 나누고 다시 곱하는 것은 아무것도 바꾸지 않습니다.`,
                en: String.raw`For \(h \neq 0\), \(f(a+h) - f(a) = \frac{f(a+h)-f(a)}{h} \cdot h\) — dividing by a nonzero number and multiplying back changes nothing.`,
              },
            },
            {
              text: {
                ko: String.raw`\(h \to 0\)으로 보내면 꺾쇠 안의 차분 몫은 \(f'(a)\)로, 뒤의 \(h\)는 \(0\)으로 수렴하므로, 곱은 \(f'(a) \cdot 0 = 0\)으로 수렴합니다.`,
                en: String.raw`As \(h \to 0\), the bracketed difference quotient tends to \(f'(a)\) and the trailing \(h\) tends to \(0\), so the product tends to \(f'(a) \cdot 0 = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(\lim_{h \to 0} f(a+h) = f(a)\)입니다 — 이것이 \(a\)에서의 연속성의 정의이므로, \(f\)는 \(a\)에서 연속입니다.`,
                en: String.raw`Hence \(\lim_{h \to 0} f(a+h) = f(a)\) — the definition of continuity at \(a\), so \(f\) is continuous at \(a\).`,
              },
            },
          ],
        },
        {
          id: 'abs-not-differentiable',
          statement: {
            ko: String.raw`\(f(x) = \lvert x\rvert\)가 \(x = 0\)에서 미분가능하지 않음을 증명하세요.`,
            en: String.raw`Prove \(f(x) = \lvert x\rvert\) is not differentiable at \(x = 0\).`,
          },
          display: [
            String.raw`\frac{|h|}{h} = \begin{cases} 1 & h > 0 \\ -1 & h < 0 \end{cases}`,
          ],
          preset: { zoom: 4 },
          presetCaption: {
            ko: String.raw`4단계 확대 — 왼쪽 기울기 \(-1\), 오른쪽 \(+1\)이 그대로입니다.`,
            en: String.raw`Zoom level 4 — left slope \(-1\), right slope \(+1\), unchanged.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`차분 몫은 \(\frac{f(0+h)-f(0)}{h} = \frac{|h|}{h}\)이고, \(h > 0\)일 때 \(1\), \(h < 0\)일 때 \(-1\)입니다.`,
                en: String.raw`The difference quotient is \(\frac{f(0+h)-f(0)}{h} = \frac{|h|}{h}\), which equals \(1\) for \(h > 0\) and \(-1\) for \(h < 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 우극한은 \(1\), 좌극한은 \(-1\)로 서로 다르므로, 양쪽 극한 — 즉 도함수 — 은 존재하지 않습니다.`,
                en: String.raw`So the right-hand limit is \(1\) and the left-hand limit is \(-1\); they differ, hence the two-sided limit — the derivative — does not exist.`,
              },
            },
            {
              text: {
                ko: String.raw`확대해도 모서리가 펴지지 않는 것이 바로 이 때문입니다: 어느 배율에서든 왼쪽 기울기 \(-1\), 오른쪽 기울기 \(+1\)이 그대로 유지됩니다.`,
                en: String.raw`That is why the corner never flattens under zoom: at every magnification the left slope stays \(-1\) and the right slope stays \(+1\).`,
              },
            },
          ],
        },
        {
          id: 'weierstrass-exists',
          statement: {
            ko: String.raw`모든 점에서 연속이지만 어떤 점에서도 미분가능하지 않은 함수가 존재함을 (정리로) 서술하세요. 증명은 생략하고 아이디어 수준으로 둡니다.`,
            en: String.raw`State (as a theorem) that a function exists which is continuous everywhere but differentiable nowhere. Idea level; proof omitted.`,
          },
          preset: { zoom: 8 },
          presetCaption: {
            ko: String.raw`8단계 확대 — \(|x|\)의 모서리 하나가 아니라, 이런 모서리가 모든 점에 있습니다.`,
            en: String.raw`Zoom level 8 — not one corner of \(|x|\), but such a corner at every point.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`바이어슈트라스 정리: 모든 점에서 연속이지만 어떤 점에서도 미분가능하지 않은 함수가 존재합니다. 고전적인 예는 \(0 < a < 1\), \(ab > 1 + \frac{3\pi}{2}\)인 \(\sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) 형태의 급수입니다.`,
                en: String.raw`Weierstrass's theorem: there exists a function continuous at every point yet differentiable at none. A classic example is a series of the form \(\sum_{n=0}^{\infty} a^n \cos(b^n \pi x)\) with \(0 < a < 1\) and \(ab > 1 + \frac{3\pi}{2}\).`,
              },
            },
            {
              text: {
                ko: String.raw`아이디어: 연속함수들의 균등수렴 극한은 연속이므로 전체 연속성이 확보되지만, 각 점마다 뾰족한 파형이 차분 몫을 무너뜨려 어느 점에서도 도함수가 존재하지 않습니다. 증명은 생략합니다 — 알려진 결과로 받아들입니다.`,
                en: String.raw`The idea: a uniform limit of continuous functions is continuous, which secures continuity everywhere, but at each point the jagged waves defeat every difference quotient, so no derivative exists anywhere. No proof is given — this is stated as a known result.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'mvt',
      title: { ko: '평균값 정리', en: 'The Secant Meets Its Parallel Tangent' },
      order: 2,
      summary: {
        ko: String.raw`기울기가 \(\frac{f(b)-f(a)}{b-a}\)인 할선과 평행한 접선이 곡선 위에 반드시 존재합니다. \(\xi\)를 움직여보세요.`,
        en: String.raw`Somewhere on the curve, a tangent is parallel to the secant of slope \(\frac{f(b)-f(a)}{b-a}\). Drag \(\xi\) to find it.`,
      },
      tex: [String.raw`f'(\xi) = \frac{f(b)-f(a)}{b-a}`],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['x^3', 'x^2', 'x^3-3x', 'const'],
          init: 'x^3',
        },
        { kind: 'slider', key: 'xi', label: { ko: 'ξ 위치', en: 'ξ position' }, min: 0, max: 100, step: 1, init: 40 },
      ],
      problems: [
        {
          id: 'square-xi',
          statement: {
            ko: String.raw`\(f(x) = x^2\)를 \([0, 2]\)에서 평균값 정리에 적용하여 \(\xi\)를 직접 구하세요.`,
            en: String.raw`Apply the Mean Value Theorem to \(f(x) = x^2\) on \([0, 2]\) and find \(\xi\) explicitly.`,
          },
          display: [String.raw`\frac{f(2)-f(0)}{2-0} = 2, \quad f'(\xi) = 2\xi = 2 \;\Rightarrow\; \xi = 1`],
          preset: { fn: 'x^2', xi: 50 },
          presetCaption: {
            ko: String.raw`\(f(x) = x^2\), \(\xi = 1\) — 접선의 기울기가 2로 할선과 일치합니다.`,
            en: String.raw`\(f(x) = x^2\), \(\xi = 1\) — the tangent slope is 2, matching the secant.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`할선의 기울기는 \(\frac{f(2) - f(0)}{2 - 0} = \frac{4 - 0}{2} = 2\)입니다.`,
                en: String.raw`The secant slope is \(\frac{f(2) - f(0)}{2 - 0} = \frac{4 - 0}{2} = 2\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f'(x) = 2x\)이므로 \(f'(\xi) = 2\)는 \(2\xi = 2\), 즉 \(\xi = 1\)을 줍니다. \(1 \in (0, 2)\)이므로 평균값 정리의 결론과 일치합니다.`,
                en: String.raw`Since \(f'(x) = 2x\), \(f'(\xi) = 2\) gives \(2\xi = 2\), i.e. \(\xi = 1\). As \(1 \in (0, 2)\), this matches the theorem's conclusion.`,
              },
            },
          ],
        },
        {
          id: 'rolle',
          statement: {
            ko: String.raw`\(f(a) = f(b)\)이면 평균값 정리는 롤의 정리가 됩니다. \(f(x) = x^3 - 3x\), \([-1, 2]\)에서 확인하세요.`,
            en: String.raw`When \(f(a) = f(b)\), the Mean Value Theorem becomes Rolle's theorem. Check it for \(f(x) = x^3 - 3x\) on \([-1, 2]\).`,
          },
          display: [String.raw`f(-1) = f(2) = 2 \;\Rightarrow\; \exists\,\xi \in (-1,2): f'(\xi) = 0`],
          preset: { fn: 'x^3-3x', xi: 67 },
          presetCaption: {
            ko: String.raw`\(\xi \approx 1\)에서 접선이 수평 — 할선(기울기 0)과 평행합니다.`,
            en: String.raw`At \(\xi \approx 1\) the tangent is horizontal — parallel to the secant (slope 0).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(-1) = -1 + 3 = 2\), \(f(2) = 8 - 6 = 2\)이므로 할선의 기울기는 \(\frac{2-2}{3} = 0\)입니다.`,
                en: String.raw`\(f(-1) = -1 + 3 = 2\) and \(f(2) = 8 - 6 = 2\), so the secant slope is \(\frac{2-2}{3} = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f'(x) = 3x^2 - 3 = 0\)은 \(x = \pm 1\)을 주고, 열린 구간 \((-1, 2)\) 안에는 \(\xi = 1\)이 있습니다. 이것이 롤의 정리입니다 — 평균값 정리의 기울기가 0인 특수 경우입니다.`,
                en: String.raw`\(f'(x) = 3x^2 - 3 = 0\) gives \(x = \pm 1\), and the open interval \((-1, 2)\) contains \(\xi = 1\). That is Rolle's theorem — the Mean Value Theorem with zero slope.`,
              },
            },
          ],
        },
        {
          id: 'constant',
          statement: {
            ko: String.raw`\(f' \equiv 0\)이면 \(f\)는 상수함수임을 평균값 정리로 증명하세요.`,
            en: String.raw`Prove via the Mean Value Theorem that \(f' \equiv 0\) forces \(f\) to be constant.`,
          },
          display: [String.raw`f(b) - f(a) = f'(\xi)(b-a) = 0`],
          preset: { fn: 'const', xi: 50 },
          presetCaption: {
            ko: String.raw`상수함수: 할선도 접선도 기울기가 0입니다.`,
            en: String.raw`A constant function: both secant and tangent have slope 0.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f\)가 \([a, b]\)에서 연속이고 \((a, b)\)에서 미분가능하며 \(f' \equiv 0\)이라 가정합니다.`,
                en: String.raw`Assume \(f\) is continuous on \([a, b]\), differentiable on \((a, b)\), with \(f' \equiv 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`평균값 정리에 의해 어떤 \(\xi \in (a, b)\)에 대해 \(f(b) - f(a) = f'(\xi)(b-a) = 0\cdot(b-a) = 0\)입니다.`,
                en: String.raw`By the Mean Value Theorem, some \(\xi \in (a, b)\) gives \(f(b) - f(a) = f'(\xi)(b-a) = 0\cdot(b-a) = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(f(b) = f(a)\)이고, \(a, b\)가 임의였으므로 \(f\)는 상수함수입니다.`,
                en: String.raw`Hence \(f(b) = f(a)\), and since \(a, b\) were arbitrary, \(f\) is constant.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'taylor',
      title: { ko: '테일러 근사', en: 'Polynomials Hugging the Curve' },
      order: 3,
      summary: {
        ko: String.raw`\(\sin x\) 위에 매클로린 다항식 \(T_n(x)\)을 겹쳐봅니다. 차수를 올리면 곡선에 달라붙습니다.`,
        en: String.raw`Lay the Maclaurin polynomial \(T_n(x)\) over \(\sin x\). Raise the degree and watch it hug the curve.`,
      },
      tex: [String.raw`T_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k`],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['sin', 'exp'],
          init: 'sin',
        },
        { kind: 'slider', key: 'degree', label: { ko: '차수 n', en: 'Degree n' }, min: 1, max: 9, step: 2, init: 3 },
      ],
      problems: [
        {
          id: 'exp-remainder',
          statement: {
            ko: String.raw`\(e^x\)의 3차 테일러 다항식으로 \(e\)를 근사하고, 라그랑주 나머지로 오차를 평가하세요.`,
            en: String.raw`Approximate \(e\) with the degree-3 Taylor polynomial of \(e^x\), and bound the error with the Lagrange remainder.`,
          },
          display: [String.raw`T_3(1) = \frac{8}{3} \approx 2.6667, \quad |R_3(1)| \le \frac{e}{24} \approx 0.1133`],
          preset: { fn: 'exp', degree: 3 },
          presetCaption: {
            ko: String.raw`\(n = 3\): 실제 오차 \(\approx 0.0516\)이 상한 \(0.1133\) 안에 들어갑니다.`,
            en: String.raw`\(n = 3\): the actual error \(\approx 0.0516\) sits inside the bound \(0.1133\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(e^x\)의 모든 도함수는 \(e^x\)이므로 \(f^{(k)}(0) = 1\)입니다. 따라서 \(T_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}\)이고 \(T_3(1) = \frac{8}{3} \approx 2.6667\)입니다.`,
                en: String.raw`Every derivative of \(e^x\) is \(e^x\), so \(f^{(k)}(0) = 1\). Hence \(T_3(x) = 1 + x + \frac{x^2}{2} + \frac{x^3}{6}\) and \(T_3(1) = \frac{8}{3} \approx 2.6667\).`,
              },
            },
            {
              text: {
                ko: String.raw`테일러 정리(라그랑주 나머지)에 의해 어떤 \(c \in (0, 1)\)에 대해 \(R_3(1) = \frac{e^c}{4!} \cdot 1^4\)입니다. \(e^c < e < 2.72\)이므로 \(|R_3(1)| < \frac{2.72}{24} \approx 0.1133\)입니다.`,
                en: String.raw`By Taylor's theorem (Lagrange remainder), \(R_3(1) = \frac{e^c}{4!} \cdot 1^4\) for some \(c \in (0, 1)\). Since \(e^c < e < 2.72\), \(|R_3(1)| < \frac{2.72}{24} \approx 0.1133\).`,
              },
            },
            {
              text: {
                ko: String.raw`실제로 \(e - \frac{8}{3} \approx 0.0516\)으로, 상한 안에 들어갑니다.`,
                en: String.raw`Indeed \(e - \frac{8}{3} \approx 0.0516\), inside the bound.`,
              },
            },
          ],
        },
        {
          id: 'sin-even',
          statement: {
            ko: String.raw`\(\sin x\)의 매클로린 전개에 짝수 차수 항이 없는 이유를 0에서의 도함수로 증명하세요.`,
            en: String.raw`Prove from the derivatives at 0 why the Maclaurin series of \(\sin x\) has no even-degree terms.`,
          },
          display: [String.raw`\sin^{(2m)}(0) = 0 \;\Rightarrow\; T_{2m+1} = T_{2m}`],
          preset: { fn: 'sin', degree: 3 },
          presetCaption: {
            ko: String.raw`\(T_3(x) = x - x^3/6\) — \(x^2\) 항이 없습니다.`,
            en: String.raw`\(T_3(x) = x - x^3/6\) — no \(x^2\) term.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin' = \cos\), \(\sin'' = -\sin\), \(\sin''' = -\cos\), \(\sin^{(4)} = \sin\)이므로 0에서의 값은 \(0, 1, 0, -1\)을 4주기로 반복합니다.`,
                en: String.raw`\(\sin' = \cos\), \(\sin'' = -\sin\), \(\sin''' = -\cos\), \(\sin^{(4)} = \sin\), so the values at 0 repeat \(0, 1, 0, -1\) with period 4.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 짝수 차수 도함수는 0에서 모두 0이 되어, 계수 \(\frac{\sin^{(2m)}(0)}{(2m)!} = 0\)입니다.`,
                en: String.raw`Hence every even-order derivative vanishes at 0, and the coefficients \(\frac{\sin^{(2m)}(0)}{(2m)!} = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`즉 \(T_3(x) = x - \frac{x^3}{6}\)에 \(x^2\) 항이 없고, 일반적으로 \(T_{2m+1} = T_{2m}\)입니다 — \(\sin\)이 홀함수이기 때문입니다.`,
                en: String.raw`So \(T_3(x) = x - \frac{x^3}{6}\) has no \(x^2\) term, and in general \(T_{2m+1} = T_{2m}\) — because \(\sin\) is odd.`,
              },
            },
          ],
        },
        {
          id: 'remainder-idea',
          statement: {
            ko: String.raw`나머지 \(R_n(x) \to 0\)이 테일러 급수 수렴의 핵심인 이유를 설명하세요. (아이디어 수준)`,
            en: String.raw`Explain why \(R_n(x) \to 0\) is the heart of Taylor convergence. (Idea level)`,
          },
          display: [String.raw`f(x) = T_n(x) + R_n(x)`],
          preset: { fn: 'sin', degree: 9 },
          presetCaption: {
            ko: String.raw`\(n = 9\): 다항식이 \([-\pi, \pi]\)에서 곡선과 거의 겹칩니다.`,
            en: String.raw`\(n = 9\): the polynomial nearly overlaps the curve on \([-\pi, \pi]\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`테일러 정리는 \(f(x) = T_n(x) + R_n(x)\)로 분해합니다. 다항식 부분은 우리가 아는 것이고, 모르는 것은 나머지 전부입니다.`,
                en: String.raw`Taylor's theorem splits \(f(x) = T_n(x) + R_n(x)\). The polynomial part is what we know; the remainder is everything we don't.`,
              },
            },
            {
              text: {
                ko: String.raw`\(R_n(x) \to 0\)일 때 정확히 그때만 \(T_n(x) \to f(x)\)가 성립합니다. 즉 나머지의 소멸이 곧 급수의 수렴입니다.`,
                en: String.raw`Exactly when \(R_n(x) \to 0\) do we get \(T_n(x) \to f(x)\). The vanishing of the remainder IS the convergence of the series.`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sin x\)처럼 나머지가 0으로 가는 함수는 전역적으로 테일러 급수와 일치하지만, 그렇지 않은 매끄러운 함수도 존재합니다 — 여기서는 아이디어 수준에서만 언급합니다.`,
                en: String.raw`Functions like \(\sin x\), whose remainder vanishes, match their Taylor series globally — but smooth functions exist where it doesn't. Mentioned at the idea level only.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'riemann',
      title: { ko: '리만합 스퀴즈', en: 'Upper and Lower Sums Close In' },
      order: 4,
      summary: {
        ko: String.raw`\(f(x) = x^2\) 아래에 직사각형을 채워봅니다. 아래합과 위합이 \(\frac{1}{3}\)을 양쪽에서 조여옵니다.`,
        en: String.raw`Fill rectangles under \(f(x) = x^2\). The lower and upper sums squeeze \(\frac{1}{3}\) from both sides.`,
      },
      tex: [String.raw`L(f,P) \le \int_a^b f \le U(f,P)`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Subdivisions n' }, min: 1, max: 48, step: 1, init: 12 }],
      problems: [
        {
          id: 'third',
          statement: {
            ko: String.raw`\(\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}\)을 이용해 \(\int_0^1 x^2\,dx = \frac13\)을 위합·아래합으로 증명하세요.`,
            en: String.raw`Use \(\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}\) to prove \(\int_0^1 x^2\,dx = \frac13\) from upper and lower sums.`,
          },
          display: [String.raw`L_n = \frac{(n-1)n(2n-1)}{6n^3} \to \frac13, \quad U_n = \frac{n(n+1)(2n+1)}{6n^3} \to \frac13`],
          preset: { n: 48 },
          presetCaption: {
            ko: String.raw`\(n = 48\): 틈 \(U - L = 1/48 \approx 0.0208\)이 \(\frac13\)을 조입니다.`,
            en: String.raw`\(n = 48\): the gap \(U - L = 1/48 \approx 0.0208\) squeezes \(\frac13\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`균등분할 \(P_n\)에서 \(x^2\)은 증가하므로, 아래합은 왼쪽 끝점, 위합은 오른쪽 끝점을 씁니다: \(L_n = \frac{1}{n^3}\sum_{k=0}^{n-1}k^2\), \(U_n = \frac{1}{n^3}\sum_{k=1}^{n}k^2\).`,
                en: String.raw`On the uniform partition \(P_n\), \(x^2\) is increasing, so the lower sum uses left endpoints and the upper sum right endpoints: \(L_n = \frac{1}{n^3}\sum_{k=0}^{n-1}k^2\), \(U_n = \frac{1}{n^3}\sum_{k=1}^{n}k^2\).`,
              },
            },
            {
              text: {
                ko: String.raw`제곱합 공식을 대입하면 \(L_n = \frac{(n-1)n(2n-1)}{6n^3}\), \(U_n = \frac{n(n+1)(2n+1)}{6n^3}\)입니다.`,
                en: String.raw`Substituting the sum-of-squares formula gives \(L_n = \frac{(n-1)n(2n-1)}{6n^3}\) and \(U_n = \frac{n(n+1)(2n+1)}{6n^3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(n \to \infty\)일 때 둘 다 \(\frac{2n^3}{6n^3} = \frac13\)으로 가므로, 조임에 의해 적분값은 \(\frac13\)입니다.`,
                en: String.raw`Both tend to \(\frac{2n^3}{6n^3} = \frac13\) as \(n \to \infty\), so the integral is \(\frac13\) by squeezing.`,
              },
            },
          ],
        },
        {
          id: 'dirichlet-riemann',
          statement: {
            ko: String.raw`디리클레 함수는 리만 적분 불가능함을, 모든 분할에 대해 \(U - L = 1\)임을 보여 증명하세요.`,
            en: String.raw`Prove the Dirichlet function is not Riemann integrable by showing \(U - L = 1\) for every partition.`,
          },
          display: [String.raw`U(D,P) = 1, \quad L(D,P) = 0 \quad \text{for every } P`],
          preset: { n: 20 },
          presetCaption: {
            ko: String.raw`\(x^2\)의 위합·아래합과 대조해 보세요 — 디리클레 함수에서는 틈이 절대 좁혀지지 않습니다.`,
            en: String.raw`Contrast with the sums for \(x^2\) — for the Dirichlet function the gap never narrows.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`임의의 구간에는 유리수와 무리수가 모두 있으므로, 디리클레 함수 \(D\)에 대해 모든 소구간에서 \(\sup D = 1\), \(\inf D = 0\)입니다.`,
                en: String.raw`Every interval contains both rationals and irrationals, so on every subinterval \(\sup D = 1\) and \(\inf D = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 어떤 분할 \(P\)에 대해서도 \(U(D,P) = \sum 1\cdot\Delta x_k = 1\), \(L(D,P) = \sum 0\cdot\Delta x_k = 0\)입니다.`,
                en: String.raw`Hence for every partition \(P\), \(U(D,P) = \sum 1\cdot\Delta x_k = 1\) and \(L(D,P) = \sum 0\cdot\Delta x_k = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(U - L = 1 \not\to 0\)이므로 리만 적분 가능성의 필요충분조건을 만족하지 않습니다.`,
                en: String.raw`Since \(U - L = 1 \not\to 0\), the necessary and sufficient condition for Riemann integrability fails.`,
              },
            },
          ],
        },
        {
          id: 'refinement',
          statement: {
            ko: String.raw`분할을 세분하면 \(U - L\)이 절대 증가하지 않음을 증명하세요.`,
            en: String.raw`Prove that refining a partition never increases \(U - L\).`,
          },
          display: [String.raw`P' \supset P \;\Rightarrow\; U(f,P') \le U(f,P),\; L(f,P') \ge L(f,P)`],
          preset: { n: 10 },
          presetCaption: {
            ko: String.raw`\(n = 10\): 분할을 잘게 쪼갤수록 틈이 단조롭게 줄어듭니다.`,
            en: String.raw`\(n = 10\): the gap shrinks monotonically as the partition refines.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`소구간 하나에 점을 추가해 둘로 나누면, 각 조각의 상한은 원래 구간의 상한 이하이므로 위합은 감소(또는 유지)합니다.`,
                en: String.raw`Splitting one subinterval in two: each piece's supremum is at most the original's, so the upper sum decreases (or stays).`,
              },
            },
            {
              text: {
                ko: String.raw`마찬가지로 하한은 증가(또는 유지)하므로 아래합은 증가합니다.`,
                en: String.raw`Likewise each piece's infimum is at least the original's, so the lower sum increases (or stays).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(U - L\)은 세분할수록 단조감소합니다 — 위합과 아래합이 서로를 향해 조여옵니다.`,
                en: String.raw`So \(U - L\) decreases monotonically under refinement — the sums squeeze toward each other.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'ftc',
      title: { ko: '미적분 기본정리', en: "The Area Function's Derivative Is the Function" },
      order: 5,
      summary: {
        ko: String.raw`넓이함수 \(A(x) = \int_a^x f(t)\,dt\)의 기울기를 재보면 \(f(x)\)와 일치합니다. \(x\)를 움직여보세요.`,
        en: String.raw`Measure the slope of the area function \(A(x) = \int_a^x f(t)\,dt\) — it equals \(f(x)\). Drag \(x\).`,
      },
      tex: [String.raw`A(x) = \int_a^x f(t)\,dt \;\Rightarrow\; A'(x) = f(x)`],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['x^2', 'sin'],
          init: 'x^2',
        },
        { kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: 0, max: 100, step: 1, init: 60 },
      ],
      problems: [
        {
          id: 'area-cubic',
          statement: {
            ko: String.raw`\(A(x) = \int_0^x t^2\,dt = \frac{x^3}{3}\)임을 보이고 \(A'(x) = x^2\)를 확인하세요.`,
            en: String.raw`Show \(A(x) = \int_0^x t^2\,dt = \frac{x^3}{3}\) and verify \(A'(x) = x^2\).`,
          },
          display: [String.raw`A(x) = \frac{x^3}{3}, \quad A'(x) = x^2`],
          preset: { fn: 'x^2', x: 75 },
          presetCaption: {
            ko: String.raw`\(x = 1.5\): 수치 미분값이 \(f(1.5) = 2.25\)와 일치합니다.`,
            en: String.raw`\(x = 1.5\): the numerical derivative matches \(f(1.5) = 2.25\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`멱함수 적분 공식에 의해 \(\int_0^x t^2\,dt = \left[\frac{t^3}{3}\right]_0^x = \frac{x^3}{3}\)입니다.`,
                en: String.raw`By the power rule, \(\int_0^x t^2\,dt = \left[\frac{t^3}{3}\right]_0^x = \frac{x^3}{3}\).`,
              },
            },
            {
              text: {
                ko: String.raw`미분하면 \(A'(x) = x^2 = f(x)\)로, 미적분 기본정리 제1형태와 일치합니다.`,
                en: String.raw`Differentiating gives \(A'(x) = x^2 = f(x)\), matching the first form of the Fundamental Theorem.`,
              },
            },
          ],
        },
        {
          id: 'antiderivative',
          statement: {
            ko: String.raw`\(\int_0^1 2x\,dx\)를 역도함수로 계산하세요.`,
            en: String.raw`Compute \(\int_0^1 2x\,dx\) via an antiderivative.`,
          },
          display: [String.raw`\int_0^1 2x\,dx = \left[x^2\right]_0^1 = 1`],
          preset: { fn: 'x^2', x: 50 },
          presetCaption: {
            ko: String.raw`\(x = 1\)까지의 넓이는 1입니다.`,
            en: String.raw`The area up to \(x = 1\) is 1.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(2x\)의 역도함수는 \(x^2\)입니다 (\((x^2)' = 2x\)).`,
                en: String.raw`An antiderivative of \(2x\) is \(x^2\) (since \((x^2)' = 2x\)).`,
              },
            },
            {
              text: {
                ko: String.raw`기본정리 제2형태에 의해 \(\int_0^1 2x\,dx = 1^2 - 0^2 = 1\)입니다.`,
                en: String.raw`By the second form of the theorem, \(\int_0^1 2x\,dx = 1^2 - 0^2 = 1\).`,
              },
            },
          ],
        },
        {
          id: 'chain',
          statement: {
            ko: String.raw`\(\frac{d}{dx}\int_x^{x^2} \sin t\,dt\)를 기본정리와 연쇄법칙으로 구하세요.`,
            en: String.raw`Find \(\frac{d}{dx}\int_x^{x^2} \sin t\,dt\) with the Fundamental Theorem and the chain rule.`,
          },
          display: [String.raw`\frac{d}{dx}\int_x^{x^2}\sin t\,dt = 2x\sin(x^2) - \sin x`],
          preset: { fn: 'sin', x: 32 },
          presetCaption: {
            ko: String.raw`\(\sin\)의 넓이함수 위에서 \(x \approx 1.01\) 지점을 봅니다.`,
            en: String.raw`On the area function of \(\sin\), at \(x \approx 1.01\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(F(u) = \int_0^u \sin t\,dt\)라 두면 기본정리 제1형태에 의해 \(F'(u) = \sin u\)입니다.`,
                en: String.raw`Put \(F(u) = \int_0^u \sin t\,dt\); then \(F'(u) = \sin u\) by the first form.`,
              },
            },
            {
              text: {
                ko: String.raw`적분은 \(F(x^2) - F(x)\)이므로, 연쇄법칙으로 미분하면 \(2x\,F'(x^2) - F'(x) = 2x\sin(x^2) - \sin x\)입니다.`,
                en: String.raw`The integral is \(F(x^2) - F(x)\), so the chain rule gives \(2x\,F'(x^2) - F'(x) = 2x\sin(x^2) - \sin x\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'newton',
      title: { ko: '뉴턴법', en: 'Riding Tangents to the Root' },
      order: 6,
      summary: {
        ko: String.raw`접선을 타고 내려가면 근에 닿습니다. 오차의 정확한 자릿수가 매 단계 두 배가 됩니다.`,
        en: String.raw`Ride the tangent down to the root. The number of correct digits doubles each step.`,
      },
      tex: [String.raw`x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}`],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['x^2-2', 'x^3-2x+2'],
          init: 'x^2-2',
        },
        { kind: 'slider', key: 'x0', label: { ko: '시작점 x₀', en: 'Start x₀' }, min: 0, max: 3, step: 0.5, init: 1.5 },
        { kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 1, max: 8, step: 1, init: 4 },
      ],
      problems: [
        {
          id: 'babylonian',
          statement: {
            ko: String.raw`\(x^2 - 2 = 0\)에 대한 뉴턴법이 바빌로니아법과 같음을 대수적으로 증명하세요.`,
            en: String.raw`Prove algebraically that Newton's method for \(x^2 - 2 = 0\) is the Babylonian method.`,
          },
          display: [String.raw`x - \frac{x^2-2}{2x} = \frac{x + 2/x}{2}`],
          preset: { fn: 'x^2-2', x0: 1, n: 4 },
          presetCaption: {
            ko: String.raw`\(x_0 = 1\)에서 시작 — 4번이면 \(\sqrt{2}\)의 10자리 이상이 맞습니다.`,
            en: String.raw`Starting at \(x_0 = 1\) — 4 steps nail \(\sqrt{2}\) past 10 digits.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x) = x^2 - 2\), \(f'(x) = 2x\)이므로 뉴턴 점화식은 \(x_{n+1} = x_n - \frac{x_n^2 - 2}{2x_n}\)입니다.`,
                en: String.raw`With \(f(x) = x^2 - 2\) and \(f'(x) = 2x\), Newton's iteration is \(x_{n+1} = x_n - \frac{x_n^2 - 2}{2x_n}\).`,
              },
            },
            {
              text: {
                ko: String.raw`통분하면 \(\frac{2x_n^2 - x_n^2 + 2}{2x_n} = \frac{x_n + 2/x_n}{2}\)로, 정확히 바빌로니아 점화식입니다.`,
                en: String.raw`Putting over a common denominator gives \(\frac{2x_n^2 - x_n^2 + 2}{2x_n} = \frac{x_n + 2/x_n}{2}\) — exactly the Babylonian iteration.`,
              },
            },
          ],
        },
        {
          id: 'quadratic-idea',
          statement: {
            ko: String.raw`오차가 \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)} e_n^2\)을 따르는 이유를 설명하세요. (아이디어 수준)`,
            en: String.raw`Explain why the error follows \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)} e_n^2\). (Idea level)`,
          },
          display: [String.raw`e_{n+1} \approx C\,e_n^2, \quad C = \frac{f''(x^*)}{2f'(x^*)}`],
          preset: { fn: 'x^2-2', x0: 1.5, n: 6 },
          presetCaption: {
            ko: String.raw`오차 비율 \(|e_{n+1}|/e_n^2 \approx 0.354 = 1/(2\sqrt{2})\)를 확인하세요.`,
            en: String.raw`Check the error ratio \(|e_{n+1}|/e_n^2 \approx 0.354 = 1/(2\sqrt{2})\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(x^*) = 0\)인 근 근처에서 \(f\)를 2차까지 테일러 전개하면 \(0 = f(x^*) \approx f(x_n) + f'(x_n)(x^* - x_n) + \frac{f''(x^*)}{2}e_n^2\)입니다 (\(e_n = x_n - x^*\)).`,
                en: String.raw`Near a root \(f(x^*) = 0\), the second-order Taylor expansion gives \(0 = f(x^*) \approx f(x_n) + f'(x_n)(x^* - x_n) + \frac{f''(x^*)}{2}e_n^2\) (with \(e_n = x_n - x^*\)).`,
              },
            },
            {
              text: {
                ko: String.raw`뉴턴 단계 \(x_{n+1} = x_n - f(x_n)/f'(x_n)\)를 대입해 정리하면 \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)}e_n^2\)을 얻습니다.`,
                en: String.raw`Substituting the Newton step \(x_{n+1} = x_n - f(x_n)/f'(x_n)\) and rearranging gives \(e_{n+1} \approx \frac{f''(x^*)}{2f'(x^*)}e_n^2\).`,
              },
            },
            {
              text: {
                ko: String.raw`즉 오차가 제곱되므로 정확한 자릿수가 매 단계 두 배가 됩니다 — 2차 수렴입니다. 엄밀한 증명은 테일러 정리의 나머지 평가가 필요하므로 아이디어 수준에서만 봅니다.`,
                en: String.raw`So the error squares, doubling the correct digits each step — quadratic convergence. A rigorous proof needs the Taylor remainder estimate, so this stays at the idea level.`,
              },
            },
          ],
        },
        {
          id: 'cycle',
          statement: {
            ko: String.raw`\(f(x) = x^3 - 2x + 2\), \(x_0 = 0\)에서 뉴턴법이 \(0 \to 1 \to 0\)으로 영원히 순환함을 직접 계산으로 보이세요.`,
            en: String.raw`Show by direct computation that Newton's method for \(f(x) = x^3 - 2x + 2\) from \(x_0 = 0\) cycles \(0 \to 1 \to 0\) forever.`,
          },
          display: [String.raw`x_1 = 0 - \frac{2}{-2} = 1, \quad x_2 = 1 - \frac{1}{1} = 0`],
          preset: { fn: 'x^3-2x+2', x0: 0, n: 4 },
          presetCaption: {
            ko: String.raw`접선이 \(0\)과 \(1\) 사이를 영원히 왕복합니다 — 수렴하지 않습니다.`,
            en: String.raw`The tangent bounces between \(0\) and \(1\) forever — no convergence.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(f(0) = 2\), \(f'(0) = -2\)이므로 \(x_1 = 0 - \frac{2}{-2} = 1\)입니다.`,
                en: String.raw`\(f(0) = 2\) and \(f'(0) = -2\), so \(x_1 = 0 - \frac{2}{-2} = 1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(f(1) = 1\), \(f'(1) = 1\)이므로 \(x_2 = 1 - \frac{1}{1} = 0\)입니다.`,
                en: String.raw`\(f(1) = 1\) and \(f'(1) = 1\), so \(x_2 = 1 - \frac{1}{1} = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x_2 = x_0\)이므로 이후 \(0, 1, 0, 1, \dots\)이 영원히 반복됩니다 — 뉴턴법은 항상 수렴하지 않습니다.`,
                en: String.raw`Since \(x_2 = x_0\), the sequence repeats \(0, 1, 0, 1, \dots\) forever — Newton's method does not always converge.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'banach',
      title: { ko: '바나흐 고정점', en: 'The Contraction Cobweb' },
      order: 7,
      summary: {
        ko: String.raw`\(y = x\)와 \(y = f(x)\) 사이를 오가는 거미줄이 한 점으로 빨려듭니다. 오차는 \(q^n\)으로 줄어듭니다.`,
        en: String.raw`The cobweb between \(y = x\) and \(y = f(x)\) gets sucked into one point. The error shrinks like \(q^n\).`,
      },
      tex: [String.raw`d(f(x),f(y)) \le q\,d(x,y),\; q<1 \;\Rightarrow\; x_{n+1} = f(x_n) \to x^*`],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['x/2+1', 'cos'],
          init: 'x/2+1',
        },
        { kind: 'slider', key: 'x0', label: { ko: '시작점 x₀', en: 'Start x₀' }, min: 0, max: 1, step: 0.1, init: 0.5 },
        { kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 1, max: 24, step: 1, init: 6 },
      ],
      problems: [
        {
          id: 'affine',
          statement: {
            ko: String.raw`\(f(x) = \frac{x}{2} + 1\)이 \(q = \frac12\)인 수축사상임을 보이고, 고정점과 오차 상한을 구하세요.`,
            en: String.raw`Show \(f(x) = \frac{x}{2} + 1\) is a contraction with \(q = \frac12\); find the fixed point and the error bound.`,
          },
          display: [String.raw`x^* = 2, \quad |x_n - 2| \le \left(\tfrac12\right)^n |x_0 - 2|`],
          preset: { fn: 'x/2+1', x0: 0, n: 8 },
          presetCaption: {
            ko: String.raw`\(x_0 = 0\), \(n = 8\): 오차 \(= 0.0078\)이 상한과 정확히 일치합니다.`,
            en: String.raw`\(x_0 = 0\), \(n = 8\): the error \(= 0.0078\) matches the bound exactly.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(|f(x) - f(y)| = \left|\frac{x-y}{2}\right| = \frac12|x - y|\)이므로 \(q = \frac12\)인 수축사상입니다.`,
                en: String.raw`\(|f(x) - f(y)| = \left|\frac{x-y}{2}\right| = \frac12|x - y|\), so \(f\) is a contraction with \(q = \frac12\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(x = \frac{x}{2} + 1\)을 풀면 \(x^* = 2\)입니다.`,
                en: String.raw`Solving \(x = \frac{x}{2} + 1\) gives \(x^* = 2\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x_{n+1} - 2| = \frac12|x_n - 2|\)이므로 귀납법으로 \(|x_n - 2| = \left(\frac12\right)^n|x_0 - 2|\)입니다. \(x_0 = 0\), \(n = 8\)이면 오차는 \(\frac{2}{256} = 0.0078125\)입니다.`,
                en: String.raw`Since \(|x_{n+1} - 2| = \frac12|x_n - 2|\), induction gives \(|x_n - 2| = \left(\frac12\right)^n|x_0 - 2|\). For \(x_0 = 0\), \(n = 8\), the error is \(\frac{2}{256} = 0.0078125\).`,
              },
            },
          ],
        },
        {
          id: 'dottie',
          statement: {
            ko: String.raw`\(\cos x\)는 \([0,1]\)에서 수축사상임을 보이고, 도티 수 \(x^* \approx 0.739\)의 존재·유일성을 설명하세요.`,
            en: String.raw`Show \(\cos x\) is a contraction on \([0,1]\); explain the existence and uniqueness of the Dottie number \(x^* \approx 0.739\).`,
          },
          display: [String.raw`|\cos x - \cos y| \le \sin(1)\,|x - y|, \quad \sin(1) \approx 0.8415 < 1`],
          preset: { fn: 'cos', x0: 0.5, n: 20 },
          presetCaption: {
            ko: String.raw`\(n = 20\): 반복값이 도티 수 \(0.739085\)에 달라붙습니다.`,
            en: String.raw`\(n = 20\): the iterates cling to the Dottie number \(0.739085\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`평균값 정리에 의해 \(|\cos x - \cos y| = |-\sin\xi|\cdot|x - y| \le \sin(1)\,|x - y|\)이고, \(\sin(1) \approx 0.8415 < 1\)이므로 수축사상입니다.`,
                en: String.raw`By the Mean Value Theorem, \(|\cos x - \cos y| = |-\sin\xi|\cdot|x - y| \le \sin(1)\,|x - y|\), and \(\sin(1) \approx 0.8415 < 1\), so \(\cos\) is a contraction.`,
              },
            },
            {
              text: {
                ko: String.raw`바나흐 정리에 의해 \([0,1]\) 안에 유일한 고정점이 존재합니다 — 도티 수 \(x^* \approx 0.739085\)입니다 (수치는 반복 계산값).`,
                en: String.raw`Banach's theorem gives a unique fixed point in \([0,1]\) — the Dottie number \(x^* \approx 0.739085\) (the value is from iteration).`,
              },
            },
          ],
        },
        {
          id: 'uniqueness',
          statement: {
            ko: String.raw`고정점이 최대 하나임을 세 줄로 증명하세요.`,
            en: String.raw`Prove in three lines that there is at most one fixed point.`,
          },
          display: [String.raw`|x^* - y^*| = |f(x^*) - f(y^*)| \le q|x^* - y^*|`],
          preset: { fn: 'x/2+1', x0: 0.3, n: 5 },
          presetCaption: {
            ko: String.raw`어디서 시작해도 같은 점 \(x^* = 2\)로 빨려듭니다.`,
            en: String.raw`Every start gets sucked into the same point \(x^* = 2\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x^*\), \(y^*\)가 모두 고정점이라 가정합니다.`,
                en: String.raw`Suppose \(x^*\) and \(y^*\) are both fixed points.`,
              },
            },
            {
              text: {
                ko: String.raw`\(|x^* - y^*| = |f(x^*) - f(y^*)| \le q|x^* - y^*|\)입니다.`,
                en: String.raw`Then \(|x^* - y^*| = |f(x^*) - f(y^*)| \le q|x^* - y^*|\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(q < 1\)이므로 이는 \(|x^* - y^*| = 0\), 즉 \(x^* = y^*\)를 강제합니다.`,
                en: String.raw`Since \(q < 1\), this forces \(|x^* - y^*| = 0\), i.e. \(x^* = y^*\).`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'fourier',
      title: { ko: '푸리에 정사각파', en: 'The Ringing That Never Dies' },
      order: 8,
      summary: {
        ko: String.raw`정사각파에 사인파를 겹쳐봅니다. 점프점 옆의 울림은 \(N\)을 키워도 사라지지 않습니다.`,
        en: String.raw`Layer sine waves onto a square wave. The ringing beside each jump never dies out, no matter how large \(N\) gets.`,
      },
      tex: [String.raw`S_N(x) = \frac{4}{\pi}\sum_{k=1}^{N} \frac{\sin((2k-1)x)}{2k-1}`],
      controls: [{ kind: 'slider', key: 'N', label: { ko: '항의 수 N', en: 'Terms N' }, min: 1, max: 50, step: 1, init: 8 }],
      problems: [
        {
          id: 'coefficients',
          statement: {
            ko: String.raw`정사각파의 사인 급수 계수 \(b_{2k-1} = \frac{4}{\pi(2k-1)}\)을 적분으로 직접 구하세요.`,
            en: String.raw`Compute the sine-series coefficients \(b_{2k-1} = \frac{4}{\pi(2k-1)}\) of the square wave by direct integration.`,
          },
          display: [String.raw`b_n = \frac{2}{\pi}\int_0^{\pi} \sin(nx)\,dx = \frac{2(1-\cos n\pi)}{n\pi}`],
          preset: { N: 5 },
          presetCaption: {
            ko: String.raw`\(N = 5\): 처음 5개의 홀수 조화파가 계단을 흉내냅니다.`,
            en: String.raw`\(N = 5\): the first 5 odd harmonics mimic the step.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`정사각파는 \((-\pi, \pi)\)에서 홀함수이므로 코사인 계수는 0이고, \(b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx = \frac{2}{\pi}\int_0^{\pi}\sin(nx)\,dx\)입니다.`,
                en: String.raw`The square wave is odd on \((-\pi, \pi)\), so cosine coefficients vanish and \(b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)\,dx = \frac{2}{\pi}\int_0^{\pi}\sin(nx)\,dx\).`,
              },
            },
            {
              text: {
                ko: String.raw`적분하면 \(\frac{2}{n\pi}(1 - \cos n\pi)\)이고, \(n\)이 짝수면 \(0\), 홀수면 \(\frac{4}{n\pi}\)입니다.`,
                en: String.raw`Integrating gives \(\frac{2}{n\pi}(1 - \cos n\pi)\): \(0\) for even \(n\), \(\frac{4}{n\pi}\) for odd \(n\).`,
              },
            },
            {
              text: {
                ko: String.raw`즉 \(b_{2k-1} = \frac{4}{\pi(2k-1)}\), \(b_{2k} = 0\)입니다.`,
                en: String.raw`So \(b_{2k-1} = \frac{4}{\pi(2k-1)}\) and \(b_{2k} = 0\).`,
              },
            },
          ],
        },
        {
          id: 'gibbs-numeric',
          statement: {
            ko: String.raw`\(N\)이 클 때 점프 옆 최대값이 \(\approx 1.179\)로 수렴함을 수치로 확인하고, 울림이 점프의 약 9%임을 보이세요. (수치 확인)`,
            en: String.raw`Verify numerically that the peak near the jump tends to \(\approx 1.179\), i.e. about 9% of the jump. (Numerical check)`,
          },
          display: [String.raw`\max S_N \to \frac{2\,\mathrm{Si}(\pi)}{\pi} \approx 1.17898`],
          preset: { N: 50 },
          presetCaption: {
            ko: String.raw`\(N = 50\): 최대값 \(\approx 1.179\) — 1을 \(0.179\)만큼 넘습니다.`,
            en: String.raw`\(N = 50\): peak \(\approx 1.179\) — overshooting 1 by \(0.179\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(N = 50\)에서 점프 바로 오른쪽의 최대값을 수치로 재면 \(\approx 1.179\)입니다 (이론값 \(\frac{2\,\mathrm{Si}(\pi)}{\pi} \approx 1.17898\)).`,
                en: String.raw`Measuring the peak just right of the jump at \(N = 50\) gives \(\approx 1.179\) (theory: \(\frac{2\,\mathrm{Si}(\pi)}{\pi} \approx 1.17898\)).`,
              },
            },
            {
              text: {
                ko: String.raw`정사각파의 점프 크기는 \(2\)이므로, \(1\) 위로의 초과분 \(0.179\)는 점프의 약 \(8.95\%\)입니다.`,
                en: String.raw`The jump size is \(2\), so the excess \(0.179\) above \(1\) is about \(8.95\%\) of the jump.`,
              },
            },
            {
              text: {
                ko: String.raw`\(N\)을 키워도 이 비율은 0으로 가지 않습니다 — 이것이 깁스 현상입니다. (엄밀한 증명은 생략하고 수치로 확인합니다.)`,
                en: String.raw`This fraction does not go to 0 as \(N\) grows — that is the Gibbs phenomenon. (Verified numerically; the rigorous proof is omitted.)`,
              },
            },
          ],
        },
        {
          id: 'leibniz-link',
          statement: {
            ko: String.raw`\(x = \pi/2\)에서 \(S_N\)이 라이프니츠 급수가 됨을 대수적으로 보이세요.`,
            en: String.raw`Show algebraically that \(S_N\) at \(x = \pi/2\) becomes the Leibniz series.`,
          },
          display: [String.raw`S_N\!\left(\tfrac{\pi}{2}\right) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{(-1)^{k+1}}{2k-1} \to 1`],
          preset: { N: 50 },
          presetCaption: {
            ko: String.raw`\(x = \pi/2\)에서 부분합은 라이프니츠 부분합의 \(\frac{4}{\pi}\)배입니다.`,
            en: String.raw`At \(x = \pi/2\) the partial sum is \(\frac{4}{\pi}\) times the Leibniz partial sum.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(\sin\left((2k-1)\frac{\pi}{2}\right) = (-1)^{k+1}\)이므로 \(S_N(\pi/2) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{(-1)^{k+1}}{2k-1}\)입니다.`,
                en: String.raw`Since \(\sin\left((2k-1)\frac{\pi}{2}\right) = (-1)^{k+1}\), \(S_N(\pi/2) = \frac{4}{\pi}\sum_{k=1}^{N}\frac{(-1)^{k+1}}{2k-1}\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(N \to \infty\)일 때 괄호 안은 라이프니츠 급수 \(\frac{\pi}{4}\)로 수렴합니다 (급수 챕터).`,
                en: String.raw`As \(N \to \infty\), the bracket tends to the Leibniz series \(\frac{\pi}{4}\) (series chapter).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 \(S_N(\pi/2) \to \frac{4}{\pi}\cdot\frac{\pi}{4} = 1\)로, 정사각파의 값과 일치합니다.`,
                en: String.raw`Hence \(S_N(\pi/2) \to \frac{4}{\pi}\cdot\frac{\pi}{4} = 1\), matching the square wave's value.`,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'lebesgue',
      title: { ko: '디리클레 vs 르벡', en: 'Covering the Rationals with Nothing' },
      order: 9,
      summary: {
        ko: String.raw`유리수를 \(\varepsilon/2^k\) 덮개로 하나씩 덮으면 총길이가 \(\varepsilon\) 아래로 떨어집니다. 리만은 꼼짝 못 합니다.`,
        en: String.raw`Cover the rationals one by one with \(\varepsilon/2^k\) covers — the total length drops below \(\varepsilon\). Riemann can't move.`,
      },
      tex: [String.raw`m(\mathbb{Q}\cap[0,1]) = 0`],
      controls: [
        { kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
        { kind: 'slider', key: 'K', label: { ko: '유리수 개수 K', en: 'Rationals K' }, min: 1, max: 64, step: 1, init: 16 },
      ],
      problems: [
        {
          id: 'point',
          statement: {
            ko: String.raw`한 점 \(\{x_0\}\)의 측도가 0임을 덮개로 증명하세요.`,
            en: String.raw`Prove by covering that a single point \(\{x_0\}\) has measure 0.`,
          },
          display: [String.raw`m(\{x_0\}) \le \varepsilon \quad \forall\,\varepsilon > 0`],
          preset: { epsilon: 0.1, K: 1 },
          presetCaption: {
            ko: String.raw`\(K = 1\): 첫 유리수 \(0\)을 길이 \(0.05\) 덮개로 덮습니다.`,
            en: String.raw`\(K = 1\): the first rational \(0\) gets a cover of length \(0.05\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`임의의 \(\varepsilon > 0\)에 대해 구간 \((x_0 - \varepsilon/2,\, x_0 + \varepsilon/2)\)는 \(\{x_0\}\)를 덮고 길이는 \(\varepsilon\)입니다.`,
                en: String.raw`For any \(\varepsilon > 0\), the interval \((x_0 - \varepsilon/2,\, x_0 + \varepsilon/2)\) covers \(\{x_0\}\) and has length \(\varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 외측도는 \(\varepsilon\) 이하이고, \(\varepsilon\)이 임의이므로 측도는 \(0\)입니다.`,
                en: String.raw`So the outer measure is at most \(\varepsilon\), and since \(\varepsilon\) is arbitrary, the measure is \(0\).`,
              },
            },
          ],
        },
        {
          id: 'rationals',
          statement: {
            ko: String.raw`\(m(\mathbb{Q}\cap[0,1]) = 0\)을 \(\varepsilon/2^k\) 덮개로 증명하세요.`,
            en: String.raw`Prove \(m(\mathbb{Q}\cap[0,1]) = 0\) with the \(\varepsilon/2^k\) covering.`,
          },
          display: [String.raw`\sum_{k=1}^{\infty}\frac{\varepsilon}{2^k} = \varepsilon`],
          preset: { epsilon: 0.05, K: 32 },
          presetCaption: {
            ko: String.raw`\(\varepsilon = 0.05\), \(K = 32\): 총길이 \(\approx 0.05\)로 유리수 32개를 덮습니다.`,
            en: String.raw`\(\varepsilon = 0.05\), \(K = 32\): total length \(\approx 0.05\) covers 32 rationals.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`유리수는 가산집합이므로 \([0,1]\)의 유리수를 \(r_1, r_2, \dots\)로 나열합니다.`,
                en: String.raw`The rationals are countable, so enumerate those in \([0,1]\) as \(r_1, r_2, \dots\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(r_k\)를 길이 \(\varepsilon/2^k\)인 구간으로 덮으면 전체 덮개의 총길이는 \(\sum_{k=1}^{\infty}\varepsilon/2^k = \varepsilon\)입니다.`,
                en: String.raw`Covering \(r_k\) with an interval of length \(\varepsilon/2^k\) gives total cover length \(\sum_{k=1}^{\infty}\varepsilon/2^k = \varepsilon\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\varepsilon > 0\)이 임의이므로 외측도는 \(0\)이고, 따라서 측도도 \(0\)입니다.`,
                en: String.raw`Since \(\varepsilon > 0\) is arbitrary, the outer measure is \(0\), hence so is the measure.`,
              },
            },
          ],
        },
        {
          id: 'dirichlet-lebesgue',
          statement: {
            ko: String.raw`디리클레 함수의 르벡 적분은 0임을 (짧게) 증명하고, 리만 적분과 대비하세요.`,
            en: String.raw`Prove (briefly) that the Lebesgue integral of the Dirichlet function is 0, and contrast with Riemann.`,
          },
          display: [String.raw`\int_{[0,1]} D = 1\cdot m(\mathbb{Q}\cap[0,1]) + 0 = 0`],
          preset: { epsilon: 0.2, K: 16 },
          presetCaption: {
            ko: String.raw`\(D = 1\)인 집합(유리수)은 측도 0 — 나머지는 \(D = 0\)입니다.`,
            en: String.raw`The set where \(D = 1\) (the rationals) has measure 0 — elsewhere \(D = 0\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(D = 1\)인 집합은 \(\mathbb{Q}\cap[0,1]\)로 측도가 \(0\)이고, 나머지는 \(D = 0\)입니다.`,
                en: String.raw`The set where \(D = 1\) is \(\mathbb{Q}\cap[0,1]\), of measure \(0\); elsewhere \(D = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 르벡 적분은 \(1 \cdot 0 + 0 \cdot 1 = 0\)입니다.`,
                en: String.raw`So the Lebesgue integral is \(1 \cdot 0 + 0 \cdot 1 = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`반면 리만은 모든 분할에서 \(U = 1\), \(L = 0\)으로 꼼짝 못 합니다 — 르벡은 "값이 얼마나 자주 나오는지"를 셉니다.`,
                en: String.raw`Riemann, by contrast, is stuck at \(U = 1\), \(L = 0\) for every partition — Lebesgue counts "how often each value occurs".`,
              },
            },
          ],
        },
      ],
    },
  ],
};
