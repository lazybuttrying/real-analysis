import type { ChapterMeta } from '../../contracts.ts';
import { problems as banachProblems } from '../calculus/problems/banach';
import { problems as cauchyMvtProblems } from '../calculus/problems/cauchy-mvt';
import { derivativeMonotonicityProblems } from '../calculus/problems/derivative-monotonicity';
import { inverseFunctionTheoremProblems } from '../calculus/problems/inverse-function-theorem';
import { problems as convexProblems } from '../calculus/problems/convex';
import { problems as darbouxProblems } from '../calculus/problems/darboux';
import { problems as diffcontProblems } from '../calculus/problems/diffcont';
import { problems as discontinuousDerivativeProblems } from '../calculus/problems/discontinuous-derivative';
import { problems as lhopitalProblems } from '../calculus/problems/lhopital';
import { problems as mvtProblems } from '../calculus/problems/mvt';
import { problems as newtonProblems } from '../calculus/problems/newton';
import { problems as taylorProblems } from '../calculus/problems/taylor';
import { problems as taylorThmProblems } from '../calculus/problems/taylor-thm';
import { problems as weierstrassFunctionProblems } from '../calculus/problems/weierstrass-function';

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
export const differentiation: ChapterMeta = {
  id: 'differentiation',
  title: { ko: '미분', en: 'Differentiation' },
  summary: {
    ko: '미분의 정의에서 평균값 정리·로피탈 정리·테일러 전개까지, 미분학의 핵심을 다룹니다.',
    en: 'From the definition of the derivative through the mean value theorem, l\'Hôpital, and Taylor expansions.',
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
      id: 'discontinuous-derivative',
      title: { ko: '불연속인 도함수', en: 'A Discontinuous Derivative' },
      order: 2,
      summary: {
        ko: String.raw`\(f(x) = x^2\sin(1/x)\) (\(f(0) = 0\))는 모든 점에서 미분가능하고 \(f'(0) = 0\)이지만, 도함수 \(f'(x) = 2x\sin(1/x) - \cos(1/x)\)는 \(0\)에서 진동하며 불연속입니다. 미분가능 ⟹ 도함수 연속은 거짓 — 그래도 도함수는 중간값 성질(Darboux)을 지킵니다.`,
        en: String.raw`\(f(x) = x^2\sin(1/x)\) (\(f(0) = 0\)) is differentiable everywhere with \(f'(0) = 0\), yet the derivative \(f'(x) = 2x\sin(1/x) - \cos(1/x)\) oscillates and is discontinuous at \(0\). Differentiable does not imply continuously differentiable — though derivatives still keep the intermediate value property (Darboux).`,
      },
      tex: [
        String.raw`f'(0) = \lim_{h \to 0} h\sin(1/h) = 0`,
        String.raw`f'(x) = 2x\sin(1/x) - \cos(1/x) \quad (x \neq 0), \qquad f'\!\left(\tfrac{1}{2\pi n}\right) = -1`,
      ],
      prerequisites: ['diffcont'],
      controls: [
        { kind: 'slider', key: 'logR', label: { ko: '관찰 범위 (log₁₀)', en: 'View range (log₁₀)' }, min: -3, max: 0, step: 0.1, init: -1 },
        { kind: 'slider', key: 'logH', label: { ko: 'h (log₁₀)', en: 'h (log₁₀)' }, min: -4, max: 1, step: 0.1, init: -1 },
      ],
      problems: discontinuousDerivativeProblems,
    },
    {
      id: 'mvt',
      title: { ko: '평균값 정리', en: 'The Secant Meets Its Parallel Tangent' },
      order: 3,
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
      id: 'derivative-monotonicity',
      title: { ko: '도함수 부호와 단조성', en: 'Derivative Sign and Monotonicity' },
      order: 4,
      summary: {
        ko: String.raw`\(f'\)의 부호가 곡선의 오르내림을 결정합니다: \(f' > 0\)인 구간(초록 배경)에서는 올라가고, \(f' < 0\)인 구간(빨강 배경)에서는 내려갑니다. 점 \(x_0\)을 드래그해 접선 색이 부호를 따라가는 것을 보세요 — 평균값 정리의 한 걸음 뒤입니다.`,
        en: String.raw`The sign of \(f'\) decides where the curve rises and falls: up on the green background (\(f' > 0\)), down on the red one (\(f' < 0\)). Drag \(x_0\) and watch the tangent's color track the sign — one step behind the Mean Value Theorem.`,
      },
      tex: [
        String.raw`f' \ge 0 \Rightarrow f \text{ increasing}`,
        String.raw`f'(x_0) = \lim_{h\to 0}\frac{f(x_0+h)-f(x_0)}{h}`,
      ],
      prerequisites: ['mvt'],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['cubic', 'sine', 'exp'],
          init: 'cubic',
        },
        { kind: 'slider', key: 'x', label: { ko: 'x 위치', en: 'x position' }, min: 0, max: 100, step: 1, init: 0 },
      ],
      problems: derivativeMonotonicityProblems,
    },
    {
      id: 'inverse-function-theorem',
      title: { ko: '역함수 정리', en: 'The Inverse Function Theorem' },
      order: 5,
      summary: {
        ko: String.raw`\(f'(a) \ne 0\)이면 \(f\)는 \(a\) 근처에서 뒤집을 수 있고, 뒤집힌 함수의 기울기는 역수입니다 — 두 접선의 기울기를 곱하면 정확히 \(1\).`,
        en: String.raw`If \(f'(a) \ne 0\), \(f\) can be flipped near \(a\), and the flipped function's slope is the reciprocal — the two tangent slopes multiply to exactly \(1\).`,
      },
      tex: [
        String.raw`(f^{-1})'(f(a)) = \frac{1}{f'(a)}`,
        String.raw`f(x) = x^3+x,\ f'(1) = 4,\ (f^{-1})'(2) = \frac{1}{4}`,
      ],
      prerequisites: ['mvt'],
      controls: [
        {
          kind: 'select',
          key: 'fn',
          label: { ko: '함수', en: 'Function' },
          options: ['x^3+x', 'e^x'],
          init: 'x^3+x',
        },
        { kind: 'slider', key: 'a', label: { ko: '점 a', en: 'Point a' }, min: -1, max: 2, step: 0.1, init: 1 },
      ],
      problems: inverseFunctionTheoremProblems,
    },
    {
      id: 'cauchy-mvt',
      title: { ko: '코시 평균값 정리', en: "Cauchy's Mean Value Theorem" },
      order: 6,
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
      order: 7,
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
      order: 8,
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
      order: 9,
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
      order: 10,
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
      order: 11,
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
      order: 12,
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
  ],
};
