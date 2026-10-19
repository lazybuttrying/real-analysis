import type { ChapterMeta } from '../../contracts.ts';
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
  scenes: [
    {
      id: 'epsdelta',
      title: { ko: 'ε-δ 정의', en: 'The ε–δ Definition' },
      order: 1,
      summary: {
        ko: String.raw`함수의 극한 \(\lim_{x\to a} f(x) = L\)의 엄밀한 뜻: \(\varepsilon\) 띠를 아무리 좁혀도, \(a\) 근처의 \(\delta\) 띠 안에서는 \(f\)가 그 띠 안에 머뭅니다. \(f(x)=2x\), \(a=1\), \(L=2\)에서 \(\delta=\varepsilon/2\)를 확인합니다.`,
        en: String.raw`The rigorous meaning of \(\lim_{x\to a} f(x) = L\): no matter how narrow the \(\varepsilon\)-band, there is a \(\delta\)-band around \(a\) where \(f\) stays inside it. Check \(\delta = \varepsilon/2\) for \(f(x) = 2x\), \(a = 1\), \(L = 2\).`,
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
        ko: String.raw`\(f\)가 \(a\)에서 연속이란 \(\lim_{x\to a} f(x) = f(a)\)인 것 — 극한값과 함수값이 일치해야 합니다. 점 \(a\)를 움직여 보고, broken 모드에서는 한 점의 값을 들어 올려 정의가 깨지는 모습을 확인합니다.`,
        en: String.raw`\(f\) is continuous at \(a\) when \(\lim_{x\to a} f(x) = f(a)\) — the limit and the value must agree. Move the point \(a\); in broken mode the value at one point is lifted and the definition breaks.`,
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
        ko: String.raw`팝콘 함수 \(f(p/q) = 1/q\) (기약분수), \(f(x) = 0\) (무리수): 모든 무리수에서 연속이고 모든 유리수에서 불연속입니다. \(\varepsilon\)을 주면 높이가 \(\varepsilon\) 이상인 점은 유한개뿐 — 그래서 무리수 근처에서는 \(\delta\)를 잡을 수 있습니다.`,
        en: String.raw`The popcorn function \(f(p/q) = 1/q\) (reduced), \(f(x) = 0\) (irrational): continuous at every irrational, discontinuous at every rational. Given \(\varepsilon\), only finitely many dots reach height \(\varepsilon\) — so near an irrational a \(\delta\) can always be found.`,
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
        ko: String.raw`연속성은 세 가지 얼굴을 가집니다: \(\varepsilon\)-\(\delta\) 논법, 수열을 통한 판정, 열린 집합의 역상. \(f(x) = x^2\)와 점프 함수를 나란히 두어 세 얼굴이 같은 말을 하고 있음을 확인합니다.`,
        en: String.raw`Continuity has three faces: the \(\varepsilon\)-\(\delta\) argument, the sequential test, and preimages of open sets. Placing \(f(x) = x^2\) next to a jump function shows the three faces saying the same thing.`,
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
        ko: String.raw`단조함수는 모든 점에서 좌극한과 우극한을 가지므로, 불연속점은 모두 점프입니다. 점프 크기가 \(1/n\)을 넘는 점은 유한 개뿐이므로, 불연속점은 아무리 많아도 가산 개입니다.`,
        en: String.raw`A monotone function has left and right limits everywhere, so every discontinuity is a jump. Only finitely many jumps can exceed \(1/n\), so the discontinuities are at most countable — no matter how many there are.`,
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
        ko: String.raw`균등연속에서는 하나의 \(\delta\)가 모든 점 \(x\)에서 통한다 — \(\delta\)는 \(\varepsilon\)에만 의존하고 \(x\)에는 의존하지 않는다. \(f(x) = x^2\)에서는 \(x\)가 커질수록 필요한 \(\delta\)가 줄어들어 \(\mathbb{R}\) 전체를 감당하는 \(\delta\)가 없음을 직접 확인해 보자.`,
        en: String.raw`Uniform continuity demands one \(\delta\) that works at every point \(x\) — \(\delta\) may depend on \(\varepsilon\) alone, never on \(x\). Watch the required \(\delta\) shrink as \(x\) grows for \(f(x) = x^2\), so no single \(\delta\) covers all of \(\mathbb{R}\).`,
      },
      tex: [
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
        ko: String.raw`연속함수는 \([a,b]\)에서 \(f(a)\)와 \(f(b)\) 사이의 모든 값을 반드시 밟고 지나갑니다. 목표 높이 \(c\)를 움직이며 건너는 점 \(\xi\)를 찾아봅니다.`,
        en: String.raw`A continuous function on \([a,b]\) must step on every value between \(f(a)\) and \(f(b)\). Move the target level \(c\) and find the crossing \(\xi\).`,
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
        ko: String.raw`닫힌 구간 위의 연속함수는 최댓값과 최솟값을 반드시 취합니다. \(f(x) = x^3 - 3x\) on \([-2,2]\)에서 확인하고, 열린 구간과 불연속 반례로 두 가설이 모두 필요함을 봅니다.`,
        en: String.raw`A continuous function on a closed interval always attains its max and min. Verify it for \(f(x) = x^3 - 3x\) on \([-2,2]\), and see from the open-interval and discontinuous counterexamples that both hypotheses are necessary.`,
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
      id: 'uniform',
      title: { ko: '균등수렴 vs 점별수렴', en: 'When the Limit Breaks' },
      order: 9,
      summary: {
        ko: String.raw`\(f_n(x)=x^n\)은 \([0,1]\)의 각 점에서는 수렴하지만, \(\sup|f_n-f|=1\not\to 0\)이라 균등하게 수렴하지는 않습니다. 극한함수가 \(x=1\)에서 끊어지는 모습을 확인합니다.`,
        en: String.raw`\(f_n(x)=x^n\) converges at every point of \([0,1]\), yet \(\sup|f_n-f|=1\not\to 0\): not uniformly. Watch the limit break at \(x=1\).`,
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
