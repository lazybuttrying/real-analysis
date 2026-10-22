import type { ChapterMeta } from '../../contracts.ts';
import { axiomOfChoiceProblems } from '../limits/problems/axiom-of-choice';
import { problems as binomialProblems } from '../limits/problems/binomial';
import { cantorTheoremProblems } from '../limits/problems/cantor-theorem';
import { complexNumbersProblems } from '../limits/problems/complex-numbers';
import { problems as countableProblems } from '../limits/problems/countable';
import { densityOfRationalsProblems } from '../limits/problems/density-of-rationals';
import { problems as dimensionRankProblems } from '../limits/problems/dimension-rank';
import { problems as groupsFieldsProblems } from '../limits/problems/groups-fields';
import { problems as integersRationalsProblems } from '../limits/problems/integers-rationals';
import { problems as naturalNumbersProblems } from '../limits/problems/natural-numbers';
import { nthRootProblems } from '../limits/problems/nth-root';
import { problems as setsProblems } from '../limits/problems/sets';
import { problems as supremumProblems } from '../limits/problems/supremum';
import { sqrt2IrrationalProblems } from '../limits/problems/sqrt2-irrational';
import { problems as vectorSpacesProblems } from '../limits/problems/vector-spaces';
import { zornLemmaProblems } from '../limits/problems/zorn-lemma';

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
export const numbers: ChapterMeta = {
  id: 'numbers',
  title: { ko: '수의 체계', en: 'Number Systems' },
  summary: {
    ko: '자연수에서 실수까지 — 수 체계를 공리부터 쌓아 올리고, 셀 수 있는 무한과 셀 수 없는 무한을 구분합니다.',
    en: 'From naturals to reals — building the number systems from axioms, and telling countable infinities from uncountable ones.',
  },
  scenes: [
    {
      id: 'natural-numbers',
      title: { ko: '자연수와 귀납법', en: 'Natural Numbers and Induction' },
      order: 1,
      summary: {
        ko: String.raw`자연수가 공리에서 어떻게 태어나는지 봅니다. 도미노를 세워 귀납법의 출발을 확인합니다.

귀납법은 무한한 명제를 한 번에 증명하는 원리입니다. 첫 번째 경우가 성립하는지 확인합니다. 어떤 경우가 성립하면 그다음도 성립함을 보입니다. 그러면 사슬이 끝없이 이어져 전부 성립합니다.

예를 들면, 🪜 계단 첫 칸에 올라선 뒤에는 한 칸씩 오를 수 있습니다. 첫 칸과 '다음 칸으로 가는 법'만 알면 꼭대기까지 닿습니다. 도미노가 전부 넘어지는 것과 같은 이치입니다.`,
        en: String.raw`Watch the natural numbers being born from axioms. Line up dominoes to see induction start.

Induction proves infinitely many statements at once. Check the first case. Then show each case hands truth to the next. The chain never ends, so everything holds.

For example, stand on the first 🪜 stair and know how to climb one more. The first step plus the climbing rule reaches the top. Dominoes fall the same way.`,
      },
      tex: [
        String.raw`P(1) \land (P(k) \Rightarrow P(k+1)) \Rightarrow \forall n \in \mathbb{N},\; P(n)`,
        String.raw`\sum_{k=1}^{n} k = \frac{n(n+1)}{2}`,
        String.raw`(1+x)^n \geq 1 + nx \quad (x > -1)`,
      ],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '도미노 개수', en: 'Domino count' }, min: 1, max: 10, step: 1, init: 6 },
      ],
      problems: naturalNumbersProblems,
    },
    {
      id: 'binomial',
      title: { ko: '이항정리', en: 'The Binomial Theorem' },
      order: 2,
      summary: {
        ko: String.raw`거듭제곱을 펼친 계수들이 만드는 삼각형을 봅니다. 행 하나가 통째로 계산되는 과정을 따라갑니다.

이항 계수는 '몇 개 중 몇 개를 고르는 경우의 수'입니다. 삼각형의 각 수는 바로 위 두 수의 합입니다. 이 덧셈 규칙이 귀납 단계의 심장입니다. 행을 모두 더하면 2의 거듭제곱이 됩니다.

예를 들면, 동전 2개를 던지면 앞면 수는 0개, 1개, 2개가 될 수 있습니다. 경우의 수는 차례로 1가지, 2가지, 1가지입니다. 삼각형의 둘째 행이 그대로 나타납니다.`,
        en: String.raw`See the triangle made by the coefficients of expanded powers. Follow one whole row being computed.

A binomial coefficient counts ways to choose. Each entry in the triangle is the sum of the two above it. That addition rule is the heart of the induction step. A whole row adds up to a power of two.

For example, toss two coins and count the heads: zero, one, or two. The counts go one way, two ways, one way. That is the triangle's second row, exactly.`,
      },
      tex: [
        String.raw`(x+y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k`,
        String.raw`\binom{n}{k}+\binom{n}{k-1}=\binom{n+1}{k}`,
        String.raw`\sum_{k=0}^{n}\binom{n}{k} = 2^n`,
      ],
      prerequisites: ['natural-numbers'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '선택된 행', en: 'Selected row' }, min: 0, max: 8, step: 1, init: 4 },
      ],
      problems: binomialProblems,
    },
    {
      id: 'integers-rationals',
      title: { ko: '정수와 유리수', en: 'Integers and Rationals' },
      order: 3,
      summary: {
        ko: String.raw`쌍을 묶는 방식으로 음수와 분수를 새로 만듭니다. 같은 수를 가리키는 쌍끼리 한 묶음이 됩니다.

정수는 자연수 쌍의 묶음으로 정의됩니다. 분수도 정수 쌍의 묶음입니다. 서로 다른 쌍이 같은 수를 나타낼 수 있기 때문입니다. 이 '묶어서 새 수를 만드는' 기술은 실수를 만들 때 다시 쓰입니다.

예를 들면, 💰 돈과 빚으로 순자산을 나타내는 것과 같습니다. 가진 돈 5만 원에 빚 3만 원이면 순자산은 2만 원입니다. 가진 돈 7만 원에 빚 5만 원이어도 똑같이 2만 원입니다. 쌍은 달라도 값은 같습니다.`,
        en: String.raw`Build negative numbers and fractions by bundling pairs. Pairs naming the same number form one bundle.

Integers are bundles of pairs of naturals. Fractions are bundles of pairs of integers. Different pairs can name the same number. This bundle trick returns when the reals are built.

For example, think of 💰 money and debt. Five coins in hand and three owed is a net of two. Seven in hand and five owed is also two. Different pairs, same value.`,
      },
      tex: [
        String.raw`(a,b)\sim(c,d)\iff a+d=b+c`,
        String.raw`(a,b)\sim(c,d)\iff ad=bc`,
        String.raw`p<q \implies p<\frac{p+q}{2}<q`,
      ],
      prerequisites: ['natural-numbers'],
      controls: [
        {
          kind: 'select',
          key: 'set',
          label: { ko: '수 집합', en: 'Number set' },
          options: ['naturals', 'integers', 'rationals'],
          init: 'rationals',
        },
        { kind: 'slider', key: 'denom', label: { ko: '최대 분모', en: 'Max denominator' }, min: 1, max: 8, step: 1, init: 4 },
      ],
      problems: integersRationalsProblems,
    },
    {
      id: 'complex-numbers',
      title: { ko: '복소수', en: 'Complex Numbers' },
      order: 4,
      summary: {
        ko: String.raw`복소수를 평면 위의 점으로 봅니다. 실수 부분은 가로축, 허수 부분은 세로축입니다.

절댓값은 원점에서 그 점까지의 거리입니다. 두 복소수를 더하면 평행사변형의 대각선이 됩니다. 그 대각선은 두 변의 길이 합보다 길어지지 않습니다. 이것이 삼각부등식입니다.

예를 들면, 🧭 동쪽으로 3보, 북동쪽으로 꺾어 4보를 더 걸어도 직선거리는 꺾인 길보다 짧습니다. 절댓값이 재는 것이 바로 그 직선거리입니다.`,
        en: String.raw`See a complex number as a point in the plane. The real part runs sideways, the imaginary part runs up.

The modulus is the distance from the origin to that point. Adding two complex numbers draws the diagonal of a parallelogram. That diagonal is never longer than the two sides added together. This is the triangle inequality.

For example, walk 3 steps east with a 🧭 compass, then turn and walk 4 more. The straight-line distance back is shorter than the bent path. The modulus measures exactly that straight line.`,
      },
      tex: [
        String.raw`|z| = \sqrt{a^2 + b^2} \quad (z = a + bi)`,
        String.raw`|z + w| \le |z| + |w|`,
      ],
      prerequisites: ['integers-rationals'],
      controls: [
        { kind: 'slider', key: 'zre', label: { ko: 'z 실수 부분', en: 'z real part' }, min: -2, max: 2, step: 0.1, init: 1.2 },
        { kind: 'slider', key: 'zim', label: { ko: 'z 허수 부분', en: 'z imaginary part' }, min: -2, max: 2, step: 0.1, init: 0.8 },
        { kind: 'slider', key: 'wre', label: { ko: 'w 실수 부분', en: 'w real part' }, min: -2, max: 2, step: 0.1, init: -0.6 },
        { kind: 'slider', key: 'wim', label: { ko: 'w 허수 부분', en: 'w imaginary part' }, min: -2, max: 2, step: 0.1, init: 1.1 },
      ],
      problems: complexNumbersProblems,
    },
    {
      id: 'sqrt2-irrational',
      title: { ko: '√2는 무리수', en: '√2 is Irrational' },
      order: 5,
      summary: {
        ko: String.raw`분수를 촘촘히 찍어도 끝내 메워지지 않는 구멍을 봅니다. 그 자리가 바로 루트 2입니다.

유리수만으로는 수직선이 완성되지 않습니다. 어떤 분수도 제곱하면 정확히 2가 되지 않습니다. 분모를 아무리 키워도 그 자리는 빕니다. 그래서 유리수 너머의 수가 필요합니다.

예를 들면, 📏 자로 길이를 재는 것과 같습니다. 눈금을 아무리 잘게 나눠도 딱 맞지 않는 길이가 있습니다. 정사각형의 대각선이 그런 길이입니다. 분수 눈금으로는 영원히 잡지 못합니다.`,
        en: String.raw`Plot fractions ever more densely and watch one hole never fill. That spot is the square root of two.

Rationals alone do not complete the number line. No fraction squares to exactly two. However fine the denominators, that spot stays empty. Numbers beyond the rationals are needed.

For example, measure a length with a 📏 ruler. However fine the marks, some lengths never match one. A square's diagonal is such a length. Fraction marks never catch it.`,
      },
      tex: [
        String.raw`\left(\frac{p}{q}\right)^2 \ne 2 \quad \forall\, \frac{p}{q} \in \mathbb{Q}`,
        String.raw`\left|\frac{17}{12} - \sqrt{2}\right| \approx 0.00245 > 0`,
      ],
      prerequisites: ['integers-rationals'],
      controls: [
        { kind: 'slider', key: 'denom', label: { ko: '최대 분모', en: 'Max denominator' }, min: 1, max: 12, step: 1, init: 6 },
      ],
      problems: sqrt2IrrationalProblems,
    },
    {
      id: 'density-of-rationals',
      title: { ko: '유리수의 조밀성', en: 'Density of the Rationals' },
      order: 6,
      summary: {
        ko: String.raw`아무리 좁은 구간에도 유리수가 숨어 있음을 봅니다. 분모를 키울수록 눈금이 촘촘해집니다.

두 수 사이에는 언제나 분수가 하나 들어갑니다. 구간이 좁으면 분모가 큰 분수가 필요합니다. 눈금을 충분히 잘게 나누면 어떤 틈에도 한 칸은 들어갑니다. 무리수 사이에서도 마찬가지입니다.

예를 들면, 🍰 케이크를 반으로 또 반으로 자르는 것과 같습니다. 조각은 끝없이 작아집니다. 아무리 얇은 틈을 골라도 그보다 얇은 조각을 만들 수 있습니다. 그 조각이 틈 안에 들어가는 분수입니다.`,
        en: String.raw`See that every interval, however narrow, hides a rational. Bigger denominators make the ticks denser.

Between any two numbers sits a fraction. Narrower gaps need bigger denominators. Chop the scale finely enough and some tick lands in every gap. The same trick works around irrationals.

For example, keep cutting a 🍰 cake in half, again and again. The pieces shrink without end. Pick any thin gap, and a thinner piece exists. That piece is the fraction landing inside.`,
      },
      tex: [
        String.raw`n = \left\lfloor\frac{1}{y-x}\right\rfloor + 1,\quad m = \lfloor nx \rfloor + 1`,
        String.raw`x < \frac{m}{n} < y`,
        String.raw`z = r + (s-r)\frac{\sqrt{2}}{2}\ \text{is irrational}`,
      ],
      prerequisites: ['integers-rationals'],
      controls: [
        {
          kind: 'select',
          key: 'preset',
          label: { ko: '구간', en: 'Interval' },
          options: ['a', 'b', 'c'],
          init: 'a',
        },
        { kind: 'slider', key: 'denom', label: { ko: '최대 분모', en: 'Max denominator' }, min: 1, max: 200, step: 1, init: 24 },
      ],
      problems: densityOfRationalsProblems,
    },
    {
      id: 'sets',
      title: { ko: '집합과 함수', en: 'Sets and Functions' },
      order: 7,
      summary: {
        ko: String.raw`집합의 합집합과 교집합을 그림으로 겹쳐 봅니다. 함수가 단사인지 전사인지도 눈으로 가립니다.

합집합은 둘 중 하나라도 속하면 들어갑니다. 교집합은 둘 다 속해야 들어갑니다. 여집합은 바깥 전체입니다. 화살표가 겹치는지, 빠지는 곳이 없는지가 단사와 전사를 가릅니다.

예를 들면, 📚 책을 좋아하는 🧑 친구와 ⚽ 공놀이를 좋아하는 친구가 있습니다. 둘 다 좋아하는 친구는 겹친 부분에 섭니다. 어느 한쪽이라도 좋아하면 합집합에 들어갑니다.`,
        en: String.raw`Overlap sets in pictures to see unions and intersections. Judge by eye whether a map is injective or surjective.

A union takes anything in at least one set. An intersection needs both. A complement is everything outside. Colliding or missing arrows decide injective versus surjective.

For example, some 🧑 classmates love 📚 books, while others love ⚽ soccer. Friends loving both stand in the overlap. Loving at least one puts you in the union.`,
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
      id: 'axiom-of-choice',
      title: { ko: '선택 공리', en: 'The Axiom of Choice' },
      order: 8,
      summary: {
        ko: String.raw`줄마다 점이 하나씩 들어 있는 표에서 하나씩 골라 봅니다. 유한할 때와 무한할 때가 왜 다른지 봅니다.

고르는 행위를 함수로 만들 수 있는지가 문제입니다. 집합이 유한하면 하나씩 직접 고르면 됩니다. 무한히 많으면 고르는 규칙 자체를 보장해야 합니다. 그 보장이 바로 선택 공리입니다.

예를 들면, 📦 상자마다 🍬 사탕이 들어 있습니다. 상자가 세 개면 손으로 하나씩 꺼내면 됩니다. 상자가 끝없이 많으면 '각 상자에서 하나'라는 규칙이 필요합니다. 눈으로 다 확인할 수 없기 때문입니다.`,
        en: String.raw`Pick one dot from each row of a table. See why finite collections and infinite ones differ.

The question is whether picking can be made into a function. Finitely many sets: just pick, one by one. Infinitely many: the picking rule itself needs a guarantee. That guarantee is the axiom of choice.

For example, every 📦 box holds some 🍬 candies. With three boxes, just reach in and pick. With endless boxes, you need the rule 'one from each box'. Nobody can check them all by eye.`,
      },
      tex: [
        String.raw`\forall i \in I\;(X_i \ne \varnothing) \Rightarrow \prod_{i \in I} X_i \ne \varnothing`,
        String.raw`c: \{X_i\}_{i \in I} \to \bigcup_i X_i,\quad c(X_i) \in X_i`,
      ],
      prerequisites: ['sets'],
      controls: [
        { kind: 'slider', key: 'm', label: { ko: '집합 개수', en: 'Number of sets' }, min: 2, max: 5, step: 1, init: 3 },
        { kind: 'slider', key: 'seed', label: { ko: '배치', en: 'Arrangement' }, min: 1, max: 5, step: 1, init: 1 },
      ],
      problems: axiomOfChoiceProblems,
    },
    {
      id: 'zorn-lemma',
      title: { ko: '초른 보조정리', en: "Zorn's Lemma" },
      order: 9,
      summary: {
        ko: String.raw`약수들을 나누어떨어지는 순서로 세워 봅니다. 사슬을 따라 올라가면 끝에 무엇이 남는지 봅니다.

사슬은 서로 비교할 수 있는 원소들의 줄입니다. 모든 사슬이 위쪽 끝을 가지면 더 위가 없는 원소가 존재합니다. 그 원소를 직접 찾지 않아도 존재가 보장됩니다. 이 보장은 선택 공리와 동치입니다.

예를 들면, 🪜 계단 꼭대기에는 더 오를 칸이 없습니다. 어떤 줄로 올라가도 그 줄의 끝은 있습니다. 끝이 있다는 보장만으로 꼭대기의 존재를 압니다.`,
        en: String.raw`Stand the divisors of twelve in divisibility order. Climb a chain and see what sits at the top.

A chain is a line of mutually comparable elements. If every chain has an upper bound, a maximal element exists. You never construct it; existence is guaranteed. The guarantee matches the axiom of choice.

For example, the top of a 🪜 staircase has no next step. Every way up ends somewhere. Knowing every climb ends proves a top exists.`,
      },
      tex: [
        String.raw`\text{every chain has an upper bound} \Rightarrow \exists\, \text{maximal } m`,
        String.raw`1 \mid 2 \mid 4 \mid 12,\quad 1 \mid 3 \mid 6 \mid 12`,
      ],
      prerequisites: ['axiom-of-choice'],
      controls: [
        { kind: 'slider', key: 'chain', label: { ko: '사슬 선택', en: 'Choose chain' }, min: 0, max: 2, step: 1, init: 0 },
      ],
      problems: zornLemmaProblems,
    },
    {
      id: 'supremum',
      title: { ko: '상한과 완비성', en: 'The Supremum Axiom' },
      order: 10,
      summary: {
        ko: String.raw`위로 막힌 집합에서 가장 작은 천장을 찾습니다. 유리수에 없는 그 천장이 실수를 완성합니다.

상한은 집합의 모든 원소보다 크거나 같은 수 중 가장 작은 수입니다. 천장은 많지만 가장 낮은 천장은 하나뿐입니다. 유리수만으로는 그 천장이 없을 때가 있습니다. 실수는 그 빈자리를 메운 세계입니다.

예를 들면, 반 🧑 친구들의 키를 재는 것과 같습니다. 전원보다 크면서 가장 작은 기준선이 상한입니다. 제일 큰 키에 딱 닿는 선이 그 예입니다. 그 선 아래로 모두 들어갑니다.`,
        en: String.raw`Find the smallest ceiling over a bounded set. That ceiling, missing in the rationals, completes the reals.

The supremum is the least of all upper bounds. Ceilings are many, but the lowest one is unique. Rationals sometimes lack that lowest ceiling. The reals are the world where it always exists.

For example, measure every 🧑 classmate's height. The smallest line above them all is the supremum. It touches the tallest height exactly. Everyone fits underneath.`,
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
      id: 'nth-root',
      title: { ko: 'n제곱근의 존재', en: 'Existence of n-th Roots' },
      order: 11,
      summary: {
        ko: String.raw`제곱해서 원하는 수가 되는 점을 상한으로 찾아냅니다. 빈틈을 메우는 공리가 근을 만들어내는 순간입니다.

제곱하면 목표보다 작아지는 수들을 전부 모읍니다. 그 집합의 상한이 바로 찾는 근입니다. 상한보다 작으면 제곱이 모자라고, 크면 넘어갑니다. 그래서 상한의 제곱은 정확히 목표와 같아야 합니다.

예를 들면, 넓이가 2인 정사각형의 한 변을 찾는 것과 같습니다. 변이 1이면 넓이가 모자라고 2이면 넘칩니다. 경계에 딱 맞는 길이가 존재합니다. 그 길이가 루트 2입니다.`,
        en: String.raw`Locate the point whose power hits the target, using a supremum. Watch the gap-filling axiom manufacture a root.

Collect every number whose power stays below the target. The supremum of that set is the root. Below it, powers fall short; above it, they overshoot. So the supremum's power equals the target exactly.

For example, find the side of a square with area two. Side one gives too little area; side two gives too much. One borderline length fits exactly. That length is the square root of two.`,
      },
      tex: [
        String.raw`s = \sup\{x \ge 0 : x^n < a\} \Rightarrow s^n = a`,
        String.raw`\sqrt[n]{a}\ \text{exists and is unique}`,
      ],
      prerequisites: ['supremum'],
      controls: [
        { kind: 'slider', key: 'a', label: { ko: 'a 값', en: 'Value a' }, min: 0.5, max: 8, step: 0.5, init: 2 },
        { kind: 'slider', key: 'n', label: { ko: '제곱근 차수 n', en: 'Root index n' }, min: 2, max: 5, step: 1, init: 2 },
      ],
      problems: nthRootProblems,
    },
    {
      id: 'countable',
      title: { ko: '가산과 비가산', en: 'Countable vs Uncountable' },
      order: 12,
      summary: {
        ko: String.raw`유리수는 한 줄로 번호를 매길 수 있음을 봅니다. 실수는 그 시도가 무너지는 것도 봅니다.

가산이란 자연수와 번호를 짝지을 수 있다는 뜻입니다. 분수는 격자로 늘어놓고 지그재그로 세면 전부 번호를 받습니다. 실수는 다릅니다. 어떤 목록을 만들어도 목록에 없는 실수가 남습니다. 대각선을 따라 숫자를 바꾸는 방법이 그 증거입니다.

예를 들면, 🧑 친구 전원에게 번호표를 나눠 주는 것과 같습니다. 줄이 길어도 한 명씩 번호를 받으면 가산입니다. 그런데 어떤 명단을 만들어도 빠진 사람이 꼭 생긴다면 그 무리는 셀 수 없습니다.`,
        en: String.raw`See the rationals numbered in a single list. Then see the same attempt fail for the reals.

Countable means pairing off with the natural numbers. Fractions tile a grid, and a zigzag count numbers them all. Reals refuse. Every proposed list misses some real. Changing digits along the diagonal proves it.

For example, hand number tickets to every 🧑 classmate. However long the line, one ticket each means countable. If every roster still misses someone, the crowd cannot be counted.`,
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
      id: 'cantor-theorem',
      title: { ko: '칸토어 정리', en: "Cantor's Theorem" },
      order: 13,
      summary: {
        ko: String.raw`어떤 집합도 그 부분집합 전체의 모임보다는 작음을 봅니다. 목록의 대각선을 뒤집어 새 원소를 만듭니다.

멱집합은 부분집합을 전부 모은 집합입니다. 원소가 하나 늘면 부분집합은 두 배로 늘어납니다. 그래서 짝짓기를 시도하면 언제나 남는 쪽이 생깁니다. 대각선을 뒤집은 집합이 바로 그 남는 쪽입니다.

예를 들면, 🧑 친구 3명의 부분집합은 8가지입니다. 세 명보다 부분집합이 훨씬 많습니다. 인원이 늘수록 차이는 벌어지기만 합니다. 무한에서도 이 차이는 사라지지 않습니다.`,
        en: String.raw`See that any set is smaller than the collection of all its subsets. Flip a list's diagonal to build a new element.

The power set collects all subsets. One extra element doubles the subsets. So any attempted pairing leaves leftovers. The diagonal-flipped set is exactly such a leftover.

For example, three 🧑 classmates have eight subsets. Subsets already outnumber the friends. More people only widens the gap. Even infinity keeps the gap.`,
      },
      tex: [
        String.raw`|X| < |\mathcal{P}(X)|`,
        String.raw`D = \{x \in X : x \notin f(x)\} \ne f(y)\ \forall y`,
      ],
      prerequisites: ['countable'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '집합 크기 n', en: 'Set size n' }, min: 3, max: 8, step: 1, init: 5 },
      ],
      problems: cantorTheoremProblems,
    },
    {
      id: 'groups-fields',
      title: { ko: '군과 체', en: 'Groups vs Fields' },
      order: 14,
      summary: {
        ko: String.raw`되돌릴 수 있는 움직임들의 규칙을 표로 확인합니다. 사칙연산이 전부 되는 세계와 비교합니다.

군은 세 가지 약속으로 이루어집니다. 어떻게 묶어도 결과가 같아야 합니다. 아무 일도 안 하는 원소가 있어야 합니다. 모든 움직임에는 되돌리는 움직임이 있어야 합니다. 체는 여기에 나눗셈까지 허용한 세계입니다.

예를 들면, 자전거 페달을 앞으로 돌리는 동작은 뒤로 돌려 되돌릴 수 있습니다. 가만히 있는 것도 하나의 상태입니다. 동작을 이어 붙이면 또 동작이 됩니다. 이 규칙들의 모임이 군입니다.`,
        en: String.raw`Check the rules of reversible moves in a table. Compare with a world where all four operations work.

A group rests on three promises. Grouping must not change results. A do-nothing element must exist. Every move needs an undoing move. A field adds division on top of that.

For example, pedaling a bicycle forward can be undone by pedaling back. Staying still counts as a move too. Chaining moves gives another move. A set of moves obeying these rules is a group.`,
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
      id: 'vector-spaces',
      title: { ko: '벡터공간과 동형', en: 'Vector Spaces and Isomorphism' },
      order: 15,
      summary: {
        ko: String.raw`계수를 움직이면 직선과 점이 함께 움직이는 모습을 봅니다. 겉모습이 다른 공간들이 같은 구조임을 확인합니다.

벡터공간은 더하기와 늘리기·줄이기가 되는 세계입니다. 수의 쌍도, 다항식도, 함수도 같은 규칙을 따릅니다. 규칙이 같으면 두 세계는 사실상 같습니다. 한쪽의 계산을 다른 쪽으로 옮길 수 있기 때문입니다.

예를 들면, 요리 레시피를 카드에 적는 것과 같습니다. 카드의 숫자만 알면 요리를 그대로 재현할 수 있습니다. 직선도 기울기와 절편, 숫자 두 개로 적힙니다. 적은 쪽과 실제 쪽이 한 몸처럼 움직입니다.`,
        en: String.raw`Move the coefficients and watch a line and a point move together. Spaces with different looks share one structure.

A vector space supports adding and scaling. Pairs of numbers, polynomials, and functions all obey the same rules. Same rules means essentially the same world. Calculations transfer from one side to the other.

For example, write a recipe on a card. The card's numbers rebuild the dish exactly. A line, too, is captured by two numbers: slope and intercept. Card and line move as one.`,
      },
      tex: [
        String.raw`(V,+) \text{ abelian over } F,\qquad c(v+w) = cv + cw`,
        String.raw`\Phi: P_2 \to \mathbb{R}^3,\quad a+bx+cx^2 \mapsto (a,b,c)`,
      ],
      prerequisites: ['groups-fields'],
      controls: [
        { kind: 'slider', key: 'a', label: { ko: '계수 a', en: 'Coefficient a' }, min: -2, max: 2, step: 0.1, init: 1 },
        { kind: 'slider', key: 'b', label: { ko: '계수 b', en: 'Coefficient b' }, min: -2, max: 2, step: 0.1, init: 0.5 },
      ],
problems: vectorSpacesProblems,
    },
    {
      id: 'dimension-rank',
      title: { ko: '차원과 랭크', en: 'Dimension and Rank' },
      order: 16,
      summary: {
        ko: String.raw`격자가 행렬에 눌려 펴지는 모습을 봅니다. 사라지는 차원과 남는 차원을 셉니다.

차원은 독립적인 방향의 개수입니다. 행렬을 곱하면 방향들이 겹쳐 눌릴 수 있습니다. 완전히 눌려 사라지는 방향이 핵의 차원입니다. 살아남아 펼치는 범위가 랭크입니다. 둘을 더하면 원래 차원이 됩니다.

예를 들면, 햇빛 아래 그림자는 입체를 평면으로 눌러 보여 줍니다. 높이 방향은 그림자에서 사라집니다. 남는 건 평면 위 방향뿐입니다. 사라진 것과 남은 것을 더하면 원래 차원과 같습니다.`,
        en: String.raw`Watch a grid get squeezed flat by a matrix. Count the dimensions that vanish and those that survive.

Dimension counts independent directions. A matrix can squash directions together. Directions crushed to nothing form the kernel's dimension. Directions still spanning room form the rank. The two add up to the original dimension.

For example, sunlight presses a solid object into a flat shadow. The height direction vanishes in the shadow. Only the flat directions survive. Lost plus surviving equals the original dimension.`,
      },
      tex: [
        String.raw`\dim\ker T + \mathrm{rank}\,T = \dim V`,
        String.raw`\mathrm{rank}\,A = \dim(\text{column space of } A)`,
      ],
      prerequisites: ['vector-spaces'],
      controls: [
        {
          kind: 'select',
          key: 'preset',
          label: { ko: '행렬', en: 'Matrix' },
          options: ['identity', 'rank1', 'projection', 'zero'],
          init: 'identity',
        },
      ],
problems: dimensionRankProblems,
    },
  ],
};
