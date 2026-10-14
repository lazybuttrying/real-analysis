import type { ChapterMeta } from '../../contracts.ts';
import { problems as banachProblems } from './problems/banach';
import { problems as cauchyMvtProblems } from './problems/cauchy-mvt';
import { problems as diffcontProblems } from './problems/diffcont';
import { problems as fourierProblems } from './problems/fourier';
import { problems as ftcProblems } from './problems/ftc';
import { problems as lebesgueProblems } from './problems/lebesgue';
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
      id: 'taylor',
      title: { ko: '테일러 근사', en: 'Polynomials Hugging the Curve' },
      order: 4,
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
      order: 5,
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
      id: 'newton',
      title: { ko: '뉴턴법', en: 'Riding Tangents to the Root' },
      order: 8,
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
      order: 9,
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
      order: 10,
      summary: {
        ko: String.raw`정사각파에 사인파를 겹쳐봅니다. 점프점 옆의 울림은 \(N\)을 키워도 사라지지 않습니다.`,
        en: String.raw`Layer sine waves onto a square wave. The ringing beside each jump never dies out, no matter how large \(N\) gets.`,
      },
      tex: [String.raw`S_N(x) = \frac{4}{\pi}\sum_{k=1}^{N} \frac{\sin((2k-1)x)}{2k-1}`],
      controls: [{ kind: 'slider', key: 'N', label: { ko: '항의 수 N', en: 'Terms N' }, min: 1, max: 50, step: 1, init: 8 }],
problems: fourierProblems,
    },
    {
      id: 'lebesgue',
      title: { ko: '디리클레 vs 르벡', en: 'Covering the Rationals with Nothing' },
      order: 11,
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
  ],
};
