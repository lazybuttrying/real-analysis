import type { ChapterMeta } from '../../contracts.ts';
import { condensationProblems } from './problems/condensation';
import { eulerMascheroniProblems } from './problems/euler-mascheroni';
import { eulerProductProblems } from './problems/euler-product';
import { kummerTestProblems } from './problems/kummer-test';
import { problems as abelTestProblems } from './problems/abel-test';
import { problems as baselProblems } from './problems/basel';
import { problems as dirichletTestProblems } from './problems/dirichlet-test';
import { doubleSeriesProblems } from './problems/double-series';
import { problems as geometricProblems } from './problems/geometric';
import { problems as grandiProblems } from './problems/grandi';
import { problems as harmonicProblems } from './problems/harmonic';
import { integralTestProblems } from './problems/integral-test';
import { problems as leibnizProblems } from './problems/leibniz';
import { problems as raabeTestProblems } from './problems/raabe-test';
import { problems as stirlingProblems } from './problems/stirling';
import { problems as telescopingProblems } from './problems/telescoping';
import { problems as testsProblems } from './problems/tests';
import { problems as wallisProblems } from './problems/wallis';

/**
 * Pure data. Imports types plus per-scene problems data modules
 * (./problems/* — data only, no code, models, views, or shell). Node build scripts and every chapter's navigation read
 * this file. Every text is stored per language; the shell picks one via the
 * URL language segment. Summaries embed math as inline TeX between \( and \)
 * (see splitInlineMath in contracts.ts).
 *
 * NOTE (10-chapter split): this is a LOGICAL chapter. The scene files
 * (models/, scenes/, problems/) live in the legacy scene stores
 * src/chapters/{limits,series,calculus}/ and are referenced here via
 * relative paths. See docs/ARCHITECTURE.md ("Physical vs logical chapters").
 */
export const series: ChapterMeta = {
  id: 'series',
  title: { ko: '급수', en: 'Series' },
  summary: {
    ko: '무한급수의 수렴과 발산을 부분합의 움직임으로 확인하고, 수렴 판정 도구들을 익힙니다.',
    en: 'Watch infinite series converge or diverge through their partial sums, and master the convergence tests.',
  },
  sections: [
    { id: 'famous-series', title: { ko: '유명한 급수들', en: 'Famous Series' }, sceneIds: ['harmonic', 'euler-mascheroni', 'basel', 'euler-product', 'leibniz'] },
    { id: 'tests-1', title: { ko: '판정법 1부', en: 'Convergence Tests, Part 1' }, sceneIds: ['tests', 'integral-test', 'raabe-test', 'kummer-test', 'condensation'] },
    { id: 'computing-series', title: { ko: '급수의 계산', en: 'Computing Series' }, sceneIds: ['telescoping', 'geometric', 'wallis', 'stirling', 'grandi'] },
    { id: 'tests-2', title: { ko: '판정법 2부와 이중급수', en: 'Convergence Tests, Part 2, and Double Series' }, sceneIds: ['dirichlet-test', 'abel-test', 'double-series'] },
  ],
  scenes: [
    {
      id: 'harmonic',
      title: { ko: '조화급수의 발산', en: 'The Harmonic Series Diverges' },
      order: 1,
      summary: {
        ko: String.raw`항이 0으로 줄어드는데도 부분합이 끝없이 커지는 장면입니다. 다만 커지는 속도는 아주 느립니다.

항 하나하나는 작아져도 쌓이는 양은 계속 늘어납니다. 부분합은 로그 곡선을 따라 위로 올라갑니다. 항이 0으로 간다고 급수가 수렴하는 것은 아닙니다. 이 급수가 바로 그 반례의 대표입니다.

예를 들면, 🍬 사탕을 한 개, 반 개, 3분의 1개씩 계속 쌓습니다. 조각은 점점 작아지는데 쌓인 높이는 어떤 천장을 주어도 결국 넘어섭니다.`,
        en: String.raw`The terms shrink to 0, yet the partial sums grow without end. The growth is just extremely slow.

Each single term is tiny, but the pile keeps rising. The partial sums climb upward along a logarithm curve. Terms tending to 0 do not guarantee that a series converges. This series is the classic counterexample.

For example, stack 🍬 candy pieces of one, a half, a third of a piece, and so on. The pieces keep shrinking, yet the pile eventually rises past any ceiling you name.`,
      },
      tex: [String.raw`S_n=\sum_{k=1}^{n}\frac{1}{k}`, String.raw`S_n=\ln n+\gamma+o(1)`],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 100000, step: 1, init: 1000 },
        { kind: 'toggle', key: 'logX', label: { ko: 'x축 로그 눈금', en: 'Logarithmic x-axis' }, init: true },
      ],
problems: harmonicProblems,
    },
    {
      id: 'euler-mascheroni',
      title: { ko: '오일러-마스케로니 상수', en: 'The Euler\u2013Mascheroni Constant' },
      order: 2,
      summary: {
        ko: String.raw`둘 다 발산하는 두 양의 차이가 한 값으로 안착하는 장면입니다. 그 차이가 오일러-마스케로니 상수입니다.

조화수와 로그는 둘 다 끝없이 커집니다. 그런데 둘 사이의 간격은 점점 좁혀져 한 값에 멈춥니다. 간격이 멈추는 이유는 간격의 증가분이 수렴하는 급수를 이루기 때문입니다. 그 비밀은 아래 두 번째 식에 있습니다.

예를 들면, 🧑 두 친구가 나란히 달립니다. 둘 다 끝없이 멀어지지만 둘 사이의 거리는 5미터쯤에서 더 벌어지지 않습니다. 멈춰 선 그 거리가 바로 이 상수와 같은 존재입니다.`,
        en: String.raw`Two quantities both diverge, yet the gap between them settles at one value. That gap is the Euler–Mascheroni constant.

The harmonic numbers and the logarithm both grow without end. Still, the space between them narrows and comes to a stop. The gap stops because its increments form a convergent series. That secret is the second formula below.

For example, two 🧑 friends run side by side. Both run endlessly far, but the distance between them stops growing at about 5 meters. That settled distance plays the role of this constant.`,
      },
      tex: [
        String.raw`\gamma = \lim_{n\to\infty}(H_n - \ln n) \approx 0.5772`,
        String.raw`\gamma = \sum_{n\ge1}\left(\frac1n - \ln\!\left(1+\frac1n\right)\right)`,
      ],
      prerequisites: ['harmonic'],
      controls: [
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 200, step: 1, init: 50 },
      ],
      problems: eulerMascheroniProblems,
    },
    {
      id: 'basel',
      title: { ko: '바젤 문제', en: 'The Basel Problem' },
      order: 3,
      summary: {
        ko: String.raw`제곱의 역수를 쌓은 계단이 어떤 평면에 한없이 다가가는 장면입니다. 그 평면의 높이가 바로 유명한 답입니다.

부분합의 계단은 올라갈수록 한 걸음이 작아집니다. 그래서 어떤 높이를 향해 모여듭니다. 그 높이에 원주율이 숨어 있다는 것이 놀라운 점입니다. 왜 원주율이 나타나는지는 아이디어 수준에서만 짚습니다.

예를 들면, 📦 상자를 벽에 그은 선 아래로 차곡차곡 쌓습니다. 상자가 점점 작아져서 선에 닿지는 않아도 눈으로 구분이 안 될 만큼 바짝 다가갑니다.`,
        en: String.raw`A staircase of reciprocal squares climbs toward one flat plane. The height of that plane is the famous answer.

Each new step of the partial sums is smaller than the one before. So the staircase piles up toward a definite height. The surprise is that π hides inside that height. Why π appears at all is only sketched at the idea level.

For example, stack 📦 boxes under a line drawn on a wall. The boxes shrink until the stack creeps so close to the line that your eye cannot see the gap.`,
      },
      tex: [String.raw`\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 14 }],
problems: baselProblems,
    },
    {
      id: 'euler-product',
      title: { ko: '오일러 곱 공식', en: 'The Euler Product' },
      order: 4,
      summary: {
        ko: String.raw`급수를 체로 걸러 소수만 남기는 장면입니다. 합으로 쓴 식이 소수 전체에 대한 곱과 같아집니다.

짝수 항을 지우는 인자를 곱하면 짝수가 사라집니다. 3의 배수를 지우는 인자를 곱하면 그것도 사라집니다. 소수마다 한 번씩 걸러내면 소수에 대한 정보만 남습니다. 처음 몇 개 소수의 곱만으로도 답에 바짝 다가갑니다.

예를 들면, 🍬 사탕에 1부터 번호를 붙여 늘어놓습니다. 짝수 번호를 치우고 3의 배수를 치우면 소수 번호만 남습니다. 체로 거르는 이 과정이 곱 공식을 만듭니다.`,
        en: String.raw`A series gets sieved until only the primes remain. The sum turns out to equal a product over all primes.

Multiply by the factor that erases the even terms, and the evens vanish. Multiply by the factor for multiples of 3, and those vanish too. Sieve once for each prime and only prime information survives. Even the product over the first few primes already lands close to the answer.

For example, line up 🍬 candies numbered from 1 onward. Remove the even numbers, then the multiples of 3, and only prime numbers stay. This sieving is what builds the product formula.`,
      },
      tex: [
        String.raw`\zeta(s) = \sum_{n=1}^{\infty}\frac{1}{n^s} = \prod_{p\ \mathrm{prime}}\frac{1}{1-p^{-s}} \qquad (s > 1)`,
        String.raw`\prod_p\frac{1}{1-p^{-2}} = \frac{\pi^2}{6}`,
      ],
      prerequisites: ['basel'],
      controls: [{ kind: 'slider', key: 'k', label: { ko: '소수 개수 k', en: 'Prime count k' }, min: 1, max: 15, step: 1, init: 6 }],
problems: eulerProductProblems,
    },
    {
      id: 'leibniz',
      title: { ko: '라이프니츠 급수', en: 'Leibniz Series' },
      order: 5,
      summary: {
        ko: String.raw`부분합이 목표값을 번갈아 넘고 밑돌며 조여드는 장면입니다. 양쪽에서 좁혀 오는 샌드위치와 같습니다.

한 항을 더하면 목표를 지나치고 다음 항에서 되돌아옵니다. 왔다 갔다 하는 폭은 점점 줄어듭니다. 그래서 목표는 이웃한 두 부분합 사이에 항상 끼어 있습니다. 그 간격이 곧 오차의 상한입니다.

예를 들면, ⚽ 공이 선을 넘어갔다가 돌아오기를 반복합니다. 넘치는 거리는 매번 짧아집니다. 공은 결국 선 위에 멈출 수밖에 없습니다.`,
        en: String.raw`The partial sums overshoot the target, then undershoot it, closing in from both sides. It is a sandwich that keeps tightening.

Add one term and you jump past the target; the next term pulls you back. The back-and-forth swing shrinks every time. So the target always sits between two neighboring partial sums. That gap is exactly the error bound.

For example, a ⚽ ball rolls past a line, comes back, and crosses it again. Each crossing overshoots by less than the one before. The ball has no choice but to settle on the line.`,
      },
      tex: [
        String.raw`\frac{\pi}{4}=1-\frac{1}{3}+\frac{1}{5}-\frac{1}{7}+\cdots`,
        String.raw`\left|S_N-\frac{\pi}{4}\right|\le\frac{1}{2N+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 60, step: 1, init: 12 }],
problems: leibnizProblems,
    },
    {
      id: 'tests',
      title: { ko: '수렴 판정법 도구상자', en: 'Convergence Tests Toolbox' },
      order: 6,
      summary: {
        ko: String.raw`급수가 수렴하는지 가리는 도구상자를 여는 장면입니다. 대표적인 도구 두 개를 직접 써 봅니다.

첫째는 이웃한 항의 비율을 보는 판정법입니다. 비율이 1보다 작은 값에 안착하면 항이 빠르게 줄어 수렴합니다. 둘째는 옆 급수와 견주는 비교 판정법입니다. 수렴하는 큰 급수 아래에 깔리면 같이 수렴합니다. 두 도구의 식은 아래에 있습니다.

예를 들면, 🍬 사탕을 매일 전날의 절반씩 나눠 줍니다. 주는 양이 일정한 비율로 줄면 나눠 준 전체 양은 유한합니다. 비율이 줄지 않으면 나눠 주기가 끝나지 않습니다.`,
        en: String.raw`This scene opens the toolbox for deciding whether a series converges. Two representative tools get used directly.

The first tool watches the ratio of neighboring terms. If the ratio settles below 1, the terms shrink fast enough to converge. The second tool compares against a neighboring series. Anything tucked under a convergent series converges along with it. Both tools' formulas are below.

For example, hand out 🍬 candies each day, always half of yesterday's amount. When the amounts shrink by a fixed ratio, the total handed out stays finite. If the ratio refuses to shrink, the handing out never ends.`,
      },
      tex: [
        String.raw`r_k=\frac{a_{k+1}}{a_k}\to L<1\ \Rightarrow\ \sum a_k\ \text{converges}`,
        String.raw`\frac{1}{k^2+1}<\frac{1}{k^2},\quad\sum_{k=1}^{\infty}\frac{1}{k^2}=\frac{\pi^2}{6}`,
      ],
      prerequisites: ['leibniz'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '급수', en: 'Series' }, options: ['factorial', 'n-over-2n', 'inv-square-plus'], init: 'factorial' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 30, step: 1, init: 12 },
      ],
problems: testsProblems,
    },
    {
      id: 'integral-test',
      title: { ko: '적분 판정법', en: 'The Integral Test' },
      order: 7,
      summary: {
        ko: String.raw`급수를 적분과 포개어 운명을 함께 묶는 장면입니다. 막대들이 곡선을 위아래로 감쌉니다.

감소하는 곡선 아래에 막대를 세우면 합이 적분을 앞뒤로 감쌉니다. 그래서 급수와 적분은 수렴과 발산을 함께합니다. 지수가 1을 넘으면 수렴하고 그렇지 않으면 발산합니다. 이 갈림길이 모든 p-급수의 운명을 결정합니다.

예를 들면, 📚 책을 경사면에 계단처럼 쌓습니다. 계단은 곡선 아래로 들어가기도 하고 위로 나오기도 합니다. 그래도 계단의 넓이와 곡선 아래 넓이는 함께 유한하거나 함께 끝없이 큽니다.`,
        en: String.raw`A series and an integral get stacked together and share one fate. The bars wrap the curve from above and below.

Stand bars under a decreasing curve, and the sum traps the integral from both sides. So the series and the integral converge or diverge together. An exponent above 1 gives convergence; anything else diverges. That fork decides the fate of every p-series.

For example, stack 📚 books like steps against a ramp. The steps dip below the ramp's curve and poke above it. Still, the steps' area and the area under the curve are finite together or endless together.`,
      },
      tex: [
        String.raw`\int_1^{N+1} f \le \sum_{n=1}^{N} f(n) \le f(1) + \int_1^{N+1} f`,
        String.raw`\sum \frac{1}{n^p} \text{ converges} \iff p > 1`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'slider', key: 'p', label: { ko: '지수 p', en: 'Exponent p' }, min: 1, max: 3, step: 0.1, init: 2 },
        { kind: 'slider', key: 'N', label: { ko: '항 수 N', en: 'Terms N' }, min: 5, max: 40, step: 1, init: 12 },
      ],
      problems: integralTestProblems,
    },
    {
      id: 'raabe-test',
      title: { ko: '라베 판정법', en: "Raabe's Test" },
      order: 8,
      summary: {
        ko: String.raw`비율 판정법이 항복하는 자리에서 한 단계 더 깊이 파는 장면입니다. 비율이 1로 붙어 버릴 때 쓰는 도구입니다.

비율이 1에 가까워지는 속도까지 재면 판정이 살아납니다. 그 속도를 재는 양이 아래 첫 번째 식입니다. 이 양이 1보다 위에 안착하면 수렴입니다. 1보다 아래에 안착하면 발산입니다.

예를 들면, 📏 자의 눈금이 굵어서 두 길이를 가리지 못하는 때가 있습니다. 눈금이 촘촘한 자로 바꾸면 비로소 길이가 갈립니다. 라베 판정법이 바로 그 촘촘한 자입니다.`,
        en: String.raw`Where the ratio test surrenders, this scene digs one level deeper. It is the tool for ratios that stick to 1.

Measure how fast the ratio approaches 1, and the verdict revives. The quantity doing the measuring is the first formula below. If it settles above 1, the series converges. If it settles below 1, the series diverges.

For example, a coarse 📏 ruler sometimes cannot separate two lengths. Switch to a ruler with finer marks, and the lengths finally split apart. Raabe's test is that finer ruler.`,
      },
      tex: [
        String.raw`L=\lim_{n\to\infty}n\left(\frac{a_n}{a_{n+1}}-1\right)`,
        String.raw`L>1\Rightarrow\sum a_n\ \text{converges},\quad L<1\Rightarrow\ \text{diverges}`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['central', 'log'], init: 'central' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Terms n' }, min: 10, max: 500, step: 10, init: 100 },
      ],
problems: raabeTestProblems,
    },
    {
      id: 'kummer-test',
      title: { ko: '쿰머 판정법', en: "Kummer's Test" },
      order: 9,
      summary: {
        ko: String.raw`여러 판정법을 하나로 묶는 큰 틀을 보는 장면입니다. 보조수열 하나가 판정법의 종류를 바꿉니다.

비율에 가중치를 실어 새로운 양을 만듭니다. 그 양의 부호가 수렴과 발산을 가릅니다. 가중치를 전부 1로 두면 비율 판정법이 됩니다. 가중치를 항 번호로 두면 라베 판정법이 됩니다. 자세한 식은 아래에 있습니다.

예를 들면, ⚙️ 기계의 다이얼을 돌리면 검사 강도가 달라집니다. 한쪽 위치에서는 약한 검사, 다른 위치에서는 강한 검사가 됩니다. 보조수열이 바로 그 다이얼입니다.`,
        en: String.raw`One big frame unifies several convergence tests in this scene. A single auxiliary sequence switches which test you get.

Weight the ratio to build a new quantity. The sign of that quantity decides convergence or divergence. Set every weight to 1 and you get the ratio test. Set the weights to the term index and you get Raabe's test. The precise formulas are below.

For example, turn a dial on a ⚙️ machine and the inspection strength changes. One position gives a weak check, another position a strong one. The auxiliary sequence is that dial.`,
      },
      tex: [
        String.raw`K_n := p_n\frac{a_n}{a_{n+1}} - p_{n+1} \ge c > 0 \ \Rightarrow\ \sum a_n\ \text{converges}`,
        String.raw`K_n \le 0,\ \sum\frac{1}{p_n} = \infty \ \Rightarrow\ \sum a_n\ \text{diverges}`,
      ],
      prerequisites: ['raabe-test', 'tests'],
      controls: [
        { kind: 'select', key: 'pKind', label: { ko: 'p_n', en: 'p_n' }, options: ['p1', 'pn', 'pnlogn'], init: 'pn' },
        { kind: 'select', key: 'aSel', label: { ko: '매개변수 a', en: 'Parameter a' }, options: ['a2', 'ahalf'], init: 'a2' },
        { kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Terms n' }, min: 10, max: 500, step: 10, init: 100 },
      ],
problems: kummerTestProblems,
    },
    {
      id: 'condensation',
      title: { ko: '코시 응축 판정법', en: 'Cauchy Condensation Test' },
      order: 10,
      summary: {
        ko: String.raw`항들을 두 배씩 커지는 블록으로 묶어 보는 장면입니다. 묶은 급수와 원래 급수가 운명을 같이합니다.

감소하는 수열에서는 한 블록 안의 항들이 서로 비슷합니다. 그래서 블록 합은 대표 항 하나로 위아래를 묶을 수 있습니다. 블록을 대표 항으로 압축해도 수렴 여부는 그대로입니다. 판정이 훨씬 쉬운 급수로 바뀌는 셈입니다.

예를 들면, 🍬 사탕을 상자에 1개, 2개, 4개씩 두 배로 담습니다. 상자마다 대표 사탕 하나로 크기를 가늠해도 전체가 유한한지는 바뀌지 않습니다.`,
        en: String.raw`Terms get grouped into blocks that double in size here. The grouped series and the original share their fate.

For a decreasing sequence, the terms inside one block all look alike. So each block sum is trapped between multiples of one representative term. Compressing each block into its representative leaves convergence unchanged. The test becomes far easier to run.

For example, pack 🍬 candies into boxes of 1, 2, 4, doubling each time. Judging each box by one representative candy does not change whether the total is finite.`,
      },
      tex: [
        String.raw`2^n a_{2^{n+1}} \le \sum_{k=2^n}^{2^{n+1}-1} a_k \le 2^n a_{2^n}`,
        String.raw`\sum_{n\ge 1}\frac{1}{n^p}\ \text{converges} \iff p>1`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'select', key: 'series', label: { ko: '수열', en: 'Sequence' }, options: ['inv-n', 'inv-n2', 'inv-n-logn'], init: 'inv-n' },
        { kind: 'slider', key: 'block', label: { ko: '블록 번호 n', en: 'Block index n' }, min: 0, max: 6, step: 1, init: 2 },
      ],
      problems: condensationProblems,
    },
    {
      id: 'telescoping',
      title: { ko: '망원급수', en: 'Telescoping Series' },
      order: 11,
      summary: {
        ko: String.raw`항을 쪼개면 이웃끼리 서로 지워지는 장면입니다. 남는 것은 맨 처음과 사라져 가는 꼬리뿐입니다.

각 항은 두 분수의 차이로 갈라집니다. 앞 항의 뒤쪽과 뒤 항의 앞쪽이 똑같아서 사라집니다. 지워지고 나면 처음의 1만 남습니다. 꼬리는 점점 작아져 끝내 사라집니다. 그래서 전체 합은 정확히 1입니다.

예를 들면, 🪜 계단을 한 칸 오르고 한 칸 내려오면 제자리입니다. 오르내림이 줄줄이 이어지면 처음 위치와 마지막 위치만 남습니다.`,
        en: String.raw`Split each term and the neighbors erase each other in this scene. Only the very first piece and a vanishing tail survive.

Each term breaks into a difference of two fractions. The back half of one term matches the front half of the next, so they cancel. After the erasing, only the opening 1 remains. The tail shrinks away to nothing. So the total is exactly 1.

For example, climb one step of a 🪜 staircase and step back down: you are where you started. Chain these ups and downs together and only the starting and ending positions count.`,
      },
      tex: [
        String.raw`\sum_{n=1}^{\infty}\frac{1}{n(n+1)}=1`,
        String.raw`\frac{1}{n(n+1)}=\frac{1}{n}-\frac{1}{n+1}`,
      ],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 24, step: 1, init: 10 }],
problems: telescopingProblems,
    },
    {
      id: 'geometric',
      title: { ko: '기하급수: 정사각형 채우기', en: 'Geometric Series: Filling the Square' },
      order: 12,
      summary: {
        ko: String.raw`단위 정사각형을 남은 부분의 절반씩 채워 나가는 장면입니다. 빈틈이 매 단계 절반으로 줄어 합이 1이 됩니다.

절반을 칠하고 남은 것의 절반을 또 칠합니다. 칠한 넓이는 점점 1에 가까워집니다. 빈틈이 아무리 작아져도 완전한 1까지 한 걸음이 남습니다. 부분합으로 보면 그 한 걸음이 계속 절반으로 줄 뿐입니다. 무한히 더하면 정확히 1이 됩니다.

예를 들면, 🍰 케이크의 절반을 먹고 남은 것의 절반을 또 먹습니다. 먹는 양은 2분의 1, 4분의 1, 8분의 1로 줄지만 다 합치면 케이크 한 개에 가까워집니다.`,
        en: String.raw`A unit square gets filled by always taking half of what remains. The gap halves at every step and the total becomes 1.

Paint half, then paint half of the rest. The painted area creeps closer and closer to 1. However small the gap gets, one step always remains. In partial sums, that leftover step just keeps halving. Added forever, the pieces make exactly 1.

For example, eat half of a 🍰 cake, then half of what is left. The bites go one half, one quarter, one eighth, yet together they approach the whole cake.`,
      },
      tex: [String.raw`\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots=1`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 단계 n', en: 'Subdivision steps n' }, min: 1, max: 12, step: 1, init: 6 }],
problems: geometricProblems,
    },
    {
      id: 'wallis',
      title: { ko: '월리스 곱', en: 'Wallis Product' },
      order: 13,
      summary: {
        ko: String.raw`유리수 인자를 하나씩 곱해 나가는 장면입니다. 실행 곱이 한 값 위아래로 흔들리며 조여듭니다.

실행 곱은 목표를 번갈아 넘고 밑돕니다. 흔들리는 폭은 인자가 쌓일수록 줄어듭니다. 그래서 곱은 하나의 값으로 모여듭니다. 그 값이 원주율을 2로 나눈 것이라는 점이 이 식의 놀라움입니다.

예를 들면, 🚗 자동차가 차선 한가운데로 들어갈 때 핸들을 좌우로 조금씩 고칩니다. 고치는 폭이 점점 줄어들며 차는 가운데로 안정됩니다.`,
        en: String.raw`Rational factors get multiplied in one at a time here. The running product swings around one value, tightening as it goes.

The running product alternates above and below its target. The swings shrink as more factors pile in. So the product settles onto a single value. The surprise is that this value is π divided by 2.

For example, a 🚗 car eases into the center of its lane with small steering corrections to the left and right. Each correction is smaller than the last, and the car steadies in the middle.`,
      },
      tex: [String.raw`\frac{\pi}{2}=\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '인수 쌍의 수 n', en: 'Factor pairs n' }, min: 1, max: 40, step: 1, init: 12 }],
problems: wallisProblems,
    },
    {
      id: 'stirling',
      title: { ko: '스털링 근사', en: "Stirling's Approximation" },
      order: 14,
      summary: {
        ko: String.raw`엄청나게 커지는 팩토리얼을 간단한 식으로 짐작하는 장면입니다. 로그 눈금에서는 두 곡선이 거의 겹칩니다.

팩토리얼은 직접 계산하기엔 너무 빨리 커집니다. 근사식은 그 성장 속도를 거의 그대로 따라갑니다. 상대오차는 항이 커질수록 작아집니다. 대략 항 수의 열두 배로 나눈 만큼씩 줄어듭니다. 원주율이 들어오는 경로는 아이디어 수준에서만 짚습니다.

예를 들면, 🏢 건물의 높이를 걸음 수로 짐작해 봅니다. 건물이 클수록 한 걸음의 어긋남이 전체에서 차지하는 비중은 작아집니다. 근사가 큰 수에서 정확해지는 이유입니다.`,
        en: String.raw`A fast-growing factorial gets guessed by one simple formula here. On a log scale, the two curves nearly coincide.

Factorials grow too fast to keep computing head-on. The approximation tracks that growth almost exactly. Its relative error shrinks as the terms grow. Roughly, it falls like 1 over 12 times the index. Where π enters is only sketched at the idea level.

For example, guess a tall 🏢 building's height by counting steps. The taller the building, the smaller the share of one step's error in the whole. That is why the approximation sharpens for large numbers.`,
      },
      tex: [String.raw`n!\approx\sqrt{2\pi n}\left(\frac{n}{e}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 20 }],
problems: stirlingProblems,
    },
    {
      id: 'grandi',
      title: { ko: '그란디 급수', en: 'Grandi Series' },
      order: 15,
      summary: {
        ko: String.raw`부분합이 1과 0을 영원히 오가는 장면입니다. 그래서 이 급수에는 합이 없습니다.

항을 하나 더하면 합이 1에서 0으로, 다시 1로 뒤집힙니다. 어느 한 값에 안착하지 않으니 수렴이 아닙니다. 사람들이 말하는 2분의 1은 부분합들의 평균일 뿐입니다. 평균이 있다고 해서 합이 있는 것은 아닙니다.

예를 들면, 🍬 사탕 한 개를 손에 쥐었다 내려놓기를 끝없이 반복합니다. 쥔 상태와 내려놓은 상태가 번갈아 와서 사탕이 있다고도 없다고도 정할 수 없습니다.`,
        en: String.raw`The partial sums bounce between 1 and 0 forever in this scene. So this series has no sum.

Add one term and the total flips from 1 to 0, then back to 1. It never settles on one value, so it does not converge. The famous one half is only the average of the partial sums. Having an average is not the same as having a sum.

For example, pick up one 🍬 candy and put it down, over and over without end. Holding and not holding alternate forever, so you cannot say the candy is simply there.`,
      },
      tex: [String.raw`1-1+1-1+\cdots\quad\text{diverges}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 16 }],
problems: grandiProblems,
    },
    {
      id: 'dirichlet-test',
      title: { ko: '디리클레 판정법', en: "Dirichlet's Test" },
      order: 16,
      summary: {
        ko: String.raw`흔들리는 급수를 가라앉는 가중치로 길들이는 장면입니다. 두 재료가 만나 수렴을 만듭니다.

사인 항들의 부분합은 이리저리 흔들리지만 일정한 울타리 안에 갇혀 있습니다. 거기에 0으로 가라앉는 가중치를 곱합니다. 흔들림의 폭이 점점 눌리면서 급수가 수렴합니다. 판정법의 정확한 조건은 아래 식과 같습니다.

예를 들면, ⚽ 공이 울타리 안에서만 이리저리 튑니다. 밀어 주는 힘이 점점 약해지면 공의 움직임도 잦아들어 한곳에 모입니다.`,
        en: String.raw`A wobbling series gets tamed by a sinking weight in this scene. Two ingredients meet and produce convergence.

The partial sums of the sine terms wobble around but stay trapped inside a fixed fence. Multiply them by weights that sink to 0. The wobble gets pressed flatter and flatter until the series converges. The test's exact conditions are in the formulas below.

For example, a ⚽ ball bounces around inside a fence and never escapes. Push it more and more gently, and its wandering dies down until it settles.`,
      },
      tex: [
        String.raw`\sum_{k=1}^{N}\sin(kx) = \frac{\sin\frac{Nx}{2}\,\sin\frac{(N+1)x}{2}}{\sin\frac{x}{2}},\quad \left|\sum_{k=1}^{N}\sin(kx)\right| \le \frac{1}{|\sin(x/2)|}`,
        String.raw`\sum_{n=1}^{\infty}\frac{\sin(nx)}{n} = \frac{\pi-x}{2},\quad x \in (0, 2\pi)`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'slider', key: 'terms', label: { ko: '부분합 항 수', en: 'Partial sum terms' }, min: 1, max: 80, step: 1, init: 30 },
        { kind: 'slider', key: 'x', label: { ko: 'x 값', en: 'x value' }, min: 0.2, max: 3.0, step: 0.01, init: 1.0 },
      ],
      problems: dirichletTestProblems,
    },
    {
      id: 'abel-test',
      title: { ko: '아벨 판정법', en: "Abel's Test" },
      order: 17,
      summary: {
        ko: String.raw`수렴하는 급수에 단조로운 가중치를 곱해도 수렴이 유지되는 장면입니다. 디리클레 판정법의 짝꿍입니다.

가중치 수열은 한 방향으로만 움직이고 유계이면 됩니다. 0으로 가지 않아도 된다는 점이 디리클레 판정법과 다릅니다. 비결은 곱의 합을 부분합과 가중치의 차이로 바꿔 쓰는 것입니다. 가중치의 작은 걸음들이 통제 아래 쌓입니다.

예를 들면, 🏪 가게가 물건값을 매일 조금씩 한 방향으로만 올립니다. 팔린 양의 누적합이 이미 안정돼 있으면 매출의 누적합도 함께 안정됩니다.`,
        en: String.raw`A convergent series stays convergent when multiplied by a monotone weight here. This test is the companion of Dirichlet's test.

The weight sequence only needs to move in one direction and stay bounded. Unlike in Dirichlet's test, it does not have to tend to 0. The secret is rewriting the product sum using partial sums and weight differences. The weight's small steps then pile up under control.

For example, a 🏪 shop nudges its prices in one direction only, a little each day. If the running total of items sold has already settled, the running revenue settles along with it.`,
      },
      tex: [
        String.raw`\sum a_n\ \text{converges},\ (b_n)\ \text{monotone bounded}\ \Rightarrow\ \sum a_n b_n\ \text{converges}`,
        String.raw`\sum_{k=m}^{n}a_k b_k = A_n b_{n+1} - A_{m-1}b_m + \sum_{k=m}^{n}A_k(b_k-b_{k+1})`,
      ],
      prerequisites: ['dirichlet-test'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['shifted', 'scaled'], init: 'shifted' },
        { kind: 'slider', key: 'n', label: { ko: '부분합 항 수', en: 'Partial sum terms' }, min: 10, max: 500, step: 10, init: 120 },
      ],
problems: abelTestProblems,
    },
    {
      id: 'double-series',
      title: { ko: '이중급수와 푸비니', en: 'Double Series and Fubini' },
      order: 18,
      summary: {
        ko: String.raw`격자의 수들을 행으로 더하든 열로 더하든 해 보는 장면입니다. 절댓값이 수렴하면 두 답이 같습니다.

가로줄부터 합산해도 세로줄부터 합산해도 결과는 하나입니다. 순서를 바꿔도 답이 같은 이유는 절댓값의 합이 유한하기 때문입니다. 조건부로만 수렴하면 순서를 바꾸는 순간 답도 바뀝니다. 대표 예의 값은 아래 두 번째 식과 같습니다.

예를 들면, 📦 상자를 격자로 쌓고 각 상자에 든 물건의 수를 셉니다. 가로줄씩 세어 더하나 세로줄씩 세어 더하나 전체 개수는 똑같습니다.`,
        en: String.raw`Numbers on a grid get summed by rows first, then by columns, in this scene. With absolute convergence, the two answers agree.

Add along the rows or down the columns: the result is one and the same. The order cannot change it because the absolute values sum to a finite total. With only conditional convergence, swapping the order changes the answer itself. The headline value is the second formula below.

For example, stack 📦 boxes in a grid and count the items inside each box. Count row by row or column by column — the total count comes out identical.`,
      },
      tex: [
        String.raw`\sum_{m}\sum_{n} a_{m,n} = \sum_{n}\sum_{m} a_{m,n} = \sup_{\text{finite } F} \sum_{F} a_{m,n}`,
        String.raw`\sum_{m,n \ge 1} \frac{1}{m^2n^2} = \frac{\pi^4}{36} \approx 2.7058`,
      ],
      prerequisites: ['tests'],
      controls: [
        { kind: 'slider', key: 'N', label: { ko: '격자 크기 N', en: 'Grid size N' }, min: 2, max: 8, step: 1, init: 5 },
        {
          kind: 'select',
          key: 'series',
          label: { ko: '급수', en: 'Series' },
          options: ['1/(m^2 n^2)', '(-1)^(m+n)/(m^2 n^2)'],
          init: '1/(m^2 n^2)',
        },
      ],
      problems: doubleSeriesProblems,
    },
  ],
};
