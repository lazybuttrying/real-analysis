import type { ChapterMeta } from '../../contracts.ts';
import { problems as bolzanoWeierstrassProblems } from '../limits/problems/bolzano-weierstrass';
import { problems as cauchySchwarzProblems } from '../limits/problems/cauchy-schwarz';
import { problems as constructionProblems } from '../limits/problems/construction';
import { problems as epsilonNProblems } from '../limits/problems/epsilon-n';
import { problems as holesProblems } from '../limits/problems/holes';
import { holderProblems } from '../limits/problems/holder';
import { problems as limsupLiminfProblems } from '../limits/problems/limsup-liminf';
import { problems as monotoneCauchyProblems } from '../limits/problems/monotone-cauchy';
import { problems as sequenceSpacesProblems } from '../limits/problems/sequence-spaces';
import { problems as standardLimitsProblems } from '../limits/problems/standard-limits';
import { problems as stolzCesaroProblems } from '../limits/problems/stolz-cesaro';

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
export const sequences: ChapterMeta = {
  id: 'sequences',
  title: { ko: '수열', en: 'Sequences' },
  summary: {
    ko: 'ε-N 논법으로 수열의 수렴을 다루고, 단조·코시 수열과 limsup/liminf의 기술을 익힙니다.',
    en: 'Convergence of sequences via ε-N arguments: monotone and Cauchy sequences, limsup and liminf.',
  },
  scenes: [
    {
      id: 'epsilon-n',
      title: { ko: 'ε-N 극한', en: 'The ε–N Definition' },
      order: 1,
      summary: {
        ko: String.raw`ε 띠를 아무리 좁혀도 어느 순간부터 꼬리가 전부 그 안에 들어갑니다. 그 순간을 확인하는 장면입니다.

수렴한다는 것은 목표값에 한없이 가까워진다는 뜻입니다. 띠를 좁히면 꼬리가 들어가는 시점은 늦어집니다. 그래도 그런 시점이 항상 존재하면 수렴입니다. 정확한 약속은 아래 식과 같습니다.

예를 들면, ⚽ 공을 굴리면 목표 선에 점점 가까이 다가가 멈춥니다. 10cm 안쪽, 1cm 안쪽에 들어오라고 해도 어느 순간부터는 계속 그 안에 머뭅니다.`,
        en: String.raw`Narrow the ε-band as much as you like: from some moment on, the whole tail sits inside it. This scene watches that moment arrive.

Converging means closing in on the target value without end. A narrower band only delays the moment the tail fits inside. As long as that moment always comes, the sequence converges. The exact promise is the formula below.

For example, a ⚽ ball rolled toward a line stops closer and closer to it. Demand it land within 10 cm, then within 1 cm — from some roll on, it always stays inside.`,
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
      id: 'standard-limits',
      title: { ko: '표준 극한: x^n과 x^{1/n}', en: 'Standard Limits: x^n and x^{1/n}' },
      order: 2,
      summary: {
        ko: String.raw`절댓값이 1보다 작은 수의 거듭제곱과 양수의 거듭제곱근을 봅니다. 각각 어디로 모이는지 확인하는 장면입니다.

1보다 작은 수를 계속 곱하면 점점 작아져 0으로 가라앉습니다. 반대로 양수는 거듭제곱근을 거듭하면 1로 모입니다. −1에서는 부호가 번갈아 진동합니다. 절댓값이 1보다 크면 거듭제곱은 끝없이 커집니다. 이 모든 경우를 Bernoulli 부등식 하나로 다룹니다.

예를 들면, 🍰 케이크를 매일 남은 것의 절반만 먹습니다. 남는 양은 절반, 4분의 1, 8분의 1로 줄어서 거의 사라집니다.`,
        en: String.raw`Powers of a number below 1 in absolute value, and roots of a positive number, take the stage. The scene checks where each of them gathers.

Keep multiplying a number below 1 and it sinks toward 0. Take roots of a positive number again and again and it gathers at 1. At −1 the sign just flips back and forth. Beyond 1 in size, powers grow without end. Bernoulli's inequality handles every case.

For example, eat half of the remaining 🍰 cake each day. What is left goes one half, one quarter, one eighth — nearly vanishing.`,
      },
      tex: [
        String.raw`|x|<1 \Rightarrow x^n \to 0`,
        String.raw`x>1 \Rightarrow x^{1/n} \to 1`,
        String.raw`n^{1/n} \to 1`,
      ],
      prerequisites: ['epsilon-n'],
      controls: [
        { kind: 'select', key: 'kind', label: { ko: '수열', en: 'Sequence' }, options: ['power', 'root'], init: 'power' },
        { kind: 'slider', key: 'x', label: { ko: 'x', en: 'x' }, min: -2, max: 2, step: 0.05, init: 0.5 },
        { kind: 'slider', key: 'n', label: { ko: '항의 개수 n', en: 'Terms n' }, min: 1, max: 60, step: 1, init: 20 },
      ],
      problems: standardLimitsProblems,
    },
    {
      id: 'sequence-spaces',
      title: { ko: '수열공간과 함수공간', en: 'Sequence and Function Spaces' },
      order: 3,
      summary: {
        ko: String.raw`수열들을 한곳에 모아 놓은 공간을 봅니다. 수열 하나하나가 이 공간에서는 점이 됩니다.

수열끼리 더하고 곱할 수 있어서 벡터공간입니다. 두 수열 사이의 거리도 잴 수 있습니다. 재는 방법에 따라 들어갈 수 있는 공간이 달라집니다. 절댓값의 합이 유한하면 가장 작은 공간에 들어갑니다. 제곱해서 더한 합이 유한하면 중간 공간입니다. 그냥 유계이면 가장 큰 공간에 들어갑니다. 그래서 작은 공간이 큰 공간 안에 쏙 들어갑니다. 거리를 주는 노름이 두 세계를 잇는 다리입니다. 이 공간들이 완비라는 사실은 알려진 정리로만 언급합니다.

예를 들면, 📦 상자 세 개가 겹쳐 놓여 있습니다. 작은 상자에 든 물건은 중간 상자에도, 큰 상자에도 들어갑니다. 수열 공간도 이렇게 작은 것이 큰 것 안에 포함됩니다.`,
        en: String.raw`Whole sequences get collected into a single space here. Each sequence becomes one point of the space.

Sequences can be added and scaled, so the space is a vector space. The distance between two sequences can also be measured. The measuring rule decides which space a sequence fits into. A finite sum of absolute values fits the smallest space. A finite sum of squares fits the middle one. Merely being bounded fits the largest one. So each smaller space sits inside the bigger ones. The norm behind the distance bridges the two worlds. That these spaces are complete is stated as a known theorem only.

For example, picture three nested 📦 boxes. Anything inside the small box also lies in the middle and the large one. Sequence spaces nest in exactly the same way.`,
      },
      tex: [
        String.raw`\ell^1 = \{x : \sum |x_n| < \infty\}, \quad \ell^2 = \{x : \sum |x_n|^2 < \infty\}, \quad \ell^\infty = \{x : \sup |x_n| < \infty\}`,
        String.raw`\|x\|_1 = \sum |x_n|, \quad \|x\|_2 = \left(\sum |x_n|^2\right)^{1/2}, \quad \|x\|_\infty = \sup_n |x_n|`,
        String.raw`\ell^1 \subset \ell^2 \subset \ell^\infty, \qquad d(x, y) = \|x - y\|`,
      ],
      prerequisites: ['metric-spaces'],
      controls: [
        { kind: 'select', key: 'view', label: { ko: '보기', en: 'View' }, options: ['balls', 'sequence'], init: 'balls' },
        { kind: 'select', key: 'p', label: { ko: '노름 p', en: 'Norm p' }, options: ['1', '2', 'inf'], init: '2' },
        { kind: 'slider', key: 'alpha', label: { ko: '지수 α', en: 'Exponent α' }, min: 0.2, max: 2, step: 0.05, init: 1 },
      ],
problems: sequenceSpacesProblems,
    },
    {
      id: 'cauchy-schwarz',
      title: { ko: '코시-슈바르츠 부등식', en: 'Cauchy\u2013Schwarz Inequality' },
      order: 4,
      summary: {
        ko: String.raw`두 벡터의 내적이 얼마나 커질 수 있는지 봅니다. 내적은 두 노름의 곱을 절대 넘지 못합니다.

내적은 한 벡터가 다른 벡터 방향으로 얼마나 겹치는지 잽니다. 두 벡터가 나란할 때 겹침이 가장 큽니다. 어긋날수록 겹침은 노름의 곱보다 작아집니다. 증명은 길이가 음수가 될 수 없다는 사실에서 출발합니다. 그 식을 판별식으로 읽으면 부등식이 떨어집니다. 등호는 두 벡터가 평행할 때만 성립합니다.

예를 들면, ✏️ 연필에 빛을 비추면 그림자는 연필보다 길어지지 않습니다. 연필이 빛 방향과 나란할 때만 그림자가 연필만큼 길어집니다.`,
        en: String.raw`How large can the inner product of two vectors become? It can never exceed the product of the two norms.

The inner product measures how much one vector overlaps the other's direction. The overlap is largest when the two vectors point the same way. Tilt them apart and the overlap falls below the product of the norms. The proof starts from one fact: a length is never negative. Reading that fact as a discriminant drops the inequality out. Equality holds only when the two vectors are parallel.

For example, shine a light on a ✏️ pencil and its shadow is never longer than the pencil. Only when the pencil lines up with the light does the shadow match its full length.`,
      },
      tex: [
        String.raw`|\langle x,y\rangle| \le \|x\|\,\|y\|`,
        String.raw`\|x+y\| \le \|x\|+\|y\|`,
      ],
      prerequisites: ['sequence-spaces'],
      controls: [
        { kind: 'slider', key: 'angle', label: { ko: '각도 θ', en: 'Angle θ' }, min: 0, max: Math.PI * 2, step: Math.PI / 180, init: 0 },
        { kind: 'toggle', key: 'showProjection', label: { ko: '정사영 표시', en: 'Show projection' }, init: true },
      ],
      problems: cauchySchwarzProblems,
    },
    {
      id: 'holder',
      title: { ko: '횔더 부등식', en: 'Hölder’s Inequality' },
      order: 5,
      summary: {
        ko: String.raw`코시-슈바르츠를 일반 지수로 넓힌 부등식을 봅니다. 두 지수가 서로 짝을 이루는 것이 핵심입니다.

두 수열을 항끼리 곱해 더한 값에도 천장이 있습니다. 그 천장은 각 수열의 노름을 곱한 값입니다. 지수가 둘 다 2이면 코시-슈바르츠와 똑같아집니다. 증명의 열쇠는 곱을 합의 지분으로 바꾸는 영 부등식입니다. 자세한 식은 아래에 있습니다.

예를 들면, 🏪 가게에서 물건마다 가격과 개수를 곱해 모두 더하면 총액이 됩니다. 이 총액은 가격 목록과 개수 목록의 크기를 곱한 값을 넘지 않습니다.`,
        en: String.raw`This scene widens Cauchy–Schwarz to general exponents. The key is that the two exponents come as a matched pair.

Multiply two sequences term by term and add them up: even that total has a ceiling. The ceiling is the product of the two sequences' norms. With both exponents equal to 2, it is exactly Cauchy–Schwarz. The key step is Young's inequality, which trades a product for shares of a sum. The precise formulas are below.

For example, at a 🏪 shop you multiply each item's price by its quantity and add everything up. That total never exceeds the product of the price list's size and the quantity list's size.`,
      },
      tex: [
        String.raw`\sum_{k=1}^{n} |a_k b_k| \le \left(\sum_{k=1}^{n} |a_k|^p\right)^{1/p} \left(\sum_{k=1}^{n} |b_k|^q\right)^{1/q}`,
        String.raw`ab \le \frac{a^p}{p} + \frac{b^q}{q} \quad \text{(Young)}`,
      ],
      prerequisites: ['cauchy-schwarz'],
      controls: [
        { kind: 'slider', key: 'p', label: { ko: '지수 p', en: 'Exponent p' }, min: 1.1, max: 8, step: 0.1, init: 2 },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Terms n' }, min: 2, max: 30, step: 1, init: 8 },
      ],
      problems: holderProblems,
    },
    {
      id: 'holes',
      title: { ko: '유리수의 구멍', en: 'Why ℝ Has No Holes' },
      order: 6,
      summary: {
        ko: String.raw`유리수만으로 만든 수열이 유리수가 아닌 곳으로 다가갑니다. 유리수 세계에 구멍이 있다는 것을 보여 주는 장면입니다.

반복 식은 추측값의 오차를 매번 반으로 접어 고칩니다. 항은 전부 유리수입니다. 그런데 다가가는 목적지는 유리수가 아닙니다. 그래서 유리수만으로는 그 자리를 채울 수 없습니다. 무리수라는 엄밀한 증명은 건너뛰고 아이디어만 봅니다.

예를 들면, 📏 자로 정사각형의 대각선 길이를 재어 봅니다. 1.4, 1.41, 1.414처럼 자릿수를 늘려도 분수로는 딱 맞지 않습니다. 그 자리가 바로 유리수의 구멍입니다.`,
        en: String.raw`A sequence built only from rationals creeps toward a place that is not rational. The scene shows the hole in the rational world.

The iteration halves the error of each guess. Every term stays rational. Yet the destination is not a rational number. So rationals alone cannot fill that spot. The full irrationality proof is skipped; only the idea is shown.

For example, measure the diagonal of a square with a 📏 ruler. Try 1.4, then 1.41, then 1.414 — no fraction ever fits it exactly. That spot is the hole in the rationals.`,
      },
      tex: [String.raw`x_{n+1}=\frac{x_n+2/x_n}{2}\to\sqrt{2}`, String.raw`\sqrt{2}\notin\mathbb{Q}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '반복 횟수 n', en: 'Iterations n' }, min: 0, max: 8, step: 1, init: 4 }],
problems: holesProblems,
    },
    {
      id: 'construction',
      title: { ko: '실수의 구성', en: 'Construction of the Real Numbers' },
      order: 7,
      summary: {
        ko: String.raw`유리수의 구멍을 메워 실수를 실제로 만드는 장면입니다. 실수 하나를 유리수 수열들의 묶음으로 정의합니다.

소수점 자릿수를 늘려 가면 유리수 항들이 구멍으로 모여듭니다. 서로의 차이가 사라지는 수열들은 같은 수로 취급합니다. 그 묶음 자체가 하나의 실수입니다. 이렇게 만들면 구멍이 없는 수직선이 완성됩니다. 완비성은 바로 이 구성에서 얻어집니다.

예를 들면, 🪜 계단을 한 칸씩 오르면 꼭대기에 가까워집니다. 1, 1.4, 1.41, 1.414는 꼭대기를 향한 발자국들입니다. 발자국의 행렬 전체가 곧 목적지인 실수입니다.`,
        en: String.raw`The hole in the rationals gets filled and a real number is actually built. One real number is defined as a bundle of rational sequences.

Lengthen the decimal expansion and the rational terms march into the hole. Sequences whose difference vanishes count as the same number. That bundle itself is one real number. Built this way, the number line ends up with no holes. Completeness is exactly what this construction buys.

For example, climb a 🪜 staircase one step at a time toward the top. The numbers 1, 1.4, 1.41, 1.414 are footprints heading upward. The whole parade of footprints is the destination itself: the real number.`,
      },
      tex: [
        String.raw`(x_n) \sim (y_n) \iff x_n - y_n \to 0`,
        String.raw`\sqrt{2} = [(1, 1.4, 1.41, 1.414, \dots)]`,
      ],
      prerequisites: ['holes'],
      controls: [
        { kind: 'select', key: 'seq', label: { ko: '수열', en: 'Sequence' }, options: ['decimal', 'newton'], init: 'decimal' },
        { kind: 'slider', key: 'n', label: { ko: '항의 개수 n', en: 'Terms n' }, min: 1, max: 6, step: 1, init: 4 },
      ],
problems: constructionProblems,
    },
    {
      id: 'bolzano-weierstrass',
      title: { ko: '볼차노–바이어슈트라스', en: 'A Convergent Subsequence Always Hides Inside' },
      order: 8,
      summary: {
        ko: String.raw`유계수열 속에는 항상 수렴하는 부분수열이 숨어 있습니다. 구간을 반으로 접어 그 부분수열을 찾아내는 장면입니다.

비법은 구간을 계속 반으로 접는 것입니다. 점이 무한히 많이 모이는 쪽을 따라갑니다. 접을수록 구간은 좁아집니다. 그 안에 갇힌 점들은 하나의 값으로 모여듭니다. 그 점들을 이으면 수렴하는 부분수열이 됩니다.

예를 들면, 🧑 친구 서른 명이 운동장에 흩어져 있습니다. 운동장을 반으로 나누면 어느 한쪽에 친구가 몰려 있습니다. 그쪽만 계속 반으로 나누면 결국 한 지점으로 좁혀집니다.`,
        en: String.raw`Every bounded sequence hides a convergent subsequence inside it. This scene finds that subsequence by halving the interval.

The trick is to keep halving the interval. Always follow the half that holds infinitely many terms. Each halving makes the interval narrower. The points trapped inside pile onto a single value. Stringing those points together gives a convergent subsequence.

For example, thirty 🧑 classmates scatter across a playground. Split the playground in half and one side still holds a crowd of them. Keep halving that side and you corner a single spot.`,
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
      order: 9,
      summary: {
        ko: String.raw`증가하면서 위로 막힌 수열이 꼭대기에 닿는 장면입니다. 꼬리가 한 점으로 조여드는 모습도 함께 봅니다.

위로 막혀 있으면 갈 곳은 가장 높은 자리뿐입니다. 그 자리가 상한이고 수열은 상한에 수렴합니다. 꼬리만 잘라 보면 남은 항들의 퍼짐이 점점 줄어듭니다. 퍼짐이 0으로 사라지는 수열이 코시수열입니다. 수렴하는 수열은 전부 코시수열입니다.

예를 들면, 🐷 저금통에 목표액의 절반, 남은 절반의 절반을 계속 넣습니다. 쌓인 돈은 목표에 점점 가까워지지만 한 번에 닿지는 않습니다. 뒤에 넣은 동전들끼리의 차이도 점점 작아집니다.`,
        en: String.raw`An increasing sequence blocked from above climbs to the very top. The scene also watches the tail squeeze into a single point.

Bounded above, the sequence has nowhere to go but its highest allowed spot. That spot is the supremum, and the sequence converges to it. Cut to the tail and the remaining terms spread less and less. A sequence whose spread dies to 0 is a Cauchy sequence. Every convergent sequence is Cauchy.

For example, drop coins into a 🐷 piggy bank: half the goal, then half of what remains, and so on. The total creeps toward the goal without ever jumping to it. The coins added later also differ from each other less and less.`,
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
      id: 'limsup-liminf',
      title: { ko: '상극한과 하극한', en: 'Lim sup and Lim inf' },
      order: 10,
      summary: {
        ko: String.raw`수열의 꼬리만 보고 가장 높은 값과 가장 낮은 값을 살핍니다. 둘이 어디에 안착하는지 확인하는 장면입니다.

꼬리의 상한은 점점 내려오고 하한은 점점 올라옵니다. 위쪽 안착점이 상극한, 아래쪽이 하극한입니다. 두 값이 만나면 극한이 존재합니다. 진동하는 수열에서는 둘이 영원히 떨어져 있습니다. 정확한 정의는 아래 식과 같습니다.

예를 들면, 🌡️ 온도계로 매일 최고 온도와 최저 온도를 적습니다. 날이 갈수록 최고값은 한 값 근처로, 최저값은 다른 값 근처로 모입니다. 두 값이 같아지면 날씨가 한 온도로 정해진 셈입니다.`,
        en: String.raw`Watch only the tails of a sequence and track their highest and lowest values. The scene checks where the two of them settle.

The supremum of the tails keeps stepping down, and the infimum keeps stepping up. The upper settling point is the lim sup, the lower one the lim inf. If the two meet, the limit exists. An oscillating sequence keeps them apart forever. The precise definitions are the formulas below.

For example, record each day's high and low temperature with a 🌡️ thermometer. As days pass, the highs gather near one value and the lows near another. If the two values coincide, the weather has settled on a single temperature.`,
      },
      tex: [
        String.raw`\limsup a_n = \lim_{N\to\infty}\sup_{n\ge N} a_n`,
        String.raw`\liminf a_n = \lim_{N\to\infty}\inf_{n\ge N} a_n`,
        String.raw`\limsup a_n = \liminf a_n \iff \lim a_n \text{ exists}`,
      ],
      prerequisites: ['monotone-cauchy'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항 개수', en: 'Terms shown' }, min: 2, max: 60, step: 1, init: 24 },
      ],
      problems: limsupLiminfProblems,
    },
    {
      id: 'stolz-cesaro',
      title: { ko: '체자로 정리', en: 'Stolz–Cesàro Theorem' },
      order: 11,
      summary: {
        ko: String.raw`전체 비율이 버거울 때 차분의 비율로 우회하는 장면입니다. 수열 버전의 로피탈 정리입니다.

한 걸음의 증가량끼리 비교하면 그 비율이 먼저 자리를 잡습니다. 전체 비율은 그 뒤를 천천히 따라갑니다. 분모 수열은 엄격히 증가하며 끝없이 커져야 합니다. 두 비율의 목적지는 같습니다. 대표 예의 극한은 아래 두 번째 식과 같습니다.

예를 들면, 🚗 자동차 여행에서 마지막 1분의 속도가 시속 60km로 안정됩니다. 그러면 전체 구간의 평균 속도도 결국 시속 60km 쪽으로 끌려갑니다.`,
        en: String.raw`When the full ratio is stubborn, this scene detours through the ratio of differences. It is the sequence version of l'Hôpital's rule.

Compare the growth of single steps, and that ratio settles first. The full ratio follows slowly from behind. The denominator must increase strictly and grow without bound. Both ratios share the same destination. The headline example's limit is the second formula below.

For example, on a 🚗 car trip the speed over the last minute settles at 60 km/h. Then the average speed over the whole trip gets dragged toward 60 km/h as well.`,
      },
      tex: [
        String.raw`\lim \frac{a_{n+1}-a_n}{b_{n+1}-b_n} = L \implies \lim \frac{a_n}{b_n} = L`,
        String.raw`\lim_{n\to\infty}\frac{1^2+\cdots+n^2}{n^3} = \frac{1}{3}`,
      ],
      prerequisites: ['limsup-liminf', 'monotone-cauchy'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항 개수', en: 'Terms shown' }, min: 10, max: 300, step: 1, init: 60 },
      ],
      problems: stolzCesaroProblems,
    },
  ],
};
