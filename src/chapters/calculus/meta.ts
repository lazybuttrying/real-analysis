import type { ChapterMeta } from '../../contracts.ts';
import { absoluteContinuityProblems } from './problems/absolute-continuity';
import { problems as banachProblems } from './problems/banach';
import { boundedVariationProblems } from './problems/bounded-variation';
import { problems as cauchyMvtProblems } from './problems/cauchy-mvt';
import { problems as convexProblems } from './problems/convex';
import { problems as darbouxProblems } from './problems/darboux';
import { problems as diffcontProblems } from './problems/diffcont';
import { problems as fourierProblems } from './problems/fourier';
import { problems as weierstrassFunctionProblems } from './problems/weierstrass-function';
import { problems as ftcProblems } from './problems/ftc';
import { problems as lhopitalProblems } from './problems/lhopital';
import { problems as lebesgueProblems } from './problems/lebesgue';
import { problems as measureProblems } from './problems/measure';
import { problems as mvtProblems } from './problems/mvt';
import { problems as newtonProblems } from './problems/newton';
import { problems as riemannProblems } from './problems/riemann';
import { problems as taylorProblems } from './problems/taylor';
import { problems as taylorThmProblems } from './problems/taylor-thm';

/**
 * Pure data. Imports types plus the chapter's per-scene problems data modules
 * (./problems/* — data only, no code, models, views, or shell).
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
problems: diffcontProblems,
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
problems: mvtProblems,
    },
    {
      id: 'cauchy-mvt',
      title: { ko: '코시 평균값 정리', en: "Cauchy's Mean Value Theorem" },
      order: 3,
      summary: {
        ko: String.raw`매개곡선 \((g(t), f(t))\) 위에 할선과 평행한 접선이 존재합니다. \(f(t) = t^2\), \(g(t) = t^3\)인 경우 그 점은 \(\xi = 14/9\)입니다.`,
        en: String.raw`On the parametric curve \((g(t), f(t))\) a tangent parallel to the chord exists. For \(f(t) = t^2\), \(g(t) = t^3\) it sits at \(\xi = 14/9\).`,
      },
      tex: [
        String.raw`\frac{f'(\xi)}{g'(\xi)} = \frac{f(b)-f(a)}{g(b)-g(a)}`,
        String.raw`\xi = \frac{14}{9} \approx 1.556`,
      ],
      prerequisites: ['mvt'],
      controls: [
        { kind: 'slider', key: 'xi', label: { ko: 'ξ 위치', en: 'ξ position' }, min: 1, max: 2, step: 0.01, init: 1.56 },
      ],
problems: cauchyMvtProblems,
    },
    {
      id: 'lhopital',
      title: { ko: '로피탈 정리', en: "L'H\u00f4pital's Rule" },
      order: 4,
      summary: {
        ko: String.raw`\(0/0\)이나 \(\infty/\infty\) 꼴에서는 분자와 분모를 각각 미분해도 극한이 같습니다. \(x\)를 한계점으로 보내며 \(\frac{f(x)}{g(x)}\)가 \(\frac{f'(x)}{g'(x)}\)를 따라가는 것을 보세요.`,
        en: String.raw`In a \(0/0\) or \(\infty/\infty\) form, differentiating the numerator and the denominator keeps the limit. Drive \(x\) toward the limit point and watch \(\frac{f(x)}{g(x)}\) track \(\frac{f'(x)}{g'(x)}\).`,
      },
      tex: [
        String.raw`\lim_{x \to a}\frac{f(x)}{g(x)} = \lim_{x \to a}\frac{f'(x)}{g'(x)}`,
        String.raw`\lim_{x \to 0}\frac{\sin x}{x} = \lim_{x \to 0}\cos x = 1, \qquad \lim_{x \to \infty}\frac{\ln x}{x} = \lim_{x \to \infty}\frac{1}{x} = 0`,
      ],
      prerequisites: ['cauchy-mvt'],
      controls: [
        { kind: 'select', key: 'pair', label: { ko: '함수 쌍', en: 'Function pair' }, options: ['sin x / x', 'ln x / x'], init: 'sin x / x' },
        { kind: 'slider', key: 'pos', label: { ko: 'x 위치 (오른쪽 → 한계점)', en: 'x position (right → limit point)' }, min: 0, max: 100, step: 1, init: 55 },
      ],
      problems: lhopitalProblems,
    },
    {
      id: 'darboux',
      title: { ko: '다르부 정리', en: "Darboux's Theorem" },
      order: 5,
      summary: {
        ko: String.raw`도함수는 불연속이어도 중간값 성질을 갖습니다 — \(f(x) = x^2\sin(1/x)\)의 \(f'(x) = 2x\sin(1/x) - \cos(1/x)\)는 0 근처에서 격렬히 진동하면서도 모든 높이를 밟습니다. 점프 불연속은 도함수에서 불가능합니다.`,
        en: String.raw`Derivatives have the intermediate value property even when discontinuous — \(f'(x) = 2x\sin(1/x) - \cos(1/x)\) oscillates wildly near 0 yet steps on every level. Jump discontinuities are impossible in a derivative.`,
      },
      tex: [
        String.raw`f'(x) = 2x\sin(1/x) - \cos(1/x),\ f'(0) = 0`,
        String.raw`f'(a) < c < f'(b) \Rightarrow \exists\, \xi \in (a,b):\ f'(\xi) = c`,
      ],
      prerequisites: ['mvt', 'lhopital'],
      controls: [
        { kind: 'slider', key: 'zoom', label: { ko: '0 근처 확대', en: 'Zoom at 0' }, min: 0, max: 100, step: 1, init: 40 },
        { kind: 'slider', key: 'level', label: { ko: '테스트 높이 y = c', en: 'Test level y = c' }, min: -1.2, max: 1.2, step: 0.05, init: 0.4 },
        { kind: 'toggle', key: 'showF', label: { ko: 'f(x) 표시', en: 'Show f(x)' }, init: true },
      ],
      problems: darbouxProblems,
    },
    {
      id: 'weierstrass-function',
      title: { ko: '바이어슈트라스 함수', en: 'The Weierstrass Function' },
      order: 6,
      summary: {
        ko: String.raw`\(W(x) = \sum_{n=0}^{\infty} a^n\cos(b^n\pi x)\) — 모든 점에서 연속이지만 어느 점에서도 미분 불가능합니다. M-판정법 장면이 연속성의 엔진이고, 부분합이 늘어날수록 그래프는 가시처럼 뾰족해집니다. 미분 불가능성의 완전한 증명은 아이디어 수준에서만 다룹니다.`,
        en: String.raw`\(W(x) = \sum_{n=0}^{\infty} a^n\cos(b^n\pi x)\) — continuous everywhere yet differentiable nowhere. The M-test scene powers the continuity argument, and the graph turns thornier as partial sums grow. The full nowhere-differentiability proof is idea-level only.`,
      },
      tex: [
        String.raw`W(x) = \sum_{n=0}^{\infty} a^n\cos(b^n\pi x),\quad 0 < a < 1 < b,\ ab > 1 + \frac{3\pi}{2}`,
        String.raw`|a^n\cos(b^n\pi x)| \le a^n,\quad \sum a^n < \infty\ \Rightarrow\ W \text{ continuous}`,
      ],
      prerequisites: ['darboux'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '부분합 항 수 N', en: 'Partial-sum terms N' }, min: 0, max: 8, step: 1, init: 4 },
      ],
      problems: weierstrassFunctionProblems,
    },
    {
      id: 'taylor',
      title: { ko: '테일러 근사', en: 'Polynomials Hugging the Curve' },
      order: 7,
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
problems: taylorProblems,
    },
    {
      id: 'taylor-thm',
      title: { ko: '테일러 정리: 나머지 상한', en: "Taylor's Theorem: The Remainder Envelope" },
      order: 8,
      summary: {
        ko: String.raw`오차 \(R_n(x)\)는 띠 \(T_n(x) \pm |x|^{n+1}/(n+1)!\) 안에 갇힙니다. \(n\)을 키우면 띠가 0으로 쪼그라듭니다.`,
        en: String.raw`The error \(R_n(x)\) is trapped in the band \(T_n(x) \pm |x|^{n+1}/(n+1)!\). Raise \(n\) and the band shrinks to zero.`,
      },
      tex: [String.raw`f(x) = T_n(x) + R_n(x), \quad |R_n(x)| \le \frac{|x|^{n+1}}{(n+1)!}`],
      prerequisites: ['taylor'],
      controls: [
        { kind: 'slider', key: 'degree', label: { ko: '차수 n', en: 'Degree n' }, min: 0, max: 9, step: 1, init: 5 },
      ],
problems: taylorThmProblems,
    },
    {
      id: 'convex',
      title: { ko: '볼록함수', en: 'Convex Functions' },
      order: 9,
      summary: {
        ko: String.raw`현이 그래프 위에 뜨면 볼록 — 미분 가능할 때는 \(f'\) 증가와 동치이고, 이계도함수 부호로 판정합니다. 옌센 부등식까지.`,
        en: String.raw`Convex when the chord floats above the graph — for differentiable \(f\) this is the same as \(f'\) increasing, and the second derivative decides it. Up to Jensen's inequality.`,
      },
      tex: [
        String.raw`f(tx+(1-t)y) \le tf(x)+(1-t)f(y)`,
        String.raw`f \text{ convex } \iff f' \text{ increasing}, \quad f'' \ge 0 \implies \text{convex}`,
      ],
      prerequisites: ['taylor-thm'],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수 f', en: 'Function f' }, options: ['square', 'exp', 'abs'], init: 'square' },
        { kind: 'slider', key: 'a', label: { ko: 'a', en: 'a' }, min: -2, max: 2, step: 0.1, init: -1 },
        { kind: 'slider', key: 'b', label: { ko: 'b', en: 'b' }, min: -2, max: 2, step: 0.1, init: 1 },
      ],
problems: convexProblems,
    },
    {
      id: 'riemann',
      title: { ko: '리만합 스퀴즈', en: 'Upper and Lower Sums Close In' },
      order: 10,
      summary: {
        ko: String.raw`\(f(x) = x^2\) 아래에 직사각형을 채워봅니다. 아래합과 위합이 \(\frac{1}{3}\)을 양쪽에서 조여옵니다.`,
        en: String.raw`Fill rectangles under \(f(x) = x^2\). The lower and upper sums squeeze \(\frac{1}{3}\) from both sides.`,
      },
      tex: [String.raw`L(f,P) \le \int_a^b f \le U(f,P)`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 수 n', en: 'Subdivisions n' }, min: 1, max: 48, step: 1, init: 12 }],
problems: riemannProblems,
    },
    {
      id: 'ftc',
      title: { ko: '미적분 기본정리', en: "The Area Function's Derivative Is the Function" },
      order: 11,
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
      id: 'newton',
      title: { ko: '뉴턴법', en: 'Riding Tangents to the Root' },
      order: 13,
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
problems: newtonProblems,
    },
    {
      id: 'banach',
      title: { ko: '바나흐 고정점', en: 'The Contraction Cobweb' },
      order: 14,
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
problems: banachProblems,
    },
    {
      id: 'fourier',
      title: { ko: '푸리에 정사각파', en: 'The Ringing That Never Dies' },
      order: 15,
      summary: {
        ko: String.raw`정사각파에 사인파를 겹쳐봅니다. 점프점 옆의 울림은 \(N\)을 키워도 사라지지 않습니다.`,
        en: String.raw`Layer sine waves onto a square wave. The ringing beside each jump never dies out, no matter how large \(N\) gets.`,
      },
      tex: [String.raw`S_N(x) = \frac{4}{\pi}\sum_{k=1}^{N} \frac{\sin((2k-1)x)}{2k-1}`],
      controls: [{ kind: 'slider', key: 'N', label: { ko: '항의 수 N', en: 'Terms N' }, min: 1, max: 50, step: 1, init: 8 }],
problems: fourierProblems,
    },
    {
      id: 'measure',
      title: { ko: '르베그 측도', en: 'Lebesgue Measure' },
      order: 16,
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
      order: 17,
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
      order: 18,
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
