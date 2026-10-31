import type { ChapterMeta } from '../../contracts.ts';
import { additiveFunctionsProblems } from '../limits/problems/additive-functions';
import { monotoneDiscontinuitiesProblems } from '../limits/problems/monotone-discontinuities';
import { problems as continuityProblems } from '../limits/problems/continuity';
import { problems as continuityEquivalencesProblems } from '../limits/problems/continuity-equivalences';
import { problems as epsdeltaProblems } from '../limits/problems/epsdelta';
import { problems as evtProblems } from '../limits/problems/evt';
import { problems as ivtProblems } from '../limits/problems/ivt';
import { problems as thomaeProblems } from '../limits/problems/thomae';
import { problems as uniformContinuityProblems } from '../limits/problems/uniform-continuity';
import { problems as uniformProblems } from '../limits/problems/uniform';

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
export const continuity: ChapterMeta = {
  id: 'continuity',
  title: { ko: '연속함수', en: 'Continuity' },
  summary: {
    ko: 'ε-δ로 연속성을 정의하고, 균등연속·중간값 정리·최대최소 정리까지 연속함수의 성질을 탐구합니다.',
    en: 'Continuity via ε-δ, uniform continuity, and the great theorems: the intermediate and extreme value theorems.',
  },
  sections: [
    { id: 'continuity-basics', title: { ko: '연속의 얼굴들', en: 'The Faces of Continuity' }, sceneIds: ['epsdelta', 'continuity', 'thomae', 'continuity-equivalences', 'monotone-discontinuities'] },
    { id: 'continuity-theorems', title: { ko: '연속함수의 큰 정리', en: 'The Big Theorems of Continuous Functions' }, sceneIds: ['uniform-continuity', 'ivt', 'evt', 'additive-functions', 'uniform'] },
  ],
  scenes: [
    {
      id: 'epsdelta',
      title: { ko: 'ε-δ 정의', en: 'The ε–δ Definition' },
      order: 1,
      summary: {
        ko: String.raw`극한의 엄밀한 정의를 눈으로 확인하는 씬입니다. ε 띠와 δ 띠를 겹쳐 놓고, 약속이 정말 지켜지는지 격자로 검사합니다.

핵심은 순서입니다. 먼저 상대가 오차 범위를 정합니다. 그다음 그에 맞는 입력 범위를 찾아야 합니다. 입력이 그 범위 안에 있으면, 출력은 오차 범위 안에 머뭅니다. 아래 식이 그 약속입니다. 여기 직선에서는 입력 범위를 오차 범위의 절반으로 잡으면 됩니다.

예를 들면, ⚽ 공을 📦 상자에 던져 넣는 놀이를 해보세요. 친구가 상자를 점점 작은 것으로 바꿔도 됩니다. 충분히 가까이 서면 매번 넣을 수 있습니다. 상자가 작을수록, 서는 자리는 더 가까워야 합니다.`,
        en: String.raw`This scene makes the limit definition visible. It stacks an ε-band over a δ-band and grid-checks that the promise really holds.

The order is the point. First, someone else picks the allowed error. Then you must find a matching input window. If the input stays in that window, the output stays in the error band. The formula below states the promise. For the line here, a window of half the error is enough.

For example, play at throwing a ⚽ ball into a 📦 box. Your friend may swap in a smaller and smaller box. Standing close enough, you can still make every throw. The smaller the box, the closer you must stand.`,
      },
      tex: [
        String.raw`\forall\varepsilon > 0\ \exists\delta > 0:\ 0 < \lvert x - a\rvert < \delta \Rightarrow \lvert f(x) - L\rvert < \varepsilon`,
        String.raw`\lvert 2x - 2\rvert = 2\lvert x - 1\rvert`,
      ],
      prerequisites: ['epsilon-n'],
      controls: [{ kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.05, max: 1, step: 0.05, init: 0.4 }],
problems: epsdeltaProblems,
    },
    {
      id: 'continuity',
      title: { ko: '연속의 정의', en: 'The Definition of Continuity' },
      order: 2,
      summary: {
        ko: String.raw`연속이란 무엇인지 확인하는 씬입니다. 점 a를 움직여 보고, 한 점의 값만 들어 올려 연속이 깨지는 모습도 봅니다.

연속의 조건은 단 하나입니다. 옆에서 다가간 높이와 그 점의 높이가 같아야 합니다. 한 점의 값만 바꿔도 이 일치는 깨집니다. 그래서 그래프가 그 점에서 끊깁니다.

예를 들면, ✏️ 연필을 종이에서 떼지 않고 그래프를 그어 보세요. 한 번에 그려지면 연속입니다. 한 점만 위로 튀어 있으면, 거기서 연필을 들어 옮겨야 합니다.`,
        en: String.raw`This scene shows what continuity means at a point. Move the point a, then lift one value and watch continuity break.

There is one condition. The height you approach must equal the height at the point. Changing a single value breaks that agreement. The graph then tears at that point.

For example, draw the graph with a ✏️ pencil without lifting it. If one stroke suffices, the function is continuous. If one point floats above the rest, you must lift the pencil there.`,
      },
      tex: [
        String.raw`f \text{ continuous at } a \iff \lim_{x \to a} f(x) = f(a)`,
        String.raw`g(a) = a^2 + 1 \neq a^2 = \lim_{x \to a} g(x)`,
      ],
      prerequisites: ['epsdelta'],
      controls: [
        { kind: 'slider', key: 'a', label: { ko: '점 a', en: 'Point a' }, min: -2, max: 2, step: 0.1, init: 1 },
        { kind: 'toggle', key: 'broken', label: { ko: '한 점 깨뜨리기', en: 'Break one point' }, init: false },
      ],
problems: continuityProblems,
    },
    {
      id: 'thomae',
      title: { ko: '토매 함수', en: "Thomae's Function" },
      order: 3,
      summary: {
        ko: String.raw`팝콘처럼 점이 튀는 토매 함수를 보는 씬입니다. 유리수에서는 점이 솟고, 무리수에서는 바닥에 붙습니다.

높이 솟는 점은 드뭅니다. 어떤 높이를 정해도, 그 높이에 닿는 점은 유한 개뿐입니다. 그래서 무리수 근처에서는 높은 점을 피해 좁은 구간을 잡을 수 있습니다. 무리수에서는 연속이고 유리수에서는 불연속인 이유입니다.

예를 들면, 🍬 사탕 자루를 떠올려 보세요. 큰 사탕은 몇 개뿐이라 금방 셀 수 있습니다. 작은 사탕만 모인 구석은 거의 평평합니다. 무리수 근처가 그렇습니다. 큰 점프가 없어서 함수가 조용히 붙어 있습니다.`,
        en: String.raw`This scene shows Thomae's function, a popcorn of dots. Dots jump up at rationals and stick to the floor at irrationals.

Tall dots are rare. Fix any height: only finitely many dots reach it. So near an irrational you can choose a window avoiding tall dots. That is why it is continuous at irrationals only.

For example, picture a jar of 🍬 candies. Only a few are big, and you can count them. A corner with only tiny candies is nearly flat. Neighborhoods of irrationals look like that: no big jumps, so the function stays quiet.`,
      },
      tex: [
        String.raw`f(x) = \begin{cases} 1/q & x = p/q \text{ in lowest terms} \\ 0 & x \notin \mathbb{Q} \end{cases}`,
        String.raw`\{x : f(x) \ge \varepsilon\} = \{p/q : q \le 1/\varepsilon\} \text{ finite}`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'slider', key: 'Q', label: { ko: '최대 분모 Q', en: 'Max denominator Q' }, min: 1, max: 30, step: 1, init: 12 },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.02, max: 0.5, step: 0.01, init: 0.2 },
        { kind: 'slider', key: 'center', label: { ko: '중심 x₀', en: 'Center x₀' }, min: 0, max: 1, step: 0.01, init: 0.5 },
        { kind: 'slider', key: 'zoom', label: { ko: '확대 폭', en: 'Zoom width' }, min: 0.02, max: 0.5, step: 0.01, init: 0.2 },
      ],
      problems: thomaeProblems,
    },
    {
      id: 'continuity-equivalences',
      title: { ko: '연속성의 세 가지 얼굴', en: 'Three Faces of Continuity' },
      order: 4,
      summary: {
        ko: String.raw`연속성을 세 가지 방법으로 확인하는 씬입니다. ε-δ 논법, 수열 판정, 열린집합의 역상을 나란히 비교합니다.

세 얼굴은 같은 말을 합니다. 띠로 재든, 수열로 따라가든, 열린집합을 당겨 보든 판정은 같습니다. 매끄러운 곡선은 셋 다 통과합니다. 점프 함수는 셋 다 같은 자리에서 걸립니다.

예를 들면, 🪞 거울 속 모습을 세 방향에서 본다고 해보세요. 앞에서 봐도, 옆에서 봐도 같은 물체입니다. 연속성도 같습니다. 확인하는 방법이 달라도, 묻는 것은 하나입니다.`,
        en: String.raw`This scene checks continuity in three different ways. The ε–δ argument, the sequential test, and preimages of open sets stand side by side.

The three faces say the same thing. Bands, sequences, or pulled-back open sets all give the same verdict. A smooth curve passes all three. A jump function fails all three at the same spot.

For example, look at one object in a 🪞 mirror from three sides. Front or side, it is the same object. Continuity is like that: many checks, one question.`,
      },
      tex: [
        String.raw`\forall\varepsilon>0\ \exists\delta>0:\ \lvert x-x_0\rvert<\delta \Rightarrow \lvert f(x)-f(x_0)\rvert<\varepsilon`,
        String.raw`x_n \to x_0 \Rightarrow f(x_n) \to f(x_0)`,
        String.raw`f \text{ continuous} \iff f^{-1}(V) \text{ open for every open } V`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수', en: 'Function' }, options: ['square', 'jump'], init: 'square' },
        { kind: 'select', key: 'view', label: { ko: '관점', en: 'View' }, options: ['epsdelta', 'sequential', 'preimage'], init: 'epsdelta' },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.05, max: 1, step: 0.05, init: 0.3 },
      ],
      problems: continuityEquivalencesProblems,
    },
    {
      id: 'monotone-discontinuities',
      title: { ko: '단조함수의 불연속점', en: 'Discontinuities of Monotone Functions' },
      order: 5,
      summary: {
        ko: String.raw`단조함수의 불연속점을 보는 씬입니다. 한 방향으로만 오르는 함수라, 끊기는 곳은 전부 점프뿐입니다.

큰 점프는 몇 개 없습니다. 전체 오름폭이 정해져 있기 때문입니다. 점프 크기에 문턱을 걸면, 문턱을 넘는 점은 유한 개뿐입니다. 문턱을 계속 낮춰 세어 가면, 불연속점은 셀 수 있는 개수만 나옵니다.

예를 들면, 🪜 계단 전체 높이가 3m라고 해보세요. 30cm가 넘는 단은 아홉 개를 넘지 않습니다. 3cm짜리 단까지 세도 사정은 같습니다. 단은 많아도 하나씩 셀 수 있습니다.`,
        en: String.raw`This scene inspects the discontinuities of a monotone function. It only ever climbs, so every break is a jump.

Big jumps are few. The total climb is fixed, and that bounds them. Set a threshold: only finitely many jumps exceed it. Lowering the threshold step by step counts all discontinuities.

For example, take a 🪜 staircase three meters tall in total. Steps higher than 30 cm number at most nine. Counting steps down to 3 cm changes nothing: many steps, still countable one by one.`,
      },
      tex: [
        String.raw`f(x-) = \sup_{t<x} f(t), \qquad f(x+) = \inf_{t>x} f(t)`,
        String.raw`\#\{x : f(x+) - f(x-) > 1/n\} \le n\,(f(b) - f(a))`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'slider', key: 'terms', label: { ko: '유리수 점프 수', en: 'Rational jumps' }, min: 1, max: 60, step: 1, init: 24 },
        { kind: 'slider', key: 'n', label: { ko: '임계값 분모 n (1/n)', en: 'Threshold denominator n (1/n)' }, min: 1, max: 32, step: 1, init: 4 },
      ],
problems: monotoneDiscontinuitiesProblems,
    },
    {
      id: 'uniform-continuity',
      title: { ko: '균등연속', en: 'Uniform Continuity' },
      order: 6,
      summary: {
        ko: String.raw`균등연속을 확인하는 씬입니다. 점 x를 옮기며, 필요한 δ가 점마다 어떻게 달라지는지 봅니다.

일반 연속에서는 δ가 점마다 달라도 됩니다. 균등연속에서는 δ 하나가 모든 점에서 통해야 합니다. 곡선이 가팔라지는 곳에서는 δ가 자꾸 작아집니다. 끝없이 가팔라지면, 전체를 감당할 δ는 없습니다.

예를 들면, 반 친구 전원이 하나의 📏 자를 나눠 쓴다고 해보세요. 누구 차례든 그 자로 재야 합니다. 한 명에게라도 자가 너무 짧으면, 그 차례에서 측정이 틀어집니다.`,
        en: String.raw`This scene tests uniform continuity. Slide the point x and watch how the δ it needs changes from point to point.

Ordinary continuity lets δ depend on the point. Uniform continuity demands one δ working everywhere. Where the curve steepens, the needed δ keeps shrinking. If it steepens forever, no single δ can cover everything.

For example, imagine a whole class sharing one 📏 ruler. Everyone must measure with that same ruler. If it is too short for even one person's turn, the measurement fails there.`,
      },
      tex: [
        String.raw`\forall\varepsilon > 0\ \exists\delta > 0:\ \lvert x - y\rvert < \delta \Rightarrow \lvert f(x) - f(y)\rvert < \varepsilon`,
        String.raw`\delta = \sqrt{x^2+\varepsilon} - \lvert x\rvert`,
        String.raw`\delta = \varepsilon / 2`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수', en: 'Function' }, options: ['square', 'linear'], init: 'square' },
        { kind: 'slider', key: 'x', label: { ko: '점 x', en: 'Point x' }, min: 0, max: 4, step: 0.1, init: 2 },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.1, max: 2, step: 0.1, init: 0.5 },
      ],
      problems: uniformContinuityProblems,
    },
    {
      id: 'ivt',
      title: { ko: '중간값 정리', en: "You Can't Climb Without Crossing Every Height" },
      order: 7,
      summary: {
        ko: String.raw`중간값 정리를 확인하는 씬입니다. 목표 높이를 움직이며, 그래프가 그 높이를 건너는 점을 찾습니다.

끊기지 않은 길은 중간을 건너뛸 수 없습니다. 낮은 곳에서 높은 곳으로 가면, 사이 높이를 어딘가에서 반드시 지납니다. 그래프가 끊기면 이 약속은 깨집니다.

예를 들면, 🌡️ 온도계 수은주를 보세요. 아침 10도에서 낮 20도로 오르는 동안, 15도를 반드시 지납니다. 수은주는 순간이동을 하지 않으니까요.`,
        en: String.raw`This scene checks the intermediate value theorem. Move the target height and find where the graph crosses it.

An unbroken path cannot skip the middle. Going from low to high, it must pass every height between. If the graph breaks, the promise fails.

For example, watch the column of a 🌡️ thermometer. Rising from 10° in the morning to 20° at noon, it must pass 15°. The column never teleports.`,
      },
      tex: [String.raw`f(a)<c<f(b)\Rightarrow\exists\,\xi\in(a,b):f(\xi)=c`],
      controls: [
        { kind: 'select', key: 'fn', label: { ko: '함수', en: 'Function' }, options: ['cubic', 'sine'], init: 'cubic' },
        { kind: 'slider', key: 't', label: { ko: '목표 높이 (0–100%)', en: 'Target level (0–100%)' }, min: 0, max: 100, step: 1, init: 50 },
      ],
problems: ivtProblems,
    },
    {
      id: 'evt',
      title: { ko: '최댓값 정리', en: 'The Extreme Value Theorem' },
      order: 8,
      summary: {
        ko: String.raw`최댓값 정리를 확인하는 씬입니다. 닫힌 구간에서는 최댓값에 닿고, 열린 구간과 불연속인 경우에는 왜 못 닿는지도 봅니다.

조건은 두 가지입니다. 구간이 닫혀 있어야 하고, 그래프가 끊기지 않아야 합니다. 하나라도 빠지면 가장 높은 점에 다가만 가고 닿지 못할 수 있습니다. 그래서 두 조건이 모두 필요합니다.

예를 들면, 🧑 등산객이 산길을 따라 정상으로 간다고 해보세요. 길이 끝까지 이어져 있으면, 가장 높은 곳에 발을 딛는 순간이 옵니다. 정상 직전에서 길이 끊기면, 아무리 가까워도 닿지 못합니다.`,
        en: String.raw`This scene checks the extreme value theorem. On a closed interval the maximum is attained; open intervals and breaks show why it can fail.

Two conditions are needed. The interval must be closed, and the graph must be unbroken. Drop either one, and the highest point may only be approached, never reached. That is why both hypotheses matter.

For example, picture a 🧑 hiker walking a trail to the summit. If the trail runs all the way, some step lands on the highest point. If the trail breaks just before it, the hiker gets close but never arrives.`,
      },
      tex: [
        String.raw`f \text{ continuous on } [a,b] \Rightarrow \exists\, x_{\max}, x_{\min}`,
        String.raw`f(x) = x^3 - 3x,\quad f(-1) = f(2) = 2,\ f(-2) = f(1) = -2`,
      ],
      prerequisites: ['ivt'],
      controls: [
        {
          kind: 'select',
          key: 'mode',
          label: { ko: '모드', en: 'Mode' },
          options: ['closed', 'open-interval', 'discontinuous'],
          init: 'closed',
        },
      ],
problems: evtProblems,
    },
    {
      id: 'additive-functions',
      title: { ko: '덧셈 함수와 하멜 기저', en: 'Additive Functions and the Hamel Basis' },
      order: 9,
      summary: {
        ko: String.raw`합을 그대로 두는 함수가 어디까지 자유로운지 봅니다. 유리수에서는 완전히 고정되고, 무리수에서는 값이 풀려납니다.

덧셈 함수는 \(f(x + y) = f(x) + f(y)\)를 만족합니다. 유리수에서는 \(f(q) = qf(1)\)이라 자유가 없습니다. 하지만 실수를 유리수 위의 벡터공간으로 보면 \(1\)과 \(\sqrt{2}\)는 독립이라, \(f(\sqrt{2})\)는 아무 값으로나 정할 수 있습니다. 그 자유가 하멜 기저입니다.

예를 들면, 📐 정사각형의 한 변이 1이면 대각선은 \(\sqrt{2}\)입니다. 변의 길이만 알아서는 대각선에 매길 값을 정할 수 없습니다. 대각선은 변과 독립인 새 방향이기 때문입니다. 연속이라는 조건을 거는 순간 이 자유는 사라지고 직선만 남습니다.`,
        en: String.raw`See how free a function that preserves addition can be. On the rationals it is completely pinned; at irrationals its values come loose.

An additive function obeys \(f(x + y) = f(x) + f(y)\). On the rationals \(f(q) = qf(1)\) leaves no freedom. But viewing the reals as a vector space over the rationals, \(1\) and \(\sqrt{2}\) are independent, so \(f(\sqrt{2})\) may be chosen as anything. That freedom is the Hamel basis.

For example, a 📐 square with side 1 has diagonal \(\sqrt{2}\). Knowing only the side pins nothing about the value assigned to the diagonal, because the diagonal is a new, independent direction. Impose continuity and the freedom vanishes, leaving only a straight line.`,
      },
      tex: [
        String.raw`f(x + y) = f(x) + f(y), \qquad f(q) = qf(1) \ \ (q \in \mathbb{Q})`,
        String.raw`f(a + b\sqrt{2}) = a + bt, \qquad t = f(\sqrt{2}) \text{ is free}`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'slider', key: 't', label: { ko: 'f(√2) = t', en: 'f(√2) = t' }, min: -2.5, max: 2.5, step: 0.01, init: 1.41 },
      ],
      problems: additiveFunctionsProblems,
    },
    {
      id: 'uniform',
      title: { ko: '균등수렴 vs 점별수렴', en: 'When the Limit Breaks' },
      order: 10,
      summary: {
        ko: String.raw`점별수렴과 균등수렴의 차이를 보는 씬입니다. 거듭제곱 곡선들이 극한에서 어떻게 끊기는지 확인합니다.

점별수렴은 점마다 따로 기다리는 것입니다. 균등수렴은 전 구간이 한꺼번에 다가가는 것입니다. 한 점이라도 끝까지 버티면 균등수렴이 아닙니다. 그래서 연속인 곡선들의 극한이 끊길 수 있습니다.

예를 들면, 🧑 친구들이 한 줄로 서서 동시에 앉는다고 해보세요. 전원이 앉아야 끝난 것입니다. 한 명만 끝까지 서 있으면, 줄 전체는 아직 다 앉지 않은 셈입니다.`,
        en: String.raw`This scene separates pointwise from uniform convergence. Watch the power curves break in the limit.

Pointwise convergence waits at each point separately. Uniform convergence moves the whole interval at once. If even one point holds out forever, convergence is not uniform. That is how a limit of continuous curves can break.

For example, picture 🧑 classmates in a row sitting down together. It counts as done only when everyone is seated. If one classmate stays standing, the row as a whole is not finished.`,
      },
      tex: [
        String.raw`f_n(x)=x^n\to f(x)=\begin{cases}0&x<1\\1&x=1\end{cases}`,
        String.raw`\sup_{[0,1]}|f_n-f|=1\not\to 0`,
      ],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 8 },
        { kind: 'slider', key: 'eps', label: { ko: 'ε', en: 'ε' }, min: 0.05, max: 0.5, step: 0.01, init: 0.2 },
      ],
problems: uniformProblems,
    },
  ],
};
