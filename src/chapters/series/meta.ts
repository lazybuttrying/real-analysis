import type { ChapterMeta } from '../../contracts.ts';
import { condensationProblems } from './problems/condensation';
import { eulerMascheroniProblems } from './problems/euler-mascheroni';
import { eulerProductProblems } from './problems/euler-product';
import { kummerTestProblems } from './problems/kummer-test';
import { problems as abelTestProblems } from './problems/abel-test';
import { problems as baselProblems } from './problems/basel';
import { problems as dirichletTestProblems } from './problems/dirichlet-test';
import { problems as geometricProblems } from './problems/geometric';
import { problems as grandiProblems } from './problems/grandi';
import { problems as harmonicProblems } from './problems/harmonic';
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
  scenes: [
    {
      id: 'harmonic',
      title: { ko: '조화급수의 발산', en: 'The Harmonic Series Diverges' },
      order: 1,
      summary: {
        ko: String.raw`부분합 \(S_n\)이 \(\ln n + \gamma\)를 따라 아주 느리게, 그러나 끝없이 커지는 모습을 확인합니다.`,
        en: String.raw`The partial sums \(S_n\) follow \(\ln n + \gamma\) upward — very slowly, but without end.`,
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
        ko: String.raw`조화수 \(H_n\)은 \(\ln n\)처럼 발산하지만, 그 차이 \(\gamma_n = H_n - \ln n\)은 \(\gamma \approx 0.5772\)로 수렴합니다 — 수렴하는 급수 \(\sum (\frac1n - \ln(1+\frac1n))\)가 그 비밀입니다.`,
        en: String.raw`The harmonic numbers \(H_n\) diverge like \(\ln n\), but their gap \(\gamma_n = H_n - \ln n\) settles at \(\gamma \approx 0.5772\) — the secret is the convergent series \(\sum (\frac1n - \ln(1+\frac1n))\).`,
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
        ko: String.raw`항 \(\frac{1}{n^2}\)을 3차원 막대로 쌓고 부분합의 계단이 \(\frac{\pi^2}{6}\) 평면에 닿지 못한 채 다가가는 모습을 확인합니다. \(\pi\)가 왜 등장하는지는 아이디어 수준에서만 짚습니다.`,
        en: String.raw`Stack the terms \(\frac{1}{n^2}\) as 3D bars and watch the staircase of partial sums approach the plane at \(\frac{\pi^2}{6}\) without ever touching it. Why \(\pi\) appears at all is only sketched at the idea level.`,
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
        ko: String.raw`\(\zeta(s) = \sum_{n\ge 1} n^{-s}\)에 \((1-2^{-s})\)를 곱하면 짝수 항이 사라지고, \((1-3^{-s})\)를 곱하면 3의 배수가 사라집니다 — 체로 걸러내면 남는 것은 소수 위의 곱 \(\prod_p (1-p^{-s})^{-1}\)뿐입니다. 처음 \(k\)개 소수의 부분 곱이 \(\zeta(2) = \pi^2/6\)에 다가가는 모습을 확인합니다.`,
        en: String.raw`Multiplying \(\zeta(s) = \sum_{n\ge 1} n^{-s}\) by \((1-2^{-s})\) sieves out the even terms, then \((1-3^{-s})\) removes multiples of 3 — sieving leaves only the product over primes \(\prod_p (1-p^{-s})^{-1}\). Watch the partial product over the first \(k\) primes approach \(\zeta(2) = \pi^2/6\).`,
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
        ko: String.raw`부분합이 \(\frac{\pi}{4}\)를 번갈아 넘고 밑돌며 조여드는 모습을 확인합니다. 이웃한 두 부분합 사이의 간격이 곧 오차의 상한입니다.`,
        en: String.raw`The partial sums overshoot and undershoot \(\frac{\pi}{4}\) in turn, closing in from both sides. The gap between two neighboring partial sums is exactly the error bound.`,
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
        ko: String.raw`비율 \(r_k = a_{k+1}/a_k\)가 극한 \(L < 1\)로 모이면 급수가 수렴합니다 — 두 급수에서 비율이 \(0\)과 \(\frac{1}{2}\)로 내려가는 모습을, 비교 판정법에서는 \(\frac{1}{k^2+1}\)이 \(\frac{1}{k^2}\) 아래에 깔리는 모습을 확인합니다.`,
        en: String.raw`When the ratio \(r_k = a_{k+1}/a_k\) settles to a limit \(L < 1\), the series converges — watch the ratios dive to \(0\) and \(\frac{1}{2}\) in two series, and \(\frac{1}{k^2+1}\) tuck itself under \(\frac{1}{k^2}\) for the comparison test.`,
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
      id: 'raabe-test',
      title: { ko: '라베 판정법', en: "Raabe's Test" },
      order: 7,
      summary: {
        ko: String.raw`비율이 1로 가서 비율 판정법이 항복할 때, 한 단계 더 깊이 본 양 \(R_n = n(a_n/a_{n+1} - 1)\)이 1 위/아래 어디에 안착하는지로 수렴을 가릅니다.`,
        en: String.raw`When the ratio drifts to 1 and the ratio test surrenders, the finer quantity \(R_n = n(a_n/a_{n+1} - 1)\) settles above or below 1 and decides convergence.`,
      },
      tex: [
        String.raw`L=\\lim_{n\\to\\infty}n\\left(\\frac{a_n}{a_{n+1}}-1\\right)`,
        String.raw`L>1\\Rightarrow\\sum a_n\\ \\text{converges},\\quad L<1\\Rightarrow\\ \text{diverges}`,
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
      order: 8,
      summary: {
        ko: String.raw`양의 보조수열 \((p_n)\)로 비율을 가중하면 \(K_n = p_n\frac{a_n}{a_{n+1}} - p_{n+1}\)이 0 위/아래 어디에 머무는지로 수렴을 가릅니다. \(p_n = 1\)이면 비율 판정법, \(p_n = n\)이면 라베 판정법이 됩니다.`,
        en: String.raw`Weighting the ratio by a positive auxiliary sequence \((p_n)\), the sign of \(K_n = p_n\frac{a_n}{a_{n+1}} - p_{n+1}\) decides convergence. \(p_n = 1\) recovers the ratio test, \(p_n = n\) recovers Raabe's test.`,
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
      order: 9,
      summary: {
        ko: String.raw`\(a_n\)의 항들을 \([2^n, 2^{n+1})\) 블록으로 묶어 보세요 — 블록 합이 응축 항 \(2^n a_{2^n}\) 사이에 끼면서, 원래 급수와 응축된 급수가 운명을 같이합니다.`,
        en: String.raw`Group the terms \(a_n\) into blocks \([2^n, 2^{n+1})\): each block sum is sandwiched between condensed terms \(2^n a_{2^n}\), so the original and condensed series share their fate.`,
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
      order: 10,
      summary: {
        ko: String.raw`각 항을 \(\frac{1}{n} - \frac{1}{n+1}\)로 쪼개면 이웃끼리 서로 지워지고 처음의 1과 사라져 가는 꼬리만 남는 모습을 확인합니다.`,
        en: String.raw`Split each term into \(\frac{1}{n} - \frac{1}{n+1}\) and the neighbors cancel each other, leaving only the very first 1 and a vanishing tail.`,
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
      order: 11,
      summary: {
        ko: '단위 정사각형을 남은 부분의 절반씩 채워 나가면 빈틈이 매 단계 절반으로 줄며 합이 1이 되는 모습을 확인합니다.',
        en: 'Fill a unit square by always taking half of what remains: the gap halves at every step and the total becomes 1.',
      },
      tex: [String.raw`\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots=1`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '분할 단계 n', en: 'Subdivision steps n' }, min: 1, max: 12, step: 1, init: 6 }],
problems: geometricProblems,
    },
    {
      id: 'wallis',
      title: { ko: '월리스 곱', en: 'Wallis Product' },
      order: 12,
      summary: {
        ko: String.raw`유리수 인수들을 하나씩 곱해 나갈수록 실행 곱이 \(\frac{\pi}{2}\) 위아래로 흔들리며 조여드는 모습을 확인합니다.`,
        en: String.raw`Multiply the rational factors in one at a time and watch the running product swing above and below \(\frac{\pi}{2}\), closing in as the swings shrink.`,
      },
      tex: [String.raw`\frac{\pi}{2}=\prod_{n=1}^{\infty}\frac{(2n)^2}{(2n-1)(2n+1)}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '인수 쌍의 수 n', en: 'Factor pairs n' }, min: 1, max: 40, step: 1, init: 12 }],
problems: wallisProblems,
    },
    {
      id: 'stirling',
      title: { ko: '스털링 근사', en: "Stirling's Approximation" },
      order: 13,
      summary: {
        ko: String.raw`로그 눈금에서 \(n!\)와 스털링 근사가 거의 겹쳐지고 상대오차가 대략 \(\frac{1}{12n}\)으로 줄어드는 모습을 확인합니다. \(\pi\)가 들어오는 경로는 아이디어 수준에서만 짚습니다.`,
        en: String.raw`On a log scale, \(n!\) and the Stirling approximation nearly coincide, and the relative error shrinks like \(\frac{1}{12n}\). Where \(\pi\) enters is only sketched at the idea level.`,
      },
      tex: [String.raw`n!\approx\sqrt{2\pi n}\left(\frac{n}{e}\right)^n`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: 'n', en: 'n' }, min: 1, max: 60, step: 1, init: 20 }],
problems: stirlingProblems,
    },
    {
      id: 'grandi',
      title: { ko: '그란디 급수', en: 'Grandi Series' },
      order: 14,
      summary: {
        ko: String.raw`부분합이 1과 0을 영원히 오가므로 이 급수에는 합이 없습니다. \(\frac{1}{2}\)는 부분합들의 평균(체사로 평균)일 뿐, 급수의 합이 아닙니다.`,
        en: String.raw`The partial sums bounce between 1 and 0 forever, so this series has no sum. \(\frac{1}{2}\) is only the average of the partial sums (the Cesàro mean), not a sum of the series.`,
      },
      tex: [String.raw`1-1+1-1+\cdots\quad\text{diverges}`],
      controls: [{ kind: 'slider', key: 'n', label: { ko: '항의 수 n', en: 'Number of terms n' }, min: 1, max: 40, step: 1, init: 16 }],
problems: grandiProblems,
    },
    {
      id: 'dirichlet-test',
      title: { ko: '디리클레 판정법', en: "Dirichlet's Test" },
      order: 15,
      summary: {
        ko: String.raw`부분합이 \(1/|\sin(x/2)|\) 안에 갇혀 흔들리는 \(\sin(kx)\)와 \(0\)으로 가라앉는 \(1/n\)이 만나 \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\)이 수렴합니다 — 디리클레 판정법.`,
        en: String.raw`The partial sums of \(\sin(kx)\) wobble, trapped inside \(1/|\sin(x/2)|\), and the \(1/n\) weight sinking to \(0\) tames them into the convergent series \(\sum_{n=1}^{\infty} \frac{\sin(nx)}{n}\) — Dirichlet's test.`,
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
      order: 16,
      summary: {
        ko: String.raw`\\(\\sum a_n\\)이 수렴하고 \\((b_n)\\)이 단조·유계이면 \\(\\sum a_n b_n\\)도 수렴합니다 — 디리클레 판정법의 짝꿍. \\((b_n)\\)이 0으로 가지 않아도 된다는 점이 다릅니다.`,
        en: String.raw`If \\(\\sum a_n\\) converges and \\((b_n)\\) is monotone and bounded, then \\(\\sum a_n b_n\\) converges — the companion to Dirichlet's test. The difference: \\((b_n)\\) need not tend to 0.`,
      },
      tex: [
        String.raw`\\sum a_n\\ \\text{converges},\\ (b_n)\\ \\text{monotone bounded}\\ \\Rightarrow\\ \\sum a_n b_n\\ \\text{converges}`,
        String.raw`\\sum_{k=m}^{n}a_k b_k = A_n b_{n+1} - A_{m-1}b_m + \\sum_{k=m}^{n}A_k(b_k-b_{k+1})`,
      ],
      prerequisites: ['dirichlet-test'],
      controls: [
        { kind: 'select', key: 'example', label: { ko: '예제', en: 'Example' }, options: ['shifted', 'scaled'], init: 'shifted' },
        { kind: 'slider', key: 'n', label: { ko: '부분합 항 수', en: 'Partial sum terms' }, min: 10, max: 500, step: 10, init: 120 },
      ],
problems: abelTestProblems,
    },
  ],
};
