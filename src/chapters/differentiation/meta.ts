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
        ko: String.raw`미분가능하면 연속이지만, 그 반대는 참이 아닙니다. 뾰족한 모서리를 확대해 그 이유를 봅니다.

연속은 그래프가 끊기지 않는다는 뜻입니다. 미분가능은 한 걸음 더 나아갑니다. 접선의 기울기가 하나의 값으로 정해져야 합니다. 꺾인 모서리에서는 기울기가 둘로 갈립니다.

예를 들면, 🚗 자동차가 완만한 언덕을 오르면 어느 순간에도 속도를 잴 수 있어요. 그런데 길이 톱니처럼 뾰족하게 꺾이면, 꺾인 점에서는 속도가 하나로 정해지지 않아요.`,
        en: String.raw`Differentiable implies continuous, but not the other way around. This scene zooms into the corner that shows why.

Continuous only means the graph has no breaks. Differentiable asks for more. The tangent slope must settle to a single value. At a sharp corner the slope splits into two.

For example, a 🚗 car climbing a smooth hill has a speed at every moment. But on a path with a sharp zigzag corner, the speed at the corner is not one single value.`,
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
        ko: String.raw`모든 점에서 미분가능한데 도함수만 불연속인 함수입니다. 원점 근처를 확대해 도함수의 진동을 봅니다.

함수 자체는 원점에서 매끄럽게 가라앉습니다. 그런데 기울기는 진동이 멈추지 않습니다. 미분가능해도 도함수가 연속일 필요는 없습니다. 그래도 도함수는 중간값을 건너뛰지 않습니다.

예를 들면, ⚽ 공이 바닥에 닿을 때마다 점점 작게, 점점 빠르게 튀는 모습과 같아요. 공의 높이는 차분히 0으로 가라앉아요. 하지만 튀는 속도는 마지막까지 이리저리 흔들려요.`,
        en: String.raw`A function differentiable everywhere whose derivative alone is discontinuous. Zoom near the origin to watch the derivative oscillate.

The function itself settles smoothly at the origin. Its slope, though, never stops oscillating. Differentiable does not force the derivative to be continuous. Still, the derivative never skips an intermediate value.

For example, picture a ⚽ ball bouncing lower and faster each time it hits the floor. Its height calmly sinks to zero. Its bounce speed, though, keeps flickering to the very end.`,
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
        ko: String.raw`곡선 위에는 할선과 평행한 접선이 반드시 있습니다. 그 접점을 직접 찾아보는 씬입니다.

양 끝을 잇는 직선의 기울기가 평균 기울기입니다. 어느 중간 지점에서는 순간 기울기가 그 평균과 같아집니다. 평균값 정리가 보장하는 사실입니다.

예를 들면, 🚗 자동차로 100km를 한 시간에 달렸다면 평균 속도는 시속 100km예요. 그 한 시간 중 어느 한 순간, 속도계는 정확히 100을 가리켰을 거예요.`,
        en: String.raw`Somewhere on the curve sits a tangent parallel to the secant. This scene lets you hunt for that point.

The secant's slope is the average rate of change. At some interior point the instantaneous slope matches it exactly. That is what the mean value theorem guarantees.

For example, a 🚗 car covering 100 km in one hour averages 100 km/h. At some moment in that hour, the speedometer read exactly 100.`,
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
        ko: String.raw`도함수의 부호가 곡선의 오르내림을 결정합니다. 점을 드래그해 접선 색이 부호를 따라가는 것을 봅니다.

기울기가 양수인 곳에서는 곡선이 올라갑니다. 음수인 곳에서는 내려갑니다. 그래서 부호만 읽으면 단조 구간을 알 수 있습니다. 평균값 정리가 이 연결을 증명합니다.

예를 들면, 🪜 계단을 오르는 동안에는 높이가 계속 늘어요. 내려가는 동안에는 높이가 계속 줄어요. 기울어진 방향만 봐도 오를지 내릴지 알 수 있어요.`,
        en: String.raw`The sign of the derivative decides where the curve rises and falls. Drag the point and watch the tangent's color track the sign.

Where the slope is positive, the curve climbs. Where it is negative, the curve drops. Reading the sign alone reveals the monotone stretches. The mean value theorem proves this link.

For example, while you climb a 🪜 staircase your height keeps growing. While you go down, it keeps shrinking. The tilt alone tells you whether you rise or fall.`,
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
        ko: String.raw`기울기가 0이 아닌 점 근처에서는 함수를 뒤집을 수 있습니다. 뒤집힌 함수의 기울기는 원래 기울기의 역수입니다.

뒤집기는 가로와 세로를 맞바꾸는 일입니다. 그래서 오름폭과 나아감의 비율이 뒤집힙니다. 두 접선의 기울기를 곱하면 정확히 1이 됩니다.

예를 들면, 🏪 가게에서 🍬 사탕 1개가 💰 돈 4개와 같다면, 거꾸로 돈 1개는 사탕 4분의 1개예요. 비율을 뒤집으면 기울기도 역수가 돼요.`,
        en: String.raw`Near a point with nonzero slope, a function can be flipped. The flipped function's slope is the reciprocal of the original.

Flipping swaps horizontal and vertical. So the ratio of rise to run turns upside down. Multiply the two tangent slopes and you get exactly 1.

For example, imagine 💰 money and 🍬 candies traded at a 🏪 shop: 4 money for 1 candy. Traded back, 1 money buys a quarter of a candy — the rate flips into its reciprocal.`,
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
        ko: String.raw`두 함수가 함께 움직이는 매개곡선에도 평균값 정리가 있습니다. 할선과 평행한 접점이 곡선 위에 존재합니다.

한 양의 변화와 다른 양의 변화를 함께 봅니다. 전체 구간의 변화 비율과 같은 비율이 되는 순간이 있습니다. 로피탈 정리를 증명하는 다리입니다.

예를 들면, 🚗 자동차로 산길을 오르면 거리도 늘고 높이도 늘어요. 전체 구간에서 늘어난 높이와 거리의 비율과 똑같은 비율로 오르는 순간이 반드시 있어요.`,
        en: String.raw`The mean value theorem survives on parametric curves, where two functions move together. A tangent parallel to the chord always exists.

Track the change of one quantity against another. Somewhere, the instantaneous ratio equals the whole interval's ratio. This is the bridge that proves l'Hôpital's rule.

For example, a 🚗 car climbing a mountain road gains distance and height together. At some moment it climbs at exactly the trip's overall height-to-distance ratio.`,
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
        ko: String.raw`0 나누기 0처럼 답이 안 보이는 극한을 다루는 씬입니다. 분자와 분모를 각각 미분하면 극한이 드러납니다.

둘 다 0에 가까워지면 비율은 양으로 정해지지 않습니다. 누가 더 빨리 줄어드는지가 비율을 정합니다. 그래서 속도끼리 비교하면 답이 나옵니다.

예를 들면, 💧 물 두 웅덩이가 둘 다 말라가면 남은 양의 비율은 처음 양이 정하지 않아요. 누가 더 빨리 마르는지, 그 속도의 비율이 정해요.`,
        en: String.raw`This scene tackles limits that look like 0 divided by 0. Differentiate top and bottom separately and the limit appears.

When both sides shrink to zero, amounts stop deciding the ratio. What matters is which one shrinks faster. Comparing the two speeds gives the answer.

For example, when two puddles of 💧 water both dry up, their remaining ratio is not set by the starting amounts. It is set by the ratio of their drying speeds.`,
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
        ko: String.raw`도함수는 불연속이어도 중간값 성질을 지킵니다. 격렬히 진동하는 도함수가 모든 높이를 밟는 것을 봅니다.

도함수는 값을 건너뛰며 점프할 수 없습니다. 한 값에서 다른 값으로 가려면 중간을 전부 거쳐야 합니다. 불연속인 도함수에게도 이 규칙은 지켜집니다.

예를 들면, 🌡️ 온도계 눈금이 영하 1도에서 영상 1도로 바뀔 때 중간 온도를 전부 거치는 것과 같아요. 도함수도 중간 값을 건너뛰는 점프는 없어요.`,
        en: String.raw`A derivative keeps the intermediate value property even when discontinuous. Watch a wildly oscillating derivative step on every level.

A derivative cannot jump across values. To get from one value to another it must pass through everything between. Even a discontinuous derivative obeys this rule.

For example, a 🌡️ thermometer sliding from −1° to 1° passes through every temperature between. A derivative likewise never jumps over an intermediate value.`,
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
        ko: String.raw`모든 점에서 연속이지만 어느 점에서도 미분 불가능한 함수입니다. 부분합을 늘릴수록 그래프가 가시처럼 뾰족해집니다.

확대하면 매끄러워지는 보통 곡선과 다릅니다. 아무리 확대해도 새로운 톱니가 나타납니다. 그래서 어느 점에서도 접선이 정해지지 않습니다. 연속성의 증명은 균등수렴이 맡습니다.

예를 들면, 🌳 나무 가지를 확대하면 작은 가지가 보이고, 또 확대하면 더 작은 가지가 끝없이 나오는 것과 같아요. 어느 배율로 봐도 뾰족함이 사라지지 않아요.`,
        en: String.raw`A function continuous everywhere yet differentiable nowhere. Add partial sums and the graph grows thornier.

Ordinary curves flatten when you zoom in. This one grows fresh teeth at every magnification. So no point ever earns a tangent line. Uniform convergence powers the continuity half.

For example, zoom into a 🌳 tree branch and smaller twigs appear, then smaller still, forever. At no magnification does the jaggedness smooth away.`,
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
        ko: String.raw`곡선 위에 다항식을 겹쳐 보는 씬입니다. 차수를 올리면 다항식이 곡선에 달라붙습니다.

한 점에서 값과 기울기와 굽은 정도를 맞춥니다. 맞추는 정보가 많을수록 흉내가 정확해집니다. 멀리 가면 흉내는 결국 틀어집니다.

예를 들면, 🚗 자동차가 지금 어디 있고 얼마나 빠른지, 가속하는지까지 알면 조금 뒤 위치를 꽤 정확히 맞힐 수 있어요. 아는 정보가 많을수록 더 먼 위치까지 맞혀요.`,
        en: String.raw`This scene lays a polynomial over a curve. Raise the degree and it hugs the curve.

Match the value, the slope, and the bending at one point. The more you match, the better the imitation nearby. Far away, the imitation eventually breaks.

For example, knowing where a 🚗 car is, how fast it goes, and how it accelerates lets you predict its position a little later. More information predicts farther ahead.`,
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
        ko: String.raw`테일러 근사의 오차가 갇히는 띠를 보는 씬입니다. 차수를 키우면 띠가 0으로 쪼그라듭니다.

나머지 항에는 위쪽 한계가 있습니다. 그래서 오차가 최대 얼마인지 미리 보장할 수 있습니다. 띠 안에 진짜 곡선이 항상 들어 있습니다.

예를 들면, 📏 자로 길이를 재면 오차가 최대 1mm라고 보장할 수 있어요. 테일러 나머지도 마찬가지예요. 차수를 올리면 보장되는 오차 범위가 좁아져요.`,
        en: String.raw`This scene shows the band that traps the Taylor error. Raise the degree and the band shrinks to zero.

The remainder has a ceiling. So you can promise in advance how large the error can get. The true curve always stays inside the band.

For example, measuring with a 📏 ruler promises an error of at most a millimeter. The Taylor remainder makes the same kind of promise. Higher degree narrows the promised range.`,
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
        ko: String.raw`두 점을 잇는 현이 그래프 위에 뜨는 함수를 봅니다. 볼록함과 도함수의 증가가 같은 말임을 확인합니다.

그릇처럼 아래로 볼록한 모양이 핵심입니다. 기울기가 계속 커지는 곡선이 바로 볼록합니다. 가운데 지점의 높이는 양 끝 높이의 평균을 넘지 않습니다.

예를 들면, 그릇 모양 곡선 위 두 점에 🧵 줄을 팽팽히 걸면 줄은 항상 곡선보다 위에 떠 있어요. 줄의 가운데가 곡선의 가운데보다 높은 거예요.`,
        en: String.raw`This scene studies functions whose chords float above the graph. Convexity turns out to be the derivative increasing.

Picture a bowl shape opening upward. A curve whose slope keeps growing is convex. The middle height never exceeds the average of the end heights.

For example, stretch a 🧵 string taut between two points on a bowl-shaped curve and it always floats above the curve. The string's middle sits higher than the curve's middle.`,
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
        ko: String.raw`접선을 타고 내려가 방정식의 근을 찾는 씬입니다. 반복할수록 맞는 자릿수가 두 배로 늘어납니다.

곡선에서 접선을 긋고 그 직선의 근을 다음 추측으로 삼습니다. 직선으로 곡선을 대신하는 단순한 아이디어입니다. 좋은 시작점에서는 놀랍게 빠르게 수렴합니다.

예를 들면, 🧑 친구가 숨긴 숫자를 맞힐 때 힌트로 다음 추측을 정하면, 맞는 자릿수가 매번 두 배씩 늘어요. 처음엔 어림없던 답이 몇 번 만에 정확해져요.`,
        en: String.raw`Ride tangent lines down to a root. Each iteration doubles the number of correct digits.

Draw the tangent and take its root as the next guess. A straight line stands in for the curve. From a good start, the guesses converge astonishingly fast.

For example, guessing a number a 🧑 friend hid, each hint doubles the correct digits of your next guess. A wild first guess turns exact within a few rounds.`,
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
        ko: String.raw`거미줄 그림이 한 점으로 빨려드는 씬입니다. 그 점이 바로 고정점입니다.

거리를 일정 비율로 줄이는 함수를 반복 적용합니다. 점들은 서로에게 점점 가까워집니다. 결국 갈 곳은 단 하나의 점뿐입니다.

예를 들면, 📦 상자 안에 더 작은 상자를 넣고 그 안에 또 작은 상자를 넣다 보면, 결국 한 점에 모이는 것과 같아요. 반복할수록 남는 자리가 좁아져요.`,
        en: String.raw`A cobweb spirals into a single point. That point is the fixed point.

Repeatedly apply a map that shrinks distances by a fixed ratio. The points crowd closer and closer together. In the end only one point can remain.

For example, nest a smaller 📦 box inside a box, then a smaller one inside that, and the boxes close in on a single point. Each step leaves less room than the last.`,
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
