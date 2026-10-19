import type { ChapterMeta } from '../../contracts.ts';
import { absoluteContinuityProblems } from '../calculus/problems/absolute-continuity';
import { bohrMollerupProblems } from '../series/problems/bohr-mollerup';
import { borelCantelliProblems } from '../calculus/problems/borel-cantelli';
import { boundedVariationProblems } from '../calculus/problems/bounded-variation';
import { jordanDecompositionProblems } from '../calculus/problems/jordan-decomposition';
import { problems as betaFunctionProblems } from '../series/problems/beta-function';
import { problems as ftcProblems } from '../calculus/problems/ftc';
import { changeOfVariablesProblems } from '../calculus/problems/change-of-variables';
import { dirichletFunctionProblems } from '../calculus/problems/dirichlet-function';
import { egorovProblems } from '../calculus/problems/egorov';
import { fubiniTonelliProblems } from '../calculus/problems/fubini-tonelli';
import { gabrielHornProblems } from '../calculus/problems/gabriel-horn';
import { riemannStieltjesProblems } from '../calculus/problems/riemann-stieltjes';
import { integrationByPartsProblems } from '../calculus/problems/integration-by-parts';
import { problems as gammaProblems } from '../series/problems/gamma';
import { problems as improperProblems } from '../series/problems/improper';
import { problems as lebesgueProblems } from '../calculus/problems/lebesgue';
import { lebesgueConvergenceProblems } from '../calculus/problems/lebesgue-convergence';
import { problems as measureProblems } from '../calculus/problems/measure';
import { problems as riemannProblems } from '../calculus/problems/riemann';
import { vitaliProblems } from '../calculus/problems/vitali';
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
      id: 'gabriel-horn',
      title: { ko: '가브리엘의 나팔', en: "Gabriel's Horn" },
      order: 5,
      summary: {
        ko: String.raw`\(y = 1/x\) (\(x \ge 1\))를 회전시키면 부피는 \(\pi\)로 유한하지만 겉넓이는 무한대인 나팔이 됩니다 — \(\pi\)만큼의 페인트로는 채울 수 있지만, 표면을 칠하려면 무한대가 필요합니다. 화가의 역설입니다.`,
        en: String.raw`Rotating \(y = 1/x\) (\(x \ge 1\)) makes a horn with finite volume \(\pi\) but infinite surface area — fillable with \(\pi\) of paint, yet unpaintable. The painter's paradox.`,
      },
      tex: [
        String.raw`V = \pi\int_1^{\infty} \frac{dx}{x^2} = \pi`,
        String.raw`A \ge 2\pi\int_1^R \frac{dx}{x} = 2\pi\ln R \to \infty`,
      ],
      prerequisites: ['improper'],
      controls: [
        { kind: 'slider', key: 'r', label: { ko: '절단 R', en: 'Truncation R' }, min: 1, max: 50, step: 0.5, init: 5 },
      ],
      problems: gabrielHornProblems,
    },
    {
      id: 'riemann',
      title: { ko: '리만합 스퀴즈', en: 'Upper and Lower Sums Close In' },
      order: 6,
      summary: {
        ko: String.raw`\(f(x) = x^2\) 아래에 직사각형을 채워봅니다. 아래합과 위합이 \(\frac{1}{3}\)을 양쪽에서 조여옵니다.`,
        en: String.raw`Fill rectangles under \(f(x) = x^2\). The lower and upper sums squeeze \(\frac{1}{3}\) from both sides.`,
      },
      tex: [String.raw`L(f,P) \le \int_a^b f \le U(f,P)`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Subdivisions n' }, min: 1, max: 48, step: 1, init: 12 }],
problems: riemannProblems,
    },
    {
      id: 'dirichlet-function',
      title: { ko: '디리클레 함수', en: 'The Dirichlet Function' },
      order: 7,
      summary: {
        ko: String.raw`\(\mathbf{1}_{\mathbb{Q}}\)는 \([0, 1]\) 위에서 유리수면 1, 무리수면 0 — 모든 부분구간에 유리수와 무리수가 둘 다 들어 있어서 위합은 항상 1, 아래합은 항상 0입니다. 분할을 잘게 쪼개도 틈이 닫히지 않는, 리만 적분 불가능의 대표 반례입니다.`,
        en: String.raw`\(\mathbf{1}_{\mathbb{Q}}\) is 1 on the rationals and 0 on the irrationals of \([0, 1]\) — every subinterval holds both, so the upper sum is always 1 and the lower sum always 0. The canonical non-Riemann-integrable function: no refinement closes the gap.`,
      },
      tex: [
        String.raw`U(f,P) = 1,\ L(f,P) = 0\ \forall P`,
        String.raw`f = \mathbf{1}_{\mathbb{Q}}`,
      ],
      prerequisites: ['riemann'],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Subdivisions n' }, min: 1, max: 32, step: 1, init: 8 }],
      problems: dirichletFunctionProblems,
    },
    {
      id: 'volterra-function',
      title: { ko: 'Volterra 함수', en: "Volterra's Function" },
      order: 8,
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
      order: 9,
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
      order: 10,
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
      order: 11,
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
      order: 12,
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
      id: 'riemann-stieltjes',
      title: { ko: '리만-스틸체스 적분', en: 'The Riemann–Stieltjes Integral' },
      order: 13,
      summary: {
        ko: String.raw`적분자를 바꾸는 법 — \(\int_a^b f\,d\alpha\)는 구간의 길이가 아니라 \(\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1})\)로 무게를 잽니다. \(\alpha(x) = x\)이면 리만합 그 자체, 계단 \(\alpha\)면 점프 하나로 붕괴, \(\alpha(x) = x^2\)이면 \(\int f\alpha'\,dx\)가 됩니다.`,
        en: String.raw`Changing the integrator — \(\int_a^b f\,d\alpha\) weighs intervals by \(\Delta\alpha_i = \alpha(x_i) - \alpha(x_{i-1})\) instead of length. \(\alpha(x) = x\) recovers Riemann sums, a step \(\alpha\) collapses to a single jump, \(\alpha(x) = x^2\) gives \(\int f\alpha'\,dx\).`,
      },
      tex: [
        String.raw`U(f,P,\alpha) = \sum M_i\,\Delta\alpha_i`,
        String.raw`\int_a^b f\,d\alpha`,
      ],
      prerequisites: ['bounded-variation'],
      controls: [
        { kind: 'select', key: 'alpha', label: { ko: '적분자 α', en: 'Integrator α' }, options: ['identity', 'square', 'step'], init: 'identity' },
        { kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Subdivisions n' }, min: 1, max: 24, step: 1, init: 6 },
      ],
      problems: riemannStieltjesProblems,
    },
    {
      id: 'jordan-decomposition',
      title: { ko: '조르당 분해', en: 'Jordan Decomposition' },
      order: 14,
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
      order: 15,
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
      id: 'vitali',
      title: { ko: '비탈리 집합', en: 'The Vitali Set' },
      order: 16,
      summary: {
        ko: String.raw`선택공리로 \(\mathbb{R}/\mathbb{Q}\)의 각 동치류에서 대표원 하나씩을 뽑으면 — 측도를 잴 수 없는 집합이 탄생합니다. 가산개의 서로소 평행이동이 \([0,1]\)을 덮으면서 \([-1,2]\) 안에 들어가는데, 측도가 0이면 합이 0, 양수면 무한대 — 둘 다 모순입니다.`,
        en: String.raw`Using the axiom of choice to pick one representative from each class of \(\mathbb{R}/\mathbb{Q}\) births a non-measurable set. Countably many disjoint translates cover \([0,1]\) inside \([-1,2]\) — yet measure 0 gives total 0 and positive measure gives infinity. Both impossible.`,
      },
      tex: [
        String.raw`[0,1] \subseteq \bigsqcup_{q \in \mathbb{Q}\cap[-1,1]} (V + q) \subseteq [-1,2]`,
        String.raw`m(V) > 0 \Rightarrow \sum m(V) = \infty > 3,\qquad m(V) = 0 \Rightarrow \sum m(V) = 0 < 1`,
      ],
      prerequisites: ['measure'],
      controls: [
        { kind: 'slider', key: 'd', label: { ko: '분모 상한 d', en: 'Denominator cap d' }, min: 1, max: 6, step: 1, init: 3 },
      ],
      problems: vitaliProblems,
    },
    {
      id: 'borel-cantelli',
      title: { ko: '보렐-칸텔리 보조정리', en: 'Borel–Cantelli Lemmas' },
      order: 17,
      summary: {
        ko: String.raw`길이의 총합이 유한하면 무한히 자주 일어나는 점은 측도 0입니다 — \(\sum m(E_n) < \infty \Rightarrow m(\limsup E_n) = 0\). 독립이면 역도 성립합니다.`,
        en: String.raw`If the total length is finite, the points hit infinitely often form a null set — \(\sum m(E_n) < \infty \Rightarrow m(\limsup E_n) = 0\). With independence the converse holds.`,
      },
      tex: [
        String.raw`m(\limsup_{n\to\infty} E_n) = 0 \quad \left(\sum_{n=1}^{\infty} m(E_n) < \infty\right)`,
        String.raw`\sum m(E_n) = \infty,\ E_n \text{ independent } \Rightarrow m(\limsup E_n) = 1`,
      ],
      prerequisites: ['measure'],
      controls: [
        { kind: 'select', key: 'mode', label: { ko: '모드', en: 'Mode' }, options: ['summable', 'nonsummable'], init: 'summable' },
        { kind: 'slider', key: 'n', label: { ko: '집합 개수 n', en: 'Number of sets n' }, min: 1, max: 60, step: 1, init: 20 },
      ],
      problems: borelCantelliProblems,
    },
    {
      id: 'lebesgue',
      title: { ko: '디리클레 vs 르벡', en: 'Covering the Rationals with Nothing' },
      order: 18,
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
      id: 'lebesgue-convergence',
      title: { ko: '르벡 수렴 정리', en: 'Lebesgue Convergence Theorems' },
      order: 19,
      summary: {
        ko: String.raw`단조수렴·파투·지배수렴 — 극한과 적분의 순서를 바꾸는 세 기둥입니다. 질량이 도망가는(escape·spike) 예에서 가설이 왜 필요한지 눈으로 확인하세요.`,
        en: String.raw`Monotone convergence, Fatou, dominated convergence — the three pillars for swapping limits and integrals. Watch mass escape (escape·spike) to see why each hypothesis is needed.`,
      },
      tex: [
        String.raw`f_n \uparrow f \Rightarrow \int f_n \uparrow \int f`,
        String.raw`\int \liminf f_n \le \liminf \int f_n`,
        String.raw`|f_n| \le g,\ f_n \to f \text{ a.e. } \Rightarrow \int f_n \to \int f`,
      ],
      prerequisites: ['lebesgue'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['escape', 'spike', 'monotone'], init: 'escape' },
        { kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 40, step: 1, init: 10 },
      ],
      problems: lebesgueConvergenceProblems,
    },
    {
      id: 'fubini-tonelli',
      title: { ko: '푸비니-토넬리 정리', en: 'Fubini–Tonelli Theorem' },
      order: 20,
      summary: {
        ko: String.raw`음이 아닌 함수(Tonelli)나 적분 가능한 함수(Fubini)는 적분 순서를 바꿔도 같습니다 — 행부터 더하나 열부터 더하나 같은 수. 적분 가능성 없이는 깨집니다.`,
        en: String.raw`Nonnegative (Tonelli) or integrable (Fubini) functions give the same iterated integrals in either order — rows-first or columns-first. Without integrability it breaks.`,
      },
      tex: [
        String.raw`\iint f = \int\!\!\left(\int f\,dx\right)\!dy = \int\!\!\left(\int f\,dy\right)\!dx`,
      ],
      prerequisites: ['lebesgue-convergence'],
      controls: [
        { kind: 'select', key: 'mode', label: { ko: '함수 모드', en: 'Function mode' }, options: ['separable', 'tent'], init: 'separable' },
        { kind: 'slider', key: 'n', label: { ko: '격자 N', en: 'Grid N' }, min: 8, max: 64, step: 8, init: 32 },
      ],
      problems: fubiniTonelliProblems,
    },
    {
      id: 'egorov',
      title: { ko: '에고로프 정리', en: "Egorov's Theorem" },
      order: 21,
      summary: {
        ko: String.raw`유한 측도에서 a.e. 수렴은 "거의" 균등수렴입니다 — 나쁜 집합의 측도를 \(\varepsilon\) 아래로 누르면 나머지에선 균등하게 수렴합니다.`,
        en: String.raw`On finite measure, a.e. convergence is "almost" uniform — squeeze the bad set's measure below \(\varepsilon\) and convergence is uniform on the rest.`,
      },
      tex: [
        String.raw`m(E \setminus F) < \varepsilon \Rightarrow f_n \to f \text{ uniformly on } F`,
      ],
      prerequisites: ['lebesgue-convergence'],
      controls: [
        { kind: 'slider', key: 'delta', label: { ko: 'δ (나쁜 집합 기준)', en: 'δ (bad-set threshold)' }, min: 0.1, max: 1, step: 0.05, init: 0.5 },
        { kind: 'slider', key: 'n', label: { ko: '단계 n', en: 'Stage n' }, min: 1, max: 40, step: 1, init: 6 },
      ],
      problems: egorovProblems,
    },
    {
      id: 'absolute-continuity',
      title: { ko: '절대연속성', en: 'Absolute Continuity' },
      order: 22,
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
