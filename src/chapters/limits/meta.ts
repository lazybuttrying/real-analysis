import type { ChapterMeta } from '../../contracts.ts';
import { problems as bolzanoWeierstrassProblems } from './problems/bolzano-weierstrass';
import { problems as cantorProblems } from './problems/cantor';
import { problems as closureProblems } from './problems/closure';
import { problems as continuityProblems } from './problems/continuity';
import { problems as countableProblems } from './problems/countable';
import { problems as epsdeltaProblems } from './problems/epsdelta';
import { problems as epsilonNProblems } from './problems/epsilon-n';
import { problems as evtProblems } from './problems/evt';
import { problems as groupsFieldsProblems } from './problems/groups-fields';
import { problems as holesProblems } from './problems/holes';
import { problems as ivtProblems } from './problems/ivt';
import { problems as monotoneCauchyProblems } from './problems/monotone-cauchy';
import { problems as opensetsProblems } from './problems/opensets';
import { problems as setsProblems } from './problems/sets';
import { problems as supremumProblems } from './problems/supremum';
import { problems as uniformProblems } from './problems/uniform';

/**
 * Pure data. Imports types plus the chapter's per-scene problems data modules
 * (./problems/* — data only, no code, models, views, or shell).
 * (Node build scripts and every chapter's navigation read this file)
 * Every text is stored per language; the shell picks one via the URL language segment.
 * Summaries embed math as inline TeX between \( and \) (see splitInlineMath in contracts.ts).
 * NOTE: chapter numbering is never stored here — the shell derives it from the
 * catalog order in src/catalog.ts.
 */
export const limits: ChapterMeta = {
  id: 'limits',
  title: { ko: '극한과 연속', en: 'Limits and Continuity' },
  summary: {
    ko: '수열의 극한, 유리수의 빈틈, 연속의 의미를 눈으로 확인합니다.',
    en: 'See limits, the gaps in the rationals, and continuity with your own eyes.',
  },
  scenes: [
    {
      id: 'sets',
      title: { ko: '집합과 함수', en: 'Sets and Functions' },
      order: 1,
      summary: {
        ko: String.raw`집합의 연산 \(A \cup B\), \(A \cap B\), \(A^c\)와 드모르간 법칙, 그리고 단사·전사·전단사를 그림으로 확인합니다.`,
        en: String.raw`See set operations \(A \cup B\), \(A \cap B\), \(A^c\), De Morgan's laws, and injective / surjective / bijective maps as pictures.`,
      },
      tex: [
        String.raw`(A \cup B)^c = A^c \cap B^c`,
        String.raw`f \text{ bijective} \iff \exists g: g \circ f = \mathrm{id}`,
      ],
      controls: [
        {
          kind: 'select',
          key: 'op',
          label: { ko: '집합 연산', en: 'Set operation' },
          options: ['union', 'intersection', 'complement', 'difference', 'symdiff'],
          init: 'union',
        },
        {
          kind: 'select',
          key: 'fnmode',
          label: { ko: '함수 모양', en: 'Map shape' },
          options: ['injective', 'surjective', 'bijective', 'neither'],
          init: 'bijective',
        },
      ],
problems: setsProblems,
    },
    {
      id: 'supremum',
      title: { ko: '상한과 완비성', en: 'The Supremum Axiom' },
      order: 2,
      summary: {
        ko: String.raw`위로 유계인 집합은 가장 작은 상한 \(\sup S\)를 갖습니다 — 실수의 빈틈을 메우는 공리, 유리수의 구멍 장면의 짝꿍입니다.`,
        en: String.raw`Every bounded-above set has a least upper bound \(\sup S\) — the axiom filling the gaps in the rationals, twin of the rational-holes scene.`,
      },
      tex: [String.raw`\sup\left\{1-\frac{1}{n}\right\} = 1`, String.raw`S \ne \varnothing \text{ bounded above } \Rightarrow \sup S \text{ exists}`],
      controls: [
        {
          kind: 'select',
          key: 'set',
          label: { ko: '집합', en: 'Set' },
          options: ['one-minus', 'sqrt2'],
          init: 'one-minus',
        },
        {
          kind: 'slider',
          key: 'bound',
          label: { ko: '상한 후보', en: 'Upper-bound candidate' },
          min: 0.5,
          max: 2,
          step: 0.01,
          init: 1.4,
        },
      ],
problems: supremumProblems,
    },
    {
      id: 'countable',
      title: { ko: '가산과 비가산', en: 'Countable vs Uncountable' },
      order: 3,
      summary: {
        ko: String.raw`유리수는 한 줄로 나열할 수 있지만 실수는 그럴 수 없습니다 — 칸토어의 대각선 논법으로 확인합니다.`,
        en: String.raw`The rationals fit into a single list; the reals do not — verified by Cantor's diagonal argument.`,
      },
      tex: [String.raw`\mathbb{Q} = \{q_1, q_2, \dots\}`, String.raw`(0,1) \text{ is uncountable}`],
      controls: [
        {
          kind: 'select',
          key: 'panel',
          label: { ko: '장면', en: 'Panel' },
          options: ['rationals', 'diagonal'],
          init: 'rationals',
        },
        { kind: 'slider', key: 'n', label: { ko: '나열 개수', en: 'Listed count' }, min: 1, max: 64, step: 1, init: 20 },
      ],
problems: countableProblems,
    },
    {
      id: 'groups-fields',
      title: { ko: '군과 체', en: 'Groups vs Fields' },
      order: 4,
      summary: {
        ko: String.raw`군은 되돌릴 수 있는 움직임(결합·항등원·역원), 체는 사칙연산이 되는 세계입니다. 부분군 판정법과 \((\mathbb{Z},+)\) vs \((\mathbb{Q},+,\times)\)의 차이를 봅니다.`,
        en: String.raw`A group is reversible moves (associativity, identity, inverses); a field is a world where all four operations work. Includes the subgroup test and \((\mathbb{Z},+)\) vs \((\mathbb{Q},+,\times)\).`,
      },
      tex: [
        String.raw`(a+b)+c = a+(b+c),\ \ \exists\,0,\ \ \forall a\,\exists(-a)`,
        String.raw`a(b+c) = ab+ac,\qquad 2\mathbb{Z} \le \mathbb{Z},\ \ \mathbb{Q} \le \mathbb{R}`,
      ],
      controls: [
        {
          kind: 'select',
          key: 'table',
          label: { ko: '곱셈표', en: 'Table' },
          options: ['z6', 'z5'],
          init: 'z6',
        },
      ],
problems: groupsFieldsProblems,
    },
    {
      id: 'epsilon-n',
      title: { ko: 'ε-N 극한', en: 'The ε–N Definition' },
      order: 5,
      summary: {
        ko: String.raw`\(\varepsilon\) 띠를 좁혀도 수열의 꼬리가 전부 그 안에 들어가는 순간을 확인합니다. 그때의 \(N\)이 바로 \(\forall\varepsilon>0\ \exists N\)의 \(N\)입니다.`,
        en: String.raw`Watch the moment the whole tail of a sequence fits inside the \(\varepsilon\)-band. That \(N\) is exactly the \(N\) in \(\forall\varepsilon>0\ \exists N\).`,
      },
      tex: [String.raw`\forall\varepsilon>0\ \exists N\ \text{s.t.}\ n>N\Rightarrow|a_n-L|<\varepsilon`],
      controls: [
        {
          kind: 'select',
          key: 'seq',
          label: { ko: '수열', en: 'Sequence' },
          options: ['1/n', '1/n²', '(−1)^n / n', 'n / (n+1)'],
          init: '1/n',
        },
        { kind: 'slider', key: 'epsilon', label: { ko: 'ε', en: 'ε' }, min: 0.01, max: 0.5, step: 0.01, init: 0.1 },
      ],
problems: epsilonNProblems,
    },
    {
      id: 'epsdelta',
      title: { ko: 'ε-δ 정의', en: 'The ε–δ Definition' },
      order: 6,
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
      order: 7,
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
      id: 'opensets',
      title: { ko: '열린집합과 닫힌집합', en: 'Open and Closed Sets' },
      order: 8,
      summary: {
        ko: String.raw`집합 \(U\)가 열려 있다는 것은 모든 점이 내점이라는 뜻 — 각 점을 \(\varepsilon\)-공으로 감쌀 수 있습니다. 수직선 위에서 점 \(x\)와 \(\varepsilon\)을 움직이며 공이 집합 안에 들어가는지 확인합니다.`,
        en: String.raw`A set \(U\) is open when every point is an interior point — each point can be wrapped in an \(\varepsilon\)-ball. Move the point \(x\) and the radius \(\varepsilon\) on the line and watch whether the ball stays inside.`,
      },
      tex: [
        String.raw`U \text{ open } \iff \forall x \in U\ \exists \varepsilon > 0 : (x - \varepsilon, x + \varepsilon) \subseteq U`,
        String.raw`F \text{ closed } \iff F^c \text{ open}`,
      ],
      prerequisites: ['continuity'],
      controls: [
        { kind: 'select', key: 'set', label: { ko: '집합 S', en: 'Set S' }, options: ['open', 'closed', 'half', 'singleton'], init: 'open' },
        { kind: 'slider', key: 'x', label: { ko: '점 x', en: 'Point x' }, min: -0.3, max: 1.3, step: 0.05, init: 0.5 },
        { kind: 'slider', key: 'eps', label: { ko: '반지름 ε', en: 'Radius ε' }, min: 0.05, max: 0.6, step: 0.05, init: 0.2 },
      ],
problems: opensetsProblems,
    },
    {
      id: 'closure',
      title: { ko: '폐포와 유계', en: 'Closure and Boundedness' },
      order: 9,
      summary: {
        ko: String.raw`집합 \(A\) 위에 바를 그으면 폐포 \(\overline{A}\) — 빠져나간 극한점들을 빨아들인 집합입니다. 닫힘 ⟺ 극한점을 다 품음 ⟺ 폐포와 같음, 그리고 닫힘 + 유계 ⟺ 컴팩트(하이네-보렐)의 돌림노래를 확인합니다.`,
        en: String.raw`Drawing a bar over \(A\) gives the closure \(\overline{A}\) — the set with its escaped limit points pulled back in. Follow the round-song: closed ⟺ contains its limit points ⟺ equals its closure, and closed + bounded ⟺ compact (Heine-Borel).`,
      },
      tex: [
        String.raw`x \in \overline{A} \iff \forall \varepsilon > 0 : (x - \varepsilon, x + \varepsilon) \cap A \neq \varnothing`,
        String.raw`A \text{ closed } \iff \overline{A} = A, \qquad A \text{ bounded } \iff \exists M : \lvert x\rvert \leq M\ \forall x \in A`,
      ],
      prerequisites: ['opensets'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '집합 A', en: 'Set A' }, options: ['open', 'halfclosed', 'reciprocal'], init: 'open' },
        { kind: 'slider', key: 'm', label: { ko: '경계 M', en: 'Bound M' }, min: 0.5, max: 2.5, step: 0.1, init: 1.5 },
      ],
problems: closureProblems,
    },
    {
      id: 'holes',
      title: { ko: '유리수의 구멍', en: 'Why ℝ Has No Holes' },
      order: 10,
      summary: {
        ko: String.raw`\(x_{n+1}=\frac{x_n+2/x_n}{2}\)의 모든 항은 유리수지만, 극한 \(\sqrt{2}\)는 유리수가 아닙니다. 유리수 집합 \(\mathbb{Q}\)에는 구멍이 있다는 뜻입니다. 무리수임의 엄밀한 증명은 다루지 않고 아이디어 수준에서만 봅니다.`,
        en: String.raw`Every term of \(x_{n+1}=\frac{x_n+2/x_n}{2}\) is rational, yet the limit \(\sqrt{2}\) is not. The rationals \(\mathbb{Q}\) have a hole — shown at the idea level, without a full irrationality proof.`,
      },
      tex: [String.raw`x_{n+1}=\frac{x_n+2/x_n}{2}\to\sqrt{2}`, String.raw`\sqrt{2}\notin\mathbb{Q}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 8, step: 1, init: 4 }],
problems: holesProblems,
    },
    {
      id: 'bolzano-weierstrass',
      title: { ko: '볼차노–바이어슈트라스', en: 'A Convergent Subsequence Always Hides Inside' },
      order: 11,
      summary: {
        ko: '유계수열 속에는 항상 수렴하는 부분수열이 숨어 있습니다. 구간을 반으로 접어 점이 무한히 모이는 쪽을 따라가면 됩니다.',
        en: 'Every bounded sequence hides a convergent subsequence. Halve the interval and follow the half holding infinitely many terms.',
      },
      tex: [String.raw`(a_n)\ \text{bounded}\Rightarrow\exists\ (a_{n_k})\ \text{convergent}`],
      controls: [
        { kind: 'slider', key: 'steps', label: { ko: '이분 단계', en: 'Bisection steps' }, min: 1, max: 8, step: 1, init: 4 },
        { kind: 'select', key: 'seed', label: { ko: '난수 시드', en: 'Random seed' }, options: ['7', '21', '99'], init: '7' },
      ],
problems: bolzanoWeierstrassProblems,
    },
    {
      id: 'monotone-cauchy',
      title: { ko: '단조수열과 코시수열', en: 'Monotone and Cauchy Sequences' },
      order: 12,
      summary: {
        ko: String.raw`\(a_n = 1 - 2^{-n}\)은 증가하면서 위로 유계이므로 상한 \(1\)에 수렴합니다(단조수렴 정리). 꼬리 지름이 \(0\)으로 줄어드는 모습을 보며, 모든 수렴수열이 코시수열임을 확인합니다.`,
        en: String.raw`\(a_n = 1 - 2^{-n}\) increases and is bounded above, so it converges to its supremum \(1\) (monotone convergence). Watch the tail diameter shrink to \(0\): every convergent sequence is Cauchy.`,
      },
      tex: [
        String.raw`a_n = 1 - 2^{-n} \uparrow 1`,
        String.raw`\max_{m,k \geq N} \lvert a_m - a_k\rvert \to 0`,
      ],
      prerequisites: ['bolzano-weierstrass'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '보이는 항 개수', en: 'Terms shown' }, min: 1, max: 12, step: 1, init: 8 },
        { kind: 'slider', key: 'tailN', label: { ko: '꼬리 시작 N', en: 'Tail start N' }, min: 1, max: 10, step: 1, init: 4 },
      ],
problems: monotoneCauchyProblems,
    },
    {
      id: 'cantor',
      title: { ko: '칸토어 집합', en: 'Length Zero, Points Uncountable' },
      order: 13,
      summary: {
        ko: String.raw`가운데 3분의 1을 계속 지우면 전체 길이는 \(\left(\frac{2}{3}\right)^n\to 0\)이 되지만, 남는 점은 셀 수 없이 많습니다. 비가산성은 아이디어 수준에서만 언급합니다.`,
        en: String.raw`Deleting middle thirds drives the total length \(\left(\frac{2}{3}\right)^n\to 0\), yet uncountably many points remain. Uncountability is stated at the idea level only.`,
      },
      tex: [String.raw`|C_n|=\left(\frac{2}{3}\right)^n\to 0`, String.raw`|C|=|\mathbb{R}|`],
      controls: [{ kind: 'slider', key: 'stage', label: { ko: '단계 n', en: 'Stage n' }, min: 0, max: 8, step: 1, init: 4 }],
problems: cantorProblems,
    },
    {
      id: 'ivt',
      title: { ko: '중간값 정리', en: "You Can't Climb Without Crossing Every Height" },
      order: 14,
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
      order: 15,
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
      order: 16,
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
