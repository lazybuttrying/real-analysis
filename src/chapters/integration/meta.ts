import type { ChapterMeta } from '../../contracts.ts';
import { absoluteContinuityProblems } from '../calculus/problems/absolute-continuity';
import { bohrMollerupProblems } from '../series/problems/bohr-mollerup';
import { boundedVariationProblems } from '../calculus/problems/bounded-variation';
import { jordanDecompositionProblems } from '../calculus/problems/jordan-decomposition';
import { problems as betaFunctionProblems } from '../series/problems/beta-function';
import { problems as ftcProblems } from '../calculus/problems/ftc';
import { changeOfVariablesProblems } from '../calculus/problems/change-of-variables';
import { integrationByPartsProblems } from '../calculus/problems/integration-by-parts';
import { problems as gammaProblems } from '../series/problems/gamma';
import { problems as improperProblems } from '../series/problems/improper';
import { problems as lebesgueProblems } from '../calculus/problems/lebesgue';
import { problems as measureProblems } from '../calculus/problems/measure';
import { problems as riemannProblems } from '../calculus/problems/riemann';
import { volterraFunctionProblems } from '../calculus/problems/volterra-function';

/**
 * Pure data. Imports types plus per-scene problems data modules
 * (../{limits,series,calculus}/problems/* — data only, no code, models, views, or shell). Node build scripts and every chapter's navigation read
 * this file. Every text is stored per language; the shell picks one via the
 * URL language segment. Summaries embed math as inline TeX between \( and \)
 * (see splitInlineMath in contracts.ts).
 *
 * NOTE (10-chapter split): this is a LOGICAL chapter. The scene files
 * (models/, scenes/, problems/) live in the legacy scene stores
 * src/chapters/{limits,series,calculus}/ and are referenced here via
 * relative paths. See docs/ARCHITECTURE.md ("Physical vs logical chapters").
 */
export const integration: ChapterMeta = {
  id: 'integration',
  title: { ko: '적분', en: 'Integration' },
  summary: {
    ko: '리만 적분에서 르베그 적분까지 — 적분의 개념이 어떻게 확장되는지 따라갑니다.',
    en: 'From the Riemann integral to the Lebesgue integral — how the idea of integration expands.',
  },
  scenes: [
    {
      id: 'gamma',
      title: { ko: '감마함수', en: 'The Gamma Function' },
      order: 1,
      summary: {
        ko: String.raw`팩토리얼을 실수로 늘인 함수 — \(\Gamma(x+1) = x\Gamma(x)\)라서 \(\Gamma(n+1) = n!\)입니다. \(x > 0\)에서 이상적분이 수렴함을 확인합니다.`,
        en: String.raw`The factorial stretched to real arguments — \(\Gamma(x+1) = x\Gamma(x)\), so \(\Gamma(n+1) = n!\). Watch the improper integral converge for \(x > 0\).`,
      },
      tex: [
        String.raw`\Gamma(x) = \int_0^\infty t^{x-1} e^{-t}\,dt \quad (x > 0)`,
        String.raw`\Gamma(x+1) = x\,\Gamma(x)`,
      ],
      prerequisites: ['stirling'],
      controls: [{ kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: 0.1, max: 4, step: 0.05, init: 2 }],
problems: gammaProblems,
    },
    {
      id: 'beta-function',
      title: { ko: '베타 함수', en: 'The Beta Function' },
      order: 2,
      summary: {
        ko: String.raw`\\(t^{p-1}(1-t)^{q-1}\\) 곡선 아래 넓이가 베타 함수 — \\(p\\), \\(q\\) 슬라이더로 모양이 바뀌는 모습을 보세요. 감마함수와의 관계 \\(B(p,q) = \\Gamma(p)\\Gamma(q)/\\Gamma(p+q)\\)도 함께 다룹니다.`,
        en: String.raw`The area under \\(t^{p-1}(1-t)^{q-1}\\) is the beta function — morph its shape with the \\(p\\), \\(q\\) sliders. Also covers \\(B(p,q) = \\Gamma(p)\\Gamma(q)/\\Gamma(p+q)\\), the bridge to the gamma function.`,
      },
      tex: [
        String.raw`B(p,q)=\\int_0^1 t^{p-1}(1-t)^{q-1}\\,dt\\quad(p,q>0)`,
        String.raw`B(p,q)=\\frac{\\Gamma(p)\\Gamma(q)}{\\Gamma(p+q)}`,
      ],
      prerequisites: ['gamma'],
      controls: [
        { kind: 'slider', key: 'p', label: { ko: 'p', en: 'p' }, min: 0.2, max: 5, step: 0.1, init: 2 },
        { kind: 'slider', key: 'q', label: { ko: 'q', en: 'q' }, min: 0.2, max: 5, step: 0.1, init: 3 },
      ],
problems: betaFunctionProblems,
    },
    {
      id: 'bohr-mollerup',
      title: { ko: '보어-몰레루프 정리', en: 'Bohr–Mollerup Theorem' },
      order: 3,
      summary: {
        ko: String.raw`\(f(1) = 1\)과 \(f(x+1) = x\,f(x)\)만으로는 팩토리얼의 연속 확장이 하나로 정해지지 않습니다 — impostor \(\Gamma(x)(1 + a\sin 2\pi x)\)가 모든 정수점에서 \(\Gamma\)와 완전히 일치하면서도 살아남기 때문입니다. secant 테스트로 로그볼록성이 \(\Gamma\)의 진짜 지문임을 직접 확인하세요.`,
        en: String.raw`\(f(1) = 1\) and \(f(x+1) = x\,f(x)\) do not pin down the continuous extension of the factorial — the impostor \(\Gamma(x)(1 + a\sin 2\pi x)\) matches \(\Gamma\) at every integer and survives. Watch the secant test expose log-convexity as \(\Gamma\)'s true fingerprint.`,
      },
      tex: [
        String.raw`f(1) = 1`,
        String.raw`f(x+1) = x\,f(x) \quad (x > 0)`,
        String.raw`\ln f \text{ is convex on } (0,\infty)`,
        String.raw`f = \Gamma`,
      ],
      prerequisites: ['gamma'],
      controls: [
        { kind: 'slider', key: 'amp', label: { ko: '진폭 a', en: 'Amplitude a' }, min: 0, max: 0.5, step: 0.05, init: 0.3 },
        { kind: 'slider', key: 'probe', label: { ko: '현 테스트 위치 x₀', en: 'Secant probe x₀' }, min: 0.2, max: 1.8, step: 0.1, init: 0.6 },
      ],
problems: bohrMollerupProblems,
    },
    {
      id: 'improper',
      title: { ko: '이상적분', en: 'Improper Integrals' },
      order: 4,
      summary: {
        ko: String.raw`\(\int_1^\infty \frac{dx}{x^p}\)는 \(p > 1\)일 때만 수렴하고, \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\)처럼 특이점 쪽도 다룹니다 — p급수와의 쌍대 장면.`,
        en: String.raw`\(\int_1^\infty \frac{dx}{x^p}\) converges only for \(p > 1\), plus the singular kind \(\int_0^1 \frac{dx}{\sqrt{x}} = 2\) — the twin of the p-series scene.`,
      },
      tex: [
        String.raw`\int_1^{\infty}\frac{dx}{x^p} = \frac{1}{p-1}\ \ (p>1)`,
        String.raw`\int_0^1\frac{dx}{\sqrt{x}} = 2`,
      ],
      prerequisites: ['harmonic'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '적분 종류', en: 'Integral kind' }, options: ['tail', 'singular'], init: 'tail' },
        { kind: 'slider', key: 'p', label: { ko: '지수 p', en: 'Exponent p' }, min: 0.5, max: 2, step: 0.01, init: 1 },
        { kind: 'slider', key: 'R', label: { ko: '위끝 R', en: 'Upper limit R' }, min: 2, max: 50, step: 1, init: 10 },
        { kind: 'slider', key: 'eps', label: { ko: '아래끝 ε', en: 'Lower limit ε' }, min: 0.001, max: 0.5, step: 0.001, init: 0.01 },
      ],
problems: improperProblems,
    },
    {
      id: 'riemann',
      title: { ko: '리만합 스퀴즈', en: 'Upper and Lower Sums Close In' },
      order: 5,
      summary: {
        ko: String.raw`\(f(x) = x^2\) 아래에 직사각형을 채워봅니다. 아래합과 위합이 \(\frac{1}{3}\)을 양쪽에서 조여옵니다.`,
        en: String.raw`Fill rectangles under \(f(x) = x^2\). The lower and upper sums squeeze \(\frac{1}{3}\) from both sides.`,
      },
      tex: [String.raw`L(f,P) \le \int_a^b f \le U(f,P)`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Subdivisions n' }, min: 1, max: 48, step: 1, init: 12 }],
problems: riemannProblems,
    },
    {
      id: 'volterra-function',
      title: { ko: 'Volterra 함수', en: "Volterra's Function" },
      order: 6,
      summary: {
        ko: String.raw`어디서나 미분가능하고 도함수가 유계인데, 그 도함수는 리만 적분 불가능 — 팻 칸토어 집합 위에 올린 \((x-a)^2(b-x)^2\sin\frac{1}{x-a}\)형 혹들의 합이 만드는 전설적인 반례입니다.`,
        en: String.raw`Differentiable everywhere with a bounded derivative — yet the derivative is not Riemann integrable. A sum of \((x-a)^2(b-x)^2\sin\frac{1}{x-a}\)-type bumps over a fat Cantor set builds this legendary counterexample.`,
      },
      tex: [
        String.raw`\varphi(x) = (x-a)^2(b-x)^2\sin\frac{1}{x-a}`,
        String.raw`f'\ \text{bounded},\quad f' \notin \mathcal{R}[0,1]`,
      ],
      prerequisites: ['riemann'],
      controls: [
        { kind: 'slider', key: 'stage', label: { ko: '단계', en: 'Stage' }, min: 1, max: 7, step: 1, init: 4 },
        { kind: 'slider', key: 'interval', label: { ko: '확대 구간', en: 'Zoom interval' }, min: 0, max: 126, step: 1, init: 0 },
      ],
problems: volterraFunctionProblems,
    },
    {
      id: 'ftc',
      title: { ko: '미적분 기본정리', en: "The Area Function's Derivative Is the Function" },
      order: 7,
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
problems: ftcProblems,
    },
    {
      id: 'integration-by-parts',
      title: { ko: '부분적분', en: 'Integration by Parts' },
      order: 8,
      summary: {
        ko: String.raw`곱의 미분법칙을 적분하면 \(\int u\,dv = [uv] - \int v\,du\) — 면적을 두 조각으로 나누어 각각 계산합니다. \(b\)를 움직이면 양변이 소수점 아래로 일치합니다.`,
        en: String.raw`Integrate the product rule and get \(\int u\,dv = [uv] - \int v\,du\) — split the area into two pieces and compute each. Move \(b\): both sides agree to the last decimal.`,
      },
      tex: [
        String.raw`\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du`,
        String.raw`\int x e^x\,dx = (x-1)e^x + C`,
      ],
      prerequisites: ['ftc'],
      controls: [
        {
          kind: 'select',
          key: 'pair',
          label: { ko: '함수 쌍', en: 'Function pair' },
          options: ['x·e^x', 'x·sin x'],
          init: 'x·e^x',
        },
        { kind: 'slider', key: 'b', label: { ko: '상한 b', en: 'Upper limit b' }, min: 0.5, max: 3, step: 0.1, init: 2 },
      ],
      problems: integrationByPartsProblems,
    },
    {
      id: 'change-of-variables',
      title: { ko: '치환적분', en: 'Change of Variables' },
      order: 9,
      summary: {
        ko: String.raw`\(u = \varphi(x)\)로 축을 늘이고 줄이면 적분 구간이 따라 바뀝니다 — \(\int_a^b f(\varphi)\varphi' = \int_{\varphi(a)}^{\varphi(b)} f\). 두 치환이 같은 적분으로 모이는 것을 보세요.`,
        en: String.raw`Stretch and squeeze the axis with \(u = \varphi(x)\) and the limits follow — \(\int_a^b f(\varphi)\varphi' = \int_{\varphi(a)}^{\varphi(b)} f\). Watch two substitutions collapse onto the same integral.`,
      },
      tex: [
        String.raw`\int_a^b f(\varphi(x))\varphi'(x)\,dx = \int_{\varphi(a)}^{\varphi(b)} f(u)\,du`,
        String.raw`\int_0^1 2x e^{x^2}\,dx = \int_0^1 e^u\,du = e - 1`,
      ],
      prerequisites: ['integration-by-parts'],
      controls: [
        {
          kind: 'select',
          key: 'sub',
          label: { ko: '치환', en: 'Substitution' },
          options: ['u=x^2', 'u=sin x'],
          init: 'u=x^2',
        },
        { kind: 'slider', key: 'N', label: { ko: '구간 수', en: 'Panels' }, min: 4, max: 200, step: 4, init: 50 },
      ],
      problems: changeOfVariablesProblems,
    },
    {
      id: 'bounded-variation',
      title: { ko: '유계변동 함수', en: 'Functions of Bounded Variation' },
      order: 10,
      summary: {
        ko: String.raw`분할을 잘게 쪼갤 때 \(\sum \lvert f(x_i) - f(x_{i-1})\rvert\)이 유한한 상한 안에 머무르면 유계변동 — 단조함수는 전부 해당하고, \(x\sin(1/x)\)처럼 0 근처에서 끝없이 출렁이면 탈락합니다.`,
        en: String.raw`A function has bounded variation when \(\sum \lvert f(x_i) - f(x_{i-1})\rvert\) stays under a finite ceiling as partitions refine — every monotone function qualifies, while \(x\sin(1/x)\), wiggling endlessly near 0, does not.`,
      },
      tex: [
        String.raw`V_a^b(f) = \sup_P \sum_{i=1}^{n} \lvert f(x_i) - f(x_{i-1})\rvert < \infty`,
        String.raw`f = g - h, \quad g, h\ \text{increasing (Jordan)}`,
      ],
      prerequisites: ['riemann'],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['sine', 'wild'],
          init: 'sine',
        },
        { kind: 'slider', key: 'n', label: { ko: '분할 점 수 n', en: 'Partition points n' }, min: 2, max: 200, step: 1, init: 40 },
      ],
problems: boundedVariationProblems,
    },
    {
      id: 'jordan-decomposition',
      title: { ko: '조르당 분해', en: 'Jordan Decomposition' },
      order: 11,
      summary: {
        ko: String.raw`유계변동 함수는 두 단조증가 함수의 차입니다 — \(f = g - h\), 여기서 \(g(x) = V_0^x(f)\)는 변동함수. \(x^2\sin\frac{1}{x}\) 위에서 점을 움직이며 분해가 점마다 성립하는 것을 확인하세요.`,
        en: String.raw`Every BV function is a difference of two increasing functions — \(f = g - h\) with \(g(x) = V_0^x(f)\) the variation function. Drag the probe point over \(x^2\sin\frac{1}{x}\) and watch the identity hold pointwise.`,
      },
      tex: [
        String.raw`f = g - h, \quad g(x) = V_a^x(f), \; h = g - f`,
        String.raw`f(x) = x^2\sin\frac{1}{x}\ (x > 0), \; f(0) = 0`,
      ],
      prerequisites: ['bounded-variation'],
      controls: [
        { kind: 'slider', key: 'X0', label: { ko: '관찰점 X₀', en: 'Probe point X₀' }, min: 0, max: 1, step: 0.001, init: 0.7 },
      ],
      problems: jordanDecompositionProblems,
    },
    {
      id: 'measure',
      title: { ko: '르베그 측도', en: 'Lebesgue Measure' },
      order: 12,
      summary: {
        ko: String.raw`외측도는 집합을 덮는 가산 구간 덮개 중 가장 싼 값입니다. 한 점은 물론 유리수 전체도 비용이 0으로 떨어집니다. 가측집합과 가산 가법성은 Carathéodory 구성 너머의 이야기입니다 (아이디어 수준).`,
        en: String.raw`Outer measure is the cheapest countable interval cover of a set. A single point — and even all the rationals — cost nothing. Measurable sets and countable additivity need the Carathéodory construction (idea level only).`,
      },
      tex: [String.raw`m^*(A) = \inf \sum \ell(I_n)`, String.raw`m^*(\mathbb{Q}\cap[0,1]) = 0`],
      prerequisites: ['riemann'],
      controls: [
        { kind: 'select', key: 'target', label: { ko: '대상 집합', en: 'Target set' }, options: ['singleton', 'rationals', 'interval'], init: 'rationals' },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
        { kind: 'slider', key: 'K', label: { ko: '유리수 개수 K', en: 'Rationals K' }, min: 1, max: 64, step: 1, init: 16 },
      ],
      problems: measureProblems,
    },
    {
      id: 'lebesgue',
      title: { ko: '디리클레 vs 르벡', en: 'Covering the Rationals with Nothing' },
      order: 13,
      summary: {
        ko: String.raw`유리수를 \(\varepsilon/2^k\) 덮개로 하나씩 덮으면 총길이가 \(\varepsilon\) 아래로 떨어집니다. 리만은 꼼짝 못 합니다.`,
        en: String.raw`Cover the rationals one by one with \(\varepsilon/2^k\) covers — the total length drops below \(\varepsilon\). Riemann can't move.`,
      },
      tex: [String.raw`m(\mathbb{Q}\cap[0,1]) = 0`],
      controls: [
        { kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
        { kind: 'slider', key: 'K', label: { ko: '유리수 개수 K', en: 'Rationals K' }, min: 1, max: 64, step: 1, init: 16 },
      ],
problems: lebesgueProblems,
    },
    {
      id: 'absolute-continuity',
      title: { ko: '절대연속성', en: 'Absolute Continuity' },
      order: 14,
      summary: {
        ko: String.raw`\(F(x) = x^2\)는 절대연속 — 구간들의 총 길이가 0으로 가면 \(\sum |\Delta F|\)도 0으로 갑니다. 칸토어 함수는 균등연속이지만 절대연속이 아닙니다: 총 길이 \(\left(\frac23\right)^n \to 0\)인데 \(\sum |\Delta c| = 1\)에 고정됩니다. 절대연속인 함수는 정확히 Lebesgue 적분 가능한 함수의 부정적분입니다.`,
        en: String.raw`\(F(x) = x^2\) is absolutely continuous — when the intervals' total length goes to 0, so does \(\sum |\Delta F|\). The Cantor function is uniformly continuous but not absolutely continuous: total length \(\left(\frac23\right)^n \to 0\) while \(\sum |\Delta c| = 1\) stays frozen. Absolutely continuous functions are exactly the indefinite integrals of Lebesgue-integrable functions.`,
      },
      tex: [
        String.raw`F \text{ absolutely continuous } \iff \forall \varepsilon > 0\, \exists \delta > 0: \sum (b_i - a_i) < \delta \Rightarrow \sum |F(b_i) - F(a_i)| < \varepsilon`,
        String.raw`F(x) = F(a) + \int_a^x f\,dx\quad (f \in L^1) \iff F \text{ absolutely continuous}`,
      ],
      prerequisites: ['lebesgue', 'ftc'],
      controls: [
        { kind: 'select', key: 'func', label: { ko: '함수', en: 'Function' }, options: ['square', 'cantor'], init: 'square' },
        { kind: 'slider', key: 'scale', label: { ko: 'δ / 단계 n', en: 'δ / stage n' }, min: 1, max: 10, step: 1, init: 4 },
      ],
problems: absoluteContinuityProblems,
    },
  ],
};
