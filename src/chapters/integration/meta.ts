import type { ChapterMeta } from '../../contracts.ts';
import { absoluteContinuityProblems } from '../calculus/problems/absolute-continuity';
import { arcLengthProblems } from '../calculus/problems/arc-length';
import { convolutionProblems } from '../calculus/problems/convolution';
import { bohrMollerupProblems } from '../series/problems/bohr-mollerup';
import { borelCantelliProblems } from '../calculus/problems/borel-cantelli';
import { boundedVariationProblems } from '../calculus/problems/bounded-variation';
import { jordanDecompositionProblems } from '../calculus/problems/jordan-decomposition';
import { problems as betaFunctionProblems } from '../series/problems/beta-function';
import { problems as ftcProblems } from '../calculus/problems/ftc';
import { changeOfVariablesProblems } from '../calculus/problems/change-of-variables';
import { dirichletFunctionProblems } from '../calculus/problems/dirichlet-function';
import { differentiationUnderIntegralProblems } from '../calculus/problems/differentiation-under-integral';
import { minkowskiProblems } from '../calculus/problems/minkowski';
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
        ko: String.raw`팩토리얼을 실수까지 늘인 함수를 봅니다. 정수에서는 계단처럼 뛰던 값이 매끄러운 곡선이 됩니다.

핵심 규칙은 한 칸 밀면 그 칸의 수가 곱해진다는 것입니다. 이 규칙이 정수 사이 값을 채웁니다. 넓이로 정의되는 적분이 그 곡선을 만듭니다.

예를 들면, 🪜 계단이 1, 2, 6, 24처럼 점프하는 사이에 미끄럼틀 같은 곡선을 끼워 넣은 거예요. 이제 계단 사이의 높이도 잴 수 있어요.`,
        en: String.raw`The factorial stretched to real arguments. Values that jumped like stairs become one smooth curve.

The key rule: shifting by one multiplies by the shift amount. That rule fills in the values between integers. An integral, an area, draws the whole curve.

For example, picture a 🪜 staircase jumping 1, 2, 6, 24, with a smooth slide fitted between its steps. Now the heights between steps can be measured too.`,
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
        ko: String.raw`두 지수 p와 q가 만드는 곡선 아래 넓이가 베타 함수입니다. 슬라이더로 곡선 모양이 바뀌는 것을 봅니다.

곡선은 양 끝에서 서로 다른 힘으로 당겨집니다. 그래서 봉우리의 위치와 높이가 달라집니다. 이 넓이는 감마함수들의 비율과 정확히 같습니다.

예를 들면, 🧵 줄의 양쪽 끝을 서로 다른 힘으로 당기면 가운데 볼록한 모양이 달라져요. 양 끝 힘을 조절하는 것이 p와 q의 역할이에요.`,
        en: String.raw`The area under a curve shaped by two exponents, p and q, is the beta function. Sliders morph the curve's shape.

The two ends of the curve are pulled with different strengths. So the hump shifts and changes height. This area equals an exact ratio of gamma functions.

For example, pull the two ends of a 🧵 string with different strengths and the bulge in the middle changes shape. Adjusting the end pulls is what p and q do.`,
      },
      tex: [
        String.raw`B(p,q)=\int_0^1 t^{p-1}(1-t)^{q-1}\,dt\quad(p,q>0)`,
        String.raw`B(p,q)=\frac{\Gamma(p)\Gamma(q)}{\Gamma(p+q)}`,
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
        ko: String.raw`두 가지 규칙만으로는 팩토리얼의 확장 함수가 하나로 정해지지 않습니다. 정수마다 감마함수와 똑같은 가짜 함수가 살아남습니다.

가짜를 걸러내는 추가 조건이 로그볼록성입니다. 로그를 씌운 그래프가 볼록해야 진짜입니다. 현 테스트가 그 지문을 드러냅니다.

예를 들면, 🧑 친구의 키와 몸무게만으로는 그 친구인지 확정할 수 없어요. 지문까지 같아야 확실해요. 로그볼록성이 감마함수의 지문이에요.`,
        en: String.raw`Two rules alone do not pin down the factorial's extension. An impostor matching the gamma function at every integer survives.

One extra condition filters the impostor out: log-convexity. The graph of the logarithm must be convex. The secant test exposes this fingerprint.

For example, height and weight alone cannot confirm a 🧑 friend's identity. A matching fingerprint settles it. Log-convexity is the gamma function's fingerprint.`,
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
        ko: String.raw`끝이 무한히 뻗거나 높이가 폭발하는 구간의 적분을 봅니다. 지수 p가 수렴과 발산을 가릅니다.

무한히 이어져도 넓이가 유한할 수 있습니다. 꼬리가 충분히 빨리 가늘어지면 됩니다. 너무 두꺼우면 넓이는 끝없이 쌓입니다.

예를 들면, 💧 물이 새는 양이 빠르게 줄어들면 영원히 새어도 전체 양은 한 바가지로 정해져요. 줄어드는 속도가 느리면 바가지는 결국 넘쳐요.`,
        en: String.raw`Integrals over intervals that run forever or blow up. The exponent p decides convergence against divergence.

An endless region can still have finite area. Its tail just has to thin out fast enough. Too thick a tail piles area up forever.

For example, a 💧 water leak that slows down quickly spills only one bucketful, even leaking forever. A leak that slows too little overflows the bucket in the end.`,
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
        ko: String.raw`곡선을 회전시켜 만든 나팔의 역설을 봅니다. 부피는 유한한데 겉넓이는 무한대입니다.

안에 채우는 양과 겉을 칠하는 양이 다르게 행동합니다. 얇아지는 속도가 두 계산에서 갈립니다. 그래서 한쪽은 멈추고 한쪽은 계속 자랍니다.

예를 들면, 🧵 줄을 말아 넣으면 작은 📦 상자에 다 들어가요. 하지만 그 줄을 전부 펴서 바닥에 깔면 끝없이 넓은 방이 필요해요.`,
        en: String.raw`Spin a curve into a horn and meet a paradox. The volume is finite but the surface area is infinite.

Filling the inside and painting the outside behave differently. The thinning rate splits the two computations. One total stops growing while the other never does.

For example, a coiled 🧵 string fits inside a small 📦 box. Spread that same string flat across the floor and it would need an endless room.`,
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
        ko: String.raw`곡선 아래에 직사각형을 채워 넓이를 재는 씬입니다. 아래합과 위합이 진짜 넓이를 양쪽에서 조여옵니다.

낮게 채운 값과 높게 채운 값 사이에 답이 있습니다. 분할을 잘게 할수록 두 값의 틈이 좁혀집니다. 틈이 사라지면 그 값이 적분입니다.

예를 들면, 🍰 케이크의 곡선 모양을 네모난 조각들로 채우는 것과 같아요. 조각을 잘게 자를수록 빈틈이 줄고 모양에 딱 맞아요.`,
        en: String.raw`Rectangles pack the region under a curve to measure its area. Lower and upper sums squeeze the true area from both sides.

The answer sits between the underfilled and overfilled totals. Finer partitions narrow the gap between them. When the gap vanishes, that value is the integral.

For example, fit square pieces into the curved shape of a 🍰 cake. The smaller you cut the pieces, the fewer gaps remain and the better they match.`,
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
        ko: String.raw`유리수에서만 1이고 무리수에서는 0인 함수입니다. 리만 적분이 실패하는 대표 반례입니다.

어느 작은 구간에도 유리수와 무리수가 함께 들어 있습니다. 그래서 위합은 항상 1에 머뭅니다. 아래합은 항상 0에 머물러 틈이 닫히지 않습니다.

예를 들면, 검은 ⚽ 공과 흰 공이 아무리 잘게 섞여 있어도, 어떤 무더기를 떠도 두 색이 다 들어 있는 것과 같아요. 그래서 높이를 하나로 정할 수 없어요.`,
        en: String.raw`A function that is 1 on the rationals and 0 on the irrationals. It is the canonical failure of the Riemann integral.

Every tiny interval holds rationals and irrationals together. So the upper sum stays pinned at 1. The lower sum stays at 0 and the gap never closes.

For example, mix black and white ⚽ balls as finely as you like, and every scoop still holds both colors. No single height can be assigned.`,
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
        ko: String.raw`어디서나 미분가능하고 도함수도 유계인데, 그 도함수는 리만 적분이 안 되는 반례입니다. 팻 칸토어 집합 위에 혹들을 올립니다.

함수 자체는 매끄럽게 이어집니다. 문제는 도함수가 두꺼운 집합 위에서 심하게 출렁인다는 것입니다. 리만합은 그 출렁임을 잡아내지 못합니다.

예를 들면, 매끄러운 길 위를 📏 자로 기울기를 재는데, 자가 닿는 곳마다 값이 튀어 기록할 수 없는 것과 같아요. 길은 멀쩡한데 측정이 실패하는 거예요.`,
        en: String.raw`Differentiable everywhere with a bounded derivative, yet that derivative is not Riemann integrable. Bumps rise over a fat Cantor set.

The function itself joins up smoothly. The trouble is its derivative, oscillating hard on a thick set. Riemann sums cannot capture that oscillation.

For example, measure the slope of a smooth road with a 📏 ruler, but the reading jumps wherever the ruler touches. The road is fine; the measurement fails.`,
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
        ko: String.raw`넓이를 쌓는 함수의 기울기를 재는 씬입니다. 그 기울기가 원래 함수와 일치합니다.

넓이가 쌓이는 속도는 그 지점의 높이와 같습니다. 오른쪽 끝을 조금 밀면 그만큼의 띠가 붙습니다. 띠의 넓이는 높이 곱하기 이동 거리입니다.

예를 들면, 💧 물을 탱크에 채울 때 물이 차오르는 속도는 지금 나오는 물의 양과 같아요. 쌓인 양을 미분하면 나오는 양이 되는 거예요.`,
        en: String.raw`Measure the slope of the accumulated-area function. It matches the original function exactly.

Area grows at a rate equal to the height at that point. Nudge the right edge and a thin strip attaches. The strip's area is height times the nudge.

For example, filling a tank with 💧 water, the level rises at the rate the water pours in. Differentiate what has accumulated and you recover what is pouring.`,
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
        ko: String.raw`곱의 미분법칙을 거꾸로 돌려 적분을 바꾸는 씬입니다. 면적을 두 조각으로 나누어 각각 계산합니다.

어려운 적분을 경계값과 쉬운 적분으로 바꿉니다. 넓이 그림에서는 큰 직사각형을 두 조각으로 나눈 것입니다. 양쪽 계산이 소수점 끝까지 일치합니다.

예를 들면, 🍰 케이크의 넓이를 잴 때 전체 네모에서 한 조각을 빼는 방식으로 바꾸면 계산이 쉬워지는 것과 같아요. 나눠서 재면 어려운 모양도 잴 수 있어요.`,
        en: String.raw`Run the product rule backwards to trade one integral for another. The area splits into two pieces, each computed separately.

A hard integral becomes a boundary term plus an easier integral. In the area picture, one big rectangle splits into two pieces. Both computations agree to the last decimal.

For example, measuring a 🍰 cake's area gets easier when you swap to a full rectangle minus one piece. Split the measuring and even awkward shapes become manageable.`,
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
        ko: String.raw`축을 늘이고 줄여 적분 구간을 바꾸는 씬입니다. 서로 다른 두 치환이 같은 적분값으로 모입니다.

눈금을 바꾸면 구간의 끝점도 함께 바뀝니다. 늘어난 비율만큼 넓이를 보정해야 합니다. 보정이 끝나면 어려운 적분이 쉬운 적분이 됩니다.

예를 들면, 눈금이 2배로 늘어난 📏 자로 길이를 재면 잰 값도 2배가 돼요. 그래서 반으로 나눠 보정해야 진짜 길이가 나와요.`,
        en: String.raw`Stretch and squeeze the axis to rewrite an integral. Two different substitutions land on the same value.

Change the scale and the endpoints move along. Areas need correcting by the stretch factor. After the correction, a hard integral turns easy.

For example, measure with a 📏 ruler whose marks are stretched twofold and every reading doubles. Halving the reading corrects it back to the true length.`,
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
        ko: String.raw`함수가 출렁인 총 거리를 재는 씬입니다. 그 합이 유한한 상한 안에 머물면 유계변동입니다.

출발점과 도착점만으로는 부족합니다. 중간에 오르내린 양을 전부 더해야 합니다. 단조함수는 출렁임이 한 방향뿐이라 통과합니다. 끝없이 떨리는 함수는 합이 폭발해 탈락합니다.

예를 들면, 🚗 자동차가 오르락내리락 달려도 주행 거리 총합이 정해져 있으면 유계변동이에요. 한자리에서 끝없이 떨면 거리가 무한히 쌓여요.`,
        en: String.raw`This scene measures the total distance a function wiggles. If that sum stays under a finite ceiling, the function has bounded variation.

Start and finish alone are not enough. Every up and down in between must be added. Monotone functions pass since they wiggle one way only. Endless trembling makes the sum explode.

For example, a 🚗 car driving up and down has bounded variation while its total mileage stays definite. Trembling in place forever would pile the distance up without end.`,
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
      id: 'arc-length',
      title: { ko: '곡선의 길이', en: 'Arc Length' },
      order: 13,
      summary: {
        ko: String.raw`곡선을 곧은 조각들로 나눠 길이를 재는 씬입니다. 조각 길이들의 합이 꺾은선 길이입니다.

분할을 잘게 할수록 그 합은 커지기만 하고 진짜 길이에 아래에서 다가갑니다. 모든 분할에 대한 상한이 곡선의 길이입니다. 그 상한이 무한해지면 길이를 잴 수 없습니다.

예를 들면, 🧵 실을 굽은 길에 따라 깔고 조각조각 곧게 펴서 재는 것과 같아요. 잘게 나눌수록 실의 진짜 길이에 가까워져요.`,
        en: String.raw`This scene measures a curve by cutting it into straight pieces. The sum of the piece lengths is the polygonal length.

Finer partitions only make that sum grow, approaching the true length from below. The supremum over all partitions is the length of the curve. If that supremum is infinite, the curve cannot be measured.

For example, lay a 🧵 string along a winding path and measure it piece by piece, straightening each bit. The finer the pieces, the closer you get to the string's true length.`,
      },
      tex: [
        String.raw`L = \sup_P \sum_{i=1}^{n} |\gamma(t_i) - \gamma(t_{i-1})|`,
        String.raw`L = \int_a^b |\gamma'(t)|\,dt`,
      ],
      prerequisites: ['riemann', 'bounded-variation'],
      controls: [
        { kind: 'select', key: 'curve', label: { ko: '곡선', en: 'Curve' }, options: ['circle', 'parabola'], init: 'circle' },
        { kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Partition count n' }, min: 1, max: 64, step: 1, init: 8 },
      ],
      problems: arcLengthProblems,
    },
    {
      id: 'riemann-stieltjes',
      title: { ko: '리만-스틸체스 적분', en: 'The Riemann–Stieltjes Integral' },
      order: 14,
      summary: {
        ko: String.raw`구간의 길이가 아니라 적분자의 증가분으로 무게를 재는 적분입니다. 적분자를 바꾸면 같은 구간도 다르게 셉니다.

구간마다 무게가 다를 수 있습니다. 계단형 적분자는 한 점에 무게를 몰아넣습니다. 그 경우 적분은 그 점의 값 하나로 정해집니다.

예를 들면, 📦 상자마다 무게가 다른 짐을 합칠 때 개수가 아니라 무게로 합치는 것과 같아요. 한 상자에 무게가 몰리면 전체 합은 그 상자가 정해요.`,
        en: String.raw`An integral that weighs intervals by the integrator's growth, not their length. Change the integrator and the same intervals count differently.

Each interval can carry a different weight. A step integrator dumps all its weight on one point. Then the integral is decided by that point alone.

For example, total cargo by weight, not by count, when each 📦 box weighs differently. If one box holds all the weight, it alone decides the total.`,
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
      order: 15,
      summary: {
        ko: String.raw`유계변동 함수를 두 증가함수의 차이로 나누는 씬입니다. 점을 움직이며 분해가 지점마다 성립하는 것을 확인합니다.

오른 양과 내린 양을 따로 기록합니다. 지금까지 오른 총합에서 내린 총합을 빼면 현재 높이가 됩니다. 변동함수가 오른 총합의 기록입니다.

예를 들면, 🐷 저금통에 넣은 💰 돈의 총합에서 꺼낸 돈의 총합을 빼면 지금 남은 돈이 되는 것과 같아요. 넣기와 빼기를 따로 세는 거예요.`,
        en: String.raw`Every bounded-variation function splits into a difference of two increasing functions. Drag the probe and watch the identity hold pointwise.

Record the total rise and the total fall separately. Subtract falls from rises to get the current height. The variation function is the running record of rises.

For example, money now in a 🐷 piggy bank is the total 💰 money put in minus the total taken out. Rises and falls are counted on separate tallies.`,
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
      order: 16,
      summary: {
        ko: String.raw`집합의 크기를 재는 가장 싼 덮개 값을 봅니다. 한 점은 물론 유리수 전체도 비용이 0으로 떨어집니다.

길이를 재는 규칙을 점이나 유리수 같은 집합까지 넓힙니다. 덮개들의 총 길이가 가장 작은 값을 찾습니다. 그 값이 집합의 크기 후보가 됩니다.

예를 들면, 🧵 줄 조각으로 어떤 집합을 덮을 때, 줄의 총 길이가 가장 짧은 덮개가 그 집합의 크기예요. 점 하나는 줄이 거의 없어도 덮여요.`,
        en: String.raw`The cheapest interval cover prices a set's size. A single point, and even all the rationals, cost nothing.

Length measurement extends to sets like points and rationals. Among all covers, take the smallest total length. That smallest total is the set's size.

For example, cover a set with pieces of 🧵 string; the shortest total string length is the set's size. A single point needs almost no string, so its size is zero.`,
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
      order: 17,
      summary: {
        ko: String.raw`선택공리로 각 무리에서 대표 하나씩을 뽑아 만든 집합입니다. 그 결과, 크기를 잴 수 없는 집합이 탄생합니다.

이 집합을 유리수만큼 밀어낸 복사본들이 구간을 덮습니다. 크기가 0이면 복사본의 합도 0이어야 합니다. 양수이면 합이 무한대가 됩니다. 둘 다 모순이라 크기를 정할 수 없습니다.

예를 들면, 📦 상자 하나를 복사해 늘어놓으면 방을 채우는데, 상자 크기가 0이면 합도 0이어야 하고 조금이라도 있으면 합이 끝없이 커지는 것과 같아요. 그래서 크기를 정할 수 없어요.`,
        en: String.raw`Pick one representative from each equivalence class using the axiom of choice. The result is a set whose size cannot be measured.

Shifted copies of this set cover a whole interval. If its size were zero, the copies would total zero. If positive, the copies would total infinity. Both contradict, so no size exists.

For example, copies of one 📦 box can fill a room, yet if the box's size were zero the total should be zero, and if it were anything more the total would explode. So the size cannot be assigned.`,
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
      order: 18,
      summary: {
        ko: String.raw`길이의 총합이 유한하면, 무한히 자주 일어나는 일은 거의 일어나지 않습니다. 그 경계를 수치로 확인하는 씬입니다.

사건들이 겹치는 지점들을 모아 봅니다. 총 길이가 유한하면 겹침은 점점 희귀해집니다. 독립인 사건에서는 거꾸로도 성립합니다.

예를 들면, 💧 물방울이 점점 작아지는 비가 내려도, 방울 전체 양이 정해져 있으면 한 지점이 끝없이 맞는 일은 거의 없는 것과 같아요.`,
        en: String.raw`If total length is finite, points hit infinitely often form a null set. This scene checks that boundary numerically.

Collect the points where the events keep overlapping. Finite total length makes the overlaps rarer and rarer. With independence, the converse also holds.

For example, in rain whose 💧 water drops keep shrinking, a finite total volume means one spot is almost never hit endlessly.`,
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
      order: 19,
      summary: {
        ko: String.raw`유리수를 하나씩 덮개로 덮으면 총 길이가 얼마든지 작아집니다. 리만 적분이 꼼짝 못하는 장면입니다.

유리수는 셀 수 있게 많습니다. 그래서 번호를 매겨 점점 작은 덮개를 씌울 수 있습니다. 덮개 크기의 합은 원하는 만큼 작아집니다.

예를 들면, 바닥에 흩어진 🍬 사탕을 하나씩 점점 작은 컵으로 덮으면, 컵 크기의 합을 얼마든지 작게 만들 수 있는 것과 같아요.`,
        en: String.raw`Cover the rationals one by one and the total length drops below any bound. The Riemann integral cannot move here.

The rationals are countably many. So they can be numbered and given shrinking covers. The covers' total can be made as small as you wish.

For example, cover 🍬 candies scattered on the floor, one by one, with smaller and smaller cups, and the cups' total size shrinks as low as you like.`,
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
      order: 20,
      summary: {
        ko: String.raw`극한과 적분의 순서를 바꾸는 세 가지 정리를 봅니다. 질량이 도망가는 예에서 각 조건이 왜 필요한지 확인합니다.

순서를 바꾸려면 질량이 새지 않아야 합니다. 위로 받쳐주는 함수가 있으면 안전합니다. 조건이 없으면 넓이가 극한에서 사라질 수 있습니다.

예를 들면, 💧 물을 컵에서 컵으로 옮길 때 새는 물이 없으면 전체 양이 그대로예요. 한 방울이 옆으로 튀면 옮긴 뒤의 양은 줄어들어요.`,
        en: String.raw`Three theorems license swapping limits and integrals. Examples with escaping mass show why each hypothesis is needed.

Swapping the order requires that no mass leaks away. A dominating function overhead keeps things safe. Without conditions, area can vanish in the limit.

For example, pour 💧 water from cup to cup with no spill and the total stays the same. One drop escaping sideways shrinks the total that arrives.`,
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
      order: 21,
      summary: {
        ko: String.raw`이중적분에서 적분 순서를 바꿔도 같은 값이 나옵니다. 행부터 더하나 열부터 더하나 같습니다.

음이 아닌 함수에서는 항상 안전합니다. 적분 가능한 함수에서도 안전합니다. 적분 가능성이 없으면 두 순서가 갈라질 수 있습니다.

예를 들면, 📦 상자에 격자로 담긴 🍎 사과를 셀 때 가로줄로 세나 세로줄로 세나 개수는 똑같은 것과 같아요.`,
        en: String.raw`Iterated integrals agree in either order. Sum the rows first or the columns first, the total is the same.

For nonnegative functions this is always safe. For integrable functions it is safe too. Without integrability, the two orders can split apart.

For example, count 🍎 apples packed in a grid inside a 📦 box: counting by rows or by columns gives the same total.`,
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
      id: 'convolution',
      title: { ko: '합성곱', en: 'Convolution' },
      order: 22,
      summary: {
        ko: String.raw`한 함수를 뒤집어 밀면서 다른 함수와 겹치는 양을 재는 연산입니다. 지시함수 두 개를 겹치면 겹침의 길이가 텐트 모양 곡선이 됩니다.

매끄러운 핵과 합성곱하면 계단처럼 각진 함수도 부드러워집니다. 핵이 좁아질수록 부드러워진 함수는 원래 함수에 가까워집니다.

예를 들면, 📷 사진의 한 픽셀을 주변 픽셀들의 가중 평균으로 바꾸는 흐림 효과와 같아요. 가운데 픽셀에 가장 큰 가중치를 주는 거예요.`,
        en: String.raw`Flip one function, slide it, and measure how it overlaps the other. Overlapping two indicator blocks gives an overlap length that traces a tent curve.

Convolving with a smooth kernel softens even a sharp step function. The narrower the kernel, the closer the softened function sits to the original.

For example, it is the blur effect in a 📷 photo, replacing each pixel by a weighted average of its neighbors. The center pixel gets the largest weight.`,
      },
      tex: [
        String.raw`(f * g)(x) = \int_{-\infty}^{\infty} f(t)\, g(x - t)\, dt`,
        String.raw`(f * \varphi_{\varepsilon})(x) \to f(x) \text{ as } \varepsilon \to 0^+ \text{ at continuity points } x`,
      ],
      prerequisites: ['fubini-tonelli', 'lebesgue'],
      controls: [
        { kind: 'select', key: 'mode', label: { ko: '모드', en: 'Mode' }, options: ['tent', 'smooth'], init: 'tent' },
        { kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: -0.5, max: 2.5, step: 0.01, init: 0.7 },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.05, max: 1, step: 0.05, init: 0.3 },
      ],
      problems: convolutionProblems,
    },
    {
      id: 'egorov',
      title: { ko: '에고로프 정리', en: "Egorov's Theorem" },
      order: 23,
      summary: {
        ko: String.raw`유한한 구간에서 점별 수렴은 거의 균등수렴입니다. 나쁜 집합을 작게 누르면 나머지는 고르게 수렴합니다.

수렴이 느린 지점은 작은 집합에 몰려 있습니다. 그 집합을 떼어내면 나머지는 한 속도로 수렴합니다. 전체 구간이 유한해야 이 정리가 성립합니다.

예를 들면, 🧑 친구 30명이 결승선에 거의 다 왔는데 한두 명이 느려도, 그 친구들을 빼면 나머지는 비슷한 속도로 들어오는 것과 같아요.`,
        en: String.raw`On a finite-measure set, pointwise convergence is almost uniform. Squeeze the bad set small and the rest converges uniformly.

The slow points hide inside one small set. Remove that set and the rest converges at one pace. The whole space must have finite measure.

For example, of 30 🧑 friends racing to a finish line, one or two may lag; set them aside and the rest arrive at nearly the same pace.`,
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
      order: 24,
      summary: {
        ko: String.raw`구간들의 총 길이가 0으로 가면 함수값 변화의 합도 0으로 가는 성질입니다. 칸토어 함수는 이 성질이 없는 연속함수입니다.

작은 입력 변화가 큰 출력을 만들 수 없어야 합니다. 이런 함수는 정확히 적분으로 만들어지는 함수입니다. 칸토어 함수는 평평한데도 0에서 1로 올라가 규칙을 깹니다.

예를 들면, 수도꼭지를 조금만 열면 💧 물도 조금만 나오는 것과 같아요. 칸토어 함수는 꼭지를 거의 안 열었는데 물이 한 바가지 나오는 이상한 수도예요.`,
        en: String.raw`Shrink the total length of intervals to zero and the total change shrinks too. The Cantor function is a continuous function failing this.

Tiny input changes must not create large outputs. Such functions are exactly the ones built as integrals. The Cantor function stays flat yet climbs from 0 to 1, breaking the rule.

For example, open a tap a little and only a little 💧 water comes out. The Cantor function is a strange tap that pours a bucketful while barely opened.`,
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
    {
      id: 'differentiation-under-integral',
      title: { ko: '적분기호 아래에서의 미분', en: 'Differentiation Under the Integral Sign' },
      order: 25,
      summary: {
        ko: String.raw`적분기호 안에서 미분한 값이 곡선의 접선 기울기와 일치하는지 수치로 확인합니다. 곡선 위의 점과 접선을 직접 움직여 봅니다.

전체를 미분하나 안에서 미분하나 결과는 같습니다. 각 지점의 변화가 전체의 변화로 쌓이기 때문입니다. 지배 조건이 이 교환을 안전하게 만듭니다.

예를 들면, 🌡️ 온도계로 방의 평균 온도가 오르는 속도를 잴 때, 각 지점이 데워지는 속도를 평균 내도 같은 답이 나오는 것과 같아요.`,
        en: String.raw`Numerics confirm that differentiating inside the integral matches the tangent slope. Drag the point and its tangent along the curve.

Differentiating the whole or the inside gives the same answer. Each point's change accumulates into the total change. A domination condition makes the swap safe.

For example, measure how fast a room's average 🌡️ thermometer reading rises: averaging how fast each spot warms up gives the same answer.`,
      },
      tex: [
        String.raw`\frac{d}{dx}\int_0^1 t^x\,dt = \int_0^1 t^x \ln t\,dt = -\frac{1}{(x+1)^2}`,
      ],
      prerequisites: ['improper'],
      controls: [
        { kind: 'slider', key: 'x', label: { ko: 'x (지수)', en: 'x (exponent)' }, min: 0.2, max: 4, step: 0.05, init: 1 },
        { kind: 'slider', key: 'n', label: { ko: 'n (심슨 구간 수)', en: 'n (Simpson panels)' }, min: 8, max: 2000, step: 2, init: 200 },
      ],
      problems: differentiationUnderIntegralProblems,
    },
    {
      id: 'minkowski',
      title: { ko: '민코프스키 부등식', en: "Minkowski's Inequality" },
      order: 26,
      summary: {
        ko: String.raw`두 함수의 합의 크기가 각 크기의 합을 넘지 않는다는 부등식입니다. 지수 p를 움직이면 두 막대 사이 틈새가 벌어졌다 좁아집니다.

이것은 삼각부등식을 함수로 옮긴 것입니다. 곧장 가는 길이 두 구간을 이어 가는 길보다 길 수 없습니다. p가 1이면 틈새가 완전히 닫힙니다.

예를 들면, 🚗 자동차가 두 번 꺾어 달린 거리는 한 번에 직선으로 잰 거리보다 짧을 수 없어요. 합친 움직임의 크기는 각 움직임 크기의 합을 넘지 않아요.`,
        en: String.raw`The size of a sum of two functions never exceeds the sum of their sizes. Slide the exponent p and the gap between the bars opens and closes.

This is the triangle inequality moved to functions. A straight route is never longer than two joined legs. At exponent 1 the gap closes completely.

For example, a 🚗 car that drives two legs in an L shape travels at least the straight-line distance, never more than the two legs added together.`,
      },
      tex: [
        String.raw`\|f+g\|_p \le \|f\|_p + \|g\|_p \quad (1 \le p < \infty)`,
        String.raw`\|f\|_p = \left(\int_0^1 |f|^p\right)^{1/p}`,
      ],
      prerequisites: ['improper'],
      controls: [
        { kind: 'slider', key: 'p', label: { ko: '지수 p', en: 'Exponent p' }, min: 1, max: 4, step: 0.05, init: 2 },
        { kind: 'slider', key: 'a', label: { ko: '지수 a (f(t) = t^a)', en: 'Exponent a' }, min: 0, max: 3, step: 0.1, init: 1 },
        { kind: 'slider', key: 'b', label: { ko: '지수 b (g(t) = (1-t)^b)', en: 'Exponent b' }, min: 0, max: 3, step: 0.1, init: 1 },
      ],
      problems: minkowskiProblems,
    },
  ],
};
